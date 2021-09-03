var analysisPriority = require('./analysis/analysis-priority');

class RequestProcessor{
  constructor({baseManager, queueProcessor, usageStatistics, analyzer}){
    this.analyzer = analyzer;
    this.baseManager = baseManager;
    this.queueProcessor = queueProcessor;
    this.usageStatistics = usageStatistics;
  }
  getBase(req, res) {
    let userId = new URL(req.url, 'https://hostname').searchParams.get('userid');
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(this.baseManager.getBaseAsString());
    this.usageStatistics.registerBaseRequest(userId);
  }
  getFenBase(req, res) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(this.baseManager.getFenBase()));
  }
  getFenData(req, res) {
    let url = new URL(req.url, 'https://hostname');
    let fen = url.searchParams.get('fen');
    if(fen) {
      fen = decodeURI(fen);
      console.log(`requesting fenData for '${fen}'`);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(this.baseManager.getFenData(fen)));
    } else {
      res.writeHead(422);
      res.end();
    }
  }
  default(res) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
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
          this.analyzer.analyzeLater(data.moves, this.baseManager.getBase(),
            analysisPriority.ExternalRequestsForNewPositions).then(() => {
            return this.queueProcessor.process();
          }).catch(err => console.error(err));
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
