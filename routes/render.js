var mongoose = require("mongoose"),
    _ = require("underscore"),
    Movie = require("../models/movie");

var RenderRoutes = {
  index: function(request, response){
    Movie.fetch(function(error, data){
      if(error){
        console.log(error);
      }
      response.render("index", _.extend({
        title: "Index",
        _USER_: request.session.loginer,
        movies: data
      }, request.query));
    });
  },
  detail: function(request, response){
    var id = mongoose.Types.ObjectId(request.params.id); //获取id参数
    Movie.findById(id, function(error, data){
      if(error){
        console.log(error);
        return false;
      }
      response.render("detail", {
        title: data.title,
        _USER_: request.session.loginer,
        movie: data
      });
    });
  },
  special: function(request, response){
    var id = mongoose.Types.ObjectId(request.params.id);
    Movie.findById(id, function(error, data){
      if(error){
        console.log(error);
        return false;
      }
      response.render("special", {
        title: data.title,
        _USER_: request.session.loginer,
        layout: "special_layout",
        movie: data
      });
    });
  },
  register: function(request, response){
    response.render("register", {
      title: "Register"
    });
  },
  login: function(request, response){
    response.render("login", {
      title: "Login"
    });
  },
  user: function(request, response){
    var loginer = request.session.loginer;
    if(loginer){
      response.render("user/index", {
        title: "User Center",
        layout: "user_layout",
        _USER_: loginer
      });
    }else{
      response.redirect("/login");
    }
  },
  userProfile: function(request, response){
    var loginer = request.session.loginer;
    if(loginer){
      response.render("user/profile", {
        title: "Profile",
        layout: "user_layout",
        _USER_: loginer
      });
    }else{
      response.redirect("/login");
    }
  },
  admin: function(request, response){
    var loginer = request.session.loginer;
    if(loginer){
      Movie.fetch(function(error, data){
        if(error){
          console.log(error);
          return false;
        }
        response.render("admin/list", {
          title: "Admin",
          _USER_: loginer,
          movies: data
        });
      });
    }else{
      response.redirect("/admin/login");
    }
  },
  adminLogin: function(request, response){
    response.render("admin/login", {
      title: "Login - Admin"
    });
  },
  adminPost: function(request, response){
    var loginer = request.session.loginer;
    if(loginer){
      var id = mongoose.Types.ObjectId(request.params.id);
      if(id){
        Movie.findById(id, function(error, data){
          if(error){
            console.log(error);
            return false;
          }
          response.render("admin/post", {
            title: "Post",
            _USER_: loginer,
            movie: data
          });
        });
      }else{
        response.render("admin/post", {
          title: "Post",
          _USER_: loginer
        });
      }
    }else{
      response.redirect("/admin/login");
    }
  }
}

module.exports = RenderRoutes;
