/*global _, describe, beforeEach, it, expect, sinon */
(function () {
  "use strict";

  var BufferFactory = require("configuration/bufferFactory"),
    Body = require("simulation/body"),
    Vector3 = require("math/vector3"),
    DELTA = 0.001;

  describe("simulation/body - representation of simulation body", function () {
    it("is a function (object factory)", function () {
      expect(Body).to.be.a("function");
    });

    describe("construction", function () {
      var expected = [Math.PI, Math.E, Math.SQRT2, Math.SQRT1_2, Math.LN10, Math.LN2, Math.LOG2E];
      describe("typed array based creation", function () {
        var array = new BufferFactory(7),
          body;
        array.set(expected);
        body = new Body(array);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with passed array", function () {
          expect(body.array).to.be.equal(array);
        });
      });

      describe("array based creation", function () {
        var body = new Body(expected);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with values from array", function () {
          _(expected).each(function (v, i) {
            expect(body.array[i]).to.be.closeTo(v, DELTA);
          });
        });
      });

      describe("object based creation", function () {
        var bodyObject = {
            mass:10,
            position:{
              x:1,
              y:1,
              z:1
            },
            speed:{
              x:-1,
              y:-1,
              z:-1
            }
          },
          body = new Body(bodyObject);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with passed object", function () {
          expect(body.array[0]).to.be.equal(bodyObject.mass);

          expect(body.array[1]).to.be.equal(bodyObject.position.x);
          expect(body.array[2]).to.be.equal(bodyObject.position.y);
          expect(body.array[3]).to.be.equal(bodyObject.position.z);

          expect(body.array[4]).to.be.equal(bodyObject.speed.x);
          expect(body.array[5]).to.be.equal(bodyObject.speed.y);
          expect(body.array[6]).to.be.equal(bodyObject.speed.z);
        });
      });

      describe("value based creation", function () {
        var bodyObject = {
            mass:10,
            position:{
              x:1,
              y:1,
              z:1
            },
            speed:{
              x:-1,
              y:-1,
              z:-1
            }
          },
          body = new Body(bodyObject.mass, bodyObject.position, bodyObject.speed);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with passed values", function () {
          expect(body.array[0]).to.be.equal(bodyObject.mass);

          expect(body.array[1]).to.be.equal(bodyObject.position.x);
          expect(body.array[2]).to.be.equal(bodyObject.position.y);
          expect(body.array[3]).to.be.equal(bodyObject.position.z);

          expect(body.array[4]).to.be.equal(bodyObject.speed.x);
          expect(body.array[5]).to.be.equal(bodyObject.speed.y);
          expect(body.array[6]).to.be.equal(bodyObject.speed.z);
        });
      });
    });

    describe("accessors", function () {
      var body;
      beforeEach(function () {
        body = new Body();
      });

      describe("mass", function () {
        it ("getter returns first element of data array", function () {
          var expected = 1;
          body.array.set([expected]);

          expect(body.mass).to.be.equal(expected);
        });

        it("setter modifies first element of data array", function () {
          var expected = 2;
          body.mass = expected;

          expect(body.array[0]).to.be.equal(expected);
        });
      });

      describe("position", function () {
        it("getter returns Vector3 that wraps elements 1-3 of data array", function () {
          var position = body.position;
          body.array.set([3, 3, 3], 1);

          expect(position).to.be.instanceOf(Vector3);
          expect(position.x).to.be.equal(3);
          expect(position.y).to.be.equal(3);
          expect(position.z).to.be.equal(3);
        });

        it('setter allows to modify elements 1-3 of data array', function () {
          body.position = {x: 4, y: 4, z: 4};

          expect(body.array[1]).to.be.equal(4);
          expect(body.array[2]).to.be.equal(4);
          expect(body.array[3]).to.be.equal(4);
        });
      });

      describe("speed", function () {
        it("getter returns Vector3 that wraps elements 4-6 of data array", function () {
          var speed = body.speed;
          body.array.set([5, 5, 5], 4);

          expect(speed).to.be.instanceOf(Vector3);
          expect(speed.x).to.be.equal(5);
          expect(speed.y).to.be.equal(5);
          expect(speed.z).to.be.equal(5);
        });

        it('setter allows to modify elements 4-6 of data array', function () {
          body.speed = {x: 6, y: 6, z: 6};

          expect(body.array[4]).to.be.equal(6);
          expect(body.array[5]).to.be.equal(6);
          expect(body.array[6]).to.be.equal(6);
        });
      });
    });

    describe("interface", function () {
      var body;
      beforeEach(function () {
        body = new Body();
      });

      describe("set - mutate body state in-place", function () {
        it("accepts and array of values", function () {
          var expected = [10, 10, 10, 10, -10, -10, -10];
          body.set(expected);

          _(expected).each(function(v, i) {
            expect(body.array[i]).to.be.equal(v);
          });
        });

        it("accepts {mass, position, speed} object", function () {
          var newState = {
            mass: 10,
            position: { x: 10, y: 10, z: 10 },
            speed: { x: -10, y: -10, z: -10 }
          };

          body.set(newState);

          _([10, 10, 10, 10, -10, -10, -10]).each(function(v, i) {
            expect(body.array[i]).to.be.equal(v);
          });
        });

        it("accepts (mass, position, speed) parameters", function () {
          var newState = {
            mass: 10,
            position: { x: 10, y: 10, z: 10 },
            speed: { x: -10, y: -10, z: -10 }
          };

          body.set(newState.mass, newState.position, newState.speed);

          _([10, 10, 10, 10, -10, -10, -10]).each(function(v, i) {
            expect(body.array[i]).to.be.equal(v);
          });
        });

      });

    })
  });
}.call(this));