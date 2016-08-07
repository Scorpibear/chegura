module.exports = {
  "extends": "google",
    "rules": {
      'linebreak-style': "off",
      'indent': [2, 2, {
         SwitchCase: 1
       }],
    },
    "globals": {
      "describe": true,
      "it": true,
      "spyOn": true,
      "expect": true
    }
};