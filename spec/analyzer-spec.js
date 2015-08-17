describe('analyzer', function () {
    var analyzer = require('../app/analyzer')
    describe('analyzeLater', function () {
        it('do not analyze start position if first move is requested', function (done) {
            analyzer.toAnalyzeList = []
            var baseManager = { addToBase: function () { } }
            analyzer.setBaseManager(baseManager)
            analyzer.analyzeLater(['e4'], { m: '', s: [{ m: 'd4' }]})
            var movesToAnalyze = analyzer.getQueue()
            expect(movesToAnalyze).toEqual([['e4']])
            done()
        })
        it('do not analyze first move if it is in base', function (done) {
            analyzer.toAnalyzeList = []
            var baseManager = { addToBase: function () { } }
            analyzer.setBaseManager(baseManager)
            analyzer.analyzeLater(['d4', 'e6'], { m: '', s: [{ m: 'd4' }] })
            var movesToAnalyze = analyzer.getQueue()
            expect(movesToAnalyze).toEqual([['d4', 'e6']])
            done()
        })
    })
})