module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  extends: "eslint:recommended",
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["off"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-console": "off",
    "comma-dangle": "off",
  },
  globals: {
    describe: true,
    it: true,
    afterAll: true,
    afterEach: true,
    beforeAll: true,
    beforeEach: true,
    require: true,
    spyOn: true,
    expect: true,
    jasmine: true,
  },
};
