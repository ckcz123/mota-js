editor_mode = function (editor) {
    var core = editor.core;

    function editor_mode() {
        this.ids = {
            'loc': 'left2',
            'enemyitem': 'left3',
            'floor': 'left4',
            'tower': 'left5',
            'functions': 'left8',

            'map': 'left',
            'appendpic': 'left1',

            'commonevent': 'left9',
            'plugins': 'left10',
        }
        this._ids = {}
        this.dom = {}
        this.actionList = [];
        this.mode = 'tower'; // 初始默认显示全塔属性
        this.info = {};
        this.appendPic = {};
        this.doubleClickMode = 'change';
    }

    editor_mode.prototype.init = function (callback) {
        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.init_dom_ids = function (callback) {

        Object.keys(editor_mode.ids).forEach(function (v) {
            editor_mode.dom[v] = document.getElementById(editor_mode.ids[v]);
            editor_mode._ids[editor_mode.ids[v]] = v;
        });

        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.indent = function (field) {
        var num = '\t';
        if (field.indexOf("['main']") === 0) return 0;
        if (field === "['special']") return 0;
        return num;
    }

    editor_mode.prototype.addAction = function (action) {
        editor_mode.actionList.push(action);
    }

    editor_mode.prototype.doActionList = function (mode, actionList, callback) {
        if (actionList.length == 0) return;
        printf('修改中...');
        var cb = function (objs_) {
            if (objs_.slice(-1)[0] != null) {
                printe(objs_.slice(-1)[0]);
                throw (objs_.slice(-1)[0])
            }
            ; 
            var str = '修改成功！';
            if (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.name == 'template')
                str += '<br/>请注意：全塔属性的name尚未修改，请及时予以设置。';
            if (mode == 'enemyitem') {
                if (editor.info && editor.info.idnum) {
                    var block = editor.core.maps.blocksInfo[editor.info.idnum];
                    if (block.doorInfo != null && block.doorInfo.keys != null && Object.keys(block.doorInfo.keys).length > 0
                        && block.trigger != 'openDoor') {
                        str += "<br/>你修改了门信息，但触发器未改成openDoor，请修改否则无法撞击开门。"
                    }
                }
                if (editor_mode.info.images == 'enemys' || editor_mode.info.images == 'enemy48') {
                    if (core.getFaceDownId(editor_mode.info.id) != editor_mode.info.id) {
                        str += "<br/>绑定行走图朝向后只需要对应设置朝下怪物的属性，会自动同步而无需修改其他朝向的属性。"
                    }
                }
            }
            printf(str);
            if (callback) callback();
        }
        switch (mode) {
            case 'loc':
                editor.file.editLoc(editor_mode.pos.x, editor_mode.pos.y, actionList, function (objs_) {
                    cb(objs_);
                    editor.drawPosSelection();
                });
                break;
            case 'enemyitem':
                if (editor_mode.info.images == 'enemys' || editor_mode.info.images == 'enemy48') {
                    editor.file.editEnemy(editor_mode.info.id, actionList, cb);
                } else if (editor_mode.info.images == 'items') {
                    editor.file.editItem(editor_mode.info.id, actionList, cb);
                } else {
                    editor.file.editMapBlocksInfo(editor_mode.info.idnum, actionList, cb);
                }
                break;
            case 'floor':
                editor.file.editFloor(actionList, cb);
                break;
            case 'tower':
                editor.file.editTower(actionList, cb);
                break;
            case 'functions':
                editor.file.editFunctions(actionList, cb);
                break;
            case 'commonevent':
                editor.file.editCommonEvent(actionList, cb);
                break;
            case 'plugins':
                editor.file.editPlugins(actionList, cb);
                break;
            default:
                break;
        }
    }

    editor_mode.prototype.onmode = function (mode, callback) {
        if (editor_mode.mode != mode) {
            if (mode === 'save') editor_mode.doActionList(editor_mode.mode, editor_mode.actionList, callback);
            if (editor_mode.mode === 'nextChange' && mode) editor_mode.showMode(mode);
            if (mode !== 'save') editor_mode.mode = mode;
            editor_mode.actionList = [];
        }
    }

    editor_mode.prototype.showMode = function (mode) {
        for (var name in this.dom) {
            editor_mode.dom[name].style = 'z-index:-1;opacity: 0;';
        }
        editor_mode.dom[mode].style = '';
        editor_mode.doubleClickMode = 'change';
        // clear
        editor.drawEventBlock();
        if (editor_mode[mode]) editor_mode[mode]();
        editor.dom.editModeSelect.value = mode;
        if (!selectBox.isSelected()) editor.uifunctions.showTips();
    }

    editor_mode.prototype.change = function (value) {
        editor_mode.onmode('nextChange');
        editor_mode.onmode(value);
        if (editor.isMobile) editor.showdataarea(false);
    }


    editor_mode.prototype.checkUnique = function (thiseval) {
        if (!(thiseval instanceof Array)) return false;
        var map = {};
        for (var i = 0; i < thiseval.length; ++i) {
            if (map[thiseval[i]]) {
                alert("警告：存在重复定义！");
                return false;
            }
            map[thiseval[i]] = true;
        }
        return true;
    }

    editor_mode.prototype.checkFloorIds = function (thiseval) {
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
        return true
    }

    editor_mode.prototype.checkImages = function (thiseval, directory) {
        if (!directory) return true;
        if (!editor_mode.checkUnique(thiseval)) return false;
        fs.readdir(directory, function (err, data) {
            if (err) {
                printe(err);
                throw Error(err);
            }
            var notExist = null;
            thiseval.map(function (v) {
                var name = v.indexOf('.') < 0 ? (v+'.png') : v;
                if (data.indexOf(name) < 0) notExist = name;
                return name;
            });
            if (notExist) {
                alert('警告！图片' + notExist + '不存在！保存可能导致工程无法打开，请及时修改！');
            }
        });
        return true;
    }

    editor_mode.prototype.changeDoubleClickModeByButton = function (mode) {
        ({
            delete: function () {
                printf('下一次双击表格的项删除，切换下拉菜单可取消；编辑后需刷新浏览器生效。');
                editor_mode.doubleClickMode = mode;
            },
            add: function () {
                printf('下一次双击表格的项则在同级添加新项，切换下拉菜单可取消；编辑后需刷新浏览器生效。');
                editor_mode.doubleClickMode = mode;
            }
        }[mode])();
    }

    /////////////////////////////////////////////////////////////////////////////

    editor_mode.prototype.loc = function (callback) {
        //editor.pos={x: 0, y: 0};
        if (!core.isset(editor.pos)) return;
        editor_mode.pos = editor.pos;
        document.getElementById('pos_a6771a78_a099_417c_828f_0a24851ebfce').innerText = editor_mode.pos.x + ',' + editor_mode.pos.y;

        var objs = [];
        editor.file.editLoc(editor_mode.pos.x, editor_mode.pos.y, [], function (objs_) {
            objs = objs_;
            //console.log(objs_)
        });
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_3d846fc4_7644_44d1_aa04_433d266a73df').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);
        editor.drawPosSelection();
        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.enemyitem = function (callback) {
        //editor.info=editor.ids[editor.indexs[201]];
        if (!core.isset(editor.info)) return;

        if (Object.keys(editor.info).length !== 0 && editor.info.idnum != 17) editor_mode.info = editor.info;//避免editor.info被清空导致无法获得是物品还是怪物

        if (!core.isset(editor_mode.info.id)) {
            // document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML = '';
            document.getElementById('newIdIdnum').style.display = 'block';
            document.getElementById('enemyItemTable').style.display = 'none';
            document.getElementById('changeId').style.display = 'none';
            return;
        }

        document.getElementById('newIdIdnum').style.display = 'none';
        document.getElementById('enemyItemTable').style.display = 'block';
        document.getElementById('changeId').style.display = 'block';

        var objs = [];
        if (editor_mode.info.images == 'enemys' || editor_mode.info.images == 'enemy48') {
            editor.file.editEnemy(editor_mode.info.id, [], function (objs_) {
                objs = objs_;
                //console.log(objs_)
            });
        } else if (editor_mode.info.images == 'items') {
            editor.file.editItem(editor_mode.info.id, [], function (objs_) {
                objs = objs_;
                //console.log(objs_)
            });
        } else {
            /* document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML='';
            return; */
            editor.file.editMapBlocksInfo(editor_mode.info.idnum, [], function (objs_) {
                objs = objs_;
                //console.log(objs_)
            });
        }
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);

        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.floor = function (callback) {
        var objs = [];
        editor.file.editFloor([], function (objs_) {
            objs = objs_;
            //console.log(objs_)
        });
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_4a3b1b09_b2fb_4bdf_b9ab_9f4cdac14c74').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);
        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.tower = function (callback) {
        var objs = [];
        editor.file.editTower([], function (objs_) {
            objs = objs_;
            //console.log(objs_)
        });
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_b6a03e4c_5968_4633_ac40_0dfdd2c9cde5').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);
        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.functions = function (callback) {
        var objs = [];
        editor.file.editFunctions([], function (objs_) {
            objs = objs_;
            //console.log(objs_)
        });
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_e260a2be_5690_476a_b04e_dacddede78b3').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);
        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.commonevent = function (callback) {
        var objs = [];
        editor.file.editCommonEvent([], function (objs_) {
            objs = objs_;
            //console.log(objs_)
        });
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_b7bf0124_99fd_4af8_ae2f_0017f04a7c7d').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);
        if (Boolean(callback)) callback();
    }

    editor_mode.prototype.plugins = function (callback) {
        var objs = [];
        editor.file.editPlugins([], function (objs_) {
            objs = objs_;
            //console.log(objs_)
        });
        //只查询不修改时,内部实现不是异步的,所以可以这么写
        var tableinfo = editor.table.objToTable(objs[0], objs[1]);
        document.getElementById('table_e2c034ec_47c6_48ae_8db8_4f8f32fea2d6').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);
        if (Boolean(callback)) callback();
    }

    /////////////////////////////////////////////////////////////////////////////

    /**
     * editor.dom.editModeSelect.onchange
     */
    editor_mode.prototype.editModeSelect_onchange = function () {
        editor_mode.change(editor.dom.editModeSelect.value);
    }

    editor_mode.prototype.listen = function (callback) {
        // 移动至 editor_listen.js -> editor.constructor.prototype.mode_listen
    }

    var editor_mode = new editor_mode();
    editor_mode.init_dom_ids();

    return editor_mode;
}
//editor_mode = editor_mode(editor);