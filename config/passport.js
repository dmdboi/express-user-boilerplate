const LocalStrategy = require("passport-local").Strategy
const passport = require("passport")
const User = require("../models/User.model")

passport.use(
    "local.signin",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, async function(req, username, password, done) {
        try {
            const user = await User.findOne({ email: username })

            if (!user) {
                req.flash('error', 'That user does not exist');
                return done(null, false)
            }
            if (!user.validPassword(password)) {
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

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id)
        done(null, user)
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
      async function(req, username, password, done) {
        try {
          const user = await User.findOne({ email: username });

          if (user) {
            return done(null, false, { message: "Email is already in use." });
          }

          var newUser = new User();
          newUser.email = username;
          newUser.username = req.body.name
          newUser.password = newUser.encryptPassword(password);
          newUser.created_At = Date.now()
          await newUser.save();

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
