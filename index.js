$('a');
u.execWhenReadyPoller(function(){ 
    u.execWhenReadyPoller(function(){ 
        $('b');
    },u.poller('jQuery'));
},u.poller('jQuery'));


var cc = $('b');