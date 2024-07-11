const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { db } = require('../models');

const getUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const user = await db.users.findByPk(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'User found',
    data: {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });
});

module.exports = {
  getUser,
};
