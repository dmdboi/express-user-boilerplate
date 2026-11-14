const LocalStrategy = require("passport-local").Strategy
const passport = require("passport")
const User = require("../models/User.model")

passport.use(
    "local.signin",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, username, password, done) {
        try {
            const user = User.findByEmail(username)

            if (!user) {
                req.flash('error', 'That user does not exist');
                return done(null, false)
            }
            if (!User.validPassword(user, password)) {
                req.flash('error', 'Wrong password');
                return done(null, false)
            }

            req.flash('success', 'Welcome back!');
            return done(null, user)
        } catch (err) {
            console.log(err)
            return done(err);
        }
    })
)

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    try {
        done(null, User.findById(id))
    } catch (err) {
        done(err)
    }
})

passport.use(
    "local.signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, username, password, done) {
        try {
          if (User.findByEmail(username)) {
            return done(null, false, { message: "Email is already in use." });
          }

          const newUser = User.create({
            username: req.body.name,
            email: username,
            password
          });

          req.flash('success', 'Welcome!');
          return done(null, newUser);
        } catch (err) {
          console.log(err)
          req.flash('danger', err.message);
          return done(err);
        }
      }
    )
  );
