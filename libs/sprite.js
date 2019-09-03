"use strict";

var SSPrite = PIXI.Sprite;
var PSprite = PIXI.AnimatedSprite;
var Container = PIXI.Container;
var Texture = PIXI.Texture;
var Rectangle = PIXI.Rectangle;
/*
    sprite.js 包含：
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
    4. canvasRender: 对一个离屏canvas的渲染器，适用于慢更新图层


    可优化点：
    1. 部分清除/渲染（增加计算时间、减少渲染时间
    2. sprite图加载后就地切分，建立id-canvas的字典，避免反复对大图进行切分drawImage（减少渲染时间、增大运行时内存
    3. 去掉spriteObj的info，改为从sprite查询（减少运行时内存
*/
function sprite() {
    this._init();
}
function spriteObj(texture, image){
    this._init(texture,image);
}
function spriteRender(ctx){
    this._init(ctx);
}
function canvasRender(ctx){
    this._init(ctx);
}
///// 精灵的观察对象s
function subject(){
    this._init();
}

function spriteObserver(sobj){

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
        '?,?,?':'hero',
        '?,96,?':'autotile',
    }
    // 资源x重定位 —— 如果出现比当前宽的sprite 则将其x定位为上一次的宽
    // 所以尽量先导入比较大的图，然后再导小图 减少空白
    // this.xhBias = this.sprite['__xhBias__']; // 需要存
    //if(!core.material.images.sprite)core.material.images.sprite = new Image();

    this.render = new spriteRender();
//    this._load();
}

sprite.prototype._load = function(){
    this.assets = core.material.images.sprite;

    this._generateTextures()
    //this.render.destCtx = core.getContexByName('hero');
}


///// 生成材质后 原来的sprite全部需要重新链接
sprite.prototype._generateTextures = function() {
    this.textures = this.textures || {}; // 存储各个动画对应的textrues数组
    var baseTextures = this.baseTextures || {};
    for(var i in this.oldType){
        var type = this.oldType[i];
        baseTextures[type] = Texture.from(core.material.images[type]);
    }
    baseTextures['sprite'] = Texture.from(core.material.images.sprite);
    this.baseTextures = baseTextures;
    for(var id in this.sprite){
        var it = this.sprite[id];
        var type = it.oldType || 'sprite';
        var nf = it.frame||1;
        var nl= it.line||1;
        var tmp = [];
        var width = it.width || 32;
        var height = it.height || 32;

        var org = new Rectangle(it.x||0, it.y||0, width*it.frame, width*it.line);
        for(var i = 0; i<nl; i++){
            var line = [];
            for(var j = 0; j<nf; j++){
                line.push(
                    new Texture(baseTextures[type],
                        new Rectangle(org.x+j*width,org.y+i*height,width,height)
                    )
                );
            }
            tmp.push(line);
        }
        this.textures[id] = tmp;
    }
}


////// 绘制Autotile //////
sprite.prototype.getAutotileSprite = function(name,sx,sy,sw,sh){
    var base = this.textures[name] || null;
    if(!base)return null;
    var arr = [];
    for(var i in base[0]){
        arr.push(
            new Texture(base[0][i], new Rectangle(sx+base[0][i].frame.x,sy+base[0][i].frame.y,sw,sh))
        );
    }
    // ! 自动元件的动画是绑定的 无需自己添加动画 也不能添加动画
    var ret = new PSprite(arr);
    ret.animationSpeed = 0.05;
    ret.play();
    return ret;
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
    var texture = this.textures[name];//this.sprite[name];
    if(!texture) return this.getEmptySprite(name); //不存在的素材 返回空（作为容器存在）
    return new spriteObj(texture,{name:name});
}

sprite.prototype.getEmptySprite = function(name){
    return new Container();
}
sprite.prototype.getSpriteFromImage = function(image){
    return SSPrite.from(image);
}

sprite.prototype.getSpriteFromFrameImage = function(image, frame, width){
    var t = Texture.from(image, new Rectangle(0,0,width,image.height));
    return SSPrite.from(image);
}

sprite.prototype.createCanvasRender = function(canvas){
    return new canvasRender(canvas);
}

///// ------ sprite纯数据对象操作 -----
sprite.prototype.playSpriteObj = function(obj){
    obj.nFrame = (obj.nFrame+1)%(obj.info.frame||1);
}
///// 改变sprite状态
sprite.prototype.changeSpriteStatus = function(obj, nFrame, nLine){
    obj.changePattern(nFrame, nLine)
}

///// 绘制spirte到指定位置
// 此处的obj是数据对象 即不含方法的
// 这是一个渲染方法 因此spriteObj不应该有此方法
// obj : spirte data obj ctx : context bias : offset
// 循环中抛弃此方法 这个仅用于通过名字绘图
sprite.prototype.drawSpriteToCanvas = function(obj, ctx, bias){
    if(typeof obj != 'string')return;
    bias = bias || {}
    var x =(bias.x || 0);
    var y =(bias.y || 0);
    /// var info = this.sprite[obj.info]; /// todo: 通用spriteInfo 减少内存开销
    if(this.sprite [obj]){
        var info = this.sprite [obj];
        var img = info.oldType || 'sprite';
        if(core.material.images[img]){
            ctx.drawImage(core.material.images[img],
                info.x, info.y,
                info.width, info.height,
                x, y,
                bias.width || info.width,
                bias.height || info.height
            );
        }
    }
    return;

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

    if(obj.special){
        ctx.restore();
    }
}

///// 添加移动信息, 每次更新重绘时，会重新计算坐标（添加移动信息后 需要申请重绘直到停止） | 像素级
// obj | distance = [dx,dy] | speed :
// 移动完之后会调用callback


///// ------ 绘制 ------

sprite.prototype.getNewRenderSprite = function(ctx){
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
    this.render.relocate(obj, prior);
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

///// !! 一个怪异点： block的存读导致其对象信息的丢失
// 解决思路
// 1. 初始化block时改变其原型——问题：clone会丢失
// 2.  全部改成全局函数——问题：管理混乱

///// sobj成为一个被观察者

///// sobj成为一个被观察者 可以对dobj发出通知时进行行动 —— 注意： sobj必须是纯数据对象
sprite.prototype.becomeSubject = function(sobj){
    Object.setPrototypeOf(sobj, subject.prototype);
    sobj._init();
}



///// 检查是否是subject不是就
sprite.prototype.notifyObservers = function(sobj, type, params){
    if(sobj.observe_actions[type]){
        var t = type;
        arguments[1] = sobj;
        for (var i = 0;i < this.observers.length; i++) {
            this.observe_actions[t].apply(this.observers[i], Array.prototype.slice.call(arguments, 1));
        }
    }
}



///// ----- 渲染分组 -----

///// 纯图片的渲染层 远景、前景图/伤害/
canvasRender.prototype = Object.create(SSPrite.prototype);
canvasRender.prototype.constructor = canvasRender;
canvasRender.prototype._init = function(canvas){
    SSPrite.call(this, Texture.from(canvas));
}
canvasRender.prototype.updateTexture = function(canvas){
    if(canvas)this.textrure = Texture.from(canvas);
    else this.texture.update();
}
canvasRender.prototype.clear = function() {
}

///// 精灵渲染层
spriteRender.prototype = Object.create(Container.prototype);
spriteRender.prototype.constructor = spriteRender;

spriteRender.prototype._init = function(name){
    Container.call(this)
    this.name = name
    this.dirty = false;
    this.sortableChildren = true;
    this.objs = this.children;
    this.mspf = 1;//core.flags.mspf;
    this.lastTime = 0;
}

/////
spriteRender.prototype.requestUpdate = function(){
    this.changed = true;
}

/////
spriteRender.prototype.updateData = function(timeDelta) {
    var self = this;
    var callbackList = [];
    this.objs.forEach(function(obj){
        if(!obj.updateAction)return;
        obj.updateAction(timeDelta);
        if(obj.endOneStep()){
            obj.stopMoving();
            if(obj.move.callback)
                callbackList.push(obj.move.callback);
        }
        if(obj.isMoving()){
            self.relocate(obj);
        }
    })
    if(callbackList.length>0){
        //setTimeout(function(){
            callbackList.forEach(function(f){f();});
        //});
    }
}
///// dirty是由外部驱动的 表示需要它【保持】更新 needUpdate是内部判断的——当前内容是否值得更新
spriteRender.prototype.update = function(time){
    this.updateData(time);
    return;


    var timeDelta = 1;
    if(time){
        this.lastTime += time/this.mspf;
        timeDelta = this.lastTime;
    }
    if(timeDelta>=1){
        this.lastTime =  0;//1 - timeDelta;
    }
    return;

    if(this.dirty){

        if(false){
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height); // TODO:  pixi
            // this.dirty = false;
            // 绘制背景
            if(this.backImage)
                this.ctx.drawImage(this.backImage,0,0);
            var self = this;
            this.objs.forEach(function(obj){
                core.drawSpriteToCanvas(obj, self.ctx);
            })
            this.refresh();
        }
    }
}

///// refresh : 立即将缓存绘制到目标 注意，如果直接调用此函数 那么可能会是旧数据 可用于无需更新的静态场景
spriteRender.prototype.refresh = function(){
    if(this.destCtx){ // TODO: 也许不应该在此clearRect?
        this.destCtx.clearRect(0,0,this.destCtx.canvas.width, this.destCtx.canvas.height);
        this.drawTo(this.destCtx);
    }
}

spriteRender.prototype.clear = function(){
    this.objs.forEach(function(c){
        if(c.subject)
            c.subject.remove(c); // 从观察者列表中移除自身
    })
    this.removeChildren();
}

///// 重定向一个ctx作为绘制目标
spriteRender.prototype.redirectCtx = function(ctx){
    this.destCtx = ctx;
}

///// 添加一个静态背景 每次重绘的时候先画一次背景
spriteRender.prototype.addBackImage = function(bg){
    this.backImage = bg;
}

///// 添加一个静态背景 每次重绘的时候先画一次背景
spriteRender.prototype.getBackCanvas = function(){
    if(this.backImage)return this.backImage.getContext('2d');
    else return this.createBackCanvas();
}

///// 添加一个静态背景 每次重绘的时候先画一次背景
spriteRender.prototype.createBackCanvas = function(){
    var canvas = document.createElement("canvas");
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    this.backImage = canvas;
    return canvas.getContext('2d');
}


///// 对obj重定位
spriteRender.prototype.relocate = function(obj, prior){
    obj.zIndex = prior || this.calcuPrior(obj);
    obj.sortDirty = true;
    // var idx = this.objs.indexOf(obj);
    // if(idx>=0)
    //    this.objs.splice(idx, 1);
    // this.addNewObj(obj, prior);
}


///// TODO: 定位脏区 减少重绘次数
// 改名：启动
spriteRender.prototype.blur = function(){
    this.dirty = true;
}

///// 图块优先级: bottom * 1000 + width  越小越优先画
spriteRender.prototype.calcuPrior = function(obj){
    return (obj.priority || (obj.texture.width||32) + 1000*(obj.y+obj.texture.height));
}

// 只有添加到render中，sprite才是一个对象，否则只是一个数据
spriteRender.prototype.addNewObj = function(obj, prior){
    if(typeof obj === 'string'){
        obj = core.sprite.getSpriteObj(obj);
    }else if(!obj.prototype){ // 纯数据转换成对象
        Object.setPrototypeOf(obj, spriteObj.prototype);
    }
    if(typeof prior != 'number'){
        obj.zIndex = this.calcuPrior(obj);
    }else{
        obj.zIndex = prior; // 可以指定优先级 并且此优先级会持久化 可以用来做飞翔的鸟
    }
    this.addChild(obj);
    // this.addChildAt(obj, index);
    /*
    var index = this.objs.length;
    for(var i in this.objs){
        if(this.objs[i].zIndex >= obj.zindex){
            index = i;
            break;
        }
    }*/
    // this.objs.splice(index, 0, obj);
    obj.changed = true;
}
spriteRender.prototype.deleteObj = function(obj){
    this.removeChild(obj);
    // var idx = this.objs.indexOf(obj);
    // if(idx>=0)this.objs.splice(idx, 1);
    // this.blur();
}
spriteRender.prototype.hasObj = function(obj){
    return this.objs.indexOf(obj)>=0;
}

// CTX是场景
spriteRender.prototype.drawTo = function(stage){
    stage.addChild(this);
    //ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

spriteRender.prototype.reloadCanvas = function(){
    this.objs.forEach(function(obj) {
        obj.updateTexture();
    })
}

///// ----- 对象 ------ 从数据初始化，数据为位置信息和原始信息

spriteObj.prototype = Object.create(PSprite.prototype);
spriteObj.prototype.constructor = spriteObj;

spriteObj.prototype._init = function(texture, extra){
    PSprite.call(this, texture[0], false);
    this.name = extra.name;
    this.image = texture;
    this.info = {
        'line': texture.length,
        'frame': texture[0].length,
    }
    this.x = -100; this.y = -100;
    this.anchor.set(0.5, 1);
    // this.info = info;
    this.nFrame = 0;
    this.nLine = 0;
    this._stopCount = 0;
    this._waitCount = 0;
    // this.image = image;
}


///// 手动操作的帧播放
spriteObj.prototype.playFrame = function(){
    var d = (this.animate||{}).inverse ? -1 : 1;
    this.nFrame = (this.nFrame+d+this.totalFrames)%(this.totalFrames);
    this.changePattern(this.nFrame);
}
spriteObj.prototype.playFrameOneTime = function(){
    this.playFrame();
    if(this.animate.inverse && this.nFrame==this.totalFrames-1){
        this.nFrame = 0;
        this.changePattern(this.nFrame);
        return true;
    }
    if(!this.animate.inverse && this.nFrame==0){
        this.nFrame = this.totalFrames-1;
        this.changePattern(this.nFrame);
        return true;
    }
    return false;
}

spriteObj.prototype.playFading = function() {
    if (this.animate.fade) { ///// 渐变 需要指定每次渐变的量
        this.alpha = core.clamp(this.alpha + this.animate.fade, 0, 1);
        //this.sortDirty = true;
        if (this.alpha <= 0 || this.alpha >= 1) {
            return true;
        }
    }
}

///// 添加移动信息 速度的单位是像素/帧 —— 帧率由画布决定
spriteObj.prototype.addMoveInfo = function(dx, dy, speed, callback, info){
    info = info || {};
    var dist = Math.abs(dx+dy);
    this.move = {
        'sx':this.x, 'sy':this.y,
        'realX':this.x, 'realY': this.y,
        'destX':this.x + dx, 'destY': this.y + dy,
        'dx':dx, 'dy': dy,
        'xDir': dx>0?1:dx<0?-1:0,
        'yDir': dy>0?1:dy<0?-1:0,
        'speed':dist/speed, 'lag': 0,
        'animate': true,
        'startStep': false,
        'callback': callback,
    };
    for(var i in info){
        this.move[i] = info[i];
    }
    if(this.move.animate){
        this._maxWaitCount = 4;
    }else{
        this._maxWaitCount = -1;
    }
}

///// 添加特效信息
spriteObj.prototype.setAlpha = function(alpha){
    this.alpha = alpha;
    // this.special = this.special || {};
    // this.special['globalAlpha'] = alpha;
}
///// 添加
spriteObj.prototype.setBlendMode = function(mode){
    this.blendMode = mode;
    //    this.special = this.special || {};
//    this.special['globalCompositeOperation'] = mode;
}

// TODO: https://www.w3school.com.cn/tags/canvas_globalcompositeoperation.asp


///// 添加帧动画自动播放信息 speed是帧率
spriteObj.prototype.addAnimateInfo = function(info){
    info = info || {};
    if(this.animate && !this.animate.stop){ // 如果已有动画且在播放 将添加到其尾部(所以添加一次性动画一定要先stop
        var lastCall = this.animate.callback;
        var self = this;
        this.animate.callback = function(){
            if(lastCall)lastCall();
            self.addAnimateInfo(info);
        }
        return;
    }
    if(info.onetime)info.frame =info.inverse?this.totalFrames-1:0;
    this.changePattern(info.frame, info.line);
    // 几个会覆盖的信息：包括callback（即，一次性动画用掉callback后，原来的就没了
    this.animate = {
        'lastTime': 0,
        'stop': info.stop || false,
        'speed': info.speed || 20,
        'callback': info.callback || null,
    }
    if(info.fade)this.animate.lastFadeTime = 0;
    for(var it in info){
        this.animate[it] = info[it];
    }
    this.animationSpeed = this.animate.speed;
    if(this.animate.auto){ // 自动播放 无需轮询??
        this.play();
    }else{
        this.loop = false;
    }
}

///// 停止动画
spriteObj.prototype.stopAnimate = function(){
    if(this.animate)
        this.animate.stop = true;
    this.gotoAndStop(this.nFrame);
}

///// 停止移动
spriteObj.prototype.stopMoving = function(){
    if(this.move)this.move.stop = true;
}

/////
spriteObj.prototype.resetFrame = function(){
    this.nFrame = 0;
    this.gotoAndStop(this.nFrame);
}

///// 复位： changePattern(0)
spriteObj.prototype.changePattern = function(nFrame, nLine){
    if(core.isset(nFrame))this.nFrame = nFrame % this.totalFrames;
    if(core.isset(nLine))this.nLine = nLine % this.image.length;
    this.textures = this.image[this.nLine]
    this.gotoAndStop(this.nFrame);
}


spriteObj.prototype.hasStepAnimate = function(){
    return this.move.animate;
}

spriteObj.prototype.isMoving = function(){
    return this.move && !this.move.stop && !this.move.done;
}

spriteObj.prototype.isStoping = function(){
    return !this.isMoving();
}

///// 刚刚结束一步的移动
spriteObj.prototype.endOneStep = function(){
    return this.move && !this.move.stop && this.move.done;
}


spriteObj.prototype.getSpeed = function(){
    return this.move.speed;
}


spriteObj.prototype.setPositionWithBlock = function(block){
    this.x = block.x * core.__BLOCK_SIZE__ + core.__HALFBLOCK_SIZE__ ;
    this.y = (block.y+1) * core.__BLOCK_SIZE__;
}

//////
var fcount = 0;
var timeCount = 0;
spriteObj.prototype.moveAction = function(timeDelta){
    if(this.isMoving()){
        fcount ++;
        timeCount += timeDelta;
        if(timeCount>=1000){
            console.log(fcount);
            fcount = 0;
            timeCount = 0;
        }
        var step = this.move.speed*timeDelta;
        if(this.move.dx < 0){
            this.move.realX = Math.max(this.move.realX - step, this.move.destX);
        }
        if(this.move.dx > 0){
            this.move.realX = Math.min(this.move.realX + step, this.move.destX);
        }
        if(this.move.dy < 0){
            this.move.realY = Math.max(this.move.realY - step, this.move.destY);
        }
        if(this.move.dy > 0){
            this.move.realY = Math.min(this.move.realY + step, this.move.destY);
        }
        if(this.move.bigmap){ // 是否有大地图偏移
            core.scrollBigMap(~~this.move.realX - this.x, ~~this.move.realY - this.y);
            // core.setCentralViewPoint(this.x,this.y);
        }
        this.x = ~~this.move.realX;
        this.y = ~~this.move.realY;
        if(this.x == this.move.destX && this.y == this.move.destY){
            this.move.done = true;
        }
        return true;
    }
}

///// 是否需要更新？ —— 有动作信息的才更新
spriteObj.prototype.needUpdate = function(){
    return this.animate || this.move;
}

///// 更新sprite动作
spriteObj.prototype.updateAction = function(timeDelta){
    if(!this.needUpdate())return;
    this.updatePattern();
    this.moveAction(timeDelta);
    this.animateAction(timeDelta);
}

///// 更新模式，在走路过程中 只要等待到一定帧数就会加一步 如果停下来了就会复位
spriteObj.prototype.updatePattern = function() {
    if(this.isStoping())
        this._stopCount++;
    if(!this.isAnimating() && this._maxWaitCount > 0){
        this._waitCount += 1;
        if(this._waitCount>=this._maxWaitCount){
            this._waitCount = 0;
            if(this.isMoving()){
                this.playFrame();
            }
            else if(this._stopCount>=this._maxWaitCount){
                this.resetFrame();
                this._stopCount = 0;
            }
        }
    }
}


spriteObj.prototype.isAnimating = function(){
    return this.animate && !this.animate.stop && !this.animate.auto;
}

////// timeDelta —— 其实就是帧差 如果无误应该是1 但是如果卡了或者机器比较垃圾就会大于1
spriteObj.prototype.animateAction = function(timeDelta){
    if(this.isAnimating()){
        timeDelta = timeDelta || 1;
        //// todo 单sprite的动画行为分开注册
        // 帧动画
        if(timeDelta + this.animate.lastTime > this.animate.speed){
            this.animate.lastTime = 0;
            if(this.animate.onetime){ //// 一次性动画有： 渐变 、 小动作、 开门
                if(this.playFrameOneTime()){
                    this.stopAnimate();
                    if(this.animate.callback){
                        this.animate.callback();
                    }
                    delete this.animate.onetime;
                }
            }else{
                this.playFrame();
            }
        }else{
            this.animate.lastTime += timeDelta;
        }


        // 渐变动画
        if(this.animate.fade && this.animate.lastFadeTime + timeDelta > this.animate.fadeFreq){
            this.animate.lastFadeTime = 0;
            if(this.playFading()){ //// 渐变只进行一次就callback
                this.stopAnimate();
                if(this.animate.callback){
                    this.animate.callback();
                }
            }
        }else{
            this.animate.lastFadeTime += timeDelta;
        }


        // 绑定贴图动画
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

//////  ----- 观察者：sprite  被观察者： block（以及所有可能会用到sprite的游戏数据对象）
// subject对象应该位于block内部，当block发生变化时，通过notify通知sprite
// 应用目的：
// 1. 当地图被删除时，对应的观察者应该也移除，否则会有sprite驻留内存，导致内存额外开销
// 2. 由被观察者决定如何进行sprite的行动

subject.prototype._init = function(){ // sobj: 被观察者
    this.observers = this.observers || []; // 观察者
    this.observe_actions = this.observe_actions || {}; // 提醒信息
}

// 使用headless的前提： 动画操作不改变任何实际数据
subject.prototype.headLessNotify = function(type, param){
    if(this.observe_actions[type] && param.callback){
        param.callback();
    }
}
// 使用notify的规范：
// 1. 所有参数要保持和注册的函数参数一致
// 2. 如果有回调函数，需要将其写在第一个参数的字典中（最好全部参数放到params里）
subject.prototype.notify = function(type, params){
    if(this.observe_actions[type]){
        var t = type;
        arguments[0] = this;
        for (var i in this.observers) {
            this.observe_actions[t].apply(this.observers[i], arguments);
        }
    }
}

subject.prototype.hasObserver = function(name){
    return this.observers.indexOf(name)>=0;
}

subject.prototype.addObserver = function(name, obj, info) {
    this.observers.push(obj);
    obj.subject = this;
    info = info || {};
    for(var i in info){
        this.observe_actions[i] = info[i];
    }
}
subject.prototype.remove = function(name){
    if(!name){
        this.observers = [];
    }else {
        var idx = this.observers.indexOf(name);
        if(idx>=0)
            this.observers.splice(idx, 1);
    }
}
