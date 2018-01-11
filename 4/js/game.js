(function(_) {
    "use strict";
    var module = {};
    var DIR = {
        N: [0, -1],
        E: [1, 0],
        S: [0, 1],
        O: [-1, 0]
    };
    var OBJTYPE = {
        WALL: 1,
        GROUND: 2,
        EXIT: 3
    };
    var parseMap = module.parseMap = function(rows) {
        var map = [], player = [0, 0], stones = [];
        for (var i = 0; i < rows.length; i++) {
            var scanRow = rows[i], mapRow = [];
            for (var j = 0; j < scanRow.length; j++) {
                switch(scanRow[j]) {
                    case '#': mapRow.push(OBJTYPE.WALL); break;
                    case '@': mapRow.push(OBJTYPE.GROUND); player[0] = i; player[1] = j; break;
                    case '.': mapRow.push(OBJTYPE.GROUND); break;
                    case '0': mapRow.push(OBJTYPE.GROUND); stones.push([i,j]); break;
                    case 'X': mapRow.push(OBJTYPE.EXIT); break;
                }
            }
            map.push(mapRow);
        }
        return { map: map, player: player, stones: stones };
    };
    var BLOCK_SZ = 32;
    var tiles = {}; tiles.player = new Image(); tiles.env = new Image();
    tiles.player.src = 'img/player.png';
    tiles.env.src = 'img/tiles.png';
    //_.base.canvas.toDataURL('image/png', 1);
    var LEVELS = [
        [ '########',
          '#####@.#',
          '####.00#',
          '####.0.#',
          '###..#.#',
          '###....#',
          '##X..###',
          '########'],
        [ '########',
          '###.@###',
          '###..###',
          '#..0.###',
          '#.#.####',
          '#..0X###',
          '###.####',
          '########']
    ];
    var player, map, stones, level = 0;
    var changeLevel = function(lvl) {
        var lvlData = parseMap(LEVELS[lvl%LEVELS.length]);
        map = lvlData.map;
        player = lvlData.player;
        stones = module.stones = lvlData.stones;
    };
    changeLevel(level);
    var walkablePosition = function(i, j) { //comprueba si es GROUND o EXIT
        var obj = map[i][j];
        return obj == OBJTYPE.GROUND || obj == OBJTYPE.EXIT;
    };
    var isThereStone = module.isThereStone = function(i, j) { //comprueba si hay una piedra
        for (var k = 0; k < stones.length; k++) {
            var stone = stones[k];
            if(stone[0] == i && stone[1] == j)
                return stone;
        }
        return false;
    };
    var canMove = function(i, j) {
        var ii = i + player[0], jj = j + player[1];
        return walkablePosition(ii, jj) &&
                  (!isThereStone(ii, jj) ||
                  (walkablePosition(ii+i,jj+j) && !isThereStone(ii+i,jj+j)));
    };
    var doMove = function(di, dj) {
        var i = player[0] + di, j = player[1] + dj, stone;
        if(stone = isThereStone(i,j)) {
            stone[0] += di;
            stone[1] += dj;
        }
        player[0] = i;
        player[1] = j;
    };
    var eventQueue = [];
    var timerManager = function(dt) {
        for (var i = 0; i < eventQueue.length; i++) {
            var ev = eventQueue[i];
            ev.t -= dt;
            if(ev.t <= 0) {
                ev.fire(ev);
                eventQueue.splice(i, 1);
            }
        }
    };
    var moveBarrier = {};
    moveBarrier.hold = false;
    moveBarrier.fire = function(self) {
        self.hold = false;
    };
    var justMoved = function() {
        moveBarrier.hold = true;
        moveBarrier.t = 300;
        eventQueue.push(moveBarrier);
    };
    module.update = function(dt) {
        timerManager(dt);
        if(!moveBarrier.hold) {
            if(map[player[0]][player[1]] == OBJTYPE.EXIT) {
                changeLevel(++level);
            } else {
                if(_.input.KEY_UP && canMove(-1, 0)) {
                    doMove(-1,0);
                    justMoved();
                }
                if(_.input.KEY_DOWN && canMove(1, 0)) {
                    doMove(1,0);
                    justMoved();
                }
                if(_.input.KEY_LEFT && canMove(0, -1)) {
                    doMove(0,-1);
                    justMoved();
                }
                if(_.input.KEY_RIGHT && canMove(0, 1)) {
                    doMove(0,1);
                    justMoved();
                }
            }
        }
    };
    var drawWall = function(i, j) {
        _.base.ctx.drawImage(tiles.env, 0, 0, 64, 64, j*BLOCK_SZ, i*BLOCK_SZ, BLOCK_SZ, BLOCK_SZ);
    };
    var drawGround = function(i, j) {
        //_.base.ctx.drawImage(tiles.env, 64, 0, 64, 64, j*BLOCK_SZ, i*BLOCK_SZ, BLOCK_SZ, BLOCK_SZ);
        _.base.ctx.fillStyle = 'rgb(164, 164, 164)';
        _.base.ctx.fillRect(j*BLOCK_SZ, i*BLOCK_SZ, BLOCK_SZ, BLOCK_SZ);
    };
    var drawStone = function(i, j) {
        _.base.ctx.drawImage(tiles.env, 128, 0, 64, 64, j*BLOCK_SZ, i*BLOCK_SZ, BLOCK_SZ, BLOCK_SZ);
    };
    var drawPlayer = function(i, j) {
        _.base.ctx.drawImage(tiles.player, 0, 0, 64, 96, j*BLOCK_SZ, i*BLOCK_SZ-BLOCK_SZ*2/3, BLOCK_SZ, BLOCK_SZ*3/2);
    };
    var drawExit = function(i, j) {
      _.base.ctx.fillStyle = 'rgb(0, 0, 0)';
      _.base.ctx.fillRect(j*BLOCK_SZ, i*BLOCK_SZ, BLOCK_SZ, BLOCK_SZ);
    };
    var drawStones = function(i, j) {
        for (var i = 0; i < stones.length; i++)
            drawStone(stones[i][0], stones[i][1]);
    };
    var drawMap = function(map) {
        for (var i = 0; i < map.length; i++)
            for (var j = 0; j < map[i].length; j++) {
                var obj = map[i][j];
                switch(obj) {
                    case OBJTYPE.WALL:   drawWall(i, j); break;
                    case OBJTYPE.GROUND: drawGround(i, j); break;
                    case OBJTYPE.EXIT:   drawExit(i, j); break;
                }
            }
    };
    module.render = function() {
        _.base.clear();
        drawMap(map);
        drawStones(stones);
        drawPlayer(player[0], player[1]);
    }

    _.game = module;
})(this);

requestAnimationFrame(base.mainloop);
