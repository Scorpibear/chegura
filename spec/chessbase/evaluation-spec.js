describe('evaluation', function() {
    var evaluation = require('../../app/chessbase/evaluation')

    describe('register', function() {
        var baseManager = null
        beforeEach(function () {
            baseManager = require('../../app/chessbase/base-manager')
            spyOn(baseManager, 'addToBase')

        })
        it('calls baseManager.addToBase', function() {
            evaluation.register([],{san: 'e5', color: 'w'},23,10)
            expect(baseManager.addToBase).toHaveBeenCalled ()
        })
        it('negates black evaluation', function() {
            evaluation.register(['e4'], {san: 'e6', color: 'b'}, -12, 30)
            expect(baseManager.addToBase).toHaveBeenCalledWith(['e4'], 'e6', 0.12, 30)
        })
        it('does not throw exception if bestmove is null', function() {
            evaluation.register(['e4'], null, -12, 32);
            expect(baseManager.addToBase).not.toHaveBeenCalled();
        })
    })
})
