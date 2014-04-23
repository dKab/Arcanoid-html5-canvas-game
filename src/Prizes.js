function Prize(game, collectionObject) {
    GameItem.apply(this, arguments);
    this.width = 28;
    this.height = 14;
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
        if (this.game.activePowerup != this.constructor) {
            this.activate();
        }
        this.die();
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
    this.game.restore();
    this.game.bate.extend();
    this.game.activePowerup = this.constructor;
};
ExtendPrize.prototype.deactivate = function() {
    this.bate.toNormalWidth();
    this.activePowerup = null;
};
ExtendPrize.prototype.constructor = ExtendPrize;
function GluePrize() {
    Prize.apply(this, arguments);
    this.color = 'YellowGreen';
    this.letter = 'G';
}

GluePrize.prototype = Object.create(Prize.prototype);
GluePrize.prototype.activate = function() {
    this.game.restore();
    var x = this.game.bate.x,
            y = this.game.bate.y;
    //console.log(this.game);
    this.game.bate = new StickyBate(this.game);
    this.game.bate.placeAt(x, y);
    console.log(this.game.bate);
    var listener = this.listener.bind(this.game);
    window.addEventListener('keypress', listener);
    this.game.listeners = listener;
    //this.game.bate = new St;
    this.game.activePowerup = this.constructor;
};
GluePrize.prototype.deactivate = function() {
    var x = this.bate.x,
            y = this.bate.y;
    this.bate = new Bate(this);
    this.bate.placeAt(x, y);
    this.activePowerup = null;
    window.removeEventListener('keypress', this.currentListener);
    this.currentListener = null;
};
GluePrize.prototype.listener = function(e) {
    if (e.keyCode != 32) {
        return;
    }
    return this.bate.sticky && this.bate.launch();
};
GluePrize.prototype.constructor = GluePrize;
function SlowPrize() {
    Prize.apply(this, arguments);
    this.color = 'DarkOrange';
    this.letter = 'S';
}
SlowPrize.prototype = Object.create(Prize.prototype);
SlowPrize.prototype.activate = function() {
    this.game.restore();
    this.game.balls.forEach(function(val) {
        val.xVelocity = val.xVelocity / 2;
        val.yVelocity = val.yVelocity / 2;
    });
    this.game.activePowerup = this.constructor;
};
SlowPrize.prototype.deactivate = function() {
    this.balls.forEach(function(val) {
        val.xVelocity = val.xVelocity * 2;
        val.yVelocity = val.yVelocity * 2;
    });
    this.activePowerup = null;
};
SlowPrize.prototype.constructor = SlowPrize;


function PlasmaGunPrize() {
    Prize.apply(this, arguments);
    this.color = 'red';
    this.letter='P';
}

PlasmaGunPrize.prototype = Object.create(Prize.prototype);

PlasmaGunPrize.prototype.activate = function() {
        this.game.restore();
    var x = this.game.bate.x,
            y = this.game.bate.y;
    //console.log(this.game);
    this.game.bate = new ArmedBate(this.game);
    this.game.bate.placeAt(x, y);
    //console.log(this.game.bate);
    var listener = this.listener.bind(this.game);
    window.addEventListener('keypress', listener);
    this.game.listeners = listener;
    //this.game.bate = new St;
    this.game.activePowerup = this.constructor;
};

PlasmaGunPrize.prototype.deactivate = GluePrize.prototype.deactivate;

PlasmaGunPrize.prototype.listener = function(e) {
        if (e.keyCode != 32) {
        return;
    }
    return this.bate.loaded && this.bate.fire();
};

PlasmaGunPrize.prototype.constructor = PlasmaGunPrize;



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

