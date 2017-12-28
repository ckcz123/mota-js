function main() {
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
        'status': document.getElementsByClassName('status'),
        'toolBar': document.getElementById('toolBar'),
        'tools': document.getElementsByClassName('tools'),
        'gameCanvas': document.getElementsByClassName('gameCanvas'),
        'curtain': document.getElementById('curtain'),
        'startButtons': document.getElementById('startButtons'),
        'playGame': document.getElementById('playGame'),
        'loadGame': document.getElementById('loadGame'),
        'aboutGame': document.getElementById('aboutGame'),
        'levelChooseButtons': document.getElementById('levelChooseButtons'),
        'easyLevel': document.getElementById('easyLevel'),
        'normalLevel': document.getElementById('normalLevel'),
        'hardLevel': document.getElementById('hardLevel'),
        'data': document.getElementById('data'),
        'statusLabels': document.getElementsByClassName('statusLabel'),
        'floorCol': document.getElementById('floorCol'),
        'lvCol': document.getElementById('lvCol'),
        'mdefCol': document.getElementById('mdefCol'),
        'moneyCol': document.getElementById('moneyCol'),
        'expCol': document.getElementById('expCol'),
        'upCol': document.getElementById('upCol'),
        'debuffCol': document.getElementById('debuffCol'),
        'hard': document.getElementById('hard'),
    };
    this.loadList = [
        'items', 'icons', 'maps', 'enemys', 'events', 'data', 'ui', 'core'
    ];
    this.pureData = [ 
        "data","enemys","icons","maps","items"
    ];
    this.images = [
        'animates', 'enemys', 'hero', 'items', 'npcs', 'terrains'
        // Autotile 动态添加
    ];
    this.sounds = {
        'mp3': ['bgm-loop', 'floor'],
        'ogg': ['attack', 'door', 'item']
    }
    this.statusBar = {
        'image': {
            'floor': document.getElementById('img-floor'),
            'lv': document.getElementById('img-lv'),
            'hp': document.getElementById("img-hp"),
            'atk': document.getElementById("img-atk"),
            'def': document.getElementById("img-def"),
            'mdef': document.getElementById("img-mdef"),
            'money': document.getElementById("img-money"),
            'experience': document.getElementById("img-experience"),
            'up': document.getElementById("img-up"),
            'book': document.getElementById("img-book"),
            'fly': document.getElementById("img-fly"),
            'toolbox': document.getElementById("img-toolbox"),
            'shop': document.getElementById("img-shop"),
            'save': document.getElementById("img-save"),
            'load': document.getElementById("img-load"),
            'settings': document.getElementById("img-settings")
        },
        'floor': document.getElementById('floor'),
        'lv': document.getElementById('lv'),
        'hp': document.getElementById('hp'),
        'atk': document.getElementById('atk'),
        'def': document.getElementById("def"),
        'mdef': document.getElementById('mdef'),
        'money': document.getElementById("money"),
        'experience': document.getElementById("experience"),
        'up': document.getElementById('up'),
        'yellowKey': document.getElementById("yellowKey"),
        'blueKey': document.getElementById("blueKey"),
        'redKey': document.getElementById("redKey"),
        'poison': document.getElementById('poison'),
        'weak':document.getElementById('weak'),
        'curse': document.getElementById('curse'),
        'hard': document.getElementById("hard")
    }

    //------------------------ 用户修改内容 ------------------------//
    this.version = "0.1"; // 游戏版本号；如果更改了游戏内容建议修改此version以免造成缓存问题。
    //------------------------ 用户修改内容 END ------------------------//

    this.floors = {}
    this.instance = {};
    this.canvas = {};
}

main.prototype.init = function () {
    for (var i = 0; i < main.dom.gameCanvas.length; i++) {
        main.canvas[main.dom.gameCanvas[i].id] = main.dom.gameCanvas[i].getContext('2d');
    }
    main.loadPureData(function(){
        main.useCompress=data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.useCompress;
        main.floorIds=data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds;
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
            });
        });
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
    if (this.useCompress) { // 读取压缩文件
        var script = document.createElement('script');
        script.src = 'libs/floors.min.js?' + this.version;
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

main.prototype.loadMod = function (modName, callback) {
    var script = document.createElement('script');
    var name = modName;
    script.src = 'libs/' + modName + (this.useCompress?".min":"") + '.js?' + this.version;
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

main.prototype.loadPureData = function(callback) {
    var loadedNum = 0;
    main.pureData.forEach(function(name){
        var script = document.createElement('script');
        script.src = 'libs/floors/' + name +'.js?' + this.version;
        main.dom.body.appendChild(script);
        script.onload = function () {
            loadedNum++;
            if (loadedNum == main.pureData.length)callback();
        }
    });
    
}

main.prototype.setMainTipsText = function (text) {
    main.dom.mainTips.innerHTML = text;
}



main.prototype.listen = function () {

window.onresize = function () {
    try {
        main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
    }catch (e) {}
}

main.dom.body.onkeydown = function(e) {
    try {
        if (main.core.isPlaying() || main.core.status.lockControl)
            main.core.onkeyDown(e);
    } catch (ee) {}
}

main.dom.body.onkeyup = function(e) {
    try {
        if (main.core.isPlaying() || main.core.status.lockControl)
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
        if(e.button==1){// 把鼠标中键绑定为ESC
            core.keyUp(27);
            return;
        }
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
        else if (e.detail)
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

    if (main.core.isset(main.core.flags.startDirectly) && main.core.flags.startDirectly) {
        core.events.startGame("");
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

}//listen end

var main = new main();