/*
actions.js：用户交互的事件的处理
键盘、鼠标、触摸屏事件相关
 */

"use strict";

function actions() {
    this._init();
    this.SIZE = core.__SIZE__;
    this.HSIZE = core.__HALF_SIZE__;
    this.LAST = this.SIZE - 1;
    this.CHOICES_LEFT = 5; // choices
    this.CHOICES_RIGHT = this.LAST - this.CHOICES_LEFT;
}

actions.prototype._init = function () {
    this.actionsdata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.actions;
    this.actions = {};
    // --- onkeyDown注册
    this.registerAction('onkeyDown', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('onkeyDown', '_sys_onkeyDown', this._sys_onkeyDown, 0);
    // --- onkeyUp注册
    this.registerAction('onkeyUp', '_sys_onkeyUp_replay', this._sys_onkeyUp_replay, 100);
    this.registerAction('onkeyUp', '_sys_onkeyUp', this._sys_onkeyUp, 0);
    // --- pressKey注册
    this.registerAction('pressKey', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('pressKey', '_sys_pressKey', this._sys_pressKey, 0);
    // --- keyDown注册
    this.registerAction('keyDown', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('keyDown', '_sys_keyDown_lockControl', this._sys_keyDown_lockControl, 50);
    this.registerAction('keyDown', '_sys_keyDown', this._sys_keyDown, 0);
    // --- keyUp注册
    this.registerAction('keyUp', '_sys_keyUp_replay', this._sys_keyUp_replay, 100);
    this.registerAction('keyUp', '_sys_keyUp_lockControl', this._sys_keyUp_lockControl, 50);
    this.registerAction('keyUp', '_sys_keyUp', this._sys_keyUp, 0);
    // --- ondown注册
    this.registerAction('ondown', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('ondown', '_sys_ondown_paint', this._sys_ondown_paint, 60);
    this.registerAction('ondown', '_sys_ondown_lockControl', this._sys_ondown_lockControl, 30);
    this.registerAction('ondown', '_sys_ondown', this._sys_ondown, 0);
    // --- onmove注册
    this.registerAction('onmove', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('onmove', '_sys_onmove_paint', this._sys_onmove_paint, 50);
    this.registerAction('onmove', '_sys_onmove_choices', this._sys_onmove_choices, 30);
    this.registerAction('onmove', '_sys_onmove', this._sys_onmove, 0);
    // --- onup注册
    this.registerAction('onup', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('onup', '_sys_onup_paint', this._sys_onup_paint, 50);
    this.registerAction('onup', '_sys_onup', this._sys_onup, 0);
    // --- onclick注册
    this.registerAction('onclick', '_sys_checkReplay', this._sys_checkReplay, 100);
    this.registerAction('onclick', '_sys_onclick_lockControl', this._sys_onclick_lockControl, 50);
    this.registerAction('onclick', '_sys_onclick', this._sys_onclick, 0);
    // --- onmousewheel注册
    this.registerAction('onmousewheel', '_sys_onmousewheel', this._sys_onmousewheel, 0);
    // --- keyDownCtrl注册
    this.registerAction('keyDownCtrl', '_sys_keyDownCtrl', this._sys_keyDownCtrl, 0);
    // --- longClick注册
    this.registerAction('longClick', '_sys_longClick_lockControl', this._sys_longClick_lockControl, 50);
    this.registerAction('longClick', '_sys_longClick', this._sys_longClick, 0);
    // --- onStatusBarClick注册
    this.registerAction('onStatusBarClick', '_sys_onStatusBarClick', this._sys_onStatusBarClick, 0);

}

//////  注册一个用户交互行为 //////
/*
 * 此函数将注册一个用户交互行为。
 * action：要注册的交互类型，如 ondown, onclick, keyDown 等等。
 * name：你的自定义名称，可被注销使用；同名重复注册将后者覆盖前者。
 * func：执行函数。
 * priority：优先级；优先级高的将会被执行。此项可不填，默认为0。
 * 返回：如果func返回true，则不会再继续执行其他的交互函数；否则会继续执行其他的交互函数。
 */
actions.prototype.registerAction = function (action, name, func, priority) {
    if (!name || !func)
        return;
    priority = priority || 0;
    if (!this.actions[action]) {
        this.actions[action] = [];
    }
    this.unregisterAction(action, name);
    this.actions[action].push(
        {"action": action, "name": name, "func": func, "priority": priority}
    );
    this.actions[action] = this.actions[action].sort(function (a, b) {
        return b.priority - a.priority;
    });
}

////// 注销一个用户交互行为 //////
actions.prototype.unregisterAction = function (action, name) {
    if (!this.actions[action]) return;
    this.actions[action] = this.actions[action].filter(function (x) {
        return x.name != name;
    });
}

////// 执行一个用户交互行为 //////
actions.prototype.doRegisteredAction = function (action) {
    var actions = this.actions[action];
    if (!actions) return false;
    for (var i = 0; i < actions.length; ++i) {
        try {
            if (core.doFunc.apply(core, [actions[i].func, this].concat(Array.prototype.slice.call(arguments, 1))))
                return true;
        }
        catch (e) {
            main.log(e);
            main.log("ERROR in actions["+actions[i].name+"].");
        }
    }
    return false;
}

actions.prototype._checkReplaying = function () {
    if (core.isReplaying() &&
        ['save','book','book-detail','viewMaps','toolbox','equipbox','text'].indexOf(core.status.event.id)<0)
        return true;
    return false;
}

////// 检查是否在录像播放中，如果是，则停止交互
actions.prototype._sys_checkReplay = function () {
    if (this._checkReplaying()) return true;
}

////// 按下某个键时 //////
actions.prototype.onkeyDown = function (e) {
    this.doRegisteredAction('onkeyDown', e);
}

actions.prototype._sys_onkeyDown = function (e) {
    core.status.holdingKeys = core.status.holdingKeys || []
    var isArrow = {37: true, 38: true, 39: true, 40: true}[e.keyCode]
    if (isArrow && !core.status.lockControl) {
        for (var ii = 0; ii < core.status.holdingKeys.length; ii++) {
            if (core.status.holdingKeys[ii] === e.keyCode) {
                return;
            }
        }
        if (e.preventDefault) e.preventDefault();
        core.status.holdingKeys.push(e.keyCode);
        this.pressKey(e.keyCode);
    } else {
        if (e.keyCode == 17) core.status.ctrlDown = true;
        this.keyDown(e.keyCode);
    }
}

////// 放开某个键时 //////
actions.prototype.onkeyUp = function (e) {
    this.doRegisteredAction('onkeyUp', e);
}

actions.prototype._sys_onkeyUp_replay = function (e) {
    if (this._checkReplaying()) {
        if (e.keyCode == 27) // ESCAPE
            core.stopReplay();
        else if (e.keyCode == 90) // Z
            core.speedDownReplay();
        else if (e.keyCode == 88) // X
            core.speedUpReplay();
        else if (e.keyCode == 32) // SPACE
            core.triggerReplay();
        else if (e.keyCode == 65) // A
            core.rewindReplay();
        else if (e.keyCode == 83) // S
            core.saveReplay();
        else if (e.keyCode == 67) // C
            core.bookReplay();
        else if (e.keyCode == 33 || e.keyCode == 34) // PgUp/PgDn
            core.viewMapReplay();
        else if (e.keyCode == 78) // N
            core.stepReplay();
        else if (e.keyCode == 84) // T
            core.toolboxReplay();
        else if (e.keyCode == 81) // Q
            core.equipboxReplay();
        else if (e.keyCode == 66) // B
            core.drawStatistics();
        else if (e.keyCode >= 49 && e.keyCode <= 51) // 1-3
            core.setReplaySpeed(e.keyCode - 48);
        else if (e.keyCode == 52) // 4
            core.setReplaySpeed(6);
        else if (e.keyCode == 53) // 5
            core.setReplaySpeed(12);
        else if (e.keyCode == 54) // 6
            core.setReplaySpeed(24);
        return true;
    }
}

actions.prototype._sys_onkeyUp = function (e) {
    var isArrow = {37: true, 38: true, 39: true, 40: true}[e.keyCode]
    if (isArrow && !core.status.lockControl) {
        for (var ii = 0; ii < core.status.holdingKeys.length; ii++) {
            if (core.status.holdingKeys[ii] === e.keyCode) {
                core.status.holdingKeys = core.status.holdingKeys.slice(0, ii).concat(core.status.holdingKeys.slice(ii + 1));
                if (ii === core.status.holdingKeys.length && core.status.holdingKeys.length !== 0) core.pressKey(core.status.holdingKeys.slice(-1)[0]);
                break;
            }
        }
        if (e.preventDefault) e.preventDefault();
        this.keyUp(e.keyCode, e.altKey);
    } else {
        if (e.keyCode == 17) core.status.ctrlDown = false;
        this.keyUp(e.keyCode, e.altKey);
    }
}

////// 按住某个键时 //////
actions.prototype.pressKey = function (keyCode) {
    this.doRegisteredAction('pressKey', keyCode);
}

actions.prototype._sys_pressKey = function (keyCode) {
    if (keyCode === core.status.holdingKeys.slice(-1)[0]) {
        this.keyDown(keyCode);
        window.setTimeout(function () {
            core.pressKey(keyCode);
        }, 30);
    }
}

////// 根据按下键的code来执行一系列操作 //////
actions.prototype.keyDown = function (keyCode) {
    this.doRegisteredAction('keyDown', keyCode);
}

actions.prototype._sys_keyDown_lockControl = function (keyCode) {
    if (!core.status.lockControl) return false;
    // Ctrl跳过对话
    if (keyCode == 17) {
        this.keyDownCtrl();
        return true;
    }
    switch (core.status.event.id) {
        case 'action':
            this._keyDownAction(keyCode);
            break;
        case 'book':
            this._keyDownBook(keyCode);
            break;
        case 'fly':
            this._keyDownFly(keyCode);
            break;
        case 'viewMaps':
            this._keyDownViewMaps(keyCode);
            break;
        case 'equipbox':
            this._keyDownEquipbox(keyCode);
            break;
        case 'toolbox':
            this._keyDownToolbox(keyCode);
            break;
        case 'save':
        case 'load':
        case 'replayLoad':
        case 'replayRemain':
            this._keyDownSL(keyCode);
            break;
        case 'shop':
            this._keyDownShop(keyCode);
            break;
        case 'selectShop':
        case 'switchs':
        case 'settings':
        case 'syncSave':
        case 'syncSelect':
        case 'localSaveSelect':
        case 'storageRemove':
        case 'replay':
        case 'gameInfo':
            this._keyDownChoices(keyCode);
            break;
        case 'cursor':
            this._keyDownCursor(keyCode);
            break;
    }
    return true;
}

actions.prototype._sys_keyDown = function (keyCode) {
    if (!core.status.played)
        return true;
    switch (keyCode) {
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
    return true;
}

////// 根据放开键的code来执行一系列操作 //////
actions.prototype.keyUp = function (keyCode, altKey, fromReplay) {
    this.doRegisteredAction('keyUp', keyCode, altKey, fromReplay);
}

actions.prototype._sys_keyUp_replay = function (keyCode, altKey, fromReplay) {
    if (!fromReplay && this._checkReplaying()) return true;
}

actions.prototype._sys_keyUp_lockControl = function (keyCode, altKey) {
    if (!core.status.lockControl) return false;

    var ok = function () {
        return keyCode == 27 || keyCode == 88 || keyCode == 13 || keyCode == 32 || keyCode == 67;
    }

    core.status.holdingKeys = [];
    switch (core.status.event.id) {
        case 'text':
            ok() && core.drawText();
            break;
        case 'confirmBox':
            this._keyUpConfirmBox(keyCode);
            break;
        case 'action':
            this._keyUpAction(keyCode);
            break;
        case 'about':
            ok() && core.closePanel();
            break;
        case 'help':
            ok() && core.closePanel();
            break;
        case 'book':
            this._keyUpBook(keyCode);
            break;
        case 'book-detail':
            ok() && this._clickBookDetail();
            break;
        case 'fly':
            this._keyUpFly(keyCode);
            break;
        case 'viewMaps':
            this._keyUpViewMaps(keyCode);
            break;
        case 'shop':
            this._keyUpShop(keyCode);
            break;
        case 'selectShop':
            this._keyUpQuickShop(keyCode);
            break;
        case 'toolbox':
            this._keyUpToolbox(keyCode);
            break;
        case 'equipbox':
            this._keyUpEquipbox(keyCode, altKey);
            break;
        case 'save':
        case 'load':
        case 'replayLoad':
        case 'replayRemain':
            this._keyUpSL(keyCode);
            break;
        case 'keyBoard':
            ok() && core.closePanel();
            break;
        case 'switchs':
            this._keyUpSwitchs(keyCode);
            break;
        case 'settings':
            this._keyUpSettings(keyCode);
            break;
        case 'syncSave':
            this._keyUpSyncSave(keyCode);
            break;
        case 'syncSelect':
            this._keyUpSyncSelect(keyCode);
            break;
        case 'localSaveSelect':
            this._keyUpLocalSaveSelect(keyCode);
            break;
        case 'storageRemove':
            this._keyUpStorageRemove(keyCode);
            break;
        case 'cursor':
            this._keyUpCursor(keyCode);
            break;
        case 'replay':
            this._keyUpReplay(keyCode);
            break;
        case 'gameInfo':
            this._keyUpGameInfo(keyCode);
            break;
        case 'centerFly':
            this._keyUpCenterFly(keyCode);
            break;
        case 'paint':
            this._keyUpPaint(keyCode);
            break;
    }
    return true;
}

actions.prototype._sys_keyUp = function (keyCode, altKey) {
    if (!core.status.played)
        return true;
    this.actionsdata.onKeyUp(keyCode, altKey);
    if (core.status.automaticRoute && core.status.automaticRoute.autoHeroMove) {
        core.stopAutomaticRoute();
    }
    core.status.heroStop = true;
    return true;
}

////// 点击（触摸）事件按下时 //////
actions.prototype.ondown = function (loc) {
    var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
    var px = parseInt(loc.x / core.domStyle.scale), py = parseInt(loc.y / core.domStyle.scale);
    this.doRegisteredAction('ondown', x, y, px, py);
}

actions.prototype._sys_ondown_paint = function (x, y, px, py) {
    // 画板
    if (core.status.played && (core.status.event || {}).id == 'paint') {
        this._ondownPaint(px, py);
        return true;
    }
}

actions.prototype._sys_ondown_lockControl = function (x, y, px, py) {
    if (core.status.played && !core.status.lockControl) return false;

    // --- wait事件也要提供px和py
    if (core.status.event.id == 'action' && core.status.event.data.type == 'wait') {
        core.setFlag('type', 1);
        core.setFlag('x', x);
        core.setFlag('y', y);
        core.setFlag('px', px);
        core.setFlag('py', py);
        core.status.route.push("input:" + (1000000 + 1000 * px + py));
        core.events.__action_wait_afterGet(core.status.event.data.current);
        core.doAction();
    }
    else {
        core.actions.onclick(x, y, []);
    }

    // --- 长按判定
    if (core.timeout.onDownTimeout == null) {
        core.timeout.onDownTimeout = setTimeout(function () {
            if (core.interval.onDownInterval == null) {
                core.interval.onDownInterval = setInterval(function () {
                    if (!core.actions.longClick(x, y, true)) {
                        clearInterval(core.interval.onDownInterval);
                        core.interval.onDownInterval = null;
                    }
                }, 40)
            }
        }, 500);
    }
    return true;
}

actions.prototype._sys_ondown = function (x, y, px, py) {
    core.status.downTime = new Date();
    core.deleteCanvas('route');
    var pos = {'x': x, 'y': y}
    core.status.stepPostfix = [];
    core.status.stepPostfix.push(pos);
    core.fillPosWithPoint(pos);
}

////// 当在触摸屏上滑动时 //////
actions.prototype.onmove = function (loc) {
    var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
    var px = parseInt(loc.x / core.domStyle.scale), py = parseInt(loc.y / core.domStyle.scale);
    this.doRegisteredAction('onmove', x, y, px, py);
}

actions.prototype._sys_onmove_paint = function (x, y, px, py) {
    // 画板
    if (core.status.played && (core.status.event || {}).id == 'paint') {
        core.actions._onmovePaint(px, py);
        return true;
    }
}

actions.prototype._sys_onmove_choices = function (x, y) {
    if (!core.status.lockControl) return false;

    switch (core.status.event.id) {
        case 'action':
            if (core.status.event.data.type != 'choices') break;
        case 'shop':
        case 'selectShop':
        case 'switchs':
        case 'settings':
        case 'syncSave':
        case 'syncSelect':
        case 'localSaveSelect':
        case 'storageRemove':
        case 'replay':
        case 'gameInfo':
            this._onMoveChoices(x, y);
            return true;
        default:
            break;
    }
    return false;
}

actions.prototype._sys_onmove = function (x, y) {
    if ((core.status.stepPostfix || []).length > 0) {
        var pos = {'x': x, 'y': y};
        var pos0 = core.status.stepPostfix[core.status.stepPostfix.length - 1];
        var directionDistance = [pos.y - pos0.y, pos0.x - pos.x, pos0.y - pos.y, pos.x - pos0.x];
        var max = 0, index = 4;
        for (var ii = 0; ii < 4; ii++) {
            if (directionDistance[ii] > max) {
                index = ii;
                max = directionDistance[ii];
            }
        }
        pos = [{'x': 0, 'y': 1}, {'x': -1, 'y': 0}, {'x': 0, 'y': -1}, {'x': 1, 'y': 0}, false][index]
        if (pos) {
            pos.x += pos0.x;
            pos.y += pos0.y;
            core.status.stepPostfix.push(pos);
            core.fillPosWithPoint(pos);
        }
    }
    return true;
}

////// 当点击（触摸）事件放开时 //////
actions.prototype.onup = function (loc) {
    var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
    var px = parseInt(loc.x / core.domStyle.scale), py = parseInt(loc.y / core.domStyle.scale);
    this.doRegisteredAction('onup', x, y, px, py);
}

actions.prototype._sys_onup_paint = function () {
    // 画板
    if (core.status.played && (core.status.event || {}).id == 'paint') {
        this._onupPaint();
        return true;
    }
}

actions.prototype._sys_onup = function () {
    clearTimeout(core.timeout.onDownTimeout);
    core.timeout.onDownTimeout = null;
    clearInterval(core.interval.onDownInterval);
    core.interval.onDownInterval = null;

    if ((core.status.stepPostfix || []).length == 0) return false;

    var stepPostfix = [];
    var direction = {'0': {'1': 'down', '-1': 'up'}, '-1': {'0': 'left'}, '1': {'0': 'right'}};
    for (var ii = 1; ii < core.status.stepPostfix.length; ii++) {
        var pos0 = core.status.stepPostfix[ii - 1];
        var pos = core.status.stepPostfix[ii];
        stepPostfix.push({
            'direction': direction[pos.x - pos0.x][pos.y - pos0.y],
            'x': pos.x + parseInt(core.bigmap.offsetX / 32),
            'y': pos.y + parseInt(core.bigmap.offsetY / 32)
        });
    }
    var posx = core.status.stepPostfix[0].x;
    var posy = core.status.stepPostfix[0].y;
    core.status.stepPostfix = [];
    if (!core.status.lockControl) {
        core.clearMap('ui');
    }

    // 长按
    if (!core.status.lockControl && stepPostfix.length == 0 && core.status.downTime != null && new Date() - core.status.downTime >= 1000) {
        core.actions.longClick(posx, posy);
    }
    else {
        //posx,posy是寻路的目标点,stepPostfix是后续的移动
        core.actions.onclick(posx, posy, stepPostfix);
    }
    core.status.downTime = null;
    return true;
}

////// 获得点击事件相对左上角的坐标 //////
actions.prototype._getClickLoc = function (x, y) {

    var statusBar = {'x': 0, 'y': 0};
    var size = 32;
    size = size * core.domStyle.scale;

    if (core.domStyle.isVertical) {
        statusBar.x = 3;
        statusBar.y = core.dom.statusBar.offsetHeight + 3;
    }
    else {
        statusBar.x = core.dom.statusBar.offsetWidth + 3;
        statusBar.y = 3;
    }

    var left = core.dom.gameGroup.offsetLeft + statusBar.x;
    var top = core.dom.gameGroup.offsetTop + statusBar.y;
    var loc = {'x': x - left, 'y': y - top, 'size': size};
    return loc;
}

////// 具体点击屏幕上(x,y)点时，执行的操作 //////
actions.prototype.onclick = function (x, y, stepPostfix) {
    // console.log("Click: (" + x + "," + y + ")");
    return this.doRegisteredAction('onclick', x, y, stepPostfix || []);
}

actions.prototype._sys_onclick_lockControl = function (x, y) {
    if (!core.status.lockControl) return false;
    switch (core.status.event.id) {
        case 'centerFly':
            this._clickCenterFly(x, y);
            break;
        case 'book':
            this._clickBook(x, y);
            break;
        case 'book-detail':
            this._clickBookDetail(x, y);
            break;
        case 'fly':
            this._clickFly(x, y);
            break;
        case 'viewMaps':
            this._clickViewMaps(x, y);
            break;
        case 'switchs':
            this._clickSwitchs(x, y);
            break;
        case 'settings':
            this._clickSettings(x, y);
            break;
        case 'shop':
            this._clickShop(x, y);
            break;
        case 'selectShop':
            this._clickQuickShop(x, y);
            break;
        case 'equipbox':
            this._clickEquipbox(x, y);
            break;
        case 'toolbox':
            this._clickToolbox(x, y);
            break;
        case 'save':
        case 'load':
        case 'replayLoad':
        case 'replayRemain':
            this._clickSL(x, y);
            break;
        case 'confirmBox':
            this._clickConfirmBox(x, y);
            break;
        case 'keyBoard':
            this._clickKeyBoard(x, y);
            break;
        case 'action':
            this._clickAction(x, y);
            break;
        case 'text':
            core.drawText();
            break;
        case 'syncSave':
            this._clickSyncSave(x, y);
            break;
        case 'syncSelect':
            this._clickSyncSelect(x, y);
            break;
        case 'localSaveSelect':
            this._clickLocalSaveSelect(x, y);
            break;
        case 'storageRemove':
            this._clickStorageRemove(x, y);
            break;
        case 'cursor':
            this._clickCursor(x, y);
            break;
        case 'replay':
            this._clickReplay(x, y);
            break;
        case 'gameInfo':
            this._clickGameInfo(x, y);
            break;
        case 'about':
        case 'help':
            core.ui.closePanel();
            break;
    }
    return true;
}

actions.prototype._sys_onclick = function (x, y, stepPostfix) {
    // 寻路
    core.setAutomaticRoute(x + parseInt(core.bigmap.offsetX / 32), y + parseInt(core.bigmap.offsetY / 32), stepPostfix);
    return true;
}

////// 滑动鼠标滚轮时的操作 //////
actions.prototype.onmousewheel = function (direct) {
    this.doRegisteredAction('onmousewheel', direct);
}

actions.prototype._sys_onmousewheel = function (direct) {
    // 向下滚动是 -1 ,向上是 1

    if (this._checkReplaying()) {
        // 滚轮控制速度
        if (direct == 1) core.speedUpReplay();
        if (direct == -1) core.speedDownReplay();
        return;
    }

    // 楼层飞行器
    if (core.status.lockControl && core.status.event.id == 'fly') {
        if (direct == 1) core.ui.drawFly(this._getNextFlyFloor(1));
        if (direct == -1) core.ui.drawFly(this._getNextFlyFloor(-1));
        return;
    }

    // 怪物手册
    if (core.status.lockControl && core.status.event.id == 'book') {
        if (direct == 1) core.ui.drawBook(core.status.event.data - this.HSIZE);
        if (direct == -1) core.ui.drawBook(core.status.event.data + this.HSIZE);
        return;
    }

    // 存读档
    if (core.status.lockControl && (core.status.event.id == 'save' || core.status.event.id == 'load')) {
        var index = core.status.event.data.page*10+core.status.event.data.offset;
        if (direct == 1) core.ui.drawSLPanel(index - 10);
        if (direct == -1) core.ui.drawSLPanel(index + 10);
        return;
    }

    // 浏览地图
    if (core.status.lockControl && core.status.event.id == 'viewMaps') {
        if (direct == 1) this._clickViewMaps(this.HSIZE, this.HSIZE - 3);
        if (direct == -1) this._clickViewMaps(this.HSIZE, this.HSIZE + 3);
        return;
    }

    // wait事件
    if (core.status.lockControl && core.status.event.id == 'action' && core.status.event.data.type == 'wait') {
        core.setFlag('type', 0);
        var keycode = direct == 1 ? 33 : 34;
        core.setFlag('keycode', keycode);
        core.status.route.push("input:" + keycode);
        core.events.__action_wait_afterGet(core.status.event.data.current);
        core.doAction();
        return;
    }

}

////// 长按Ctrl键时 //////
actions.prototype.keyDownCtrl = function () {
    this.doRegisteredAction('keyDownCtrl');
}

actions.prototype._sys_keyDownCtrl = function () {
    if (core.status.event.id == 'text') {
        core.drawText();
        return true;
    }
    if (core.status.event.id == 'action' && core.status.event.data.type == 'text') {
        core.doAction();
        return true;
    }
    if (core.status.event.id == 'action' && core.status.event.data.type == 'sleep'
        && !core.status.event.data.current.noSkip) {
        if (core.timeout.sleepTimeout && !core.hasAsync()) {
            clearTimeout(core.timeout.sleepTimeout);
            core.timeout.sleepTimeout = null;
            core.doAction();
        }
        return true;
    }
}

////// 长按 //////
actions.prototype.longClick = function (x, y, fromEvent) {
    if (!core.isPlaying()) return false;
    return this.doRegisteredAction('longClick', x, y, fromEvent);
}

actions.prototype._sys_longClick_lockControl = function (x, y) {
    if (!core.status.lockControl) return false;
    if (core.status.event.id == 'text') {
        core.drawText();
        return true;
    }
    if (core.status.event.id == 'action' && core.status.event.data.type == 'text') {
        core.doAction();
        return true;
    }
    // 长按楼传器的箭头可以快速翻页
    if (core.status.event.id == 'fly') {
        if ((x == this.SIZE-2 || x == this.SIZE-3) && (y == this.HSIZE - 1 || y == this.HSIZE+3)) {
            this._clickFly(x, y);
            return true;
        }
    }
    // 长按SL上下页快速翻页
    if (["save","load","replayLoad","replayRemain"].indexOf(core.status.event.id) >= 0) {
        if ([this.HSIZE-2, this.HSIZE-3, this.HSIZE+2, this.HSIZE+3].indexOf(x) >= 0 && y == this.LAST) {
            this._clickSL(x, y);
            return true;
        }
    }
    // 长按商店连续购买
    if (core.status.event.id == 'shop' && x >= this.CHOICES_LEFT && x <= this.CHOICES_RIGHT) {
        return this._clickShop(x, y);
    }
    // 长按可以跳过等待事件
    if (core.status.event.id == 'action' && core.status.event.data.type == 'sleep'
        && !core.status.event.data.current.noSkip) {
        if (core.timeout.sleepTimeout && !core.hasAsync()) {
            clearTimeout(core.timeout.sleepTimeout);
            core.timeout.sleepTimeout = null;
            core.doAction();
            return true;
        }
    }
    return false;
}

actions.prototype._sys_longClick = function (x, y, fromEvent) {
    if (!core.status.lockControl && !fromEvent) {
        // 虚拟键盘
        core.waitHeroToStop(function () {
            core.ui.drawKeyBoard();
        });
        return true;
    }
    return false;
}

actions.prototype.onStatusBarClick = function (e) {
    if (!core.isPlaying()) return false;
    var left = core.dom.gameGroup.offsetLeft + 3;
    var top = core.dom.gameGroup.offsetTop + 3;
    var px = parseInt((e.clientX - left) / core.domStyle.scale), py = parseInt((e.clientY - top) / core.domStyle.scale);
    return this.doRegisteredAction('onStatusBarClick', px, py);
}

actions.prototype._sys_onStatusBarClick = function (px, py) {
    if (this.actionsdata.onStatusBarClick)
        return this.actionsdata.onStatusBarClick(px, py);
}

/////////////////// 在某个界面时的按键点击效果 ///////////////////

// 数字键快速选择选项
actions.prototype._selectChoices = function (length, keycode, callback) {
    var topIndex = this.HSIZE - parseInt((length - 1) / 2) + (core.status.event.ui.offset || 0);
    if (keycode == 13 || keycode == 32 || keycode == 67) {
        callback.apply(this, [this.HSIZE, topIndex + core.status.event.selection]);
    }
    //左右方向键调整 音量 行走速度
    if(core.status.event.id == "switchs" && (core.status.event.selection == 2 || core.status.event.selection == 3))
    {
        if (keycode == 37) callback.apply(this, [this.HSIZE - 2, topIndex + core.status.event.selection]);
        if (keycode == 39) callback.apply(this, [this.HSIZE + 2, topIndex + core.status.event.selection]);
    }

    if (keycode >= 49 && keycode <= 57) {
        var index = keycode - 49;
        if (index < length) {
            callback.apply(this, [this.HSIZE, topIndex + index]);
        }
    }
}

// 上下键调整选项
actions.prototype._keyDownChoices = function (keycode) {
    if (keycode == 38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode == 40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

// 移动光标
actions.prototype._onMoveChoices = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;

    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);

    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        if (selection == core.status.event.selection) return;
        core.status.event.selection = selection;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 点击中心对称飞行器时
actions.prototype._clickCenterFly = function (x, y) {
    var posX = core.status.event.data.posX, posY = core.status.event.data.posY;
    core.ui.closePanel();
    if (x == posX && y == posY) {
        if (core.canUseItem('centerFly')) {
            core.useItem('centerFly');
        }
        else {
            core.drawTip('当前不能使用中心对称飞行器');
        }
    }
}

actions.prototype._keyUpCenterFly = function (keycode) {
    core.ui.closePanel();
    if (keycode == 51 || keycode == 13 || keycode == 32 || keycode == 67) {
        if (core.canUseItem('centerFly')) {
            core.useItem('centerFly');
        }
        else {
            core.drawTip('当前不能使用中心对称飞行器');
        }
    }
}

////// 点击确认框时 //////
actions.prototype._clickConfirmBox = function (x, y) {
    if ((x == this.HSIZE-2 || x == this.HSIZE-1) && y == this.HSIZE+1 && core.status.event.data.yes)
        core.status.event.data.yes();
    if ((x == this.HSIZE+2 || x == this.HSIZE+1) && y == this.HSIZE+1 && core.status.event.data.no)
        core.status.event.data.no();
}

////// 键盘操作确认框时 //////
actions.prototype._keyUpConfirmBox = function (keycode) {
    if (keycode == 37) {
        core.status.event.selection = 0;
        core.ui.drawConfirmBox(core.status.event.ui, core.status.event.data.yes, core.status.event.data.no);
        return;
    }

    if (keycode == 39) {
        core.status.event.selection = 1;
        core.ui.drawConfirmBox(core.status.event.ui, core.status.event.data.yes, core.status.event.data.no);
        return;
    }

    if (keycode == 13 || keycode == 32 || keycode == 67) {
        if (core.status.event.selection == 0 && core.status.event.data.yes) {
            core.status.event.selection = null;
            core.status.event.data.yes();
            return;
        }
        if (core.status.event.selection == 1 && core.status.event.data.no) {
            core.status.event.selection = null;
            core.status.event.data.no();
            return;
        }
    }
}

////// 自定义事件时的点击操作 //////
actions.prototype._clickAction = function (x, y) {
    if (core.status.event.data.type == 'text') {

        // 打字机效果显示全部文字
        if (core.status.event.interval != null) {
            core.insertAction({"type": "text", "text": core.status.event.ui, "showAll": true});
        }

        // 文字
        core.doAction();
        return;
    }

    if (core.status.event.data.type == 'choices') {
        // 选项
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length == 0) return;
        if (x >= this.CHOICES_LEFT && x <= this.CHOICES_RIGHT) {
            var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
            if (y >= topIndex && y < topIndex + choices.length) {
                // 选择
                core.status.route.push("choices:" + (y - topIndex));
                core.insertAction(choices[y - topIndex].action);
                core.doAction();
            }
        }
        return;
    }

    if (core.status.event.data.type == 'confirm') {
        if ((x == this.HSIZE-2 || x == this.HSIZE-1) && y == this.HSIZE+1) {
            core.status.route.push("choices:0");
            core.insertAction(core.status.event.ui.yes);
            core.doAction();
        }
        else if ((x == this.HSIZE+2 || x == this.HSIZE+1) && y == this.HSIZE+1) {
            core.status.route.push("choices:1");
            core.insertAction(core.status.event.ui.no);
            core.doAction();
        }
        return;
    }
}

////// 自定义事件时，按下某个键的操作 //////
actions.prototype._keyDownAction = function (keycode) {
    if (core.status.event.data.type == 'choices') {
        this._keyDownChoices(keycode);
        return;
    }
    if (core.status.event.data.type == 'confirm' && (keycode == 37 || keycode == 39)) {
        core.status.event.selection = 1 - core.status.event.selection;
        core.drawConfirmBox(core.status.event.ui.text);
        return;
    }
}

////// 自定义事件时，放开某个键的操作 //////
actions.prototype._keyUpAction = function (keycode) {
    if (core.status.event.data.type == 'text' && (keycode == 13 || keycode == 32 || keycode == 67)) {
        // 打字机效果显示全部文字
        if (core.status.event.interval != null) {
            core.insertAction({"type": "text", "text": core.status.event.ui, "showAll": true});
        }
        core.doAction();
        return;
    }
    if (core.status.event.data.type == 'wait') {
        core.setFlag('type', 0);
        core.setFlag('keycode', keycode);
        core.status.route.push("input:" + keycode);
        core.events.__action_wait_afterGet(core.status.event.data.current);
        core.doAction();
        return;
    }
    if (core.status.event.data.type == 'choices') {
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length > 0) {
            this._selectChoices(choices.length, keycode, this._clickAction);
        }
        return;
    }
    if (core.status.event.data.type == 'confirm'&& (keycode == 13 || keycode == 32 || keycode == 67)) {
        core.status.route.push("choices:" + core.status.event.selection);
        if (core.status.event.selection == 0)
            core.insertAction(core.status.event.ui.yes);
        else core.insertAction(core.status.event.ui.no);
        core.doAction();
        return;
    }
}

////// 怪物手册界面的点击操作 //////
actions.prototype._clickBook = function (x, y) {
    // 上一页
    if ((x == this.HSIZE-2 || x == this.HSIZE-3) && y == this.LAST) {
        core.ui.drawBook(core.status.event.data - this.HSIZE);
        return;
    }
    // 下一页
    if ((x == this.HSIZE+2 || x == this.HSIZE+3) && y == this.LAST) {
        core.ui.drawBook(core.status.event.data + this.HSIZE);
        return;
    }
    // 返回
    if (x >= this.LAST-2 && y == this.LAST) {
        if (core.events.recoverEvents(core.status.event.interval)) {
            return;
        }
        else if (core.status.event.ui != null) {
            core.status.boxAnimateObjs = [];
            core.ui.drawMaps(core.status.event.ui);
        }
        else core.ui.closePanel();
        return;
    }
    // 怪物信息
    var data = core.status.event.data;
    if (data != null && y < this.LAST) {
        var pageinfo = core.ui._drawBook_pageinfo();
        var per_page = pageinfo.per_page, page = parseInt(data / per_page);
        var u = this.LAST / per_page;
        for (var i = 0; i < per_page; ++i) {
            if (y >= u*i && y < u*(i+1)) {
                var index = per_page * page + i;
                core.ui.drawBook(index);
                core.ui.drawBookDetail(index);
                break;
            }
        }
        return;
    }
    return;
}

////// 怪物手册界面时，按下某个键的操作 //////
actions.prototype._keyDownBook = function (keycode) {
    if (keycode == 37) core.ui.drawBook(core.status.event.data - this.HSIZE);
    if (keycode == 38) core.ui.drawBook(core.status.event.data - 1);
    if (keycode == 39) core.ui.drawBook(core.status.event.data + this.HSIZE);
    if (keycode == 40) core.ui.drawBook(core.status.event.data + 1);
    if (keycode == 33) core.ui.drawBook(core.status.event.data - this.HSIZE);
    if (keycode == 34) core.ui.drawBook(core.status.event.data + this.HSIZE);
    return;
}

////// 怪物手册界面时，放开某个键的操作 //////
actions.prototype._keyUpBook = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        if (core.events.recoverEvents(core.status.event.interval)) {
            return;
        }
        else if (core.status.event.ui != null) {
            core.status.boxAnimateObjs = [];
            core.ui.drawMaps(core.status.event.ui);
        }
        else core.ui.closePanel();
        return;
    }
    if (keycode == 13 || keycode == 32 || keycode == 67) {
        var data = core.status.event.data;
        if (data != null) {
            core.ui.drawBookDetail(data);
        }
        return;
    }
}

////// 怪物手册属性显示界面时的点击操作 //////
actions.prototype._clickBookDetail = function () {
    core.clearMap('data');
    core.status.event.id = 'book';
}

////// 楼层传送器界面时的点击操作 //////
actions.prototype._clickFly = function (x, y) {
    if ((x == this.SIZE-2 || x == this.SIZE-3) && y == this.HSIZE+3) core.ui.drawFly(this._getNextFlyFloor(-1));
    if ((x == this.SIZE-2 || x == this.SIZE-3) && y == this.HSIZE-1) core.ui.drawFly(this._getNextFlyFloor(1));
    if ((x == this.SIZE-2 || x == this.SIZE-3) && y == this.HSIZE+4) core.ui.drawFly(this._getNextFlyFloor(-10));
    if ((x == this.SIZE-2 || x == this.SIZE-3) && y == this.HSIZE-2) core.ui.drawFly(this._getNextFlyFloor(10));
    if (x >= this.HSIZE-1 && x <= this.HSIZE+1 && y == this.LAST) core.ui.closePanel();
    if (x >= 0 && x <= this.HSIZE+3 && y >= 3 && y <= this.LAST - 1)
        core.flyTo(core.floorIds[core.status.event.data]);
    return;
}

////// 楼层传送器界面时，按下某个键的操作 //////
actions.prototype._keyDownFly = function (keycode) {
    if (keycode == 37) core.ui.drawFly(this._getNextFlyFloor(-10));
    else if (keycode == 38) core.ui.drawFly(this._getNextFlyFloor(1));
    else if (keycode == 39) core.ui.drawFly(this._getNextFlyFloor(10));
    else if (keycode == 40) core.ui.drawFly(this._getNextFlyFloor(-1));
    return;
}

actions.prototype._getNextFlyFloor = function (delta, index) {
    if (index == null) index = core.status.event.data;
    if (delta == 0) return index;
    var sign = Math.sign(delta);
    delta = Math.abs(delta);
    var ans = index;
    while (true) {
        index += sign;
        if (index < 0 || index >= core.floorIds.length) break;
        var floorId = core.floorIds[index];
        if (core.status.maps[floorId].canFlyTo && core.hasVisitedFloor(floorId)) {
            delta--;
            ans = index;
        }
        if (delta == 0) break;
    }
    return ans;
}

////// 楼层传送器界面时，放开某个键的操作 //////
actions.prototype._keyUpFly = function (keycode) {
    if (keycode == 71 || keycode == 27 || keycode == 88)
        core.ui.closePanel();
    if (keycode == 13 || keycode == 32 || keycode == 67)
        this._clickFly(this.HSIZE-1, this.HSIZE-1);
    return;
}

////// 查看地图界面时的点击操作 //////
actions.prototype._clickViewMaps = function (x, y) {
    if (core.status.event.data == null) {
        core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
        return;
    }
    var now = core.floorIds.indexOf(core.status.floorId);
    var index = core.status.event.data.index;
    var cx = core.status.event.data.x, cy = core.status.event.data.y;
    var floorId = core.floorIds[index], mw = core.floors[floorId].width, mh = core.floors[floorId].height;
    var per = this.HSIZE - 4;

    if (x <= per - 2 && y <= per - 2) {
        core.status.event.data.damage = !core.status.event.data.damage;
        core.ui.drawMaps(index, cx, cy);
        return;
    }
    if (x <= per - 2 && y >= this.SIZE + 1 - per) {
        core.status.event.data.paint = !core.status.event.data.paint;
        core.ui.drawMaps(index, cx, cy);
        return;
    }
    if (x >= this.SIZE + 1 - per && y <= per - 2) {
        core.status.event.data.all = !core.status.event.data.all;
        core.ui.drawMaps(index, cx, cy);
        return;
    }

    if (x >= per && x <= this.LAST - per && y <= per - 1 && mh > this.SIZE) {
        core.ui.drawMaps(index, cx, cy - 1);
        return;
    }
    if (x >= per && x <= this.LAST - per && y >= this.SIZE - per && mh > this.SIZE) {
        core.ui.drawMaps(index, cx, cy + 1);
        return;
    }
    if (x <= per - 1 && y >= per && y <= this.LAST - per) {
        core.ui.drawMaps(index, cx - 1, cy);
        return;
    }
    if (x >= this.SIZE - per && y >= per && y <= this.LAST - per) {
        core.ui.drawMaps(index, cx + 1, cy);
        return;
    }

    if (y <= this.HSIZE - 2 && (mh == this.SIZE || (x >= per && x <= this.LAST - per))) {
        index++;
        while (index < core.floorIds.length && index != now && core.status.maps[core.floorIds[index]].cannotViewMap)
            index++;
        if (index < core.floorIds.length)
            core.ui.drawMaps(index);
        return;
    }
    if (y >= this.HSIZE + 2 && (mh == this.SIZE || (x >= per && x <= this.LAST - per))) {
        index--;
        while (index >= 0 && index != now && core.status.maps[core.floorIds[index]].cannotViewMap)
            index--;
        if (index >= 0)
            core.ui.drawMaps(index);
        return;
    }
    if (x >= per && x <= this.LAST - per && y >= this.HSIZE - 1 && y <= this.HSIZE + 1) {
        core.clearMap('data');
        core.ui.closePanel();
        return;
    }
}

////// 查看地图界面时，按下某个键的操作 //////
actions.prototype._keyDownViewMaps = function (keycode) {
    if (core.status.event.data == null) return;

    var floorId = core.floorIds[core.status.event.data.index], mh = core.floors[floorId].height;

    if (keycode == 38 || keycode == 33) this._clickViewMaps(this.HSIZE, this.HSIZE - 3);
    if (keycode == 40 || keycode == 34) this._clickViewMaps(this.HSIZE, this.HSIZE + 3);
    if (keycode == 87 && mh > this.SIZE) this._clickViewMaps(this.HSIZE, 0);
    if (keycode == 65) this._clickViewMaps(0, this.HSIZE);
    if (keycode == 83 && mh > this.SIZE) this._clickViewMaps(this.HSIZE, this.LAST);
    if (keycode == 68) this._clickViewMaps(this.LAST, this.HSIZE);
    return;
}

////// 查看地图界面时，放开某个键的操作 //////
actions.prototype._keyUpViewMaps = function (keycode) {
    if (core.status.event.data == null) {
        core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
        return;
    }

    if (keycode == 27 || keycode == 13 || keycode == 32 || (!core.isReplaying() && keycode == 67)) {
        core.clearMap('data');
        core.ui.closePanel();
        return;
    }
    if (keycode == 86) {
        core.status.event.data.damage = !core.status.event.data.damage;
        core.ui.drawMaps(core.status.event.data);
        return;
    }
    if (keycode == 90) {
        core.status.event.data.all = !core.status.event.data.all;
        core.ui.drawMaps(core.status.event.data);
        return;
    }
    if (keycode == 77) {
        core.status.event.data.paint = !core.status.event.data.paint;
        core.ui.drawMaps(core.status.event.data);
        return;
    }
    if (keycode == 88 || (core.isReplaying() && keycode == 67)) {
        if (core.isReplaying()) {
            core.bookReplay();
        } else {
            core.openBook(false);
        }
        return;
    }
    return;
}

////// 商店界面时的点击操作 //////
actions.prototype._clickShop = function (x, y) {
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (x >= this.CHOICES_LEFT && x <= this.CHOICES_RIGHT) {
        var topIndex = this.HSIZE - parseInt(choices.length / 2) + (core.status.event.ui.offset || 0);
        if (y >= topIndex && y < topIndex + choices.length) {
            return core.events._useShop(shop, y - topIndex);
        }
        // 离开
        else if (y == topIndex + choices.length) {
            core.events._exitShop();
        }
        else return false;
    }
    return true;
}

actions.prototype._keyDownShop = function (keycode) {
    // 商店界面长按空格连续购买
    if (keycode == 32 && core.status.event.selection != core.status.event.data.shop.choices.length) {
        this._selectChoices(core.status.event.data.shop.choices.length + 1, keycode, this._clickShop);
        return;
    }
    this._keyDownChoices(keycode);
}

////// 商店界面时，放开某个键的操作 //////
actions.prototype._keyUpShop = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.events._exitShop();
        return;
    }
    if (keycode != 32 || core.status.event.selection == core.status.event.data.shop.choices.length) {
        this._selectChoices(core.status.event.data.shop.choices.length + 1, keycode, this._clickShop);
        return;
    }
    return;
}

////// 快捷商店界面时的点击操作 //////
actions.prototype._clickQuickShop = function (x, y) {
    var keys = Object.keys(core.status.shops).filter(function (shopId) {
        return core.status.shops[shopId].visited || !core.status.shops[shopId].mustEnable
    });

    if (x >= this.CHOICES_LEFT && x <= this.CHOICES_RIGHT) {
        var topIndex = this.HSIZE - parseInt(keys.length / 2) + (core.status.event.ui.offset || 0);
        if (y >= topIndex && y < topIndex + keys.length) {
            var reason = core.events.canUseQuickShop(keys[y - topIndex]);
            if (!core.flags.enableDisabledShop && reason) {
                core.drawText(reason);
                return;
            }
            core.events.openShop(keys[y - topIndex], true);
            if (core.status.event.id == 'shop')
                core.status.event.data.fromList = true;
        }
        // 离开
        else if (y == topIndex + keys.length)
            core.ui.closePanel();
        return;
    }
    return;
}

////// 快捷商店界面时，放开某个键的操作 //////
actions.prototype._keyUpQuickShop = function (keycode) {
    if (keycode == 27 || keycode == 75 || keycode == 88 || keycode == 86) {
        core.ui.closePanel();
        return;
    }
    var keys = Object.keys(core.status.shops).filter(function (shopId) {
        return core.status.shops[shopId].visited || !core.status.shops[shopId].mustEnable
    });
    this._selectChoices(keys.length + 1, keycode, this._clickQuickShop);
    return;
}

////// 工具栏界面时的点击操作 //////
actions.prototype._clickToolbox = function (x, y) {
    // 装备栏
    if (x >= this.LAST - 2 && y == 0) {
        core.ui.closePanel();
        if (core.isReplaying())
            core.equipboxReplay();
        else
            core.openEquipbox();
        return;
    }
    if (x >= this.LAST - 2 && y == this.LAST) {
        core.ui.closePanel();
        return;
    }

    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    // 上一页
    if (x == this.HSIZE-2 || x == this.HSIZE-3) {
        if (y == this.LAST - 5 && toolsPage > 1) {
            core.status.event.data.toolsPage--;
            core.ui.drawToolbox(core.status.event.selection);
        }
        if (y == this.LAST && constantsPage > 1) {
            core.status.event.data.constantsPage--;
            core.ui.drawToolbox(core.status.event.selection);
        }
    }
    // 下一页
    if (x == this.HSIZE+2 || x == this.HSIZE+3) {
        if (y == this.LAST - 5 && toolsPage < Math.ceil(Object.keys(core.status.hero.items.tools).length / this.LAST)) {
            core.status.event.data.toolsPage++;
            core.ui.drawToolbox(core.status.event.selection);
        }
        if (y == this.LAST && constantsPage < Math.ceil(Object.keys(core.status.hero.items.constants).length / this.LAST)) {
            core.status.event.data.constantsPage++;
            core.ui.drawToolbox(core.status.event.selection);
        }
    }

    var index = parseInt(x / 2);
    if (y == this.LAST - 8) index += 0;
    else if (y == this.LAST - 6) index += this.HSIZE;
    else if (y == this.LAST - 3) index += this.LAST;
    else if (y == this.LAST - 1) index += this.LAST + this.HSIZE;
    else index = -1;
    if (index >= 0)
        this._clickToolboxIndex(index);
}

////// 选择工具栏界面中某个Index后的操作 //////
actions.prototype._clickToolboxIndex = function (index) {
    var items = null;
    var select;
    if (index < this.LAST) {
        select = index + this.LAST * (core.status.event.data.toolsPage - 1);
        items = Object.keys(core.status.hero.items.tools).sort();
    }
    else {
        select = index % this.LAST + this.LAST * (core.status.event.data.constantsPage - 1);
        items = Object.keys(core.status.hero.items.constants).sort();
    }
    if (items == null) return;
    if (select >= items.length) return;
    var itemId = items[select];
    if (itemId == core.status.event.data.selectId) {
        if (core.isReplaying()) return;
        core.events.tryUseItem(itemId);
    }
    else {
        core.ui.drawToolbox(index);
    }
}

////// 工具栏界面时，按下某个键的操作 //////
actions.prototype._keyDownToolbox = function (keycode) {
    if (core.status.event.data == null) return;

    var last_index = this.LAST - 1;

    var tools = Object.keys(core.status.hero.items.tools).sort();
    var constants = Object.keys(core.status.hero.items.constants).sort();
    var index = core.status.event.selection;
    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    var toolsTotalPage = Math.ceil(tools.length / this.LAST);
    var constantsTotalPage = Math.ceil(constants.length / this.LAST);
    var toolsLastIndex = toolsPage < toolsTotalPage ? last_index : (tools.length + last_index) % this.LAST;
    var constantsLastIndex = this.LAST + (constantsPage < constantsTotalPage ? last_index : (constants.length + last_index) % this.LAST);

    if (keycode == 37) { // left
        if (index == 0) { // 处理向前翻页
            if (toolsPage > 1) {
                core.status.event.data.toolsPage--;
                index = last_index;
            }
            else return; // 第一页不向前翻
        }
        else if (index == this.LAST) {
            if (constantsPage == 1) {
                if (toolsTotalPage == 0) return;
                core.status.event.data.toolsPage = toolsTotalPage;
                index = (tools.length + last_index) % this.LAST;
            }
            else {
                core.status.event.data.constantsPage--;
                index = 2 * this.LAST - 1;
            }
        }
        else index -= 1;
        this._clickToolboxIndex(index);
        return;
    }
    if (keycode == 38) { // up
        if (index >= this.LAST && index < this.LAST + this.HSIZE) { // 进入tools
            if (toolsTotalPage == 0) return;
            if (toolsLastIndex >= this.HSIZE) index = Math.min(toolsLastIndex, index - this.HSIZE);
            else index = Math.min(toolsLastIndex, index - this.LAST);
        }
        else if (index < this.HSIZE) return; // 第一行没有向上
        else index -= this.HSIZE;
        this._clickToolboxIndex(index);
        return;
    }
    if (keycode == 39) { // right
        if (toolsPage < toolsTotalPage && index == last_index) {
            core.status.event.data.toolsPage++;
            index = 0;
        }
        else if (constantsPage < constantsTotalPage && index == 2 * this.LAST - 1) {
            core.status.event.data.constantsPage++;
            index = this.LAST;
        }
        else if (index == toolsLastIndex) {
            if (constantsTotalPage == 0) return;
            core.status.event.data.constantsPage = 1;
            index = this.LAST;
        }
        else if (index == constantsLastIndex) // 一个物品无操作
            return;
        else index++;
        this._clickToolboxIndex(index);
        return;
    }
    if (keycode == 40) { // down
        var nextIndex = null;
        if (index < this.HSIZE) {
            if (toolsLastIndex >= this.HSIZE) nextIndex = Math.min(toolsLastIndex, index + this.HSIZE);
            else index += this.HSIZE;
        }
        if (nextIndex == null && index < this.LAST) {
            if (constantsTotalPage == 0) return;
            nextIndex = Math.min(index + this.HSIZE, constantsLastIndex);
        }
        if (nextIndex == null && index < this.LAST + this.HSIZE) {
            if (constantsLastIndex >= this.LAST + this.HSIZE)
                nextIndex = Math.min(constantsLastIndex, index + this.HSIZE);
        }
        if (nextIndex != null) {
            this._clickToolboxIndex(nextIndex);
        }
        return;
    }
}

////// 工具栏界面时，放开某个键的操作 //////
actions.prototype._keyUpToolbox = function (keycode) {
    if (keycode == 81) {
        core.ui.closePanel();
        if (core.isReplaying())
            core.equipboxReplay();
        else
            core.openEquipbox();
        return;
    }
    if (keycode == 84 || keycode == 27 || keycode == 88) {
        core.ui.closePanel();
        return;
    }
    if (core.status.event.data == null) return;

    if (keycode == 13 || keycode == 32 || keycode == 67) {
        this._clickToolboxIndex(core.status.event.selection);
        return;
    }
}

////// 装备栏界面时的点击操作 //////
actions.prototype._clickEquipbox = function (x, y) {
    // 道具栏
    if (x >= this.LAST - 2 && y == 0) {
        core.ui.closePanel();
        if (core.isReplaying())
            core.toolboxReplay();
        else
            core.openToolbox();
        return;
    }
    // 返回
    if (x >= this.LAST - 2 && y == this.LAST) {
        core.ui.closePanel();
        return;
    }

    // 上一页
    if ((x == this.HSIZE-2 || x == this.HSIZE-3) && y == this.LAST) {
        if (core.status.event.data.page > 1) {
            core.status.event.data.page--;
            core.ui.drawEquipbox(core.status.event.selection);
        }
        return;
    }
    // 下一页
    if ((x == this.HSIZE+2 || x == this.HSIZE+3) && y == this.LAST) {
        var lastPage = Math.ceil(Object.keys(core.status.hero.items.equips).length / this.LAST);
        if (core.status.event.data.page < lastPage) {
            core.status.event.data.page++;
            core.ui.drawEquipbox(core.status.event.selection);
        }
        return;
    }

    var per_page = this.HSIZE - 3, v = this.SIZE / per_page;
    if (y == this.LAST - 8) {
        for (var i = 0; i < per_page; ++i)
            if (x >= i * v && x <= (i + 1) * v)
                return this._clickEquipboxIndex(i);
    }
    else if (y == this.LAST - 6) {
        for (var i = 0; i < per_page; ++i)
            if (x >= i * v && x <= (i + 1) * v)
                return this._clickEquipboxIndex(per_page + i);
    }
    else if (y == this.LAST - 3)
        this._clickEquipboxIndex(this.LAST + parseInt(x / 2))
    else if (y == this.LAST - 1)
        this._clickEquipboxIndex(this.LAST + this.HSIZE + parseInt(x / 2));
}

////// 选择装备栏界面中某个Index后的操作 //////
actions.prototype._clickEquipboxIndex = function (index) {
    if (index < this.LAST) {
        if (index >= core.status.globalAttribute.equipName.length) return;
        if (index == core.status.event.selection && core.status.hero.equipment[index]) {
            if (core.isReplaying()) return;
            core.unloadEquip(index);
            core.status.route.push("unEquip:" + index);
        }
    }
    else {
        var equips = Object.keys(core.status.hero.items.equips || {}).sort();
        if (index == core.status.event.selection) {
            if (core.isReplaying()) return;
            var equipId = equips[index - this.LAST + (core.status.event.data.page - 1) * this.LAST];
            core.loadEquip(equipId);
            core.status.route.push("equip:" + equipId);
        }
    }
    core.ui.drawEquipbox(index);
}

////// 装备栏界面时，按下某个键的操作 //////
actions.prototype._keyDownEquipbox = function (keycode) {
    if (core.status.event.data == null) return;

    var last_index = this.LAST - 1;
    var per_line = this.HSIZE - 3;
    var equipCapacity = core.status.globalAttribute.equipName.length;
    var ownEquipment = Object.keys(core.status.hero.items.equips).sort();
    var index = core.status.event.selection;
    var page = core.status.event.data.page;
    var totalPage = Math.ceil(ownEquipment.length / this.LAST);
    var totalLastIndex = this.LAST + (page < totalPage ? last_index : (ownEquipment.length + last_index) % this.LAST);

    if (keycode == 37) { // left
        if (index == 0) return;
        if (index == this.LAST) {
            if (page > 1) {
                core.status.event.data.page--;
                index = this.LAST + last_index;
            }
            else if (page == 1)
                index = equipCapacity - 1;
            else return;
        }
        else index -= 1;
        this._clickEquipboxIndex(index);
        return;
    }
    if (keycode == 38) { // up
        if (index < per_line) return;
        else if (index < 2 * per_line) index -= per_line;
        else if (index < this.LAST + this.HSIZE) {
            index = parseInt((index - this.LAST) / 2);
            if (equipCapacity > per_line) index = Math.min(equipCapacity - 1, index + per_line);
            else index = Math.min(equipCapacity - 1, index);
        }
        else index -= this.HSIZE;
        this._clickEquipboxIndex(index);
        return;
    }
    if (keycode == 39) { // right
        if (page < totalPage && index == this.LAST + last_index) {
            core.status.event.data.page++;
            index = this.LAST;
        }
        else if (index == equipCapacity - 1) {
            if (totalPage == 0) return;
            index = this.LAST;
        }
        else if (index == totalLastIndex)
            return;
        else index++;
        this._clickEquipboxIndex(index);
        return;
    }
    if (keycode == 40) { // down
        if (index < per_line) {
            if (equipCapacity > per_line) index = Math.min(index + per_line, equipCapacity - 1);
            else {
                if (totalPage == 0) return;
                index = Math.min(2 * index + 1 + this.LAST, totalLastIndex);
            }
        }
        else if (index < 2 * per_line) {
            if (totalPage == 0) return;
            index = Math.min(2 * (index - per_line) + 1 + this.LAST, totalLastIndex);
        }
        else if (index < this.LAST + this.HSIZE)
            index = Math.min(index + this.HSIZE, totalLastIndex);
        else return;
        this._clickEquipboxIndex(index);
        return;
    }
}

////// 装备栏界面时，放开某个键的操作 //////
actions.prototype._keyUpEquipbox = function (keycode, altKey) {
    if (altKey && keycode >= 48 && keycode <= 57) {
        core.items.quickSaveEquip(keycode - 48);
        return;
    }
    if (keycode == 84) {
        core.ui.closePanel();
        if (core.isReplaying())
            core.toolboxReplay();
        else
            core.openToolbox();
        return;
    }
    if (keycode == 81 || keycode == 27 || keycode == 88) {
        core.ui.closePanel();
        return;
    }
    if (!core.status.event.data.selectId) return;

    if (keycode == 13 || keycode == 32 || keycode == 67) {
        this._clickEquipboxIndex(core.status.event.selection);
        return;
    }
}

////// 存读档界面时的点击操作 //////
actions.prototype._clickSL = function (x, y) {
    var page = core.status.event.data.page, offset = core.status.event.data.offset;
    var index = page * 10 + offset;

    // 上一页
    if ((x == this.HSIZE-2 || x == this.HSIZE-3) && y == this.LAST) {
        core.ui.drawSLPanel(10 * (page - 1) + offset);
        return;
    }
    // 下一页
    if ((x == this.HSIZE+2 || x == this.HSIZE+3) && y == this.LAST) {
        core.ui.drawSLPanel(10 * (page + 1) + offset);
        return;
    }
    // 返回
    if (x >= this.LAST-2 && y == this.LAST) {
        if (core.events.recoverEvents(core.status.event.interval))
            return;
        core.ui.closePanel();
        delete core.status.tempRoute;
        if (!core.isPlaying())
            core.showStartAnimate(true);
        return;
    }
    // 删除
    if (x >= 0 && x <= 2 && y == this.LAST) {
        if (core.status.event.id == 'save') {
            core.status.event.selection = !core.status.event.selection;
            core.ui.drawSLPanel(index);
        }
        else { // 显示收藏
            core.status.event.data.mode = core.status.event.data.mode == 'all'?'fav':'all';
            if (core.status.event.data.mode == 'fav')
                core.ui.drawSLPanel(1, true);
            else {
                page = parseInt((core.saves.saveIndex-1)/5);
                offset = core.saves.saveIndex-5*page;
                core.ui.drawSLPanel(10*page + offset, true);
            }
        }
        return;
    }
    // 点存档名
    var xLeft = parseInt(this.SIZE/3), xRight = parseInt(this.SIZE*2/3);
    var topY1 = 0, topY2 = this.HSIZE;
    if(y >= topY1 && y <= topY1 + 1) {
        if (x >= xLeft && x < xRight) return this._clickSL_favorite(page, 1);
        if (x >= xRight) return this._clickSL_favorite(page, 2);
    }
    if(y >= topY2 && y <= topY2 + 1) {
        if (x < xLeft) return this._clickSL_favorite(page, 3);
        if (x >= xLeft && x < xRight) return this._clickSL_favorite(page, 4);
        if (x >= xRight) return this._clickSL_favorite(page, 5);
    }

    var id = null;
    if (y >= topY1 + 2 && y < this.HSIZE - 1) {
        if (x < xLeft) id = "autoSave";
        if (x >= xLeft && x < xRight) id = 5 * page + 1;
        if (x >= xRight) id = 5 * page + 2;
    }
    if (y >= topY2 + 2 && y < this.SIZE - 1) {
        if (x < xLeft) id = 5 * page + 3;
        if (x >= xLeft && x < xRight) id = 5 * page + 4;
        if (x >= xRight) id = 5 * page + 5;
    }
    if (id != null) {
        if (core.status.event.selection) {
            if (id == 'autoSave')
                core.drawTip("无法删除自动存档！");
            else {
                core.removeSave(id, function () {
                    core.ui.drawSLPanel(index, true);
                });
            }
        }
        else {
            if(core.status.event.data.mode == 'fav' && id != 'autoSave')
                id = core.saves.favorite[id - 1];
            core.doSL(id, core.status.event.id);
        }
    }
}

actions.prototype._clickSL_favorite = function (page, offset) {
    if (offset == 0) return;
    var index = 5 * page + offset;
    if (core.status.event.data.mode == 'fav') { // 收藏模式下点击的下标直接对应favorite
        index = core.saves.favorite[index - 1];
        core.myprompt("请输入想要显示的存档名(长度不超过5字符)", null, function (value) {
            if(value && value.length <= 5){
                core.saves.favoriteName[index] = value;
                core.control._updateFavoriteSaves();
                core.drawSLPanel(10 * page + offset);
            } else if (value) {
                alert("无效的输入！");
            }
        });
    } else {
        var v = core.saves.favorite.indexOf(index);
        if (v >= 0) { // 已经处于收藏状态：取消收藏
            core.saves.favorite.splice(v, 1);
            delete core.saves.favoriteName[index];
        }
        else if (core.hasSave(index)) { // 存在存档则进行收藏
            core.saves.favorite.push(index);
            core.saves.favorite = core.saves.favorite.sort(function (a,b) {return a-b;}); // 保证有序
            core.drawTip("收藏成功！");
        }
        core.control._updateFavoriteSaves();
        core.ui.drawSLPanel(10 * page + offset);
    }
}

////// 存读档界面时，按下某个键的操作 //////
actions.prototype._keyDownSL = function (keycode) {

//    var index = core.status.event.data;
    var page = core.status.event.data.page, offset = core.status.event.data.offset;
    var index = page*10 + offset;

    if (keycode == 37) { // left
        if (offset == 0) {
            core.ui.drawSLPanel(10 * (page - 1) + 5);
        }
        else {
            core.ui.drawSLPanel(index - 1);
        }
        return;
    }
    if (keycode == 38) { // up
        if (offset < 3) {
            core.ui.drawSLPanel(10 * (page - 1) + offset + 3);
        }
        else {
            core.ui.drawSLPanel(index - 3);
        }
        return;
    }
    if (keycode == 39) { // right
        if (offset == 5) {
            core.ui.drawSLPanel(10 * (page + 1) + 1);
        }
        else {
            core.ui.drawSLPanel(index + 1);
        }
        return;
    }
    if (keycode == 40) { // down
        if (offset >= 3) {
            core.ui.drawSLPanel(10 * (page + 1) + offset - 3);
        }
        else {
            core.ui.drawSLPanel(index + 3);
        }
        return;
    }
    if (keycode == 33) { // PAGEUP
        core.ui.drawSLPanel(10 * (page - 1) + offset);
        return;
    }
    if (keycode == 34) { // PAGEDOWN
        core.ui.drawSLPanel(10 * (page + 1) + offset);
        return;
    }
}

////// 存读档界面时，放开某个键的操作 //////
actions.prototype._keyUpSL = function (keycode) {
    var page = core.status.event.data.page, offset = core.status.event.data.offset;
    var index = page * 10 + offset;

    if (keycode == 27 || keycode == 88 || (core.status.event.id == 'save' && keycode == 83)
        || (core.status.event.id == 'load' && keycode == 68)) {
        this._clickSL(this.LAST, this.LAST);
        return;
    }
    if (keycode >= 48 && keycode <= 57) {
        if (keycode == 48) keycode = 58;
        core.ui.drawSLPanel((keycode - 49) * 1000 + 1);
        return;
    }
    if (keycode == 13 || keycode == 32 || keycode == 67) {
        if (offset == 0)
            core.doSL("autoSave", core.status.event.id);
        else {
            var id = 5 * page + offset;
            if(core.status.event.data.mode == 'fav') id = core.saves.favorite[id - 1];
            core.doSL(id, core.status.event.id);
        }
        return;
    }
    if (keycode == 69 && core.status.event.id != 'save') { // E 收藏切换
        this._clickSL(0, this.LAST);
        return;
    }
    if (keycode == 46) {
        if (offset == 0) {
            core.drawTip("无法删除自动存档！");
        }
        else {
            var id = 5 * page + offset;
            if(core.status.event.data.mode == 'fav') id = core.saves.favorite[id - 1];
            core.removeSave(id, function () {
                core.ui.drawSLPanel(index, true);
            });
        }
    }
    if (keycode == 70 && core.status.event.data.mode == 'all') { // F
        this._clickSL_favorite(page, offset);
    }
}


////// 系统设置界面时的点击操作 //////
actions.prototype._clickSwitchs = function (x, y) {
    var choices = core.status.event.ui.choices;
    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
    var selection = y - topIndex;
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) {
        if (selection != 2 && selection != 3) return;
        if (x != this.HSIZE - 2 && x != this.HSIZE + 2) return;
    }
    if (selection >= 0 && selection < choices.length) {
        core.status.event.selection = selection;
        switch (selection) {
            case 0:
                return this._clickSwitchs_bgm();
            case 1:
                return this._clickSwitchs_sound();
            case 2:
                if (x == this.HSIZE - 2) return this._clickSwitchs_userVolume(-1);
                if (x == this.HSIZE + 2) return this._clickSwitchs_userVolume(1);
                return;
            case 3:
                if (x == this.HSIZE - 2) return this._clickSwitchs_moveSpeed(-10);
                if (x == this.HSIZE + 2) return this._clickSwitchs_moveSpeed(10);
                return;
            case 4:
                return this._clickSwitchs_displayEnemyDamage();
            case 5:
                return this._clickSwitchs_displayCritical();
            case 6:
                return this._clickSwitchs_displayExtraDamage();
            case 7:
                return this._clickSwitchs_localForage();
            case 8:
                return this._clickSwitchs_clickMove();
            case 9:
                core.status.event.selection = 0;
                core.ui.drawSettings();
                break;
        }
    }
}

actions.prototype._clickSwitchs_bgm = function () {
    core.triggerBgm();
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_sound = function () {
    core.musicStatus.soundStatus = !core.musicStatus.soundStatus;
    core.setLocalStorage('soundStatus', core.musicStatus.soundStatus);
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_userVolume = function (delta) {
    var value = Math.round(Math.sqrt(100 * core.musicStatus.userVolume));
    core.musicStatus.userVolume = core.clamp(Math.pow(value + delta, 2) / 100, 0, 1);
    //audioContext 音效 不受designVolume 影响
    if (core.musicStatus.gainNode != null) core.musicStatus.gainNode.gain.value = core.musicStatus.userVolume;
    if (core.musicStatus.playingBgm) core.material.bgms[core.musicStatus.playingBgm].volume = core.musicStatus.userVolume * core.musicStatus.designVolume;
    core.setLocalStorage('userVolume', core.musicStatus.userVolume);
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_moveSpeed = function (delta) {
    core.values.moveSpeed = core.clamp(core.values.moveSpeed + delta, 50, 200);
    core.setLocalStorage("moveSpeed", core.values.moveSpeed);
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_displayEnemyDamage = function () {
    core.flags.displayEnemyDamage = !core.flags.displayEnemyDamage;
    core.updateDamage();
    core.setLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_displayCritical = function () {
    core.flags.displayCritical = !core.flags.displayCritical;
    core.updateDamage();
    core.setLocalStorage('critical', core.flags.displayCritical);
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_displayExtraDamage = function () {
    core.flags.displayExtraDamage = !core.flags.displayExtraDamage;
    core.updateDamage();
    core.setLocalStorage('extraDamage', core.flags.displayExtraDamage);
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_localForage = function () {
    core.platform.useLocalForage = !core.platform.useLocalForage;
    core.setLocalStorage('useLocalForage', core.platform.useLocalForage);
    core.control.getSaveIndexes(function (indexes) {
        core.saves.ids = indexes;
    });
    core.ui.drawSwitchs();
}

actions.prototype._clickSwitchs_clickMove = function () {
    if (core.hasFlag('__noClickMove__')) core.removeFlag('__noClickMove__');
    else core.setFlag('__noClickMove__', true);
    core.ui.drawSwitchs();
}

////// 系统设置界面时，放开某个键的操作 //////
actions.prototype._keyUpSwitchs = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.status.event.selection = 0;
        core.ui.drawSettings();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickSwitchs);
}

////// 系统菜单栏界面时的点击操作 //////
actions.prototype._clickSettings = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;
    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        switch (selection) {
            case 0:
                core.status.event.selection = 0;
                core.ui.drawSwitchs();
                break;
            case 1:
                core.ui.drawKeyBoard();
                break;
            case 2:
                core.clearUI();
                core.ui.drawMaps();
                break;
            case 3:
                core.clearUI();
                core.ui.drawPaint();
                break;
            case 4:
                core.status.event.selection = 0;
                core.ui.drawSyncSave();
                break;
            case 5:
                core.status.event.selection = 0;
                core.ui.drawGameInfo();
                break;
            case 6:
                return core.confirmRestart();
            case 7:
                core.ui.closePanel();
                break;
        }
    }
    return;
}

////// 系统菜单栏界面时，放开某个键的操作 //////
actions.prototype._keyUpSettings = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.ui.closePanel();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickSettings);
}

////// 同步存档界面时的点击操作 //////
actions.prototype._clickSyncSave = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;
    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        switch (selection) {
            case 0:
                core.status.event.selection = 0;
                core.ui.drawSyncSelect();
                break;
            case 1:
                core.syncLoad();
                break;
            case 2:
                core.status.event.selection = 0;
                core.ui.drawLocalSaveSelect();
                break;
            case 3:
                return this._clickSyncSave_readFile();
            case 4:
                return this._clickSyncSave_replay();
            case 5:
                core.status.event.selection = 0;
                core.ui.drawStorageRemove();
                break;
            case 6:
                core.status.event.selection = 4;
                core.ui.drawSettings();
                break;

        }
    }
    return;
}

actions.prototype._clickSyncSave_readFile = function () {
    core.readFile(function (obj) {
        if (obj.name != core.firstData.name) return alert("存档和游戏不一致！");
        if (obj.version != core.firstData.version) return alert("游戏版本不一致！");
        if (!obj.data) return alert("无效的存档！");
        core.control._syncLoad_write(obj.data);
    }, null, ".h5save");
}

actions.prototype._clickSyncSave_replay = function () {
    core.ui.drawReplay();
}

////// 同步存档界面时，放开某个键的操作 //////
actions.prototype._keyUpSyncSave = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.status.event.selection = 2;
        core.ui.drawSettings();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickSyncSave);
}

////// 同步存档选择界面时的点击操作 //////
actions.prototype._clickSyncSelect = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;

    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        switch (selection) {
            case 0:
                core.syncSave('all');
                break;
            case 1:
                core.syncSave();
                break;
            case 2:
                core.status.event.selection = 0;
                core.ui.drawSyncSave();
                break;
        }
    }
}

////// 同步存档选择界面时，放开某个键的操作 //////
actions.prototype._keyUpSyncSelect = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.status.event.selection = 0;
        core.ui.drawSettings();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickSyncSelect);
}

////// 存档下载界面时的点击操作 //////
actions.prototype._clickLocalSaveSelect = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;

    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);

    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        if (selection < 2) {
            var callback = function (saves) {
                if (saves) {
                    var content = {
                        "name": core.firstData.name,
                        "version": core.firstData.version,
                        "data": saves
                    }
                    core.download(core.firstData.name + "_" + core.formatDate2(new Date()) + ".h5save", JSON.stringify(content));
                }
            };
            if (selection == 0) core.getAllSaves(callback);
            else core.getSave(core.saves.saveIndex, callback);
        }

        core.status.event.selection = 2;
        core.ui.drawSyncSave();
    }
}

////// 存档下载界面时，放开某个键的操作 //////
actions.prototype._keyUpLocalSaveSelect = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.status.event.selection = 0;
        core.ui.drawSettings();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickLocalSaveSelect);
}

////// 存档删除界面时的点击操作 //////
actions.prototype._clickStorageRemove = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;

    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);

    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        switch (selection) {
            case 0:
                return this._clickStorageRemove_all();
            case 1:
                return this._clickStorageRemove_current();
            case 2:
                core.status.event.selection = 6;
                core.ui.drawSyncSave();
                break;
        }
    }
}

actions.prototype._clickStorageRemove_all = function () {
    core.myconfirm("你确定要清除【全部塔】的所有本地存档？\n此行为不可逆！！！", function () {
        var done = function () {
            core.saves.ids = {};
            core.saves.autosave.data = null;
            core.saves.autosave.updated = false;
            core.ui.closePanel();
            core.saves.saveIndex = 1;
            core.saves.favorite = [];
            core.saves.favoriteName = {};
            core.control._updateFavoriteSaves();
            core.removeLocalStorage('saveIndex');
            core.drawText("\t[操作成功]你的所有存档已被清空。");
        };
        if (core.platform.useLocalForage) {
            core.ui.drawWaiting("正在清空，请稍后...");
            localforage.clear(done);
        }
        else {
            localStorage.clear();
            done();
        }
    });
}

actions.prototype._clickStorageRemove_current = function () {
    core.myconfirm("你确定要清除本塔的所有本地存档？\n此行为不可逆！！！", function () {
        var done = function () {
            core.saves.ids = {};
            core.saves.autosave.data = null;
            core.saves.autosave.updated = false;
            core.ui.closePanel();
            core.saves.saveIndex = 1;
            core.saves.favorite = [];
            core.saves.favoriteName = {};
            core.control._updateFavoriteSaves();
            core.removeLocalStorage('saveIndex');
            core.drawText("\t[操作成功]当前塔的存档已被清空。");
        }
        if (core.platform.useLocalForage) {
            core.ui.drawWaiting("正在清空，请稍后...");
            Object.keys(core.saves.ids).forEach(function (v) {
                core.removeLocalForage("save" + v);
            });
            core.removeLocalForage("autoSave", done);
        }
        else {
            Object.keys(core.saves.ids).forEach(function (v) {
                core.removeLocalStorage("save" + v);
            });
            core.removeLocalStorage("autoSave");
            done();
        }
    });
}

////// 存档删除界面时，放开某个键的操作 //////
actions.prototype._keyUpStorageRemove = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.status.event.selection = 5;
        core.ui.drawSyncSave();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickStorageRemove);
}

////// 回放选择界面时的点击操作 //////
actions.prototype._clickReplay = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;

    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);

    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        switch (selection) {
            case 0: return this._clickReplay_fromBeginning();
            case 1: return this._clickReplay_fromLoad();
            case 2: return this._clickReplay_replayRemain();
            case 3: return core.chooseReplayFile();
            case 4: return this._clickReplay_download();
            case 5: return core.ui.closePanel();
        }
    }
}

actions.prototype._clickReplay_fromBeginning = function () {
    core.ui.closePanel();
    core.startGame(core.status.hard, core.getFlag('__seed__'), core.clone(core.status.route));
}

actions.prototype._clickReplay_fromLoad = function () {
    core.status.event.id = 'replayLoad';
    core.status.event.selection = null;
    core.clearUI();
    var saveIndex = core.saves.saveIndex;
    var page = parseInt((saveIndex - 1) / 5), offset = saveIndex - 5 * page;
    core.ui.drawSLPanel(10 * page + offset);
}

actions.prototype._clickReplay_replayRemain = function () {
    core.closePanel();
    core.drawText([
        "\t[接续播放录像]该功能允许你播放\r[yellow]两个存档之间的录像\r，常常用于\r[yellow]区域优化\r。\n" +
        "例如，有若干个区，已经全部通关；之后重打一区并进行了优化，则可以对剩余区域直接播放录像而无需全部重打。",
        "\t[步骤1]请选择一个存档。\n\r[yellow]该存档的坐标必须和当前勇士坐标完全相同。\r\n将尝试从此处开始回放。",
    ], function () {
        core.status.event.id = 'replayRemain';
        core.lockControl();
        var saveIndex = core.saves.saveIndex;
        var page = parseInt((saveIndex - 1) / 5), offset = saveIndex - 5 * page;
        core.ui.drawSLPanel(10 * page + offset);
    });
}

actions.prototype._clickReplay_download = function () {
    // if (core.hasFlag('debug')) return core.drawText("\t[系统提示]调试模式下无法下载录像");
    core.download(core.firstData.name + "_" + core.formatDate2() + ".h5route", JSON.stringify({
        'name': core.firstData.name,
        'hard': core.status.hard,
        'seed': core.getFlag('__seed__'),
        'route': core.encodeRoute(core.status.route)
    }));

}

////// 回放选择界面时，放开某个键的操作 //////
actions.prototype._keyUpReplay = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.ui.closePanel();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickReplay);
}

////// 游戏信息界面时的点击操作 //////
actions.prototype._clickGameInfo = function (x, y) {
    if (x < this.CHOICES_LEFT || x > this.CHOICES_RIGHT) return;
    var choices = core.status.event.ui.choices;

    var topIndex = this.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);

    if (y >= topIndex && y < topIndex + choices.length) {
        var selection = y - topIndex;
        core.status.event.selection = selection;
        switch (selection) {
            case 0: return core.ui.drawStatistics();
            case 1: return this._clickGameInfo_openProject();
            case 2: return this._clickGameInfo_openComments();
            case 3: return core.ui.drawHelp();
            case 4: return core.ui.drawAbout();
            case 5: return this._clickGameInfo_download();
            case 6:
                core.status.event.selection = 5;
                core.ui.drawSettings();
                break;
        }
    }
}

actions.prototype._clickGameInfo_openProject = function () {
    if (core.platform.isPC)
        window.open("editor.html", "_blank");
    else {
        core.myconfirm("即将离开本塔，跳转至本塔工程页面，确认？", function () {
            window.location.href = "editor-mobile.html";
        });
    }
}

actions.prototype._clickGameInfo_openComments = function () {
    if (core.platform.isPC) {
        window.open("/score.php?name=" + core.firstData.name + "&num=10", "_blank");
    }
    else {
        core.myconfirm("即将离开本塔，跳转至本塔评论页面，确认？", function () {
            window.location.href = "/score.php?name=" + core.firstData.name + "&num=10";
        });
    }
}

actions.prototype._clickGameInfo_download = function () {
    if (core.platform.isPC)
        window.open(core.firstData.name + ".zip");
    else
        window.location.href = core.firstData.name + ".zip";
}

////// 游戏信息界面时，放开某个键的操作 //////
actions.prototype._keyUpGameInfo = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.ui.closePanel();
        return;
    }
    this._selectChoices(core.status.event.ui.choices.length, keycode, this._clickGameInfo);
}

////// “虚拟键盘”界面时的点击操作 //////
actions.prototype._clickKeyBoard = function (x, y) {
    var m = this.HSIZE;
    if (y == m - 3 && x >= m - 5 && x <= m + 5) {
        core.ui.closePanel();
        core.keyUp(112 + x + 5 - m);
    }
    if (y == m - 3 && x == m + 6) {
        var val = prompt();
        if (val != null) {
            try {
                eval(val);
            }
            catch (e) {
            }
        }
    }
    if (y == m - 2 && x >= m - 5 && x <= m + 4) {
        core.ui.closePanel();
        core.keyUp(x == m + 4 ? 48 : 49 + x + 5 - m); // 1-9: 49-57; 0: 48
    }
    // 字母
    var lines = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M"],
    ];
    if (y == m - 1 && x >= m - 5 && x <= m + 4) {
        core.ui.closePanel();
        core.keyUp(lines[0][x + 5 - m].charCodeAt(0));
    }
    if (y == m && x >= m - 5 && x <= m + 3) {
        core.ui.closePanel();
        core.keyUp(lines[1][x + 5 - m].charCodeAt(0));
    }
    if (y == m + 1 && x >= m - 5 && x <= m + 1) {
        core.ui.closePanel();
        core.keyUp(lines[2][x + 5 - m].charCodeAt(0));
    }
    if (y == m + 2 && x >= m - 5 && x <= m + 5) {
        core.ui.closePanel();
        if (x == m - 5) core.keyUp(189); // -
        if (x == m - 4) core.keyUp(187); // =
        if (x == m - 3) core.keyUp(219); // [
        if (x == m - 2) core.keyUp(221); // ]
        if (x == m - 1) core.keyUp(220); // \
        if (x == m) core.keyUp(186); // ;
        if (x == m + 1) core.keyUp(222); // '
        if (x == m + 2) core.keyUp(188); // ,
        if (x == m + 3) core.keyUp(190); // .
        if (x == m + 4) core.keyUp(191); // /
        if (x == m + 5) core.keyUp(192); // `
    }
    if (y == m + 3 && x >= m - 5 && x <= m + 4) {
        core.ui.closePanel();
        if (x == m - 5) core.keyUp(27); // ESC
        if (x == m - 4) core.keyUp(9); // TAB
        if (x == m - 3) core.keyUp(20); // CAPS
        if (x == m - 2) core.keyUp(16); // SHIFT
        if (x == m - 1) core.keyUp(17); // CTRL
        if (x == m) core.keyUp(18); // ALT
        if (x == m + 1) core.keyUp(32); // SPACE
        if (x == m + 2) core.keyUp(8); // BACKSPACE
        if (x == m + 3) core.keyUp(13); // ENTER
        if (x == m + 4) core.keyUp(46); // DEL
    }
    if (y == m + 4 && x >= m + 3 && x <= m + 5)
        core.ui.closePanel();
}

////// 光标界面时的点击操作 //////
actions.prototype._clickCursor = function (x, y) {
    if (x == core.status.automaticRoute.cursorX && y == core.status.automaticRoute.cursorY) {
        core.ui.closePanel();
        core.onclick(x, y, []);
        return;
    }
    core.status.automaticRoute.cursorX = x;
    core.status.automaticRoute.cursorY = y;
    core.ui.drawCursor();
}

////// 光标界面时，按下某个键的操作 //////
actions.prototype._keyDownCursor = function (keycode) {
    if (keycode == 37) { // left
        core.status.automaticRoute.cursorX--;
        core.ui.drawCursor();
        return;
    }
    if (keycode == 38) { // up
        core.status.automaticRoute.cursorY--;
        core.ui.drawCursor();
        return;
    }
    if (keycode == 39) { // right
        core.status.automaticRoute.cursorX++;
        core.ui.drawCursor();
        return;
    }
    if (keycode == 40) { // down
        core.status.automaticRoute.cursorY++;
        core.ui.drawCursor();
        return;
    }
}

////// 光标界面时，放开某个键的操作 //////
actions.prototype._keyUpCursor = function (keycode) {
    if (keycode == 27 || keycode == 88) {
        core.ui.closePanel();
        return;
    }
    if (keycode == 13 || keycode == 32 || keycode == 67 || keycode == 69) {
        core.ui.closePanel();
        core.onclick(core.status.automaticRoute.cursorX, core.status.automaticRoute.cursorY, []);
        return;
    }
}

////// 绘图相关 //////

actions.prototype._ondownPaint = function (x, y) {
    x += core.bigmap.offsetX;
    y += core.bigmap.offsetY;
    if (!core.status.event.data.erase) {
        core.dymCanvas.paint.beginPath();
        core.dymCanvas.paint.moveTo(x, y);
    }
    core.status.event.data.x = x;
    core.status.event.data.y = y;
}

actions.prototype._onmovePaint = function (x, y) {
    if (core.status.event.data.x == null) return;
    x += core.bigmap.offsetX;
    y += core.bigmap.offsetY;
    if (core.status.event.data.erase) {
        core.clearMap('paint', x - 10, y - 10, 20, 20);
        return;
    }
    var midx = (core.status.event.data.x + x) / 2, midy = (core.status.event.data.y + y) / 2;
    core.dymCanvas.paint.quadraticCurveTo(midx, midy, x, y);
    core.dymCanvas.paint.stroke();
    core.status.event.data.x = x;
    core.status.event.data.y = y;
}

actions.prototype._onupPaint = function () {
    core.status.event.data.x = null;
    core.status.event.data.y = null;
    // 保存
    core.paint[core.status.floorId] = lzw_encode(core.utils._encodeCanvas(core.dymCanvas.paint).join(","));
}

actions.prototype.setPaintMode = function (mode) {
    if (mode == 'paint') core.status.event.data.erase = false;
    else if (mode == 'erase') core.status.event.data.erase = true;
    else return;

    core.drawTip("进入" + (core.status.event.data.erase ? "擦除" : "绘图") + "模式");
}

actions.prototype.clearPaint = function () {
    core.clearMap('paint');
    delete core.paint[core.status.floorId];
    core.drawTip("已清空绘图内容");
}

actions.prototype.savePaint = function () {
    var data = {};
    for (var floorId in core.paint) {
        if (core.paint[floorId])
            data[floorId] = lzw_decode(core.paint[floorId]);
    }
    core.download(core.firstData.name + ".h5paint", JSON.stringify({
        'name': core.firstData.name,
        'paint': data
    }));
}

actions.prototype.loadPaint = function () {
    core.readFile(function (obj) {
        if (obj.name != core.firstData.name) {
            alert("绘图文件和游戏不一致！");
            return;
        }
        if (!obj.paint) {
            alert("无效的绘图文件！");
            return;
        }
        core.paint = {};
        for (var floorId in obj.paint) {
            if (obj.paint[floorId])
                core.paint[floorId] = lzw_encode(obj.paint[floorId]);
        }

        core.clearMap('paint');
        var value = core.paint[core.status.floorId];
        if (value) value = lzw_decode(value).split(",");
        core.utils._decodeCanvas(value, 32 * core.bigmap.width, 32 * core.bigmap.height);
        core.drawImage('paint', core.bigmap.tempCanvas.canvas, 0, 0);

        core.drawTip("读取绘图文件成功");
    })
}

actions.prototype.exitPaint = function () {
    core.deleteCanvas('paint');
    core.ui.closePanel();
    core.statusBar.image.keyboard.style.opacity = 1;
    core.statusBar.image.shop.style.opacity = 1;
    core.drawTip("退出绘图模式");
}

actions.prototype._keyUpPaint = function (keycode) {
    if (keycode == 27 || keycode == 88 || keycode == 77 || keycode == 13 || keycode == 32 || keycode == 67) {
        this.exitPaint();
        return;
    }
}

////// 绘图相关 END //////
