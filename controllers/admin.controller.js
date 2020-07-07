const Users = require("../models/User.model");

exports.getDashboard = async (req, res) => {
    let users = await Users.find({}).lean()
    return res.render('admin/dashboard', { users })
}

exports.postDeleteUser = async (req, res) => {
    await Users.findOneAndDelete({_id: req.params.id}).lean()
    return res.redirect('/admin/dashboard')
}