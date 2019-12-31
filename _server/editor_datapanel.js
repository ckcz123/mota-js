editor_datapanel_wrapper = function (editor) {

    // 此文件内的内容仅做了分类, 未仔细整理函数

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


    // 添加自动事件页，无需双击
    editor.uifunctions.addAutoEvent = function () {
        if (editor_mode.mode != 'loc') return false;
        var newid = '2';
        var ae = editor.currentFloorData.autoEvent[editor_mode.pos.x + ',' + editor_mode.pos.y];
        if (ae != null) {
            var testid;
            for (testid = 2; Object.hasOwnProperty.call(ae, testid); testid++);
            newid = testid + '';
        }
        editor_mode.addAction(['add', "['autoEvent']['" + newid + "']", null]);
        editor_mode.onmode('save');
    }












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

    editor.uifunctions.copyPasteEnemyItem_func = function () {
        var copyEnemyItem = document.getElementById('copyEnemyItem');
        var pasteEnemyItem = document.getElementById('pasteEnemyItem');

        copyEnemyItem.onclick = function () {
            var cls = (editor_mode.info || {}).images;
            if (editor_mode.mode != 'enemyitem' || (cls != 'enemys' && cls != 'enemy48' && cls != 'items')) return;
            editor.uivalues.copyEnemyItem.type = cls;
            var id = editor_mode.info.id;
            if (cls == 'enemys' || cls == 'enemy48') {
                editor.uivalues.copyEnemyItem.data = core.clone(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id]);
                printf("怪物属性复制成功");
            } else {
                editor.uivalues.copyEnemyItem.data = {};
                for (var x in items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a) {
                    if (items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[x][id] != null) {
                        editor.uivalues.copyEnemyItem.data[x] = core.clone(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[x][id]);
                    }
                }
                printf("道具属性复制成功");
            }
        }

        pasteEnemyItem.onclick = function () {
            var cls = (editor_mode.info || {}).images;
            if (editor_mode.mode != 'enemyitem' || !cls || cls != editor.uivalues.copyEnemyItem.type) return;
            var id = editor_mode.info.id;
            if (cls == 'enemys' || cls == 'enemy48') {
                if (confirm("你确定要覆盖此怪物的全部属性么？这是个不可逆操作！")) {
                    enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id] = core.clone(editor.uivalues.copyEnemyItem.data);
                    editor.file.saveSetting('enemys', [], function (err) {
                        if (err) printe(err);
                        else printf("怪物属性粘贴成功\n请再重新选中该怪物方可查看更新后的表格。");
                    })
                }
            } else {
                if (confirm("你确定要覆盖此道具的全部属性么？这是个不可逆操作！")) {
                    for (var x in editor.uivalues.copyEnemyItem.data) {
                        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[x][id] = core.clone(editor.uivalues.copyEnemyItem.data[x]);
                    }
                    editor.file.saveSetting('items', [], function (err) {
                        if (err) printe(err);
                        else printf("道具属性粘贴成功\n请再重新选中该道具方可查看更新后的表格。");
                    })
                }
            }

        }


    }








    ///////////////////////////////////////////////////////////////////////
    //////////////////// 楼层属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////



    editor.uifunctions.changeFloorId_func = function () {

        editor.dom.changeFloorId.children[1].onclick = function () {
            var floorId = editor.dom.changeFloorId.children[0].value;
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





    editor.uifunctions.fixCtx_func = function () {
        [editor.dom.sourceCtx, editor.dom.spriteCtx].forEach(function (ctx) {
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        })
    }

    editor.uifunctions.selectAppend_func = function () {

        var selectAppend_str = [];
        ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48", "autotile"].forEach(function (image) {
            selectAppend_str.push(["<option value='", image, "'>", image, '</option>\n'].join(''));
        });
        editor.dom.selectAppend.innerHTML = selectAppend_str.join('');
        editor.dom.selectAppend.onchange = function () {

            var value = editor.dom.selectAppend.value;

            if (value == 'autotile') {
                editor_mode.appendPic.imageName = 'autotile';
                for (var jj = 0; jj < 4; jj++) editor.dom.appendPicSelection.children[jj].style = 'display:none';
                if (editor_mode.appendPic.img) {
                    editor.dom.sprite.style.width = (editor.dom.sprite.width = editor_mode.appendPic.img.width) / editor.uivalues.ratio + 'px';
                    editor.dom.sprite.style.height = (editor.dom.sprite.height = editor_mode.appendPic.img.height) / editor.uivalues.ratio + 'px';
                    editor.dom.spriteCtx.clearRect(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
                    editor.dom.spriteCtx.drawImage(editor_mode.appendPic.img, 0, 0);
                }
                return;
            }

            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            editor_mode.appendPic.imageName = value;
            var img = core.material.images[value];
            editor_mode.appendPic.toImg = img;
            var num = ~~img.width / 32;
            editor_mode.appendPic.num = num;
            editor_mode.appendPic.index = 0;
            var selectStr = '';
            for (var ii = 0; ii < num; ii++) {
                editor.dom.appendPicSelection.children[ii].style = 'left:0;top:0;height:' + (ysize - 6) + 'px';
                selectStr += '{"x":0,"y":0},'
            }
            editor_mode.appendPic.selectPos = eval('[' + selectStr + ']');
            for (var jj = num; jj < 4; jj++) {
                editor.dom.appendPicSelection.children[jj].style = 'display:none';
            }
            editor.dom.sprite.style.width = (editor.dom.sprite.width = img.width) / editor.uivalues.ratio + 'px';
            editor.dom.sprite.style.height = (editor.dom.sprite.height = img.height + ysize) / editor.uivalues.ratio + 'px';
            editor.dom.spriteCtx.drawImage(img, 0, 0);
        }
        editor.dom.selectAppend.onchange();
    }

    editor.uifunctions.selectFileBtn_func = function () {

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
            var trans = 0, white = 0, black = 0;
            for (var i = 0; i < image.width; i++) {
                for (var j = 0; j < image.height; j++) {
                    var pixel = editor.util.getPixel(imgData, i, j);
                    if (pixel[3] == 0) trans++;
                    if (pixel[0] == 255 && pixel[1] == 255 && pixel[2] == 255 && pixel[3] == 255) white++;
                    // if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) black++;
                }
            }
            if (white > black && white > trans * 10 && confirm("看起来这张图片是以纯白为底色，是否自动调整为透明底色？")) {
                for (var i = 0; i < image.width; i++) {
                    for (var j = 0; j < image.height; j++) {
                        var pixel = editor.util.getPixel(imgData, i, j);
                        if (pixel[0] == 255 && pixel[1] == 255 && pixel[2] == 255 && pixel[3] == 255) {
                            editor.util.setPixel(imgData, i, j, [0, 0, 0, 0]);
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
                        var pixel = editor.util.getPixel(imgData, i, j);
                        if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) {
                            editor.util.setPixel(imgData, i, j, [0,0,0,0]);
                        }
                    }
                }
                tempCanvas.clearRect(0, 0, image.width, image.height);
                tempCanvas.putImageData(imgData, 0, 0);
                changed = true;
            }
            */

            // Step 2: 检测长宽比
            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            if ((image.width % 32 != 0 || image.height % ysize != 0) && (image.width <= 128 && image.height <= ysize * 4)
                && confirm("目标长宽不符合条件，是否自动进行调整？")) {
                var ncanvas = document.createElement('canvas').getContext('2d');
                ncanvas.canvas.width = 128;
                ncanvas.canvas.height = 4 * ysize;
                ncanvas.mozImageSmoothingEnabled = false;
                ncanvas.webkitImageSmoothingEnabled = false;
                ncanvas.msImageSmoothingEnabled = false;
                ncanvas.imageSmoothingEnabled = false;
                var w = image.width / 4, h = image.height / 4;
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        ncanvas.drawImage(tempCanvas.canvas, i * w, j * h, w, h, i * 32 + (32 - w) / 2, j * ysize + (ysize - h) / 2, w, h);
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

        editor.dom.selectFileBtn.onclick = function () {
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

                        if (editor.dom.selectAppend.value == 'autotile') {
                            for (var ii = 0; ii < 3; ii++) {
                                var newsprite = editor.dom.appendPicCanvas.children[ii];
                                newsprite.style.width = (newsprite.width = image.width) / editor.uivalues.ratio + 'px';
                                newsprite.style.height = (newsprite.height = image.height) / editor.uivalues.ratio + 'px';
                            }
                            editor.dom.spriteCtx.clearRect(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
                            editor.dom.spriteCtx.drawImage(image, 0, 0);
                        }
                        else {
                            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
                            for (var ii = 0; ii < 3; ii++) {
                                var newsprite = editor.dom.appendPicCanvas.children[ii];
                                newsprite.style.width = (newsprite.width = Math.floor(image.width / 32) * 32) / editor.uivalues.ratio + 'px';
                                newsprite.style.height = (newsprite.height = Math.floor(image.height / ysize) * ysize) / editor.uivalues.ratio + 'px';
                            }
                        }

                        //画灰白相间的格子
                        var bgc = editor.dom.bgCtx;
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
                        editor.dom.sourceCtx.drawImage(image, 0, 0);
                        editor_mode.appendPic.sourceImageData = editor.dom.sourceCtx.getImageData(0, 0, image.width, image.height);

                        //重置临时变量
                        editor.dom.selectAppend.onchange();
                    });
                });
            }, null, 'image/*', 'img');

            return;
        }
    }


    editor.uifunctions.changeColorInput_func = function () {
        var changeColorInput = document.getElementById('changeColorInput')
        changeColorInput.oninput = function () {
            var delta = (~~changeColorInput.value) * 30;
            var imgData = editor_mode.appendPic.sourceImageData;
            var nimgData = new ImageData(imgData.width, imgData.height);
            // ImageData .data 形如一维数组,依次排着每个点的 R(0~255) G(0~255) B(0~255) A(0~255)
            var convert = function (rgba, delta) {
                var rgbToHsl = editor.util.rgbToHsl
                var hue2rgb = editor.util.hue2rgb
                var hslToRgb = editor.util.hslToRgb
                //
                var hsl = rgbToHsl(rgba)
                hsl[0] = (hsl[0] + delta) % 360
                var nrgb = hslToRgb(hsl)
                nrgb.push(rgba[3])
                return nrgb
            }
            for (var x = 0; x < imgData.width; x++) {
                for (var y = 0; y < imgData.height; y++) {
                    editor.util.setPixel(nimgData, x, y, convert(editor.util.getPixel(imgData, x, y), delta))
                }
            }
            editor.dom.sourceCtx.clearRect(0, 0, imgData.width, imgData.height);
            editor.dom.sourceCtx.putImageData(nimgData, 0, 0);
        }
    }


    editor.uifunctions.picClick_func = function () {


        var eToLoc = function (e) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            var loc = {
                'x': scrollLeft + e.clientX + editor.dom.appendPicCanvas.scrollLeft - editor.dom.left1.offsetLeft - editor.dom.appendPicCanvas.offsetLeft,
                'y': scrollTop + e.clientY + editor.dom.appendPicCanvas.scrollTop - editor.dom.left1.offsetTop - editor.dom.appendPicCanvas.offsetTop,
                'size': 32,
                'ysize': editor.dom.selectAppend.value.endsWith('48') ? 48 : 32
            };
            return loc;
        }//返回可用的组件内坐标

        var locToPos = function (loc) {
            var pos = { 'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.ysize), 'ysize': loc.ysize }
            return pos;
        }

        editor.dom.picClick.onclick = function (e) {
            var loc = eToLoc(e);
            var pos = locToPos(loc);
            //console.log(e,loc,pos);
            var num = editor_mode.appendPic.num;
            var ii = editor_mode.appendPic.index;
            if (ii + 1 >= num) editor_mode.appendPic.index = ii + 1 - num;
            else editor_mode.appendPic.index++;
            editor_mode.appendPic.selectPos[ii] = pos;
            editor.dom.appendPicSelection.children[ii].style = [
                'left:', pos.x * 32, 'px;',
                'top:', pos.y * pos.ysize, 'px;',
                'height:', pos.ysize - 6, 'px;'
            ].join('');
        }
    }

    editor.uifunctions.appendConfirm_func = function () {

        var appendRegister = document.getElementById('appendRegister');

        var appendConfirm = document.getElementById('appendConfirm');
        appendConfirm.onclick = function () {

            var confirmAutotile = function () {
                var image = editor_mode.appendPic.img;
                if (image.width % 96 != 0 || image.height != 128) {
                    printe("不合法的Autotile图片！");
                    return;
                }
                var imgData = editor.dom.sourceCtx.getImageData(0, 0, image.width, image.height);
                editor.dom.spriteCtx.putImageData(imgData, 0, 0);
                var imgbase64 = editor.dom.sprite.toDataURL().split(',')[1];

                // Step 1: List文件名
                fs.readdir('./project/images', function (err, data) {
                    if (err) {
                        printe(err);
                        throw (err);
                    }

                    // Step 2: 选择Autotile文件名
                    var filename;
                    for (var i = 1; ; ++i) {
                        filename = 'autotile' + i;
                        if (data.indexOf(filename + ".png") == -1) break;
                    }

                    // Step 3: 写入文件
                    fs.writeFile('./project/images/' + filename + ".png", imgbase64, 'base64', function (err, data) {
                        if (err) {
                            printe(err);
                            throw (err);
                        }
                        // Step 4: 自动注册
                        editor.file.registerAutotile(filename, function (err) {
                            if (err) {
                                printe(err);
                                throw (err);
                            }
                            printe('自动元件' + filename + '注册成功,请F5刷新编辑器');
                        })

                    })

                })

            }

            if (editor.dom.selectAppend.value == 'autotile') {
                confirmAutotile();
                return;
            }

            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            for (var ii = 0, v; v = editor_mode.appendPic.selectPos[ii]; ii++) {
                // var imgData = editor.dom.sourceCtx.getImageData(v.x * 32, v.y * ysize, 32, ysize);
                // editor.dom.spriteCtx.putImageData(imgData, ii * 32, editor.dom.sprite.height - ysize);
                // editor.dom.spriteCtx.drawImage(editor_mode.appendPic.img, v.x * 32, v.y * ysize, 32, ysize,  ii * 32, height,  32, ysize)

                editor.dom.spriteCtx.drawImage(editor.dom.sourceCtx.canvas, v.x * 32, v.y * ysize, 32, ysize, 32 * ii, editor.dom.sprite.height - ysize, 32, ysize);
            }
            var dt = editor.dom.spriteCtx.getImageData(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
            var imgbase64 = editor.dom.sprite.toDataURL('image/png');
            var imgName = editor_mode.appendPic.imageName;
            fs.writeFile('./project/images/' + imgName + '.png', imgbase64.split(',')[1], 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                var currHeight = editor.dom.sprite.height;
                editor.dom.sprite.style.height = (editor.dom.sprite.height = (currHeight + ysize)) + "px";
                editor.dom.spriteCtx.putImageData(dt, 0, 0);
                core.material.images[imgName].src = imgbase64;
                editor.widthsX[imgName][3] = currHeight;
                if (appendRegister && appendRegister.checked) {
                    editor.file.autoRegister({images: imgName}, function (e) {
                        if (e) {
                            printe(e);
                            throw e;
                        }
                        printf('追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。');
                    });
                } else {
                    printf('追加素材成功！你可以继续追加其他素材，最后再刷新以使用。');
                }
            });
        }

        var quickAppendConfirm = document.getElementById('quickAppendConfirm');
        quickAppendConfirm.onclick = function () {
            var value = editor.dom.selectAppend.value;
            if (value != 'enemys' && value != 'enemy48' && value != 'npcs' && value != 'npc48')
                return printe("只有怪物或NPC才能快速导入！");
            var ysize = value.endsWith('48') ? 48 : 32;
            if (editor.dom.sourceCtx.canvas.width != 128 || editor.dom.sourceCtx.canvas.height != 4 * ysize)
                return printe("只有 4*4 的素材图片才可以快速导入！");

            var dt = editor.dom.spriteCtx.getImageData(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
            editor.dom.sprite.style.height = (editor.dom.sprite.height = (editor.dom.sprite.height + 3 * ysize)) + "px";
            editor.dom.spriteCtx.putImageData(dt, 0, 0);
            if (editor.dom.sprite.width == 64) { // 两帧
                editor.dom.spriteCtx.drawImage(editor.dom.sourceCtx.canvas, 32, 0, 64, 4 * ysize, 0, editor.dom.sprite.height - 4 * ysize, 64, 4 * ysize);
            } else { // 四帧
                editor.dom.spriteCtx.drawImage(editor.dom.sourceCtx.canvas, 0, 0, 128, 4 * ysize, 0, editor.dom.sprite.height - 4 * ysize, 128, 4 * ysize);
            }

            dt = editor.dom.spriteCtx.getImageData(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
            var imgbase64 = editor.dom.sprite.toDataURL('image/png');
            var imgName = editor_mode.appendPic.imageName;
            fs.writeFile('./project/images/' + imgName + '.png', imgbase64.split(',')[1], 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                var currHeight = editor.dom.sprite.height;
                editor.dom.sprite.style.height = (editor.dom.sprite.height = (currHeight + ysize)) + "px";
                editor.dom.spriteCtx.putImageData(dt, 0, 0);
                core.material.images[imgName].src = imgbase64;
                editor.widthsX[imgName][3] = currHeight;
                if (appendRegister && appendRegister.checked) {
                    editor.file.autoRegister({images: imgName}, function (e) {
                        if (e) {
                            printe(e);
                            throw e;
                        }
                        printf('快速追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。');
                    })
                } else {
                    printf('快速追加素材成功！你可以继续追加其他素材，最后再刷新以使用。');
                }
            });

        }
    }

    ///////////////////////////////////////////////////////////////////////
    //////////////////// 公共事件 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 插件编写 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////














}