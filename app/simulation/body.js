(function () {
  "use strict";

  var BufferFactory = require("configuration/bufferFactory"),
      Vector3 = require("math/vector3"),
      Body;

  Body = function () {
    function Body(/* initialState || {mass, position, speed} || mass, position, speed || body*/) {
      if (arguments.length === 1 && arguments[0] instanceof BufferFactory) {
        this.array = arguments[0];
      } else {
        this.array = new BufferFactory(7);
        this.set.apply(this, arguments);
      }
    }

    Body.prototype = {
      get mass() {
        return this.array[0];
      },
      set mass(m) {
        this.array[0] = m;
      },
      get position() {
        if (!this.positionVector) {
          this.positionVector = new Vector3(this.array.subarray(1, 4));
        }
        return this.positionVector;
      },
      set position(v) {
        this.position.set(v);
      },
      get speed() {
        if (!this.speedVector) {
          this.speedVector = new Vector3(this.array.subarray(4, 7));
        }
        return this.speedVector;
      },
      set speed(v) {
        this.speed.set(v);
      },
      set:function (/* array || mass, position, speed || {mass, position, speed} */) {
        var param;
        if (arguments.length === 1) {
          param = arguments[0];
          if (param instanceof Array) {
            this.array.set(param);
          } else if (param instanceof Object) {
            this.set(param.mass, param.position, param.speed);
          }
        } else if (arguments.length === 3) {
          this.mass = arguments[0] || this.mass;
          this.position = arguments[1] || this.position;
          this.speed = arguments[2] || this.speed;
        }
      }
    };

    return Body;
  }();

  module.exports = Body;
}.call(this));