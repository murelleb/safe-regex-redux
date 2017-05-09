var parse = require('ret');
var types = parse.types;

module.exports = function (re, opts) {
    if (!opts) opts = {};
    var replimit = opts.limit === undefined ? 25 : opts.limit;
    
    if (isRegExp(re)) re = re.source;
    else if (typeof re !== 'string') re = String(re);
    console.log('re: ' + re);
    
    var tokens;
    try { tokens = parse(re) }
    catch (err) { return false }
    
    var reps = 0;
    /* The 'walk' function returns true if the node is safe, else false.
     * The 'starHeight' value is incremented when REPETITION is encountered,
     *   and this incremented value is then preserved in the recursive call to its stack/options. */
    return (function walk (node, starHeight) {
        /* Sanity check: node is a 'ret node'. */
        console.log('node type: ' + typeToString(node.type) + ', starHeight: ' + starHeight);
        if (!isValidRetType(node.type)) {
            console.log('Error, node doesn\'t look valid: type <' + node.type + '>');
            console.log(retNodeToString(node));
            return false;
        }

        if (node.type === types.REPETITION) {
            starHeight++;
            reps++;
            if (starHeight > 1) return false;
            if (reps > replimit) return false;
        }
        
        /* Walk each option for safety. */
        var options = node.options || (node.value && node.value.options) || [];
        for (var i = 0, len = options.length; i < len; i++) {
            var ok = walk({ type: types.GROUP, stack: options[i] }, starHeight);
            if (!ok) return false;
        }

        /* Walk each stack node for safety. */
        var stack = node.stack || (node.value && node.value.stack) || [];
        for (var i = 0; i < stack.length; i++) {
            console.log('Walking stack node ' + i + ':\n' + retNodeToString(stack[i]));
            var ok = walk(stack[i], starHeight);
            if (!ok) return false;
        }
        
        /* Nothing left -- we're safe. */
        return true;
    })(tokens, 0);
};

function isRegExp (x) {
    return {}.toString.call(x) === '[object RegExp]';
}

/* Return a string representation of a node from ret. */
function retNodeToString (retNode) {
	return JSON.stringify(retNode, null, 2);
}

/* Sanity check: Is this type one of the node types defined by ret? */
function isValidRetType (type) {
	for (var t in types) {
		if (types[t] === type)
			return true;
	}
	return false;
}

function typeToString (type) {
	for (var t in types) {
		if (types[t] === type)
			return t;
	}
	return '';
}
