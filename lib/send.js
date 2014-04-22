'use strict';

var koaSend = require('koa-send');
var path = require('path');
var fs = require('fs');
var exists = function (file) {
  return function (cb) {
    fs.exists(file, function(et) {cb(null, et);});
  };
};

var cocotteFiles = path.join(path.dirname(require.resolve('cocotte')), 'application');

/**
 * ファイルを送信
 *
 * アプリケーションフォルダに存在しない場合は、cocotteモジュールから送信
 */
var send = function (app) {

  return function*(self, file){

    var appFile = path.join(app.root, file);

    if (yield exists(appFile)) {
      yield koaSend(self, appFile);

    } else {
      yield koaSend(self, path.join(cocotteFiles, file));

    }

  };

};

module.exports = exports = send;