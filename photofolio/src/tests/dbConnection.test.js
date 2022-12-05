const {
  getFollowers,
  getFollowings,
  getAUser,
  getUsers,
  getPosts,
  getFeed
} = require('../components/dbConnection');
const {
  closeMongoDBConnection,
  connect
} = require('../components/dbConnection');

describe('test db operations not tested elsewhere', () => {
  let db;
  let mongo;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db('photofolio');
  });

  afterAll(async () => {
    // await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
    return 1;
  });

  test('test getFollowers', async () => {
    expect(await getFollowers(123)).not.toBeNull();
  });

  test('test getFollowing', async () => {
    expect(await getFollowings(123)).not.toBeNull();
  });

  test('test getAUser', async () => {
    expect(await getAUser(123)).not.toBeNull();
  });

  test('test getUsers', async () => {
    expect(await getUsers()).not.toBeNull();
  });

  test('test getPosts', async () => {
    expect(await getPosts()).not.toBeNull();
  });

  test('test getFeed', async () => {
    expect(await getFeed()).not.toBeNull();
  });
});
