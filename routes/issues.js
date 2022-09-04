const express = require('express');
const router = express.Router();

const issuesController = require('../controllers/issues_controller');

router.post('/create', issuesController.create);

module.exports = router;