
var gameItem = {
    get width() {
        return $(this).outerWidth();
    },
    get height() {
        return $(this).outerHeight();
    },
    get top() {
        return $(this).offset().top;
    },
    get left() {
        return $(this).offset().left;
    },
    get bottom() {
        return this.top + this.height;
    },
    get right() {
        return this.left + this.width;
    },
    /*
     * метод placeAt выставляет элемент в позицию так,
     *  что его левый верхний угол принимает координаты x,y
     */
    placeAt: function(x,y) {
        $(this).offset({
            top: y,
            left: x
        });
    }
};
/*
 * 
 */
function Ball() {
    /*
     * устанавливаем свойства и методы шарика
     */
}
function Bat() {
 /*
  * методы и свойства биты
  */   
}
function Brick() {
 /*
  * методы и свойства кирпичей
  */   
}

Ball.prototype = Bat.prototype = Brick.prototype = gameItem; 
//в таком присваивании правда может быть побочный эффект: 
//bat instanceof brick будет равно true, потому что у них общий прототип
//поэтому возможно нужно указывать прототипом для двух из этих трех конструкторов клоны объекта gameItem, а не сам gameItem
//это описывается здесь http://learn.javascript.ru/task/strannoe-povedenie-instanceof
