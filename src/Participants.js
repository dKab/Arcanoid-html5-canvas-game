// GameItem - superclass 
function GameItem(game, color) {
	this.color = color || 'rgb(200, 200, 200)';
	this.game = game || null;
}
// superclass's methods
GameItem.prototype.update = function() {
	// /
};

Object.defineProperty(GameItem.prototype, "bottom", {
	get : function() {
		return this.y + this.height;
	}
});

Object.defineProperty(GameItem.prototype, "right", {
	get : function() {
		return this.x + this.width;
	}
});

Object.defineProperty(GameItem.prototype, "center", {
	get : function() {
		var half = (this.radius) ? this.radius : this.width / 2;
		return this.x + half;
	}
});

// Ball - subclass
function Ball() {
	GameItem.apply(this, arguments); // call super constructor
	this.color = 'red';
	this.radius = 7;
	this.xVelocity = 3;
	this.power = 1;
	this.unstoppable = false;
	this.yVelocity = -3;
	this.x = this.game.canvas.width / 2 - this.radius;
	this.y = (this.game.canvas.height - this.game.bate.height - this.radius * 2);
        //console.log(this.x);
        //console.log(this.y);
	this.width = this.height = this.radius * 2;

}

Ball.prototype = Object.create(GameItem.prototype);

Ball.prototype.update = function() {
	this.move();
};
Ball.prototype.draw = function() {
	this.game.drawCircle(this.color, this.x + this.radius,
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
	if (this.right >= this.game.canvas.width || this.x <= 0) {
		this.xVelocity = -this.xVelocity;
	}
	if (this.y <= 0) {
		this.yVelocity = -this.yVelocity;
	}
	if ((this.bottom >= this.game.bate.y) && (this.center > this.game.bate.x)
			&& (this.center < this.game.bate.right)) {
		this.yVelocity = -this.yVelocity;

		this.xVelocity = (this.center > this.game.bate.center) ? Math
				.abs(this.xVelocity) : -Math.abs(this.xVelocity);
	}
	if (this.bottom >= this.game.canvas.height) {
		this.game.pause('game over');
	}

};

function Bate() {
	GameItem.apply(this, arguments);
	this.color = '#99CC00';
	this.width = 80;
	this.height = 15;
	this.x = this.game.canvas.width / 2 - this.width / 2;
	this.y = this.game.canvas.height - this.height;

}
Bate.prototype = Object.create(GameItem.prototype);

Bate.prototype.draw = function() {
	var color = this.color;
	this.game.drawRect(this.x, this.y, this.width, this.height, {
		rounded : true,
		stroke: false,
		color: color
	});
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
	//this.properties = properties;
        this.row = properties.row;
        this.col = properties.col;
	this.width = properties.proportions.width;
	this.height = properties.proportions.height;
	this.x = this.col * this.width;
	this.y = this.row * this.height;

}
Brick.prototype = Object.create(GameItem.prototype);

Brick.prototype.draw = function() {
	var color = this.color;
	this.game.drawRect(this.x, this.y, this.width, this.height, {
		stroke: true,
		rounded: false,
		color: color
	});
};
Brick.prototype.collide = function(ball) {
	this.hp -= ball.power;
	if (this.hp <= 0) {
		this.die();
	}
	if (!ball.unstoppable) {
		// switch (colli)
	}
};
Brick.prototype.die = function() {
	this.collection.remove(this);
};

Object.defineProperty(Brick.prototype, "above", {
	get : function() {
		return this.collection.above(this);
	}
});
Object.defineProperty(Brick.prototype, "below", {
	get : function() {
		return this.collection.below(this);
	}
});
Object.defineProperty(Brick.prototype, "nextInRow", {
	get : function() {
		return this.collection.nextInRow(this);
	}
});
Object.defineProperty(Brick.prototype, "prevInRow", {
	get : function() {
		return this.collection.prevInRow(this);
	}
});

Ball.prototype.constructor = Ball;
Bate.prototype.constructor = Bate;
Brick.prototype.constructor = Brick;