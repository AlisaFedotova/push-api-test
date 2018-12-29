var input = document.querySelector('input');

function show() {

}

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    // ...
});

var decorate = (n, offset, lights) => {
    var decoration, pos = [];

    decoration = Array(n + 1).join("~");

    for(var j = 0; j < lights; j++) pos.push(offset + j);

    var arr = decoration.split("");
    for(var j = 0; j < n; j++){
        if(pos.indexOf(j) > -1) arr[j] = "o";
    }
    decoration = arr.join("");

    return decoration;
};

var indent = (n) => {
    var indents = "";
    for(var i = 0; i < n; i++) indents += "&nbsp;";
    return indents;
};

var tree = (height, lights) => {
    var branch = "", decoPos = 1, offset = -lights;

    branch += indent(height - 1);
    branch += "@";
    branch += indent(height - 1);
    branch += "<br />";

    for(var i = 1; i <= height; i++){
        branch += indent(height - i, " ");
        branch += decorate(decoPos, offset, lights);
        branch += indent(height - i, " ");

        decoPos += 2;
        offset += 3;
        offset %= decoPos;
        branch += "<br />";
    }

    branch += indent(height - 1);
    branch += "#";
    branch += indent(height - 1);

    return branch;
}


var i = 1;
document.getElementById("tree").innerHTML = tree(20, i++);
setInterval(() => {
    document.getElementById("tree").innerHTML = tree(20, i);
    i %= 4;
    i++;
}, 2500);