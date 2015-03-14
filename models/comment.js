var mongoose = require("comgoose"),
    CommentSchema = require("../schemas/comment");

var CommentModel = mongoose.model(CommentSchema);

module.exports = CommentModel;
