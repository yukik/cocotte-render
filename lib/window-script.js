'use strict';

var koaSend = require('koa-send');
var path = require('path');

/**
 * ウインドウスクリプト
 */
var windowScript = function (app) {

  return function*(file){
    var f;

    f = path.join(app.root, file);

    yield koaSend(this, f);
  };

};

module.exports = exports = windowScript;