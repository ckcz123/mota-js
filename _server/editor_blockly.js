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
            }).replace(/\\(r|f|i|c|d|e|g|z)/g,'\\\\$1')),
            editor_blockly.isCommonEntry() ? 'common' : editor_blockly.entryType
        );
    }

    editor_blockly.id = '';

    var _lastOpenPosition = {};

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
        var _offsetIndex = [editor_blockly.entryType, editor.pos.x, editor.pos.y, editor.currentFloorId].join(":");
        editor_blockly.workspace.scroll(0, _lastOpenPosition[_offsetIndex] || 0)
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
      if (shouldHighLight) blocklyParseBtn.classList.add('highlight');
      else blocklyParseBtn.classList.remove('highlight');
    }

    editor_blockly.cancel = function () {
        var _offsetIndex = [editor_blockly.entryType, editor.pos.x, editor.pos.y, editor.currentFloorId].join(":");
        _lastOpenPosition[_offsetIndex] = editor_blockly.workspace.scrollY;

        editor_blockly.id = '';
        editor_blockly.hide();
    }

    editor_blockly.confirm = function (keep) {
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
          if(blockType!==eventType+'_m' && !(editor_blockly.isCommonEntry() && blockType == 'common_m')){
            editor_blockly.setValue('入口方块类型错误');
            return;
          }
        }
        var setvalue = function (value) {
            var thisTr = document.getElementById(editor_blockly.id);
            var input = thisTr.children[2].children[0].children[0];
            input.value = value;
            if (!keep) {
                editor_blockly.id = '';
                editor_blockly.hide();
            }
            else alert('保存成功！');
            input.onchange();
        }
        if (codeAreaHL.getValue() === '') {
            eventType==='shop'?setvalue('[]'):setvalue('null');
            return;
        }
        var code = Blockly.JavaScript.workspaceToCode(editor_blockly.workspace);
        code = code.replace(/\\(i|c|d|e|g|z)/g, '\\\\$1');
        eval('var obj=' + code);
        if (this.checkAsync(obj) && confirm("警告！存在不等待执行完毕的事件但却没有用【等待所有异步事件处理完毕】来等待" +
            "它们执行完毕，这样可能会导致录像检测系统出问题。\n你要返回修改么？")) return;

        var _offsetIndex = [editor_blockly.entryType, editor.pos.x, editor.pos.y, editor.currentFloorId].join(":");
        _lastOpenPosition[_offsetIndex] = editor_blockly.workspace.scrollY;
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
            if (one.type == 'confirm' && (this.checkAsync(one.yes) || this.checkAsync(one.no)))
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
            if (one.type == 'wait') {
                var list = one.data;
                if (list instanceof Array) {
                    for (var j = 0; j < list.length; j++) {
                        if (this.checkAsync(list[j].action)) return true;
                    }
                }
            }
            if (one.type == 'previewUI' && this.checkAsync(one.action)) return true; 
            if (one.async && one.type != 'animate' && one.type != 'function' && one.type != 'text') hasAsync = true;
            if (one.type == 'waitAsync' || one.type == 'stopAsync') hasAsync = false;
        }
        return hasAsync;
    }

    var _isTextAttributeSet = false;

    editor_blockly.previewBlock = function (b,args) {

        var previewTextDrawing = function (content) {
            var arr = [];
            content.replace(/(\f|\\f)\[(.*?)]/g, function (text, sympol, str) {        
                var list = str.split(",");
                if (list.length == 3 || list.length == 5 || list.length >= 9) {
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
                }
                return "";
            });
            editor.uievent.previewUI(arr);
            return true;
        }

        try {
            // 特殊处理立绘
            if (b.type == 'textDrawing') {
                previewTextDrawing(Blockly.JavaScript.blockToCode(b));
                return true;
            }

            var code = "[" + Blockly.JavaScript.blockToCode(b).replace(/\\(i|c|d|e|g|z)/g, '\\\\$1') + "]";
            eval("var obj="+code);
            if (obj.length == 0) return true;
            obj = obj[0];
            switch (b.type) {
            case 'text_0_s':
            case 'text_1_s':
            case 'text_2_s':
            case 'choices_s':
            case 'confirm_s':
                if (!_isTextAttributeSet) {
                    alert('警告！你尚未设置用于预览的剧情文本的属性，将采用默认属性进行预览。\n你可以双击“设置剧情文本的属性”事件来设置用于预览的属性。');
                    core.status.textAttribute = core.clone(core.initStatus.textAttribute);
                    _isTextAttributeSet = true;
                }
                editor.uievent.previewUI([obj]);
                break;
            case 'setText_s': // 设置剧情文本的属性
                _isTextAttributeSet = true;
                core.status.textAttribute = core.clone(core.initStatus.textAttribute);
                core.setTextAttribute(obj);
                alert('已成功设置此属性为显示文章的预览属性！')
                break;
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
        var value = b.getFieldValue(material[1]);
        value = main.nameMap[value] || value;
        editor.uievent.selectMaterial([value], '请选择素材', material[0], function (one) {
            if (b.type == 'animate_s' || b.type == 'animate_1_s' || b.type == 'nameMapAnimate') {
                return /^[-A-Za-z0-9_.]+\.animate$/.test(one) ? one.substring(0, one.length - 8) : null;
            }
            return /^[-A-Za-z0-9_.]+$/.test(one) ? one : null;
        }, function (value) {
            if (value instanceof Array && value.length > 0) {
                value = value[0];
                // 检测是否别名替换
                for (var name in main.nameMap) {
                    if (main.nameMap[name] == value) {
                        if (confirm("检测到该文件存在别名："+name+"\n是否使用别名进行替换？")) {
                            b.setFieldValue(name, material[1]);
                            return;
                        } else {
                            break;
                        }
                    }
                }
                b.setFieldValue(value, material[1]);
            }
        });
    }

    editor_blockly.doubleclicktext = function(b,f){
        var value = b.getFieldValue(f);
        //多行编辑
        editor_multi.multiLineEdit(value, b, f, {'lint': f === 'RawEvalString_0'}, function (newvalue, b, f) {
            if (!f.startsWith('EvalString_Multi')) {
                newvalue = newvalue.split('\n').join('\\n');
            }
            b.setFieldValue(newvalue, f);
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

    editor_blockly.selectPointFromButton = function () {
        var b = Blockly.selected;
        if (b && MotaActionBlocks[b.type].selectPoint) {
            editor_blockly.selectPoint(b,eval(MotaActionBlocks[b.type].selectPoint));
            return;
        } else {
            editor.uievent.selectPoint();
        }
    }

    editor_blockly.showKeyCodes = function () {
        alert('键值查询表：\nA65 B66 C67 D68 E69 F70 G71 H72 I73 J74 K75 L76 M77\n'
            +'N78 O79 P80 Q81 R82 S83 T84 U85 V86 W87 X88 Y89 Z90\n0:48 1:49 2:50 3:51 4:52 5:53 6:54 7:55 8:56 9:57\n'
            +'空格:13 回车:32 ESC:27 后退:8 Tab:9 Shift:16 Ctrl:17 Alt:18\nPgUp:33 PgDn:34 左:37 上:38 右:39 下:40\n更多键值请自行百度查表')
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
        editor_blockly.workspace.getFlyout().show(editor_blockly.workspace.toolbox_.tree_.children_[index].blocks);
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

        var xv = block.getFieldValue(arr[0]), yv = block.getFieldValue(arr[1]);
        if (xv != null) x = xv;
        if (yv != null) y = yv;
        if (arr[2] != null) floorId = block.getFieldValue(arr[2]) || floorId;

        editor.uievent.selectPoint(floorId, x, y, false, function (fv, xv, yv) {
            if (!arr) return;
            if (arr[2] != null) {
                if (fv != editor.currentFloorId || editor_blockly.entryType == 'commonEvent') block.setFieldValue(fv, arr[2]);
                else block.setFieldValue(arr[3] ? fv : "", arr[2]);
            }
            block.setFieldValue(xv+"", arr[0]);
            block.setFieldValue(yv+"", arr[1]);
            if (block.type == 'changeFloor_m' || block.type == 'changeFloor_s') {
                block.setFieldValue("floorId", "Floor_List_0");
                block.setFieldValue("loc", "Stair_List_0");
            }
        });
    }

    editor_blockly.getAutoCompletions = function (content, type, name, pb) {
        // --- content为当前框中输入内容；将返回一个列表，为后续所有可补全内容

        // console.log(type, name);

        // 检查 status:xxx，item:xxx和flag:xxx
        var index = Math.max(content.lastIndexOf(":"), content.lastIndexOf("："));
        if (index >= 0) {
            var ch = content.charAt(index);
            var before = content.substring(0, index), token = content.substring(index+1);
            if (/^[a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]*$/.test(token)) {
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

        // 提供 IdText_0 的补全
        if (type == 'idIdList_e' && name == 'IdText_0') {
            var list = [];
            switch (pb.getFieldValue('Id_List_0')) {
                case 'status':
                    list = Object.keys(core.status.hero);
                    if (MotaActionFunctions && replaceCheckbox.checked) {
                        list = MotaActionFunctions.pattern.replaceStatusList.map(function (v) {
                            return v[1];
                        }).concat(list);
                    }
                    break;
                case 'item':
                    list = Object.keys(core.material.items);
                    if (MotaActionFunctions && replaceCheckbox.checked) {
                        list = MotaActionFunctions.pattern.replaceItemList.map(function (v) {
                            return v[1];
                        }).concat(list);
                    }
                    break;
                case 'flag':
                    list = Object.keys(editor.used_flags || {});
                    break;
            }
            return list.filter(function (one) {
                return one != content && one.startsWith(content);
            }).sort();
        }

        var namesObj={};

        namesObj.allIds = ["this"].concat(core.getAllIconIds());
        namesObj.allIconIds = namesObj.allIds.concat(Object.keys(core.statusBar.icons).filter(function (x) {
          return core.statusBar.icons[x] instanceof Image;
        }));
        namesObj.allImages = Object.keys(core.material.images.images)
            .concat(Object.keys(main.nameMap).filter(function (one) {return core.material.images.images[main.nameMap[one]];}));
        namesObj.allEnemys = Object.keys(core.material.enemys);
        if (MotaActionFunctions && !MotaActionFunctions.disableReplace) {
            namesObj.allEnemys = namesObj.allEnemys.concat(MotaActionFunctions.pattern.replaceEnemyList.map(function (x) {
                return x[1];
            }))
        }
        namesObj.allItems = Object.keys(core.material.items);
        namesObj.allEquips = namesObj.allItems.filter(function (one) { return core.material.items[one].cls == 'equips' });
        if (MotaActionFunctions && !MotaActionFunctions.disableReplace) {
            namesObj.allItems = namesObj.allItems.concat(MotaActionFunctions.pattern.replaceItemList.map(function (x) {
                return x[1];
            }));
            namesObj.allEquips = namesObj.allEquips.concat(MotaActionFunctions.pattern.replaceItemList.filter(function (x) {
                return namesObj.allEquips.includes(x[0]);
            }).map(function (x) { return x[1]; }));
        }
        namesObj.allAnimates = Object.keys(core.material.animates)
            .concat(Object.keys(main.nameMap).filter(function (one) {return core.material.animates[main.nameMap[one]];}));
        namesObj.allBgms = Object.keys(core.material.bgms)
            .concat(Object.keys(main.nameMap).filter(function (one) {return core.material.bgms[main.nameMap[one]];}));
        namesObj.allSounds = Object.keys(core.material.sounds)
            .concat(Object.keys(main.nameMap).filter(function (one) {return core.material.sounds[main.nameMap[one]];}));;
        namesObj.allShops = Object.keys(core.status.shops);
        namesObj.allFloorIds = core.floorIds;
        namesObj.allColors = ["aqua（青色）", "black（黑色）", "blue（蓝色）", "fuchsia（品红色）", "gray（灰色）", "green（深绿色）", "lime（绿色）",
                         "maroon（深红色）", "navy（深蓝色）", "gold（金色）",  "olive（黄褐色）", "orange（橙色）", "purple（品红色）", 
                         "red（红色）", "silver（淡灰色）", "teal（深青色）", "white（白色）", "yellow（黄色）"];
        namesObj.allFonts = [main.styles.font].concat(main.fonts);
        namesObj.allDoors = ["this"].concat(Object.keys(maps_90f36752_8815_4be8_b32b_d7fad1d0542e)
            .map(function (key) { return maps_90f36752_8815_4be8_b32b_d7fad1d0542e[key]; })
            .filter(function (one) { return one.doorInfo != null; })
            .map(function (one) { return one.id; }));
        namesObj.allEvents = Object.keys(core.events.commonEvent);
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
        for(var ii=0,names;names=['allIds','allEnemys','allItems','allEquips','allImages','allAnimates','allBgms','allSounds','allShops','allFloorIds','allDoors','allEvents'][ii];ii++){
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

        // 对\g进行补全
        index = content.lastIndexOf("\\g[");
        if (index >= 0) {
          var after = content.substring(index + 3);
          if (after.indexOf("]") < 0) {
            return filter(namesObj.allFonts, after);
          }
        }

        // 对\进行补全！
        if (content.charAt(content.length - 1) == '\\') {
          return ["n（换行）", "f（立绘）", "r（变色）", "i（图标）", "z（暂停打字）", "t（标题图标）", "b（对话框）", "c（字体大小）", "d（粗体）", "e（斜体）", "g（字体）"];
        }

        return [];
    }

    editor_blockly.completeItems = [];

    editor_blockly.onTextFieldCreate = function (self, htmlInput) {
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
                    self.forceRerender();
                    self.resizeEditor_();
                    index += text.length - awesomplete.prefix.length;
                    this.input.setSelectionRange(index, index);

                    editor_blockly.completeItems = editor_blockly.completeItems.filter(function (x) {
                        return x != text;
                    });
                    editor_blockly.completeItems.unshift(text);
                },
                filter: function () {return true;},
                item: function (text, input) {
                    var id = text.label, info = core.getBlockInfo(id);
                    var li = document.createElement("li");
                    li.setAttribute("role", "option");
                    li.setAttribute("aria-selected", "false");
                    input = awesomplete.prefix.trim();
                    if (input != "") text = text.replace(new RegExp("^"+input, "i"), "<mark>$&</mark>");
                    li.innerHTML = text;
                    if (info) {
                        var height = (info.height || 32), width = 32;
                        var scale = 75;
                        height *= scale / 100;
                        width *= scale / 100;
                        var ctx = core.createCanvas('list_' + id, 0, 0, width, height),
                            canvas = ctx.canvas;
                        canvas.style.display = 'inline';
                        canvas.style.marginRight = '8px';
                        core.drawIcon(ctx, id, 0, 0, width, height);
                        canvas.style.position = '';
                        li.insertBefore(canvas, li.children[0]);
                    }
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
                    if (!/^[a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]$/.test(c)) {
                        awesomplete.prefix = value.substring(i+1);
                        break;
                    }
                }

                var list = editor_blockly.getAutoCompletions(value, pb.type, self.name, pb);

                awesomplete.list = list;
                var caretPosition = getCaretCoordinates(htmlInput, htmlInput.selectionStart);
                awesomplete.ul.style.marginLeft = caretPosition.left - htmlInput.scrollLeft - 20 + "px";
                var totalHeight = parseFloat(Blockly.WidgetDiv.DIV.style.height.replace('px', ''));
                awesomplete.ul.style.marginTop = caretPosition.top + caretPosition.height - totalHeight + 10 + 'px';
                awesomplete.evaluate();
            }

            awesomplete.container.style.width = "100%";

            window.awesomplete = awesomplete;
        }
    }

    editor_blockly.isBlockCollapsedSupported = function (block) {
        var supportedDisabledBlocks = [
            'text_0_s', 'text_1_s', 'text_2_s', 'if_s', 'if_1_s', 'confirm_s', 'switch_s', 'choices_s', 
            'for_s', 'forEach_s', 'while_s', 'dowhile_s', 'wait_s', 'previewUI_s',
            'waitContext_1', 'waitContext_2', 'waitContext_3', 'switchCase', 'choicesContext'
        ];
        return supportedDisabledBlocks.indexOf(block.type || "") >= 0;
    }

    return editor_blockly;
}

// --- modify Blockly

Blockly.FieldColour.prototype.showEditor_ = function() {
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
        pb.setFieldValue(newValue.replace("rgba(","").replace(")",""), targetf) // 放在颜色块左边的域中
    }

    setTimeout(function () {
        document.getElementById("colorPicker").value = getValue();
        // 设置位置
        var scaledBBox = self.getScaledBBox();
        openColorPicker(scaledBBox.left, scaledBBox.bottom, setValue);
    });

    return document.createElement('table');
};

Blockly.FieldColour.prototype.setValue = function (colour) {
    this.doValueUpdate_(colour);
}

Blockly.FieldColour.prototype.initView = function() {
    this.size_ = new Blockly.utils.Size(
        this.getConstants().FIELD_COLOUR_DEFAULT_WIDTH,
        this.getConstants().FIELD_COLOUR_DEFAULT_HEIGHT);
    if (!this.getConstants().FIELD_COLOUR_FULL_BLOCK) {
        this.createBorderRect_();
        this.borderRect_.style['fillOpacity'] = '1';
        this.borderRect_.classList.add('blocklyColourFieldRect');
    } else {
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
    }
};

Blockly.FieldTextInput.prototype.showInlineEditor_ = function(quietInput) {
    Blockly.WidgetDiv.show(
        this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
    this.htmlInput_ = this.widgetCreate_();
    this.isBeingEdited_ = true;

    editor_blockly.onTextFieldCreate(this, this.htmlInput_);
  
    if (!quietInput) {
      this.htmlInput_.focus({preventScroll:true});
      this.htmlInput_.select();
    }
};

Blockly.FieldTextInput.prototype.onHtmlInputKeyDown_ = function(e) {
    if (e.keyCode == Blockly.utils.KeyCodes.ENTER && !(window.awesomplete && window.awesomplete.opened)) {
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideWithoutAnimation();
    } else if (e.keyCode == Blockly.utils.KeyCodes.ESC) {
        this.htmlInput_.value = this.htmlInput_.defaultValue;
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideWithoutAnimation();
    } else if (e.keyCode == Blockly.utils.KeyCodes.TAB) {
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideWithoutAnimation();
        this.sourceBlock_.tab(this, !e.shiftKey);
        e.preventDefault();
    }
};

Blockly.FieldMultilineInput.prototype.showInlineEditor_ = function(quietInput) {
    Blockly.FieldMultilineInput.superClass_.showInlineEditor_.call(this, quietInput);
    // force to resize the input
    this.htmlInput_.style.height = Blockly.WidgetDiv.DIV.style.height;
};

Blockly.FieldMultilineInput.prototype.onHtmlInputChange_ = function(e) {
    Blockly.FieldMultilineInput.superClass_.onHtmlInputChange_.call(this, e);
    // force to resize the input
    this.htmlInput_.style.height = Blockly.WidgetDiv.DIV.style.height;
};

Blockly.copy_ = function(toCopy) {
    if (toCopy.isComment) {
        var xml = toCopy.toXmlWithXY();
    } else {
        var xml = Blockly.Xml.blockToDom(toCopy, true);
        // Copy only the selected block and internal blocks.
        Blockly.Xml.deleteNext(xml);
        // Encode start position in XML.
        var xy = toCopy.getRelativeToSurfaceXY();
        xml.setAttribute('x', toCopy.RTL ? -xy.x : xy.x);
        xml.setAttribute('oy', xy.y);
        xml.setAttribute('sy', toCopy.workspace.scrollY);
    }
    Blockly.clipboardXml_ = xml;
    Blockly.clipboardSource_ = toCopy.workspace;
    Blockly.clipboardTypeCounts_ = toCopy.isComment ? null :
        Blockly.utils.getBlockTypeCounts(toCopy, true);
};

/**
 * Paste the provided block onto the workspace.
 * @param {!Element} xmlBlock XML block element.
 */
Blockly.WorkspaceSvg.prototype.paste = function(xmlBlock) {
    if (!this.rendered || xmlBlock.getElementsByTagName('block').length >=
        this.remainingCapacity()) {
        return;
    }
    if (this.currentGesture_) {
        this.currentGesture_.cancel();  // Dragging while pasting?  No.
    }
    if (xmlBlock.tagName.toLowerCase() == 'comment') {
        this.pasteWorkspaceComment_(xmlBlock);
    } else {
        if (xmlBlock.hasAttribute('oy') && xmlBlock.hasAttribute('sy')) {
            xmlBlock.setAttribute('y', parseFloat(xmlBlock.getAttribute('oy')) + parseFloat(xmlBlock.getAttribute('sy')) - this.scrollY);
        }
        this.pasteBlock_(xmlBlock);
    }
};

// -- Support showing disabled blocks

Blockly.Generator.prototype.blockToCode = function(block, opt_thisOnly) {
    if (this.isInitialized === false) {
        console.warn(
            'Generator init was not called before blockToCode was called.');
    }
    if (!block) {
        return '';
    }
    if (!block.isEnabled() && !editor_blockly.isBlockCollapsedSupported(block)) {
        // Skip past this block if it is disabled.
        return opt_thisOnly ? '' : this.blockToCode(block.getNextBlock());
    }
    if (block.isInsertionMarker()) {
        // Skip past insertion markers.
        return opt_thisOnly ? '' : this.blockToCode(block.getChildren(false)[0]);
    }

    var func = this[block.type];
    if (typeof func != 'function') {
        throw Error('Language "' + this.name_ + '" does not know how to generate ' +
            'code for block type "' + block.type + '".');
    }
    // First argument to func.call is the value of 'this' in the generator.
    // Prior to 24 September 2013 'this' was the only way to access the block.
    // The current preferred method of accessing the block is through the second
    // argument to func.call, which becomes the first parameter to the generator.
    var code = func.call(block, block);
    if (Array.isArray(code)) {
        // Value blocks return tuples of code and operator order.
        if (!block.outputConnection) {
            throw TypeError('Expecting string from statement block: ' + block.type);
        }
        return [this.scrub_(block, code[0], opt_thisOnly), code[1]];
    } else if (typeof code == 'string') {
        if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
            code = this.injectId(this.STATEMENT_PREFIX, block) + code;
        }
        if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
            code = code + this.injectId(this.STATEMENT_SUFFIX, block);
        }
        return this.scrub_(block, code, opt_thisOnly);
    } else if (code === null) {
        // Block has handled code generation itself.
        return '';
    }
    throw SyntaxError('Invalid code generated: ' + code);
};

Blockly.BlockSvg.prototype.generateContextMenu = function() {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return null;
    }
    // Save the current block in a variable for use in closures.
    var block = this;
    var menuOptions = [];
  
    if (!this.isInFlyout) {
        // 删除
        if (this.isDeletable() && this.isMovable()) {
            menuOptions.push(Blockly.ContextMenu.blockDuplicateOption(block));
        }

        if (editor_blockly.isBlockCollapsedSupported(this)) {
            menuOptions.push({
                text: this.isCollapsed() ? Blockly.Msg['EXPAND_BLOCK'] : Blockly.Msg['COLLAPSE_BLOCK'],
                enabled: true,
                callback: function () { block.setCollapsed(!block.collapsed_); }
            });

            menuOptions.push({
                text: this.isEnabled() ? Blockly.Msg['DISABLE_BLOCK'] : Blockly.Msg['ENABLE_BLOCK'],
                enabled: !this.getInheritedDisabled(),
                callback: function() {
                    var group = Blockly.Events.getGroup();
                    if (!group) {
                        Blockly.Events.setGroup(true);
                    }
                    block.setEnabled(!block.isEnabled());
                    if (!group) {
                        Blockly.Events.setGroup(false);
                    }
                }
            });
        }
        if (this.isDeletable()) {
            menuOptions.push(Blockly.ContextMenu.blockDeleteOption(block));
        }
    }
  
    menuOptions.push(Blockly.ContextMenu.blockHelpOption(block));  
    if (this.customContextMenu) this.customContextMenu(menuOptions);
    return menuOptions;
};

Blockly.FieldDropdown.prototype.doClassValidation_ = function (opt_newValue) { 
    return opt_newValue;
}

Blockly.FieldDropdown.prototype.doValueUpdate_ = function (newValue) {
    Blockly.FieldDropdown.superClass_.doValueUpdate_.call(this, newValue);
    var options = this.getOptions(true);
    for (var i = 0, option; (option = options[i]); i++) {
        if (option[1] == this.value_) {
            this.selectedOption_ = option;
        }
    }
    if (this.selectedOption_[1] != this.value_) {
        options.push([this.value_, this.value_]);
        this.selectedOption_ = options[options.length - 1];
    }
};

Blockly.FieldMultilineInput.prototype.getDisplayText_ = function() {
    var value = this.value_;
    if (!value) return Blockly.Field.NBSP;
    var curr = '', text = '';
    for (var i = 0; i < value.length; ++i) {
        if (value[i] == '\n' || curr.length == this.maxDisplayLength) {
            text += curr.replace(/\s/g, Blockly.Field.NBSP) + '\n';
            curr = value[i] == '\n' ? '' : value[i];
        } else curr += value[i];
    }
    return text + curr;
};
