// Import express, express-handlebars, mongodb NodeJS modules.
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import mongoose from 'mongoose';

// Import environment variables from .env file. and fs module.
import 'dotenv/config';
import fs from 'fs';

// Import helpers, DB, and router
import * as helpers from './helpers.js';
import { connectToDB } from './models/db.js';
import router from './routes/router.js';

// Import the schemas
import { User } from './models/schemas.js';
import { Post } from './models/schemas.js';
import { Comment } from './models/schemas.js';

// Maps data types to their corresponding models.
const modelMap = {
  user: User,
  post: Post,
  comment: Comment
};

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

async function main() {
  try {

    // Connecting to DB
    console.info('Launching Express...');
    const app = express();
    connectToDB();

    // Waits for the data to be imported before starting the Express server.
    mongoose.connection.dropDatabase();
    console.log('WeebDB Database dropped and prepped for data insertion...');
    await importData('user');
    await importData('post');
    await importData('comment');

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
          const contextName = this.name || "Unknown Context";
          console.log(`Context Name: ${contextName}`);
          console.log(context);
        }
      },
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
      },
    }));

    // Configure express-session
    app.use(session({
      secret: 'a186684b6439ce08d7e48d27b73aea241f52b5f5784c48b43182e965762bc753',
      resave: false,
      saveUninitialized: true
    }));

    // The following lines of code set up the Express server and handlebars.
    app.use("/static", express.static("public"));
    app.use(express.json());
    app.set("view engine", "hbs");
    app.set("views", "./views");
    app.use(router);

    // This route is used for connecting to the server.
    app.listen(3000, () => console.log("Server is running on port 3000"));
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();