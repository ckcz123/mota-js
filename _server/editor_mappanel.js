editor_mappanel_wrapper = function (editor) {

    // 暂时先 注释+分类 内部函数未完成重构

    /**
     * 在绘图区格子内画一个随机色块
     */
    editor.uifunctions.fillPos = function (pos) {
        editor.dom.euiCtx.fillStyle = '#' + ~~(Math.random() * 8) + ~~(Math.random() * 8) + ~~(Math.random() * 8);
        editor.dom.euiCtx.fillRect(pos.x * 32 + 12 - core.bigmap.offsetX, pos.y * 32 + 12 - core.bigmap.offsetY, 8, 8);
    }

    /**
     * 从鼠标点击返回可用的组件内坐标
     */
    editor.uifunctions.eToLoc = function (e) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var xx = e.clientX, yy = e.clientY
        if (editor.isMobile) { xx = e.touches[0].clientX, yy = e.touches[0].clientY }
        editor.loc = {
            'x': scrollLeft + xx - editor.dom.mid.offsetLeft - editor.dom.mapEdit.offsetLeft,
            'y': scrollTop + yy - editor.dom.mid.offsetTop - editor.dom.mapEdit.offsetTop,
            'size': editor.isMobile ? (32 * innerWidth * 0.96 / core.__PIXELS__) : 32
        };
        return editor.loc;
    }

    /**
     * 组件内坐标转地图位置
     * @param {Boolean} addViewportOffset 是否加上大地图的偏置
     */
    editor.uifunctions.locToPos = function (loc, addViewportOffset) {
        var offsetX = 0, offsetY = 0;
        if (addViewportOffset) {
            offsetX = core.bigmap.offsetX / 32;
            offsetY = core.bigmap.offsetY / 32;
        }
        editor.pos = { 'x': ~~(loc.x / loc.size) + offsetX, 'y': ~~(loc.y / loc.size) + offsetY }
        return editor.pos;
    }

    /**
     * editor.dom.eui.ondblclick
     * 双击地图可以选中素材
     */
    editor.uifunctions.map_doubleClick = function (e) {
        if (editor.uivalues.bindSpecialDoor.loc != null) return;
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc, true);
        editor.setSelectBoxFromInfo(editor[editor.layerMod][pos.y][pos.x], true);
        return;
    }

    /**
     * 用于鼠标移出map后清除状态
     */
    editor.uifunctions.clearMapStepStatus = function () {
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
     * + 绑定机关门事件的选择怪物
     * + 右键进入菜单
     * + 非绘图时选中
     * + 绘图时画个矩形在那个位置
     */
    editor.uifunctions.map_ondown = function (e) {
        editor.uivalues.selectedArea = null;
        editor.uivalues.lastMoveE=e;
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc, true);
        if (editor.uivalues.bindSpecialDoor.loc != null) {
            var x = editor.pos.x, y = editor.pos.y, id = (editor.map[y][x] || {}).id;
            // 检测是否是怪物
            if (id && editor.game.getEnemy(id)) {
                var locstr = x + "," + y, index = editor.uivalues.bindSpecialDoor.enemys.indexOf(locstr);
                if (index >= 0) editor.uivalues.bindSpecialDoor.enemys.splice(index, 1);
                else editor.uivalues.bindSpecialDoor.enemys.push(locstr);
                editor.drawEventBlock();
                editor.uifunctions._extraEvent_bindSpecialDoor_doAction();
            }
            return false;
        }
        // if (e.buttons == 2) { // 挪到onup
        //     editor.uifunctions.showMidMenu(e.clientX, e.clientY);
        //     return false;
        // }
        if (!selectBox.isSelected()) {
            editor_mode.onmode('nextChange');
            editor_mode.onmode('loc');
            //editor_mode.loc();
            editor.uifunctions.showTips(6);
            editor.uivalues.startPos = pos;
            editor.dom.euiCtx.strokeStyle = '#FF0000';
            editor.dom.euiCtx.lineWidth = 3;
            if (editor.isMobile) editor.uifunctions.showMidMenu(e.clientX, e.clientY);
            return false;
        }

        editor.uivalues.holdingPath = 1;
        editor.uivalues.mouseOutCheck = 2;
        setTimeout(editor.uifunctions.clearMapStepStatus);
        editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        editor.uivalues.stepPostfix = [];
        editor.uivalues.stepPostfix.push(pos);
        if (editor.brushMod == 'line') editor.uifunctions.fillPos(pos);
        return false;
    }

    /**
     * editor.dom.eui.onmousemove
     * + 非绘图模式时维护起止位置并画箭头
     * + 绘图模式时找到与队列尾相邻的鼠标方向的点画个矩形
     */
    editor.uifunctions.map_onmove = function (e) {
        editor.uivalues.lastMoveE=e;
        if (!selectBox.isSelected()) {
            if (editor.uivalues.startPos == null) return;
            var loc = editor.uifunctions.eToLoc(e);
            var pos = editor.uifunctions.locToPos(loc, true);
            if (editor.uivalues.endPos != null && editor.uivalues.endPos.x == pos.x && editor.uivalues.endPos.y == pos.y) return;
            if (editor.uivalues.endPos != null) {
                editor.dom.euiCtx.clearRect(Math.min(32 * editor.uivalues.startPos.x - core.bigmap.offsetX, 32 * editor.uivalues.endPos.x - core.bigmap.offsetX),
                    Math.min(32 * editor.uivalues.startPos.y - core.bigmap.offsetY, 32 * editor.uivalues.endPos.y - core.bigmap.offsetY),
                    (Math.abs(editor.uivalues.startPos.x - editor.uivalues.endPos.x) + 1) * 32, (Math.abs(editor.uivalues.startPos.y - editor.uivalues.endPos.y) + 1) * 32)
            }
            editor.uivalues.endPos = pos;
            if (editor.uivalues.startPos != null) {
                if (editor.uivalues.startPos.x != editor.uivalues.endPos.x || editor.uivalues.startPos.y != editor.uivalues.endPos.y) {
                    if (e.buttons == 2) {
                        // 右键拖拽: 画选的区域
                        var x0 = editor.uivalues.startPos.x;
                        var y0 = editor.uivalues.startPos.y;
                        var x1 = editor.uivalues.endPos.x;
                        var y1 = editor.uivalues.endPos.y;
                        if (x0 > x1) { x0 ^= x1; x1 ^= x0; x0 ^= x1; }//swap
                        if (y0 > y1) { y0 ^= y1; y1 ^= y0; y0 ^= y1; }//swap
                        // draw rect
                        editor.dom.euiCtx.clearRect(0, 0, editor.dom.euiCtx.canvas.width, editor.dom.euiCtx.canvas.height);
                        editor.dom.euiCtx.fillStyle = 'rgba(0, 127, 255, 0.4)';
                        editor.dom.euiCtx.fillRect(32 * x0 - core.bigmap.offsetX, 32 * y0 - core.bigmap.offsetY,
                            32 * (x1 - x0) + 32, 32 * (y1 - y0) + 32);
                    }else{
                        // 左键拖拽: 画箭头
                        core.drawArrow('eui',
                            32 * editor.uivalues.startPos.x + 16 - core.bigmap.offsetX, 32 * editor.uivalues.startPos.y + 16 - core.bigmap.offsetY,
                            32 * editor.uivalues.endPos.x + 16 - core.bigmap.offsetX, 32 * editor.uivalues.endPos.y + 16 - core.bigmap.offsetY);
                    }
                }
            }
            // editor_mode.onmode('nextChange');
            // editor_mode.onmode('loc');
            //editor_mode.loc();
            return false;
        }

        if (editor.uivalues.holdingPath == 0) {
            return false;
        }
        editor.uivalues.mouseOutCheck = 2;
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc, true);
        var pos0 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1]
        var directionDistance = [pos.y - pos0.y, pos0.x - pos.x, pos0.y - pos.y, pos.x - pos0.x]
        var max = 0, index = 4;
        for (var i = 0; i < 4; i++) {
            if (directionDistance[i] > max) {
                index = i;
                max = directionDistance[i];
            }
        }
        var pos = [{ 'x': 0, 'y': 1 }, { 'x': -1, 'y': 0 }, { 'x': 0, 'y': -1 }, { 'x': 1, 'y': 0 }, false][index]
        if (pos) {
            pos.x += pos0.x;
            pos.y += pos0.y;
            if (editor.brushMod == 'line') editor.uifunctions.fillPos(pos);
            else {
                var x0 = editor.uivalues.stepPostfix[0].x;
                var y0 = editor.uivalues.stepPostfix[0].y;
                var x1 = pos.x;
                var y1 = pos.y;
                if (x0 > x1) { x0 ^= x1; x1 ^= x0; x0 ^= x1; }//swap
                if (y0 > y1) { y0 ^= y1; y1 ^= y0; y0 ^= y1; }//swap
                // draw rect
                editor.dom.euiCtx.clearRect(0, 0, editor.dom.euiCtx.canvas.width, editor.dom.euiCtx.canvas.height);
                editor.dom.euiCtx.fillStyle = 'rgba(0, 127, 255, 0.4)';
                editor.dom.euiCtx.fillRect(32 * x0 - core.bigmap.offsetX, 32 * y0 - core.bigmap.offsetY,
                    32 * (x1 - x0) + 32, 32 * (y1 - y0) + 32);
            }
            editor.uivalues.stepPostfix.push(pos);
        }
        return false;
    }

    /**
     * editor.dom.eui.onmouseup
     * + 非绘图模式时, 交换首末点的内容
     * + 绘图模式时, 根据画线/画矩形/画tileset 做对应的绘制
     */
    editor.uifunctions.map_onup = function (ee) {
        editor.uivalues.selectedArea = null;
        ee.preventDefault();
        ee.stopPropagation();
        var e=editor.uivalues.lastMoveE;
        if (e.buttons == 2 && (editor.uivalues.endPos==null || (editor.uivalues.startPos.x == editor.uivalues.endPos.x && editor.uivalues.startPos.y == editor.uivalues.endPos.y))) {
            editor.uifunctions.showMidMenu(e.clientX, e.clientY);
            editor.uivalues.holdingPath = 0;
            editor.uivalues.stepPostfix = [];
            editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
            editor.uivalues.startPos = editor.uivalues.endPos = null;
            return false;
        }
        if (!selectBox.isSelected()) {
            if (e.buttons == 2) {
                // 右键拖拽: 选中区域
                printf('已经选中该区域')
                editor.uivalues.selectedArea = Object.assign({}, editor.uivalues.startPos, {x1: editor.uivalues.endPos.x, y1: editor.uivalues.endPos.y});
                // 后续的处理
            } else {
                // 左键拖拽: 交换
                // editor.movePos(editor.uivalues.startPos, editor.uivalues.endPos);
                editor.exchangePos(editor.uivalues.startPos, editor.uivalues.endPos);
                editor.uifunctions.unhighlightSaveFloorButton();
                editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
            }
            editor.uivalues.startPos = editor.uivalues.endPos = null;
            return false;
        }
        editor.uivalues.holdingPath = 0;
        if (editor.uivalues.stepPostfix && editor.uivalues.stepPostfix.length) {
            editor.savePreMap();
            if (editor.brushMod !== 'line') {
                var x0 = editor.uivalues.stepPostfix[0].x;
                var y0 = editor.uivalues.stepPostfix[0].y;
                var x1 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1].x;
                var y1 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1].y;
                if (x0 > x1) { x0 ^= x1; x1 ^= x0; x0 ^= x1; }//swap
                if (y0 > y1) { y0 ^= y1; y1 ^= y0; y0 ^= y1; }//swap
                editor.uivalues.stepPostfix = [];
                for (var jj = y0; jj <= y1; jj++) {
                    for (var ii = x0; ii <= x1; ii++) {
                        editor.uivalues.stepPostfix.push({ x: ii, y: jj })
                    }
                }
            }
            var useBrushMode = editor.brushMod == 'tileset';
            if (editor.uivalues.stepPostfix.length == 1 && (editor.uivalues.tileSize[0] > 1 || editor.uivalues.tileSize[1] > 1)) {
                useBrushMode = true;
                var x0 = editor.uivalues.stepPostfix[0].x;
                var y0 = editor.uivalues.stepPostfix[0].y;
                editor.uivalues.stepPostfix = [];
                for (var jj = y0; jj < y0 + editor.uivalues.tileSize[1]; ++jj) {
                    for (var ii = x0; ii < x0 + editor.uivalues.tileSize[0]; ++ii) {
                        if (jj >= editor[editor.layerMod].length || ii >= editor[editor.layerMod][0].length) continue;
                        editor.uivalues.stepPostfix.push({ x: ii, y: jj });
                    }
                }
            }
            if (useBrushMode && core.tilesets.indexOf(editor.info.images) !== -1) {
                var imgWidth = ~~(core.material.images.tilesets[editor.info.images].width / 32);
                var x0 = editor.uivalues.stepPostfix[0].x;
                var y0 = editor.uivalues.stepPostfix[0].y;
                var idnum = editor.info.idnum;
                var pmod=function(a,b){return (a%b+b)%b;}
                for (var ii = 0; ii < editor.uivalues.stepPostfix.length; ii++) {
                    var dx=pmod(editor.uivalues.stepPostfix[ii].x-x0,editor.uivalues.tileSize[0]);
                    var dy=pmod(editor.uivalues.stepPostfix[ii].y-y0,editor.uivalues.tileSize[1]);
                    editor[editor.layerMod][editor.uivalues.stepPostfix[ii].y][editor.uivalues.stepPostfix[ii].x] = editor.ids[editor.indexs[idnum + dx+dy*imgWidth]];
                }
            } else {
                // 检测是否是填充模式
                if (editor.uivalues.stepPostfix.length == 1 && editor.brushMod == 'fill') {
                    editor.uivalues.stepPostfix = editor.uifunctions._fillMode_bfs(editor[editor.layerMod], editor.uivalues.stepPostfix[0].x, editor.uivalues.stepPostfix[0].y,
                        editor[editor.layerMod][0].length, editor[editor.layerMod].length);
                } 
                for (var ii = 0; ii < editor.uivalues.stepPostfix.length; ii++) {
                    var currx = editor.uivalues.stepPostfix[ii].x, curry = editor.uivalues.stepPostfix[ii].y;
                    editor[editor.layerMod][curry][currx] = editor.info;
                    // 检查上下楼梯绑定
                    if (editor.layerMod == 'map' && editor.info && editor.info.id == 'upFloor') {
                        editor.currentFloorData.changeFloor[currx+","+curry] = { "floorId": ":next", "stair": "downFloor" };
                        editor.drawEventBlock();
                    }
                    if (editor.layerMod == 'map' && editor.info && editor.info.id == 'downFloor') {
                        editor.currentFloorData.changeFloor[currx+","+curry] = { "floorId": ":before", "stair": "upFloor" };
                        editor.drawEventBlock();
                    }
                }
                    
            }
            // console.log(editor.map);
            if (editor.info.y != null) {
                var found = false;
                editor.uivalues.lastUsed.forEach(function (one) {
                    if (one.id == editor.info.id) {
                        found = true;
                        one.recent = new Date().getTime();
                        one.frequent = (one.frequent || 0) + 1;
                    }
                })
                if (!found) {
                    editor.uivalues.lastUsed.push(Object.assign({}, editor.info, {recent: new Date().getTime(), frequent: 1}));
                }
                editor.config.set("lastUsed", editor.uivalues.lastUsed);
            }
            editor.updateMap();
            editor.uivalues.holdingPath = 0;
            editor.uivalues.stepPostfix = [];
            editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
            editor.uifunctions.highlightSaveFloorButton();
        }
        return false;
    }

    /**
     * bfs找寻和某点相连的全部相同图块坐标
     */
    editor.uifunctions._fillMode_bfs = function (array, x, y, maxWidth, maxHeight) {
        var _getNumber = function (x, y) {
            if (x<0 || y<0 || x>=maxWidth || y>=maxHeight) return null;
            return array[y][x].idnum || array[y][x] || 0;
        }
        var number = _getNumber(x, y) || 0;
        var visited = {}, result = [];
        var list = [{x:x, y:y}];
        while (list.length != 0) {
            var next = list.shift(), key = next.x+","+next.y;
            if (visited[key]) continue;
            visited[key] = true;
            result.push(next);
            [[-1,0],[1,0],[0,-1],[0,1]].forEach(function (dir) {
                var nx = next.x + dir[0], ny = next.y + dir[1];
                if (_getNumber(nx, ny) == number) {
                    list.push({x: nx, y: ny});
                }
            });
        }
        return result;
    }

    /**
     * editor.dom.mid.onmousewheel
     * 在地图编辑区域滚轮切换楼层
     */
    editor.uifunctions.map_mousewheel = function (e) {
        var wheel = function (direct) {
            var index = editor.core.floorIds.indexOf(editor.currentFloorId);
            var toId = editor.currentFloorId;

            if (direct > 0 && index < editor.core.floorIds.length - 1)
                toId = editor.core.floorIds[index + 1];
            else if (direct < 0 && index > 0)
                toId = editor.core.floorIds[index - 1];
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

    /**
     * 显示右键菜单
     */
    editor.uifunctions.showMidMenu = function (x, y) {
        // --- copy
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // 检测是否是上下楼
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        var extraEvent = editor.dom.extraEvent, parent = extraEvent.parentElement;
        if (thisevent == 0) {
            parent.removeChild(extraEvent);
            parent.appendChild(extraEvent);
            editor.dom.extraEvent.style.display = 'block';
            editor.dom.extraEvent.children[0].innerHTML = '绑定出生点为此点';
        } else if (thisevent.id == 'upFloor') {
            parent.removeChild(extraEvent);
            parent.insertBefore(extraEvent, parent.firstChild);
            editor.dom.extraEvent.style.display = 'block';
            editor.dom.extraEvent.children[0].innerHTML = '绑定上楼事件';
        }
        else if (thisevent.id == 'downFloor') {
            parent.removeChild(extraEvent);
            parent.insertBefore(extraEvent, parent.firstChild);
            editor.dom.extraEvent.style.display = 'block';
            editor.dom.extraEvent.children[0].innerHTML = '绑定下楼事件';
        }
        else if (['leftPortal', 'rightPortal', 'downPortal', 'upPortal'].indexOf(thisevent.id) >= 0) {
            parent.removeChild(extraEvent);
            parent.insertBefore(extraEvent, parent.firstChild);
            editor.dom.extraEvent.style.display = 'block';
            editor.dom.extraEvent.children[0].innerHTML = '绑定楼传事件';
        }
        else if (thisevent.id == 'specialDoor') {
            parent.removeChild(extraEvent);
            parent.insertBefore(extraEvent, parent.firstChild);
            editor.dom.extraEvent.style.display = 'block';
            editor.dom.extraEvent.children[0].innerHTML = '绑定机关门事件';
        } 
        else editor.dom.extraEvent.style.display = 'none';

        editor.dom.chooseThis.children[0].innerHTML = '选中此点' + '(' + editor.pos.x + ',' + editor.pos.y + ')'
        editor.dom.copyLoc.children[0].innerHTML = '复制此事件';
        editor.dom.pasteLoc.children[0].innerHTML = '粘贴到此事件';
        editor.dom.midMenu.style = 'top:' + (y + scrollTop) + 'px;left:' + (x + scrollLeft) + 'px;';
    }

    /**
     * 隐藏右键菜单
     */
    editor.uifunctions.hideMidMenu = function () {
        editor.uivalues.lastMoveE={buttons:0,clientX:0,clientY:0};
        setTimeout(function () {
            editor.dom.midMenu.style = 'display:none';
        }, 100)
    }

    /**
     * editor.dom.extraEvent.onmousedown
     * 菜单 附加点操作
     */
    editor.uifunctions.extraEvent_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();

        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        return editor.uifunctions._extraEvent_bindStartPoint(thisevent)
            || editor.uifunctions._extraEvent_bindStair(thisevent)
            || editor.uifunctions._extraEvent_bindSpecialDoor(thisevent);
    }

    /**
     * 绑定该空地点为起始点
     */
    editor.uifunctions._extraEvent_bindStartPoint = function (thisevent) {
        if (thisevent != 0) return false;
        editor.mode.onmode('tower');
        editor.mode.addAction(["change", "['firstData']['floorId']", editor.currentFloorId]);
        editor.mode.addAction(["change", "['firstData']['hero']['loc']['x']", editor.pos.x]);
        editor.mode.addAction(["change", "['firstData']['hero']['loc']['y']", editor.pos.y]);
        editor.mode.onmode('save', function () {
            core.firstData.floorId = editor.currentFloorId;
            core.firstData.hero.loc.x = editor.pos.x;
            core.firstData.hero.loc.y = editor.pos.y;
            editor.drawPosSelection();
            editor.drawEventBlock();
            editor.mode.tower();
            printf('绑定初始点成功');
        });
    }

    /**
     * 绑定该楼梯的楼传事件
     */
    editor.uifunctions._extraEvent_bindStair = function (thisevent) {
        if (['upFloor', 'downFloor', 'leftPortal', 'rightPortal', 'upPortal', 'downPortal'].indexOf(thisevent.id) < 0)
            return false;
        var loc = editor.pos.x + "," + editor.pos.y;
        if (thisevent.id == 'upFloor') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":next", "stair": "downFloor" };
        }
        else if (thisevent.id == 'downFloor') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":before", "stair": "upFloor" };
        }
        else if (thisevent.id == 'leftPortal' || thisevent.id == 'rightPortal') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":next", "stair": ":symmetry_x" }
        }
        else if (thisevent.id == 'upPortal' || thisevent.id == 'downPortal') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":next", "stair": ":symmetry_y" }
        }
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw (err)
            }
            editor.drawPosSelection();
            editor.drawEventBlock();
            editor_mode.showMode('loc');
            printf('添加楼梯事件成功');
            editor.uifunctions.unhighlightSaveFloorButton();
        });
        return true;
    }

    /**
     * 绑定该机关门的事件
     */
    editor.uifunctions._extraEvent_bindSpecialDoor = function (thisevent) {
        if (thisevent.id != 'specialDoor') return false;
        var number = parseInt(prompt("请输入该机关门的怪物数量", "0"))|| 0;
        if (number <= 0) return true;
        editor.uivalues.bindSpecialDoor.n = number;
        editor.uivalues.bindSpecialDoor.loc = editor.pos.x + ',' + editor.pos.y;
        editor.uivalues.bindSpecialDoor.enemys = [];
        printf("请点击选择" + number + "个怪物；切换楼层或刷新页面取消操作。");
    }

    /**
     * 确定绑定该机关门的事件
     * cancel：是否取消此模式
     */
    editor.uifunctions._extraEvent_bindSpecialDoor_doAction = function (cancel) {
        var bindSpecialDoor = editor.uivalues.bindSpecialDoor;
        if (cancel) {
            bindSpecialDoor.loc = null;
            bindSpecialDoor.enemys = [];
            bindSpecialDoor.n = 0;
            editor.drawEventBlock();
            printf("");
            return;
        }
        if (bindSpecialDoor.loc == null || bindSpecialDoor.enemys.length != bindSpecialDoor.n) return;
        // 添加机关门自动事件
        var doorFlag = "flag:door_" + editor.currentFloorId + "_" + bindSpecialDoor.loc.replace(',', '_');
        editor.currentFloorData.autoEvent[bindSpecialDoor.loc] = {
            '0': {
                "condition": doorFlag + "==" + bindSpecialDoor.n,
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {"type": "openDoor"}
                ]
            }
        };
        bindSpecialDoor.enemys.forEach(function (loc) {
            editor.currentFloorData.afterBattle[loc] = [
                {"type": "setValue", "name": doorFlag, "operator": "+=", "value": "1"}
            ]
        });
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw (err)
            }
            editor.drawEventBlock();
            editor.drawPosSelection();
            editor_mode.showMode('loc');
            printf('绑定机关门事件成功');
            editor.uifunctions.unhighlightSaveFloorButton();
        });
        bindSpecialDoor.loc = null;
        bindSpecialDoor.enemys = [];
        bindSpecialDoor.n = 0;
    }

    /**
     * editor.dom.chooseThis.onmousedown
     * 菜单 选中此点
     */
    editor.uifunctions.chooseThis_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        selectBox.isSelected(false);

        editor_mode.onmode('nextChange');
        editor_mode.onmode('loc');
        //editor_mode.loc();
        if (editor.isMobile) editor.showdataarea(false);
        return false;
    }

    /**
     * editor.dom.chooseInRight.onmousedown
     * 菜单 在素材区选中此图块
     */
    editor.uifunctions.chooseInRight_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        var thisevent = editor[editor.layerMod][editor.pos.y][editor.pos.x];
        editor.setSelectBoxFromInfo(thisevent, true);
        return false;
    }

    /**
     * editor.dom.copyLoc.onmousedown
     * 菜单 复制此事件
     */
    editor.uifunctions.copyLoc_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        editor_mode.onmode('');
        editor.uivalues.copyedInfo = editor.copyFromPos();
        printf('该点事件已复制');
        return false;
    }

    /**
     * editor.dom.pasteLoc.onmousedown
     * 菜单 移动此事件
     */
    editor.uifunctions.pasteLoc_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        if (!editor.uivalues.copyedInfo) {
            printe("没有复制的事件");
            return false;
        }
        editor.savePreMap();
        editor_mode.onmode('');
        editor.pasteToPos(editor.uivalues.copyedInfo);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw (err)
            }
            ; printf('粘贴到事件成功');
            editor.uifunctions.unhighlightSaveFloorButton();
            editor.drawPosSelection();
        });
        return false;
    }

    /**
     * editor.dom.clearEvent.onmousedown
     * 菜单 仅清空此点事件
     */
    editor.uifunctions.clearEvent_click = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        editor.clearPos(false);
        editor.uifunctions.unhighlightSaveFloorButton();
        return false;
    }

    /**
     * editor.dom.clearLoc.onmousedown
     * 菜单 清空此点及事件
     */
    editor.uifunctions.clearLoc_click = function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        editor.clearPos(true);
        editor.uifunctions.unhighlightSaveFloorButton();
        return false;
    }

    /**
     * editor.dom.lockMode.onchange
     * 点击【】
     */
    editor.uifunctions.lockMode_onchange = function () {
        printf('锁定模式开启下将不再点击空白处自动保存，请谨慎操作。');
        editor.uivalues.lockMode = editor.dom.lockMode.checked;
    }

    /**
     * editor.dom.brushMod.onchange
     * 切换画笔模式
     */
    editor.uifunctions.brushMod_onchange = function () {
        editor.brushMod = editor.dom.brushMod.value;
        if (editor.brushMod == 'fill') {
            printf('填充模式下，将会用选中的素材替换所有和目标点联通的相同素材');
        }
    }

    /**
     * editor.dom.brushMod2.onchange
     * 切换画笔模式
     */
    editor.uifunctions.brushMod2_onchange = function () {
        editor.brushMod = editor.dom.brushMod2.value;
    }

    /**
     * editor.dom.brushMod3.onchange
     * 切换画笔模式
     */
    editor.uifunctions.brushMod3_onchange = function () {
        if (!editor.config.get('alertTileModeV2.7') &&
            !confirm("从V2.7开始，请直接素材区拖框进行绘制区域。\n\n点取消将不再显示此提示。")) {
            editor.config.set('alertTileModeV2.7', true);
        }
        printf('tileset平铺模式下可以按选中tileset素材，并在地图上拖动来一次绘制一个区域');
        editor.brushMod = editor.dom.brushMod3.value;
    }

    editor.uifunctions.brushMod4_onchange = function () {
        printf('填充模式下，将会用选中的素材替换所有和目标点联通的相同素材');
        editor.brushMod = editor.dom.brushMod4.value;
    }

    /**
     * editor.dom.layerMod.onchange
     * 切换编辑的层
     */
    editor.uifunctions.layerMod_onchange = function () {
        editor.layerMod = editor.dom.layerMod.value;
        [editor.dom.bgc, editor.dom.fgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
            x.style.opacity = 1;
        });

        // 手机端....
        if (editor.isMobile) {
            if (editor.dom.layerMod.value == 'bgmap') {
                [editor.dom.fgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
            if (editor.dom.layerMod.value == 'fgmap') {
                [editor.dom.bgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
        }
    }

    /**
     * editor.dom.layerMod2.onchange
     * 切换编辑的层
     */
    editor.uifunctions.layerMod2_onchange = function () {
        editor.layerMod = editor.dom.layerMod2.value;
        [editor.dom.fgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        editor.dom.bgc.style.opacity = 1;
    }

    /**
     * editor.dom.layerMod3.onchange
     * 切换编辑的层
     */
    editor.uifunctions.layerMod3_onchange = function () {
        editor.layerMod = editor.dom.layerMod3.value;
        [editor.dom.bgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        editor.dom.fgc.style.opacity = 1;
    }

    /**
     * 移动大地图可视窗口的绑定
     */
    editor.uifunctions.viewportButtons_func = function () {
        var pressTimer = null;
        for (var ii = 0, node; node = editor.dom.viewportButtons.children[ii]; ii++) {
            (function (x, y) {
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
            })([-1, 0, 0, 1][ii], [0, -1, 1, 0][ii]);
        }
    }

    editor.uifunctions.selectFloor_func = function () {
        var selectFloor = document.getElementById('selectFloor');
        editor.game.getFloorFileList(function (floors) {
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
    }

    editor.uifunctions.highlightSaveFloorButton=function(){
        var saveFloor = document.getElementById('saveFloor');
        saveFloor.style.background='#ffd700';
    }

    editor.uifunctions.unhighlightSaveFloorButton=function(){
        var saveFloor = document.getElementById('saveFloor');
        saveFloor.style.background='';
    }

    editor.uifunctions.saveFloor_func = function () {
        var saveFloor = document.getElementById('saveFloor');
        editor_mode.saveFloor = function () {
            editor_mode.onmode('');
            editor.file.saveFloorFile(function (err) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                ; printf('保存成功');
                editor.uifunctions.unhighlightSaveFloorButton()
            });
        }
        saveFloor.onclick = editor_mode.saveFloor;
    }

    editor.uifunctions.lastUsed_click = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (editor.isMobile) return false;

        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var px = scrollLeft + e.clientX - editor.dom.mid2.offsetLeft - editor.dom.lastUsedDiv.offsetLeft,
            py = scrollTop + e.clientY - editor.dom.mid2.offsetTop - editor.dom.lastUsedDiv.offsetTop;
        var x = parseInt(px / 32), y = parseInt(py / 32);
        var index = x + core.__SIZE__ * y;
        if (index >= editor.uivalues.lastUsed.length) return;
        var lastUsed = editor.uivalues.lastUsed.sort(function (a, b) {
            if ((a.istop || 0) != (b.istop || 0)) return (b.istop || 0) - (a.istop || 0);
            return (b[editor.uivalues.lastUsedType] || 0) - (a[editor.uivalues.lastUsedType] || 0);
        });

        if (e.button == 2) {
            lastUsed[index].istop = lastUsed[index].istop ? 0 : 1;
            printf("已"+(lastUsed[index].istop ? '置顶' : '取消置顶')+"该图块");
            editor.config.set('lastUsed', editor.uivalues.lastUsed);
            editor.updateLastUsedMap();
            return false;
        }
        var one = Object.assign({}, lastUsed[index]);
        delete one['recent'];
        delete one['frequent'];
        delete one['istop'];
        editor.setSelectBoxFromInfo(one);
        return false;
    }

    editor.uifunctions.clearLastUsedBtn_click = function () {
        if (editor.isMobile) return;
 
        if (confirm("你确定要清理全部最近使用图块么？\n所有最近使用和最常使用图块（含置顶图块）都将被清除；此过程不可逆！")) {
            editor.uivalues.lastUsed = [];
            editor.config.set('lastUsed', []);
            editor.updateLastUsedMap();
        }
    }

    /////////////////////////////////////////////////////////////////////////////


    editor.constructor.prototype.copyFromPos = function (pos) {
        var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);
        pos = pos || editor.pos;
        var x0 = pos.x, y0 = pos.y, x1 = pos.x1, y1 = pos.y1;
        if (x1 == null) x1 = x0;
        if (y1 == null) y1 = y0;
        if (x0 > x1) { x0 ^= x1; x1 ^= x0; x0 ^= x1; }//swap
        if (y0 > y1) { y0 ^= y1; y1 ^= y0; y0 ^= y1; }//swap
        var result = {w: x1 - x0 + 1, h: y1 - y0 + 1, layer: editor.layerMod, data: []};
        for (var i = x0; i <= x1; ++i) {
            for (var j = y0; j<= y1; ++j) {
                var map = core.clone(editor[editor.layerMod][j][i]);
                var events = {};
                fields.forEach(function(v){
                    events[v] = core.clone(editor.currentFloorData[v][i+','+j]);
                })
                result.data.push({map: map, events: events});
            }
        }
        return result;
    }
    
    editor.constructor.prototype.pasteToPos = function (info, pos) {
        if (info == null) return;
        var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);
        pos = pos || editor.pos;
        var w = info.w || 1, h = info.h || 1, layer = info.layer || 'map';
        var data = core.clone(info.data || []);
        for (var i = pos.x; i < pos.x+w; ++i) {
            for (var j = pos.y; j < pos.y+h; ++j) {
                var one = data.shift();
                if (j >= editor[editor.layerMod].length || i >= editor[editor.layerMod][0].length) continue;
                editor[editor.layerMod][j][i] = core.clone(one.map);
                if (layer == 'map' && editor.layerMod == 'map') {
                    fields.forEach(function(v){
                        if (one.events[v] == null) delete editor.currentFloorData[v][i+","+j];
                        else editor.currentFloorData[v][i+","+j] = core.clone(one.events[v]);
                    });
                }
            }
        }
    }
    
    editor.constructor.prototype.movePos = function (startPos, endPos, callback) {
        if (!startPos || !endPos) return;
        if (startPos.x == endPos.x && startPos.y == endPos.y) return;
        var copyed = editor.copyFromPos(startPos);
        editor.pasteToPos({w: 1, h: 1, layer: 'map', data: [{map:0, events: {}}]}, startPos);
        editor.pasteToPos(copyed, endPos);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('移动事件成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }
    
    editor.constructor.prototype.exchangePos = function (startPos, endPos, callback) {
        if (!startPos || !endPos) return;
        if (startPos.x == endPos.x && startPos.y == endPos.y) return;
        var startInfo = editor.copyFromPos(startPos);
        var endInfo = editor.copyFromPos(endPos);
        editor.pasteToPos(startInfo, endPos);
        editor.pasteToPos(endInfo, startPos);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('交换事件成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }

    editor.constructor.prototype.savePreMap = function () {
        var dt = {
            map: editor.map,
            fgmap: editor.fgmap,
            bgmap: editor.bgmap,
        };
        if (editor.uivalues.preMapData.length == 0
            || !core.same(editor.uivalues.preMapData[editor.uivalues.preMapData.length - 1], dt)) {
            editor.uivalues.preMapData.push(core.clone(dt));
            if (editor.uivalues.preMapData.length > editor.uivalues.preMapMax) {
                editor.uivalues.preMapData.shift();
            }
        }
    }
    
    editor.constructor.prototype.clearPos = function (clearPos, pos, callback) {
        var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);
        pos = pos || editor.pos;
        var x0 = pos.x, y0 = pos.y, x1 = pos.x1, y1 = pos.y1;
        if (x1 == null) x1 = x0;
        if (y1 == null) y1 = y0;
        if (x0 > x1) { x0 ^= x1; x1 ^= x0; x0 ^= x1; }//swap
        if (y0 > y1) { y0 ^= y1; y1 ^= y0; y0 ^= y1; }//swap
        editor.uifunctions.hideMidMenu();
        editor.savePreMap();
        editor.info = 0;
        editor_mode.onmode('');
        for (var i = x0; i <= x1; ++i) {
            for (var j = y0; j <= y1; ++j) {
                if (j >= editor[editor.layerMod].length || i >= editor[editor.layerMod][0].length) continue;
                if (clearPos)
                    editor[editor.layerMod][j][i] = 0;
                if (editor.layerMod == 'map') {
                    fields.forEach(function(v){
                        delete editor.currentFloorData[v][i+","+j];
                    });
                }
            }
        }
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf(clearPos?'清空该点和事件成功':'只清空该点事件成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }















}