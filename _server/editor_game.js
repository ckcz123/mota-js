editor_game_wrapper = function (editor, main, core) {

    editor_game = function () {

    }

    editor_game.prototype.fixFunctionInGameData = function () {
        core.floors = JSON.parse(JSON.stringify(core.floors, function (_k, v) {
            if (v instanceof Function) {
                return v.toString()
            } else return v
        }));
        core.data = JSON.parse(JSON.stringify(core.data, function (_k, v) {
            if (v instanceof Function) {
                return v.toString()
            } else return v
        }));
        data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = JSON.parse(JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d, function (_k, v) {
            if (v instanceof Function) {
                return v.toString()
            } else return v
        }));
    }

    editor_game.prototype.idsInit = function (maps, icons) {
        editor.ids = [0];
        editor.indexs = [];
        var MAX_NUM = 0;
        var keys=Object.keys(maps_90f36752_8815_4be8_b32b_d7fad1d0542e);
        for(var ii=0;ii<keys.length;ii++){
            var v=~~keys[ii];
            if(v>MAX_NUM && v<core.icons.tilesetStartOffset)MAX_NUM=v;
        }
        editor.MAX_NUM=MAX_NUM;
        var getInfoById = function (id) {
            var block = maps.initBlock(0, 0, id);
            if (hasOwnProp(block, 'event')) {
                return block;
            }
        }
        var point = 0;
        for (var i = 0; i <= MAX_NUM; i++) {
            var indexBlock = getInfoById(i);
            editor.indexs[i] = [];
            if (indexBlock) {
                var id = indexBlock.event.id;
                var indexId = indexBlock.id;
                var allCls = Object.keys(icons);
                if(i==17){
                    editor.ids.push({'idnum': 17, 'id': id, 'images': 'terrains'});
                    point++;
                    editor.indexs[i].push(point);
                    continue;
                }
                for (var j = 0; j < allCls.length; j++) {
                    if (id in icons[allCls[j]]) {
                        editor.ids.push({'idnum': indexId, 'id': id, 'images': allCls[j], 'y': icons[allCls[j]][id]});
                        point++;
                        editor.indexs[i].push(point);
                    }
                }
            }
        }
        editor.indexs[0] = [0];
    
        var startOffset = core.icons.tilesetStartOffset;
        for (var i in core.tilesets) {
            var imgName = core.tilesets[i];
            var img = core.material.images.tilesets[imgName];
            var width = Math.floor(img.width/32), height = Math.floor(img.height/32);
            if(img.width%32 || img.height%32){
                alert(imgName+'的长或宽不是32的整数倍, 请修改后刷新页面');
            }
            if(img.width*img.height > 32*32*3000){
                alert(imgName+'上的图块数量超过了3000，请修改后刷新页面');
            }
            for (var id=startOffset; id<startOffset+width*height;id++) {
                var x = (id-startOffset)%width, y = parseInt((id-startOffset)/width);
                var indexBlock = getInfoById(id);
                editor.ids.push({'idnum': id, 'id': indexBlock.event.id, 'images': imgName, "x": x, "y": y, isTile: true});
                point++;
                editor.indexs[id]=[point];
            }
            startOffset += core.icons.tilesetStartOffset;
        }
    }

    editor_game.prototype.fetchMapFromCore = function(){
        var mapArray = core.maps.saveMap(core.status.floorId);
        editor.map = mapArray.map(function (v) {
            return v.map(function (v) {
                var x = parseInt(v), y = editor.indexs[x];
                if (y == null) {
                    printe("素材数字"+x+"未定义。是不是忘了注册，或者接档时没有覆盖icons.js和maps.js？");
                    y = [0];
                }
                return editor.ids[y[0]]
            })
        });
        editor.currentFloorId = core.status.floorId;
        editor.currentFloorData = core.floors[core.status.floorId];
        for(var ii=0,name;name=['bgmap','fgmap'][ii];ii++){
            var mapArray = editor.currentFloorData[name];
            if(!mapArray || JSON.stringify(mapArray)==JSON.stringify([])){//未设置或空数组
                //与editor.map同形的全0
                mapArray=eval('['+Array(editor.map.length+1).join('['+Array(editor.map[0].length+1).join('0,')+'],')+']');
            }
            editor[name]=mapArray.map(function (v) {
                return v.map(function (v) {
                    var x = parseInt(v), y = editor.indexs[x];
                    if (y == null) {
                        printe("素材数字"+x+"未定义。是不是忘了注册，或者接档时没有覆盖icons.js和maps.js？");
                        y = [0];
                    }
                    return editor.ids[y[0]]
                })
            });
        }
    }


    editor.constructor.prototype.game = new editor_game();
}
//editor_game_wrapper(editor);