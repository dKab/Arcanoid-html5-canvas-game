function CanvasUtil(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
}

CanvasUtil.prototype.drawBrick = function(brick) {
    var tough = (brick instanceof ToughBrick || brick instanceof UnbreakableBrick);
    var ctx = this.context;
    var x = brick.x,
            y = brick.y,
            height = brick.height,
            width = brick.width;
    ctx.save();
    ctx.translate(brick.x, brick.y);
    ctx.lineWidth = 4;
    ctx.fillStyle = brick.color;
    /*
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
*/

    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(width - 2, 0);
    ctx.lineTo(width - 2, height - 2);
    ctx.lineTo(0, height - 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
/*
    ctx.restore();
*/
    if (tough) {
        ctx.beginPath();
        ctx.moveTo(2, height - 8);

        ctx.lineTo(2, 2);
        ctx.lineTo(width - 8, 2);

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - 6, 0);
        ctx.lineTo(width - 6, height - 6);
        ctx.lineTo(0, height - 6);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();
    }

    ctx.restore();
    if (brick.isBlinking) {
        var stripWidth = Math.round(brick.width / 2.5);
        //var now = new Date().getTime(),
        //  phase = (now - brick.startedBlinking)/500;
        if (brick.currX - 2 * stripWidth > width - 4) {
            brick.stopBlinking();
        } else {
            brick.currX += 5;
            brick.currY += 5;

            var toX = this.calcDest(brick).toX,
                    toY = this.calcDest(brick).toY,
                    fromX = this.calcDest(brick).fromX,
                    fromY = this.calcDest(brick).fromY;
            this.drawStrip(brick, stripWidth, fromX, toX, fromY, toY);
        }
    }
};

CanvasUtil.prototype.drawBullet = function(bullet) {
    var ctx = this.context,
            x = bullet.x,
            y = bullet.y,
            width = bullet.width,
            height = bullet.height;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(width / 2, height - width / 2, width / 2, 0, Math.PI);
    ctx.lineTo(0, width / 2);
    ctx.arc(width / 2, width / 2, width / 2, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.restore();
};


CanvasUtil.prototype.drawStrip = function(brick, stripWidth, fromX, toX, fromY, toY) {
    var ctx = this.context,
            brickX = brick.x,
            brickY = brick.y,
            width = brick.width - 4,
            height = brick.height - 4;

    ctx.save();
    ctx.translate(brickX, brickY);
    ctx.beginPath();
    if (toX >= width) {
        ctx.moveTo(width, height);
    } else {
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
    }
    if (toX == 0) {
        ctx.lineTo(Math.max(toX - stripWidth, 0), Math.max(toY - stripWidth, 0));
    } else if (toX - stripWidth < 0) {
        ctx.lineTo(0, height);
        ctx.lineTo(0, height - (stripWidth - toX));
    } else {
        ctx.lineTo(Math.max(toX - stripWidth, 0), toY);
    }
    if (fromX == width && fromY < stripWidth) {
        ctx.lineTo(width - (stripWidth - fromY), 0);
        ctx.lineTo(width, 0);
    } else if (fromX == width && fromY >= stripWidth) {
        ctx.lineTo(fromX, fromY - stripWidth);
    } else {
        ctx.lineTo(Math.max(fromX - stripWidth, 0), fromY);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
    //console.log('1');
    ctx.restore();
};

CanvasUtil.prototype.calcDest = function(brick) {
    var x = brick.currX,
            y = brick.currY,
            width = brick.width - 4,
            height = brick.height - 4;

    var fromX = x,
            fromY = 0;
    if (fromX > width) {
        fromX = width;
        fromY = x - width;
    }

    var toX = 0;
    var toY = y;
    if (y > height) {
        toX = y - height;
        toY = height;
    }
    return {
        fromX: fromX,
        toX: toX,
        fromY: fromY,
        toY: toY
    };

};

CanvasUtil.prototype.drawCircle = function(color, x, y, rad) {
    var ctx = this.context;
    ctx.fillStyle = color;

    ctx.save();

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 25;

    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    //console.log(x);
    //console.log(y);
    //console.log(x);
    // console.log(y);
    var grad = ctx.createRadialGradient(-3, -3, 0, 0, 0, rad);
    grad.addColorStop(0.150, 'rgba(255,255,255, 0.3)');
    grad.addColorStop(0.2, 'rgba(0,0,0,0.0)');
    grad.addColorStop(0.9, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

};

CanvasUtil.prototype.drawPrize = function(prize) {
    var ctx = this.context;
    var x = prize.x,
            y = prize.y,
            width = prize.width,
            height = prize.height,
            color = prize.color;
    //ctx.fillStyle = bate.color;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.3)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.4, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
    ctx.fillStyle = color;
    ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(width - height / 2, 0);
    ctx.arc(width - height / 2, height / 2, height / 2,
            Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(height / 2, height);
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(prize.center.x, prize.center.y + 5);
    ctx.fillStyle = 'yellow';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.font = "bold 14pt Courier"
    ctx.textAlign = 'center';
    ctx.fillText(prize.letter, 0, 0, width);
    ctx.strokeStyle = 'black';
    // ctx.strokeText(prize.letter, 0,0, width);
    ctx.restore();
};

CanvasUtil.prototype.drawBate = function(bate) {
    var ctx = this.context;
    var width = bate.width,
            height = bate.height,
            x = bate.x,
            y = bate.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.4)');
    grad.addColorStop(0.3, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
    ctx.save();

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 25;

    ctx.beginPath();
    ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.closePath();
    ctx.fillStyle = 'orangered';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineTo(width - height / 2 - 10, 0);
    ctx.closePath();
    ctx.fillStyle = bate.color;
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width - height / 2 - 10, 0);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width - height / 2, height / 2, height / 2, Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineTo(width - height / 2 - 10, 0);
    ctx.closePath();
    ctx.fillStyle = 'orangered';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(height / 2, height / 2, height / 2, Math.PI * 2 / 3, Math.PI * 4 / 3);
    ctx.closePath();
    ctx.fillStyle = 'aqua';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - height / 2, height / 2, height / 2, -Math.PI / 3, Math.PI / 3);
    ctx.closePath();
    ctx.fillStyle = 'aqua';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();


    //ctx.translate(x, y);

    /*
     ctx.fillStyle = 'rgba(0,0,0,0.05)';
     ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
     Math.PI * 3 / 2);
     ctx.lineTo(width - height / 2, 0);
     ctx.arc(width - height / 2, height / 2, height / 2,
     Math.PI * 3 / 2, Math.PI / 2);
     ctx.lineTo(height / 2, height);
     ctx.fill();
     */



    ctx.restore();
};

CanvasUtil.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasUtil.prototype.fillBlack = function() {
    this.context.fillStyle = '#00004A';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};


CanvasUtil.prototype.message = function(message) {
    //this.clear();
    //this.fillBlack();
    var ctx = this.context;
    //ctx.save();
    //ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'pink';
    //ctx.lineWidth = 4;
    ctx.font = 'bold 30px impact';
    ctx.textAlign = 'center';
    //ctx.stroke();
    ctx.fillText(message, 250, this.canvas.height / 2 + 100, 500);
    ctx.strokeText(message, 250, this.canvas.height / 2 + 100, 500);
    //ctx.restore();
};


