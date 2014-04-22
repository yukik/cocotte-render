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
 * 
 *
 *
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

module.exports = exports = function(app) {

  var json = require('./lib/json')(app);
  var render = require('./lib/render')(app);
  var windowTemplate = require('./lib/window-template')(app);
  var windowScript = require('./lib/window-script')(app);
  var portletTemplate = require('./lib/portlet-template')(app);
  var portletScript = require('./lib/portlet-script')(app);

  /**
   * レンダリング
   * viewsが文字列の場合はビューを使用
   * その他の場合はJSONと見なしそのまま返す
   */
  var main = function*(val, options) {

    if (typeof val === 'string') {

      var idx = val.indexOf(':');
      var type = idx > 0 ? val.substring(0, idx - 1) : null;
      var file = idx > 0 ? val.substring(idx + 1) : val;

      switch(type) {
      case 'window-template':
        yield windowTemplate(this, file, options);
        break;
      case 'window-script':
        yield windowScript(this, file, options);
        break;
      case 'portlet-template':
        yield portletTemplate(this, file, options);
        break;
      case 'portlet-script':
        yield portletScript(this, file, options);
        break;
      default:
        yield render(this, file, options);
        break;
      }

    } else {
      json(this, val);
    
    }

  };

  return function*(next) {
    this.render = main;
    yield next;
  };
};

/**
 * キャッシュを削除する
 */
exports.cacheClear = require('./lib/cache-clear');
