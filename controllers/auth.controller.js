var passport = require("passport")


exports.getLogin = (req, res) => {
    return res.render('auth/login');
} 

exports.getRegister = (req, res) => {
    return res.render('auth/register');
}

exports.postLogin = (req, res, next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/",
        failureRedirect: "/auth/login"
    })(req, res, next)
}

exports.postRegister = (req, res, next) => {
    passport.authenticate("local.signup", {
        successRedirect: "/",
        failureRedirect: "/auth/register"
    })(req, res, next)
}