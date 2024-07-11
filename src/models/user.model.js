const Sequelize = require('sequelize');

module.exports = (sequelize, dataType) => {
  const user = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    firstName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },

    lastName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },

    email: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },

    phoneNumber: {
      type: dataType.STRING,
      allowNull: true,
      validate: {
        isPhoneNumber: function (value) {
          if (!value) return;
          if (!/^0\d{10}$/.test(value)) {
            throw new Error('Invalid phone number format');
          }
        },
      },
    },
  });

  return user;
};
