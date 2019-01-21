"use strict";

function maps() {
    this.init();
}

maps.prototype.init = function() {
    this.blocksInfo = maps_90f36752_8815_4be8_b32b_d7fad1d0542e;
    //delete(maps_90f36752_8815_4be8_b32b_d7fad1d0542e);
}

////// 加载某个楼层（从剧本或存档中） //////
maps.prototype.loadFloor = function (floorId, map) {
    var floor = core.floors[floorId];

    if (!core.isset(map)) map = floor.map;
    if (map instanceof Array) {
        map = {"map": map};
    }
    var content = {};
    ["floorId", "title", "name", "canFlyTo", "canUseQuickShop", "cannotViewMap", "cannotMoveDirectly", "color", "weather",
        "defaultGround", "images", "item_ratio", "upFloor", "bgm", "downFloor", "underGround"].forEach(function (e) {
        if (core.isset(map[e])) content[e] = core.clone(map[e]);
        else content[e] = core.clone(floor[e]);
    });
    map=map.map;
    var mapIntoBlocks = function(map,maps,floor,floorId){
        var blocks = [];
        var mw = core.floors[floorId].width || 13;
        var mh = core.floors[floorId].height || 13;
        for (var i = 0; i < mh; i++) {
            for (var j = 0; j < mw; j++) {
                var block = maps.initBlock(j, i, (map[i]||[])[j]||0);
                maps.addInfo(block);
                maps.addEvent(block,j,i,floor.events[j+","+i])
                maps.addChangeFloor(block,j,i,floor.changeFloor[j+","+i]);
                if (core.isset(block.event)) blocks.push(block);
            }
        }
        return blocks;
    }
    if (main.mode=='editor'){
        main.editor.mapIntoBlocks = function(map,floor,floorId){
            return mapIntoBlocks(map,core.maps,floor,floorId);
        }
    }
    // 事件处理
    content['blocks'] = mapIntoBlocks(map,this,floor,floorId);
    return content;
}

////// 从ID获得数字 //////
maps.prototype.getNumberById = function (id) {
    for (var number in this.blocksInfo) {
        if ((this.blocksInfo[number]||{}).id == id)
            return parseInt(number)||0;
    }
    // tilesets
    if (/^X\d+$/.test(id)) {
        var info = core.icons.getTilesetOffset(id);
        if (info!=null) return parseInt(id.substring(1));
    }
    // 特殊ID
    if (id == 'none') return 0;
    if (id == 'airwall') return 17;
    return 0;
}

////// 数字和ID的对应关系 //////
maps.prototype.initBlock = function (x, y, id) {
    var disable=null;
    id = ""+id;
    if (id.length>2) {
        if (id.indexOf(":f")==id.length-2) {
            id = id.substring(0, id.length - 2);
            disable = true;
        }
        else if (id.indexOf(":t")==id.length-2) {
            id = id.substring(0, id.length - 2);
            disable = false;
        }
    }
    id=parseInt(id);
    var tmp = {'x': x, 'y': y, 'id': id};
    if (disable!=null) tmp.disable = disable;

    if (id==17) {
        tmp.event = {"cls": "terrains", "id": "airwall", "noPass": true};
    }
    else if (id in this.blocksInfo) tmp.event = JSON.parse(JSON.stringify(this.blocksInfo[id]));
    else {
        var tilesetOffset = core.icons.getTilesetOffset(id);
        if (tilesetOffset != null) {
            tmp.event = {"cls": "tileset", "id": "X"+id, "noPass": true};
        }
    }

    return tmp;
}

////// 添加一些信息到block上 //////
maps.prototype.addInfo = function (block) {
    if (core.isset(block.event)) {
        if (block.event.cls.indexOf("enemy")==0 && !core.isset(block.event.trigger)) {
            block.event.trigger = 'battle';
        }
        if (block.event.cls == 'items' && !core.isset(block.event.trigger)) {
            block.event.trigger = 'getItem';
        }
        if (!core.isset(block.event.noPass)) {
            if (block.event.cls != 'items') {
                block.event.noPass = true;
            }
        }
        if (!core.isset(block.event.animate)) {
            if (block.event.cls=='enemys' || block.event.cls=='npcs') {
                block.event.animate = 2;
            }
            if (block.event.cls == 'animates' || block.event.cls == 'enemy48' || block.event.cls == 'npc48') {
                block.event.animate = 4;
            }
        }
        block.event.height = 32;
        if (block.event.cls == 'enemy48' || block.event.cls == 'npc48')
            block.event.height = 48;
    }
}

////// 向该楼层添加剧本的自定义事件 //////
maps.prototype.addEvent = function (block, x, y, event) {
    if (!core.isset(event)) return;
    if (!core.isset(block.event)) { // 本身是空地？
        block.event = {'cls': 'terrains', 'id': 'none', 'noPass': false};
    }
    // event是字符串或数组？
    if (typeof event == "string") {
        event = {"data": [event]};
    }
    else if (event instanceof Array) {
        event = {"data": event};
    }
    if (!core.isset(event.data))
        event.data = [];

    // 覆盖enable
    if (!core.isset(block.disable) && core.isset(event.enable)) {
        block.disable=!event.enable;
    }
    // 覆盖animate
    if (event.animate === false) {
        block.event.animate = 1;
    }
    // 覆盖所有属性
    for (var key in event) {
        if (key!="enable" && key!="animate" && core.isset(event[key])) {
            block.event[key]=core.clone(event[key]);
        }
    }
    // 给无trigger的增加trigger:action
    if (!core.isset(block.event.trigger)) {
        block.event.trigger = 'action';
    }
}

////// 向该楼层添加剧本的楼层转换事件 //////
maps.prototype.addChangeFloor = function (block, x, y, event, ground) {
    if (!core.isset(event)) return;
    this.addEvent(block, x, y, {"trigger": "changeFloor", "data": event}, ground);
}

////// 初始化所有地图 //////
maps.prototype.initMaps = function (floorIds) {
    var maps = {};
    for (var i=0;i<floorIds.length;i++) {
        var floorId = floorIds[i];
        maps[floorId] = this.loadFloor(floorId);
    }
    return maps;
}

////// 将当前地图重新变成数字，以便于存档 //////
maps.prototype.save = function(maps, floorId) {
    if (!core.isset(floorId)) {
        var map = {};
        for (var id in maps) {
            map[id] = this.save(maps, id);
            // map.push(this.save(maps, id));
        }
        return map;
    }

    var thisFloor = core.clone(maps[floorId]);
    var mw = core.floors[floorId].width || 13;
    var mh = core.floors[floorId].height || 13;

    var blocks = [];
    for (var x=0;x<mh;x++) {
        blocks[x]=[];
        for (var y=0;y<mw;y++) {
            blocks[x].push(0);
        }
    }
    thisFloor.blocks.forEach(function (block) {
        if (core.isset(block.disable)) {
            if (!block.disable) blocks[block.y][block.x] = block.id+":t";
            else blocks[block.y][block.x] = block.id+":f";
        }
        else blocks[block.y][block.x] = block.id;
    });
    delete thisFloor.blocks;
    thisFloor.map = blocks;
    return main.mode == 'editor' ? blocks : thisFloor;
}

////// 更改地图画布的尺寸
maps.prototype.resizeMap = function(floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    core.bigmap.width = core.floors[floorId].width || 13;
    core.bigmap.height = core.floors[floorId].height || 13;
    var cwidth = core.bigmap.width * 32;
    var cheight = core.bigmap.height * 32;
    core.bigmap.canvas.forEach(function(cn){
        core.canvas[cn].canvas.setAttribute("width",cwidth);
        core.canvas[cn].canvas.setAttribute("height",cheight);
        core.canvas[cn].canvas.style.width = cwidth*core.domStyle.scale + "px";
        core.canvas[cn].canvas.style.height = cheight*core.domStyle.scale + "px";
        if(main.mode==='editor' && editor.isMobile){
            core.canvas[cn].canvas.style.width = core.bigmap.width*32/416*96 + "vw";
            core.canvas[cn].canvas.style.height = core.bigmap.height*32/416*96 + "vw";
        }
    });
}

////// 将存档中的地图信息重新读取出来 //////
maps.prototype.load = function (data, floorId) {
    if (!core.isset(floorId)) {
        var map = {};
        core.floorIds.forEach(function (id) {
            map[id] = core.maps.loadFloor(id, data[id]);
        })
        return map;
    }
    return this.loadFloor(floorId, data[floorId]);
}

////// 将当前地图重新变成二维数组形式 //////
maps.prototype.getMapArray = function (blockArray,width,height){

    width=width||13;
    height=height||13;

    var blocks = [];
    for (var x=0;x<height;x++) {
        blocks[x]=[];
        for (var y=0;y<width;y++) {
            blocks[x].push(0);
        }
    }
    blockArray.forEach(function (block) {
        if (!block.disable && block.x<width && block.y<height)
            blocks[block.y][block.x] = block.id;
    });
    return blocks;
}



////// 勇士能否前往某方向 //////
maps.prototype.canMoveHero = function(x,y,direction,floorId) {
    if (!core.isset(x)) x=core.getHeroLoc('x');
    if (!core.isset(y)) y=core.getHeroLoc('y');
    if (!core.isset(direction)) direction=core.getHeroLoc('direction');
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return false;

    // 检查当前块的cannotMove
    if (core.isset(core.floors[floorId].cannotMove)) {
        var cannotMove = core.floors[floorId].cannotMove[x+","+y];
        if (core.isset(cannotMove) && cannotMove instanceof Array && cannotMove.indexOf(direction)>=0)
            return false;
    }

    var check = function (block, name) {
        if (!core.isset(block)) return true;
        if (block instanceof Array) return check((block[y]||[])[x], name);
        if (typeof block == 'number') return check(core.maps.initBlock(0,0,block), name);
        if (core.isset(block.block)) return check(block.block, name);
        return ((block.event||{})[name]||[]).indexOf(direction)<0;
    }
    var getNumber = function (floorId, name, x, y) {
        return (core.maps.getBgFgMapArray(floorId, name)[y]||[])[x];
    }

    // 检查该点的cannotOut
    if (!check(core.getBlock(x,y,floorId),"cannotOut") || !check(getNumber(floorId,"bg",x,y),"cannotOut") || !check(getNumber(floorId,"fg",x,y),"cannotOut"))
        return false;

    var nx = x+core.utils.scan[direction].x, ny = y+core.utils.scan[direction].y;
    // 检查目标点的cannotIn
    if (!check(core.getBlock(nx,ny,floorId),"cannotIn") || !check(getNumber(floorId,"bg",nx,ny),"cannotIn") || !check(getNumber(floorId,"fg",nx,ny),"cannotIn"))
        return false;

    // 检查将死的领域
    if (floorId==core.status.floorId && core.status.hero.hp <= core.status.checkBlock.damage[nx+core.bigmap.width*ny]
        && !core.flags.canGoDeadZone && core.getBlock(nx, ny)==null)
        return false;

    return true;
}

////// 能否瞬间移动 //////
maps.prototype.canMoveDirectly = function (destX,destY) {

    // 不可瞬间移动请返回-1
    if (!core.flags.enableMoveDirectly) return -1;

    // 检查该楼层是否不可瞬间移动
    if (core.status.thisMap.cannotMoveDirectly) return -1;

    // flag:cannotMoveDirectly为true：不能
    if (core.hasFlag('cannotMoveDirectly')) return -1;

    // 中毒状态：不能
    if (core.hasFlag('poison')) return -1;

    var fromX = core.getHeroLoc('x'), fromY = core.getHeroLoc('y');
    if (fromX==destX&&fromY==destY) return 0;

    // 无视起点事件
    var nowBlockId = core.getBlockId(fromX, fromY);
    if ((nowBlockId!=null&&nowBlockId!='upFloor'&&nowBlockId!='downFloor'&&nowBlockId!='portal'
        &&nowBlockId!='upPortal'&&nowBlockId!='leftPortal'&&nowBlockId!='downPortal'&&nowBlockId!='rightPortal')
        ||core.status.checkBlock.damage[fromX+core.bigmap.width*fromY]>0)
        return -1;

    // BFS
    var visited=[], queue=[];
    visited[fromX+core.bigmap.width*fromY]=0;
    queue.push(fromX+core.bigmap.width*fromY);

    var directions = {
        "left": [-1,0],
        "up": [0,-1],
        "right": [1,0],
        "down": [0,1]
    }
    while (queue.length>0) {
        var now=queue.shift(), nowX=parseInt(now%core.bigmap.width), nowY=parseInt(now/core.bigmap.width);

        for (var dir in directions) {
            if (!core.canMoveHero(nowX, nowY, dir)) continue;
            var nx=nowX+directions[dir][0], ny=nowY+directions[dir][1];
            if (nx<0||nx>=core.bigmap.width||ny<0||ny>=core.bigmap.height||visited[nx+core.bigmap.width*ny]||core.getBlock(nx,ny)!=null||core.status.checkBlock.damage[nx+core.bigmap.width*ny]>0) continue;
            visited[nx+core.bigmap.width*ny]=visited[nowX+core.bigmap.width*nowY]+1;
            if (nx==destX&&ny==destY) return visited[nx+core.bigmap.width*ny];
            queue.push(nx+core.bigmap.width*ny);
        }
    }
    return -1;
}

maps.prototype.drawBlock = function (block, animate, dx, dy) {
    // none：空地
    if (block.event.id=='none') return;

    var cls = block.event.cls;

    var blockInfo = this.__getBlockInfo(block);
    if (blockInfo == null) return;
    var image = blockInfo.image, x = blockInfo.bx, y = blockInfo.by, height = blockInfo.height;
    if (!blockInfo.isTileset) x = (animate||0)%(block.event.animate||1);

    dx = dx || 0;
    dy = dy || 0;

    if (core.isset(block.name)) {
        core.clearMap(block.name, block.x * 32, block.y * 32, 32, 32);
        if (block.name == 'bg') {
            core.drawImage('bg', core.material.groundCanvas.canvas, block.x * 32, block.y * 32);
        }
        core.drawImage(block.name, image, x * 32, y * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
        return;
    }

    core.clearMap('event', block.x * 32 + dx, block.y * 32 + dy, 32, 32);
    core.drawImage('event', image, x * 32, y * height + height-32, 32, 32, block.x * 32 + dx, block.y * 32 + dy, 32, 32);
    if (height>32) {
        core.clearMap('event2', block.x * 32 + dx, block.y * 32 + 32 - height + dy, 32, height-32)
        core.drawImage('event2', image, x * 32, y * height, 32, height-32, block.x * 32 + dx, block.y*32 + 32 - height + dy, 32, height-32);
    }
}

maps.prototype.getBgFgMapArray = function (floorId, name) {
    floorId = floorId||core.status.floorId;
    if (!core.isset(floorId)) return [];
    var width = core.floors[floorId].width || 13;
    var height = core.floors[floorId].height || 13;

    if (main.mode!='editor' && core.isset(core.status[name+"maps"][floorId]))
        return core.status[name+"maps"][floorId];

    var arr = core.clone(core.floors[floorId][name+"map"] || []);
    if(main.mode=='editor')arr = core.clone(editor[name+"map"])||arr;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            arr[y] = arr[y] || [];
            if (core.hasFlag(name + "_" + floorId + "_" + x + "_" + y)) arr[y][x] = 0;
            else arr[y][x] = core.getFlag(name + "v_" + floorId + "_" + x + "_" + y, arr[y][x] || 0);
            if(main.mode=='editor')arr[y][x]= arr[y][x].idnum || arr[y][x] || 0;
        }
    }
    core.status[name+"maps"][floorId] = core.clone(arr);
    return arr;
}

////// 背景/前景图块的绘制 //////
maps.prototype.drawBgFgMap = function (floorId, canvas, name, animate) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    var width = core.floors[floorId].width || 13;
    var height = core.floors[floorId].height || 13;

    if (!core.isset(core.status[name+"maps"]))
        core.status[name+"maps"] = {};

    var arr = this.getBgFgMapArray(floorId, name);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            if (arr[y][x]>0) {
                var block = core.maps.initBlock(x, y, arr[y][x]);
                this.addInfo(block);
                block.name = name;
                if (core.isset(block.event)) {
                    var id = block.event.id, cls = block.event.cls;
                    if (cls == 'autotile') {
                        core.drawAutotile(canvas, arr, block, 32, 0, 0);
                        if (animate)
                            core.addAutotileGlobalAnimate(block);
                    }
                    else if (cls == 'tileset') {
                        var offset = core.icons.getTilesetOffset(id);
                        if (offset!=null) {
                            canvas.drawImage(core.material.images.tilesets[offset.image], 32*offset.x, 32*offset.y, 32, 32, 32*x, 32*y, 32, 32);
                        }
                    }
                    else if (arr[y][x]==17) {
                        if (core.isset(core.material.images.airwall)) {
                            canvas.drawImage(core.material.images.airwall, 32*x, 32*y);
                        }
                    }
                    else {
                        if (animate) {
                            this.drawBlock(block);
                            this.addGlobalAnimate(block);
                        }
                        else {
                            canvas.drawImage(core.material.images[cls], 0, core.material.icons[cls][id] * 32, 32, 32, x * 32, y * 32, 32, 32);
                        }
                    }
                }
            }
        }
    }
    if (animate) core.status.autotileAnimateObjs[name+"map"] = core.clone(arr);
}

////// 生成groundPattern //////
maps.prototype.generateGroundPattern = function (floorId) {
    // 生成floorId层的groundPattern（盒子内的怪物动画）
    var groundId = ((core.status.maps||core.floors)[floorId||core.status.floorId]||{}).defaultGround || "ground";
    core.material.groundCanvas.clearRect(0, 0, 32, 32);
    core.material.groundCanvas.drawImage(core.material.images.terrains, 0, 32*core.material.icons.terrains[groundId], 32, 32, 0, 0, 32, 32);
    core.material.groundPattern = core.material.groundCanvas.createPattern(core.material.groundCanvas.canvas, 'repeat');
    // 如果需要用纯色可以直接将下面代码改成改成
    // core.material.groundPattern = '#000000';
}

////// 绘制某张地图 //////
maps.prototype.drawMap = function (floorId, callback) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) {
        if (core.isset(callback))
            callback();
        return;
    }
    core.clearMap('all');

    this.generateGroundPattern(floorId);

    var drawBg = function(){
        var width = core.floors[floorId].width || 13;
        var height = core.floors[floorId].height || 13;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                core.drawImage('bg', core.material.groundCanvas.canvas, 32*x, 32*y);
            }
        }

        // 获得image
        var images = [];
        if (core.isset(core.status.maps[floorId].images)) {
            images = core.status.maps[floorId].images;
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
                if (!t[3]) {
                    if (/.*\.gif/i.test(p) && main.mode=='play') {
                        core.dom.gif.innerHTML = "";
                        var gif = new Image();
                        gif.src = image.src;
                        gif.style.position = 'absolute';
                        gif.style.left = (32*dx*core.domStyle.scale)+"px";
                        gif.style.top = (32*dy*core.domStyle.scale)+"px";
                        gif.style.width = image.width*core.domStyle.scale+"px";
                        gif.style.height = image.height*core.domStyle.scale+"px";
                        core.dom.gif.appendChild(gif);
                    }
                    else {
                        core.drawImage('bg', image, 32*dx, 32*dy, image.width, image.height);
                    }
                }
                else if (t[3]==1)
                    core.drawImage('fg', image, 32*dx, 32*dy, image.width, image.height);
                else if (t[3]==2) {
                    core.drawImage('fg', image, 0, 0, image.width, image.height-32,
                        32*dx, 32*dy, image.width, image.height-32);
                    core.drawImage('bg', image, 0, image.height-32, image.width, 32,
                        32*dx, 32*dy + image.height - 32, image.width, 32);
                }
            }
        });

        core.maps.drawBgFgMap(floorId, core.canvas.bg, "bg", true);
        core.maps.drawBgFgMap(floorId, core.canvas.fg, "fg", true);

    }
    if (main.mode=='editor'){
        // just do not run drawBg

        // //---move to main.editor.updateMap
        // main.editor.drawMapBg = function(){
        //     core.clearMap('bg');
        //     core.clearMap('fg');
        //     drawBg();
        // }
    } else {
        drawBg();
    }

    core.status.floorId = floorId;
    core.status.thisMap = core.status.maps[floorId];
    var drawEvent = function(){

        var mapData = core.status.maps[core.status.floorId];
        var mapBlocks = mapData.blocks;

        var mapArray = core.maps.getMapArray(mapBlocks,core.bigmap.width,core.bigmap.height);
        for (var b = 0; b < mapBlocks.length; b++) {
            // 事件启用
            var block = mapBlocks[b];
            if (core.isset(block.event) && !block.disable) {
                if (block.event.cls == 'autotile') {
                    core.drawAutotile(core.canvas.event, mapArray, block, 32, 0, 0);
                    core.addAutotileGlobalAnimate(block);
                }
                else {
                    core.drawBlock(block);
                    core.addGlobalAnimate(block);
                }
            }
        }
        core.status.autotileAnimateObjs.map = core.clone(mapArray);
    }

    if (main.mode=='editor'){
        main.editor.updateMap = function(){
            core.removeGlobalAnimate(null, null, true);
            core.clearMap('bg');
            core.clearMap('event');
            core.clearMap('event2');
            core.clearMap('fg');
            drawBg();
            drawEvent();
            core.setGlobalAnimate(core.values.animateSpeed);
        }
    } else {
        drawEvent();
        if (core.isset(core.status.curtainColor))
            core.fillRect('curtain',0,0,416,416,core.arrayToRGBA(core.status.curtainColor));
        core.setGlobalAnimate(core.values.animateSpeed);
        core.drawHero();
        core.updateStatusBar();
    }
    if (core.isset(callback))
        callback();
}

////// 绘制Autotile //////
maps.prototype.drawAutotile = function(ctx, mapArr, block, size, left, top, status){
    var indexArrs = [ //16种组合的图块索引数组; // 将autotile分割成48块16*16的小块; 数组索引即对应各个小块
        //                                     +----+----+----+----+----+----+
        [10,  9,  4, 3 ],  //0   bin:0000      | 1  | 2  | 3  | 4  | 5  | 6  |
        [10,  9,  4, 13],  //1   bin:0001      +----+----+----+----+----+----+
        [10,  9, 18, 3 ],  //2   bin:0010      | 7  | 8  | 9  | 10 | 11 | 12 |
        [10,  9, 16, 15],  //3   bin:0011      +----+----+----+----+----+----+
        [10, 43,  4, 3 ],  //4   bin:0100      | 13 | 14 | 15 | 16 | 17 | 18 |
        [10, 31,  4, 25],  //5   bin:0101      +----+----+----+----+----+----+
        [10,  7,  2, 3 ],  //6   bin:0110      | 19 | 20 | 21 | 22 | 23 | 24 |
        [10, 31, 16, 5 ],  //7   bin:0111      +----+----+----+----+----+----+
        [48,  9,  4, 3 ],  //8   bin:1000      | 25 | 26 | 27 | 28 | 29 | 30 |
        [ 8,  9,  4, 1 ],  //9   bin:1001      +----+----+----+----+----+----+
        [36,  9, 30, 3 ],  //10  bin:1010      | 31 | 32 | 33 | 34 | 35 | 36 |
        [36,  9,  6, 15],  //11  bin:1011      +----+----+----+----+----+----+
        [46, 45,  4, 3 ],  //12  bin:1100      | 37 | 38 | 39 | 40 | 41 | 42 |
        [46, 11,  4, 25],  //13  bin:1101      +----+----+----+----+----+----+
        [12, 45, 30, 3 ],  //14  bin:1110      | 43 | 44 | 45 | 46 | 47 | 48 |
        [34, 33, 28, 27]   //15  bin:1111      +----+----+----+----+----+----+
    ];

    var drawBlockByIndex = function(ctx, dx, dy, autotileImg, index, size){ //index为autotile的图块索引1-48
        var sx = 16*((index-1)%6), sy = 16*(~~((index-1)/6));
        status = status || 0;
        status %= parseInt(autotileImg.width/96);
        ctx.drawImage(autotileImg, sx + 96*status, sy, 16, 16, dx, dy, size/2, size/2);
    }
    var getAutotileAroundId = function(currId, x, y) {
        if(x<0 || y<0 || x>=mapArr[0].length || y>=mapArr.length) return 1;
        else return core.material.autotileEdges[currId].indexOf(mapArr[y][x])>=0;
    }
    var checkAround = function(x, y){ // 得到周围四个32*32块（周围每块都包含当前块的1/4，不清楚的话画下图你就明白）的数组索引
        var currId = mapArr[y][x];
        var pointBlock = [];
        for(var i=0; i<4; i++){
            var bsum = 0;
            var offsetx = i%2, offsety = ~~(i/2);
            for(var j=0; j<4; j++){
                var mx = j%2, my = ~~(j/2);
                var b = getAutotileAroundId(currId, x+offsetx+mx-1, y+offsety+my-1);
                bsum += b*(Math.pow(2, 3-j));
            }
            pointBlock.push(bsum);
        }
        return pointBlock;
    }
    var getAutotileIndexs = function(x, y){
        var indexArr = [];
        var pointBlocks = checkAround(x, y);
        for(var i=0; i<4; i++){
            var arr = indexArrs[pointBlocks[i]]
            indexArr.push(arr[3-i]);
        }
        return indexArr;
    }
    // 开始绘制autotile
    var x = block.x, y = block.y;
    var pieceIndexs = getAutotileIndexs(x, y);

    //修正四个边角的固定搭配
    if(pieceIndexs[0] == 13){
        if(pieceIndexs[1] == 16) pieceIndexs[1] = 14;
        if(pieceIndexs[2] == 31) pieceIndexs[2] = 19;
    }
    if(pieceIndexs[1] == 18){
        if(pieceIndexs[0] == 15) pieceIndexs[0] = 17;
        if(pieceIndexs[3] == 36) pieceIndexs[3] = 24;
    }
    if(pieceIndexs[2] == 43){
        if(pieceIndexs[0] == 25) pieceIndexs[0] = 37;
        if(pieceIndexs[3] == 46) pieceIndexs[3] = 44;
    }
    if(pieceIndexs[3] == 48){
        if(pieceIndexs[1] == 30) pieceIndexs[1] = 42;
        if(pieceIndexs[2] == 45) pieceIndexs[2] = 47;
    }
    for(var i=0; i<4; i++){
        var index = pieceIndexs[i];
        var dx = x*size + size/2*(i%2), dy = y*size + size/2*(~~(i/2));
        drawBlockByIndex(ctx, dx+left, dy+top, core.material.images['autotile'][block.event.id], index, size);
    }
}

////// 为autotile判定边界 ////// 
maps.prototype.makeAutotileEdges = function () {
    var autotileIds = Object.keys(core.material.images.autotile);
    core.material.autotileEdges = {};

    var canvas = document.createElement("canvas"), ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 32;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    autotileIds.forEach(function (t) {
        var n = core.maps.getNumberById(t);
        core.material.autotileEdges[n] = [n];

        ctx.clearRect(0,0,32,32);
        ctx.drawImage(core.material.images.autotile[t], 0, 0, 32, 32, 0, 0, 32, 32);
        var data = canvas.toDataURL("image/png");

        autotileIds.forEach(function (t2) {
            if (t==t2) return;
            var n2 = core.maps.getNumberById(t2);

            ctx.clearRect(0,0,32,32);
            ctx.drawImage(core.material.images.autotile[t2], 32, 0, 32, 32, 0, 0, 32, 32);
            if (data == canvas.toDataURL("image/png")) {
                core.material.autotileEdges[n].push(n2);
            }
        });
    });
}

////// 某个点是否不可通行 //////
maps.prototype.noPassExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return core.isset(block.block.event.noPass) && block.block.event.noPass;
}

////// 某个点是否在区域内且不可通行 //////
maps.prototype.noPass = function (x, y) {
    return x<0 || x>=core.bigmap.width || y<0 || y>=core.bigmap.height || this.noPassExists(x,y);
}

////// 某个点是否存在NPC //////
maps.prototype.npcExists = function (x, y, floorId) {
    var block = this.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls.indexOf('npc')==0;
}

////// 某个点是否存在（指定的）地形 //////
maps.prototype.terrainExists = function (x, y, id, floorId) {
    var block = this.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='terrains' && (core.isset(id)?block.block.event.id==id:true);
}

////// 某个点是否存在楼梯 //////
maps.prototype.stairExists = function (x, y, floorId) {
    var block = this.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='terrains' && (block.block.event.id=='upFloor' || block.block.event.id=='downFloor');
}

////// 当前位置是否在楼梯边 //////
maps.prototype.nearStair = function() {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
    return this.stairExists(x,y) || this.stairExists(x-1,y) || this.stairExists(x,y-1) || this.stairExists(x+1,y) || this.stairExists(x,y+1);
}

////// 某个点是否存在（指定的）怪物 //////
maps.prototype.enemyExists = function (x, y, id,floorId) {
    var block = this.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls.indexOf('enemy')==0 && (core.isset(id)?block.block.event.id==id:true);
}

////// 获得某个点的block //////
maps.prototype.getBlock = function (x, y, floorId, showDisable) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return null;
    var blocks = core.status.maps[floorId].blocks;
    for (var n=0;n<blocks.length;n++) {
        if (blocks[n].x==x && blocks[n].y==y && core.isset(blocks[n].event)) {
            if (!showDisable && blocks[n].disable) return null;
            return {"index": n, "block": blocks[n]};
        }
    }
    return null;
}

////// 获得某个点的blockId //////
maps.prototype.getBlockId = function (x, y, floorId, showDisable) {
    var block = core.getBlock(x, y, floorId, showDisable);
    if (block == null) return null;
    if (core.isset(block.block.event)) return block.block.event.id;
    return null;
}

////// 获得某个点的blockCls //////
maps.prototype.getBlockCls = function (x, y, floorId, showDisable) {
    var block = core.getBlock(x, y, floorId, showDisable);
    if (block == null) return null;
    if (core.isset(block.block.event)) return block.block.event.cls;
    return null;
}

maps.prototype.__getBlockInfo = function (block) {
    var image, bx, by, height = block.event.height || 32;
    var faceIds = {}, isTileset = false;
    if (block.event.cls == 'tileset') {
        var offset = core.icons.getTilesetOffset(block.event.id);
        if (offset==null) {
            return null;
        }
        bx = offset.x;
        by = offset.y;
        image = core.material.images.tilesets[offset.image];
        isTileset = true;
    }
    // 不支持autotile
    else if (block.event.cls == 'autotile') {
        return null;
    }
    // 空气墙；忽略事件
    else if (block.id==17) {
        if (!core.isset(core.material.images.airwall)) return null;
        image = core.material.images.airwall;
        bx = by = 0;
    }
    else {
        image = core.material.images[block.event.cls];
        bx = 0;
        by = core.material.icons[block.event.cls][block.event.id];
        faceIds = block.event.faceIds||{};
    }
    return {
        "image": image,
        "bx": bx,
        "by": by,
        "height": height,
        "isTileset": isTileset,
        "faceIds": faceIds
    };
}

maps.prototype.__moveBlockCanvas = function (image, bx, by, height, nowX, nowY, opacity, headCanvas, bodyCanvas, damageCanvas) {
    // 重绘block & 重定位
    if (headCanvas != null) {
        core.dymCanvas[headCanvas].clearRect(0, 0, 32, height);
        core.dymCanvas[headCanvas].drawImage(image, bx * 32, by * height, 32, height - 32, 0, 0, 32, height - 32);
        core.relocateCanvas(headCanvas, nowX - core.bigmap.offsetX, nowY+32-height - core.bigmap.offsetY);
        core.setOpacity(headCanvas, opacity);
    }
    if (bodyCanvas != null) {
        core.dymCanvas[bodyCanvas].clearRect(0, 0, 32, 32);
        core.dymCanvas[bodyCanvas].drawImage(image, bx * 32, by * height + height - 32, 32, 32, 0, 0, 32, 32);
        core.relocateCanvas(bodyCanvas, nowX - core.bigmap.offsetX, nowY - core.bigmap.offsetY);
        core.setOpacity(bodyCanvas, opacity);
    }
    if (damageCanvas != null) {
        core.relocateCanvas(damageCanvas, nowX - core.bigmap.offsetX, nowY - core.bigmap.offsetY);
        core.setOpacity(damageCanvas, opacity);
    }
}

maps.prototype.__initBlockCanvas = function (block, height, x, y) {
    var headCanvas = null, bodyCanvas = 'block'+x+"_"+y, damageCanvas = null;

    core.createCanvas(bodyCanvas, 0, 0, 32, 32, 35);
    if (height > 32) {
        headCanvas = "blockHead"+x+"_"+y;
        core.createCanvas(headCanvas, 0, 0, 32, height - 32, 55);
    }
    // 显伤
    var damage = null, damageColor = null;
    if ((block.event.cls == 'enemys' || block.event.cls == 'enemy48') && core.hasItem('book')
        && block.event.displayDamage !== false) {
        var damageString = core.enemys.getDamageString(block.event.id, x, y);
        damage = damageString.damage; damageColor = damageString.color;
    }
    if (damage != null) {
        damageCanvas = "blockDamage"+x+"_"+y;
        var ctx = core.createCanvas(damageCanvas, 0, 0, 32, 32, 65);
        ctx.textAlign = 'left';
        ctx.font = "bold 11px Arial";
        core.fillBoldText(ctx, damage, 1, 31, damageColor);
        if (core.flags.displayCritical) {
            var critical = core.enemys.nextCriticals(block.event.id);
            if (critical.length>0) critical=critical[0];
            critical = core.formatBigNumber(critical[0], true);
            if (critical == '???') critical = '?';
            core.fillBoldText(ctx, critical, 1, 21, '#FFFFFF');
        }
    }
    return {
        "headCanvas": headCanvas,
        "bodyCanvas": bodyCanvas,
        "damageCanvas": damageCanvas
    }
}

////// 显示移动某块的动画，达到{“type”:”move”}的效果 //////
maps.prototype.moveBlock = function(x,y,steps,time,keep,callback) {
    time = time || 500;
    var floorId = core.status.floorId;

    var block = core.getBlock(x,y);
    if (block==null) {// 不存在
        if (core.isset(callback)) callback();
        return;
    }
    var id = block.block.id;

    // 需要删除该块
    core.removeBlock(x,y);

    block=block.block;
    var blockInfo = this.__getBlockInfo(block);
    if (blockInfo == null) {
        if (core.isset(callback)) callback();
        return;
    }
    var image = blockInfo.image, bx = blockInfo.bx, by = blockInfo.by, height = blockInfo.height, isTileset = blockInfo.isTileset, faceIds = blockInfo.faceIds;

    // 要运行的轨迹：将steps展开
    var moveSteps=[];
    steps.forEach(function (e) {
        if (typeof e=="string") {
            moveSteps.push(e);
        }
        else {
            if (!core.isset(e.value)) {
                moveSteps.push(e.direction)
            }
            else {
                for (var i=0;i<e.value;i++) {
                    moveSteps.push(e.direction);
                }
            }
        }
    });

    var nowX=32*x, nowY=32*y, step=0;
    var destX=x, destY=y;
    moveSteps.forEach(function (t) {
        destX += core.utils.scan[t].x;
        destY += core.utils.scan[t].y;
    });

    var animateValue = block.event.animate || 1, animateCurrent = isTileset?bx:0, animateTime = 0;
    var blockCanvas = this.__initBlockCanvas(block, height, x, y);
    var headCanvas = blockCanvas.headCanvas, bodyCanvas = blockCanvas.bodyCanvas, damageCanvas = blockCanvas.damageCanvas;
    var opacity = 1;

    core.maps.__moveBlockCanvas(image, animateCurrent, by, height, nowX, nowY, opacity, headCanvas, bodyCanvas, damageCanvas);

    var animate=window.setInterval(function() {

        animateTime += time / 16 / core.status.replay.speed;
        if (animateTime >= core.values.animateSpeed) {
            animateCurrent++;
            animateTime = 0;
            if (animateCurrent>=animateValue) animateCurrent=0;
        }
        if (isTileset) animateCurrent = bx;

        // 已经移动完毕，消失
        if (moveSteps.length==0 || floorId != core.status.floorId) {
            if (keep || floorId!=core.status.floorId) opacity=0;
            else opacity -= 0.06;
            if (opacity<=0) {
                delete core.animateFrame.asyncId[animate];
                clearInterval(animate);
                core.deleteCanvas(headCanvas);
                core.deleteCanvas(bodyCanvas);
                core.deleteCanvas(damageCanvas);
                // 不消失
                if (keep) {
                    core.setBlock(id, destX, destY, floorId);
                    if (floorId == core.status.floorId)
                        core.showBlock(destX, destY);
                }
                if (core.isset(callback)) callback();
            }
            else {
                core.maps.__moveBlockCanvas(image, animateCurrent, by, height, nowX, nowY, opacity, headCanvas, bodyCanvas, damageCanvas);
            }
        }
        else {
            // 移动中
            var direction = moveSteps[0];
            if (step == 0) {
                // 根据faceIds修改朝向
                var currid = faceIds[direction];
                if (core.isset(currid)) {
                    var tby = core.material.icons[block.event.cls][currid];
                    if (core.isset(tby))
                        by = tby;
                }
            }
            step++;
            nowX+=core.utils.scan[direction].x*2;
            nowY+=core.utils.scan[direction].y*2;
            // 移动
            core.maps.__moveBlockCanvas(image, animateCurrent, by, height, nowX, nowY, opacity, headCanvas, bodyCanvas, damageCanvas);
            if (step==16) {
                // 该移动完毕，继续
                step=0;
                moveSteps.shift();
            }
        }
    }, time / 16 / core.status.replay.speed);

    core.animateFrame.asyncId[animate] = true;

}

////// 显示跳跃某块的动画，达到{"type":"jump"}的效果 //////
maps.prototype.jumpBlock = function(sx,sy,ex,ey,time,keep,callback) {
    time = time || 500;
    var floorId = core.status.floorId;
    var block = core.getBlock(sx,sy);
    if (block==null) {
        if (core.isset(callback)) callback();
        return;
    }
    var id = block.block.id;

    // 需要删除该块
    core.removeBlock(sx,sy);

    block=block.block;
    var blockInfo = this.__getBlockInfo(block);
    if (blockInfo == null) {
        if (core.isset(callback)) callback();
        return;
    }
    var image = blockInfo.image, bx = blockInfo.bx, by = blockInfo.by, height = blockInfo.height, isTileset = blockInfo.isTileset, faceIds = blockInfo.faceIds;

    core.playSound('jump.mp3');

    var dx = ex-sx, dy=ey-sy, distance = Math.round(Math.sqrt(dx * dx + dy * dy));
    var jump_peak = 6 + distance, jump_count = jump_peak * 2;
    var currx = sx, curry = sy;

    var drawX = function() {
        return currx * 32;
    }

    var drawY = function() {
        var ret = curry * 32;
        if(jump_count >= jump_peak){
            var n = jump_count - jump_peak;
        }else{
            var n = jump_peak - jump_count;
        }
        return ret - (jump_peak * jump_peak - n * n) / 2;
    }

    var updateJump = function() {
        jump_count--;
        currx = (currx * jump_count + ex) / (jump_count + 1.0);
        curry = (curry * jump_count + ey) / (jump_count + 1.0);
    }

    var blockCanvas = this.__initBlockCanvas(block, height, sx, sy);
    var headCanvas = blockCanvas.headCanvas, bodyCanvas = blockCanvas.bodyCanvas, damageCanvas = blockCanvas.damageCanvas;
    var opacity = 1;

    core.maps.__moveBlockCanvas(image, bx, by, height, drawX(), drawY(), opacity, headCanvas, bodyCanvas, damageCanvas);

    var animate=window.setInterval(function() {

        if (jump_count>0 && floorId == core.status.floorId) {
            updateJump();
            core.maps.__moveBlockCanvas(image, bx, by, height, drawX(), drawY(), opacity, headCanvas, bodyCanvas, damageCanvas);
        }
        else {
            if (keep || floorId != core.status.floorId) opacity=0;
            else opacity -= 0.06;
            if (opacity<=0) {
                delete core.animateFrame.asyncId[animate];
                clearInterval(animate);
                core.deleteCanvas(headCanvas);
                core.deleteCanvas(bodyCanvas);
                core.deleteCanvas(damageCanvas);
                if (keep) {
                    core.setBlock(id, ex, ey, floorId);
                    if (floorId == core.status.floorId)
                        core.showBlock(ex, ey);
                }
                if (core.isset(callback)) callback();
            }
            else {
                core.maps.__moveBlockCanvas(image, bx, by, height, drawX(), drawY(), opacity, headCanvas, bodyCanvas, damageCanvas);
            }
        }

    }, time / 16 / core.status.replay.speed);

    core.animateFrame.asyncId[animate] = true;
}

////// 显示/隐藏某个块时的动画效果 //////
maps.prototype.animateBlock = function (loc,type,time,callback) {
    if (type!='hide') type='show';

    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];

    var list = [];
    loc.forEach(function (t) {
        var block = core.getBlock(t[0],t[1],null,true);
        if (block==null) return;
        block=block.block;

        var blockInfo = core.maps.__getBlockInfo(block);
        if (blockInfo == null) return;
        var blockCanvas = core.maps.__initBlockCanvas(block, blockInfo.height, t[0], t[1]);
        var headCanvas = blockCanvas.headCanvas, bodyCanvas = blockCanvas.bodyCanvas, damageCanvas = blockCanvas.damageCanvas;

        list.push({
            'x': t[0], 'y': t[1], 'height': blockInfo.height,
            'bx': blockInfo.bx, 'by': blockInfo.by, 'image': blockInfo.image,
            'headCanvas': headCanvas, 'bodyCanvas': bodyCanvas, 'damageCanvas': damageCanvas
        });

    });

    if (list.length==0) {
        if (core.isset(callback)) callback();
        return;
    }

    var opacity = 0;
    if (type=='hide') opacity=1;

    var draw = function () {
        list.forEach(function (t) {
            core.maps.__moveBlockCanvas(t.image, t.bx, t.by, t.height, t.x*32, t.y*32, opacity, t.headCanvas, t.bodyCanvas, t.damageCanvas);
        })
    };
    draw();

    var per_time = 10, steps = parseInt(time / per_time), delta = 1 / steps;
    var animate = setInterval(function () {
        if (type=='show') opacity += delta;
        else opacity -= delta;
        if (opacity >=1 || opacity<=0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            list.forEach(function (t) {
                core.deleteCanvas(t.headCanvas);
                core.deleteCanvas(t.bodyCanvas);
                core.deleteCanvas(t.damageCanvas);
            });
            if (type == 'show') {
                loc.forEach(function (t) {
                    core.showBlock(t[0],t[1],data.floorId);
                });
            }
            else {
                loc.forEach(function (t) {
                    core.removeBlock(t[0],t[1],data.floorId);
                });
            }
            if (core.isset(callback)) callback();
        }
        else {
            draw();
        }
    }, per_time);

    core.animateFrame.asyncId[animate] = true;
}

////// 将某个块从禁用变成启用状态 //////
maps.prototype.showBlock = function(x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    var block = core.getBlock(x,y,floorId,true);
    if (block==null) return; // 不存在
    block=block.block;
    // 本身是禁用事件，启用之
    if (block.disable) {
        block.disable = false;
        // 在本层，添加动画
        if (floorId == core.status.floorId && core.isset(block.event)) {
            core.drawBlock(block);
            core.addGlobalAnimate(block);
        }
        core.updateStatusBar();
    }
}

////// 只隐藏但不删除某块 //////
maps.prototype.hideBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;

    var block = core.getBlock(x,y,floorId,true);
    if (block==null) return; // 不存在

    // 删除动画，清除地图
    if (floorId==core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.clearMap('event', x * 32, y * 32, 32, 32);
        var height = 32;
        if (core.isset(block.block.event)) height=block.block.event.height||32;
        if (height>32)
            core.clearMap('event2', x * 32, y * 32 +32-height, 32, height-32);
    }

    block.disable = true;
    core.updateStatusBar();
}

////// 将某个块从启用变成禁用状态 //////
maps.prototype.removeBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;

    var block = core.getBlock(x,y,floorId,true);
    if (block==null) return; // 不存在

    var index=block.index;

    // 删除动画，清除地图
    if (floorId==core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.clearMap('event', x * 32, y * 32, 32, 32);
        var height = 32;
        if (core.isset(block.block.event)) height=block.block.event.height||32;
        if (height>32)
            core.clearMap('event2', x * 32, y * 32 +32-height, 32, height-32);
    }

    // 删除Index
    core.removeBlockById(index, floorId);
    core.updateStatusBar();
}

////// 根据block的索引删除该块 //////
maps.prototype.removeBlockById = function (index, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;

    var blocks = core.status.maps[floorId].blocks, block = blocks[index];
    var x=block.x, y=block.y;

    // 检查该点是否存在事件
    var event = core.floors[floorId].events[x+","+y];
    if (!core.isset(event))
        event = core.floors[floorId].changeFloor[x+","+y];

    // 检查是否存在重生
    var isReborn = false;
    if (core.isset(block.event) && block.event.cls.indexOf('enemy')==0
        && core.enemys.hasSpecial(core.material.enemys[block.event.id].special, 23))
        isReborn = true;

    // 不存在事件，直接删除
    if (!isReborn && !core.isset(event)) {
        blocks.splice(index,1);
        return;
    }
    block.disable = true;
}

////// 一次性删除多个block //////
maps.prototype.removeBlockByIds = function (floorId, ids) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    ids.sort(function (a,b) {return b-a}).forEach(function (id) {
        core.removeBlockById(id, floorId);
    });
}

////// 改变图块 //////
maps.prototype.setBlock = function (number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    if (!core.isset(number) || !core.isset(x) || !core.isset(y)) return;
    if (x<0 || x>=(core.floors[floorId].width||13) || y<0 || y>=(core.floors[floorId].height||13)) return;

    var originBlock=core.getBlock(x,y,floorId,true);
    var block = core.maps.initBlock(x,y,number);
    core.maps.addInfo(block);
    core.maps.addEvent(block,x,y,core.floors[floorId].events[x+","+y]);
    core.maps.addChangeFloor(block,x,y,core.floors[floorId].changeFloor[x+","+y]);
    if (core.isset(block.event)) {
        if (floorId == core.status.floorId) {
            core.removeGlobalAnimate(x, y);
            core.clearMap('event', x * 32, y * 32, 32, 32);
            if (originBlock != null) {
                var height = (originBlock.block.event||{}).height||32;
                if (height>32)
                    core.clearMap('event2', x * 32, y * 32 +32-height, 32, height-32);
            }
        }
        if (originBlock==null) {
            core.status.maps[floorId].blocks.push(block);
        }
        else {
            originBlock.block.id = number;
            originBlock.block.event = block.event;
            block = originBlock.block;
        }
        if (floorId==core.status.floorId && !block.disable) {
            core.drawBlock(block);
            core.addGlobalAnimate(block);
            core.updateStatusBar();
        }
    }
}

////// 改变图层块 //////
maps.prototype.setBgFgBlock = function (name, number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    if (!core.isset(number) || !core.isset(x) || !core.isset(y)) return;
    if (x<0 || x>=(core.floors[floorId].width||13) || y<0 || y>=(core.floors[floorId].height||13)) return;
    if (name!='bg' && name!='fg') return;

    core.setFlag(name+"v_"+floorId+"_"+x+"_"+y, number);
    core.status[name+"maps"][floorId] = null;

    if (floorId == core.status.floorId)
        core.drawMap(floorId);
}

////// 添加一个全局动画 //////
maps.prototype.addGlobalAnimate = function (b) {
    if (main.mode=='editor' && main.editor.disableGlobalAnimate) return;
    if (!core.isset(b.event) || !core.isset(b.event.animate) || b.event.animate==1) return;
    core.status.globalAnimateObjs.push(b);
}

////// 添加一个Autotile全局动画 //////
maps.prototype.addAutotileGlobalAnimate = function (b) {
    if (main.mode=='editor' && main.editor.disableGlobalAnimate) return;
    if (!core.isset(b.event) || b.event.cls!='autotile') return;
    var id = b.event.id, img = core.material.images.autotile[id];
    if (!core.isset(img) || img.width==96) return;
    core.status.autotileAnimateObjs.blocks.push(b);
}

////// 删除一个或所有全局动画 //////
maps.prototype.removeGlobalAnimate = function (x, y, all, name) {
    if (main.mode=='editor' && main.editor.disableGlobalAnimate) return;

    if (all) {
        core.status.globalAnimateStatus = 0;
        core.status.globalAnimateObjs = [];
        core.status.autotileAnimateObjs = {"blocks": [], "map": null, "bgmap": null, "fgmap": null};
        return;
    }

    core.status.globalAnimateObjs = core.status.globalAnimateObjs.filter(function (block) {return block.x!=x || block.y!=y || block.name!=name;});

    // 检查Autotile
    if (core.isset(core.status.autotileAnimateObjs.blocks)) {
        core.status.autotileAnimateObjs.blocks = core.status.autotileAnimateObjs.blocks.filter(function (block) {return block.x!=x || block.y!=y || block.name!=name;});
        core.status.autotileAnimateObjs.map[y][x] = 0;
    }

}

////// 设置全局动画的显示效果 //////
maps.prototype.setGlobalAnimate = function (speed) {
    if (main.mode=='editor' && main.editor.disableGlobalAnimate) return;
    core.status.globalAnimateStatus = 0;
    core.animateFrame.globalAnimate = true;
}

////// 绘制UI层的box动画 //////
maps.prototype.drawBoxAnimate = function () {
    core.status.boxAnimateObjs.forEach(function (obj) {
        core.clearMap('ui', obj.bgx, obj.bgy, obj.bgWidth, obj.bgHeight);
        core.fillRect('ui', obj.bgx, obj.bgy, obj.bgWidth, obj.bgHeight, core.material.groundPattern);
        core.drawImage('ui', obj.image, core.status.globalAnimateStatus % obj.animate * 32, obj.pos,
            32, obj.height, obj.x, obj.y, 32, obj.height);
    });
}

////// 绘制动画的某一帧 //////
maps.prototype.drawAnimateFrame = function (animate, centerX, centerY, index) {
    var frame = animate.frames[index];
    var ratio = animate.ratio;
    frame.forEach(function (t) {
        var image = animate.images[t.index];
        if (!core.isset(image)) return;
        var realWidth = image.width * ratio * t.zoom / 100;
        var realHeight = image.height * ratio * t.zoom / 100;
        core.setAlpha('animate', t.opacity / 255);

        var cx = centerX+t.x, cy=centerY+t.y;

        if (!t.mirror && !t.angle) {
            core.drawImage('animate', image, cx-realWidth/2 - core.bigmap.offsetX, cy-realHeight/2 - core.bigmap.offsetY, realWidth, realHeight);
        }
        else {
            core.saveCanvas('animate');
            core.canvas.animate.translate(cx,cy);
            if (t.angle)
                core.canvas.animate.rotate(-t.angle*Math.PI/180);
            if (t.mirror)
                core.canvas.animate.scale(-1,1);
            core.drawImage('animate', image, -realWidth/2 - core.bigmap.offsetX, -realHeight/2 - core.bigmap.offsetY, realWidth, realHeight);
            core.loadCanvas('animate');
        }
        core.setAlpha('animate', 1);
    })
}

////// 绘制动画 //////
maps.prototype.drawAnimate = function (name, x, y, callback) {

    // 正在播放录像：不显示动画
    if (core.isReplaying()) {
        if (core.isset(callback)) callback();
        return -1;
    }

    // 检测动画是否存在
    if (!core.isset(core.material.animates[name]) || !core.isset(x) || !core.isset(y)) {
        if (core.isset(callback)) callback();
        return -1;
    }

    // 开始绘制
    var animate = core.material.animates[name], centerX = 32*x+16, centerY = 32*y+16;
    // 播放音效
    core.playSound(animate.se);

    var animateId = parseInt(Math.random() * 100000000);
    core.status.animateObjs.push({
        "animate": animate,
        "centerX": centerX,
        "centerY": centerY,
        "index": 0,
        "id": animateId,
        "callback": callback
    });

    core.animateFrame.asyncId[animateId] = true;
    return animateId;
}

////// 停止动画 //////
maps.prototype.stopAnimate = function (id, doCallback) {
    for (var i=0;i<core.status.animateObjs.length;i++) {
        var obj = core.status.animateObjs[i];
        if (obj.id == id) {
            delete core.animateFrame.asyncId[obj.id];
            if (doCallback) {
                (function(callback) {
                    setTimeout(function() {
                        if (core.isset(callback))
                            callback();
                    });
                })(obj.callback);
            }
        }
        core.status.animateObjs.splice(i, 1);
        if (core.status.animateObjs.length == 0) {
            core.clearMap('animate');
        }
        break;
    }
}

maps.prototype.setFloorImage = function (type, loc, floorId, callback) {
    if (type!='show') type='hide';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;

    if (loc.length==0) return;
    loc.forEach(function (t) {
        var x=t[0], y=t[1];
        var flag = "floorimg_"+floorId+"_"+x+"_"+y;
        core.setFlag(flag, type=='show'?false:true);
    })

    if (floorId==core.status.floorId) {
        core.drawMap(floorId, callback);
    }
    else {
        if (core.isset(callback)) callback();
    }
}

maps.prototype.setBgFgMap = function (type, name, loc, floorId, callback) {
    if (type!='show') type='hide';
    if (name!='fg') name='bg';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;

    if (loc.length==0) return;
    loc.forEach(function (t) {
        var x=t[0], y=t[1];
        var flag = name+"_"+floorId+"_"+x+"_"+y;
        core.setFlag(flag, type=='show'?false:true);
    })
    core.status[name+"maps"][floorId]=null;

    if (floorId==core.status.floorId) {
        core.drawMap(floorId, callback);
    }
    else {
        if (core.isset(callback)) callback();
    }
}

maps.prototype.resetMap = function(floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(floorId)) return;
    if (typeof floorId == 'string') floorId = [floorId];
    var needRefresh = false;
    floorId.forEach(function (t) {
        core.status.maps[t] = core.maps.loadFloor(t);
        if (t == core.status.floorId) needRefresh = true;
    });
    if (needRefresh) this.drawMap(core.status.floorId);
    core.drawTip("地图重置成功");
}