var moment = require("moment");

var helpers = {
  formatDate: function(date){
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
}

module.exports = helpers;
