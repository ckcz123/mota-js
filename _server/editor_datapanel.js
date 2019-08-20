editor_datapanel_wrapper = function (editor) {

    ///////////////////////////////////////////////////////////////////////
    //////////////////// 地图编辑 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    editor.uifunctions.newMap_func = function () {

        var newMap = document.getElementById('newMap');
        var newFileName = document.getElementById('newFileName');
        newMap.onclick = function () {
            if (!newFileName.value) return;
            if (core.floorIds.indexOf(newFileName.value) >= 0) {
                printe("该楼层已存在！");
                return;
            }
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newFileName.value)) {
                printe("楼层名不合法！请使用字母、数字、下划线，且不能以数字开头！");
                return;
            }
            var width = parseInt(document.getElementById('newMapWidth').value);
            var height = parseInt(document.getElementById('newMapHeight').value);
            if (!core.isset(width) || !core.isset(height) || width < core.__SIZE__ || height < core.__SIZE__ || width * height > 1000) {
                printe("新建地图的宽高都不得小于" + core.__SIZE__ + "，且宽高之积不能超过1000");
                return;
            }

            editor_mode.onmode('');
            editor.file.saveNewFile(newFileName.value, function (err) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                core.floorIds.push(newFileName.value);
                editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw (objs_.slice(-1)[0])
                    }
                    ; printe('新建成功,请F5刷新编辑器生效');
                });
            });
        }

    }


    editor.uifunctions.createNewMaps_func = function () {
        var newMaps = document.getElementById('newMaps');
        var newFloors = document.getElementById('newFloors');
        newMaps.onclick = function () {
            if (newFloors.style.display == 'none') newFloors.style.display = 'block';
            else newFloors.style.display = 'none';
        }

        var createNewMaps = document.getElementById('createNewMaps');
        createNewMaps.onclick = function () {
            var floorIds = document.getElementById('newFloorIds').value;
            if (!floorIds) return;
            var from = parseInt(document.getElementById('newMapsFrom').value),
                to = parseInt(document.getElementById('newMapsTo').value);
            if (!core.isset(from) || !core.isset(to) || from > to || from < 0 || to < 0) {
                printe("请输入有效的起始和终止楼层");
                return;
            }
            if (to - from >= 100) {
                printe("一次最多创建99个楼层");
                return;
            }
            var floorIdList = [];
            for (var i = from; i <= to; i++) {
                var floorId = floorIds.replace(/\${(.*?)}/g, function (word, value) {
                    return eval(value);
                });
                if (core.floorIds.indexOf(floorId) >= 0) {
                    printe("要创建的楼层 " + floorId + " 已存在！");
                    return;
                }
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
                    printe("楼层名 " + floorId + " 不合法！请使用字母、数字、下划线，且不能以数字开头！");
                    return;
                }
                if (floorIdList.indexOf(floorId) >= 0) {
                    printe("尝试重复创建楼层 " + floorId + " ！");
                    return;
                }
                floorIdList.push(floorId);
            }

            var width = parseInt(document.getElementById('newMapsWidth').value);
            var height = parseInt(document.getElementById('newMapsHeight').value);
            if (!core.isset(width) || !core.isset(height) || width < core.__SIZE__ || height < core.__SIZE__ || width * height > 1000) {
                printe("新建地图的宽高都不得小于" + core.__SIZE__ + "，且宽高之积不能超过1000");
                return;
            }
            editor_mode.onmode('');

            editor.file.saveNewFiles(floorIdList, from, to, function (err) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                core.floorIds = core.floorIds.concat(floorIdList);
                editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw (objs_.slice(-1)[0])
                    }
                    ; printe('批量创建 ' + floorIdList[0] + '~' + floorIdList[floorIdList.length - 1] + ' 成功,请F5刷新编辑器生效');
                });
            });
        }

    }



    ///////////////////////////////////////////////////////////////////////
    //////////////////// 地图选点 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 图块属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    editor.uifunctions.newIdIdnum_func = function () {


        var newIdIdnum = document.getElementById('newIdIdnum');
        newIdIdnum.children[2].onclick = function () {
            if (newIdIdnum.children[0].value && newIdIdnum.children[1].value) {
                var id = newIdIdnum.children[0].value;
                var idnum = parseInt(newIdIdnum.children[1].value);
                if (!core.isset(idnum)) {
                    printe('不合法的idnum');
                    return;
                }
                if (!/^[0-9a-zA-Z_]+$/.test(id)) {
                    printe('不合法的id，请使用字母、数字或下划线')
                    return;
                }
                editor.file.changeIdAndIdnum(id, idnum, editor_mode.info, function (err) {
                    if (err) {
                        printe(err);
                        throw (err)
                    }
                    printe('添加id和idnum成功,请F5刷新编辑器');
                });
            } else {
                printe('请输入id和idnum');
            }
        }

        newIdIdnum.children[4].onclick = function () {
            editor.file.autoRegister(editor_mode.info, function (err) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                printe('该列所有剩余项全部自动注册成功,请F5刷新编辑器');
            })
        }
    }

    editor.uifunctions.changeId_func = function () {
        var changeId = document.getElementById('changeId');
        changeId.children[1].onclick = function () {
            var id = changeId.children[0].value;
            if (id) {
                if (!/^[0-9a-zA-Z_]+$/.test(id)) {
                    printe('不合法的id，请使用字母、数字或下划线')
                    return;
                }
                editor.file.changeIdAndIdnum(id, null, editor_mode.info, function (err) {
                    if (err) {
                        printe(err);
                        throw (err);
                    }
                    printe('修改id成功,请F5刷新编辑器');
                });
            } else {
                printe('请输入要修改到的ID');
            }
        }
    }











    ///////////////////////////////////////////////////////////////////////
    //////////////////// 楼层属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////



    editor.uifunctions.changeFloorId_func = function () {

        var changeFloorId = document.getElementById('changeFloorId');
        changeFloorId.children[1].onclick = function () {
            var floorId = changeFloorId.children[0].value;
            if (floorId) {
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
                    printe("楼层名 " + floorId + " 不合法！请使用字母、数字、下划线，且不能以数字开头！");
                    return;
                }
                if (main.floorIds.indexOf(floorId) >= 0) {
                    printe("楼层名 " + floorId + " 已存在！");
                    return;
                }
                var currentFloorId = editor.currentFloorId;
                editor.currentFloorId = floorId;
                editor.currentFloorData.floorId = floorId;
                editor.file.saveFloorFile(function (err) {
                    if (err) {
                        printe(err);
                        throw (err);
                    }
                    core.floorIds[core.floorIds.indexOf(currentFloorId)] = floorId;
                    editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
                        if (objs_.slice(-1)[0] != null) {
                            printe(objs_.slice(-1)[0]);
                            throw (objs_.slice(-1)[0])
                        }
                        alert("修改floorId成功，需要刷新编辑器生效。\n请注意，原始的楼层文件没有删除，请根据需要手动删除。");
                        window.location.reload();
                    });
                });
            } else {
                printe('请输入要修改到的floorId');
            }
        }
    }









    ///////////////////////////////////////////////////////////////////////
    //////////////////// 全塔属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 脚本编辑 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 追加素材 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 公共事件 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 插件编写 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////














}