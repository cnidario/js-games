var GAME_ID = 'game2';
(function(global) {
    "use strict";
    var module = {};
    var canvas = module.canvas = document.getElementById(global.GAME_ID);
    var ctx = module.ctx =  canvas.getContext('2d');
    var lastFrameTime = 0, maxFPS = 20;
    document.addEventListener('keypress', function(event) {
        switch(event.keyCode) {
            case 37: global.game.left(); break;
            case 39: global.game.right(); break;
            case 38: global.game.up(); break;
            case 40: global.game.down(); break;
        }
    });
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
        global.game.update(dt);
        global.game.render();
        requestAnimationFrame(module.mainloop);
    };
    global.base = module;
})(this);

(function(global) {
    "use strict";
    var module = {};
    var GameState = {
        PLAYING: 0,
        GAMEOVER: 1
    };
    var state = GameState.PLAYING;
    var DIR = {
        N: [0, -1],
        E: [1, 0],
        S: [0, 1],
        O: [-1, 0]
    };
    var snake = module.snake = {
        body: [[-2, 2], [-1, 2], [0, 2], [1, 2]],
        dir: DIR.E,
        growing: 10,
        score: 0
    };
    var BLOCK_SZ = 10;
    var avAccum = 0;
    var apples = [];
    module.left = function() {
        if(snake.dir != DIR.E) snake.dir = DIR.O;
    };
    module.right = function() {
        if(snake.dir != DIR.O) snake.dir = DIR.E;
    };
    module.up = function() {
        if(snake.dir != DIR.S) snake.dir = DIR.N;
    };
    module.down = function() {
        if(snake.dir != DIR.N) snake.dir = DIR.S;
    };
    var vAdd = function(v, w) {
        return [v[0] + w[0], v[1] + w[1]];
    }
    var vEq = function(v, w) {
        return v[0] == w[0] && v[1] == w[1];
    }
    var checkCollision = module.checkCollision = function(newseg) {
        if(newseg[0] < 0 || newseg[0]*BLOCK_SZ >= global.base.w) return true;
        if(newseg[1] < 0 || newseg[1]*BLOCK_SZ >= global.base.h) return true;
        for(var i = 0; i < snake.body.length; i++)
            if(vEq(snake.body[i], newseg)) return true;
        return false;
    };
    var avanza = function(num) {
        var head = snake.body[snake.body.length - 1];
        for(var i = 0; i < num; i++) {
            var ins = vAdd(head, snake.dir);
            if(checkCollision(ins)) {
                state = GameState.GAMEOVER;
                return;
            }
            snake.body.push(ins);
            if(snake.growing <= 0) snake.body.shift();
            else snake.growing--;
        }
    };
    var checkEat = function() {
        var head = snake.body[snake.body.length - 1];
        for(var i = 0; i < apples.length; i++)
            if(vEq(apples[i], head)) {
                apples.splice(i, 1);
                snake.score++;
                snake.growing += 3;
                return true;
            }
        return false;
    }
    var spamApple = function() {
        var hecho = false, newapple;
        while(!hecho) {
            newapple = [
                Math.trunc(Math.random() * global.base.w / BLOCK_SZ),
                Math.trunc(Math.random() * global.base.h / BLOCK_SZ)
            ];
            var flag = false;
            for(var i = 0; i < snake.body.length; i++)
                if(vEq(newapple, snake.body[i])) flag = true;
            for(var j = 0; j < apples.length; j++)
                if(vEq(newapple, apples[j])) flag = true;
            if(!flag) hecho = true;
        }
        apples.push(newapple);
    }
    spamApple();
    spamApple();
    spamApple();
    module.update = function(dt) {
        if(state == GameState.GAMEOVER) return;
        avAccum += dt*0.015;
        if(avAccum >= 1) {
            avAccum = 0;
            avanza(1);
            if(checkEat()) spamApple();
        }
    };
    var drawSnake = function() {
        for(var i = 0; i < snake.body.length; i++) {
            var p = snake.body[i];
            var x = p[0] * BLOCK_SZ, y = p[1] * BLOCK_SZ;
            rect(x, y, BLOCK_SZ, BLOCK_SZ, 'rgb(180,29,32)');
        }
        if(state == GameState.GAMEOVER) {
            var p = snake.body[snake.body.length - 1];
            var x = p[0] * BLOCK_SZ, y = p[1] * BLOCK_SZ;
            rect(x, y, BLOCK_SZ, BLOCK_SZ, 'rgb(180,200,32)');
        }
    };
    var drawApples = function() {
        for (var i = 0; i < apples.length; i++) {
            var p = apples[i];
            var x = p[0] * BLOCK_SZ, y = p[1] * BLOCK_SZ;
            rect(x, y, BLOCK_SZ, BLOCK_SZ, 'rgb(80,220,32)');
        }
    };
    var drawScore = function() {
        global.base.ctx.font = '30px Verdana';
        global.base.ctx.fillStyle = 'rgb(0, 0, 0)';
        global.base.ctx.fillText(snake.score, global.base.w - 80, 35);
    };
    var rect = function(x, y, w, h, color) {
        global.base.ctx.fillStyle = color;
        global.base.ctx.fillRect(x, y, w, h);
    };

    module.render = function() {
        rect(0, 0, global.base.w, global.base.h, 'rgb(95, 166, 57)');
        drawApples();
        drawSnake();
        drawScore();
    }

    global.game = module;
})(this);

requestAnimationFrame(base.mainloop);
