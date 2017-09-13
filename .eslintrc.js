module.exports = {
  "extends": "google",
    "rules": {
      'linebreak-style': "off",
      'indent': [2, 2, {
         SwitchCase: 1
       }],
       'max-len': [1, 120, 4, {
      ignoreComments: true,
      ignoreUrls: true
    }]
    },
    "globals": {
      "describe": true,
      "it": true,
      "spyOn": true,
      "expect": true,
      "beforeAll": true,
      "beforeEach": true
    }
};