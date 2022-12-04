const request = require('supertest');
const { ObjectId } = require('mongodb');
const path = require('path');
const { closeMongoDBConnection, connect } = require('./dbConnection');
const webapp = require('./server');

let mongo;

describe('GET post(s) endpoint integration test', () => {
  let db;
  let testPostID;
  let testCmtID;
  const testUserID = '638682d7b47712e0d260ce8b';
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

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db('photofolio');
    const res = await request(webapp)
      .post('/posts')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', '5d921d306e96d70a28989127')
      .attach('testimage', testFilePath);
    // const res = await request(webapp)
    //   .post('/posts/')
    //   .send(
    //     'photo=someurl.jpg&userId=638682d7b47712e0d260ce8b&text=test&description=test description&comments[]='
    //   );
    console.log(JSON.parse(res.text).data);
    testPostID = JSON.parse(res.text).data.insertedId;
    const rescmt = await request(webapp)
      .post('/comments/')
      .send(
        `text=test comment&userId=638682d7b47712e0d260ce8b&postId=${testPostID}`
      );
    console.log(JSON.parse(rescmt.text).data);
    testCmtID = JSON.parse(rescmt.text).data.insertedId;
  });

  const clearDatabase = async () => {
    let result;
    try {
      result = await db
        .collection('posts')
        .deleteOne({ _id: ObjectId(testPostID) });
      const postdeleted = result.deletedCount;
      console.log(result);
      if (postdeleted >= 1) {
        console.log('info', 'Successfully deleted test post');
      } else {
        console.log('warning', 'test post was not deleted');
      }
      result = await db
        .collection('comments')
        .deleteOne({ _id: ObjectId(testCmtID) });
      const commentdeleted = result.deletedCount;
      console.log(result);
      if (commentdeleted >= 1) {
        console.log('info', 'Successfully deleted test comment');
      } else {
        console.log('warning', 'test comment was not deleted');
      }
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
  });

  test('Update a post endpoint status code and data', async () => {
    const resp = await request(webapp)
      .put(`/posts/${testPostID}`)
      .send('description=test description edited');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
  });

  test("Status code is 404 if the post doesn't exist", async () => {
    const resp = await request(webapp)
      .put(`/posts/2`)
      .send('description=test description edited');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('Update comment endpoint status code and data', async () => {
    const resp = await request(webapp)
      .put(`/posts/${testCmtID}`)
      .send('text=text edited');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
  });

  test('Status code is 404 if comment not found', async () => {
    const resp = await request(webapp)
      .put(`/comments/1`)
      .send('text=text edited');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});
