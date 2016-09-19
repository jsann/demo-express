var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    _ = require("underscore"),
    Movie = require("../models/movie");

//设置路由
router.get("/", function(request, response){
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
});

router.get("/detail/:id", function(request, response){
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
});

router.get("/special/:id", function(request, response){
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
});

router.get("/register", function(request, response){
  response.render("register", {
    title: "Register"
  });
});

router.get("/login", function(request, response){
  response.render("login", {
    title: "Login"
  });
});

router.get("/user", function(request, response){
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
});

router.get("/user/profile", function(request, response){
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
});

router.get("/admin/", function(request, response){
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
});

router.get("/admin/login", function(request, response){
  response.render("admin/login", {
    title: "Login - Admin"
  });
});

router.get("/admin/post", function(request, response){
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
});
router.get("/admin/post/:id", function(request, response){
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
});

router.get("*", function(request, response){
  response.status(404).render("404", {
    title: "404"
  });
});

module.exports = router;
