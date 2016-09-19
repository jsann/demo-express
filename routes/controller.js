var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    _ = require("underscore"),
    User = require("../models/user"),
    Movie = require("../models/movie");

router.post("/user/register", function(request, response){
  var u = request.body;
  User.find(u, function(error, data){
    if(error){
      console.log(error);
      return false;
    }
    if(data.length){
      response.send({result: false, responseText: "用户名已存在"});
    }else{
      User.create(u, function(error, data){
        if(error){
          console.log(error);
          return false;
        }
        response.send({result: true, data: _.omit(data, "password")});
      });
    }
  });
});

router.post("/user/login", function(request, response){
  var u = request.body;
  User.findOne(u, function(error, data){
    if(error){
      console.log(error);
      return false;
    }
    if(data){
      request.session.loginer = data;
      response.redirect("/user");
    }else{
      response.send({result: false, responseText: "用户名或者密码错误"});
    }
  });
});

router.post("/admin/user/login", function(request, response){
  var u = _.extend(request.body, {type: 0});
  User.findOne(u, function(error, data){
    if(error){
      console.log(error);
      return false;
    }
    if(data){
      request.session.loginer = data;
      response.redirect("/admin")
    }else{
      response.send({result: false, responseText: "用户名或者密码错误"});
    }
  });
});

router.get("/admin/movie/get/:id", function(request, response){
  var id = response.params.id;
  Movie.findById(id, function(error, data){
    response.render("admin/post", {
      title: data.title + " Post - Dome Movie Pages",
      movie: data
    });
  });
});

//添加新数据
router.post("/admin/movie/set", function(request, response){
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
});

router.delete("/admin/movie/delete", function(request, response){
  var id = mongoose.Types.ObjectId(request.query.id);
  Movie.remove({"_id": id}, function(error, movie){
    if(error){
      console.log(error);
      return false;
    }
    response.send({result: true});
  });
});

module.exports = router;
