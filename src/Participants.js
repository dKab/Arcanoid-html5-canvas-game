// GameItem - superclass 
function GameItem(game, color) {
    this.color = color || 'rgb(200, 200, 200)';
    this.game = game || null;
}
// superclass's methods
GameItem.prototype.update = function() {
    // /
};

GameItem.prototype.placeAt = function(x, y) {
    this.x = x;
    this.y = y;
};

Object.defineProperty(GameItem.prototype, "bottom", {
    get: function() {
        return this.y + this.height;
    }
});

Object.defineProperty(GameItem.prototype, "right", {
    get: function() {
        return this.x + this.width;
    }
});

Object.defineProperty(GameItem.prototype, "center", {
    get: function() {
        var halfWidth = (this.radius) ? this.radius : this.width / 2,
      halfHeight = (this.radius) ? this.radius : this.height/2;
        var cX= this.x+halfWidth,
                cY = this.y+halfHeight;
        var center = {
            'x': cX,
            'y': cY
        };
        return center;
    }
});

// Ball - subclass
function Ball() {
    GameItem.apply(this, arguments);
    this.color = 'red';
    this.radius = 7;
    this.xVelocity = 2;
    this.power = 1;
    this.unstoppable = false;
    this.yVelocity = -7;
    //this.x = this.game.canvas.width / 2 - this.radius;
    //this.y = (this.game.canvas.height - this.game.bate.height - this.radius * 2);
    //console.log(this.x);
    //console.log(this.y);
    this.width = this.height = this.radius * 2;

}

Ball.prototype = Object.create(GameItem.prototype);

Ball.prototype.update = function() {
    this.move();
};
Ball.prototype.draw = function() {
    this.game.canvasUtil.drawCircle(this.color, this.x + this.radius,
            this.y + this.radius, this.radius);
};
Ball.prototype.move = function() {

    //var bricksLevel = this.game.bricks.rows * this.game.brickProportions.height;

    this.x += this.xVelocity;
    this.y += this.yVelocity;
    /*
     if (this.y < bricksLevel && this.y > 0) {
     var row = Math.floor(this.y / this.game.brickProportions.height), col = Math
     .floor(this.center / this.game.brickProportions.width);
     if (brick = this.game.bricks.getBrick(row, col)) {
     brick.collide(this);
     this.yVelocity = -this.yVelocity;
     }
     }
     */
    //console.log(Math.atan2(this.yVelocity, this.xVelocity) * 180/Math.PI);
    if (this.y <= 0) {
        this.yVelocity = -this.yVelocity;
    }
    
    
    if (this.right >= this.game.width) {
        this.xVelocity = -this.xVelocity;
        this.x = this.game.width - (this.width+1);
    }
    if (this.x<= 0) {
        this.xVelocity = -this.xVelocity;
        this.x = 1;
    }
    /*
     if ((this.bottom >= this.game.bate.y) && (this.center > this.game.bate.x)
     && (this.center < this.game.bate.right)) {
     this.yVelocity = -this.yVelocity;
     
     this.xVelocity = (this.center > this.game.bate.center) ? Math
     .abs(this.xVelocity) : -Math.abs(this.xVelocity);
     }
     */
    if (this.y >= this.game.height) {
        //this.game.over();
        this.die();
    }

};

Ball.prototype.die = function() {
    this.game.balls.forEach(function(val, index) {
        if (val === this) {
            this.game.balls.splice(index, 1);
        }
    }, this);

    if (this.game.balls.length === 0) {
        this.game.decrementLives();
    }

};

//Object.defineProperty(Ball.prototype, '')

function Bate() {
    GameItem.apply(this, arguments);
    this.color = '#99CC00';
    this.width = 100;
    this.height = 20;
    // this.x = this.game.canvas.width / 2 - this.width / 2;
    //  this.y = this.game.canvas.height - this.height;

}
Bate.prototype = Object.create(GameItem.prototype);



Bate.prototype.draw = function() {
    var color = this.color;
    this.game.canvasUtil.drawBate(this);
};
Bate.prototype.collide = function(ball) {
    ball.yVelocity = -ball.yVelocity;
};
Bate.prototype.update = function() {
    //
};

function Brick(gameObject, color, properties, collectionObject) {
    GameItem.apply(this, arguments);
    this.color = color || 'gray';
    this.hp = 1;
    this.collection = collectionObject;
    /*
     var score = this.collection.scores[this.color];
     if (score !== undefined) {
     this.score = score;
     }
     */
    //this.properties = properties;
    this.row = properties.row;
    this.col = properties.col;
    this.width = properties.proportions.width;
    this.height = properties.proportions.height;
    this.x = this.col * this.width;
    this.y = this.row * this.height;

}
Brick.prototype = Object.create(GameItem.prototype);

Object.defineProperty(Brick.prototype, 'score', {
    get: function() {

        return (this instanceof ToughBrick) ? this.game.stage * 50 : this.collection.scores[this.color];
    }
});

Brick.prototype.draw = function() {
    var color = this.color;
    this.game.canvasUtil.drawBrick(this);
};
Brick.prototype.collide = function(ball) {
    if (this.unbreakable) {
        return;
    }
    this.hp -= ball.power;
    if (this.hp <= 0) {
        this.die();
    }

};
Brick.prototype.die = function() {
    this.collection.remove(this);
    this.game.totalScore += this.score;
};

Brick.prototype.isLast = function() {
    return !!(this.col === this.collection.cols - 1);
};

Brick.prototype.isUpper = function() {
    return !!(this.row === 0);
};

Brick.prototype.isFirst = function() {
    return (this.col === 0);
};

Object.defineProperty(Brick.prototype, "above", {
    get: function() {
        return this.collection.above(this);
    }
});

Object.defineProperty(Brick.prototype, "below", {
    get: function() {
        return this.collection.below(this);
    }
});
Object.defineProperty(Brick.prototype, "nextInRow", {
    get: function() {
        return this.collection.nextInRow(this);
    }
});
Object.defineProperty(Brick.prototype, "prevInRow", {
    get: function() {
        return this.collection.prevInRow(this);
    }
});

Ball.prototype.constructor = Ball;
Bate.prototype.constructor = Bate;
Brick.prototype.constructor = Brick;

function ToughBrick() {
    Brick.apply(this, arguments);
    this.color = '#B8B8B8';
    this.hp = 2;
}

Object.defineProperty(ToughBrick.prototype, "score", {
    get: function() {
        return this.game.stage * 50;
    }
});

ToughBrick.prototype = Object.create(Brick.prototype);

ToughBrick.prototype.draw = function() {
    this.game.canvasUtil.drawBrick(this);
};

ToughBrick.prototype.constructor = ToughBrick;

function UnbreakableBrick() {
    Brick.apply(this, arguments);
    this.color = "#CC9900";
    this.unbreakable = true;
}

UnbreakableBrick.prototype = Object.create(Brick.prototype);

UnbreakableBrick.prototype.constructor = UnbreakableBrick;


