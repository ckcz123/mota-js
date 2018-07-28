/**
 * ui.js：负责所有和UI界面相关的绘制
 * 包括：
 * 自动寻路、怪物手册、楼传器、存读档、菜单栏、NPC对话事件、等等
 */
function ui() {
    this.init();
}

// 初始化UI
ui.prototype.init = function () {
    this.uidata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.ui;
}

////////////////// 地图设置

////// 清除地图 //////
ui.prototype.clearMap = function (map, x, y, width, height) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].clearRect(0, 0, 416, 416);
        }
        core.dom.gif.innerHTML = "";
    }
    else {
        core.canvas[map].clearRect(x||0, y||0, width||416, height||416);
    }
}

////// 在某个canvas上绘制一段文字 //////
ui.prototype.fillText = function (map, text, x, y, style, font) {
    if (core.isset(style)) {
        core.setFillStyle(map, style);
    }
    if (core.isset(font)) {
        core.setFont(map, font);
    }
    core.canvas[map].fillText(text, x, y);
}

////// 在某个canvas上绘制一个矩形 //////
ui.prototype.fillRect = function (map, x, y, width, height, style) {
    if (core.isset(style)) {
        core.setFillStyle(map, style);
    }
    core.canvas[map].fillRect(x, y, width, height);
}

////// 在某个canvas上绘制一个矩形的边框 //////
ui.prototype.strokeRect = function (map, x, y, width, height, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    core.canvas[map].strokeRect(x, y, width, height);
}

////// 在某个canvas上绘制一条线 //////
ui.prototype.drawLine = function (map, x1, y1, x2, y2, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    core.canvas[map].beginPath();
    core.canvas[map].moveTo(x1, y1);
    core.canvas[map].lineTo(x2, y2);
    core.canvas[map].closePath();
    core.canvas[map].stroke();
}

////// 设置某个canvas的文字字体 //////
ui.prototype.setFont = function (map, font) {
    core.canvas[map].font = font;
}

////// 设置某个canvas的线宽度 //////
ui.prototype.setLineWidth = function (map, lineWidth) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].lineWidth = lineWidth;
        }
    }
    core.canvas[map].lineWidth = lineWidth;
}

////// 保存某个canvas状态 //////
ui.prototype.saveCanvas = function (map) {
    core.canvas[map].save();
}

////// 加载某个canvas状态 //////
ui.prototype.loadCanvas = function (map) {
    core.canvas[map].restore();
}

////// 设置某个canvas边框属性 //////
ui.prototype.setStrokeStyle = function (map, style) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].strokeStyle = style;
        }
    }
    else {
        core.canvas[map].strokeStyle = style;
    }
}

////// 设置某个canvas的alpha值 //////
ui.prototype.setAlpha = function (map, alpha) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].globalAlpha = alpha;
        }
    }
    else core.canvas[map].globalAlpha = alpha;
}

////// 设置某个canvas的透明度 //////
ui.prototype.setOpacity = function (map, opacity) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].canvas.style.opacity = opacity;
        }
    }
    else core.canvas[map].canvas.style.opacity = opacity;
}

////// 设置某个canvas的绘制属性（如颜色等） //////
ui.prototype.setFillStyle = function (map, style) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].fillStyle = style;
        }
    }
    else {
        core.canvas[map].fillStyle = style;
    }
}



///////////////// UI绘制

////// 结束一切事件和绘制，关闭UI窗口，返回游戏进程 //////
ui.prototype.closePanel = function () {
    core.status.boxAnimateObjs = [];
    clearInterval(core.status.event.interval);
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);
    core.unLockControl();
    core.status.event.data = null;
    core.status.event.id = null;
    core.status.event.selection = null;
    core.status.event.ui = null;
    core.status.event.interval = null;
}

////// 左上角绘制一段提示 //////
ui.prototype.drawTip = function (text, itemIcon) {
    var textX, textY, width, height, hide = false, opacityVal = 0;
    clearInterval(core.interval.tipAnimate);
    core.setFont('data', "16px Arial");
    core.setOpacity('data', 0);
    core.canvas.data.textAlign = 'left';
    if (!core.isset(itemIcon)) {
        textX = 16;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 16;
        height = 42;
    }
    else {
        textX = 44;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 8;
        height = 42;
    }
    core.interval.tipAnimate = window.setInterval(function () {
        if (hide) {
            opacityVal -= 0.1;
        }
        else {
            opacityVal += 0.1;
        }
        core.setOpacity('data', opacityVal);
        core.clearMap('data', 5, 5, 400, height);
        core.fillRect('data', 5, 5, width, height, '#000');
        if (core.isset(itemIcon)) {
            core.canvas.data.drawImage(core.material.images.items, 0, itemIcon * 32, 32, 32, 10, 8, 32, 32);
        }
        core.fillText('data', text, textX + 5, textY + 15, '#fff');
        if (opacityVal > 0.6 || opacityVal < 0) {
            if (hide) {
                core.clearMap('data', 5, 5, 400, height);
                core.setOpacity('data', 1);
                clearInterval(core.interval.tipAnimate);
                return;
            }
            else {
                if (!core.isset(core.timeout.getItemTipTimeout)) {
                    core.timeout.getItemTipTimeout = window.setTimeout(function () {
                        hide = true;
                        core.timeout.getItemTipTimeout = null;
                    }, 750);
                }
                opacityVal = 0.6;
                core.setOpacity('data', opacityVal);
            }
        }
    }, 30);
}

////// 地图中间绘制一段文字 //////
ui.prototype.drawText = function (contents, callback) {
    if (core.isset(contents)) {

        // 合并
        if ((core.isset(core.status.event)&&core.status.event.id=='action') || (core.isset(core.status.replay)&&core.status.replay.replaying)) {
            core.insertAction(contents,null,null,callback);
            return;
        }

        if (typeof contents == 'string') {
            contents = [{'content': contents}];
        }
        else if (contents instanceof Object && core.isset(contents.content)) {
            contents = [contents];
        }
        else if (!(contents instanceof Array)) {
            core.drawTip("出错了");
            console.log(contents);
            return;
        }

        core.status.event = {'id': 'text', 'data': {'list': contents, 'callback': callback}};
        core.lockControl();

        // wait the hero to stop
        core.stopAutomaticRoute();
        setTimeout(function() {
            core.drawText();
        }, 30);
        return;
    }

    if (core.status.event.data.list.length==0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel(false);
        if (core.isset(callback)) callback();
        return;
    }

    var data=core.status.event.data.list.shift();
    if (typeof data == 'string')
        core.ui.drawTextBox(data);
    else
        core.ui.drawTextBox(data.content, data.id);
    // core.drawTextBox(content);
}

////// 绘制一个对话框 //////
ui.prototype.drawTextBox = function(content) {

    clearInterval(core.status.event.interval);

    // 获得name, image, icon
    var id=null, name=null, image=null, icon=null, iconHeight=32, animate=null;
    if (content.indexOf("\t[")==0 || content.indexOf("\\t[")==0) {
        var index = content.indexOf("]");
        if (index>=0) {
            var str=content.substring(2, index);
            if (content.indexOf("\\t[")==0) str=content.substring(3, index);
            content=content.substring(index+1);
            var ss=str.split(",");
            if (ss.length==1) {
                // id
                id=ss[0];
                if (id=='hero') {
                    name = core.status.hero.name;
                }
                else {
                    if (core.isset(core.material.enemys[id])) {
                        name = core.material.enemys[id].name;

                        if (core.isset(core.material.icons.enemy48[id])) {
                            image = core.material.images.enemy48;
                            icon = core.material.icons.enemy48[id];
                            iconHeight = 48;
                            animate=4;
                        }
                        else {
                            image = core.material.images.enemys;
                            icon = core.material.icons.enemys[id];
                            iconHeight = 32;
                            animate=2;
                        }
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
                name=ss[0];
                id = 'npc';
                if (ss[1]=='hero') {
                    id = 'hero';
                }
                else if (core.isset(core.material.icons.npc48[ss[1]])) {
                    image = core.material.images.npc48;
                    icon = core.material.icons.npc48[ss[1]];
                    iconHeight = 48;
                    animate=4;
                }
                else if (core.isset(core.material.icons.npcs[ss[1]])){
                    image = core.material.images.npcs;
                    icon = core.material.icons.npcs[ss[1]];
                    iconHeight = 32;
                    animate=2;
                }
                else if (core.isset(core.material.icons.enemy48[ss[1]])) {
                    image = core.material.images.enemy48;
                    icon = core.material.icons.enemy48[ss[1]];
                    iconHeight = 48;
                    animate=4;
                }
                else if (core.isset(core.material.icons.enemys[ss[1]])) {
                    image = core.material.images.enemys;
                    icon = core.material.icons.enemys[ss[1]];
                    iconHeight = 32;
                    animate=2;
                }
            }
        }
    }

    // 获得位置信息

    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute;

    var position = textAttribute.position, px=null, py=null, ydelta=iconHeight-32;
    if (content.indexOf("\b[")==0 || content.indexOf("\\b[")==0) {
        var index = content.indexOf("]");
        if (index>=0) {
            var str = content.substring(2, index);
            if (content.indexOf("\\b[")==0) str = content.substring(3, index);
            content = content.substring(index + 1);

            var ss=str.split(",");

            if (ss[0]=='up' || ss[0]=='center' || ss[0]=='down') {
                position=ss[0];
                if (core.status.event.id=='action') {
                    px = core.status.event.data.x;
                    py = core.status.event.data.y;
                }

                if (ss.length>=2) {
                    if (ss[1]=='hero') {
                        px=core.getHeroLoc('x');
                        py=core.getHeroLoc('y');
                        ydelta = core.material.icons.hero.height-32;
                    }
                    else if (ss.length>=3) {
                        px=parseInt(ss[1]);
                        py=parseInt(ss[2]);
                    }
                }
            }
        }
    }

    content = core.replaceText(content);

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.status.boxAnimateObjs = [];
    core.clearMap('ui', 0, 0, 416, 416);

    // var contents = content.split('\n');
    // var contents = core.splitLines('ui', content, );
    var left=10, right=416-2*left;
    var content_left = left + 25;
    if (id=='hero' || core.isset(icon)) content_left=left+63;

    var validWidth = right-(content_left-left)-13;
    var font = '16px Verdana';
    if (textAttribute.bold) font = "bold "+font;
    var contents = core.splitLines("ui", content, validWidth, font);

    var height = 20 + 21*(contents.length+1) + (id=='hero'?core.material.icons.hero.height-10:core.isset(name)?iconHeight-10:0);


    var xoffset = 6, yoffset = 22;

    var top;
    if (position=='center') {
        top = parseInt((416 - height) / 2);
    }
    else if (position=='up') {
        if (px==null || py==null) {
            top = 5;
        }
        else {
            top = 32 * py - height - ydelta - yoffset;
        }
    }
    else if (position=='down') {
        if (px==null || py==null) {
            top = 416 - height - 5;
        }
        else {
            top = 32 * py + 32 + yoffset;
        }
    }

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    //core.setAlpha('ui', 0.85);
    core.setAlpha('ui', textAttribute.background[3]);
    core.setFillStyle('ui', core.arrayToRGB(textAttribute.background));
    core.setStrokeStyle('ui', '#FFFFFF');


    core.fillRect('ui', left, top, right, height);
    core.strokeRect('ui', left - 1, top - 1, right + 1, height + 1, '#FFFFFF', 2);

    var xoffset = 9;

    // draw triangle
    if (position=='up' && core.isset(px) && core.isset(py)) {
        core.canvas.ui.clearRect(32*px+xoffset, top+height-1, 32-2*xoffset, 2);
        core.canvas.ui.beginPath();
        core.canvas.ui.moveTo(32*px+xoffset-1, top+height-1);
        core.canvas.ui.lineTo(32*px+16, top+height+yoffset-2);
        core.canvas.ui.lineTo(32*px+32-xoffset+1, top+height-1);
        core.canvas.ui.moveTo(32*px+xoffset-1, top+height-1);
        core.canvas.ui.closePath();
        core.canvas.ui.fill();
        // core.canvas.ui.stroke();
        // core.drawLine('ui', 32*px+4+1, top+height+1, 32*px + 28-1, top+height+1, core.arrayToRGB(textAttribute.background), 3);
        core.drawLine('ui', 32*px+xoffset, top+height, 32*px+16, top+height+yoffset-2);
        core.drawLine('ui', 32*px+32-xoffset, top+height, 32*px+16, top+height+yoffset-2);
    }
    if (position=='down' && core.isset(px) && core.isset(py)) {
        core.canvas.ui.clearRect(32*px+xoffset, top-2, 32-2*xoffset, 3);
        core.canvas.ui.beginPath();
        core.canvas.ui.moveTo(32*px+xoffset-1, top+1);
        core.canvas.ui.lineTo(32*px+16-1, top-yoffset+2);
        core.canvas.ui.lineTo(32*px+32-xoffset-1, top+1);
        core.canvas.ui.moveTo(32*px+xoffset-1, top+1);
        core.canvas.ui.closePath();
        core.canvas.ui.fill();
        // core.canvas.ui.stroke();
        // core.drawLine('ui', 32*px+4+1, top+height+1, 32*px + 28-1, top+height+1, core.arrayToRGB(textAttribute.background), 3);
        core.drawLine('ui', 32*px+xoffset, top, 32*px+16, top-yoffset+2);
        core.drawLine('ui', 32*px+32-xoffset, top, 32*px+16, top-yoffset+2);
    }


    // 名称
    core.canvas.ui.textAlign = "left";

    var content_top = top + 35;
    if (core.isset(id)) {

        content_top = top+57;
        core.setAlpha('ui', textAttribute.title[3]);
        core.setFillStyle('ui', core.arrayToRGB(textAttribute.title));
        core.setStrokeStyle('ui', core.arrayToRGB(textAttribute.title));

        if (id == 'hero') {
            var heroHeight=core.material.icons.hero.height;
            core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, heroHeight+2, null, 2);
            core.fillText('ui', name, content_left, top + 30, null, 'bold 22px Verdana');
            core.clearMap('ui', left + 15, top + 40, 32, heroHeight);
            core.fillRect('ui', left + 15, top + 40, 32, heroHeight, background);
            var heroIcon = core.material.icons.hero['down'];
            core.canvas.ui.drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc * heroHeight, 32, heroHeight, left+15, top+40, 32, heroHeight);
        }
        else {
            core.fillText('ui', name, content_left, top + 30, null, 'bold 22px Verdana');
            if (core.isset(icon)) {

                core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, iconHeight + 2, null, 2);
                core.status.boxAnimateObjs = [];
                core.status.boxAnimateObjs.push({
                    'bgx': left + 15, 'bgy': top + 40, 'bgWidth': 32, 'bgHeight': iconHeight,
                    'x': left+15, 'y': top+40, 'height': iconHeight, 'animate': animate,
                    'image': image,
                    'pos': icon*iconHeight
                });

                core.drawBoxAnimate();
            }
        }
    }


    var drawContent = function (content) {

        core.clearMap("ui", content_left, content_top - 18, validWidth,  top + height - content_top + 10);
        core.setAlpha('ui', textAttribute.background[3]);
        core.setFillStyle('ui', core.arrayToRGB(textAttribute.background));
        core.fillRect("ui",  content_left, content_top - 18, validWidth,  top + height - content_top + 10);

        core.setAlpha('ui', textAttribute.text[3]);
        core.setFillStyle('ui', core.arrayToRGB(textAttribute.text));
        var contents = core.splitLines("ui", content, validWidth, font);

        for (var i=0;i<contents.length;i++) {
            core.fillText('ui', contents[i], content_left, content_top + 21*i, null, font);
        }

    }

    if (textAttribute.time<=0 || core.status.event.id!='action') {
        drawContent(content);
    }
    else {
        var index=0;
        core.status.event.interval = setInterval(function () {
            drawContent(content.substring(0, ++index));
            if (index==content.length) {
                clearInterval(core.status.event.interval);
            }
        }, textAttribute.time);
    }

}

////// 绘制一个选项界面 //////
ui.prototype.drawChoices = function(content, choices) {

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    core.status.event.ui = {"text": content, "choices": choices};

    // Step 1: 计算长宽高
    var length = choices.length;
    var left=85, width = 416-2*left; // 宽度
    // 高度
    var height = 32*(length+2), bottom = 208+height/2;
    if (length%2==0) bottom+=16;
    var choice_top = bottom-height+56;

    var id=null, name=null, image=null, icon=null, iconHeight=32, animate=null;

    var contents = null;
    var content_left = left + 15;

    if (core.isset(content)) {
        // 获得name, image, icon
        if (content.indexOf("\t[")==0 || content.indexOf("\\t[")==0) {
            var index = content.indexOf("]");
            if (index>=0) {
                var str=content.substring(2, index);
                if (content.indexOf("\\t[")==0) str=content.substring(3, index);
                content=content.substring(index+1);
                var ss=str.split(",");
                if (ss.length==1) {
                    // id
                    id=ss[0];
                    if (id=='hero') {
                        name = core.status.hero.name;
                    }
                    else {
                        if (core.isset(core.material.enemys[id])) {
                            name = core.material.enemys[id].name;

                            if (core.isset(core.material.icons.enemy48[id])) {
                                image = core.material.images.enemy48;
                                icon = core.material.icons.enemy48[id];
                                iconHeight = 48;
                                animate=4;
                            }
                            else {
                                image = core.material.images.enemys;
                                icon = core.material.icons.enemys[id];
                                iconHeight = 32;
                                animate=2;
                            }
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
                    name=ss[0];
                    id = 'npc';
                    if (ss[1]=='hero') {
                        id = 'hero';
                    }
                    else if (core.isset(core.material.icons.npc48[ss[1]])) {
                        image = core.material.images.npc48;
                        icon = core.material.icons.npc48[ss[1]];
                        iconHeight = 48;
                        animate=4;
                    }
                    else if (core.isset(core.material.icons.npcs[ss[1]])){
                        image = core.material.images.npcs;
                        icon = core.material.icons.npcs[ss[1]];
                        iconHeight = 32;
                        animate=2;
                    }
                    else if (core.isset(core.material.icons.enemy48[ss[1]])) {
                        image = core.material.images.enemy48;
                        icon = core.material.icons.enemy48[ss[1]];
                        iconHeight = 48;
                        animate=4;
                    }
                    else if (core.isset(core.material.icons.enemys[ss[1]])) {
                        image = core.material.images.enemys;
                        icon = core.material.icons.enemys[ss[1]];
                        iconHeight = 32;
                        animate=2;
                    }
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
                core.fillText('ui', name, title_offset, top + 27, '#FFD700', 'bold 19px Verdana');
                core.clearMap('ui', left + 15, top + 30, 32, heroHeight);
                core.fillRect('ui', left + 15, top + 30, 32, heroHeight, background);
                var heroIcon = core.material.icons.hero['down'];
                core.canvas.ui.drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc *heroHeight, 32, heroHeight, left+15, top+30, 32, heroHeight);
            }
            else {
                core.fillText('ui', name, title_offset, top + 27, '#FFD700', 'bold 19px Verdana');
                if (core.isset(icon)) {
                    core.strokeRect('ui', left + 15 - 1, top + 30 - 1, 34, iconHeight + 2, '#DDDDDD', 2);
                    core.status.boxAnimateObjs = [];
                    core.status.boxAnimateObjs.push({
                        'bgx': left + 15, 'bgy': top + 30, 'bgWidth': 32, 'bgHeight': iconHeight,
                        'x': left+15, 'y': top+30, 'height': iconHeight, 'animate': animate,
                        'image': image,
                        'pos': icon*iconHeight
                    });
                    core.drawBoxAnimate();
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
        core.fillText('ui', core.replaceText(choices[i].text || choices[i]), 208, choice_top + 32 * i, "#FFFFFF", "bold 17px Verdana");
    }

    if (choices.length>0) {
        if (!core.isset(core.status.event.selection)) core.status.event.selection=0;
        while (core.status.event.selection<0) core.status.event.selection+=choices.length;
        while (core.status.event.selection>=choices.length) core.status.event.selection-=choices.length;
        var len = core.canvas.ui.measureText(core.replaceText(choices[core.status.event.selection].text || choices[core.status.event.selection])).width;
        core.strokeRect('ui', 208-len/2-5, choice_top + 32 * core.status.event.selection - 20, len+10, 28, "#FFD700", 2);
    }
    return;
}

////// 绘制一个确认/取消的警告页面 //////
ui.prototype.drawConfirmBox = function (text, yesCallback, noCallback) {
    core.lockControl();

    core.status.event.id = 'confirmBox';
    core.status.event.data = {'yes': yesCallback, 'no': noCallback};
    core.status.event.ui = text;

    if (!core.isset(core.status.event.selection) || core.status.event.selection>1) core.status.event.selection=1;
    if (core.status.event.selection<0) core.status.event.selection=0;

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

    var left = Math.min(208 - 40 - parseInt(max_length / 2), 100);
    var top = 140 - (lines-1)*30;
    var right = 416 - 2 * left, bottom = 416 - 140 - top;

    if (core.isPlaying())
        core.fillRect('ui', left, top, right, bottom, background);
    if (core.isPlaying())
        core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);
    core.canvas.ui.textAlign = "center";
    for (var i in contents) {
        core.fillText('ui', contents[i], 208, top + 50 + i*30, "#FFFFFF");
    }

    core.fillText('ui', "确定", 208 - 38, top + bottom - 35, "#FFFFFF", "bold 17px Verdana");
    core.fillText('ui', "取消", 208 + 38, top + bottom - 35);

    var len=core.canvas.ui.measureText("确定").width;
    if (core.status.event.selection==0) {
        core.strokeRect('ui', 208-38-parseInt(len/2)-5, top+bottom-35-20, len+10, 28, "#FFD700", 2);
    }
    if (core.status.event.selection==1) {
        core.strokeRect('ui', 208+38-parseInt(len/2)-5, top+bottom-35-20, len+10, 28, "#FFD700", 2);
    }

}

////// 绘制系统设置界面 //////
ui.prototype.drawSwitchs = function() {
    core.status.event.id = 'switchs';

    var choices = [
        "背景音乐："+(core.musicStatus.bgmStatus ? "[ON]" : "[OFF]"),
        "背景音效："+(core.musicStatus.soundStatus ? "[ON]" : "[OFF]"),
        "战斗动画： "+(core.flags.battleAnimate ? "[ON]" : "[OFF]"),
        "怪物显伤： "+(core.flags.displayEnemyDamage ? "[ON]" : "[OFF]"),
        "临界显伤： "+(core.flags.displayCritical ? "[ON]" : "[OFF]"),
        "领域显伤： "+(core.flags.displayExtraDamage ? "[ON]" : "[OFF]"),
        "单击瞬移： "+(core.status.automaticRoute.clickMoveDirectly ? "[ON]" : "[OFF]"),
        "下载离线版本",
        "返回主菜单"
    ];
    this.drawChoices(null, choices);
}

////// 绘制系统菜单栏 //////
ui.prototype.drawSettings = function () {
    core.status.event.id = 'settings';

    this.drawChoices(null, [
        "系统设置", "快捷商店", "浏览地图", "同步存档", "返回标题", "数据统计", "操作帮助", "关于本塔", "返回游戏"
    ]);
}

////// 绘制快捷商店选择栏 //////
ui.prototype.drawQuickShop = function () {

    core.status.event.id = 'selectShop';

    var shopList = core.status.shops, keys = Object.keys(shopList);

    var choices = [];
    for (var i=0;i<keys.length;i++) {
        choices.push(shopList[keys[i]].textInList);
    }
    choices.push("返回游戏");
    this.drawChoices(null, choices);
}

////// 绘制战斗动画 //////
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

    var initDamage = 0; // 战前伤害

    // 吸血
    if (core.enemys.hasSpecial(mon_special, 11)) {
        var vampireDamage = hero_hp * monster.value;

        // 如果有神圣盾免疫吸血等可以在这里写

        vampireDamage = Math.floor(vampireDamage);
        // 加到自身
        if (monster.add) // 如果加到自身
            mon_hp += vampireDamage;

        initDamage += vampireDamage;
    }

    hero_hp -= core.enemys.getExtraDamage(monster);

    if (core.enemys.hasSpecial(mon_special, 10)) { // 模仿
        mon_atk=hero_atk;
        mon_def=hero_def;
    }
    if (core.enemys.hasSpecial(mon_special, 2)) hero_def=0; // 魔攻
    if (core.enemys.hasSpecial(mon_special, 3) && mon_def<hero_atk) mon_def=hero_atk-1; // 坚固

    // 实际操作
    var turn = 0; // 0为勇士攻击
    if (core.enemys.hasSpecial(mon_special, 1)) turn=1;

    // 回合
    var turns = 2;
    if (core.enemys.hasSpecial(mon_special, 4)) turns=3;
    if (core.enemys.hasSpecial(mon_special, 5)) turns=4;
    if (core.enemys.hasSpecial(mon_special, 6)) turns=1+(monster.n||4);

    // 初始伤害
    if (core.enemys.hasSpecial(mon_special, 7)) initDamage+=Math.floor(core.values.breakArmor * hero_def);
    if (core.enemys.hasSpecial(mon_special, 9)) initDamage+=Math.floor(core.values.purify * hero_mdef);
    hero_mdef-=initDamage;
    if (hero_mdef<0) {
        hero_hp+=hero_mdef;
        hero_mdef=0;
    }

    var specialTexts = core.enemys.getSpecialText(monsterId);

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    core.clearMap('ui', 0, 0, 416, 416);
    var left=10, right=416-2*left;


    // var lines = core.flags.enableExperience?5:4;
    var lines = 3;
    if (core.flags.enableMDef || core.flags.enableMoney || core.flags.enableExperience) lines=4;
    if (core.flags.enableMoney && core.flags.enableExperience) lines=5;

    var lineHeight = 60;
    var height = lineHeight * lines + 50;

    var top = (416-height)/2, bottom = height;

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', left, top, right, bottom, '#000000');
    core.setAlpha('ui', 1);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);
    core.clearMap('data',0,0,416,416);

    clearInterval(core.interval.tipAnimate);
    core.setAlpha('data', 1);
    core.setOpacity('data', 1);
    core.status.boxAnimateObjs = [];

    var margin = 35;
    var boxWidth = 40;
    var monsterHeight = 32, animate=2;

    var image = core.material.images.enemys, icon = core.material.icons.enemys;
    if (core.isset(core.material.icons.enemy48[monsterId])) {
        image = core.material.images.enemy48;
        icon = core.material.icons.enemy48;
        monsterHeight = 48;
        animate=4;
    }

    // 方块
    var heroHeight = core.material.icons.hero.height;
    core.strokeRect('ui', left + margin - 1, top + margin - 1, boxWidth+2, heroHeight+boxWidth-32+2, '#FFD700', 2);
    core.strokeRect('ui', left + right - margin - boxWidth - 1 , top+margin-1, boxWidth+2, monsterHeight+boxWidth-32+2);

    // 名称
    core.canvas.ui.textAlign='center';
    core.fillText('ui', core.status.hero.name, left+margin+boxWidth/2, top+margin+heroHeight+40, '#FFD700', 'bold 22px Verdana');
    core.fillText('ui', "怪物", left+right-margin-boxWidth/2, top+margin+monsterHeight+40);
    for (var i=0, j=0; i<specialTexts.length;i++) {
        if (specialTexts[i]!='') {
            core.fillText('ui', specialTexts[i], left+right-margin-boxWidth/2, top+margin+monsterHeight+44+20*(++j), '#FF6A6A', '15px Verdana');
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
        'bgx': left+right-margin-40, 'bgy': top+margin, 'bgWidth': boxWidth, 'bgHeight': monsterHeight+boxWidth-32,
        'x': left + right - margin - 40 + (boxWidth-32)/2, 'y': top + margin + (boxWidth-32)/2, 'height': monsterHeight,
        'image': image, 'pos': monsterHeight*icon[monsterId], 'animate': animate
    })
    core.drawBoxAnimate();
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
        core.fillText('ui', "护盾", left_start, textTop, '#DDDDDD', '16px Verdana');
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

    if (core.flags.enableMoney) {
        textTop += lineHeight;
        core.canvas.ui.textAlign = 'right';
        core.fillText('ui', "金币", right_end, textTop, '#DDDDDD', '16px Verdana');
        core.drawLine('ui', right_start, textTop + 8, right_end, textTop + 8, '#FFFFFF', 2);
        core.canvas.ui.textAlign = 'left';
        core.fillText('ui', mon_money, right_start, textTop + 26, '#DDDDDD', 'bold 16px Verdana');
    }

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

    var battleInterval = setInterval(function() {
        core.playSound("attack.mp3");

        if (turn==0) {
            // 勇士攻击
            core.drawLine('data', left + right - margin - boxWidth + 6, top+margin+monsterHeight+boxWidth-32-6,
                left+right-margin-6, top+margin+6, '#FF0000', 4);
            setTimeout(function() {
                core.clearMap('data', left + right - margin - boxWidth, top+margin,
                    boxWidth, boxWidth+monsterHeight-32);
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
                hero_mdef -= Math.floor(core.values.counterAttack * hero_atk);

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

////// 绘制等待界面 //////
ui.prototype.drawWaiting = function(text) {

    core.lockControl();
    core.status.event.id = 'waiting';

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    core.setFont('ui', 'bold 17px Verdana');
    var text_length = core.canvas.ui.measureText(text).width;

    var right = Math.max(text_length+50, 220);
    var left = 208-parseInt(right/2), top = 208 - 32 - 16, bottom = 416 - 2 * top;

    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    core.canvas.ui.textAlign = "center";
    core.fillText('ui', text, 208, top + 56, '#FFFFFF');

}

////// 绘制存档同步界面 //////
ui.prototype.drawSyncSave = function () {

    core.status.event.id = 'syncSave';

    this.drawChoices(null, [
        "同步存档到服务器", "从服务器加载存档", "存档至本地文件", "从本地文件读档", "下载当前录像", "清空本地存档", "返回主菜单"
    ]);

}

////// 绘制存档同步选择页面 //////
ui.prototype.drawSyncSelect = function () {
    core.status.event.id = 'syncSelect';
    this.drawChoices(null, [
        "同步本地所有存档", "只同步当前单存档", "返回上级菜单"
    ]);
}

////// 绘制单存档界面 //////
ui.prototype.drawLocalSaveSelect = function () {
    core.status.event.id = 'localSaveSelect';
    this.drawChoices(null, [
        "下载所有存档", "只下载当前单存档", "返回上级菜单"
    ]);
}

////// 绘制存档删除页面 //////
ui.prototype.drawStorageRemove = function () {
    core.status.event.id = 'storageRemove';
    this.drawChoices(null, [
        "清空全部塔的存档", "只清空当前塔的存档", "返回上级菜单"
    ]);
}

ui.prototype.drawReplay = function () {
    core.lockControl();
    core.status.event.id = 'replay';
    this.drawChoices(null, [
        "从头回放录像", "从存档开始回放", "返回游戏"
    ]);
}

////// 绘制分页 //////
ui.prototype.drawPagination = function (page, totalPage) {

    core.setFont('ui', 'bold 15px Verdana');
    core.setFillStyle('ui', '#DDDDDD');

    var length = core.canvas.ui.measureText(page + " / " + page).width;

    core.canvas.ui.textAlign = 'left';
    core.fillText('ui', page + " / " + totalPage, parseInt((416 - length) / 2), 403);

    core.canvas.ui.textAlign = 'center';
    if (page > 1)
        core.fillText('ui', '上一页', 208 - 80, 403);
    if (page < totalPage)
        core.fillText('ui', '下一页', 208 + 80, 403);

    // 退出
    core.fillText('ui', '返回游戏', 370, 403);

}

////// 绘制键盘光标 //////
ui.prototype.drawCursor = function () {

    if (!core.isset(core.status.automaticRoute.cursorX))
        core.status.automaticRoute.cursorX=core.getHeroLoc('x');
    if (core.status.automaticRoute.cursorX<0) core.status.automaticRoute.cursorX=0;
    if (core.status.automaticRoute.cursorX>12) core.status.automaticRoute.cursorX=12;
    if (!core.isset(core.status.automaticRoute.cursorY))
        core.status.automaticRoute.cursorY=core.getHeroLoc('y');
    if (core.status.automaticRoute.cursorY<0) core.status.automaticRoute.cursorY=0;
    if (core.status.automaticRoute.cursorY>12) core.status.automaticRoute.cursorY=12;

    core.status.event.id = 'cursor';
    core.lockControl();

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);

    var width = 4;
    core.strokeRect('ui', 32*core.status.automaticRoute.cursorX+width/2, 32*core.status.automaticRoute.cursorY+width/2,
        32-width, 32-width, '#FFD700', width);

}

////// 绘制怪物手册 //////
ui.prototype.drawBook = function (index) {

    var enemys = core.enemys.getCurrentEnemys(core.floorIds[core.status.event.selection]);
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

    if (index<0) index=0;
    if (index>=enemys.length) index=enemys.length-1;
    var perpage = 6;
    var page=parseInt(index/perpage)+1;
    var totalPage = parseInt((enemys.length - 1) / perpage) + 1;
    core.status.event.data = index;
    var start = (page - 1) * perpage, end = Math.min(page * perpage, enemys.length);

    enemys = enemys.slice(start, end);
    core.status.boxAnimateObjs = [];
    for (var i = 0; i < enemys.length; i++) {
        // 边框
        var enemy = enemys[i];
        core.strokeRect('ui', 22, 62 * i + 22, 42, 42, '#DDDDDD', 2);

        var cls = 'enemys';
        if (core.isset(core.material.icons.enemy48[enemy.id]))
            cls = 'enemy48';
        var height = cls=='enemy48'?48:32;
        var animate = cls=='enemy48'?4:2;

        // 怪物
        core.status.boxAnimateObjs.push({
            'bgx': 22, 'bgy': 62 * i + 22, 'bgWidth': 42, 'bgHeight': 42,
            'x': 27, 'y': 62 * i + 27, 'height': 32, 'animate': animate,
            'image': core.material.images[cls],
            'pos': core.material.icons[cls][enemy.id] * height
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
        core.fillText('ui', core.formatBigNumber(enemy.hp), 195, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '攻击', 255, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.atk), 285, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '防御', 335, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.def), 365, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');

        var expOffset = 165, line_cnt=0;
        if (core.flags.enableMoney) {
            core.fillText('ui', '金币', 165, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', core.formatBigNumber(enemy.money), 195, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
            expOffset = 255;
            line_cnt++;
        }

        // 加点
        if (core.flags.enableAddPoint) {
            core.canvas.ui.textAlign = "left";
            core.fillText('ui', '加点', expOffset, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', core.formatBigNumber(enemy.point), expOffset + 30, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
            expOffset = 255;
            line_cnt++;
        }

        if (core.flags.enableExperience && line_cnt<2) {
            core.canvas.ui.textAlign = "left";
            core.fillText('ui', '经验', expOffset, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', core.formatBigNumber(enemy.experience), expOffset + 30, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
            line_cnt++;
        }

        var damageOffset = 281;
        if (line_cnt==1) damageOffset=326;
        if (line_cnt==2) damageOffset=361;

        core.canvas.ui.textAlign = "center";
        var damage = enemy.damage;

        var color = '#FFFF00';
        if (damage == null) {
            damage = '无法战斗';
            color = '#FF0000';
        }
        else {
            if (damage >= core.status.hero.hp) color = '#FF0000';
            if (damage<=0) color = '#00FF00';

            damage = core.formatBigNumber(damage);
            if (core.enemys.hasSpecial(core.material.enemys[enemy.id], 19))
                damage += "+";
        }
        if (core.material.enemys[enemy.id].notBomb)
            damage += "[b]";

        core.fillText('ui', damage, damageOffset, 62 * i + 50, color, 'bold 13px Verdana');

        core.canvas.ui.textAlign = "left";

        core.fillText('ui', '临界', 165, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.critical), 195, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '减伤', 255, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.criticalDamage), 285, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '1防', 335, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.defDamage), 365, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');

        if (index == start+i) {
            core.strokeRect('ui', 10, 62 * i + 13, 416-10*2,  62, '#FFD700');
        }

    }
    core.drawBoxAnimate();
    this.drawPagination(page, totalPage);
}

////// 绘制怪物属性的详细信息 //////
ui.prototype.drawBookDetail = function (index) {
    var enemys = core.enemys.getCurrentEnemys(core.floorIds[core.status.event.selection]);
    if (enemys.length==0) return;
    if (index<0) index=0;
    if (index>=enemys.length) index=enemys.length-1;

    var enemy = enemys[index];
    var enemyId=enemy.id;
    var hints=core.enemys.getSpecialHint(core.material.enemys[enemyId]);


    if (hints.length==0)
        hints.push("该怪物无特殊属性。");

    hints.push("");
    var criticals = core.enemys.nextCriticals(enemyId, 10).map(function (v) {
        return v[0]+":"+v[1];
    });
    while (criticals[0]=='0:0') criticals.shift();
    hints.push("临界表："+JSON.stringify(criticals))

    var content=hints.join("\n");

    core.status.event.id = 'book-detail';
    clearInterval(core.interval.tipAnimate);

    core.clearMap('data', 0, 0, 416, 416);
    core.setOpacity('data', 1);

    var left=10, right=416-2*left;
    var content_left = left + 25;

    var validWidth = right-(content_left-left)-13;
    var contents = core.splitLines("data", content, validWidth, '16px Verdana');

    var height = 416 - 10 - Math.min(416-24*(contents.length+1)-65, 250);
    var top = (416-height)/2, bottom = height;

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.setAlpha('data', 0.9);
    core.fillRect('data', left, top, right, bottom, '#000000');
    core.setAlpha('data', 1);
    core.strokeRect('data', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    // 名称
    core.canvas.data.textAlign = "left";

    core.fillText('data', enemy.name, content_left, top + 30, '#FFD700', 'bold 22px Verdana');
    var content_top = top + 57;

    for (var i=0;i<contents.length;i++) {
        // core.fillText('data', contents[i], content_left, content_top, '#FFFFFF', '16px Verdana');
        var text=contents[i];
        var index=text.indexOf("：");
        if (index>=0) {
            var x1 = text.substring(0, index+1);
            core.fillText('data', x1, content_left, content_top, '#FF6A6A', 'bold 16px Verdana');
            var len=core.canvas.data.measureText(x1).width;
            core.fillText('data', text.substring(index+1), content_left+len, content_top, '#FFFFFF', '16px Verdana');
        }
        else {
            core.fillText('data', contents[i], content_left, content_top, '#FFFFFF', '16px Verdana');
        }
        content_top+=24;
    }

    core.fillText('data', '<点击任意位置继续>', 270, top+height-13, '#CCCCCC', '13px Verdana');
}

////// 绘制楼层传送器 //////
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
    if (page<core.status.hero.flyRange.length-1) {
        core.fillText('ui', '▲', 356, 247 - 64, '#FFFFFF', "17px Verdana");
        core.fillText('ui', '▲', 356, 247 - 96, '#FFFFFF', "17px Verdana");
        core.fillText('ui', '▲', 356, 247 - 96 - 7, '#FFFFFF', "17px Verdana");
    }
    if (page>0) {
        core.fillText('ui', '▼', 356, 247 + 64, '#FFFFFF', "17px Verdana");
        core.fillText('ui', '▼', 356, 247 + 96, '#FFFFFF', "17px Verdana");
        core.fillText('ui', '▼', 356, 247 + 96 + 7, '#FFFFFF', "17px Verdana");
    }
    core.strokeRect('ui', 20, 100, 273, 273, '#FFFFFF', 2);
    this.drawThumbnail(floorId, 'ui', core.status.maps[floorId].blocks, 20, 100, 273);
}

////// 绘制浏览地图界面 //////
ui.prototype.drawMaps = function (index) {
    if (!core.isset(index)) index=core.floorIds.indexOf(core.status.floorId);

    if (index<0) index=0;
    if (index>=core.floorIds.length) index=core.floorIds.length-1;

    core.lockControl();
    core.status.event.id = 'viewMaps';
    core.status.event.data = index;

    var floorId = core.floorIds[index];

    clearTimeout(core.interval.tipAnimate);

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1);
    this.drawThumbnail(floorId, 'ui', core.status.maps[floorId].blocks, 0, 0, 416);

    core.clearMap('data', 0, 0, 416, 416);
    core.setOpacity('data', 0.2);
    core.canvas.data.textAlign = 'left';
    core.setFont('data', '16px Arial');

    var text = core.floors[floorId].title;
    var textX = 16, textY = 18, width = textX + core.canvas.data.measureText(text).width + 16, height = 42;
    core.fillRect('data', 5, 5, width, height, '#000');
    core.setOpacity('data', 0.5);
    core.fillText('data', text, textX + 5, textY + 15, '#fff');

}

////// 绘制道具栏 //////
ui.prototype.drawToolbox = function(index) {

    var tools = Object.keys(core.status.hero.items.tools).sort();
    var constants = Object.keys(core.status.hero.items.constants).sort();

    if (!core.isset(index)) {
        if (tools.length>0) index=0;
        else if (constants.length>0) index=1000;
        else index=0;
    }

    core.status.event.selection=index;

    var selectId;
    if (index<1000) {
        if (index>=tools.length) index=Math.max(0, tools.length-1);
        selectId = tools[index];
    }
    else {
        if (index-1000>=constants.length) index=1000+Math.max(0, constants.length-1);
        selectId = constants[index-1000];
    }

    var page = parseInt((index%1000)/12)+1;
    var totalPage = Math.ceil(Math.max(tools.length, constants.length)/12);

    if (!core.hasItem(selectId)) selectId=null;

    core.status.event.data=selectId;

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, 416, 416, '#000000');
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', '#DDDDDD');
    core.setStrokeStyle('ui', '#DDDDDD');
    core.canvas.ui.lineWidth = 2;
    core.canvas.ui.strokeWidth = 2;

    var ydelta = 20;

    // 画线
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0, 130-ydelta);
    core.canvas.ui.lineTo(416, 130-ydelta);
    core.canvas.ui.stroke();
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(416,129-ydelta);
    core.canvas.ui.lineTo(416,105-ydelta);
    core.canvas.ui.lineTo(416-72,105-ydelta);
    core.canvas.ui.lineTo(416-102,129-ydelta);
    core.canvas.ui.fill();

    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0, 290-ydelta);
    core.canvas.ui.lineTo(416, 290-ydelta);
    core.canvas.ui.stroke();
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(416,289-ydelta);
    core.canvas.ui.lineTo(416,265-ydelta);
    core.canvas.ui.lineTo(416-72,265-ydelta);
    core.canvas.ui.lineTo(416-102,289-ydelta);
    core.canvas.ui.fill();

    // 文字
    core.canvas.ui.textAlign = 'right';
    core.fillText('ui', "消耗道具", 411, 124-ydelta, '#333333', "bold 16px Verdana");
    core.fillText('ui', "永久道具", 411, 284-ydelta);

    core.canvas.ui.textAlign = 'left';
    // 描述
    if (core.isset(selectId)) {
        var item=core.material.items[selectId];
        core.fillText('ui', item.name, 10, 32, '#FFD700', "bold 20px Verdana")

        var text = item.text||"该道具暂无描述。";
        var lines = core.splitLines('ui', text, 406, '17px Verdana');

        core.fillText('ui', lines[0], 10, 62, '#FFFFFF', '17px Verdana');

        if (lines.length==1) {
            core.fillText('ui', '<继续点击该道具即可进行使用>', 10, 89, '#CCCCCC', '14px Verdana');
        }
        else {
            var leftText = text.substring(lines[0].length);
            core.fillText('ui', leftText, 10, 89, '#FFFFFF', '17px Verdana');
        }
    }

    core.canvas.ui.textAlign = 'right';
    var images = core.material.images.items;
    // 消耗道具

    for (var i=0;i<12;i++) {
        var tool=tools[12*(page-1)+i];
        if (!core.isset(tool)) break;
        var icon=core.material.icons.items[tool];
        if (i<6) {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*i+1)+5, 144+5-ydelta, 32, 32)
            // 个数
            core.fillText('ui', core.itemCount(tool), 16*(4*i+1)+40, 144+38-ydelta, '#FFFFFF', "bold 14px Verdana");
            if (selectId == tool)
                core.strokeRect('ui', 16*(4*i+1)+1, 144+1-ydelta, 40, 40, '#FFD700');
        }
        else {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i-6)+1)+5, 144+64+5-ydelta, 32, 32)
            // 个数
            core.fillText('ui', core.itemCount(tool), 16*(4*(i-6)+1)+40, 144+64+38-ydelta, '#FFFFFF', "bold 14px Verdana");
            if (selectId == tool)
                core.strokeRect('ui', 16*(4*(i-6)+1)+1, 144+64+1-ydelta, 40, 40, '#FFD700');

        }
    }

    // 永久道具
    for (var i=0;i<12;i++) {
        var constant=constants[12*(page-1)+i];
        if (!core.isset(constant)) break;
        var icon=core.material.icons.items[constant];
        if (i<6) {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*i+1)+5, 304+5-ydelta, 32, 32)

            if (selectId == constant)
                core.strokeRect('ui', 16*(4*i+1)+1, 304+1-ydelta, 40, 40, '#FFD700');
        }
        else {
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i-6)+1)+5, 304+64+5-ydelta, 32, 32)
            if (selectId == constant)
                core.strokeRect('ui', 16*(4*(i-6)+1)+1, 304+64+1-ydelta, 40, 40, '#FFD700');
        }
    }

    // 退出
    this.drawPagination(page, totalPage);
    core.canvas.ui.textAlign = 'center';
    // core.fillText('ui', '删除道具', 370, 32,'#DDDDDD', 'bold 15px Verdana');
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');
}

////// 绘制存档/读档界面 //////
ui.prototype.drawSLPanel = function(index) {
    if (!core.isset(index)) index=1;
    if (index<0) index=0;

    var page = parseInt(index/10), offset=index%10;
    var max_page = main.savePages || 30;
    if (page>=max_page) page=max_page - 1;
    if (offset>5) offset=5;
    index=10*page+offset;

    core.status.event.data=index;

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, 416, 416, '#000000');
    core.setAlpha('ui', 1);
    core.canvas.ui.textAlign = 'center';

    var u=416/6, size=118;

    var strokeColor = '#FFD700';
    if (core.status.event.selection) strokeColor = '#FF6A6A';

    var name=core.status.event.id=='save'?"存档":core.status.event.id=='load'?"读档":core.status.event.id=='replayLoad'?"回放":"";
    for (var i=0;i<6;i++) {
        var id=5*page+i;
        var data=core.getLocalStorage(i==0?"autoSave":"save"+id, null);
        if (i<3) {
            core.fillText('ui', i==0?"自动存档":name+id, (2*i+1)*u, 35, '#FFFFFF', "bold 17px Verdana");
            core.strokeRect('ui', (2*i+1)*u-size/2, 50, size, size, i==offset?strokeColor:'#FFFFFF', i==offset?6:2);
            if (core.isset(data) && core.isset(data.floorId)) {
                this.drawThumbnail(data.floorId, 'ui', core.maps.load(data.maps, data.floorId).blocks, (2*i+1)*u-size/2, 50, size, data.hero.loc, data.hero.flags.heroIcon||"hero.png");
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i+1)*u, 65+size, '#FFFFFF', '10px Verdana');
            }
            else {
                core.fillRect('ui', (2*i+1)*u-size/2, 50, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i+1)*u, 117, '#FFFFFF', 'bold 30px Verdana');
            }
        }
        else {
            core.fillText('ui', name+id, (2*i-5)*u, 230, '#FFFFFF', "bold 17px Verdana");
            core.strokeRect('ui', (2*i-5)*u-size/2, 245, size, size, i==offset?strokeColor:'#FFFFFF', i==offset?6:2);
            if (core.isset(data) && core.isset(data.floorId)) {
                this.drawThumbnail(data.floorId, 'ui', core.maps.load(data.maps, data.floorId).blocks, (2*i-5)*u-size/2, 245, size, data.hero.loc, data.hero.flags.heroIcon||"hero.png");
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i-5)*u, 260+size, '#FFFFFF', '10px Verdana');
            }
            else {
                core.fillRect('ui', (2*i-5)*u-size/2, 245, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i-5)*u, 245+70, '#FFFFFF', 'bold 30px Verdana');
            }
        }
    }
    this.drawPagination(page+1, max_page);

    if (core.status.event.selection)
        core.setFillStyle('ui', '#FF6A6A');
    core.fillText('ui', '删除模式', 48, 403);

}

////// 绘制一个缩略图 //////
ui.prototype.drawThumbnail = function(floorId, canvas, blocks, x, y, size, heroLoc, heroIcon) {
    core.clearMap(canvas, x, y, size, size);
    var groundId = core.floors[floorId].defaultGround || "ground";
    var blockIcon = core.material.icons.terrains[groundId];
    var blockImage = core.material.images.terrains;
    var persize = size/13;
    for (var i=0;i<13;i++) {
        for (var j=0;j<13;j++) {
            core.canvas[canvas].drawImage(blockImage, 0, blockIcon * 32, 32, 32, x + i * persize, y + j * persize, persize, persize);
        }
    }

    var images = [];
    if (core.isset(core.floors[floorId].images)) {
        images = core.floors[floorId].images;
        if (typeof images == 'string') {
            images = [[0, 0, images]];
        }
    }

    images.forEach(function (t) {
        var ratio = size/416;
        var dx=parseInt(t[0]), dy=parseInt(t[1]), p=t[2];
        if (core.isset(dx) && core.isset(dy) && !t[3] && core.isset(core.material.images.images[p])) {
            dx*=32; dy*=32;
            var image = core.material.images.images[p];
            core.canvas.ui.drawImage(image, x+dx*ratio, y+dy*ratio, Math.min(size-dx*ratio, ratio*image.width), Math.min(size-dy*ratio, ratio*image.height));
        }
    })

    var mapArray = core.maps.getMapArray(blocks);
    for (var b in blocks) {
        var block = blocks[b];
        if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable)) {
            if (block.event.cls == 'autotile') {
                core.drawAutotile(core.canvas.ui, mapArray, block, persize, x, y);
            }
            else {
                if (block.event.id!='none') {
                    var blockIcon = core.material.icons[block.event.cls][block.event.id];
                    var blockImage = core.material.images[block.event.cls];
                    var height = block.event.height || 32;
                    core.canvas[canvas].drawImage(blockImage, 0, blockIcon * height, 32, height, x + block.x * persize, y + block.y * persize + (persize-persize*height/32), persize, persize * height/32);
                }
            }
        }
    }

    if (core.isset(heroLoc)) {
        if (!core.isset(core.material.images.images[heroIcon]))
            heroIcon = "hero.png";
        var icon = core.material.icons.hero[heroLoc.direction];
        var height = core.material.images.images[heroIcon].height/4;
        var realHeight = persize*height/32;
        core.canvas[canvas].drawImage(core.material.images.images[heroIcon], icon.stop * 32, icon.loc * height, 32, height, x+persize*heroLoc.x, y+persize*heroLoc.y+persize-realHeight, persize, realHeight);
    }

    images.forEach(function (t) {
        var ratio = size/416;
        var dx=parseInt(t[0]), dy=parseInt(t[1]), p=t[2];
        if (core.isset(dx) && core.isset(dy) && t[3] && core.isset(core.material.images.images[p])) {
            dx*=32; dy*=32;
            var image = core.material.images.images[p];
            core.canvas.ui.drawImage(image, x+dx*ratio, y+dy*ratio, Math.min(size-dx*ratio, ratio*image.width), Math.min(size-dy*ratio, ratio*image.height));
        }
    })

}

ui.prototype.drawKeyBoard = function () {
    core.lockControl();
    core.status.event.id = 'keyBoard';

    core.clearMap('ui', 0, 0, 416, 416);

    var left = 16, top = 48, right = 416 - 2 * left, bottom = 416 - 2 * top;
    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.fillRect('ui', left, top, right, bottom, background);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

    core.canvas.ui.textAlign = "center";
    core.fillText('ui', "虚拟键盘", 208, top+35, "#FFD700", "bold 22px Verdana");

    core.setFont('ui', '17px Verdana');
    core.setFillStyle('ui', '#FFFFFF');
    var offset = 128-9;

    var lines = [
        ["F1","F2","F3","F4","F5","F6","F7","F8","F9","10","11"],
        ["1","2","3","4","5","6","7","8","9","0"],
        ["Q","W","E","R","T","Y","U","I","O","P"],
        ["A","S","D","F","G","H","J","K","L"],
        ["Z","X","C","V","B","N","M"],
        ["-","=","[","]","\\",";","'",",",".","/","`"],
        ["ES","TA","CA","SH","CT","AL","SP","BS","EN","DE"]
    ]

    lines.forEach(function (line) {
        for (var i=0;i<line.length;i++) {
            core.fillText('ui', line[i], 48+32*i, offset);
        }
        offset+=32;
    });

    core.fillText("ui", "返回游戏", 416-80, offset-3, '#FFFFFF', 'bold 15px Verdana');
}

////// 绘制“数据统计”界面 //////
ui.prototype.drawStatistics = function () {

    // 数据统计要统计如下方面：
    // 1. 当前全塔剩余下的怪物数量，总金币数，总经验数，总加点数
    // 2. 当前全塔剩余的黄蓝红铁门数量，和对应的钥匙数量
    // 3. 当前全塔剩余的三种宝石数量，血瓶数量，装备数量；总共增加的攻防生命值
    // 4. 当前层的上述信息
    // 5. 当前已走的步数；瞬间移动的步数，瞬间移动的次数（和少走的步数）；游戏时长
    // 6. 当前已恢复的生命值；当前总伤害、战斗伤害、阻激夹域血网伤害、中毒伤害。


    var total = {
        'monster': {
            'count': 0, 'money': 0, 'experience': 0, 'point': 0,
        },
        'count': {
            'yellowDoor': 0, 'blueDoor': 0, 'redDoor': 0, 'greenDoor': 0, 'steelDoor': 0,
            'yellowKey': 0, 'blueKey': 0, 'redKey': 0, 'greenKey': 0, 'steelKey': 0,
            'redJewel': 0, 'blueJewel': 0, 'greenJewel': 0, 'yellowJewel': 0,
            'redPotion': 0, 'bluePotion': 0, 'greenPotion': 0, 'yellowPotion': 0, 'superPotion': 0,
            'pickaxe': 0, 'bomb': 0, 'centerFly': 0,
            'poisonWine': 0, 'weakWine': 0, 'curseWine': 0, 'superWine': 0,
            'sword1': 0, 'sword2': 0, 'sword3': 0, 'sword4': 0, 'sword5': 0,
            'shield1': 0, 'shield2': 0, 'shield3': 0, 'shield4': 0, 'shield5': 0,
        },
        'add': {
            'hp': 0, 'atk': 0, 'def': 0, 'mdef': 0
        }
    };
    var current = core.clone(total);

    core.floorIds.forEach(function (floorId) {
        var floor=core.floors[floorId];
        var blocks=core.status.maps[floorId].blocks;
        // 隐藏层不给看
        if (floor.cannotViewMap && floorId!=core.status.floorId) return;

        blocks.forEach(function (block) {
            if (!core.isset(block.event) || (core.isset(block.enable) && !block.enable))
                return;
            var event = block.event;
            if (event.cls.indexOf("enemy")==0) {
                var enemyId = event.id, enemy = core.material.enemys[enemyId];
                total.monster.money+=enemy.money||0;
                total.monster.experience+=enemy.experience||0;
                total.monster.point+=enemy.point||0;
                total.monster.count++;
                if (floorId==core.status.floorId) {
                    current.monster.money+=enemy.money||0;
                    current.monster.experience+=enemy.experience||0;
                    current.monster.point+=enemy.point||0;
                    current.monster.count++;
                }
            }
            else {
                var id = event.id;

                var temp = core.clone(core.status.hero);

                if (core.isset(total.count[id])) {
                    var hp=0, atk=0, def=0, mdef=0;

                    if (core.isset(core.material.items[id]) && core.material.items[id].cls=='items' && id!='superPotion') {
                        var ratio = floor.item_ratio||1;
                        if (core.isset(core.items.itemEffect[id])) {
                            eval(core.items.itemEffect[id]);
                        }
                        hp = core.status.hero.hp - temp.hp;
                        atk = core.status.hero.atk - temp.atk;
                        def = core.status.hero.def - temp.def;
                        mdef = core.status.hero.mdef - temp.mdef;
                    }
                    else {
                        if (id.indexOf('sword')==0 && core.isset(core.values[id])) {
                            var x = core.values[id];
                            if (typeof x == 'number') x = {'atk': x};
                            atk += x.atk||0;
                            def += x.def||0;
                            mdef += x.mdef||0;
                        }
                        if (id.indexOf('shield')==0 && core.isset(core.values[id])) {
                            var x = core.values[id];
                            if (typeof x == 'number') x = {'def': x};
                            atk += x.atk||0;
                            def += x.def||0;
                            mdef += x.mdef||0;
                        }
                    }
                    core.status.hero = core.clone(temp);
                    total.count[id]++;
                    total.add.hp+=hp;
                    total.add.atk+=atk;
                    total.add.def+=def;
                    total.add.mdef+=mdef;
                    if (floorId==core.status.floorId) {
                        current.count[id]++;
                        current.add.hp+=hp;
                        current.add.atk+=atk;
                        current.add.def+=def;
                        current.add.mdef+=mdef;
                    }
                }
            }
        })
    })

    var getText = function (type, data) {
        var text = type+"地图中：\n";
        text += "共有怪物"+data.monster.count+"个";
        if (core.flags.enableMoney) text+="，总金币数"+data.monster.money;
        if (core.flags.enableExperience) text+="，总经验数"+data.monster.experience;
        if (core.flags.enableAddPoint) text+="，总加点数"+data.monster.point;
        text+="。\n\n";
        Object.keys(data.count).forEach(function (key) {
            var value=data.count[key];
            if (value>0) {
                var name="";
                if (key=='yellowDoor') name="黄门";
                else if (key=='blueDoor') name="蓝门";
                else if (key=='redDoor') name="红门";
                else if (key=='greenDoor') name="绿门";
                else if (key=='steelDoor') name="铁门";
                else name=core.material.items[key].name;
                if (core.isset(name)) {
                    text+=name+value+"个；";
                }
            }
        })
        text+="\n\n";
        text+="共加生命值"+core.formatBigNumber(data.add.hp)+"点，攻击"
            +core.formatBigNumber(data.add.atk)+"点，防御"
            +core.formatBigNumber(data.add.def)+"点，魔防"
            +core.formatBigNumber(data.add.mdef)+"点。";
        return text;
    }

    var formatTime = function (time) {
        return core.setTwoDigits(parseInt(time/3600000))
            +":"+core.setTwoDigits(parseInt(time/60000)%60)
            +":"+core.setTwoDigits(parseInt(time/1000)%60);
    }

    var statistics = core.status.hero.statistics;
    core.drawText([
        getText("全塔", total),
        getText("当前", current),
        "当前总步数："+core.status.hero.steps+"，当前游戏时长："+formatTime(statistics.currTime)
        +"，总游戏时长"+formatTime(statistics.totalTime)
        +"。\n瞬间移动次数："+statistics.moveDirectly+"，共计少走"+statistics.ignoreSteps+"步。"
        +"\n\n总计通过血瓶恢复生命值为"+core.formatBigNumber(statistics.hp)+"点。\n\n"
        +"总计受到的伤害为"+core.formatBigNumber(statistics.battleDamage+statistics.poisonDamage+statistics.extraDamage)
        +"，其中战斗伤害"+core.formatBigNumber(statistics.battleDamage)+"点"
        +(core.flags.enableDebuff?("，中毒伤害"+core.formatBigNumber(statistics.poisonDamage)+"点"):"")
        +"，领域/夹击/阻击/血网伤害"+core.formatBigNumber(statistics.extraDamage)+"点。",
        "\t[说明]1. 地图数据统计的效果仅模拟当前立刻获得该道具的效果。\n2. 不会计算“不可被浏览地图”的隐藏层的数据。\n" +
        "3. 不会计算任何通过事件得到的道具（显示事件、改变图块、或直接增加道具等）。\n"+
        "4. 在自定义道具（例如其他宝石）后，需在ui.js的drawStatistics中注册，不然不会进行统计。\n"+
        "5. 所有统计信息仅供参考，如有错误，概不负责。"
    ])

}

////// 绘制“关于”界面 //////
ui.prototype.drawAbout = function () {
    return this.uidata.drawAbout();
}

////// 绘制帮助页面 //////
ui.prototype.drawHelp = function () {
    core.drawText([
        "\t[键盘快捷键列表]"+
        "[CTRL] 跳过对话\n" +
        "[Z] 转向\n" +
        "[X] 打开/关闭怪物手册\n" +
        "[G] 打开/关闭楼层传送器\n" +
        "[A] 读取自动存档（回退）\n" +
        "[S/D] 打开/关闭存/读档页面\n" +
        "[K] 打开/关闭快捷商店选择列表\n" +
        "[T] 打开/关闭工具栏\n" +
        "[ESC] 打开/关闭系统菜单\n" +
        // "[E] 显示光标\n" +
        "[H] 打开帮助页面\n"+
        "[R] 回放\n"+
        "[SPACE] 轻按（仅在轻按开关打开时有效）\n" +
        "[PgUp/PgDn] 浏览地图\n"+
        "[1] 快捷使用破墙镐\n" +
        "[2] 快捷使用炸弹/圣锤\n" +
        "[3] 快捷使用中心对称飞行器",
        "\t[鼠标操作]"+
        "点状态栏中图标： 进行对应的操作\n"+
        "点任意块： 寻路并移动\n"+
        "点任意块并拖动： 指定寻路路线\n"+
        "双击空地： 瞬间移动\n"+
        "单击勇士： 转向\n"+
        "双击勇士： 轻按（仅在轻按开关打开时有效）\n"+
        "长按任意位置：跳过剧情对话或打开虚拟键盘\n"
    ]);
}

