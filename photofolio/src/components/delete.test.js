const request = require('supertest');
const { ObjectId } = require('mongodb');
const path = require('path');
const { closeMongoDBConnection, connect } = require('./dbConnection');
const webapp = require('./server');

let mongo;

describe('DELETE post(s) endpoint integration test', () => {
  let db;
  let testPostID;
  let testCmtID;
  const testFileName = 'testFile.jpg';
  const testFilePath = path.join(__dirname, testFileName);
  //   const testUserID = '638682d7b47712e0d260ce8b';
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

  const testPost = {
    photo: 'someurl.jpg',
    userId: '638682d7b47712e0d260ce8b',
    text: 'test',
    description: 'test description'
  };

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db('photofolio');
    const res = await request(webapp)
      .post('/posts')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', '5d921d306e96d70a28989127')
      .attach('testimage', testFilePath);
    testPostID = JSON.parse(res.text).data.insertedId;
    const rescmt = await request(webapp)
      .post('/comments/')
      .send(
        `text=test comment&userId=638682d7b47712e0d260ce8b&postId=${testPostID}`
      );
    // eslint-disable-next-line no-underscore-dangle
    testCmtID = JSON.parse(rescmt.text).data.insertedId;
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
      //     result = await db
      //       .collection('posts')
      //       .findOne({ _id: ObjectId(testPostID) });
      //     if (!result) console.log('test post is already deleted');
      //     else console.log('warning', 'test post was not deleted');
      //   }
      result = await db
        .collection('comments')
        .deleteOne({ _id: ObjectId(testCmtID) });
      //   const commentdeleted = result.deletedCount;
      //   console.log(result);
      //   if (commentdeleted >= 1) {
      //     console.log('info', 'Successfully deleted test comment');
      //   } else {
      //     result = await db
      //       .collection('comments')
      //       .findOne({ _id: ObjectId(testCmtID) });
      //     if (!result) console.log('test comment is already deleted');
      //     else console.log('warning', 'test comment was not deleted');
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

  test('Delete a post with id', async () => {
    const resp = await request(webapp).delete(`/posts/${testPostID}/`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
  });

  test("Status code is 404 if comment doesn't exist", async () => {
    const resp = await request(webapp).delete(`/posts/2`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('Delete a comment with id', async () => {
    const resp = await request(webapp).delete(`/comments/${testCmtID}/`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const nocmt = await request(webapp).get(`/comments/${testCmtID}/`);
    expect(nocmt.status).toEqual(404);
  });

  test("Status code is 404 if comment doesn't exist", async () => {
    const resp = await request(webapp).get(`/comments/2`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});
