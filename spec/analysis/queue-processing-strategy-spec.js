describe('queueProcessingStrategy', () => {
  const QueueProcessingStrategy = require('../../app/analysis/queue-processing-strategy');
  const pgnAnalyzer = {isOptimal: () => true};
  const baseProvider = {getBase: () => ({m:''})};
  describe('isInteresting', () => {
    it('is not error', () => {
      const strategy = new QueueProcessingStrategy({pgnAnalyzer, baseProvider});
      spyOn(pgnAnalyzer, 'isOptimal').and.returnValue(true);
      expect(strategy.isInteresting(['e4', 'e5'], {})).toBeTruthy();
      expect(pgnAnalyzer.isOptimal).toHaveBeenCalledWith(['e4', 'e5'], baseProvider.getBase());
    });
  });
})