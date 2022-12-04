const request = require('supertest');
const { ObjectId } = require('mongodb');
const path = require('path');
const { closeMongoDBConnection, connect } = require('./dbConnection');
const webapp = require('./server');
const s3manips = require('./s3manips');

let mongo;

describe('GET post(s) endpoint integration test', () => {
  let db;
  let testPostID;
  let testCmtID;
  const testUserID = '638682d7b47712e0d260ce8b';
  const testFileName = 'testFile.jpg';
  const testNullFileName = 'testFile.jpg+null';
  const testFilePath = path.join(__dirname, testFileName);
  const testNullFilePath = path.join(__dirname, testNullFileName);
  const downloadDir = path.join(__dirname, '/test_download');

  beforeAll(async () => {
    try {
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
      // eslint-disable-next-line no-underscore-dangle
      console.log(JSON.parse(rescmt.text).data);
      testCmtID = JSON.parse(rescmt.text).data.insertedId;
    } catch (err) {
      console.log(err.message);
    }
  });

  const clearDatabase = async () => {
    let result;
    try {
      result = await db
        .collection('posts')
        .deleteOne({ _id: ObjectId(testPostID) });
      // const postdeleted = result.deletedCount;
      // if (postdeleted >= 1) {
      //   console.log('info', 'Successfully deleted test post');
      // } else {
      //   console.log('warning', 'test post was not deleted');
      // }
      result = await db
        .collection('comments')
        .deleteOne({ _id: ObjectId(testCmtID) });
      // const commentdeleted = result.deletedCount;
      // console.log(result);
      // if (commentdeleted >= 1) {
      //   console.log('info', 'Successfully deleted test comment');
      // } else {
      //   console.log('warning', 'test comment was not deleted');
      // }
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

  test("Get user's posts endpoint status code and data", async () => {
    const resp = await request(webapp).get(`/users/${testUserID}/posts/`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    //   const postArr = JSON.parse(resp.text).data;
    //   expect(postArr).toEqual(
    //     expect.arrayContaining([
    //       { _id: testPostID, comments: ['', testCmtID], ...testPost }
    //     ])
    //   );
  });

  test('Status code is 404 if user not found / has no post', async () => {
    const resp = await request(webapp).get(`/users/2022/posts/`);
    expect(resp.status).toEqual(404);
  });

  test('Get a post endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/posts/${testPostID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const newpost = JSON.parse(resp.text).data;
    expect(newpost).toEqual(
      expect.arrayContaining([
        {
          _id: testPostID,
          comments: ['', testCmtID],
          ...testPost
        }
      ])
    );
  });

  test("Status code is 404 if post doesn't exist", async () => {
    const resp = await request(webapp).get(`/posts/testPostID`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test('Get a comment endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/comments/${testCmtID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const cmtArr = JSON.parse(resp.text).data;
    expect(cmtArr).toEqual(
      expect.arrayContaining([
        {
          _id: testCmtID,
          postId: testPostID,
          text: 'test comment',
          userId: testUserID
        }
      ])
    );
  });
});
