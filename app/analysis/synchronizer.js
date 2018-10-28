var fs = require('fs');
var queueSerializer = require('./queue-serializer');

/**
 * loads queue from file
 * @param {string} filename - filename with json where queue is stored
 * @param {object} defaultQueue - json object with default queue to be used if file could not be read
 * @return {object} loaded queue
 */
exports.loadQueue = function(filename, defaultQueue) {
  try {
    var fileContent = fs.readFileSync(filename);
    return queueSerializer.parse(fileContent);
  } catch (err) {
    console.error('Could not load analysis queue: ' + err);
    return defaultQueue;
  }
};

/**
 * Saves a queue into file asynchronously
 * @param {string} filename - filename to save a queue
 * @param {object} queue - queue to save
 */
exports.saveQueue = function(filename, queue) {
  try {
    fs.writeFileSync(filename, queueSerializer.stringify(queue));
  } catch (err) {
    console.error('Could not save analysis queue: ' + err);
  }
};
