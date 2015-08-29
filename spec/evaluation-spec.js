describe('evaluation', function() {
    var evaluation = require('../app/evaluation')

    describe('register', function() {
        var baseManager = null
        beforeEach(function () {
            baseManager = require('../app/base-manager')
            spyOn(baseManager, 'addToBase')

        })
        it('calls baseManager.addToBase', function() {
            evaluation.register([],{},23,10)
            expect(baseManager.addToBase).toHaveBeenCalled ()
        })
        it('negates black evaluation', function() {
            evaluation.register(['e4'], {san: 'e6', color: 'b'}, -12, 30)
            expect(baseManager.addToBase).toHaveBeenCalledWith(['e4'], 'e6', 0.12, 30)
        })
    })
})
