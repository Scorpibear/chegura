describe('mailLineOptimizer', function() {
  var mainLineOptimizer = require('../../../app/chessbase/optimization/main-line-optimizer');
  var analysisPriority = require('../../../app/analysis/analysis-priority');
  var base = { m: '', s: [
    {m: 'd4', s: [
      {m: 'Nf6' } ] } ] };

  describe('goDeeper', function() {
    it('sends for evaluation last move in main line', function () {
      var analyzer = {analyzeLater: function(){}};
      spyOn(analyzer, 'analyzeLater');
      var baseIterator = {findLatestMainLine: function(){}};
      spyOn(baseIterator, 'findLatestMainLine').and.returnValue(['d4', 'Nf6']);
      mainLineOptimizer.goDeeper(base, baseIterator, analyzer);
      expect(analyzer.analyzeLater).toHaveBeenCalledWith(['d4', 'Nf6'], base, analysisPriority.MainLineOptimization)
      expect(baseIterator.findLatestMainLine).toHaveBeenCalledWith(base)
    })

    //if mate found, go +2 half-moves deeper on the node with minimal depth in the main line
    //if draw found, go +2 half-moves deeper on the last node with not zero evaluation in the main line
  })
})
