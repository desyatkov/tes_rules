var parents = require('ast-parents')
var R = require('ramda');


function upollerErr(node, context, cnt) {
    var e = parents(node);

        
    if (e.callee.type === 'Identifier') {
        var identName = e.callee.name;
        if ( R.test(/\$|jquery/ig, identName) ) {
            (function recur(subnode) {
                const checkExp = R.pathEq(["parent","type"], 'ExpressionStatement');
                const checkU = R.pathEq(["parent","expression","callee","object","name"], 'u');
                const lens = R.lensPath(["parent","expression","arguments", 1, "arguments", 0, 'value']);
                
                const paramX = R.view(lens, subnode);
                
                const lowerParam = R.when(
                    R.complement(R.isNil),
                    R.compose(
                        R.equals('jquery'),
                        R.toLower()
                    )
                );
                
                if ( checkExp(subnode) && checkU(subnode) && lowerParam(paramX) ) {
                    cnt++;
                    recur(subnode.parent)
                } else if (subnode.parent === null) {
                    if (cnt > 1) {
                        context.report({
                            node: e,
                            message: `--ps 😳  More than one jquery poller for this statement`
                        });
                    } else if (cnt === 0) {
                        context.report({
                            node: e,
                            message: `--ps 😱  Missing poller for Jquery statement`
                        });
                    }
                    return;
                } else {
                    recur(subnode.parent);
                }
            })(e)
        }
    }
}

module.exports = {
    meta: {
        docs: {
            description: "u.execWhenReadyPoller checking",
            category: "Fill me in",
            recommended: false
        },
        fixable: null, // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        var counter = 0;
        return {
            CallExpression: function (innernode) {
                upollerErr(innernode, context, counter);
            }
        };
    }
};