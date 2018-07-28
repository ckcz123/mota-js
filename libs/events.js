function events() {
    this.init();
}

////// 初始化 //////
events.prototype.init = function () {
    this.eventdata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.events;
    this.events = {
        'battle': function (data, core, callback) {
            //core.autosave(true);
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
            //core.autosave(true);
            core.openDoor(data.event.id, data.x, data.y, true, function () {
                if (core.isset(callback)) callback();
                core.replay();
            });
        },
        'changeFloor': function (data, core, callback) {
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
            core.events.insertAction(data.event.data, data.x, data.y, callback);
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
events.prototype.startGame = function (hard) {

    if (core.status.isStarting) return;
    core.status.isStarting = true;

    core.hideStartAnimate(function() {
        core.drawText(core.clone(core.firstData.startText), function() {
            if (core.flags.showBattleAnimateConfirm) { // 是否提供“开启战斗动画”的选择项
                core.status.event.selection = core.flags.battleAnimate ? 0 : 1;
                core.ui.drawConfirmBox("你想开启战斗动画吗？\n之后可以在菜单栏中开启或关闭。\n（强烈建议新手开启此项）", function () {
                    core.data.flags.battleAnimate = true;
                    core.flags.battleAnimate = true;
                    core.setLocalStorage('battleAnimate', true);
                    core.startGame(hard);
                    core.utils.__init_seed();
                    core.events.setInitData(hard);
                }, function () {
                    core.data.flags.battleAnimate = false;
                    core.flags.battleAnimate = false;
                    core.setLocalStorage('battleAnimate', false);
                    core.startGame(hard);
                    core.utils.__init_seed();
                    core.events.setInitData(hard);
                });
            }
            else {
                core.startGame(hard);
                core.utils.__init_seed();
                core.events.setInitData(hard);
            }
        });
    })
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

    // 清空图片和天气
    core.clearMap('animate', 0, 0, 416, 416);
    core.dom.gif2.innerHTML = "";
    core.clearMap('weather', 0, 0, 416, 416)
    core.animateFrame.weather.type = null;
    core.animateFrame.weather.level = 0;
    core.animateFrame.weather.nodes = [];
    core.setFg(null, 0);
    core.ui.closePanel();

    // 下载录像
    var confirmDownload = function () {

        core.ui.closePanel();
        core.ui.drawConfirmBox("你想下载录像吗？", function () {
            var obj = {
                'name': core.firstData.name,
                'version': core.firstData.version,
                'hard': core.status.hard,
                'seed': core.getFlag('seed'),
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
            formData.append('seed', core.getFlag('seed'));
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
                doUpload(prompt("请输入你的ID："));
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

        if (core.isset(core.values.maxValidHp) && core.status.hero.hp>core.values.maxValidHp) {
            core.drawText("作弊可耻！", function () {
                core.restart();
            });
        }
        else if (core.hasFlag('debug')) {
            core.drawText("\t[系统提示]调试模式下无法上传成绩", function () {
                core.restart();
            })
        }
        else {
            confirmUpload();
        }

    }

}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId) {
    if (main.mode!='play') return;
    return this.eventdata.afterChangeFloor(floorId);
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

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    // 事件处理完毕
    if (core.status.event.data.list.length==0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel();
        if (core.isset(callback))
            callback();
        core.replay();
        return;
    }

    var current = core.status.event.data.list[0];
    if (current.todo.length == 0) { // current list is empty
        if (core.calValue(current.condition)) { // check condition
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

    var x=core.status.event.data.x, y=core.status.event.data.y;

    // 不同种类的事件

    // 如果是文字：显示
    if (typeof data == "string") {
        core.status.event.data.type='text';
        // 如果是正在回放中，不显示
        if (core.status.replay.replaying)
            core.events.doAction();
        else
            core.ui.drawTextBox(data);
        return;
    }
    core.status.event.data.type=data.type;
    switch (data.type) {
        case "text": // 文字/对话
            if (core.status.replay.replaying)
                core.events.doAction();
            else
                core.ui.drawTextBox(data.text);
            break;
        case "autoText":
            if (core.status.replay.replaying)
                core.events.doAction();
            else {
                core.ui.drawTextBox(data.text);
                setTimeout(function () {
                    core.events.doAction();
                }, data.time || 3000);
            }
            break;
        case "setText": // 设置文本状态
            if (data.position=='up'||data.position=='down'||data.position=='center') {
                core.status.textAttribute.position=data.position;
            }
            ["background", "title", "text"].forEach(function (t) {
                if (core.isset(data[t]) && (data[t] instanceof Array) && data[t].length>=3) {
                    if (data[t].length==3) data[t].push(1);
                    core.status.textAttribute[t]=data[t];
                }
            })
            if (core.isset(data.bold)) {
                core.status.textAttribute.bold=data.bold;
            }
            if (core.isset(data.time)) {
                core.status.textAttribute.time=data.time;
            }
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
                data.loc = [[core.calValue(data.loc[0]), core.calValue(data.loc[1])]];
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                core.animateBlock(data.loc,'show', data.time, function () {
                    data.loc.forEach(function (t) {
                        core.showBlock(t[0],t[1],data.floorId)
                    })
                    core.events.doAction();
                });
            }
            else {
                data.loc.forEach(function (t) {
                    core.showBlock(t[0],t[1],data.floorId)
                })
                this.doAction();
            }
            break;
        case "hide": // 消失
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if ((typeof data.loc[0] == 'number' || typeof data.loc[0] == 'string')
                && (typeof data.loc[1] == 'number' || typeof data.loc[1] == 'string'))
                data.loc = [[core.calValue(data.loc[0]), core.calValue(data.loc[1])]];
            data.loc.forEach(function (t) {
                core.removeBlock(t[0],t[1],data.floorId);
            })
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                core.animateBlock(data.loc,'hide',data.time, function () {
                    core.events.doAction();
                });
            }
            else this.doAction();
            break;
        case "setBlock": // 设置某图块
            {
                if (core.isset(data.loc)) {
                    x=core.calValue(data.loc[0]);
                    y=core.calValue(data.loc[1]);
                }
                core.setBlock(data.number, x, y, data.floorId);
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
                    x=core.calValue(data.loc[0]);
                    y=core.calValue(data.loc[1]);
                }
            }
            core.drawAnimate(data.name, x, y, function () {
                core.events.doAction();
            })
            break;
        case "move": // 移动事件
            if (core.isset(data.loc)) {
                x=core.calValue(data.loc[0]);
                y=core.calValue(data.loc[1]);
            }
            core.moveBlock(x,y,data.steps,data.time,data.keep,function() {
                core.events.doAction();
            })
            break;
        case "moveHero":
            core.eventMoveHero(data.steps,data.time,function() {
                core.events.doAction();
            });
            break;
        case "jump": // 跳跃事件
            {
                var sx=x, sy=y, ex=x,ey=y;
                if (core.isset(data.from)) {
                    sx=core.calValue(data.from[0]);
                    sy=core.calValue(data.from[1]);
                }
                if (core.isset(data.to)) {
                    ex=core.calValue(data.to[0]);
                    ey=core.calValue(data.to[1]);
                }
                core.jumpBlock(sx,sy,ex,ey,data.time,data.keep,function() {
                    core.events.doAction();
                });
                break;
            }
        case "jumpHero":
            {
                var ex=core.status.hero.loc.x, ey=core.status.hero.loc.y;
                if (core.isset(data.loc)) {
                    ex=core.calValue(data.loc[0]);
                    ey=core.calValue(data.loc[1]);
                }
                core.jumpHero(ex,ey,data.time,function() {
                    core.events.doAction();
                });
                break;
            }
        case "changeFloor": // 楼层转换
            {
                var heroLoc = {"x": core.calValue(data.loc[0]), "y": core.calValue(data.loc[1])};
                if (core.isset(data.direction)) heroLoc.direction=data.direction;
                core.changeFloor(data.floorId||core.status.floorId, null, heroLoc, data.time, function() {
                    core.lockControl();
                    core.events.doAction();
                });
                break;
            }
        case "changePos": // 直接更换勇士位置，不切换楼层
            core.clearMap('hero', 0, 0, 416, 416);
            if (core.isset(data.loc)) {
                core.setHeroLoc('x', core.calValue(data.loc[0]));
                core.setHeroLoc('y', core.calValue(data.loc[1]));
            }
            if (core.isset(data.direction)) core.setHeroLoc('direction', data.direction);
            core.drawHero();
            this.doAction();
            break;
        case "showImage": // 显示图片
            if (core.isset(data.loc) && core.isset(core.material.images.images[data.name])) {
                core.canvas.animate.drawImage(core.material.images.images[data.name],
                    core.calValue(data.loc[0]), core.calValue(data.loc[1]));
            }
            else core.clearMap('animate', 0, 0, 416, 416);
            this.doAction();
            break;
        case "animateImage": // 淡入淡出图片
            if (core.status.replay.replaying) { // 正在播放录像
                this.doAction();
            }
            else {
                if (core.isset(data.loc) && core.isset(core.material.images.images[data.name]) && (data.action=="show" || data.action=="hide")) {
                    core.events.animateImage(data.action, core.material.images.images[data.name], data.loc, data.time, function() {
                        core.events.doAction();
                    });
                }
                else {
                    this.doAction();
                }
            }
            break;
        case "showGif": // 显示动图
            if (core.isset(data.loc) && core.isset(core.material.images.images[data.name])) {
                var gif = new Image();
                gif.src = core.material.images.images[data.name].src;
                gif.style.position = 'absolute';
                gif.style.left = (core.calValue(data.loc[0])*core.domStyle.scale)+"px";
                gif.style.top = (core.calValue(data.loc[1])*core.domStyle.scale)+"px";
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
            if (core.status.replay.replaying) { // 正在播放录像
                this.doAction();
            }
            else {
                if (core.isset(data.from) && core.isset(data.to) && core.isset(core.material.images.images[data.name])) {
                    core.events.moveImage(core.material.images.images[data.name], data.from, data.to, data.time, function() {
                        core.events.doAction();
                    });
                }
                else {
                    this.doAction();
                }
            }
            break;
        case "setFg": // 颜色渐变
            core.setFg(data.color, data.time, function() {
                core.events.doAction();
            });
            break;
        case "setWeather": // 更改天气
            core.setWeather(data.name, data.level);
            this.doAction();
            break;
        case "openDoor": // 开一个门，包括暗墙
            {
                var floorId=data.floorId || core.status.floorId;
                var block=core.getBlock(core.calValue(data.loc[0]), core.calValue(data.loc[1]), floorId);
                if (block!=null) {
                    if (floorId==core.status.floorId)
                        core.openDoor(block.block.event.id, block.block.x, block.block.y, false, function() {
                            core.events.doAction();
                        })
                    else {
                        core.removeBlock(block.block.x,block.block.y,floorId);
                        this.doAction();
                    }
                    break;
                }
                this.doAction();
                break;
            }
        case "openShop": // 打开一个全局商店
            if (core.status.replay.replaying) { // 正在播放录像，简单将visited置为true
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
                var toX=core.calValue(data.loc[0]), toY=core.calValue(data.loc[1]);
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
        case "playSound":
            if (!core.status.replay.replaying)
                core.playSound(data.name);
            this.doAction();
            break;
        case "playBgm":
            core.playBgm(data.name);
            this.doAction();
            break
        case "pauseBgm":
            core.pauseBgm();
            this.doAction();
            break
        case "resumeBgm":
            core.resumeBgm();
            this.doAction();
            break
        case "setVolume":
            data.value = parseInt(data.value||0);
            if (data.value<0) data.value=0;
            if (data.value>100) data.value=100;
            this.setVolume(data.value/100, data.time, function() {
                core.doAction();
            });
            break;
        case "setValue":
            try {
                var value=core.calValue(data.value);
                // 属性
                if (data.name.indexOf("status:")==0) {
                    value=parseFloat(value);
                    core.setStatus(data.name.substring(7), value);
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
            }
            catch (e) {console.log(e)}
            if (core.status.hero.hp<=0) {
                core.status.hero.hp=0;
                core.updateStatusBar();
                core.events.lose();
            }
            else {
                core.updateStatusBar();
                this.doAction();
            }
            break;
        case "setHeroIcon":
            {
                this.setHeroIcon(data.name);
                this.doAction();
                break;
            }
        case "input":
            {
                var value;
                if (core.status.replay.replaying) {
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
        case "if": // 条件判断
            if (core.calValue(data.condition))
                core.events.insertAction(data["true"])
            else
                core.events.insertAction(data["false"])
            this.doAction();
            break;
        case "choices": // 提供选项
            if (core.status.replay.replaying) {
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
            if (core.calValue(data.condition)) {
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
            if (core.calValue(core.status.event.data.list[0].condition)) {
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
                if (core.isset(func)) {
                    if ((typeof func == "string") && func.indexOf("function")==0) {
                        eval('('+func+')()');
                    }
                    else if (func instanceof Function)
                        func();
                }
                this.doAction();
                break;
            }
        case "update":
            core.updateStatusBar();
            this.doAction();
            break;
        case "updateEnemys":
            core.enemys.updateEnemys();
            core.updateStatusBar();
            this.doAction();
            break;
        case "viberate":
            core.events.vibrate(data.time, function () {
                core.events.doAction();
            })
            break;
        case "sleep": // 等待多少毫秒
            if (core.status.replay.replaying)
                core.events.doAction();
            else {
                setTimeout(function () {
                    core.events.doAction();
                }, data.time);
            }
            break;
        case "wait":
            if (core.status.replay.replaying) {
                var code = core.status.replay.toReplay.shift();
                if (code.indexOf("input:")==0) {
                    var value = parseInt(code.substring(6));
                    core.status.route.push("input:"+value);
                    if (value>=10000) {
                        core.setFlag('type', 1);
                        core.setFlag('x', parseInt((value-10000)/100));
                        core.setFlag('y', value%100);
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

////// 获得面前的物品（轻按） //////
events.prototype.getNextItem = function() {
    if (!core.status.heroStop || !core.flags.enableGentleClick) return;
    var nextX = core.nextX(), nextY = core.nextY();
    var block = core.getBlock(nextX, nextY);
    if (block==null) return;
    if (block.block.event.trigger=='getItem') {
        core.getItem(block.block.event.id, 1, nextX, nextY);
        core.status.route.push("getNext");
    }
}

////// 获得某个物品 //////
events.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    itemNum=itemNum||1;
    core.playSound('item.mp3');
    var itemCls = core.material.items[itemId].cls;
    core.items.getItemEffect(itemId, itemNum);
    core.removeBlock(itemX, itemY);
    var text = '获得 ' + core.material.items[itemId].name;
    if (itemNum > 1) text += "x" + itemNum;
    if (itemCls === 'items') text += core.items.getItemEffectTip(itemId);
    core.drawTip(text, core.material.icons.items[itemId]);
    core.canvas.event.clearRect(itemX * 32, itemY * 32, 32, 32);
    core.updateStatusBar();

    // 检查处理后的事件。
    var event = core.floors[core.status.floorId].afterGetItem[itemX+","+itemY];
    if (core.isset(event)) {
        core.events.doEvents(event, itemX, itemY, callback);
    }
    else if (core.isset(callback)) callback();
}

////// 开门 //////
events.prototype.openDoor = function (id, x, y, needKey, callback) {

    if (core.interval.openDoorAnimate!=null) return;

    // 是否存在门
    if (!core.terrainExists(x, y, id) && id!='lava' && id!='star') {
        if (core.isset(callback)) callback();
        return;
    }
    if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
        core.status.automaticRoute.moveStepBeforeStop=core.status.automaticRoute.autoStepRoutes.slice(core.status.automaticRoute.autoStep-1,core.status.automaticRoute.autoStepRoutes.length);
        if (core.status.automaticRoute.moveStepBeforeStop.length>=1)core.status.automaticRoute.moveStepBeforeStop[0].step-=core.status.automaticRoute.movedStep;
    }

    core.stopAutomaticRoute();
    var speed=30;
    var doorId = id;
    if (doorId.length<4 || doorId.substring(doorId.length-4)!="Door") {
        doorId=doorId+"Door";
        speed=70;
    }
    // 不存在门
    if (!core.isset(core.material.icons.animates[doorId])) {
        if (core.isset(callback)) callback();
        return;
    }

    var key = id.replace("Door", "Key");
    if (needKey && (key=="specialKey" || core.isset(core.material.items[key]))) {
        var key = id.replace("Door", "Key");
        if (!core.hasItem(key)) {
            if (key != "specialKey")
                core.drawTip("你没有" + core.material.items[key].name);
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
    var door = core.material.icons.animates[doorId];
    core.status.replay.animate=true;
    core.removeGlobalAnimate(x,y);
    core.interval.openDoorAnimate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(core.interval.openDoorAnimate);
            core.interval.openDoorAnimate=null;
            core.removeBlock(x, y);
            core.status.replay.animate=false;
            core.events.afterOpenDoor(id,x,y,callback);
            return;
        }
        core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
        core.canvas.event.drawImage(core.material.images.animates, 32 * state, 32 * door, 32, 32, 32 * x, 32 * y, 32, 32);
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

    // 非强制战斗
    if (!core.enemys.canBattle(id) && !force) {
        core.drawTip("你打不过此怪物！");
        core.clearContinueAutomaticRoute();
        return;
    }

    if (!core.isset(core.status.event.id)) // 自动存档
        core.autosave(true);

    if (core.flags.battleAnimate&&!core.status.replay.replaying) {
        core.waitHeroToStop(function() {
            core.ui.drawBattleAnimate(id, function() {
                core.events.afterBattle(id, x, y, callback);
            });
        });
    }
    else {

        if (core.flags.equipment && core.getFlag('sword', 'sword0')!='sword0') {
            core.playSound('zone.mp3');
            core.drawAnimate('sword', x, y);
        }
        else {
            core.playSound('attack.mp3');
            core.drawAnimate('hand', x, y);
        }

        core.events.afterBattle(id, x, y, callback);
    }
}

////// 触发(x,y)点的事件 //////
events.prototype.trigger = function (x, y) {
    core.status.isSkiing = false;
    var mapBlocks = core.status.thisMap.blocks;
    var noPass;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable)) { // 启用事件
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
                        if (core.status.replay.replaying) {
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

////// 楼层切换 //////
events.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback, fromLoad) {

    if (!core.isset(floorId)) floorId = core.status.floorId;

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

    var displayAnimate=(!core.isset(time) || time>=100) && !core.status.replay.replaying;

    time = time || 800;
    time /= 20;
    core.lockControl();
    core.stopHero();
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    core.status.replay.animate=true;
    core.dom.floorNameLabel.innerHTML = core.status.maps[floorId].title;
    if (!core.isset(stair) && !core.isset(heroLoc))
        heroLoc = core.status.hero.loc;
    if (core.isset(stair)) {
        if (!core.isset(heroLoc)) heroLoc={};

        if (core.isset(core.floors[floorId][stair])) {
            heroLoc.x = core.floors[floorId][stair][0];
            heroLoc.y = core.floors[floorId][stair][1];
        }
        else {
            var blocks = core.status.maps[floorId].blocks;
            for (var i in blocks) {
                if (core.isset(blocks[i].event) && !(core.isset(blocks[i].enable) && !blocks[i].enable) && blocks[i].event.id === stair) {
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
    if (core.status.maps[floorId].canFlyTo && core.status.hero.flyRange.indexOf(floorId)<0) {
        core.status.hero.flyRange.push(floorId);
        core.status.hero.flyRange.sort(function (a, b) {
            return core.floorIds.indexOf(a) - core.floorIds.indexOf(b);
        })
    }

    window.setTimeout(function () {

        var changing = function () {

            // 根据文字判断是否斜体
            var floorName = core.status.maps[floorId].name;
            if (!core.isset(floorName) || floorName=="") floorName="&nbsp;"
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

            // 更改BGM
            if (core.isset(core.floors[floorId].bgm)) {
                core.playBgm(core.floors[floorId].bgm);
            }

            // 不存在事件时，更改画面色调
            if (core.status.event.id == null) {
                // 默认画面色调
                if (core.isset(core.floors[floorId].color)) {
                    var color = core.floors[floorId].color;

                    // 直接变色
                    core.dom.curtain.style.background = core.arrayToRGB(color);
                    if (core.isset(color[3]))
                        core.dom.curtain.style.opacity = color[3];
                    else core.dom.curtain.style.opacity=1;
                    core.status.curtainColor = color;
                }
                else {
                    core.dom.curtain.style.background = "#000000";
                    core.dom.curtain.style.opacity = 0;
                }
            }

            // 更改天气
            if (core.isset(core.floors[floorId].weather)) {
                core.setWeather(core.floors[floorId].weather[0], core.floors[floorId].weather[1])
            }
            else core.setWeather();

            // 清除gif
            core.dom.gif.innerHTML = "";

            // 检查重生
            if (!core.isset(fromLoad)) {
                core.status.maps[floorId].blocks.forEach(function(block) {
                    if (core.isset(block.enable) && !block.enable && core.isset(block.event) && block.event.cls.indexOf('enemy')==0
                        && core.enemys.hasSpecial(core.material.enemys[block.event.id].special, 23)) {
                        block.enable = true;
                    }
                })
            }
            core.drawMap(floorId, function () {
                if (core.isset(heroLoc.direction))
                    core.setHeroLoc('direction', heroLoc.direction);
                core.setHeroLoc('x', heroLoc.x);
                core.setHeroLoc('y', heroLoc.y);
                core.clearMap('hero', 0, 0, 416, 416);
                core.drawHero();

                var changed = function () {
                    core.unLockControl();
                    core.status.replay.animate=false;
                    core.events.afterChangeFloor(floorId);
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
            });
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

////// 图片淡入/淡出 //////
events.prototype.animateImage = function (type, image, loc, time, callback) {
    time = time||0;
    if ((type!='show' && type!='hide') || time<=0) {
        if (core.isset(callback)) callback();
        return;
    }

    clearInterval(core.interval.tipAnimate);
    core.setAlpha('data', 1);

    var opacityVal = 0;
    if (type == 'hide') opacityVal = 1;

    core.setOpacity('data', opacityVal);
    core.canvas.data.drawImage(image, core.calValue(loc[0]), core.calValue(loc[1]));
    core.status.replay.animate=true;
    var animate = setInterval(function () {
        if (type=='show') opacityVal += 0.1;
        else opacityVal -= 0.1;
        core.setOpacity('data', opacityVal);
        if (opacityVal >=1 || opacityVal<=0) {
            clearInterval(animate);
            core.clearMap('data', 0, 0, 416, 416);
            core.setOpacity('data', 1);
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, time / 10);
}

////// 移动图片 //////
events.prototype.moveImage = function (image, from, to, time, callback) {
    time = time || 1000;
    clearInterval(core.interval.tipAnimate);
    core.setAlpha('data', 1);
    core.setOpacity('data', 1);

    core.status.replay.animate=true;
    var fromX = core.calValue(from[0]), fromY = core.calValue(from[1]),
        toX = core.calValue(to[0]), toY = core.calValue(to[1]);
    var step = 0;
    var drawImage = function () {
        core.clearMap('data', 0, 0, 416, 416);
        var nowX = parseInt(fromX + (toX-fromX)*step/64);
        var nowY = parseInt(fromY + (toY-fromY)*step/64);
        core.canvas.data.drawImage(image, nowX, nowY);
    }

    drawImage();
    var animate = setInterval(function () {
        step++;
        drawImage();
        if (step>=64) {
            clearInterval(animate);
            core.clearMap('data', 0, 0, 416, 416);
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, time / 64);
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
    core.status.replay.animate=true;
    var currVolume = core.musicStatus.volume;
    var step = 0;
    var fade = setInterval(function () {
        step++;
        var nowVolume = currVolume+(value-currVolume)*step/32;
        set(nowVolume);
        if (step>=32) {
            clearInterval(fade);
            core.status.replay.animate=false;
            if (core.isset(callback))
                callback();
        }
    }, time / 32);
}

////// 画面震动 //////
events.prototype.vibrate = function(time, callback) {

    if (core.isset(core.status.replay)&&core.status.replay.replaying) {
        if (core.isset(callback)) callback();
        return;
    }

    core.status.replay.animate=true;

    var setGameCanvasTranslate=function(x,y){
        for(var ii=0,canvas;canvas=core.dom.gameCanvas[ii];ii++){
            if(['data','ui'].indexOf(canvas.getAttribute('id'))!==-1)continue;
            canvas.style.transform='translate('+x+'px,'+y+'px)';
            canvas.style.webkitTransform='translate('+x+'px,'+y+'px)';
            canvas.style.OTransform='translate('+x+'px,'+y+'px)';
            canvas.style.MozTransform='translate('+x+'px,'+y+'px)';
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
        setGameCanvasTranslate(shake,0);
        if(shake_duration===0) {
            clearInterval(animate);
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, 50/3);
}

////// 打开一个全局商店 //////
events.prototype.openShop = function(shopId, needVisited) {
    var shop = core.status.shops[shopId];
    shop.times = shop.times || 0;
    shop.visited = shop.visited || false;
    if (needVisited && !shop.visited) {
        if (shop.times==0) core.drawTip("该商店尚未开启");
        else core.drawTip("该商店已失效");
        return;
    }
    shop.visited = true;

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
    var times = shop.times, need=eval(shop.need);

    content = content + shop.text.replace(/\${([^}]+)}/g, function (word, value) {
        return eval(value);
    });

    var use = shop.use=='experience'?'经验':'金币';

    var choices = [];
    for (var i=0;i<shop.choices.length;i++) {
        var choice = shop.choices[i];
        var text = choice.text;
        if (core.isset(choice.need))
            text += "（"+eval(choice.need)+use+"）"
        choices.push(text);
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
    if (core.isset(core.floors[core.status.floorId].canUseQuickShop) && !core.floors[core.status.floorId].canUseQuickShop)
        return '当前不能使用快捷商店。';

    return null;
}

////// 设置角色行走图 //////
events.prototype.setHeroIcon = function (name) {
    if (core.isset(core.material.images.images[name]) && core.material.images.images[name].width==128) {
        core.setFlag("heroIcon", name);
        core.material.images.hero.src = core.material.images.images[name].src;
        core.material.icons.hero.height = core.material.images.images[name].height/4;
        core.drawHero();
    }
}

////// 检查升级事件 //////
events.prototype.checkLvUp = function () {
    if (!core.flags.enableLevelUp || !core.isset(core.firstData.levelUp)
        || core.status.hero.lv>=core.firstData.levelUp.length) return;
    // 计算下一个所需要的数值
    var need=core.firstData.levelUp[core.status.hero.lv].need;
    if (!core.isset(need)) return;
    if (core.status.hero.experience>=need) {
        // 升级
        core.status.hero.lv++;
        var effect = core.firstData.levelUp[core.status.hero.lv-1].effect;
        if (typeof effect == "string") {
            if (effect.indexOf("function")==0) {
                eval("("+effect+")()");
            }
            else {
                effect.split(";").forEach(function (t) {
                    core.doEffect(t);
                });
            }
        }
        else if (effect instanceof Function) {
            effect();
        }
        this.checkLvUp();
    }
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
        core.status.usingCenterFly= true;
        var fillstyle = 'rgba(255,0,0,0.5)';
        if (core.canUseItem('centerFly')) fillstyle = 'rgba(0,255,0,0.5)';
        core.fillRect('ui',(12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32,fillstyle);
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
        var weakValue = core.values.weakValue;
        var weakAtk = weakValue>=1?weakValue:Math.floor(weakValue*core.status.hero.atk);
        var weakDef = weakValue>=1?weakValue:Math.floor(weakValue*core.status.hero.def);
        core.setFlag('weakAtk', weakAtk);
        core.setFlag('weakDef', weakDef);
        core.status.hero.atk-=weakAtk;
        core.status.hero.def-=weakDef;
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
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    var direction = core.getHeroLoc('direction'), nx=data.x+scan[direction].x, ny=data.y+scan[direction].y;

    if (nx<0||nx>12||ny<0||ny>12) return;

    var block = core.getBlock(nx, ny, null, false);
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
    formData.append('seed', core.getFlag('seed'));
    formData.append('totalTime', Math.floor(core.status.hero.statistics.totalTime/1000));
    formData.append('route', core.encodeRoute(core.status.route));
    formData.append('deler', 'current');
    formData.append('base64', 1);

    core.http("POST", "/games/upload.php", formData);
}
