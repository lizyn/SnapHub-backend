const dbLib = require('./dbConnection'); 
const webapp = require('./server');
const keys = require('./keys');
const { DB_USER, DB_PWD } = keys;
const url = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster557-project36.a1psu00.mongodb.net/?retryWrites=true&w=majority`;
const falseurl = 
'mongodb+srv://admin:55736photofolio@cluster557-project36.a1psu00.mongodb.net/falsedb?retryWrites=true&w=majority';
let db;

  // cleanup the database after each test
  const clearDatabase = async (db) => {
    try {
      const result = await db.collection('users').deleteOne({ username: 'testuser' });
      const { deletedCount } = result;
      console.log(deletedCount);
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
        await dbLib.register(testuser);
        // find new user in the DB
        const insertedUser = await db.collection('users').findOne({ username: 'testuser' });
        expect(insertedUser.username).toEqual('testuser');
    });

    test('register exception', async () => {
      db = await dbLib.connect(falseurl);
      try{
        await dbLib.register(testuser)
      } catch(err){
        expect(err.message).toBe('Error in register the user');
      }
  });
});