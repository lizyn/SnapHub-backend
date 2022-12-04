const dbLib = require('./dbConnection'); 
const { request } = require('./server');
const webapp = require('./server');
const url =
  'mongodb+srv://admin:55736photofolio@cluster557-project36.a1psu00.mongodb.net/?retryWrites=true&w=majority';
const falseurl = 
'mongodb+srv://admin:55736photofolio@cluster557-project36.a1psu00.mongodb.net/falsedb?retryWrites=true&w=majority';
let db;

  // cleanup the database after each test
  const clearDatabase = async (db) => {
    try {
      const result = await db.collection('users').deleteOne({ username: 'testuser' });
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


afterEach(async () => {
    await clearDatabase(db);
 });

 describe('Database operations tests', () => {
    // test data
    const testuser = {
      username: "testuser",
      user_avatar: '/',
      following: [],
      followed: [],
      password: "QEWRasdf1234!",
    };
    test('Register test', async () => {
        db = await dbLib.connect(url);
        await dbLib.register(db, testuser);
        // find new user in the DB
        const insertedUser = await db.collection('users').findOne({ username: 'testuser' });
        expect(insertedUser.username).toEqual('testuser');
    });

    test('register exception', async () => {
      db = await dbLib.connect(falseurl);
      try{
        await dbLib.register(db, testuser)
      } catch(err){
        expect(err.message).toBe('Error in register the user');
      }
  });
    test('login test', async() => {
      db = await dbLib.connect(url);
      await dbLib.register(db, testuser);
      const resp = await request(webapp).get(`/login/username=${testuser.username}&password=${testuser.password}`);
      expect(resp.status).toEqual(201);
      const userinfo = JSON.parse(result.data).data;
      expect(userinfo.username).toBe("testuser");
      expect(userinfo.password).toBe("QEWRasdf1234!");
    })
});