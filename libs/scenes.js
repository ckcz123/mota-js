"use strict";

var Stage = PIXI.Application;

/* * * * * * * * * * *
* 场景： 一个显示容器，提供如何显示的方法与接口，与设备、canvas、数据无关，类比于【摄像机】
* 包含一组spriteLayer，控制着各个layer之间的【层级】关系，保证其渲染有序
* 同时，一个场景可以有【子场景】——就像电视中的电视一样，子场景的渲染滞后于主场景
*
* 几个原则：
* 1. scene 不负责实际渲染，只负责对场景数据的构建
* 2. 活跃的场景时刻刷新（update），但只有dirty后才会重绘（refresh）
* 3. 非活跃的场景，update无效，需要主动refersh发起重绘请求
* 4. 子场景dirty后，父场景不必dirty，反之相反
* 5. 可以有一个空根场景（代替sceneList？）用作场景管理器，所有子场景均是实体
* 6. 场景与layer的关系：场景控制当前画面的基本数据，以及各个子场景、子渲染器的关系，渲染器负责应用当前场景数据
*    另外，渲染器对于使用者来说，相当于一个【层】的概念。
*
* 场景数据：
* 1. 位置与尺寸，当前场景在父场景中的坐标与大小
* 2. 不透明度：画面不透明度，用于天候、特殊场景
* 3. 偏移量： x和y相对于正常绘制原点（左上0，0）的偏移程度，用于绘制震动和大地图
* 4. 待定
* * * * * * * * * * * */


function scenes(){
    this._init();
}

function baseScene(name){
    this._init(name);
}
baseScene.prototype = Object.create(Stage.prototype);
baseScene.prototype.constructor = Stage;
////// scene使用的canvas创建 属于离屏canvas //////
scenes.prototype.createCleanCanvas = function (name, x, y, width, height, z) {
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
    return newCanvas;
}

baseScene.prototype._init = function(name){
    if(name){
        if(typeof name == 'string'){
            Stage.call(this, {
                'view': core.createCleanCanvas(name, 0,0, 416, 416, 50),
            });
            this.stage.sortableChildren = true;
            this.view.width = core.__PIXELS__;
            this.view.height = core.__PIXELS__;
            this.view.style.width = core.domStyle.scale * this.view.width + 'px';
            this.view.style.height = core.domStyle.scale * this.view.height + 'px';
            if(main.mode=='editor'){
                if(name=='map') { // 只有地图才添加
                    this.view.style.zIndex = 10;
                    this.view.className = "gameCanvas";
                    document.getElementById('mapEdit').appendChild(this.view);
                }
            }
            else {
                if(name=='map')core.dom.gameDraw.appendChild(this.view);
                if(name=='status')core.dom.statusBar.appendChild(this.view);
            }
        }else{
            Stage.call(this, name);
        }
        var self = this;
        this.ticker.add(function(time){self.update(time)});
        this.layers = this.stage.children;
    }
    else{
        this.layers = [];
    }
    this.parent = null;
    this.children = [];
    this.layersTable = {};
    this.configData = { // 当前场景的配置数据 是需要传给各个子场景
        'x':0, 'y':0,
        'width':0, 'height':0,
        'offsetX':0, 'offsetY':0,
        'opacity':1.0,
    };

}

/////
baseScene.prototype.config = function(cfg){
    cfg = cfg || {};
    for(var key in cfg){
        this.configData[key] = cfg[key];
    }
}


baseScene.prototype.update = function(timeDelta){
    // this.children.forEach(function(c){c.update(timeDelta);});
    this.layers.forEach(function(r){
        if(r.update)
            r.update(timeDelta);
    })
}

baseScene.prototype.refresh = function(){
    this.children.forEach(function(c){c.refresh();});
    this.layers.forEach(function(r){r.refresh();});
}

baseScene.prototype.clear = function(){
    this.children.forEach(function(c){c.clear();});
    this.layers.forEach(function(r){
        if(r.clear)r.clear();
    });
//    if(this.stage)
//        this.stage.removeChildren();
}

///// 注意：子场景之间是不考虑碰撞和先后的问题的
baseScene.prototype.addChildScene = function(c){
    this.children.push(c);
}

baseScene.prototype.start = function(c){
    this._active = true;
}

baseScene.prototype.stop = function(c){
    this._active = false;
}

///// 添加渲染层是需要考虑【层优先级】的，如果不加此参数，按长度计算层级，即后添加的后绘制
// ！支持动态添加图层的方法，就是新增layer，将block的绘制放到该layer上，类似多前景与多背景
baseScene.prototype.addLayer = function(name, r, floor){
    r.zIndex = floor ? floor : r.zIndex;
    this.layersTable[name] = r;
    r.name = name;
    this.stage.addChild(r);
}

baseScene.prototype.removeLayer = function(name, r){
    r = r || this.layersTable[name];
    if(r){
        this.stage.removeChild(r);
        delete this.layersTable[name];
    }
}

///// 在某一层添加sprite（！重要）
baseScene.prototype.addSpriteToLayer = function(name, obj){
    if(this.layersTable[name]){
        this.layersTable[name].addNewObj(obj);
    }
}

///// 查找一个渲染层 不存在就创建
baseScene.prototype.createGetLayer = function(name){
    if(this.layersTable[name]){
        return this.layersTable[name];
    }else{
        var ret = null;
        for(var i in this.children){
            ret = this.children[i].getLayer(name);
            if(ret)break;
        }
        ret = core.getNewLayerSprite(name);
        this.addLayer(name, ret);
        return ret;
    }
}

///// 查找一个渲染层（不建议使用 渲染层应该隐藏起来 通过数据驱动）
baseScene.prototype.getLayer = function(name){
    if(this.layersTable[name]){
        return this.layersTable[name];
    }else{
        var ret = null;
        for(var i in this.children){
            ret = this.children[i].getLayer(name);
            if(ret)break;
        }
        return ret;
    }
}


///// 当资源发生变化时 重新加载材质
baseScene.prototype.updateLayerTextures = function(name){
    var f = this.layersTable[name];
    if(f){
        f.children.forEach(function(child) {
            child.texture.update();
        })
    }
}



///// core.scenes.mainScene 就是主场景管理器，其子场景为实际游戏场景
scenes.prototype._init = function(){
    this.tempScene = new baseScene({
        'view':this.createCleanCanvas(name, 0,0, core.__PIXELS__, core.__PIXELS__, 50)
    }); ///// 临时场景 用于toCanvas
}


///// 场景的加载 在所有资源加载和函数转发之后
scenes.prototype._load = function(){
    this.mainScene = this.getNewScene();

    this.mapScene = this.getNewScene('map');
    this.statusScene = this.getNewScene('status');

    // TODO : 更多系统场景（状态栏、工具栏窗口化）
    this.mainScene.addChildScene(this.mapScene);
    this.mainScene.addChildScene(this.statusScene);

    this.mapScene.addLayer('back', core.getNewLayerSprite(),0);
    this.mapScene.addLayer('bg', core.getNewLayerSprite(),1);
    this.mapScene.addLayer('event', core.getNewLayerSprite(),2);
    this.mapScene.addLayer('fg', core.getNewLayerSprite(),3);

    this.statusScene.addLayer('back', core.getNewLayerSprite(), 1)
    this.statusScene.addLayer('data', core.getNewLayerSprite(), 2)
    this.statusScene.addLayer('animate', core.getNewLayerSprite(), 3)


    ///// ----- 伤害依然使用canvas 但是离屏绘制
    core.canvas.damage = this.createCleanCanvas('damage',0,0,core.__PIXELS__,core.__PIXELS__).getContext('2d');
    this.mapScene.addLayer('damage', core.createCanvasLayer(core.canvas.damage.canvas),4);
    core.bigmap.canvas.push('damage'); // 需要在大地图尺寸变换

    ///// ----- todo: 动画用animatesprite实现
    this.mapScene.addLayer('animate', core.getNewLayerSprite(),5);
    this.mapScene.addLayer('weather', core.getNewLayerSprite(),6);
}

scenes.prototype.updateAllScenes = function(){
    this.mainScene.update();
}
scenes.prototype.addSceneToMainList = function(scene){
    this.mainScene.addChildScene(scene)
}

scenes.prototype.getNewScene = function(option){
    return new baseScene(option);
}


