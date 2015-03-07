//端口从命令行获取‘PORT’参数 或者 默认值为3000
var express = require("express"), port = process.env.PORT || 3000, app = express();

var bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    path = require("path"),
    handlebars = require("express-handlebars"),
    mongoose = require("mongoose");

var helpers = require("./helpers/helpers");

var RenderRoutes = require("./routes/render"),
    UserRoutes = require("./routes/user"),
    MovieRoutes = require("./routes/movie.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + "/public"))); //设置静态文件目录

app.set("views", __dirname + "/views"); //设置视图目录

//由于express默认不支持handlebars，故而需要注册模板引擎
app.engine("hbs", handlebars({
  layoutsDir: "layout",
  defaultLayout: "layout",
  partialsDir: "partials",
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
app.get("/", RenderRoutes.index);
app.get("/index", RenderRoutes.index);

app.get("/detail/:id", RenderRoutes.detail);

app.get("/special/:id", RenderRoutes.special);

app.get("/register", RenderRoutes.register);

app.get("/login", RenderRoutes.login);

app.post("/api/user/register", UserRoutes.register);

app.post("/api/user/login", UserRoutes.login);

app.get("/user", RenderRoutes.user);

app.get("/admin/", RenderRoutes.admin);

app.get("/admin/login", RenderRoutes.adminLogin);

app.post("/api/admin/user/login", UserRoutes.adminLogin);

app.get("/api/admin/movie/get/:id", MovieRoutes.get);

//添加新数据
app.post("/api/admin/movie/set", MovieRoutes.set);

app.get("/admin/post", RenderRoutes.adminPost);
app.get("/admin/post/:id", RenderRoutes.adminPost);

app.delete("/api/admin/movie/delete", MovieRoutes.delete);

app.get("*", function(request, response){
  response.status(404).render("404", {
    title: "404"
  });
});
