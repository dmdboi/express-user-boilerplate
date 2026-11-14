const Users = require("../models/User.model");

exports.getDashboard = (req, res) => {
    return res.render('admin/dashboard', { users: Users.all() })
}

exports.postDeleteUser = (req, res) => {
    Users.deleteById(req.params.id)
    return res.redirect('/admin/dashboard')
}
