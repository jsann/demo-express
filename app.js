//端口从命令行获取‘PORT’参数 或者 默认值为3000
var express = require("express"),
    port = process.env.PORT || 3000,
    app = express();

var bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    path = require("path"),
    handlebars = require("express-handlebars"),
    mongoose = require("mongoose");

var helpers = require("./helpers/helpers");

var render = require("./routes/render"),
    controller = require("./routes/controller");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + "/public"))); //设置静态文件目录

app.set("views", __dirname + "/views"); //设置视图目录

//由于express默认不支持handlebars，故而需要注册模板引擎
app.engine("hbs", handlebars({
  layoutsDir: __dirname + "/views/layout",
  defaultLayout: "layout",
  partialsDir: __dirname + "/views/partials",
  extname: ".hbs",
  helpers: helpers
}));

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

app.use("/", render);
app.use("/api/", controller);
