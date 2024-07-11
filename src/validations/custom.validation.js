const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
    return helpers.message('Password must contain at least one letter, one number and a special character');
  }
  return value;
};

const phoneNumber = (value, helpers) => {
  if (!/^0\d{10}$/.test(value)) {
    return helpers.message('Invalid Phone Number Format');
  }

  return value;
};

module.exports = {
  password,
  phoneNumber,
};
