//端口从命令行获取‘PORT’参数 或者 默认值为3000
var express = require("express"), port = process.env.PORT || 3000, app = express();

var bodyParser = require("body-parser");

var path = require("path");

var helpers = require("./helpers/helpers")

var mongoose = require("mongoose");
var Movie = require("./models/movie");

var _ = require("underscore");

var handlebars = require("express-handlebars");

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
mongoose.connect("mongodb://localhost/movies");

//设置路由
app.get("^/$|^/index$", function(request, response){
  Movie.fetch(function(error, data){
    if(error){
      console.log(error);
    }
    response.render("index", {
      title: "Index - Demo Movie Pages",
      movies: data
    })
  })
})

app.get("/detail/:id", function(request, response){
  var id = mongoose.Types.ObjectId(request.params.id)//request.params.id; //获取id参数
  Movie.findById(id, function(error, data){
    // console.log(error, data)
    if(error){
      console.log(error);
      return false;
    }
    response.render("detail", {
      title: data.title + " - Detail - Demo Movie Pages",
      movie: data
    })
  })
})

app.get("/admin/", function(request, response){
  Movie.fetch(function(error, data){
    if(error){
      console.log(error);
      return false;
    }
    response.render("admin/list", {
      title: "Admin - Demo Movie Pages",
      movies: data
    })
  })
})

app.get("/api/admin/movie/get/:id", function(request, response){
  var id = response.params.id;
  Movie.findById(id, function(error, data){
    response.render("admin/post", {
      title: data.title + " Post - Dome Movie Pages",
      movie: data
    })
  })
})

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
    })
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
    })
  }
})

app.get("/admin/post", function(request, response){
  var id = request.query.id;
  if(id){
    Movie.findById(id, function(error, data){
      if(error){
        console.log(error);
        return false;
      }
      response.render("admin/post", {
        title: "Post - Demo Movie Pages",
        movie: data
      });
    });
  }else{
    response.render("admin/post", {
      title: "Post - Demo Movie Pages"
    })
  }
})

app.delete("/api/admin/items/delete", function(request, response){
  var id = mongoose.Types.ObjectId(request.query.id);
  Movie.remove({"_id": id}, function(error, movie){
    if(error){
      console.log(error);
      return false;
    }
    response.json({success: true});
  })
})

app.get("*", function(request, response){
  response.status(404).render("404", {
    title: "404 - Demo Movie Pages"
  });
});
