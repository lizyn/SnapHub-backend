// Express app file

// (1) import express
// backend ==> require
const express = require('express');

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require('cors');

// const jwt = require('jsonwebtoken');

// const secret = 'is_i$mysecret';

// (3) create an instanece of our express app
const webapp = express();

const auth = require('./auth');

//import JWT
const jwt = require('jsonwebtoken');

// secret key
const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ';

// (4) enable cors
webapp.use(cors());

// (5) define the port
// const port = 8080;

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());

// (7) import the aws and db interactions module
// const path = require('path');
const formidable = require('formidable');
const s3manips = require('./s3manips');
const dbLib = require('./dbConnection');
const { ObjectID } = require('bson');

// (8) declare a db reference variable
// let db;
// let con;
// sample new user and new post (just for testing)
// const newUser = {
//   firstName: 'test', // req.body.firstName,
//   lastName: 'testson', // req.body.lastName,
//   avatar: '/', // req.body.avatar,
//   email: 'test@upenn.edu', // req.body.email,
//   password: 'mypassword', // req.body.password,
//   following: []
// };

// const newPost = {
//   photo: '/',
//   userId: 1,
//   text: 'newpost',
//   description: 'test description',
//   comments: [],
//   likes: 0
// };

// const newComment = {
//   userId: 2,
//   text: 'new comment test',
//   postId: 1
// };

// start the server and connect to the DB

// webapp.listen(port, async () => {
//   con = await dbLib.connect();
//   db = await dbLib.getDB();
//   console.log(`Server running on port: ${port}`);
// });

// root endpoint / route

const faileduser = [];

// login
webapp.get('/account/username=:user&password=:pwd', async (req, res) => {
  try {
    if (faileduser.includes(req.params.user)) {
      res.status(403).json({ message: 'lockout' });
      return;
    }
    const results = await dbLib.login(req.params.user, req.params.pwd);

    if (results === null) {
      faileduser.push(req.params.user);
      res.status(401).json({ message: 'wrong password' });
      return;
    }

    const jwtoken = jwt.sign({ username: results._id.toString() }, secret, {
      expiresIn: '24h'
    });
    res.status(201).json({
      data: { id: results._id.toString(), ...results },
      token: jwtoken
    });
  } catch (err) {
    res.status(404).json({ message: 'There is an login error' });
  }
});

// register
webapp.post('/users', async (req, res) => {
  // console.log(req.body);
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    !req.body.firstname ||
    !req.body.lastname
  ) {
    res.status(404).json({ message: 'missing information in registration' });
    return;
  }
  const newUser = {
    username: req.body.username,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    password: req.body.password
  };
  try {
    const result = await dbLib.register(newUser);
    res.status(201).json({
      user: { id: result, ...newUser }
    });
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// implement the GET /students endpoint
webapp.get('/users', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbLib.getUsers();
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// implement the GET /users/:id endpoint
webapp.get('/users/:id', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbLib.getAUser(req.params.id);
    // console.log(results);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// get a user's password based on id
webapp.get('/users/:id', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbLib.getUser(req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ password: results.password });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/users/:id', async (req, res) => {
  // parse the body of the request
  if (!req.body.password) {
    res.status(404).json({ message: 'missing password' });
    return;
  }
  try {
    const result = await dbLib.updateUser(req.params.id, req.body.password);
    // send the response with the appropriate status code
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/** ------------------------------ The Post End Points ------------------------------ */

// GET FEEDS for User
webapp.get('/users/:id/feed', async (req, res) => {
  try {
    const results = await dbLib.getFeed(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// GET Post by a User
webapp.get('/users/:id/posts', async (req, res) => {
  try {
    const results = await dbLib.getUserPosts(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// GET ONE
webapp.get('/posts/:id', async (req, res) => {
  try {
    const results = await dbLib.getAPost(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// POST
webapp.post('/posts/', async (req, res) => {
  // console.log('CREATE a post');
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 20 * 1024 * 1024; // 2MB
  form.keepExtensions = true;
  // const uploadFolder = path.join(__dirname, 'files');
  // form.uploadDir = uploadFolder;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(409).json({ error: err.message });
      return;
    }
    if (Object.keys(files).length === 0 || !fields.userId) {
      res
        .status(404)
        .json({ error: 'must have a photo and userId to create post' });
      return;
    }

    // upload file to AWS s3
    // the following code assume there are multiple files
    // but in our implementation, there is only one file.
    const photoUrls = [];
    await Promise.all(
      Object.keys(files).map(async (key) => {
        const value = files[key];
        try {
          if (value.size > form.maxFileSize) throw Error('File too large');
          const data = await s3manips.uploadFile(value);
          photoUrls.push(data.Location);
        } catch (error) {
          res.status(404).json({ error: error.message });
        }
      })
    );

    const newPost = {
      ...fields,
      photo: photoUrls[0],
      comments: [],
      date: new Date()
    };
    // console.log(newPost);
    if (!newPost.userId || !newPost.photo)
      res.status(409).json({ message: 'error creating post' });
    // console.log(newPost);
    const data = await dbLib.addPost(newPost);
    res.status(201).json({ message: 'post created', data });
  });
});

// DELETE
webapp.delete('/posts/:id', async (req, res) => {
  try {
    const result = await dbLib.deletePost(req.params.id);
    res.status(200).json({ data: result, message: 'post deleted' });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// PUT
webapp.put('/posts/:id', async (req, res) => {
  // console.log('UPDATE a post');
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 20 * 1024 * 1024; // 2MB
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(409).json({ error: err.message });
      return;
    }

    // upload new file to AWS s3
    const photoUrls = [];
    await Promise.all(
      Object.keys(files).map(async (key) => {
        const value = files[key];
        try {
          if (value.size > form.maxFileSize) throw Error('File too large');
          const data = await s3manips.uploadFile(value);
          photoUrls.push(data.Location);
        } catch (error) {
          res.status(404).json({ error: error.message });
        }
      })
    );

    const newPost = {
      title: fields.title,
      photo: photoUrls[0] || fields.photo,
      caption: fields.caption || '',
      comments: fields.comments || [],
      date: new Date()
    };

    try {
      const result = await dbLib.updatePost(req.params.id, newPost);
      res.status(200).json({ message: result });
    } catch (error) {
      res.status(404).json({ message: 'there was error' });
    }
  });
});

// Hide a Post
webapp.post('/users/hidden/:id', async (req, res) => {
  // console.log('try to hide post', req.params.id, req.body.userId);
  try {
    const result = await dbLib.hideAPost(req.body.userId, req.params.id);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/** ------------------------------ The Comment End Points ------------------------------*/
// POST
webapp.post('/comments/', async (req, res) => {
  // console.log('CREATE a comment');
  if (!req.body.text || !req.body.userId) {
    res.status(404).json({ message: 'your comment must have text' });
    return;
  }
  try {
    const result = await dbLib.addComment(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

// GET ONE
webapp.get('/comments/:id', async (req, res) => {
  // console.log('GET a comment');
  try {
    const results = await dbLib.getAComment(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    // console.log('server.js: error catched');
    res.status(404).json({ message: 'there was error' });
  }
});

// get comments of a post
webapp.get('/posts/:id/comments', async (req, res) => {
  try {
    const results = await dbLib.getPostComments(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'comment not found for the post' });
  }
});

// DELETE
webapp.delete('/comments/:id', async (req, res) => {
  try {
    const result = await dbLib.deleteComment(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// PUT
webapp.put('/comments/:id', async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ message: 'must contain text content to update' });
    return;
  }
  try {
    const result = await dbLib.updateComment(req.params.id, req.body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/** ------------------------------ Like End Points ------------------------------*/
// like or unlike a post
webapp.post('/posts/:id/like', async (req, res) => {
  // get the userId from jwt authorization header (will implement when auth ready):
  // const token = req.headers.authoriztion.split('')[1];
  // const decoded = jwt.verify(token, secret);
  // const authId = decoded.userId;
  let result;

  try {
    // find out if user have liked the post or not:
    const liked = await dbLib.likeStatus(req.params.id, req.body.userId);
    if (!liked) {
      result = await dbLib.likePost(req.params.id, req.body.userId);
    } else {
      result = await dbLib.unlikePost(req.params.id, req.body.userId);
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'post not found' });
  }
});

// check if a user has liked a post
webapp.post('/posts/:id/liked', async (req, res) => {
  // get the userId from jwt authorization header (will implement when auth ready):
  // const token = req.headers.authoriztion.split('')[1];
  // const decoded = jwt.verify(token, secret);
  // const authId = decoded.userId;
  let result;
  try {
    // find out if user have liked the post or not:
    result = await dbLib.likeStatus(req.params.id, req.body.userId);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'post not found' });
  }
});

/** ------------------------------ Follow End Points ------------------------------*/
// GET follower suggestioins
webapp.get('/follower-suggestions/:id', async (req, res) => {
  try {
    // userId of whom the id is following
    const followingIds = await dbLib
      .getFollowingIds(req.params.id)
      .then((data) => data.map((id) => id.toString()));
    const followingIdSet = new Set(followingIds);
    // userIds of users who have similar taste to the id (following the same person)
    // excluding users whom the current user is already following
    const sameTasteIds = [];
    // userIds of users to recommend (following at least 3+ same users)
    const suggestUserIdSet = new Set();
    // key = userId, value = number of same following they share with id
    const sameTasteCounts = {};
    await Promise.all(
      followingIds.map(async (followingId) => {
        const candidates = await dbLib
          .getFollowerIds(followingId)
          .then((data) => data.map((id) => id.toString()));
        candidates.forEach((id) => {
          if (!followingIdSet.has(id)) sameTasteIds.push(id);
        });
      })
    );
    sameTasteIds.forEach((id) => {
      if (
        id.toString() === req.params.id || // exclude the user self
        followingIdSet.has(id.toString()) // exclude users already following
      )
        return;
      const count = (sameTasteCounts[id] || 0) + 1;
      sameTasteCounts[id] = count;
      if (count === 3) suggestUserIdSet.add(id);
    });
    const total = req.query.limit || 6;
    const suggestUserIds = Array.from(suggestUserIdSet);
    const suggestedUsers = [];
    suggestedUsers.push(...(await dbLib.getAFewUsers(suggestUserIds)));
    // fill the suggestion list with other random users
    if (suggestUserIds.length < total) {
      suggestedUsers.push(
        ...(await dbLib.getRandomUsers(total - suggestUserIds.length, [
          ...suggestUserIds, // users already suggested based on taste
          ...followingIds, // users already following
          req.params.id // user self
        ]))
      );
    }
    res.status(200).json(suggestedUsers);
  } catch (err) {
    res.status(404).json({ message: `${err.message}` });
  }
});

// // GET see if following
// webapp.get('/follows/:follower/:following', async (req, res) => {
//   try {
//     // userId of whom the id is following
//     console.log(req.params.follower);
//     const followRelation = await dbLib
//       .getFollowRelationshipBetween(req.params.follower, req.params.following)
//       .then((data) => data);
//     res.status(200).json(followRelation);
//   } catch (err) {
//     res.status(404).json({ message: `${err.message}` });
//   }
// });

// POST follow someone
webapp.post('/follows/', async (req, res) => {
  // console.log('CREATE a follow relationship');
  // console.log(req.body);
  if (!req.body.follower || !req.body.following) {
    res.status(404).json({ message: 'missing follower or following' });
    return;
  }
  if (req.body.follower === req.body.following) {
    res.status(409).json({ message: 'cannot follow yourself' });
    return;
  }
  try {
    const result = await dbLib.follow(req.body.follower, req.body.following);
    res.status(201).json({
      data: result,
      message:
        result.matchedCount === 0
          ? 'Followed successfully'
          : 'Follow relationship already exists'
    });
  } catch (err) {
    // console.log(err.message);
    res.status(409).json({ message: err.message });
  }
});

// DELETE unfollow someone
webapp.delete('/follows/', async (req, res) => {
  // console.log('DELETE a follow relationship');
  if (!req.body.follower || !req.body.following) {
    res.status(404).json({ message: 'missing follower or following' });
    return;
  }
  try {
    const result = await dbLib.unfollow(req.body.follower, req.body.following);
    res.status(200).json({
      data: result,
      message:
        result.deletedCount !== 0
          ? 'unfollowed successfully'
          : "Follow relationship doesn't exist"
    });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

module.exports = webapp;
