﻿describe('baseManager', function () {
    describe('addToBase', function () {
	    baseManager = require('../app/base-manager')
		var base = baseManager.getBase()
		
        it('add number to base', function () {
            base.s = []
            baseManager.addToBase(['d4'], 'Nf6', 0.12, 30)
            expect(base.s[0]).toEqual({m: 'd4', n: 1, c: 'w', e: { v: 0.12, d: 30 }, s: [
                        { m: 'Nf6', n: 1, c: 'b', e: { v: 0.12, d: 30 } }
            ]})
        })
        it('updates best answer evaluation data', function () {
            base.s = []
            baseManager.addToBase([], 'd4', 0.12, 30)
            expect(base.s[0].e).toEqual({v: 0.12, d: 30})
        })
        it('change best answer when it is considered previously as not best', function() {
		    base.s = [{m: 'd4', s: [{m: 'c5', s: []}]}]
		    baseManager.addToBase(['d4'], 'e6', 0.12, 30)
			expect(base.s[0].s[0].m).toEqual('e6')
			expect(base.s[0].s[1].m).toEqual('c5')
		})
		it('updates position evaluation data', function() {
			base.s = [{m: 'd4', e: {v: 0.12, d: 29}}]
		    baseManager.addToBase(['d4'], 'e6', 0.23, 34)
			expect(base.s[0].e).toEqual({v: 0.23, d: 34})
		})
		it('main line is not modified', function() {
		    base.s = [{m: 'd4'}]
			baseManager.addToBase(['e4'], 'e6', 0.12, 34)
		    expect(base.s[0].m).toEqual('d4')
		})
    })
})