const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    DB_URL: Joi.string(),
    DIALECT: Joi.string(),
    // DB_HOST: Joi.string(),
    // DB_NAME: Joi.string(),
    // DB_USER: Joi.string(),
    // DB_PASSWORD: Joi.string(),
    // DB_PORT: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sequelize: {
    url: envVars.DB_URL,
    dialect: envVars.DIALECT,
    // host: envVars.DB_HOST,
    // database: envVars.DB_NAME,
    // user: envVars.DB_USER,
    // password: envVars.DB_PASSWORD,
    // port: envVars.DB_PORT,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};
