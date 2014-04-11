function CollisionResolver(game) {
    this.game = game;

}

CollisionResolver.prototype.conduct = function(ball) {
    var bricks = this.game.bricks;
    var height = this.game.brickProportions.height, width = this.game.brickProportions.width;

    var rowTop = floor(ball.y / height), rowBot = floor(ball.bottom / height),
            colLeft = floor(ball.x / width),
            colRight = floor(ball.right / width);

    var suspects = bricks.slice({
        rows: [rowTop, rowBot],
        cols: [colLeft, colRight]
    });

    var i = 0;
    while (!this.detectBrickCollision(ball, suspects[i]) && i < suspects.length) {
        i++;
    }

};

CollisionResolver.prototype.detectBrickCollision = function(ball, brick) {
    if ((ball.y <= brick.bottom) || (ball.bottom <= brick.y)) {
        ball.yVelocity = -ball.yVelocity;
        brick.collide();
        return true;
    }
    else if (ball.right >= brick.x || ball.x <= brick.right) {
        ball.xVelocity = -ball.xVelocity;
        brick.collide();
        return true;
    }
    return false;
};

CollisionResolver.prototype.watch = function(ball) {
    var bricksLevel = this.game.bricks.rows * this.game.brickProportions.height;
    if (ball.y <= bricksLevel) {
        this.conduct(ball);
    }
};

CollisionResolver.prototype.handleBateCollision = function() {
    //
};
