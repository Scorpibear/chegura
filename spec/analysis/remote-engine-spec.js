const http = require('http');

const RemoteEngine = require('../../app/analysis/remote-engine');

const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('remoteEngine', () => {
  let remoteEngine;
  beforeEach(() => {
    remoteEngine = new RemoteEngine({hostname: 'ricpa.host.com', port: 9977, path: '/api/fen'});
  });
  describe('analyzeToDepth', () => {
    it('executes http request', () => {
      spyOn(http, 'request').and.stub();
      remoteEngine.analyzeToDepth(fen, 40);
      expect(http.request).toHaveBeenCalledWith({
        method: 'POST', hostname: 'ricpa.host.com', port: 9977, path: '/api/fen'}, jasmine.anything());
    });
    it('sends fen and depth');
  });
});
