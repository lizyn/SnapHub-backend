const request = require('supertest');
const { ObjectId } = require('mongodb');
const path = require('path');
const { closeMongoDBConnection, connect } = require('./dbConnection');
const webapp = require('./server');

let mongo;

describe('POST post(s) endpoint integration test', () => {
  let db;
  let testPostID;
  let testCmtID;
  let testFollowId;
  const testUserID = '638682d7b47712e0d260ce8b';
  const testFollower = testUserID;
  const testFollowing = '63899e8d4bd2e0bd159d0e16';
  const testFileName = 'testFile.jpg';
  const testFilePath = path.join(__dirname, testFileName);
  //   test resource to create / expected response
  //   const testFollowee = {
  //     firstName: 'test',
  //     lastName: 'testson',
  //     userName: 'thebest21',
  //     email: 'test@upenn.edu',
  //     password: 'secret',
  //     description: 'hello',
  //     following: []
  //   };

  //   const testFollowedA = {
  //     firstName: 'being',
  //     lastName: 'followedA',
  //     userName: 'followedA',
  //     email: 'fA@upenn.edu',
  //     password: 'secret',
  //     description: 'I am followed',
  //     following: []
  //   };

  //   const testPost = {
  //     photo: 'someurl.jpg',
  //     userId: '638682d7b47712e0d260ce8b',
  //     text: 'test',
  //     description: 'test description'
  //     // comments: ['']
  //   };

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db('photofolio');
  });

  const clearDatabase = async () => {
    let result;
    try {
      result = await db
        .collection('posts')
        .deleteOne({ _id: ObjectId(testPostID) });
      //   const postdeleted = result.deletedCount;
      //   console.log(result);
      //   if (postdeleted >= 1) {
      //     console.log('info', 'Successfully deleted test post');
      //   } else {
      //     console.log('warning', 'test post was not deleted');
      //   }
      result = await db
        .collection('comments')
        .deleteOne({ _id: ObjectId(testCmtID) });
      //   const commentdeleted = result.deletedCount;
      //   console.log(result);
      //   if (commentdeleted >= 1) {
      //     console.log('info', 'Successfully deleted test comment');
      //   } else {
      //     console.log('warning', 'test comment was not deleted');
      //   }
    } catch (err) {
      return err.message;
    }
    return result;
  };

  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
    return 1;
  });

  test('Follow fails with 404 if any required field is missing', async () => {
    const resp = await request(webapp)
      .post('/follows/')
      .send(`follower=${testFollower}`);

    expect(resp.status).toEqual(404);
  });

  test('Follow fails with 409 if any required field is invalid', async () => {
    const resp = await request(webapp)
      .post('/follows/')
      .send(`follower=${testFollower}&following=${testFollower}`);

    expect(resp.status).toEqual(409);
  });

  test('Follow a user returns 201 if request is valid', async () => {
    const resp = await request(webapp)
      .post('/follows/')
      .send(`follower=${testFollower}&following=${testFollowing}`);

    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');

    const { data } = JSON.parse(resp.text);
    // console.log(data);
    testFollowId = data.upsertedId;
    if (data.matchedCount === 0)
      await db.collection('follows').deleteOne({ _id: ObjectId(testFollowId) });
  });

  test('Status code is 201 if any required field is missing', async () => {
    const resp = await request(webapp)
      .post('/posts')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', '5d921d306e96d70a28989127')
      .attach('testimage', testFilePath);
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');
    testPostID = JSON.parse(resp.text).data.insertedId;
  });

  test('Status code is 404 if any required field (file) is missing', async () => {
    const resp = await request(webapp)
      .post('/posts')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', '5d921d306e96d70a28989127');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('create a comment returns 201 if request is valid', async () => {
    const resp = await request(webapp)
      .post(`/comments/`)
      .send(
        `text=test comment&userId=638682d7b47712e0d260ce8b&postId=${testPostID}`
      );
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');
    testCmtID = JSON.parse(resp.text).data.insertedId;
    // const newPost = JSON.parse(resp.text).data;
    // expect(newPost).toMatchObject({
    //   _id: testPostID,
    //   comments: ['', testCmtID],
    //   ...testPost
    // });
  });

  test('Status code is 404 if any required field is missing for new comment', async () => {
    const resp = await request(webapp)
      .post(`/comments/`)
      .send(`userId=638682d7b47712e0d260ce8b&postId=${testPostID}`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});
