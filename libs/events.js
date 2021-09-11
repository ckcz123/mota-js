/// <reference path="../runtime.d.ts" />

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
    // console.log('开始游戏');
    core.resetGame(core.firstData.hero, hard, null, core.cloneArray(core.initStatus.maps));
    core.setHeroLoc('x', -1);
    core.setHeroLoc('y', -1);

    if (seed != null && seed > 0) {
        core.setFlag('__seed__', seed);
        core.setFlag('__rand__', seed);
    }
    else core.utils.__init_seed();
    core.clearStatusBar();

    var todo = [];
    if (core.flags.startUsingCanvas) {
        core.hideStatusBar();
        core.dom.musicBtn.style.display = 'block';
        core.dom.enlargeBtn.style.display = 'block';
        core.push(todo, core.firstData.startCanvas);
    }
    core.push(todo, {"type": "function", "function": "function() { core.events._startGame_setHard(); }"})
    core.push(todo, core.firstData.startText);
    this.insertAction(todo, null, null, function () {
        core.events._startGame_afterStart(callback);
    });

    if (route != null) core.startReplay(route);
}

events.prototype._startGame_setHard = function () {
    // 根据难度设置flag:hard
    // 这一段应当在startCanvas之后，startText之前做
    var hardValue = 0;
    var hardColor = 'red';
    main.levelChoose.forEach(function (one) {
        if (one.name == core.status.hard) {
            hardValue = one.hard;
            hardColor = core.arrayToRGBA(one.color || [255,0,0,1]);
            core.insertAction(one.action);
        }
    });
    core.setFlag('hard', hardValue || 0);
    core.setFlag('__hardColor__', hardColor);
}

events.prototype._startGame_afterStart = function (callback) {
    core.ui.closePanel();
    core.changeFloor(core.firstData.floorId, null, core.firstData.hero.loc, null, function () {
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
    formData.append('platform', core.platform.string);
    formData.append('hard', core.encodeBase64(core.status.hard));
    formData.append('hardCode', core.getFlag('hard', 0));
    formData.append('base64', 1);

    core.utils.http("POST", "/games/upload.php", formData);
}

////// 游戏获胜事件 //////
events.prototype.win = function (reason, norank, noexit) {
    if (!noexit) core.status.gameOver = true;
    return this.eventdata.win(reason, norank, noexit);
}

////// 游戏失败事件 //////
events.prototype.lose = function (reason) {
    if (core.isReplaying()) return core.control._replay_error(reason, function () { core.lose(reason); });
    core.status.gameOver = true;
    return this.eventdata.lose(reason);
}

////// 游戏结束 //////
events.prototype.gameOver = function (ending, fromReplay, norank) {
    if (!core.status.extraEvent) {
        core.clearMap('all');
        core.deleteAllCanvas();
        core.dom.gif2.innerHTML = "";
        core.setWeather();
    }
    core.ui.closePanel();

    if (main.isCompetition && ending != null) {
        if (ending == "") ending = "恭喜通关";
        ending += "[比赛]";
    }

    var reason = null;
    if (fromReplay) reason = "录像回放完毕！";
    else if (core.hasFlag("debug")) reason = "\t[系统提示]调试模式下无法上传成绩";

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
    formData.append('platform', core.platform.string);
    formData.append('hard', core.encodeBase64(core.status.hard));
    formData.append('username', core.encodeBase64(username || ""));
    formData.append('ending', core.encodeBase64(ending));
    formData.append('lv', core.status.hero.lv);
    formData.append('hp', Math.min(hp, Math.pow(2, 63)));
    formData.append('atk', core.status.hero.atk);
    formData.append('def', core.status.hero.def);
    formData.append('mdef', core.status.hero.mdef);
    formData.append('money', core.status.hero.money);
    formData.append('experience', core.status.hero.exp);
    formData.append('steps', core.status.hero.steps);
    formData.append('norank', norank ? 1 : 0);
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
        core.download(core.firstData.name + "_" + core.formatDate2(new Date()) + ".h5route", 
            LZString.compressToBase64(JSON.stringify(obj)));
        core.events._gameOver_askRate(ending);
    }, function () {
        core.events._gameOver_askRate(ending);
    });
}

events.prototype._gameOver_askRate = function (ending) {
    core.ui.closePanel();

    // 继续接下来的事件
    if (core.status.extraEvent) {
        core.status.event = core.status.extraEvent;
        delete core.status.extraEvent;
        core.lockControl();
        core.doAction();
        return;
    }

    if (ending == null) {
        if (!core.hasSave(0)) {
            core.ui.closePanel();
            core.restart();
            return;
        }

        core.status.event.selection = 0;
        core.ui.drawConfirmBox("你想读取自动存档么？", function () {
            core.ui.closePanel();
            core.doSL("autoSave", "load");
        }, function () {
            core.ui.closePanel();
            core.restart();
        });
        return;
    }

    core.ui.drawConfirmBox("恭喜通关！你想进行评分吗？", function () {
        if (core.platform.isPC) {
            window.open("/score.php?name=" + core.firstData.name, "_blank");
            core.restart();
        }
        else {
            window.location.href = "/score.php?name=" + core.firstData.name;
        }
    }, function () {
        core.restart();
    });
}

////// 重新开始游戏；此函数将回到标题页面 //////
events.prototype.restart = function() {
    core.showStartAnimate();
    core.playBgm(main.startBgm);
}

////// 询问是否需要重新开始 //////
events.prototype.confirmRestart = function () {
    core.playSound('打开界面');
    core.status.event.selection = 1;
    core.ui.drawConfirmBox("你确定要返回标题页面吗？", function () {
        core.playSound('确定');
        core.ui.closePanel();
        core.restart();
    }, function () {
        core.playSound('取消');
        core.ui.closePanel();
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
    core.clearRouteFolding();
    if (this.systemEvents[type]) {
        try {
            return core.doFunc(this.systemEvents[type], this, data, callback);
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
events.prototype.trigger = function (x, y, callback) {
    var _executeCallback = function () {
        // 因为trigger之后还有可能触发其他同步脚本（比如阻激夹域检测）
        // 所以这里强制callback被异步触发
        if (callback) {
            setTimeout(callback, 1); // +1是为了录像检测系统 
        }
        return;
    }
    if (core.status.gameOver) return _executeCallback();
    if (core.status.event.id == 'action') {
        core.insertAction({"type": "function", "function": "function () { core.events._trigger_inAction("+x+","+y+"); }", "async": true},
            null, null, null, true);
        return _executeCallback();
    }
    if (core.status.event.id) return _executeCallback();

    var block = core.getBlock(x, y);
    if (block == null) return _executeCallback();

    // 执行该点的脚本
    if (block.event.script) {
        core.clearRouteFolding();
        try {
            eval(block.event.script);
        } catch (e) { main.log(e); }
    }

    // 碰触事件
    if (block.event.event) {
        core.clearRouteFolding();
        core.insertAction(block.event.event, block.x, block.y);
        // 不再执行该点的系统事件
        return _executeCallback();
    }

    if (block.event.trigger && block.event.trigger != 'null') {
        var noPass = block.event.noPass, trigger = block.event.trigger;
        if (noPass) core.clearAutomaticRouteNode(x, y);

        // 转换楼层能否穿透
        if (trigger == 'changeFloor' && !noPass && this._trigger_ignoreChangeFloor(block))
            return _executeCallback();
        core.status.automaticRoute.moveDirectly = false;
        this.doSystemEvent(trigger, block);
    }
    return _executeCallback();
}

events.prototype._trigger_inAction = function (x, y) {
    if (core.status.gameOver || core.status.event.id != 'action') return;
    
    var block = core.getBlock(x, y);
    if (block == null) return core.doAction();

    // 执行该点的脚本
    try {
        eval(block.event.script);
    } catch (e) { main.log(e); }

    // 碰触事件
    if (block.event.event) {
        core.clearRouteFolding();
        core.insertAction(block.event.event, block.x, block.y);
        // 不再执行该点的系统事件
        return core.doAction();
    }

    if (block.event.trigger && block.event.trigger != 'null') {
        this.setEvents(null, x, y);
        if (block.event.trigger == 'action') {
            this.insertAction(block.event.data);
        }
        else {
            this.doSystemEvent(block.event.trigger, block, core.doAction);
            return;
        }
    }
    return core.doAction();
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
    // 检查是否需要改变朝向
    /* if (data.x == core.nextX() && data.y == core.nextY()) {
        var dir = core.turnDirection(":back");
        var id = data.event.id, toId = (data.event.faceIds || {})[dir];
        if (toId && id != toId) {
            var number = core.getNumberById(toId);
            if (number > 0)
                core.setBlock(number, data.x, data.y);
        }
    } */

    // 检查战前事件
    var beforeBattle = [];
    core.push(beforeBattle, core.floors[core.status.floorId].beforeBattle[data.x + "," + data.y]);
    core.push(beforeBattle, (core.material.enemys[data.event.id]||{}).beforeBattle);
    if (beforeBattle.length > 0) {
        core.push(beforeBattle, [{"type": "battle", "x": data.x, "y": data.y}]);
        core.clearContinueAutomaticRoute();

        // 自动存档
        var inAction = core.status.event.id == 'action';
        if (inAction) {
            core.insertAction(beforeBattle, data.x, data.y);
            core.doAction();
        } else {
            core.autosave(true);
            core.insertAction(beforeBattle, data.x, data.y, callback);
        }
    } else {
        this.battle(data.event.id, data.x, data.y, false, callback);
    }
}

////// 战斗 //////
events.prototype.battle = function (id, x, y, force, callback) {
    core.saveAndStopAutomaticRoute();
    id = id || core.getBlockId(x, y);
    if (!id) return core.clearContinueAutomaticRoute(callback);
    // 非强制战斗
    if (!core.enemys.canBattle(id, x, y) && !force && !core.status.event.id) {
        core.stopSound();
        core.playSound('操作失败');
        core.drawTip("你打不过此" + core.enemys.getEnemyValue(id, 'name', x, y, core.status.floorId), id);
        return core.clearContinueAutomaticRoute(callback);
    }
    // 自动存档
    if (!core.status.event.id) core.autosave(true);
    // 战前事件
    if (!this.beforeBattle(id, x, y))
        return core.clearContinueAutomaticRoute(callback);
    // 战后事件
    this.afterBattle(id, x, y);
    if (callback) callback();
}

////// 战斗前触发的事件 //////
events.prototype.beforeBattle = function (enemyId, x, y) {
    return this.eventdata.beforeBattle(enemyId, x, y)
}

////// 战斗结束后触发的事件 //////
events.prototype.afterBattle = function (enemyId, x, y) {
    return this.eventdata.afterBattle(enemyId, x, y);
}

events.prototype._sys_openDoor = function (data, callback) {
    this.openDoor(data.x, data.y, true, function () {
        core.replay();
        if (callback) callback();
    });
}

////// 开门 //////
events.prototype.openDoor = function (x, y, needKey, callback) {
    var block = core.getBlock(x, y);
    core.saveAndStopAutomaticRoute();
    if (!this._openDoor_check(block, x, y, needKey)) {
        var locked = core.status.lockControl;
        core.waitHeroToStop(function () {
            if (!locked) core.unlockControl();
            if (callback) callback();
        });
        return;
    }
    if (core.status.replay.speed == 24) {
        core.status.replay.animate = true;
        core.removeBlock(x, y);
        setTimeout(function () {
            core.status.replay.animate = false;
            core.events.afterOpenDoor(block.event.id, x, y);
            if (callback) callback();
        }, 1); // +1是为了录像检测系统
    } else {
        this._openDoor_animate(block, x, y, callback);
    }
}

events.prototype._openDoor_check = function (block, x, y, needKey) {
    var clearAndReturn = function () {
        core.clearContinueAutomaticRoute();
        return false;
    }

    if (block == null || block.event == null) return clearAndReturn();
    var id = block.event.id;

    // 是否存在门或暗墙
    if (core.material.icons.animates[id] == null && core.material.icons.npc48[id] == null) {
        return clearAndReturn();
    }

    if (id == 'steelDoor' && core.flags.steelDoorWithoutKey)
        needKey = false;
    var doorInfo = block.event.doorInfo;
    if (doorInfo == null) return clearAndReturn();
    // Check all keys
    var keyInfo = doorInfo.keys || {};
    if (needKey) {
        for (var keyName in keyInfo) {
            var keyValue = keyInfo[keyName];
            if (keyName.endsWith(':o')) keyName = keyName.substring(0, keyName.length - 2);            

            // --- 如果是一个不存在的道具，则直接认为无法开启
            if (!core.material.items[keyName]) {
                core.stopSound();
                core.playSound('操作失败');
                core.drawTip("无法开启此门", id);
                return clearAndReturn();
            }
            if (core.itemCount(keyName) < keyValue) {
                core.stopSound();
                core.playSound('操作失败');
                core.drawTip("你的" + ((core.material.items[keyName] || {}).name || "钥匙") + "不足！", keyName); // , null, true);
                return false;
            }
        }
        if (!core.status.event.id) core.autosave(true);
        for (var keyName in keyInfo) {  
            if (!keyName.endsWith(':o')) core.removeItem(keyName, keyInfo[keyName]);
        }
    }
    core.playSound(doorInfo.openSound);
    return true;
}

events.prototype._openDoor_animate = function (block, x, y, callback) {
    var blockInfo = core.getBlockInfo(block);
    blockInfo.opacity = block.opacity;
    blockInfo.filter = block.filter;

    var speed = (block.event.doorInfo.time || 160) / 4;

    var locked = core.status.lockControl;
    core.lockControl();
    core.status.replay.animate = true;
    core.removeBlock(x, y);

    blockInfo.posX = 0;
    core.maps._drawBlockInfo(blockInfo, x, y);

    var cb = function () {
        core.maps._removeBlockFromMap(core.status.floorId, block);
        if (!locked) core.unlockControl();
        core.status.replay.animate = false;
        core.events.afterOpenDoor(block.event.id, x, y);
        if (callback) callback();
    }

    var animate = window.setInterval(function() {
        blockInfo.posX++;
        if (blockInfo.posX == 4) {
            clearInterval(animate);
            delete core.animateFrame.asyncId[animate];
            cb();
            return;
        }
        core.maps._drawBlockInfo(blockInfo, x, y);    
    }, core.status.replay.speed == 24 ? 1 : speed / Math.max(core.status.replay.speed, 1));
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = cb;
}

////// 开一个门后触发的事件 //////
events.prototype.afterOpenDoor = function (doorId, x, y) {
    return this.eventdata.afterOpenDoor(doorId, x, y);
}

events.prototype._sys_getItem = function (data, callback) {
    this.getItem(data.event.id, 1, data.x, data.y, false, callback);
}

////// 获得某个物品 //////
events.prototype.getItem = function (id, num, x, y, isGentleClick, callback) {
    if (num == null) num = 1;
    var itemCls = core.material.items[id].cls;
    core.removeBlock(x, y);
    core.items.getItemEffect(id, num);
    var text = '获得 ' + core.material.items[id].name;
    if (num > 1) text += "x" + num;
    if (itemCls === 'items' && num == 1) text += core.items.getItemEffectTip(id);
    core.drawTip(text, id);

    // --- 首次获得道具的提示
    if (!core.hasFlag("__itemHint__")) core.setFlag("__itemHint__", []);
    var itemHint = core.getFlag("__itemHint__");
    if (core.flags.itemFirstText && itemHint.indexOf(id) < 0 && itemCls != 'items') {
        var hint = core.material.items[id].text || "该道具暂无描述";
        try {
            hint = core.replaceText(hint);
        } catch (e) {}
        if (!core.status.event.id || core.status.event.id=='action') {
            core.insertAction("\t["+core.material.items[id].name+","+id+"]" + hint + "\n"
                + (id.endsWith('Key') ? "（钥匙类道具，遇到对应的门时自动打开）"
                    : itemCls == 'tools' ? "（消耗类道具，请按T在道具栏使用）"
                    : itemCls == 'constants' ? "（永久类道具，请按T在道具栏使用）"
                    : itemCls == 'equips' ? "（装备类道具，请按Q在装备栏进行装备）" : ""));
        }
        itemHint.push(id);
    }

    this.afterGetItem(id, x, y, isGentleClick);
    if (callback) callback();
}

events.prototype.afterGetItem = function (id, x, y, isGentleClick) {
    this.eventdata.afterGetItem(id, x, y, isGentleClick);
}

////// 获得面前的物品（轻按） //////
events.prototype.getNextItem = function (noRoute) {
    if (core.isMoving() || !core.flags.enableGentleClick) return false;
    if (this._canGetNextItem()) return this._getNextItem(null, noRoute);

    var directions = ["up", "down", "left", "right"].filter(function (dir) {
        return core.events._canGetNextItem(dir);
    });
    return directions.length > 0 ? this._getNextItem(directions[0], noRoute) : false;
}

events.prototype._canGetNextItem = function (direction) {
    direction = direction || core.getHeroLoc('direction');
    if (!core.canMoveHero(null, null, direction)) return;
    var nx = core.getHeroLoc('x') + core.utils.scan[direction].x;
    var ny = core.getHeroLoc('y') + core.utils.scan[direction].y;
    var block = core.getBlock(nx, ny);
    return block != null && !block.event.script && !block.event.event && block.event.trigger == 'getItem';
}

events.prototype._getNextItem = function (direction, noRoute) {
    direction = direction || core.getHeroLoc('direction');
    var nx = core.getHeroLoc('x') + core.utils.scan[direction].x;
    var ny = core.getHeroLoc('y') + core.utils.scan[direction].y;
    if (!noRoute) core.status.route.push("getNext");
    this.getItem(core.getBlockId(nx, ny), 1, nx, ny, true);
    return true;
}

events.prototype._sys_changeFloor = function (data, callback) {
    data = data.event.data;
    var heroLoc = {};
    if (data.loc) heroLoc = {'x': data.loc[0], 'y': data.loc[1]};
    if (data.direction) heroLoc.direction = data.direction;
    if (core.status.event.id != 'action') core.status.event.id = null;
    core.changeFloor(data.floorId, data.stair, heroLoc, data.time, function () {
        core.replay();
        if (callback) callback();
    });
}

////// 楼层切换 //////
events.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback) {
    var info = this._changeFloor_getInfo(floorId, stair, heroLoc, time);
    if (info == null) {
        if (callback) callback();
        return;
    }
    floorId = info.floorId;
    info.locked = core.status.lockControl;

    core.dom.floorNameLabel.innerText = core.status.maps[floorId].title;
    core.lockControl();
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    core.status.replay.animate = true;
    clearInterval(core.interval.onDownInterval);
    core.interval.onDownInterval = 'tmp';

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
    } else if (floorId == ':now') {
        floorId = core.status.floorId;
    }
    if (!core.status.maps[floorId]) {
        main.log("不存在的楼层：" + floorId);
        return null;
    }

    if (main.mode != 'play' || core.isReplaying()) time = 0;
    if (time == null) time = core.values.floorChangeTime;
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
        // --- 对称
        if (stair == ':now')
            heroLoc = core.clone(core.status.hero.loc);
        else if (stair == ':symmetry') {
            heroLoc.x = core.bigmap.width - 1 - core.getHeroLoc('x');
            heroLoc.y = core.bigmap.height - 1 - core.getHeroLoc('y');
        }
        else if (stair == ':symmetry_x')
            heroLoc.x = core.bigmap.width - 1 - core.getHeroLoc('x');
        else if (stair == ':symmetry_y')
            heroLoc.y = core.bigmap.height - 1 - core.getHeroLoc('y');
        // 检查该层地图的 upFloor & downFloor & flyPoint
        else if (core.status.maps[floorId][stair]) {
            heroLoc.x = core.status.maps[floorId][stair][0];
            heroLoc.y = core.status.maps[floorId][stair][1];
        }
        else {
            core.extractBlocks(floorId);
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
    this._changeFloor_playSound();
    // 需要 setTimeout 执行，不然会出错
    window.setTimeout(function () {
        if (info.time == 0)
            core.events._changeFloor_changing(info, callback);
        else
            core.showWithAnimate(core.dom.floorMsgGroup, info.time / 2, function () {
                core.events._changeFloor_changing(info, callback);
            });
    }, 25)
}

events.prototype._changeFloor_playSound = function () {
	// 播放换层音效
	if (core.hasFlag('__fromLoad__')) // 是否是读档造成的切换
		core.playSound('读档');
	else if (core.hasFlag('__isFlying__')) // 是否是楼传造成的切换
		core.playSound('飞行器');
	else if (core.status.floorId)
	    core.playSound('上下楼');
}

events.prototype._changeFloor_changing = function (info, callback) {
    this.changingFloor(info.floorId, info.heroLoc);
    // 回归视角
    var __lockViewport__ = flags.__lockViewport__;
    core.setFlag('__lockViewport__', null);
    core.drawHero();
    core.setFlag('__lockViewport__', __lockViewport__);    

    if (info.time == 0)
        this._changeFloor_afterChange(info, callback);
    else
        core.hideWithAnimate(core.dom.floorMsgGroup, info.time / 4, function () {
            core.events._changeFloor_afterChange(info, callback);
        });
}

events.prototype._changeFloor_afterChange = function (info, callback) {
    if (!info.locked) core.unlockControl();
    core.status.replay.animate = false;
    core.events.afterChangeFloor(info.floorId);

    if (callback) callback();
}

events.prototype.changingFloor = function (floorId, heroLoc) {
    this.eventdata.changingFloor(floorId, heroLoc);
}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId) {
    if (main.mode != 'play') return;
    return this.eventdata.afterChangeFloor(floorId);
}

////// 是否到达过某个楼层 //////
events.prototype.hasVisitedFloor = function (floorId) {
    if (!core.hasFlag("__visited__")) core.setFlag("__visited__", {});
    return core.getFlag("__visited__")[floorId] || false;
}

////// 到达某楼层 //////
events.prototype.visitFloor = function (floorId) {
    if (!core.hasFlag("__visited__")) core.setFlag("__visited__", {});
    core.getFlag("__visited__")[floorId] = true;
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
    if (!core.canMoveHero()) return;
    var canGoDeadZone = core.flags.canGoDeadZone;
    core.flags.canGoDeadZone = true;
    if (!core.canMoveHero(data.x, data.y, direction)) {
        core.flags.canGoDeadZone = canGoDeadZone;
        return;
    }
    core.flags.canGoDeadZone = canGoDeadZone;

    var nextId = core.getBlockId(nx, ny);
    if (nextId != null && nextId != 'flower') return;

    core.setBlock(nextId == null ? 'box' : 'boxed', nx, ny);

    if (data.event.id == 'box')
        core.removeBlock(data.x, data.y);
    else
        core.setBlock('flower', data.x, data.y);
    // 勇士前进一格，然后触发推箱子后事件
    core.insertAction([
        {"type": "moveAction"},
        {"type": "function", "function": "function() { core.afterPushBox(); }"}
    ]);
}

////// 推箱子后的事件 //////
events.prototype.afterPushBox = function () {
    return this.eventdata.afterPushBox();
}

events.prototype._sys_ski = function (data, callback) {
    core.insertAction(["V2.6后，请将滑冰放在背景层！"], data.x, data.y);
    if (callback) callback();
}

/// 当前是否在冰上
events.prototype.onSki = function (number) {
    if (number == null) number = core.getBgNumber();
    var block = core.getBlockByNumber(number);
    return block && block.event && block.event.trigger == 'ski';
}

events.prototype._sys_action = function (data, callback) {
    var ev = core.clone(data.event.data), ex = data.x, ey = data.y;
    // 检查是否需要改变朝向
    if (ex == core.nextX() && ey == core.nextY()) {
        var dir = core.turnDirection(":back");
        var id = data.event.id, toId = (data.event.faceIds || {})[dir];
        if (toId && id != toId) {
            var number = core.getNumberById(toId);
            if (number > 0)
                core.setBlock(number, ex, ey);
        }
    }
    this.insertAction(ev, ex, ey, callback);
}

events.prototype._sys_custom = function (data, callback) {
    core.insertAction(["请使用\r[yellow]core.registerSystemEvent('custom', func)\r来处理自己添加的系统触发器！"],
        data.x, data.y, callback);
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

events.prototype.setEvents = function (list, x, y, callback) {
    var data = core.status.event.data || {};
    if (list) {
        var l = core.clone(list);
        if (!(l instanceof Array)) l = [l];
        l.push({"type": "_label"});
        data.list = [{todo: l, total: core.clone(l), condition: "false"}];
        // 结束所有正在执行的自动事件
        if (list.length == 0) {
            core.status.autoEvents.forEach(function (autoEvent) {
                core.autoEventExecuting(autoEvent.symbol, false);
            });
        }
    }
    if (x != null) data.x = x;
    if (y != null) data.y = y;
    if (callback) data.callback = callback;
    if (!data.appendingEvents) data.appendingEvents = [];
    if (!data.locStack) data.locStack = [];
    core.status.event.id = 'action';
    core.status.event.data = data;
}

////// 开始执行一系列自定义事件 //////
events.prototype.startEvents = function (list, x, y, callback) {
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

////// 执行当前自定义事件列表中的下一个事件 //////
events.prototype.doAction = function () {
    // 清空boxAnimate和UI层
    clearInterval(core.status.event.interval);
    clearTimeout(core.status.event.interval);
    clearInterval(core.status.event.animateUI);
    core.status.event.interval = null;
    delete core.status.event.aniamteUI;
    if (core.status.gameOver || core.status.replay.failed) return;
    core.clearUI();
    // 判定是否执行完毕
    if (this._doAction_finishEvents()) return;
    var floorId = core.status.event.data.floorId || core.status.floorId;
    // 当前点坐标和前缀
    var x = core.status.event.data.x, y = core.status.event.data.y;
    var prefix = [floorId || ":f", x != null ? x : "x", y != null ? y : "y"].join("@");
    var current = core.status.event.data.list[0];
    if (this._popEvents(current, prefix)) return;
    // 当前要执行的事件
    var data = current.todo.shift();
    core.status.event.data.current = data;
    if (typeof data == "string")
        data = {"type": "text", "text": data};
    // 该事件块已经被禁用
    if (data._disabled) return core.doAction();
    data.floorId = data.floorId || floorId;
    core.status.event.data.type = data.type;
    this.doEvent(data, x, y, prefix);
    return;
}

events.prototype._doAction_finishEvents = function () {
    // 事件处理完毕
    if (core.status.event.id != 'action') return true; // 防止控制台手动调用 core.events._action_xxx() 报错
    if (core.status.event.data.list.length == 0) {
        // 检测并执行延迟自动事件
        if (core.status.event.data.appendingEvents.length > 0) {
            this.setEvents(core.status.event.data.appendingEvents.shift());
            return false;
        }
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

////// 往当前事件列表之前或之后添加一个或多个事件 //////
events.prototype.insertAction = function (action, x, y, callback, addToLast) {
    if (core.hasFlag("__statistics__")) return;
    if (core.status.gameOver) return;
    if (!action) return;
    core.clearRouteFolding();

    action = this.precompile(action);

    if (core.status.event.id != 'action') {
        this.startEvents(action, x, y, callback);
    }
    else {
        if (addToLast) {
            var list = core.status.event.data.list[0].todo;
            var index = 0;
            for (var index = 0; index < list.length; index++) {
                if (list[index].type == '_label') {
                    list.splice(index, 0, action);
                    break;
                }
            } 
        }
        else core.unshift(core.status.event.data.list[0].todo, action);
        this.setEvents(null, x, y, callback);
    }
}

////// 往当前事件列表之前或之后添加一个公共事件 //////
events.prototype.insertCommonEvent = function (name, args, x, y, callback, addToLast) {
    var commonEvent = this.getCommonEvent(name);
    if (!commonEvent) {
        if (callback) callback();
        return;
    }

    // 设置参数
    core.setFlag('arg0', name);
    if (args instanceof Array) {
        for (var i = 0; i < args.length; ++i) {
            try {
                if (args[i] != null)
                    core.setFlag('arg'+(i+1), args[i]);
            } catch (e) { main.log(e); }
        }
    }

    this.insertAction({"type": "dowhile", "condition": "false", "data": commonEvent}, x, y, callback, addToLast);
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

////// 检测自动事件 //////
events.prototype.checkAutoEvents = function () {
    // 只有在无操作或事件流中才能执行自动事件！
    if (!core.isPlaying() || (core.status.lockControl && core.status.event.id != 'action')) return;
    var todo = [], delay = [];
    core.status.autoEvents.forEach(function (autoEvent) {
        var symbol = autoEvent.symbol, x = autoEvent.x, y = autoEvent.y, floorId = autoEvent.floorId;
        // 不在当前楼层 or 已经执行过 or 已被分区 or 正在执行中
        if (autoEvent.currentFloor && floorId != core.status.floorId) return;
        if (!autoEvent.multiExecute && core.autoEventExecuted(symbol)) return;
        if ((flags.__removed__||[]).indexOf(floorId) >= 0) return;
        if (core.autoEventExecuting(symbol)) return;
        var prefix = floorId + "@" + x + "@" + y;
        try {
            if (!core.calValue(autoEvent.condition, prefix)) return;
        } catch (e) {
            return;
        }

        core.autoEventExecuting(symbol, true);
        core.autoEventExecuted(symbol, true);
        
        var event;
        if (x == null && y == null) {
            event = [
                // 用do-while(0)包一层防止break影响事件流
                {"type": "dowhile", "condition": "false", "data": autoEvent.data},
                {"type": "function", "function":
                        "function() { core.autoEventExecuting('" + symbol + "', false); }"}
            ];
        } else {
            event = [
                {"type": "function", "function":
                        "function() { core.pushEventLoc(" + x + ", " + y + ", '" + floorId + "' ); }"},
                // 用do-while(0)包一层防止break影响事件流
                {"type": "dowhile", "condition": "false", "data": autoEvent.data},
                {"type": "function", "function":
                        "function() { core.popEventLoc(); core.autoEventExecuting('" + symbol + "', false); }"}
            ];
        }

        if (autoEvent.delayExecute)
            delay.push(event);
        else
            core.push(todo, event);
    });

    if (todo.length == 0 && delay.length == 0) return;

    if (core.status.event.id == 'action' || todo.length > 0) {
        core.insertAction(todo);
        core.push(core.status.event.data.appendingEvents, delay);
    } else {
        core.insertAction(delay[0]);
        if (delay.length > 0) {
            core.insertAction(delay.slice(1));
        }
    }

}

events.prototype.autoEventExecuting = function (symbol, value) {
    var aei = core.getFlag('__aei__', []);
    if (value == null) return aei.indexOf(symbol) >= 0;
    else {
        aei = aei.filter(function (one) { return one != symbol; });
        if (value) aei.push(symbol);
        core.setFlag('__aei__', aei);
    }
}

events.prototype.autoEventExecuted = function (symbol, value) {
    var aed = core.getFlag('__aed__', []);
    if (value == null) return aed.indexOf(symbol) >= 0;
    else {
        aed = aed.filter(function (one) { return one != symbol; });
        if (value) aed.push(symbol);
        core.setFlag('__aed__', aed);
    }
}

events.prototype.pushEventLoc = function (x, y, floorId) {
    if (core.status.event.id != 'action') return;
    core.status.event.data.locStack.push({
        x: core.status.event.data.x,
        y: core.status.event.data.y,
        floorId: core.status.event.data.floorId
    });
    core.status.event.data.x = x;
    core.status.event.data.y = y;
    core.status.event.data.floorId = floorId;
}

events.prototype.popEventLoc = function () {
    if (core.status.event.id != 'action') return;
    var loc = core.status.event.data.locStack.shift();
    if (loc) {
        core.status.event.data.x = loc.x;
        core.status.event.data.y = loc.y;
        core.status.event.data.floorId = loc.floorId;
    }
}

events.prototype.precompile = function (data) {
    var array = this.__precompile_getArray();
    if (typeof data == 'string') {
        return this.__precompile_text(data);
    }
    if (data instanceof Array) {
        for (var i = 0; i < data.length; ++i) {
            data[i] = this.precompile(data[i]);
        }
        return data;
    }
    if (data && data.type) {
        if (this["_precompile_" + data.type]) {
            data = this["_precompile_" + data.type](data);
        }
        if (array.texts.indexOf(data.type) >= 0) {
            data.text = this.__precompile_text(data.text);
        }
        if (array.locs.indexOf(data.type) >= 0) {
            data.loc = this.__precompile_array(data.loc);
        }
        if (array.values.indexOf(data.type) >= 0) {
            data.value = core.replaceValue(data.value);
        }
        if (array.uievents.indexOf(data.type) >= 0) {
            data.x = core.replaceValue(data.x);
            data.y = core.replaceValue(data.y);
            data.width = core.replaceValue(data.width);
            data.height = core.replaceValue(data.height);
        }
        if (data.type in array.others) {
            array.others[data.type].forEach(function (field) {
                data[field] = core.replaceValue(data[field]);
            })
        }
    }
    return data;
}

events.prototype.__precompile_getArray = function () {
    var texts = [
        "text", "autoText", "scrollText", "tip", "textImage", "input", "input2",
        "choices", "confirm", "fillText", "fillBoldText", "drawTextContent"
    ];
    var locs = [
        "show", "hide", "setBlock", "setBlockOpacity", "showFloorImg", "hideFloorImg", "showBgFgMap",
        "hideBgFgMap", "setBgFgBlock", "animate", "setViewport", "move", "jumoHero",
        "changeFloor", "changePos", "showTextImage", "showGif", "openDoor",
        "closeDoor", "battle", "trigger", "insert", "setEnemyOnPoint", "resetEnemyOnPoint"
    ];
    var values = [
        "setValue", "setEnemy", "setEnemyOnPoint", "setEquip", "setFloor", "setGlobalValue",
    ];
    var uievents = [
        "clearMap", "fillText", "fillBoldText", "fillRect", "strokeRect", "fillEllipse", "strokeEllipse",
        "fillArc", "strokeArc", "drawIcon", "drawSelector", "drawBackground",
    ];
    var others = {
        "fillEllipse": ["a", "b", "angle"],
        "strokeEllipse": ["a", "b", "angle"],
        "fillRect": ["radius", "angle"],
        "strokeRect": ["radius", "angle"],
        "fillArc": ["r", "start", "end"],
        "strokeArc": ["r", "start", "end"],
        "drawLine": ["x1", "y1", "x2", "y2"],
        "drawArrow": ["x1", "y1", "x2", "y2"],
        "drawImage": ["x", "y", "w", "h", "x1", "y1", "w1", "h1", "angle"],
        "drawTextContent": ["left", "top"],
    };
    return {
        texts: texts,
        locs: locs,
        values: values,
        uievents: uievents,
        others: others
    };
}

events.prototype.__precompile_text = function (text) {
    if (typeof text != 'string') return text;
    return text.replace(/\${(.*?)}/g, function (word, value) {
        return "${" + core.replaceValue(value) + "}";
    });
}

events.prototype.__precompile_array = function (value) {
    if (typeof value == 'string') {
        value = core.replaceValue(value);
        return value;
    }
    if (value instanceof Array) {
        for (var i = 0; i < value.length; ++i) {
            value[i] = this.__precompile_array(value[i]);
        }
    }
    return value;
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
    data.text = core.replaceText(data.text, prefix);
    var ctx = data.code ? ('__text__' + data.code) : null;;
    data.ctx = ctx;
    if (core.getContextByName(ctx) && !data.showAll) {
        core.ui._animateUI('hide', ctx, function () {
            core.ui.drawTextBox(data.text, data);
            core.ui._animateUI('show', ctx, function () {
                if (data.async) core.doAction();
            });
        });
        return;
    }
    core.ui.drawTextBox(data.text, data);
    if (!data.showAll) {
        core.ui._animateUI('show', ctx, function () {
            if (data.async) core.doAction();
        });
    }
}

events.prototype._action_moveTextBox = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    this.__action_doAsyncFunc(data.async, core.moveTextBox, 
        data.code, this.__action_getLoc(data.loc, x, y, prefix), data.relative, data.moveMode, data.time);
}

events.prototype._action_clearTextBox = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    core.clearTextBox(data.code, core.doAction);
}

events.prototype._action_autoText = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    data.text = core.replaceText(data.text, prefix);
    core.ui.drawTextBox(data.text);
    setTimeout(core.doAction, data.time || 3000);
}

events.prototype._action_scrollText = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    data.text = core.replaceText(data.text, prefix);
    this.__action_doAsyncFunc(data.async, core.drawScrollText, data.text, data.time || 5000, data.lineHeight || 1.4);
}

events.prototype._action_comment = function (data, x, y, prefix) {
    core.doAction();
}

events.prototype._action__label = function (data, x, y, prefix) {
    core.doAction();
}

events.prototype._action_setText = function (data, x, y, prefix) {
    this.setTextAttribute(data);
    core.doAction();
}

events.prototype._action_tip = function (data, x, y, prefix) {
    core.drawTip(core.replaceText(data.text, prefix), data.icon, data.frame);
    core.doAction();
}

events.prototype._action_show = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    if (data.time > 0 &&  data.floorId == core.status.floorId) {
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
    if (data.time > 0 && data.floorId == core.status.floorId) {
        this.__action_doAsyncFunc(data.async, core.animateBlock, data.loc, data.remove ? 'remove' : 'hide', data.time);
    }
    else {
        data.loc.forEach(function (t) {
            if (data.remove) core.removeBlock(t[0], t[1], data.floorId);
            else core.hideBlock(t[0], t[1], data.floorId);
        });
        core.doAction();
    }
}

events.prototype._action_setBlock = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    data.time = data.time || 0;
    data.floorId = data.floorId || core.status.floorId;
    if (data.time > 0 && data.floorId == core.status.floorId) {
        this.__action_doAsyncFunc(data.async, core.animateSetBlocks, data.number, data.loc, data.floorId, data.time);
    } else {
        data.loc.forEach(function (loc) {
            core.setBlock(data.number, loc[0], loc[1], data.floorId);
        });
        core.doAction();
    }
}

events.prototype._action_setBlockOpacity = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    if (data.time > 0 && data.floorId == core.status.floorId) {
        this.__action_doAsyncFunc(data.async, core.animateBlock, data.loc, data.opacity, data.time);
    }
    else {
        data.loc.forEach(function (t) {
            core.setBlockOpacity(data.opacity, t[0], t[1], data.floorId);
        });
        core.doAction();
    }
}

events.prototype._action_setBlockFilter = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    data.loc.forEach(function (t) {
        core.setBlockFilter(data, t[0], t[1], data.floorId);
    });
    core.doAction();
}

events.prototype._action_turnBlock = function (data, x, y, prefix) {
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    data.loc.forEach(function (t) {
        core.turnBlock(data.direction, t[0], t[1], data.floorId);
    });
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
    data.loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    data.loc.forEach(function (t) {
        core.setBgFgBlock(data.name, data.number, t[0], t[1], data.floorId);
    });
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
    if (data.loc == 'hero') {
        this.__action_doAsyncFunc(data.async, core.drawHeroAnimate, data.name);
    } else {
        data.loc = this.__action_getLoc(data.loc, x, y, prefix);
        this.__action_doAsyncFunc(data.async, core.drawAnimate, data.name, data.loc[0], data.loc[1], data.alignWindow);
    }
}

events.prototype._action_stopAnimate = function (data, x, y, prefix) {
    core.stopAnimate(null, data.doCallback);
    core.doAction();
}

events.prototype._action_setViewport = function (data, x, y, prefix) {
    if (data.dxy != null) {
        data.loc = [core.bigmap.offsetX / 32 + (core.calValue(data.dxy[0], prefix) || 0), core.bigmap.offsetY / 32 + (core.calValue(data.dxy[1], prefix) || 0)];
    } else if (data.loc == null) {
        data.loc = [core.getHeroLoc('x') - core.__HALF_WIDTH__, core.getHeroLoc('y') - core.__HALF_HEIGHT__];
    } else {
        data.loc = this.__action_getLoc(data.loc, x, y, prefix);
    }
    this.__action_doAsyncFunc(data.async, core.moveViewport, data.loc[0], data.loc[1], data.moveMode, data.time);
}

events.prototype._action_lockViewport = function (data, x, y, prefix) {
    core.setFlag('__lockViewport__', data.lock || null);
    core.doAction();
}

events.prototype._action_move = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    this.__action_doAsyncFunc(data.async, core.moveBlock, loc[0], loc[1], data.steps, data.time, data.keep);
}

events.prototype._action_moveAction = function (data, x, y, prefix) {
    // 检查下一个点是否可通行
    if (core.canMoveHero()) {
        var nx = core.nextX(), ny = core.nextY();
        // 检查noPass决定是撞击还是移动
        if (core.noPass(nx, ny)) {
            core.insertAction([
                {"type": "trigger", "loc": [nx, ny]}
            ]);
        } else {
            // 先移动一格，然后尝试触发事件
            core.insertAction([
                {"type": "moveHero", "steps": ["forward"]},
                {"type": "function", "function": "function() { core.moveOneStep(core.doAction); }", "async": true},
                {"type": "_label"},
            ]);
        }
    }
    core.doAction();
}

events.prototype._action_moveHero = function (data, x, y, prefix) {
    this.__action_doAsyncFunc(data.async, core.eventMoveHero, data.steps, data.time);
}

events.prototype._action_jump = function (data, x, y, prefix) {
    var from = this.__action_getLoc(data.from, x, y, prefix), to;
    if (data.dxy) {
        to = [from[0] + (core.calValue(data.dxy[0], prefix) || 0), from[1] + (core.calValue(data.dxy[1], prefix) || 0)];
    } else {
        to = this.__action_getLoc(data.to, x, y, prefix);
    }
    this.__action_doAsyncFunc(data.async, core.jumpBlock, from[0], from[1], to[0], to[1], data.time, data.keep);
}

events.prototype._precompile_jump = function (data) {
    data.from = this.__precompile_array(data.from);
    data.to = this.__precompile_array(data.to);
    data.dxy = this.__precompile_array(data.dxy);
    return data;
}

events.prototype._action_jumpHero = function (data, x, y, prefix) {
    var loc;
    if (data.dxy) {
        loc = [core.getHeroLoc('x') + (core.calValue(data.dxy[0], prefix) || 0), core.getHeroLoc('y') + (core.calValue(data.dxy[1], prefix) || 0)];
    } else {
        loc = this.__action_getHeroLoc(data.loc, prefix);
    }
    this.__action_doAsyncFunc(data.async, core.jumpHero, loc[0], loc[1], data.time);
}

events.prototype._action_changeFloor = function (data, x, y, prefix) {
    var loc = this.__action_getHeroLoc(data.loc, prefix);
    var heroLoc = {x: loc[0], y: loc[1], direction: data.direction};
    core.changeFloor(data.floorId, data.stair, heroLoc, data.time, core.doAction);
}

events.prototype._action_changePos = function (data, x, y, prefix) {
    core.clearMap('hero');
    if (!data.loc && data.direction) {
        core.setHeroLoc('direction', core.turnDirection(data.direction), true);
        core.drawHero();
        return core.doAction();
    }

    var loc = this.__action_getHeroLoc(data.loc, prefix);
    core.setHeroLoc('x', loc[0]);
    core.setHeroLoc('y', loc[1]);
    if (data.direction) core.setHeroLoc('direction', core.turnDirection(data.direction));
    core.drawHero();
    core.doAction();
}

events.prototype._action_showImage = function (data, x, y, prefix) {
    if (core.isReplaying()) data.time = 0;
    this.__action_doAsyncFunc(data.async || data.time == 0, core.showImage,
        data.code, data.image + (data.reverse || ''), data.sloc, data.loc, data.opacity, data.time);
}

events.prototype._precompile_showImage = function (data) {
    data.sloc = this.__precompile_array(data.sloc);
    data.loc = this.__precompile_array(data.loc);
    return data;
}

events.prototype._action_showTextImage = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, 0, 0, prefix);
    if (core.isReplaying()) data.time = 0;
    data.text = core.replaceText(data.text, prefix);
    var __tmpName = (Math.random()+"_"+Math.random()).replace(/\./g, "") + ".png";
    core.material.images.images[__tmpName] = core.ui.textImage(data.text);
    this.__action_doAsyncFunc(data.async || data.time == 0, core.showImage,
        data.code, __tmpName + (data.reverse || ""), null, loc, data.opacity, data.time);
    delete core.material.images.images[__tmpName];
}

events.prototype._action_hideImage = function (data, x, y, prefix) {
    if (core.isReplaying()) data.time = 0;
    this.__action_doAsyncFunc(data.async || data.time == 0, core.hideImage, data.code, data.time);
}

events.prototype._action_showGif = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, 0, 0, prefix);
    this.showGif(data.name, loc[0], loc[1]);
    core.doAction();
}

events.prototype._action_moveImage = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    this.__action_doAsyncFunc(data.async, core.moveImage, data.code, data.to, data.opacity, data.moveMode, data.time);
}

events.prototype._precompile_moveImage = function (data) {
    data.to = this.__precompile_array(data.to);
    return data;
}

events.prototype._action_rotateImage = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    this.__action_doAsyncFunc(data.async, core.rotateImage, data.code, data.center, data.angle, data.moveMode, data.time);
}

events.prototype._precompile_rotateImage = function (data) {
    data.center = this.__precompile_array(data.center);
    return data;
}

events.prototype._action_scaleImage = function (data, x, y, prefix) {
    if (this.__action_checkReplaying()) return;
    this.__action_doAsyncFunc(data.async, core.scaleImage, data.code, data.center, data.scale, data.moveMode, data.time);
}

events.prototype._precompile_scaleImage = function (data) {
    data.center = this.__precompile_array(data.center);
    return data;
}

events.prototype._action_setCurtain = function (data, x, y, prefix) {
    if (data.async) {
        core.setCurtain(data.color || core.status.thisMap.color, data.time, data.moveMode);
        if (data.color == null || data.keep) core.setFlag('__color__', data.color || null);
        core.doAction();
    }
    else {
        core.setCurtain(data.color || core.status.thisMap.color, data.time, data.moveMode, function () {
            if (data.color == null || data.keep) core.setFlag('__color__', data.color || null);
            core.doAction();
        });
    }
}

events.prototype._action_screenFlash = function (data, x, y, prefix) {
    this.__action_doAsyncFunc(data.async, core.screenFlash, data.color, data.time, data.times, data.moveMode);
}

events.prototype._action_setWeather = function (data, x, y, prefix) {
    core.setWeather(data.name, data.level);
    if (data.keep)// && ['rain', 'snow', 'sun', 'fog', 'cloud'].indexOf(data.name) >= 0)
        core.setFlag('__weather__', [data.name, data.level]);
    else core.removeFlag('__weather__');
    core.doAction();
}

events.prototype._action_openDoor = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    var floorId = data.floorId;
    if (!floorId || floorId == core.status.floorId) {
        this.__action_doAsyncFunc(data.async, core.openDoor, loc[0], loc[1], data.needKey);
    }
    else {
        core.removeBlock(loc[0], loc[1], floorId);
        core.doAction();
    }
}

events.prototype._action_closeDoor = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    this.__action_doAsyncFunc(data.async, core.closeDoor, loc[0], loc[1], data.id);
}

events.prototype._action_useItem = function (data, x, y, prefix) {
    // 考虑到可能覆盖楼传事件的问题，这里不对fly进行检查。
    if (data.id != 'book' && core.canUseItem(data.id)) {
        core.useItem(data.id, true, core.doAction);
    }
    else {
        core.playSound('操作失败');
        core.drawTip("当前无法使用" + ((core.material.items[data.id] || {}).name || "未知道具"), data.id);
        core.doAction();
    }
}

events.prototype._action_loadEquip = function (data, x, y, prefix) {
    core.loadEquip(data.id);
    core.doAction();
}

events.prototype._action_unloadEquip = function (data, x, y, prefix) {
    core.unloadEquip(data.pos);
    core.doAction();
}

events.prototype._action_openShop = function (data, x, y, prefix) {
    core.setShopVisited(data.id, true);
    if (data.open) core.openShop(data.id, true);
    core.doAction();
}

events.prototype._action_disableShop = function (data, x, y, prefix) {
    core.setShopVisited(data.id, false);
    core.doAction();
}

events.prototype._action_battle = function (data, x, y, prefix) {
    if (data.id) {
        this.battle(data.id, null, null, true, core.doAction);
    }
    else {
        if (data.floorId != core.status.floorId) {
            core.doAction();
            return;
        }
        var loc = this.__action_getLoc(data.loc, x, y, prefix);
        this.battle(null, loc[0], loc[1], true, core.doAction);
    }
}

events.prototype._action_trigger = function (data, x, y, prefix) {
    var loc = this.__action_getLoc(data.loc, x, y, prefix);
    this._trigger_inAction(loc[0], loc[1]);
}

events.prototype._action_insert = function (data, x, y, prefix) {
    if (data.name) { // 公共事件
        core.insertCommonEvent(data.name, data.args);
    }
    else {
        // 设置参数
        if (data.args instanceof Array) {
           for (var i = 0; i < data.args.length; ++i) {
               try {
                   if (data.args[i] != null)
                       core.setFlag('arg'+(i+1), data.args[i]);
               } catch (e) { main.log(e); }
           }
        }
        var loc = this.__action_getLoc(data.loc, x, y, prefix);
        core.setFlag('arg0', loc);
        var floorId = data.floorId;
        var which = data.which || "events";
        var event = (core.floors[floorId][which]||[])[loc[0] + "," + loc[1]];
        if (event) this.insertAction(event.data || event);
    }
    core.doAction();
}

events.prototype._action_playBgm = function (data, x, y, prefix) {
    core.playBgm(data.name, data.startTime || 0);
    core.setFlag("__bgm__", data.keep ? data.name : null);
    core.doAction();
}

events.prototype._action_pauseBgm = function (data, x, y, prefix) {
    core.pauseBgm();
    core.doAction();
}

events.prototype._action_resumeBgm = function (data, x, y, prefix) {
    core.resumeBgm(data.resume);
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
    if (data.stop) core.stopSound();
    if (data.sync) {
        core.playSound(data.name, data.pitch, core.doAction);
    } else {
        core.playSound(data.name, data.pitch);
        core.doAction();
    }
}

events.prototype._action_stopSound = function (data, x, y, prefix) {
    core.stopSound();
    core.doAction();
}

events.prototype._action_setVolume = function (data, x, y, prefix) {
    data.value = core.clamp(parseInt(data.value) / 100, 0, 1);
    core.setFlag("__volume__", data.value);
    this.__action_doAsyncFunc(data.async, core.setVolume, data.value, data.time || 0);
}

events.prototype._action_setBgmSpeed = function (data, x, y, prefix) {
    core.setBgmSpeed(data.value, data.pitch);// || false);
    core.doAction();
}

events.prototype._action_setValue = function (data, x, y, prefix) {
    this.setValue(data.name, data.operator, data.value, prefix);
    if (!data.norefresh) {
        if (core.status.hero.hp <= 0) {
            core.status.hero.hp = 0;
            core.updateStatusBar();
            core.events.lose();
        } else {
            core.updateStatusBar();
        }
    }
    core.doAction();
}

events.prototype._action_addValue = function (data, x, y, prefix) {
    data.operator = '+=';
    this._action_setValue(data, x, y, prefix);
}

events.prototype._action_setEnemy = function (data, x, y, prefix) {
    this.setEnemy(data.id, data.name, data.value, data.operator, prefix, data.norefresh);
    core.doAction();
}

events.prototype._action_setEnemyOnPoint = function (data, x, y, prefix) {
    var loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    loc.forEach(function (one) {
        core.setEnemyOnPoint(one[0], one[1], data.floorId, data.name, data.value, data.operator, prefix, data.norefresh);
    });
    core.doAction();
}

events.prototype._action_resetEnemyOnPoint = function (data, x, y, prefix) {
    var loc = this.__action_getLoc2D(data.loc, x, y, prefix);
    loc.forEach(function (one) {
        core.resetEnemyOnPoint(one[0], one[1], data.floorId, data.norefresh);
    });
    core.doAction();
}

events.prototype._precompile_moveEnemyOnPoint = function (data) {
    data.from = this.__precompile_array(data.from);
    data.to = this.__precompile_array(data.to);
    data.dxy = this.__precompile_array(data.dxy);
    return data;
}

events.prototype._action_moveEnemyOnPoint = function (data, x, y, prefix) {
    var from = this.__action_getLoc(data.from, x, y, prefix), to;
    if (data.dxy) {
        to = [from[0] + (core.calValue(data.dxy[0], prefix) || 0), from[1] + (core.calValue(data.dxy[1], prefix) || 0)];
    } else {
        to = this.__action_getLoc(data.to, x, y, prefix);
    }
    this.moveEnemyOnPoint(from[0], from[1], to[0], to[1], data.floorId, data.norefresh);
    core.doAction();
}

events.prototype._action_setEquip = function (data, x, y, prefix) {
    core.setEquip(data.id, data.valueType, data.name, data.value, data.operator, prefix);
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

events.prototype._action_setNameMap = function (data, x, y, floorId) {
    this.setNameMap(data.name, data.value);
    core.doAction();
}

events.prototype._action_setHeroIcon = function (data, x, y, prefix) {
    this.setHeroIcon(data.name, data.noDraw);
    core.doAction();
}

events.prototype._action_input = function (data, x, y, prefix) {
    this.__action_getInput(core.replaceText(data.text, prefix), false, function (value) {
        value = /*Math.abs*/(parseInt(value) || 0);
        core.status.route.push("input:" + value);
        core.setFlag("input", value);
        core.doAction();
    });
}

events.prototype._action_input2 = function (data, x, y, prefix) {
    this.__action_getInput(core.replaceText(data.text, prefix), true, function (value) {
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
            if (action.indexOf(prefix) != 0) {
                console.warn("警告！当前需要一个 " + prefix + " 项，实际为 " + action);
                core.status.replay.toReplay.unshift(action);
                return callback(isText ? '' : 0);
            }
            if (isText) value = core.decodeBase64(action.substring(7));
            else value = parseInt(action.substring(6));
            callback(value);
        }
        catch (e) {
            core.control._replay_error(action);
            return;
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

events.prototype._precompile_if = function (data) {
    data.condition = core.replaceValue(data.condition);
    data["true"] = this.precompile(data["true"]);
    data["false"] = this.precompile(data["false"]);
    return data;
}

events.prototype._action_switch = function (data, x, y, prefix) {
    var key = core.calValue(data.condition, prefix)
    var list = [];
    for (var i = 0; i < data.caseList.length; i++) {
        if (data.caseList[i]._disabled) continue;
        var condition = data.caseList[i]["case"];
        if (condition == "default" || core.calValue(condition, prefix) === key) {
            core.push(list, data.caseList[i].action);
            if (!data.caseList[i].nobreak)
                break;
        }
    }
    core.insertAction(list);
    core.doAction();
}

events.prototype._precompile_switch = function (data) {
    data.condition = core.replaceValue(data.condition);
    for (var i = 0; i < data.caseList.length; i++) {
        data.caseList[i]["case"] = core.replaceValue(data.caseList[i]["case"]);
        data.caseList[i].action = this.precompile(data.caseList[i].action);
    }
    return data;
}

events.prototype._action_choices = function (data, x, y, prefix) {
    data.choices = data.choices.filter(function (x) {
        if (x._disabled) return false;
        if (x.condition == null || x.condition == '') return true;
        try { return core.calValue(x.condition, prefix); } catch (e) { return true; }
    })
    if (data.choices.length == 0) return this.doAction();
    if (core.isReplaying()) {
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf('choices:') == 0 && !(action == 'choices:none' && !data.timeout)) {
            var index = action.substring(8);
            if (!this.__action_choices_replaying(data, index)) {
                core.control._replay_error(action);
                return;
            }
        } else {
            // 容错录像
            if (main.replayChecking) {
                // 录像验证系统中选择第一项
                if (action != 'choices:none') core.status.replay.toReplay.unshift(action); // 首先归还刚才读出的下一步操作
                core.events.__action_choices_replaying(data, 0)
            } else {
                // 正常游戏中弹窗选择
                core.myprompt('录像回放出错！当前需要执行选择项但录像中未记录。\n如需修复请输入您要选的项（从0起），点击取消将不会修复。', 0, function (value) {
                    if (value == null) {
                        core.control._replay_error(action);
                        return;
                    }
                    if (action != 'choices:none') core.status.replay.toReplay.unshift(action); // 首先归还刚才读出的下一步操作
                    core.events.__action_choices_replaying(data, ((parseInt(value) || 0) + data.choices.length) % data.choices.length);
                });
            }
        }
    } else {
        if (data.timeout) {
            core.status.event.interval = setTimeout(function () {
                core.status.route.push("choices:none");
                core.setFlag('timeout', 0);
                core.doAction();
            }, data.timeout);   
        }
        core.status.event.timeout = new Date().getTime() + (data.timeout || 0);
    }
    for (var i = 0; i < data.choices.length; i++) {
        if (typeof data.choices[i] === 'string')
            data.choices[i] = {"text": data.choices[i]};
        data.choices[i].text = core.replaceText(data.choices[i].text, prefix);
    }
    core.ui.drawChoices(core.replaceText(data.text, prefix), data.choices, data.width);
}

events.prototype.__action_choices_replaying = function (data, index) {
    var selection = index;
    if (index != 'none') {
        selection = parseInt(index);
        if (isNaN(selection)) return false;
        if (selection < 0) selection += data.choices.length;
        if (selection < 0) return false;
        if (selection % 100 > 50) selection += data.choices.length;
        if (selection % 100 > data.choices.length) return false;
        var timeout = Math.floor(selection / 100) || 0;
        core.setFlag('timeout', timeout);
        selection %= 100;
    } else core.setFlag('timeout', 0);
    core.status.event.selection = selection;
    setTimeout(function () {
        core.status.route.push("choices:"+index);
        if (selection != 'none') {
            // 检查
            var choice = data.choices[selection];
            if (choice.need != null && choice.need != '' && !core.calValue(choice.need)) {
                // 无法选择此项
                core.control._replay_error("无法选择项："+index);
                return;
            } else {
                core.insertAction(choice.action);
            }
        }
        core.doAction();
    }, core.status.replay.speed == 24 ? 1 : 750 / Math.max(1, core.status.replay.speed));
    return true;
}

events.prototype._precompile_choices = function (data) {
    if (!(data.choices instanceof Array)) return data;
    for (var i = 0; i < data.choices.length; ++i) {
        data.choices[i].condition = core.replaceValue(data.choices[i].condition);
        data.choices[i].text = this.__precompile_text(data.choices[i].text);
        data.choices[i].action = this.precompile(data.choices[i].action);
    }
    return data;
}

events.prototype._action_confirm = function (data, x, y, prefix) {
    data.text = core.replaceText(data.text, prefix);
    core.status.event.ui = {"text": data.text, "yes": data.yes, "no": data.no};
    if (core.isReplaying()) {
        var action = core.status.replay.toReplay.shift();
        if (action.indexOf('choices:') == 0 && !(action == 'choices:none' && !data.timeout)) {
            var index = action.substring(8);
            if (index == 'none' || ((index = parseInt(index)) >= 0) && index % 100 < 2) {
                this.__action_confirm_replaying(data, index);
            } else {
                core.control._replay_error(action);
                return;
            }
        } else {
            // 录像中未记录选了哪个，则选默认值，而不是直接报错
            if (action != 'choices:none') core.status.replay.toReplay.unshift(action);
            this.__action_confirm_replaying(data, data["default"] ? 0 : 1);
        }
    }
    else {
        core.status.event.selection = data["default"] ? 0 : 1;
        if (data.timeout) {
            core.status.event.interval = setTimeout(function () {
                core.status.route.push("choices:none");
                core.setFlag('timeout', 0);
                core.doAction();
            }, data.timeout);
        }
        core.status.event.timeout = new Date().getTime() + (data.timeout || 0);
    }
    core.ui.drawConfirmBox(data.text);
}

events.prototype.__action_confirm_replaying = function (data, index) {
    if (index != 'none') {
        var timeout = Math.floor(index / 100) || 0;
        core.setFlag('timeout', timeout);
        index %= 100;
    } else core.setFlag('timeout', 0);
    core.status.event.selection = index;
    setTimeout(function () {
        core.status.route.push("choices:"+index);
        if (index != 'none') {
            if (index == 0) core.insertAction(data.yes);
            else core.insertAction(data.no);
        }
        core.doAction();
    }, core.status.replay.speed == 24 ? 1 : 750 / Math.max(1, core.status.replay.speed));
}

events.prototype._precompile_confirm = function (data) {
    data.yes = this.precompile(data.yes);
    data.no = this.precompile(data.no);
    return data;
}

events.prototype._action_for = function (data, x, y, prefix) {
    // Only support temp:A
    if (!/^temp:[A-Z]$/.test(data.name)) {
        core.insertAction('循环遍历事件只支持临时变量！');
        return core.doAction();
    }
    var from = core.calValue(data.from);
    var to = core.calValue(data.to);
    var step = core.calValue(data.step);
    if (typeof from != 'number' || typeof to !='number' || typeof step != 'number') {
        core.insertAction('循环遍历事件要求【起始点】【终止点】【每步】仅能是数字！');
        return core.doAction();
    }
    // 首次判定
    if ((step > 0 && from > to) || (step < 0 && from < to)) {
        core.doAction();
        return;
    }

    var letter = data.name.substring(5);
    core.setFlag('@temp@' + letter, from);
    var toName = '@temp@for-to@' + letter;
    var stepName = '@temp@for-step@' + letter;
    core.setFlag(toName, data.to);
    core.setFlag(stepName, data.step);
    var condition = "(function () {"+
        "var to = core.calValue(core.getFlag('" + toName + "'));"+
        "var step = core.calValue(core.getFlag('" + stepName + "'));"+
        "if (typeof step != 'number' || typeof to != 'number') return false;"+
        "if (step == 0) return true;"+
        "var currentValue = core.getFlag('@temp@" + letter + "');"+
        "currentValue += step;"+
        "core.setFlag('@temp@" + letter + "', currentValue);"+
        "if (step > 0) { return currentValue <= to; }"+
        "else { return currentValue >= to; }"+
        "})()";
    return this._action_dowhile({"condition": condition, "data": data.data}, x, y, prefix);
}

events.prototype._precompile_for = function (data) {
    data.from = core.replaceValue(data.from);
    data.to = core.replaceValue(data.to);
    data.step = core.replaceValue(data.step);
    data.data = this.precompile(data.data);
    return data;
}

events.prototype._action_forEach = function (data, x, y, prefix) {
    // Only support temp:A
    if (!/^temp:[A-Z]$/.test(data.name)) {
        core.insertAction(['循环遍历事件只支持临时变量！']);
        return core.doAction();
    }
    var listName = '@temp@forEach@' + data.name.substring(5);
    core.setFlag(listName, core.clone(data.list));
    var condition = "(function () {" +
        "var list = core.getFlag('"+listName+"', []);"+
        "if (list.length == 0) return false;"+
        "core.setFlag('@temp@'+'" + data.name.substring(5) + "', list.shift());"+
        "return true;"+
        "})()";
    return this._action_while({"condition": condition, "data": data.data}, x, y, prefix);
}

events.prototype._precompile_forEach = function (data) {
    data.data = this.precompile(data.data);
    return data;
}

events.prototype._action_while = function (data, x, y, prefix) {
    if (core.calValue(data.condition, prefix)) {
        var list = core.clone(data.data);
        if (!(list instanceof Array)) list = [list];
        list.push({"type": "_label"});
        core.unshift(core.status.event.data.list,
            {"todo": list, "total": core.clone(list), "condition": data.condition}
        );
    }
    core.doAction();
}

events.prototype._precompile_while = function (data) {
    data.condition = core.replaceValue(data.condition);
    data.data = this.precompile(data.data);
    return data;
}

events.prototype._action_dowhile = function (data, x, y, prefix) {
    var list = core.clone(data.data);
    if (!(list instanceof Array)) list = [list];
    list.push({"type": "_label"});
    core.unshift(core.status.event.data.list,
        {"todo": list, "total": core.clone(list), "condition": data.condition}
    );
    core.doAction();
}

events.prototype._precompile_dowhile = function (data) {
    data.condition = core.replaceValue(data.condition);
    data.data = this.precompile(data.data);
    return data;
}

events.prototype._action_break = function (data, x, y, prefix) {
    var n = data.n || 1;
    while (n--) {
        if (core.status.event.data.list.length > 1)
            core.status.event.data.list.shift();
    }
    core.doAction();
}

events.prototype._action_continue = function (data, x, y, prefix) {
    var n = data.n || 1;
    while (n-- > 1) {
        if (core.status.event.data.list.length > 1)
            core.status.event.data.list.shift();
    }
    if (core.status.event.data.list.length > 1) {
        if (core.calValue(core.status.event.data.list[0].condition, prefix)) {
            core.status.event.data.list[0].todo = core.clone(core.status.event.data.list[0].total);
        }
        else {
            core.status.event.data.list.shift();
        }
    }
    core.doAction();
}

events.prototype._action_win = function (data, x, y, prefix) {
    this.win(core.replaceText(data.reason, prefix), data.norank, data.noexit);
}

events.prototype._action_lose = function (data, x, y, prefix) {
    this.lose(core.replaceText(data.reason, prefix));
}

events.prototype._action_restart = function (data, x, y, prefix) {
    core.restart();
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
    core.updateStatusBar(data.doNotCheckAutoEvents);
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

events.prototype._action_showHero = function (data, x, y, prefix) {
    data.opacity = 1;
    return this._action_setHeroOpacity(data, x, y, prefix);
}

events.prototype._action_hideHero = function (data, x, y, prefix) {
    data.opacity = 0;
    return this._action_setHeroOpacity(data, x, y, prefix);
}

events.prototype._action_setHeroOpacity = function (data, x, y, prefix) {
    data.time = data.time || 0;
    if (data.opacity == null) data.opacity = 1;
    if (data.time > 0) {
        this.__action_doAsyncFunc(data.async, core.setHeroOpacity, data.opacity, data.moveMode, data.time);
    } else {
        core.setFlag('__heroOpacity__', data.opacity);
        core.drawHero();
        core.doAction();
    }
}

events.prototype._action_vibrate = function (data, x, y, prefix) {
    this.__action_doAsyncFunc(data.async, core.vibrate, data.direction, data.time, data.speed, data.power);
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
        if (code.indexOf("input:") == 0 && !(code == "input:none" && !data.timeout)) {
            if (code == "input:none") {
                core.status.route.push("input:none");
                core.setFlag("type", -1);
                core.setFlag("timeout", 0);
                this.__action_wait_afterGet(data);
                return core.doAction();
            } else {
                var value = parseInt(code.substring(6));
                core.status.route.push("input:" + value);
                this.__action_wait_getValue(value);
                if (this.__action_wait_afterGet(data) || !data.forceChild) return core.doAction();
            }
        }
        core.control._replay_error(code);
        return;
    } else if (data.timeout) {
        core.status.event.interval = setTimeout(function() {
            core.status.route.push("input:none");
            core.setFlag("type", -1);
            core.setFlag("timeout", 0);
            core.events.__action_wait_afterGet(data);
            core.doAction();
        }, data.timeout);
    }
    core.status.event.timeout = new Date().getTime() + (data.timeout || 0);
}

events.prototype.__action_wait_getValue = function (value) {
    core.setFlag("timeout", Math.floor(value / 1e8) || 0);
    value %= 1e8;
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

events.prototype.__action_wait_afterGet = function (data) {
    if (!data.data) return false;
    var todo = [];
    var stop = false;
    var found = false;
    data.data.forEach(function (one) {
        if (one._disabled || stop) return;
        if (one["case"] == "keyboard" && core.getFlag("type") == 0) {
            (one.keycode + "").split(",").forEach(function (keycode) {
                if (core.getFlag("keycode", 0) == keycode) {
                    found = true;
                    core.push(todo, one.action);
                    if (one["break"]) stop = true;
                }
            });
        }
        if (one["case"] == "mouse" && one.px instanceof Array
            && one.py instanceof Array && core.getFlag("type") == 1) {
            var pxmin = core.calValue(one.px[0]);
            var pxmax = core.calValue(one.px[1]);
            var pymin = core.calValue(one.py[0]);
            var pymax = core.calValue(one.py[1]);
            var px = core.getFlag("px", 0), py = core.getFlag("py", 0);
            if (px >= pxmin && px <= pxmax && py >= pymin && py <= pymax) {
                found = true;
                core.push(todo, one.action);
                if (one["break"]) stop = true;
            }
        }
        if (one["case"] == "condition") {
            var condition = false;
            try { condition = core.calValue(one.condition); } catch (e) {}
            if (condition) {
                found = true;
                core.push(todo, one.action);
                if (one["break"]) stop = true;
            }
        }
        if (one["case"] == "timeout" && core.getFlag("type") == -1) {
            found = true;
            core.push(todo, one.action);
            if (one["break"]) stop = true;
        }
    })
    if (found) {
        core.insertAction(todo);
        return true;
    }
    return false;
}

events.prototype._precompile_wait = function (data) {
    if (data.data) {
        data.data.forEach(function (v) {
            if (v.px != null) v.px = this.__precompile_array(v.px);
            if (v.py != null) v.py = this.__precompile_array(v.py);
            if (v.condition != null) v.condition = this.__precompile_array(v.condition);
            v.action = this.precompile(v.action);
        }, this);
    }
    return data;
}

events.prototype._action_waitAsync = function (data, x, y, prefix) {
    var test = window.setInterval(function () {
        if (!core.hasAsync() 
                && (data.excludeAnimates || core.isReplaying() || core.getPlayingAnimates().length == 0)
                && (!data.includeSounds || core.isReplaying() ||  core.getPlayingSounds().length == 0)) {
            clearInterval(test);
            core.doAction();
        }
    }, 50 / core.status.replay.speed);
}

events.prototype._action_stopAsync = function (data, x, y, prefix) {
    core.stopAsync();
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
        var forbidSave = core.hasFlag('__forbidSave__');
        core.removeFlag('__forbidSave__');
        core.save();
        if (forbidSave) core.setFlag('__forbidSave__', true);
        core.status.event.interval = e;
    }
}

events.prototype._action_autoSave = function (data, x, y, prefix) {
    var forbidSave = core.hasFlag('__forbidSave__');
    core.removeFlag('__forbidSave__');
    core.autosave();
    if (forbidSave) core.setFlag('__forbidSave__', true);
    if (!data.nohint) core.drawTip("已自动存档",'save');
    core.doAction();
}

events.prototype._action_forbidSave = function (data, x, y, prefix) {
    core.setFlag('__forbidSave__', data.forbid || null);
    core.doAction();
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

events.prototype._action_previewUI = function (data, x, y, prefix) {
    this.insertAction(data.action);
    core.doAction();
}

events.prototype._precompile_previewUI = function (data) {
    data.action = this.precompile(data.action);
    return data;
}

events.prototype.__action_doUIEvent = function (data) {
    this.__action_doUIEvent_doOne(data);
    var current = core.status.event.data.list[0];
    while (current.todo.length > 0) {
        data = current.todo[0];
        if (this.__action_doUIEvent_doOne(current.todo[0]))
            current.todo.shift();
        else break;
    }
    core.doAction();
}

events.prototype.__action_doUIEvent_doOne = function (data) {
    if (core.ui['_uievent_' + data.type]) {
        core.ui['_uievent_' + data.type](data);
        return true;
    }
    return false;
}

events.prototype._action_clearMap = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_fillText = function (data, x, y, prefix) {
    data.text = core.replaceText(data.text, prefix);
    this.__action_doUIEvent(data);
}

events.prototype._action_fillBoldText = function (data, x, y, prefix) {
    data.text = core.replaceText(data.text, prefix);
    this.__action_doUIEvent(data);
}

events.prototype._action_fillRect = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_fillPolygon = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._precompile_fillPolygon = function (data) {
    data.nodes = this.__precompile_array(data.nodes);
    return data;
}

events.prototype._action_strokeRect = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_strokePolygon = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._precompile_strokePolygon = function (data) {
    data.nodes = this.__precompile_array(data.nodes);
    return data;
}

events.prototype._action_fillEllipse = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_strokeEllipse = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_fillArc = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_strokeArc = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawLine = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawArrow = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_setAttribute = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_setFilter = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawImage = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawIcon = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawSelector = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawBackground = function (data, x, y, prefix) {
    this.__action_doUIEvent(data);
}

events.prototype._action_drawTextContent = function (data, x, y, prefix) {
    data.text = core.replaceText(data.text, prefix);
    this.__action_doUIEvent(data);
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
        core.playSound('操作失败');
        core.drawTip("你没有" + core.material.items[name].name, name);
        return false;
    }
    if (core.isMoving()) {
        core.playSound('操作失败');
        core.drawTip("请先停止勇士行动",'npc0');
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
        core.ui._drawViewMaps(core.status.event.ui);
        return;
    }
    // 从“浏览地图”页面打开
    if (core.status.event.id == 'viewMaps') {
        fromUserAction = false;
        core.status.event.ui = core.status.event.data;
    }
    if (!this._checkStatus('book', fromUserAction, true)) return;
    core.playSound('打开界面');
    core.useItem('book', true);
}

////// 点击楼层传送器时的打开操作 //////
events.prototype.useFly = function (fromUserAction) {
    if (core.isReplaying()) return;
    // 从“浏览地图”页面：尝试直接传送到该层
    if (core.status.event.id == 'viewMaps') {
        if (!core.hasItem('fly')) {
            core.playSound('操作失败');
            core.drawTip('你没有' + core.material.items['fly'].name, 'fly');
        } else if (!core.canUseItem('fly')) {
            core.playSound('操作失败');
            core.drawTip('无法传送到当前层', 'fly');
        } else {
            core.flyTo(core.status.event.data.floorId);
        }
        return;
    }

    if (!this._checkStatus('fly', fromUserAction, true)) return;
    if (core.flags.flyNearStair && !core.nearStair()) {
        core.playSound('操作失败');
        core.drawTip("只有在楼梯边才能使用" + core.material.items['fly'].name, 'fly');
        core.unlockControl();
        core.status.event.data = null;
        core.status.event.id = null;
        return;
    }
    if (!core.canUseItem('fly')) {
        core.playSound('操作失败');
        core.drawTip(core.material.items['fly'].name + "好像失效了", 'fly');
        core.unlockControl();
        core.status.event.data = null;
        core.status.event.id = null;
        return;
    }
    core.playSound('打开界面');
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
    core.playSound('打开界面');
    core.ui._drawEquipbox();
}

////// 点击工具栏时的打开操作 //////
events.prototype.openToolbox = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('toolbox', fromUserAction)) return;
    core.playSound('打开界面');
    core.ui._drawToolbox();
}

////// 点击快捷商店按钮时的打开操作 //////
events.prototype.openQuickShop = function (fromUserAction) {
    if (core.isReplaying()) return;

    if (Object.keys(core.status.shops).length == 0) {
        core.playSound('操作失败');
        core.drawTip("本游戏没有快捷商店！",'shop');
        return;
    }

    // --- 如果只有一个商店，则直接打开之
    if (Object.keys(core.status.shops).length == 1) {
        var shopId = Object.keys(core.status.shops)[0];
        if (core.status.event.id != null) return;
        if (!core.canOpenShop(shopId)) {
            core.playSound('操作失败');
            core.drawTip("当前无法打开快捷商店！",'shop');
            return;
        }
        var message = core.canUseQuickShop(shopId);
        if (message != null) {
            core.playSound('操作失败');
            core.drawTip(message,'shop');
            return;
        }
        core.openShop(shopId, false);
        return;
    }

    if (!this._checkStatus('selectShop', fromUserAction)) return;
    core.ui._drawQuickShop();
}

events.prototype.openKeyBoard = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('keyBoard', fromUserAction)) return;
    core.ui._drawKeyBoard();
}

////// 点击保存按钮时的打开操作 //////
events.prototype.save = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (core.hasFlag('__forbidSave__')) {
        core.playSound('操作失败');
        core.drawTip('当前禁止存档','save');
        return;
    }
    if (core.status.event.id == 'save' && core.events.recoverEvents(core.status.event.interval))
        return;
    if (!this._checkStatus('save', fromUserAction)) return;
    var saveIndex = core.saves.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;
    core.playSound('打开界面');
    core.ui._drawSLPanel(10*page+offset);
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
        core.status.event = {'id': 'load', 'data': null};
        core.status.lockControl = true;
        core.playSound('打开界面');
        core.ui._drawSLPanel(10*page+offset);
        return;
    }
    if (core.status.event.id == 'load' && core.events.recoverEvents(core.status.event.interval))
        return;
    if (!this._checkStatus('load', fromUserAction)) return;
    core.playSound('打开界面');
    core.ui._drawSLPanel(10*page+offset);
}

////// 点击设置按钮时的操作 //////
events.prototype.openSettings = function (fromUserAction) {
    if (core.isReplaying()) return;
    if (!this._checkStatus('settings', fromUserAction))
        return;
    core.playSound('打开界面');
    core.ui._drawSettings();
}

// ------ 一些事件的具体执行过程 ------ //

events.prototype.hasAsync = function () {
    return Object.keys(core.animateFrame.asyncId).length > 0;
}

////// 立刻停止所有异步事件 //////
events.prototype.stopAsync = function () {
    var callbacks = [];
    for (var id in core.animateFrame.asyncId) {
        clearInterval(id);
        callbacks.push(core.animateFrame.asyncId[id]);
    }
    core.animateFrame.asyncId = {};
    callbacks.forEach(function (cb) {
        if (cb && cb instanceof Function) cb();
    });
}

events.prototype.hasAsyncAnimate = function () {
    return (core.status.animateObjs || []).length > 0;
}

////// 跟随 //////
events.prototype.follow = function (name) {
    name = core.getMappedName(name);
    if (core.material.images.images[name]) {
        core.status.hero.followers.push({"name": name});
        core.gatherFollowers();
        core.clearMap('hero');
        core.drawHero();
    }
    core.clearRouteFolding();
}

////// 取消跟随 //////
events.prototype.unfollow = function (name) {
    if (!name) {
        core.status.hero.followers = [];
    }
    else {
        name = core.getMappedName(name);
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
    core.clearRouteFolding();
}

events.prototype._updateValueByOperator = function (value, originValue, operator) {
    switch (operator) {
        case '+=': value = originValue + value; break;
        case '-=': value = originValue - value; break;
        case '*=': value = originValue * value; break;
        case '/=': value = originValue / value; break;
        case '**=': value = Math.pow(originValue, value); break;
        case '//=': value = Math.trunc(originValue / value); break;
        case '%=': value = originValue % value; break;
        case 'min=': value = Math.min(originValue, value); break;
        case 'max=': value = Math.max(originValue, value); break;
        default: break;
    }
    return value;
}

////// 数值操作 //////
events.prototype.setValue = function (name, operator, value, prefix) {
    value = this._updateValueByOperator(core.calValue(value, prefix), core.calValue(name, prefix), operator);
    this._setValue_setStatus(name, value);
    this._setValue_setBuff(name, value);
    this._setValue_setItem(name, value);
    this._setValue_setFlag(name, value);
    this._setValue_setSwitch(name, value, prefix);
    this._setValue_setTemp(name, value, prefix);
    this._setValue_setGlobal(name, value);
}

events.prototype._setValue_setStatus = function (name, value) {
    if (name.indexOf("status:") !== 0) return;
    core.setStatus(name.substring(7), value);
}

events.prototype._setValue_setBuff = function (name, value) {
    if (name.indexOf('buff:') !== 0) return;
    core.setBuff(name.substring(5), value);
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

events.prototype._setValue_setTemp = function (name, value) {
    if (name.indexOf("temp:") !== 0) return;
    core.setFlag("@temp@" + name.substring(5), value);
}

events.prototype._setValue_setGlobal = function (name, value) {
    if (name.indexOf("global:") !== 0) return;
    core.setGlobal(name.substring(7), value);
}

////// 设置一个怪物属性 //////
events.prototype.setEnemy = function (id, name, value, operator, prefix, norefresh) {
    if (!core.hasFlag('enemyInfo')) {
        core.setFlag('enemyInfo', {});
    }
    var enemyInfo = core.getFlag('enemyInfo');
    if (!enemyInfo[id]) enemyInfo[id] = {};
    if (typeof value === 'string' && name == 'name') value = value.replace(/\r/g, '\\r');
    value = this._updateValueByOperator(core.calValue(value, prefix), (core.material.enemys[id]||{})[name], operator);
    enemyInfo[id][name] = value;
    (core.material.enemys[id]||{})[name] = core.clone(value);
    if (!norefresh) core.updateStatusBar();
}

////// 设置某个点上的怪物属性 //////
events.prototype.setEnemyOnPoint = function (x, y, floorId, name, value, operator, prefix, norefresh) {
    floorId = floorId || core.status.floorId;
    var block = core.getBlock(x, y, floorId);
    if (block == null) return;
    if (block.event.cls.indexOf('enemy') != 0) return;
    var enemy = core.material.enemys[block.event.id];
    if (enemy == null) return;
    if (typeof value === 'string' && name == 'name') value = value.replaceAll(/\r/g, '\\r');
    value = this._updateValueByOperator(core.calValue(value, prefix), enemy[name], operator);
    flags.enemyOnPoint = flags.enemyOnPoint || {};
    flags.enemyOnPoint[floorId] = flags.enemyOnPoint[floorId] || {}; 
    flags.enemyOnPoint[floorId][x+","+y] = flags.enemyOnPoint[floorId][x+","+y] || {};
    flags.enemyOnPoint[floorId][x+","+y][name] = value;
    if (!norefresh) core.updateStatusBar();
}

////// 重置某个点上的怪物属性 //////
events.prototype.resetEnemyOnPoint = function (x, y, floorId, norefresh) {
    delete ((flags.enemyOnPoint||{})[floorId||core.status.floorId]||{})[x+","+y];
    if (!norefresh) core.updateStatusBar();
}

////// 将某个点上已经设置的怪物属性移动到其他点 //////
events.prototype.moveEnemyOnPoint = function (fromX, fromY, toX, toY, floorId, norefresh) {
    floorId = floorId || core.status.floorId;
    if (((flags.enemyOnPoint||{})[floorId]||{})[fromX+","+fromY]) {
        flags.enemyOnPoint[floorId][toX+","+toY] = flags.enemyOnPoint[floorId][fromX+","+fromY];
        delete flags.enemyOnPoint[floorId][fromX+","+fromY];
        if (!norefresh) core.updateStatusBar();
    }
}

////// 设置楼层属性 //////
events.prototype.setFloorInfo = function (name, value, floorId, prefix) {
    floorId = floorId || core.status.floorId;
    core.status.maps[floorId][name] = value;
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
        // --- 检查颜色
        if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(value)) {
            value = 'rgba(' + value + ')';
        }
    }
    core.status.globalAttribute[name] = value;
    core.setFlag('globalAttribute', core.status.globalAttribute);
    core.resize();
}

////// 设置全局开关 //////
events.prototype.setGlobalFlag = function (name, value) {
    var flags = core.getFlag("globalFlags", {});
    if (name.startsWith('s:')) {
        name = name.substring(2);
        var statusBarItems = core.flags.statusBarItems.filter(function (v) {return v!=name;});
        if (value) statusBarItems.push(name);
        core.flags.statusBarItems = statusBarItems;
        flags.statusBarItems = core.clone(statusBarItems);
    } else {
        flags[name] = core.flags[name] = value;
    }
    core.setFlag("globalFlags", flags);
    core.resize();
    if (name == 'blurFg')
        core.redrawMap();
}

////// 设置文件别名 //////
events.prototype.setNameMap = function (name, value) {
    if (!core.hasFlag('__nameMap__')) core.setFlag('__nameMap__', {});
    flags.__nameMap__[name] = value;
}

////// 设置剧情文本的属性 //////
events.prototype.setTextAttribute = function (data) {
    if (!core.isPlaying()) return;
    ["position", "offset", "align", "bold", "titlefont", "textfont", "lineHeight", "time", "letterSpacing", "animateTime"].forEach(function (t) {
        if (data[t] != null) core.status.textAttribute[t] = data[t];
    });
    ["background", "title", "text"].forEach(function (t) {
        if ((data[t] instanceof Array) && data[t].length >= 3) {
            if (data[t].length == 3) data[t].push(1);
            core.status.textAttribute[t] = data[t];
        }
        if (t == 'background') {
            var name = core.getMappedName(data[t]);
            var img = core.material.images.images[name];
            if (img && img.width == 192 && img.height == 128) {
                core.status.textAttribute[t] = name;
            }
        }
    });
    if (main.mode == 'play') core.setFlag('textAttribute', core.status.textAttribute);
}

events.prototype.moveTextBox = function (code, loc, relative, moveMode, time, callback) {
    var ctx = core.getContextByName('__text__' + code);
    if (!ctx) {
        if (callback) callback();
        return;
    }
    var sx = parseInt(ctx.canvas.getAttribute('_text_left')) || 0;
    var sy = parseInt(ctx.canvas.getAttribute('_text_top')) || 0;
    var dx = relative ? loc[0] : (loc[0] - sx);
    var dy = relative ? loc[1] : (loc[1] - sy);
    var ox = parseInt(ctx.canvas.getAttribute('_left')) || 0;
    var oy = parseInt(ctx.canvas.getAttribute('_top')) || 0;

    if (!time) {
        core.relocateCanvas(ctx, ox + dx, oy + dy);
        ctx.canvas.setAttribute('_text_left', loc[0]);
        ctx.canvas.setAttribute('_text_top', loc[1]);
        if (callback) callback();
        return;
    }

    var moveInfo = {
        sx: sx, sy: sy, dx: dx, dy: dy, ox: ox, oy: oy,
        moveMode: moveMode, time: time / Math.max(core.status.replay.speed, 1)
    };
    this._moveTextBox_moving(ctx, moveInfo, callback);
}

events.prototype._moveTextBox_moving = function (ctx, moveInfo, callback) {
    var step = 0, steps = moveInfo.time / 10;
    if (steps <= 0) steps = 1;
    var moveFunc = core.applyEasing(moveInfo.moveMode);
    var animate = setInterval(function () {
        step++;
        var dx = moveInfo.dx * moveFunc(step / steps);
        var dy = moveInfo.dy * moveFunc(step / steps);
        core.relocateCanvas(ctx, parseInt(moveInfo.ox + dx), parseInt(moveInfo.oy + dy));
        ctx.canvas.setAttribute('_text_left', moveInfo.sx + dx);
        ctx.canvas.setAttribute('_text_top', moveInfo.sy + dy);
        if (step == steps) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, 10);
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = callback;
}

////// 清除对话框 //////
events.prototype.clearTextBox = function (code, callback) {
    if (code == null) {
        code = Object.keys(core.dymCanvas).filter(function (one) { return one.startsWith('__text__') })
            .map(function (one) { return one.substring('__text__'.length); })
    }

    if (!(code instanceof Array)) code = [code];
    var index = 0;
    var _work = function () {
        if (index == code.length) {
            if (callback) callback();
            return;
        }
        var ctx = '__text__' + code[index++];
        if (!core.getContextByName(ctx)) return _work();
        core.ui._animateUI('hide', ctx, function () {
            core.deleteCanvas(ctx);
            _work();
        });
    };
    _work();
}

////// 关门 //////
events.prototype.closeDoor = function (x, y, id, callback) {
    id = id || "";
    if ((core.material.icons.animates[id] == null && core.material.icons.npc48[id] == null)
         || core.getBlock(x, y) != null) {
        if (callback) callback();
        return;
    }
    var block = core.getBlockById(id);
    var doorInfo = (block.event || {}).doorInfo;
    if (!doorInfo) {
        if (callback) callback();
        return;
    }

    core.playSound(doorInfo.closeSound);
    var blockInfo = core.getBlockInfo(block);
    var speed = (doorInfo.time || 160) / 4;
    blockInfo.posX = 3;
    core.maps._drawBlockInfo(blockInfo, x, y);

    var cb = function () {
        core.setBlock(id, x, y);
        core.showBlock(x, y);
        if (callback) callback();
    }

    var animate = window.setInterval(function () {
        blockInfo.posX--;
        if (blockInfo.posX < 0) {
            clearInterval(animate);
            delete core.animateFrame.asyncId[animate];
            cb();
            return;
        }
        core.maps._drawBlockInfo(blockInfo, x, y);
    }, core.status.replay.speed == 24 ? 1 : speed / Math.max(core.status.replay.speed, 1));
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = cb;
}

////// 显示图片 //////
events.prototype.showImage = function (code, image, sloc, loc, opacityVal, time, callback) {
    var imageName = null;
    if (typeof image == 'string') {
        imageName = image;
        if (image.endsWith(':x') || image.endsWith(':y') || image.endsWith(':o')) {
            image = image.substring(0, image.length - 2);
        }
        image = core.getMappedName(image);
        image = core.material.images.images[image];
    }
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
    core.drawImage(ctx, imageName == null ? image : imageName, sx, sy, sw, sh, 0, 0, w, h);
    if (time == 0) {
        core.setOpacity(name, opacityVal);
        if (callback) callback();
        return;
    }
    core.setOpacity(name, 0);
    this.moveImage(code, null, opacityVal, null, time, callback);
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
    this.moveImage(code, null, 0, null, time, function () {
        core.deleteCanvas(name);
        if (callback) callback();
    });
}

////// 移动图片 //////
events.prototype.moveImage = function (code, to, opacityVal, moveMode, time, callback) {
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

    if (!time) {
        core.relocateCanvas(name, toX, toY);
        core.setOpacity(toOpacity);
        if (callback) callback();
        return;
    }

    this._moveImage_moving(name, {
        fromX: fromX, fromY: fromY, toX: toX, toY: toY, opacity: opacity, toOpacity: toOpacity,
        moveMode: moveMode, time: time / Math.max(core.status.replay.speed, 1)
    }, callback)
}

events.prototype._moveImage_moving = function (name, moveInfo, callback) {
    var per_time = 10, step = 0, steps = parseInt(moveInfo.time / per_time);
    if (steps <= 0) steps = 1;
    var fromX = moveInfo.fromX, fromY = moveInfo.fromY, toX = moveInfo.toX, toY = moveInfo.toY,
        opacity = moveInfo.opacity, toOpacity = moveInfo.toOpacity;
    var currX = fromX, currY = fromY, currOpacity = opacity;
    var moveFunc = core.applyEasing(moveInfo.moveMode);
    var animate = setInterval(function () {
        step++;
        currOpacity = opacity + (toOpacity - opacity) * moveFunc(step / steps);
        currX = parseInt(fromX + (toX - fromX) * moveFunc(step / steps));
        currY = parseInt(fromY + (toY - fromY) * moveFunc(step / steps));
        core.setOpacity(name, currOpacity);
        core.relocateCanvas(name, currX, currY);
        if (step == steps) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, per_time);
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = callback;
}

////// 旋转图片 //////
events.prototype.rotateImage = function (code, center, angle, moveMode, time, callback) {
    center = center || [];
    var name = "image" + (code + 100);
    if (!core.dymCanvas[name]) {
        if (callback) callback();
        return;
    }
    var canvas = core.dymCanvas[name].canvas;
    var centerX = core.calValue(center[0]), centerY = core.calValue(center[1]);

    var fromAngle = parseFloat(canvas.getAttribute('_angle')) || 0;

    if (!time) {
        core.rotateCanvas(name, fromAngle + angle, centerX, centerY);
        if (callback) callback();
        return;
    }

    var rotateInfo = {
        fromAngle: fromAngle, angle: angle, centerX: centerX, centerY: centerY,
        moveMode: moveMode, time: time / Math.max(core.status.replay.speed, 1)
    }
    this._rotateImage_rotating(name, rotateInfo, callback);
}

events.prototype._rotateImage_rotating = function (name, rotateInfo, callback) {
    var per_time = 10, step = 0, steps = parseInt(rotateInfo.time / per_time);
    if (steps <= 0) steps = 1;
    var moveFunc = core.applyEasing(rotateInfo.moveMode);
    var animate = setInterval(function () {
        step++;
        var currAngle = rotateInfo.fromAngle + rotateInfo.angle * moveFunc(step / steps);
        core.rotateCanvas(name, currAngle, rotateInfo.centerX, rotateInfo.centerY);
        if (step == steps) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, per_time);
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = callback;
}

////// 放缩一张图片 //////
events.prototype.scaleImage = function (code, center, scale, moveMode, time, callback) {
    center = center || [];
    var name = "image" + (code + 100);
    if (!core.dymCanvas[name]) {
        if (callback) callback();
        return;
    }
    var ctx = core.dymCanvas[name];
    var currScale = 1.0;
    if (ctx.canvas.hasAttribute('_scale')) {
        currScale = parseFloat(ctx.canvas.getAttribute('_scale'));
    }
    var ratio = ctx.canvas.hasAttribute('isHD') ? core.domStyle.ratio : 1;
    var width = ctx.canvas.width / ratio, height = ctx.canvas.height / ratio;
    var currLeft = parseFloat(ctx.canvas.getAttribute("_left"));
    var currTop = parseFloat(ctx.canvas.getAttribute("_top"));
    var centerX = core.calValue(center[0]), centerY = core.calValue(center[1]);
    if (centerX == null || centerY == null) {
        centerX = currLeft + width * currScale / 2;
        centerY = currTop + height * currScale / 2;
    }
    var scaleInfo = {
        x: (currLeft - centerX) / currScale,  y: (currTop - centerY) / currScale, centerX: centerX, centerY: centerY,
        width: width, height: height, currScale: currScale, scale: scale, moveMode: moveMode, time: time
    }
    this._scaleImage_scale(ctx, scaleInfo, callback);
}

events.prototype._scaleInfo_scale = function (ctx, scaleInfo, scale) {
    core.resizeCanvas(ctx, scaleInfo.width * scale, scaleInfo.height * scale, true);
    core.relocateCanvas(ctx, scaleInfo.centerX + scaleInfo.x * scale, scaleInfo.centerY + scaleInfo.y * scale);
    ctx.canvas.setAttribute('_scale', scale);
}

events.prototype._scaleImage_scale = function (ctx, scaleInfo, callback) {
    if (!scaleInfo.time) {
        this._scaleInfo_scale(ctx, scaleInfo, scaleInfo.scale);
        if (callback) callback();
        return;
    }

    var per_time = 10, step = 0, steps = parseInt(scaleInfo.time / per_time);
    if (steps <= 0) steps = 1;
    var moveFunc = core.applyEasing(scaleInfo.moveMode);

    var animate = setInterval(function () {
        step++;
        var scale = scaleInfo.currScale + (scaleInfo.scale - scaleInfo.currScale) * moveFunc(step / steps);
        core.events._scaleInfo_scale(ctx, scaleInfo, scale);
        if (step == steps) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, per_time);
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = callback;
}

////// 绘制或取消一张gif图片 //////
events.prototype.showGif = function (name, x, y) {
    name = core.getMappedName(name);
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

////// 淡入淡出音乐 //////
events.prototype.setVolume = function (value, time, callback) {
    var set = function (value) {
        core.musicStatus.designVolume = value;
        if (core.musicStatus.playingBgm)
            core.material.bgms[core.musicStatus.playingBgm].volume = core.musicStatus.userVolume * core.musicStatus.designVolume;
    }
    if (!time || time < 100) {
        set(value);
        if (callback) callback();
        return;
    }
    var currVolume = core.musicStatus.designVolume;
    time /= Math.max(core.status.replay.speed, 1);
    var per_time = 10, step = 0, steps = parseInt(time / per_time);
    if (steps <= 0) steps = 1;
    var animate = setInterval(function () {
        step++;
        set(currVolume + (value - currVolume) * step / steps);
        if (step >= steps) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
    }, per_time);
    
    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = callback;
}

////// 画面震动 //////
events.prototype.vibrate = function (direction, time, speed, power, callback) {
    if (core.isReplaying()) {
        if (callback) callback();
        return;
    }
    if (!time) time = 1000;
    speed = speed || 10;
    power = power || 10;
    var shakeInfo = {duration: parseInt(time / 10), speed: speed, power: power, direction: 1, shake: 0};
    if (direction == 'random') {
        direction = ['horizontal', 'vertical', 'diagonal1', 'diagonal2'][Math.floor(Math.random() * 4)];
    }
    var cb = function () {
        core.addGameCanvasTranslate(0, 0);
        if (callback) callback();
    }
    var animate = setInterval(function () {
        core.events._vibrate_update(shakeInfo);
        switch (direction) {
            case 'vertical': core.addGameCanvasTranslate(0, shakeInfo.shake); break;
            case 'diagonal1': core.addGameCanvasTranslate(shakeInfo.shake, shakeInfo.shake); break;
            case 'diagonal2': core.addGameCanvasTranslate(-shakeInfo.shake, shakeInfo.shake); break;
            default: core.addGameCanvasTranslate(shakeInfo.shake, 0);
        }
        if (shakeInfo.duration === 0 && shakeInfo.shake == 0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            cb();
        }
    }, 10);

    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = cb;
}

events.prototype._vibrate_update = function (shakeInfo) {
    if (shakeInfo.duration >= 1 || shakeInfo.shake != 0) {
        var delta = shakeInfo.speed * shakeInfo.direction / 6;
        if (shakeInfo.duration <= 1 && shakeInfo.shake * (shakeInfo.shake + delta) < 0) {
            shakeInfo.shake = 0;
        } else {
            shakeInfo.shake += delta;
        }
        if (shakeInfo.shake > shakeInfo.power) {
            shakeInfo.direction = -1;
        }
        if (shakeInfo.shake < -shakeInfo.power) {
            shakeInfo.direction = 1;
        }
        if (shakeInfo.duration >= 1) {
            shakeInfo.duration -= 1
        }
    }
}

/////// 使用事件让勇士移动。这个函数将不会触发任何事件 //////
events.prototype.eventMoveHero = function(steps, time, callback) {
    time = time || core.values.moveSpeed;
    var step = 0, moveSteps = (steps||[]).map(function (t) {
        return [t.split(':')[0], parseInt(t.split(':')[1]||"1")];
    }).filter(function (t) {
        return ['up','down','left','right','forward','backward','leftup','leftdown','rightup','rightdown','speed'].indexOf(t[0])>=0
            && !(t[0] == 'speed' && t[1] < 16);
    });
    core.status.heroMoving = -1;
    var _run = function () {
        var cb = function () {
            core.status.heroMoving = 0;
            core.drawHero();
            if (callback) callback();
        }

        var animate=window.setInterval(function() {
            if (moveSteps.length==0) {
                delete core.animateFrame.asyncId[animate];
                clearInterval(animate);
                cb();
            }
            else {
                if (step == 0 && moveSteps[0][0] == 'speed' && moveSteps[0][1] >= 16) {
                    time = moveSteps[0][1];
                    moveSteps.shift();
                    clearInterval(animate);
                    delete core.animateFrame.asyncId[animate];
                    _run();
                }
                else if (core.events._eventMoveHero_moving(++step, moveSteps))
                    step = 0;
            }
        }, core.status.replay.speed == 24 ? 1 : time / 8 / core.status.replay.speed);
    
        core.animateFrame.lastAsyncId = animate;
        core.animateFrame.asyncId[animate] = cb;
    }
    _run();
}

events.prototype._eventMoveHero_moving = function (step, moveSteps) {
    var curr = moveSteps[0];
    var direction = curr[0], x = core.getHeroLoc('x'), y = core.getHeroLoc('y');
    // ------ 前进/后退
    var o = direction == 'backward' ? -1 : 1;
    if (direction == 'forward' || direction == 'backward') direction = core.getHeroLoc('direction');
    var faceDirection = direction;
    if (direction == 'leftup' || direction == 'leftdown') faceDirection = 'left';
    if (direction == 'rightup' || direction == 'rightdown') faceDirection = 'right';
    core.setHeroLoc('direction', direction);
    if (curr[1] <= 0) {
        core.setHeroLoc('direction', faceDirection);
        moveSteps.shift();
        return true;
    }
    if (step <= 4) {
        core.drawHero('leftFoot', 4 * o * step);
    }
    else if (step <= 8) {
        core.drawHero('rightFoot', 4 * o * step);
    }
    if (step == 8) {
        core.setHeroLoc('x', x + o * core.utils.scan2[direction].x, true);
        core.setHeroLoc('y', y + o * core.utils.scan2[direction].y, true);
        core.updateFollowers();
        curr[1]--;
        if (curr[1] <= 0) moveSteps.shift();
        core.setHeroLoc('direction', faceDirection);
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
    var jumpInfo = core.maps.__generateJumpInfo(sx, sy, ex, ey, time || 500);
    jumpInfo.icon = core.material.icons.hero[core.getHeroLoc('direction')];
    jumpInfo.width = core.material.icons.hero.width || 32;
    jumpInfo.height = core.material.icons.hero.height;

    this._jumpHero_doJump(jumpInfo, callback);
}

events.prototype._jumpHero_doJump = function (jumpInfo, callback) {
    var cb = function () {
        core.setHeroLoc('x', jumpInfo.ex);
        core.setHeroLoc('y', jumpInfo.ey);
        core.status.heroMoving = 0;
        core.drawHero();
        if (callback) callback();
    }

    core.status.heroMoving = -1;
    var animate = window.setInterval(function () {
        if (jumpInfo.jump_count > 0)
            core.events._jumpHero_jumping(jumpInfo)
        else {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            cb();
        }
    }, jumpInfo.per_time);

    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = cb;
}

events.prototype._jumpHero_jumping = function (jumpInfo) {
    core.clearMap('hero');
    core.maps.__updateJumpInfo(jumpInfo);
    var x = core.getHeroLoc('x'),
        y = core.getHeroLoc('y');
    var nowx = jumpInfo.px, nowy = jumpInfo.py, width = jumpInfo.width || 32, height = jumpInfo.height;
    core.drawHero('stop', { x: nowx - 32 * x, y: nowy - 32 * y });
}

////// 设置角色行走图 //////
events.prototype.setHeroIcon = function (name, noDraw) {
    name = core.getMappedName(name);
    var img = core.material.images.images[name];
    if (!img) {
        console.error("找不到图片: "+img);
        return;
    }
    if (core.material.images.hero == img) return;
    core.status.hero.image = name;
    core.material.images.hero = img;
    core.material.icons.hero.width = img.width / 4;
    core.material.icons.hero.height = img.height / 4;
    core.control.updateHeroIcon(name);
    if (!noDraw) core.drawHero();
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
    if (core.flags.statusBarItems.indexOf('enableLevelUp')<0 || !core.firstData.levelUp
        || core.status.hero.lv >= core.firstData.levelUp.length) return null;
    // 计算下一个所需要的数值
    var next = (core.firstData.levelUp[core.status.hero.lv] || {});
    var need = core.calValue(next.need);
    if (need == null) return null;
    if (core.status.hero.exp >= need) {
        // 升级
        core.status.hero.lv++;
        if (next.clear) core.status.hero.exp -= need;
        return next.action || [];
    }
    return null;
}

////// 尝试使用道具 //////
events.prototype.tryUseItem = function (itemId) {
    if (itemId == 'book') {
        core.ui.closePanel();
        return core.openBook(false);
    }
    if (itemId == 'fly') {
        core.ui.closePanel();
        return core.useFly(false);
    }
    if (itemId == 'centerFly') {
        core.ui.closePanel();
        return core.ui._drawCenterFly();
    }
    if (core.canUseItem(itemId)) {
        core.ui.closePanel();
        core.useItem(itemId);
    } else {
        core.playSound('操作失败');
        core.drawTip("当前无法使用" + core.material.items[itemId].name, itemId);
    }
}
