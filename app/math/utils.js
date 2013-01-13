(function () {
  "use strict";

  module.exports = {
    sign: function (v) {
      if (v === 0) {
        return 0;
      }
      if (v < 0) {
        return -1;
      }
      return 1;
    }
  };
}).call(this);