"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var analyzer = require('./lib/analyzer');

var analyzerFamily = require('./lib/analyzer-family');

var DEFAULT_SAFE_REP_LIMIT = 25;
var RET_IS_SAFE = true;
var RET_IS_VULNERABLE = false;

var Args = function Args(regExp, analyzerOptions) {
  _classCallCheck(this, Args);

  this.regExp = regExp;
  this.analyzerOptions = analyzerOptions;
};

function safeRegex(re, opts) {
  try {
    var args = buildArgs(re, opts);
    var analyzerResponses = askAnalyzersIfVulnerable(args); // Did any analyzer say true?

    if (analyzerResponses.find(function (isVulnerable) {
      return isVulnerable;
    })) {
      return RET_IS_VULNERABLE;
    } else {
      return RET_IS_SAFE;
    }
  } catch (err) {
    // Invalid or unparseable input
    return false;
  }
}

function buildArgs(re, opts) {
  // Build AnalyzerOptions
  if (!opts) opts = {};
  var heuristic_replimit = opts.limit === undefined ? DEFAULT_SAFE_REP_LIMIT : opts.limit;
  var analyzerOptions = new analyzer.AnalyzerOptions(heuristic_replimit); // Build RegExp

  var regExp = null; // Construct a RegExp object

  if (re instanceof RegExp) {
    regExp = re;
  } else if (typeof re === 'string') {
    regExp = new RegExp(re);
  } else {
    regExp = new RegExp(String(re));
  }

  return new Args(regExp, analyzerOptions);
}

function askAnalyzersIfVulnerable(args) {
  var analyzerSaysVulnerable = []; // Query the Analyzers

  var Analyzer;

  var _iterator = _createForOfIteratorHelper(analyzerFamily),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      Analyzer = _step.value;

      try {
        var _analyzer = new Analyzer(args.analyzerOptions);

        analyzerSaysVulnerable.push(_analyzer.isVulnerable(args.regExp));
      } catch (err) {
        /* istanbul ignore next */
        // No need to worry about code coverage here.
        analyzerSaysVulnerable.push(false);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return analyzerSaysVulnerable;
} // Export


module.exports = safeRegex;