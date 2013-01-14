/*global _, describe, beforeEach, it, expect, sinon */
(function () {
  "use strict";

  var BufferFactory = require("configuration/bufferFactory"),
    Body = require("simulation/body"),
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
          _(array).each(function (i) {
            expect(body.array[i]).to.be.equal(array[i]);
          });
        });
      });

      describe("array based creation", function () {
        var body = new Body(expected);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with passed array", function () {
          _(expected).each(function (v, i) {
            expect(body.array[i]).to.be.closeTo(v, DELTA);
          });
        });
      });

      describe("object based creation", function () {
        var bodyObject = {
            mass: 10,
            position: {
              x: 1,
              y: 1,
              z: 1
            },
            speed: {
              x: -1,
              y: -1,
              z: -1
            }
          },
          body = new Body(bodyObject);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with passed array", function () {
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
            mass: 10,
            position: {
              x: 1,
              y: 1,
              z: 1
            },
            speed: {
              x: -1,
              y: -1,
              z: -1
            }
          },
          body = new Body(bodyObject.mass, bodyObject.position, bodyObject.speed);

        it("creates object with initialized array", function () {
          expect(body).to.be.instanceOf(Body);
          expect(body.array).to.be.instanceOf(BufferFactory);
        });

        it("initializes an object array with passed array", function () {
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
  });
}.call(this));