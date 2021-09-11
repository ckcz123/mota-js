/// <reference path="../runtime.d.ts" />

/**
 * ui.js：负责所有和UI界面相关的绘制
 * 包括：
 * 自动寻路、怪物手册、楼传器、存读档、菜单栏、NPC对话事件、等等
 */

"use strict";

function ui() {
    this._init();
    // for convenience
    this.WIDTH = core.__WIDTH__;
    this.HEIGHT = core.__HEIGHT__;
    this.H_WIDTH = core.__HALF_WIDTH__;
    this.H_HEIGHT = core.__HALF_HEIGHT__;
    this.X_LAST = this.WIDTH - 1;
    this.Y_LAST = this.HEIGHT - 1;
    this.PX_WIDTH = core.__PX_WIDTH__;
    this.PX_HEIGHT = core.__PX_HEIGHT__;
    this.HALF_PX = this.PX_WIDTH / 2;
    this.HALF_PY = this.PX_HEIGHT / 2;

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

ui.prototype._createUIEvent = function () {
    if (main.mode == 'editor') return;
    if (!core.dymCanvas['uievent']) {
        core.createCanvas('uievent', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, 135);
    }
}

////// 清除地图 //////
ui.prototype.clearMap = function (name, x, y, width, height) {
    if (name == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].clearRect(-32, -32, core.canvas[m].canvas.width+32, core.canvas[m].canvas.height+32);
        }
        core.dom.gif.innerHTML = "";
        core.removeGlobalAnimate();
        core.deleteCanvas(function (one) { return one.startsWith('_bigImage_'); });
        core.setWeather(null);
    }
    else {
        var ctx = this.getContextByName(name);
        if (ctx) {
            if (x != null && y != null && width != null && height != null) {
                ctx.clearRect(x, y, width, height);
            } else {
                ctx.clearRect(-32, -32, ctx.canvas.width + 32, ctx.canvas.height + 32);
            }
        }
    }
}

ui.prototype._uievent_clearMap = function (data) {
    if (main.mode != 'editor' && (data.x == null || data.y == null || data.width == null || data.height == null)) {
        this.deleteCanvas('uievent');
        return;
    }
    this._createUIEvent();
    this.clearMap('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height));
}

////// 在某个canvas上绘制一段文字 //////
ui.prototype.fillText = function (name, text, x, y, style, font, maxWidth) {
    if (style) core.setFillStyle(name, style);
    if (font) core.setFont(name, font);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    text = (text + "").replace(/\\r/g, '\r');
    var originText = text.replace(/\r(\[.*\])?/g, "");
    var index = text.indexOf('\r');
    if (maxWidth != null) {
        this.setFontForMaxWidth(ctx, index >= 0 ? originText : text, maxWidth);
    }
    if (index >= 0) {
        var currentStyle = ctx.fillStyle;
        var textWidth = core.calWidth(ctx, originText);
        var textAlign = ctx.textAlign;
        if (textAlign == 'center') x -= textWidth / 2;
        else if (textAlign == 'right') x -= textWidth;
        ctx.textAlign = 'left';
        text = text.replace(/\r(?!\[.*\])/g, "\r[" + currentStyle + "]");
        var colorArray = text.match(/\r\[.*?\]/g);
        var textArray = text.split(/\r\[.*?\]/);
        var width = 0;
        for (var i = 0; i < textArray.length; i++) {
            var subtext = textArray[i];
            if (colorArray[i-1]) ctx.fillStyle = colorArray[i-1].slice(2, -1);
            ctx.fillText(subtext, x + width, y);
            width += core.calWidth(ctx, subtext, x, y);
        }
        ctx.textAlign = textAlign;
        ctx.fillStyle = currentStyle;
    } else {
        ctx.fillText(text, x, y);
    }
}

ui.prototype._uievent_fillText = function (data) {
    this._createUIEvent();
    this.fillText('uievent', core.replaceText(data.text), core.calValue(data.x), core.calValue(data.y), data.style, data.font, data.maxWidth);
}

////// 自适配字体大小
ui.prototype.setFontForMaxWidth = function (name, text, maxWidth, font) {
    var ctx = this.getContextByName(name);
    if (font) core.setFont(name, font);
    var font = ctx.font, u = /(\d+)px/.exec(font);
    if (u == null) return;
    for (var font_size = parseInt(u[1]); font_size >= 8; font_size--) {
        ctx.font = font.replace(/(\d+)px/, font_size+"px");
        if (ctx.measureText(text).width <= maxWidth) return;
    }
}

////// 在某个canvas上绘制粗体 //////
ui.prototype.fillBoldText = function (name, text, x, y, style, strokeStyle, font, maxWidth) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (font) ctx.font = font;
    if (!style) style = ctx.fillStyle;
    style = core.arrayToRGBA(style);
    if (!strokeStyle) strokeStyle = '#000000';
    strokeStyle = core.arrayToRGBA(strokeStyle);
    if (maxWidth != null) {
        this.setFontForMaxWidth(ctx, text, maxWidth);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = style;
    ctx.fillText(text, x, y);
}

ui.prototype._uievent_fillBoldText = function (data) {
    this._createUIEvent();
    this.fillBoldText('uievent', core.replaceText(data.text), core.calValue(data.x), core.calValue(data.y), data.style, data.strokeStyle, data.font);
}

////// 在某个canvas上绘制一个矩形 //////
ui.prototype.fillRect = function (name, x, y, width, height, style, angle) {
    if (style) core.setFillStyle(name, style);
    var ctx = this.getContextByName(name);
    if (ctx) {
        if (angle) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(angle);
            ctx.translate(-x - width / 2, -y - height / 2);
        }
        ctx.fillRect(x, y, width, height);
        if (angle) {
            ctx.restore();
        }
    }
}

ui.prototype._uievent_fillRect = function (data) {
    this._createUIEvent();
    if (data.radius) {
        this.fillRoundRect('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height), 
            core.calValue(data.radius), data.style, (core.calValue(data.angle) || 0) * Math.PI / 180);
    } else {
        this.fillRect('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height), 
            data.style, (core.calValue(data.angle) || 0) * Math.PI / 180);
    }
}

////// 在某个canvas上绘制一个矩形的边框 //////
ui.prototype.strokeRect = function (name, x, y, width, height, style, lineWidth, angle) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth) core.setLineWidth(name, lineWidth);
    var ctx = this.getContextByName(name);
    if (ctx) {
        if (angle) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(angle);
            ctx.translate(-x - width / 2, -y - height / 2);
        }
        ctx.strokeRect(x, y, width, height);
        if (angle) {
            ctx.restore();
        }
    }
}

ui.prototype._uievent_strokeRect = function (data) {
    this._createUIEvent();
    if (data.radius) {
        this.strokeRoundRect('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height), 
            core.calValue(data.radius), data.style, data.lineWidth, (core.calValue(data.angle) || 0) * Math.PI / 180);
    } else {
        this.strokeRect('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height), 
            data.style, data.lineWidth, (core.calValue(data.angle) || 0) * Math.PI / 180);
    }
}

////// 在某个canvas上绘制一个圆角矩形 //////
ui.prototype.fillRoundRect = function (name, x, y, width, height, radius, style, angle) {
    if (style) core.setFillStyle(name, style);
    var ctx = this.getContextByName(name);
    if (ctx) {
        if (angle) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(angle);
            ctx.translate(-x - width / 2, -y - height / 2);
        }
        this._roundRect_buildPath(ctx, x, y, width, height, radius);
        ctx.fill();
        if (angle) {
            ctx.restore();
        }
    }
}

////// 在某个canvas上绘制一个圆角矩形的边框 //////
ui.prototype.strokeRoundRect = function (name, x, y, width, height, radius, style, lineWidth, angle) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth) core.setLineWidth(name, lineWidth);
    var ctx = this.getContextByName(name);
    if (ctx) {
        if (angle) {
            ctx.save();
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(angle);
            ctx.translate(-x - width / 2, -y - height / 2);
        }
        this._roundRect_buildPath(ctx, x, y, width, height, radius);
        ctx.stroke();
        if (angle) {
            ctx.restore();
        }
    }
}

ui.prototype._roundRect_buildPath = function (ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

////// 在某个canvas上绘制一个多边形 //////
ui.prototype.fillPolygon = function (name, nodes, style) {
    if (style) core.setFillStyle(name, style);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (!nodes || nodes.length<3) return;
    ctx.beginPath();
    for (var i = 0; i < nodes.length; ++i) {
        var x = core.calValue(nodes[i][0]), y = core.calValue(nodes[i][1]);
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

ui.prototype._uievent_fillPolygon = function (data) {
    this._createUIEvent();
    this.fillPolygon('uievent', data.nodes, data.style);
}

////// 在某个canvas上绘制一个多边形的边框 //////
ui.prototype.strokePolygon = function (name, nodes, style, lineWidth) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth) core.setLineWidth(name, lineWidth);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (!nodes || nodes.length<3) return;
    ctx.beginPath();
    for (var i = 0; i < nodes.length; ++i) {
        var x = core.calValue(nodes[i][0]), y = core.calValue(nodes[i][1]);
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
}

ui.prototype._uievent_strokePolygon = function (data) {
    this._createUIEvent();
    this.strokePolygon('uievent', data.nodes, data.style, data.lineWidth);
}

////// 在某个canvas上绘制一个椭圆 //////
ui.prototype.fillEllipse = function (name, x, y, a, b, angle, style) {
    if (style) core.setFillStyle(name, style);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    ctx.beginPath();
    ctx.ellipse(x, y, a, b, angle, 0, 2*Math.PI);
    ctx.fill();
}

ui.prototype.fillCircle = function (name, x, y, r, style) {
    return this.fillEllipse(name, x, y, r, r, 0, style);
}

ui.prototype._uievent_fillEllipse = function (data) {
    this._createUIEvent();
    this.fillEllipse('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.a),
        core.calValue(data.b), (core.calValue(data.angle) || 0) * Math.PI / 180, data.style);
}

////// 在某个canvas上绘制一个圆的边框 //////
ui.prototype.strokeEllipse = function (name, x, y, a, b, angle, style, lineWidth) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth) core.setLineWidth(name, lineWidth);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    ctx.beginPath();
    ctx.ellipse(x, y, a, b, angle, 0, 2*Math.PI);
    ctx.stroke();
}

ui.prototype.strokeCircle = function (name, x, y, r, style, lineWidth) {
    return this.strokeEllipse(name, x, y, r, r, 0, style, lineWidth);
}

ui.prototype._uievent_strokeEllipse = function (data) {
    this._createUIEvent();
    this.strokeEllipse('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.a),
        core.calValue(data.b), (core.calValue(data.angle) || 0) * Math.PI / 180, data.style, data.lineWidth);
}

ui.prototype.fillArc = function (name, x, y, r, start, end, style) {
    if (style) core.setFillStyle(name, style);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, start, end);
    ctx.closePath();
    ctx.fill();
}

ui.prototype._uievent_fillArc = function (data) {
    this._createUIEvent();
    this.fillArc('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.r),
        (core.calValue(data.start) || 0) * Math.PI / 180, (core.calValue(data.end) || 0) * Math.PI / 180, data.style);
}

ui.prototype.strokeArc = function (name, x, y, r, start, end, style, lineWidth) {
    if (style) core.setStrokeStyle(name, style);
    if (lineWidth) core.setLineWidth(name, lineWidth);
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, r, start, end);
    ctx.stroke();
}

ui.prototype._uievent_strokeArc = function (data) {
    this._createUIEvent();
    this.strokeArc('uievent', core.calValue(data.x), core.calValue(data.y), core.calValue(data.r),
        (core.calValue(data.start) || 0) * Math.PI / 180, (core.calValue(data.end) || 0) * Math.PI / 180, data.style, data.lineWidth);
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

ui.prototype._uievent_drawLine = function (data) {
    this._createUIEvent();
    this.drawLine('uievent', core.calValue(data.x1), core.calValue(data.y1), core.calValue(data.x2), core.calValue(data.y2), data.style, data.lineWidth);
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

ui.prototype._uievent_drawArrow = function (data) {
    this._createUIEvent();
    this.drawArrow('uievent', core.calValue(data.x1), core.calValue(data.y1), core.calValue(data.x2), core.calValue(data.y2), data.style, data.lineWidth);
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

////// 设置某个canvas的alpha值，并返回设置之前的alpha值 //////
ui.prototype.setAlpha = function (name, alpha) {
    var ctx = this.getContextByName(name);
    if (!ctx) return null;
    var previousAlpha = ctx.globalAlpha;
    ctx.globalAlpha = alpha;
    return previousAlpha;
}

////// 设置某个canvas的透明度；尽量不要使用本函数，而是全部换成setAlpha实现 //////
ui.prototype.setOpacity = function (name, opacity) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.canvas.style.opacity = opacity;
}

////// 设置某个canvas的filter //////
ui.prototype.setFilter = function (name, filter) {
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    if (!filter) ctx.filter = 'none';
    else if (typeof filter === 'string') ctx.filter = filter;
    else {
        var x = [];
        if (filter.blur > 0) x.push('blur(' + filter.blur +'px)');
        if (filter.hue > 0) x.push('hue-rotate(' + filter.hue + 'deg)');
        if (filter.grayscale > 0) x.push('grayscale(' + filter.grayscale + ')');
        if (filter.invert) x.push('invert(1)');
        if (filter.shadow > 0) x.push('drop-shadow(0 0 ' + filter.shadow + 'px black)');
        if (x.length == 0) ctx.filter = 'none';
        else ctx.filter = x.join(' ');
    }
}

////// 设置某个canvas的绘制属性（如颜色等） //////
ui.prototype.setFillStyle = function (name, style) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.fillStyle = core.arrayToRGBA(style);
}

////// 设置某个canvas边框属性 //////
ui.prototype.setStrokeStyle = function (name, style) {
    var ctx = this.getContextByName(name);
    if (ctx) ctx.strokeStyle = core.arrayToRGBA(style);
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

ui.prototype._uievent_setAttribute = function (data) {
    this._createUIEvent();
    if (data.font) this.setFont('uievent', data.font);
    if (data.lineWidth) this.setLineWidth('uievent', data.lineWidth);
    if (data.alpha != null) this.setAlpha('uievent', data.alpha);
    if (data.fillStyle) this.setFillStyle('uievent', data.fillStyle);
    if (data.strokeStyle) this.setStrokeStyle('uievent', data.strokeStyle);
    if (data.align) this.setTextAlign('uievent', data.align);
    if (data.baseline) this.setTextBaseline('uievent', data.baseline);
    if (data.z != null && main.mode != 'editor') {
        var z = parseInt(data.z) || 135;
        core.dymCanvas.uievent.canvas.style.zIndex = z;
        if (core.dymCanvas._uievent_selector)
            core.dymCanvas._uievent_selector.canvas.style.zIndex = z + 1;
    }
}

ui.prototype._uievent_setFilter = function (data) {
    this._createUIEvent();
    this.setFilter('uievent',data);
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
    if (!ctx) return [text];
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
ui.prototype.drawImage = function (name, image, x, y, w, h, x1, y1, w1, h1, angle, reverse) {
    // 检测文件名以 :x, :y, :o 结尾，表示左右翻转，上下翻转和中心翻转
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    // var reverse = null;
    if (typeof image == 'string') {
        if (image.endsWith(':x') || image.endsWith(':y') || image.endsWith(':o')) {
            reverse = image.charAt(image.length - 1);
            image = image.substring(0, image.length - 2);
        }
        image = core.getMappedName(image);
        image = core.material.images.images[image];
        if (!image) return;
    }

    var scale = {
        'x': [-1, 1],
        'y': [1, -1],
        'o': [-1, -1]
    };

    // 只能接受2, 4, 8个参数
    if (x != null && y != null) {
        if (w == null || h == null) {
            // 两个参数变成四个参数
            w = image.width;
            h = image.height;
        }
        if (x1 != null && y1 != null && w1 != null && h1 != null) {
            if (!reverse && !angle) {
                ctx.drawImage(image, x, y, w, h, x1, y1, w1, h1);
            } else {
                ctx.save();
                ctx.translate(x1 + w1 / 2, y1 + h1 / 2);
                if (reverse) ctx.scale(scale[reverse][0], scale[reverse][1]);
                if (angle) ctx.rotate(angle);
                ctx.drawImage(image, x, y, w, h, -w1 / 2, -h1 / 2, w1, h1);
                ctx.restore();
            }
            return;
        }
        if (!reverse && !angle) {
            ctx.drawImage(image, x, y, w, h);
        } else {
            ctx.save();
            ctx.translate(x + w / 2, y + h / 2);
            if (reverse) ctx.scale(scale[reverse][0], scale[reverse][1]);
            if (angle) ctx.rotate(angle);
            ctx.drawImage(image, -w / 2, -h / 2, w, h);
            ctx.restore();
        }
        return;
    }
}

ui.prototype._uievent_drawImage = function (data) {
    this._createUIEvent();
    this.drawImage('uievent', data.image + (data.reverse || ''), core.calValue(data.x), core.calValue(data.y), core.calValue(data.w), core.calValue(data.h),
        core.calValue(data.x1), core.calValue(data.y1), core.calValue(data.w1), core.calValue(data.h1), (core.calValue(data.angle) || 0) * Math.PI / 180);
}

ui.prototype.drawIcon = function (name, id, x, y, w, h, frame) {
    frame = frame || 0;
    var ctx = this.getContextByName(name);
    if (!ctx) return;
    var info = core.getBlockInfo(id);
    if (!info) {
        // 检查状态栏图标
        if (core.statusBar.icons[id] instanceof Image)
            info = {image: core.statusBar.icons[id], posX: 0, posY: 0, height: 32};
        else return;
    }
    core.drawImage(ctx, info.image, 32 * (info.posX + frame), info.height * info.posY, 32, info.height, x, y, w || 32, h || info.height);
}

ui.prototype._uievent_drawIcon = function (data) {
    this._createUIEvent();
    var id;
    try {
        id = core.calValue(data.id);
        if (typeof id !== 'string') id = data.id;
    } catch (e) { id = data.id; }
    this.drawIcon('uievent', id, core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height), data.frame||0);
}

///////////////// UI绘制

////// 结束一切事件和绘制，关闭UI窗口，返回游戏进程 //////
ui.prototype.closePanel = function () {
    if (core.status.hero && core.status.hero.flags) {
        // 清除全部临时变量
        Object.keys(core.status.hero.flags).forEach(function (name) {
            if (name.startsWith("@temp@") || /^arg\d+$/.test(name)) {
                delete core.status.hero.flags[name];
            }
        });
    }
    this.clearUI();
    core.maps.generateGroundPattern();
    core.updateStatusBar(true);
    core.unlockControl();
    core.status.event.data = null;
    core.status.event.id = null;
    core.status.event.selection = null;
    core.status.event.ui = null;
    core.status.event.interval = null;
    // 清除onDownInterval
    clearInterval(core.interval.onDownInterval);
    core.interval.onDownInterval = 'tmp';
}

ui.prototype.clearUI = function () {
    core.status.boxAnimateObjs = [];
    core.deleteCanvas("_selector");
    main.dom.next.style.display = 'none';
    main.dom.next.style.opacity = 1;
    core.clearMap('ui');
    core.setAlpha('ui', 1);
    core.setOpacity('ui', 1);
    core.deleteCanvas('ui2');
}

////// 左上角绘制一段提示 //////
ui.prototype.drawTip = function (text, id, frame) {
    text = core.replaceText(text) || "";
    var realText = this._getRealContent(text);
    var one = {
        text: text,
        textX: 21,
        width: 26 + core.calWidth('data', realText, "16px Consolas"),
        opacity: 0.1,
        stage: 1,
        frame: frame || 0,
        time: 0
    };
    if (id != null) {
        var info = core.getBlockInfo(id);
        if (info == null || !info.image || info.bigImage) {
            // 检查状态栏图标
            if (core.statusBar.icons[id] instanceof Image) {
                info = {image: core.statusBar.icons[id], posX: 0, posY: 0, height: 32};
            }
            else info = null;
        }
        if (info != null) {
            one.image = info.image;
            one.posX = info.posX;
            one.posY = info.posY;
            one.height = info.height;
            one.textX += 24;
            one.width += 24;
        }
    }
    core.animateFrame.tip = one;
}

ui.prototype._drawTip_drawOne = function (tip) {
    core.setAlpha('data', tip.opacity);
    core.fillRect('data', 5, 5, tip.width, 42, '#000000');
    if (tip.image)
        core.drawImage('data', tip.image, (tip.posX + tip.frame) * 32, tip.posY * tip.height, 32, 32, 10, 10, 32, 32);
    core.fillText('data', tip.text, tip.textX, 33, '#FFFFFF');
    core.setAlpha('data', 1);
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
    if (typeof data == 'string') data = { "text": data };
    core.ui.drawTextBox(data.text, data);
}

ui.prototype._drawText_setContent = function (contents, callback) {
    // 合并进 insertAction
    if ((core.status.event && core.status.event.id=='action')
        || (!core.hasFlag('__replayText__') && core.isReplaying())) {
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
    var bigImage = null, face = null;
    content = content.replace(/(\t|\\t)\[(([^\],]+),)?([^\],]+)\]/g, function (s0, s1, s2, s3, s4) {
        if (s4) {
            if (s4 == 'hero') {
                title = core.status.hero.name;
                image = core.material.images.hero;
                icon = 0;
                var w = core.material.icons.hero.width || 32;
                height = 32 * core.material.icons.hero.height / w;
            }
            else if (s4.endsWith(".png")) {
                s4 = core.getMappedName(s4);
                image = core.material.images.images[s4];
            }
            else {
                var blockInfo = core.getBlockInfo(s4);
                if (blockInfo != null) {
                    if (blockInfo.name) title = blockInfo.name;
                    bigImage = blockInfo.bigImage;
                    face = blockInfo.face;
                    image = blockInfo.image;
                    icon = blockInfo.posY;
                    height = bigImage == null ? blockInfo.height : 32;
                    animate = blockInfo.animate;
                }
                else title = s4;
            }
        }
        if (s3 != null) {
            title = s3;
            if (title == 'null') title = null;
        }
        return "";
    });
    return {
        content: content,
        title: title,
        image: image,
        icon: icon,
        height: height,
        animate: animate,
        bigImage: bigImage,
        face: face,
    };
}

////// 正则处理 \b[up,xxx] 问题
ui.prototype._getPosition = function (content) {
    var pos = null, px = null, py = null, noPeak = false;
    if (core.status.event.id=='action') {
        px = core.status.event.data.x;
        py = core.status.event.data.y;
    }
    if (main.mode != 'play') {
        px = editor.pos.x;
        py = editor.pos.y;
    }
    content = content.replace("\b", "\\b")
        .replace(/\\b\[(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?]/g, function (s0, s1, s2, s3) {
            pos = s1;
            if (s3 == 'hero' || s1=='hero' && !s3) {
                px = core.getHeroLoc('x');
                py = core.getHeroLoc('y');
            }
            else if (s3 == 'null') {
                px = py = null;
            }
            else if (s3) {
                var str = s3.split(',');
                px = py = null;
                if (str.length == 1) {
                    var follower = core.status.hero.followers[parseInt(str[0])-1];
                    if (follower) {
                        px = follower.x;
                        py = follower.y;
                    }
                } else{
                    px = parseInt(str[0]);
                    py = parseInt(str[1]);
                    noPeak = core.getBlockId(px, py) == null;
                }
            }
            if(pos=='hero' || pos=='this'){
                pos = py==null?'center':(py>core.__HALF_HEIGHT__? 'up':'down'); 
            }
            return "";
        });
    return {content: content, position: pos, px: px, py: py, noPeak: noPeak};
}

////// 绘制系统选择光标
ui.prototype._drawWindowSelector = function(background, x, y, w, h) {
    w = Math.round(w), h = Math.round(h);
    var ctx = core.ui.createCanvas("_selector", x, y, w, h, 165);
    this._drawSelector(ctx, background, w, h);
}

////// 自绘一个选择光标
ui.prototype.drawUIEventSelector = function (code, background, x, y, w, h, z) {
    var canvasName = '_uievent_selector_' + (code || 0);
    var background = background || core.status.textAttribute.background;
    if (typeof background != 'string') return;
    if (main.mode == 'editor') {
        this._drawSelector('uievent', background, w, h, x, y);
        return;
    }
    z = z || (core.dymCanvas.uievent ? (parseInt(core.dymCanvas.uievent.canvas.style.zIndex) || 135) + 1 : 136);
    var ctx = core.createCanvas(canvasName, x, y, w, h, z);
    ctx.canvas.classList.add('_uievent_selector');
    this._drawSelector(ctx, background, w, h);
}

ui.prototype._uievent_drawSelector = function (data) {
    if (data.image == null) this.clearUIEventSelector(data.code || 0);
    else this.drawUIEventSelector(data.code, data.image, core.calValue(data.x), core.calValue(data.y), core.calValue(data.width), core.calValue(data.height));
}

////// 清除自绘的选择光标
ui.prototype.clearUIEventSelector = function (codes) {
    if (codes == null) {
        core.deleteCanvas(function (one) { return one.startsWith('_uievent_selector_'); })
        return;
    }
    if (codes instanceof Array) {
        codes.forEach(function (code) { core.ui.clearUIEventSelector(code); });
        return;
    }
    core.deleteCanvas('_uievent_selector_' + (codes || 0));
}

ui.prototype._drawSelector = function (ctx, background, w, h, left, top) {
    left = left || 0;
    top = top || 0;
    // back
    core.drawImage(ctx, background, 130, 66, 28, 28, left+2, top+2, w-4, h-4);
    // corner
    core.drawImage(ctx, background, 128, 64,  2,  2, left,  top,  2,  2);
    core.drawImage(ctx, background, 158, 64,  2,  2, left+w-2, top,  2,  2);
    core.drawImage(ctx, background, 128, 94,  2,  2, left, top+h-2,  2,  2);
    core.drawImage(ctx, background, 158, 94,  2,  2, left+w-2, top+h-2,  2,  2);
    // border
    core.drawImage(ctx, background, 130, 64, 28,  2, left+2, top, w-4,  2);
    core.drawImage(ctx, background, 130, 94, 28,  2, left+2, top+h-2, w-4,  2);
    core.drawImage(ctx, background, 128, 66,  2, 28, left,  top+2,  2,h-4);
    core.drawImage(ctx, background, 158, 66,  2, 28, left+w-2, top+2,  2,h-4);
}

////// 绘制 WindowSkin
ui.prototype.drawWindowSkin = function(background, ctx, x, y, w, h, direction, px, py) {
    background = background || core.status.textAttribute.background;
	// 仿RM窗口皮肤 ↓
    // 绘制背景
    core.drawImage(ctx, background, 0, 0, 128, 128, x+2, y+2, w-4, h-4);
    // 绘制边框
    // 上方
    core.drawImage(ctx, background, 128, 0,     16,     16,      x,      y,     16,     16);
    for (var dx = 0; dx < w - 64; dx += 32) {
        core.drawImage(ctx, background, 144, 0,     32,     16,x+dx+16,      y,     32,     16);
        core.drawImage(ctx, background, 144,48,     32,     16,x+dx+16, y+h-16,     32,     16);
    }
    core.drawImage(ctx, background, 144, 0,w-dx-32,     16,x+dx+16,      y,w-dx-32,     16);
    core.drawImage(ctx, background, 144,48,w-dx-32,     16,x+dx+16, y+h-16,w-dx-32,     16);
    core.drawImage(ctx, background, 176, 0,     16,     16, x+w-16,      y,     16,     16);
    // 左右
    for (var dy = 0; dy < h - 64; dy += 32) {
        core.drawImage(ctx, background, 128,16,     16,     32,      x,y+dy+16,     16,     32);
        core.drawImage(ctx, background, 176,16,     16,     32, x+w-16,y+dy+16,     16,     32);
    }
    core.drawImage(ctx, background, 128,16,     16,h-dy-32,      x,y+dy+16,     16,h-dy-32);
    core.drawImage(ctx, background, 176,16,     16,h-dy-32, x+w-16,y+dy+16,     16,h-dy-32);
    // 下方
    core.drawImage(ctx, background, 128,48,     16,     16,      x, y+h-16,     16,     16);
    core.drawImage(ctx, background, 176,48,     16,     16, x+w-16, y+h-16,     16,     16);

    // arrow
    if(px != null && py != null){
    	if(direction == 'up'){
    		core.drawImage(ctx, background,128,96,32,32,px,y+h-3,32,32);
    	}else if(direction == 'down') {
    		core.drawImage(ctx, background,160,96,32,32,px,y-29,32,32);
    	}
    }
    // 仿RM窗口皮肤 ↑
}

////// 绘制一个背景图，可绘制 winskin 或纯色背景；支持小箭头绘制
ui.prototype.drawBackground = function (left, top, right, bottom, posInfo) {
    posInfo = posInfo || {};
    var px = posInfo.px == null || posInfo.noPeak ? null : posInfo.px * 32 - core.bigmap.offsetX;
    var py = posInfo.py == null || posInfo.noPeak ? null : posInfo.py * 32 - core.bigmap.offsetY;
    var xoffset = posInfo.xoffset || 0, yoffset = posInfo.yoffset || 0;
    var background = core.status.textAttribute.background;

    if (this._drawBackground_drawWindowSkin(background, left, top, right, bottom, posInfo.position, px, py, posInfo.ctx))
        return true;
    if (typeof background == 'string') background = core.initStatus.textAttribute.background;
    this._drawBackground_drawColor(background, left, top, right, bottom, posInfo.position, px, py, xoffset, yoffset, posInfo.ctx);
    return false;
}

ui.prototype._uievent_drawBackground = function (data) {
    this._createUIEvent();
    var background = data.background || core.status.textAttribute.background;
    var x = core.calValue(data.x), y = core.calValue(data.y), w = core.calValue(data.width), h = core.calValue(data.height);
    if (typeof background == 'string') {
        this.drawWindowSkin(background, 'uievent', x, y, w, h);
    }
    else if (background instanceof Array) {
        this.fillRect('uievent', x, y, w, h, core.arrayToRGBA(background));
        this.strokeRect('uievent', x, y, w, h);
    }
}

ui.prototype._drawWindowSkin_getOpacity = function () {
    return core.getFlag("__winskin_opacity__", 0.85);
}

ui.prototype._drawBackground_drawWindowSkin = function (background, left, top, right, bottom, position, px, py, ctx) {
    ctx = ctx || 'ui';
    if (typeof background == 'string' && core.material.images.images[background]) {
        var image = core.material.images.images[background];
        if (image.width==192 && image.height==128) {
            core.setAlpha(ctx, this._drawWindowSkin_getOpacity());
            this.drawWindowSkin(image, ctx, left, top, right - left, bottom - top, position, px, py);
            core.setAlpha(ctx, 1);
            return true;
        }
    }
    return false;
}

ui.prototype._drawBackground_drawColor = function (background, left, top, right, bottom, position, px, py, xoffset, yoffset, ctx) {
    ctx = ctx || 'ui';
    var alpha = background[3];
    core.setAlpha(ctx, alpha);
    core.setStrokeStyle(ctx, core.arrayToRGBA(core.status.globalAttribute.borderColor));
    core.setFillStyle(ctx, core.arrayToRGB(background));
    core.setLineWidth(ctx, 2);
    // 绘制
    ctx = core.getContextByName(ctx);
    ctx.beginPath();
    ctx.moveTo(left, top);
    // 上边缘三角
    if (position == 'down' && px != null && py != null) {
        ctx.lineTo(px + xoffset, top);
        ctx.lineTo(px + 16, top - yoffset);
        ctx.lineTo(px + 32 - xoffset, top);
    }
    ctx.lineTo(right, top);
    ctx.lineTo(right, bottom);
    // 下边缘三角
    if (position == 'up' && px != null && py != null) {
        ctx.lineTo(px + 32 - xoffset, bottom);
        ctx.lineTo(px + 16, bottom + yoffset);
        ctx.lineTo(px + xoffset, bottom);
    }
    ctx.lineTo(left, bottom);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    core.setAlpha(ctx, 1);
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
    if (id && id.indexOf('flag:') === 0) {
        id = core.getFlag(id.substring(5), id);
    }
    id = core.getIdOfThis(id);
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

ui.prototype._buildFont = function (fontSize, bold, italic, font) {
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute,
        globalAttribute = core.status.globalAttribute || core.initStatus.globalAttribute;
    if (bold == null) bold = textAttribute.bold;
    return (bold?"bold ":"") + (italic?"italic ":"") + (fontSize || textAttribute.textfont) + "px " + (font || globalAttribute.font);
}

////// 绘制一段文字到某个画布上面
// ctx：要绘制到的画布
// content：要绘制的内容；转义字符目前只允许留 \n, \r[...], \i[...], \c[...], \d, \e
// config：绘制配置项，目前暂时包含如下内容（均为可选）
//         left, top：起始点位置；maxWidth：单行最大宽度；color：默认颜色；align：左中右
//         fontSize：字体大小；lineHeight：行高；time：打字机间隔；font：字体类型；letterSpacing：字符间距
ui.prototype.drawTextContent = function (ctx, content, config) {
    ctx = core.getContextByName(ctx);
    // 设置默认配置项
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute;
    var globalAttribute = core.status.globalAttribute || core.initStatus.globalAttribute;
    config = core.clone(config || {});
    config.left = config.left || 0;
    config.right = config.left + (config.maxWidth == null ? core.__PX_WIDTH__ : config.maxWidth)
    config.top = config.top || 0;
    config.color = core.arrayToRGBA(config.color || textAttribute.text);
    if (config.bold == null) config.bold = textAttribute.bold;
    config.italic = false;
    config.align = config.align || textAttribute.align || "left";
    config.fontSize = config.fontSize || textAttribute.textfont;
    config.lineHeight = config.lineHeight || (config.fontSize * 1.3);
    config.defaultFont = config.font = config.font || globalAttribute.font;
    config.time = config.time || 0;
    config.letterSpacing = config.letterSpacing == null ? (textAttribute.letterSpacing || 0) : config.letterSpacing;

    config.index = 0;
    config.currcolor = config.color;
    config.currfont = config.fontSize;
    config.lineMargin = Math.max(Math.round(config.fontSize / 4), config.lineHeight - config.fontSize);
    config.topMargin = parseInt(config.lineMargin / 2);
    config.lineMaxHeight = config.lineMargin + config.fontSize;
    config.offsetX = 0;
    config.offsetY = 0;
    config.line = 0;
    config.blocks = [];
    config.isHD = ctx != null && ctx.canvas.hasAttribute('isHD');

    // 创建一个新的临时画布
    var tempCtx = document.createElement('canvas').getContext('2d');
    if (config.isHD) {
        core.maps._setHDCanvasSize(tempCtx, ctx.canvas.width, ctx.canvas.height);
    } else {
        tempCtx.canvas.width = ctx==null?1:ctx.canvas.width;
        tempCtx.canvas.height = ctx==null?1:ctx.canvas.height;
    }
    tempCtx.textBaseline = 'top';
    tempCtx.font = this._buildFont(config.fontSize, config.bold, config.italic, config.font);
    tempCtx.fillStyle = config.color;
    config = this._drawTextContent_draw(ctx, tempCtx, content, config);
    return config;
}

ui.prototype._uievent_drawTextContent = function (data) {
    this._createUIEvent();
    data.left = core.calValue(data.left);
    data.top = core.calValue(data.top);
    this.drawTextContent('uievent', core.replaceText(data.text), data);
}

// 绘制的基本逻辑：
// 1. 一个个字符绘制到对应画布上（靠左对齐）；这个过程中，记下来每个字对应的方块 [x, y, w, h]
// 2. 每次换行时，计算当前行的宽度，然后如果是居中或者靠右对齐，则对当前行的每个小方块增加偏移量
// 3. 实际绘制时，从临时画布直接将一个个小方块绘制到目标画布上，一次全部绘制，或者打字机效果一个个绘制
ui.prototype._drawTextContent_draw = function (ctx, tempCtx, content, config) {
    // Step 1: 绘制到tempCtx上，并记录下图块信息
    while (this._drawTextContent_next(tempCtx, content, config));

    if (ctx == null) return config;

    // Step 2: 从tempCtx绘制到画布上
    config.index = 0;
    var _drawNext = function () {
        if (config.index >= config.blocks.length) return false;
        var block = config.blocks[config.index++];
        if (block != null) {
            var ratio = config.isHD ? core.domStyle.ratio : 1;
            core.drawImage(ctx, tempCtx.canvas, block.left * ratio, block.top * ratio, block.width * ratio, block.height * ratio,
                config.left + block.left + block.marginLeft, config.top + block.top + block.marginTop,
                block.width, block.height);
        }
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

    return config;
}

ui.prototype._drawTextContent_next = function (tempCtx, content, config) {
    if (config.index >= content.length) {
        this._drawTextContent_newLine(tempCtx, config);
        return false;
    }
    // get next character
    var ch = content.charAt(config.index);
    var code = content.charCodeAt(config.index++);
    while (code >= 0xD800 && code <= 0xDBFF) {
        ch += content.charAt(config.index);
        code = content.charCodeAt(config.index++);
    }
    return this._drawTextContent_drawChar(tempCtx, content, config, ch);
}

// 绘制下一个字符
ui.prototype._drawTextContent_drawChar = function (tempCtx, content, config, ch) {
    // 标点禁则：不能在行首的标点
    var forbidStart = "）)】》＞﹞>)]»›〕〉}］」｝〗』" + "，。？！：；·…,.?!:;、……~&@#～＆＠＃";
    // 标点禁则：不能在行尾的标点
    var forbidEnd = "（(【《＜﹝<([«‹〔〈{［「｛〖『";

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
    if (ch == '\\') {
        var c = content.charAt(config.index);
        if (c == 'i') return this._drawTextContent_drawIcon(tempCtx, content, config);
        if (c == 'c') return this._drawTextContent_changeFontSize(tempCtx, content, config);
        if (c == 'd' || c == 'e') {
            config.index++;
            if (c == 'd') config.bold = !config.bold;
            if (c == 'e') config.italic = !config.italic;
            tempCtx.font = this._buildFont(config.currfont, config.bold, config.italic, config.font);
            return true;
        }
        if (c == 'g') return this._drawTextContent_changeFont(tempCtx, content, config);
        if (c == 'z') return this._drawTextContent_emptyChar(tempCtx, content, config);
    }
    // 检查是不是自动换行
    var charwidth = core.calWidth(tempCtx, ch) + config.letterSpacing;
    if (config.maxWidth != null) {
        if (config.offsetX + charwidth > config.maxWidth) {
            // --- 当前应当换行，然而还是检查一下是否是forbidStart
            if (!config.forceChangeLine && forbidStart.indexOf(ch) >= 0) {
                config.forceChangeLine = true;
            } else {
                this._drawTextContent_newLine(tempCtx, config);
                config.index-=ch.length;
                return this._drawTextContent_next(tempCtx, content, config);
            }
        } else if (forbidEnd.indexOf(ch) >= 0 && config.index < content.length) {
            // --- 当前不应该换行；但是提前检查一下是否是行尾标点
            var nextch = content.charAt(config.index);
            // 确认不是手动换行
            if (nextch != '\n' && !(nextch == '\\' && content.charAt(config.index+1) == 'n')) {
                // 检查是否会换行
                var nextchwidth = core.calWidth(tempCtx, nextch) + config.letterSpacing;
                if (config.offsetX + charwidth + nextchwidth > config.maxWidth) {
                    // 下一项会换行，因此在此处换行
                    this._drawTextContent_newLine(tempCtx, config);
                    config.index-=ch.length;
                    return this._drawTextContent_next(tempCtx, content, config);
                }
            }
        }
    }

    // 输出
    var left = config.offsetX, top = config.offsetY + config.topMargin;
    core.fillText(tempCtx, ch, left, top);
    config.blocks.push({left: config.offsetX, top: config.offsetY,
        width: charwidth, height: config.currfont + config.lineMargin,
        line: config.line, marginLeft: 0});
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
        if (b == null) return;
        if (b.line == config.line) {
            b.marginLeft = marginLeft;
            // b.marginTop = 0; // 上对齐
            b.marginTop = (config.lineMaxHeight - b.height) / 2; // 居中对齐
            // b.marginTop = config.lineMaxHeight - b.height; // 下对齐
        }
    });

    config.offsetX = 0;
    config.offsetY += config.lineMaxHeight;
    config.lineMaxHeight = config.currfont + config.lineMargin;
    config.line++;
    config.forceChangeLine = false;
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

ui.prototype._drawTextContent_changeFontSize = function (tempCtx, content, config) {
    config.index++;
    // 检查是不是 []
    var index = config.index, index2;
    if (content.charAt(index) == '[' && ((index2=content.indexOf(']', index))>=0)) {
        var str = content.substring(index+1, index2);
        if (!/^\d+$/.test(str)) config.currfont = config.fontSize;
        else config.currfont = parseInt(str);
        config.index = index2 + 1;
    }
    else config.currfont = config.fontSize;
    config.lineMaxHeight = Math.max(config.lineMaxHeight, config.currfont + config.lineMargin);
    tempCtx.font = this._buildFont(config.currfont, config.bold, config.italic, config.font);
    return this._drawTextContent_next(tempCtx, content, config);
}

ui.prototype._drawTextContent_changeFont = function (tempCtx, content, config) {
    config.index++;
    // 检查是不是 []
    var index = config.index, index2;
    if (content.charAt(index) == '[' && ((index2=content.indexOf(']', index))>=0)) {
        var str = content.substring(index+1, index2);
        if (str=="") config.font = config.defaultFont;
        else config.font = str;
        config.index = index2 + 1;
    } else config.font = config.defaultFont;
    tempCtx.font = this._buildFont(config.currfont, config.bold, config.italic, config.font);
    return this._drawTextContent_next(tempCtx, content, config);
}

ui.prototype._drawTextContent_emptyChar = function (tempCtx, content, config) {
    config.index++;
    var index = config.index, index2;
    if (content.charAt(index) == '[' && ((index2=content.indexOf(']', index))>=0)) {
        var str = content.substring(index+1, index2);
        if (/^\d+$/.test(str)) {
            var value = parseInt(str);
            for (var i = 0; i < value; ++i) {
                config.blocks.push(null); // Empty char
            }
        } else config.blocks.push(null);
        config.index = index2 + 1;
    }
    else config.blocks.push(null);
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
        var width = config.currfont + 2, left = config.offsetX + 2, top = config.offsetY + config.topMargin - 1;
        if (config.maxWidth != null && left + width > config.maxWidth) {
            this._drawTextContent_newLine(tempCtx, config);
            config.index--;
            return this._drawTextContent_next(tempCtx, content, config);
        }
        // 绘制到画布上
        core.drawImage(tempCtx, image, 0, 32*icon, 32, 32, left, top, width, width);

        config.blocks.push({left: left, top: config.offsetY,
            width: width, height: width + config.lineMargin,
            line: config.line, marginLeft: 0});

        config.offsetX += width + 6;
        config.index = index2 + 1;
        return true;
    }
    return this._drawTextContent_next(tempCtx, content, config);
}

ui.prototype.getTextContentHeight = function (content, config) {
    return this.drawTextContent(null, content, config).offsetY;
}

ui.prototype._getRealContent = function (content) {
    return content.replace(/(\r|\\(r|c|d|e|g|z))(\[.*?])?/g, "").replace(/(\\i)(\[.*?])?/g, "占1");
}

ui.prototype._animateUI = function (type, ctx, callback) {
    ctx = ctx || 'ui';
    var time = core.status.textAttribute.animateTime || 0;
    if (!core.status.event || !time || core.isReplaying() || (type != 'show' && type != 'hide')) {
        if (callback) callback();
        return;
    }
    clearInterval(core.status.event.animateUI);
    var opacity = 0;
    if (type == 'show') {
        opacity = 0;
    } else if (type == 'hide') {
        opacity = 1;
    }
    core.setOpacity(ctx, opacity);
    core.dom.next.style.opacity = opacity;
    core.status.event.animateUI = setInterval(function () {
        if (type == 'show') opacity += 0.05;
        else opacity -= 0.05;
        core.setOpacity(ctx, opacity);
        core.dom.next.style.opacity = opacity;
        if (opacity >= 1 || opacity <= 0) {
            clearInterval(core.status.event.animateUI);
            delete core.status.event.animateUI;
            if (callback) callback();
        }
    }, time / 20);
}

////// 绘制一个对话框 //////
ui.prototype.drawTextBox = function(content, config) {
    config = config || {};

    this.clearUI();
    content = core.replaceText(content);

    var ctx = config.ctx || null;
    if (ctx && main.mode == 'play') {
        core.createCanvas(ctx, 0, 0, core.__PX_WIDTH__, core.__PX_HEIGHT__, 141);
        ctx = core.getContextByName(ctx);
    }

    // Step 1: 获得标题信息和位置信息
    var textAttribute = core.status.textAttribute;
    var titleInfo = this._getTitleAndIcon(content);
    var posInfo = this._getPosition(titleInfo.content);
    if (posInfo.position != 'up' && posInfo.position != 'down') posInfo.px = posInfo.py = null;
    if (!posInfo.position) posInfo.position = textAttribute.position;
    content = this._drawTextBox_drawImages(posInfo.content, config.ctx);
    if (config.pos) {
        delete posInfo.px;
        delete posInfo.py;
        posInfo.pos = config.pos;
    }
    posInfo.ctx = ctx;

    // Step 2: 计算对话框的矩形位置
    var hPos = this._drawTextBox_getHorizontalPosition(content, titleInfo, posInfo);
    var vPos = this._drawTextBox_getVerticalPosition(content, titleInfo, posInfo, hPos.validWidth);
    posInfo.xoffset = hPos.xoffset;
    posInfo.yoffset = vPos.yoffset - 4;

    if (ctx && main.mode == 'play') {
        ctx.canvas.setAttribute('_text_left', hPos.left);
        ctx.canvas.setAttribute('_text_top', vPos.top);
    }

    // Step 3: 绘制背景图
    var isWindowSkin = this.drawBackground(hPos.left, vPos.top, hPos.right, vPos.bottom, posInfo);
    var alpha = isWindowSkin ? this._drawWindowSkin_getOpacity() : textAttribute.background[3];

    // Step 4: 绘制标题、头像、动画
    var content_top = this._drawTextBox_drawTitleAndIcon(titleInfo, hPos, vPos, alpha, config.ctx);

    // Step 5: 绘制正文
    var config = this.drawTextContent(config.ctx || 'ui', content, {
        left: hPos.content_left, top: content_top, maxWidth: hPos.validWidth,
        lineHeight: vPos.lineHeight, time: (config.showAll || config.async || textAttribute.time<=0 || core.status.event.id!='action')?0:textAttribute.time
    });

    // Step 6: 绘制光标
    if (main.mode == 'play') {
        main.dom.next.style.display = 'block';
        main.dom.next.style.borderRightColor = main.dom.next.style.borderBottomColor = core.arrayToRGB(textAttribute.text);
        main.dom.next.style.top = (vPos.bottom - 20) * core.domStyle.scale + "px";
        var left = (hPos.left + hPos.right) / 2;
        if (posInfo.position == 'up' && !posInfo.noPeak && posInfo.px != null && Math.abs(posInfo.px * 32 + 16 - left) < 50)
            left = hPos.right - 64;
        main.dom.next.style.left = left * core.domStyle.scale + "px";
    }
    return config;
}

ui.prototype._drawTextBox_drawImages = function (content, ctx) {
    ctx = ctx || 'ui';
    return content.replace(/(\f|\\f)\[(.*?)]/g, function (text, sympol, str) {
        var ss = str.split(",");
        // 绘制
        if (ss.length==3)
            core.drawImage(ctx, ss[0], parseFloat(ss[1]), parseFloat(ss[2]));
        else if (ss.length==5)
            core.drawImage(ctx, ss[0], parseFloat(ss[1]), parseFloat(ss[2]), parseFloat(ss[3]), parseFloat(ss[4]));
        else if (ss.length >= 9) {
            if (ss.length >= 10) core.setAlpha(ctx, parseFloat(ss[9]));
            var angle = (parseFloat(ss[10]) || 0) * Math.PI / 180;
            core.drawImage(ctx, ss[0], parseFloat(ss[1]), parseFloat(ss[2]), parseFloat(ss[3]), parseFloat(ss[4]), 
                parseFloat(ss[5]), parseFloat(ss[6]), parseFloat(ss[7]), parseFloat(ss[8]), angle);
            core.setAlpha(ctx, 1);
        }
        return "";
    });
}

ui.prototype._drawTextBox_getHorizontalPosition = function (content, titleInfo, posInfo) {
    var ctx = posInfo.ctx || 'ui';
    var realContent = this._getRealContent(content);
    var paddingLeft = 25, paddingRight = 12;
    if ((posInfo.px != null && posInfo.py != null) || posInfo.pos) paddingLeft = 20;
    if (titleInfo.icon != null) paddingLeft = 62; // 15 + 32 + 15
    else if (titleInfo.image) paddingLeft = 90; // 10 + 70 + 10
    var left = 7 + 3 * (this.H_WIDTH - 6), right = this.PX_WIDTH - left,
        width = right - left, validWidth = width - paddingLeft - paddingRight;
    // 对话框效果：改为动态计算
    if ((posInfo.px != null && posInfo.py != null) || posInfo.pos) {
        var min_width = 220 - paddingLeft, max_width = validWidth;
        // 无行走图或头像，则可以适当缩小min_width
        if (titleInfo.image == null) min_width = 160;
        if (titleInfo.title) {
            min_width = core.clamp(core.calWidth(ctx, titleInfo.title, this._buildFont(core.status.textAttribute.titlefont, true)), min_width, max_width);
        }
        if (posInfo.pos) {
            left = core.calValue(posInfo.pos[0]) || 0;
            max_width = Math.max(min_width, right - left - paddingLeft - paddingRight);
        } else left = null;
        if (posInfo.pos && posInfo.pos[2] != null) {
            width = core.calValue(posInfo.pos[2]) || 0;
            min_width = validWidth = width - paddingLeft - paddingRight;
        } else validWidth = 0;
        if (validWidth < min_width) {
            validWidth = this._calTextBoxWidth('ui', realContent, min_width, max_width, this._buildFont());
            width = validWidth + paddingLeft + paddingRight;
        }
        if (left == null) left = core.clamp(32 * posInfo.px + 16 - width / 2 - core.bigmap.offsetX, left, right - width);
        right = left + width;
    }
    return { left: left, right: right, width: width, validWidth: validWidth, xoffset: 11, content_left: left + paddingLeft };
}

ui.prototype._drawTextBox_getVerticalPosition = function (content, titleInfo, posInfo, validWidth) {
    var textAttribute = core.status.textAttribute || core.initStatus.textAttribute;
    var lineHeight = textAttribute.lineHeight || (textAttribute.textfont + 6);
    var height = 45 + this.getTextContentHeight(content, {
        lineHeight: lineHeight, maxWidth: validWidth
    });
    if (titleInfo.title) height += textAttribute.titlefont + 5;
    if (titleInfo.icon != null) {
        if (titleInfo.title) height = Math.max(height, titleInfo.height+50);
        else height = Math.max(height, titleInfo.height + 30);
    }
    else if (titleInfo.image)
        height = Math.max(height, 90);

    var yoffset = 16;
    var top = parseInt((this.PX_HEIGHT - height) / 2);
    switch (posInfo.position) {
        case 'center': top = parseInt((this.PX_HEIGHT - height) / 2); break;
        case 'up':
            if (posInfo.px==null || posInfo.py==null)
                top = 5 + textAttribute.offset;
            else
                top = 32 * posInfo.py - height - (titleInfo.height - 32) - yoffset - core.bigmap.offsetY;
            break;
        case 'down':
            if (posInfo.px==null || posInfo.py==null)
                top = this.PX_HEIGHT - height - 5 - textAttribute.offset;
            else {
                top = 32 * posInfo.py + 32 + yoffset - core.bigmap.offsetY;
            }
    }
    if (posInfo.pos) {
        top = core.calValue(posInfo.pos[1]) || 0;
    }

    return { top: top, height: height, bottom: top + height, yoffset: yoffset, lineHeight: lineHeight };
}

ui.prototype._drawTextBox_drawTitleAndIcon = function (titleInfo, hPos, vPos, alpha, ctx) {
    ctx = ctx || 'ui';
    core.setTextAlign(ctx, 'left');
    var textAttribute = core.status.textAttribute;
    var content_top = vPos.top + 15;
    var image_top = vPos.top + 15;
    if (titleInfo.title != null) {
        var titlefont = textAttribute.titlefont;
        content_top += titlefont + 5;
        image_top = vPos.top + 40;
        core.setFillStyle(ctx, core.arrayToRGB(textAttribute.title));
        core.setStrokeStyle(ctx, core.arrayToRGB(textAttribute.title));

        // --- title也要居中或者右对齐？
        var title_width = core.calWidth(ctx, titleInfo.title, this._buildFont(titlefont, true));
        var title_left = hPos.content_left;
        if (textAttribute.align == 'center')
            title_left = hPos.left + (hPos.width - title_width) / 2;
        else if (textAttribute.align == 'right')
            title_left = hPos.right - title_width - 12;

        core.fillText(ctx, titleInfo.title, title_left, vPos.top + 8 + titlefont);
    }
    if (titleInfo.icon != null) {
        core.setAlpha(ctx, alpha);
        core.strokeRect(ctx, hPos.left + 15 - 1, image_top-1, 34, titleInfo.height + 2, null, 2);
        core.setAlpha(ctx, 1);
        core.status.boxAnimateObjs = [];
        // --- 勇士
        if (titleInfo.image == core.material.images.hero) {
            if (core.status.hero.animate) {
                var direction = core.getHeroLoc('direction');
                if (direction == 'up') direction = 'down';
                core.status.boxAnimateObjs.push({
                    'bgx': hPos.left + 15, 'bgy': image_top, 'bgWidth': 32, 'bgHeight': titleInfo.height,
                    'x': hPos.left + 15, 'y': image_top, 'height': titleInfo.height, 'animate': 4,
                    'image': titleInfo.image, 'pos': core.material.icons.hero[direction].loc * titleInfo.height, ctx: ctx,
                })
            } else {
                core.clearMap(ctx, hPos.left + 15, image_top, 32, titleInfo.height);
                core.fillRect(ctx, hPos.left + 15, image_top, 32, titleInfo.height, core.material.groundPattern);
                core.drawImage(ctx, titleInfo.image, 0, 0, core.material.icons.hero.width || 32, core.material.icons.hero.height,
                    hPos.left + 15, image_top, 32, titleInfo.height);
            }            
        }
        else {
            if (titleInfo.bigImage) {
                core.status.boxAnimateObjs.push({
                    bigImage: titleInfo.bigImage, face: titleInfo.face, centerX: hPos.left + 15 + 16,
                    centerY: image_top + titleInfo.height / 2, max_width: 50, ctx: ctx
                });
            } else {
                core.status.boxAnimateObjs.push({
                    'bgx': hPos.left + 15, 'bgy': image_top, 'bgWidth': 32, 'bgHeight': titleInfo.height,
                    'x': hPos.left + 15, 'y': image_top, 'height': titleInfo.height, 'animate': titleInfo.animate,
                    'image': titleInfo.image, 'pos': titleInfo.icon * titleInfo.height, ctx: ctx,
                });
            }
        }
        core.drawBoxAnimate();
    }
    if (titleInfo.image != null && titleInfo.icon == null) { // 头像图
        core.drawImage(ctx, titleInfo.image, 0, 0, titleInfo.image.width, titleInfo.image.height,
            hPos.left+10, vPos.top+10, 70, 70);
    }
    return content_top;
}

ui.prototype._createTextCanvas = function (content, lineHeight) {
    var width = this.PX_WIDTH, height = 30 + this.getTextContentHeight(content, {lineHeight: lineHeight});
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
    if (obj.align == 'right') obj.left = this.PX_WIDTH - offset;
    else if (obj.align != 'center') obj.left = offset;
    this.drawTextContent(ctx, content, obj);
    this._drawScrollText_animate(ctx, time, callback);
}

ui.prototype._drawScrollText_animate = function (ctx, time, callback) {
    // 开始绘制到UI上
    time /= Math.max(core.status.replay.speed, 1)
    var per_pixel = 1, height = ctx.canvas.height, per_time = time * per_pixel / (this.PX_HEIGHT+height);
    var currH = this.PX_HEIGHT;
    core.drawImage('ui', ctx.canvas, 0, currH);
    var animate = setInterval(function () {
        core.clearMap('ui');
        currH -= per_pixel;
        if (currH < -height) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            if (callback) callback();
            return;
        }
        core.drawImage('ui', ctx.canvas, 0, currH);
    }, per_time);

    core.animateFrame.lastAsyncId = animate;
    core.animateFrame.asyncId[animate] = callback;
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
ui.prototype.drawChoices = function(content, choices, width, ctx) {
    choices = core.clone(choices || []);

    core.status.event.ui = {"text": content, "choices": choices, "width": width};
    this.clearUI();

    content = core.replaceText(content || "");
    var titleInfo = this._getTitleAndIcon(content);
    titleInfo.content = this._drawTextBox_drawImages(titleInfo.content, ctx);
    var hPos = this._drawChoices_getHorizontalPosition(titleInfo, choices, width, ctx);
    var vPos = this._drawChoices_getVerticalPosition(titleInfo, choices, hPos);
    core.status.event.ui.offset = vPos.offset;

    var isWindowSkin = this.drawBackground(hPos.left, vPos.top, hPos.right, vPos.bottom, {ctx: ctx});
    this._drawChoices_drawTitle(titleInfo, hPos, vPos, ctx);
    this._drawChoices_drawChoices(choices, isWindowSkin, hPos, vPos, ctx);
}

ui.prototype._drawChoices_getHorizontalPosition = function (titleInfo, choices, width, ctx) {
    ctx = ctx || 'ui';
    // 宽度计算：考虑提示文字和选项的长度
    core.setFont(ctx, this._buildFont(17, true));
    var width = this._calTextBoxWidth(ctx, titleInfo.content || "", width || (core.__UNIT__ * this.H_HEIGHT), this.PX_WIDTH - 20);
    for (var i = 0; i < choices.length; i++) {
        if (typeof choices[i] === 'string')
            choices[i] = {"text": choices[i]};
        choices[i].text = core.replaceText(choices[i].text);
        choices[i].width = core.calWidth(ctx, core.replaceText(choices[i].text));
        if (choices[i].icon != null) choices[i].width += 28;
        width = Math.max(width, choices[i].width+30);
    }
    var left = (this.PX_WIDTH - width) / 2, right = left + width;
    var content_left = left + (titleInfo.icon == null ? 15: 60), validWidth = right - content_left - 10;

    return { left: left, right: right, width: width, content_left: content_left, validWidth: validWidth };
}

ui.prototype._drawChoices_getVerticalPosition = function (titleInfo, choices, hPos) {
    var length = choices.length;
    var height = 32 * (length + 2), bottom = this.HALF_PY + height / 2;
    if (length % 2 == 0) bottom += 16;
    var offset = 0;
    var choice_top = bottom - height + 56;
    if (titleInfo.content) {
        var headHeight = 0;
        if (titleInfo.title) headHeight += 25;
        headHeight += this.getTextContentHeight(titleInfo.content, {
            lineHeight: 20, maxWidth: hPos.validWidth, fontSize: 15, bold: true
        });
        height += headHeight;
        if (bottom - height <= 32) {
            offset = Math.floor(headHeight / 64);
            bottom += 32 * offset;
            choice_top += 32 * offset;
        }
    }
    return {top: bottom - height, height: height, bottom: bottom, choice_top: choice_top, offset: offset };
}

ui.prototype._drawChoices_drawTitle = function (titleInfo, hPos, vPos, ctx) {
    if (!titleInfo.content) return;
    ctx = ctx || 'ui';
    var content_top = vPos.top + 21;
    if (titleInfo.title != null) {
        core.setTextAlign(ctx, 'center');

        content_top = vPos.top + 41;
        var title_offset = hPos.left+hPos.width/2;
        // 动画

        if (titleInfo.icon != null) {
            title_offset += 12;
            core.strokeRect(ctx, hPos.left + 15 - 1, vPos.top + 30 - 1, 34, titleInfo.height + 2, '#DDDDDD', 2);
            core.status.boxAnimateObjs = [];
            if (titleInfo.bigImage) {
                core.status.boxAnimateObjs.push({
                    bigImage: titleInfo.bigImage, face: titleInfo.face, centerX: hPos.left + 15 + 16,
                    centerY: vPos.top + 30 + titleInfo.height / 2, max_width: 50, ctx: ctx
                });
            } else {
                core.status.boxAnimateObjs.push({
                    'bgx': hPos.left + 15, 'bgy': vPos.top + 30, 'bgWidth': 32, 'bgHeight': titleInfo.height,
                    'x': hPos.left + 15, 'y': vPos.top + 30, 'height': titleInfo.height, 'animate': titleInfo.animate,
                    'image': titleInfo.image, 'pos': titleInfo.icon * titleInfo.height, ctx: ctx
                });
            }
            core.drawBoxAnimate();
        };

        core.fillText(ctx, titleInfo.title, title_offset, vPos.top + 27,
            core.arrayToRGBA(core.status.textAttribute.title), this._buildFont(19, true));
    }

    core.setTextAlign(ctx, 'left');
    this.drawTextContent(ctx, titleInfo.content, {
        left: hPos.content_left, top: content_top, maxWidth: hPos.validWidth,
        fontSize: 15, lineHeight: 20, bold: true
    });
}

ui.prototype._drawChoices_drawChoices = function (choices, isWindowSkin, hPos, vPos, ctx) {
    var hasCtx = ctx != null;
    ctx = ctx || 'ui';
    // 选项
    core.setTextAlign(ctx, 'center');
    core.setFont(ctx, this._buildFont(17, true));
    for (var i = 0; i < choices.length; i++) {
        var color = core.arrayToRGBA(choices[i].color || core.status.textAttribute.text);
        if (main.mode == 'play' && choices[i].need != null && choices[i].need != '' && !core.calValue(choices[i].need)) color = '#999999';
        core.setFillStyle(ctx, color);
        var offset = this.HALF_PX;
        if (choices[i].icon) {
            var iconInfo = this._getDrawableIconInfo(choices[i].icon), image = iconInfo[0], icon = iconInfo[1];
            if (image != null) {
                core.drawImage(ctx, image, 0, 32 * icon, 32, 32,
                    this.HALF_PX - choices[i].width/2, vPos.choice_top + 32*i - 17, 22, 22);
                offset += 14;
            }
        }
        core.fillText(ctx, choices[i].text, offset, vPos.choice_top + 32 * i, color);
    }

    if (choices.length>0 && core.status.event.selection != 'none') {
        core.status.event.selection = core.status.event.selection || 0;
        while (core.status.event.selection < 0) core.status.event.selection += choices.length;
        while (core.status.event.selection >= choices.length) core.status.event.selection -= choices.length;
        var len = choices[core.status.event.selection].width;
        if (isWindowSkin) {
            if (hasCtx) {
                this._drawSelector(ctx, core.status.textAttribute.background,
                    len + 10, 28, this.HALF_PX - len/2 - 5, vPos.choice_top + 32 * core.status.event.selection - 20);
            } else {
                this._drawWindowSelector(core.status.textAttribute.background,
                    this.HALF_PX - len/2 - 5, vPos.choice_top + 32 * core.status.event.selection - 20, len + 10, 28);
            }
        }
        else
            core.strokeRoundRect(ctx, this.HALF_PX - len/2 - 5, vPos.choice_top + 32 * core.status.event.selection - 20,
                len+10, 28, 6, core.status.globalAttribute.selectColor, 2);
    }
}

////// 绘制一个确认/取消的警告页面 //////
ui.prototype.drawConfirmBox = function (text, yesCallback, noCallback, ctx) {
    var hasCtx = ctx != null;
    ctx = ctx || 'ui';
    text = core.replaceText(text || "");

    if (main.mode == 'play') {
        core.lockControl();

        // 处理自定义事件
        if (core.status.event.id != 'action') {
            core.status.event.id = 'confirmBox';
            core.status.event.ui = text;
            core.status.event.data = {'yes': yesCallback, 'no': noCallback};
        }
    }

    if (core.status.event.selection != 0 && core.status.event.selection != 'none') core.status.event.selection = 1;
    this.clearUI();

    core.setFont(ctx, this._buildFont(19, true));
    var contents = text.split("\n");
    var rect = this._drawConfirmBox_getRect(contents, ctx);
    var isWindowSkin = this.drawBackground(rect.left, rect.top, rect.right, rect.bottom, {ctx: ctx});

    core.setTextAlign(ctx, 'center');
    core.setFillStyle(ctx, core.arrayToRGBA(core.status.textAttribute.text))
    for (var i in contents) {
        core.fillText(ctx, contents[i], this.HALF_PX, rect.top + 50 + i*30);
    }

    core.fillText(ctx, "YES", this.HALF_PX - 38, rect.bottom - 35, null, this._buildFont(17, true));
    core.fillText(ctx, "NO", this.HALF_PX + 38, rect.bottom - 35);
    if (core.status.event.selection != 'none') {
        var len=core.calWidth(ctx, "确定");
        var strokeLeft = this.HALF_PX + (76*core.status.event.selection-38) - parseInt(len/2) - 5;
    
        if (isWindowSkin) {
            if (hasCtx) {
                this._drawSelector(ctx, core.status.textAttribute.background,
                    len + 10, 28, strokeLeft, rect.bottom-35-20);
            } else {
                this._drawWindowSelector(core.status.textAttribute.background, strokeLeft, rect.bottom-35-20, len+10, 28);
            }
        }
        else
            core.strokeRoundRect(ctx, strokeLeft, rect.bottom-35-20, len+10, 28, 6, core.status.globalAttribute.selectColor, 2);
    }
}

ui.prototype._drawConfirmBox_getRect = function (contents, ctx) {
    var max_width = contents.reduce(function (pre, curr) {
        return Math.max(pre, core.calWidth(ctx, curr));
    }, 0);
    var left = Math.min(this.HALF_PX - 40 - parseInt(max_width / 2), this.PX_WIDTH / 3), right = this.PX_WIDTH - left;
    var top = this.HALF_PY - 68 - (contents.length-1)*30, bottom = this.HALF_PY + 68;
    return { top: top, left: left, bottom: bottom, right: right, width: right - left, height: bottom - top };
}

////// 绘制等待界面 //////
ui.prototype.drawWaiting = function(text) {
    core.lockControl();
    core.status.event.id = 'waiting';
    core.clearUI();
    text = core.replaceText(text || "");
    var text_length = core.calWidth('ui', text, this._buildFont(19, true));
    var width = Math.max(text_length + 80, 220), left = this.HALF_PX - parseInt(width / 2), right = left + width;
    var top = this.HALF_PY - 48, height = 96, bottom = top + height;
    this.drawBackground(left, top, right, bottom);
    core.setTextAlign('ui', 'center');
    core.fillText('ui', text, this.HALF_PX, top + 56, core.arrayToRGBA(core.status.textAttribute.text));
}

////// 绘制系统设置界面 //////
ui.prototype._drawSwitchs = function() {
    core.status.event.id = 'switchs';
    var choices = [
        "音效设置",
        "显示设置",
        "操作设置",
        "返回主菜单"
    ];
    this.drawChoices(null, choices);
}

ui.prototype._drawSwitchs_sounds = function () {
    core.status.event.id = 'switchs-sounds';
    var choices = [
        "音乐： " + (core.musicStatus.bgmStatus ? "[ON]" : "[OFF]"),
        "音效： " + (core.musicStatus.soundStatus ? "[ON]" : "[OFF]"),
        // 显示为 0~10 十挡
        " <     音量：" + Math.round(Math.sqrt(100 * core.musicStatus.userVolume)) + "     > ",
        "返回上一级"
    ];
    this.drawChoices(null, choices);
}

ui.prototype._drawSwitchs_display = function () {
    core.status.event.id = 'switchs-display';
    var choices = [
        " <   放缩：" + Math.max(core.domStyle.scale, 1) + "x   > ",
        "高清画面： " + (core.flags.enableHDCanvas ? "[ON]" : "[OFF]"),
        "定点怪显： " + (core.flags.enableEnemyPoint ? "[ON]" : "[OFF]"),
        "怪物显伤： " + (core.flags.displayEnemyDamage ? "[ON]" : "[OFF]"),
        "临界显伤： " + (core.flags.displayCritical ? "[ON]" : "[OFF]"),
        "领域显伤： " + (core.flags.displayExtraDamage ? "[ON]" : "[OFF]"),
        "领域模式： " + (core.flags.extraDamageType == 2 ? "[最简]" : core.flags.extraDamageType == 1 ? "[半透明]" : "[完整]" ),
        "返回上一级",
    ];
    this.drawChoices(null, choices);
}

ui.prototype._drawSwitchs_action = function () {
    core.status.event.id = 'switchs-action';
    var choices = [
        // 数值越大耗时越长
        " <   步时：" + core.values.moveSpeed + "   > ",
        " <   转场：" + core.values.floorChangeTime + "   > ",
        "血瓶绕路： "+(core.hasFlag('__potionNoRouting__') ? "[ON]":"[OFF]"),
        "单击瞬移： "+(!core.hasFlag("__noClickMove__") ? "[ON]":"[OFF]"),
        "左手模式： "+(core.flags.leftHandPrefer ? "[ON]":"[OFF]"),
        "返回上一级",
    ];
    this.drawChoices(null, choices);
}

////// 绘制系统菜单栏 //////
ui.prototype._drawSettings = function () {
    core.status.event.id = 'settings';
    this.drawChoices(null, [
        "系统设置", "虚拟键盘", "浏览地图", "存档笔记", "同步存档", "游戏信息", "返回标题", "返回游戏"
    ]);
}

////// 绘制存档笔记 //////
ui.prototype._drawNotes = function () {
    core.status.event.id = 'notes';
    core.status.hero.notes = core.status.hero.notes || [];
    core.lockControl();
    this.drawChoices("存档笔记允许你写入和查看任何笔记（快捷键M），你可以用做任何标记，比如Boss前的属性、开门和路线选择等。", [
        "新增存档笔记", "查看存档笔记", "编辑存档笔记", "删除存档笔记", "返回上一页"
    ]);
}

////// 绘制快捷商店选择栏 //////
ui.prototype._drawQuickShop = function () {
    core.status.event.id = 'selectShop';
    var shopList = core.status.shops, keys = core.listShopIds();
    var choices = keys.map(function (shopId) {
        return {"text": shopList[shopId].textInList, "color": core.isShopVisited(shopId) ? null : "#999999"};
    });
    choices.push("返回游戏");
    this.drawChoices(null, choices);
}

////// 绘制存档同步界面 //////
ui.prototype._drawSyncSave = function () {
    core.status.event.id = 'syncSave';
    this.drawChoices(null, [
        "同步存档到服务器", "从服务器加载存档", "存档至本地文件", "从本地文件读档", "回放和下载录像", "清空本地存档", "返回主菜单"
    ]);
}

////// 绘制存档同步选择页面 //////
ui.prototype._drawSyncSelect = function () {
    core.status.event.id = 'syncSelect';
    this.drawChoices(null, [
        "同步本地所有存档", "只同步当前单存档", "返回上级菜单"
    ]);
}

////// 绘制单存档界面 //////
ui.prototype._drawLocalSaveSelect = function () {
    core.status.event.id = 'localSaveSelect';
    this.drawChoices(null, [
        "下载所有存档", "只下载当前单存档", "返回上级菜单"
    ]);
}

////// 绘制存档删除页面 //////
ui.prototype._drawStorageRemove = function () {
    core.status.event.id = 'storageRemove';
    this.drawChoices(null, [
        "清空全部塔的存档", "只清空当前塔的存档", "返回上级菜单"
    ]);
}

ui.prototype._drawReplay = function () {
    core.lockControl();
    core.status.event.id = 'replay';
    core.playSound('打开界面');
    this.drawChoices(null, [
        "从头回放录像", "从存档开始回放", "接续播放剩余录像", "播放存档剩余录像", "选择录像文件", "下载当前录像", "返回游戏"
    ]);
}

ui.prototype._drawGameInfo = function () {
    core.status.event.id = 'gameInfo';
    this.drawChoices(null, [
        "数据统计", "查看工程", "游戏主页", "操作帮助", "关于游戏","下载离线版本", "返回主菜单"
    ]);
}

////// 绘制分页 //////
ui.prototype.drawPagination = function (page, totalPage, y) {
    // if (totalPage<page) totalPage=page;
    if (totalPage <= 1) return;
    if (y == null) y = this.Y_LAST;

    core.setFillStyle('ui', '#DDDDDD');
    var length = core.calWidth('ui', page + " / " + page, this._buildFont(15, true));

    core.setTextAlign('ui', 'left');
    core.fillText('ui', page + " / " + totalPage, parseInt((this.PX_WIDTH - length) / 2), y*32+19);

    core.setTextAlign('ui', 'center');
    if (page > 1)
        core.fillText('ui', '上一页', this.HALF_PX - 80, y*32+19);
    if (page < totalPage)
        core.fillText('ui', '下一页', this.HALF_PX + 80, y*32+19);
}

////// 绘制键盘光标 //////
ui.prototype._drawCursor = function () {
    var automaticRoute = core.status.automaticRoute;
    if (automaticRoute.cursorX == null)
        automaticRoute.cursorX = core.getHeroLoc('x');
    if (automaticRoute.cursorY == null)
        automaticRoute.cursorY = core.getHeroLoc('y');
    automaticRoute.cursorX = core.clamp(automaticRoute.cursorX, 0, this.X_LAST);
    automaticRoute.cursorY = core.clamp(automaticRoute.cursorY, 0, this.Y_LAST);
    core.status.event.id = 'cursor';
    core.lockControl();
    core.clearUI();
    var width = 4;
    core.strokeRect('ui', 32*automaticRoute.cursorX+width/2, 32*automaticRoute.cursorY+width/2,
        32-width, 32-width, core.status.globalAttribute.selectColor, width);

}

////// 绘制怪物手册 //////
ui.prototype.drawBook = function (index) {
    var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
    // 清除浏览地图时的光环缓存
    if (floorId != core.status.floorId && core.status.checkBlock) {
        core.status.checkBlock.cache = {};
    }
    var enemys = core.enemys.getCurrentEnemys(floorId);
    core.clearUI();
    core.clearMap('data');
    // 生成groundPattern
    core.maps.generateGroundPattern(floorId);
    this._drawBook_drawBackground();
    core.setAlpha('ui', 1);

    if (enemys.length == 0) {
        return this._drawBook_drawEmpty();
    }

    index = core.clamp(index, 0, enemys.length - 1);
    core.status.event.data = index;
    var pageinfo = this._drawBook_pageinfo();
    var perpage = pageinfo.per_page, page = parseInt(index / perpage) + 1, totalPage = Math.ceil(enemys.length / perpage);

    var start = (page - 1) * perpage;
    enemys = enemys.slice(start, page * perpage);

    for (var i = 0; i < enemys.length; i++)
        this._drawBook_drawOne(floorId, i, enemys[i], pageinfo, index == start + i);

    core.drawBoxAnimate();
    this.drawPagination(page, totalPage);
    core.setTextAlign('ui', 'center');
    core.fillText('ui', '返回游戏', this.PX_WIDTH - 46, this.PX_HEIGHT - 13,'#DDDDDD', this._buildFont(15, true));
}

ui.prototype._drawBook_pageinfo = function () {
    var per_page = this.H_HEIGHT; // 每页个数
    var padding_top = 12; // 距离顶端像素
    var per_height = (this.PX_HEIGHT - 32 - padding_top) / per_page;
    return { per_page: per_page, padding_top: padding_top, per_height: per_height };
}

ui.prototype._drawBook_drawBackground = function () {
    core.setAlpha('ui', 1);
    core.setFillStyle('ui', core.material.groundPattern);
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT);

    core.setAlpha('ui', 0.6);
    core.setFillStyle('ui', '#000000');
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT);
}

ui.prototype._drawBook_drawEmpty = function () {
    core.setTextAlign('ui', 'center');
    core.fillText('ui', "本层无怪物", this.HALF_PX, this.HALF_PY + 14, '#999999', this._buildFont(50, true));
    core.fillText('ui', '返回游戏', this.PX_WIDTH - 46, this.PX_HEIGHT - 13,'#DDDDDD', this._buildFont(15, true));
}

ui.prototype._drawBook_drawOne = function (floorId, index, enemy, pageinfo, selected) {
    // --- 区域规划：每个区域总高度默认为62，宽度为 PIXEL
    var top = pageinfo.per_height * index + pageinfo.padding_top; // 最上面margin默认是12px
    enemy.floorId = floorId;
    // 横向规划：
    // 22 + 42 = 64 是头像框
    this._drawBook_drawBox(index, enemy, top, pageinfo);
    // 剩余 PIXEL - 64 的宽度，按照 10 : 9 : 8 : 8 的比例划分
    var left = 64, total_width = this.PX_WIDTH - left;
    var name_width = total_width * 10 / 35;
    this._drawBook_drawName(index, enemy, top, left, name_width);
    this._drawBook_drawContent(index, enemy, top, left + name_width);
    if (selected)
        core.strokeRoundRect('ui', 10, top + 1, this.PX_WIDTH - 10 * 2, pageinfo.per_height, 10, core.status.globalAttribute.selectColor);
}

ui.prototype._drawBook_is32x32 = function (blockInfo) {
    // 判定48的怪物上半部分是否是全透明
    var height = blockInfo.height - 32;
    var canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = height;
    var ctx = canvas.getContext("2d");
    core.drawImage(ctx, blockInfo.image, 0, blockInfo.posY * blockInfo.height, 32, height, 0, 0, 32, height);
    var url = canvas.toDataURL();
    core.clearMap(ctx);
    return url == canvas.toDataURL();
}

ui.prototype._drawBook_drawBox = function (index, enemy, top, pageinfo) {
    // 横向：22+42；纵向：10 + 42 + 10（正好居中）；内部图像 32x32
    var border_top = top + (pageinfo.per_height - 42) / 2, border_left = 22;
    var img_top = border_top + 5, img_left = border_left + 5;
    core.strokeRect('ui', 22, border_top, 42, 42, '#DDDDDD', 2);
    var blockInfo = core.getBlockInfo(enemy.id);

    // 检查大怪物
    if (blockInfo.bigImage) {
        core.status.boxAnimateObjs.push({
            bigImage: blockInfo.bigImage, face: blockInfo.face, centerX: border_left + 21, centerY: border_top + 21, 
            max_width: 60
        });
    }
    else if (blockInfo.height >= 42) {
        var originEnemy = core.material.enemys[enemy.id] || {};
        // 检查上半部分是不是纯透明的；取用原始值避免重复计算
        if (originEnemy.is32x32 == null) {
            originEnemy.is32x32 = this._drawBook_is32x32(blockInfo);
        }
        if (originEnemy.is32x32) {
            core.status.boxAnimateObjs.push({
                'bgx': border_left, 'bgy': border_top, 'bgWidth': 42, 'bgHeight': 42,
                'x': img_left, 'y': img_top, 'height': 32, 'animate': blockInfo.animate,
                'image': blockInfo.image, 'pos': blockInfo.posY * blockInfo.height + blockInfo.height - 32
            });
        } else {
            var drawWidth = 42 * 32 / blockInfo.height;
            core.status.boxAnimateObjs.push({
                'bgx': border_left, 'bgy': border_top, 'bgWidth': 42, 'bgHeight': 42,
                'x': img_left - 5 + (42 - drawWidth) / 2, 'y': img_top - 5, 'dw': drawWidth, 'dh': 42,
                'height': blockInfo.height, 'animate': blockInfo.animate,
                'image': blockInfo.image, 'pos': blockInfo.posY * blockInfo.height
            });
        }
    } else {
        core.status.boxAnimateObjs.push({
            'bgx': border_left, 'bgy': border_top, 'bgWidth': 42, 'bgHeight': 42,
            'x': img_left, 'y': img_top, 'height': 32, 'animate': blockInfo.animate,
            'image': blockInfo.image, 'pos': blockInfo.posY * blockInfo.height
        });
    }
}

ui.prototype._drawBook_drawName = function (index, enemy, top, left, width) {
    // 绘制第零列（名称和特殊属性）
    // 如果需要添加自己的比如怪物的称号等，也可以在这里绘制
    core.setTextAlign('ui', 'center');
    if (enemy.specialText.length == 0) {
        core.fillText('ui', enemy.name, left + width / 2,
            top + 35, '#DDDDDD', this._buildFont(17, true), width);
    }
    else {
        core.fillText('ui', enemy.name, left + width / 2,
            top + 28, '#DDDDDD', this._buildFont(17, true), width);
        switch (enemy.specialText.length) {
            case 1:
                core.fillText('ui', enemy.specialText[0], left + width / 2,
                    top + 50, core.arrayToRGBA((enemy.specialColor || [])[0] || '#FF6A6A'), 
                    this._buildFont(15, true), width);
                break;
            case 2:
                // Step 1: 计算字体
                var text = enemy.specialText[0] + "  " + enemy.specialText[1];
                core.setFontForMaxWidth('ui', text, width, this._buildFont(15, true));
                // Step 2: 计算总宽度
                var totalWidth = core.calWidth('ui', text);
                var leftWidth = core.calWidth('ui', enemy.specialText[0]);
                var rightWidth = core.calWidth('ui', enemy.specialText[1]);
                // Step 3: 绘制
                core.fillText('ui', enemy.specialText[0], left + (width + leftWidth - totalWidth) / 2,
                    top+50, core.arrayToRGBA((enemy.specialColor || [])[0] || '#FF6A6A'));
                core.fillText('ui', enemy.specialText[1], left + (width + totalWidth - rightWidth) / 2,
                    top+50, core.arrayToRGBA((enemy.specialColor || [])[1] || '#FF6A6A'));
                break;
            default:
                core.fillText('ui', '多属性...', left + width / 2,
                    top + 50, '#FF6A6A', this._buildFont(15, true), width);
        }
    }
}

ui.prototype._drawBook_drawContent = function (index, enemy, top, left) {
    var width = this.PX_WIDTH - left; // 9 : 8 : 8 划分三列
    this._drawBook_drawRow1(index, enemy, top, left, width, top + 20);
    this._drawBook_drawRow2(index, enemy, top, left, width, top + 38);
    this._drawBook_drawRow3(index, enemy, top, left, width, top + 56);
}

ui.prototype._drawBook_drawRow1 = function (index, enemy, top, left, width, position) {
    // 绘制第一行
    core.setTextAlign('ui', 'left');
    var b13 = this._buildFont(13, true), f13 = this._buildFont(13, false);
    var col1 = left, col2 = left + width * 9 / 25, col3 = left + width * 17 / 25;
    core.fillText('ui', core.getStatusLabel('hp'), col1, position, '#DDDDDD', f13);
    core.fillText('ui', core.formatBigNumber(enemy.hp||0), col1 + 30, position, null, b13);
    core.fillText('ui', core.getStatusLabel('atk'), col2, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.atk||0), col2 + 30, position, null, b13);
    core.fillText('ui', core.getStatusLabel('def'), col3, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.def||0), col3 + 30, position, null, b13);
}

ui.prototype._drawBook_drawRow2 = function (index, enemy, top, left, width, position) {
    // 绘制第二行
    core.setTextAlign('ui', 'left');
    var b13 = this._buildFont(13, true), f13 = this._buildFont(13, false);
    var col1 = left, col2 = left + width * 9 / 25, col3 = left + width * 17 / 25;
    // 获得第二行绘制的内容
    var second_line = [];
    if (core.flags.statusBarItems.indexOf('enableMoney')>=0) second_line.push([core.getStatusLabel('money'), core.formatBigNumber(enemy.money || 0)]);
    if (core.flags.enableAddPoint) second_line.push([core.getStatusLabel('point'), core.formatBigNumber(enemy.point || 0)]);
    if (core.flags.statusBarItems.indexOf('enableExp')>=0) second_line.push([core.getStatusLabel('exp'), core.formatBigNumber(enemy.exp || 0)]);

    var damage_offset = col1 + (this.PX_WIDTH - col1) / 2 - 12;
    // 第一列
    if (second_line.length > 0) {
        var one = second_line.shift();
        core.fillText('ui', one[0], col1, position, '#DDDDDD', f13);
        core.fillText('ui', one[1], col1 + 30, position, null, b13);
        damage_offset = col2 + (this.PX_WIDTH - col2) / 2 - 12;
    }
    // 第二列
    if (second_line.length > 0) {
        var one = second_line.shift();
        core.fillText('ui', one[0], col2, position, '#DDDDDD', f13);
        core.fillText('ui', one[1], col2 + 30, position, null, b13);
        damage_offset = col3 + (this.PX_WIDTH - col3) / 2 - 12;
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
    core.fillText('ui', '加防', col3, position, null, f13);
    core.fillText('ui', core.formatBigNumber(enemy.defDamage||0), col3 + 30, position, null, b13);
}

ui.prototype._drawBook_drawDamage = function (index, enemy, offset, position) {
    core.setTextAlign('ui', 'center');
    var damage = enemy.damage, color = '#FFFF00';
    if (damage == null) {
        damage = '打不过';
        color = '#FF2222';
    }
    else {
        if (damage >= core.status.hero.hp) color = '#FF2222';
        else if (damage >= core.status.hero.hp * 2 / 3) color = '#FF9933';
        else if (damage <= 0) color = '#11FF11';
        damage = core.formatBigNumber(damage);
        if (core.enemys.hasSpecial(enemy, 19)) damage += "+";
        if (core.enemys.hasSpecial(enemy, 21)) damage += "-";
        if (core.enemys.hasSpecial(enemy, 11)) damage += "^";
    }
    if (enemy.notBomb) damage += "[b]";
    core.fillText('ui', damage, offset, position, color, this._buildFont(13, true));
}

////// 绘制怪物属性的详细信息 //////
ui.prototype._drawBookDetail = function (index) {
    var info = this._drawBookDetail_getInfo(index), enemy = info[0];
    if (!enemy) return;
    var content = info[1].join("\n");
    core.status.event.id = 'book-detail';
    core.animateFrame.tip = null;
    core.clearMap('data');

    var left = 10, width = this.PX_WIDTH - 2 * left, right = left + width;
    var content_left = left + 25, validWidth = right - content_left - 13;
    var height = Math.max(this.getTextContentHeight(content, {fontSize: 16, lineHeight: 24, maxWidth: validWidth}) + 58, 80), 
        top = (this.PX_HEIGHT - height) / 2, bottom = top + height; // core.setAlpha('data', 0.9);
    core.ui.drawBackground(left, top, left + width, top + height, {ctx: 'data'}); // core.fillRect('data', left, top, width, height, '#000000');
    // core.setAlpha('data', 1); core.strokeRect('data', left - 1, top - 1, width + 1, height + 1, core.arrayToRGBA(core.status.globalAttribute.borderColor), 2);
    core.playSound('确定');
    this._drawBookDetail_drawContent(enemy, content, {top: top, content_left: content_left, bottom: bottom, validWidth: validWidth});
}

ui.prototype._drawBookDetail_getInfo = function (index) {
    var floorId = core.floorIds[(core.status.event.ui||{}).index] || core.status.floorId;
    // 清除浏览地图时的光环缓存
    if (floorId != core.status.floorId && core.status.checkBlock) {
        core.status.checkBlock.cache = {};
    }
    var enemys = core.enemys.getCurrentEnemys(floorId);
    if (enemys.length==0) return [];
    index = core.clamp(index, 0, enemys.length - 1);
    var enemy = enemys[index], enemyId = enemy.id;
    var texts=core.enemys.getSpecialHint(enemyId);
    if (texts.length == 0) texts.push("该怪物无特殊属性。");
    if (enemy.description) texts.push(enemy.description + "\r");
    texts.push("");
    this._drawBookDetail_getTexts(enemy, floorId, texts);
    return [enemy, texts];
}

ui.prototype._drawBookDetail_getTexts = function (enemy, floorId, texts) {
    // --- 原始数值
    this._drawBookDetail_origin(enemy, texts);
    // --- 模仿临界计算器
    this._drawBookDetail_mofang(enemy, texts);
    // --- 吸血怪最低生命值
    this._drawBookDetail_vampire(enemy, floorId, texts);
    // --- 仇恨伤害
    if (core.enemys.hasSpecial(enemy.special, 17)) texts.push("\r[#FF6A6A]\\d当前仇恨伤害值：\\d\r[]"+core.getFlag('hatred', 0));
    // --- 战斗回合数，临界表
    this._drawBookDetail_turnAndCriticals(enemy, floorId, texts);
}

ui.prototype._drawBookDetail_origin = function (enemy, texts) {
    // 怪物数值和原始值不一样时，在详细信息页显示原始数值
    var originEnemy = core.enemys._getCurrentEnemys_getEnemy(enemy.id);
    var content = [];
    if (enemy.locs != null && enemy.locs.length >= 0) {
        texts.push("\r[#FF6A6A]\\d怪物坐标：\\d\r[]" + JSON.stringify(enemy.locs));
    }
    ["hp", "atk", "def", "point", "money", "exp"].forEach(function (one) {
        if (enemy[one] == null || originEnemy[one] == null) return;
        if (enemy[one] != originEnemy[one]) {
            content.push(core.getStatusLabel(one) + " " + originEnemy[one]);
        }
    });
    if (content.length > 0) {
        texts.push("\r[#FF6A6A]\\d原始数值：\\d\r[]" + content.join("；"));
    }
}

ui.prototype._drawBookDetail_mofang = function (enemy, texts) {
    // 模仿临界计算器
    if (core.enemys.hasSpecial(enemy.special, 10)) {
        var hp = enemy.hp;
        var delta = core.status.hero.atk - core.status.hero.def;
        if (delta<hp && hp<=10000 && hp>0) {
            texts.push("\r[#FF6A6A]\\d模仿临界计算器：\\d\r[]（当前攻防差"+core.formatBigNumber(delta)+"）");
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

ui.prototype._drawBookDetail_vampire = function (enemy, floorId, texts) {
    if (core.enemys.hasSpecial(enemy.special, 11)) {
        var damage = core.getDamage(enemy.id);
        if (damage != null) {
            // 二分HP
            var start = 1, end = 100 * damage;
            var nowHp = core.status.hero.hp;
            while (start<end) {
                var mid = Math.floor((start+end)/2);
                core.status.hero.hp = mid;
                if (core.canBattle(enemy.id, enemy.x, enemy.y, floorId)) end = mid;
                else start = mid+1;
            }
            core.status.hero.hp = start;
            if (core.canBattle(enemy.id)) {
                texts.push("\r[#FF6A6A]\\d打死该怪物最低需要生命值：\\d\r[]"+core.formatBigNumber(start));
            }
            core.status.hero.hp = nowHp;
        }
    }
}

ui.prototype._drawBookDetail_turnAndCriticals = function (enemy, floorId, texts) {
    var damageInfo = core.getDamageInfo(enemy.id, null, enemy.x, enemy.y, floorId);
    texts.push("\r[#FF6A6A]\\d战斗回合数：\\d\r[]"+((damageInfo||{}).turn||0));
    // 临界表
    var criticals = core.enemys.nextCriticals(enemy.id, 8, enemy.x, enemy.y, floorId).map(function (v) {
        return core.formatBigNumber(v[0])+":"+core.formatBigNumber(v[1]);
    });
    while (criticals[0]=='0:0') criticals.shift();
    texts.push("\r[#FF6A6A]\\d临界表：\\d\r[]"+JSON.stringify(criticals));
}

ui.prototype._drawBookDetail_drawContent = function (enemy, content, pos) {
    // 名称
    core.setTextAlign('data', 'left');
    core.fillText('data', enemy.name, pos.content_left, pos.top + 30, core.status.globalAttribute.selectColor, this._buildFont(22, true));
    var content_top = pos.top + 44;

    this.drawTextContent('data', content, {left: pos.content_left, top: content_top, maxWidth: pos.validWidth,
        fontSize: 16, lineHeight: 24});
}

////// 绘制楼层传送器 //////
ui.prototype.drawFly = function(page) {
    core.status.event.data = page;
    var floorId = core.floorIds[page];
    var title = core.status.maps[floorId].title;
    core.clearMap('ui');
    core.setAlpha('ui', 0.85);
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, '#000000');
    core.setAlpha('ui', 1);
    core.setTextAlign('ui', 'center');
    core.fillText('ui', core.material.items.fly.name || '楼层跳跃', this.HALF_PX, core.__UNIT__ * 3/2, '#FFFFFF', this._buildFont(28, true));
    core.fillText('ui', '返回游戏', this.HALF_PX, this.PX_HEIGHT - 13, null, this._buildFont(15, true))
    core.setTextAlign('ui', 'right');
    core.fillText('ui', '浏览地图时也', this.PX_WIDTH - 10, this.PX_HEIGHT - 23, '#aaaaaa', this._buildFont(10, false));
    core.fillText('ui', '可楼层跳跃！', this.PX_WIDTH - 10, this.PX_HEIGHT - 11, null, this._buildFont(10, false));
    core.setTextAlign('ui', 'center');
    var middle = this.HALF_PY + 39;
    // 换行
    var lines = core.splitLines('ui', title, this.PX_WIDTH / 4, this._buildFont(19, true));
    var start_y = middle - (lines.length - 1) * 11;
    for (var i in lines) {
        core.fillText('ui', lines[i], this.PX_WIDTH * 7/8, start_y, '#FFFFFF');
        start_y += 22;
    }

    // core.fillText('ui', title, this.PIXEL - 60, this.HPIXEL + 39, null, this._buildFont(19, true));

    if (core.actions._getNextFlyFloor(1) != page) {
        core.fillText('ui', '▲', this.PX_WIDTH - 60, middle - 64, null, this._buildFont(17, false));
        core.fillText('ui', '▲', this.PX_WIDTH - 60, middle - 96);
        core.fillText('ui', '▲', this.PX_WIDTH - 60, middle - 96 - 7);
    }
    if (core.actions._getNextFlyFloor(-1) != page) {
        core.fillText('ui', '▼', this.PX_WIDTH - 60, middle + 64, null, this._buildFont(17, false));
        core.fillText('ui', '▼', this.PX_WIDTH - 60, middle + 96);
        core.fillText('ui', '▼', this.PX_WIDTH - 60, middle + 96 + 7);
    }
    var size = 0.75; // this.PIXEL - 143;
    core.strokeRect('ui', 2, core.__UNIT__ * 2, Math.ceil(size * this.PX_WIDTH), Math.ceil(size * this.PX_HEIGHT), core.status.globalAttribute.selectColor, 1);
    core.drawThumbnail(floorId, null, {ctx: 'ui', x: 2, y: core.__UNIT__ * 2, size: size, damage: true});
}

////// 绘制中心对称飞行器
ui.prototype._drawCenterFly = function () {
    core.lockControl();
    core.status.event.id = 'centerFly';
    var fillstyle = 'rgba(255,0,0,0.5)';
    if (core.canUseItem('centerFly')) fillstyle = 'rgba(0,255,0,0.5)';
    var toX = core.bigmap.width - 1 - core.getHeroLoc('x'), toY = core.bigmap.height - 1 - core.getHeroLoc('y');
    if (core.flags.statusCanvas && core.bigmap.width <= core.__WIDTH__)
        toX = core.__HEIGHT__ - 1 - core.getHeroLoc('x'); // 自绘状态栏时，特判是否是横向大地图，如果不是，则横向对称的范围以视野高度为准
    this.clearUI();
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, '#000000');
    core.drawThumbnail(null, null, {heroLoc: core.status.hero.loc, heroIcon: core.status.hero.image, ctx: 'ui', centerX: toX, centerY: toY});
    var offsetX = core.clamp(toX - core.__HALF_WIDTH__, 0, core.bigmap.width - core.__WIDTH__),
        offsetY = core.clamp(toY - core.__HALF_HEIGHT__, 0, core.bigmap.height - core.__HEIGHT__);
    core.fillRect('ui', (toX - offsetX) * 32, (toY - offsetY) * 32, 32, 32, fillstyle);
    core.status.event.data = {"x": toX, "y": toY, "posX": toX - offsetX, "posY": toY - offsetY};
    core.playSound('打开界面');
    core.drawTip("请确认当前"+core.material.items['centerFly'].name+"的位置", 'centerFly');
    return;
}

////// 绘制浏览地图界面 //////
ui.prototype._drawViewMaps = function (index, x, y) {
    core.lockControl();
    core.status.event.id = 'viewMaps';
    this.clearUI();
    if (index == null) return this._drawViewMaps_drawHint();
    core.animateFrame.tip = null;
    core.status.checkBlock.cache = {};
    var data = this._drawViewMaps_buildData(index, x, y);
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, '#000000');
    core.drawThumbnail(data.floorId, null, {damage: data.damage, ctx: 'ui', centerX: data.x, centerY: data.y, all: data.all});
    core.clearMap('data');
    core.setTextAlign('data', 'left');
    core.setFont('data', '16px Consolas');
    var text = core.status.maps[data.floorId].title;
    if (!data.all && (data.mw>this.WIDTH || data.mh>this.HEIGHT))
        text+=" ["+(data.x-this.H_WIDTH)+","+(data.y-this.H_HEIGHT)+"]";
    if (core.markedFloorIds[data.floorId])
        text+=" （已标记）";
    var textX = 16, textY = 18, width = textX + core.calWidth('data', text) + 16, height = 42;
    core.fillRect('data', 5, 5, width, height, 'rgba(0,0,0,0.4)');
    core.fillText('data', text, textX + 5, textY + 15, 'rgba(255,255,255,0.6)');
}

ui.prototype._drawViewMaps_drawHint = function () {
    core.playSound('打开界面');
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, 'rgba(0,0,0,0.7)');
    core.setTextAlign('ui', 'center');
    var stroke = function (left, top, width, height, fillStyle, lineWidth) {
        core.strokeRect('ui', left+2, top+2, width-4, height-4, fillStyle, lineWidth);
    }

    var perpx = this.PX_WIDTH / 5, cornerpx = perpx * 3 / 4, perpy = this.PX_HEIGHT / 5, cornerpy = perpy * 3 / 4;
    stroke(perpx, 0, 3 * perpx, perpy, core.status.globalAttribute.selectColor, 4); // up
    stroke(0, perpy, perpx, 3 * perpy); // left
    stroke(perpx, 4 * perpy, 3 * perpx, perpy); // down
    stroke(4 * perpx, perpy, perpx, 3 * perpy); // right
    stroke(perpx, perpy, 3 * perpx, perpy); // prev
    stroke(perpx, 3 * perpy, 3 * perpx, perpy); // next
    stroke(0, 0, cornerpx, cornerpy); // left top
    stroke(this.PX_WIDTH - cornerpx, 0, cornerpx, cornerpy); // right top
    stroke(0, this.PX_HEIGHT - cornerpy, cornerpx, cornerpy); // left bottom;

    core.setTextBaseline('ui', 'middle');
    core.fillText('ui', "上移地图 [W]", this.HALF_PX, perpy / 2, core.status.globalAttribute.selectColor, '20px Consolas');
    core.fillText('ui', "下移地图 [S]", this.HALF_PX, this.PX_HEIGHT - perpy / 2);
    core.fillText('ui', 'V', cornerpx / 2, cornerpy / 2);
    core.fillText('ui', 'Z', this.PX_WIDTH - cornerpx / 2, cornerpy / 2);
    core.fillText('ui', 'B', cornerpx / 2, this.PX_HEIGHT - cornerpy / 2);

    var top = this.HALF_PY - 66, left = perpx / 2, right = this.PX_WIDTH - left;
    var lt = ["左", "移", "地", "图", "[A]"], rt = ["右", "移", "地", "图", "[D]"];
    for (var i = 0; i < 5; ++i) {
        core.fillText("ui", lt[i], left, top + 32 * i);
        core.fillText("ui", rt[i], right, top + 32 * i);
    }
    core.fillText('ui', "前张地图 [▲ / PGUP]", this.HALF_PX, perpy * 1.5);
    core.fillText('ui', "后张地图 [▼ / PGDN]", this.HALF_PX, this.PX_HEIGHT - perpy * 1.5);

    core.fillText('ui', "退出 [ESC / ENTER]", this.HALF_PX, this.HALF_PY - core.__UNIT__ / 2);
    core.fillText('ui', "[X] 可查看" + core.material.items['book'].name + "   [G] 可使用" + core.material.items.fly.name, this.HALF_PX, this.HALF_PY + core.__UNIT__ / 2, null, '12px Consolas');

    core.setTextBaseline('ui', 'alphabetic');
}

ui.prototype._drawViewMaps_buildData = function (index, x, y) {
    var damage = (core.status.event.data||{}).damage;
    var all = (core.status.event.data||{all: true}).all;
    if (index.damage != null) damage=index.damage;
    if (index.all != null) all=index.all;
    if (index.index != null) { x=index.x; y=index.y; index=index.index; }
    index = core.clamp(index, 0, core.floorIds.length-1);
    if (damage == null) damage = true; // 浏览地图默认开显伤好了

    var floorId = core.floorIds[index], mw = core.floors[floorId].width, mh = core.floors[floorId].height;
    if (x == null) x = parseInt(mw / 2);
    if (y == null) y = parseInt(mh / 2);
    x = core.clamp(x, this.H_WIDTH, mw - this.H_WIDTH - 1);
    y = core.clamp(y, this.H_HEIGHT, mh - this.H_HEIGHT - 1);

    core.status.event.data = {index: index, x: x, y: y, floorId: floorId, mw: mw, mh: mh,
                              damage: damage, all: all };
    return core.status.event.data;
}

////// 绘制道具栏 //////
ui.prototype._drawToolbox = function(index) {
    var info = this._drawToolbox_getInfo(index);
    this._drawToolbox_drawBackground();

    // 绘制线
    core.setAlpha('ui', 1);
    core.setStrokeStyle('ui', '#DDDDDD');
    core.canvas.ui.lineWidth = 2;
    core.canvas.ui.strokeWidth = 2;
    core.setTextAlign('ui', 'right');
    var line1 = this.PX_HEIGHT - 306;
    this._drawToolbox_drawLine(line1, "消耗道具");
    var line2 = this.PX_HEIGHT - 146;
    this._drawToolbox_drawLine(line2, "永久道具");

    this._drawToolbox_drawDescription(info, line1);

    this._drawToolbox_drawContent(info, line1, info.tools, info.toolsPage, true);
    this.drawPagination(info.toolsPage, info.toolsTotalPage, this.Y_LAST - 5);
    this._drawToolbox_drawContent(info, line2, info.constants, info.constantsPage);
    this.drawPagination(info.constantsPage, info.constantsTotalPage);

    core.setTextAlign('ui', 'center');
    core.fillText('ui', '[装备栏]', this.PX_WIDTH - 46, 25, '#DDDDDD', this._buildFont(15, true));
    core.fillText('ui', '返回游戏', this.PX_WIDTH - 46, this.PX_HEIGHT - 13);
}

////// 获得所有应该在道具栏显示的某个类型道具 //////
ui.prototype.getToolboxItems = function (cls) {
    if (this.uidata.getToolboxItems) {
        return this.uidata.getToolboxItems(cls);
    }
    return Object.keys(core.status.hero.items[cls] || {})
            .filter(function (id) { return !core.material.items[id].hideInToolbox; })
            .sort();
}

ui.prototype._drawToolbox_getInfo = function (index) {
    // 设定eventdata
    if (!core.status.event.data || core.status.event.data.toolsPage == null)
        core.status.event.data = {"toolsPage":1, "constantsPage":1, "selectId":null}
    // 获取物品列表
    var tools = core.getToolboxItems('tools'), 
        constants = core.getToolboxItems('constants');
    // 处理页数
    var toolsPage = core.status.event.data.toolsPage;
    var constantsPage = core.status.event.data.constantsPage;
    var toolsTotalPage = Math.ceil(tools.length/this.X_LAST);
    var constantsTotalPage = Math.ceil(constants.length/this.X_LAST);
    // 处理index
    if (index == null)
        index = tools.length == 0 && constants.length > 0 ? this.X_LAST : 0;
    core.status.event.selection=index;
    // 确认选择对象
    var select, selectId;
    if (index<this.X_LAST) {
        select = index + (toolsPage-1)*this.X_LAST;
        if (select>=tools.length) select=Math.max(0, tools.length-1);
        selectId = tools[select];
    }
    else {
        select = index%this.X_LAST + (constantsPage-1)*this.X_LAST;
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
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, '#000000');
}

ui.prototype._drawToolbox_drawLine = function (yoffset, text) {
    core.setFillStyle('ui', '#DDDDDD');
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(0, yoffset);
    core.canvas.ui.lineTo(this.PX_WIDTH, yoffset);
    core.canvas.ui.stroke();
    core.canvas.ui.beginPath();
    core.canvas.ui.moveTo(this.PX_WIDTH, yoffset-1);
    core.canvas.ui.lineTo(this.PX_WIDTH, yoffset-25);
    core.canvas.ui.lineTo(this.PX_WIDTH-72, yoffset-25);
    core.canvas.ui.lineTo(this.PX_WIDTH-102, yoffset-1);
    core.canvas.ui.fill();
    core.fillText('ui', text, this.PX_WIDTH - 5, yoffset-6, '#333333', this._buildFont(16, true));
}

ui.prototype._drawToolbox_drawDescription = function (info, max_height) {
    core.setTextAlign('ui', 'left');
    if (!info.selectId) return;
    var item=core.material.items[info.selectId];
    var name = item.name || "未知道具";
    try { name = core.replaceText(name); } catch (e) {}
    core.fillText('ui', name, 10, 32, core.status.globalAttribute.selectColor, this._buildFont(20, true))
    var text = item.text || "该道具暂无描述。";
    try { text = core.replaceText(text); } catch (e) {}

    var height = null;
    for (var fontSize = 17; fontSize >= 9; fontSize -= 2) {
        var config = { left: 10, top: 46, fontSize: fontSize, maxWidth: this.PX_WIDTH - 15, bold: false, color: "white" };
        height = 42 + core.getTextContentHeight(text, config);
        if (height < max_height || fontSize == 9) {
            core.drawTextContent('ui', text, config);
            break;
        }
    }
    if (height < max_height - 33) {
        core.fillText('ui', '<继续点击该道具即可进行使用>', 10, max_height - 15, '#CCCCCC', this._buildFont(14, false));
    }
}

ui.prototype._drawToolbox_drawContent = function (info, line, items, page, drawCount) {
    core.setTextAlign('ui', 'right');
    for (var i = 0; i < this.X_LAST; i++) {
        var item = items[this.X_LAST * (page - 1) + i];
        if (!item) continue;
        var yoffset = line + 54 * Math.floor(i / this.H_WIDTH) + 19;
        var icon = core.material.icons.items[item], image = core.material.images.items;
        core.drawImage('ui', image, 0, 32 * icon, 32, 32, 64 * (i % this.H_WIDTH) + 21, yoffset, 32, 32);
        if (drawCount)
            core.fillText('ui', core.itemCount(item), 64 * (i % this.H_WIDTH) + 56, yoffset + 33, '#FFFFFF', this._buildFont(14, true));
        if (info.selectId == item)
            core.strokeRoundRect('ui', 64 * (i % this.H_WIDTH) + 17, yoffset - 4, 40, 40, 6, core.status.globalAttribute.selectColor);
    }
}

////// 绘制装备界面 //////
ui.prototype._drawEquipbox = function(index) {
    var info = this._drawEquipbox_getInfo(index);
    this._drawToolbox_drawBackground();

    core.setAlpha('ui', 1);
    core.setStrokeStyle('ui', '#DDDDDD');
    core.canvas.ui.lineWidth = 2;
    core.canvas.ui.strokeWidth = 2;
    core.setTextAlign('ui', 'right');
    var line1 = this.PX_HEIGHT - 306;
    this._drawToolbox_drawLine(line1, "当前装备");
    var line2 = this.PX_HEIGHT - 146;
    this._drawToolbox_drawLine(line2, "拥有装备");

    this._drawEquipbox_description(info, line1);

    this._drawEquipbox_drawEquiped(info, line1);
    this._drawToolbox_drawContent(info, line2, info.ownEquipment, info.page, true);
    this.drawPagination(info.page, info.totalPage);

    core.setTextAlign('ui', 'center');
    core.fillText('ui', '[道具栏]', this.PX_WIDTH - 46, 25, '#DDDDDD', this._buildFont(15, true));
    core.fillText('ui', '返回游戏', this.PX_WIDTH - 46, this.PX_HEIGHT - 13);
}

ui.prototype._drawEquipbox_getInfo = function (index) {
    if (!core.status.event.data || core.status.event.data.page == null)
        core.status.event.data = {"page":1, "selectId":null};
    var allEquips = core.status.globalAttribute.equipName;
    var equipLength = allEquips.length;
    if (!core.status.hero.equipment) core.status.hero.equipment = [];
    var equipEquipment = core.status.hero.equipment;
    var ownEquipment = core.getToolboxItems('equips');
    var page = core.status.event.data.page;
    var totalPage = Math.ceil(ownEquipment.length / this.X_LAST);
    // 处理index
    if (index == null) {
        if (equipLength > 0 && equipEquipment[0]) index = 0;
        else if (ownEquipment.length > 0) index = this.X_LAST;
        else index = 0;
    }
    if (index >= this.X_LAST && ownEquipment.length == 0) index = 0;
    var selectId=null;
    if (index < this.X_LAST) {
        if (index >= equipLength) index=Math.max(0, equipLength - 1);
        selectId = equipEquipment[index] || null;
    }
    else {
        if (page == totalPage) index = Math.min(index, (ownEquipment.length+this.X_LAST-1)%this.X_LAST+this.X_LAST);
        selectId = ownEquipment[index - this.X_LAST + (page - 1) * this.X_LAST];
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
    core.fillText('ui', equip.name + "（" + equipString + "）", 10, 32, core.status.globalAttribute.selectColor, this._buildFont(20, true))
    // --- 描述
    var text = equip.text || "该装备暂无描述。";
    try { text = core.replaceText(text); } catch (e) {}

    var height = null;
    for (var fontSize = 17; fontSize >= 9; fontSize -= 2) {
        var config = { left: 10, top: 46, fontSize: fontSize, maxWidth: this.PX_WIDTH - 15, bold: false, color: "white" };
        height = 42 + core.getTextContentHeight(text, config);
        if (height < max_height - 30 || fontSize == 9) {
            core.drawTextContent('ui', text, config);
            break;
        }
    }
    // --- 变化值
    this._drawEquipbox_drawStatusChanged(info, max_height - 15, equip, equipType);
}

ui.prototype._drawEquipbox_getStatusChanged = function (info, equip, equipType, y) {
    if (info.index < this.X_LAST) {
        // 光标在装备栏上：查询卸下装备属性
        return core.compareEquipment(null, info.selectId);
    }
    if (equipType < 0) {
        // 没有空位
        core.fillText('ui', '<当前没有该装备的空位，请先卸下装备>', 10, y, '#CCCCCC', this._buildFont(14, false));
        return null;
    }
    // 光标在装备上：查询装上后的属性变化
    return core.compareEquipment(info.selectId, info.equipEquipment[equipType]);
}

ui.prototype._drawEquipbox_drawStatusChanged = function (info, y, equip, equipType) {
    var compare = this._drawEquipbox_getStatusChanged(info, equip, equipType, y);
    if (compare == null) return;
    var obj = { drawOffset: 10, y: y };

    // --- 变化值...
    core.setFont('ui', this._buildFont(14, true));
    for (var name in core.status.hero) {
        if (typeof core.status.hero[name] != 'number') continue;
        var nowValue = core.getRealStatus(name);
        // 查询新值
        var newValue = Math.floor((core.getStatus(name) + (compare.value[name] || 0))
            * (core.getBuff(name) * 100 + (compare.percentage[name] || 0)) / 100);
        if (nowValue == newValue) continue;
        var text = core.getStatusLabel(name);
        this._drawEquipbox_drawStatusChanged_draw(text + " ", '#CCCCCC', obj);
        var color = newValue>nowValue?'#00FF00':'#FF0000';
        nowValue = core.formatBigNumber(nowValue);
        newValue = core.formatBigNumber(newValue);
        this._drawEquipbox_drawStatusChanged_draw(nowValue+"->", '#CCCCCC', obj);
        this._drawEquipbox_drawStatusChanged_draw(newValue, color, obj);
        obj.drawOffset += 8;
    }
}

ui.prototype._drawEquipbox_drawStatusChanged_draw = function (text, color, obj) {
    var len = core.calWidth('ui', text);
    if (obj.drawOffset + len >= core.__PX_WIDTH__) { // 换行
        obj.y += 19;
        obj.drawOffset = 10;
    }
    core.fillText('ui', text, obj.drawOffset, obj.y, color);
    obj.drawOffset += len;
}

ui.prototype._drawEquipbox_drawEquiped = function (info, line) {
    core.setTextAlign('ui', 'center');
    var per_line = this.H_WIDTH - 3, width = Math.floor(this.PX_WIDTH / (per_line + 0.25));
    // 当前装备
    for (var i = 0; i < info.equipLength ; i++) {
        var equipId = info.equipEquipment[i] || null;
        // var offset_text = width * (i % per_line) + 56;
        var offset_image = width * (i % per_line) + width * 2 / 3;
        var offset_text = offset_image - (width - 32) / 2;
        var y = line + 54 * Math.floor(i / per_line) + 19;
        if (equipId) {
            var icon = core.material.icons.items[equipId];
            core.drawImage('ui', core.material.images.items, 0, 32 * icon, 32, 32, offset_image, y, 32, 32);
        }
        core.fillText('ui', info.allEquips[i] || "未知", offset_text, y + 27, '#FFFFFF', this._buildFont(16, true))
        core.strokeRoundRect('ui', offset_image - 4, y - 4, 40, 40, 6, info.index==i?core.status.globalAttribute.selectColor:"#FFFFFF");
    }
}

////// 绘制存档/读档界面 //////
ui.prototype._drawSLPanel = function(index, refresh) {
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
    var bottom = this.PX_HEIGHT-13;
    core.fillText('ui', '返回游戏', this.PX_WIDTH-48, bottom, '#DDDDDD', this._buildFont(15, true));

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
    core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, '#000000');//可改成背景图
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
        for (var i = 1; i < ids.length; ++i)
            core.status.event.ui[i] = data[i];
        core.status.event.ui[0] = data[0] == null ? null : data[0][core.saves.autosave.now-1];
        callback();
    });
}

// 在以x为中心轴 y为顶坐标 的位置绘制一条宽为size的记录 cho表示是否被选中 选中会加粗 highlight表示高亮标题 ✐
ui.prototype._drawSLPanel_drawRecord = function(title, data, x, y, size, cho, highLight){
    var globalAttribute = core.status.globalAttribute || core.initStatus.globalAttribute;
    var strokeColor = globalAttribute.selectColor;
    if (core.status.event.selection) strokeColor = '#FF6A6A';
    if (!data || !data.floorId) highLight = false;
    if (data && data.__toReplay__) title = '[R]' + title;
    var w = Math.ceil(size * this.PX_WIDTH), h = Math.ceil(size * this.PX_HEIGHT);
    core.fillText('ui', title, x, y, highLight?globalAttribute.selectColor:'#FFFFFF', this._buildFont(17, true));
    core.strokeRect('ui', x-w/2, y+15, w, h, cho?strokeColor:'#FFFFFF', cho?6:2);
    if (data && data.floorId) {
        core.setTextAlign('ui', "center");
        var map = core.maps.loadMap(data.maps, data.floorId);
        core.extractBlocksForUI(map, data.hero.flags);
        core.drawThumbnail(data.floorId, map.blocks, {
            heroLoc: data.hero.loc, heroIcon: data.hero.image, flags: data.hero.flags,
            ctx: 'ui', x: x-w/2, y: y+15, size: size, centerX: data.hero.loc.x, centerY: data.hero.loc.y
        });
        if (core.isPlaying() && core.getFlag("hard") != data.hero.flags.hard) {
            core.fillRect('ui', x-w/2, y+15, w, h, [0, 0, 0, 0.4]);
            core.fillText('ui', data.hard, x, parseInt(y+22+h/2), data.hero.flags.__hardColor__ || 'red', this._buildFont(30,true));
        }
        // 绘制存档笔记
        if (data.hero.notes && data.hero.notes.length > 0) {
            core.setTextAlign('ui', 'left');
            if (data.hero.notes.length >= 2) {
                core.fillRect('ui', x-w/2, y + 15, w, 28, [0,0,0,0.3]);
                core.fillBoldText('ui', data.hero.notes.length - 1 + ". " + data.hero.notes[data.hero.notes.length - 2].substring(0, 10), 
                    x - w / 2 + 2, y + 15 + 12, '#FFFFFF', null, this._buildFont(10, false));
                core.fillBoldText('ui', data.hero.notes.length + ". " + data.hero.notes[data.hero.notes.length - 1].substring(0, 10), 
                    x - w / 2 + 2, y + 15 + 24);
            } else {
                core.fillRect('ui', x-w/2, y + 15, w, 16, [0,0,0,0.3]);
                core.fillBoldText('ui', data.hero.notes.length + ". " + data.hero.notes[data.hero.notes.length - 1].substring(0, 10), 
                    x - w / 2 + 2, y + 15 + 12, '#FFFFFF', null, this._buildFont(10, false));
            }
        }
        core.setTextAlign('ui', "center");
        var v = core.formatBigNumber(data.hero.hp,true)+"/"+core.formatBigNumber(data.hero.atk,true)+"/"+core.formatBigNumber(data.hero.def,true);
        var v2 = "/"+core.formatBigNumber(data.hero.mdef,true);
        if (core.calWidth('ui', v + v2, this._buildFont(10, false)) <= w) v += v2;
        core.fillText('ui', v, x, y+30+h, globalAttribute.selectColor);
        core.fillText('ui', core.formatDate(new Date(data.time)), x, y+43+h, data.hero.flags.debug?'#FF6A6A':'#FFFFFF');
    }
    else {
        core.fillRect('ui', x-w/2, y+15, w, h, '#333333');
        core.fillText('ui', 'Empty', x, parseInt(y+22+h/2), '#FFFFFF', this._buildFont(30, true));
    } 
}

ui.prototype._drawSLPanel_drawRecords  = function (n) {
    var page = core.status.event.data.page;
    var offset = core.status.event.data.offset;
    var u = Math.floor(this.PX_WIDTH/6), size = 0.3; // Math.floor(this.PIXEL/3-20);
    var name=core.status.event.id=='save'?"存档":core.status.event.id=='load'?"读档":"回放";

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
        var topSpan = parseInt((this.PX_HEIGHT-charSize-2*(charSize*2 + size * this.PX_HEIGHT))/3);// Margin
        var yTop1 = topSpan+parseInt(charSize/2) + 8;//文字的中心
        var yTop2 = yTop1+charSize*2+size * this.PX_HEIGHT+topSpan;
        if (i<3) {
            this._drawSLPanel_drawRecord(i==0?"自动存档":title, data, (2*i+1)*u, yTop1, size, i==offset, highLight);
        }
        else {
            this._drawSLPanel_drawRecord(title, data, (2*i-5)*u, yTop2, size, i==offset, highLight);
        }
    }
};

ui.prototype._drawKeyBoard = function () {
    core.lockControl();
    core.status.event.id = 'keyBoard';
    core.clearUI();
    core.playSound('打开界面');

    var offsetX = this.WIDTH % 2 == 0 ? 16 : 0, offsetY = this.HEIGHT % 2 == 0 ? 16 : 0;

    var width = 384, height = 320;
    var left = (this.PX_WIDTH - width) / 2 + offsetX, right = left + width;
    var top = (this.PX_HEIGHT - height) / 2 + offsetY, bottom = top + height;


    var isWindowSkin = this.drawBackground(left, top, right, bottom);
    core.setTextAlign('ui', 'center');
    core.setFillStyle('ui', core.arrayToRGBA(core.status.textAttribute.title));
    core.fillText('ui', '虚拟键盘', this.HALF_PX + offsetX, top + 35, null, this._buildFont(22, true));
    core.setFont('ui', this._buildFont(17, false));
    core.setFillStyle('ui', core.arrayToRGBA(core.status.textAttribute.text));
    var now = this.HALF_PY - 89 + offsetY;

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
            core.fillText('ui', line[i], core.ui.HALF_PX + 32*(i-5) + offsetX, now);
        }
        now+=32;
    });

    core.fillText("ui", "返回游戏", this.HALF_PX + 128 + offsetX, now-3, '#FFFFFF', this._buildFont(15, true));

    if (isWindowSkin)
        this._drawWindowSelector(core.status.textAttribute.background, this.HALF_PX + 92 + offsetX, now - 22, 72, 27);
    else
        core.strokeRoundRect('ui', this.HALF_PX + 92 + offsetX, now - 22, 72, 27, 6, core.status.globalAttribute.selectColor, 2);
}

////// 绘制状态栏 /////
ui.prototype.drawStatusBar = function () {
    this.uidata.drawStatusBar();
}

////// 绘制“数据统计”界面 //////
ui.prototype._drawStatistics = function (floorIds) {
    core.playSound('打开界面');
    var obj = this._drawStatistics_buildObj();
    if (typeof floorIds == 'string') floorIds = [floorIds];
    (floorIds || core.floorIds).forEach(function (floorId) {
        core.ui._drawStatistics_floorId(floorId, obj);
    });
    var statistics = core.status.hero.statistics;
    core.setFlag("__replayText__", true);
    core.drawText([
        this._drawStatistics_generateText(obj, "全塔", obj.total),
        this._drawStatistics_generateText(obj, "当前", obj.current),
        this._drawStatistics_generateText(obj, "标记（浏览地图时B键或左下角）", obj.marked),
        "当前总步数："+core.status.hero.steps+"，当前游戏时长："+core.formatTime(statistics.currTime)
        +"，总游戏时长"+core.formatTime(statistics.totalTime)
        +"。\n瞬间移动次数："+statistics.moveDirectly+"，共计少走"+statistics.ignoreSteps+"步。"
        +"\n\n总计通过血瓶恢复生命值为"+core.formatBigNumber(statistics.hp)+"点。\n\n"
        +"总计打死了"+statistics.battle+"个怪物，得到了"+core.formatBigNumber(statistics.money)+"金币，"+core.formatBigNumber(statistics.exp)+"点经验。\n\n"
        +"受到的总伤害为"+core.formatBigNumber(statistics.battleDamage+statistics.poisonDamage+statistics.extraDamage)
        +"，其中战斗伤害"+core.formatBigNumber(statistics.battleDamage)+"点"
        +(core.flags.statusBarItems.indexOf('enableDebuff')>=0?("，中毒伤害"+core.formatBigNumber(statistics.poisonDamage)+"点"):"")
        +"，领域/夹击/阻击/血网伤害"+core.formatBigNumber(statistics.extraDamage)+"点。",
        "\t[说明]1. 地图数据统计的效果仅模拟当前立刻获得该道具的效果。\n2. 不会计算“不可被浏览地图”的隐藏层的数据。\n" +
        "3. 不会计算任何通过事件得到的道具（显示事件、改变图块、或直接增加道具等）。\n"+
        "4. 在自定义道具（例如其他宝石）后，需在脚本编辑的drawStatistics中注册，不然不会进行统计。\n"+
        "5. 道具不会统计通过插入事件或useItemEvent实现的效果。\n6. 所有统计信息仅供参考，如有错误，概不负责。"
    ])
    core.removeFlag("__replayText__");
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
    var order = ["doors", "items", "tools", "constants", "equips"];
    ids.sort(function (a, b) {
        var c1 = order.indexOf(cls[a]), c2 = order.indexOf(cls[b]);
        if (c1==c2) return ori.indexOf(a)-ori.indexOf(b);
        return c1-c2;
    });
    var obj = {
        'monster': {
            'count': 0, 'money': 0, 'exp': 0, 'point': 0,
        },
        'count': cnt,
        'add': {
            'hp': 0, 'atk': 0, 'def': 0, 'mdef': 0
        }
    };
    return {ids: ids, cls: cls, ext: ext, total: core.clone(obj), current: core.clone(obj), marked: core.clone(obj)};
}

ui.prototype._drawStatistics_add = function (floorId, obj, x1, x2, value) {
    obj.total[x1][x2] += value || 0;
    if (floorId == core.status.floorId)
        obj.current[x1][x2] += value || 0;
    if (core.markedFloorIds[floorId])
        obj.marked[x1][x2] += value || 0;
}

ui.prototype._drawStatistics_floorId = function (floorId, obj) {
    core.extractBlocks(floorId);
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
    this._drawStatistics_add(floorId, obj, 'monster', 'exp', enemy.exp);
    this._drawStatistics_add(floorId, obj, 'monster', 'point', enemy.point);
    this._drawStatistics_add(floorId, obj, 'monster', 'count', 1);
}

ui.prototype._drawStatistics_items = function (floorId, floor, id, obj) {
    var hp=0, atk=0, def=0, mdef=0;
    if (obj.cls[id]=='items' && id!='superPotion') {
        var temp = core.clone(core.status.hero);
        core.setFlag("__statistics__", true);
        var ratio = core.status.thisMap.ratio;
        core.status.thisMap.ratio = core.clone(core.status.maps[floorId].ratio);
        try { eval(core.material.items[id].itemEffect); }
        catch (e) {}
        core.status.thisMap.ratio = ratio;
        hp = core.status.hero.hp - temp.hp;
        atk = core.status.hero.atk - temp.atk;
        def = core.status.hero.def - temp.def;
        mdef = core.status.hero.mdef - temp.mdef;
        core.status.hero = temp;
        // window.hero = core.status.hero;
        window.flags = core.status.hero.flags;
    }
    else if (obj.cls[id]=='equips') {
        var values = core.material.items[id].equip || {};
        atk = values.atk || 0;
        def = values.def || 0;
        mdef = values.mdef || 0;
    }
    if (id.indexOf('sword')==0 || id.indexOf('shield')==0 || obj.cls[id]=='equips') {
        var t = "";
        if (atk > 0) t += atk + core.getStatusLabel('atk');
        if (def > 0) t += def + core.getStatusLabel('def');
        if (mdef > 0) t += mdef + core.getStatusLabel('mdef');
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
    if (core.flags.statusBarItems.indexOf('enableMoney')>=0) text+="，总金币数"+data.monster.money;
    if (core.flags.statusBarItems.indexOf('enableExp')>=0) text+="，总经验数"+data.monster.exp;
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
        var name = ((core.material.items[key] || (core.getBlockById(key) || {}).event)||{}).name || key;
        text+=name+value+"个";
        if (obj.ext[key])
            text+="("+obj.ext[key]+")";
    })
    if (prev!="") text+="。";

    text+="\n";
    text+="共加生命值"+core.formatBigNumber(data.add.hp)+"点，攻击"
        +core.formatBigNumber(data.add.atk)+"点，防御"
        +core.formatBigNumber(data.add.def)+"点，护盾"
        +core.formatBigNumber(data.add.mdef)+"点。";
    return text;
}

////// 绘制“关于”界面 //////
ui.prototype._drawAbout = function () {
    return this.uidata.drawAbout();
}

////// 绘制帮助页面 //////
ui.prototype._drawHelp = function () {
    core.playSound('打开界面');
    core.clearUI();
    if (core.material.images.keyboard) {
        core.status.event.id = 'help';
        core.lockControl();
        core.setAlpha('ui', 1);
        core.fillRect('ui', 0, 0, this.PX_WIDTH, this.PX_HEIGHT, '#000000');
        core.drawImage('ui', core.material.images.keyboard, 32 * (this.H_WIDTH - 6), 32 * (this.H_HEIGHT - 6));
    }
    else {
        core.drawText([
            "\t[键盘快捷键列表]"+
            "[CTRL] 跳过对话   [Z] 转向\n" +
            "[X] "+core.material.items['book'].name + "   [G] "+core.material.items['fly'].name+"\n" +
            "[A] 读取自动存档   [W] 撤销读取自动存档\n" + 
            "[S/D] 存读档页面   [SPACE] 轻按\n" +
            "[V] 快捷商店   [ESC] 系统菜单\n" +
            "[T] 道具页面   [Q] 装备页面\n" +
            "[B] 数据统计   [H] 帮助页面\n" +
            "[R] 回放录像   [E] 显示光标\n" +
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
    if (core.dymCanvas[name]) {
        this.relocateCanvas(name, x, y);
        this.resizeCanvas(name, width, height);
        core.dymCanvas[name].canvas.style.zIndex = z;
        return core.dymCanvas[name];
    }
    var newCanvas = document.createElement("canvas");
    newCanvas.id = name;
    newCanvas.style.display = 'block';
    newCanvas.setAttribute("_left", x);
    newCanvas.setAttribute("_top", y);
    newCanvas.style.width = width * core.domStyle.scale + 'px';
    newCanvas.style.height = height * core.domStyle.scale + 'px';
    newCanvas.style.left = x * core.domStyle.scale + 'px';
    newCanvas.style.top = y * core.domStyle.scale + 'px';
    newCanvas.style.zIndex = z;
    newCanvas.style.position = 'absolute';
    newCanvas.style.pointerEvents = 'none';
    core.dymCanvas[name] = newCanvas.getContext('2d');
    core.maps._setHDCanvasSize(core.dymCanvas[name], width, height);
    core.dom.gameDraw.appendChild(newCanvas);
    return core.dymCanvas[name];
}

////// canvas重定位 //////
ui.prototype.relocateCanvas = function (name, x, y, useDelta) {
    var ctx = core.getContextByName(name);
    if (!ctx) return null;
    if (x != null) {
        // 增量模式
        if (useDelta) {
            x += parseFloat(ctx.canvas.getAttribute("_left")) || 0;
        }
        ctx.canvas.style.left = x * core.domStyle.scale + 'px';
        ctx.canvas.setAttribute("_left", x);
    }
    if (y != null) {
        // 增量模式
        if (useDelta) {
            y += parseFloat(ctx.canvas.getAttribute("_top")) || 0;
        }
        ctx.canvas.style.top = y * core.domStyle.scale + 'px';
        ctx.canvas.setAttribute("_top", y);
    }
    return ctx;
}

////// canvas旋转 //////
ui.prototype.rotateCanvas = function (name, angle, centerX, centerY) {
    var ctx = core.getContextByName(name);
    if (!ctx) return null;
    var canvas = ctx.canvas;
    angle = angle || 0;
    if (centerX == null || centerY == null) {
        canvas.style.transformOrigin = '';
    } else {
        var left = parseFloat(canvas.getAttribute("_left"));
        var top = parseFloat(canvas.getAttribute("_top"));
        canvas.style.transformOrigin = (centerX - left) * core.domStyle.scale + 'px ' + (centerY - top) * core.domStyle.scale + 'px';
    }
    if (angle == 0) {
        canvas.style.transform = '';
    } else {
        canvas.style.transform = 'rotate(' + angle +'deg)';
    }
    canvas.setAttribute('_angle', angle);
}

////// canvas重置 //////
ui.prototype.resizeCanvas = function (name, width, height, styleOnly) {
    var ctx = core.getContextByName(name);
    if (!ctx) return null;
    if (width != null) {
        if (!styleOnly) core.maps._setHDCanvasSize(ctx, width, null);
        ctx.canvas.style.width = width * core.domStyle.scale + 'px';
    }
    if (height != null) {
        if (!styleOnly) core.maps._setHDCanvasSize(ctx, null, height);
        ctx.canvas.style.height = height * core.domStyle.scale + 'px';
    }
    return ctx;
}
////// canvas删除 //////
ui.prototype.deleteCanvas = function (name) {
    if (name instanceof Function) {
        Object.keys(core.dymCanvas).forEach(function (one) {
            if (name(one)) core.deleteCanvas(one);
        });
        return;
    }

    if (!core.dymCanvas[name]) return null;
    core.dom.gameDraw.removeChild(core.dymCanvas[name].canvas);
    delete core.dymCanvas[name];
}

////// 删除所有动态canvas //////
ui.prototype.deleteAllCanvas = function () {
    return this.deleteCanvas(function () { return true; })
}
