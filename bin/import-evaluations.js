// Import evaluations from evaluations.log, able to recover base.json from the old backup
const fs = require('fs');
const readline = require('readline');
const baseManager = require('../app/chessbase/base-manager');
const evaluationsFile = 'evaluations.log';

const rl = readline.createInterface({
  input: fs.createReadStream(evaluationsFile),
  crlfDelay: Infinity
});

let i = 0;

baseManager.readBase();
baseManager.saveBase = () => {};

rl.on('line', (line) => {
  const parts = line.split(' ');
  if(parts.length == 3) {
    const moves = parts[0].split(',');
    const bestMove = parts[1].substr(0, parts[1].length-1);
    let [score, depth] = parts[2].split('/');
    score = isNaN(score) ? score : +score;
    depth = +depth;
    baseManager.addToBase(moves, bestMove, score, depth);
    i++;
    console.log(`${i}: ${moves}`, bestMove, score, depth);
  } else {
    console.error(`Could not process record: '${line}'`);
  }
});

rl.on('close', () => {
  baseManager.saveBaseSync();
  console.log(`Evaluations processed: ${i}`);
});