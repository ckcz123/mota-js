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
        }
        this._ids = {}
        this.dom = {}
        this.actionList = [];
        this.mode = '';
        this.info = {};
        this.appendPic = {};
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

/////////////////////////////////////////////////////////////////////////////
    editor_mode.prototype.objToTable_ = function (obj, commentObj) {
        var outstr = ["\n<tr><td>条目</td><td>注释</td><td>值</td></tr>\n"];
        var guids = [];
        var defaultcobj = {
            _type: 'textarea',
            _data: '',
            _string: function (args) {//object~[field,cfield,vobj,cobj]
                var thiseval = args.vobj;
                return (typeof(thiseval) === typeof('')) && thiseval[0] === '"';
            },
            _leaf: function (args) {//object~[field,cfield,vobj,cobj]
                var thiseval = args.vobj;
                if (thiseval == null || thiseval == undefined) return true;//null,undefined
                if (typeof(thiseval) === typeof('')) return true;//字符串
                if (Object.keys(thiseval).length === 0) return true;//数字,true,false,空数组,空对象
                return false;
            },
        }
        var recursionParse = function (pfield, pcfield, pvobj, pcobj) {
            for (var ii in pvobj) {
                var field = pfield + "['" + ii + "']";
                var cfield = pcfield + "['_data']['" + ii + "']";
                var vobj = pvobj[ii];
                var cobj = null;
                if (pcobj && pcobj['_data'] && pcobj['_data'][ii]) {
                    cobj = Object.assign({}, defaultcobj, pcobj['_data'][ii]);
                } else {
                    if (pcobj && (pcobj['_data'] instanceof Function)) cobj = Object.assign({}, defaultcobj, pcobj['_data'](ii));
                    else cobj = Object.assign({}, defaultcobj);
                }
                var args = {field: field, cfield: cfield, vobj: vobj, cobj: cobj}
                if (cobj._leaf instanceof Function) cobj._leaf = cobj._leaf(args);
                for (var key in cobj) {
                    if (key === '_data') continue;
                    if (cobj[key] instanceof Function) cobj[key] = cobj[key](args);
                }
                if (cobj._hide)continue;
                if (cobj._leaf) {
                    var leafnode = editor_mode.objToTr_(obj, commentObj, field, cfield, vobj, cobj);
                    outstr.push(leafnode[0]);
                    guids.push(leafnode[1]);
                } else {
                    outstr.push(["<tr><td>----</td><td>----</td><td>", field, "</td></tr>\n"].join(''));
                    recursionParse(field, cfield, vobj, cobj);
                }
            }
        }
        recursionParse("", "", obj, commentObj);
        var checkRange = function (evalstr, thiseval) {
            if (evalstr) {
                return eval(evalstr);
            }
            return true;
        }
        var listen = function (guids) {
            guids.forEach(function (guid) {
                // tr>td[title=field]
                //   >td[title=comment,cobj=cobj:json]
                //   >td>div>input[value=thiseval]
                var thisTr = document.getElementById(guid);
                var input = thisTr.children[2].children[0].children[0];
                var field = thisTr.children[0].getAttribute('title');
                var cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
                input.onchange = function () {
                    var node = thisTr.parentNode;
                    while (!editor_mode._ids.hasOwnProperty(node.getAttribute('id'))) {
                        node = node.parentNode;
                    }
                    editor_mode.onmode(editor_mode._ids[node.getAttribute('id')]);
                    var thiseval = null;
                    if (input.checked != null) input.value = input.checked;
                    try {
                        thiseval = JSON.parse(input.value);
                    } catch (ee) {
                        printe(field + ' : ' + ee);
                        throw ee;
                    }
                    if (checkRange(cobj._range, thiseval)) {
                        editor_mode.addAction(['change', field, thiseval]);
                        editor_mode.onmode('save');//自动保存
                    } else {
                        printe(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
                    }
                }
                var dblclickfunc=function () {
                    if (cobj._type === 'event') editor_blockly.import(guid, {type: cobj._event});
                    if (cobj._type === 'textarea') editor_multi.import(guid, {lint: cobj._lint, string: cobj._string});
                }
                input.ondblclick = dblclickfunc
                var doubleClickCheck=[0];
                thisTr.onclick = function(){
                    var newClick = new Date().getTime();
                    var lastClick = doubleClickCheck.shift();
                    doubleClickCheck.push(newClick);
                    if(newClick-lastClick<500){
                        dblclickfunc()
                    }
                }
            });
        }
        return {"HTML": outstr.join(''), "guids": guids, "listen": listen};
    }

    editor_mode.prototype.objToTr_ = function (obj, commentObj, field, cfield, vobj, cobj) {
        var guid = editor.guid();
        var thiseval = vobj;
        var comment = cobj._data;

        var charlength = 10;

        var shortField = field.split("']").slice(-2)[0].split("['").slice(-1)[0];
        shortField = (shortField.length < charlength ? shortField : shortField.slice(0, charlength) + '...');

        var commentHTMLescape = editor.HTMLescape(comment);
        var shortCommentHTMLescape = (comment.length < charlength ? commentHTMLescape : editor.HTMLescape(comment.slice(0, charlength)) + '...');

        var cobjstr = Object.assign({}, cobj);
        delete cobjstr._data;
        cobjstr = editor.HTMLescape(JSON.stringify(cobjstr));

        var outstr = ['<tr id="', guid, '"><td title="', field, '">', shortField, '</td>',
            '<td title="', commentHTMLescape, '" cobj="', cobjstr, '">', shortCommentHTMLescape, '</td>',
            '<td><div class="etableInputDiv">', editor_mode.objToTd_(obj, commentObj, field, cfield, vobj, cobj), '</div></td></tr>\n',
        ];
        return [outstr.join(''), guid];
    }

    editor_mode.prototype.objToTd_ = function (obj, commentObj, field, cfield, vobj, cobj) {
        var thiseval = vobj;
        if (cobj._select) {
            var values = cobj._select.values;
            var outstr = ['<select>\n', "<option value='", JSON.stringify(thiseval), "'>", JSON.stringify(thiseval), '</option>\n'];
            values.forEach(function (v) {
                outstr.push(["<option value='", JSON.stringify(v), "'>", JSON.stringify(v), '</option>\n'].join(''))
            });
            outstr.push('</select>');
            return outstr.join('');
        } else if (cobj._input) {
            return ["<input type='text' spellcheck='false' value='", JSON.stringify(thiseval), "'/>\n"].join('');
        } else if (cobj._bool) {
            return ["<input type='checkbox' ", (thiseval ? 'checked ' : ''), "/>\n"].join('');
        } else {
            var num = 0;//editor_mode.indent(field);
            return ["<textarea spellcheck='false' >", JSON.stringify(thiseval, null, num), '</textarea>\n'].join('');
        }
    }

    editor_mode.prototype.indent = function (field) {
        var num = '\t';
        if (field.indexOf("['main']") === 0) return 0;
        if (field.indexOf("['flyRange']") !== -1) return 0;
        if (field === "['special']") return 0;
        return num;
    }

    editor_mode.prototype.addAction = function (action) {
        editor_mode.actionList.push(action);
    }

    editor_mode.prototype.doActionList = function (mode, actionList) {
        if (actionList.length == 0) return;
        printf('修改中...');
        switch (mode) {
            case 'loc':

                editor.file.editLoc(editor_mode.pos.x, editor_mode.pos.y, actionList, function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printf('修改成功');
                    editor.drawEventBlock();
                });
                break;
            case 'enemyitem':

                if (editor_mode.info.images == 'enemys' || editor_mode.info.images == 'enemy48') {
                    editor.file.editEnemy(editor_mode.info.id, actionList, function (objs_) {//console.log(objs_);
                        if (objs_.slice(-1)[0] != null) {
                            printe(objs_.slice(-1)[0]);
                            throw(objs_.slice(-1)[0])
                        }
                        ;printf('修改成功')
                    });
                } else if (editor_mode.info.images == 'items') {
                    editor.file.editItem(editor_mode.info.id, actionList, function (objs_) {//console.log(objs_);
                        if (objs_.slice(-1)[0] != null) {
                            printe(objs_.slice(-1)[0]);
                            throw(objs_.slice(-1)[0])
                        }
                        ;printf('修改成功')
                    });
                } else {
                    editor.file.editMapBlocksInfo(editor_mode.info.idnum, actionList, function (objs_) {//console.log(objs_);
                        if (objs_.slice(-1)[0] != null) {
                            printe(objs_.slice(-1)[0]);
                            throw(objs_.slice(-1)[0])
                        }
                        ;printf('修改成功');
                    });
                }
                break;
            case 'floor':

                editor.file.editFloor(actionList, function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printf('修改成功');
                });
                break;
            case 'tower':

                editor.file.editTower(actionList, function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printf('修改成功')
                });
                break;
            case 'functions':

                editor.file.editFunctions(actionList, function (objs_) {//console.log(objs_);
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printf('修改成功')
                });
                break;
            default:
                break;
        }
    }

    editor_mode.prototype.onmode = function (mode) {
        if (editor_mode.mode != mode) {
            if (mode === 'save') editor_mode.doActionList(editor_mode.mode, editor_mode.actionList);
            if (editor_mode.mode === 'nextChange' && mode) editor_mode.showMode(mode);
            editor_mode.mode = mode;
            editor_mode.actionList = [];
        }
    }

    editor_mode.prototype.showMode = function (mode) {
        for (var name in this.dom) {
            editor_mode.dom[name].style = 'z-index:-1;opacity: 0;';
        }
        editor_mode.dom[mode].style = '';
        if (editor_mode[mode]) editor_mode[mode]();
        document.getElementById('editModeSelect').value = mode;
        var tips = tip_in_showMode;
        if (!selectBox.isSelected) printf('tips: ' + tips[~~(tips.length * Math.random())]);
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
        var tableinfo = editor_mode.objToTable_(objs[0], objs[1]);
        document.getElementById('table_3d846fc4_7644_44d1_aa04_433d266a73df').innerHTML = tableinfo.HTML;
        tableinfo.listen(tableinfo.guids);

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
        var tableinfo = editor_mode.objToTable_(objs[0], objs[1]);
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
        var tableinfo = editor_mode.objToTable_(objs[0], objs[1]);
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
        var tableinfo = editor_mode.objToTable_(objs[0], objs[1]);
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
        var tableinfo = editor_mode.objToTable_(objs[0], objs[1]);
        document.getElementById('table_e260a2be_5690_476a_b04e_dacddede78b3').innerHTML = tableinfo.HTML;
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
        saveFloor.onclick = function () {
            editor_mode.onmode('');
            editor.file.saveFloorFile(function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                ;printf('保存成功');
            });
        }

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
            if (!core.isset(width) || !core.isset(height) || width<13 || height<13 || width*height>1000) {
                printe("新建地图的宽高都不得小于13，且宽高之积不能超过1000");
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

        var selectFileBtn = document.getElementById('selectFileBtn');
        selectFileBtn.onclick = function () {
            var loadImage = function (content, callback) {
                var image = new Image();
                try {
                    image.onload = function () {
                        callback(image);
                    }
                    image.src = content;
                    if (image.complete) {
                        callback(image);
                        return;
                    }
                }
                catch (e) {
                    printe(e);
                }
            }
            core.readFile(function (content) {
                loadImage(content, function (image) {
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
            }, null, 'img');

            return;
        }

        var changeColorInput=document.getElementById('changeColorInput')
        changeColorInput.oninput=function(){
            var delta=(~~changeColorInput.value)*30;
            var imgData=editor_mode.appendPic.sourceImageData;
            var nimgData=new ImageData(imgData.width,imgData.height);
            // ImageData .data 形如一维数组,依次排着每个点的 R(0~255) G(0~255) B(0~255) A(0~255)
            var getPixel=function(imgData, x, y) {
                var offset = (x + y * imgData.width) * 4;
                var r = imgData.data[offset+0];
                var g = imgData.data[offset+1];
                var b = imgData.data[offset+2];
                var a = imgData.data[offset+3];
                return [r,g,b,a];
            }
            var setPixel=function(imgData, x, y, rgba) {
                var offset = (x + y * imgData.width) * 4;
                imgData.data[offset+0]=rgba[0];
                imgData.data[offset+1]=rgba[1];
                imgData.data[offset+2]=rgba[2];
                imgData.data[offset+3]=rgba[3];
            }
            var convert=function(rgba,delta){
                var round=Math.round;
                // rgbToHsl hue2rgb hslToRgb from https://github.com/carloscabo/colz.git
                //--------------------------------------------
                // The MIT License (MIT)
                //
                // Copyright (c) 2014 Carlos Cabo
                //
                // Permission is hereby granted, free of charge, to any person obtaining a copy
                // of this software and associated documentation files (the "Software"), to deal
                // in the Software without restriction, including without limitation the rights
                // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                // copies of the Software, and to permit persons to whom the Software is
                // furnished to do so, subject to the following conditions:
                //
                // The above copyright notice and this permission notice shall be included in all
                // copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                // SOFTWARE.
                //--------------------------------------------
                // https://github.com/carloscabo/colz/blob/master/public/js/colz.class.js
                var rgbToHsl = function (rgba) {
                    var arg, r, g, b, h, s, l, d, max, min;
                
                    arg = rgba;
                
                    if (typeof arg[0] === 'number') {
                      r = arg[0];
                      g = arg[1];
                      b = arg[2];
                    } else {
                      r = arg[0][0];
                      g = arg[0][1];
                      b = arg[0][2];
                    }
                
                    r /= 255;
                    g /= 255;
                    b /= 255;
                
                    max = Math.max(r, g, b);
                    min = Math.min(r, g, b);
                    l = (max + min) / 2;
                
                    if (max === min) {
                      h = s = 0; // achromatic
                    } else {
                      d = max - min;
                      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                      switch (max) {
                      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                      case g: h = (b - r) / d + 2; break;
                      case b: h = (r - g) / d + 4; break;
                      }
                
                      h /= 6;
                    }
                
                    //CARLOS
                    h = round(h * 360);
                    s = round(s * 100);
                    l = round(l * 100);
                
                    return [h, s, l];
                }
                //
                var hue2rgb = function (p, q, t) {
                    if (t < 0) { t += 1; }
                    if (t > 1) { t -= 1; }
                    if (t < 1 / 6) { return p + (q - p) * 6 * t; }
                    if (t < 1 / 2) { return q; }
                    if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
                    return p;
                }
                var hslToRgb = function (hsl) {
                    var arg, r, g, b, h, s, l, q, p;
                
                    arg = hsl;
                
                    if (typeof arg[0] === 'number') {
                      h = arg[0] / 360;
                      s = arg[1] / 100;
                      l = arg[2] / 100;
                    } else {
                      h = arg[0][0] / 360;
                      s = arg[0][1] / 100;
                      l = arg[0][2] / 100;
                    }
                
                    if (s === 0) {
                      r = g = b = l; // achromatic
                    } else {
                
                      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                      p = 2 * l - q;
                      r = hue2rgb(p, q, h + 1 / 3);
                      g = hue2rgb(p, q, h);
                      b = hue2rgb(p, q, h - 1 / 3);
                    }
                    return [round(r * 255), round(g * 255), round(b * 255)];
                }
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
            var height = editor_mode.appendPic.toImg.height;
            for (var ii = 0, v; v = editor_mode.appendPic.selectPos[ii]; ii++) {
                var imgData = source_ctx.getImageData(v.x * 32, v.y * ysize, 32, ysize);
                sprite_ctx.putImageData(imgData, ii * 32, height);
                // sprite_ctx.drawImage(editor_mode.appendPic.img, v.x * 32, v.y * ysize, 32, ysize,  ii * 32, height,  32, ysize)
            }
            var imgbase64 = sprite.toDataURL().split(',')[1];
            fs.writeFile('./project/images/' + editor_mode.appendPic.imageName + '.png', imgbase64, 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                printe('追加素材成功,请F5刷新编辑器');
            });
        }

        var editModeSelect = document.getElementById('editModeSelect');
        editModeSelect.onchange = function () {
            editor_mode.onmode('nextChange');
            editor_mode.onmode(editModeSelect.value);
            if(editor.isMobile)editor.showdataarea(false);
        }

        editor_mode.checkFloorIds = function(thiseval){
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
                            ;printe('已放弃floorIds的修改');
                        });
                    }
                }
            });
            return true
        }

        if (Boolean(callback)) callback();
    }

    var editor_mode = new editor_mode();
    editor_mode.init_dom_ids();

    return editor_mode;
}
//editor_mode = editor_mode(editor);