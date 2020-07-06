const LocalStrategy = require("passport-local").Strategy
const passport = require("passport")
const User = require("../models/User.model")

passport.use(
    "local.signin",
    new LocalStrategy({
        usernameField: "email",
        passportField: "password",
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({ email: email}, function(err, user) {
            if (err) {
                console.log(err)
                return done(err);
            }
            if (!user) {
                console.log("No user found.")
                return done(null, false)
            }
            if (!user.validPassword(password)) {
                return done(null, false)
            }
            console.log("logged in")
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
        usernameField: "username",
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
          newUser.email = username;
          newUser.password = newUser.encryptPassword(password);
          newUser.username = req.body.name;
          newUser.created_At = Date.now()
          newUser.save(function(err, result) {
            if (err) {
              return done(err);
            }
            return done(null, newUser);
          });
        });
      }
    )
  );