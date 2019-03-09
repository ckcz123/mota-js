/**
 * 初始化 start
 */

"use strict";

function core() {
    this.material = {
        'animates': {},
        'images': {},
        'bgms': {},
        'sounds': {},
        'ground': null,
        'items': {},
        'enemys': {},
        'icons': {},
        'events': {}
    }
    this.timeout = {
        'getItemTipTimeout': null,
        'turnHeroTimeout': null,
        'onDownTimeout': null,
        'sleepTimeout': null,
    }
    this.interval = {
        'heroMoveInterval': null,
        "tipAnimate": null,
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
            'level': 0,
            'nodes': [],
            'data': null,
            'fog': null,
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
        'volume': 1.0, // 音量
        'cachedBgms': [], // 缓存BGM内容
        'cachedBgmCount': 4, // 缓存的bgm数量
    }
    this.platform = {
        'isOnline': true, // 是否http
        'isPC': true, // 是否是PC
        'isAndroid': false, // 是否是Android
        'isIOS': false, // 是否是iOS
        'isWeChat': false, // 是否是微信
        'isQQ': false, // 是否是QQ
        'isChrome': false, // 是否是Chrome
        'supportCopy': false, // 是否支持复制到剪切板
        'useLocalForage': true,
        'extendKeyboard': false,

        'fileInput': null, // FileInput
        'fileReader': null, // 是否支持FileReader
        'successCallback': null, // 读取成功
        'errorCallback': null, // 读取失败
    }
    // 样式
    this.domStyle = {
        styles: [],
        scale: 1.0,
        screenMode: null,
        isVertical: false,
        toolbarBtn: false,
        showStatusBar: true,
    }
    this.bigmap = {
        canvas: ["bg", "event", "event2", "fg", "damage"],
        offsetX: 0, // in pixel
        offsetY: 0,
        width: 15, // map width and height
        height: 15,
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
        }
    }
    this.initStatus = {
        'played': false,
        'gameOver': false,

        // 勇士属性
        'hero': {},

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
        'textAttribute': {
            'position': "center",
            "offset": 0,
            "title": [255,215,0,1],
            "background": [0,0,0,0.85],
            "text": [255,255,255,1],
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
        'isSkiing': false,

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

    for (var key in coreData) {
        core[key] = coreData[key];
    }
    core.flags = core.clone(core.data.flags);
    core.values = core.clone(core.data.values);
    core.firstData = core.data.getFirstData();

    if (!core.flags.enableExperience)
        core.flags.enableLevelUp = false;
    if (!core.flags.enableLevelUp)
        core.flags.levelUpLeftMode = false;

    if (core.isset(core.firstData.shops)) {
        core.firstData.shops.forEach(function (t) {
            core.initStatus.shops[t.id] = t;
        })
    }

    core.dom.versionLabel.innerHTML = core.firstData.version;
    core.dom.logoLabel.innerHTML = core.firstData.title;
    document.title = core.firstData.title + " - HTML5魔塔";
    document.getElementById("startLogo").innerHTML = core.firstData.title;
    core.material.items = core.items.getItems();
    core.material.enemys = core.clone(core.enemys.getEnemys());
    core.material.icons = core.icons.getIcons();
    core.material.events = core.events.getEvents();

    core.platform.isOnline = location.protocol.indexOf("http")==0;
    if (core.platform.isOnline) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        try {
            core.musicStatus.audioContext = new window.AudioContext();
            core.musicStatus.gainNode = core.musicStatus.audioContext.createGain();
            core.musicStatus.gainNode.connect(core.musicStatus.audioContext.destination);
        } catch (e) {
            console.log("该浏览器不支持AudioContext");
            core.musicStatus.audioContext = null;
        }
    }

    ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"].forEach(function (t) {
        if (navigator.userAgent.indexOf(t)>=0) {
            if (t=='iPhone' || t=='iPad' || t=='iPod') core.platform.isIOS = true;
            if (t=='Android') core.platform.isAndroid=true;
            core.platform.isPC=false;
        }
    });

    try {
        core.platform.supportCopy = document.queryCommandSupported("copy");
    }
    catch (e) {
        core.platform.supportCopy = false;
    }

    var chrome=/Chrome\/(\d+)\./i.exec(navigator.userAgent);
    if (core.isset(chrome) && parseInt(chrome[1])>=50)
        core.platform.isChrome = true;
    core.platform.isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    core.platform.isQQ = /QQ/i.test(navigator.userAgent);
    core.platform.isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    core.platform.useLocalForage = core.getLocalStorage('useLocalForage', !core.platform.isIOS);
    if (core.platform.useLocalForage) {
        try {
            core.setLocalForage("__test__", lzw_encode("__test__"), function() {
                try {
                    core.getLocalForage("__test__", null, function(data) {
                        try {
                            if (lzw_decode(data)!="__test__") {
                                console.log("localForage unsupported!");
                                core.platform.useLocalForage=false;
                            }
                            else {
                                console.log("localForage supported!")
                                core.removeLocalForage("__test__");
                            }
                        }
                        catch (e) {main.log(e); core.platform.useLocalForage=false;}
                    }, function(e) {main.log(e); core.platform.useLocalForage=false;})
                }
                catch (e) {main.log(e); core.platform.useLocalForage=false;}
            }, function(e) {main.log(e); core.platform.useLocalForage=false;})
        }
        catch (e) {main.log(e); core.platform.useLocalForage=false;}
    }

    core.platform.extendKeyboard = core.getLocalStorage("extendKeyboard", false);

    if (window.FileReader) {
        core.platform.fileReader = new FileReader();
        core.platform.fileReader.onload = function () {
            core.readFileContent(core.platform.fileReader.result);
        };
        core.platform.fileReader.onerror = function () {
            if (core.isset(core.platform.errorCallback))
                core.platform.errorCallback();
        }
    }

    // 先从存储中读取BGM状态
    core.musicStatus.bgmStatus = core.getLocalStorage('bgmStatus', true);
    if (!core.platform.isPC && (navigator.connection||{}).type!='wifi')
        core.musicStatus.bgmStatus = false;
    core.musicStatus.soundStatus = core.getLocalStorage('soundStatus', true);

    // switchs
    core.flags.displayEnemyDamage = core.getLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
    core.flags.displayCritical = core.getLocalStorage('critical', core.flags.displayCritical);
    core.flags.displayExtraDamage = core.getLocalStorage('extraDamage', core.flags.displayExtraDamage);

    core.material.groundCanvas = document.createElement('canvas').getContext('2d');
    core.material.groundCanvas.canvas.width = core.material.groundCanvas.canvas.height = 32;
    core.material.groundPattern = core.material.groundCanvas.createPattern(core.material.groundCanvas.canvas, 'repeat');

    core.animateFrame.weather.fog = new Image();
    core.animateFrame.weather.fog.onerror = function () {
        core.animateFrame.weather.fog = null;
    }
    core.animateFrame.weather.fog.src = "project/images/fog.png";

    core.material.images.keyboard = new Image();
    core.material.images.keyboard.onerror  = function () {
        core.material.images.keyboard = null;
    }
    core.material.images.keyboard.src = "project/images/keyboard.png";

    core.bigmap.tempCanvas = document.createElement('canvas').getContext('2d');

    ////// 记录所有的存档编号！！！ //////
    core.saves.saveIndex = core.getLocalStorage('saveIndex', 1);
    core.control.getSaveIndexes(function (indexes) {
        core.saves.ids = indexes;
    });

    core.loader._load(function () {
        console.log(core.material);
        // 设置勇士高度
        core.material.icons.hero.height = core.material.images.hero.height/4;
        // 行走图
        core.control.updateHeroIcon();

        core.initStatus.maps = core.maps.initMaps(core.floorIds);
        core.setRequestAnimationFrame();

        if (main.mode=='play')
            core.events.initGame();

        if (core.isset(functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.plugins)) {
            core.plugin = new function () {
                this.__renderFrameFuncs = [];
            };
            core.plugin.__init__ = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.plugins.plugin;
            core.plugin.__init__();
        }

        core.showStartAnimate();

        if (core.isset(callback)) callback();

    });
}

core.prototype._forwardFuncs = function () {
    var list = {};
    for (var i = 0; i < main.loadList.length; ++i) {
        var name = main.loadList[i];
        if (name == 'core') continue;
        for (var funcname in core[name]) {
            if (funcname.charAt(0) != "_" && core[name][funcname] instanceof Function) {
                if (list[funcname]) {
                    main.log("Error forward: "+name+"."+funcname);
                }
                else {
                    list[funcname] = name;
                }
            }
        }
    }
    for (var funcname in list) {
        this._forwardFunc(list[funcname], funcname);
    }
}

core.prototype._forwardFunc = function (name, funcname) {
    if (core[funcname]) {
        main.log("Error in forwarding "+funcname+" from "+name+"!");
        return;
    }
    var parameterInfo = /^\s*function\s*[\w_$]*\(([\w_,$\s]*)\)\s*\{/.exec(core[name][funcname].toString());
    var parameters = (parameterInfo==null?"":parameterInfo[1]).replace(/\s*/g, '').replace(/,/g, ', ');
    // core[funcname] = new Function(parameters, "return core."+name+"."+funcname+"("+parameters+");");
    eval("core."+funcname+" = function ("+parameters+") {\n\treturn core."+name+"."+funcname+"("+parameters+");\n}");
}

/**
 * 系统机制 end
 */

var core = new core();
