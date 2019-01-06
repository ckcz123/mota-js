/*
actions.js：用户交互的事件的处理
键盘、鼠标、触摸屏事件相关
 */

"use strict";

function actions() {
    this.init();
}

actions.prototype.init = function () {
    this.actionsdata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.actions;
}

actions.prototype.checkReplaying = function () {
    if (core.isReplaying()&&core.status.event.id!='save'
        &&(core.status.event.id||"").indexOf('book')!=0&&core.status.event.id!='viewMaps')
        return true;
    return false;
}

////// 按下某个键时 //////
actions.prototype.onkeyDown = function (e) {
    if (this.checkReplaying()) return;
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
        if (e.keyCode==17) core.status.ctrlDown = true;
        this.keyDown(e.keyCode);
    }
}

////// 放开某个键时 //////
actions.prototype.onkeyUp = function(e) {
    if (this.checkReplaying()) {
        if (e.keyCode==27) // ESCAPE
            core.stopReplay();
        else if (e.keyCode==90) // Z
            core.speedDownReplay();
        else if (e.keyCode==88) // X
            core.speedUpReplay();
        else if (e.keyCode==32) // SPACE
            core.triggerReplay();
        else if (e.keyCode==65) // A
            core.rewindReplay();
        else if (e.keyCode==83)
            core.saveReplay();
        else if (e.keyCode==67)
            core.bookReplay();
        else if (e.keyCode==33||e.keyCode==34)
            core.viewMapReplay();
        else if (e.keyCode>=49 && e.keyCode<=51)
            core.setReplaySpeed(e.keyCode-48);
        else if (e.keyCode==52)
            core.setReplaySpeed(6);
        else if (e.keyCode==53)
            core.setReplaySpeed(12);
        else if (e.keyCode==54)
            core.setReplaySpeed(24);
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
        this.keyUp(e.keyCode, e.altKey);
    } else {
        if (e.keyCode==17) core.status.ctrlDown = false;
        this.keyUp(e.keyCode, e.altKey);
    }
}

////// 按住某个键时 //////
actions.prototype.pressKey = function (keyCode) {
    if (this.checkReplaying()) return;
    if (keyCode === core.status.holdingKeys.slice(-1)[0]) {
        this.keyDown(keyCode);
        window.setTimeout(function(){core.pressKey(keyCode);},30);
    }
}

////// 根据按下键的code来执行一系列操作 //////
actions.prototype.keyDown = function(keyCode) {
    if (this.checkReplaying()) return;
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
        if (core.status.event.id=='equipbox') {
            this.keyDownEquipbox(keyCode);
            return;
        }
        if (core.status.event.id=='toolbox') {
            this.keyDownToolbox(keyCode);
            return;
        }
        if (core.status.event.id=='save' || core.status.event.id=='load' || core.status.event.id=='replayLoad') {
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
        if (core.status.event.id=='replay') {
            this.keyDownReplay(keyCode);
        }
        if (core.status.event.id=='gameInfo') {
            this.keyDownGameInfo(keyCode);
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
        break;
    }
}

////// 根据放开键的code来执行一系列操作 //////
actions.prototype.keyUp = function(keyCode, altKey, fromReplay) {
    if (!fromReplay && this.checkReplaying()) return;

    var ok = function (keycode) {
        return keycode==27 || keycode==88 || keycode==13 || keycode==32 || keycode==67;
    }

    if (core.status.lockControl) {
        core.status.holdingKeys = [];
        // 全键盘操作部分
        if (core.status.event.id == 'text' && ok(keyCode)) {
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
        if (core.status.event.id=='about' && ok(keyCode)) {
            this.clickAbout();
            return;
        }
        if (core.status.event.id=='help' && ok(keyCode)) {
            core.ui.closePanel();
            return;
        }
        if (core.status.event.id=='book') {
            this.keyUpBook(keyCode);
            return;
        }
        if (core.status.event.id=='book-detail' && ok(keyCode)) {
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
        if (core.status.event.id=='equipbox') {
            this.keyUpEquipbox(keyCode, altKey);
            return;
        }
        if (core.status.event.id=='save' || core.status.event.id=='load' || core.status.event.id=='replayLoad') {
            this.keyUpSL(keyCode);
            return;
        }
        if (core.status.event.id == 'keyBoard' && ok(keyCode)) {
            core.ui.closePanel();
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
        if (core.status.event.id=='replay') {
            this.keyUpReplay(keyCode);
            return;
        }
        if (core.status.event.id=='gameInfo') {
            this.keyUpGameInfo(keyCode);
            return;
        }
        if (core.status.event.id=='centerFly') {
            this.keyUpCenterFly(keyCode);
            return;
        }
        if (core.status.event.id=='paint') {
            this.keyUpPaint(keyCode);
        }
        return;
    }

    if(!core.status.played)
        return;

    this.actionsdata.onKeyUp(keyCode, altKey);

    if (core.isset(core.status.automaticRoute)&&core.status.automaticRoute.autoHeroMove) {
        core.stopAutomaticRoute();
    }

    core.stopHero();

}

////// 点击（触摸）事件按下时 //////
actions.prototype.ondown = function (loc) {
    if (this.checkReplaying()) return;

    var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
    var px = parseInt(loc.x/core.domStyle.scale), py = parseInt(loc.y/core.domStyle.scale);

    // 画板
    if (core.status.played && (core.status.event||{}).id=='paint') {
        this.ondownPaint(px, py);
        return;
    }

    if (!core.status.played || core.status.lockControl) {

        if (!this.checkReplaying() && core.status.event.id=='action' && core.status.event.data.type=='wait') {
            core.setFlag('type', 1);
            core.setFlag('x', x);
            core.setFlag('y', y);
            core.setFlag('px', px);
            core.setFlag('py', py);
            core.status.route.push("input:"+(1000000+1000*px+py));
            core.doAction();
        }
        else {
            this.onclick(x, y, []);
        }
        if (core.timeout.onDownTimeout==null) {
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
        return;
    }

    core.status.downTime = new Date();
    core.deleteCanvas('route');
    var pos={'x':x,'y':y}
    core.status.stepPostfix=[];
    core.status.stepPostfix.push(pos);
    core.fillPosWithPoint(pos);
}

////// 当在触摸屏上滑动时 //////
actions.prototype.onmove = function (loc) {
    if (this.checkReplaying()) return;

    // 画板
    if (core.status.played && (core.status.event||{}).id=='paint') {
        this.onmovePaint(loc.x/core.domStyle.scale, loc.y/core.domStyle.scale)
        return;
    }

    var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);

    if ((core.status.stepPostfix||[]).length>0) {
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
}

////// 当点击（触摸）事件放开时 //////
actions.prototype.onup = function () {
    if (this.checkReplaying()) return;

    // 画板
    if (core.status.played && (core.status.event||{}).id=='paint') {
        this.onupPaint()
        return;
    }

    clearTimeout(core.timeout.onDownTimeout);
    core.timeout.onDownTimeout = null;
    clearInterval(core.interval.onDownInterval);
    core.interval.onDownInterval = null;

    // core.status.holdingPath=0;
    if ((core.status.stepPostfix||[]).length>0) {
        var stepPostfix = [];
        var direction={'0':{'1':'down','-1':'up'},'-1':{'0':'left'},'1':{'0':'right'}};
        for(var ii=1;ii<core.status.stepPostfix.length;ii++){
            var pos0 = core.status.stepPostfix[ii-1];
            var pos = core.status.stepPostfix[ii];
            stepPostfix.push({'direction': direction[pos.x-pos0.x][pos.y-pos0.y], 'x': pos.x+parseInt(core.bigmap.offsetX/32), 'y': pos.y+parseInt(core.bigmap.offsetY/32)});
        }
        var posx=core.status.stepPostfix[0].x;
        var posy=core.status.stepPostfix[0].y;
        core.status.stepPostfix=[];
        if (!core.status.lockControl) {
            core.clearMap('ui');
        }

        // 长按
        if (!core.status.lockControl && stepPostfix.length==0 && core.status.downTime!=null && new Date()-core.status.downTime>=1000) {
            this.longClick(posx, posy);
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

    if (core.domStyle.isVertical) {
        statusBar.x = 0;
        statusBar.y = core.dom.statusBar.offsetHeight + 3;
    }
    else {
        statusBar.x = core.dom.statusBar.offsetWidth + 3;
        statusBar.y = 0;
    }

    var left = core.dom.gameGroup.offsetLeft + statusBar.x;
    var top = core.dom.gameGroup.offsetTop + statusBar.y;
    var loc={'x': x - left, 'y': y - top, 'size': size};
    return loc;
}

////// 具体点击屏幕上(x,y)点时，执行的操作 //////
actions.prototype.onclick = function (x, y, stepPostfix) {
    if (this.checkReplaying()) return;
    // console.log("Click: (" + x + "," + y + ")");

    stepPostfix=stepPostfix||[];

    // 非游戏屏幕内
    if (x<0 || y<0 || x>12 || y>12) return;

    // 寻路
    if (!core.status.lockControl) {
        core.setAutomaticRoute(x+parseInt(core.bigmap.offsetX/32), y+parseInt(core.bigmap.offsetY/32), stepPostfix);
        return;
    }

    // 中心对称飞行器
    if (core.status.event.id == 'centerFly') {
        this.clickCenterFly(x, y);
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

    // 装备栏
    if (core.status.event.id == 'equipbox') {
        this.clickEquipbox(x,y);
        return;
    } 

    // 工具栏
    if (core.status.event.id == 'toolbox') {
        this.clickToolbox(x,y);
        return;
    }

    // 存读档
    if (core.status.event.id == 'save' || core.status.event.id == 'load' || core.status.event.id=='replayLoad') {
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
    
    if (core.status.event.id == 'help') {
        this.clickHelp(x,y);
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

    if (core.status.event.id == 'replay') {
        this.clickReplay(x,y);
        return;
    }

    if (core.status.event.id=='gameInfo') {
        this.clickGameInfo(x,y);
    }

}

////// 滑动鼠标滚轮时的操作 //////
actions.prototype.onmousewheel = function (direct) {
    // 向下滚动是 -1 ,向上是 1

    if (this.checkReplaying()) {
        // 滚轮控制速度
        if (direct==1) core.speedUpReplay();
        if (direct==-1) core.speedDownReplay();
        return;
    }

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
        if (direct==1) this.clickViewMaps(6,3);
        if (direct==-1) this.clickViewMaps(6,9);
        return;
    }
}

/////////////////// 在某个界面时的按键点击效果 ///////////////////

////// 长按 //////
actions.prototype.longClick = function (x, y, fromEvent) {
    if (!core.isPlaying()) return false;
    if (core.status.lockControl) {
        if (core.status.event.id=='text') {
            core.drawText();
            return true;
        }
        if (core.status.event.id=='action' && core.status.event.data.type=='text') {
            core.doAction();
            return true;
        }
        // 长按楼传器的箭头可以快速翻页
        if (core.status.event.id=='fly') {
            if ((x==10 || x==11) && (y==5 || y==9)) {
                this.clickFly(x, y);
                return true;
            }
        }
        // 长按可以跳过等待事件
        if (core.status.event.id=='action' && core.status.event.data.type=='sleep'
            && !core.status.event.data.current.noSkip) {
            if (core.isset(core.timeout.sleepTimeout) && Object.keys(core.animateFrame.asyncId).length==0) {
                clearTimeout(core.timeout.sleepTimeout);
                core.timeout.sleepTimeout = null;
                core.events.doAction();
                return true;
            }
        }
    }
    else if (!fromEvent) {
        core.waitHeroToStop(function () {
            // 绘制快捷键
            core.ui.drawKeyBoard();
        });
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
    if (core.status.event.id=='action' && core.status.event.data.type=='sleep'
            && !core.status.event.data.current.noSkip) {
        if (core.isset(core.timeout.sleepTimeout) && Object.keys(core.animateFrame.asyncId).length==0) {
            clearTimeout(core.timeout.sleepTimeout);
            core.timeout.sleepTimeout = null;
            core.events.doAction();
        }
        return;
    }
}

//////
actions.prototype.clickCenterFly = function(x, y) {
    if (x==core.status.event.data.poxX && y==core.status.event.data.posY) {
        if (core.canUseItem('centerFly')) {
            core.useItem('centerFly');
        }
        else {
            core.drawTip('当前不能使用中心对称飞行器');
        }
    }
    core.ui.closePanel();
}

actions.prototype.keyUpCenterFly = function (keycode) {
    if (keycode==51 ||  keycode==13 || keycode==32 || keycode==67) {
        if (core.canUseItem('centerFly')) {
            core.useItem('centerFly');
        }
        else {
            core.drawTip('当前不能使用中心对称飞行器');
        }
    }
    core.ui.closePanel();
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

        // 打字机效果显示全部文字
        if (core.status.event.interval!=null) {
            core.insertAction({"type": "text", "text": core.status.event.ui, "showAll": true});
        }

        // 文字
        core.doAction();
        return;
    }
    /*
    if (core.status.event.data.type=='wait') {
        core.setFlag('type', 1);
        core.setFlag('x', x);
        core.setFlag('y', y);
        core.status.route.push("input:"+(10000+100*x+y));
        core.doAction();
        return;
    }
    */

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
        // 打字机效果显示全部文字
        if (core.status.event.interval!=null) {
            core.insertAction({"type": "text", "text": core.status.event.ui, "showAll": true});
        }
        core.doAction();
        return;
    }
    if (core.status.event.data.type=='wait') {
        core.setFlag('type', 0);
        core.setFlag('keycode', keycode);
        core.status.route.push("input:"+keycode);
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
            // 数字键快速选择
            if (keycode>=49 && keycode<=57) {
                var index = keycode-49;
                if (index<choices.length) {
                    core.status.route.push("choices:"+index);
                    core.insertAction(choices[index].action);
                    core.doAction();
                }
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
    core.clearMap('data');
    core.status.event.id = 'book';
}

////// 楼层传送器界面时的点击操作 //////
actions.prototype.clickFly = function(x,y) {
    if ((x==10 || x==11) && y==9) core.ui.drawFly(core.status.event.data-1);
    if ((x==10 || x==11) && y==5) core.ui.drawFly(core.status.event.data+1);
    if ((x==10 || x==11) && y==10) core.ui.drawFly(core.status.event.data-10);
    if ((x==10 || x==11) && y==4) core.ui.drawFly(core.status.event.data+10);
    if (x>=5 && x<=7 && y==12) core.ui.closePanel();
    if (x>=0 && x<=9 && y>=3 && y<=11)
        core.control.flyTo(core.status.hero.flyRange[core.status.event.data]);
    return;
}

////// 楼层传送器界面时，按下某个键的操作 //////
actions.prototype.keyDownFly = function (keycode) {
    if (keycode==37) core.ui.drawFly(core.status.event.data-10);
    else if (keycode==38) core.ui.drawFly(core.status.event.data+1);
    else if (keycode==39) core.ui.drawFly(core.status.event.data+10);
    else if (keycode==40) core.ui.drawFly(core.status.event.data-1);
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
    if (!core.isset(core.status.event.data)) {
        core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
        return;
    }

    var now = core.floorIds.indexOf(core.status.floorId);
    var index = core.status.event.data.index;
    var cx = core.status.event.data.x, cy = core.status.event.data.y;
    var floorId = core.floorIds[index], mw = core.floors[floorId].width||13, mh = core.floors[floorId].height||13;

    if (x==0 && y==0) {
        core.status.event.data.damage = !core.status.event.data.damage;
        core.ui.drawMaps(index, cx, cy);
        return;
    }
    if (x==0 && y==12) {
        core.status.event.data.paint = !core.status.event.data.paint;
        core.ui.drawMaps(index, cx, cy);
        return;
    }
    if (x==12 && y==0) {
        core.status.event.data.all = !core.status.event.data.all;
        core.ui.drawMaps(index, cx, cy);
        return;
    }

    if (x>=2 && x<=10 && y<=1 && mh>13) {
        core.ui.drawMaps(index, cx, cy-1);
        return;
    }
    if (x>=2 && x<=10 && y>=11 && mh>13) {
        core.ui.drawMaps(index, cx, cy+1);
        return;
    }
    if (x<=1 && y>=2 && y<=10) {
        core.ui.drawMaps(index, cx-1, cy);
        return;
    }
    if (x>=11 && y>=2 && y<=10) {
        core.ui.drawMaps(index, cx+1, cy);
        return;
    }

    if(y<=4 && (mh==13 || (x>=2 && x<=10))) {
        index++;
        while (index<core.floorIds.length && index!=now && core.status.maps[core.floorIds[index]].cannotViewMap)
            index++;
        if (index<core.floorIds.length)
            core.ui.drawMaps(index);
    }
    else if (y>=8 && (mh==13 || (x>=2 && x<=10))) {
        index--;
        while (index>=0 && index!=now && core.status.maps[core.floorIds[index]].cannotViewMap)
            index--;
        if (index>=0)
            core.ui.drawMaps(index);
    }
    else if (x>=2 && x<=10 && y>=5 && y<=7) {
        core.clearMap('data');
        core.ui.closePanel();
    }
}

////// 查看地图界面时，按下某个键的操作 //////
actions.prototype.keyDownViewMaps = function (keycode) {
    if (!core.isset(core.status.event.data)) return;

    var floorId = core.floorIds[core.status.event.data.index], mh = core.floors[floorId].height||13;

    if (keycode==38||keycode==33) this.clickViewMaps(6, 3);
    if (keycode==40||keycode==34) this.clickViewMaps(6, 9);
    if (keycode==87 && mh>13) this.clickViewMaps(6,0);
    if (keycode==65) this.clickViewMaps(0,6);
    if (keycode==83 && mh>13) this.clickViewMaps(6,12);
    if (keycode==68) this.clickViewMaps(12,6);
    return;
}

////// 查看地图界面时，放开某个键的操作 //////
actions.prototype.keyUpViewMaps = function (keycode) {
    if (!core.isset(core.status.event.data)) {
        core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
        return;
    }

    if (keycode==27 || keycode==13 || keycode==32 || (!core.isReplaying() && keycode==67)) {
        core.clearMap('data');
        core.ui.closePanel();
        return;
    }
    if (keycode==86) {
        core.status.event.data.damage = !core.status.event.data.damage;
        core.ui.drawMaps(core.status.event.data);
        return;
    }
    if (keycode==90) {
        core.status.event.data.all = !core.status.event.data.all;
        core.ui.drawMaps(core.status.event.data);
        return;
    }
    if (keycode==77) {
        core.status.event.data.paint = !core.status.event.data.paint;
        core.ui.drawMaps(core.status.event.data);
        return;
    }
    if (keycode==88 || (core.isReplaying() && keycode==67)) {
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
actions.prototype.clickShop = function(x,y) {
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(choices.length / 2);
        if (y>=topIndex && y<topIndex+choices.length) {

            // 检查能否使用快捷商店
            var reason = core.events.canUseQuickShop(shop.id);
            if (core.isset(reason)) {
                core.drawText(reason);
                return false;
            }
            if (!shop.visited) {
                if (shop.times==0) core.drawTip("该商店尚未开启");
                else core.drawTip("该商店已失效");
                return;
            }

            core.status.event.selection=y-topIndex;

            var money = core.getStatus('money'), experience = core.getStatus('experience');
            var times = shop.times, need = core.calValue(shop.need, null, null, times);
            var use = shop.use;
            var use_text = use=='money'?"金币":"经验";

            var choice = choices[y-topIndex];
            if (core.isset(choice.need))
                need = core.calValue(choice.need, null, null, times);

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
                core.doEffect(t, need, times);
            });
            core.updateStatusBar();
            shop.times++;
            if (shop.commonTimes)
                core.setFlag('commonTimes', shop.times);
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<=choices.length) {
            var topIndex = 6 - parseInt(choices.length / 2);
            this.clickShop(6, topIndex+index);
        }
    }
    return;
}

////// 快捷商店界面时的点击操作 //////
actions.prototype.clickQuickShop = function(x, y) {
    var shopList = core.status.shops, keys = Object.keys(shopList).filter(function (shopId) {return shopList[shopId].visited || !shopList[shopId].mustEnable});
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(keys.length / 2);
        if (y>=topIndex && y<topIndex+keys.length) {
            var reason = core.events.canUseQuickShop(keys[y - topIndex]);
            if (!core.flags.enableDisabledShop && core.isset(reason)) {
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
    if (keycode==27 || keycode==75 || keycode==88 || keycode==86) {
        core.ui.closePanel();
        return;
    }
    var shopList = core.status.shops, keys = Object.keys(shopList).filter(function (shopId) {return shopList[shopId].visited || !shopList[shopId].mustEnable});
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt(keys.length / 2);
        this.clickQuickShop(6, topIndex+core.status.event.selection);
    }
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<=keys.length) {
            var topIndex = 6 - parseInt(keys.length / 2);
            this.clickQuickShop(6, topIndex+index);
        }
    }
    return;
}

////// 工具栏界面时的点击操作 //////
actions.prototype.clickToolbox = function(x,y) {
    // 装备栏
    if (x>=10 && x<=12 && y==0) {
        core.ui.closePanel();
        core.openEquipbox();
        return;
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel();
        return;
    }
    /*
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
    */
    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    // 上一页
    if (x == 3 || x == 4) {
        if (y == 7 && toolsPage>1) {
            core.status.event.data.toolsPage--;
            core.ui.drawToolbox(core.status.event.selection);
        }
        if (y == 12 && constantsPage>1) {
            core.status.event.data.toolsPage--;
            core.ui.drawToolbox(core.status.event.selection);
        }
    }
    // 下一页
    if (x == 8 || x == 9) {
        if (y == 7 && toolsPage<Math.ceil(Object.keys(core.status.hero.items.tools).length/12)) {
            core.status.event.data.toolsPage++;
            core.ui.drawToolbox(core.status.event.selection);
        }
        if (y == 12 && constantsPage<Math.ceil(Object.keys(core.status.hero.items.constants).length/12)) {
            core.status.event.data.constantsPage++;
            core.ui.drawToolbox(core.status.event.selection);
        }
    }

    var index=parseInt(x/2);;
    if (y==4) index+=0;
    else if (y==6) index+=6;
    else if (y==9) index+=12;
    else if (y==11) index+=18;
    else index =-1;

    if (index>=0)
        this.clickToolboxIndex(index);
}

////// 选择工具栏界面中某个Index后的操作 //////
actions.prototype.clickToolboxIndex = function(index) {
    var items = null;
    var select;
    if (index<12) {
        select = index + 12 * (core.status.event.data.toolsPage-1);
        items = Object.keys(core.status.hero.items.tools).sort();
    }
    else {
        select = index%12 + 12 * (core.status.event.data.constantsPage-1);
        items = Object.keys(core.status.hero.items.constants).sort();
    }
    if (items==null) return;
    if (select>=items.length) return;
    var itemId=items[select];
    if (itemId==core.status.event.data.selectId) {
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
    var index = core.status.event.selection;
    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    var toolsTotalPage = Math.ceil(tools.length/12);
    var constantsTotalPage = Math.ceil(constants.length/12);
    var toolsLastIndex = toolsPage<toolsTotalPage?11:(tools.length+11)%12;
    var constantsLastIndex = 12+(constantsPage<constantsTotalPage?11:(constants.length+11)%12);

    if (keycode==37) { // left
        if (index==0) { // 处理向前翻页
            if (toolsPage > 1) {
                core.status.event.data.toolsPage--;
                index = 11;
            }
            else return; // 第一页不向前翻
        }
        else if (index==12) {
            if (constantsPage == 1) {
                if (toolsTotalPage==0) return;
                core.status.event.data.toolsPage = toolsTotalPage;
                index = (tools.length+11)%12;
            }
            else {
                core.status.event.data.constantsPage--;
                index = 23;
            }
        }
        else index -= 1 ;
        this.clickToolboxIndex(index);
        return;
    }
    if (keycode==38) { // up
        if (index>=12&&index<=17) { // 进入tools
            if (toolsTotalPage==0) return;
            if (toolsLastIndex>=6) index = Math.min(toolsLastIndex, index-6);
            else index = Math.min(toolsLastIndex, index-12);
        }
        else if (index<6) return; // 第一行没有向上
        else index -= 6;
        this.clickToolboxIndex(index);
        return;
    }
    if (keycode==39) { // right
        if (toolsPage<toolsTotalPage && index==11) {
            core.status.event.data.toolsPage++;
            index = 0;
        }
        else if (constantsPage<constantsTotalPage && index==23) {
            core.status.event.data.constantsPage++;
            index = 12;
        }
        else if (index == toolsLastIndex) {
            if (constantsTotalPage==0) return;
            core.status.event.data.constantsPage = 1;
            index = 12;
        }
        else if(index==constantsLastIndex) // 一个物品无操作
            return;
        else index++;
        this.clickToolboxIndex(index);
        return;
    }
    if (keycode==40) { // down
        var nextIndex = null;
        if (index<=5) {
            if (toolsLastIndex > 5) nextIndex = Math.min(toolsLastIndex, index + 6);
            else index+=6;
        }
        if (nextIndex==null && index<=11) {
            if (constantsTotalPage == 0) return;
            nextIndex = Math.min(index+6, constantsLastIndex);
        }
        if (nextIndex==null && index<=17) {
            if (constantsLastIndex > 17) nextIndex = Math.min(constantsLastIndex, index+6);
        }
        if (nextIndex!=null) {
            this.clickToolboxIndex(nextIndex);
        }
        return;
    }
}

////// 工具栏界面时，放开某个键的操作 //////
actions.prototype.keyUpToolbox = function (keycode) {
    if (keycode==81){
        core.ui.closePanel();
        core.openEquipbox();
        return;
    }
    if (keycode==84 || keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    if (!core.isset(core.status.event.data)) return;

    if (keycode==13 || keycode==32 || keycode==67) {
        this.clickToolboxIndex(core.status.event.selection);
        return;
    }

    /*
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
    */

}


////// 装备栏界面时的点击操作 //////
actions.prototype.clickEquipbox = function(x,y) {
    // 道具栏
    if (x>=10 && x<=12 && y==0) {
        core.ui.closePanel();
        core.openToolbox();
        return;
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel();
        return;
    }

    // 当前页面
    var page = core.status.event.data.page;

    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        if (page>1) {
            core.status.event.data.page--;
            core.ui.drawEquipbox(core.status.event.selection);
        }
        return;
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        var lastPage = Math.ceil(Object.keys(core.status.hero.items.equips).length/12);
        if (page<lastPage) {
            core.status.event.data.page++;
            core.ui.drawEquipbox(core.status.event.selection);
        }
        return;
    }

    var index=parseInt(x/2);
    if (y==4) index+=0;
    else if (y==6) index+=6;
    else if (y==9) index+=12;
    else if (y==11) index+=18;
    else index=-1;

    if (index>=0) {
        if (index<12) index = parseInt(index/2);
        this.clickEquipboxIndex(index);
    }
}

////// 选择装备栏界面中某个Index后的操作 //////
actions.prototype.clickEquipboxIndex = function(index) {
    if (index<6) {
        if (index>=(main.equipName||[]).length) return;
        if (index==core.status.event.selection && core.isset(core.status.hero.equipment[index])) {
            core.unloadEquip(index);
            core.status.route.push("unEquip:"+index);
        }
    }
    else if (index>=12) {
        var equips = Object.keys(core.status.hero.items.equips||{}).sort();
        if (index==core.status.event.selection) {
            var equipId = equips[index-12 + (core.status.event.data.page-1)*12];
            core.loadEquip(equipId);
            core.status.route.push("equip:"+equipId);
        }
    } 
    core.ui.drawEquipbox(index);
}

////// 装备栏界面时，按下某个键的操作 //////
actions.prototype.keyDownEquipbox = function (keycode) {
    if (!core.isset(core.status.event.data)) return;

    var equipCapacity = (main.equipName||[]).length;
    var ownEquipment = Object.keys(core.status.hero.items.equips).sort();
    var index = core.status.event.selection;
    var page = core.status.event.data.page;
    var totalPage = Math.ceil(ownEquipment.length/12);
    var totalLastIndex = 12+(page<totalPage?11:(ownEquipment.length+11)%12);

    if (keycode==37) { // left
        if (index==0) return;
        if (index==12) {
            if (page > 1) {
                core.status.event.data.page--;
                index = 23;
            }
            else if (page == 1)
                index = equipCapacity - 1;
            else return;
        }
        else index -= 1;
        this.clickEquipboxIndex(index);
        return;
    }
    if (keycode==38) { // up
        if (index<3) return;
        else if (index<6) index -= 3;
        else if (index < 18) {
            index = parseInt((index-12)/2);
            if (equipCapacity>3) index = Math.min(equipCapacity-1, index + 3);
            else index = Math.min(equipCapacity-1, index);
        }
        else index -= 6;
        this.clickEquipboxIndex(index);
        return;
    }
    if (keycode==39) { // right
        if (page<totalPage && index==23) {
            core.status.event.data.page++;
            index = 12;
        }
        else if (index==equipCapacity-1) {
            if (totalPage==0) return;
            index = 12;
        }
        else if (index==totalLastIndex)
            return;
        else index++;
        this.clickEquipboxIndex(index);
        return;
    }
    if (keycode==40) { // down
        if (index<3) {
            if (equipCapacity>3) index = Math.min(index+3, equipCapacity-1);
            else {
                if (totalPage == 0) return;
                index = Math.min(2*index+1+12, totalLastIndex);
            }
        }
        else if (index < 6) {
            if (totalPage == 0) return;
            index = Math.min(2*(index-3)+1+12, totalLastIndex);
        }
        else if (index < 18)
            index = Math.min(index+6, totalLastIndex);
        else return;
        this.clickEquipboxIndex(index);
        return;
    }
}

////// 装备栏界面时，放开某个键的操作 //////
actions.prototype.keyUpEquipbox = function (keycode, altKey) {
    if (altKey && keycode>=48 && keycode<=57) {
        core.items.quickSaveEquip(keycode-48);
        return;
    }
    if (keycode==84){
        core.ui.closePanel();
        core.openToolbox();
        return;
    }
    if (keycode==81 || keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    if (!core.isset(core.status.event.data.selectId)) return;

    if (keycode==13 || keycode==32 || keycode==67) {
        this.clickEquipboxIndex(core.status.event.selection);
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
        return;
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawSLPanel(10*(page+1)+offset);
        return;
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        if (core.events.recoverEvents(core.status.event.interval)) {
            return;
        }
        core.ui.closePanel();
        if (!core.isPlaying()) {
            core.showStartAnimate(true);
        }
        return;
    }
    // 删除
    if (x>=0 && x<=2 && y==12) {

        if (core.status.event.id=='save') {
            core.status.event.selection=!core.status.event.selection;
            core.ui.drawSLPanel(index);
        }
        else {
            var index = parseInt(prompt("请输入读档编号"))||0;
            if (index>0) {
                core.doSL(index, core.status.event.id);
            }
        }
        return;
    }

    var id=null;
    if (y>=1 && y<=4) {
        if (x>=1 && x<=3) id = "autoSave";
        if (x>=5 && x<=7) id = 5*page+1;
        if (x>=9 && x<=11) id = 5*page+2;
    }
    if (y>=7 && y<=10) {
        if (x>=1 && x<=3) id = 5*page+3;
        if (x>=5 && x<=7) id = 5*page+4;
        if (x>=9 && x<=11) id = 5*page+5;
    }
    if (id!=null) {
        if (core.status.event.selection)  {
            if (id == 'autoSave') {
                core.drawTip("无法删除自动存档！");
            }
            else {
                // core.removeLocalStorage("save"+id);
                core.removeLocalForage("save"+id, function() {
                    core.ui.drawSLPanel(index, true);
                }, function() {
                    core.drawTip("无法删除存档！");
                })
            }
        }
        else {
            core.doSL(id, core.status.event.id);
        }
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
        if (core.events.recoverEvents(core.status.event.interval)) {
            return;
        }
        core.ui.closePanel();
        if (!core.isPlaying()) {
            core.showStartAnimate(true);
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
    if (keycode==69 && core.status.event.id == 'load') { // E
        var index = parseInt(prompt("请输入读档编号"))||0;
        if (index>0) {
            core.doSL(index, core.status.event.id);
        }
        return;
    }
    if (keycode==46) {
        if (offset==0) {
            core.drawTip("无法删除自动存档！");
        }
        else {
            // core.removeLocalStorage("save"+(5*page+offset));
            // core.ui.drawSLPanel(index);
            core.removeLocalForage("save"+(5*page+offset), function() {
                core.ui.drawSLPanel(index, true);
            }, function() {
                core.drawTip("无法删除存档！");
            })
        }
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
                core.triggerBgm();
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
                core.updateDamage();
                core.setLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
                core.ui.drawSwitchs();
                break;
            case 4:
                core.flags.displayCritical=!core.flags.displayCritical;
                core.updateDamage();
                core.setLocalStorage('critical', core.flags.displayCritical);
                core.ui.drawSwitchs();
                break;
            case 5:
                core.flags.displayExtraDamage=!core.flags.displayExtraDamage;
                core.updateDamage();
                core.setLocalStorage('extraDamage', core.flags.displayExtraDamage);
                core.ui.drawSwitchs();
                break;
            case 6:
                core.platform.useLocalForage=!core.platform.useLocalForage;
                core.setLocalStorage('useLocalForage', core.platform.useLocalForage);
                core.control.getSaveIndexes(function (indexes) {
                    core.saves.ids = indexes;
                });
                core.ui.drawSwitchs();
                break;
            case 7:
                core.setFlag('clickMove', !core.getFlag('clickMove', true));
                core.ui.drawSwitchs();
                break;
            case 8:
                core.platform.extendKeyboard = !core.platform.extendKeyboard;
                core.setLocalStorage('extendKeyboard', core.platform.extendKeyboard);
                core.ui.drawSwitchs();
                break;
            case 9:
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickSwitchs(6, topIndex+index);
        }
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
                core.ui.drawKeyBoard();
                break;
            case 2:
                core.clearLastEvent();
                core.ui.drawMaps();
                break;
            case 3:
                core.clearLastEvent();
                core.ui.drawPaint();
                break;
            case 4:
                core.status.event.selection=0;
                core.ui.drawSyncSave();
                break;
            case 5:
                core.status.event.selection=0;
                core.ui.drawGameInfo();
                break;
            case 6:
                core.status.event.selection=1;
                core.ui.drawConfirmBox("你确定要返回标题页面吗？", function () {
                    core.ui.closePanel();
                    core.restart();
                }, function () {
                    core.status.event.selection=3;
                    core.ui.drawSettings();
                });
                break;
            case 7:
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickSettings(6, topIndex+index);
        }
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
                            for (var i=1;i<=5*(main.savePages||30);i++) {
                                if (i<=data.length) {
                                    core.setLocalForage("save"+i, data[i-1]);
                                }
                                else {
                                    if (core.saves.ids[i])
                                        core.removeLocalForage("save"+i);
                                }
                            }
                            core.drawText("读取成功！\n你的本地所有存档均已被覆盖。");
                        }, function () {
                            core.status.event.selection=0;
                            core.ui.drawSyncSave();
                        })
                    }
                    else {
                        // core.setLocalStorage("save"+core.saves.saveIndex, data);
                        core.setLocalForage("save"+core.saves.saveIndex, data, function() {
                            core.drawText("同步成功！\n单存档已覆盖至存档"+core.saves.saveIndex);
                        })
                    }
                }, function () {

                });
                break;
            case 4:
                core.status.event.selection=0;
                core.ui.drawReplay();
                break;
            case 5:
                if (core.hasFlag('debug')) {
                    core.drawText("\t[系统提示]调试模式下无法下载录像");
                    break;
                }
                core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5route", JSON.stringify({
                    'name': core.firstData.name,
                    'hard': core.status.hard,
                    'seed': core.getFlag('__seed__'),
                    'route': core.encodeRoute(core.status.route)
                }));
                break;
            case 6:
                core.status.event.selection=0;
                core.ui.drawStorageRemove();
                break;
            case 7:
                core.status.event.selection=4;
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickSyncSave(6, topIndex+index);
        }
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickSyncSelect(6, topIndex+index);
        }
    }
}

////// 存档下载界面时的点击操作 //////
actions.prototype.clickLocalSaveSelect = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);

    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        if (selection<2) {
            core.control.getSaves(selection==0?null:core.saves.saveIndex, function(saves) {
                if (core.isset(saves)) {
                    var content = {
                        "name": core.firstData.name,
                        "version": core.firstData.version,
                        "data": saves
                    }
                    core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5save", JSON.stringify(content));
                }
            })
        }
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickLocalSaveSelect(6, topIndex+index);
        }
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
                if (core.platform.useLocalForage) {
                    core.ui.drawWaiting("正在清空，请稍后...");
                    localforage.clear(function () {
                        core.ui.closePanel();
                        core.drawText("\t[操作成功]你的所有存档已被清空。");
                        core.saves.saveIndex = 1;
                        core.removeLocalStorage('saveIndex');
                    });
                }
                else {
                    localStorage.clear();
                    core.drawText("\t[操作成功]你的所有存档已被清空。");
                    core.saves.saveIndex = 1;
                    core.removeLocalStorage('saveIndex');
                }
                break;
            case 1:
                if (core.platform.useLocalForage) {
                    core.ui.drawWaiting("正在清空，请稍后...");
                    Object.keys(core.saves.ids).forEach(function (v) {
                        if (v!=0)
                            core.removeLocalForage("save"+v);
                    });
                    core.removeLocalForage("autoSave", function() {
                        core.saves.autosave.data = null;
                        core.saves.autosave.updated = false;
                        core.ui.closePanel();
                        core.drawText("\t[操作成功]当前塔的存档已被清空。");
                        core.saves.saveIndex = 1;
                        core.removeLocalStorage('saveIndex');
                    });
                }
                else {
                    Object.keys(core.saves.ids).forEach(function (v) {
                        if (v!=0)
                            core.removeLocalStorage("save"+v);
                    });
                    core.removeLocalStorage("autoSave");
                    core.saves.autosave.data = null;
                    core.saves.autosave.updated = false;
                    core.drawText("\t[操作成功]当前塔的存档已被清空。");
                    core.saves.saveIndex = 1;
                    core.removeLocalStorage('saveIndex');
                }
                break;
            case 2:
                core.status.event.selection=6;
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
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickStorageRemove(6, topIndex+index);
        }
    }
}

////// 回放选择界面时的点击操作 //////
actions.prototype.clickReplay = function (x, y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);

    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                {
                    core.ui.closePanel();
                    var hard=core.status.hard, seed = core.getFlag('__seed__');
                    core.startGame(hard, seed, core.clone(core.status.route));
                    break;
                }
            case 1:
                {
                    core.status.event.id = 'replayLoad';
                    core.status.event.selection = null;
                    var saveIndex = core.saves.saveIndex;
                    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;
                    core.ui.drawSLPanel(10*page+offset);
                    break;
                }
            case 2:
                core.chooseReplayFile();
                break;
            case 3:
                if (core.hasFlag('debug')) {
                    core.drawText("\t[系统提示]调试模式下无法下载录像");
                    break;
                }
                core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5route", JSON.stringify({
                    'name': core.firstData.name,
                    'hard': core.status.hard,
                    'seed': core.getFlag('__seed__'),
                    'route': core.encodeRoute(core.status.route)
                }));
                break;
                break;
            case 4:
                core.ui.closePanel();
                break;
        }
    }
}

////// 回放选择界面时，按下某个键的操作 //////
actions.prototype.keyDownReplay = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 回放选择界面时，放开某个键的操作 //////
actions.prototype.keyUpReplay = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickReplay(6, topIndex+core.status.event.selection);
    }
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickReplay(6, topIndex+index);
        }
    }
}


////// 游戏信息界面时的点击操作 //////
actions.prototype.clickGameInfo = function (x, y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);

    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                core.ui.drawStatistics();
                break;
            case 1:
                if (core.platform.isPC)
                    window.open("editor.html", "_blank");
                else if (confirm("即将离开本塔，跳转至本塔工程页面，确认？")) {
                    window.location.href = "editor-mobile.html";
                }
                break;
            case 2:
                if (core.platform.isPC) {
                    window.open("/score.php?name="+core.firstData.name+"&num=10", "_blank");
                }
                else {
                    if (confirm("即将离开本塔，跳转至本塔评论页面，确认？")) {
                        window.location.href = "/score.php?name="+core.firstData.name+"&num=10";
                    }
                }
                break;
            case 3:
                core.ui.drawHelp();
                break;
            case 4:
                core.ui.drawAbout();
                break;
            case 5:
                if (core.platform.isPC)
                    window.open(core.firstData.name+".zip");
                else
                    window.location.href = core.firstData.name+".zip";
                break;
            case 6:
                core.status.event.selection=5;
                core.ui.drawSettings();
                break;
        }
    }
}

////// 游戏信息界面时，按下某个键的操作 //////
actions.prototype.keyDownGameInfo = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 游戏信息界面时，放开某个键的操作 //////
actions.prototype.keyUpGameInfo = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickGameInfo(6, topIndex+core.status.event.selection);
    }
    // 数字键快速选择
    if (keycode>=49 && keycode<=57) {
        var index = keycode-49;
        if (index<choices.length) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            this.clickGameInfo(6, topIndex+index);
        }
    }
}

////// “虚拟键盘”界面时的点击操作 //////
actions.prototype.clickKeyBoard = function (x, y) {
    if (y==3 && x>=1 && x<=11) {
        core.ui.closePanel();
        core.keyUp(112+x-1); // F1-F12: 112-122
    }
    if (y==3 && x==12) {
        var val = prompt();
        if (val!=null) {
            try {
                eval(val);
            }
            catch (e) {}
        }
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
        core.restart(true);
}

////// “帮助”界面时的点击操作 //////
actions.prototype.clickHelp = function () {
    core.ui.closePanel();
}

////// 绘图相关 //////

actions.prototype.ondownPaint = function (x, y) {
    x+=core.bigmap.offsetX;
    y+=core.bigmap.offsetY;
    if (!core.status.event.data.erase) {
        core.dymCanvas.paint.beginPath();
        core.dymCanvas.paint.moveTo(x, y);
    }
    core.status.event.data.x = x;
    core.status.event.data.y = y;
}

actions.prototype.onmovePaint = function (x, y) {
    if (core.status.event.data.x==null) return;
    x+=core.bigmap.offsetX;
    y+=core.bigmap.offsetY;
    if (core.status.event.data.erase) {
        core.clearMap('paint', x-10, y-10, 20, 20);
        return;
    }
    var midx = (core.status.event.data.x+x)/2, midy = (core.status.event.data.y+y)/2;
    core.dymCanvas.paint.quadraticCurveTo(midx, midy, x, y);
    core.dymCanvas.paint.stroke();
    core.status.event.data.x = x;
    core.status.event.data.y = y;
}

actions.prototype.onupPaint = function () {
    core.status.event.data.x = null;
    core.status.event.data.y = null;
    // 保存
    core.paint[core.status.floorId] = LZString.compress(core.utils.encodeCanvas(core.dymCanvas.paint).join(","));
}

actions.prototype.setPaintMode = function (mode) {
    if (mode == 'paint') core.status.event.data.erase = false;
    else if (mode == 'erase') core.status.event.data.erase = true;
    else return;

    core.drawTip("进入"+(core.status.event.data.erase?"擦除":"绘图")+"模式");
}

actions.prototype.clearPaint = function () {
    core.clearMap('paint');
    delete core.paint[core.status.floorId];
    core.drawTip("已清空绘图内容");
}

actions.prototype.savePaint = function () {
    var data = {};
    for (var floorId in core.paint) {
        if (core.isset(core.paint[floorId]))
            data[floorId] = LZString.decompress(core.paint[floorId]);
    }
    core.download(core.firstData.name+".h5paint", JSON.stringify({
        'name': core.firstData.name,
        'paint': data
    }));
}

actions.prototype.loadPaint = function () {
    core.readFile(function (obj) {
        if (obj.name!=core.firstData.name) {
            alert("绘图文件和游戏不一致！");
            return;
        }
        if (!core.isset(obj.paint)) {
            alert("无效的绘图文件！");
            return;
        }
        core.paint = {};
        for (var floorId in obj.paint) {
            if (core.isset(obj.paint[floorId]))
                core.paint[floorId] = LZString.compress(obj.paint[floorId]);
        }

        core.clearMap('paint');
        var value = core.paint[core.status.floorId];
        if (core.isset(value)) value = LZString.decompress(value).split(",");
        core.utils.decodeCanvas(value, 32*core.bigmap.width, 32*core.bigmap.height);
        core.drawImage('paint', core.bigmap.tempCanvas.canvas, 0, 0);

        core.drawTip("读取绘图文件成功");
    })
}

actions.prototype.exitPaint = function () {
    core.deleteCanvas('paint');
    core.ui.closePanel();
    core.statusBar.image.keyboard.style.opacity = 1;
    core.updateStatusBar();
    core.drawTip("退出绘图模式");
}

actions.prototype.keyUpPaint = function (keycode) {
    if (keycode==27 || keycode==88 || keycode==77 || keycode==13 || keycode==32 || keycode==67) {
        this.exitPaint();
        return;
    }
}

////// 绘图相关 END //////
