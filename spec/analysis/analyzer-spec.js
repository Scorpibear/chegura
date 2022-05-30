describe("analyzer", function () {
  const analyzer = require("../../app/analysis/analyzer");
  const queue = require("../../app/analysis/analysis-queue");
  const pgnAnalyzer = require("../../app/analysis/pgn-analyzer");
  const base = {};
  const item = { moves: ["e4", "d5"], fen: "some valid fen", depth: 50 };
  const ricpaClient = { postFen: () => {}, config: {} };
  describe("analyze", () => {
    beforeEach(() => {
      analyzer.setSettings({ ricpaClient });
    });
    it("post fen via ricpa client", () => {
      spyOn(ricpaClient, "postFen");
      analyzer.analyze(item);
      expect(ricpaClient.postFen).toHaveBeenCalled();
    });
    it("deletes the item from queue if moves are out of limit", () => {
      spyOn(queue, "delete").and.stub();
      spyOn(pgnAnalyzer, "areMovesWithinLimit").and.returnValue(false);
      analyzer.analyze(item);
      expect(queue.delete).toHaveBeenCalledWith(item.fen);
    });
    it("logs error if ricpaClient is not specified", () => {
      spyOn(console, "error").and.stub();
      analyzer.setSettings({ ricpaClient: undefined });
      analyzer.analyze(item);
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe("analyzeLater", () => {
    it("calls queue.add", () => {
      spyOn(queue, "add");
      analyzer.analyzeLater(["d4", "d5"], base, 1);
      expect(queue.add).toHaveBeenCalled();
    });
    it("filters moves for limit reached", async () => {
      spyOn(pgnAnalyzer, "areMovesWithinLimit").and.stub();
      await analyzer.analyzeLater(["d4", "d5"], base, 1);
      expect(pgnAnalyzer.areMovesWithinLimit).toHaveBeenCalled();
    });
    it("rejects the promise when error occurs", (done) => {
      spyOn(pgnAnalyzer, "areMovesWithinLimit").and.throwError();
      analyzer.analyzeLater(["d4", "d5"], base, 1).then(
        () => {
          done(new Error("Promise should not be resolved as error raised"));
        },
        () => {
          done();
        }
      );
    });
    it("returns rejected promise if moves were not provided", async () => {
      try {
        await analyzer.analyzeLater();
        throw new Error(
          "analyzer successfully resolved the promise without moves provided"
        );
      } catch (err) {}
    });
    it("empty moves list is a valid input", (done) => {
      analyzer.analyzeLater([], base, 1).then(
        () => {
          done();
        },
        (err) => {
          done(new Error(`no rejection is expected: ${err}`));
        }
      );
    });
    it("base has to be provided", (done) => {
      analyzer.analyzeLater(["d4", "d5"], undefined, 1).then(
        () => {
          done(
            new Error("returns resolved promise while base was not provided")
          );
        },
        () => {
          done();
        }
      );
    });
  });
});
