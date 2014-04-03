var Game = function() {
    this.fps = 60;
    this.canvas = document.getElementById('game_field');
    this.ctx = this.canvas.getContext('2d');
    
    this.ball = new Ball(this);
    this.bate = new Bate(this);
    
    
    var game = this;
    var gameloop = setInterval(function() {
        game.updateAll();
        game.drawAll();
    }, 1000 / this.fps);
    
    
    
};
/*
Game.prototype.init = function() {
    this.bricks=[];
    for (var i=0; i<4 ; i++) {
            for (var k=0; k<5; k++) {
                this.bricks[i].push
            }
    }
};
*/

Game.prototype.drawAll = function() {
    this.ball.update();
    this.bate.update();
};

Game.prototype.updateAll = function() {
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw();
    this.bate.draw();
};