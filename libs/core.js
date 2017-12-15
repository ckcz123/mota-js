/**
 * 初始化 start
 */

function core() {
    this.dom = {};
    this.statusBar = {};
    this.canvas = {};
    this.images = [];
    this.sounds = {};
    this.floorIds = [];
    this.floors = {};
    this.firstData = {};
    this.material = {
        'images': {},
        'sounds': {},
        'ground': null,
        'items': {},
        'enemys': {},
        'icons': {},
        'events': {}
    }
    this.timeout = {
        'getItemTipTimeout': null
    }
    this.interval = {
        'twoAnimate': null,
        'fourAnimate': null,
        'boxAnimate': null,
        'heroMoveTriggerInterval': null,
        'heroMoveInterval': null,
        'heroAutoMoveScan': null,
        "tipAnimate": null,
        'openDoorAnimate': null
    }
    this.musicStatus = {
        'isIOS': false,
        'loaded': false,
        'bgmStatus': false,
        'soundStatus': true,
        'playedSound': null,
        'playedBgm': null,
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

        // 勇士状态；自动寻路相关
        'heroMoving': false,
        'heroStop': true,
        'lockControl': false,
        'autoHeroMove': false,
        'automaticRouting': false,
        'automaticRouted': false,
        'autoStep': 0,
        'movedStep': 0,
        'destStep': 0,
        'automaticRoutingTemp': {'destX': 0, 'destY': 0, 'moveStep': []},
        'autoStepRoutes':  [],
        'holdingPath': 0,
        'stepPostfix': [],
        'mouseOutCheck': 1,
        'moveStepBeforeStop': [],

        // event事件
        'savePage': null,
        'shops': {},
        'event': {
            'id': null,
            'data': null
        },
        'openingDoor': null,

        // 动画
        'twoAnimateObjs': [],
        'fourAnimateObjs': [],
        'boxAnimateObjs': [],
    };
    this.status = {};
    this.flags = {};
}

/////////// 系统事件相关 ///////////

core.prototype.init = function (dom, statusBar, canvas, images, sounds, floorIds, floors, coreData) {
    core.dom = dom;
    core.statusBar = statusBar;
    core.canvas = canvas;
    core.images = images;
    core.sounds = sounds;
    core.floorIds = floorIds;
    core.floors = floors;
    for (var key in coreData) {
        core[key] = coreData[key];
    }
    core.flags = core.clone(core.data.flags);
    core.flags.battleAnimate = core.getLocalStorage('battleAnimate', core.flags.battleAnimate);
    core.values = core.clone(core.data.values);
    core.firstData = core.data.getFirstData();
    core.initStatus.shops = core.firstData.shops;
    core.dom.versionLabel.innerHTML = core.firstData.version;
    core.dom.logoLabel.innerHTML = core.firstData.title;
    document.title = core.firstData.title + " - HTML5魔塔";
    document.getElementById("startLogo").innerHTML = core.firstData.title;
    core.material.items = core.items.getItems();
    core.initStatus.maps = core.maps.initMaps(floorIds);
    core.material.enemys = core.clone(core.enemys.getEnemys());
    core.material.icons = core.icons.getIcons();
    core.material.events = core.events.getEvents();

    // test if iOS
    core.musicStatus.soundStatus = core.getLocalStorage('soundStatus', true);
    var userAgent = navigator.userAgent;

    if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
        console.log("你的设备为iphone，不自动播放音乐！");
        core.musicStatus.isIOS = true;
        core.musicStatus.soundStatus = false;
    }

    core.material.ground = new Image();
    core.material.ground.src = "images/ground.png";

    core.loader(function () {
        console.log(core.material);

        // 设置勇士高度
        core.material.icons.hero.height = core.material.images.hero.height/4;

        core.showStartAnimate();
    });
}

core.prototype.showStartAnimate = function (callback) {
    core.dom.startPanel.style.opacity=1;
    core.dom.startPanel.style.display="block";
    core.dom.startTop.style.opacity=1;
    core.dom.startTop.style.display="block";
    core.dom.startButtonGroup.style.display = 'none';
    core.dom.startButtons.style.display = 'block';
    core.dom.levelChooseButtons.style.display = 'none';
    core.status.played = false;
    core.clearStatus();
    core.clearMap('all');

    var opacityVal = 1;
    var startAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        if (opacityVal < 0) {
            clearInterval(startAnimate);
            core.dom.startTop.style.display = 'none';
            // core.playGame();
            core.dom.startButtonGroup.style.display = 'block';
            if (core.isset(callback)) callback();
        }
        core.dom.startTop.style.opacity = opacityVal;
    }, 20);
}

core.prototype.hideStartAnimate = function (callback) {
    var opacityVal = 1;
    var startAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        if (opacityVal < 0) {
            clearInterval(startAnimate);
            core.dom.startPanel.style.display = 'none';
            if (core.isset(callback)) callback();
        }
        core.dom.startPanel.style.opacity = opacityVal;
    }, 20);
}

core.prototype.setStartProgressVal = function (val) {
    core.dom.startTopProgress.style.width = val + '%';
}

core.prototype.setStartLoadTipText = function (text) {
    core.dom.startTopLoadTips.innerHTML = text;
}

core.prototype.loader = function (callback) {
    var loadedImageNum = 0, allImageNum = 0, allSoundNum = 0;
    allImageNum = core.images.length;
    for (var key in core.sounds) {
        allSoundNum += core.sounds[key].length;
    }
    for (var i = 0; i < core.images.length; i++) {
        core.loadImage(core.images[i], function (imgName, image) {
            core.setStartLoadTipText('正在加载图片 ' + imgName + "...");
            imgName = imgName.split('-');
            imgName = imgName[0];
            core.material.images[imgName] = image;
            loadedImageNum++;
            core.setStartLoadTipText(imgName + ' 加载完毕...');
            core.setStartProgressVal(loadedImageNum * (100 / allImageNum));
            if (loadedImageNum == allImageNum) {
                // 加载音频
                for (var key in core.sounds) {
                    for (var i = 0; i < core.sounds[key].length; i++) {
                        var soundName=core.sounds[key][i];
                        soundName = soundName.split('-');
                        var sound = new Audio();
                        sound.preload = 'none';
                        sound.src = 'sounds/' + soundName[0] + '.' + key;
                        if (soundName[1] == 'loop') {
                            sound.loop = 'loop';
                        }

                        if (!core.isset(core.material.sounds[key]))
                            core.material.sounds[key] = {};
                        core.material.sounds[key][soundName[0]] = sound;
                    }
                }
                callback();
            }
        });
    }
}

core.prototype.loadImage = function (imgName, callback) {
    try {
        core.setStartLoadTipText('加载图片 ' + imgName + ' 中...');
        var image = new Image();
        image.src = 'images/' + imgName + '.png';
        if (image.complete) {
            callback(imgName, image);
            return;
        }
        image.onload = function () {
            callback(imgName, image);
        }
    }
    catch (e) {
        alert(e);
    }
}

core.prototype.loadSound = function() {
    if (!core.isset(core.material.sounds.mp3)) return;
    if (core.musicStatus.isIOS) return;
    if (core.musicStatus.loaded) return;
    core.musicStatus.loaded=true;
    console.log("加载音乐");

    var toLoadList = [];

    for (var key in core.material.sounds) {
        for (var name in core.material.sounds[key]) {
            toLoadList.push(core.material.sounds[key][name]);
        }
    }
    core.loadSoundItem(toLoadList);
}

core.prototype.loadSoundItem = function (toLoadList) {
    if (toLoadList.length==0) {
        if (core.musicStatus.bgmStatus>0) return;
        core.musicStatus.bgmStatus=1;
        if (core.musicStatus.soundStatus)
            core.playBgm('bgm', 'mp3');
        return;
    }
    var item = toLoadList.shift();
    item.oncanplay = function() {
        core.loadSoundItem(toLoadList);
    }
    item.load();
}

core.prototype.isPlaying = function() {
    if (core.isset(core.status.played) && core.status.played)
        return true;
    return false;
}


core.prototype.clearStatus = function() {
    // 停止各个Timeout和Interval
    for (var i in core.interval) {
        clearInterval(core.interval[i]);
    }
    core.status = {};
    core.clearStatusBar();
    core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
}

core.prototype.resetStatus = function(hero, hard, floorId, maps) {

    // 停止各个Timeout和Interval
    for (var i in core.interval) {
        clearInterval(core.interval[i]);
    }

    // 初始化status
    core.status = core.clone(core.initStatus);
    core.status.played = true;
    // 初始化maps
    core.status.floorId = floorId;
    core.status.maps = core.clone(maps);
    // 初始化怪物
    core.material.enemys = core.clone(core.enemys.getEnemys());
    // 初始化人物属性
    core.status.hero = core.clone(hero);
    core.status.hard = hard;
    // 保存页面
    core.status.savePage = core.getLocalStorage('savePage', 0);

    core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);

}

core.prototype.startGame = function (hard, callback) {
    console.log('开始游戏');

    core.resetStatus(core.firstData.hero, hard, core.firstData.floorId, core.initStatus.maps);

    core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
        core.setHeroMoveTriggerInterval();
        if (core.isset(callback)) callback();
    });
}


core.prototype.restart = function() {
    core.showStartAnimate();
}

/////////// 系统事件相关 END ///////////




/////////// 键盘、鼠标事件相关 ///////////

core.prototype.onkeyDown = function(e) {
    if (!core.isset(core.status.holdingKeys))core.status.holdingKeys=[];
    var isArrow={37:true,38:true,39:true,40:true}[e.keyCode]
    if(isArrow){
        for(var ii =0;ii<core.status.holdingKeys.length;ii++){
            if (core.status.holdingKeys[ii]===e.keyCode){
                return;
            }
        }
        core.status.holdingKeys.push(e.keyCode);
        core.pressKey(e.keyCode);
    } else {
        core.keyDown(e.keyCode);
    }
}

core.prototype.onkeyUp = function(e) {
    var isArrow={37:true,38:true,39:true,40:true}[e.keyCode]
    if(isArrow){
        for(var ii =0;ii<core.status.holdingKeys.length;ii++){
            if (core.status.holdingKeys[ii]===e.keyCode){
                core.status.holdingKeys= core.status.holdingKeys.slice(0,ii).concat(core.status.holdingKeys.slice(ii+1));
                if (ii === core.status.holdingKeys.length && core.status.holdingKeys.length!==0)core.pressKey(core.status.holdingKeys.slice(-1)[0]);
                break;
            }
        }
        core.stopHero();
    } else {
        core.keyUp(e.keyCode);
    }
}

core.prototype.pressKey = function (keyCode) {
    if (keyCode === core.status.holdingKeys.slice(-1)[0]) {
        core.keyDown(keyCode);
        window.setTimeout(function(){core.pressKey(keyCode);},30);
    }
}

core.prototype.keyDown = function(keyCode) {
    if(!core.status.played) {
        return;
    }
    if(core.status.automaticRouting || core.status.automaticRouted) {
        core.stopAutomaticRoute();
    }
    if (core.status.lockControl) {
        if (core.status.event.id == 'book') {
            if (keyCode==37) core.ui.drawEnemyBook(core.status.event.data - 1);
            else if (keyCode==39) core.ui.drawEnemyBook(core.status.event.data + 1);
            return;
        }
        if (core.status.event.id == 'fly') {
            if (keyCode==38) core.ui.drawFly(core.status.event.data+1);
            else if (keyCode==40) core.ui.drawFly(core.status.event.data-1);
            return;
        }
        if (core.status.event.id == 'save' || core.status.event.id == 'load') {
            if (keyCode==37) core.ui.drawSLPanel(core.status.event.data-1);
            else if (keyCode==39) core.ui.drawSLPanel(core.status.event.data+1);
            return;
        }
        return;
    }
    switch(keyCode) {
        case 37:
            core.moveHero('left');
        break;
        case 38:
            core.moveHero('up');
        break;
        case 39:
            core.moveHero('right');
        break;
        case 40:
            core.moveHero('down');
        break;
    }
}

core.prototype.keyUp = function(keyCode) {
    if(!core.status.played) {
    return;
}

if (core.status.lockControl) {
    if (core.status.event.id == 'book' && (keyCode==27 || keyCode==88))
        core.ui.closePanel(true);
    if (core.status.event.id == 'fly' && (keyCode==71 || keyCode==27))
        core.ui.closePanel();
    if (core.status.event.id == 'fly' && keyCode==13) {
        var index=core.status.hero.flyRange.indexOf(core.status.floorId);
        var stair=core.status.event.data<index?"upFloor":"downFloor";
        var floorId=core.status.event.data;
        core.ui.closePanel();
        core.changeFloor(core.status.hero.flyRange[floorId], stair);
    }
    if (core.status.event.id == 'save' && (keyCode==83 || keyCode==27))
        core.ui.closePanel();
    if (core.status.event.id == 'load' && (keyCode==76 || keyCode==27))
        core.ui.closePanel();
    if ((core.status.event.id == 'settings' || core.status.event.id == 'selectShop') && keyCode==27)
        core.ui.closePanel();
    if (core.status.event.id == 'selectShop' && keyCode==75)
        core.ui.closePanel();
    if (core.status.event.id == 'shop' && keyCode==27) {
        core.status.boxAnimateObjs = [];
        core.setBoxAnimate();
        if (core.status.event.data.fromList)
            core.ui.drawQuickShop();
        else core.ui.closePanel();
    }
    if (core.status.event.id == 'toolbox' && (keyCode==84 || keyCode==27))
        core.ui.closePanel();
    if (core.status.event.id == 'about' && (keyCode==13 || keyCode==32))
        core.ui.closePanel();
    if (core.status.event.id == 'text' && (keyCode==13 || keyCode==32))
        core.drawText();
    if (core.status.event.id == 'action' && core.isset(core.status.event.data.current)
        && core.status.event.data.type=='text'  && (keyCode==13 || keyCode==32))
        core.events.doAction();

    return;
}

    switch (keyCode) {
        case 27: // ESC
            core.ui.drawSettings(true);
            break;
        case 71: // G
            core.useFly(true);
            break;
        case 88: // X
            core.openBook(true);
            break;
        case 83: // S
            core.save(true);
            break;
        case 76: // L
            core.load(true);
            break;
        case 84: // T
            core.openToolbox(true);
            break;
        case 90: // Z
            core.turnHero();
            break;
        case 75: // K
            core.ui.drawQuickShop(true);
            break;
        case 37: // UP
            break;
        case 38: // DOWN
            break;
        case 39: // RIGHT
            break;
        case 40: // DOWN
            break;
    }
    core.stopHero();

}

core.prototype.ondown = function (x ,y) {
    if (!core.status.played || core.status.lockControl) {
        core.onclick(x, y, []);
        return;
    }
    core.status.holdingPath=1;
    core.status.mouseOutCheck =1;
    window.setTimeout(core.clearStepPostfix);
    core.saveCanvas('ui');
    core.clearMap('ui', 0, 0, 416,416);
    var pos={'x':x,'y':y}
    core.status.stepPostfix=[];
    core.status.stepPostfix.push(pos);
    core.fillPosWithPoint(pos);
}

core.prototype.onmove = function (x ,y) {
    if (core.status.holdingPath==0){return;}
    core.status.mouseOutCheck =1;
    var pos={'x':x,'y':y};
    var pos0=core.status.stepPostfix[core.status.stepPostfix.length-1];
    var directionDistance=[pos.y-pos0.y,pos0.x-pos.x,pos0.y-pos.y,pos.x-pos0.x];
    var max=0,index=4;
    for(var ii=0;ii<4;ii++){
        if(directionDistance[ii]>max){
            index=ii;
            max=directionDistance[ii];
        }
    }
    pos=[{'x':0,'y':1},{'x':-1,'y':0},{'x':0,'y':-1},{'x':1,'y':0},false][index]
    if(pos){
        pos.x+=pos0.x;
        pos.y+=pos0.y;
        core.status.stepPostfix.push(pos);
        core.fillPosWithPoint(pos);
    }
}

core.prototype.onup = function () {
    core.status.holdingPath=0;
    if(core.status.stepPostfix.length>0){
        var stepPostfix = [];
        var direction={'0':{'1':'down','-1':'up'},'-1':{'0':'left'},'1':{'0':'right'}};
        for(var ii=1;ii<core.status.stepPostfix.length;ii++){
            var pos0 = core.status.stepPostfix[ii-1];
            var pos = core.status.stepPostfix[ii];
            stepPostfix.push({'direction': direction[pos.x-pos0.x][pos.y-pos0.y], 'x': pos.x, 'y': pos.y});
        }
        var posx=core.status.stepPostfix[0].x;
        var posy=core.status.stepPostfix[0].y;
        core.status.stepPostfix=[];
        core.canvas.ui.clearRect(0, 0, 416,416);
        core.canvas.ui.restore();
        core.onclick(posx,posy,stepPostfix);
        //posx,posy是之前寻路的目标点,stepPostfix是后续的移动
    }
}

core.prototype.getClickLoc = function (x, y) {
    
    var statusBar = {'x': 0, 'y': 0};
    var size = 32;
    size = size * core.domStyle.scale;

    switch (core.domStyle.screenMode) {// 这里的3是指statusBar和游戏画布之间的白线宽度
        case 'vertical':
            statusBar.x = 0;
            statusBar.y = core.dom.statusBar.offsetHeight + 3;
            break;
        case 'horizontal':
        case 'bigScreen':
            statusBar.x = core.dom.statusBar.offsetWidth + 3;
            statusBar.y = 0;
            break;
    }
    
    var left = core.dom.gameGroup.offsetLeft + statusBar.x;
    var top = core.dom.gameGroup.offsetTop + statusBar.y;
    var loc={'x': x - left, 'y': y - top, 'size': size};
    return loc;
}

core.prototype.onclick = function (x, y, stepPostfix) {
    // console.log("Click: (" + x + "," + y + ")");

    // 非游戏屏幕内
    if (x<0 || y<0 || x>12 || y>12) return;

    // 寻路
    if (!core.status.lockControl) {
        core.setAutomaticRoute(x, y, stepPostfix);
        return;
    }

    // 怪物手册
    if (core.status.event.id == 'book') {
        core.events.clickBook(x,y);
        return;
    }

    // 楼层飞行器
    if (core.status.event.id == 'fly') {
        core.events.clickFly(x,y);
        return;
    }

    // 设置
    if (core.status.event.id == 'settings') {
        core.events.clickSettings(x,y);
        return;
    }

    // 商店
    if (core.status.event.id == 'shop') {
        core.events.clickShop(x,y);
        return;
    }

    // 快捷商店
    if (core.status.event.id == 'selectShop') {
        core.events.clickQuickShop(x,y);
        return;
    }

    // 工具栏
    if (core.status.event.id == 'toolbox') {
        core.events.clickToolbox(x,y);
        return;
    }

    // 存读档
    if (core.status.event.id == 'save' || core.status.event.id == 'load') {
        core.events.clickSL(x,y);
        return;
    }

    // 选项
    if (core.status.event.id == 'confirmBox') {
        if ((x == 4 || x == 5) && y == 7 && core.isset(core.status.event.data.yes))
            core.status.event.data.yes();
        if ((x == 7 || x == 8) && y == 7 && core.isset(core.status.event.data.no))
            core.status.event.data.no();
        return;
    }

    // 关于
    if (core.status.event.id == 'about') {
        if (core.isPlaying())
            core.ui.closePanel(false);
        else
            core.showStartAnimate();
        return;
    }

    if (core.status.event.id == 'action') {
        core.events.clickAction(x,y);
        return;
    }

    // 纯文本
    if (core.status.event.id == 'text') {
        core.drawText();
        return;
    }

    // 同步存档
    if (core.status.event.id == 'syncSave') {
        if (x>=4 && x<=8) {
            if (y==5) {
                core.syncSave("save");
            }
            if (y==6) {
                core.syncSave("load");
            }
        }
        if (x>=5 && x<=7) {
            if (y==7) {
                core.ui.drawConfirmBox("你确定要清空所有本地存档吗？", function() {
                    localStorage.clear();
                    core.drawText("\t[操作成功]你的本地所有存档已被清空。");
                }, function() {
                    core.ui.drawSettings(false);
                })
            }
            if (y==8)
                core.ui.drawSettings(false);
        }
    }

}

core.prototype.onmousewheel = function (direct) {
    // 楼层飞行器
    if (core.status.lockControl && core.status.event.id == 'fly') {
        if (direct==-1) core.ui.drawFly(core.status.event.data-1);
        if (direct==1) core.ui.drawFly(core.status.event.data+1);
        return;
    }
}

/////////// 键盘、鼠标事件相关 END ///////////




/////////// 寻路代码相关 ///////////

core.prototype.clearAutomaticRouteNode = function (x, y) {
    core.canvas.ui.clearRect(x * 32 + 5, y * 32 + 5, 27, 27);
}

core.prototype.stopAutomaticRoute = function () {
    if (!core.status.played) {
        return;
    }
    core.stopAutoHeroMove();
    core.status.automaticRouting = false;
    core.status.automaticRouted = false;
    core.status.autoStepRoutes = [];
    core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
    if (core.status.moveStepBeforeStop.length==0)
        core.canvas.ui.clearRect(0, 0, 416, 416);
}

core.prototype.continueAutomaticRoute = function () {
    // 此函数只应由events.afterOpenDoor和events.afterBattle调用
    var moveStep = core.status.moveStepBeforeStop;
    core.status.moveStepBeforeStop = [];
    if(moveStep.length===0)return;
    if(moveStep.length===1 && moveStep[0].step===1)return;
    core.status.automaticRouting = true;
    core.setAutoHeroMove(moveStep);
}

core.prototype.clearContinueAutomaticRoute = function () {
    core.canvas.ui.clearRect(0, 0, 416, 416);
    core.status.moveStepBeforeStop=[];
}

core.prototype.setAutomaticRoute = function (destX, destY, stepPostfix) {
    if (!core.status.played || core.status.lockControl) {
        return;
    }
    else if (core.status.automaticRouting) {
        core.stopAutomaticRoute();
        return;
    }
    if (destX == core.status.hero.loc.x && destY == core.status.hero.loc.y && stepPostfix.length==0) {
        core.turnHero();
        return;
    }
    var step = 0;
    var tempStep = null;
    var moveStep;
    core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
    if (!(moveStep = core.automaticRoute(destX, destY))) {
        if (destX == core.status.hero.loc.x && destY == core.status.hero.loc.y){
            moveStep=[];
        } else {
            core.canvas.ui.clearRect(0, 0, 416, 416);
            return;
        }
    }
    moveStep=moveStep.concat(stepPostfix);
    core.status.automaticRoutingTemp.destX = destX;
    core.status.automaticRoutingTemp.destY = destY;
    core.canvas.ui.save();
    core.canvas.ui.clearRect(0, 0, 416, 416);
    core.canvas.ui.fillStyle = '#bfbfbf';
    core.canvas.ui.strokeStyle = '#bfbfbf';
    core.canvas.ui.lineWidth = 8;
    for (var m = 0; m < moveStep.length; m++) {
        if (tempStep == null) {
            step++;
            tempStep = moveStep[m].direction;
        }
        else if (tempStep == moveStep[m].direction) {
            step++;
        }
        else {
            core.status.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
            step = 1;
            tempStep = moveStep[m].direction;
        }
        if (m == moveStep.length - 1) {
            core.status.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
            core.canvas.ui.fillRect(moveStep[m].x * 32 + 10, moveStep[m].y * 32 + 10, 12, 12);
        }
        else {
            core.canvas.ui.beginPath();
            if (core.isset(moveStep[m + 1]) && tempStep != moveStep[m + 1].direction) {
                if (tempStep == 'up' && moveStep[m + 1].direction == 'left' || tempStep == 'right' && moveStep[m + 1].direction == 'down') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
                }
                else if (tempStep == 'up' && moveStep[m + 1].direction == 'right' || tempStep == 'left' && moveStep[m + 1].direction == 'down') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
                }
                else if (tempStep == 'left' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'right') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
                }
                else if (tempStep == 'right' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'left') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
                }
                core.canvas.ui.stroke();
                continue;
            }
            switch (tempStep) {
                case 'up':
                case 'down':
                    core.canvas.ui.beginPath();
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
                    core.canvas.ui.stroke();
                    break;
                case 'left':
                case 'right':
                    core.canvas.ui.beginPath();
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
                    core.canvas.ui.stroke();
                    break;
            }
        }
    }
    core.canvas.ui.restore();
    core.status.automaticRouted = true;

    // 立刻移动
    core.status.automaticRouting = true;
    // core.setAutoHeroMove(core.status.automaticRoutingTemp.moveStep);
    core.setAutoHeroMove(core.status.automaticRoutingTemp.moveStep);
    core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};

}
// BFS
core.prototype.automaticRoute = function (destX, destY) {
    var startX = core.getHeroLoc('x');
    var startY = core.getHeroLoc('y');
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    var queue = [];
    var nowDeep = 0;
    var route = [];
    var ans = []
    
    if (destX == startX && destY == startY) return false;
    queue.push(13 * startX + startY);
    queue.push(-1);
    route[13 * startX + startY] = '';
    
    while (queue.length != 1) {
        var f = queue.shift();
        if (f===-1) {nowDeep+=1;queue.push(-1);continue;}
        var deep = ~~(f/169);
        if (deep!==nowDeep) {queue.push(f);continue;}
        f=f%169;
        var nowX = parseInt(f / 13), nowY = f % 13;
    
        for (var direction in scan) {
        
            var nx = nowX + scan[direction].x;
            var ny = nowY + scan[direction].y;
            if (nx<0 || nx>12 || ny<0 || ny>12) continue;
            var nid = 13 * nx + ny;
    
            if (core.isset(route[nid])) continue;
    
            if (nx == destX && ny == destY) {
                route[nid] = direction;
                break;
            }
            if (core.noPassExists(nx, ny))
                continue;
            var deepAdd=1;
            var block = core.getBlock(nx,ny);
            if (block!=null) {
                var id = block.block.event.id;
                // 绕过路障
                if (id.substring(id.length-3)=="Net") deepAdd=100;
                // 绕过血瓶
                if (!core.flags.potionWhileRouting && id.substring(id.length-6)=="Potion") deepAdd=20;
                // 绕过可能的夹击点
                if (block.block.event.trigger == 'checkBlock') deepAdd=200;
            }
            route[nid] = direction;
            queue.push(169*(nowDeep+deepAdd)+nid);
        }
        if (core.isset(route[13 * destX + destY])) break;
    }

    if (!core.isset(route[13 * destX + destY])) {
        return false;
    }

    var nowX = destX, nowY = destY;
    while (nowX != startX || nowY != startY) {
        var dir = route[13 * nowX + nowY];
        ans.push({'direction': dir, 'x': nowX, 'y': nowY});
        nowX -= scan[dir].x;
        nowY -= scan[dir].y;
    }

    ans.reverse();
    return ans;
}

core.prototype.fillPosWithPoint = function (pos) {
    core.fillRect('ui', pos.x*32+12,pos.y*32+12,8,8, '#bfbfbf');
}

core.prototype.clearStepPostfix = function () {
    if(core.status.mouseOutCheck >0){
        core.status.mouseOutCheck--;
        window.setTimeout(core.clearStepPostfix,1000);
        return;
    }
    core.status.holdingPath=0;
    if(core.status.stepPostfix.length>0){
        core.status.stepPostfix=[];
        core.canvas.ui.clearRect(0, 0, 416,416);
        core.canvas.ui.restore();
    }
}

/////////// 寻路代码相关 END ///////////



/////////// 自动行走 & 行走控制 ///////////

core.prototype.stopAutoHeroMove = function () {
    core.status.autoHeroMove = false;
    core.status.automaticRouting = false;
    core.status.automaticRouted = false;
    core.status.autoStep = 0;
    core.status.destStep = 0;
    core.status.movedStep = 0;
    core.status.autoStepRoutes = [];
    core.stopHero();
    clearInterval(core.interval.heroAutoMoveScan);
}

core.prototype.setAutoHeroMove = function (steps, start) {
    if (steps.length == 0) {
        return;
    }
    core.status.autoStepRoutes = steps;
    core.status.autoStep = 0;
    clearInterval(core.interval.heroAutoMoveScan);
    core.interval.heroAutoMoveScan = window.setInterval(function () {
        if (!core.status.autoHeroMove) {
            if (core.status.autoStep == core.status.autoStepRoutes.length) {
                core.stopAutoHeroMove();
                return;
            }
            core.autoHeroMove(core.status.autoStepRoutes[core.status.autoStep].direction, core.status.autoStepRoutes[core.status.autoStep].step);
            core.status.autoStep++;
        }
    }, 80);
}

core.prototype.autoHeroMove = function (direction, step) {
    core.status.autoHeroMove = true;
    core.status.destStep = step;
    core.moveHero(direction);
}

core.prototype.setHeroMoveInterval = function (direction, x, y, callback) {
    if (core.status.heroMoving) {
        return;
    }
    core.status.heroMoving = true;
    var moveStep = 0;
    core.interval.heroMoveInterval = window.setInterval(function () {
        switch (direction) {
            case 'up':
                moveStep -= 4;
                if (moveStep == -4 || moveStep == -8 || moveStep == -12 || moveStep == -16) {
                    core.drawHero(direction, x, y, 'leftFoot', 0, moveStep);
                }
                else if (moveStep == -20 || moveStep == -24 || moveStep == -28 || moveStep == -32) {
                    core.drawHero(direction, x, y, 'rightFoot', 0, moveStep);
                }
                if (moveStep == -32) {
                    core.setHeroLoc('y', '--');
                    core.moveOneStep();
                    if (core.status.heroStop) {
                        core.drawHero(direction, x, y - 1, 'stop');
                    }
                    if (core.isset(callback)) {
                        callback();
                    }
                }
                break;
            case 'left':
                moveStep -= 4;
                if (moveStep == -4 || moveStep == -8 || moveStep == -12 || moveStep == -16) {
                    core.drawHero(direction, x, y, 'leftFoot', moveStep);
                }
                else if (moveStep == -20 || moveStep == -24 || moveStep == -28 || moveStep == -32) {
                    core.drawHero(direction, x, y, 'rightFoot', moveStep);
                }
                if (moveStep == -32) {
                    core.setHeroLoc('x', '--');
                    core.moveOneStep();
                    if (core.status.heroStop) {
                        core.drawHero(direction, x - 1, y, 'stop');
                    }
                    if (core.isset(callback)) {
                        callback();
                    }
                }
                break;
            case 'down':
                moveStep+=4;
                if(moveStep == 4 || moveStep == 8 || moveStep == 12 || moveStep == 16) {
                    core.drawHero(direction, x, y, 'leftFoot', 0, moveStep);
                }
                else if(moveStep == 20 || moveStep == 24 ||moveStep == 28 || moveStep == 32) {
                    core.drawHero(direction, x, y, 'rightFoot', 0, moveStep);
                }
                if (moveStep == 32) {
                    core.setHeroLoc('y', '++');
                    core.moveOneStep();
                    if (core.status.heroStop) {
                        core.drawHero(direction, x, y + 1, 'stop');
                    }
                    if (core.isset(callback)) {
                        callback();
                    }
                }
                break;
            case 'right':
                moveStep+=4;
                if(moveStep == 4 || moveStep == 8 || moveStep == 12 || moveStep == 16) {
                    core.drawHero(direction, x, y, 'leftFoot', moveStep);
                }
                else if(moveStep == 20 || moveStep == 24 ||moveStep == 28 || moveStep == 32) {
                    core.drawHero(direction, x, y, 'rightFoot', moveStep);
                }
                if (moveStep == 32) {
                    core.setHeroLoc('x', '++');
                    core.moveOneStep();
                    if (core.status.heroStop) {
                        core.drawHero(direction, x + 1, y, 'stop');
                    }
                    if (core.isset(callback)) {
                        callback();
                    }
                }
                break;
        }
    }, 10);
}

core.prototype.setHeroMoveTriggerInterval = function () {
    var direction, x, y;
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    core.interval.heroMoveTriggerInterval = window.setInterval(function () {
        if (!core.status.heroStop) {
            direction = core.getHeroLoc('direction');
            x = core.getHeroLoc('x');
            y = core.getHeroLoc('y');
            var noPass;
            noPass = core.noPass(x + scan[direction].x, y + scan[direction].y);
            if (noPass) {
                core.trigger(x + scan[direction].x, y + scan[direction].y);
                core.drawHero(direction, x, y, 'stop');
                if (core.status.autoHeroMove) {
                    core.status.movedStep++;
                    if (core.status.destStep == core.status.movedStep) {
                        core.status.autoHeroMove = false;
                        core.status.destStep = 0;
                        core.status.movedStep = 0;
                        core.status.moveStepBeforeStop=[];
                        core.stopAutomaticRoute();
                    }
                }
                else {
                    core.status.heroStop = true;
                }
                return;
            }
            core.setHeroMoveInterval(direction, x, y, function () {
                if (core.status.autoHeroMove) {
                    core.status.movedStep++;
                    if (core.status.destStep == core.status.movedStep) {
                        core.status.autoHeroMove = false;
                        core.status.destStep = 0;
                        core.status.movedStep = 0;
                        core.stopHero();
                        core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                    }
                }
                else if (core.status.heroStop) {
                    core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                }
                core.trigger(core.getHeroLoc('x'), core.getHeroLoc('y'));
                clearInterval(core.interval.heroMoveInterval);
                core.status.heroMoving = false;
            });
        }
    }, 50);
}

core.prototype.turnHero = function(direction) {
    if (core.isset(direction)) {
        core.status.hero.loc.direction = direction;
    }
    else if (core.status.hero.loc.direction == 'up') core.status.hero.loc.direction = 'right';
    else if (core.status.hero.loc.direction == 'right') core.status.hero.loc.direction = 'down';
    else if (core.status.hero.loc.direction == 'down') core.status.hero.loc.direction = 'left';
    else if (core.status.hero.loc.direction == 'left') core.status.hero.loc.direction = 'up';
    core.drawHero(core.status.hero.loc.direction, core.status.hero.loc.x, core.status.hero.loc.y, 'stop', 0, 0);
    core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
    core.canvas.ui.clearRect(0, 0, 416, 416);
}

core.prototype.moveHero = function (direction) {
    core.setHeroLoc('direction', direction);
    core.status.heroStop = false;
}

core.prototype.moveOneStep = function() {
    // 中毒状态
    if (core.hasFlag('poison')) {
        core.status.hero.hp -= core.values.poisonDamage;
        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose('poison');
            return;
        }
        core.updateStatusBar();
    }
}

core.prototype.waitHeroToStop = function(callback) {
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    if (core.isset(callback)) {
        core.lockControl();
        setTimeout(function(){
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            callback();
        }, 30);
    }
}

core.prototype.stopHero = function () {
    core.status.heroStop = true;
}

core.prototype.drawHero = function (direction, x, y, status, offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    core.clearAutomaticRouteNode(x, y);
    var heroIcon = core.material.icons.hero[direction];
    x = x * 32;
    y = y * 32;
    core.canvas.hero.clearRect(x - 32, y - 32, 96, 96);
    var height=core.material.icons.hero.height;
    core.canvas.hero.drawImage(core.material.images.hero, heroIcon[status] * 32, heroIcon.loc * height, 32, height, x + offsetX, y + offsetY + 32-height, 32, height);
}

/////////// 自动行走 & 行走控制 END ///////////



/////////// 地图处理 ///////////

// 开门
core.prototype.openDoor = function (id, x, y, needKey, callback) {

    if (core.interval.openDoorAnimate!=null) return;

    // 是否存在门
    if (!core.terrainExists(x, y, id)) {
        if (core.isset(callback)) callback();
        return;
    }
    if (core.status.moveStepBeforeStop.length==0) {
        core.status.moveStepBeforeStop=core.status.autoStepRoutes.slice(core.status.autoStep-1,core.status.autoStepRoutes.length);
        if (core.status.moveStepBeforeStop.length>=1)core.status.moveStepBeforeStop[0].step-=core.status.movedStep;
    }
    core.stopHero();
    core.stopAutomaticRoute();
    var speed=30;
    if (needKey) {
        var key = id.replace("Door", "Key");
        if (!core.removeItem(key)) {
            if (key != "specialKey")
                core.drawTip("你没有" + core.material.items[key].name);
            else core.drawTip("无法开启此门");
            core.clearContinueAutomaticRoute();
            if (core.isset(callback)) callback();
            return;
        }
    }
    // open
    core.playSound("door", "ogg");
    var state = 0;
    var doorId = id;
    if (!(doorId.substring(doorId.length-4)=="Door")) {
        doorId=doorId+"Door";
        speed=100;
    }
    var door = core.material.icons.animates[doorId];
    core.interval.openDoorAnimate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(core.interval.openDoorAnimate);
            core.interval.openDoorAnimate=null;
            core.removeBlock(x, y);
            core.events.afterOpenDoor(id,x,y,callback);
            return;
        }
        core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
        core.canvas.event.drawImage(core.material.images.animates, 32 * state, 32 * door, 32, 32, 32 * x, 32 * y, 32, 32);
    }, speed)
}

// 战斗
core.prototype.battle = function (id, x, y, force, callback) {
    if (core.status.moveStepBeforeStop.length==0) {
        core.status.moveStepBeforeStop=core.status.autoStepRoutes.slice(core.status.autoStep-1,core.status.autoStepRoutes.length);
        if (core.status.moveStepBeforeStop.length>=1)core.status.moveStepBeforeStop[0].step-=core.status.movedStep;
    }
    core.stopHero();
    core.stopAutomaticRoute();

    var damage = core.enemys.getDamage(id);
    // 非强制战斗
    if (damage >= core.status.hero.hp && !force) {
        core.drawTip("你打不过此怪物！");
        core.clearContinueAutomaticRoute();
        return;
    }
    if (core.flags.battleAnimate) {
        core.waitHeroToStop(function() {
            core.ui.drawBattleAnimate(id, function() {
                core.afterBattle(id, x, y, callback);
            });
        });
    }
    else {
        core.playSound('attack', 'ogg');
        core.afterBattle(id, x, y, callback);
    }
}

core.prototype.afterBattle = function(id, x, y, callback) {
    core.status.hero.hp -= core.enemys.getDamage(id);
    if (core.status.hero.hp<=0) {
        core.status.hero.hp=0;
        core.updateStatusBar();
        core.events.lose('battle');
        return;
    }
    var money = core.material.enemys[id].money;
    if (core.hasItem('coin')) money *= 2;
    if (core.hasFlag('curse')) money=0;
    core.status.hero.money += money;
    var experience = core.material.enemys[id].experience;
    if (core.hasFlag('curse')) experience=0;
    core.status.hero.experience += experience;
    core.updateStatusBar();
    if (core.isset(x) && core.isset(y)) {
        core.removeBlock(x, y);
        core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
    }
    core.updateFg();
    var hint = "打败 " + core.material.enemys[id].name + "，金币+" + money;
    if (core.flags.enableExperience)
        hint += "，经验+" + core.material.enemys[id].experience;
    core.drawTip(hint);

    // 打完怪物，触发事件
    core.events.afterBattle(id,x,y,callback);

}

core.prototype.trigger = function (x, y) {
    var mapBlocks = core.status.thisMap.blocks;
    var noPass;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable)) { // 启用事件
            noPass = mapBlocks[b].event && mapBlocks[b].event.noPass;
            if (noPass) {
                core.clearAutomaticRouteNode(x, y);
            }
            if (core.isset(mapBlocks[b].event) && core.isset(mapBlocks[b].event.trigger)) {
                var trigger = mapBlocks[b].event.trigger;
                // 转换楼层能否穿透
                if (trigger=='changeFloor' && (core.status.autoHeroMove || core.status.autoStep<core.status.autoStepRoutes.length)) {
                    var canCross = core.flags.portalWithoutTrigger;
                    if (core.isset(mapBlocks[b].event.data) && core.isset(mapBlocks[b].event.data.portalWithoutTrigger))
                        canCross=mapBlocks[b].event.data.portalWithoutTrigger;
                    if (canCross) continue;
                }
                core.material.events[trigger](mapBlocks[b], core, function (data) {

                });
            }
        }
    }
}

// 楼层切换
core.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback) {
    time = time || 800;
    time /= 20;
    core.lockControl();
    core.stopHero();
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    core.dom.floorNameLabel.innerHTML = core.status.maps[floorId].title;
    if (core.isset(stair)) {
        // find heroLoc
        heroLoc = core.status.hero.loc;
        var blocks = core.status.maps[floorId].blocks;
        for (var i in blocks) {
            if (core.isset(blocks[i].event) && !(core.isset(blocks[i].enable) && !blocks[i].enable) && blocks[i].event.id === stair) {
                heroLoc.x = blocks[i].x;
                heroLoc.y = blocks[i].y;
            }
        }
    }
    if (core.status.maps[floorId].canFlyTo && core.status.hero.flyRange.indexOf(floorId)<0) {
        if (core.floorIds.indexOf(floorId)>core.floorIds.indexOf(core.status.floorId))
            core.status.hero.flyRange.push(floorId);
        else
            core.status.hero.flyRange.unshift(floorId);
    }

    window.setTimeout(function () {
        // console.log('地图切换到' + floorId);
        core.playSound('floor', 'mp3');
        core.mapChangeAnimate('show', time/2, function () {
            core.statusBar.floor.innerHTML = core.status.maps[floorId].name;
            core.updateStatusBar();
            core.drawMap(floorId, function () {
                setTimeout(function() {
                    core.mapChangeAnimate('hide', time/4, function () {
                        core.unLockControl();
                        core.events.afterChangeFloor(floorId);
                        if (core.isset(callback)) callback();
                    });
                    if (core.isset(heroLoc.direction))
                        core.setHeroLoc('direction', heroLoc.direction);
                    core.setHeroLoc('x', heroLoc.x);
                    core.setHeroLoc('y', heroLoc.y);
                    core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                    core.updateFg();
                }, 15)
            });
        });
    }, 50);
}

// 地图切换
core.prototype.mapChangeAnimate = function (mode, time, callback) {
    if (mode == 'show') {
        core.show(core.dom.floorMsgGroup, time, function () {
            callback();
        });
    }
    else {
        core.hide(core.dom.floorMsgGroup, time, function () {
            callback();
        });
    }
}

core.prototype.clearMap = function (map, x, y, width, height) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].clearRect(0, 0, 416, 416);
        }
    }
    else {
        core.canvas[map].clearRect(x, y, width, height);
    }
}

core.prototype.fillText = function (map, text, x, y, style, font) {
    if (core.isset(style)) {
        core.setFillStyle(map, style);
    }
    if (core.isset(font)) {
        core.setFont(map, font);
    }
    core.canvas[map].fillText(text, x, y);
}

core.prototype.fillRect = function (map, x, y, width, height, style) {
    if (core.isset(style)) {
        core.setFillStyle(map, style);
    }
    core.canvas[map].fillRect(x, y, width, height);
}

core.prototype.strokeRect = function (map, x, y, width, height, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    core.canvas[map].strokeRect(x, y, width, height);
}

core.prototype.drawLine = function (map, x1, y1, x2, y2, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    core.canvas[map].beginPath();
    core.canvas[map].moveTo(x1, y1);
    core.canvas[map].lineTo(x2, y2);
    core.canvas[map].stroke();
}

core.prototype.setFont = function (map, font) {
    core.canvas[map].font = font;
}

core.prototype.setLineWidth = function (map, lineWidth) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].lineWidth = lineWidth;
        }
    }
    core.canvas[map].lineWidth = lineWidth;
}

core.prototype.saveCanvas = function (map) {
    core.canvas[map].save();
}

core.prototype.loadCanvas = function (map) {
    core.canvas[map].restore();
}

core.prototype.setStrokeStyle = function (map, style) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].strokeStyle = style;
        }
    }
    else {
        core.canvas[map].strokeStyle = style;
    }
}

core.prototype.setAlpha = function (map, alpha) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].globalAlpha = alpha;
        }
    }
    else core.canvas[map].globalAlpha = alpha;
}

core.prototype.setOpacity = function (map, opacity) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].canvas.style.opacity = opacity;
        }
    }
    else core.canvas[map].canvas.style.opacity = opacity;
}

core.prototype.setFillStyle = function (map, style) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].fillStyle = style;
        }
    }
    else {
        core.canvas[map].fillStyle = style;
    }
}

/**
 * 地图绘制
 * @param mapName 地图ID
 * @param callback 绘制完毕后的回调函数
 */
core.prototype.drawMap = function (mapName, callback) {
    var mapData = core.status.maps[mapName];
    var mapBlocks = mapData.blocks;
    core.status.floorId = mapName;
    core.status.thisMap = mapData;
    var blockIcon, blockImage;
    core.clearMap('all');
    core.removeGlobalAnimate(null, null, true);
    for (var x = 0; x < 13; x++) {
        for (var y = 0; y < 13; y++) {
            blockIcon = core.material.icons.terrains.ground;
            blockImage = core.material.images.terrains;
            core.canvas.bg.drawImage(blockImage, 0, blockIcon * 32, 32, 32, x * 32, y * 32, 32, 32);
        }
    }
    for (var b = 0; b < mapBlocks.length; b++) {
        // 事件启用
        if (core.isset(mapBlocks[b].event) && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable)) {
            blockIcon = core.material.icons[mapBlocks[b].event.cls][mapBlocks[b].event.id];
            blockImage = core.material.images[mapBlocks[b].event.cls];
            core.canvas.event.drawImage(core.material.images[mapBlocks[b].event.cls], 0, blockIcon * 32, 32, 32, mapBlocks[b].x * 32, mapBlocks[b].y * 32, 32, 32);
            core.addGlobalAnimate(mapBlocks[b].event.animate, mapBlocks[b].x * 32, mapBlocks[b].y * 32, blockIcon, blockImage);
        }
    }
    core.setGlobalAnimate(core.values.animateSpeed);

    if (core.isset(callback))
        callback();
}

core.prototype.noPassExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return core.isset(block.block.event.noPass) && block.block.event.noPass;
}

core.prototype.noPass = function (x, y) {
    return x<0 || x>12 || y<0 || y>12 || core.noPassExists(x,y);
}

core.prototype.npcExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls == 'npcs';
}

core.prototype.terrainExists = function (x, y, id, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='terrains' && block.block.event.id==id;
}

core.prototype.stairExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='terrains' && (block.block.event.id=='upFloor' || block.block.event.id=='downFloor');
}

core.prototype.nearStair = function() {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
    return core.stairExists(x,y) || core.stairExists(x-1,y) || core.stairExists(x,y-1) || core.stairExists(x+1,y) || core.stairExists(x,y+1);
}

core.prototype.enemyExists = function (x, y, id,floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='enemys' && block.block.event.id==id;
}

core.prototype.getBlock = function (x, y, floorId, needEnable) {
    if (!core.isset(floorId)) floorId=core.status.floorId;
    if (!core.isset(needEnable)) needEnable=true;
    var blocks = core.status.maps[floorId].blocks;
    for (var n=0;n<blocks.length;n++) {
        if (blocks[n].x==x && blocks[n].y==y && core.isset(blocks[n].event)) {
            if (needEnable && core.isset(blocks[n].enable) && !blocks[n].enable) return null;
            return {"index": n, "block": blocks[n]};
        }
    }
    return null;
}

core.prototype.moveBlock = function(x,y,steps,time,immediateHide,callback) {
    time = time || 500;

    clearInterval(core.interval.tipAnimate);
    core.saveCanvas('data');
    core.clearMap('data', 0, 0, 416, 416);

    var block = core.getBlock(x,y,core.status.floorId,false);
    if (block==null) {// 不存在
        if (core.isset(callback)) callback();
        return;
    }

    // 需要删除该块
    core.removeBlock(x,y);

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    block=block.block;
    blockIcon = core.material.icons[block.event.cls][block.event.id];
    blockImage = core.material.images[block.event.cls];

    // 绘制data层
    var opacityVal = 1;
    core.setOpacity('data', opacityVal);
    core.canvas.data.drawImage(blockImage, 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);

    // 要运行的轨迹：将steps展开
    var moveSteps=[];
    steps.forEach(function (e) {
        if (typeof e=="string") {
            moveSteps.push(e);
        }
        else {
            if (!core.isset(e.value)) {
                moveSteps.push(e.direction)
            }
            else {
                for (var i=0;i<e.value;i++) {
                    moveSteps.push(e.direction);
                }
            }
        }
    });

    var nowX=32*x, nowY=32*y, step=0;
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    var animate=window.setInterval(function() {
        // 已经移动完毕，消失
        if (moveSteps.length==0) {
            if (immediateHide) opacityVal=0;
            else opacityVal -= 0.06;
            core.setOpacity('data', opacityVal);
            core.clearMap('data', nowX, nowY, 32, 32);
            core.canvas.data.drawImage(blockImage, 0, blockIcon * 32, 32, 32, nowX, nowY, 32, 32);
            if (opacityVal<=0) {
                clearInterval(animate);
                core.loadCanvas('data');
                core.clearMap('data', 0, 0, 416, 416);
                core.setOpacity('data', 1);
                if (core.isset(callback)) callback();
            }
        }
        else {
            // 移动中
            step++;
            nowX+=scan[moveSteps[0]].x*2;
            nowY+=scan[moveSteps[0]].y*2;
            core.clearMap('data', nowX-32, nowY-32, 96, 96);
            // 绘制
            core.canvas.data.drawImage(blockImage, 0, blockIcon * 32, 32, 32, nowX, nowY, 32, 32);
            if (step==16) {
                // 该移动完毕，继续
                step=0;
                moveSteps.shift();
            }
        }
    }, time/16);
}

core.prototype.animateBlock = function (x,y,type,time,callback) {
    if (type!='hide') type='show';

    clearInterval(core.interval.tipAnimate);
    core.saveCanvas('data');
    core.clearMap('data', 0, 0, 416, 416);

    var block = core.getBlock(x,y,core.status.floorId,false);
    if (block==null) {// 不存在
        if (core.isset(callback)) callback();
        return;
    }
    // 清空UI
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    block=block.block;
    blockIcon = core.material.icons[block.event.cls][block.event.id];
    blockImage = core.material.images[block.event.cls];

    var opacityVal = 0;
    if (type=='hide') opacityVal=1;

    core.setOpacity('data', opacityVal);
    core.canvas.data.drawImage(blockImage, 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);

    var animate = window.setInterval(function () {
        if (type=='show') opacityVal += 0.1;
        else opacityVal -= 0.1;
        core.setOpacity('data', opacityVal);
        core.clearMap('data',block.x * 32, block.y * 32, 32, 32);
        core.canvas.data.drawImage(blockImage, 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
        if (opacityVal >=1 || opacityVal<=0) {
            clearInterval(animate);
            core.loadCanvas('data');
            core.clearMap('data', 0, 0, 416, 416);
            core.setOpacity('data', 1);
            if (core.isset(callback)) callback();
        }
    }, time/10);
}

// 显示一个事件
core.prototype.addBlock = function(x,y,floodId) {
    floodId = floodId || core.status.floorId;
    var block = core.getBlock(x,y,floodId,false);
    if (block==null) return; // 不存在
    block=block.block;
    // 本身是禁用事件，启用之
    if (core.isset(block.enable) && !block.enable) {
        block.enable = true;
        // 在本层，添加动画
        if (floodId == core.status.floorId && core.isset(block.event)) {
            blockIcon = core.material.icons[block.event.cls][block.event.id];
            blockImage = core.material.images[block.event.cls];
            core.canvas.event.drawImage(core.material.images[block.event.cls], 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
            core.addGlobalAnimate(block.event.animate, block.x * 32, block.y * 32, blockIcon, blockImage);
            core.setGlobalAnimate(core.values.animateSpeed);
        }
    }
}

core.prototype.removeBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;

    var block = core.getBlock(x,y,floorId,false);
    if (block==null) return; // 不存在

    var index=block.index;

    // 删除动画，清除地图
    if (floorId==core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.canvas.event.clearRect(x * 32, y * 32, 32, 32);
    }

    // 删除Index
    core.removeBlockById(index, floorId);
    core.updateFg();
}


core.prototype.removeBlockById = function (index, floorId) {

    var blocks = core.status.maps[floorId].blocks;
    var x=blocks[index].x, y=blocks[index].y;

    // 检查该点是否是checkBlock
    if (core.floors[floorId].checkBlock.indexOf(x+","+y)>=0) {
        blocks[index] = {'x': x, 'y': y, 'event': {'cls': 'terrains', 'id': 'ground', 'noPass': false, 'trigger': 'checkBlock'}};
        return;
    }

    // 检查该点是否存在事件
    var event = core.floors[floorId].events[x+","+y];
    if (!core.isset(event))
        event = core.floors[floorId].changeFloor[x+","+y];

    // 不存在事件，直接删除
    if (!core.isset(event)) {
        blocks.splice(index,1);
        return;
    }

    blocks[index].enable = false;
}

core.prototype.removeBlockByIds = function (floorId, ids) {
    ids.sort(function (a,b) {return b-a}).forEach(function (id) {
        core.removeBlockById(id, floorId);
    });
}

core.prototype.addGlobalAnimate = function (animateMore, x, y, loc, image) {
    if (animateMore == 2) {
        core.status.twoAnimateObjs.push({
            'x': x,
            'y': y,
            'status': 0,
            'loc': loc,
            'image': image
        });
    }
    else if (animateMore == 4) {
        core.status.fourAnimateObjs.push({
            'x': x,
            'y': y,
            'status': 0,
            'loc': loc,
            'image': image
        });
    }
}

core.prototype.removeGlobalAnimate = function (x, y, all) {
    if (all == true) {
        core.status.twoAnimateObjs = [];
        core.status.fourAnimateObjs = [];
    }
    for (var t = 0; t < core.status.twoAnimateObjs.length; t++) {
        if (core.status.twoAnimateObjs[t].x == x * 32 && core.status.twoAnimateObjs[t].y == y * 32) {
            core.status.twoAnimateObjs.splice(t, 1);
            return;
        }
    }
    for (var f = 0; f < core.status.fourAnimateObjs.length; f++) {
        if (core.status.fourAnimateObjs[f].x == x * 32 && core.status.fourAnimateObjs[f].y == y * 32) {
            core.status.fourAnimateObjs.splice(f, 1);
            return;
        }
    }
}

core.prototype.setGlobalAnimate = function (speed) {
    clearInterval(core.interval.twoAnimate);
    clearInterval(core.interval.fourAnimate);
    var animateClose = false;
    core.interval.twoAnimate = window.setInterval(function () {
        for (var a = 0; a < core.status.twoAnimateObjs.length; a++) {
            var obj = core.status.twoAnimateObjs[a];
            obj.status = (obj.status+1)%2;
            core.canvas.event.clearRect(obj.x, obj.y, 32, 32);
            if (!animateClose) {
                core.canvas.event.drawImage(obj.image, obj.status * 32, obj.loc * 32, 32, 32, obj.x, obj.y, 32, 32);
            }
            animateClose = false;
        }
    }, speed);
    core.interval.fourAnimate = window.setInterval(function () {
        for (var a = 0; a < core.status.fourAnimateObjs.length; a++) {
            var obj=core.status.fourAnimateObjs[a];
            obj.status = (obj.status+1)%4;
            core.canvas.event.clearRect(obj.x, obj.y, 32, 32);
            if (!animateClose) {
                core.canvas.event.drawImage(obj.image, obj.status * 32, obj.loc * 32, 32, 32, obj.x, obj.y, 32, 32);
            }
            animateClose = false;
        }
    }, speed / 2);
}

core.prototype.setBoxAnimate = function () {
    clearInterval(core.interval.boxAnimate);
    if (core.status.boxAnimateObjs.length > 0) {
        var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
        core.drawBoxAnimate(background);
        core.interval.boxAnimate = setInterval(function () {
            core.drawBoxAnimate(background);
        }, core.values.animateSpeed);
    }
}

core.prototype.drawBoxAnimate = function (background) {
    for (var a = 0; a < core.status.boxAnimateObjs.length; a++) {
        var obj = core.status.boxAnimateObjs[a];
        obj.status = obj.status == 0 ? 1 : 0;
        core.clearMap('ui', obj.bgx, obj.bgy, obj.bgsize, obj.bgsize);
        core.fillRect('ui', obj.bgx, obj.bgy, obj.bgsize, obj.bgsize, background);
        core.canvas.ui.drawImage(obj.image, obj.status * 32, obj.icon * 32,
            32, 32, obj.x, obj.y, 32, 32);
    }
}

core.prototype.setFg = function(color, time, callback) {
    time = time || 750;
    core.setOpacity('fg', 1);

    var fromAlpha = 0;
    if (core.isset(core.status.event.data.currentColor)) {
        fromAlpha = 1;
    }
    else {
        core.status.event.data.currentColor = [0,0,0];
    }

    var fromColor = core.status.event.data.currentColor;

    var toAlpha = 1;
    if (!core.isset(color)) {
        color = [0,0,0];
        toAlpha=0;
    }

    var step=0;
    var changeAnimate = setInterval(function() {
        step++;
        core.clearMap('fg', 0, 0, 416, 416);

        var nowAlpha = fromAlpha+(toAlpha-fromAlpha)*step/25;
        var nowR = parseInt(fromColor[0]+(color[0]-fromColor[0])*step/25);
        var nowG = parseInt(fromColor[1]+(color[1]-fromColor[1])*step/25);
        var nowB = parseInt(fromColor[2]+(color[2]-fromColor[2])*step/25);
        if (nowR<0) nowR=0; if (nowR>255) nowR=255;
        if (nowG<0) nowG=0; if (nowG>255) nowG=255;
        if (nowB<0) nowB=0; if (nowB>255) nowB=255;

        core.setAlpha('fg', nowAlpha);
        var toRGB = "#"+nowR.toString(16)+nowG.toString(16)+nowB.toString(16);
        core.fillRect('fg', 0, 0, 416, 416, toRGB);

        if (step>=25) {
            clearInterval(changeAnimate);
            if (toAlpha==0) {
                core.clearMap('fg', 0, 0, 416, 416);
                delete core.status.event.data.currentColor;
                core.setAlpha('fg', 1);
                core.updateFg();
            }
            else core.status.event.data.currentColor = color;
            if (core.isset(callback)) callback();
        }
    }, time/25);

}


core.prototype.setHeroLoc = function (itemName, itemVal) {
    if (itemVal == '++') {
        core.status.hero.loc[itemName]++;
        return;
    }
    else if (itemVal == '--') {
        core.status.hero.loc[itemName]--;
        return;
    }
    core.status.hero.loc[itemName] = itemVal;
}

core.prototype.getHeroLoc = function (itemName) {
    if (!core.isset(itemName)) return core.status.hero.loc;
    return core.status.hero.loc[itemName];
}

core.prototype.nextX = function() {
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    return core.getHeroLoc('x')+scan[core.getHeroLoc('direction')].x;
}

core.prototype.nextY = function () {
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    return core.getHeroLoc('y')+scan[core.getHeroLoc('direction')].y;
}

/**
 * 更新显伤
 */
core.prototype.updateFg = function () {

    // 如果存在颜色
    if (core.isset(core.status.event.data) && core.isset(core.status.event.data.currentColor)) {
        var color=core.status.event.data.currentColor;
        core.fillRect("fg",0,0,416,416,"#"+color[0].toString(16)+color[1].toString(16)+color[2].toString(16));
        return;
    }

    if (!core.isset(core.status.thisMap) || !core.isset(core.status.thisMap.blocks)) return;
    // 更新显伤
    var mapBlocks = core.status.thisMap.blocks;
    core.clearMap('fg', 0, 0, 416, 416);
    // 没有怪物手册
    if (!core.hasItem('book')) return;
    core.setFont('fg', "bold 11px Arial");
    var hero_hp = core.status.hero.hp;
    for (var b = 0; b < mapBlocks.length; b++) {
        var x = mapBlocks[b].x, y = mapBlocks[b].y;
        if (core.isset(mapBlocks[b].event) && mapBlocks[b].event.cls == 'enemys' && mapBlocks[b].event.trigger=='battle'
                && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable)) {
            var id = mapBlocks[b].event.id;

            var damage = core.enemys.getDamage(id);
            var color = "#000000";
            if (damage <= 0) color = '#00FF00';
            else if (damage < hero_hp / 3) color = '#FFFFFF';
            else if (damage < hero_hp * 2 / 3) color = '#FFFF00';
            else if (damage < hero_hp) color = '#FF7F00';
            else color = '#FF0000';

            if (damage >= 999999999) damage = "???";
            else if (damage > 100000) damage = (damage / 10000).toFixed(1) + "w";

            core.setFillStyle('fg', '#000000');
            core.canvas.fg.fillText(damage, 32 * x + 2, 32 * (y + 1) - 2);
            core.canvas.fg.fillText(damage, 32 * x, 32 * (y + 1) - 2);
            core.canvas.fg.fillText(damage, 32 * x + 2, 32 * (y + 1));
            core.canvas.fg.fillText(damage, 32 * x, 32 * (y + 1));

            core.setFillStyle('fg', color);
            core.canvas.fg.fillText(damage, 32 * x + 1, 32 * (y + 1) - 1);

        }
    }
}

/**
 * 物品处理 start
 */
core.prototype.itemCount = function (itemId) {
    if (!core.isset(itemId) || !core.isset(core.material.items[itemId])) return 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls=="items") return 0;
    return core.isset(core.status.hero.items[itemCls][itemId]) ? core.status.hero.items[itemCls][itemId] : 0;
}

core.prototype.hasItem = function (itemId) {
    return core.itemCount(itemId) > 0;
}

core.prototype.setItem = function (itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
    }
    core.status.hero.items[itemCls][itemId] = itemNum;
}

core.prototype.removeItem = function (itemId) {
    if (!core.hasItem(itemId)) return false;
    var itemCls = core.material.items[itemId].cls;
    core.status.hero.items[itemCls][itemId]--;
    core.updateStatusBar();
    if (itemCls=='tools' && core.status.hero.items[itemCls][itemId]==0) {
        delete core.status.hero.items[itemCls][itemId];
    }
    return true;
}

core.prototype.useItem = function (itemId) {
    core.items.useItem(itemId);
    return;
}

core.prototype.canUseItem = function (itemId) {
    return core.items.canUseItem(itemId);
}

core.prototype.addItem = function (itemId, itemNum) {
    var itemData = core.material.items[itemId];
    var itemCls = itemData.cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
        core.status.hero.items[itemCls][itemId] = 0;
    }
    else if (!core.isset(core.status.hero.items[itemCls][itemId])) {
        core.status.hero.items[itemCls][itemId] = 0;
    }
    core.status.hero.items[itemCls][itemId] += itemNum;
}

core.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    // core.getItemAnimate(itemId, itemNum, itemX, itemY);
    core.playSound('item', 'ogg');
    var itemCls = core.material.items[itemId].cls;
    core.items.getItemEffect(itemId, itemNum);
    core.removeBlock(itemX, itemY);
    var text = '获得 ' + core.material.items[itemId].name;
    if (itemNum > 1) text += "x" + itemNum;
    if (itemCls === 'items') text += core.items.getItemEffectTip(itemId);
    core.drawTip(text, core.material.icons.items[itemId]);
    core.canvas.event.clearRect(itemX * 32, itemY * 32, 32, 32);
    core.updateStatusBar();

    // 检查处理后的事件。
    var event = core.floors[core.status.floorId].afterGetItem[itemX+","+itemY];
    if (core.isset(event)) {
        core.events.doEvents(event, itemX, itemY, callback);
    }
    else if (core.isset(callback)) callback();
}

core.prototype.drawTip = function (text, itemIcon) {
    var textX, textY, width, height, hide = false, opacityVal = 0;
    clearInterval(core.interval.tipAnimate);
    core.setFont('data', "16px Arial");
    core.saveCanvas('data');
    core.setOpacity('data', 0);
    if (!core.isset(itemIcon)) {
        textX = 16;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 16;
        height = 42;
    }
    else {
        textX = 44;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 8;
        height = 42;
    }
    core.interval.tipAnimate = window.setInterval(function () {
        if (hide) {
            opacityVal -= 0.1;
        }
        else {
            opacityVal += 0.1;
        }
        core.setOpacity('data', opacityVal);
        core.clearMap('data', 5, 5, 400, height);
        core.fillRect('data', 5, 5, width, height, '#000');
        if (core.isset(itemIcon)) {
            core.canvas.data.drawImage(core.material.images.items, 0, itemIcon * 32, 32, 32, 10, 8, 32, 32);
        }
        core.fillText('data', text, textX + 5, textY + 15, '#fff');
        if (opacityVal > 0.6 || opacityVal < 0) {
            if (hide) {
                core.loadCanvas('data');
                core.clearMap('data', 5, 5, 400, height);
                core.setOpacity('data', 1);
                clearInterval(core.interval.tipAnimate);
                return;
            }
            else {
                if (!core.timeout.getItemTipTimeout) {
                    core.timeout.getItemTipTimeout = window.setTimeout(function () {
                        hide = true;
                        core.timeout.getItemTipTimeout = null;
                    }, 750);
                }
                opacityVal = 0.6;
                core.setOpacity('data', opacityVal);
            }
        }
    }, 30);
}

core.prototype.drawText = function (contents, callback) {
    if (core.isset(contents)) {
        if (typeof contents == 'string') {
            contents = [{'content': contents}];
        }
        else if (contents instanceof Object && core.isset(contents.content)) {
            contents = [contents];
        }
        else if (!(contents instanceof Array)) {
            core.drawTip("出错了");
            console.log(contents);
            return;
        }

        core.status.event = {'id': 'text', 'data': {'list': contents, 'callback': callback}};
        core.lockControl();

        // wait the hero to stop
        core.stopAutomaticRoute();
        setTimeout(function() {
            core.drawText();
        }, 30);
        return;
    }

    if (core.status.event.data.list.length==0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel(false);
        if (core.isset(callback)) callback();
        return;
    }

    var data=core.status.event.data.list.shift();
    if (typeof data == 'string')
        core.ui.drawTextBox(data);
    else
        core.ui.drawTextBox(data.content, data.id);
    // core.drawTextBox(content);
}

/////////// 地图相关 END ///////////

/**
 * 系统机制 start
 */

// 替换文本中的数为实际值
core.prototype.replaceText = function (text) {
    return text.replace(/\${([^}]+)}/g, function (word, value) {
        return core.calValue(value);
    });
}


core.prototype.calValue = function (value) {
    value=value.replace(/status:([\w\d_]+)/g, "core.getStatus('$1')");
    value=value.replace(/item:([\w\d_]+)/g, "core.itemCount('$1')");
    value=value.replace(/flag:([\w\d_]+)/g, "core.getFlag('$1', false)");
    return eval(value);
}

core.prototype.splitLines = function(canvas, text, maxLength, font) {
    if (core.isset(font)) core.setFont(canvas, font);

    var contents = [];
    var last = 0;
    for (var i=0;i<text.length;i++) {

        if (text.charAt(i)=='\n') {
            contents.push(text.substring(last, i));
            last=i+1;
        }
        else {
            var toAdd = text.substring(last, i+1);
            var width = core.canvas[canvas].measureText(toAdd).width;
            if (width>maxLength) {
                contents.push(text.substring(last, i));
                last=i;
            }
        }
    }
    contents.push(text.substring(last));
    return contents;
}

core.prototype.unshift = function (a,b) {
    if (!(a instanceof Array) || !core.isset(b)) return;
    if (b instanceof Array) {
        core.clone(b).reverse().forEach(function (e) {
            a.unshift(e);
        });
    }
    else a.unshift(b);
    return a;
}

core.prototype.setLocalStorage = function(key, value) {
    try {
        localStorage.setItem(core.firstData.name + "_" + key, JSON.stringify(value));
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
core.prototype.getLocalStorage = function(key, defaultValue) {
    var value = localStorage.getItem(core.firstData.name+"_"+key);
    if (core.isset(value)) return JSON.parse(value);
    return defaultValue;
}

core.prototype.removeLocalStorage = function (key) {
    localStorage.removeItem(core.firstData.name+"_"+key);
}

core.prototype.clone = function (data) {
    if (!core.isset(data)) return data;
    // date
    if (data instanceof Date) {
        var copy=new Date();
        copy.setTime(data.getTime());
        return copy;
    }
    // array
    if (data instanceof Array) {
        var copy=[];
        // for (var i=0;i<data.length;i++) {
        for (var i in data) {
            // copy.push(core.clone(data[i]));
            copy[i] = core.clone(data[i]);
        }
        return copy;
    }
    // 函数
    if (data instanceof Function) {
        return data;
    }
    // object
    if (data instanceof Object) {
        var copy={};
        for (var i in data) {
            if (data.hasOwnProperty(i))
                copy[i]=core.clone(data[i]);
        }
        return copy;
    }
    return data;
}

core.prototype.formatDate = function(date) {
    if (!core.isset(date)) return "";
    return date.getFullYear()+"-"+core.setTwoDigits(date.getMonth()+1)+"-"+core.setTwoDigits(date.getDate())+" "
        +core.setTwoDigits(date.getHours())+":"+core.setTwoDigits(date.getMinutes())+":"+core.setTwoDigits(date.getSeconds());
}

core.prototype.setTwoDigits = function (x) {
    return parseInt(x)<10?"0"+x:x;
}

core.prototype.win = function(reason) {
    core.events.win(reason);
}

core.prototype.lose = function(reason) {
    core.events.lose(reason);
}

// 作弊
core.prototype.debug = function() {
    core.setStatus('hp', 999999);
    core.setStatus('atk', 10000);
    core.setStatus('def', 10000);
    core.setStatus('mdef', 10000);
    core.setStatus('money', 10000);
    core.setStatus('experience', 10000);
    core.setItem('yellowKey', 50);
    core.setItem('blueKey', 50);
    core.setItem('redKey', 50);
    core.setItem('book', 1);
    core.setItem('fly', 1);
    for (var i in core.status.maps)
        if (core.status.maps[i].canFlyTo && core.status.hero.flyRange.indexOf(i)<0)
            core.status.hero.flyRange.push(i);
    core.updateStatusBar();
    core.drawTip("作弊成功");
}

core.prototype.checkStatus = function (name, need, item, clearData) {
    if (need && core.status.event.id == name) {
        core.ui.closePanel(clearData);
        return false;
    }

    if (need && core.status.lockControl) return false;
    if (core.isset(item) && item && !core.hasItem(name)) {
        core.drawTip("你没有" + core.material.items[name].name);
        return false;
    }
    if (!core.status.heroStop) {
        core.drawTip("请先停止勇士行动");
        return false;
    }

    core.lockControl();
    core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
    core.status.event.id = name;
    return true;
}

core.prototype.openBook = function (need) {
    if (!core.checkStatus('book', need, true, true))
        return;
    core.useItem('book');
}

core.prototype.useFly = function (need) {
    if (!core.checkStatus('fly', need, true))
        return;
    if (core.flags.flyNearStair && !core.nearStair()) {
        core.drawTip("只有在楼梯边才能使用传送器");
        core.unLockControl();
        core.status.event.data = null;
        core.status.event.id = null;
        return;
    }
    if (!core.canUseItem('fly')) {
        core.drawTip("楼层传送器好像失效了");
        core.unLockControl();
        core.status.event.data = null;
        core.status.event.id = null;
        return;
    }
    core.useItem('fly');
    return;
}

core.prototype.openToolbox = function (need) {
    if (!core.checkStatus('toolbox', need))
        return;
    core.ui.drawToolbox();
}

core.prototype.save = function(need) {
    if (!core.checkStatus('save', need))
        return;
    core.ui.drawSLPanel(core.status.savePage);
}

core.prototype.load = function (need) {

    // 游戏开始前读档
    if (!core.isPlaying()) {
        core.status.event = {'id': 'load', 'data': null};
        core.status.lockControl = true;
        core.dom.startPanel.style.display = 'none';
        var page = core.getLocalStorage('savePage', 0);
        core.ui.drawSLPanel(page);
        return;
    }

    if (!core.checkStatus('load', need))
        return;
    core.ui.drawSLPanel(core.status.savePage);
}

core.prototype.doSL = function (id, type) {
    if (type=='save') {
        if (core.saveData("save"+id)) {
            core.ui.closePanel();
            core.drawTip('存档成功！');
            core.setLocalStorage('savePage', core.status.savePage);
        }
        else {
            core.drawTip('存储空间不足，请覆盖已有的存档或在菜单栏中进行清理');
        }
        return;
    }
    else if (type=='load') {
        var data = core.getLocalStorage("save"+id, null);
        if (!core.isset(data)) {
            core.drawTip("无效的存档");
            return;
        }
        if (data.version != core.firstData.version) {
            core.drawTip("存档版本不匹配");
            return;
        }
        core.ui.closePanel();
        core.loadData(data, function() {
            core.setLocalStorage('savePage', core.status.savePage);
            core.drawTip("读档成功");
        });
        return;
    }
}

core.prototype.syncSave = function(type) {
    if (type=='save') {
        core.ui.drawConfirmBox("你确定要将本地存档同步到服务器吗？", function(){
            // console.log("同步存档...");
            core.ui.drawWaiting("正在同步，请稍后...");

            var formData = new FormData();
            formData.append('type', 'save');
            formData.append('name', core.firstData.name);
            var saves = [];
            for (var i=1;i<=180;i++) {
                var data = core.getLocalStorage("save"+i, null);
                if (core.isset(data)) {
                    saves.push(data);
                }
            }
            var save_text = JSON.stringify(saves);
            formData.append('data', save_text);

            // send
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "../sync.php");
            xhr.timeout = 1000;
            xhr.onload = function(e) {
                if (xhr.status==200) {
                    // console.log("同步成功。");
                    var response = JSON.parse(xhr.response);
                    if (response.code<0) {
                        core.drawText("出错啦！\n无法同步存档到服务器。");
                    }
                    else {
                        core.drawText("同步成功！\n\n您的存档编号： "+response.code+"\n您的存档密码： "+response.msg+"\n\n请牢记以上两个信息（如截图等），在从服务器\n同步存档时使用。")
                    }
                }
                else {
                    core.drawText("出错啦！\n无法同步存档到服务器。");
                }
            };
            xhr.ontimeout = function(e) {
                console.log(e);
                core.drawText("出错啦！\n无法同步存档到服务器。");
            }
            xhr.onerror = function(e) {
                console.log(e);
                core.drawText("出错啦！\n无法同步存档到服务器。");
            }
            xhr.send(formData);
        }, function() {
            core.ui.drawSyncSave();
        })
    }
    else if (type=='load') {

        core.ui.drawConfirmBox("你确定要从服务器加载存档吗？\n该操作将覆盖所有本地存档且不可逆！", function(){
            var id = prompt("请输入存档编号：");
            if (id==null || id=="") {
                core.ui.drawSyncSave(); return;
            }
            var password = prompt("请输入存档密码：");
            if (password==null || password=="") {
                core.ui.drawSyncSave(); return;
            }
            core.ui.drawWaiting("正在同步，请稍后...");

            var formData = new FormData();
            formData.append('type', 'load');
            formData.append('name', core.firstData.name);
            formData.append('id', id);
            formData.append('password', password);

            // send
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "../sync.php");
            xhr.timeout = 1000;
            xhr.onload = function(e) {
                if (xhr.status==200) {
                    // console.log("同步成功。");
                    var response = JSON.parse(xhr.response);
                    switch (response.code) {
                        case 0:
                            // 成功
                            var data=JSON.parse(response.msg);
                            // console.log(data);
                            for (var i=1;i<=180;i++) {
                                if (i<=data.length) {
                                    core.setLocalStorage("save"+i, data[i-1]);
                                }
                                else {
                                    core.removeLocalStorage("save"+i);
                                }
                            }
                            core.drawText("同步成功！\n你的本地所有存档均已被覆盖。");
                            break;
                        case -1:
                            core.drawText("出错啦！\n存档编号"+id+"不存在！");
                            break;
                        case -2:
                            core.drawText("出错啦！\n存档密码错误！");
                            break;
                        default:
                            core.drawText("出错啦！\n无法从服务器同步存档。");
                            break;
                    }

                }
                else {
                    core.drawText("出错啦！\n无法从服务器同步存档。");
                }
            };
            xhr.ontimeout = function(e) {
                console.log(e);
                core.drawText("出错啦！\n无法从服务器同步存档。");
            }
            xhr.onerror = function(e) {
                console.log(e);
                core.drawText("出错啦！\n无法从服务器同步存档。");
            }
            xhr.send(formData);
        }, function() {
            core.ui.drawSyncSave();
        })
    }

}

core.prototype.saveData = function(dataId) {
    var data = {
        'floorId': core.status.floorId,
        'hero': core.clone(core.status.hero),
        'hard': core.status.hard,
        'maps': core.maps.save(core.status.maps),
        'shops': {},
        'version': core.firstData.version,
        "time": new Date().getTime()
    };
    // set shop times
    for (var shop in core.status.shops) {
        data.shops[shop]={
            'times': core.status.shops[shop].times || 0,
            'visited': core.status.shops[shop].visited || false
        }
    }
    core.events.beforeSaveData(data);

    return core.setLocalStorage(dataId, data);
}

core.prototype.loadData = function (data, callback) {

    core.resetStatus(data.hero, data.hard, data.floorId, core.maps.load(data.maps));

    // load shop times
    for (var shop in core.status.shops) {
        core.status.shops[shop].times = data.shops[shop].times;
        core.status.shops[shop].visited = data.shops[shop].visited;
    }

    core.events.afterLoadData(data);

    core.changeFloor(data.floorId, null, data.hero.loc, null, function() {
        core.setHeroMoveTriggerInterval();
        if (core.isset(callback)) callback();
    });
}

core.prototype.setStatus = function (statusName, statusVal) {
    core.status.hero[statusName] = statusVal;
}

core.prototype.getStatus = function (statusName) {
    return core.status.hero[statusName];
}

core.prototype.setFlag = function(flag, value) {
    if (!core.isset(core.status.hero)) return;
    core.status.hero.flags[flag]=value;
}

core.prototype.getFlag = function(flag, defaultValue) {
    if (!core.isset(core.status.hero)) return defaultValue;
    var value = core.status.hero.flags[flag];
    if (core.isset(value)) return value;
    return defaultValue;
}

// 只有不为0或false时才会返回true
core.prototype.hasFlag = function(flag) {
    if (core.getFlag(flag)) return true;
    return false;
}

core.prototype.insertAction = function (list) {
    core.events.insertAction(list);
}

core.prototype.lockControl = function () {
    core.status.lockControl = true;
}

core.prototype.unLockControl = function () {
    core.status.lockControl = false;
}

core.prototype.isset = function (val) {
    if (val == undefined || val == null) {
        return false;
    }
    return true
}

core.prototype.playSound = function (soundName, soundType) {
    if (!core.musicStatus.soundStatus || !core.musicStatus.loaded) {
        return;
    }
    if (!core.isset(core.material.sounds[soundType][soundName])) return;
    core.musicStatus.playedSound = core.material.sounds[soundType][soundName];
    core.musicStatus.playedSound.play();
}

core.prototype.playBgm = function (bgmName, bgmType) {
    if (core.musicStatus.isIOS || !core.musicStatus.loaded) return;
    if (core.isset(core.musicStatus.playedBgm)) {
        core.musicStatus.playedBgm.pause();
    }
    core.musicStatus.playedBgm = core.material.sounds[bgmType][bgmName];
    if (core.musicStatus.soundStatus)
        core.musicStatus.playedBgm.play();
}

core.prototype.changeSoundStatus = function () {
    if (core.musicStatus.soundStatus) {
        main.core.disabledSound();
    }
    else {
        main.core.enabledSound();
    }
}

core.prototype.enabledSound = function () {
    core.musicStatus.soundStatus = true;
    core.playBgm('bgm', 'mp3');
    core.setLocalStorage('soundStatus', true);
}

core.prototype.disabledSound = function () {
    core.musicStatus.playedBgm.pause();
    core.musicStatus.soundStatus = false;
    core.setLocalStorage('soundStatus', false);
}

core.prototype.show = function (obj, speed, callback) {
    if (!core.isset(speed)) {
        obj.style.display = 'block';
        return;
    }
    obj.style.display = 'block';
    obj.style.opacity = 0;
    var opacityVal = 0;
    var showAnimate = window.setInterval(function () {
        opacityVal += 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal > 1) {
            clearInterval(showAnimate);
            if (core.isset(callback)) {
                callback();
            }
        }
    }, speed);
}

core.prototype.hide = function (obj, speed, callback) {
    if (!core.isset(speed)) {
        obj.style.display = 'none';
        return;
    }
    var opacityVal = 1;
    var hideAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal < 0) {
            obj.style.display = 'none';
            clearInterval(hideAnimate);
            if (core.isset(callback)) {
                callback();
            }
        }
    }, speed);
}


////// 状态栏相关 //////

core.prototype.clearStatusBar = function() {
    var statusList = ['floor', 'hp', 'atk', 'def', 'mdef', 'money', 'experience', 'yellowKey', 'blueKey', 'redKey', 'poison', 'weak', 'curse', 'hard'];
    statusList.forEach(function (e) {
        core.statusBar[e].innerHTML = "";
    });
    core.statusBar.image.book.style.opacity = 0.3;
    core.statusBar.image.fly.style.opacity = 0.3;
}

/**
 * 更新状态栏
 */
core.prototype.updateStatusBar = function () {

    // 上限999999
    if (core.values.HPMAX>0) {
        core.setStatus('hp', Math.min(core.values.HPMAX, core.getStatus('hp')));
    }

    // core.statusBar.floor.innerHTML = core.maps.maps[core.status.floorId].name;
    var statusList = ['hp', 'atk', 'def', 'mdef', 'money', 'experience'];
    statusList.forEach(function (item) {
        core.statusBar[item].innerHTML = core.getStatus(item);
    });
    var keys = ['yellowKey', 'blueKey', 'redKey'];
    keys.forEach(function (key) {
        core.statusBar[key].innerHTML = core.setTwoDigits(core.status.hero.items.keys[key]);
    })
    if(core.flags.enableDebuff){
        core.statusBar.poison.innerHTML = core.hasFlag('poison')?"毒":"";
        core.statusBar.weak.innerHTML = core.hasFlag('weak')?"衰":"";
        core.statusBar.curse.innerHTML = core.hasFlag('curse')?"咒":"";
    }
    

    core.statusBar.hard.innerHTML = core.status.hard;
    if (core.hasItem('book')) {
        core.statusBar.image.book.style.opacity = 1;
    } else {
        core.statusBar.image.book.style.opacity = 0.3;
    }
    if (core.hasItem('fly')) {
        core.statusBar.image.fly.style.opacity = 1;
    } else {
        core.statusBar.image.fly.style.opacity = 0.3;
    }
    core.updateFg();
}

core.prototype.resize = function(clientWidth, clientHeight) {
    
    // 默认画布大小
    var DEFAULT_CANVAS_WIDTH = 422;
    // 默认边栏宽度
    var DEFAULT_BAR_WIDTH = 132;
    
    var BASE_LINEHEIGHT = 32;
    var SPACE = 3;
    var DEFAULT_FONT_SIZE = 16;
    //适配宽度阈值
    var ADAPT_WIDTH = DEFAULT_CANVAS_WIDTH;
    //判断横竖屏
    var width = clientWidth;
    var isHorizontal = false;
    if(clientWidth > clientHeight && clientHeight < ADAPT_WIDTH){
        isHorizontal = true;
        width = clientHeight;
    }
    // 各元素大小的变量声明
    var gameGroupWidth, gameGroupHeight, borderRight,
        canvasWidth, canvasTop, // canvasLeft,
        statusBarWidth, statusBarHeight, statusBarBorder,
        statusWidth, statusHeight, statusMaxWidth,statusLabelsLH,
        toolBarWidth, toolBarHeight, toolBarTop, toolBarBorder,
        toolsWidth, toolsHeight,toolsMargin,toolsPMaxwidth,
        fontSize, margin;
        
    var count = 9;
    if (!core.flags.enableMDef) count--;
    if (!core.flags.enableExperience) count--;
    if (!core.flags.enableDebuff) count--;

    var statusLineHeight = BASE_LINEHEIGHT * 9/count;

    var shopDisplay, mdefDisplay, expDisplay;
    mdefDisplay = core.flags.enableMDef ? 'block' : 'none';
    expDisplay = core.flags.enableExperience ? 'block' : 'none';

    statusBarBorder = '3px #fff solid';
    toolBarBorder = '3px #fff solid';
    // 移动端
    if (width < ADAPT_WIDTH) {
        var zoom = (ADAPT_WIDTH - width) / 4.22;
        var scale = 1 - zoom / 100;

        core.domStyle.scale = scale;

        canvasWidth = width;
        fontSize = DEFAULT_FONT_SIZE * scale;

        if(!isHorizontal){ //竖屏
            core.domStyle.screenMode = 'vertical';
            //显示快捷商店图标
            shopDisplay = 'block';
            //判断应该显示几行
            var col = core.flags.enableMDef || core.flags.enableExperience || core.flags.enableDebuff ? 3 : 2;

            var tempTopBarH = scale * (BASE_LINEHEIGHT * col + SPACE * 2) + 6;
            var tempBotBarH = scale * (BASE_LINEHEIGHT + SPACE * 4) + 6;

            gameGroupHeight = width + tempTopBarH + tempBotBarH;
            
            gameGroupWidth = width
            canvasTop = tempTopBarH;
            // canvasLeft = 0;
            toolBarWidth = statusBarWidth = width;
            statusBarHeight = tempTopBarH; //一共有3行加上两个padding空隙
            statusBarBorder = '3px #fff solid';

            statusHeight = scale*BASE_LINEHEIGHT * .8;
            statusLabelsLH = .8 * BASE_LINEHEIGHT *scale;
            statusMaxWidth = scale * DEFAULT_BAR_WIDTH * .95;
            toolBarHeight = tempBotBarH;

            toolBarTop = statusBarHeight + width;
            toolBarBorder = '3px #fff solid';
            toolsHeight = scale * BASE_LINEHEIGHT;
            toolsPMaxwidth = scale * DEFAULT_BAR_WIDTH * .4;
            borderRight = '3px #fff solid';
            
            margin = scale * SPACE * 2;
            toolsMargin = scale * SPACE * 4;
        }else { //横屏
            core.domStyle.screenMode = 'horizontal';
            shopDisplay = 'none';
            gameGroupWidth = width + DEFAULT_BAR_WIDTH * scale;
            gameGroupHeight = width;
            canvasTop = 0;
            // canvasLeft = DEFAULT_BAR_WIDTH * scale;
            toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH * scale;
            statusBarHeight = scale * statusLineHeight * count + SPACE * 2; //一共有9行加上两个padding空隙
            statusBarBorder = '3px #fff solid';

            statusHeight = scale*statusLineHeight * .8;
            statusLabelsLH = .8 * statusLineHeight *scale;
            toolBarHeight = width - statusBarHeight;
            toolBarTop = scale*statusLineHeight * count + SPACE * 2;
            toolBarBorder = '3px #fff solid';
            toolsHeight = scale * BASE_LINEHEIGHT;
            borderRight = '';
            statusMaxWidth = scale * DEFAULT_BAR_WIDTH;
            toolsPMaxwidth = scale * DEFAULT_BAR_WIDTH;

            margin = scale * SPACE * 2;
            toolsMargin = 2 * SPACE * scale;
        }
        
    }else { //大屏设备 pc端
        core.domStyle.scale = 1;
        core.domStyle.screenMode = 'bigScreen';
        shopDisplay = 'none';

        gameGroupWidth = DEFAULT_CANVAS_WIDTH + DEFAULT_BAR_WIDTH;
        gameGroupHeight = DEFAULT_CANVAS_WIDTH;
        canvasWidth = DEFAULT_CANVAS_WIDTH;
        canvasTop = 0;
        // canvasLeft = DEFAULT_BAR_WIDTH;

        toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH;
        statusBarHeight = statusLineHeight * count + SPACE * 2; //一共有9行

        statusHeight = statusLineHeight * .8;
        statusLabelsLH = .8 * statusLineHeight;
        toolBarHeight = DEFAULT_CANVAS_WIDTH - statusBarHeight;
        toolBarTop = statusLineHeight * count + SPACE * 2;
        
        toolsHeight = BASE_LINEHEIGHT;
        borderRight = '';
        fontSize = DEFAULT_FONT_SIZE;
        statusMaxWidth = DEFAULT_BAR_WIDTH;
        toolsPMaxwidth = DEFAULT_BAR_WIDTH * .9;
        margin = SPACE * 2;
        toolsMargin = 2 * SPACE;
    }

    var unit = 'px'
    core.domStyle.styles = [
        {
            id: 'gameGroup',
            rules:{
                width: gameGroupWidth + unit,
                height: gameGroupHeight + unit,
                top: (clientHeight-gameGroupHeight)/2 + unit,
                left: (clientWidth-gameGroupWidth)/2 + unit,
            }
        },
        {
            className: 'gameCanvas',
            rules:{
                width: canvasWidth + unit, 
                height: canvasWidth + unit,
                top: canvasTop + unit,
                right: 0,
                // left: canvasLeft + unit, 

                border: '3px #fff solid',
            }
        },
        {
            id: 'floorMsgGroup',
            rules:{
                width: (canvasWidth - SPACE*2) + unit,
                height:(canvasWidth - SPACE*2) + unit,
                top: (canvasTop + SPACE) + unit,
                right: SPACE + unit,
            }
        },
        {
            id: 'statusBar',
            rules:{
                width: statusBarWidth + unit,
                height: statusBarHeight + unit,
                top: 0,
                left: 0,
                padding: SPACE + unit,

                borderTop: statusBarBorder,
                borderLeft: statusBarBorder,
                borderRight: borderRight,
                fontSize: fontSize + unit
            }
        },
        {
            className: 'status',
            rules:{
                width: '100%',
                maxWidth: statusMaxWidth + unit,
                height: statusHeight + unit,
                margin: margin/2 + unit
            }
        },
        {
            className: 'statusLabels',
            rules:{
                marginLeft: margin + unit,
                lineHeight: statusLabelsLH + unit,
            }
        },
        {
            id: 'toolBar',
            rules:{
                width: toolBarWidth + unit,
                height: toolBarHeight + unit,
                top: toolBarTop +unit,
                left: 0,
                padding: SPACE + unit,
                borderBottom: toolBarBorder,
                borderLeft: toolBarBorder,
                borderRight: borderRight,
                fontSize: fontSize + unit
            }
        },
        {
            className: 'tools',
            rules:{
                height: toolsHeight + unit,
                maxWidth: toolsPMaxwidth + unit,
                marginLeft: toolsMargin + unit,
                marginTop: margin + unit,
            }
        },
        {
            imgId: 'shop',
            rules:{
                display: shopDisplay
            }
        },
        {
            id: 'expCol',
            rules: {
                display: expDisplay
            }
        },
        {
            id: 'mdefCol',
            rules: {
                display: mdefDisplay
            }
        },
    ]
    core.domRenderer();
}

core.prototype.domRenderer = function(){

    core.dom.statusBar.style.display = 'block';
    core.dom.toolBar.style.display = 'block';

    var styles = core.domStyle.styles;

    for(var i=0; i<styles.length; i++){
        if(styles[i].hasOwnProperty('rules')){
            var rules = styles[i].rules;
            var rulesProp = Object.keys(rules);

            if(styles[i].hasOwnProperty('className')){
                var className = styles[i].className
                for(var j=0; j<core.dom[className].length; j++)
                    for(var k=0; k<rulesProp.length; k++)
                        core.dom[className][j].style[rulesProp[k]] = rules[rulesProp[k]];
            }
            if(styles[i].hasOwnProperty('id')){
                var id = styles[i].id;

                for(var j=0; j<rulesProp.length; j++)
                    core.dom[id].style[rulesProp[j]] = rules[rulesProp[j]];
            }
            if(styles[i].hasOwnProperty('imgId')){
                var imgId = styles[i].imgId;

                for(var j=0; j<rulesProp.length; j++)
                core.statusBar.image[imgId].style[rulesProp[j]] = rules[rulesProp[j]];
            }
        }
        
    }
}
    

/**
 * 系统机制 end
 */

var core = new core();
main.instance.core = core;
