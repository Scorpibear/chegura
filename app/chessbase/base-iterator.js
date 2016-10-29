'use strict';

var pgnAnalyzer = require('../analysis/pgn-analyzer');

var addMoves = function (result, moves, parentObject, requiredDepth, objectsToLookDeeper, base) {
  if (parentObject.s) {
    parentObject.s.forEach(function (childObject) {
      var movesWithChild = moves.slice();
      movesWithChild.push(childObject.m);
      if ((!childObject.e || childObject.e.d < requiredDepth) && (!pgnAnalyzer.isError(movesWithChild, base))) {
        result.push(movesWithChild);
      } else {
        objectsToLookDeeper.push({ positionObject: childObject, moves: movesWithChild });
      }
    });
  }
};

module.exports.getMovesToInsufficientEvaluationDepth = function (base, requiredDepth) {
  var result = [];
  var moves = [];
  if(!base.e || base.e.d < requiredDepth) {
    result.push(moves);
  }
  var objectsToLookDeeper = []
  addMoves(result, moves, base, requiredDepth, objectsToLookDeeper, base)
  while (objectsToLookDeeper.length > 0) {
    var nextLevelOfObjects = [];
    objectsToLookDeeper.forEach(function (objectData) {
      addMoves(result, objectData.moves, objectData.positionObject, requiredDepth, nextLevelOfObjects, base)
    })
    objectsToLookDeeper = nextLevelOfObjects
  }
  return result;
};

module.exports.getMovesWithSameFenButDifferentEvaluation = function (base) {
  var result = [];
  //TODO: implement logic
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
  while(positionObject && positionObject.hasOwnProperty("m")) {
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
  let candidatePath = currentPath;
  let positionObject = base;
  let minDepth = positionObject.e.d;
  while(positionObject && positionObject.s && positionObject.s.length) {
    positionObject = positionObject.s[0];
    if(positionObject && positionObject.m) {
      currentPath.push(positionObject.m);
      if(positionObject.hasOwnProperty('e') && positionObject.e.hasOwnProperty('d') && positionObject.e.d < minDepth) {
        minDepth = positionObject.e.d;
        // copy array via slice(), ordinary '=' will assign the same array by reference
        candidatePath = currentPath.slice();
      }
    }
  }
  return candidatePath;
};

module.exports.findPositionObject = function(movesPath, base) {
  if(base && movesPath.hasOwnProperty('length')) {
    let currentPositionObject = base;
    for (let i = 0; i < movesPath.length; i++) {
      currentPositionObject = this.findSubPositionObject(currentPositionObject, movesPath[i]);
    }
    return currentPositionObject;
  } else {
    return null;
  }
};
