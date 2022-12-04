const webapp = require('./src/components/server');

const port = 8080;

webapp.listen(port, async () => {
  console.log(`Server running on port: ${port}`);
});
// const { closeMongoDBConnection, getDB } = require('./src/components/dbConnection');

// let mongo;
// let db;

// const main = async () => {
//   db = await getDB();
//   const result = await db.collection('posts').find().toArray();
//   console.log(result);
// };

// main();
