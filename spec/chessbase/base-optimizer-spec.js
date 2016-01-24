describe('baseOptimizer', function() {
    var baseOptimizer = require('../../app/chessbase/base-optimizer');
    describe('optimize', function() {
        var base = {m: 'd4', e: {v:0.12, d:30}, s: [{m: 'Nf6', e: {v:0.12, d:30}}]};

        it("validates against chess rules", function() {
            var validator = require('../../app/chessbase/validator');
            spyOn(validator, 'validate');

            baseOptimizer.optimizeSync(base, null);

            expect(validator.validate).toHaveBeenCalled()
        })

        it("optimizes main line evaluation", function() {
            var mainLineOptimizer = require('../../app/chessbase/optimization/main-line-optimizer');
            spyOn(mainLineOptimizer, 'goDeeper');

            baseOptimizer.optimizeSync(base, null);

            expect(mainLineOptimizer.goDeeper).toHaveBeenCalled();
        })
    })
})
