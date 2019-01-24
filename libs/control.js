/*
control.js：游戏主要逻辑控制
主要负责status相关内容，以及各种变量获取/存储
寻路算法和人物行走也在此文件内
 */

"use strict";

function control() {
    this.init();
}

control.prototype.init = function () {
    this.controldata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.control;
}

////// 设置requestAnimationFrame //////
control.prototype.setRequestAnimationFrame = function () {

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

    core.animateFrame.totalTime = Math.max(core.animateFrame.totalTime, core.getLocalStorage('totalTime', 0));

    var draw = function(timestamp) {

        core.animateFrame.totalTime += timestamp - core.animateFrame.totalTimeStart;
        core.animateFrame.totalTimeStart = timestamp;

        // move time
        if (core.isPlaying() && core.isset(core.status) && core.isset(core.status.hero)
            && core.isset(core.status.hero.statistics)) {
            core.status.hero.statistics.totalTime = core.animateFrame.totalTime;
            core.status.hero.statistics.currTime += timestamp-(core.status.hero.statistics.start||timestamp);
            core.status.hero.statistics.start=timestamp;
        }

        // Global Animate
        if (timestamp - core.animateFrame.globalTime > core.values.animateSpeed && core.isPlaying()) {
            
            core.status.globalAnimateStatus++;

            if (core.animateFrame.globalAnimate && core.isset(core.status.floorId)) {
                // Global Animate
                core.status.globalAnimateObjs.forEach(function (block) {
                    core.drawBlock(block, core.status.globalAnimateStatus % (block.event.animate||1));
                });

                // Global Autotile Animate
                core.status.autotileAnimateObjs.blocks.forEach(function (block) {
                    var cv = core.isset(block.name)?core.canvas[block.name]:core.canvas.event;
                    cv.clearRect(block.x * 32, block.y * 32, 32, 32);
                    if (core.isset(block.name)) {
                        if (block.name == 'bg') {
                            core.drawImage('bg', core.material.groundCanvas.canvas, block.x * 32, block.y * 32);
                        }
                        core.drawAutotile(cv, core.status.autotileAnimateObjs[block.name+"map"], block, 32, 0, 0, core.status.globalAnimateStatus);
                    }
                    else {
                        core.drawAutotile(cv, core.status.autotileAnimateObjs.map, block, 32, 0, 0, core.status.globalAnimateStatus);
                    }
                });
            }

            // Box animate
            core.drawBoxAnimate();
            core.animateFrame.globalTime = timestamp;
        }

        // AutosaveTime
        if (timestamp - core.saves.autosave.time > 5000 && core.isPlaying()) {
            core.control.checkAutosave();
            core.saves.autosave.time = timestamp;
        }

        // selectorTime
        if (timestamp-core.animateFrame.selectorTime>20 && core.isset(core.dymCanvas.selector)) {
            var opacity = parseFloat(core.dymCanvas.selector.canvas.style.opacity);
            if (core.animateFrame.selectorUp)
                opacity += 0.02;
            else
                opacity -= 0.02;
            if (opacity > 0.95 || opacity < 0.55)
                core.animateFrame.selectorUp = !core.animateFrame.selectorUp;
            core.setOpacity("selector", opacity);
            core.animateFrame.selectorTime = timestamp;
        }

        // Animate
        if (timestamp-core.animateFrame.animateTime>50 && core.isset(core.status.animateObjs) && core.status.animateObjs.length>0) {
            core.clearMap('animate');
            // 更新帧
            var animateObjs = [];
            for (var i=0;i<core.status.animateObjs.length;i++) {
                var obj = core.status.animateObjs[i];
                if (obj.index == obj.animate.frames.length) {
                    // 绘制完毕
                    delete core.animateFrame.asyncId[obj.id];
                    // 异步执行回调...
                    (function(callback) {
                        setTimeout(function() {
                            if (core.isset(callback))
                                callback();
                        });
                    })(obj.callback);
                }
                else {
                    core.maps.drawAnimateFrame(obj.animate, obj.centerX, obj.centerY, obj.index++);
                    animateObjs.push(obj);
                }
            }
            core.status.animateObjs = animateObjs;
            core.animateFrame.animateTime = timestamp;
        }

        // Hero move
        if (core.isPlaying() && core.status.heroMoving>0) {
            var x=core.getHeroLoc('x'), y=core.getHeroLoc('y'), direction = core.getHeroLoc('direction');

            // 200ms换腿？
            if (timestamp - core.animateFrame.moveTime > (core.values.moveSpeed||100)) {
                core.animateFrame.leftLeg = !core.animateFrame.leftLeg;
                core.animateFrame.moveTime = timestamp;
            }
            core.drawHero(direction, x, y, core.animateFrame.leftLeg?'leftFoot':'rightFoot', 4*core.status.heroMoving);
            /*
            if (core.status.heroMoving<=4) {
                core.drawHero(direction, x, y, 'leftFoot', 4*core.status.heroMoving);
            }
            else if (core.status.heroMoving<=8) {
                core.drawHero(direction, x, y, 'rightFoot', 4*core.status.heroMoving);
            }
            */
        }

        // weather
        if (core.isPlaying() && timestamp-core.animateFrame.weather.time>30 && core.isset(core.dymCanvas.weather)) {
            var ctx = core.dymCanvas.weather;

            var ox = core.bigmap.offsetX, oy = core.bigmap.offsetY;

            if (core.animateFrame.weather.type == 'rain' && core.animateFrame.weather.level > 0) {
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
                    if (p.x > core.bigmap.width*32 || p.y > core.bigmap.height*32) {
                        p.x = Math.random() * core.bigmap.width*32;
                        p.y = -10;
                    }

                })

                ctx.fill();

            }
            else if (core.animateFrame.weather.type == 'snow' && core.animateFrame.weather.level > 0) {

                core.clearMap('weather');
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();

                if (!core.isset(core.animateFrame.weather.data))
                    core.animateFrame.weather.data = 0;
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
                            if (Math.sin(angle) > 0) {
                                p.x = -5;
                                p.y = Math.random() * core.bigmap.height*32;
                            }
                            else {
                                p.x = core.bigmap.width*32 + 5;
                                p.y = Math.random() * core.bigmap.height*32;
                            }
                        }
                    }

                })

                ctx.fill();

            }
            else if (core.animateFrame.weather.type == 'fog' && core.animateFrame.weather.level > 0) {
                core.clearMap('weather');
                if (core.animateFrame.weather.fog) {
                    var w = 416, h = 416;
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
                    })
                    core.setAlpha('weather',1);
                }

            }
            core.animateFrame.weather.time = timestamp;

        }

        // 执行用户的并行事件处理内容
        functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.plugins.parallelDo(timestamp);

        if (core.isPlaying()) {
            // 执行插件中的每帧函数
            var renderFrameFuncs = core.plugin.__renderFrameFuncs || [];
            renderFrameFuncs.forEach(function (t) {
                try {
                    if (t instanceof Function) {
                        t(timestamp);
                    }
                    else if (typeof t == 'string') {
                        if (core.plugin[t])
                            core.plugin[t](timestamp);
                    }
                }
                catch (e) {
                    main.log(e);
                }
            });
        }

        // 检查控制台状态
        if (core.utils.consoleOpened()) {
            core.setFlag('consoleOpened', true);
        }

        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}

////// 显示游戏开始界面 //////
control.prototype.showStartAnimate = function (noAnimate, callback) {
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
    core.deleteAllCanvas();

    core.dom.musicBtn.style.display = 'block';

    // 重置音量
    core.events.setVolume(1, 0);

    if (core.flags.startUsingCanvas) {
        core.dom.startTop.style.display = 'none';
        core.dom.startButtonGroup.style.display = 'block';
        core.events.startGame('');
        if (core.isset(callback)) callback();
        return;
    }

    if(noAnimate) {
        core.dom.startTop.style.display = 'none';
        // core.playGame();
        core.dom.startButtonGroup.style.display = 'block';
        if (core.isset(callback)) callback();
    }
    else {
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

}

////// 隐藏游戏开始界面 //////
control.prototype.hideStartAnimate = function (callback) {
    var opacityVal = 1;
    var startAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        if (opacityVal < 0) {
            clearInterval(startAnimate);
            core.dom.startPanel.style.display = 'none';
            if (core.isset(callback)) callback();
        }
        core.dom.startPanel.style.opacity = opacityVal;
    }, 20);
}

////// 游戏是否已经开始 //////
control.prototype.isPlaying = function() {
    return core.isset(core.status.played) && core.status.played;
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
    core.events.setHeroIcon('hero.png', true);
}

////// 重置游戏状态和初始数据 //////
control.prototype.resetStatus = function(hero, hard, floorId, route, maps, values) {

    var totalTime = core.animateFrame.totalTime;

    // 清除游戏数据
    core.clearStatus();

    // 初始化status
    core.status = core.clone(core.initStatus);
    core.status.played = true;
    // 初始化maps
    core.status.floorId = floorId;
    core.status.maps = core.clone(maps);
    // 初始化怪物
    core.material.enemys = core.clone(core.enemys.getEnemys());
    core.material.items = core.clone(core.items.getItems());
    // 初始化人物属性
    core.status.hero = core.clone(hero);
    // 初始化人物图标
    core.events.setHeroIcon(core.getFlag('heroIcon', 'hero.png'), true);
    // 统计数据
    if (!core.isset(core.status.hero.statistics))
        core.status.hero.statistics = {
            'totalTime': totalTime,
            'currTime': 0,
            'hp': 0,
            "battle": 0,
            'money': 0,
            'experience': 0,
            'battleDamage': 0,
            'poisonDamage': 0,
            'extraDamage': 0,
            'moveDirectly': 0,
            'ignoreSteps': 0,
        }
    core.status.hero.statistics.totalTime = core.animateFrame.totalTime =
        Math.max(core.status.hero.statistics.totalTime, core.animateFrame.totalTime);
    core.status.hero.statistics.start = null;

    core.status.hard = hard;
    // 初始化路线
    if (core.isset(route))
        core.status.route = route;

    if (core.isset(values))
        core.values = core.clone(values);
    else core.values = core.clone(core.data.values);

    core.flags = core.clone(core.data.flags);
    var systemFlags = core.getFlag("globalFlags", {});
    for (var key in systemFlags)
        core.flags[key] = systemFlags[key];

    core.events.initGame();
    core.resize();
    this.updateGlobalAttribute(Object.keys(core.status.globalAttribute));
    this.triggerStatusBar(core.getFlag('hideStatusBar', false)?'hide':'show', core.getFlag("showToolbox"));
    core.dom.musicBtn.style.display = 'none';
}

////// 重新开始游戏；此函数将回到标题页面 //////
control.prototype.restart = function(noAnimate) {
    this.showStartAnimate(noAnimate);
    core.playBgm(main.startBgm);
}


/////////////////////// 寻路算法 & 人物行走控制 ///////////////////////

////// 清除自动寻路路线 //////
control.prototype.clearAutomaticRouteNode = function (x, y) {
    if (core.status.event.id==null)
        core.clearMap('route', x * 32 + 5 - core.status.automaticRoute.offsetX, y * 32 + 5 - core.status.automaticRoute.offsetY, 27, 27);
}

////// 停止自动寻路操作 //////
control.prototype.stopAutomaticRoute = function () {
    if (!core.status.played) {
        return;
    }
    core.status.automaticRoute.autoHeroMove = false;
    core.status.automaticRoute.autoStep = 0;
    core.status.automaticRoute.destStep = 0;
    core.status.automaticRoute.movedStep = 0;
    core.status.automaticRoute.autoStepRoutes = [];
    core.status.automaticRoute.destX=null;
    core.status.automaticRoute.destY=null;
    core.status.automaticRoute.lastDirection = null;
    core.stopHero();
    if (core.status.automaticRoute.moveStepBeforeStop.length==0)
        core.deleteCanvas('route');
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
control.prototype.clearContinueAutomaticRoute = function () {
    core.deleteCanvas('route');
    core.status.automaticRoute.moveStepBeforeStop=[];
}

////// 瞬间移动 //////
control.prototype.moveDirectly = function (destX, destY) {
    var ignoreSteps = core.canMoveDirectly(destX, destY);
    if (ignoreSteps>=0) {
        core.clearMap('hero');
        var lastDirection = core.status.route[core.status.route.length-1];
        if (['left', 'right', 'up', 'down'].indexOf(lastDirection)>=0)
            core.setHeroLoc('direction', lastDirection);
        core.setHeroLoc('x', destX);
        core.setHeroLoc('y', destY);
        core.drawHero();
        core.status.route.push("move:"+destX+":"+destY);
        core.status.hero.statistics.moveDirectly++;
        core.status.hero.statistics.ignoreSteps+=ignoreSteps;
        return true;
    }
    return false;
}

////// 尝试瞬间移动 //////
control.prototype.tryMoveDirectly = function (destX, destY) {
    if (Math.abs(core.getHeroLoc('x')-destX)+Math.abs(core.getHeroLoc('y')-destY)<=1)
        return false;
    var testMove = function (dx, dy, dir) {
        if (dx<0 || dx>=core.bigmap.width|| dy<0 || dy>=core.bigmap.height) return false;
        if (core.isset(dir) && !core.canMoveHero(dx,dy,dir)) return false;
        if (core.control.moveDirectly(dx, dy)) {
            if (core.isset(dir)) core.moveHero(dir, function() {});
            return true;
        }
        return false;
    }
    return testMove(destX,destY) || testMove(destX-1, destY, "right") || testMove(destX,destY-1,"down")
        || testMove(destX,destY+1,"up") || testMove(destX+1,destY,"left");
}

////// 设置自动寻路路线 //////
control.prototype.setAutomaticRoute = function (destX, destY, stepPostfix) {
    if (!core.status.played || core.status.lockControl) {
        return;
    }
    // 正在寻路中
    if (core.status.automaticRoute.autoHeroMove) {
        var lastX = core.status.automaticRoute.destX, lastY=core.status.automaticRoute.destY;
        core.stopAutomaticRoute();
        if (lastX==destX && lastY==destY) {
            core.status.automaticRoute.moveDirectly = true;
            setTimeout(function () {
                if (core.status.automaticRoute.moveDirectly && core.status.heroMoving==0) {
                    core.control.tryMoveDirectly(destX, destY);
                }
                core.status.automaticRoute.moveDirectly = false;
            }, core.values.moveSpeed || 100);
        }
        return;
    }
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
        return;
    }

    if (core.timeout.turnHeroTimeout!=null) return;

    // 单击瞬间移动
    if (core.status.heroStop && core.status.heroMoving==0) {
        if (stepPostfix.length<=1 && core.getFlag('clickMove', true) && core.control.tryMoveDirectly(destX, destY))
            return;
    }

    var moveStep = core.automaticRoute(destX, destY).concat(stepPostfix);
    if (moveStep.length == 0) {
        core.deleteCanvas('route');
        return;
    }

    core.status.automaticRoute.destX=destX;
    core.status.automaticRoute.destY=destY;

    // 计算绘制区域的宽高
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

    // 立刻移动
    core.setAutoHeroMove();
}

////// 自动寻路算法，找寻最优路径 //////
control.prototype.automaticRoute = function (destX, destY) {
    var fw = core.bigmap.width, fh = core.bigmap.height;
    var startX = core.getHeroLoc('x');
    var startY = core.getHeroLoc('y');
    if (destX == startX && destY == startY) return [];

    var route = [];
    var queue = new PriorityQueue({comparator: function (a,b) {
        return a.depth - b.depth;
    }});
    var ans = [];

    route[startX + fw * startY] = '';
    queue.queue({depth: 0, x: startX, y: startY});
    while (queue.length!=0) {
        var curr = queue.dequeue();
        var deep = curr.depth, nowX = curr.x, nowY = curr.y;

        for (var direction in core.utils.scan) {
            if (!core.canMoveHero(nowX, nowY, direction))
                continue;

            var nx = nowX + core.utils.scan[direction].x;
            var ny = nowY + core.utils.scan[direction].y;
            if (nx<0 || nx>=fw || ny<0 || ny>=fh) continue;

            var nid = nx + fw * ny;

            if (core.isset(route[nid])) continue;

            var deepAdd=1;
            var nextId, nextBlock = core.getBlock(nx,ny);
            if (nextBlock!=null){
                nextId = nextBlock.block.event.id;
                // 绕过亮灯（因为只有一次通行机会很宝贵）
                if(nextId == "light") deepAdd=100;
                // 绕过路障
                // if (nextId.substring(nextId.length-3)=="Net") deepAdd=core.values.lavaDamage*10;
                // 绕过血瓶
                if (!core.flags.potionWhileRouting && nextId.substring(nextId.length-6)=="Potion") deepAdd+=20;
                // 绕过传送点
                if  (nextBlock.block.event.trigger == 'changeFloor') deepAdd+=10;
            }
            deepAdd+=core.status.checkBlock.damage[nid]*10;

            if (nx == destX && ny == destY) {
                route[nid] = direction;
                break;
            }
            if (core.noPassExists(nx, ny))
                continue;

            route[nid] = direction;
            queue.queue({depth: deep+deepAdd, x: nx, y: ny});
        }
        if (core.isset(route[destX + fw * destY])) break;
    }
    if (!core.isset(route[destX + fw * destY])) {
        return [];
    }

    var nowX = destX, nowY = destY;
    while (nowX != startX || nowY != startY) {
        var dir = route[nowX + fw * nowY];
        ans.push({'direction': dir, 'x': nowX, 'y': nowY});
        nowX -= core.utils.scan[dir].x;
        nowY -= core.utils.scan[dir].y;
    }

    ans.reverse();
    return ans;
}

////// 显示离散的寻路点 //////
control.prototype.fillPosWithPoint = function (pos) {
    core.fillRect('ui', pos.x*32+12,pos.y*32+12,8,8, '#bfbfbf');
}

////// 设置勇士的自动行走路线 //////
control.prototype.setAutoHeroMove = function (steps) {
    steps=steps||core.status.automaticRoute.autoStepRoutes;
    if (steps.length == 0) {
        return;
    }
    core.status.automaticRoute.autoStepRoutes=steps;
    core.status.automaticRoute.autoHeroMove = true;
    core.status.automaticRoute.autoStep = 1;
    core.status.automaticRoute.destStep = steps[0].step;
    core.moveHero(steps[0].direction);
}

////// 设置行走的效果动画 //////
control.prototype.setHeroMoveInterval = function (direction, x, y, callback) {
    if (core.status.heroMoving>0) {
        return;
    }
    core.status.heroMoving=1;

    var toAdd = 1;
    if (core.status.replay.speed>3)
        toAdd = 2;
    if (core.status.replay.speed>6)
        toAdd = 4;
    if (core.status.replay.speed>12)
        toAdd = 8;

    core.interval.heroMoveInterval = window.setInterval(function () {
        core.status.heroMoving+=toAdd;
        if (core.status.heroMoving>=8) {
            core.setHeroLoc('x', x+core.utils.scan[direction].x, true);
            core.setHeroLoc('y', y+core.utils.scan[direction].y, true);
            core.control.updateFollowers();
            core.moveOneStep();
            core.clearMap('hero');
            core.drawHero(direction);
            clearInterval(core.interval.heroMoveInterval);
            core.status.heroMoving = 0;
            if (core.isset(callback)) callback();
        }
    }, (core.values.moveSpeed||100) / 8 * toAdd / core.status.replay.speed);
}

////// 实际每一步的行走过程 //////
control.prototype.moveAction = function (callback) {
    if (core.status.heroMoving>0) return;
    var direction = core.getHeroLoc('direction');
    var x = core.getHeroLoc('x');
    var y = core.getHeroLoc('y');
    var noPass = core.noPass(x + core.utils.scan[direction].x, y + core.utils.scan[direction].y), canMove = core.canMoveHero();
    if (noPass || !canMove) {
        if (core.status.event.id!='ski')
            core.status.route.push(direction);
        core.status.automaticRoute.moveStepBeforeStop = [];
        core.status.automaticRoute.lastDirection = core.getHeroLoc('direction');
        if (canMove) // 非箭头：触发
            core.trigger(x + core.utils.scan[direction].x, y + core.utils.scan[direction].y);
        core.drawHero(direction, x, y);

        if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
            core.clearContinueAutomaticRoute();
            core.stopAutomaticRoute();
        }
        if (core.isset(callback))
            callback();
    }
    else {
        core.setHeroMoveInterval(direction, x, y, function () {
            if (core.status.automaticRoute.autoHeroMove) {
                core.status.automaticRoute.movedStep++;
                core.status.automaticRoute.lastDirection = core.getHeroLoc('direction');
                if (core.status.automaticRoute.destStep == core.status.automaticRoute.movedStep) {
                    if (core.status.automaticRoute.autoStep == core.status.automaticRoute.autoStepRoutes.length) {
                        core.clearContinueAutomaticRoute();
                        core.stopAutomaticRoute();
                    }
                    else {
                        core.status.automaticRoute.movedStep = 0;
                        core.status.automaticRoute.destStep = core.status.automaticRoute.autoStepRoutes[core.status.automaticRoute.autoStep].step;
                        core.setHeroLoc('direction', core.status.automaticRoute.autoStepRoutes[core.status.automaticRoute.autoStep].direction);
                        core.status.automaticRoute.autoStep++;
                    }
                }
            }
            else if (core.status.heroStop) {
                core.drawHero();
            }
            if (core.status.event.id!='ski')
                core.status.route.push(direction);

            // 检查是不是无事件的道具
            var nowx = core.getHeroLoc('x'), nowy = core.getHeroLoc('y');
            var block = core.getBlock(nowx,nowy);
            var hasTrigger = false;
            if (block!=null && block.block.event.trigger=='getItem' &&
                !core.isset(core.floors[core.status.floorId].afterGetItem[nowx+","+nowy])) {
                hasTrigger = true;
                core.trigger(nowx, nowy);
            }
            core.checkBlock();
            if (!hasTrigger && !core.status.gameOver)
                core.trigger(nowx, nowy);
            if (core.isset(callback)) callback();
        });
    }
}

////// 转向 //////
control.prototype.turnHero = function(direction) {
    if (core.isset(direction)) {
        core.setHeroLoc('direction', direction);
        core.drawHero();
        core.status.route.push("turn:"+direction);
        return;
    }
    if (core.status.hero.loc.direction == 'up') core.status.hero.loc.direction = 'right';
    else if (core.status.hero.loc.direction == 'right') core.status.hero.loc.direction = 'down';
    else if (core.status.hero.loc.direction == 'down') core.status.hero.loc.direction = 'left';
    else if (core.status.hero.loc.direction == 'left') core.status.hero.loc.direction = 'up';
    core.drawHero();
    core.status.route.push("turn");
}

////// 让勇士开始移动 //////
control.prototype.moveHero = function (direction, callback) {
    // 如果正在移动，直接return
    if (core.status.heroMoving!=0) return;
    if (core.isset(direction))
        core.setHeroLoc('direction', direction);
    if (!core.isset(callback)) { // 如果不存在回调函数，则使用heroMoveTrigger
        core.status.heroStop = false;
        core.status.automaticRoute.moveDirectly = false;

        var doAction = function () {
            if (!core.status.heroStop) {
                if (core.hasFlag('debug') && core.status.ctrlDown) {
                    if (core.status.heroMoving!=0) return;
                    // 检测是否穿出去
                    direction = core.getHeroLoc('direction');
                    var nx = core.getHeroLoc('x') + core.utils.scan[direction].x, ny=core.getHeroLoc('y') + core.utils.scan[direction].y;
                    if (nx<0 || nx>=core.bigmap.width || ny<0 || ny>=core.bigmap.height) return;

                    core.status.heroMoving=-1;
                    core.eventMoveHero([direction], 100, function () {
                        core.status.heroMoving=0;
                        doAction();
                    });
                }
                else {
                    core.moveAction();
                    setTimeout(doAction, 50);
                }
            }
            else {
                core.stopHero();
            }
        }
        doAction();
    }
    else { // 否则，只向某个方向移动一步，然后调用callback
        core.moveAction(function () {
            callback();
        })
    }
}

/////// 使用事件让勇士移动。这个函数将不会触发任何事件 //////
control.prototype.eventMoveHero = function(steps, time, callback) {
    time = time || core.values.moveSpeed || 100;

    // 要运行的轨迹：将steps展开
    var moveSteps=[];
    steps.forEach(function (e) {
        if (typeof e=="string") {
            moveSteps.push(e);
        }
        else {
            if (!core.isset(e.value)) {
                moveSteps.push(e.direction)
            }
            else {
                for (var i=0;i<e.value;i++) {
                    moveSteps.push(e.direction);
                }
            }
        }
    });

    var step=0;

    var animate=window.setInterval(function() {
        var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
        if (moveSteps.length==0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            core.drawHero(null, x, y);
            if (core.isset(callback)) callback();
        }
        else {
            var direction = moveSteps[0];
            core.setHeroLoc('direction', direction);
            step++;
            if (step <= 4) {
                core.drawHero(direction, x, y, 'leftFoot', 4 * step);
            }
            else if (step <= 8) {
                core.drawHero(direction, x, y, 'rightFoot', 4 * step);
            }
            if (step == 8) {
                step = 0;
                core.setHeroLoc('x', x + core.utils.scan[direction].x, true);
                core.setHeroLoc('y', y + core.utils.scan[direction].y, true);
                core.control.updateFollowers();
                moveSteps.shift();
            }
        }
    }, time / 8 / core.status.replay.speed);

    core.animateFrame.asyncId[animate] = true;
}

////// 勇士跳跃事件 //////
control.prototype.jumpHero = function (ex, ey, time, callback) {
    var sx=core.status.hero.loc.x, sy=core.status.hero.loc.y;
    if (!core.isset(ex)) ex=sx;
    if (!core.isset(ey)) ey=sy;

    time = time || 500;

    core.playSound('jump.mp3');

    var dx = ex-sx, dy=ey-sy, distance = Math.round(Math.sqrt(dx * dx + dy * dy));
    var jump_peak = 6 + distance, jump_count = jump_peak * 2;
    var currx = sx, curry = sy;

    var heroIcon = core.material.icons.hero[core.getHeroLoc('direction')];
    var status = 'stop';
    var height = core.material.icons.hero.height;

    var drawX = function() {
        return currx * 32;
    }
    var drawY = function() {
        var ret = curry * 32;
        if(jump_count >= jump_peak){
            var n = jump_count - jump_peak;
        }else{
            var n = jump_peak - jump_count;
        }
        return ret - (jump_peak * jump_peak - n * n) / 2;
    }
    var updateJump = function() {
        jump_count--;
        currx = (currx * jump_count + ex) / (jump_count + 1.0);
        curry = (curry * jump_count + ey) / (jump_count + 1.0);
    }

    if (core.isset(core.status.hero.followers) && core.status.hero.followers.length>0)
        core.clearMap('hero');

    var animate=window.setInterval(function() {

        if (jump_count>0) {
            core.clearMap('hero', drawX()-core.bigmap.offsetX, drawY()-height+32-core.bigmap.offsetY, 32, height);
            updateJump();
            var nowx = drawX(), nowy = drawY();
            core.bigmap.offsetX = core.clamp(nowx - 32*6, 0, 32*core.bigmap.width-416);
            core.bigmap.offsetY = core.clamp(nowy - 32*6, 0, 32*core.bigmap.height-416);
            core.control.updateViewport();
            core.drawImage('hero', core.material.images.hero, heroIcon[status] * 32, heroIcon.loc * height, 32, height,
                nowx - core.bigmap.offsetX, nowy + 32-height - core.bigmap.offsetY, 32, height);
        }
        else {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            core.setHeroLoc('x', ex);
            core.setHeroLoc('y', ey);
            core.drawHero();
            if (core.isset(callback)) callback();
        }

    }, time / 16 / core.status.replay.speed);

    core.animateFrame.asyncId[animate] = true;
}

////// 每移动一格后执行的事件 //////
control.prototype.moveOneStep = function() {
    return this.controldata.moveOneStep();
}

////// 停止勇士的一切行动，等待勇士行动结束后，再执行callback //////
control.prototype.waitHeroToStop = function(callback) {
    var lastDirection = core.status.automaticRoute.lastDirection;
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    if (core.isset(callback)) {
        core.status.replay.animate=true;
        core.lockControl();
        core.status.automaticRoute.moveDirectly = false;
        setTimeout(function(){
            core.status.replay.animate=false;
            if (core.isset(lastDirection))
                core.setHeroLoc('direction', lastDirection);
            core.drawHero();
            callback();
        }, 30);
    }
}

////// 停止勇士的移动状态 //////
control.prototype.stopHero = function () {
    core.status.heroStop = true;
}

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
        c.style.transform='translate('+(x/416*96)+'vw,'+(y/416*96)+'vw)';
        c.style.webkitTransform='translate('+(x/416*96)+'vw,'+(y/416*96)+'vw)';
        c.style.OTransform='translate('+(x/416*96)+'vw,'+(y/416*96)+'vw)';
        c.style.MozTransform='translate('+(x/416*96)+'vw,'+(y/416*96)+'vw)';
    }
};

////// 更新视野范围 //////
control.prototype.updateViewport = function() {
    core.bigmap.canvas.forEach(function(cn){
        core.control.setGameCanvasTranslate(cn,-core.bigmap.offsetX,-core.bigmap.offsetY);
    });
    // ------ 路线
    core.relocateCanvas('route', core.status.automaticRoute.offsetX - core.bigmap.offsetX, core.status.automaticRoute.offsetY - core.bigmap.offsetY);
}

////// 绘制勇士 //////
control.prototype.drawHero = function (direction, x, y, status, offset) {

    if (!core.isPlaying()) return;

    if (!core.isset(x)) x = core.getHeroLoc('x');
    if (!core.isset(y)) y = core.getHeroLoc('y');
    status = status || 'stop';
    direction = direction || core.getHeroLoc('direction');
    offset = offset || 0;
    var way = core.utils.scan[direction];
    var offsetX = way.x*offset;
    var offsetY = way.y*offset;
    var dx=offsetX==0?0:offsetX/Math.abs(offsetX), dy=offsetY==0?0:offsetY/Math.abs(offsetY);

    core.bigmap.offsetX = core.clamp((x - 6) * 32 + offsetX, 0, 32*core.bigmap.width-416);
    core.bigmap.offsetY = core.clamp((y - 6) * 32 + offsetY, 0, 32*core.bigmap.height-416);

    core.clearAutomaticRouteNode(x+dx, y+dy);

    core.clearMap('hero', x * 32 - core.bigmap.offsetX - 32, y * 32 - core.bigmap.offsetY - 32, 96, 96);

    var heroIconArr = core.material.icons.hero;
    var drawObjs = [];
    // add hero
    drawObjs.push({
        "img": core.material.images.hero,
        "height": core.material.icons.hero.height,
        "heroIcon": heroIconArr[direction],
        "posx": x * 32 - core.bigmap.offsetX + offsetX,
        "posy": y * 32 - core.bigmap.offsetY + offsetY,
        "status": status,
        "index": 0,
    });
    
    // Add other followers
    if (core.isset(core.status.hero.followers)) {
        var index=1;
        core.status.hero.followers.forEach(function (t) {
            core.clearMap('hero', 32*t.x-core.bigmap.offsetX-32, 32*t.y-core.bigmap.offsetY-32, 96, 96);
            if (core.isset(core.material.images.images[t.img])) {
                drawObjs.push({
                    "img": core.material.images.images[t.img],
                    "height": core.material.images.images[t.img].height/4,
                    "heroIcon": heroIconArr[t.direction],
                    "posx": 32*t.x - core.bigmap.offsetX + (t.stop?0:core.utils.scan[t.direction].x*offset),
                    "posy": 32*t.y - core.bigmap.offsetY + (t.stop?0:core.utils.scan[t.direction].y*offset),
                    "status": t.stop?"stop":status,
                    "index": index++
                });
            }
        });
    }

    drawObjs.sort(function (a, b) {
        return a.posy==b.posy?b.index-a.index:a.posy-b.posy;
    });

    drawObjs.forEach(function (block) {
        core.drawImage('hero', block.img, block.heroIcon[block.status]*32,
            block.heroIcon.loc * block.height, 32, block.height,
            block.posx, block.posy+32-block.height, 32, block.height);
    });

    core.control.updateViewport();
}

////// 设置勇士的位置 //////
control.prototype.setHeroLoc = function (itemName, itemVal, noGather) {
    core.status.hero.loc[itemName] = itemVal;
    if ((itemName=='x' || itemName=='y') && !noGather) {
        this.gatherFollowers();
    }
}

////// 获得勇士的位置 //////
control.prototype.getHeroLoc = function (itemName) {
    if (!core.isset(itemName)) return core.status.hero.loc;
    return core.status.hero.loc[itemName];
}

////// 获得勇士面对位置的x坐标 //////
control.prototype.nextX = function(n) {
    return core.getHeroLoc('x')+core.utils.scan[core.getHeroLoc('direction')].x*(n||1);
}

////// 获得勇士面对位置的y坐标 //////
control.prototype.nextY = function (n) {
    return core.getHeroLoc('y')+core.utils.scan[core.getHeroLoc('direction')].y*(n||1);
}

////// 某个点是否在勇士旁边 //////
control.prototype.nearHero = function (x, y) {
    return Math.abs(x-core.getHeroLoc('x'))+Math.abs(y-core.getHeroLoc('y'))<=1;
}

////// 聚集跟随者 //////
control.prototype.gatherFollowers = function () {
    if (!core.isset(core.status.hero.followers) || core.status.hero.followers.length==0) return;
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
    if (!core.isset(core.status.hero.followers) || core.status.hero.followers.length==0) return;
    core.status.hero.followers.forEach(function (t) {
        if (!t.stop) {
            t.x += core.utils.scan[t.direction].x;
            t.y += core.utils.scan[t.direction].y;
        }
    })

    var nowx = core.getHeroLoc('x'), nowy = core.getHeroLoc('y');
    core.status.hero.followers.forEach(function (t) {
        if (t.x == nowx && t.y == nowy) {
            t.stop = true;
        }
        else {
            var dx = nowx-t.x, dy = nowy-t.y;
            if (dx==-1) {
                t.stop=false;
                t.direction='left';
            }
            else if (dx==1) {
                t.stop=false;
                t.direction='right';
            }
            else if (dy==-1) {
                t.stop=false;
                t.direction='up';
            }
            else if (dy==1) {
                t.stop=false;
                t.direction='down';
            }
        }
        nowx=t.x; nowy=t.y;
    })
}

////// 更新领域、夹击、阻击的伤害地图 //////
control.prototype.updateCheckBlock = function() {
    return this.controldata.updateCheckBlock();
}

////// 检查并执行领域、夹击、阻击事件 //////
control.prototype.checkBlock = function () {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
    var damage = core.status.checkBlock.damage[x+core.bigmap.width*y];
    if (damage>0) {
        core.status.hero.hp -= damage;

        // 检查阻击事件
        var snipe = [];
        if (!core.hasFlag("no_snipe")) {
            for (var direction in core.utils.scan) {
                var nx = x+core.utils.scan[direction].x, ny=y+core.utils.scan[direction].y;
                if (nx<0 || nx>=core.bigmap.width || ny<0 || ny>=core.bigmap.height) continue;
                var id=core.status.checkBlock.map[nx+core.bigmap.width*ny];
                if (core.isset(id)) {
                    var enemy = core.material.enemys[id];
                    if (core.isset(enemy) && core.enemys.hasSpecial(enemy.special, 18)) {
                        snipe.push({'direction': direction, 'x': nx, 'y': ny});
                    }
                }
            }
        }

        if (core.status.checkBlock.betweenAttack[x+core.bigmap.width*y] && damage>0) {
            core.drawTip('受到夹击，生命变成一半');
        }
        else if (core.status.checkBlock.map[x+core.bigmap.width*y]=='lavaNet') {
            core.drawTip('受到血网伤害'+damage+'点');
        }
        // 阻击
        else if (snipe.length>0 && damage>0) {
            core.drawTip('受到阻击伤害'+damage+'点');
        }
        else if (damage>0) {
            core.drawTip('受到领域或激光伤害'+damage+'点');
        }

        if (damage>0) {
            core.playSound('zone.mp3');
            core.drawAnimate("zone", x, y);

            // 禁用快捷商店
            if (core.flags.disableShopOnDamage) {
                for (var shopId in core.status.shops) {
                    core.status.shops[shopId].visited = false;
                }
            }

        }
        core.status.hero.statistics.extraDamage += damage;

        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose();
            return;
        }
        snipe = snipe.filter(function (t) {
            var x=t.x, y=t.y, direction = t.direction;
            var nx = x+core.utils.scan[direction].x, ny=y+core.utils.scan[direction].y;

            return nx>=0 && nx<core.bigmap.width && ny>=0 && ny<core.bigmap.height && core.getBlock(nx, ny)==null;
        });
        core.updateStatusBar();
        if (snipe.length>0)
            core.snipe(snipe);
    }
}

////// 阻击事件（动画效果） //////
control.prototype.snipe = function (snipes) {
    // 阻击改成moveBlock事件完成
    var actions = [];
    snipes.forEach(function (t) {
        actions.push({"type": "move", "loc": [t.x, t.y], "steps": [t.direction], "time": 500, "keep": true, "async": true});
    });
    actions.push({"type": "waitAsync"});
    core.insertAction(actions);
}

////// 更改天气效果 //////
control.prototype.setWeather = function (type, level) {

    // 非雨雪
    if (type!='rain' && type!='snow' && type!='fog') {
        // core.clearMap('weather');
        core.deleteCanvas('weather')
        core.animateFrame.weather.type = null;
        core.animateFrame.weather.level = 0;
        core.animateFrame.weather.nodes = [];
        return;
    }

    level = parseInt(level);

    // 当前天气：则忽略
    if (type==core.animateFrame.weather.type && !core.isset(level)) {
        return;
    }

    if (!core.isset(level)) level=5;
    if (level<1) level=1; if (level>10) level=10;
    level *= parseInt(20*core.bigmap.width*core.bigmap.height/169);
    // 计算当前的宽高

    core.createCanvas('weather', 0, 0, 416, 416, 80);
    core.animateFrame.weather.type = type;
    core.animateFrame.weather.level = level;
    core.animateFrame.weather.nodes = [];

    if (type == 'rain') {
        for (var a=0;a<level;a++) {
            core.animateFrame.weather.nodes.push({
                'x': Math.random()*core.bigmap.width*32,
                'y': Math.random()*core.bigmap.height*32,
                'l': Math.random() * 2.5,
                'xs': -4 + Math.random() * 4 + 2,
                'ys': Math.random() * 10 + 10
            })
        }
    }
    else if (type=='snow') {
        for (var a=0;a<level;a++) {
            core.animateFrame.weather.nodes.push({
                'x': Math.random()*core.bigmap.width*32,
                'y': Math.random()*core.bigmap.height*32,
                'r': Math.random() * 5 + 1,
                'd': Math.random() * Math.min(level, 200),
            })
        }
    }
    else if (type=='fog') {
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
    }
}

////// 更改画面色调 //////
control.prototype.setFg = function(color, time, callback) {
    if (!core.isset(time)) time=750;
    if (time<=0) time=0;

    if (!core.isset(core.status.curtainColor)) {
        core.status.curtainColor = [0,0,0,0];
    }

    var nowColor = core.status.curtainColor;

    if (!core.isset(color))
        color = [0,0,0,0];
    if (!core.isset(color[3])) color[3] = 1;
    color[3] = core.clamp(color[3],0,1);

    if (time==0) {
        // 直接变色
        core.clearMap('curtain');
        core.fillRect('curtain', 0, 0, 416, 416, core.arrayToRGBA(color));
        core.status.curtainColor = color;
        if (core.isset(callback)) callback();
        return;
    }

    var per_time = 10, step = parseInt(time / per_time);

    var changeAnimate = setInterval(function() {
        nowColor = [
            parseInt(nowColor[0]*(step-1)+color[0])/step,
            parseInt(nowColor[1]*(step-1)+color[1])/step,
            parseInt(nowColor[2]*(step-1)+color[2])/step,
            (nowColor[3]*(step-1)+color[3])/step,
        ];
        core.clearMap('curtain');
        core.fillRect('curtain', 0, 0, 416, 416, core.arrayToRGBA(nowColor));
        step--;

        if (step <= 0) {
            delete core.animateFrame.asyncId[changeAnimate];
            clearInterval(changeAnimate);
            core.status.curtainColor = color;
            // core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, per_time);

    core.animateFrame.asyncId[changeAnimate] = true;
}

////// 画面闪烁 //////
control.prototype.screenFlash = function (color, time, times, callback) {
    times = times || 1;
    time = time/3;
    var nowColor = core.clone(core.status.curtainColor);
    core.setFg(color, time, function() {
        core.setFg(nowColor, time * 2, function() {
            if (times > 1)
                core.screenFlash(color, time * 3, times - 1, callback);
            else {
                if (core.isset(callback)) callback();
            }
        });
    });
}

////// 更新全地图显伤 //////
control.prototype.updateDamage = function (floorId, canvas) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    if (!core.isset(canvas)) {
        canvas = core.canvas.damage;
        core.clearMap('damage');
    }

    // 更新显伤
    var mapBlocks = core.status.maps[floorId].blocks;
    // 没有怪物手册
    if (!core.hasItem('book')) return;
    canvas.font = "bold 11px Arial";

    if (core.flags.displayEnemyDamage || core.flags.displayCritical) {
        canvas.textAlign = 'left';

        for (var b = 0; b < mapBlocks.length; b++) {
            var x = mapBlocks[b].x, y = mapBlocks[b].y;
            if (core.isset(mapBlocks[b].event) && mapBlocks[b].event.cls.indexOf('enemy')==0
                && !mapBlocks[b].disable) {

                // 判定是否显伤
                if (mapBlocks[b].event.displayDamage === false)
                    continue;

                var id = mapBlocks[b].event.id;

                if (core.flags.displayEnemyDamage) {
                    var damageString = core.enemys.getDamageString(id, x, y, floorId);
                    var damage = damageString.damage, color = damageString.color;
                    core.fillBoldText(canvas, damage, 32*x+1, 32*(y+1)-1, color);
                }

                // 临界显伤
                if (core.flags.displayCritical) {
                    var critical = core.enemys.nextCriticals(id, 1, x, y, floorId);
                    if (critical.length>0) critical=critical[0];
                    critical = core.formatBigNumber(critical[0], true);
                    if (critical == '???') critical = '?';
                    core.fillBoldText(canvas, critical, 32*x+1, 32*(y+1)-11, '#FFFFFF');
                }

            }
        }
    }
    // 如果是领域&夹击
    if (core.flags.displayExtraDamage && core.isset((core.status.checkBlock||{}).damage)) {
        canvas.textAlign = 'center';

        // 临时改变
        var tempCheckBlock = null;
        if (floorId != core.status.floorId) {
            tempCheckBlock = core.clone(core.status.checkBlock);
            core.status.thisMap = core.status.maps[floorId];
            core.bigmap.width = core.floors[floorId].width || 13;
            core.bigmap.height = core.floors[floorId].height || 13;
            core.updateCheckBlock();
        }

        for (var x=0;x<core.bigmap.width;x++) {
            for (var y=0;y<core.bigmap.height;y++) {
                var damage = core.status.checkBlock.damage[x+core.bigmap.width*y];
                if (damage>0) {
                    damage = core.formatBigNumber(damage, true);
                    core.fillBoldText(canvas, damage, 32*x+16, 32*(y+1)-14, '#FF7F00');
                }
            }
        }

        if (floorId!=core.status.floorId) {
            core.status.thisMap = core.status.maps[core.status.floorId];
            core.status.checkBlock = tempCheckBlock;
            core.bigmap.width = core.floors[core.status.floorId].width || 13;
            core.bigmap.height = core.floors[core.status.floorId].height || 13;
        }
    }
}

////// 执行一个表达式的effect操作 //////
control.prototype.doEffect = function (effect, need, times) {
    effect.split(";").forEach(function (expression) {
        var arr = expression.split("+=");
        if (arr.length!=2) return;
        var name=arr[0], value=core.calValue(arr[1], null, need, times);
        if (name.indexOf("status:")==0) {
            var status=name.substring(7);
            core.setStatus(status, core.getStatus(status)+value);
        }
        else if (name.indexOf("item:")==0) {
            var itemId=name.substring(5);
            core.setItem(itemId, core.itemCount(itemId)+value);
        }
        else if (name.indexOf("flag:")==0) {
            var flag=name.substring(5);
            core.setFlag(flag, core.getFlag(flag, 0)+value);
        }
    });
}

////// 开启debug模式 //////
control.prototype.debug = function() {
    core.setFlag('debug', true);
    core.drawText("\t[调试模式开启]此模式下按住Ctrl键（或Ctrl+Shift键）可以穿墙并忽略一切事件。\n同时，录像将失效，也无法上传成绩。");
}

////// 选择录像文件 //////
control.prototype.chooseReplayFile = function () {
    core.readFile(function (obj) {
        if (obj.name!=core.firstData.name) {
            alert("存档和游戏不一致！");
            return;
        }
        if (core.isset(obj.version) && obj.version!=core.firstData.version) {
            // alert("游戏版本不一致！");
            if (!confirm("游戏版本不一致！\n你仍然想播放录像吗？")) {
                return;
            }
        }
        if (!core.isset(obj.route)) {
            alert("无效的录像！");
            return;
        }

        if (core.flags.startUsingCanvas) {
            core.startGame('', obj.seed, core.decodeRoute(obj.route));
        }
        else {
            core.startGame(obj.hard, obj.seed, core.decodeRoute(obj.route));
        }
    }, function () {

    })
}

////// 开始播放 //////
control.prototype.startReplay = function (list) {
    if (!core.isPlaying()) return;
    core.status.replay.replaying=true;
    core.status.replay.pausing=false;
    core.status.replay.speed=1.0;
    core.status.replay.toReplay = core.clone(list);
    core.status.replay.totalList = core.clone(list);
    core.status.replay.steps = 0;
    core.status.replay.save = [];
    core.updateStatusBar();
    core.drawTip("开始播放");
    this.replay();
    return;
}

////// 更改播放状态 //////
control.prototype.triggerReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (core.status.replay.pausing) this.resumeReplay();
    else this.pauseReplay();
}

////// 暂停播放 //////
control.prototype.pauseReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    core.status.replay.pausing = true;
    core.updateStatusBar();
    core.drawTip("暂停播放");
}

////// 恢复播放 //////
control.prototype.resumeReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    core.status.replay.pausing = false;
    core.updateStatusBar();
    core.drawTip("恢复播放");
    core.replay();
}

////// 加速播放 //////
control.prototype.speedUpReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    if (core.status.replay.speed==12) core.status.replay.speed=24.0;
    else if (core.status.replay.speed==6) core.status.replay.speed=12.0;
    else if (core.status.replay.speed==3) core.status.replay.speed=6.0;
    else if (core.status.replay.speed<3) {
        var toAdd = core.status.replay.speed>=2?2:1;
        core.status.replay.speed = parseInt(10*core.status.replay.speed + toAdd)/10;
    }
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 减速播放 //////
control.prototype.speedDownReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    if (core.status.replay.speed==24) core.status.replay.speed=12.0;
    else if (core.status.replay.speed==12) core.status.replay.speed=6.0;
    else if (core.status.replay.speed==6) core.status.replay.speed=3.0;
    else {
        var toAdd = core.status.replay.speed>=2?2:1;
        core.status.replay.speed = parseInt(10*core.status.replay.speed - toAdd)/10;
    }
    if (core.status.replay.speed<0.3) core.status.replay.speed=0.3;
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 设置播放速度 //////
control.prototype.setReplaySpeed = function (speed) {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    core.status.replay.speed = speed;
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 停止播放 //////
control.prototype.stopReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
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
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    if (!core.status.replay.pausing) {
        core.drawTip("请先暂停录像");
        return;
    }
    if (core.status.replay.animate) {
        core.drawTip("请等待当前事件的处理结束");
        return;
    }
    if (core.status.replay.save.length==0) {
        core.drawTip("无法再回到上一个节点");
        return;
    }

    var save = core.status.replay.save;
    var data = save.pop();
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
    })
}

////// 回放时存档 //////
control.prototype.saveReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;
    if (!core.isReplaying()) return;
    if (!core.status.replay.pausing) {
        core.drawTip("请先暂停录像");
        return;
    }
    if (core.status.replay.animate || core.isset(core.status.event.id)) {
        core.drawTip("请等待当前事件的处理结束");
        return;
    }

    core.lockControl();
    core.status.event.id='save';
    var saveIndex = core.saves.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;

    core.ui.drawSLPanel(10*page+offset);
}

////// 回放时查看怪物手册 //////
control.prototype.bookReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0) return;
    if (!core.isReplaying()) return;
    if (!core.status.replay.pausing) {
        core.drawTip("请先暂停录像");
        return;
    }

    // 从“浏览地图”页面打开
    if (core.status.event.id=='viewMaps') {
        core.status.event.selection = core.status.event.data;
        core.status.event.id=null;
    }

    if (core.status.replay.animate || core.isset(core.status.event.id)) {
        core.drawTip("请等待当前事件的处理结束");
        return;
    }

    core.lockControl();
    core.status.event.id='book';
    core.useItem('book', true);
}

////// 回放录像时浏览地图 //////
control.prototype.viewMapReplay = function () {
    if (!core.isPlaying()) return;
    if (core.status.event.id=='save' || (core.status.event.id||"").indexOf('book')==0 || core.status.event.id=='viewMaps') return;

    if (!core.isReplaying()) return;
    if (!core.status.replay.pausing) {
        core.drawTip("请先暂停录像");
        return;
    }
    if (core.status.replay.animate || core.isset(core.status.event.id)) {
        core.drawTip("请等待当前事件的处理结束");
        return;
    }

    core.lockControl();
    core.status.event.id='viewMaps';
    core.ui.drawMaps();
}

////// 回放 //////
control.prototype.replay = function () {
    if (!core.isPlaying()) return;

    if (!core.isReplaying()) return; // 没有回放
    if (core.status.replay.pausing) return; // 暂停状态
    if (core.status.replay.animate) return; // 正在某段动画中

    if (core.status.replay.toReplay.length==0) { // 回放完毕
        core.stopReplay();
        core.insertAction("录像回放完毕！");
        return;
    }

    core.status.replay.steps++;
    if (core.status.replay.steps%50==0) {
        if (core.status.replay.save.length == 30)
            core.status.replay.save.shift();
        core.status.replay.save.push({"data": core.saveData(), "replay": {
            "totalList": core.clone(core.status.replay.totalList),
            "toReplay": core.clone(core.status.replay.toReplay),
            "speed": core.status.replay.speed,
            "steps": core.status.replay.steps
        }});
    }

    var action=core.status.replay.toReplay.shift();

    if (action=='up' || action=='down' || action=='left' || action=='right') {
        core.moveHero(action, function () {
            setTimeout(function() {
                core.replay();
            });
        });
        return;
    }
    else if (action.indexOf("item:")==0) {
        var itemId = action.substring(5);
        if (core.canUseItem(itemId)) {
            // 是否绘制道具栏
            if (core.material.items[itemId].hideInReplay) {
                core.useItem(itemId, false, function () {
                    core.replay();
                });
                return;
            }
            else {
                var tools = Object.keys(core.status.hero.items.tools).sort();
                var constants = Object.keys(core.status.hero.items.constants).sort();
                var index=-1;
                if ((index=tools.indexOf(itemId))>=0) {
                    core.status.event.data = {"toolsPage":Math.floor(index/12)+1, "constantsPage":1, "selectId":null};
                    index = index%12;
                }
                else if ((index=constants.indexOf(itemId))>=0) {
                    core.status.event.data = {"toolsPage":1, "constantsPage":Math.floor(index/12)+1, "selectId":null};
                    index = index%12+12;
                }
                if (index>=0) {
                    core.ui.drawToolbox(index);
                    setTimeout(function () {
                        core.ui.closePanel();
                        core.useItem(itemId, false, function () {
                            core.replay();
                        });
                    }, 750 / Math.max(1, core.status.replay.speed));
                    return;
                }
            }
        }
    }
    else if (action.indexOf("unEquip:")==0) {
        var equipType = parseInt(action.substring(8));
        if (core.isset(equipType)) {
            core.ui.drawEquipbox(equipType);
            core.status.route.push(action);
            setTimeout(function () {
                core.ui.closePanel();
                core.unloadEquip(equipType, function () {
                    core.replay();
                });
            }, 750 / Math.max(1, core.status.replay.speed));
            return;
        }
    }
    else if (action.indexOf("equip:")==0) {
        var equipId = action.substring(6);
        var ownEquipment = Object.keys(core.status.hero.items.equips).sort();
        var index = ownEquipment.indexOf(equipId);
        if (index>=0) {
            core.status.route.push(action);
            core.status.event.data = {"page":Math.floor(index/12)+1, "selectId":null};
            index = index%12+12;
            core.ui.drawEquipbox(index);
            setTimeout(function () {
                core.ui.closePanel();
                core.loadEquip(equipId, function () {
                    core.replay();
                });
            }, 750 / Math.max(1, core.status.replay.speed));
            return;
        }
    }
    else if (action.indexOf("fly:")==0) {
        var floorId=action.substring(4);
        var toIndex=core.status.hero.flyRange.indexOf(floorId);
        var nowIndex=core.status.hero.flyRange.indexOf(core.status.floorId);
        if (core.hasItem('fly') && toIndex>=0 && nowIndex>=0) {
            core.ui.drawFly(toIndex);
            setTimeout(function () {
                if (!core.control.flyTo(floorId, function () {core.replay()})) {
                    core.stopReplay();
                    core.insertAction("录像文件出错");
                }
            }, 750 / Math.max(1, core.status.replay.speed));
            return;
        }
    }
    else if (action.indexOf("shop:")==0) {
        var sps=action.substring(5).split(":");
        var shopId=sps[0], selections=sps[1].split("");

        if (selections.length>0) {
            var shop=core.status.shops[shopId];
            if (core.isset(shop) && shop.visited) { // 商店可用
                var choices = shop.choices;
                var topIndex = 6 - parseInt(choices.length / 2);

                core.status.event.selection = parseInt(selections.shift());

                core.events.openShop(shopId, false);
                var shopInterval = setInterval(function () {
                    if (!core.actions.clickShop(6, topIndex+core.status.event.selection)) {
                        clearInterval(shopInterval);
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                        return;
                    }
                    if (selections.length==0) {
                        clearInterval(shopInterval);
                        core.actions.clickShop(6, topIndex+choices.length);
                        core.replay();
                        return;
                    }
                    core.status.event.selection = parseInt(selections.shift());
                    core.events.openShop(shopId, false);

                }, 750 / Math.max(1, core.status.replay.speed));
                return;
            }
        }
    }
    else if (action=='turn') {
        core.turnHero();
        core.replay();
        return;
    }
    else if (action.indexOf("turn:")==0) {
        core.turnHero(action.substring(5));
        core.replay();
        return;
    }
    else if (action=='getNext') {
        if (core.getNextItem()) {
            core.replay();
            return;
        }
    }
    else if (action.indexOf('move:')==0) {
        while (core.status.replay.toReplay.length>0 &&
            core.status.replay.toReplay[0].indexOf('move:')==0) {
            action = core.status.replay.toReplay.shift();
        }

        var pos=action.substring(5).split(":");
        var x=parseInt(pos[0]), y=parseInt(pos[1]);
        var nowx=core.getHeroLoc('x'), nowy=core.getHeroLoc('y');
        if (core.control.moveDirectly(x,y)) {
            core.ui.drawArrow('ui', 32*nowx+16-core.bigmap.offsetX, 32*nowy+16-core.bigmap.offsetY, 32*x+16-core.bigmap.offsetX, 32*y+16-core.bigmap.offsetY, '#FF0000', 3);
            setTimeout(function () {
                core.clearMap('ui');
                core.replay();
            }, 750 / Math.max(1, core.status.replay.speed));
            return;
        }
    }
    else if (action.indexOf('key:')==0) {
        core.actions.keyUp(parseInt(action.substring(4)), false, true);
        core.replay();
        return;
    }

    core.stopReplay();
    core.insertAction("录像文件出错");

}

control.prototype.isReplaying = function () {
    return (core.status.replay||{}).replaying;
}

////// 判断当前能否进入某个事件 //////
control.prototype.checkStatus = function (name, need, item) {
    if (need && core.status.event.id == name) {
        core.ui.closePanel();
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
    core.status.event.id = name;
    return true;
}

////// 点击怪物手册时的打开操作 //////
control.prototype.openBook = function (need) {
    if (core.isReplaying()) return;

    if (core.status.event.id == 'book' && core.events.recoverEvents(core.status.event.interval)) {
        return;
    }

    // 当前是book，且从“浏览地图”打开
    if (core.status.event.id == 'book' && core.isset(core.status.event.ui)) {
        core.status.boxAnimateObjs = [];
        core.ui.drawMaps(core.status.event.ui);
        return;
    }

    // 从“浏览地图”页面打开
    if (core.status.event.id=='viewMaps') {
        need=false;
        core.status.event.ui = core.status.event.data;
    }

    if (!core.checkStatus('book', need, true))
        return;
    core.useItem('book', true);
}

////// 点击楼层传送器时的打开操作 //////
control.prototype.useFly = function (need) {
    if (core.isReplaying()) return;
    if (!core.checkStatus('fly', need, true))
        return;
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

control.prototype.flyTo = function (toId, callback) {
    return this.controldata.flyTo(toId, callback);
}

////// 点击装备栏时的打开操作 //////
control.prototype.openEquipbox = function (need) {
    if (core.isReplaying()) return;
    if (!core.checkStatus('equipbox', need))
        return;
    core.ui.drawEquipbox();
}

////// 点击工具栏时的打开操作 //////
control.prototype.openToolbox = function (need) {
    if (core.isReplaying()) return;
    if (!core.checkStatus('toolbox', need))
        return;
    core.ui.drawToolbox();
}

////// 点击快捷商店按钮时的打开操作 //////
control.prototype.openQuickShop = function (need) {
    if (core.isReplaying()) return;
    if (!core.checkStatus('selectShop', need))
        return;
    core.ui.drawQuickShop();
}

control.prototype.openKeyBoard = function (need) {
    if (core.isReplaying()) return;

    if (!core.checkStatus('keyBoard', need))
        return;
    core.ui.drawKeyBoard();
}

////// 点击保存按钮时的打开操作 //////
control.prototype.save = function(need) {
    if (core.isReplaying()) return;

    if (core.status.event.id == 'save' && core.events.recoverEvents(core.status.event.interval)) {
        return;
    }

    if (!core.checkStatus('save', need))
        return;

    var saveIndex = core.saves.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;

    core.ui.drawSLPanel(10*page+offset);
}

////// 点击读取按钮时的打开操作 //////
control.prototype.load = function (need) {
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

    if (core.status.event.id == 'load' && core.events.recoverEvents(core.status.event.interval)) {
        return;
    }

    if (!core.checkStatus('load', need))
        return;
    core.ui.drawSLPanel(10*page+offset);
}

////// 点击设置按钮时的操作 //////
control.prototype.openSettings = function (need) {
    if (core.isReplaying()) return;
    if (!core.checkStatus('settings', need))
        return;
    core.ui.drawSettings();
}

////// 自动存档 //////
control.prototype.autosave = function (removeLast) {
    if (core.status.event.id!=null) return;
    var x=null;
    if (removeLast)
        x=core.status.route.pop();
    core.status.route.push("turn:"+core.getHeroLoc('direction'));
    // core.setLocalForage("autoSave", core.saveData());
    // ----- Add to autosaveData
    core.saves.autosave.data = core.saveData();
    core.saves.autosave.updated = true;
    core.saves.ids[0] = true;
    // ----- Updated every 5s
    core.status.route.pop();
    if (removeLast && core.isset(x))
        core.status.route.push(x);
}

/////// 实际进行自动存档 //////
control.prototype.checkAutosave = function () {
    core.setLocalStorage('totalTime', core.animateFrame.totalTime);

    if (core.saves.autosave.data == null || !core.saves.autosave.updated) return;
    core.saves.autosave.updated = false;
    core.setLocalForage("autoSave", core.saves.autosave.data);
}

////// 实际进行存读档事件 //////
control.prototype.doSL = function (id, type) {
    if (type=='save') {
        if (id=='autoSave') {
            core.drawTip('不能覆盖自动存档！');
            return;
        }
        // 事件中的存档
        if (core.status.event.interval != null) {
            core.setFlag("__events__", core.status.event.interval);
        }
        core.setLocalForage("save"+id, core.saveData(), function() {
            if (id!="autoSave") {
                core.saves.saveIndex=id;
                core.setLocalStorage('saveIndex', core.saves.saveIndex);
            }
            if (core.events.recoverEvents(core.status.event.interval)) {
                core.drawTip("存档成功！");
                return;
            }
            core.ui.closePanel();
            core.drawTip('存档成功！');
        }, function(err) {
            console.info(err);
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
    else if (type=='load') {
        var afterGet = function (data) {
            if (!core.isset(data)) {
                alert("无效的存档");
                return;
            }
            if (core.flags.checkConsole && core.isset(data.hashCode) && data.hashCode != core.utils.hashCode(data.hero)) {
                if (confirm("存档校验失败，请勿修改存档文件！\n你想回放此存档的录像吗？")) {
                    core.startGame(data.hard, data.hero.flags.__seed__, core.decodeRoute(data.route));
                }
                return;
            }
            if (data.version != core.firstData.version) {
                // core.drawTip("存档版本不匹配");
                if (confirm("存档版本不匹配！\n你想回放此存档的录像吗？\n可以随时停止录像播放以继续游戏。")) {
                    core.startGame(data.hard, data.hero.flags.__seed__, core.decodeRoute(data.route));
                }
                return;
            }
            core.ui.closePanel();
            core.loadData(data, function() {
                core.drawTip("读档成功");
                if (id!="autoSave") {
                    core.saves.saveIndex=id;
                    core.setLocalStorage('saveIndex', core.saves.saveIndex);
                }
            });
        }
        if (id == 'autoSave' && core.saves.autosave.data != null) {
            afterGet(core.clone(core.saves.autosave.data));
        }
        else {
            core.getLocalForage(id=='autoSave'?id:"save"+id, null, function(data) {
                if (id == 'autoSave') core.saves.autosave.data = core.clone(data);
                afterGet(data);
            }, function(err) {
                main.log(err);
                alert("无效的存档");
            })
        }
        return;
    }
    else if (type == 'replayLoad') {
        var afterGet = function (data) {
            if (!core.isset(data)) {
                core.drawTip("无效的存档");
                return;
            }
            if (data.version != core.firstData.version) {
                core.drawTip("存档版本不匹配");
                return;
            }
            if (data.hard != core.status.hard) {
                core.drawTip("游戏难度不匹配！");
                return;
            }
            if (core.isset(data.hashCode) && data.hashCode != core.utils.hashCode(data.hero)) {
                alert("存档校验失败，请勿修改存档文件！");
                return;
            }
            var route = core.subarray(core.status.route, core.decodeRoute(data.route));
            if (!core.isset(route) || data.hero.flags.__seed__!=core.getFlag('__seed__')) {
                core.drawTip("无法从此存档回放录像");
                return;
            }
            core.loadData(data, function () {
                core.startReplay(route);
                core.drawTip("回退到存档节点");
            });
        }
        if (id == 'autoSave' && core.saves.autosave.data != null) {
            afterGet(core.clone(core.saves.autosave.data));
        }
        else {
            core.getLocalForage(id=='autoSave'?id:"save"+id, null, function(data) {
                if (id == 'autoSave') core.saves.autosave.data = core.clone(data);
                afterGet(data);
            }, function(err) {
                main.log(err);
                alert("无效的存档");
            })
        }
    }
}

////// 同步存档到服务器 //////
control.prototype.syncSave = function (type) {
    core.ui.drawWaiting("正在同步，请稍后...");
    core.control.getSaves(type=='all'?null:core.saves.saveIndex, function (saves) {
        if (!core.isset(saves)) {
            core.drawText("没有要同步的存档");
            return;
        }

        var formData = new FormData();
        formData.append('type', 'save');
        formData.append('name', core.firstData.name);
        var save_text = JSON.stringify(saves);
        formData.append('data', save_text);

        core.http("POST", "/games/sync.php", formData, function (data) {
            var response = JSON.parse(data);
            if (response.code<0) {
                core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因："+response.msg);
            }
            else {
                core.drawText((type=='all'?"所有存档":"存档"+core.saves.saveIndex)+"同步成功！\n\n您的存档编号： "
                    +response.code+"\n您的存档密码： "+response.msg
                    +"\n\n请牢记以上两个信息（如截图等），在从服务器\n同步存档时使用。")
            }
        }, function (e) {
            core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因："+e);
        })
    })
}

////// 从服务器加载存档 //////
control.prototype.syncLoad = function () {
    core.interval.onDownInterval = 'tmp';
    var id = prompt("请输入存档编号：");
    if (id==null || id=="") {
        core.ui.drawSyncSave(); return;
    }
    core.interval.onDownInterval = 'tmp';
    var password = prompt("请输入存档密码：");
    if (password==null || password=="") {
        core.ui.drawSyncSave(); return;
    }
    core.ui.drawWaiting("正在同步，请稍后...");

    var formData = new FormData();
    formData.append('type', 'load');
    formData.append('name', core.firstData.name);
    formData.append('id', id);
    formData.append('password', password);

    core.http("POST", "/games/sync.php", formData, function (data) {
        var response = JSON.parse(data);
        switch (response.code) {
            case 0:
                // 成功
                var data=JSON.parse(response.msg);
                if (data instanceof Array) {
                    core.status.event.selection=1;
                    core.ui.drawConfirmBox("所有本地存档都将被覆盖，确认？", function () {
                        for (var i=1;i<=5*(main.savePages||30);i++) {
                            if (i<=data.length) {
                                // core.setLocalStorage("save"+i, data[i-1]);
                                core.setLocalForage("save"+i, data[i-1]);
                            }
                            else {
                                if (core.saves.ids[i])
                                    core.removeLocalForage("save"+i);
                            }
                        }
                        core.drawText("同步成功！\n你的本地所有存档均已被覆盖。");
                    }, function () {
                        core.status.event.selection=0;
                        core.ui.drawSyncSave();
                    })
                }
                else {
                    // 只覆盖单存档
                    core.setLocalForage("save"+core.saves.saveIndex, data, function() {
                        core.drawText("同步成功！\n单存档已覆盖至存档"+core.saves.saveIndex);
                    });
                }
                break;
            case -1:
                core.drawText("出错啦！\n存档编号"+id+"不存在！");
                break;
            case -2:
                core.drawText("出错啦！\n存档密码错误！");
                break;
            default:
                core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因："+response.msg);
                break;
        }
    }, function (e) {
        core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因："+e);
    });
}

////// 存档到本地 //////
control.prototype.saveData = function() {
    var hero = core.clone(core.status.hero);
    var hashCode = core.utils.hashCode(hero);

    var data = {
        'floorId': core.status.floorId,
        'hero': hero,
        'hard': core.status.hard,
        'maps': core.maps.save(core.status.maps),
        'route': core.encodeRoute(core.status.route),
        'values': core.clone(core.values),
        'shops': {},
        'version': core.firstData.version,
        "time": new Date().getTime(),
        "hashCode": hashCode
    };
    // set shop times
    for (var shop in core.status.shops) {
        data.shops[shop]={
            'times': core.status.shops[shop].times || 0,
            'visited': core.status.shops[shop].visited || false
        }
    }
    core.events.beforeSaveData(data);

    return data;
}

////// 从本地读档 //////
control.prototype.loadData = function (data, callback) {

    core.resetStatus(data.hero, data.hard, data.floorId, core.decodeRoute(data.route), core.maps.load(data.maps),
        data.values);

    // load shop times
    for (var shop in core.status.shops) {
        if (core.isset(data.shops[shop])) {
            core.status.shops[shop].times = data.shops[shop].times;
            core.status.shops[shop].visited = data.shops[shop].visited;
        }
    }

    core.status.textAttribute = core.getFlag('textAttribute', core.status.textAttribute);
    var toAttribute = core.getFlag('globalAttribute', core.status.globalAttribute);
    if (core.utils.hashCode(toAttribute) != core.utils.hashCode(core.status.globalAttribute)) {
        core.status.globalAttribute = toAttribute;
        core.control.updateGlobalAttribute(Object.keys(toAttribute));
    }

    // 重置音量
    core.events.setVolume(core.getFlag("__volume__", 1), 0);

    // load icons
    var icon = core.getFlag("heroIcon", "hero.png");
    if (core.isset(core.material.images.images[icon])) {
        core.material.images.hero.src = core.material.images.images[icon].src;
        core.material.icons.hero.height = core.material.images.images[icon].height/4;
    }

    core.events.afterLoadData(data);

    core.changeFloor(data.floorId, null, data.hero.loc, 0, function() {
        if (core.isset(callback)) callback();
    }, true);
}

control.prototype.getSaves = function (index, callback) {
    if (core.isset(index)) {
        core.getLocalForage("save"+index, null, function(data) {
            if (core.isset(callback)) callback(data);
        }, function(err) {
            main.log(err);
            if (core.isset(callback))
                callback(null);
        })
        return;
    }

    var ids = Object.keys(core.saves.ids).sort(function(a,b) {return a-b;}), number = ids.length;
    // 不计0
    var saves = [];

    var load = function (index, callback) {
        if (index >= number) {
            if (core.isset(callback)) callback(saves);
            return;
        }
        core.getLocalForage("save"+ids[index], null, function (data) {
            saves.push(data);
            load(index+1, callback);
        }, function(err) {
            main.log(err);
            load(index+1, callback);
        })
    }
    load(1, callback);
}

////// 获得所有存在存档的存档位 //////
control.prototype.getSaveIndexes = function (callback) {
    var indexes = {};

    var getIndex = function (name) {
        var e = new RegExp('^'+core.firstData.name+"_(save\\d+|autoSave)$").exec(name);
        if (e!=null) {
            if (e[1]=='autoSave') indexes[0]=true;
            else indexes[parseInt(e[1].substring(4))] = true;
        }
    };

    if (!core.platform.useLocalForage) {
        Object.keys(localStorage).forEach(function (key) {
            getIndex(key);
        });
        callback(indexes);
    }
    else {
        localforage.iterate(function (value, key, n) {
            getIndex(key)
        }, function () {
            callback(indexes);
        })
    }
}

////// 判断某个存档位是否存在存档 //////
control.prototype.hasSave = function (index) {
    return core.saves.ids[index]||false;
}

////// 设置勇士属性 //////
control.prototype.setStatus = function (statusName, statusVal) {
    if (!core.isset(core.status.hero)) return;
    if (statusName == 'exp') statusName = 'experience';
    if (core.isset(core.status.hero.loc[statusName]))
        core.status.hero.loc[statusName] = statusVal;
    else
        core.status.hero[statusName] = statusVal;
}

////// 获得勇士属性 //////
control.prototype.getStatus = function (statusName) {
    if (!core.isset(core.status.hero)) return null;
    // support status:x
    if (core.isset(core.status.hero.loc[statusName]))
        return core.status.hero.loc[statusName];
    if (statusName == 'exp') statusName = 'experience';
    return core.status.hero[statusName];
}

////// 获得某个等级的名称 //////
control.prototype.getLvName = function () {
    if (!core.isset(core.status.hero)) return null;
    return ((core.firstData.levelUp||[])[core.status.hero.lv-1]||{}).title || core.status.hero.lv;
}

////// 设置某个自定义变量或flag //////
control.prototype.setFlag = function(flag, value) {
    if (!core.isset(value)) return this.removeFlag(flag);
    if (!core.isset(core.status.hero)) return;
    core.status.hero.flags[flag]=value;
}

////// 获得某个自定义变量或flag //////
control.prototype.getFlag = function(flag, defaultValue) {
    if (!core.isset(core.status.hero)) return defaultValue;
    var value = core.status.hero.flags[flag];
    if (core.isset(value)) return value;
    return defaultValue;
}

////// 是否存在某个自定义变量或flag，且值为true //////
control.prototype.hasFlag = function(flag) {
    if (core.getFlag(flag)) return true;
    return false;
}

////// 删除某个自定义变量或flag //////
control.prototype.removeFlag = function(flag) {
    if (!core.isset(core.status.hero)) return;
    delete core.status.hero.flags[flag];
}

////// 锁定状态栏，常常用于事件处理 //////
control.prototype.lockControl = function () {
    core.status.lockControl = true;
}

////// 解锁状态栏 //////
control.prototype.unLockControl = function () {
    core.status.lockControl = false;
}

////// 播放背景音乐 //////
control.prototype.playBgm = function (bgm) {
    if (main.mode!='play')return;
    // 音频不存在
    if (!core.isset(core.material.bgms[bgm])) return;
    // 如果不允许播放
    if (!core.musicStatus.bgmStatus) {
        try {
            core.musicStatus.playingBgm = bgm;
            core.material.bgms[bgm].pause();
        }
        catch (e) {
            main.log(e);
        }
        return;
    }
    this.setMusicBtn();

    /*
    // 延迟播放
    if (core.material.bgms[bgm] == 'loading') {
        core.material.bgms[bgm] = 'starting';
        return;
    }
    */

    try {
        // 缓存BGM
        core.loader.loadBgm(bgm);
        // 如果当前正在播放，且和本BGM相同，直接忽略
        if (core.musicStatus.playingBgm == bgm && !core.material.bgms[core.musicStatus.playingBgm].paused) {
            return;
        }
        // 如果正在播放中，暂停
        if (core.isset(core.musicStatus.playingBgm)) {
            core.material.bgms[core.musicStatus.playingBgm].pause();
        }
        // 播放当前BGM
        core.material.bgms[bgm].volume = core.musicStatus.volume;
        core.material.bgms[bgm].currentTime = 0;
        core.material.bgms[bgm].play();
        core.musicStatus.playingBgm = bgm;
    }
    catch (e) {
        console.log("无法播放BGM "+bgm);
        main.log(e);
        core.musicStatus.playingBgm = null;
    }
}

////// 暂停背景音乐的播放 //////
control.prototype.pauseBgm = function () {
    // 直接暂停播放
    try {
        if (core.isset(core.musicStatus.playingBgm)) {
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
control.prototype.resumeBgm = function () {
    if (main.mode!='play')return;

    // 恢复BGM
    try {
        core.playBgm(core.musicStatus.playingBgm);
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
    if (main.mode!='play')return;

    core.musicStatus.bgmStatus = !core.musicStatus.bgmStatus;
    if (core.musicStatus.bgmStatus)
        this.resumeBgm();
    else {
        this.pauseBgm();
    }
    core.setLocalStorage('bgmStatus', core.musicStatus.bgmStatus);
}

////// 播放音频 //////
control.prototype.playSound = function (sound) {
    if (main.mode!='play')return;
    // 如果不允许播放
    if (!core.musicStatus.soundStatus) return;
    // 音频不存在
    if (!core.isset(core.material.sounds[sound])) return;

    try {
        if (core.musicStatus.audioContext != null) {
            var source = core.musicStatus.audioContext.createBufferSource();
            source.buffer = core.material.sounds[sound];
            source.connect(core.musicStatus.gainNode);
            try {
                source.start(0);
            }
            catch (e) {
                try {
                    source.noteOn(0);
                }
                catch (ee) {
                    main.log(ee);
                }
            }
        }
        else {
            core.material.sounds[sound].volume = core.musicStatus.volume;
            core.material.sounds[sound].play();
        }
    }
    catch (eee) {
        console.log("无法播放SE "+sound);
        main.log(eee);
    }
}

control.prototype.checkBgm = function() {
    core.playBgm(core.musicStatus.playingBgm || main.startBgm);
}

////// 清空状态栏 //////
control.prototype.clearStatusBar = function() {
    Object.keys(core.statusBar).forEach(function (e) {
        if (core.isset(core.statusBar[e].innerHTML))
            core.statusBar[e].innerHTML = "&nbsp;";
    })
    core.statusBar.image.book.style.opacity = 0.3;
    if (!core.flags.equipboxButton) {
        core.statusBar.image.fly.style.opacity = 0.3;
    }
}

////// 更新状态栏 //////
control.prototype.updateStatusBar = function () {

    if (core.isPlaying())
        this.controldata.updateStatusBar();

    // 回放
    if (core.isReplaying()) {
        core.statusBar.image.book.src = core.status.replay.pausing ? core.statusBar.icons.play.src : core.statusBar.icons.pause.src;
        core.statusBar.image.book.style.opacity = 1;

        core.statusBar.image.fly.src = core.statusBar.icons.stop.src;
        core.statusBar.image.fly.style.opacity = 1;

        core.statusBar.image.toolbox.src = core.statusBar.icons.rewind.src;

        core.statusBar.image.keyboard.src = core.statusBar.icons.book.src;
        core.statusBar.image.shop.style.opacity = 0;

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
        core.statusBar.image.shop.style.opacity = 1;

        core.statusBar.image.save.src = core.statusBar.icons.save.src;

        core.statusBar.image.load.src = core.statusBar.icons.load.src;

        core.statusBar.image.settings.src = core.statusBar.icons.settings.src;
    }
}

control.prototype.triggerStatusBar = function (name, showToolbox) {
    if (name!='hide') name='show';

    // 如果是隐藏 -> 显示工具栏，则先显示
    if (name == 'hide' && !core.domStyle.showStatusBar) {
        this.triggerStatusBar("show");
        this.triggerStatusBar("hide", showToolbox);
        return;
    }

    var statusItems = core.dom.status;
    var toolItems = core.dom.tools;
    core.domStyle.showStatusBar = name == 'show';
    core.setFlag('hideStatusBar', core.domStyle.showStatusBar?null:true);
    core.setFlag('showToolbox', showToolbox?true:null);
    if (!core.domStyle.showStatusBar) {
        for (var i = 0; i < statusItems.length; ++i)
            statusItems[i].style.opacity = 0;
        if (!core.domStyle.isVertical || !showToolbox) {
            for (var i = 0; i < toolItems.length; ++i)
                toolItems[i].style.display = 'none';
        }
    }
    else {
        for (var i = 0; i < statusItems.length; ++i)
            statusItems[i].style.opacity = 1;
        this.setToolbarButton(false);
        core.dom.tools.hard.style.display = 'block';
    }
}

control.prototype.updateHeroIcon = function (name) {
    name = name || "hero.png";
    if (core.statusBar.icons.name == name) return;
    core.statusBar.icons.name = name;

    var image = core.material.images.hero;
    // 全身图
    var height = core.material.icons.hero.height;
    var ratio = 32 / height, width = 32 * ratio, left = 16-width/2;

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = 32;
    canvas.height = 32;
    context.drawImage(image, 0, 0, 32, height, left, 0, width, 32);

    core.statusBar.image.name.src = canvas.toDataURL("image/png");

}

control.prototype.updateGlobalAttribute = function (name) {
    if (!core.isset(name)) return;
    if (name instanceof Array) {
        name.forEach(function (t) {
            core.control.updateGlobalAttribute(t);
        });
        return;
    }
    var attribute = core.status.globalAttribute || core.initStatus.globalAttribute;
    if (!core.isset(attribute)) return;
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
                core.dom.gameDraw.style.border = border;
                core.dom.toolBar.style.borderBottom = border;
                core.dom.toolBar.style.borderLeft = border;
                core.dom.toolBar.style.borderRight = core.domStyle.isVertical?border:'';
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

////// 改变工具栏为按钮1-7 //////
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

    if (!core.isset(useButton)) useButton = core.domStyle.toolbarBtn;
    if (!core.domStyle.isVertical) useButton = false;
    if (!core.platform.extendKeyboard) useButton = false;

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

control.prototype.needDraw = function(id) {
    if (!core.isset(id)) {
        var toDraw = [], status = core.dom.status;
        for (var i = 0; i<status.length; ++i) {
            var dom = core.dom.status[i], idCol = dom.id;
            if (idCol.indexOf("Col")!=idCol.length-3) continue;
            var id = idCol.substring(0, idCol.length-3);
            if (!this.needDraw(id)) continue;
            toDraw.push(id);
        }
        return toDraw;
    }
    switch (id) {
        case 'floor': return core.flags.enableFloor;
        case 'name': return core.flags.enableName;
        case 'lv': return core.flags.enableLv;
        case 'hpmax': return core.flags.enableHPMax;
        case 'mana': return core.flags.enableMana;
        case 'mdef': return core.flags.enableMDef;
        case 'money': return core.flags.enableMoney;
        case 'experience': return core.flags.enableExperience && !core.flags.levelUpLeftMode;
        case 'up': return core.flags.enableLevelUp;
        case 'skill': return core.flags.enableSkill;
        case 'key': return core.flags.enableKeys;
        case 'pzf': return core.flags.enablePZF;
        case 'debuff': return core.flags.enableDebuff;
        default: return true;
    }
}

////// 屏幕分辨率改变后重新自适应 //////
control.prototype.resize = function(clientWidth, clientHeight) {
    if (main.mode=='editor')return;

    clientWidth = clientWidth || main.dom.body.clientWidth;
    clientHeight = clientHeight || main.dom.body.clientHeight;

    // 默认画布大小
    var DEFAULT_CANVAS_WIDTH = 422;
    // 默认边栏宽度
    var DEFAULT_BAR_WIDTH = 132;

    var BASE_LINEHEIGHT = 32;
    var SPACE = 3;
    var DEFAULT_FONT_SIZE = 16;
    //适配宽度 422
    var ADAPT_WIDTH = DEFAULT_CANVAS_WIDTH;
    var CHANGE_WIDTH = DEFAULT_CANVAS_WIDTH+DEFAULT_BAR_WIDTH;
    //判断横竖屏
    var width = clientWidth;
    var isHorizontal = false;
    if(clientWidth > clientHeight && clientHeight < ADAPT_WIDTH){
        isHorizontal = true;
        width = clientHeight;
    }
    // 各元素大小的变量声明
    var gameGroupWidth, gameGroupHeight, borderRight,
        canvasWidth, canvasTop, // canvasLeft,
        statusBarWidth, statusBarHeight, statusBarBorder,
        statusWidth, statusHeight, statusMaxWidth,statusLabelsLH,
        toolBarWidth, toolBarHeight, toolBarTop, toolBarBorder,
        toolsWidth, toolsHeight,toolsMargin,toolsPMaxwidth,
        fontSize, toolbarFontSize, margin, statusBackground, toolsBackground,
        statusCanvasWidth, statusCanvasHeight, musicBtnBottom, musicBtnRight;

    var toDraw = this.needDraw();
    var count = toDraw.length;
    var statusCanvas = core.flags.statusCanvas, statusCanvasRows = core.flags.statusCanvasRowsOnMobile || 3;

    if (!statusCanvas && count>12) alert("当前状态栏数目("+count+")大于12，请调整到不超过12以避免手机端出现显示问题。");
    var col = Math.ceil(count / 3);
    if (statusCanvas) col = statusCanvasRows;

    var statusLineHeight = BASE_LINEHEIGHT * 9 / count;
    var statusLineFontSize = DEFAULT_FONT_SIZE;
    if (count>9) statusLineFontSize = statusLineFontSize * 9 / count;

    var borderColor = (core.status.globalAttribute||core.initStatus.globalAttribute).borderColor;

    statusBarBorder = '3px '+borderColor+' solid';
    toolBarBorder = '3px '+borderColor+' solid';
    var zoom = (ADAPT_WIDTH - width) / 4.22;
    var aScale = 1 - zoom / 100;

    core.domStyle.toolbarBtn = false;

    // 移动端
    if (width < CHANGE_WIDTH) {
        if(width < ADAPT_WIDTH){

            core.domStyle.scale = aScale;
            canvasWidth = width;
        }else{
            canvasWidth = DEFAULT_CANVAS_WIDTH;
            core.domStyle.scale = 1;
        }

        var scale = core.domStyle.scale
        var tempWidth = DEFAULT_CANVAS_WIDTH * scale;
        if(!isHorizontal){ //竖屏
            core.domStyle.screenMode = 'vertical';
            core.domStyle.isVertical = true;

            var tempTopBarH = scale * (BASE_LINEHEIGHT * col + SPACE * 2) + 6;
            var tempBotBarH = scale * (BASE_LINEHEIGHT + SPACE * 4) + 6;

            gameGroupHeight = tempWidth + tempTopBarH + tempBotBarH;

            gameGroupWidth = tempWidth
            statusCanvasWidth = canvasWidth;
            statusCanvasHeight = tempTopBarH;
            canvasTop = tempTopBarH;
            // canvasLeft = 0;
            toolBarWidth = statusBarWidth = canvasWidth;
            statusBarHeight = tempTopBarH;
            statusBarBorder = '3px '+borderColor+' solid';

            statusHeight = scale*BASE_LINEHEIGHT * .8;
            statusLabelsLH = .8 * BASE_LINEHEIGHT *scale;
            statusMaxWidth = scale * DEFAULT_BAR_WIDTH * .95;
            statusBackground = (core.status.globalAttribute||core.initStatus.globalAttribute).statusTopBackground;
            toolBarHeight = tempBotBarH;

            toolBarTop = statusBarHeight + canvasWidth;
            toolBarBorder = '3px '+borderColor+' solid';
            toolsHeight = scale * BASE_LINEHEIGHT * 0.95;
            toolsPMaxwidth = scale * DEFAULT_BAR_WIDTH * .4;
            toolsBackground = (core.status.globalAttribute||core.initStatus.globalAttribute).toolsBackground;
            borderRight = '3px '+borderColor+' solid';

            margin = scale * SPACE * 2;
            toolsMargin = scale * SPACE * 3;
            fontSize = DEFAULT_FONT_SIZE * scale;
            toolbarFontSize = DEFAULT_FONT_SIZE * scale;
            musicBtnRight = 3;
            musicBtnBottom = 3;
        }else { //横屏
            core.domStyle.screenMode = 'horizontal';
            core.domStyle.isVertical = false;
            gameGroupWidth = tempWidth + DEFAULT_BAR_WIDTH * scale;
            gameGroupHeight = tempWidth;
            canvasTop = 0;
            // canvasLeft = DEFAULT_BAR_WIDTH * scale;
            toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH * scale;
            statusBarHeight = gameGroupHeight - SPACE;
            statusBarBorder = '3px '+borderColor+' solid';
            statusCanvasWidth = toolBarWidth + SPACE;
            statusCanvasHeight = statusBarHeight;
            statusBackground = (core.status.globalAttribute||core.initStatus.globalAttribute).statusLeftBackground;

            statusHeight = scale*statusLineHeight * .8;
            statusLabelsLH = .8 * statusLineHeight *scale;
            toolBarTop = scale*statusLineHeight * count + SPACE * 2;
            toolBarHeight = canvasWidth - toolBarTop;
            toolBarBorder = '3px '+borderColor+' solid';
            toolsHeight = scale * BASE_LINEHEIGHT;
            toolsBackground = 'transparent';
            fontSize = statusLineFontSize * scale;
            toolbarFontSize = DEFAULT_FONT_SIZE * scale;
            borderRight = '';
            statusMaxWidth = scale * DEFAULT_BAR_WIDTH;
            toolsPMaxwidth = scale * DEFAULT_BAR_WIDTH;

            margin = scale * SPACE * 2;
            toolsMargin = 2 * SPACE * scale;
            musicBtnRight = 3;
            musicBtnBottom = 3;
        }

    }else { //大屏设备 pc端
        core.domStyle.scale = 1;
        core.domStyle.screenMode = 'bigScreen';
        core.domStyle.isVertical = false;

        gameGroupWidth = DEFAULT_CANVAS_WIDTH + DEFAULT_BAR_WIDTH;
        gameGroupHeight = DEFAULT_CANVAS_WIDTH;
        canvasWidth = DEFAULT_CANVAS_WIDTH;
        canvasTop = 0;
        // canvasLeft = DEFAULT_BAR_WIDTH;

        toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH;
        // statusBarHeight = statusLineHeight * count + SPACE * 2; //一共有9行
        statusBackground = (core.status.globalAttribute||core.initStatus.globalAttribute).statusLeftBackground;
        statusBarHeight = gameGroupHeight - SPACE;
        statusCanvasWidth = toolBarWidth + SPACE;
        statusCanvasHeight = statusBarHeight;

        statusHeight = statusLineHeight * .8;
        statusLabelsLH = .8 * statusLineHeight;
        toolBarTop = statusLineHeight * count + SPACE * 2;
        toolBarHeight = DEFAULT_CANVAS_WIDTH - toolBarTop;
        toolsBackground = 'transparent';

        toolsHeight = BASE_LINEHEIGHT;
        borderRight = '';
        fontSize = statusLineFontSize;
        toolbarFontSize = DEFAULT_FONT_SIZE;
        statusMaxWidth = DEFAULT_BAR_WIDTH;
        toolsPMaxwidth = DEFAULT_BAR_WIDTH * .9;
        margin = SPACE * 2;
        toolsMargin = 2 * SPACE;

        musicBtnRight = (clientWidth-gameGroupWidth)/2;
        musicBtnBottom = (clientHeight-gameGroupHeight)/2 - 27;
    }

    var unit = 'px'
    core.domStyle.styles = [
        {
            id: 'gameGroup',
            rules:{
                width: gameGroupWidth + unit,
                height: gameGroupHeight + unit,
                top: (clientHeight-gameGroupHeight)/2 + unit,
                left: (clientWidth-gameGroupWidth)/2 + unit,
            }
        },
        {
            className: 'gameCanvas',
            rules:{
                width: (canvasWidth - SPACE*2) + unit,
                height: (canvasWidth - SPACE*2) + unit,
            }
        },
        {
            id: 'statusCanvas',
            rules: {
                width: (statusCanvasWidth - SPACE*2) + unit,
                height: (statusCanvasHeight - SPACE) + unit,
                display: statusCanvas?'block':'none'
            }
        },
        {
            id: 'gif',
            rules: {
                width: (canvasWidth - SPACE*2) + unit,
                height:(canvasWidth - SPACE*2) + unit,
            }
        },
        {
            id: 'gif2',
            rules: {
                width: (canvasWidth - SPACE*2) + unit,
                height:(canvasWidth - SPACE*2) + unit,
            }
        },
        {
            id: 'gameDraw',
            rules: {
                width: (canvasWidth - SPACE*2) + unit,
                height:(canvasWidth - SPACE*2) + unit,
                top: canvasTop + unit,
                right: 0,
                border: statusBarBorder
            }
        },
        {
            id: 'floorMsgGroup',
            rules:{
                width: (canvasWidth - SPACE*2) + unit,
                height: (gameGroupHeight - SPACE*2) + unit,
                top: SPACE + unit,
                right: SPACE + unit,
                background: (core.status.globalAttribute||core.initStatus.globalAttribute).floorChangingBackground,
                color: (core.status.globalAttribute||core.initStatus.globalAttribute).floorChangingTextColor
            }
        },
        {
            id: 'statusBar',
            rules:{
                width: statusBarWidth + unit,
                height: statusBarHeight + unit,
                top: 0,
                left: 0,
                padding: SPACE + unit,

                borderTop: statusBarBorder,
                borderLeft: statusBarBorder,
                borderRight: borderRight,
                fontSize: fontSize + unit,
                background: statusBackground
            }
        },
        {
            className: 'status',
            rules:{
                width: '100%',
                maxWidth: statusMaxWidth + unit,
                height: statusHeight + unit,
                margin: margin/2 + unit,
                display: !statusCanvas?'block':'none'
            }
        },
        {
            className: 'statusLabels',
            rules:{
                marginLeft: margin + unit,
                lineHeight: statusLabelsLH + unit
            }
        },
        {
            className: 'statusTexts',
            rules: {
                color: (core.status.globalAttribute||core.initStatus.globalAttribute).statusBarColor
            }
        },
        {
            id: 'toolBar',
            rules:{
                width: toolBarWidth + unit,
                height: toolBarHeight + unit,
                top: toolBarTop +unit,
                left: 0,
                padding: SPACE + unit,
                borderBottom: toolBarBorder,
                borderLeft: toolBarBorder,
                borderRight: borderRight,
                fontSize: toolbarFontSize + unit,
                background: toolsBackground,
            }
        },
        {
            className: 'tools',
            rules:{
                height: toolsHeight + unit,
                maxWidth: toolsPMaxwidth + unit,
                marginLeft: toolsMargin + unit,
                marginTop: margin + unit,
            }
        },
        {
            imgId: 'keyboard',
            rules:{
                display: core.domStyle.isVertical && core.domStyle.showStatusBar
            }
        },
        {
            id: 'hard',
            rules: {
                lineHeight: toolsHeight + unit,
                color: (core.status.globalAttribute||core.initStatus.globalAttribute).hardLabelColor
            }
        },
        {
            id: 'musicBtn',
            rules: {
                display: 'block',
                right: musicBtnRight + unit,
                bottom: musicBtnBottom + unit
            }
        }
    ]
    for (var i = 0; i < core.dom.status.length; ++i) {
        var id = core.dom.status[i].id;
        core.domStyle.styles.push({
            id: id,
            rules: {
                display: toDraw.indexOf(id.substring(0, id.length-3))>=0 && !statusCanvas ? "block": "none"
            }
        });
    }

    core.domRenderer();
    this.setToolbarButton();

    if (core.domStyle.isVertical) {
        core.dom.statusCanvas.width = 416;
        core.dom.statusCanvas.height = col * BASE_LINEHEIGHT + SPACE + 6;
    }
    else {
        core.dom.statusCanvas.width = 129;
        core.dom.statusCanvas.height = 416;
    }
    this.setMusicBtn();
    if (core.isPlaying())
        core.updateStatusBar();
}

////// 渲染DOM //////
control.prototype.domRenderer = function(){

    core.dom.statusBar.style.display = 'block';
    core.dom.toolBar.style.display = 'block';

    var styles = core.domStyle.styles;

    for(var i=0; i<styles.length; i++){
        if(styles[i].hasOwnProperty('rules')){
            var rules = styles[i].rules;
            var rulesProp = Object.keys(rules);

            if(styles[i].hasOwnProperty('className')){
                var className = styles[i].className
                for(var j=0; j<core.dom[className].length; j++)
                    for(var k=0; k<rulesProp.length; k++) {
                        core.dom[className][j].style[rulesProp[k]] = rules[rulesProp[k]];
                    }
            }
            if(styles[i].hasOwnProperty('id')){
                var id = styles[i].id;

                for(var j=0; j<rulesProp.length; j++)
                    core.dom[id].style[rulesProp[j]] = rules[rulesProp[j]];
            }
            if(styles[i].hasOwnProperty('imgId')){
                var imgId = styles[i].imgId;

                for(var j=0; j<rulesProp.length; j++)
                    core.statusBar.image[imgId].style[rulesProp[j]] = rules[rulesProp[j]];
            }
        }

    }
    // resize map
    if (core.isPlaying() && core.isset(core.status) && core.isset(core.bigmap)) {
        core.bigmap.canvas.forEach(function(cn){
            core.canvas[cn].canvas.style.width = core.bigmap.width*32*core.domStyle.scale + "px";
            core.canvas[cn].canvas.style.height = core.bigmap.height*32*core.domStyle.scale + "px";
        });
    }
    // 动态canvas
    for (var name in core.dymCanvas) {
        var ctx = core.dymCanvas[name], canvas = ctx.canvas;
        canvas.style.width = canvas.width * core.domStyle.scale + "px";
        canvas.style.height = canvas.height * core.domStyle.scale + "px";
        canvas.style.left = parseFloat(canvas.getAttribute("_left")) * core.domStyle.scale + "px";
        canvas.style.top = parseFloat(canvas.getAttribute("_top")) * core.domStyle.scale + "px";
    }
}