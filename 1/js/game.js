var canvas = document.getElementById('game1');
var ctx = canvas.getContext('2d');
var lastFrameTime = 0, maxFPS = 20;

function mainloop(timestamp) {
    if (timestamp < lastFrameTime + (1000 / maxFPS)) {
        requestAnimationFrame(mainloop);
        return;
    }
    var dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    updateGame(dt);
    drawGame();
    requestAnimationFrame(mainloop);
}
/***************** RENDER **********************/
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function box(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
/****************** INPUT ********************************/
canvas.addEventListener('click', function (event) {
    if (event.button == 0) {
        onClick(event.offsetX, event.offsetY);
    }
});
/****************** CUSTOM **************************/
var GameState = {
    ESPERANDO: 0,
    DESTAPANDO1: 1,
    DESTAPANDO2: 2,
    CHEQUEANDO: 3,
    MANTENIENDO: 4,
    TAPANDO: 5,
    WIN: 6
};
var ImageState = {
    DESTAPADA: 0,
    DESTAPANDO: 1,
    TAPADA: 2,
    TAPANDO: 3
};
var GW = 64,
    GH = 64,
    ROWS = 4,
    COLS = 4,
    EaseTimes = {
        transitar: 1300,
        mantener: 500
    },
    IM_PAD = 4,
    BOARD_PAD = [0, 50],
    BACK_COLOR = 'rgb(102, 172, 100)',
    SCORE_COLOR = 'rgb(37, 46, 92)';
var board = [],
    images = [],
    state = GameState.ESPERANDO,
    casilla0, casilla1, scoreTime;

function init() {
    for (var i = 0; i < (ROWS * COLS) / 2; i++) {
        var im = new Image();
        var strn = i < 10 ? '0' + i : '' + i;
        im.src = 'img/' + strn + '.jpg';
        images.push(im);
    }
    var imagesfill = [];
    for (var j = 0; j < images.length; j++) {
        imagesfill[j] = {
            img: images[j],
            count: 0
        };
    }
    for (var i = 0; i < ROWS; i++) {
        var column = [];
        for (var j = 0; j < COLS; j++) {
            var n = Math.trunc(Math.random() * imagesfill.length);
            var selected = imagesfill[n].img;
            imagesfill[n].count++;
            if (imagesfill[n].count >= 2) {
                imagesfill.splice(n, 1);
            }
            column.push({
                img: selected,
                estado: ImageState.TAPADA
            });
        }
        board.push(column);
    }
    ctx.font = "24px Helvetica";
    scoreTime = 0;
}
/*********input*********/
function onClick(x, y) {
    var i = Math.trunc((y - BOARD_PAD[1]) / (GH + IM_PAD));
    var j = Math.trunc((x - BOARD_PAD[0]) / (GW + IM_PAD));
    var im = (y - BOARD_PAD[1]) % (GH + IM_PAD),
        jm = (x - BOARD_PAD[0]) % (GW + IM_PAD);
    if(im > GH || jm > GW) {
        return;
    }
    if (state == GameState.ESPERANDO && board[i][j].estado == ImageState.TAPADA) {
        board[i][j].estado = ImageState.DESTAPANDO;
        board[i][j].t = EaseTimes.transitar;
        state = GameState.DESTAPANDO1;
        casilla0 = [i, j];
    } else if (state == GameState.DESTAPANDO1 && board[i][j].estado == ImageState.TAPADA) {
        board[i][j].estado = ImageState.DESTAPANDO;
        board[i][j].t = EaseTimes.transitar;
        state = GameState.DESTAPANDO2;
        casilla1 = [i, j];
    }
}

function renderImg(img, i, j, st, dt) {
    var x = j * (GW + IM_PAD) + BOARD_PAD[0],
        y = i * (GH + IM_PAD) + BOARD_PAD[1],
        k = dt / EaseTimes.transitar;
    if(st == ImageState.TAPADA) {
        box(x, y, GW, GH, BACK_COLOR);
    } else if(st == ImageState.DESTAPADA) {
        ctx.drawImage(img, x, y);
    } else if(st == ImageState.DESTAPANDO || st == ImageState.TAPANDO) {
        var kk,sc;
        if(st == ImageState.DESTAPANDO)
            k = k + 1 - 2*k;
        else
            k = k;
        kk = Math.abs(1 - 2*k);
        sc = (-2*kk + 3)*kk*kk;
        var ww = GW*sc;
        ctx.translate(x+(GW-ww)/2,y);
        ctx.scale(sc, 1);
        if(k < 0.5) {
            box(0, 0, GW, GH, BACK_COLOR);
        } else {
            ctx.drawImage(img, 0, 0);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function renderBoard() {
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var o = board[i][j];
            renderImg(o.img, i, j, o.estado, o.t);
        }
    }
}
function renderTimer() {
    ctx.fillStyle = SCORE_COLOR;
    var score = (scoreTime / 1000).toFixed(1) + 's';
    ctx.fillText(score, BOARD_PAD[0] + 20, 35);
}
function cas0() {
    var i0 = casilla0[0], j0 = casilla0[1];
    return board[i0][j0];
}
function cas1() {
    var i1 = casilla1[0], j1 = casilla1[1];
    return board[i1][j1];
}
function win() {
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            if(board[i][j].estado == ImageState.TAPADA) {
                return false;
            }
        }
    }
    return true;
}
function updateGame(dt) {
    if(state == GameState.WIN) {
        return;
    }
    scoreTime += dt;
    if (state == GameState.CHEQUEANDO) {
        var c0 = cas0(), c1 = cas1();
        if(c0.img === c1.img) { //acierto!
            state = GameState.ESPERANDO;
            if(win()) {
                state = GameState.WIN;
            }
        } else {
            state = GameState.MANTENIENDO;
            c0.estado = c1.estado = ImageState.DESTAPADA;
            c0.t = c1.t = EaseTimes.mantener;
        }
    }
    if(state == GameState.MANTENIENDO) {
        var c0 = cas0(), c1 = cas1();
        c0.t -= dt;
        c1.t -= dt;
        if(c0.t + c1.t <= 0) {
            state = GameState.TAPANDO;
            c0.estado = c1.estado = ImageState.TAPANDO;
            c0.t = c1.t = EaseTimes.transitar;
        }
    }
    if(state == GameState.DESTAPANDO1 || state == GameState.DESTAPANDO2 || state == GameState.TAPANDO) {
        var c0 = cas0();
        c0.t -= dt;
        if(c0.t <= 0) {
            if(state == GameState.TAPANDO) {
                c0.estado = ImageState.TAPADA;
                if(cas1().estado == ImageState.TAPADA) {
                    state = GameState.ESPERANDO;
                }
            } else if(state == GameState.DESTAPANDO1 || state == GameState.DESTAPANDO2) {
                c0.estado = ImageState.DESTAPADA;
            }
        }
    }
    if(state == GameState.DESTAPANDO2 || state == GameState.TAPANDO) {
        var c1 = cas1();
        c1.t -= dt;
        if(c1.t <= 0) {
            if(state == GameState.TAPANDO) {
                c1.estado = ImageState.TAPADA;
                if(cas0().estado == ImageState.TAPADA) {
                    state = GameState.ESPERANDO;
                }
            } else if(state == GameState.DESTAPANDO2) {
                c1.estado = ImageState.DESTAPADA;
                state = GameState.CHEQUEANDO;
            }
        }
    }
}

function drawGame() {
    clear();
    renderTimer();
    renderBoard();
}

/*go*/
init();
requestAnimationFrame(mainloop);