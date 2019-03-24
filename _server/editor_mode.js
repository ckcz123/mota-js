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
        this.mode = '';
        this.info = {};
        this.appendPic = {};
        this.doubleClickMode='change';
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

    editor_mode.prototype.doActionList = function (mode, actionList) {
        if (actionList.length == 0) return;
        printf('修改中...');
        var cb=function(objs_){
            if (objs_.slice(-1)[0] != null) {
                printe(objs_.slice(-1)[0]);
                throw(objs_.slice(-1)[0])
            }
            ;printf('修改成功');
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

    editor_mode.prototype.onmode = function (mode) {
        if (editor_mode.mode != mode) {
            if (mode === 'save') editor_mode.doActionList(editor_mode.mode, editor_mode.actionList);
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
        editor_mode.doubleClickMode='change';
        // clear
        editor.drawEventBlock();
        if (editor_mode[mode]) editor_mode[mode]();
        document.getElementById('editModeSelect').value = mode;
        var tips = tip_in_showMode;
        if (!selectBox.isSelected()) printf('tips: ' + tips[~~(tips.length * Math.random())]);
    }

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

        if (Object.keys(editor.info).length !== 0 && editor.info.idnum!=17) editor_mode.info = editor.info;//避免editor.info被清空导致无法获得是物品还是怪物

        if (!core.isset(editor_mode.info.id)) {
            // document.getElementById('table_a3f03d4c_55b8_4ef6_b362_b345783acd72').innerHTML = '';
            document.getElementById('enemyItemTable').style.display = 'none';
            document.getElementById('newIdIdnum').style.display = 'block';
            return;
        }

        document.getElementById('newIdIdnum').style.display = 'none';
        document.getElementById('enemyItemTable').style.display = 'block';

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

    editor_mode.prototype.listen = function (callback) {

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
                        throw(err)
                    }
                    printe('添加id的idnum成功,请F5刷新编辑器');
                });
            } else {
                printe('请输入id和idnum');
            }
        }

        newIdIdnum.children[4].onclick = function () {
            editor.file.autoRegister(editor_mode.info, function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                printe('该列所有剩余项全部自动注册成功,请F5刷新编辑器');
            })
        }

        var selectFloor = document.getElementById('selectFloor');
        editor.file.getFloorFileList(function (floors) {
            var outstr = [];
            floors[0].forEach(function (floor) {
                outstr.push(["<option value='", floor, "'>", floor, '</option>\n'].join(''));
            });
            selectFloor.innerHTML = outstr.join('');
            selectFloor.value = core.status.floorId;
            selectFloor.onchange = function () {
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                editor.changeFloor(selectFloor.value);
            }
        });

        var saveFloor = document.getElementById('saveFloor');
        editor_mode.saveFloor = function () {
            editor_mode.onmode('');
            editor.file.saveFloorFile(function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                ;printf('保存成功');
            });
        }
        saveFloor.onclick = editor_mode.saveFloor;

        var newMap = document.getElementById('newMap');
        var newFileName = document.getElementById('newFileName');
        newMap.onclick = function () {
            if (!newFileName.value) return;
            if (core.floorIds.indexOf(newFileName.value)>=0) {
                printe("该楼层已存在！");
                return;
            }
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newFileName.value)) {
                printe("楼层名不合法！请使用字母、数字、下划线，且不能以数字开头！");
                return;
            }
            var width = parseInt(document.getElementById('newMapWidth').value);
            var height = parseInt(document.getElementById('newMapHeight').value);
            if (!core.isset(width) || !core.isset(height) || width<core.__SIZE__ || height<core.__SIZE__ || width*height>1000) {
                printe("新建地图的宽高都不得小于"+core.__SIZE__+"，且宽高之积不能超过1000");
                return;
            }

            editor_mode.onmode('');
            editor.file.saveNewFile(newFileName.value, function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                core.floorIds.push(newFileName.value);
                editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printe('新建成功,请F5刷新编辑器生效');
                });
            });
        }

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
            if (!core.isset(from) || !core.isset(to) || from>to || from<0 || to<0) {
                printe("请输入有效的起始和终止楼层");
                return;
            }
            if (to-from >= 100) {
                printe("一次最多创建99个楼层");
                return;
            }
            var floorIdList = [];
            for (var i = from; i<=to; i++) {
                var floorId = floorIds.replace(/\${(.*?)}/g, function (word, value) {
                    return eval(value);
                });
                if (core.floorIds.indexOf(floorId)>=0) {
                    printe("要创建的楼层 "+floorId+" 已存在！");
                    return;
                }
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
                    printe("楼层名 "+floorId+" 不合法！请使用字母、数字、下划线，且不能以数字开头！");
                    return;
                }
                if (floorIdList.indexOf(floorId)>=0) {
                    printe("尝试重复创建楼层 "+floorId+" ！");
                    return;
                }
                floorIdList.push(floorId);
            }

            var width = parseInt(document.getElementById('newMapsWidth').value);
            var height = parseInt(document.getElementById('newMapsHeight').value);
            if (!core.isset(width) || !core.isset(height) || width<core.__SIZE__ || height<core.__SIZE__ || width*height>1000) {
                printe("新建地图的宽高都不得小于"+core.__SIZE__+"，且宽高之积不能超过1000");
                return;
            }
            editor_mode.onmode('');
            
            editor.file.saveNewFiles(floorIdList, from, to, function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                core.floorIds = core.floorIds.concat(floorIdList);
                editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printe('批量创建 '+floorIdList[0]+'~'+floorIdList[floorIdList.length-1]+' 成功,请F5刷新编辑器生效');
                });
            });
        }

        var ratio = 1;
        var appendPicCanvas = document.getElementById('appendPicCanvas');
        var bg = appendPicCanvas.children[0];
        var source = appendPicCanvas.children[1];
        var source_ctx=source.getContext('2d');
        var picClick = appendPicCanvas.children[2];
        var sprite = appendPicCanvas.children[3];
        var sprite_ctx=sprite.getContext('2d');
        var appendPicSelection = document.getElementById('appendPicSelection');
        
        [source_ctx,sprite_ctx].forEach(function(ctx){
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        })

        var selectAppend = document.getElementById('selectAppend');
        var selectAppend_str = [];
        ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48", "autotile"].forEach(function (image) {
            selectAppend_str.push(["<option value='", image, "'>", image, '</option>\n'].join(''));
        });
        selectAppend.innerHTML = selectAppend_str.join('');
        selectAppend.onchange = function () {

            var value = selectAppend.value;

            if (value == 'autotile') {
                editor_mode.appendPic.imageName = 'autotile';
                for (var jj=0;jj<4;jj++) appendPicSelection.children[jj].style = 'display:none';
                if (editor_mode.appendPic.img) {
                    sprite.style.width = (sprite.width = editor_mode.appendPic.img.width) / ratio + 'px';
                    sprite.style.height = (sprite.height = editor_mode.appendPic.img.height) / ratio + 'px';
                    sprite_ctx.clearRect(0, 0, sprite.width, sprite.height);
                    sprite_ctx.drawImage(editor_mode.appendPic.img, 0, 0);
                }
                return;
            }

            var ysize = selectAppend.value.indexOf('48') === -1 ? 32 : 48;
            editor_mode.appendPic.imageName = value;
            var img = core.material.images[value];
            editor_mode.appendPic.toImg = img;
            var num = ~~img.width / 32;
            editor_mode.appendPic.num = num;
            editor_mode.appendPic.index = 0;
            var selectStr = '';
            for (var ii = 0; ii < num; ii++) {
                appendPicSelection.children[ii].style = 'left:0;top:0;height:' + (ysize - 6) + 'px';
                selectStr += '{"x":0,"y":0},'
            }
            editor_mode.appendPic.selectPos = eval('[' + selectStr + ']');
            for (var jj = num; jj < 4; jj++) {
                appendPicSelection.children[jj].style = 'display:none';
            }
            sprite.style.width = (sprite.width = img.width) / ratio + 'px';
            sprite.style.height = (sprite.height = img.height + ysize) / ratio + 'px';
            sprite_ctx.drawImage(img, 0, 0);
        }
        selectAppend.onchange();

        var getPixel=editor.util.getPixel
        var setPixel=editor.util.setPixel

        var autoAdjust = function (image, callback) {
            var changed = false;

            // Step 1: 检测白底
            var tempCanvas = document.createElement('canvas').getContext('2d');
            tempCanvas.canvas.width = image.width;
            tempCanvas.canvas.height = image.height;
            tempCanvas.mozImageSmoothingEnabled = false;
            tempCanvas.webkitImageSmoothingEnabled = false;
            tempCanvas.msImageSmoothingEnabled = false;
            tempCanvas.imageSmoothingEnabled = false;
            tempCanvas.drawImage(image, 0, 0);
            var imgData = tempCanvas.getImageData(0, 0, image.width, image.height);
            var trans = 0, white = 0, black=0;
            for (var i=0;i<image.width;i++) {
                for (var j=0;j<image.height;j++) {
                    var pixel = getPixel(imgData, i, j);
                    if (pixel[3]==0) trans++;
                    if (pixel[0]==255 && pixel[1]==255 && pixel[2]==255 && pixel[3]==255) white++;
                    // if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) black++;
                }
            }
            if (white>black && white>trans*10 && confirm("看起来这张图片是以纯白为底色，是否自动调整为透明底色？")) {
                for (var i=0;i<image.width;i++) {
                    for (var j=0;j<image.height;j++) {
                        var pixel = getPixel(imgData, i, j);
                        if (pixel[0]==255 && pixel[1]==255 && pixel[2]==255 && pixel[3]==255) {
                            setPixel(imgData, i, j, [0,0,0,0]);
                        }
                    }
                }
                tempCanvas.clearRect(0, 0, image.width, image.height);
                tempCanvas.putImageData(imgData, 0, 0);
                changed = true;
            }
            /*
            if (black>white && black>trans*10 && confirm("看起来这张图片是以纯黑为底色，是否自动调整为透明底色？")) {
                for (var i=0;i<image.width;i++) {
                    for (var j=0;j<image.height;j++) {
                        var pixel = getPixel(imgData, i, j);
                        if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) {
                            setPixel(imgData, i, j, [0,0,0,0]);
                        }
                    }
                }
                tempCanvas.clearRect(0, 0, image.width, image.height);
                tempCanvas.putImageData(imgData, 0, 0);
                changed = true;
            }
            */

            // Step 2: 检测长宽比
            var ysize = selectAppend.value.indexOf('48') === -1 ? 32 : 48;
            if ((image.width%32!=0 || image.height%ysize!=0) && (image.width<=128 && image.height<=ysize*4)
                && confirm("目标长宽不符合条件，是否自动进行调整？")) {
                var ncanvas = document.createElement('canvas').getContext('2d');
                ncanvas.canvas.width = 128;
                ncanvas.canvas.height = 4*ysize;
                ncanvas.mozImageSmoothingEnabled = false;
                ncanvas.webkitImageSmoothingEnabled = false;
                ncanvas.msImageSmoothingEnabled = false;
                ncanvas.imageSmoothingEnabled = false;
                var w = image.width / 4, h = image.height / 4;
                for (var i=0;i<4;i++) {
                    for (var j=0;j<4;j++) {
                        ncanvas.drawImage(tempCanvas.canvas, i*w, j*h, w, h, i*32 + (32-w)/2, j*ysize + (ysize-h)/2, w, h);
                    }
                }
                tempCanvas = ncanvas;
                changed = true;
            }

            if (!changed) {
                callback(image);
            }
            else {
                var nimg = new Image();
                nimg.onload = function () {
                    callback(nimg);
                };
                nimg.src = tempCanvas.canvas.toDataURL();
            }
        }

        var selectFileBtn = document.getElementById('selectFileBtn');
        selectFileBtn.onclick = function () {
            var loadImage = function (content, callback) {
                var image = new Image();
                try {
                    image.onload = function () {
                        callback(image);
                    }
                    image.src = content;
                }
                catch (e) {
                    printe(e);
                }
            }
            core.readFile(function (content) {
                loadImage(content, function (image) {
                    autoAdjust(image, function (image) {
                        editor_mode.appendPic.img = image;
                        editor_mode.appendPic.width = image.width;
                        editor_mode.appendPic.height = image.height;

                        if (selectAppend.value == 'autotile') {
                            for (var ii = 0; ii < 3; ii++) {
                                var newsprite = appendPicCanvas.children[ii];
                                newsprite.style.width = (newsprite.width = image.width) / ratio + 'px';
                                newsprite.style.height = (newsprite.height = image.height) / ratio + 'px';
                            }
                            sprite_ctx.clearRect(0, 0, sprite.width, sprite.height);
                            sprite_ctx.drawImage(image, 0, 0);
                        }
                        else {
                            var ysize = selectAppend.value.indexOf('48') === -1 ? 32 : 48;
                            for (var ii = 0; ii < 3; ii++) {
                                var newsprite = appendPicCanvas.children[ii];
                                newsprite.style.width = (newsprite.width = Math.floor(image.width / 32) * 32) / ratio + 'px';
                                newsprite.style.height = (newsprite.height = Math.floor(image.height / ysize) * ysize) / ratio + 'px';
                            }
                        }

                        //画灰白相间的格子
                        var bgc = bg.getContext('2d');
                        var colorA = ["#f8f8f8", "#cccccc"];
                        var colorIndex;
                        var sratio = 4;
                        for (var ii = 0; ii < image.width / 32 * sratio; ii++) {
                            colorIndex = 1 - ii % 2;
                            for (var jj = 0; jj < image.height / 32 * sratio; jj++) {
                                bgc.fillStyle = colorA[colorIndex];
                                colorIndex = 1 - colorIndex;
                                bgc.fillRect(ii * 32 / sratio, jj * 32 / sratio, 32 / sratio, 32 / sratio);
                            }
                        }

                        //把导入的图片画出
                        source_ctx.drawImage(image, 0, 0);
                        editor_mode.appendPic.sourceImageData=source_ctx.getImageData(0,0,image.width,image.height);

                        //重置临时变量
                        selectAppend.onchange();
                    });
                });
            }, null, 'img');

            return;
        }

        var changeColorInput=document.getElementById('changeColorInput')
        changeColorInput.oninput=function(){
            var delta=(~~changeColorInput.value)*30;
            var imgData=editor_mode.appendPic.sourceImageData;
            var nimgData=new ImageData(imgData.width,imgData.height);
            // ImageData .data 形如一维数组,依次排着每个点的 R(0~255) G(0~255) B(0~255) A(0~255)
            var convert=function(rgba,delta){
                var rgbToHsl = editor.util.rgbToHsl
                var hue2rgb = editor.util.hue2rgb
                var hslToRgb = editor.util.hslToRgb
                //
                var hsl=rgbToHsl(rgba)
                hsl[0]=(hsl[0]+delta)%360
                var nrgb=hslToRgb(hsl)
                nrgb.push(rgba[3])
                return nrgb
            }
            for(var x=0; x<imgData.width; x++){
                for(var y=0 ; y<imgData.height; y++){
                    setPixel(nimgData,x,y,convert(getPixel(imgData,x,y),delta))
                }
            }
            source_ctx.clearRect(0, 0, imgData.width, imgData.height);
            source_ctx.putImageData(nimgData, 0, 0);
        }

        var left1 = document.getElementById('left1');
        var eToLoc = function (e) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            var loc = {
                'x': scrollLeft + e.clientX + appendPicCanvas.scrollLeft - left1.offsetLeft - appendPicCanvas.offsetLeft,
                'y': scrollTop + e.clientY + appendPicCanvas.scrollTop - left1.offsetTop - appendPicCanvas.offsetTop,
                'size': 32,
                'ysize': selectAppend.value.indexOf('48') === -1 ? 32 : 48
            };
            return loc;
        }//返回可用的组件内坐标

        var locToPos = function (loc) {
            var pos = {'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.ysize), 'ysize': loc.ysize}
            return pos;
        }

        picClick.onclick = function (e) {
            var loc = eToLoc(e);
            var pos = locToPos(loc);
            //console.log(e,loc,pos);
            var num = editor_mode.appendPic.num;
            var ii = editor_mode.appendPic.index;
            if (ii + 1 >= num) editor_mode.appendPic.index = ii + 1 - num;
            else editor_mode.appendPic.index++;
            editor_mode.appendPic.selectPos[ii] = pos;
            appendPicSelection.children[ii].style = [
                'left:', pos.x * 32, 'px;',
                'top:', pos.y * pos.ysize, 'px;',
                'height:', pos.ysize - 6, 'px;'
            ].join('');
        }

        var appendConfirm = document.getElementById('appendConfirm');
        appendConfirm.onclick = function () {

            var confirmAutotile = function () {
                var image = editor_mode.appendPic.img;
                if (image.width % 96 !=0 || image.height != 128) {
                    printe("不合法的Autotile图片！");
                    return;
                }
                var imgData = source_ctx.getImageData(0,0,image.width,image.height);
                sprite_ctx.putImageData(imgData, 0, 0);
                var imgbase64 = sprite.toDataURL().split(',')[1];

                // Step 1: List文件名
                fs.readdir('./project/images', function (err, data) {
                    if (err) {
                        printe(err);
                        throw(err);
                    }

                    // Step 2: 选择Autotile文件名
                    var filename;
                    for (var i=1;;++i) {
                        filename = 'autotile'+i;
                        if (data.indexOf(filename+".png")==-1) break;
                    }

                    // Step 3: 写入文件
                    fs.writeFile('./project/images/'+filename+".png", imgbase64, 'base64', function (err, data) {
                        if (err) {
                            printe(err);
                            throw(err);
                        }
                        // Step 4: 自动注册
                        editor_file.registerAutotile(filename, function (err) {
                            if (err) {
                                printe(err);
                                throw(err);
                            }
                            printe('自动元件'+filename+'注册成功,请F5刷新编辑器');
                        })

                    })

                })

            }

            if (selectAppend.value == 'autotile') {
                confirmAutotile();
                return;
            }

            var ysize = selectAppend.value.indexOf('48') === -1 ? 32 : 48;
            for (var ii = 0, v; v = editor_mode.appendPic.selectPos[ii]; ii++) {
                // var imgData = source_ctx.getImageData(v.x * 32, v.y * ysize, 32, ysize);
                // sprite_ctx.putImageData(imgData, ii * 32, sprite.height - ysize);
                // sprite_ctx.drawImage(editor_mode.appendPic.img, v.x * 32, v.y * ysize, 32, ysize,  ii * 32, height,  32, ysize)

                sprite_ctx.drawImage(source_ctx.canvas, v.x*32, v.y*ysize, 32, ysize, 32*ii, sprite.height - ysize, 32, ysize);
            }
            var dt = sprite_ctx.getImageData(0, 0, sprite.width, sprite.height);
            var imgbase64 = sprite.toDataURL().split(',')[1];
            fs.writeFile('./project/images/' + editor_mode.appendPic.imageName + '.png', imgbase64, 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                printe('追加素材成功，请F5刷新编辑器，或继续追加当前素材');
                sprite.style.height = (sprite.height = (sprite.height+ysize)) + "px";
                sprite_ctx.putImageData(dt, 0, 0);
            });
        }

        var editModeSelect = document.getElementById('editModeSelect');
        editModeSelect.onchange = function () {
            editor_mode.onmode('nextChange');
            editor_mode.onmode(editModeSelect.value);
            if(editor.isMobile)editor.showdataarea(false);
        }

        editor_mode.checkUnique = function (thiseval) {
            if (!(thiseval instanceof Array)) return false;
            var map = {};
            for (var i = 0; i<thiseval.length; ++i) {
                if (map[thiseval[i]]) {
                    alert("警告：存在重复定义！");
                    return false;
                }
                map[thiseval[i]] = true;
            }
            return true;
        }

        editor_mode.checkFloorIds = function(thiseval){
            if (!editor_mode.checkUnique(thiseval)) return false;
            var oldvalue = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds;
            fs.readdir('project/floors',function(err, data){
                if(err){
                    printe(err);
                    throw Error(err);
                }
                var newfiles=thiseval.map(function(v){return v+'.js'});
                var notExist='';
                for(var name,ii=0;name=newfiles[ii];ii++){
                    if(data.indexOf(name)===-1)notExist=name;
                }
                if(notExist){
                    var discard=confirm('文件'+notExist+'不存在, 保存会导致工程无法打开, 是否放弃更改');
                    if(discard){
                        editor.file.editTower([['change', "['main']['floorIds']", oldvalue]], function (objs_) {//console.log(objs_);
                            if (objs_.slice(-1)[0] != null) {
                                printe(objs_.slice(-1)[0]);
                                throw(objs_.slice(-1)[0])
                            }
                            ;printe('已放弃floorIds的修改，请F5进行刷新');
                        });
                    }
                }
            });
            return true
        }

        editor_mode.changeDoubleClickModeByButton=function(mode){
            ({
                delete:function(){
                    printf('下一次双击表格的项删除，切换下拉菜单可取消；编辑后需刷新浏览器生效。');
                    editor_mode.doubleClickMode=mode;
                },
                add:function(){
                    printf('下一次双击表格的项则在同级添加新项，切换下拉菜单可取消；编辑后需刷新浏览器生效。');
                    editor_mode.doubleClickMode=mode;
                }
            }[mode])();
        }

        if (Boolean(callback)) callback();
    }

    var editor_mode = new editor_mode();
    editor_mode.init_dom_ids();

    return editor_mode;
}
//editor_mode = editor_mode(editor);