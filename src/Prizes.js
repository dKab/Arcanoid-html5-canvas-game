function Prize(game, collectionObject) {
    GameItem.apply(this, arguments);
    this.width = 24;
    this.height = 12;
    this.dy = 4;
    this.collection = collectionObject;
}

Prize.prototype = Object.create(GameItem.prototype);


Prize.prototype.draw = function() {
    this.game.canvasUtil.drawPrize(this);
};

Prize.prototype.move = function() {
    this.y += this.dy;
    if (this.bottom >= this.game.bate.y &&
            this.y <= this.game.bate.bottom &&
            this.right > this.game.bate.x && this.x < this.game.bate.right) {
        this.activate();
    }
    if (this.y > this.game.height) {
        this.die();
    }
};

Prize.prototype.die = function() {
    this.collection.remove(this);
};

Prize.prototype.constructor = Prize;

function ExtendPrize() {
    Prize.apply(this, arguments);
    this.color = 'aquamarine';
    this.letter = 'E';
}

ExtendPrize.prototype = Object.create(Prize.prototype);


ExtendPrize.prototype.activate = function() {
    if (this.game.activeFeature == this.constructor) {
        return;
    }
    this.game.restore();
    this.game.bate.extend();
    this.game.activeFeature = this.constructor;
    this.die();
};

ExtendPrize.prototype.deactivate = function() {
    this.bate.toNormalWidth();
    this.activeFeature = null;
};

ExtendPrize.prototype.constructor = ExtendPrize;

function PrizeCollection() {
    this.prizes = [];
}

PrizeCollection.prototype.add = function(prize) {
    this.prizes.push(prize);
};

PrizeCollection.prototype.remove = function(prize) {
    this.prizes.forEach(function(val, index, array) {
        if (val === prize) {
            array.splice(index, 1);
        }
    });
};

PrizeCollection.prototype.draw = function() {
    this.prizes.forEach(function(val) {
        val.draw();
    });
};

PrizeCollection.prototype.update = function() {
    this.prizes.forEach(function(val) {
        val.move();
    });
};

PrizeCollection.prototype.purge = function() {
    this.prizes = [];
};

