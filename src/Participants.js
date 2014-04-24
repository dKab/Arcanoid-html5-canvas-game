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
                halfHeight = (this.radius) ? this.radius : this.height / 2;
        var cX = this.x + halfWidth,
                cY = this.y + halfHeight;
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
    this.normalSpeed = {
        x: 2,
        y: -7
    };
    this.color = 'red';
    this.radius = 7;
    this.speedToNormal();

    this.glued = null;
    //this.xVelocity = this.normalSpeed.x;
    this.power = 1;
    this.unstoppable = false;
    //this.yVelocity = this.normalSpeed.y;
    //this.x = this.game.canvas.width / 2 - this.radius;
    //this.y = (this.game.canvas.height - this.game.bate.height - this.radius * 2);
    //console.log(this.x);
    //console.log(this.y);
    this.width = this.height = this.radius * 2;
    this.game.collisionResolver.registerBall(this);
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
    if (this.glued) {
        var offset = this.glued;
        this.x = this.game.bate.x + offset;
    } else {

        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }
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
        this.x = this.game.width - (this.width + 1);
    }
    if (this.x <= 0) {
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


Ball.prototype.disrupt = function() {
    var left = new Ball(this.game);
       var right = new Ball(this.game);
    this.game.balls.push(left);
    left.placeAt(this.x-this.width-5, this.y);
    left.yVelocity = right.yVelocity = this.yVelocity;
    left.xVelocity = this.xVelocity-1;
    this.game.collisionResolver.registerBall(left);
 
    this.game.balls.push(right);
    right.placeAt(this.right + 5, this.y);
     right.xVelocity = this.xVelocity +1;
    this.game.collisionResolver.registerBall(right);
    
    console.log(this.game.balls);
};

Ball.prototype.speedToNormal = function() {
    this.xVelocity = this.normalSpeed.x;
    this.yVelocity = this.normalSpeed.y;
};

Ball.prototype.die = function() {
    this.game.balls.forEach(function(val, index) {
        if (val === this) {
            this.game.balls.splice(index, 1);
        }
    }, this);
    this.game.collisionResolver.unregisterBall(this);
    
    console.log(this.game.balls);
    
    if (this.game.balls.length == 1) {
        this.game.restore();
        console.log('restored');
    }

    if (this.game.balls.length === 0) {
        this.game.decrementLives();
    }

};

//Object.defineProperty(Ball.prototype, '')

function Bate() {
    GameItem.apply(this, arguments);
    this.color = 'lightgray';
    this.width = 70;
    this.height = 20;
    this.normalWidth = 70;
    //this.sticky = false;
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
    if (this.finalWidth && this.width < this.finalWidth) {
        this.width++;
        if (this.width % 2 !== 0) {
            this.x--;
        }
    } else {
        delete this.finalWidth;
    }
};

Bate.prototype.extend = function() {
    this.finalWidth = this.width * 2;
};

Bate.prototype.toNormalWidth = function() {
    this.width = this.normalWidth;
    this.finalWidth = null;
};


function StickyBate() {
    Bate.apply(this, arguments);
    this.sticky = true;
    this.color = 'YellowGreen';
    this.loaded = null;
}

StickyBate.prototype = Object.create(Bate.prototype);

StickyBate.prototype.launch = function(ball, launchSpeed) {
    if (!this.loaded) {
        return;
    }
    this.loaded.ball.yVelocity = this.loaded.launchSpeed.y;
    this.loaded.ball.xVelocity = this.loaded.launchSpeed.x;
    this.loaded.ball.glued = null;
    this.loaded = null;
};

StickyBate.prototype.constructor = StickyBate();


function ArmedBate() {
    Bate.apply(this, arguments);
    this.armed = true;
    this.lastFired = 0;
    this.coolDown = 500;
}

ArmedBate.prototype = Object.create(Bate.prototype);

ArmedBate.prototype.fire = function() {
    var now = new Date().getTime();
    if (now - this.lastFired < this.coolDown) {
        return;
    } else {
        var left = this.game.bullets.create();
        left.placeAt(this.x + 5, this.y + left.height);
        var right = this.game.bullets.create();
        right.placeAt(this.right - 5 - right.width, this.y + right.height);
        this.lastFired = new Date().getTime();
    }
};

ArmedBate.prototype.constructor = ArmedBate;

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
        this.startBlinking();
        return;
    }
    this.hp -= ball.power;
    if (this.hp <= 0) {
        this.die();
    } else {
        this.startBlinking();
    }
};

Brick.prototype.randomizePrize = function() {
    var length = this.game.prizePossibility.length;
    // console.log(length);
    var rand = Math.floor(Math.random() * (length - 0.0001));
    //  console.log(rand);
    return this.game.prizePossibility[rand];

};

Brick.prototype.die = function() {
    this.game.totalScore += this.score;
    
    var lucky = this.game.generatePrizes && this.randomizePrize();
    //console.log(lucky);
    if (lucky) {
        var prize = this.game.randomPrize();

        console.log(prize);
        prize.placeAt(this.center.x - prize.width / 2, this.center.y - prize.height / 2);
    }
    this.collection.remove(this);

};

Brick.prototype.startBlinking = function() {
    if (this.isBlinking) {
        return;
    }
    this.isBlinking = true;
    this.currX = 0;
    this.currY = 0;
    //this.startedBlinking = new Date().getTime();
    //this.game.CanvasUtil.blink(this);  
};

Brick.prototype.stopBlinking = function() {
    this.isBlinking = false;
    //delete this.startedBlinking;
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

function Bullet(game, bulletsCollection) {
    GameItem.apply(this, arguments);
    this.width = 6;
    this.height = 10;
    this.color = '#F5FFFA';
    this.dy = -10;
    this.power = 1;
    this.collection = bulletsCollection;
}

Bullet.prototype = Object.create(GameItem.prototype);

Bullet.prototype.draw = function() {
    this.game.canvasUtil.drawBullet(this);
};

Bullet.prototype.move = function() {
    this.y += this.dy;
};

Bullet.prototype.explode = function() {
    this.collection.remove(this);
};




Bullet.prototype.constructor = Bullet;

function BulletCollection(game) {
    this.game = game;
    this.bullets = [];
}

BulletCollection.prototype.draw = function() {
    this.bullets.forEach(function(val) {
        val.draw();
    });
};

BulletCollection.prototype.update = function() {
    this.bullets.forEach(function(val) {
        val.move();
    });
};

BulletCollection.prototype.remove = function(bullet) {
    this.bullets.forEach(function(val, index, array) {
        if (val === bullet) {
            array.splice(index, 1);
        }
    });
    this.game.collisionResolver.unregisterBullet(bullet);
};

BulletCollection.prototype.create = function() {
    var bullet = new Bullet(this.game, this);
    this.bullets.push(bullet);
    this.game.collisionResolver.registerBullet(bullet);
    return bullet;
};

BulletCollection.prototype.purge = function() {
    this.bullets = [];
};

BulletCollection.prototype.constructor = BulletCollection;

