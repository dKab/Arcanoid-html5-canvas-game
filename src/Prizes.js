function Prize() {
    GameItem.apply(this, arguments);
    this.width=24;
    this.height=12;       
}

Prize.prototype= Object.create(GameItem.prototype);

Prize.prototype.constructor = Prize;

Prize.prototype.draw = function() {
  this.game.canvasUtil.drawPrize();  
};

function ExtendPrize() {
    this.color = 'aquamarine';
    this.letter = 'E';
}

