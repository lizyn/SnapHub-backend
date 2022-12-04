const request = require('supertest');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('./dbConnection');
const webapp = require('./server');

let mongo;

describe('GET post(s) endpoint integration test', () => {
  let db;
  let testCmtID;
  let testPostID;
  const testUserID = '638682d7b47712e0d260ce8b';
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

    // create a post for tests
    const res = await db.collection('posts').insertOne(testPost);
    testPostID = res.insertedId;
    // create a comment for tests
    const rescmt = await request(webapp)
      .post('/comments/')
      .send(
        `text=test%20comment&userId=638682d7b47712e0d260ce8b&postId=${testPostID}`
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

  test('Get follower recommendation', async () => {
    const resp = await request(webapp).get(
      `/follower-suggestions/${testUserID}/`
    );
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
  });

  test('Get follower recommendation 404 with invalid id', async () => {
    const resp = await request(webapp).get(`/follower-suggestions/${1}/`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });

  test("Get user's posts endpoint status code and data", async () => {
    const resp = await request(webapp).get(`/users/${testUserID}/posts/`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // const postArr = JSON.parse(resp.text).data;
    // expect(postArr).toEqual(
    //   expect.arrayContaining([
    //     { _id: testPostID, comments: [testCmtID], ...testPost }
    //   ])
    // );
  });

  test('Status code is 404 if user not found / has no post', async () => {
    const resp = await request(webapp).get(`/users/2022/posts/`);
    expect(resp.status).toEqual(404);
  });

  test('Get a post endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/posts/${testPostID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // const newpost = JSON.parse(resp.text).data;
    // expect(newpost).toEqual(
    //   expect.arrayContaining([
    //     {
    //       _id: testPostID,
    //       comments: [testCmtID],
    //       ...testPost
    //     }
    //   ])
    // );
  });

  test('Status code is 404 if user not found / has no post', async () => {
    const resp = await request(webapp).get(`/users/2022/posts/`);
    expect(resp.status).toEqual(404);
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
    // const cmtArr = JSON.parse(resp.text).data;
    // expect(cmtArr).toEqual(
    //   expect.arrayContaining([
    //     {
    //       _id: testCmtID,
    //       postId: testPostID,
    //       text: 'test comment',
    //       userId: testUserID
    //     }
    //   ])
    // );
  });
});
