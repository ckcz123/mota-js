
exportMap = document.getElementById('exportMap')
exportMap.isExport=false
exportMap.onclick=function(){
    editor.updateMap();
    var sx=editor.map.length-1,sy=editor.map[0].length-1;

    var filestr = '';
    for (var yy = 0; yy <= sy; yy++) {
        filestr += '['
        for (var xx = 0; xx <= sx; xx++) {
            var mapxy = editor.map[yy][xx];
            if (typeof(mapxy) == typeof({})) {
                if ('idnum' in mapxy) mapxy = mapxy.idnum;
                else {
                    // mapxy='!!?';
                    tip.whichShow(3);
                    return;
                }
            } else if (typeof(mapxy) == 'undefined') {
                tip.whichShow(3);
                return;
            }
            mapxy = String(mapxy);
            mapxy = Array(Math.max(4 - mapxy.length, 0)).join(' ') + mapxy;
            filestr += mapxy + (xx == sx ? '' : ',')
        }

        filestr += ']' + (yy == sy ? '' : ',\n');
    }
    pout.value = filestr;
    mapEditArea.mapArr(filestr);
    exportMap.isExport = true;
    mapEditArea.error(0);
    tip.whichShow(2);
}
mapEditArea = document.getElementById('mapEditArea')
mapEditArea.errors=[ // 编号1,2
    "格式错误！请使用正确格式(请使用地图生成器进行生成，且需要和本地图宽高完全一致)",
    "当前有未定义ID（在地图区域显示红块），请修改ID或者到icons.js和maps.js中进行定义！"
]
mapEditArea.formatTimer=null
mapEditArea._mapArr=''
mapEditArea.mapArr=function(value){
    if(value!=null){
        var val=value
        var oldval=mapEditArea._mapArr
        if (val==oldval) return;

        if (exportMap.isExport) {
            exportMap.isExport = false;
            return;
        }
        if (mapEditArea.formatArr()) {
            mapEditArea.error(0);

            setTimeout(function () {
                if (mapEditArea.formatArr())mapEditArea.mapArr(mapEditArea.formatArr());
                mapEditArea.drawMap();
                tip.whichShow(8)
            }, 1000);
            clearTimeout(mapEditArea.formatTimer);
            mapEditArea.formatTimer = setTimeout(function () {
                pout.value = mapEditArea.formatArr();
            }, 5000); //5s后再格式化，不然光标跳到最后很烦
        } else {
            mapEditArea.error(1);
        }

        mapEditArea._mapArr=value
    }
    return mapEditArea._mapArr
}
pout.oninput=function(){
    mapEditArea.mapArr(pout.value)
}
mapEditArea._error=0
mapEditArea.error=function(value){
    if(value!=null){
        mapEditArea._error=value
        if (value>0)
        printe(mapEditArea.errors[value-1])
    }
    return mapEditArea._error
}
mapEditArea.drawMap= function () {
    // var mapArray = mapEditArea.mapArr().split(/\D+/).join(' ').trim().split(' ');
    var mapArray = JSON.parse('[' + mapEditArea.mapArr() + ']');
    var sy=editor.map.length,sx=editor.map[0].length;
    for (var y = 0; y < sy; y++)
        for (var x = 0; x < sx; x++) {
            var num = mapArray[y][x];
            if (num == 0)
                editor.map[y][x] = 0;
            else if (typeof(editor.indexs[num][0]) == 'undefined') {
                mapEditArea.error(2);
                editor.map[y][x] = undefined;
            } else editor.map[y][x] = editor.ids[[editor.indexs[num][0]]];
        }

    editor.updateMap();

}
mapEditArea.formatArr= function () {
    var formatArrStr = '';
    console.log(1)
    
    var si=editor.map.length,sk=editor.map[0].length;
    if (mapEditArea.mapArr().split(/\D+/).join(' ').trim().split(' ').length != si*sk) return false;
    var arr = mapEditArea.mapArr().replace(/\s+/g, '').split('],[');

    if (arr.length != si) return;
    for (var i = 0; i < si; i++) {
        var a = [];
        formatArrStr += '[';
        if (i == 0 || i == si-1) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
        else a = arr[i].split(/\D+/);
        if (a.length != sk) {
            formatArrStr = '';
            return;
        }

        for (var k = 0; k < sk; k++) {
            var num = parseInt(a[k]);
            formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == sk-1 ? '' : ',');
        }
        formatArrStr += ']' + (i == si-1 ? '' : ',\n');
    }
    return formatArrStr;
}
copyMap=document.getElementById('copyMap')
copyMap.err=''
copyMap.onclick=function(){
    tip.whichShow(0);
    if (pout.value.trim() != '') {
        if (mapEditArea.error()) {
            copyMap.err = mapEditArea.errors[mapEditArea.error() - 1];
            tip.whichShow(5)
            return;
        }
        try {
            pout.focus();
            pout.setSelectionRange(0, pout.value.length);
            document.execCommand("Copy");
            tip.whichShow(6);
        } catch (e) {
            copyMap.err = e;
            tip.whichShow(5);
        }
    } else {
        tip.whichShow(7);
    }
}
clearMapButton=document.getElementById('clearMapButton')
clearMapButton.onclick=function () {
    editor.mapInit();
    editor_mode.onmode('');
    editor.file.saveFloorFile(function (err) {
        if (err) {
            printe(err);
            throw(err)
        }
        ;printf('地图清除成功');
    });
    editor.updateMap();
    clearTimeout(mapEditArea.formatTimer);
    clearTimeout(tip.timer);
    pout.value = '';
    mapEditArea.mapArr('');
    tip.whichShow(4);
    mapEditArea.error(0);
}
deleteMap=document.getElementById('deleteMap')
deleteMap.onclick=function () {
    editor_mode.onmode('');
    var index = core.floorIds.indexOf(editor.currentFloorId);
    if (index>=0) {
        core.floorIds.splice(index,1);
        editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
            if (objs_.slice(-1)[0] != null) {
                printe(objs_.slice(-1)[0]);
                throw(objs_.slice(-1)[0])
            }
            ;printe('删除成功,请F5刷新编辑器生效');
        });
    }
    else printe('删除成功,请F5刷新编辑器生效');
}
printf = function (str_, type) {
    selectBox.isSelected(false);
    if (!type) {
        tip.whichShow(11);
    } else {
        tip.whichShow(12);
    }
    setTimeout(function () {
        if (!type) {
            tip.msgs[11] = String(str_);
            tip.whichShow(12);
        } else {
            tip.msgs[10] = String(str_);
            tip.whichShow(11);
        }
    }, 1);
}
printe = function (str_) {
    printf(str_, 'error')
}
tip=document.getElementById('tip')
tip.showHelp = function(value) {
    var tips = [
        '表格的文本域可以双击进行编辑',
        '双击地图可以选中素材，右键可以弹出菜单',
        '双击事件编辑器的图块可以进行长文本编辑/脚本编辑/地图选点/UI绘制预览等操作',
        'ESC或点击空白处可以自动保存当前修改',
        'H键可以打开操作帮助哦',
        'tileset贴图模式下可以按选中tileset素材，并在地图上拖动来一次绘制一个区域',
        '可以拖动地图上的图块和事件，或按Ctrl+C, Ctrl+X和Ctrl+V进行复制，剪切和粘贴，Delete删除'
    ];
    if (value == null) value = Math.floor(Math.random() * tips.length);
    printf('tips: ' + tips[value])
}
tip._infos= {}
tip.infos=function(value){
    if(value!=null){
        var val=value
        var oldval=tip._infos

        tip.isClearBlock(false);
        tip.isAirwall(false);
        if (typeof(val) != 'undefined') {
            if (val == 0) {
                tip.isClearBlock(true);
                return;
            }
            if ('id' in val) {
                if (val.idnum == 17) {
                    tip.isAirwall(true);
                    return;
                }
                tip.hasId = true;
            } else {
                tip.hasId = false;
            }
            tip.isAutotile = false;
            if (val.images == "autotile" && tip.hasId) tip.isAutotile = true;
            document.getElementById('isAirwall-else').innerHTML=(tip.hasId?`<p>图块编号：<span class="infoText">${ value['idnum'] }</span></p>
            <p>图块ID：<span class="infoText">${ value['id'] }</span></p>`:`
            <p class="warnText">该图块无对应的数字或ID存在，请先前往icons.js和maps.js中进行定义！</p>`)+`
            <p>图块所在素材：<span class="infoText">${ value['images'] + (tip.isAutotile ? '( '+value['id']+' )' : '') }</span>
            </p>
            <p>图块索引：<span class="infoText">${ value['y'] }</span></p>`
        }

        tip._infos=value
    }
    return tip._infos
}
tip.hasId= true
tip.isAutotile= false
tip._isSelectedBlock= false
tip.isSelectedBlock=function(value){
    if(value!=null){
        var dshow=document.getElementById('isSelectedBlock-if')
        var dhide=document.getElementById('isSelectedBlock-else')
        if(!value){
            var dtemp=dshow
            dshow=dhide
            dhide=dtemp
        }
        dshow.style.display=''
        dhide.style.display='none'
        tip._isSelectedBlock=value
    }
    return tip._isSelectedBlock
}
tip._isClearBlock= false
tip.isClearBlock=function(value){
    if(value!=null){
        var dshow=document.getElementById('isClearBlock-if')
        var dhide=document.getElementById('isClearBlock-else')
        if(!value){
            var dtemp=dshow
            dshow=dhide
            dhide=dtemp
        }
        dshow.style.display=''
        dhide.style.display='none'
        tip._isClearBlock=value
    }
    return tip._isClearBlock
}
tip._isAirwall= false
tip.isAirwall=function(value){
    if(value!=null){
        var dshow=document.getElementById('isAirwall-if')
        var dhide=document.getElementById('isAirwall-else')
        if(!value){
            var dtemp=dshow
            dshow=dhide
            dhide=dtemp
        }
        dshow.style.display=''
        dhide.style.display='none'
        tip._isAirwall=value
    }
    return tip._isAirwall
}
tip.geneMapSuccess= false
tip.timer= null
tip.msgs= [ //分别编号1,2,3,4,5,6,7,8,9,10；奇数警告，偶数成功
    "当前未选择任何图块，请先在右边选择要画的图块!",
    "生成地图成功！可点击复制按钮复制地图数组到剪切板",
    "生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！",
    "地图清除成功!",
    "复制失败！",
    "复制成功！可直接粘贴到楼层文件的地图数组中。",
    "复制失败！当前还没有数据",
    "修改成功！可点击复制按钮复制地图数组到剪切板",
    "选择背景图片失败！文件名格式错误或图片不存在！",
    "更新背景图片成功！",
    "11:警告",
    "12:成功"
]
tip._mapMsg= ''
tip.mapMsg=function(value){
    if(value!=null){
        document.getElementById('whichShow-if').innerText=value
        tip._mapMsg=value
    }
    return tip._mapMsg
}
tip._whichShow= 0
tip.whichShow=function(value){
    if(value!=null){

        var dshow=document.getElementById('whichShow-if')
        var dhide=null
        if(!value){
            var dtemp=dshow
            dshow=dhide
            dhide=dtemp
        }
        if(dshow)dshow.style.display=''
        if(dhide)dhide.style.display='none'

        if(dshow)dshow.setAttribute('class',(value%2) ? 'warnText' : 'successText')

        tip.mapMsg('');
        tip.msgs[4] = "复制失败！" + editTip.err;
        clearTimeout(tip.timer);
        if (value) {
            tip.mapMsg(tip.msgs[value - 1]);
            tip.timer = setTimeout(function () {
                if (!(value % 2))
                value = 0;
            }, 5000); //5秒后自动清除success，warn不清除
        }
        tip._whichShow=value
    }
    return tip._whichShow
}
selectBox=document.getElementById('selectBox')
dataSelection=document.getElementById('dataSelection')
selectBox._isSelected=false
selectBox.isSelected=function(value){
    if(value!=null){
        selectBox._isSelected=value;
        tip.isSelectedBlock(value);
        tip.whichShow(0);
        clearTimeout(tip.timer);
        dataSelection.style.display=value?'':'none'
    }
    return selectBox._isSelected
}

// ------ UI预览 & 地图选点相关 ------ //

uievent = {
    elements: {},
    values: {},
    isOpen: false,
    mode: ""
};

uievent.elements.div = document.getElementById('uieventDiv');
uievent.elements.title = document.getElementById('uieventTitle');
uievent.elements.yes = document.getElementById('uieventYes');
uievent.elements.no = document.getElementById('uieventNo');
uievent.elements.selectBackground = document.getElementById('uieventBackground');
uievent.elements.selectPoint = document.getElementById('selectPoint');
uievent.elements.selectFloor = document.getElementById('selectPointFloor');
uievent.elements.selectPointBox = document.getElementById('selectPointBox');
uievent.elements.body = document.getElementById('uieventBody');
uievent.elements.selectPointButtons = document.getElementById('selectPointButtons');

uievent.confirm = function () {
    var callback = uievent.values.callback, floorId = uievent.values.floorId,
        x = uievent.values.x, y = uievent.values.y;
    uievent.close();
    if (callback) {
        callback(floorId, x, y);
    }
}
uievent.elements.yes.onclick = uievent.confirm;

uievent.close = function () {
    uievent.isOpen = false;
    uievent.elements.div.style.display = 'none';
    uievent.values = {};
}
uievent.elements.no.onclick = uievent.close;

uievent.elements.selectBackground.onchange = function () {
    uievent.drawPreviewUI();
}

uievent.drawPreviewUI = function () {
    core.setAlpha('uievent', 1);
    core.clearMap('uievent');

    // 绘制UI
    var background = uievent.elements.selectBackground.value;
    if (background == 'thumbnail') {
        core.drawThumbnail(editor.currentFloorId, null, {}, 'uievent');
    }
    else {
        core.fillRect('uievent', 0, 0, core.__PIXELS__, core.__PIXELS__, background);
    }

    if (uievent.values.list instanceof Array) {
        uievent.values.list.forEach(function (data) {
            var type = data.type;
            if (!type || !core.ui["_uievent_"+type]) return;
            core.ui["_uievent_"+type](data);
        })
    }
}

uievent.previewUI = function (list) {
    uievent.isOpen = true;
    uievent.elements.div.style.display = 'block';
    uievent.mode = 'previewUI';
    uievent.elements.selectPoint.style.display = 'none';
    uievent.elements.yes.style.display = 'none';
    uievent.elements.title.innerText = 'UI绘制预览';
    uievent.elements.selectBackground.style.display = 'inline';
    uievent.elements.selectBackground.value = 'thumbnail';
    uievent.elements.selectPointBox.style.display = 'none';

    uievent.values.list = list;
    uievent.drawPreviewUI();
}

uievent.selectPoint = function (floorId, x, y, hideFloor, callback) {
    uievent.values.hideFloor = hideFloor;
    uievent.values.callback = callback;
    uievent.values.size = editor.isMobile ? window.innerWidth / core.__SIZE__ : 32;
    uievent.elements.selectPointBox.style.width = (uievent.values.size - 6) + "px";
    uievent.elements.selectPointBox.style.height = (uievent.values.size - 6) + "px";

    uievent.isOpen = true;
    uievent.elements.div.style.display = 'block';
    uievent.mode = 'selectPoint';
    uievent.elements.selectPoint.style.display = 'block';
    uievent.elements.yes.style.display = 'inline';
    uievent.elements.selectBackground.style.display = 'none';
    uievent.elements.selectFloor.style.display = hideFloor ? 'none': 'inline';
    uievent.elements.selectPointBox.style.display = 'block';

    // Append children
    var floors = "";
    core.floorIds.forEach(function (f) {
        floors += "<option value="+f+">"+f+"</option>";
    })
    uievent.elements.selectFloor.innerHTML = floors;

    this.setPoint(floorId || editor.currentFloorId, core.calValue(x) || 0, core.calValue(y) || 0);
}

uievent.updateSelectPoint = function (redraw) {
    uievent.elements.title.innerText = '地图选点 ('+uievent.values.x+","+uievent.values.y+')';
    if (redraw) {
        core.setAlpha('uievent', 1);
        core.clearMap('uievent');
        core.drawThumbnail(uievent.values.floorId, null, null,
            {ctx: 'uievent', centerX: uievent.values.left + core.__HALF_SIZE__,
                centerY: uievent.values.top + core.__HALF_SIZE__});
    }
    uievent.elements.selectPointBox.style.left = uievent.values.size * (uievent.values.x - uievent.values.left) + "px";
    uievent.elements.selectPointBox.style.top = uievent.values.size * (uievent.values.y - uievent.values.top) + "px";
}

uievent.setPoint = function (floorId, x, y) {
    if (core.floorIds.indexOf(floorId) == -1) floorId = editor.currentFloorId;
    uievent.values.floorId = floorId;
    uievent.elements.selectFloor.value = floorId;
    uievent.values.x = x != null ? x : ( uievent.values.x || 0);
    uievent.values.y = y != null ? y : ( uievent.values.x || 0);
    uievent.values.width = core.floors[uievent.values.floorId].width || core.__SIZE__;
    uievent.values.height = core.floors[uievent.values.floorId].height || core.__SIZE__;
    uievent.values.left = core.clamp(uievent.values.x - core.__HALF_SIZE__, 0, uievent.values.width - core.__SIZE__);
    uievent.values.top = core.clamp(uievent.values.y - core.__HALF_SIZE__, 0, uievent.values.height - core.__SIZE__);
    uievent.updateSelectPoint(true);
}

uievent.elements.selectFloor.onchange = function () {
    uievent.setPoint(uievent.elements.selectFloor.value);
}

uievent.elements.selectPointBox.onclick = function (e) {
    e.stopPropagation();
}

uievent.elements.body.onclick = function (e) {
    if (uievent.mode != 'selectPoint') return;
    uievent.values.x = uievent.values.left + Math.floor(e.offsetX / uievent.values.size);
    uievent.values.y = uievent.values.top + Math.floor(e.offsetY / uievent.values.size);
    uievent.updateSelectPoint(false);
}

uievent.move = function (dx, dy) {
    if (uievent.mode != 'selectPoint') return;
    uievent.values.left = core.clamp(uievent.values.left + dx, 0, uievent.values.width - core.__SIZE__);
    uievent.values.top = core.clamp(uievent.values.top + dy, 0, uievent.values.height - core.__SIZE__);
    this.updateSelectPoint(true);
};

(function() {

    var viewportButtons = uievent.elements.selectPointButtons;
    var pressTimer = null;
    for(var ii=0,node;node=viewportButtons.children[ii];ii++){
        (function(x,y){
            var move = function () {
                uievent.move(x, y);
            }
            node.onmousedown = function () {
                clearTimeout(pressTimer);
                pressTimer = setTimeout(function () {
                    pressTimer = -1;
                    var f = function () {
                        if (pressTimer != null) {
                            move();
                            setTimeout(f, 150);
                        }
                    }
                    f();
                }, 500);
            };
            node.onmouseup = function () {
                if (pressTimer > 0) {
                    clearTimeout(pressTimer);
                    move();
                }
                pressTimer = null;
            }
        })([-1,0,0,1][ii],[0,-1,1,0][ii]);
    }
})();

uievent.elements.div.onmousewheel = function (e) {
    if (uievent.mode != 'selectPoint' || uievent.values.hideFloor) return;
    var index = core.floorIds.indexOf(uievent.values.floorId);
    try {
        if (e.wheelDelta)
            index+=Math.sign(e.wheelDelta);
        else if (e.detail)
            index+=Math.sign(e.detail);
    } catch (ee) { main.log(ee); }
    index = core.clamp(index, 0, core.floorIds.length - 1);
    uievent.setPoint(core.floorIds[index]);
}

