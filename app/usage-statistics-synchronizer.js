'use strict';

const fs = require('fs');
const FILE_NAME = 'usage-statistics.json';

module.exports.FILE_NAME = FILE_NAME;

module.exports.save = function(content) {
  if (typeof content === 'object') {
    content = JSON.stringify(content);
  }
  fs.writeFile(FILE_NAME, content, err => {
    if (err) console.error(err);
  });
};

module.exports.load = function() {
  let result = null;
  try {
    let content = fs.readFileSync(FILE_NAME);
    result = JSON.parse(content);
  } catch (err) {
    console.error('Usage statistics could not be loaded');
  }
  return result;
};
