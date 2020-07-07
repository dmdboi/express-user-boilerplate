var passport = require("passport")


exports.getLogin = (req, res) => {
    return res.render('auth/login');
} 

exports.getRegister = (req, res) => {
    return res.render('auth/register');
}

exports.postLogin = (req, res, next) => {
    passport.authenticate("local.signin", {
        successRedirect: "/users/dashboard",
        successFlash: true,
        failureRedirect: "/auth/login",
        failureFlash: true
    })(req, res, next)
}

exports.postRegister = (req, res, next) => {
    passport.authenticate("local.signup", {
        successRedirect: "/users/dashboard",
        successFlash: true,
        failureRedirect: "/auth/register",
        failureFlash: true
    })(req, res, next)
}

exports.getLogout = (req, res, next) => {
    req.logOut();
    return res.redirect("/");
}