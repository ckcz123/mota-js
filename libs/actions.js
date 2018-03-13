/*
actions.js：用户交互的事件的处理
键盘、鼠标、触摸屏事件相关
 */

function actions() {
    this.init();
}

actions.prototype.init = function () {

}

////// 按下某个键时 //////
actions.prototype.onkeyDown = function (e) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.isset(core.status.holdingKeys))core.status.holdingKeys=[];
    var isArrow={37:true,38:true,39:true,40:true}[e.keyCode]
    if(isArrow && !core.status.lockControl){
        for(var ii =0;ii<core.status.holdingKeys.length;ii++){
            if (core.status.holdingKeys[ii]===e.keyCode){
                return;
            }
        }
        core.status.holdingKeys.push(e.keyCode);
        this.pressKey(e.keyCode);
    } else {
        this.keyDown(e.keyCode);
    }
}

////// 放开某个键时 //////
actions.prototype.onkeyUp = function(e) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) {
        if (e.keyCode==27) // ESCAPE
            core.stopReplay();
        else if (e.keyCode==90) // Z
            core.rewindReplay();
        else if (e.keyCode==88) // X
            core.forwardReplay();
        else if (e.keyCode==32) // SPACE
            core.triggerReplay();
        return;
    }

    var isArrow={37:true,38:true,39:true,40:true}[e.keyCode]
    if(isArrow && !core.status.lockControl){
        for(var ii =0;ii<core.status.holdingKeys.length;ii++){
            if (core.status.holdingKeys[ii]===e.keyCode){
                core.status.holdingKeys= core.status.holdingKeys.slice(0,ii).concat(core.status.holdingKeys.slice(ii+1));
                if (ii === core.status.holdingKeys.length && core.status.holdingKeys.length!==0)core.pressKey(core.status.holdingKeys.slice(-1)[0]);
                break;
            }
        }
        this.keyUp(e.keyCode);
    } else {
        this.keyUp(e.keyCode);
    }
}

////// 按住某个键时 //////
actions.prototype.pressKey = function (keyCode) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (keyCode === core.status.holdingKeys.slice(-1)[0]) {
        this.keyDown(keyCode);
        window.setTimeout(function(){core.pressKey(keyCode);},30);
    }
}

////// 根据按下键的code来执行一系列操作 //////
actions.prototype.keyDown = function(keyCode) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (core.status.lockControl) {
        // Ctrl跳过对话
        if (keyCode==17) {
            this.keyDownCtrl();
            return;
        }
        if (core.status.event.id == 'action') {
            this.keyDownAction(keyCode);
            return;
        }
        if (core.status.event.id == 'book') {
            this.keyDownBook(keyCode);
            return;
        }
        if (core.status.event.id == 'fly') {
            this.keyDownFly(keyCode);
            return;
        }
        if (core.status.event.id == 'viewMaps') {
            this.keyDownViewMaps(keyCode);
            return;
        }
        if (core.status.event.id=='shop') {
            this.keyDownShop(keyCode);
            return;
        }
        if (core.status.event.id=='selectShop') {
            this.keyDownQuickShop(keyCode);
            return;
        }
        if (core.status.event.id=='toolbox') {
            this.keyDownToolbox(keyCode);
            return;
        }
        if (core.status.event.id=='save' || core.status.event.id=='load') {
            this.keyDownSL(keyCode);
            return;
        }
        if (core.status.event.id=='switchs') {
            this.keyDownSwitchs(keyCode);
            return;
        }
        if (core.status.event.id=='settings') {
            this.keyDownSettings(keyCode);
            return;
        }
        if (core.status.event.id=='syncSave') {
            this.keyDownSyncSave(keyCode);
            return;
        }
        if (core.status.event.id=='syncSelect') {
            this.keyDownSyncSelect(keyCode);
            return;
        }
        if (core.status.event.id=='localSaveSelect') {
            this.keyDownLocalSaveSelect(keyCode);
            return;
        }
        if (core.status.event.id=='storageRemove') {
            this.keyDownStorageRemove(keyCode);
            return;
        }
        if (core.status.event.id=='cursor') {
            this.keyDownCursor(keyCode);
            return;
        }
        return;
    }
    if(!core.status.played) {
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
        case 13: case 32: case 67: case 51: // 快捷键3：飞
        // 因为加入了两次的检测机制,从keydown转移到keyup,同时保证位置信息正确,但以下情况会触发作图的bug:
        // 在鼠标的路线移动中使用飞,绿块会滞后一格,显示的位置不对,同时也不会倍以下的代码清除
        if (core.status.heroStop && core.hasItem('centerFly')) {
            if (core.status.usingCenterFly) {
                if (core.canUseItem('centerFly')) {
                    core.useItem('centerFly');
                    core.clearMap('ui', core.getHeroLoc('x')*32,core.getHeroLoc('y')*32,32,32);
                }
                else {
                    core.drawTip('当前不能使用中心对称飞行器');
                    core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
                }
                core.status.usingCenterFly = false;
            } else if (keyCode==51) {
                core.status.usingCenterFly = true;
                core.setAlpha('ui', 0.5);
                core.fillRect('ui',(12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32,core.canUseItem('centerFly')?'#00FF00':'#FF0000');
                core.setAlpha('ui', 1);
                core.drawTip("请确认当前中心对称飞行器的位置");
            }
        }
        break;
    }
    if (core.status.usingCenterFly && keyCode!=51) {
        core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
        core.status.usingCenterFly= false;
    }
}

////// 根据放开键的code来执行一系列操作 //////
actions.prototype.keyUp = function(keyCode, fromReplay) {
    if (!fromReplay&&core.isset(core.status.replay)&&core.status.replay.replaying) return;

    if (core.status.lockControl) {
        core.status.holdingKeys = [];
        // 全键盘操作部分
        if (core.status.event.id == 'text' && (keyCode==13 || keyCode==32 || keyCode==67)) {
            core.drawText();
            return;
        }
        if (core.status.event.id=='confirmBox') {
            this.keyUpConfirmBox(keyCode);
            return;
        }
        if (core.status.event.id == 'action') {
            this.keyUpAction(keyCode);
            return;
        }
        if (core.status.event.id=='about' && (keyCode==13 || keyCode==32 || keyCode==67)) {
            this.clickAbout();
            return;
        }
        if (core.status.event.id=='book') {
            this.keyUpBook(keyCode);
            return;
        }
        if (core.status.event.id=='book-detail' && (keyCode==13 || keyCode==32 || keyCode==67)) {
            this.clickBookDetail();
            return;
        }
        if (core.status.event.id=='fly') {
            this.keyUpFly(keyCode);
            return;
        }
        if (core.status.event.id == 'viewMaps') {
            this.keyUpViewMaps(keyCode);
            return;
        }
        if (core.status.event.id=='shop') {
            this.keyUpShop(keyCode);
            return;
        }
        if (core.status.event.id=='selectShop') {
            this.keyUpQuickShop(keyCode);
            return;
        }
        if (core.status.event.id=='toolbox') {
            this.keyUpToolbox(keyCode);
            return;
        }
        if (core.status.event.id=='save' || core.status.event.id=='load') {
            this.keyUpSL(keyCode);
            return;
        }
        if (core.status.event.id=='switchs') {
            this.keyUpSwitchs(keyCode);
            return;
        }
        if (core.status.event.id=='settings') {
            this.keyUpSettings(keyCode);
            return;
        }
        if (core.status.event.id=='syncSave') {
            this.keyUpSyncSave(keyCode);
            return;
        }
        if (core.status.event.id=='syncSelect') {
            this.keyUpSyncSelect(keyCode);
            return;
        }
        if (core.status.event.id=='localSaveSelect') {
            this.keyUpLocalSaveSelect(keyCode);
            return;
        }
        if (core.status.event.id=='storageRemove') {
            this.keyUpStorageRemove(keyCode);
            return;
        }
        if (core.status.event.id=='cursor') {
            this.keyUpCursor(keyCode);
            return;
        }
        return;
    }

    if(!core.status.played)
        return;

    switch (keyCode) {
        case 27: // ESC
            if (core.status.heroStop)
                core.openSettings(true);
            break;
        case 71: // G
            if (core.status.heroStop)
                core.useFly(true);
            break;
        case 88: // X
            if (core.status.heroStop)
                core.openBook(true);
            break;
        case 65: // A
            if (core.status.heroStop)
                core.doSL("autoSave", "load");
            break;
        case 83: // S
            if (core.status.heroStop)
                core.save(true);
            break;
        case 68: // D
            if (core.status.heroStop)
                core.load(true);
            break;
        case 69: // E
            if (core.status.heroStop)
                core.ui.drawCursor();
            break;
        case 84: // T
            if (core.status.heroStop)
                core.openToolbox(true);
            break;
        case 90: // Z
            if (core.status.heroStop)
                core.turnHero();
            break;
        case 75: // K
            if (core.status.heroStop)
                core.openQuickShop(true);
            break;
        case 32: // SPACE
            if (core.status.heroStop)
                core.getNextItem();
            break;
        case 72: // H
            if (core.status.heroStop)
                core.ui.drawHelp();
            break;
        case 82: // R
            if (core.status.heroStop) {
                core.ui.drawConfirmBox("确定要回放录像吗？", function () {
                    core.ui.closePanel();
                    var hard=core.status.hard, route=core.clone(core.status.route);
                    core.resetStatus(core.firstData.hero, hard, core.firstData.floorId, null, core.initStatus.maps);
                    core.events.setInitData(hard);
                    core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
                        core.startReplay(route);
                    }, true);
                }, function () {
                    core.ui.closePanel();
                });
            }
            break;
        case 33: case 34: // PAGEUP/PAGEDOWN
        if (core.status.heroStop) {
            if (core.flags.enableViewMaps) {
                core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
            }
            else {
                core.drawTip("本塔不允许浏览地图！");
            }
        }
        break;
        case 37: // UP
            break;
        case 38: // DOWN
            break;
        case 39: // RIGHT
            break;
        case 40: // DOWN
            break;
        case 49: // 快捷键1：破
            if (core.status.heroStop && core.hasItem('pickaxe')) {
                if (core.canUseItem('pickaxe')) {
                    core.useItem('pickaxe');
                }
                else {
                    core.drawTip('当前不能使用破墙镐');
                }
            }
            break;
        case 50: // 快捷键2：炸
            if (core.status.heroStop) {
                if (core.hasItem('bomb')) {
                    if (core.canUseItem('bomb')) {
                        core.useItem('bomb');
                    }
                    else {
                        core.drawTip('当前不能使用炸弹');
                    }
                }
                else if (core.hasItem('hammer')) {
                    if (core.canUseItem('hammer')) {
                        core.useItem('hammer');
                    }
                    else {
                        core.drawTip('当前不能使用圣锤');
                    }

                }
            }
            break;

    }

    if (core.isset(core.status.automaticRoute)&&core.status.automaticRoute.autoHeroMove) {
        core.stopAutomaticRoute();
    }

    core.stopHero();

}

////// 点击（触摸）事件按下时 //////
actions.prototype.ondown = function (x ,y) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.status.played || core.status.lockControl) {
        this.onclick(x, y, []);
        if (core.timeout.onDownTimeout==null) {
            core.timeout.onDownTimeout = setTimeout(function () {
                if (core.interval.onDownInterval == null) {
                    core.interval.onDownInterval = setInterval(function () {
                        if (!core.actions.longClick()) {
                            clearInterval(core.interval.onDownInterval);
                            core.interval.onDownInterval = null;
                        }
                    }, 40)
                }
            }, 500);
        }
        return;
    }

    core.status.downTime = new Date();
    core.clearMap('ui', 0, 0, 416,416);
    var pos={'x':x,'y':y}
    core.status.stepPostfix=[];
    core.status.stepPostfix.push(pos);
    core.fillPosWithPoint(pos);
}

////// 当在触摸屏上滑动时 //////
actions.prototype.onmove = function (x ,y) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // if (core.status.holdingPath==0){return;}
    //core.status.mouseOutCheck =1;
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

////// 当点击（触摸）事件放开时 //////
actions.prototype.onup = function () {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;

    clearTimeout(core.timeout.onDownTimeout);
    core.timeout.onDownTimeout = null;
    clearInterval(core.interval.onDownInterval);
    core.interval.onDownInterval = null;

    // core.status.holdingPath=0;
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
        if (!core.status.lockControl) {
            core.canvas.ui.clearRect(0, 0, 416,416);
            core.canvas.ui.restore();
        }

        // 长按
        if (!core.status.lockControl && stepPostfix.length==0 && core.status.downTime!=null && new Date()-core.status.downTime>=1000) {
            core.waitHeroToStop(function () {
                // 绘制快捷键
                core.ui.drawKeyBoard();
            });
        }
        else {
            //posx,posy是寻路的目标点,stepPostfix是后续的移动
            this.onclick(posx,posy,stepPostfix);
        }
        core.status.downTime=null;
    }
}

////// 获得点击事件相对左上角的坐标（0到12之间） //////
actions.prototype.getClickLoc = function (x, y) {

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

////// 具体点击屏幕上(x,y)点时，执行的操作 //////
actions.prototype.onclick = function (x, y, stepPostfix) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // console.log("Click: (" + x + "," + y + ")");

    stepPostfix=stepPostfix||[];

    // 非游戏屏幕内
    if (x<0 || y<0 || x>12 || y>12) return;

    // 中心对称飞行器
    if (core.status.usingCenterFly) {
        if (x!=12-core.getHeroLoc('x') || y!=12-core.getHeroLoc('y')) {
            core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
        } else {
            if (core.canUseItem('centerFly')) {
                core.useItem('centerFly');
                core.clearMap('ui', core.getHeroLoc('x')*32,core.getHeroLoc('y')*32,32,32);
                return;
            }
            else {
                core.drawTip('当前不能使用中心对称飞行器');
                core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
            }
        }
        core.status.usingCenterFly= false;
    }

    // 寻路
    if (!core.status.lockControl) {
        core.setAutomaticRoute(x, y, stepPostfix);
        return;
    }

    // 怪物手册
    if (core.status.event.id == 'book') {
        this.clickBook(x,y);
        return;
    }

    // 怪物详细信息
    if (core.status.event.id == 'book-detail') {
        this.clickBookDetail(x,y);
        return;
    }

    // 楼层飞行器
    if (core.status.event.id == 'fly') {
        this.clickFly(x,y);
        return;
    }

    // 查看地图
    if (core.status.event.id == 'viewMaps') {
        this.clickViewMaps(x,y);
        return;
    }

    // 开关
    if (core.status.event.id == 'switchs') {
        this.clickSwitchs(x,y);
        return;
    }

    // 设置
    if (core.status.event.id == 'settings') {
        this.clickSettings(x,y);
        return;
    }

    // 商店
    if (core.status.event.id == 'shop') {
        this.clickShop(x,y);
        return;
    }

    // 快捷商店
    if (core.status.event.id == 'selectShop') {
        this.clickQuickShop(x,y);
        return;
    }

    // 工具栏
    if (core.status.event.id == 'toolbox') {
        this.clickToolbox(x,y);
        return;
    }

    // 存读档
    if (core.status.event.id == 'save' || core.status.event.id == 'load') {
        this.clickSL(x,y);
        return;
    }

    // 选项
    if (core.status.event.id == 'confirmBox') {
        this.clickConfirmBox(x,y);
        return;
    }

    if (core.status.event.id == 'keyBoard') {
        this.clickKeyBoard(x,y);
        return;
    }

    // 关于
    if (core.status.event.id == 'about') {
        this.clickAbout(x,y);
        return;
    }

    if (core.status.event.id == 'action') {
        this.clickAction(x,y);
        return;
    }

    // 纯文本
    if (core.status.event.id == 'text') {
        core.drawText();
        return;
    }

    // 同步存档
    if (core.status.event.id == 'syncSave') {
        this.clickSyncSave(x,y);
        return;
    }

    if (core.status.event.id == 'syncSelect') {
        this.clickSyncSelect(x,y);
        return;
    }

    if (core.status.event.id == 'localSaveSelect') {
        this.clickLocalSaveSelect(x,y);
        return;
    }
    if (core.status.event.id=='storageRemove') {
        this.clickStorageRemove(x,y);
        return;
    }

    if (core.status.event.id == 'cursor') {
        this.clickCursor(x,y);
        return;
    }

}

////// 滑动鼠标滚轮时的操作 //////
actions.prototype.onmousewheel = function (direct) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // 向下滚动是 -1 ,向上是 1

    // 楼层飞行器
    if (core.status.lockControl && core.status.event.id == 'fly') {
        if (direct==1) core.ui.drawFly(core.status.event.data+1);
        if (direct==-1) core.ui.drawFly(core.status.event.data-1);
        return;
    }

    // 怪物手册
    if (core.status.lockControl && core.status.event.id == 'book') {
        if (direct==1) core.ui.drawBook(core.status.event.data - 6);
        if (direct==-1) core.ui.drawBook(core.status.event.data + 6);
        return;
    }

    // 存读档
    if (core.status.lockControl && (core.status.event.id == 'save' || core.status.event.id == 'load')) {
        if (direct==1) core.ui.drawSLPanel(core.status.event.data - 10);
        if (direct==-1) core.ui.drawSLPanel(core.status.event.data + 10);
        return;
    }

    // 浏览地图
    if (core.status.lockControl && core.status.event.id == 'viewMaps') {
        if (direct==1) core.ui.drawMaps(core.status.event.data+1);
        if (direct==-1) core.ui.drawMaps(core.status.event.data-1);
        return;
    }
}

/////////////////// 在某个界面时的按键点击效果 ///////////////////

////// 长按 //////
actions.prototype.longClick = function () {
    if (!core.isPlaying()) return false;
    if (core.status.event.id=='text') {
        core.drawText();
        return true;
    }
    if (core.status.event.id=='action' && core.status.event.data.type=='text') {
        core.doAction();
        return true;
    }
    return false;
}

////// 按下Ctrl键时（快捷跳过对话） //////
actions.prototype.keyDownCtrl = function () {
    if (core.status.event.id=='text') {
        core.drawText();
        return;
    }
    if (core.status.event.id=='action' && core.status.event.data.type=='text') {
        core.doAction();
        return;
    }
}

////// 点击确认框时 //////
actions.prototype.clickConfirmBox = function (x,y) {
    if ((x == 4 || x == 5) && y == 7 && core.isset(core.status.event.data.yes))
        core.status.event.data.yes();
    if ((x == 7 || x == 8) && y == 7 && core.isset(core.status.event.data.no))
        core.status.event.data.no();
}

////// 键盘操作确认框时 //////
actions.prototype.keyUpConfirmBox = function (keycode) {
    if (keycode==37) {
        core.status.event.selection=0;
        core.ui.drawConfirmBox(core.status.event.ui, core.status.event.data.yes, core.status.event.data.no);
    }

    if (keycode==39) {
        core.status.event.selection=1;
        core.ui.drawConfirmBox(core.status.event.ui, core.status.event.data.yes, core.status.event.data.no);
    }

    if (keycode==13 || keycode==32 || keycode==67) {
        if (core.status.event.selection==0 && core.isset(core.status.event.data.yes)) {
            core.status.event.selection=null;
            core.status.event.data.yes();
        }
        if (core.status.event.selection==1 && core.isset(core.status.event.data.no)) {
            core.status.event.selection=null;
            core.status.event.data.no();
        }
    }
}

////// 自定义事件时的点击操作 //////
actions.prototype.clickAction = function (x,y) {

    if (core.status.event.data.type=='text') {
        // 文字
        core.doAction();
        return;
    }
    if (core.status.event.data.type=='choices') {
        // 选项
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length==0) return;
        if (x >= 5 && x <= 7) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            if (y>=topIndex && y<topIndex+choices.length) {
                // 选择
                core.status.route.push("choices:"+(y-topIndex));
                core.insertAction(choices[y-topIndex].action);
                core.doAction();
            }
        }
    }
}

////// 自定义事件时，按下某个键的操作 //////
actions.prototype.keyDownAction = function (keycode) {
    if (core.status.event.data.type=='choices') {
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length>0) {
            if (keycode==38) {
                core.status.event.selection--;
                core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
            }
            if (keycode==40) {
                core.status.event.selection++;
                core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
            }
        }
    }
}

////// 自定义事件时，放开某个键的操作 //////
actions.prototype.keyUpAction = function (keycode) {
    if (core.status.event.data.type=='text' && (keycode==13 || keycode==32 || keycode==67)) {
        core.doAction();
        return;
    }
    if (core.status.event.data.type=='choices') {
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length>0) {
            if (keycode==13 || keycode==32 || keycode==67) {
                core.status.route.push("choices:"+core.status.event.selection);
                core.insertAction(choices[core.status.event.selection].action);
                core.doAction();
            }
        }
    }
}

////// 怪物手册界面的点击操作 //////
actions.prototype.clickBook = function(x,y) {
    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        core.ui.drawBook(core.status.event.data - 6);
        return;
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawBook(core.status.event.data + 6);
        return;
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        if (core.status.event.selection==null)
            core.ui.closePanel();
        else {
            core.status.boxAnimateObjs = [];
            core.ui.drawMaps(core.status.event.selection);
        }
        return;
    }
    // 怪物信息
    var data = core.status.event.data;
    if (core.isset(data) && y<12) {
        var page=parseInt(data/6);
        var index=6*page+parseInt(y/2);
        core.ui.drawBook(index);
        core.ui.drawBookDetail(index);
    }
    return;
}

////// 怪物手册界面时，按下某个键的操作 //////
actions.prototype.keyDownBook = function (keycode) {
    if (keycode==37) core.ui.drawBook(core.status.event.data-6);
    if (keycode==38) core.ui.drawBook(core.status.event.data-1);
    if (keycode==39) core.ui.drawBook(core.status.event.data+6);
    if (keycode==40) core.ui.drawBook(core.status.event.data+1);
    if (keycode==33) core.ui.drawBook(core.status.event.data-6);
    if (keycode==34) core.ui.drawBook(core.status.event.data+6);
    return;
}

////// 怪物手册界面时，放开某个键的操作 //////
actions.prototype.keyUpBook = function (keycode) {
    if (keycode==27 || keycode==88) {
        if (core.status.event.selection==null)
            core.ui.closePanel();
        else {
            core.status.boxAnimateObjs = [];
            core.ui.drawMaps(core.status.event.selection);
        }
        return;
    }
    if (keycode==13 || keycode==32 || keycode==67) {
        var data=core.status.event.data;
        if (core.isset(data)) {
            this.clickBook(6, 2*(data%6));
        }
        return;
    }
}

////// 怪物手册属性显示界面时的点击操作 //////
actions.prototype.clickBookDetail = function () {
    core.clearMap('data', 0, 0, 416, 416);
    core.status.event.id = 'book';
}

////// 楼层传送器界面时的点击操作 //////
actions.prototype.clickFly = function(x,y) {
    if ((x==10 || x==11) && y==9) core.ui.drawFly(core.status.event.data-1);
    if ((x==10 || x==11) && y==5) core.ui.drawFly(core.status.event.data+1);
    if (x>=5 && x<=7 && y==12) core.ui.closePanel();
    if (x>=0 && x<=9 && y>=3 && y<=11) {
        var index=core.status.hero.flyRange.indexOf(core.status.floorId);
        var stair=core.status.event.data<index?"upFloor":"downFloor";
        var floorId=core.status.event.data;
        var toFloor = core.status.hero.flyRange[floorId];
        core.status.route.push("fly:"+toFloor);
        core.ui.closePanel();
        core.changeFloor(toFloor, stair);
    }
    return;
}

////// 楼层传送器界面时，按下某个键的操作 //////
actions.prototype.keyDownFly = function (keycode) {
    if (keycode==37 || keycode==38) core.ui.drawFly(core.status.event.data+1);
    else if (keycode==39 || keycode==40) core.ui.drawFly(core.status.event.data-1);
    return;
}

////// 楼层传送器界面时，放开某个键的操作 //////
actions.prototype.keyUpFly = function (keycode) {
    if (keycode==71 || keycode==27 || keycode==88)
        core.ui.closePanel();
    if (keycode==13 || keycode==32 || keycode==67)
        this.clickFly(5,5);
    return;
}

////// 查看地图界面时的点击操作 //////
actions.prototype.clickViewMaps = function (x,y) {
    if(y<=4) {
        core.ui.drawMaps(core.status.event.data+1);
    }
    else if (y>=8) {
        core.ui.drawMaps(core.status.event.data-1);
    }
    else {
        core.clearMap('data', 0, 0, 416, 416);
        core.setOpacity('data', 1);
        core.ui.closePanel();
    }
}

////// 查看地图界面时，按下某个键的操作 //////
actions.prototype.keyDownViewMaps = function (keycode) {
    if (keycode==37 || keycode==38 || keycode==33) core.ui.drawMaps(core.status.event.data+1);
    else if (keycode==39 || keycode==40 || keycode==34) core.ui.drawMaps(core.status.event.data-1);
    return;
}

////// 查看地图界面时，放开某个键的操作 //////
actions.prototype.keyUpViewMaps = function (keycode) {
    if (keycode==27 || keycode==13 || keycode==32 || keycode==67) {
        core.clearMap('data', 0, 0, 416, 416);
        core.setOpacity('data', 1);
        core.ui.closePanel();
    }
    if (keycode==88) {
        core.openBook(false);
    }
    return;
}

////// 商店界面时的点击操作 //////
actions.prototype.clickShop = function(x,y) {
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(choices.length / 2);
        if (y>=topIndex && y<topIndex+choices.length) {

            core.status.event.selection=y-topIndex;

            var money = core.getStatus('money'), experience = core.getStatus('experience');
            var times = shop.times, need = eval(shop.need);
            var use = shop.use;
            var use_text = use=='money'?"金币":"经验";

            var choice = choices[y-topIndex];
            if (core.isset(choice.need))
                need = eval(choice.need);

            if (need > eval(use)) {
                core.drawTip("你的"+use_text+"不足");
                return false;
            }

            core.status.event.data.actions.push(y-topIndex);

            eval(use+'-='+need);
            core.setStatus('money', money);
            core.setStatus('experience', experience);

            // 更新属性
            choice.effect.split(";").forEach(function (t) {
                core.doEffect(t);
            });
            core.updateStatusBar();
            shop.times++;
            core.events.openShop(core.status.event.data.id);
        }
        // 离开
        else if (y==topIndex+choices.length) {
            if (core.status.event.data.actions.length>0) {
                core.status.route.push("shop:"+core.status.event.data.id+":"+core.status.event.data.actions.join(""));
            }

            core.status.event.data.actions = [];
            core.status.boxAnimateObjs = [];
            if (core.status.event.data.fromList)
                core.ui.drawQuickShop();
            else core.ui.closePanel();
        }
        else return false;
    }
    return true;
}

////// 商店界面时，按下某个键的操作 //////
actions.prototype.keyDownShop = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 商店界面时，放开某个键的操作 //////
actions.prototype.keyUpShop = function (keycode) {
    if (keycode==27 || keycode==88) {
        if (core.status.event.data.actions.length>0) {
            core.status.route.push("shop:"+core.status.event.data.id+":"+core.status.event.data.actions.join(""));
        }

        core.status.event.data.actions = [];

        core.status.boxAnimateObjs = [];

        if (core.status.event.data.fromList)
            core.ui.drawQuickShop();
        else
            core.ui.closePanel();
        return;
    }
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt(choices.length / 2);
        this.clickShop(6, topIndex+core.status.event.selection);
    }
    return;
}

////// 快捷商店界面时的点击操作 //////
actions.prototype.clickQuickShop = function(x, y) {
    var shopList = core.status.shops, keys = Object.keys(shopList);
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(keys.length / 2);
        if (y>=topIndex && y<topIndex+keys.length) {
            var reason = core.events.canUseQuickShop(keys[y - topIndex]);
            if (core.isset(reason)) {
                core.drawText(reason);
                return;
            }
            core.events.openShop(keys[y - topIndex], true);
            if (core.status.event.id=='shop')
                core.status.event.data.fromList = true;
        }
        // 离开
        else if (y==topIndex+keys.length)
            core.ui.closePanel();
    }
}

////// 快捷商店界面时，按下某个键的操作 //////
actions.prototype.keyDownQuickShop = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 快捷商店界面时，放开某个键的操作 //////
actions.prototype.keyUpQuickShop = function (keycode) {
    if (keycode==27 || keycode==75 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    var shopList = core.status.shops, keys = Object.keys(shopList);
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt(keys.length / 2);
        this.clickQuickShop(6, topIndex+core.status.event.selection);
    }
    return;
}

////// 工具栏界面时的点击操作 //////
actions.prototype.clickToolbox = function(x,y) {
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel();
        return;
    }
    if (x>=10 && x<=12 && y<=1) {
        if (!core.isset(core.status.event.data)) return;
        if (!core.flags.enableDeleteItem) {
            core.drawTip("不支持删除道具！");
            return;
        }
        core.removeItem(core.status.event.data);
        core.status.event.data = null;
        core.ui.drawToolbox();
        return;
    }

    var index=0;
    if (y==4||y==5||y==9||y==10) index=parseInt(x/2);
    else index=6+parseInt(x/2);
    if (y>=9) index+=100;
    this.clickToolboxIndex(index);
}

////// 选择工具栏界面中某个Index后的操作 //////
actions.prototype.clickToolboxIndex = function(index) {
    var items = null;
    var ii=index;
    if (ii<100)
        items = Object.keys(core.status.hero.items.tools).sort();
    else {
        ii-=100;
        items = Object.keys(core.status.hero.items.constants).sort();
    }
    if (items==null) return;
    if (ii>=items.length) return;
    var itemId=items[ii];
    if (itemId==core.status.event.data) {
        core.events.useItem(itemId);
    }
    else {
        core.ui.drawToolbox(index);
    }
}

////// 工具栏界面时，按下某个键的操作 //////
actions.prototype.keyDownToolbox = function (keycode) {
    if (!core.isset(core.status.event.data)) return;

    var tools = Object.keys(core.status.hero.items.tools).sort();
    var constants = Object.keys(core.status.hero.items.constants).sort();
    var index=core.status.event.selection;

    if (keycode==37) { // left
        if ((index>0 && index<100) || index>100) {
            this.clickToolboxIndex(index-1);
            return;
        }
        if (index==100 && tools.length>0) {
            this.clickToolboxIndex(tools.length-1);
            return;
        }
    }
    if (keycode==38) { // up
        if ((index>5 && index<100) || index>105) {
            this.clickToolboxIndex(index-6);
            return;
        }
        if (index>=100 && index<=105) {
            if (tools.length>6) {
                this.clickToolboxIndex(Math.min(tools.length-1, index-100+6));
            }
            else if (tools.length>0) {
                this.clickToolboxIndex(Math.min(tools.length-1, index-100));
            }
            return;
        }
    }
    if (keycode==39) { // right
        if ((index<tools.length-1) || (index>=100 && index<constants.length+100)) {
            this.clickToolboxIndex(index+1);
            return;
        }
        if (index==tools.length-1 && constants.length>0) {
            this.clickToolboxIndex(100);
            return;
        }
    }
    if (keycode==40) { // down
        if (index<=5) {
            if (tools.length>6) {
                this.clickToolboxIndex(Math.min(tools.length-1, index+6));
            }
            else if (constants.length>0) {
                this.clickToolboxIndex(100+Math.min(constants.length-1, index));
            }
            return;
        }
        if (index>5 && index<100 && constants.length>0) {
            this.clickToolboxIndex(100+Math.min(constants.length-1, index-6));
            return;
        }
        if (index>=100 && index<=105 && constants.length>6) {
            this.clickToolboxIndex(Math.min(100+constants.length-1, index+6));
            return;
        }
    }
}

////// 工具栏界面时，放开某个键的操作 //////
actions.prototype.keyUpToolbox = function (keycode) {
    if (keycode==84 || keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    if (!core.isset(core.status.event.data)) return;

    if (keycode==13 || keycode==32 || keycode==67) {
        this.clickToolboxIndex(core.status.event.selection);
        return;
    }

    if (keycode==46) { // delete
        if (!core.isset(core.status.event.data)) return;
        if (!core.flags.enableDeleteItem) {
            core.drawTip("不支持删除道具！");
            return;
        }
        core.removeItem(core.status.event.data);
        core.status.event.data = null;
        core.ui.drawToolbox();
        return;
    }

}

////// 存读档界面时的点击操作 //////
actions.prototype.clickSL = function(x,y) {

    var index=core.status.event.data;
    var page = parseInt(index/10), offset=index%10;

    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        core.ui.drawSLPanel(10*(page-1)+offset);
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawSLPanel(10*(page+1)+offset);
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel();
        if (!core.isPlaying()) {
            core.showStartAnimate();
        }
        return;
    }

    var index=6*page+1;
    if (y>=1 && y<=4) {
        if (x>=1 && x<=3) core.doSL("autoSave", core.status.event.id);
        if (x>=5 && x<=7) core.doSL(5*page+1, core.status.event.id);
        if (x>=9 && x<=11) core.doSL(5*page+2, core.status.event.id);
    }
    if (y>=7 && y<=10) {
        if (x>=1 && x<=3) core.doSL(5*page+3, core.status.event.id);
        if (x>=5 && x<=7) core.doSL(5*page+4, core.status.event.id);
        if (x>=9 && x<=11) core.doSL(5*page+5, core.status.event.id);
    }
}

////// 存读档界面时，按下某个键的操作 //////
actions.prototype.keyDownSL = function(keycode) {

    var index=core.status.event.data;
    var page = parseInt(index/10), offset=index%10;

    if (keycode==37) { // left
        if (offset==0) {
            core.ui.drawSLPanel(10*(page-1) + 5);
        }
        else {
            core.ui.drawSLPanel(index - 1);
        }
        return;
    }
    if (keycode==38) { // up
        if (offset<3) {
            core.ui.drawSLPanel(10*(page-1) + offset + 3);
        }
        else {
            core.ui.drawSLPanel(index - 3);
        }
        return;
    }
    if (keycode==39) { // right
        if (offset==5) {
            core.ui.drawSLPanel(10*(page+1)+1);
        }
        else {
            core.ui.drawSLPanel(index + 1);
        }
        return;
    }
    if (keycode==40) { // down
        if (offset>=3) {
            core.ui.drawSLPanel(10*(page+1) + offset - 3);
        }
        else {
            core.ui.drawSLPanel(index + 3);
        }
        return;
    }
    if (keycode==33) { // PAGEUP
        core.ui.drawSLPanel(10*(page-1) + offset);
        return;
    }
    if (keycode==34) { // PAGEDOWN
        core.ui.drawSLPanel(10*(page+1) + offset);
        return;
    }
}

////// 存读档界面时，放开某个键的操作 //////
actions.prototype.keyUpSL = function (keycode) {

    var index=core.status.event.data;
    var page = parseInt(index/10), offset=index%10;

    if (keycode==27 || keycode==88 || (core.status.event.id == 'save' && keycode==83) || (core.status.event.id == 'load' && keycode==68)) {
        core.ui.closePanel();
        if (!core.isPlaying()) {
            core.showStartAnimate();
        }
        return;
    }
    if (keycode==13 || keycode==32 || keycode==67) {
        if (offset==0) {
            core.doSL("autoSave", core.status.event.id);
        }
        else {
            core.doSL(5*page+offset, core.status.event.id);
        }
        return;
    }
}

////// 系统设置界面时的点击操作 //////
actions.prototype.clickSwitchs = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;
    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y-topIndex;
        switch (selection) {
            case 0:
                core.musicStatus.bgmStatus = !core.musicStatus.bgmStatus;
                if (core.musicStatus.bgmStatus)
                    core.resumeBgm();
                else {
                    core.pauseBgm();
                    core.musicStatus.playingBgm = null;
                }
                core.setLocalStorage('bgmStatus', core.musicStatus.bgmStatus);
                core.ui.drawSwitchs();
                break;
            case 1:
                core.musicStatus.soundStatus = !core.musicStatus.soundStatus;
                core.setLocalStorage('soundStatus', core.musicStatus.soundStatus);
                core.ui.drawSwitchs();
                break;
            case 2:
                if (!core.flags.canOpenBattleAnimate) {
                    core.drawTip("本塔不能开启战斗动画！");
                }
                else {
                    core.flags.battleAnimate=!core.flags.battleAnimate;
                    core.setLocalStorage('battleAnimate', core.flags.battleAnimate);
                    core.ui.drawSwitchs();
                }
                break;
            case 3:
                core.flags.displayEnemyDamage=!core.flags.displayEnemyDamage;
                core.updateFg();
                core.setLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
                core.ui.drawSwitchs();
                break;
            case 4:
                core.flags.displayExtraDamage=!core.flags.displayExtraDamage;
                core.updateFg();
                core.setLocalStorage('extraDamage', core.flags.displayExtraDamage);
                core.ui.drawSwitchs();
                break;
            case 5:
                window.open(core.firstData.name+".zip", "_blank");
                break;
            case 6:
                core.status.event.selection=0;
                core.ui.drawSettings();
                break;
        }
    }
}

////// 系统设置界面时，按下某个键的操作 //////
actions.prototype.keyDownSwitchs = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 系统设置界面时，放开某个键的操作 //////
actions.prototype.keyUpSwitchs = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=0;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSwitchs(6, topIndex+core.status.event.selection);
    }
}


////// 系统菜单栏界面时的点击事件 //////
actions.prototype.clickSettings = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;
    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y-topIndex;

        switch (selection) {
            case 0:
                core.status.event.selection=0;
                core.ui.drawSwitchs();
                break;
            case 1:
                core.status.event.selection=0;
                core.ui.drawQuickShop();
                break;
            case 2:
                if (!core.flags.enableViewMaps) {
                    core.drawTip("本塔不允许浏览地图！");
                }
                else {
                    core.drawText("\t[系统提示]即将进入浏览地图模式。\n\n点击地图上半部分，或按[↑]键可查看前一张地图\n点击地图下半部分，或按[↓]键可查看后一张地图\n点击地图中间，或按[ESC]键可离开浏览地图模式\n此模式下可以打开怪物手册以查看某层楼的怪物属性", function () {
                        core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
                    })
                }
                break;
            case 3:
                core.status.event.selection=0;
                core.ui.drawSyncSave();
                break;
            case 4:
                core.status.event.selection=1;
                core.ui.drawConfirmBox("你确定要重新开始吗？", function () {
                    core.ui.closePanel();
                    core.restart();
                }, function () {
                    core.status.event.selection=3;
                    core.ui.drawSettings();
                });
                break;
            case 5:
                core.ui.drawWaiting("正在拉取统计信息，请稍后...");

                var formData = new FormData();
                formData.append('type', 'statistics');
                formData.append('name', core.firstData.name);
                formData.append('version', core.firstData.version);

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/games/upload.php");

                xhr.onload = function(e) {
                    if (xhr.status==200) {
                        var response = JSON.parse(xhr.response);
                        if (response.code<0) {
                            core.drawText("出错啦！\n无法拉取统计信息。\n错误原因："+response.msg);
                        }
                        else {
                            var text="\t[本塔统计信息]";
                            var toAdd=false;
                            response.data.forEach(function (t) {
                                if (toAdd) text+="\n\n";
                                toAdd=true;
                                if (t.hard!='') text+=t.hard+"难度： "
                                text+="已有"+t.people+"人次游戏，"+t.score+"人次通关。";
                                t.info.forEach(function(ending) {
                                    if (ending.ending!='') {
                                        text+="\n"+ending.ending+"： 已有"+ending.score+"人次通关。";
                                    }
                                    if (core.isset(ending.max) && ending.max>0) {
                                        text+="\n当前MAX为"+ending.max+"，最早由 "+(ending.username||"匿名")+" 于"+core.formatDate(new Date(1000*ending.timestamp))+"打出。";
                                    }
                                })
                            })
                            core.drawText(text);
                        }
                    }
                    else {
                        core.drawText("出错啦！\n无法拉取统计信息。\n错误原因：HTTP "+xhr.status);
                    }
                };
                xhr.ontimeout = function() {
                    core.drawText("出错啦！\n无法拉取统计信息。\n错误原因：Timeout");
                }
                xhr.onerror = function() {
                    core.drawText("出错啦！\n无法拉取统计信息。\n错误原因：XHR Error");
                }
                xhr.send(formData);
                break;
            case 6:
                core.ui.drawHelp();
                break;
            case 7:
                core.ui.drawAbout();
                break;
            case 8:
                core.ui.closePanel();
                break;
        }
    }
    return;
}

////// 系统菜单栏界面时，按下某个键的操作 //////
actions.prototype.keyDownSettings = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 系统菜单栏界面时，放开某个键的操作 //////
actions.prototype.keyUpSettings = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSettings(6, topIndex+core.status.event.selection);
    }
}

////// 同步存档界面时的点击操作 //////
actions.prototype.clickSyncSave = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;
    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y-topIndex;
        switch (selection) {
            case 0:
                // core.syncSave("save");
                core.status.event.selection=0;
                core.ui.drawSyncSelect();
                break;
            case 1:
                core.syncLoad();
                break;
            case 2:
                core.status.event.selection=0;
                core.ui.drawLocalSaveSelect();
                break;
            case 3:
                core.readFile(function (obj) {
                    if (obj.name!=core.firstData.name) {
                        alert("存档和游戏不一致！");
                        return;
                    }
                    if (obj.version!=core.firstData.version) {
                        alert("游戏版本不一致！");
                        return;
                    }
                    if (!core.isset(obj.data)) {
                        alert("无效的存档！");
                        return;
                    }
                    var data=obj.data;

                    if (data instanceof Array) {
                        core.ui.drawConfirmBox("所有本地存档都将被覆盖，确认？", function () {
                            for (var i=1;i<=150;i++) {
                                if (i<=data.length) {
                                    core.setLocalStorage("save"+i, data[i-1]);
                                }
                                else {
                                    core.removeLocalStorage("save"+i);
                                }
                            }
                            core.drawText("读取成功！\n你的本地所有存档均已被覆盖。");
                        }, function () {
                            core.status.event.selection=0;
                            core.ui.drawSyncSave();
                        })
                    }
                    else {
                        var index=150;
                        for (var i=150;i>=1;i--) {
                            if (core.getLocalStorage("save"+i, null)==null)
                                index=i;
                            else break;
                        }
                        core.setLocalStorage("save"+index, data);
                        core.drawText("同步成功！\n单存档已覆盖至存档"+index);
                    }
                }, function () {

                });
                break;
            case 4:
                core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5route", JSON.stringify({
                    'name': core.firstData.name,
                    'hard': core.status.hard,
                    'route': core.encodeRoute(core.status.route)
                }));
                break;
            case 5:
                core.status.event.selection=0;
                core.ui.drawStorageRemove();
                break;
            case 6:
                core.status.event.selection=3;
                core.ui.drawSettings();
                break;

        }
    }
    return;
}

////// 同步存档界面时，按下某个键的操作 //////
actions.prototype.keyDownSyncSave = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 同步存档界面时，放开某个键的操作 //////
actions.prototype.keyUpSyncSave = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=2;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSyncSave(6, topIndex+core.status.event.selection);
    }
}

////// 同步存档选择界面时的点击操作 //////
actions.prototype.clickSyncSelect = function (x, y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                core.syncSave('all');
                break;
            case 1:
                core.syncSave();
                break;
            case 2:
                core.status.event.selection=0;
                core.ui.drawSyncSave();
                break;
        }
    }
}

////// 同步存档选择界面时，按下某个键的操作 //////
actions.prototype.keyDownSyncSelect = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 同步存档选择界面时，放开某个键的操作 //////
actions.prototype.keyUpSyncSelect = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=0;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSyncSelect(6, topIndex+core.status.event.selection);
    }
}

////// 存档下载界面时的点击操作 //////
actions.prototype.clickLocalSaveSelect = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);

    var saves=null;

    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                saves=[];
                for (var i=1;i<=150;i++) {
                    var data = core.getLocalStorage("save"+i, null);
                    if (core.isset(data)) {
                        saves.push(data);
                    }
                }
                break;
            case 1:
                for (var i=150;i>=1;i--) {
                    saves=core.getLocalStorage("save"+i, null);
                    if (core.isset(saves)) {
                        break;
                    }
                }
                break;
            case 2:
                break;
        }
    }
    if (core.isset(saves)) {
        var content = {
            "name": core.firstData.name,
            "version": core.firstData.version,
            "data": saves
        }
        core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5save", JSON.stringify(content));
    }
    core.status.event.selection=2;
    core.ui.drawSyncSave();
}

////// 存档下载界面时，按下某个键的操作 //////
actions.prototype.keyDownLocalSaveSelect = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 存档下载界面时，放开某个键的操作 //////
actions.prototype.keyUpLocalSaveSelect = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=0;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickLocalSaveSelect(6, topIndex+core.status.event.selection);
    }
}

////// 存档删除界面时的点击操作 //////
actions.prototype.clickStorageRemove = function (x, y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);

    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                localStorage.clear();
                core.drawText("\t[操作成功]你的所有存档已被清空。");
                break;
            case 1:
                for (var i=1;i<=150;i++) {
                    core.removeLocalStorage("save"+i);
                }
                core.drawText("\t[操作成功]当前塔的存档已被清空。");
                core.removeLocalStorage("autoSave");
                break;
            case 2:
                core.status.event.selection=5;
                core.ui.drawSyncSave();
                break;
        }
    }
}

////// 存档删除界面时，按下某个键的操作 //////
actions.prototype.keyDownStorageRemove = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 存档删除界面时，放开某个键的操作 //////
actions.prototype.keyUpStorageRemove = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=5;
        core.ui.drawSyncSave();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickStorageRemove(6, topIndex+core.status.event.selection);
    }
}

////// “虚拟键盘”界面时的点击操作 //////
actions.prototype.clickKeyBoard = function (x, y) {
    if (y==3 && x>=1 && x<=11) {
        core.ui.closePanel();
        core.keyUp(112+x-1); // F1-F12: 112-122
    }
    if (y==4 && x>=1 && x<=10) {
        core.ui.closePanel();
        core.keyUp(x==10?48:48+x); // 1-9: 49-57; 0: 48
    }
    // 字母
    var lines = [
        ["Q","W","E","R","T","Y","U","I","O","P"],
        ["A","S","D","F","G","H","J","K","L"],
        ["Z","X","C","V","B","N","M"],
    ];
    if (y==5 && x>=1 && x<=10) {
        core.ui.closePanel();
        core.keyUp(lines[0][x-1].charCodeAt(0));
    }
    if (y==6 && x>=1 && x<=9) {
        core.ui.closePanel();
        core.keyUp(lines[1][x-1].charCodeAt(0));
    }
    if (y==7 && x>=1 && x<=7) {
        core.ui.closePanel();
        core.keyUp(lines[2][x-1].charCodeAt(0));
    }
    if (y==8 && x>=1 && x<=11) {
        core.ui.closePanel();
        if (x==1) core.keyUp(189); // -
        if (x==2) core.keyUp(187); // =
        if (x==3) core.keyUp(219); // [
        if (x==4) core.keyUp(221); // ]
        if (x==5) core.keyUp(220); // \
        if (x==6) core.keyUp(186); // ;
        if (x==7) core.keyUp(222); // '
        if (x==8) core.keyUp(188); // ,
        if (x==9) core.keyUp(190); // .
        if (x==10) core.keyUp(191); // /
        if (x==11) core.keyUp(192); // `
    }
    if (y==9 && x>=1 && x<=10) {
        core.ui.closePanel();
        if (x==1) core.keyUp(27); // ESC
        if (x==2) core.keyUp(9); // TAB
        if (x==3) core.keyUp(20); // CAPS
        if (x==4) core.keyUp(16); // SHIFT
        if (x==5) core.keyUp(17); // CTRL
        if (x==6) core.keyUp(18); // ALT
        if (x==7) core.keyUp(32); // SPACE
        if (x==8) core.keyUp(8); // BACKSPACE
        if (x==9) core.keyUp(13); // ENTER
        if (x==10) core.keyUp(46); // DEL
    }
    if (y==10 && x>=9 && x<=11)
        core.ui.closePanel();
}

////// 光标界面时的点击操作 //////
actions.prototype.clickCursor = function (x,y) {

    if (x==core.status.automaticRoute.cursorX && y==core.status.automaticRoute.cursorY) {
        core.ui.closePanel();
        core.onclick(x,y,[]);
        return;
    }
    core.status.automaticRoute.cursorX=x;
    core.status.automaticRoute.cursorY=y;
    core.ui.drawCursor();
}

////// 光标界面时，按下某个键的操作 //////
actions.prototype.keyDownCursor = function (keycode) {
    if (keycode==37) { // left
        core.status.automaticRoute.cursorX--;
        core.ui.drawCursor();
        return;
    }
    if (keycode==38) { // up
        core.status.automaticRoute.cursorY--;
        core.ui.drawCursor();
        return;
    }
    if (keycode==39) { // right
        core.status.automaticRoute.cursorX++;
        core.ui.drawCursor();
        return;
    }
    if (keycode==40) { // down
        core.status.automaticRoute.cursorY++;
        core.ui.drawCursor();
        return;
    }
}

////// 光标界面时，放开某个键的操作 //////
actions.prototype.keyUpCursor = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    if (keycode==13 || keycode==32 || keycode==67 || keycode==69) {
        core.ui.closePanel();
        core.onclick(core.status.automaticRoute.cursorX, core.status.automaticRoute.cursorY, []);
        return;
    }
}

////// “关于”界面时的点击操作 //////
actions.prototype.clickAbout = function () {
    if (core.isPlaying())
        core.ui.closePanel();
    else
        core.restart();
}
