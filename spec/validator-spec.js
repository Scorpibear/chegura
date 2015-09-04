describe("validator", function() {
    var validator = require('../app/validator');

    describe("validate", function() {
        beforeEach(function () {
            spyOn(console, 'error');
        });

        it("logs not valid move", function() {
            var base = {m:"",s:[{m:"d5"}]};
            validator.validate(base);
            expect(console.error).toHaveBeenCalledWith("Not valid answer after '' identified: 'd5'! Please, investigate, fix the base and restart server")
        });
        it("keep silent if all moves are valid", function() {
            var base = {m:"",s:[{m:"d4"}]};
            validator.validate(base);
            expect(console.error).not.toHaveBeenCalled()
        });
        it("second half-move", function() {
            var base = {m:"",s:[{m:"d4",s:[{m:"Nf7"}]}]};
            validator.validate(base);
            expect(console.error).toHaveBeenCalledWith("Not valid answer after 'd4' identified: 'Nf7'! Please, investigate, fix the base and restart server")
        });
        it("third half-move", function() {
            var base = {m:"",s:[{m:"d4",s:[{m:"Nf6",s:[{m:"d3"}]}]}]};
            validator.validate(base);
            expect(console.error).toHaveBeenCalledWith("Not valid answer after 'd4,Nf6' identified: 'd3'! Please, investigate, fix the base and restart server")
        });
        it("go to different branches", function() {
            var base = {m:"",s:[{m:"d4", s:[{m:"Nf6"}]},{m:"Nc6"}]};
            validator.validate(base);
            expect(console.error).toHaveBeenCalledWith("Not valid answer after '' identified: 'Nc6'! Please, investigate, fix the base and restart server")
        });
        it("go back after go deep in another branch", function() {
            var base = {m:"",s:[{m:"d4"}, {m:"e4", s:[{m:"Nf7"}]}]};
            validator.validate(base);
            expect(console.error).toHaveBeenCalledWith("Not valid answer after 'e4' identified: 'Nf7'! Please, investigate, fix the base and restart server")
        });
        it("identify duplicated moves", function() {
            var base = {m:"", s:[{m:"d4"},{m:"d4"}]}
            validator.validate(base);
            expect(console.error).toHaveBeenCalledWith("Duplicated answer after '' identified: 'd4'! Please, investigate, fix the base and restart server")
        })
    })
});

