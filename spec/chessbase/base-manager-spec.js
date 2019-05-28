const fs = require('fs');
const baseManager = require('../../app/chessbase/base-manager');
const baseOptimizer = require('../../app/chessbase/optimization/base-optimizer');
const baseSerializer = require('../../app/chessbase/base-serializer');
const bestmovedb = require('bestmovedb');
const converter = require('../../app/converter');

describe('baseManager', () => {
  let base = baseManager.getBase();

  describe('addToBase', () => {
    beforeAll(function() {
      spyOn(baseManager, 'saveBase').and.stub();
    });
    it('add number to base', function () {
      base.s = [];
      baseManager.addToBase(['d4'], 'Nf6', 0.12, 30);
      expect(base.s[0]).toEqual({m: 'd4', n: 1, c: 'w', e: { v: 0.12, d: 30 }, s: [
        { m: 'Nf6', n: 1, c: 'b' }
      ]});
    });
    it('does not update best answer evaluation data (issue #54)', function () {
      base.s = [];
      baseManager.addToBase([], 'd4', 0.12, 30);
      expect(base.s[0].e).toBeUndefined();
    });
    it('change best answer when it is considered previously as not best', function() {
      base.s = [{m: 'd4', s: [{m: 'c5', s: []}]}];
      baseManager.addToBase(['d4'], 'e6', 0.12, 30);
      expect(base.s[0].s[0].m).toEqual('e6');
      expect(base.s[0].s[1].m).toEqual('c5');
    });
    it('updates position evaluation data', function() {
      base.s = [{m: 'd4', e: {v: 0.12, d: 29}}];
      baseManager.addToBase(['d4'], 'e6', 0.23, 34);
      expect(base.s[0].e).toEqual({v: 0.23, d: 34});
    });
    it('main line is not modified', function() {
      base.s = [{m: 'd4'}];
      baseManager.addToBase(['e4'], 'e6', 0.12, 34);
      expect(base.s[0].m).toEqual('d4');
    });
    it('promote answer to the top if it becomes the best', function() {
      base.s = [{m: 'e4'},{m:'d4'}];
      baseManager.addToBase([],'d4',0.1,40);
      expect(base.s.length).toEqual(2);
      expect(base.s[0].m).toEqual('d4');
    });
    it('does not update evaluation if it is lower than existent', function() {
      base.e = {v: 0.12, d: 40};
      baseManager.addToBase([], 'd4', 0.1, 39);
      expect(base.e).toEqual({v: 0.12, d: 40});
    });
    it('does not update best answer evaluation if it is lower than existent', function() {
      base.s = [{m: 'd4', e: {v: 0.11, d: 40}}];
      baseManager.addToBase([], 'd4', 0.1, 39);
      expect(base.s[0].e).toEqual({v: 0.11, d: 40});
    });
    it('does not change the best answer if evalution has lower depth', () => {
      base.e = {v:0.11, d:45};
      base.s = [{m: 'e4', e: {}}];
      baseManager.addToBase([], 'd4', 0.1, 44);
      expect(base.s[0].m).toEqual('e4');
    });
    it('adds position to bestmovedb', () => {
      spyOn(bestmovedb, 'add').and.stub();
      baseManager.addToBase([], 'd4', 0.1, 100);
      expect(bestmovedb.add).toHaveBeenCalled();
    });
  });
  describe('getBaseAsString', () => {
    it('stringifies', () => {
      spyOn(baseSerializer, 'stringify').and.returnValue('some string');
      expect(baseManager.getBaseAsString()).toEqual('some string');
    });
  });
  describe('getFen', () => {
    it('wraps bestmovedb.getFen', () => {
      spyOn(bestmovedb, 'getFen');
      baseManager.getFen({fen: 'abc', depth: 100});
      expect(bestmovedb.getFen).toHaveBeenCalledWith({fen: 'abc', depth: 100});
    });
  });
  describe('index', () => {
    it('calls converter.json2fenbase', async () => {
      spyOn(converter, 'json2fenbase');
      await baseManager.index();
      expect(converter.json2fenbase).toHaveBeenCalledWith(baseManager.getBase(), bestmovedb);
    });
    it('logs error if covertation failed', async () => {
      spyOn(console, 'error').and.stub();
      spyOn(converter, 'json2fenbase').and.throwError('something went wrong');
      await baseManager.index();
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe('optimize', () => {
    it('calls baseOptimizer.optimize', () => {
      spyOn(baseOptimizer, 'optimize').and.stub();
      baseManager.optimize({});
      expect(baseOptimizer.optimize).toHaveBeenCalled();
    });
  });
  describe('saveBaseSync', () => {
    it('console.error is called in case of error during writeFile', () => {
      spyOn(fs, 'writeFileSync').and.throwError('error');
      spyOn(console, 'error').and.stub();

      baseManager.saveBaseSync();

      expect(console.error).toHaveBeenCalledWith(new Error('error'));
    });
    it('save to base.json', function() {
      spyOn(fs, 'writeFileSync').and.stub();
      delete base.e;
      delete base.s;
      baseManager.saveBaseSync();
      expect(fs.writeFileSync).toHaveBeenCalledWith('base.json', '{"m": "", "n": 0, "c": "b", "t": "wb", "s": []}');
    });
    it('console.error is not called in case of no error during writeFile', () => {
      spyOn(fs, 'writeFileSync').and.stub();
      spyOn(console, 'error').and.callThrough();

      baseManager.saveBaseSync();

      expect(console.error).not.toHaveBeenCalled();
    });
  });
  describe('saveBase', () => {
    it('calls saveBaseSync in promise', async () => {
      spyOn(baseManager, 'saveBaseSync').and.stub();
      await baseManager.saveBase();
      expect(baseManager.saveBaseSync).toHaveBeenCalled();
    });
  });
  describe('readBase', () => {
    it('reads base from base.json', () => {
      spyOn(fs, 'readFileSync').and.stub();

      baseManager.readBase();

      expect(fs.readFileSync).toHaveBeenCalledWith('base.json');
    });
    it('logs error when file cound not be read', () => {
      spyOn(fs, 'readFileSync').and.throwError('could not read');
      spyOn(console, 'error').and.callThrough();

      baseManager.readBase();

      expect(console.error).toHaveBeenCalled();
    });
  });
});
