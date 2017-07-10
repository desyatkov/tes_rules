/* global u, jQuery */
// /* eslint-disable */

var a = $('a');
$('aqq').show();

u.execWhenReadyPoller(function(){
    jQuery('aqq').show();
    var a = $('a');
    u.execWhenReadyPoller(function(){
         $('aqq').show();
    },u.poller('jquery'));
},u.poller('jquery'));




a('aqq').show();
