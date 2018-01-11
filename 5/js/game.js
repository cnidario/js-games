(function(_) {
    "use strict";
    var module = {};

    var TILETYPES = {
        BLOCK_A: 0,
        BLOCK_B: 1,
        BLOCK_C: 2,
        BLOCK_D: 3,
        WALL: 4,
        EMPTY: 5
    };
    var OBJTYPES = {
        PLAYER: 0,
        BALL: 1
    };
    var LEVELS = [
        [ '.............',
          '.............',
          'AAAAAAAAAAAAA',
          'AAAAAAAAAAAAA',
          'AAAAAAAAAAAAA',
          'AAAAAAAAAAAAA',
          '.............',
          '.............',
          '.............',
          '.............',
          '.............',
          '.............',
          '....0........',
          '.............',
          '.............',
          '.............',
          '........@....' ]
    ];
    var ROWS = 17, COLS = 13;
    var SCALEW = _.base.w / COLS, SCALEH = _.base.h / ROWS;
    var PLATFORMW = 50, PLATFORMH = 10, BALLSZ = 10;

    var level = 0, map, player, ball = { };
    var loadLevel = module.loadLevel = function(level) {
        var objTypes = {
            '@': OBJTYPES.PLAYER,
            '0': OBJTYPES.BALL
        };
        var tileTypes =  {
            'A': TILETYPES.BLOCK_A,
            'B': TILETYPES.BLOCK_B,
            'C': TILETYPES.BLOCK_C,
            'D': TILETYPES.BLOCK_D,
            '#': TILETYPES.WALL,
            '.': TILETYPES.EMPTY
        };
        tileTypes[OBJTYPES.PLAYER] = TILETYPES.EMPTY;
        tileTypes[OBJTYPES.BALL] = TILETYPES.EMPTY;
        var parse = _.mapParser.parse(LEVELS[level%LEVELS.length], tileTypes, objTypes);
        map = parse.map;
        player = parse.objects[OBJTYPES.PLAYER][0][1]*SCALEW;
        var tmpball = parse.objects[OBJTYPES.BALL][0];
        ball.pos = [tmpball[1]*SCALEW, tmpball[0]*SCALEH];
        ball.speed = [ 10, 10 ];
    };
    loadLevel(level);
    //TODO return _.collision.collideRectRect();
    //necesito colisiones, colisión y detectar qué lados hacen overlap, tamaños y cual mayor,
    //recordemos que colision es un overlap
    //TODO rebotes, son reflejar
    //quitar bloques que chocan, o interactuar
    //rebotar con bordes, con plataforma
    //vidas, condición de victoria, de derrota, puntuación, cambio de nivel, stages, restart level
    //menu quizá
    var isCollisionable = function(i, j) {
        switch(map[i][j]) {
            case TILETYPES.WALL:
            case TILETYPES.BLOCK_A:
            case TILETYPES.BLOCK_B:
            case TILETYPES.BLOCK_C:
            case TILETYPES.BLOCK_D: return true;
            default: return false;
        }
    };
    var rectFor = function(i, j) {
        return
    };
    var ballCollision = function() {
        for (var i = 0; i < map.length; i++)
          for (var j = 0; j < map[i].length; j++)
              if(isCollisionable(i, j)) {
                  var col = rectFor(i, j)
              }
    };

    module.update = function(dt) {
        var speed = 0;
        if(_.input.KEY_LEFT) speed = -10;
        else if(_.input.KEY_RIGHT) speed = 10;
        player += speed * dt/50;
        if(player < 0) player = 0;
        else if(player + PLATFORMW > _.base.w) player = _.base.w - PLATFORMW;
        ball.pos = _.vector.addscl(ball.pos, dt/350, ball.speed);

    };

    var drawBlock = function(i, j, type) {
        switch(type) {
            case TILETYPES.BLOCK_A: _.base.ctx.fillStyle = 'rgb(123,43,65)'; break;
            case TILETYPES.BLOCK_B: _.base.ctx.fillStyle = 'rgb(23,83,95)'; break;
            case TILETYPES.BLOCK_C: _.base.ctx.fillStyle = 'rgb(23,43,165)'; break;
            case TILETYPES.BLOCK_D: _.base.ctx.fillStyle = 'rgb(23,143,65)'; break;
        }
        _.base.ctx.fillRect(j*SCALEW, i*SCALEH, SCALEW-1, SCALEH-1);
    };
    var drawBlocks = function() {
        for (var i = 0; i < map.length; i++)
            for (var j = 0; j < map[i].length; j++) {
                var tile = map[i][j];
                if(tile != TILETYPES.EMPTY && tile != TILETYPES.WALL)
                    drawBlock(i, j, tile);
            }
    };
    var drawPlatform = function() {
        _.base.ctx.fillStyle = 'rgb(100,50,200)';
        _.base.ctx.fillRect(player-PLATFORMW/2, _.base.h-PLATFORMH, PLATFORMW, PLATFORMH);
    };
    var drawBall = function() {
      _.base.ctx.fillStyle = 'rgb(200,50,150)';
      _.base.ctx.fillRect(ball.pos[0]-BALLSZ/2, ball.pos[1]-BALLSZ/2, BALLSZ, BALLSZ);
    };
    module.render = function() {
        _.base.clear();
        _.base.ctx.fillStyle = 'rgb(0,0,0)';
        _.base.ctx.fillRect(0, 0, _.base.w, _.base.h);
        drawBlocks();
        drawPlatform();
        drawBall();
    }

    _.game = module;
})(this);

requestAnimationFrame(base.mainloop);
