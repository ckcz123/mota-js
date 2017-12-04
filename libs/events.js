function events() {

}

events.prototype.init = function () {
    this.events = {
        'battle': function (data, core, callback) {
            core.battle(data.event.id, data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        'changeFloor': function (data, core, callback) {
            // core.changeFloor(data.event.data.floorId, data.event.data.heroLoc);
            core.changeFloor(data.event.data.floorId, data.event.data.stair,
                data.event.data.heroLoc, callback);
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
        'visitNpc': function (data, core, callback) {
            core.visitNpc(data.event.npcid, data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        'openShop': function (data, core, callback) {
            core.ui.drawShop(data.event.shopid);
            if (core.isset(callback))
                callback();
        },
        'passNet': function (data, core, callback) {
            core.events.passNet(data);
            if (core.isset(callback))
                callback();
        },
        "checkBlock": function (data, core, callback) {
            core.events.checkBlock(data.x, data.y);
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

    core.hideStartAnimate(function() {
        core.drawText(core.firstData.startText, function() {
            core.startGame(hard);
        });
    })
}

////// 走到某位置时触发事件 //////
events.prototype.blockEvent = function (data) {
}

////// 检查领域、夹击事件 //////
events.prototype.checkBlock = function (x,y) {
    var damage = 0;
    // 获得四个方向的怪物
    var directions = [[0,-1],[-1,0],[0,1],[1,0]]; // 上，左，下，右
    var enemys = [null,null,null,null];
    for (var i in directions) {
        var block = core.getBlock(x+directions[i][0], y+directions[i][1]);
        if (block==null) continue;
        // 是怪物
        if (block.block.event.cls=='enemys')
            enemys[i]=core.material.enemys[block.block.event.id];
    }

    // 领域
    for (var i in enemys) {
        if (enemys[i]!=null && enemys[i].special==15) {
            damage+=enemys[i].value;
        }
    }
    if (damage>0)
        core.drawTip('受到领域伤害'+damage+'点');
    core.status.hero.hp-=damage;
    if (core.status.hero.hp<=0) {
        core.status.hero.hp=0;
        core.updateStatusBar();
        core.events.lose('zone');
        return;
    }

    // 夹击
    var has=false;
    if (enemys[0]!=null && enemys[2]!=null && enemys[0].id==enemys[2].id && enemys[0].special==16)
        has=true;
    if (enemys[1]!=null && enemys[3]!=null && enemys[1].id==enemys[3].id && enemys[1].special==16)
        has=true;
    if (has && core.status.hero.hp>1) { // 1血夹击不死
        core.status.hero.hp = parseInt(core.status.hero.hp/2);
        core.drawTip('受到夹击，生命变成一半');
    }
    core.updateStatusBar();
}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId) {
    if (!core.hasFlag("visited_"+floorId)) {
        this.doEvents(core.status.thisMap.firstArrive);
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
            'list': list, 'x': x, 'y': y, 'callback': callback
        }}
        core.events.doAction();
    });
}

events.prototype.doAction = function() {
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
        case "disappear": // 消失
            core.removeBlock('event', x, y);
            this.doAction();
            break;
        case "sleep": // 等待多少毫秒
            setTimeout(function () {
                core.events.doAction();
            }, data.data);
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

////// 降低难度 //////
events.prototype.decreaseHard = function() {
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
}

////// 能否使用快捷商店 //////
events.prototype.canUseQuickShop = function(index) {
    if (core.status.floorId == 'MT20') return '当前不能使用快捷商店。';
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

    if (core.canUseItem(itemId)) core.useItem(itemId);
    else core.drawTip("当前无法使用"+core.material.items[itemId].name);
}

/****** 打完怪物 ******/
events.prototype.afterBattle = function(enemyId,x,y,callback) {

    // 毒衰咒的处理
    var special = core.material.enemys[enemyId].special;
    // 中毒
    if (special==12 && !core.hasFlag('poison')) {
        core.setFlag('poison', true);
        core.updateStatusBar();
    }
    // 衰弱
    if (special==13 && !core.hasFlag('weak')) {
        core.setFlag('weak', true);
        core.status.hero.atk-=core.flags.weakValue;
        core.status.hero.def-=core.flags.weakValue;
        core.updateStatusBar();
    }
    // 诅咒
    if (special==14 && !core.hasFlag('curse')) {
        core.setFlag('curse', true);
        core.updateStatusBar();
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
    if (data.event.id=='lavaNet') {
        core.status.hero.hp -= core.flags.lavaDamage;
        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose('lava');
            return;
        }
        core.updateStatusBar();
        core.drawTip('经过血网，生命-'+core.flags.lavaDamage);
    }
    if (data.event.id=='poisonNet') {
        if (core.hasFlag('poison')) return;
        core.setFlag('poison', true);
        core.updateStatusBar();
    }
    if (data.event.id=='weakNet') {
        if (core.hasFlag('weak')) return;
        core.setFlag('weak', true);
        core.status.hero.atk-=core.flags.weakValue;
        core.status.hero.def-=core.flags.weakValue;
        core.updateStatusBar();
    }
    if (data.event.id=='curseNet') {
        if (core.hasFlag('curse')) return;
        core.setFlag('curse', true);
        core.updateStatusBar();
    }
}

// NPC自定义操作
events.prototype.npcCustomAction = function (npcData) {

}

// 当点击(x,y)位置后自定义操作
events.prototype.npcCustomActionOnClick = function (npcData, x, y) {

}

// NPC自定义事件处理
events.prototype.npcCustomEffect = function (effect, npc) {

}

// 存档事件前一刻的处理
events.prototype.beforeSaveData = function(data) {

}

// 读档事件后，载入事件前，对数据的处理
events.prototype.afterLoadData = function(data) {

}

events.prototype.win = function(reason) {
    // 获胜
    core.waitHeroToStop(function() {
        core.clearMap('all');
        core.rmGlobalAnimate(0,0,true);
        core.drawText([
            "\t[结局3]恭喜通关！"
        ], function () {
            core.restart();
        })
    });
}

events.prototype.lose = function(reason) {
    // 失败
    core.waitHeroToStop(function() {
        core.drawText('\t[结局1]你死了。', function () {
            core.restart();
        });
    })
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
    if (core.status.event.data == null) {
        console.log("发生错误，商店不存在？");
        return;
    }
    if (x >= 5 && x <= 7) {
        if (y >= 5 && y <= 8) {
            if (y >= 5 + core.status.event.data.choices.length) return;

            var money = core.getStatus('money'), experience = core.getStatus('experience');

            var shop = core.status.event.data;
            var times = shop.times, need = eval(shop.need);
            var use = shop.use;
            var use_text = use=='money'?"金币":"经验";

            var choice = shop.choices[y-5];
            if (core.isset(choice.need))
                need = eval(choice.need);

            if (need > eval(use)) {
                core.drawTip("你的"+use_text+"不足");
                return;
            }

            eval(use+'-='+need);
            core.setStatus('money', money);
            core.setStatus('experience', experience);
            core.updateStatusBar();

            core.npcEffect(choice.effect);

            core.status.event.data.times++;
            core.ui.openShop(core.status.event.data.id);
            return;
        }

        // 退出商店
        if (y == 9) {
            core.status.event.data = null;
            core.ui.closePanel();
            return;
        }
    }
}

// 快捷商店
events.prototype.clickSelectShop = function(x,y) {
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
            var shop=shopList[keys[y - topIndex]];
            if (!shop.visited) {
                if (shop.times==0) core.drawTip('该商店尚未开启');
                else core.drawTip('该商店已失效');
                return;
            }
            core.ui.drawShop(keys[y - topIndex]);
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

// 菜单栏
events.prototype.clickSettings = function (x,y) {
    if (x<5 || x>7) return;
    if (y == 3) {
        if (core.musicStatus.isIOS) {
            core.drawTip("iOS设备不支持播放音乐");
            return;
        }
        core.changeSoundStatus();
        core.ui.drawSettings(false);
    }
    if (y == 4) core.ui.drawSelectShop();
    if (y == 5) this.decreaseHard();
    if (y == 6) {
        core.ui.drawSyncSave();
    }
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

events.prototype.clickNPC = function(x,y) {

    var data = core.status.event.data.current;
    if (core.isset(data)) {

        // 对话，任意位置继续
        if (data.action == 'text') {
            core.npcAction();
            return;
        }
        if (data.action == 'choices') {
            if (x >= 5 && x <= 7) {
                if (y >= 5 && y <= 8) {
                    if (y >= 5 + data.choices.length) return;

                    var choice = data.choices[y - 5];
                    if (core.isset(choice.need)) {
                        var able = true;
                        choice.need.split(';').forEach(function (e) {
                            var ones = e.split(',');
                            var type = ones[0], key = ones[1], value = ones[2];
                            if (type == 'status') {
                                if (core.getStatus(key)<parseInt(value)) able=false;
                            }
                            else if (type == 'item') {
                                if (core.itemCount(key)<parseInt(value)) able=false;
                            }
                        });
                        if (!able) {
                            core.drawTip("无法选择此项");
                            return;
                        }
                        choice.need.split(';').forEach(function (e) {
                            var ones = e.split(',');
                            var type = ones[0], key = ones[1], value = ones[2];
                            if (type == 'status') {
                                core.setStatus(key, core.getStatus(key)-parseInt(value));
                            }
                            else if (type == 'item') {
                                core.setItem(key, core.itemCount(key)-parseInt(value));
                            }
                        });
                    }
                    core.npcEffect(choice.effect);
                    core.npcAction();
                    return;
                }

                // 退出商店
                if (y == 9 && !(core.isset(data.cancel) && !data.cancel)) {
                    core.status.event.data = null;
                    core.ui.closePanel();
                    return;
                }
            }
        }
        if (data.action == 'custom') {
            core.events.npcCustomActionOnClick(data, x, y);
            return;
        }
    }
}

/*********** 点击事件 END ***************/
