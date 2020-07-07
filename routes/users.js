var express = require('express');
var router = express.Router();

const users = require('../controllers/users.controller')

const auth = require("../middleware/auth")

router.use('/', auth.checkUser)

/* Authentication Routes. */
router.get('/dashboard', users.getDashboard);

module.exports = router;
