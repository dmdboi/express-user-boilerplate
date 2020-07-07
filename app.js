const createError = require('http-errors');
const express = require('express');
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const winston = require('./config/winston');
const exphbs = require("express-handlebars");
const flash = require('connect-flash');
const passport = require("passport")


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

require('dotenv').config()
require("./config/passport")
require("./config/mongoose");

var app = express();

var store = new MongoDBStore({
  uri: `mongodb://localhost:27017/${process.env.DB_NAME}`,
  collection: 'sessions'
});

// view engine setup
app.engine(".hbs", exphbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "secret",
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
    saveUninitialized: true,
    store: store
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.messages = req.flash()
  next();
});

app.use('/', indexRouter);
app.use('/auth/', authRouter);
app.use('/users/', usersRouter);
app.use('/admin/', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, function() {
  console.log(`Web Server ==> http://localhost:${process.env.port}`)
})
