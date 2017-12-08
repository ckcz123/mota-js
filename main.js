function main() {
    this.version = "0.0.1";
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
        'startButtonGroup': document.getElementById('startButtonGroup'),
        'floorMsgGroup': document.getElementById('floorMsgGroup'),
        'logoLabel': document.getElementById('logoLabel'),
        'versionLabel': document.getElementById('versionLabel'),
        'floorNameLabel': document.getElementById('floorNameLabel'),
        'statusBar': document.getElementById('statusBar'),
        'toolBar': document.getElementById('toolBar'),
        'gameCanvas': document.getElementsByClassName('gameCanvas'),
        'startButtons': document.getElementById('startButtons'),
        'playGame': document.getElementById('playGame'),
        'loadGame': document.getElementById('loadGame'),
        'aboutGame': document.getElementById('aboutGame'),
        'levelChooseButtons': document.getElementById('levelChooseButtons'),
        'easyLevel': document.getElementById('easyLevel'),
        'normalLevel': document.getElementById('normalLevel'),
        'hardLevel': document.getElementById('hardLevel'),
        'data': document.getElementById('data'),
        'statusLabels': document.getElementsByClassName('statusLabel')
    };
    // console.log('加载游戏容器和开始界面dom对象完成 如下');
    // console.log(this.dom);
    this.loadList = [
        'items', 'icons', 'maps', 'enemys', 'events', 'data', 'ui', 'core'
    ];
    // console.log('加载js文件列表加载完成' + this.loadList);
    this.images = [
        'animates', 'enemys', 'heros', 'items', 'npcs', 'terrains'
    ];
    this.sounds = {
        'mp3': ['bgm-loop', 'floor'],
        'ogg': ['attack', 'door', 'item']
    }
    this.statusBar = {
        'image': {
            'floor': document.getElementById('img-floor'),
            'hp': document.getElementById("img-hp"),
            'atk': document.getElementById("img-atk"),
            'def': document.getElementById("img-def"),
            'mdef': document.getElementById("img-mdef"),
            'money': document.getElementById("img-money"),
            'experience': document.getElementById("img-experience"),
            'book': document.getElementById("img-book"),
            'fly': document.getElementById("img-fly"),
            'toolbox': document.getElementById("img-toolbox"),
            'shop': document.getElementById("img-shop"),
            'save': document.getElementById("img-save"),
            'load': document.getElementById("img-load"),
            'settings': document.getElementById("img-settings")
        },
        'floor': document.getElementById('floor'),
        'hp': document.getElementById('hp'),
        'atk': document.getElementById('atk'),
        'def': document.getElementById("def"),
        'mdef': document.getElementById('mdef'),
        'money': document.getElementById("money"),
        'experience': document.getElementById("experience"),
        'yellowKey': document.getElementById("yellowKey"),
        'blueKey': document.getElementById("blueKey"),
        'redKey': document.getElementById("redKey"),
        'poison': document.getElementById('poison'),
        'weak':document.getElementById('weak'),
        'curse': document.getElementById('curse'),
        'hard': document.getElementById("hard")
    }
    this.useCompress = false; // 是否使用压缩文件；发布前推荐使用“JS压缩工具”将所有js文件进行压缩，它会将此项改成true。
    // 只有useCompress是false时才会读取floors目录下的文件。如果要进行剧本的修改请务必将其改成false
    this.floorIds = [ // 在这里按顺序放所有的楼层；其顺序直接影响到楼层传送器的顺序和上楼器/下楼器的顺序
        "sample0", "sample1", "sample2"
    ]
    this.floors = {}
    this.instance = {};
    this.canvas = {};
}

main.prototype.init = function () {
    for (var i = 0; i < main.dom.gameCanvas.length; i++) {
        main.canvas[main.dom.gameCanvas[i].id] = main.dom.gameCanvas[i].getContext('2d');
    }
    main.loaderJs(function () {
        var coreData = {};
        for (i = 0; i < main.loadList.length; i++) {
            var name = main.loadList[i];
            if (name === 'core') continue;
            main[name].init(main.dom);
            coreData[name] = main[name];
        }
        main.loaderFloors(function() {
            main.core.init(main.dom, main.statusBar, main.canvas, main.images, main.sounds, main.floorIds, main.floors, coreData);
            main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
        })
    });
}

main.prototype.loaderJs = function (callback) {
    var instanceNum = 0;
    // 加载js
    main.setMainTipsText('正在加载核心js文件...')
    for (var i = 0; i < main.loadList.length; i++) {
        main.loadMod(main.loadList[i], function (modName) {
            instanceNum = 0;
            main.setMainTipsText(modName + '.js 加载完毕');
            for (var key in main.instance) {
                instanceNum++;
            }
            if (instanceNum === main.loadList.length) {
                delete main.instance;
                // main.dom.mainTips.style.display = 'none';
                callback();
            }
        });
    }
}

main.prototype.loaderFloors = function (callback) {
    // 加载js
    main.setMainTipsText('正在加载楼层文件...')
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

main.prototype.loadMod = function (modName, callback) {
    var script = document.createElement('script');
    var name = modName;
    script.src = 'libs/' + modName + '.js?' + this.version;
    main.dom.body.appendChild(script);
    script.onload = function () {
        main[name] = main.instance[name];
        callback(name);
    }
}

main.prototype.loadFloor = function(floorId, callback) {
    var script = document.createElement('script');
    script.src = 'libs/floors/' + floorId +'.js?' + this.version;
    main.dom.body.appendChild(script);
    script.onload = function () {
        callback(floorId);
    }
}

main.prototype.setMainTipsText = function (text) {
    main.dom.mainTips.innerHTML = text;
}

var main = new main();
main.init();

window.onresize = function () {
    try {
        main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
    }catch (e) {}
}

main.dom.body.onkeydown = function(e) {
    try {
        if (main.core.isPlaying())
            main.core.onkeyDown(e);
    } catch (ee) {}
}

main.dom.body.onkeyup = function(e) {
    try {
        if (main.core.isPlaying())
            main.core.onkeyUp(e);
    } catch (ee) {}
}

main.dom.body.onselectstart = function () {
    return false;
}

document.onmousemove = function() {
    try {
        main.core.loadSound();
    }catch (e) {}
}

document.ontouchstart = function() {
    try {
        main.core.loadSound();
    }catch (e) {}
}

main.dom.data.onmousedown = function (e) {
    try {
        e.stopPropagation();
        var loc = main.core.getClickLoc(e.clientX, e.clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        main.core.ondown(x, y);
    } catch (ee) {}
}

main.dom.data.onmousemove = function (e) {
    try {
        e.stopPropagation();
        var loc = main.core.getClickLoc(e.clientX, e.clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        main.core.onmove(x, y);
    }catch (ee) {}
}

main.dom.data.onmouseup = function () {
    try {
        main.core.onup();
    }catch (e) {}
}

main.dom.data.onmousewheel = function(e) {
    try {
        if (e.wheelDelta)
            main.core.onmousewheel(Math.sign(e.wheelDelta))
        else if (e.detal)
            main.core.onmousewheel(Math.sign(e.detail));
    } catch (ee) {}
}

main.dom.data.ontouchstart = function (e) {
    try {
        e.preventDefault();
        var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        //main.core.onclick(x, y, []);
        main.core.ondown(x, y);
    }catch (ee) {}
}

main.dom.data.ontouchmove = function (e) {
    try {
        e.preventDefault();
        var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        main.core.onmove(x, y);
    }catch (ee) {}
}

main.dom.data.ontouchend = function () {
    try {
        main.core.onup();
    } catch (e) {
    }
}

main.statusBar.image.book.onclick = function () {
    if (main.core.isPlaying())
        main.core.openBook(true);
}

main.statusBar.image.fly.onclick = function () {
    if (main.core.isPlaying())
        main.core.useFly(true);
}

main.statusBar.image.toolbox.onclick = function () {
    if (main.core.isPlaying())
        main.core.openToolbox(true);
}

main.statusBar.image.shop.onclick = function () {
    if (main.core.isPlaying())
        main.core.ui.drawQuickShop(true);
}

main.statusBar.image.save.onclick = function () {
    if (main.core.isPlaying())
        main.core.save(true);
}

main.statusBar.image.load.onclick = function () {
    if (main.core.isPlaying())
        main.core.load(true);
}

main.statusBar.image.settings.onclick = function () {
    if (main.core.isPlaying())
        main.core.ui.drawSettings(true);
}

main.dom.playGame.onclick = function () {
    main.dom.startButtons.style.display='none';

    /**
     * 如果点击“开始游戏”直接开始游戏而不是进入难度选择页面，则将下面这个改成true
     */
    var startGameNow = false;

    if (startGameNow) {
        core.events.startGame();
    }
    else {
        main.dom.levelChooseButtons.style.display='block';
    }
}

main.dom.loadGame.onclick = function() {
    main.core.load();
}

main.dom.aboutGame.onclick = function () {
    main.core.ui.drawAbout();
}

main.dom.easyLevel.onclick = function() {
    core.events.startGame('Easy');
}

main.dom.normalLevel.onclick = function () {
    core.events.startGame('Normal');
}

main.dom.hardLevel.onclick = function () {
    core.events.startGame('Hard');
}
