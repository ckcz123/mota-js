"use strict";

function events() {
    this._init();
}

////// 初始化 //////
events.prototype._init = function () {
    this.eventdata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.events;
    this.commonEvent = events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent;
    this.systemEvents = {};
    this.actions = {};
}

// ------ 初始化，开始和结束 ------ //

/// 初始化游戏
events.prototype.resetGame = function (hero, hard, floorId, maps, values) {
    this.eventdata.resetGame(hero, hard, floorId, maps, values);
}

////// 游戏开始事件 //////
events.prototype.startGame = function (hard, seed, route, callback) {
    main.dom.levelChooseButtons.style.display = 'none';
    main.dom.startButtonGroup.style.display = 'none';
    hard = hard || "";

    if (main.mode != 'play') return;

    // 无动画的开始游戏
    if (core.flags.startUsingCanvas || route != null) {
        core.dom.startPanel.style.display = 'none';
        this._startGame_start(hard, seed, route, callback);
    }
    else {
        core.hideStartAnimate(function () {
            core.events._startGame_start(hard, seed, route, callback);
        });
    }
}

events.prototype._startGame_start = function (hard, seed, route, callback) {
    console.log('开始游戏');
    core.resetGame(core.firstData.hero, hard, null, core.initStatus.maps);
    var nowLoc = core.clone(core.getHeroLoc());
    core.setHeroLoc('x', -1);
    core.setHeroLoc('y', -1);

    if (seed != null) {
        core.setFlag('__seed__', seed);
        core.setFlag('__rand__', seed);
    }
    else core.utils.__init_seed();
    this.setInitData();

    core.clearMap('all');
    core.deleteAllCanvas();
    core.clearStatusBar();

    var todo = [];
    if (core.flags.startUsingCanvas) {
        core.hideStatusBar();
        core.dom.musicBtn.style.display = 'block';
        core.push(todo, core.firstData.startCanvas);
    }
    core.push(todo, core.firstData.startText);
    this.insertAction(todo, null, null, function () {
        core.events._startGame_afterStart(nowLoc, callback);
    });

    if (route != null) core.startReplay(route);
}

events.prototype._startGame_afterStart = function (nowLoc, callback) {
    core.ui.closePanel();
    core.showStatusBar();
    core.dom.musicBtn.style.display = 'none';
    core.changeFloor(core.firstData.floorId, null, nowLoc, null, function () {
        // 插入一个空事件避免直接回放录像出错
        core.insertAction([]);
        if (callback) callback();
    });
    this._startGame_upload();
}

events.prototype._startGame_upload = function () {
    // Upload
    var formData = new FormData();
    formData.append('type', 'people');
    formData.append('name', core.firstData.name);
    formData.append('version', core.firstData.version);
    formData.append('platform', core.platform.isPC ? "PC" : core.platform.isAndroid ? "Android" : core.platform.isIOS ? "iOS" : "");
    formData.append('hard', core.encodeBase64(core.status.hard));
    formData.append('hardCode', core.getFlag('hard', 0));
    formData.append('base64', 1);

    core.utils.http("POST", "/games/upload.php", formData);
}

////// 不同难度分别设置初始属性 //////
events.prototype.setInitData = function () {
    return this.eventdata.setInitData();
}

////// 游戏获胜事件 //////
events.prototype.win = function (reason, norank) {
    core.status.gameOver = true;
    return this.eventdata.win(reason, norank);
}

////// 游戏失败事件 //////
events.prototype.lose = function (reason) {
    core.status.gameOver = true;
    return this.eventdata.lose(reason);
}

////// 游戏结束 //////
events.prototype.gameOver = function (ending, fromReplay, norank) {
    core.clearMap('all');
    core.deleteAllCanvas();
    core.dom.gif2.innerHTML = "";
    core.setWeather();
    core.ui.closePanel();

    if (main.isCompetition && ending != null) {
        if (ending == "") ending = "恭喜通关";
        ending += "[比赛]";
    }

    var reason = null;
    if (fromReplay) reason = "录像回放完毕！";
    else if (core.hasFlag("debug")) reason = "\t[系统提示]调试模式下无法上传成绩";
    else if (core.hasFlag("__consoleOpened__")) reason = "\t[系统提示]本存档开启过控制台，无法上传成绩";

    if (reason != null)
        core.drawText(reason, core.restart);
    else
        this._gameOver_confirmUpload(ending, norank);
}

events.prototype._gameOver_confirmUpload = function (ending, norank) {
    core.ui.closePanel();

    if (ending == null) {
        this._gameOver_confirmDownload(ending);
        return;
    }
    core.ui.drawConfirmBox("你想记录你的ID和成绩吗？", function () {
        if (main.isCompetition) {
            core.events._gameOver_doUpload("", ending, norank);
        }
        else {
            core.myprompt("请输入你的ID：", core.getCookie('id') || "", function (username)  {
                core.events._gameOver_doUpload(username, ending, norank);
            });
        }
    }, function () {
        if (main.isCompetition)
            core.events._gameOver_confirmDownload(ending);
        else
            core.events._gameOver_doUpload(null, ending, norank);
    })
}

events.prototype._gameOver_doUpload = function (username, ending, norank) {
    var hp = core.status.hero.hp;
    if (username == null) hp = 1;
    core.ui.closePanel();
    // upload
    var formData = new FormData();
    formData.append('type', 'score');
    formData.append('name', core.firstData.name);
    formData.append('version', core.firstData.version);
    formData.append('platform', core.platform.isPC ? "PC" : core.platform.isAndroid ? "Android" : core.platform.isIOS ? "iOS" : "");
    formData.append('hard', core.encodeBase64(core.status.hard));
    formData.append('username', core.encodeBase64(username || ""));
    formData.append('ending', core.encodeBase64(ending));
    formData.append('lv', core.status.hero.lv);
    formData.append('hp', Math.min(hp, Math.pow(2, 63)));
    formData.append('atk', core.status.hero.atk);
    formData.append('def', core.status.hero.def);
    formData.append('mdef', core.status.hero.mdef);
    formData.append('money', core.status.hero.money);
    formData.append('experience', core.status.hero.experience);
    formData.append('steps', core.status.hero.steps);
    formData.append('norank', norank || 0);
    formData.append('seed', core.getFlag('__seed__'));
    formData.append('totalTime', Math.floor(core.status.hero.statistics.totalTime / 1000));
    formData.append('route', core.encodeRoute(core.status.route));
    formData.append('base64', 1);

    if (main.isCompetition)
        core.http("POST", "/games/competition/upload.php", formData);
    else
        core.http("POST", "/games/upload.php", formData);

    core.events._gameOver_confirmDownload(ending);
}

events.prototype._gameOver_confirmDownload = function (ending) {
    core.ui.closePanel();
    core.ui.drawConfirmBox("你想下载录像吗？", function () {
        var obj = {
            'name': core.firstData.name,
            'version': core.firstData.version,
            'hard': core.status.hard,
            'seed': core.getFlag('__seed__'),
            'route': core.encodeRoute(core.status.route)
        }
        core.download(core.firstData.name + "_" + core.formatDate2(new Date()) + ".h5route", JSON.stringify(obj));
        core.events._gameOver_askRate(ending);
    }, function () {
        core.events._gameOver_askRate(ending);
    });
}

events.prototype._gameOver_askRate = function (ending) {
    if (ending == null) {
        core.restart();
        return;
    }

    core.ui.closePanel();
    core.ui.drawConfirmBox("恭喜通关本塔，你想进行评分吗？", function () {
        if (core.platform.isPC) {
            window.open("/score.php?name=" + core.firstData.name + "&num=10", "_blank");
            core.restart();
        }
        else {
            window.location.href = "/score.php?name=" + core.firstData.name + "&num=10";
        }
    }, function () {
        core.restart();
    });
}

// ------ 系统事件的处理 ------ //

////// 注册一个系统事件 //////
// type为事件名，func为事件的处理函数，可接受(data, callback)参数
events.prototype.registerSystemEvent = function (type, func) {
    this.systemEvents[type] = func;
}

////// 注销一个系统事件 //////
events.prototype.unregisterSystemEvent = function (type) {
    delete this.systemEvents[type];
}

////// 执行一个系统事件 //////
events.prototype.doSystemEvent = function (type, data, callback) {
    if (this.systemEvents[type]) {
        try {
            return core.doFunc(this.systemEvents[type], this, data, data, callback);
        }
        catch (e) {
            main.log(e);
            main.log("ERROR in systemEvents["+type+"]");
        }
    }
    if (this["_sys_" + type]) return this["_sys_" + type](data, callback);
    main.log("未知的系统事件: " + type + "！");
    if (callback) callback();
}

////// 触发(x,y)点的事件 //////
events.prototype._trigger = function (x, y) {
    // 如果已经死亡，或正处于某事件中，则忽略
    if (core.status.gameOver || core.status.event.id) return;

    var block = core.getBlock(x, y);
    if (block == null) return;
    block = block.block;
    if (block.event.trigger) {
        var noPass = block.event.noPass, trigger = block.event.trigger;
        if (noPass) core.clearAutomaticRouteNode(x, y);

        // 转换楼层能否穿透
        if (trigger == 'changeFloor' && !noPass && this._trigger_ignoreChangeFloor(block))
            return;
        core.status.automaticRoute.moveDirectly = false;
        this.doSystemEvent(trigger, block, function () {
            if (trigger == 'openDoor' || trigger == 'changeFloor')
                core.replay();
        })
    }
}

events.prototype._trigger_ignoreChangeFloor = function (block) {
    var able = core.flags.ignoreChangeFloor;
    if (block.event.data && block.event.data.ignoreChangeFloor != null)
        able = block.event.data.ignoreChangeFloor;
    if (able) {
        if (core.isReplaying()) {
            if (core.status.replay.toReplay[0] == 'no') {
                core.status.replay.toReplay.shift();
                core.status.route.push("no");
                return true;
            }
        }
        else if (core.status.automaticRoute.autoHeroMove
            || core.status.automaticRoute.autoStep < core.status.automaticRoute.autoStepRoutes.length) {
            core.status.route.push("no");
            return true;
        }
    }
    return false;
}

events.prototype._sys_battle = function (data, callback) {
    this.battle(data.event.id, data.x, data.y, false, callback);
}

////// 战斗 //////
events.prototype.battle = function (id, x, y, force, callback) {
    core.saveAndStopAutomaticRoute();
    id = id || core.getBlockId(x, y);
    if (!id) return core.clearContinueAutomaticRoute(callback);
    // 非强制战斗
    if (!core.enemys.canBattle(id, x, y) && !force && !core.status.event.id) {
        core.drawTip("你打不过此怪物！");
        return core.clearContinueAutomaticRoute(callback);
    }
    // 自动存档
    if (!core.status.event.id) core.autosave(true);
    // 战前事件
    if (!this.beforeBattle(id, x, y))
        return core.clearContinueAutomaticRoute(callback);
    // 战后事件
    this.afterBattle(id, x, y, callback);
}

////// 战斗前触发的事件 //////
events.prototype.beforeBattle = function (enemyId, x, y) {
    return this.eventdata.beforeBattle(enemyId, x, y)
}

////// 战斗结束后触发的事件 //////
events.prototype.afterBattle = function (enemyId, x, y, callback) {
    return this.eventdata.afterBattle(enemyId, x, y, callback);
}

events.prototype._sys_openDoor = function (data, callback) {
    this.openDoor(data.event.id, data.x, data.y, true, callback);
}

////// 开门 //////
events.prototype.openDoor = function (id, x, y, needKey, callback) {
    id = id || core.getBlockId(x, y);
    core.saveAndStopAutomaticRoute();
    if (!this._openDoor_check(id, x, y, needKey)) {
        core.waitHeroToStop(function () {
            core.unLockControl();
            if (callback) callback();
        });
        return;
    }
    core.playSound("door.mp3");
    this._openDoor_animate(id, x, y, callback);
}

events.prototype._openDoor_check = function (id, x, y, needKey) {
    // 是否存在门或暗墙
    if (!core.terrainExists(x, y, id) || !(id.endsWith("Door") || id.endsWith("Wall"))
        || !core.material.icons.animates[id]) {
        core.clearContinueAutomaticRoute();
        return false;
    }

    if (needKey && id.endsWith("Door")) {
        var key = id.replace("Door", "Key");
        if (!core.hasItem(key)) {
            if (key != "specialKey")
                core.drawTip("你没有" + ((core.material.items[key] || {}).name || "钥匙"));
            else core.drawTip("无法开启此门");
            core.clearContinueAutomaticRoute();
            return false;
        }
        core.autosave(true);
        core.removeItem(key);
    }
    return true;
}

events.prototype._openDoor_animate = function (id, x, y, callback) {
    var door = core.material.icons.animates[id];
    var speed = id.endsWith("Door") ? 30 : 70;

    core.lockControl();
    core.status.replay.animate = true;
    var state = 0;
    var animate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(animate);
            core.removeBlock(x, y);
            core.unLockControl();
            core.status.replay.animate = false;
            core.events.afterOpenDoor(id, x, y, callback);
            return;
        }
        core.clearMap('event', 32 * x, 32 * y, 32, 32);
        core.drawImage('event', core.material.images.animates, 32 * state, 32 * door, 32, 32, 32 * x, 32 * y, 32, 32);
    }, speed / core.status.replay.speed);
}

////// 开一个门后触发的事件 //////
events.prototype.afterOpenDoor = function (doorId, x, y, callback) {
    return this.eventdata.afterOpenDoor(doorId, x, y, callback);
}

events.prototype._sys_getItem = function (data, callback) {
    this.getItem(data.event.id, 1, data.x, data.y, callback);
}

////// 获得某个物品 //////
events.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    itemNum = itemNum || 1;
    var itemCls = core.material.items[itemId].cls;
    core.items.getItemEffect(itemId, itemNum);
    core.removeBlock(itemX, itemY);
    var text = '获得 ' + core.material.items[itemId].name;
    if (itemNum > 1) text += "x" + itemNum;
    if (itemCls === 'items') text += core.items.getItemEffectTip(itemId);
    core.drawTip(text, core.material.icons.items[itemId]);
    core.updateStatusBar();

    this.eventdata.afterGetItem(itemId, itemX, itemY, callback);
}

////// 获得面前的物品（轻按） //////
events.prototype.getNextItem = function () {
    if (core.isMoving() || !core.canMoveHero() || !core.flags.enableGentleClick) return false;

    var nextX = core.nextX(), nextY = core.nextY();
    var block = core.getBlock(nextX, nextY);
    if (block == null) return false;
    if (block.block.event.trigger == 'getItem') {
        core.status.route.push("getNext");
        this.getItem(block.block.event.id, 1, nextX, nextY);
        return true;
    }
    return false;
}

events.prototype._sys_changeFloor = function (data, callback) {
    data = data.event.data;
    var heroLoc = {};
    if (data.loc) heroLoc = {'x': data.loc[0], 'y': data.loc[1]};
    if (data.direction) heroLoc.direction = data.direction;
    if (core.status.event.id != 'action') core.status.event.id = null;
    core.changeFloor(data.floorId, data.stair, heroLoc, data.time, callback);
}

////// 楼层切换 //////
events.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback, fromLoad) {
    var info = this._changeFloor_getInfo(floorId, stair, heroLoc, time);
    if (info == null) {
        if (callback) callback();
        return;
    }
    info.fromLoad = fromLoad;
    floorId = info.floorId;

    core.dom.floorNameLabel.innerHTML = core.status.maps[floorId].title;
    core.lockControl();
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    core.status.replay.animate = true;

    this._changeFloor_beforeChange(info, callback);
}

events.prototype._changeFloor_getInfo = function (floorId, stair, heroLoc, time) {
    floorId = floorId || core.status.floorId;
    if (floorId == ':before') {
        var index = core.floorIds.indexOf(core.status.floorId);
        if (index > 0) floorId = core.floorIds[index - 1];
        else floorId = core.status.floorId;
    }
    else if (floorId == ':next') {
        var index = core.floorIds.indexOf(core.status.floorId);
        if (index < core.floorIds.length - 1) floorId = core.floorIds[index + 1];
        else floorId = core.status.floorId;
    }
    if (!core.status.maps[floorId]) {
        main.log("不存在的楼层：" + floorId);
        return null;
    }

    if (main.mode != 'play' || core.isReplaying()) time = 0;
    if (time == null) time = core.values.floorChangeTime;
    if (time == null) time = 800;
    if (time < 100) time = 0;
    time /= 20;

    return {
        floorId: floorId,
        time: time,
        heroLoc: core.clone(this._changeFloor_getHeroLoc(floorId, stair, heroLoc))
    };
}

events.prototype._changeFloor_getHeroLoc = function (floorId, stair, heroLoc) {
    if (!heroLoc)
        heroLoc = core.clone(core.status.hero.loc);
    if (stair) {
        // 检查该层地图的 upFloor & downFloor
        if (core.status.maps[floorId][stair]) {
            heroLoc.x = core.status.maps[floorId][stair][0];
            heroLoc.y = core.status.maps[floorId][stair][1];
        }
        else {
            var blocks = core.status.maps[floorId].blocks;
            for (var i in blocks) {
                if (!blocks[i].disable && blocks[i].event.id === stair) {
                    heroLoc.x = blocks[i].x;
                    heroLoc.y = blocks[i].y;
                    break;
                }
            }
        }
    }
    ['x', 'y', 'direction'].forEach(function (name) {
        if (heroLoc[name] == null)
            heroLoc[name] = core.getHeroLoc(name);
    });
    return heroLoc;
}

events.prototype._changeFloor_beforeChange = function (info, callback) {
    core.playSound('floor.mp3');
    // 需要 setTimeout 执行，不然会出错
    window.setTimeout(function () {
        if (info.time == 0)
            core.events._changeFloor_changing(info, callback);
        else
            core.show(core.dom.floorMsgGroup, info.time / 2, function () {
                core.events._changeFloor_changing(info, callback);
            });
    }, 25)
}

events.prototype._changeFloor_changing = function (info, callback) {
    this.changingFloor(info.floorId, info.heroLoc, info.fromLoad);

    if (info.time == 0)
        this._changeFloor_afterChange(info, callback);
    else
        core.hide(core.dom.floorMsgGroup, info.time / 4, function () {
            core.events._changeFloor_afterChange(info, callback);
        });
}

events.prototype._changeFloor_afterChange = function (info, callback) {
    core.unLockControl();
    core.status.replay.animate = false;
    core.events.afterChangeFloor(info.floorId, info.fromLoad);

    if (callback) callback();
}

events.prototype.changingFloor = function (floorId, heroLoc, fromLoad) {
    this.eventdata.changingFloor(floorId, heroLoc, fromLoad);
}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId, fromLoad) {
    if (main.mode != 'play') return;
    return this.eventdata.afterChangeFloor(floorId, fromLoad);
}

////// 是否到达过某个楼层 //////
events.prototype.hasVisitedFloor = function (floorId) {
    return core.getFlag("__visited__")[floorId] || false;
}

////// 到达某楼层 //////
events.prototype.visitFloor = function (floorId) {
    core.getFlag("__visited__")[floorId] = true;
}

events.prototype._sys_passNet = function (data, callback) {
    this.passNet(data);
    if (callback) callback();
}

////// 经过一个路障 //////
events.prototype.passNet = function (data) {
    if (core.hasItem('shoes')) return;
    // 血网 lavaNet 移动到 checkBlock 中处理
    if (data.event.id == 'poisonNet') { // 毒网
        core.insertAction({"type":"insert","name":"毒衰咒处理","args":[0]});
    }
    else if (data.event.id == 'weakNet') { // 衰网
        core.insertAction({"type":"insert","name":"毒衰咒处理","args":[1]});
    }
    else if (data.event.id == 'curseNet') { // 咒网
        core.insertAction({"type":"insert","name":"毒衰咒处理","args":[2]});
    }
    core.updateStatusBar();
}

events.prototype._sys_pushBox = function (data, callback) {
    this.pushBox(data);
    if (callback) callback();
}

////// 推箱子 //////
events.prototype.pushBox = function (data) {
    if (data.event.id != 'box' && data.event.id != 'boxed') return;

    // 判断还能否前进，看看是否存在事件
    var direction = core.getHeroLoc('direction'),
        nx = data.x + core.utils.scan[direction].x, ny = data.y + core.utils.scan[direction].y;

    // 检测能否推上去
    if (!core.canMoveHero() || !core.canMoveHero(data.x, data.y, direction)) return;
    var nextId = core.getBlockId(nx, ny);
    if (nextId != null && nextId != 'flower') return;

    core.setBlock(nextId == null ? 169 : 170, nx, ny);

    if (data.event.id == 'box')
        core.removeBlock(data.x, data.y);
    else
        core.setBlock(168, data.x, data.y);

    core.updateStatusBar();
    this._pushBox_moveHero(direction);
}

events.prototype._pushBox_moveHero = function (direction) {
    core.status.replay.animate = true;
    core.lockControl();
    setTimeout(function () {
        core.moveHero(direction, function () {
            core.status.replay.animate = false;
            core.status.route.pop();
            core.events.afterPushBox();
            // 可能有阻击...
            if (core.status.event.id == null) {
                core.unLockControl();
                core.replay();
            }
        });
    });
}

////// 推箱子后的事件 //////
events.prototype.afterPushBox = function () {
    return this.eventdata.afterPushBox();
}

events.prototype._sys_changeLight = function (data, callback) {
    core.events.changeLight(data.event.id, data.x, data.y);
    if (callback) callback();
}

////// 改变亮灯（感叹号）的事件 //////
events.prototype.changeLight = function (id, x, y) {
    if (id != null && id != 'light') return;
    core.setBlock(core.getNumberById('darkLight'), x, y);
    this.afterChangeLight(x, y);
}

////// 改变亮灯之后，可以触发的事件 //////
events.prototype.afterChangeLight = function (x, y) {
    return this.eventdata.afterChangeLight(x, y);
}

events.prototype._sys_ski = function (data, callback) {
    core.insertAction(["V2.6后，请将滑冰放在背景层！"], data.x, data.y, callback);
}

events.prototype._sys_action = function (data, callback) {
    var ev = core.clone(data.event.data), ex = data.x, ey = data.y;
    // 检查是否需要改变朝向
    if (ex == core.nextX() && ey == core.nextY()) {
        var dir = core.reverseDirection();
        var id = data.event.id, toId = (data.event.faceIds || {})[dir];
        if (toId && id != toId) {
            var number = core.icons.getNumberById(toId);
            if (number > 0)
                core.setBlock(number, ex, ey);
        }
    }
    this.insertAction(ev, ex, ey, callback);
}

// ------ 自定义事件的处理 ------ //

////// 注册一个自定义事件 //////
// type为事件名，func为事件的处理函数，可接受(data, x, y, prefix)参数
// data为事件内容，x和y为当前点坐标（可为null），prefix为当前点前缀
events.prototype.registerEvent = function (type, func) {
    this.actions[type] = func;
}

////// 注销一个自定义事件
events.prototype.unregisterEvent = function (type) {
    delete this.actions[type];
}

////// 执行一个自定义事件
events.prototype.doEvent = function (data, x, y, prefix) {
    var type = data.type;
    if (this.actions[type]) {
        try {
            return core.doFunc(this.actions[type], this, data, x, y, prefix);
        }
        catch (e) {
            main.log(e);
            main.log("ERROR in actions["+type+"]");
        }
    }
    if (this["_action_" + type]) return this["_action_" + type](data, x, y, prefix);
    core.insertAction("未知的自定义事件: " + type + "！");
    core.doAction();
}

////// 开始执行一系列自定义事件 //////
events.prototype.doEvents = function (list, x, y, callback) {
    if (!list) return;
    if (!(list instanceof Array)) {
        list = [list];
    }
    this.setEvents(list, x, y, callback);
    // 停止勇士
    core.waitHeroToStop(function () {
        core.lockControl();
        core.doAction();
    });
}

events.prototype.setEvents = function (list, x, y, callback) {
    var data = core.status.event.data || {};
    if (list)
        data.list = [{todo: core.clone(list), total: core.clone(list), condition: "false"}];
    if (x != null) data.x = x;
    if (y != null) data.y = y;
    if (callback) data.callback = callback;
    core.status.event.id = 'action';
    core.status.event.data = data;
}

////// 执行当前自定义事件列表中的下一个事件 //////
events.prototype.doAction = function () {
    // 清空boxAnimate和UI层
    core.status.boxAnimateObjs = [];
    clearInterval(core.status.event.interval);
    core.status.event.interval = null;
    core.clearSelector();
    // 判定是否执行完毕
    if (this._doAction_finishEvents()) return;
    // 当前点坐标和前缀
    var x = core.status.event.data.x, y = core.status.event.data.y;
    var prefix = [core.status.floorId || ":f", x != null ? x : "x", y != null ? y : "y"].join("@");
    var current = core.status.event.data.list[0];
    if (this._popEvents(current, prefix)) return;
    // 当前要执行的事件
    var data = current.todo.shift();
    core.status.event.data.current = data;
    if (typeof data == "string")
        data = {"type": "text", "text": data};
    core.status.event.data.type = data.type;
    this.doEvent(data, x, y, prefix);
    return;
}

events.prototype._doAction_finishEvents = function () {
    // 事件处理完毕
    if (core.status.event.data.list.length == 0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel();
        if (callback) callback();
        core.replay();
        return true;
    }
    return false;
}

events.prototype._popEvents = function (current, prefix) {
    if (current.todo.length == 0) { // current list is empty
        if (core.calValue(current.condition, prefix)) { // check condition
            current.todo = core.clone(current.total);
        }
        else {
            core.status.event.data.list.shift(); // remove stack
        }
        core.doAction();
        return true;
    }
    return false;
}

////// 往当前事件列表之前添加一个或多个事件 //////
events.prototype.insertAction = function (action, x, y, callback, addToLast) {
    if (core.hasFlag("__statistics__")) return;
    if (core.status.gameOver) return;

    // ------ 判定commonEvent
    var commonEvent = this.getCommonEvent(action);
    if (commonEvent instanceof Array) action = commonEvent;
    if (!action) return;

    if (core.status.event.id != 'action') {
        this.doEvents(action, x, y, callback);
    }
    else {
        if (addToLast)
            core.push(core.status.event.data.list[0].todo, action)
        else
            core.unshift(core.status.event.data.list[0].todo, action);
        this.setEvents(null, x, y, callback);
    }
}

////// 获得一个公共事件 //////
events.prototype.getCommonEvent = function (name) {
    if (!name || typeof name !== 'string') return null;
    return this.commonEvent[name] || null;
}

////// 恢复一个事件 //////
events.prototype.recoverEvents = function (data) {
    if (data) {
        core.ui.closePanel();
        core.lockControl();
        core.status.event.id = 'action';
        core.status.event.data = data;
        setTimeout(function () {
            core.doAction();
        }, 30);
        return true;
    }
    return false;
}

// ------ 样板提供的的自定义事件 ------ //

events.prototype.__action_checkReplaying = function () {
    if (core.isReplaying()) {
        core.doAction();
        return true;
    }
    return false;
}

events.prototype.__action_getLoc = function (loc, x, y, prefix) {
    if (loc) {
        x = core.calValue(loc[0], prefix);
        y = core.calValue(loc[1], prefix);
    }
    return [x, y];
}

events.prototype.__action_getHeroLoc = function (loc, prefix) {
    return this.__action_getLoc(loc, core.getHeroLoc('x'), core.getHeroLoc('y'), prefix);
}

events.prototype.__action_getLoc2D = function (loc, x, y, prefix) {
    if (!(loc && loc[0] instanceof Array))
        loc = [this.__action_getLoc(loc, x, y, prefix)];
    return loc;
}

events.prototype.__action_doAsyncFunc = function (isAsync, func) {
    var parameters = Array.prototype.slice.call(arguments, 2);
    if (isAsync) {
        func.apply(this, parameters);
        core.doAction();
    }
    else {
        func.apply(this, parameters.concat(core.doAction));
    }
}

events.prototype._action_text = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    core.ui.drawTextBox(data.text, data.showAll);
}

events.prototype._action_autoText = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    core.ui.drawTextBox(data.text);
    setTimeout(core.doAction, data.time || 3000);
}

events.prototype._action_scrollText = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    this.__action_doAsyncFunc(data.async, core.ui.drawScrollText, data.text, data.lineHeight || 1.4, data.time || 5000);
}

events.prototype._action_comment = function (data, x, y, prefix) {
    core.doAction();
}

events.prototype._action_setText = function (data, x, y, prefix) {
    ["position", "offset", "align", "bold", "titlefont", "textfont", "time"].forEach(function (t) {
        if (data[t] != null) core.status.textAttribute[t] = data[t];
    });
    ["background", "title", "text"].forEach(function (t) {
        if ((data[t] instanceof Array) && data[t].length >= 3) {
            if (data[t].length == 3) data[t].push(1);
            core.status.textAttribute[t] = data[t];
        }
        if (t == 'background') {
            var img = core.material.images.images[data[t]];
            if (img && img.width == 192 && img.height == 128) {
                core.status.textAttribute[t] = data[t];
            }
        }
    });
    core.setFlag('textAttribute', core.status.textAttribute);
    core.doAction();
}

events.prototype._action_tip = function (data, x, y, prefix) {
    core.drawTip(core.replaceText(data.text));
    core.doAction();
}

events.prototype._action_show = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    if (data.time > 0 && !(data.floorId && data.floorId != core.status.floorId)) {
        this.__action_doAsyncFunc(data.async, core.animateBlock, data.loc, 'show', data.time);
    }
    else {
        data.loc.forEach(function (t) {
            core.showBlock(t[0], t[1], data.floorId);
        });
        core.doAction();
    }
}

events.prototype._action_hide = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    if (data.time > 0 && !(data.floorId && data.floorId != core.status.floorId)) {
        data.loc.forEach(function (t) {
            core.hideBlock(t[0], t[1], data.floorId);
        });
        this.__action_doAsyncFunc(data.async, core.animateBlock, data.loc, 'hide', data.time);
    }
    else {
        data.loc.forEach(function (t) {
            core.removeBlock(t[0], t[1], data.floorId)
        });
        core.doAction();
    }
}

events.prototype._action_setBlock = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    core.setBlock(data.number, loc[0], loc[1], data.floorId);
    core.doAction();
}

events.prototype._action_showFloorImg = function (data, x, y, prefix) {
    core.maps.showFloorImage(this.__action_getLoc2D(data.loc, x, y, prefix), data.floorId, core.doAction);
}

events.prototype._action_hideFloorImg = function (data, x, y, prefix) {
    core.maps.hideFloorImage(this.__action_getLoc2D(data.loc, x, y, prefix), data.floorId, core.doAction);
}

events.prototype._action_showBgFgMap = function (data, x, y, prefix) {
    core.maps.showBgFgMap(data.name, this.__action_getLoc2D(data.loc, x, y, prefix), data.floorId, core.doAction)
}

events.prototype._action_hideBgFgMap = function (data, x, y, prefix) {
    core.maps.hideBgFgMap(data.name, this.__action_getLoc2D(data.loc, x, y, prefix), data.floorId, core.doAction);
}

events.prototype._action_setBgFgBlock = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    core.setBgFgBlock(data.name, data.number, loc[0], loc[1], data.floorId);
    core.doAction();
}

events.prototype._action_follow = function (data, x, y, prefix) {
    this.follow(data.name);
    core.doAction();
}

events.prototype._action_unfollow = function (data, x, y, prefix) {
    this.unfollow(data.name);
    core.doAction();
}

events.prototype._action_animate = function (data, x, y, prefix) {
    if (data.loc == 'hero') data.loc = [core.getHeroLoc('x'), core.getHeroLoc('y')];
    else data.loc = this.__action_getLoc(data.loc, x, y, prefix);
    this.__action_doAsyncFunc(data.async, core.drawAnimate, data.name, data.loc[0], data.loc[1]);
}

events.prototype._action_move = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    this.__action_doAsyncFunc(data.async, core.moveBlock, loc[0], loc[1], data.steps, data.time, data.keep);
}

events.prototype._action_moveHero = function (data, x, y, prefix) {
    this.__action_doAsyncFunc(data.async, core.eventMoveHero, data.steps, data.time);
}

events.prototype._action_jump = function (data, x, y, prefix) {
    var from = this.__action_getLoc(data.from, x, y, prefix),
        to = this.__action_getLoc(data.to, x, y, prefix);
    this.__action_doAsyncFunc(data.async, core.jumpBlock, from[0], from[1], to[0], to[1], data.time, data.keep);
}

events.prototype._action_jumpHero = function (data, x, y, prefix) {
    var loc = this.__action_getHeroLoc(data.loc, prefix);
    this.__action_doAsyncFunc(data.async, core.jumpHero, loc[0], loc[1], data.time);
}

events.prototype._action_changeFloor = function (data, x, y, prefix) {
    var loc = this.__action_getHeroLoc(data.loc, prefix);
    var heroLoc = {x: loc[0], y: loc[1], direction: data.direction};
    core.changeFloor(data.floorId || core.status.floorId, null, heroLoc, data.time, function () {
        core.lockControl();
        core.doAction();
    });
}

events.prototype._action_changePos = function (data, x, y, prefix) {
    core.clearMap('hero');
    var loc = this.__action_getHeroLoc(data.loc, prefix);
    core.setHeroLoc('x', loc[0]);
    core.setHeroLoc('y', loc[1]);
    if (data.direction) core.setHeroLoc('direction', data.direction);
    core.drawHero();
    core.doAction();
}

events.prototype._action_showImage = function (data, x, y, prefix) {
    if (core.isReplaying()) data.time = 0;
    this.__action_doAsyncFunc(data.async || data.time == 0, this.showImage,
        data.code, data.image, data.sloc, data.loc, data.opacity, data.time);
}

events.prototype._action_showTextImage = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, 0, 0, prefix);
    if (core.isReplaying()) data.time = 0;
    this.__action_doAsyncFunc(data.async || data.time == 0, this.showImage,
        data.code, core.ui.textImage(data.text), loc[0], loc[1], 100, 100, data.opacity, data.time);
}

events.prototype._action_hideImage = function (data, x, y, prefix) {
    if (core.isReplaying()) data.time = 0;
    this.__action_doAsyncFunc(data.async || data.time == 0, this.hideImage, data.code, data.time);
}

events.prototype._action_showGif = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, 0, 0, prefix);
    this.showGif(data.name, loc[0], loc[1]);
    core.doAction();
}

events.prototype._action_moveImage = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    this.__action_doAsyncFunc(data.async, this.moveImage, data.code, data.to, data.opacity, data.time);
}

events.prototype._action_setFg = function (data, x, y, prefix) {
    if (data.async) {
        core.setFg(data.color, data.time);
        core.setFlag('__color__', data.color || null);
        core.doAction();
    }
    else {
        core.setFg(data.color, data.time, function () {
            core.setFlag('__color__', data.color || null);
            core.doAction();
        });
    }
}

events.prototype._action_screenFlash = function (data, x, y, prefix) {
    this.__action_doAsyncFunc(data.async, core.screenFlash, data.color, data.time, data.times);
}

events.prototype._action_setWeather = function (data, x, y, prefix) {
    core.setWeather(data.name, data.level);
    if (data.name == 'rain' || data.name == 'snow' || data.name == 'fog')
        core.setFlag('__weather__', [data.name, data.level]);
    else core.removeFlag('__weather__');
    core.doAction();
}

events.prototype._action_openDoor = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    var floorId = data.floorId || core.status.floorId;
    if (floorId == core.status.floorId) {
        core.openDoor(null, loc[0], loc[1], data.needKey, function () {
            core.lockControl();
            core.doAction();
        });
    }
    else {
        core.removeBlock(loc[0], loc[1], floorId);
        core.doAction();
    }
}

events.prototype._action_closeDoor = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    core.closeDoor(loc[0], loc[1], data.id, core.doAction);
}

events.prototype._action_useItem = function (data, x, y, prefix) {
    // 考虑到可能覆盖楼传事件的问题，这里不对fly进行检查。
    if (data.id != 'book' && core.canUseItem(data.id)) {
        core.useItem(data.id, true, core.doAction);
    }
    else {
        core.drawTip("当前无法使用" + ((core.material.items[data.id] || {}).name || "未知道具"));
        core.doAction();
    }
}

events.prototype._action_openShop = function (data, x, y, prefix) {
    if (core.isReplaying()) { // 正在播放录像，简单将visited置为true
        core.status.shops[data.id].visited = true;
        this.setEvents([]);
        core.doAction();
    }
    else
        this.openShop(data.id);
}

events.prototype._action_disableShop = function (data, x, y, prefix) {
    this.disableQuickShop(data.id);
    core.doAction();
}

events.prototype._action_battle = function (data, x, y, prefix) {
    this.battle(data.id, null, null, true, core.doAction);
}

events.prototype._action_trigger = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    var block = core.getBlock(loc[0], loc[1]);
    if (block != null && block.block.event.trigger) {
        block = block.block;
        this.setEvents([], block.x, block.y);
        var _callback = function () {
            core.lockControl();
            core.doAction();
        }
        if (block.event.trigger == 'action')
            this.setEvents(block.event.data);
        else {
            core.doSystemEvent(block.event.trigger, block, _callback);
            return;
        }
    }
    core.doAction();
}

events.prototype._action_insert = function (data, x, y, prefix) {
    // 设置参数
    if (data.args instanceof Array) {
       for (var i = 0; i < data.args.length; ++i) {
           try {
               core.setFlag('arg'+(i+1), core.calValue(data.args[i], prefix));
           } catch (e) { main.log(e); }
       }
    }
    if (data.name) { // 公共事件
        core.setFlag('arg0', data.name);
        core.insertAction(this.getCommonEvent(data.name));
    }
    else {
        var loc = this.__action_getLoc(data.loc, x, y, prefix);
        core.setFlag('arg0', loc);
        var floorId = data.floorId || core.status.floorId;
        var which = data.which || "events";
        var event = (core.floors[floorId][which]||[])[loc[0] + "," + loc[1]];
        if (event) this.insertAction(event.data || event);
    }
    core.doAction();
}

events.prototype._action_playBgm = function (data, x, y, prefix) {
    core.playBgm(data.name);
    core.doAction();
}

events.prototype._action_pauseBgm = function (data, x, y, prefix) {
    core.pauseBgm();
    core.doAction();
}

events.prototype._action_resumeBgm = function (data, x, y, prefix) {
    core.resumeBgm();
    core.doAction();
}

events.prototype._action_loadBgm = function (data, x, y, prefix) {
    core.loadBgm(data.name);
    core.doAction();
}

events.prototype._action_freeBgm = function (data, x, y, prefix) {
    core.freeBgm(data.name);
    core.doAction();
}

events.prototype._action_playSound = function (data, x, y, prefix) {
    core.playSound(data.name);
    core.doAction();
}

events.prototype._action_stopSound = function (data, x, y, prefix) {
    core.stopSound();
    core.doAction();
}

events.prototype._action_setVolume = function (data, x, y, prefix) {
    data.value = core.clamp(parseInt(data.value) / 100, 0, 1);
    core.setFlag("__volume__", data.value);
    this.__action_doAsyncFunc(data.async, this.setVolume, data.value, data.time || 0);
}

events.prototype._action_setValue = function (data, x, y, prefix) {
    this.setValue(data.name, data.value, prefix);
    core.doAction();
}

events.prototype._action_setValue2 = function (data, x, y, prefix) {
    this._action_addValue(data, x, y, prefix);
}

events.prototype._action_addValue = function (data, x, y, prefix) {
    this.addValue(data.name, data.value, prefix);
    core.doAction();
}

events.prototype._action_setFloor = function (data, x, y, prefix) {
    this.setFloorInfo(data.name, data.value, data.floorId, prefix);
    core.doAction();
}

events.prototype._action_setGlobalAttribute = function (data, x, y, prefix) {
    this.setGlobalAttribute(data.name, data.value);
    core.doAction();
}

events.prototype._action_setGlobalValue = function (data, x, y, prefix) {
    core.values[data.name] = data.value;
    core.doAction();
}

events.prototype._action_setGlobalFlag = function (data, x, y, prefix) {
    this.setGlobalFlag(data.name, data.value);
    core.doAction();
}

events.prototype._action_setHeroIcon = function (data, x, y, prefix) {
    this.setHeroIcon(data.name);
    core.doAction();
}

events.prototype._action_input = function (data, x, y, prefix) {
    this.__action_getInput(data.text, false, function (value) {
        value = Math.abs(parseInt(value) || 0);
        core.status.route.push("input:" + value);
        core.setFlag("input", value);
        core.doAction();
    });
}

events.prototype._action_input2 = function (data, x, y, prefix) {
    this.__action_getInput(data.text, true, function (value) {
        value = value || "";
        core.status.route.push("input2:" + core.encodeBase64(value));
        core.setFlag("input", value);
        core.doAction();
    });
}

events.prototype.__action_getInput = function (hint, isText, callback) {
    var value, prefix = isText ? "input2:" : "input:";
    if (core.isReplaying()) {
        var action = core.status.replay.toReplay.shift();
        try {
            if (action.indexOf(prefix) != 0)
                throw new Error("录像文件出错！当前需要一个 " + prefix + " 项，实际为 " + action);
            if (isText) value = core.decodeBase64(action.substring(7));
            else value = parseInt(action.substring(6));
            callback(value);
        }
        catch (e) {
            main.log(e);
            core.stopReplay();
            core.insertAction(["录像文件出错，请在控制台查看报错信息。", {"type": "exit"}]);
            core.doAction();
        }
    }
    else {
        core.myprompt(core.replaceText(hint), null, callback);
    }
}

events.prototype._action_if = function (data, x, y, prefix) {
    if (core.calValue(data.condition, prefix))
        core.events.insertAction(data["true"])
    else
        core.events.insertAction(data["false"])
    core.doAction();
}

events.prototype._action_switch = function (data, x, y, prefix) {
    var key = core.calValue(data.condition, prefix)
    for (var i = 0; i < data.caseList.length; i++) {
        var condition = data.caseList[i]["case"];
        if (condition == "default" || core.calValue(condition, prefix) == key) {
            this.insertAction(data.caseList[i].action);
            break;
        }
    }
    core.doAction();
}

events.prototype._action_choices = function (data, x, y, prefix) {
    if (core.isReplaying()) {
        var action = core.status.replay.toReplay.shift(), index;
        // --- 忽略可能的turn事件
        if (action == 'turn') action = core.status.replay.toReplay.shift();
        if (action.indexOf("choices:") == 0 && ((index = parseInt(action.substring(8))) >= 0) && index < data.choices.length) {
            core.status.event.selection = index;
            setTimeout(function () {
                core.status.route.push("choices:" + index);
                core.insertAction(data.choices[index].action);
                core.doAction();
            }, 750 / Math.max(1, core.status.replay.speed))
        }
        else {
            main.log("录像文件出错！当前需要一个 choices: 项，实际为 " + action);
            core.stopReplay();
            core.insertAction(["录像文件出错，请在控制台查看报错信息。", {"type": "exit"}]);
            core.doAction();
            return;
        }
    }
    core.ui.drawChoices(data.text, data.choices);
}

events.prototype._action_while = function (data, x, y, prefix) {
    if (core.calValue(data.condition, prefix)) {
        core.unshift(core.status.event.data.list,
            {"todo": core.clone(data.data), "total": core.clone(data.data), "condition": data.condition}
        );
    }
    core.doAction();
}

events.prototype._action_break = function (data, x, y, prefix) {
    core.status.event.data.list.shift();
    core.doAction();
}

events.prototype._action_continue = function (data, x, y, prefix) {
    if (core.calValue(core.status.event.data.list[0].condition, prefix)) {
        core.status.event.data.list[0].todo = core.clone(core.status.event.data.list[0].total);
    }
    else {
        core.status.event.data.list.shift();
    }
    core.doAction();
}

events.prototype._action_win = function (data, x, y, prefix) {
    this.win(data.reason, data.norank);
}

events.prototype._action_lose = function (data, x, y, prefix) {
    this.lose(data.reason);
}

events.prototype._action_function = function (data, x, y, prefix) {
    var func = data["function"];
    try {
        if (typeof func == "string" && func.indexOf("function") == 0) {
            eval('(' + func + ')()');
        }
    } catch (e) {
        main.log(e);
    }
    if (!data.async)
        core.doAction();
}

events.prototype._action_update = function (data, x, y, prefix) {
    core.updateStatusBar();
    core.doAction();
}

events.prototype._action_showStatusBar = function (data, x, y, prefix) {
    core.showStatusBar();
    core.doAction();
}

events.prototype._action_hideStatusBar = function (data, x, y, prefix) {
    core.hideStatusBar(data.toolbox);
    core.doAction();
}

events.prototype._action_updateEnemys = function (data, x, y, prefix) {
    core.enemys.updateEnemys();
    core.updateStatusBar();
    core.doAction();
}

events.prototype._action_vibrate = function (data, x, y, prefix) {
    this.__action_doAsyncFunc(data.async, this.vibrate, data.time);
}

events.prototype._action_sleep = function (data, x, y, prefix) {
    core.timeout.sleepTimeout = setTimeout(function () {
        core.timeout.sleepTimeout = null;
        core.doAction();
    }, core.isReplaying() ? Math.min(data.time, 20) : data.time);
}

events.prototype._action_wait = function (data, x, y, prefix) {
    if (core.isReplaying()) {
        var code = core.status.replay.toReplay.shift();
        if (code.indexOf("input:") == 0) {
            var value = parseInt(code.substring(6));
            core.status.route.push("input:" + value);
            this.__action_wait_getValue(value);
        }
        else {
            main.log("录像文件出错！当前需要一个 input: 项，实际为 " + code);
            core.stopReplay();
            core.insertAction(["录像文件出错，请在控制台查看报错信息。", {"type": "exit"}]);
        }
        core.doAction();
        return;
    }
}

events.prototype.__action_wait_getValue = function (value) {
    if (value >= 1000000) {
        core.setFlag('type', 1);
        var px = parseInt((value - 1000000) / 1000), py = value % 1000;
        core.setFlag('px', px);
        core.setFlag('py', py);
        core.setFlag('x', parseInt(px / 32));
        core.setFlag('y', parseInt(py / 32));
    }
    else if (value >= 10000) {
        core.setFlag('type', 1);
        var x = parseInt((value - 10000) / 100), y = value % 100;
        core.setFlag('px', 32 * x + 16);
        core.setFlag('py', 32 * y + 16);
        core.setFlag('x', x);
        core.setFlag('y', y);
    }
    else if (value > 0) {
        core.setFlag('type', 0);
        core.setFlag('keycode', value);
    }
}

events.prototype._action_waitAsync = function (data, x, y, prefix) {
    var test = window.setInterval(function () {
        if (Object.keys(core.animateFrame.asyncId).length == 0) {
            clearInterval(test);
            core.doAction();
        }
    }, 50);
}

events.prototype._action_revisit = function (data, x, y, prefix) {
    var block = core.getBlock(x, y);
    if (block != null && block.block.event.trigger == 'action')
        this.setEvents(block.block.event.data);
    core.doAction();
}

events.prototype._action_callBook = function (data, x, y, prefix) {
    if (core.isReplaying() || !core.hasItem('book')) {
        core.doAction();
    }
    else {
        var e = core.clone(core.status.event.data);
        core.ui.closePanel();
        core.openBook();
        core.status.event.interval = e;
    }
}

events.prototype._action_callSave = function (data, x, y, prefix) {
    if (core.isReplaying() || core.hasFlag("__events__")) {
        core.removeFlag("__events__");
        core.doAction();
    }
    else {
        var e = core.clone(core.status.event.data);
        core.ui.closePanel();
        core.save();
        core.status.event.interval = e;
    }
}

events.prototype._action_callLoad = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    var e = core.clone(core.status.event.data);
    core.ui.closePanel();
    core.load();
    core.status.event.interval = e;
}

events.prototype._action_exit = function (data, x, y, prefix) {
    this.setEvents([]);
    core.doAction();
}

// ------ 点击状态栏图标所进行的一些操作 ------ //

////// 判断当前能否进入某个事件 //////
events.prototype._checkStatus = function (name, fromUserAction, checkItem) {
    if (fromUserAction && core.status.event.id == name) {
        core.ui.closePanel();
        return false;
    }
    if (fromUserAction && core.status.lockControl) return false;
    if (checkItem && !core.hasItem(name)) {
        core.drawTip("你没有" + core.material.items[name].name);
        return false;
    }
    if (core.isMoving()) {
        core.drawTip("请先停止勇士行动");
        return false;
    }
    core.lockControl();
    core.status.event.id = name;
    return true;
}

////// 点击怪物手册时的打开操作 //////
events.prototype.openBook = function (fromUserAction) {
    if (core.isReplaying()) return;
    // 如果能恢复事件（从callBook事件触发）
    if (core.status.event.id == 'book' && core.events.recoverEvents(core.status.event.interval))
        return;
    // 当前是book，且从“浏览地图”打开
    if (core.status.event.id == 'book' && core.status.event.ui) {
        core.status.boxAnimateObjs = [];
        core.ui.drawMaps(core.status.event.ui);
        return;
    }
    // 从“浏览地图”页面打开
    if (core.status.event.id == 'viewMaps') {
        fromUserAction = false;
        core.status.event.ui = core.status.event.data;
    }
    if (!this._checkStatus('book', fromUserAction, true)) return;
    core.useItem('book', true);
}

////// 点击楼层传送器时的打开操作 //////
events.prototype.useFly = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('fly', fromUserAction, true)) return;
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
    core.useItem('fly', true);
    return;
}

events.prototype.flyTo = function (toId, callback) {
    return this.eventdata.flyTo(toId, callback);
}

////// 点击装备栏时的打开操作 //////
events.prototype.openEquipbox = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('equipbox', fromUserAction)) return;
    core.ui.drawEquipbox();
}

////// 点击工具栏时的打开操作 //////
events.prototype.openToolbox = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('toolbox', fromUserAction)) return;
    core.ui.drawToolbox();
}

////// 点击快捷商店按钮时的打开操作 //////
events.prototype.openQuickShop = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('selectShop', fromUserAction)) return;
    core.ui.drawQuickShop();
}

events.prototype.openKeyBoard = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('keyBoard', fromUserAction)) return;
    core.ui.drawKeyBoard();
}

////// 点击保存按钮时的打开操作 //////
events.prototype.save = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (core.status.event.id == 'save' && core.events.recoverEvents(core.status.event.interval))
        return;
    if (!this._checkStatus('save', fromUserAction)) return;
    var saveIndex = core.saves.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;
    core.ui.drawSLPanel(10*page+offset);
}

////// 点击读取按钮时的打开操作 //////
events.prototype.load = function (fromUserAction) {
    if (core.isReplaying()) return;
    var saveIndex = core.saves.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;
    // 游戏开始前读档
    if (!core.isPlaying()) {
        core.dom.startPanel.style.display = 'none';
        core.clearStatus();
        core.clearMap('all');
        core.deleteAllCanvas();
        core.status.event = {'id': 'load', 'data': null};
        core.status.lockControl = true;
        core.ui.drawSLPanel(10*page+offset);
        return;
    }
    if (core.status.event.id == 'load' && core.events.recoverEvents(core.status.event.interval))
        return;
    if (!this._checkStatus('load', fromUserAction)) return;
    core.ui.drawSLPanel(10*page+offset);
}

////// 点击设置按钮时的操作 //////
events.prototype.openSettings = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('settings', fromUserAction))
        return;
    core.ui.drawSettings();
}

// ------ 一些事件的具体执行过程 ------ //

////// 跟随 //////
events.prototype.follow = function (name) {
    core.status.hero.followers = core.status.hero.followers || [];
    if (core.material.images.images[name]
        && core.material.images.images[name].width == 128) {
        core.status.hero.followers.push({"name": name, "img": core.material.images.images[name]});
        core.gatherFollowers();
        core.clearMap('hero');
        core.drawHero();
    }
}

////// 取消跟随 //////
events.prototype.unfollow = function (name) {
    core.status.hero.followers = core.status.hero.followers || [];
    if (!name) {
        core.status.hero.followers = [];
    }
    else {
        for (var i = 0; i < core.status.hero.followers.length; i++) {
            if (core.status.hero.followers[i].name == name) {
                core.status.hero.followers.splice(i, 1);
                break;
            }
        }
    }
    core.gatherFollowers();
    core.clearMap('hero');
    core.drawHero();
}

////// 绘制或取消一张gif图片 //////
events.prototype.showGif = function (name, x, y) {
    var image = core.material.images.images[name];
    if (image) {
        var gif = new Image();
        gif.src = image.src;
        gif.style.position = 'absolute';
        gif.style.left = x * core.domStyle.scale + "px";
        gif.style.top = y * core.domStyle.scale + "px";
        gif.style.width = image.width * core.domStyle.scale + "px";
        gif.style.height = image.height * core.domStyle.scale + "px";
        core.dom.gif2.appendChild(gif);
    }
    else {
        core.dom.gif2.innerHTML = "";
    }
}

////// 数值操作 //////
events.prototype.setValue = function (name, value, prefix, add) {
    var value = core.calValue(value, prefix);
    if (add) value += core.calValue(name, prefix);
    this._setValue_setStatus(name, value);
    this._setValue_setItem(name, value);
    this._setValue_setFlag(name, value);
    this._setValue_setSwitch(name, value, prefix);
    core.updateStatusBar();
}

events.prototype._setValue_setStatus = function (name, value) {
    if (name.indexOf("status:") !== 0) return;
    core.setStatus(name.substring(7), value);
    if (core.status.hero.hp <= 0) {
        core.status.hero.hp = 0;
        core.updateStatusBar();
        core.events.lose();
    }
}

events.prototype._setValue_setItem = function (name, value) {
    if (name.indexOf("item:") !== 0) return;
    var itemId = name.substring(5), count = core.itemCount(itemId);
    if (value > count) core.getItem(itemId, value - count);
    else core.setItem(itemId, value);
}

events.prototype._setValue_setFlag = function (name, value) {
    if (name.indexOf("flag:") !== 0) return;
    core.setFlag(name.substring(5), value);
}

events.prototype._setValue_setSwitch = function (name, value, prefix) {
    if (name.indexOf("switch:") !== 0) return;
    core.setFlag((prefix || ":f@x@y") + "@" + name.substring(7), value);
}

////// 数值增减 //////
events.prototype.addValue = function (name, value, prefix) {
    this.setValue(name, value, prefix, true);
}

////// 执行一个表达式的effect操作 //////
events.prototype.doEffect = function (effect, need, times) {
    effect.split(";").forEach(function (expression) {
        var arr = expression.split("+=");
        if (arr.length != 2) return;
        var name=arr[0], value=core.calValue(arr[1], null, need, times);
        core.addValue(name, value);
    });
}

////// 设置楼层属性 //////
events.prototype.setFloorInfo = function (name, value, floorId, prefix) {
    floorId = floorId || data.floorId;
    core.status.maps[floorId][name] = core.calValue(value, prefix);
    core.updateStatusBar();
}

////// 设置全塔属性 //////
events.prototype.setGlobalAttribute = function (name, value) {
    if (typeof value == 'string') {
        if ((value.charAt(0) == '"' && value.charAt(value.length - 1) == '"')
            || (value.charAt(0) == "'" && value.charAt(value.length - 1) == "'"))
            value = value.substring(1, value.length - 1);
        // --- 检查 []
        if (value.charAt(0) == '[' && value.charAt(value.length - 1) == ']')
            value = eval(value);
    }
    core.status.globalAttribute[name] = value;
    core.updateGlobalAttribute(name);
    core.setFlag('globalAttribute', core.status.globalAttribute);
}

////// 设置全局开关 //////
events.prototype.setGlobalFlag = function (name, value) {
    var flags = core.getFlag("globalFlags", {});
    flags[name] = value;
    core.flags[name] = value;
    core.setFlag("globalFlags", flags);
    core.resize();
}

events.prototype.closeDoor = function (x, y, id, callback) {
    id = id || "";
    if (!(id.endsWith("Door") || id.endsWith("Wall"))
        || !core.material.icons.animates[id] || core.getBlock(x, y) != null) {
        if (callback) callback();
        return;
    }
    // 关门动画
    core.playSound('door.mp3');
    var door = core.material.icons.animates[id];
    var speed = id.endsWith("Door") ? 30 : 70, state = 0;
    var animate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(animate);
            delete core.animateFrame.asyncId[animate];
            core.setBlock(core.getNumberById(id), x, y);
            if (callback) callback();
            return;
        }
        core.clearMap('event', 32 * x, 32 * y, 32, 32);
        core.drawImage('event', core.material.images.animates, 32 * (4-state), 32 * door, 32, 32, 32 * x, 32 * y, 32, 32);
    }, speed / core.status.replay.speed);
    core.animateFrame.asyncId[animate] = true;
}

////// 显示图片 //////
events.prototype.showImage = function (code, image, sloc, loc, opacityVal, time, callback) {
    if (typeof image == 'string') image = core.material.images.images[image];
    if (!image) {
        if (callback) callback();
        return;
    }
    sloc = sloc || [];
    var sx = core.calValue(sloc[0]) || 0, sy = core.calValue(sloc[1]) || 0;
    var sw = core.calValue(sloc[2]), sh = core.calValue(sloc[3]);
    if (sw == null) sw = image.width;
    if (sh == null) sh = image.height;
    loc = loc || [];
    var x = core.calValue(loc[0]) || 0, y = core.calValue(loc[1]) || 0;
    var w = core.calValue(loc[2]), h = core.calValue(loc[3]);
    if (w == null) w = sw;
    if (h == null) h = sh;
    var zIndex = code + 100;
    time = time || 0;
    var name = "image" + zIndex;
    var ctx = core.createCanvas(name, x, y, w, h, zIndex);
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, w, h);
    if (time == 0) {
        core.setOpacity(name, opacityVal);
        if (callback) callback();
        return;
    }
    core.setOpacity(name, 0);
    this.moveImage(code, null, opacityVal, time, callback);
}

////// 隐藏图片 //////
events.prototype.hideImage = function (code, time, callback) {
    time = time || 0;
    var name = "image" + (code + 100);
    if (time == 0 || !core.dymCanvas[name]) {
        core.deleteCanvas(name);
        if (callback) callback();
        return;
    }
    this.moveImage(code, null, 0, time, function () {
        core.deleteCanvas(name);
        if (callback) callback();
    });
}

////// 移动图片 //////
events.prototype.moveImage = function (code, to, opacityVal, time, callback) {
    time = time || 1000;
    to = to || [];
    var name = "image" + (code + 100);
    if (!core.dymCanvas[name]) {
        if (callback) callback();
        return;
    }
    var getOrDefault = function (a, b) {
        a = core.calValue(a);
        return a != null ? a : b;
    }
    var canvas = core.dymCanvas[name].canvas;
    var fromX = parseFloat(canvas.getAttribute("_left")),
        fromY = parseFloat(canvas.getAttribute("_top")),
        toX = getOrDefault(to[0], fromX), toY = getOrDefault(to[1], fromY);

    var opacity = parseFloat(canvas.style.opacity), toOpacity = getOrDefault(opacityVal, opacity);

    this._moveImage_moving(name, {
        fromX: fromX, fromY: fromY, toX: toX, toY: toY, opacity: opacity, toOpacity: toOpacity, time: time
    }, callback)
}

events.prototype._moveImage_moving = function (name, moveInfo, callback) {
    var per_time = 10, step = 0, steps = parseInt(moveInfo.time / 10);
    var fromX = moveInfo.fromX, fromY = moveInfo.fromY, toX = moveInfo.toX, toY = moveInfo.toY,
        opacity = moveInfo.opacity, toOpacity = moveInfo.toOpacity;
    var currX = fromX, currY = fromY, currOpacity = opacity;
    var animate = setInterval(function () {
        step++;
        currOpacity = opacity + (toOpacity - opacity) * step / steps;
        currX = parseInt(fromX + (toX - fromX) * step / steps);
        currY = parseInt(fromY + (toY - fromY) * step / steps);
        core.setOpacity(name, currOpacity);
        core.relocateCanvas(name, currX, currY);
        if (step == steps) {
            core.setOpacity(name, toOpacity);
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, per_time);
    core.animateFrame.asyncId[animate] = true;
}

////// 淡入淡出音乐 //////
events.prototype.setVolume = function (value, time, callback) {
    var set = function (value) {
        core.musicStatus.volume = value;
        if (core.musicStatus.playingBgm)
            core.material.bgms[core.musicStatus.playingBgm].volume = value;
    }
    if (!time || time < 100) {
        set(value);
        if (callback) callback();
        return;
    }
    var currVolume = core.musicStatus.volume;
    var per_time = 10, step = 0, steps = parseInt(time / per_time);
    var fade = setInterval(function () {
        step++;
        set(currVolume + (value - currVolume) * step / steps);
        if (step >= steps) {
            delete core.animateFrame.asyncId[fade];
            clearInterval(fade);
            if (callback) callback();
        }
    }, per_time);
    core.animateFrame.asyncId[fade] = true;
}

////// 画面震动 //////
events.prototype.vibrate = function (time, callback) {
    if (core.isReplaying()) {
        if (callback) callback();
        return;
    }
    if (!time || time < 1000) time = 1000;
    // --- 将time调整为500的倍数（上整），不然会出错
    time = Math.ceil(time / 500) * 500;
    var shakeInfo = {duration: time * 3 / 50, speed: 5, power: 5, direction: 1, shake: 0};
    var animate = setInterval(function () {
        core.events._vibrate_update(shakeInfo);
        core.control.addGameCanvasTranslate(shakeInfo.shake, 0);
        if (shakeInfo.duration === 0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, 50 / 3);

    core.animateFrame.asyncId[animate] = true;
}

events.prototype._vibrate_update = function (shakeInfo) {
    if (shakeInfo.duration >= 1 || shakeInfo.shake != 0) {
        var delta = (shakeInfo.power * shakeInfo.speed * shakeInfo.direction) / 10.0;
        if (shakeInfo.duration <= 1 && shakeInfo.shake * (shakeInfo.shake + delta) < 0) {
            shakeInfo.shake = 0;
        } else {
            shakeInfo.shake += delta;
        }
        if (shakeInfo.shake > shakeInfo.power * 2) {
            shakeInfo.direction = -1;
        }
        if (shakeInfo.shake < -shakeInfo.power * 2) {
            shakeInfo.direction = 1;
        }
        if (shakeInfo.duration >= 1) {
            shakeInfo.duration -= 1
        }
    }
}

/////// 使用事件让勇士移动。这个函数将不会触发任何事件 //////
events.prototype.eventMoveHero = function(steps, time, callback) {
    time = time || core.values.moveSpeed || 100;
    var step = 0, moveSteps = (steps||[]).filter(function (t) {
        return ['up','down','left','right','forward','backward'].indexOf(t)>=0;
    });
    var animate=window.setInterval(function() {
        if (moveSteps.length==0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            core.drawHero();
            if (callback) callback();
        }
        else {
            if (core.events._eventMoveHero_moving(++step, moveSteps))
                step = 0;
        }
    }, time / 8 / core.status.replay.speed);

    core.animateFrame.asyncId[animate] = true;
}

events.prototype._eventMoveHero_moving = function (step, moveSteps) {
    var direction = moveSteps[0], x = core.getHeroLoc('x'), y = core.getHeroLoc('y');
    // ------ 前进/后退
    var o = direction == 'backward' ? -1 : 1;
    if (direction == 'forward' || direction == 'backward') direction = core.getHeroLoc('direction');
    core.setHeroLoc('direction', direction);
    if (step <= 4) {
        core.drawHero('leftFoot', 4 * o * step);
    }
    else if (step <= 8) {
        core.drawHero('rightFoot', 4 * o * step);
    }
    if (step == 8) {
        core.setHeroLoc('x', x + o * core.utils.scan[direction].x, true);
        core.setHeroLoc('y', y + o * core.utils.scan[direction].y, true);
        core.updateFollowers();
        moveSteps.shift();
        return true;
    }
    return false;
}

////// 勇士跳跃事件 //////
events.prototype.jumpHero = function (ex, ey, time, callback) {
    var sx = core.getHeroLoc('x'), sy = core.getHeroLoc('y');
    if (ex == null) ex = sx;
    if (ey == null) ey = sy;
    var sx=core.status.hero.loc.x, sy=core.status.hero.loc.y;
    if (!core.isset(ex)) ex=sx;
    if (!core.isset(ey)) ey=sy;
    core.maps.__playJumpSound();
    var jumpInfo = core.maps.__generateJumpInfo(sx, sy, ex, ey, time || 500);
    jumpInfo.icon = core.material.icons.hero[core.getHeroLoc('direction')];
    jumpInfo.height = core.material.icons.hero.height;

    this._jumpHero_doJump(jumpInfo, callback);
}

events.prototype._jumpHero_doJump = function (jumpInfo, callback) {
    var animate = window.setInterval(function () {
        if (jumpInfo.jump_count > 0)
            core.events._jumpHero_jumping(jumpInfo)
        else
            core.events._jumpHero_finished(animate, jumpInfo.ex, jumpInfo.ey, callback);
    }, jumpInfo.per_time);

    core.animateFrame.asyncId[animate] = true;
}

events.prototype._jumpHero_jumping = function (jumpInfo) {
    core.clearMap('hero');
    core.maps.__updateJumpInfo(jumpInfo);
    var nowx = jumpInfo.px, nowy = jumpInfo.py, height = jumpInfo.height;
    core.bigmap.offsetX = core.clamp(nowx - 32*core.__HALF_SIZE__, 0, 32*core.bigmap.width-core.__PIXELS__);
    core.bigmap.offsetY = core.clamp(nowy - 32*core.__HALF_SIZE__, 0, 32*core.bigmap.height-core.__PIXELS__);
    core.control.updateViewport();
    core.drawImage('hero', core.material.images.hero, jumpInfo.icon.stop, jumpInfo.icon.loc * height, 32, height,
        nowx - core.bigmap.offsetX, nowy + 32-height - core.bigmap.offsetY, 32, height);
}

events.prototype._jumpHero_finished = function (animate, ex, ey, callback) {
    delete core.animateFrame.asyncId[animate];
    clearInterval(animate);
    core.setHeroLoc('x', ex);
    core.setHeroLoc('y', ey);
    core.drawHero();
    if (callback) callback();
}

////// 打开一个全局商店 //////
events.prototype.openShop = function (shopId, needVisited) {
    var shop = core.status.shops[shopId];
    shop.times = shop.times || 0;
    if (shop.commonTimes) shop.times = core.getFlag('commonTimes', 0);
    if (needVisited && !shop.visited) {
        if (!core.flags.enableDisabledShop) {
            if (shop.times == 0) core.drawTip("该商店尚未开启");
            else core.drawTip("该商店已失效");
            return;
        }
        else {
            core.drawTip("该商店尚未开启，只能浏览不可使用");
        }
    }
    else shop.visited = true;
    core.ui.drawShop(shopId);
}

events.prototype._useShop = function (shop, index) {
    var reason = core.events.canUseQuickShop(shop.id);
    if (!reason && !shop.visited) reason = shop.times ? "该商店已失效" : "该商店尚未开启";
    if (reason) {
        core.drawTip(reason);
        return false;
    }
    var use = shop.use, choice = shop.choices[index];
    var times = shop.times, need = core.calValue(choice.need || shop.need, null, null, times);
    if (need > core.getStatus(use)) {
        core.drawTip("你的" + (use == 'money' ? "金币" : "经验") + "不足");
        return false;
    }
    core.status.event.selection = index;
    core.status.event.data.actions.push(index);
    core.setStatus(use, core.getStatus(use) - need);
    core.doEffect(choice.effect, need, times);
    core.updateStatusBar();
    shop.times++;
    if (shop.commonTimes) core.setFlag('commonTimes', shop.times);
    this.openShop(shop.id);
    return true;
}

events.prototype._exitShop = function () {
    if (core.status.event.data.actions.length > 0) {
        core.status.route.push("shop:" + core.status.event.data.id + ":" + core.status.event.data.actions.join(""));
    }
    core.status.event.data.actions = [];
    core.status.boxAnimateObjs = [];
    if (core.status.event.data.fromList)
        core.ui.drawQuickShop();
    else
        core.ui.closePanel();
}

////// 禁用一个全局商店 //////
events.prototype.disableQuickShop = function (shopId) {
    core.status.shops[shopId].visited = false;
}

////// 能否使用快捷商店 //////
events.prototype.canUseQuickShop = function (shopId) {
    return this.eventdata.canUseQuickShop(shopId);
}

////// 设置角色行走图 //////
events.prototype.setHeroIcon = function (name, noDraw) {
    var img = core.material.images.images[name];
    if (!img || img.width != 128) return;
    core.setFlag("heroIcon", name);
    core.material.images.hero.onload = function () {
        core.material.icons.hero.height = img.height / 4;
        core.control.updateHeroIcon(name);
        if (!noDraw) core.drawHero();
    }
    core.material.images.hero.src = img.src;
}

////// 检查升级事件 //////
events.prototype.checkLvUp = function () {
    var actions = [];
    while (true) {
        var next = this._checkLvUp_check();
        if (next == null) break;
        actions = actions.concat(next);
    }
    if (actions.length > 0) core.insertAction(actions);
}

events.prototype._checkLvUp_check = function () {
    if (!core.flags.enableLevelUp || !core.firstData.levelUp
        || core.status.hero.lv >= core.firstData.levelUp.length) return null;
    // 计算下一个所需要的数值
    var next = (core.firstData.levelUp[core.status.hero.lv] || {});
    var need = core.calValue(next.need);
    if (need == null) return null;
    if (core.status.hero.experience >= need) {
        // 升级
        core.status.hero.lv++;
        if (next.clear) core.status.hero.experience -= need;
        return next.action || [];
    }
    return null;
}

////// 尝试使用道具 //////
events.prototype.tryUseItem = function (itemId) {
    core.ui.closePanel();

    if (itemId == 'book') return core.openBook(false);
    if (itemId == 'fly') return core.useFly(false);
    if (itemId == 'centerFly') return core.ui.drawCenterFly();

    if (core.canUseItem(itemId)) core.useItem(itemId);
    else core.drawTip("当前无法使用" + core.material.items[itemId].name);
}

////// 使用炸弹/圣锤后的事件 //////
events.prototype.afterUseBomb = function () {
    return this.eventdata.afterUseBomb();
}

////// 上传当前数据 //////
events.prototype.uploadCurrent = function (username) {
    var formData = new FormData();

    formData.append('type', 'score');
    formData.append('name', core.firstData.name);
    formData.append('version', core.firstData.version);
    formData.append('platform', core.platform.isPC ? "PC" : core.platform.isAndroid ? "Android" : core.platform.isIOS ? "iOS" : "");
    formData.append('hard', core.encodeBase64(core.status.hard));
    formData.append('username', core.encodeBase64(username || "current"));
    formData.append('lv', core.status.hero.lv);
    formData.append('hp', Math.min(core.status.hero.hp, Math.pow(2, 63)));
    formData.append('atk', core.status.hero.atk);
    formData.append('def', core.status.hero.def);
    formData.append('mdef', core.status.hero.mdef);
    formData.append('money', core.status.hero.money);
    formData.append('experience', core.status.hero.experience);
    formData.append('steps', core.status.hero.steps);
    formData.append('seed', core.getFlag('__seed__'));
    formData.append('totalTime', Math.floor(core.status.hero.statistics.totalTime / 1000));
    formData.append('route', core.encodeRoute(core.status.route));
    formData.append('deler', 'current');
    formData.append('base64', 1);

    core.http("POST", "/games/upload.php", formData);
}
