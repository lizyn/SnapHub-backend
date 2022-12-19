const { MongoClient, ObjectId } = require('mongodb');
const keys = require('./keys');

const { DB_USER, DB_PWD } = keys;
const url = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster557-project36.a1psu00.mongodb.net/?retryWrites=true&w=majority`;

let MongoConnection;

const connect = async () => {
  try {
    MongoConnection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Connected to db
    console.log(
      `Connected to database: ${MongoConnection.db('hw5').databaseName}`
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
  return MongoConnection.db('hw5');
};

const register = async (newUser) => {
  try {
    const db = await getDB();
    const users = db.collection('users');
    const result = await users.insertOne(newUser);
    console.log(result);
    return result.insertedId.toString();
  } catch (err) {
    throw new Error('Error in register the user');
  }
};

const login = async (username, password) => {
  try {
    const db = await getDB();
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
  let results;
  try {
    results = await db.collection('users').find({}).toArray();
  } catch (err) {
    throw Error(err);
  }
  return results;
};

const getAFewUsers = async (ids) => {
  const objectIds = ids.map((id) =>
    id instanceof ObjectId ? id : ObjectId(id)
  );
  const db = await getDB(); // connect to database
  try {
    const users = await db
      .collection('users')
      .find({ _id: { $in: objectIds } })
      .toArray();
    // console.log(users);
    return users;
  } catch (err) {
    return new Error(`${err.message}`);
  }
};

const getAUser = async (id) => {
  const db = await getDB(); // connect to database
  try {
    const results = await db
      .collection('users')
      .find({ _id: ObjectId(id) })
      .toArray();
    // console.log(`Users: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    return Error(err.message);
    // console.log(`error: ${err.message}`);
  }
};

const getRandomUsers = async (num, excludeIds = []) => {
  if (num <= 0) return [];
  const excludeObjectIds = excludeIds.map((id) => ObjectId(id));
  const db = await getDB(); // connect to database
  try {
    const randomUsers = await db
      .collection('users')
      .aggregate([
        { $match: { _id: { $nin: excludeObjectIds } } },
        { $sample: { size: num } }
      ])
      .toArray();
    // console.log(randomUsers);
    // const uniqueObjectIds = randomObjectIds.reduce((accum, current) => {
    //   if (current !== excludeObjectId) accum.add(current);
    //   return accum;
    // }, new Set());
    // const users = await getAFewUsers(uniqueObjectIds);
    // console.log(users);
    return randomUsers;
  } catch (err) {
    return new Error(`error: ${err.message}`);
  }
};

const addUser = async (newUser) => {
  const db = await getDB(); // connect to database
  db.collection('users').insertOne(newUser, (err, result) => {
    if (err) {
      return Error(err);
    }
    console.log(`Created user with id: ${result.insertedId}`);
  });
};


const hideAPost = async (userId, postId) => {
  console.log('try to hide', postId, 'for', userId);
  const db = await getDB();
  let result;
  try {
    result = await db
      .collection('users')
      .updateOne(
        { _id: ObjectId(userId) },
        { $push: { hiddenPosts: ObjectId(postId) } }
      );
    console.log(result);
  } catch (err) {
    throw new Error(err);
  }
  return result;

const getFollowerIds = async (id) => {
  const objectId = id instanceof ObjectId ? id : ObjectId(id);
  const db = await getDB();
  try {
    const followData = await db
      .collection('follows')
      .find({ following: objectId }, { _id: 0, following: 0 })
      .toArray();
    const followerIds = followData.map((obj) => obj.follower);
    return followerIds;
  } catch (err) {
    return new Error(`${err.message}`);
  }
};

const getFollowingIds = async (id) => {
  const objectId = id instanceof ObjectId ? id : ObjectId(id);
  const db = await getDB();
  try {
    const followData = await db
      .collection('follows')
      .find({ follower: objectId }, { _id: 0, follower: 0 })
      .toArray();
    const followingIds = followData.map((obj) => obj.following);
    // console.log(followingIds);
    return followingIds;
  } catch (err) {
    return new Error(`${err.message}`);
  }
};

const getFollowers = async (id) => {
  const objectId = id instanceof ObjectId ? id : ObjectId(id);
  try {
    const followerIds = await getFollowerIds(objectId);
    const followers = await getAFewUsers(followerIds);
    // console.log(followers);
    return followers;
  } catch (err) {
    return new Error(`${err.message}`);
  }
};

const getFollowings = async (id) => {
  const objectId = id instanceof ObjectId ? id : ObjectId(id);
  try {
    const followingIds = await getFollowingIds(objectId);
    const followings = await getAFewUsers(followingIds);
    // console.log(followings);
    return followings;
  } catch (err) {
    return new Error(`${err.message}`);
  }
};

const getFollowRelationshipBetween = async (follower, following) => {
  const followerId =
    follower instanceof ObjectId ? follower : ObjectId(follower);
  const followingId =
    following instanceof ObjectId ? following : ObjectId(following);
  const db = await getDB();
  try {
    const result = await db
      .collection('follows')
      .findOne({ follower: followerId, following: followingId });
    return result;
  } catch (error) {
    return error.message;
  }
};

const follow = async (follower, following) => {
  const followerId =
    follower instanceof ObjectId ? follower : ObjectId(follower);
  const followingId =
    following instanceof ObjectId ? following : ObjectId(following);
  const db = await getDB();
  try {
    const inserted = await db
      .collection('follows')
      .updateOne(
        { follower: followerId, following: followingId },
        { $set: { follower: followerId, following: followingId } },
        { upsert: true }
      );
    // if (inserted.matchedCount !== 0)
    //   throw Error('Follow relationship already exists');
    return inserted; // e.g. {"acknowledged":true,"modifiedCount":0,"upsertedId":"638c388bcbe1fcaa3f29067a","upsertedCount":1,"matchedCount":0}
  } catch (error) {
    throw Error(error.message);
  }
};

const unfollow = async (follower, following) => {
  const db = await getDB();
  const followerId =
    follower instanceof ObjectId ? follower : ObjectId(follower);
  const followingId =
    following instanceof ObjectId ? following : ObjectId(following);
  try {
    const results = await db
      .collection('follows')
      .deleteOne({ follower: followerId, following: followingId });
    if (results.deletedCount === 0)
      throw Error("Follow relationship doesn't exist");
    return results; // e.g. { acknowledged: true, deletedCount: 1 }
  } catch (err) {
    throw Error(err.message);
  }

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
    let followed = await db
      .collection('follows')
      .find({ follower: ObjectId(id) }, { projection: { following: 1 } })
      .toArray();
    followed = followed.map((follow) => follow.following);
    console.log(`Following: ${JSON.stringify(followed)}`);
    // (3) save the posts by every user in the following list to an array "feed"
    feed = await db
      .collection('posts')
      .aggregate([
        {
          $match: {
            userId: { $in: followed },
            _id: { $nin: curUser.hiddenPosts }
          }
        }
      ])
      .toArray();
    // console.log(`Feed list: ${JSON.stringify(feed)}`);
  } catch (err) {
    // console.log(`error: ${err.message}`);
  }
  return feed;
};

const getUserPosts = async (id) => {
  const db = await getDB();
  let posts;
  try {
    // save posts that has userId = the param id
    posts = await db
      .collection('posts')
      .find({ userId: ObjectId(id) })
      .toArray();
    if (posts.length === 0) {
      throw Error("user doesn't exist / doesn't have posts");
    }
    console.log(`Posts by this user: ${JSON.stringify(posts)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw err;
  }
  return posts;
};

const getAPost = async (id) => {
  const db = await getDB(); // connect to database
  let results;
  try {
    results = await db
      .collection('posts')
      .find({ _id: ObjectId(id) })
      .toArray();
    if (results.length === 0) throw Error('post not found');
    console.log(`Post: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw err;
  }
  return results;
};

const addPost = async (newPost) => {
  const db = await getDB(); // connect to database
  let inserted;
  try {
    inserted = await db
      .collection('posts')
      .insertOne({ ...newPost, userId: ObjectId(newPost.userId) });
  } catch (error) {
    return error.message;
  }
  console.log(`Created post with id: ${inserted.insertedId}`);
  return inserted;
};

const updatePost = async (id, newPost) => {
  const db = await getDB();
  let results;
  try {
    results = await db.collection('posts').updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          title: newPost.title,
          photo: newPost.photo,
          description: newPost.description || ''
        }
      }
    );
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    throw new Error('invalid update');
  }
  return results;
};

const deletePost = async (id) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('posts')
      .deleteOne({ _id: ObjectId(id) });
    if (results.deletedCount === 0) throw Error();
    console.log(`Post updated: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw Error();
  }
};

const addComment = async (newComment) => {
  const db = await getDB();
  // let commentId;
  let result;
  try {
    result = await db.collection('comments').insertOne({
      ...newComment,
      userId: ObjectId(newComment.userId),
      postId: ObjectId(newComment.postId)
    });
    console.log(`comment id is ${result.insertedId}`);
    // commentId = result.insertedId;
    await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(newComment.postId) },
        { $push: { comments: result.insertedId } }
      );
    // console.log(`Post updated: ${JSON.stringify(updatedPost)}`);
  } catch (err) {
    throw new Error(err);
  }
  return result;
};

const getAComment = async (id) => {
  const db = await getDB();
  let results;
  try {
    results = await db
      .collection('comments')
      .find({ _id: ObjectId(id) })
      .toArray();
    if (results.length === 0) throw Error('no comment found');
    console.log(`Comment: ${JSON.stringify(results)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw Error();
  }
  return results;
};

const getPostComments = async (id) => {
  const db = await getDB();
  let results;
  try {
    results = await db
      .collection('comments')
      .find({ postId: ObjectId(id) })
      .toArray();
    if (results.length === 0) throw Error('no comment found');
  } catch (err) {
    throw Error();
  }
  return results;
};

const updateComment = async (id, newComment) => {
  const db = await getDB();
  try {
    const results = await db
      .collection('comments')
      .updateOne({ _id: ObjectId(id) }, { $set: { text: newComment.text } });
    console.log(`comment updated: ${JSON.stringify(results)}`);
  } catch (err) {
    throw new Error('comment update failed');
  }
};

const deleteComment = async (id) => {
  const db = await getDB();
  let deleted;
  let results;
  try {
    deleted = await db.collection('comments').findOne({ _id: ObjectId(id) });
    if (!deleted) throw Error("comment doesn't exist");
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
    throw Error();
  }
  return results;
};

// find if the user have liked the post or not
// returns true if have liked; false if have not liked
const likeStatus = async (postId, userId) => {
  const db = await getDB();
  console.log('postId is', postId);
  let result;
  try {
    const post = await db
      .collection('posts')
      .findOne({ _id: ObjectId(postId) });
    console.log(
      'liked status for post is',
      post.likedBy.some((id) => id.equals(ObjectId(userId)))
    );
    if (!post) throw Error('post not found');
    result = post.likedBy.some((id) => id.equals(ObjectId(userId)));
  } catch (err) {
    throw new Error(err);
  }
  return result;
};

// add like to a post
const likePost = async (postId, userId) => {
  console.log('in like post:', postId, userId);
  const db = await getDB();
  let result;
  try {
    await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(postId) },
        { $push: { likedBy: ObjectId(userId) }, $inc: { likes: 1 } }
      );
  } catch (err) {
    throw new Error(err);
  }
  return result;
};

// delete like from a post
const unlikePost = async (postId, userId) => {
  const db = await getDB();
  let result;
  try {
    await db
      .collection('posts')
      .updateOne(
        { _id: ObjectId(postId) },
        { $pull: { likedBy: ObjectId(userId) }, $inc: { likes: -1 } }
      );
  } catch (err) {
    throw new Error(err);
  }
  return result;
};

// unfollow('638682d7b47712e0d260ce8b', '63869b13b587601c9ce1cbb8')
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err.message));

// getFollowRelationshipBetween(
//   '638682d7b47712e0d260ce8b',
//   '63869b13b587601c9ce1cbb8'
// ).then((data) => console.log(data));

// follow('638682d7b47712e0d260ce8b', '63869b13b587601c9ce1cbb8')
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err.message));
module.exports = {
  connect,
  closeMongoDBConnection,
  getDB,
  register,
  login,
  addUser,
  getUsers,
  getAFewUsers,
  getAUser,
  getRandomUsers,
  getPosts,
  getAPost,
  getUserPosts,
  getFeed,
  addPost,
  updatePost,
  deletePost,
  hideAPost,
  addComment,
  getAComment,
  getPostComments,
  deleteComment,
  updateComment,
  likeStatus,
  likePost,
  unlikePost,
  getFollowerIds,
  getFollowingIds,
  getFollowers,
  getFollowings,
  getFollowRelationshipBetween,
  follow,
  unfollow
};
