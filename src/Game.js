function Game() {
    this.fps = 60;
    this.canvas = document.getElementById('game_field');
    this.canvas.width = this.canvas.height=500;
    this.ctx = this.canvas.getContext('2d');
    this.bate = new Bate(this);
    this.ball = new Ball(this);
    
    this.bricks = [];
    for (var i=0; i<5; i++) {
        for (var k=0; k<10; k++) {
            this.bricks[i][k] = new Brick(this, null, [i,k]);
        }
    }
    
}

Game.prototype.start = function() {
    var game= this;
    this.gameloop = setInterval(function() {
        game.updateAll();
        game.drawAll();
    }, 1000 / this.fps);
};

Game.prototype.stop = function() {
    clearInterval(this.gameloop);
};

Game.prototype.drawAll = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw();
    this.bate.draw();
};

Game.prototype.updateAll = function() {
    this.ball.update();
    //this.bate.update();
};

Game.prototype.drawCircle = function(color, x, y, rad) {
    var ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
};

Game.prototype.drawRect = function(color, x, y, width, height, stroke) {
    var stroke = stroke || false;
    var ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    if (stroke) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }
};
