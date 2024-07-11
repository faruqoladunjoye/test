const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');
const logger = require('../config/logger');

const db = {};

const sequelizeInstance = new Sequelize(sequelize.url, {
  dialect: sequelize.dialect,
  pool: {
    min: 0,
    max: 100,
    acquire: 5000,
    Idle: 1000,
  },
});

sequelizeInstance
  .authenticate()
  .then(() => logger.info('============== DB connected ============='))
  .catch((err) => {
    console.log(err);
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.users = require('./user.model')(sequelizeInstance, Sequelize);
db.organization = require('./organization.model')(sequelizeInstance, Sequelize);

db.organization.belongsToMany(db.users, {
  through: 'user_org',
  as: 'users',
  foreignKey: 'organizationId',
  onDelete: 'CASCADE',
});

db.users.belongsToMany(db.organization, {
  through: 'user_org',
  as: 'organizations',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = {
  db,
};
