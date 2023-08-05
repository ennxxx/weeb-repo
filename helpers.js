import fs from 'fs';

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
export async function importData(data) {
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

export function substring(str, start, end) {
  return str.substring(start, end);
}

export async function getCommentsData() {
  try {
    const response = await fetch('/api/comments');
    if (!response.ok) {
      throw new Error('Failed to fetch comments data.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments data:', error);
    return [];
  }
}

export function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function getUpvoteStatus(upvoteStatusArray, index) {
  return upvoteStatusArray[index].upvoteStatus;
};

export function getDownvoteStatus(downvoteStatusArray, index) {
  return downvoteStatusArray[index].downvoteStatus;
};

export function getSaveStatus(saveStatusArray, index) {
  return saveStatusArray[index].saveStatus;
};