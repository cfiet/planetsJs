(function () {
  "use strict";

  var BufferFactory = require("configuration/bufferFactory"),
    Vector3 = require("math/vector3"),
    Body;

  Body = function () {
    function init (body) {
      body.positionVector = body.positionVector || new Vector3(body.array.subarray(1, 3));
      body.speedVector = body.speedVector || new Vector3(body.array.subarray(4, 3));
    }

    function Body (/* initialState || {mass, position, speed} || mass, position, speed */) {
      this.array = new BufferFactory(7);

      var param;
      if (arguments.length === 1) {
        param = arguments[0];
        if (param instanceof BufferFactory || param instanceof Array) {
          this.array.set(param);
          init(this);
        } else if (param instanceof Object) {
          init(this);
          this.set(param);
        }
      } else if (arguments.length === 3) {
        init(this);
        this.set.apply(this, arguments);
      }
    }

    Body.prototype = {
      get mass () {
        this.array[0];
      },
      set mass (m) {
        this.array[0] = m;
      },
      get position () {
        return this.positionVector;
      },
      set position (v) {
        this.positionVector.set(v);
      },
      get speed () {
        return this.speedVector;
      },
      set speed (v) {
        this.speedVector.set(v);
      },
      set: function (/* mass, position, speed || {mass, position, speed} */) {
        var param;
        if (arguments.length === 1 && arguments[0] instanceof Object) {
          param = arguments[0];
          this.set(param.mass, param.position, param.speed);
        } else if (arguments.length === 3) {
          this.mass = arguments[0];
          this.position = arguments[1];
          this.speed = arguments[2];
        } else {
          throw new Error("Unsupported parameters");
        }
      }
    };

    return Body;
  }();

  module.exports = Body;
}.call(this));