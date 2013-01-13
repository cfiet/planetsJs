(function () {
  "use strict";
  var is, math, Vector3;

  is = require("utils/is");
  math = require("./utils");

  Vector3 = function () {
    function Vector3 (x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    Vector3.prototype = {
      length: function () {
        var x = this.x,
          y = this.y,
          z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
      },
      unit: function () {
        var len = this.length();
        return new Vector3(
          this.x / len,
          this.y / len,
          this.z / len
        );
      },
      dir: function () {
        return new Vector3(
          math.sign(this.x),
          math.sign(this.y),
          math.sign(this.z)
        );
      },
      neg: function () {
        return new Vector3(
          -this.x,
          -this.y,
          -this.z
        );
      },
      add: function (right) {
        return new Vector3(
          this.x + right.x,
          this.y + right.y,
          this.z + right.z
        );
      },
      sub: function (rigth) {
        return this.add(rigth.neg());
      },
      mul: function (val) {
        return new Vector3(
          this.x * val,
          this.y * val,
          this.z * val
        );
      },
      div: function (val) {
        return this.mul(1 / val);
      },
      asObject: function () {
        return {
          x: this.x,
          y: this.y,
          z: this.z
        };
      }
    };

    return function (/* arguments */) {
      var arg, x, y, z;

      if (arguments.length === 3) {
        x = arguments[0];
        y = arguments[1];
        z = arguments[2];
      } else if (arguments.length === 1) {
        arg = arguments[0];
        if (is.anArray(arg) && arg.length === 3) {
          x = arg[0];
          y = arg[1];
          z = arg[2];
        } else if (is.anObject(arg)) {
          x = arg.x;
          y = arg.y;
          z = arg.z;
        }
      }
      return new Vector3(x, y, z);
    };
  }();

  module.exports = Vector3;
}.call(this));