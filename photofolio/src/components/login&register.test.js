const request = require('supertest');
const dbLib = require('./dbConnection');
const webapp = require('./server');

let db;
let mongo;

// cleanup the database after each test
const clearDatabase = async (dbs) => {
  try {
    const result = await dbs
      .collection('users')
      .deleteOne({ username: 'testuser' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted testuser');
    } else {
      console.log('warning', 'testuser was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add - "jest": true -
 */
describe('Database operations tests', () => {
  beforeAll(async () => {
    try {
      mongo = await dbLib.connect();
      db = mongo.db('hw5');
    } catch (err) {
      throw Error();
    }
  });
  afterEach(async () => {
    await clearDatabase(db);
  });

  afterAll(async () => {
    try {
      await mongo.close();
      await dbLib.closeMongoDBConnection();
    } catch (err) {
      return err;
    }
    return 1;
  });

  // test data
  const testuser = {
    username: 'testuser',
    password: 'QEWRasdf1234!'
  };
  test('Register test', async () => {
    await dbLib.register(testuser);
    // find new user in the DB
    const insertedUser = await db
      .collection('users')
      .findOne({ username: 'testuser' });
    expect(insertedUser.username).toEqual('testuser');
  });

  test('register exception', async () => {
    try {
      await dbLib.register(db, testuser);
    } catch (err) {
      expect(err.message).toBe('Error in register the user');
    }
  });
  // test('login test', async () => {
  //   await dbLib.register(testuser);
  //   const resp = await request(webapp).get(
  //     `/login/username=${testuser.username}&password=${testuser.password}`
  //   );
  //   expect(resp.status).toEqual(201);
  //   const userinfo = JSON.parse(resp.data).data;
  //   expect(userinfo.username).toBe('testuser');
  //   expect(userinfo.password).toBe('QEWRasdf1234!');
  // });
});
