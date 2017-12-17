/**
 * ui.js：负责所有和UI界面相关的绘制
 * 包括：
 * 自动寻路、怪物手册、楼传器、存读档、菜单栏、NPC对话事件、等等
 */
function ui() {}

// 初始化UI
ui.prototype.init = function () {
}

main.instance.ui = new ui();


/**
 * 关闭一切UI窗口
 * @param clearData 是否同时清掉data层
 */
ui.prototype.closePanel = function (clearData) {
    core.status.boxAnimateObjs = [];
    core.setBoxAnimate();
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);
    if (core.isset(clearData) && clearData)
        core.clearMap('data', 0, 0, 416, 416);
    core.unLockControl();
    core.status.event.data = null;
    core.status.event.id = null;
}


/**
 * 绘制对话框
 * @param content
 * @param id
 */
ui.prototype.drawTextBox = function(content) {

    // 获得name, image, icon
    var id=null, name=null, image=null, icon=null;
    if (content.indexOf("\t[")==0) {
        var index = content.indexOf("]");
        if (index>=0) {
            var str=content.substring(2, index);
            content=content.substring(index+1);
            var ss=str.split(",");
            if (ss.length==1) {
                // id
                id=ss[0];
                // monster
                if (id!='hero') {
                    var enemys = core.material.enemys[id];
                    if (core.isset(enemys)) {
                        name = core.material.enemys[id].name;
                        image = core.material.images.enemys;
                        icon = core.material.icons.enemys[id];
                    }
                    else {
                        name=id;
                        id='npc';
                        image=null;
                        icon=null;
                    }
                }
            }
            else {
                id='npc';
                name=ss[0];
                image=core.material.images.npcs;
                icon=core.material.icons.npcs[ss[1]];
            }
        }
    }

    content = core.replaceText(content);

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    // var contents = content.split('\n');
    // var contents = core.splitLines('ui', content, );
    var left=10, right=416-2*left;
    var content_left = left + 25;
    if (id=='hero' || core.isset(icon)) content_left=left+63;

    var validWidth = right-(content_left-left)-13;
    var contents = core.splitLines("ui", content, validWidth, '16px Verdana');

    var height = 416 - 10 - Math.min(416-24*(contents.length+1)-65, 250);
    var top = (416-height)/2, bottom = height;

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', left, top, right, bottom, '#000000');
    core.setAlpha('ui', 1);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);
    core.status.boxAnimateObjs = [];
    core.setBoxAnimate();

    // 名称
    core.canvas.ui.textAlign = "left";

    var content_top = top + 35;
    if (core.isset(id)) {

        content_top = top+57;

        if (id == 'hero') {
            var heroHeight=core.material.icons.hero.height;
            core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, heroHeight+2, '#FFD700', 2);
            core.fillText('ui', core.status.hero.name, content_left, top + 30, '#FFD700', 'bold 22px Verdana');
            core.clearMap('ui', left + 15, top + 40, 32, heroHeight);
            core.fillRect('ui', left + 15, top + 40, 32, heroHeight, background);
            var heroIcon = core.material.icons.hero['down'];
            core.canvas.ui.drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc * heroHeight, 32, heroHeight, left+15, top+40, 32, heroHeight);
        }
        else {
            core.fillText('ui', name, content_left, top + 30, '#FFD700', 'bold 22px Verdana');
            if (core.isset(icon)) {
                core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, 34, '#FFD700', 2);
                core.status.boxAnimateObjs = [];
                core.status.boxAnimateObjs.push({
                    'bgx': left + 15, 'bgy': top + 40, 'bgsize': 32,
                    'image': image, 'x': left + 15, 'y': top + 40, 'icon': icon
                });
                core.setBoxAnimate();
            }
        }
    }

    for (var i=0;i<contents.length;i++) {
        core.fillText('ui', contents[i], content_left, content_top, '#FFFFFF', '16px Verdana');
        content_top+=24;
    }

    core.fillText('ui', '<点击任意位置继续>', 270, top+height-13, '#CCCCCC', '13px Verdana');
}

// 绘制选项事件
ui.prototype.drawChoices = function(content, choices) {

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    // Step 1: 计算长宽高
    var length = choices.length;
    var left=85, width = 416-2*left; // 宽度
    // 高度
    var height = 32*(length+2), bottom = 208+height/2;
    if (length%2==0) bottom+=16;
    var choice_top = bottom-height+56;

    var id=null, name=null, image=null, icon=null;

    var contents = null;
    var content_left = left + 15;

    if (core.isset(content)) {
        // 获得name, image, icon
        if (content.indexOf("\t[")==0) {
            var index = content.indexOf("]");
            if (index>=0) {
                var str=content.substring(2, index);
                content=content.substring(index+1);
                var ss=str.split(",");
                if (ss.length==1) {
                    // id
                    id=ss[0];
                    // monster
                    if (id!='hero') {
                        var enemys = core.material.enemys[id];
                        if (core.isset(enemys)) {
                            name = core.material.enemys[id].name;
                            image = core.material.images.enemys;
                            icon = core.material.icons.enemys[id];
                        }
                        else {
                            name=id;
                            id='npc';
                            image=null;
                            icon=null;
                        }
                    }
                }
                else {
                    id='npc';
                    name=ss[0];
                    image=core.material.images.npcs;
                    icon=core.material.icons.npcs[ss[1]];
                }
            }
        }
        content = core.replaceText(content);

        if (id=='hero' || core.isset(icon))
            content_left = left+60;

        contents = core.splitLines('ui', content, width-(content_left-left)-10, 'bold 15px Verdana');

        // content部分高度
        var cheight=0;
        // 如果含有标题，标题高度
        if (name!=null) cheight+=25;
        cheight += contents.length*20;
        height+=cheight;
    }
    var top = bottom-height;

    core.fillRect('ui', left, top, width, height, background);
    core.strokeRect('ui', left - 1, top - 1, width + 1, height + 1, '#FFFFFF', 2);

    // 如果有内容
    if (core.isset(contents)) {

        var content_top = top + 35;

        if (core.isset(id)) {
            core.canvas.ui.textAlign = "center";

            content_top = top+55;
            var title_offset = left+width/2;
            // 动画
            if (id=='hero' || core.isset(icon))
                title_offset += 22;

            if (id == 'hero') {
                var heroHeight = core.material.icons.hero.height;
                core.strokeRect('ui', left + 15 - 1, top + 30 - 1, 34, heroHeight+2, '#DDDDDD', 2);
                core.fillText('ui', core.status.hero.name, title_offset, top + 27, '#FFD700', 'bold 19px Verdana');
                core.clearMap('ui', left + 15, top + 30, 32, heroHeight);
                core.fillRect('ui', left + 15, top + 30, 32, heroHeight, background);
                var heroIcon = core.material.icons.hero['down'];
                core.canvas.ui.drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc *heroHeight, 32, heroHeight, left+15, top+30, 32, heroHeight);
            }
            else {
                core.fillText('ui', name, title_offset, top + 27, '#FFD700', 'bold 19px Verdana');
                if (core.isset(icon)) {
                    core.strokeRect('ui', left + 15 - 1, top + 30 - 1, 34, 34, '#DDDDDD', 2);
                    core.status.boxAnimateObjs = [];
                    core.status.boxAnimateObjs.push({
                        'bgx': left + 15, 'bgy': top + 30, 'bgsize': 32,
                        'image': image, 'x': left + 15, 'y': top + 30, 'icon': icon
                    });
                    core.setBoxAnimate();
                }
            }
        }

        core.canvas.ui.textAlign = "left";
        for (var i=0;i<contents.length;i++) {
            core.fillText('ui', contents[i], content_left, content_top, '#FFFFFF', 'bold 15px Verdana');
            content_top+=20;
        }
    }

    // 选项
    core.canvas.ui.textAlign = "center";
    for (var i = 0; i < choices.length; i++) {
        core.fillText('ui', core.replaceText(choices[i].text), 208, choice_top + 32 * i, "#FFFFFF", "bold 17px Verdana");
    }
    return;

}

/**
 * 绘制确认/取消警告
 * @param text
 * @param yesCallback
 * @param noCallback
 */
ui.prototype.drawConfirmBox = function (text, yesCallback, noCallback) {
    core.status.event.id = 'confirmBox';
    core.status.event.data = {'yes': yesCallback, 'no': noCallback};

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);
    core.setFont('ui', "bold 19px Verdana");

    var contents = text.split('\n');
    var lines = contents.length;
    var max_length = 0;
    for (var i in contents) {
        max_length = Math.max(max_length, core.canvas.ui.measureText(contents[i]).width);
    }

    var left = Math.min(208 - 40 - max_length / 2, 100);
    var top = 140 - (lines-1)*30;
    var right = 416 - 2 * left, bottom = 416 - 140 - top;

    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);
    core.canvas.ui.textAlign = "center";
    for (var i in contents) {
        core.fillText('ui', contents[i], 208, top + 50 + i*30, "#FFFFFF");
    }

    core.fillText('ui', "确定", 208 - 38, top + bottom - 35, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "取消", 208 + 38, top + bottom - 35);
}

/**
 * 绘制菜单栏
 * @param need
 */
ui.prototype.drawSettings = function (need) {
    if (!core.checkStatus('settings', need))
        return;

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);
    var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    core.canvas.ui.textAlign = "center";
    core.fillText('ui', "音乐： " + (core.musicStatus.soundStatus ? "[ON]" : "[OFF]"), 208, top + 56, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', '战斗过程： ' +(core.flags.battleAnimate?'[ON]':'[OFF]'), 208, top + 88, "#FFFFFF", "bold 17px Verdana")
    core.fillText('ui', "快捷商店", 208, top + 120, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "同步存档", 208, top + 152, "#FFFFFF", "bold 17px Verdana");
    // core.fillText('ui', "清空存档", 208, top + 152, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "重新开始", 208, top + 184, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "关于本塔", 208, top + 216, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "返回游戏", 208, top + 248, "#FFFFFF", "bold 17px Verdana");

}

/**
 * 绘制“选择商店”窗口
 * @param need
 */
ui.prototype.drawQuickShop = function (need) {

    if (core.isset(need) && !core.checkStatus('selectShop', need))
        return;

    core.status.event.id = 'selectShop';
    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    var shopList = core.status.shops, keys = Object.keys(shopList);
    var len = keys.length + 1;
    if (len % 2 == 0) len++;

    var left = 97, top = 208 - 32 - 16 * len, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    core.canvas.ui.textAlign = "center";
    for (var i = 0; i < keys.length; i++) {
        core.fillText('ui', shopList[keys[i]].textInList, 208, top + 56 + 32 * i, "#FFFFFF", "bold 17px Verdana");
    }

    core.fillText('ui', "返回游戏", 208, top + bottom - 40);

}

ui.prototype.drawBattleAnimate = function(monsterId, callback) {

    // UI层
    core.lockControl();
    if (!core.isset(core.status.event.id)) {
        core.status.event = {'id': 'battle'};
    }

    var hero_hp = core.getStatus('hp'), hero_atk = core.getStatus('atk'), hero_def = core.getStatus('def'),
        hero_mdef = core.getStatus('mdef');
    var monster = core.material.enemys[monsterId];
    var mon_hp = monster.hp, mon_atk = monster.atk, mon_def = monster.def, mon_money=monster.money, mon_exp = monster.experience, mon_special=monster.special;

    hero_hp -= core.enemys.getExtraDamage(monster);

    if (core.enemys.hasSpecial(mon_special, 2)) hero_def=0; // 魔攻
    if (core.enemys.hasSpecial(mon_special, 3) && mon_def<hero_atk) mon_def=hero_atk-1; // 坚固
    if (core.enemys.hasSpecial(mon_special, 10)) { // 模仿
        mon_atk=hero_atk;
        mon_def=hero_def;
    }

    // 实际操作
    var turn = 0; // 0为勇士攻击
    if (core.enemys.hasSpecial(mon_special, 1)) turn=1;

    // 回合
    var turns = 2;
    if (core.enemys.hasSpecial(mon_special, 4)) turns=3;
    if (core.enemys.hasSpecial(mon_special, 5)) turns=4;
    if (core.enemys.hasSpecial(mon_special, 6)) turns=5;


    // 初始伤害（破甲、净化）
    var initDamage = 0;
    if (core.enemys.hasSpecial(mon_special, 7)) initDamage+=parseInt(core.values.breakArmor * hero_def);
    if (core.enemys.hasSpecial(mon_special, 9)) initDamage=parseInt(core.values.purify * hero_mdef);
    hero_mdef-=initDamage;
    if (hero_mdef<0) {
        hero_hp+=hero_mdef;
        hero_mdef=0;
    }

    var specialText = core.enemys.getSpecialText(monsterId);

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    core.clearMap('ui', 0, 0, 416, 416);
    var left=10, right=416-2*left;


    var lines = core.flags.enableExperience?5:4;

    var lineHeight = 60;
    var height = lineHeight * lines + 50;

    var top = (416-height)/2, bottom = height;

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', left, top, right, bottom, '#000000');
    core.setAlpha('ui', 1);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);
    core.status.boxAnimateObjs = [];
    core.setBoxAnimate();

    var margin = 35;
    var boxWidth = 40;

    // 方块
    var heroHeight = core.material.icons.hero.height;
    core.strokeRect('ui', left + margin - 1, top + margin - 1, boxWidth+2, heroHeight+boxWidth-32+2, '#FFD700', 2);
    core.strokeRect('ui', left + right - margin - boxWidth - 1 , top+margin-1, boxWidth+2, boxWidth+2);

    // 名称
    core.canvas.ui.textAlign='center';
    core.fillText('ui', core.status.hero.name, left+margin+boxWidth/2, top+margin+heroHeight+40, '#FFD700', 'bold 22px Verdana');
    core.fillText('ui', "怪物", left+right-margin-boxWidth/2, top+margin+32+40);
    var specialTexts = specialText.split(" ");
    for (var i=0, j=0; i<specialTexts.length;i++) {
        if (specialTexts[i]!='') {
            core.fillText('ui', specialTexts[i], left+right-margin-boxWidth/2, top+margin+32+44+20*(++j), '#FF6A6A', '15px Verdana');
        }
    }

    // 图标
    core.clearMap('ui', left + margin, top + margin, boxWidth, heroHeight+boxWidth-32);
    core.fillRect('ui', left + margin, top + margin, boxWidth, heroHeight+boxWidth-32, background);
    var heroIcon = core.material.icons.hero['down'];
    core.canvas.ui.drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc *heroHeight, 32, heroHeight, left+margin+(boxWidth-32)/2, top+margin+(boxWidth-32)/2, 32, heroHeight);
    // 怪物的
    core.status.boxAnimateObjs = [];
    core.status.boxAnimateObjs.push({
        'bgx': left + right - margin - 40, 'bgy': top+margin, 'bgsize': boxWidth,
        'image': core.material.images.enemys, 'x': left + right - margin - 40 + (boxWidth-32)/2, 'y': top + margin + (boxWidth-32)/2, 'icon': core.material.icons.enemys[monsterId]
    });
    core.setBoxAnimate();

    var lineWidth = 80;

    var left_start = left + margin + boxWidth + 10;
    var left_end = left_start+lineWidth;

    var right_end = left+right-margin-boxWidth-10;
    var right_start = right_end-lineWidth;

    // 勇士的线
    core.canvas.ui.textAlign='left';
    var textTop = top+margin+10;
    core.fillText('ui', "生命值", left_start, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', left_start, textTop+8, left_end, textTop+8, '#FFFFFF', 2);
    core.canvas.data.textAlign='right';
    core.fillText('data', hero_hp, left_end, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    textTop+=lineHeight;
    core.canvas.ui.textAlign='left';
    core.fillText('ui', "攻击", left_start, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', left_start, textTop+8, left_end, textTop+8, '#FFFFFF', 2);
    core.canvas.ui.textAlign='right';
    core.fillText('ui', hero_atk, left_end, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    textTop+=lineHeight;
    core.canvas.ui.textAlign='left';
    core.fillText('ui', "防御", left_start, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', left_start, textTop+8, left_end, textTop+8, '#FFFFFF', 2);
    core.canvas.ui.textAlign='right';
    core.fillText('ui', hero_def, left_end, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    if (core.flags.enableMDef) {
        textTop += lineHeight;
        core.canvas.ui.textAlign='left';
        core.fillText('ui', "魔防", left_start, textTop, '#DDDDDD', '16px Verdana');
        core.drawLine('ui', left_start, textTop + 8, left_end, textTop + 8, '#FFFFFF', 2);
        core.canvas.data.textAlign='right';
        core.fillText('data', hero_mdef, left_end, textTop+26, '#DDDDDD', 'bold 16px Verdana');
    }

    // 怪物的线
    core.canvas.ui.textAlign='right';
    var textTop = top+margin+10;
    core.fillText('ui', "生命值", right_end, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', right_start, textTop+8, right_end, textTop+8, '#FFFFFF', 2);
    core.canvas.data.textAlign='left';
    core.fillText('data', mon_hp, right_start, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    textTop+=lineHeight;
    core.canvas.ui.textAlign='right';
    core.fillText('ui', "攻击", right_end, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', right_start, textTop+8, right_end, textTop+8, '#FFFFFF', 2);
    core.canvas.ui.textAlign='left';
    core.fillText('ui', mon_atk, right_start, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    textTop+=lineHeight;
    core.canvas.ui.textAlign='right';
    core.fillText('ui', "防御", right_end, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', right_start, textTop+8, right_end, textTop+8, '#FFFFFF', 2);
    core.canvas.ui.textAlign='left';
    core.fillText('ui', mon_def, right_start, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    textTop += lineHeight;
    core.canvas.ui.textAlign='right';
    core.fillText('ui', "金币", right_end, textTop, '#DDDDDD', '16px Verdana');
    core.drawLine('ui', right_start, textTop + 8, right_end, textTop + 8, '#FFFFFF', 2);
    core.canvas.ui.textAlign='left';
    core.fillText('ui', mon_money, right_start, textTop+26, '#DDDDDD', 'bold 16px Verdana');

    if (core.flags.enableExperience) {
        textTop += lineHeight;
        core.canvas.ui.textAlign='right';
        core.fillText('ui', "经验", right_end, textTop, '#DDDDDD', '16px Verdana');
        core.drawLine('ui', right_start, textTop + 8, right_end, textTop + 8, '#FFFFFF', 2);
        core.canvas.ui.textAlign='left';
        core.fillText('ui', mon_exp, right_start, textTop+26, '#DDDDDD', 'bold 16px Verdana');
    }

    core.canvas.ui.textAlign='left';
    core.fillText("ui", "V", left_end+8, 208-15, "#FFFFFF", "italic bold 40px Verdana");

    core.canvas.ui.textAlign='right';
    core.fillText("ui", "S", right_start-8, 208+15, "#FFFFFF", "italic bold 40px Verdana");
/*
    core.drawLine('data', left + right - margin - boxWidth + 6, top+margin+boxWidth-6,
        left+right-margin-6, top+margin+6, '#FF0000', 4);
    core.drawLine('data', left + margin + 6, top+margin+heroHeight+(boxWidth-32)-6,
        left+margin+boxWidth-6, top+margin+6, '#FF0000', 4);
*/

    var battleInterval = setInterval(function() {
        core.playSound("attack", "ogg");

        if (turn==0) {
            // 勇士攻击
            core.drawLine('data', left + right - margin - boxWidth + 6, top+margin+boxWidth-6,
                left+right-margin-6, top+margin+6, '#FF0000', 4);
            setTimeout(function() {
                core.clearMap('data', left + right - margin - boxWidth, top+margin,
                    boxWidth, boxWidth);
            }, 250);

            if (hero_atk-mon_def>0)
                mon_hp-=hero_atk-mon_def;
            if (mon_hp<0) mon_hp=0;

            // 更新怪物伤害
            core.clearMap('data', right_start, top+margin+10, lineWidth, 40);
            core.canvas.data.textAlign='left';
            core.fillText('data', mon_hp, right_start, top+margin+10+26, '#DDDDDD', 'bold 16px Verdana');

            // 反击
            if (core.enemys.hasSpecial(mon_special, 8)) {
                var counterDamage = parseInt(core.values.counterAttack * hero_atk);
                hero_mdef -= counterDamage;

                if (hero_mdef<0) {
                    hero_hp+=hero_mdef;
                    hero_mdef=0;
                }
                // 更新勇士数据
                core.clearMap('data', left_start, top+margin+10, lineWidth, 40);
                core.canvas.data.textAlign='right';
                core.fillText('data', hero_hp, left_end, top+margin+10+26, '#DDDDDD', 'bold 16px Verdana');

                if (core.flags.enableMDef) {
                    core.clearMap('data', left_start, top+margin+10+3*lineHeight, lineWidth, 40);
                    core.fillText('data', hero_mdef, left_end, top+margin+10+26+3*lineHeight);
                }

            }

        }
        else {
            // 怪物攻击
            core.drawLine('data', left + margin + 6, top+margin+heroHeight+(boxWidth-32)-6,
                left+margin+boxWidth-6, top+margin+6, '#FF0000', 4);
            setTimeout(function() {
                core.clearMap('data', left + margin, top+margin, boxWidth, heroHeight+boxWidth-32);
            }, 250);

            var per_damage = mon_atk-hero_def;
            if (per_damage < 0) per_damage = 0;

            hero_mdef-=per_damage;
            if (hero_mdef<0) {
                hero_hp+=hero_mdef;
                hero_mdef=0;
            }
            // 更新勇士数据
            core.clearMap('data', left_start, top+margin+10, lineWidth, 40);
            core.canvas.data.textAlign='right';
            core.fillText('data', hero_hp, left_end, top+margin+10+26, '#DDDDDD', 'bold 16px Verdana');

            if (core.flags.enableMDef) {
                core.clearMap('data', left_start, top+margin+10+3*lineHeight, lineWidth, 40);
                core.fillText('data', hero_mdef, left_end, top+margin+10+26+3*lineHeight);
            }

        }
        turn++;
        if (turn>=turns) turn=0;

        if (hero_hp<=0 || mon_hp<=0) {
            // 战斗结束
            clearInterval(battleInterval);
            core.status.boxAnimateObjs = [];
            core.setBoxAnimate();
            core.clearMap('ui', 0, 0, 416, 416);
            core.setAlpha('ui', 1.0);
            core.clearMap('data', 0, 0, 416, 416);
            if (core.status.event.id=='battle') {
                core.unLockControl();
                core.status.event.id=null;
            }
            if (core.isset(callback))
                callback();
            return;
        }

    }, 500);
}

/**
 * 绘制“请等候...”
 * @param text
 */
ui.prototype.drawWaiting = function(text) {

    core.lockControl();
    core.status.event.id = 'waiting';

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    var left = 97, top = 208 - 32 - 16, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    core.canvas.ui.textAlign = "center";
    core.fillText('ui', text, 208, top + 56, "#FFFFFF", "bold 17px Verdana");

}

/**
 * 绘制“存档同步”选项
 */
ui.prototype.drawSyncSave = function () {

    core.status.event.id = 'syncSave';
    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    var left = 97, top = 208 - 32 - 16 * 3, right = 416 - 2 * left, bottom = 416 - 2 * top + 32;
    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    core.canvas.ui.textAlign = "center";
    core.fillText('ui', "同步存档到服务器", 208, top + 56, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "从服务器加载存档", 208, top + 56 + 32, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "清空本地存档", 208, top + 56 + 64, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "返回游戏", 208, top + bottom - 40);
}

/**
 * 绘制“分页”
 * @param page
 * @param totalPage
 */
ui.prototype.drawPagination = function (page, totalPage) {

    core.setFont('ui', 'bold 15px Verdana');
    core.setFillStyle('ui', '#DDDDDD');

    var length = core.canvas.ui.measureText(page + " / " + page).width;

    core.canvas.ui.textAlign = 'left';
    core.fillText('ui', page + " / " + totalPage, (416 - length) / 2, 403);

    core.canvas.ui.textAlign = 'center';
    if (page > 1)
        core.fillText('ui', '上一页', 208 - 80, 403);
    if (page < totalPage)
        core.fillText('ui', '下一页', 208 + 80, 403);

    // 退出
    core.fillText('ui', '返回游戏', 370, 403);

}

/**
 * 绘制怪物手册
 * @param page 页数
 */
ui.prototype.drawEnemyBook = function (page) {

    var enemys = core.enemys.getCurrentEnemys();
    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    clearInterval(core.interval.tipAnimate);
    core.clearMap('data', 0, 0, 416, 416);
    core.setOpacity('data', 1);

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);
    core.fillRect('ui', 0, 0, 416, 416);

    core.setAlpha('ui', 0.6);
    core.setFillStyle('ui', '#000000');
    core.fillRect('ui', 0, 0, 416, 416);

    core.setAlpha('ui', 1);
    core.canvas.ui.textAlign = 'left';
    core.setFont('ui', 'bold 15px Verdana');

    if (enemys.length == 0) {
        core.fillText('ui', "本层无怪物", 83, 222, '#999999', "bold 50px Verdana");
        // 退出
        core.canvas.ui.textAlign = 'center';
        core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');
        return;
    }

    var perpage = 6;
    var totalPage = parseInt((enemys.length - 1) / perpage) + 1;
    if (page < 1) page = 1;
    if (page > totalPage) page = totalPage;
    core.status.event.data = page;
    var start = (page - 1) * perpage, end = Math.min(page * perpage, enemys.length);

    enemys = enemys.slice(start, end);
    core.status.boxAnimateObjs = [];
    for (var i = 0; i < enemys.length; i++) {
        // 边框
        var enemy = enemys[i];
        core.strokeRect('ui', 22, 62 * i + 22, 42, 42, '#DDDDDD', 2);

        // 怪物
        core.status.boxAnimateObjs.push({
            'bgx': 22, 'bgy': 62 * i + 22, 'bgsize': 42,
            'image': core.material.images.enemys,
            'x': 27, 'y': 62 * i + 27, 'icon': core.material.icons.enemys[enemy.id]
        });

        // 数据
        core.canvas.ui.textAlign = "center";

        if (enemy.special=='') {
            core.fillText('ui', enemy.name, 115, 62 * i + 47, '#DDDDDD', 'bold 17px Verdana');
        }
        else {
            core.fillText('ui', enemy.name, 115, 62 * i + 40, '#DDDDDD', 'bold 17px Verdana');
            core.fillText('ui', enemy.special, 115, 62 * i + 62, '#FF6A6A', 'bold 15px Verdana');
        }
        core.canvas.ui.textAlign = "left";
        core.fillText('ui', '生命', 165, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.hp, 195, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '攻击', 255, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.atk, 285, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '防御', 335, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.def, 365, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '金币', 165, 62 * i + 50, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.money, 195, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');

        var damage_offset = 326;
        if (core.flags.enableExperience) {
            core.canvas.ui.textAlign = "left";
            core.fillText('ui', '经验', 255, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', enemy.experience, 285, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
            damage_offset = 361;
        }

        core.canvas.ui.textAlign = "center";
        var damage = enemy.damage;
        var color = '#FFFF00';
        if (damage >= core.status.hero.hp) color = '#FF0000';
        if (damage == 0) color = '#00FF00';
        if (damage >= 999999999) damage = '无法战斗';
        var length = core.canvas.ui.measureText(damage).width;
        core.fillText('ui', damage, damage_offset, 62 * i + 50, color, 'bold 13px Verdana');

        core.canvas.ui.textAlign = "left";

        core.fillText('ui', '临界', 165, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.critical, 195, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '减伤', 255, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.criticalDamage, 285, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '1防', 335, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', enemy.defDamage, 365, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');

    }
    core.setBoxAnimate();
    this.drawPagination(page, totalPage);
}

/**
 * 绘制楼传器
 * @param page
 */
ui.prototype.drawFly = function(page) {

    if (page<0) page=0;
    if (page>=core.status.hero.flyRange.length) page=core.status.hero.flyRange.length-1;
    core.status.event.data = page;

    var floorId = core.status.hero.flyRange[page];
    var title = core.status.maps[floorId].title;

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, 416, 416, '#000000');
    core.setAlpha('ui', 1);
    core.canvas.ui.textAlign = 'center';
    core.fillText('ui', '楼层跳跃', 208, 60, '#FFFFFF', "bold 28px Verdana");
    core.fillText('ui', '返回游戏', 208, 403, '#FFFFFF', "bold 15px Verdana")
    core.fillText('ui', title, 356, 247, '#FFFFFF', "bold 19px Verdana");
    if (page<core.status.hero.flyRange.length-1)
        core.fillText('ui', '▲', 356, 247-64, '#FFFFFF', "17px Verdana");
    if (page>0)
        core.fillText('ui', '▼', 356, 247+64, '#FFFFFF', "17px Verdana");
    core.strokeRect('ui', 20, 100, 273, 273, '#FFFFFF', 2);
    this.drawThumbnail('ui', core.status.maps[floorId].blocks, 20, 100, 273);
}

/**
 * 绘制工具栏
 * @param selectId
 */
ui.prototype.drawToolbox = function(selectId) {

    if (!core.hasItem(selectId))
        selectId=null;
    core.status.event.data=selectId;

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, 416, 416, '#000000');
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', '#DDDDDD');
    core.setStrokeStyle('ui', '#DDDDDD');
    core.canvas.ui.lineWidth = 2;
    core.canvas.ui.strokeWidth = 2;

    // 画线
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0, 130);
    core.canvas.ui.lineTo(416, 130);
    core.canvas.ui.stroke();
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0,129);
    core.canvas.ui.lineTo(0,105);
    core.canvas.ui.lineTo(72,105);
    core.canvas.ui.lineTo(102,129);
    core.canvas.ui.fill();

    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0, 290);
    core.canvas.ui.lineTo(416, 290);
    core.canvas.ui.stroke();
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0,289);
    core.canvas.ui.lineTo(0,265);
    core.canvas.ui.lineTo(72,265);
    core.canvas.ui.lineTo(102,289);
    core.canvas.ui.fill();

    // 文字
    core.canvas.ui.textAlign = 'left';
    core.fillText('ui', "消耗道具", 5, 124, '#333333', "bold 16px Verdana");
    core.fillText('ui', "永久道具", 5, 284);

    // 描述
    if (core.isset(selectId)) {
        var item=core.material.items[selectId];
        core.fillText('ui', item.name, 10, 32, '#FFD700', "bold 20px Verdana")
        core.fillText('ui', item.text, 10, 62, '#FFFFFF', '17px Verdana');
        core.fillText('ui', '<继续点击该道具即可进行使用>', 10, 89, '#CCCCCC', '14px Verdana');
    }

    core.canvas.ui.textAlign = 'right';
    var images = core.material.images.items;
    // 消耗道具
    var tools = Object.keys(core.status.hero.items.tools).sort();
    for (var i=0;i<tools.length;i++) {
        var tool=tools[i];
        var icon=core.material.icons.items[tool];
        if (i<6) {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*i+1)+5, 144+5, 32, 32)
            // 个数
            core.fillText('ui', core.itemCount(tool), 16*(4*i+1)+40, 144+38, '#FFFFFF', "bold 14px Verdana");
            if (selectId == tool)
                core.strokeRect('ui', 16*(4*i+1)+1, 144+1, 40, 40, '#FFD700');
        }
        else {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i-6)+1)+5, 144+64+5, 32, 32)
            // 个数
            core.fillText('ui', core.itemCount(tool), 16*(4*(i-6)+1)+40, 144+64+38, '#FFFFFF', "bold 14px Verdana");
            if (selectId == tool)
                core.strokeRect('ui', 16*(4*(i-6)+1)+1, 144+64+1, 40, 40, '#FFD700');

        }
    }

    // 永久道具
    var constants = Object.keys(core.status.hero.items.constants).sort();
    for (var i=0;i<constants.length;i++) {
        var constant=constants[i];
        var icon=core.material.icons.items[constant];
        if (i<6) {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*i+1)+5, 304+5, 32, 32)
            // core.fillText('ui', core.itemCount(constant), 16*(4*i+1)+40, 304+38, '#FFFFFF', "bold 16px Verdana")
            if (selectId == constant)
                core.strokeRect('ui', 16*(4*i+1)+1, 304+1, 40, 40, '#FFD700');
        }
        else {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i-6)+1)+5, 304+64+5, 32, 32)
            if (selectId == constant)
                core.strokeRect('ui', 16*(4*(i-6)+1)+1, 304+64+1, 40, 40, '#FFD700');
        }
    }

    // 退出
    core.canvas.ui.textAlign = 'center';
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');
}

/**
 * 绘制存档、读档
 * @param page
 */
ui.prototype.drawSLPanel = function(page) {

    if (page<0) page=0;
    if (page>=30) page=29;
    core.status.event.data = page;
    core.status.savePage = page;

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, 416, 416, '#000000');
    core.setAlpha('ui', 1);
    core.canvas.ui.textAlign = 'center';

    var u=416/6, size=117;

    var name=core.status.event.id=='save'?"存档":"读档";
    for (var i=0;i<6;i++) {
        var id=6*page+i+1;
        var data=core.getLocalStorage("save"+id,null);

        if (i<3) {
            core.fillText('ui', name+id, (2*i+1)*u, 35, '#FFFFFF', "bold 17px Verdana");
            core.strokeRect('ui', (2*i+1)*u-size/2, 50, size, size, '#FFFFFF', 2);
            if (core.isset(data) && core.isset(data.floorId)) {
                this.drawThumbnail('ui', core.maps.load(data.maps, data.floorId).blocks, (2*i+1)*u-size/2, 50, size, data.hero.loc);
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i+1)*u, 65+size, '#FFFFFF', '10px Verdana');
            }
            else {
                core.fillRect('ui', (2*i+1)*u-size/2, 50, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i+1)*u, 117, '#FFFFFF', 'bold 30px Verdana');
            }
        }
        else {
            core.fillText('ui', name+id, (2*i-5)*u, 230, '#FFFFFF', "bold 17px Verdana");
            core.strokeRect('ui', (2*i-5)*u-size/2, 245, size, size, '#FFFFFF', 2);
            if (core.isset(data) && core.isset(data.floorId)) {
                this.drawThumbnail('ui', core.maps.load(data.maps, data.floorId).blocks, (2*i-5)*u-size/2, 245, size, data.hero.loc);
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i-5)*u, 260+size, '#FFFFFF', '10px Verdana');
            }
            else {
                core.fillRect('ui', (2*i-5)*u-size/2, 245, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i-5)*u, 245+70, '#FFFFFF', 'bold 30px Verdana');
            }
        }
    }
    this.drawPagination(page+1, 30);

}

ui.prototype.drawThumbnail = function(canvas, blocks, x, y, size, heroLoc) {
    core.clearMap(canvas, x, y, size, size);
    var persize = size/13;
    for (var i=0;i<13;i++) {
        for (var j=0;j<13;j++) {
            var blockIcon = core.material.icons.terrains.ground;
            var blockImage = core.material.images.terrains;
            core.canvas[canvas].drawImage(blockImage, 0, blockIcon * 32, 32, 32, x + i * persize, y + j * persize, persize, persize);
        }
    }
    var autotileMaps = [];
    for (var b in blocks) {
        var block = blocks[b];
        if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable)) {
            if (block.event.cls == 'autotile') {
                // core.drawAutotile();
                autotileMaps[13*block.x + block.y] = true;
                continue;
            }
            else {
                var blockIcon = core.material.icons[block.event.cls][block.event.id];
                var blockImage = core.material.images[block.event.cls];
                core.canvas[canvas].drawImage(blockImage, 0, blockIcon * 32, 32, 32, x + block.x * persize, y + block.y * persize, persize, persize);
            }
        }
    }
    core.drawAutotile('ui', autotileMaps, x, y, persize);

    if (core.isset(heroLoc)) {
        var heroIcon = core.material.icons.hero[heroLoc.direction];
        var height = core.material.icons.hero.height;
        var realHeight = persize*height/32;
        core.canvas[canvas].drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc * height, 32, height, x+persize*heroLoc.x, y+persize*heroLoc.y+persize-realHeight, persize, realHeight);
    }
}

/**
 * 绘制"关于"
 */
ui.prototype.drawAbout = function() {

    if (!core.isPlaying()) {
        core.status.event = {'id': null, 'data': null};
        core.dom.startPanel.style.display = 'none';
    }
    core.lockControl();
    core.status.event.id = 'about';

    core.clearMap('ui', 0, 0, 416, 416);
    var left = 48, top = 36, right = 416 - 2 * left, bottom = 416 - 2 * top;

    core.setAlpha('ui', 0.85);
    core.fillRect('ui', left, top, right, bottom, '#000000');
    core.setAlpha('ui', 1);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    var text_start = left + 24;

    // 名称
    core.canvas.ui.textAlign = "left";
    core.fillText('ui', "HTML5 魔塔样板", text_start, top+35, "#FFD700", "bold 22px Verdana");
    core.fillText('ui', "作者： 艾之葵", text_start, top + 80, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', 'HTML5魔塔交流群：539113091', text_start, top+112);
    // TODO: 写自己的“关于”页面
    /*
    core.fillText('ui', "原作： ss433_2", text_start, top + 112, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "制作工具： WebStorm", text_start, top + 144, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "测试平台： Chrome/微信/iOS", text_start, top + 176, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', '特别鸣谢： ss433_2', text_start, top+208);
    var len = core.canvas.ui.measureText('特别鸣谢： ').width;
    core.fillText('ui', 'iEcho', text_start+len, top+240);
    core.fillText('ui', '打Dota的喵', text_start+len, top+272);
    core.fillText('ui', 'HTML5魔塔交流群：539113091', text_start, top+304);
    */
}