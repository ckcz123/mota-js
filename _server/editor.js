"use strict";

var editor = class Editor {
    version = "3.0";

    data = {};

    /////////// 数据相关 ///////////

    /**
     * 编辑器的初始化函数
     * 激活表现层类，由表现层初始化对应的数据操作模块
     */
    init() {
        let loadList = [
            'loader', 'control', 'utils', 'items', 'icons','sprite', 'scenes', 'maps', 'enemys', 'events', 'actions', 'data', 'ui', 'core'
        ];
        let pureData = [ 
            'data', 'enemys', 'icons', 'maps', 'items', 'functions', 'events', 'plugins', 'sprite',
        ];
        editor.loadJsByList('project', pureData, function() {
            var mainData = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main;
            for(var ii in mainData) editor.data[ii] = mainData[ii];
            
            editor.loadJsByList('libs', loadList, function () {
                editor.core = core;
                for (let i = 0; i < loadList.length; i++) {
                    let name = loadList[i];
                    if (name === 'core') continue;
                    editor.core[name] = new window[name]();
                }
                editor_util_wrapper(editor);
                editor_file_wrapper(editor);
                editor_list_wrapper(editor);
                editor_multi_wrapper(editor);
                editor.fs = fs;
                editor_file = editor_file(editor, function () {
                    editor.file = editor_file;
                    editor_view_wrapper(editor);
                    editor_map_wrapper(editor, function() {
                        view_mappanel_wrapper(editor);
                    });
                    view_datapanel_wrapper(editor);
                    view_scriptpanel_wrapper(editor);
                    view_pluginpanel_wrapper(editor);
                });
            });
        });

        // editor.airwallImg = new Image();
        // editor.airwallImg.src = './_server/img/airwall.png';

        // var afterMainInit = function () {
        //     navBar.initialize();
        //     mapPanel.initialize();
        //     mapExplorer.initialize();
        //     editor.game.fixFunctionInGameData();
        //     editor.main = main;
        //     editor.core = core;
        //     editor.fs = fs;
        //     editor_file = editor_file(editor, function () {
        //         editor.file = editor_file;
        //         editor_mode = editor_mode(editor);
        //         editor_unsorted_2_wrapper(editor_mode);
        //         editor.mode = editor_mode;
        //         core.resetGame(core.firstData.hero, null, core.firstData.floorId, core.clone(core.initStatus.maps));
        //         core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function () {
        //             afterCoreReset();
        //         }, true);
        //         core.events.setInitData(null);
        //     });
        // }

        // var afterCoreReset = function () {
            
        //     editor.game.idsInit(core.maps, core.icons.icons); // 初始化图片素材信息
        //     editor.drawInitData(core.icons.icons); // 初始化绘图

        //     editor.game.fetchMapFromCore();
        //     editor.updateMap();
        //     editor.buildMark();
        //     editor.drawEventBlock();
            
        //     editor.pos = {x: 0, y: 0};
        //     editor.mode.loc();
        //     editor.info = editor.ids[editor.indexs[201]];
        //     //editor.mode.enemyitem();
        //     editor.mode.floor();
        //     //editor.mode.tower();
        //     //editor.mode.functions();
        //     //editor.mode.commonevent();
        //     editor.mode.showMode('map');
            
        //     editor_multi = editor_multi();
        //     editor_blockly = editor_blockly();

        //     // --- 所有用到的flags
        //     editor.used_flags = {};
        //     for (var floorId in editor.main.floors) {
        //         editor.addUsedFlags(JSON.stringify(editor.main.floors[floorId]));
        //     }

        //     if (editor.useCompress == null) editor.useCompress = useCompress;
        //     if (Boolean(callback)) callback();

        // }
    }

    ////// 批量加载JS文件 //////
    loadJsByList(dir, loadList, callback) {
        // 加载js
        var instanceNum = 0;
        for (let i = 0; i < loadList.length; i++) {
            this.loadJs(dir, loadList[i], function () {
                instanceNum++;
                if (instanceNum === loadList.length) {
                    callback();
                }
            });
        }
    }

    ////// 加载单个JS文件 //////
    loadJs(dir, modName, callback) {
        var script = document.createElement('script');
        var name = modName;
        script.src = dir + '/' + modName + '.js';
        document.body.appendChild(script);
        script.onload = function () {
            callback(name);
        }
    }
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    var message;
    if (string.indexOf(substring) > -1){
        message = 'Script Error: See Browser Console for Detail';
    } else {
        if (url) url = url.substring(url.lastIndexOf('/')+1);
        message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');
        // alert(message);
    }
    try {
        printe(message)
    } catch (e) {
        alert(message);
    }
    return false;
};

// 兼容
var main = {
    floors: {},
    log: function (e) {
        if (e) {
            if (main.core && main.core.platform && !main.core.platform.isPC) {
                console.log((e.stack || e.toString()));
            }
            else {
                console.log(e);
            }
        }
    },
};

editor = new editor();