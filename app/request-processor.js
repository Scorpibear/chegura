const url = require('url');

var analyzer = require('./analysis/analyzer');
var analysisPriority = require('./analysis/analysis-priority');

class RequestProcessor{
  constructor({baseManager, queueProcessor, usageStatistics}){
    this.baseManager = baseManager;
    this.queueProcessor = queueProcessor;
    this.usageStatistics = usageStatistics;
  }
  getBase(req, res) {
    var query = url.parse(req.url, true).query;
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(this.baseManager.getBaseAsString());
    this.usageStatistics.registerBaseRequest(query.userid);
  }
  getFavicon(res) {
    res.end();
  }
  analyze(req, res) {
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, Content-Type'
      });
      res.end('');
    }
    if (req.method === 'POST') {
      req.on('data', chunk => {
        var data = JSON.parse(chunk);
        if (data.moves) {
          analyzer.analyzeLater(data.moves, this.baseManager.getBase(), analysisPriority.ExternalRequestsForNewPositions);
        } else {
          console.error('Incorrect data received:', data);
        }
      });
      res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
      res.end('');
    }
  }
  getUsersCount(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    var usersCount = this.usageStatistics.getUsersCount();
    res.end(String(usersCount));
  }
  ping(req, res) {
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    res.end('');
    this.queueProcessor.process();
  }
}










module.exports = RequestProcessor;
