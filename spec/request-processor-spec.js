const requestProcessor = require('../app/request-processor');

const queueProcessor = require('../app/analysis/queue-processor');
const usageStatistics = require('../app/usage-statistics');

describe('requestProcessor', () => {
  const res = {writeHead: ()=>{}, end: ()=>{}};

  describe('getBase', () => {
    it('save user info', () => {
      const req = {url: ""};
      spyOn(usageStatistics, 'registerBaseRequest');
      requestProcessor.getBase(req, res);
      expect(usageStatistics.registerBaseRequest).toHaveBeenCalled();
    });
  });
  describe('saveResults', () => {
    it('register evaluation in queue processor', () => {
      spyOn(queueProcessor, 'registerEvaluation').and.stub();
      const req = {method: "POST", on: (event, callback) => {
        callback(JSON.stringify({fen: '', depth: 30, bestMove: '', score: -0.23}));
      }};
      requestProcessor.saveResults(req, res);
      expect(queueProcessor.registerEvaluation).toHaveBeenCalled();
    });
  });
});
