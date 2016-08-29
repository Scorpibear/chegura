const fs = require('fs');
const FILE_NAME = 'usage-statistics.json';

module.exports.FILE_NAME = FILE_NAME;

module.exports.save = function(content) {
  if (typeof content === 'object') {
    content = JSON.stringify(content);
  }
  fs.writeFileSync(FILE_NAME, content);
};

module.exports.load = function() {
  let content = fs.readFileSync(FILE_NAME);
  return JSON.parse(content);
};
