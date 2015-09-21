var logs = [];

module.exports.registerBaseRequest = function(userID) {
    var logData = {userID: userID, date: Date.now()};
    console.log('base requested for "' + logData.userID+'" at ' + logData.date);
    logs.push(logData);
};

module.exports.getUsersCount = function() {
    var uniqueUsers = new Set();
    var now = new Date();
    var week = 7*24*60*60*1000;
    logs.forEach(function(logData) {
        if(logData.date > (now - week) ) {
            uniqueUsers.add(logData.userID);
        }
    });
    return uniqueUsers.size;
};

module.exports.reset = function() {
    logs = [];
};