var express = require('express');
var router = express.Router();

const users = require('../controllers/users.controller')

/* Authentication Routes. */
router.get('/dashboard', users.getDashboard);


module.exports = router;
