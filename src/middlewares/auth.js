const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const config = require('../config/config');
const catchAsync = require('../utils/catchAsync');

const secretKey = config.jwt.secret;

const auth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, secretKey);
  const user = await db.users.findByPk(decoded.userId);

  if (!user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found.'));
  }

  req.user = user;

  if (req.params.userId && req.user.id !== req.params.userId) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden!'));
  }

  next();
});

module.exports = {
  auth,
};
