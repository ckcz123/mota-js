editor_materialpanel_wrapper = function (editor) {

    // 由于历史遗留原因, 以下变量作为全局变量使用
    // selectBox

    window.selectBox=document.getElementById('selectBox')
    selectBox._isSelected=false
    selectBox.isSelected=function(value){
        if(value!=null){
            selectBox._isSelected=value;
            editor.dom.dataSelection.style.display=value?'':'none'
        }
        return selectBox._isSelected
    }

    var locToPos = function (loc) {
        return { 'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.size) };
    }

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

    /**
     * editor.dom.iconExpandBtn.onclick
     */
    editor.uifunctions.fold_material_click = function () {
        if (editor.uivalues.folded) {
            if (confirm("你想要展开素材吗？\n展开模式下将显示全素材内容。")) {
                editor.config.set('folded', false, function() {
                    window.location.reload();
                });
            }
        } else {
            var perCol = parseInt(prompt("请输入折叠素材模式下每列的个数：", "50")) || 0;
            if (perCol > 0) {
                editor.config.set('foldPerCol', perCol, false);
                editor.config.set('folded', true, function() {
                    window.location.reload();
                });
            }
        }
    }

    /**
     * editor.dom.iconLib.onmousedown
     * 素材区的单击/拖拽事件
     */
    editor.uifunctions.material_ondown = function (e) {
        e.stopPropagation();
        e.preventDefault();
        editor.uivalues.lastMoveMaterE=e;
        if (!editor.isMobile && e.clientY >= editor.dom.iconLib.offsetHeight - editor.uivalues.scrollBarHeight) return;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        editor.uivalues.startLoc={
            'x': scrollLeft + e.clientX + editor.dom.iconLib.scrollLeft - right.offsetLeft - editor.dom.iconLib.offsetLeft,
            'y': scrollTop + e.clientY + editor.dom.iconLib.scrollTop - right.offsetTop - editor.dom.iconLib.offsetTop,
            'px': e.clientX,
            'py': e.clientY,
            'size': 32
        };
    }
    
    /**
     * editor.dom.iconLib.onmousemove
     * 素材区的单击/拖拽事件
     */
    editor.uifunctions.material_onmove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        editor.uivalues.lastMoveMaterE=e;
        if (!editor.uivalues.startLoc) return;
        var pos0 = locToPos(editor.uivalues.startLoc);

        editor.dom.dataSelection.style.left = 32 * pos0.x + 'px';
        editor.dom.dataSelection.style.top = 32 * pos0.y + 'px';
        editor.dom.dataSelection.style.width = e.clientX - editor.uivalues.startLoc.px + 'px';
        editor.dom.dataSelection.style.height = e.clientY - editor.uivalues.startLoc.py + 'px';
        editor.dom.dataSelection.style.display = 'block';
    }

    /**
     * editor.dom.iconLib.onmouseup
     * 素材区的单击/拖拽事件
     */
    editor.uifunctions.material_onup = function (ee) {
        var startLoc = editor.uivalues.startLoc;
        editor.uivalues.startLoc = null;

        var e=editor.uivalues.lastMoveMaterE;
        if (!editor.isMobile && e.clientY >= editor.dom.iconLib.offsetHeight - editor.uivalues.scrollBarHeight) return;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var loc = {
            'x': scrollLeft + e.clientX + editor.dom.iconLib.scrollLeft - right.offsetLeft - editor.dom.iconLib.offsetLeft,
            'y': scrollTop + e.clientY + editor.dom.iconLib.scrollTop - right.offsetTop - editor.dom.iconLib.offsetTop,
            'size': 32
        };
        editor.loc = loc;
        editor.uivalues.tileSize = [1,1];
        var pos0 = locToPos(startLoc);
        var pos = locToPos(loc);
        for (var spriter in editor.widthsX) {
            if (pos.x >= editor.widthsX[spriter][1] && pos.x < editor.widthsX[spriter][2]) {
                var ysize = spriter.endsWith('48') ? 48 : 32;
                loc.ysize = ysize;
                pos.images = editor.widthsX[spriter][0];
                pos.y = ~~(loc.y / loc.ysize);
                if (!editor.uivalues.folded && core.tilesets.indexOf(pos.images) == -1) pos.x = editor.widthsX[spriter][1];
                var autotiles = core.material.images['autotile'];
                if (pos.images == 'autotile') {
                    var imNames = Object.keys(autotiles);
                    if (editor.uivalues.folded) {
                        pos.y = Math.min(pos.y, imNames.length - 1);
                        pos.images = imNames[pos.y];
                    } else {
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
                }
                else {
                    var height = editor.widthsX[spriter][3], col = height / ysize;
                    if (spriter == 'terrains') col += 2;
                    if (editor.uivalues.folded && core.tilesets.indexOf(pos.images) == -1) {
                        col = (pos.x == editor.widthsX[spriter][2] - 1) ? ((col - 1) % editor.uivalues.foldPerCol + 1) : editor.uivalues.foldPerCol;
                    }
                    pos.y = Math.min(pos.y, col - 1);
                }

                selectBox.isSelected(true);
                // console.log(pos,core.material.images[pos.images].height)
                editor.dom.dataSelection.style.left = pos.x * 32 + 'px';
                editor.dom.dataSelection.style.top = pos.y * ysize + 'px';
                editor.dom.dataSelection.style.height = ysize - 6 + 'px';
                editor.dom.dataSelection.style.width = 32 - 6 + 'px';

                if (pos.x == 0 && pos.y == 0) {
                    // editor.info={idnum:0, id:'empty','images':'清除块', 'y':0};
                    editor.info = 0;
                } else if (pos.x == 0 && pos.y == 1) {
                    editor.info = editor.ids[editor.indexs[17]];
                } else {
                    if (autotiles[pos.images]) editor.info = { 'images': pos.images, 'y': 0 };
                    else if (core.tilesets.indexOf(pos.images) != -1) editor.info = { 'images': pos.images, 'y': pos.y, 'x': pos.x - editor.widthsX[spriter][1] };
                    else {
                        var y = pos.y;
                        if (editor.uivalues.folded) {
                            y += editor.uivalues.foldPerCol * (pos.x - editor.widthsX[spriter][1]);
                        }
                        if (pos.images == 'terrains') y -= 2;
                        editor.info = { 'images': pos.images, 'y': y }
                    }

                    for (var idindex = 0; idindex < editor.ids.length; idindex++) {
                        if ((core.tilesets.indexOf(pos.images) != -1 && editor.info.images == editor.ids[idindex].images
                            && editor.info.y == editor.ids[idindex].y && editor.info.x == editor.ids[idindex].x)
                            || (Object.prototype.hasOwnProperty.call(autotiles, pos.images) && editor.info.images == editor.ids[idindex].id
                                && editor.info.y == editor.ids[idindex].y)
                            || (core.tilesets.indexOf(pos.images) == -1 && editor.info.images == editor.ids[idindex].images
                                && editor.info.y == editor.ids[idindex].y)
                        ) {

                            editor.info = editor.ids[idindex];
                            break;
                        }
                    }

                    if (editor.info.isTile && (editor.isMobile || e.button == 2)) { //这段改一改之类的应该能给手机用,就不删了
                        var v = prompt("请输入该额外素材区域绑定宽高，以逗号分隔", "1,1");
                        if (v != null && /^\d+,\d+$/.test(v)) {
                            v = v.split(",");
                            var x = parseInt(v[0]), y = parseInt(v[1]);
                            var widthX = editor.widthsX[editor.info.images];
                            if (x <= 0 || y <= 0 || editor.info.x + x > widthX[2] - widthX[1] || 32*(editor.info.y + y) > widthX[3]) {
                                alert("不合法的输入范围，已经越界");
                            } else {
                                editor.uivalues.tileSize = [x, y];
                                editor.dom.dataSelection.style.left = pos.x * 32 + 'px';
                                editor.dom.dataSelection.style.top = pos.y * ysize + 'px';
                                editor.dom.dataSelection.style.height = ysize*y - 6 + 'px';
                                editor.dom.dataSelection.style.width = 32*x - 6 + 'px';
                            }
                        }
                    }
                    if (editor.info.isTile && !editor.isMobile && e.button != 2) { //左键拖拽框选

                        var x = pos.x-pos0.x+1, y = pos.y-pos0.y+1;
                        var widthX = editor.widthsX[editor.info.images];
                        // 懒得仔细处理了, 只允许左上往右下拉
                        if (x <= 0 || y <= 0 || pos0.x < widthX[1]){
                            
                        } else {
                            editor.info = editor.ids[idindex-(x-1)-(y-1)*(widthX[2]-widthX[1])];
                            editor.uivalues.tileSize = [x, y];
                            editor.dom.dataSelection.style.left = pos0.x * 32 + 'px';
                            editor.dom.dataSelection.style.top = pos0.y * ysize + 'px';
                            editor.dom.dataSelection.style.height = ysize*y - 6 + 'px';
                            editor.dom.dataSelection.style.width = 32*x - 6 + 'px';
                        }

                    }

                }
                editor.uifunctions.showBlockInfo(JSON.parse(JSON.stringify(editor.info)));
                editor_mode.onmode('nextChange');
                editor_mode.onmode('enemyitem');
                editor.updateLastUsedMap();
                //editor_mode.enemyitem();
            }
        }
    }

}