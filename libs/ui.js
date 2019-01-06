/**
 * ui.js：负责所有和UI界面相关的绘制
 * 包括：
 * 自动寻路、怪物手册、楼传器、存读档、菜单栏、NPC对话事件、等等
 */

"use strict";

function ui() {
    this.init();
}

// 初始化UI
ui.prototype.init = function () {
    this.uidata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.ui;
}

////////////////// 地图设置

ui.prototype.getContextByName = function (canvas) {
    if (typeof canvas == 'string') {
        if (core.isset(core.canvas[canvas]))
            canvas = core.canvas[canvas];
        else if (core.isset(core.dymCanvas[canvas]))
            canvas = core.dymCanvas[canvas];
    }
    if (core.isset(canvas) && core.isset(canvas.canvas)) {
        return canvas;
    }
    return null;
}

////// 清除地图 //////
ui.prototype.clearMap = function (name, x, y, width, height) {
    if (name == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
        }
        core.dom.gif.innerHTML = "";
        core.removeGlobalAnimate(0,0,true);
    }
    else {
        var ctx = this.getContextByName(name);
        if (ctx) ctx.clearRect(x||0, y||0, width||ctx.canvas.width, height||ctx.canvas.height);
    }
}

////// 在某个canvas上绘制一段文字 //////
ui.prototype.fillText = function (name, text, x, y, style, font) {
    if (core.isset(style)) {
        core.setFillStyle(name, style);
    }
    if (core.isset(font)) {
        core.setFont(name, font);
    }
    var ctx = this.getContextByName(name);
    if (ctx) ctx.fillText(text, x, y);
}

////// 在某个canvas上绘制粗体 //////
ui.prototype.fillBoldText = function (name, text, x, y, style, font) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (core.isset(font)) ctx.font = font;
    if (!core.isset(style)) style = ctx.fillStyle;
    ctx.fillStyle = '#000000';
    ctx.fillText(text, x-1, y-1);
    ctx.fillText(text, x-1, y+1);
    ctx.fillText(text, x+1, y-1);
    ctx.fillText(text, x+1, y+1);
    ctx.fillStyle = style;
    ctx.fillText(text, x, y);
}

////// 在某个canvas上绘制一个矩形 //////
ui.prototype.fillRect = function (name, x, y, width, height, style) {
    if (core.isset(style)) {
        core.setFillStyle(name, style);
    }
    var ctx = this.getContextByName(name);
    if (ctx) ctx.fillRect(x, y, width, height);
}

////// 在某个canvas上绘制一个矩形的边框 //////
ui.prototype.strokeRect = function (name, x, y, width, height, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(name, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(name, lineWidth);
    }
    var ctx = this.getContextByName(name);
    if (ctx) ctx.strokeRect(x, y, width, height);
}

////// 在某个canvas上绘制一条线 //////
ui.prototype.drawLine = function (name, x1, y1, x2, y2, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(name, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(name, lineWidth);
    }
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

////// 在某个canvas上绘制一个箭头 //////
ui.prototype.drawArrow = function (name, x1, y1, x2, y2, style, lineWidth) {
    if (x1==x2 && y1==y2) return;
    if (core.isset(style)) {
        core.setStrokeStyle(name, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(name, lineWidth);
    }
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    var head = 10;
    var dx = x2-x1, dy=y2-y1;
    var angle = Math.atan2(dy,dx);
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2-head*Math.cos(angle-Math.PI/6),y2-head*Math.sin(angle-Math.PI/6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2-head*Math.cos(angle+Math.PI/6),y2-head*Math.sin(angle+Math.PI/6));
    ctx.stroke();
}

////// 设置某个canvas的文字字体 //////
ui.prototype.setFont = function (name, font) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.font = font;
}

////// 设置某个canvas的线宽度 //////
ui.prototype.setLineWidth = function (name, lineWidth) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.lineWidth = lineWidth;
}

////// 保存某个canvas状态 //////
ui.prototype.saveCanvas = function (name) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.save();
}

////// 加载某个canvas状态 //////
ui.prototype.loadCanvas = function (name) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.restore();
}

////// 设置某个canvas的alpha值 //////
ui.prototype.setAlpha = function (name, alpha) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.globalAlpha = alpha;
}

////// 设置某个canvas的透明度；尽量不要使用本函数，而是全部换成setAlpha实现 //////
ui.prototype.setOpacity = function (name, opacity) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.canvas.style.opacity = opacity;
}

////// 设置某个canvas的绘制属性（如颜色等） //////
ui.prototype.setFillStyle = function (name, style) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.fillStyle = style;
}

////// 设置某个canvas边框属性 //////
ui.prototype.setStrokeStyle = function (name, style) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.strokeStyle = style;
}

////// 设置某个canvas的对齐 //////
ui.prototype.setTextAlign = function (name, align) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.textAlign = align;
}

////// 计算某段文字的宽度 //////
ui.prototype.calWidth = function (name, text, font) {
    var ctx = this.getContextByName(name);
    if (ctx) {
        if (core.isset(font)) ctx.font = font;
        return ctx.measureText(text).width;
    }
    return 0;
}

////// 绘制一张图片 //////
ui.prototype.drawImage = function (name, image, x, y, w, h, x1, y1, w1, h1) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (typeof image == 'string') {
        image = core.material.images.images[image];
        if (!core.isset(image)) return;
    }

    // 只能接受2, 4, 8个参数
    if (core.isset(x) && core.isset(y)) {
        if (core.isset(w) && core.isset(h)) {
            if (core.isset(x1) && core.isset(y1) && core.isset(w1) && core.isset(h1)) {
                ctx.drawImage(image, x, y, w, h, x1, y1, w1, h1);
                return;
            }
            ctx.drawImage(image, x, y, w, h);
            return;
        }
        ctx.drawImage(image, x, y);
        return;
    }
}

///////////////// UI绘制

////// 结束一切事件和绘制，关闭UI窗口，返回游戏进程 //////
ui.prototype.closePanel = function () {
    core.status.boxAnimateObjs = [];
    clearInterval(core.status.event.interval);
    core.clearLastEvent();
    core.maps.generateGroundPattern();
    core.unLockControl();
    core.status.event.data = null;
    core.status.event.id = null;
    core.status.event.selection = null;
    core.status.event.ui = null;
    core.status.event.interval = null;
}

////// 一般清除事件 //////
ui.prototype.clearLastEvent = function () {
    if (core.isset(core.dymCanvas.selector))
        core.deleteCanvas("selector");
    core.clearMap('ui');
    core.setAlpha('ui', 1);
}

////// 左上角绘制一段提示 //////
ui.prototype.drawTip = function (text, itemIcon) {
    var textX, textY, width, height, hide = false, alpha = 0;
    clearInterval(core.interval.tipAnimate);
    core.setFont('data', "16px Arial");
    core.setTextAlign('data', 'left');
    if (!core.isset(itemIcon)) {
        textX = 16;
        textY = 18;
        width = textX + core.calWidth('data', text) + 16;
        height = 42;
    }
    else {
        textX = 44;
        textY = 18;
        width = textX + core.calWidth('data', text) + 8;
        height = 42;
    }
    core.interval.tipAnimate = window.setInterval(function () {
        if (hide) {
            alpha -= 0.1;
        }
        else {
            alpha += 0.1;
        }
        core.clearMap('data', 5, 5, 416, height);
        core.setAlpha('data', alpha);
        core.fillRect('data', 5, 5, width, height, '#000');
        if (core.isset(itemIcon)) {
            core.drawImage('data', core.material.images.items, 0, itemIcon * 32, 32, 32, 10, 8, 32, 32);
        }
        core.fillText('data', text, textX + 5, textY + 15, '#fff');
        core.setAlpha('data', 1);
        if (alpha > 0.6 || alpha < 0) {
            if (hide) {
                core.clearMap('data', 5, 5, 416, height);
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
                alpha = 0.6;
            }
        }
    }, 30);
}

////// 地图中间绘制一段文字 //////
ui.prototype.drawText = function (contents, callback) {
    if (core.isset(contents)) {

        // 合并
        if ((core.isset(core.status.event)&&core.status.event.id=='action') || core.isReplaying()) {
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

ui.prototype.getTitleAndIcon = function (content) {
    var id=null, name=null, image=null, icon=null, iconHeight=32, animate=null;

    var getInfo = function (v) {
        ["enemy48", "enemys", "npc48", "npcs"].forEach(function (x) {
            if (core.isset(core.material.icons[x][v])) {
                image = core.material.images[x];
                icon = core.material.icons[x][v];
                if (x.indexOf("48")>=0) {
                    iconHeight = 48;
                    animate = 4;
                }
                else {
                    iconHeight = 32;
                    animate = 2;
                }
            }
        });
    };

    if (content.indexOf("\t[")==0 || content.indexOf("\\t[")==0) {
        var index = content.indexOf("]");
        if (index>=0) {
            var str=content.substring(2, index);
            if (content.indexOf("\\t[")==0) str=content.substring(3, index);
            content=content.substring(index+1);
            var ss=str.split(",");
            if (ss.length==1) {
                if (/^[-\w.]+\.png$/.test(ss[0])) {
                    image = core.material.images.images[ss[0]];
                }
                else {
                    id=ss[0];
                    if (id=='hero') name = core.status.hero.name;
                    else if (core.isset(core.material.enemys[id])) {
                        name = core.material.enemys[id].name;
                        getInfo(id);
                    }
                    else {
                        name=id;
                        id='npc';
                    }
                }
            }
            else {
                name=ss[0];
                id = 'npc';
                if (ss[1]=='hero') id = 'hero';
                else if (/^[-\w.]+\.png$/.test(ss[1])) {
                    image = core.material.images.images[ss[1]];
                }
                else getInfo(ss[1]);
            }
        }
    }
    return {
        "content": content,
        "id": id,
        "name": name,
        "image": image,
        "icon": icon,
        "iconHeight": iconHeight,
        "animate": animate
    };
}

// 绘制选择光标
ui.prototype.drawWindowSelector = function(background,x,y,w,h) {
    w = Math.round(w), h = Math.round(h);
    var dstImage = core.ui.createCanvas("selector", x, y, w, h, 165);
    core.setOpacity("selector", 0.8);
    // back
    dstImage.drawImage(background, 130, 66, 28, 28,  2,  2,w-4,h-4);
    // corner
    dstImage.drawImage(background, 128, 64,  2,  2,  0,  0,  2,  2);
    dstImage.drawImage(background, 158, 64,  2,  2,w-2,  0,  2,  2);
    dstImage.drawImage(background, 128, 94,  2,  2,  0,h-2,  2,  2);
    dstImage.drawImage(background, 158, 94,  2,  2,w-2,h-2,  2,  2);
    // border
    dstImage.drawImage(background, 130, 64, 28,  2,  2,  0,w-4,  2);
    dstImage.drawImage(background, 130, 94, 28,  2,  2,h-2,w-4,  2);
    dstImage.drawImage(background, 128, 66,  2, 28,  0,  2,  2,h-4);
    dstImage.drawImage(background, 158, 66,  2, 28,w-2,  2,  2,h-4);
}

// 绘制皮肤
ui.prototype.drawWindowSkin = function(background,canvas,x,y,w,h,direction,px,py) {
	// 仿RM窗口皮肤 ↓
    var dstImage = core.getContextByName(canvas);
    if (!dstImage) return;
    // 绘制背景
    dstImage.drawImage(background, 0, 0, 128, 128, x+2, y+2, w-4, h-4);
    // 绘制边框
    // 上方
    dstImage.drawImage(background, 128, 0,     16,     16,      x,      y,     16,     16);
    for (var dx = 0; dx < w - 64; dx += 32) {
    dstImage.drawImage(background, 144, 0,     32,     16,x+dx+16,      y,     32,     16);
    dstImage.drawImage(background, 144,48,     32,     16,x+dx+16, y+h-16,     32,     16);
    }
    dstImage.drawImage(background, 144, 0,w-dx-32,     16,x+dx+16,      y,w-dx-32,     16);
    dstImage.drawImage(background, 144,48,w-dx-32,     16,x+dx+16, y+h-16,w-dx-32,     16);
    dstImage.drawImage(background, 176, 0,     16,     16, x+w-16,      y,     16,     16);
    // 左右
    for (var dy = 0; dy < h - 64; dy += 32) {
    dstImage.drawImage(background, 128,16,     16,     32,      x,y+dy+16,     16,     32);
    dstImage.drawImage(background, 176,16,     16,     32, x+w-16,y+dy+16,     16,     32);
    }
    dstImage.drawImage(background, 128,16,     16,h-dy-32,      x,y+dy+16,     16,h-dy-32);
    dstImage.drawImage(background, 176,16,     16,h-dy-32, x+w-16,y+dy+16,     16,h-dy-32);
    // 下方
    dstImage.drawImage(background, 128,48,     16,     16,      x, y+h-16,     16,     16);
    dstImage.drawImage(background, 176,48,     16,     16, x+w-16, y+h-16,     16,     16);

    // arrow
    if(core.isset(px) && core.isset(py)){
    	if(direction == 'up'){
    		dstImage.drawImage(background,128,96,32,32,px,y+h-3,32,32);
    	}else if(direction == 'down') {
    		dstImage.drawImage(background,160,96,32,32,px,y-29,32,32);
    	}
    }
    // 仿RM窗口皮肤 ↑
}

// 计算有效文本框的宽度
ui.prototype.calTextBoxWidth = function (canvas, content, min_width, max_width) {
    // 无限长度自动换行
    var allLines = core.splitLines(canvas, content);

    // 如果不存在手动换行，则二分自动换行
    if (allLines.length == 1) {
        var w = core.calWidth(canvas, allLines[0]);
        if (w<min_width*2.3) return core.clamp(w / 1.4, min_width, max_width);
        if (w<max_width*2.2) return core.clamp(w / 2.4, min_width, max_width);
        return core.clamp(w / 3.4, min_width, max_width);
        /*
        var prefer_lines = 3;
        var start = Math.floor(min_width), end = Math.floor(max_width);
        while (start < end) {
            var mid = Math.floor((start+end)/2);
            if (core.splitLines(canvas, content, mid).length < prefer_lines)
                end = mid;
            else
                start = mid + 1;
        }
        return mid;
        */
    }
    // 存在手动换行：以最长的为准
    else {
        var w = 0;
        allLines.forEach(function (t) {
            w = Math.max(w, core.calWidth(canvas, t));
        });
        return core.clamp(w, min_width, max_width);
    }
}

////// 绘制一个对话框 //////
ui.prototype.drawTextBox = function(content, showAll) {

    if (core.isset(core.status.event) && core.status.event.id=='action') {
        core.status.event.ui = content;
    }

    clearInterval(core.status.event.interval);
    core.status.event.interval = null;

    // 获得name, image, icon
    var info = this.getTitleAndIcon(content);
    content = info.content;
    var id=info.id, name=info.name, image=info.image, icon=info.icon, iconHeight=info.iconHeight, animate=info.animate;

    // 获得颜色的盒子等信息
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute;
    var titlefont = textAttribute.titlefont || 22;
    var textfont = textAttribute.textfont || 16;
    var offset = textAttribute.offset || 0;
    var background = core.status.textAttribute.background;
    var isWindowSkin = false;
    if (typeof background == 'string') {
        background = core.material.images.images[background];
        if (core.isset(background) && background.width==192 && background.height==128) isWindowSkin = true;
        else background = core.initStatus.textAttribute.background;
    }

    var titleColor = core.arrayToRGBA(textAttribute.title);
    var textColor = core.arrayToRGBA(textAttribute.text);
    var borderColor = core.status.globalAttribute.borderColor;
    var alpha = isWindowSkin?0.85:background[3];

    // 获得位置信息
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
                else {
                    px = null; py=null;
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

    core.status.boxAnimateObjs = [];
    core.clearLastEvent();

    // drawImage
    content = content.replace(/(\f|\\f)\[(.*?)]/g, function (text, sympol, str) {
        var ss = str.split(",");
        if (ss.length!=3 && ss.length!=5) return "";
        var img = core.material.images.images[ss[0]];
        if (!core.isset(img)) return "";
        // 绘制
        if (ss.length==3)
            core.drawImage('ui', img, parseFloat(ss[1]), parseFloat(ss[2]));
        else
            core.drawImage('ui', img, 0, 0, img.width, img.height, parseFloat(ss[1]), parseFloat(ss[2]), parseFloat(ss[3]), parseFloat(ss[4]));
        return "";
    });

    var globalFont = core.status.globalAttribute.font;
    var font = textfont + 'px '+globalFont;
    if (textAttribute.bold) font = "bold "+font;
    var realContent = content.replace(/(\r|\\r)(\[.*?])?/g, "");

    var leftSpace = 25, rightSpace = 12;
    if (core.isset(px) && core.isset(py)) leftSpace = 20;
    if (id=='hero' || core.isset(icon)) leftSpace =  62; // 行走图：15+32+15
    else if (core.isset(image)) leftSpace = 90; // 大头像：10+70+10
    var left = 7, right = 416 - left, width = right - left, validWidth = width - leftSpace - rightSpace;

    // 对话框效果：改为动态计算
    if (core.isset(px) && core.isset(py)) {
        var min_width = 220 - leftSpace, max_width = validWidth;
        // 无行走图或头像，则可以适当缩小min_width
        if (leftSpace == 20) min_width = 160;
        core.setFont('ui', font);
        validWidth = this.calTextBoxWidth('ui', realContent, min_width, max_width);
        width = validWidth + leftSpace + rightSpace;
        // left必须在7~416-7-width区间内，以保证left>=7，right<=416-7
        left = core.clamp(32*px+16-width/2-core.bigmap.offsetX, 7, 416-7-width);
        right = left + width;
    }

    var content_left = left + leftSpace;
    var height = 30 + (textfont+5)*core.splitLines("ui", realContent, validWidth, font).length;
    if (core.isset(name)) height += titlefont + 5;
    if (id == 'hero')
        height = Math.max(height, core.material.icons.hero.height+50);
    else if (core.isset(icon))
        height = Math.max(height, iconHeight+50);
    else if (core.isset(image))
        height = Math.max(height, 90);

    var xoffset = 11, yoffset = 16;

    var top;
    if (position=='center') {
        top = parseInt((416 - height) / 2);
    }
    else if (position=='up') {
        if (px==null || py==null)
            top = 5 + offset;
        else {
            top = 32 * py - height - ydelta - yoffset;
            top -= core.bigmap.offsetY;
        }
    }
    else if (position=='down') {
        if (px==null || py==null)
            top = 416 - height - 5 - offset;
        else {
            top = 32 * py + 32 + yoffset;
            top -= core.bigmap.offsetY;
        }
    }
    var bottom = top + height;

    if (isWindowSkin) {
        core.setAlpha('ui', alpha);
        this.drawWindowSkin(background,'ui',left,top,width,height,position,px==null?null:px*32-core.bigmap.offsetX,py==null?null:py*32-core.bigmap.offsetY);
        core.setAlpha('ui', 1);
    }
    else {
        yoffset -= 4;
        core.setAlpha('ui', alpha);
        core.setStrokeStyle('ui', borderColor);
        core.setFillStyle('ui', core.arrayToRGB(background));
        core.setLineWidth('ui', 2);
        // 绘制
        var canvas = core.canvas.ui;
        canvas.beginPath();
        canvas.moveTo(left,top);
        // 上边缘
        if (position=='down' && core.isset(px) && core.isset(py)) {
            canvas.lineTo(32*px+xoffset - core.bigmap.offsetX, top);
            canvas.lineTo(32*px+16 - core.bigmap.offsetX, top-yoffset);
            canvas.lineTo(32*(px+1)-xoffset - core.bigmap.offsetX, top);
        }
        canvas.lineTo(right, top);
        canvas.lineTo(right, bottom);
        // 下边缘
        if (position=='up' && core.isset(px) && core.isset(py)) {
            canvas.lineTo(32*(px+1)-xoffset - core.bigmap.offsetX, bottom);
            canvas.lineTo(32*px+16 - core.bigmap.offsetX, bottom+yoffset);
            canvas.lineTo(32*px+xoffset - core.bigmap.offsetX, bottom);
        }
        canvas.lineTo(left, bottom);
        canvas.closePath();
        canvas.fill();
        canvas.stroke();
        core.setAlpha('ui', 1);
    }
    // 名称
    core.setTextAlign('ui', 'left');

    var content_top = top + 15 + textfont;
    if (core.isset(id)) {

        content_top += (titlefont + 5);
        core.setFillStyle('ui', titleColor);
        core.setStrokeStyle('ui', titleColor);

        if (id == 'hero') {
            var heroHeight=core.material.icons.hero.height;
            core.setAlpha('ui', alpha);
            core.strokeRect('ui', left + 15 - 1, top + 40 - 1, 34, heroHeight+2, null, 2);
            core.setAlpha('ui', 1);
            core.fillText('ui', name, content_left, top + 8 + titlefont, null, 'bold '+titlefont+'px '+globalFont);
            core.clearMap('ui', left + 15, top + 40, 32, heroHeight);
            core.fillRect('ui', left + 15, top + 40, 32, heroHeight, core.material.groundPattern);
            var heroIcon = core.material.icons.hero['down'];
            core.drawImage('ui', core.material.images.hero, heroIcon.stop * 32, heroIcon.loc * heroHeight, 32, heroHeight, left+15, top+40, 32, heroHeight);
        }
        else {
            core.fillText('ui', name, content_left, top + 8 + titlefont,  null, 'bold '+titlefont+'px '+globalFont);
            if (core.isset(icon)) {
                core.setAlpha('ui', alpha);
                core.strokeRect('ui', left + 15 - 1, top + 40-1, 34, iconHeight + 2, null, 2);
                core.setAlpha('ui', 1);
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
    if (core.isset(image) && !core.isset(icon)) {
        core.drawImage('ui', image, 0, 0, image.width, image.height, left+10, top+10, 70, 70);
    }

    var offsetx = content_left, offsety = content_top;
    core.setFont('ui', font);
    core.setFillStyle('ui', textColor);
    var index = 0, currcolor = textColor, changed = false;

    var drawNext = function () {
        if (index >= content.length) return false;
        if (changed) {
            core.setFillStyle('ui', currcolor);
            changed = false;
        }

        // get next character
        var ch = content.charAt(index++);
        // \n, \\n
        if (ch == '\n' || (ch=='\\' && content.charAt(index)=='n')) {
            offsetx = content_left;
            offsety += textfont+5;
            if (ch=='\\') index++;
            return drawNext();
        }
        // \r, \\r
        if (ch == '\r' || (ch=='\\' && content.charAt(index)=='r')) {
            if (ch == '\\') index++;
            changed = true;
            // 检查是不是 []
            var index2;
            if (content.charAt(index) == '[' && ((index2=content.indexOf(']', index))>=0)) {
                // 变色
                var str = content.substring(index+1, index2);
                if (str=="") currcolor = textColor;
                else currcolor = str;
                index = index2+1;
            }
            else currcolor = textColor;
            return drawNext();
        }
        // 检查是不是自动换行
        var charwidth = core.calWidth('ui', ch);
        if (offsetx + charwidth > content_left + validWidth) {
            index--;
            offsetx = content_left;
            offsety += textfont+5;
            return drawNext();
        }
        // 输出
        core.fillText('ui', ch, offsetx, offsety);
        offsetx += charwidth;
        return true;
    };

    if (showAll || textAttribute.time<=0 || core.status.event.id!='action') {
        while (drawNext());
    }
    else {
        core.status.event.interval = setInterval(function () {
            changed = true;
            if (!drawNext()) {
                clearInterval(core.status.event.interval);
                core.status.event.interval = null;
            }
        }, textAttribute.time);
    }

}

////// 绘制滚动字幕 //////
ui.prototype.drawScrollText = function (content, time, callback) {

    content = content || "";
    time = time || 5000;

    clearInterval(core.status.event.interval);
    core.status.event.interval = null;

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

    // 开始绘制到UI上
    core.clearMap('ui');
    var per_pixel = 1, per_time = time * per_pixel / (416+height);
    var currH = 416;
    core.drawImage('ui', tempCanvas.canvas, 0, currH);
    var animate = setInterval(function () {
        core.clearMap('ui');
        currH -= per_pixel;
        if (currH < -height) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (core.isset(callback)) callback();
            return;
        }
        core.drawImage('ui', tempCanvas.canvas, 0, currH);
    }, per_time);

    core.animateFrame.asyncId[animate] = true;
}

////// 绘制一个选项界面 //////
ui.prototype.drawChoices = function(content, choices) {

    choices = choices || [];

    var background = core.status.textAttribute.background;
    var isWindowSkin = false;
    if (typeof background == 'string') {
        background = core.material.images.images[background];
        if (core.isset(background) && background.width==192 && background.height==128) isWindowSkin = true;
        else background = core.initStatus.textAttribute.background;
    }
    if (!isWindowSkin) background = core.arrayToRGBA(background);
    var borderColor = core.status.globalAttribute.borderColor;
    var textColor = core.arrayToRGBA(core.status.textAttribute.text);
    var titleColor = core.arrayToRGBA(core.status.textAttribute.title);

    core.status.event.ui = {"text": content, "choices": choices};

    // Step 1: 计算长宽高
    var length = choices.length;

    // 宽度计算：考虑选项的长度
    var width = 416 - 2*85;
    var globalFont = core.status.globalAttribute.font;
    core.setFont('ui', "bold 17px "+globalFont);
    for (var i = 0; i < choices.length; i++) {
        width = Math.max(width, core.calWidth('ui', core.replaceText(choices[i].text || choices[i]))+30);
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
        // 获得name, image, icon
        var info = this.getTitleAndIcon(content);
        content = core.replaceText(info.content);
        id=info.id; name=info.name; image=info.image;
        icon=info.icon; iconHeight=info.iconHeight; animate=info.animate;
        if (id=='hero' || core.isset(icon))
            content_left = left+60;
        contents = core.splitLines('ui', content, width-(content_left-left)-10, 'bold 15px '+globalFont);

        // content部分高度
        var cheight=0;
        // 如果含有标题，标题高度
        if (name!=null) cheight+=25;
        cheight += contents.length*20;
        height+=cheight;
    }
    var top = bottom-height;

    core.clearMap('ui');
    if (isWindowSkin) {
        core.setAlpha('ui', 0.85);
        this.drawWindowSkin(background,'ui',left,top,width,height);
    }
    else {
        core.fillRect('ui', left, top, width, height, background);
        core.strokeRect('ui', left - 1, top - 1, width + 1, height + 1, borderColor, 2);
    }
    core.setAlpha('ui', 1);

    // 如果有内容
    if (core.isset(contents)) {

        var content_top = top + 35;

        if (core.isset(id)) {
            core.setTextAlign('ui', 'center');

            content_top = top+55;
            var title_offset = left+width/2;
            // 动画

            if (id=='hero' || core.isset(icon))
                title_offset += 12;

            if (id == 'hero') {
                var heroHeight = core.material.icons.hero.height;
                core.strokeRect('ui', left + 15 - 1, top + 30 - 1, 34, heroHeight+2, '#DDDDDD', 2);
                core.fillText('ui', name, title_offset, top + 27, titleColor, 'bold 19px '+globalFont);
                core.clearMap('ui', left + 15, top + 30, 32, heroHeight);
                core.fillRect('ui', left + 15, top + 30, 32, heroHeight, core.material.groundPattern);
                var heroIcon = core.material.icons.hero['down'];
                core.drawImage('ui', core.material.images.hero, heroIcon.stop * 32, heroIcon.loc *heroHeight, 32, heroHeight, left+15, top+30, 32, heroHeight);
            }
            else {
                core.fillText('ui', name, title_offset, top + 27, titleColor, 'bold 19px '+globalFont);
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

        core.setTextAlign('ui', 'left');
        for (var i=0;i<contents.length;i++) {
            core.fillText('ui', contents[i], content_left, content_top, textColor, 'bold 15px '+globalFont);
            content_top+=20;
        }
    }

    // 选项
    core.setTextAlign('ui', 'center');
    for (var i = 0; i < choices.length; i++) {
        core.setFillStyle('ui', choices[i].color || textColor);
        core.fillText('ui', core.replaceText(choices[i].text || choices[i]), 208, choice_top + 32 * i, null, "bold 17px "+globalFont);
    }

    if (choices.length>0) {
        if (!core.isset(core.status.event.selection)) core.status.event.selection=0;
        while (core.status.event.selection<0) core.status.event.selection+=choices.length;
        while (core.status.event.selection>=choices.length) core.status.event.selection-=choices.length;
        var len = core.calWidth('ui', core.replaceText(choices[core.status.event.selection].text || choices[core.status.event.selection]));
        if (isWindowSkin)
            this.drawWindowSelector(background, 208-len/2-5, choice_top + 32 * core.status.event.selection - 20, len+10, 28);
        else
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

    core.clearLastEvent();

    var background = core.status.textAttribute.background;
    var isWindowSkin = false;
    if (typeof background == 'string') {
        background = core.material.images.images[background];
        if (core.isset(background) && background.width==192 && background.height==128) isWindowSkin = true;
        else background = core.initStatus.textAttribute.background;
    }
    if (!isWindowSkin) background = core.arrayToRGBA(background);
    var borderColor = core.status.globalAttribute.borderColor;
    var textColor = core.arrayToRGBA(core.status.textAttribute.text);

    var globalFont = core.status.globalAttribute.font;
    core.setFont('ui', "bold 19px "+globalFont);

    var contents = text.split('\n');
    var lines = contents.length;
    var max_length = 0;
    for (var i in contents) {
        max_length = Math.max(max_length, core.calWidth('ui', contents[i]));
    }

    var left = Math.min(208 - 40 - parseInt(max_length / 2), 100);
    var top = 140 - (lines-1)*30;
    var right = 416 - left, bottom = 416 - 140, width = right - left, height = bottom - top;

    core.clearMap('ui');
    if (isWindowSkin) {
        core.setAlpha('ui', 0.85);
        this.drawWindowSkin(background,'ui',left,top,width,height);
    }
    else {
        core.fillRect('ui', left, top, width, height, background);
        core.strokeRect('ui', left - 1, top - 1, width + 1, height + 1, borderColor, 2);
    }
    core.setAlpha('ui', 1);

    core.setTextAlign('ui', 'center');
    for (var i in contents) {
        core.fillText('ui', contents[i], 208, top + 50 + i*30, textColor);
    }

    core.fillText('ui', "确定", 208 - 38, bottom - 35, null, "bold 17px "+globalFont);
    core.fillText('ui', "取消", 208 + 38, bottom - 35);

    var len=core.calWidth('ui', "确定");

    var strokeLeft = 208 + (76*core.status.event.selection-38) - parseInt(len/2) - 5;

    if (isWindowSkin)
        this.drawWindowSelector(background, strokeLeft, bottom-35-20, len+10, 28);
    else
        core.strokeRect('ui', strokeLeft, bottom-35-20, len+10, 28, "#FFD700", 2);

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
        "拓展键盘： "+(core.platform.extendKeyboard ? "[ON]":"[OFF]"),
        "返回主菜单"
    ];
    this.drawChoices(null, choices);
}

////// 绘制系统菜单栏 //////
ui.prototype.drawSettings = function () {
    core.status.event.id = 'settings';

    this.drawChoices(null, [
        "系统设置", "虚拟键盘", "浏览地图", "绘图模式", "同步存档", "游戏信息", "返回标题", "返回游戏"
    ]);
}

////// 绘制快捷商店选择栏 //////
ui.prototype.drawQuickShop = function () {

    core.status.event.id = 'selectShop';

    var shopList = core.status.shops, keys = Object.keys(shopList).filter(function (shopId) {return shopList[shopId].visited || !shopList[shopId].mustEnable});
    var choices = keys.map(function (shopId) {
        return {"text": shopList[shopId].textInList, "color": shopList[shopId].visited?null:"#999999"};
    });

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

    hero_atk = Math.floor(core.getFlag('equip_atk_buff',1)*hero_atk);
    hero_def = Math.floor(core.getFlag('equip_def_buff',1)*hero_def);
    hero_mdef = Math.floor(core.getFlag('equip_mdef_buff',1)*hero_mdef);

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

    core.clearMap('ui');
    var left=10, right=416-2*left;

    var lines = 3;
    if (core.flags.enableMDef || core.flags.enableMoney || core.flags.enableExperience) lines=4;
    if (core.flags.enableMoney && core.flags.enableExperience) lines=5;

    var lineHeight = 60;
    var height = lineHeight * lines + 50;

    var top = (416-height)/2, bottom = height;

    core.fillRect('ui', left, top, right, bottom, 'rgba(0,0,0,0.85)');
    core.setAlpha('ui', 1);
    core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);
    core.clearMap('data');

    clearInterval(core.interval.tipAnimate);
    core.setAlpha('data', 1);
    core.status.boxAnimateObjs = [];
    var globalFont = core.status.globalAttribute.font;

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
    core.setTextAlign('ui', 'center');
    core.fillText('ui', core.status.hero.name, left+margin+boxWidth/2, top+margin+heroHeight+40, '#FFD700', 'bold 22px '+globalFont);
    core.fillText('ui', "怪物", left+right-margin-boxWidth/2, top+margin+monsterHeight+40);
    for (var i=0, j=0; i<specialTexts.length;i++) {
        if (specialTexts[i]!='') {
            core.fillText('ui', specialTexts[i], left+right-margin-boxWidth/2, top+margin+monsterHeight+44+20*(++j), '#FF6A6A', '15px '+globalFont);
        }
    }

    // 图标
    core.clearMap('ui', left + margin, top + margin, boxWidth, heroHeight+boxWidth-32);
    core.fillRect('ui', left + margin, top + margin, boxWidth, heroHeight+boxWidth-32, core.material.groundPattern);
    var heroIcon = core.material.icons.hero['down'];
    core.drawImage('ui', core.material.images.hero, heroIcon.stop * 32, heroIcon.loc *heroHeight, 32, heroHeight, left+margin+(boxWidth-32)/2, top+margin+(boxWidth-32)/2, 32, heroHeight);
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
    core.setTextAlign('ui', 'left');
    var textTop = top+margin+10;
    core.fillText('ui', "生命值", left_start, textTop, '#DDDDDD', '16px '+globalFont);
    core.drawLine('ui', left_start, textTop+8, left_end, textTop+8, '#FFFFFF', 2);
    core.setTextAlign('data', 'right');
    core.fillText('data', hero_hp, left_end, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);

    textTop+=lineHeight;
    core.setTextAlign('ui', 'left');
    core.fillText('ui', "攻击", left_start, textTop, '#DDDDDD', '16px '+globalFont);
    core.drawLine('ui', left_start, textTop+8, left_end, textTop+8, '#FFFFFF', 2);
    core.setTextAlign('ui', 'right');
    core.fillText('ui', hero_atk, left_end, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);

    textTop+=lineHeight;
    core.setTextAlign('ui', 'left');
    core.fillText('ui', "防御", left_start, textTop, '#DDDDDD', '16px '+globalFont);
    core.drawLine('ui', left_start, textTop+8, left_end, textTop+8, '#FFFFFF', 2);
    core.setTextAlign('ui', 'right');
    core.fillText('ui', hero_def, left_end, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);

    if (core.flags.enableMDef) {
        textTop += lineHeight;
        core.setTextAlign('ui', 'left');
        core.fillText('ui', "护盾", left_start, textTop, '#DDDDDD', '16px '+globalFont);
        core.drawLine('ui', left_start, textTop + 8, left_end, textTop + 8, '#FFFFFF', 2);
        core.setTextAlign('data', 'right');
        core.fillText('data', hero_mdef, left_end, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);
    }

    // 怪物的线
    core.setTextAlign('ui', 'right');
    var textTop = top+margin+10;
    core.fillText('ui', "生命值", right_end, textTop, '#DDDDDD', '16px '+globalFont);
    core.drawLine('ui', right_start, textTop+8, right_end, textTop+8, '#FFFFFF', 2);
    core.setTextAlign('data', 'left');
    core.fillText('data', mon_hp, right_start, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);

    textTop+=lineHeight;
    core.setTextAlign('ui', 'right');
    core.fillText('ui', "攻击", right_end, textTop, '#DDDDDD', '16px '+globalFont);
    core.drawLine('ui', right_start, textTop+8, right_end, textTop+8, '#FFFFFF', 2);
    core.setTextAlign('ui', 'left');
    core.fillText('ui', mon_atk, right_start, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);

    textTop+=lineHeight;
    core.setTextAlign('ui', 'right');
    core.fillText('ui', "防御", right_end, textTop, '#DDDDDD', '16px '+globalFont);
    core.drawLine('ui', right_start, textTop+8, right_end, textTop+8, '#FFFFFF', 2);
    core.setTextAlign('ui', 'left');
    core.fillText('ui', mon_def, right_start, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);

    if (core.flags.enableMoney) {
        textTop += lineHeight;
        core.setTextAlign('ui', 'right');
        core.fillText('ui', "金币", right_end, textTop, '#DDDDDD', '16px '+globalFont);
        core.drawLine('ui', right_start, textTop + 8, right_end, textTop + 8, '#FFFFFF', 2);
        core.setTextAlign('ui', 'left');
        core.fillText('ui', mon_money, right_start, textTop + 26, '#DDDDDD', 'bold 16px '+globalFont);
    }

    if (core.flags.enableExperience) {
        textTop += lineHeight;
        core.setTextAlign('ui', 'right');
        core.fillText('ui', "经验", right_end, textTop, '#DDDDDD', '16px '+globalFont);
        core.drawLine('ui', right_start, textTop + 8, right_end, textTop + 8, '#FFFFFF', 2);
        core.setTextAlign('ui', 'left');
        core.fillText('ui', mon_exp, right_start, textTop+26, '#DDDDDD', 'bold 16px '+globalFont);
    }

    core.setTextAlign('ui', 'left');
    core.fillText("ui", "V", left_end+8, 208-15, "#FFFFFF", "italic bold 40px "+globalFont);

    core.setTextAlign('ui', 'right');
    core.fillText("ui", "S", right_start-8, 208+15, "#FFFFFF", "italic bold 40px "+globalFont);

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
            core.setTextAlign('data', 'left');
            core.fillText('data', mon_hp, right_start, top+margin+10+26, '#DDDDDD', 'bold 16px '+globalFont);

            // 反击
            if (core.enemys.hasSpecial(mon_special, 8)) {
                hero_mdef -= Math.floor(core.values.counterAttack * hero_atk);

                if (hero_mdef<0) {
                    hero_hp+=hero_mdef;
                    hero_mdef=0;
                }
                // 更新勇士数据
                core.clearMap('data', left_start, top+margin+10, lineWidth, 40);
                core.setTextAlign('data', 'right');
                core.fillText('data', hero_hp, left_end, top+margin+10+26, '#DDDDDD', 'bold 16px '+globalFont);

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
            core.setTextAlign('data', 'right');
            core.fillText('data', hero_hp, left_end, top+margin+10+26, '#DDDDDD', 'bold 16px '+globalFont);

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

    core.clearLastEvent();

    var background = core.status.textAttribute.background;
    var isWindowSkin = false;
    if (typeof background == 'string') {
        background = core.material.images.images[background];
        if (core.isset(background) && background.width==192 && background.height==128) isWindowSkin = true;
        else background = core.initStatus.textAttribute.background;
    }
    if (!isWindowSkin) background = core.arrayToRGBA(background);
    var borderColor = core.status.globalAttribute.borderColor;
    var textColor = core.arrayToRGBA(core.status.textAttribute.text);

    var globalFont = core.status.globalAttribute.font;
    var text_length = core.calWidth('ui', text, "bold 19px "+globalFont);

    var right = Math.max(text_length+50, 220);
    var left = 208-parseInt(right/2), top = 208 - 32 - 16, bottom = 416 - 2 * top;

    core.clearMap('ui');
    if (isWindowSkin) {
        core.setAlpha('ui', 0.85);
        this.drawWindowSkin(background,'ui',left,top,right,bottom);
    }
    else {
        core.fillRect('ui', left, top, right, bottom, background);
        core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, borderColor, 2);
    }
    core.setAlpha('ui', 1);

    core.setTextAlign('ui', 'center');
    core.fillText('ui', text, 208, top + 56, textColor);

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

ui.prototype.drawGameInfo = function () {
    core.status.event.id = 'gameInfo';
    this.drawChoices(null, [
        "数据统计", "查看工程", "游戏主页", "操作帮助", "关于本塔","下载离线版本", "返回主菜单"
    ]);
}

////// 绘制分页 //////
ui.prototype.drawPagination = function (page, totalPage, top) {
    // if (totalPage<page) totalPage=page;
    if (totalPage<=1) return;
    if (!core.isset(top)) top=12;

    var globalFont = (core.status.globalAttribute||core.initStatus.globalAttribute).font;
    core.setFillStyle('ui', '#DDDDDD');

    var length = core.calWidth('ui', page + " / " + page, 'bold 15px '+globalFont);

    core.setTextAlign('ui', 'left');
    core.fillText('ui', page + " / " + totalPage, parseInt((416 - length) / 2), top*32+19);

    core.setTextAlign('ui', 'center');
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
    var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
    var enemys = core.enemys.getCurrentEnemys(floorId);
    
    core.clearLastEvent();

    // 生成groundPattern
    core.maps.generateGroundPattern(floorId);

    core.setFillStyle('ui', core.material.groundPattern);
    core.fillRect('ui', 0, 0, 416, 416);

    core.setAlpha('ui', 0.6);
    core.setFillStyle('ui', '#000000');
    core.fillRect('ui', 0, 0, 416, 416);

    core.setAlpha('ui', 1);
    core.setTextAlign('ui', 'left');
    var globalFont = core.status.globalAttribute.font;
    core.setFont('ui', 'bold 15px '+globalFont);

    if (enemys.length == 0) {
        core.fillText('ui', "本层无怪物", 83, 222, '#999999', "bold 50px "+globalFont);
        // 退出
        core.setTextAlign('ui', 'center');
        core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px '+globalFont);
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
        core.setTextAlign('ui', 'center');

        if (enemy.specialText=='') {
            core.fillText('ui', enemy.name, 115, 62 * i + 47, '#DDDDDD', 'bold 17px '+globalFont);
        }
        else {
            core.fillText('ui', enemy.name, 115, 62 * i + 40, '#DDDDDD', 'bold 17px '+globalFont);
            core.fillText('ui', enemy.specialText, 115, 62 * i + 62, '#FF6A6A', 'bold 15px '+globalFont);
        }
        core.setTextAlign('ui', 'left');
        core.fillText('ui', '生命', 165, 62 * i + 32, '#DDDDDD', '13px '+globalFont);
        core.fillText('ui', core.formatBigNumber(enemy.hp||0), 195, 62 * i + 32, '#DDDDDD', 'bold 13px '+globalFont);
        core.fillText('ui', '攻击', 255, 62 * i + 32, '#DDDDDD', '13px '+globalFont);
        core.fillText('ui', core.formatBigNumber(enemy.atk||0), 285, 62 * i + 32, '#DDDDDD', 'bold 13px '+globalFont);
        core.fillText('ui', '防御', 335, 62 * i + 32, '#DDDDDD', '13px '+globalFont);
        core.fillText('ui', core.formatBigNumber(enemy.def||0), 365, 62 * i + 32, '#DDDDDD', 'bold 13px '+globalFont);

        var expOffset = 165, line_cnt=0;
        if (core.flags.enableMoney) {
            core.fillText('ui', '金币', 165, 62 * i + 50, '#DDDDDD', '13px '+globalFont);
            core.fillText('ui', core.formatBigNumber(enemy.money||0), 195, 62 * i + 50, '#DDDDDD', 'bold 13px '+globalFont);
            expOffset = 255;
            line_cnt++;
        }

        // 加点
        if (core.flags.enableAddPoint) {
            core.setTextAlign('ui', 'left');
            core.fillText('ui', '加点', expOffset, 62 * i + 50, '#DDDDDD', '13px '+globalFont);
            core.fillText('ui', core.formatBigNumber(enemy.point||0), expOffset + 30, 62 * i + 50, '#DDDDDD', 'bold 13px '+globalFont);
            expOffset = 255;
            line_cnt++;
        }

        if (core.flags.enableExperience && line_cnt<2) {
            core.setTextAlign('ui', 'left');
            core.fillText('ui', '经验', expOffset, 62 * i + 50, '#DDDDDD', '13px '+globalFont);
            core.fillText('ui', core.formatBigNumber(enemy.experience||0), expOffset + 30, 62 * i + 50, '#DDDDDD', 'bold 13px '+globalFont);
            line_cnt++;
        }

        var damageOffset = 281;
        if (line_cnt==1) damageOffset=326;
        if (line_cnt==2) damageOffset=361;

        core.setTextAlign('ui', 'center');

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
        core.fillText('ui', damage, damageOffset, 62 * i + 50, color, 'bold 13px '+globalFont);

        core.setTextAlign('ui', 'left');

        core.fillText('ui', '临界', 165, 62 * i + 68, '#DDDDDD', '13px '+globalFont);
        core.fillText('ui', core.formatBigNumber(enemy.critical||0), 195, 62 * i + 68, '#DDDDDD', 'bold 13px '+globalFont);
        core.fillText('ui', '减伤', 255, 62 * i + 68, '#DDDDDD', '13px '+globalFont);
        core.fillText('ui', core.formatBigNumber(enemy.criticalDamage||0), 285, 62 * i + 68, '#DDDDDD', 'bold 13px '+globalFont);
        core.fillText('ui', '1防', 335, 62 * i + 68, '#DDDDDD', '13px '+globalFont);
        core.fillText('ui', core.formatBigNumber(enemy.defDamage||0), 365, 62 * i + 68, '#DDDDDD', 'bold 13px '+globalFont);

        if (index == start+i) {
            core.strokeRect('ui', 10, 62 * i + 13, 416-10*2,  62, '#FFD700');
        }

    }
    core.drawBoxAnimate();
    this.drawPagination(page, totalPage, 12);
    core.setTextAlign('ui', 'center');
    // 退出
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px '+globalFont);
}

////// 绘制怪物属性的详细信息 //////
ui.prototype.drawBookDetail = function (index) {
    var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
    var enemys = core.enemys.getCurrentEnemys(floorId);

    if (enemys.length==0) return;
    if (index<0) index=0;
    if (index>=enemys.length) index=enemys.length-1;

    var enemy = enemys[index], enemyId = enemy.id;
    var hints=core.enemys.getSpecialHint(enemyId);

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
            hints.push(JSON.stringify(u.map(function (v) {return core.formatBigNumber(v[0])+":"+core.formatBigNumber(v[1]);})));
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
        return core.formatBigNumber(v[0])+":"+core.formatBigNumber(v[1]);
    });
    while (criticals[0]=='0:0') criticals.shift();
    hints.push("临界表："+JSON.stringify(criticals))

    var content=hints.join("\n");

    core.status.event.id = 'book-detail';
    clearInterval(core.interval.tipAnimate);

    core.clearMap('data');

    var left=10, right=416-2*left;
    var content_left = left + 25;

    var validWidth = right-(content_left-left)-13;
    var globalFont = core.status.globalAttribute.font;
    var contents = core.splitLines("data", content, validWidth, '16px '+globalFont);

    var height = 416 - 10 - Math.min(416-24*(contents.length+1)-65, 250);
    var top = (416-height)/2, bottom = height;

    // var left = 97, top = 64, right = 416 - 2 * left, bottom = 416 - 2 * top;
    core.setAlpha('data', 0.9);
    core.fillRect('data', left, top, right, bottom, '#000000');
    core.setAlpha('data', 1);
    core.strokeRect('data', left - 1, top - 1, right + 1, bottom + 1, core.status.globalAttribute.borderColor, 2);

    // 名称
    core.setTextAlign('data', 'left');

    core.fillText('data', enemy.name, content_left, top + 30, '#FFD700', 'bold 22px '+globalFont);
    var content_top = top + 57;

    for (var i=0;i<contents.length;i++) {
        var text=contents[i];
        var index=text.indexOf("：");
        if (index>=0) {
            var x1 = text.substring(0, index+1);
            core.fillText('data', x1, content_left, content_top, '#FF6A6A', 'bold 16px '+globalFont);
            var len=core.calWidth('data', x1);
            core.fillText('data', text.substring(index+1), content_left+len, content_top, '#FFFFFF', '16px '+globalFont);
        }
        else {
            core.fillText('data', contents[i], content_left, content_top, '#FFFFFF', '16px '+globalFont);
        }
        content_top+=24;
    }

    core.fillText('data', '<点击任意位置继续>', 270, top+height-13, '#CCCCCC', '13px '+globalFont);
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
    core.setTextAlign('ui', 'center');
    var globalFont = core.status.globalAttribute.font
    core.fillText('ui', '楼层跳跃', 208, 60, '#FFFFFF', "bold 28px "+globalFont);
    core.fillText('ui', '返回游戏', 208, 403, '#FFFFFF', "bold 15px "+globalFont)
    core.fillText('ui', title, 356, 247, '#FFFFFF', "bold 19px "+globalFont);
    if (page<core.status.hero.flyRange.length-1) {
        core.fillText('ui', '▲', 356, 247 - 64, '#FFFFFF', "17px "+globalFont);
        core.fillText('ui', '▲', 356, 247 - 96, '#FFFFFF', "17px "+globalFont);
        core.fillText('ui', '▲', 356, 247 - 96 - 7, '#FFFFFF', "17px "+globalFont);
    }
    if (page>0) {
        core.fillText('ui', '▼', 356, 247 + 64, '#FFFFFF', "17px "+globalFont);
        core.fillText('ui', '▼', 356, 247 + 96, '#FFFFFF', "17px "+globalFont);
        core.fillText('ui', '▼', 356, 247 + 96 + 7, '#FFFFFF', "17px "+globalFont);
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
        core.clearLastEvent();

        core.fillRect('ui', 0, 0, 416, 416, 'rgba(0,0,0,0.4)');

        core.strokeRect('ui', 66, 2, 284, 60, "#FFD700", 4);
        core.strokeRect('ui', 2, 66, 60, 284);
        core.strokeRect('ui', 66, 416-62, 284, 60);
        core.strokeRect('ui', 416-62, 66, 60, 284);
        core.strokeRect('ui', 66, 66, 284, 92);
        core.strokeRect('ui', 66, 32*8+2, 284, 92);
        core.setTextAlign('ui', 'center');
        core.fillText('ui', "上移地图 [W]", 208, 38, '#FFD700', '20px Arial');
        core.fillText('ui', "下移地图 [S]", 208, 390);

        core.strokeRect('ui', 2, 2, 28, 28);
        core.fillText('ui', 'V', 16, 24);
        core.strokeRect('ui', 2, 416-30, 28, 28);
        core.fillText('ui', 'M', 16, 408);
        core.strokeRect('ui', 416-30, 2, 28, 28);
        core.fillText('ui', 'Z', 400, 24);

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

    var damage = (core.status.event.data||{}).damage, paint =  (core.status.event.data||{}).paint;
    var all = (core.status.event.data||{}).all;
    if (core.isset(index.damage)) damage=index.damage;
    if (core.isset(index.paint)) paint=index.paint;
    if (core.isset(index.all)) all=index.all;

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

    core.status.event.data = {"index": index, "x": x, "y": y, "damage": damage, "paint": paint, "all": all};

    clearTimeout(core.interval.tipAnimate);
    core.clearLastEvent();
    this.drawThumbnail(floorId, 'ui', core.status.maps[floorId].blocks, 0, 0, 416, x, y);

    // 绘图
    if (core.status.event.data.paint) {
        var offsetX = core.clamp(x-6, 0, mw-13), offsetY = core.clamp(y-6, 0, mh-13);
        var value = core.paint[floorId];
        if (core.isset(value)) value = LZString.decompress(value).split(",");
        core.utils.decodeCanvas(value, 32*mw, 32*mh);
        core.drawImage('ui', core.bigmap.tempCanvas.canvas, offsetX*32, offsetY*32, 416, 416, 0, 0, 416, 416);
    }

    core.clearMap('data');
    core.setTextAlign('data', 'left');
    core.setFont('data', '16px Arial');

    var text = core.status.maps[floorId].title;
    if (!all && (mw>13 || mh>13)) text+=" ["+(x-6)+","+(y-6)+"]";
    var textX = 16, textY = 18, width = textX + core.calWidth('data', text) + 16, height = 42;
    core.fillRect('data', 5, 5, width, height, 'rgba(0,0,0,0.4)');
    core.fillText('data', text, textX + 5, textY + 15, 'rgba(255,255,255,0.6)');
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
    core.setTextAlign('ui', 'right');
    var globalFont = core.status.globalAttribute.font;
    core.fillText('ui', "消耗道具", 411, 124-ydelta, '#333333', "bold 16px "+globalFont);
    core.fillText('ui', "永久道具", 411, 284-ydelta);

    core.setTextAlign('ui', 'left');
    // 描述
    if (core.isset(selectId)) {
        var item=core.material.items[selectId];
        core.fillText('ui', item.name, 10, 32, '#FFD700', "bold 20px "+globalFont)

        var text = item.text||"该道具暂无描述。";
        try {
            // 检查能否eval
            text = eval(text);
        } catch (e) {}

        var lines = core.splitLines('ui', text, 406, '17px '+globalFont);

        core.fillText('ui', lines[0], 10, 62, '#FFFFFF', '17px '+globalFont);

        if (lines.length==1) {
            core.fillText('ui', '<继续点击该道具即可进行使用>', 10, 89, '#CCCCCC', '14px '+globalFont);
        }
        else {
            var leftText = text.substring(lines[0].length);
            core.fillText('ui', leftText, 10, 89, '#FFFFFF', '17px '+globalFont);
        }
    }

    core.setTextAlign('ui', 'right');
    var images = core.material.images.items;

    // 消耗道具
    for (var i=0;i<12;i++) {
        var tool=tools[12*(toolsPage-1)+i];
        if (!core.isset(tool)) break;
        var yoffset = 144 + Math.floor(i/6)*54 + 5 - ydelta;
        var icon=core.material.icons.items[tool];
        core.drawImage('ui', images, 0, icon*32, 32, 32, 16*(4*(i%6)+1)+5, yoffset, 32, 32)
        // 个数
        core.fillText('ui', core.itemCount(tool), 16*(4*(i%6)+1)+40, yoffset+33, '#FFFFFF', "bold 14px "+globalFont);
        if (selectId == tool)
            core.strokeRect('ui', 16*(4*(i%6)+1)+1, yoffset-4, 40, 40, '#FFD700');
    }

    // 永久道具
    for (var i=0;i<12;i++) {
        var constant=constants[12*(constantsPage-1)+i];
        if (!core.isset(constant)) break;
        var yoffset = 304+Math.floor(i/6)*54+5-ydelta;
        var icon=core.material.icons.items[constant];
        core.drawImage('ui', images, 0, icon*32, 32, 32, 16*(4*(i%6)+1)+5, yoffset, 32, 32)
        if (selectId == constant)
            core.strokeRect('ui', 16*(4*(i%6)+1)+1, yoffset-4, 40, 40, '#FFD700');
    }

    // 分页
    this.drawPagination(toolsPage, toolsTotalPage, 7);
    this.drawPagination(constantsPage, constantsTotalPage, 12);

    core.setTextAlign('ui', 'center');

    // 装备栏
    // if (core.flags.equipment)
    core.fillText('ui', '[装备栏]', 370, 25,'#DDDDDD', 'bold 15px '+globalFont);
    // core.fillText('ui', '删除道具', 370, 32,'#DDDDDD', 'bold 15px '+globalFont);
    // 退出
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px '+globalFont);
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
    core.setTextAlign('ui', 'right');
    var globalFont = core.status.globalAttribute.font;
    core.fillText('ui', "当前装备", 411, 124-ydelta, '#333333', "bold 16px "+globalFont);
    core.fillText('ui', "拥有装备", 411, 284-ydelta);
    
    core.setTextAlign('ui', 'left');

    // 描述
    if (core.isset(selectId)) {
        var equip=core.material.items[selectId];
        if (!core.isset(equip.equip)) equip.equip = {"type": 0};
        var equipType = equip.equip.type;
        core.fillText('ui', equip.name + "（" + (allEquips[equipType]||"未知部位") + "）", 10, 32, '#FFD700', "bold 20px "+globalFont)

        var text = equip.text||"该装备暂无描述。";
        var lines = core.splitLines('ui', text, 406, '17px '+globalFont);

        core.fillText('ui', lines[0], 10, 62, '#FFFFFF', '17px '+globalFont);
        
        // 比较属性
        if (lines.length==1) {
            var compare, differentMode = false;
            if (index<12) compare = core.compareEquipment(null, selectId);
            else {
                var last = core.material.items[equipEquipment[equipType]]||{};
                // 检查是不是数值模式和比例模式之间的切换
                if (core.isset(last.equip) && (last.equip.percentage||false) != (equip.equip.percentage||false)) {
                    differentMode = true;
                }
                else {
                    compare = core.compareEquipment(selectId, equipEquipment[equipType]);
                }
            }
            if (differentMode) {
                core.fillText('ui', '<数值和比例模式之间的切换不显示属性变化>', 10, 89, '#CCCCCC', '14px '+globalFont);
            }
            else {
                var drawOffset = 10;
                [['攻击','atk'], ['防御','def'], ['魔防','mdef']].forEach(function (t) {
                    var title = t[0], name = t[1];
                    if (!core.isset(compare[name]) || compare[name]==0) return;
                    var color = '#00FF00';
                    if (compare[name]<0) color = '#FF0000';
                    var nowValue = core.getStatus(name), newValue = nowValue + compare[name];
                    if (equip.equip.percentage) {
                        var nowBuff = core.getFlag('equip_'+name+"_buff",1), newBuff = nowBuff+compare[name]/100;
                        nowValue = Math.floor(nowBuff*core.getStatus(name));
                        newValue = Math.floor(newBuff*core.getStatus(name));
                    }
                    var content = title + ' ' + nowValue + '->';
                    core.fillText('ui', content, drawOffset, 89, '#CCCCCC', 'bold 14px '+globalFont);
                    drawOffset += core.calWidth('ui', content);
                    core.fillText('ui', newValue, drawOffset, 89, color);
                    drawOffset += core.calWidth('ui', newValue) + 15;
                })
            }
        }
        else {
            var leftText = text.substring(lines[0].length);
            core.fillText('ui', leftText, 10, 89, '#FFFFFF', '17px '+globalFont);
        }
    }

    core.setTextAlign('ui', 'right');
    var images = core.material.images.items;

    // 当前装备
    for (var i = 0 ; i < equipLength ; i++) {
        var equipId = equipEquipment[i] || null;
        if (core.isset(equipId)) {
            var icon = core.material.icons.items[equipId];
            core.drawImage('ui', images, 0, icon*32, 32, 32, 16*(8*(i%3)+5)+5, 144+Math.floor(i/3)*54+5-ydelta, 32, 32);
        }
        core.fillText('ui', allEquips[i]||"未知", 16*(8*(i%3)+1)+40, 144+Math.floor(i/3)*54+32-ydelta, '#FFFFFF', "bold 16px "+globalFont);
        core.strokeRect('ui', 16*(8*(i%3)+5)+1, 144+Math.floor(i/3)*54+1-ydelta, 40, 40, index==i?'#FFD700':"#FFFFFF");
    }

    // 现有装备 
    for (var i=0;i<12;i++) {
        var ownEquip=ownEquipment[12*(page-1)+i];
        if (!core.isset(ownEquip)) continue;
        var icon=core.material.icons.items[ownEquip];
        core.drawImage('ui', images, 0, icon*32, 32, 32, 16*(4*(i%6)+1)+5, 304+Math.floor(i/6)*54+5-ydelta, 32, 32)
        // 个数
        if (core.itemCount(ownEquip)>1)
            core.fillText('ui', core.itemCount(ownEquip), 16*(4*(i%6)+1)+40, 304+Math.floor(i/6)*54+38-ydelta, '#FFFFFF', "bold 14px "+globalFont);
        if (index>=12 && selectId == ownEquip)
            core.strokeRect('ui', 16*(4*(i%6)+1)+1, 304+Math.floor(i/6)*54+1-ydelta, 40, 40, '#FFD700');
    }

    this.drawPagination(page, totalPage, 12);
    // 道具栏
    core.setTextAlign('ui', 'center');
    core.fillText('ui', '[道具栏]', 370, 25,'#DDDDDD', 'bold 15px '+globalFont);
    // 退出按钮
    core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px '+globalFont);
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
    var globalFont = (core.status.globalAttribute||core.initStatus.globalAttribute).font;

    var drawBg = function() {
        core.clearMap('ui');
        core.setAlpha('ui', 0.85);
        core.fillRect('ui', 0, 0, 416, 416, '#000000');
        core.setAlpha('ui', 1);

        core.ui.drawPagination(page+1, max_page, 12);
        core.setTextAlign('ui', 'center');
        // 退出
        core.fillText('ui', '返回游戏', 370, 403,'#DDDDDD', 'bold 15px '+globalFont);

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
            core.fillText('ui', i==0?"自动存档":name+id, (2*i+1)*u, 30, '#FFFFFF', "bold 17px "+globalFont);
            core.strokeRect('ui', (2*i+1)*u-size/2, 45, size, size, i==offset?strokeColor:'#FFFFFF', i==offset?6:2);
            if (core.isset(data) && core.isset(data.floorId)) {
                core.ui.drawThumbnail(data.floorId, 'ui', core.maps.load(data.maps, data.floorId).blocks, (2*i+1)*u-size/2, 45, size, data.hero.loc.x, data.hero.loc.y, data.hero.loc, data.hero.flags.heroIcon||"hero.png");
                var v = core.formatBigNumber(data.hero.hp,true)+"/"+core.formatBigNumber(data.hero.atk,true)+"/"+core.formatBigNumber(data.hero.def,true);
                var v2 = "/"+core.formatBigNumber(data.hero.mdef,true);
                if (v.length+v2.length<=21) v+=v2;
                core.fillText('ui', v, (2*i+1)*u, 60+size, '#FFD700', '10px '+globalFont);
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i+1)*u, 73+size, data.hero.flags.consoleOpened?'#FF6A6A':'#FFFFFF');
            }
            else {
                core.fillRect('ui', (2*i+1)*u-size/2, 45, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i+1)*u, 112, '#FFFFFF', 'bold 30px '+globalFont);
            }
        }
        else {
            core.fillText('ui', name+id, (2*i-5)*u, 218, '#FFFFFF', "bold 17px "+globalFont);
            core.strokeRect('ui', (2*i-5)*u-size/2, 233, size, size, i==offset?strokeColor:'#FFFFFF', i==offset?6:2);
            if (core.isset(data) && core.isset(data.floorId)) {
                core.ui.drawThumbnail(data.floorId, 'ui', core.maps.load(data.maps, data.floorId).blocks, (2*i-5)*u-size/2, 233, size, data.hero.loc.x, data.hero.loc.y, data.hero.loc, data.hero.flags.heroIcon||"hero.png");
                var v = core.formatBigNumber(data.hero.hp,true)+"/"+core.formatBigNumber(data.hero.atk,true)+"/"+core.formatBigNumber(data.hero.def,true);
                var v2 = "/"+core.formatBigNumber(data.hero.mdef,true);
                if (v.length+v2.length<=21) v+=v2;
                core.fillText('ui', v, (2*i-5)*u, 248+size, '#FFD700', '10px '+globalFont);
                core.fillText('ui', core.formatDate(new Date(data.time)), (2*i-5)*u, 261+size, data.hero.flags.consoleOpened?'#FF6A6A':'#FFFFFF', '10px '+globalFont);
            }
            else {
                core.fillRect('ui', (2*i-5)*u-size/2, 233, size, size, '#333333', 2);
                core.fillText('ui', '空', (2*i-5)*u, 297, '#FFFFFF', 'bold 30px '+globalFont);
            }
        }
    };

    function loadSave(i, callback) {
        if (i==6) {
            callback();
            return;
        }

        if (i==0) {
            if (core.saves.autosave.data!=null) {
                core.status.event.ui[i] = core.saves.autosave.data;
                loadSave(1, callback);
            }
            else {
                core.getLocalForage("autoSave", null, function(data) {
                    core.saves.autosave.data = data;
                    core.status.event.ui[i]=data;
                    loadSave(i+1, callback);
                }, function(err) {console.log(err);});
            }
        }
        else {
            core.getLocalForage("save"+(5*page+i), null, function(data) {
                core.status.event.ui[i]=data;
                loadSave(i+1, callback);
            }, function(err) {console.log(err);});
        }
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

    var groundId = (core.status.maps||core.floors)[floorId].defaultGround || "ground";
    var blockIcon = core.material.icons.terrains[groundId];
    for (var i = 0; i < mw; i++) {
        for (var j = 0; j < mh; j++) {
            tempCanvas.drawImage(core.material.images.terrains, 0, blockIcon * 32, 32, 32, i * 32, j * 32, 32, 32);
        }
    }

    // background image
    var images = [];
    if (core.isset((core.status.maps||core.floors)[floorId].images)) {
        images = (core.status.maps||core.floors)[floorId].images;
        if (typeof images == 'string') {
            images = [[0, 0, images]];
        }
    }
    images.forEach(function (t) {
        if (typeof t == 'string') t = [0,0,t];
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

    // background map
    core.maps.drawBgFgMap(floorId, tempCanvas, "bg");

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

    // foreground map
    core.maps.drawBgFgMap(floorId, tempCanvas, "fg");

    // draw damage
    if (core.status.event.id=='viewMaps' && (core.status.event.data||{}).damage)
        core.control.updateDamage(floorId, tempCanvas);

    var ctx = core.getContextByName(canvas);
    if (ctx == null) return;    

    // draw to canvas
    core.clearMap(canvas, x, y, size, size);
    if (!core.isset(centerX)) centerX=parseInt(mw/2);
    if (!core.isset(centerY)) centerY=parseInt(mh/2);

    // 如果是浏览地图的全模式
    if (core.status.event.id=='viewMaps' && (core.status.event.data||{}).all) {
        if (tempWidth<=tempHeight) {
            var realHeight = 416, realWidth = realHeight * tempWidth / tempHeight;
            var side = (416 - realWidth) / 2;
            core.fillRect(canvas, 0, 0, side, realHeight, '#000000');
            core.fillRect(canvas, 416-side, 0, side, realHeight);
            ctx.drawImage(tempCanvas.canvas, 0, 0, tempWidth, tempHeight, side, 0, realWidth, realHeight);
        }
        else {
            var realWidth = 416, realHeight = realWidth * tempHeight / tempWidth;
            var side = (416 - realHeight) / 2;
            core.fillRect(canvas, 0, 0, realWidth, side, '#000000');
            core.fillRect(canvas, 0, 416-side, realWidth, side);
            ctx.drawImage(tempCanvas.canvas, 0, 0, tempWidth, tempHeight, 0, side, realWidth, realHeight);
        }
    }
    else {
        var offsetX = core.clamp(centerX-6, 0, mw-13), offsetY = core.clamp(centerY-6, 0, mh-13);
        // offsetX~offsetX+12; offsetY~offsetY+12
        ctx.drawImage(tempCanvas.canvas, offsetX*32, offsetY*32, 416, 416, x, y, size, size);
    }
}

ui.prototype.drawKeyBoard = function () {
    core.lockControl();
    core.status.event.id = 'keyBoard';

    core.clearLastEvent();

    var left = 16, top = 48, width = 416 - 2 * left, height = 416 - 2 * top;

    var background = core.status.textAttribute.background;
    var isWindowSkin = false;
    if (typeof background == 'string') {
        background = core.material.images.images[background];
        if (core.isset(background) && background.width==192 && background.height==128) isWindowSkin = true;
        else background = core.initStatus.textAttribute.background;
    }
    if (!isWindowSkin) background = core.arrayToRGBA(background);
    var borderColor = core.status.globalAttribute.borderColor;
    var titleColor = core.arrayToRGBA(core.status.textAttribute.title);
    var textColor = core.arrayToRGBA(core.status.textAttribute.text);

    core.clearMap('ui');
    if (isWindowSkin) {
        core.setAlpha('ui', 0.85);
        this.drawWindowSkin(background,'ui',left,top,width,height);
    }
    else {
        core.fillRect('ui', left, top, width, height, background);
        core.strokeRect('ui', left - 1, top - 1, width + 1, height + 1, borderColor, 2);
    }
    core.setAlpha('ui', 1);

    core.setTextAlign('ui', 'center');
    var globalFont = core.status.globalAttribute.font;
    core.fillText('ui', "虚拟键盘", 208, top+35, titleColor, "bold 22px "+globalFont);

    core.setFont('ui', '17px '+globalFont);
    core.setFillStyle('ui', textColor);
    var offset = 128-9;

    var lines = [
        ["F1","F2","F3","F4","F5","F6","F7","F8","F9","10","11"],
        ["1","2","3","4","5","6","7","8","9","0"],
        ["Q","W","E","R","T","Y","U","I","O","P"],
        ["A","S","D","F","G","H","J","K","L"],
        ["Z","X","C","V","B","N","M"],
        ["-","=","[","]","\\",";","'",",",".","/","`"],
        ["ES","TA","CA","SH","CT","AL","SP","BS","EN","DE"]
    ];

    lines.forEach(function (line) {
        for (var i=0;i<line.length;i++) {
            core.fillText('ui', line[i], 48+32*i, offset);
        }
        offset+=32;
    });

    core.fillText("ui", "返回游戏", 416-80, offset-3, '#FFFFFF', 'bold 15px '+globalFont);

    if (isWindowSkin)
        this.drawWindowSelector(background, 300, offset - 22, 72, 27);
    else
        core.strokeRect('ui', 300, offset - 22, 72, 27, "#FFD700", 2);
}

////// 绘制状态栏 /////
ui.prototype.drawStatusBar = function () {
    this.uidata.drawStatusBar();
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
        var floor=core.status.maps[floorId]||core.floors[floorId];
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

                if (core.isset(total.count[id])) {
                    var hp=0, atk=0, def=0, mdef=0;

                    if (cls[id]=='items' && id!='superPotion') {
                        var temp = core.clone(core.status.hero);
                        core.setFlag("__statistics__", true);
                        var ratio = floor.item_ratio||1;
                        if (core.isset(core.items.itemEffect[id])) {
                            try {
                                // 需要检查是否是测试状态...
                                eval(core.items.itemEffect[id]);
                            }
                            catch (e) {}
                        }
                        hp = core.status.hero.hp - temp.hp;
                        atk = core.status.hero.atk - temp.atk;
                        def = core.status.hero.def - temp.def;
                        mdef = core.status.hero.mdef - temp.mdef;
                        core.status.hero = temp;
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
        +"总计打死了"+statistics.battle+"个怪物，得到了"+core.formatBigNumber(statistics.money)+"金币，"+core.formatBigNumber(statistics.experience)+"点经验。\n\n"
        +"受到的总伤害为"+core.formatBigNumber(statistics.battleDamage+statistics.poisonDamage+statistics.extraDamage)
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

            core.clearLastEvent();
            core.createCanvas('paint', -core.bigmap.offsetX, -core.bigmap.offsetY, 32*core.bigmap.width, 32*core.bigmap.height, 95);

            // 将已有的内容绘制到route上
            var value = core.paint[core.status.floorId];
            if (core.isset(value)) value = LZString.decompress(value).split(",");
            core.utils.decodeCanvas(value, 32*core.bigmap.width, 32*core.bigmap.height);
            core.drawImage('paint', core.bigmap.tempCanvas.canvas, 0, 0);

            core.setLineWidth('paint', 3);
            core.setStrokeStyle('paint', '#FF0000');

            core.statusBar.image.keyboard.style.opacity = 0;

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
    core.clearLastEvent();
    if (core.material.images.keyboard) {
        core.status.event.id = 'help';
        core.lockControl();
        core.setAlpha('ui', 1);
        core.drawImage('ui', core.material.images.keyboard, 0, 0);
    }
    else {
        core.drawText([
            "\t[键盘快捷键列表]"+
            "[CTRL] 跳过对话   [Z] 转向\n" +
            "[X] 怪物手册   [G] 楼层传送\n" +
            "[A] 读取自动存档   [S/D] 存读档页面\n" +
            "[V] 快捷商店   [ESC] 系统菜单\n" +
            "[T] 道具页面   [Q] 装备页面\n" +
            "[B] 数据统计   [H] 帮助页面\n" +
            "[R] 回放录像   [E] 显示光标\n" +
            "[SPACE] 轻按   [M] 绘图模式\n" +
            "[N] 返回标题页面   [P] 游戏主页\n" +
            "[O] 查看工程   [F7] 打开debug穿墙模式\n" +
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
}

////// 动态canvas //////

////// canvas创建 //////
ui.prototype.createCanvas = function (name, x, y, width, height, z) {
    // 如果画布已存在则直接调用
    if (core.isset(core.dymCanvas[name])) {
        this.relocateCanvas(name, x, y);
        this.resizeCanvas(name, width, height);
        core.dymCanvas[name].canvas.style.zIndex = z;
        return core.dymCanvas[name];
    }
    var newCanvas = document.createElement("canvas");
    newCanvas.id = name;
    newCanvas.style.display = 'block';
    newCanvas.width = width;
    newCanvas.height = height;
    newCanvas.setAttribute("_left", x);
    newCanvas.setAttribute("_top", y);
    newCanvas.style.width = width * core.domStyle.scale + 'px';
    newCanvas.style.height = height * core.domStyle.scale + 'px';
    newCanvas.style.left = x * core.domStyle.scale + 'px';
    newCanvas.style.top = y * core.domStyle.scale + 'px';
    newCanvas.style.zIndex = z;
    newCanvas.style.position = 'absolute';
    core.dymCanvas[name] = newCanvas.getContext('2d');
    core.dom.gameDraw.appendChild(newCanvas);
    return core.dymCanvas[name];
}

////// canvas重定位 //////
ui.prototype.relocateCanvas = function (name, x, y) {
    var ctx = core.dymCanvas[name];
    if (!core.isset(ctx)) return null;
    if (core.isset(x)) {
        ctx.canvas.style.left = x * core.domStyle.scale + 'px';
        ctx.canvas.setAttribute("_left", x);
    }
    if (core.isset(y)) {
        ctx.canvas.style.top = y * core.domStyle.scale + 'px';
        ctx.canvas.setAttribute("_top", y);
    }
    return ctx;
}

////// canvas重置 //////
ui.prototype.resizeCanvas = function (name, width, height) {
    var ctx = core.dymCanvas[name];
    if (!core.isset(ctx)) return null;
    if (core.isset(width)) {
        ctx.canvas.width = width;
        ctx.canvas.style.width = width * core.domStyle.scale + 'px';
    }
    if (core.isset(height)) {
        ctx.canvas.height = height;
        ctx.canvas.style.height = height * core.domStyle.scale + 'px';
    }
    return ctx;
}
////// canvas删除 //////
ui.prototype.deleteCanvas = function (name) {
    if (!core.isset(core.dymCanvas[name])) return null;
    core.dom.gameDraw.removeChild(core.dymCanvas[name].canvas);
    delete core.dymCanvas[name];
}

////// 删除所有动态canvas //////
ui.prototype.deleteAllCanvas = function () {
    Object.keys(core.dymCanvas).forEach(function (name) {
        core.dom.gameDraw.removeChild(core.dymCanvas[name].canvas);
        delete core.dymCanvas[name];
    });
}
