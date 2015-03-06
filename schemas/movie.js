var mongoose = require("mongoose");

var MovieSchemas = new mongoose.Schema({
  // _id: Number,
  title: String, //标题
  transname: String, //译名
  doctor: String, //导演
  actor: [String], //演员
  long: Number, //片长
  language: String, //语言
  country: String, //国家
  class: Number, //类别
  year: Number, //年份
  summary: String, //简介
  flash: String, //视频地址
  poster: String, //海报
  drawings: String, //题图
  uploader: String, //上传者
  type: {type: Number, default: 1}, //1为普通，2为专题
  meta: {
    createAt: { //创建时间
      type: Date,
      default: Date.now()
    },
    updateAt: { //更新时间
      type: Date,
      default: Date.now()
    }
  }
})

MovieSchemas.pre("save", function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }

  next();
})

// 添加静态方法
MovieSchemas.statics = {
  fetch: function(callback){
    return this.find({}).sort("meta.createAt").exec(callback);
  },
  findById: function(id, callback){
    return this.findOne({"_id": id}).exec(callback);
  }
}

module.exports = MovieSchemas;
