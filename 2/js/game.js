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
    var NUMENEMIES = 6;
    var NUM_CARRILES = 6;
    var player = module.player = {
        carril: Math.trunc((NUM_CARRILES - 1)/2),
        y: 0,
        speed: 220,
        score: 0
    };
    var state = GameState.PLAYING;
    var enemies = [];
    var MINSPANDIST = 96, newestEnemies = [], nextSpamTime = 0, MAXSPAMTIME = 1300, MINSPAMTIME = 700;
    for(var i = 0; i < NUM_CARRILES; i++) newestEnemies.push({y: 0}); //fake enemy
    var CARW = 32, CARH = 64, ROADW = 48, ROADH = 32;
    var OFFSETX = (global.base.w - NUM_CARRILES * ROADW) / 2;
    var sprites = {};
    sprites.ROAD = new Image();
    sprites.CARS = new Image();
    sprites.ROAD.src = 'img/road.png';
    sprites.CARS.src = 'img/cars.png';

    var carrilOffset = function(carril) {
        return OFFSETX + (ROADW - CARW)/2 + ROADW * carril;
    };
    var spamEnemy = function() { //where to spam
        var spamable = [];
        for(var i = 0; i < NUM_CARRILES; i++) {
            if(newestEnemies[i].y - player.y > MINSPANDIST) spamable.push(i);
        }
        if(spamable.length == 0) return;
        var carril = Math.round(Math.random()*(spamable.length-1));
        var selected = spamable[carril];
        var enemy = {
            kind: Math.round(Math.random()*4),
            carril: selected,
            y: player.y - global.base.h + CARH/2,
            speed: Math.random()*50+10
        };
        newestEnemies[selected] = enemy;
        enemies.push(enemy);
    };
    var spamEnemies = function(dt) { //when to spam
        nextSpamTime -= dt;
        if(enemies.length < NUMENEMIES && nextSpamTime <= 0) {
            spamEnemy();
            nextSpamTime = Math.random()*(MAXSPAMTIME-MINSPAMTIME)+MINSPAMTIME;
        }
    };
    var checkCollisions = function() {
        for(var i = 0; i < enemies.length; i++) {
            var overlap = enemies[i].y + CARH > player.y && enemies[i].y < player.y;
            if(overlap && enemies[i].carril == player.carril) return true;
        }
        return false;
    };

    module.left = function() {
        if(state == GameState.GAMEOVER) return;
        player.carril -= 1;
        if(player.carril < 0) player.carril = 0;
    };
    module.right = function() {
        if(state == GameState.GAMEOVER) return;
        player.carril += 1;
        if(player.carril >= NUM_CARRILES) player.carril = NUM_CARRILES - 1;
    };
    module.update = function(dt) {
        if(state == GameState.GAMEOVER) return;
        player.y -= player.speed * dt/1000;
        for(var i = 0; i < enemies.length; i++) {
            enemies[i].y -= enemies[i].speed * dt/1000;
            if(enemies[i].y > player.y + CARH) {
                enemies.splice(i, 1);
                player.score += 1;
            }
        }
        if(checkCollisions()) state = GameState.GAMEOVER;
        spamEnemies(dt);
    };
    var drawRow = function(y) {
        var ctx = global.base.ctx;
        ctx.drawImage(sprites.ROAD, 0, 0, ROADW, ROADH, OFFSETX, y, ROADW, ROADH);
        for(var j = 1; j < NUM_CARRILES - 1; j++) {
            ctx.drawImage(sprites.ROAD, ROADW*2, 0, ROADW, ROADH, j*ROADW+OFFSETX, y, ROADW, ROADH);
        }
        ctx.drawImage(sprites.ROAD, ROADW, 0, ROADW, ROADH, (NUM_CARRILES-1)*ROADW+OFFSETX, y, ROADW, ROADH);
    };
    var drawBackground = function() {
        var offy = -Math.round(player.y % ROADH);
        for(var i = (offy - ROADH) % ROADH; i < global.base.h; i += ROADH) {
            drawRow(i);
        }
    };
    module.enemies = enemies;
    var drawEnemies = function() {
        for(var i = 0; i < enemies.length; i++) {
            global.base.ctx.drawImage(sprites.CARS,
                                      CARW + enemies[i].kind*CARW, 0, CARW, CARH,
                                      carrilOffset(enemies[i].carril),
                                      enemies[i].y - player.y + global.base.h - CARH - 5,
                                      CARW, CARH);
        }
    };
    var drawPlayer = function() {
        global.base.ctx.drawImage(sprites.CARS, 0, 0, CARW, CARH,
           carrilOffset(player.carril), global.base.h - CARH - 5, CARW, CARH);
    };
    var drawScore = function() {
        global.base.ctx.font = '30px Verdana';
        global.base.ctx.fillStyle = 'rgb(0, 0, 0)';
        global.base.ctx.fillText(player.score, global.base.w - 80, 35);
    };

    module.render = function() {
        global.base.clear();
        var ctx = global.base.ctx;
        drawBackground();
        drawEnemies();
        drawPlayer();
        drawScore();
    }

    global.game = module;
})(this);

requestAnimationFrame(base.mainloop);
