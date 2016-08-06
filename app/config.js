const filename = 'app.config.json';
let fs = require('fs');
let content = fs.readFileSync(filename);
module.export = JSON.parse(content);
