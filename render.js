'use strict';

/*
 * renderメソッドをthisに追加する
 *
 * ミドルウェア内で、this.render(file, params)を実行する事が出来るようになります
 *
 * 次のミドルウェアが予め有効になっている必要があります
 *
 *   - セッション
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

// cocotteが提供しているviewが保存されているフォルダ
var cocotteViews = path.join(path.dirname(require.resolve('cocotte')), 'application/views');

module.exports = exports = function(app) {
  // アプリケーションフォルダのviewが保存されているフォルダ
  var appViews = path.join(app.root, 'views');

  // レンダー関数
  var appRender = coViews(appViews, {map: {html: 'swig'}});
  var cocotteRender = coViews(cocotteViews, {map: {html: 'swig'}});

  /**
   * レンダリング
   * viewsが文字列の場合はビューを使用
   * その他の場合はJSONと見なしそのまま返す
   */
  var render = function*(view, params) {

      if (typeof view === 'string') {

        var p = {
            title: app.title,
            user: this.session.user,
            group: this.session.group
          };

        if (params) {
          Object.keys(params).forEach(function(k){
            p[k] = params[k];
          });
        }

        if (yield exists(path.join(appViews, view + '.html'))) {
          return yield appRender(view, p);
        } else {
          return yield cocotteRender(view, p);
        }

      } else {
        this.set('Content-type', 'text/json');
        return view;

      }
    };

  return function*(next) {
    this.render = render;
    yield next;
  };
};

