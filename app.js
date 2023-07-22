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

// This function imports the data from the a file into the database.
async function importData(data) {
  try {

    // Declaration of the data to be manipulated.
    let collectionName = data + "sCollection";
    let dataToParse = fs.readFileSync('public/JSONs/' + data + 's.json');
    let jsonData = JSON.parse(dataToParse);
    let collection = db.collection(collectionName);

    for (const doc of jsonData) {
      // Check if a document with the same "data"_id already exists in the collection
      const existingID = await collection.findOne({ [`${data}_id`]: doc[`${data}_id`] });

      if (!existingID) {
        // If the document with the same "data"_id doesn't exist, insert the JSON data into the collection
        const result = await collection.insertOne(doc);
        console.log(`${data} with id ${doc[`${data}_id`]} inserted.`);
      } else {
        console.log(`${data} with id ${doc[`${data}_id`]} already exists. Skipping insertion.`);
      }
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// The body of the code, put inside an async to allow for async manipulation of the db.
(async () => {
  try {
    // Connect to the MongoDB database
    await connectToMongo();
    console.log("Connected to MongoDB!");

    // Waits for the data to be imported before starting the Express server.
    // As of now it only imports the data for posts and users.
    await importData("post");
    await importData("user");

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
    app.get("/view/:post_id", async (req, res) => {
      const post_id = req.params.post_id;
      try {
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

        res.render("view", {
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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

        console.log("POST Request to /post received.");
        console.log(req.body);
        const {content, author, profpic, post_id} = req.body;

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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();

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
        const collection = getDb().collection("PostsCollection");
        const posts = await collection.find().toArray();
     
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

