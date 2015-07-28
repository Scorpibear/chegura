var http = require('http');
var defaultPort = 9966;
var port = defaultPort;
var analyze = require('./analyze');
var baseManager = require('./base-manager');

baseManager.readBase();
baseManager.saveBase();

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
                    console.log(data.moves);
                    analyze.analyzeLater(data.moves, baseManager.getBase());
                });
                res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
                res.end("");
            }
            break;
        case "/api/getbase":
        default:
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(baseManager.getBaseAsString());
    }
}).listen(port);

