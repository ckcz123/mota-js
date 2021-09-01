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
        if (e.button != 2 && !editor.isMobile && clickpath.indexOf('midMenu') === -1) {
            editor.uifunctions.hideMidMenu();
        }
        if (clickpath.indexOf('down') !== -1 && clickpath.indexOf('midMenu') === -1 && editor.isMobile) {
            editor.uifunctions.hideMidMenu();
        }
        if (clickpath.length >= 2 && clickpath[0].indexOf('id_') === 0) { editor.lastClickId = clickpath[0] }
    }

    /**
     * editor.dom.body.onkeydown
     * 绑定快捷键
     */
    editor.uifunctions.body_shortcut = function (e) {
        editor.uivalues.tileSize = [1,1];

        // UI预览 & 地图选点
        if (editor.uievent && editor.uievent.isOpen) {
            editor.uievent.onKeyDown(e);
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
            var saveFloor = document.getElementById('saveFloor');
            if (saveFloor && saveFloor.classList.contains('highlight')) {
                return;
            }

            var index = editor.core.floorIds.indexOf(editor.currentFloorId);
            var nextIndex = index + (e.keyCode == 33 ? 1 : -1);
            if (nextIndex >= 0 && nextIndex < editor.core.floorIds.length) {
                var toId = editor.core.floorIds[nextIndex];
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                document.getElementById('selectFloor').value = toId;
                editor.uivalues.recentFloors.push(editor.currentFloorId);
                editor.changeFloor(toId);
            }
            return;
        }

        var focusElement = document.activeElement;
        if (!focusElement || focusElement.tagName.toLowerCase() == 'body'
            || focusElement.id == 'selectFloor' || focusElement.id == 'bigmapBtn'
            || focusElement.id.startsWith('layerMod')) {

            //Ctrl+z 撤销上一步undo
            if (e.keyCode == 90 && e.ctrlKey) {
                e.preventDefault();
                if (editor.uivalues.preMapData.length > 0) {
                    var data = editor.uivalues.preMapData.pop();
                    editor.dom.maps.forEach(function (one) {
                        editor[one] = JSON.parse(JSON.stringify(data[one]));
                    });
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
                    editor.dom.maps.forEach(function (one) {
                        editor[one] = JSON.parse(JSON.stringify(data[one]));
                    });
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
                editor.savePreMap();
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
                editor.savePreMap();
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
                editor.savePreMap();
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
                // F
                case 70: editor.uifunctions.triggerBigmap(); break;
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
            "ESC / 点击空白处：自动保存当前修改\n" +
            "F：切换大地图\n" + 
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
}