var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  avatar: {type: String, default: "http://www.jsann.com/images/gravatar/jsann.jpg"}
});

module.exports = UserSchema;
