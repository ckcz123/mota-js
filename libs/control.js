/// <reference path="../runtime.d.ts" />

/*
control.js：游戏主要逻辑控制
主要负责status相关内容，以及各种变量获取/存储
寻路算法和人物行走也在此文件内
 */

"use strict";

function control() {
    this._init();
}

control.prototype._init = function () {
    this.controldata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.control;
    this.renderFrameFuncs = [];
    this.replayActions = [];
    this.resizes = [];
    // --- 注册系统的animationFrame
    this.registerAnimationFrame("totalTime", false, this._animationFrame_totalTime);
    this.registerAnimationFrame("autoSave", true, this._animationFrame_autoSave);
    this.registerAnimationFrame("globalAnimate", true, this._animationFrame_globalAnimate);
    this.registerAnimationFrame("animate", true, this._animationFrame_animate);
    this.registerAnimationFrame("heroMoving", true, this._animationFrame_heroMoving);
    this.registerAnimationFrame("weather", true, this._animationFrame_weather);
    this.registerAnimationFrame("tip", true, this._animateFrame_tip);
    this.registerAnimationFrame("parallelDo", false, this._animationFrame_parallelDo);
    // --- 注册系统的replay
    this.registerReplayAction("move", this._replayAction_move);
    this.registerReplayAction("item", this._replayAction_item);
    this.registerReplayAction("equip", this._replayAction_equip);
    this.registerReplayAction("unEquip", this._replayAction_unEquip);
    this.registerReplayAction("fly", this._replayAction_fly);
    this.registerReplayAction("shop", this._replayAction_shop);
    this.registerReplayAction("turn", this._replayAction_turn);
    this.registerReplayAction("getNext", this._replayAction_getNext);
    this.registerReplayAction("moveDirectly", this._replayAction_moveDirectly);
    this.registerReplayAction("key", this._replayAction_key);
    // --- 注册系统的resize
    this.registerResize("gameGroup", this._resize_gameGroup);
    this.registerResize("canvas", this._resize_canvas);
    this.registerResize("statusBar", this._resize_statusBar);
    this.registerResize("status", this._resize_status);
    this.registerResize("toolBar", this._resize_toolBar);
    this.registerResize("tools", this._resize_tools);
}

// ------ requestAnimationFrame 相关 ------ //

////// 注册一个 animationFrame //////
// name：名称，可用来作为注销使用；needPlaying：是否只在游戏运行时才执行（在标题界面不执行）
// func：要执行的函数，或插件中的函数名；可接受timestamp（从页面加载完毕到当前所经过的时间）作为参数
control.prototype.registerAnimationFrame = function (name, needPlaying, func) {
    this.unregisterAnimationFrame(name);
    this.renderFrameFuncs.push({name: name, needPlaying: needPlaying, func: func});
}

////// 注销一个 animationFrame //////
control.prototype.unregisterAnimationFrame = function (name) {
    this.renderFrameFuncs = this.renderFrameFuncs.filter(function (x) { return x.name!=name; });
}

////// 设置requestAnimationFrame //////
control.prototype._setRequestAnimationFrame = function () {
    this._checkRequestAnimationFrame();
    core.animateFrame.totalTime = Math.max(core.animateFrame.totalTime, core.getLocalStorage('totalTime', 0));
    var loop = function (timestamp) {
        core.control.renderFrameFuncs.forEach(function (b) {
            if (b.func) {
                try {
                    if (core.isPlaying() || !b.needPlaying)
                        core.doFunc(b.func, core.control, timestamp);
                }
                catch (e) {
                    main.log(e);
                    main.log("ERROR in requestAnimationFrame["+b.name+"]：已自动注销该项。");
                    core.unregisterAnimationFrame(b.name);
                }
            }
        })
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}

control.prototype._checkRequestAnimationFrame = function () {
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());
}

control.prototype._animationFrame_totalTime = function (timestamp) {
    core.animateFrame.totalTime += timestamp - core.animateFrame.totalTimeStart;
    core.animateFrame.totalTimeStart = timestamp;
    if (core.isPlaying()) {
        core.status.hero.statistics.totalTime = core.animateFrame.totalTime;
        core.status.hero.statistics.currTime += timestamp-(core.status.hero.statistics.start||timestamp);
        core.status.hero.statistics.start = timestamp;
    }
}

control.prototype._animationFrame_autoSave = function (timestamp) {
    if (timestamp - core.saves.autosave.time <= 5000) return;
    core.control.checkAutosave();
    core.saves.autosave.time = timestamp;
}

control.prototype._animationFrame_globalAnimate = function (timestamp) {
    if (timestamp - core.animateFrame.globalTime <= core.values.animateSpeed) return;
    core.status.globalAnimateStatus++;
    if (core.status.floorId) {
        // Global Animate
        core.status.globalAnimateObjs.forEach(function (block) {
            core.drawBlock(block, core.status.globalAnimateStatus % (block.event.animate||1));
        });

        // Global floor images
        core.maps._drawFloorImages(core.status.floorId, core.canvas.bg, 'bg', core.status.floorAnimateObjs||[], core.status.globalAnimateStatus);
        core.maps._drawFloorImages(core.status.floorId, core.canvas.fg, 'fg', core.status.floorAnimateObjs||[], core.status.globalAnimateStatus);

        // Global Autotile Animate
        core.status.autotileAnimateObjs.blocks.forEach(function (block) {
            core.maps._drawAutotileAnimate(block, core.status.globalAnimateStatus);
        });
    }
    // Box animate
    core.drawBoxAnimate();
    core.animateFrame.globalTime = timestamp;
}

control.prototype._animationFrame_animate = function (timestamp) {
    if (timestamp - core.animateFrame.animateTime < 50 || !core.status.animateObjs || core.status.animateObjs.length == 0) return;
    core.clearMap('animate');
    // 更新帧
    for (var i = 0; i < core.status.animateObjs.length; i++) {
        var obj = core.status.animateObjs[i];
        if (obj.index == obj.animate.frames.length) {
            (function (callback) {
                setTimeout(function () {
                    if (callback) callback();
                });
            })(obj.callback);
        }
    }
    core.status.animateObjs = core.status.animateObjs.filter(function (obj) {
        return obj.index < obj.animate.frames.length;
    });
    core.status.animateObjs.forEach(function (obj) {
        if (obj.hero) {
            core.maps._drawAnimateFrame(obj.animate, core.status.heroCenter.px, core.status.heroCenter.py, obj.index++);
        } else {
            core.maps._drawAnimateFrame(obj.animate, obj.centerX, obj.centerY, obj.index++);
        }
    });
    core.animateFrame.animateTime = timestamp;
}

control.prototype._animationFrame_heroMoving = function (timestamp) {
    if (core.status.heroMoving <= 0) return;
    // 换腿
    if (timestamp - core.animateFrame.moveTime > core.values.moveSpeed) {
        core.animateFrame.leftLeg = !core.animateFrame.leftLeg;
        core.animateFrame.moveTime = timestamp;
    }
    core.drawHero(core.animateFrame.leftLeg?'leftFoot':'rightFoot', 4*core.status.heroMoving);
}

control.prototype._animationFrame_weather = function (timestamp) {
    var weather = core.animateFrame.weather;
    if (timestamp - weather.time <= 30 || !core.dymCanvas.weather) return;
    core.control["_animationFrame_weather_"+weather.type]();
    weather.time = timestamp;
}

control.prototype._animationFrame_weather_rain = function () {
    var ctx = core.dymCanvas.weather, ox = core.bigmap.offsetX, oy = core.bigmap.offsetY;
    core.clearMap('weather');
    ctx.strokeStyle = 'rgba(174,194,224,0.8)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    core.animateFrame.weather.nodes.forEach(function (p) {
        ctx.beginPath();
        ctx.moveTo(p.x-ox, p.y-oy);
        ctx.lineTo(p.x + p.l * p.xs - ox, p.y + p.l * p.ys - oy);
        ctx.stroke();

        p.x += p.xs;
        p.y += p.ys;
        if (p.x > core.bigmap.width * 32 || p.y > core.bigmap.height * 32) {
            p.x = Math.random() * core.bigmap.width * 32;
            p.y = -10;
        }

    });

    ctx.fill();
}

control.prototype._animationFrame_weather_snow = function () {
    var ctx = core.dymCanvas.weather, ox = core.bigmap.offsetX, oy = core.bigmap.offsetY;
    core.clearMap('weather');
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    core.animateFrame.weather.data = core.animateFrame.weather.data || 0;
    core.animateFrame.weather.data += 0.01;

    var angle = core.animateFrame.weather.data;
    core.animateFrame.weather.nodes.forEach(function (p) {
        ctx.moveTo(p.x - ox, p.y - oy);
        ctx.arc(p.x - ox, p.y - oy, p.r, 0, Math.PI * 2, true);
        // update
        p.x += Math.sin(angle) * 2;
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        if (p.x > core.bigmap.width*32 + 5 || p.x < -5 || p.y > core.bigmap.height*32) {
            if (Math.random() > 1 / 3) {
                p.x = Math.random() * core.bigmap.width*32;
                p.y = -10;
            }
            else {
                if (Math.sin(angle) > 0)
                    p.x = -5;
                else
                    p.x = core.bigmap.width*32 + 5;
                p.y = Math.random() * core.bigmap.height*32;
            }
        }
    });
    ctx.fill();
}

control.prototype._animationFrame_weather_fog = function () {
    var ctx = core.dymCanvas.weather, ox = core.bigmap.offsetX, oy = core.bigmap.offsetY;
    core.clearMap('weather');
    if (core.animateFrame.weather.fog) {
        var w = core.__PIXELS__, h = core.__PIXELS__;
        core.setAlpha('weather', 0.5);
        core.animateFrame.weather.nodes.forEach(function (p) {
            ctx.drawImage(core.animateFrame.weather.fog, p.x - ox, p.y - oy, w, h);
            p.x += p.xs;
            p.y += p.ys;
            if (p.x > core.bigmap.width*32 - w/2) {
                p.x = core.bigmap.width*32 - w/2 - 1;
                p.xs = -p.xs;
            }
            if (p.x < -w/2) {
                p.x = -w/2+1;
                p.xs = -p.xs;
            }
            if (p.y > core.bigmap.height*32 - h/2) {
                p.y = core.bigmap.height*32 - h/2 - 1;
                p.ys = -p.ys;
            }
            if (p.y < -h/2) {
                p.y = -h/2+1;
                p.ys = -p.ys;
            }
        });
        core.setAlpha('weather',1);
    }
}

control.prototype._animateFrame_tip = function (timestamp) {
    if (core.animateFrame.tip == null) return;
    var tip = core.animateFrame.tip;
    if (timestamp - tip.time <= 30) return;
    var delta = timestamp - tip.time;
    tip.time = timestamp;

    core.setFont('data', "16px Arial");
    core.setTextAlign('data', 'left');
    core.clearMap('data', 0, 0, core.__PIXELS__, 50);
    core.ui._drawTip_drawOne(tip);
    if (tip.stage == 1) {
        tip.opacity += 0.05;
        if (tip.opacity >= 0.6) {
            tip.stage = 2;
            tip.displayTime = 0;
        }
    } else if (tip.stage == 2) {
        tip.displayTime += delta;
        if (tip.displayTime >= 1000) tip.stage = 3;
    } else tip.opacity -= 0.05;

    if (tip.opacity <= 0) {
        core.animateFrame.tip = null;
    }
}

control.prototype._animationFrame_parallelDo = function (timestamp) {
    core.control.controldata.parallelDo(timestamp);
}

// ------ 标题界面的处理 ------ //

////// 显示游戏开始界面 //////
control.prototype.showStartAnimate = function (noAnimate, callback) {
    this._showStartAnimate_resetDom();
    if (core.flags.startUsingCanvas || noAnimate)
        return this._showStartAnimate_finished(core.flags.startUsingCanvas, callback);
    core.hideWithAnimate(core.dom.startTop, 20, function () {
        core.control._showStartAnimate_finished(false, callback);
    });
}

control.prototype._showStartAnimate_resetDom = function () {
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
    core.dom.musicBtn.style.display = 'block';
    core.setMusicBtn();
    // 重置音量
    core.events.setVolume(1, 0);
    core.updateStatusBar();
}

control.prototype._showStartAnimate_finished = function (start, callback) {
    core.dom.startTop.style.display = 'none';
    core.dom.startButtonGroup.style.display = 'block';
    main.selectedButton = null;
    main.selectButton(0);
    if (start) core.startGame();
    if (callback) callback();
}

////// 隐藏游戏开始界面 //////
control.prototype.hideStartAnimate = function (callback) {
    core.hideWithAnimate(core.dom.startPanel, 20, callback);
}

////// 游戏是否已经开始 //////
control.prototype.isPlaying = function() {
    return core.status.played;
}

////// 清除游戏状态和数据 //////
control.prototype.clearStatus = function() {
    // 停止各个Timeout和Interval
    for (var i in core.timeout) {
        clearTimeout(core.timeout[i]);
        core.timeout[i] = null;
    }
    for (var i in core.interval) {
        clearInterval(core.interval[i]);
        core.interval[i] = null;
    }
    core.status = {};
    core.clearStatusBar();
    core.deleteAllCanvas();
    core.status.played = false;
}

control.prototype._initStatistics = function (totalTime) {
    if (!core.isset(core.status.hero.statistics))
        core.status.hero.statistics = {
            'totalTime': totalTime,
            'currTime': 0,
            'hp': 0,
            "battle": 0,
            'money': 0,
            'exp': 0,
            'battleDamage': 0,
            'poisonDamage': 0,
            'extraDamage': 0,
            'moveDirectly': 0,
            'ignoreSteps': 0,
        }
}

// ------ 自动寻路，人物行走 ------ //

////// 清除自动寻路路线 //////
control.prototype.clearAutomaticRouteNode = function (x, y) {
    core.clearMap('route', x * 32 + 5 - core.status.automaticRoute.offsetX, y * 32 + 5 - core.status.automaticRoute.offsetY, 27, 27);
}

////// 停止自动寻路操作 //////
control.prototype.stopAutomaticRoute = function () {
    if (!core.status.played) return;
    core.status.automaticRoute.autoHeroMove = false;
    core.status.automaticRoute.autoStep = 0;
    core.status.automaticRoute.destStep = 0;
    core.status.automaticRoute.movedStep = 0;
    core.status.automaticRoute.autoStepRoutes = [];
    core.status.automaticRoute.destX=null;
    core.status.automaticRoute.destY=null;
    core.status.automaticRoute.lastDirection = null;
    core.status.heroStop = true;
    if (core.status.automaticRoute.moveStepBeforeStop.length==0)
        core.deleteCanvas('route');
}

////// 保存剩下的寻路，并停止 //////
control.prototype.saveAndStopAutomaticRoute = function () {
    var automaticRoute = core.status.automaticRoute;
    if (automaticRoute.moveStepBeforeStop.length == 0) {
        automaticRoute.moveStepBeforeStop = automaticRoute.autoStepRoutes.slice(automaticRoute.autoStep - 1);
        if (automaticRoute.moveStepBeforeStop.length>=1)
            automaticRoute.moveStepBeforeStop[0].step -= automaticRoute.movedStep;
    }
    this.stopAutomaticRoute();
}

////// 继续剩下的自动寻路操作 //////
control.prototype.continueAutomaticRoute = function () {
    // 此函数只应由events.afterOpenDoor和events.afterBattle调用
    var moveStep = core.status.automaticRoute.moveStepBeforeStop;
    //core.status.automaticRoute.moveStepBeforeStop = [];
    if(moveStep.length===0 || (moveStep.length===1 && moveStep[0].step===1)) {
        core.status.automaticRoute.moveStepBeforeStop = [];
    }
    else {
        core.setAutoHeroMove(moveStep);
    }
}

////// 清空剩下的自动寻路列表 //////
control.prototype.clearContinueAutomaticRoute = function (callback) {
    core.deleteCanvas('route');
    core.status.automaticRoute.moveStepBeforeStop=[];
    if (callback) callback();
}

////// 显示离散的寻路点 //////
control.prototype.fillPosWithPoint = function (pos) {
    core.fillRect('ui', pos.x*32+12,pos.y*32+12,8,8, '#bfbfbf');
}

////// 设置自动寻路路线 //////
control.prototype.setAutomaticRoute = function (destX, destY, stepPostfix) {
    if (!core.status.played || core.status.lockControl) return;
    if (this._setAutomaticRoute_isMoving(destX, destY)) return;
    if (this._setAutomaticRoute_isTurning(destX, destY, stepPostfix)) return;
    if (this._setAutomaticRoute_clickMoveDirectly(destX, destY, stepPostfix)) return;
    // 找寻自动寻路路线
    var moveStep = core.automaticRoute(destX, destY);
    if (moveStep.length == 0 && (destX != core.status.hero.loc.x || destY != core.status.hero.loc.y || stepPostfix.length == 0))
        return;
    moveStep = moveStep.concat(stepPostfix);
    core.status.automaticRoute.destX=destX;
    core.status.automaticRoute.destY=destY;
    this._setAutomaticRoute_drawRoute(moveStep);
    this._setAutomaticRoute_setAutoSteps(moveStep);
    // 立刻移动
    core.setAutoHeroMove();
}

control.prototype._setAutomaticRoute_isMoving = function (destX, destY) {
    if (core.status.automaticRoute.autoHeroMove) {
        var lastX = core.status.automaticRoute.destX, lastY=core.status.automaticRoute.destY;
        core.stopAutomaticRoute();
        // 双击瞬移
        if (lastX==destX && lastY==destY) {
            core.status.automaticRoute.moveDirectly = true;
            setTimeout(function () {
                if (core.status.automaticRoute.moveDirectly && core.status.heroMoving==0) {
                    core.control.tryMoveDirectly(destX, destY);
                }
                core.status.automaticRoute.moveDirectly = false;
            }, core.values.moveSpeed);
        }
        return true;
    }
    return false;
}

control.prototype._setAutomaticRoute_isTurning = function (destX, destY, stepPostfix) {
    if (destX == core.status.hero.loc.x && destY == core.status.hero.loc.y && stepPostfix.length==0) {
        if (core.timeout.turnHeroTimeout==null) {
            core.timeout.turnHeroTimeout = setTimeout(function() {
                core.turnHero();
                clearTimeout(core.timeout.turnHeroTimeout);
                core.timeout.turnHeroTimeout = null;
            }, 250);
        }
        else {
            clearTimeout(core.timeout.turnHeroTimeout);
            core.timeout.turnHeroTimeout = null;
            core.getNextItem();
        }
        return true;
    }
    if (core.timeout.turnHeroTimeout!=null) return true;
    return false;
}

control.prototype._setAutomaticRoute_clickMoveDirectly = function (destX, destY, stepPostfix) {
    // 单击瞬间移动
    if (core.status.heroStop && core.status.heroMoving==0) {
        if (stepPostfix.length<=1 && !core.hasFlag('__noClickMove__') && core.control.tryMoveDirectly(destX, destY))
            return true;
    }
    return false;
}

control.prototype._setAutomaticRoute_drawRoute = function (moveStep) {
    // 计算绘制区域的宽高，并尽可能小的创建route层
    var sx = core.bigmap.width * 32, sy = core.bigmap.height * 32, dx = 0, dy = 0;
    moveStep.forEach(function (t) {
        sx = Math.min(sx, t.x * 32); dx = Math.max(dx, t.x * 32);
        sy = Math.min(sy, t.y * 32); dy = Math.max(dy, t.y * 32);
    });
    core.status.automaticRoute.offsetX = sx;
    core.status.automaticRoute.offsetY = sy;
    var ctx = core.createCanvas('route', sx-core.bigmap.offsetX, sy-core.bigmap.offsetY, dx-sx+32, dy-sy+32, 95);
    ctx.fillStyle = '#bfbfbf';
    ctx.strokeStyle = '#bfbfbf';
    ctx.lineWidth = 8;
    for (var m = 0; m < moveStep.length; m++) {
        if (m == moveStep.length - 1) {
            ctx.fillRect(moveStep[m].x * 32 + 10 - sx, moveStep[m].y * 32 + 10 - sy, 12, 12);
        }
        else {
            ctx.beginPath();
            var cx = moveStep[m].x*32 +16 - sx, cy = moveStep[m].y*32+16 - sy;
            var currDir = moveStep[m].direction, nextDir = moveStep[m+1].direction;
            ctx.moveTo(cx-core.utils.scan[currDir].x*11, cy-core.utils.scan[currDir].y*11);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx+core.utils.scan[nextDir].x*11, cy+core.utils.scan[nextDir].y*11);
            ctx.stroke();
        }
    }
}

control.prototype._setAutomaticRoute_setAutoSteps = function (moveStep) {
    // 路线转autoStepRoutes
    var step = 0, currStep = null;
    moveStep.forEach(function (t) {
        var dir = t.direction;
        if (currStep == null || currStep == dir)
            step++;
        else {
            core.status.automaticRoute.autoStepRoutes.push({'direction': currStep, 'step': step});
            step = 1;
        }
        currStep = dir;
    });
    core.status.automaticRoute.autoStepRoutes.push({'direction': currStep, 'step': step});
}

////// 设置勇士的自动行走路线 //////
control.prototype.setAutoHeroMove = function (steps) {
    steps=steps||core.status.automaticRoute.autoStepRoutes;
    if (steps.length == 0) return;
    core.status.automaticRoute.autoStepRoutes=steps;
    core.status.automaticRoute.autoHeroMove = true;
    core.status.automaticRoute.autoStep = 1;
    core.status.automaticRoute.destStep = steps[0].step;
    core.moveHero(steps[0].direction);
}

////// 设置行走的效果动画 //////
control.prototype.setHeroMoveInterval = function (callback) {
    if (core.status.heroMoving > 0) return;
    if (core.status.replay.speed == 24) {
        if (callback) callback();
        return;
    }

    core.status.heroMoving=1;

    var toAdd = 1;
    if (core.status.replay.speed>3) toAdd = 2;
    if (core.status.replay.speed>6) toAdd = 4;
    if (core.status.replay.speed>12) toAdd = 8;

    core.interval.heroMoveInterval = window.setInterval(function () {
        core.status.heroMoving+=toAdd;
        if (core.status.heroMoving>=8) {
            clearInterval(core.interval.heroMoveInterval);
            core.status.heroMoving = 0;
            if (callback) callback();
        }
    }, core.values.moveSpeed / 8 * toAdd / core.status.replay.speed);
}

////// 每移动一格后执行的事件 //////
control.prototype.moveOneStep = function (callback) {
    return this.controldata.moveOneStep(callback);
}

////// 实际每一步的行走过程 //////
control.prototype.moveAction = function (callback) {
    if (core.status.heroMoving>0) return;
    var noPass = core.noPass(core.nextX(), core.nextY()), canMove = core.canMoveHero();
    // 下一个点如果不能走
    if (noPass || !canMove) return this._moveAction_noPass(canMove, callback);
    this._moveAction_moving(callback);
}

control.prototype._moveAction_noPass = function (canMove, callback) {
    core.status.route.push(core.getHeroLoc('direction'));
    core.status.automaticRoute.moveStepBeforeStop = [];
    core.status.automaticRoute.lastDirection = core.getHeroLoc('direction');
    if (canMove) core.trigger(core.nextX(), core.nextY());
    core.drawHero();

    if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
        core.clearContinueAutomaticRoute();
        core.stopAutomaticRoute();
    }
    if (callback) callback();
}

control.prototype._moveAction_moving = function (callback) {
    core.setHeroMoveInterval(function () {
        core.setHeroLoc('x', core.nextX(), true);
        core.setHeroLoc('y', core.nextY(), true);

        var direction = core.getHeroLoc('direction');
        core.control._moveAction_popAutomaticRoute();
        core.status.route.push(direction);
        
        core.moveOneStep();
        if (callback) callback();
    });
}

control.prototype._moveAction_popAutomaticRoute = function () {
    var automaticRoute = core.status.automaticRoute;
    // 检查自动寻路是否被弹出
    if (automaticRoute.autoHeroMove) {
        automaticRoute.movedStep++;
        automaticRoute.lastDirection = core.getHeroLoc('direction');
        if (automaticRoute.destStep == automaticRoute.movedStep) {
            if (automaticRoute.autoStep == automaticRoute.autoStepRoutes.length) {
                core.clearContinueAutomaticRoute();
                core.stopAutomaticRoute();
            }
            else {
                automaticRoute.movedStep = 0;
                automaticRoute.destStep = automaticRoute.autoStepRoutes[automaticRoute.autoStep].step;
                core.setHeroLoc('direction', automaticRoute.autoStepRoutes[automaticRoute.autoStep].direction);
                core.status.automaticRoute.autoStep++;
            }
        }
    }
}

////// 让勇士开始移动 //////
control.prototype.moveHero = function (direction, callback) {
    // 如果正在移动，直接return
    if (core.status.heroMoving!=0) return;
    if (core.isset(direction))
        core.setHeroLoc('direction', direction);

    if (callback) return this.moveAction(callback);
    this._moveHero_moving();
}

control.prototype._moveHero_moving = function () {
    // ------ 我已经看不懂这个函数了，反正好用就行23333333
    core.status.heroStop = false;
    core.status.automaticRoute.moveDirectly = false;
    var move = function () {
        if (!core.status.heroStop) {
            if (core.hasFlag('debug') && core.status.ctrlDown) {
                if (core.status.heroMoving!=0) return;
                // 检测是否穿出去
                var nx = core.nextX(), ny = core.nextY();
                if (nx < 0 || nx >= core.bigmap.width || ny < 0 || ny >= core.bigmap.height) return;
                core.status.heroMoving=-1;
                core.eventMoveHero([core.getHeroLoc('direction')], core.values.moveSpeed, function () {
                    core.status.heroMoving=0;
                    move();
                });
            }
            else {
                core.moveAction();
                setTimeout(move, 50);
            }
        }
    }
    move();
}

////// 当前是否正在移动 //////
control.prototype.isMoving = function () {
    return !core.status.heroStop || core.status.heroMoving > 0;
}

////// 停止勇士的一切行动，等待勇士行动结束后，再执行callback //////
control.prototype.waitHeroToStop = function(callback) {
    var lastDirection = core.status.automaticRoute.lastDirection;
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    if (callback) {
        core.status.replay.animate=true;
        core.lockControl();
        core.status.automaticRoute.moveDirectly = false;
        setTimeout(function(){
            core.status.replay.animate=false;
            if (core.isset(lastDirection))
                core.setHeroLoc('direction', lastDirection);
            core.drawHero();
            callback();
        }, core.status.replay.speed == 24 ? 0 : 30);
    }
}

////// 转向 //////
control.prototype.turnHero = function(direction) {
    if (direction) {
        core.setHeroLoc('direction', direction);
        core.drawHero();
        core.status.route.push("turn:"+direction);
        return;
    }
    core.setHeroLoc('direction', core.turnDirection(':right'));
    core.drawHero();
    core.status.route.push("turn");
}

////// 瞬间移动 //////
control.prototype.moveDirectly = function (destX, destY, ignoreSteps) {
    return this.controldata.moveDirectly(destX, destY, ignoreSteps);
}

////// 尝试瞬间移动 //////
control.prototype.tryMoveDirectly = function (destX, destY) {
    if (this.nearHero(destX, destY)) return false;
    var canMoveArray = core.maps.generateMovableArray();
    var dirs = [[destX,destY],[destX-1,destY,"right"],[destX,destY-1,"down"],[destX,destY+1,"up"],[destX+1,destY,"left"]];
    var canMoveDirectlyArray = core.canMoveDirectlyArray(dirs);

    for (var i = 0; i < dirs.length; ++i) {
        var d = dirs[i], dx = d[0], dy = d[1], dir = d[2];
        if (dx<0 || dx>=core.bigmap.width|| dy<0 || dy>=core.bigmap.height) continue;
        if (dir && !core.inArray(canMoveArray[dx][dy],dir)) continue;
        if (canMoveDirectlyArray[i]<0) continue;
        if (core.control.moveDirectly(dx, dy, canMoveDirectlyArray[i])) {
            if (dir) core.moveHero(dir, function() {});
            return true;
        }
    }
    return false;
}

////// 绘制勇士 //////
control.prototype.drawHero = function (status, offset) {
    if (!core.isPlaying() || !core.status.floorId || core.status.gameOver) return;
    var x = core.getHeroLoc('x'), y = core.getHeroLoc('y'), direction = core.getHeroLoc('direction');
    status = status || 'stop';
    offset = offset || 0;
    var way = core.utils.scan[direction];
    var dx = way.x, dy = way.y, offsetX = dx * offset, offsetY = dy * offset;
    core.bigmap.offsetX = core.clamp((x - core.__HALF_SIZE__) * 32 + offsetX, 0, 32*core.bigmap.width-core.__PIXELS__);
    core.bigmap.offsetY = core.clamp((y - core.__HALF_SIZE__) * 32 + offsetY, 0, 32*core.bigmap.height-core.__PIXELS__);
    core.clearAutomaticRouteNode(x+dx, y+dy);
    core.clearMap('hero');
    core.status.heroCenter.px = 32 * x + offsetX + 16;
    core.status.heroCenter.py = 32 * y + offsetY + 32 - core.material.icons.hero.height / 2;

    if (!core.hasFlag('hideHero')) {
        this._drawHero_getDrawObjs(direction, x, y, status, offset).forEach(function (block) {
            core.drawImage('hero', block.img, block.heroIcon[block.status]*block.width,
                block.heroIcon.loc * block.height, block.width, block.height,
                block.posx+(32-block.width)/2, block.posy+32-block.height, block.width, block.height);
        });
    }

    core.control.updateViewport();
    core.setGameCanvasTranslate('hero', 0, 0);
}

control.prototype._drawHero_getDrawObjs = function (direction, x, y, status, offset) {
    var heroIconArr = core.material.icons.hero, drawObjs = [], index = 0;
    drawObjs.push({
        "img": core.material.images.hero,
        "width": core.material.icons.hero.width || 32,
        "height": core.material.icons.hero.height,
        "heroIcon": heroIconArr[direction],
        "posx": x * 32 - core.bigmap.offsetX + core.utils.scan[direction].x * offset,
        "posy": y * 32 - core.bigmap.offsetY + core.utils.scan[direction].y * offset,
        "status": status,
        "index": index++,
    });
    core.status.hero.followers.forEach(function (t) {
        drawObjs.push({
            "img": core.material.images.images[t.name],
            "width": core.material.images.images[t.name].width/4,
            "height": core.material.images.images[t.name].height/4,
            "heroIcon": heroIconArr[t.direction],
            "posx": 32*t.x - core.bigmap.offsetX + (t.stop?0:core.utils.scan[t.direction].x*Math.abs(offset)),
            "posy": 32*t.y - core.bigmap.offsetY + (t.stop?0:core.utils.scan[t.direction].y*Math.abs(offset)),
            "status": t.stop?"stop":status,
            "index": index++
        });
    });
    return drawObjs.sort(function(a, b) {
        return a.posy==b.posy?b.index-a.index:a.posy-b.posy;
    });
}

// ------ 画布、位置、阻激夹域，显伤 ------ //

////// 设置画布偏移
control.prototype.setGameCanvasTranslate = function(canvas,x,y){
    var c=core.dom.gameCanvas[canvas];
    x=x*core.domStyle.scale;
    y=y*core.domStyle.scale;
    c.style.transform='translate('+x+'px,'+y+'px)';
    c.style.webkitTransform='translate('+x+'px,'+y+'px)';
    c.style.OTransform='translate('+x+'px,'+y+'px)';
    c.style.MozTransform='translate('+x+'px,'+y+'px)';
    if(main.mode==='editor' && editor.isMobile){
        c.style.transform='translate('+(x/core.__PIXELS__*96)+'vw,'+(y/core.__PIXELS__*96)+'vw)';
        c.style.webkitTransform='translate('+(x/core.__PIXELS__*96)+'vw,'+(y/core.__PIXELS__*96)+'vw)';
        c.style.OTransform='translate('+(x/core.__PIXELS__*96)+'vw,'+(y/core.__PIXELS__*96)+'vw)';
        c.style.MozTransform='translate('+(x/core.__PIXELS__*96)+'vw,'+(y/core.__PIXELS__*96)+'vw)';
    }
};

////// 加减画布偏移
control.prototype.addGameCanvasTranslate = function (x, y) {
    for(var ii=0,canvas;canvas=core.dom.gameCanvas[ii];ii++){
        var id = canvas.getAttribute('id');
        if (id=='ui' || id=='data') continue; // UI层和data层不移动
        var offsetX = x, offsetY = y;
        if (core.bigmap.canvas.indexOf(id)>=0) {
            offsetX -= core.bigmap.offsetX;
            offsetY -= core.bigmap.offsetY;
        }
        core.control.setGameCanvasTranslate(id, offsetX, offsetY);
    }
}

////// 更新视野范围 //////
control.prototype.updateViewport = function() {
    core.bigmap.canvas.forEach(function(cn){
        core.control.setGameCanvasTranslate(cn,-core.bigmap.offsetX,-core.bigmap.offsetY);
    });
    // ------ 路线
    core.relocateCanvas('route', core.status.automaticRoute.offsetX - core.bigmap.offsetX, core.status.automaticRoute.offsetY - core.bigmap.offsetY);
}

////// 设置视野范围 //////
control.prototype.setViewport = function (x, y) {
    core.bigmap.offsetX = core.clamp(x, 0, 32 * core.bigmap.width - core.__PIXELS__);
    core.bigmap.offsetY = core.clamp(y, 0, 32 * core.bigmap.height - core.__PIXELS__);
    this.updateViewport();
    // ------ hero层也需要！
    var hero_x = core.clamp((core.getHeroLoc('x') - core.__HALF_SIZE__) * 32, 0, 32*core.bigmap.width-core.__PIXELS__);
    var hero_y = core.clamp((core.getHeroLoc('y') - core.__HALF_SIZE__) * 32, 0, 32*core.bigmap.height-core.__PIXELS__);
    core.control.setGameCanvasTranslate('hero', hero_x - core.bigmap.offsetX, hero_y - core.bigmap.offsetY);
}

////// 移动视野范围 //////
control.prototype.moveViewport = function (steps, time, callback) {
    time = time || core.values.moveSpeed;
    var step = 0, moveSteps = (steps||[]).filter(function (t) {
        return ['up','down','left','right'].indexOf(t)>=0;
    });
    var animate=window.setInterval(function() {
        if (moveSteps.length==0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
        }
        else {
            if (core.control._moveViewport_moving(++step, moveSteps))
                step = 0;
        }
    }, time / 16 / core.status.replay.speed);

    core.animateFrame.asyncId[animate] = true;
}

control.prototype._moveViewport_moving = function (step, moveSteps) {
    var direction = moveSteps[0], scan = core.utils.scan[direction];
    core.setViewport(core.bigmap.offsetX + 2 * scan.x, core.bigmap.offsetY + 2 * scan.y);
    if (step == 16) {
        moveSteps.shift();
        return true;
    }
    return false;
}

////// 获得勇士面对位置的x坐标 //////
control.prototype.nextX = function(n) {
    if (n == null) n = 1;
    return core.getHeroLoc('x')+core.utils.scan[core.getHeroLoc('direction')].x*n;
}

////// 获得勇士面对位置的y坐标 //////
control.prototype.nextY = function (n) {
    if (n == null) n = 1;
    return core.getHeroLoc('y')+core.utils.scan[core.getHeroLoc('direction')].y*n;
}

////// 某个点是否在勇士旁边 //////
control.prototype.nearHero = function (x, y, n) {
    if (n == null) n = 1;
    return Math.abs(x-core.getHeroLoc('x'))+Math.abs(y-core.getHeroLoc('y'))<=n;
}

////// 聚集跟随者 //////
control.prototype.gatherFollowers = function () {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y'), dir=core.getHeroLoc('direction');
    core.status.hero.followers.forEach(function (t) {
        t.x = x;
        t.y = y;
        t.stop = true;
        t.direction = dir;
    });
}

////// 更新跟随者坐标 //////
control.prototype.updateFollowers = function () {
    core.status.hero.followers.forEach(function (t) {
        if (!t.stop) {
            t.x += core.utils.scan[t.direction].x;
            t.y += core.utils.scan[t.direction].y;
        }
    })

    var nowx = core.getHeroLoc('x'), nowy = core.getHeroLoc('y');
    core.status.hero.followers.forEach(function (t) {
        t.stop = true;
        var dx = nowx - t.x, dy = nowy - t.y;
        for (var dir in core.utils.scan) {
            if (core.utils.scan[dir].x == dx && core.utils.scan[dir].y == dy) {
                t.stop = false;
                t.direction = dir;
            }
        }
        nowx = t.x; nowy = t.y;
    })
}

////// 更新领域、夹击、阻击的伤害地图 //////
control.prototype.updateCheckBlock = function(floorId) {
    return this.controldata.updateCheckBlock(floorId);
}

////// 检查并执行领域、夹击、阻击事件 //////
control.prototype.checkBlock = function () {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y'), loc = x+","+y;
    var damage = core.status.checkBlock.damage[loc];
    if (damage) {
        core.status.hero.hp -= damage;
        var text = (Object.keys(core.status.checkBlock.type[loc] || {}).join("，")) || "伤害";
        core.drawTip("受到"+text+damage+"点");
        core.drawHeroAnimate("zone");
        this._checkBlock_disableQuickShop();
        core.status.hero.statistics.extraDamage += damage;
        if (core.status.hero.hp <= 0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose();
            return;
        } else {
            core.updateStatusBar();
        }
    }
    this._checkBlock_repulse(core.status.checkBlock.repulse[loc]);
    this._checkBlock_ambush(core.status.checkBlock.ambush[loc]);
}

control.prototype._checkBlock_disableQuickShop = function () {
    // 禁用快捷商店
    if (core.flags.disableShopOnDamage) {
        Object.keys(core.status.shops).forEach(function (shopId) {
            core.setShopVisited(shopId, false);
        });
    }
}

////// 阻击 //////
control.prototype._checkBlock_repulse = function (repulse) {
    if (!repulse || repulse.length == 0) return;
    var actions = [];
    repulse.forEach(function (t) {
        actions.push({"type": "move", "loc": [t[0],t[1]], "steps": [t[3]], "time": 250, "keep": true, "async": true});
    });
    actions.push({"type": "waitAsync"});
    core.insertAction(actions);
}

////// 捕捉 //////
control.prototype._checkBlock_ambush = function (ambush) {
    if (!ambush || ambush.length == 0) return;
    // 捕捉效果
    var actions = [];
    ambush.forEach(function (t) {
        actions.push({"type": "move", "loc": [t[0],t[1]], "steps": [t[3]], "time": 250, "keep": false, "async":true});
    });
    actions.push({"type": "waitAsync"});
    // 强制战斗
    ambush.forEach(function (t) {
        actions.push({"type": "function", "function": "function() { "+
            "core.battle('" + t[2] + "', " + t[0]+ "," + t[1] + ", true, core.doAction); "+
            "}", "async": true});
    });
    core.insertAction(actions);
}

////// 更新全地图显伤 //////
control.prototype.updateDamage = function (floorId, ctx) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId) || core.status.gameOver) return;
    if (core.status.gameOver) return;
    var refreshCheckBlock = true;
    if (!core.isset(ctx)) {
        ctx = core.canvas.damage;
        core.clearMap('damage');
        refreshCheckBlock = false;
    }

    // 没有怪物手册
    if (!core.hasItem('book')) return;
    core.setFont(ctx, "bold 11px Arial");
    this._updateDamage_damage(floorId, ctx);
    this._updateDamage_extraDamage(floorId, ctx, refreshCheckBlock);
}

control.prototype._updateDamage_damage = function (floorId, ctx) {
    core.setTextAlign(ctx, 'left');
    core.status.maps[floorId].blocks.forEach(function (block) {
        var x = block.x, y = block.y;
        if (!block.disable && block.event.cls.indexOf('enemy') == 0 && block.event.displayDamage !== false) {
           if (core.flags.displayEnemyDamage) {
               var damageString = core.enemys.getDamageString(block.event.id, x, y, floorId);
               var damage = damageString.damage, color = damageString.color;
               core.fillBoldText(ctx, damage, 32*x+1, 32*(y+1)-1, color);
           }
           if (core.flags.displayCritical) {
               var critical = core.enemys.nextCriticals(block.event.id, 1, x, y, floorId);
               critical = core.formatBigNumber((critical[0]||[])[0], true);
               if (critical == '???') critical = '?';
               core.fillBoldText(ctx, critical, 32*x+1, 32*(y+1)-11, '#FFFFFF');
           }
        }
    });
}

control.prototype._updateDamage_extraDamage = function (floorId, ctx, refresh) {
    core.setTextAlign(ctx, 'center');
    if (refresh) this.updateCheckBlock(floorId);
    if (core.flags.displayExtraDamage) {
        var width = core.floors[floorId].width, height = core.floors[floorId].height;
        for (var x=0;x<width;x++) {
            for (var y=0;y<height;y++) {
                var damage = core.status.checkBlock.damage[x+","+y]||0;
                if (damage>0) { // 该点伤害
                    damage = core.formatBigNumber(damage, true);
                    core.fillBoldText(ctx, damage, 32*x+16, 32*(y+1)-14, '#FF7F00');
                }
                else { // 检查捕捉
                    if (core.status.checkBlock.ambush[x+","+y]) {
                        core.fillBoldText(ctx, '!', 32*x+16, 32*(y+1)-14, '#FF7F00');
                    }
                }
            }
        }
    }
}

// ------ 录像相关 ------ //

////// 选择录像文件 //////
control.prototype.chooseReplayFile = function () {
    core.readFile(function (obj) {
        if (obj.name!=core.firstData.name) return alert("存档和游戏不一致！");
        if (!obj.route) return alert("无效的录像！");
        var _replay = function () {
            core.startGame(core.flags.startUsingCanvas?'':obj.hard||'', obj.seed, core.decodeRoute(obj.route));
        }
        if (obj.version && obj.version!=core.firstData.version) {
            core.myconfirm("游戏版本不一致！\n你仍然想播放录像吗？", _replay);
            return;
        }
        _replay();
    }, null, ".h5route");
}

////// 开始播放 //////
control.prototype.startReplay = function (list) {
    if (!core.isPlaying()) return;
    core.status.replay.replaying=true;
    core.status.replay.pausing=true;
    core.status.replay.speed=1.0;
    core.status.replay.toReplay = core.clone(list);
    core.status.replay.totalList = core.status.route.concat(list);
    core.status.replay.steps = 0;
    core.status.replay.save = [];
    core.updateStatusBar();
    core.drawTip("开始播放");
    this.replay();
}

////// 更改播放状态 //////
control.prototype.triggerReplay = function () {
    if (core.status.replay.pausing) this.resumeReplay();
    else this.pauseReplay();
}

////// 暂停播放 //////
control.prototype.pauseReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    core.status.replay.pausing = true;
    core.updateStatusBar();
    core.drawTip("暂停播放");
}

////// 恢复播放 //////
control.prototype.resumeReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");
    core.status.replay.pausing = false;
    core.updateStatusBar();
    core.drawTip("恢复播放");
    core.replay();
}

////// 单步播放 //////
control.prototype.stepReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");
    core.replay(true);
}

////// 加速播放 //////
control.prototype.speedUpReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    var speeds = [0.2, 0.5, 1, 2, 3, 6, 12, 24];
    for (var i = speeds.length - 2; i >= 0; i--) {
        if (speeds[i] <= core.status.replay.speed) {
            core.status.replay.speed = speeds[i+1];
            break;
        }
    }
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 减速播放 //////
control.prototype.speedDownReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    var speeds = [0.2, 0.5, 1, 2, 3, 6, 12, 24];
    for (var i = 1; i <= speeds.length; i++) {
        if (speeds[i] >= core.status.replay.speed) {
            core.status.replay.speed = speeds[i-1];
            break;
        }
    }
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 设置播放速度 //////
control.prototype.setReplaySpeed = function (speed) {
    if (!core.isPlaying() || !core.isReplaying()) return;
    core.status.replay.speed = speed;
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 停止播放 //////
control.prototype.stopReplay = function (force) {
    if (!core.isPlaying()) return;
    if (!core.isReplaying() && !force) return;
    core.status.replay.toReplay = [];
    core.status.replay.totalList = [];
    core.status.replay.replaying=false;
    core.status.replay.pausing=false;
    core.status.replay.speed=1.0;
    core.status.replay.steps = 0;
    core.status.replay.save = [];
    core.updateStatusBar();
    core.drawTip("停止播放并恢复游戏");
}

////// 回退 //////
control.prototype.rewindReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");
    if (core.status.replay.save.length==0)
        return core.drawTip("无法再回到上一个节点");
    var save = core.status.replay.save, data = save.pop();
    core.loadData(data.data, function () {
        core.status.replay = {
            "replaying": true,
            "pausing": true,
            "animate": false,
            "toReplay": data.replay.toReplay,
            "totalList": data.replay.totalList,
            "speed": data.replay.speed,
            "steps": data.replay.steps,
            "save": save
        }
        core.updateStatusBar();
        core.drawTip("成功回退到上一个节点");
    });
}

////// 回放时存档 //////
control.prototype.saveReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");

    core.lockControl();
    core.status.event.id='save';
    var saveIndex = core.saves.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;

    core.ui.drawSLPanel(10*page+offset);
}

////// 回放时查看怪物手册 //////
control.prototype.bookReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate
        || (core.status.event.id && core.status.event.id != 'viewMaps'))
        return core.drawTip("请等待当前事件的处理结束");
    if (!core.hasItem('book')) return core.drawTip('你没有'+core.material.items['book'].name);

    // 从“浏览地图”页面打开
    if (core.status.event.id=='viewMaps')
        core.status.event.ui = core.status.event.data;

    core.lockControl();
    core.status.event.id='book';
    core.useItem('book', true);
}

////// 回放录像时浏览地图 //////
control.prototype.viewMapReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");

    core.lockControl();
    core.status.event.id='viewMaps';
    core.ui.drawMaps();
}

control.prototype.toolboxReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");

    core.lockControl();
    core.status.event.id='toolbox';
    core.ui.drawToolbox();
}

control.prototype.equipboxReplay = function () {
    if (!core.isPlaying() || !core.isReplaying()) return;
    if (!core.status.replay.pausing) return core.drawTip("请先暂停录像");
    if (core.isMoving() || core.status.replay.animate || core.status.event.id)
        return core.drawTip("请等待当前事件的处理结束");

    core.lockControl();
    core.status.event.id='equipbox';
    core.ui.drawEquipbox();
}

////// 是否正在播放录像 //////
control.prototype.isReplaying = function () {
    return (core.status.replay||{}).replaying;
}

////// 回放 //////
control.prototype.replay = function (force) {
    if (!core.isPlaying() || !core.isReplaying()
         || core.status.replay.animate || core.status.event.id) return;
    if (core.status.replay.pausing && !force) return;
    if (core.status.replay.toReplay.length==0)
        return this._replay_finished();
    this._replay_save();
    var action=core.status.replay.toReplay.shift();
    if (this._doReplayAction(action)) return;
    this._replay_error(action);
}

////// 注册一个录像行为 //////
// name：自定义名称，可用于注销使用
// func：具体执行录像的函数，可为一个函数或插件中的函数名；
//       需要接受一个action参数，代表录像回放时的下一个操作
// func返回true代表成功处理了此录像行为，false代表没有处理此录像行为。
control.prototype.registerReplayAction = function (name, func) {
    this.unregisterReplayAction(name);
    this.replayActions.push({name: name, func: func});
}

////// 注销一个录像行为 //////
control.prototype.unregisterReplayAction = function (name) {
    this.replayActions = this.replayActions.filter(function (b) { return b.name != name; });
}

////// 执行录像行为，会在注册的函数中依次执行直到得到true为止 //////
control.prototype._doReplayAction = function (action) {
    for (var i in this.replayActions) {
        try {
            if (core.doFunc(this.replayActions[i].func, this, action)) return true;
        } catch (e) {
            main.log(e);
            main.log("ERROR in replayActions["+this.replayActions[i].name+"]：已自动注销该项。");
            core.unregisterReplayAction(this.replayActions[i].name);
        }
    }
    return false;
}

control.prototype._replay_finished = function () {
    core.status.replay.replaying = false;
    core.status.event.selection = 0;
    var str = "录像播放完毕，你想退出播放吗？";
    if (core.status.route.length != core.status.replay.totalList.length
        || core.subarray(core.status.route, core.status.replay.totalList) == null) {
        str = "录像播放完毕，但记录不一致。\n请检查录像播放时的二次记录问题。\n你想退出播放吗？";
    }
    core.ui.drawConfirmBox(str, function () {
        core.ui.closePanel();
        core.stopReplay(true);
    }, function () {
        core.status.replay.replaying = true;
        core.ui.closePanel();
        core.pauseReplay();
    });
}

control.prototype._replay_save = function () {
    core.status.replay.steps++;
    if (core.status.replay.steps%40==1) {
        if (core.status.replay.save.length == 30)
            core.status.replay.save.shift();
        core.status.replay.save.push({"data": core.saveData(), "replay": {
            "totalList": core.clone(core.status.replay.totalList),
            "toReplay": core.clone(core.status.replay.toReplay),
            "speed": core.status.replay.speed,
            "steps": core.status.replay.steps
        }});
    }
}

control.prototype._replay_error = function (action) {
    core.ui.closePanel();
    core.status.replay.replaying = false;
    var len = core.status.replay.toReplay.length;
    var prevList = core.status.replay.totalList.slice(-len - 11, -len - 1);
    var nextList = core.status.replay.toReplay.slice(0, 10);
    main.log("录像文件出错，当前操作：" + action);
    main.log("之前的10个操作是：\n" + prevList.toString());
    main.log("接下来10个操作是：\n" + nextList.toString());
    core.ui.drawConfirmBox("录像文件出错，你想回到上个节点吗？", function () {
        core.ui.closePanel();
        if (core.status.replay.save.length > 0) {
            core.status.replay.replaying = true;
            core.status.replay.pausing = true;
            core.rewindReplay();
        }
        else {
            core.drawTip("无法回到上一个节点");
            core.stopReplay(true);
        }
    }, function () {
        core.ui.closePanel();
        core.stopReplay(true);
    });
}

control.prototype.__replay_getTimeout = function () {
    if (core.status.replay.speed == 24) return 0;
    return 750 / Math.max(1, core.status.replay.speed);
}

control.prototype._replayAction_move = function (action) {
    if (["up","down","left","right"].indexOf(action)<0) return false;
    core.moveHero(action, core.replay);
    return true;
}

control.prototype._replayAction_item = function (action) {
    if (action.indexOf("item:")!=0) return false;
    var itemId = action.substring(5);
    if (!core.canUseItem(itemId)) return false;
    if (core.material.items[itemId].hideInReplay || core.status.replay.speed == 24) {
        core.useItem(itemId, false, core.replay);
        return true;
    }
    var tools = Object.keys(core.status.hero.items.tools)
        .filter(function (id) { return !core.material.items[id].hideInToolbox; }).sort();
    var constants = Object.keys(core.status.hero.items.constants)
        .filter(function (id) { return !core.material.items[id].hideInToolbox; }).sort();
    var index, per = core.__SIZE__-1;
    if ((index=tools.indexOf(itemId))>=0) {
        core.status.event.data = {"toolsPage": Math.floor(index/per)+1, "constantsPage":1};
        index = index%per;
    }
    else if ((index=constants.indexOf(itemId))>=0) {
        core.status.event.data = {"toolsPage": 1, "constantsPage": Math.floor(index/per)+1};
        index = index%per+per;
    }
    if (index<0) return false;
    core.ui.drawToolbox(index);
    setTimeout(function () {
        core.ui.closePanel();
        core.useItem(itemId, false, core.replay);
    }, core.control.__replay_getTimeout());
    return true;
}

control.prototype._replayAction_equip = function (action) {
    if (action.indexOf("equip:")!=0) return false;
    var equipId = action.substring(6);
    var ownEquipment = Object.keys(core.status.hero.items.equips).sort();
    var index = ownEquipment.indexOf(equipId), per = core.__SIZE__-1;
    if (index<0) return false;
    core.status.route.push(action);
    if (core.material.items[equipId].hideInReplay || core.status.replay.speed == 24) {
        core.loadEquip(equipId, core.replay);
        return true;
    }
    core.status.event.data = {"page":Math.floor(index/per)+1, "selectId":null};
    index = index%per+per;
    core.ui.drawEquipbox(index);
    setTimeout(function () {
        core.ui.closePanel();
        core.loadEquip(equipId, core.replay);
    }, core.control.__replay_getTimeout());
    return true;
}

control.prototype._replayAction_unEquip = function (action) {
    if (action.indexOf("unEquip:")!=0) return false;
    var equipType = parseInt(action.substring(8));
    if (!core.isset(equipType)) return false;
    core.ui.drawEquipbox(equipType);
    core.status.route.push(action);
    if (core.status.replay.speed == 24) {
        core.unloadEquip(equipType, core.replay);
        return true;
    }
    setTimeout(function () {
        core.ui.closePanel();
        core.unloadEquip(equipType, core.replay);
    }, core.control.__replay_getTimeout());
    return true;
}

control.prototype._replayAction_fly = function (action) {
    if (action.indexOf("fly:")!=0) return false;
    var floorId=action.substring(4);
    var toIndex=core.floorIds.indexOf(floorId);
    if (!core.canUseItem('fly')) return false;
    core.ui.drawFly(toIndex);
    if (core.status.replay.speed == 24) {
        if (!core.flyTo(floorId, core.replay))
            core.control._replay_error(action);
        return true;
    }
    setTimeout(function () {
        if (!core.flyTo(floorId, core.replay))
            core.control._replay_error(action);
    }, core.control.__replay_getTimeout());
    return true;
}

control.prototype._replayAction_shop = function (action) {
    if (action.indexOf("shop:")!=0) return false;
    var shopId = action.substring(5);
    if (core.canUseQuickShop(shopId) != null || !core.canOpenShop(shopId)) {
        this._replay_error(shopId);
        return true;
    }
    core.openShop(shopId, false);
    core.replay();
    return true;
}

control.prototype._replayAction_turn = function (action) {
    if (action != 'turn' && action.indexOf('turn:') != 0) return false;
    if (action == 'turn') core.turnHero();
    else core.turnHero(action.substring(5));
    core.replay();
    return true;
}

control.prototype._replayAction_getNext = function (action) {
    if (action != "getNext") return false;
    if (!core.getNextItem()) return false;
    core.replay();
    return true;
}

control.prototype._replayAction_moveDirectly = function (action) {
    if (action.indexOf("move:")!=0) return false;
    // 忽略连续的瞬移事件
    while (core.status.replay.toReplay.length>0 &&
        core.status.replay.toReplay[0].indexOf('move:')==0) {
            core.status.route.push(action);
            action = core.status.replay.toReplay.shift();
    }

    var pos=action.substring(5).split(":");
    var x=parseInt(pos[0]), y=parseInt(pos[1]);
    var nowx=core.getHeroLoc('x'), nowy=core.getHeroLoc('y');
    if (!core.moveDirectly(x, y)) return false;
    if (core.status.replay.speed == 24) {
        core.replay();
        return true;
    }

    core.ui.drawArrow('ui', 32*nowx+16-core.bigmap.offsetX, 32*nowy+16-core.bigmap.offsetY,
        32*x+16-core.bigmap.offsetX, 32*y+16-core.bigmap.offsetY, '#FF0000', 3);
    setTimeout(function () {
        core.clearMap('ui');
        core.replay();
    }, core.control.__replay_getTimeout());
    return true;
}

control.prototype._replayAction_key = function (action) {
    if (action.indexOf("key:") != 0) return false;
    core.actions.keyUp(parseInt(action.substring(4)), false, true);
    core.replay();
    return true;
}

// ------ 存读档相关 ------ //

////// 自动存档 //////
control.prototype.autosave = function (removeLast) {
    var x=null;
    if (removeLast) {
        x=core.status.route.pop();
        core.status.route.push("turn:"+core.getHeroLoc('direction'));
    }
    if (core.status.event.id == 'action') // 事件中的自动存档
        core.setFlag("__events__", core.clone(core.status.event.data));
    if (core.saves.autosave.data == null) {
        core.saves.autosave.data = [];
    }
    core.saves.autosave.data.splice(core.saves.autosave.now, 0, core.saveData());
    core.saves.autosave.now += 1;
    if (core.saves.autosave.data.length > core.saves.autosave.max) {
        if (core.saves.autosave.now < core.saves.autosave.max / 2)
            core.saves.autosave.data.pop();
        else {
            core.saves.autosave.data.shift();
            core.saves.autosave.now=core.saves.autosave.now-1;
        }
    }
    core.saves.autosave.updated = true;
    core.saves.ids[0] = true;
    core.removeFlag("__events__");
    if (removeLast) {
        core.status.route.pop();
        if (x) core.status.route.push(x);
    }
}

/////// 实际进行自动存档 //////
control.prototype.checkAutosave = function () {
    if (!core.animateFrame || !core.saves || !core.saves.autosave) return;
    core.setLocalStorage('totalTime', core.animateFrame.totalTime);
    var autosave = core.saves.autosave;
    if (autosave.data == null || !autosave.updated || !autosave.storage) return;
    autosave.updated = false;
    if (autosave.data.length >= 1) {
        core.setLocalForage("autoSave", autosave.data[autosave.now - 1]);
    }
}

////// 实际进行存读档事件 //////
control.prototype.doSL = function (id, type) {
    switch (type) {
        case 'save': this._doSL_save(id); break;
        case 'load': this._doSL_load(id, this._doSL_load_afterGet); break;
        case 'reload': this._doSL_reload(id, this._doSL_load_afterGet); break;
        case 'replayLoad': this._doSL_load(id, this._doSL_replayLoad_afterGet); break;
        case 'replayRemain': this._doSL_load(id, this._doSL_replayRemain_afterGet); break;
    }
}

control.prototype._doSL_save = function (id) {
    if (id=='autoSave') return core.drawTip('不能覆盖自动存档！');
    // 在事件中的存档
    if (core.status.event.interval != null)
        core.setFlag("__events__", core.status.event.interval);
    core.setLocalForage("save"+id, core.saveData(), function() {
        core.saves.saveIndex = id;
        core.setLocalStorage('saveIndex', core.saves.saveIndex);
        // 恢复事件
        if (!core.events.recoverEvents(core.status.event.interval))
            core.ui.closePanel();
        core.drawTip('存档成功！');
    }, function(err) {
        main.log(err);
        if (core.platform.useLocalForage) {
            alert("存档失败，错误信息：\n"+err);
        }
        else {
            alert("存档失败，错误信息：\n"+err+"\n建议使用垃圾存档清理工具进行清理！");
        }
    });
    core.removeFlag("__events__");
    return;
}

control.prototype._doSL_load = function (id, callback) {
    if (id == 'autoSave' && core.saves.autosave.data != null) {
        core.saves.autosave.now -= 1;
        var data = core.saves.autosave.data.splice(core.saves.autosave.now, 1)[0];
        if (core.isPlaying() && !core.status.gameOver) {
            core.control.autosave(0);
            core.saves.autosave.now -= 1;
        }
        if (core.saves.autosave.now == 0) {
            core.saves.autosave.data.unshift(core.clone(data));
            core.saves.autosave.now += 1;
        }
        callback(id, data);
    }
    else {
        core.getLocalForage(id=='autoSave'?id:"save"+id, null, function(data) {
            if (id == 'autoSave' && data != null) {
                core.saves.autosave.data = data;
                if (!(core.saves.autosave.data instanceof Array)) {
                    core.saves.autosave.data = [core.saves.autosave.data];
                }
                core.saves.autosave.now = core.saves.autosave.data.length;
                return core.control._doSL_load(id, callback);
            }
            callback(id, data);
        }, function(err) {
            main.log(err);
            alert("无效的存档");
        })
    }
    return;
}

control.prototype._doSL_reload = function (id, callback) {
    if (core.saves.autosave.data != null && core.saves.autosave.now < core.saves.autosave.data.length) {
        var data = core.saves.autosave.data.splice(core.saves.autosave.now, 1)[0];
        core.control.autosave(false);
        callback(id, data);
    }
    return;
}

control.prototype._doSL_load_afterGet = function (id, data) {
    if (!data) return alert("无效的存档");
    var _replay = function () {
        core.startGame(data.hard, data.hero.flags.__seed__, core.decodeRoute(data.route));
    };
    if (data.version != core.firstData.version) {
        core.myconfirm("存档版本不匹配！\n你想回放此存档的录像吗？\n可以随时停止录像播放以继续游戏。", _replay);
        return;
    }
    core.ui.closePanel();
    core.loadData(data, function() {
        core.removeFlag('__fromLoad__');
        core.drawTip("读档成功");
        if (id!="autoSave") {
            core.saves.saveIndex=id;
            core.setLocalStorage('saveIndex', core.saves.saveIndex);
        }
    });
}

control.prototype._doSL_replayLoad_afterGet = function (id, data) {
    if (!data) return core.drawTip("无效的存档");
    if (data.version != core.firstData.version) return core.drawTip("存档版本不匹配");
    if (data.hard != core.status.hard) core.drawTip("游戏难度不匹配！");
    if (data.hashCode != null && data.hashCode != core.utils.hashCode(data.hero))
        return alert("存档校验失败，请勿修改存档文件！");
    var route = core.subarray(core.status.route, core.decodeRoute(data.route));
    if (route == null || data.hero.flags.__seed__ != core.getFlag('__seed__'))
        return core.drawTip("无法从此存档回放录像");
    core.loadData(data, function () {
        core.startReplay(route);
        core.drawTip("回退到存档节点");
    });

}

control.prototype._doSL_replayRemain_afterGet = function (id, data) {
    if (!data) return core.drawTip("无效的存档");

    var route = core.decodeRoute(data.route);
    if (core.status.tempRoute) {
        var remainRoute = core.subarray(route, core.status.tempRoute);
        if (remainRoute == null)
            return alert("无法接续播放录像！\n该存档必须是前一个选择的存档的后续内容。");
        delete core.status.tempRoute;
        core.ui.closePanel();
        core.startReplay(remainRoute);
        core.drawTip("接续播放录像");
        return;
    }
    else if (data.floorId != core.status.floorId || data.hero.loc.x != core.getHeroLoc('x') || data.hero.loc.y != core.getHeroLoc('y'))
        return alert("楼层或坐标不一致！");

    core.status.tempRoute = route;
    core.ui.closePanel();
    core.drawText("\t[步骤2]请选择第二个存档。\n\r[yellow]该存档必须是前一个存档的后续。\r\n将尝试播放到此存档。", function () {
        core.status.event.id = 'replayRemain';
        core.lockControl();
        var saveIndex = core.saves.saveIndex;
        var page = parseInt((saveIndex - 1) / 5), offset = saveIndex - 5 * page;
        core.ui.drawSLPanel(10 * page + offset);
    });
}

////// 同步存档到服务器 //////
control.prototype.syncSave = function (type) {
    core.ui.drawWaiting("正在同步，请稍后...");
    var callback = function (saves) {
        core.control._syncSave_http(type, saves);
    }
    if (type == 'all') core.getAllSaves(callback);
    else core.getSave(core.saves.saveIndex, callback);
}

control.prototype._syncSave_http = function (type, saves) {
    if (!saves) return core.drawText("没有要同步的存档");
    var formData = new FormData();
    formData.append('type', 'save');
    formData.append('name', core.firstData.name);
    formData.append('data', JSON.stringify(saves));

    core.http("POST", "/games/sync.php", formData, function (data) {
        var response = JSON.parse(data);
        if (response.code<0) {
            core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因："+response.msg);
        }
        else {
            core.drawText((type=='all'?"所有存档":"存档"+core.saves.saveIndex)+"同步成功！\n\n您的存档编号： "
                +response.code+"\n您的存档密码： "+response.msg
                +"\n\n请牢记以上两个信息（如截图等），在从服务器\n同步存档时使用。\n\r[yellow]另外请注意，存档同步只会保存一个月的时间。\r")
        }
    }, function (e) {
        core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因："+e);
    })
}

////// 从服务器加载存档 //////
control.prototype.syncLoad = function () {
    core.myprompt("请输入存档编号", null, function (id) {
        if (!id) return core.ui.drawSyncSave();
        core.myprompt("请输入存档密码：", null, function (password) {
            if (!password) return core.ui.drawSyncSave();
            core.ui.drawWaiting("正在同步，请稍后...");
            core.control._syncLoad_http(id, password);
        });
    });
}

control.prototype._syncLoad_http = function (id, password) {
    var formData = new FormData();
    formData.append('type', 'load');
    formData.append('name', core.firstData.name);
    formData.append('id', id);
    formData.append('password', password);

    core.http("POST", "/games/sync.php", formData, function (data) {
        var response = JSON.parse(data);
        if (response.code == 0) {
            core.control._syncLoad_write(JSON.parse(response.msg));
        }
        else {
            core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因："+response.msg);
        }
    }, function (e) {
        core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因："+e);
    });
}

control.prototype._syncLoad_write = function (data) {
    if (data instanceof Array) {
        core.status.event.selection=1;
        core.ui.drawConfirmBox("所有本地存档都将被覆盖，确认？", function () {
            for (var i=1;i<=5*(main.savePages||30);i++) {
                if (i<=data.length)
                    core.setLocalForage("save"+i, data[i-1]);
                else if (core.saves.ids[i])
                    core.removeLocalForage("save"+i);
            }
            core.ui.closePanel();
            core.drawText("同步成功！\n你的本地所有存档均已被覆盖。");
        }, function () {
            core.status.event.selection=0;
            core.ui.drawSyncSave();
        });
    }
    else {
        // 只覆盖单存档
        core.setLocalForage("save"+core.saves.saveIndex, data, function() {
            core.drawText("同步成功！\n单存档已覆盖至存档"+core.saves.saveIndex);
        });
    }
}

////// 存档到本地 //////
control.prototype.saveData = function() {
    return this.controldata.saveData();
}

////// 从本地读档 //////
control.prototype.loadData = function (data, callback) {
    return this.controldata.loadData(data, callback);
}

control.prototype.getSave = function (index, callback) {
    if (index == 0) {
        // --- 自动存档先从缓存中获取
        if (core.saves.autosave.data != null)
            callback(core.saves.autosave.data);
        else {
            core.getLocalForage("autoSave", null, function(data) {
                if (data != null) {
                    core.saves.autosave.data = data;
                    if (!(core.saves.autosave.data instanceof Array)) {
                        core.saves.autosave.data = [core.saves.autosave.data];
                    }
                    core.saves.autosave.now = core.saves.autosave.data.length;
                }
                callback(core.saves.autosave.data);
            }, function(err) {
                main.log(err);
                callback(null);
            });
        }
        return;
    }
    core.getLocalForage("save"+index, null, function(data) {
        if (callback) callback(data);
    }, function(err) {
        main.log(err);
        if (callback) callback(null);
    });
}

control.prototype.getSaves = function (ids, callback) {
    if (!(ids instanceof Array)) return this.getSave(ids, callback);
    var count = ids.length, data = {};
    for (var i = 0; i < ids.length; ++i) {
        (function (i) {
            core.getSave(ids[i], function (result) {
                data[i] = result;
                if (Object.keys(data).length == count)
                    callback(data);
            })
        })(i);
    }
}

control.prototype.getAllSaves = function (callback) {
    var ids = Object.keys(core.saves.ids).filter(function(x){return x!=0;})
        .sort(function(a,b) {return a-b;}), saves = [];
    this.getSaves(ids, function (data) {
        for (var i = 0; i < ids.length; ++i) {
            if (data[i] != null)
                saves.push(data[i]);
        }
        callback(saves);
    });
}

////// 获得所有存在存档的存档位 //////
control.prototype.getSaveIndexes = function (callback) {
    var indexes = {};
    if (core.platform.useLocalForage) {
        localforage.iterate(function (value, key, n) {
            core.control._getSaveIndexes_getIndex(indexes, key);
        }, function () {
            callback(indexes);
        });
    }
    else {
        Object.keys(localStorage).forEach(function (key) {
            core.control._getSaveIndexes_getIndex(indexes, key);
        });
        callback(indexes);
    }
}

control.prototype._getSaveIndexes_getIndex = function (indexes, name) {
    var e = new RegExp('^'+core.firstData.name+"_(save\\d+|autoSave)$").exec(name);
    if (e) {
        if (e[1]=='autoSave') indexes[0]=true;
        else indexes[parseInt(e[1].substring(4))] = true;
    }
}

////// 判断某个存档位是否存在存档 //////
control.prototype.hasSave = function (index) {
    return core.saves.ids[index] || false;
}

////// 删除某个存档
control.prototype.removeSave = function (index, callback) {
    if (index == 0 || index == "autoSave") {
        index = "autoSave";
        core.removeLocalForage(index, function () {
            core.saves.autosave.data = null;
            core.saves.autosave.updated = false;
            if (callback) callback();
        });
        return;
    }
    core.removeLocalForage("save" + index, function () {
        core.saves.favorite = core.saves.favorite.filter(function (i) { return core.hasSave(i); });
        delete core.saves.favoriteName[index];
        core.control._updateFavoriteSaves();
        if (callback) callback();
    }, function () {
        core.drawTip("无法删除存档！");
        if (callback) callback();
    });
}

////// 读取收藏信息
control.prototype._loadFavoriteSaves = function () {
    core.saves.favorite = core.getLocalStorage("favorite", []);
    // --- 移除不存在的收藏
    core.saves.favorite = core.saves.favorite.filter(function (i) { return core.hasSave(i); });
    core.saves.favoriteName = core.getLocalStorage("favoriteName", {});
}

control.prototype._updateFavoriteSaves = function () {
    core.setLocalStorage("favorite", core.saves.favorite);
    core.setLocalStorage("favoriteName", core.saves.favoriteName);
}

// ------ 属性，状态，位置，buff，变量，锁定控制等 ------ //

////// 设置勇士属性 //////
control.prototype.setStatus = function (name, value) {
    if (!core.status.hero) return;
    if (name == 'x' || name == 'y' || name == 'direction')
        this.setHeroLoc(name, value);
    else
        core.status.hero[name] = value;
}

////// 增减勇士属性 //////
control.prototype.addStatus = function (name, value) {
    this.setStatus(name, this.getStatus(name) + value);
}

////// 获得勇士属性 //////
control.prototype.getStatus = function (name) {
    if (!core.status.hero) return null;
    if (name == 'x' || name == 'y' || name == 'direction')
        return this.getHeroLoc(name);
    return core.status.hero[name];
}

////// 从status中获得属性，如果不存在则从勇士属性中获取 //////
control.prototype.getStatusOrDefault = function (status, name) {
    if (status && name in status)
        return Math.floor(status[name]);
    return Math.floor(this.getStatus(name));
}

////// 获得勇士实际属性（增幅后的） //////
control.prototype.getRealStatus = function (name) {
    return this.getRealStatusOrDefault(null, name);
}

////// 从status中获得实际属性（增幅后的），如果不存在则从勇士属性中获取 //////
control.prototype.getRealStatusOrDefault = function (status, name) {
    return Math.floor(this.getStatusOrDefault(status, name) * this.getBuff(name));
}

////// 设置某个属性的增幅值 //////
control.prototype.setBuff = function (name, value) {
    this.setFlag('__'+name+'_buff__', value);
}

////// 加减某个属性的增幅值 //////
control.prototype.addBuff = function (name, value) {
    this.setFlag('__'+name+'_buff__', this.getBuff(name) + value);
}

////// 获得某个属性的增幅值 //////
control.prototype.getBuff = function (name) {
    return core.getFlag('__'+name+'_buff__', 1);
}

////// 设置勇士的位置 //////
control.prototype.setHeroLoc = function (name, value, noGather) {
    if (!core.status.hero) return;
    core.status.hero.loc[name] = value;
    if ((name=='x' || name=='y') && !noGather) {
        this.gatherFollowers();
    }
}

////// 获得勇士的位置 //////
control.prototype.getHeroLoc = function (name) {
    if (!core.status.hero) return;
    if (name == null) return core.status.hero.loc;
    return core.status.hero.loc[name];
}



////// 获得某个等级的名称 //////
control.prototype.getLvName = function (lv) {
    if (!core.status.hero) return null;
    if (lv == null) lv = core.status.hero.lv;
    return ((core.firstData.levelUp||[])[lv-1]||{}).title || lv;
}

////// 设置某个自定义变量或flag //////
control.prototype.setFlag = function(name, value) {
    if (value == null) return this.removeFlag(name);
    if (!core.status.hero) return;
    core.status.hero.flags[name]=value;
}

////// 增加某个flag数值 //////
control.prototype.addFlag = function(name, value) {
    if (!core.status.hero) return;
    core.setFlag(name, core.getFlag(name, 0) + value);
}

////// 获得某个自定义变量或flag //////
control.prototype.getFlag = function(name, defaultValue) {
    if (!core.status.hero) return defaultValue;
    var value = core.status.hero.flags[name];
    return value != null ? value : defaultValue;
}

////// 是否存在某个自定义变量或flag，且值为true //////
control.prototype.hasFlag = function(name) {
    return !!core.getFlag(name);
}

////// 删除某个自定义变量或flag //////
control.prototype.removeFlag = function(name) {
    if (!core.status.hero) return;
    delete core.status.hero.flags[name];
}

////// 锁定状态栏，常常用于事件处理 //////
control.prototype.lockControl = function () {
    core.status.lockControl = true;
}

////// 解锁状态栏 //////
control.prototype.unLockControl = function () {
    core.status.lockControl = false;
}

////// 开启debug模式 //////
control.prototype.debug = function() {
    core.setFlag('debug', true);
    core.drawText("\t[调试模式开启]此模式下按住Ctrl键（或Ctrl+Shift键）可以穿墙并忽略一切事件。\n此模式下将无法上传成绩。");
}

// ------ 天气，色调，BGM ------ //

control.prototype.getMappedName = function (name) {
    return (main.nameMap || {})[name] || name;
}

////// 更改天气效果 //////
control.prototype.setWeather = function (type, level) {
    // 非雨雪
    if (type == null) {
        core.deleteCanvas('weather')
        core.animateFrame.weather.type = null;
        core.animateFrame.weather.nodes = [];
        return;
    }
    // 当前天气：则忽略
    if (type==core.animateFrame.weather.type && level == null) return;
    level = core.clamp(parseInt(level) || 5, 1, 10);
    level *= parseInt(20*core.bigmap.width*core.bigmap.height/(core.__SIZE__*core.__SIZE__));

    // 计算当前的宽高
    core.createCanvas('weather', 0, 0, core.__PIXELS__, core.__PIXELS__, 80);
    core.animateFrame.weather.type = type;
    core.animateFrame.weather.nodes = [];
    this._setWeather_createNodes(type, level);
}

control.prototype._setWeather_createNodes = function (type, level) {
    switch (type) {
        case 'rain':
            for (var a=0;a<level;a++) {
                core.animateFrame.weather.nodes.push({
                    'x': Math.random()*core.bigmap.width*32,
                    'y': Math.random()*core.bigmap.height*32,
                    'l': Math.random() * 2.5,
                    'xs': -4 + Math.random() * 4 + 2,
                    'ys': Math.random() * 10 + 10
                })
            }
            break;
        case 'snow':
            for (var a=0;a<level;a++) {
                core.animateFrame.weather.nodes.push({
                    'x': Math.random()*core.bigmap.width*32,
                    'y': Math.random()*core.bigmap.height*32,
                    'r': Math.random() * 5 + 1,
                    'd': Math.random() * Math.min(level, 200),
                })
            }
            break;
        case 'fog':
            if (core.animateFrame.weather.fog) {
                for (var a=0;a<level/10;a++) {
                    core.animateFrame.weather.nodes.push({
                        'x': Math.random()*core.bigmap.width*32 - 208,
                        'y': Math.random()*core.bigmap.height*32 - 208,
                        'xs': Math.random() * 4 - 2,
                        'ys': Math.random() * 4 - 2
                    })
                }
            }
            break;
    }
}

////// 更改画面色调 //////
control.prototype.setCurtain = function(color, time, callback) {
    if (time == null) time=750;
    if (time<=0) time=0;
    if (!core.status.curtainColor)
        core.status.curtainColor = [0,0,0,0];
    if (!color) color = [0,0,0,0];
    if (color[3] == null) color[3] = 1;
    color[3] = core.clamp(color[3],0,1);

    if (time==0) {
        // 直接变色
        core.clearMap('curtain');
        core.fillRect('curtain', 0, 0, core.__PIXELS__, core.__PIXELS__, core.arrayToRGBA(color));
        core.status.curtainColor = color;
        if (callback) callback();
        return;
    }

    this._setCurtain_animate(core.status.curtainColor, color, time, callback);
}

control.prototype._setCurtain_animate = function (nowColor, color, time, callback) {
    time /= Math.max(core.status.replay.speed, 1)
    var per_time = 10, step = parseInt(time / per_time);
    if (step <= 0) step = 1;
    var animate = setInterval(function() {
        nowColor = [
            (nowColor[0]*(step-1)+color[0])/step,
            (nowColor[1]*(step-1)+color[1])/step,
            (nowColor[2]*(step-1)+color[2])/step,
            (nowColor[3]*(step-1)+color[3])/step,
        ];
        core.clearMap('curtain');
        core.fillRect('curtain', 0, 0, core.__PIXELS__, core.__PIXELS__, core.arrayToRGBA(nowColor));
        step--;
        if (step <= 0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            core.status.curtainColor = color;
            if (core.isset(callback)) callback();
        }
    }, per_time);

    core.animateFrame.asyncId[animate] = true;
}

////// 画面闪烁 //////
control.prototype.screenFlash = function (color, time, times, callback) {
    times = times || 1;
    time = time / 3;
    var nowColor = core.clone(core.status.curtainColor);
    core.setCurtain(color, time, function() {
        core.setCurtain(nowColor, time * 2, function() {
            if (times > 1)
                core.screenFlash(color, time * 3, times - 1, callback);
            else {
                if (callback) callback();
            }
        });
    });
}

////// 播放背景音乐 //////
control.prototype.playBgm = function (bgm, startTime) {
    bgm = core.getMappedName(bgm);
    if (main.mode!='play' || !core.material.bgms[bgm]) return;
    // 如果不允许播放
    if (!core.musicStatus.bgmStatus) {
        try {
            core.musicStatus.playingBgm = bgm;
            core.musicStatus.lastBgm = bgm;
            core.material.bgms[bgm].pause();
        }
        catch (e) {
            main.log(e);
        }
        return;
    }
    this.setMusicBtn();

    try {
        this._playBgm_play(bgm, startTime);
    }
    catch (e) {
        console.log("无法播放BGM "+bgm);
        main.log(e);
        core.musicStatus.playingBgm = null;
    }
}

control.prototype._playBgm_play = function (bgm, startTime) {
    // 如果当前正在播放，且和本BGM相同，直接忽略
    if (core.musicStatus.playingBgm == bgm && !core.material.bgms[core.musicStatus.playingBgm].paused) {
        return;
    }
    // 如果正在播放中，暂停
    if (core.musicStatus.playingBgm) {
        core.material.bgms[core.musicStatus.playingBgm].pause();
    }
    // 缓存BGM
    core.loader.loadBgm(bgm);
    // 播放当前BGM
    core.material.bgms[bgm].volume = core.musicStatus.userVolume * core.musicStatus.designVolume;
    core.material.bgms[bgm].currentTime = startTime || 0;
    core.material.bgms[bgm].play();
    core.musicStatus.playingBgm = bgm;
    core.musicStatus.lastBgm = bgm;
}

////// 暂停背景音乐的播放 //////
control.prototype.pauseBgm = function () {
    if (main.mode!='play')return;
    try {
        if (core.musicStatus.playingBgm) {
            core.musicStatus.pauseTime = core.material.bgms[core.musicStatus.playingBgm].currentTime;
            core.material.bgms[core.musicStatus.playingBgm].pause();
            core.musicStatus.playingBgm = null;
        }
    }
    catch (e) {
        console.log("无法暂停BGM");
        main.log(e);
    }
    this.setMusicBtn();
}

////// 恢复背景音乐的播放 //////
control.prototype.resumeBgm = function (resumeTime) {
    if (main.mode!='play')return;
    try {
        core.playBgm(core.musicStatus.playingBgm || core.musicStatus.lastBgm || main.startBgm,
            resumeTime ? core.musicStatus.pauseTime : 0);
    }
    catch (e) {
        console.log("无法恢复BGM");
        main.log(e);
    }
    this.setMusicBtn();
}

control.prototype.setMusicBtn = function () {
    if (core.musicStatus.bgmStatus)
        core.dom.musicBtn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAABWVBMVEX///9iYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmL///8AAAC5ubn+/v6xsbEtLS0MDAxmZmZoaGhvb2/c3Nzd3d38/Pz9/f0oKCgpKSl0dHR1dXW6urrb29v7+/v09PTv7+/39/cgICACAgImJibh4eGFhYWGhoaHh4eOjo5paWm7u7vDw8PMzMwyMjI7OztAQEDe3t5FRUVMTEzj4+Pl5eXm5ubp6enr6+tcXFzi4uL19fVeXl74+PgjIyNkZGQGBgaSkpKYmJiampqenp4DAwMwMDBnZ2cICAivr68eHh63t7cLCwsSEhLw8PBhYWEUFBQVFRXNzc3Pz8/Z2dna2toaGhqkpKSlpaWpqamrq6tFOUNAAAAAc3RSTlMAAwQFBhUWGxwkJSYyO0dISVBRUmpvj5CSk5SVoaOlpqiysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKyA0IuUgAAAVdJREFUeF5NkVVbw0AQRTcQrLR4IIEGcidJoaUuQHF3d3d3+P/CkuxCzss8nG++mbnDBJXhNt2CpbeFK1kQpSEKidlc8S9qdATRa6UIdQMoxEpDA0Ov3wUAPfW+qLWACydNv9zMrzkJwPK6FB3oHyOfXfuNxvoBQ+GmBYinhHB77TmiVBxoYUw1AYcEq332AS8OYKosAuTT0nza9uU2USYPRJgGxEiSOFywJ3mNARozgBJJzkfLvfu8JgGDWcC9FEsjWzR+y80gYDEAA8QZ3N6kmP1Fs3fEASB7pob7Hh+Wz5L0ci17Or05J7bH6B6dZv05XWK3rG+myV05Ert592Qo55sPuoIr7hEZHHtieIPWy0RU9DLwc3Mnck/vi8/E8XNrDWQtEVnL/ySKMrv0jPwPp870fprcyYifmiEmqGpHkI5q9ofSFIUk2qiwIGpEMyxYhhZRRcMPz89RJ2s9W8wAAAAASUVORK5CYII=";
    else
        core.dom.musicBtn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAABYlBMVEX///9iYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmL////8/PwAAABmZmZoaGihoaGioqKxsbG5ubnb29vc3Nzd3d3h4eHi4uL9/f3+/v4tLS1nZ2d0dHSUlJSenp66uroMDAz7+/spKSkoKCgUFBRpaWkVFRVvb291dXU7OzuVlZWYmJhkZGQgICAjIyOkpKQCAgK3t7cGBgbv7++pqamrq6seHh4mJiZhYWGamprp6enr6+saGhpeXl7j4+Pl5eXm5uZKSkrw8PD09PT19fW7u7vDw8PMzMwICAgwMDAyMjILCwtAQECGhoaHh4eBgYGFhYUSEhJXV1dZWVlcXFyOjo6SkpLNzc339/fPz8/Z2dna2tqTk5OlpaWxOPeTAAAAdnRSTlMAAwQFBhUWGxwkJSYyO0dISVBRUmpvj5CSk5SVoaOlpqiysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKyNuo+uwAAAWJJREFUeF5NkmV34zAQReUm7WbTuJBNunY3bvXGDjNTkZkZlpn5/9eR5FPfbzr3jGb0RkwRiMQMDm7EIgHmRxtLwMOaHHoQjwz4MUKeCM8AWMrmd7u7f/aXAMyOShHiQD1n04DtN5e5FMBFlSauIsm585dKi4CpuSYKJIv1tBDVmvOSqJgEoowFLSBHaQh10XHWiCgHWEGmAw2blPrvOK/KRJUGoLM4kCVSKrWz7HwgoiwQZyaQJ0+9PvxV23BNATAZB25IqX9b3+jTW9fcApwB6NLgUD5NY3mPXnwmFwBezff1ztzRFzTp94FXMy36HDuCa2RafdnnmZqtL818Gl9/qNnEeyrUk2aTPiKj3qMyWBVi/YSuWq5qiwxkbtX3vYWzdz/l8M0k8ERlvViiB1Ygslb7SbVtJezncj+Cx5bYaeGuonZqhZlieAp+no74/s5EAh6JcY35Cepxk4ObcT3IJPe/1lKsDpFCFQAAAABJRU5ErkJggg==";
}

////// 更改背景音乐的播放 //////
control.prototype.triggerBgm = function () {
    if (main.mode!='play') return;

    core.musicStatus.bgmStatus = !core.musicStatus.bgmStatus;
    if (core.musicStatus.bgmStatus)
        this.resumeBgm();
    else
        this.pauseBgm();
    core.setLocalStorage('bgmStatus', core.musicStatus.bgmStatus);
}

////// 播放音频 //////
control.prototype.playSound = function (sound) {
    sound = core.getMappedName(sound);
    if (main.mode!='play' || !core.musicStatus.soundStatus || !core.material.sounds[sound]) return;
    try {
        if (core.musicStatus.audioContext != null) {
            var source = core.musicStatus.audioContext.createBufferSource();
            source.buffer = core.material.sounds[sound];
            source.connect(core.musicStatus.gainNode);
            var id = setTimeout(null);
            source.onended = function () {
                delete core.musicStatus.playingSounds[id];
            }
            if (source.start) source.start(0);
            else if (source.noteOn) source.noteOn(0);
            core.musicStatus.playingSounds[id] = source;
        }
        else {
            core.material.sounds[sound].volume = core.musicStatus.userVolume;
            core.material.sounds[sound].play();
        }
    }
    catch (e) {
        console.log("无法播放SE "+sound);
        main.log(e);
    }
}

////// 停止所有音频 //////
control.prototype.stopSound = function () {
    for (var i in core.musicStatus.playingSounds) {
        var source = core.musicStatus.playingSounds[i];
        try {
            if (source.stop) source.stop();
            else if (source.noteOff) source.noteOff();
        }
        catch (e) {
            main.log(e);
        }
    }
    core.musicStatus.playingSounds = {};
}

////// 检查bgm状态 //////
control.prototype.checkBgm = function() {
    core.playBgm(core.musicStatus.playingBgm || main.startBgm);
}

// ------ 状态栏，工具栏等相关 ------ //

////// 清空状态栏 //////
control.prototype.clearStatusBar = function() {
    Object.keys(core.statusBar).forEach(function (e) {
        if (core.statusBar[e].innerHTML != null)
            core.statusBar[e].innerHTML = "&nbsp;";
    })
    core.statusBar.image.book.style.opacity = 0.3;
    if (!core.flags.equipboxButton)
        core.statusBar.image.fly.style.opacity = 0.3;
}

////// 更新状态栏 //////
control.prototype.updateStatusBar = function (doNotCheckAutoEvents) {
    if (!core.isPlaying()) return;
    this.controldata.updateStatusBar();
    if (!doNotCheckAutoEvents) core.checkAutoEvents();
    this._updateStatusBar_setToolboxIcon();
}

control.prototype._updateStatusBar_setToolboxIcon = function () {
    if (core.isReplaying()) {
        core.statusBar.image.book.src = core.status.replay.pausing ? core.statusBar.icons.play.src : core.statusBar.icons.pause.src;
        core.statusBar.image.book.style.opacity = 1;
        core.statusBar.image.fly.src = core.statusBar.icons.stop.src;
        core.statusBar.image.fly.style.opacity = 1;
        core.statusBar.image.toolbox.src = core.statusBar.icons.rewind.src;
        core.statusBar.image.keyboard.src = core.statusBar.icons.book.src;
        core.statusBar.image.shop.src = core.statusBar.icons.floor.src;
        core.statusBar.image.save.src = core.statusBar.icons.speedDown.src;
        core.statusBar.image.load.src = core.statusBar.icons.speedUp.src;
        core.statusBar.image.settings.src = core.statusBar.icons.save.src;
    }
    else {
        core.statusBar.image.book.src = core.statusBar.icons.book.src;
        core.statusBar.image.book.style.opacity = core.hasItem('book') ? 1 : 0.3;
        if (!core.flags.equipboxButton) {
            core.statusBar.image.fly.src = core.statusBar.icons.fly.src;
            core.statusBar.image.fly.style.opacity = core.hasItem('fly') ? 1 : 0.3;
        }
        else {
            core.statusBar.image.fly.src = core.statusBar.icons.equipbox.src;
            core.statusBar.image.fly.style.opacity = 1;
        }
        core.statusBar.image.toolbox.src = core.statusBar.icons.toolbox.src;
        core.statusBar.image.keyboard.src = core.statusBar.icons.keyboard.src;
        core.statusBar.image.shop.src = core.statusBar.icons.shop.src;
        core.statusBar.image.save.src = core.statusBar.icons.save.src;
        core.statusBar.image.load.src = core.statusBar.icons.load.src;
        core.statusBar.image.settings.src = core.statusBar.icons.settings.src;
    }
}

control.prototype.showStatusBar = function () {
    if (main.mode == 'editor') return;
    if (core.domStyle.showStatusBar) return;
    var statusItems = core.dom.status;
    core.domStyle.showStatusBar = true;
    core.removeFlag('hideStatusBar');
    // 显示
    for (var i = 0; i < statusItems.length; ++i)
        statusItems[i].style.opacity = 1;
    this.setToolbarButton(false);
    core.dom.tools.hard.style.display = 'block';
}

control.prototype.hideStatusBar = function (showToolbox) {
    if (main.mode == 'editor') return;

    // 如果原本就是隐藏的，则先显示
    if (!core.domStyle.showStatusBar)
        this.showStatusBar();
    if (core.isReplaying()) showToolbox = true;

    var statusItems = core.dom.status, toolItems = core.dom.tools;
    core.domStyle.showStatusBar = false;
    core.setFlag('hideStatusBar', true);
    core.setFlag('showToolbox', showToolbox || null);
    // 隐藏
    for (var i = 0; i < statusItems.length; ++i)
        statusItems[i].style.opacity = 0;
    if (!core.domStyle.isVertical || !showToolbox) {
        for (var i = 0; i < toolItems.length; ++i)
            toolItems[i].style.display = 'none';
    }
}

////// 更新状态栏的勇士图标 //////
control.prototype.updateHeroIcon = function (name) {
    name = name || "hero.png";
    if (core.statusBar.icons.name == name) return;
    core.statusBar.icons.name = name;

    var image = core.material.images.hero;
    // 全身图
    var w = core.material.icons.hero.width || 32;
    var h = core.material.icons.hero.height || 48;
    var ratio = Math.min(w / h, 1), width = 32 * ratio, left = 16 - width/2;

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = 32;
    canvas.height = 32;
    context.drawImage(image, 0, 0, w, h, left, 0, width, 32);

    core.statusBar.image.name.src = canvas.toDataURL("image/png");
}

control.prototype.updateGlobalAttribute = function (name) {
    if (name == null) name = Object.keys(core.status.globalAttribute);
    if (name instanceof Array) {
        name.forEach(function (t) {
            core.control.updateGlobalAttribute(t);
        });
        return;
    }
    var attribute = core.status.globalAttribute || core.initStatus.globalAttribute;
    if (attribute == null) return;
    switch (name) {
        case 'statusLeftBackground':
            if (!core.domStyle.isVertical) {
                core.dom.statusBar.style.background = attribute[name];
            }
            break;
        case 'statusTopBackground':
            if (core.domStyle.isVertical) {
                core.dom.statusBar.style.background = attribute[name];
            }
            break;
        case 'toolsBackground':
            if (core.domStyle.isVertical) {
                core.dom.toolBar.style.background = attribute[name];
            }
            break;
        case 'borderColor':
            {
                var border = '3px ' + attribute[name] + ' solid';
                core.dom.statusBar.style.borderTop = border;
                core.dom.statusBar.style.borderLeft = border;
                core.dom.statusBar.style.borderRight = core.domStyle.isVertical?border:'';
                core.dom.statusBar.style.borderBottom = core.domStyle.isVertical?'':border;
                core.dom.gameDraw.style.border = border;
                core.dom.toolBar.style.borderLeft = border;
                core.dom.toolBar.style.borderRight = core.domStyle.isVertical?border:'';
                core.dom.toolBar.style.borderBottom = core.domStyle.isVertical?border:'';
                break;
            }
        case 'statusBarColor':
            {
                var texts = core.dom.statusTexts;
                for (var i=0;i<texts.length;i++)
                    texts[i].style.color = attribute[name];
                break;
            }
        case 'hardLabelColor':
            core.dom.hard.style.color = attribute[name];
            break;
        case 'floorChangingBackground':
            core.dom.floorMsgGroup.style.background = attribute[name];
            break;
        case 'floorChangingTextColor':
            core.dom.floorMsgGroup.style.color = attribute[name];
            break;
    }
}

////// 改变工具栏为按钮1-8 //////
control.prototype.setToolbarButton = function (useButton) {
    if (!core.domStyle.showStatusBar) {
        // 隐藏状态栏时检查竖屏
        if (!core.domStyle.isVertical) {
            for (var i = 0; i < core.dom.tools.length; ++i)
                core.dom.tools[i].style.display = 'none';
            return;
        }
        if (!core.hasFlag('showToolbox')) return;
        else core.dom.tools.hard.style.display = 'block';
    }

    if (useButton == null) useButton = core.domStyle.toolbarBtn;
    if (!core.domStyle.isVertical || core.isReplaying()) useButton = false;
    core.domStyle.toolbarBtn = useButton;

    if (useButton) {
        ["book","fly","toolbox","keyboard","shop","save","load","settings"].forEach(function (t) {
            core.statusBar.image[t].style.display = 'none';
        });
        ["btn1","btn2","btn3","btn4","btn5","btn6","btn7","btn8"].forEach(function (t) {
            core.statusBar.image[t].style.display = 'block';
        })
    }
    else {
        ["btn1","btn2","btn3","btn4","btn5","btn6","btn7","btn8"].forEach(function (t) {
            core.statusBar.image[t].style.display = 'none';
        });
        ["book","fly","toolbox","save","load","settings"].forEach(function (t) {
            core.statusBar.image[t].style.display = 'block';
        });
        core.statusBar.image.keyboard.style.display
            = core.statusBar.image.shop.style.display
            = core.domStyle.isVertical ? "block":"none";
    }
}

////// ------ resize处理 ------ //

control.prototype._shouldDisplayStatus = function(id) {
    if (id == null) {
        var toDraw = [], status = core.dom.status;
        for (var i = 0; i<status.length; ++i) {
            var dom = core.dom.status[i], idCol = dom.id;
            if (idCol.indexOf("Col")!=idCol.length-3) continue;
            var id = idCol.substring(0, idCol.length-3);
            if (!this._shouldDisplayStatus(id)) continue;
            toDraw.push(id);
        }
        return toDraw;
    }
    var obj = {};
    core.flags.statusBarItems.forEach(function (v) { obj[v] = true; })
    switch (id) {
        case 'floor': return obj.enableFloor;
        case 'name': return obj.enableName;
        case 'lv': return obj.enableLv;
        case 'hp': return obj.enableHP;
        case 'hpmax': return obj.enableHPMax;
        case 'mana': return obj.enableMana;
        case 'atk': return obj.enableAtk;
        case 'def': return obj.enableDef;
        case 'mdef': return obj.enableMDef;
        case 'money': return obj.enableMoney;
        case 'exp': return obj.enableExp && !obj.levelUpLeftMode;
        case 'up': return obj.enableLevelUp;
        case 'skill': return obj.enableSkill;
        case 'key': return obj.enableKeys;
        case 'pzf': return obj.enablePZF;
        case 'debuff': return obj.enableDebuff;
        default: return true;
    }
}

////// 注册一个resize函数 //////
// name为名称，可供注销使用
// func可以是一个函数，或者是插件中的函数名；可以接受obj参数，详见resize函数。
control.prototype.registerResize = function (name, func) {
    this.unregisterResize(name);
    this.resizes.push({ name: name, func: func });
}

////// 注销一个resize函数 //////
control.prototype.unregisterResize = function (name) {
    this.resizes = this.resizes.filter(function (b) { return b.name != name; });
}

control.prototype._doResize = function (obj) {
    for (var i in this.resizes) {
        try {
            if (core.doFunc(this.resizes[i].func, this, obj)) return true;
        } catch (e) {
            main.log(e);
            main.log("ERROR in resizes["+this.resizes[i].name+"]：已自动注销该项。");
            this.unregisterResize(this.resizes[i].name);
        }
    }
    return false;
}

////// 屏幕分辨率改变后重新自适应 //////
control.prototype.resize = function() {
    if (main.mode=='editor')return;
    var clientWidth = main.dom.body.clientWidth, clientHeight = main.dom.body.clientHeight;
    var CANVAS_WIDTH = core.__PIXELS__ + 6, BAR_WIDTH = Math.round(core.__PIXELS__ * 0.31) + 3;

    if (clientWidth >= CANVAS_WIDTH + BAR_WIDTH || (clientWidth > clientHeight && clientHeight < CANVAS_WIDTH)) {
        // 横屏
        core.domStyle.isVertical = false;
        core.domStyle.scale = Math.min(1, clientHeight / CANVAS_WIDTH);
    }
    else {
        // 竖屏
        core.domStyle.isVertical = true;
        core.domStyle.scale = Math.min(1, clientWidth / CANVAS_WIDTH);
    }

    var statusDisplayArr = this._shouldDisplayStatus(), count = statusDisplayArr.length;
    var statusCanvas = core.flags.statusCanvas, statusCanvasRows = core.values.statusCanvasRowsOnMobile || 3;
    var col = statusCanvas ? statusCanvasRows : Math.ceil(count / 3);
    if (col > 4) {
        if (statusCanvas) alert("自绘状态栏的在竖屏下的行数应不超过4！");
        else alert("当前状态栏数目("+count+")大于12，请调整到不超过12以避免手机端出现显示问题。");
    }
    var globalAttribute = core.status.globalAttribute || core.initStatus.globalAttribute;

    var obj = {
        clientWidth: clientWidth,
        clientHeight: clientHeight,
        CANVAS_WIDTH: CANVAS_WIDTH,
        BAR_WIDTH: BAR_WIDTH,
        outerSize: CANVAS_WIDTH * core.domStyle.scale,
        globalAttribute: globalAttribute,
        border: '3px ' + globalAttribute.borderColor + ' solid',
        statusDisplayArr: statusDisplayArr,
        count: count,
        col: col,
        statusBarHeightInVertical: core.domStyle.isVertical ? (32 * col + 6) * core.domStyle.scale + 6 : 0,
        toolbarHeightInVertical: core.domStyle.isVertical ? 44 * core.domStyle.scale + 6 : 0,
        is15x15: core.__SIZE__ == 15
    };

    this._doResize(obj);
    this.setToolbarButton();
    core.updateStatusBar();
}

control.prototype._resize_gameGroup = function (obj) {
    var gameGroup = core.dom.gameGroup;
    var totalWidth, totalHeight;
    if (core.domStyle.isVertical) {
        totalWidth = obj.outerSize;
        totalHeight = obj.outerSize + obj.statusBarHeightInVertical + obj.toolbarHeightInVertical
    }
    else {
        totalWidth = (obj.CANVAS_WIDTH + obj.BAR_WIDTH) * core.domStyle.scale;
        totalHeight = obj.outerSize;
    }
    gameGroup.style.width = totalWidth + "px";
    gameGroup.style.height = totalHeight + "px";
    gameGroup.style.left = (obj.clientWidth - totalWidth) / 2 + "px";
    gameGroup.style.top = (obj.clientHeight - totalHeight) / 2 + "px";
    // floorMsgGroup
    var floorMsgGroup = core.dom.floorMsgGroup;
    floorMsgGroup.style.width = obj.outerSize - 6 + "px";
    floorMsgGroup.style.height = totalHeight - 6 + "px";
    floorMsgGroup.style.background = obj.globalAttribute.floorChangingBackground;
    floorMsgGroup.style.color = obj.globalAttribute.floorChangingTextColor;
    // musicBtn
    if (core.domStyle.isVertical || core.domStyle.scale < 1) {
        core.dom.musicBtn.style.right = core.dom.musicBtn.style.bottom = "3px";
    }
    else {
        core.dom.musicBtn.style.right = (obj.clientWidth - totalWidth) / 2 + "px";
        core.dom.musicBtn.style.bottom = (obj.clientHeight - totalHeight) / 2 - 27 + "px";
    }
}

control.prototype._resize_canvas = function (obj) {
    var innerSize = (obj.outerSize - 6) + "px";
    for (var i = 0; i < core.dom.gameCanvas.length; ++i)
        core.dom.gameCanvas[i].style.width = core.dom.gameCanvas[i].style.height = innerSize;
    core.dom.gif.style.width = core.dom.gif.style.height = innerSize;
    core.dom.gif2.style.width = core.dom.gif2.style.height = innerSize;
    core.dom.gameDraw.style.width = core.dom.gameDraw.style.height = innerSize;
    core.dom.gameDraw.style.top = obj.statusBarHeightInVertical + "px";
    core.dom.gameDraw.style.right = 0;
    core.dom.gameDraw.style.border = obj.border;
    // resize bigmap
    core.bigmap.canvas.forEach(function(cn){
        core.canvas[cn].canvas.style.width = core.bigmap.width * 32 * core.domStyle.scale + "px";
        core.canvas[cn].canvas.style.height = core.bigmap.height * 32 * core.domStyle.scale + "px";
    });
    // resize dynamic canvas
    for (var name in core.dymCanvas) {
        var ctx = core.dymCanvas[name], canvas = ctx.canvas;
        canvas.style.width = canvas.width * core.domStyle.scale + "px";
        canvas.style.height = canvas.height * core.domStyle.scale + "px";
        canvas.style.left = parseFloat(canvas.getAttribute("_left")) * core.domStyle.scale + "px";
        canvas.style.top = parseFloat(canvas.getAttribute("_top")) * core.domStyle.scale + "px";
    }
    // resize next
    main.dom.next.style.width = main.dom.next.style.height = 5 * core.domStyle.scale + "px";
    main.dom.next.style.borderBottomWidth = main.dom.next.style.borderRightWidth = 4 * core.domStyle.scale + "px";


}

control.prototype._resize_statusBar = function (obj) {
    // statusBar
    var statusBar = core.dom.statusBar;
    if (core.domStyle.isVertical) {
        statusBar.style.width = obj.outerSize + "px";
        statusBar.style.height = obj.statusBarHeightInVertical + "px";
        statusBar.style.background = obj.globalAttribute.statusTopBackground;
        statusBar.style.fontSize = 16 * core.domStyle.scale + "px";
    }
    else {
        statusBar.style.width = obj.BAR_WIDTH * core.domStyle.scale + "px";
        statusBar.style.height = obj.outerSize + "px";
        statusBar.style.background = obj.globalAttribute.statusLeftBackground;
        // --- 计算文字大小
        statusBar.style.fontSize = 16 * Math.min(1, (core.__HALF_SIZE__ + 3) / obj.count) * core.domStyle.scale + "px";
    }
    statusBar.style.display = 'block';
    statusBar.style.borderTop = statusBar.style.borderLeft = obj.border;
    statusBar.style.borderRight = core.domStyle.isVertical ? obj.border : '';
    statusBar.style.borderBottom = core.domStyle.isVertical ? '' : obj.border;
    // 自绘状态栏
    if (core.domStyle.isVertical) {
        core.dom.statusCanvas.style.width = obj.outerSize - 6 + "px";
        core.dom.statusCanvas.width = core.__PIXELS__;
        core.dom.statusCanvas.style.height = obj.statusBarHeightInVertical - 3 + "px";
        core.dom.statusCanvas.height = obj.col * 32 + 9;
    }
    else {
        core.dom.statusCanvas.style.width = obj.BAR_WIDTH * core.domStyle.scale - 3 + "px";
        core.dom.statusCanvas.width = obj.BAR_WIDTH - 3;
        core.dom.statusCanvas.style.height = obj.outerSize - 6 + "px";
        core.dom.statusCanvas.height = core.__PIXELS__;
    }
    core.dom.statusCanvas.style.display = core.flags.statusCanvas ? "block" : "none";
}

control.prototype._resize_status = function (obj) {
    var statusHeight = (core.domStyle.isVertical ? 1 : (core.__HALF_SIZE__ + 3) / obj.count) *  32 * core.domStyle.scale * 0.8;
    // status
    for (var i = 0; i < core.dom.status.length; ++i) {
        var id = core.dom.status[i].id, style = core.dom.status[i].style;
        if (id.endsWith("Col")) id = id.substring(0, id.length-3);
        style.display = core.flags.statusCanvas || obj.statusDisplayArr.indexOf(id) < 0 ? 'none': 'block';
        style.margin = 3 * core.domStyle.scale + "px";
        style.height = statusHeight + "px";
        style.maxWidth = obj.BAR_WIDTH * core.domStyle.scale * (core.domStyle.isVertical ? 0.95 : 1) + "px";
        if (obj.is15x15 && !core.domStyle.isVertical)
            style.marginLeft = 11 * core.domStyle.scale + "px";
    }
    // statusLabels, statusTexts
    for (var i = 0; i < core.dom.statusLabels.length; ++i) {
        core.dom.statusLabels[i].style.lineHeight = statusHeight + "px";
        core.dom.statusLabels[i].style.marginLeft = 6 * core.domStyle.scale + "px";
    }
    for (var i = 0; i < core.dom.statusTexts.length; ++i) {
        core.dom.statusTexts[i].style.color = obj.globalAttribute.statusBarColor;
    }
    // keys
    if (core.flags.statusBarItems.indexOf('enableGreenKey')>=0) {
        core.dom.keyCol.style.fontSize = '0.75em';
        core.statusBar.greenKey.style.display = '';
    } else {
        core.dom.keyCol.style.fontSize = '';
        core.statusBar.greenKey.style.display = 'none';
    }
}

control.prototype._resize_toolBar = function (obj) {
    // toolBar
    var toolBar = core.dom.toolBar;
    if (core.domStyle.isVertical) {
        toolBar.style.width = obj.outerSize + "px";
        toolBar.style.top = obj.statusBarHeightInVertical + obj.outerSize + "px";
        toolBar.style.height = obj.toolbarHeightInVertical + "px";
        toolBar.style.background = obj.globalAttribute.toolsBackground;
    }
    else {
        toolBar.style.width = obj.BAR_WIDTH * core.domStyle.scale + "px";
        toolBar.style.top = 0.718 * obj.outerSize + "px";
        toolBar.style.height = 0.281 * obj.outerSize + "px";
        toolBar.style.background = 'transparent';
    }
    toolBar.style.display = 'block';
    toolBar.style.borderLeft = obj.border;
    toolBar.style.borderRight = toolBar.style.borderBottom = core.domStyle.isVertical ? obj.border : '';
    toolBar.style.fontSize = 16 * core.domStyle.scale + "px";
}

control.prototype._resize_tools = function (obj) {
    var toolsHeight = 32 * core.domStyle.scale * (core.domStyle.isVertical && !obj.is15x15 ? 0.95 : 1);
    var toolsMarginLeft;
    if (core.domStyle.isVertical)
        toolsMarginLeft = (core.__HALF_SIZE__ - 3) * 3 * core.domStyle.scale;
    else
        toolsMarginLeft = (obj.BAR_WIDTH * core.domStyle.scale - 9 - toolsHeight * 3) / 4;
    for (var i = 0; i < core.dom.tools.length; ++i) {
        var style = core.dom.tools[i].style;
        style.height = toolsHeight + "px";
        style.marginLeft = toolsMarginLeft + "px";
        style.marginTop = 6 * core.domStyle.scale + "px"
    }
    core.dom.hard.style.lineHeight = toolsHeight + "px";
    core.dom.hard.style.color = obj.globalAttribute.hardLabelColor;
    if (core.domStyle.isVertical) {
        core.dom.hard.style.width = obj.outerSize - 9 * toolsMarginLeft - 8.5 * toolsHeight - 12 + "px";
    }
    else {
        core.dom.hard.style.width = obj.BAR_WIDTH * core.domStyle.scale - 9 - 2 * toolsMarginLeft + "px";
        if (!obj.is15x15) core.dom.hard.style.marginTop = 0;
    }
}
