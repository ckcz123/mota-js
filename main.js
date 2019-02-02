function main() {

    //------------------------ 用户修改内容 ------------------------//

    this.version = "2.5.4"; // 游戏版本号；如果更改了游戏内容建议修改此version以免造成缓存问题。

    this.useCompress = false; // 是否使用压缩文件
    // 当你即将发布你的塔时，请使用“JS代码压缩工具”将所有js代码进行压缩，然后将这里的useCompress改为true。
    // 请注意，只有useCompress是false时才会读取floors目录下的文件，为true时会直接读取libs目录下的floors.min.js文件。
    // 如果要进行剧本的修改请务必将其改成false。

    this.bgmRemote = false; // 是否采用远程BGM
    this.bgmRemoteRoot = "https://h5mota.com/music/"; // 远程BGM的根目录

    this.isCompetition = false; // 是否是比赛模式

    this.savePages = 100; // 存档页数，每页可存5个；默认为100页500个存档

    //------------------------ 用户修改内容 END ------------------------//

    this.dom = {
        'body': document.body,
        'gameGroup': document.getElementById('gameGroup'),
        'mainTips': document.getElementById('mainTips'),
        'musicBtn': document.getElementById('musicBtn'),
        'startPanel': document.getElementById('startPanel'),
        'startTop': document.getElementById('startTop'),
        'startTopProgressBar': document.getElementById('startTopProgressBar'),
        'startTopProgress': document.getElementById('startTopProgress'),
        'startTopLoadTips': document.getElementById('startTopLoadTips'),
        'startBackground': document.getElementById('startBackground'),
        'startLogo': document.getElementById('startLogo'),
        'startButtonGroup': document.getElementById('startButtonGroup'),
        'floorMsgGroup': document.getElementById('floorMsgGroup'),
        'logoLabel': document.getElementById('logoLabel'),
        'versionLabel': document.getElementById('versionLabel'),
        'floorNameLabel': document.getElementById('floorNameLabel'),
        'statusBar': document.getElementById('statusBar'),
        'status': document.getElementsByClassName('status'),
        'toolBar': document.getElementById('toolBar'),
        'tools': document.getElementsByClassName('tools'),
        'gameCanvas': document.getElementsByClassName('gameCanvas'),
        'gif': document.getElementById('gif'),
        'gif2': document.getElementById('gif2'),
        'gameDraw': document.getElementById('gameDraw'),
        'startButtons': document.getElementById('startButtons'),
        'playGame': document.getElementById('playGame'),
        'loadGame': document.getElementById('loadGame'),
        'replayGame': document.getElementById('replayGame'),
        'levelChooseButtons': document.getElementById('levelChooseButtons'),
        'data': document.getElementById('data'),
        'statusLabels': document.getElementsByClassName('statusLabel'),
        'statusTexts': document.getElementsByClassName('statusText'),
        'noMarginLeft': document.getElementsByClassName('noMarginLeft'),
        'floorCol': document.getElementById('floorCol'),
        'nameCol': document.getElementById('nameCol'),
        'lvCol': document.getElementById('lvCol'),
        'hpmaxCol': document.getElementById('hpmaxCol'),
        'hpCol': document.getElementById('hpCol'),
        'manaCol': document.getElementById('manaCol'),
        'atkCol': document.getElementById('atkCol'),
        'defCol': document.getElementById('defCol'),
        'mdefCol': document.getElementById('mdefCol'),
        'moneyCol': document.getElementById('moneyCol'),
        'experienceCol': document.getElementById('experienceCol'),
        'upCol': document.getElementById('upCol'),
        'keyCol': document.getElementById('keyCol'),
        'pzfCol': document.getElementById('pzfCol'),
        'debuffCol': document.getElementById('debuffCol'),
        'skillCol': document.getElementById('skillCol'),
        'hard': document.getElementById('hard'),
        'statusCanvas': document.getElementById('statusCanvas'),
    };
    this.mode = 'play';
    this.loadList = [
        'loader', 'control', 'utils', 'items', 'icons', 'maps', 'enemys', 'events', 'actions', 'data', 'ui', 'core'
    ];
    this.pureData = [ 
        'data', 'enemys', 'icons', 'maps', 'items', 'functions', 'events'
    ];
    this.materials = [
        'animates', 'enemys', 'hero', 'items', 'npcs', 'terrains', 'enemy48', 'npc48'
    ];

    this.statusBar = {
        'image': {
            'floor': document.getElementById('img-floor'),
            'name': document.getElementById('img-name'),
            'lv': document.getElementById('img-lv'),
            'hpmax': document.getElementById('img-hpmax'),
            'hp': document.getElementById("img-hp"),
            'mana': document.getElementById("img-mana"),
            'atk': document.getElementById("img-atk"),
            'def': document.getElementById("img-def"),
            'mdef': document.getElementById("img-mdef"),
            'money': document.getElementById("img-money"),
            'experience': document.getElementById("img-experience"),
            'up': document.getElementById("img-up"),
            'skill': document.getElementById('img-skill'),
            'book': document.getElementById("img-book"),
            'fly': document.getElementById("img-fly"),
            'toolbox': document.getElementById("img-toolbox"),
            'keyboard': document.getElementById("img-keyboard"),
            'shop': document.getElementById('img-shop'),
            'save': document.getElementById("img-save"),
            'load': document.getElementById("img-load"),
            'settings': document.getElementById("img-settings"),
            'btn1': document.getElementById("img-btn1"),
            'btn2': document.getElementById("img-btn2"),
            'btn3': document.getElementById("img-btn3"),
            'btn4': document.getElementById("img-btn4"),
            'btn5': document.getElementById("img-btn5"),
            'btn6': document.getElementById("img-btn6"),
            'btn7': document.getElementById("img-btn7"),
            'btn8': document.getElementById("img-btn8"),
        },
        'icons': {
            'floor': 0,
            'name': null,
            'lv': 1,
            'hpmax': 2,
            'hp': 3,
            'atk': 4,
            'def': 5,
            'mdef': 6,
            'money': 7,
            'experience': 8,
            'up': 9,
            'book': 10,
            'fly': 11,
            'toolbox': 12,
            'keyboard': 13,
            'shop': 14,
            'save': 15,
            'load': 16,
            'settings': 17,
            'play': 18,
            'pause': 19,
            'stop': 20,
            'speedDown': 21,
            'speedUp': 22,
            'rewind': 23,
            'equipbox': 24,
            'mana': 25,
            'skill': 26,
            'paint': 27,
            'erase': 28,
            'empty': 29,
            'exit': 30,
            'btn1': 31,
            'btn2': 32,
            'btn3': 33,
            'btn4': 34,
            'btn5': 35,
            'btn6': 36,
            'btn7': 37,
            'btn8': 38
        },
        'floor': document.getElementById('floor'),
        'name': document.getElementById('name'),
        'lv': document.getElementById('lv'),
        'hpmax': document.getElementById('hpmax'),
        'hp': document.getElementById('hp'),
        'mana': document.getElementById('mana'),
        'atk': document.getElementById('atk'),
        'def': document.getElementById("def"),
        'mdef': document.getElementById('mdef'),
        'money': document.getElementById("money"),
        'experience': document.getElementById("experience"),
        'up': document.getElementById('up'),
        'skill': document.getElementById('skill'),
        'yellowKey': document.getElementById("yellowKey"),
        'blueKey': document.getElementById("blueKey"),
        'redKey': document.getElementById("redKey"),
        'poison': document.getElementById('poison'),
        'weak':document.getElementById('weak'),
        'curse': document.getElementById('curse'),
        'pickaxe': document.getElementById('pickaxe'),
        'bomb': document.getElementById('bomb'),
        'fly': document.getElementById('fly'),
        'hard': document.getElementById("hard")
    }
    this.floors = {}
    this.canvas = {};

    this.__VERSION__ = "2.5.4";
    this.__VERSION_CODE__ = 20;
}

main.prototype.init = function (mode, callback) {
    for (var i = 0; i < main.dom.gameCanvas.length; i++) {
        main.canvas[main.dom.gameCanvas[i].id] = main.dom.gameCanvas[i].getContext('2d');
    }
    if (({"editor":0}).hasOwnProperty(mode)) {
        main.mode = mode;
        if (mode === 'editor')main.editor = {'disableGlobalAnimate':true};
    }

    main.loaderJs('project', main.pureData, function(){
        var mainData = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main;
        for(var ii in mainData)main[ii]=mainData[ii];
        
        main.dom.startBackground.src="project/images/"+main.startBackground;
        main.dom.startLogo.style=main.startLogoStyle;
        main.levelChoose.forEach(function(value){
            var span = document.createElement('span');
            span.setAttribute('class','startButton');
            span.innerText=value[0];
            (function(span,str_){
                span.onclick = function () {
                    core.events.startGame(str_);
                }
            })(span,value[1]);
            main.dom.levelChooseButtons.appendChild(span);
        });
        
        main.loaderJs('libs', main.loadList, function () {
            main.core = core;

            for (i = 0; i < main.loadList.length; i++) {
                var name = main.loadList[i];
                if (name === 'core') continue;
                main.core[name] = new (eval(name))();
            }

            main.loaderFloors(function() {
                var coreData = {};
                ["dom", "statusBar", "canvas", "images", "tilesets", "materials",
                "animates", "bgms", "sounds", "floorIds", "floors"].forEach(function (t) {
                    coreData[t] = main[t];
                })
                main.core.init(coreData, callback);
                main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
            });
        });
    });
}

////// 动态加载所有核心JS文件 //////
main.prototype.loaderJs = function (dir, loadList, callback) {

    // 加载js
    main.setMainTipsText('正在加载核心js文件...')

    if (this.useCompress) {
        main.loadMod(dir, dir, function () {
            callback();
        })
    }
    else {
        var instanceNum = 0;
        for (var i = 0; i < loadList.length; i++) {
            main.loadMod(dir, loadList[i], function (modName) {
                main.setMainTipsText(modName + '.js 加载完毕');
                instanceNum++;
                if (instanceNum === loadList.length) {
                    callback();
                }
            });
        }
    }
}

////// 加载某一个JS文件 //////
main.prototype.loadMod = function (dir, modName, callback) {
    var script = document.createElement('script');
    var name = modName;
    script.src = dir + '/' + modName + (this.useCompress?".min":"") + '.js?v=' + this.version;
    main.dom.body.appendChild(script);
    script.onload = function () {
        callback(name);
    }
}

////// 动态加载所有楼层（剧本） //////
main.prototype.loaderFloors = function (callback) {

    // 加载js
    main.setMainTipsText('正在加载楼层文件...')
    if (this.useCompress) { // 读取压缩文件
        var script = document.createElement('script');
        script.src = 'project/floors.min.js?v=' + this.version;
        main.dom.body.appendChild(script);
        script.onload = function () {
            main.dom.mainTips.style.display = 'none';
            callback();
        }
    }
    else {
        for (var i = 0; i < main.floorIds.length; i++) {
            main.loadFloor(main.floorIds[i], function (modName) {
                main.setMainTipsText("楼层 " + modName + '.js 加载完毕');
                if (Object.keys(main.floors).length === main.floorIds.length) {
                    main.dom.mainTips.style.display = 'none';
                    callback();
                }
            });
        }
    }
}

////// 加载某一个楼层 //////
main.prototype.loadFloor = function(floorId, callback) {
    var script = document.createElement('script');
    script.src = 'project/floors/' + floorId +'.js?v=' + this.version;
    main.dom.body.appendChild(script);
    script.onload = function () {
        callback(floorId);
    }
}

////// 加载过程提示 //////
main.prototype.setMainTipsText = function (text) {
    main.dom.mainTips.innerHTML = text;
}

main.prototype.log = function (e) {
    if (e) {
        if (main.core && main.core.platform && !main.core.platform.isPC) {
            console.log((e.stack || e.toString()).replace("\n", " --- "));
        }
        else {
            console.log(e);
        }
    }
}


main.prototype.listen = function () {

////// 窗口大小变化时 //////
window.onresize = function () {
    try {
        main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
    }catch (e) { main.log(e); }
}

////// 在界面上按下某按键时 //////
main.dom.body.onkeydown = function(e) {
    try {
        if (main.core && (main.core.isPlaying() || main.core.status.lockControl))
            main.core.onkeyDown(e);
    } catch (ee) { main.log(ee); }
}

////// 在界面上放开某按键时 //////
main.dom.body.onkeyup = function(e) {
    try {
        if (main.core && (main.core.isPlaying() || main.core.status.lockControl))
            main.core.onkeyUp(e);
    } catch (ee) { main.log(ee); }
}

////// 开始选择时 //////
main.dom.body.onselectstart = function () {
    return false;
}

////// 鼠标按下时 //////
main.dom.data.onmousedown = function (e) {
    try {
        e.stopPropagation();
        var loc = main.core.getClickLoc(e.clientX, e.clientY);
        if (loc == null) return;
        main.core.ondown(loc);
    } catch (ee) { main.log(ee); }
}

////// 鼠标移动时 //////
main.dom.data.onmousemove = function (e) {
    try {
        e.stopPropagation();
        var loc = main.core.getClickLoc(e.clientX, e.clientY);
        if (loc == null) return;
        main.core.onmove(loc);
    }catch (ee) { main.log(ee); }
}

////// 鼠标放开时 //////
main.dom.data.onmouseup = function () {
    try {
        main.core.onup();
    }catch (e) { main.log(e); }
}

////// 鼠标滑轮滚动时 //////
main.dom.data.onmousewheel = function(e) {
    try {
        if (e.wheelDelta)
            main.core.onmousewheel(Math.sign(e.wheelDelta))
        else if (e.detail)
            main.core.onmousewheel(Math.sign(e.detail));
    } catch (ee) { main.log(ee); }
}

////// 手指在触摸屏开始触摸时 //////
main.dom.data.ontouchstart = function (e) {
    try {
        e.preventDefault();
        var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if (loc == null) return;
        main.core.ondown(loc);
    }catch (ee) { main.log(ee); }
}

////// 手指在触摸屏上移动时 //////
main.dom.data.ontouchmove = function (e) {
    try {
        e.preventDefault();
        var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if (loc == null) return;
        main.core.onmove(loc);
    }catch (ee) { main.log(ee); }
}

////// 手指离开触摸屏时 //////
main.dom.data.ontouchend = function (e) {
    try {
        e.preventDefault();
        main.core.onup();
    } catch (e) {
        main.log(e);
    }
}

////// 点击状态栏中的怪物手册时 //////
main.statusBar.image.book.onclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.triggerReplay();
        return;
    }

    if (main.core.isPlaying() && (core.status.event||{}).id=='paint') {
        core.actions.setPaintMode('paint');
        return;
    }

    if (main.core.isPlaying())
        main.core.openBook(true);
}

////// 点击状态栏中的楼层传送器/装备栏时 //////
main.statusBar.image.fly.onclick = function (e) {
    e.stopPropagation();

    // 播放录像时
    if (core.isReplaying()) {
        core.stopReplay();
        return;
    }

    // 绘图模式
    if (main.core.isPlaying() && (core.status.event||{}).id=='paint') {
        core.actions.setPaintMode('erase');
        return;
    }

    if (main.core.isPlaying()) {
        if (!main.core.flags.equipboxButton) {
            main.core.useFly(true);
        }
        else {
            main.core.openEquipbox(true)
        }
    }
}

////// 点击状态栏中的工具箱时 //////
main.statusBar.image.toolbox.onclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.rewindReplay();
        return;
    }

    if (main.core.isPlaying() && (core.status.event||{}).id=='paint') {
        core.actions.clearPaint();
        return;
    }

    if (main.core.isPlaying()) {
        main.core.openToolbox(core.status.event.id != 'equipbox');
    }
}

////// 双击状态栏中的工具箱时 //////
main.statusBar.image.toolbox.ondblclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.rewindReplay();
        return;
    }

    if (main.core.isPlaying())
        main.core.openEquipbox(true);

}

////// 点击状态栏中的虚拟键盘时 //////
main.statusBar.image.keyboard.onclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.bookReplay();
        return;
    }

    if (main.core.isPlaying())
        main.core.openKeyBoard(true);
}

////// 点击状态栏中的快捷商店键盘时 //////
main.statusBar.image.shop.onclick = function (e) {
    e.stopPropagation();

    if (main.core.isPlaying())
        main.core.openQuickShop(true);
}

////// 点击金币时也可以开启虚拟键盘 //////
main.statusBar.image.money.onclick = function (e) {
    e.stopPropagation();

    if (main.core.isPlaying())
        main.core.openQuickShop(true);
}

////// 点击状态栏中的存档按钮时 //////
main.statusBar.image.save.onclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.speedDownReplay();
        return;
    }

    if (main.core.isPlaying() && (core.status.event||{}).id=='paint') {
        core.actions.savePaint();
        return;
    }

    if (main.core.isPlaying())
        main.core.save(true);
}

////// 点击状态栏中的读档按钮时 //////
main.statusBar.image.load.onclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.speedUpReplay();
        return;
    }

    if (main.core.isPlaying() && (core.status.event||{}).id=='paint') {
        core.actions.loadPaint();
        return;
    }

    if (main.core.isPlaying())
        main.core.load(true);
}

////// 点击状态栏中的系统菜单时 //////
main.statusBar.image.settings.onclick = function (e) {
    e.stopPropagation();

    if (core.isReplaying()) {
        core.saveReplay();
        return;
    }

    if (main.core.isPlaying() && (core.status.event||{}).id=='paint') {
        core.actions.exitPaint();
        return;
    }

    if (main.core.isPlaying())
        main.core.openSettings(true);
}

////// 点击工具栏时 //////
main.dom.toolBar.onclick = function () {
    if (core.isReplaying())
        return;
    main.core.control.setToolbarButton(!core.domStyle.toolbarBtn);
}

////// 手机端的按钮1-7 //////
main.statusBar.image.btn1.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 49});
};

main.statusBar.image.btn2.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 50});
};

main.statusBar.image.btn3.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 51});
};

main.statusBar.image.btn4.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 52});
};

main.statusBar.image.btn5.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 53});
};

main.statusBar.image.btn6.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 54});
};

main.statusBar.image.btn7.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 55});
};

main.statusBar.image.btn8.onclick = function (e) {
    e.stopPropagation();
    main.core.onkeyUp({"keyCode": 56});
};

////// 点击“开始游戏”时 //////
main.dom.playGame.onclick = function () {
    main.dom.startButtons.style.display='none';
    main.core.control.checkBgm();

    if (main.core.isset(main.core.flags.startDirectly) && main.core.flags.startDirectly) {
        core.events.startGame("");
    }
    else {
        main.dom.levelChooseButtons.style.display='block';
    }
}

////// 点击“载入游戏”时 //////
main.dom.loadGame.onclick = function() {
    main.core.control.checkBgm();
    main.core.load();
}

////// 点击“录像回放”时 //////
main.dom.replayGame.onclick = function () {
    main.core.control.checkBgm();
    main.core.chooseReplayFile();
}

main.dom.musicBtn.onclick = function () {
    try {
        if (main.core)
            main.core.triggerBgm();
    } catch (e) {main.log(e);}
}

window.onblur = function () {
    if (main.core && main.core.control) {
        main.core.control.checkAutosave();
    }
}

}//listen end

var main = new main();