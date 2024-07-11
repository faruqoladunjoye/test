const jwt = require('jsonwebtoken');
const config = require('../config');

const secretKey = config.jwt.secret;

const generateToken = (user) => {
  const payload = {
    userId: user.userId,
    email: user.email,
  };
  return jwt.sign(payload, secretKey, { expiresIn: config.jwt.accessExpirationMinutes });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
