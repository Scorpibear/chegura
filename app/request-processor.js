var analysisPriority = require("./analysis/analysis-priority");

class RequestProcessor {
  constructor({ baseManager, queueProcessor, usageStatistics, analyzer }) {
    this.analyzer = analyzer;
    this.baseManager = baseManager;
    this.queueProcessor = queueProcessor;
    this.usageStatistics = usageStatistics;
  }
  getBase(req, res) {
    let userId = new URL(req.url, "https://hostname").searchParams.get(
      "userid"
    );
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(this.baseManager.getBaseAsString());
    this.usageStatistics.registerBaseRequest(userId);
  }
  getFenBase(req, res) {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify(this.baseManager.getFenBase()));
  }
  getFenData(req, res) {
    let url = new URL(req.url, "https://hostname");
    let fen = url.searchParams.get("fen");
    if (fen) {
      fen = decodeURI(fen);
      console.log(`requesting fenData for '${fen}'`);
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(JSON.stringify(this.baseManager.getFen({ fen })));
    } else {
      res.writeHead(422);
      res.end();
    }
  }
  default(res) {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end();
  }
  analyze(req, res) {
    switch (req.method) {
      case "OPTIONS":
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, Content-Type",
        });
        res.end("");
        break;
      case "POST":
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          let data;
          try {
            data = JSON.parse(body);
          } catch {}
          if (data && data.moves) {
            this.analyzer
              .analyzeLater(
                data.moves,
                this.baseManager.getBase(),
                analysisPriority.ExternalRequestsForNewPositions
              )
              .then(() => {
                return this.queueProcessor.process();
              })
              .catch((err) => console.error(err));
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
            res.end(body);
          } else {
            const error =
              "incorrect body received: '" +
              body +
              '\'. It should be {"moves": []} json';
            console.error("POST analyze: " + error);
            res.writeHead(400, { "Access-Control-Allow-Origin": "*" });
            res.end(error);
          }
        });
        break;
      default:
        res.writeHead(405, { "Access-Control-Allow-Origin": "*" });
        res.end('should be POST method with {"moves":[]} in the body');
    }
  }
  getUsersCount(req, res) {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    var usersCount = this.usageStatistics.getUsersCount();
    res.end(String(usersCount));
  }
  ping(req, res) {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    res.end("");
    this.queueProcessor.process();
  }
}

module.exports = RequestProcessor;
