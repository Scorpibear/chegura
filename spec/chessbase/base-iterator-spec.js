'use strict';

var baseIterator = require('../../app/chessbase/base-iterator.js');

describe('baseIterator', function () {
  describe('getMovesToInsufficientEvaluationDepth', function () {
    it('return root', function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({ m: '', e: { v: 0.12, d: 29 }, s: [] }, 30)).toEqual([[]]);
    });
    it('first best answer sends to evaluation', function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          {m: 'd4', e: {v: 0.1, d: 29}, s: [
            {m: 'd5'}
          ]}
        ]
      }, 30)).toEqual([['d4']]);
    });
    it('both answers are sent to evaluation', function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          { m: 'd4', e: { v: 0.1, d: 29 }, s: [
            {m: 'Nf6'}
          ] },
          { m: 'e4', e: { v: 0.1, d: 29 }, s: [
            {m: 'e6'}
          ] },
        ]
      }, 30)).toEqual([['d4'], ['e4']]);
    });
    it('sub item is sent for revaluation', function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 35 }, s: [
          {
            m: 'd4', e: { v: 0.1, d: 35 }, s: [
              { m: 'Nf6', e: { v: 0.1, d: 34 }, s: [
                {m: 'Nf3'}
              ] }]
          },
          { m: 'e4', e: { v: 0.1, d: 35 }, s: [] },
        ]
      }, 35)).toEqual([['d4','Nf6']]);
    });
    it('second move is added before third even if it go on lower branch', function () {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          {
            m: 'd4', e: { v: 0.1, d: 30 }, s: [
              {m: 'Nf6', e: {v: 0.1, d: 30}, s: [
                {m: 'Nf3', e: {v: 0.1, d: 29}, s: [
                  {m: 'e6'}
                ]}]}]
          },
          { m: 'e4', e: { v: 0.1, d: 30 }, s: [
            {m: 'e6', e: {v: 0.1, d:29}, s: [
              {m: 'd4'}
            ]}] }
        ]
      }, 30)).toEqual([['e4', 'e6'], ['d4', 'Nf6', 'Nf3']]);
    });
    it('skips evaluation of moves after not the best', function() {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          { m: 'e4', e: { v: 0.1, d: 30 }, s: [] },
          { m: 'd4', e: { v: 0.1, d: 30 }, s: [
            {m: 'Nf6', e: {v: 0.1, d: 30}, s: []},
            {m: 'd5', e: {v:0.1, d: 29}, s: []}
          ]}
        ]
      }, 30)).toEqual([]);
    });
    it('ignores empty evaluations at the end of tree', () => {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 30 }, s: [
          {m: 'd4', e: {v: 0.1, d: 30}, s: [
            {m: 'd5'}
          ]}
        ]
      }, 30)).toEqual([]);
    });
    it('ignores empty evaluations at the end when there is sibling continuation', () => {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth({
        m: '', e: { v: 0.12, d: 46 }, s: [
          {m: 'd4', e: {v: 0.1, d: 46}, s: [
            {m: 'd5'}]},
          {m: 'f3', n: 1, c: 'w', e: {v: -0.88, d: 46}, s: [
            {m: 'e5', n: 1, c: 'b', e: {v: -0.6, d: 46}, s: [
              {m: 'Nc3', n: 2, c: 'w', s: []},
              {m: 'e3', n: 2, c: 'w', e: {v: -0.95, d: 46}, s: [
                {m: 'd5', n: 2, c: 'b', e: {v: -0.67, d: 46}, s: [
                  {m: 'd4', n: 3, c: 'w', s: []}]}]}]}]}]
      }, 46)).toEqual([]);
    });
    it('sends for evaluation empty evaluations inside a tree', () => {
      expect(baseIterator.getMovesToInsufficientEvaluationDepth(
        {m: '', e: { v: 0.12, d: 35 }, s: [
          {m: 'd4', s: [
            { m: 'Nf6', e: { v: 0.1, d: 35 }, s: [
              {m: 'Nf3'}
            ] }]
          },
          {m: 'e4', e: { v: 0.1, d: 35 }, s: [] },
        ]}, 35)).toEqual([['d4']]);
    });
  });
  describe('findLatestMainLine', function() {
    it('returns latest', function() {
      var base = {m: '', s:[{m: 'd4', s: [ {m: 'Nf6'}]}]};
      expect(baseIterator.findLatestMainLine(base)).toEqual(['d4','Nf6']);
    });
  });
  describe('findPositionObject', function() {
    it('works', function() {
      let positionObject = baseIterator.findPositionObject(['d4'], {m: '', s:[{m: 'd4'}]});
      expect(positionObject).toEqual({m: 'd4'});
    });
    it('returns null if movesPath is not an array', function() {
      let positionObject = baseIterator.findPositionObject({});
      expect(positionObject).toBeNull();
    });
  });
  describe('findMinDepthMainLinePath', function() {
    it('works', function() {
      let base = {m: '', e: {v: 0.1, d: 47}, s:[
        {m: 'e4', e: {v: 0.15, d: 38}, s: [
          {m: 'e6'}
        ]}]};
      let movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual(['e4']);
    });
    it('iterates to 2 levels deep', function() {
      let base = {m: '', e: {v: 0.1, d: 47}, s:[
        {m: 'e4', e: {v: 0.15, d: 38}, s:[
          {m: 'e6', e: {v: 0.12, d: 32}, s:[
            {m: 'd4'}
          ]}]}]};
      let movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual(['e4', 'e6']);
    });
    it('finds lowest depth between high', function() {
      let base = {m: '', e: {v: 0.1, d: 47}, 
        s:[{m: 'e4', e: {v: 0.15, d: 38},
          s:[{m: 'e6', e: {v: 0.12, d: 32},
            s:[{m: 'Nf3', e: {v: 0.12, d:28}, 
              s:[{m: 'd5', e: {v: 0, d:100}}]
            }]}]}]};
      let movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual(['e4', 'e6', 'Nf3']);
    });
    it('uses the first lowest', () => {
      const base = {m: '', e: {v: 0.1, d: 20}, 
        s:[{m: 'e4', e: {v: 0.15, d: 30},
          s:[{m: 'e6', e: {v: 0.12, d: 20},
            s:[{m: 'Nf3', e: {v: 0.12, d: 44}, 
              s:[{m: 'd5', e: {v: 0.1, d: 42}, 
                s:[{m: 'Nc3', e: {v: 0, d: 300}}]
              }]}]}]}]};
      const movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual([]);
    });
    it('do not return the pgn when limit reached', () => {
      let pgnAnalyzer = require('../../app/analysis/pgn-analyzer');
      pgnAnalyzer.setMovesLimit(3);
      const base = {'m': '', 'n': 0, 'c': 'b', 't': 'wb', 'e': {'v': 0.43, 'd': 22}, 's': [
        {'m': 'd4', 'n': 1, 'c': 'w', 'e': {'v': 0.31, 'd': 22}, 's': [
          {'m': 'Nf6', 'n': 1, 'c': 'b', 'e': {'v': 0.34, 'd': 22}, 's': [
            {'m': 'c4', 'n': 2, 'c': 'w', 'e': {'v': 0.27, 'd': 22}, 's': [
              {'m': 'e6', 'n': 2, 'c': 'b', 'e': {'v': 0.3, 'd': 22}, 's': [
                {'m': 'Nf3', 'n': 3, 'c': 'w', 'e': {'v': 0.31, 'd': 26}, 's': [
                  {'m': 'd5', 'n': 3, 'c': 'b', 'e': {'v': 0.39, 'd': 18}, 's': []}]}]}]}]}]}]};
      const movesPath = baseIterator.findMinDepthMainLinePath(base);
      expect(movesPath).toEqual([]);
    });
  });
  describe('getBest', () => {
    it('returns undefined if no elements in s property', () => {
      expect(baseIterator.getBest({s:[]})).toBeUndefined();
    });
    it('returns undefined if no s property', () => {
      expect(baseIterator.getBest({})).toBeUndefined();
    });
    it('throws error if s property is not an array', () => {
      expect(baseIterator.getBest({s: 123})).toBeUndefined();
    });
    it('return undefined is positionObject is undefined', () => {
      expect(baseIterator.getBest(undefined)).toBeUndefined();
    });
  });
});
