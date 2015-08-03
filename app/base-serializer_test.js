describe("baseSerializer", function() {
    var serializer = require("./base-serializer.js");
    describe("parse", function() {
        it("simple parsing", function() {
            expect(serializer.parse(
                "{m: '', n: 0, c: 'b', t: 'wb', s: [" +
                "{m: 'd4', n: 1, c: 'w', e: {v: 0.13, d: 30}, s: []}]}"))
            .toEqual(
                 {m: '', n: 0, c: 'b', t: 'wb', s: [
                 {m: 'd4', n: 1, c: 'w', e: {v: 0.13, d: 30}, s: []}]});
        });
        it("simple stringify", function() {
            expect(serializer.stringify({m: '', n: 0, c: 'b', t: 'wb', s: []})).toEqual("{m: '', n: 0, c: 'b', t: 'wb', s: []}");
        })
    })
});