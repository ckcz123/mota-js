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
      blocklyParseBtn.style.background = shouldNotifyParse ? '#ffd700' : 'unset';
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

    editor_blockly.previewBlock = function (b,args) {

        try {
            // 特殊处理立绘
            if (b.type == 'textDrawing') {
                var str = Blockly.JavaScript.blockToCode(b);
                var list = str.substring(str.indexOf('[')+1, str.lastIndexOf(']')).split(",");
                if (list.length == 3 || list.length == 5 || list.length >= 9) {
                    var arr = [];
                    var name = list[0];
                    var obj = {"type": "drawImage"};
                    if (name.endsWith(":o") || name.endsWith(":x") || name.endsWith(":y")) {
                        obj.reverse = name.substring(name.length-2);
                        name = name.substring(0, name.length - 2);
                    }
                    obj.image = name;
                    obj.x = parseFloat(list[1]);
                    obj.y = parseFloat(list[2]);
                    if (list.length >= 5) {
                        obj.w = parseFloat(list[3]);
                        obj.h = parseFloat(list[4]);
                    }
                    if (list.length >= 9) {
                        obj.x1 = parseFloat(list[5]);
                        obj.y1 = parseFloat(list[6]);
                        obj.w1 = parseFloat(list[7]);
                        obj.h1 = parseFloat(list[8]);
                    }
                    if (list.length >= 10) {
                        arr.push({"type": "setAttribute", "alpha": parseFloat(list[9])});
                    }
                    if (list.length >= 11) {
                        obj.angle = parseFloat(list[10]);
                    }
                    arr.push(obj);
                    console.log(arr);
                    editor.uievent.previewUI(arr);
                }
                return true;
            }

            var code = "[" + Blockly.JavaScript.blockToCode(b).replace(/\\(i|c|d|e|z)/g, '\\\\$1') + "]";
            eval("var obj="+code);
            if (obj.length == 0) return true;
            obj = obj[0];
            switch (b.type) {
            case 'waitContext_2': // 等待用户操作坐标预览
                editor.uievent.previewUI([{"type": "fillRect", "x": obj.px[0], "y": obj.py[0],
                    "width": "(" + obj.px[1] + ")-(" + obj.px[0] + ")", "height": "(" + obj.py[1] + ")-(" + obj.py[0] + ")",
                    "style": "rgba(255,0,0,0.5)"}]);
                break;
            case 'showImage_s': // 显示图片
            case 'showImage_1_s':
                if (obj.sloc) {
                    editor.uievent.previewUI([
                        {type: "setAttribute", alpha: obj.opacity},
                        {type: "drawImage", image: obj.image, x: obj.sloc[0], y: obj.sloc[1], w: obj.sloc[2], h: obj.sloc[3],
                            x1: obj.loc[0], y1: obj.loc[1], w1: obj.loc[2], h1: obj.loc[3], reverse: obj.reverse}
                    ]);
                } else {
                    editor.uievent.previewUI([
                        {type: "setAttribute", alpha: obj.opacity},
                        {type: "drawImage", image: obj.image, x: obj.loc[0], y: obj.loc[1], w: obj.loc[2], h: obj.loc[3], reverse: obj.reverse}
                    ]);
                }
                break;
            case 'showGif_s': // 显示动图
                if (obj.name && obj.loc) {
                    editor.uievent.previewUI([{type: "drawImage", image: obj.name, x: obj.loc[0], y: obj.loc[1]}]);
                }
                break;
            case 'setCurtain_0_s': // 更改色调
                if (obj.color) {
                    editor.uievent.previewUI([{type: "fillRect", x: 0, y: 0, width: core.__PIXELS__, height: core.__PIXELS__, style: obj.color}]);
                }
                break;
            case 'floorOneImage': // 楼层贴图
                obj.w = obj.w / (obj.frame || 1);
                editor.uievent.previewUI([
                    {type: "drawImage", image: obj.name, x: obj.sx || 0, y: obj.sy || 0, w: obj.w, h: obj.h,
                        x1: obj.x, y1: obj.y, w1: obj.w, h1: obj.h, reverse: obj.reverse}
                ]);
                break;
            case 'previewUI_s': // 预览
                editor.uievent.previewUI(obj.action);
                break;
            default:
                if (b.type.startsWith(obj.type)) {
                    editor.uievent.previewUI([obj]);
                }
            }
        } catch (e) {main.log(e);}

    }

    editor_blockly.selectMaterial = function(b,material){
        editor.uievent.selectMaterial([b.getFieldValue(material[1])], '请选择素材', material[0], function (one) {
            if (b.type == 'animate_s') {
                return /^[-A-Za-z0-9_.]+\.animate$/.test(one) ? one.substring(0, one.length - 8) : null;
            }
            return /^[-A-Za-z0-9_.]+$/.test(one) ? one : null;
        }, function (value) {
            if (value instanceof Array && value.length > 0) {
                b.setFieldValue(value[0], material[1]);
            }
        });
    }

    editor_blockly.doubleclicktext = function(b,f){
        var value = b.getFieldValue(f);
        //多行编辑
        editor_multi.multiLineEdit(value, b, f, {'lint': f === 'RawEvalString_0'}, function (newvalue, b, f) {
            if (MotaActionBlocks[b.type].doubleclicktext !== 'RawEvalString_0') {
            }
            b.setFieldValue(newvalue.split('\n').join('\\n'), f);
        });
    }

    editor_blockly.doubleClickBlock = function (blockId) {
        var b = editor_blockly.workspace.getBlockById(blockId);

        if (b && MotaActionBlocks[b.type].previewBlock){
            editor_blockly.previewBlock(b,MotaActionBlocks[b.type].previewBlock)
            return;
        }

        if (b && MotaActionBlocks[b.type].selectPoint) { // selectPoint
            editor_blockly.selectPoint(b,eval(MotaActionBlocks[b.type].selectPoint));
            return;
        }

        if (b && MotaActionBlocks[b.type].material) {
            editor_blockly.selectMaterial(b,JSON.parse(MotaActionBlocks[b.type].material));
            return;
        }

        if (b && MotaActionBlocks[b.type].doubleclicktext) { //多行编辑
            editor_blockly.doubleclicktext(b,MotaActionBlocks[b.type].doubleclicktext);
            return;
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
    ]; // 最常用的15个事件
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

    editor_blockly.selectPoint = function (block,arr) {

        var floorId = editor.currentFloorId, pos = editor.pos, x = pos.x, y = pos.y;

        var xv = parseInt(block.getFieldValue(arr[0])), yv = parseInt(block.getFieldValue(arr[1]));
        if (arr[0] === arr[1]) {
            var v = block.getFieldValue(arr[0]).split(",");
            xv = parseInt(v[0]); yv = parseInt(v[1]);
        }
        if (!isNaN(xv)) x = xv;
        if (!isNaN(yv)) y = yv;
        if (arr[2] != null) floorId = block.getFieldValue(arr[2]) || floorId;

        editor.uievent.selectPoint(floorId, x, y, false, function (fv, xv, yv) {
            if (!arr) return;
            if (arr[2] != null) {
                if (fv != editor.currentFloorId) block.setFieldValue(fv, arr[2]);
                else block.setFieldValue(arr[3] ? fv : "", arr[2]);
            }
            if (arr[0] === arr[1]) {
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
                    var list = Object.keys(core.material.enemys);
                    if (before.endsWith("怪物") && MotaActionFunctions) {
                      list = MotaActionFunctions.pattern.replaceEnemyList.map(function (v) {
                          return v[1];
                      }).concat(list);
                    }
                    return list.filter(function (one) {
                        return one != token && one.startsWith(token);
                    })
                } else {
                    var index2 = Math.max(content.lastIndexOf(":", index-1), content.lastIndexOf("：", index-1));
                    var ch2 = content.charAt(index2);
                    if (index2 >= 0) {
                        before = content.substring(0, index2);
                        if (before.endsWith("怪物") || (ch == ':' && ch2 == ':' && before.endsWith("enemy"))) {
                            var list = MotaActionBlocks['EnemyId_List'].options.map(function(v){return v[1]});
                            if (before.endsWith("怪物") && MotaActionFunctions) {
                                list = MotaActionFunctions.pattern.replaceEnemyValueList.map(function (v) {
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

        // 提供 hero.xxx 补全
        index = content.lastIndexOf("hero.");
        if (index >= 0) {
            var token = content.substring(index+6);
            return Object.keys(core.status.hero).filter(function (one) {
                return one != token && one.startsWith(token);
            }).sort();
        }

        var namesObj={};

        namesObj.allIds = ["this"].concat(core.getAllIconIds());
        namesObj.allIconIds = namesObj.allIds.concat(Object.keys(core.statusBar.icons).filter(function (x) {

          return core.statusBar.icons[x] instanceof Image;
        }));
        namesObj.allImages = Object.keys(core.material.images.images);
        namesObj.allEnemys = Object.keys(core.material.enemys);
        if (MotaActionFunctions && !MotaActionFunctions.disableReplace) {
            namesObj.allEnemys = namesObj.allEnemys.concat(MotaActionFunctions.pattern.replaceEnemyList.map(function (x) {
            return x[1];
          }))
        }
        namesObj.allItems = Object.keys(core.material.items);
        if (MotaActionFunctions && !MotaActionFunctions.disableReplace) {
            namesObj.allItems = namesObj.allItems.concat(MotaActionFunctions.pattern.replaceItemList.map(function (x) {
            return x[1];
          }))
        }
        namesObj.allAnimates = Object.keys(core.material.animates);
        namesObj.allBgms = Object.keys(core.material.bgms);
        namesObj.allSounds = Object.keys(core.material.sounds);
        namesObj.allShops = Object.keys(core.status.shops);
        namesObj.allFloorIds = core.floorIds;
        namesObj.allColors = ["aqua（青色）", "black（黑色）", "blue（蓝色）", "fuchsia（品红色）", "gray（灰色）", "green（深绿色）", "lime（绿色）",
                         "maroon（深红色）", "navy（深蓝色）", "gold（金色）",  "olive（黄褐色）", "orange（橙色）", "purple（品红色）", 
                         "red（红色）", "silver（淡灰色）", "teal（深青色）", "white（白色）", "yellow（黄色）"];
        namesObj.allDoors = ["this"].concat(Object.keys(maps_90f36752_8815_4be8_b32b_d7fad1d0542e)
            .map(function (key) { return maps_90f36752_8815_4be8_b32b_d7fad1d0542e[key]; })
            .filter(function (one) { return one.doorInfo != null; })
            .map(function (one) { return one.id; }));
        var filter = function (list, content) {
          return list.filter(function (one) {
            return one != content && one.startsWith(content);
          }).sort();
        }

        // 对任意图块提供补全
        // 对怪物ID提供补全
        // 对道具ID进行补全
        // 对图片名进行补全
        // 对动画进行补全
        // 对音乐进行补全
        // 对音效进行补全
        // 对全局商店进行补全
        // 对楼层名进行补全
        for(var ii=0,names;names=['allIds','allEnemys','allItems','allImages','allAnimates','allBgms','allSounds','allShops','allFloorIds','allDoors'][ii];ii++){
            if (MotaActionBlocks[type][names] && eval(MotaActionBlocks[type][names]).indexOf(name)!==-1) {
                return filter(namesObj[names], content);
            }
        }

        // 对\f进行自动补全
        index = Math.max(content.lastIndexOf("\f["), content.lastIndexOf("\\f["));
        if (index >= 0) {
          if (content.charAt(index) == '\\') index++;
          var after = content.substring(index + 2);
          if (after.indexOf(",") < 0 && after.indexOf("]") < 0) {
            return filter(namesObj.allImages, after);
          }
        }

        // 对\\i进行补全
        index = content.lastIndexOf("\\i[");
        if (index >= 0) {
          var after = content.substring(index + 3);
          if (after.indexOf("]") < 0) {
            return filter(namesObj.allIconIds, after);
          }
        }

        // 对\r进行补全
        index = Math.max(content.lastIndexOf("\r["), content.lastIndexOf("\\r["));
        if (index >= 0) {
          if (content.charAt(index) == '\\') index++;
          var after = content.substring(index + 2);
          if (after.indexOf("]") < 0) {
            return filter(namesObj.allColors, after);
          }
        }

        // 对\进行补全！
        if (content.charAt(content.length - 1) == '\\') {
          return ["n（换行）", "f（立绘）", "r（变色）", "i（图标）", "z（暂停打字）", "t（标题图标）", "b（对话框）", "c（字体大小）", "d（粗体）", "e（斜体）"];
        }

        return [];
    }

    editor_blockly.completeItems = [];


    editor_blockly.setTheme=function (theme) {
        var blocklyAddtionStyleNode;
        blocklyAddtionStyleNode=document.getElementById('blocklyAddtionStyleNode_jxzdiv2v376fvcw7v')
        if (blocklyAddtionStyleNode==null) {
            blocklyAddtionStyleNode=document.createElement('style')
            blocklyAddtionStyleNode.setAttribute('id','blocklyAddtionStyleNode_jxzdiv2v376fvcw7v')
            document.head.appendChild(blocklyAddtionStyleNode)
            var updateColour = Blockly.BlockSvg.prototype.updateColour
            var setShadowColour_ = Blockly.BlockSvg.prototype.setShadowColour_
            var setBorderColour_ = Blockly.BlockSvg.prototype.setBorderColour_
        }
        
        if (theme==='light') {
            blocklyAddtionStyleNode.innerHTML=``
            Blockly.BlockSvg.prototype.updateColour=updateColour
            Blockly.BlockSvg.prototype.setShadowColour_=setShadowColour_
            Blockly.BlockSvg.prototype.setBorderColour_=setBorderColour_
        }
        if (theme=='dark') {

            // 改这个调整方块黑的程度 0~1, 越大越黑
            var globalScale=0.1

            blocklyAddtionStyleNode.innerHTML=`

            .blocklySvg {
                background-color: #000;
            }

            .blocklyNonEditableText>rect, .blocklyEditableText>rect {
                fill: #000;
                fill-opacity: .4;
            }

            .blocklyNonEditableText>text, .blocklyEditableText>text {
                fill: #fff;
            }

            input.blocklyHtmlInput {
                color: white;
                background-color: black;
            }
            `


            Blockly.BlockSvg.prototype.updateColour = function() {
                if (this.disabled) {
                    // Disabled blocks don't have colour.
                    return;
                }
                var hexColour = this.getColour();
                var colourSecondary = this.getColourSecondary();
                var colourTertiary = this.getColourTertiary();
                var rgb = goog.color.darken(goog.color.hexToRgb(hexColour),globalScale);
                hexColour = goog.color.rgbArrayToHex(rgb);

                if (this.isShadow()) {
                    hexColour = this.setShadowColour_(rgb, colourSecondary);
                } else {
                    this.setBorderColour_(rgb, colourTertiary);
                }
                this.svgPath_.setAttribute('fill', hexColour);

                var icons = this.getIcons();
                for (var i = 0; i < icons.length; i++) {
                    icons[i].updateColour();
                }

                // Bump every dropdown to change its colour.
                // TODO (#1456)
                for (var x = 0, input; input = this.inputList[x]; x++) {
                    for (var y = 0, field; field = input.fieldRow[y]; y++) {
                        field.forceRerender();
                    }
                }
            }
            ;

            Blockly.BlockSvg.prototype.setShadowColour_ = function(a, b) {
                if (b) {
                    this.svgPathLight_.style.display = "none";
                    this.svgPathDark_.style.display = "none";
                    this.svgPath_.setAttribute("fill", b);
                    var c = b
                } else
                    a = goog.color.darken(a, .4),
                    c = goog.color.rgbArrayToHex(a),
                    this.svgPathLight_.style.display = "none",
                    this.svgPathDark_.setAttribute("fill", c);
                return c
            }
            ;

            Blockly.BlockSvg.prototype.setBorderColour_ = function(a, b) {
                if (b)
                    this.svgPathLight_.setAttribute("stroke", "none"),
                    this.svgPathDark_.setAttribute("fill", "none"),
                    this.svgPath_.setAttribute("stroke", b);
                else {
                    this.svgPathLight_.style.display = "";
                    var c = goog.color.rgbArrayToHex(goog.color.darken(a, .2))
                    , d = goog.color.rgbArrayToHex(goog.color.lighten(a, .3));
                    this.svgPathLight_.setAttribute("stroke", c);
                    this.svgPathDark_.setAttribute("fill", d);
                    this.svgPath_.setAttribute("stroke", "none")
                }
            }
            ;

        }
    }

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
        if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(f)) {
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
        openColorPicker(Blockly.WidgetDiv.DIV.style.left.replace(/[^\d.]/g, ''), Blockly.WidgetDiv.DIV.style.top.replace(/[^\d.]/g, ''), setValue);
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
            if(/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(value)){
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