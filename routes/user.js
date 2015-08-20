var _ = require("underscore"),
    User = require("../models/user");

var UserRoutes = {
  register: function(request, response){
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
  },
  login: function(request, response){
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
  },
  adminLogin: function(request, response){
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
  }
}

module.exports = UserRoutes;
