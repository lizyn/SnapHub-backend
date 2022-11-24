const { MongoClient, ObjectId } = require('mongodb');

const url =
  'mongodb+srv://admin:55736photofolio@cluster557-project36.a1psu00.mongodb.net/?retryWrites=true&w=majority';

let MongoConnection;

const connect = async () => {
  try {
    MongoConnection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Connected to db
    console.log(`Connected to database: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getDB = async () => {
  if (!MongoConnection) {
    await connect();
  }
  console.log(`connected to db${MongoConnection}`);
  return MongoConnection.db();
};

const getUsers = async () => {
  const db = await getDB(); // connect to database
  try {
    const results = await db.collection('users').find({}).toArray();
    console.log(`Users: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const addUser = async (newUser) => {
  const db = await getDB(); // connect to database
  db.collection('users').insertOne(newUser, (err, result) => {
    if (err) {
      console.log(`error: ${err.message}`);
      return;
    }
    console.log(`Created user with id: ${result.insertedId}`);
  });
};

const updateUser = async (userId, name) => {
  const db = await getDB(); // connect to database
  try {
    const results = await db
      .collection('users')
      .updateOne({ _id: ObjectId(userId) }, { $set: { lastName: name } });
    console.log(`Users: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

module.exports = { addUser, getUsers, updateUser };
