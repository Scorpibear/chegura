var http = require('http');
var analyzer = require('./app/analyzer');
var baseManager = require('./app/base-manager');

var defaultPort = 9966;
var port = defaultPort;

baseManager.readBase();
baseManager.saveBase();
analyzer.setBaseManager(baseManager)
analyzer.readQueue();

http.createServer(function (req, res) {
    switch (req.url) {
        case "/api/analyze":
            if (req.method == "OPTIONS") {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type'
                });
                res.end("");
            }
            if (req.method == "POST") {
                req.on('data', function (chunk) {
                    var data = JSON.parse(chunk);
                    if(data.moves) {
                        analyzer.analyzeLater(data.moves, baseManager.getBase());
                    } else {
                        console.error("Incorrect data received:", data);
                    }
                });
                res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
                res.end("");
            }
            break;
        case "/favicon.ico":
            res.end();
            break;
        case "/api/getbase":
        case "/":
        default:
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(baseManager.getBaseAsString());
    }
}).listen(port);

baseManager.optimize(analyzer);

console.log("Chegura is ready to process your requests on " + port + " port")