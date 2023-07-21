// Import express, express-handlebars, mongodb NodeJS modules.
import express from 'express';
import exphbs from 'express-handlebars';
import { MongoClient } from 'mongodb';

// Import environment variables from .env file. and fs module.
import 'dotenv/config';
import fs from 'fs';

// Import functions from other js files.
import { connectToMongo, getDb } from './db/conn.js';
import * as helpers from './helpers.js';

// Function that connects the app to the MongoDB database.
connectToMongo((err) => {
  // If there is an error, print it out and exit the process.
  if (err) {
    console.log("Error connecting to MongoDB...");
    console.error(err);
    process.exit();
  }
  // If there is no error, print out a success message.
  console.log("Connected to MongoDB!");
  const db = getDb();
});

// Creates an  instance of the express app.
const app = express();

// Retrieves the database name and MongoDB URI from the .env file.
const dbName = process.env.DB_NAME;
const mongoURI = process.env.MONGODB_URI;

// Creates a variable that stores the database.
const db = getDb();

// This function imports the data from the JSON file into the database.
// RIGHT NOW IT ONLY IMPORTS THE POSTS JSON FILE
async function importData() {
  try {
    // Declaration of the data to be manipulated.
    const collectionName = "PostsCollection";
    const dataToParse = fs.readFileSync('public/JSONs/Posts.json');
    const jsonData = JSON.parse(dataToParse);
    const collection = db.collection(collectionName);

    for (const post of jsonData) {
      // Check if a document with the same post_id already exists in the collection
      const existingID = await collection.findOne({ post_id: post.post_id });

      if (!existingID) {
        // If the document with the same post_id doesn't exist, insert the JSON data into the collection
        const result = await collection.insertOne(post);
        console.log(`Post with id ${post.post_id} inserted.`);
      } else {
        console.log(`Post with id ${post.post_id} already exists. Skipping insertion.`);
      }
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// The body of the code, put inside an async IIFE to allow for async manipulation of the db.
(async () => {
  try {
    // Connect to the MongoDB database
    await connectToMongo();
    console.log("Connected to MongoDB!");

    // Waits for the data to be imported before starting the Express server.
    await importData();

    // Start the Express server after importing the data
    app.engine('hbs', exphbs.engine({
      extname: "hbs",
      defaultLayout: "main",
      helpers: {
        capitalize: function (string) {
          return string.toUpperCase();
        },
        substring: helpers.substring
      }
    }));

    // The following lines of code set up the Express server and handlebars.
    app.use("/static", express.static("public"));
    app.set("view engine", "hbs");
    app.set("views", "./views");

    // This route renders the home page.
    app.get("/", async (req, res) => {
      try {
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

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
    app.get("/view/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

        res.render("view", {
          post: posts[id]
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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

        res.render("main-profile", {
          posts: posts,
          filters: filters
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // This route renders the comments part of the profile page.
    app.get("/profile/comments", async (req, res) => {
      try {
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();
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

    // intercept all requests with the content-type, application/json
    app.use(express.json());

    // This route is used for creating posts.
    app.post("/post", async (req, res) => {
      try {
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();
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
            id: posts.length,
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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

        console.log("POST Request to /post received.");
        console.log(req.body);
        const { author, content, profpic } = req.body;
        const id = req.body.id;

        if (author && content && id) {
          const newComment = {
            author: author,
            content: content,
            profpic: profpic,
            comID: posts[id].comments.length,
            reply: []
          };
          posts[id].comments.push(newComment);
          posts[id].comCtr = posts[id].comments.length;
          res.status(200);
          res.redirect("/view/:id");
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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

        console.log("POST Request to /post received.");
        const { author, replyContent, profpic } = req.body;
        const id = req.body.id;

        const newReply = {
          author: author,
          content: replyContent,
          profpic: profpic,
          comID: posts[id].comments.length,
          reply: []
        };
        if (newReply && id) {
          posts[id].comments.push(newComment);
          res.status(200);
          res.redirect("/view/:id");
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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();
     
        //console.log("POST Request to /vote received.");
        const votes = req.body.votes;
        const id = req.body.postID;
      
        if (votes && id) {
          posts[id].voteCtr = votes; 
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

