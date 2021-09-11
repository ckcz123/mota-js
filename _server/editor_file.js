editor_file_wrapper = function (editor) {
    editor_file_proto = function () {
        /**
         * 以 
         * {
         *     "floor.MT1":<obj>,
         *     "plugins":<obj>
         * }
         * 的形式记录所有更改过的文件,save时写入
         * <obj>的内容暂时还没想好
         * 
         * Mark相关的思路搁置
         */
        this.fileMark = {}
    }

    // 这个函数之后挪到editor.table?
    editor_file_proto.prototype.loadCommentjs = function (callback) {
        var commentjs = {
            'comment': 'comment',
            'data.comment': 'dataComment',
            'functions.comment': 'functionsComment',
            'events.comment': 'eventsComment',
            'plugins.comment': 'pluginsComment',
        }
        for (var key in commentjs) {
            (function (key) {
                var value = commentjs[key];
                var script = document.createElement('script');
                if (window.location.href.indexOf('_server') !== -1)
                    script.src = key + '.js';
                else
                    script.src = '_server/table/' + key + '.js';
                document.body.appendChild(script);
                script.onload = function () {
                    editor.file[value] = eval(key.replace('.', '_') + '_c456ea59_6018_45ef_8bcc_211a24c627dc');
                    var loaded = Boolean(callback);
                    for (var key_ in commentjs) {
                        loaded = loaded && editor.file[commentjs[key_]]
                    }
                    if (loaded) callback();
                }
            })(key);
        }
    }

    editor_file_proto.prototype.alertWhenCompress = function () {
        if (editor.useCompress === true) {
            editor.useCompress = 'alerted';
            setTimeout("alert('当前游戏使用的是压缩文件,修改完成后请使用启动服务.exe->Js代码压缩工具重新压缩,或者把main.js的useCompress改成false来使用原始文件')", 1000)
        }
    }

    editor_file_proto.prototype.formatMap = function (mapArr, trySimplify) {
        if (!mapArr || JSON.stringify(mapArr) == JSON.stringify([])) return '';
        if (trySimplify) {
            //检查是否是全0二维数组
            var jsoncheck = JSON.stringify(mapArr).replace(/\D/g, '');
            if (jsoncheck == Array(jsoncheck.length + 1).join('0')) return '';
        }
        //把二维数组格式化
        var formatArrStr = '';
        var arr = JSON.stringify(mapArr).replace(/\s+/g, '').split('],[');
        var si = mapArr.length - 1, sk = mapArr[0].length - 1;
        for (var i = 0; i <= si; i++) {
            var a = [];
            formatArrStr += '    [';
            if (i == 0 || i == si) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
            else a = arr[i].split(/\D+/);
            for (var k = 0; k <= sk; k++) {
                var num = parseInt(a[k]);
                formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == sk ? '' : ',');
            }
            formatArrStr += ']' + (i == si ? '' : ',\n');
        }
        return formatArrStr;
    }

    editor_file_proto.prototype.saveFloor = function (floorData, callback) {
        //callback(err:String)
        var floorId = floorData.floorId;
        var filename = 'project/floors/' + floorId + '.js';
        var datastr = ['main.floors.', floorId, '=\n'];

        var tempJsonObj = Object.assign({}, floorData);
        var tempMap = editor.dom.maps.map(function (one) {
            return [one, editor.util.guid()]
        });
        tempMap.forEach(function (v) {
            v[2] = tempJsonObj[v[0]];
            tempJsonObj[v[0]] = v[1];
        });
        var tempJson = JSON.stringify(tempJsonObj, editor.game.replacerForSaving, 4);
        tempMap.forEach(function (v) {
            tempJson = tempJson.replace('"' + v[1] + '"', '[\n' + editor.file.formatMap(v[2], v[0] != 'map') + '\n]')
        });
        datastr = datastr.concat([tempJson]);
        datastr = datastr.join('');
        editor.file.alertWhenCompress();
        editor.fs.writeFile(filename, editor.util.encode64(datastr), 'base64', function (err, data) {
            editor.addUsedFlags(datastr);
            callback(err);
        });
    }

    editor_file_proto.prototype.saveScript = function (name, varName, dataObj, callback) {
        // 此处格式化以及写入 project/xxx.js 形式的文件
        editor.file.alertWhenCompress();

        if (['maps', 'enemys'].indexOf(name) === -1) {
            // 全部用\t展开
            var content = JSON.stringify(dataObj, editor.game.replacerForSaving, '\t');
        } else {
            // 只用\t展开第一层
            var emap = {};
            var estr = JSON.stringify(dataObj, function (_k, v) {
                if (v.id != null) {
                    var id_ = editor.util.guid();
                    emap[id_] = JSON.stringify(v, editor.game.replacerForSaving);
                    return id_;
                } else return v
            }, '\t');
            for (var id_ in emap) {
                estr = estr.replace('"' + id_ + '"', emap[id_]);
            }
            var content = estr;
        }

        var strToWrite = `var ${varName} = \n${content}`;
        editor.fs.writeFile(`project/${name}.js`, editor.util.encode64(strToWrite), 'base64', function (err, data) {
            editor.addUsedFlags(content);
            callback(err);
        });
    }

    editor_file_proto.prototype.saveCommentJs = function () {
        // 无需格式化的写入, 把multi的那部分略微修改
    }

    editor_file_proto.prototype.saveImage = function () {
        // 给追加素材使用
    }

    // Mark相关的思路搁置
    editor_file_proto.prototype.addMark = function (name) {
        // 把name对应的文件在editor.file.fileMark添加标记
    }

    editor_file_proto.prototype.save = function (callback) {
        // 根据 editor.file.fileMark 把游戏对象格式化写入文件
    }
}

/////////////////////////////////////////////////////////////////////////


editor_file = function (editor, callback) {

    var editor_file = new editor_file_proto();
    editor.file=editor_file;

    editor.file.loadCommentjs(callback);

    editor.file.saveFloorFile = function (callback) {
        //callback(err:String)
        checkCallback(callback);
        /* if (!isset(editor.currentFloorId) || !isset(editor.currentFloorData)) {
          callback('未选中文件或无数据');
        } */
        if (core.floorIds.indexOf(editor.currentFloorId) >= 0) {
            for(var ii=0,name;name=editor.dom.maps[ii];ii++){
                var mapArray=editor[name].map(function (v) {
                    return v.map(function (v) {
                        return v.idnum || v || 0
                    })
                });
                editor.currentFloorData[name]=mapArray;
            }
        }
        editor.file.saveFloor(editor.currentFloorData, callback)
    }

    ///////////////////////////////////////////////////////////////////////////

    editor.file.saveNewFile = function (saveFilename, callback) {
        //saveAsFilename不含'/'不含'.js'
        checkCallback(callback);
        var currData=editor.currentFloorData;
        var saveStatus = document.getElementById('newMapStatus').checked;

        var title = saveStatus?currData.title:"新建楼层";
        var name = saveStatus?currData.name:"0";
        if (/^mt\d+$/i.test(saveFilename)) {
            name = saveFilename.substring(2);
            title = "主塔 "+name+" 层";
        }
        
        var width = parseInt(document.getElementById('newMapWidth').value);
        var height = parseInt(document.getElementById('newMapHeight').value);
        var row = [], map = [];
        for (var i=0;i<width;i++) row.push(0);
        for (var i=0;i<height;i++) map.push(row);
        editor.currentFloorData = Object.assign(JSON.parse(JSON.stringify(editor.file.comment._data.floors_template)), {
            floorId: saveFilename,
            title: title,
            name: name,
            width: width,
            height: height,
            map: map,
        },saveStatus?{
            canFlyTo: currData.canFlyTo,
            canFlyFrom: currData.canFlyFrom,
            canUseQuickShop: currData.canUseQuickShop,
            cannotViewMap: currData.cannotViewMap,
            cannotMoveDirectly: currData.cannotMoveDirectly,
            ratio: currData.ratio,
            defaultGround: currData.defaultGround,
            bgm: currData.bgm,
            color: currData.color,
            weather: currData.weather,
        }:{});
        // 继承配置表格新增的基本楼层属性
        if (saveStatus) {
            for (var x in currData) {
                if (editor.currentFloorData[x] == null && (typeof currData[x] == 'number' || typeof currData[x] == 'string')) {
                    editor.currentFloorData[x] = currData[x];
                }
            }
        }

        Object.keys(editor.currentFloorData).forEach(function (t) {
            if (editor.currentFloorData[t] == null)
                delete editor.currentFloorData[t];
        })
        editor.currentFloorId = saveFilename;
        editor.file.saveFloorFile(callback);
    }
    editor.file.saveNewFiles = function (floorIdList, from, to, callback) {
        checkCallback(callback);
        var currData=editor.currentFloorData;
        var saveStatus = document.getElementById('newMapsStatus').checked;

        var calValue = function (text, i) {
            return text.replace(/\${(.*?)}/g, function (word, value) {
                return eval(value);
            });
        }

        var width = parseInt(document.getElementById('newMapsWidth').value);
        var height = parseInt(document.getElementById('newMapsHeight').value);

        var row = [], map = [];
        for (var i=0;i<width;i++) row.push(0);
        for (var i=0;i<height;i++) map.push(row);

        var filenames = floorIdList.map(function (v) {return "project/floors/"+v+".js";});
        var datas = [];
        for (var i=from;i<=to;i++) {
            var datastr = ['main.floors.', floorIdList[i-from], '=\n{'];
            var data = Object.assign(JSON.parse(JSON.stringify(editor.file.comment._data.floors_template)), {
                floorId: floorIdList[i-from],
                title: calValue(document.getElementById('newFloorTitles').value, i),
                name: calValue(document.getElementById('newFloorNames').value, i),
                width: width,
                height: height,
                map: map,
            },saveStatus?{
                canFlyTo: currData.canFlyTo,
                canFlyFrom: currData.canFlyFrom,
                canUseQuickShop: currData.canUseQuickShop,
                cannotViewMap: currData.cannotViewMap,
                cannotMoveDirectly: currData.cannotMoveDirectly,
                ratio: currData.ratio,
                defaultGround: currData.defaultGround,
                bgm: currData.bgm,
                color: currData.color,
                weather: currData.weather,
            }:{});
            Object.keys(data).forEach(function (t) {
                if (data[t] == null)
                    delete data[t];
                else {
                    if (t=='map') {
                        datastr = datastr.concat(['\n"', t, '": [\n', editor.file.formatMap(data[t]), '\n],']);
                    }
                    else {
                        datastr = datastr.concat(['\n"', t, '": ', JSON.stringify(data[t], null, 4), ',']);
                    }
                }
            });
            datastr = datastr.concat(['\n}']);
            datastr = datastr.join('');
            datas.push(encode(datastr));
        }
        editor.file.alertWhenCompress();
        fs.writeMultiFiles(filenames, datas, function (err, data) {
            callback(err);
        });
    }

    //callback(err:String)

    ////////////////////////////////////////////////////////////////////

    editor.file.autoRegister = function (info, callback) {

        var iconActions = [];
        var mapActions = [];
        var templateActions = [];

        var image = info.images;
        var bindFaceIds = false;

        if (image=='autotile') {
            callback('不能对自动元件进行自动注册！');
            return;
        }
        if ((image=='npc48' || image == 'enemy48')
                && confirm("你想绑定图块的朝向么？\n如果是，则会将最后四个注册图块的faceIds进行自动绑定。")) {
            bindFaceIds = true;
        }
        var c=image.toUpperCase().charAt(0);

        var allIds = [];
        Object.keys(icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1[image] || {}).forEach(function (v) {
            allIds[icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1[image][v]] = v;
        });

        editor.ids.forEach(function (v) {
            if (v.images==image) {
                allIds[v.y]=v;
            }
        })

        var per_height = image.endsWith('48')?48:32;

        var faceIds = []; // down, left, right, up

        var idnum=300;
        for (var y=0; y<editor.widthsX[image][3]/per_height;y++) {
            if (allIds[y] != null) {
                faceIds.push(allIds[y]);
                continue;
            }
            while (editor.core.maps.blocksInfo[idnum]) idnum++;

            // get id num
            var id = c+idnum;

            iconActions.push(["add", "['" + image + "']['" + id + "']", y])
            mapActions.push(["add", "['" + idnum + "']", {'cls': image, 'id': id}]);
            faceIds.push({idnum: idnum, id: id});
            if (image=='items')
                templateActions.push(["add", "['" + id + "']", editor.file.comment._data.items_template]);
            else if (image.indexOf('enemy')==0)
                templateActions.push(["add", "['" + id + "']", editor.file.comment._data.enemys_template]);
            idnum++;
        }

        if (bindFaceIds) {
            // 只绑定最后四个，防止之前的单向npc乱掉
            if (faceIds.length >= 4) {
                var i = faceIds.length - 4;
                var down = faceIds[i], left = faceIds[i+1], right = faceIds[i+2], up = faceIds[i+3];
                var obj = {down: down.id, left: left.id, right: right.id, up: up.id};
                if (image.indexOf('enemy')==0) {
                    templateActions.push(["add", "['" + down.id + "']['faceIds']", obj]);
                    templateActions.push(["add", "['" + left.id + "']['faceIds']", obj]);
                    templateActions.push(["add", "['" + right.id + "']['faceIds']", obj]);
                    templateActions.push(["add", "['" + up.id + "']['faceIds']", obj]);
                } else {
                    mapActions.push(["add", "['" + down.idnum + "']['faceIds']", obj]);
                    mapActions.push(["add", "['" + left.idnum + "']['faceIds']", obj]);
                    mapActions.push(["add", "['" + right.idnum + "']['faceIds']", obj]);
                    mapActions.push(["add", "['" + up.idnum + "']['faceIds']", obj]);
                }
            }
        }

        if (mapActions.length==0) {
            callback("没有要注册的项！");
            return;
        }

        var templist = [];
        var tempcallback = function (err) {
            templist.push(err);
            if (templist.length == 3) {
                if (templist[0] != null || templist[1] != null || templist[2] != null)
                    callback((templist[0] || '') + '\n' + (templist[1] || '') + '\n' + (templist[2] || ''));
                //这里如果一个成功一个失败会出严重bug
                else
                    callback(null);
            }
        }
        if (iconActions.length>0)
            saveSetting('icons', iconActions, tempcallback);
        else tempcallback(null);

        saveSetting('maps', mapActions, tempcallback);

        if (image=='items')
            saveSetting('items', templateActions, tempcallback);
        else if (image.indexOf('enemy')==0)
            saveSetting('enemys', templateActions, tempcallback);
        else tempcallback(null);
    }

    editor.file.registerAutotile = function (filename, callback) {
        var idnum = 140;
        while (editor.core.maps.blocksInfo[idnum]) idnum++;

        var iconActions = [];
        var mapActions = [];

        iconActions.push(["add", "['autotile']['" + filename + "']", 0]);
        mapActions.push(["add", "['" + idnum + "']", {'cls': 'autotile', 'id': filename}]);

        var templist = [];
        var tempcallback = function (err) {
            templist.push(err);
            if (templist.length == 2) {
                if (templist[0] != null || templist[1] != null)
                    callback((templist[0] || '') + '\n' + (templist[1] || ''));
                //这里如果一个成功一个失败会出严重bug
                else
                    callback(null);
            }
        }

        saveSetting('icons', iconActions, tempcallback);
        saveSetting('maps', mapActions, tempcallback);
    }

    editor.file.changeIdAndIdnum = function (id, idnum, info, callback) {
        checkCallback(callback);
        
        var changeOrNew=core.isset(editor_mode.info.id)?'change':'new'
        if(changeOrNew=='new'){
            //检查maps中是否有重复的idnum或id
            for (var ii in editor.core.maps.blocksInfo) {
                if (ii == idnum) {
                    callback('idnum重复了');
                    return;
                }
                if (editor.core.maps.blocksInfo[ii].id == id) {
                    callback('id重复了');
                    return;
                }
            }
            var templist = [];
            var tempcallback = function (err) {
                templist.push(err);
                if (templist.length == 2) {
                    if (templist[0] != null || templist[1] != null)
                        callback((templist[0] || '') + '\n' + (templist[1] || ''));
                    //这里如果一个成功一个失败会出严重bug
                    else
                        callback(null);
                }
            }
            saveSetting('maps', [["add", "['" + idnum + "']", {'cls': info.images, 'id': id}]], tempcallback);
            saveSetting('icons', [["add", "['" + info.images + "']['" + id + "']", info.y]], tempcallback);
            if (info.images === 'items') {
                saveSetting('items', [["add", "['" + id + "']", editor.file.comment._data.items_template]], function (err) {
                    if (err) {
                        printe(err);
                        throw(err)
                    }
                });
            }
            if (info.images === 'enemys' || info.images === 'enemy48') {
                saveSetting('enemys', [["add", "['" + id + "']", editor.file.comment._data.enemys_template]], function (err) {
                    if (err) {
                        printe(err);
                        throw(err)
                    }
                });
            }

            callback(null);

        }else{
            //检查maps中是否有重复的idnum或id
            for (var ii in editor.core.maps.blocksInfo) {
                if (editor.core.maps.blocksInfo[ii].id == id) {
                    callback('id重复了');
                    return;
                }
            }
            idnum = info.idnum;

            maps_90f36752_8815_4be8_b32b_d7fad1d0542e[idnum].id = id;

            var arr=[icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1,{items: items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a},{enemys: enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80}]
            arr.forEach(function (obj) {
                for(var jj in obj){
                    var ii=obj[jj]
                    if (ii.hasOwnProperty(info.id)){
                        ii[id]=ii[info.id];
                        delete(ii[info.id]);
                    }
                }
            });

            editor.file.save_icons_maps_items_enemys(callback)
            
        }
    }

    editor.file.removeMaterial = function (info, callback) {
        console.log(info);

        // Step 1: 尝试删除图片
        var _deleteMaterialImage = function (cb) {
            if (info.images == 'autotile') return cb();
            var img = core.material.images[info.images];
            if (img == null) return callback('该素材不存在！');

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            var width = img.width, height = img.height, per_height = info.images.endsWith('48') ? 48 : 32
            if (height == per_height) return callback('该素材图片只有一个素材，无法删除');
            canvas.width = width;
            canvas.height = height - per_height;
            ctx.drawImage(img, 0, 0, width, info.y * per_height, 0, 0, width, info.y * per_height);
            ctx.drawImage(img, 0, (info.y + 1) * per_height, width, height - (info.y + 1) * per_height, 0, info.y * per_height, width, height - (info.y + 1) * per_height);
            var imgbase64 = canvas.toDataURL('image/png');
            fs.writeFile('./project/materials/' + info.images + '.png', imgbase64.split(',')[1], 'base64', function (err, data) {
                if (err) return callback(err);
                cb();
            });
        }

        _deleteMaterialImage(function () {
            // Step 2: 删除图块信息
            if (info.id) {
                delete icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1[info.images][info.id];
                delete maps_90f36752_8815_4be8_b32b_d7fad1d0542e[info.idnum];
                if (info.images == 'items') {
                    delete items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[info.id];
                }
                if (info.images == 'enemys' || info.images == 'enemy48') {
                    delete enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[info.id];
                }
            }

            // Step 3: 将所有素材向下移动一格
            if (info.images != 'autotile') {
                var value = icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1[info.images];
                Object.keys(value).forEach(function (one) {
                    if (value[one] > info.y) value[one]--;
                });
            }

            // Step 4: 保存并删除成功！
            editor.file.save_icons_maps_items_enemys(callback);
        });
    }

    //callback(err:String)
    editor.file.editItem = function (id, actionList, callback) {
        /*actionList:[
          ["change","['name']","红宝石的新名字"],
          ["add","['新的和name同级的属性']",123],
          ["change","['itemEffectTip']","'，攻击力+'+editor.core.values.redGem"],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                value[1] = "['" + id + "']" + value[1];
            });
            saveSetting('items', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = Object.assign({}, editor.core.items.items[id]);
                    Object.keys(editor.file.comment._data.items._data).forEach(function (v) {
                        if (!isset((editor.core.items.items[id]||{})[v]))
                            locObj[v] = null;
                    });
                    return locObj;
                })(),
                editor.file.comment._data.items,
                null]);
        }
        //只有items.cls是items的才有itemEffect和itemEffectTip,keys和constants和tools只有items
    }
    //callback([obj,commentObj,err:String])
    editor.file.editEnemy = function (id, actionList, callback) {
        /*actionList:[
          ["change","['name']","初级巫师的新名字"],
          ["add","['新的和name同级的属性']",123],
          ["change","['bomb']",null],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                value[1] = "['" + id + "']" + value[1];
            });
            saveSetting('enemys', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = Object.assign({}, editor.core.enemys.enemys[id]);
                    Object.keys(editor.file.comment._data.enemys._data).forEach(function (v) {
                        if (!isset((editor.core.enemys.enemys[id]||{})[v]))
                        /* locObj[v]=editor.core.enemys.enemys[id][v];
                      else */
                            locObj[v] = null;
                    });
                    return locObj;
                })(),
                editor.file.comment._data.enemys,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    editor.file.editMapBlocksInfo = function (idnum, actionList, callback) {
        /*actionList:[
          ["change","['events']",["\t[老人,wizard]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
          ["change","['afterBattle']",null],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            var tempmap=[];
            for(var ii=0;ii<actionList.length;ii++){
                var value=actionList[ii];
                // 是tilesets 且未定义 且在这里是第一次定义
                if(idnum>=editor.core.icons.tilesetStartOffset && !isset(editor.core.maps.blocksInfo[idnum]) && tempmap.indexOf(idnum)===-1){
                    actionList.splice(ii,0,["add","['" + idnum + "']",{"cls": "tileset", "id": "X"+idnum}]);
                    tempmap.push(idnum);
                    ii++;
                }
                value[1] = "['" + idnum + "']" + value[1];
            }
            saveSetting('maps', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var sourceobj=editor.core.maps.blocksInfo[idnum];
                    if(!isset(sourceobj) && idnum>=editor.core.icons.tilesetStartOffset)sourceobj={"cls": "tileset", "id": "X"+idnum}
                    var locObj = Object.assign({}, sourceobj);
                    Object.keys(editor.file.comment._data.maps._data).forEach(function (v) {
                        if (!isset(sourceobj[v]))
                            locObj[v] = null;
                    });
                    locObj.idnum = idnum;
                    return locObj;
                })(),
                editor.file.comment._data.maps,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor.file.editLoc = function (x, y, actionList, callback) {
        /*actionList:[
          ["change","['events']",["\t[老人,wizard]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
          ["change","['afterBattle']",null],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                if(/\['autoEvent'\]\['\d+'\]$/.test(value[1]))value[1]=value[1].replace(/\['\d+'\]$/,function(v){return "['" + x + "," + y + "']"+v})
                else value[1] = value[1] + "['" + x + "," + y + "']";
            });
            saveSetting('floorloc', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = {};
                    Object.keys(editor.file.comment._data.floors._data.loc._data).forEach(function (v) {
                        if (isset(editor.currentFloorData[v][x + ',' + y]))
                            locObj[v] = editor.currentFloorData[v][x + ',' + y];
                        else
                            locObj[v] = null;
                    });
                    return locObj;
                })(),
                editor.file.comment._data.floors._data.loc,
                null]);
        }

    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor.file.editFloor = function (actionList, callback) {
        /*actionList:[
          ["change","['title']",'样板 3 层'],
          ["change","['color']",null],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('floors', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = Object.assign({}, editor.currentFloorData);
                    Object.keys(editor.file.comment._data.floors._data.floor._data).forEach(function (v) {
                        if (!isset(editor.currentFloorData[v]))
                        /* locObj[v]=editor.currentFloorData[v];
                      else */
                            locObj[v] = null;
                    });
                    Object.keys(editor.file.comment._data.floors._data.loc._data).forEach(function (v) {
                        delete(locObj[v]);
                    });
                    editor.dom.maps.forEach(function (one) { delete locObj[one]; });
                    return locObj;
                })(),
                editor.file.comment._data.floors._data.floor,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor.file.editTower = function (actionList, callback) {
        /*actionList:[
          ["change","['firstData']['version']",'Ver 1.0.1 (Beta)'],
          ["change","['values']['lavaDamage']",200],
        ]
        为[]时只查询不修改
        */
        var data_obj = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d;
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('data', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    //var locObj=Object.assign({'main':{}},editor.core.data);
                    var locObj = Object.assign({}, data_obj, {'main': {}});
                    Object.keys(editor.file.dataComment._data.main._data).forEach(function (v) {
                        if (isset(editor.main[v]))
                            locObj.main[v] = data_obj.main[v];
                        else
                            locObj.main[v] = null;
                    });
                    return locObj;
                })(),
                editor.file.dataComment,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    var fmap = {};
    var fjson = JSON.stringify(functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a, function (k, v) {
        if (v instanceof Function) {
            var id_ = editor.util.guid();
            fmap[id_] = v.toString();
            return id_;
        } else return v
    }, 4);
    var fobj = JSON.parse(fjson);
    editor.file.functionsMap = fmap;
    editor.file.functionsJSON = fjson;
    var buildlocobj = function (locObj) {
        for (var key in locObj) {
            if (typeof(locObj[key]) !== typeof('')) buildlocobj(locObj[key]);
            else locObj[key] = fmap[locObj[key]];
        }
    };

    editor.file.editFunctions = function (actionList, callback) {
        /*actionList:[
          ["change","['events']['afterChangeLight']","function(x,y){console.log(x,y)}"],
          ["change","['ui']['drawAbout']","function(){...}"],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('functions', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = JSON.parse(fjson);
                    buildlocobj(locObj);
                    return locObj;
                })(),
                editor.file.functionsComment,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor.file.editCommonEvent = function (actionList, callback) {
        /*actionList:[
          ["change","['test']",['123']],
        ]
        为[]时只查询不修改
        */
        var data_obj = events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent;
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                value[1] = "['commonEvent']" + value[1];
            });
            saveSetting('events', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                Object.assign({},data_obj),
                editor.file.eventsComment._data.commonEvent,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    var plmap = {};
    var pljson = JSON.stringify(plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1, function (k, v) {
        if (v instanceof Function) {
            var id_ = editor.util.guid();
            plmap[id_] = v.toString();
            return id_;
        } else if(v===null){
            var id_ = editor.util.guid();
            plmap[id_] = null;
            return id_;
        } return v
    }, 4);
    var plobj = JSON.parse(pljson);
    editor.file.pluginsMap = plmap;
    editor.file.pluginsObj = plobj;
    var buildpllocobj = function (locObj) {
        for (var key in locObj) {
            if (typeof(locObj[key]) !== typeof('')) buildpllocobj(locObj[key]);
            else locObj[key] = plmap[locObj[key]];
        }
    };

    editor.file.editPlugins = function (actionList, callback) {
        /*actionList:[
          ["change","['test']","function(x,y){console.log(x,y)}"],
        ]
        为[]时只查询不修改
        */
        checkCallback(callback);
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('plugins', actionList, function (err) {
                callback([err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = JSON.parse(JSON.stringify(plobj));
                    buildpllocobj(locObj);
                    return locObj;
                })(),
                editor.file.pluginsComment,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    var isset = function (val) {
        if (val == undefined || val == null) {
            return false;
        }
        return true
    }

    var checkCallback=function(callback){
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
    }

    var encode = editor.util.encode64;

    editor.file.save_icons_maps_items_enemys=function(callback){
        var check=[]
        saveSetting('icons',[],function(err){
            if(err){callback(err);return;}
            check.push('icons')
            if(check.length==4)callback(null);
        })
        saveSetting('maps',[],function(err){
            if(err){callback(err);return;}
            check.push('maps')
            if(check.length==4)callback(null);
        })
        saveSetting('items',[],function(err){
            if(err){callback(err);return;}
            check.push('items')
            if(check.length==4)callback(null);
        })
        saveSetting('enemys',[],function(err){
            if(err){callback(err);return;}
            check.push('enemys')
            if(check.length==4)callback(null);
        })
    }

    var saveSetting = function (file, actionList, callback) {
        var _update = function (name, value) {
            if (value[2] === undefined) {
                eval("delete " + name + value[1]);
            } else {
                eval(name + value[1] + "=" + JSON.stringify(value[2]));
            }
        }

        //console.log(file);
        //console.log(actionList);
        editor.file.alertWhenCompress();

        if (file == 'icons') {
            actionList.forEach(function (value) {
                _update("icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1", value);
            });
            var datastr = 'var icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1 = \n';
            datastr += JSON.stringify(icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1, null, '\t');
            fs.writeFile('project/icons.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'maps') {
            actionList.forEach(function (value) {
                _update("maps_90f36752_8815_4be8_b32b_d7fad1d0542e", value);
            });
            var datastr = 'var maps_90f36752_8815_4be8_b32b_d7fad1d0542e = \n';
            //datastr+=JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e,null,4);

            var emap = {};
            var estr = JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e, function (k, v) {
                if (v.id != null) {
                    var id_ = editor.util.guid();
                    emap[id_] = JSON.stringify(v);
                    return id_;
                } else return v
            }, '\t');
            for (var id_ in emap) {
                estr = estr.replace('"' + id_ + '"', emap[id_])
            }
            datastr += estr;

            fs.writeFile('project/maps.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'items') {
            actionList.forEach(function (value) {
                _update("items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a", value);
            });
            var datastr = 'var items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = \n';
            var items = core.clone(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a);
            for (var id in items) delete items[id].id;
            datastr += JSON.stringify(items, null, '\t');
            fs.writeFile('project/items.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'enemys') {
            actionList.forEach(function (value) {
                _update("enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80", value);
            });
            var datastr = 'var enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n';
            var emap = {};
            var enemys = core.clone(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80);
            for (var id in enemys) delete enemys[id].id;
            var estr = JSON.stringify(enemys, function (k, v) {
                if (v && v.hp != null) {
                    var id_ = editor.util.guid();
                    emap[id_] = JSON.stringify(v);
                    return id_;
                } else return v
            }, '\t');
            for (var id_ in emap) {
                estr = estr.replace('"' + id_ + '"', emap[id_])
            }
            datastr += estr;
            fs.writeFile('project/enemys.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'data') {
            actionList.forEach(function (value) {
                _update("data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d", value);
            });
            if (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds.indexOf(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.floorId) < 0)
                data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.floorId = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds[0];
            var datastr = 'var data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = \n';
            datastr += JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d, null, '\t');
            fs.writeFile('project/data.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'functions') {
            actionList.forEach(function (value) {
                eval("fmap[fobj" + value[1] + ']=' + JSON.stringify(value[2]));
            });
            var fraw = fjson;
            for (var id_ in fmap) {
                fraw = fraw.replace('"' + id_ + '"', fmap[id_])
            }
            var datastr = 'var functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a = \n';
            datastr += fraw;
            fs.writeFile('project/functions.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'floorloc') {
            actionList.forEach(function (value) {
                // 检测null/undefined
                if(/\['autoEvent'\]\['\d+,\d+'\]\['\d+'\]$/.test(value[1])){
                    var tempvalue=value[1].replace(/\['\d+'\]$/,'')
                    tempvalue="editor.currentFloorData" +tempvalue
                    tempvalue=tempvalue+'='+tempvalue+'||{}'
                    eval(tempvalue)
                }
                if (value[2]==null && value[0]!=='add')
                    eval("delete editor.currentFloorData" + value[1]);
                else
                    eval("editor.currentFloorData" + value[1] + '=' + JSON.stringify(value[2]));
            });
            editor.file.saveFloorFile(callback);
            return;
        }
        if (file == 'floors') {
            actionList.forEach(function (value) {
                eval("editor.currentFloorData" + value[1] + '=' + JSON.stringify(value[2]));
            });
            editor.file.saveFloorFile(callback);
            return;
        }
        if (file == 'events') {
            actionList.forEach(function (value) {
                _update("events_c12a15a8_c380_4b28_8144_256cba95f760", value);
            });
            var datastr = 'var events_c12a15a8_c380_4b28_8144_256cba95f760 = \n';
            datastr += JSON.stringify(events_c12a15a8_c380_4b28_8144_256cba95f760, null, '\t');
            fs.writeFile('project/events.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'plugins') {
            actionList.forEach(function (value) {
                if(value[0]==='add'){
                    eval("plobj" + value[1] + '=' + JSON.stringify(value[2]));
                } else {
                    eval("plmap[plobj" + value[1] + ']=' + JSON.stringify(value[2]));
                }
            });
            var plraw = JSON.stringify(plobj,null,4);
            for (var id_ in plmap) {
                plraw = plraw.replace('"' + id_ + '"', plmap[id_])
            }
            var datastr = 'var plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = \n';
            datastr += plraw;
            fs.writeFile('project/plugins.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        callback('出错了,要设置的文件名不识别');
    }

    editor.file.saveSetting = saveSetting;

    return editor_file;
}
//editor_file = editor_file(editor);