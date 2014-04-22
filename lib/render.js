'use strict';

/*
 * テンプレートエンジンswigを使用して値をバインド後、bodyに設定します
 *
 * app.root/viewsのフォルダに該当のファイルが存在する場合は、
 * そのファイルを使用してレンダリングを行います
 *
 * 存在しない場合は、cocotteモジュール内のapplication/viewsフォルダの該当ファイルを
 * 使用してレンダリングを行います
 *
 * これにより、規定のビューの代わりに使用するビューを指定する事が出来ます
 */

/**
 * dependencies
 */
var path = require('path');
var coViews = require('co-views');
var fs = require('fs');
var exists = function (file) {
  return function (cb) {
    fs.exists(file, function(et) {cb(null, et);});
  };
};

module.exports = exports = function(app) {

  // viewが保存されているフォルダ
  var cocotteViews = path.join(path.dirname(require.resolve('cocotte')), 'application/views');
  var appViews = path.join(app.root, 'views');

  // レンダー関数
  var appRender = coViews(appViews, {map: {html: 'swig'}});
  var cocotteRender = coViews(cocotteViews, {map: {html: 'swig'}});

  /**
   * レンダリング
   * viewsが文字列の場合はビューを使用
   * その他の場合はJSONと見なしそのまま返す
   */
  return function*(self, view, params) {

    var p = {
        title: app.title,
        user: self.session.user,
        group: self.session.group
      };

    if (params) {
      Object.keys(params).forEach(function(k){
        p[k] = params[k];
      });
    }

    if (yield exists(path.join(appViews, view + '.html'))) {
      self.body = yield appRender(view, p);
    } else {
      self.body = yield cocotteRender(view, p);
    }
  };
};

