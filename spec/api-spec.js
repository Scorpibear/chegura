const api = require('../app/api');

describe('api', () => {
  describe('createMap', () => {
    let stub = () => { /* just an empty stub function */ };
    let processor = {getFenBase: stub};
    let res = {};
    it('maps /api/fenbase and related requestProcess', () => {
      spyOn(processor, 'getFenBase');
      const map = api.createMap(processor);
      map({url: 'http://localhost:9966/api/fenbase'}, res);
      expect(processor.getFenBase).toHaveBeenCalled();
    });
  });
});
