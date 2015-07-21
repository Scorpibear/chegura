var http = require('http');
var fs = require('fs');
var url = require('url');
var Chess = require('./chess');
var Engine = require('uci');
var defaultPort = 9966;
var port = defaultPort;
var defaultChessEnginePath = "stockfish-6-64.exe";
var pathToChessEngine = (process.argv.length > 2) ? process.argv[2] : defaultChessEnginePath;
var engine = new Engine(pathToChessEngine);
var isAnalysisInProgress = false;
var baseFileContent;
var base;
var DAY = 100000000;
var DEBUG_PERIOD = 5000;
var analyzePeriod = DAY;

var readBase = function () {
    baseFileContent = fs.readFileSync('base.json');
    //base = JSON.parse(baseFileContent);
    //if not good JSON then
    base = (new Function("var base = " + baseFileContent + "; return base;"))();
};

var saveBase = function () {
    fs.writeFile('base-new.json', JSON.stringify(base, null, 1));
};

var findSubPositionObject = function (positionObject, move) {
    if (positionObject && positionObject.s) {
        for (var i = 0, l = positionObject.s.length; i < l; i++) {
            if (positionObject.s[i].m == move) {
                return positionObject.s[i];
            }
        }
    }
    return null;
};

readBase();
saveBase();

var addToBase = function (moves, bestAnswer) {
    var positionObject = base;
    var parent;
    for (var i = 0; i < moves.length; i++) {
        parent = positionObject;
        positionObject = findSubPositionObject(parent, moves[i]);
        if (positionObject == null) {
            if (!parent.s)
                parent.s = [];
            positionObject = parent.s[parent.s.push({m: moves[i]}) - 1];
        }
    }
    if (positionObject != null) {
        if (!positionObject.s)
            positionObject.s = [];
        if (!findSubPositionObject(positionObject, bestAnswer)) {
            positionObject.s.push({m: bestAnswer});
        } else {
            // we need only update evaluation data, if it's available
        }
        console.log('updated base: ', JSON.stringify(base, null, 4));
        saveBase();
    }
};

var toAnalyzeList = [];

var analyze = function () {
    if (isAnalysisInProgress || toAnalyzeList.length == 0)
        return;
    isAnalysisInProgress = true;
    var moves = toAnalyzeList.shift();
    console.log("start to analyze moves: ", moves);
    var resultBestmove;
    var chess = new Chess();
    moves.forEach(function (move) {
        chess.move(move);
    });
    var fen = chess.fen();
    engine.runProcess().then(function () {
        return engine.uciCommand();
    }).then(function () {
        return engine.isReadyCommand();
    }).then(function () {
        return engine.uciNewGameCommand();
    }).then(function () {
        return engine.positionCommand(fen);
    }).then(function () {
        return engine.goInfiniteCommand(function infoHandler(info) {
            //console.log(info);
        });
    }).delay(analyzePeriod).then(function () {
        return engine.stopCommand();
    }).then(function (bestmove) {
        resultBestmove = chess.move(bestmove).san;
        return engine.quitCommand();
    }).then(function () {
        console.log("best move:", moves, resultBestmove);
        addToBase(moves, resultBestmove);
        isAnalysisInProgress = false;
        analyzeLater();
    }).fail(function (error) {
        console.log(error);
        isAnalysisInProgress = false;
    }).done();
};

function splitSequentially(base, moves) {
    console.log('splitSequentially');
    var list = [];
    var positionObject = base;
    console.log('positionObject', positionObject);
    console.log('moves', moves);
    moves.forEach(function (move, index) {
        console.log('positionObject: ', positionObject);
        console.log('move: ', move);
        var subObject = findSubPositionObject(positionObject, move);
        console.log('subObject: ', subObject);
        if (subObject == null) {
            list.push(moves.slice(0, index));
            console.log('list: ', list);
        }
        positionObject = subObject;
    });
    list.push(moves);
    return list;
}

var analyzeLater = function (moves) {
    if (moves) {
        var movesList = splitSequentially(base, moves);
        movesList.forEach(function (moves) {
            toAnalyzeList.push(moves);
        })
    }
    setTimeout(analyze, 100);
};

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
                    analyzeLater(data.moves);
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
            res.end(baseFileContent);
    }
}).listen(port);

