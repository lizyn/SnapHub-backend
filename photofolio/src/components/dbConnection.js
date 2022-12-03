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
    console.log(
      `Connected to database: ${MongoConnection.db('photofolio').databaseName}`
    );
    return MongoConnection;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

const getDB = async () => {
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db('photofolio');
};

const register = async (db, newUser) => {
  try {
    const users = db.collection('users');
    const result = await users.insertOne(newUser);
    return result.insertedId.toString();
  } catch (err) {
    throw new Error('Error in register the user');
  }
};

const login = async (db, username, password) => {
  try {
    const users = db.collection('users');
    const query = { username, password };
    const cursor = await users.findOne(query);
    return cursor;
  } catch (error) {
    throw new Error('Error while login');
  }
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

const getAUser = async (id) => {
  const db = await getDB(); // connect to database
  try {
    const results = await db
      .collection('users')
      .find({ _id: ObjectId(id) })
      .toArray();
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

const getPosts = async () => {
  const db = await getDB(); // connect to database
  try {
    const results = await db.collection('posts').find({}).toArray();
    console.log(`Posts: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const getFeed = async (id) => {
  const db = await getDB(); // connect to database
  let feed;
  try {
    // (1) get the user to find feed for
    const curUser = await db.collection('users').findOne({ _id: ObjectId(id) });
    console.log(`Current User: ${JSON.stringify(curUser)}`);
    // (2) get the users this user is following
    const followed = curUser.following;
    console.log(`Following: ${JSON.stringify(followed)}`);
    // (3) save the posts by every user in the following list to an array "feed"
    feed = await db
      .collection('posts')
      .aggregate([{ $match: { userId: { $in: followed } } }])
      .toArray();
    console.log(`Feed list: ${JSON.stringify(feed)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return feed;
};

const getUserPosts = async (id) => {
  const db = await getDB();
  let posts;
  try {
    // save posts that has userId = the param id
    posts = await db.collection('posts').find({ userId: id }).toArray();
    console.log(`Posts by this user: ${JSON.stringify(posts)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return posts;
};

const getAPost = async (id) => {
  const db = await getDB(); // connect to database
  try {
    const results = await db
      .collection('posts')
      .find({ _id: ObjectId(id) })
      .toArray();
    console.log(`Post: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const addPost = async (newPost) => {
  const db = await getDB(); // connect to database
  db.collection('posts').insertOne(newPost, (err, result) => {
    if (err) {
      console.log(`error: ${err.message}`);
      return;
    }
    console.log(`Created post with id: ${result.insertedId}`);
  });
};

const updatePost = async (id, newPost) => {
  const db = await getDB();
  let results;
  try {
    results = await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(id) },
        { $set: { text: newPost.text, photo: newPost.photo } }
      );
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return results;
};

const deletePost = async (id) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('posts')
      .deleteOne({ _id: ObjectId(id) });
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const addComment = async (newComment) => {
  const db = await getDB();
  let commentId;
  let result;
  try {
    result = await db.collection('comments').insertOne(newComment);
    console.log(`comment id is ${result.insertedId}`);
    commentId = result.insertedId;
    const updatedPost = await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(newComment.postId) },
        { $push: { comments: commentId } }
      );
    console.log(`Post updated: ${JSON.stringify(updatedPost)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return result;
};

const getAComment = async (id) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('comments')
      .find({ _id: ObjectId(id) })
      .toArray();
    console.log(`Comment: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const updateComment = async (id, newComment) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('comments')
      .updateOne({ _id: ObjectId(id) }, { $set: { text: newComment.text } });
    console.log(`comment updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const deleteComment = async (id) => {
  const db = await getDB();
  let deleted;
  let results;
  try {
    deleted = await db.collection('comments').findOne({ _id: ObjectId(id) });
    results = await db.collection('comments').deleteOne({ _id: ObjectId(id) });
    console.log(`Comment removed: ${JSON.stringify(results)}`);
    const updatedpost = await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(deleted.postId) },
        { $pull: { comments: ObjectId(id) } }
      );
    console.log(`Post updated: ${JSON.stringify(updatedpost)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return results;
};

module.exports = {
  connect,
  closeMongoDBConnection,
  getDB,
  register,
  login,
  addUser,
  getUsers,
  getAUser,
  getPosts,
  getAPost,
  getUserPosts,
  getFeed,
  addPost,
  updatePost,
  deletePost,
  addComment,
  getAComment,
  deleteComment,
  updateComment
};
