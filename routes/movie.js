var mongoose = require("mongoose"),
    _ = require("underscore"),
    Movie = require("../models/movie");

var MovieRoutes = {
  get: function(request, response){
    var id = response.params.id;
    Movie.findById(id, function(error, data){
      response.render("admin/post", {
        title: data.title + " Post - Dome Movie Pages",
        movie: data
      });
    });
  },
  set: function(request, response){
    var movieObject = request.body.movie;
    var id = movieObject.id;
    var _movie;
    if(id){ //判断数据是否存在，存在则需要进行更新操作，否则为新增操作
      Movie.findById(id, function(error, data){
        if(error){
          console.log(error);
        }
        _movie = _.extend(data, movieObject); //用新的数据替换掉数据库里的数据
        _movie.save(function(error, movie){ //保存数据
          if(error){
            console.log(error);
          }
          response.send({result: true, data: {id: movie.id}});
        })
      });
    }else{
      _movie = new Movie({
        //_id: id,
        title: movieObject.title,
        doctor: movieObject.doctor,
        language: movieObject.language,
        country: movieObject.country,
        year: movieObject.year,
        summary: movieObject.summary,
        flash: movieObject.flash,
        poster: movieObject.poster
      }); //实例化数据模型
      _movie.save(function(error, movie){
        if(error){
          console.log(error);
        }
        response.send({result: true, data: {id: movie.id}});
      });
    }
  },
  delete: function(request, response){
    var id = mongoose.Types.ObjectId(request.query.id);
    Movie.remove({"_id": id}, function(error, movie){
      if(error){
        console.log(error);
        return false;
      }
      response.send({result: true});
    });
  }
}

module.exports = MovieRoutes;
