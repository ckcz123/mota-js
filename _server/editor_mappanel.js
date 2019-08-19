editor_mappanel_wrapper = function (editor) {

    // 暂时先 注释+分类 内部函数未完成重构

    /**
     * 在绘图区格子内画一个随机色块
     */
    editor.uifunctions.fillPos=function(pos) {
        editor.dom.euiCtx.fillStyle = '#' + ~~(Math.random() * 8) + ~~(Math.random() * 8) + ~~(Math.random() * 8);
        editor.dom.euiCtx.fillRect(pos.x * 32 + 12 - core.bigmap.offsetX, pos.y * 32 + 12 - core.bigmap.offsetY, 8, 8);
    }

    /**
     * 从鼠标点击返回可用的组件内坐标
     */
    editor.uifunctions.eToLoc=function (e) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var xx=e.clientX,yy=e.clientY
        if(editor.isMobile){xx=e.touches[0].clientX,yy=e.touches[0].clientY}
        editor.loc = {
            'x': scrollLeft + xx - editor.dom.mid.offsetLeft - editor.dom.mapEdit.offsetLeft,
            'y': scrollTop + yy - editor.dom.mid.offsetTop - editor.dom.mapEdit.offsetTop,
            'size': editor.isMobile?(32*innerWidth*0.96/core.__PIXELS__):32
        };
        return editor.loc;
    }

    /**
     * 组件内坐标转地图位置
     * @param {Boolean} addViewportOffset 是否加上大地图的偏置
     */
    editor.uifunctions.locToPos= function(loc, addViewportOffset) {
        var offsetX=0, offsetY=0;
        if (addViewportOffset){
            offsetX=core.bigmap.offsetX/32;
            offsetY=core.bigmap.offsetY/32;
        }
        editor.pos = {'x': ~~(loc.x / loc.size)+offsetX, 'y': ~~(loc.y / loc.size)+offsetY}
        return editor.pos;
    }

    /**
     * editor.dom.eui.ondblclick
     * 双击地图可以选中素材
     */
    editor.uifunctions.map_doubleClick= function(e) {
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc,true);
        editor.setSelectBoxFromInfo(editor[editor.layerMod][pos.y][pos.x]);
        return;
    }

    /**
     * 用于鼠标移出map后清除状态
     */
    editor.uifunctions.clearMapStepStatus=function() {
        if (editor.uivalues.mouseOutCheck > 1) {
            editor.uivalues.mouseOutCheck--;
            setTimeout(editor.uifunctions.clearMapStepStatus, 1000);
            return;
        }
        editor.uivalues.holdingPath = 0;
        editor.uivalues.stepPostfix = [];
        editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        editor.uivalues.startPos = editor.uivalues.endPos = null;
    }

    /**
     * editor.dom.eui.onmousedown
     * + 右键进入菜单
     * + 非绘图时选中
     * + 绘图时画个矩形在那个位置
     */
    editor.uifunctions.map_ondown= function (e) {
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc,true);
        if (e.button==2){
            editor.showMidMenu(e.clientX,e.clientY);
            return false;
        }
        if (!selectBox.isSelected()) {
            editor_mode.onmode('nextChange');
            editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow(1);
            tip.showHelp(6);
            editor.uivalues.startPos = pos;
            editor.dom.euiCtx.strokeStyle = '#FF0000';
            editor.dom.euiCtx.lineWidth = 3;
            if(editor.isMobile)editor.showMidMenu(e.clientX,e.clientY);
            return false;
        }

        editor.uivalues.holdingPath = 1;
        editor.uivalues.mouseOutCheck = 2;
        setTimeout(editor.uifunctions.clearMapStepStatus);
        editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        editor.uivalues.stepPostfix = [];
        editor.uivalues.stepPostfix.push(pos);
        editor.uifunctions.fillPos(pos);
        return false;
    }

    /**
     * editor.dom.eui.onmousemove
     * + 非绘图模式时维护起止位置并画箭头
     * + 绘图模式时找到与队列尾相邻的鼠标方向的点画个矩形
     */
    editor.uifunctions.map_onmove= function (e) {
        if (!selectBox.isSelected()) {
            if (editor.uivalues.startPos == null) return;
            //tip.whichShow(1);
            var loc = editor.uifunctions.eToLoc(e);
            var pos = editor.uifunctions.locToPos(loc,true);
            if (editor.uivalues.endPos != null && editor.uivalues.endPos.x == pos.x && editor.uivalues.endPos.y == pos.y) return;
            if (editor.uivalues.endPos != null) {
                editor.dom.euiCtx.clearRect(Math.min(32 * editor.uivalues.startPos.x - core.bigmap.offsetX, 32 * editor.uivalues.endPos.x - core.bigmap.offsetX),
                    Math.min(32 * editor.uivalues.startPos.y - core.bigmap.offsetY, 32 * editor.uivalues.endPos.y - core.bigmap.offsetY),
                    (Math.abs(editor.uivalues.startPos.x - editor.uivalues.endPos.x) + 1) * 32, (Math.abs(editor.uivalues.startPos.y - editor.uivalues.endPos.y) + 1) * 32)
            }
            editor.uivalues.endPos = pos;
            if (editor.uivalues.startPos != null) {
                if (editor.uivalues.startPos.x != editor.uivalues.endPos.x || editor.uivalues.startPos.y != editor.uivalues.endPos.y) {
                    core.drawArrow('eui',
                        32 * editor.uivalues.startPos.x + 16 - core.bigmap.offsetX, 32 * editor.uivalues.startPos.y + 16 - core.bigmap.offsetY,
                        32 * editor.uivalues.endPos.x + 16 - core.bigmap.offsetX, 32 * editor.uivalues.endPos.y + 16 - core.bigmap.offsetY);
                }
            }
            // editor_mode.onmode('nextChange');
            // editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow(1);
            // tip.showHelp(6);
            return false;
        }

        if (editor.uivalues.holdingPath == 0) {
            return false;
        }
        editor.uivalues.mouseOutCheck = 2;
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc,true);
        var pos0 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1]
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
            editor.uivalues.stepPostfix.push(pos);
            editor.uifunctions.fillPos(pos);
        }
        return false;
    }

    /**
     * editor.dom.eui.onmouseup
     * + 非绘图模式时, 交换首末点的内容
     * + 绘图模式时, 根据画线/画矩形/画tileset 做对应的绘制
     */
    editor.uifunctions.map_onup=function (e) {
        if (!selectBox.isSelected()) {
            //tip.whichShow(1);
            // editor.movePos(editor.uivalues.startPos, editor.uivalues.endPos);
            if (editor.layerMod == 'map')
                editor.exchangePos(editor.uivalues.startPos, editor.uivalues.endPos);
            else
                editor.exchangeBgFg(editor.uivalues.startPos, editor.uivalues.endPos, editor.layerMod);
            editor.uivalues.startPos = editor.uivalues.endPos = null;
            editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
            return false;
        }
        editor.uivalues.holdingPath = 0;
        if (editor.uivalues.stepPostfix && editor.uivalues.stepPostfix.length) {
            editor.uivalues.preMapData = JSON.parse(JSON.stringify({map:editor.map,fgmap:editor.fgmap,bgmap:editor.bgmap}));
            if(editor.brushMod!=='line'){
                var x0=editor.uivalues.stepPostfix[0].x;
                var y0=editor.uivalues.stepPostfix[0].y;
                var x1=editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length-1].x;
                var y1=editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length-1].y;
                if(x0>x1){x0^=x1;x1^=x0;x0^=x1;}//swap
                if(y0>y1){y0^=y1;y1^=y0;y0^=y1;}//swap
                editor.uivalues.stepPostfix=[];
                for(var jj=y0;jj<=y1;jj++){
                    for(var ii=x0;ii<=x1;ii++){
                        editor.uivalues.stepPostfix.push({x:ii,y:jj})
                    }
                }
            }
            editor.uivalues.currDrawData.pos = JSON.parse(JSON.stringify(editor.uivalues.stepPostfix));
            editor.uivalues.currDrawData.info = JSON.parse(JSON.stringify(editor.info));
            editor.uivalues.reDo = null;
            // console.log(editor.uivalues.stepPostfix);
            if(editor.brushMod==='tileset' && core.tilesets.indexOf(editor.info.images)!==-1){
                var imgWidth=~~(core.material.images.tilesets[editor.info.images].width/32);
                var x0=editor.uivalues.stepPostfix[0].x;
                var y0=editor.uivalues.stepPostfix[0].y;
                var idnum=editor.info.idnum;
                for (var ii = 0; ii < editor.uivalues.stepPostfix.length; ii++){
                    if(editor.uivalues.stepPostfix[ii].y!=y0){
                        y0++;
                        idnum+=imgWidth;
                    }
                    editor[editor.layerMod][editor.uivalues.stepPostfix[ii].y][editor.uivalues.stepPostfix[ii].x] = editor.ids[editor.indexs[idnum+editor.uivalues.stepPostfix[ii].x-x0]];
                }
            } else {
                for (var ii = 0; ii < editor.uivalues.stepPostfix.length; ii++)
                editor[editor.layerMod][editor.uivalues.stepPostfix[ii].y][editor.uivalues.stepPostfix[ii].x] = editor.info;
            }
            // console.log(editor.map);
            editor.updateMap();
            editor.uivalues.holdingPath = 0;
            editor.uivalues.stepPostfix = [];
            editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        }
        return false;
    }

    /**
     * editor.dom.mid.onmousewheel
     * 在地图编辑区域滚轮切换楼层
     */
    editor.uifunctions.map_mousewheel=function (e) {
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
            editor.dom.selectFloor.value = toId;
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
        return false;
    }
}