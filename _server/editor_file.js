editor_file = function (editor, callback) {

    var editor_file = {};


    var commentjs = {
        'comment': 'comment',
        'data.comment': 'dataComment',
        'functions.comment': 'functionsComment',
        'events.comment': 'eventsComment',
    }
    for (var key in commentjs) {
        (function (key) {
            var value = commentjs[key];
            var script = document.createElement('script');
            if (window.location.href.indexOf('_server') !== -1)
                script.src = key + '.js';
            else
                script.src = '_server/' + key + '.js';
            document.body.appendChild(script);
            script.onload = function () {
                editor_file[value] = eval(key.replace('.', '_') + '_c456ea59_6018_45ef_8bcc_211a24c627dc');
                var loaded = Boolean(callback);
                for (var key_ in commentjs) {
                    loaded = loaded && editor_file[commentjs[key_]]
                }
                if (loaded) callback();
            }
        })(key);
    }


    editor_file.getFloorFileList = function (callback) {
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        /* var fs = editor.fs;
        fs.readdir('project/floors',function(err, data){
          callback([data,err]);
        }); */
        callback([editor.core.floorIds, null]);
    }
    //callback([Array<String>,err:String])
    editor_file.loadFloorFile = function (filename, callback) {
        //filename不含'/'不含'.js'
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        
        editor.currentFloorId = editor.core.status.floorId;
        editor.currentFloorData = editor.core.floors[editor.currentFloorId];
    }
    //callback(err:String)
    editor_file.saveFloorFile = function (callback) {
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        /* if (!isset(editor.currentFloorId) || !isset(editor.currentFloorData)) {
          callback('未选中文件或无数据');
        } */
        var filename = 'project/floors/' + editor.currentFloorId + '.js';
        var datastr = ['main.floors.', editor.currentFloorId, '=\n'];
        if (editor.currentFloorData.map == 'new') {
            /*
            editor.currentFloorData.map = editor.map.map(function (v) {
                return v.map(function () {
                    return 0
                })
            });
            */
            var width = parseInt(document.getElementById('newMapWidth').value);
            var height = parseInt(document.getElementById('newMapHeight').value);
            var row = [];
            for (var i=0;i<width;i++) row.push(0);
            editor.currentFloorData.map = [];
            for (var i=0;i<height;i++) editor.currentFloorData.map.push(row);
        }
        else{
            for(var ii=0,name;name=['map','bgmap','fgmap'][ii];ii++){
                var mapArray=editor[name].map(function (v) {
                    return v.map(function (v) {
                        return v.idnum || v || 0
                    })
                });
                editor.currentFloorData[name]=mapArray;
            }
        }
        // format 更改实现方式以支持undefined删除
        var tempJsonObj=Object.assign({},editor.currentFloorData);
        var tempMap=[['map',editor.guid()],['bgmap',editor.guid()],['fgmap',editor.guid()]];
        tempMap.forEach(function(v){
            v[2]=tempJsonObj[v[0]];
            tempJsonObj[v[0]]=v[1];
        });
        var tempJson=JSON.stringify(tempJsonObj, null, 4);
        tempMap.forEach(function(v){
            tempJson=tempJson.replace('"'+v[1]+'"','[\n'+ formatMap(v[2],v[0]!='map')+ '\n]')
        });
        datastr = datastr.concat([tempJson]);
        datastr = datastr.join('');
        alertWhenCompress();
        fs.writeFile(filename, encode(datastr), 'base64', function (err, data) {
            callback(err);
        });
    }
    //callback(err:String)
    editor_file.saveNewFile = function (saveFilename, callback) {
        //saveAsFilename不含'/'不含'.js'
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        };
        var currData=editor.currentFloorData;
        var saveStatus = document.getElementById('newMapStatus').checked;

        var title = saveStatus?currData.title:"新建楼层";
        var name = saveStatus?currData.name:"0";
        if (/^mt\d+$/i.test(saveFilename)) {
            name = saveFilename.substring(2);
            title = "主塔 "+name+" 层";
        }
        editor.currentFloorData = {
            floorId: saveFilename,
            title: title,
            name: name,
            width: parseInt(document.getElementById('newMapWidth').value),
            height: parseInt(document.getElementById('newMapHeight').value),
            canFlyTo: saveStatus?currData.canFlyTo:true,
            canUseQuickShop: saveStatus?currData.canUseQuickShop:true,
            cannotViewMap: saveStatus?currData.cannotViewMap:false,
            cannotMoveDirectly: saveStatus?currData.cannotMoveDirectly:false,
            images: [],
            item_ratio: saveStatus?currData.item_ratio:1,
            defaultGround: saveStatus?currData.defaultGround:"ground",
            bgm: saveStatus?currData.bgm:null,
            upFloor: null,
            downFloor: null,
            color: saveStatus?currData.color:null,
            weather: saveStatus?currData.weather:null,
            firstArrive: [],
            eachArrive: [],
            parallelDo: "",
            events: {},
            changeFloor: {},
            afterBattle: {},
            afterGetItem: {},
            afterOpenDoor: {},
            cannotMove: {}
        };
        Object.keys(editor.currentFloorData).forEach(function (t) {
            if (!core.isset(editor.currentFloorData[t]))
                delete editor.currentFloorData[t];
        })
        editor.currentFloorData.map = "new";
        editor.currentFloorId = saveFilename;
        editor_file.saveFloorFile(callback);
    }
    editor_file.saveNewFiles = function (floorIdList, from, to, callback) {
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        };
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
            var data = {
                floorId: floorIdList[i-from],
                title: calValue(document.getElementById('newFloorTitles').value, i),
                name: calValue(document.getElementById('newFloorNames').value, i),
                width: width,
                height: height,
                map: map,
                canFlyTo: saveStatus?currData.canFlyTo:true,
                canUseQuickShop: saveStatus?currData.canUseQuickShop:true,
                cannotViewMap: saveStatus?currData.cannotViewMap:false,
                cannotMoveDirectly: saveStatus?currData.cannotMoveDirectly:false,
                images: [],
                item_ratio: saveStatus?currData.item_ratio:1,
                defaultGround: saveStatus?currData.defaultGround:"ground",
                bgm: saveStatus?currData.bgm:null,
                upFloor: null,
                downFloor: null,
                color: saveStatus?currData.color:null,
                weather: saveStatus?currData.weather:null,
                firstArrive: [],
                eachArrive: [],
                parallelDo: "",
                events: {},
                changeFloor: {},
                afterBattle: {},
                afterGetItem: {},
                afterOpenDoor: {},
                cannotMove: {}
            };
            Object.keys(data).forEach(function (t) {
                if (!core.isset(data[t]))
                    delete data[t];
                else {
                    if (t=='map') {
                        datastr = datastr.concat(['\n"', t, '": [\n', formatMap(data[t]), '\n],']);
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
        alertWhenCompress();
        fs.writeMultiFiles(filenames, datas, function (err, data) {
            callback(err);
        });
    }

    //callback(err:String)

    ////////////////////////////////////////////////////////////////////

    editor_file.autoRegister = function (info, callback) {

        var iconActions = [];
        var mapActions = [];
        var templateActions = [];

        var image = info.images;

        if (image=='autotile') {
            callback('不能对自动元件进行自动注册！');
            return;
        }
        var c=image.toUpperCase().charAt(0);

        // terrains id
        var terrainsId = [];
        Object.keys(core.material.icons.terrains).forEach(function (id) {
            terrainsId[core.material.icons.terrains[id]]=id;
        })

        var allIds = [];
        editor.ids.forEach(function (v) {
            if (v.images==image) {
                allIds[v.y]=true;
            }
        })

        var per_height = image.indexOf('48')>=0?48:32;

        var idnum=300;
        for (var y=0; y<editor.widthsX[image][3]/per_height;y++) {
            if (allIds[y]) continue;
            while (editor.core.maps.blocksInfo[idnum]) idnum++;

            // get id num
            var id = c+idnum;

            if (image=='terrains' && core.isset(terrainsId[y])) {
                id=terrainsId[y];
            }
            else {
                iconActions.push(["add", "['" + image + "']['" + id + "']", y])
            }
            mapActions.push(["add", "['" + idnum + "']", {'cls': image, 'id': id}])
            if (image=='items')
                templateActions.push(["add", "['items']['" + id + "']", editor_file.comment._data.items_template]);
            else if (image.indexOf('enemy')==0)
                templateActions.push(["add", "['" + id + "']", editor_file.comment._data.enemys_template]);
            idnum++;
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

    editor_file.registerAutotile = function (filename, callback) {
        var idnum = 140;
        while (editor.core.maps.blocksInfo[idnum]) idnum++;

        var iconActions = [];
        var mapActions = [];

        iconActions.push(["add", "['autotile']['" + filename + "']", 0]);
        mapActions.push(["add", "['" + idnum + "']", {'cls': 'autotile', 'id': filename, 'noPass': true}]);

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

    editor_file.changeIdAndIdnum = function (id, idnum, info, callback) {
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        //检查maps中是否有重复的idnum或id
        var change = -1;
        for (var ii in editor.core.maps.blocksInfo) {
            if (ii == idnum) {
                //暂时只允许创建新的不允许修改已有的
                //if (info.idnum==idnum){change=ii;break;}//修改id
                callback('idnum重复了');
                return;
            }
            if (editor.core.maps.blocksInfo[ii].id == id) {
                //if (info.id==id){change=ii;break;}//修改idnum
                callback('id重复了');
                return;
            }
        }
        /*
        if (change!=-1 && change!=idnum){//修改idnum
          editor.core.maps.blocksInfo[idnum] = editor.core.maps.blocksInfo[change];
          delete(editor.core.maps.blocksInfo[change]);
        } else if (change==idnum) {//修改id
          var oldid = editor.core.maps.blocksInfo[idnum].id;
          editor.core.maps.blocksInfo[idnum].id = id;
          for(var ii in editor.core.icons.icons){
            if (ii.hasOwnProperty(oldid)){
              ii[id]=ii[oldid];
              delete(ii[oldid]);
            }
          }
        } else {//创建新的
          editor.core.maps.blocksInfo[idnum]={'cls': info.images, 'id':id};
          editor.core.icons.icons[info.images][id]=info.y;
        }
        */
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
            saveSetting('items', [["add", "['items']['" + id + "']", editor_file.comment._data.items_template]], function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
            });
        }
        if (info.images === 'enemys' || info.images === 'enemy48') {
            saveSetting('enemys', [["add", "['" + id + "']", editor_file.comment._data.enemys_template]], function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
            });
        }

        callback(null);
    }
    //callback(err:String)
    editor_file.editItem = function (id, actionList, callback) {
        /*actionList:[
          ["change","['items']['name']","红宝石的新名字"],
          ["add","['items']['新的和name同级的属性']",123],
          ["change","['itemEffectTip']","'，攻击力+'+editor.core.values.redJewel"],
        ]
        为[]时只查询不修改
        */
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                var tempindex = value[1].indexOf(']') + 1;
                value[1] = [value[1].slice(0, tempindex), "['" + id + "']", value[1].slice(tempindex)].join('');
            });
            saveSetting('items', actionList, function (err) {
                callback([
                    (function () {
                        var locObj_ = {};
                        Object.keys(editor_file.comment._data.items._data).forEach(function (v) {
                            if (isset(editor.core.items[v][id]) && v !== 'items')
                                locObj_[v] = editor.core.items[v][id];
                            else
                                locObj_[v] = null;
                        });
                        locObj_['items'] = (function () {
                            var locObj = Object.assign({}, editor.core.items.items[id]);
                            Object.keys(editor_file.comment._data.items._data.items._data).forEach(function (v) {
                                if (!isset(editor.core.items.items[id][v]))
                                    locObj[v] = null;
                            });
                            return locObj;
                        })();
                        return locObj_;
                    })(),
                    editor_file.comment._data.items,
                    err]);
            });
        } else {
            callback([
                (function () {
                    var locObj_ = {};
                    Object.keys(editor_file.comment._data.items._data).forEach(function (v) {
                        if (isset(editor.core.items[v][id]) && v !== 'items')
                            locObj_[v] = editor.core.items[v][id];
                        else
                            locObj_[v] = null;
                    });
                    locObj_['items'] = (function () {
                        var locObj = Object.assign({}, editor.core.items.items[id]);
                        Object.keys(editor_file.comment._data.items._data.items._data).forEach(function (v) {
                            if (!isset(editor.core.items.items[id][v]))
                                locObj[v] = null;
                        });
                        return locObj;
                    })();
                    return locObj_;
                })(),
                editor_file.comment._data.items,
                null]);
        }
        //只有items.cls是items的才有itemEffect和itemEffectTip,keys和constants和tools只有items
    }
    //callback([obj,commentObj,err:String])
    editor_file.editEnemy = function (id, actionList, callback) {
        /*actionList:[
          ["change","['name']","初级巫师的新名字"],
          ["add","['新的和name同级的属性']",123],
          ["change","['bomb']",null],
        ]
        为[]时只查询不修改
        */
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                value[1] = "['" + id + "']" + value[1];
            });
            saveSetting('enemys', actionList, function (err) {
                callback([
                    (function () {
                        var locObj = Object.assign({}, editor.core.enemys.enemys[id]);
                        Object.keys(editor_file.comment._data.enemys._data).forEach(function (v) {
                            if (!isset(editor.core.enemys.enemys[id][v]))
                            /* locObj[v]=editor.core.enemys.enemys[id][v];
                          else */
                                locObj[v] = null;
                        });
                        return locObj;
                    })(),
                    editor_file.comment._data.enemys,
                    err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = Object.assign({}, editor.core.enemys.enemys[id]);
                    Object.keys(editor_file.comment._data.enemys._data).forEach(function (v) {
                        if (!isset(editor.core.enemys.enemys[id][v]))
                        /* locObj[v]=editor.core.enemys.enemys[id][v];
                      else */
                            locObj[v] = null;
                    });
                    return locObj;
                })(),
                editor_file.comment._data.enemys,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    editor_file.editMapBlocksInfo = function (idnum, actionList, callback) {
        /*actionList:[
          ["change","['events']",["\t[老人,magician]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
          ["change","['afterBattle']",null],
        ]
        为[]时只查询不修改
        */
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            var tempmap=[];
            for(var ii=0;ii<actionList.length;ii++){
                var value=actionList[ii];
                // 是tilesets 且未定义 且在这里是第一次定义
                if(idnum>=editor.core.icons.tilesetStartOffset && !isset(editor.core.maps.blocksInfo[idnum]) && tempmap.indexOf(idnum)===-1){
                    actionList.splice(ii,0,["add","['" + idnum + "']",{"cls": "tileset", "id": "X"+idnum, "noPass": true}]);
                    tempmap.push(idnum);
                    ii++;
                }
                value[1] = "['" + idnum + "']" + value[1];
            }
            saveSetting('maps', actionList, function (err) {
                callback([
                    (function () {
                        var sourceobj=editor.core.maps.blocksInfo[idnum];
                        if(!isset(sourceobj) && idnum>=editor.core.icons.tilesetStartOffset)sourceobj={"cls": "tileset", "id": "X"+idnum, "noPass": true}
                        var locObj = Object.assign({}, sourceobj);
                        Object.keys(editor_file.comment._data.maps._data).forEach(function (v) {
                            if (!isset(sourceobj[v]))
                                locObj[v] = null;
                        });
                        locObj.idnum = idnum;
                        return locObj;
                    })(),
                    editor_file.comment._data.maps,
                    null]);
            });
        } else {
            callback([
                (function () {
                    var sourceobj=editor.core.maps.blocksInfo[idnum];
                    if(!isset(sourceobj) && idnum>=editor.core.icons.tilesetStartOffset)sourceobj={"cls": "tileset", "id": "X"+idnum, "noPass": true}
                    var locObj = Object.assign({}, sourceobj);
                    Object.keys(editor_file.comment._data.maps._data).forEach(function (v) {
                        if (!isset(sourceobj[v]))
                            locObj[v] = null;
                    });
                    locObj.idnum = idnum;
                    return locObj;
                })(),
                editor_file.comment._data.maps,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor_file.editLoc = function (x, y, actionList, callback) {
        /*actionList:[
          ["change","['events']",["\t[老人,magician]领域、夹击。\n请注意领域怪需要设置value为伤害数值，可参见样板中初级巫师的写法。"]],
          ["change","['afterBattle']",null],
        ]
        为[]时只查询不修改
        */
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                value[1] = value[1] + "['" + x + "," + y + "']";
            });
            saveSetting('floorloc', actionList, function (err) {
                callback([
                    (function () {
                        var locObj = {};
                        Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function (v) {
                            if (isset(editor.currentFloorData[v][x + ',' + y]))
                                locObj[v] = editor.currentFloorData[v][x + ',' + y];
                            else
                                locObj[v] = null;
                        });
                        return locObj;
                    })(),
                    editor_file.comment._data.floors._data.loc,
                    err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = {};
                    Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function (v) {
                        if (isset(editor.currentFloorData[v][x + ',' + y]))
                            locObj[v] = editor.currentFloorData[v][x + ',' + y];
                        else
                            locObj[v] = null;
                    });
                    return locObj;
                })(),
                editor_file.comment._data.floors._data.loc,
                null]);
        }

    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor_file.editFloor = function (actionList, callback) {
        /*actionList:[
          ["change","['title']",'样板 3 层'],
          ["change","['color']",null],
        ]
        为[]时只查询不修改
        */
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('floors', actionList, function (err) {
                callback([
                    (function () {
                        var locObj = Object.assign({}, editor.currentFloorData);
                        Object.keys(editor_file.comment._data.floors._data.floor._data).forEach(function (v) {
                            if (!isset(editor.currentFloorData[v]))
                            /* locObj[v]=editor.currentFloorData[v];
                          else */
                                locObj[v] = null;
                        });
                        Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function (v) {
                            delete(locObj[v]);
                        });
                        delete(locObj.map);
                        delete(locObj.bgmap);
                        delete(locObj.fgmap);
                        return locObj;
                    })(),
                    editor_file.comment._data.floors._data.floor,
                    err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = Object.assign({}, editor.currentFloorData);
                    Object.keys(editor_file.comment._data.floors._data.floor._data).forEach(function (v) {
                        if (!isset(editor.currentFloorData[v]))
                        /* locObj[v]=editor.currentFloorData[v];
                      else */
                            locObj[v] = null;
                    });
                    Object.keys(editor_file.comment._data.floors._data.loc._data).forEach(function (v) {
                        delete(locObj[v]);
                    });
                    delete(locObj.map);
                    delete(locObj.bgmap);
                    delete(locObj.fgmap);
                    return locObj;
                })(),
                editor_file.comment._data.floors._data.floor,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor_file.editTower = function (actionList, callback) {
        /*actionList:[
          ["change","['firstData']['version']",'Ver 1.0.1 (Beta)'],
          ["change","['values']['lavaDamage']",200],
        ]
        为[]时只查询不修改
        */
        var data_obj = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d;
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('data', actionList, function (err) {
                callback([
                    (function () {
                        //var locObj=Object.assign({'main':{}},editor.core.data);
                        var locObj = Object.assign({}, data_obj, {'main': {}});
                        Object.keys(editor_file.dataComment._data.main._data).forEach(function (v) {
                            if (isset(editor.main[v]))
                                locObj.main[v] = data_obj.main[v];
                            else
                                locObj.main[v] = null;
                        });
                        return locObj;
                    })(),
                    editor_file.dataComment,
                    err]);
            });
        } else {
            callback([
                (function () {
                    //var locObj=Object.assign({'main':{}},editor.core.data);
                    var locObj = Object.assign({}, data_obj, {'main': {}});
                    Object.keys(editor_file.dataComment._data.main._data).forEach(function (v) {
                        if (isset(editor.main[v]))
                            locObj.main[v] = data_obj.main[v];
                        else
                            locObj.main[v] = null;
                    });
                    return locObj;
                })(),
                editor_file.dataComment,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    var fmap = {};
    var fjson = JSON.stringify(functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a, function (k, v) {
        if (v instanceof Function) {
            var id_ = editor.guid();
            fmap[id_] = v.toString();
            return id_;
        } else return v
    }, 4);
    var fobj = JSON.parse(fjson);
    editor_file.functionsMap = fmap;
    editor_file.functionsJSON = fjson;
    var buildlocobj = function (locObj) {
        for (var key in locObj) {
            if (typeof(locObj[key]) !== typeof('')) buildlocobj(locObj[key]);
            else locObj[key] = fmap[locObj[key]];
        }
    };

    editor_file.editFunctions = function (actionList, callback) {
        /*actionList:[
          ["change","['events']['afterChangeLight']","function(x,y){console.log(x,y)}"],
          ["change","['ui']['drawAbout']","function(){...}"],
        ]
        为[]时只查询不修改
        */
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            saveSetting('functions', actionList, function (err) {
                callback([
                    (function () {
                        var locObj = JSON.parse(fjson);
                        buildlocobj(locObj);
                        return locObj;
                    })(),
                    editor_file.functionsComment,
                    err]);
            });
        } else {
            callback([
                (function () {
                    var locObj = JSON.parse(fjson);
                    buildlocobj(locObj);
                    return locObj;
                })(),
                editor_file.functionsComment,
                null]);
        }
    }
    //callback([obj,commentObj,err:String])

    ////////////////////////////////////////////////////////////////////

    editor_file.editCommonEvent = function (actionList, callback) {
        /*actionList:[
          ["change","['test']",['123']],
        ]
        为[]时只查询不修改
        */
        var data_obj = events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent;
        if (!isset(callback)) {
            printe('未设置callback');
            throw('未设置callback')
        }
        ;
        if (isset(actionList) && actionList.length > 0) {
            actionList.forEach(function (value) {
                value[1] = "['commonEvent']" + value[1];
            });
            saveSetting('events', actionList, function (err) {
                callback([
                    Object.assign({},data_obj),
                    editor_file.eventsComment._data.commonEvent,
                    err]);
            });
        } else {
            callback([
                Object.assign({},data_obj),
                editor_file.eventsComment._data.commonEvent,
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

    var formatMap = function (mapArr,trySimplify) {
        if(!mapArr || JSON.stringify(mapArr)==JSON.stringify([]))return '';
        if(trySimplify){
            //检查是否是全0二维数组
            var jsoncheck=JSON.stringify(mapArr).replace(/\D/g,'');
            if(jsoncheck==Array(jsoncheck.length+1).join('0'))return '';
        }
        //把二维数组格式化
        var formatArrStr = '';
        var arr = JSON.stringify(mapArr).replace(/\s+/g, '').split('],[');
        var si=mapArr.length-1,sk=mapArr[0].length-1;
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

    var encode = function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    }

    var alertWhenCompress = function(){
        if(editor.useCompress===true){
            editor.useCompress=null;
            setTimeout("alert('当前游戏使用的是压缩文件,修改完成后请重新压缩')",1000)
        }
    }

    var saveSetting = function (file, actionList, callback) {
        //console.log(file);
        //console.log(actionList);
        alertWhenCompress();

        if (file == 'icons') {
            actionList.forEach(function (value) {
                eval("icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1" + value[1] + '=' + JSON.stringify(value[2]));
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
                eval("maps_90f36752_8815_4be8_b32b_d7fad1d0542e" + value[1] + '=' + JSON.stringify(value[2]));
            });
            var datastr = 'var maps_90f36752_8815_4be8_b32b_d7fad1d0542e = \n';
            //datastr+=JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e,null,4);

            var emap = {};
            var estr = JSON.stringify(maps_90f36752_8815_4be8_b32b_d7fad1d0542e, function (k, v) {
                if (v.id != null) {
                    var id_ = editor.guid();
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
                eval("items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a" + value[1] + '=' + JSON.stringify(value[2]));
            });
            var datastr = 'var items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = \n';
            datastr += JSON.stringify(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a, null, '\t');
            fs.writeFile('project/items.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        if (file == 'enemys') {
            actionList.forEach(function (value) {
                eval("enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80" + value[1] + '=' + JSON.stringify(value[2]));
            });
            var datastr = 'var enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n';
            var emap = {};
            var estr = JSON.stringify(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80, function (k, v) {
                if (v.hp != null) {
                    var id_ = editor.guid();
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
                eval("data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d" + value[1] + '=' + JSON.stringify(value[2]));
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
                if (!core.isset(value[2]))value[2]=undefined;
                eval("editor.currentFloorData" + value[1] + '=' + JSON.stringify(value[2]));
            });
            editor_file.saveFloorFile(callback);
            return;
        }
        if (file == 'floors') {
            actionList.forEach(function (value) {
                eval("editor.currentFloorData" + value[1] + '=' + JSON.stringify(value[2]));
            });
            editor_file.saveFloorFile(callback);
            return;
        }
        if (file == 'events') {
            actionList.forEach(function (value) {
                eval("events_c12a15a8_c380_4b28_8144_256cba95f760" + value[1] + '=' + JSON.stringify(value[2]));
            });
            var datastr = 'var events_c12a15a8_c380_4b28_8144_256cba95f760 = \n';
            datastr += JSON.stringify(events_c12a15a8_c380_4b28_8144_256cba95f760, null, '\t');
            fs.writeFile('project/events.js', encode(datastr), 'base64', function (err, data) {
                callback(err);
            });
            return;
        }
        callback('出错了,要设置的文件名不识别');
    }

    return editor_file;
}
//editor_file = editor_file(editor);