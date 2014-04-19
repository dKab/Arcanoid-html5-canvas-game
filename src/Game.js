function Game() {
    this.fps = 100;
    //this.canvas = document.getElementById('game_field');
    //this.canvas.width = this.canvas.height = 500;
    var canvas = document.getElementById('game_field');
    this.height = 500;
    this.width = 512;
    this.canvasUtil = new CanvasUtil(canvas);
    //this.ctx = this.canvas.getContext('2d');
    this.stage = 1;
    this.lives = 3;
    this.totalScore = 0;
    this.paused = true;
    this.lastRender = 0;

    var bate = new Bate(this);
    //bate.placeAt(256 - bate.width / 2, 450);
    this.bate = bate;
    this.balls = [];
    var ball = new Ball(this);
    ball.placeAt(256 - ball.radius, 450 - ball.height);
    this.balls.push(ball);
    this.levels = {
        1: [
            ['b', 0, 0, 0, 0, 0, 0, 0],
            ['g', 'g', 0, 0, 0, 0, 0, 0],
            ['y', 'y', 'y', 0, 0, 0, 0, 0],
            ['w', 'w', 'w', 'w', 0, 0, 0, 0],
            ['o', 'o', 'o', 'o', 'o', 0, 0, 0],
            ['p', 'p', 'p', 'p', 'p', 'p', 0, 0],
            ['u', 'u', 'u', 'u', 'u', 'u', 's', 's']
        ],
        2: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 's', 's', 0, 0, 0],
            [0, 0, 's', 'o', 'o', 's', 0, 0],
            [0, 's', 'g', 'g', 'g', 'g', 's', 0],
            [0, 's', 'y', 'y', 'p', 'p', 's', 0],
            [0, 's', 'a', 'a', 'a', 'a', 's', 0],
            [0, 0, 's', 'p', 'p', 's', 0, 0],
            [0, 0, 0, 'u', 'u', 0, 0, 0]
        ]
    };


    this.renderLevel();
    this.collisionResolver = new CollisionResolver(this);

}

Game.prototype.gameloop = function() {

    var current = new Date().getTime(),
            delta = current - this.lastRender;

    if (delta >= this.delay && !this.paused) {
        //console.log('hi');
        this.updateAll();
        if (this.paused)
            return;
        this.drawAll();
        this.lastRender = new Date().getTime();
    }
    //var game = this;
    //console.log(this);
    this.loop = requestAnimationFrame(Game.prototype.gameloop.bind(this));
};

Game.prototype.win = function() {
    this.canvasUtil.message('Congrats! You win! \n Your score: ' + this.totalScore);
};

Game.prototype.over = function() {
    this.pause();
    this.canvasUtil.message('Game over! \n Your score: ' + this.totalScore);
};

Game.prototype.renderLevel = function() {

    this.canvasUtil.clear();
    this.canvasUtil.fillBlack();
    this.bricks = new BricksCollection(this);
    this.toInitialPosition();
    // this.balls[0].xVelocity = 0;
    //this.balls[0].yVelocity =0;
    this.drawAll();
};

Game.prototype.decrementLives = function() {
    this.lives--;

    if (this.lives === 0) {
        this.over();
        return;
    }
    this.toInitialPosition();
    this.drawAll();
    this.pause();
};

Game.prototype.toInitialPosition = function() {
    this.bate.placeAt(256 - this.bate.width / 2, 450);
    this.balls = [];
    this.balls.push(new Ball(this));
    this.balls[0].placeAt(256 - this.balls[0].radius, 450 - this.balls[0].height);
};

Game.prototype.start = function() {
    var game = this;
    game.paused = false;
    //this.renderLevel();
    document.addEventListener('mousemove', function(e) {
        var offset = game.canvasUtil.canvas.getBoundingClientRect().left;
        //console.log(game);
        //console.log(game.canvas);

        // var min = Math.min(((e.clientX-offset) - this.bate.width/2), 0);
        var x = (e.clientX - offset) - game.bate.width / 2;
        if (x < 0) {
            x = 0;
        } else if (x + game.bate.width > game.width) {
            x = game.width - game.bate.width;
        }
        game.bate.x = x;
    });
    /*
     this.gameloop = setInterval(function() {
     game.updateAll();
     game.drawAll();
     }, 1000 / this.fps);
     */
    this.gameloop();

};


Object.defineProperty(Game.prototype, 'delay', {
    get: function() {
        return 1000 / this.fps;
    }
});

Game.prototype.pause = function(gameover) {
    //clearInterval(this.gameloop);
    cancelAnimationFrame(this.loop);
    this.paused = true;
};

Game.prototype.nextLevel = function() {
    this.pause();
    this.stage++;
    if (!this.levels[this.stage])
        this.win();
    else {
        this.renderLevel();
    }
    //this.inProgress = false;


};

Game.prototype.drawAll = function() {
    this.canvasUtil.clear();
    this.canvasUtil.fillBlack();

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].draw();
    }

    this.bate.draw();
    this.bricks.draw();
};

Game.prototype.updateAll = function() {
    //this.balls.forEach(Ball.prototype.update);
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].update();
    }
    ;
    this.bate.update();
    this.collisionResolver.watch(this.balls[0]);
    var score = document.getElementById('score'),
            level = document.getElementById('level'),
            lives = document.getElementById('lives');

    score.innerHTML = this.totalScore;
    level.innerHTML = this.stage;
    lives.innerHTML = this.lives;

};


function BricksCollection(game) {
    this.brickProportions = {
        height: 32,
        width: 64
    };
    this.scores = {
        '#00FFFF': 50,
        '#FFFFFF': 60,
        '#FFA500': 70,
        '#FFC0CB': 80,
        '#FFFF00': 90,
        '#008000': 100,
        '#0000FF': 110
    };
    this.shortNames = {
        'b': '#0000FF',
        'g': '#008000',
        'y': '#FFFF00',
        'p': '#FFC0CB',
        'o': '#FFA500',
        'w': '#FFFFFF',
        'a': '#00FFFF'/*
         's': 'silver',
         'u': 'unbreakable'*/
    };
    this.game = game;
    this.bricks = [];
    //this.cols = setup.cols;
    //this.length = setup.rows * setup.cols;
    var stage = this.game.levels[this.game.stage];
    var rows = stage.length;
    for (var r = 0; r < rows; r++) {
        this.bricks.push([]);
        var col = 0;
        stage[r].forEach(
                function(val) {
                    switch (val) {
                        case 'u':
                            this.bricks[r].push(new UnbreakableBrick(this.game, null, {
                                row: r,
                                col: col,
                                proportions: this.brickProportions
                            }, this));
                            break;
                        case 's':
                            this.bricks[r].push(new ToughBrick(this.game, null, {
                                row: r,
                                col: col,
                                proportions: this.brickProportions
                            }, this));
                            break;
                        case 0:
                            this.bricks[r].push(null);
                            break;
                        default:
                            this.bricks[r].push(new Brick(this.game, this.shortNames[val], {
                                row: r,
                                col: col,
                                proportions: this.brickProportions
                            }, this
                                    ));
                            break;
                    }
                    col++;
                }, this);
    }

    /*
     for (var i = 0; i < setup.rows; i++) {
     this.bricks.push([]);
     for (var k = 0; k < setup.cols; k++) {
     this.bricks[i][k] = new Brick(this.game, colors[i], {
     row: i,
     col: k,
     proportions: this.brickProportions
     }, this);
     }
     }
     */
}

BricksCollection.prototype.draw = function() {
    this.bricks.forEach(function(el, index, array) {
        if (Array.isArray(el)) {
            el.forEach(function(val) {
                if (val instanceof Brick) {
                    val.draw();
                }
            });
        }
    });
};
Object.defineProperty(BricksCollection.prototype, 'length', {
    get: function() {
        var i = 0;
        for (var row = 0; row < this.rows; row++) {
            this.bricks[row].forEach(function(val) {
                if (val instanceof Brick && !(val instanceof UnbreakableBrick)) {
                    i++;
                }
                ;
            });
        }
        return i;
    }
});
BricksCollection.prototype.add = function(brick) {
    if (brick instanceof Brick) {
        var row = brick.position.row, col = brick.position.col;
        this.bricks[row][col] = brick;
    } else
        return;
};
BricksCollection.prototype.remove = function(brick) {
    var row = brick.row, col = brick.col;
    this.bricks[row][col] = null;
    this.length--;
    if (this.length === 0) {
        this.game.nextLevel();
    }
};
BricksCollection.prototype.slice = function(obj) {
    var exist = [];
    for (var i = obj.rows[0]; i <= Math.min(obj.rows[1], this.bricks.length); i++) {
        for (var k = obj.cols[0]; k <= obj.cols[1]; k++) {
            if (Array.isArray(this.bricks[i])) {
                var brick = this.bricks[i][k];
                if (brick)
                    exist.push(brick);
            }
        }
    }


    return exist;
};
BricksCollection.prototype.above = function(brick) {
    var row = brick.row,
            col = brick.col;
    var above = row - 1;
    if (above < 0)
        return null;
    return this.bricks[above][col];
};
BricksCollection.prototype.below = function(brick) {
    var row = brick.row,
            col = brick.col;
    var below = row + 1;
    if (below > this.bricks.length - 1)
        return null;
    return this.bricks[below][col];
};
BricksCollection.prototype.nextInRow = function(brick) {
    var row = brick.row,
            col = brick.col;
    var next = col + 1;
    if (next > this.cols - 1)
        return null;
    return this.bricks[row][next];
};
BricksCollection.prototype.prevInRow = function(brick) {
    var row = brick.row,
            col = brick.col;
    var prev = col - 1;
    if (prev < 0)
        return null;
    return this.bricks[row][prev];
};

Object.defineProperty(BricksCollection.prototype, 'rows', {
    get: function() {
        return this.bricks.length;
    }
});

BricksCollection.prototype.getBrick = function(row, col) {
    // console.log(row);
    if (this.bricks[row]) {
        var brick = this.bricks[row][col];
    }
    return (brick) ? brick : null;
}
;

