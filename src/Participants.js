// GameItem - superclass 
function GameItem(game, color) {
    this.color = color || 'rgb(200, 200, 200)';
    this.game = game || null;
}
// superclass's methods
GameItem.prototype.update = function() {
    ///
};

GameItem.prototype.__defineGetter__("bottom", function() {
    var bot = this.y + this.height;
  return bot;
});

GameItem.prototype.__defineGetter__("right", function() {
   var right = this.x + this.width;
   return right;
});

// Ball - subclass
function Ball() {
    GameItem.apply(this, arguments); // call super constructor
    this.color= 'red';
    this.radius = 10;
    this.xVelocity = 3;
    this.yVelocity = -5;
    this.x = this.game.canvas.width/2 - this.radius;
    this.y = (this.game.canvas.height - this.game.bate.height - this.radius*2);
    console.log(this.y);
    console.log(this.game.canvas.height);
    this.draw = function() {
        this.game.drawCircle(this.color, this.x+this.radius, this.y+this.radius, this.radius);
    };
    this.width = this.height = this.radius * 2;
    
    this.move = function() {
        this.x += this.xVelocity;
        this.y +=this.yVelocity;
        if (this.bottom >= this.game.canvas.height) {
            this.game.stop();
        }
        if (this.right >= this.game.canvas.width || this.x <= 0) {
            this.xVelocity = - this.xVelocity;
        }
        if (this.bottom >= this.game.canvas.height || this.y <= 0) {
            this.yVelocity = - this.yVelocity;
        }
    };
    this.update = function() {
        this.move();
    };
}

function Bate() {
    GameItem.apply(this, arguments);
    this.color ='green';
    this.width = 60;
    this.height = 10;
    this.x = this.game.canvas.width/2 - this.width/2;
    this.y = this.game.canvas.height - this.height;
    this.draw = function() {
        this.game.drawRect(this.color, this.x, this.y, this.width, this.height);
    };
}

function Brick(gameObject, color, position) {
    GameItem.apply(this, arguments);
    this.hp = 1;
    this.width = 50;
    this.height = 20;
    this.x = position[1] * this.width;
    this.y = position[0] * this.height;
    this.draw = function() {
        this.game.drawRect(this.color, this.x, this.y, this.width, this.height, true);
    };
}

Ball.prototype = Bate.prototype = Brick.prototype = Object.create(GameItem.prototype);
Ball.prototype.constructor = Ball;
Bate.prototype.constructor = Bate;
Brick.prototype.constructor = Brick;