export function substring(str, start, end) {
    return str.substring(start, end);
}

export async function importData() {
    try {
      const client = await MongoClient.connect(mongoURI);
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Insert the JSON data into the collection
      const result = await collection.insertMany(jsonData);
      console.log(`${result.insertedCount} documents inserted.`);
  
      client.close();
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
