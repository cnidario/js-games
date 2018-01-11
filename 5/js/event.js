(function(_) {
    "use strict";
    var module = {};

    var queue = [];
    var handlers = {}; // class -> [handlers]

    var PROCESS_ACTION = module.PROCESS_ACTION = {
        REMOVE: 0,
        CHAIN: 1
    };

    var EVENT_CLASS = module.EVENT_CLASS = {
        TIMER: 0
    };

    module.event = function(clase, tipo) {
        return { 'clase': clase, 'tipo': tipo };
    };
    module.addEvent = function(event) {
        queue.push(event);
    };
    module.removeEvent = function(event) {
        var i = queue.indexOf(event);
        if(i != -1) queue.splice(i, 1);
    };
    module.addHandler = function(handler) {
        handlers.push(handler);
    };
    module.removeHandler = function(handler) {
        var i = handlers.indexOf(handler);
        if(i != -1) handlers.splice(i, 1);
    };
    var processEvent = function(event) {
        for(var i = 0; i < queue.length; i++) {
            var ev = queue[i], processed = false;
            if(handlers.hasOwnProperty(ev.clase))
                for (var j = 0; j < handlers.length; j++) {
                    processed = true;
                    if(handlers[j].tipo == ev.tipo && handlers[j](ev) == PROCESS_ACTION.REMOVE)
                        break;
                }
            if(processed) queue.splice(i,1);
        }
    };


    var intervals = [];

    module.TIMER_EVENT_TYPE = {
        ALARM: 0
    };

    module.alarm = function(t) {
        var interval = {
            callback: function(self) {
                module.addEvent(module.event(module.EVENT_CLASS.TIMER, module.TIMER_EVENT_TYPE.ALARM));
                clearInterval(self.id);
            }
        };
        interval.id = setInterval(interval.callback, t, interval);
    };

    _.event = module;
})(this);
