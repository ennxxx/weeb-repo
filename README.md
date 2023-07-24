# Weeb.Lib
## A NodeJS Server that serves as a Reddit Clone for weebs.

This is a step-by-step guide to set up and run Weeb.Lib. Before you start, please make sure you have the following prerequisites installed:

## Prerequisites

- Node.js (v12 or higher): Node.js is a JavaScript runtime that allows you to execute JavaScript code outside of a browser. You can download it from the official website: [Node.js](https://nodejs.org/)

- MongoDB: MongoDB is a NoSQL database used to store data for the Weeb.Lib application. You can download it from the official website: [MongoDB](https://www.mongodb.com/)

- Required Node.js packages, including `bcrypt`, `dotenv`, `express`, `express-handlebars`, `express-session` `mongoose`, and `mongoose-autopopulate`:


## Installation

1. **Node.js:** If you don't have Node.js installed, download and install it from the official website: [Node.js](https://nodejs.org/). Node.js comes with `npm` (Node Package Manager) that allows you to easily install the required packages.

2. **MongoDB:** Download and install MongoDB from the official website: [MongoDB](https://www.mongodb.com/). Follow the installation instructions for your operating system.

3. **Project Setup:**

   - Clone the [Weeb.Lib](https://github.com/ennxxx/weeb-repo.git) repository (Which is currently supplied, since the github repo is private.)  to your local machine.

   - Navigate to the root directory of the project.

   - Open a terminal or command prompt in that directory.

4. **Install Dependencies:**

   Run the following command to install the required Node.js packages, including `bcrypt`, `dotenv`, `express`, `express-handlebars`, `express-session` `mongoose`, and `mongoose-autopopulate`:

   ```bash
   npm install bcrypt dotenv express express-handlebars express-session mongoose mongoose-autopopulate
   ```

   This command will install all the required packages and their dependencies, as listed in the `package.json` file.

With these instructions, you will have all the necessary packages installed to run Weeb.Lib server successfully. If you encounter any issues during the installation or running of the server, feel free to contact us. Enjoy exploring the Weeb.Lib application!

## Running the Server

After you have installed the prerequisites and the dependencies, you are ready to run the Weeb.Lib Node.js server. Follow these steps:

1. **Start MongoDB:**

   Before running the server, make sure your MongoDB server is up and running. You may need to start the MongoDB service manually if it's not set to start automatically with your system.

2. **Run the Server:**

   Use the following command in the root of the repository to start the Weeb.Lib server:

   ```bash
   node app.js
   ```

   Alternatively, there is a startServer.bat file that can be used to start the server on Windows:

   The server will now start running on port 3000. You should see a message in the console ending in "Server is running on port 3000."

3. **Access the Application:**

   Open your web browser and navigate to `http://localhost:3000` to access the Weeb.Lib application. You should see the home page of Weeb.Lib.

4. **Explore the Application:**

   You can now interact with the Weeb.Lib application and explore its various features. You can view posts, create new posts, comment on posts, vote on posts and comments, and much more.

## Notes

- If you encounter any issues during the installation or running of the server, make sure to check the console output for error messages.

- If you have any problems related to MongoDB connectivity, ensure that your MongoDB server is running and properly configured.

- To stop the server, press `Ctrl + C` in the terminal or command prompt where the server is running.

Enjoy exploring and experimenting with our Weeb.Lib Node.js server! If you have any questions or face any difficulties, feel free to reach out for assistance. Happy coding!