const express = require('express');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orgValidation = require('../validations/organization.validation');
const orgController = require('../controllers/organization.controller');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(orgValidation.createOrganization), orgController.createOrganization)
  .get(auth, validate(orgValidation.getOrganizations), orgController.getOrganizations);

router.get('/:orgId', auth, validate(orgValidation.getOrganizationById), orgController.getOrganizationById);
router.post('/:orgId/users', auth, validate(orgValidation.addUserToOrganization), orgController.addUserToOrganization);

module.exports = router;
