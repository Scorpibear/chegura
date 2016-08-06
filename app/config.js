const filename = './app.config.json';
const fs = require('fs');
let buffer = fs.readFileSync(filename);
let jsonContent = JSON.parse(buffer);
module.exports = jsonContent;
