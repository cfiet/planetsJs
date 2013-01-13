(function () {
  "use strict";

  var BufferFactory = Float32Array,
    Vector3;

  function getterSetter (offset) {
    var vector = this;
    return function (value) {
      if (!value) {
        return vector.data[offset];
      }
      return vector.data[offset] = value;
    };
  }

  Vector3 = function () {
    function Vector3 (initialArray) {
      this.data = new BufferFactory(3);
      if (initialArray) {
        this.data.set(initialArray, 0);
      }
    }

    Vector3.prototype = {
      x: getterSetter(0),
      y: getterSetter(1),
      z: getterSetter(2)
    };

    return Vector3;
  }();

  module.exports = Vector3;
}.call(this));