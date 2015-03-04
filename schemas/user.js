var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  avatar: {type: String, default: "http://www.jsann.com/images/gravatar/jsann.jpg"},
  type: {type: Number, default: 1} // 有且仅有 admin 为 0
});

module.exports = UserSchema;
