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
    ["floorId", "title", "name", "canFlyTo", "canUseQuickShop", "cannotViewMap", "color", "weather",
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
            if (block.event.cls.indexOf("enemy")==0 || block.event.cls.indexOf("npc")==0 || block.event.cls=='terrains' || block.event.cls=='autotile') {
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

    // 覆盖noPass
    if (core.isset(event.noPass))
        block.event.noPass = event.noPass;

    // 覆盖enable
    if (!core.isset(block.disable) && core.isset(event.enable)) {
        block.disable=!event.enable;
    }
    // 覆盖trigger
    if (!core.isset(block.event.trigger)) {
        if (core.isset(event.trigger)) block.event.trigger=event.trigger;
        else block.event.trigger='action';
    }
    else if (core.isset(event.trigger) && event.trigger!='checkBlock') {
        block.event.trigger=event.trigger;
    }
    // 覆盖其他属性
    for (var key in event) {
        if (key!="disable" && key!="trigger" && key!="noPass" && core.isset(event[key])) {
            block.event[key]=core.clone(event[key]);
        }
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
    if (floorId == undefined) {
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
    if (!core.isset(floorId)) floorId=core.status.floorId;

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

    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    var nx = x+scan[direction].x, ny = y+scan[direction].y;
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

    var cls = block.event.cls, height = block.event.height || 32;

    var image, x, y;

    if (cls == 'tileset') {
        var offset = core.icons.getTilesetOffset(block.event.id);
        if (offset == null) return;
        image = core.material.images.tilesets[offset.image];
        x = offset.x;
        y = offset.y;
    }
    else if (cls == 'autotile') return;
    // 空气墙的单独处理
    else if (block.id==17) {
        if (!core.isset(core.material.images.airwall)) return;
        image = core.material.images.airwall;
        x = y = 0;
    }
    else {
        image = core.material.images[cls];
        x = (animate||0)%(block.event.animate||1);
        y = core.material.icons[cls][block.event.id];
    }
    dx = dx || 0;
    dy = dy || 0;

    core.canvas.event.clearRect(block.x * 32 + dx, block.y * 32 + dy, 32, 32);
    core.canvas.event.drawImage(image, x * 32, y * height + height-32, 32, 32, block.x * 32 + dx, block.y * 32 + dy, 32, 32);
    if (height>32) {
        core.canvas.event2.clearRect(block.x * 32 + dx, block.y * 32 + 32 - height + dy, 32, height-32)
        core.canvas.event2.drawImage(image, x * 32, y * height, 32, height-32, block.x * 32 + dx, block.y*32 + 32 - height + dy, 32, height-32);
    }
}

maps.prototype.getBgFgMapArray = function (floorId, name) {
    floorId = floorId||core.status.floorId;
    var width = core.floors[floorId].width || 13;
    var height = core.floors[floorId].height || 13;

    if (core.isset(core.status[name+"maps"][floorId]))
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
maps.prototype.drawBgFgMap = function (floorId, canvas, name) {
    floorId = floorId || core.status.floorId;
    var width = core.floors[floorId].width || 13;
    var height = core.floors[floorId].height || 13;

    var groundId = (core.status.maps||core.floors)[floorId].defaultGround || "ground";
    var blockIcon = core.material.icons.terrains[groundId];
    var blockImage = core.material.images.terrains;

    if (!core.isset(core.status[name+"maps"]))
        core.status[name+"maps"] = {};

    var arr = this.getBgFgMapArray(floorId, name);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            if (name=='bg')
                canvas.drawImage(blockImage, 0, blockIcon * 32, 32, 32, x * 32, y * 32, 32, 32);
            if (arr[y][x]>0) {
                var block = core.maps.initBlock(x, y, arr[y][x]);
                if (core.isset(block.event)) {
                    var id = block.event.id, cls = block.event.cls;
                    if (cls == 'autotile')
                        core.drawAutotile(canvas, arr, block, 32, 0, 0);
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
                    else
                        canvas.drawImage(core.material.images[cls], 0, core.material.icons[cls][id] * 32, 32, 32, x * 32, y * 32, 32, 32);
                }
            }
        }
    }

}

////// 绘制某张地图 //////
maps.prototype.drawMap = function (mapName, callback) {
    mapName = mapName || core.status.floorId;
    core.clearMap('all');
    core.removeGlobalAnimate(null, null, true);

    var drawBg = function(){

        core.maps.drawBgFgMap(mapName, core.canvas.bg, "bg");
        core.maps.drawBgFgMap(mapName, core.canvas.fg, "fg");

        var images = [];
        if (core.isset(core.status.maps[mapName].images)) {
            images = core.status.maps[mapName].images;
            if (typeof images == 'string') {
                images = [[0, 0, images]];
            }
        }
        images.forEach(function (t) {
            var dx=parseInt(t[0]), dy=parseInt(t[1]), p=t[2];
            if (core.isset(dx) && core.isset(dy) &&
                !core.hasFlag("floorimg_"+mapName+"_"+dx+"_"+dy) &&
                core.isset(core.material.images.images[p])) {
                var image = core.material.images.images[p];
                if (!t[3]) {
                    if (/.*\.gif/i.test(p) && main.mode=='play') {
                        core.dom.gif.innerHTML = "";
                        var gif = new Image();
                        gif.src = core.material.images.images[p].src;
                        gif.style.position = 'absolute';
                        gif.style.left = (32*dx*core.domStyle.scale)+"px";
                        gif.style.top = (32*dy*core.domStyle.scale)+"px";
                        gif.style.width = core.material.images.images[p].width*core.domStyle.scale+"px";
                        gif.style.height = core.material.images.images[p].height*core.domStyle.scale+"px";
                        core.dom.gif.appendChild(gif);
                    }
                    else {
                        core.canvas.bg.drawImage(image, 32*dx, 32*dy, image.width, image.height);
                    }
                }
                else if (t[3]==1)
                    core.canvas.fg.drawImage(image, 32*dx, 32*dy, image.width, image.height);
                else if (t[3]==2) {
                    core.canvas.fg.drawImage(image, 0, 0, image.width, image.height-32,
                        32*dx, 32*dy, image.width, image.height-32);
                    core.canvas.bg.drawImage(image, 0, image.height-32, image.width, 32,
                        32*dx, 32*dy + image.height - 32, image.width, 32);
                }
            }
        })

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

    core.status.floorId = mapName;
    core.status.thisMap = core.status.maps[mapName];
    var drawEvent = function(){
        core.status.autotileAnimateObjs = {"status": 0, "blocks": [], "map": null};

        var mapData = core.status.maps[core.status.floorId];
        var mapBlocks = mapData.blocks;

        var mapArray = core.maps.getMapArray(mapBlocks,core.bigmap.width,core.bigmap.height);
        for (var b = 0; b < mapBlocks.length; b++) {
            // 事件启用
            var block = mapBlocks[b];
            if (core.isset(block.event) && !block.disable) {
                if (block.event.cls == 'autotile') {
                    core.drawAutotile(core.canvas.event, mapArray, block, 32, 0, 0);
                    core.status.autotileAnimateObjs.blocks.push(core.clone(block));
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
        else return mapArr[y][x]==currId ? 1:0;
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
    if (!core.isset(floorId)) floorId=core.status.floorId;
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

////// 显示移动某块的动画，达到{“type”:”move”}的效果 //////
maps.prototype.moveBlock = function(x,y,steps,time,keep,callback) {
    time = time || 500;

    core.clearMap('route');

    var block = core.getBlock(x,y);
    if (block==null) {// 不存在
        if (core.isset(callback)) callback();
        return;
    }
    var id = block.block.id;

    core.status.replay.animate=true;

    // 需要删除该块
    core.removeBlock(x,y);

    core.clearMap('ui');
    core.setAlpha('ui', 1.0);

    block=block.block;

    var image, bx, by, height = block.event.height || 32;
    if (block.event.cls == 'tileset') {
        var offset = core.icons.getTilesetOffset(block.event.id);
        if (offset==null) {
            if (core.isset(callback)) callback();
            return;
        }
        bx = offset.x;
        by = offset.y;
        image = core.material.images.tilesets[offset.image];
    }
    // 不支持autotile
    else if (block.event.cls == 'autotile') {
        if (core.isset(callback)) callback();
        return;
    }
    // 空气墙；忽略事件
    else if (block.id==17) {
        if (core.isset(callback)) callback();
        return;
    }
    else {
        image = core.material.images[block.event.cls];
        bx = 0;
        by = core.material.icons[block.event.cls][block.event.id];
    }

    var opacityVal = 1;
    core.setOpacity('route', opacityVal);
    core.canvas.route.drawImage(image, bx * 32, by * height, 32, height, block.x * 32, block.y * 32 +32 - height, 32, height);

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
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    var animateValue = block.event.animate || 1;
    var animateCurrent = 0;
    var animateTime = 0;

    var animate=window.setInterval(function() {

        animateTime += time / 16 / core.status.replay.speed;
        if (animateTime >= core.values.animateSpeed) {
            animateCurrent++;
            animateTime = 0;
            if (animateCurrent>=animateValue) animateCurrent=0;
        }
        if (block.event.cls=='tileset') {
            animateCurrent = bx;
        }

        // 已经移动完毕，消失
        if (moveSteps.length==0) {
            if (keep) opacityVal=0;
            else opacityVal -= 0.06;
            core.setOpacity('route', opacityVal);
            core.clearMap('route', nowX, nowY-height+32, 32, height);
            core.canvas.route.drawImage(image, animateCurrent * 32, by * height, 32, height, nowX, nowY-height+32, 32, height);
            if (opacityVal<=0) {
                clearInterval(animate);
                core.clearMap('route');
                core.setOpacity('route', 1);
                // 不消失
                if (keep) {
                    core.setBlock(id, nowX/32, nowY/32);
                    core.showBlock(nowX/32, nowY/32);
                }
                core.status.replay.animate=false;
                if (core.isset(callback)) callback();
            }
        }
        else {
            // 移动中
            step++;
            nowX+=scan[moveSteps[0]].x*2;
            nowY+=scan[moveSteps[0]].y*2;
            core.clearMap('route', nowX-32, nowY-32, 96, 96);
            // 绘制
            core.canvas.route.drawImage(image, animateCurrent * 32, by * height, 32, height, nowX, nowY-height+32, 32, height);
            if (step==16) {
                // 该移动完毕，继续
                step=0;
                moveSteps.shift();
            }
        }
    }, time / 16 / core.status.replay.speed);
}

////// 显示跳跃某块的动画，达到{"type":"jump"}的效果 //////
maps.prototype.jumpBlock = function(sx,sy,ex,ey,time,keep,callback) {
    time = time || 500;
    core.clearMap('route');
    var block = core.getBlock(sx,sy);
    if (block==null) {
        if (core.isset(callback)) callback();
        return;
    }
    var id = block.block.id;

    core.status.replay.animate=true;

    // 需要删除该块
    core.removeBlock(sx,sy);
    core.clearMap('ui');
    core.setAlpha('ui', 1.0);

    block=block.block;
    var image, bx, by, height = block.event.height || 32;
    if (block.event.cls == 'tileset') {
        var offset = core.icons.getTilesetOffset(block.event.id);
        if (offset==null) {
            if (core.isset(callback)) callback();
            return;
        }
        bx = offset.x;
        by = offset.y;
        image = core.material.images.tilesets[offset.image];
    }
    // 不支持autotile
    else if (block.event.cls == 'autotile') {
        if (core.isset(callback)) callback();
        return;
    }
    // 空气墙；忽略事件
    else if (block.id==17) {
        if (core.isset(callback)) callback();
        return;
    }
    else {
        image = core.material.images[block.event.cls];
        bx = 0;
        by = core.material.icons[block.event.cls][block.event.id];
    }

    var opacityVal = 1;
    core.setOpacity('route', opacityVal);
    core.canvas.route.drawImage(image, bx*32, by * height, 32, height, block.x * 32, block.y * 32 +32 - height, 32, height);

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

    var animateValue = block.event.animate || 1;
    var animateCurrent = 0;
    var animateTime = 0;
    var animate=window.setInterval(function() {

        animateTime += time / 16 / core.status.replay.speed;
        if (animateTime >= core.values.animateSpeed) {
            animateCurrent++;
            animateTime = 0;
            if (animateCurrent >= animateValue) animateCurrent = 0;
        }
        if (block.event.cls=='tileset') {
            animateCurrent = bx;
        }

        if (jump_count>0) {
            core.clearMap('route', drawX(), drawY()-height+32, 32, height);
            updateJump();
            core.canvas.route.drawImage(image, animateCurrent * 32, by * height, 32, height, drawX(), drawY()-height+32, 32, height);
        }
        else {
            if (keep) opacityVal=0;
            else opacityVal -= 0.06;
            core.setOpacity('route', opacityVal);
            core.clearMap('route', drawX(), drawY()-height+32, 32, height);
            core.canvas.route.drawImage(image, animateCurrent * 32, by * height, 32, height, drawX(), drawY()-height+32, 32, height);
            if (opacityVal<=0) {
                clearInterval(animate);
                core.clearMap('route');
                core.setOpacity('route', 1);
                if (keep) {
                    core.setBlock(id, ex, ey);
                    core.showBlock(ex, ey);
                }
                core.status.replay.animate=false;
                if (core.isset(callback)) callback();
            }
        }

    }, time / 16 / core.status.replay.speed);
}

////// 显示/隐藏某个块时的动画效果 //////
maps.prototype.animateBlock = function (loc,type,time,callback) {
    if (type!='hide') type='show';

    core.clearMap('route');

    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];

    var list = [];
    loc.forEach(function (t) {
        var block = core.getBlock(t[0],t[1],null,true);
        if (block==null) return;
        block=block.block;
        var image, bx, by, height = block.event.height || 32;
        if (block.event.cls == 'tileset') {
            var offset = core.icons.getTilesetOffset(block.event.id);
            if (offset==null) {
                if (core.isset(callback)) callback();
                return;
            }
            bx = offset.x;
            by = offset.y;
            image = core.material.images.tilesets[offset.image];
        }
        // 不支持autotile
        else if (block.event.cls == 'autotile') {
            return;
        }
        // 空气墙，忽略事件
        else if (block.id==17) return;
        else {
            image = core.material.images[block.event.cls];
            bx = 0;
            by = core.material.icons[block.event.cls][block.event.id];
        }
        list.push({
            'x': t[0], 'y': t[1], 'height': height,
            'bx': bx, 'by': by, 'image': image
        })
    })

    if (list.length==0) {
        if (core.isset(callback)) callback();
        return;
    }

    core.status.replay.animate=true;
    var draw = function () {
        list.forEach(function (t) {
            core.canvas.route.drawImage(t.image, t.bx*32, t.by*t.height, 32, t.height, t.x*32, t.y*32+32-t.height, 32, t.height);
        })
    }

    var opacityVal = 0;
    if (type=='hide') opacityVal=1;

    core.setOpacity('route', opacityVal);
    draw();

    var animate = window.setInterval(function () {
        if (type=='show') opacityVal += 0.1;
        else opacityVal -= 0.1;
        core.setOpacity('route', opacityVal);
        if (opacityVal >=1 || opacityVal<=0) {
            clearInterval(animate);
            core.clearMap('route');
            core.setOpacity('route', 1);
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, time / 10 / core.status.replay.speed);
}

////// 将某个块从禁用变成启用状态 //////
maps.prototype.showBlock = function(x, y, floodId) {
    floodId = floodId || core.status.floorId;
    var block = core.getBlock(x,y,floodId,true);
    if (block==null) return; // 不存在
    block=block.block;
    // 本身是禁用事件，启用之
    if (block.disable) {
        block.disable = false;
        // 在本层，添加动画
        if (floodId == core.status.floorId && core.isset(block.event)) {
            core.drawBlock(block);
            core.addGlobalAnimate(block);
            core.syncGlobalAnimate();
        }
        core.updateStatusBar();
    }
}

////// 只隐藏但不删除某块 //////
maps.prototype.hideBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;

    var block = core.getBlock(x,y,floorId,true);
    if (block==null) return; // 不存在

    // 删除动画，清除地图
    if (floorId==core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.canvas.event.clearRect(x * 32, y * 32, 32, 32);
        var height = 32;
        if (core.isset(block.block.event)) height=block.block.event.height||32;
        if (height>32)
            core.canvas.event2.clearRect(x * 32, y * 32 +32-height, 32, height-32);
    }

    block.disable = true;
    core.updateStatusBar();
}

////// 将某个块从启用变成禁用状态 //////
maps.prototype.removeBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;

    var block = core.getBlock(x,y,floorId,true);
    if (block==null) return; // 不存在

    var index=block.index;

    // 删除动画，清除地图
    if (floorId==core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.canvas.event.clearRect(x * 32, y * 32, 32, 32);
        var height = 32;
        if (core.isset(block.block.event)) height=block.block.event.height||32;
        if (height>32)
            core.canvas.event2.clearRect(x * 32, y * 32 +32-height, 32, height-32);
    }

    // 删除Index
    core.removeBlockById(index, floorId);
    core.updateStatusBar();
}

////// 根据block的索引删除该块 //////
maps.prototype.removeBlockById = function (index, floorId) {

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
    ids.sort(function (a,b) {return b-a}).forEach(function (id) {
        core.removeBlockById(id, floorId);
    });
}

////// 改变图块 //////
maps.prototype.setBlock = function (number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(number) || !core.isset(x) || !core.isset(y)) return;
    if (x<0 || x>=core.bigmap.width || y<0 || y>=core.bigmap.height) return;

    var originBlock=core.getBlock(x,y,floorId,true);
    var block = core.maps.initBlock(x,y,number);
    core.maps.addInfo(block);
    core.maps.addEvent(block,x,y,core.floors[floorId].events[x+","+y]);
    core.maps.addChangeFloor(block,x,y,core.floors[floorId].changeFloor[x+","+y]);
    if (core.isset(block.event)) {
        if (originBlock==null) {
            core.status.maps[floorId].blocks.push(block);
        }
        else {
            originBlock.block.id = number;
            originBlock.block.event = block.event;
        }
        if (floorId==core.status.floorId) {
            core.drawMap(floorId);
        }
    }
}

////// 改变图层块 //////
maps.prototype.setBgFgBlock = function (name, number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!core.isset(number) || !core.isset(x) || !core.isset(y)) return;
    if (x<0 || x>=core.bigmap.width || y<0 || y>=core.bigmap.height) return;
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

    var block = core.clone(b);
    block.status = 0;

    core.status.globalAnimateObjs.push(block);

}

////// 删除一个或所有全局动画 //////
maps.prototype.removeGlobalAnimate = function (x, y, all) {
    if (main.mode=='editor' && main.editor.disableGlobalAnimate) return;

    if (all) {
        core.status.globalAnimateObjs = [];
        core.status.autotileAnimateObjs = {};
        return;
    }

    core.status.globalAnimateObjs = core.status.globalAnimateObjs.filter(function (block) {return block.x!=x || block.y!=y;});

    // 检查Autotile
    if (core.isset(core.status.autotileAnimateObjs.blocks)) {
        core.status.autotileAnimateObjs.blocks = core.status.autotileAnimateObjs.blocks.filter(function (block) {return block.x!=x || block.y!=y;});
        core.status.autotileAnimateObjs.map[y][x] = 0;
    }

}

////// 设置全局动画的显示效果 //////
maps.prototype.setGlobalAnimate = function (speed) {
    if (main.mode=='editor' && main.editor.disableGlobalAnimate) return;
    core.syncGlobalAnimate();
    core.animateFrame.speed = speed;
    core.animateFrame.globalAnimate = true;
}

////// 同步所有的全局动画效果 //////
maps.prototype.syncGlobalAnimate = function () {
    core.status.globalAnimateObjs.forEach(function (t) {
        t.status=0;
    })
    if (core.isset(core.status.autotileAnimateObjs.status)) {
        core.status.autotileAnimateObjs.status = 0;
    }
}

////// 绘制UI层的box动画 //////
maps.prototype.drawBoxAnimate = function () {
    for (var a = 0; a < core.status.boxAnimateObjs.length; a++) {
        var obj = core.status.boxAnimateObjs[a];
        obj.status = ((obj.status||0)+1)%obj.animate;
        core.clearMap('ui', obj.bgx, obj.bgy, obj.bgWidth, obj.bgHeight);
        core.fillRect('ui', obj.bgx, obj.bgy, obj.bgWidth, obj.bgHeight, core.animateFrame.background);
        core.canvas.ui.drawImage(obj.image, obj.status * 32, obj.pos,
            32, obj.height, obj.x, obj.y, 32, obj.height);
    }
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
            core.canvas.animate.drawImage(image, cx-realWidth/2 - core.bigmap.offsetX, cy-realHeight/2 - core.bigmap.offsetY, realWidth, realHeight);
        }
        else {
            core.saveCanvas('animate');
            core.canvas.animate.translate(cx,cy);
            if (t.angle)
                core.canvas.animate.rotate(-t.angle*Math.PI/180);
            if (t.mirror)
                core.canvas.animate.scale(-1,1);
            core.canvas.animate.drawImage(image, -realWidth/2 - core.bigmap.offsetX, -realHeight/2 - core.bigmap.offsetY, realWidth, realHeight);
            core.loadCanvas('animate');
        }
    })
}

////// 绘制动画 //////
maps.prototype.drawAnimate = function (name, x, y, callback) {

    // 正在播放录像：不显示动画
    if (core.isset(core.status.replay) && core.status.replay.replaying) {
        if (core.isset(callback)) callback();
        return;
    }

    // 检测动画是否存在
    if (!core.isset(core.material.animates[name]) || !core.isset(x) || !core.isset(y)) {
        if (core.isset(callback)) callback();
        return;
    }

    clearInterval(core.interval.animateInterval);

    // 开始绘制
    var animate = core.material.animates[name], centerX = 32*x+16, centerY = 32*y+16;
    // 播放音效
    core.playSound(animate.se);

    // 异步绘制：使用requestAnimationFrame进行绘制
    if (!core.isset(callback)) {
        core.status.animateObjs.push({"animate": animate, "centerX": centerX, "centerY": centerY, "index": 0});
        return;
    }

    var index=0;
    core.clearMap('animate');
    core.maps.drawAnimateFrame(animate, centerX, centerY, index++);

    core.interval.animateInterval = setInterval(function (t) {
        if (index == animate.frames.length) {
            clearInterval(core.interval.animateInterval);
            core.clearMap('animate');
            core.setAlpha('animate', 1);
            if (core.isset(callback)) callback();
            return;
        }
        core.clearMap('animate');
        core.maps.drawAnimateFrame(animate, centerX, centerY, index++);
    }, 50);
}

maps.prototype.setFloorImage = function (type, loc, floorId, callback) {
    if (type!='show') type='hide';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    floorId = floorId||core.status.floorId;

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
    floorId = floorId||core.status.floorId;

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
    var floorId = floorId||core.status.floorId;
    core.status.maps[floorId] = this.loadFloor(floorId);
    if (floorId==core.status.floorId) {
        this.drawMap(floorId, function () {
            core.drawTip("地图重置成功");
        })
    }
    else {
        core.drawTip(floorId+"地图重置成功");
    }
}