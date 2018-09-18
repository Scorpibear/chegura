module.exports.stringify = function(queue) {
  return JSON.stringify({q: [queue[0],queue[1],[],[]]});
};

module.exports.parse = function(str) {
  const parsed = JSON.parse(str).q;
  parsed[2]=[];
  parsed[3]=[];
  return parsed;
};
