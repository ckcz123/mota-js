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
    
    var useCompress = main.useCompress;
    main.useCompress = false;
    editor.airwallImg = new Image();
    editor.airwallImg.src = './project/images/airwall.png';

    main.init('editor', function () {
        editor_util_wrapper(editor);
        editor_game_wrapper(editor, main, core);
        editor_file_wrapper(editor);
        editor_table_wrapper(editor);
        editor_unsorted_1_wrapper(editor);
        editor.printe=printe;
        afterMainInit();
    });

    var afterMainInit = function () {
        editor.game.fixFunctionInGameData();
        editor.main = main;
        editor.core = core;
        editor.fs = fs;
        editor_file = editor_file(editor, function () {
            editor.file = editor_file;
            editor_mode = editor_mode(editor);
            editor_unsorted_2_wrapper(editor_mode);
            editor.mode = editor_mode;
            core.resetGame(core.firstData.hero, null, core.firstData.floorId, core.clone(core.initStatus.maps));
            core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function () {
                afterCoreReset();
            }, true);
            core.events.setInitData(null);
        });
    }

    var afterCoreReset = function () {
        
        editor.game.idsInit(core.maps, core.icons.icons); // 初始化图片素材信息
        editor.drawInitData(core.icons.icons); // 初始化绘图

        editor.game.fetchMapFromCore();
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

        if (editor.useCompress == null) editor.useCompress = useCompress;
        if (Boolean(callback)) callback();

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

        editor.game.fetchMapFromCore();
        editor.updateMap();
        editor_mode.floor();
        editor.drawEventBlock();
        if (callback) callback();
    });
}

/////////// 游戏绘图相关 ///////////

editor.prototype.drawEventBlock = function () {
    var fg=document.getElementById('efg').getContext('2d');

    fg.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
    for (var i=0;i<core.__SIZE__;i++) {
        for (var j=0;j<core.__SIZE__;j++) {
            var color=[];
            var loc=(i+core.bigmap.offsetX/32)+","+(j+core.bigmap.offsetY/32);
            if (editor.currentFloorData.events[loc])
                color.push('#FF0000');
            if (editor.currentFloorData.changeFloor[loc])
                color.push('#00FF00');
            if (editor.currentFloorData.afterBattle[loc])
                color.push('#FFFF00');
            if (editor.currentFloorData.afterGetItem[loc])
                color.push('#00FFFF');
            if (editor.currentFloorData.afterOpenDoor[loc])
                color.push('#FF00FF');
            if (editor.currentFloorData.cannotMove[loc])
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
    var blocks =  core.maps._mapIntoBlocks(editor.map.map(function (v) {
        return v.map(function (v) {
            try {
                return v.idnum || v || 0
            }
            catch (e) {
                console.log("Unable to read idnum from "+v);
                return 0;
            }
        });
    }), {'events': editor.currentFloorData.events}, editor.currentFloorId);
    core.status.thisMap.blocks = blocks;

    var updateMap = function () {
        core.removeGlobalAnimate();
        core.clearMap('bg');
        core.clearMap('event');
        core.clearMap('event2');
        core.clearMap('fg');
        core.maps._drawMap_drawAll();
    }
    updateMap();

    var drawTile = function (ctx, x, y, tileInfo) { // 绘制一个普通块

        //ctx.clearRect(x*32, y*32, 32, 32);
        if (tileInfo == 0) return;

        if (typeof(tileInfo) == typeof([][0]) || !Object.prototype.hasOwnProperty.call(tileInfo, 'idnum')) {//未定义块画红块
            if (typeof(tileInfo) != typeof([][0]) && Object.prototype.hasOwnProperty.call(tileInfo, 'images')) {
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
    core.bigmap.offsetX = core.clamp(core.bigmap.offsetX+32*x, 0, 32*core.bigmap.width-core.__PIXELS__);
    core.bigmap.offsetY = core.clamp(core.bigmap.offsetY+32*y, 0, 32*core.bigmap.height-core.__PIXELS__);
    core.control.updateViewport();
    editor.buildMark();
    editor.drawPosSelection();
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
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<td>' + (i+offsetX) + '<div class="colBlock" style="left:' + (i * 32 + 1) + 'px;"></div></td>';
            colNum += tpl;
        }
        arrColMark.innerHTML = '<tr>' + colNum + '</tr>';
        mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
        var rowNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<tr><td>' + (i+offsetY) + '<div class="rowBlock" style="top:' + (i * 32 + 1) + 'px;"></div></td></tr>';
            rowNum += tpl;
        }
        arrRowMark.innerHTML = rowNum;
        mapRowMark.innerHTML = rowNum;
    }
    var buildMark_mobile = function (offsetX,offsetY) {
        var colNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<td>' + (' '+i).slice(-2).replace(' ','&nbsp;') + '<div class="colBlock" style="left:' + (i * 96/core.__SIZE__) + 'vw;"></div></td>';
            colNum += tpl;
        }
        arrColMark.innerHTML = '<tr>' + colNum + '</tr>';
        //mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
        var rowNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<tr><td>' + (' '+i).slice(-2).replace(' ','&nbsp;') + '<div class="rowBlock" style="top:' + (i * 96/core.__SIZE__) + 'vw;"></div></td></tr>';
            rowNum += tpl;
        }
        arrRowMark.innerHTML = rowNum;
        //mapRowMark.innerHTML = rowNum;
        //=====
        var colNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<div class="coltd" style="left:' + (i * 96/core.__SIZE__) + 'vw;"><div class="coltext">' + (' '+(i+offsetX)).slice(-2).replace(' ','&nbsp;') + '</div><div class="colBlock"></div></div>';
            colNum += tpl;
        }
        mapColMark.innerHTML = '<div class="coltr">' + colNum + '</div>';
        var rowNum = ' ';
        for (var i = 0; i < core.__SIZE__; i++) {
            var tpl = '<div class="rowtr"><div class="rowtd"  style="top:' + (i * 96/core.__SIZE__) + 'vw;"><div class="rowtext">' + (' '+(i+offsetY)).slice(-2).replace(' ','&nbsp;') + '</div><div class="rowBlock"></div></div></div>';
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
        ysize = thisevent.images.endsWith('48') ? 48 : 32;
    }
    var dataSelection = document.getElementById('dataSelection');
    dataSelection.style.left = pos.x * 32 + 'px';
    dataSelection.style.top = pos.y * ysize + 'px';
    dataSelection.style.height = ysize - 6 + 'px';
    setTimeout(function(){selectBox.isSelected(true);});
    editor.info = JSON.parse(JSON.stringify(thisevent));
    tip.infos(JSON.parse(JSON.stringify(thisevent)));
    editor.pos=pos;
    editor_mode.onmode('nextChange');
    editor_mode.onmode('enemyitem');
}

editor.prototype.listen = function () {
    // 移动至 editor_unsorted_1.js
}//绑定事件

editor.prototype.mobile_listen=function(){
    // 移动至 editor_unsorted_1.js
}

editor = new editor();