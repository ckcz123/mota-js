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
            // 不擦除curtain层
            if (m=='curtain') continue;
            core.canvas[m].clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
        }
        core.dom.gif.innerHTML = "";
    }
    else {
        core.canvas[map].clearRect(x||0, y||0, width||core.bigmap.width*32, height||core.bigmap.height*32);
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
    core.canvas[map].stroke();
}

////// 在某个canvas上绘制一个箭头 //////
ui.prototype.drawArrow = function (map, x1, y1, x2, y2, style, lineWidth) {
    if (x1==x2 && y1==y2) return;
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    var head = 10;
    var dx = x2-x1, dy=y2-y1;
    var angle = Math.atan2(dy,dx);
    core.canvas[map].beginPath();
    core.canvas[map].moveTo(x1,y1);
    core.canvas[map].lineTo(x2, y2);
    core.canvas[map].lineTo(x2-head*Math.cos(angle-Math.PI/6),y2-head*Math.sin(angle-Math.PI/6));
    core.canvas[map].moveTo(x2, y2);
    core.canvas[map].lineTo(x2-head*Math.cos(angle+Math.PI/6),y2-head*Math.sin(angle+Math.PI/6));
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
    core.clearMap('ui');
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
ui.prototype.drawTextBox = function(content, showAll) {

    if (core.isset(core.status.event) && core.status.event.id=='action') {
        core.status.event.ui = content;
    }

    clearInterval(core.status.event.interval);
    core.status.event.interval = null;

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

    var titlefont = textAttribute.titlefont || 22;
    var textfont = textAttribute.textfont || 16;
    var offset = textAttribute.offset || 0;

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
    core.clearMap('ui');

    // var contents = content.split('\n');
    // var contents = core.splitLines('ui', content, );
    var left=10, right=416-2*left;
    var content_left = left + 25;
    if (id=='hero' || core.isset(icon)) content_left=left+63;

    var validWidth = right-(content_left-left)-13;
    var font = textfont + 'px Verdana';
    if (textAttribute.bold) font = "bold "+font;
    var contents = core.splitLines("ui", content, validWidth, font);

    var height = 20 + (textfont+5)*(contents.length+1) + (id=='hero'?core.material.icons.hero.height-10:core.isset(name)?iconHeight-10:0);


    var xoffset = 6, yoffset = 22;

    var top;
    if (position=='center') {
        top = parseInt((416 - height) / 2);
    }
    else if (position=='up') {
        if (px==null || py==null) {
            top = 5 + offset;
        }
        else {
            top = 32 * py - height - ydelta - yoffset;
        }
    }
    else if (position=='down') {
        if (px==null || py==null) {
            top = 416 - height - 5 - offset;
        }
        else {
            top = 32 * py + 32 + yoffset;
        }
    }

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    //core.setAlpha('ui', 0.85);

    var borderColor = main.borderColor||"#FFFFFF";

    core.setAlpha('ui', textAttribute.background[3]);
    core.setFillStyle('ui', core.arrayToRGB(textAttribute.background));
    core.setStrokeStyle('ui', borderColor);


    core.fillRect('ui', left, top, right, height);
    core.strokeRect('ui', left - 1, top - 1, right + 1, height + 1, borderColor, 2);

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
            core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, heroHeight+2, borderColor, 2);
            core.fillText('ui', name, content_left, top + 30, null, 'bold '+titlefont+'px Verdana');
            core.clearMap('ui', left + 15, top + 40, 32, heroHeight);
            core.fillRect('ui', left + 15, top + 40, 32, heroHeight, background);
            var heroIcon = core.material.icons.hero['down'];
            core.canvas.ui.drawImage(core.material.images.hero, heroIcon.stop * 32, heroIcon.loc * heroHeight, 32, heroHeight, left+15, top+40, 32, heroHeight);
        }
        else {
            core.fillText('ui', name, content_left, top + 30, null, 'bold '+titlefont+'px Verdana');
            if (core.isset(icon)) {

                core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, iconHeight + 2, borderColor, 2);
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
        core.fillRect("ui",  content_left, content_top - 18, validWidth,  top + height - content_top + 11);

        core.setAlpha('ui', textAttribute.text[3]);
        core.setFillStyle('ui', core.arrayToRGB(textAttribute.text));
        var contents = core.splitLines("ui", content, validWidth, font);

        for (var i=0;i<contents.length;i++) {
            core.fillText('ui', contents[i], content_left, content_top + (textfont+5)*i, null, font);
        }

    }

    if (showAll || textAttribute.time<=0 || core.status.event.id!='action') {
        drawContent(content);
    }
    else {
        var index=0;
        core.status.event.interval = setInterval(function () {
            drawContent(content.substring(0, ++index));
            if (index==content.length) {
                clearInterval(core.status.event.interval);
                core.status.event.interval = null;
            }
        }, textAttribute.time);
    }

}

////// 绘制一个选项界面 //////
ui.prototype.drawChoices = function(content, choices) {

    choices = choices || [];

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    core.clearMap('ui');
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', background);

    core.status.event.ui = {"text": content, "choices": choices};

    // Step 1: 计算长宽高
    var length = choices.length;

    // 宽度计算：考虑选项的长度
    var width = 416 - 2*85;
    core.setFont('ui', "bold 17px Verdana");
    for (var i = 0; i < choices.length; i++) {
        width = Math.max(width, core.canvas.ui.measureText(core.replaceText(choices[i].text || choices[i])).width + 30);
    }

    var left=parseInt((416 - width) / 2); // 左边界
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

    var borderColor = main.borderColor||"#FFFFFF";

    core.fillRect('ui', left, top, width, height, background);
    core.strokeRect('ui', left - 1, top - 1, width + 1, height + 1, borderColor, 2);

    // 如果有内容
    if (core.isset(contents)) {

        var content_top = top + 35;

        if (core.isset(id)) {
            core.canvas.ui.textAlign = "center";

            content_top = top+55;
            var title_offset = left+width/2;
            // 动画

            if (id=='hero' || core.isset(icon))
                title_offset += 12;

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
    core.clearMap('ui');
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

    var borderColor = main.borderColor||"#FFFFFF";

    if (core.isPlaying())
        core.fillRect('ui', left, top, right, bottom, background);
    if (core.isPlaying())
        core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, borderColor, 2);
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
        "背景音乐： "+(core.musicStatus.bgmStatus ? "[ON]" : "[OFF]"),
        "背景音效： "+(core.musicStatus.soundStatus ? "[ON]" : "[OFF]"),
        "战斗动画： "+(core.flags.battleAnimate ? "[ON]" : "[OFF]"),
        "怪物显伤： "+(core.flags.displayEnemyDamage ? "[ON]" : "[OFF]"),
        "临界显伤： "+(core.flags.displayCritical ? "[ON]" : "[OFF]"),
        "领域显伤： "+(core.flags.displayExtraDamage ? "[ON]" : "[OFF]"),
        "新版存档： "+(core.platform.useLocalForage ? "[ON]":"[OFF]"),
        "单击瞬移： "+(core.getFlag('clickMove', true) ? "[ON]":"[OFF]"),
        "查看工程",
        "下载离线版本",
        "返回主菜单"
    ];
    this.drawChoices(null, choices);
}

////// 绘制系统菜单栏 //////
ui.prototype.drawSettings = function () {
    core.status.event.id = 'settings';

    this.drawChoices(null, [
        "系统设置", "快捷商店", "浏览地图", "绘图模式", "同步存档", "返回标题", "数据统计", "操作帮助", "关于本塔", "返回游戏"
    ]);
}

////// 绘制快捷商店选择栏 //////
ui.prototype.drawQuickShop = function () {

    core.status.event.id = 'selectShop';

    var shopList = core.status.shops, keys = Object.keys(shopList).filter(function (shopId) {return shopList[shopId].visited || !shopList[shopId].mustEnable});
    var choices = keys.map(function (shopId) {return shopList[shopId].textInList});

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

    hero_hp=Math.max(0, hero_hp);
    hero_atk=Math.max(0, hero_atk);
    hero_def=Math.max(0, hero_def);
    hero_mdef=Math.max(0, hero_mdef);

    if (core.flags.equipPercentage) {
        hero_atk = Math.floor(core.getFlag('equip_atk_buff',1)*hero_atk);
        hero_def = Math.floor(core.getFlag('equip_def_buff',1)*hero_def);
        hero_mdef = Math.floor(core.getFlag('equip_mdef_buff',1)*hero_mdef);
    }

    var enemy = core.material.enemys[monsterId];
    var enemyInfo = core.enemys.getEnemyInfo(enemy, hero_hp, hero_atk, hero_def, hero_mdef);
    var mon_hp = enemyInfo.hp, mon_atk = enemyInfo.atk, mon_def = enemyInfo.def, mon_money=enemyInfo.money,
        mon_exp = enemyInfo.experience, mon_special=enemyInfo.special;

    var initDamage = 0; // 战前伤害

    // 吸血
    if (core.enemys.hasSpecial(mon_special, 11)) {
        var vampireDamage = hero_hp * enemy.value;

        // 如果有神圣盾免疫吸血等可以在这里写

        vampireDamage = Math.floor(vampireDamage) || 0;
        // 加到自身
        if (enemy.add) // 如果加到自身
            mon_hp += vampireDamage;

        initDamage += vampireDamage;
    }

    hero_hp -= core.enemys.getExtraDamage(enemy);

    if (core.enemys.hasSpecial(mon_special, 2)) hero_def=0; // 魔攻

    // 实际操作
    var turn = 0; // 0为勇士攻击
    if (core.enemys.hasSpecial(mon_special, 1)) turn=1;

    // 回合
    var turns = 2;
    if (core.enemys.hasSpecial(mon_special, 4)) turns=3;
    if (core.enemys.hasSpecial(mon_special, 5)) turns=4;
    if (core.enemys.hasSpecial(mon_special, 6)) turns=1+(enemy.n||4);

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

    core.clearMap('ui');
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
    core.clearMap('data');

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
            core.clearMap('ui');
            core.setAlpha('ui', 1.0);
            core.clearMap('data');
            if (core.status.event.id=='battle') {
                core.unLockControl();
                core.status.event.id=null;
            }
            if (core.isset(callback))
                callback();
            return;
        }

    }, 400);
}

////// 绘制等待界面 //////
ui.prototype.drawWaiting = function(text) {

    core.lockControl();
    core.status.event.id = 'waiting';

    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");
    core.clearMap('ui');
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
        "同步存档到服务器", "从服务器加载存档", "存档至本地文件", "从本地文件读档", "回放当前录像", "下载当前录像", "清空本地存档", "返回主菜单"
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
        "从头回放录像", "从存档开始回放", "选择录像文件", "下载当前录像", "返回游戏"
    ]);
}

////// 绘制分页 //////
ui.prototype.drawPagination = function (page, totalPage, top) {
    // if (totalPage<page) totalPage=page;
    if (totalPage<=1) return;
    if (!core.isset(top)) top=12;

    core.setFont('ui', 'bold 15px Verdana');
    core.setFillStyle('ui', '#DDDDDD');

    var length = core.canvas.ui.measureText(page + " / " + page).width;

    core.canvas.ui.textAlign = 'left';
    core.fillText('ui', page + " / " + totalPage, parseInt((416 - length) / 2), top*32+19);

    core.canvas.ui.textAlign = 'center';
    if (page > 1)
        core.fillText('ui', '上一页', 208 - 80, top*32+19);
    if (page < totalPage)
        core.fillText('ui', '下一页', 208 + 80, top*32+19);
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

    core.clearMap('ui');
    core.setAlpha('ui', 1);

    var width = 4;
    core.strokeRect('ui', 32*core.status.automaticRoute.cursorX+width/2, 32*core.status.automaticRoute.cursorY+width/2,
        32-width, 32-width, '#FFD700', width);

}

////// 绘制怪物手册 //////
ui.prototype.drawBook = function (index) {
    var enemys = core.enemys.getCurrentEnemys(core.floorIds[(core.status.event.selection||{}).index]);
    var background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    clearInterval(core.interval.tipAnimate);
    core.clearMap('data');
    core.setOpacity('data', 1);

    core.clearMap('ui');
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

        if (enemy.specialText=='') {
            core.fillText('ui', enemy.name, 115, 62 * i + 47, '#DDDDDD', 'bold 17px Verdana');
        }
        else {
            core.fillText('ui', enemy.name, 115, 62 * i + 40, '#DDDDDD', 'bold 17px Verdana');
            core.fillText('ui', enemy.specialText, 115, 62 * i + 62, '#FF6A6A', 'bold 15px Verdana');
        }
        core.canvas.ui.textAlign = "left";
        core.fillText('ui', '生命', 165, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.hp||0), 195, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '攻击', 255, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.atk||0), 285, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '防御', 335, 62 * i + 32, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.def||0), 365, 62 * i + 32, '#DDDDDD', 'bold 13px Verdana');

        var expOffset = 165, line_cnt=0;
        if (core.flags.enableMoney) {
            core.fillText('ui', '金币', 165, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', core.formatBigNumber(enemy.money||0), 195, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
            expOffset = 255;
            line_cnt++;
        }

        // 加点
        if (core.flags.enableAddPoint) {
            core.canvas.ui.textAlign = "left";
            core.fillText('ui', '加点', expOffset, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', core.formatBigNumber(enemy.point||0), expOffset + 30, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
            expOffset = 255;
            line_cnt++;
        }

        if (core.flags.enableExperience && line_cnt<2) {
            core.canvas.ui.textAlign = "left";
            core.fillText('ui', '经验', expOffset, 62 * i + 50, '#DDDDDD', '13px Verdana');
            core.fillText('ui', core.formatBigNumber(enemy.experience||0), expOffset + 30, 62 * i + 50, '#DDDDDD', 'bold 13px Verdana');
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
            if (core.enemys.hasSpecial(enemy, 19))
                damage += "+";
            if (core.enemys.hasSpecial(enemy, 21))
                damage += "-";
            if (core.enemys.hasSpecial(enemy, 11))
                damage += "^";
        }
        if (enemy.notBomb)
            damage += "[b]";

        core.fillText('ui', damage, damageOffset, 62 * i + 50, color, 'bold 13px Verdana');

        core.canvas.ui.textAlign = "left";

        core.fillText('ui', '临界', 165, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.critical||0), 195, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '减伤', 255, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.criticalDamage||0), 285, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');
        core.fillText('ui', '1防', 335, 62 * i + 68, '#DDDDDD', '13px Verdana');
        core.fillText('ui', core.formatBigNumber(enemy.defDamage||0), 365, 62 * i + 68, '#DDDDDD', 'bold 13px Verdana');

        if (index == start+i) {
            core.strokeRect('ui', 10, 62 * i + 13, 416-10*2,  62, '#FFD700');
        }

    }
    core.drawBoxAnimate();
    this.drawPagination(page, totalPage, 12);
    core.canvas.ui.textAlign = 'center';
    // 退出
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');
}

////// 绘制怪物属性的详细信息 //////
ui.prototype.drawBookDetail = function (index) {
    var enemys = core.enemys.getCurrentEnemys(core.floorIds[(core.status.event.selection||{}).index]);
    if (enemys.length==0) return;
    if (index<0) index=0;
    if (index>=enemys.length) index=enemys.length-1;

    var enemy = enemys[index], enemyId = enemy.id;
    var hints=core.enemys.getSpecialHint(enemy);

    if (hints.length==0)
        hints.push("该怪物无特殊属性。");

    // 模仿临界计算器
    if (core.enemys.hasSpecial(enemy.special, 10)) {
        var hp = enemy.hp;
        var delta = core.status.hero.atk - core.status.hero.def;
        if (delta<hp && hp<=10000 && hp>0) {
            hints.push("");
            hints.push("模仿临界计算器：（当前攻防差"+core.formatBigNumber(delta)+"）");
            var arr = [];
            (function () {
                var last=0, start=0;
                for (var i=1;i<hp;i++) {
                    var now=parseInt((hp-1)/i);
                    if (now!=last) {
                        if (last!=0) {
                            arr.push([start, last+"x"]);
                        }
                        last=now;
                        start=i;
                    }
                }
                if (last!=0) {
                    arr.push([start,"1x"]);
                    arr.push([hp,"0"]);
                }
            })();
            var u = [];
            arr.forEach(function (t) {
                if (u.length < 20) u.push(t);
                else if (Math.abs(t[0]-delta)<Math.abs(u[0][0]-delta)) {
                    u.shift();
                    u.push(t);
                }
            });
            hints.push(JSON.stringify(u.map(function (v) {return v[0]+":"+v[1];})));
        }
    }

    // 吸血怪的最低生命值
    if (core.enemys.hasSpecial(enemy.special, 11)) {
        var damage = core.getDamage(enemyId);
        if (damage != null) {
            // 二分HP
            var start = 1, end = 100 * damage;
            var nowHp = core.status.hero.hp;
            while (start<end) {
                var mid = Math.floor((start+end)/2);
                core.status.hero.hp = mid;
                if (core.canBattle(enemyId)) end = mid;
                else start = mid+1;
            }
            core.status.hero.hp = start;
            if (core.canBattle(enemyId)) {
                hints.push("");
                hints.push("打死该怪物最低需要生命值："+core.formatBigNumber(start));
            }
            core.status.hero.hp = nowHp;
        }
    }

    // 仇恨伤害
    if (core.enemys.hasSpecial(enemy.special, 17)) {
        hints.push("");
        hints.push("当前仇恨伤害值："+core.getFlag('hatred', 0));
    }

    hints.push("");
    var criticals = core.enemys.nextCriticals(enemyId, 10).map(function (v) {
        return v[0]+":"+v[1];
    });
    while (criticals[0]=='0:0') criticals.shift();
    hints.push("临界表："+JSON.stringify(criticals))

    var content=hints.join("\n");

    core.status.event.id = 'book-detail';
    clearInterval(core.interval.tipAnimate);

    core.clearMap('data');
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
    core.strokeRect('data', left - 1, top - 1, right + 1, bottom + 1, main.borderColor||"#FFFFFF", 2);

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

    core.clearMap('ui');
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
ui.prototype.drawMaps = function (index, x, y) {
    core.lockControl();
    core.status.event.id = 'viewMaps';

    if (!core.isset(index)) {
        core.status.event.data = null;
        core.clearMap('ui');
        core.setAlpha('ui', 1);

        core.clearMap('animate');
        core.setOpacity('animate', 0.4);
        core.fillRect('animate', 0, 0, 416, 416, '#000000');

        core.strokeRect('ui', 66, 2, 284, 60, "#FFD700", 4);
        core.strokeRect('ui', 2, 66, 60, 284);
        core.strokeRect('ui', 66, 416-62, 284, 60);
        core.strokeRect('ui', 416-62, 66, 60, 284);
        core.strokeRect('ui', 66, 66, 284, 92);
        core.strokeRect('ui', 66, 32*8+2, 284, 92);
        core.canvas.ui.textAlign = 'center';
        core.fillText('ui', "上移地图 [W]", 208, 38, '#FFD700', '20px Arial');
        core.fillText('ui', "下移地图 [S]", 208, 390);

        var top = 150;
        core.fillText('ui', "左", 32, top);
        core.fillText('ui', "移", 32, top+32);
        core.fillText('ui', "地", 32, top+32*2);
        core.fillText('ui', "图", 32, top+32*3);
        core.fillText('ui', "[A]", 32, top+32*4);
        core.fillText('ui', "右", 384, top);
        core.fillText('ui', "移", 384, top+32);
        core.fillText('ui', "地", 384, top+32*2);
        core.fillText('ui', "图", 384, top+32*3);
        core.fillText('ui', "[D]", 384, top+32*4);

        core.fillText('ui', "前张地图 [▲ / PGUP]", 208, 64+54);
        core.fillText('ui', "后张地图 [▼ / PGDN]", 208, 32*8+54);

        core.fillText('ui', "退出 [ESC / ENTER]", 208, 208+8);
        core.fillText('ui', "[X] 可查看怪物手册", 285, 208+40, null, '13px Arial');
        return;
    }

    core.clearMap('animate');
    core.setOpacity('animate', 1);

    var damage = (core.status.event.data||{}).damage, paint =  (core.status.event.data||{}).paint;
    if (core.isset(index.damage)) damage=index.damage;
    if (core.isset(index.paint)) paint=index.paint;

    if (core.isset(index.index)) {
        x=index.x;
        y=index.y;
        index=index.index;
    }

    if (index<0) index=0;
    if (index>=core.floorIds.length) index=core.floorIds.length-1;
    var floorId = core.floorIds[index], mw = core.floors[floorId].width||13, mh = core.floors[floorId].height||13;
    if (!core.isset(x)) x = parseInt(mw/2);
    if (!core.isset(y)) y = parseInt(mh/2);
    if (x<6) x=6;
    if (x>mw-7) x=mw-7;
    if (y<6) y=6;
    if (y>mh-7) y=mh-7;

    core.status.event.data = {"index": index, "x": x, "y": y, "damage": damage, "paint": paint};

    clearTimeout(core.interval.tipAnimate);
    core.clearMap('ui');
    core.setAlpha('ui', 1);
    this.drawThumbnail(floorId, 'ui', core.status.maps[floorId].blocks, 0, 0, 416, x, y);

    // 绘图
    if (core.status.event.data.paint) {
        var offsetX = core.clamp(x-6, 0, mw-13), offsetY = core.clamp(y-6, 0, mh-13);
        var value = core.paint[floorId];
        if (core.isset(value)) value = LZString.decompress(value).split(",");
        core.utils.decodeCanvas(value, 32*mw, 32*mh);
        core.canvas.ui.drawImage(core.bigmap.tempCanvas.canvas, offsetX*32, offsetY*32, 416, 416, 0, 0, 416, 416);
    }

    core.clearMap('data');
    core.setOpacity('data', 0.2);
    core.canvas.data.textAlign = 'left';
    core.setFont('data', '16px Arial');

    var text = core.status.maps[floorId].title;
    if (mw>13 || mh>13) text+=" ["+(x-6)+","+(y-6)+"]";
    var textX = 16, textY = 18, width = textX + core.canvas.data.measureText(text).width + 16, height = 42;
    core.fillRect('data', 5, 5, width, height, '#000');
    core.setOpacity('data', 0.4);
    core.fillText('data', text, textX + 5, textY + 15, '#fff');

}

////// 绘制道具栏 //////
ui.prototype.drawToolbox = function(index) {
    // 设定eventdata
    if (!core.isset(core.status.event.data) || !core.isset(core.status.event.data.toolsPage) || !core.isset(core.status.event.data.constantsPage))
        core.status.event.data = {"toolsPage":1, "constantsPage":1, "selectId":null}

    // 获取物品列表
    var tools = Object.keys(core.status.hero.items.tools).sort();
    var constants = Object.keys(core.status.hero.items.constants).sort();

    // 处理页数
    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    var toolsTotalPage = Math.ceil(tools.length/12);
    var constantsTotalPage = Math.ceil(constants.length/12);

    // 处理index
    if (!core.isset(index)) {
        if (tools.length>0) index=0;
        else if (constants.length>0) index=12;
        else index=0;
    }
    core.status.event.selection=index;

    // 确认选择对象
    var select;
    var selectId;
    if (index<12) {
        select = index + (toolsPage-1)*12;
        if (select>=tools.length) select=Math.max(0, tools.length-1);
        selectId = tools[select];
    }
    else {
        select = index%12 + (constantsPage-1)*12;
        if (select>=constants.length) select=Math.max(0, constants.length-1);
        selectId = constants[select];
    }
    if (!core.hasItem(selectId)) selectId=null;
    core.status.event.data.selectId=selectId;

    // 绘制
    core.clearMap('ui');
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
        try {
            // 检查能否eval
            text = eval(text);
        } catch (e) {}

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
        var tool=tools[12*(toolsPage-1)+i];
        if (!core.isset(tool)) break;
        var yoffset = 144 + Math.floor(i/6)*54 + 5 - ydelta;
        var icon=core.material.icons.items[tool];
        core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i%6)+1)+5, yoffset, 32, 32)
        // 个数
        core.fillText('ui', core.itemCount(tool), 16*(4*(i%6)+1)+40, yoffset+33, '#FFFFFF', "bold 14px Verdana");
        if (selectId == tool)
            core.strokeRect('ui', 16*(4*(i%6)+1)+1, yoffset-4, 40, 40, '#FFD700');
    }

    // 永久道具
    for (var i=0;i<12;i++) {
        var constant=constants[12*(constantsPage-1)+i];
        if (!core.isset(constant)) break;
        var yoffset = 304+Math.floor(i/6)*54+5-ydelta;
        var icon=core.material.icons.items[constant];
        core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i%6)+1)+5, yoffset, 32, 32)
        if (selectId == constant)
            core.strokeRect('ui', 16*(4*(i%6)+1)+1, yoffset-4, 40, 40, '#FFD700');
    }

    // 分页
    this.drawPagination(toolsPage, toolsTotalPage, 7);
    this.drawPagination(constantsPage, constantsTotalPage, 12);

    core.canvas.ui.textAlign = 'center';

    // 装备栏
    // if (core.flags.equipment)
    core.fillText('ui', '[装备栏]', 370, 25,'#DDDDDD', 'bold 15px Verdana');
    // core.fillText('ui', '删除道具', 370, 32,'#DDDDDD', 'bold 15px Verdana');
    // 退出
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');
}

////// 绘制装备界面 //////
ui.prototype.drawEquipbox = function(index) {
    // 设定eventdata
    if (!core.isset(core.status.event.data) || !core.isset(core.status.event.data.page))
        core.status.event.data = {"page":1, "selectId":null};

    var allEquips = main.equipName||[];
    var equipLength = allEquips.length;

    if (!core.isset(core.status.hero.equipment)) core.status.hero.equipment = [];

    var equipEquipment = core.status.hero.equipment;
    var ownEquipment = Object.keys(core.status.hero.items.equips).sort();
    
    var page = core.status.event.data.page;
    var totalPage = Math.ceil(ownEquipment.length/12);

    // 处理index
    if (!core.isset(index)) {
        if (equipLength>0 && core.isset(equipEquipment[0])) index=0;
        else if (ownEquipment.length>0) index=12;
        else index=0;
    }
    if (index>=12 && ownEquipment.length==0) index = 0;
    var selectId=null;
    if (index<12) {
        if (index >= equipLength) index=Math.max(0, equipLength - 1);
        selectId = equipEquipment[index]||null;
    }
    else {
        if (page == totalPage) index = Math.min(index, (ownEquipment.length+11)%12+12);
        selectId = ownEquipment[index-12 + (page-1)*12];
        if (!core.hasItem(selectId)) selectId=null;
    }
    core.status.event.selection=index;
    core.status.event.data.selectId=selectId;

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
    core.fillText('ui', "当前装备", 411, 124-ydelta, '#333333', "bold 16px Verdana");
    core.fillText('ui', "拥有装备", 411, 284-ydelta);
    
    core.canvas.ui.textAlign = 'left';

    // 描述
    if (core.isset(selectId)) {
        var equip=core.material.items[selectId];
        if (!core.isset(equip.equip)) equip.equip = {"type": 0};
        var equipType = equip.equip.type;
        core.fillText('ui', equip.name + "（" + (allEquips[equipType]||"未知部位") + "）", 10, 32, '#FFD700', "bold 20px Verdana")

        var text = equip.text||"该装备暂无描述。";
        var lines = core.splitLines('ui', text, 406, '17px Verdana');

        core.fillText('ui', lines[0], 10, 62, '#FFFFFF', '17px Verdana');
        
        // 比较属性
        if (lines.length==1) {
            var compare;
            if (index<12) compare = core.compareEquipment(null, selectId);
            else {
                compare = core.compareEquipment(selectId, equipEquipment[equip.equip.type]);
            }
            var drawOffset = 10;

            [['攻击','atk'], ['防御','def'], ['魔防','mdef']].forEach(function (t) {
                var title = t[0], name = t[1];
                if (!core.isset(compare[name]) || compare[name]==0) return;
                var color = '#00FF00';
                if (compare[name]<0) color = '#FF0000';
                var nowValue = core.getStatus(name), newValue = nowValue + compare[name];
                if (core.flags.equipPercentage) {
                    var nowBuff = core.getFlag('equip_'+name+"_buff",1), newBuff = nowBuff+compare[name]/100;
                    nowValue = Math.floor(nowBuff*core.getStatus(name));
                    newValue = Math.floor(newBuff*core.getStatus(name));
                }
                var content = title + ' ' + nowValue + '->';
                core.fillText('ui', content, drawOffset, 89, '#CCCCCC', 'bold 14px Verdana');
                drawOffset += core.canvas.ui.measureText(content).width;
                core.fillText('ui', newValue, drawOffset, 89, color);
                drawOffset += core.canvas.ui.measureText(newValue).width + 15;
            })
        }
        else {
            var leftText = text.substring(lines[0].length);
            core.fillText('ui', leftText, 10, 89, '#FFFFFF', '17px Verdana');
        }
    }

    core.canvas.ui.textAlign = 'right';
    var images = core.material.images.items;

    // 当前装备
    for (var i = 0 ; i < equipLength ; i++) {
        var equipId = equipEquipment[i] || null;
        if (core.isset(equipId)) {
            var icon = core.material.icons.items[equipId];
            core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(8*(i%3)+5)+5, 144+Math.floor(i/3)*54+5-ydelta, 32, 32);
        }
        core.fillText('ui', allEquips[i]||"未知", 16*(8*(i%3)+1)+40, 144+Math.floor(i/3)*54+32-ydelta, '#FFFFFF', "bold 16px Verdana");
        core.strokeRect('ui', 16*(8*(i%3)+5)+1, 144+Math.floor(i/3)*54+1-ydelta, 40, 40, index==i?'#FFD700':"#FFFFFF");
    }

    // 现有装备 
    for (var i=0;i<12;i++) {
        var ownEquip=ownEquipment[12*(page-1)+i];
        if (!core.isset(ownEquip)) continue;
        var icon=core.material.icons.items[ownEquip];
        core.canvas.ui.drawImage(images, 0, icon*32, 32, 32, 16*(4*(i%6)+1)+5, 304+Math.floor(i/6)*54+5-ydelta, 32, 32)
        // 个数
        if (core.itemCount(ownEquip)>1)
            core.fillText('ui', core.itemCount(ownEquip), 16*(4*(i%6)+1)+40, 304+Math.floor(i/6)*54+38-ydelta, '#FFFFFF', "bold 14px Verdana");
        if (index>=12 && selectId == ownEquip)
            core.strokeRect('ui', 16*(4*(i%6)+1)+1, 304+Math.floor(i/6)*54+1-ydelta, 40, 40, '#FFD700');
    }

    this.drawPagination(page, totalPage, 12);
    // 道具栏
    core.canvas.ui.textAlign = 'center';
    core.fillText('ui', '[道具栏]', 370, 25,'#DDDDDD', 'bold 15px Verdana');
    // 退出按钮
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');
}

////// 绘制存档/读档界面 //////
ui.prototype.drawSLPanel = function(index, refresh) {
    if (!core.isset(index)) index=1;
    if (index<0) index=0;

    var page = parseInt(index/10), offset=index%10;
    var max_page = main.savePages || 30;
    if (page>=max_page) page=max_page - 1;
    if (offset>5) offset=5;
    index=10*page+offset;

    var last_page = -1;
    if (core.isset(core.status.event.data)) {
        last_page = parseInt(core.status.event.data/10);
    }

    core.status.event.data=index;
    if (!core.isset(core.status.event.ui))
        core.status.event.ui = [];

    var u=416/6, size=118;

    var strokeColor = '#FFD700';
    if (core.status.event.selection) strokeColor = '#FF6A6A';

    var drawBg = function() {
        core.clearMap('ui');
        core.setAlpha('ui', 0.85);
        core.fillRect('ui', 0, 0, 416, 416, '#000000');
        core.setAlpha('ui', 1);

        core.ui.drawPagination(page+1, max_page, 12);
        core.canvas.ui.textAlign = 'center';
        // 退出
        core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px Verdana');

        if (core.status.event.selection)
            core.setFillStyle('ui', '#FF6A6A');
        if (core.status.event.id=='save')
            core.fillText('ui', '删除模式', 48, 403);
        else
            core.fillText('ui', '输入编号', 48, 403);
    }

    var draw = function (data, i) {
        var name=core.status.event.id=='save'?"存档":core.status.event.id=='load'?"读档":core.status.event.id=='replayLoad'?"回放":"";
        core.status.event.ui[i] = data;
        var id=5*page+i;
        if (i<3) {
            core.fillText('ui', i==0?"自动存档":name+id, (2*i+1)*u, 30, '#FFFFFF', "bold 17px Verdana");
            core.strokeRect('ui', (2*i+1)*u-size/2, 45, size, size, i==offset?strokeColor:'#FFFFFF', i==offset?6:2);
            if (core.isset(data) && core.isset(data.floorId)) {
                core.ui.drawThumbnail(data.floorId, 'ui', core.maps.load(data.maps, data.floorId).blocks, (2*i+1)*u-size/2, 45, size, data.hero.loc.x, data.hero.loc.y, data.hero.loc, data.hero.flags.heroIcon||"hero.png");
                var v = core.formatBigNumber(data.hero.hp)+"/"+core.formatBigNumber(data.hero.atk)+"/"+core.formatBigNumber(data.hero.def);
                var v2 = "/"+core.formatBigNumber(data.hero.mdef);
                if (v.length+v2.length<=21) v+=v2;
                core.fillText('ui', v, (2*i+1)*u, 60+size, '#FFD700', '10px Verdana');
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i+1)*u, 73+size, data.hero.flags.consoleOpened?'#FF6A6A':'#FFFFFF');
            }
            else {
                core.fillRect('ui', (2*i+1)*u-size/2, 45, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i+1)*u, 112, '#FFFFFF', 'bold 30px Verdana');
            }
        }
        else {
            core.fillText('ui', name+id, (2*i-5)*u, 218, '#FFFFFF', "bold 17px Verdana");
            core.strokeRect('ui', (2*i-5)*u-size/2, 233, size, size, i==offset?strokeColor:'#FFFFFF', i==offset?6:2);
            if (core.isset(data) && core.isset(data.floorId)) {
                core.ui.drawThumbnail(data.floorId, 'ui', core.maps.load(data.maps, data.floorId).blocks, (2*i-5)*u-size/2, 233, size, data.hero.loc.x, data.hero.loc.y, data.hero.loc, data.hero.flags.heroIcon||"hero.png");
                var v = core.formatBigNumber(data.hero.hp)+"/"+core.formatBigNumber(data.hero.atk)+"/"+core.formatBigNumber(data.hero.def);
                var v2 = "/"+core.formatBigNumber(data.hero.mdef);
                if (v.length+v2.length<=21) v+=v2;
                core.fillText('ui', v, (2*i-5)*u, 248+size, '#FFD700', '10px Verdana');
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i-5)*u, 261+size, data.hero.flags.consoleOpened?'#FF6A6A':'#FFFFFF', '10px Verdana');
            }
            else {
                core.fillRect('ui', (2*i-5)*u-size/2, 233, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i-5)*u, 297, '#FFFFFF', 'bold 30px Verdana');
            }
        }
    };

    function loadSave(i, callback) {
        if (i==6) {
            callback();
            return;
        }
        core.getLocalForage(i==0?"autoSave":"save"+(5*page+i), null, function(data) {
            core.status.event.ui[i]=data;
            loadSave(i+1, callback);
        }, function(err) {console.log(err);});
    }

    function drawAll() {
        drawBg();
        for (var i=0;i<6;i++)
            draw(core.status.event.ui[i], i);
    }
    if (refresh || page!=last_page) {
        core.status.event.ui = [];
        loadSave(0, drawAll);
    }
    else drawAll();
}

////// 绘制一个缩略图 //////
ui.prototype.drawThumbnail = function(floorId, canvas, blocks, x, y, size, centerX, centerY, heroLoc, heroIcon) {

    var mw = core.floors[floorId].width || 13;
    var mh = core.floors[floorId].height || 13;
    // 绘制到tempCanvas上面
    var tempCanvas = core.bigmap.tempCanvas;
    var tempWidth = mw*32, tempHeight = mh*32;
    tempCanvas.canvas.width = tempWidth;
    tempCanvas.canvas.height = tempHeight;
    tempCanvas.clearRect(0, 0, tempWidth, tempHeight);

    // background map
    core.maps.drawBgFgMap(floorId, tempCanvas, "bg");

    // background image
    var images = [];
    if (core.isset((core.status.maps||core.floors)[floorId].images)) {
        images = (core.status.maps||core.floors)[floorId].images;
        if (typeof images == 'string') {
            images = [[0, 0, images]];
        }
    }
    images.forEach(function (t) {
        var dx=parseInt(t[0]), dy=parseInt(t[1]), p=t[2];
        if (core.isset(dx) && core.isset(dy) &&
            !core.hasFlag("floorimg_"+floorId+"_"+dx+"_"+dy) &&
            core.isset(core.material.images.images[p])) {
            var image = core.material.images.images[p];
            if (!t[3])
                tempCanvas.drawImage(image, 32 * dx, 32 * dy, image.width, image.height);
            else if (t[3]==2)
                tempCanvas.drawImage(image, 0, image.height-32, image.width, 32,
                    32 * dx, 32 * dy + image.height - 32, image.width, 32);
        }
    })
    // draw block
    var mapArray = core.maps.getMapArray(blocks,mw,mh);
    for (var b in blocks) {
        var block = blocks[b];
        if (core.isset(block.event) && !block.disable) {
            if (block.event.cls == 'autotile') {
                core.drawAutotile(tempCanvas, mapArray, block, 32, 0, 0);
            }
            else if (block.event.cls == 'tileset') {
                var offset = core.icons.getTilesetOffset(block.event.id);
                if (offset!=null) {
                    tempCanvas.drawImage(core.material.images.tilesets[offset.image], 32*offset.x, 32*offset.y, 32, 32, 32*block.x, 32*block.y, 32, 32);
                }
            }
            else if (block.id==17) {
                if (core.isset(core.material.images.airwall)) {
                    tempCanvas.drawImage(core.material.images.airwall, 32*block.x, 32*block.y);
                }
            }
            else if (block.event.id!='none') {
                var blockIcon = core.material.icons[block.event.cls][block.event.id];
                var blockImage = core.material.images[block.event.cls];
                var height = block.event.height || 32;
                tempCanvas.drawImage(blockImage, 0, blockIcon * height, 32, height, 32*block.x, 32*block.y + 32 - height, 32, height);
            }
        }
    }
    // draw hero
    if (core.isset(heroLoc)) {
        if (!core.isset(core.material.images.images[heroIcon]))
            heroIcon = "hero.png";
        var icon = core.material.icons.hero[heroLoc.direction];
        var height = core.material.images.images[heroIcon].height/4;
        tempCanvas.drawImage(core.material.images.images[heroIcon], icon.stop * 32, icon.loc * height, 32, height, 32*heroLoc.x, 32*heroLoc.y+32-height, 32, height);
    }
    // foreground map
    core.maps.drawBgFgMap(floorId, tempCanvas, "fg");

    // draw fg
    images.forEach(function (t) {
        var dx=parseInt(t[0]), dy=parseInt(t[1]), p=t[2];
        if (core.isset(dx) && core.isset(dy) &&
            !core.hasFlag("floorimg_"+floorId+"_"+dx+"_"+dy) &&
            core.isset(core.material.images.images[p])) {
            var image = core.material.images.images[p];
            if (t[3]==1)
                tempCanvas.drawImage(image, 32*dx, 32*dy, image.width, image.height);
            else if (t[3]==2)
                tempCanvas.drawImage(image, 0, 0, image.width, image.height-32,
                    32*dx, 32*dy, image.width, image.height-32);
        }
    })

    // draw damage
    if (core.status.event.id=='viewMaps' && (core.status.event.data||{}).damage)
        core.control.updateDamage(floorId, tempCanvas);

    // draw to canvas
    core.clearMap(canvas, x, y, size, size);
    if (!core.isset(centerX)) centerX=parseInt(mw/2);
    if (!core.isset(centerY)) centerY=parseInt(mh/2);

    var offsetX = core.clamp(centerX-6, 0, mw-13), offsetY = core.clamp(centerY-6, 0, mh-13);
    // offsetX~offsetX+12; offsetY~offsetY+12
    core.canvas[canvas].drawImage(tempCanvas.canvas, offsetX*32, offsetY*32, 416, 416, x, y, size, size);
}

ui.prototype.drawKeyBoard = function () {
    core.lockControl();
    core.status.event.id = 'keyBoard';

    core.clearMap('ui');

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

    core.canvas.ui.textAlign = 'center';

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

    var ori = this.uidata.drawStatistics();
    var ids = ori.filter(function (e) {
        return e.endsWith("Door") || core.isset(core.material.items[e]);
    });
    var obj = {};
    var cls = {};
    ids.forEach(function (e) {
        if (e.endsWith("Door")) cls[e] = "doors";
        else cls[e] = core.material.items[e].cls;
        obj[e] = 0;
    })
    var order = ["doors", "keys", "items", "tools", "constants", "equips"];
    ids.sort(function (a, b) {
        var c1 = order.indexOf(cls[a]), c2 = order.indexOf(cls[b]);
        if (c1==c2) return ori.indexOf(a)-ori.indexOf(b);
        return c1-c2;
    });
    var ext = {};

    var total = {
        'monster': {
            'count': 0, 'money': 0, 'experience': 0, 'point': 0,
        },
        'count': obj,
        'add': {
            'hp': 0, 'atk': 0, 'def': 0, 'mdef': 0
        }
    };
    var current = core.clone(total);

    core.floorIds.forEach(function (floorId) {
        var floor=core.status.maps[floorId];
        var blocks=core.status.maps[floorId].blocks;
        // 隐藏层不给看
        if (floor.cannotViewMap && floorId!=core.status.floorId) return;

        blocks.forEach(function (block) {
            if (!core.isset(block.event) || block.disable)
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

                    if (cls[id]=='items' && id!='superPotion') {
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
                        // 装备
                        if (cls[id]=='equips') {
                            var values = core.material.items[id].equip||{};
                            atk = values.atk||0;
                            def = values.def||0;
                            mdef = values.mdef||0;
                        }
                    }

                    if (id.indexOf('sword')==0 || id.indexOf('shield')==0 || cls[id]=='equips') {
                        var t = "";
                        if (atk>0) t+=atk+"攻";
                        if (def>0) t+=def+"防";
                        if (mdef>0) t+=mdef+"魔防";
                        if (t!="") ext[id]=t;
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
        text+="。\n";

        var prev = "";
        ids.forEach(function (key) {
            var value = data.count[key];
            if (value==0) return;
            var c = cls[key];
            if (c!=prev) {
                if (prev != "") text += "。";
                text += "\n";
            }
            else
                text += "，";
            prev = c;
            var name = null;
            if (key=='yellowDoor') name="黄门";
            else if (key=='blueDoor') name="蓝门";
            else if (key=='redDoor') name="红门";
            else if (key=='greenDoor') name="绿门";
            else if (key=='steelDoor') name="铁门";
            else name=core.material.items[key].name;
            text+=name+value+"个";
            if (core.isset(ext[key]))
                text+="("+ext[key]+")";
        })

        if (prev!="") text+="。";
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
        +"总计打死了"+statistics.battle+"个怪物，受到的伤害为"+core.formatBigNumber(statistics.battleDamage+statistics.poisonDamage+statistics.extraDamage)
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

////// 绘制“画图”界面 //////
ui.prototype.drawPaint = function () {

    core.drawText(
        "\t[进入绘图模式]你可以在此页面上任意进行绘图和标记操作。\nM键可以进入或退出此模式。\n\n"+
        "绘图的内容会自动保存，且以页面为生命周期，和存读档无关，重新开始游戏或读档后绘制的内容仍有效，但刷新页面就会消失。\n"+
        "你可以将绘制内容保存到文件，也可以从文件读取保存的绘制内容。\n"+
        "浏览地图页面可以按楼传按钮或M键来开启/关闭该层的绘图显示。\n\n更多功能请详见文档-元件-绘图模式。",
        function () {
            core.drawTip("打开绘图模式，现在可以任意在界面上绘图标记");

            core.lockControl();
            core.status.event.id = 'paint';
            core.status.event.data = {"x": null, "y": null, "erase": false};

            core.clearMap('ui');
            core.clearMap('route');

            core.setAlpha('route', 1);
            core.setOpacity('route', 1);

            // 将已有的内容绘制到route上
            var value = core.paint[core.status.floorId];
            if (core.isset(value)) value = LZString.decompress(value).split(",");
            core.utils.decodeCanvas(value, 32*core.bigmap.width, 32*core.bigmap.height);
            core.canvas.route.drawImage(core.bigmap.tempCanvas.canvas, 0, 0);

            core.setLineWidth('route', 3);
            core.setStrokeStyle('route', '#FF0000');

            core.statusBar.image.shop.style.opacity = 0;

            core.statusBar.image.book.src = core.statusBar.icons.paint.src;
            core.statusBar.image.fly.src = core.statusBar.icons.erase.src;
            core.statusBar.image.toolbox.src = core.statusBar.icons.empty.src;
            core.statusBar.image.settings.src = core.statusBar.icons.exit.src;
            core.statusBar.image.book.style.opacity = 1;
            core.statusBar.image.fly.style.opacity = 1;
        }
    );
}

////// 绘制帮助页面 //////
ui.prototype.drawHelp = function () {
    core.drawText([
        "\t[键盘快捷键列表]"+
        "[CTRL] 跳过对话   [Z] 转向\n" +
        "[X] 怪物手册   [G] 楼层传送\n" +
        "[A] 读取自动存档   [S/D] 存读档页面\n" +
        "[S/D] 打开/关闭存/读档页面\n" +
        "[K/V] 快捷商店   [ESC] 系统菜单\n" +
        "[T] 道具页面   [Q] 装备页面\n" +
        "[B] 数据统计  [H] 帮助页面\n" +
        "[R] 回放录像  [E] 显示光标\n" +
        "[SPACE] 轻按   [M] 绘图模式\n" +
        "[PgUp/PgDn] 浏览地图\n"+
        "[1~4] 快捷使用破炸飞和其他道具\n"+
        "[Alt+0~9] 快捷换装",
        "\t[鼠标操作]"+
        "点状态栏中图标： 进行对应的操作\n"+
        "点任意块： 寻路并移动\n"+
        "点任意块并拖动： 指定寻路路线\n"+
        "双击空地： 瞬间移动\n"+
        "单击勇士： 转向\n"+
        "双击勇士： 轻按（仅在轻按开关打开时有效）\n"+
        "长按任意位置：跳过剧情对话或打开虚拟键盘"
    ]);
}

