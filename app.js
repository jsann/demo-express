//端口从命令行获取‘PORT’参数 或者 默认值为3000
var express = require("express"), port = process.env.PORT || 3000, app = express();

var bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    path = require("path"),
    handlebars = require("express-handlebars"),
    mongoose = require("mongoose"),
    _ = require("underscore");

var helpers = require("./helpers/helpers");

var Movie = require("./models/movie"),
    User = require("./models/user");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + "/public"))); //设置静态文件目录

app.set("views", __dirname + "/views"); //设置视图目录

//由于express默认不支持handlebars，故而需要注册模板引擎
app.engine("hbs", handlebars({
  layoutsDir: "layout",
  defaultLayout: "layout",
  extname: ".hbs",
  helpers: helpers
}))
app.set("view engine", "hbs"); //设置模板引擎

app.listen(port); //侦听端口

console.log("Application runing on port " + port);

//链接数据库
mongoose.connect("mongodb://localhost/demo-movies");

app.use(session({
  secret: "demo-express",
  resave: false,
  saveUninitialized: false
}))

//设置路由
app.get("^/$|^/index$", function(request, response){
  Movie.fetch(function(error, data){
    if(error){
      console.log(error);
    }
    response.render("index", {
      title: "Index",
      _USER_: request.session.loginer,
      movies: data
    });
  });
});

app.get("/detail/:id", function(request, response){
  var id = mongoose.Types.ObjectId(request.params.id)//request.params.id; //获取id参数
  Movie.findById(id, function(error, data){
    // console.log(error, data)
    if(error){
      console.log(error);
      return false;
    }
    response.render("detail", {
      title: data.title + " - Detail",
      movie: data
    });
  });
});

app.get("/register", function(request, response){
  response.render("register", {
    title: "Register"
  });
});

app.get("/login", function(request, response){
  response.render("login", {
    title: "Login"
  });
});

app.post("/api/user/register", function(request, response){
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

app.post("/api/user/login", function(request, response){
  var u = request.body;
  User.findOne(u, function(error, data){
    if(error){
      console.log(error);
      return false;
    }
    if(data){
      request.session.loginer = data;
      response.send({result: true});
    }else{
      response.send({result: false, responseText: "用户名或者密码错误"});
    }
  });
});

app.get("/admin/", function(request, response){
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

app.get("/admin/login", function(request, response){
  response.render("admin/login", {
    title: "Login - Admin"
  });
});

app.post("/api/admin/user/login", function(request, response){
  var u = _.extend(request.body, {type: 0});
  User.findOne(u, function(error, data){
    if(error){
      console.log(error);
      return false;
    }
    if(data){
      request.session.loginer = data;
      response.send({result: true});
    }else{
      response.send({result: false, responseText: "用户名或者密码错误"});
    }
  });
});

app.get("/api/admin/movie/get/:id", function(request, response){
  var id = response.params.id;
  Movie.findById(id, function(error, data){
    response.render("admin/post", {
      title: data.title + " Post - Dome Movie Pages",
      movie: data
    });
  });
});

//添加新数据
app.post("/api/admin/movie/set", function(request, response){
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
        response.redirect("/detail/" + movie.id); //跳转到详情页面
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
      response.redirect("/detail/" + movie.id);
    });
  }
});

app.get("/admin/post", function(request, response){
  var id = request.query.id;
  if(id){
    Movie.findById(id, function(error, data){
      if(error){
        console.log(error);
        return false;
      }
      response.render("admin/post", {
        title: "Post",
        movie: data
      });
    });
  }else{
    response.render("admin/post", {
      title: "Post"
    });
  }
});

app.delete("/api/admin/items/delete", function(request, response){
  var id = mongoose.Types.ObjectId(request.query.id);
  Movie.remove({"_id": id}, function(error, movie){
    if(error){
      console.log(error);
      return false;
    }
    response.json({success: true});
  });
});

app.get("*", function(request, response){
  response.status(404).render("404", {
    title: "404"
  });
});
