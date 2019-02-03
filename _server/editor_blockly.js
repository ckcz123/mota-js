editor_blockly = function () {

    var editor_blockly = {};

    initscript = String.raw`
(function(){
  var getCategory = function(name,custom){
    for(var node of document.getElementById('toolbox').children) {
      if(node.getAttribute('name')==name) return node;
    }
    var node = document.createElement('category');
    node.setAttribute('name',name);
    if(custom)node.setAttribute('custom',custom);
    document.getElementById('toolbox').appendChild(node);
    return node;
  }

  var toolboxObj = {
    '入口方块':[
      MotaActionFunctions.actionParser.parse([
        "欢迎使用事件编辑器",
        "本事件触发一次后会消失",
        {"type": "hide", "time": 500},
      ],'event'),
      MotaActionBlocks['changeFloor_m'].xmlText(),
      MotaActionFunctions.actionParser.parse([{
        "id": "moneyShop1",
        "name": "贪婪之神", 
        "icon": "blueShop",
        "textInList": "1F金币商店", 
        "use": "money",
        "need": "20+10*times*(times+1)",  
        "text": "勇敢的武士啊，给我\${need}金币就可以：", 
        "choices": [ 
          {"text": "生命+800", "effect": "status:hp+=800"},
          {"text": "攻击+4", "effect": "status:atk+=4"},
          {"text": "防御+4", "effect": "status:def+=4"},
          {"text": "魔防+10", "effect": "status:mdef+=10"}
        ]
      }],'shop'),
      MotaActionBlocks['afterBattle_m'].xmlText(),
      MotaActionBlocks['afterGetItem_m'].xmlText(),
      MotaActionBlocks['afterOpenDoor_m'].xmlText(),
      MotaActionBlocks['firstArrive_m'].xmlText(),
      MotaActionBlocks['eachArrive_m'].xmlText(),
      MotaActionBlocks['level_m'].xmlText(),
      MotaActionBlocks['commonEvent_m'].xmlText(),
    ],
    '显示文字':[
      MotaActionBlocks['text_0_s'].xmlText(),
      MotaActionBlocks['text_1_s'].xmlText(),
      MotaActionBlocks['comment_s'].xmlText(),
      MotaActionBlocks['autoText_s'].xmlText(),
      MotaActionBlocks['scrollText_s'].xmlText(),
      MotaActionBlocks['setText_s'].xmlText(),
      MotaActionBlocks['showImage_s'].xmlText(),
      MotaActionBlocks['hideImage_s'].xmlText(),
      MotaActionBlocks['showTextImage_s'].xmlText(),
      MotaActionBlocks['moveImage_s'].xmlText(),
      MotaActionBlocks['showGif_0_s'].xmlText(),
      MotaActionBlocks['showGif_1_s'].xmlText(),
      MotaActionBlocks['tip_s'].xmlText(),
      MotaActionBlocks['win_s'].xmlText(),
      MotaActionBlocks['lose_s'].xmlText(),
      MotaActionBlocks['choices_s'].xmlText([
        '选择剑或者盾','流浪者','man',MotaActionBlocks['choicesContext'].xmlText([
          '剑',MotaActionFunctions.actionParser.parseList([{"type": "openDoor", "loc": [3,3]}]),
          MotaActionBlocks['choicesContext'].xmlText([
            '盾',MotaActionFunctions.actionParser.parseList([{"type": "openDoor", "loc": [9,3]}]),
          ])
        ])
      ]),
    ],
    '数据相关':[
      MotaActionBlocks['setValue_s'].xmlText([
        MotaActionBlocks['idString_1_e'].xmlText(['status','hp'])
      ]),
      MotaActionBlocks['setFloor_s'].xmlText(),
      MotaActionBlocks['setGlobalAttribute_s'].xmlText(),
      MotaActionBlocks['setGlobalValue_s'].xmlText(),
      MotaActionBlocks['setGlobalFlag_s'].xmlText(),
      MotaActionBlocks['input_s'].xmlText(),
      MotaActionBlocks['input2_s'].xmlText(),
      MotaActionBlocks['update_s'].xmlText(),
      MotaActionBlocks['updateEnemys_s'].xmlText(),
      MotaActionBlocks['moveHero_s'].xmlText(),
      MotaActionBlocks['jumpHero_s'].xmlText(),
      MotaActionBlocks['changeFloor_s'].xmlText(),
      MotaActionBlocks['changePos_0_s'].xmlText(),
      MotaActionBlocks['changePos_1_s'].xmlText(),
      MotaActionBlocks['battle_s'].xmlText(),
      MotaActionBlocks['openDoor_s'].xmlText(),
      MotaActionBlocks['useItem_s'].xmlText(),
      MotaActionBlocks['openShop_s'].xmlText(),
      MotaActionBlocks['setBlock_s'].xmlText(),
      MotaActionBlocks['setHeroIcon_s'].xmlText(),
      MotaActionBlocks['follow_s'].xmlText(),
      MotaActionBlocks['unfollow_s'].xmlText(),
    ],
    '事件控制':[
      MotaActionBlocks['if_s'].xmlText(),
      MotaActionFunctions.actionParser.parseList({"type": "switch", "condition": "判别值", "caseList": [
        {"action": [{"type": "comment", "text": "当判别值是值的场合执行此事件"}]},
        {"action": []},
        {"case": "default", "action": [{"type": "comment", "text": "当没有符合的值的场合执行default事件"}]},
      ]}),
      MotaActionBlocks['while_s'].xmlText(),
      MotaActionBlocks['break_s'].xmlText(),
      MotaActionBlocks['continue_s'].xmlText(),
      MotaActionBlocks['revisit_s'].xmlText(),
      MotaActionBlocks['exit_s'].xmlText(),
      MotaActionBlocks['show_s'].xmlText(),
      MotaActionBlocks['hide_s'].xmlText(),
      MotaActionBlocks['showFloorImg_s'].xmlText(),
      MotaActionBlocks['hideFloorImg_s'].xmlText(),
      MotaActionBlocks['showBgFgMap_s'].xmlText(),
      MotaActionBlocks['hideBgFgMap_s'].xmlText(),
      MotaActionBlocks['setBgFgBlock_s'].xmlText(),
      MotaActionBlocks['trigger_s'].xmlText(),
      MotaActionBlocks['insert_1_s'].xmlText(),
      MotaActionBlocks['insert_2_s'].xmlText(),
      MotaActionBlocks['move_s'].xmlText(),
      MotaActionBlocks['jump_s'].xmlText(),
      MotaActionBlocks['disableShop_s'].xmlText(),
    ],
    '特效/声音':[
      MotaActionBlocks['sleep_s'].xmlText(),
      MotaActionBlocks['wait_s'].xmlText(),
      MotaActionBlocks['waitAsync_s'].xmlText(),
      MotaActionBlocks['vibrate_s'].xmlText(),
      MotaActionBlocks['animate_s'].xmlText(),
      MotaActionBlocks['showStatusBar_s'].xmlText(),
      MotaActionBlocks['hideStatusBar_s'].xmlText(),
      MotaActionBlocks['setFg_0_s'].xmlText(),
      MotaActionBlocks['setFg_1_s'].xmlText(),
      MotaActionBlocks['screenFlash_s'].xmlText(),
      MotaActionBlocks['setWeather_s'].xmlText(),
      MotaActionBlocks['playBgm_s'].xmlText(),
      MotaActionBlocks['pauseBgm_s'].xmlText(),
      // MotaActionBlocks['resumeBgm_s'].xmlText(),
      MotaActionBlocks['loadBgm_s'].xmlText(),
      MotaActionBlocks['freeBgm_s'].xmlText(),
      MotaActionBlocks['playSound_s'].xmlText(),
      MotaActionBlocks['stopSound_s'].xmlText(),
      MotaActionBlocks['setVolume_s'].xmlText(),
      MotaActionBlocks['callBook_s'].xmlText(),
      MotaActionBlocks['callSave_s'].xmlText(),
      MotaActionBlocks['callLoad_s'].xmlText(),
    ],
    '原生脚本':[
      MotaActionBlocks['function_s'].xmlText(),
    ],
    '值块':[
      MotaActionBlocks['setValue_s'].xmlText([
        MotaActionBlocks['idString_1_e'].xmlText(['status','hp'])
      ]),
      MotaActionBlocks['expression_arithmetic_0'].xmlText(),
      MotaActionBlocks['evFlag_e'].xmlText(),
      MotaActionBlocks['negate_e'].xmlText(),
      MotaActionBlocks['bool_e'].xmlText(),
      MotaActionBlocks['idString_e'].xmlText(),
      MotaActionBlocks['idString_1_e'].xmlText(),
      MotaActionBlocks['idString_2_e'].xmlText(),
      MotaActionBlocks['evalString_e'].xmlText(),
    ],
    '常见事件模板':[
      '<label text="检测音乐如果没有开启则系统提示开启"></label>',
      MotaActionFunctions.actionParser.parseList({"type": "if", "condition": "!core.musicStatus.bgmStatus",
        "true": [
          "\t[系统提示]你当前音乐处于关闭状态，本塔开音乐游戏效果更佳"
        ],
        "false": []
      }),
      '<label text="商店购买属性/钥匙"></label>',
      MotaActionFunctions.actionParser.parse([
        {"type": "choices", "text": "\t[老人,man]少年，你需要钥匙吗？\n我这里有大把的！",
        "choices": [
            {"text": "黄钥匙（\${9+flag:shop_times}金币）", "action": [
                {"type": "if", "condition": "status:money>=9+flag:shop_times",
                    "true": [
                        {"type": "setValue", "name": "status:money", "value": "status:money-(9+flag:shop_times)"},
                        {"type": "setValue", "name": "item:yellowKey", "value": "item:yellowKey+1"},
                    ],
                    "false": [
                        "\t[老人,man]你的金钱不足！",
                        {"type": "revisit"}
                    ]
                }
            ]},
            {"text": "蓝钥匙（\${18+2*flag:shop_times}金币）", "action": [
            ]},
            {"text": "离开", "action": [
                {"type": "exit"}
            ]}
        ]
    },
    {"type": "setValue", "name": "flag:shop_times", "value": "flag:shop_times+1"},
    {"type": "revisit"}
      ], 'event'),  
      '<label text="战前剧情"></label>',
      MotaActionFunctions.actionParser.parse({ 
        "trigger": "action", 
        "displayDamage": true, 
        "data": [ 
          ' ... 战前剧情',
          {"type": "battle", "id": "greenSlime"},
          ' ... 战后剧情；请注意上面的强制战斗不会使怪物消失',
          '需要下一句来调用{"type": "hide"}来隐藏事件',
          {"type": "hide"},
        ]
      },'event'),
      '<label text="打怪掉落道具"></label>',
      MotaActionFunctions.actionParser.parse([
        '怪物变成了黄钥匙(黄钥匙idnum是21)',
        '打怪变成可对话的NPC: https://ckcz123.github.io/mota-js/#/event?id=%e6%89%93%e6%80%aa%e5%8f%98%e6%88%90%e5%8f%af%e5%af%b9%e8%af%9d%e7%9a%84npc%ef%bc%88%e6%80%aa%e7%89%a9-gtnpc%ef%bc%89',
        {"type": "setBlock", "number": 21}
      ],'afterBattle'),
      '<label text="打怪开门"></label>',
      MotaActionFunctions.actionParser.parse([
        {"type": "setValue", "name": "flag:__door__", "value": "flag:__door__+1"},
        {"type": "if", "condition": "flag:__door__==2", 
          "true": [
            {"type": "openDoor", "loc": [10,5]}
          ],
          "false": [] 
        },
      ],'afterBattle'),
      '<label text="杀死魔龙后隐藏其余图块"></label>',
      MotaActionFunctions.actionParser.parse([
        {"type": "function", "function": "function(){var x=core.status.event.data.x,y=core.status.event.data.y;if(core.isset(x)&&core.isset(y)){core.insertAction([{type:'hide',loc:[[x-1,y-2],[x,y-2],[x+1,y-2],[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y]]}]);}}"},
      ],'afterBattle'),
      '<label text="获得圣水后变成墙"></label>',
      MotaActionFunctions.actionParser.parse({
        "trigger": "action", 
        "noPass": true, 
        "data": [
          {"type": "if", "condition": "flag:hasSuperPotion", 
            "true": [], 
            "false": [
              {"type":"setValue", "name":"status:hp", "value":"status:hp*2"}, 
              {"type":"setBlock", "number": 1}, 
              {"type":"setValue", "name":"flag:hasSuperPotion", "value": "true"} 
            ]
          }
        ]
      },'event'),
    ],
    '最近使用事件':[
      '<label text="此处只是占位符,实际定义在editor_blockly.searchBlockCategoryCallback中"></label>',
    ]
  }
  var toolboxgap = '<sep gap="5"></sep>'
  //xml_text = MotaActionFunctions.actionParser.parse(obj,type||'event')
  //MotaActionBlocks['idString_e'].xmlText()

  for (var name in toolboxObj){
    var custom = null;
    if(name=='最近使用事件')custom='searchBlockCategory';
    getCategory(name,custom).innerHTML = toolboxObj[name].join(toolboxgap);
  }

var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv,{
  media: '_server/blockly/media/',
  toolbox: document.getElementById('toolbox'),
  zoom:{
    controls: true,
    wheel: false,//滚轮改为上下(shift:左右)翻滚
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.08
  },
  trashcan: false,
});

editor_blockly.searchBlockCategoryCallback = function(workspace) {
  var xmlList = [];
  var labels = editor_blockly.searchBlock();
  for (var i = 0; i < labels.length; i++) {
    var blockText = '<xml>' +
        MotaActionBlocks[labels[i]].xmlText() +
        '</xml>';
    var block = Blockly.Xml.textToDom(blockText).firstChild;
    block.setAttribute("gap", 5);
    xmlList.push(block);
  }
  return xmlList;
};

workspace.registerToolboxCategoryCallback(
  'searchBlockCategory', editor_blockly.searchBlockCategoryCallback);
 
var onresize = function(e) {
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
  Blockly.svgResize(workspace);
};
if(typeof editor !== "undefined" && !editor.isMobile)window.addEventListener('resize', onresize, false);
onresize();
//Blockly.svgResize(workspace);

//Blockly.bindEventWithChecks_(workspace.svgGroup_,"wheel",workspace,function(e){});
document.getElementById('blocklyDiv').onmousewheel = function(e){
  //console.log(e);
  e.preventDefault();
  var hvScroll = e.shiftKey?'hScroll':'vScroll';
  workspace.scrollbar[hvScroll].handlePosition_+=( ((e.deltaY||0)+(e.detail||0)) >0?20:-20);
  workspace.scrollbar[hvScroll].onScroll_();
  workspace.setScale(workspace.scale);
}

var doubleClickCheck=[[0,'abc']];
function omitedcheckUpdateFunction(event) {
  if(event.type==='create'){
    editor_blockly.addIntoLastUsedType(event.blockId);
  }
  if(event.type==='ui'){
    var newClick = [new Date().getTime(),event.blockId];
    var lastClick = doubleClickCheck.shift();
    doubleClickCheck.push(newClick);
    if(newClick[0]-lastClick[0]<500){
      if(newClick[1]===lastClick[1]){
        editor_blockly.doubleClickBlock(newClick[1]);
      }
    }
  }
  if(editor_blockly.workspace.topBlocks_.length>=2){
    codeAreaHL.setValue('入口方块只能有一个');
    return;
  }
  var eventType = document.getElementById('entryType').value;
  if(editor_blockly.workspace.topBlocks_.length==1){
    var blockType = editor_blockly.workspace.topBlocks_[0].type;
    if(blockType!==eventType+'_m'){
      codeAreaHL.setValue('入口方块类型错误');
      return;
    }
  }
  try {
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    codeAreaHL.setValue(code);
  } catch (error) {
    codeAreaHL.setValue(String(error));
    if (error instanceof OmitedError){
    var blockName = error.blockName;
    var varName = error.varName;
    var block = error.block;
    }
    // console.log(error);
  }
  }

  workspace.addChangeListener(omitedcheckUpdateFunction);

  workspace.addChangeListener(Blockly.Events.disableOrphans);

  editor_blockly.workspace = workspace;

  MotaActionFunctions.workspace = function(){
    return editor_blockly.workspace;
  }

  // 因为在editor_blockly.parse里已经HTML转义过一次了,所以这里要覆盖掉以避免在注释中出现&lt;等
  MotaActionFunctions.xmlText = function (ruleName,inputs,isShadow,comment) {
    var rule = MotaActionBlocks[ruleName];
    var blocktext = isShadow?'shadow':'block';
    var xmlText = [];
    xmlText.push('<'+blocktext+' type="'+ruleName+'">');
    if(!inputs)inputs=[];
    for (var ii=0,inputType;inputType=rule.argsType[ii];ii++) {
      var input = inputs[ii];
      var _input = '';
      var noinput = (input===null || input===undefined);
      if(noinput && inputType==='field') continue;
      if(noinput) input = '';
      if(inputType!=='field') {
        var subList = false;
        var subrulename = rule.args[ii];
        subrulename=subrulename.split('_').slice(0,-1).join('_');
        var subrule = MotaActionBlocks[subrulename];
        if (subrule instanceof Array) {
          subrulename=subrule[subrule.length-1];
          subrule = MotaActionBlocks[subrulename];
          subList = true;
        }
        _input = subrule.xmlText([],true);
        if(noinput && !subList && !isShadow) {
          //无输入的默认行为是: 如果语句块的备选方块只有一个,直接代入方块
          input = subrule.xmlText();
        }
      }
      xmlText.push('<'+inputType+' name="'+rule.args[ii]+'">');
      xmlText.push(_input+input);
      xmlText.push('</'+inputType+'>');
    }
    if(comment){
      xmlText.push('<comment>');
      xmlText.push(comment);
      xmlText.push('</comment>');
    }
    var next = inputs[rule.args.length];
    if (next) {//next
      xmlText.push('<next>');
      xmlText.push(next);
      xmlText.push('</next>');
    }
    xmlText.push('</'+blocktext+'>');
    return xmlText.join('');
  }
})();
`;

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
        //var initscript = document.getElementById('initscript').innerText;
        script.innerHTML = converter.mainFile[5] + initscript;
        document.body.appendChild(script);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            alert("无法在file://下加载");
            return;
        }
        input_ = xhr.responseText;
        editor_blockly.runOne();
    }
    xhr.open('GET', '_server/blockly/MotaAction.g4', true);
    xhr.send(null);

    codeAreaHL = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
        lineNumbers: true,
        matchBrackets: true,
        lineWrapping: true,
        continueComments: "Enter",
        extraKeys: {"Ctrl-Q": "toggleComment"}
    });

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

    editor_blockly.parse = function () {
        MotaActionFunctions.parse(
            eval('obj=' + codeAreaHL.getValue().replace(/[<>&]/g, function (c) {
                return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c];
            }).replace(/\\r/g, '\\\\r').replace(/\\f/g, '\\\\f')),
            document.getElementById('entryType').value
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
        codeAreaHL.setValue(input.value);
        document.getElementById('entryType').value = type;
        editor_blockly.parse();
        editor_blockly.show();
        return true;
    }

    var blocklyWidgetDiv = document.getElementsByClassName('blocklyWidgetDiv');
    editor_blockly.show = function () {
        if (typeof(selectBox) !== typeof(undefined)) selectBox.isSelected = false;
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

    editor_blockly.cancel = function () {
        editor_blockly.id = '';
        editor_blockly.hide();
    }

    editor_blockly.confirm = function () {
        if (!editor_blockly.id) {
            editor_blockly.id = '';
            return;
        }
        if(editor_blockly.workspace.topBlocks_.length>=2){
          codeAreaHL.setValue('入口方块只能有一个');
          return;
        }
        var eventType = document.getElementById('entryType').value;
        if(editor_blockly.workspace.topBlocks_.length==1){
          var blockType = editor_blockly.workspace.topBlocks_[0].type;
          if(blockType!==eventType+'_m'){
            codeAreaHL.setValue('入口方块类型错误');
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
        eval('var obj=' + code);
        setvalue(JSON.stringify(obj));
    }

    editor_blockly.doubleClickBlock = function (blockId) {
        var b = editor_blockly.workspace.getBlockById(blockId);
        //console.log(b);
        var textStringDict = {
            'text_0_s': 'EvalString_0',
            'text_1_s': 'EvalString_2',
            'autoText_s': 'EvalString_2',
            'scrollText_s': 'EvalString_0',
            'comment_s': 'EvalString_0',
            'choices_s': 'EvalString_0',
            'showTextImage_s': 'EvalString_0',
            'function_s': 'RawEvalString_0',
            'shopsub': 'EvalString_3',
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
        'battle_s',
        'openDoor_s',
        'choices_s',
        'setText_s',
        'exit_s',
        'revisit_s',
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
        // var element = document.getElementById(':'+index);
        // if (element == null || element.getAttribute("aria-selected")=="true") return;
        // element.click();
        editor_blockly.workspace.toolbox_.tree_.setSelectedItem(editor_blockly.workspace.toolbox_.tree_.children_[index-1]);
    }
    editor_blockly.reopenToolbox = function(index) {
        // var element = document.getElementById(':'+index);
        // if (element == null) return;
        // if (element.getAttribute("aria-selected")=="true") element.click();
        // element.click();
        editor_blockly.workspace.toolbox_.tree_.setSelectedItem(editor_blockly.workspace.toolbox_.tree_.children_[index-1]);
        editor_blockly.workspace.getFlyout_().show(editor_blockly.workspace.toolbox_.tree_.children_[index-1].blocks);
    }

    editor_blockly.closeToolbox = function() {
        /*
        for (var i=1; i<=10; i++) {
            var element = document.getElementById(':'+i);
            if (element && element.getAttribute("aria-selected")=="true") {
                element.click();
                return;
            }
        }
        */
        editor_blockly.workspace.toolbox_.clearSelection();
    }

    var searchInput = document.getElementById("searchBlock");
    searchInput.onfocus = function () {
        editor_blockly.reopenToolbox(9);
    }

    searchInput.oninput = function () {
        editor_blockly.reopenToolbox(9);
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

    return editor_blockly;
}
//editor_blockly=editor_blockly();