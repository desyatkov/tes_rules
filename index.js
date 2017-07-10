/* global u, jQuery */
var saassd = $('a')
 
u.execWhenReadyPoller( function(){
    u.execWhenReadyPoller(function(){
        var aa = $('a')
    },u.poller('_'));

    u.execWhenReadyPoller(function(){
            u.execWhenReadyPoller(function() {
                var dd = jQuery(1234);
            },u.poller('ramda'));
    },u.poller('jquery'));

}, u.poller('ramda'));

var aa = $('a')