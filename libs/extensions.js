/// <reference path="../runtime.d.ts" />

/*
extensions.js：负责拓展插件
 */

"use strict";

function extensions() {

}

extensions.prototype._load = function (callback) {
    if (main.replayChecking) return callback();
    if (!window.fs) {
        this._loadJs('_server/fs.js', function () {
            core.extensions._listExtensions(callback);
        }, callback);
    } else this._listExtensions(callback);
}

extensions.prototype._loadJs = function (file, callback, onerror) {
    var script = document.createElement('script');
    script.src = file + '?v=' + main.version;
    script.onload = callback;
    script.onerror = onerror;
    main.dom.body.appendChild(script);
}

extensions.prototype._listExtensions = function (callback) {
    if (!window.fs) return callback();
    fs.readdir('extensions', function (error, data) {
        if (error || !(data instanceof Array)) return callback();
        var list = [];
        data.forEach(function (name) {
            if (/^[\w.-]+\.js$/.test(name)) {
                list.push(name);
            }
        });
        list.sort();
        core.extensions._loadExtensions(list, callback);
    });
}

extensions.prototype._loadExtensions = function (list, callback) {
    var i = 0;
    var load = function () {
        if (i == list.length) return callback();
        core.extensions._loadJs('extensions/' + list[i++], load, load);
    }
    load();
}
