editor_blockly = function(){

var editor_blockly = {};

initscript=String.raw`
(function(){
  var getCategory = function(name){
  for(var node of document.getElementById('toolbox').children) {
    if(node.getAttribute('name')==name) return node;
  }
  }

  var toolboxObj = {
    'entry':[
      MotaActionFunctions.actionParser.parse([
        "欢迎使用事件编辑器",
        "本事件触发一次后会消失",
        {"type": "hide", "time": 500},
      ],'event'),
      MotaActionBlocks['changeFloor_m'].xmlText(),
      MotaActionFunctions.actionParser.parse({"type": "choices", "choices": [
        {"text": "攻击+\${point}", "action": [
          {"type": "setValue", "name": "status:atk", "value": "status:atk+\${point}"},
        ]},
        {"text": "防御+\${2*point}", "action": [
          {"type": "setValue", "name": "status:def", "value": "status:def+\${2*point}"},
        ]},
        {"text": "生命+\${200*point}", "action": [
          {"type": "setValue", "name": "status:hp", "value": "status:hp+\${200*point}"},
        ]},
      ]},'point'),
      MotaActionFunctions.actionParser.parse({
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
      },'shop'),
      MotaActionBlocks['afterBattle_m'].xmlText(),
      MotaActionBlocks['afterGetItem_m'].xmlText(),
      MotaActionBlocks['afterOpenDoor_m'].xmlText(),
      MotaActionBlocks['firstArrive_m'].xmlText(),
    ],
    'statement':[
      '<label text="显示文字"></label>',
      MotaActionBlocks['text_0_s'].xmlText(),
      MotaActionBlocks['text_1_s'].xmlText(),
      MotaActionFunctions.actionParser.parseList({"type": "choices", "text": "是否跳过剧情", "choices": [
        {"text": "是", "action": []},
        {"text": "否", "action": [
          {"type": "autoText", "text": "\\t[小妖精,fairy]双击方块进入多行编辑\\n用户无法跳过自动剧情文本,大段剧情文本请添加“是否跳过剧情”的提示\\n自动剧情文本\\n自动剧情文本\\n自动剧情文本", "time" :3000},
          {"type": "autoText", "text": "(可以右键方块后点复制)", "time" :3000},
        ]},
      ]}),
      MotaActionBlocks['setText_s'].xmlText(),
      MotaActionBlocks['showImage_0_s'].xmlText(),
      MotaActionBlocks['showImage_1_s'].xmlText(),
      MotaActionBlocks['tip_s'].xmlText(),
      MotaActionBlocks['openShop_s'].xmlText(),
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
      '<label text="数据相关"></label>',
      MotaActionBlocks['setValue_s'].xmlText(),
      MotaActionBlocks['input_s'].xmlText(),
      MotaActionBlocks['update_s'].xmlText(),
      MotaActionBlocks['moveHero_s'].xmlText(),
      MotaActionBlocks['changeFloor_s'].xmlText(),
      MotaActionBlocks['changePos_0_s'].xmlText(),
      MotaActionBlocks['changePos_1_s'].xmlText(),
      MotaActionBlocks['battle_s'].xmlText(),
      MotaActionBlocks['openDoor_s'].xmlText(),
      MotaActionBlocks['setBlock_s'].xmlText(),
      '<label text="事件控制"></label>',
      MotaActionBlocks['if_s'].xmlText(),
      MotaActionBlocks['revisit_s'].xmlText(),
      MotaActionBlocks['exit_s'].xmlText(),
      MotaActionBlocks['show_s'].xmlText(),
      MotaActionBlocks['hide_s'].xmlText(),
      MotaActionBlocks['trigger_s'].xmlText(),
      MotaActionBlocks['move_s'].xmlText(),
      MotaActionBlocks['disableShop_s'].xmlText(),
      '<label text="特效/声音"></label>',
      MotaActionBlocks['sleep_s'].xmlText(),
      MotaActionBlocks['animate_s'].xmlText(),
      MotaActionBlocks['setFg_0_s'].xmlText(),
      MotaActionBlocks['setFg_1_s'].xmlText(),
      MotaActionBlocks['setWeather_s'].xmlText(),
      MotaActionBlocks['playBgm_s'].xmlText(),
      MotaActionBlocks['pauseBgm_s'].xmlText(),
      MotaActionBlocks['resumeBgm_s'].xmlText(),
      MotaActionBlocks['playSound_s'].xmlText(),
      '<label text="其他"></label>',
      MotaActionBlocks['function_s'].xmlText(),
    ],
    'value':[
      MotaActionBlocks['setValue_s'].xmlText(),
      MotaActionBlocks['expression_arithmetic_0'].xmlText(),
      MotaActionBlocks['negate_e'].xmlText(),
      MotaActionBlocks['bool_e'].xmlText(),
      MotaActionBlocks['idString_e'].xmlText(),
      MotaActionBlocks['idString_1_e'].xmlText(),
      MotaActionBlocks['idString_2_e'].xmlText(),
      MotaActionBlocks['evalString_e'].xmlText(),
    ],
    'template':[
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
        {"type": "setValue", "name": "flag:__door_name__", "value": "flag:__door_name__+1"},
        {"type": "if", "condition": "flag:__door_name__==2", 
          "true": [
            {"type": "openDoor", "loc": [10,5]}
          ],
          "false": [] 
        },
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
  }
  var toolboxgap = '<sep gap="5"></sep>'
  //xml_text = MotaActionFunctions.actionParser.parse(obj,type||'event')
  //MotaActionBlocks['idString_e'].xmlText()

  for (var name in toolboxObj){
    getCategory(name).innerHTML = toolboxObj[name].join(toolboxgap);
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
 
var onresize = function(e) {
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
};
window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

//Blockly.bindEventWithChecks_(editor_blockly.workspace.svgGroup_,"wheel",editor_blockly.workspace,function(e){});
document.getElementById('blocklyDiv').onmousewheel = function(e){
  //console.log(e);
  e.preventDefault();
  var hvScroll = e.shiftKey?'hScroll':'vScroll';
  editor_blockly.workspace.scrollbar[hvScroll].handlePosition_+=( ((e.deltaY||0)+(e.detail||0)) >0?20:-20);
  editor_blockly.workspace.scrollbar[hvScroll].onScroll_();
}

  var doubleClickCheck=[[0,'abc']];
  function omitedcheckUpdateFunction(event) {
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
    console.log(error);
  }
  }

  workspace.addChangeListener(omitedcheckUpdateFunction);

  workspace.addChangeListener(Blockly.Events.disableOrphans);

  editor_blockly.workspace = workspace;

  MotaActionFunctions.workspace = function(){
    return editor_blockly.workspace;
  }
})();
`;

var input_='';
editor_blockly.runOne = function (){
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
    script.innerHTML = converter.mainFile[5]+initscript;
    document.body.appendChild(script);
}
var xhr=new XMLHttpRequest();
xhr.onreadystatechange = function (){
    if(xhr.readyState!=4) return;
    if(xhr.status!=200) {
        alert("无法在file://下加载");
        return;
    }
    input_=xhr.responseText;
    editor_blockly.runOne();
}
xhr.open('GET','_server/blockly/MotaAction.g4',true);
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
        eval('obj=' + codeAreaHL.getValue().replace(/[<>&]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c];})),
        document.getElementById('entryType').value
    );
}

editor_blockly.id='';

editor_blockly.import = function(id_,args){
  var thisTr = document.getElementById(id_);
  if(!thisTr)return false;
  var input = thisTr.children[2].children[0].children[0];
  var field = thisTr.children[0].getAttribute('title');
  var type = args.type;
  if(!type)return false;
  editor_blockly.id=id_;
  codeAreaHL.setValue(input.value);
  document.getElementById('entryType').value = type;
  editor_blockly.parse();
  editor_blockly.show();
  return true;
}

var blocklyWidgetDiv = document.getElementsByClassName('blocklyWidgetDiv');
editor_blockly.show = function(){
  document.getElementById('left6').style='';
  for(var ii =0,node;node=blocklyWidgetDiv[ii];ii++){
    node.style.zIndex = 201;
    node.style.opacity = '';
  }
}
editor_blockly.hide = function(){
  document.getElementById('left6').style='z-index:-1;opacity: 0;';
  for(var ii =0,node;node=blocklyWidgetDiv[ii];ii++){
    node.style.zIndex = -1;
    node.style.opacity = 0;
  }
}

editor_blockly.cancel = function(){
  editor_blockly.id='';
  editor_blockly.hide();
}

editor_blockly.confirm =  function (){
  if(!editor_blockly.id){
    editor_blockly.id='';
    return;
  }
  var setvalue = function(value){
    var thisTr = document.getElementById(editor_blockly.id);
    editor_blockly.id='';
    var input = thisTr.children[2].children[0].children[0];
    input.value = value;
    editor_blockly.hide();
    input.onchange();
  }
  if(codeAreaHL.getValue()===''){
    setvalue('null');
    return;
  }
  var code = Blockly.JavaScript.workspaceToCode(editor_blockly.workspace);
  eval('var obj=' + code);
  setvalue(JSON.stringify(obj));
}

editor_blockly.doubleClickBlock = function (blockId){
  var b=editor_blockly.workspace.getBlockById(blockId);
  //console.log(b);
  var textStringDict = {
    'text_0_s':'EvalString_0',
    'text_1_s':'EvalString_2',
    'autoText_s':'EvalString_2',
    'choices_s':'EvalString_0',
    'function_s':'RawEvalString_0',
  }
  var f=b?textStringDict[b.type]:null;
  if(f){
    var value = b.getFieldValue(f);
    //多行编辑
    editor_multi.multiLineEdit(value,b,f,{'lint':f==='RawEvalString_0'},function(newvalue,b,f){
      if(textStringDict[b.type]!=='RawEvalString_0'){}
      b.setFieldValue(newvalue.split('\n').join('\\n'),f);
    });
  }
}

return editor_blockly;
}
//editor_blockly=editor_blockly();