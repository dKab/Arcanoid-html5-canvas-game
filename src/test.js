
    window.onready = function() {
    var arr = [];
    var body = document.body;
    for (var i = 0; i < 5; i++) {
        arr.push([]);
        for (var k = 0; k < 10; k++) {
            arr[i][k] = 'a';
        }
    }
    arr.forEach(function(el, index, array) {
        if (Array.isArray(el)) {
            el.forEach(function(val) {
                var span = document.createElement('span');
                var text = document.createTextNode(val);
                span.appendChild(text);
                body.appendChild(span);

            });
            var br = document.createElement('br');
            body.appendChild(br);
        }
        else console.log('nothing to output');
    });
    };