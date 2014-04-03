// GameItem - superclass 
function GameItem(game, color) {
    this.color = color || '#fff';
    this.game = game || null;
}
// superclass's methods
GameItem.prototype.update = function() {
    ///
};

// Ball - subclass
function Ball() {
    GameItem.apply(this, arguments); // call super constructor
    this.radius = 5;
    this.draw = function() {
        this.game.drawCircle(this.color, this.x, this.y, this.radius, 0, 2 * Math.PI);
    };
}

function Bate() {
    GameItem.apply(this, arguments);
    this.width = 60;
    this.height = 10;
    this.x = 120;
    this.y = this.game.canvas.height - this.height;
    this.draw = function() {
        this.game.drawRect(this.color, this.x, this.y, this.width, this.height);
    };
}

function Brick() {
    GameItem.apply(this, arguments);
    this.width = 50;
    this.height = 20;
    this.draw = function() {
        this.game.drawRect(this.color, this.x, this.y, this.width, this.height);
    };
}

Ball.prototype = Bate.prototype = Brick.prototype = Object.create(GameItem.prototype);
Ball.prototype.constructor = Ball;
Bate.prototype.constructor = Bate;
Brick.prototype.constructor = Brick;