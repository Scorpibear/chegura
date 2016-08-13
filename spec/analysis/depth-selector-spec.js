describe('depthSelector', function() {
  let depthSelector = require('../../app/analysis/depth-selector');
  describe('getDepthToAnalyze', function() {
    it('returns default depth', function() {
      expect(depthSelector.getDepthToAnalyze()).toEqual(32);
    });
    it('returns default depth if current depths is less', function() {
      let path = ['h4'];
      let base = {m: '', s:{m: 'h4', e: {v: -0.24, d: 31}}};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(32);
    });
    it('returns depth+2 if  current depth is more than 32', function() {
      let path = ['e4','e6'];
      let base = {m: '', s: [{m: 'e4', s: [{m: 'e6', e: {v: 0.1, d:33}}]}]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(35);
    })
  });
  describe('MAX_DEPTH', function() {
    it('300', function() {
      expect(depthSelector.MAX_DEPTH).toEqual(300);
    });
  });
});
