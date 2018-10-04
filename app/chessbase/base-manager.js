const bestmovedb = require('bestmovedb');
const fs = require('fs');
const baseSerializer = require('./base-serializer');
const baseOptimizer = require('./optimization/base-optimizer');
const baseIterator = require('./base-iterator');
const converter = require('../converter');

var base = {m: '', n: 0, c: 'b', t: 'wb'};
var filename = 'base.json';

module.exports.getFen = ({ fen, depth }) => {
  return bestmovedb.getFen({ fen, depth });
};

module.exports.saveBase = function() {
  fs.writeFile(filename, baseSerializer.stringify(base, true), err => {
    if (err) console.error(err);
  });
};

var createChildPositionObject = function(parentObject, childMove, isBest) {
  var n;
  var c;
  if (parentObject.c === 'w') {
    n = parentObject.n;
    c = 'b';
  } else {
    n = parentObject.n + 1;
    c = 'w';
  }
  var newChildObject = {m: childMove, n: n, c: c};
  if (!parentObject.s) {
    parentObject.s = [];
  }
  if (isBest) {
    parentObject.s.unshift(newChildObject);
  } else {
    parentObject.s.push(newChildObject);
  }
  return newChildObject;
};

var improveEvaluation = function(positionObject, evaluationObject) {
  if (!positionObject.e || (evaluationObject.d > positionObject.e.d)) {
    positionObject.e = evaluationObject;
  }
};

module.exports.addToBase = (moves, bestMove, score, depth) => {
  this.addToJsonBase(moves, bestMove, score, depth);
  const fen = converter.moves2fen(moves);
  bestmovedb.add({ fen, bestMove, score, depth });
};

module.exports.addToJsonBase = function(moves, bestAnswer, scoreValue, depth) {
  var evaluationObject = {v: scoreValue, d: depth};
  var positionObject = base;
  var parent;
  for (var i = 0; i < moves.length; i++) {
    parent = positionObject;
    positionObject = baseIterator.findSubPositionObject(parent, moves[i]);
    if (!positionObject) {
      positionObject = createChildPositionObject(parent, moves[i]);
    }
  }
  improveEvaluation(positionObject, evaluationObject);
  if (positionObject !== null) {
    parent = positionObject;
    var index;
    var subPositionObject = (function() {
      if (positionObject && positionObject.s) {
        let l = positionObject.s.length;
        for (index = 0; index < l; index++) {
          if (positionObject.s[index].m === bestAnswer) {
            return positionObject.s[index];
          }
        }
      }
      return null;
    })();
    if (subPositionObject) {
      positionObject.s.splice(index, 1);
      positionObject.s.unshift(subPositionObject);
    } else {
      subPositionObject = createChildPositionObject(parent, bestAnswer, true);
    }
    improveEvaluation(subPositionObject, evaluationObject);
    this.saveBase();
  }
};

module.exports.getBase = function() {
  return base;
};

module.exports.index = () => {
  console.log('base index start');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        converter.json2fenbase(base, bestmovedb);
      } catch (err) {
        reject(err);
      }
      console.log('base index finished');
      resolve();
    }, 0);
  }).catch(err => console.error(err));
};

module.exports.readBase = function() {
  try {
    let baseFileContent = fs.readFileSync(filename);
    base = baseSerializer.parse(baseFileContent);
  } catch (err) {
    console.error('Could not read ' + filename + ': ' + err);
  }
};

module.exports.getBaseAsString = function() {
  return baseSerializer.stringify(base);
};

module.exports.optimize = function({settings}) {
  return baseOptimizer.optimize({base, baseIterator, settings});
};
