'use strict';

describe('depthSelector', function() {
  let depthSelector = require('../../app/analysis/depth-selector');
  const DEFAULT_DEPTH = 40;
  describe('getDepthToAnalyze', function() {
    it('returns default depth', function() {
      expect(depthSelector.getDepthToAnalyze()).toEqual(DEFAULT_DEPTH);
    });
    it('returns default depth if current depth is less', function() {
      let path = ['h4'];
      let base = {m: '', s: {m: 'h4', e: {v: -0.24, d: DEFAULT_DEPTH - 1}}};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH);
    });
    it('returns depth + 4 if  current depth is default', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [
        {m: 'e4', s: [
          {m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH}, s: [
            {m: 'Nf3'}
          ]}
        ]}
      ]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 4);
    });
    it('improve default depth if position has no evaluation', function() {
      let path = ['e4'];
      let base = {m: '', s: [
        {m: 'e4',  e: {v: 0.1, d: DEFAULT_DEPTH}, s: [
          {m: 'e6'}
        ]}
      ]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 4);
    });
    it('improve depth if position has no continuations even if current depth is high', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{m: 'e4', s: [{m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 10}}]}]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 14);
    });
    it('returns current depth + 4 if position depth > best answer depth > default depth', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{
        m: 'e4', s: [{
          m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 10}, s: [{
            m: 'Nf3', e: {v: 0.12, d: DEFAULT_DEPTH + 1}
          }]
        }]
      }]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 14);
    });
    it('improve current depth if position depth is highest default but answer depth is lower', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{
        m: 'e4', s: [{
          m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH + 10}, s: [{
            m: 'Nf3', e: {v: 0.12, d: DEFAULT_DEPTH - 3}
          }]
        }]
      }]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 14);
    });
    it('improve current depth if answer does not have evalution yet', function() {
      let path = ['e4', 'e6'];
      let base = {m: '', s: [{
        m: 'e4', s: [{
          m: 'e6', e: {v: 0.1, d: DEFAULT_DEPTH}, s: [{
            m: 'Nf3'
          }]
        }]
      }]};
      expect(depthSelector.getDepthToAnalyze(path, base)).toEqual(DEFAULT_DEPTH + 4);
    });
  });
  describe('MAX_DEPTH', function() {
    it('300', function() {
      expect(depthSelector.MAX_DEPTH).toEqual(300);
    });
  });
  describe('setDefaultDepth', () => {
    let defaultDepth;
    beforeEach(() => {
      defaultDepth = depthSelector.getMinDepthRequired();
    });
    it('could change min depth required', () => {
      depthSelector.setDefaultDepth(42);
      expect(depthSelector.getMinDepthRequired()).toBe(42);
    });
    afterEach(() => {
      depthSelector.setDefaultDepth(defaultDepth);
    });
  });
});
