let logs = [];
var recentSynchronizer;

module.exports.registerBaseRequest = function(userID) {
  var logData = {userID: userID, date: Date.now()};
  console.log('base requested for "' + logData.userID+'" at ' + logData.date);
  logs.push(logData);
  this.save(recentSynchronizer);
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

module.exports.getJSON = function() {
  return {logs: logs};
};

module.exports.save = function(synchronizer) {
  if(synchronizer && synchronizer.save) {
    synchronizer.save(this.getJSON());
  }
};

module.exports.load = function(synchronizer) {
  recentSynchronizer = synchronizer;
  if(synchronizer && synchronizer.load) {
    let data = synchronizer.load();
    if(data && data.logs) {
      logs = data.logs;
    }
  }
};
