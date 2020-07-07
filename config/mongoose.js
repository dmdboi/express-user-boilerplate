const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

mongoose.connection.on('connected', function () {
    console.log("Mongoose default connection is open to", process.env.DB_NAME);
});

mongoose.connection.on('error', function (err) {
    console.log("Mongoose default connection has occured " + err + " error");
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose default connection is disconnected");
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0)
    });
});