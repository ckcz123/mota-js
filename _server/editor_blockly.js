editor_blockly = function () {

    var editor_blockly = {entryType:'event'};

    editor.uivalues.disableBlocklyReplace = editor.config.get("disableBlocklyReplace", false);
    var replaceCheckbox = document.getElementById('blocklyReplace');
    replaceCheckbox.checked = !editor.uivalues.disableBlocklyReplace;

    editor_blockly.triggerReplace = function () {
        editor.uivalues.disableBlocklyReplace = !replaceCheckbox.checked;
        editor.config.set("disableBlocklyReplace", !replaceCheckbox.checked);
        if (MotaActionFunctions) MotaActionFunctions.disableReplace = !replaceCheckbox.checked;
        alert("已" + (replaceCheckbox.checked ? "开启" : "关闭") + "中文变量名替换！\n关闭并重开事件编辑器以生效。");
    }

    editor.uivalues.disableBlocklyExpandCompare = editor.config.get("disableBlocklyExpandCompare", false);
    var expandCompareCheckbox = document.getElementById('blocklyExpandCompare');
    expandCompareCheckbox.checked = !editor.uivalues.disableBlocklyExpandCompare;

    editor_blockly.triggerExpandCompare = function () {
        editor.uivalues.disableBlocklyExpandCompare = !expandCompareCheckbox.checked;
        editor.config.set("disableBlocklyExpandCompare", !expandCompareCheckbox.checked);
        if (MotaActionFunctions) MotaActionFunctions.disableExpandCompare = !expandCompareCheckbox.checked;
    }

    var input_ = '';
    editor_blockly.runOne = function () {
        //var printf = console.log;
        //var printf = function(){};
        var grammerFile = input_;
        converter = new Converter().init();
        converter.generBlocks(grammerFile);
        //printf(converter.blocks);
        converter.renderGrammerName();
        //converter.generToolbox();
        converter.generMainFile();
        //printf(converter.mainFile.join(''));
        //console.log(converter);


        var script = document.createElement('script');
        script.innerHTML = converter.mainFile[5] + editor_blocklyconfig;
        document.body.appendChild(script);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            alert("图块描述文件加载失败, 请在'启动服务.exe'中打开编辑器");
            return;
        }
        input_ = xhr.responseText;
        editor_blockly.runOne();
        MotaActionFunctions.disableReplace = editor.uivalues.disableBlocklyReplace;
        MotaActionFunctions.disableExpandCompare = editor.uivalues.disableBlocklyExpandCompare;
    }
    xhr.open('GET', '_server/MotaAction.g4', true);
    xhr.send(null);

    var codeAreaHL = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
        lineNumbers: true,
        matchBrackets: true,
        lineWrapping: true,
        continueComments: "Enter",
        extraKeys: {"Ctrl-Q": "toggleComment"},
    });
    codeAreaHL.on('changes', function () {
        editor_blockly.highlightParse(!changeFromBlockly);
        changeFromBlockly = false;
    });
    var changeFromBlockly = false;
    var shouldNotifyParse = false;

    editor_blockly.showXML = function () {
        var xml = Blockly.Xml.workspaceToDom(editor_blockly.workspace);
        var xml_text = Blockly.Xml.domToPrettyText(xml);
        console.log(xml_text);
        var xml_text = Blockly.Xml.domToText(xml);
        console.log(xml_text);
        console.log(xml);
    }

    editor_blockly.runCode = function () {
        // Generate JavaScript code and run it.
        window.LoopTrap = 1000;
        Blockly.JavaScript.INFINITE_LOOP_TRAP =
            'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var code = Blockly.JavaScript.workspaceToCode(editor_blockly.workspace);
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            eval('obj=' + code);
            console.log(obj);
        } catch (e) {
            alert(e);
        }
    }

    editor_blockly.setValue = function (value) {
      changeFromBlockly = true;
      codeAreaHL.setValue(value);
    }

    editor_blockly.parse = function () {
        MotaActionFunctions.parse(
            eval('obj=' + codeAreaHL.getValue().replace(/[<>&]/g, function (c) {
                return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c];
            }).replace(/\\(r|f|i|c|d|e|z)/g,'\\\\$1')),
            editor_blockly.entryType
        );
    }

    editor_blockly.id = '';

    editor_blockly.import = function (id_, args) {
        var thisTr = document.getElementById(id_);
        if (!thisTr) return false;
        var input = thisTr.children[2].children[0].children[0];
        var field = thisTr.children[0].getAttribute('title');
        var type = args.type;
        if (!type) return false;
        editor_blockly.id = id_;
        editor_blockly.setValue(input.value);
        editor_blockly.entryType = type;
        editor_blockly.parse();
        editor_blockly.show();
        return true;
    }

    var blocklyWidgetDiv = document.getElementsByClassName('blocklyWidgetDiv');
    editor_blockly.show = function () {
        if (typeof(selectBox) !== typeof(undefined)) selectBox.isSelected(false);
        document.getElementById('left6').style = '';
        for (var ii = 0, node; node = blocklyWidgetDiv[ii]; ii++) {
            node.style.zIndex = 201;
            node.style.opacity = '';
        }
    }
    editor_blockly.hide = function () {
        document.getElementById('left6').style = 'z-index:-1;opacity: 0;';
        for (var ii = 0, node; node = blocklyWidgetDiv[ii]; ii++) {
            node.style.zIndex = -1;
            node.style.opacity = 0;
        }
    }

    var blocklyParseBtn = document.getElementById('blocklyParse');
    editor_blockly.highlightParse = function (shouldHighLight) {
      if (shouldNotifyParse == shouldHighLight) return;
      shouldNotifyParse = shouldHighLight;
      blocklyParseBtn.style.background = shouldNotifyParse ? '#FFCCAA' : 'unset';
    }

    editor_blockly.cancel = function () {
        editor_blockly.id = '';
        editor_blockly.hide();
    }

    editor_blockly.confirm = function () {
        if (!editor_blockly.id) {
            editor_blockly.id = '';
            return;
        }
        if (shouldNotifyParse) {
          alert('你尚未解析修改后的内容，请进行解析或放弃操作');
          return;
        }
        if(editor_blockly.workspace.topBlocks_.length>=2){
          editor_blockly.setValue('入口方块只能有一个');
          return;
        }
        var eventType = editor_blockly.entryType;
        if(editor_blockly.workspace.topBlocks_.length==1){
          var blockType = editor_blockly.workspace.topBlocks_[0].type;
          if(blockType!==eventType+'_m'){
            editor_blockly.setValue('入口方块类型错误');
            return;
          }
        }
        var setvalue = function (value) {
            var thisTr = document.getElementById(editor_blockly.id);
            editor_blockly.id = '';
            var input = thisTr.children[2].children[0].children[0];
            input.value = value;
            editor_blockly.hide();
            input.onchange();
        }
        if (codeAreaHL.getValue() === '') {
            eventType==='shop'?setvalue('[]'):setvalue('null');
            return;
        }
        var code = Blockly.JavaScript.workspaceToCode(editor_blockly.workspace);
        code = code.replace(/\\(i|c|d|e|z)/g, '\\\\$1');
        eval('var obj=' + code);
        if (this.checkAsync(obj) && confirm("警告！存在不等待执行完毕的事件但却没有用【等待所有异步事件处理完毕】来等待" +
            "它们执行完毕，这样可能会导致录像检测系统出问题。\n你要返回修改么？")) return;
        setvalue(JSON.stringify(obj));
    }

    // 检查"不等待处理完毕"
    editor_blockly.checkAsync = function (obj) {
        if (!(obj instanceof Array)) return false;
        var hasAsync = false;
        for (var i = 0; i < obj.length; ++i) {
            var one = obj[i];
            if (one.type == 'if' && (this.checkAsync(one['true']) || this.checkAsync(one['false'])))
                return true;
            if ((one.type == 'while' || one.type == 'dowhile') && this.checkAsync(one.data))
                return true;
            if (one.type == 'if' && (this.checkAsync(one.yes) || this.checkAsync(one.no)))
                return true;
            if (one.type == 'choices') {
                var list = one.choices;
                if (list instanceof Array) {
                    for (var j = 0; j < list.length; j++) {
                        if (this.checkAsync(list[j].action)) return true;
                    }
                }
            }
            if (one.type == 'switch') {
                var list = one.caseList;
                if (list instanceof Array) {
                    for (var j = 0; j < list.length; j++) {
                        if (this.checkAsync(list[j].action)) return true;
                    }
                }
            }
            if (one.async && one.type != 'animate' && one.type != 'function') hasAsync = true;
            if (one.type == 'waitAsync') hasAsync = false;
        }
        return hasAsync;
    }

    var previewBlock = function (b) {
        var types = [
            "previewUI_s", "clearMap_s", "clearMap_1_s", "setAttribute_s", "fillText_s",
            "fillBoldText_s", "fillRect_s", "strokeRect_s", "drawLine_s",
            "drawArrow_s", "fillPolygon_s", "strokePolygon_s", "fillEllipse_s", "strokeEllipse_s", "fillArc_s", "strokeArc_s",
            "drawImage_s", "drawImage_1_s", "drawIcon_s", "drawBackground_s", "drawSelector_s", "drawSelector_1_s",
            "waitContext_2"
        ];
        if (b && types.indexOf(b.type)>=0) {
            try {
                var code = "[" + Blockly.JavaScript.blockToCode(b).replace(/\\(i|c|d|e|z)/g, '\\\\$1') + "]";
                eval("var obj="+code);
                if (obj.length > 0 && b.type == 'waitContext_2') {
                    var dt = obj[0];
                    editor.uievent.previewUI([{"type": "fillRect", "x": dt.px[0], "y": dt.py[0],
                        "width": "(" + dt.px[1] + ")-(" + dt.px[0] + ")", "height": "(" + dt.py[1] + ")-(" + dt.py[0] + ")",
                        "style": "rgba(255,0,0,0.5)"}])
                }
                else if (obj.length > 0 && b.type.startsWith(obj[0].type)) {
                    if (b.type == 'previewUI_s')
                        editor.uievent.previewUI(obj[0].action);
                    else editor.uievent.previewUI([obj[0]]);
                }
            } catch (e) {main.log(e);}
            return true;
        }
        return false;
    }

    editor_blockly.doubleClickBlock = function (blockId) {
        var b = editor_blockly.workspace.getBlockById(blockId);

        if (previewBlock(b)) return;

        if (b && b.type in selectPointBlocks) { // selectPoint
            this.selectPoint();
            return;
        }

        var textStringDict = {
            'text_0_s': 'EvalString_0',
            'text_1_s': 'EvalString_2',
            'autoText_s': 'EvalString_2',
            'scrollText_s': 'EvalString_0',
            'comment_s': 'EvalString_0',
            'choices_s': 'EvalString_0',
            'showTextImage_s': 'EvalString_0',
            'function_s': 'RawEvalString_0',
            'shopsub': 'EvalString_1',
            'confirm_s': 'EvalString_0',
            'drawTextContent_s': 'EvalString_0',
        }
        var f = b ? textStringDict[b.type] : null;
        if (f) {
            var value = b.getFieldValue(f);
            //多行编辑
            editor_multi.multiLineEdit(value, b, f, {'lint': f === 'RawEvalString_0'}, function (newvalue, b, f) {
                if (textStringDict[b.type] !== 'RawEvalString_0') {
                }
                b.setFieldValue(newvalue.split('\n').join('\\n'), f);
            });
        }
    }

    editor_blockly.lastUsedType=[
        'text_0_s',
        'comment_s',
        'show_s',
        'hide_s',
        'setValue_s',
        'if_s',
        'while_s',
        'battle_s',
        'openDoor_s',
        'choices_s',
        'setText_s',
        'exit_s',
        'sleep_s',
        'setBlock_s',
        'insert_1_s'
    ]; // 最常用的15个图块
    editor_blockly.lastUsedTypeNum=15;

    editor_blockly.addIntoLastUsedType=function(blockId) {
        var b = editor_blockly.workspace.getBlockById(blockId);
        if(!b)return;
        var blockType = b.type;
        if(!blockType || blockType.indexOf("_s")!==blockType.length-2 || blockType==='pass_s')return;
        editor_blockly.lastUsedType = editor_blockly.lastUsedType.filter(function (v) {return v!==blockType;});
        if (editor_blockly.lastUsedType.length >= editor_blockly.lastUsedTypeNum)
            editor_blockly.lastUsedType.pop();
        editor_blockly.lastUsedType.unshift(blockType);

        document.getElementById("searchBlock").value='';
    }

    // Index from 1 - 9
    editor_blockly.openToolbox = function(index) {
        if (index < 0) index += editor_blockly.workspace.toolbox_.tree_.children_.length;
        editor_blockly.workspace.toolbox_.tree_.setSelectedItem(editor_blockly.workspace.toolbox_.tree_.children_[index]);
    }
    editor_blockly.reopenToolbox = function(index) {
        if (index < 0) index += editor_blockly.workspace.toolbox_.tree_.children_.length;
        editor_blockly.workspace.toolbox_.tree_.setSelectedItem(editor_blockly.workspace.toolbox_.tree_.children_[index]);
        editor_blockly.workspace.getFlyout_().show(editor_blockly.workspace.toolbox_.tree_.children_[index].blocks);
    }

    editor_blockly.closeToolbox = function() {
        editor_blockly.workspace.toolbox_.clearSelection();
    }

    var searchInput = document.getElementById("searchBlock");
    searchInput.onfocus = function () {
        editor_blockly.reopenToolbox(-1);
    }

    searchInput.oninput = function () {
        editor_blockly.reopenToolbox(-1);
    }

    editor_blockly.searchBlock = function (value) {
        if (value == null) value = searchInput.value;
        value = value.toLowerCase();
        if (value == '') return editor_blockly.lastUsedType;
        var results = [];
        for (var name in MotaActionBlocks) {
            if (typeof name !== 'string' || name.indexOf("_s") !== name.length-2) continue;
            var block = MotaActionBlocks[name];
            if(block && block.json) {
                if ((block.json.type||"").toLowerCase().indexOf(value)>=0
                    || (block.json.message0||"").toLowerCase().indexOf(value)>=0
                    || (block.json.tooltip||"").toLowerCase().indexOf(value)>=0) {
                    results.push(name);
                    if (results.length>=editor_blockly.lastUsedTypeNum)
                        break;
                }
            }
        }

        return results.length == 0 ? editor_blockly.lastUsedType : results;
    }

    // ------ select point ------

    // id: [x, y, floorId, forceFloor]
    var selectPointBlocks = {
        "changeFloor_m": ["PosString_0", "PosString_1", "IdString_0", true],
        "jumpHero_s": ["PosString_0", "PosString_1"],
        "changeFloor_s": ["PosString_0", "PosString_1", "IdString_0", true],
        "changePos_s": ["PosString_0", "PosString_1"],
        "battle_1_s": ["PosString_0", "PosString_1"],
        "openDoor_s": ["PosString_0", "PosString_1", "IdString_0"],
        "closeDoor_s": ["PosString_0", "PosString_1"],
        "show_s": ["EvalString_0", "EvalString_1", "IdString_0"],
        "hide_s": ["EvalString_0", "EvalString_1", "IdString_0"],
        "setBlock_s": ["EvalString_1", "EvalString_2", "IdString_0"],
        "turnBlock_s": ["EvalString_1", "EvalString_2", "IdString_0"],
        "move_s": ["PosString_0", "PosString_1"],
        "jump_s": ["PosString_2", "PosString_3"], // 跳跃暂时只考虑终点
        "showBgFgMap_s": ["EvalString_0", "EvalString_1", "IdString_0"],
        "hideBgFgMap_s": ["EvalString_0", "EvalString_1", "IdString_0"],
        "setBgFgBlock_s": ["EvalString_1", "EvalString_2", "IdString_0"],
        "showFloorImg_s": ["EvalString_0", "EvalString_1", "IdString_0"],
        "hideFloorImg_s": ["EvalString_0", "EvalString_1", "IdString_0"],
        "trigger_s": ["PosString_0", "PosString_1"],
        "insert_2_s": ["PosString_0", "PosString_1", "IdString_0"],
        "animate_s": ["EvalString_0", "EvalString_0"],
        "setViewport_s": ["PosString_0", "PosString_1"]
    }

    editor_blockly.selectPoint = function () {
        var block = Blockly.selected, arr = null;
        var floorId = editor.currentFloorId, pos = editor.pos, x = pos.x, y = pos.y;
        if (block != null && block.type in selectPointBlocks) {
            arr = selectPointBlocks[block.type];
            var xv = parseInt(block.getFieldValue(arr[0])), yv = parseInt(block.getFieldValue(arr[1]));
            if (block.type == 'animate_s') {
                var v = block.getFieldValue(arr[0]).split(",");
                xv = parseInt(v[0]); yv = parseInt(v[1]);
            }
            if (!isNaN(xv)) x = xv;
            if (!isNaN(yv)) y = yv;
            if (arr[2] != null) floorId = block.getFieldValue(arr[2]) || floorId;
        }
        editor.uievent.selectPoint(floorId, x, y, arr && arr[2] == null, function (fv, xv, yv) {
            if (!arr) return;
            if (arr[2] != null) {
                if (fv != editor.currentFloorId) block.setFieldValue(fv, arr[2]);
                else block.setFieldValue(arr[3] ? fv : "", arr[2]);
            }
            if (block.type == 'animate_s') {
                block.setFieldValue(xv+","+yv, arr[0]);
            }
            else {
                block.setFieldValue(xv+"", arr[0]);
                block.setFieldValue(yv+"", arr[1]);
            }
            if (block.type == 'changeFloor_m' || block.type == 'changeFloor_s') {
                block.setFieldValue("floorId", "Floor_List_0");
                block.setFieldValue("loc", "Stair_List_0");
            }
        });
    }

    editor_blockly.getAutoCompletions = function (content, type, name) {
        // --- content为当前框中输入内容；将返回一个列表，为后续所有可补全内容

        // console.log(type, name);

        // 检查 status:xxx，item:xxx和flag:xxx
        var index = Math.max(content.lastIndexOf(":"), content.lastIndexOf("："));
        if (index >= 0) {
            var ch = content.charAt(index);
            var before = content.substring(0, index), token = content.substring(index+1);
            if (/^[a-zA-Z0-9_\u4E00-\u9FCC]*$/.test(token)) {
                if (before.endsWith("状态") || (ch == ':' && before.endsWith("status"))) {
                    var list = Object.keys(core.status.hero);
                    if (before.endsWith("状态") && MotaActionFunctions) {
                        list = MotaActionFunctions.pattern.replaceStatusList.map(function (v) {
                            return v[1];
                        }).concat(list);
                    }
                    return list.filter(function (one) {
                        return one != token && one.startsWith(token);
                    }).sort();
                }
                else if (before.endsWith("物品") || (ch == ':' && before.endsWith("item"))) {
                    var list = Object.keys(core.material.items);
                    if (before.endsWith("物品") && MotaActionFunctions) {
                        list = MotaActionFunctions.pattern.replaceItemList.map(function (v) {
                            return v[1];
                        }).concat(list);
                    }
                    return list.filter(function (one) {
                        return one != token && one.startsWith(token);
                    }).sort();
                }
                else if (before.endsWith("变量") || (ch == ':' && before.endsWith("flag"))) {
                    return Object.keys(editor.used_flags || {}).filter(function (one) {
                        return one != token && one.startsWith(token);
                    }).sort();
                } else if (before.endsWith("怪物") || (ch == ':' && before.endsWith("enemy"))) {
                    return Object.keys(core.material.enemys).filter(function (one) {
                        return one != token && one.startsWith(token);
                    })
                } else {
                    var index2 = Math.max(content.lastIndexOf(":", index-1), content.lastIndexOf("：", index-1));
                    var ch2 = content.charAt(index2);
                    if (index2 >= 0) {
                        before = content.substring(0, index2);
                        if (before.endsWith("怪物") || (ch == ':' && ch2 == ':' && before.endsWith("enemy"))) {
                            var list = ["name", "hp", "atk", "def", "money", "exp", "point", "special"];
                            if (before.endsWith("怪物") && MotaActionFunctions) {
                                list = MotaActionFunctions.pattern.replaceEnemyList.map(function (v) {
                                    return v[1];
                                }).concat(list);
                            }
                            return list.filter(function (one) {
                                return one != token && one.startsWith(token);
                            })
                        }
                    }

                }
            }
        }

        // 提供 core.xxx 的补全
        index = content.lastIndexOf("core.");
        if (index >= 0) {
            var s = content.substring(index + 5);
            if (/^[\w.]*$/.test(s)) {
                var tokens = s.split(".");
                var now = core, prefix = tokens[tokens.length - 1];
                for (var i = 0; i < tokens.length - 1; ++i) {
                    now = now[tokens[i]];
                    if (now == null) break;
                }
                if (now != null) {
                    var candidates = [];
                    for (var i in now) {
                        candidates.push(i);
                    }
                    return candidates.filter(function (one) {
                        return one != prefix && one.startsWith(prefix);
                    }).sort();
                }
            }
        }

        // 提供 flags.xxx 补全
        index = content.lastIndexOf("flags.");
        if (index >= 0) {
            var token = content.substring(index+6);
            return Object.keys(editor.used_flags || {}).filter(function (one) {
                return one != token && one.startsWith(token)
                    && /^[a-zA-Z_]\w*$/.test(one);
            }).sort();
        }

        var allIds = core.getAllIconIds();
        var allIconIds = allIds.concat(Object.keys(core.statusBar.icons).filter(function (x) {
          return core.statusBar.icons[x] instanceof Image;
        }));
        var allImages = Object.keys(core.material.images.images);
        var allEnemys = Object.keys(core.material.enemys);
        var allItems = Object.keys(core.material.items);
        var allAnimates = Object.keys(core.material.animates);
        var allBgms = Object.keys(core.material.bgms);
        var allSounds = Object.keys(core.material.sounds);
        var allShops = Object.keys(core.status.shops);
        var allFloorIds = core.floorIds;
        var allColors = ["aqua（青色）", "black（黑色）", "blue（蓝色）", "fuchsia（品红色）", "gray（灰色）", "green（深绿色）", "lime（绿色）",
                         "maroon（深红色）", "navy（深蓝色）", "gold（金色）",  "olive（黄褐色）", "orange（橙色）", "purple（品红色）", 
                         "red（红色）", "silver（淡灰色）", "teal（深青色）", "white（白色）", "yellow（黄色）"];
        var filter = function (list, content) {
          return list.filter(function (one) {
            return one != content && one.startsWith(content);
          }).sort();
        }

        // 对任意图块提供补全
        if ((type == 'text_1_s' && name == 'EvalString_1') || (type == 'autoText_s' && name == 'EvalString_1')
          || (type == 'choices_s' && name == 'IdString_0') || (type == 'choicesContext' && name == 'IdString_0')
          || (type == 'closeDoor_s' && name == 'IdString_0') || (type == 'setBlock_s' && name == 'EvalString_0')
          || (type == 'setBgFgBlock_s' && name == 'EvalString_0') || (type == 'drawIcon_s' && name == 'IdString_0')
          || (type == 'shopsub' && name == 'IdString_1') || (type == 'shopChoices' && name == 'IdString_0')
          || type == 'faceIds_m') {
          return filter(allIds, content);
        }

        // 对怪物ID提供补全
        if ((type == 'enemyattr_e' || type == 'battle_s' || type == 'setEnemy_s') && name == 'IdString_0') {
          return filter(allEnemys, content);
        }

        // 对道具ID进行补全
        if ((type == 'useItem_s' || type == 'loadEquip_s' || type == 'doorKeyUnknown') && name == 'IdString_0') {
          return filter(allItems, content);
        }

        // 对图片名进行补全
        if ((type == 'showImage_s' || type == 'showImage_1_s' || type == 'showGif_s' || type == 'setHeroIcon_s'
          || type == 'follow_s' || type == 'unfollow_s' || type == 'drawImage_s' || type == 'drawImage_1_s'
          || type == 'floorOneImage') && name == 'EvalString_0') {
          return filter(allImages, content);
        }

        // 对动画进行补全
        if ((type == 'animate_s' && name == 'IdString_0') || (type == 'equip_m' && name == 'IdString_0')) {
          return filter(allAnimates, content);
        }

        // 对音乐进行补全
        if ((type == 'playBgm_s' || type == 'loadBgm_s' || type == 'freeBgm_s') && name == 'EvalString_0') {
          return filter(allBgms, content);
        }

        // 对音效进行补全
        if (type == 'playSound_s' && name == 'EvalString_0') {
          return filter(allSounds, content);
        }

        // 对全局商店进行补全
        if ((type == 'openShop_s' || type == 'disableShop_s') && name == 'IdString_0') {
          return filter(allShops, content);
        }

        // 对楼层名进行补全
        if ((type == 'setFloor_s' || type == 'show_s' || type == 'hide_s' || type == 'insert_2_s'
          || type == 'setBlock_s' || type == 'turnBlock_s' || type == 'showFloorImg_s' || type == 'hideFloorImg_s'
          || type == 'showBgFgMap_s' || type == 'hideBgFgMap_s' || type == 'setBgFgBlock_s'
          || type == 'openDoor_s' || type == 'changeFloor_m') && name == "IdString_0") {
          return filter(allFloorIds, content);
        }

        // 对\f进行自动补全
        index = Math.max(content.lastIndexOf("\f["), content.lastIndexOf("\\f["));
        if (index >= 0) {
          if (content.charAt(index) == '\\') index++;
          var after = content.substring(index + 2);
          if (after.indexOf(",") < 0 && after.indexOf("]") < 0) {
            return filter(allImages, after);
          }
        }

        // 对\\i进行补全
        index = content.lastIndexOf("\\i[");
        if (index >= 0) {
          var after = content.substring(index + 3);
          if (after.indexOf("]") < 0) {
            return filter(allIconIds, after);
          }
        }

        // 对\r进行补全
        index = Math.max(content.lastIndexOf("\r["), content.lastIndexOf("\\r["));
        if (index >= 0) {
          if (content.charAt(index) == '\\') index++;
          var after = content.substring(index + 2);
          if (after.indexOf("]") < 0) {
            return filter(allColors, after);
          }
        }

        // 对\进行补全！
        if (content.charAt(content.length - 1) == '\\') {
          return ["n（换行）", "f（立绘）", "r（变色）", "i（图标）", "z（暂停打字）", "t（标题图标）", "b（对话框）", "c（字体大小）", "d（粗体）", "e（斜体）"];
        }

        return [];
    }

    editor_blockly.completeItems = [];
    return editor_blockly;
}

// --- modify Blockly

Blockly.FieldColour.prototype.createWidget_ = function() {
    Blockly.WidgetDiv.hide();

    // console.log('here')
    var self=this;
    var pb=self.sourceBlock_
    var args = MotaActionBlocks[pb.type].args
    var targetf=args[args.indexOf(self.name)-1]

    var getValue=function(){
        // return self.getValue() // css颜色
        var f = pb.getFieldValue(targetf);
        if (/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d),(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d),(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(,0(\.\d+)?|,1)?$/.test(f)) {
            return f;
        }
        return "";
        // 也可以用 pb.getFieldValue(targetf) 获得颜色块左边的域的内容
    }

    var setValue=function(newValue){ // css颜色
        self.setValue(newValue)
        var c=new Colors();
        c.setColor(newValue)
        var rgbatext = [c.colors.webSmart.r,c.colors.webSmart.g,c.colors.webSmart.b,c.colors.alpha].join(",");
        pb.setFieldValue(rgbatext, targetf) // 放在颜色块左边的域中
    }

    setTimeout(function () {
        document.getElementById("colorPicker").value = getValue();
        // 设置位置
        openColorPicker(Blockly.WidgetDiv.DIV.style.left, Blockly.WidgetDiv.DIV.style.top, setValue);
    });

    return document.createElement('table');
};

Blockly.FieldTextInput.prototype.showInlineEditor_ = function(quietInput) {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_());
    var div = Blockly.WidgetDiv.DIV;
    // Create the input.
    var htmlInput =
        goog.dom.createDom(goog.dom.TagName.INPUT, 'blocklyHtmlInput');
    htmlInput.setAttribute('spellcheck', this.spellcheck_);
    var fontSize =
        (Blockly.FieldTextInput.FONTSIZE * this.workspace_.scale) + 'pt';
    div.style.fontSize = fontSize;
    htmlInput.style.fontSize = fontSize;

    Blockly.FieldTextInput.htmlInput_ = htmlInput;
    div.appendChild(htmlInput);

    htmlInput.value = htmlInput.defaultValue = this.text_;
    htmlInput.oldValue_ = null;

    // console.log('here')
    var self=this;
    var pb=self.sourceBlock_
    var args = MotaActionBlocks[pb.type].args
    var targetf=args[args.indexOf(self.name)+1]

    // ------ colour

    if(targetf && targetf.slice(0,7)==='Colour_'){
        var inputDom = htmlInput;
        // var getValue=function(){ // 获得自己的字符串
        //     return pb.getFieldValue(self.name);
        // }
        var setValue = function(newValue){ // 设置右边颜色块的css颜色
            pb.setFieldValue(newValue, targetf)
        }
        // 给inputDom绑事件
        inputDom.oninput=function(){
            var value=inputDom.value
            if(/[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?/.test(value)){
                setValue('rgba('+value+')')
            }
        }
    }
    else {

        htmlInput.onkeydown = function (e) {
            if (e.keyCode == 13 && awesomplete.opened && awesomplete.selected) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                awesomplete.select();
                return false;
            }
        }

        // --- awesomplete
        var awesomplete = new Awesomplete(htmlInput, {
            minChars: 1,
            maxItems: 12,
            autoFirst: true,
            replace: function (text) {
                text = text.toString();
                var index = text.indexOf("（");
                if (index >= 0) text = text.substring(0, index);
                var value = this.input.value, index = this.input.selectionEnd;
                if (index == null) index = value.length;
                if (index < awesomplete.prefix.length) index = awesomplete.prefix.length;
                var str = value.substring(0, index - awesomplete.prefix.length) + text + value.substring(index);
                this.input.value = str;
                pb.setFieldValue(str, self.name);
                index += text.length - awesomplete.prefix.length;
                this.input.setSelectionRange(index, index);

                editor_blockly.completeItems = editor_blockly.completeItems.filter(function (x) {
                    return x != text;
                });
                editor_blockly.completeItems.unshift(text);
            },
            filter: function () {return true;},
            item: function (text, input) {
                var li = document.createElement("li");
                li.setAttribute("role", "option");
                li.setAttribute("aria-selected", "false");
                input = awesomplete.prefix.trim();
                if (input != "") text = text.replace(new RegExp("^"+input, "i"), "<mark>$&</mark>");
                li.innerHTML = text;
                return li;
            },
            sort: function (a, b) {
                a = a.toString(); b = b.toString();
                var ia = editor_blockly.completeItems.indexOf(a), ib = editor_blockly.completeItems.indexOf(b);
                if (ia < 0) ia = editor_blockly.completeItems.length;
                if (ib < 0) ib = editor_blockly.completeItems.length;
                if (ia != ib) return ia - ib;
                if (a.length != b.length) return a.length - b.length;
                return a < b ? -1 : 1;
            }
        });

        htmlInput.oninput = function () {
            var value = htmlInput.value, index = htmlInput.selectionEnd;
            if (index == null) index = value.length;
            value = value.substring(0, index);
            // cal prefix
            awesomplete.prefix = value;
            for (var i = index - 1; i>=0; i--) {
                var c = value.charAt(i);
                if (!/^[a-zA-Z0-9_\u4E00-\u9FCC]$/.test(c)) {
                    awesomplete.prefix = value.substring(i+1);
                    break;
                }
            }

            var list = editor_blockly.getAutoCompletions(value, pb.type, self.name);

            awesomplete.list = list;
            awesomplete.ul.style.marginLeft = getCaretCoordinates(htmlInput, htmlInput.selectionStart).left -
                htmlInput.scrollLeft - 20 + "px";
            awesomplete.evaluate();
        }

        awesomplete.container.style.width = "100%";

        window.awesomplete = awesomplete;
    }

    if (!quietInput) {
        htmlInput.focus();
        htmlInput.select();
    }
    this.validate_();
    this.resizeEditor_();

    this.bindEvents_(htmlInput);
};