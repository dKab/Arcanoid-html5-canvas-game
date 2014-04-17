function CollisionResolver(game) {
    this.game = game;

}

CollisionResolver.prototype.conduct = function(ball) {
    var bricks = this.game.bricks;
    var height = this.game.bricks.brickProportions.height, width = this.game.bricks.brickProportions.width;

    var rowTop = Math.floor(ball.y / height), rowBot = Math.floor(ball.bottom / height),
            colLeft = Math.floor(ball.x / width),
            colRight = Math.floor(ball.right / width);
/*
    var col = Math.floor(ball.center / width);
    var row = Math.floor(ball.y / height);
    var brick = bricks.getBrick(row, col);
    if (brick) {
        this.detectBrickCollision(ball, brick);
    }
    */
    
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

    if (ball.yVelocity > 0 && !brick.above && !brick.isUpper() && ball.bottom >= brick.y && ball.x <= brick.right && ball.right >= brick.x) {
        console.log('top ' + brick.color);
        ball.yVelocity = -ball.yVelocity;
        //ball.y -= brick.y-ball.bottom;
        //ball.y = Math.max(ball.x,0);
        ball.y = brick.y - ball.height;
        brick.collide(ball);
        return true;
    }
    if (ball.yVelocity < 0 && !brick.below && ball.y <= brick.bottom && ball.center <= brick.right && ball.center >= brick.x) {
        console.log('bot ' + brick.color);

        ball.yVelocity = -ball.yVelocity;
        //ball.y = brick.bottom + (brick.bottom - ball.y);
        ball.y = brick.bottom;
        brick.collide(ball);
        return true;
    }
    if (ball.xVelocity > 0 && !brick.prevInRow && /*!brick.isFirst() && */ball.right >= brick.x) {
        console.log('left ' + brick.color);
        ball.xVelocity = -ball.xVelocity;
        //ball.x = brick.x - (ball.right - brick.x)
        ball.x = brick.x - ball.width;
        brick.collide(ball);
        return true;
    }

    if (ball.xVelocity < 0 && !brick.nextInRow && /*!brick.isLast() &&*/ ball.x <= brick.right) {
        console.log('right ' + brick.color);
        ball.xVelocity = -ball.xVelocity;
        //ball.x = brick.right + (brick.right - ball.right);
        ball.x = brick.right;
        brick.collide(ball);
        return true;
    }
    return false;

};

CollisionResolver.prototype.watch = function(ball) {
    if (!ball) return;
    var bricksLevel = this.game.bricks.rows * this.game.bricks.brickProportions.height,
            bate = this.game.bate;
    if (ball.y <= bricksLevel) {
        this.conduct(ball);
    } else if (ball.bottom >= bate.y ) {
        this.handleBateCollision(ball, bate);
    }
};

CollisionResolver.prototype.reflectAtAngle = function(ball, deg) {
    var rad = deg / 180 * Math.PI;
    v = Math.sqrt(Math.pow(ball.xVelocity, 2) + Math.pow(ball.yVelocity, 2));
    ball.yVelocity = -Math.abs(v * Math.sin(rad));
    ball.y = this.game.bate.y - ball.height;
    ball.xVelocity = v * Math.cos(rad);
};

CollisionResolver.prototype.handleBateCollision = function(ball, bate) {
    var offset = ball.center - bate.x;
    if (offset < 0 || offset > bate.width)
        return;

    for (var i = 1; i < 6; i++) {
        if (offset < i * bate.width / 5)
            break;
    }
    switch (i) {
        case 1:
            this.reflectAtAngle(ball, 150);
            break;
        case 2:
            this.reflectAtAngle(ball, 120);
            break;
        case 3:
            ball.yVelocity = -ball.yVelocity;
            break;
        case 4:
            this.reflectAtAngle(ball, 60);
            break;
        case 5:
            this.reflectAtAngle(ball, 30);
            break;
        default:
            return;
    }

};

