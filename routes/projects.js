const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects_controller');

router.post('/create', projectsController.create);
router.get('/:id', projectsController.home);
router.use('/issues', require('./issues'));

module.exports = router;