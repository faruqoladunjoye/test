const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const organizationRoute = require('./organization.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/organizations',
    route: organizationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
