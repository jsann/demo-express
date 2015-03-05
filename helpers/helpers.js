var moment = require("moment");

var helpers = {
  equals: function(context1, context2, options){
    if(context1 == context2){
      return options.fn();
    }else{
      return options.inverse();
    }
  },
  formatDate: function(date){
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
}

module.exports = helpers;
