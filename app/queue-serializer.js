var fs = require('fs')

var filename = 'analysis-queue.json'

module.exports.save = function(queue) {
    fs.writeFile(filename, JSON.stringify({q: queue}))
}

module.exports.load = function() {
    var emptyQueue = [[],[],[],[]]
    var loadedQueue = emptyQueue;
    try {
        var fileContent = fs.readFileSync(filename)
        var jsonQueue = JSON.parse(fileContent)
        if(jsonQueue.q && jsonQueue.q.length && jsonQueue.q.length == 4) {
            loadedQueue = jsonQueue.q
        }
    } catch (e) {
        loadedQueue = emptyQueue;
    }
    return loadedQueue;
}