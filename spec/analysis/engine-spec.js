describe('engine', function() {
  const engine = require('../../app/analysis/engine');

  describe('analyzeToDepth', () => {
    it('calls run process', () => {
      let UCI = require('uci');
      spyOn(UCI.prototype, 'runProcess').and.returnValue(Promise.resolve(0));

      engine.analyzeToDepth("", 5);

      expect(UCI.prototype.runProcess).toHaveBeenCalled();
    });
  });
  describe('setUciOptions', () => {
    it('sets the options for the next run');
  });
});
