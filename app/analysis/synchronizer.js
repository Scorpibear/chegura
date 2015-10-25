var fs = require('fs')
var queueSerializer = require('./queue-serializer')

module.exports.loadQueue = function(filename, defaultQueue) {
    try {
        var fileContent = fs.readFileSync(filename)
        return queueSerializer.parse(fileContent)
    } catch (err) {
        console.error("Could not load analysis queue: " + err)
        return defaultQueue;
    }
}

module.exports.saveQueue = function(filename, queue) {
    try {
        fs.writeFile(filename, queueSerializer.stringify(queue))
    } catch (err) {
        console.error("Could not save analysis queue: " + err)
    }
}