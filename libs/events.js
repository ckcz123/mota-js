"use strict";

function events() {
    this.init();
}

////// 初始化 //////
events.prototype.init = function () {
    this.eventdata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.events;
    this.events = {
        'battle': function (data, core, callback) {
            // 正在执行自定义事件：不允许战斗
            if (core.status.event.id == 'action') {
                if (core.isset(callback)) callback();
                return;
            }
            core.battle(data.event.id, data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        'getItem': function (data, core, callback) {
            core.getItem(data.event.id, 1, data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        'openDoor': function (data, core, callback) {
            // 正在执行自定义事件：不允许开门
            if (core.status.event.id == 'action') {
                if (core.isset(callback)) callback();
                return;
            }
            core.openDoor(data.event.id, data.x, data.y, true, function () {
                if (core.isset(callback)) callback();
                core.replay();
            });
        },
        'changeFloor': function (data, core, callback) {
            // 正在执行自定义事件：不允许切换楼层
            if (core.status.event.id == 'action') {
                if (core.isset(callback)) callback();
                return;
            }
            var heroLoc = {};
            if (core.isset(data.event.data.loc))
                heroLoc = {'x': data.event.data.loc[0], 'y': data.event.data.loc[1]};
            if (core.isset(data.event.data.direction))
                heroLoc.direction = data.event.data.direction;
            if (core.status.event.id!='action') core.status.event.id=null;
            core.changeFloor(data.event.data.floorId, data.event.data.stair,
                heroLoc, data.event.data.time, function () {
                    if (core.isset(callback)) callback();
                    core.replay();
                });
        },
        'passNet': function (data, core, callback) {
            core.events.passNet(data);
            if (core.isset(callback))
                callback();
        },
        "changeLight": function (data, core, callback) {
            core.events.changeLight(data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        "ski": function (data, core, callback) {
            core.events.ski();
            if (core.isset(callback))
                callback();
        },
        "pushBox": function (data, core, callback) {
            core.events.pushBox(data);
            if (core.isset(callback))
                callback();
        },
        'action': function (data, core, callback) {
            var ev = core.clone(data.event.data), ex = data.x, ey = data.y;
            // 检查是否需要改变朝向
            if (ex == core.nextX() && ey == core.nextY()) {
                var dir = {"up":"down","down":"up","left":"right","right":"left"}[core.getHeroLoc('direction')];
                var id = data.event.id, toId = (data.event.faceIds||{})[dir];
                if (core.isset(toId) && id!=toId) {
                    var number = core.maps.getNumberById(toId);
                    if (number>0)
                        core.setBlock(number, ex, ey);
                }
            }
            core.events.insertAction(ev, ex, ey, callback);
        }
    }
}

////// 获得一个或所有系统事件类型 //////
events.prototype.getEvents = function (eventName) {
    if (!core.isset(eventName)) {
        return this.events;
    }
    return this.events[eventName];
}

events.prototype.initGame = function () {
    return this.eventdata.initGame();
}

////// 游戏开始事件 //////
events.prototype.startGame = function (hard, seed, route, callback) {

    main.dom.levelChooseButtons.style.display='none';
    main.dom.startButtonGroup.style.display='none';

    var start = function () {
        console.log('开始游戏');
        core.resetStatus(core.firstData.hero, hard, null, null, core.initStatus.maps);
        var nowLoc = core.clone(core.getHeroLoc());
        core.setHeroLoc('x', -1);
        core.setHeroLoc('y', -1);

        if (core.isset(seed)) {
            core.setFlag('__seed__', seed);
            core.setFlag('__rand__', seed);
        }
        else core.utils.__init_seed();

        core.clearMap('all');
        core.deleteAllCanvas();
        core.clearStatusBar();

        var post_start = function () {

            core.control.triggerStatusBar('show');
            core.dom.musicBtn.style.display = 'none';

            core.changeFloor(core.firstData.floorId, null, nowLoc, null, function() {
                if (core.isset(callback)) callback();
            });

            setTimeout(function () {
                // Upload
                var formData = new FormData();
                formData.append('type', 'people');
                formData.append('name', core.firstData.name);
                formData.append('version', core.firstData.version);
                formData.append('platform', core.platform.isPC?"PC":core.platform.isAndroid?"Android":core.platform.isIOS?"iOS":"");
                formData.append('hard', core.encodeBase64(core.status.hard));
                formData.append('hardCode', core.getFlag('hard', 0));
                formData.append('base64', 1);

                core.utils.http("POST", "/games/upload.php", formData);
            })
        }

        var real_start = function () {
            core.insertAction(core.clone(core.firstData.startText), null, null, function() {
                if (!core.flags.startUsingCanvas && !core.isReplaying() && core.flags.showBattleAnimateConfirm) { // 是否提供“开启战斗动画”的选择项
                    core.status.event.selection = core.flags.battleAnimate ? 0 : 1;
                    core.ui.drawConfirmBox("你想开启战斗动画吗？\n之后可以在菜单栏中开启或关闭。\n（强烈建议新手开启此项）", function () {
                        core.flags.battleAnimate = true;
                        core.setLocalStorage('battleAnimate', true);
                        post_start();
                    }, function () {
                        core.flags.battleAnimate = false;
                        core.setLocalStorage('battleAnimate', false);
                        post_start();
                    });
                }
                else {
                    post_start();
                }
            });
        }

        if (core.flags.startUsingCanvas) {
            core.control.triggerStatusBar('hide');
            core.dom.musicBtn.style.display = 'block';
            
            core.insertAction(core.clone(core.firstData.startCanvas), null, null, function() {
                real_start();
            });
        }
        else {
            core.events.setInitData(hard);
            real_start();
        }

        if (core.isset(route)) {
            core.startReplay(route);
        }

    }

    if (main.mode!='play') return;

    if (core.flags.startUsingCanvas) {
        core.dom.startPanel.style.display = 'none';
        start();
        return;
    }

    if (core.isset(route)) {
        core.dom.startPanel.style.display = 'none';
        start();
    }
    else {
        core.hideStartAnimate(function() {
            start();
        })
    }
}

////// 不同难度分别设置初始属性 //////
events.prototype.setInitData = function (hard) {
    return this.eventdata.setInitData(hard);
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

    // 下载录像
    var confirmDownload = function () {

        core.ui.closePanel();
        core.ui.drawConfirmBox("你想下载录像吗？", function () {
            var obj = {
                'name': core.firstData.name,
                'version': core.firstData.version,
                'hard': core.status.hard,
                'seed': core.getFlag('__seed__'),
                'route': core.encodeRoute(core.status.route)
            }
            core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5route", JSON.stringify(obj));
            core.restart();
        }, function () {
            core.restart();
        })

    }

    // 上传成绩
    var confirmUpload = function () {

        core.ui.closePanel();

        if (!core.isset(ending)) {
            confirmDownload();
            return;
        }

        var doUpload = function(username) {
            var hp = core.status.hero.hp;
            if (username==undefined) hp = 1;

            // upload
            var formData = new FormData();
            formData.append('type', 'score');
            formData.append('name', core.firstData.name);
            formData.append('version', core.firstData.version);
            formData.append('platform', core.platform.isPC?"PC":core.platform.isAndroid?"Android":core.platform.isIOS?"iOS":"");
            formData.append('hard', core.encodeBase64(core.status.hard));
            formData.append('username', core.encodeBase64(username||""));
            formData.append('ending', core.encodeBase64(ending));
            formData.append('lv', core.status.hero.lv);
            formData.append('hp', Math.min(hp, Math.pow(2, 63)));
            formData.append('atk', core.status.hero.atk);
            formData.append('def', core.status.hero.def);
            formData.append('mdef', core.status.hero.mdef);
            formData.append('money', core.status.hero.money);
            formData.append('experience', core.status.hero.experience);
            formData.append('steps', core.status.hero.steps);
            formData.append('norank', norank||0);
            formData.append('seed', core.getFlag('__seed__'));
            formData.append('totalTime', Math.floor(core.status.hero.statistics.totalTime/1000));
            formData.append('route', core.encodeRoute(core.status.route));
            formData.append('base64', 1);

            if (main.isCompetition)
                core.http("POST", "/games/competition/upload.php", formData);
            else
                core.http("POST", "/games/upload.php", formData);

            setTimeout(function() {
                confirmDownload();
            }, 150);
        }

        core.ui.drawConfirmBox("你想记录你的ID和成绩吗？", function () {
            if (main.isCompetition) {
                doUpload("");
            }
            else {
                doUpload(prompt("请输入你的ID：", core.getCookie('id')||""));
            }
        }, function () {
            if (main.isCompetition)
                confirmDownload();
            else
                doUpload(undefined);
        })

        return;
    }

    if (fromReplay) {
        core.drawText("录像回放完毕！", function () {
            core.restart();
        });
    }
    else {

        if (core.hasFlag('debug')) {
            core.drawText("\t[系统提示]调试模式下无法上传成绩", function () {
                core.restart();
            })
        }
        else if (core.hasFlag('consoleOpened')) {
            core.drawText("\t[系统提示]本存档开启过控制台，无法上传成绩", function () {
                core.restart();
            })
        }
        else {
            confirmUpload();
        }

    }

}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId, fromLoad) {
    if (main.mode!='play') return;
    return this.eventdata.afterChangeFloor(floorId, fromLoad);
}

////// 开始执行一系列自定义事件 //////
events.prototype.doEvents = function (list, x, y, callback) {
    if (!core.isset(list)) return;
    if (!(list instanceof Array)) {
        list = [list];
    }

    core.status.event = {'id': 'action', 'data': {
        'list': [
            {"todo": core.clone(list), "total": core.clone(list), "condition": "false"}
        ], 'x': x, 'y': y, 'callback': callback
    }}

    // 停止勇士
    core.waitHeroToStop(function() {
        core.lockControl();
        core.events.doAction();
    });
}

////// 执行当前自定义事件列表中的下一个事件 //////
events.prototype.doAction = function() {
    // 清空boxAnimate和UI层
    core.status.boxAnimateObjs = [];
    clearInterval(core.status.event.interval);
    core.status.event.interval = null;

    core.clearLastEvent();

    // 事件处理完毕
    if (core.status.event.data.list.length==0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel();
        if (core.isset(callback))
            callback();
        core.replay();
        return;
    }

    var x=core.status.event.data.x, y=core.status.event.data.y;
    var prefix = [core.status.floorId||"f", x||"x", y||"y"].join("@");

    var current = core.status.event.data.list[0];
    if (current.todo.length == 0) { // current list is empty
        if (core.calValue(current.condition, prefix)) { // check condition
            current.todo = core.clone(current.total);
        }
        else {
            core.status.event.data.list.shift(); // remove stackc
        }
        this.doAction();
        return;
    }
    var data = current.todo.shift();
    core.status.event.data.current = data;

    // 不同种类的事件

    // 如果是文字：显示
    if (typeof data == "string") {
        core.status.event.data.type='text';
        // 如果是正在回放中，不显示
        if (core.isReplaying())
            core.events.doAction();
        else
            core.ui.drawTextBox(data);
        return;
    }
    core.status.event.data.type=data.type;
    switch (data.type) {
        case "text": // 文字/对话
            if (core.isReplaying())
                core.events.doAction();
            else
                core.ui.drawTextBox(data.text, data.showAll);
            break;
        case "autoText":
            if (core.isReplaying())
                core.events.doAction();
            else {
                core.ui.drawTextBox(data.text);
                setTimeout(function () {
                    core.events.doAction();
                }, data.time || 3000);
            }
            break;
        case "scrollText": // 滚动剧情文本
            if (core.isReplaying())
                core.events.doAction();
            else {
                var content = core.replaceText(data.text);
                var time = data.time || 5000;
                if (data.async) {
                    core.ui.drawScrollText(content, time);
                    core.events.doAction();
                }
                else {
                    core.ui.drawScrollText(content, time, function() {
                        core.events.doAction();
                    });
                }
            }
            break;
        case "comment":
            this.doAction();
            break;
        case "setText": // 设置文本状态
            ["position", "offset", "bold", "titlefont", "textfont", "time"].forEach(function (t) {
                if (core.isset(data[t])) core.status.textAttribute[t]=data[t];
            });
            ["background", "title", "text"].forEach(function (t) {
                if (core.isset(data[t]) && (data[t] instanceof Array) && data[t].length>=3) {
                    if (data[t].length==3) data[t].push(1);
                    core.status.textAttribute[t]=data[t];
                }
                if (t=='background' && core.isset(data[t])) {
                    var img = core.material.images.images[data[t]];
                    if (core.isset(img) && img.width==192 && img.height==128) {
                        core.status.textAttribute[t]=data[t];
                    }
                }
            });
            core.setFlag('textAttribute', core.status.textAttribute);
            core.events.doAction();
            break;
        case "tip":
            core.drawTip(core.replaceText(data.text));
            core.events.doAction();
            break;
        case "show": // 显示
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                    && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0], prefix), core.calValue(data.loc[1], prefix)]];
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                if (data.async) {
                    core.animateBlock(data.loc, 'show', data.time);
                    this.doAction();
                }
                else {
                    core.animateBlock(data.loc,'show', data.time, function () {
                        core.events.doAction();
                    });
                }
            }
            else {
                data.loc.forEach(function (t) {
                    core.showBlock(t[0],t[1],data.floorId);
                })
                this.doAction();
            }
            break;
        case "hide": // 消失
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0], prefix), core.calValue(data.loc[1], prefix)]];
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                data.loc.forEach(function (t) {
                    core.hideBlock(t[0],t[1],data.floorId);
                });
                if (data.async) {
                    core.animateBlock(data.loc, 'hide', data.time);
                    this.doAction();
                }
                else {
                    core.animateBlock(data.loc,'hide', data.time, function () {
                        core.events.doAction();
                    });
                }
            }
            else {
                data.loc.forEach(function (t) {
                    core.removeBlock(t[0],t[1],data.floorId)
                })
                this.doAction();
            }
            break;
        case "setBlock": // 设置某图块
            {
                if (core.isset(data.loc)) {
                    x=core.calValue(data.loc[0], prefix);
                    y=core.calValue(data.loc[1], prefix);
                }
                core.setBlock(data.number, x, y, data.floorId);
                this.doAction();
                break;
            }
        case "showFloorImg": // 显示贴图
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0], prefix), core.calValue(data.loc[1], prefix)]];
            core.maps.setFloorImage("show", data.loc, data.floorId, function() {
                core.events.doAction();
            })
            break;
        case "hideFloorImg": // 隐藏贴图
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0], prefix), core.calValue(data.loc[1], prefix)]];
            core.maps.setFloorImage("hide", data.loc, data.floorId, function() {
                core.events.doAction();
            })
            break;
        case "showBgFgMap": // 显示图层块
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0], prefix), core.calValue(data.loc[1], prefix)]];
            core.maps.setBgFgMap("show", data.name, data.loc, data.floorId, function() {
                core.events.doAction();
            })
            break;
        case "hideBgFgMap": // 隐藏图层块
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0], prefix), core.calValue(data.loc[1], prefix)]];
            core.maps.setBgFgMap("hide", data.name, data.loc, data.floorId, function() {
                core.events.doAction();
            })
            break;
        case "setBgFgBlock": // 设置图层块
            {
                if (core.isset(data.loc)) {
                    x=core.calValue(data.loc[0], prefix);
                    y=core.calValue(data.loc[1], prefix);
                }
                core.setBgFgBlock(data.name, data.number, x, y, data.floorId);
                this.doAction();
                break;
            }
        case "follow": // 跟随
            if (core.isset(core.material.images.images[data.name])
                && core.material.images.images[data.name].width==128) {
                if (!core.isset(core.status.hero.followers))
                    core.status.hero.followers = [];
                core.status.hero.followers.push({"img": data.name});
                core.control.gatherFollowers();
                core.clearMap('hero');
                core.drawHero();
            }
            this.doAction();
            break;
        case "unfollow": // 取消跟随
            if (core.isset(core.status.hero.followers)) {
                var remove = false;
                if (!core.isset(data.name) && core.status.hero.followers.length>0) {
                    core.status.hero.followers = [];
                    remove=true;
                }
                if (core.isset(data.name)) {
                    for (var i=0;i<core.status.hero.followers.length;i++) {
                        if (core.status.hero.followers[i].img == data.name) {
                            core.status.hero.followers.splice(i, 1);
                            remove=true;
                            break;
                        }
                    }
                }
                if (remove) {
                    core.control.gatherFollowers();
                    core.clearMap('hero');
                    core.drawHero();
                }
            }
            this.doAction();
            break;
        case "animate": // 显示动画
            if (core.isset(data.loc)) {
                if (data.loc == 'hero') {
                    x=core.getHeroLoc('x');
                    y=core.getHeroLoc('y');
                }
                else if (data.loc instanceof Array) {
                    x=core.calValue(data.loc[0], prefix);
                    y=core.calValue(data.loc[1], prefix);
                }
            }
            if (data.async) {
                core.drawAnimate(data.name, x, y);
                core.events.doAction();
            }
            else {
                core.drawAnimate(data.name, x, y, function () {
                    core.events.doAction();
                })
            }
            break;
        case "move": // 移动事件
            if (core.isset(data.loc)) {
                x=core.calValue(data.loc[0], prefix);
                y=core.calValue(data.loc[1], prefix);
            }
            if (data.async) {
                core.moveBlock(x,y,data.steps,data.time,data.keep);
                this.doAction();
            }
            else {
                core.moveBlock(x,y,data.steps,data.time,data.keep,function() {
                    core.events.doAction();
                })
            }
            break;
        case "moveHero":
            if (data.async) {
                core.eventMoveHero(data.steps, data.time);
                this.doAction();
            }
            else {
                core.eventMoveHero(data.steps,data.time,function() {
                    core.events.doAction();
                });
            }
            break;
        case "jump": // 跳跃事件
            {
                var sx=x, sy=y, ex=x,ey=y;
                if (core.isset(data.from)) {
                    sx=core.calValue(data.from[0], prefix);
                    sy=core.calValue(data.from[1], prefix);
                }
                if (core.isset(data.to)) {
                    ex=core.calValue(data.to[0], prefix);
                    ey=core.calValue(data.to[1], prefix);
                }
                if (data.async) {
                    core.jumpBlock(sx,sy,ex,ey,data.time,data.keep);
                    this.doAction();
                }
                else {
                    core.jumpBlock(sx,sy,ex,ey,data.time,data.keep,function() {
                        core.events.doAction();
                    });
                }
                break;
            }
        case "jumpHero":
            {
                var ex=core.status.hero.loc.x, ey=core.status.hero.loc.y;
                if (core.isset(data.loc)) {
                    ex=core.calValue(data.loc[0], prefix);
                    ey=core.calValue(data.loc[1], prefix);
                }
                if (data.async) {
                    core.jumpHero(ex,ey,data.time);
                    this.doAction();
                }
                else {
                    core.jumpHero(ex,ey,data.time,function() {
                        core.events.doAction();
                    });
                }
                break;
            }
        case "changeFloor": // 楼层转换
            {
                var heroLoc = {"x": core.calValue(data.loc[0], prefix), "y": core.calValue(data.loc[1], prefix)};
                if (core.isset(data.direction)) heroLoc.direction=data.direction;
                core.changeFloor(data.floorId||core.status.floorId, null, heroLoc, data.time, function() {
                    core.lockControl();
                    core.events.doAction();
                });
                break;
            }
        case "changePos": // 直接更换勇士位置，不切换楼层
            core.clearMap('hero');
            if (core.isset(data.loc)) {
                core.setHeroLoc('x', core.calValue(data.loc[0], prefix));
                core.setHeroLoc('y', core.calValue(data.loc[1], prefix));
            }
            if (core.isset(data.direction)) core.setHeroLoc('direction', data.direction);
            core.drawHero();
            this.doAction();
            break;
        case "showImage": // 显示图片
            if (!core.isset(data.loc)) data.loc=[0, 0];
            if (core.isReplaying()) {
                data.time = 0;
            }
            var image = core.material.images.images[data.image];
            if (!core.isset(image)) {
                this.doAction();
                break;
            }
            if (data.async || data.time == 0) {
                core.events.showImage(data.code, image, data.loc[0], data.loc[1], data.dw, data.dh, data.opacity, data.time);
                this.doAction();
            }
            else {
                core.events.showImage(data.code, image, data.loc[0], data.loc[1], data.dw, data.dh, data.opacity, data.time, function () {
                    core.events.doAction();
                });
            }
            break;
        case "showTextImage": // 显示图片化文本
            if (!core.isset(data.loc)) data.loc=[0, 0];
            if (core.isReplaying()) {
                data.time = 0;
            }
            var content = core.replaceText(data.text);
            var image = core.events.textImage(content);
            if (data.async || data.time == 0) {
                core.events.showImage(data.code, image, data.loc[0], data.loc[1], 100, 100, data.opacity, data.time);
                this.doAction();
            }
            else {
                core.events.showImage(data.code, image, data.loc[0], data.loc[1], 100, 100, data.opacity, data.time, function() {
                    core.events.doAction();
                });
            }
            break;
        case "hideImage": // 隐藏图片
            if (core.isReplaying()) {
                data.time = 0;
            }
            if (data.async || data.time == 0) {
                core.events.hideImage(data.code, data.time);
                this.doAction();
            }
            else {
                core.events.hideImage(data.code, data.time, function () {
                    core.events.doAction();
                });
            }
            break;
        case "showGif": // 显示动图
            if (core.isset(data.loc) && core.isset(core.material.images.images[data.name])) {
                var gif = new Image();
                gif.src = core.material.images.images[data.name].src;
                gif.style.position = 'absolute';
                gif.style.left = (core.calValue(data.loc[0], prefix)*core.domStyle.scale)+"px";
                gif.style.top = (core.calValue(data.loc[1], prefix)*core.domStyle.scale)+"px";
                gif.style.width = core.material.images.images[data.name].width*core.domStyle.scale+"px";
                gif.style.height = core.material.images.images[data.name].height*core.domStyle.scale+"px";
                core.dom.gif2.appendChild(gif);
            }
            else {
                core.dom.gif2.innerHTML = "";
            }
            this.doAction();
            break;
        case "moveImage": // 图片移动
            if (core.isReplaying()) { // 正在播放录像
                this.doAction();
            }
            else {
                if (data.async) {
                    core.events.moveImage(data.code, data.to, data.opacity, data.time);
                    this.doAction();
                }
                else {
                    core.events.moveImage(data.code, data.to, data.opacity, data.time, function() {
                        core.events.doAction();
                    });
                }
            }
            break;
        case "setFg": // 颜色渐变
            if (data.async) {
                core.setFg(data.color, data.time);
                core.setFlag('__color__', data.color||null);
                this.doAction();
            }
            else {
                core.setFg(data.color, data.time, function() {
                    core.setFlag('__color__', data.color||null);
                    core.events.doAction();
                });
            }
            break;
        case "screenFlash": // 画面闪烁
            if (data.async) {
                core.screenFlash(data.color, data.time, data.times);
                this.doAction();
            }
            else {
                core.screenFlash(data.color, data.time, data.times, function() {
                    core.events.doAction();
                });
            }
            break;
        case "setWeather": // 更改天气
            core.setWeather(data.name, data.level);
            if (data.name=='rain' || data.name=='snow' || data.name=='fog')
                core.setFlag('__weather__', [data.name, data.level]);
            else core.removeFlag('__weather__');
            this.doAction();
            break;
        case "openDoor": // 开一个门，包括暗墙
            {
                if (core.isset(data.loc)) {
                    x = core.calValue(data.loc[0], prefix);
                    y = core.calValue(data.loc[1], prefix);
                }
                var floorId=data.floorId || core.status.floorId;
                if (floorId==core.status.floorId)
                    core.openDoor(null, x, y, false, function() {
                        core.lockControl();
                        core.events.doAction();
                    })
                else {
                    core.removeBlock(x, y, floorId);
                    this.doAction();
                }
                break;
            }
        case "openShop": // 打开一个全局商店
            if (core.isReplaying()) { // 正在播放录像，简单将visited置为true
                core.status.shops[data.id].visited=true;
                core.status.event.data.list = [];
                this.doAction();
            }
            else
                core.events.openShop(data.id);
            break;
        case "disableShop": // 禁用一个全局商店
            core.events.disableQuickShop(data.id);
            this.doAction();
            break;
        case "battle": // 强制战斗
            core.battle(data.id,null,null,true,function() {
                core.events.doAction();
            })
            break;
        case "trigger": // 触发另一个事件；当前事件会被立刻结束。需要另一个地点的事件是有效的
            {
                var toX=core.calValue(data.loc[0], prefix), toY=core.calValue(data.loc[1], prefix);
                var block=core.getBlock(toX, toY);
                if (block!=null) {
                    block = block.block;
                    if (core.isset(block.event) && block.event.trigger=='action') {
                        // 触发
                        core.status.event.data.list = [
                            {"todo": core.clone(block.event.data), "total": core.clone(block.event.data), "condition": "false"}
                        ];
                        core.status.event.data.x=block.x;
                        core.status.event.data.y=block.y;
                    }
                }
                this.doAction();
                break;
            }
        case "insert":
            {
                var toX=core.calValue(data.loc[0], prefix), toY=core.calValue(data.loc[1], prefix);
                var floorId = data.floorId || core.status.floorId;
                var event = core.floors[floorId].events[toX+","+toY];
                if (core.isset(event)) core.insertAction(event);
                this.doAction();
                break;
            }
        case "playSound":
            if (!core.isReplaying())
                core.playSound(data.name);
            this.doAction();
            break;
        case "playBgm":
            core.playBgm(data.name);
            this.doAction();
            break;
        /*
        case "pauseBgm":
            core.pauseBgm();
            this.doAction();
            break
        case "resumeBgm":
            core.resumeBgm();
            this.doAction();
            break
            */
        case "loadBgm":
            if (core.platform.isPC)
                core.loadBgm(data.name);
            this.doAction();
            break;
        case "freeBgm":
            core.freeBgm(data.name);
            this.doAction();
            break;
        case "setVolume":
            data.value = core.clamp(parseInt(data.value)/100, 0, 1);
            core.setFlag("__volume__", data.value);
            if (data.async) {
                this.setVolume(data.value, data.time);
                this.doAction();
            }
            else {
                this.setVolume(data.value, data.time, function() {
                    core.events.doAction();
                });
            }
            break;
        case "setValue":
            try {
                var value=core.calValue(data.value, prefix);
                // 属性
                if (data.name.indexOf("status:")==0) {
                    core.setStatus(data.name.substring(7), value);
                    if (core.status.hero.hp<=0) {
                        core.status.hero.hp=0;
                        core.updateStatusBar();
                        core.events.lose();
                        break;
                    }
                }
                // 道具
                if (data.name.indexOf("item:")==0) {
                    value=parseInt(value);
                    var itemId=data.name.substring(5);
                    if (value>core.itemCount(itemId)) // 效果
                        core.getItem(itemId,value-core.itemCount(itemId));
                    else core.setItem(itemId, value);
                }
                // flag
                if (data.name.indexOf("flag:")==0) {
                    core.setFlag(data.name.substring(5), value);
                }
                // switch
                if (data.name.indexOf("switch:")==0) {
                    core.setFlag((prefix||"global")+"@"+data.name.substring(7), value);
                }
            }
            catch (e) {console.log(e)}
            core.updateStatusBar();
            this.doAction();
            break;
        case "setFloor":
            core.status.maps[data.floorId||core.status.floorId][data.name] = core.calValue(data.value, prefix);
            core.updateStatusBar();
            this.doAction();
            break;
        case "setGlobalAttribute":
            if (typeof data.value == 'string') {
                if ((data.value.charAt(0)=='"' && data.value.charAt(data.value.length-1)=='"')
                    || (data.value.charAt(0)=="'" && data.value.charAt(data.value.length-1)=="'"))
                    data.value = data.value.substring(1, data.value.length-1);
            }
            core.status.globalAttribute[data.name] = data.value;
            core.control.updateGlobalAttribute(data.name);
            core.setFlag('globalAttribute', core.status.globalAttribute);
            this.doAction();
            break;
        case "setGlobalValue":
            core.values[data.name] = data.value;
            this.doAction();
            break;
        case "setGlobalFlag":
            {
                var flags = core.getFlag("globalFlags", {});
                flags[data.name] = data.value;
                core.flags[data.name] = data.value;
                core.setFlag("globalFlags", flags);
                core.resize();
                this.doAction();
                break;
            }
        case "setHeroIcon":
            {
                this.setHeroIcon(data.name);
                this.doAction();
                break;
            }
        case "input":
            {
                var value;
                if (core.isReplaying()) {
                    var action = core.status.replay.toReplay.shift();
                    if (action.indexOf("input:")==0 ) {
                        value=parseInt(action.substring(6));
                    }
                    else {
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                        return;
                    }
                }
                else {
                    core.interval.onDownInterval = 'tmp';
                    value = prompt(core.replaceText(data.text));
                }
                value = Math.abs(parseInt(value)||0);
                core.status.route.push("input:"+value);
                core.setFlag("input", value);
                this.doAction();
            }
            break;
        case "input2":
            {
                var value;
                if (core.isReplaying()) {
                    var action = core.status.replay.toReplay.shift();
                    try {
                        if (action.indexOf("input2:")!=0) throw new Error("Input2 Error. Current action: "+action);
                        value = core.decodeBase64(action.substring(7));
                    }
                    catch (e) {
                        console.log(e);
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                        return;
                    }
                }
                else {
                    core.interval.onDownInterval = 'tmp';
                    value = prompt(core.replaceText(data.text));
                    if (!core.isset(value)) value="";
                }
                core.status.route.push("input2:"+core.encodeBase64(value));
                core.setFlag("input", value);
                this.doAction();
            }
            break;
        case "if": // 条件判断
            if (core.calValue(data.condition, prefix))
                core.events.insertAction(data["true"])
            else
                core.events.insertAction(data["false"])
            this.doAction();
            break;
        case "switch": // 条件选择
            var key = core.calValue(data.condition, prefix)
            for (var i = 0; i < data.caseList.length; i++) {
                if (data.caseList[i]["case"]=="default" || core.calValue(data.caseList[i]["case"], prefix) == key) {
                    core.events.insertAction(data.caseList[i].action);
                    break;
                }
            }
            this.doAction();
            break;
        case "choices": // 提供选项
            if (core.isReplaying()) {
                if (core.status.replay.toReplay.length==0) { // 回放完毕
                    core.status.replay.replaying=false;
                    core.drawTip("录像回放完毕");
                }
                else {
                    var action = core.status.replay.toReplay.shift(), index;
                    if (action == 'turn') action = core.status.replay.toReplay.shift();
                    if (action.indexOf("choices:")==0 && ((index=parseInt(action.substring(8)))>=0) && index<data.choices.length) {
                            core.status.event.selection=index;
                            setTimeout(function () {
                                core.status.route.push("choices:"+index);
                                core.events.insertAction(data.choices[index].action);
                                core.events.doAction();
                            }, 750 / Math.max(1, core.status.replay.speed))
                    }
                    else {
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                    }
                }
            }
            core.ui.drawChoices(data.text, data.choices);
            break;
        case "while":
            if (core.calValue(data.condition, prefix)) {
                core.unshift(core.status.event.data.list,
                    {"todo": core.clone(data.data), "total": core.clone(data.data), "condition": data.condition}
                );
            }
            this.doAction();
            break;
        case "break":
            core.status.event.data.list.shift();
            this.doAction();
            break;
        case "continue":
            if (core.calValue(core.status.event.data.list[0].condition, prefix)) {
                core.status.event.data.list[0].todo = core.clone(core.status.event.data.list[0].total);
            }
            else {
                core.status.event.data.list.shift();
            }
            this.doAction();
            break;
        case "win":
            core.events.win(data.reason, data.norank);
            break;
        case "lose":
            core.events.lose(data.reason);
            break;
        case "function":
            {
                var func = data["function"];
                try {
                    if (core.isset(func)) {
                        if ((typeof func == "string") && func.indexOf("function")==0) {
                            eval('('+func+')()');
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                if (!data.async)
                    this.doAction();
                break;
            }
        case "update":
            core.updateStatusBar();
            this.doAction();
            break;
        case "showStatusBar":
            core.control.triggerStatusBar("show");
            this.doAction();
            break;
        case "hideStatusBar":
            core.control.triggerStatusBar("hide", data.toolbox);
            this.doAction();
            break;
        case "updateEnemys":
            core.enemys.updateEnemys();
            core.updateStatusBar();
            this.doAction();
            break;
        case "vibrate":
            if (data.async) {
                core.events.vibrate(data.time);
                this.doAction();
            }
            else {
                core.events.vibrate(data.time, function () {
                    core.events.doAction();
                })
            }
            break;
        case "sleep": // 等待多少毫秒
            core.timeout.sleepTimeout = setTimeout(function() {
                core.timeout.sleepTimeout = null;
                core.events.doAction();
            }, core.isReplaying()?20:data.time);
            break;
        case "wait":
            if (core.isReplaying()) {
                var code = core.status.replay.toReplay.shift();
                if (code.indexOf("input:")==0) {
                    var value = parseInt(code.substring(6));
                    core.status.route.push("input:"+value);
                    if (value>=1000000) {
                        core.setFlag('type', 1);
                        var px = parseInt((value-1000000)/1000), py = value%1000;
                        core.setFlag('px', px);
                        core.setFlag('py', py);
                        core.setFlag('x', parseInt(px/32));
                        core.setFlag('y', parseInt(py/32));
                    }
                    else if (value>=10000) {
                        core.setFlag('type', 1);
                        var x = parseInt((value-10000)/100), y = value%100;
                        core.setFlag('px', 32*x+16);
                        core.setFlag('py', 32*y+16);
                        core.setFlag('x', x);
                        core.setFlag('y', y);
                    }
                    else {
                        core.setFlag('type', 0);
                        core.setFlag('keycode', value);
                    }
                    core.events.doAction();
                }
                else {
                    core.stopReplay();
                    core.drawTip("录像文件出错");
                }
            }
            break;
        case "waitAsync": // 等待所有异步事件执行完毕
            {
                var test = window.setInterval(function () {
                    if (Object.keys(core.animateFrame.asyncId).length==0) {
                        clearInterval(test);
                        core.events.doAction();
                    }
                }, 50);
                break;
            }
        case "revisit": // 立刻重新执行该事件
            {
                var block=core.getBlock(x,y); // 重新获得事件
                if (block!=null) {
                    block = block.block;
                    if (core.isset(block.event) && block.event.trigger=='action') {
                        core.status.event.data.list = [
                            {"todo": core.clone(block.event.data), "total": core.clone(block.event.data), "condition": "false"}
                        ];
                    }
                }
                this.doAction();
                break;
            }
        case "callBook": // 呼出怪物手册
            if (core.isReplaying() || !core.hasItem('book')) {
                this.doAction();
            }
            else {
                var e = core.clone(core.status.event.data);
                core.ui.closePanel();
                core.openBook();
                core.status.event.interval = e;
            }
            break;
        case "callSave": // 呼出存档页面
            if (core.isReplaying() || core.hasFlag("__events__")) {
                core.removeFlag("__events__");
                this.doAction();
            }
            else {
                var e = core.clone(core.status.event.data);
                core.ui.closePanel();
                core.save();
                core.status.event.interval = e;
            }
            break;
        case "callLoad": // 呼出读档页面
            if (core.isReplaying()) {
                this.doAction();
            }
            else {
                var e = core.clone(core.status.event.data);
                core.ui.closePanel();
                core.load();
                core.status.event.interval = e;
            }
            break;
        case "exit": // 立刻结束事件
            core.status.event.data.list = [];
            core.events.doAction();
            break;
        default:
            core.status.event.data.type='text';
            core.ui.drawTextBox("\t[警告]出错啦！\n"+data.type+" 事件不被支持...");
    }
    return;
}

////// 往当前事件列表之前添加一个或多个事件 //////
events.prototype.insertAction = function (action, x, y, callback) {
    if (core.hasFlag("__statistics__")) return;

    if (core.status.event.id != 'action') {
        this.doEvents(action, x, y, callback);
    }
    else {
        core.unshift(core.status.event.data.list[0].todo, action)
        if (core.isset(x)) core.status.event.data.x=x;
        if (core.isset(y)) core.status.event.data.y=y;
        if (core.isset(callback)) core.status.event.data.callback=callback;
    }
}

////// 恢复一个事件 //////
events.prototype.recoverEvents = function (data) {
    if (core.isset(data)) {
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

////// 获得面前的物品（轻按） //////
events.prototype.getNextItem = function() {
    if (!core.status.heroStop || !core.flags.enableGentleClick) return false;

    if (!core.canMoveHero()) return false;

    var nextX = core.nextX(), nextY = core.nextY();
    var block = core.getBlock(nextX, nextY);
    if (block==null) return false;
    if (block.block.event.trigger=='getItem') {
        core.getItem(block.block.event.id, 1, nextX, nextY);
        core.status.route.push("getNext");
        return true;
    }
    return false;
}

////// 获得某个物品 //////
events.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    itemNum=itemNum||1;
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

////// 开门 //////
events.prototype.openDoor = function (id, x, y, needKey, callback) {
    if (!core.isset(id)) id = core.getBlockId(x, y);

    // 是否存在门
    if (!core.terrainExists(x, y, id) || !(id.endsWith("Door") || id.endsWith("Wall"))
        || !core.isset(core.material.icons.animates[id])) {
        if (core.isset(callback)) callback();
        return;
    }
    if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
        core.status.automaticRoute.moveStepBeforeStop=core.status.automaticRoute.autoStepRoutes.slice(core.status.automaticRoute.autoStep-1,core.status.automaticRoute.autoStepRoutes.length);
        if (core.status.automaticRoute.moveStepBeforeStop.length>=1)core.status.automaticRoute.moveStepBeforeStop[0].step-=core.status.automaticRoute.movedStep;
    }

    var speed = id.endsWith("Wall")?70:30;

    if (needKey && id.endsWith("Door")) {
        var key = id.replace("Door", "Key");
        if (!core.hasItem(key)) {
            if (key != "specialKey")
                core.drawTip("你没有" + ((core.material.items[key]||{}).name||"钥匙"));
            else core.drawTip("无法开启此门");
            core.clearContinueAutomaticRoute();
            return;
        }
        core.autosave(true);
        core.removeItem(key);
    }

    // open
    core.playSound("door.mp3");
    var state = 0;
    var door = core.material.icons.animates[id];

    core.lockControl();
    core.stopHero();
    core.stopAutomaticRoute();
    core.status.replay.animate=true;
    core.removeGlobalAnimate(x,y);
    var animate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(animate);
            core.removeBlock(x, y);
            core.unLockControl();
            core.status.replay.animate=false;
            core.events.afterOpenDoor(id,x,y,callback);
            return;
        }
        core.clearMap('event', 32 * x, 32 * y, 32, 32);
        core.drawImage('event', core.material.images.animates, 32 * state, 32 * door, 32, 32, 32 * x, 32 * y, 32, 32);
    }, speed / core.status.replay.speed)
}

////// 战斗 //////
events.prototype.battle = function (id, x, y, force, callback) {
    if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
        core.status.automaticRoute.moveStepBeforeStop=core.status.automaticRoute.autoStepRoutes.slice(core.status.automaticRoute.autoStep-1,core.status.automaticRoute.autoStepRoutes.length);
        if (core.status.automaticRoute.moveStepBeforeStop.length>=1)core.status.automaticRoute.moveStepBeforeStop[0].step-=core.status.automaticRoute.movedStep;
    }
    core.stopHero();
    core.stopAutomaticRoute();

    if (!core.isset(id)) id = core.getBlockId(x, y);
    if (!core.isset(id)) {
        if (core.isset(callback)) callback();
        return;
    }

    // 非强制战斗
    if (!core.enemys.canBattle(id, x, y) && !force && !core.isset(core.status.event.id)) {
        core.drawTip("你打不过此怪物！");
        core.clearContinueAutomaticRoute();
        return;
    }

    if (!core.isset(core.status.event.id)) // 自动存档
        core.autosave(true);

    if (core.flags.battleAnimate&&!core.isReplaying()) {
        core.waitHeroToStop(function() {
            core.ui.drawBattleAnimate(id, function() {
                core.events.afterBattle(id, x, y, callback);
            });
        });
    }
    else {
        core.events.afterBattle(id, x, y, callback);
    }
}

////// 触发(x,y)点的事件 //////
events.prototype.trigger = function (x, y) {
    core.status.isSkiing = false;
    var mapBlocks = core.status.thisMap.blocks;
    var noPass;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && !mapBlocks[b].disable) { // 启用事件
            noPass = mapBlocks[b].event && mapBlocks[b].event.noPass;
            if (noPass) {
                core.clearAutomaticRouteNode(x, y);
            }
            if (core.isset(mapBlocks[b].event) && core.isset(mapBlocks[b].event.trigger)) {
                var trigger = mapBlocks[b].event.trigger;

                if (trigger == 'ski') core.status.isSkiing = true;

                // 转换楼层能否穿透
                if (trigger=='changeFloor' && !noPass) {
                    var canCross = core.flags.portalWithoutTrigger;
                    if (core.isset(mapBlocks[b].event.data) && core.isset(mapBlocks[b].event.data.portalWithoutTrigger))
                        canCross=mapBlocks[b].event.data.portalWithoutTrigger;
                    if (canCross) {
                        if (core.isReplaying()) {
                            if (core.status.replay.toReplay[0]=='no') {
                                core.status.replay.toReplay.shift();
                                core.status.route.push("no");
                                continue;
                            }
                        }
                        else if (core.status.automaticRoute.autoHeroMove || core.status.automaticRoute.autoStep<core.status.automaticRoute.autoStepRoutes.length) {
                            core.status.route.push("no");
                            continue;
                        }
                    }
                }
                core.status.automaticRoute.moveDirectly = false;
                core.material.events[trigger](mapBlocks[b], core, function (data) {

                });
            }
        }
    }
}

events.prototype.setFloorName = function (floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    // 根据文字判断是否斜体
    var floorName = core.status.maps[floorId].name || "";
    if (typeof floorName == 'number') floorName = ""+floorName;
    if (!core.isset(floorName) || floorName=="") floorName="&nbsp;"
    if (core.statusBar.floor.innerHTML == floorName) return;
    core.statusBar.floor.innerHTML = floorName;
    if (/^[+-]?\d+$/.test(floorName)) {
        core.statusBar.floor.style.fontStyle = 'italic';
        core.statusBar.floor.style.fontSize = '1.1em';
    }
    else {
        core.statusBar.floor.style.fontStyle = 'normal';
        if (floorName.length<=5)
            core.statusBar.floor.style.fontSize = '1.1em';
        else if (floorName.length==6)
            core.statusBar.floor.style.fontSize = '0.9em';
        else
            core.statusBar.floor.style.fontSize = '0.7em';
    }
}

////// 楼层切换 //////
events.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback, fromLoad) {

    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) {
        if (core.isset(callback)) callback();
        return;
    }

    if (floorId == ':before') {
        var index=core.floorIds.indexOf(core.status.floorId);
        if (index>0) floorId = core.floorIds[index-1];
        else floorId=core.status.floorId;
    }
    else if (floorId == ':next') {
        var index=core.floorIds.indexOf(core.status.floorId);
        if (index<core.floorIds.length-1) floorId = core.floorIds[index+1];
        else floorId=core.status.floorId;
    }
    if (main.mode!='play') time = 0;
    if (!core.isset(time)) time = core.values.floorChangeTime;
    if (!core.isset(time)) time = 800;

    var displayAnimate = time>=100 && !core.isReplaying();

    time /= 20;
    core.lockControl();
    core.stopHero();
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    core.status.replay.animate=true;
    core.dom.floorNameLabel.innerHTML = core.status.maps[floorId].title;
    if (!core.isset(stair) && !core.isset(heroLoc))
        heroLoc = core.clone(core.status.hero.loc);
    if (core.isset(stair)) {
        if (!core.isset(heroLoc)) heroLoc={};

        if (core.isset(core.status.maps[floorId][stair])) {
            heroLoc.x = core.status.maps[floorId][stair][0];
            heroLoc.y = core.status.maps[floorId][stair][1];
        }
        else {
            var blocks = core.status.maps[floorId].blocks;
            for (var i in blocks) {
                if (core.isset(blocks[i].event) && !blocks[i].disable && blocks[i].event.id === stair) {
                    heroLoc.x = blocks[i].x;
                    heroLoc.y = blocks[i].y;
                    break;
                }
            }
        }
        if (!core.isset(heroLoc.x)) {
            heroLoc.x=core.status.hero.loc.x;
            heroLoc.y=core.status.hero.loc.y;
        }
    }
    if (!core.isset(heroLoc.direction)) heroLoc.direction = core.status.hero.loc.direction;

    if (core.status.maps[floorId].canFlyTo && core.status.hero.flyRange.indexOf(floorId)<0) {
        core.status.hero.flyRange.push(floorId);
        core.status.hero.flyRange.sort(function (a, b) {
            return core.floorIds.indexOf(a) - core.floorIds.indexOf(b);
        })
    }

    window.setTimeout(function () {

        var changing = function () {

            core.events.eventdata.changingFloor(floorId, heroLoc, fromLoad);

            var changed = function () {
                core.unLockControl();
                core.status.replay.animate=false;
                core.events.afterChangeFloor(floorId, fromLoad);
                if (core.isset(callback)) callback();
            }
            if (displayAnimate) {
                core.hide(core.dom.floorMsgGroup, time/4, function () {
                    changed();
                });
            }
            else {
                changed();
            }

        }
        core.playSound('floor.mp3');
        if (displayAnimate) {
            core.show(core.dom.floorMsgGroup, time/2, function () {
                changing();
            });
        }
        else {
            changing();
        }
    }, 25);
}

////// 显示图片 //////
events.prototype.showImage = function (code, image, x, y, dw, dh, opacityVal, time, callback) {
    dw /= 100;
    dh /= 100;
    x = core.calValue(x) || 0;
    y = core.calValue(y) || 0;
    var zIndex = code + 100;
    time = time || 0;
    var name = "image"+ zIndex;
    var ctx = core.createCanvas(name, x, y, image.width * dw, image.height * dh, zIndex);

    ctx.drawImage(image, 0, 0, image.width * dw, image.height * dh);
    if (time == 0)
        core.setOpacity(name, opacityVal);
    else {
        var per_time = 10, steps = parseInt(time / per_time), per_add = opacityVal / steps;
        var opacity = 0;
        core.setOpacity(name, 0);
        var animate = setInterval(function () {
            opacity += per_add;
            core.setOpacity(name, opacity);
            if (opacity >= opacityVal) {
                delete core.animateFrame.asyncId[animate];
                clearInterval(animate);
                core.setOpacity(name, opacityVal);
                if (core.isset(callback)) callback();
            }
        }, per_time);

        core.animateFrame.asyncId[animate] = true;
    }
}

////// 隐藏图片 //////
events.prototype.hideImage = function (code, time, callback) {
    time = time || 0;
    var name = "image"+ (code+100);
    if (!core.isset(core.dymCanvas[name])) {
        if (core.isset(callback)) callback();
        return;
    }
    if (time == 0)
        core.deleteCanvas(name);
    else {
        var opacityVal = parseFloat(core.dymCanvas[name].canvas.style.opacity);
        var per_time = 10, steps = parseInt(time / per_time), per_add = opacityVal / steps;
        var animate = setInterval(function () {
            opacityVal -= per_add;
            core.setOpacity(name, opacityVal);
            if (opacityVal < 0) {
                delete core.animateFrame.asyncId[animate];
                clearInterval(animate);
                core.deleteCanvas(name);
                if (core.isset(callback)) callback();
            }
        }, per_time);

        core.animateFrame.asyncId[animate] = true;
    }
}

////// 文本图片化 //////
events.prototype.textImage = function (content) {
    content = content || "";

    // 获得颜色的盒子等信息
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute;
    var textfont = textAttribute.textfont || 16;
    var offset = textAttribute.offset || 15;
    var textColor = core.arrayToRGBA(textAttribute.text);

    var font = textfont+"px "+core.status.globalAttribute.font;
    if (textAttribute.bold) font = "bold "+font;
    var contents = core.splitLines('ui', content), lines = contents.length;

    // 计算总高度，按1.4倍行距计算
    var width = 416, height = textfont * 1.4 * lines;
    var tempCanvas = core.bigmap.tempCanvas;
    tempCanvas.canvas.width = width;
    tempCanvas.canvas.height = height;
    tempCanvas.clearRect(0, 0, width, height);
    tempCanvas.font = font;
    tempCanvas.fillStyle = textColor;

    // 全部绘制
    var currH = textfont;
    for (var i = 0; i < lines; ++i) {
        var text = contents[i];
        tempCanvas.fillText(text, offset, currH);
        currH += 1.4 * textfont;
    }
    
    return tempCanvas.canvas;
}

////// 移动图片 //////
events.prototype.moveImage = function (code, to, opacityVal, time, callback) {
    time = time || 1000;

    var name = "image"+ (code+100);
    if (!core.isset(core.dymCanvas[name])) {
        if (core.isset(callback)) callback();
        return;
    }
    var fromX = parseFloat(core.dymCanvas[name].canvas.getAttribute("_left")),
        fromY = parseFloat(core.dymCanvas[name].canvas.getAttribute("_top")),
        preX = fromX, preY = fromY, toX = fromX, toY = fromY;

    if (core.isset(to)) {
        toX = core.calValue(to[0]);
        toY = core.calValue(to[1]);
        if (!core.isset(toX)) toX = fromX;
        if (!core.isset(toY)) toY = fromY;
    }

    var step = 0;
    var per_time = 10, steps = parseInt(time / per_time);
    var preOpac = parseFloat(core.dymCanvas[name].canvas.style.opacity), opacStep = 0;
    if (core.isset(opacityVal)) {
        opacityVal = core.calValue(opacityVal);
        opacStep = (opacityVal - preOpac) / steps;
    }
    
    var moveStep = function () {
        preOpac += opacStep;
        core.setOpacity(name, preOpac);
        preX = parseInt(fromX + (toX-fromX)*step/steps);
        preY = parseInt(fromY + (toY-fromY)*step/steps);
        core.relocateCanvas(name, preX, preY);
    }
    var animate = setInterval(function () {
        step++;
        moveStep();
        if (step > steps) {
            if (core.isset(opacityVal))
                core.setOpacity(name, opacityVal);
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (core.isset(callback)) callback();
        }
    }, per_time);

    core.animateFrame.asyncId[animate] = true;
}

////// 淡入淡出音乐 //////
events.prototype.setVolume = function (value, time, callback) {

    var set = function (value) {
        core.musicStatus.volume = value;
        if (core.isset(core.musicStatus.playingBgm)) {
            core.material.bgms[core.musicStatus.playingBgm].volume = value;
        }
        core.musicStatus.gainNode.gain.value = value;
    }

    if (!core.isset(time) || time<100) {
        set(value);
        if (core.isset(callback)) callback();
        return;
    }

    var currVolume = core.musicStatus.volume;
    var per_time = 10, step = 0, steps = parseInt(time / per_time);
    var fade = setInterval(function () {
        step++;
        var nowVolume = currVolume+(value-currVolume)*step/steps;
        set(nowVolume);
        if (step>=steps) {
            delete core.animateFrame.asyncId[fade];
            clearInterval(fade);
            if (core.isset(callback))
                callback();
        }
    }, per_time);

    core.animateFrame.asyncId[fade] = true;
}

////// 画面震动 //////
events.prototype.vibrate = function(time, callback) {

    if (core.isReplaying()) {
        if (core.isset(callback)) callback();
        return;
    }

    // core.status.replay.animate=true;

    var addGameCanvasTranslate=function(x,y){
        for(var ii=0,canvas;canvas=core.dom.gameCanvas[ii];ii++){
            var id = canvas.getAttribute('id');
            if (id=='ui' || id=='data') continue;
            var offsetX = x, offsetY = y;
            if (core.bigmap.canvas.indexOf(id)>=0) {
                offsetX-=core.bigmap.offsetX;
                offsetY-=core.bigmap.offsetY;
            }
            core.control.setGameCanvasTranslate(id, offsetX, offsetY);
        }
    }

    if (!core.isset(time) || time<1000) time=1000;

    var shake_duration = time*3/50;
    var shake_speed = 5;
    var shake_power = 5;
    var shake_direction = 1;
    var shake = 0;

    var update = function() {
        if(shake_duration >= 1 || shake != 0){
            var delta = (shake_power * shake_speed * shake_direction) / 10.0;
            if(shake_duration <= 1 && shake * (shake + delta) < 0){
                shake = 0;
            }else{
                shake += delta;
            }
            if(shake > shake_power * 2){
                shake_direction = -1;
            }
            if(shake < - shake_power * 2){
                shake_direction = 1;
            }
            if(shake_duration >= 1){
                shake_duration -= 1
            }
        }
    }

    var animate=setInterval(function(){
        update();
        addGameCanvasTranslate(shake, 0);
        if(shake_duration===0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            // core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, 50/3);

    core.animateFrame.asyncId[animate] = true;
}

////// 打开一个全局商店 //////
events.prototype.openShop = function(shopId, needVisited) {
    var shop = core.status.shops[shopId];
    shop.times = shop.times || 0;
    if (shop.commonTimes)
        shop.times = core.getFlag('commonTimes', 0);
    shop.visited = shop.visited || false;

    if (needVisited && !shop.visited) {
        if (!core.flags.enableDisabledShop) {
            if (shop.times==0) core.drawTip("该商店尚未开启");
            else core.drawTip("该商店已失效");
            return;
        }
        else {
            core.drawTip("该商店尚未开启，只能浏览不可使用");
        }
    }
    else shop.visited = true;

    var selection = core.status.event.selection;
    var actions = [];
    if (core.isset(core.status.event.data) && core.isset(core.status.event.data.actions))
        actions=core.status.event.data.actions;
    var fromList;
    if (core.isset(core.status.event.data) && core.isset(core.status.event.data.fromList))
        fromList = core.status.event.data.fromList;

    core.ui.closePanel();
    core.lockControl();
    // core.status.event = {'id': 'shop', 'data': {'id': shopId, 'shop': shop}};
    core.status.event.id = 'shop';
    core.status.event.data = {'id': shopId, 'shop': shop, 'actions': actions, 'fromList': fromList};
    core.status.event.selection = selection;

    // 拼词
    var content = "\t["+shop.name+","+shop.icon+"]";
    var times = shop.times, need=core.calValue(shop.need, null, null, times);

    content += core.replaceText(shop.text, need, times);

    var use = shop.use=='experience'?'经验':'金币';

    var choices = [];
    for (var i=0;i<shop.choices.length;i++) {
        var choice = shop.choices[i];
        var text = core.replaceText(choice.text, need, times);
        if (core.isset(choice.need))
            text += "（"+core.calValue(choice.need, null, null, times)+use+"）";
        choices.push({"text": text, "color":shop.visited?null:"#999999"});
    }
    choices.push("离开");
    core.ui.drawChoices(content, choices);
}

////// 禁用一个全局商店 //////
events.prototype.disableQuickShop = function (shopId) {
    core.status.shops[shopId].visited = false;
}

////// 能否使用快捷商店 //////
events.prototype.canUseQuickShop = function(shopId) {
    return this.eventdata.canUseQuickShop(shopId);
}

////// 设置角色行走图 //////
events.prototype.setHeroIcon = function (name, noDraw) {
    if (core.isset(core.material.images.images[name]) && core.material.images.images[name].width==128) {
        core.setFlag("heroIcon", name);
        core.material.images.hero.onload = function () {
            core.material.icons.hero.height = core.material.images.images[name].height/4;
            core.control.updateHeroIcon(name);
            if (!noDraw) core.drawHero();
        }
        core.material.images.hero.src = core.material.images.images[name].src;
    }
}

////// 检查升级事件 //////
events.prototype.checkLvUp = function () {
    var check = function () {
        if (!core.flags.enableLevelUp || !core.isset(core.firstData.levelUp)
            || core.status.hero.lv>=core.firstData.levelUp.length) return null;
        // 计算下一个所需要的数值
        var next = (core.firstData.levelUp[core.status.hero.lv]||{});
        var need = core.calValue(next.need);
        if (!core.isset(need)) return null;
        if (core.status.hero.experience>=need) {
            // 升级
            core.status.hero.lv++;
            if (next.clear) core.status.hero.experience -= need;
            return next.action||[];
        }
        return null;
    }
    var actions = [];
    while (true) {
        var next = check();
        if (next == null) break;
        actions = actions.concat(next);
    }
    if (actions.length>0) core.insertAction(actions);
}

////// 尝试使用道具 //////
events.prototype.useItem = function(itemId) {
    core.ui.closePanel();

    if (itemId=='book') {
        core.openBook(false);
        return;
    }
    if (itemId=='fly') {
        core.useFly(false);
        return;
    }
    if (itemId=='centerFly') {
        core.lockControl();
        core.status.event.id = 'centerFly';
        var fillstyle = 'rgba(255,0,0,0.5)';
        if (core.canUseItem('centerFly')) fillstyle = 'rgba(0,255,0,0.5)';
        var toX = core.bigmap.width-1 - core.getHeroLoc('x'), toY = core.bigmap.height-1-core.getHeroLoc('y');
        core.ui.drawThumbnail(core.status.floorId, 'ui', core.status.thisMap.blocks, 0, 0, 416, toX, toY, core.status.hero.loc, core.getFlag('heroIcon', "hero.png"));
        var offsetX = core.clamp(toX-6, 0, core.bigmap.width-13), offsetY = core.clamp(toY-6, 0, core.bigmap.height-13);
        core.fillRect('ui',(toX-offsetX)*32,(toY-offsetY)*32,32,32,fillstyle);
        core.status.event.data = {"x": toX, "y": toY, "poxX": toX-offsetX, "posY": toY-offsetY};
        core.drawTip("请确认当前中心对称飞行器的位置");
        return;
    }

    if (core.canUseItem(itemId))core.useItem(itemId);
    else core.drawTip("当前无法使用"+core.material.items[itemId].name);
}

////// 加点事件 //////
events.prototype.addPoint = function (enemy) {
    return this.eventdata.addPoint(enemy);
}

////// 战斗结束后触发的事件 //////
events.prototype.afterBattle = function (enemyId,x,y,callback) {
    return this.eventdata.afterBattle(enemyId,x,y,callback);
}

////// 开一个门后触发的事件 //////
events.prototype.afterOpenDoor = function (doorId,x,y,callback) {
    return this.eventdata.afterOpenDoor(doorId,x,y,callback);
}

////// 经过一个路障 //////
events.prototype.passNet = function (data) {
    // 有鞋子
    if (core.hasItem('shoes')) return;
    if (data.event.id=='lavaNet') { // 血网
        // 在checkBlock中进行处理
        /*
        core.status.hero.hp -= core.values.lavaDamage;
        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose();
            return;
        }
        */
        // core.drawTip('经过血网，生命-'+core.values.lavaDamage);
    }
    if (data.event.id=='poisonNet') { // 毒网
        if (core.hasFlag('poison')) return;
        core.setFlag('poison', true);
    }
    if (data.event.id=='weakNet') { // 衰网
        if (core.hasFlag('weak')) return;
        core.setFlag('weak', true);
        if (core.values.weakValue>=1) { // >=1：直接扣数值
            core.status.hero.atk -= core.values.weakValue;
            core.status.hero.def -= core.values.weakValue;
        }
        else { // <1：扣比例
            core.setFlag("equip_atk_buff", core.getFlag("equip_atk_buff", 1) - core.values.weakValue);
            core.setFlag("equip_def_buff", core.getFlag("equip_def_buff", 1) - core.values.weakValue);
        }
    }
    if (data.event.id=='curseNet') { // 咒网
        if (core.hasFlag('curse')) return;
        core.setFlag('curse', true);
    }
    core.updateStatusBar();
}

////// 改变亮灯（感叹号）的事件 //////
events.prototype.changeLight = function(x, y) {
    var block = core.getBlock(x, y);
    if (block==null) return;
    var index = block.index;
    block = block.block;
    if (block.event.id != 'light') return;
    // 改变为dark
    block.id = 166;
    block.event = {'cls': 'terrains', 'id': 'darkLight', 'noPass': true};
    core.drawBlock(block);
    this.afterChangeLight(x,y);
}

////// 改变亮灯之后，可以触发的事件 //////
events.prototype.afterChangeLight = function (x,y) {
    return this.eventdata.afterChangeLight(x,y);
}

////// 滑冰 //////
events.prototype.ski = function (direction) {
    if (!core.isset(direction))
        direction = core.status.automaticRoute.lastDirection || core.getHeroLoc('direction');
    if (core.status.event.id!='ski') {
        core.waitHeroToStop(function () {
            core.status.event.id='ski';
            core.events.ski(direction);
        });
    }
    else {
        core.moveHero(direction, function () {
            if (core.status.event.id=='ski' && !core.status.isSkiing) {
                core.status.event.id=null;
                core.unLockControl();
                core.replay();
            }
        })
    }
}

////// 推箱子 //////
events.prototype.pushBox = function (data) {
    if (data.event.id!='box' && data.event.id!='boxed') return;

    // 判断还能否前进，看看是否存在事件
    var direction = core.getHeroLoc('direction'), nx=data.x+core.utils.scan[direction].x, ny=data.y+core.utils.scan[direction].y;

    if (nx<0||nx>=core.bigmap.width||ny<0||ny>=core.bigmap.height) return;

    var block = core.getBlock(nx, ny, null, true);
    if (block!=null && !(core.isset(block.block.event) && block.block.event.id=='flower'))
        return;

    if (block==null) {
        core.status.thisMap.blocks.push(core.maps.initBlock(nx, ny, 169));
        block = core.getBlock(nx, ny);
    }
    else {
        block.block.id=170;
        block.block.event=core.maps.initBlock(null,null,170).event;
    }
    core.drawBlock(block.block);

    if (data.event.id=='box') {
        core.removeBlock(data.x, data.y);
    }
    else {
        data.id=168;
        data.event=core.maps.initBlock(null,null,168).event;
        core.drawBlock(data);
    }

    core.updateStatusBar();

    core.status.replay.animate = true;
    core.moveHero(direction, function() {
        core.status.replay.animate = false;
        core.status.route.pop();
        core.events.afterPushBox();
        core.replay();
    });

}

////// 推箱子后的事件 //////
events.prototype.afterPushBox = function () {
    return this.eventdata.afterPushBox();
}

////// 使用炸弹/圣锤后的事件 //////
events.prototype.afterUseBomb = function () {
    return this.eventdata.afterUseBomb();
}

////// 即将存档前可以执行的操作 //////
events.prototype.beforeSaveData = function (data) {
    return this.eventdata.beforeSaveData(data);
}

////// 读档事件后，载入事件前，可以执行的操作 //////
events.prototype.afterLoadData = function (data) {
    return this.eventdata.afterLoadData(data);
}

////// 上传当前数据 //////
events.prototype.uploadCurrent = function (username) {
    var formData = new FormData();

    formData.append('type', 'score');
    formData.append('name', core.firstData.name);
    formData.append('version', core.firstData.version);
    formData.append('platform', core.platform.isPC?"PC":core.platform.isAndroid?"Android":core.platform.isIOS?"iOS":"");
    formData.append('hard', core.encodeBase64(core.status.hard));
    formData.append('username', core.encodeBase64(username||"current"));
    formData.append('lv', core.status.hero.lv);
    formData.append('hp', Math.min(core.status.hero.hp, Math.pow(2, 63)));
    formData.append('atk', core.status.hero.atk);
    formData.append('def', core.status.hero.def);
    formData.append('mdef', core.status.hero.mdef);
    formData.append('money', core.status.hero.money);
    formData.append('experience', core.status.hero.experience);
    formData.append('steps', core.status.hero.steps);
    formData.append('seed', core.getFlag('__seed__'));
    formData.append('totalTime', Math.floor(core.status.hero.statistics.totalTime/1000));
    formData.append('route', core.encodeRoute(core.status.route));
    formData.append('deler', 'current');
    formData.append('base64', 1);

    core.http("POST", "/games/upload.php", formData);
}
