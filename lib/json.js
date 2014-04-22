'use strict';
/**
 * JSONを設定します
 */
module.exports = exports = function () { /* @param app */
  return function (self, json) {
    self.set('Content-type', 'text/json');
    self.body = json;
  };
};

