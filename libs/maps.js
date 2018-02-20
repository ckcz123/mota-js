function maps() {}
maps.prototype.init = function() {
    this.blocksInfo = maps_90f36752_8815_4be8_b32b_d7fad1d0542e;
    //delete(maps_90f36752_8815_4be8_b32b_d7fad1d0542e);
}

////// 加载某个楼层（从剧本或存档中） //////
maps.prototype.loadFloor = function (floorId, map) {
    var floor = core.floors[floorId];
    var content = {};
    content['floorId'] = floor.floorId;
    content['name'] = floor.name;
    content['title'] = floor.title;
    content['canFlyTo'] = floor.canFlyTo;
    if (!core.isset(map)) map=floor.map;
    var mapIntoBlocks = function(map,maps,floor){
        var blocks = [];
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 13; j++) {
                var block = maps.getBlock(j, i, map[i][j]);
                maps.addInfo(block);
                maps.addEvent(block,j,i,floor.events[j+","+i])
                maps.addChangeFloor(block,j,i,floor.changeFloor[j+","+i]);
                if (core.isset(block.event)) blocks.push(block);
            }
        }
        return blocks;
    }
    if (main.mode=='editor'){
        main.editor.mapIntoBlocks = function(map,floor){
            return mapIntoBlocks(map,core.maps,floor);
        }
    }
    // 事件处理
    content['blocks'] = mapIntoBlocks(map,this,floor);
    return content;
}

////// 数字和ID的对应关系 //////
maps.prototype.getBlock = function (x, y, id) {
    var enable=null;
    id = ""+id;
    if (id.length>2) {
        if (id.indexOf(":f")==id.length-2) {
            id = id.substring(0, id.length - 2);
            enable = false;
        }
        else if (id.indexOf(":t")==id.length-2) {
            id = id.substring(0, id.length - 2);
            enable = true;
        }
    }
    id=parseInt(id);
    var tmp = {'x': x, 'y': y, 'id': id};
    if (enable!=null) tmp.enable = enable;

    if (id in this.blocksInfo) tmp.event = JSON.parse(JSON.stringify(this.blocksInfo[id]));

    return tmp;
}

////// 添加一些信息到block上 //////
maps.prototype.addInfo = function (block) {
    if (core.isset(block.event)) {
        if (block.event.cls == 'enemys' && block.event.trigger==undefined) {
            block.event.trigger = 'battle';
        }
        if (block.event.cls == 'items' && block.event.trigger==undefined) {
            block.event.trigger = 'getItem';
        }
        if (block.event.noPass == undefined) {
            if (block.event.cls=='enemys' || block.event.cls=='terrains' || block.event.cls=='npcs') {
                block.event.noPass = true;
            }
        }
        if (block.event.animate == undefined) {
            if (block.event.cls=='enemys' || block.event.cls=='npcs') {
                block.event.animate = 2;
            }
            if (block.event.cls == 'animates') {
                block.event.animate = 4;
            }
        }
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
    if (!core.isset(block.enable) && core.isset(event.enable)) {
        block.enable=event.enable;
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
        if (key!="enable" && key!="trigger") {
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

    var thisFloor = maps[floorId];

    var blocks = [];
    for (var x=0;x<13;x++) {
        blocks[x]=[];
        for (var y=0;y<13;y++) {
            blocks[x].push(0);
        }
    }
    thisFloor.blocks.forEach(function (block) {
        if (core.isset(block.enable)) {
            if (block.enable) blocks[block.y][block.x] = block.id+":t";
            else blocks[block.y][block.x] = block.id+":f";
        }
        else blocks[block.y][block.x] = block.id;
    });
    return blocks;
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
maps.prototype.getMapArray = function (blockArray){

    var blocks = [];
    for (var x=0;x<13;x++) {
        blocks[x]=[];
        for (var y=0;y<13;y++) {
            blocks[x].push(0);
        }
    }
    blockArray.forEach(function (block) {
        if (!(core.isset(block.enable) && !block.enable))
            blocks[block.y][block.x] = block.id;
    });
    return blocks;
}

main.instance.maps = new maps();