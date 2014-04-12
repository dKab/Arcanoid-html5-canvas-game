function Game() {
    this.fps = 60;
    this.canvas = document.getElementById('game_field');
    this.canvas.width = this.canvas.height = 500;
    this.ctx = this.canvas.getContext('2d');
    this.inProgress = false;
    this.isOver = true;
    this.paused = false;
    this.brickProportions = {
        height: 30,
        width: 50
    };
    this.bate = new Bate(this);
    this.balls = [];
    this.balls.push(new Ball(this));

    this.bricks = new BricksCollection(this, {
        rows: 5,
        cols: 10
    }, this.brickProportions);

    this.collisionResolver = new CollisionResolver(this);
}

Game.prototype.start = function() {
    var game = this;
    game.inProgress = true;
    this.isOver = false;

    document.addEventListener('mousemove', function(e) {
        var offset = game.canvas.getBoundingClientRect().left;
        // var min = Math.min(((e.clientX-offset) - this.bate.width/2), 0);
        var x = (e.clientX - offset) - game.bate.width / 2;
        if (x < 0) {
            x = 0;
        } else if (x + game.bate.width > game.canvas.width) {
            x = game.canvas.width - game.bate.width;
        }
        game.bate.x = x;
    });

    this.gameloop = setInterval(function() {
        game.updateAll();
        game.drawAll();
    }, 1000 / this.fps);
};

Game.prototype.pause = function(gameover) {
    gameover = gameover || null;
    clearInterval(this.gameloop);
    this.inProgress = false;
    this.isOver = !!(gameover);
    if (gameover)
        console.log(gameover);
};

Game.prototype.drawAll = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
};

Game.prototype.drawCircle = function(color, x, y, rad) {
    var ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    //console.log(x);
    //console.log(y);

    var grad = ctx.createRadialGradient((x - 3), (y - 3), 0, x, y, rad);
    grad.addColorStop(0.150, 'rgba(255,255,255, 0.3)');
    grad.addColorStop(0.2, 'rgba(0,0,0,0.0)');
    grad.addColorStop(0.9, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fill();
};

Game.prototype.drawRect = function(x, y, width, height, layout) {
    var ctx = this.ctx;
    ctx.fillStyle = layout.color;

    if (!layout.rounded) {
        ctx.fillRect(x, y, width, height);
        var shadow = ctx.createLinearGradient(x, y, x, y + height);
        shadow.addColorStop(0, 'rgba(0,0,0,0.3)');
        shadow.addColorStop(0.4, 'rgba(0,0,0, 0.0)');
        shadow.addColorStop(1, 'rgba(0,0,0, 0.5)');
        ctx.fillStyle = shadow;
        ctx.fillRect(x, y, width, height);
    } else {
        // var shadow = ctx.createRadialGradient(x+width/2, y+height/2, )
        ctx.beginPath();
        var grad = ctx.createLinearGradient(x, y, x, y + height);
        grad.addColorStop(0, 'rgba(0,0,0,0.3)');
        grad.addColorStop(0.4, 'rgba(0,0,0, 0.0)');
        grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
        ctx.fillStyle = layout.color;
        ctx.arc(x + height / 2, y + height / 2, height / 2, Math.PI / 2,
                Math.PI * 3 / 2);
        ctx.lineTo(x + width - height / 2, y);
        ctx.arc(x + width - height / 2, y + height / 2, height / 2,
                Math.PI * 3 / 2, Math.PI / 2);
        ctx.lineTo(x + height / 2, y + height);
        ctx.fill();
        ctx.fillStyle = grad;
        ctx.fill();
    }
    if (layout.stroke) {
        ctx.strokeStyle = 'rgba(0,0,0, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width - 1, height - 1);
    }

};

Game.prototype.drawRoundedRect = function() {
    //
};

function BricksCollection(game, setup, brickProps) {
    var colors = ['blue', 'green', 'yellow', 'pink', 'orange', 'purple',
        'aqua'];
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
                proportions: brickProps
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
        this.game.stop();
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
    var next = col+1;
    if (next > this.cols-1) return null;
    return this.bricks[row][next];
};

BricksCollection.prototype.prevInRow = function(brick) {
    var row = brick.row,
            col = brick.col;
    var prev = col- 1;
    if (prev<0) return null;
    return this.bricks[row][prev];
};

BricksCollection.prototype.__defineGetter__('rows', function() {
    return this.bricks.length;
});
BricksCollection.prototype.getBrick = function(row, col) {
    // console.log(row);
    var brick = this.bricks[row][col];
    return (brick) ? brick : null;

};

