// Import express, express-handlebars, mongodb NodeJS modules.
import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

// Import environment variables from .env file. and fs module.
import 'dotenv/config';
import fs from 'fs';

// Import functions from other local files.
import * as helpers from './helpers.js';
import { User } from './model/schemas.js';
import { Post } from './model/schemas.js';
import { Comment } from './model/schemas.js';

mongoose.connect(process.env.MONGODB_URI + process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Error connecting to MongoDB! Error Details:', err));

// Maps data types to their corresponding models.
const modelMap = {
  user: User,
  post: Post,
  comment: Comment,
};

// Creates an  instance of the express app.
const app = express();

// This function imports the data from the a file into the database.
async function importData(data) {
  try {
    // Declaration of the data to be manipulated.
    const collectionName = data + "s";
    const dataToParse = fs.readFileSync('public/JSONs/' + data + 's.json');
    const jsonData = JSON.parse(dataToParse);
    const model = modelMap[data];

    for (const doc of jsonData) {
      try {
        // Convert the '_id' field to the correct format (string representation of 'ObjectId')
        if (doc._id && doc._id['$oid']) {
          doc._id = doc._id['$oid'];
        }

        // Check if a document with the same "data_id" already exists in the collection
        const existingDoc = await model.findOne({ [`${data}_id`]: doc[`${data}_id`] });

        if (!existingDoc) {
          // If the document with the same "data_id" doesn't exist, create a new document using the Mongoose model
          const result = await model.create(doc);
          console.log(`${data} with id ${doc[`${data}_id`]} inserted.`);
        } else {
          console.log(`${data} with id ${doc[`${data}_id`]} already exists. Skipping insertion.`);
        }
      } catch (error) {
        // Check if the error is a duplicate key error (error code 11000)
        if (error.code === 11000) {
          console.log(`${data} with id ${doc[`${data}_id`]} already exists. Skipping insertion.`);
        } else {
          // If it's another type of error, log the error message
          console.error(`Error inserting ${data} with id ${doc[`${data}_id`]}: ${error.message}`);
        }
      }
    }
    console.log(`${data}s import complete.`);
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// The body of the code, put inside an async to allow for async manipulation of the db.
(async () => {
  try {

    // Waits for the data to be imported before starting the Express server.
    // As of now it only imports the data for posts and users.
    await mongoose.connection.dropDatabase();
    await importData('user');
    await importData('post');
    await importData('comment');

    let currentUser = await User.findOne({ username: 'u/shellyace' }).populate('postsMade');

    // Start the Express server after importing the data
    app.engine('hbs', exphbs.engine({
      extname: "hbs",
      defaultLayout: "main",
      helpers: {
        capitalize: function (string) {
          return string.toUpperCase();
        },
        substring: helpers.substring.apply,
        isEqual: helpers.isEqual,
        getUpvoteStatus: helpers.getUpvoteStatus,
        getDownvoteStatus: helpers.getDownvoteStatus,
        getSaveStatus: helpers.getSaveStatus,
        log: function (context) {
          // Get the name of the current context
          const contextName = this.name || "Unknown Context";

          // Log the context name and value
          console.log(`Context Name: ${contextName}`);
          console.log(context);
        }
      },
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
      },
    }));

    // The following lines of code set up the Express server and handlebars.
    app.use("/static", express.static("public"));
    app.use(express.json());
    app.set("view engine", "hbs");
    app.set("views", "./views");

    // This route renders the home page.
    app.get("/", async (req, res) => {
      try {
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy');
        const users = await User.find().populate('postsMade').populate('commentsMade').populate('upvotedPosts').populate('downvotedPosts');

        const upvoteStatusArray = posts.map(post => ({
          post: post,
          upvoteStatus: post.upvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        const downvoteStatusArray = posts.map(post => ({
          post: post,
          downvoteStatus: post.downvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        const saveStatusArray = posts.map(post => ({
          post: post,
          saveStatus: post.savedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        upvoteStatusArray.sort((post1, post2) => post2.post.voteCtr - post1.post.voteCtr);
        downvoteStatusArray.sort((post1, post2) => post2.post.voteCtr - post1.post.voteCtr);
        saveStatusArray.sort((post1, post2) => post2.post.voteCtr - post1.post.voteCtr);
        posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

        const topusers = users.map(user => {
          const contributions = user.postsMade.length + user.commentsMade.length + user.upvotedPosts.length + user.downvotedPosts.length;
          return { ...user.toObject(), contributions: contributions || 0 };
        });

        // Get the top 3 users
        topusers.sort((user1, user2) => user2.contributions - user1.contributions);
        const top3users = topusers.slice(0, 3);

        res.render("index", {
          title: 'Home',
          posts: posts,
          toppost: posts[0],
          topusers: top3users,
          currentUser: currentUser,
          upvoteStatusArray: upvoteStatusArray,
          downvoteStatusArray: downvoteStatusArray,
          saveStatusArray: saveStatusArray
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the view page.
    app.get("/view/:post_id", async (req, res) => {
      try {
        const post_id = req.params.post_id;
        const posts = await Post.find()
          .populate('author')
          .populate({
            path: 'comments',
            populate: {
              path: 'author',
              model: 'User',
              select: 'username profile_pic' // Only populate the 'username' field of the User document
            }
          });

        const upvoteStatus = posts[post_id].upvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0;
        const downvoteStatus = posts[post_id].downvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0;
        const saveStatus = posts[post_id].savedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0;

        res.render("view", {
          title: posts[post_id].title,
          post: posts[post_id],
          currentUser: currentUser,
          upvoteStatus: upvoteStatus,
          downvoteStatus: downvoteStatus,
          saveStatus: saveStatus
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the main-profile page.
    app.get("/main-profile", async (req, res) => {
      try {
        const filters = ['Posts', 'Comments', 'Upvoted', 'Downvoted', 'Saved'];
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy').lean();
        const user = await User.findOne({ username: currentUser.username })
          .populate('postsMade')
          .populate({
            path: 'postsMade',
            populate: {
              path: 'author',
              model: 'User',
              select: 'username'
            }
          });

        const comments = await Comment.find()
          .populate('author')
          .populate({
            path: 'parentPost',
            populate: {
              path: 'author',
              model: 'User',
              select: 'username title',
            }
          });

        const filtered_postMade = [];
        const filtered_comments = comments.filter(comment => comment.author.username.toLowerCase().includes(currentUser.username));
        var filtered_upvoted = [];
        var filtered_downvoted = [];
        var filtered_saved = [];

        for (var i = 0; i < user.postsMade.length; i++) {
          const found_post = posts.find(post => post._id.toString() === user.postsMade[i].toString());
          if (found_post) {
            filtered_postMade.push(found_post);
          }
          console.log(found_post);
        }

        for (var i = 0; i < user.upvotedPosts.length; i++) {
          const found_post = posts.find(post => post._id.toString() === user.upvotedPosts[i].toString());
          if (found_post) {
            filtered_upvoted.push(found_post);
          }
        }
        for (var i = 0; i < user.downvotedPosts.length; i++) {
          const found_post = posts.find(post => post._id.toString() === user.downvotedPosts[i].toString());
          if (found_post) {
            filtered_downvoted.push(found_post);
          }
        }
        for (var i = 0; i < user.savedPosts.length; i++) {
          const found_post = posts.find(post => post._id.toString() === user.savedPosts[i].toString());
          if (found_post) {
            filtered_saved.push(found_post);
          }
        }
        const upvoteStatusArray = filtered_upvoted.map(post => ({
          post: post,
          upvoteStatus: post.upvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        const downvoteStatusArray = posts.map(post => ({
          post: post,
          downvoteStatus: post.downvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        const saveStatusArray = posts.map(post => ({
          post: post,
          saveStatus: post.savedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        res.render("main-profile", {
          title: "My Profile",
          user: user,
          postsMade: filtered_postMade,
          comments: filtered_comments,
          upvoted: filtered_upvoted,
          downvoted: filtered_downvoted,
          saved: filtered_saved,
          filters: filters,
          currentUser: currentUser,
          upvoteStatusArray: upvoteStatusArray,
          downvoteStatusArray: downvoteStatusArray,
          saveStatusArray: saveStatusArray
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the edit profile page.
    app.get("/edit", async (req, res) => {
      try {
        const user = await User.findOne({ username: currentUser.username });

        res.render("edit", {
          title: "Edit Profile",
          user: user,
          currentUser: currentUser
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route allows the profile to be edited
    app.put("/edit-profile", async (req, res) => {
      try {
        const user = await User.findOne({ username: currentUser.username });
        const { name, bio } = req.body;

        user.name = name;
        user.bio = bio;

        await user.save();

        res.status(200).json({ message: "Edited profile successfully" });
      } catch (error) {
        console.error("Error editing profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the non main profile page.
    app.get("/profile/:name", async (req, res) => {
      try {
        const name = req.params.name;
        const filters = ['Posts', 'Comments'];
        const users = await User.find().populate('postsMade');
        let userProfile = users.filter(user => user.name.includes(name));
        userProfile[0].populate('postsMade');
        const comments = await Comment.find()
          .populate('author')
          .populate({
            path: 'parentPost',
            populate: {
              path: 'author',
              model: 'User',
              select: 'username title'
            }
          });

        if (currentUser.username === userProfile[0].username) {
          res.redirect('/main-profile');
        } else {
          const filtered_comments = comments.filter(comment => comment.author.username.toLowerCase().includes(userProfile[0].username));

          for (var i = 0; i < userProfile[0].postsMade.length; i++) {
            const found_post = posts.find(post => post._id.toString() === user.postsMade[i].toString());
            if (found_post) {
              filtered_postMade.push(found_post);
            }
            console.log(found_post);
          }

          const upvoteStatusArray = posts.map(post => ({
            post: post,
            upvoteStatus: post.upvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
          }));

          const downvoteStatusArray = posts.map(post => ({
            post: post,
            downvoteStatus: post.downvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
          }));

          const saveStatusArray = posts.map(post => ({
            post: post,
            saveStatus: post.savedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
          }));


          res.render("profile", {
            title: userProfile[0].name,
            user: userProfile[0],
            comments: filtered_comments,
            filters: filters,
            currentUser: currentUser,
            upvoteStatusArray: upvoteStatusArray,
            downvoteStatusArray: downvoteStatusArray,
            saveStatusArray: saveStatusArray
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the search page.
    app.get("/search/:query", async (req, res) => {
      try {
        const query = req.params.query;
        const search_filters = ['Posts', 'Comments', 'Users'];
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy');
        const comments = await Comment.find()
          .populate('author')
          .populate({
            path: 'parentPost',
            populate: {
              path: 'author',
              model: 'User',
              select: 'username title post_id name'
            }
          });
        const users = await User.find().populate('postsMade').populate('commentsMade').populate('upvotedPosts').populate('downvotedPosts');

        const search = query.toLowerCase();

        const filtered_posts = posts.filter(post => post.title.toLowerCase().includes(search)
          || post.content.toLowerCase().includes(search)
          || post.author.username.toLowerCase().includes(search));

        const filtered_comments = comments.filter(comment => comment.content.toLowerCase().includes(search)
          || comment.author.username.toLowerCase().includes(search)
          || comment.parentPost.title.toLowerCase().includes(search)
          || comment.parentPost.author.username.toLowerCase().includes(search));

        const filtered_users = users.filter(user => user.username.toLowerCase().includes(search)
          || user.name.toLowerCase().includes(search));

        const filter_users = filtered_users.map(user => {
          const contributions = user.postsMade.length + user.commentsMade.length + user.upvotedPosts.length + user.downvotedPosts.length;
          return { ...user.toObject(), contributions: contributions || 0 };
        });

        const upvoteStatusArray = filtered_posts.map(post => ({
          post: post,
          upvoteStatus: post.upvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        const downvoteStatusArray = filtered_posts.map(post => ({
          post: post,
          downvoteStatus: post.downvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        const saveStatusArray = filtered_posts.map(post => ({
          post: post,
          saveStatus: post.savedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0
        }));

        res.render("search", {
          title: "Search",
          query: query,
          search_filters: search_filters,
          posts: filtered_posts,
          comments: filtered_comments,
          users: filter_users,
          currentUser: currentUser,
          upvoteStatusArray: upvoteStatusArray,
          downvoteStatusArray: downvoteStatusArray,
          saveStatusArray: saveStatusArray
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get('/register', (req, res) => {
      res.render('register', {
        noLayout: true
      });
    });

    app.get('/signin', (req, res) => {
      res.render('signin', {
        noLayout: true
      });
    });

    // This route renders the anime page
    app.get('/anime', async (req, res) => {
      const users = await User.find().populate('postsMade').populate('commentsMade').populate('upvotedPosts').populate('downvotedPosts');
      const posts = await Post.find().populate('author');
      posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

      const topusers = users.map(user => {
        const contributions = user.postsMade.length + user.commentsMade.length + user.upvotedPosts.length + user.downvotedPosts.length;
        return { ...user.toObject(), contributions: contributions || 0 };
      });

      // Get the top 3 users
      topusers.sort((user1, user2) => user2.contributions - user1.contributions);
      const top3users = topusers.slice(0, 3);

      res.render('anime', {
        title: 'Anime',
        toppost: posts[0],
        topusers: top3users,
        currentUser: currentUser
      });
    });

    // This route renders the games page
    app.get('/games', async (req, res) => {
      const users = await User.find().populate('postsMade').populate('commentsMade').populate('upvotedPosts').populate('downvotedPosts');
      const posts = await Post.find().populate('author');
      posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

      const topusers = users.map(user => {
        const contributions = user.postsMade.length + user.commentsMade.length + user.upvotedPosts.length + user.downvotedPosts.length;
        return { ...user.toObject(), contributions: contributions || 0 };
      });

      // Get the top 3 users
      topusers.sort((user1, user2) => user2.contributions - user1.contributions);
      const top3users = topusers.slice(0, 3);

      res.render('games', {
        title: 'Games',
        toppost: posts[0],
        topusers: top3users,
        currentUser: currentUser
      });
    });

    // This route renders the polls page
    app.get('/polls', async (req, res) => {
      res.render('polls', {
        title: 'Polls',
        currentUser: currentUser
      });
    });

    // This route renders the featured page
    app.get('/featured', async (req, res) => {
      try {
        const posts = await Post.find().populate('author').populate('comments').populate('upvotedBy').populate('downvotedBy').populate('savedBy');
        posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

        const randi = Math.floor(Math.random() * posts.length);
        console.log(randi);
        const upvoteStatus = posts[randi].upvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0;
        const downvoteStatus = posts[randi].downvotedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0;
        const saveStatus = posts[randi].savedBy.some(user => user._id.equals(currentUser._id)) ? 1 : 0;

        res.render('featured', {
          title: 'Featured',
          post: posts[randi],
          currentUser: currentUser,
          upvoteStatus: upvoteStatus,
          downvoteStatus: downvoteStatus,
          saveStatus: saveStatus
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the policy page
    app.get('/policy', async (req, res) => {
      res.render('policy', {
        title: 'Privacy Policy'
      });
    });
    // This route renders the wip page
    app.get('/wip', async (req, res) => {
      res.render('wip', {
        title: 'Work in Progress'
      });
    });
    // intercept all requests with the content-type, application/json
    app.use(express.json());

    // This route is used for creating posts.
    app.post("/post", async (req, res) => {
      try {
        const posts = await Post.find().populate('author');
        const users = await User.find().populate('postsMade');
        console.log("POST Request to /post received.");
        console.log(req.body);
        const { title, content, image } = req.body;
        if (title && content) {
          const newPost = {
            post_id: posts.length,
            title: title,
            author: currentUser._id,
            content: content,
            image: image,
            comments: [],
            voteCtr: 0,
            comCtr: 0,
            upvotedPost: [],
            downvotedPost: [],
            savedPost: [],
            __v: 0
          };
          const result = await Post.collection.insertOne(newPost);
          console.log("New post inserted with _id:", result.insertedId);

          const userIdToUpdate = currentUser._id;
          await User.updateOne(
            { _id: userIdToUpdate },
            { $push: { postsMade: result.insertedId } }
          );
          res.status(200).json({ post_id: newPost.post_id });
        }
        else {
          res.status(400);
          res.redirect("/error");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route is used for editing posts.
    app.put("/post/:post_id", async (req, res) => {
      try {
        const postIdToUpdate = parseInt(req.params.post_id);
        const posts = await Post.find().populate('author');
        const postToUpdate = posts.find(post => post.post_id === postIdToUpdate);

        if (!postToUpdate) {
          return res.status(404).json({ error: "Post not found" });
        }

        const { title, content, img } = req.body;

        // Update the properties of the post
        postToUpdate.title = title;
        postToUpdate.content = content;
        postToUpdate.image = img;
        postToUpdate.edited = true;

        await postToUpdate.save();

        res.status(200).json({ message: "Post updated successfully", edited: true });
      } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route is used for deleting a post.
    app.delete("/post/:post_id", async (req, res) => {
      try {
        const postIdToDelete = parseInt(req.params.post_id);
        const postToDelete = await Post.findOneAndDelete({ post_id: postIdToDelete });

        if (!postToDelete) {
          return res.status(404).json({ error: "Post not found" });
        }

        // Decrement the post_id of all posts with an id greater than the deleted post_id
        await Post.updateMany({ post_id: { $gt: postIdToDelete } }, { $inc: { post_id: -1 } });

        res.status(200).json({ message: "Post deleted successfully" });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route is used for creating comments.
    app.post("/comment", async (req, res) => {
      try {
        const posts = await Post.find();
        const comments = await Comment.find().populate('author');

        console.log("POST Request to /comment received.");
        const { content, post_id } = req.body;

        if (content && post_id) {

          const newComment = {
            author: currentUser._id,
            content: content,
            profpic: currentUser.profile_pic,
            comment_id: comments.length,
            parentPost: posts[post_id]._id,
            parentComment: null,
            reply: [],
            voteCtr: 0
          };

          const result = await Comment.collection.insertOne(newComment);
          console.log("New comment inserted with _id:", result.insertedId);

          const postIdToUpdate = posts[post_id]._id;
          const updatedPost = await Post.findOneAndUpdate(
            { _id: postIdToUpdate },
            {
              $push: { comments: result.insertedId }, // Add the new comment to the comments array
              $inc: { comCtr: 1 } // Increment the comCtr by 1
            },
            { new: true } // Return the updated document after the update is applied
          );
          res.status(200).json({ message: "Comment created successfully" });
        } else {
          res.status(400).json({ error: "Invalid content or post_id" });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.delete("/comment/:comment_id", async (req, res) => {
      try {
        const commentIdToDelete = parseInt(req.params.comment_id); // Convert comment_id to an integer
        const comments = await Comment.find().populate('parentPost').populate('parentComment');
        const commentToDelete = comments.find(comment => comment.comment_id === commentIdToDelete);

        if (!commentToDelete) {
          return res.status(404).json({ error: "Comment not found" });
        }

        const postIdToUpdate = commentToDelete.parentPost;
        const commentUID = commentToDelete._id;

        const result = await Comment.deleteOne({ comment_id: commentIdToDelete });
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postIdToUpdate },
          {
            $pull: { comments: commentUID }, // Remove the comment from the comments array
            $inc: { comCtr: -1 } // Decrement the comCtr by 1
          },
          { new: true } // Return the updated document after the update is applied
        );

        if (commentToDelete.parentComment) {
          const parentCommentIdToUpdate = commentToDelete.parentComment;
          await Comment.findOneAndUpdate(
            { _id: parentCommentIdToUpdate },
            { $pull: { reply: commentUID } },
            { new: true }
          );
        }

        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Comment deleted successfully" });
        } else {
          res.status(404).json({ error: "Comment not found" });
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/comment/:comment_id", async (req, res) => {
      try {
        const commentIdToUpdate = parseInt(req.params.comment_id);
        const commentToUpdate = await Comment.findOneAndUpdate(
          { comment_id: commentIdToUpdate },
          { content: req.body.content, edited: true },
          { new: true }
        );

        if (!commentToUpdate) {
          return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment updated successfully", edited: true });
      } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });


    // This route is used for creating replies.
    app.post("/reply", async (req, res) => {
      try {
        const posts = await Post.find().populate('author');;

        console.log("POST Request to /post received.");
        const { author, replyContent, profpic } = req.body;
        const post_id = req.body.post_id;

        const newReply = {
          author: author,
          content: replyContent,
          profpic: profpic,
          comment_id: posts[post_id].comments.length,
          reply: []
        };
        if (newReply && post_id) {
          posts[post_id].comments.push(newComment);
          res.status(200);
          res.redirect("/view/:post_id");
        }
        else {
          res.status(400);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route is used for voting on comments.
    app.post("/vote-comment", async (req, res) => {
      try {
        const comments = await Comment.find().populate('author');;

        const votes = req.body.votes;
        const comment_id = req.body.comment_id;

        if (votes && comment_id) {
          await User.updateOne(
            { _id: comments[comment_id] },
            { $push: { voteCtr: votes } }
          )

          res.status(200);
        } else {
          res.status(400);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route is used for voting on posts.
    app.post("/vote", async (req, res) => {
      try {
        const posts = await Post.find().populate('author');;
        //console.log("POST Request to /vote received.");
        const { votes, post_id, check } = req.body;
        const user = await User.findOne({ username: currentUser.username });
        const foundup = user.upvotedPosts.find(id => id.toString() === posts[post_id]._id.toString());
        const founddown = user.downvotedPosts.find(id => id.toString() === posts[post_id]._id.toString());
        const foundupUser = posts[post_id].upvotedBy.find(_id => currentUser._id);
        const founddownUser = posts[post_id].downvotedBy.find(_id => currentUser._id);
        console.log("post:" + foundup);
        console.log("post:" + founddown);
        console.log("user:" + foundupUser);
        console.log("user:" + founddownUser);

        if (check == "up") {
          //user side
          if (foundup && !founddown) {
            await User.updateOne(
              { _id: user._id },
              { $pull: { upvotedPosts: posts[post_id]._id } }
            )
          } else if (foundup && founddown) {
            await User.updateOne(
              { _id: user._id },
              { $pull: { upvotedPosts: posts[post_id]._id } }
            )
            await User.updateOne(
              { _id: user._id },
              { $pull: { downvotedPosts: posts[post_id]._id } }
            )

          } else if (!foundup && founddown) {
            await User.updateOne(
              { _id: user._id },
              { $push: { upvotedPosts: posts[post_id]._id } }
            )
            await User.updateOne(
              { _id: user._id },
              { $pull: { downvotedPosts: posts[post_id]._id } }
            )

          } else {
            await User.updateOne(
              { _id: user._id },
              { $push: { upvotedPosts: posts[post_id]._id } }
            )

          }
          //post side
          if (foundupUser && !founddownUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { upvotedBy: user._id } }
            )
          } else if (foundupUser && founddownUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { upvotedBy: user._id } }
            )
            await postToUpdate.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { downvotedBy: user._id } }
            )
          } else if (!foundupUser && founddownUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $push: { upvotedBy: user._id } }
            )
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { downvotedBy: user._id } }
            )
          } else {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $push: { upvotedBy: user._id } }
            )
          }
        } else if (check == "down") {
          if (founddown && !foundup) {
            await User.updateOne(
              { _id: user._id },
              { $pull: { downvotedPosts: posts[post_id]._id } }
            )
          } else if (founddown && foundup) {
            await User.updateOne(
              { _id: user._id },
              { $pull: { downvotedPosts: posts[post_id]._id } }
            )
            await User.updateOne(
              { _id: user._id },
              { $pull: { upvotedPosts: posts[post_id]._id } }
            )
          } else if (!founddown && foundup) {
            await User.updateOne(
              { _id: user._id },
              { $push: { downvotedPosts: posts[post_id]._id } }
            )
            await User.updateOne(
              { _id: user._id },
              { $pull: { upvotedPosts: posts[post_id]._id } }
            )
          } else {
            await User.updateOne(
              { _id: user._id },
              { $push: { downvotedPosts: posts[post_id]._id } }
            )
          }
          //post side
          if (founddownUser && !foundupUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { downvotedBy: user._id } }
            )
          } else if (founddownUser && foundupUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { downvotedBy: user._id } }
            )
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { upvotedBy: user._id } }
            )
          } else if (!founddownUser && foundupUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $push: { downvotedBy: user._id } }
            )
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { upvotedBy: user._id } }
            )
          } else {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $push: { downvotedBy: user._id } }
            )
          }
        }

        if (votes && post_id) {
          await Post.updateOne(
            { _id: posts[post_id] },
            { $set: { voteCtr: votes } });
          res.status(200).send();
        } else {
          res.status(400).send();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Route for save buttons
    app.post('/save', async (req, res) => {
      try {
        const posts = await Post.find().populate('author');;
        //console.log("POST Request to /vote received.");
        const post_id = req.body.post_id;
        const user = await User.findOne({ username: currentUser.username });
        const foundSave = user.savedPosts.find(_id => posts[post_id]._id);
        const foundUser = posts[post_id].savedBy.find(_id => user._id);


        if (foundSave) {
          await User.updateOne(
            { _id: user._id },
            { $pull: { savedPosts: posts[post_id]._id } }

          )
          if (foundUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { savedBy: user._id } }
            )
            console.log("found user");
          }
          else if (!foundUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $push: { savedBy: user._id } }
            )
            console.log("not found user");
          }

        } else {
          await User.updateOne(
            { _id: user._id },
            { $push: { savedPosts: posts[post_id]._id } }
          )
          if (foundUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $pull: { savedBy: user._id } }
            )
          }
          else if (!foundUser) {
            await Post.updateOne(
              { _id: posts[post_id]._id },
              { $push: { savedBy: user._id } }
            )
          }
        }
        //console.log(foundSave); 
        res.status(200).send();
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    })
    // Route for user registration
    app.post('/registerFunc', async (req, res) => {
      try {
        const users = await User.find();

        console.log("POST Request to /register received.");
        const { username, password } = req.body;

        if (username && password) {

          const newUser = {
            user_id: users.length,
            profile_pic: "default.png",
            name: "User",
            username: "u/" + username,
            password: password,
            bio: "Edit Profile to add a bio and change username",
            followers_info: "0 followers • 0 following",
            postsMade: []
          };
          const result = await User.collection.insertOne(newUser);
          console.log("New user inserted with _id:", result.insertedId);

          res.status(200).json({ message: "User created successfully" });
        } else {
          res.status(400).json({ error: "Invalid content or username" });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post('/signinFunc', async (req, res) => {
      const { username, password } = req.body;

      try {
        // Query the database to find the user
        const user = await User.findOne({ username: "u/" + username, password: password });
        console.log(user);
        if (user) {
          // Set the user information in the session
          currentUser = user;
          res.status(200).json({ message: 'Sign-in successful' });
        } else {
          res.status(401).json({ message: 'User not found! Please register first.' });
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/getCurrentUser', async (req, res) => {

      // Send the data as a response
      res.json(currentUser);
    });

    app.post("/upvote", async (req, res) => {
      try {
        // Query the database to find the user
        const user = await User.findOne({ username: "u/" + username, password: password });
        console.log(user);
        if (user) {
          // Set the user information in the session
          currentUser = user;
          res.status(200).json({ message: 'Sign-in successful' });
        } else {
          res.status(401).json({ message: 'User not found! Please register first.' });
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // This route is used for connecting to the server.
    app.listen(3000, () => console.log("Server is running on port 3000"));
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();

