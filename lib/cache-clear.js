'use strict';

/**
 * レンダリングファイルのキャッシュをクリアする
 */

var path = require('path');
var co = require('co');
var thunkify = require('thunkify');
var fs = require('fs-extra');
var isDirectory = function (dir) {
  return function (cb) {
    fs.exists(dir, function (t){
      if (t) {
        fs.stat(dir, function (e, stat) {
          cb(null, !e && stat.isDirectory());
        });
      } else {
        cb(null, false);
      }
    });
  };
};
var remove = thunkify(fs.remove);
var mkdirs = thunkify(fs.mkdirs);

module.exports = exports = function (app) {

  // キャッシュディレクトリ
  var dir = path.join(app.root, 'cache', 'render');

  co(function*() {
    if (yield isDirectory(dir)) {
      yield remove(dir);
    }
    yield mkdirs(dir);
  })();
};