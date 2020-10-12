"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _wrapRegExp(re, groups) { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = _wrapNativeSuper(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } _inherits(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (_typeof(args[args.length - 1]) !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var safeRegex = require("../");

var REPETITION_LIMIT = 25;
var REPETITION_TOO_MUCH = REPETITION_LIMIT + 1; // TODO Named character classes

test("The full set of JS regex features are supported", function () {
  /**
   * A list of linear-time regexes using a reasonably exhaustive
   * set of the supported JS regex features.
   * cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
   *
   * The purpose of this list is to check for
   * full regex syntax support.
   */
  var diverseLinTimeRegexes = [
  /* Truly Regular Expressions */
  // Conjunction
  /a/, /abc/, // Simple zero-width assertions
  /^a/, /a$/, // Quantifiers
  /^a*/, /^a+/, /a?/, /x{5}/, /x{5,}/, /x{5,10}/, // Grouping constructs
  /(x)/, /(?:x)/, // Disjunction
  /x|y/, // Built-in character classes
  /.\./, /[\b]/, /\b/, /\B/, /\cA/, /\d/, /\D/, /\f/, /\n/, /\r/, /\s/, /\S/, /\t/, /\v/, /\w/, /\W/, /\0/, /\x00/, /\u0000/, /\0/, // Custom character classes
  /[xyz]/, /[x-z]/, /[^xyz]/, /[^x-z]/,
  /* Extended features */
  // Backreferences
  /(x) \1/, // Lookaround assertions
  /x(?=y)/, /x(?!y)/,
  /* Added in ECMAScript 2018 */
  // Lookbehind assertions
  /(?<=y)x/, /(?!<y)x/,
  /*#__PURE__*/
  // Named capture groups
  _wrapRegExp(/([0-9]{4})/, {
    year: 1
  }), /*#__PURE__*/_wrapRegExp(/(a)\1/, {
    year: 1
  }),
  /*#__PURE__*/
  // Tests related to bug #26
  _wrapRegExp(/(test?)/, {
    year: 1
  }), /*#__PURE__*/_wrapRegExp(/(test*)/, {
    year: 1
  }), /*#__PURE__*/_wrapRegExp(/(test)*/, {
    year: 1
  })];
  diverseLinTimeRegexes.forEach(function (re) {
    expect(safeRegex(re)).toBe(true);
  });
});
test("linear-time regexes are safe", function () {
  var linTime = [
  /**
   * No false positives
   */
  // Standard regex features
  /a/, /a*/, /^a*/, /^a+$/, /a+$/, /a?/, /a{3,5}/, /a|b/, /(ab)/, /(ab)\1/, /\bOakland\b/, /^((a+)|(b+))/, /(a+)|(b+)/, // RE's in a string
  "^foo/bar", // non-RE, non-string
  1];
  linTime.forEach(function (re) {
    expect(safeRegex(re)).toBe(true);
  });
});
test("linear-time regexes are safe, under varying repetition limits", function () {
  var re1 = RegExp("a?".repeat(REPETITION_LIMIT) + "a".repeat(REPETITION_LIMIT));
  expect(safeRegex(re1)).toBe(true);
  var LOW_REPETITION_LIMIT = 3;
  var re2 = RegExp(Array(LOW_REPETITION_LIMIT).join("a?"));
  expect(safeRegex(re2, {
    limit: LOW_REPETITION_LIMIT
  })).toBe(true);
});
test("poly-time regexes are safe (at least according to our heuristics)", function () {
  var polyTime = [/^a+a+$/, // QOA
  /^a+aa+$/, // QOA with obvious intermediate run
  /^a+aaaa+$/, // QOA with obvious intermediate run
  /^a+[a-z]a+$/, // QOA with obvious intermediate run
  /^a+\wa+$/, // QOA with intermediate character class
  /^a+(\w|\d)a+$/, // QOA with valid path through
  /^a+b?a+$/, // QOA with valid path through
  /^a+(cde)*a+$/, // QOA with valid path through
  /^.*a*$/, // QOA by subset
  /^\w*\d*$/, // QOA by intersection
  /^\S+@\S+\.\S+$/, // Example from Django
  /a+$/, // QOA under partial-match
  /abc.*$/ // QOA under partial-match
  // TODO It would be nice to have one of the regexes that are poly-time even when they match, due to non-greedy quantifiers (p-NFA)
  ];
  polyTime.forEach(function (re) {
    expect(safeRegex(re)).toBe(true);
  });
});
test("exp-time regexes due to star height are unsafe", function () {
  var expTime = [// Straightforward star height
  /(a*)*$/, /(a?)*$/, /(a*)?$/, /(a*)+$/, /(a+)*$/, /(\wa+)*$/, // Prefix
  /(\..*)*$/, // Suffix
  // Branching and nesting.
  /(a*|b)+$/, /(a|b*)+$/, /(((b*)))+$/, /(((b*))+)$/, /(((b*)+))$/, /(((b)*)+)$/, /(((b)*))+$/, // Misc. more complex cases
  /^(a?){25}(a){25}$/, /(x+x+)+y/, /foo|(x+x+)+y/, /(a+){10}y/, /(a+){2}y/, /(.*){1,32000}[bc]/, // RE's in a string
  "(a+)+"];
  expTime.forEach(function (re) {
    expect(safeRegex(re)).toBe(false);
  });
});
test("linear-time regexes with star height > 1", function () {
  // TODO These are false positives, Fix once we improve analysis
  var linTime = [/(ab*)+$/, /(b*a)+$/];
  linTime.forEach(function (re) {
    expect(safeRegex(re)).toBe(false);
  });
});
test("exp-time regexes due to disjunction are safe (according to current heuristics)", function () {
  // TODO These are false negatives. Fix once we improve analysis
  var expTime = [/(a|a)*$/, // QOD: obvious 
  /(a|\w)*$/, // QOD due to overlap
  /([abc]|b)*$/, // QOD due to overlap
  /(\w\w\w|bab)*$/ // QOD due to overlap, with multi-step internal paths
  ];
  expTime.forEach(function (re) {
    expect(safeRegex(re)).toBe(true);
  });
});
test("regex that exceeds repetition limit is unsafe", function () {
  var re1 = RegExp("a?".repeat(REPETITION_TOO_MUCH) + "a".repeat(REPETITION_TOO_MUCH));
  expect(safeRegex(re1)).toBe(false);
  var LOW_REPETITION_LIMIT = 3;
  var re2 = RegExp("a?".repeat(LOW_REPETITION_LIMIT + 1));
  expect(safeRegex(re2, {
    limit: LOW_REPETITION_LIMIT
  })).toBe(false);
});
test("invalid regexes default to unsafe", function () {
  var invalid = ["(a+", "[a-z", "*Oakland*", "hey(yoo) )", "abcde(?>hellow)", "[abc"];
  invalid.forEach(function (re) {
    expect(safeRegex(re)).toBe(false);
  });
});