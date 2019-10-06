var safe = require('../');

var good = [
    /\bOakland\b/,
    /\b(Oakland|San Francisco)\b/i,
    /^\d+1337\d+$/i,
    /^\d+(1337|404)\d+$/i,
    /^\d+(1337|404)*\d+$/i,
    /(a+)|(b+)/,
    RegExp(Array(26).join('a?') + Array(26).join('a')),
    // String input.
    'aaa',
    '/^\d+(1337|404)*\d+$/',
    '^@types/query-string'
];

test('safe regex', function () {
    good.forEach(function (re) {
        expect(safe(re)).toBe(true);
    });
});


var bad = [
    /^(a?){25}(a){25}$/,
    RegExp(Array(27).join('a?') + Array(27).join('a')),
    /(x+x+)+y/,
    /foo|(x+x+)+y/,
    /(a+){10}y/,
    /(a+){2}y/,
    /(.*){1,32000}[bc]/,
    // Star height with branching and nesting.
    /(a*|b)+$/,
    /(a|b*)+$/,
    /(((b*)))+$/,
    /(((b*))+)$/,
    // String input.
    '(a+)+'
];

test('unsafe regex', function () {
    bad.forEach(function (re) {
        expect(safe(re)).toBe(false);
    });
});

var invalid = [
    '*Oakland*',
    'hey(yoo))',
    'abcde(?>hellow)',
    '[abc'
];

test('invalid regex', function () {
    invalid.forEach(function (re) {
        expect(safe(re)).toBe(false);
    });
});
