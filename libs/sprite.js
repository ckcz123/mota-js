"use strict";
/*
    Sprite.js 包含：
    1. sprite： 对资源的注册管理
    2. spriteObj： 提供所有图块图标的渲染接口的对象，包括terr、items、enemys、icons、animates， 
    autotile和大地图贴图暂时不做（特殊的处理？）
    3. spriteRender： 提供对一组sprite的渲染处理方法，
        从直觉上来说，处于同一个render的sprite，应该具有相同的活跃度，因此有不同的刷新率
        因此可以认为应该有如下几个不同类型的render：
        静态的： 背景、墙、animate为1的block
        动态的： 怪物、勇士
        全局持续动态的：天气、特殊动画
        对这些render的管理，交由场景类进行


    可优化点：
    1. 部分清除/渲染（增加计算时间、减少渲染时间
    2. sprite图加载后就地切分，建立id-canvas的字典，避免反复对大图进行切分drawImage（减少渲染时间、增大运行时内存
    3. 去掉spriteObj的info，改为从sprite查询（减少运行时内存
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
function spriteRender(ctx){
    this._init(ctx);
}
///// ----- 资源管理 -----
sprite.prototype._init = function(){
    // example:
    this.sprite = sprite_90f36752_8815_4be8_b32b_d7fad1d0542e;
    
    // 兼容原来的部分图片并减少图片大小 如果是以下尺寸的精灵 将会附着到原有图片上 而非sprite上
    this.oldType = {
        '32,32,1':'terrains',
        '128,32,4':'animates',
        '64,32,2':'npcs',
        '128,48,4':'npc48',
    }
    // 资源x重定位 —— 如果出现比当前宽的sprite 则将其x定位为上一次的宽
    // 所以尽量先导入比较大的图，然后再导小图 减少空白
    // this.xhBias = this.sprite['__xhBias__']; // 需要存
    //if(!core.material.images.sprite)core.material.images.sprite = new Image();

    this.render = new spriteRender();
    this._load();
}

sprite.prototype._load = function(){
    this.assets = core.material.images.sprite;
    //this.render.destCtx = core.getContexByName('hero');
}

////// 注册一个精灵， 测试版 | TODO： 服务器交互 ///
//  自动元件需要单独处理
sprite.prototype._registerSprite = function(image, name, x, y, w, h, frame, line){
    if(!name || !image)return null;
    if(this.sprite[name]){main.log('替换重复的spirte命名：'+name);}
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

    var imageWidth = w*frame,
        imageHeight = h*line;
    // 获取资源图片
    var dimg = this.assets;
    var rect = imageWidth+','+imageHeight+','+frame;
    if(this.oldType[rect]){
        dimg = core.material.images[this.oldType[rect]];
        obj.oldType = this.oldType[rect];
    }
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = dimg.width < imageWidth ? imageWidth : dimg.width;
    canvas.height = dimg.height + h;
    // var dx=this.xhBias.x,dy=this.xhBias.h;
    var dx = 0, dy = dimg.height;
    // 寻找合适位置 | 
    /*
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
    */
    // （x）扩充规则： 如果当前宽度不足以容下新素材 则换新列；如果当前高度不足以容下新素材，增加高度(X
    // 新的扩充规则：直接堆叠，宽度不够就加长图片宽度，这样避免了使用xh变量，图片空余可以通过重排减少


    // 嵌入图片
    context.drawImage(dimg, 0, 0);
    context.drawImage(image, x, y, imageWidth, imageHeight, dx, dy, w, h);
    dimg.src = canvas.toDataURL("image/png");

    // 保存注册信息
    // obj.name = name;
    obj.x = dx;  obj.y = dy;
    this.sprite[name] = obj;

    dimg.src.onload = function(){
        // TODO: 回传服务器
    }
}

///// 取消注册并删除所在画布区域
sprite.prototype._unregisterSprite = function(name, arrangeDirectly){
    if(this.sprite[name]){
        var sprite = this.sprite [name];
        delete this.sprite [name];
        if(sprite.oldType){
            this._rearrangementOldtype(sprite);
        }
        else if(arrangeDirectly) // 删除后并不立即进行重排 因为重排开销较大 应该加一个脏标记表示需要重排 下次刷新的时候做
        {
            this._rearrangementSprite();
        }
    }
}

///// 对sprite.png进行重排 需要全重排 尽量保证空间消耗少
// 堆叠方法： 宽度从小到大纵向排列 高度取平均高度
sprite.prototype._rearrangementSprite = function(){
    var arrangeSprites = Object.values(this.sprite).filter(function(obj){return !obj.oldType});
    var heightBucket = {};
    var objBucket = {};
    var sumHeight = 0;
    var maxHeight = 0;
        arrangeSprites.forEach(function(obj) {
        var w =  obj.width*(obj.frame||1), h = obj.height*(obj.line || 1);
        heightBucket[w] = (heightBucket[w]||0) + h;
        objBucket[w] = objBucket[w] || [];
        objBucket[w].push(obj);
        sumHeight += h;
        maxHeight = maxHeight > h? maxHeight : h;
    });
    var widthArr = Object.keys(heightBucket).sort(function(a,b){return parseInt(a)-parseInt(b)});
    var avgHeight = Math.max(~~ sumHeight/widthArr.length, maxHeight);

    var drawQueue = [];
    var widthQueue = [];
    for(var i = 0; i < widthArr.length; i++){
        var w = parseInt(widthArr[i]);
        var h = heightBucket[w];
        if(h > avgHeight){ // 需要切分
            var tmpH = 0;
            var tmpArr = [];
            objBucket[w].forEach(function(obj) {
                if(tmpH + obj.height*(obj.line||1) > avgHeight){
                    widthQueue.push(w);
                    drawQueue.push(tmpArr);
                    tmpArr = [];
                }
                tmpArr.push(obj);
                tmpH += obj.height*(obj.line||1);
            })
            if(tmpArr.length>0){
                drawQueue.push(tmpArr);
                widthQueue.push(w);
            }
        }else if(i+1<widthArr.length && h + heightBucket[widthArr[i+1]].h < avgHeight){ //可以合并
            var tmpArr = objBucket[w];
            do{
                w = widthArr[i+1];
                h += heightBucket[w];
                tmpArr = tmpArr.concat(objBucket[w]);
                i++;
            }while(i+1<widthArr.length && h + heightBucket[widthArr[i+1]].h < avgHeight);
            drawQueue.push(tmpArr);
            widthQueue.push(w);
        }else{ // 只绘制当前列
            widthQueue.push(w);
            drawQueue.push(objBucket[w]);
        }
    }
    var image = core.material.images.sprite;
    this._rearrange_drawImageByWidthArray(image, drawQueue, widthQueue, avgHeight);
}

// 给定一个绘制sprite对象数组和一个宽度数组 将图像中的素材按宽度罗列堆叠
sprite.prototype._rearrange_drawImageByWidthArray = function(image, drawQueue, widthArr, height){
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = eval(widthArr.join("+"));
    ctx.canvas.height = height;
    var x_bias = 0, y_bias = 0;
    for(var i = 0;i<drawQueue.length; i++){
        y_bias = 0;
        drawQueue[i].forEach(function(obj) {
            var w = obj.width * (obj.frame || 1);
            var h = obj.height * (obj.line || 1);
            ctx.drawImage(image, obj.x, obj.y, w, h, x_bias, y_bias, w, h);
            obj.x = x_bias; obj.y = y_bias;
            y_bias += h;
        });
        x_bias += widthArr[i];
    };
    image.src = ctx.canvas.toDataURL('image/png');
}

///// 对oldtype.png进行重排 只需要将y大于删除对象的素材位移即可 如果不提供sprite 则需要全重排
sprite.prototype._rearrangementOldtype = function(delSprite){
    var arrangeSprites = Object.values(this.sprite);
    if(delSprite){
        var image = core.material.images[delSprite.oldType];
        var ctx = document.createElement("canvas").getContext("2d");
        var dy = delSprite.y;
        var dh = (delSprite.height||32)*(delSprite.line||1);
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height - dh;
        ctx.drawImage(image, 0, 0, image.width, dy, 0, 0, image.width, dy);
        var y_bias = dy;
        arrangeSprites
            .filter(function(obj){return obj.oldType == delSprite.oldType && obj.y > dy && obj !== delSprite})
            .sort(function(o1,o2) {return o1.y-o2.y}) /// 不知道为什么不排序就会出错
            .forEach(function(obj){
                ctx.drawImage(image, 0, obj.y, image.width, dh, 0, y_bias, image.width, dh);
                obj.y = y_bias;
                y_bias += dh;
            });
        core.material.images[delSprite.oldType].src = ctx.canvas.toDataURL('image/png');
    }else{
        Object.values(this.oldType).forEach(function(type) {
            var image = core.material.images[type];
            var ctx = document.createElement("canvas").getContext("2d");
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;
            var y_bias = 0;
            arrangeSprites
                .filter(function(obj) { return obj.oldType == type;})
                .sort(function(o1,o2) {return o1.y-o2.y})
                .forEach(function(obj) {
                    var w =  obj.width*(obj.frame||1), h = obj.height; // oldType 的line都是1，所以不用管高度
                    ctx.drawImage(image,
                        0, obj.y, w, h,
                        0, y_bias, w, h,
                    );
                    obj.y = y_bias;
                    y_bias += h;
                });
            var imgData = ctx.getImageData(0,0,ctx.canvas.width,y_bias);
            ctx.canvas.height = y_bias;
            ctx.putImageData(imgData,0,0);
            core.material.images[type].src = ctx.canvas.toDataURL('image/png');
        })
    }

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
// 此处的obj是数据对象 即不含方法的
// 这是一个渲染方法 因此spriteObj不应该有此方法
// obj : spirte data obj ctx : context bias : offset
sprite.prototype.drawSpriteToCanvas = function(obj, ctx, bias){
    bias = bias || {}
    var x = (obj.x || 0) + (obj.offsetX || 0) + (bias.x || 0);
    var y = (obj.y || 0) + (obj.offsetY || 0) + (bias.y || 0);
    /// var info = this.sprite[obj.info]; /// todo: 通用spriteInfo 减少内存开销
    if(obj.image && core.material.images[obj.image])
        ctx.drawImage(core.material.images[obj.image],
            obj.info.x+(obj.nFrame||0)*obj.info.width,
            obj.info.y+(obj.nLine||0)*obj.info.height,
            obj.info.width, obj.info.height,
            x, y,
            obj.width || obj.info.width,
            obj.height || obj.info.height
        );
    if(obj.children){
        // bias.x = (bias.x || 0) + obj.x;
        // bias.y = (bias.y || 0) + obj.y;
        obj.children.forEach(function(child) {core.drawSpriteToCanvas(child, ctx, bias)})
    }
}

///// 添加移动信息, 每次更新重绘时，会重新计算坐标（添加移动信息后 需要申请重绘直到停止） | 像素级
// obj | distance = [dx,dy] | speed :
// 移动完之后会调用callback


///// ------ 绘制 ------

sprite.prototype.getTempRenderSprite = function(ctx){
    return new spriteRender(ctx);
}

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
    return this.render.hasObj(obj);
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
sprite.prototype.updateRenderSprite = function(timeStamp){
    this.render.update(timeStamp);
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

spriteRender.prototype._init = function(ctx){
    this.dirty = false;
    if(ctx){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
    }else{
        this.canvas = document.createElement("canvas");
        this.canvas.width = core.__PIXELS__;
        this.canvas.height = core.__PIXELS__;
        this.ctx = this.canvas.getContext('2d');
    }
    this.objs = [];
    this.destCtx = null;
    this.mspf = 16;//core.flags.mspf;
    this.lastTime = null;
}
spriteRender.prototype.update = function(timeStamp){
    if(this.dirty){
        var timeDelta = 1;
        if(timeStamp){
            if(this.lastTime == null)this.lastTime = timeStamp;
            else{
                timeDelta = timeStamp - this.lastTime;
                if(timeDelta<this.mspf)return; // 没到刷新率 无需更新
                timeDelta = this.mspf/timeDelta;
            }
        }
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.dirty = false;
        var self = this;
        // 对运动中的对象重定位
        var callbackList = [];
        this.objs
            .filter(function(obj){return obj.move && !obj.move.stop})
            .forEach(function(obj){
                obj.moveAction(timeDelta);
                if(obj.move.done){
                    obj.stopMoving();
                    if(obj.move.callback)
                        callbackList.push(obj.move.callback);
                }
                self.reloacate(obj);
                // TODO: 优化定位速度 - 由于重定位导致画布dirty
            });
        this.objs.forEach(function(obj){
            obj.animateAction(timeDelta);
            core.drawSpriteToCanvas(obj, self.ctx);
        })
        this.refresh();
        if(callbackList.length>0){
            setTimeout(function(){
                callbackList.forEach(function(f){f();});
            });
        }
    }
}

///// refresh : 立即将缓存绘制到目标 注意，如果直接调用此函数 那么可能会是旧数据 可用于无需更新的静态场景
spriteRender.prototype.refresh = function(){
    if(this.destCtx){ // TODO: 也许不应该在此clearRect
        this.destCtx.clearRect(0,0,this.destCtx.canvas.width, this.destCtx.canvas.height);
        this.drawTo(this.destCtx);
    }
}

spriteRender.prototype.clear = function(){
    this.objs = [];
}

///// 重定向一个ctx作为绘制目标
spriteRender.prototype.redirectCtx = function(ctx){
    this.destCtx = ctx;
}

///// 对obj重定位
spriteRender.prototype.reloacate = function(obj, prior){
    var idx = this.objs.indexOf(obj);
    if(idx>=0)
        this.objs.splice(idx, 1);
    this.addNewObj(obj, prior);
}


///// TODO: 定位脏区 减少重绘次数
// 改名： 请求刷新
spriteRender.prototype.blur = function(){
    this.dirty = true;
}

///// 图块优先级: bottom * 1000 + width  越小越优先画
spriteRender.prototype.calcuPrior = function(obj){
    return (obj.priority || (obj.info.width||32) + 1000*(obj.y+obj.info.height));
}

// 只有添加到render中，sprite才是一个对象，否则只是一个数据
spriteRender.prototype.addNewObj = function(obj, prior){
    if(typeof obj === 'string'){
        obj = core.sprite.getSpriteObj(obj);
    }
    if(typeof prior != 'number'){
        prior = this.calcuPrior(obj);
    }else{
        obj.priority = prior; // 可以指定优先级 并且此优先级会持久化 可以用来做飞翔的鸟
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
spriteRender.prototype.hasObj = function(obj){
    return this.objs.indexOf(obj)>=0;
}
spriteRender.prototype.drawTo = function(ctx){
    ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
}















///// ----- 对象 ------ 从数据初始化，数据为位置信息和原始信息

spriteObj.prototype._init = function(){
    ;
}
spriteObj.prototype.playFrame = function(){
    this.nFrame = (this.nFrame+1)%(this.info.frame||1);
}

///// 添加移动信息 速度的单位是像素/帧 —— 帧率由画布决定
spriteObj.prototype.addMoveInfo = function(dx, dy, speed, callback){
    this.move = {
        'sx':this.x, 'sy':this.y,
        'realX':this.x, 'realY': this.y,
        'dx':dx, 'dy': dy,
        'xDir': dx>0?1:dx<0?-1:0,
        'yDir': dy>0?1:dy<0?-1:0,
        'speed':speed, 'lag': 0,
        'callback': callback,
    };
}


///// 添加帧动画自动播放信息
spriteObj.prototype.addAnimateInfo = function(speed, line){
    if(this.animate && !this.animate.stop){ // 如果已有动画且在播放 将添加到其尾部
        var lastCall = this.animate.callback;
        var self = this;
        this.animate.callback = function(){
            if(lastCall)lastCall();
            self.addAnimateInfo(speed,line);
        }
        return;
    }
    this.changeStatus(null, line);
    this.animate = {
        'speed': speed || 6, // 默认6帧(180ms)动一次，
        'lastTime': 0,
        'stop': false,
    }
}

///// 停止动画
spriteObj.prototype.stopAnimate = function(){
    if(this.animate)this.animate.stop = true;
}

///// 停止动画
spriteObj.prototype.stopMoving = function(){
    if(this.move)this.move.stop = true;
}

/////
spriteObj.prototype.resetFrame = function(){
    this.nFrame = 0;
}

///// 复位： changeStatus(0)
spriteObj.prototype.changeStatus = function(nFrame, nLine){
    if(core.isset(nFrame))this.nFrame = nFrame % this.info.frame;
    if(core.isset(nLine))this.nLine = nLine % this.info.line;
}

////// 渲染与数据的一个耦合点：timeDelta - 距离上次绘制过去的
spriteObj.prototype.moveAction = function(timeDelta){
    if(this.move && !this.move.stop && !this.move.done){
        timeDelta = timeDelta || 1;
        var step = this.move.speed * timeDelta;
        //this.move.realX += this.move.xDir * step;
        //this.move.realY += this.move.yDir * step;
        var xDir = this.move.xDir,
            yDir = this.move.yDir;
        this.x += ~~(xDir * step);
        this.y += ~~(yDir * step);
        if(
            (this.x-this.move.sx)*xDir >= (this.move.dx)*xDir
            &&
            (this.y-this.move.sy)*yDir >= (this.move.dy)*yDir
        ){
            this.x = this.move.sx + this.move.dx;
            this.y = this.move.sy + this.move.dy;
            this.move.done = true; // TODO: 告诉渲染器移动完了 把回调统一放到后面处理 还是立即setTimeOut?
        }
    }
}

////// timeDelta —— 其实就是帧差 如果无误应该是1 但是如果卡了或者机器比较垃圾就会大于1
spriteObj.prototype.animateAction = function(timeDelta){
    if(this.animate && !this.animate.stop){
        timeDelta = timeDelta || 1;
        var diff = timeDelta+this.animate.lastTime - this.animate.speed;
        if(diff > 0){
            this.animate.lastTime = diff;
            this.playFrame()
        }else{
            this.animate.lastTime += timeDelta;
        }
    }
}

///// 绘制到指定位置 (x
spriteObj.prototype.drawToCanvas = function(ctx,bias){
    core.drawSpriteToCanvas(this,ctx,bias);
}
///// 绘制到地图 以对称轴为中心线 (x
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

