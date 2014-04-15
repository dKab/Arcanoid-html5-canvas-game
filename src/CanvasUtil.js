function CanvasUtil(canvas) {
   this.canvas = canvas;
   this.context = canvas.getContext('2d');
}

CanvasUtil.prototype.drawBrick = function(brick) {
    var tough = (brick instanceof ToughBrick);
    var ctx = this.context;
    var x = brick.x,
            y=brick.y,
            height=brick.height,
            width=brick.width;
    ctx.save();
    ctx.translate(brick.x, brick.y);
    ctx.fillStyle = brick.color;
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 4;

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
    ctx.beginPath();
    ctx.moveTo(width - 2, 0);
    ctx.lineTo(width - 2, height - 2);
    ctx.lineTo(0, height - 2);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.restore();

};

CanvasUtil.prototype.drawCircle = function(color, x, y, rad) {
    var ctx = this.context;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    //console.log(x);
    //console.log(y);
    //console.log(x);
    // console.log(y);
    var grad = ctx.createRadialGradient((x - 3), (y - 3), 0, x, y, rad);
    grad.addColorStop(0.150, 'rgba(255,255,255, 0.3)');
    grad.addColorStop(0.2, 'rgba(0,0,0,0.0)');
    grad.addColorStop(0.9, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fill();
};

CanvasUtil.prototype.drawBate = function(bate) {
    var ctx = this.context;
    //ctx.fillStyle = bate.color;
    ctx.beginPath();
    var grad = ctx.createLinearGradient(bate.x, bate.y, bate.x, bate.y + bate.height);
    grad.addColorStop(0, 'rgba(0,0,0,0.3)');
    grad.addColorStop(0.4, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
    ctx.fillStyle = bate.color;
    ctx.arc(bate.x + bate.height / 2, bate.y + bate.height / 2, bate.height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(bate.x + bate.width - bate.height / 2, bate.y);
    ctx.arc(bate.x + bate.width - bate.height / 2, bate.y + bate.height / 2, bate.height / 2,
            Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(bate.x + bate.height / 2, bate.y + bate.height);
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

};

CanvasUtil.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasUtil.prototype.fillBlack = function() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
};


