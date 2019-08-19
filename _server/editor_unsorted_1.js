editor_unsorted_1_wrapper=function(editor){

editor.constructor.prototype.listen=function () {
    editor.dom.body.onmousedown = editor.uifunctions.body_click;
    // 自定义了右键菜单, 阻止默认行为
    editor.dom.eui.oncontextmenu=function(e){e.preventDefault()}
    editor.dom.eui.ondblclick = editor.uifunctions.map_doubleClick

    editor.dom.eui.onmousedown = editor.uifunctions.map_ondown
    editor.dom.eui.onmousemove = editor.uifunctions.map_onmove
    editor.dom.eui.onmouseup = editor.uifunctions.map_onup

    editor.dom.mid.onmousewheel = editor.uifunctions.map_mousewheel 


    editor.uivalues.shortcut = core.getLocalStorage('shortcut',{48: 0, 49: 0, 50: 0, 51: 0, 52: 0, 53: 0, 54: 0, 55: 0, 56: 0, 57: 0});

    editor.dom.body.onkeydown = editor.uifunctions.body_shortcut
    
    editor.uifunctions.getScrollBarHeight = function () {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }
    editor.uivalues.scrollBarHeight = editor.uifunctions.getScrollBarHeight();

    editor.dom.iconExpandBtn.style.display = 'block';
    editor.dom.iconExpandBtn.innerText = editor.uivalues.folded ? "展开" : "折叠";
    editor.dom.iconExpandBtn.onclick = function () {
        if (confirm(editor.uivalues.folded ? "你想要展开素材吗？\n展开模式下将显示全素材内容。"
            : ("你想要折叠素材吗？\n折叠模式下每个素材将仅显示单列，并且每"+editor.foldPerCol+"个自动换列。"))) {
            core.setLocalStorage('folded', !editor.uivalues.folded);
            window.location.reload();
        }
    }

    var dataSelection = document.getElementById('dataSelection');
    var iconLib=document.getElementById('iconLib');
    iconLib.onmousedown = function (e) {
        e.stopPropagation();
        if (!editor.isMobile && e.clientY>=iconLib.offsetHeight - editor.uivalues.scrollBarHeight) return;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var loc = {
            'x': scrollLeft + e.clientX + iconLib.scrollLeft - right.offsetLeft - iconLib.offsetLeft,
            'y': scrollTop + e.clientY + iconLib.scrollTop - right.offsetTop - iconLib.offsetTop,
            'size': 32
        };
        editor.loc = loc;
        var pos = editor.uifunctions.locToPos(loc);
        for (var spriter in editor.widthsX) {
            if (pos.x >= editor.widthsX[spriter][1] && pos.x < editor.widthsX[spriter][2]) {
                var ysize = spriter.endsWith('48') ? 48 : 32;
                loc.ysize = ysize;
                pos.images = editor.widthsX[spriter][0];
                pos.y = ~~(loc.y / loc.ysize);
                if(!editor.uivalues.folded && core.tilesets.indexOf(pos.images)==-1) pos.x = editor.widthsX[spriter][1];
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
                }
                else {
                    var height = editor.widthsX[spriter][3], col = height / ysize;
                    if (editor.uivalues.folded && core.tilesets.indexOf(pos.images)==-1) {
                        col = (pos.x == editor.widthsX[spriter][2] - 1) ? ((col - 1) % editor.foldPerCol + 1) : editor.foldPerCol;
                    }
                    if (spriter == 'terrains' && pos.x == editor.widthsX[spriter][1]) col += 2;
                    pos.y = Math.min(pos.y, col - 1);
                }

                selectBox.isSelected(true);
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
                    if (autotiles[pos.images]) editor.info = {'images': pos.images, 'y': 0};
                    else if (core.tilesets.indexOf(pos.images)!=-1) editor.info = {'images': pos.images, 'y': pos.y, 'x': pos.x-editor.widthsX[spriter][1]};
                    else {
                        var y = pos.y;
                        if (editor.uivalues.folded) {
                            y += editor.foldPerCol * (pos.x-editor.widthsX[spriter][1]);
                        }
                        if (pos.images == 'terrains' && pos.x == 0) y -= 2;
                        editor.info = {'images': pos.images, 'y': y}
                    }

                    for (var ii = 0; ii < editor.ids.length; ii++) {
                        if ((core.tilesets.indexOf(pos.images)!=-1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y && editor.info.x == editor.ids[ii].x)
                            || (Object.prototype.hasOwnProperty.call(autotiles, pos.images) && editor.info.images == editor.ids[ii].id
                            && editor.info.y == editor.ids[ii].y)
                            || (core.tilesets.indexOf(pos.images)==-1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y )
                            ) {

                            editor.info = editor.ids[ii];
                            break;
                        }
                    }
                }
                tip.infos(JSON.parse(JSON.stringify(editor.info)));
                editor_mode.onmode('nextChange');
                editor_mode.onmode('enemyitem');
                //editor_mode.enemyitem();
            }
        }
    }

    var midMenu=document.getElementById('midMenu');
    midMenu.oncontextmenu=function(e){e.preventDefault()}
    editor.lastRightButtonPos=[{x:0,y:0},{x:0,y:0}];
    editor.lastCopyedInfo = [null, null];
    editor.showMidMenu=function(x,y){
        editor.lastRightButtonPos=JSON.parse(JSON.stringify(
            [editor.pos,editor.lastRightButtonPos[0]]
        ));
        // --- copy
        editor.lastCopyedInfo = [editor.copyFromPos(), editor.lastCopyedInfo[0]];
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
        else if (['leftPortal','rightPortal','downPortal','upPortal'].indexOf(thisevent.id)>=0) {
            addFloorEvent.style.display='block';
            addFloorEvent.children[0].innerHTML='绑定楼传事件';
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
        var loc = editor.pos.x+","+editor.pos.y;
        if (thisevent.id=='upFloor') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":next", "stair": "downFloor"};
        }
        else if (thisevent.id=='downFloor') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":before", "stair": "upFloor"};
        }
        else if (thisevent.id=='leftPortal' || thisevent.id=='rightPortal') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":next", "stair": ":symmetry_x"}
        }
        else if (thisevent.id=='upPortal' || thisevent.id=='downPortal') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":next", "stair": ":symmetry_y"}
        }
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            editor.drawPosSelection();
            editor_mode.showMode('loc');
            printf('添加楼梯事件成功');
        });
    }

    var chooseThis = document.getElementById('chooseThis');
    chooseThis.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        selectBox.isSelected(false);

        editor_mode.onmode('nextChange');
        editor_mode.onmode('loc');
        //editor_mode.loc();
        //tip.whichShow(1);
        if(editor.isMobile)editor.showdataarea(false);
    }

    var chooseInRight = document.getElementById('chooseInRight');
    chooseInRight.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor[editor.layerMod][editor.pos.y][editor.pos.x];
        editor.setSelectBoxFromInfo(thisevent);
    }

    var copyLoc = document.getElementById('copyLoc');
    copyLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        editor.uivalues.preMapData = null;
        editor.uivalues.reDo = null;
        editor_mode.onmode('');
        var now = editor.pos, last = editor.lastRightButtonPos[1];
        if (now.x == last.x && now.y == last.y) return;
        editor.pasteToPos(editor.lastCopyedInfo[1]);
        editor.updateMap();
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
        editor.uivalues.preMapData = null;
        editor.uivalues.reDo = null;
        editor_mode.onmode('');
        editor.exchangePos(editor.pos, editor.lastRightButtonPos[1]);
    }

    var clearEvent = document.getElementById('clearEvent');
    clearEvent.onmousedown = function (e) {
        e.stopPropagation();
        editor.uivalues.reDo = null;
        editor.clearPos(false);
    }

    var clearLoc = document.getElementById('clearLoc');
    clearLoc.onmousedown = function(e){
        e.stopPropagation();
        editor.uivalues.reDo = null;
        editor.clearPos(true);
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
    if(brushMod3) {
        brushMod3.onchange=function(){
            // tip.showHelp(5)
            tip.isSelectedBlock(false)
            tip.msgs[11] = String('tileset贴图模式下可以按选中tileset素材，并在地图上拖动来一次绘制一个区域');
            tip.whichShow(12);
            editor.brushMod=brushMod3.value;
        }
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
    var pressTimer = null;
    for(var ii=0,node;node=viewportButtons.children[ii];ii++){
        (function(x,y){
            var move = function () {
                editor.moveViewport(x, y);
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
}

editor.constructor.prototype.mobile_listen=function () {
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

    editor.dom.eui.ontouchstart=editor.dom.eui.onmousedown
    editor.dom.eui.onmousedown=null
    editor.dom.eui.ontouchmove=editor.dom.eui.onmousemove
    editor.dom.eui.onmousemove=null
    editor.dom.eui.ontouchend=editor.dom.eui.onmouseup
    editor.dom.eui.onmouseup=null


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

}