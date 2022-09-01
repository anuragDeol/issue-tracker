const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects_controller');

router.post('/create', projectsController.create);

module.exports = router;