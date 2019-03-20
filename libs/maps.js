"use strict";

function maps() {
    this._init();
}

maps.prototype._init = function () {
    this.blocksInfo = maps_90f36752_8815_4be8_b32b_d7fad1d0542e;
    //delete(maps_90f36752_8815_4be8_b32b_d7fad1d0542e);
}

maps.prototype._setFloorSize = function (floorId) {
    if (!floorId) {
        core.floorIds.forEach(function (floorId) {
            core.maps._setFloorSize(floorId);
        });
        return;
    }
    core.floors[floorId].width = core.floors[floorId].width || core.__SIZE__;
    core.floors[floorId].height = core.floors[floorId].height || core.__SIZE__;
}

// ------ 加载地图与地图的存档读档（压缩与解压缩） ------ //

////// 加载某个楼层（从剧本或存档中） //////
maps.prototype.loadFloor = function (floorId, map) {
    var floor = core.floors[floorId];
    if (!map) map = floor.map;
    if (map instanceof Array) {
        map = {"map": map};
    }
    var content = {};
    ["floorId", "title", "name", "canFlyTo", "canUseQuickShop", "cannotViewMap", "cannotMoveDirectly", "color", "weather",
        "defaultGround", "images", "item_ratio", "upFloor", "bgm", "downFloor", "underGround"].forEach(function (e) {
        if (map[e] != null) content[e] = core.clone(map[e]);
        else content[e] = core.clone(floor[e]);
    });
    map = this.decompressMap(map.map, floorId);
    // 事件处理
    content['blocks'] = this._mapIntoBlocks(map, floor, floorId);
    return content;
}

maps.prototype._mapIntoBlocks = function (map, floor, floorId) {
    var blocks = [];
    var mw = core.floors[floorId].width;
    var mh = core.floors[floorId].height;
    for (var i = 0; i < mh; i++) {
        for (var j = 0; j < mw; j++) {
            var block = this.initBlock(j, i, (map[i] || [])[j], true, floor);
            if (block.id != 0 || block.event.trigger)
                blocks.push(block);
        }
    }
    return blocks;
}

////// 从ID获得数字 //////
maps.prototype.getNumberById = function (id) {
    for (var number in this.blocksInfo) {
        if ((this.blocksInfo[number] || {}).id == id)
            return parseInt(number) || 0;
    }
    // tilesets
    if (/^X\d+$/.test(id)) {
        if (core.icons.getTilesetOffset(id)) return parseInt(id.substring(1));
    }
    // 特殊ID
    if (id == 'none') return 0;
    if (id == 'airwall') return 17;
    return 0;
}

////// 数字和ID的对应关系 //////
maps.prototype.initBlock = function (x, y, id, addInfo, eventFloor) {
    var disable = null;
    id = "" + (id || 0);
    if (id.endsWith(":f")) disable = true;
    if (id.endsWith(":t")) disable = false;
    id = parseInt(id);
    var block = {'x': x, 'y': y, 'id': id};
    if (disable != null) block.disable = disable;

    if (id == 17) block.event = {"cls": "terrains", "id": "airwall", "noPass": true};
    else if (id in this.blocksInfo) block.event = JSON.parse(JSON.stringify(this.blocksInfo[id]));
    else if (core.icons.getTilesetOffset(id)) block.event = {"cls": "tileset", "id": "X" + id, "noPass": true};
    else block.event = {'cls': 'terrains', 'id': 'none', 'noPass': false};

    if (addInfo) this._addInfo(block);
    if (eventFloor) {
        this._addEvent(block, x, y, (eventFloor.events || {})[x + "," + y]);
        var changeFloor = (eventFloor.changeFloor || {})[x + "," + y];
        if (changeFloor) this._addEvent(block, x, y, {"trigger": "changeFloor", "data": changeFloor});
    }
    if (main.mode == 'editor') delete block.disable;
    return block;
}

////// 添加一些信息到block上 //////
maps.prototype._addInfo = function (block) {
    if (block.event.cls.indexOf("enemy") == 0 && !block.event.trigger) {
        block.event.trigger = 'battle';
    }
    if (block.event.cls == 'items' && !block.event.trigger) {
        block.event.trigger = 'getItem';
    }
    if (block.event.noPass == null) {
        if (block.event.cls != 'items') {
            block.event.noPass = true;
        }
    }
    if (block.event.animate == null) {
        block.event.animate = core.icons._getAnimateFrames(block.event.cls, false);
    }
    block.event.height = 32;
    if (block.event.cls == 'enemy48' || block.event.cls == 'npc48')
        block.event.height = 48;
}

////// 向该楼层添加剧本的自定义事件 //////
maps.prototype._addEvent = function (block, x, y, event) {
    if (!event) return;
    // event是字符串或数组？
    if (typeof event == "string") {
        event = {"data": [event]};
    }
    else if (event instanceof Array) {
        event = {"data": event};
    }
    event.data = event.data || [];

    // 覆盖enable
    if (block.disable == null && event.enable != null) {
        block.disable = !event.enable;
    }
    // 覆盖animate
    if (event.animate === false) {
        block.event.animate = 1;
    }
    // 覆盖所有属性
    for (var key in event) {
        if (key != "enable" && key != "animate" && event[key] != null) {
            block.event[key] = core.clone(event[key]);
        }
    }
    // 给无trigger的增加trigger:action
    if (!block.event.trigger) {
        block.event.trigger = 'action';
    }
}

////// 初始化所有地图 //////
maps.prototype.initMaps = function (floorIds) {
    var maps = {};
    for (var i = 0; i < floorIds.length; i++) {
        var floorId = floorIds[i];
        maps[floorId] = this.loadFloor(floorId);
    }
    return maps;
}

maps.prototype._initFloorMap = function (floorId) {
    var map = core.clone(core.floors[floorId].map);

    var mw = core.floors[floorId].width;
    var mh = core.floors[floorId].height;

    for (var x = 0; x < mh; x++) {
        if (map[x] == null) map[x] = [];
        for (var y = 0; y < mw; y++) {
            if (map[x][y] == null) map[x][y] = 0;
            // check "disable"
            var event = core.floors[floorId].events[y + "," + x];
            if (event && event.enable === false && main.mode == 'play') {
                map[x][y] += ":f";
            }
        }
    }

    return map;
}

////// 压缩地图
maps.prototype.compressMap = function (mapArr, floorId) {
    var floorMap = this._initFloorMap(floorId);
    if (core.utils.same(mapArr, floorMap)) return null;

    var mw = core.floors[floorId].width;
    var mh = core.floors[floorId].height;
    for (var x = 0; x < mh; x++) {
        if (core.utils.same(mapArr[x], floorMap[x])) {
            // 没有改变的行直接删掉记成0
            mapArr[x] = 0;
        }
        else {
            for (var y = 0; y < mw; y++) {
                if (mapArr[x][y] === floorMap[x][y]) {
                    // 没有改变的数据记成-1
                    mapArr[x][y] = -1;
                }
            }
        }
    }
    return mapArr;
}

////// 解压缩地图
maps.prototype.decompressMap = function (mapArr, floorId) {
    var floorMap = this._initFloorMap(floorId);
    if (!mapArr) return floorMap;

    var mw = core.floors[floorId].width;
    var mh = core.floors[floorId].height;
    for (var x = 0; x < mh; x++) {
        if (mapArr[x] === 0) {
            mapArr[x] = floorMap[x];
        }
        else {
            for (var y = 0; y < mw; y++) {
                if (mapArr[x][y] === -1) {
                    mapArr[x][y] = floorMap[x][y];
                }
            }
        }
    }
    return mapArr;
}

////// 将当前地图重新变成数字，以便于存档 //////
maps.prototype.saveMap = function (floorId) {
    var maps = core.status.maps;
    if (!floorId) {
        var map = {};
        for (var id in maps) {
            map[id] = this.saveMap(id);
        }
        return map;
    }
    var map = maps[floorId], floor = core.floors[floorId];
    var blocks = this.getMapArray(map.blocks, floor.width, floor.height, true);
    if (main.mode == 'editor') return blocks;

    var thisFloor = this._compressFloorData(map, floor);
    var mapArr = this.compressMap(blocks, floorId);
    if (mapArr != null) thisFloor.map = mapArr;
    return thisFloor;
}

maps.prototype._compressFloorData = function (map, floor) {
    var thisFloor = {};
    for (var name in map) {
        if (name != 'blocks') {
            var floorData = floor[name];
            if (!core.utils.same(map[name], floorData)) {
                thisFloor[name] = core.clone(map[name]);
            }
        }
    }
    return thisFloor;
}

////// 将存档中的地图信息重新读取出来 //////
maps.prototype.loadMap = function (data, floorId) {
    if (!floorId) {
        var map = {};
        core.floorIds.forEach(function (id) {
            map[id] = core.maps.loadFloor(id, data[id]);
        })
        return map;
    }
    return this.loadFloor(floorId, data[floorId]);
}

////// 更改地图画布的尺寸
maps.prototype.resizeMap = function (floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;
    core.bigmap.width = core.floors[floorId].width;
    core.bigmap.height = core.floors[floorId].height;
    var cwidth = core.bigmap.width * 32;
    var cheight = core.bigmap.height * 32;
    core.bigmap.canvas.forEach(function (cn) {
        core.canvas[cn].canvas.setAttribute("width", cwidth);
        core.canvas[cn].canvas.setAttribute("height", cheight);
        core.canvas[cn].canvas.style.width = cwidth * core.domStyle.scale + "px";
        core.canvas[cn].canvas.style.height = cheight * core.domStyle.scale + "px";
        if (main.mode === 'editor' && editor.isMobile) {
            core.canvas[cn].canvas.style.width = core.bigmap.width * 32 / core.__PIXELS__ * 96 + "vw";
            core.canvas[cn].canvas.style.height = core.bigmap.height * 32 / core.__PIXELS__ * 96 + "vw";
        }
    });
}

////// 将当前地图重新变成二维数组形式 //////
maps.prototype.getMapArray = function (blockArray, width, height, checkDisable) {
    if (typeof blockArray == 'string') {
        var floorId = blockArray;
        blockArray = core.status.maps[floorId].blocks;
        width = core.floors[floorId].width;
        height = core.floors[floorId].height;
    }

    var blocks = [];
    var allzero = [];
    for (var y = 0; y < width; y++) allzero.push(0);
    for (var x = 0; x < height; x++) blocks.push(core.clone(allzero));

    blockArray.forEach(function (block) {
        var x = block.x, y = block.y;
        if (block.disable) {
            if (checkDisable) blocks[y][x] = block.id + ":f";
        }
        else {
            blocks[y][x] = block.id;
            if (checkDisable && block.disable === false)
                blocks[y][x] = block.id + ":t";
        }
    });
    return blocks;
}

////// 以x,y的形式返回每个点的事件 //////
maps.prototype.getMapBlocksObj = function (floorId, showDisable) {
    floorId = floorId || core.status.floorId;
    var obj = {};
    core.status.maps[floorId].blocks.forEach(function (block) {
        if (!block.disable || showDisable)
            obj[block.x + "," + block.y] = block;
    });
    return obj;
}

////// 将背景前景层变成二维数组的形式 //////
maps.prototype.getBgFgMapArray = function (name, floorId, useCache) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return [];
    var width = core.floors[floorId].width;
    var height = core.floors[floorId].height;

    if (useCache && core.status[name + "maps"][floorId])
        return core.status[name + "maps"][floorId];

    var arr = core.clone(core.floors[floorId][name + "map"] || []);
    if (main.mode == 'editor') arr = core.clone(editor[name + "map"]) || arr;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            arr[y] = arr[y] || [];
            var flag = "__" + name + "Map__" + floorId + "_" + x + "_" + y;
            var vFlag = "__" + name + "Value__" + floorId + "_" + x + "_" + y;
            if (core.hasFlag(flag)) arr[y][x] = 0;
            else arr[y][x] = core.getFlag(vFlag, arr[y][x] || 0);
            if (main.mode == 'editor') arr[y][x] = arr[y][x].idnum || arr[y][x] || 0;
        }
    }
    if (useCache)
        core.status[name + "maps"][floorId] = core.clone(arr);
    return arr;
}

// ------ 当前能否朝某方向移动，能否瞬间移动 ------ //

////// 生成全图的当前可移动信息 //////
maps.prototype.generateMovableArray = function (floorId, x, y, direction) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return null;
    var width = core.floors[floorId].width, height = core.floors[floorId].height;
    var bgArray = this.getBgFgMapArray('bg', floorId, true),
        fgArray = this.getBgFgMapArray('fg', floorId, true),
        eventArray = this.getMapArray(floorId);

    var generate = function (x, y, direction) {
        if (direction != null) {
            return core.maps._canMoveHero_checkPoint(x, y, direction, floorId, {
                bgArray: bgArray, fgArray: fgArray, eventArray: eventArray
            });
        }
        return ["left", "down", "up", "right"].filter(function (direction) {
            return core.maps._canMoveHero_checkPoint(x, y, direction, floorId, {
                bgArray: bgArray, fgArray: fgArray, eventArray: eventArray
            });
        });
    }

    if (x != null && y != null) return generate(x, y, direction);
    var array = [];
    for (var x = 0; x < width; x++) {
        array[x] = [];
        for (var y = 0; y < height; y++) {
            array[x][y] = generate(x, y);
        }
    }
    return array;
}

////// 勇士能否前往某方向 //////
maps.prototype.canMoveHero = function (x, y, direction, floorId) {
    if (x == null) x = core.getHeroLoc('x');
    if (y == null) y = core.getHeroLoc('y');
    direction = direction || core.getHeroLoc('direction');
    return this.generateMovableArray(floorId, x, y, direction);
}

maps.prototype._canMoveHero_checkPoint = function (x, y, direction, floorId, extraData) {
    // 1. 检查该点 cannotMove
    if (core.inArray((core.floors[floorId].cannotMove || {})[x + "," + y], direction))
        return false;

    var nx = x + core.utils.scan[direction].x, ny = y + core.utils.scan[direction].y;
    if (nx < 0 || ny < 0 || nx >= core.floors[floorId].width || ny >= core.floors[floorId].width)
        return false;

    // 2. 检查该点素材的 cannotOut 和下一个点的 cannotIn
    if (this._canMoveHero_checkCannotInOut([
            extraData.bgArray[y][x], extraData.fgArray[y][x], extraData.eventArray[y][x]
        ], "cannotOut", direction))
        return false;
    if (this._canMoveHero_checkCannotInOut([
            extraData.bgArray[ny][nx], extraData.fgArray[ny][nx], extraData.eventArray[ny][nx]
        ], "cannotIn", direction))
        return false;

    // 3. 检查是否能进将死的领域
    if (floorId == core.status.floorId
        && core.status.hero.hp <= (core.status.checkBlock.damage[nx + "," + ny]||0)
        && !core.flags.canGoDeadZone && extraData.eventArray[ny][nx] == 0)
        return false;

    return true;
}

maps.prototype._canMoveHero_checkCannotInOut = function (number, name, direction) {
    if (number instanceof Array) {
        for (var x in number) {
            if (this._canMoveHero_checkCannotInOut(number[x], name, direction))
                return true;
        }
        return false;
    }
    return core.inArray((this.initBlock(0, 0, number).event || {})[name], direction);
}

////// 能否瞬间移动 //////
maps.prototype.canMoveDirectly = function (destX, destY) {
    if (!this._canMoveDirectly_checkGlobal()) return -1;

    var fromX = core.getHeroLoc('x'), fromY = core.getHeroLoc('y');
    if (fromX == destX && fromY == destY) return 0;
    // 检查起点事件
    if (!this._canMoveDirectly_checkStartPoint(fromX, fromY)) return -1;

    return this._canMoveDirectly_bfs(fromX, fromY, destX, destY);
}

maps.prototype._canMoveDirectly_checkGlobal = function () {
    // 检查全塔是否禁止瞬间移动
    if (!core.flags.enableMoveDirectly) return false;
    // 检查该楼层是否不可瞬间移动
    if (core.status.thisMap.cannotMoveDirectly) return false;
    // flag:cannotMoveDirectly为true：不能
    if (core.hasFlag('cannotMoveDirectly')) return false;
    // 中毒状态：不能
    if (core.hasFlag('poison')) return false;

    return true;
}

maps.prototype._canMoveDirectly_checkStartPoint = function (sx, sy) {
    if (core.status.checkBlock.damage[sx + "," + sy]) return false;
    var block = core.getBlock(sx, sy);
    if (block != null) {
        // 只有起点是传送点才是能无视
        return block.block.event.trigger == 'changeFloor';
    }
    return true;
}

maps.prototype._canMoveDirectly_bfs = function (sx, sy, ex, ey) {
    var canMoveArray = this.generateMovableArray();
    var blocksObj = this.getMapBlocksObj(core.status.floorId);

    var visited = [], queue = [];
    visited[sx + "," + sy] = 0;
    queue.push(sx + "," + sy);

    while (queue.length > 0) {
        var now = queue.shift().split(","), x = parseInt(now[0]), y = parseInt(now[1]);
        for (var direction in core.utils.scan) {
            if (!core.inArray(canMoveArray[x][y], direction)) continue;
            var nx = x + core.utils.scan[direction].x, ny = y + core.utils.scan[direction].y, nindex = nx + "," + ny;
            if (visited[nindex]) continue;
            if (!this._canMoveDirectly_checkNextPoint(blocksObj, nx, ny)) continue;
            visited[nindex] = visited[now] + 1;
            if (nx == ex && ny == ey) return visited[nindex];
            queue.push(nindex);
        }
    }

    return -1;
}

maps.prototype._canMoveDirectly_checkNextPoint = function (blocksObj, x, y) {
    var index = x + "," + y;
    // 该点是否有事件
    if (blocksObj[index]) return false;
    // 是否存在阻激夹域伤害
    if (core.status.checkBlock.damage[x + "," + y]) return false;
    // 是否存在捕捉
    if (core.status.checkBlock.ambush[x + "," + y]) return false;

    return true;
}

////// 自动寻路找寻最优路径 //////
maps.prototype.automaticRoute = function (destX, destY) {
    var startX = core.getHeroLoc('x'), startY = core.getHeroLoc('y');
    if (destX == startX && destY == startY) return [];
    // BFS找寻最短路径
    var route = this._automaticRoute_bfs(startX, startY, destX, destY);
    if (route[destX+","+destY] == null) return [];
    // 路径数组转换
    var ans = [], nowX = destX, nowY = destY;
    while (nowX != startX || nowY != startY) {
        var dir = route[nowX + "," + nowY];
        ans.push({'direction': dir, 'x': nowX, 'y': nowY});
        nowX -= core.utils.scan[dir].x;
        nowY -= core.utils.scan[dir].y;
    }
    ans.reverse();
    return ans;
}

maps.prototype._automaticRoute_bfs = function (startX, startY, destX, destY) {
    var route = {}, canMoveArray = this.generateMovableArray();
    // 使用优先队列
    var queue = new PriorityQueue({comparator: function (a,b) { return a.depth - b.depth; }});
    route[startX + "," + startY] = '';
    queue.queue({depth: 0, x: startX, y: startY});
    while (queue.length!=0) {
        var curr = queue.dequeue(), deep = curr.depth, nowX = curr.x, nowY = curr.y;
        for (var direction in core.utils.scan) {
            if (!core.inArray(canMoveArray[nowX][nowY], direction)) continue;
            var nx = nowX + core.utils.scan[direction].x;
            var ny = nowY + core.utils.scan[direction].y;
            if (nx<0 || nx>=core.bigmap.width || ny<0 || ny>=core.bigmap.height || route[nx+","+ny] != null) continue;
            // 重点
            if (nx == destX && ny == destY) {
                route[nx+","+ny] = direction;
                break;
            }
            // 不可通行
            if (core.noPass(nx, ny)) continue;
            route[nx+","+ny] = direction;
            queue.queue({depth: deep + this._automaticRoute_deepAdd(nx, ny), x: nx, y: ny});
        }
        if (route[destX+","+destY] != null) break;
    }
    return route;
}

maps.prototype._automaticRoute_deepAdd = function (x, y) {
    // 判定每个可通行点的损耗值，越高越应该绕路
    var deepAdd = 1;
    var block = core.getBlock(x,y);
    if (block != null){
        var id = block.block.event.id;
        // 绕过亮灯
        if (id == "light") deepAdd += 100;
        // 绕过路障
        if (id.endsWith("Net")) deepAdd += 100;
        // 绕过血瓶
        if (!core.flags.potionWhileRouting && id.endsWith("Potion")) deepAdd += 100;
        // 绕过传送点
        // if (block.block.event.trigger == 'changeFloor') deepAdd+=10;
    }
    // 绕过存在伤害的地方
    deepAdd += (core.status.checkBlock.damage[x+","+y]||0) * 100;
    // 绕过捕捉
    if (core.status.checkBlock.ambush[x+","+y]) deepAdd += 1000;
    return deepAdd;
}

// -------- 绘制地图，各层图块，楼层贴图，Autotile -------- //

////// 绘制一个图块 //////
maps.prototype.drawBlock = function (block, animate) {
    if (block.event.id == 'none') return;
    var redraw = animate != null;
    if (!redraw) animate = 0;
    var x = block.x, y = block.y;
    // --- 在界面外的动画不绘制
    if (redraw && block.event.animate > 1 &&
        (32 * x < core.bigmap.offsetX - 64 || 32 * x > core.bigmap.offsetX + core.__PIXELS__ + 32
            || 32 * y < core.bigmap.offsetY - 64 || 32 * y > core.bigmap.offsetY + core.__PIXELS__ + 32 + 16)) {
        return;
    }

    var blockInfo = this.getBlockInfo(block);
    if (blockInfo == null) return;
    if (blockInfo.cls != 'tileset') blockInfo.posX = animate % block.event.animate;
    if (!block.name)
        this._drawBlockInfo(blockInfo, block.x, block.y);
    else
        this._drawBlockInfo_bgfg(blockInfo, block.name, block.x, block.y);
}

maps.prototype._drawBlockInfo = function (blockInfo, x, y) {
    var image = blockInfo.image, posX = blockInfo.posX, posY = blockInfo.posY, height = blockInfo.height;

    core.clearMap('event', x * 32, y * 32, 32, 32);
    core.drawImage('event', image, posX * 32, posY * height + height - 32, 32, 32, x * 32, y * 32, 32, 32);
    if (height > 32) {
        core.clearMap('event2', x * 32, y * 32 + 32 - height, 32, height - 32)
        core.drawImage('event2', image, posX * 32, posY * height, 32, height - 32, x * 32, y * 32 + 32 - height, 32, height - 32);
    }
}

maps.prototype._drawBlockInfo_bgfg = function (blockInfo, name, x, y) {
    var image = blockInfo.image, posX = blockInfo.posX, posY = blockInfo.posY, height = blockInfo.height;

    core.clearMap(name, x * 32, y * 32 + 32 - height, 32, height);
    if (name == 'bg') {
        if (height > 32) {
            core.clearMap('bg', x * 32, y * 32 - 32, 32, 32);
            core.drawImage('bg', core.material.groundCanvas.canvas, x * 32, y * 32 - 32);
        }
        core.drawImage('bg', core.material.groundCanvas.canvas, x * 32, y * 32);
    }
    core.drawImage(name, image, posX * 32, posY * height, 32, height, x * 32, y * 32 + 32 - height, 32, height);
}

////// 生成groundPattern //////
maps.prototype.generateGroundPattern = function (floorId) {
    // 生成floorId层的groundPattern（盒子内的怪物动画）
    var groundId = ((core.status.maps || core.floors)[floorId || core.status.floorId] || {}).defaultGround || "ground";
    core.material.groundCanvas.clearRect(0, 0, 32, 32);
    core.material.groundCanvas.drawImage(core.material.images.terrains, 0, 32 * core.material.icons.terrains[groundId], 32, 32, 0, 0, 32, 32);
    core.material.groundPattern = core.material.groundCanvas.createPattern(core.material.groundCanvas.canvas, 'repeat');
    // 如果需要用纯色可以直接将下面代码改成改成
    // core.material.groundPattern = '#000000';
}

////// 绘制某张地图 //////
maps.prototype.drawMap = function (floorId, callback) {
    floorId = floorId || core.status.floorId;
    if (!floorId) {
        if (callback) callback();
        return;
    }
    core.clearMap('all');
    this.generateGroundPattern(floorId);
    core.status.floorId = floorId;
    core.status.thisMap = core.status.maps[floorId];

    this._drawMap_drawAll();
    if (core.status.curtainColor) {
        core.fillRect('curtain', 0, 0, core.__PIXELS__, core.__PIXELS__,
            core.arrayToRGBA(core.status.curtainColor));
    }
    core.drawHero();
    core.updateStatusBar();
    if (callback) callback();
}

maps.prototype._drawMap_drawAll = function (floorId) {
    floorId = floorId || core.status.floorId;
    this.drawBg(floorId);
    this.drawEvents(floorId);
    this.drawFg(floorId);
}

maps.prototype._drawMap_drawBlockInfo = function (ctx, block, blockInfo, arr, onMap) {
    if (blockInfo == null) return;
    if (blockInfo.cls == 'autotile') { // Autotile单独处理
        this.drawAutotile(ctx, arr, block, 32, 0, 0);
        if (onMap) this.addGlobalAnimate(block);
        return;
    }
    if (!onMap) {
        var height = blockInfo.height;
        core.drawImage(ctx, blockInfo.image, 32 * blockInfo.posX, height * blockInfo.posY, 32, height, 32 * block.x, 32 * block.y + 32 - height, 32, height);
        return;
    }
    this.drawBlock(block);
    this.addGlobalAnimate(block);
}

////// 绘制背景层 //////
maps.prototype.drawBg = function (floorId, ctx) {
    var onMap = ctx == null;
    if (onMap) {
        ctx = core.canvas.bg;
        core.clearMap(ctx);
    }
    this._drawBg_drawBackground(floorId, ctx);
    // ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制背景图块；后绘制的覆盖先绘制的。
    this._drawFloorImages(floorId, ctx, 'bg');
    this._drawBgFgMap(floorId, ctx, 'bg', onMap);
}

maps.prototype._drawBg_drawBackground = function (floorId, ctx) {
    var width = core.floors[floorId].width, height = core.floors[floorId].height;
    var groundId = (core.status.maps || core.floors)[floorId].defaultGround || "ground";
    var yOffset = core.material.icons.terrains[groundId];
    if (yOffset != null) {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                ctx.drawImage(core.material.images.terrains, 0, yOffset * 32, 32, 32, i * 32, j * 32, 32, 32);
            }
        }
    }
}

////// 绘制事件层 //////
maps.prototype.drawEvents = function (floorId, blocks, ctx) {
    floorId = floorId || core.status.floorId;
    if (!blocks) blocks = core.status.maps[floorId].blocks;
    var arr = this.getMapArray(blocks, core.floors[floorId].width, core.floors[floorId].height);
    var onMap = ctx == null;
    if (onMap) ctx = core.canvas.event;
    blocks.filter(function (block) {
        return block.event && !block.disable;
    }).forEach(function (block) {
        core.maps._drawMap_drawBlockInfo(ctx, block, core.maps.getBlockInfo(block), arr, onMap);
    });
    if (onMap) core.status.autotileAnimateObjs.map = core.clone(arr);
}

////// 绘制前景层 //////
maps.prototype.drawFg = function (floorId, ctx) {
    var onMap = ctx == null;
    if (onMap) ctx = core.canvas.fg;
    // ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制背景图块；后绘制的覆盖先绘制的。
    this._drawFloorImages(floorId, ctx, 'fg');
    this._drawBgFgMap(floorId, ctx, 'fg', onMap);
}

////// 实际的背景/前景图块的绘制 //////
maps.prototype._drawBgFgMap = function (floorId, ctx, name, onMap) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;
    var width = core.floors[floorId].width;
    var height = core.floors[floorId].height;

    if (!core.status[name + "maps"])
        core.status[name + "maps"] = {};

    var arr = this.getBgFgMapArray(name, floorId);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var block = this.initBlock(x, y, arr[y][x], true);
            block.name = name;
            var blockInfo = this.getBlockInfo(block);
            if (!blockInfo) continue;
            this._drawMap_drawBlockInfo(ctx, block, blockInfo, arr, onMap);
        }
    }
    if (onMap)
        core.status.autotileAnimateObjs[name + "map"] = core.clone(arr);
}

////// 绘制楼层贴图 //////
maps.prototype._drawFloorImages = function (floorId, ctx, name, images, currStatus) {
    floorId = floorId || core.status.floorId;
    if (!images) images = this._getFloorImages(floorId);
    var redraw = currStatus != null;
    if (!redraw) core.status.floorAnimateObjs = core.clone(images);
    images.forEach(function (t) {
        if (typeof t == 'string') t = [0, 0, t];
        var dx = parseInt(t[0]), dy = parseInt(t[1]), imageName = t[2], frame = core.clamp(parseInt(t[4]), 1, 8);
        var image = core.material.images.images[imageName];
        if (redraw && frame == 1) return; // 不重绘

        if (core.isset(dx) && core.isset(dy) && image &&
            !core.hasFlag("__floorImg__" + floorId + "_" + dx + "_" + dy)) {
            var width = parseInt(image.width / frame), offsetX = (currStatus || 0) % frame * width;
            if (/.*\.gif/i.test(imageName) && main.mode == 'play') {
                if (redraw) return; // 忽略gif
                this._drawFloorImages_gif(image, dx, dy);
                return;
            }
            core.maps._drawFloorImage(ctx, name, t[3], image, offsetX, width, dx, dy, redraw);
        }
    });
}

maps.prototype._getFloorImages = function (floorId) {
    floorId = floorId || core.status.floorId;
    var images = [];
    if ((core.status.maps || core.floors)[floorId].images) {
        images = (core.status.maps || core.floors)[floorId].images;
        if (typeof images == 'string') {
            images = [[0, 0, images]];
        }
    }
    return images;
}

maps.prototype._drawFloorImages_gif = function (image, dx, dy) {
    core.dom.gif.innerHTML = "";
    var gif = new Image();
    gif.src = image.src;
    gif.style.position = 'absolute';
    gif.style.left = (dx * core.domStyle.scale) + "px";
    gif.style.top = (dy * core.domStyle.scale) + "px";
    gif.style.width = image.width * core.domStyle.scale + "px";
    gif.style.height = image.height * core.domStyle.scale + "px";
    core.dom.gif.appendChild(gif);
    return;
}

maps.prototype._drawFloorImage = function (ctx, name, type, image, offsetX, width, dx, dy, redraw) {
    var height = image.height;
    var _draw = function () {
        if (redraw) core.clearMap(ctx, dx, dy, width, height);
        core.drawImage(ctx, image, offsetX, 0, width, height, dx, dy, width, height);
    }
    if (!type) {
        if (name != 'bg') return;
        return _draw();
    }
    if (type == 1) {
        if (name != 'fg') return;
        return _draw();
    }
    if (type == 2) {
        if (name == 'bg') {
            if (redraw) core.clearMap(ctx, dx, dy + height - 32, width, 32);
            core.drawImage('bg', image, offsetX, height - 32, width, 32, dx, dy + height - 32, width, 32);
        }
        else if (name == 'fg') {
            if (redraw) core.clearMap(ctx, dx, dy, width, height - 32);
            core.drawImage('fg', image, offsetX, 0, width, height - 32, dx, dy, width, height - 32);
        }
        return;
    }
}

////// 绘制Autotile //////
maps.prototype.drawAutotile = function (ctx, mapArr, block, size, left, top, status) {
    var indexArrs = [ //16种组合的图块索引数组; // 将autotile分割成48块16*16的小块; 数组索引即对应各个小块
        //                                     +----+----+----+----+----+----+
        [10, 9, 4, 3],  //0   bin:0000      | 1  | 2  | 3  | 4  | 5  | 6  |
        [10, 9, 4, 13],  //1   bin:0001      +----+----+----+----+----+----+
        [10, 9, 18, 3],  //2   bin:0010      | 7  | 8  | 9  | 10 | 11 | 12 |
        [10, 9, 16, 15],  //3   bin:0011      +----+----+----+----+----+----+
        [10, 43, 4, 3],  //4   bin:0100      | 13 | 14 | 15 | 16 | 17 | 18 |
        [10, 31, 4, 25],  //5   bin:0101      +----+----+----+----+----+----+
        [10, 7, 2, 3],  //6   bin:0110      | 19 | 20 | 21 | 22 | 23 | 24 |
        [10, 31, 16, 5],  //7   bin:0111      +----+----+----+----+----+----+
        [48, 9, 4, 3],  //8   bin:1000      | 25 | 26 | 27 | 28 | 29 | 30 |
        [8, 9, 4, 1],  //9   bin:1001      +----+----+----+----+----+----+
        [36, 9, 30, 3],  //10  bin:1010      | 31 | 32 | 33 | 34 | 35 | 36 |
        [36, 9, 6, 15],  //11  bin:1011      +----+----+----+----+----+----+
        [46, 45, 4, 3],  //12  bin:1100      | 37 | 38 | 39 | 40 | 41 | 42 |
        [46, 11, 4, 25],  //13  bin:1101      +----+----+----+----+----+----+
        [12, 45, 30, 3],  //14  bin:1110      | 43 | 44 | 45 | 46 | 47 | 48 |
        [34, 33, 28, 27]   //15  bin:1111      +----+----+----+----+----+----+
    ];

    // 开始绘制autotile
    var x = block.x, y = block.y;
    var pieceIndexs = this._drawAutotile_getAutotileIndexs(x, y, mapArr, indexArrs);

    //修正四个边角的固定搭配
    if (pieceIndexs[0] == 13) {
        if (pieceIndexs[1] == 16) pieceIndexs[1] = 14;
        if (pieceIndexs[2] == 31) pieceIndexs[2] = 19;
    }
    if (pieceIndexs[1] == 18) {
        if (pieceIndexs[0] == 15) pieceIndexs[0] = 17;
        if (pieceIndexs[3] == 36) pieceIndexs[3] = 24;
    }
    if (pieceIndexs[2] == 43) {
        if (pieceIndexs[0] == 25) pieceIndexs[0] = 37;
        if (pieceIndexs[3] == 46) pieceIndexs[3] = 44;
    }
    if (pieceIndexs[3] == 48) {
        if (pieceIndexs[1] == 30) pieceIndexs[1] = 42;
        if (pieceIndexs[2] == 45) pieceIndexs[2] = 47;
    }
    for (var i = 0; i < 4; i++) {
        var index = pieceIndexs[i];
        var dx = x * size + size / 2 * (i % 2), dy = y * size + size / 2 * (~~(i / 2));
        this._drawAutotile_drawBlockByIndex(ctx, dx + left, dy + top, core.material.images['autotile'][block.event.id], index, size, status);
    }
}

maps.prototype._drawAutotile_drawBlockByIndex = function (ctx, dx, dy, autotileImg, index, size, status) {
    //index为autotile的图块索引1-48
    var sx = 16 * ((index - 1) % 6), sy = 16 * (~~((index - 1) / 6));
    status = status || 0;
    status %= parseInt(autotileImg.width / 96);
    ctx.drawImage(autotileImg, sx + 96 * status, sy, 16, 16, dx, dy, size / 2, size / 2);
}

maps.prototype._drawAutotile_getAutotileAroundId = function (currId, x, y, mapArr) {
    if (x < 0 || y < 0 || x >= mapArr[0].length || y >= mapArr.length) return 1;
    else return core.material.autotileEdges[currId].indexOf(mapArr[y][x]) >= 0;
}

maps.prototype._drawAutotile_checkAround = function (x, y, mapArr) {
    // 得到周围四个32*32块（周围每块都包含当前块的1/4，不清楚的话画下图你就明白）的数组索引
    var currId = mapArr[y][x];
    var pointBlock = [];
    for (var i = 0; i < 4; i++) {
        var bsum = 0;
        var offsetx = i % 2, offsety = ~~(i / 2);
        for (var j = 0; j < 4; j++) {
            var mx = j % 2, my = ~~(j / 2);
            var b = this._drawAutotile_getAutotileAroundId(currId, x + offsetx + mx - 1, y + offsety + my - 1, mapArr);
            bsum += b * (Math.pow(2, 3 - j));
        }
        pointBlock.push(bsum);
    }
    return pointBlock;
}

maps.prototype._drawAutotile_getAutotileIndexs = function (x, y, mapArr, indexArrs) {
    var indexArr = [];
    var pointBlocks = this._drawAutotile_checkAround(x, y, mapArr);
    for (var i = 0; i < 4; i++) {
        var arr = indexArrs[pointBlocks[i]]
        indexArr.push(arr[3 - i]);
    }
    return indexArr;
}

maps.prototype._drawAutotileAnimate = function (block, animate) {
    var x = block.x, y = block.y;
    // ------ 界面外的动画不绘制
    if (32 * x < core.bigmap.offsetX - 64 || 32 * x > core.bigmap.offsetX + core.__PIXELS__ + 32
        || 32 * y < core.bigmap.offsetY - 64 || 32 * y > core.bigmap.offsetY + core.__PIXELS__ + 32 + 16) {
        return;
    }

    var cv = block.name?core.canvas[block.name]:core.canvas.event;
    cv.clearRect(32 * x, 32 * y, 32, 32);
    if (block.name) {
        if (block.name == 'bg')
            core.drawImage('bg', core.material.groundCanvas.canvas, 32 * x, 32 * y);
        this.drawAutotile(cv, core.status.autotileAnimateObjs[block.name+"map"], block, 32, 0, 0, animate);
    }
    else {
        this.drawAutotile(cv, core.status.autotileAnimateObjs.map, block, 32, 0, 0, animate);
    }
}

////// 为autotile判定边界 ////// 
maps.prototype._makeAutotileEdges = function () {
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

        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(core.material.images.autotile[t], 0, 0, 32, 32, 0, 0, 32, 32);
        var data = canvas.toDataURL("image/png");

        autotileIds.forEach(function (t2) {
            if (t == t2) return;
            var n2 = core.maps.getNumberById(t2);

            ctx.clearRect(0, 0, 32, 32);
            ctx.drawImage(core.material.images.autotile[t2], 32, 0, 32, 32, 0, 0, 32, 32);
            if (data == canvas.toDataURL("image/png")) {
                core.material.autotileEdges[n].push(n2);
            }
        });
    });
}

////// 绘制缩略图 //////
// 此函数将绘制一个缩略图，floorId为目标floorId，blocks为地图的图块（可为null使用floorId对应默认的）
// options为绘制选项（可为null），包括：
//    heroLoc: 勇士位置；heroIcon：勇士图标（默认当前勇士）；damage：是否绘制显伤；flags：当前的flags（存读档时使用）
// toDraw为要绘制到的信息（可为null，或为一个画布名），包括：
//    ctx：要绘制到的画布（名）；x,y：起点横纵坐标（默认0）；size：大小（默认416/480）；
//    all：是否绘制全图（默认false）；centerX,centerY：截取中心（默认为地图正中心）
maps.prototype.drawThumbnail = function (floorId, blocks, options, toDraw) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;
    // Step1：绘制到tempCanvas上
    this._drawThumbnail_drawTempCanvas(floorId, blocks, options);
    // Step2：从tempCanvas绘制到对应的画布上
    this._drawThumbnail_drawToTarget(floorId, toDraw);
}

maps.prototype._drawThumbnail_drawTempCanvas = function (floorId, blocks, options) {
    blocks = blocks || core.status.maps[floorId].blocks;
    options = options || {}

    var width = core.floors[floorId].width;
    var height = core.floors[floorId].height;
    // 绘制到tempCanvas上面
    var tempCanvas = core.bigmap.tempCanvas;
    var tempWidth = width * 32, tempHeight = height * 32;
    tempCanvas.canvas.width = tempWidth;
    tempCanvas.canvas.height = tempHeight;
    tempCanvas.clearRect(0, 0, tempWidth, tempHeight);

    // --- 暂存 flags
    var hasHero = core.status.hero != null, flags = null;
    if (options.flags) {
        if (!hasHero) core.status.hero = {};
        flags = core.status.hero.flags;
        core.status.hero.flags = options.flags;
    }

    this._drawThumbnail_realDrawTempCanvas(floorId, blocks, options, tempCanvas);

    // --- 恢复 flags
    if (!hasHero) delete core.status.hero;
    else if (flags != null) core.status.hero.flags = flags;
}

maps.prototype._drawThumbnail_realDrawTempCanvas = function (floorId, blocks, options, tempCanvas) {
    // 缩略图：背景
    this.drawBg(floorId, tempCanvas);
    // 缩略图：事件
    this.drawEvents(floorId, blocks, tempCanvas);
    // 缩略图：勇士
    if (options.heroLoc) {
        options.heroIcon = options.heroIcon || core.getFlag("heroIcon", "hero.png");
        var icon = core.material.icons.hero[options.heroLoc.direction];
        var height = core.material.images.images[options.heroIcon].height / 4;
        tempCanvas.drawImage(core.material.images.images[options.heroIcon], icon.stop * 32, icon.loc * height, 32, height,
            32 * options.heroLoc.x, 32 * options.heroLoc.y + 32 - height, 32, height);
    }
    // 缩略图：前景
    this.drawFg(floorId, tempCanvas);
    // 缩略图：显伤
    if (options.damage)
        core.control.updateDamage(floorId, tempCanvas);
}

maps.prototype._drawThumbnail_drawToTarget = function (floorId, toDraw) {
    if (toDraw == null) return;
    if (typeof toDraw == 'string' || toDraw.canvas) toDraw = {ctx: toDraw};
    var ctx = core.getContextByName(toDraw.ctx);
    if (ctx == null) return;
    var x = toDraw.x || 0, y = toDraw.y || 0, size = toDraw.size || core.__PIXELS__;
    var width = core.floors[floorId].width, height = core.floors[floorId].height;
    var centerX = toDraw.centerX, centerY = toDraw.centerY;
    if (centerX == null) centerX = Math.floor(width / 2);
    if (centerY == null) centerY = Math.floor(height / 2);
    var tempCanvas = core.bigmap.tempCanvas, tempWidth = 32 * width, tempHeight = 32 * height;

    core.clearMap(ctx, x, y, size, size);
    if (toDraw.all) {
        // 绘制全景图
        if (tempWidth <= tempHeight) {
            var realHeight = size, realWidth = realHeight * tempWidth / tempHeight;
            var side = (size - realWidth) / 2;
            core.fillRect(ctx, x, y, side, realHeight, '#000000');
            core.fillRect(ctx, x + size - side, y, side, realHeight);
            ctx.drawImage(tempCanvas.canvas, 0, 0, tempWidth, tempHeight, x + side, y, realWidth, realHeight);
        }
        else {
            var realWidth = size, realHeight = realWidth * tempHeight / tempWidth;
            var side = (size - realHeight) / 2;
            core.fillRect(ctx, x, y, realWidth, side, '#000000');
            core.fillRect(ctx, x, y + size - side, realWidth, side);
            ctx.drawImage(tempCanvas.canvas, 0, 0, tempWidth, tempHeight, x, y + side, realWidth, realHeight);
        }
    }
    else {
        // 只绘制可见窗口
        var offsetX = core.clamp(centerX - core.__HALF_SIZE__, 0, width - core.__SIZE__),
            offsetY = core.clamp(centerY - core.__HALF_SIZE__, 0, height - core.__SIZE__);
        ctx.drawImage(tempCanvas.canvas, offsetX * 32, offsetY * 32, core.__PIXELS__, core.__PIXELS__, x, y, size, size);
    }
}

// -------- 获得某个点的图块信息 -------- //

////// 某个点是否不可通行 //////
maps.prototype.noPass = function (x, y, floorId) {
    var block = core.getBlock(x, y, floorId);
    if (block == null) return false;
    return block.block.event.noPass;
}

////// 某个点是否存在NPC //////
maps.prototype.npcExists = function (x, y, floorId) {
    var block = this.getBlock(x, y, floorId);
    if (block == null) return false;
    return block.block.event.cls.indexOf('npc') == 0;
}

////// 某个点是否存在（指定的）地形 //////
maps.prototype.terrainExists = function (x, y, id, floorId) {
    var block = this.getBlock(x, y, floorId);
    if (block == null) return false;
    return block.block.event.cls == 'terrains' && (id ? block.block.event.id == id : true);
}

////// 某个点是否存在楼梯 //////
maps.prototype.stairExists = function (x, y, floorId) {
    var block = this.getBlock(x, y, floorId);
    if (block == null) return false;
    return block.block.event.cls == 'terrains' && (block.block.event.id == 'upFloor' || block.block.event.id == 'downFloor');
}

////// 当前位置是否在楼梯边 //////
maps.prototype.nearStair = function () {
    var x = core.getHeroLoc('x'), y = core.getHeroLoc('y');
    return this.stairExists(x, y) || this.stairExists(x - 1, y) || this.stairExists(x, y - 1) || this.stairExists(x + 1, y) || this.stairExists(x, y + 1);
}

////// 某个点是否存在（指定的）怪物 //////
maps.prototype.enemyExists = function (x, y, id, floorId) {
    var block = this.getBlock(x, y, floorId);
    if (block == null) return false;
    return block.block.event.cls.indexOf('enemy') == 0 && (id ? block.block.event.id == id : true);
}

////// 获得某个点的block //////
maps.prototype.getBlock = function (x, y, floorId, showDisable) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return null;
    var blocks = core.status.maps[floorId].blocks;
    for (var n = 0; n < blocks.length; n++) {
        if (blocks[n].x == x && blocks[n].y == y) {
            if (!showDisable && blocks[n].disable) return null;
            return {"index": n, "block": blocks[n]};
        }
    }
    return null;
}

////// 获得某个点的blockId //////
maps.prototype.getBlockId = function (x, y, floorId, showDisable) {
    var block = core.getBlock(x, y, floorId, showDisable);
    return block == null ? null : block.block.event.id;
}

////// 获得某个点的blockCls //////
maps.prototype.getBlockCls = function (x, y, floorId, showDisable) {
    var block = core.getBlock(x, y, floorId, showDisable);
    return block == null ? null : block.block.event.cls;
}

////// 获得某个图块或素材的信息，包括 ID，cls，图片，坐标，faceIds 等等 //////
maps.prototype.getBlockInfo = function (block) {
    if (!block) return null;
    if (typeof block == 'string') { // 参数是ID
        block = this.getNumberById(block);
    }
    if (typeof block == 'number') { // 参数是数字
        if (block == 0) return null;
        block = this.initBlock(0, 0, block, true);
    }
    var number = block.id, id = block.event.id, cls = block.event.cls,
        image = null, posX = 0, posY = 0,
        height = block.event.height || 32, faceIds = {};

    if (id == 'none') return null;
    else if (id == 'airwall') {
        if (!core.material.images.airwall) return null;
        image = core.material.images.airwall;
    }
    else if (cls == 'tileset') {
        var offset = core.icons.getTilesetOffset(id);
        if (offset == null) return null;
        posX = offset.x;
        posY = offset.y;
        image = core.material.images.tilesets[offset.image];
    }
    else if (cls == 'autotile') {
        image = core.material.images.autotile[id];
    }
    else {
        image = core.material.images[cls];
        posY = core.material.icons[cls][id];
        faceIds = block.event.faceIds || {};
    }

    return {number: number, id: id, cls: cls, image: image, posX: posX, posY: posY, height: height, faceIds: faceIds};
}

////// 搜索某个图块出现的所有位置 //////
maps.prototype.searchBlock = function (id, floorId, showDisable) {
    if (typeof id == 'number') id = this.initBlock(0, 0, id).event.id;
    floorId = floorId || core.status.floorId;
    var result = [];
    if (floorId instanceof Array) {
        floorId.forEach(function (floorId) {
            result = result.concat(core.searchBlock(id, floorId, showDisable));
        });
        return result;
    }
    for (var i = 0; i < core.status.maps[floorId].blocks.length; ++i) {
        var block = core.status.maps[floorId].blocks[i];
        if (block.event.id == id && (showDisable || !block.disable))
            result.push({floorId: floorId, index: i, block: block});
    }
    return result;
}

// -------- 启用/禁用图块，楼层贴图 -------- //

////// 将某个块从禁用变成启用状态 //////
maps.prototype.showBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;
    var block = core.getBlock(x, y, floorId, true);
    if (block == null) return; // 不存在
    block = block.block;
    // 本身是禁用事件，启用之
    if (block.disable) {
        block.disable = false;
        // 在本层，添加动画
        if (floorId == core.status.floorId) {
            core.drawBlock(block);
            core.addGlobalAnimate(block);
        }
        core.updateStatusBar();
    }
}

////// 只隐藏但不删除某块 //////
maps.prototype.hideBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;

    var block = core.getBlock(x, y, floorId, true);
    if (block == null) return; // 不存在

    // 删除动画，清除地图
    if (floorId == core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.clearMap('event', x * 32, y * 32, 32, 32);
        var height = block.block.event.height || 32;
        if (height > 32)
            core.clearMap('event2', x * 32, y * 32 + 32 - height, 32, height - 32);
    }

    block.block.disable = true;
    core.updateStatusBar();
}

////// 将某个块从启用变成禁用状态 //////
maps.prototype.removeBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;

    var block = core.getBlock(x, y, floorId, true);
    if (block == null) return; // 不存在

    var index = block.index;

    // 删除动画，清除地图
    if (floorId == core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.clearMap('event', x * 32, y * 32, 32, 32);
        var height = block.block.event.height || 32;
        if (height > 32)
            core.clearMap('event2', x * 32, y * 32 + 32 - height, 32, height - 32);
    }

    // 删除Index
    core.removeBlockById(index, floorId);
    core.updateStatusBar();
}

////// 根据block的索引（尽可能）删除该块 //////
maps.prototype.removeBlockById = function (index, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;

    var blocks = core.status.maps[floorId].blocks, block = blocks[index];

    if (this.canRemoveBlock(block, floorId)) { // 能否彻底删除该图块
        blocks.splice(index, 1);
    }
    else {
        block.disable = true;
    }
}

////// 能否彻底从地图中删除一个图块 //////
maps.prototype.canRemoveBlock = function (block, floorId) {
    var x = block.x, y = block.y;
    // 检查该点是否存在事件
    if (core.floors[floorId].events[x + "," + y] || core.floors[floorId].changeFloor[x + "," + y])
        return false;
    // 检查是否存在重生
    if (block.event && block.event.cls.indexOf('enemy') == 0 && core.hasSpecial(block.event.id, 23))
        return false;

    return true;
}

////// 一次性删除多个block //////
maps.prototype.removeBlockByIds = function (floorId, ids) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;
    ids.sort(function (a, b) {
        return b - a
    }).forEach(function (id) {
        core.removeBlockById(id, floorId);
    });
}

////// 将地图中所有某个图块替换成另一个图块 //////
maps.prototype.replaceBlock = function (fromNumber, toNumber, floorId) {
    floorId = floorId || core.status.floorId;
    if (floorId instanceof Array) {
        floorId.forEach(function (floorId) {
            core.replaceBlock(fromNumber, toNumber, floorId);
        });
        return;
    }
    var toBlock = this.initBlock(0, 0, toNumber, true);
    core.status.maps[floorId].blocks.forEach(function (block) {
        if (block.id == fromNumber) {
            block.id = toNumber;
            for (var one in toBlock.event) {
                block.event[one] = core.clone(toBlock.event[one]);
            }
        }
    });
}

////// 显示前景/背景地图 //////
maps.prototype.showBgFgMap = function (name, loc, floorId, callback) {
    this._triggerBgFgMap('show', name, loc, floorId, callback);
}

////// 隐藏前景/背景地图 //////
maps.prototype.hideBgFgMap = function (name, loc, floorId, callback) {
    this._triggerBgFgMap('hide', name, loc, floorId, callback);
}

////// 设置前景/背景地图的显示状态 //////
maps.prototype._triggerBgFgMap = function (type, name, loc, floorId, callback) {
    if (type != 'show') type = 'hide';
    if (name != 'fg') name = 'bg';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    floorId = floorId || core.status.floorId;
    if (!floorId) return;

    if (loc.length == 0) return;
    loc.forEach(function (t) {
        var x = t[0], y = t[1];
        var flag = "__" + name + "Map__" + floorId + "_" + x + "_" + y;
        if (type == 'hide') core.setFlag(flag, true);
        else core.removeFlag(flag);
    })
    core.status[name + "maps"][floorId] = null;

    if (floorId == core.status.floorId) {
        core.drawMap(floorId, callback);
    }
    else {
        if (callback) callback();
    }
}

////// 显示一个楼层贴图 //////
maps.prototype.showFloorImage = function (loc, floorId, callback) {
    this._triggerFloorImage('show', loc, floorId, callback);
}

////// 隐藏一个楼层贴图 //////
maps.prototype.hideFloorImage = function (loc, floorId, callback) {
    this._triggerFloorImage('hide', loc, floorId, callback);
}

///// 设置贴图显示状态 //////
maps.prototype._triggerFloorImage = function (type, loc, floorId, callback) {
    if (type != 'show') type = 'hide';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    floorId = floorId || core.status.floorId;
    if (!floorId) return;

    if (loc.length == 0) return;
    loc.forEach(function (t) {
        var x = t[0], y = t[1];
        var flag = "__floorImg__" + floorId + "_" + x + "_" + y;
        if (type == 'hide') core.setFlag(flag, true);
        else core.removeFlag(flag);
    })

    if (floorId == core.status.floorId) {
        core.drawMap(floorId, callback);
    }
    else {
        if (callback) callback();
    }
}

////// 改变图块 //////
maps.prototype.setBlock = function (number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId || number == null || x == null || y == null) return;
    if (x < 0 || x >= core.floors[floorId].width || y < 0 || y >= core.floors[floorId].height) return;

    var originBlock = core.getBlock(x, y, floorId, true);
    var block = this.initBlock(x, y, number, true, core.floors[floorId]);
    if (floorId == core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.clearMap('event', x * 32, y * 32, 32, 32);
        if (originBlock != null) {
            var height = (originBlock.block.event || {}).height || 32;
            if (height > 32)
                core.clearMap('event2', x * 32, y * 32 + 32 - height, 32, height - 32);
        }
    }
    if (originBlock == null) {
        core.status.maps[floorId].blocks.push(block);
    }
    else {
        originBlock.block.id = number;
        originBlock.block.event = block.event;
        block = originBlock.block;
    }
    if (floorId == core.status.floorId && !block.disable) {
        core.drawBlock(block);
        core.addGlobalAnimate(block);
        core.updateStatusBar();
    }
}

////// 改变前景背景的图块 //////
maps.prototype.setBgFgBlock = function (name, number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId || number == null || x == null || y == null) return;
    if (x < 0 || x >= core.floors[floorId].width || y < 0 || y >= core.floors[floorId].height) return;
    if (name != 'bg' && name != 'fg') return;

    var vFlag = "__" + name + "Value__" + floorId + "_" + x + "_" + y;
    core.setFlag(vFlag, number);
    core.status[name + "maps"][floorId] = null;

    if (floorId == core.status.floorId)
        core.drawMap(floorId);
}

////// 重置地图 //////
maps.prototype.resetMap = function (floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return;
    if (typeof floorId == 'string') floorId = [floorId];
    var needRefresh = false;
    floorId.forEach(function (t) {
        core.status.maps[t] = core.maps.loadFloor(t);
        if (t == core.status.floorId) needRefresh = true;
    });
    if (needRefresh) this.drawMap();
    core.drawTip("地图重置成功");
}

// -------- 移动/跳跃图块，图块的淡入淡出 -------- //

////// 初始化独立的block canvas //////
maps.prototype._initDetachedBlock = function (blockInfo, x, y, displayDamage) {
    var headCanvas = null, bodyCanvas = '__body_' + x + "_" + y, damageCanvas = null;
    // head
    if (blockInfo.height > 32) {
        headCanvas = "__head_" + x + "_" + y;
        core.createCanvas(headCanvas, 0, 0, 32, blockInfo.height - 32, 55);
    }
    // body
    core.createCanvas(bodyCanvas, 0, 0, 32, 32, 35);
    // damage
    var damage = null, damageColor = null;
    if (blockInfo.cls.indexOf('enemy') == 0 && core.hasItem('book') && displayDamage) {
        var damageString = core.enemys.getDamageString(blockInfo.id, x, y);
        damage = damageString.damage;
        damageColor = damageString.color;
    }
    if (damage != null) {
        damageCanvas = "__damage_" + x + "_" + y;
        var ctx = core.createCanvas(damageCanvas, 0, 0, 32, 32, 65);
        ctx.textAlign = 'left';
        ctx.font = "bold 11px Arial";
        core.fillBoldText(ctx, damage, 1, 31, damageColor);
        if (core.flags.displayCritical) {
            var critical = core.enemys.nextCriticals(blockInfo.id);
            if (critical.length > 0) critical = critical[0];
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

////// 移动独立的block canvas //////
maps.prototype._moveDetachedBlock = function (blockInfo, nowX, nowY, opacity, canvases) {
    var height = blockInfo.height, posX = blockInfo.posX, posY = blockInfo.posY, image = blockInfo.image;
    var headCanvas = canvases.headCanvas, bodyCanvas = canvases.bodyCanvas, damageCanvas = canvases.damageCanvas;
    if (headCanvas) {
        core.dymCanvas[headCanvas].clearRect(0, 0, 32, height);
        core.dymCanvas[headCanvas].drawImage(image, posX * 32, posY * height, 32, height - 32, 0, 0, 32, height - 32);
        core.relocateCanvas(headCanvas, nowX - core.bigmap.offsetX, nowY + 32 - height - core.bigmap.offsetY);
        core.setOpacity(headCanvas, opacity);
    }
    if (bodyCanvas) {
        core.dymCanvas[bodyCanvas].clearRect(0, 0, 32, 32);
        core.dymCanvas[bodyCanvas].drawImage(image, posX * 32, posY * height + height - 32, 32, 32, 0, 0, 32, 32);
        core.relocateCanvas(bodyCanvas, nowX - core.bigmap.offsetX, nowY - core.bigmap.offsetY);
        core.setOpacity(bodyCanvas, opacity);
    }
    if (damageCanvas) {
        core.relocateCanvas(damageCanvas, nowX - core.bigmap.offsetX, nowY - core.bigmap.offsetY);
        core.setOpacity(damageCanvas, opacity);
    }
}

////// 删除独立的block canvas //////
maps.prototype._deleteDetachedBlock = function (canvases) {
    core.deleteCanvas(canvases.headCanvas);
    core.deleteCanvas(canvases.bodyCanvas);
    core.deleteCanvas(canvases.damageCanvas);
}

maps.prototype._getAndRemoveBlock = function (x, y) {
    var block = core.getBlock(x, y);
    if (block == null) return null;
    block = block.block;
    var blockInfo = this.getBlockInfo(block);
    if (blockInfo == null) return;
    core.removeBlock(x, y);
    return [block, blockInfo];
}

////// 显示移动某块的动画，达到{“type”:”move”}的效果 //////
maps.prototype.moveBlock = function (x, y, steps, time, keep, callback) {
    time = time || 500;
    var blockArr = this._getAndRemoveBlock(x, y);
    if (blockArr == null) {
        if (callback) callback();
        return;
    }
    var block = blockArr[0], blockInfo = blockArr[1];
    var moveSteps = (steps||[]).filter(function (t) {
        return ['up','down','left','right'].indexOf(t)>=0;
    });
    var canvases = this._initDetachedBlock(blockInfo, x, y, block.event.animate !== false);
    this._moveDetachedBlock(blockInfo, 32 * x, 32 * y, 1, canvases);

    var moveInfo = {
        x: x, y: y, px: 32 * x, py: 32 * y, opacity: 1, keep: keep,
        moveSteps: moveSteps, step: 0, per_time: time / 16 / core.status.replay.speed
    }
    this._moveBlock_doMove(blockInfo, canvases, moveInfo, callback);
}

maps.prototype._moveBlock_doMove = function (blockInfo, canvases, moveInfo, callback) {
    var animateTotal = core.icons._getAnimateFrames(blockInfo.cls, true), animateTime = 0;
    var animate = window.setInterval(function () {
        if (blockInfo.cls != 'tileset') {
            animateTime += moveInfo.per_time;
            if (animateTime > core.values.animateSpeed) {
                animateTime = 0;
                blockInfo.posX = (blockInfo.posX + 1) % animateTotal;
            }
        }
        if (moveInfo.moveSteps.length != 0)
            core.maps._moveBlock_moving(blockInfo, canvases, moveInfo);
        else
            core.maps._moveJumpBlock_finished(blockInfo, canvases, moveInfo, animate, callback);
    }, moveInfo.per_time);

    core.animateFrame.asyncId[animate] = true;
}

maps.prototype._moveBlock_moving = function (blockInfo, canvases, moveInfo) {
    var direction = moveInfo.moveSteps[0];
    if (moveInfo.step == 0) {
        moveInfo.x += core.utils.scan[direction].x;
        moveInfo.y += core.utils.scan[direction].y;
        // 根据faceIds修改朝向
        var currid = blockInfo.faceIds[direction];
        if (currid) {
            var posY = core.material.icons[blockInfo.cls][currid];
            if (posY != null) blockInfo.posY = posY;
        }
    }
    moveInfo.step++;
    moveInfo.px += core.utils.scan[direction].x * 2;
    moveInfo.py += core.utils.scan[direction].y * 2;
    this._moveDetachedBlock(blockInfo, moveInfo.px, moveInfo.py, moveInfo.opacity, canvases);
    if (moveInfo.step == 16) {
        moveInfo.step = 0;
        moveInfo.moveSteps.shift();
    }
}

////// 显示跳跃某块的动画，达到{"type":"jump"}的效果 //////
maps.prototype.jumpBlock = function (sx, sy, ex, ey, time, keep, callback) {
    time = time || 500;
    var blockArr = this._getAndRemoveBlock(sx, sy);
    if (blockArr == null) {
        if (callback) callback();
        return;
    }
    var block = blockArr[0], blockInfo = blockArr[1];
    var canvases = this._initDetachedBlock(blockInfo, sx, sy, block.event.animate !== false);
    this._moveDetachedBlock(blockInfo, 32 * sx, 32 * sy, 1, canvases);

    this.__playJumpSound();

    var jumpInfo = ths.__generateJumpInfo(sx, sy, ex, ey, time);
    jumpInfo.keep = keep;

    this._jumpBlock_doJump(blockInfo, canvases, jumpInfo, callback);
}

maps.prototype.__generateJumpInfo = function (sx, sy, ex, ey, time) {
    var dx = ex - sx, dy = ey - sy, distance = Math.round(Math.sqrt(dx * dx + dy * dy));
    var jump_peak = 6 + distance, jump_count = jump_peak * 2;
    return {
        x: sx, y: sy, ex: ex, ey: ey, px: 32 * sx, py: 32 * sy, opacity: 1,
        jump_peak: jump_peak, jump_count: jump_count,
        step: 0, per_time: time / 16 / core.status.replay.speed
    };
}

maps.prototype.__playJumpSound = function () {
    core.playSound('jump.mp3');
}

maps.prototype._jumpBlock_doJump = function (blockInfo, canvases, jumpInfo, callback) {
    var animate = window.setInterval(function () {
        if (jumpInfo.jump_count > 0)
            core.maps._jumpBlock_jumping(blockInfo, canvases, jumpInfo)
        else
            core.maps._moveJumpBlock_finished(blockInfo, canvases, jumpInfo, animate, callback);
    }, jumpInfo.per_time);

    core.animateFrame.asyncId[animate] = true;
}

maps.prototype.__updateJumpInfo = function (jumpInfo) {
    jumpInfo.jump_count--;
    jumpInfo.x = (jumpInfo.x * jumpInfo.jump_count + jumpInfo.ex) / (jumpInfo.jump_count + 1.0);
    jumpInfo.y = (jumpInfo.y * jumpInfo.jump_count + jumpInfo.ey) / (jumpInfo.jump_count + 1.0);
    jumpInfo.px = 32 * jumpInfo.x;
    var delta = Math.abs(jumpInfo.jump_count - jumpInfo.jump_peak);
    jumpInfo.py = 32 * jumpInfo.y - (jumpInfo.jump_peak * jumpInfo.jump_peak - delta * delta) / 2;
}

maps.prototype._jumpBlock_jumping = function (blockInfo, canvases, jumpInfo) {
    this.__updateJumpInfo(jumpInfo);
    core.maps._moveDetachedBlock(blockInfo, jumpInfo.px, jumpInfo.py, jumpInfo.opacity, canvases);
}

maps.prototype._moveJumpBlock_finished = function (blockInfo, canvases, info, animate, callback) {
    if (info.keep) info.opacity = 0;
    else info.opacity -= 0.06;
    if (info.opacity <= 0) {
        delete core.animateFrame.asyncId[animate];
        clearInterval(animate);
        this._deleteDetachedBlock(canvases);
        // 不消失
        if (info.keep) {
            core.setBlock(blockInfo.number, info.x, info.y);
            core.showBlock(info.x, info.y);
        }
        if (callback) callback();
    }
    else {
        this._moveDetachedBlock(blockInfo, info.px, info.py, info.opacity, canvases);
    }
}

////// 显示/隐藏某个块时的动画效果 //////
maps.prototype.animateBlock = function (loc, type, time, callback) {
    var isHide = type == 'hide';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    var list = this._animateBlock_getList(loc);
    if (list.length == 0) {
        if (callback) callback();
        return;
    }
    this._animateBlock_drawList(list, isHide ? 1 : 0);
    this._animateBlock_doAnimate(loc, list, isHide, 10 / time, callback);
}

maps.prototype._animateBlock_doAnimate = function (loc, list, isHide, delta, callback) {
    var opacity = isHide ? 1 : 0;
    var animate = setInterval(function () {
        opacity += isHide ? -delta : delta;
        core.maps._animateBlock_drawList(list, opacity);
        if (opacity >= 1 || opacity <= 0) {
            delete core.animateFrame.asyncId[animate];
            clearInterval(animate);
            list.forEach(function (t) {
                core.maps._deleteDetachedBlock(t.canvases);
            });
            loc.forEach(function (t) {
                if (isHide) core.removeBlock(t[0], t[1]);
                else core.showBlock(t[0], t[1]);
            });
            if (callback) callback();
        }
    }, 10);

    core.animateFrame.asyncId[animate] = true;
}

maps.prototype._animateBlock_getList = function (loc) {
    var list = [];
    loc.forEach(function (t) {
        var block = core.getBlock(t[0], t[1], null, true);
        if (block == null) return;
        block = block.block;

        var blockInfo = core.maps.getBlockInfo(block);
        if (blockInfo == null) return;
        var canvases = core.maps._initDetachedBlock(blockInfo, t[0], t[1], block.event.displayDamage !== false);

        list.push({
            'x': t[0], 'y': t[1], 'blockInfo': blockInfo, 'canvases': canvases
        });

    });
    return list;
}

maps.prototype._animateBlock_drawList = function (list, opacity) {
    list.forEach(function (t) {
        core.maps._moveDetachedBlock(t.blockInfo, t.x * 32, t.y * 32, opacity, t.canvases);
    });
}

// ------ 全局动画控制，动画绘制 ------ //

////// 添加一个全局动画 //////
maps.prototype.addGlobalAnimate = function (b) {
    if (!b.event || b.event.animate == null) return;
    if (b.event.cls == 'autotile') {
        var id = b.event.id, img = core.material.images.autotile[id];
        if (!img || img.width == 96) return;
        core.status.autotileAnimateObjs.blocks.push(b);
    }
    else {
        if (!b.event.animate || b.event.animate == 1) return;
        core.status.globalAnimateObjs.push(b);
    }
}

////// 删除一个或所有全局动画 //////
maps.prototype.removeGlobalAnimate = function (x, y, name) {
    // 没有定义xy，则全部删除
    if (x == null || y == null) {
        core.status.globalAnimateStatus = 0;
        core.status.globalAnimateObjs = [];
        core.status.autotileAnimateObjs = {"blocks": [], "map": null, "bgmap": null, "fgmap": null};
        core.status.floorAnimateObjs = [];
        return;
    }

    core.status.globalAnimateObjs = core.status.globalAnimateObjs.filter(function (block) {
        return block.x != x || block.y != y || block.name != name;
    });

    // 检查Autotile
    if (core.status.autotileAnimateObjs.blocks) {
        core.status.autotileAnimateObjs.blocks = core.status.autotileAnimateObjs.blocks.filter(function (block) {
            return block.x != x || block.y != y || block.name != name;
        });
        core.status.autotileAnimateObjs.map[y][x] = 0;
    }

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

////// 绘制动画 //////
maps.prototype.drawAnimate = function (name, x, y, callback) {

    // 正在播放录像：不显示动画
    if (core.isReplaying()) {
        if (callback) callback();
        return -1;
    }

    // 检测动画是否存在
    if (!core.material.animates[name] || x == null || y == null) {
        if (callback) callback();
        return -1;
    }

    // 开始绘制
    var animate = core.material.animates[name], centerX = 32 * x + 16, centerY = 32 * y + 16;
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

////// 绘制动画的某一帧 //////
maps.prototype._drawAnimateFrame = function (animate, centerX, centerY, index) {
    var frame = animate.frames[index];
    var ratio = animate.ratio;
    frame.forEach(function (t) {
        var image = animate.images[t.index];
        if (!image) return;
        var realWidth = image.width * ratio * t.zoom / 100;
        var realHeight = image.height * ratio * t.zoom / 100;
        core.setAlpha('animate', t.opacity / 255);

        var cx = centerX + t.x, cy = centerY + t.y;

        if (!t.mirror && !t.angle) {
            core.drawImage('animate', image, cx - realWidth / 2 - core.bigmap.offsetX, cy - realHeight / 2 - core.bigmap.offsetY, realWidth, realHeight);
        }
        else {
            core.saveCanvas('animate');
            core.canvas.animate.translate(cx, cy);
            if (t.angle)
                core.canvas.animate.rotate(-t.angle * Math.PI / 180);
            if (t.mirror)
                core.canvas.animate.scale(-1, 1);
            core.drawImage('animate', image, -realWidth / 2 - core.bigmap.offsetX, -realHeight / 2 - core.bigmap.offsetY, realWidth, realHeight);
            core.loadCanvas('animate');
        }
        core.setAlpha('animate', 1);
    })
}

////// 停止动画 //////
maps.prototype.stopAnimate = function (id, doCallback) {
    for (var i = 0; i < core.status.animateObjs.length; i++) {
        var obj = core.status.animateObjs[i];
        if (obj.id == id) {
            delete core.animateFrame.asyncId[obj.id];
            if (doCallback) {
                (function (callback) {
                    setTimeout(function () {
                        if (callback) callback();
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
