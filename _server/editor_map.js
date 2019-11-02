"use strict";
/**
 * editor_map.js 地图编辑数据操作
 */

var editor_map_wrapper = function(editor, callback) {

class mapEditor {

    floorIds = [];
    floors = {};
    currentFloorId;
    currentFloorData = {};
    pos = {x: 0, y: 0};

    constructor(callback) {
        this.floorIds = editor.data.floorIds;
        editor.loadJsByList('project/floors/', editor.data.floorIds, function() {
            editor.map.floors = main.floors;
            callback();
        });
    }
    
    vaildate(floorId) {
        if (!editor.util.isset(floorId)) {
            printe('请输入要修改到的floorId');
            return false;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
            printe("楼层名 " + floorId + " 不合法！请使用字母、数字、下划线，且不能以数字开头！");
            return false;
        }
        if (editor.map.floorIds.indexOf(floorId) >= 0) {
            printe("楼层名 " + floorId + " 已存在！");
            return false;
        }
        return true;
    }
    
    createNewMap(name, width, height) {
        
        if (!this.vaildate(toId)) return;
        if (!core.isset(width) || !core.isset(height) || width < core.__SIZE__ || height < core.__SIZE__) {
            printe("新建地图的宽高都不得小于" + core.__SIZE__);
            return;
        }
    
        editor_mode.onmode('');
        editor.file.saveNewFile(name, function (err) {
            if (err) {
                printe(err);
                throw (err)
            }
            editor.mapEditor.floorIds.push(name);
            editor.file.editTower([['change', "['main']['floorIds']", editor.map.floorIds]], function (objs_) {//console.log(objs_);
                if (objs_.slice(-1)[0] != null) {
                    printe(objs_.slice(-1)[0]);
                    throw (objs_.slice(-1)[0])
                }
                ; printe('新建成功,请F5刷新编辑器生效');
            });
        });
    }

    changeFloorId(toId) {
    
        if (!this.vaildate(toId)) return;
        var currentFloorId = this.currentFloorId;
        this.currentFloorId = floorId;
        this.currentFloorData.floorId = floorId;
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw (err);
            }
            editor.map.floorIds[editor.map.floorIds.indexOf(currentFloorId)] = floorId;
            editor.file.editTower([['change', "['main']['floorIds']", editor.map.floorIds]], function (objs_) {//console.log(objs_);
                if (objs_.slice(-1)[0] != null) {
                    printe(objs_.slice(-1)[0]);
                    throw (objs_.slice(-1)[0])
                }
                alert("修改floorId成功，需要刷新编辑器生效。\n请注意，原始的楼层文件没有删除，请根据需要手动删除。");
            });
        });
    }

    checkFloorIds(thiseval) {
        if (!editor_mode.checkUnique(thiseval)) return false;
        var oldvalue = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds;
        fs.readdir('project/floors', function (err, data) {
            if (err) {
                printe(err);
                throw Error(err);
            }
            var newfiles = thiseval.map(function (v) { return v + '.js' });
            var notExist = '';
            for (var name, ii = 0; name = newfiles[ii]; ii++) {
                if (data.indexOf(name) === -1) notExist = name;
            }
            if (notExist) {
                var discard = confirm('文件' + notExist + '不存在, 保存会导致工程无法打开, 是否放弃更改');
                if (discard) {
                    editor.file.editTower([['change', "['main']['floorIds']", oldvalue]], function (objs_) {//console.log(objs_);
                        if (objs_.slice(-1)[0] != null) {
                            printe(objs_.slice(-1)[0]);
                            throw (objs_.slice(-1)[0])
                        }
                        ; printe('已放弃floorIds的修改，请F5进行刷新');
                    });
                }
            }
        });
        return true;
    }

    changeFloor(toId) {
        if (!editor.util.isset(toId)) return;
        this.currentFloorId = toId;
        this.currentFloorData = this.floors[toId];
    }

    setFloorList(from, to) {
        var t = this.floorIds[from];
        this.floorIds[from] = this.floorIds[to];
        this.floorIds[to] = t;
        editor.file.editTower([['change', "['main']['floorIds']", this.floorIds]], function (objs_) {//console.log(objs_);
            if (objs_.slice(-1)[0] != null) {
                printe(objs_.slice(-1)[0]);
                throw (objs_.slice(-1)[0])
            }
        });
    }
}

editor.map = new mapEditor(callback);

}