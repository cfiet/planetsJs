expect = chai.expect;

(function () {
  "use strict";
  mocha.setup('bdd');

  require("test/math/vector3");
  require("test/simulation/body");

}.call(this));