const Joi = require('joi');

const createOrganization = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
};

const getOrganizationById = {
  params: Joi.object().keys({
    orgId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
};

const getOrganizations = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const addUserToOrganization = {
  params: Joi.object().keys({
    orgId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
  body: Joi.object().keys({
    userId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
};

module.exports = {
  createOrganization,
  getOrganizationById,
  getOrganizations,
  addUserToOrganization,
};
