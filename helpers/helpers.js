var moment = require("moment");

var helpers = {
  equals: function(context1, context2, options){
    if(context1 == context2){
      return options.fn(this);
    }else{
      return options.inverse(this);
    }
  },
  formatDate: function(date){
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
}

module.exports = helpers;
