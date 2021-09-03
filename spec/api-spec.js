const api = require('../app/api');
const http = require('http');

describe('api', () => {
  let stub = () => { /* just an empty stub function */ };
  let processor = {getFenBase: stub, ping: stub, getUsersCount: stub, analyze: stub, getBase: stub,
    getFenData: stub, default: stub
  };
  let port = 112233;

  describe('createMap', () => {
    let res = {};
    let map;
    beforeEach(() => {
      spyOn(processor, 'getFenBase');
      spyOn(processor, 'ping');
      spyOn(processor, 'getUsersCount');
      spyOn(processor, 'getBase');
      spyOn(processor, 'analyze');
      spyOn(processor, 'getFenData');
      spyOn(processor, 'default');
      map = api.createMap(processor);
    });
    it('maps /api/fenbase and related requestProcess', () => {
      map({url: '/api/fenbase'}, res);
      expect(processor.getFenBase).toHaveBeenCalled();
    });
    it('maps /api/ping', () => {
      map({url: '/api/ping'}, res);
      expect(processor.ping).toHaveBeenCalled();
    });
    it('maps /api/userscount', () => {
      map({url: '/api/userscount'}, res);
      expect(processor.getUsersCount).toHaveBeenCalled();
    });
    it('maps /api/analyze', () => {
      map({url: '/api/analyze'}, res);
      expect(processor.analyze).toHaveBeenCalled();
    });
    it('maps /api/base', () => {
      map({url: '/api/base'}, res);
      expect(processor.getBase).toHaveBeenCalled();
    });
    it('maps /api/fendata', () => {
      map({url: '/api/fendata'}, res);
      expect(processor.getFenData).toHaveBeenCalled();
    });
    it('maps to default in case of unsupported api call', () => {
      map({url: '/api/unsupported'}, res);
      expect(processor.default).toHaveBeenCalled();
    });
  });
  describe('register', () => {
    it('creates http server on a specified port', () => {
      const server = {listen: stub};
      spyOn(http, 'createServer').and.returnValue(server);
      spyOn(api, 'createMap').and.stub();
      spyOn(server, 'listen');
      api.register(processor, port);
      expect(http.createServer).toHaveBeenCalled();
      expect(server.listen).toHaveBeenCalledWith(port);
    });
  });
});
