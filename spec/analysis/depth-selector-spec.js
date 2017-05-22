'use strict';

describe('depthSelector', function() {
  let depthSelector = require('../../app/analysis/depth-selector');
  const DEFAULT_DEPTH = 36;
  describe('getDepthToAnalyze', function() {
    it('returns default depth', function() {
      expect(depthSelector.getDepthToAnalyze()).toEqual(DEFAULT_DEPTH);
    });
    it('returns default depth if current depths is less', function() {
      let path = ['h4'];
      let base = {m: '', s: {m: 'h4', e: {v: -0.24, d: DEFAULT_DEPTH - 1}}};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH);
    });
    it('returns depth+2 if  current depth is more than default', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{
        m: 'e4', s: [{
          m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 1}, s: [{
            m: 'Nf3', e: {v: 0.12, d: DEFAULT_DEPTH + 1}
          }]
        }]
      }]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 1 + 2);
    });
    it('returns default depth if position has no continuation', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{m: 'e4', s: [{m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH}}]}]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH);
    });
    it('returns default depth if position has no continuation even if current depth is high', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{m: 'e4', s: [{m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 10}}]}]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH);
    });
    it('returns best answer depth + 2 if position depth > best answer depth > default depth', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{
        m: 'e4', s: [{
          m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 10}, s: [{
            m: 'Nf3', e: {v: 0.12, d: DEFAULT_DEPTH + 1}
          }]
        }]
      }]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 1 + 2);
    });
    it('returns default depth if position depth is highest default but answer depth is lower', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{
        m: 'e4', s: [{
          m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 10}, s: [{
            m: 'Nf3', e: {v: 0.12, d: DEFAULT_DEPTH - 3}
          }]
        }]
      }]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH);
    });
  });
  describe('MAX_DEPTH', function() {
    it('300', function() {
      expect(depthSelector.MAX_DEPTH).toEqual(300);
    });
  });
});
