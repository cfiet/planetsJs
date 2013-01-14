/*global _, describe, beforeEach, it, expect, sinon */
(function () {
  "use strict";

  var BufferFactory = require("configuration/bufferFactory"),
    Vector3 = require("math/vector3"),
    DELTA = 0.001;

  describe("math/vector3 (typed buffers implementation)", function () {

    it("is a function (object factory)", function () {
      expect(Vector3).to.be.a("function");
    });

    describe("construction", function () {
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

      describe("typed array based creation", function () {
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

      describe("array based creation", function () {
        var arr, vector;
        arr = [Math.E, Math.PI, Math.SQRT2];
        vector = new Vector3(arr);

        it("creates a vector with buffer", function () {
          expect(vector).to.be.instanceOf(Vector3);
          expect(vector.data).to.be.instanceOf(Float32Array);
        });

        it("initializes buffer correctly", function () {
          _(arr).each(function (v, i) {
            expect(vector.data[i]).to.be.closeTo(v, DELTA);
          });
        });
      });

      describe("object based creation", function () {
        var o, vector;
        o = {
          x: Math.E,
          y: Math.PI,
          z: Math.SQRT2
        };
        vector = new Vector3(o);

        it("creates a vector with buffer", function () {
          expect(vector).to.be.instanceOf(Vector3);
          expect(vector.data).to.be.instanceOf(Float32Array);
        });

        it("initializes buffer correctly", function () {
          _(["x", "y", "z"]).each(function (v, i) {
            expect(vector.data[i]).to.be.closeTo(o[v], DELTA);
          });
        });
      });

      describe("value based creation", function () {
        var arr, vector;
        arr = [Math.E, Math.PI, Math.SQRT2];
        vector = new Vector3(arr[0], arr[1], arr[2]);

        it("creates a vector with buffer", function () {
          expect(vector).to.be.instanceOf(Vector3);
          expect(vector.data).to.be.instanceOf(Float32Array);
        });

        it("initializes buffer correctly", function () {
          _(arr).each(function (v, i) {
            expect(vector.data[i]).to.be.closeTo(v, DELTA);
          });
        });
      });
    });

    describe("accessors", function () {
      var o, vector;
      o = {
        x: Math.PI,
        y: Math.E,
        z: Math.SQRT2
      };
      vector = new Vector3(o);

      it("getters access appropriate properties", function () {
        _(o).each(function (v, k) {
          expect(vector[k]).to.be.closeTo(o[k], DELTA);
        });
      });

      it("setters modify appropriate properties", function () {
        var mod = {
          x: o.y,
          y: o.z,
          z: o.x
        };

        _(mod).each(function (v, k) {
          vector[k] = v;
        });

        _(["x", "y", "z"]).each(function (k, i) {
          expect(vector.data[i]).to.be.closeTo(mod[k], DELTA);
        });
      });
    });

    describe("interface", function () {
      var vector = new Vector3(1.0, 1.0, 0.0);

      describe("length - vector length", function () {
        it("returns expected value", function () {
          expect(vector.length).to.be.equal(Math.SQRT2);
        });
      });

      describe("inverted - inversion", function () {
        it("returns expected value", function () {
          var negated = vector.inverted();

          expect(negated.x).to.be.equal(-1);
          expect(negated.y).to.be.equal(-1);
          expect(negated.z).to.be.equal(0);
        });
      });

      describe("add - vector addition", function () {
        it("works with objects {x, y, z}", function () {
          var result = vector.add({x: 1, y: 1, z: 1});

          expect(result.x).to.be.equal(2);
          expect(result.y).to.be.equal(2);
          expect(result.z).to.be.equal(1);
        });

        it("works with vectors", function () {
          var param = new Vector3(1, 1, 1),
            result = vector.add(param);

          expect(result.x).to.be.equal(2);
          expect(result.y).to.be.equal(2);
          expect(result.z).to.be.equal(1);
        });
      });

      describe("mul - scalar multiplication", function () {
        it("returns expected value", function () {
          var multiplied = vector.mul(3);

          expect(multiplied.x).to.be.equal(3);
          expect(multiplied.y).to.be.equal(3);
          expect(multiplied.z).to.be.equal(0);
        });
      });

      describe("unit - unit vector", function () {
        it("returns expected value", function () {
          var unit = vector.unit();

          expect(unit.x).to.be.closeTo(Math.SQRT1_2, DELTA);
          expect(unit.y).to.be.closeTo(Math.SQRT1_2, DELTA);
          expect(unit.z).to.be.equal(0);
        });
      });

      describe("sub - vector substraction", function () {
        it("works with objects {x,y,z}", function () {
          var result = vector.sub({x: 1, y: 1, z: 1});

          expect(result.x).to.be.equal(0);
          expect(result.y).to.be.equal(0);
          expect(result.z).to.be.equal(-1);
        });

        it("works with vectors", function () {
          var right = new Vector3(1, 1, 1),
            result = vector.sub(right);

          expect(result.x).to.be.equal(0);
          expect(result.y).to.be.equal(0);
          expect(result.z).to.be.equal(-1);
        });
      });

      describe("div - scalar division", function () {
        it("returns expected value", function () {
          var result = vector.div(100);

          expect(result.x).to.be.closeTo(0.01, DELTA);
          expect(result.y).to.be.closeTo(0.01, DELTA);
          expect(result.z).to.be.equal(0);

        });
      });

      describe("set - mutate vector state in-place", function () {

        it("mutates the original object", function () {
          var mutable = new Vector3(1, 2, 3);
          mutable.set(3, 2, 1);

          expect(mutable.data[0]).to.be.equal(3);
          expect(mutable.data[1]).to.be.equal(2);
          expect(mutable.data[2]).to.be.equal(1);
        });

        it("supports the {x,y,z} object argument", function () {
          var mutable = new Vector3(1, 2, 3);
          mutable.set({x: 3, y: 2, z: 1});

          expect(mutable.data[0]).to.be.equal(3);
          expect(mutable.data[1]).to.be.equal(2);
          expect(mutable.data[2]).to.be.equal(1);
        });
      });
    });
  });
}.call(this));