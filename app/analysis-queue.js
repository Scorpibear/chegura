// P0 - reserved for emergency requests
// P1 - external requests for new positions
// P2 - optimizations of not analyzed deep enough
// P3 - main line clarification

var fs = require('fs')
var queueSerializer = require('./queue-serializer')
var filename = 'analysis-queue.json'

var save = function(queue) {
    try {
        fs.writeFile(filename, queueSerializer.stringify(queue))
    } catch (err) {
        console.error("Could not save analysis queue: " + err)
    }
}

var load = function() {
    try {
        var fileContent = fs.readFileSync(filename)
        return queueSerializer.parse(fileContent)
    } catch (err) {
        console.error("Could not load analysis queue: " + err)
        return emptyQueue;
    }
}

var priorities = 4;

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

var queue = load()

module.exports.getFirst = function () {
    var item = null;
    var priority = 0;
    while(!item && priority < priorities) {
        item = queue[priority++].shift();
    }
    if(!item) save(queue)
    return item;
}

module.exports.push = function(item, priority) {
    if(!item) throw Error('Could not push to queue null item')
    if(priority>priorities) throw Error('Priority ' + priority + ' exceeds max ' + priorities);
    for(var q=0; q<priorities; q++) {
        for(var i=0; i<queue[q].length; i++) {
            if(queue[q][i].equals(item)) {
                return;
            }
        }
    }
    queue[priority].push(item)
    console.log(item + ' is added to p' + priority + ' queue')
    save(queue)
}

module.exports.empty = function() {
    for(var i=0; i<priorities; i++) {
        queue[i] = []
    }
    save(queue)
}

module.exports.getQueue = function() {
    var result = [];
    for(var q=0; q<priorities; q++) {
        for(var i=0; i<queue[q].length; i++) {
            result.push(queue[q][i]);
        }
    }
    return result;
}