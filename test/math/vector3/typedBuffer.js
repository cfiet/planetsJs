/*global _, describe, beforeEach, it, expect, sinon */
(function () {
  "use strict";

  var Vector3 = require("math/vector3/typedBuffer");

  describe("Vector3 on typed buffers", function () {

    it("is a function (object facotry)", function () {
      expect(Vector3).to.be.a("function");
    });

    describe("default creation", function () {
      var vector = new Vector3();

      it("creates data buffer", function () {
        expect(vector.data).to.be.instanceOf(Float32Array);
      });

      it("initializes the buffer as (0,0,0)", function () {
        _([0, 1, 2]).each(function (i) {
          expect(vector.data[i]).to.be.equal(0);
        });
      });
    });

    describe("array based creation", function () {
      var arr, vector;
      arr = new Float32Array(3);
      arr.set([Math.E, Math.PI, Math.SQRT2]);

      vector = new Vector3(arr);

      it("creates new buffer view", function () {
        expect(vector.data).to.be.instanceOf(Float32Array);
        expect(vector.data).not.to.be.equal(arr);
      });

      it("initializes buffer with values from original buffer", function () {
        _([0, 1, 2]).each(function (i) {
          expect(vector.data[i]).to.be.equal(arr[i]);
        });
      });
    });
  });
}.call(this));