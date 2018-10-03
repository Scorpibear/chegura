module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "off"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off",
        "comma-dangle": "off"
    },
    "globals": {
        "describe": true,
        "it": true,
        "beforeAll": true,
        "beforeEach": true,
        "require": true,
        "spyOn": true,
        "expect": true,
        "jasmine": true
    }
};