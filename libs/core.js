/**
 * 初始化 start
 */

"use strict";

function core() {
    this.__SIZE__ = 13;
    this.__PIXELS__ = this.__SIZE__ * 32;
    this.__HALF_SIZE__ = Math.floor(this.__SIZE__ / 2);
    this.material = {
        'animates': {},
        'images': {},
        'bgms': {},
        'sounds': {},
        'ground': null,
        'items': {},
        'enemys': {},
        'icons': {},
    }
    this.timeout = {
        'turnHeroTimeout': null,
        'onDownTimeout': null,
        'sleepTimeout': null,
    }
    this.interval = {
        'heroMoveInterval': null,
        'onDownInterval': null,
    }
    this.animateFrame = {
        'totalTime': 0,
        'totalTimeStart': 0,
        'globalAnimate': false,
        'globalTime': 0,
        'selectorTime': 0,
        'selectorUp': true,
        'animateTime': 0,
        'moveTime': 0,
        'lastLegTime': 0,
        'leftLeg': true,
        'weather': {
            'time': 0,
            'type': null,
            'nodes': [],
            'data': null,
            'fog': null,
        },
        "tips": {
            'time': 0,
            'offset': 0,
            'list': [],
            'lastSize': 0,
        },
        "asyncId": {}
    }
    this.musicStatus = {
        'audioContext': null, // WebAudioContext
        'bgmStatus': false, // 是否播放BGM
        'soundStatus': true, // 是否播放SE
        'playingBgm': null, // 正在播放的BGM
        'lastBgm': null, // 上次播放的bgm
        'gainNode': null,
        'playingSounds': {}, // 正在播放的SE
        'userVolume': 1.0, // 用户音量
        'designVolume': 1.0, //设计音量
        'cachedBgms': [], // 缓存BGM内容
        'cachedBgmCount': 4, // 缓存的bgm数量
    }
    this.platform = {
        'isOnline': true, // 是否http
        'isPC': true, // 是否是PC
        'isAndroid': false, // 是否是Android
        'isIOS': false, // 是否是iOS
        'string': 'PC',
        'isWeChat': false, // 是否是微信
        'isQQ': false, // 是否是QQ
        'isChrome': false, // 是否是Chrome
        'supportCopy': false, // 是否支持复制到剪切板
        'useLocalForage': true,

        'fileInput': null, // FileInput
        'fileReader': null, // 是否支持FileReader
        'successCallback': null, // 读取成功
        'errorCallback': null, // 读取失败
    }
    // 样式
    this.domStyle = {
        scale: 1.0,
        isVertical: false,
        showStatusBar: true,
        toolbarBtn: false,
    }
    this.bigmap = {
        canvas: ["bg", "event", "event2", "fg", "damage"],
        offsetX: 0, // in pixel
        offsetY: 0,
        width: this.__SIZE__, // map width and height
        height: this.__SIZE__,
        tempCanvas: null, // A temp canvas for drawing
    }
    this.paint = {};
    this.saves = {
        "saveIndex": null,
        "ids": {},
        "autosave": {
            "data": null,
            "time": 0,
            "updated": false,
            "storage": true, // 是否把自动存档写入文件a
            "max": 10, // 自动存档最大回退数
        },
        "favorite": [],
        "favoriteName": {}
    }
    this.initStatus = {
        'played': false,
        'gameOver': false,

        // 勇士属性
        'hero': {},
        'heroCenter': {'px': null, 'py': null},

        // 当前地图
        'floorId': null,
        'thisMap': null,
        'maps': null,
        'bgmaps': {},
        'fgmaps': {},
        'checkBlock': {}, // 显伤伤害

        'lockControl': false,

        // 勇士移动状态
        'heroMoving': 0,
        'heroStop': true,

        // 自动寻路相关
        'automaticRoute': {
            'autoHeroMove': false,
            'autoStep': 0,
            'movedStep': 0,
            'destStep': 0,
            'destX': null,
            'destY': null,
            'offsetX': null,
            'offsetY': null,
            'autoStepRoutes': [],
            'moveStepBeforeStop': [],
            'lastDirection': null,
            'cursorX': null,
            'cursorY': null,
            "moveDirectly": false,
        },

        // 按下键的时间：为了判定双击
        'downTime': null,
        'ctrlDown': false,

        // 路线&回放
        'route': [],
        'replay': {
            'replaying': false,
            'pausing': false,
            'animate': false, // 正在某段动画中
            'toReplay': [],
            'totalList': [],
            'speed': 1.0,
            'steps': 0,
            'save': [],
        },

        // event事件
        'shops': {},
        'event': {
            'id': null,
            'data': null,
            'selection': null,
            'ui': null,
            'interval': null,
        },
        'autoEvents': [],
        'textAttribute': {
            'position': "center",
            "offset": 0,
            "title": [255, 215, 0, 1],
            "background": [0, 0, 0, 0.85],
            "text": [255, 255, 255, 1],
            "titlefont": 22,
            "textfont": 16,
            "bold": false,
            "time": 0,
        },
        "globalAttribute": {
            'equipName': main.equipName || [],
            "statusLeftBackground": main.statusLeftBackground || "url(project/images/ground.png) repeat",
            "statusTopBackground": main.statusTopBackground || "url(project/images/ground.png) repeat",
            "toolsBackground": main.toolsBackground || "url(project/images/ground.png) repeat",
            "borderColor": main.borderColor || "white",
            "statusBarColor": main.statusBarColor || "white",
            "hardLabelColor": main.hardLabelColor || "red",
            "floorChangingBackground": main.floorChangingBackground || "black",
            "floorChangingTextColor": main.floorChangingTextColor || "white",
            "font": main.font || "Verdana"
        },
        'curtainColor': null,
        'openingDoor': null,

        // 动画
        'globalAnimateObjs': [],
        'floorAnimateObjs': [],
        'boxAnimateObjs': [],
        'autotileAnimateObjs': {"blocks": [], "map": null, "bgmap": null, "fgmap": null},
        "globalAnimateStatus": 0,
        'animateObjs': [],
    };
    this.status = {};
    this.dymCanvas = {};
}

/////////// 系统事件相关 ///////////

////// 初始化 //////
core.prototype.init = function (coreData, callback) {
    this._forwardFuncs();
    for (var key in coreData)
        core[key] = coreData[key];
    this._init_flags();
    this._init_platform();
    this._init_others();
    this._initPlugins();

    core.loader._load(function () {
        core.extensions._load(function () {
            core._afterLoadResources(callback);
        });
    });
}

core.prototype._init_flags = function () {
    core.flags = core.clone(core.data.flags);
    core.values = core.clone(core.data.values);
    core.firstData = core.clone(core.data.firstData);
    this._init_sys_flags();

    core.dom.versionLabel.innerText = core.firstData.version;
    core.dom.logoLabel.innerText = core.firstData.title;
    document.title = core.firstData.title + " - HTML5魔塔";
    document.getElementById("startLogo").innerText = core.firstData.title;
    (core.firstData.shops||[]).forEach(function (t) { core.initStatus.shops[t.id] = t; });
    // 初始化自动事件
    for (var floorId in core.floors) {
        var autoEvents = core.floors[floorId].autoEvent || {};
        for (var loc in autoEvents) {
            var locs = loc.split(","), x = parseInt(locs[0]), y = parseInt(locs[1]);
            for (var index in autoEvents[loc]) {
                var autoEvent = core.clone(autoEvents[loc][index]);
                if (autoEvent && autoEvent.condition && autoEvent.data) {
                    autoEvent.floorId = floorId;
                    autoEvent.x = x;
                    autoEvent.y = y;
                    autoEvent.index = index;
                    autoEvent.symbol = floorId + "@" + x + "@" + y + "@" + index;
                    autoEvent.condition = core.replaceValue(autoEvent.condition);
                    autoEvent.data = core.precompile(autoEvent.data);
                    core.initStatus.autoEvents.push(autoEvent);
                }
            }
        }
    }
    core.initStatus.autoEvents.sort(function (e1, e2) {
        if (e1.priority != e2.priority) return e2.priority - e1.priority;
        if (e1.floorId != e2.floorId) return core.floorIds.indexOf(e1.floorId) - core.floorIds.indexOf(e2.floorId);
        if (e1.x != e2.x) return e1.x - e2.x;
        if (e1.y != e2.y) return e1.y - e2.y;
        return e1.index - e2.index;
    })

    core.maps._setFloorSize();
    // 初始化怪物、道具等
    core.material.enemys = core.enemys.getEnemys();
    core.material.items = core.items.getItems();
    core.items._resetItems();
    core.material.icons = core.icons.getIcons();
}

core.prototype._init_sys_flags = function () {
    if (!core.flags.enableExperience) core.flags.enableLevelUp = false;
    if (!core.flags.enableLevelUp) core.flags.levelUpLeftMode = false;
    if (core.flags.equipboxButton) core.flags.equipment = true;
    core.flags.displayEnemyDamage = core.getLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
    core.flags.displayCritical = core.getLocalStorage('critical', core.flags.displayCritical);
    core.flags.displayExtraDamage = core.getLocalStorage('extraDamage', core.flags.displayExtraDamage);
    // 行走速度
    core.values.moveSpeed = core.getLocalStorage('moveSpeed', core.values.moveSpeed);
}

core.prototype._init_platform = function () {
    core.platform.isOnline = location.protocol.indexOf("http") == 0;
    if (!core.platform.isOnline) alert("请勿直接打开html文件！使用启动服务或者APP进行离线游戏。");
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    try {
        core.musicStatus.audioContext = new window.AudioContext();
        core.musicStatus.gainNode = core.musicStatus.audioContext.createGain();
        core.musicStatus.gainNode.connect(core.musicStatus.audioContext.destination);
    } catch (e) {
        console.log("该浏览器不支持AudioContext");
        core.musicStatus.audioContext = null;
    }
    core.musicStatus.bgmStatus = core.getLocalStorage('bgmStatus', true);
    core.musicStatus.soundStatus = core.getLocalStorage('soundStatus', true);
    //新增 userVolume 默认值1.0
    core.musicStatus.userVolume = core.getLocalStorage('userVolume', 1.0);
    ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"].forEach(function (t) {
        if (navigator.userAgent.indexOf(t) >= 0) {
            if (t == 'iPhone' || t == 'iPad' || t == 'iPod') core.platform.isIOS = true;
            if (t == 'Android') core.platform.isAndroid = true;
            core.platform.isPC = false;
        }
    });
    core.platform.string = core.platform.isPC ? "PC" : core.platform.isAndroid ? "Android" : core.platform.isIOS ? "iOS" : "";
    core.platform.supportCopy = document.queryCommandSupported && document.queryCommandSupported("copy");
    var chrome = /Chrome\/(\d+)\./i.exec(navigator.userAgent);
    if (chrome && parseInt(chrome[1]) >= 50) core.platform.isChrome = true;
    core.platform.isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    core.platform.isQQ = /QQ/i.test(navigator.userAgent);
    core.platform.isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    this._init_checkLocalForage();
    if (window.FileReader) {
        core.platform.fileReader = new FileReader();
        core.platform.fileReader.onload = function () {
            core.readFileContent(core.platform.fileReader.result);
        };
        core.platform.fileReader.onerror = function () {
            if (core.platform.errorCallback)
                core.platform.errorCallback();
        }
    }
}

core.prototype._init_checkLocalForage = function () {
    core.platform.useLocalForage = core.getLocalStorage('useLocalForage', true);
    var _error = function (e) {
        main.log(e);
        core.platform.useLocalForage = false;
    };
    if (core.platform.useLocalForage) {
        try {
            core.setLocalForage("__test__", lzw_encode("__test__"), function () {
                try {
                    core.getLocalForage("__test__", null, function (data) {
                        try {
                            if (lzw_decode(data) != "__test__") {
                                console.log("localForage unsupported!");
                                core.platform.useLocalForage = false;
                            }
                            else {
                                console.log("localForage supported!");
                                core.removeLocalForage("__test__");
                            }
                        }
                        catch (e) {_error(e);}
                    }, _error)
                }
                catch (e) {_error(e);}
            }, _error)
        }
        catch (e) {_error(e);}
    }
}

core.prototype._init_others = function () {
    // 一些额外的东西
    core.material.groundCanvas = document.createElement('canvas').getContext('2d');
    core.material.groundCanvas.canvas.width = core.material.groundCanvas.canvas.height = 32;
    core.material.groundPattern = core.material.groundCanvas.createPattern(core.material.groundCanvas.canvas, 'repeat');
    core.bigmap.tempCanvas = document.createElement('canvas').getContext('2d');
    core.loadImage('fog', function (name, img) { core.animateFrame.weather.fog = img; });
    core.loadImage('keyboard', function (name, img) {core.material.images.keyboard = img; });
    // 记录存档编号
    core.saves.saveIndex = core.getLocalStorage('saveIndex', 1);
    core.control.getSaveIndexes(function (indexes) { core.saves.ids = indexes; });
}

core.prototype._afterLoadResources = function (callback) {
    // 初始化地图
    core.initStatus.maps = core.maps._initMaps();
    core.control._setRequestAnimationFrame();
    if (core.plugin._afterLoadResources)
        core.plugin._afterLoadResources();
    core.showStartAnimate();
    if (callback) callback();
}

core.prototype._initPlugins = function () {
    core.plugin = new function () {};

    for (var name in plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1) {
        if (plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1[name] instanceof Function) {
            try {
                plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1[name].apply(core.plugin);
            }
            catch (e) {
                main.log(e);
                main.log("无法初始化插件"+name);
            }
        }
    }

    core._forwardFunc("plugin");
}

core.prototype._forwardFuncs = function () {
    for (var i = 0; i < main.loadList.length; ++i) {
        var name = main.loadList[i];
        if (name == 'core') continue;
        this._forwardFunc(name);
    }
}

core.prototype._forwardFunc = function (name, funcname) {
    if (funcname == null) {
        for (funcname in core[name]) {
            if (funcname.charAt(0) != "_" && core[name][funcname] instanceof Function) {
                this._forwardFunc(name, funcname);
            }
        }
        return;
    }

    if (core[funcname]) {
        console.error("ERROR: 无法转发 "+name+" 中的函数 "+funcname+" 到 core 中！同名函数已存在。");
        return;
    }
    var parameterInfo = /^\s*function\s*[\w_$]*\(([\w_,$\s]*)\)\s*\{/.exec(core[name][funcname].toString());
    var parameters = (parameterInfo == null ? "" : parameterInfo[1]).replace(/\s*/g, '').replace(/,/g, ', ');
    // core[funcname] = new Function(parameters, "return core."+name+"."+funcname+"("+parameters+");");
    eval("core." + funcname + " = function (" + parameters + ") {\n\treturn core." + name + "." + funcname + "(" + parameters + ");\n}");
    if (name == 'plugin') {
        main.log("插件函数转发：core."+funcname+" = core.plugin."+funcname);
    }
}

core.prototype.doFunc = function (func, _this) {
    if (typeof func == 'string') {
        func = core.plugin[func];
        _this = core.plugin;
    }
    return func.apply(_this, Array.prototype.slice.call(arguments, 2));
}

/**
 * 系统机制 end
 */

var core = new core();
