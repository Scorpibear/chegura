const RequestProcessor = require('../app/request-processor');

describe('requestProcessor', () => {
  const stub = () => { /* just an empty stub for tests to later spyOn and mock */ };
  const analyzer = {analyzeLater: () => Promise.resolve()};
  const baseManager = {getBaseAsString: stub, getBase: stub, getFenBase: stub, getFen: stub};
  const res = {writeHead: stub, end: stub, json: stub};
  const moves = ['d4', 'Nf6'];
  const queueProcessor = {process: stub};
  const usageStatistics = {getUsersCount: stub, registerBaseRequest: stub};
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
    it('queue is not processed if analyzeLater fails', () => {
      const req = {method: 'POST', on: (event, handler) => handler(JSON.stringify({moves}))};
      spyOn(analyzer, 'analyzeLater').and.returnValue(Promise.reject());
      spyOn(queueProcessor, 'process').and.stub();
      requestProcessor.analyze(req, res);
      expect(queueProcessor.process).not.toHaveBeenCalled();

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
  describe('getFenBase', () => {
    it('provide fenbase as is', () => {
      const req = {};
      spyOn(baseManager, 'getFenBase').and.stub();
      requestProcessor.getFenBase(req, res);
      expect(baseManager.getFenBase).toHaveBeenCalled();
    });
  });
  describe('getFenData', () => {
    it('use info from baseManager', () => {
      const fenData = {bestMove: 'Nf6', sp: 30, depth: 50};
      spyOn(baseManager, 'getFen').and.returnValue(fenData);
      spyOn(res, 'end');
      requestProcessor.getFenData({url: '/api/fenData?fen=some valid FEN'}, res);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify(fenData));
    });
    it('sends data to getFen as an object', () => {
      const fen = 'let us imagine it is a correct FEN';
      spyOn(baseManager, 'getFen');
      requestProcessor.getFenData({url: `/api/fenData?fen=${fen}`}, res);
      expect(baseManager.getFen).toHaveBeenCalledWith({fen});
    });
    it('sends 422 if fen is not specified', () => {
      spyOn(res, 'writeHead');
      requestProcessor.getFenData({url: '/api/fenData'}, res);
      expect(res.writeHead).toHaveBeenCalledWith(422);
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
