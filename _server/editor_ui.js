editor_ui_wrapper = function (editor) {

    var tip=document.getElementById('tip');
    var print = function (msg, cls) {
        if (msg == '') {
            tip.innerHTML = '';
            return;
        }
        tip.innerHTML = '<p class="'+cls+'">' + msg + "</p>";
    }

    window.printf = function (msg) {
        selectBox.isSelected(false);
        print(msg, 'successText');
    }
    window.printe = function (msg) {
        selectBox.isSelected(false);
        print(msg, 'warnText');
    }
    window.printi = function (msg) {
        print(msg, 'infoText');
    }

    editor.uifunctions.showBlockInfo = function (value) {
        if (value == 0) {
            printi("当前选择为清除块，可擦除地图上块");
            return;
        }
        var hasId = 'id' in value;
        if (hasId && value.idnum == 17) {
            printi("当前选择为空气墙, 在编辑器中可视, 在游戏中隐藏的墙, 用来配合前景/背景的贴图");
            return;
        }
        var isAutotile = hasId && value.images == "autotile";
        tip.innerHTML = (hasId?`<p>图块编号：<span class="infoText">${ value['idnum'] }</span></p>
        <p>图块ID：<span class="infoText">${ value['id'] }</span></p>`:`
        <p class="warnText">该图块无对应的数字或ID存在，请先前往icons.js和maps.js中进行定义！</p>`)+`
        <p>图块所在素材：<span class="infoText">${ value['images'] + (isAutotile ? '( '+value['id']+' )' : '') }</span>
        </p>
        <p>图块索引：<span class="infoText">${ value['y'] }</span></p>`;
    }

    editor.uifunctions.showTips = function (value) {
        var tips = [
            '表格的文本域可以双击进行编辑',
            '双击地图可以选中素材，右键可以弹出菜单',
            '双击事件编辑器的图块可以进行长文本编辑/脚本编辑/地图选点/UI绘制预览等操作',
            'ESC或点击空白处可以自动保存当前修改',
            'H键可以打开操作帮助哦',
            'tileset平铺模式可以在地图上拖动来平铺框选的图形',
            '可以拖动地图上的图块和事件；或按Ctrl+C, Ctrl+X和Ctrl+V进行复制，剪切和粘贴，Delete删除；右键也可以拉框选择区域',
            'Alt+数字键保存图块，数字键读取保存的图块',
        ];
        if (value == null) value = Math.floor(Math.random() * tips.length);
        printf('tips: ' + tips[value])
    }

    /**
     * 根据鼠标点击, 得到从元素向上到body的所有id
     */
    editor.uifunctions.getClickpath = function (e) {
        //console.log(e);
        var clickpath = [];
        var getpath = function (e) {
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
        return clickpath;
    }

    /**
     * editor.dom.body.onmousedown
     * 检测鼠标点击, 
     * + 如果选中了绘图区域之外, 就保存地图
     * + 维护绘图区的菜单的隐藏
     * + 记录最后一次点击的id(主要为了数据区服务)
     */
    editor.uifunctions.body_click = function (e) {
        var clickpath = editor.uifunctions.getClickpath(e);

        var unselect = true;
        for (var ii = 0, thisId; thisId = ['edit', 'tip', 'brushMod', 'brushMod2', 'brushMod3', 'brushMode4', 'layerMod', 'layerMod2', 'layerMod3', 'viewportButtons'][ii]; ii++) {
            if (clickpath.indexOf(thisId) !== -1) {
                unselect = false;
                break;
            }
        }
        if (unselect && !editor.uivalues.lockMode) {
            if (clickpath.indexOf('eui') === -1 && clickpath.indexOf('lastUsed') === -1) {
                if (selectBox.isSelected()) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw (err)
                        }
                        ; printf('地图保存成功');
                        editor.uifunctions.unhighlightSaveFloorButton();
                    });
                }
                selectBox.isSelected(false);
                editor.info = {};
            }
        }
        //editor.mode.onmode('');
        if (e.button != 2 && !editor.isMobile) {
            editor.uifunctions.hideMidMenu();
        }
        if (clickpath.indexOf('down') !== -1 && editor.isMobile && clickpath.indexOf('midMenu') === -1) {
            editor.uifunctions.hideMidMenu();
        }
        if (clickpath.length >= 2 && clickpath[0].indexOf('id_') === 0) { editor.lastClickId = clickpath[0] }
    }

    /**
     * editor.dom.body.onkeydown
     * 绑定快捷键
     */
    editor.uifunctions.body_shortcut = function (e) {

        // UI预览 & 地图选点
        if (editor.uievent && editor.uievent.isOpen) {
            e.preventDefault();
            if (e.keyCode == 27) editor.uievent.close();
            else if (e.keyCode == 13) editor.uievent.confirm();
            else if (e.keyCode == 87) editor.uievent.move(0, -1)
            else if (e.keyCode == 65) editor.uievent.move(-1, 0)
            else if (e.keyCode == 83) editor.uievent.move(0, 1);
            else if (e.keyCode == 68) editor.uievent.move(1, 0);
            return;
        }

        // 监听Ctrl+S保存
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault();
            if (editor_multi.id != "") {
                editor_multi.confirm(); // 保存脚本编辑器
            }
            else if (editor_blockly.id != "") {
                editor_blockly.confirm(); // 保存事件编辑器
            }
            else {
                editor_mode.saveFloor();
            }
            return;
        }

        // 如果是开启事件/脚本编辑器状态，则忽略
        if (editor_multi.id != "" || editor_blockly.id != "")
            return;

        // PGUP和PGDOWN切换楼层
        if (e.keyCode == 33 || e.keyCode == 34) {
            e.preventDefault();
            var index = editor.core.floorIds.indexOf(editor.currentFloorId);
            var nextIndex = index + (e.keyCode == 33 ? 1 : -1);
            if (nextIndex >= 0 && nextIndex < editor.core.floorIds.length) {
                var toId = editor.core.floorIds[nextIndex];
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                document.getElementById('selectFloor').value = toId;
                editor.changeFloor(toId);
            }
            return;
        }

        var focusElement = document.activeElement;
        if (!focusElement || focusElement.tagName.toLowerCase() == 'body'
            || focusElement.id == 'selectFloor') {

            //Ctrl+z 撤销上一步undo
            if (e.keyCode == 90 && e.ctrlKey) {
                e.preventDefault();
                if (editor.uivalues.preMapData.length > 0) {
                    var data = editor.uivalues.preMapData.pop();
                    editor.map = JSON.parse(JSON.stringify(data.map));
                    editor.fgmap = JSON.parse(JSON.stringify(data.fgmap));
                    editor.bgmap = JSON.parse(JSON.stringify(data.bgmap));
                    editor.updateMap();
                    editor.uivalues.postMapData.push(data);
                    editor.uifunctions.highlightSaveFloorButton();
                    printf("已撤销此操作，你可能需要重新保存地图。");
                }
                return;
            }
            //Ctrl+y 重做一步redo
            if (e.keyCode == 89 && e.ctrlKey) {
                e.preventDefault();
                if (editor.uivalues.postMapData.length > 0) {
                    var data = editor.uivalues.postMapData.pop();
                    editor.map = JSON.parse(JSON.stringify(data.map));
                    editor.fgmap = JSON.parse(JSON.stringify(data.fgmap));
                    editor.bgmap = JSON.parse(JSON.stringify(data.bgmap));
                    editor.updateMap();
                    editor.uivalues.preMapData.push(data);
                    editor.uifunctions.highlightSaveFloorButton();
                    printf("已重做此操作，你可能需要重新保存地图。");
                }
                return;
            }

            // Ctrl+C, Ctrl+X, Ctrl+V
            if (e.ctrlKey && e.keyCode == 67 && !selectBox.isSelected()) {
                e.preventDefault();
                editor.uivalues.copyedInfo = editor.copyFromPos(editor.uivalues.selectedArea);
                printf('该点事件已复制；请注意右键地图拉框可以复制一个区域；若有时复制失灵请多点几下空白处');
                return;
            }
            if (e.ctrlKey && e.keyCode == 88 && !selectBox.isSelected()) {
                e.preventDefault();
                editor.uivalues.copyedInfo = editor.copyFromPos(editor.uivalues.selectedArea);
                editor.clearPos(true, editor.uivalues.selectedArea, function () {
                    printf('该点事件已剪切；请注意右键地图拉框可以剪切一个区域；若有时剪切失灵请多点几下空白处');
                    editor.uifunctions.unhighlightSaveFloorButton();
                })
                return;
            }
            if (e.ctrlKey && e.keyCode == 86 && !selectBox.isSelected()) {
                e.preventDefault();
                if (!editor.uivalues.copyedInfo) {
                    printe("没有复制的事件");
                    return;
                }
                editor.pasteToPos(editor.uivalues.copyedInfo);
                editor.updateMap();
                editor.file.saveFloorFile(function (err) {
                    if (err) {
                        printe(err);
                        throw (err)
                    }
                    ; printf('粘贴事件成功；若有时粘贴失灵请多点几下空白处');
                    editor.uifunctions.unhighlightSaveFloorButton();
                    editor.drawPosSelection();
                });
                return;
            }
            // DELETE
            if (e.keyCode == 46 && !selectBox.isSelected()) {
                editor.clearPos(true, editor.uivalues.selectedArea, function () {
                    printf('该点事件已删除；请注意右键地图拉框可以删除一个区域；；若有时删除失灵请多点几下空白处');
                    editor.uifunctions.unhighlightSaveFloorButton();
                })
                return;
            }
            // ESC
            if (e.keyCode == 27) {
                if (selectBox.isSelected()) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw (err)
                        }
                        ; printf('地图保存成功');
                    });
                }
                selectBox.isSelected(false);
                editor.info = {};
                return;
            }
            //alt + 0~9 改变快捷图块
            if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1) {
                var infoToSave = JSON.stringify(editor.info || 0);
                if (infoToSave == JSON.stringify({})) return;
                editor.uivalues.shortcut[e.keyCode] = JSON.parse(infoToSave);
                printf('已保存该快捷图块, 数字键 ' + (e.keyCode - 48) + ' 使用.')
                editor.config.set('shortcut', editor.uivalues.shortcut);
                return;
            }
            //ctrl + 0~9 切换到快捷图块
            if ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1) {
                editor.setSelectBoxFromInfo(JSON.parse(JSON.stringify(editor.uivalues.shortcut[e.keyCode] || 0)));
                return;
            }
            switch (e.keyCode) {
                // WASD
                case 87: editor.moveViewport(0, -1); break;
                case 65: editor.moveViewport(-1, 0); break;
                case 83: editor.moveViewport(0, 1); break;
                case 68: editor.moveViewport(1, 0); break;
                // Z~.
                case 90: editor_mode.change('map'); break; // Z
                case 88: editor_mode.change('loc'); break; // X
                case 67: editor_mode.change('enemyitem'); break; // C
                case 86: editor_mode.change('floor'); break; // V
                case 66: editor_mode.change('tower'); break; // B
                case 78: editor_mode.change('functions'); break; // N
                case 77: editor_mode.change('appendpic'); break; // M
                case 188: editor_mode.change('commonevent'); break; // ,
                case 190: editor_mode.change('plugins'); break; // .
                // H
                case 72: editor.uifunctions.showHelp(); break;
            }
            return;
        }
    }

    editor.uifunctions.showHelp = function () {
        alert(
            "快捷操作帮助：\n" +
            "ESC / 点击空白处：自动保存当前修改" +
            "WASD / 长按箭头：平移大地图\n" +
            "PgUp, PgDn / 鼠标滚轮：上下切换楼层\n" +
            "Z~.（键盘的第三排）：快捷切换标签\n" +
            "双击地图：选中对应点的素材\n" +
            "右键地图：弹出菜单栏\n" +
            "Alt+0~9：保存当前使用的图块\n" +
            "0~9：选中保存的图块\n" +
            "Ctrl+Z / Ctrl+Y：撤销/重做上次绘制\n" +
            "Ctrl+S：事件与脚本编辑器的保存并退出\n" +
            "双击事件编辑器：长文本编辑/脚本编辑/地图选点/UI绘制预览"
        );
    }


    // ------ UI预览 & 地图选点相关 ------ //

    var uievent = {
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
    uievent.elements.canvas = document.getElementById('uievent');
    uievent.elements.usedFlags = document.getElementById('uieventUsedFlags');
    uievent.elements.extraBody = document.getElementById('uieventExtraBody');

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
                if (!type || !core.ui["_uievent_" + type]) return;
                core.ui["_uievent_" + type](data);
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
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'block';
        uievent.elements.usedFlags.style.display = 'none';
        uievent.elements.extraBody.style.display = 'none';
        uievent.elements.body.style.overflow = "hidden";

        uievent.values.list = list;
        uievent.drawPreviewUI();
    }

    uievent.selectPoint = function (floorId, x, y, hideFloor, callback) {
        uievent.values.hideFloor = hideFloor;
        uievent.values.size = editor.isMobile ? window.innerWidth / core.__SIZE__ : 32;
        uievent.elements.selectPointBox.style.width = (uievent.values.size - 6) + "px";
        uievent.elements.selectPointBox.style.height = (uievent.values.size - 6) + "px";

        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'selectPoint';
        uievent.elements.selectPoint.style.display = 'block';
        uievent.elements.yes.style.display = 'inline';
        uievent.elements.selectBackground.style.display = 'none';
        // uievent.elements.selectFloor.style.display = hideFloor ? 'none' : 'inline';
        uievent.elements.selectFloor.style.display = 'inline';
        uievent.elements.selectPointBox.style.display = 'block';
        uievent.elements.canvas.style.display = 'block';
        uievent.elements.usedFlags.style.display = 'none';
        uievent.elements.extraBody.style.display = 'none';
        uievent.elements.body.style.overflow = "hidden";
        uievent.elements.yes.onclick = function () {
            var floorId = uievent.values.floorId, x = uievent.values.x, y = uievent.values.y;
            uievent.close();
            if (callback) {
                callback(floorId, x, y);
            }
        }

        // Append children
        var floors = "";
        core.floorIds.forEach(function (f) {
            floors += "<option value=" + f + ">" + f + "</option>";
        })
        uievent.elements.selectFloor.innerHTML = floors;

        this.setPoint(floorId || editor.currentFloorId, core.calValue(x) || 0, core.calValue(y) || 0);
    }

    uievent.updateSelectPoint = function (redraw) {
        uievent.elements.title.innerText = '地图选点 (' + uievent.values.x + "," + uievent.values.y + ')';
        if (redraw) {
            core.setAlpha('uievent', 1);
            core.clearMap('uievent');
            core.drawThumbnail(uievent.values.floorId, null, null,
                {
                    ctx: 'uievent', centerX: uievent.values.left + core.__HALF_SIZE__,
                    centerY: uievent.values.top + core.__HALF_SIZE__
                });
        }
        uievent.elements.selectPointBox.style.left = uievent.values.size * (uievent.values.x - uievent.values.left) + "px";
        uievent.elements.selectPointBox.style.top = uievent.values.size * (uievent.values.y - uievent.values.top) + "px";
    }

    uievent.setPoint = function (floorId, x, y) {
        if (core.floorIds.indexOf(floorId) == -1) floorId = editor.currentFloorId;
        uievent.values.floorId = floorId;
        uievent.elements.selectFloor.value = floorId;
        uievent.values.x = x != null ? x : (uievent.values.x || 0);
        uievent.values.y = y != null ? y : (uievent.values.y || 0);
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

    (function () {

        var viewportButtons = uievent.elements.selectPointButtons;
        var pressTimer = null;
        for (var ii = 0, node; node = viewportButtons.children[ii]; ii++) {
            (function (x, y) {
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
            })([-1, 0, 0, 1][ii], [0, -1, 1, 0][ii]);
        }
    })();

    uievent.elements.div.onmousewheel = function (e) {
        // if (uievent.mode != 'selectPoint' || uievent.values.hideFloor) return;
        if (uievent.mode != 'selectPoint') return;
        var index = core.floorIds.indexOf(uievent.values.floorId);
        try {
            if (e.wheelDelta)
                index += Math.sign(e.wheelDelta);
            else if (e.detail)
                index += Math.sign(e.detail);
        } catch (ee) { main.log(ee); }
        index = core.clamp(index, 0, core.floorIds.length - 1);
        uievent.setPoint(core.floorIds[index]);
    }

    // ------ 搜索变量出现的位置，也放在uievent好了 ------ //

    uievent.searchUsedFlags = function () {
        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'searchUsedFlags';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'none';
        uievent.elements.title.innerText = '搜索变量';
        uievent.elements.selectBackground.style.display = 'none';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'none';
        uievent.elements.usedFlags.style.display = 'inline';
        uievent.elements.extraBody.style.display = 'block';
        uievent.elements.body.style.overflow = "auto";

        // build flags
        var html = "";
        Object.keys(editor.used_flags).sort().forEach(function (v) {
            v = "flag:" + v;
            html += "<option value='" + v + "'>" + v + "</option>";
        });
        uievent.elements.usedFlags.innerHTML = html;

        uievent.doSearchUsedFlags();
    }

    uievent.doSearchUsedFlags = function () {
        var flag = uievent.elements.usedFlags.value;

        var html = "<p style='margin-left: 10px'>该变量出现的所有位置如下：</p><ul>";
        var list = uievent._searchUsedFlags(flag);
        list.forEach(function (v) {
            var x = "<li>";
            if (v[0] != null) x += v[0] + "层 ";
            else x += "公共事件 ";
            x += v[1];
            if (v[2] != null) x += " 的 (" + v[2] + ") 点";
            x += "</li>";
            html += x;
        });
        html += "</ul>";
        uievent.elements.extraBody.innerHTML = html;
    }

    var hasUsedFlags = function (obj, flag) {
        if (obj == null) return false;
        if (typeof obj != 'string') return hasUsedFlags(JSON.stringify(obj), flag);

        var index = -1, length = flag.length;
        while (true) {
            index = obj.indexOf(flag, index + 1);
            if (index < 0) return false;
            if (!/^[a-zA-Z0-9_\u4E00-\u9FCC]$/.test(obj.charAt(index + length))) return true;
        }
    }

    uievent._searchUsedFlags = function (flag) {
        var list = [];
        var events = ["events", "autoEvent", "changeFloor", "afterBattle", "afterGetItem", "afterOpenDoor"]
        for (var floorId in core.floors) {
            var floor = core.floors[floorId];
            if (hasUsedFlags(floor.firstArrive, flag)) list.push([floorId, "firstArrive"]);
            if (hasUsedFlags(floor.eachArrive, flag)) list.push([floorId, "eachArrive"]);
            events.forEach(function (e) {
                if (floor[e]) {
                    for (var loc in floor[e]) {
                        if (hasUsedFlags(floor[e][loc], flag)) {
                            list.push([floorId, e, loc]);
                        }
                    }
                }
            });
        }
        // 公共事件
        if (core.events.commonEvent) {
            for (var name in core.events.commonEvent) {
                if (hasUsedFlags(core.events.commonEvent[name], flag))
                    list.push([null, name]);
            }
        }
        return list;
    }

    // ------ 素材选择框 ------ //
    uievent.selectMaterial = function (value, title, directory, transform, callback) {
        fs.readdir(directory, function (err, data) {
            if (err) {
                printe(directory + '不存在！');
                throw (directory + '不存在！');
            }
            if (!(data instanceof Array)) {
                printe('没有可显示的内容')
                return;
            }
            value = value || [];
            data = (transform ? data.map(transform) : data).filter(function (one) {return one;}).sort();

            uievent.isOpen = true;
            uievent.elements.div.style.display = 'block';
            uievent.mode = 'selectMaterial';
            uievent.elements.selectPoint.style.display = 'none';
            uievent.elements.yes.style.display = 'block';
            uievent.elements.title.innerText = title;
            uievent.elements.selectBackground.style.display = 'none';
            uievent.elements.selectFloor.style.display = 'none';
            uievent.elements.selectPointBox.style.display = 'none';
            uievent.elements.canvas.style.display = 'none';
            uievent.elements.usedFlags.style.display = 'none';
            uievent.elements.extraBody.style.display = 'block';
            uievent.elements.body.style.overflow = "auto";

            uievent.elements.yes.onclick = function () {
                var list = Array.from(document.getElementsByClassName('materialCheckbox')).filter(function (one) {
                    return one.checked;
                }).map(function (one) {return one.getAttribute('key'); });
                uievent.close();
                if (callback) callback(list);
            }

            // 显示每一项内容
            var html = "<p style='margin-left: 10px; line-height: 25px'>";
            html += "<button onclick='editor.uievent._selectAllMaterial(true)'>全选</button>"+
                    "<button style='margin-left: 10px' onclick='editor.uievent._selectAllMaterial(false)'>全不选</button><br/>";
            data.forEach(function (one) {
                html += `<input type="checkbox" key="${one}" class="materialCheckbox" ${value.indexOf(one) >= 0? 'checked' : ''} /> ${one}`;
                // 预览图片
                if (one.endsWith('.png') || one.endsWith('.jpg') || one.endsWith('.jpeg') || one.endsWith('.gif')) {
                    html += "<button onclick='editor.uievent._previewMaterialImage(this)' style='margin-left: 10px'>预览</button>";
                    html += '<br style="display:none"/><img key="'+directory+one+'" style="display:none; max-width: 100%"/>';
                }
                // 试听音频
                if (one.endsWith('.mp3') || one.endsWith('.wmv') || one.endsWith('.ogg') || one.endsWith('.wav')) {
                    html += "<button onclick='editor.uievent._previewMaterialAudio(this)' style='margin-left: 10px'>播放</button>";
                    html += `<small style='display:none; margin-left: 15px'>0:00 / 0:00</small><br style="display:none"/>
                        <audio preload="none" src="${directory+one}" ontimeupdate="editor.uievent._previewMaterialAudio_onTimeUpdate(this)"></audio>
                        <progress value="0" max="1" style="display:none; width:100%" onclick="editor.uievent._previewMaterialAudio_seek(this, event)"></progress>`;
                }
                html += '<br/>';
            });
            html += "</p>";
            uievent.elements.extraBody.innerHTML = html;
        });
    }

    uievent._selectAllMaterial = function (checked) {
        Array.from(document.getElementsByClassName('materialCheckbox')).forEach(function (one) {
            one.checked = checked;
        })
    }

    uievent._previewMaterialImage = function (button) {
        var br = button.nextElementSibling;
        var img = br.nextElementSibling;
        if (br.style.display == 'none') {
            button.innerText = '折叠';
            br.style.display = 'block';
            img.style.display = 'block';
            img.src = img.getAttribute('key');
        } else {
            button.innerText = '预览';
            br.style.display = 'none';
            img.style.display = 'none';
        }
    }

    uievent._previewMaterialAudio = function (button) {
        var span = button.nextElementSibling;
        var br = span.nextElementSibling;
        var audio = br.nextElementSibling;
        var progress = audio.nextElementSibling;
        if (br.style.display == 'none') {
            button.innerText = '暂停';
            br.style.display = 'block';
            progress.style.display = 'block';
            span.style.display = 'inline';
            audio.play();
        } else {
            button.innerText = '播放';
            br.style.display = 'none';
            progress.style.display='none';
            span.style.display = 'none';
            audio.pause();
        }
    }

    uievent._previewMaterialAudio_onTimeUpdate = function (audio) {
        var _format = function (time) { return parseInt(time/60) + ":" + core.setTwoDigits(parseInt(time) % 60); }
        if (audio.duration > 0) {
            audio.previousElementSibling.previousElementSibling.innerText = _format(audio.currentTime) + " / " + _format(audio.duration);
            audio.nextElementSibling.setAttribute('value', audio.currentTime / audio.duration);
        }
    }

    uievent._previewMaterialAudio_seek = function (element, event) {
        var audio = element.previousElementSibling;
        var value = event.offsetX * element.max / element.offsetWidth;
        element.setAttribute("value", value);
        audio.currentTime = audio.duration * value;
        if (audio.paused) audio.play();
    }

    // ------ 多选框 ------ //
    uievent.popCheckboxSet = function (value, comments, title, callback) {
        if (value == null) value = [];
        if (!(value instanceof Array)) {
            if (value == 0) value = [];
            else value = [value];
        }

        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'popCheckboxSet';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'block';
        uievent.elements.title.innerText = title;
        uievent.elements.selectBackground.style.display = 'none';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'none';
        uievent.elements.usedFlags.style.display = 'none';
        uievent.elements.extraBody.style.display = 'block';
        uievent.elements.body.style.overflow = "auto";

        uievent.elements.yes.onclick = function () {
            var list = Array.from(document.getElementsByClassName('uieventCheckboxSet')).filter(function (one) {
                return one.checked;
            }).map(function (one) {
                var value = one.getAttribute('key');
                if (one.getAttribute('_type') == 'number') value = parseFloat(value);
                return value; 
            });
            uievent.close();
            if (callback) callback(list);
        }

        var keys=Array.from(comments.key)
        var prefixStrings=Array.from(comments.prefix)
        for (var index = 0; index < value.length; index++) {
            if (keys.indexOf(value[index])==-1) {
                prefixStrings.push(value[index]+': ')
                keys.push(value[index])
            }
        }
        var table = '<table style="width: 100%">';

        for (var index = 0; index < keys.length; index++) {
            var one = keys[index];
            if (index % 3 == 0) {
                table += '<tr>';
            }
            table += `<td style='color:black'>${prefixStrings[index]}<input type="checkbox" _type="${typeof one}" key="${one}" class="uieventCheckboxSet" ${value.indexOf(one) >= 0? 'checked' : ''}/></td>`;
            if (index % 3 == 2) {
                table += '</tr>';
            }
        }
        if (keys.length % 3 != 0) table += '</tr>';
        table += '</table>';

        uievent.elements.extraBody.innerHTML = "<p>"+table+"</p>";
    }

    editor.constructor.prototype.uievent=uievent;

}