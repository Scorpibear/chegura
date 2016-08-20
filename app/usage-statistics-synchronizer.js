const fs = require('fs');
const FILE_NAME = 'usage-statistics.json';

module.exports.save = function(content) {
  fs.writeFileSync(FILE_NAME, content);
};

module.exports.FILE_NAME = FILE_NAME;
