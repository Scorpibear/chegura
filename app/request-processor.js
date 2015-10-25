var url = require('url');
var baseManager = require('./base-manager');
var usageStatistics = require('./usage-statistics');
var analyzer = require('./analysis/analyzer')

module.exports.getBase = function(req, res) {
    var query = url.parse(req.url, true).query;
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(baseManager.getBaseAsString());
    usageStatistics.registerBaseRequest(query.userid);
}

module.exports.getFavicon = function(res) {
    res.end();
}

module.exports.analyze = function(req, res) {
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
            if (data.moves) {
                analyzer.analyzeLater(data.moves, baseManager.getBase(), 1);
            } else {
                console.error("Incorrect data received:", data);
            }
        });
        res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
        res.end("");
    }
}

module.exports.getUsersCount = function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    var usersCount = usageStatistics.getUsersCount();
    res.end("" + usersCount);
}