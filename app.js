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

mongoose.connect(process.env.MONGODB_URI  + process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Error connecting to MongoDB! Error Details:', err));

// Maps data types to their corresponding models.
const modelMap = {
  user: User,
  post: Post,
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
    await importData('user');
    await importData('post');

    // Start the Express server after importing the data
    app.engine('hbs', exphbs.engine({
      extname: "hbs",
      defaultLayout: "main",
      helpers: {
        capitalize: function (string) {
          return string.toUpperCase();
        },
        substring: helpers.substring
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

        res.render("index", {
          title: 'Home',
          posts: posts,
          toppost: posts[5]
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the view page.
    app.get("/view/:post_id", async (req, res) => {
      const post_id = req.params.post_id;
      try {
        const posts = await Post.find().populate('author');

        res.render("view", {
          title: posts[post_id].title,
          post: posts[post_id]
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the main-profile page.
    app.get("/main-profile", async (req, res) => {
      try {
        const filters = ['Overview', 'Posts', 'Comments', 'Upvoted', 'Downvoted', 'Saved'];
        const posts = await Post.find().populate('author');

        res.render("main-profile", {
          title: "My Profile",
          posts: posts,
          filters: filters
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the comments part of the profile page.
    app.get("/profile-comments", async (req, res) => {
      try {
        const posts = await Post.find().populate('author');
        const user = req.body;
        console.log(user);
        var postsByAuthor = posts.filter(function (post) {
          return post.comments.some(function (comment) {
            return comment.author == user;
          });
        });

        res.render("main-profile", {
          commentPosts: postsByAuthor,
          filters: filters
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
      res.render('signin',{ 
        noLayout: true 
      });
    });
    // intercept all requests with the content-type, application/json
    app.use(express.json());

    // This route is used for creating posts.
    app.post("/post", async (req, res) => {
      try {
        const posts = await Post.find().populate('author');
        console.log("POST Request to /post received.");
        console.log(req.body);
        const { title, author, content, image } = req.body;
        if (title && author && content) {
          const newPost = {
            title: title,
            author: author,
            content: content,
            image: image,
            comments: [],
            post_id: posts.length,
            voteCtr: 0,
            comCtr: 0
          };
          posts.push(newPost);
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
        const posts = await Post.find().populate('author');;

        console.log("POST Request to /comment received.");
        console.log(req.body);
        const { content, author, profpic, post_id } = req.body;

        if (author && content && post_id) {
          const newComment = {
            author: author,
            content: content,
            profpic: profpic,
            comID: posts[post_id].comments.length,
            reply: []
          };
          posts[post_id].comments.push(newComment);
          posts[post_id].comCtr = posts[post_id].comments.length;
          console.log(posts[post_id].comments);
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
          comID: posts[post_id].comments.length,
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

    // This route is used for voting.
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

    // This route is used for connecting to the server.
    app.listen(3000, () => console.log("Server is running on port 3000"));
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();

