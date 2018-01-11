
var InputController = {
    init: function(){},
    onClick: function (x, y) {
        var i = Math.trunc(y / (64 + 2 + 2));
        var j = Math.trunc(x / (64 + 2 + 2));
        if (gamestate == GAMESTATES.DESTAPE0 && board[i][j].estado == IMSTATES.TAPADA) {
            board[i][j].estado = IMSTATES.DESTAPADA;
            gamestate = GAMESTATES.DESTAPE1;
            chk0 = [i, j];
        } else if (gamestate == GAMESTATES.DESTAPE1 && board[i][j].estado == IMSTATES.TAPADA) {
            board[i][j].estado = IMSTATES.DESTAPADA;
            gamestate = GAMESTATES.CHECK;
            chktimer = 0;
            chk1 = [i, j];
        }
    }
};

var game = {
    GameState: {
        DESTAPE0: 0,
        DESTAPE1: 1,
        CHECK: 2
    },
    ImageState: {
        DESTAPADA: 0,
        TAPADA: 1
    },
    settings: {
        gridw: 64,
        gridh: 64,
        rows: 5,
        cols: 5,
        checkDeltaTime: 300
    },
    env: null,
    state: {
        board: [],
        images: [],
        state: 0
    },
    init: function () {
        var i, j, im, strn, imfill, c, ims = [];
        for (i = 0; i < (this.settings.rows * this.settings.cols) / 2; i++) {
            im = new Image();
            strn = i < 10 ? '0' + i : '' + i;
            im.src = 'img/' + strn + '.jpg';
            ims.push(im);
            imfill = [];
            for (j = 0; j < ims.length; j++) {
                imfill[j] = {
                    img: ims[j],
                    count: 0
                };
            }
        }
        for (i = 0; i < this.settings.rows; i++) {
            c = [];
            for (j = 0; j < this.settings.cols; j++) {
                c.push({
                    img: this.pickImg(imfill),
                    estado: this.ImageState.TAPADA
                });
            }
            this.state.board.push(c);
        }
    },

    pickImg: function (imfill) {
        var n = Math.trunc(Math.random() * imfill.length);
        var res = imfill[n].img;
        imfill[n].count++;
        if (imfill[n].count >= 2) {
            imfill.splice(n, 1);
        }
        return res;
    },

    updateGame: function (dt) {
        if (this.state.state == this.GameState.CHECK) {
            if (chktimer >= CHKTIME) {
                if (board[chk0[0]][chk0[1]].img === board[chk1[0]][chk1[1]].img) {
                    gamestate = GAMESTATES.DESTAPE0;
                } else {
                    board[chk0[0]][chk0[1]].estado = board[chk1[0]][chk1[1]].estado = IMSTATES.TAPADA;
                    gamestate = GAMESTATES.DESTAPE0;
                }
            } else {
                chktimer += dt;
            }
        }
    },
    renderBoard: function () {
        for (var i = 0; i < this.settings.rows; i++) {
            for (var j = 0; j < this.settings.cols; j++) {
                if (board[i][j].estado == IMSTATES.DESTAPADA) {
                    ctx.drawImage(board[i][j].img, j * (gridw + 2 + 2), i * (gridh + 2 + 2));
                } else {
                    box(j * (gridw + 2 + 2), i * (64 + 2 + 2), 64, 64, 'rgb(20,127,12)');
                }
            }
        }
    },
    drawGame: function () {
        this.env.clear();
        this.renderBoard();
    }
};

/*******************************************/
var machinery = {
    id: 'game1',
    maxFPS: 20,
    lastFrameTime: 0,
    canvas: null,
    ctx: null,
    input: null,
    paintColor: 'rgb(200,0,0)',
    game: null,
    init: function (game, input) {
        this.game = game;
        game.env = this;
        this.input = input;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('click', function (event) {
            if (event.button == 0) {
                this.input.onClick(event.clientX, event.clientY);
            }
        }.bind(this));
    },
    outOfBounds: function (x, y) {
        return x >= this.canvas.width || y >= this.canvas.height || x < 0 || y < 0;
    },
    clear: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    box: function (x, y, w, h) {
        if (this.outOfBounds(x, y)) return;
        this.ctx.fillStyle = this.paintColor;
        this.ctx.fillRect(x, y, w, h);
    },
    setColor: function (color) {
        this.paintColor = color;
    },
    mainloop: function (timestamp) {
        if (timestamp < this.lastFrameTime + (1000 / this.maxFPS)) {
            requestAnimationFrame(mainloop);
            return;
        }
        var dt = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.game.updateGame(dt);
        this.game.drawGame();
        requestAnimationFrame(mainloop);
    }
};

game.init();
InputController.init();
machinery.init(game, InputController);
requestAnimationFrame(machinery.mainloop);