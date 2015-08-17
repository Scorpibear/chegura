describe('baseManager', function () {
    describe('addToBase', function () {
        it('add number to base', function () {
            baseManager = require('../app/base-manager')
            var base = baseManager.getBase()
            base.s = []
            baseManager.addToBase(['d4'], 'Nf6', 0.12, 30)
            expect(base.s[0]).toEqual({m: 'd4', n: 1, c: 'w', e: { v: 0.12, d: 30 }, s: [
                        { m: 'Nf6', n: 1, c: 'b', e: { v: 0.12, d: 30 } }
            ]})
        })
        it('updates evaluation data', function () {
            baseManager = require('../app/base-manager')
            var base = baseManager.getBase()
            base.s = []
            baseManager.addToBase([], 'd4', 0.12, 30)
            expect(base.s[0].e).toEqual({v: 0.12, d: 30})
        })
        it('change best answer when it is considered previously as not best')
    })
})