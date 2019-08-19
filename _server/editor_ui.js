editor_ui_wrapper = function (editor) {

    
    /**
     * 根据鼠标点击, 得到从元素向上到body的所有id
     */
    editor.uifunctions.getClickpath=function(e){
        //console.log(e);
        var clickpath = [];
        var getpath=function(e) {
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
    editor.uifunctions.body_click=function (e) {
        var clickpath=editor.uifunctions.getClickpath(e);
    
        var unselect=true;
        for(var ii=0,thisId;thisId=['edit','tip','brushMod','brushMod2','brushMod3','layerMod','layerMod2','layerMod3','viewportButtons'][ii];ii++){
            if (clickpath.indexOf(thisId) !== -1){
                unselect=false;
                break;
            }
        }
        if (unselect) {
            if (clickpath.indexOf('eui') === -1) {
                if (selectBox.isSelected()) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw(err)
                        }
                        ;printf('地图保存成功');
                    });
                }
                selectBox.isSelected(false);
                editor.info = {};
            }
        }
        //editor.mode.onmode('');
        if (e.button!=2 && !editor.isMobile){
            editor.hideMidMenu();
        }
        if (clickpath.indexOf('down') !== -1 && editor.isMobile && clickpath.indexOf('midMenu') === -1){
            editor.hideMidMenu();
        }
        if(clickpath.length>=2 && clickpath[0].indexOf('id_')===0){editor.lastClickId=clickpath[0]}
    }

    /**
     * editor.dom.body.onkeydown
     * 绑定快捷键
     */
    editor.uifunctions.body_shortcut=function (e) {

        // UI预览 & 地图选点
        if (uievent && uievent.isOpen) {
            e.preventDefault();
            if (e.keyCode == 27) uievent.close();
            else if (e.keyCode == 13) uievent.confirm();
            else if (e.keyCode==87) uievent.move(0,-1)
            else if (e.keyCode==65) uievent.move(-1,0)
            else if (e.keyCode==83) uievent.move(0,1);
            else if (e.keyCode==68) uievent.move(1,0);
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
        if (editor_multi.id!="" || editor_blockly.id!="")
            return;

        // 禁止快捷键的默认行为
        if (e.ctrlKey && [89, 90, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1)
            e.preventDefault();
        if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1)
            e.preventDefault();
        //Ctrl+z 撤销上一步undo
        if (e.keyCode == 90 && e.ctrlKey && editor.uivalues.preMapData && editor.uivalues.currDrawData.pos.length && selectBox.isSelected()) {
            editor.map = JSON.parse(JSON.stringify(editor.uivalues.preMapData.map));
            editor.fgmap = JSON.parse(JSON.stringify(editor.uivalues.preMapData.fgmap));
            editor.bgmap = JSON.parse(JSON.stringify(editor.uivalues.preMapData.bgmap));
            editor.updateMap();
            editor.uivalues.reDo = JSON.parse(JSON.stringify(editor.uivalues.currDrawData));
            editor.uivalues.currDrawData = {pos: [], info: {}};
            editor.uivalues.preMapData = null;
            return;
        }
        //Ctrl+y 重做一步redo
        if (e.keyCode == 89 && e.ctrlKey && editor.uivalues.reDo && editor.uivalues.reDo.pos.length && selectBox.isSelected()) {
            editor.uivalues.preMapData = JSON.parse(JSON.stringify({map:editor.map,fgmap:editor.fgmap,bgmap:editor.bgmap}));
            for (var j = 0; j < editor.uivalues.reDo.pos.length; j++)
                editor.map[editor.uivalues.reDo.pos[j].y][editor.uivalues.reDo.pos[j].x] = JSON.parse(JSON.stringify(editor.uivalues.reDo.info));

            editor.updateMap();
            editor.uivalues.currDrawData = JSON.parse(JSON.stringify(editor.uivalues.reDo));
            editor.uivalues.reDo = null;
            return;
        }

        // PGUP和PGDOWN切换楼层
        if (e.keyCode==33 || e.keyCode==34) {
            e.preventDefault();
            var index=editor.core.floorIds.indexOf(editor.currentFloorId);
            var nextIndex = index + (e.keyCode==33?1:-1);
            if (nextIndex>=0 && nextIndex<editor.core.floorIds.length) {
                var toId = editor.core.floorIds[nextIndex];
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                document.getElementById('selectFloor').value = toId;
                editor.changeFloor(toId);
            }
            return;
        }
        //ctrl + 0~9 切换到快捷图块
        if (e.ctrlKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1){
            editor.setSelectBoxFromInfo(JSON.parse(JSON.stringify(editor.uivalues.shortcut[e.keyCode]||0)));
            return;
        }
        //alt + 0~9 改变快捷图块
        if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1){
            var infoToSave = JSON.stringify(editor.info||0);
            if(infoToSave==JSON.stringify({}))return;
            editor.uivalues.shortcut[e.keyCode]=JSON.parse(infoToSave);
            printf('已保存该快捷图块, ctrl + '+(e.keyCode-48)+' 使用.')
            core.setLocalStorage('shortcut',editor.uivalues.shortcut);
            return;
        }
        var focusElement = document.activeElement;
        if (!focusElement || focusElement.tagName.toLowerCase()=='body') {
            // Ctrl+C, Ctrl+X, Ctrl+V
            if (e.ctrlKey && e.keyCode == 67 && !selectBox.isSelected()) {
                e.preventDefault();
                editor.uivalues.copyedInfo = editor.copyFromPos();
                printf('该点事件已复制');
                return;
            }
            if (e.ctrlKey && e.keyCode == 88 && !selectBox.isSelected()) {
                e.preventDefault();
                editor.uivalues.copyedInfo = editor.copyFromPos();
                editor.clearPos(true, null, function () {
                    printf('该点事件已剪切');
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
                        throw(err)
                    }
                    ;printf('粘贴事件成功');
                    editor.drawPosSelection();
                });
                return;
            }
            // DELETE
            if (e.keyCode == 46 && !selectBox.isSelected()) {
                editor.clearPos(true);
                return;
            }
            // ESC
            if (e.keyCode == 27) {
                if (selectBox.isSelected()) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw(err)
                        }
                        ;printf('地图保存成功');
                    });
                }
                selectBox.isSelected(false);
                editor.info = {};
                return;
            }
            switch (e.keyCode) {
                // WASD
                case 87: editor.moveViewport(0,-1); break;
                case 65: editor.moveViewport(-1,0); break;
                case 83: editor.moveViewport(0,1); break;
                case 68: editor.moveViewport(1,0); break;
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
            "Ctrl+0~9：选中保存的图块\n" +
            "Ctrl+Z / Ctrl+Y：撤销/重做上次绘制\n" +
            "Ctrl+S：事件与脚本编辑器的保存并退出\n" +
            "双击事件编辑器：长文本编辑/脚本编辑/地图选点/UI绘制预览"
        );
    }

}