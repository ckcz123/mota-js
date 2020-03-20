// 由于历史遗留原因, 以下变量作为全局变量使用
// exportMap mapEditArea pout mapEditArea copyMap clearMapButton deleteMap printf printe tip selectBox
// 除对这些量的功能修改外, 误在此文件中增加新变量或函数
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
        'tileset贴图模式可以在地图上拖动来一次绘制一个区域；右键额外素材也可以绑定宽高',
        '可以拖动地图上的图块和事件，或按Ctrl+C, Ctrl+X和Ctrl+V进行复制，剪切和粘贴，Delete删除',
        'Alt+数字键保存图块，数字键读取保存的图块',
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
selectBox._isSelected=false
selectBox.isSelected=function(value){
    if(value!=null){
        selectBox._isSelected=value;
        tip.isSelectedBlock(value);
        tip.whichShow(0);
        clearTimeout(tip.timer);
        editor.dom.dataSelection.style.display=value?'':'none'
    }
    return selectBox._isSelected
}

// 修改此文件前先看文件开头的说明