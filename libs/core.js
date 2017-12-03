/**
 * 初始化 start
 */

function core() {
    this.dom = {};
    this.statusBar = {};
    this.canvas = {};
    this.images = [];
    this.sounds = {};
    this.firstData = {};
    this.material = {
        'images': {},
        'sounds': {},
        'ground': null,
        'items': {},
        'enemys': {},
        'icons': {},
        'events': {},
        'npcs': {}
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
    // 各元素位置、大小信息
    this.position = {
        'gameGroup': {},
        'canvas': {},
        'statusBar': {},
        'toolBar': {},
        'items': {},
        'scale': 1.0,
        'screenMode': 'bigScreen',
    }
    this.initStatus = {
        'played': false,

        // 勇士属性
        'hero': {
            'id': '',
            'name': '',
            'hp': 0,
            'atk': 0,
            'def': 0,
            'mdef': 0,
            'money': 0,
            'experience': 0,
            'loc': {'direction': 'down', 'x': 0, 'y': 0},
            'flyRange': [],
            'items': [],
        },

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
        'npcs': {},
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

core.prototype.init = function (dom, statusBar, canvas, images, sounds, coreData) {
    core.dom = dom;
    core.statusBar = statusBar;
    core.canvas = canvas;
    core.images = images;
    core.sounds = sounds;
    for (var key in coreData) {
        core[key] = coreData[key];
    }
    core.firstData = core.data.getFirstData();
    core.initStatus.shops = core.firstData.shops;
    core.initStatus.npcs = core.firstData.npcs;
    core.dom.versionLabel.innerHTML = core.firstData.version;
    core.dom.logoLabel.innerHTML = core.firstData.title;
    core.material.items = core.items.getItems();
    // core.status.maps = core.maps.getMaps();
    core.initStatus.maps = core.maps.getMaps();
    core.material.enemys = core.clone(core.enemys.getEnemys());
    core.material.icons = core.icons.getIcons();
    core.material.events = core.events.getEvents();
    core.material.npcs = core.npcs.getNpcs();
    core.flags = core.data.flags;

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
        // core.playGame();
        core.showStartAnimate(function() {});
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
            callback();
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
    var loadedImageNum = 0, allImageNum = 0, loadSoundNum = 0, allSoundNum = 0;
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
        // if (core.musicStatus.bgmStatus==0) core.musicStatus.bgmStatus=-1;
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

    core.resetStatus(core.firstData.hero, hard, core.firstData.floorId,
        core.initStatus.maps);

    core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, function() {
        core.setHeroMoveTriggerInterval();
        if (core.isset(callback)) callback();
    });
}


core.prototype.restart = function() {

    /*
    core.resetStatus(core.firstData.hero, core.firstData.hard, core.firstData.floorId,
        core.initStatus.maps);

    core.changeFloor(core.firstData.floorId, null, core.firstData.hero.loc, function() {
        core.drawTip('重新开始游戏');
        core.setHeroMoveTriggerInterval();
    });

    */
    core.showStartAnimate();
}

/////////// 系统事件相关 END ///////////




/////////// 键盘、鼠标事件相关 ///////////

core.prototype.keyDown = function(e) {
	if(!core.status.played) {
		return;
	}
	if(core.status.automaticRouting || core.status.automaticRouted) {
		core.stopAutomaticRoute();
	}
	if (core.status.lockControl) {
        if (core.status.event.id == 'book') {
            if (e.keyCode==37) core.ui.drawEnemyBook(core.status.event.data - 1);
            else if (e.keyCode==39) core.ui.drawEnemyBook(core.status.event.data + 1);
            return;
        }
        if (core.status.event.id == 'fly') {
            if (e.keyCode==38) core.ui.drawFly(core.status.event.data+1);
            else if (e.keyCode==40) core.ui.drawFly(core.status.event.data-1);
            return;
        }
        if (core.status.event.id == 'save' || core.status.event.id == 'load') {
            if (e.keyCode==37) core.ui.drawSLPanel(core.status.event.data-1);
            else if (e.keyCode==39) core.ui.drawSLPanel(core.status.event.data+1);
            return;
        }
	    return;
    }
	switch(e.keyCode) {
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

core.prototype.keyUp = function(e) {
	if(!core.status.played) {
		return;
	}

	if (core.status.lockControl) {
        if (core.status.event.id == 'book' && (e.keyCode==27 || e.keyCode==88))
            core.ui.closePanel(true);
	    if (core.status.event.id == 'fly' && (e.keyCode==71 || e.keyCode==27))
	        core.ui.closePanel();
	    if (core.status.event.id == 'fly' && e.keyCode==13) {
            var index=core.status.hero.flyRange.indexOf(core.status.floorId);
            var stair=core.status.event.data<index?"upFloor":"downFloor";
            var floorId=core.status.event.data;
            core.ui.closePanel();
            core.changeFloor(core.status.hero.flyRange[floorId], stair);
        }
	    if (core.status.event.id == 'save' && (e.keyCode==83 || e.keyCode==27))
	        core.ui.closePanel();
        if (core.status.event.id == 'load' && (e.keyCode==76 || e.keyCode==27))
            core.ui.closePanel();
	    if ((core.status.event.id == 'shop' || core.status.event.id == 'settings'
            || core.status.event.id == 'selectShop') && e.keyCode==27)
	        core.ui.closePanel();
	    if (core.status.event.id == 'selectShop' && e.keyCode==75)
	        core.ui.closePanel();
        if (core.status.event.id == 'toolbox' && (e.keyCode==84 || e.keyCode==27))
            core.ui.closePanel();
        if (core.status.event.id == 'about' && (e.keyCode==13 || e.keyCode==32))
            core.ui.closePanel();
        if (core.status.event.id == 'text' && (e.keyCode==13 || e.keyCode==32))
            core.drawText();
        if (core.status.event.id == 'npc' && core.isset(core.status.event.data.current)
            && core.status.event.data.current.action=='text'  && (e.keyCode==13 || e.keyCode==32))
            core.npcAction();

	    return;
    }

    switch (e.keyCode) {
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
            core.ui.drawSelectShop(true);
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

    if (!core.isset(core.position.canvas.top)) return null;

    var statusBar = {'x': 0, 'y': 0};
    var size = 32;
    size = size * core.position.scale;

    switch (core.position.screenMode) {// 这里的3是指statusBar和游戏画布之间的白线宽度
        case 'vertical':
            statusBar.x = 0;
            statusBar.y = core.position.statusBar.height + 3;
            break;
        case 'horizontal':
            statusBar.x = core.position.statusBar.width + 3;
            console.log(core.position.statusBar.width)
            statusBar.y = 0;
            break;
        case 'bigScreen':
            statusBar.x = core.position.statusBar.width + 3;
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
        core.events.clickSelectShop(x,y);
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

    // 纯文本
    if (core.status.event.id == 'text') {
        core.drawText();
        return;
    }

    // NPC
    if (core.status.event.id == 'npc') {
        core.events.clickNPC(x,y);
        return;
    }

    // 同步存档
    if (core.status.event.id == 'syncSave') {
        if (x>=4 && x<=8) {
            if (y==5) {
                core.ui.drawConfirmBox("你确定要将本地存档同步到服务器吗？", function(){
                    // console.log("同步存档...");
                    core.ui.drawWaiting("正在同步，请稍后...");

                    var formData = new FormData();
                    formData.append('type', 'save');
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
            if (y==6) {
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
        if (x>=5 && x<=7 && y==7) {
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
    //此函数只应由events.afterOpenDoor和events.afterBattle调用
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
    if (destX == core.status.hero.loc.x && destY == core.status.hero.loc.y) {
        core.turnHero();
        return;
    }
    // 直接移动
    /*
    if(core.status.automaticRoutingTemp.moveStep.length != 0 && core.status.automaticRoutingTemp.destX == destX && core.status.automaticRoutingTemp.destY == destY) {
        core.status.automaticRouting = true;
        core.setAutoHeroMove(core.status.automaticRoutingTemp.moveStep);
        core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
        return;
    }
    */
    var step = 0;
    var tempStep = null;
    var moveStep;
    core.status.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
    if (!(moveStep = core.automaticRoute(destX, destY))) {
        core.canvas.ui.clearRect(0, 0, 416, 416);
        return false;
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
    var nowX = startX;
    var nowY = startY;
    var scanItem = {'x': 0, 'y': 0};
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
            if (core.idEndWith(nx,ny,'lavaNet')) deepAdd=100;
            // 自动绕过血瓶
            if (!core.flags.potionWhileRouting && core.idEndWith(nx,ny,'Potion')) deepAdd=20;
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
                        // core.stopHero();
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
    core.status.hero.steps++;
}

core.prototype.waitHeroToStop = function(callback) {
    core.stopAutomaticRoute();
    if (core.isset(callback)) {
        core.lockControl();
        setTimeout(function(){callback()}, 30);
    }
}

core.prototype.stopHero = function () {
    core.status.heroStop = true;
}

core.prototype.drawHero = function (direction, x, y, status, offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    core.clearAutomaticRouteNode(x, y);
    var heroIcon = core.material.icons.heros[core.status.hero.id][direction];
    x = x * heroIcon.size;
    y = y * heroIcon.size;
    core.canvas.hero.clearRect(x - 32, y - 32, 96, 96);
    core.canvas.hero.drawImage(core.material.images.heros, heroIcon.loc[status] * heroIcon.size, heroIcon.loc.iconLoc * heroIcon.size, heroIcon.size, heroIcon.size, x + offsetX, y + offsetY, heroIcon.size, heroIcon.size);
}

/////////// 自动行走 & 行走控制 END ///////////



/////////// 地图处理 ///////////

// 开门
core.prototype.openDoor = function (id, x, y, needKey, callback) {
    // 是否存在门
    if (!core.terrainExists(x, y, id)) return;
    // core.lockControl();
    if (core.status.moveStepBeforeStop.length==0) {
        core.status.moveStepBeforeStop=core.status.autoStepRoutes.slice(core.status.autoStep-1,core.status.autoStepRoutes.length);
        if (core.status.moveStepBeforeStop.length>=1)core.status.moveStepBeforeStop[0].step-=core.status.movedStep;
    }
    core.stopHero();
    core.stopAutomaticRoute();
    if (needKey) {
        var key = id.replace("Door", "Key");
        if (!core.useKey(key)) {
            if (key != "specialKey")
                core.drawTip("你没有" + core.material.items[key].name + "！", "normal");
            else core.drawTip("无法开启此门。");
            core.clearContinueAutomaticRoute();
            return;
        }
    }
    // open
    core.playSound("door", "ogg");
    var state = 0;
    var door = core.material.icons.animates[id];
    core.interval.openDoorAnimate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(core.interval.openDoorAnimate);
            core.removeBlock('event', x, y);
            core.events.afterOpenDoor(id);
            if (core.isset(callback)) callback();
            return;
        }
        core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
        core.canvas.event.drawImage(core.material.images.animates, 32 * state, 32 * door.loc, 32, 32, 32 * x, 32 * y, 32, 32);
    }, 30)
}

// 战斗
core.prototype.battle = function (id, x, y, callback) {
    if (typeof(core.status.moveStepBeforeStop)=="undefined" || core.status.moveStepBeforeStop.length==0) {
        core.status.moveStepBeforeStop=core.status.autoStepRoutes.slice(core.status.autoStep-1,core.status.autoStepRoutes.length);
        if (core.status.moveStepBeforeStop.length>=1)core.status.moveStepBeforeStop[0].step-=core.status.movedStep;
    }
    core.stopHero();
    core.stopAutomaticRoute();

    var damage = core.enemys.getDamage(id);
    if (damage >= core.status.hero.hp) {
        core.drawTip("你打不过此怪物！");
        core.clearContinueAutomaticRoute();
        return;
    }
    core.playSound('attack', 'ogg');
    core.status.hero.hp -= damage;
    var money = core.material.enemys[id].money;
    if (core.hasItem('coin'))
        core.status.hero.money += core.material.enemys[id].money;
    core.status.hero.money += money;
    core.status.hero.experience += core.material.enemys[id].experience;
    core.updateStatusBar();
    core.removeBlock('event', x, y);
    core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
    core.updateFg();
    var hint = "打败 " + core.material.enemys[id].name + "，金币+" + money;
    if (core.flags.enableExperience)
        hint += "，经验+" + core.material.enemys[id].experience;
    core.drawTip(hint);

    // 打完怪物，触发事件
    core.events.afterBattle(id);
    if (core.isset(callback))
        callback();
}

// 楼层切换
core.prototype.changeFloor = function (floorId, stair, heroLoc, callback) {
    core.lockControl();
    core.stopHero();
    core.stopAutomaticRoute();
    core.dom.floorNameLabel.innerHTML = core.status.maps[floorId].title;
    if (core.isset(stair)) {
        // find heroLoc
        heroLoc = core.status.hero.loc;
        var blocks = core.status.maps[floorId].blocks;
        for (var i in blocks) {
            if (core.isset(blocks[i].event) && blocks[i].event.id === stair) {
                heroLoc.x = blocks[i].x;
                heroLoc.y = blocks[i].y;
            }
        }
        if (core.status.maps[floorId].canFlyTo && core.status.hero.flyRange.indexOf(floorId)<0) {
            if (stair=='upFloor') core.status.hero.flyRange.unshift(floorId);
            if (stair=='downFloor') core.status.hero.flyRange.push(floorId);
        }
    }

    window.setTimeout(function () {
        // console.log('地图切换到' + floorId);
        core.playSound('floor', 'mp3');
        core.mapChangeAnimate('show', function () {
            core.statusBar.floor.innerHTML = core.status.maps[floorId].name;
            core.updateStatusBar();
            core.drawMap(floorId, function () {
                core.hide(core.dom.floorMsgGroup, 10, function () {
                    core.unLockControl();
                    core.events.afterChangeFloor(floorId);
                    if (core.isset(callback)) callback();
                });
                core.setHeroLoc('direction', heroLoc.direction);
                core.setHeroLoc('x', heroLoc.x);
                core.setHeroLoc('y', heroLoc.y);
                core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                core.updateFg();
            });
        });
    }, 50);
}

// 地图切换
core.prototype.mapChangeAnimate = function (mode, callback) {
    if (mode == 'show') {
        core.show(core.dom.floorMsgGroup, 15, function () {
            callback();
        });
    }
    else {
        core.hide(core.dom.floorMsgGroup, 20, function () {
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

core.prototype.drawBlock = function (map, image, cutX, cutY, x, y, size, zoom, clear) {
    zoom = zoom || 1;
    if (core.isset(clear) && clear == true) {
        core.canvas[map].clearRect(x * size, y * size, size, size);
    }
    core.canvas[map].drawImage(core.material.images[image], cutX * size, cutY * size, size, size, x * size, y * size, size * zoom, size * zoom);
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

core.prototype.setOpacity = function (map, opacity) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].globalAlpha = opacity;
        }
    }
    core.canvas[map].globalAlpha = opacity;
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
    var x, y, blockIcon, blockImage;
    core.clearMap('all');
    core.rmGlobalAnimate(null, null, true);
    core.enabledAllTrigger();
    for (x = 0; x < 13; x++) {
        for (y = 0; y < 13; y++) {
            blockIcon = core.material.icons.terrains.ground;
            blockImage = core.material.images.terrains;
            core.canvas.bg.drawImage(blockImage, 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x * blockIcon.size, y * blockIcon.size, blockIcon.size, blockIcon.size);
        }
    }
    x = 0;
    y = 0;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (core.isset(mapBlocks[b].bg)) {
            blockIcon = core.material.icons[mapBlocks[b].bg.cls][mapBlocks[b].bg.id];
            blockImage = core.material.images[mapBlocks[b].bg.cls];
            x = mapBlocks[b].x * blockIcon.size;
            y = mapBlocks[b].y * blockIcon.size;
            if (mapBlocks[b].bg.cls != 'empty') {
                core.canvas.bg.drawImage(blockImage, 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
                core.addGlobalAnimate(mapBlocks[b].bg.animate, x, y, 'bg', blockIcon.loc, blockIcon.size, blockImage);
            }
            else {
                core.canvas.bg.clearRect(x, y, blockIcon.size, blockIcon.size);
            }
        }
        else {
            blockIcon = core.material.icons.terrains.ground;
            blockImage = core.material.images.terrains;
            x = mapBlocks[b].x * blockIcon.size;
            y = mapBlocks[b].y * blockIcon.size;
            core.canvas.bg.drawImage(blockImage, 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
        }
        if (core.isset(mapBlocks[b].event)) {
            blockIcon = core.material.icons[mapBlocks[b].event.cls][mapBlocks[b].event.id];
            blockImage = core.material.images[mapBlocks[b].event.cls];
            core.canvas.event.drawImage(core.material.images[mapBlocks[b].event.cls], 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
            core.addGlobalAnimate(mapBlocks[b].event.animate, x, y, 'event', blockIcon.loc, blockIcon.size, blockImage);
        }
    }
    core.setGlobalAnimate(core.firstData.animateSpeed);
    if (core.isset(callback))
        callback();
}

/**
 * 是否存在不可通行节点
 * @param x
 * @param y
 * @returns {boolean}
 */
core.prototype.noPassExists = function (x, y) {
    var blocks = core.status.thisMap.blocks;
    for (var n = 0; n < blocks.length; n++) {
        if (blocks[n].x == x && blocks[n].y == y && core.isset(blocks[n].event) && core.isset(blocks[n].event.noPass) && blocks[n].event.noPass) {
            return true;
        }
    }
    return false;
}

/**
 * 是否存在NPC节点
 * @param x
 * @param y
 * @returns {boolean}
 */
core.prototype.npcExists = function (x, y) {
    var blocks = core.status.thisMap.blocks;
    for (var n = 0; n < blocks.length; n++) {
        if (blocks[n].x == x && blocks[n].y == y && core.isset(blocks[n].event) && blocks[n].event.cls == 'npcs') {
            return true;
        }
    }
    return false;
}

/**
 * 是否存在地形
 * @param x
 * @param y
 * @param id
 * @returns {boolean}
 */
core.prototype.terrainExists = function (x, y, id) {
    if (x > 12 || y > 12 || x < 0 || y < 0) {
        return true;
    }
    if (core.stairExists(x, y)) {
        return false;
    }
    var blocks = core.status.thisMap.blocks;
    for (var t = 0; t < blocks.length; t++) {
        if (blocks[t].x == x && blocks[t].y == y) {
            for (var map in core.canvas) {
                if (core.isset(blocks[t][map]) && (blocks[t][map].cls == 'terrains' || (blocks[t][map].cls == 'animates' && core.isset(blocks[t][map].noPass) && blocks[t][map].noPass == true)) && ((core.isset(id) && core.isset(blocks[t][map].id)) ? blocks[t][map].id == id : true)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * 是否存在楼梯
 * @param x
 * @param y
 * @returns {boolean}
 */
core.prototype.stairExists = function (x, y) {
    var blocks = core.status.thisMap.blocks;
    for (var s = 0; s < blocks.length; s++) {
        if (blocks[s].x == x && blocks[s].y == y && core.isset(blocks[s].event) && blocks[s].event.cls == 'terrains' && core.isset(blocks[s].event.id) && (blocks[s].event.id == 'upFloor' || blocks[s].event.id == 'downFloor')) {
            return true;
        }
    }
    return false;
}

core.prototype.enemyExists = function (x, y, id) {
    var blocks = core.status.thisMap.blocks;
    for (var e = 0; e < blocks.length; e++) {
        if (blocks[e].x == x && blocks[e].y == y && core.isset(blocks[e].event) && blocks[e].event.cls == 'enemys' && ((core.isset(id) && core.isset(blocks[e].event.id)) ? blocks[e].event.id == id : true)) {
            return true;
        }
    }
    return false;
}

core.prototype.idEndWith = function (x, y, idStr) {
    var blocks = core.status.thisMap.blocks;
    for (var n = 0; n < blocks.length; n++) {
        if (blocks[n].x == x && blocks[n].y == y && core.isset(blocks[n].event)) {
            var id = blocks[n].event.id;
            return id.substring(id.length-idStr.length)==idStr;
        }
    }
    return false;
}

core.prototype.removeBlock = function (map, x, y) {
    var map = map.split(',');
    var mapBlocks = core.status.thisMap.blocks;
    var blockIcon;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y) {
            core.rmGlobalAnimate(x, y);
            for (var m = 0; m < map.length; m++) {
                if (!core.isset(mapBlocks[b][map[m]])) {
                    continue;
                }
                blockIcon = core.material.icons[mapBlocks[b][map[m]].cls][mapBlocks[b][map[m]].id];
                core.canvas[map[m]].clearRect(x * blockIcon.size, y * blockIcon.size, blockIcon.size, blockIcon.size);
                // delete core.status.thisMap.blocks[b][map[m]];
            }
            core.status.thisMap.blocks.splice(b, 1);
            break;
        }
    }
}

core.prototype.removeBlockByIds = function (floorId, ids) {
    ids.sort(function (a,b) {return b-a}).forEach(function (id) {
        core.status.maps[floorId].blocks.splice(id, 1);
    });
}

core.prototype.noPass = function (x, y) {
    if (x > 12 || y > 12 || x < 0 || y < 0) {
        return true;
    }
    var mapBlocks = core.status.thisMap.blocks;
    var noPass;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y) {
            return noPass = (mapBlocks[b].event && mapBlocks[b].event.noPass) || (mapBlocks[b].bg && mapBlocks[b].bg.noPass);
        }
    }
}

core.prototype.trigger = function (x, y) {
    var mapBlocks = core.status.thisMap.blocks;
    var noPass;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y) {
            noPass = (mapBlocks[b].event && mapBlocks[b].event.noPass) || (mapBlocks[b].bg && mapBlocks[b].bg.noPass);
            if (noPass) {
                core.clearAutomaticRouteNode(x, y);
            }
            /*
            if(core.isset(mapBlocks[b].fg) && core.isset(mapBlocks[b].fg.trigger) && (core.isset(mapBlocks[b].fg.disabledTrigger) ? mapBlocks[b].fg.disabledTrigger == false : true)) {
                core.material.events[mapBlocks[b].fg.trigger](mapBlocks[b], core, function(data) {

                });
            }
            */
            if (core.isset(mapBlocks[b].event) && core.isset(mapBlocks[b].event.trigger) && (core.isset(mapBlocks[b].event.disabledTrigger) ? mapBlocks[b].event.disabledTrigger == false : true)
                    && !(core.isset(mapBlocks[b].event.noTriggerCross) && mapBlocks[b].event.noTriggerCross && (core.status.autoHeroMove || core.status.autoStep<core.status.autoStepRoutes.length))) {
                core.material.events[mapBlocks[b].event.trigger](mapBlocks[b], core, function (data) {

                });
            }
            else if (core.isset(mapBlocks[b].bg) && core.isset(mapBlocks[b].bg.trigger) && (core.isset(mapBlocks[b].bg.disabledTrigger) ? mapBlocks[b].bg.disabledTrigger == false : true)) {
                core.material.events[mapBlocks[b].bg.trigger](mapBlocks[b], core, function (data) {

                });
            }
        }
    }
}

core.prototype.setTrigger = function (x, y, map, triggerName) {
    var mapBlocks = core.status.thisMap.blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map])) {
            mapBlocks[b][map].trigger = triggerName;
        }
    }
}

core.prototype.enabledTrigger = function (x, y, map) {
    var mapBlocks = core.status.thisMap.blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
            mapBlocks[b][map].disabledTrigger = false;
        }
    }
}

core.prototype.enabledAllTrigger = function () {
    var mapBlocks = core.status.thisMap.blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        for (var map in core.canvas) {
            if (core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
                mapBlocks[b][map].disabledTrigger = false;
            }
        }
    }
}

core.prototype.disabledTrigger = function (x, y, map) {
    var mapBlocks = core.status.thisMap.blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
            mapBlocks[b][map].disabledTrigger = true;
        }
    }
}

core.prototype.rmTrigger = function (x, y, map) {
    var mapBlocks = core.status.thisMap.blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
            delete mapBlocks[b][map].trigger;
        }
    }
}

core.prototype.addGlobalAnimate = function (animateMore, x, y, map, loc, size, image) {
    if (animateMore == 2) {
        core.status.twoAnimateObjs.push({
            'x': x,
            'y': y,
            'map': map,
            'status': 0,
            'loc': loc,
            'size': size,
            'image': image
        });
    }
    else if (animateMore == 4) {
        core.status.fourAnimateObjs.push({
            'x': x,
            'y': y,
            'map': map,
            'status': 0,
            'loc': loc,
            'size': size,
            'image': image
        });
    }
}

core.prototype.rmGlobalAnimate = function (x, y, all) {
    if (all == true) {
        core.status.twoAnimateObjs = [];
        core.status.fourAnimateObjs = [];
    }
    for (var t = 0; t < core.status.twoAnimateObjs.length; t++) {
        if (core.status.twoAnimateObjs[t].x == x * core.status.twoAnimateObjs[t].size && core.status.twoAnimateObjs[t].y == y * core.status.twoAnimateObjs[t].size) {
            core.status.twoAnimateObjs.splice(t, 1);
            return;
        }
    }
    for (var f = 0; f < core.status.fourAnimateObjs.length; f++) {
        if (core.status.fourAnimateObjs[f].x == x * core.status.fourAnimateObjs[f].size && core.status.fourAnimateObjs[f].y == y * core.status.fourAnimateObjs[f].size) {
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
            core.status.twoAnimateObjs[a].status = core.status.twoAnimateObjs[a].status == 0 ? 1 : 0;
            core.canvas[core.status.twoAnimateObjs[a].map].clearRect(core.status.twoAnimateObjs[a].x, core.status.twoAnimateObjs[a].y, core.status.twoAnimateObjs[a].size, core.status.twoAnimateObjs[a].size);
            for (var b = 0; b < core.status.thisMap.blocks.length; b++) {
                if (core.status.thisMap.blocks[b].x * 32 == core.status.twoAnimateObjs[a].x && core.status.thisMap.blocks[b].y * 32 == core.status.twoAnimateObjs[a].y && (!core.isset(core.status.thisMap.blocks[b][core.status.twoAnimateObjs[a].map]) || core.status.thisMap.blocks[b][core.status.twoAnimateObjs[a].map].animate == 0)) {
                    animateClose = true;
                }
            }
            if (!animateClose) {
                core.canvas[core.status.twoAnimateObjs[a].map].drawImage(core.status.twoAnimateObjs[a].image, core.status.twoAnimateObjs[a].status * 32, core.status.twoAnimateObjs[a].loc * core.status.twoAnimateObjs[a].size, core.status.twoAnimateObjs[a].size, core.status.twoAnimateObjs[a].size, core.status.twoAnimateObjs[a].x, core.status.twoAnimateObjs[a].y, core.status.twoAnimateObjs[a].size, core.status.twoAnimateObjs[a].size);
            }
            animateClose = false;
        }
    }, speed);
    core.interval.fourAnimate = window.setInterval(function () {
        for (var a = 0; a < core.status.fourAnimateObjs.length; a++) {
            core.status.fourAnimateObjs[a].status = (core.status.fourAnimateObjs[a].status == 0 ? 1 : (core.status.fourAnimateObjs[a].status == 1 ? 2 : (core.status.fourAnimateObjs[a].status == 2 ? 3 : 0)));
            core.canvas[core.status.fourAnimateObjs[a].map].clearRect(core.status.fourAnimateObjs[a].x, core.status.fourAnimateObjs[a].y, core.status.fourAnimateObjs[a].size, core.status.fourAnimateObjs[a].size);
            for (var b = 0; b < core.status.thisMap.blocks.length; b++) {
                if (core.status.thisMap.blocks[b].x * 32 == core.status.fourAnimateObjs[a].x && core.status.thisMap.blocks[b].y * 32 == core.status.fourAnimateObjs[a].y && (!core.isset(core.status.thisMap.blocks[b][core.status.fourAnimateObjs[a].map]) || core.status.thisMap.blocks[b][core.status.fourAnimateObjs[a].map].animate == 0)) {
                    animateClose = true;
                }
            }
            if (!animateClose) {
                core.canvas[core.status.fourAnimateObjs[a].map].drawImage(core.status.fourAnimateObjs[a].image, core.status.fourAnimateObjs[a].status * 32, core.status.fourAnimateObjs[a].loc * core.status.fourAnimateObjs[a].size, core.status.fourAnimateObjs[a].size, core.status.fourAnimateObjs[a].size, core.status.fourAnimateObjs[a].x, core.status.fourAnimateObjs[a].y, core.status.fourAnimateObjs[a].size, core.status.fourAnimateObjs[a].size);
            }
            animateClose = false;
        }
    }, speed / 2);
}

core.prototype.setBoxAnimate = function (speed) {
    clearInterval(core.interval.boxAnimate);
    if (core.status.boxAnimateObjs.length > 0) {
        var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
        core.drawBoxAnimate(background);
        core.interval.boxAnimate = setInterval(function () {
            core.drawBoxAnimate(background);
        }, speed);
    }
}

core.prototype.drawBoxAnimate = function (background) {
    for (var a = 0; a < core.status.boxAnimateObjs.length; a++) {
        var obj = core.status.boxAnimateObjs[a];
        obj.status = obj.status == 0 ? 1 : 0;
        core.clearMap('ui', obj.bgx, obj.bgy, obj.bgsize, obj.bgsize);
        core.fillRect('ui', obj.bgx, obj.bgy, obj.bgsize, obj.bgsize, background);
        core.canvas.ui.drawImage(obj.image, obj.status * obj.icon.size, obj.icon.loc * obj.icon.size,
            obj.icon.size, obj.icon.size, obj.x, obj.y, obj.icon.size, obj.icon.size);
    }
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
    return core.status.hero.loc[itemName];
}

/**
 * 更新显伤
 */
core.prototype.updateFg = function () {
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
        if (core.isset(mapBlocks[b].event) && mapBlocks[b].event.cls == 'enemys') {
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
    return core.isset(core.status.hero.items[itemCls][itemId]) ? core.status.hero.items[itemCls][itemId] : 0;
}

core.prototype.hasItem = function (itemId) {
    return core.itemCount(itemId) > 0;
}

core.prototype.setItem = function (itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'item') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
    }
    core.status.hero.items[itemCls][itemId] = itemNum;
}

core.prototype.useKey = function (itemId) {
    if (!core.hasItem(itemId)) return false;
    var itemCls = core.material.items[itemId].cls;
    core.status.hero.items[itemCls][itemId]--;
    core.updateStatusBar();
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
    if (itemCls == 'item') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
        core.status.hero.items[itemCls][itemId] = 0;
    }
    else if (!core.isset(core.status.hero.items[itemCls][itemId])) {
        core.status.hero.items[itemCls][itemId] = 0;
    }
    core.status.hero.items[itemCls][itemId] += itemNum;
}

/*
core.prototype.removeBlock = function(itemX, itemY) {
   var mapBlocks = core.status.thisMap.blocks;
   for(var b = 0;b < mapBlocks.length;b++) {
       if(mapBlocks[b].x == itemX && mapBlocks[b].y == itemY) {
           // delete mapBlocks[b].event;
           // mapBlocks[b]
           core.status.thisMap.blocks.splice(b,1);
           break;
       }
   }
}
*/

core.prototype.getItemEffect = function (itemId, itemNum) {
    core.items.getItemEffect(itemId, itemNum);
}

core.prototype.getItemEffectTip = function (itemId) {
    return core.items.getItemEffectTip(itemId);
}

core.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    // core.getItemAnimate(itemId, itemNum, itemX, itemY);
    core.playSound('item', 'ogg');
    var itemCls = core.material.items[itemId].cls;
    core.getItemEffect(itemId, itemNum);
    core.removeBlock('event', itemX, itemY);
    var text = '获得 ' + core.material.items[itemId].name;
    if (itemNum > 1) text += "x" + itemNum;
    if (itemCls === 'items') text += core.getItemEffectTip(itemId);
    core.drawTip(text, 'image', core.material.icons.items[itemId]);
    core.canvas.event.clearRect(itemX * 32, itemY * 32, 32, 32);
    core.updateStatusBar();
    if (core.isset(callback)) callback();
}

core.prototype.drawTip = function (text, type, itemIcon) {
    type = type || 'normal';
    var textX, textY, width, height, hide = false, opacityVal = 0;
    clearInterval(core.interval.tipAnimate);
    core.setFont('data', "16px Arial");
    core.saveCanvas('data');
    core.setOpacity('data', 0);
    if (type == 'normal') {
        textX = 16;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 16;
        height = 42;
    }
    else if (type == 'image' && core.isset(itemIcon)) {
        textX = 44;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 8;
        height = 42;
    }
    else {
        core.loadCanvas('data');
        return;
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
            core.canvas.data.drawImage(core.material.images.items, 0, itemIcon.loc * itemIcon.size, itemIcon.size, itemIcon.size, 10, 8, itemIcon.size, itemIcon.size);
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
                    }, 1000);
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

/*
 * NPC事件
 */
core.prototype.visitNpc = function (npcId, x, y, callback) {

    // 正在移动中...
    if (!core.status.heroStop) {
        setTimeout(function () {
            core.visitNpc(npcId, x, y, callback);
        }, 30);
        return;
    }

    if (!core.isset(core.status.npcs[npcId]))
        core.status.npcs[npcId] = 0;
    var times=core.status.npcs[npcId];

    var list = core.npcs.getEffect(npcId, times);
    if (list.length==0) return;

    core.status.event.data = {'x': x, 'y': y, 'id': npcId, 'list': list, 'callback': callback};
    core.status.event.id = 'npc';
    core.lockControl();

    core.npcAction();
}

core.prototype.npcAction = function() {

    if (core.status.event.data.list.length==0) {
        if (core.isset(core.status.event.data.callback))
            core.status.event.data.callback();
        core.ui.closePanel(false);
        return;
    }

    var data = core.status.event.data.list.shift();
    core.status.event.data.current = data;

    var id=core.status.event.data.id, x=core.status.event.data.x, y=core.status.event.data.y;

    // 对话
    if (data.action=='text') {
        core.ui.drawTextBox(data.content, core.isset(data.isHero)&&data.isHero?'hero':data.id);
        return;
    }
    // 显示选项
    if (data.action=='choices') {
        var npc = core.material.npcs[data.id];

        var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

        clearInterval(core.interval.tipAnimate);
        core.clearMap('data', 0, 0, 416, 416);
        core.setOpacity('data', 1);

        core.clearMap('ui', 0, 0, 416, 416);
        core.setAlpha('ui', 1);
        core.setFillStyle('ui', background);

        var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
        core.fillRect('ui', left, top, right, bottom, background);
        core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

        // 名称
        core.canvas.ui.textAlign = "center";
        core.fillText('ui', npc.name, left + 135, top + 34, '#FFFFFF', 'bold 19px Verdana');

        // 动画
        core.strokeRect('ui', left + 15 - 1, top + 30 - 1, 34, 34, '#DDDDDD', 2);
        core.status.boxAnimateObjs = [];
        core.status.boxAnimateObjs.push({
            'bgx': left + 15, 'bgy': top + 30, 'bgsize': 32,
            'image': core.material.images.npcs,
            'x': left + 15, 'y': top + 30, 'icon': core.material.icons.npcs[npc.icon]
        });
        core.setBoxAnimate(core.firstData.animateSpeed);

        // 对话
        core.canvas.ui.textAlign = "left";
        var contents = data.hint.split('\n');
        for (var i=0;i<contents.length;i++) {
            core.fillText('ui', contents[i], left+60, top+65+18*i, '#FFFFFF', 'bold 14px Verdana');
        }

        // 选项
        core.canvas.ui.textAlign = "center";
        for (var i = 0; i < data.choices.length; i++) {
            core.fillText('ui', data.choices[i].text, 208, top + 120 + 32 * i, "#FFFFFF", "bold 17px Verdana");
        }
        if (!(core.isset(data.cancel) && !data.cancel))
            core.fillText('ui', "返回", 208, top + 248);
        return;
    }
    // 添加访问次数
    if (data.action == 'addtimes') {
        core.status.npcs[id]++;
        core.npcAction();
        return;
    }
    // 设置访问次数
    if (data.action == 'settimes') {
        core.status.npcs[id]=data.times;
        core.npcAction();
        return;
    }
    // 消失
    if (data.action == 'disappear') {
        core.removeBlock('event', x, y);
        core.npcAction();
        return;
    }
    // 立刻再次访问
    if (data.action == 'revisit') {
        core.ui.closePanel(false);
        core.visitNpc(id, x, y)
        return;
    }
    // 自定义事件
    if (data.action == 'custom') {
        core.events.npcCustomAction(data);
        return;
    }
    return;
}

core.prototype.npcEffect = function (effect, npc) {
    // 自定义事件
    if (effect.indexOf('custom:')==0) {
        core.events.npcCustomEffect(effect.substr(7), npc);
        return;
    }
    effects = effect.split(';');
    effects.forEach(function (e) {
        var ones = e.split(',');
        var type = ones[0], key = ones[1], value = ones[2];
        if (type == 'status') {
            core.setStatus(key, core.getStatus(key)+parseInt(value));
        }
        else if (type == 'item') {
            core.setItem(key, core.itemCount(key)+parseInt(value));
        }
    });
    core.updateStatusBar();
}


/**
 * 系统机制 start
 */

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
    return x<10?"0"+x:x;
}

core.prototype.lose = function() {
    core.stopAutomaticRoute();
    if (!core.status.heroStop) {
        setTimeout(function() {
            core.lose();
        }, 30);
        return;
    }
    core.events.lose();
}

core.prototype.win = function() {

    // 正在移动中...
    if (!core.status.heroStop) {
        setTimeout(function () {
            core.win();
        }, 30);
        return;
    }
    core.events.win();
}

core.prototype.updateTime = function() {
    var currentTime = new Date();
    core.status.hero.time.playtime += (currentTime.getTime()-core.status.hero.time.lasttime.getTime())/1000;
    core.status.hero.time.totaltime += (currentTime.getTime()-core.status.hero.time.lasttime.getTime())/1000;
    core.status.hero.time.lasttime = currentTime;
}

core.prototype.upload = function (delay) {
    /*
    try {

        if (core.isset(delay) && delay>0) {
            setTimeout(function() {core.upload();}, delay);
            return;
        }

        core.updateTime();

        var xmlHttp = new XMLHttpRequest();
        var parameters = "action=upload";
        parameters+="&starttime="+core.status.hero.time.starttime.getTime()/1000;
        parameters+="&hard="+core.status.hard;
        parameters+="&floor="+core.status.maps[core.status.floorId].name;
        parameters+="&hp="+core.status.hero.hp+"&atk="+core.status.hero.atk+"&def="+core.status.hero.def+"&mdef="+core.status.hero.mdef+"&money="+core.status.hero.money;
        parameters+="&yellow="+core.status.hero.items.keys.yellowKey+"&blue="+core.status.hero.items.keys.blueKey;
        parameters+="&playtime="+core.status.hero.time.playtime+"&totaltime="+core.status.hero.time.totaltime+"&step="+core.status.hero.steps+"&ending="+(core.status.event.id=='win'?1:0);

        //xmlHttp.open("GET", "/service/mota/mota4.php?"+parameters, true);
        //xmlHttp.send();
    }
    catch (e) {
    }
    */
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
    // core.drawTip("工具箱还未完成");
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
        core.ui.closePanel();
        core.loadData(data, function() {
            core.setLocalStorage('savePage', core.status.savePage);
            core.drawTip("读档成功");
        });
        return;
    }
}

core.prototype.saveData = function(dataId) {
    core.updateTime();
    var data = {
        'floorId': core.status.floorId,
        'hero': core.clone(core.status.hero),
        'hard': core.status.hard,
        'maps': core.maps.save(core.status.maps),
        'npcs': {},
        'shops': {},
        'version': core.firstData.version,
        'time': new Date().getTime()
    };
    data.hero.time.starttime=core.status.hero.time.starttime.getTime();
    // set shop times
    for (var shop in core.status.shops) {
        data.shops[shop]={
            'times': core.status.shops[shop].times,
            'visited': core.status.shops[shop].visited
        }
    }
    // core.upload();
    core.events.beforeSaveData(data);

    return core.setLocalStorage(dataId, data);
    // console.log(core.getLocalStorage(dataId));
}

core.prototype.loadData = function (data, callback) {
    core.upload();

    var totaltime=null, lasttime = null;

    if (core.isPlaying()) {
        core.updateTime();
        var totaltime = core.status.hero.time.totaltime;
        var lasttime = core.clone(core.status.hero.time.lasttime);
    }

    core.resetStatus(data.hero, data.hard, data.floorId,
        core.maps.load(data.maps));

    // load shop times
    for (var shop in core.status.shops) {
        core.status.shops[shop].times = data.shops[shop].times;
        core.status.shops[shop].visited = data.shops[shop].visited;
    }

    core.status.hero.time.starttime = new Date(core.status.hero.time.starttime);
    if (core.isset(totaltime) && totaltime>core.status.hero.time.totaltime)
        core.status.hero.time.totaltime=totaltime;
    if (core.isset(lasttime))
        core.status.hero.time.lasttime = lasttime;
    else core.status.hero.time.lasttime = new Date();

    core.events.afterLoadData(data);

    core.changeFloor(data.floorId, null, data.hero.loc, function() {
        core.setHeroMoveTriggerInterval();
        if (core.isset(callback)) callback();
    });

    core.upload(1500);
}

core.prototype.setStatus = function (statusName, statusVal) {
    if (core.isset(core.status.hero[statusName])) {
        core.status.hero[statusName] = statusVal;
    }
}

core.prototype.getStatus = function (statusName) {
    if (core.isset(core.status.hero[statusName])) {
        return core.status.hero[statusName];
    }
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
    /*
    if (core.isset(core.musicStatus.playedSound)) {
        // core.musicStatus.playedSound.pause();
    }
    */
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
    // core.musicStatus.playedBgm.play();
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
    var statusList = ['floor', 'hp', 'atk', 'def', /*'mdef',*/ 'money', 'experience', 'yellowKey', 'blueKey', 'redKey', 'hard'];
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
    if (core.flags.HPMAX>0) {
        core.setStatus('hp', Math.min(core.flags.HPMAX, core.getStatus('hp')));
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
    core.statusBar.poison.innerHTML = core.hasFlag('poison')?"毒":"";
    core.statusBar.weak.innerHTML = core.hasFlag('weak')?"衰":"";
    core.statusBar.curse.innerHTML = core.hasFlag('curse')?"咒":"";
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

    // 画布大小
    var canvasWidth = 416;
    // 竖屏状态下，默认StatusBar高度（不计算边框）
    var statusBarHeight = 83;
    // 竖屏状态下，底端默认ToolBar高度（不计算边框）
    var toolBarHeight = 49;

    // 横屏状态下，默认StatusBar宽度（不计算边框）
    var statusBarWidth = 132;
	
    //适配宽度阈值， 6为两倍的边框宽度
    var ADAPT_WIDTH = canvasWidth + 6;

    var width = clientWidth;
    var isHorizontal = false;
    if(clientWidth > clientHeight && clientHeight < 422){
        isHorizontal = true;
        width = clientHeight;
    }

    // 移动端
    if (width < ADAPT_WIDTH) {
        var zoom = (ADAPT_WIDTH - width) / 4.22;
        var scale = 1 - zoom / 100;

        core.position.scale = scale;
        canvasWidth = width - 6;

        if(!isHorizontal){ //竖屏
            core.position.screenMode = 'vertical';
            
            statusBarHeight *= scale;
            toolBarHeight *= scale;
    
            core.position.gameGroup = {
                'width': canvasWidth,
                'height': width+statusBarHeight+toolBarHeight,
                'top': (clientHeight-width-statusBarHeight-toolBarHeight)/2, 
                'left': 3
            }
    
            // 这几项都是相对gameGroup的位置
            core.position.statusBar = {
                'width': canvasWidth, 
                'height': statusBarHeight,
                'top': 0,
                'left': 0,
                'fontSize': 16 * scale
            }
            core.position.canvas = {
                'width': canvasWidth,
                'height': canvasWidth,
                'top': statusBarHeight, // 3px计算在内边框
                'left': 0,
                'borderLeft': '',
                'borderTop': '3px #fff solid', 
                'borderBottom': '3px #fff solid'
            }
            core.position.toolBar = {
                'display': 'block', 
                'width': canvasWidth, 'height': toolBarHeight,
                'top': statusBarHeight + 3 + canvasWidth,
            }
    
            var icon_firstline = 8 * scale, icon_secondline = 44 * scale;
            var icon_toolline = core.position.toolBar.top + 13 * scale;
            var icon_toolline_per = 46 * scale;
    
            var text_firstline = 14 * scale, text_secondline = 50 * scale, text_thirdline = 75 * scale;
            var text_toolline = core.position.toolBar.top + 18 * scale;

            // 如果同时启用mdef和experience，则不显示当前层数
            if (core.flags.enableMDef && core.flags.enableExperience) {
                core.position.items = {
                    'image': {
                        'size': 32*scale,
                        'floor': {'top': 0, 'left': 0, 'display': 'none'},
                        'hp': {'top': icon_firstline, 'left': 8 * scale},
                        'atk': {'top': icon_firstline, 'left': 126 * scale},
                        'def': {'top': icon_firstline, 'left': 226 * scale},
                        'mdef': {'top': icon_secondline, 'left': 8 * scale, 'display': 'block'},
                        'money': {'top': icon_secondline, 'left': 108 * scale},
                        'experience': {'top': icon_secondline, 'left': 208 * scale, 'display': 'block'},
                        'book': {'top': icon_toolline, 'left': 8 * scale},
                        'fly': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per},
                        'toolbox': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 2},
                        'shop': {'top': icon_toolline, 'left': 8*scale+icon_toolline_per*3, 'display': 'block'},
                        'save': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 4},
                        'load': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 5},
                        'settings': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 6}
                    },
                    'floor': {'top': 0, 'left': 0, 'display': 'none'},
                    'hp': {'top': text_firstline, 'left': 42 * scale},
                    'atk': {'top': text_firstline, 'left': 160 * scale},
                    'def': {'top': text_firstline, 'left': 260 * scale},
                    'mdef': {'top': text_secondline, 'left': 42 * scale, 'display': 'block'},
                    'money': {'top': text_secondline, 'left': 144 * scale},
                    'experience': {'top': text_secondline, 'left': 242 * scale, 'display': 'block'},
                    'yellowKey': {'top': text_secondline, 'left': 308 * scale},
                    'blueKey': {'top': text_secondline, 'left': 342 * scale},
                    'redKey': {'top': text_secondline, 'left': 376 * scale},
                    'poison': {'top': text_firstline, 'left': 330* scale},
                    'weak': {'top': text_firstline, 'left': 355* scale},
                    'curse': {'top': text_firstline, 'left': 380*scale},
                    'hard': {'top': text_toolline, 'left': 320*scale}
                }
            }

            // 否则显示层数
            else {
                core.position.items = {
                    'image': {
                        'size': 32*scale,
                        'floor': {'top': icon_firstline, 'left': 8 * scale, 'display': 'block'},
                        'hp': {'top': icon_firstline, 'left': 90 * scale},
                        'atk': {'top': icon_firstline, 'left': 208 * scale},
                        'def': {'top': icon_firstline, 'left': 308 * scale},
                        'mdef': {'top': icon_secondline, 'left': 8 * scale, 'display': core.flags.enableMDef?'block':'none'},
                        'money': {'top': icon_secondline, 'left': (core.flags.enableMDef?108:8) * scale},
                        'experience': {'top': icon_secondline, 'left': 108 * scale, 'display': core.flags.enableExperience?'block':'none'},
                        'book': {'top': icon_toolline, 'left': 8 * scale},
                        'fly': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per},
                        'toolbox': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 2},
                        'shop': {'top': icon_toolline, 'left': 8*scale+icon_toolline_per*3, 'display': 'block'},
                        'save': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 4},
                        'load': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 5},
                        'settings': {'top': icon_toolline, 'left': 8 * scale + icon_toolline_per * 6}
                    },
                    'floor': {'top': text_firstline, 'left': 44 * scale},
                    'hp': {'top': text_firstline, 'left': 124 * scale},
                    'atk': {'top': text_firstline, 'left': 242 * scale},
                    'def': {'top': text_firstline, 'left': 342 * scale},
                    'mdef': {'top': text_secondline, 'left': 44*scale, 'display': core.flags.enableMDef?'block':'none'},
                    'money': {'top': text_secondline, 'left': (core.flags.enableMDef?144:44) * scale},
                    'experience': {'top': text_secondline, 'left': 142 * scale, 'display': core.flags.enableExperience?'block':'none'},
                    'yellowKey': {'top': text_secondline, 'left': 216 * scale},
                    'blueKey': {'top': text_secondline, 'left': 250 * scale},
                    'redKey': {'top': text_secondline, 'left': 284 * scale},
                    'poison': {'top': text_secondline, 'left': 330* scale},
                    'weak': {'top': text_secondline, 'left': 355* scale},
                    'curse': {'top': text_secondline, 'left': 380*scale},
                    'hard': {'top': text_toolline, 'left': 320*scale}
                }
            }
        }else { //横屏
            core.position.screenMode = 'horizontal';
            statusBarWidth *= scale

            core.position.gameGroup = {
                'width': statusBarWidth + canvasWidth + 3, 
                'height': canvasWidth,
                'top': 3, 
                'left': (clientWidth - width - statusBarWidth)/2,
            }
    
            // 这几项都是相对gameGroup的位置
            core.position.statusBar = {
                'top': 0, 'left': 0,
                'width': statusBarWidth,
                'height': canvasWidth,
                'fontSize': 16 * scale
            }
            core.position.canvas = {
                'borderTop': '', 
                'borderLeft': '3px #fff solid',
                'borderBottom': '',
                'top': 0, 
                'left': statusBarWidth, 
                'width': canvasWidth, 
                'height': canvasWidth
            }
            core.position.toolBar = {
                'display': 'none', 'top': 0, 'left': 0, 'width': 0, 'height': 0
            }
            core.resizeIconHorizontal(scale);
        }
        
    }else { //大屏设备 pc端
        core.position.scale = 1;
        core.position.screenMode = 'bigScreen';

        var totalWidth = statusBarWidth + 3 + canvasWidth;

        core.position.gameGroup = {
            'top': (clientHeight-canvasWidth)/2,
            'left': (width-totalWidth)/2,
            'width': totalWidth, 'height': canvasWidth
        }

        // 这几项都是相对gameGroup的位置
        core.position.statusBar = {
            'top': 0, 'left': 0,
            'width': statusBarWidth, 'height': canvasWidth,
            'fontSize': 16
        }
        core.position.canvas = {
            'borderTop': '', 'borderBottom': '', 'borderLeft': '3px #fff solid',
            'top': 0, 'left': statusBarWidth, 'width': canvasWidth, 'height': canvasWidth
        }
        core.position.toolBar = {
            'display': 'none', 'top': 0, 'left': 0, 'width': 0, 'height': 0
        }
        core.resizeIconHorizontal(1);
    }
    core.resetSize();
}

core.prototype.resizeIconHorizontal = function(scale) {
    var first_col = 8 * scale, second_col = 50 * scale, third_col = 92 * scale;
    var first_icon_row = 20 * scale, first_text_row = 28 * scale, first_tool_row = 303 * scale;
    var per_row = 36 * scale, tool_per_row = 40*scale;

    // 如果同时启用mdef和experience，则不显示当前层数
    if (core.flags.enableMDef && core.flags.enableExperience) {
        core.position.items = {
            'image': {
                'size': 32*scale,
                'floor': {'top': 0, 'left': 0, 'display': 'none'},
                'hp': {'top': first_icon_row , 'left': first_col},
                'atk': {'top': first_icon_row + per_row, 'left': first_col},
                'def': {'top': first_icon_row + per_row * 2, 'left': first_col},
                'mdef': {'top': first_icon_row + per_row * 3, 'left': first_col, 'display': 'block'},
                'money': {'top': first_icon_row + per_row * 4, 'left': first_col},
                'experience': {'top': first_icon_row + per_row * 5, 'left': first_col, 'display': 'block'},
                'book': {'top': first_tool_row, 'left': first_col},
                'fly': {'top': first_tool_row, 'left': second_col},
                'toolbox': {'top': first_tool_row, 'left': third_col},
                'shop': {'top': 0, 'left': 0, 'display': 'none'},
                'save': {'top': first_tool_row + tool_per_row, 'left': first_col},
                'load': {'top': first_tool_row + tool_per_row, 'left': second_col},
                'settings': {'top': first_tool_row + tool_per_row, 'left': third_col}
            },
            'floor': {'top': 0, 'left': 0, 'display': 'none'},
            'hp': {'top': first_text_row, 'left': second_col},
            'atk': {'top': first_text_row + per_row, 'left': second_col},
            'def': {'top': first_text_row + per_row * 2, 'left': second_col},
            'mdef': {'top': first_text_row + per_row * 3, 'left': second_col, 'display': 'block'},
            'money': {'top': first_text_row + per_row * 4, 'left': second_col},
            'experience': {'top': first_text_row + per_row * 5, 'left': second_col, 'display': 'block'},
            'yellowKey': {'top': first_text_row + per_row * 6, 'left': first_col},
            'blueKey':{'top': first_text_row + per_row * 6, 'left': second_col},
            'redKey': {'top': first_text_row + per_row * 6, 'left': third_col},
            'poison': {'top': first_text_row + per_row * 6.75, 'left': first_col+10 * scale},
            'weak': {'top': first_text_row + per_row * 6.75, 'left': first_col + 35 * scale},
            'curse': {'top': first_text_row + per_row * 6.75, 'left': first_col + 60 * scale},
            'hard': {'top': 383*scale, 'left': 0}
        }
    }
    // 否则显示层数
    else {
        core.position.items = {
            'image': {
                'size': 32*scale,
                'floor': {'top': first_icon_row, 'left': first_col, 'display': 'block'},
                'hp': {'top': first_icon_row + per_row, 'left': first_col},
                'atk': {'top': first_icon_row + per_row * 2, 'left': first_col},
                'def': {'top': first_icon_row + per_row * 3, 'left': first_col},
                'mdef': {'top': first_icon_row + per_row * 4, 'left': first_col, 'display': core.flags.enableMDef?'block':'none'},
                'money': {'top': first_icon_row + per_row * (core.flags.enableMDef?5:4), 'left': first_col},
                'experience': {'top': first_icon_row + per_row * 5, 'left': first_col, 'display': core.flags.enableExperience?'block':'none'},
                'book': {'top': first_tool_row, 'left': first_col},
                'fly': {'top': first_tool_row, 'left': second_col},
                'toolbox': {'top': first_tool_row, 'left': third_col},
                'shop': {'top': 0, 'left': 0, 'display': 'none'},
                'save': {'top': first_tool_row + tool_per_row, 'left': first_col},
                'load': {'top': first_tool_row + tool_per_row, 'left': second_col},
                'settings': {'top': first_tool_row + tool_per_row, 'left': third_col}
            },
            'floor': {'top': first_text_row, 'left': second_col, 'display': 'block'},
            'hp': {'top': first_text_row + per_row, 'left': second_col},
            'atk': {'top': first_text_row + per_row * 2, 'left': second_col},
            'def': {'top': first_text_row + per_row * 3, 'left': second_col},
            'mdef': {'top': first_text_row + per_row * 4, 'left': second_col, 'display': core.flags.enableMDef?'block':'none'},
            'money': {'top': first_text_row + per_row * (core.flags.enableMDef?5:4), 'left': second_col},
            'experience': {'top': first_text_row + per_row * 5, 'left': second_col, 'display': core.flags.enableExperience?'block':'none'},
            'yellowKey': {'top': first_text_row + per_row * 6, 'left': first_col},
            'blueKey':{'top': first_text_row + per_row * 6, 'left': second_col},
            'redKey': {'top': first_text_row + per_row * 6, 'left': third_col},
            'poison': {'top': first_text_row + per_row * 6.75, 'left': first_col+10 * scale},
            'weak': {'top': first_text_row + per_row * 6.75, 'left': first_col + 35 * scale},
            'curse': {'top': first_text_row + per_row * 6.75, 'left': first_col + 60 * scale},
            'hard': {'top': 383*scale, 'left': 0}
        }
    }
}

core.prototype.resetSize = function () {

    core.dom.gameGroup.style.left = core.position.gameGroup.left + "px";
    core.dom.gameGroup.style.top = core.position.gameGroup.top + "px";
    core.dom.gameGroup.style.width = core.position.gameGroup.width + "px";
    core.dom.gameGroup.style.height = core.position.gameGroup.height + "px";

    core.dom.statusBar.style.width = core.position.statusBar.width + "px";
    core.dom.statusBar.style.height = core.position.statusBar.height + "px";
    core.dom.statusBar.style.fontSize = core.position.statusBar.fontSize + "px";

    core.dom.toolBar.style.top = core.position.toolBar.top + "px";
    core.dom.toolBar.style.width = core.position.toolBar.width + "px";
    core.dom.toolBar.style.height = core.position.toolBar.height + "px";
    core.dom.toolBar.style.display = core.position.toolBar.display;

    core.dom.floorMsgGroup.style.width = core.position.canvas.width + "px";

    for (var i = 0; i < core.dom.gameCanvas.length; i++) {
        core.dom.gameCanvas[i].style.borderTop = core.position.canvas.borderTop;
        core.dom.gameCanvas[i].style.borderLeft = core.position.canvas.borderLeft;
        core.dom.gameCanvas[i].style.top = core.position.canvas.top + "px";
        core.dom.gameCanvas[i].style.left = core.position.canvas.left + "px";
        core.dom.gameCanvas[i].style.width = core.position.canvas.width + "px";
        core.dom.gameCanvas[i].style.height = core.position.canvas.height + "px";
    }

    // images
    for (var item in core.statusBar.image) {
        if (core.isset(core.position.items.image[item].display))
            core.statusBar.image[item].style.display = core.position.items.image[item].display;
        else
            core.statusBar.image[item].style.display = 'block';
        core.statusBar.image[item].style.width = core.position.items.image.size + "px";
        core.statusBar.image[item].style.height = core.position.items.image.size + "px";
        core.statusBar.image[item].style.top = core.position.items.image[item].top + "px";
        core.statusBar.image[item].style.left = core.position.items.image[item].left + "px";
    }

    // texts
    for (var item in core.statusBar) {
        if (item == 'image') continue;
        if (core.isset(core.position.items[item].display))
            core.statusBar[item].style.display = core.position.items[item].display;
        else
            core.statusBar[item].style.display = 'block';
        core.statusBar[item].style.top = core.position.items[item].top + "px";
        core.statusBar[item].style.left = core.position.items[item].left + "px";
    }

}

/**
 * 系统机制 end
 */

var core = new core();
main.instance.core = core;
