const fs = require('fs');
const { stringify } = require('../app/chessbase/base-serializer');

const { baseFilename, depthLimit, cutFilename } = readParams();
const base = readBase(baseFilename);
cutBase(base, depthLimit);
writeResults(base, cutFilename);


function readParams() {
  const params = new Map(process.argv.map(str => str.split('=')));
  const depthLimit = params.get('depth') || 40;
  const baseFilename = params.get('base') || 'base.json';
  const cutFilename = `base-cut-${depthLimit}.json`;
  console.log('depthLimit:', depthLimit);
  return { baseFilename, depthLimit, cutFilename };
}

function readBase(filename) {
  const baseContent = fs.readFileSync(filename);
  console.log('Read bytes:', baseContent.length);
  const base = JSON.parse(baseContent);
  return base;
}

function cutBase(base, depthLimit) {
  let po = base;
  let stack = [];
  let currentIndex = 0;
  while(po) {
    while(po && po.s && po.s.length) {
      stack.push({po, currentIndex});
      if(po.n <= depthLimit) {
        po = po.s[currentIndex];
      } else {
        po.s = [];
      }
    }
    let parentInfo = stack[stack.length - 1];
    while(parentInfo) {
      if(parentInfo.currentIndex + 1 < parentInfo.po.s.length) {
        po = parentInfo.po.s[++parentInfo.currentIndex];
        parentInfo = undefined;
        currentIndex = 0;
      } else {
        stack.pop();
        parentInfo = stack[stack.length - 1];
        po = undefined;
      }
    }
  }
}

function writeResults(base, filename) {
  const cutContent = stringify(base, true);
  fs.writeFileSync(filename, cutContent);
  console.log('Write bytes:', cutContent.length);
}
