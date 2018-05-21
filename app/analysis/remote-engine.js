/**
 * client for engine to send remote tasks for analysis via Remote Interface for Chess Positions Analysis (RICPA)
 */
const http = require('http');

class RemoteEngine {
  constructor(ricpaData) {
    this.ricpaData = ricpaData;
    this.callbackUrl = "http://localhost:9966/results";
  }
  analyzeToDepth(fen, depth) {
    return new Promise((resolve, reject) => {
      const req = http.request({path: this.ricpaData.path,
        method: 'POST',
        hostname: this.ricpaData.hostname,
        port: this.ricpaData.port
      }, res => {
        res.on('error', err => {
          console.error(err);
          reject(err);
        });
      });
      req.on('error', err => {
        console.error(`problem with request: ${err.message}`);
        reject(err);
      });
      req.write(JSON.stringify({fen, depth, postUrl: this.callbackUrl}));
      req.end();
      resolve();
    });
  }
  /**
   * Sets uci options
   *
   * @param {array} options array of uci options
   * @deprecated uci options used as configured on server side of remote engine, no changes are made
  */
  setUciOptions(options) {
    console.log('uci options used as configured on server side of remote engine, no changes are made');
  }
}

module.exports = RemoteEngine;
