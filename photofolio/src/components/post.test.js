const request = require('supertest');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('./dbConnection');
const webapp = require('./server');

let mongo;

describe('GET post(s) endpoint integration test', () => {
  let db;
  let testPostID;
  let testCmtID;
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
    return 1;
  });

  test('create a post returns 201 if request is valid', async () => {
    const resp = await request(webapp)
      .post(`/posts/`)
      .send(
        'photo=someurl.jpg&userId=638682d7b47712e0d260ce8b&text=test&description=test description&comments[]=&likes=0'
      );
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe('application/json');
    testPostID = JSON.parse(resp.text).data.result.insertedId;
    console.log(`testPostId is ${testPostID}`);
  });

  test('Status code is 404 if any required field is missing', async () => {
    const resp = await request(webapp)
      .post(`/posts/`)
      .send(
        'userId=638682d7b47712e0d260ce8b&text=test&description=test description&comments[]=&likes=0'
      );
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
