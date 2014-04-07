function Game() {
	this.fps = 60;
	this.canvas = document.getElementById('game_field');
	this.canvas.width = this.canvas.height = 500;
	this.ctx = this.canvas.getContext('2d');
	this.bate = new Bate(this);
	this.ball = new Ball(this);

	this.bricks = new BricksCollection(this,{
		rows: 5,
		inRow: 10,
	});
}

Game.prototype.start = function() {
	var game = this;
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
	this.bricks.draw();
};

Game.prototype.updateAll = function() {
	this.ball.update();
	// this.bate.update();
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

function BricksCollection(game, setup) {
	var colors = ['blue', 'green', 'yellow', 'pink', 'orange'];
	this.game = game;
	this.bricks = [];
	for ( var i = 0; i < setup.rows; i++) {
		this.bricks.push([]);
		for ( var k = 0; k < setup.inRow; k++) {
			this.bricks[i][k] = new Brick(this.game, colors[i], {
				row : i,
				place : k
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
		var row = brick.position.row, place = brick.position.place;
		this.bricks[row][place] = brick;
	} else
		return;

};

BricksCollection.prototype.remove = function(brick) {
	var row = brick.position.row, place = brick.position.place;
	this.bricks[row][place] = null;
};
