"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Generic options
var AnalyzerOptions = function AnalyzerOptions(heuristic_replimit) {
  _classCallCheck(this, AnalyzerOptions);

  this.heuristic_replimit = heuristic_replimit;
};

var AttackString = function AttackString(prefixAndPumpList, suffix) {
  _classCallCheck(this, AttackString);

  this.prefixAndPumpList = prefixAndPumpList;
  this.suffix = suffix;
}; // Abstract class


var Analyzer = /*#__PURE__*/function () {
  function Analyzer(analyzerOptions) {
    _classCallCheck(this, Analyzer);

    this.options = analyzerOptions;
  } // Subclasser must implement
  // Return boolean


  _createClass(Analyzer, [{
    key: "isVulnerable",
    value: function isVulnerable(regExp) {
      return false;
    } // Subclass must implement
    // Returns an AttackString or null

  }, {
    key: "genAttackString",
    value: function genAttackString(regExp) {
      return null;
    }
  }]);

  return Analyzer;
}();

module.exports = function (re, replimit) {
  // Build an AST
  var myRegExp = null;
  var ast = null;

  try {
    // Construct a RegExp object
    if (re instanceof RegExp) {
      myRegExp = re;
    } else if (typeof re === "string") {
      myRegExp = new RegExp(re);
    } else {
      myRegExp = new RegExp(String(re));
    } // Build an AST


    ast = regexpTree.parse(myRegExp);
  } catch (err) {
    // Invalid or unparseable input
    return false;
  }

  var currentStarHeight = 0;
  var maxObservedStarHeight = 0;
  var repetitionCount = 0;
  regexpTree.traverse(ast, {
    Repetition: {
      pre: function pre(_ref) {
        var node = _ref.node;
        repetitionCount++;
        currentStarHeight++;

        if (maxObservedStarHeight < currentStarHeight) {
          maxObservedStarHeight = currentStarHeight;
        }
      },
      post: function post(_ref2) {
        var node = _ref2.node;
        currentStarHeight--;
      }
    }
  });
  return maxObservedStarHeight <= 1 && repetitionCount <= replimit;
};

module.exports = {
  "AnalyzerOptions": AnalyzerOptions,
  "Analyzer": Analyzer
};