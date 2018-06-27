/**
 * 初始化 start
 */

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
    }
    this.interval = {
        'heroMoveInterval': null,
        "tipAnimate": null,
        'openDoorAnimate': null,
        'animateInterval': null,
        'onDownInterval': null,
    }
    this.animateFrame = {
        'background': null,
        'globalAnimate': false,
        'globalTime': null,
        'boxTime': null,
        'moveTime': null,
        'speed': null,
        'weather': {
            'time': null,
            'type': null,
            'level': 0,
            'nodes': [],
            'data': null,
        }
    }
    this.musicStatus = {
        'audioContext': null, // WebAudioContext
        'startDirectly': false, // 是否直接播放（加载）音乐
        'bgmStatus': false, // 是否播放BGM
        'soundStatus': true, // 是否播放SE
        'playingBgm': null, // 正在播放的BGM
        'isPlaying': false,
        'gainNode': null,
        'volume': 1.0, // 音量
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

        'fileInput': null, // FileInput
        'fileReader': null, // 是否支持FileReader
        'successCallback': null, // 读取成功
        'errorCallback': null, // 读取失败
    }
    // 样式
    this.domStyle = {
        styles: [],
        scale: 1.0,
    }
    this.initStatus = {
        'played': false,

        // 勇士属性
        'hero': {},

        // 当前地图
        'floorId': null,
        'thisMap': null,
        'maps': null,
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
            'autoStepRoutes': [],
            'moveStepBeforeStop': [],
            'lastDirection': null,
            'cursorX': null,
            'cursorY': null,
            "moveDirectly": false,
            'clickMoveDirectly': false,
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
        'saveIndex': null,
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
            "title": [255,215,0,1],
            "background": [0,0,0,0.85],
            "text": [255,255,255,1],
            "bold": false,
            "time": 0,
        },
        'curtainColor': null,
        'usingCenterFly':false,
        'openingDoor': null,

        // 动画
        'globalAnimateObjs': [],
        'boxAnimateObjs': [],
    };
    this.status = {};
}

/////////// 系统事件相关 ///////////

////// 初始化 //////
core.prototype.init = function (coreData, callback) {
    for (var key in coreData) {
        core[key] = coreData[key];
    }
    core.flags = core.clone(core.data.flags);
    core.values = core.clone(core.data.values);
    core.firstData = core.data.getFirstData();

    if (!core.flags.enableExperience)
        core.flags.enableLevelUp = false;
    if (!core.flags.canOpenBattleAnimate) {
        core.flags.showBattleAnimateConfirm = false;
        core.flags.battleAnimate = false;
        core.setLocalStorage('battleAnimate', false);
    }
    
    // core.initStatus.shops = core.firstData.shops;
    core.firstData.shops.forEach(function (t) {
        core.initStatus.shops[t.id] = t;
    })

    core.dom.versionLabel.innerHTML = core.firstData.version;
    core.dom.logoLabel.innerHTML = core.firstData.title;
    document.title = core.firstData.title + " - HTML5魔塔";
    document.getElementById("startLogo").innerHTML = core.firstData.title;
    core.material.items = core.clone(core.items.getItems());
    core.initStatus.maps = core.maps.initMaps(core.floorIds);
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

    if (core.platform.isPC) {
        // 如果是PC端直接加载
        core.musicStatus.startDirectly = true;
    }
    else {
        var connection = navigator.connection;
        if (core.isset(connection) && connection.type=='wifi')
            core.musicStatus.startDirectly = true;
    }

    // 先从存储中读取BGM状态
    core.musicStatus.bgmStatus = core.getLocalStorage('bgmStatus', true);
    if (!core.musicStatus.startDirectly) // 如果当前网络环境不允许
        core.musicStatus.bgmStatus = false;
    core.setLocalStorage('bgmStatus', core.musicStatus.bgmStatus);

    core.musicStatus.soundStatus = core.getLocalStorage('soundStatus', true);
    core.setLocalStorage('soundStatus', core.musicStatus.soundStatus);

    // switchs
    core.flags.battleAnimate = core.getLocalStorage('battleAnimate', core.flags.battleAnimate);
    core.flags.displayEnemyDamage = core.getLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
    core.flags.displayCritical = core.getLocalStorage('critical', core.flags.displayCritical);
    core.flags.displayExtraDamage = core.getLocalStorage('extraDamage', core.flags.displayExtraDamage);

    core.material.ground = new Image();
    core.material.ground.src = "project/images/ground.png";

    core.loader.load(function () {
        console.log(core.material);
        // 设置勇士高度
        core.material.icons.hero.height = core.material.images.hero.height/4;
        core.setRequestAnimationFrame();
        core.showStartAnimate();

        if (main.mode=='play')
            core.events.initGame();

        if (core.isset(functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.plugins))
            core.plugin = new functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.plugins.plugin();

        if (core.isset(callback)) callback();

    });
}

////// 设置requestAnimationFrame //////
core.prototype.setRequestAnimationFrame = function () {
    core.control.setRequestAnimationFrame();
}

////// 显示游戏开始界面 //////
core.prototype.showStartAnimate = function (callback) {
    core.control.showStartAnimate(callback);
}

////// 隐藏游戏开始界面 //////
core.prototype.hideStartAnimate = function (callback) {
    core.control.hideStartAnimate(callback);
}

////// 游戏是否已经开始 //////
core.prototype.isPlaying = function() {
    return core.control.isPlaying();
}

////// 清除游戏状态和数据 //////
core.prototype.clearStatus = function() {
    core.control.clearStatus();
}

////// 重置游戏状态和初始数据 //////
core.prototype.resetStatus = function(hero, hard, floorId, route, maps, values, flags) {
    core.control.resetStatus(hero, hard, floorId, route, maps, values, flags);
}

////// 开始游戏 //////
core.prototype.startGame = function (hard, callback) {
    core.control.startGame(hard, callback);
}

////// 重新开始游戏；此函数将回到标题页面 //////
core.prototype.restart = function() {
    core.control.restart();
}

/////////// 系统事件相关 END ///////////


/////////// 键盘、鼠标事件相关 ///////////

////// 按下某个键时 //////
core.prototype.onkeyDown = function(e) {
    return core.actions.onkeyDown(e);
}

////// 放开某个键时 //////
core.prototype.onkeyUp = function(e) {
    return core.actions.onkeyUp(e);
}

////// 按住某个键时 //////
core.prototype.pressKey = function (keyCode) {
    return core.actions.pressKey(keyCode);
}

////// 根据按下键的code来执行一系列操作 //////
core.prototype.keyDown = function(keyCode) {
    return core.actions.keyDown(keyCode);
}

////// 根据放开键的code来执行一系列操作 //////
core.prototype.keyUp = function(keyCode) {
    return core.actions.keyUp(keyCode);
}

////// 点击（触摸）事件按下时 //////
core.prototype.ondown = function (x ,y) {
    return core.actions.ondown(x,y);
}

////// 当在触摸屏上滑动时 //////
core.prototype.onmove = function (x ,y) {
    return core.actions.onmove(x,y);
}

////// 当点击（触摸）事件放开时 //////
core.prototype.onup = function () {
    return core.actions.onup();
}

////// 获得点击事件相对左上角的坐标（0到12之间） //////
core.prototype.getClickLoc = function (x, y) {
    return core.actions.getClickLoc(x,y);
}

////// 具体点击屏幕上(x,y)点时，执行的操作 //////
core.prototype.onclick = function (x, y, stepPostfix) {
    return core.actions.onclick(x,y,stepPostfix);
}

////// 滑动鼠标滚轮时的操作 //////
core.prototype.onmousewheel = function (direct) {
    return core.actions.onmousewheel(direct);
}

/////////// 键盘、鼠标事件相关 END ///////////

/////////// 寻路代码相关 ///////////

////// 清除自动寻路路线 //////
core.prototype.clearAutomaticRouteNode = function (x, y) {
    core.control.clearAutomaticRouteNode(x,y);
}

////// 停止自动寻路操作 //////
core.prototype.stopAutomaticRoute = function () {
    core.control.stopAutomaticRoute();
}

////// 继续剩下的自动寻路操作 //////
core.prototype.continueAutomaticRoute = function () {
    core.control.continueAutomaticRoute();
}

////// 清空剩下的自动寻路列表 //////
core.prototype.clearContinueAutomaticRoute = function () {
    core.control.clearContinueAutomaticRoute();
}

////// 设置自动寻路路线 //////
core.prototype.setAutomaticRoute = function (destX, destY, stepPostfix) {
    core.control.setAutomaticRoute(destX,destY,stepPostfix);
}

////// 自动寻路算法，找寻最优路径 //////
core.prototype.automaticRoute = function (destX, destY) {
    return core.control.automaticRoute(destX, destY);
}

////// 显示离散的寻路点 //////
core.prototype.fillPosWithPoint = function (pos) {
    core.control.fillPosWithPoint(pos);
}

/////////// 寻路代码相关 END ///////////



/////////// 自动行走 & 行走控制 ///////////

////// 设置勇士的自动行走路线 //////
core.prototype.setAutoHeroMove = function (steps) {
    core.control.setAutoHeroMove(steps);
}

////// 设置行走的效果动画 //////
core.prototype.setHeroMoveInterval = function (direction, x, y, callback) {
    core.control.setHeroMoveInterval(direction, x, y, callback);
}

////// 实际每一步的行走过程 //////
core.prototype.moveAction = function (callback) {
    core.control.moveAction(callback);
}

////// 转向 //////
core.prototype.turnHero = function() {
    core.control.turnHero();
}

////// 勇士能否前往某方向 //////
core.prototype.canMoveHero = function(x,y,direction,floorId) {
    return core.maps.canMoveHero(x,y,direction,floorId);
}

////// 能否瞬间移动 //////
core.prototype.canMoveDirectly = function (destX,destY) {
    return core.maps.canMoveDirectly(destX, destY);
}

////// 让勇士开始移动 //////
core.prototype.moveHero = function (direction, callback) {
    core.control.moveHero(direction, callback);
}

/////// 使用事件让勇士移动。这个函数将不会触发任何事件 //////
core.prototype.eventMoveHero = function(steps, time, callback) {
    core.control.eventMoveHero(steps, time, callback);
}

////// 使用事件让勇士跳跃。这个函数将不会触发任何事件 //////
core.prototype.jumpHero = function (ex,ey,time,callback) {
    core.control.jumpHero(ex,ey,time,callback);
}

////// 每移动一格后执行的事件 //////
core.prototype.moveOneStep = function() {
    core.control.moveOneStep();
}

////// 停止勇士的一切行动，等待勇士行动结束后，再执行callback //////
core.prototype.waitHeroToStop = function(callback) {
    core.control.waitHeroToStop(callback);
}

////// 停止勇士的移动状态 //////
core.prototype.stopHero = function () {
    core.control.stopHero();
}

////// 绘制勇士 //////
core.prototype.drawHero = function (direction, x, y, status, offsetX, offsetY) {
    core.control.drawHero(direction, x, y, status, offsetX, offsetY);
}

////// 设置勇士的位置 //////
core.prototype.setHeroLoc = function (itemName, itemVal) {
    core.control.setHeroLoc(itemName, itemVal);
}

////// 获得勇士的位置 //////
core.prototype.getHeroLoc = function (itemName) {
    return core.control.getHeroLoc(itemName);
}

////// 获得勇士面对位置的x坐标 //////
core.prototype.nextX = function(n) {
    return core.control.nextX(n);
}

////// 获得勇士面对位置的y坐标 //////
core.prototype.nextY = function (n) {
    return core.control.nextY(n);
}

/////////// 自动行走 & 行走控制 END ///////////



/////////// 地图处理 ///////////

////// 开门 //////
core.prototype.openDoor = function (id, x, y, needKey, callback) {
    core.events.openDoor(id, x, y, needKey, callback);
}

////// 战斗 //////
core.prototype.battle = function (id, x, y, force, callback) {
    core.events.battle(id,x,y,force,callback);
}

////// 战斗完毕 //////
core.prototype.afterBattle = function(id, x, y, callback) {
    core.events.afterBattle(id, x, y, callback);
}

////// 触发(x,y)点的事件 //////
core.prototype.trigger = function (x, y) {
    core.events.trigger(x,y);
}

////// 楼层切换 //////
core.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback, fromLoad) {
    core.events.changeFloor(floorId, stair, heroLoc, time, callback, fromLoad);
}

////// 清除地图 //////
core.prototype.clearMap = function (map, x, y, width, height) {
    core.ui.clearMap(map, x, y, width, height);
}

////// 在某个canvas上绘制一段文字 //////
core.prototype.fillText = function (map, text, x, y, style, font) {
    core.ui.fillText(map, text, x, y, style, font);
}

////// 在某个canvas上绘制一个矩形 //////
core.prototype.fillRect = function (map, x, y, width, height, style) {
    core.ui.fillRect(map, x, y, width, height, style)
}

////// 在某个canvas上绘制一个矩形的边框 //////
core.prototype.strokeRect = function (map, x, y, width, height, style, lineWidth) {
    core.ui.strokeRect(map, x, y, width, height, style, lineWidth)
}

////// 在某个canvas上绘制一条线 //////
core.prototype.drawLine = function (map, x1, y1, x2, y2, style, lineWidth) {
    core.ui.drawLine(map, x1, y1, x2, y2, style, lineWidth);
}

////// 设置某个canvas的文字字体 //////
core.prototype.setFont = function (map, font) {
    core.ui.setFont(map, font);
}

////// 设置某个canvas的线宽度 //////
core.prototype.setLineWidth = function (map, lineWidth) {
    core.ui.setLineWidth(map, lineWidth);
}

////// 保存某个canvas状态 //////
core.prototype.saveCanvas = function (map) {
    core.ui.saveCanvas(map);
}

////// 加载某个canvas状态 //////
core.prototype.loadCanvas = function (map) {
    core.ui.loadCanvas(map);
}

////// 设置某个canvas边框属性 //////
core.prototype.setStrokeStyle = function (map, style) {
    core.ui.setStrokeStyle(map, style);
}

////// 设置某个canvas的alpha值 //////
core.prototype.setAlpha = function (map, alpha) {
    core.ui.setAlpha(map, alpha);
}

////// 设置某个canvas的透明度 //////
core.prototype.setOpacity = function (map, opacity) {
    core.ui.setOpacity(map, opacity);
}

////// 设置某个canvas的绘制属性（如颜色等） //////
core.prototype.setFillStyle = function (map, style) {
    core.ui.setFillStyle(map, style);
}

core.prototype.drawBlock = function (block, animate, dx, dy) {
    core.maps.drawBlock(block, animate, dx, dy);
}

////// 绘制某张地图 //////
core.prototype.drawMap = function (mapName, callback) {
    core.maps.drawMap(mapName, callback);
}

////// 绘制Autotile //////
core.prototype.drawAutotile = function(ctx, mapArr, block, size, left, top){
    core.maps.drawAutotile(ctx, mapArr, block, size, left, top);
}

////// 某个点是否不可通行 //////
core.prototype.noPassExists = function (x, y, floorId) {
    return core.maps.noPassExists(x,y,floorId);
}

////// 某个点是否在区域内且不可通行 //////
core.prototype.noPass = function (x, y) {
    return core.maps.noPass(x,y);
}

////// 某个点是否存在NPC //////
core.prototype.npcExists = function (x, y, floorId) {
    return core.maps.npcExists(x, y, floorId);
}

////// 某个点是否存在（指定的）地形 //////
core.prototype.terrainExists = function (x, y, id, floorId) {
    return core.maps.terrainExists(x, y, id, floorId);
}

////// 某个点是否存在楼梯 //////
core.prototype.stairExists = function (x, y, floorId) {
    return core.maps.stairExists(x, y, floorId);
}

////// 当前位置是否在楼梯边 //////
core.prototype.nearStair = function() {
    return core.maps.nearStair();
}

////// 某个点是否存在（指定的）怪物 //////
core.prototype.enemyExists = function (x, y, id,floorId) {
    return core.maps.enemyExists(x, y, id, floorId);
}

////// 获得某个点的block //////
core.prototype.getBlock = function (x, y, floorId, needEnable) {
    return core.maps.getBlock(x,y,floorId,needEnable);
}

////// 获得某个点的blockId //////
core.prototype.getBlockId = function (x, y, floorId, needEnable) {
    return core.maps.getBlockId(x, y, floorId, needEnable);
}

////// 显示移动某块的动画，达到{“type”:”move”}的效果 //////
core.prototype.moveBlock = function(x,y,steps,time,immediateHide,callback) {
    core.maps.moveBlock(x,y,steps,time,immediateHide,callback)
}

////// 显示跳跃某块的动画，达到{"type":"jump"}的效果 //////
core.prototype.jumpBlock = function(sx,sy,ex,ey,time,immediateHide,callback) {
    core.maps.jumpBlock(sx,sy,ex,ey,time,immediateHide,callback);
}

////// 显示/隐藏某个块时的动画效果 //////
core.prototype.animateBlock = function (loc,type,time,callback) {
    core.maps.animateBlock(loc,type,time,callback)
}

////// 将某个块从禁用变成启用状态 //////
core.prototype.showBlock = function(x, y, floodId) {
    core.maps.showBlock(x,y,floodId);
}

////// 将某个块从启用变成禁用状态 //////
core.prototype.removeBlock = function (x, y, floorId) {
    core.maps.removeBlock(x,y,floorId);
}

////// 根据block的索引删除该块 //////
core.prototype.removeBlockById = function (index, floorId) {
    core.maps.removeBlockById(index, floorId);
}

////// 一次性删除多个block //////
core.prototype.removeBlockByIds = function (floorId, ids) {
    core.maps.removeBlockByIds(floorId, ids);
}

////// 改变图块 //////
core.prototype.setBlock = function (number, x, y, floorId) {
    core.maps.setBlock(number, x, y, floorId);
}

////// 添加一个全局动画 //////
core.prototype.addGlobalAnimate = function (block) {
    core.maps.addGlobalAnimate(block);
}

////// 删除一个或所有全局动画 //////
core.prototype.removeGlobalAnimate = function (x, y, all) {
    core.maps.removeGlobalAnimate(x, y, all);
}

////// 设置全局动画的显示效果 //////
core.prototype.setGlobalAnimate = function (speed) {
    core.maps.setGlobalAnimate(speed);
}

////// 同步所有的全局动画效果 //////
core.prototype.syncGlobalAnimate = function () {
    core.maps.syncGlobalAnimate();
}

////// 绘制UI层的box动画 //////
core.prototype.drawBoxAnimate = function () {
    core.maps.drawBoxAnimate();
}

////// 绘制动画 //////
core.prototype.drawAnimate = function (name, x, y, callback) {
    core.maps.drawAnimate(name, x, y, callback);
}

////// 更新领域、夹击、阻击的伤害地图 //////
core.prototype.updateCheckBlock = function() {
    core.control.updateCheckBlock();
}

////// 检查并执行领域、夹击、阻击事件 //////
core.prototype.checkBlock = function () {
    core.control.checkBlock();
}

////// 阻击事件（动画效果） //////
core.prototype.snipe = function (snipes) {
    core.control.snipe(snipes);
}

////// 更改天气效果 //////
core.prototype.setWeather = function (type, level) {
    core.control.setWeather(type, level);
}

////// 更改画面色调 //////
core.prototype.setFg = function(color, time, callback) {
    core.control.setFg(color, time, callback);
}

////// 更新全地图显伤 //////
core.prototype.updateFg = function () {
    core.control.updateFg();
}

////// 获得某个物品的个数 //////
core.prototype.itemCount = function (itemId) {
    return core.items.itemCount(itemId);
}

////// 是否存在某个物品 //////
core.prototype.hasItem = function (itemId) {
    return core.items.hasItem(itemId);
}

////// 设置某个物品的个数 //////
core.prototype.setItem = function (itemId, itemNum) {
    core.items.setItem(itemId, itemNum);
}

////// 删除某个物品 //////
core.prototype.removeItem = function (itemId) {
    return core.items.removeItem(itemId);
}

////// 使用某个物品 //////
core.prototype.useItem = function (itemId, callback) {
    core.items.useItem(itemId, callback);
}

////// 能否使用某个物品 //////
core.prototype.canUseItem = function (itemId) {
    return core.items.canUseItem(itemId);
}

////// 增加某个物品的个数 //////
core.prototype.addItem = function (itemId, itemNum) {
    core.items.addItem(itemId, itemNum);
}

////// 获得面前的物品（轻按） //////
core.prototype.getNextItem = function() {
    core.events.getNextItem();
}

////// 获得某个物品 //////
core.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    core.events.getItem(itemId, itemNum, itemX, itemY, callback);
}

////// 左上角绘制一段提示 //////
core.prototype.drawTip = function (text, itemIcon) {
    core.ui.drawTip(text, itemIcon);
}

////// 地图中间绘制一段文字 //////
core.prototype.drawText = function (contents, callback) {
    core.ui.drawText(contents, callback);
}

/////////// 地图相关 END ///////////




/////////// 系统机制 ///////////

////// 将文字中的${和}（表达式）进行替换 //////
core.prototype.replaceText = function (text) {
    return core.utils.replaceText(text);
}

////// 计算表达式的值 //////
core.prototype.calValue = function (value) {
    return core.utils.calValue(value);
}

////// 执行一个表达式的effect操作 //////
core.prototype.doEffect = function (expression) {
    core.control.doEffect(expression);
}

////// 字符串自动换行的分割 //////
core.prototype.splitLines = function(canvas, text, maxLength, font) {
    return core.utils.splitLines(canvas, text, maxLength, font);
}

////// 向某个数组前插入另一个数组或元素 //////
core.prototype.unshift = function (a,b) {
    return core.utils.unshift(a,b);
}

////// 设置本地存储 //////
core.prototype.setLocalStorage = function(key, value) {
    return core.utils.setLocalStorage(key, value);
}

////// 获得本地存储 //////
core.prototype.getLocalStorage = function(key, defaultValue) {
    return core.utils.getLocalStorage(key, defaultValue);
}

////// 移除本地存储 //////
core.prototype.removeLocalStorage = function (key) {
    core.utils.removeLocalStorage(key);
}

////// 深拷贝一个对象 //////
core.prototype.clone = function (data) {
    return core.utils.clone(data);
}

////// 裁剪图片 //////
core.prototype.cropImage = function (image, size) {
    return core.utils.cropImage(image, size);
}

////// 格式化时间为字符串 //////
core.prototype.formatDate = function(date) {
    return core.utils.formatDate(date);
}

////// 格式化时间为最简字符串 //////
core.prototype.formatDate2 = function (date) {
    return core.utils.formatDate2(date);
}

////// 格式化大数 //////
core.prototype.formatBigNumber = function (x) {
    return core.utils.formatBigNumber(x);
}

////// 两位数显示 //////
core.prototype.setTwoDigits = function (x) {
    return core.utils.setTwoDigits(x);
}

////// 数组转RGB //////
core.prototype.arrayToRGB = function (color) {
    return core.utils.arrayToRGB(color);
}

////// 作弊 //////
core.prototype.debug = function() {
    core.control.debug();
}

////// 存档前 //////
core.prototype.beforeSaveData = function (data) {
    return core.events.beforeSaveData(data);
}

////// 读档后 //////
core.prototype.afterLoadData = function (data) {
    return core.events.afterLoadData(data);
}

////// 重置当前地图 //////
core.prototype.resetMap = function(floorId) {
    core.maps.resetMap(floorId);
}

////// 开始播放 //////
core.prototype.startReplay = function (list) {
    core.control.startReplay(list);
}

////// 关闭UI窗口 //////
core.prototype.closePanel = function () {
    core.ui.closePanel();
}

////// 更改播放状态 //////
core.prototype.triggerReplay = function () {
    core.control.triggerReplay();
}

////// 暂停播放 //////
core.prototype.pauseReplay = function () {
    core.control.pauseReplay();
}

////// 恢复播放 //////
core.prototype.resumeReplay = function () {
    core.control.resumeReplay();
}

////// 加速播放 //////
core.prototype.speedUpReplay = function () {
    core.control.speedUpReplay();
}

////// 减速播放 //////
core.prototype.speedDownReplay = function () {
    core.control.speedDownReplay();
}

////// 回退播放 //////
core.prototype.rewindReplay = function () {
    core.control.rewindReplay();
}

////// 停止播放 //////
core.prototype.stopReplay = function () {
    core.control.stopReplay();
}

////// 回放时存档 //////
core.prototype.saveReplay = function () {
    core.control.saveReplay();
}

core.prototype.bookReplay = function () {
    core.control.bookReplay();
}

////// 回放 //////
core.prototype.replay = function () {
    core.control.replay();
}

////// 判断当前能否进入某个事件 //////
core.prototype.checkStatus = function (name, need, item) {
    return core.control.checkStatus(name, need, item);
}

////// 点击怪物手册时的打开操作 //////
core.prototype.openBook = function (need) {
    core.control.openBook(need);
}

////// 点击楼层传送器时的打开操作 //////
core.prototype.useFly = function (need) {
    core.control.useFly(need);
}

////// 点击工具栏时的打开操作 //////
core.prototype.openToolbox = function (need) {
    core.control.openToolbox(need);
}

////// 点击快捷商店按钮时的打开操作 //////
core.prototype.openQuickShop = function (need) {
    core.control.openQuickShop(need);
}

////// 点击保存按钮时的打开操作 //////
core.prototype.save = function(need) {
    core.control.save(need);
}

////// 点击读取按钮时的打开操作 //////
core.prototype.load = function (need) {
    core.control.load(need);
}

////// 点击设置按钮时的操作 //////
core.prototype.openSettings = function (need) {
    core.control.openSettings(need);
}

////// 自动存档 //////
core.prototype.autosave = function (removeLast) {
    core.control.autosave(removeLast);
}

////// 实际进行存读档事件 //////
core.prototype.doSL = function (id, type) {
    core.control.doSL(id, type);
}

////// 同步存档到服务器 //////
core.prototype.syncSave = function (type) {
    core.control.syncSave(type);
}

////// 从服务器加载存档 //////
core.prototype.syncLoad = function () {
    core.control.syncLoad();
}

////// 存档到本地 //////
core.prototype.saveData = function() {
    return core.control.saveData();
}

////// 从本地读档 //////
core.prototype.loadData = function (data, callback) {
    core.control.loadData(data, callback);
}

////// 加密路线 //////
core.prototype.encodeRoute = function (route) {
    return core.utils.encodeRoute(route);
}

////// 解密路线 //////
core.prototype.decodeRoute = function (route) {
    return core.utils.decodeRoute(route);
}

////// 发送HTTP //////
core.prototype.http = function (type, url, formData, success, error, mimeType, responseType) {
    core.utils.http(type, url, formData, success, error, mimeType, responseType)
}

////// 设置勇士属性 //////
core.prototype.setStatus = function (statusName, statusVal) {
    core.control.setStatus(statusName, statusVal);
}

////// 获得勇士属性 //////
core.prototype.getStatus = function (statusName) {
    return core.control.getStatus(statusName);
}

////// 获得某个等级的名称 //////
core.prototype.getLvName = function () {
    return core.control.getLvName();
}

////// 设置某个自定义变量或flag //////
core.prototype.setFlag = function(flag, value) {
    core.control.setFlag(flag, value);
}

////// 获得某个自定义变量或flag //////
core.prototype.getFlag = function(flag, defaultValue) {
    return core.control.getFlag(flag, defaultValue);
}

////// 是否存在某个自定义变量或flag，且值为true //////
core.prototype.hasFlag = function(flag) {
    return core.control.hasFlag(flag);
}

core.prototype.doAction = function() {
    core.events.doAction();
}

////// 往当前事件列表之前插入一系列事件 //////
core.prototype.insertAction = function (list, x, y, callback) {
    core.events.insertAction(list, x, y, callback);
}

////// 锁定状态栏，常常用于事件处理 //////
core.prototype.lockControl = function () {
    core.control.lockControl();
}

////// 解锁状态栏 //////
core.prototype.unLockControl = function () {
    core.control.unLockControl();
}

////// 判断某对象是否不为undefined也不会null //////
core.prototype.isset = function (val) {
    return core.utils.isset(val);
}

////// 获得子数组 //////
core.prototype.subarray = function (a, b) {
    return core.utils.subarray(a, b);
}

////// Base64加密 //////
core.prototype.encodeBase64 = function (str) {
    return core.utils.encodeBase64(str);
}

////// Base64解密 //////
core.prototype.decodeBase64 = function (str) {
    return core.utils.decodeBase64(str);
}

////// 生成随机数（seed方法） //////
core.prototype.rand = function (num) {
    return core.utils.rand(num);
}

////// 生成随机数（录像方法） //////
core.prototype.rand2 = function (num) {
    return core.utils.rand2(num);
}

////// 读取一个本地文件内容 //////
core.prototype.readFile = function (success, error, readType) {
    core.utils.readFile(success, error, readType);
}

////// 读取本地文件完毕 //////
core.prototype.readFileContent = function (content) {
    core.utils.readFileContent(content);
}

////// 下载文件到本地 //////
core.prototype.download = function (filename, content) {
    core.utils.download(filename, content);
}

////// 复制一段内容到剪切板 //////
core.prototype.copy = function (data) {
    return core.utils.copy(data);
}

////// 播放背景音乐 //////
core.prototype.playBgm = function (bgm) {
    core.control.playBgm(bgm);
}

////// 暂停背景音乐的播放 //////
core.prototype.pauseBgm = function () {
    core.control.pauseBgm();
}

////// 恢复背景音乐的播放 //////
core.prototype.resumeBgm = function () {
    core.control.resumeBgm();
}

////// 播放音频 //////
core.prototype.playSound = function (sound) {
    core.control.playSound(sound);
}

////// 动画显示某对象 //////
core.prototype.show = function (obj, speed, callback) {
    core.utils.show(obj, speed, callback);
}

////// 动画使某对象消失 //////
core.prototype.hide = function (obj, speed, callback) {
    core.utils.hide(obj, speed, callback);
}

////// 清空状态栏 //////
core.prototype.clearStatusBar = function() {
    core.control.clearStatusBar();
}

////// 更新状态栏 //////
core.prototype.updateStatusBar = function () {
    core.control.updateStatusBar();
}

////// 屏幕分辨率改变后重新自适应 //////
core.prototype.resize = function(clientWidth, clientHeight) {
    core.control.resize(clientWidth, clientHeight);
}

////// 渲染DOM //////
core.prototype.domRenderer = function(){
    core.control.domRenderer();
}

/**
 * 系统机制 end
 */

var core = new core();
