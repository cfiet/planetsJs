(function () {
  "use strict";

  var BufferFactory = require("configuration/bufferFactory"),
    Vector3;

  Vector3 = function () {
    var fromArray = function (arr) {
      return fromNumber(arr[0], arr[1], arr[2]);
    };

    var fromObject = function (o) {
      return fromNumber(o.x, o.y, o.z);
    };

    function Vector3 (/* typedArray || array || {x, y, z} || x, y, z */) {
      this.data = new BufferFactory(3);
      var param;
      if (arguments.length === 1) {
        param = arguments[0];
        if (param.buffer instanceof ArrayBuffer || param instanceof Array) {
          this.data.set(param);
        } else if (param instanceof Object) {
          this.x = param.x;
          this.y = param.y;
          this.z = param.z;
        }
      }
      else if (arguments.length === 3) {
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
      }
    }

    Vector3.prototype = {
      get x () {
        return this.data[0];
      },
      set x (value) {
        this.data[0] = value;
      },
      get y () {
        return this.data[1];
      },
      set y (value) {
        this.data[1] = value;
      },
      get z () {
        return this.data[2];
      },
      set z (value) {
        this.data[2] = value;
      },
      get length () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      add: function (right) {
        return new Vector3(
          this.x + right.x,
          this.y + right.y,
          this.z + right.z
        );
      },
      mul: function (scalar) {
        return new Vector3(
          this.x * scalar,
          this.y * scalar,
          this.z * scalar
        );
      },
      unit: function () {
        var len = this.length;
        return new Vector3(
          this.x / len,
          this.y / len,
          this.z / len
        );
      },
      inverted: function () {
        return new Vector3(
          -this.x,
          -this.y,
          -this.z
        );
      },
      sub: function (rigth) {
        return new Vector3(
          this.x - rigth.x,
          this.y - rigth.y,
          this.z - rigth.z
        );
      },
      div: function (scalar) {
        return this.mul(1 / scalar);
      },
      set: function (/* {x,y,z} || x, y, z */) {
        if (arguments.length === 1 && arguments[0] instanceof Object) {
          this.x = arguments[0].x;
          this.y = arguments[0].y;
          this.z = arguments[0].z;
        } else if (arguments.length === 3) {
          this.x = arguments[0];
          this.y = arguments[1];
          this.z = arguments[2];
        } else {
          throw new Error("Unsupported arguments");
        }
      }

    };

    return Vector3;
  }();

  module.exports = Vector3;
}.call(this));