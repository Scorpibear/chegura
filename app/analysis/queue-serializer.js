const smartStringifier = require('smart-stringifier');

module.exports.stringify = function(queue) {
  return smartStringifier.stringify({q: queue});
};

module.exports.parse = function(str) {
  const parsed = JSON.parse(str).q;
  parsed[2]=[];
  parsed[3]=[];
  return parsed;
};
