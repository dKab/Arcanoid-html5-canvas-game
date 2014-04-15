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
    this.totalScore = 0;
    this.inProgress = false;
    this.lastRender = 0;
    this.paused = false;

    var bate = new Bate(this);
    bate.placeAt(256 - bate.width / 2, 400);
    this.bate = bate;
    this.balls = [];
    var ball = new Ball(this);
    ball.placeAt(256 - ball.radius, 400 - ball.height);
    this.balls.push(ball);

    this.bricks = new BricksCollection(this, {
        rows: 5,
        cols: 8
    }, this.brickProportions);

    this.collisionResolver = new CollisionResolver(this);


}

Game.prototype.gameloop = function() {

    var current = new Date().getTime(),
            delta = current - this.lastRender;

    if (delta >= this.delay) {
        //console.log('hi');
        this.updateAll();
        this.drawAll();
        this.lastRender = new Date().getTime();
    }
    //var game = this;
    //console.log(this);
    this.loop = requestAnimationFrame(Game.prototype.gameloop.bind(this));
};

Game.prototype.start = function() {
    var game = this;
    game.inProgress = true;
    this.isOver = false;

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
    gameover = gameover || null;
    //clearInterval(this.gameloop);
    cancelAnimationFrame(this.loop);
    console.log('paused');
    this.inProgress = false;
    this.isOver = !!(gameover);
    if (gameover)
        console.log(gameover);
    this.loop = null;
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
            stage = document.getElementById('stage');

    score.innerHTML = this.totalScore;
    stage.innerHTML = this.stage;

};


function BricksCollection(game, setup) {
    var colors = ['blue', 'green', 'yellow', 'pink', 'orange', 'purple',
        'aqua'];

    this.brickProportions = {
        height: 32,
        width: 64
    };
    this.scores = {
        'aqua': 50,
        'purple': 60,
        'orange': 70,
        'pink': 80,
        'yellow': 90,
        'green': 100,
        'blue': 110
    };
    this.game = game;
    this.bricks = [];
    this.cols = setup.cols;
    this.length = setup.rows * setup.cols;
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
        this.game.pause();
    }
};

BricksCollection.prototype.slice = function(obj) {
    var exist = [];

    for (var i = obj.rows[0]; i < Math.min(obj.rows[1], this.bricks.length); i++) {
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


BricksCollection.prototype.__defineGetter__('rows', function() {
    return this.bricks.length;
});
BricksCollection.prototype.getBrick = function(row, col) {
    // console.log(row);
    if (this.bricks[row]) {
        var brick = this.bricks[row][col];
    }
    return (brick) ? brick : null;

};

