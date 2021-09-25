function editor() {
    this.version = "2.0";
    this.brushMod = "line";//["line","rectangle","tileset"]
    this.layerMod = "map";//["fgmap","map","bgmap"]
    this.isMobile = false;

    this.dom={
        body:document.body,
        eui:document.getElementById('eui'),
        efg:document.getElementById('efg'),
        ebm:document.getElementById('ebm'),
        euiCtx:document.getElementById('eui').getContext('2d'),
        efgCtx:document.getElementById('efg').getContext('2d'),
        ebmCtx:document.getElementById('ebm').getContext('2d'),
        mid:document.getElementById('mid'),
        mapEdit:document.getElementById('mapEdit'),
        selectFloor:document.getElementById('selectFloor'),
        iconExpandBtn :document.getElementById('iconExpandBtn'),
        dataSelection : document.getElementById('dataSelection'),
        iconLib:document.getElementById('iconLib'),
        midMenu:document.getElementById('midMenu'),
        extraEvent: document.getElementById('extraEvent'),
        chooseThis : document.getElementById('chooseThis'),
        chooseInRight : document.getElementById('chooseInRight'),
        copyLoc : document.getElementById('copyLoc'),
        pasteLoc : document.getElementById('pasteLoc'),
        clearEvent : document.getElementById('clearEvent'),
        clearLoc : document.getElementById('clearLoc'),
        brushMod:document.getElementById('brushMod'),
        brushMod2:document.getElementById('brushMod2'),
        brushMod3:document.getElementById('brushMod3'),
        brushMod4:document.getElementById('brushMod4'),
        layerMod:document.getElementById('layerMod'),
        layerMod2:document.getElementById('layerMod2'),
        layerMod3:document.getElementById('layerMod3'),
        viewportButtons:document.getElementById('viewportButtons'),
        appendPicCanvas : document.getElementById('appendPicCanvas'),
        appendBgCtx : document.getElementById('appendPicCanvas').children[0].getContext('2d'),
        appendSource : document.getElementById('appendPicCanvas').children[1],
        appendPicClick : document.getElementById('appendPicCanvas').children[2],
        appendSprite : document.getElementById('appendPicCanvas').children[3],
        appendSourceCtx:document.getElementById('appendPicCanvas').children[1].getContext('2d'),
        appendSpriteCtx:document.getElementById('appendPicCanvas').children[3].getContext('2d'),
        appendPicSelection : document.getElementById('appendPicSelection'),
        selectAppend : document.getElementById('selectAppend'),
        selectFileBtn :document.getElementById('selectFileBtn'),
        changeFloorId :document.getElementById('changeFloorId'),
        changeFloorSize: document.getElementById('changeFloorSize'),
        left1 : document.getElementById('left1'),
        editModeSelect :document.getElementById('editModeSelect'),
        mid2 : document.getElementById('mid2'),
        clearLastUsedBtn: document.getElementById('clearLastUsedBtn'),
        lastUsedTitle: document.getElementById('lastUsedTitle'),
        lastUsedDiv: document.getElementById('lastUsedDiv'),
        lastUsed: document.getElementById('lastUsed'),
        lastUsedCtx: document.getElementById('lastUsed').getContext('2d'),
        showMovable: document.getElementById('showMovable'),
        gameInject: document.getElementById('gameInject'),
        undoFloor: document.getElementById('undoFloor'),
        selectFloorBtn: document.getElementById('selectFloorBtn'),
        editorTheme: document.getElementById('editorTheme'),
        bigmapBtn : document.getElementById('bigmapBtn'),
        mapRowMark: document.getElementById('mapRowMark'),
        mapColMark: document.getElementById('mapColMark'),
        maps: ['bgmap', 'fgmap', 'map'],
        canvas: ['bg', 'fg'],
    };

    this.uivalues={
        // 绘制区拖动有关
        holdingPath : 0,
        stepPostfix : null,//用于存放寻路检测的第一个点之后的后续移动
        mouseOutCheck : 2,
        startPos:null,
        endPos:null,
        lastMoveE:{buttons:0,clientX:0,clientY:0},
        selectedArea: null,
        // 材料区拖动有关
        lastMoveMaterE:null,
        tileSize: [1,1],
        startLoc: null,
        // 撤销/恢复
        preMapData : [],
        preMapMax: 10,
        postMapData: [],
        //
        shortcut:{},
        copyedInfo : null,
        // 折叠素材
        scrollBarHeight :0,
        folded:false,
        foldPerCol: 50,
        //
        ratio : 1,
        // 是否是大地图模式
        bigmap : false,
        bigmapInfo: {
            top: 0,
            left: 0,
            size: 32,
        },
        // blockly转义
        disableBlocklyReplace: false,
        // blockly展开比较
        disableBlocklyExpandCompare: false,

        // 绑定机关门事件相关
        bindSpecialDoor: {
            loc: null,
            n: -1,
            enemys: []
        },

        // 复制怪物或道具属性
        copyEnemyItem : {
            type: null,
            data: {}
        },

        // tile
        lockMode: false,
        
        showMovable: false,

        // 最近使用的图块
        lastUsedType: null,
        lastUsed: [],

        // 最近访问的楼层
        recentFloors: []
    };

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
}

editor.prototype.uifunctions={};

/* 
editor.loc
editor.pos
editor.info
始终是最后一次点击的结果
注意editor.info可能因为点击其他地方而被清空
*/

/////////// 数据相关 ///////////

editor.prototype.init = function (callback) {

    editor.airwallImg = new Image();
    editor.airwallImg.src = './project/materials/airwall.png';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'index.html', true);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert("HTTP " + xhr.status);
            return;
        }
        var str = xhr.response.split('<!-- injection -->');
        if (str.length != 3) window.onerror("index.html格式不正确");
        editor.dom.gameInject.innerHTML = str[1];
        
        var cvs = ['bg', 'event', 'event2', 'fg'].map(function(e) {
            return document.getElementById(e);
        });
        ['bg', 'ev', 'ev2', 'fg'].forEach(function(e, i) {
            editor.dom[e+'c'] = cvs[i];
            editor.dom[e+'Ctx'] = cvs[i].getContext('2d');
            
            editor.dom.mapEdit.insertBefore(cvs[i], editor.dom.ebm);
        });

        var mainScript = document.createElement('script');

        mainScript.onload = function() {
    
            var useCompress = main.useCompress;
            main.useCompress = false;
        
            main.init('editor', function () {
                editor_util_wrapper(editor);
                editor_game_wrapper(editor, main, core);
                editor_file_wrapper(editor);
                editor_table_wrapper(editor);
                editor_ui_wrapper(editor);
                editor_uievent_wrapper(editor);
                editor_mappanel_wrapper(editor);
                editor_datapanel_wrapper(editor);
                editor_materialpanel_wrapper(editor);
                editor_listen_wrapper(editor);
                editor.printe=printe;
                afterMainInit();
            });
        
            var afterMainInit = function () {
                editor.game.fixFunctionInGameData();
                editor.main = main;
                editor.core = core;
                editor.fs = fs;
                editor_file = editor_file(editor, function () {
                    editor.file = editor_file;
                    editor_mode = editor_mode(editor);
                    editor.mode = editor_mode;
                    var canvases = document.getElementsByClassName('gameCanvas');
                    for (var one in canvases) {
                        canvases[one].width = canvases[one].height = core.__PIXELS__;
                    }
                    core.resetGame(core.firstData.hero, null, core.firstData.floorId, core.cloneArray(core.initStatus.maps));
                    var floorId = editor.config.get('editorLastFloorId', core.status.floorId);
                    if (core.floorIds.indexOf(floorId) < 0) floorId = core.status.floorId;

                    core.status.floorId = floorId;
                    core.resizeMap(floorId);
                    core.clearMap('all');
                    core.generateGroundPattern(floorId);
                    core.extractBlocks(floorId);
                    core.status.thisMap = core.status.maps[floorId];
                    afterCoreReset();
                });
            }
        
            var afterCoreReset = function () {
                
                editor.game.idsInit(core.maps, core.icons.icons); // 初始化图片素材信息
                editor.drawInitData(core.icons.icons); // 初始化绘图
        
                editor.game.fetchMapFromCore();
                editor.pos = {x: 0, y: 0};
                editor.updateMap();
                editor.buildMark();
                var viewportLoc = editor.config.get('viewportLoc', []);
                editor.setViewport(viewportLoc[0] || 0, viewportLoc[1] || 0);
                editor.drawEventBlock();

                editor.mode.loc();
                editor.info = editor.ids[editor.indexs[201]];
                editor.mode.enemyitem();
                editor.mode.floor();
                editor.mode.tower();
                editor.mode.functions();
                editor.mode.commonevent();
                editor.mode.showMode('tower');
                
                editor_multi = editor_multi();
                editor_blockly = editor_blockly();
        
                // --- 所有用到的flags
                editor.used_flags = {};
                editor.addUsedFlags(JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d));
                // 楼层属性
                for (var floorId in editor.main.floors) {
                    editor.addUsedFlags(JSON.stringify(editor.main.floors[floorId]));
                }
                // 公共事件
                for (var name in events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent) {
                    editor.addUsedFlags(JSON.stringify(events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent[name]));
                }
                // 道具效果
                for (var id in items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a) {
                    editor.addUsedFlags(JSON.stringify(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id]));
                }
                // 全局商店
                editor.addUsedFlags(JSON.stringify(editor.main.core.firstData.shops));
                // 怪物战前战后
                for (var id in enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80) {
                    editor.addUsedFlags(JSON.stringify(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id]));
                }
                // 图块属性
                for (var id in maps_90f36752_8815_4be8_b32b_d7fad1d0542e) {
                    editor.addUsedFlags(JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e[id]));
                }
        
                if (editor.useCompress == null) editor.useCompress = useCompress;
                if (Boolean(callback)) callback();
        
            }
        }

        mainScript.id = "mainScript";
        mainScript.src = "main.js";
        editor.dom.gameInject.appendChild(mainScript);
    };
    xhr.onabort = xhr.ontimeout = xhr.onerror = function () {
        alert("无法访问index.html");
    }

    editor.config = new editor_config();
    editor.config.load(function() {
        var theme = editor.config.get('theme', 'editor_color');
        document.getElementById('color_css').href = '_server/css/' + theme + '.css';
        editor.dom.editorTheme.value = theme;
        xhr.send();
    });
}

editor.prototype.mapInit = function () {
    var ec = editor.dom.evCtx;
    ec.clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
    editor.dom.ev2Ctx.clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
    editor.map = [];
    var sy=editor.currentFloorData.map.length,sx=editor.currentFloorData.map[0].length;
    for (var y = 0; y < sy; y++) {
        editor.map[y] = [];
        for (var x = 0; x < sx; x++) {
            editor.map[y][x] = 0;
        }
    }
    editor.dom.maps.forEach(function (one) {
        editor.currentFloorData[one] = editor[one] = JSON.parse(JSON.stringify(editor.map));
    });
    editor.currentFloorData.firstArrive = [];
    editor.currentFloorData.eachArrive = [];
    editor.currentFloorData.events = {};
    editor.currentFloorData.autoEvent = {};
    editor.currentFloorData.changeFloor = {};
    editor.currentFloorData.beforeBattle = {};
    editor.currentFloorData.afterBattle = {};
    editor.currentFloorData.afterGetItem = {};
    editor.currentFloorData.afterOpenDoor = {};
    editor.currentFloorData.cannotMove = {};
}

editor.prototype.changeFloor = function (floorId, callback) {
    for(var ii=0,name;name=editor.dom.maps[ii];ii++){
        var mapArray=editor[name].map(function (v) {
            return v.map(function (v) {
                return v.idnum || v || 0
            })
        });
        editor.currentFloorData[name]=mapArray;
    }
    editor.uivalues.preMapData = [];
    editor.uivalues.postMapData = [];
    editor.uifunctions._extraEvent_bindSpecialDoor_doAction(true);

    core.status.floorId = floorId;
    core.resizeMap(floorId);
    core.clearMap('all');
    core.generateGroundPattern(floorId);
    core.extractBlocks(floorId);
    core.status.thisMap = core.status.maps[floorId];

    editor.game.fetchMapFromCore();
    editor.updateMap();
    editor_mode.floor();
    editor.drawEventBlock();

    editor.viewportLoc = editor.viewportLoc || {};
    var loc = editor.viewportLoc[floorId] || [], x = loc[0] || 0, y = loc[1] || 0;
    editor.setViewport(x, y);
    editor.uifunctions.unhighlightSaveFloorButton();
    editor.config.set('editorLastFloorId', floorId);
    if (callback) callback();
}

/////////// 游戏绘图相关 ///////////

editor.prototype.drawEventBlock = function () {
    var fg=editor.dom.efgCtx;

    fg.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
    if (editor.uivalues.bigmap) return this._drawEventBlock_bigmap();

    var firstData = editor.game.getFirstData();
    // 不可通行性
    var movableArray = {};
    if (editor.uivalues.showMovable) {
        movableArray = core.generateMovableArray() || {};
        fg.fillStyle = "rgba(0,0,0,0.4)";
        fg.fillRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        for (var i=0;i<core.__SIZE__;i++) {
            for (var j=0;j<core.__SIZE__;j++) {
                var x = i+core.bigmap.offsetX/32, y = j+core.bigmap.offsetY/32;
                var directions = (movableArray[x]||{})[y];
                if (directions == null) continue;
                if (!directions.includes('left') && x != 0) {
                    var ndirections = (movableArray[x-1]||{})[y];
                    if (ndirections != null && !ndirections.includes('right')) {
                        core.drawLine(fg, 32 * i + 1, 32 * j + 6, 32 * i + 1, 32 * j + 26, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, 32 * i + 1, 32 * j + 10, 32 * i + 1, 32 * j + 22, '#FF0000', 2);
                        core.fillPolygon(fg, [[32 * i + 9, 32 * j + 12], [32 * i + 1, 32 * j + 16], [32 * i + 9, 32 * j + 20]], '#FF0000');
                    }
                }
                if (!directions.includes('right') && x != editor.currentFloorData.width - 1) {
                    var ndirections = (movableArray[x+1]||{})[y];
                    if (ndirections != null && !ndirections.includes('left')) {
                        core.drawLine(fg, 32 * i + 31, 32 * j + 6, 32 * i + 31, 32 * j + 26, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, 32 * i + 31, 32 * j + 10, 32 * i + 31, 32 * j + 22, '#FF0000', 2);
                        core.fillPolygon(fg, [[32 * i + 23, 32 * j + 12], [32 * i + 31, 32 * j + 16], [32 * i + 23, 32 * j + 20]], '#FF0000');
                    }
                }
                if (!directions.includes('up') && y != 0) {
                    var ndirections = movableArray[x][y-1];
                    if (ndirections != null && !ndirections.includes('down')) {
                        core.drawLine(fg, 32 * i + 6, 32 * j + 1, 32 * i + 26, 32 * j + 1, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, 32 * i + 10, 32 * j + 1, 32 * i + 22, 32 * j + 1, '#FF0000', 2);
                        core.fillPolygon(fg, [[32 * i + 12, 32 * j + 9], [32 * i + 16, 32 * j + 1], [32 * i + 20, 32 * j + 9]], '#FF0000');
                    }
                }
                if (!directions.includes('down') && y != editor.currentFloorData.height - 1) {
                    var ndirections = movableArray[x][y+1];
                    if (ndirections != null && !ndirections.includes('up')) {
                        core.drawLine(fg, 32 * i + 6, 32 * j + 31, 32 * i + 26, 32 * j + 31, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, 32 * i + 10, 32 * j + 31, 32 * i + 22, 32 * j + 31, '#FF0000', 2);
                        core.fillPolygon(fg, [[32 * i + 12, 32 * j + 23], [32 * i + 16, 32 * j + 31], [32 * i + 20, 32 * j + 23]], '#FF0000');
                    }
                }
            }
        }
        return;
    }
    for (var i=0;i<core.__SIZE__;i++) {
        for (var j=0;j<core.__SIZE__;j++) {
            var x = i+core.bigmap.offsetX/32, y = j+core.bigmap.offsetY/32;
            var loc= x + ',' + y;
            if (editor.currentFloorId == firstData.floorId
                && loc == firstData.hero.loc.x + "," + firstData.hero.loc.y) {
                fg.textAlign = 'center';
                editor.game.doCoreFunc('fillBoldText', fg, 'S',
                    32 * i + 16, 32 * j + 28, '#FFFFFF', null, 'bold 30px Verdana');
            }
            var color = this._drawEventBlock_getColor(loc);
            for(var kk=0,cc;cc=color[kk];kk++){
                fg.fillStyle = cc;
                fg.fillRect(32*i+8*kk, 32*j+32-8, 8, 8);
            }
            var index = editor.uivalues.bindSpecialDoor.enemys.indexOf(loc);
            if (index >= 0) {
                fg.textAlign = 'right';
                editor.game.doCoreFunc("fillBoldText", fg, index + 1,
                    32 * i + 28, 32 * j + 15, '#FF7F00', null, '14px Verdana');
            }
            var offset = 0;
            if (editor.currentFloorData.upFloor && editor.currentFloorData.upFloor.toString() == loc) {
                fg.textAlign = 'left';
                editor.game.doCoreFunc("fillText", fg, "🔼", 32 * i + offset, 32 * j + 8, null, "8px Verdana");
                offset += 8;
            }
            if (editor.currentFloorData.downFloor && editor.currentFloorData.downFloor.toString() == loc) {
                fg.textAlign = 'left';
                editor.game.doCoreFunc("fillText", fg, "🔽", 32 * i + offset, 32 * j + 8, null, "8px Verdana");
                offset += 8;
            }
            if (editor.currentFloorData.flyPoint && editor.currentFloorData.flyPoint.toString() == loc) {
                fg.textAlign = 'left';
                editor.game.doCoreFunc("fillText", fg, "🔃", 32 * i + offset, 32 * j + 8, null, "8px Verdana");
                offset += 8;
            }
        }
    }
}

editor.prototype._drawEventBlock_bigmap = function () {
    var fg=editor.dom.efgCtx;
    var info = editor.uivalues.bigmapInfo, size = info.size, psize = size / 4;
    
    // 不可通行性
    var movableArray = {};
    if (editor.uivalues.showMovable) {
        movableArray = core.generateMovableArray() || {};
        fg.fillStyle = "rgba(0,0,0,0.4)";
        fg.fillRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        for (var i = 0; i < editor.currentFloorData.width; ++i) {
            for (var j = 0; j < editor.currentFloorData.height; ++j) {
                var directions = (movableArray[i]||{})[j];
                if (directions == null) continue;
                if (!directions.includes('left') && i != 0) {
                    var ndirections = (movableArray[i-1]||{})[j];
                    if (ndirections != null && !ndirections.includes('right')) {
                        core.drawLine(fg, info.left + size * i, info.top + size * j + size / 4, info.left + size * i, info.top + size * j + size * 3 / 4, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, info.left + size * i, info.top + size * j + size / 3, info.left + size * i, info.top + size * j + size * 2 / 3, '#FF0000', 2);
                        core.fillPolygon(fg, [[info.left + size * i + size / 4, info.top + size * j + size * 3 / 8], 
                                            [info.left + size * i, info.top + size * j + size / 2], 
                                            [info.left + size * i + size / 4, info.top + size * j + size * 5 / 8]], '#FF0000');
                    }
                }
                if (!directions.includes('right') && i != editor.currentFloorData.width - 1) {
                    var ndirections = (movableArray[i+1]||{})[j];
                    if (ndirections != null && !ndirections.includes('left')) {
                        core.drawLine(fg, info.left + size * i + size, info.top + size * j + size / 4, info.left + size * i + size, info.top + size * j + size * 3 / 4, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, info.left + size * i + size, info.top + size * j + size / 3, info.left + size * i + size, info.top + size * j + size * 2 / 3, '#FF0000', 2);
                        core.fillPolygon(fg, [[info.left + size * i + size * 3 / 4, info.top + size * j + size * 3 / 8], 
                            [info.left + size * i + size, info.top + size * j + size / 2], 
                            [info.left + size * i + size * 3 / 4, info.top + size * j + size * 5 / 8]], '#FF0000');
                    }
                }
                if (!directions.includes('up') && j != 0) {
                    var ndirections = movableArray[i][j-1];
                    if (ndirections != null && !ndirections.includes('down')) {
                        core.drawLine(fg, info.left + size * i + size / 4, info.top + size * j, info.left + size * i + size * 3 / 4, info.top + size * j, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, info.left + size * i + size / 3, info.top + size * j, info.left + size * i + size * 2 / 3, info.top + size * j, '#FF0000', 2);
                        core.fillPolygon(fg, [[info.left + size * i + size * 3 / 8, info.top + size * j + size / 4], 
                            [info.left + size * i + size / 2, info.top + size * j], 
                            [info.left + size * i + size * 5 / 8, info.top + size * j + size / 4]], '#FF0000');
                    }
                }
                if (!directions.includes('down') && j != editor.currentFloorData.height - 1) {
                    var ndirections = movableArray[i][j+1];
                    if (ndirections != null && !ndirections.includes('up')) {
                        core.drawLine(fg, info.left + size * i + size / 4, info.top + size * j + size, info.left + size * i + size * 3 / 4, info.top + size * j + size, '#FF0000', 2);
                    } else {
                        core.drawLine(fg, info.left + size * i + size / 3, info.top + size * j + size, info.left + size * i + size * 2 / 3, info.top + size * j + size, '#FF0000', 2);
                        core.fillPolygon(fg, [[info.left + size * i + size * 3 / 8, info.top + size * j + size  * 3 / 4], 
                            [info.left + size * i + size / 2, info.top + size * j + size], 
                            [info.left + size * i + size * 5 / 8, info.top + size * j + size * 3 / 4]], '#FF0000');
                    }
                }
            }
        }
        return;
    }

    for (var i = 0; i < editor.currentFloorData.width; ++i) {
        for (var j = 0; j < editor.currentFloorData.height; ++j) {
            var color = this._drawEventBlock_getColor(i+","+j);
            for(var kk=0,cc;cc=color[kk];kk++){
                fg.fillStyle = cc;
                fg.fillRect(info.left + size * i + psize * kk, info.top + size * (j + 1) - psize, psize, psize);
            }
        }
    }
}

editor.prototype._drawEventBlock_getColor = function (loc) {
    var color = [];
    if (editor.currentFloorData.events[loc])
        color.push('#FF0000');
    if (editor.currentFloorData.autoEvent[loc]) {
        var x = editor.currentFloorData.autoEvent[loc];
        for (var index in x) {
            if (x[index] && x[index].data) {
                color.push('#FFA500');
                break;
            }
        }
    }
    if (editor.currentFloorData.beforeBattle[loc])
        color.push('#0000FF');
    if (editor.currentFloorData.afterBattle[loc])
        color.push('#FFFF00');
    if (editor.currentFloorData.changeFloor[loc])
        color.push('#00FF00');
    if (editor.currentFloorData.afterGetItem[loc])
        color.push('#00FFFF');
    if (editor.currentFloorData.afterOpenDoor[loc])
        color.push('#FF00FF');
    return color;
}

editor.prototype.drawPosSelection = function () {
    this.drawEventBlock();
    var fg=editor.dom.efgCtx;
    fg.strokeStyle = 'rgba(255,255,255,0.7)';
    if (editor.uivalues.bigmap) {
        var info = editor.uivalues.bigmapInfo, size = info.size, psize = size / 8;
        fg.lineWidth = psize;
        fg.strokeRect(info.left + editor.pos.x * size + psize, info.top + editor.pos.y * size + psize, size - 2*psize, size - 2*psize);
    } else {
        fg.lineWidth = 4;
        fg.strokeRect(32*editor.pos.x - core.bigmap.offsetX + 4, 32*editor.pos.y - core.bigmap.offsetY + 4, 24, 24);
    }
}

editor.prototype._updateMap_bigmap = function () {
    var bm=editor.dom.ebmCtx;
    bm.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
    bm.fillStyle = '#000000';
    bm.fillRect(0, 0, core.__PIXELS__, core.__PIXELS__);
    core.drawThumbnail(editor.currentFloorId, null, {ctx: bm, all: true});
    var width = editor.currentFloorData.width;
    var height = editor.currentFloorData.height;
    editor.uivalues.bigmapInfo.top = core.__PIXELS__ * Math.max(0, (1 - height / width) / 2);
    editor.uivalues.bigmapInfo.left = core.__PIXELS__ * Math.max(0, (1 - width / height) / 2);
    editor.uivalues.bigmapInfo.size = core.__PIXELS__ / Math.max(width, height);
    this.drawEventBlock();
    this.updateLastUsedMap();
}

editor.prototype.updateMap = function () {
    var blocks =  core.maps._mapIntoBlocks(editor.map.map(function (v) {
        return v.map(function (v) {
            try {
                return v.idnum || v || 0
            }
            catch (e) {
                console.log("Unable to read idnum from "+v);
                return 0;
            }
        });
    }), null, editor.currentFloorId);
    core.status.thisMap.blocks = blocks;
    if (editor.uivalues.bigmap) return this._updateMap_bigmap();

    var updateMap = function () {
        core.removeGlobalAnimate();
        editor.dom.canvas.forEach(function (one) {
            core.clearMap(one);
        });
        core.clearMap('event');
        core.clearMap('event2');
        core.maps._drawMap_drawAll();
    }
    updateMap();

    var drawTile = function (ctx, x, y, tileInfo) { // 绘制一个普通块

        //ctx.clearRect(x*32, y*32, 32, 32);
        if (tileInfo == 0) return;

        if (typeof(tileInfo) == typeof([][0]) || !Object.prototype.hasOwnProperty.call(tileInfo, 'idnum')) {//未定义块画红块
            if (typeof(tileInfo) != typeof([][0]) && Object.prototype.hasOwnProperty.call(tileInfo, 'images')) {
                ctx.drawImage(core.material.images[tileInfo.images], 0, tileInfo.y * 32, 32, 32, x * 32, y * 32, 32, 32);
            }
            ctx.strokeStyle = 'red';
            var OFFSET = 2;
            ctx.lineWidth = OFFSET;
            ctx.strokeRect(x * 32 + OFFSET, y * 32 + OFFSET, 32 - OFFSET * 2, 32 - OFFSET * 2);
            ctx.font = "30px Verdana";
            ctx.textAlign = 'center';
            ctx.fillStyle = 'red';
            ctx.fillText("?", x * 32 + 16, y * 32 + 27);
            return;
        }
        //ctx.drawImage(core.material.images[tileInfo.images], 0, tileInfo.y*32, 32, 32, x*32, y*32, 32, 32);
    }
    if (editor.map.length * editor.map[0].length < 4096) {
        for (var y = 0; y < editor.map.length; y++) {
            for (var x = 0; x < editor.map[0].length; x++) {
                drawTile(editor.dom.evCtx, x, y, editor.map[y][x]);
                editor.dom.canvas.forEach(function (one) {
                    drawTile(editor.dom[one + 'Ctx'], x, y, editor[one+'map'][y][x]);
                });
            }
        }
    }

    // 绘制地图 end

    editor.drawEventBlock();
    this.updateLastUsedMap();
}

editor.prototype.setLastUsedType = function (type) {
    if (type == editor.uivalues.lastUsedType) return;
    editor.uivalues.lastUsedType = type;
    var _buildHtml = function (type, text) {
        if (type == null) return "<b>" + text + "</b>";
        else return `<a href="javascript:editor.setLastUsedType('${type}')">${text}</a>`;
    }
    editor.dom.lastUsedTitle.innerHTML
        = type == 'frequent' ? (_buildHtml('recent', '最近使用') + " | " + _buildHtml(null, '最常使用'))
        : (_buildHtml(null, '最近使用') + " | " + _buildHtml('frequent', '最常使用'));
    this.updateLastUsedMap();
    editor.dom.lastUsedDiv.scrollTop = 0;
}

editor.prototype.updateLastUsedMap = function () {
    var lastUsed = editor.uivalues.lastUsed.sort(function (a, b) {
        if ((a.istop || 0) != (b.istop || 0)) return (b.istop || 0) - (a.istop || 0);
        return (b[editor.uivalues.lastUsedType] || 0) - (a[editor.uivalues.lastUsedType] || 0);
    });

    // 绘制最近使用事件
    var ctx = editor.dom.lastUsedCtx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = 'rgba(255,128,0,0.85)';
    ctx.fillStyle = 'rgba(255,0,0,0.85)';
    ctx.lineWidth = 4;
    for (var i = 0; i < lastUsed.length; ++i) {
        try {
            var per_row = core.__SIZE__ - 1;
            var x = i % per_row, y = parseInt(i / per_row);
            var info = lastUsed[i];
            if (!info || !info.images) continue;
            if (info.isTile && core.material.images.tilesets[info.images]) {
                ctx.drawImage(core.material.images.tilesets[info.images], 32 * info.x, 32 * info.y, 32, 32, x*32, y*32, 32, 32);
            } else if (info.images == 'autotile' && core.material.images.autotile[info.id]) {
                ctx.drawImage(core.material.images.autotile[info.id], 0, 0, 32, 32, x * 32, y * 32, 32, 32);
            } else {
                var per_height = info.images.endsWith('48') ? 48 : 32;
                ctx.drawImage(core.material.images[info.images], 0, info.y * per_height, 32, per_height, x * 32, y * 32, 32, 32);
            }
            if (info.istop) {
                ctx.fillRect(32 * x, 32 * y + 24, 8, 8);
            }
            if (selectBox.isSelected() && editor.info.id == info.id) {
                ctx.strokeRect(32 * x + 2, 32 * y + 2, 28, 28);
            }
        } catch (e) {}
    }
}

editor.prototype.setViewport=function (x, y) {
    core.bigmap.offsetX = core.clamp(x, 0, 32*core.bigmap.width-core.__PIXELS__);
    core.bigmap.offsetY = core.clamp(y, 0, 32*core.bigmap.height-core.__PIXELS__);
    editor.viewportLoc = editor.viewportLoc || {};
    editor.viewportLoc[editor.currentFloorId] = [core.bigmap.offsetX, core.bigmap.offsetY];
    core.control.updateViewport();
    editor.config.set('viewportLoc', editor.viewportLoc[editor.currentFloorId]);
    editor.buildMark();
    editor.drawPosSelection();
}

editor.prototype.moveViewport=function(x,y){
    editor.setViewport(core.bigmap.offsetX+32*x, core.bigmap.offsetY+32*y);
    printi("你可以按【大地图】（或F键）快捷切换大地图模式");
}

/////////// 界面交互相关 ///////////

editor.prototype.drawInitData = function (icons) {
    var ratio = 1;
    var images = core.material.images;
    var maxHeight = 700;
    var sumWidth = 0;
    editor.widthsX = {};
    editor.uivalues.folded = editor.config.get('folded', false);
    // editor.uivalues.folded = true;
    editor.uivalues.foldPerCol = editor.config.get('foldPerCol', 50);
    // var imgNames = Object.keys(images);  //还是固定顺序吧；
    editor.setLastUsedType(editor.config.get('lastUsedType', 'recent'));
    var ids = editor.ids.map(function (x) {return x.id || "";});
    editor.uivalues.lastUsed = editor.config.get("lastUsed", []).filter(function (one) {
        return ids.indexOf(one.id) >= 0;
    });
    var imgNames = ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48", "autotile"];

    var splitCanvas = document.createElement('canvas');
    var splitCtx = splitCanvas.getContext('2d');
    splitCtx.imageSmoothingEnabled = false;

    var splitImage = function (image, width, height) {
        if (image.width == width && image.height == height) {
            return [image];
        }
        var ans = [];
        for (var j = 0; j < image.height; j += h) {
            var h = Math.min(height, image.height - j);
            splitCanvas.width = width;
            splitCanvas.height = h;
            core.drawImage(splitCtx, image, 0, j, width, h, 0, 0, width, h);
            var data = new Image();
            data.src = splitCanvas.toDataURL("image/png");
            ans.push(data);
        }
        return ans;
    }

    for (var ii = 0; ii < imgNames.length; ii++) {
        var img = imgNames[ii], tempy = 0;
        if (img == 'autotile') {
            var autotiles = images[img];
            for (var im in autotiles) {
                tempy += editor.uivalues.folded ? 32 : autotiles[im].height;
            }
            var tempx = editor.uivalues.folded ? 32 : 3 * 32;
            editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + tempx) / 32, tempy];
            sumWidth += tempx;
            maxHeight = Math.max(maxHeight, tempy);
            continue;
        }
        var width = images[img].width, height = images[img].height, mh = height;
        if (editor.uivalues.folded) {
            if (img == 'terrains') {
                width = Math.ceil((height / 32 + 2) / editor.uivalues.foldPerCol) * 32;
                if (width > 32) mh = 32 * editor.uivalues.foldPerCol;
            } else {
                var per_height = (img == 'enemy48' || img == 'npc48' ? 48 : 32);
                width = Math.ceil(height / per_height / editor.uivalues.foldPerCol) * 32;
                if (width > 32) mh = per_height * editor.uivalues.foldPerCol;
            }
        }
        editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + width) / 32, height];
        sumWidth += width;
        maxHeight = Math.max(maxHeight, mh + 64);
    }
    var tilesets = images.tilesets;
    for (var ii in core.tilesets) {
        var img = core.tilesets[ii];
        editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + tilesets[img].width) / 32, tilesets[img].height];
        sumWidth += tilesets[img].width;
        maxHeight = Math.max(maxHeight, tilesets[img].height);
    }

    var fullWidth = ~~(sumWidth * ratio);
    var fullHeight = ~~(maxHeight * ratio);

    /*
    if (fullWidth > edata.width) edata.style.width = (edata.width = fullWidth) / ratio + 'px';
    edata.style.height = (edata.height = fullHeight) / ratio + 'px';
    */
    var iconImages = document.getElementById('iconImages');
    iconImages.style.width = (iconImages.width = fullWidth) / ratio + 'px';
    iconImages.style.height = (iconImages.height = fullHeight) / ratio + 'px';
    document.body.ondrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
    document.body.ondragover = function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
    var drawImage = function (image, x, y, cls) {
        image.style.left = x + 'px';
        image.style.top = y + 'px';
        image.ondrop = (function (cls) { return function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (!cls) return false;
            var files = e.dataTransfer.files;
            if (files.length >= 1) {
                var file = files[0];
                if (file.type == 'image/png') {
                   editor.uifunctions.dragImageToAppend(file, cls);
                } else {
                    printe('只支持png图片的快速追加！');
                }
            }
            return false;
        }; })(cls);
        image.ondragover = function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            return false;
        }
        iconImages.appendChild(image);
    }

    var nowx = 0, nowy = 0;
    for (var ii = 0; ii < imgNames.length; ii++) {
        var img = imgNames[ii];
        if (img == 'terrains') {
            (function(image,nowx){
                if (image.complete) {
                    drawImage(image, nowx, 32);
                    core.material.images.airwall = image;
                    delete(editor.airwallImg);
                } else image.onload = function () {
                    drawImage(image, nowx, 32);
                    core.material.images.airwall = image;
                    delete(editor.airwallImg);
                    editor.updateMap();
                }
            })(editor.airwallImg,nowx);
            if (editor.uivalues.folded) {
                // --- 单列 & 折行
                var canvas = document.createElement("canvas");
                canvas.width = 32;
                canvas.height = images[img].height + 64;
                canvas.getContext('2d').drawImage(images[img], 0, 64);
                var subimgs = splitImage(canvas, 32, editor.uivalues.foldPerCol * 32);
                for (var i = 0; i < subimgs.length; i++) {
                    drawImage(subimgs[i], nowx, 0, img);
                    nowx += 32;
                }
            }
            else {
                drawImage(images[img], nowx, 32*2, img);
                nowx += images[img].width;
            }
            continue;
        }
        if (img == 'autotile') {
            var autotiles = images[img];
            var tempx = editor.uivalues.folded ? 32 : 96;
            for (var im in autotiles) {
                var tempy = editor.uivalues.folded ? 32 : autotiles[im].height;
                var subimgs = splitImage(autotiles[im], tempx, tempy);
                drawImage(subimgs[0], nowx, nowy, img);
                nowy += tempy;
            }
            nowx += tempx;
            continue;
        }
        if (editor.uivalues.folded) {
            // --- 单列 & 折行
            var per_height = img.endsWith('48') ? 48 : 32;
            var subimgs = splitImage(images[img], 32, editor.uivalues.foldPerCol * per_height);
            for (var i = 0; i < subimgs.length; i++) {
                drawImage(subimgs[i], nowx, 0, img);
                nowx += 32;
            }
        }
        else {
            drawImage(images[img], nowx, 0, img);
            nowx += images[img].width;
        }
    }
    for (var ii in core.tilesets) {
        var img = core.tilesets[ii];
        drawImage(tilesets[img], nowx, 0);
        nowx += tilesets[img].width;
    }
    //editor.mapInit();
}

editor.prototype.buildMark = function(){
    // 生成定位编号
    var arrColMark=document.getElementById('arrColMark');
    var arrRowMark=document.getElementById('arrRowMark');
    var mapColMark=document.getElementById('mapColMark');
    var mapRowMark=document.getElementById('mapRowMark');
    var buildMark = function (offsetX,offsetY) {
        var colNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<td>' + (i+offsetX) + '<div class="colBlock" style="left:' + (i * 32 + 1) + 'px;"></div></td>';
            colNum += tpl;
        }
        arrColMark.innerHTML = '<tr>' + colNum + '</tr>';
        mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
        var rowNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<tr><td>' + (i+offsetY) + '<div class="rowBlock" style="top:' + (i * 32 + 1) + 'px;"></div></td></tr>';
            rowNum += tpl;
        }
        arrRowMark.innerHTML = rowNum;
        mapRowMark.innerHTML = rowNum;
    }
    var buildMark_mobile = function (offsetX,offsetY) {
        var colNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<td>' + (' '+i).slice(-2).replace(' ','&nbsp;') + '<div class="colBlock" style="left:' + (i * 96/core.__SIZE__) + 'vw;"></div></td>';
            colNum += tpl;
        }
        arrColMark.innerHTML = '<tr>' + colNum + '</tr>';
        //mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
        var rowNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<tr><td>' + (' '+i).slice(-2).replace(' ','&nbsp;') + '<div class="rowBlock" style="top:' + (i * 96/core.__SIZE__) + 'vw;"></div></td></tr>';
            rowNum += tpl;
        }
        arrRowMark.innerHTML = rowNum;
        //mapRowMark.innerHTML = rowNum;
        //=====
        var colNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<div class="coltd" style="left:' + (i * 96/core.__SIZE__) + 'vw;"><div class="coltext">' + (' '+(i+offsetX)).slice(-2).replace(' ','&nbsp;') + '</div><div class="colBlock"></div></div>';
            colNum += tpl;
        }
        mapColMark.innerHTML = '<div class="coltr">' + colNum + '</div>';
        var rowNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<div class="rowtr"><div class="rowtd"  style="top:' + (i * 96/core.__SIZE__) + 'vw;"><div class="rowtext">' + (' '+(i+offsetY)).slice(-2).replace(' ','&nbsp;') + '</div><div class="rowBlock"></div></div></div>';
            rowNum += tpl;
        }
        mapRowMark.innerHTML = rowNum;
    }
    if(editor.isMobile){
        buildMark_mobile(core.bigmap.offsetX/32,core.bigmap.offsetY/32);
    } else {
        buildMark(core.bigmap.offsetX/32,core.bigmap.offsetY/32);
    }
}

editor.prototype.setSelectBoxFromInfo=function(thisevent, scrollTo){
    var pos={x: 0, y: 0, images: "terrains"};
    var ysize = 32;
    if(thisevent==0){
    } else if (thisevent.idnum==17){
        pos.y=1;
    } else {
        pos.x=editor.widthsX[thisevent.images][1];
        pos.y=thisevent.y;
        if(thisevent.x)pos.x+=thisevent.x;
        ysize = thisevent.images.endsWith('48') ? 48 : 32;
        if (editor.uivalues.folded && core.tilesets.indexOf(thisevent.images)==-1) {
            pos.x += Math.floor(pos.y / editor.uivalues.foldPerCol);
            pos.y %= editor.uivalues.foldPerCol;
        }
        if(pos.x == 0) pos.y+=2;
    }
    if (!editor.isMobile && scrollTo) {
        editor.dom.iconLib.scrollLeft = pos.x * 32 - editor.dom.iconLib.offsetWidth / 2;
        editor.dom.iconLib.scrollTop = pos.y * ysize - editor.dom.iconLib.offsetHeight / 2;
    }
    editor.dom.dataSelection.style.left = pos.x * 32 + 'px';
    editor.dom.dataSelection.style.top = pos.y * ysize + 'px';
    editor.dom.dataSelection.style.height = ysize - 6 + 'px';
    editor.dom.dataSelection.style.width = 32 - 6 + 'px';
    setTimeout(function(){
        selectBox.isSelected(true);
        editor.updateLastUsedMap();
    });
    editor.info = JSON.parse(JSON.stringify(thisevent));
    editor.pos=pos;
    editor_mode.onmode('nextChange');
    editor_mode.onmode('enemyitem');
    editor.uifunctions.showBlockInfo(JSON.parse(JSON.stringify(thisevent)));
}

editor.prototype.addUsedFlags = function (s) {
    s.replace(/flag:([a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]+)/g, function (s0, s1) {
        editor.used_flags[s1] = true; return s0;
    });
    s.replace(/flags\.([a-zA-Z_]\w*)/g, function (s0, s1) {
        editor.used_flags[s1] = true; return s0;
    });
    if (window.flags) {
        for (var s in editor.used_flags) {
            if (!(s in window.flags)) {
                window.flags[s] = null;
            }
        }
    }
}

editor.prototype.listen = function () {
    // 移动至 editor_listen.js
}//绑定事件

editor.prototype.mobile_listen=function(){
    // 移动至 editor_listen.js
}




editor = new editor();