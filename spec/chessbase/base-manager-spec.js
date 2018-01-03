describe('baseManager', function () {
	const baseManager = require('../../app/chessbase/base-manager');
	let base = baseManager.getBase();

	describe('addToBase', function () {
		beforeAll(function() {
			spyOn(baseManager, 'saveBase').and.stub();
		})
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
		it('promote answer to the top if it becomes the best', function() {
			base.s = [{m: 'e4'},{m:'d4'}]
			baseManager.addToBase([],'d4',0.1,40)
			expect(base.s.length).toEqual(2)
			expect(base.s[0].m).toEqual('d4')
		})
		it('does not update evaluation if it is lower than existent', function() {
			base.e = {v: 0.12, d: 40}
			baseManager.addToBase([], 'd4', 0.1, 39)
			expect(base.e).toEqual({v: 0.12, d: 40})
		})
		it('does not update best answer evaluation if it is lower than existent', function() {
			base.s = [{m: 'd4', e: {v: 0.11, d: 40}}]
			baseManager.addToBase([], 'd4', 0.1, 39)
			expect(base.s[0].e).toEqual({v: 0.11, d: 40})
		})
	});
	describe('saveBase', () => {
		it('save to base.json', function() {
			fs = require('fs')
			spyOn(fs, 'writeFile').and.stub();
			delete base.e
			delete base.s
			baseManager.saveBase()
			expect(fs.writeFile).toHaveBeenCalledWith('base.json', '{"m": "", "n": 0, "c": "b", "t": "wb", "s": []}', jasmine.anything());
		})
    })
})
