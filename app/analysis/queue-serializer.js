module.exports.stringify = function(queue) {
    return JSON.stringify({q: [queue[0],queue[1],[],[]]})
}

module.exports.parse = function(str) {
    var emptyQueue = [[],[],[],[]]
    var loadedQueue = emptyQueue;
    try {
        var jsonQueue = JSON.parse(str)
        if(jsonQueue.q && jsonQueue.q.length && jsonQueue.q.length > 1) {
            loadedQueue[0] = jsonQueue.q[0]
            loadedQueue[1] = jsonQueue.q[1]
        }
    } catch (e) {
        loadedQueue = emptyQueue;
    }
    return loadedQueue;
}
