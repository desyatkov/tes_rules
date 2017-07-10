var parents = require('ast-parents')
var _ = require('lodash');

module.exports = {
    create: function (context) {
        return {
            VariableDeclaration: function (node) {
                var e = parents(node);
                _.forEach(e.declarations, function (val) {
                    var exprs = val.init.callee.name;
                        var fname = val.id.name;
                        var exprsT = /\$|jquery/ig.test(exprs);

                    if (val.init && val.init.callee && exprsT) {
                        var uCount = 0, uCountarr = [], uCountObj = [];
                        
                        (function recur(subnode) {
                            if (subnode.parent && subnode.parent.type === 'ExpressionStatement') {
                                var name = e.declarations[0].id.name;
                                var n = subnode.parent.expression.callee;
                                var arg = _.last(subnode.parent.expression.arguments).arguments[0].value
                                // console.log( `${n.object.name}.${n.property.name}` );
                                // console.log(n.loc.start);\

                                var sourceCode = subnode.range;
                                // console.log(sourceCode, n.object.name, arg);/

                                var polerStart = n.loc.start
                                var polerEnd = _.last(subnode.parent.expression.arguments).arguments[0].loc.start;
                                uCount++;
                                uCountarr.push(arg);
                                uCountObj.push({arg:arg, line: polerEnd.line})
                                recur(subnode.parent)
                                
                            } else if( subnode.parent === null ){
                                
                                
                                var dublExpr =  _.filter(uCountarr, function (value, index, iteratee) {
                                  return _.includes(iteratee, value, index + 1);
                                });
                                
                                
                                var es = _.map( _.filter(uCountObj, (o)=> o.arg == dublExpr[0]), 'line'); 

                                

                                if( dublExpr.length ){
                                    context.report({
                                        node: node,
                                        message: `--ps 😱  More then one poller('${dublExpr[0]}') for this statment in ${es.join(' and ')} line`
                                    });
                                }
                                
                                if (uCount === 0) {
                                    context.report({
                                        node: node,
                                        message: `--ps 😂  jQuery declaration for '${fname}' not have u.poller(...)`
                                    });
                                }
                                 
                                return;
                            } else {
                                recur(subnode.parent)
                                
                            }
                        })(e)
                    }
                });
            }
        };
    }
};