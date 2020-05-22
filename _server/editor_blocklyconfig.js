editor_blocklyconfig=(function(){
// start mark sfergsvae



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
      '<label text="入口方块会根据当前类型在此数组中筛选,具体控制在editor_blockly.entranceCategoryCallback中"></label>',
      MotaActionFunctions.actionParser.parse([
        "欢迎使用事件编辑器",
        "本事件触发一次后会消失",
        {"type": "hide", "time": 500},
      ],'event'),
      MotaActionFunctions.actionParser.parse({
        "condition": "flag:__door__==2",
        "currentFloor": true,
        "priority": 0,
        "delayExecute": false,
        "multiExecute": false,
        "data": [
          {"type": "openDoor", "loc": [10,5]}
        ],
      },'autoEvent'),
      MotaActionBlocks['changeFloor_m'].xmlText(),
      MotaActionFunctions.actionParser.parse([{
        "id": "shop1",
        "text": "\t[贪婪之神,moneyShop]勇敢的武士啊, 给我${20+2*flag:shop1}金币就可以：", 
        "textInList": "1F金币商店",  
        "choices": [ 
          {"text": "生命+800", "need": "status:money>=20+2*flag:shop1", "action": [
            {"type": "comment", "text": "新版商店中需要手动扣减金币和增加访问次数"},
            {"type": "setValue", "name": "status:money", "operator": "-=", "value": "20+2*flag:shop1"},
            {"type": "setValue", "name": "flag:shop1", "operator": "+=", "value": "1"},
            {"type": "setValue", "name": "status:hp", "operator": "+=", "value": "800"}
          ]}
        ]
      },{
        "id": "itemShop",
        "item": true,
        "textInList": "道具商店",
        "choices": [
          {"id": "yellowKey", "number": 10, "money": 10}
        ]
      },{
        "id": "keyShop1",
        "textInList": "回收钥匙商店",
        "commonEvent": "回收钥匙商店",
        "args": ""
      }],'shop'),
      MotaActionBlocks['afterBattle_m'].xmlText(),
      MotaActionBlocks['afterGetItem_m'].xmlText(),
      MotaActionBlocks['afterOpenDoor_m'].xmlText(),
      MotaActionBlocks['firstArrive_m'].xmlText(),
      MotaActionBlocks['eachArrive_m'].xmlText(),
      MotaActionBlocks['level_m'].xmlText(),
      MotaActionBlocks['commonEvent_m'].xmlText(),
      MotaActionBlocks['item_m'].xmlText(),
      MotaActionFunctions.actionParser.parse([
        {"title":"简单", "name": "Easy", "hard": 1, "action": [
          {"type": "comment", "text": "在这里写该难度需执行的事件"}
        ]}
      ], 'levelChoose'),
      MotaActionFunctions.actionParser.parse({
        "type": 0, "value": {"atk": 10}, "percentage": {"speed": 10},
      }, 'equip'),
      MotaActionFunctions.actionParser.parse([{
        "name": "bg.jpg", "x": 0, "y": 0, "canvas": "bg"
      }], 'floorImage'),
      MotaActionFunctions.actionParser.parse({
        "time": 160, "openSound": "door.mp3", "closeSound": "door.mp3", "keys": {"yellowKey": 1, "orangeKey": 1}
      }, 'doorInfo'),
      MotaActionBlocks['faceIds_m'].xmlText(),
    ],
    '显示文字':[
      MotaActionBlocks['text_0_s'].xmlText(),
      MotaActionBlocks['text_1_s'].xmlText(),
      MotaActionBlocks['comment_s'].xmlText(),
      MotaActionBlocks['autoText_s'].xmlText(),
      MotaActionBlocks['scrollText_s'].xmlText(),
      MotaActionBlocks['setText_s'].xmlText(),
      MotaActionBlocks['showImage_s'].xmlText(),
      MotaActionBlocks['showImage_1_s'].xmlText(),
      MotaActionBlocks['hideImage_s'].xmlText(),
      MotaActionBlocks['showTextImage_s'].xmlText(),
      MotaActionBlocks['moveImage_s'].xmlText(),
      MotaActionBlocks['showGif_s'].xmlText(),
      MotaActionBlocks['tip_s'].xmlText(),
      MotaActionBlocks['win_s'].xmlText(),
      MotaActionBlocks['lose_s'].xmlText(),
      MotaActionBlocks['restart_s'].xmlText(),
      MotaActionBlocks['confirm_s'].xmlText(),
      MotaActionBlocks['choices_s'].xmlText([
        '选择剑或者盾','流浪者','man',0,MotaActionBlocks['choicesContext'].xmlText([
          '剑','','',null,'',MotaActionFunctions.actionParser.parseList([{"type": "openDoor", "loc": [3,3]}]),
        ])
      ]),
    ],
    '数据相关':[
      MotaActionBlocks['setValue_s'].xmlText([
        MotaActionBlocks['idIdList_e'].xmlText(['status','生命']), '=', '', false
      ]),
      MotaActionBlocks['setEnemy_s'].xmlText(),
      MotaActionBlocks['setFloor_s'].xmlText(),
      MotaActionBlocks['setGlobalAttribute_s'].xmlText(),
      MotaActionBlocks['setGlobalValue_s'].xmlText(),
      MotaActionBlocks['setGlobalFlag_s'].xmlText(),
      MotaActionBlocks['input_s'].xmlText(),
      MotaActionBlocks['input2_s'].xmlText(),
      MotaActionBlocks['update_s'].xmlText(),
      MotaActionBlocks['moveAction_s'].xmlText(),
      MotaActionBlocks['moveHero_s'].xmlText(),
      MotaActionBlocks['jumpHero_s'].xmlText(),
      MotaActionBlocks['changeFloor_s'].xmlText(),
      MotaActionBlocks['changePos_s'].xmlText(),
      MotaActionBlocks['battle_s'].xmlText(),
      MotaActionBlocks['useItem_s'].xmlText(),
      MotaActionBlocks['loadEquip_s'].xmlText(),
      MotaActionBlocks['unloadEquip_s'].xmlText(),
      MotaActionBlocks['openShop_s'].xmlText(),
      MotaActionBlocks['disableShop_s'].xmlText(),
      MotaActionBlocks['setHeroIcon_s'].xmlText(),
      MotaActionBlocks['follow_s'].xmlText(),
      MotaActionBlocks['unfollow_s'].xmlText(),
    ],
    '地图处理':[
      MotaActionBlocks['battle_1_s'].xmlText(),
      MotaActionBlocks['openDoor_s'].xmlText(),
      MotaActionBlocks['closeDoor_s'].xmlText(),
      MotaActionBlocks['show_s'].xmlText(),
      MotaActionBlocks['hide_s'].xmlText(),
      MotaActionBlocks['setBlock_s'].xmlText(),
      MotaActionBlocks['turnBlock_s'].xmlText(),
      MotaActionBlocks['move_s'].xmlText(),
      MotaActionBlocks['jump_s'].xmlText(),
      MotaActionBlocks['showBgFgMap_s'].xmlText(),
      MotaActionBlocks['hideBgFgMap_s'].xmlText(),
      MotaActionBlocks['setBgFgBlock_s'].xmlText(),
      MotaActionBlocks['showFloorImg_s'].xmlText(),
      MotaActionBlocks['hideFloorImg_s'].xmlText(),
    ],
    '事件控制':[
      MotaActionBlocks['if_1_s'].xmlText(),
      MotaActionBlocks['if_s'].xmlText(),
      MotaActionFunctions.actionParser.parseList({"type": "switch", "condition": "判别值", "caseList": [
        {"action": [{"type": "comment", "text": "当判别值是值的场合执行此事件"}]},
        {"case": "default", "action": [{"type": "comment", "text": "当没有符合的值的场合执行default事件"}]},
      ]}),
      MotaActionFunctions.actionParser.parseList({"type": "for", "name": "temp:A", "from": "0", "to": "12", "step": "1", "data": []}),
      MotaActionFunctions.actionParser.parseList({"type": "forEach", "name": "temp:A", "list": ["status:atk","status:def"], "data": []}),
      MotaActionBlocks['while_s'].xmlText(),
      MotaActionBlocks['dowhile_s'].xmlText(),
      MotaActionBlocks['break_s'].xmlText(),
      MotaActionBlocks['continue_s'].xmlText(),
      MotaActionBlocks['exit_s'].xmlText(),
      MotaActionBlocks['trigger_s'].xmlText(),
      MotaActionBlocks['insert_1_s'].xmlText(),
      MotaActionBlocks['insert_2_s'].xmlText(),
    ],
    '特效/声音':[
      MotaActionBlocks['sleep_s'].xmlText(),
      MotaActionFunctions.actionParser.parseList({"type": "wait", "timeout": 0, "data": [
        {"case": "keyboard", "keycode": "13,32", "action": [{"type": "comment", "text": "当按下回车(keycode=13)或空格(keycode=32)时执行此事件"}]},
        {"case": "mouse", "px": [0,32], "py": [0,32], "action": [{"type": "comment", "text": "当点击地图左上角时执行此事件"}]},
      ]}),
      MotaActionBlocks['waitAsync_s'].xmlText(),
      MotaActionBlocks['vibrate_s'].xmlText(),
      MotaActionBlocks['animate_s'].xmlText(),
      MotaActionBlocks['setViewport_s'].xmlText(),
      MotaActionBlocks['moveViewport_s'].xmlText(),
      MotaActionBlocks['showStatusBar_s'].xmlText(),
      MotaActionBlocks['hideStatusBar_s'].xmlText(),
      MotaActionBlocks['showHero_s'].xmlText(),
      MotaActionBlocks['hideHero_s'].xmlText(),
      MotaActionBlocks['setCurtain_0_s'].xmlText(),
      MotaActionBlocks['setCurtain_1_s'].xmlText(),
      MotaActionBlocks['screenFlash_s'].xmlText(),
      MotaActionBlocks['setWeather_s'].xmlText(),
      MotaActionBlocks['playBgm_s'].xmlText(),
      MotaActionBlocks['pauseBgm_s'].xmlText(),
      MotaActionBlocks['resumeBgm_s'].xmlText(),
      MotaActionBlocks['loadBgm_s'].xmlText(),
      MotaActionBlocks['freeBgm_s'].xmlText(),
      MotaActionBlocks['playSound_s'].xmlText(),
      MotaActionBlocks['stopSound_s'].xmlText(),
      MotaActionBlocks['setVolume_s'].xmlText(),
      MotaActionBlocks['callBook_s'].xmlText(),
      MotaActionBlocks['callSave_s'].xmlText(),
      MotaActionBlocks['autoSave_s'].xmlText(),
      MotaActionBlocks['callLoad_s'].xmlText(),
    ],
    'UI绘制':[
      MotaActionBlocks['previewUI_s'].xmlText(),
      MotaActionBlocks['clearMap_s'].xmlText(),
      MotaActionBlocks['clearMap_1_s'].xmlText(),
      MotaActionBlocks['setAttribute_s'].xmlText(),
      MotaActionBlocks['fillText_s'].xmlText(),
      MotaActionBlocks['fillBoldText_s'].xmlText(),
      MotaActionBlocks['drawTextContent_s'].xmlText(),
      MotaActionBlocks['fillRect_s'].xmlText(),
      MotaActionBlocks['strokeRect_s'].xmlText(),
      MotaActionBlocks['drawLine_s'].xmlText(),
      MotaActionBlocks['drawArrow_s'].xmlText(),
      MotaActionBlocks['fillPolygon_s'].xmlText(),
      MotaActionBlocks['strokePolygon_s'].xmlText(),
      MotaActionBlocks['fillEllipse_s'].xmlText(),
      MotaActionBlocks['strokeEllipse_s'].xmlText(),
      MotaActionBlocks['fillArc_s'].xmlText(),
      MotaActionBlocks['strokeArc_s'].xmlText(),
      MotaActionBlocks['drawImage_s'].xmlText(),
      MotaActionBlocks['drawImage_1_s'].xmlText(),
      MotaActionBlocks['drawIcon_s'].xmlText(),
      MotaActionBlocks['drawBackground_s'].xmlText(),
      MotaActionBlocks['drawSelector_s'].xmlText(),
      MotaActionBlocks['drawSelector_1_s'].xmlText(),
    ],
    '原生脚本':[
      MotaActionBlocks['function_s'].xmlText(),
      MotaActionBlocks['unknown_s'].xmlText(),
    ],
    '值块':[
      MotaActionBlocks['setValue_s'].xmlText([
        MotaActionBlocks['idIdList_e'].xmlText(['status','生命']), '=', '', false
      ]),
      MotaActionBlocks['expression_arithmetic_0'].xmlText(),
      MotaActionBlocks['idFlag_e'].xmlText(),
      MotaActionBlocks['idTemp_e'].xmlText(),
      MotaActionBlocks['negate_e'].xmlText(),
      MotaActionBlocks['bool_e'].xmlText(),
      MotaActionBlocks['idString_e'].xmlText(),
      MotaActionBlocks['idIdList_e'].xmlText(),
      MotaActionBlocks['idFixedList_e'].xmlText(),
      MotaActionBlocks['enemyattr_e'].xmlText(),
      MotaActionBlocks['blockId_e'].xmlText(),
      MotaActionBlocks['blockCls_e'].xmlText(),
      MotaActionBlocks['equip_e'].xmlText(),
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
        {"type": "while", "condition": "true", "data": [
          {"type": "choices", "text": "\t[老人,man]少年，你需要钥匙吗？\n我这里有大把的！",
          "choices": [
              {"text": "黄钥匙（${9+flag:shop_times}金币）", "color": [255,255,0,1], "action": [
                  {"type": "if", "condition": "status:money>=9+flag:shop_times",
                      "true": [
                          {"type": "setValue", "name": "status:money", "operator": "-=", "value": "9+flag:shop_times"},
                          {"type": "setValue", "name": "item:yellowKey", "operator": "+=", "value": "1"},
                      ],
                      "false": [
                          "\t[老人,man]你的金钱不足！",
                          {"type": "continue"}
                      ]
                  }
              ]},
              {"text": "蓝钥匙（${18+2*flag:shop_times}金币）", "color": [0,0,255,1], "action": [
              ]},
              {"text": "离开", "action": [
                  {"type": "break"}
              ]}
          ]
        },
        {"type": "setValue", "name": "flag:shop_times", "operator": "+=", "value": "1"}
      ]}], 'event'),  
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
        {"type": "setValue", "name": "flag:__door__", "operator": "+=", "value": "1"},
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
              {"type":"setValue", "name":"status:hp", "operator": "*=", "value": "2"}, 
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
    if(name=='入口方块')custom='entranceCategory';
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

editor_blockly.entranceCategoryCallback = function(workspace) {
  var list=toolboxObj['入口方块']
  var xmlList = [];
  var eventType = editor_blockly.entryType+'_m';
  for(var ii=0,blockText;blockText=list[ii];ii++){
    if(new RegExp('<block type="'+eventType+'">').exec(blockText)){
      var block = Blockly.Xml.textToDom('<xml>'+blockText+'</xml>').firstChild;
      block.setAttribute("gap", 5);
      xmlList.push(block);
    }
  }
  return xmlList;
}

workspace.registerToolboxCategoryCallback(
  'entranceCategory', editor_blockly.entranceCategoryCallback);

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
  var mousewheelOffsetValue=20/380*workspace.scrollbar[hvScroll].handleLength_*3;
  workspace.scrollbar[hvScroll].handlePosition_+=( ((e.deltaY||0)+(e.detail||0)) >0?mousewheelOffsetValue:-mousewheelOffsetValue);
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
  try {
    var code = Blockly.JavaScript.workspaceToCode(workspace).replace(/\\(i|c|d|e|z)/g, '\\\\$1');
    editor_blockly.setValue(code);
  } catch (error) {
    editor_blockly.setValue(String(error));
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
        var subrulename = rule.argsGrammarName[ii];
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



// end mark sfergsvae
}).toString().split('// start mark sfergsvae')[1].split('// end mark sfergsvae')[0]