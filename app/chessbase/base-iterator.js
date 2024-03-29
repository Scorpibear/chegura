'use strict';

var pgnAnalyzer = require('../analysis/pgn-analyzer');

var addMoves = function (result, moves, parentObject, requiredDepth, objectsToLookDeeper, base) {
  if (parentObject.s) {
    parentObject.s.forEach(function (childObject) {
      var movesWithChild = moves.slice();
      movesWithChild.push(childObject.m);
      if (((!childObject.e && childObject.s && childObject.s.length) || (childObject.e && childObject.e.d < requiredDepth)) && (pgnAnalyzer.isOptimal(movesWithChild, base))) {
        result.push(movesWithChild);
      } else {
        objectsToLookDeeper.push({ positionObject: childObject, moves: movesWithChild });
      }
    });
  }
};

module.exports.getMovesToInsufficientEvaluationDepth = function (base, requiredDepth) {
  const result = [];
  const moves = [];
  if(base.e && base.e.d < requiredDepth) {
    result.push(moves);
  }
  let objectsToLookDeeper = [];
  addMoves(result, moves, base, requiredDepth, objectsToLookDeeper, base);
  while (objectsToLookDeeper.length > 0) {
    const nextLevelOfObjects = [];
    objectsToLookDeeper.forEach(function (objectData) {
      addMoves(result, objectData.moves, objectData.positionObject, requiredDepth, nextLevelOfObjects, base);
    });
    objectsToLookDeeper = nextLevelOfObjects;
  }
  return result;
};

module.exports.findSubPositionObject = function (positionObject, move) {
  if (positionObject && positionObject.s) {
    for (var i = 0, l = positionObject.s.length; i < l; i++) {
      if (positionObject.s[i].m == move) {
        return positionObject.s[i];
      }
    }
  }
  return null;
};

module.exports.findLatestMainLine = function(base) {
  var result = [];
  var positionObject = base;
  if(positionObject.s && positionObject.s.length>0) {
    positionObject = positionObject.s[0];
  }
  while(positionObject && positionObject.m) {
    result.push(positionObject.m);
    if(positionObject.s && positionObject.s.length>0) {
      positionObject = positionObject.s[0];
    } else {
      break;
    }
  }
  return result;
};

module.exports.findMinDepthMainLinePath = function(base) {
  let currentPath = [];
  let candidatePath = currentPath.slice();
  let positionObject = base;
  let minDepth = positionObject.e.d;
  while(positionObject && positionObject.s && positionObject.s.length) {
    positionObject = positionObject.s[0];
    if(positionObject && positionObject.m) {
      currentPath.push(positionObject.m);
      if(!pgnAnalyzer.areMovesWithinLimit(currentPath)) break;
      if(Object.prototype.hasOwnProperty.call(positionObject, 'e') && Object.prototype.hasOwnProperty.call(positionObject.e, 'd') && positionObject.e.d < minDepth) {
        minDepth = positionObject.e.d;
        // copy array via slice(), ordinary '=' will assign the same array by reference
        candidatePath = currentPath.slice();
      }
    }
  }
  return candidatePath;
};

module.exports.findPositionObject = function(movesPath, base) {
  if(base && Array.isArray(movesPath)) {
    let currentPositionObject = base;
    for (let i = 0; i < movesPath.length; i++) {
      currentPositionObject = this.findSubPositionObject(currentPositionObject, movesPath[i]);
    }
    return currentPositionObject;
  } else {
    return null;
  }
};

module.exports.getBest = positionObject => positionObject && positionObject.s && positionObject.s[0];
