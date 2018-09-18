const RequestProcessor = require('../app/request-processor');

describe('requestProcessor', () => {
  const analyzer = {analyzeLater: () => {}};
  const baseManager = {getBaseAsString: () => {}, getBase: () => {}};
  const res = {writeHead: ()=>{}, end: ()=>{}};
  const moves = ['d4', 'Nf6'];
  const queueProcessor = {process: ()=>{}};
  const usageStatistics = {getUsersCount: () => {}, registerBaseRequest: () => {}};
  const requestProcessor = new RequestProcessor({baseManager, queueProcessor, usageStatistics, analyzer});

  describe('analyze', () => {
    it('send moves to analyzer', () => {
      const req = {method: 'POST', on: (event, handler) => handler(JSON.stringify({moves}))};
      spyOn(analyzer, 'analyzeLater').and.returnValue(Promise.resolve());
      requestProcessor.analyze(req, res);
      expect(analyzer.analyzeLater).toHaveBeenCalledWith(moves, baseManager.getBase(), 1);
    });
    it('writes header on OPTIONS method', () => {
      const req = { method: 'OPTIONS' };
      spyOn(res, 'writeHead').and.stub();
      requestProcessor.analyze(req, res);
      expect(res.writeHead).toHaveBeenCalled();
    });
    it('logs error if moves where not posted', () => {
      const req = { method: 'POST', on: (event, handler) => handler(JSON.stringify({})) };
      spyOn(console, 'error').and.stub();
      requestProcessor.analyze(req, res);
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe('default', () => {
    it('sends response immediately', () => {
      spyOn(res, 'end').and.stub();
      requestProcessor.default(res);
      expect(res.end).toHaveBeenCalled();
    });
  });
  describe('getBase', () => {
    it('save user info', () => {
      const req = {url: ''};
      spyOn(usageStatistics, 'registerBaseRequest');
      requestProcessor.getBase(req, res);
      expect(usageStatistics.registerBaseRequest).toHaveBeenCalled();
    });
  });
  describe('getUsersCount', () => {
    it('returns usageStatistics.getUsersCount', () => {
      const req = {};
      spyOn(res, 'end');
      spyOn(usageStatistics, 'getUsersCount').and.returnValue(42);
      requestProcessor.getUsersCount(req, res);
      expect(res.end).toHaveBeenCalledWith('42');
    });
  });
  describe('ping', () => {
    it('ask queue processor to process queue', () => {
      spyOn(queueProcessor, 'process').and.stub();
      requestProcessor.ping({}, res);
      expect(queueProcessor.process).toHaveBeenCalled();
    });
  });
});
