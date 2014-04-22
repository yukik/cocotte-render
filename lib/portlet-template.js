'use strict';

var koaSend = require('koa-send');
var path = require('path');

/**
 * ファイルの種類によりキャッシュファイルを生成して保存
 * その後、
 */
var portletTemplate = function (app) {

  return function*(file){
    var f;

    f = path.join(app.root, file);

    yield koaSend(this, f);
  };

};

module.exports = exports = portletTemplate;