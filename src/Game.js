function Game() {
	this.fps = 60;
	this.canvas = document.getElementById('game_field');
	this.canvas.width = this.canvas.height = 500;
	this.ctx = this.canvas.getContext('2d');
	this.inProgress = false;
	this.isOver = true;
	this.paused = false;
	this.brickProportions = {
		height : 20,
		width : 50
	};
	this.bate = new Bate(this);
	this.ball = new Ball(this);

	this.bricks = new BricksCollection(this, {
		rows : 5,
		cols : 10,
	}, this.brickProportions);
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
	this.ball.draw();
	this.bate.draw();
	this.bricks.draw();
};

Game.prototype.updateAll = function() {
	this.ball.update();
	this.bate.update();
};

Game.prototype.drawCircle = function(color, x, y, rad) {
	var ctx = this.ctx;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, rad, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
};

Game.prototype.drawRect = function(x, y, width, height, layout) {
	var ctx = this.ctx;
	ctx.fillStyle = layout.color;
	ctx.fillRect(x, y, width, height);
	if (layout.stroke) {
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.strokeRect(x, y, width, height);
	}
	if (!layout.rounded) {
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
		ctx.arc(x, y + height / 2, height / 2, Math.PI / 2, Math.PI * 3 / 2);
		ctx.lineTo(x + width, y);
		ctx.arc(x + width, y + height / 2, height / 2, Math.PI * 3 / 2,
				Math.PI / 2);
		ctx.lineTo(x, y + height);
		ctx.fill();
		ctx.fillStyle = grad;
		ctx.fill();
	}

};

Game.prototype.drawRoundedRect = function() {
	//
};

function BricksCollection(game, setup, brickProps) {
	var colors = [ 'blue', 'green', 'yellow', 'pink', 'orange', 'purple',
			'aqua' ];
	this.game = game;
	this.bricks = [];
	this.length = setup.rows * setup.cols;
	for ( var i = 0; i < setup.rows; i++) {
		this.bricks.push([]);
		for ( var k = 0; k < setup.cols; k++) {
			this.bricks[i][k] = new Brick(this.game, colors[i], {
				row : i,
				col : k,
				proportions : brickProps
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
	var row = brick.properties.row, col = brick.properties.col;
	this.bricks[row][col] = null;
	this.length--;
	if (this.length === 0) {
		this.game.stop();
	}
};

BricksCollection.prototype.__defineGetter__('rows', function() {
	return this.bricks.length;
});
BricksCollection.prototype.getBrick = function(row, col) {
	// console.log(row);
	var brick = this.bricks[row][col];
	return (brick) ? brick : null;

};
