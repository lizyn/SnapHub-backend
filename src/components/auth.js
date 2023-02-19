// import jwt
const jwt = require('jsonwebtoken');

// import the db interactions module
const dbLib = require('./dbConnection');

/**
 * autheticates a user by decoding the JWT
 * @returns true if the user is valid
 */
const authenticateUser = async (token, key) => {
  // check the params
  if (token === null || key === null || !key) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, key);
    // verify the user
    const user = await dbLib.getAUser(decoded.username);
    // console.log('user', user[0]);
    // check the user
    if (!user[0]) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { authenticateUser };
