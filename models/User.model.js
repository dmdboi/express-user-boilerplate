var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    created_At: { type: Date, required: true, default: Date().now},
    isAdmin: { type: Boolean, default: false},
})

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model("User", userSchema);