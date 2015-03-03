var mongoose = require("mongoose"),
    UserSchema = require("../schemas/user");

var User = mongoose.model("users", UserSchema);

module.exports = User;
