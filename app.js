// Import express, express-handlebars, mongodb NodeJS modules.
import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';

// Import environment variables from .env file. and fs module.
import 'dotenv/config';
import * as helpers from './helpers.js';

// Import helpers, DB, and router
import { connectToDB } from './models/db.js';
import router from './routes/router.js';

// Main function
async function main() {
  try {

    // Connecting to DB
    console.info('Launching Express...');
    const app = express();
    connectToDB();

    // Waits for the data to be imported before starting the Express server.
    await mongoose.connection.dropDatabase();
    await importData('user');
    await importData('post');
    await importData('comment');

    // let currentUser = await User.findOne({ username: 'u/shellyace' }).populate('postsMade');

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