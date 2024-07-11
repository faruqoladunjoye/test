const Joi = require('joi');

const getUser = {
  params: Joi.object().keys({
    userId: Joi.alternatives()
      .try(Joi.string().guid({ version: 'uuidv4' }), Joi.string().valid('general'))
      .required(),
  }),
};

module.exports = {
  getUser,
};
