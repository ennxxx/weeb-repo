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
        log: function (context) {
          console.log(context);
        }
    },
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
      },
    }));

    // The following lines of code set up the Express server and handlebars.
    app.use("/static", express.static("public"));
    app.set("view engine", "hbs");
    app.set("views", "./views");


    // This route renders the home page.
    app.get("/", async (req, res) => {
      try {
        const posts = await Post.find().populate('author');
        posts.sort((post1, post2) => post2.voteCtr - post1.voteCtr);

        res.render("index", {
          title: 'Home',
          posts: posts,
          toppost: posts[0],
          currentUser: currentUser
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
        res.render("view", {
          title: posts[post_id].title,
          post: posts[post_id],
          currentUser: currentUser
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the main-profile page.
    app.get("/main-profile", async (req, res) => {
      try {
        const filters = ['Posts', 'Comments', 'Upvoted', 'Downvoted'];
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
        
        const filtered_comments = comments.filter(comment => comment.author.username.toLowerCase().includes(currentUser.username));
        var filtered_upvoted = [];
        var filtered_downvoted = [];
        var filtered_saved = [];

        for(var i = 0; i < currentUser.upvotedPosts.length; i++ ){
          const found_post = posts.find(post => post._id.toString() === currentUser.upvotedPosts[i].toString());
          if (found_post) {
            filtered_upvoted.push(found_post);
          }
        }
        for(var i = 0; i < currentUser.downvotedPosts.length; i++ ){
          const found_post = posts.find(post => post._id.toString() === currentUser.downvotedPosts[i].toString());
          if (found_post) {
            filtered_downvoted.push(found_post);
          }
        }
        for(var i = 0; i < currentUser.savedPosts.length; i++ ){
          const found_post = posts.find(post => post._id.toString() === currentUser.savedPosts[i].toString());
          if (found_post) {
            filtered_saved.push(found_post);
          }
        }
        //console.log(filtered_upvoted);
        res.render("main-profile", {
          title: "My Profile",
          user: user,
          comments: filtered_comments,
          upvoted: filtered_upvoted,
          downvoted: filtered_downvoted,
          saved: filtered_saved,
          filters: filters,
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
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
          res.render("profile", {
            title: userProfile[0].name,
            user: userProfile[0],
            comments: filtered_comments,
            filters: filters,
            currentUser: currentUser
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
        const posts = await Post.find().populate('author');
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
        const users = await User.find().populate('postsMade');

        const search = query.toLowerCase();

        const filtered_posts = posts.filter(post => post.title.toLowerCase().includes(search)
          || post.content.toLowerCase().includes(search)
          || post.author.username.toLowerCase().includes(search));

        const filtered_comments = comments.filter(comment => comment.content.includes(search)
          || comment.author.username.toLowerCase().includes(search)
          || comment.parentPost.title.toLowerCase().includes(search)
          || comment.parentPost.author.username.toLowerCase().includes(search));

        const filtered_users = users.filter(user => user.username.toLowerCase().includes(search)
          || user.name.toLowerCase().includes(search));

        res.render("search", {
          title: "Search",
          query: query,
          search_filters: search_filters,
          posts: filtered_posts,
          comments: filtered_comments,
          users: filtered_users,
          currentUser: currentUser
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
            upvotedPost:[],
            downvotedPost:[],
            savedPost:[],
            __v: 0
          };
          const result = await Post.collection.insertOne(newPost);
          console.log("New post inserted with _id:", result.insertedId);

          const userIdToUpdate = currentUser._id;
          await User.updateOne(
            { _id: userIdToUpdate },
            { $push: { postsMade: result.insertedId } }
          );
          res.status(200);
          res.redirect("/");
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
            voteCtr: 0,
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
          const comments = await Comment.find().populate('parentPost').populate('parentComment');
          const commentToUpdate = comments.find(comment => comment.comment_id === commentIdToUpdate);
  
          if (!commentToUpdate) {
              return res.status(404).json({ error: "Comment not found" });
          }
  
          const { content } = req.body;
  
          if (!content) {
              return res.status(400).json({ error: "Invalid content" });
          }
  
          commentToUpdate.content = content;
          commentToUpdate.edited = true; // Add an "edited" flag to indicate that the comment has been edited
          await commentToUpdate.save();
  
          res.status(200).json({ message: "Comment updated successfully" });
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
          comments[comment_id].voteCtr = votes;
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
        const votes = req.body.votes;
        const post_id = req.body.post_id;

        if (votes && post_id) {
          posts[post_id].voteCtr = votes;
          res.status(200);
        } else {
          res.status(400);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

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
            bio: "Edit Profile to add a bio",
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

    // app.get('/signinFunc', async (req, res) => {
    //   try {
    //     // Query the database using Mongoose or any other library
    //     console.log("GET Request to /signin received.");
    //     const users = await User.find(); // Replace YourModel with your actual Mongoose model

    //     // Send the data as a response
    //     res.json(users);
    //   } catch (error) {
    //     console.error('Error fetching data from the database:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // });

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

    app.post("/upvote", async (req, res) =>{
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

