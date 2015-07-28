var fs = require('fs');

module.exports = (function() {
    var base;
    var findSubPositionObject = function (positionObject, move) {
        if (positionObject && positionObject.s) {
            for (var i = 0, l = positionObject.s.length; i < l; i++) {
                if (positionObject.s[i].m == move) {
                    return positionObject.s[i];
                }
            }
        }
        return null;
    };
    var saveBase = function () {
        fs.writeFile('base-new.json', JSON.stringify(base, null, 1));
    };
    return {
        findSubPositionObject: findSubPositionObject,
        addToBase: function (moves, bestAnswer) {
            var positionObject = base;
            var parent;
            for (var i = 0; i < moves.length; i++) {
                parent = positionObject;
                positionObject = findSubPositionObject(parent, moves[i]);
                if (positionObject == null) {
                    if (!parent.s)
                        parent.s = [];
                    positionObject = parent.s[parent.s.push({m: moves[i]}) - 1];
                }
            }
            if (positionObject != null) {
                if (!positionObject.s)
                    positionObject.s = [];
                if (!findSubPositionObject(positionObject, bestAnswer)) {
                    positionObject.s.push({m: bestAnswer});
                } else {
                    // we need only update evaluation data, if it's available
                }
                saveBase();
            }
        },
        getBase: function() {
            return base;
        },
        readBase: function () {
            var baseFileContent = fs.readFileSync('base.json');
            // JSON could not be totally good, so base = JSON.parse(baseFileContent) does not work
            base = (new Function("var base = " + baseFileContent + "; return base;"))();
        },
        saveBase: saveBase,
        getBaseAsString: function() {
            return JSON.stringify(base);
        }

    }
}());
