/**
 * 离线游戏使用本地存储扩展。
 * 开启本拓展后，将会把所有存档存至 _saves 目录下。
 * 需配合样板V2.8.2+使用
 */

"use strict";

(function () {
    // 将这一行改成 false 可以禁用本拓展
    var __enabled = true;

    if (window.jsinterface || !window.fs || !__enabled) return;  

    function rewrite() {
        core.utils._setLocalForage_set = function (name, str, callback) {
            var data = LZString.compressToBase64(str);
            core.saves.cache[name] = data;
            fs.writeFile('_saves/' + name, data, 'utf-8', callback);
        }

        core.utils._getLocalForage_get = function (name, callback) {
            fs.readFile('_saves/' + name, 'utf-8', function (err, data) {
                if (err) return callback(err);
                callback(null, data);
            });
        }

        core.utils.decompress = function (data) {
            try {
                return JSON.parse(LZString.decompressFromBase64(data))
            } catch (e) {
                return null;
            }
        }

        core.utils._removeLocalForage_remove = function (name, callback) {
            fs.deleteFile('_saves/' + name, callback);
        }

        core.utils.clearLocalForage = function (name, callback) {
            // Nothing to do
        }

        core.utils.iterateLocalForage = function (iter, callback) {
            fs.readdir('_saves', function (err, data) {
                if (err) callback(err);
                else {
                    data.forEach(function (one) {
                        iter(null, one, null);
                    });
                    callback();
                }
            });
        }

        core.utils.keysLocalForage = function (callback) {
            fs.readdir('_saves', callback);
        }

        core.utils.lengthLocalForage = function (callback) {
            fs.readdir('_saves', function (err, data) {
                if (err) callback(err);
                else callback(null, data.length);
            });
        }
    }

    fs.mkdir('_saves', function (err) {
        if (err) return;
        rewrite();
        core.control.getSaveIndexes(function (indexes) { core.saves.ids = indexes; });
    });
})();


