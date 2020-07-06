var express = require('express');
var router = express.Router();

const auth = require('../controllers/auth.controller')

/* Authentication Routes. */
router.get('/login', auth.getLogin);

router.post('/login', auth.postLogin);

router.get('/register', auth.getRegister);

router.post('/register', auth.postRegister);

module.exports = router;
