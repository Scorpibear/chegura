describe('baseOptimizer', function() {
    var baseOptimizer = require('../app/base-optimizer');
    describe('optimize', function() {
        it("validates against chess rules", function() {
            var validator = require('../app/validator');
            spyOn(validator, 'validate');
            var base = {m: 'd4', e: {v:0.12, d:30}, s: [{m: 'Nf6', e: {v:0.12, d:30}}]};
            baseOptimizer.optimizeSync(base, null);
            expect(validator.validate).toHaveBeenCalled()
        })
    })
})