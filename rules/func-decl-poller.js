const parents = require('ast-parents')
const _ = require('lodash');
const R = require('ramda');
const {pipe, map, props, flatten, filter, join} = R;

var randomEmoji = require('random-emoji');
 
var emoji = randomEmoji.random({count: 1})[0]

module.exports = {
    meta: {
        docs: {
            description: "not allowed to use one character in func params names",
            category: "Fill me in",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {
        return {

            FunctionDeclaration: function (node) {
                var isOK = node.params.reduce(function (acc, item) {
                    return item.name.length < 2;
                }, false);
                 
                const parNames = pipe(
                    map( a => props(['name'],a) ),
                    flatten,
                    filter( a=> a.length < 2 ),
                    join(', ')
                )( node.params )

                if (isOK) {
                    context.report({
                        node: node,
                        message: `--ps ${emoji.character} not allow one character param name '${parNames}'`
                    });
                }
            }
        };
    }
};