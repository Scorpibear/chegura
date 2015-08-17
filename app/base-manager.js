var fs = require('fs')
var baseSerializer = require('./base-serializer')
var baseOptimizer = require('./base-optimizer')
var baseIterator = require('./base-iterator')

var base = { m: '', n: 0, c: 'b', t: 'wb' }

var saveBase = function () {
    fs.writeFile('base-new.json', baseSerializer.stringify(base, true));
}

var createChildPositionObject = function (parentObject, childMove, evaluationObject) {
    var n, c;
    if (parentObject.c == 'w') {
        n = parentObject.n
        c = 'b'
    } else {
        n = parentObject.n + 1
        c = 'w'
    }
    var newChildObject = { m: childMove,  n: n, c: c, e: evaluationObject}
    parentObject.s.push(newChildObject)
    return newChildObject;
}

module.exports.addToBase = function (moves, bestAnswer, scoreValue, depth) {
    var evaluationObject = { v: scoreValue, d: depth };
    var positionObject = base;
    var parent;
    for (var i = 0; i < moves.length; i++) {
        parent = positionObject;
        positionObject = baseIterator.findSubPositionObject(parent, moves[i]);
        if (positionObject == null) {
            if (!parent.s)
                parent.s = [];
            positionObject = createChildPositionObject(parent, moves[i], evaluationObject);
        }
    }
    if (positionObject != null) {
        if (!positionObject.s)
            positionObject.s = [];
        var subPositionObject = baseIterator.findSubPositionObject(positionObject, bestAnswer);
        if (!subPositionObject) {
            createChildPositionObject(positionObject, bestAnswer, evaluationObject);
        } else {
            subPositionObject.e = evaluationObject;
        }
        saveBase();
    }
}

module.exports.getBase = function() {
    return base;
}

module.exports.readBase = function () {
    var baseFileContent = fs.readFileSync('base.json');
    base = baseSerializer.parse(baseFileContent);
}

module.exports.saveBase = saveBase

module.exports.getBaseAsString = function() {
    return baseSerializer.stringify(base);
}

module.exports.optimize = function(analyzer) {
    baseOptimizer.optimize(base, analyzer);
}
