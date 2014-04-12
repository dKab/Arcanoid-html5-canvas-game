function CollisionResolver(game) {
    this.game = game;

}

CollisionResolver.prototype.conduct = function(ball) {
    var bricks = this.game.bricks;
    var height = this.game.brickProportions.height, width = this.game.brickProportions.width;

    var rowTop = Math.floor(ball.y / height), rowBot = Math.floor(ball.bottom / height),
            colLeft = Math.floor(ball.x / width),
            colRight = Math.floor(ball.right / width);

    var suspects = bricks.slice({
        rows: [rowTop, rowBot],
        cols: [colLeft, colRight]
    });
    if (suspects.length === 0) {
        return;
    }

    var i = 0;
    while (
            suspects[i] &&
            !this.detectBrickCollision(ball, suspects[i])
            && i < suspects.length) {
        i++;
    }

};

CollisionResolver.prototype.detectBrickCollision = function(ball, brick) {
    /*
     if ((ball.y <= brick.bottom) || (ball.bottom >= brick.y)) {
     ball.yVelocity = -ball.yVelocity;
     brick.collide(ball);
     return true;
     }
     else if (ball.right >= brick.x || ball.x <= brick.right) {
     ball.xVelocity = -ball.xVelocity;
     brick.collide(ball);
     return true;
     }
     return false;
     */

    if (ball.bottom >= brick.y && ball.x <= brick.right && ball.right >= brick.x && ball.yVelocity >0 && !brick.above) {
        console.log('top');
        ball.yVelocity = -ball.yVelocity;
        //ball.y -= brick.y-ball.bottom;
        //ball.y = Math.max(ball.x,0);
        ball.y = brick.y - ball.height;
        brick.collide(ball);
        return true;
    }
    if (ball.y <= brick.bottom && ball.bottom > brick.bottom && ball.x <= brick.right && ball.right >= brick.x && ball.yVelocity < 0 && !brick.below) {
        console.log('bot');
        ball.yVelocity = -ball.yVelocity;
        //ball.y = brick.bottom + (brick.bottom - ball.y);
        ball.y = brick.bottom;
        brick.collide(ball);
        return true;
    }
    if (ball.right >= brick.x && ball.y < brick.bottom && ball.xVelocity > 0 && !brick.prevInRow) {
        console.log('left');
        ball.xVelocity = -ball.xVelocity;
        //ball.x = brick.x - (ball.right - brick.x)
        ball.x = brick.x - ball.width;
        brick.collide(ball);
        return true;
    }

    if (ball.x <= brick.right &&  ball.y < brick.bottom && ball.xVelocity < 0 && !brick.nextInRow) {
        console.log('right');
        ball.xVelocity = -ball.xVelocity;
        //ball.x = brick.right + (brick.right - ball.right);
        ball.x = brick.right;
        brick.collide(ball);
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
