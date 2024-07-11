const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const ApiError = require('../utils/ApiError');
const { db } = require('./../models');

const register = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  const existingUser = await db.users.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.users.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  const organizationName = `${firstName}'s Organization`;
  const organization = await db.organization.create({
    name: organizationName,
    description: '',
  });

  await organization.addUser(user);

  const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.accessExpirationMinutes });
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Registration successful',
    data: {
      accessToken: token,
      user: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.users.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Login details');
  }

  const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpirationMinutes,
  });

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Login successful',
    data: {
      accessToken: token,
      user: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    },
  });
});

module.exports = {
  register,
  login,
};
