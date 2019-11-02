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
    var notCopy = ["firstArrive", "eachArrive", "parallelDo", "map", "bgmap", "fgmap",
        "events", "changeFloor", "afterBattle", "afterGetItem", "afterOpenDoor", "cannotMove"];
    for (var name in floor) {
        if (notCopy.indexOf(name) == -1 && floor[name] != null)
            content[name] = core.clone(floor[name]);
    }
    for (var name in map) {
        if (notCopy.indexOf(name) == -1 && map[name] != null)
            content[name] = core.clone(map[name]);
    }
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
    core.status.id2number = core.status.id2number || {};
    if (core.status.id2number[id] != null) return core.status.id2number[id];
    return core.status.id2number[id] = this._getNumberById(id);
}

maps.prototype._getNumberById = function (id) {
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

maps.prototype.getBlockByNumber = function (number) {
    core.status.number2Block = core.status.number2Block || {};
    if (core.status.number2Block[number] != null) return core.status.number2Block[number];
    return core.status.number2Block[number] = this.initBlock(null, null, number, true);
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

    block.event.sprite = block.event.sprite || block.event.id;//core.getSpriteObj();
    // todo: 实现元件的贴图自由选择 此处默认id就是对应的贴图

    if (typeof block.event.noPass === 'string')
        block.event.noPass = JSON.parse(block.event.noPass);

    if (addInfo) this._addInfo(block);
    if (eventFloor) {
        this._addEvent(block, x, y, (eventFloor.events || {})[x + "," + y]);
        var changeFloor = (eventFloor.changeFloor || {})[x + "," + y];
        if (changeFloor) this._addEvent(block, x, y, {"trigger": "changeFloor", "data": changeFloor});
    }
    if (main.mode == 'editor') delete block.disable;
    core.becomeSubject(block);// 凡是init的blcok 都要成为观察对象?
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
maps.prototype._initMaps = function () {
    var floorIds = core.floorIds;
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
            var obj = this.saveMap(id);
            if (Object.keys(obj).length > 0) map[id] = obj;
        }
        return map;
    }
    var map = maps[floorId], floor = core.floors[floorId];
    var blocks = this._getMapArrayFromBlocks(map.blocks, floor.width, floor.height, true);
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
maps.prototype.getMapArray = function (floorId, showDisable) {
    floorId = floorId || core.status.floorId;
    return this._getMapArrayFromBlocks(core.status.maps[floorId].blocks,
        core.floors[floorId].width, core.floors[floorId].height, showDisable);
}

maps.prototype._getMapArrayFromBlocks = function (blockArray, width, height, showDisable) {
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
            if (showDisable) blocks[y][x] = block.id + ":f";
        }
        else {
            blocks[y][x] = block.id;
            if (showDisable && block.disable === false)
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
maps.prototype._getBgFgMapArray = function (name, floorId, noCache) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return [];
    var width = core.floors[floorId].width;
    var height = core.floors[floorId].height;

    if (!noCache && core.status[name + "maps"][floorId])
        return core.status[name + "maps"][floorId];

    var arr = core.clone(core.floors[floorId][name + "map"] || []);
    if (main.mode == 'editor' && !(uievent && uievent.isOpen))
        arr = core.clone(editor[name + "map"]) || arr;
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
    if (core.status[name + "maps"])
        core.status[name + "maps"][floorId] = core.clone(arr);
    return arr;
}

maps.prototype.getBgMapArray = function (floorId, noCache) {
    return this._getBgFgMapArray('bg', floorId, noCache);
}

maps.prototype.getFgMapArray = function (floorId, noCache) {
    return this._getBgFgMapArray('fg', floorId, noCache);
}

maps.prototype._getBgFgNumber = function (name, x, y, floorId, noCache) {
    if (x == null) x = core.getHeroLoc('x');
    if (y == null) y = core.getHeroLoc('y');
    return this._getBgFgMapArray(name, floorId, noCache)[y][x];
}

maps.prototype.getBgNumber = function (x, y, floorId, noCache) {
    return this._getBgFgNumber('bg', x, y, floorId, noCache);
}

maps.prototype.getFgNumber = function (x, y, floorId, noCache) {
    return this._getBgFgNumber('fg', x, y, floorId, noCache);
}

// ------ 当前能否朝某方向移动，能否瞬间移动 ------ //

////// 生成全图的当前可移动信息 //////
maps.prototype.generateMovableArray = function (floorId, x, y, direction) {
    floorId = floorId || core.status.floorId;
    if (!floorId) return null;
    var width = core.floors[floorId].width, height = core.floors[floorId].height;
    var bgArray = this.getBgMapArray(floorId),
        fgArray = this.getFgMapArray(floorId),
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
    if (nx < 0 || ny < 0 || nx >= core.floors[floorId].width || ny >= core.floors[floorId].height)
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
    return this.canMoveDirectlyArray([[destX,destY]])[0];
}

maps.prototype.canMoveDirectlyArray = function (locs) {
    var ans = [], number = locs.length;

    var fromX = core.getHeroLoc('x'), fromY = core.getHeroLoc('y');
    if (!this._canMoveDirectly_checkGlobal()) {
        for (var i = 0; i < number; ++i) ans.push(-1);
        return ans;
    }
    for (var i = 0; i < number; ++i) {
        if (locs[i][0] == fromX && locs[i][1] == fromY) {
            ans.push(0);
            number--;
        }
        else if (locs[i][0] < 0 || locs[i][0] >= core.bigmap.width || locs[i][1] < 0 || locs[i][1] >= core.bigmap.height) {
            ans.push(-1);
            number--;
        }
        else ans.push(null);
    }
    if (number == 0) return ans;

    // 检查起点事件
    if (!this._canMoveDirectly_checkStartPoint(fromX, fromY)) {
        for (var i in ans) {
            if (ans[i] == null) ans[i] = -1;
        }
        return ans;
    }

    return this._canMoveDirectly_bfs(fromX, fromY, locs, number, ans);
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

maps.prototype._canMoveDirectly_bfs = function (sx, sy, locs, number, ans) {
    var canMoveArray = this.generateMovableArray();
    var blocksObj = this.getMapBlocksObj(core.status.floorId);
    // 滑冰
    var bgMap = this.getBgMapArray();

    var visited = [], queue = [];
    visited[sx + "," + sy] = 0;
    queue.push(sx + "," + sy);

    while (queue.length > 0) {
        var now = queue.shift().split(","), x = parseInt(now[0]), y = parseInt(now[1]);
        for (var direction in core.utils.scan) {
            if (!core.inArray(canMoveArray[x][y], direction)) continue;
            var nx = x + core.utils.scan[direction].x, ny = y + core.utils.scan[direction].y, nindex = nx + "," + ny;
            if (visited[nindex]) continue;
            if (bgMap[ny][nx] == 167) continue;
            if (!this._canMoveDirectly_checkNextPoint(blocksObj, nx, ny)) continue;
            visited[nindex] = visited[now] + 1;
            // if (nx == ex && ny == ey) return visited[nindex];
            for (var i in ans) {
                if (locs[i][0] == nx && locs[i][1] == ny && ans[i] == null) {
                    ans[i] = visited[nindex];
                    number--;
                    if (number == 0) return ans;
                }
            }
            queue.push(nindex);
        }
    }

    for (var i in ans) {
        if (ans[i] == null) ans[i] = -1;
    }
    return ans;
}

maps.prototype._canMoveDirectly_checkNextPoint = function (blocksObj, x, y) {
    var index = x + "," + y;
    // 该点是否有事件
    if (blocksObj[index] && (blocksObj[index].event.trigger || blocksObj[index].event.noPass)) return false;
    // 是否存在阻激夹域伤害
    if (core.status.checkBlock.damage[index]) return false;
    // 是否存在捕捉
    if (core.status.checkBlock.ambush[index]) return false;

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

///// 主画布上绘制一个精灵块
maps.prototype._drawSpriteBlock = function(blockInfo, x, y, layer){
    var obj = null;
    if(blockInfo.sprite)obj = blockInfo.sprite;
    else if(blockInfo.event && blockInfo.event.sprite)obj = blockInfo.event.sprite;
    if(obj){
        if(typeof obj === 'string') {
            obj = core.sprite.getSpriteObj(obj);
        }
        layer = layer || core.scenes.mapScene.getLayer('event'); //core.sprite.layer; // TODO: 不要使用全局layer，由场景管理
        var change = function (){ // TODO: 坐标变换单一类，提供统一变换方法
            this.x = x * 32 + 16; //this.x = x * 32+16 - ~~(this.info.width/2+0.5);
            this.y = (y+1) * 32; //this.y = (y + 1) * 32 - this.info.height;
        }
        change.call(obj);
        if(!layer.hasObj(obj))layer.addNewObj(obj);
        layer.blur(); // TODO: 统一请求
    }
}

///// todo:用注册的方式定义观察者（sprite）的行为，都是非闭包函数
//
maps.prototype._bindObserverToBlock = function(block, sprite) {
    // if(block.hasObserver(block.event.sprite))return;
    sprite = sprite || core.getSpriteObj(block.event.sprite);
    if(!block.hasObserver)core.becomeSubject(block);
    if(block.hasObserver(sprite))return;
    block.addObserver(
        sprite
    );
}

maps.prototype._removeSubjectOfBlock = function(block){
    block.remove();
}

maps.prototype._hasBlockObserver = function(block){
    return !!block.observers[block];
}

////// 绘制一个图块 ////// layer是需要绘制到的层、arr是所处的地图 //drawBlock会调用几次？
maps.prototype.drawBlock = function (block, layer, arr) {
    if (block.event.id == 'none') return;
    //if(!this._hasBlockObserver(block)){
    //    this._bindObserverToBlock(block);
    //}
    block.notify('draw', layer, arr);//告诉sprite视图数据的变动
    // core.notifyObservers(block, 'draw', layer, arr);
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


///// 将地图放入幕后并将新地图拉到台前 : 是否使用？ 需要修改很多
maps.prototype._exchangeMap = function(floorId){
    var lastFloor = core.status.floorId;
    if(lastFloor)
        core.status.maps[lastFloor] = this.saveMap(lastFloor);
    core.status.maps[floorId] = this.loadFloor(floorId, core.status.maps[floorId]);
}


///// 给新图块赋精灵
maps.prototype._empowerBlocks = function(blocks){
    blocks.forEach(function(block) {
        core.becomeSubject(block);
        core.maps._bindObserverToBlock(block);
    })
}

///// 将地图推到舞台前 需要销毁之前的精灵 并且
maps.prototype._pushMap = function(floorId){
    core.status.floorId = floorId;
    core.status.thisMap = core.status.maps[floorId];
    this._empowerBlocks(core.status.thisMap.blocks);
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
    this._pushMap(floorId);
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

////// 绘制背景层 //////
maps.prototype.drawBg = function (floorId, ctx) {
    floorId = floorId || core.status.floorId;
    var onMap = ctx == null;
    if (onMap) {
        ctx = core.scenes.mapScene.getLayer('bg');//core.canvas.bg;
        ctx.clear();
        //core.clearMap(ctx);
        core.status.floorAnimateObjs = this._getFloorImages(floorId); // TODO 添加到静态前景 或者objs
    }
    core.maps._drawBg_drawBackground(floorId, ctx);
    // ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制背景图块；后绘制的覆盖先绘制的。
    core.maps._drawFloorImages(floorId, ctx, 'bg');
    core.maps._drawBgFgMap(floorId, ctx, 'bg', onMap);
}

maps.prototype._drawBg_drawBackground = function (floorId, layer) {
    var width = core.floors[floorId].width, height = core.floors[floorId].height;
    var groundId = (core.status.maps || core.floors)[floorId].defaultGround || "ground";
    var obj = core.getTillingSprite(groundId, width * core.__BLOCK_SIZE__, height*core.__BLOCK_SIZE__);
    obj.zIndex = -1;
    layer.addChild(obj);
}

////// 绘制事件层 //////
maps.prototype.drawEvents = function (floorId, blocks, layer) {
    floorId = floorId || core.status.floorId;
    if (!blocks) blocks = core.status.maps[floorId].blocks;
    var arr = this._getMapArrayFromBlocks(blocks, core.floors[floorId].width, core.floors[floorId].height);
    layer = layer || core.scenes.mapScene.getLayer('event');
    // var onMap = layer == null;
    // if (onMap) layer = //core.sprite.layer.destCtx;
    blocks.filter(function (block) {
        return block.event && !block.disable;
    }).forEach(function (block) {
        core.drawBlock(block, layer, arr);
    });
    // if (onMap) core.status.autotileAnimateObjs.map = core.clone(arr);
}

////// 绘制前景层 //////
maps.prototype.drawFg = function (floorId, ctx) {
    floorId = floorId || core.status.floorId;
    var onMap = ctx == null;
    if (onMap) {
        ctx = core.scenes.mapScene.getLayer('fg');//core.canvas.bg;
    }
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

    var arr = this._getBgFgMapArray(name, floorId, true);
    var eventArr = null;
    if (name == 'fg' && onMap && this._drawBgFgMap_shouldBlurFg()) {
        eventArr = this.getMapArray(floorId);
    }
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var block = this.initBlock(x, y, arr[y][x], true);
            core.maps._bindObserverToBlock(block);
            block.name = name;
            // --- 前景虚化
            var blur = false;
            if (eventArr != null && eventArr[y][x] != 0) {
                blur = true;
            }
            core.drawBlock(block, ctx, arr);
            if(blur)
                block.notify('blur', 0.6); // todo： 对自动原件无效的bug
        }
    }
    //if (onMap)
    //    core.status.autotileAnimateObjs[name + "map"] = core.clone(arr);
}

////// 是否应当存在事件时虚化前景层 //////
maps.prototype._drawBgFgMap_shouldBlurFg = function () {
    return main.mode == 'editor' || core.flags.blurFg;
}

////// 绘制楼层贴图 ////// ！
maps.prototype._drawFloorImages = function (floorId, layer, name, images, currStatus) {
    floorId = floorId || core.status.floorId;
    if (!images) images = this._getFloorImages(floorId);
    var redraw = currStatus != null;
    images.forEach(function (t) {
        if (typeof t == 'string') t = [0, 0, t];
        var dx = parseInt(t[0]), dy = parseInt(t[1]), imageName = t[2], frame = core.clamp(parseInt(t[4]), 1, 8);
        imageName = core.getMappedName(imageName);
        var image = core.material.images.images[imageName];
        if (core.isset(dx) && core.isset(dy) && image &&
            !core.hasFlag("__floorImg__" + floorId + "_" + dx + "_" + dy)) {
            var width = parseInt(image.width / frame), offsetX = (currStatus || 0) % frame * width;
            if (/.*\.gif/i.test(imageName) && main.mode == 'play') {
                if (redraw) return; // 忽略gif
                this._drawFloorImages_gif(image, dx, dy);
                return;
            }
            var _draw = function () {
                var obj = core.getSpriteFromImage(image);
                obj.zIndex = -1;
                obj.x = dx;
                obj.y = dy;
                obj.width = width;
                layer.addChild(obj);
            }
            if(t[3] && name == 'fg' || !t[3] && name=='bg'){
                _draw();
            }
            // core.maps._drawFloorImage(layer, name, t[3], image, offsetX, width, dx, dy, redraw);
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

maps.prototype._drawFloorImage = function (layer, name, type, image, offsetX, width, dx, dy, redraw) {
    var height = image.height;
    var _draw = function () {
        var obj = core.getSpriteFromImage(image);
        obj.zIndex = 0;
        obj.x = dx;
        obj.y = dy;
        obj.width = dx;
        obj.height = dy;
        layer.addChild(obj);
        // if (redraw) core.clearMap(ctx, dx, dy, width, height);
        // core.drawImage(ctx, image, offsetX, 0, width, height, dx, dy, width, height);
    }
    if (!type) {
        if (name != 'bg') return;
        return _draw();
    }
    if (type == 1) {
        if (name != 'fg') return;
        return _draw();
    }
    /*
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
    }*/
}

////// 绘制Autotile //////
maps.prototype._drawAutotile_createSprite = function(name,sx,sy,sw,sh,dx,dy,dw,dh,){
    var obj = core.getAutotileSprite(name,sx,sy,sw,sh);
    obj.x = dx; obj.y = dy;
    obj.width = dw; obj.height = dh;
    return obj;
}

maps.prototype._drawAutotile = function (layer, mapArr, block, size, left, top, status) {
    var xx = block.x, yy = block.y;
    var autotile = block.event.id;//core.material.images['autotile'][block.event.id];
    status = status || 0;
    var nFrame = status;  //status = 0;
    // status = status || 0;
    var ctx = [];
    // status %= sprite.info.frame;
    //status %= parseInt(autotile.width / 96);
    var done = {};
    var isGrass = function(x,y){
        if(core.maps._drawAutotile_getAutotileAroundId(mapArr[yy][xx],x,y,mapArr)){
            return 1;
        }else{
            return 0;
        }
    }
    var iG = [];
    [-1,0,1].forEach(function(_x){
        iG[_x] = [];
        [-1,0,1].forEach(function(_y){
            iG[_x][_y] = isGrass(xx + _x, yy + _y);
        })});
    if(iG[-1][-1] + iG[0][-1] + iG[0][0] + iG[-1][0] == 3 && !iG[-1][-1]){
        this._drawAutotile_layer(ctx, xx * size + left, yy * size + top, size, autotile, status, 16);
        done[0] = true;
    }
    if(iG[0][-1] + iG[1][-1] + iG[1][0] + iG[0][0] == 3 && !iG[1][-1]){
        this._drawAutotile_layer(ctx, xx * size + left + size/2, yy * size + top, size, autotile, status,  17);
        done[1] = true;
    }
    if(iG[0][0] + iG[1][0] + iG[1][1] + iG[0][1] == 3 && !iG[1][1]){
        this._drawAutotile_layer(ctx, xx * size + left+size/2, yy * size + top + size/2, size, autotile, status, 18);
        done[3] = true;
    }
    if(iG[0-1][0] + iG[0][0] + iG[0][1] + iG[-1][1] == 3 && !iG[-1][1]){
        this._drawAutotile_layer(ctx, xx * size + left, yy * size + top + size/2, size, autotile, status, 19);
        done[2] = true;
    }
    var _id = iG[0][-1] + 2 * iG[-1][0] + 4 * iG[0][1] + 8 * iG[1][0];
    this._drawAutotile_layer(ctx, xx * size, yy * size, size, autotile, status,  _id, done);

    if(!layer || !layer.addNewObj){
        layer = core.scenes.mapScene.getLayer('event');//core.sprite.layer;
    }
    ctx.forEach(function(obj){
        layer.addChild(obj);
    });

}

maps.prototype._drawAutotile_layer = function(sprite, x, y, size, autotile, status, index, done) {
    var indexData = [[[96 * status, 0, 32, 32, x, y, size, size],],
        [[96 * status, 3 * 32, 16, 32, x, y, size / 2, size],[96 * status +  2 * 32 + 16, 3 * 32, 16, 32, x + size / 2, y, size / 2, size],],
        [[96 * status +  2 * 32, 32, 32, 16, x, y, size, size / 2],[96 * status +  2 * 32, 3 * 32 + 16, 32, 16, x, y + size / 2, size, size / 2],],
        [[96 * status +  2 * 32, 3 * 32, 32, 32, x, y, size, size],],
        [[96 * status, 32, 16, 32, x, y, size / 2, size],[96 * status +  2 * 32 + 16, 32, 16, 32, x + size / 2, y, size / 2, size],],
        [[96 * status, 2 * 32, 16, 32, x, y, size / 2, size],[96 * status +  2 * 32 + 16, 2 * 32, 16, 32, x + size / 2, y, size / 2, size],],
        [[96 * status +  2 * 32, 32, 32, 32, x, y, size, size],],
        [[96 * status +  2 * 32, 2 * 32, 32, 32, x, y, size, size],],
        [[96 * status, 32, 32, 16, x, y, size, size / 2],[96 * status, 3 * 32 + 16, 32, 16, x, y + size / 2, size, size / 2],],
        [[96 * status, 3 * 32, 32, 32, x, y, size, size],],
        [[96 * status +  32, 32, 32, 16, x, y, size, size / 2],[96 * status +  32, 3 * 32 + 16, 32, 16, x, y + size / 2, size, size / 2],],
        [[96 * status +  32, 3 * 32, 32, 32, x, y, size, size],],
        [[96 * status, 32, 32, 32, x, y, size, size],],
        [[96 * status, 2 * 32, 32, 32, x, y, size, size],],
        [[96 * status +  32, 32, 32, 32, x, y, size, size],],
        [[96 * status +  32, 2 * 32, 32, 32, x, y, size, size],],
        [[96 * status +  2 * 32, 0, 16, 16, x, y, size / 2, size / 2],],
        [[96 * status +  2 * 32 + 16, 0, 16, 16, x, y, size / 2, size / 2],],
        [[96 * status +  2 * 32 + 16, 16, 16, 16, x, y, size / 2, size / 2],],
        [[96 * status +  2 * 32, 16, 16, 16, x, y, size / 2, size / 2],],
    ];
    var data = indexData[index];
    if(index>=16){ // 拐角直接绘制
        sprite.push(this._drawAutotile_createSprite(autotile, data[0][0], data[0][1], data[0][2], data[0][3], data[0][4], data[0][5], size/2, size/2));
        //canvas.drawImage(autotile, data[0][0], data[0][1], data[0][2], data[0][3], data[0][4], data[0][5], size/2, size/2);
    }else{ // 非拐角要根据是否已经绘制进行切分后绘制
        this._drawAutotile_layerCut(sprite, autotile, x, y, size, data, done);
    }
}

maps.prototype._drawAutotile_layerCut = function(sprite, autotile, x, y, size, data, done){
    var drawData = [];
    done = done || {};
    if(data.length == 2){
        var idx = 0;
        var cut = 0;
        for(var i in data){
            if(data[i][2] % 32){ // 是否纵切
                cut = 0;
            }
            else if(data[i][3] % 32){ // 是否横切
                cut = 1;
            }
            if(data[i][0] % 32 || data[i][1] % 32){ // right down
                idx = 1;
            }else{  // left top
                idx = 0;
            }
            if(cut){
                idx *= 2;
                if(!done[idx])drawData[idx] = [data[i][0], data[i][1]];
                if(!done[idx + 1])drawData[idx + 1] = [parseInt(data[i][0]) + 16, data[i][1]];
            }else{
                if(!done[idx])drawData[idx] = [data[i][0], data[i][1]];
                if(!done[idx + 2])drawData[idx + 2] = [data[i][0], parseInt(data[i][1]) + 16];
            }
        }
    }else{
        if(!done[0])drawData[0] = [data[0][0], data[0][1]];
        if(!done[1])drawData[1] = [data[0][0] + 16, data[0][1]];
        if(!done[2])drawData[2] = [data[0][0], data[0][1] + 16];
        if(!done[3])drawData[3] = [data[0][0] + 16, data[0][1] + 16];
    }
    for(var i = 0; i<4; i++){
        var dt = drawData[i];if(!dt)continue;
        sprite.push(this._drawAutotile_createSprite(autotile, dt[0], dt[1], 16, 16, x + (i % 2) * size / 2, y + parseInt(i / 2) * size / 2, size/2, size/2));
        //canvas.drawImage(autotile, dt[0], dt[1], 16, 16, x + (i % 2) * size / 2, y + parseInt(i / 2) * size / 2, size/2, size/2);
    };
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
    else return core.material.autotileEdges[currId].indexOf(mapArr[y][x]) >= 0;//core.maps.getNumberById(currId) == mapArr[y][x];//
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

    var cv = block.name?core.canvas[block.name]:core.scenes.mapScene.getLayer('event').destCtx;//core.sprite.layer.destCtx;
    cv.clearRect(32 * x, 32 * y, 32, 32);
    if (block.name) {
        if (block.name == 'bg')
            core.drawImage('bg', core.material.groundCanvas.canvas, 32 * x, 32 * y);
        this._drawAutotile(cv, core.status.autotileAnimateObjs[block.name+"map"], block, 32, 0, 0, animate);
    }
    else {
        this._drawAutotile(cv, core.status.autotileAnimateObjs.map, block, 32, 0, 0, animate);
    }
}

////// 为autotile判定边界 ////// 
maps.prototype._makeAutotileEdges = function () {
    var autotileIds = Object.keys(core.material.icons.autotile);
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
        if(!core.sprite.sprite[t])return;
        ctx.drawImage(core.material.images.autotile, core.sprite.sprite[t].x, 0, 32, 32, 0, 0, 32, 32);
        var data = canvas.toDataURL("image/png");

        autotileIds.forEach(function (t2) {
            if (t == t2) return;
            var n2 = core.maps.getNumberById(t2);

            ctx.clearRect(0, 0, 32, 32);
            ctx.drawImage(core.material.images.autotile, core.sprite.sprite[t].x, 0, 32, 32, 0, 0, 32, 32);
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

    var tempScene = core.scenes.tempScene;
    // --- 暂存 flags
    var hasHero = core.status.hero != null, flags = null;
    if (options.flags) {
        if (!hasHero) core.status.hero = {};
        flags = core.status.hero.flags;
        core.status.hero.flags = options.flags;
    }
    this._empowerBlocks(blocks); // 赋予精灵（如果已经有了 那就会有两个
    this._drawThumbnail_realDrawTempCanvas(floorId, blocks, options, tempScene);
    tempScene.update(); 
    tempScene.render();
    tempCanvas.clearRect(0, 0, tempWidth, tempHeight);
    tempCanvas.drawImage(tempScene.view, 0, 0);
    tempScene.clear();//！重要！精灵需要回收
    // --- 恢复 flags
    if (!hasHero) delete core.status.hero;
    else if (flags != null) core.status.hero.flags = flags;
}

maps.prototype._drawThumbnail_realDrawTempCanvas = function (floorId, blocks, options, scene) {
    // 缩略图：背景
    var bg = scene.createGetLayer('tempBg', core.getNewLayerSprite());
    var evt = scene.createGetLayer('tempEvent', core.getNewLayerSprite());
    var fg = scene.createGetLayer('tempFg', core.getNewLayerSprite());
    this.drawBg(floorId, bg);
    // 缩略图：事件
    this.drawEvents(floorId, blocks, evt);
    // 缩略图：勇士
    if (options.heroLoc) {
        var obj = core.getSpriteObj(options.heroLoc.name || core.getFlag('heroIcon', 'hero'));
        core.heroSpritePositionTransForm(obj, options.heroLoc.x, options.heroLoc.y, options.heroLoc.direction);
        evt.addNewObj(obj);
    }
    // 缩略图：前景
    this.drawFg(floorId, fg);
    // 缩略图：显伤
    scene.removeLayer('tempDamage');
    if (options.damage){
        var tempCanvas = core.createCleanCanvas('tempDamage', 0, 0, core.bigmap.tempCanvas.canvas.width, core.bigmap.tempCanvas.canvas.height);
        var ctx = tempCanvas.getContext('2d');
        core.control.updateDamage(floorId, ctx, evt);
        var dmg = scene.getLayer('tempDamage');
        if(!dmg){
            dmg = core.createCanvasLayer(tempCanvas);
            scene.addLayer('tempDamage', dmg, 999999);
        }else{
            dmg.updateTexture(tempCanvas);
        }
    }else{
    }
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
    var blockId = this.getBlockId(x, y, floorId);
    if (blockId == null) return false;
    var ids = ['upFloor','downFloor'];
    if (core.flags.flyRecordPosition)
        ids = ids.concat(['leftPortal','rightPortal','upPortal','downPortal']);
    return ids.indexOf(blockId)>=0;
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
    var number = block.id, id = block.event.id, cls = block.event.cls, name = block.event.name,
        image = null, posX = 0, posY = 0, animate = block.event.animate,
        height = block.event.height || 32, faceIds = {};

    if (id == 'none') return null;
    else if (id == 'airwall') {
        if (!core.material.images.airwall) return null;
        image = core.material.images.airwall;
        name = "空气墙";
    }
    else if (cls == 'tileset') {
        core.getSpriteInfo(id);
        //var offset = core.icons.getTilesetOffset(id);
        //if (offset == null) return null;
        //posX = offset.x;
        //posY = offset.y;
        image = core.material.images.tilesets[offset.image];
    }
    else if (cls == 'autotile') {
        image = core.material.images.autotile[id];
    }
    else {
        image = core.material.images[cls];
        posY = core.material.icons[cls][id];
        faceIds = block.event.faceIds || {};
        if (core.material.enemys[id]) {
            name = core.material.enemys[id].name;
        } else if (core.material.items[id]) {
            name = core.material.items[id].name;
        }
    }
    var ret = {number: number, id: id, cls: cls, name: name, image: image, posX: posX, posY: posY, height: height, faceIds: faceIds, animate: animate};
    if(block.event.sprite){
        ret.sprite = block.event.sprite;
    }else{
        console.log(block);
    }
    return ret;
}

////// 搜索某个图块出现的所有位置 //////
maps.prototype.searchBlock = function (id, floorId, showDisable) {
    if (typeof id == 'number') id = this.getBlockByNumber(id).event.id;
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
        if ((showDisable || !block.disable) && core.matchWildcard(id, block.event.id)) {
            result.push({floorId: floorId, index: i, block: block, x: block.x, y: block.y});
        }
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
    block = block.block;

    // 删除动画，清除地图
    if (floorId == core.status.floorId) {
        // core.removeGlobalAnimate(x, y);
        block.notify('remove');
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
    if (typeof number == 'string') {
        if (/^\d+$/.test(number)) number = parseInt(number);
        else number = core.getNumberById(number);
    }

    var block = this.initBlock(x, y, number, true, core.floors[floorId]);
    if (block.id == 0 && !block.event.trigger) {
        // 转变图块为0且该点无事件，视为隐藏
        core.removeBlock(x, y, floorId);
        return;
    }
    var originBlock = core.getBlock(x, y, floorId, true);
    if (floorId == core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        //core.clearMap('event', x * 32, y * 32, 32, 32);
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
        // core.addGlobalAnimate(block);
        // core.updateStatusBar();
    }
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
    var toBlock = this.getBlockByNumber(toNumber, true);
    core.status.maps[floorId].blocks.forEach(function (block) {
        if (block.id == fromNumber) {
            block.id = toNumber;
            for (var one in toBlock.event) {
                block.event[one] = core.clone(toBlock.event[one]);
            }
        }
    });
}

////// 改变前景背景的图块 //////
maps.prototype.setBgFgBlock = function (name, number, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if (!floorId || number == null || x == null || y == null) return;
    if (x < 0 || x >= core.floors[floorId].width || y < 0 || y >= core.floors[floorId].height) return;
    if (name != 'bg' && name != 'fg') return;
    if (typeof number == 'string') {
        if (/^\d+$/.test(number)) number = parseInt(number);
        else number = core.getNumberById(number);
    }

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

///// 临时取出一个块 地图上不删除 但blockArray中不存在
maps.prototype._catchTempBlock = function (x, y) {
    var block = core.getBlock(x, y);
    if (block == null) return null;
    core.status.thisMap.blocks.splice(block.index,1);
    block = block.block;
    return block;

    // XXXXXX
    var blockInfo = this.getBlockInfo(block);
    if (blockInfo == null) return;
    return [block, blockInfo];
}

///// 恢复临时块
maps.prototype._recoverTempBlock = function (block) {
    core.status.thisMap.blocks.push(block);
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

////// 显示移动某块的动画，达到{“type”:”move”}的效果 —— 移动主角也算移动//////
maps.prototype.moveBlock = function (x, y, steps, time, keep, callback) {
    time = time || 500;
    var block = this._catchTempBlock(x, y);
    if (block == null) {
        if (callback) callback();
        return;
    }
    // var block = blockArr[0], blockInfo = blockArr[1];
    var id = setTimeout(null);
    core.animateFrame.asyncId[id] = true;
    this._moveBlock_spriteMove(block, steps, time, function(){
        core.maps._moveJumpSprite_finished(null, block, {
            'keep': keep,
            'animate': time!=0,
        }, function(){
            delete core.animateFrame.asyncId[id];
            if(callback)callback();
        });
    });
}


maps.prototype._moveBlock_spriteMove = function(block, steps, time, callback, realmove){
    var moveSteps = (steps||[]).filter(function (t) {
        return ['up','down','left','right','forward','backward','ld','lu','rd','ru'].indexOf(t)>=0;
    });
    var i = 0;
    var moveInfo = {
        direction: moveSteps[i], step: 0, per_time: time / 16 / core.status.replay.speed,
        speed: time / core.__BLOCK_SIZE__ / 16,
    }
    var nextStep = function(){
        moveInfo.direction = moveSteps[i];
        if(i>=moveSteps.length){
            if(callback)callback();
            return;
        }
        if(realmove){ // 使用自己的方法进行
            realmove(moveInfo.direction, nextStep);
        }else{
            block.notify('move', moveInfo);
            core.maps._moveBlock_dataMove(block, moveInfo.direction);
        }
        i++;
    }
    moveInfo.callback = nextStep;
    nextStep();
}

maps.prototype._moveBlock_dataMove = function(block, direction){
    if(!direction)return;
    if(['forward','backward'].indexOf(direction)>=0){
        if(!block.direction){
            return;
        }
        direction = direction=='forward'?block.direction:core.utils.invDir[block.direction];
    }
    var scan = core.utils.scan[direction]?core.utils.scan:core.utils.obliScan;
    block.x += scan[direction].x;
    block.y += scan[direction].y;
}

maps.prototype._moveBlock_doMove = function (blockInfo, block, moveInfo, callback) {
    var speed = 10; // TODO: 速度信息
    var step = 0, moveSteps = (steps||[]).filter(function (t) {
        return ['up','down','left','right','forward','backward','ld','lu','rd','ru'].indexOf(t)>=0;
    });
    var obj = blockInfo.sprite;
    var nextStep = function(){
        if(step<moveSteps.length){
            core.events._eventMoveSprite_moving(obj, moveSteps[step++], speed, nextStep);
        }else{
            obj.stopAnimate();
            obj.resetFrame();
            delete core.animateFrame.asyncId[blockInfo.sprite];
            core.maps._moveJumpBlock_finished(blockInfo, canvases, moveInfo, animate, callback);
        }
    }
    core.animateFrame.asyncId[blockInfo.sprite] = true;
    nextStep();
    return ;
    //////
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

maps.prototype._moveBlock_updateDirection = function (blockInfo, moveInfo) {
    moveInfo.offset = 1;
    var direction = moveInfo.moveSteps[0];
    if (moveInfo.lastDirection == null) {
        for (var d in blockInfo.faceIds) {
            if (blockInfo.faceIds[d] == blockInfo.id) {
                moveInfo.lastDirection = d;
                break;
            }
        }
    }
    if (direction == 'forward' || direction == 'backward') {
        if (moveInfo.lastDirection == null) {
            moveInfo.moveSteps.shift();
            return false;
        }
        if (direction == 'backward')
            moveInfo.offset = -1;
        direction = moveInfo.lastDirection;
    }
    moveInfo.lastDirection = moveInfo.moveSteps[0] = direction;
    moveInfo.x += core.utils.scan[direction].x * moveInfo.offset;
    moveInfo.y += core.utils.scan[direction].y * moveInfo.offset;
    // 根据faceIds修改朝向
    var currid = blockInfo.faceIds[direction];
    if (currid) {
        var posY = core.material.icons[blockInfo.cls][currid];
        if (posY != null) blockInfo.posY = posY;
    }
    return true;
}

maps.prototype._moveBlock_moving = function (blockInfo, canvases, moveInfo) {
    if (moveInfo.step == 0) {
        if (!this._moveBlock_updateDirection(blockInfo, moveInfo)) return;
    }
    var direction = moveInfo.moveSteps[0];
    moveInfo.step++;
    moveInfo.px += core.utils.scan[direction].x * 2 * moveInfo.offset;
    moveInfo.py += core.utils.scan[direction].y * 2 * moveInfo.offset;
    this._moveDetachedBlock(blockInfo, moveInfo.px, moveInfo.py, moveInfo.opacity, canvases);
    if (moveInfo.step == 16) {
        moveInfo.step = 0;
        moveInfo.moveSteps.shift();
    }
}

////// 显示跳跃某块的动画，达到{"type":"jump"}的效果 //////
maps.prototype.jumpBlock = function (sx, sy, ex, ey, time, keep, callback) {
    time = time || 500;
    var block = this._catchTempBlock(sx, sy);
    if (block == null) {
        if (callback) callback();
        return;
    }
    this._jumpBlock_spriteJump(block, sx, sy, ex, ey, time, keep,
        function(){
            core.maps._moveJumpSprite_finished(null, block,
                {
                    keep:keep,
                    aniamte:time == 0,
                },
                callback);
        }
    )
    return;
    //////  xxxxxxx

    var blockArr = this._getAndRemoveBlock(sx, sy);
    if (blockArr == null) {
        if (callback) callback();
        return;
    }
    var block = blockArr[0], blockInfo = blockArr[1];
    var canvases = this._initDetachedBlock(blockInfo, sx, sy, block.event.animate !== false);
    this._moveDetachedBlock(blockInfo, 32 * sx, 32 * sy, 1, canvases);
    core.playSound('jump.mp3');
    var jumpInfo = this.__generateJumpInfo(sx, sy, ex, ey, time);
    jumpInfo.keep = keep;

    this._jumpBlock_doJump(blockInfo, canvases, jumpInfo, callback);
}

maps.prototype._jumpBlock_spriteJump = function(block, sx, sy, ex, ey, time, keep, callback){
    core.playSound('jump.mp3');
    var jumpInfo = this.__generateJumpInfo(sx, sy, ex, ey, time);
    jumpInfo.keep = keep;
    jumpInfo.animate = time == 0;
    jumpInfo.callback = function(){
        block.x = ex;
        block.y = ey;
        if(callback)callback();
    }
    block.notify("jump", jumpInfo);
}

    maps.prototype.__generateJumpInfo = function (sx, sy, ex, ey, time) {
    var dx = ex - sx, dy = ey - sy, distance = Math.round(Math.sqrt(dx * dx + dy * dy));
    var jump_peak = 6 + distance, jump_count = jump_peak * 2;
    time /= Math.max(core.status.replay.speed, 1)
    return {
        x: sx, y: sy, ex: ex, ey: ey, px: 32 * sx, py: 32 * sy, opacity: 1,
        jump_peak: jump_peak, jump_count: jump_count,
        step: 0, per_time: time / jump_count
    };
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



maps.prototype._moveJumpSprite_finished = function(obj, block, info, callback){
    if(info.keep){
        this._recoverTempBlock(block);
        block.notify("draw");
        if(callback)callback();
    }else{///
        var over = function(){
            if(block.remove){
                block.notify("remove");
                // block.remove(obj); // 图块销毁，移除观察者
            }
            if(callback)callback();
        }
        if(info.animate){
            block.notify("hide",{
                time: 500,
                callback: over
            });
        }else{
            over();
        }
    }
}

maps.prototype._moveJumpBlock_finished = function (blockInfo, block, info, animate, callback) {
    if(info.keep){
        this._recoverTempBlock(block);
        if(callback)callback();
    }else{///
        this.hideBlockAnimate(blockInfo,500,function(){
            if(blockInfo.sprite.destroy)
                blockInfo.sprite.destroy();
            if(callback)callback();
        })
    }
    return;

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

maps.prototype._showHideSpriteAnimate = function(obj, time, fade, callback){
    if(obj.addAnimateInfo){ //
        obj.alpha = fade>0?0:1;
        obj.stopAnimate();
        var originSpeed = obj.animate ? obj.animate.speed : 30; // 30帧
        obj.addAnimateInfo({
                'fade': fade,
                'fadeFreq': time/100,
                'callback': callback,
                'speed': originSpeed,
            }
        );
    }
}

maps.prototype._showHideAnimate = function(blockInfo, time, fade, callback){
    if(blockInfo.sprite.addAnimateInfo){
        blockInfo.sprite.alpha = fade>0?0:1;
        blockInfo.sprite.stopAnimate();
        var originSpeed = blockInfo.sprite.animate ? blockInfo.sprite.animate.speed : 30; // 30帧
        blockInfo.sprite.addAnimateInfo({
                'fade': fade,
                'fadeFreq': time/100,
                'callback': callback,
                'speed': originSpeed,
            }
        );
    }
}


////// 显示/隐藏某个块时的动画效果 //////
maps.prototype.animateBlock = function (loc, type, time, callback) {
    var isHide = type == 'hide';
    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];
    // --- 检测所有是0的点
    var list = this._animateBlock_getList(loc);
    if (list.length == 0) {
        if (callback) callback();
        return;
    }
    var ct = list.length;
    list.forEach(function(l){
        core.drawBlock(l.block); // 首先保证图存在
        l.block.notify(isHide?'hide':'show',{
            'time': time,
            'callback': function(){
                ct -= 1;
                l.block.notify('stop');
                if (isHide) {
                    l.block.notify('remove');
                    var idx = core.status.thisMap.blocks.indexOf(l.block);
                    if(idx>=0)core.status.thisMap.blocks.splice(idx, 1);
                }//core.removeBlock(l.x, l.y);
                else core.showBlock(l.x, l.y);
                if(ct==0 && callback)
                    callback();
            }
        });
    });
    return;

    this._animateBlock_drawList(list, isHide ? 1 : 0);
    time /= Math.max(core.status.replay.speed, 1)
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
                if (t.blockInfo)
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
        if (blockInfo == null) {
            list.push({ 'x': t[0], 'y': t[1] });
            return;
        }
        var canvases = core.maps._initDetachedBlock(blockInfo, t[0], t[1], block.event.displayDamage !== false);

        list.push({
            'x': t[0], 'y': t[1], 'blockInfo': blockInfo, 'canvases': canvases, 'block': block
        });

    });
    return list;
}

maps.prototype._animateBlock_drawList = function (list, opacity) {
    list.forEach(function (t) {
        if (t.blockInfo)
            core.maps._moveDetachedBlock(t.blockInfo, t.x * 32, t.y * 32, opacity, t.canvases);
    });
}

// ------ 全局动画控制，动画绘制 ------ //

////// 添加一个全局动画 //////
maps.prototype.addGlobalAnimate = function (block) {
    if (!block.event || block.event.animate == null) return;
    if (block.event.cls == 'autotile') {
        var id = block.event.id, img = core.material.images.autotile[id];
        //if (!img|| img.width == 96) return;
        // core.status.autotileAnimateObjs.blocks.push(block);
    }
    else {
        if (!block.event.animate || block.event.animate == 1) return;
        block.event.sprite.addAnimateInfo({speed:30}); // TODO:全局动画速度控制
        //core.status.globalAnimateObjs.push(block);
    }
}

////// 删除一个或所有全局动画 //////
maps.prototype.removeGlobalAnimate = function (x, y, name) {
    // 没有定义xy，则全部删除
    if (x == null || y == null) {
        core.status.globalAnimateStatus = 0;
        (core.status.globalAnimateObjs||[]).forEach(function(block){
            core.scenes.mapScene.getLayer('event').deleteObj(block.event.sprite); //TODO: 取消全局动画列表
        })
        core.status.globalAnimateObjs = [];
        core.status.autotileAnimateObjs = {"blocks": [], "map": null, "bgmap": null, "fgmap": null};
        core.status.floorAnimateObjs = [];
        return;
    }

    core.status.globalAnimateObjs = core.status.globalAnimateObjs.filter(function (block) {
        var ans = block.x != x || block.y != y || block.name != name;
        if(!ans)core.scenes.mapScene.getLayer('event').deleteObj(block.event.sprite);
        return ans;
    });

    // 检查Autotile
    if (core.status.autotileAnimateObjs.blocks) {
        core.status.autotileAnimateObjs.blocks = core.status.autotileAnimateObjs.blocks.filter(function (block) {
            return block.x != x || block.y != y || block.name != name;
        });
        //core.status.autotileAnimateObjs.map[y][x] = 0;
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
    name = core.getMappedName(name);

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

    var blk = core.getBlock(x,y);
    var sprite = null;
    if(blk && blk.block.observers && blk.block.observers().length>0){
        sprite = blk.block.observers()[0];
    }
    var id = setTimeout(null);
    core.status.animateObjs.push({
        "id": id,
        "animate": animate,
        "centerX": centerX,
        "centerY": centerY,
        "index": 0,
        "sprite": sprite,
        "callback": callback
    });

    return id;
}


///// 更新动画帧
maps.prototype._updateAnimateFrame = function(obj){
    if(obj.sprite){
        obj.centerX = obj.sprite.x;
        obj.centerY = obj.sprite.y;
    }
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
            if (doCallback) {
                (function (callback) {
                    setTimeout(function () {
                        if (callback) callback();
                    });
                })(obj.callback);
            }
        }
    }
    core.status.animateObjs = core.status.animateObjs.filter(function (x) { return x.id != id });
    if (core.status.animateObjs.length == 0)
        core.clearMap('animate');
}
