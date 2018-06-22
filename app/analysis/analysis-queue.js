// P0 - reserved for emergency requests
// P1 - external requests for new positions
// P2 - optimizations of not analyzed deep enough
// P3 - main line clarification
var emptyQueue = [[], [], [], []];
var priorities = emptyQueue.length;

var synchronizer = require('./synchronizer');
var filename = 'analysis-queue.json';

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;

  // compare lengths - can save a lot of time
  if (this.length !== array.length)
    return false;

  for (let i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    } else if (this[i] !== array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

var queue = synchronizer.loadQueue(filename, emptyQueue);

module.exports.save = function() {
  synchronizer.saveQueue(filename, queue);
};

module.exports.delete = itemToDelete => {
  let priority = 0;
  while (priority < priorities) {
    let index = queue[priority].findIndex(item => item.equals(itemToDelete));
    if (index !== -1) {
      queue[priority].splice(index, 1);
      this.save();
      break;
    }
    priority++;
  }
};

module.exports.getFirst = () => {
  let item = null;
  let priority = 0;
  while (!item && priority < priorities) {
    item = queue[priority++][0];
  }
  return item;
};

module.exports.push = function(item, priority) {
  if (!item) throw Error('Could not push to queue null item');
  if (priority > priorities) throw Error('Priority ' + priority + ' exceeds max ' + priorities);
  for (let q = 0; q < priorities; q++) {
    for (let i = 0; i < queue[q].length; i++) {
      if (queue[q][i].equals(item)) {
        return;
      }
    }
  }
  queue[priority].push(item);
  console.log(item + ' is added to p' + priority + ' queue');
  this.save();
  return this;
};

module.exports.empty = function() {
  for (let i = 0; i < priorities; i++) {
    queue[i] = [];
  }
  this.save();
};

module.exports.getQueue = function() {
  var result = [];
  for (let q = 0; q < priorities; q++) {
    for (let i = 0; i < queue[q].length; i++) {
      result.push(queue[q][i]);
    }
  }
  return result;
};
