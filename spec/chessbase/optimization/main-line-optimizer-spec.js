describe('mainLineOptimizer', function() {
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

    it('goes +2 half-moves deeper on the first node with minimal depth in the main line if mate was found', function() {
        var base = {m: '', e: {d: 37, v: 0.1}, s: [
            {m: 'g4', e: {d: 30, v: 0.1}, s: [
                {m: 'e5', e: {d: 30, v: 0.1}, s: [
                    {m: 'f3', e: {d: 30, v: '#1'}, s: [
                        {m: 'Qh4#'}
                    ]}
                ]}
            ]}
        ]};
        var baseIterator = {findLatestMainLine: function(){}, findMinDepthMainLinePath: function() {return ['g4'];}};
        spyOn(baseIterator, 'findLatestMainLine').and.returnValue(['g4', 'e5', 'f3', 'Qh4#']);
        var analyzer = {analyzeLater: function(path, base, priority){}};
        spyOn(analyzer, 'analyzeLater');
        mainLineOptimizer.goDeeper(base, baseIterator, analyzer);
        expect(analyzer.analyzeLater).toHaveBeenCalledWith(['g4'], base, analysisPriority.MainLineOptimization)
    });

    it('go +2 half-moves deeper on the first node with lowest depth in the main line if draw', function() {
      let base = {m: '', e: {d: 37, v: 0.1}, s: [
        {m: 'e4', e: {d: 32, v: 0.1}, s: [
          {m: 'e6', e: {d: 32, v: 0.15}, s: [
            {m: 'Nf6', e: {d: 300, v: 0}}
          ]}
        ]}
      ]};
      let analyzer = {analyzeLater: function() {}};
      spyOn(analyzer, 'analyzeLater');
      let baseIterator = {findLatestMainLine: function() {
        return ['e4', 'e6', 'Nf6'];
      }, findMinDepthMainLinePath: function() {
        return ['e4'];
      }};

      mainLineOptimizer.goDeeper(base, baseIterator, analyzer);

      expect(analyzer.analyzeLater).toHaveBeenCalledWith(['e4'], base, analysisPriority.MainLineOptimization);
    });
  })
})
