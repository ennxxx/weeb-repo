import express from 'express';
import exphbs from 'express-handlebars';
import * as helpers from './helpers.js';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { connectToMongo, getDb } from './db/conn.js';
import fs from 'fs';


connectToMongo((err) => {
  if (err) {
    console.log("May Error, Puta.");
    console.error(err);
    process.exit();
  }
  console.log("Connected to MongoDB!");
  // Do stuff here daw
  const db = getDb();
});

const app = express();
const dbName = process.env.DB_NAME;
const mongoURI = process.env.MONGODB_URI;
const db = getDb();

async function importData() {
  try {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(dbName);

    const collectionName = "PostsCollection";
    const dataToParse = fs.readFileSync('public/JSONs/Posts.json');
    const jsonData = JSON.parse(dataToParse);
    const collection = db.collection(collectionName);

    // Insert the JSON data into the collection
    const result = await collection.insertMany(jsonData);
    console.log(`${result.insertedCount} documents inserted into ${collectionName}.`);

    client.close();
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importData();
const posts = db.collection("PostsCollection");

app.use("/static", express.static("public"));

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

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index", {
    title: 'Home',
    posts: posts,
    toppost: posts[5]
  });
});

app.get("/view/:id", (req, res) => {
  const id = req.params.id;

  res.render("view", {
    post: posts[id]
  });
});

app.get("/main-profile", (req, res) => {

  const filters = ['overview', 'posts', 'comments', 'upvoted', 'downvoted', 'saved'];

  res.render("main-profile", {
    posts: posts,
    filters: filters
  });
});

app.get("/profile/comments", (req, res) => {
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
});

/* app.get("/anime", (req, res) => {
  res.render("anime");
});*/

// intercept all requests with the content-type, application/json
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.post("/post", (req, res) => {
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
      id: posts.length
    };
    posts.push(newPost);
    res.status(200);
    res.redirect("/");
  }
  else {
    res.status(400);
    res.redirect("/error");
  }
});

app.post("/comment", (req, res) => {
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
    res.status(200);
    res.redirect("/view/:id");
  }
  else {
    res.status(400);
  }
});

app.post("/reply", (req, res) => {
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
});

app.listen(3000, () => console.log("Server is running on port 3000"));