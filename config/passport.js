const LocalStrategy = require("passport-local").Strategy
const passport = require("passport")
const User = require("../models/User.model")

passport.use(
    "local.signin",
    new LocalStrategy({
        usernameField: "email",
        passportField: "password",
        passReqToCallback: true
    }, function(req, username, password, done) {
        User.findOne({ email: username}, function(err, user) {
            if (err) {
                console.log(err)
                return done(err);
            }
            if (!user) {
                console.log("No user found.")
                req.flash('error', 'That user does not exist');
                return done(null, false)
            }
            if (!user.validPassword(password)) {
                console.log("invalid password")
                req.flash('error', 'Wrong password');
                return done(null, false)
            }
            console.log("logged in")
            req.flash('success', 'Welcome back!');
            return done(null, user)
        })
    })
)

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
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
        User.findOne({ email: username }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, { message: "Email is already in use." });
          }
          var newUser = new User();
          newUser.email = email;
          newUser.username = req.body.name
          newUser.password = newUser.encryptPassword(password);
          newUser.created_At = Date.now()
          newUser.save(function(err, result) {
            if (err) {
              console.log(err)
              req.flash('danger', err);
              return done(err);
            }
            console.log(result)
            req.flash('success', 'Welcome!');
            return done(null, newUser);
          });
        });
      }
    )
  );