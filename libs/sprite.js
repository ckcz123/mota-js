"use strict";
/*
    Sprite.js 包含：
    1. sprite： 对资源的注册管理
    2. spriteObj： 提供所有图块图标的渲染接口的对象，包括terr、items、enemys、icons、animates， 
    autotile和大地图贴图暂时不做（特殊的处理？）
    3. spriteRender
*/
function sprite() {
    this._init();
}
function spriteObj(info, image){
    this.x = -100; this.y = -100;
    this.info = info;
    this.nFrame = 0;
    this.nLine = 0;
    this.image = image;
}
function spriteRender(){
    this._init();
}
///// ----- 资源管理 -----
sprite.prototype._init = function(){
    // example:
    this.sprite = sprite_90f36752_8815_4be8_b32b_d7fad1d0542e;
    
    // 兼容原来的部分图片并减少图片大小 如果是以下尺寸的精灵 将会附着到原有图片上 而非sprite上
    this.oldType = {
        '32,32,1':'terrains',
        '128,32,4':'animates',
        '64,32,2':'npc',
        '128,48,4':'npc48',
    }
    // 资源x重定位 —— 如果出现比当前宽的sprite 则将其x定位为上一次的宽
    // 所以尽量先导入比较大的图，然后再导小图 减少空白
    this.xhBias = this.sprite['__xhBias__']; // 需要存
    //if(!core.material.images.sprite)core.material.images.sprite = new Image();

    this.render = new spriteRender();
    this._load();
}

sprite.prototype._load = function(){
    this.assets = core.material.images.sprite;
    //this.render.destCtx = core.getContexByName('hero');
}

////// 注册一个精灵， 测试版 | TODO： 服务器交互 //////
sprite.prototype._registerSprite = function(image, name, x, y, w, h, frame, line){
    if(!name || !image)return null;
    if(this.sprite[name]){main.log('重复的spirte命名：'+name);}
    x = x || 0;
    y = y || 0;
    w = w || 32;
    h = h || 32;
    frame = frame || 1;
    line = line || 1;
    var obj = {
        'width': w,
        'height': h,
        'frame': frame,
        'line': line,
    };

    w*=frame; h*= line;
    // 获取资源图片
    var dimg = this.assets;
    var rect = w+','+h+','+frame;
    if(this.oldType[rect]){
        dimg = core.material.images[this.oldType[rect]];
        obj.oldType = this.oldType[rect];
    }
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = dimg.width; canvas.height = dimg.height;
    context.drawImage(dimg, 0, 0);
    var dx=this.xhBias.x,dy=this.xhBias.h;
    // 寻找合适位置 | 
    // 扩充规则： 如果当前宽度不足以容下新素材 则换新列；如果当前高度不足以容下新素材，增加高度
    if(dimg===this.assets){
        if(dx+w > canvas.width){
            dx = canvas.width;
            canvas.width += w;
            this.xhBias.x = x;
            this.xhBias.h = 0;
        }
        dy = this.xhBias.h;
        if(dy+h > canvas.height){
            canvas.height += h;
        }
        this.xhBias.h += h;
    }else{
        dx = 0; dy = canvas.height;
        canvas.height += h;
    }

    // 嵌入图片
    context.drawImage(image, x, y, w, h, dx, dy, w, h);
    dimg.src = canvas.toDataURL("image/png");

    // 保存注册信息
    obj.name = name;
    obj.x = x;  obj.y = y;
    this.sprite[name] = obj;

    // TODO: 回传服务器
}

////// 依据行列状态 获取一个精灵图的frame 返回img x y w h //////
sprite.prototype.getSpriteFrame = function(name, frame, line){
    var info = this.sprite[name];
    frame = frame || 0;
    line = line || 0;
    if(!info)return null;
    return {
        'image': info.oldType?core.material.images[info.oldType]:this.assets,
        'x': info.x + info.width*Math.min(info.frame-1,frame),
        'y': info.y + info.height*Math.min(info.line-1,line),
        'width': info.width,
        'height':info.height,
    }
}

///// 获取一个常驻的精灵对象 支持一系列操作 /////
sprite.prototype.getSpriteObj = function(name){
    var info = this.sprite[name];
    if(!info)return null;
    return new spriteObj(info, info.oldType?info.oldType:'sprite');
}


///// ------ sprite纯数据对象操作 -----
sprite.prototype.playSpriteObj = function(obj){
    obj.nFrame = (obj.nFrame+1)%(obj.info.frame||1);
}
///// 改变sprite状态
sprite.prototype.changeSpriteStatus = function(obj, nFrame, nLine){
    if(core.isset(nFrame))obj.nFrame = nFrame % obj.info.frame;
    if(core.isset(nLine))obj.nLine = nLine % obj.info.line;
}

///// 绘制spirte到指定位置
sprite.prototype.drawSpriteToCanvas = function(obj, ctx, bias){
    bias = bias || {}
    var x = (obj.x || 0) + (obj.offsetX || 0) //+ (bias.x || 0);
    var y = (obj.y || 0) + (obj.offsetY || 0) //+ (bias.y || 0);
    /// var info = this.sprite[obj.info]; /// todo: 通用spriteInfo 减少内存开销
    if(obj.image && core.material.images[obj.image])
        ctx.drawImage(core.material.images[obj.image],
            obj.info.x+(obj.nFrame||0)*obj.info.width,
            obj.info.y+(obj.nLine||0)*obj.info.height,
            obj.info.width, obj.info.height,
            x,y,
            obj.width || obj.info.width,
            obj.height || obj.info.height
        );
    if(obj.children){
        bias.x = (bias.x || 0) + obj.x;
        bias.y = (bias.y || 0) + obj.y;
        obj.children.forEach(function(child) {core.drawSpriteToCanvas(child, ctx, bias)})
    }
}

///// ------ 绘制 ------
///// 添加对象到当前的渲染队列
sprite.prototype.addRenderSpriteObj = function(obj){
    this.render.addNewObj(obj);
}
/////
sprite.prototype.deleteRenderSpriteObj = function(obj){
    this.render.deleteObj(obj);
}
/////
sprite.prototype.hasRenderSpriteObj = function(obj){
    return this.render.objs.indexOf(obj)>=0;
}
/////
sprite.prototype.relocateRenderSpriteObj = function(obj, prior){
    this.render.reloacate(obj, prior);
}
/////
sprite.prototype.blurRenderSprite = function(){
    this.render.blur();
}

/////
sprite.prototype.updateRenderSprite = function(blur){
    this.render.update(blur);
}

/////
sprite.prototype.drawRenderSprite = function(ctx){
    this.render.drawTo(ctx);
}

/////
sprite.prototype.clearRenderSprite = function(){
    this.render.clear();
}



///// ----- 渲染 -----

spriteRender.prototype._init = function(){
    this.dirty = false;
    this.canvas = document.createElement("canvas");
    this.canvas.width = core.__PIXELS__;
    this.canvas.height = core.__PIXELS__;
    this.ctx = this.canvas.getContext('2d');
    this.objs = [];
}
spriteRender.prototype.update = function(blur){
    if(this.dirty || blur){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.dirty = false;
        var self = this;
        this.objs.forEach(function(obj){
            core.drawSpriteToCanvas(obj, self.ctx);
            //if(!obj.toMap) obj.drawToCanvas(self.ctx);
            //else obj.drawToMap(self.ctx, obj.x, obj.y);
        })
        if(this.destCtx){
            this.destCtx.clearRect(0,0,this.destCtx.canvas.width, this.destCtx.canvas.height);
            this.drawTo(this.destCtx);
        }
    }
}
spriteRender.prototype.clear = function(){
    this.objs = [];
}

spriteRender.prototype.reloacate = function(obj, prior){
    var idx = this.objs.indexOf(obj);
    if(idx>=0)
        this.objs.splice(idx, 1);
    this.addNewObj(obj, prior);
}

spriteRender.prototype.blur = function(){
    this.dirty = true;
}

///// 图块优先级: bottom * 1000 + width  越小越优先画
spriteRender.prototype.calcuPrior = function(obj){
    return (obj.info.width||32) + 1000*(obj.y+obj.info.height);
}
spriteRender.prototype.addNewObj = function(obj, prior){
    if(typeof obj === 'string'){
        obj = core.sprite.getSpriteObj(obj);
    }
    if(typeof prior != 'number'){
        prior = this.calcuPrior(obj);
    }
    var index = this.objs.length;
    for(var i in this.objs){
        if(this.calcuPrior(this.objs[i]) >= prior){
            index = i;
            break;
        }
    }
    this.objs.splice(index, 0, obj);
    this.blur();
}
spriteRender.prototype.deleteObj = function(obj){
    var idx = this.objs.indexOf(obj);
    if(idx>=0)this.objs.splice(idx, 1);
    this.blur();
}
spriteRender.prototype.drawTo = function(ctx){
    ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
}














/*
///// ----- 对象 ------

spriteObj.prototype._init = function(){
    ;
}
spriteObj.prototype.playFrame = function(){
    this.nFrame = (this.nFrame+1)%(this.info.frame||1);
}
spriteObj.prototype.changeStatus = function(nFrame, nLine){
    if(core.isset(nFrame))this.nFrame = nFrame % this.info.frame;
    if(core.isset(nLine))this.nLine = nLine % this.info.line;
}

///// 绘制到指定位置
spriteObj.prototype.drawToCanvas = function(ctx,pos){
    pos = pos || this;
    var x = (pos.x || 0) + (pos.offsetX || 0);
    var y = (pos.y || 0) + (pos.offsetY || 0);
    if(pos!==this)this.changeStatus(pos.nFrame, pos.nLine);
    ctx.drawImage(this.image,
        this.info.x+this.nFrame*this.info.width,
        this.info.y+this.nLine*this.info.height,
        this.info.width, this.info.height,
        x,y,
        this.info.width,
        this.info.height
    );
}
///// 绘制到地图 以对称轴为中心线
spriteObj.prototype.drawToMap = function(ctx,x,y,w,h){
    w = w || this.info.width;
    h = h || this.info.height;
    var destX = x*32+16 - ~~(w/2+0.5);
    var destY = (y+1)*32 - h;
    ctx.drawImage(this.image, this.info.x+this.nFrame*this.info.width, this.info.y+this.nLine*this.info.height, this.info.width, this.info.height, destX,destY,w||this.info.width,h || this.info.height);
}
///// 绑定一个对象 具有x、y、offsetX、offsetY
//spriteObj.prototype.bindPosition = function(pos){
//    this.position = pos;
//}

*/