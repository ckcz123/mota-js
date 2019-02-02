function editor() {
    this.version = "2.0";
    this.brushMod = "line";//["line","rectangle","tileset"]
    this.layerMod = "map";//["fgmap","map","bgmap"]
    this.isMobile = false;

    window.onerror = function (msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        var substring = "script error";
        var message;
        if (string.indexOf(substring) > -1){
            message = 'Script Error: See Browser Console for Detail';
        } else {
            if (url) url = url.substring(url.lastIndexOf('/')+1);
            message = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo,
                'Error object: ' + JSON.stringify(error)
            ].join(' - ');
            // alert(message);
        }
        try {
            printe(message)
        } catch (e) {
            alert(message);
        }
        return false;
    };
}

/* 
editor.loc
editor.pos
editor.info
始终是最后一次点击的结果
注意editor.info可能因为点击其他地方而被清空
*/

/////////// 数据相关 ///////////

editor.prototype.init = function (callback) {
    var afterCoreReset = function () {

        main.editor.disableGlobalAnimate = false;//允许GlobalAnimate
        // core.setHeroMoveTriggerInterval(); 

        editor.idsInit(core.maps, core.icons.icons); // 初始化图片素材信息
        editor.drawInitData(core.icons.icons); // 初始化绘图

        editor.drawMapBg();
        editor.fetchMapFromCore();
        editor.updateMap();
        editor.buildMark();
        editor.drawEventBlock();
        
        editor.pos = {x: 0, y: 0};
        editor.mode.loc();
        editor.info = editor.ids[editor.indexs[201]];
        editor.mode.enemyitem();
        editor.mode.floor();
        editor.mode.tower();
        editor.mode.functions();
        editor.mode.commonevent();
        editor.mode.showMode('tower');
        
        editor_multi = editor_multi();
        editor_blockly = editor_blockly();
        if (Boolean(callback)) callback();

    }

    var afterMainInit = function () {
        core.floors = JSON.parse(JSON.stringify(core.floors, function (k, v) {
            if (v instanceof Function) {
                return v.toString()
            } else return v
        }));
        core.data = JSON.parse(JSON.stringify(core.data, function (k, v) {
            if (v instanceof Function) {
                return v.toString()
            } else return v
        }));
        data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = JSON.parse(JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d, function (k, v) {
            if (v instanceof Function) {
                return v.toString()
            } else return v
        }));
        editor.main = main;
        editor.core = core;
        editor.fs = fs;
        editor_file = editor_file(editor, function () {
            editor.file = editor_file;
            editor_mode = editor_mode(editor);
            editor.mode = editor_mode;
            core.resetStatus(core.firstData.hero, null, core.firstData.floorId, null, core.initStatus.maps);
            core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function () {
                afterCoreReset();
            }, true);
            core.events.setInitData(null);
        });
    }
    afterMainInit();
}

editor.prototype.idsInit = function (maps, icons) {
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
        if(img.width*img.height > 32*32*1000){
            alert(imgName+'上的图块数量超过了1000，请修改后刷新页面');
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

editor.prototype.mapInit = function () {
    var ec = document.getElementById('event').getContext('2d');
    ec.clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
    document.getElementById('event2').getContext('2d').clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
    editor.map = [];
    var sy=editor.currentFloorData.map.length,sx=editor.currentFloorData.map[0].length;
    for (var y = 0; y < sy; y++) {
        editor.map[y] = [];
        for (var x = 0; x < sx; x++) {
            editor.map[y][x] = 0;
        }
    }
    editor.fgmap=JSON.parse(JSON.stringify(editor.map));
    editor.bgmap=JSON.parse(JSON.stringify(editor.map));
    editor.currentFloorData.map = editor.map;
    editor.currentFloorData.fgmap = editor.fgmap;
    editor.currentFloorData.bgmap = editor.bgmap;
    editor.currentFloorData.firstArrive = [];
    editor.currentFloorData.eachArrive = [];
    editor.currentFloorData.events = {};
    editor.currentFloorData.changeFloor = {};
    editor.currentFloorData.afterBattle = {};
    editor.currentFloorData.afterGetItem = {};
    editor.currentFloorData.afterOpenDoor = {};
    editor.currentFloorData.cannotMove = {};
}

editor.prototype.fetchMapFromCore = function(){
    var mapArray = core.maps.save(core.status.maps, core.status.floorId);
    editor.map = mapArray.map(function (v) {
        return v.map(function (v) {
            var x = parseInt(v), y = editor.indexs[x];
            if (!core.isset(y)) {
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
                if (!core.isset(y)) {
                    printe("素材数字"+x+"未定义。是不是忘了注册，或者接档时没有覆盖icons.js和maps.js？");
                    y = [0];
                }
                return editor.ids[y[0]]
            })
        });
    }
}

editor.prototype.changeFloor = function (floorId, callback) {
    for(var ii=0,name;name=['map','bgmap','fgmap'][ii];ii++){
        var mapArray=editor[name].map(function (v) {
            return v.map(function (v) {
                return v.idnum || v || 0
            })
        });
        editor.currentFloorData[name]=mapArray;
    }
    editor.preMapData = null;
    core.changeFloor(floorId, null, {"x": 0, "y": 0, "direction": "up"}, null, function () {
        core.bigmap.offsetX=0;
        core.bigmap.offsetY=0;
        editor.moveViewport(0,0);

        editor.drawMapBg();
        editor.fetchMapFromCore();
        editor.updateMap();
        editor_mode.floor();
        editor.drawEventBlock();
        if (core.isset(callback)) callback();
    });
}

/////////// 游戏绘图相关 ///////////

editor.prototype.drawMapBg = function (img) {
    return;
    //legacy
    editor.main.editor.drawMapBg();
}

editor.prototype.drawEventBlock = function () {
    var fg=document.getElementById('efg').getContext('2d');

    fg.clearRect(0, 0, 416, 416);
    for (var i=0;i<13;i++) {
        for (var j=0;j<13;j++) {
            var color=[];
            var loc=(i+core.bigmap.offsetX/32)+","+(j+core.bigmap.offsetY/32);
            if (core.isset(editor.currentFloorData.events[loc]))
                color.push('#FF0000');
            if (core.isset(editor.currentFloorData.changeFloor[loc]))
                color.push('#00FF00');
            if (core.isset(editor.currentFloorData.afterBattle[loc]))
                color.push('#FFFF00');
            if (core.isset(editor.currentFloorData.afterGetItem[loc]))
                color.push('#00FFFF');
            if (core.isset(editor.currentFloorData.afterOpenDoor[loc]))
                color.push('#FF00FF');
            if (core.isset(editor.currentFloorData.cannotMove[loc]))
                color.push('#0000FF');
            for(var kk=0,cc;cc=color[kk];kk++){
                fg.fillStyle = cc;
                fg.fillRect(32*i+8*kk, 32*j+32-8, 8, 8);
            }
        }
    }
}

editor.prototype.drawPosSelection = function () {
    this.drawEventBlock();
    var fg=document.getElementById('efg').getContext('2d');
    fg.strokeStyle = 'rgba(255,255,255,0.7)';
    fg.lineWidth = 4;
    fg.strokeRect(32*editor.pos.x - core.bigmap.offsetX + 4, 32*editor.pos.y - core.bigmap.offsetY + 4, 24, 24);
}

editor.prototype.updateMap = function () {
    var evs = {};
    if (editor.currentFloorData && editor.currentFloorData.events) {
        for (var loc in editor.currentFloorData.events) {
            if ((editor.currentFloorData.events[loc]||{}).animate == false)
                evs[loc] = {"animate": false};
        }
    }
    var blocks = main.editor.mapIntoBlocks(editor.map.map(function (v) {
        return v.map(function (v) {
            return v.idnum || v || 0
        })
    }), {'events': evs, 'changeFloor': {}}, editor.currentFloorId);
    core.status.thisMap.blocks = blocks;
    main.editor.updateMap();

    var drawTile = function (ctx, x, y, tileInfo) { // 绘制一个普通块

        //ctx.clearRect(x*32, y*32, 32, 32);
        if (tileInfo == 0) return;

        if (typeof(tileInfo) == typeof([][0]) || !hasOwnProp(tileInfo, 'idnum')) {//未定义块画红块
            if (typeof(tileInfo) != typeof([][0]) && hasOwnProp(tileInfo, 'images')) {
                ctx.drawImage(core.material.images[tileInfo.images], 0, tileInfo.y * 32, 32, 32, x * 32, y * 32, 32, 32);
            }
            ctx.strokeStyle = 'red';
            var OFFSET = 2;
            ctx.lineWidth = OFFSET;
            ctx.strokeRect(x * 32 + OFFSET, y * 32 + OFFSET, 32 - OFFSET * 2, 32 - OFFSET * 2);
            ctx.font = "30px Verdana";
            ctx.textAlign = 'center';
            ctx.fillStyle = 'red';
            ctx.fillText("?", x * 32 + 16, y * 32 + 27);
            return;
        }
        //ctx.drawImage(core.material.images[tileInfo.images], 0, tileInfo.y*32, 32, 32, x*32, y*32, 32, 32);
    }
    // 绘制地图 start
    var eventCtx = document.getElementById('event').getContext("2d");
    var fgCtx = document.getElementById('fg').getContext("2d");
    var bgCtx = document.getElementById('bg').getContext("2d");
    for (var y = 0; y < editor.map.length; y++)
        for (var x = 0; x < editor.map[0].length; x++) {
            var tileInfo = editor.map[y][x];
            drawTile(eventCtx, x, y, tileInfo);
            tileInfo = editor.fgmap[y][x];
            drawTile(fgCtx, x, y, tileInfo);
            tileInfo = editor.bgmap[y][x];
            drawTile(bgCtx, x, y, tileInfo);
        }
    // 绘制地图 end
    
}

editor.prototype.moveViewport=function(x,y){
    core.bigmap.offsetX = core.clamp(core.bigmap.offsetX+32*x, 0, 32*core.bigmap.width-416);
    core.bigmap.offsetY = core.clamp(core.bigmap.offsetY+32*y, 0, 32*core.bigmap.height-416);
    core.control.updateViewport();
    editor.buildMark();
    editor.drawPosSelection();
}

/////////// 通用 ///////////

editor.prototype.guid = function () {
    return 'id_' + 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

editor.prototype.HTMLescape = function (str_) {
    return String(str_).split('').map(function (v) {
        return '&#' + v.charCodeAt(0) + ';'
    }).join('');
}

/////////// 界面交互相关 ///////////

editor.prototype.drawInitData = function (icons) {
    var ratio = 1;
    var images = core.material.images;
    var maxHeight = 700;
    var sumWidth = 0;
    editor.widthsX = {};
    // var imgNames = Object.keys(images);  //还是固定顺序吧；
    var imgNames = ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48", "autotile"];

    for (var ii = 0; ii < imgNames.length; ii++) {
        var img = imgNames[ii], tempy = 0;
        if (img == 'autotile') {
            var autotiles = images[img];
            for (var im in autotiles) {
                tempy += autotiles[im].height;
            }
            editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + 3 * 32) / 32, tempy];
            sumWidth += 3 * 32;
            maxHeight = Math.max(maxHeight, tempy);
            continue;
        }
        if (img == 'terrains') {
            editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + images[img].width) / 32, images[img].height + 32*2]
            sumWidth += images[img].width;
            maxHeight = Math.max(maxHeight, images[img].height + 32*2);
            continue;
        }
        editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + images[img].width) / 32, images[img].height];
        sumWidth += images[img].width;
        maxHeight = Math.max(maxHeight, images[img].height);
    }
    var tilesets = images.tilesets;
    for (var ii in core.tilesets) {
        var img = core.tilesets[ii];
        editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + tilesets[img].width) / 32, tilesets[img].height];
        sumWidth += tilesets[img].width;
        maxHeight = Math.max(maxHeight, tilesets[img].height);
    }

    var fullWidth = ~~(sumWidth * ratio);
    var fullHeight = ~~(maxHeight * ratio);

    /*
    if (fullWidth > edata.width) edata.style.width = (edata.width = fullWidth) / ratio + 'px';
    edata.style.height = (edata.height = fullHeight) / ratio + 'px';
    */
    iconImages.style.width = (iconImages.width = fullWidth) / ratio + 'px';
    iconImages.style.height = (iconImages.height = fullHeight) / ratio + 'px';
    var dc = {drawImage:function(){
        var image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;
        var a=Array.prototype.slice.call(arguments)
        if(arguments.length==3){
            // [image, dx, dy]=arguments
            // [sx, sy, sWidth, sHeight, dWidth, dHeight]=[0,0,image.width,image.height,image.width,image.height]
            image=a[0]
            a=[a[0],0,0,image.width,image.height,a[1],a[2],image.width,image.height]
        }
        if(arguments.length==5){
            // [image, dx, dy, dWidth, dHeight]=arguments
            // [sx, sy, sWidth, sHeight]=[0,0,image.width,image.height]
            image=a[0]
            a=[a[0],0,0,image.width,image.height,a[1],a[2],a[3],a[4]]
        }
        if(arguments.length==9){
            // [image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]=arguments
        }
        image=a[0];
        sx=a[1];
        sy=a[2];
        sWidth=a[3];
        sHeight=a[4];
        dx=a[5];
        dy=a[6];
        dWidth=a[7];
        dHeight=a[8];
        //放弃对 dWidth, dHeight 的支持, 始终画一样大的
        var dimg=new Image()
        dimg.src = image.src;
        dimg.style.clip=['rect(',sy,'px,',sx+sWidth,'px,',sy+sHeight,'px,',sx,'px)'].join('')
        dimg.style.top=dy-sy+'px'
        dimg.style.left=dx-sx+'px'
        dimg.width=image.width/ratio
        dimg.height=image.height/ratio
        iconImages.appendChild(dimg)
    }}
    // var dc = edata.getContext('2d');
    var nowx = 0;
    var nowy = 0;
    for (var ii = 0; ii < imgNames.length; ii++) {
        var img = imgNames[ii];
        if (img == 'terrains') {
            (function(image,dc,nowx){
                if (image.complete) {
                    dc.drawImage(image, nowx, 32);
                    core.material.images.airwall = image;
                    delete(editor.airwallImg);
                } else image.onload = function () {
                    dc.drawImage(image, nowx, 32);
                    core.material.images.airwall = image;
                    delete(editor.airwallImg);
                    editor.updateMap();
                }
            })(editor.airwallImg,dc,nowx);
            dc.drawImage(images[img], nowx, 32*2);
            nowx += images[img].width;
            continue;
        }
        if (img == 'autotile') {
            var autotiles = images[img];
            for (var im in autotiles) {
                dc.drawImage(autotiles[im], 0, 0, 96, 128, nowx, nowy, 96, 128);
                nowy += autotiles[im].height;
            }
            nowx += 3 * 32;
            continue;
        }
        dc.drawImage(images[img], nowx, 0)
        nowx += images[img].width;
    }
    for (var ii in core.tilesets) {
        var img = core.tilesets[ii];
        dc.drawImage(tilesets[img], nowx, 0)
        nowx += tilesets[img].width;
    }
    //editor.drawMapBg();
    //editor.mapInit();
}

editor.prototype.buildMark = function(){
    // 生成定位编号
    var arrColMark=document.getElementById('arrColMark');
    var arrRowMark=document.getElementById('arrRowMark');
    var mapColMark=document.getElementById('mapColMark');
    var mapRowMark=document.getElementById('mapRowMark');
    var buildMark = function (offsetX,offsetY) {
        var colNum = ' ';
        for (var i = 0; i < 13; i++) {
            var tpl = '<td>' + (i+offsetX) + '<div class="colBlock" style="left:' + (i * 32 + 1) + 'px;"></div></td>';
            colNum += tpl;
        }
        arrColMark.innerHTML = '<tr>' + colNum + '</tr>';
        mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
        var rowNum = ' ';
        for (var i = 0; i < 13; i++) {
            var tpl = '<tr><td>' + (i+offsetY) + '<div class="rowBlock" style="top:' + (i * 32 + 1) + 'px;"></div></td></tr>';
            rowNum += tpl;
        }
        arrRowMark.innerHTML = rowNum;
        mapRowMark.innerHTML = rowNum;
    }
    var buildMark_mobile = function (offsetX,offsetY) {
        var colNum = ' ';
        for (var i = 0; i < 13; i++) {
            var tpl = '<td>' + (' '+i).slice(-2).replace(' ','&nbsp;') + '<div class="colBlock" style="left:' + (i * 96/13 ) + 'vw;"></div></td>';
            colNum += tpl;
        }
        arrColMark.innerHTML = '<tr>' + colNum + '</tr>';
        //mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
        var rowNum = ' ';
        for (var i = 0; i < 13; i++) {
            var tpl = '<tr><td>' + (' '+i).slice(-2).replace(' ','&nbsp;') + '<div class="rowBlock" style="top:' + (i * 96/13 ) + 'vw;"></div></td></tr>';
            rowNum += tpl;
        }
        arrRowMark.innerHTML = rowNum;
        //mapRowMark.innerHTML = rowNum;
        //=====
        var colNum = ' ';
        for (var i = 0; i < 13; i++) {
            var tpl = '<div class="coltd" style="left:' + (i * 96/13 ) + 'vw;"><div class="coltext">' + (' '+(i+offsetX)).slice(-2).replace(' ','&nbsp;') + '</div><div class="colBlock"></div></div>';
            colNum += tpl;
        }
        mapColMark.innerHTML = '<div class="coltr">' + colNum + '</div>';
        var rowNum = ' ';
        for (var i = 0; i < 13; i++) {
            var tpl = '<div class="rowtr"><div class="rowtd"  style="top:' + (i * 96/13 ) + 'vw;"><div class="rowtext">' + (' '+(i+offsetY)).slice(-2).replace(' ','&nbsp;') + '</div><div class="rowBlock"></div></div></div>';
            rowNum += tpl;
        }
        mapRowMark.innerHTML = rowNum;
    }
    if(editor.isMobile){
        buildMark_mobile(core.bigmap.offsetX/32,core.bigmap.offsetY/32);
    } else {
        buildMark(core.bigmap.offsetX/32,core.bigmap.offsetY/32);
    }
}

editor.prototype.setSelectBoxFromInfo=function(thisevent){
    var pos={x: 0, y: 0, images: "terrains"};
    var ysize = 32;
    if(thisevent==0){
    } else if (thisevent.idnum==17){
        pos.y=1;
    } else {
        pos.x=editor.widthsX[thisevent.images][1];
        pos.y=thisevent.y;
        if(thisevent.x)pos.x+=thisevent.x;
        if(thisevent.images=='terrains')pos.y+=2;
        ysize = thisevent.images.indexOf('48') === -1 ? 32 : 48;
    }
    var dataSelection = document.getElementById('dataSelection');
    dataSelection.style.left = pos.x * 32 + 'px';
    dataSelection.style.top = pos.y * ysize + 'px';
    dataSelection.style.height = ysize - 6 + 'px';
    setTimeout(function(){selectBox.isSelected = true;});
    editor.info = JSON.parse(JSON.stringify(thisevent));
    tip.infos = JSON.parse(JSON.stringify(thisevent));
    editor.pos=pos;
    editor_mode.onmode('nextChange');
    editor_mode.onmode('enemyitem');
}

editor.prototype.listen = function () {

    document.body.onmousedown = function (e) {
        //console.log(e);
        var clickpath = [];
        var getpath=function(e) {
            var path = [];
            var currentElem = e.target;
            while (currentElem) {
                path.push(currentElem);
                currentElem = currentElem.parentElement;
            }
            if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
                path.push(document);
            if (path.indexOf(window) === -1)
                path.push(window);
            return path;
        }
        getpath(e).forEach(function (node) {
            if (!node.getAttribute) return;
            var id_ = node.getAttribute('id');
            if (id_) {
                if (['left', 'left1', 'left2', 'left3', 'left4', 'left5', 'left8', 'mobileview'].indexOf(id_) !== -1) clickpath.push('edit');
                clickpath.push(id_);
            }
        });
    
        var unselect=true;
        for(var ii=0,thisId;thisId=['edit','tip','brushMod','brushMod2','brushMod3','layerMod','layerMod2','layerMod3','viewportButtons'][ii];ii++){
            if (clickpath.indexOf(thisId) !== -1){
                unselect=false;
                break;
            }
        }
        if (unselect) {
            if (clickpath.indexOf('eui') === -1) {
                if (selectBox.isSelected) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw(err)
                        }
                        ;printf('地图保存成功');
                    });
                }
                selectBox.isSelected = false;
                editor.info = {};
            }
        }
        //editor.mode.onmode('');
        if (e.button!=2 && !editor.isMobile){
            editor.hideMidMenu();
        }
        if (clickpath.indexOf('down') !== -1 && editor.isMobile && clickpath.indexOf('midMenu') === -1){
            editor.hideMidMenu();
        }
        if(clickpath.length>=2 && clickpath[0].indexOf('id_')===0){editor.lastClickId=clickpath[0]}
    }

    var iconLib=document.getElementById('iconLib');
    iconLib.onmousedown = function (e) {
        console.log("iconLib: ("+e.clientX+","+e.clientY+")");
        e.stopPropagation();
    }

    var eui=document.getElementById('eui');
    var uc = eui.getContext('2d');

    function fillPos(pos) {
        uc.fillStyle = '#' + ~~(Math.random() * 8) + ~~(Math.random() * 8) + ~~(Math.random() * 8);
        uc.fillRect(pos.x * 32 + 12 - core.bigmap.offsetX, pos.y * 32 + 12 - core.bigmap.offsetY, 8, 8);
    }//在格子内画一个随机色块

    function eToLoc(e) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var xx=e.clientX,yy=e.clientY
        if(editor.isMobile){xx=e.touches[0].clientX,yy=e.touches[0].clientY}
        editor.loc = {
            'x': scrollLeft + xx - mid.offsetLeft - mapEdit.offsetLeft,
            'y': scrollTop + yy - mid.offsetTop - mapEdit.offsetTop,
            'size': editor.isMobile?(32*innerWidth*0.96/416):32
        };
        return editor.loc;
    }//返回可用的组件内坐标

    function locToPos(loc, addViewportOffset) {
        var offsetX=0, offsetY=0;
        if (addViewportOffset){
            offsetX=core.bigmap.offsetX/32;
            offsetY=core.bigmap.offsetY/32;
        }
        editor.pos = {'x': ~~(loc.x / loc.size)+offsetX, 'y': ~~(loc.y / loc.size)+offsetY}
        return editor.pos;
    }

    var holdingPath = 0;
    var stepPostfix = null;//用于存放寻路检测的第一个点之后的后续移动

    var mouseOutCheck = 2;

    function clear1() {
        if (mouseOutCheck > 1) {
            mouseOutCheck--;
            setTimeout(clear1, 1000);
            return;
        }
        holdingPath = 0;
        stepPostfix = [];
        uc.clearRect(0, 0, 416, 416);
    }//用于鼠标移出canvas时的自动清除状态

    eui.oncontextmenu=function(e){e.preventDefault()}

    eui.ondblclick = function(e) {
        // 双击地图可以选中素材
        var loc = eToLoc(e);
        var pos = locToPos(loc,true);
        editor.setSelectBoxFromInfo(editor[editor.layerMod][pos.y][pos.x]);
        return;
    }

    eui.onmousedown = function (e) {
        if (e.button==2){
            var loc = eToLoc(e);
            var pos = locToPos(loc,true);
            editor.showMidMenu(e.clientX,e.clientY);
            return;
        }
        if (!selectBox.isSelected) {
            var loc = eToLoc(e);
            var pos = locToPos(loc,true);
            editor_mode.onmode('nextChange');
            editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow = 1;
            if(editor.isMobile)editor.showMidMenu(e.clientX,e.clientY);
            return;
        }
        

        holdingPath = 1;
        mouseOutCheck = 2;
        setTimeout(clear1);
        e.stopPropagation();
        uc.clearRect(0, 0, 416, 416);
        var loc = eToLoc(e);
        var pos = locToPos(loc,true);
        stepPostfix = [];
        stepPostfix.push(pos);
        fillPos(pos);
    }

    eui.onmousemove = function (e) {
        if (!selectBox.isSelected) {
            //tip.whichShow = 1;
            return;
        }

        if (holdingPath == 0) {
            return;
        }
        mouseOutCheck = 2;
        e.stopPropagation();
        var loc = eToLoc(e);
        var pos = locToPos(loc,true);
        var pos0 = stepPostfix[stepPostfix.length - 1]
        var directionDistance = [pos.y - pos0.y, pos0.x - pos.x, pos0.y - pos.y, pos.x - pos0.x]
        var max = 0, index = 4;
        for (var i = 0; i < 4; i++) {
            if (directionDistance[i] > max) {
                index = i;
                max = directionDistance[i];
            }
        }
        var pos = [{'x': 0, 'y': 1}, {'x': -1, 'y': 0}, {'x': 0, 'y': -1}, {'x': 1, 'y': 0}, false][index]
        if (pos) {
            pos.x += pos0.x;
            pos.y += pos0.y;
            stepPostfix.push(pos);
            fillPos(pos);
        }
    }

    eui.onmouseup = function (e) {
        if (!selectBox.isSelected) {
            //tip.whichShow = 1;
            return;
        }
        holdingPath = 0;
        e.stopPropagation();
        if (stepPostfix && stepPostfix.length) {
            editor.preMapData = JSON.parse(JSON.stringify({map:editor.map,fgmap:editor.fgmap,bgmap:editor.bgmap}));
            if(editor.brushMod!=='line'){
                var x0=stepPostfix[0].x;
                var y0=stepPostfix[0].y;
                var x1=stepPostfix[stepPostfix.length-1].x;
                var y1=stepPostfix[stepPostfix.length-1].y;
                if(x0>x1){x0^=x1;x1^=x0;x0^=x1;}//swap
                if(y0>y1){y0^=y1;y1^=y0;y0^=y1;}//swap
                stepPostfix=[];
                for(var jj=y0;jj<=y1;jj++){
                    for(var ii=x0;ii<=x1;ii++){
                        stepPostfix.push({x:ii,y:jj})
                    }
                }
            }
            currDrawData.pos = JSON.parse(JSON.stringify(stepPostfix));
            currDrawData.info = JSON.parse(JSON.stringify(editor.info));
            reDo = null;
            // console.log(stepPostfix);
            if (editor.layerMod!='map'  && editor.info.images && editor.info.images.indexOf('48')!==-1){
                printe('前景/背景不支持48的图块');
            } else {
                if(editor.brushMod==='tileset' && core.tilesets.indexOf(editor.info.images)!==-1){
                    var imgWidth=~~(core.material.images.tilesets[editor.info.images].width/32);
                    var x0=stepPostfix[0].x;
                    var y0=stepPostfix[0].y;
                    var idnum=editor.info.idnum;
                    for (var ii = 0; ii < stepPostfix.length; ii++){
                        if(stepPostfix[ii].y!=y0){
                            y0++;
                            idnum+=imgWidth;
                        }
                        editor[editor.layerMod][stepPostfix[ii].y][stepPostfix[ii].x] = editor.ids[editor.indexs[idnum+stepPostfix[ii].x-x0]];
                    }
                } else {
                    for (var ii = 0; ii < stepPostfix.length; ii++)
                    editor[editor.layerMod][stepPostfix[ii].y][stepPostfix[ii].x] = editor.info;
                }
            }
            // console.log(editor.map);
            editor.updateMap();
            holdingPath = 0;
            stepPostfix = [];
            uc.clearRect(0, 0, 416, 416);
        }
    }

    /*
    document.getElementById('mid').onkeydown = function (e) {
        console.log(e);
        if (e.keyCode==37) {
            editor.moveViewport(-1, 0);
        }
        if (e.keyCode==38) {
            editor.moveViewport(0, -1);
        }
        if (e.keyCode==39) {
            editor.moveViewport(1, 0);
        }
        if (e.keyCode==40) {
            editor.moveViewport(0, 1);
        }
    }
    */

    document.getElementById('mid').onmousewheel = function (e) {
        e.preventDefault();
        var wheel = function (direct) {
            var index=editor.core.floorIds.indexOf(editor.currentFloorId);
            var toId = editor.currentFloorId;

            if (direct>0 && index<editor.core.floorIds.length-1)
                toId = editor.core.floorIds[index+1];
            else if (direct<0 && index>0)
                toId = editor.core.floorIds[index-1];
            else return;

            editor_mode.onmode('nextChange');
            editor_mode.onmode('floor');
            document.getElementById('selectFloor').value = toId;
            editor.changeFloor(toId);
        }

        try {
            if (e.wheelDelta)
                wheel(Math.sign(e.wheelDelta))
            else if (e.detail)
                wheel(Math.sign(e.detail));
        }
        catch (ee) {
            console.log(ee);
        }
    }

    editor.preMapData = null;
    var currDrawData = {
        pos: [],
        info: {}
    };
    var reDo = null;
    var shortcut = core.getLocalStorage('shortcut',{48: 0, 49: 0, 50: 0, 51: 0, 52: 0, 53: 0, 54: 0, 55: 0, 56: 0, 57: 0});
    document.body.onkeydown = function (e) {

        // 如果是开启事件/脚本编辑器状态，则忽略
        if (editor_multi.id!="" || editor_blockly.id!="")
            return;

        // 禁止快捷键的默认行为
        if (e.ctrlKey && [89, 90, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1)
            e.preventDefault();
        if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1)
            e.preventDefault();
        //Ctrl+z 撤销上一步undo
        if (e.keyCode == 90 && e.ctrlKey && editor.preMapData && currDrawData.pos.length && selectBox.isSelected) {
            editor.map = JSON.parse(JSON.stringify(editor.preMapData.map));
            editor.fgmap = JSON.parse(JSON.stringify(editor.preMapData.fgmap));
            editor.bgmap = JSON.parse(JSON.stringify(editor.preMapData.bgmap));
            editor.updateMap();
            reDo = JSON.parse(JSON.stringify(currDrawData));
            currDrawData = {pos: [], info: {}};
            editor.preMapData = null;
        }
        //Ctrl+y 重做一步redo
        if (e.keyCode == 89 && e.ctrlKey && reDo && reDo.pos.length && selectBox.isSelected) {
            editor.preMapData = JSON.parse(JSON.stringify({map:editor.map,fgmap:editor.fgmap,bgmap:editor.bgmap}));
            for (var j = 0; j < reDo.pos.length; j++)
                editor.map[reDo.pos[j].y][reDo.pos[j].x] = JSON.parse(JSON.stringify(reDo.info));

            editor.updateMap();
            currDrawData = JSON.parse(JSON.stringify(reDo));
            reDo = null;
        }
        // PGUP和PGDOWN切换楼层
        if (e.keyCode==33) {
            e.preventDefault();
            var index=editor.core.floorIds.indexOf(editor.currentFloorId);
            if (index<editor.core.floorIds.length-1) {
                var toId = editor.core.floorIds[index+1];
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                document.getElementById('selectFloor').value = toId;
                editor.changeFloor(toId);
            }
        }
        if (e.keyCode==34) {
            e.preventDefault();
            var index=editor.core.floorIds.indexOf(editor.currentFloorId);
            if (index>0) {
                var toId = editor.core.floorIds[index-1];
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                document.getElementById('selectFloor').value = toId;
                editor.changeFloor(toId);
            }
        }
        //ctrl + 0~9 切换到快捷图块
        if (e.ctrlKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1){
            editor.setSelectBoxFromInfo(JSON.parse(JSON.stringify(shortcut[e.keyCode]||0)));
        }
        //alt + 0~9 改变快捷图块
        if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1){
            var infoToSave = JSON.stringify(editor.info||0);
            if(infoToSave==JSON.stringify({}))return;
            shortcut[e.keyCode]=JSON.parse(infoToSave);
            printf('已保存该快捷图块, ctrl + '+(e.keyCode-48)+' 使用.')
            core.setLocalStorage('shortcut',shortcut);
        }
        var focusElement = document.activeElement;
        if (!focusElement || focusElement.tagName.toLowerCase()=='body') {
            // wasd平移大地图
            if (e.keyCode==87)
                editor.moveViewport(0,-1)
            else if (e.keyCode==65)
                editor.moveViewport(-1,0)
            else if (e.keyCode==83)
                editor.moveViewport(0,1);
            else if (e.keyCode==68)
                editor.moveViewport(1,0);
        }
    }

    var dataSelection = document.getElementById('dataSelection');
    iconLib.onmousedown = function (e) {
        e.stopPropagation();
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var loc = {
            'x': scrollLeft + e.clientX + iconLib.scrollLeft - right.offsetLeft - iconLib.offsetLeft,
            'y': scrollTop + e.clientY + iconLib.scrollTop - right.offsetTop - iconLib.offsetTop,
            'size': 32
        };
        editor.loc = loc;
        var pos = locToPos(loc);
        for (var spriter in editor.widthsX) {
            if (pos.x >= editor.widthsX[spriter][1] && pos.x < editor.widthsX[spriter][2]) {
                var ysize = spriter.indexOf('48') === -1 ? 32 : 48;
                loc.ysize = ysize;
                pos.images = editor.widthsX[spriter][0];
                pos.y = ~~(loc.y / loc.ysize);
                if(core.tilesets.indexOf(pos.images)==-1)pos.x = editor.widthsX[spriter][1];
                var autotiles = core.material.images['autotile'];
                if (pos.images == 'autotile') {
                    var imNames = Object.keys(autotiles);
                    if ((pos.y + 1) * ysize > editor.widthsX[spriter][3])
                        pos.y = ~~(editor.widthsX[spriter][3] / ysize) - 4;
                    else {
                        for (var i = 0; i < imNames.length; i++) {
                            if (pos.y >= 4 * i && pos.y < 4 * (i + 1)) {
                                pos.images = imNames[i];
                                pos.y = 4 * i;
                            }
                        }
                    }
                } else if ((pos.y + 1) * ysize > editor.widthsX[spriter][3])
                    pos.y = ~~(editor.widthsX[spriter][3] / ysize) - 1;

                selectBox.isSelected = true;
                // console.log(pos,core.material.images[pos.images].height)
                dataSelection.style.left = pos.x * 32 + 'px';
                dataSelection.style.top = pos.y * ysize + 'px';
                dataSelection.style.height = ysize - 6 + 'px';

                if (pos.x == 0 && pos.y == 0) {
                    // editor.info={idnum:0, id:'empty','images':'清除块', 'y':0};
                    editor.info = 0;
                } else if(pos.x == 0 && pos.y == 1){
                    editor.info = editor.ids[editor.indexs[17]];
                } else {
                    if (hasOwnProp(autotiles, pos.images)) editor.info = {'images': pos.images, 'y': 0};
                    else if (pos.images == 'terrains') editor.info = {'images': pos.images, 'y': pos.y - 2};
                    else if (core.tilesets.indexOf(pos.images)!=-1) editor.info = {'images': pos.images, 'y': pos.y, 'x': pos.x-editor.widthsX[spriter][1]};
                    else editor.info = {'images': pos.images, 'y': pos.y};

                    for (var ii = 0; ii < editor.ids.length; ii++) {
                        if ((core.tilesets.indexOf(pos.images)!=-1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y && editor.info.x == editor.ids[ii].x)
                            || (hasOwnProp(autotiles, pos.images) && editor.info.images == editor.ids[ii].id
                            && editor.info.y == editor.ids[ii].y)
                            || (core.tilesets.indexOf(pos.images)==-1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y )
                            ) {

                            editor.info = editor.ids[ii];
                            break;
                        }
                    }
                }
                tip.infos = JSON.parse(JSON.stringify(editor.info));
                editor_mode.onmode('nextChange');
                editor_mode.onmode('enemyitem');
                //editor_mode.enemyitem();
            }
        }
    }

    var midMenu=document.getElementById('midMenu');
    midMenu.oncontextmenu=function(e){e.preventDefault()}
    editor.lastRightButtonPos=[{x:0,y:0},{x:0,y:0}];
    editor.showMidMenu=function(x,y){
        editor.lastRightButtonPos=JSON.parse(JSON.stringify(
            [editor.pos,editor.lastRightButtonPos[0]]
        ));
        var locStr='('+editor.lastRightButtonPos[1].x+','+editor.lastRightButtonPos[1].y+')';
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // 检测是否是上下楼
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        if (thisevent.id=='upFloor') {
            addFloorEvent.style.display='block';
            addFloorEvent.children[0].innerHTML='绑定上楼事件';
        }
        else if (thisevent.id=='downFloor') {
            addFloorEvent.style.display='block';
            addFloorEvent.children[0].innerHTML='绑定下楼事件';
        }
        else addFloorEvent.style.display='none';

        chooseThis.children[0].innerHTML='选中此点'+'('+editor.pos.x+','+editor.pos.y+')'
        copyLoc.children[0].innerHTML='复制事件'+locStr+'到此处';
        moveLoc.children[0].innerHTML='交换事件'+locStr+'与此事件的位置';
        midMenu.style='top:'+(y+scrollTop)+'px;left:'+(x+scrollLeft)+'px;';
    }
    editor.hideMidMenu=function(){
        if(editor.isMobile){
            setTimeout(function(){
                midMenu.style='display:none';
            },200)
        } else {
            midMenu.style='display:none';
        }
    }

    var addFloorEvent = document.getElementById('addFloorEvent');
    addFloorEvent.onmousedown = function(e) {
        editor.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        if (thisevent.id=='upFloor') {
            editor.currentFloorData.changeFloor[editor.pos.x+","+editor.pos.y] = {"floorId": ":next", "stair": "downFloor"};
        }
        else if (thisevent.id=='downFloor') {
            editor.currentFloorData.changeFloor[editor.pos.x+","+editor.pos.y] = {"floorId": ":before", "stair": "upFloor"};
        }
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('添加楼梯事件成功');
            editor.drawPosSelection();
            editor_mode.showMode('loc');
        });
    }

    var chooseThis = document.getElementById('chooseThis');
    chooseThis.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        selectBox.isSelected = false;

        editor_mode.onmode('nextChange');
        editor_mode.onmode('loc');
        //editor_mode.loc();
        //tip.whichShow = 1;
        if(editor.isMobile)editor.showdataarea(false);
    }

    var chooseInRight = document.getElementById('chooseInRight');
    chooseInRight.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor[editor.layerMod][editor.pos.y][editor.pos.x];
        editor.setSelectBoxFromInfo(thisevent);
    }

    var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);

    var copyLoc = document.getElementById('copyLoc');
    copyLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        editor.preMapData = null;
        reDo = null;
        editor_mode.onmode('');
        var now = editor.pos;
        var last = editor.lastRightButtonPos[1];
        var lastevent = editor.map[last.y][last.x];
        var lastinfo = 0;
        if(lastevent==0){
            lastinfo = 0;
        } else {
            var ids=editor.indexs[lastevent.idnum];
            ids=ids[0]?ids[0]:ids;
            lastinfo=editor.ids[ids];
        }
        editor.map[now.y][now.x]=lastinfo;
        editor.updateMap();
        fields.forEach(function(v){
            editor.currentFloorData[v][now.x+','+now.y]=editor.currentFloorData[v][last.x+','+last.y]
        })
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('复制事件成功');
            editor.drawPosSelection();
        });
    }

    var moveLoc = document.getElementById('moveLoc');
    moveLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        editor.preMapData = null;
        reDo = null;
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        if(thisevent==0){
            editor.info = 0;
        } else {
            var ids=editor.indexs[thisevent.idnum];
            ids=ids[0]?ids[0]:ids;
            editor.info=editor.ids[ids];
        }
        editor_mode.onmode('');
        var now = editor.pos;
        var last = editor.lastRightButtonPos[1];
        
        var lastevent = editor.map[last.y][last.x];
        var lastinfo = 0;
        if(lastevent==0){
            lastinfo = 0;
        } else {
            var ids=editor.indexs[lastevent.idnum];
            ids=ids[0]?ids[0]:ids;
            lastinfo=editor.ids[ids];
        }
        editor.map[last.y][last.x]=editor.info;
        editor.map[now.y][now.x]=lastinfo;
        editor.updateMap();

        fields.forEach(function(v){
            var temp_atsfcytaf=editor.currentFloorData[v][now.x+','+now.y];
            editor.currentFloorData[v][now.x+','+now.y]=editor.currentFloorData[v][last.x+','+last.y];
            editor.currentFloorData[v][last.x+','+last.y]=temp_atsfcytaf;
        })
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('两位置的事件已互换');
            editor.drawPosSelection();
        });
    }

    var clearLoc = document.getElementById('clearLoc');
    clearLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        editor.preMapData = null;
        reDo = null;
        editor.info = 0;
        editor_mode.onmode('');
        var now = editor.pos;
        editor.map[now.y][now.x]=editor.info;
        editor.updateMap();
        fields.forEach(function(v){
            delete editor.currentFloorData[v][now.x+','+now.y];
        })
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('清空此点及事件成功');
            editor.drawPosSelection();
        });
    }

    var brushMod=document.getElementById('brushMod');
    brushMod.onchange=function(){
        editor.brushMod=brushMod.value;
    }

    var brushMod2=document.getElementById('brushMod2');
    if(brushMod2)brushMod2.onchange=function(){
        editor.brushMod=brushMod2.value;
    }

    var brushMod3=document.getElementById('brushMod3');
    if(brushMod3)brushMod3.onchange=function(){
        editor.brushMod=brushMod3.value;
    }

    var bgc = document.getElementById('bg'), fgc = document.getElementById('fg'),
        evc = document.getElementById('event'), ev2c = document.getElementById('event2');

    var layerMod=document.getElementById('layerMod');
    layerMod.onchange=function(){
        editor.layerMod=layerMod.value;
        [bgc,fgc,evc,ev2c].forEach(function (x) {
            x.style.opacity = 1;
        });

        // 手机端....
        if (editor.isMobile) {
            if (layerMod.value == 'bgmap') {
                [fgc,evc,ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
            if (layerMod.value == 'fgmap') {
                [bgc,evc,ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
        }
    }

    var layerMod2=document.getElementById('layerMod2');
    if(layerMod2)layerMod2.onchange=function(){
        editor.layerMod=layerMod2.value;
        [fgc,evc,ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        bgc.style.opacity = 1;
    }

    var layerMod3=document.getElementById('layerMod3');
    if(layerMod3)layerMod3.onchange=function(){
        editor.layerMod=layerMod3.value;
        [bgc,evc,ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        fgc.style.opacity = 1;
    }

    var viewportButtons=document.getElementById('viewportButtons');
    for(var ii=0,node;node=viewportButtons.children[ii];ii++){
        (function(x,y){
            node.onclick=function(){
                editor.moveViewport(x,y);
            }
        })([-1,0,0,1][ii],[0,-1,1,0][ii]);
    }

}//绑定事件

editor.prototype.mobile_listen=function(){
    if(!editor.isMobile)return;

    var mobileview=document.getElementById('mobileview');
    var editModeSelect=document.getElementById('editModeSelect');
    var mid=document.getElementById('mid');
    var right=document.getElementById('right');
    var mobileeditdata=document.getElementById('mobileeditdata');

    
    editor.showdataarea=function(callShowMode){
        mid.style='z-index:-1;opacity: 0;';
        right.style='z-index:-1;opacity: 0;';
        mobileeditdata.style='';
        if(callShowMode)editor.mode.showMode(editModeSelect.value);
        editor.hideMidMenu();
    }
    mobileview.children[0].onclick=function(){
        editor.showdataarea(true)
    }
    mobileview.children[1].onclick=function(){
        mid.style='';
        right.style='z-index:-1;opacity: 0;';
        mobileeditdata.style='z-index:-1;opacity: 0;';
        editor.lastClickId='';
    }
    mobileview.children[3].onclick=function(){
        mid.style='z-index:-1;opacity: 0;';
        right.style='';
        mobileeditdata.style='z-index:-1;opacity: 0;';
        editor.lastClickId='';
    }


    var gettrbyid=function(){
        if(!editor.lastClickId)return false;
        thisTr = document.getElementById(editor.lastClickId);
        input = thisTr.children[2].children[0].children[0];
        field = thisTr.children[0].getAttribute('title');
        cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
        return [thisTr,input,field,cobj];
    }
    mobileeditdata.children[0].onclick=function(){
        var info = gettrbyid()
        if(!info)return;
        info[1].ondblclick()
    }
    mobileeditdata.children[1].onclick=function(){
        var info = gettrbyid()
        if(!info)return;
        printf(info[2])
    }
    mobileeditdata.children[2].onclick=function(){
        var info = gettrbyid()
        if(!info)return;
        printf(info[0].children[1].getAttribute('title'))
    }

    //=====

    document.body.ontouchstart=document.body.onmousedown;
    document.body.onmousedown=null;


    var eui=document.getElementById('eui');
    eui.ontouchstart=eui.onmousedown
    eui.onmousedown=null
    eui.ontouchmove=eui.onmousemove
    eui.onmousemove=null
    eui.ontouchend=eui.onmouseup
    eui.onmouseup=null


    var chooseThis = document.getElementById('chooseThis');
    chooseThis.ontouchstart=chooseThis.onmousedown
    chooseThis.onmousedown=null
    var chooseInRight = document.getElementById('chooseInRight');
    chooseInRight.ontouchstart=chooseInRight.onmousedown
    chooseInRight.onmousedown=null
    var copyLoc = document.getElementById('copyLoc');
    copyLoc.ontouchstart=copyLoc.onmousedown
    copyLoc.onmousedown=null
    var moveLoc = document.getElementById('moveLoc');
    moveLoc.ontouchstart=moveLoc.onmousedown
    moveLoc.onmousedown=null
    var clearLoc = document.getElementById('clearLoc');
    clearLoc.ontouchstart=clearLoc.onmousedown
    clearLoc.onmousedown=null
    
}

editor = new editor();