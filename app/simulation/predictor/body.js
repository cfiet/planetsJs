(function () {
  "use strict";

  var Body = require("simulation/body"),
      Vector3 = require("math/vector3"),
      defaultSettings = require("./defaults");

  function BodyPredictor(currentBody, settings) {
    if (!(currentBody instanceof Body)) {
      throw new Error("currentBody must be a Body object");
    }

    _(this).extend(defaultSettings, settings);
    this.currentBody = currentBody;
  }

  BodyPredictor.prototype = {
    adjustForce:function (force, otherBody) {
      var difference, distance, gravityValue, gravityVector;

      difference = otherBody.position.sub(this.currentBody.position);
      distance = difference.length;

      if (distance > this.minDistance) {
        gravityValue = this.G * this.currentBody.mass * otherBody.mass / (distance * distance);
        gravityVector = difference.unit().mul(gravityValue);

        force.x += gravityVector.x;
        force.y += gravityVector.y;
        force.z += gravityVector.z;
      }
      return force;
    },

    calculateForce:function (otherBodies) {
      if (!(otherBodies instanceof Array)) {
        throw new Error("otherBodies must be an Array");
      }

      var i,
          force = {
            x:0.0,
            y:0.0,
            z:0.0
          };

      for (i = 0; i < otherBodies.length; i++) {
        force = this.adjustForce(force, otherBodies[i]);
      }
      return force;
    },

    calculateAcceleration:function (force) {
      if (!(force instanceof Vector3)) {
        force = new Vector3(force);
      }
      return force.div(this.currentBody.mass);
    },

    calculateDerivative:function (acceleration) {
      return {
        position:this.currentBody.speed.mul(this.step),
        speed:acceleration.mul(this.step)
      };
    },

    getDerivative:function (otherBodies) {
      var force, acceleration;

      force = this.calculateForce(otherBodies);
      acceleration = this.calculateAcceleration(force);

      return this.calculateDerivative(acceleration);
    },

    update:function (otherBodies) {
      var d = this.getDerivative(otherBodies);

      this.currentBody.position = this.currentBody.position.add(d.position);
      this.currentBody.speed = this.currentBody.speed.add(d.speed);
    }
  };

  module.exports = BodyPredictor;
}).call(this);