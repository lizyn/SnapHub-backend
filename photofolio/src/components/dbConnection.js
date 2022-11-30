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
    const curUser = await db.collection('users').find({ _id: ObjectId(id) });
    console.log(`Current User: ${JSON.stringify(curUser)}`);
    // (2) get all the users this user is following
    const following = await db
      .collection('users')
      .aggregate([
        { $match: { _id: { $in: curUser.following } } },
        { $group: { following: { $push: '_id' } } }
      ])
      .toArray();
    console.log(`Following: ${JSON.stringify(following)}`);
    // (3) get the posts by every user in the following list
    feed = await db
      .collection('posts')
      .aggregate([{ $match: { userId: { $in: following } } }])
      .toArray();
    console.log(`Feed list: ${JSON.stringify(feed)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return feed;
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
    console.log(`Created user with id: ${result.insertedId}`);
  });
};

const updatePost = async (id, newPost) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(id) },
        { $set: { text: newPost.text, photo: newPost.photo } }
      );
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
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
  // insert the new comment to the comments collection
  db.collection('comments').insertOne(newComment, (err, result) => {
    if (err) {
      console.log(`error: ${err.message}`);
      return;
    }
    commentId = result.insertedId;
    console.log(`Created comment with id: ${result.insertedId}`);
  });
  // add the new comment id to the comment list of the target post
  try {
    const results = await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(newComment.postId) },
        { $push: { comments: commentId } }
      );
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const updateComment = async (id, newComment) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('posts')
      .updateOne({ _id: ObjectId(id) }, { $set: { text: newComment.text } });
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

const deleteComment = async (id) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('comments')
      .deleteOne({ _id: ObjectId(id) });
    console.log(`Comment removed: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  try {
    const results = await db
      .collection('posts')
      .updateOne({ _id: ObjectId(id) }, { $pull: { comments: ObjectId(id) } });
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

module.exports = {
  addUser,
  getUsers,
  getAUser,
  getPosts,
  getAPost,
  getFeed,
  addPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  updateComment
};
