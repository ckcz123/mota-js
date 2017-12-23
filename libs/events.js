function events() {

}

events.prototype.init = function () {
    this.events = {
        'battle': function (data, core, callback) {
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
            core.openDoor(data.event.id, data.x, data.y, true);
            if (core.isset(callback))
                callback();
        },
        'changeFloor': function (data, core, callback) {
            var heroLoc = null;
            if (core.isset(data.event.data.loc)) {
                heroLoc = {'x': data.event.data.loc[0], 'y': data.event.data.loc[1]};
                if (core.isset(data.event.data.direction))
                    heroLoc.direction = data.event.data.direction;
            }
            core.changeFloor(data.event.data.floorId, data.event.data.stair,
                heroLoc, data.event.data.time, callback);
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
        'action': function (data, core, callback) {
            core.events.doEvents(data.event.data, data.x, data.y);
            if (core.isset(callback)) callback();
        }
    }
}

// 初始化
events.prototype.getEvents = function (eventName) {
    if (eventName == undefined) {
        return this.events;
    }
    return this.events[eventName];
}

main.instance.events = new events();



////// 游戏开始事件 //////
events.prototype.startGame = function (hard) {

    if (core.status.isStarting) return;
    core.status.isStarting = true;

    core.hideStartAnimate(function() {
        core.drawText(core.clone(core.firstData.startText), function() {
            core.startGame(hard);
            if (hard=='Easy') { // 简单难度
                core.setFlag('hard', 1); // 可以用flag:hard来获得当前难度
                // 可以在此设置一些初始福利，比如设置初始生命值可以调用：
                // core.setStatus("hp", 10000);
            }
            if (hard=='Normal') { // 普通难度
                core.setFlag('hard', 2); // 可以用flag:hard来获得当前难度
            }
            if (hard=='Hard') { // 困难难度
                core.setFlag('hard', 3); // 可以用flag:hard来获得当前难度
            }
        });
    })
}

////// 游戏结束事件 //////
events.prototype.win = function(reason) {
    // 获胜
    core.waitHeroToStop(function() {
        core.removeGlobalAnimate(0,0,true);
        core.clearMap('all'); // 清空全地图
        core.drawText([
            "\t[结局2]恭喜通关！你的分数是${status:hp}。"
        ], function () {
            core.restart();
        })
    });
}

events.prototype.lose = function(reason) {
    // 失败
    core.waitHeroToStop(function() {
        core.drawText([
            "\t[结局1]你死了。\n如题。"
        ], function () {
            core.restart();
        });
    })
}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId) {
    if (!core.isset(core.status.event.id) && !core.hasFlag("visited_"+floorId)) {
        this.doEvents(core.floors[floorId].firstArrive);
        core.setFlag("visited_"+floorId, true);
    }
}

////// 实际事件的处理 //////
events.prototype.doEvents = function (list, x, y, callback) {
    // 停止勇士
    core.waitHeroToStop(function() {
        if (!core.isset(list)) return;
        if (!(list instanceof Array)) {
            list = [list];
        }
        core.lockControl();
        core.status.event = {'id': 'action', 'data': {
            'list': core.clone(list), 'x': x, 'y': y, 'callback': callback
        }}
        core.events.doAction();
    });
}

events.prototype.doAction = function() {
    // 清空boxAnimate和UI层
    clearInterval(core.interval.boxAnimate);
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    // 事件处理完毕
    if (core.status.event.data.list.length==0) {
        if (core.isset(core.status.event.data.callback))
            core.status.event.data.callback();
        core.ui.closePanel(false);
        return;
    }

    var data = core.status.event.data.list.shift();
    core.status.event.data.current = data;

    var x=core.status.event.data.x, y=core.status.event.data.y;

    // 不同种类的事件

    // 如果是文字：显示
    if (typeof data == "string") {
        core.status.event.data.type='text';
        core.ui.drawTextBox(data);
        return;
    }
    core.status.event.data.type=data.type;
    switch (data.type) {
        case "text": // 文字/对话
            core.ui.drawTextBox(data.data);
            break;
        case "tip":
            core.drawTip(core.replaceText(data.text));
            core.events.doAction();
        case "show": // 显示
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                core.animateBlock(data.loc[0],data.loc[1],'show', data.time, function () {
                    core.addBlock(data.loc[0],data.loc[1],data.floorId);
                    core.events.doAction();
                });
            }
            else {
                core.addBlock(data.loc[0],data.loc[1],data.floorId)
                this.doAction();
            }
            break;
        case "hide": // 消失
            var toX=x, toY=y, toId=core.status.floorId;
            if (core.isset(data.loc)) {
                toX=data.loc[0]; toY=data.loc[1];
            }
            if (core.isset(data.floorId)) toId=data.floorId;
            core.removeBlock(toX,toY,toId)
            if (core.isset(data.time) && data.time>0 && toId==core.status.floorId) {
                core.animateBlock(toX,toY,'hide',data.time, function () {
                    core.events.doAction();
                });
            }
            else this.doAction();
            break;
        case "move": // 移动事件
            if (core.isset(data.loc)) {
                x=data.loc[0];
                y=data.loc[1];
            }
            core.moveBlock(x,y,data.steps,data.time,data.immediateHide,function() {
                core.events.doAction();
            })
            break;
        case "moveHero":
            core.eventMoveHero(data.steps,data.time,function() {
                core.events.doAction();
            });
            break;
        case "changeFloor": // 楼层转换
            var heroLoc = {"x": data.loc[0], "y": data.loc[1]};
            if (core.isset(data.direction)) heroLoc.direction=data.direction;
            core.changeFloor(data.floorId||core.status.floorId, null, heroLoc, data.time, function() {
                core.lockControl();
                core.events.doAction();
            });
            break;
        case "changePos": // 直接更换勇士位置，不切换楼层
            core.clearMap('hero', 0, 0, 416, 416);
            if (core.isset(data.loc)) {
                core.setHeroLoc('x', data.loc[0]);
                core.setHeroLoc('y', data.loc[1]);
            }
            if (core.isset(data.direction)) core.setHeroLoc('direction', data.direction);
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            this.doAction();
            break;
        case "setFg": // 颜色渐变
            core.setFg(data.color, data.time, function() {
                core.events.doAction();
            });
            break;
        case "openDoor": // 开一个门，包括暗墙
            var floorId=data.floorId || core.status.floorId;
            var block=core.getBlock(data.loc[0], data.loc[1], floorId);
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
        case "openShop": // 打开一个全局商店
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
            var toX=data.loc[0], toY=data.loc[1];
            var block=core.getBlock(toX, toY);
            if (block!=null) {
                block = block.block;
                if (core.isset(block.event) && block.event.trigger=='action') {
                    // 触发
                    /*
                    core.status.event = {'id': 'action', 'data': {
                        'list': core.clone(block.event.data), 'x': block.x, 'y': block.y, 'callback': core.status.event.data.callback
                    }}
                    */
                    core.status.event.data.list = core.clone(block.event.data);
                    core.status.event.data.x=block.x;
                    core.status.event.data.y=block.y;
                }
            }
            this.doAction();
            break;
        case "playSound":
            var name=data.name.split(".");
            if (name.length==2)
                core.playSound(name[0],name[1]);
            this.doAction();
            break;
        case "setValue":
            try {
                var value=core.calValue(data.value);
                // 属性
                if (data.name.indexOf("status:")==0) {
                    value=parseInt(value);
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
                core.events.lose('damage');

            }
            else {
                core.updateStatusBar();
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
            core.ui.drawChoices(data.text, data.choices);
            break;
        case "win":
            core.events.win(data.reason);
            break;
        case "lose":
            core.events.lose(data.reason);
            break;
        case "function":
            if (core.isset(data["function"]))
                data["function"]();
            this.doAction();
            break;
        case "update":
            core.updateStatusBar();
            this.doAction();
            break;
        case "sleep": // 等待多少毫秒
            setTimeout(function () {
                core.events.doAction();
            }, data.time);
            break;
        case "revisit": // 立刻重新执行该事件
            var block=core.getBlock(x,y); // 重新获得事件
            if (block!=null) {
                block = block.block;
                if (core.isset(block.event) && block.event.trigger=='action') {
                    core.status.event.data.list = core.clone(block.event.data);
                }
            }
            this.doAction();
            break;
        case "exit": // 立刻结束事件
            core.status.event.data.list = [];
            core.events.doAction();
            break;
        default:
            core.status.event.data.type='text';
            core.ui.drawTextBox("\t[警告,]出错啦！\n"+data.type+" 事件不被支持...");
    }
    return;
}

////// 往当前事件列表之前添加一个或多个事件 //////
events.prototype.insertAction = function (action) {
    core.unshift(core.status.event.data.list, action)
}

////// 打开商店 //////
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

    core.ui.closePanel();
    core.lockControl();
    core.status.event = {'id': 'shop', 'data': {'id': shopId, 'shop': shop}};
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
        choices.push({"text": text});
    }
    choices.push({"text": "离开"});
    core.ui.drawChoices(content, choices);
}

events.prototype.disableQuickShop = function (shopId) {
    core.status.shops[shopId].visited = false;
}

////// 降低难度 //////

events.prototype.decreaseHard = function() {
    core.drawTip("本塔不支持降低难度！");
    /*
    if (core.status.hard == 0) {
        core.drawTip("当前已是难度0，不能再降低难度了");
        return;
    }
    var add = 100, x=core.status.hard;
    while (x<10) {
        x++; add*=2;
    }
    core.ui.drawConfirmBox("本次操作可生命+" + add + "，确定吗？", function () {
        core.status.hero.hp += add;
        core.status.hard--;
        core.updateStatusBar();
        core.ui.closePanel();
        core.drawTip("降低难度成功，生命+" + add);
    }, function () {
        core.ui.drawSettings(false);
    });
    */
}

////// 能否使用快捷商店 //////
events.prototype.canUseQuickShop = function(shopIndex) {
    if (core.isset(core.floors[core.status.floorId].canUseQuickShop) && !core.isset(core.floors[core.status.floorId].canUseQuickShop))
        return '当前不能使用快捷商店。';

    return null;
}

////// 尝试使用道具 //////
events.prototype.useItem = function(itemId) {
    core.ui.closePanel(false);

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
        core.fillRect('ui',(12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32,'rgba(0,255,0,0.5)');
        return;
    }

    if (core.canUseItem(itemId))core.useItem(itemId);
    else core.drawTip("当前无法使用"+core.material.items[itemId].name);
}

/****** 打完怪物 ******/
events.prototype.afterBattle = function(enemyId,x,y,callback) {

    // 毒衰咒的处理
    var special = core.material.enemys[enemyId].special;
    // 中毒
    if (core.enemys.hasSpecial(special, 12) && !core.hasFlag('poison')) {
        core.setFlag('poison', true);
    }
    // 衰弱
    if (core.enemys.hasSpecial(special, 13) && !core.hasFlag('weak')) {
        core.setFlag('weak', true);
        core.status.hero.atk-=core.values.weakValue;
        core.status.hero.def-=core.values.weakValue;
    }
    // 诅咒
    if (core.enemys.hasSpecial(special, 14) && !core.hasFlag('curse')) {
        core.setFlag('curse', true);
    }
    // 仇恨属性：减半
    if (core.enemys.hasSpecial(special, 17)) {
        core.setFlag('hatred', parseInt(core.getFlag('hatred', 0)/2));
    }
    // 增加仇恨值
    core.setFlag('hatred', core.getFlag('hatred',0)+core.values.hatred);
    core.updateStatusBar();

    // 如果已有事件正在处理中
    if (core.status.lockControl) {
        if (core.isset(callback)) callback();
        return;
    }

    // 检查处理后的事件。
    var event = core.floors[core.status.floorId].afterBattle[x+","+y];
    if (core.isset(event)) {
        core.events.doEvents(event, x, y, callback);
    }
    //继续行走
    else {
        core.continueAutomaticRoute();
        if (core.isset(callback)) callback();
    }
}

/****** 开完门 ******/
events.prototype.afterOpenDoor = function(doorId,x,y,callback) {

    // 如果已有事件正在处理中
    if (core.status.lockControl) {
        if (core.isset(callback)) callback();
        return;
    }

    // 检查处理后的事件。
    var event = core.floors[core.status.floorId].afterOpenDoor[x+","+y];
    if (core.isset(event)) {
        core.events.doEvents(event, x, y, callback);
    }
    //继续行走
    else {
        core.continueAutomaticRoute();
        if (core.isset(callback)) callback();
    }
}

/****** 经过路障 ******/
events.prototype.passNet = function (data) {
    // 有鞋子
    if (core.hasItem('shoes')) return;
    if (data.event.id=='lavaNet') { // 血网
        core.status.hero.hp -= core.values.lavaDamage;
        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose('lava');
            return;
        }
        core.drawTip('经过血网，生命-'+core.values.lavaDamage);
    }
    if (data.event.id=='poisonNet') { // 毒网
        if (core.hasFlag('poison')) return;
        core.setFlag('poison', true);
    }
    if (data.event.id=='weakNet') { // 衰网
        if (core.hasFlag('weak')) return;
        core.setFlag('weak', true);
        core.status.hero.atk-=core.values.weakValue;
        core.status.hero.def-=core.values.weakValue;
    }
    if (data.event.id=='curseNet') { // 咒网
        if (core.hasFlag('curse')) return;
        core.setFlag('curse', true);
    }
    core.updateStatusBar();
}

events.prototype.changeLight = function(x, y) {
    var block = core.getBlock(x, y);
    if (block==null) return;
    var index = block.index;
    block = block.block;
    if (block.event.id != 'light') return;
    // 改变为dark
    block.id = 166;
    block.event = {'cls': 'terrains', 'id': 'darkLight', 'noPass': true};
    // 更新地图
    core.canvas.event.clearRect(x * 32, y * 32, 32, 32);
    var blockIcon = core.material.icons[block.event.cls][block.event.id];
    core.canvas.event.drawImage(core.material.images[block.event.cls], 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
    this.afterChangeLight(x,y);
}

// 改变灯后的事件
events.prototype.afterChangeLight = function(x,y) {

}

// 存档事件前一刻的处理
events.prototype.beforeSaveData = function(data) {

}

// 读档事件后，载入事件前，对数据的处理
events.prototype.afterLoadData = function(data) {

}


/******************************************/
/*********** 界面上的点击事件 ***************/
/******************************************/

// 正在处理事件时的点击操作...
events.prototype.clickAction = function (x,y) {

    if (core.status.event.data.type=='text') {
        // 文字
        this.doAction();
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
                this.insertAction(choices[y-topIndex].action);
                this.doAction();
            }
        }
    }
}

// 怪物手册
events.prototype.clickBook = function(x,y) {
    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        core.ui.drawEnemyBook(core.status.event.data - 1);
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawEnemyBook(core.status.event.data + 1);
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel(true);
    }
    return;
}

// 飞行器
events.prototype.clickFly = function(x,y) {
    if ((x==10 || x==11) && y==9) core.ui.drawFly(core.status.event.data-1);
    if ((x==10 || x==11) && y==5) core.ui.drawFly(core.status.event.data+1);
    if (x>=5 && x<=7 && y==12) core.ui.closePanel();
    if (x>=0 && x<=9 && y>=3 && y<=11) {
        var index=core.status.hero.flyRange.indexOf(core.status.floorId);
        var stair=core.status.event.data<index?"upFloor":"downFloor";
        var floorId=core.status.event.data;
        core.changeFloor(core.status.hero.flyRange[floorId], stair);
        core.ui.closePanel();
    }
    return;
}

// 商店
events.prototype.clickShop = function(x,y) {
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(choices.length / 2);
        if (y>=topIndex && y<topIndex+choices.length) {
            //this.insertAction(choices[y-topIndex].action);
            //this.doAction();
            var money = core.getStatus('money'), experience = core.getStatus('experience');
            var times = shop.times, need = eval(shop.need);
            var use = shop.use;
            var use_text = use=='money'?"金币":"经验";

            var choice = choices[y-topIndex];
            if (core.isset(choice.need))
                need = eval(choice.need);

            if (need > eval(use)) {
                core.drawTip("你的"+use_text+"不足");
                return;
            }

            eval(use+'-='+need);

            core.setStatus('money', money);
            core.setStatus('experience', experience);

            // 更新属性
            choice.effect.split(";").forEach(function (t) {
                if (t.indexOf("status:")==0) {
                    eval(t.replace("status:", "core.status.hero."));
                }
                else if (t.indexOf("item:")==0) {
                    eval(t.replace("item:", "core.getItem('").replace("+=", "', ")+")");
                }
            });
            core.updateStatusBar();
            shop.times++;
            this.openShop(core.status.event.data.id);
        }
        // 离开
        else if (y==topIndex+choices.length) {
            core.status.boxAnimateObjs = [];
            core.setBoxAnimate();
            if (core.status.event.data.fromList)
                core.ui.drawQuickShop();
            else core.ui.closePanel();
        }
    }
}

// 快捷商店
events.prototype.clickQuickShop = function(x, y) {
    if (x >= 5 && x <= 7) {
        var shopList = core.status.shops, keys = Object.keys(shopList);
        var topIndex = 6 - parseInt((keys.length + 1) / 2);
        var exitIndex = 6 + parseInt((keys.length + 1) / 2);

        if (y >= topIndex && y - topIndex < keys.length) {
            var reason = core.events.canUseQuickShop(y-topIndex);
            if (core.isset(reason)) {
                core.drawText(reason);
                return;
            }
            this.openShop(keys[y - topIndex], true);
            if (core.status.event.id=='shop')
                core.status.event.data.fromList = true;
        }
        if (y == exitIndex) {
            core.ui.closePanel();
        }
    }
}

// 工具栏
events.prototype.clickToolbox = function(x,y) {

    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel(false);
        return;
    }

    var items = null;

    if (y>=4 && y<=7 && x!=12)
        items = Object.keys(core.status.hero.items.tools).sort();

    if (y>=9 && y<=12 && x!=12)
        items = Object.keys(core.status.hero.items.constants).sort();

    if (items==null) return;
    var index=0;
    if (y==4||y==5||y==9||y==10) index=parseInt(x/2);
    else index=6+parseInt(x/2);

    if (index>=items.length) return;
    itemId=items[index];

    if (itemId==core.status.event.data) {
        core.events.useItem(itemId);
    }
    else {
        core.ui.drawToolbox(itemId);
    }
}

// 存读档
events.prototype.clickSL = function(x,y) {
    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        core.ui.drawSLPanel(core.status.event.data - 1);
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawSLPanel(core.status.event.data + 1);
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel(false);
        if (!core.isPlaying()) {
            core.showStartAnimate();
        }
        return;
    }

    var index=6*core.status.event.data+1;
    if (y>=1 && y<=4) {
        if (x>=1 && x<=3) core.doSL(index, core.status.event.id);
        if (x>=5 && x<=7) core.doSL(index+1, core.status.event.id);
        if (x>=9 && x<=11) core.doSL(index+2, core.status.event.id);
    }
    if (y>=7 && y<=10) {
        if (x>=1 && x<=3) core.doSL(index+3, core.status.event.id);
        if (x>=5 && x<=7) core.doSL(index+4, core.status.event.id);
        if (x>=9 && x<=11) core.doSL(index+5, core.status.event.id);
    }
}

events.prototype.clickSwitchs = function (x,y) {
    if (x<5 || x>7) return;
    if (y==4) {
        if (core.musicStatus.isIOS) {
            core.drawTip("iOS设备不支持播放音乐");
            return;
        }
        core.changeSoundStatus();
        core.ui.drawSwitchs();
    }
    if (y==5) {
        core.flags.battleAnimate=!core.flags.battleAnimate;
        core.ui.drawSwitchs();
    }
    if (y==6) {
        core.flags.displayEnemyDamage=!core.flags.displayEnemyDamage;
        core.updateFg();
        core.ui.drawSwitchs();
    }
    if (y==7) {
        core.flags.displayExtraDamage=!core.flags.displayExtraDamage;
        core.updateFg();
        core.ui.drawSwitchs();
    }
    if (y==8) {
        core.ui.drawSettings(false);
    }
}

// 菜单栏
events.prototype.clickSettings = function (x,y) {
    if (x<5 || x>7) return;
    if (y == 3) {
        core.ui.drawSwitchs();
    }
    if (y==4) {
        /*
        core.flags.battleAnimate=!core.flags.battleAnimate;
        core.setLocalStorage('battleAnimate', core.flags.battleAnimate);
        core.ui.drawSettings(false);
        */
        this.decreaseHard();
    }
    if (y == 5) core.ui.drawQuickShop();
    // if (y == 5) this.decreaseHard();
    if (y == 6) {
        core.ui.drawSyncSave();
    }
    /*
    if (y == 6) {
        core.ui.drawConfirmBox("你确定要清空所有本地存档吗？", function() {
            localStorage.clear();
            core.drawText("\t[操作成功]你的本地所有存档已被清空。");
        }, function() {
            core.ui.drawSettings(false);
        })
    }
    */
    if (y == 7) {
        core.ui.drawConfirmBox("你确定要重新开始吗？", function () {
            core.ui.closePanel();
            core.restart();
        }, function () {
            core.ui.drawSettings(false);
        });
    }
    if (y==8) {
        core.ui.drawAbout();
        // core.debug();
    }
    if (y == 9) core.ui.closePanel();
    return;
}

/*********** 点击事件 END ***************/
