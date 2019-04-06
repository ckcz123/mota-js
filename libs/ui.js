/**
 * ui.js：负责所有和UI界面相关的绘制
 * 包括：
 * 自动寻路、怪物手册、楼传器、存读档、菜单栏、NPC对话事件、等等
 */

"use strict";

function ui() {
    this._init();
    // for convenience
    this.SIZE = core.__SIZE__;
    this.HSIZE = core.__HALF_SIZE__;
    this.LAST = this.SIZE - 1;
    this.PIXEL = core.__PIXELS__;
    this.HPIXEL = this.PIXEL / 2;
}

// 初始化UI
ui.prototype._init = function () {
    this.uidata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.ui;
}

////////////////// 地图设置

ui.prototype.getContextByName = function (name) {
    var canvas = name;
    if (typeof name == 'string') {
        if (core.canvas[name])
            canvas = core.canvas[name];
        else if (core.dymCanvas[name])
            canvas = core.dymCanvas[name];
    }
    if (canvas && canvas.canvas) {
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
        core.removeGlobalAnimate();
    }
    else {
        var ctx = this.getContextByName(name);
        if (ctx) ctx.clearRect(x||0, y||0, width||ctx.canvas.width, height||ctx.canvas.height);
    }
}

////// 在某个canvas上绘制一段文字 //////
ui.prototype.fillText = function (name, text, x, y, style, font) {
    if (style) core.setFillStyle(name, style);
    if (font) core.setFont(name, font);
    var ctx = this.getContextByName(name);
    if (ctx) ctx.fillText(text, x, y);
}

////// 在某个canvas上绘制粗体 //////
ui.prototype.fillBoldText = function (name, text, x, y, style, font) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (font) ctx.font = font;
    if (!style) style = ctx.fillStyle;
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
    if (style) core.setFillStyle(name, style);
    var ctx = this.getContextByName(name);
    if (ctx) ctx.fillRect(x, y, width, height);
}

////// 在某个canvas上绘制一个矩形的边框 //////
ui.prototype.strokeRect = function (name, x, y, width, height, style, lineWidth) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth) core.setLineWidth(name, lineWidth);
    var ctx = this.getContextByName(name);
    if (ctx) ctx.strokeRect(x, y, width, height);
}

////// 在某个canvas上绘制一条线 //////
ui.prototype.drawLine = function (name, x1, y1, x2, y2, style, lineWidth) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth != null) core.setLineWidth(name, lineWidth);
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
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth != null) core.setLineWidth(name, lineWidth);
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

////// 设置某个canvas的baseline //////
ui.prototype.setTextBaseline = function (name, baseline) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.textBaseline = baseline;
}

////// 计算某段文字的宽度 //////
ui.prototype.calWidth = function (name, text, font) {
    var ctx = this.getContextByName(name);
    if (ctx) {
        if (font) ctx.font = font;
        return ctx.measureText(text).width;
    }
    return 0;
}

////// 字符串自动换行的分割 //////
ui.prototype.splitLines = function (name, text, maxWidth, font) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (font) core.setFont(name, font);

    var contents = [];
    var last = 0;
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) == '\n') {
            contents.push(text.substring(last, i));
            last = i + 1;
        }
        else if (text.charAt(i) == '\\' && text.charAt(i + 1) == 'n') {
            contents.push(text.substring(last, i));
            last = i + 2;
        }
        else {
            var toAdd = text.substring(last, i + 1);
            var width = core.calWidth(name, toAdd);
            if (maxWidth && width > maxWidth) {
                contents.push(text.substring(last, i));
                last = i;
            }
        }
    }
    contents.push(text.substring(last));
    return contents;
}

////// 绘制一张图片 //////
ui.prototype.drawImage = function (name, image, x, y, w, h, x1, y1, w1, h1) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (typeof image == 'string') {
        image = core.material.images.images[image];
        if (!image) return;
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
    this.clearUI();
    core.maps.generateGroundPattern();
    core.updateStatusBar();
    core.unLockControl();
    core.status.event.data = null;
    core.status.event.id = null;
    core.status.event.selection = null;
    core.status.event.ui = null;
    core.status.event.interval = null;
}

ui.prototype.clearUI = function () {
    clearInterval(core.status.event.interval);
    core.status.event.interval = null;
    core.status.boxAnimateObjs = [];
    if (core.dymCanvas._selector) core.deleteCanvas("_selector");
    core.clearMap('ui');
    core.setAlpha('ui', 1);
}

////// 左上角绘制一段提示 //////
ui.prototype.drawTip = function (text, id) {
    var textX, textY, width, height;
    clearInterval(core.interval.tipAnimate);
    core.setFont('data', "16px Arial");
    core.setTextAlign('data', 'left');
    if (id != null) {
        var info = core.getBlockInfo(id);
        if (info == null || !info.image || info.height != 32) id = null;
        else id = info;
    }
    if (!id) {
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
    this._drawTip_animate(text, id, textX, textY, width, height);
}

ui.prototype._drawTip_animate = function (text, info, textX, textY, width, height) {
    var alpha = 0, hide = false;
    core.interval.tipAnimate = window.setInterval(function () {
        if (hide) alpha -= 0.1;
        else alpha += 0.1;
        core.clearMap('data', 5, 5, core.ui.PIXEL, height);
        core.setAlpha('data', alpha);
        core.fillRect('data', 5, 5, width, height, '#000');
        if (info)
            core.drawImage('data', info.image, info.posX * 32, info.posY * 32, 32, 32, 10, 8, 32, 32);
        core.fillText('data', text, textX + 5, textY + 15, '#fff');
        core.setAlpha('data', 1);
        if (alpha > 0.6 || alpha < 0) {
            if (hide) {
                core.clearMap('data', 5, 5, core.ui.PIXEL, height);
                clearInterval(core.interval.tipAnimate);
                return;
            }
            else {
                if (!core.timeout.tipTimeout) {
                    core.timeout.tipTimeout = window.setTimeout(function () {
                        hide = true;
                        core.timeout.tipTimeout = null;
                    }, 750);
                }
                alpha = 0.6;
            }
        }
    }, 30);
}

////// 地图中间绘制一段文字 //////
ui.prototype.drawText = function (contents, callback) {
    if (contents != null) return this._drawText_setContent(contents, callback);

    if (core.status.event.data.list.length==0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel(false);
        if (callback) callback();
        return;
    }

    var data=core.status.event.data.list.shift();
    if (typeof data == 'string')
        core.ui.drawTextBox(data);
    else
        core.ui.drawTextBox(data.content, data.id);
}

ui.prototype._drawText_setContent = function (contents, callback) {
    // 合并进 insertAction
    if ((core.status.event && core.status.event.id=='action') || core.isReplaying()) {
        core.insertAction(contents,null,null,callback);
        return;
    }
    if (!(contents instanceof Array)) contents = [contents];

    core.status.event = {'id': 'text', 'data': {'list': contents, 'callback': callback}};
    core.lockControl();

    core.waitHeroToStop(core.drawText);
    return;
}

////// 正则处理 \t[xx,yy] 问题
ui.prototype._getTitleAndIcon = function (content) {
    var title = null, image = null, icon = null, height = 32, animate = 1;
    content = content.replace(/(\t|\\t)\[(([^\],]+),)?([^\],]+)\]/g, function (s0, s1, s2, s3, s4) {
        if (s4) {
            if (s4 == 'hero') {
                title = core.status.hero.name;
                image = core.material.images.hero;
                icon = 0;
                height = core.material.icons.hero.height;
            }
            else if (/^[-\w.]+\.png$/.test(s4))
                image = core.material.images.images[s4];
            else {
                var blockInfo = core.getBlockInfo(s4);
                if (blockInfo != null) {
                    if (core.material.enemys[s4]) title = core.material.enemys[s4].name;
                    image = blockInfo.image;
                    icon = blockInfo.posY;
                    height = blockInfo.height;
                    animate = blockInfo.animate;
                }
                else title = s4;
            }
        }
        if (s3) title = s3;
        return "";
    });
    return {
        content: content,
        title: title,
        image: image,
        icon: icon,
        height: height,
        animate: animate
    };
}

////// 正则处理 \b[up,xxx] 问题
ui.prototype._getPosition = function (content) {
    var pos = null, px = null, py = null;
    if (core.status.event.id=='action') {
        px = core.status.event.data.x;
        py = core.status.event.data.y;
    }
    content = content.replace("\b", "\\b")
        .replace(/\\b\[(up|center|down)(,(hero|null|\d+,\d+))?]/g, function (s0, s1, s2, s3) {
            pos = s1;
            if (s3 == 'hero') {
                px = core.status.hero.loc.x;
                py = core.status.hero.loc.y;
            }
            else if (s3 == 'null') {
                px = py = null;
            }
            else if (s3) {
                var str = s3.split(',');
                px = parseInt(str[0]);
                py = parseInt(str[1]);
            }
            return "";
        });
    return {content: content, position: pos, px: px, py: py};
}

////// 绘制选择光标
ui.prototype.drawWindowSelector = function(background, x, y, w, h) {
    if (typeof background == 'string')
        background = core.material.images.images[background];
    w = Math.round(w), h = Math.round(h);
    var dstImage = core.ui.createCanvas("_selector", x, y, w, h, 165);
    core.setOpacity("_selector", 0.8);
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

////// 绘制 WindowSkin
ui.prototype.drawWindowSkin = function(background, ctx, x, y, w, h, direction, px, py) {
	// 仿RM窗口皮肤 ↓
    var dstImage = core.getContextByName(ctx);
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
    if(px != null && py != null){
    	if(direction == 'up'){
    		dstImage.drawImage(background,128,96,32,32,px,y+h-3,32,32);
    	}else if(direction == 'down') {
    		dstImage.drawImage(background,160,96,32,32,px,y-29,32,32);
    	}
    }
    // 仿RM窗口皮肤 ↑
}

////// 绘制一个背景图，可绘制 winskin 或纯色背景；支持小箭头绘制
ui.prototype.drawBackground = function (left, top, right, bottom, posInfo) {
    posInfo = posInfo || {};
    var px = posInfo.px == null ? null : posInfo.px * 32 - core.bigmap.offsetX;
    var py = posInfo.py == null ? null : posInfo.py * 32 - core.bigmap.offsetY;
    var xoffset = posInfo.xoffset || 0, yoffset = posInfo.yoffset || 0;
    var background = core.status.textAttribute.background;

    if (typeof background == 'string' && core.material.images.images[background]) {
        var image = core.material.images.images[background];
        if (image.width==192 && image.height==128) {
            core.setAlpha('ui', 0.85);
            this.drawWindowSkin(image, 'ui', left, top, right - left, bottom - top, posInfo.position, px, py);
            core.setAlpha('ui', 1);
            return true;
        }
        background = core.initStatus.textAttribute.background;
    }

    var alpha = background[3];
    core.setAlpha('ui', alpha);
    core.setStrokeStyle('ui', core.status.globalAttribute.borderColor);
    core.setFillStyle('ui', core.arrayToRGB(background));
    core.setLineWidth('ui', 2);

    // 绘制
    var ctx = core.canvas.ui;
    ctx.beginPath();
    ctx.moveTo(left, top);
    // 上边缘三角
    if (posInfo.position == 'down' && px != null && py != null) {
        ctx.lineTo(px + xoffset, top);
        ctx.lineTo(px + 16, top - yoffset);
        ctx.lineTo(px + 32 - xoffset, top);
    }
    ctx.lineTo(right, top);
    ctx.lineTo(right, bottom);
    // 下边缘三角
    if (posInfo.position == 'up' && px != null && py != null) {
        ctx.lineTo(px + 32 - xoffset, bottom);
        ctx.lineTo(px + 16, bottom + yoffset);
        ctx.lineTo(px + xoffset, bottom);
    }
    ctx.lineTo(left, bottom);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    core.setAlpha('ui', 1);
    return false;
}

////// 计算有效文本框的宽度
ui.prototype._calTextBoxWidth = function (ctx, content, min_width, max_width, font) {
    // 无限长度自动换行
    var allLines = core.splitLines(ctx, content, null, font);

    // 如果不存在手动换行，尽量调成半行形式
    if (allLines.length == 1) {
        var w = core.calWidth(ctx, allLines[0]) + 10;
        if (w<min_width*2.3) return core.clamp(w / 1.4, min_width, max_width);
        if (w<max_width*2.2) return core.clamp(w / 2.4, min_width, max_width);
        return core.clamp(w / 3.4, min_width, max_width);
    }
    // 存在手动换行：以最长的为准
    else {
        return core.clamp(allLines.reduce(function (pre, curr) {
            return Math.max(pre, core.calWidth(ctx, curr) + 10);
        }, 0), min_width, max_width);
    }
}

////// 处理 \i[xxx] 的问题
ui.prototype._getDrawableIconInfo = function (id) {
    var image = null, icon = null;
    ["terrains","animates","items","npcs","enemys"].forEach(function (v) {
        if (core.material.icons[v][id] != null) {
            image = core.material.images[v];
            icon = core.material.icons[v][id];
        }
    });
    if (image == null && id in core.statusBar.icons) {
        image = core.statusBar.icons[id];
        icon = 0;
    }
    return [image,icon];
}

ui.prototype._buildFont = function (fontSize, bold) {
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute,
        globalAttribute = core.status.globalAttribute || core.initStatus.globalAttribute;
    if (bold == null) bold = textAttribute.bold;
    return (bold?"bold ":"") + (fontSize || textAttribute.textfont) + "px " + globalAttribute.font;
}

////// 绘制一段文字到某个画布上面
// ctx：要绘制到的画布
// content：要绘制的内容；转义字符目前只允许留 \n, \r[...] 和 \i[...]
// config：绘制配置项，目前暂时包含如下内容（均为可选）
//         left, top：起始点位置；maxWidth：单行最大宽度；color：默认颜色；align：左中右
//         fontSize：字体大小；lineHeight：行高；time：打字机间隔
ui.prototype.drawTextContent = function (ctx, content, config) {
    ctx = core.getContextByName(ctx);
    if (!ctx) return;
    // 设置默认配置项
    config = core.clone(config || {});
    config.left = config.left || 0;
    config.right = config.left + (config.maxWidth == null ? ctx.canvas.width : config.maxWidth);
    config.top = config.top || 0;
    config.color = config.color || core.arrayToRGBA(core.status.textAttribute.text);
    config.bold = config.bold || false;
    config.align = config.align || core.status.textAttribute.align || "left";
    config.fontSize = config.fontSize || core.status.textAttribute.textfont;
    config.lineHeight = config.lineHeight || (config.fontSize * 1.3);
    config.time = config.time || 0;

    config.index = 0;
    config.currcolor = config.color;
    config.offsetX = 0;
    config.offsetY = 0;
    config.line = 0;
    config.blocks = [];

    // 创建一个新的临时画布
    var tempCtx = core.bigmap.tempCanvas;
    tempCtx.canvas.height = ctx.canvas.height;
    tempCtx.canvas.width = ctx.canvas.width;
    var _textBaseLine = tempCtx.textBaseline;
    tempCtx.textBaseline = 'top';
    tempCtx.font = this._buildFont(config.fontSize, config.bold);
    tempCtx.fillStyle = config.color;
    this._drawTextContent_draw(ctx, tempCtx, content, config);
    tempCtx.textBaseline = _textBaseLine;
}

// 绘制的基本逻辑：
// 1. 一个个字符绘制到对应画布上（靠左对齐）；这个过程中，记下来每个字对应的方块 [x, y, w, h]
// 2. 每次换行时，计算当前行的宽度，然后如果是居中或者靠右对齐，则对当前行的每个小方块增加偏移量
// 3. 实际绘制时，从临时画布直接将一个个小方块绘制到目标画布上，一次全部绘制，或者打字机效果一个个绘制
ui.prototype._drawTextContent_draw = function (ctx, tempCtx, content, config) {
    // Step 1: 绘制到tempCtx上，并记录下图块信息
    while (this._drawTextContent_next(tempCtx, content, config));

    // Step 2: 从tempCtx绘制到画布上
    config.index = 0;
    var _drawNext = function () {
        if (config.index >= config.blocks.length) return false;
        var block = config.blocks[config.index++];
        ctx.drawImage(tempCtx.canvas, block.left, block.top, block.width, block.height,
            config.left + block.left + block.marginLeft, config.top + block.top, block.width, block.height);
        return true;
    }
    if (config.time == 0) {
        while (_drawNext());
    }
    else {
        core.status.event.interval = setInterval(function () {
            if (!_drawNext()) {
                clearInterval(core.status.event.interval);
                core.status.event.interval = null;
            }
        }, config.time);
    }
}

ui.prototype._drawTextContent_next = function (tempCtx, content, config) {
    if (config.index >= content.length) {
        this._drawTextContent_newLine(tempCtx, config);
        return false;
    }
    // get next character
    var ch = content.charAt(config.index++);
    return this._drawTextContent_drawChar(tempCtx, content, config, ch);
}

// 绘制下一个字符
ui.prototype._drawTextContent_drawChar = function (tempCtx, content, config, ch) {
    // \n, \\n
    if (ch == '\n' || (ch=='\\' && content.charAt(config.index)=='n')) {
        this._drawTextContent_newLine(tempCtx, config);
        if (ch=='\\') config.index++;
        return this._drawTextContent_next(tempCtx, content, config);
    }
    // \r, \\r
    if (ch == '\r' || (ch=='\\' && content.charAt(config.index)=='r')) {
        if (ch == '\\') config.index++;
        return this._drawTextContent_changeColor(tempCtx, content, config);
    }
    // \\i 绘制图标
    if (ch == '\\' && content.charAt(config.index)=='i') {
        return this._drawTextContent_drawIcon(tempCtx, content, config);
    }
    // 检查是不是自动换行
    var charwidth = core.calWidth(tempCtx, ch);
    if (config.maxWidth != null && config.offsetX + charwidth > config.maxWidth) {
        this._drawTextContent_newLine(tempCtx, config);
        config.index--;
        return this._drawTextContent_next(tempCtx, content, config);
    }
    // 输出
    var left = config.offsetX, top = config.offsetY + (config.lineHeight - config.fontSize) / 2;
    core.fillText(tempCtx, ch, left, top);
    config.blocks.push({left: config.offsetX, top: config.offsetY,
        width: charwidth, height: config.lineHeight, line: config.line, marginLeft: 0});
    config.offsetX += charwidth;
    return true;
}

ui.prototype._drawTextContent_newLine = function (tempCtx, config) {
    // 计算偏移量
    var width = config.offsetX, totalWidth = config.right - config.left;
    var marginLeft = 0;
    if (config.align == 'center')
        marginLeft = (totalWidth - width) / 2;
    else if (config.align == 'right')
        marginLeft = totalWidth - width;

    config.blocks.forEach(function (b) {
        if (b.line == config.line)
            b.marginLeft = marginLeft;
    });

    config.offsetX = 0;
    config.offsetY += config.lineHeight;
    config.line++;
}

ui.prototype._drawTextContent_changeColor = function (tempCtx, content, config) {
    // 检查是不是 []
    var index = config.index, index2;
    if (content.charAt(index) == '[' && ((index2=content.indexOf(']', index))>=0)) {
        // 变色
        var str = content.substring(index+1, index2);
        if (str=="") tempCtx.fillStyle = config.color;
        else tempCtx.fillStyle = str;
        config.index = index2 + 1;
    }
    else tempCtx.fillStyle = config.color;
    return this._drawTextContent_next(tempCtx, content, config);
}

ui.prototype._drawTextContent_drawIcon = function (tempCtx, content, config) {
    // 绘制一个 \i 效果
    var index = config.index, index2;
    if (content.charAt(config.index+1) == '[' && ((index2=content.indexOf(']', index+1))>=0)) {
        var str = content.substring(index+2, index2);
        // --- 获得图标
        var iconInfo = core.ui._getDrawableIconInfo(str), image = iconInfo[0], icon = iconInfo[1];
        if (image == null) return this._drawTextContent_next(tempCtx, content, config);
        // 检查自动换行
        var width = config.fontSize + 2, left = config.offsetX + 2, top = config.offsetY + (config.lineHeight - width) / 2 - 1;
        if (config.maxWidth != null && left + width > config.maxWidth) {
            this._drawTextContent_newLine(tempCtx, config);
            config.index--;
            this._drawTextContent_next(tempCtx, content, config);
        }
        // 绘制到画布上
        core.drawImage(tempCtx, image, 0, 32*icon, 32, 32, left, top, width, width);

        config.blocks.push({left: left, top: config.offsetY,
            width: config.lineHeight, height: config.lineHeight, line: config.line, marginLeft: 0});

        config.offsetX += width + 6;
        config.index = index2 + 1;
        return true;
    }
    return this._drawTextContent_next(tempCtx, content, config);
}

ui.prototype._getRealContent = function (content) {
    return content.replace(/(\r|\\r)(\[.*?])?/g, "").replace(/(\\i)(\[.*?])?/g, "占1");
}

////// 绘制一个对话框 //////
ui.prototype.drawTextBox = function(content, showAll) {
    if (core.status.event && core.status.event.id == 'action')
        core.status.event.ui = content;

    this.clearUI();

    content = core.replaceText(content);

    // Step 1: 获得标题信息和位置信息
    var textAttribute = core.status.textAttribute;
    var titleInfo = this._getTitleAndIcon(content);
    var posInfo = this._getPosition(titleInfo.content);
    if (!posInfo.position) posInfo.position = textAttribute.position;
    if (posInfo.position != 'up' && posInfo.position != 'down') posInfo.px = posInfo.py = null;
    content = this._drawTextBox_drawImages(posInfo.content);

    // Step 2: 计算对话框的矩形位置
    var hPos = this._drawTextBox_getHorizontalPosition(content, titleInfo, posInfo);
    var vPos = this._drawTextBox_getVerticalPosition(content, titleInfo, posInfo, hPos.validWidth);

    // Step 3: 绘制背景图
    var pInfo = core.clone(posInfo);
    pInfo.xoffset = hPos.xoffset; pInfo.yoffset = vPos.yoffset - 4;
    var isWindowSkin = this.drawBackground(hPos.left, vPos.top, hPos.right, vPos.bottom, pInfo);
    var alpha = isWindowSkin ? 0.85 : textAttribute.background[3];

    // Step 4: 绘制标题、头像、
    var content_top = this._drawTextBox_drawTitleAndIcon(titleInfo, hPos, vPos, alpha);

    // Step 5: 绘制正文
    this.drawTextContent('ui', content, {
        left: hPos.content_left, top: content_top, maxWidth: hPos.validWidth,
        lineHeight: vPos.lineHeight, time: (showAll || textAttribute.time<=0 || core.status.event.id!='action')?0:textAttribute.time
    });
}

ui.prototype._drawTextBox_drawImages = function (content) {
    return content.replace(/(\f|\\f)\[(.*?)]/g, function (text, sympol, str) {
        var ss = str.split(",");
        if (ss.length!=3 && ss.length!=5 && ss.length!=9) return "";
        var img = core.material.images.images[ss[0]];
        if (!img) return "";
        // 绘制
        if (ss.length==3)
            core.drawImage('ui', img, parseFloat(ss[1]), parseFloat(ss[2]));
        else if (ss.length==5)
            core.drawImage('ui', img, 0, 0, img.width, img.height, parseFloat(ss[1]), parseFloat(ss[2]), parseFloat(ss[3]), parseFloat(ss[4]));
        else if (ss.length==9)
            core.drawImage('ui', img, parseFloat(ss[1]), parseFloat(ss[2]), parseFloat(ss[3]), parseFloat(ss[4]), parseFloat(ss[5]), parseFloat(ss[6]), parseFloat(ss[7]), parseFloat(ss[8]));
        return "";
    });
}

ui.prototype._drawTextBox_getHorizontalPosition = function (content, titleInfo, posInfo) {
    var realContent = this._getRealContent(content);
    var paddingLeft = 25, paddingRight = 12;
    if (posInfo.px != null && posInfo.py != null) paddingLeft = 20;
    if (titleInfo.icon != null) paddingLeft = 62; // 15 + 32 + 15
    else if (titleInfo.image) paddingLeft = 90; // 10 + 70 + 10
    var left = 7 + 3 * (this.HSIZE - 6), right = this.PIXEL - left,
        width = right - left, validWidth = width - paddingLeft - paddingRight;
    // 对话框效果：改为动态计算
    if (posInfo.px != null && posInfo.py != null) {
        var min_width = 220 - paddingLeft, max_width = validWidth;
        // 无行走图或头像，则可以适当缩小min_width
        if (titleInfo.image == null) min_width = 160;
        validWidth = this._calTextBoxWidth('ui', realContent, min_width, max_width, this._buildFont());
        width = validWidth + paddingLeft + paddingRight;
        left = core.clamp(32 * posInfo.px + 16 - width / 2 - core.bigmap.offsetX, left, right - width);
        right = left + width;
    }
    return { left: left, right: right, width: width, validWidth: validWidth, xoffset: 11, content_left: left + paddingLeft };
}

ui.prototype._drawTextBox_getVerticalPosition = function (content, titleInfo, posInfo, validWidth) {
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute;
    var lineHeight = textAttribute.textfont + 5;
    var realContent = this._getRealContent(content);
    var height = 30 + lineHeight * core.splitLines("ui", realContent, validWidth, this._buildFont()).length;
    if (titleInfo.title) height += textAttribute.titlefont + 5;
    if (titleInfo.icon != null)
        height =  Math.max(height, titleInfo.height+50);
    else if (titleInfo.image)
        height = Math.max(height, 90);

    var yoffset = 16;
    var top = parseInt((this.PIXEL - height) / 2);
    switch (posInfo.position) {
        case 'center': top = parseInt((this.PIXEL - height) / 2); break;
        case 'up':
            if (posInfo.px==null || posInfo.py==null)
                top = 5 + textAttribute.offset;
            else
                top = 32 * posInfo.py - height - (titleInfo.height - 32) - yoffset - core.bigmap.offsetY;
            break;
        case 'down':
            if (posInfo.px==null || posInfo.py==null)
                top = this.PIXEL - height - 5 - textAttribute.offset;
            else {
                top = 32 * posInfo.py + 32 + yoffset - core.bigmap.offsetY;
            }
    }

    return { top: top, height: height, bottom: top + height, yoffset: yoffset, lineHeight: lineHeight };
}

ui.prototype._drawTextBox_drawTitleAndIcon = function (titleInfo, hPos, vPos, alpha) {
    core.setTextAlign('ui', 'left');
    var textAttribute = core.status.textAttribute;
    var content_top = vPos.top + 15;
    if (titleInfo.title != null) {
        var titlefont = textAttribute.titlefont;
        content_top += titlefont + 5;
        core.setFillStyle('ui', core.arrayToRGB(textAttribute.title));
        core.setStrokeStyle('ui', core.arrayToRGB(textAttribute.title));

        // --- title也要居中或者右对齐？
        var title_width = core.calWidth('ui', titleInfo.title, this._buildFont(titlefont, true));
        var title_left = hPos.content_left;
        if (textAttribute.align == 'center')
            title_left = hPos.left + (hPos.width - title_width) / 2;
        else if (textAttribute.align == 'right')
            title_left = hPos.right - title_width - 12;

        core.fillText('ui', titleInfo.title, title_left, vPos.top + 8 + titlefont);

        if (titleInfo.icon != null) {
            core.setAlpha('ui', alpha);
            core.strokeRect('ui', hPos.left + 15 - 1, vPos.top + 40-1, 34, titleInfo.height + 2, null, 2);
            core.setAlpha('ui', 1);
            core.status.boxAnimateObjs = [];
            core.status.boxAnimateObjs.push({
                'bgx': hPos.left + 15, 'bgy': vPos.top + 40, 'bgWidth': 32, 'bgHeight': titleInfo.height,
                'x': hPos.left + 15, 'y': vPos.top + 40, 'height': titleInfo.height, 'animate': titleInfo.animate,
                'image': titleInfo.image, 'pos': titleInfo.icon * titleInfo.height
            });
            core.drawBoxAnimate();
        }
    }
    if (titleInfo.image != null && titleInfo.icon == null) { // 头像图
        core.drawImage('ui', titleInfo.image, 0, 0, titleInfo.image.width, titleInfo.image.height,
            hPos.left+10, vPos.top+10, 70, 70);
    }
    return content_top;
}

ui.prototype._createTextCanvas = function (content, lineHeight) {
    var realContent = this._getRealContent(content);
    var lines = core.splitLines('ui', realContent, null, this._buildFont());
    var width = this.PIXEL, height = lines.length * lineHeight;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    return ctx;
}

////// 绘制滚动字幕 //////
ui.prototype.drawScrollText = function (content, time, lineHeight, callback) {
    content = core.replaceText(content || "");
    lineHeight = lineHeight || 1.4;
    time = time || 5000;
    this.clearUI();
    var offset = core.status.textAttribute.offset || 15;
    lineHeight *= core.status.textAttribute.textfont;
    var ctx = this._createTextCanvas(content, lineHeight);
    var obj = { align: core.status.textAttribute.align, lineHeight: lineHeight };
    if (obj.align == 'right') obj.left = this.PIXEL - offset;
    else if (obj.align != 'center') obj.left = offset;
    this.drawTextContent(ctx, content, obj);
    this._drawScrollText_animate(ctx, time, callback);
}

ui.prototype._drawScrollText_animate = function (ctx, time, callback) {
    // 开始绘制到UI上
    var per_pixel = 1, height = ctx.canvas.height, per_time = time * per_pixel / (this.PIXEL+height);
    var currH = this.PIXEL;
    core.drawImage('ui', ctx.canvas, 0, currH);
    var animate = setInterval(function () {
        core.clearMap('ui');
        currH -= per_pixel;
        if (currH < -height) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (core.isset(callback)) callback();
            return;
        }
        core.drawImage('ui', ctx.canvas, 0, currH);
    }, per_time);

    core.animateFrame.asyncId[animate] = true;
}

////// 文本图片化 //////
ui.prototype.textImage = function (content, lineHeight) {
    content = core.replaceText(content || "");
    lineHeight = lineHeight || 1.4;
    lineHeight *= core.status.textAttribute.textfont;
    var ctx = this._createTextCanvas(content, lineHeight);
    this.drawTextContent(ctx, content, { align: core.status.textAttribute.align, lineHeight: lineHeight });
    return ctx.canvas;
}

////// 绘制一个选项界面 //////
ui.prototype.drawChoices = function(content, choices) {
    choices = core.clone(choices || []);

    core.status.event.ui = {"text": content, "choices": choices};
    this.clearUI();

    content = core.replaceText(content || "");
    var titleInfo = this._getTitleAndIcon(content);
    var hPos = this._drawChoices_getHorizontalPosition(titleInfo, choices);
    var vPos = this._drawChoices_getVerticalPosition(titleInfo, choices, hPos);

    var isWindowSkin = this.drawBackground(hPos.left, vPos.top, hPos.right, vPos.bottom);
    this._drawChoices_drawTitle(titleInfo, hPos, vPos);
    this._drawChoices_drawChoices(choices, isWindowSkin, hPos, vPos);
}

ui.prototype._drawChoices_getHorizontalPosition = function (titleInfo, choices) {
    // 宽度计算：考虑选项的长度
    var width = 246;
    core.setFont('ui', this._buildFont(17, true));
    for (var i = 0; i < choices.length; i++) {
        if (typeof choices[i] === 'string')
            choices[i] = {"text": choices[i]};
        choices[i].text = core.replaceText(choices[i].text);
        choices[i].width = core.calWidth('ui', core.replaceText(choices[i].text));
        if (choices[i].icon != null) choices[i].width += 28;
        width = Math.max(width, choices[i].width+30);
    }
    var left = (this.PIXEL - width) / 2, right = left + width;
    var content_left = left + (titleInfo.icon == null ? 15: 60), validWidth = right - content_left - 10;

    return { left: left, right: right, width: width, content_left: content_left, validWidth: validWidth };
}

ui.prototype._drawChoices_getVerticalPosition = function (titleInfo, choices, hPos) {
    var length = choices.length;
    var height = 32 * (length + 2), bottom = this.HPIXEL + height / 2;
    if (length % 2 == 0) bottom += 16;
    var choice_top = bottom - height + 56;
    if (titleInfo.content) {
        var realContent = this._getRealContent(titleInfo.content);
        var lines = core.splitLines('ui', realContent, hPos.validWidth, this._buildFont(15, true));
        if (titleInfo.title) height += 25;
        height += lines.length * 20;
    }
    return {top: bottom - height, height: height, bottom: bottom, choice_top: choice_top };
}

ui.prototype._drawChoices_drawTitle = function (titleInfo, hPos, vPos) {
    if (!titleInfo.content) return;
    var content_top = vPos.top + 21;
    if (titleInfo.title != null) {
        core.setTextAlign('ui', 'center');

        content_top = vPos.top + 41;
        var title_offset = hPos.left+hPos.width/2;
        // 动画

        if (titleInfo.icon != null) {
            title_offset += 12;
            core.strokeRect('ui', hPos.left + 15 - 1, vPos.top + 30 - 1, 34, titleInfo.height + 2, '#DDDDDD', 2);
            core.status.boxAnimateObjs = [];
            core.status.boxAnimateObjs.push({
                'bgx': hPos.left + 15, 'bgy': vPos.top + 30, 'bgWidth': 32, 'bgHeight': titleInfo.height,
                'x': hPos.left + 15, 'y': vPos.top + 30, 'height': titleInfo.height, 'animate': titleInfo.animate,
                'image': titleInfo.image, 'pos': titleInfo.icon * titleInfo.height
            });
            core.drawBoxAnimate();
        };

        core.fillText('ui', titleInfo.title, title_offset, vPos.top + 27,
            core.arrayToRGBA(core.status.textAttribute.title), this._buildFont(19, true));
    }

    core.setTextAlign('ui', 'left');
    this.drawTextContent('ui', titleInfo.content, {
        left: hPos.content_left, top: content_top, maxWidth: hPos.validWidth,
        fontSize: 15, lineHeight: 20, bold: true
    });
}

ui.prototype._drawChoices_drawChoices = function (choices, isWindowSkin, hPos, vPos) {
    // 选项
    core.setTextAlign('ui', 'center');
    core.setFont('ui', this._buildFont(17, true));
    for (var i = 0; i < choices.length; i++) {
        var color = choices[i].color || core.status.textAttribute.text;
        if (color instanceof Array) color = core.arrayToRGBA(color);
        core.setFillStyle('ui', color);
        var offset = this.HPIXEL;
        if (core.isset(choices[i].icon)) {
            var iconInfo = this._getDrawableIconInfo(choices[i].icon), image = iconInfo[0], icon = iconInfo[1];
            if (image != null) {
                core.drawImage('ui', image, 0, 32 * icon, 32, 32,
                    this.HPIXEL - choices[i].width/2, vPos.choice_top + 32*i - 17, 22, 22);
                offset += 14;
            }
        }
        core.fillText('ui', choices[i].text, offset, vPos.choice_top + 32 * i, color);
    }

    if (choices.length>0) {
        core.status.event.selection = core.status.event.selection || 0;
        while (core.status.event.selection < 0) core.status.event.selection += choices.length;
        while (core.status.event.selection >= choices.length) core.status.event.selection -= choices.length;
        var len = choices[core.status.event.selection].width;
        if (isWindowSkin)
            this.drawWindowSelector(core.status.textAttribute.background,
                this.HPIXEL - len/2 - 5, vPos.choice_top + 32 * core.status.event.selection - 20, len + 10, 28);
        else
            core.strokeRect('ui', this.HPIXEL - len/2 - 5, vPos.choice_top + 32 * core.status.event.selection - 20,
                len+10, 28, "#FFD700", 2);
    }
}

////// 绘制一个确认/取消的警告页面 //////
ui.prototype.drawConfirmBox = function (text, yesCallback, noCallback) {
    core.lockControl();
    text = core.replaceText(text || "");

    // 处理自定义事件
    if (core.status.event.id != 'action') {
        core.status.event.id = 'confirmBox';
        core.status.event.ui = text;
        core.status.event.data = {'yes': yesCallback, 'no': noCallback};
    }

    if (core.status.event.selection != 0) core.status.event.selection = 1;
    this.clearUI();

    core.setFont('ui', this._buildFont(19, true));
    var contents = text.split("\n");
    var rect = this._drawConfirmBox_getRect(contents);
    var isWindowSkin = this.drawBackground(rect.left, rect.top, rect.right, rect.bottom);

    core.setTextAlign('ui', 'center');
    core.setFillStyle('ui', core.arrayToRGBA(core.status.textAttribute.text))
    for (var i in contents) {
        core.fillText('ui', contents[i], this.HPIXEL, rect.top + 50 + i*30);
    }

    core.fillText('ui', "确定", this.HPIXEL - 38, rect.bottom - 35, null, this._buildFont(17, true));
    core.fillText('ui', "取消", this.HPIXEL + 38, rect.bottom - 35);
    var len=core.calWidth('ui', "确定");
    var strokeLeft = this.HPIXEL + (76*core.status.event.selection-38) - parseInt(len/2) - 5;

    if (isWindowSkin)
        this.drawWindowSelector(core.status.textAttribute.background, strokeLeft, rect.bottom-35-20, len+10, 28);
    else
        core.strokeRect('ui', strokeLeft, rect.bottom-35-20, len+10, 28, "#FFD700", 2);

}

ui.prototype._drawConfirmBox_getRect = function (contents) {
    var max_width = contents.reduce(function (pre, curr) {
        return Math.max(pre, core.calWidth('ui', curr));
    }, 0);
    var left = Math.min(this.HPIXEL - 40 - parseInt(max_width / 2), 100), right = this.PIXEL - left;
    var top = this.HPIXEL - 68 - (contents.length-1)*30, bottom = this.HPIXEL + 68;
    return { top: top, left: left, bottom: bottom, right: right, width: right - left, height: bottom - top };
}

////// 绘制等待界面 //////
ui.prototype.drawWaiting = function(text) {
    core.lockControl();
    core.status.event.id = 'waiting';
    core.clearUI();
    text = core.replaceText(text || "");
    var text_length = core.calWidth('ui', text, this._buildFont(19, true));
    var width = Math.max(text_length + 80, 220), left = this.HPIXEL - parseInt(width / 2), right = left + width;
    var top = this.HPIXEL - 48, height = 96, bottom = top + height;
    this.drawBackground(left, top, right, bottom);
    core.setTextAlign('ui', 'center');
    core.fillText('ui', text, this.HPIXEL, top + 56, core.arrayToRGBA(core.status.textAttribute.text));
}

////// 绘制系统设置界面 //////
ui.prototype.drawSwitchs = function() {
    core.status.event.id = 'switchs';
    var choices = [
        "背景音乐： "+(core.musicStatus.bgmStatus ? "[ON]" : "[OFF]"),
        "背景音效： "+(core.musicStatus.soundStatus ? "[ON]" : "[OFF]"),
        "怪物显伤： "+(core.flags.displayEnemyDamage ? "[ON]" : "[OFF]"),
        "临界显伤： "+(core.flags.displayCritical ? "[ON]" : "[OFF]"),
        "领域显伤： "+(core.flags.displayExtraDamage ? "[ON]" : "[OFF]"),
        "新版存档： "+(core.platform.useLocalForage ? "[ON]":"[OFF]"),
        "单击瞬移： "+(!core.hasFlag("__noClickMove__") ? "[ON]":"[OFF]"),
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
    var shopList = core.status.shops, keys = Object.keys(shopList).filter(function (shopId) {
        return shopList[shopId].visited || !shopList[shopId].mustEnable
    });
    var choices = keys.map(function (shopId) {
        return {"text": shopList[shopId].textInList, "color": shopList[shopId].visited?null:"#999999"};
    });
    choices.push("返回游戏");
    this.drawChoices(null, choices);
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
ui.prototype.drawPagination = function (page, totalPage, y) {
    // if (totalPage<page) totalPage=page;
    if (totalPage <= 1) return;
    if (y == null) y = this.LAST;

    core.setFillStyle('ui', '#DDDDDD');
    var length = core.calWidth('ui', page + " / " + page, this._buildFont(15, true));

    core.setTextAlign('ui', 'left');
    core.fillText('ui', page + " / " + totalPage, parseInt((this.PIXEL - length) / 2), y*32+19);

    core.setTextAlign('ui', 'center');
    if (page > 1)
        core.fillText('ui', '上一页', this.HPIXEL - 80, y*32+19);
    if (page < totalPage)
        core.fillText('ui', '下一页', this.HPIXEL + 80, y*32+19);
}

////// 绘制键盘光标 //////
ui.prototype.drawCursor = function () {
    var automaticRoute = core.status.automaticRoute;
    if (automaticRoute.cursorX == null)
        automaticRoute.cursorX = core.getHeroLoc('x');
    if (automaticRoute.cursorY == null)
        automaticRoute.cursorY = core.getHeroLoc('y');
    automaticRoute.cursorX = core.clamp(automaticRoute.cursorX, 0, this.LAST);
    core.status.event.id = 'cursor';
    core.lockControl();
    core.clearUI();
    var width = 4;
    core.strokeRect('ui', 32*automaticRoute.cursorX+width/2, 32*automaticRoute.cursorY+width/2,
        32-width, 32-width, '#FFD700', width);

}

////// 绘制怪物手册 //////
ui.prototype.drawBook = function (index) {
    var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
    var enemys = core.enemys.getCurrentEnemys(floorId);
    core.clearUI();
    core.clearMap('data');
    // 生成groundPattern
    core.maps.generateGroundPattern(floorId);
    this._drawBook_drawBackground();
    core.setAlpha('ui', 1);

    if (enemys.length == 0) {
        core.setTextAlign('ui', 'center');
        core.fillText('ui', "本层无怪物", this.HPIXEL, this.HPIXEL + 14, '#999999', this._buildFont(50, true));
        core.fillText('ui', '返回游戏', this.PIXEL - 46, this.PIXEL - 13,'#DDDDDD', this._buildFont(15, true));
        return;
    }

    index = core.clamp(index, 0, enemys.length - 1);
    core.status.event.data = index;
    var perpage = this.HSIZE, page = parseInt(index / perpage) + 1, totalPage = Math.ceil(enemys.length / perpage);
    var start = (page - 1) * perpage;
    enemys = enemys.slice(start, page * perpage);

    for (var i = 0; i < enemys.length; i++)
        this._drawBook_drawOne(floorId, i, enemys[i], index == start + i);

    core.drawBoxAnimate();
    this.drawPagination(page, totalPage);
    core.setTextAlign('ui', 'center');
    core.fillText('ui', '返回游戏', this.PIXEL - 46, this.PIXEL - 13,'#DDDDDD', this._buildFont(15, true));
}

ui.prototype._drawBook_drawBackground = function () {
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', core.material.groundPattern);
    core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL);

    core.setAlpha('ui', 0.6);
    core.setFillStyle('ui', '#000000');
    core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL);
}

ui.prototype._drawBook_drawOne = function (floorId, index, enemy, selected) {
    // --- 区域规划：每个区域总高度为62，宽度为 PIXEL
    var top = 62 * index + 12; // 最上面margin是12px
    // 横向规划：
    // 22 + 42 = 64 是头像框
    this._drawBook_drawBox(index, enemy, top);
    // 剩余 PIXEL - 64 的宽度，按照 10 : 9 : 8 : 8 的比例划分
    var left = 64, total_width = this.PIXEL - left;
    var name_width = total_width * 10 / 35;
    this._drawBook_drawName(index, enemy, top, left, name_width);
    this._drawBook_drawContent(index, enemy, top, left + name_width);
    if (selected)
        core.strokeRect('ui', 10, top + 1, this.PIXEL - 10 * 2,  62, '#FFD700');
}

ui.prototype._drawBook_drawBox = function (index, enemy, top) {
    // 横向：22+42；纵向：10 + 42 + 10（正好居中）；内部图像 32x32
    var border_top = top + 10, border_left = 22;
    var img_top = border_top + 5, img_left = border_left + 5;
    core.strokeRect('ui', 22, border_top, 42, 42, '#DDDDDD', 2);
    var blockInfo = core.getBlockInfo(enemy.id);
    core.status.boxAnimateObjs.push({
        'bgx': border_left, 'bgy': border_top, 'bgWidth': 42, 'bgHeight': 42,
        'x': img_left, 'y': img_top, 'height': 32, 'animate': blockInfo.animate,
        'image': blockInfo.image, 'pos': blockInfo.posY * blockInfo.height
    });
}

ui.prototype._drawBook_drawName = function (index, enemy, top, left, width) {
    // 绘制第零列（名称和特殊属性）
    // 如果需要添加自己的比如怪物的称号等，也可以在这里绘制
    core.setTextAlign('ui', 'center');
    if (enemy.specialText=='') {
        core.fillText('ui', enemy.name, left + width / 2,
            top + 35, '#DDDDDD', this._buildFont(17, true));
    }
    else {
        core.fillText('ui', enemy.name, left + width / 2,
            top + 28, '#DDDDDD', this._buildFont(17, true));
        core.fillText('ui', enemy.specialText, left + width / 2,
            top + 50, '#FF6A6A', this._buildFont(15, true));
    }
}

ui.prototype._drawBook_drawContent = function (index, enemy, top, left) {
    var width = this.PIXEL - left; // 9 : 8 : 8 划分三列
    this._drawBook_drawRow1(index, enemy, top, left, width, top + 20);
    this._drawBook_drawRow2(index, enemy, top, left, width, top + 38);
    this._drawBook_drawRow3(index, enemy, top, left, width, top + 56);
}

ui.prototype._drawBook_drawRow1 = function (index, enemy, top, left, width, position) {
    // 绘制第一行
    core.setTextAlign('ui', 'left');
    var b13 = this._buildFont(13, true), f13 = this._buildFont(13, false);
    var col1 = left, col2 = left + width * 9 / 25, col3 = left + width * 17 / 25;
    core.fillText('ui', '生命', col1, position, '#DDDDDD', f13);
    core.fillText('ui', core.formatBigNumber(enemy.hp||0), col1 + 30, position, null, b13);
    core.fillText('ui', '攻击', col2, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.atk||0), col2 + 30, position, null, b13);
    core.fillText('ui', '防御', col3, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.def||0), col3 + 30, position, null, b13);
}

ui.prototype._drawBook_drawRow2 = function (index, enemy, top, left, width, position) {
    // 绘制第二行
    core.setTextAlign('ui', 'left');
    var b13 = this._buildFont(13, true), f13 = this._buildFont(13, false);
    var col1 = left, col2 = left + width * 9 / 25, col3 = left + width * 17 / 25;
    // 获得第二行绘制的内容
    var second_line = [];
    if (core.flags.enableMoney) second_line.push(["金币", core.formatBigNumber(enemy.money || 0)]);
    if (core.flags.enableAddPoint) second_line.push(["加点", core.formatBigNumber(enemy.point || 0)]);
    if (core.flags.enableExperience) second_line.push(["经验", core.formatBigNumber(enemy.experience || 0)]);

    var damage_offset = col1 + (this.PIXEL - col1) / 2 - 12;
    // 第一列
    if (second_line.length > 0) {
        var one = second_line.shift();
        core.fillText('ui', one[0], col1, position, '#DDDDDD', f13);
        core.fillText('ui', one[1], col1 + 30, position, null, b13);
        damage_offset = col2 + (this.PIXEL - col2) / 2 - 12;
    }
    // 第二列
    if (second_line.length > 0) {
        var one = second_line.shift();
        core.fillText('ui', one[0], col2, position, '#DDDDDD', f13);
        core.fillText('ui', one[1], col2 + 30, position, null, b13);
        damage_offset = col3 + (this.PIXEL - col3) / 2 - 12;
    }
    // 忽略第三列，直接绘制伤害
    this._drawBook_drawDamage(index, enemy, damage_offset, position);
}

ui.prototype._drawBook_drawRow3 = function (index, enemy, top, left, width, position) {
    // 绘制第三行
    core.setTextAlign('ui', 'left');
    var b13 = this._buildFont(13, true), f13 = this._buildFont(13, false);
    var col1 = left, col2 = left + width * 9 / 25, col3 = left + width * 17 / 25;
    core.fillText('ui', '临界', col1, position, '#DDDDDD', f13);
    core.fillText('ui', core.formatBigNumber(enemy.critical||0), col1 + 30, position, null, b13);
    core.fillText('ui', '减伤', col2, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.criticalDamage||0), col2 + 30, position, null, b13);
    core.fillText('ui', '1防', col3, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.defDamage||0), col3 + 30, position, null, b13);
}

ui.prototype._drawBook_drawDamage = function (index, enemy, offset, position) {
    core.setTextAlign('ui', 'center');
    var damage = enemy.damage, color = '#FFFF00';
    if (damage == null) {
        damage = '无法战斗';
        color = '#FF0000';
    }
    else {
        if (damage >= core.status.hero.hp) color = '#FF0000';
        if (damage <= 0) color = '#00FF00';
        damage = core.formatBigNumber(damage);
        if (core.enemys.hasSpecial(enemy, 19)) damage += "+";
        if (core.enemys.hasSpecial(enemy, 21)) damage += "-";
        if (core.enemys.hasSpecial(enemy, 11)) damage += "^";
    }
    if (enemy.notBomb) damage += "[b]";
    core.fillText('ui', damage, offset, position, color, this._buildFont(13, true));
}

////// 绘制怪物属性的详细信息 //////
ui.prototype.drawBookDetail = function (index) {
    var info = this._drawBookDetail_getInfo(index), enemy = info[0];
    if (!enemy) return;
    var content = info[1].join("\n");
    core.status.event.id = 'book-detail';
    clearInterval(core.interval.tipAnimate);
    core.clearMap('data');

    var left = 10, width = this.PIXEL - 2 * left, right = left + width;
    var content_left = left + 25, validWidth = right - content_left - 13;
    var contents = core.splitLines("data", content, validWidth, this._buildFont(16, false));
    var height = Math.max(24 * contents.length + 55, 80), top = (this.PIXEL - height) / 2, bottom = top + height;

    core.setAlpha('data', 0.9);
    core.fillRect('data', left, top, width, height, '#000000');
    core.setAlpha('data', 1);
    core.strokeRect('data', left - 1, top - 1, width + 1, height + 1,
        core.status.globalAttribute.borderColor, 2);

    this._drawBookDetail_drawContent(enemy, contents, {top: top, content_left: content_left, bottom: bottom});
}

ui.prototype._drawBookDetail_getInfo = function (index) {
    var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
    var enemys = core.enemys.getCurrentEnemys(floorId);
    if (enemys.length==0) return [];
    index = core.clamp(index, 0, enemys.length - 1);
    var enemy = enemys[index], enemyId = enemy.id;
    var texts=core.enemys.getSpecialHint(enemyId);
    if (texts.length == 0) texts.push("该怪物无特殊属性。");
    texts.push("");
    this._drawBookDetail_getTexts(enemy, floorId, texts);
    return [enemy, texts];
}

ui.prototype._drawBookDetail_getTexts = function (enemy, floorId, texts) {
    // --- 模仿临界计算器
    this._drawBookDetail_mofang(enemy, texts);
    // --- 吸血怪最低生命值
    this._drawBookDetail_vampire(enemy, texts);
    // --- 仇恨伤害
    this._drawBookDetail_hatred(enemy, texts);
    // --- 战斗回合数，临界表
    this._drawBookDetail_turnAndCriticals(enemy, floorId, texts);
}

ui.prototype._drawBookDetail_mofang = function (enemy, texts) {
    // 模仿临界计算器
    if (core.enemys.hasSpecial(enemy.special, 10)) {
        var hp = enemy.hp;
        var delta = core.status.hero.atk - core.status.hero.def;
        if (delta<hp && hp<=10000 && hp>0) {
            texts.push("模仿临界计算器：（当前攻防差"+core.formatBigNumber(delta)+"）");
            var u = [];
            this._drawBookDetail_mofang_getArray(hp).forEach(function (t) {
                if (u.length < 20) u.push(t);
                else if (Math.abs(t[0]-delta)<Math.abs(u[0][0]-delta)) {
                    u.shift();
                    u.push(t);
                }
            });
            texts.push(JSON.stringify(u.map(function (v) {
                return core.formatBigNumber(v[0])+":"+v[1];
            })));
        }
    }
}

ui.prototype._drawBookDetail_mofang_getArray = function (hp) {
    var arr = [];
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
    return arr;
}

ui.prototype._drawBookDetail_vampire = function (enemy, texts) {
    if (core.enemys.hasSpecial(enemy.special, 11)) {
        var damage = core.getDamage(enemy.id);
        if (damage != null) {
            // 二分HP
            var start = 1, end = 100 * damage;
            var nowHp = core.status.hero.hp;
            while (start<end) {
                var mid = Math.floor((start+end)/2);
                core.status.hero.hp = mid;
                if (core.canBattle(enemy.id)) end = mid;
                else start = mid+1;
            }
            core.status.hero.hp = start;
            if (core.canBattle(enemy.id)) {
                texts.push("打死该怪物最低需要生命值："+core.formatBigNumber(start));
            }
            core.status.hero.hp = nowHp;
        }
    }
}

ui.prototype._drawBookDetail_hatred = function (enemy, texts) {
    if (core.enemys.hasSpecial(enemy.special, 17)) {
        texts.push("当前仇恨伤害值："+core.getFlag('hatred', 0));
    }
}

ui.prototype._drawBookDetail_turnAndCriticals = function (enemy, floorId, texts) {
    var damageInfo = core.getDamageInfo(enemy, null, null, null, floorId);
    texts.push("战斗回合数："+((damageInfo||{}).turn||0));
    // 临界表
    var criticals = core.enemys.nextCriticals(enemy, 10, null, null, floorId).map(function (v) {
        return core.formatBigNumber(v[0])+":"+core.formatBigNumber(v[1]);
    });
    while (criticals[0]=='0:0') criticals.shift();
    texts.push("临界表："+JSON.stringify(criticals))
}

ui.prototype._drawBookDetail_drawContent = function (enemy, contents, pos) {
    // 名称
    core.setTextAlign('data', 'left');
    core.fillText('data', enemy.name, pos.content_left, pos.top + 30, '#FFD700', this._buildFont(22, true));
    var content_top = pos.top + 57;

    for (var i=0;i<contents.length;i++) {
        var text=contents[i];
        var index=text.indexOf("：");
        if (index>=0) {
            var x1 = text.substring(0, index+1);
            core.fillText('data', x1, pos.content_left, content_top, '#FF6A6A', this._buildFont(16, true));
            var len=core.calWidth('data', x1);
            core.fillText('data', text.substring(index+1), pos.content_left+len, content_top, '#FFFFFF', this._buildFont(16, false));
        }
        else {
            core.fillText('data', contents[i], pos.content_left, content_top, '#FFFFFF', this._buildFont(16, false));
        }
        content_top+=24;
    }
}

////// 绘制楼层传送器 //////
ui.prototype.drawFly = function(page) {
    core.status.event.data = page;
    var floorId = core.floorIds[page];
    var title = core.status.maps[floorId].title;
    core.clearMap('ui');
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL, '#000000');
    core.setAlpha('ui', 1);
    core.setTextAlign('ui', 'center');
    core.fillText('ui', '楼层跳跃', this.HPIXEL, 60, '#FFFFFF', this._buildFont(28, true));
    core.fillText('ui', '返回游戏', this.HPIXEL, this.PIXEL - 13, null, this._buildFont(15, true))
    core.fillText('ui', title, this.PIXEL - 60, this.HPIXEL + 39, null, this._buildFont(19, true));
    var middle = this.HPIXEL + 39;
    if (core.actions._getNextFlyFloor(1) != page) {
        core.fillText('ui', '▲', this.PIXEL - 60, middle - 64, null, this._buildFont(17, false));
        core.fillText('ui', '▲', this.PIXEL - 60, middle - 96);
        core.fillText('ui', '▲', this.PIXEL - 60, middle - 96 - 7);
    }
    if (core.actions._getNextFlyFloor(-1) != page) {
        core.fillText('ui', '▼', this.PIXEL - 60, middle + 64, null, this._buildFont(17, false));
        core.fillText('ui', '▼', this.PIXEL - 60, middle + 96);
        core.fillText('ui', '▼', this.PIXEL - 60, middle + 96 + 7);
    }
    var size = this.PIXEL - 143;
    core.strokeRect('ui', 20, 100, size, size, '#FFFFFF', 2);
    core.drawThumbnail(floorId, null, null, {ctx: 'ui', x: 20, y: 100, size: size});
}

////// 绘制中心对称飞行器
ui.prototype.drawCenterFly = function () {
    core.lockControl();
    core.status.event.id = 'centerFly';
    var fillstyle = 'rgba(255,0,0,0.5)';
    if (core.canUseItem('centerFly')) fillstyle = 'rgba(0,255,0,0.5)';
    var toX = core.bigmap.width - 1 - core.getHeroLoc('x'), toY = core.bigmap.height - 1 - core.getHeroLoc('y');
    core.drawThumbnail(null, null, {heroLoc: core.status.hero.loc, heroIcon: core.getFlag('heroIcon', "hero.png")},
        {ctx: 'ui', centerX: toX, centerY: toY});
    var offsetX = core.clamp(toX - core.__HALF_SIZE__, 0, core.bigmap.width - core.__SIZE__),
        offsetY = core.clamp(toY - core.__HALF_SIZE__, 0, core.bigmap.height - core.__SIZE__);
    core.fillRect('ui', (toX - offsetX) * 32, (toY - offsetY) * 32, 32, 32, fillstyle);
    core.status.event.data = {"x": toX, "y": toY, "posX": toX - offsetX, "posY": toY - offsetY};
    core.drawTip("请确认当前中心对称飞行器的位置");
    return;
}

////// 绘制全局商店
ui.prototype.drawShop = function (shopId) {
    var shop = core.status.shops[shopId];
    var actions = [], fromList = (core.status.event.data||{}).fromList, selection = core.status.event.selection;
    if (core.status.event.data && core.status.event.data.actions) actions=core.status.event.data.actions;

    core.ui.closePanel();
    core.lockControl();
    core.status.event.id = 'shop';
    core.status.event.data = {'id': shopId, 'shop': shop, 'actions': actions, 'fromList': fromList};
    core.status.event.selection = selection;

    var times = shop.times, need=core.calValue(shop.need, null, null, times);
    var content = "\t["+shop.name+","+shop.icon+"]" + core.replaceText(shop.text, need, times);
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

////// 绘制浏览地图界面 //////
ui.prototype.drawMaps = function (index, x, y) {
    core.lockControl();
    core.status.event.id = 'viewMaps';
    this.clearUI();
    if (index == null) return this._drawMaps_drawHint();
    clearTimeout(core.interval.tipAnimate);
    core.status.checkBlock.cache = {};
    var data = this._drawMaps_buildData(index, x, y);
    core.drawThumbnail(data.floorId, null, {damage: data.damage},
        {ctx: 'ui', centerX: data.x, centerY: data.y, all: data.all});
    // 绘图
    if (data.paint) {
        var offsetX = 32 * (data.x - this.HSIZE), offsetY = 32 * (data.y - this.HSIZE);
        var value = core.paint[data.floorId];
        if (value) value = lzw_decode(value).split(",");
        core.utils._decodeCanvas(value, 32 * data.mw, 32 * data.mh);
        core.drawImage('ui', core.bigmap.tempCanvas.canvas, offsetX * 32, offsetY * 32,
            this.PIXEL, this.PIXEL, 0, 0, this.PIXEL, this.PIXEL);
    }
    core.clearMap('data');
    core.setTextAlign('data', 'left');
    core.setFont('data', '16px Arial');
    var text = core.status.maps[data.floorId].title;
    if (!data.all && (data.mw>this.SIZE || data.mh>this.SIZE))
        text+=" ["+(data.x-this.HSIZE)+","+(data.y-this.HSIZE)+"]";
    var textX = 16, textY = 18, width = textX + core.calWidth('data', text) + 16, height = 42;
    core.fillRect('data', 5, 5, width, height, 'rgba(0,0,0,0.4)');
    core.fillText('data', text, textX + 5, textY + 15, 'rgba(255,255,255,0.6)');
}

ui.prototype._drawMaps_drawHint = function () {
    core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL, 'rgba(0,0,0,0.4)');
    core.setTextAlign('ui', 'center');
    var stroke = function (left, top, width, height, fillStyle, lineWidth) {
        core.strokeRect('ui', left*32+2, top*32+2, width*32-4, height*32-4, fillStyle, lineWidth);
    }
    var per = this.HSIZE - 4;
    stroke(per, 0, 9, per, '#FFD700', 4); // up
    stroke(0, per, per, 9); // left
    stroke(per, this.SIZE - per, 9, per); // down
    stroke(this.SIZE - per, per, per, 9); // right
    stroke(per, per, 9, 3); // prev
    stroke(per, this.SIZE - per - 3, 9, 3); // next
    stroke(0, 0, per-1, per-1); // left top
    stroke(this.SIZE-(per - 1), 0, per-1, per-1); // right top
    stroke(0, this.SIZE-(per-1), per-1, per-1); // left bottom

    core.setTextBaseline('ui', 'middle');
    core.fillText('ui', "上移地图 [W]", this.HPIXEL, per * 16, '#FFD700', '20px Arial');
    core.fillText('ui', "下移地图 [S]", this.HPIXEL, this.PIXEL - per * 16);
    core.fillText('ui', 'V', (per-1)*16, (per-1)*16);
    core.fillText('ui', 'Z', this.PIXEL - (per-1)*16, (per-1)*16);
    core.fillText('ui', 'M', (per-1)*16, this.PIXEL - (per-1)*16);

    var top = this.HPIXEL - 66, left = per * 16, right = this.PIXEL - left;
    var lt = ["左", "移", "地", "图", "[A]"], rt = ["右", "移", "地", "图", "[D]"];
    for (var i = 0; i < 5; ++i) {
        core.fillText("ui", lt[i], left, top + 32 * i);
        core.fillText("ui", rt[i], right, top + 32 * i);
    }
    core.fillText('ui', "前张地图 [▲ / PGUP]", this.HPIXEL, 32 * per + 48);
    core.fillText('ui', "后张地图 [▼ / PGDN]", this.HPIXEL, this.PIXEL - (32 * per + 48));

    core.fillText('ui', "退出 [ESC / ENTER]", this.HPIXEL, this.HPIXEL);
    core.fillText('ui', "[X] 可查看怪物手册", this.HPIXEL + 77, this.HPIXEL + 32, null, '13px Arial');

    core.setTextBaseline('ui', 'alphabetic');
}

ui.prototype._drawMaps_buildData = function (index, x, y) {
    var damage = (core.status.event.data||{}).damage;
    var paint =  (core.status.event.data||{}).paint;
    var all = (core.status.event.data||{}).all;
    if (index.damage != null) damage=index.damage;
    if (index.paint != null) paint=index.paint;
    if (index.all != null) all=index.all;
    if (index.index != null) { x=index.x; y=index.y; index=index.index; }
    index = core.clamp(index, 0, core.floorIds.length-1);
    if (damage == null) damage = true; // 浏览地图默认开显伤好了

    var floorId = core.floorIds[index], mw = core.floors[floorId].width, mh = core.floors[floorId].height;
    if (x == null) x = parseInt(mw / 2);
    if (y == null) y = parseInt(mh / 2);
    x = core.clamp(x, this.HSIZE, mw - this.HSIZE - 1);
    y = core.clamp(y, this.HSIZE, mh - this.HSIZE - 1);

    core.status.event.data = {index: index, x: x, y: y, floorId: floorId, mw: mw, mh: mh,
                              damage: damage, paint: paint, all: all };
    return core.status.event.data;
}

////// 绘制道具栏 //////
ui.prototype.drawToolbox = function(index) {
    var info = this._drawToolbox_getInfo(index);
    this._drawToolbox_drawBackground();

    // 绘制线
    core.setAlpha('ui', 1);
    core.setStrokeStyle('ui', '#DDDDDD');
    core.canvas.ui.lineWidth = 2;
    core.canvas.ui.strokeWidth = 2;
    core.setTextAlign('ui', 'right');
    var line1 = this.PIXEL - 306;
    this._drawToolbox_drawLine(line1, "消耗道具");
    var line2 = this.PIXEL - 146;
    this._drawToolbox_drawLine(line2, "永久道具");

    this._drawToolbox_drawDescription(info, line1);

    this._drawToolbox_drawContent(info, line1, info.tools, info.toolsPage, true);
    this.drawPagination(info.toolsPage, info.toolsTotalPage, this.LAST - 5);
    this._drawToolbox_drawContent(info, line2, info.constants, info.constantsPage);
    this.drawPagination(info.constantsPage, info.constantsTotalPage);

    core.setTextAlign('ui', 'center');
    core.fillText('ui', '[装备栏]', this.PIXEL - 46, 25, '#DDDDDD', this._buildFont(15, true));
    core.fillText('ui', '返回游戏', this.PIXEL - 46, this.PIXEL - 13);
}

ui.prototype._drawToolbox_getInfo = function (index) {
    // 设定eventdata
    if (!core.status.event.data || core.status.event.data.toolsPage == null)
        core.status.event.data = {"toolsPage":1, "constantsPage":1, "selectId":null}
    // 获取物品列表
    var tools = Object.keys(core.status.hero.items.tools).sort();
    var constants = Object.keys(core.status.hero.items.constants).sort();
    // 处理页数
    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    var toolsTotalPage = Math.ceil(tools.length/this.LAST);
    var constantsTotalPage = Math.ceil(constants.length/this.LAST);
    // 处理index
    if (index == null)
        index = tools.length == 0 && constants.length > 0 ? this.LAST : 0;
    core.status.event.selection=index;
    // 确认选择对象
    var select, selectId;
    if (index<this.LAST) {
        select = index + (toolsPage-1)*this.LAST;
        if (select>=tools.length) select=Math.max(0, tools.length-1);
        selectId = tools[select];
    }
    else {
        select = index%this.LAST + (constantsPage-1)*this.LAST;
        if (select>=constants.length) select=Math.max(0, constants.length-1);
        selectId = constants[select];
    }
    if (!core.hasItem(selectId)) selectId=null;
    core.status.event.data.selectId=selectId;
    return {
        index: index, tools: tools, constants: constants, toolsPage: toolsPage, constantsPage: constantsPage,
        toolsTotalPage: toolsTotalPage, constantsTotalPage: constantsTotalPage, selectId: selectId
    };
}

ui.prototype._drawToolbox_drawBackground = function () {
    // 绘制
    core.clearMap('ui');
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL, '#000000');
}

ui.prototype._drawToolbox_drawLine = function (yoffset, text) {
    core.setFillStyle('ui', '#DDDDDD');
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0, yoffset);
    core.canvas.ui.lineTo(this.PIXEL, yoffset);
    core.canvas.ui.stroke();
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(this.PIXEL, yoffset-1);
    core.canvas.ui.lineTo(this.PIXEL, yoffset-25);
    core.canvas.ui.lineTo(this.PIXEL-72, yoffset-25);
    core.canvas.ui.lineTo(this.PIXEL-102, yoffset-1);
    core.canvas.ui.fill();
    core.fillText('ui', text, this.PIXEL - 5, yoffset-6, '#333333', this._buildFont(16, true));
}

ui.prototype._drawToolbox_drawDescription = function (info, max_height) {
    core.setTextAlign('ui', 'left');
    if (!info.selectId) return;
    var item=core.material.items[info.selectId];
    core.fillText('ui', item.name, 10, 32, '#FFD700', this._buildFont(20, true))
    var text = item.text||"该道具暂无描述。";
    try {
        // 检查能否eval
        text = core.replaceText(text);
    } catch (e) {}
    var lines = core.splitLines('ui', text, this.PIXEL - 15, this._buildFont(17, false));
    // --- 开始逐行绘制
    var curr = 62, line_height = 25;
    core.setFillStyle('ui', '#FFFFFF');
    for (var i=0;i<lines.length;++i) {
        core.fillText('ui', lines[i], 10, curr);
        curr += line_height;
        if (curr>=max_height) break;
    }
    if (curr < max_height) {
        core.fillText('ui', '<继续点击该道具即可进行使用>', 10, curr, '#CCCCCC', this._buildFont(14, false));
    }
}

ui.prototype._drawToolbox_drawContent = function (info, line, items, page, drawCount) {
    core.setTextAlign('ui', 'right');
    for (var i = 0; i < this.LAST; i++) {
        var item = items[this.LAST * (page - 1) + i];
        if (!item) continue;
        var yoffset = line + 54 * Math.floor(i / this.HSIZE) + 19;
        var icon = core.material.icons.items[item], image = core.material.images.items;
        core.drawImage('ui', image, 0, 32 * icon, 32, 32, 64 * (i % this.HSIZE) + 21, yoffset, 32, 32);
        if (drawCount)
            core.fillText('ui', core.itemCount(item), 64 * (i % this.HSIZE) + 56, yoffset + 33, '#FFFFFF', this._buildFont(14, true));
        if (info.selectId == item)
            core.strokeRect('ui', 64 * (i % this.HSIZE) + 17, yoffset - 4, 40, 40, '#FFD700');
    }
}

////// 绘制装备界面 //////
ui.prototype.drawEquipbox = function(index) {
    var info = this._drawEquipbox_getInfo(index);
    this._drawToolbox_drawBackground();

    core.setAlpha('ui', 1);
    core.setStrokeStyle('ui', '#DDDDDD');
    core.canvas.ui.lineWidth = 2;
    core.canvas.ui.strokeWidth = 2;
    core.setTextAlign('ui', 'right');
    var line1 = this.PIXEL - 306;
    this._drawToolbox_drawLine(line1, "当前装备");
    var line2 = this.PIXEL - 146;
    this._drawToolbox_drawLine(line2, "拥有装备");

    this._drawEquipbox_description(info, line1);

    this._drawEquipbox_drawEquiped(info, line1);
    this._drawToolbox_drawContent(info, line2, info.ownEquipment, info.page, true);
    this.drawPagination(info.page, info.totalPage);

    core.setTextAlign('ui', 'center');
    core.fillText('ui', '[道具栏]', this.PIXEL - 46, 25, '#DDDDDD', this._buildFont(15, true));
    core.fillText('ui', '返回游戏', this.PIXEL - 46, this.PIXEL - 13);
}

ui.prototype._drawEquipbox_getInfo = function (index) {
    if (!core.status.event.data || core.status.event.data.page == null)
        core.status.event.data = {"page":1, "selectId":null};
    var allEquips = core.status.globalAttribute.equipName;
    var equipLength = allEquips.length;
    if (!core.status.hero.equipment) core.status.hero.equipment = [];
    var equipEquipment = core.status.hero.equipment;
    var ownEquipment = Object.keys(core.status.hero.items.equips).sort();
    var page = core.status.event.data.page;
    var totalPage = Math.ceil(ownEquipment.length / this.LAST);
    // 处理index
    if (index == null) {
        if (equipLength > 0 && equipEquipment[0]) index = 0;
        else if (ownEquipment.length > 0) index = this.LAST;
        else index = 0;
    }
    if (index >= this.LAST && ownEquipment.length == 0) index = 0;
    var selectId=null;
    if (index < this.LAST) {
        if (index >= equipLength) index=Math.max(0, equipLength - 1);
        selectId = equipEquipment[index] || null;
    }
    else {
        if (page == totalPage) index = Math.min(index, (ownEquipment.length+this.LAST-1)%this.LAST+this.LAST);
        selectId = ownEquipment[index - this.LAST + (page - 1) * this.LAST];
        if (!core.hasItem(selectId)) selectId=null;
    }
    core.status.event.selection=index;
    core.status.event.data.selectId=selectId;
    return { index: index, selectId: selectId, page: page, totalPage: totalPage, allEquips: allEquips,
            equipLength: equipLength, equipEquipment: equipEquipment, ownEquipment: ownEquipment};
}

ui.prototype._drawEquipbox_description = function (info, max_height) {
    core.setTextAlign('ui', 'left');
    if (!info.selectId) return;
    var equip=core.material.items[info.selectId];
    // --- 标题
    if (!equip.equip) equip.equip = {"type": 0};
    var equipType = equip.equip.type, equipString;
    if (typeof equipType === 'string') {
        equipString = equipType || "未知部位";
        equipType = core.items.getEquipTypeByName(equipType);
    }
    else equipString = info.allEquips[equipType] || "未知部位";
    core.fillText('ui', equip.name + "（" + equipString + "）", 10, 32, '#FFD700', this._buildFont(20, true))
    // --- 描述
    var text = equip.text || "该装备暂无描述。";
    try {
        text = core.replaceText(text);
    } catch (e) {}
    var lines = core.splitLines('ui', text, this.PIXEL - 15, this._buildFont(17, false));
    var curr = 62, line_height = 25;
    core.setFillStyle('ui', '#FFFFFF');
    for (var i = 0; i < lines.length; ++i) {
        core.fillText('ui', lines[i], 10, curr);
        curr += line_height;
        if (curr >= max_height) break;
    }
    // --- 变化值
    if (curr >= max_height) return;
    this._drawEquipbox_drawStatusChanged(info, curr, equip, equipType);
}

ui.prototype._drawEquipbox_drawStatusChanged = function (info, y, equip, equipType) {
    var compare, differentMode = null;
    if (info.index < this.LAST) compare = core.compareEquipment(null, info.selectId);
    else {
        if (equipType<0) differentMode = '<当前没有该装备的空位，请先卸下装备>';
        else {
            var last = core.material.items[info.equipEquipment[equipType]]||{};
            if (last.equip && (last.equip.percentage || false) != (equip.equip.percentage || false))
                differentMode = '<数值和比例模式之间的切换不显示属性变化>';
            else
                compare = core.compareEquipment(info.selectId, info.equipEquipment[equipType]);
        }
    }
    if (differentMode != null) {
        core.fillText('ui', differentMode, 10, y, '#CCCCCC', this._buildFont(14, false));
        return;
    }
    var drawOffset = 10;
    // --- 变化值...
    core.setFont('ui', this._buildFont(14, true));
    for (var name in compare) {
        var img = core.statusBar.icons[name];
        if (img) { // 绘制图标
            core.drawImage('ui', img, 0, 0, 32, 32, drawOffset, y - 13, 16, 16);
            drawOffset += 20;
        }
        else { // 绘制文字
            core.fillText('ui', name + " ", drawOffset, y, '#CCCCCC');
            drawOffset += core.calWidth('ui', name + " ");
        }
        var nowValue = core.getStatus(name) * core.getBuff(name), newValue = (nowValue + compare[name]) * core.getBuff(name);
        if (equip.equip.percentage) {
            var nowBuff = core.getBuff(name), newBuff = nowBuff + compare[name] / 100;
            nowValue = Math.floor(nowBuff * core.getStatus(name));
            newValue = Math.floor(newBuff * core.getStatus(name));
        }
        nowValue = core.formatBigNumber(nowValue);
        newValue = core.formatBigNumber(newValue);
        core.fillText('ui', nowValue + "->", drawOffset, y, '#CCCCCC');
        drawOffset += core.calWidth('ui', nowValue + "->");
        core.fillText('ui', newValue, drawOffset, y, compare[name]>0?'#00FF00':'#FF0000');
        drawOffset += core.calWidth('ui', newValue) + 8;
    }
}

ui.prototype._drawEquipbox_drawEquiped = function (info, line) {
    core.setTextAlign('ui', 'right');
    var per_line = this.HSIZE - 3, width = Math.floor(this.PIXEL / (per_line + 0.25));
    // 当前装备
    for (var i = 0; i < info.equipLength ; i++) {
        var equipId = info.equipEquipment[i] || null;
        var offset_text = width * (i % per_line) + 56;
        var offset_image = width * (i % per_line) + width * 2 / 3;
        var y = line + 54 * Math.floor(i / per_line) + 19;
        if (equipId) {
            var icon = core.material.icons.items[equipId];
            core.drawImage('ui', core.material.images.items, 0, 32 * icon, 32, 32, offset_image, y, 32, 32);
        }
        core.fillText('ui', info.allEquips[i] || "未知", offset_text, y + 27, '#FFFFFF', this._buildFont(16, true))
        core.strokeRect('ui', offset_image - 4, y - 4, 40, 40, info.index==i?'#FFD700':"#FFFFFF");
    }
}

////// 绘制存档/读档界面 //////
ui.prototype.drawSLPanel = function(index, refresh) {
    core.control._loadFavoriteSaves();
    if (index == null) index = 1;
    if (index < 0) index = 0;

    var page = parseInt(index/10), offset=index%10;
    var max_page = main.savePages || 30;
    if(core.status.event.data && core.status.event.data.mode=='fav')
        max_page = Math.ceil((core.saves.favorite||[]).length/5);
    if (page>=max_page) page=max_page - 1;
    if (offset>5) offset=5;
    if (core.status.event.data && core.status.event.data.mode=='fav' && page == max_page - 1) {
        offset = Math.min(offset, (core.saves.favorite||[]).length - 5 * page);
    }

    var last_page = -1;
    var mode = 'all';
    if (core.status.event.data) {
        last_page = core.status.event.data.page;
        mode = core.status.event.data.mode;
    }
    core.status.event.data={ 'page':page, 'offset':offset, 'mode':mode };
    core.status.event.ui = core.status.event.ui || [];
    if (refresh || page != last_page) {
        core.status.event.ui = [];
        this._drawSLPanel_loadSave(page, function () {
            core.ui._drawSLPanel_draw(page, max_page);
        });
    }
    else this._drawSLPanel_draw(page, max_page);
}

ui.prototype._drawSLPanel_draw = function (page, max_page) {
    // --- 绘制背景
    this._drawSLPanel_drawBackground();
    // --- 绘制文字
    core.ui.drawPagination(page+1, max_page);
    core.setTextAlign('ui', 'center');
    var bottom = this.PIXEL-13;
    core.fillText('ui', '返回游戏', this.PIXEL-48, bottom, '#DDDDDD', this._buildFont(15, true));

    if (core.status.event.selection)
        core.setFillStyle('ui', '#FF6A6A');
    if (core.status.event.id=='save')
        core.fillText('ui', '删除模式', 48, bottom);
    else{
        if(core.status.event.data.mode=='all'){
            core.fillText('ui', '[E]显示收藏', 52, bottom);
        }else{
            core.fillText('ui', '[E]显示全部', 52, bottom);
        }
    }
    // --- 绘制记录
    this._drawSLPanel_drawRecords();
}

ui.prototype._drawSLPanel_drawBackground = function() {
    core.clearMap('ui');
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL, '#000000');//可改成背景图图
    core.setAlpha('ui', 1);
}

ui.prototype._drawSLPanel_loadSave = function(page, callback) {
    var ids = [0];
    for (var i = 1; i <= 5; ++i) {
        var id = 5 * page + i;
        if(core.status.event.data.mode=='fav')
            id = core.saves.favorite[id - 1]; // 因为favorite第一个不是自动存档 所以要偏移1
        ids.push(id);
    }
    core.getSaves(ids, function (data) {
        for (var i = 0; i < ids.length; ++i)
            core.status.event.ui[i] = data[i];
        core.saves.autosave.data = data[0];
        callback();
    });
}

// 在以x为中心轴 y为顶坐标 的位置绘制一条宽为size的记录 cho表示是否被选中 选中会加粗 highlight表示高亮标题 ✐
ui.prototype._drawSLPanel_drawRecord = function(title, data, x, y, size, cho, highLight){
    var strokeColor = '#FFD700';
    if (core.status.event.selection) strokeColor = '#FF6A6A';
    if (!data || !data.floorId) highLight = false;

    core.fillText('ui', title, x, y, highLight?'#FFD700':'#FFFFFF', this._buildFont(17, true));
    core.strokeRect('ui', x-size/2, y+15, size, size, cho?strokeColor:'#FFFFFF', cho?6:2);
    if (data && data.floorId) {
        core.drawThumbnail(data.floorId, core.maps.loadMap(data.maps, data.floorId).blocks, {
            heroLoc: data.hero.loc, heroIcon: data.hero.flags.heroIcon, flags: data.hero.flags
        }, {
            ctx: 'ui', x: x-size/2, y: y+15, size: size, centerX: data.hero.loc.x, centerY: data.hero.loc.y
        });
        var v = core.formatBigNumber(data.hero.hp,true)+"/"+core.formatBigNumber(data.hero.atk,true)+"/"+core.formatBigNumber(data.hero.def,true);
        var v2 = "/"+core.formatBigNumber(data.hero.mdef,true);
        if (core.calWidth('ui', v + v2, this._buildFont(10, false)) <= size) v += v2;
        core.fillText('ui', v, x, y+30+size, '#FFD700');
        core.fillText('ui', core.formatDate(new Date(data.time)), x, y+43+size, data.hero.flags.__consoleOpened__?'#FF6A6A':'#FFFFFF');
    }
    else {
        core.fillRect('ui', x-size/2, y+15, size, size, '#333333', 2);
        core.fillText('ui', '空', x, parseInt(y+22+size/2), '#FFFFFF', this._buildFont(30,true));
    } 
}

ui.prototype._drawSLPanel_drawRecords  = function (n) {
    var page = core.status.event.data.page;
    var offset = core.status.event.data.offset;
    var u = Math.floor(this.PIXEL/6), size = Math.floor(this.PIXEL/3-20);
    var name=core.status.event.id=='save'?"存档":core.status.event.id=='load'?"读档":core.status.event.id=='replayLoad'?"回放":"";

    for (var i = 0; i < (n||6); i++){
        var data = core.status.event.ui[i];
        var id = 5 * page + i;
        var highLight = (i>0&&core.saves.favorite.indexOf(id)>=0) || core.status.event.data.mode=='fav';
        var title = (highLight?'★ ':'☆ ') + (core.saves.favoriteName[id] || (name + id));
        if (i != 0 && core.status.event.data.mode=='fav') {
            if (!data) break;
            var real_id = core.saves.favorite[id - 1];
            title = (core.saves.favoriteName[real_id] || (name + real_id)) + ' ✐';
        }

        var charSize = 32;// 字体占用像素范围
        var topSpan = parseInt((this.PIXEL-charSize-2*(charSize*2 + size))/3);// Margin
        var yTop1 = topSpan+parseInt(charSize/2) + 8;//文字的中心
        var yTop2 = yTop1+charSize*2+size+topSpan;
        if (i<3) {
            this._drawSLPanel_drawRecord(i==0?"自动存档":title, data, (2*i+1)*u, yTop1, size, i==offset, highLight);
        }
        else {
            this._drawSLPanel_drawRecord(title, data, (2*i-5)*u, yTop2, size, i==offset, highLight);
        }
    }
};

ui.prototype.drawKeyBoard = function () {
    core.lockControl();
    core.status.event.id = 'keyBoard';
    core.clearUI();

    var width = 384, height = 320;
    var left = (this.PIXEL - width) / 2, right = left + width;
    var top = (this.PIXEL - height) / 2, bottom = top + height;

    var isWindowSkin = this.drawBackground(left, top, right, bottom);
    core.setTextAlign('ui', 'center');
    core.setFillStyle('ui', core.arrayToRGBA(core.status.textAttribute.title));
    core.fillText('ui', '虚拟键盘', this.HPIXEL, top + 35, null, this._buildFont(22, true));
    core.setFont('ui', this._buildFont(17, false));
    core.setFillStyle('ui', core.arrayToRGBA(core.status.textAttribute.text));
    var offset = this.HPIXEL - 89;

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
            core.fillText('ui', line[i], core.ui.HPIXEL + 32*(i-5), offset);
        }
        offset+=32;
    });

    core.fillText("ui", "返回游戏", this.HPIXEL + 128, offset-3, '#FFFFFF', this._buildFont(15, true));

    if (isWindowSkin)
        this.drawWindowSelector(core.status.textAttribute.background, this.HPIXEL + 92, offset - 22, 72, 27);
    else
        core.strokeRect('ui', this.HPIXEL + 92, offset - 22, 72, 27, "#FFD700", 2);
}

////// 绘制状态栏 /////
ui.prototype.drawStatusBar = function () {
    this.uidata.drawStatusBar();
}

////// 绘制“数据统计”界面 //////
ui.prototype.drawStatistics = function (floorIds) {
    var obj = this._drawStatistics_buildObj();
    if (typeof floorIds == 'string') floorIds = [floorIds];
    (floorIds || core.floorIds).forEach(function (floorId) {
        core.ui._drawStatistics_floorId(floorId, obj);
    });
    var statistics = core.status.hero.statistics;
    core.drawText([
        this._drawStatistics_generateText(obj, "全塔", obj.total),
        this._drawStatistics_generateText(obj, "当前", obj.current),
        "当前总步数："+core.status.hero.steps+"，当前游戏时长："+core.formatTime(statistics.currTime)
        +"，总游戏时长"+core.formatTime(statistics.totalTime)
        +"。\n瞬间移动次数："+statistics.moveDirectly+"，共计少走"+statistics.ignoreSteps+"步。"
        +"\n\n总计通过血瓶恢复生命值为"+core.formatBigNumber(statistics.hp)+"点。\n\n"
        +"总计打死了"+statistics.battle+"个怪物，得到了"+core.formatBigNumber(statistics.money)+"金币，"+core.formatBigNumber(statistics.experience)+"点经验。\n\n"
        +"受到的总伤害为"+core.formatBigNumber(statistics.battleDamage+statistics.poisonDamage+statistics.extraDamage)
        +"，其中战斗伤害"+core.formatBigNumber(statistics.battleDamage)+"点"
        +(core.flags.enableDebuff?("，中毒伤害"+core.formatBigNumber(statistics.poisonDamage)+"点"):"")
        +"，领域/夹击/阻击/血网伤害"+core.formatBigNumber(statistics.extraDamage)+"点。",
        "\t[说明]1. 地图数据统计的效果仅模拟当前立刻获得该道具的效果。\n2. 不会计算“不可被浏览地图”的隐藏层的数据。\n" +
        "3. 不会计算任何通过事件得到的道具（显示事件、改变图块、或直接增加道具等）。\n"+
        "4. 在自定义道具（例如其他宝石）后，需在脚本编辑的drawStatistics中注册，不然不会进行统计。\n"+
        "5. 所有统计信息仅供参考，如有错误，概不负责。"
    ])
}

ui.prototype._drawStatistics_buildObj = function () {
    // 数据统计要统计如下方面：
    // 1. 当前全塔剩余下的怪物数量，总金币数，总经验数，总加点数
    // 2. 当前全塔剩余的黄蓝红铁门数量，和对应的钥匙数量
    // 3. 当前全塔剩余的三种宝石数量，血瓶数量，装备数量；总共增加的攻防生命值
    // 4. 当前层的上述信息
    // 5. 当前已走的步数；瞬间移动的步数，瞬间移动的次数（和少走的步数）；游戏时长
    // 6. 当前已恢复的生命值；当前总伤害、战斗伤害、阻激夹域血网伤害、中毒伤害。
    var ori = this.uidata.drawStatistics();
    var ids = ori.filter(function (e) {
        return e.endsWith("Door") || core.material.items[e];
    });
    var cnt = {}, cls = {}, ext = {};
    ids.forEach(function (e) {
        if (e.endsWith("Door")) cls[e] = "doors";
        else cls[e] = core.material.items[e].cls;
        cnt[e] = 0;
    })
    var order = ["doors", "keys", "items", "tools", "constants", "equips"];
    ids.sort(function (a, b) {
        var c1 = order.indexOf(cls[a]), c2 = order.indexOf(cls[b]);
        if (c1==c2) return ori.indexOf(a)-ori.indexOf(b);
        return c1-c2;
    });
    var obj = {
        'monster': {
            'count': 0, 'money': 0, 'experience': 0, 'point': 0,
        },
        'count': cnt,
        'add': {
            'hp': 0, 'atk': 0, 'def': 0, 'mdef': 0
        }
    };
    return {ids: ids, cls: cls, ext: ext, total: core.clone(obj), current: core.clone(obj)};
}

ui.prototype._drawStatistics_add = function (floorId, obj, x1, x2, value) {
    obj.total[x1][x2] += value || 0;
    if (floorId == core.status.floorId)
        obj.current[x1][x2] += value || 0;
}

ui.prototype._drawStatistics_floorId = function (floorId, obj) {
    var floor = core.status.maps[floorId], blocks = floor.blocks;
    // 隐藏层不给看
    if (floor.cannotViewMap && floorId!=core.status.floorId) return;
    blocks.forEach(function (block) {
        if (block.disable) return;
        var event = block.event;
        if (event.cls.indexOf("enemy")==0) {
            core.ui._drawStatistics_enemy(floorId, event.id, obj);
        }
        else {
            var id = event.id;
            if (obj.total.count[id] != null)
                core.ui._drawStatistics_items(floorId, floor, id, obj);
        }
    })
}

ui.prototype._drawStatistics_enemy = function (floorId, id, obj) {
    var enemy = core.material.enemys[id];
    this._drawStatistics_add(floorId, obj, 'monster', 'money', enemy.money);
    this._drawStatistics_add(floorId, obj, 'monster', 'experience', enemy.experience);
    this._drawStatistics_add(floorId, obj, 'monster', 'point', enemy.point);
    this._drawStatistics_add(floorId, obj, 'monster', 'count', 1);
}

ui.prototype._drawStatistics_items = function (floorId, floor, id, obj) {
    var hp=0, atk=0, def=0, mdef=0;
    if (obj.cls[id]=='items' && id!='superPotion') {
        var temp = core.clone(core.status.hero);
        core.setFlag("__statistics__", true);
        var ratio = floor.item_ratio||1;
        try { eval(core.items.itemEffect[id]); }
        catch (e) {}
        hp = core.status.hero.hp - temp.hp;
        atk = core.status.hero.atk - temp.atk;
        def = core.status.hero.def - temp.def;
        mdef = core.status.hero.mdef - temp.mdef;
        core.status.hero = temp;
    }
    else if (obj.cls[id]=='equips') {
        var values = core.material.items[id].equip || {};
        atk = values.atk || 0;
        def = values.def || 0;
        mdef = values.mdef || 0;
    }
    if (id.indexOf('sword')==0 || id.indexOf('shield')==0 || obj.cls[id]=='equips') {
        var t = "";
        if (atk > 0) t += atk + "攻";
        if (def > 0) t += def + "防";
        if (mdef > 0) t += mdef + "魔防";
        if (t != "") obj.ext[id] = t;
    }
    this._drawStatistics_add(floorId, obj, 'count', id, 1);
    this._drawStatistics_add(floorId, obj, 'add', 'hp', hp);
    this._drawStatistics_add(floorId, obj, 'add', 'atk', atk);
    this._drawStatistics_add(floorId, obj, 'add', 'def', def);
    this._drawStatistics_add(floorId, obj, 'add', 'mdef', mdef);
}

ui.prototype._drawStatistics_generateText = function (obj, type, data) {
    var text = type+"地图中：\n";
    text += "共有怪物"+data.monster.count+"个";
    if (core.flags.enableMoney) text+="，总金币数"+data.monster.money;
    if (core.flags.enableExperience) text+="，总经验数"+data.monster.experience;
    if (core.flags.enableAddPoint) text+="，总加点数"+data.monster.point;
    text+="。\n";

    var prev = "";
    obj.ids.forEach(function (key) {
        var value = data.count[key];
        if (value==0) return;
        if (obj.cls[key] != prev) {
            if (prev != "") text += "。";
            text += "\n";
        }
        else text += "，";
        prev = obj.cls[key];
        text+=core.ui._drawStatistics_getName(key)+value+"个";
        if (obj.ext[key])
            text+="("+obj.ext[key]+")";
    })
    if (prev!="") text+="。";

    text+="\n\n";
    text+="共加生命值"+core.formatBigNumber(data.add.hp)+"点，攻击"
        +core.formatBigNumber(data.add.atk)+"点，防御"
        +core.formatBigNumber(data.add.def)+"点，魔防"
        +core.formatBigNumber(data.add.mdef)+"点。";
    return text;
}

ui.prototype._drawStatistics_getName = function (key) {
    return {"yellowDoor": "黄门", "blueDoor": "蓝门", "redDoor": "红门", "greenDoor": "绿门",
            "steelDoor": "铁门"}[key] || core.material.items[key].name;
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
        this._drawPaint_draw
    );
}

ui.prototype._drawPaint_draw = function () {
    core.drawTip("打开绘图模式，现在可以任意在界面上绘图标记");

    core.lockControl();
    core.status.event.id = 'paint';
    core.status.event.data = {"x": null, "y": null, "erase": false};

    core.clearUI();
    core.createCanvas('paint', -core.bigmap.offsetX, -core.bigmap.offsetY, 32*core.bigmap.width, 32*core.bigmap.height, 95);

    // 将已有的内容绘制到route上
    var value = core.paint[core.status.floorId];
    if (core.isset(value)) value = lzw_decode(value).split(",");
    core.utils._decodeCanvas(value, 32*core.bigmap.width, 32*core.bigmap.height);
    core.drawImage('paint', core.bigmap.tempCanvas.canvas, 0, 0);

    core.setLineWidth('paint', 3);
    core.setStrokeStyle('paint', '#FF0000');

    core.statusBar.image.keyboard.style.opacity = 0;
    core.statusBar.image.shop.style.opacity = 0;

    core.statusBar.image.book.src = core.statusBar.icons.paint.src;
    core.statusBar.image.fly.src = core.statusBar.icons.erase.src;
    core.statusBar.image.toolbox.src = core.statusBar.icons.empty.src;
    core.statusBar.image.settings.src = core.statusBar.icons.exit.src;
    core.statusBar.image.book.style.opacity = 1;
    core.statusBar.image.fly.style.opacity = 1;
}

////// 绘制帮助页面 //////
ui.prototype.drawHelp = function () {
    core.clearUI();
    if (core.material.images.keyboard) {
        core.status.event.id = 'help';
        core.lockControl();
        core.setAlpha('ui', 1);
        core.fillRect('ui', 0, 0, this.PIXEL, this.PIXEL, '#FFFFFF');
        core.drawImage('ui', core.material.images.keyboard, 32 * (this.HSIZE - 6), 32 * (this.HSIZE - 6));
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
