(function(_) {
    "use strict";
    var module = {};
    var canvas = module.canvas = document.getElementById('game');
    var ctx = module.ctx =  canvas.getContext('2d');
    var lastFrameTime = 0, maxFPS = 20;
    module.w = canvas.width;
    module.h = canvas.height;
    module.clear = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    module.mainloop = function(timestamp) {
        if(timestamp < lastFrameTime + 1000/maxFPS) {
            requestAnimationFrame(module.mainloop);
            return;
        }
        var dt = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        _.game.update(dt);
        _.game.render();
        requestAnimationFrame(module.mainloop);
    };
    _.base = module;
})(this);
