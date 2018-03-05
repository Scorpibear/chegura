/**
 * client for engine to send remote tasks for analysis via Remote Interface for Chess Positions Analysis (RICPA)
 */
const http2 = require('http2');

let promissedClient;

class RemoteEngine {
  constructor(uri) {
    promissedClient = new Promise((resolve, reject) => {
      let client = http2.connect(uri);
      resolve(client);
    });
  }
  analyzeToDepth(fen, depth) {
    return promissedClient.then(client => {
      client.request({':path': 'analyze'});
    });
  }
}

module.exports = RemoteEngine;
