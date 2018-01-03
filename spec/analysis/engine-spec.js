describe('engine', function() {
  const Engine = require('../../app/analysis/engine');
  describe('analyzeToDepth', () => {
    const engine = new Engine('');
    it('calls run process', done => {
      let UCI = require('uci');
      spyOn(UCI.prototype, 'runProcess').and.returnValue(Promise.resolve(0));

      engine.analyzeToDepth("", 5);

      expect(UCI.prototype.runProcess).toHaveBeenCalled();
      done();
    });
  });
  describe('setUciOptions', () => {
    const engine = new Engine('');
    it('sets the options for the next run', done => {
      let UCI = require('uci');
      spyOn(UCI.prototype, 'runProcess').and.returnValue(Promise.resolve(0));
      spyOn(UCI.prototype, 'uciCommand').and.returnValue(Promise.resolve(0));
      spyOn(UCI.prototype, 'isReadyCommand').and.returnValue(Promise.resolve(0));
      spyOn(UCI.prototype, 'setOptionCommand');
      spyOn(UCI.prototype, 'uciNewGameCommand').and.returnValue(Promise.resolve(0));
      spyOn(UCI.prototype, 'positionCommand').and.returnValue(Promise.resolve(0));
      spyOn(UCI.prototype, 'goDepthCommand').and.returnValue(Promise.resolve(0));
      engine.setUciOptions([{name: "threads", value: 3}]);

      engine.analyzeToDepth("", 1).then(() => {
        expect(UCI.prototype.setOptionCommand).toHaveBeenCalledWith("threads", 3);
        done();
      });
    });
  });
});
