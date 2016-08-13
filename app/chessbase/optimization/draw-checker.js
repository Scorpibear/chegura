module.exports.findPathToTheLatestNonDrawInMainLine = function(base) {
  let path = [];
  let positionObject = base;
  while(positionObject) {
    if(positionObject.s && positionObject.s.length && positionObject.s[0].m && !this.isDrawPosition(positionObject.s[0])) {
      positionObject = positionObject.s[0];
      path.push(positionObject.m);
    } else {
      break;
    }
  }
  return path;
};

module.exports.isDrawPosition = function(positionObject) {
  return (positionObject && positionObject.e && positionObject.e.hasOwnProperty('v') &&
    positionObject.e.hasOwnProperty('d') &&
    positionObject.e.v === 0 && positionObject.e.d === 300);
}