describe('RemoteEngine', () => {
  let remoteEngine;
  let http2 = require('http2');
  let client = {request: () => {}};
  beforeEach(() => {
    spyOn(http2, 'connect').and.returnValue(client);
    const RemoteEngine = require('../../app/analysis/remote-engine');
    remoteEngine = new RemoteEngine('http://someurl.net/ricpa');
  });
  describe('analyzeToDepth', () => {
    it('sends fen and depth to http', done => {
      spyOn(client, 'request');
      remoteEngine.analyzeToDepth('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 40).then(() => {
        expect(http2.connect).toHaveBeenCalledWith('http://someurl.net/ricpa');
        expect(client.request).toHaveBeenCalledWith({':path': 'analyze'});
        done();
      });
    });
  });
});
