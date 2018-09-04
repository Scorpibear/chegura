const RequestProcessor = require('../app/request-processor');

describe('requestProcessor', () => {
  const baseManager = {getBaseAsString: () => {}};
  const res = {writeHead: ()=>{}, end: ()=>{}};
  const queueProcessor = {process: ()=>{}};
  const usageStatistics = {registerBaseRequest: () => {}};
  const requestProcessor = new RequestProcessor({baseManager, queueProcessor, usageStatistics});

  describe('getBase', () => {
    it('save user info', () => {
      const req = {url: ''};
      spyOn(usageStatistics, 'registerBaseRequest');
      requestProcessor.getBase(req, res);
      expect(usageStatistics.registerBaseRequest).toHaveBeenCalled();
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
