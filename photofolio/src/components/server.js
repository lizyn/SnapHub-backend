// Express app file

// (1) import express
// backend ==> require
const express = require('express');

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require('cors');

// (3) create an instanece of our express app
const webapp = express();

// (4) enable cors
webapp.use(cors());

// (5) define the port
// const port = 8080;

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());

// (7) import the aws and db interactions module
const path = require('path');
const formidable = require('formidable');
const s3manips = require('./s3manips');
const dbLib = require('./dbConnection');

// (8) declare a db reference variable
let db;

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
//   db = await dbLib.connect();
//   console.log(`Server running on port: ${port}`);
// });

// root endpoint / route
//webapp.get('/', (req, resp) => {
// resp.json({ message: 'welcome to our backend!!!' });
//});

// login
/*
webapp.get(`/account/username=${user}&password=${pwd}`, async (req, res) => {
  try {
    const results = await dbLib.closeMongoDBConnection(
      db,
      req.params.username,
      req.params.password
    );
    if (results === null) {
      res.status(401).json({ message: 'wrong password' });
      return;
    }
    res.status(201).json({ data: { id: results._id, ...results } });
  } catch (err) {
    res.status(404).json({ message: 'There is an login error' });
  }
});
*/
// login v2
// webapp.get(`/users/`, async (req, res) => {
//   try {
//     const results = await dbLib.closeMongoDBConnection(
//       db,
//       req.params.username,
//       req.params.password
//     );
//     if (results === null) {
//       res.status(401).json({ message: 'wrong password' });
//       return;
//     }
//     res.status(201).json({ data: { id: results._id, ...results } });
//   } catch (err) {
//     res.status(404).json({ message: 'There is an login error' });
//   }
// });

// //register
// webapp.post('/users', async (req, res) => {
//   if (!req.body || !req.body.username || !req.body.password) {
//     res.status(404).json({ message: 'missing information in registration' });
//     return;
//   }
//   const newUser = {
//     username: req.body.username,
//     user_avatar: '/',
//     following: [],
//     followed: [],
//     password: req.body.password
//   };
//   try {
//     const result = await dbLib.register(db, newUser);
//     res.status(201).json({
//       user: { id: result, ...newUser }
//     });
//   } catch (err) {
//     res.status(404).json({ message: err });
//   }
// });

// implement the GET /users endpoint
webapp.get('/users', async (req, res) => {
  console.log('GET all users');
  try {
    // get the data from the db
    const results = await dbLib.getUsers(db);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// implement the GET /user/:id endpoint
webapp.get('/user/:id', async (req, res) => {
  console.log('GET a user');
  try {
    // get the data from the db
    const results = await dbLib.getAUser(db, req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// get a user's password based on id
webapp.get('/user/:id', async (req, res) => {
  console.log("GET user's password");
  try {
    // get the data from the db
    const results = await dbLib.getUser(req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ password: results.password });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.put('/user/:id', async (req, res) => {
  console.log("UPDATE a user's password");
  // parse the body of the request
  if (!req.body.password) {
    res.status(404).json({ message: 'missing password' });
    return;
  }
  try {
    const result = await dbLib.updateUser(req.params.id, req.body.password);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/** ------------------------------ The Post End Points ------------------------------ */

// GET FEEDS for User
webapp.get('/users/:id/feed', async (req, res) => {
  console.log('GET feed for the user');
  try {
    const results = await dbLib.getFeed(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// GET Post by a User
webapp.get('/users/:id/posts', async (req, res) => {
  console.log('GET posts by a user');
  try {
    const results = await dbLib.getUserPosts(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// GET ONE
webapp.get('/posts/:id', async (req, res) => {
  console.log('GET a post');
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
          const data = await s3manips.uploadFile(value);
          photoUrls.push(data.Location);
        } catch (error) {
          throw Error(error.message);
        }
      })
    );

    const newPost = {
      ...fields,
      photo: photoUrls[0]
    };
    if (!newPost.userId || !newPost.photo)
      res.status(409).json({ message: 'error creating post' });
    // console.log(newPost);
    const data = await dbLib.addPost(newPost);
    res.status(201).json({ message: 'post created', data });
  });
});

// DELETE
webapp.delete('/posts/:id', async (req, res) => {
  console.log('DELETE a post');
  try {
    const result = await dbLib.deletePost(req.params.id);
    res.status(200).json({ data: result, message: 'post deleted' });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// PUT
webapp.put('/posts/:id', async (req, res) => {
  console.log('UPDATE a post');
  // if (!req.body.photo) {
  //   res.status(404).json({ message: 'must contain a photo to update' });
  //   return;
  // }
  try {
    const result = await dbLib.updatePost(req.params.id, req.body);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});
/** ------------------------------ The Comment End Points ------------------------------*/
// POST
webapp.post('/comments/', async (req, res) => {
  console.log('CREATE a comment');
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
  console.log('GET a comment');
  try {
    const results = await dbLib.getAComment(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    console.log('server.js: error catched');
    res.status(404).json({ message: 'there was error' });
  }
});

// DELETE
webapp.delete('/comments/:id', async (req, res) => {
  console.log('DELETE a comment');
  try {
    const result = await dbLib.deleteComment(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// PUT
webapp.put('/comments/:id', async (req, res) => {
  console.log('UPDATE a comment');
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

/** ------------------------------ Follow End Points ------------------------------*/
// GET follower suggestioins
webapp.get('/follower-suggestions/:id', async (req, res) => {
  try {
    // userId of whom the id is following
    const followingIds = await dbLib.getFollowingIds(req.params.id);
    // userIds of users who have similar taste to the id (following the same person)
    const sameTasteIds = [];
    // userIds of users to recommend (following at least 3+ same users)
    const suggestUserIdSet = new Set();
    // key = userId, value = number of same following they share with id
    const sameTasteCounts = {};
    await Promise.all(
      followingIds.map(async (followingId) => {
        sameTasteIds.push(...(await dbLib.getFollowerIds(followingId)));
      })
    );
    sameTasteIds.forEach((id) => {
      if (id === req.params.id || id.toString() === req.params.id) return; // skip the user themselves
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
          ...suggestUserIds,
          req.params.id
        ]))
      );
    }
    res.status(200).json(suggestedUsers);
  } catch (err) {
    res.status(404).json({ message: `${err.message}` });
  }
});

// POST follow someone
webapp.post('/follows/', async (req, res) => {
  console.log('CREATE a follow relationship');
  if (!req.body.follower || !req.body.following) {
    res.status(404).json({ message: 'missing follower or following' });
    return;
  }
  try {
    const result = await dbLib.follow(req.body.follower, req.body.following);
    res.status(201).json({ data: result, message: 'followed successfully' });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
});

// DELETE unfollow someone
webapp.delete('/follows/', async (req, res) => {
  console.log('DELETE a follow relationship');
  if (!req.body.follower || !req.body.following) {
    res.status(404).json({ message: 'missing follower or following' });
    return;
  }
  try {
    const result = await dbLib.unfollow(req.body.follower, req.body.following);
    res.status(201).json({ data: result, message: 'unfollowed successfully' });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

module.exports = webapp;
