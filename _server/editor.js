function editor() {
    this.version = "2.0";
    this.material = {};
    this.brushMod = "line";//["line","rectangle"]
}

editor.prototype.init = function (callback) {
    var afterCoreReset = function () {

        main.editor.disableGlobalAnimate = false;//允许GlobalAnimate
        /* core.setHeroMoveTriggerInterval(); */

        editor.reset(function () {
            editor.drawMapBg();
            var mapArray = core.maps.save(core.status.maps, core.status.floorId);
            editor.map = mapArray.map(function (v) {
                return v.map(function (v) {
                    return editor.ids[[editor.indexs[parseInt(v)][0]]]
                })
            });
            editor.currentFloorId = core.status.floorId;
            editor.currentFloorData = core.floors[core.status.floorId];
            editor.updateMap();
            editor.buildMark();
            editor.drawEventBlock();
            if (Boolean(callback)) callback();
        });
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
            editor.material.images = core.material.images;
            editor.listen(); // 开始监听事件
            core.resetStatus(core.firstData.hero, null, core.firstData.floorId, null, core.initStatus.maps);
            core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function () {
                afterCoreReset();
            }, true);
            core.events.setInitData(null);
        });
    }
    afterMainInit();
}

editor.prototype.reset = function (callback) {
    editor.idsInit(core.maps, core.icons.icons); // 初始化图片素材信息
    editor.drawInitData(core.icons.icons); // 初始化绘图
    if (Boolean(callback)) callback();
}

editor.prototype.idsInit = function (maps, icons) {
    editor.ids = [0];
    editor.indexs = [];
    var MAX_NUM = 1000;
    var getInfoById = function (id) {
        var block = maps.initBlock(0, 0, id);
        if (hasOwnProp(block, 'event')) {
            return block;
        }
    }
    var point = 0;
    for (var i = 0; i < MAX_NUM; i++) {
        var indexBlock = getInfoById(i);
        editor.indexs[i] = [];
        if (indexBlock) {
            var id = indexBlock.event.id;
            var indexId = indexBlock.id;
            var allCls = Object.keys(icons);
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
}
editor.prototype.drawInitData = function (icons) {
    var ratio = 1;
    var images = editor.material.images;
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
            editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + images[img].width) / 32, images[img].height + 32]
            sumWidth += images[img].width;
            maxHeight = Math.max(maxHeight, images[img].height + 32);
            continue;
        }
        editor.widthsX[img] = [img, sumWidth / 32, (sumWidth + images[img].width) / 32, images[img].height];
        sumWidth += images[img].width;
        maxHeight = Math.max(maxHeight, images[img].height);
    }
    var fullWidth = ~~(sumWidth * ratio);
    var fullHeight = ~~(maxHeight * ratio);

    if (fullWidth > edata.width) edata.style.width = (edata.width = fullWidth) / ratio + 'px';
    edata.style.height = (edata.height = fullHeight) / ratio + 'px';
    var dc = edata.getContext('2d');
    var nowx = 0;
    var nowy = 0;
    for (var ii = 0; ii < imgNames.length; ii++) {
        var img = imgNames[ii];
        if (img == 'terrains') {
            dc.drawImage(images[img], nowx, 32);
            nowx += images[img].width;
            continue;
        }
        if (img == 'autotile') {
            var autotiles = images[img];
            for (var im in autotiles) {
                dc.drawImage(autotiles[im], nowx, nowy);
                nowy += autotiles[im].height;
            }
            continue;
        }
        dc.drawImage(images[img], nowx, 0)
        nowx += images[img].width;
    }
    bgSelect.bgs = Object.keys(icons.terrains);
    //editor.drawMapBg();
    //editor.mapInit();
}
editor.prototype.mapInit = function () {
    var ec = document.getElementById('event').getContext('2d');
    ec.clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
    document.getElementById('event2').getContext('2d').clearRect(0, 0, core.bigmap.width*32, core.bigmap.height*32);
    editor.map = [];
    var sy=editor.currentFloorData.map.length,sy=editor.currentFloorData.map[0].length;
    for (var y = 0; y < sy; y++) {
        editor.map[y] = [];
        for (var x = 0; x < sx; x++) {
            editor.map[y][x] = 0;
        }
    }
    editor.currentFloorData.map = editor.map;
    editor.currentFloorData.firstArrive = [];
    editor.currentFloorData.events = {};
    editor.currentFloorData.changeFloor = {};
    editor.currentFloorData.afterBattle = {};
    editor.currentFloorData.afterGetItem = {};
    editor.currentFloorData.afterOpenDoor = {};
    editor.currentFloorData.cannotMove = {};
}
editor.prototype.drawMapBg = function (img) {
    var bgc = bg.getContext('2d');
    if (!core.isset(editor.bgY) || editor.bgY == 0) {
        editor.main.editor.drawMapBg();
        return;
    }

    for (var ii = 0; ii < 13; ii++)
        for (var jj = 0; jj < 13; jj++) {
            bgc.clearRect(ii * 32, jj * 32, 32, 32);
            bgc.drawImage(editor.material.images['terrains'], 0, 32 * (editor.bgY || 0), 32, 32, ii * 32, jj * 32, 32, 32);
        }
    if (img) {
        bgc.drawImage(img, 0, 0, 416, 416);
    }
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

editor.prototype.updateMap = function () {
    var blocks = main.editor.mapIntoBlocks(editor.map.map(function (v) {
        return v.map(function (v) {
            return v.idnum || v || 0
        })
    }), {'events': {}, 'changeFloor': {}}, editor.currentFloorId);
    core.status.thisMap.blocks = blocks;
    main.editor.updateMap();

    var drawTile = function (ctx, x, y, tileInfo) { // 绘制一个普通块

        //ctx.clearRect(x*32, y*32, 32, 32);
        if (tileInfo == 0) return;

        if (typeof(tileInfo) == typeof([][0]) || !hasOwnProp(tileInfo, 'idnum')) {//未定义块画红块
            if (typeof(tileInfo) != typeof([][0]) && hasOwnProp(tileInfo, 'images')) {
                ctx.drawImage(editor.material.images[tileInfo.images], 0, tileInfo.y * 32, 32, 32, x * 32, y * 32, 32, 32);
            }
            ctx.strokeStyle = 'red';
            var OFFSET = 2;
            ctx.lineWidth = OFFSET;
            ctx.strokeRect(x * 32 + OFFSET, y * 32 + OFFSET, 32 - OFFSET * 2, 32 - OFFSET * 2);
            ctx.font = "30px Verdana";
            ctx.textAlign = 'center'
            ctx.fillStyle = 'red';
            ctx.fillText("?", x * 32 + 16, y * 32 + 27);
            return;
        }
        //ctx.drawImage(editor.material.images[tileInfo.images], 0, tileInfo.y*32, 32, 32, x*32, y*32, 32, 32);
    }
    // 绘制地图 start
    var eventCtx = document.getElementById('event').getContext("2d");
    for (var y = 0; y < editor.map.length; y++)
        for (var x = 0; x < editor.map[0].length; x++) {
            var tileInfo = editor.map[y][x];
            if (false && isAutotile(tileInfo)) {
                addIndexToAutotileInfo(x, y);
                drawAutotile(eventCtx, x, y, tileInfo);
            } else drawTile(eventCtx, x, y, tileInfo);
        }
    // 绘制地图 end
    
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

editor.prototype.changeFloor = function (floorId, callback) {
    editor.currentFloorData.map = editor.map.map(function (v) {
        return v.map(function (v) {
            return v.idnum || v || 0
        })
    });
    core.changeFloor(floorId, null, core.firstData.hero.loc, null, function () {
        editor.drawMapBg();
        var mapArray = core.maps.save(core.status.maps, core.status.floorId);
        editor.map = mapArray.map(function (v) {
            return v.map(function (v) {
                return editor.ids[[editor.indexs[parseInt(v)][0]]]
            })
        });
        editor.currentFloorId = core.status.floorId;
        editor.currentFloorData = core.floors[core.status.floorId];
        editor.updateMap();
        editor_mode.floor();
        editor.drawEventBlock();
        if (core.isset(callback)) callback();
    });
}

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

editor.prototype.listen = function () {
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
            preMapData = JSON.parse(JSON.stringify(editor.map));
            if(editor.brushMod==='rectangle'){
                var x0=stepPostfix[0].x;
                var y0=stepPostfix[0].y;
                var x1=stepPostfix[stepPostfix.length-1].x;
                var y1=stepPostfix[stepPostfix.length-1].y;
                if(x0>x1){x0^=x1;x1^=x0;x0^=x1;}//swap
                if(y0>y1){y0^=y1;y1^=y0;y0^=y1;}//swap
                stepPostfix=[];
                for(var ii=x0;ii<=x1;ii++){
                    for(var jj=y0;jj<=y1;jj++){
                        stepPostfix.push({x:ii,y:jj})
                    }
                }
            }
            currDrawData.pos = JSON.parse(JSON.stringify(stepPostfix));
            currDrawData.info = JSON.parse(JSON.stringify(editor.info));
            reDo = null;
            // console.log(stepPostfix);
            for (var ii = 0; ii < stepPostfix.length; ii++)
                editor.map[stepPostfix[ii].y][stepPostfix[ii].x] = editor.info;
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

    var preMapData = {};
    var currDrawData = {
        pos: [],
        info: {}
    };
    var reDo = null;
    document.body.onkeydown = function (e) {
        // 禁止快捷键的默认行为
        if (e.ctrlKey && ( e.keyCode == 90 || e.keyCode == 89 ))
            e.preventDefault();
        //Ctrl+z 撤销上一步undo
        if (e.keyCode == 90 && e.ctrlKey && preMapData && currDrawData.pos.length && selectBox.isSelected) {
            editor.map = JSON.parse(JSON.stringify(preMapData));
            editor.updateMap();
            reDo = JSON.parse(JSON.stringify(currDrawData));
            currDrawData = {pos: [], info: {}};
            preMapData = null;
        }
        //Ctrl+y 重做一步redo
        if (e.keyCode == 89 && e.ctrlKey && reDo && reDo.pos.length && selectBox.isSelected) {
            preMapData = JSON.parse(JSON.stringify(editor.map));
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
    }

    var dataSelection = document.getElementById('dataSelection');
    edata.onmousedown = function (e) {
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
                pos.y = ~~(loc.y / loc.ysize);
                pos.x = editor.widthsX[spriter][1];
                pos.images = editor.widthsX[spriter][0];
                var autotiles = editor.material.images['autotile'];
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
                // console.log(pos,editor.material.images[pos.images].height)
                dataSelection.style.left = pos.x * 32 + 'px';
                dataSelection.style.top = pos.y * ysize + 'px';
                dataSelection.style.height = ysize - 6 + 'px';

                if (pos.x == 0 && pos.y == 0) {
                    // editor.info={idnum:0, id:'empty','images':'清除块', 'y':0};
                    editor.info = 0;
                } else {
                    if (hasOwnProp(autotiles, pos.images)) editor.info = {'images': pos.images, 'y': 0};
                    else if (pos.images == 'terrains') editor.info = {'images': pos.images, 'y': pos.y - 1};
                    else editor.info = {'images': pos.images, 'y': pos.y};

                    for (var ii = 0; ii < editor.ids.length; ii++) {
                        if (( editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y )
                            || (hasOwnProp(autotiles, pos.images) && editor.info.images == editor.ids[ii].id
                                && editor.info.y == editor.ids[ii].y)) {

                            editor.info = editor.ids[ii];
                            break;
                        }
                    }
                }
                tip.infos = JSON.parse(JSON.stringify(editor.info));
                editor_mode.onmode('nextChange');
                editor_mode.onmode('emenyitem');
                //editor_mode.emenyitem();
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
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        var pos={x: 0, y: 0, images: "terrains"};
        var ysize = 32;
        if(thisevent==0){
            //选中清除块
            editor.info = 0;
            editor.pos=pos;
        } else {
            var ids=editor.indexs[thisevent.idnum];
            ids=ids[0]?ids[0]:ids;
            editor.info=editor.ids[ids];
            pos.x=editor.widthsX[thisevent.images][1];
            pos.y=editor.info.y;
            if(thisevent.images=='terrains')pos.y++;
            ysize = thisevent.images.indexOf('48') === -1 ? 32 : 48;
        }
        setTimeout(function(){selectBox.isSelected = true;});
        dataSelection.style.left = pos.x * 32 + 'px';
        dataSelection.style.top = pos.y * ysize + 'px';
        dataSelection.style.height = ysize - 6 + 'px';
        tip.infos = JSON.parse(JSON.stringify(editor.info));
        editor_mode.onmode('nextChange');
        editor_mode.onmode('emenyitem');
    }

    var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);

    var copyLoc = document.getElementById('copyLoc');
    copyLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        preMapData = null;
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
            editor.drawEventBlock();
        });
    }

    var moveLoc = document.getElementById('moveLoc');
    moveLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        preMapData = null;
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
            editor.currentFloorData[v][last.x+','+last.y]=temp_atsfcytaf
        })
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('两位置的事件已互换');
            editor.drawEventBlock();
        });
    }

    var clearLoc = document.getElementById('clearLoc');
    clearLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        preMapData = null;
        reDo = null;
        editor.info = 0;
        editor_mode.onmode('');
        var now = editor.pos;
        editor.map[now.y][now.x]=editor.info;
        editor.updateMap();
        fields.forEach(function(v){
            editor.currentFloorData[v][now.x+','+now.y]=null;
        })
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('清空此点及事件成功');
            editor.drawEventBlock();
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


    editor.moveViewport=function(x,y){
        core.bigmap.offsetX = core.clamp(core.bigmap.offsetX+32*x, 0, 32*core.bigmap.width-416);
        core.bigmap.offsetY = core.clamp(core.bigmap.offsetY+32*y, 0, 32*core.bigmap.height-416);
        core.control.updateViewport();
        editor.buildMark();
        editor.drawEventBlock();
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

/* 
editor.loc
editor.pos
editor.info
始终是最后一次点击的结果
注意editor.info可能因为点击其他地方而被清空
*/

editor = new editor();