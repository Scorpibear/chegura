var toReadableString = function(baseObject) {
	var evaluationToString = function (positionObject) {
		if(positionObject.e){
			var value = (typeof(positionObject.e.v) == "number") ? positionObject.e.v : "'" + positionObject.e.v + "'";
			var evaluationPropertiesAsString = "v: " + value + ", d: " + positionObject.e.d;
			return "e: {" + evaluationPropertiesAsString + "}, ";
		}
		return "";
	};
	var subItemsToString = function(positionObject, level) {
		var result = "";
		if(positionObject.s) {
			for(var i= 0; i<positionObject.s.length; i++) {
				if(result!="") result = result + ",\n";
				for(var j=0;j<level;j++) result += " ";
				result += "{m: '" + positionObject.s[i].m + "', n: " + positionObject.s[i].n + ", c: '" +
					positionObject.s[i].c + "', " + evaluationToString(positionObject.s[i]) +
					"s: [" + subItemsToString(positionObject.s[i], level+1) + "]}";
			}
		}
		if(result!="") result = "\n" + result;
		return result;
	};
	var result = "{m: '', n: 0, c: 'b', t: 'wb', " + evaluationToString(baseObject) + "s: [";
	result += subItemsToString(baseObject,0);
	result += "]}";
	return result;
};

var toShortestString = function(baseObject) {
	var evaluationToString = function (positionObject) {
		if(positionObject.e){
			var value = (typeof(positionObject.e.v) == "number") ? positionObject.e.v : "'" + positionObject.e.v + "'";
			var evaluationPropertiesAsString = "v:" + value + ",d:" + positionObject.e.d;
			return "e:{" + evaluationPropertiesAsString + "},";
		}
		return "";
	};
	var subItemsToString = function(positionObject) {
		var result = "";
		if(positionObject.s) {
			for(var i= 0; i<positionObject.s.length; i++) {
				if(result!="") result = result + ",";
				result += "{m:'" + positionObject.s[i].m + "',n:" + positionObject.s[i].n + ",c:'" +
					positionObject.s[i].c + "'," + evaluationToString(positionObject.s[i]) +
					"s:[" + subItemsToString(positionObject.s[i]) + "]}";
			}
		}
		return result;
	};
	var result = "{m:'',n:0,c:'b',t:'wb',s:[";
	result += subItemsToString(baseObject);
	result += "]}";
	return result;
};

module.exports.stringify = function(baseObject, readable){
    if(readable) {
        return toReadableString(baseObject)
    } else {
        return toShortestString(baseObject);
    }
}

module.exports.parse = function(str) {
    return (new Function("var base = " + str + "; return base;"))();
}
