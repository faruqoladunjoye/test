const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { db } = require('../models');

const createOrganization = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const existingOrg = await db.organization.findOne({ where: { name } });
  if (existingOrg) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization with the same name already exists');
  }

  const organization = await db.organization.create({
    name,
    description,
  });

  await organization.addUser(userId);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    message: 'Organization created successfully',
    data: {
      orgId: organization.id,
      name: organization.name,
      description: organization.description,
    },
  });
});

const getOrganizationById = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const userId = req.user.id;

  const organization = await db.organization.findOne({
    where: { id: orgId },
    include: {
      model: db.users,
      as: 'users',
      where: { id: userId },
    },
  });

  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Organization fetched successfully',
    data: {
      orgId: organization.id,
      name: organization.name,
      description: organization.description,
    },
  });
});

const getOrganizations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const options = {
    offset: (page - 1) * limit,
    limit,
  };

  const { count, rows: organizations } = await db.organization.findAndCountAll({
    limit: options.limit,
    offset: options.offset,
    include: {
      model: db.users,
      as: 'users',
      where: { id: userId },
    },
  });
  const totalPages = Math.ceil(count / limit);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Organizations fetched successfully',
    data: {
      organizations: organizations.map((org) => ({
        orgId: org.id,
        name: org.name,
        description: org.description,
      })),
    },
    page,
    limit,
    totalPages,
  });
});

const addUserToOrganization = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  const organization = await db.organization.findByPk(orgId);

  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  await organization.addUser(userId);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'User added to organization successfully',
  });
});

module.exports = {
  createOrganization,
  getOrganizationById,
  getOrganizations,
  addUserToOrganization,
};
