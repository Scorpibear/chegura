// P0 - reserved for emergency requests
// P1 - external requests for new positions
// P2 - optimizations of not analyzed deep enough
// P3 - main line clarification

var priorities = 4;

var queue = [[], [], [], []]

module.exports.getFirst = function () {
    var item = null;
    var priority = 0;
    while(!item && priority < priorities) {
        item = queue[priority++].shift();
    }
    return item;
}

module.exports.push = function(item, priority) {
    if(!item) throw Error('Could not push to queue null item')
    if(priority>priorities) throw Error('Priority ' + priority + ' exceeds max ' + priorities);
    for(var q=0; q<priorities; q++) {
        for(var i=0; i<queue[q].length; i++) {
            if(queue[q][i] === item) {
                return;
            }
        }
    }
    queue[priority].push(item)
    console.log(item + ' is added to p' + priority + ' queue')
}

module.exports.empty = function() {
    for(var i=0; i<priorities; i++) {
        queue[i] = []
    }
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