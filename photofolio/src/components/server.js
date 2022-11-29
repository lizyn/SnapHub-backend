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
const port = 8080;

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));

// (7) import the db interactions module
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

const newPost = {
  photo: '/',
  userId: 1,
  text: 'newpost',
  description: 'test description',
  comments: [],
  likes: 0
};

const newComment = {
  userId: 2,
  text: 'new comment test',
  postId: 1
};

// start the server and connect to the DB
webapp.listen(port, async () => {
  db = await dbLib.connect();
  console.log(`Server running on port: ${port}`);
});

// root endpoint / route
webapp.get('/', (req, resp) => {
  resp.json({ message: 'welcome to our backend!!!' });
});

// implement the GET /students endpoint
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

// implement the GET /student/:id endpoint
webapp.get('/user/:id', async (req, res) => {
  console.log('GET a user');
  try {
    // get the data from the db
    const results = await dbLib.getAStudent(db, req.params.id);
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

// GET ALL
webapp.get('/users/:id/feed', async (req, res) => {
  console.log('GET feed for the user');
  try {
    const results = await dbLib.getFeed(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'resource not found' });
  }
});

// GET ONE
webapp.get('/posts/:id', async (req, res) => {
  console.log('GET a post');
  try {
    const results = await dbLib.getAStudent(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// POST
webapp.post('/posts/', async (req, res) => {
  console.log('CREATE a post');
  if (!req.body.photo || !req.body.userId) {
    res.status(404).json({ message: 'must have a photo to create post' });
    return;
  }
  try {
    const result = await dbLib.addPost(newPost);
    res.status(201).json({ data: { id: result, ...newPost } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

// DELETE
webapp.delete('/posts/:id', async (req, res) => {
  console.log('DELETE a post');
  try {
    const result = await dbLib.deletePost(req.params.id);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// PUT
webapp.put('/posts/:id', async (req, res) => {
  console.log('UPDATE a post');
  if (!req.body.photo) {
    res.status(404).json({ message: 'must contain a photo to update' });
    return;
  }
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
    const result = await dbLib.addComment(newComment);
    res.status(201).json({ data: { id: result, ...newComment } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

// DELETE
webapp.delete('/comments/:id', async (req, res) => {
  console.log('DELETE a comment');
  try {
    const result = await dbLib.deleteComments(req.params.id);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// PUT
webapp.put('/comments/:id', async (req, res) => {
  console.log('UPDATE a comment');
  if (!req.body.text) {
    res.status(404).json({ message: 'must contain text content to update' });
    return;
  }
  try {
    const result = await dbLib.updatePost(req.params.id, req.body);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

module.exports = webapp;
