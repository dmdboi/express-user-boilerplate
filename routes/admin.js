var express = require('express');
var router = express.Router();

const admin = require('../controllers/admin.controller')
const auth = require('../middleware/auth')

router.use('/', auth.checkAdmin)

/* Authentication Routes. */
router.get('/dashboard', admin.getDashboard);

router.get('/dashboard/users/delete/:id', admin.postDeleteUser);

module.exports = router;
