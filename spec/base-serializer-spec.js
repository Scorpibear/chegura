var serializer = require("../app/base-serializer.js")

describe("baseSerializer", function () {
    describe("parse", function() {
        it("simple parsing", function() {
            expect(serializer.parse(
                "{m: '', n: 0, c: 'b', t: 'wb', s: [" +
                "{m: 'd4', n: 1, c: 'w', e: {v: 0.13, d: 30}, s: []}]}")).toEqual(
                 {m: '', n: 0, c: 'b', t: 'wb', s: [
                 {m: 'd4', n: 1, c: 'w', e: {v: 0.13, d: 30}, s: []}]});
        });
        it("simple stringify", function() {
            expect(serializer.stringify({m: '', n: 0, c: 'b', t: 'wb', s: []}, true)).toEqual("{m: '', n: 0, c: 'b', t: 'wb', s: []}");
        })
		it("saves evaluation for start position", function() {
		    expect(serializer.stringify({m: '', n: 0, c: 'b', t: 'wb', e: {v: 0.12, d: 34}, s: []}, true)).toEqual("{m: '', n: 0, c: 'b', t: 'wb', e: {v: 0.12, d: 34}, s: []}")
		})
    })
})
