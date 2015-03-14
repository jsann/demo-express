var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  movie_id: ObjectId, //movie id
  user_id: ObjectId, //user id
  star: Number, //评分
  content: String //评论内容
});

module.exports = CommentSchema;
