(function () {
  var BodyPredictor = require("simulation/predictor/body"),
      predictorDefaults = require("simulation/predictor/defaults")
  Body = require("simulation/body"),
      Vector3 = require("math/vector3");

  describe("simulation/predictor/body - derivative calculation for given body", function () {

    it("is a constructor function", function () {
      expect(BodyPredictor).to.be.a("function");
    });

    describe("construction", function () {
      var predictor,
          body;

      beforeEach(function () {
        body = new Body(10, new Vector3(), new Vector3());
      });

      it("throws if no body is passed to constructor", function () {
        expect(function () {
          new BodyPredictor();
        }).to.throw();
      });

      describe("parameterless", function () {
        beforeEach(function () {
          predictor = new BodyPredictor(body);
        })

        it("creates BodyPredictor object", function () {
          expect(predictor).to.be.instanceof(BodyPredictor);
        });

        it("sets a default value to gravity constant", function () {
          expect(predictor.G).to.be.equal(predictorDefaults.G);
        });

        it("sets a default value to prediction step", function () {
          expect(predictor.step).to.be.equal(predictorDefaults.step);
        });

        it("sets a default value to minDistance", function () {
          expect(predictor.minDistance).to.be.equal(predictorDefaults.minDistance);
        });
      })

      describe("with parameters", function () {
        var expectedG = Math.PI,
            expectedStep = 0.001,
            expectedMinDistance = Math.E,
            params = {
              G:expectedG,
              step:expectedStep,
              minDistance:expectedMinDistance
            };

        beforeEach(function () {
          predictor = new BodyPredictor(body, params);
        });

        it("creates Predictor object", function () {
          expect(predictor).to.be.instanceof(BodyPredictor);
        });

        it("sets the correct value to gravity constant", function () {
          expect(predictor.G).to.be.equal(expectedG);
        })

        it("sets the correct value to prediction step", function () {
          expect(predictor.step).to.be.equal(expectedStep);
        });

        it("sets the correct value to minDistance", function () {
          expect(predictor.minDistance).to.be.equal(expectedMinDistance);
        });
      });
    });

    describe("interface", function () {
      var predictor,
          predictorMock,
          body;

      beforeEach(function () {
        body = new Body(10, new Vector3(), new Vector3());
        predictor = new BodyPredictor(body);
        predictorMock = sinon.mock(predictor);
      });

      afterEach(function () {
        predictorMock.verify();
        predictorMock.restore();
      });

      describe("calculateForce", function () {
        it("executes adjustForce on every body from otherBodies", function () {
          var other1 = new Body(),
              other2 = new Body(),
              others = [other1, other2],
              force = {
                x:0,
                y:0,
                z:0
              },
              result;

          predictorMock.expects("adjustForce")
              .withArgs(force, other1)
              .returns(force)
              .once();
          predictorMock.expects("adjustForce")
              .withArgs(force, other2)
              .returns(force)
              .once();
          predictor.calculateForce(others);
        });

        it("returns adjusted force", function () {
          var adjustStub = sinon.stub(predictor, "adjustForce"),
              force = {
                x:-1,
                y:-1,
                z:-1
              },
              result;
          adjustStub.returns(force);

          result = predictor.calculateForce([new Body()]);
          expect(result).to.be.equal(force);
        });

        it("throws if otherBodies are not an array", function () {
          expect(function () {
            predictor.calculateForce();
          }).to.throw();

        });
      });

      describe("adjustForce", function () {
        var otherBody, force;

        beforeEach(function () {
          force = {
            x:0,
            y:0,
            z:0
          };
          otherBody = new Body(10, new Vector3(1, 0, 0), new Vector3())
        });

        it("ignores interaction if bodies are too close", function () {
          var result;

          predictor.minDistance = 2;
          result = predictor.adjustForce(force, otherBody);

          expect(result).to.be.equal(force);
        });

        it("adjusts force correctly", function () {
          var result = predictor.adjustForce(force, otherBody);
          expect(result).to.be.eql({
            x:100,
            y:0,
            z:0
          });
        });
      })

      describe("calculateAcceleration", function () {
        var body, force,
            verify = function (result) {
              expect(result).to.be.instanceof(Vector3);
              expect(result).to.have.property("x", 1);
              expect(result).to.have.property("y", 2);
              expect(result).to.have.property("z", -3);
            };

        beforeEach(function () {
          force = {
            x:10,
            y:20,
            z:-30
          };
        });

        it("calculates acceleration correctly for force being Object", function () {
          var result = predictor.calculateAcceleration(force);
          verify(result);
        });

        it("calculates acceleration correctly for force being Vector3", function () {
          var result = predictor.calculateAcceleration(new Vector3(force));
          verify(result);
        });
      });

      describe("calculateDerivative", function () {
        var d;

        beforeEach(function () {
          body.speed = new Vector3(10, 20, -30);
          predictor.step = 0.1;

          d = predictor.calculateDerivative(new Vector3({
            x:10,
            y:20,
            z:-30
          }));
        });

        it("calculates position derivative correctly", function () {
          expect(d).to.have.property("position");
          expect(d.position).to.have.property("x", 1);
          expect(d.position).to.have.property("y", 2);
          expect(d.position).to.have.property("z", -3);
        });

        it("calculates speed derivative correctly", function () {
          expect(d).to.have.property("speed");
          expect(d.speed).to.have.property("x", 1);
          expect(d.speed).to.have.property("y", 2);
          expect(d.speed).to.have.property("z", -3);
        });

      });

      describe("getDerivative", function () {
        var stubs;

        beforeEach(function () {
          stubs = {
            calculateForce:sinon.stub(predictor, "calculateForce"),
            calculateAcceleration:sinon.stub(predictor, "calculateAcceleration"),
            calculateDerivative:sinon.stub(predictor, "calculateDerivative")
          }
        });

        it("call calculateForce with correct arguments", function () {
          var bodies = [];
          stubs.calculateForce.restore();
          predictorMock.expects("calculateForce")
              .withArgs(bodies)
              .once();
          predictor.getDerivative(bodies);
          predictorMock.verify();
        });

        it("calls calculateAcceleration with correct arguments", function () {
          var force = {};
          stubs.calculateForce.returns(force);
          stubs.calculateAcceleration.restore();
          predictorMock.expects("calculateAcceleration")
              .withArgs(force)
              .once();
          predictor.getDerivative();
          predictorMock.verify();
        })

        it("calls calculateDerivative with correct arguments and returns it results", function () {
          var acceleration = {},
              derivative = {},
              result;
          stubs.calculateAcceleration.returns(acceleration);
          stubs.calculateDerivative.restore();
          predictorMock.expects("calculateDerivative")
              .withArgs(acceleration)
              .returns(derivative)
              .once();

          result = predictor.getDerivative();
          predictorMock.verify();

          expect(result).to.be.equal(derivative);
        })

      });
    });
  });
}).call(this);
