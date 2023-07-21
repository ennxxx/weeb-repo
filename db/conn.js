import { MongoClient } from 'mongodb';


const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI);

export function connectToMongo(callback) {
    client.connect(mongoURI, (err, client) => {
      if (err) {
        callback(err); // Call the callback with the error if connection fails
      } else {
        const db = client.db(dbName);
        callback(null, db); // Call the callback with the database instance if connection is successful
      }
    });
  }

export function getDb(dbName = process.env.DB_NAME) {
    return client.db(dbName);
}

function signalHandler() {
    console.log("Closing MongoDB connection...");
    client.close();
    process.exit();
}

process.on('SIGINT', signalHandler);
process.on('SIGTERM', signalHandler);
process.on('SIGQUIT', signalHandler);