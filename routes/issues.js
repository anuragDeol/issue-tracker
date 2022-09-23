const express = require('express');
const router = express.Router();

const issuesController = require('../controllers/issues_controller');

router.post('/create', issuesController.create);
router.post('/filter', issuesController.filter);
router.post('/search', issuesController.search);
router.get('/destroy/:id', issuesController.destroy);

module.exports = router;