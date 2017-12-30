(function(){
  
  editor_file = {};
  editor_file.getFloorFileList = function(editor,callback){
    if (isset(callback)) callback(['simple0.js','simple1.js','simple2.js'],null);
  }
  //callback(Array<String>,err:String)
  editor_file.loadFloorFile = function(editor,filename,callback){
    if (isset(callback)) callback('',null);
  }
  //callback(String,err:String)
  editor_file.saveFloorFile = function(editor,callback){
    if (isset(callback)) callback(null);
  }
  //callback(err:String)
  editor_file.saveFloorFile = function(editor,saveAsFilename,callback){
    if (isset(callback)) callback(null);
  }
  //callback(err:String)
  editor_file.changeIdAndIdnum = function(editor,id,idnum,callback){
    if (isset(callback)) callback(null);
  }
  //callback(err:String)
  editor_file.editItem = function(editor,id,callback){
    if (isset(callback)) callback('',null);
  }
  //callback(String,err:String)
  editor_file.editEnemy = function(editor,id,callback){
    if (isset(callback)) callback({'name': '初级巫师', 'hp': 100, 'atk': 120, 'def': 0, 'money': 16, 'experience': 0, 'special': 15, 'value': 100},null);
  }
  //callback(obj,err:String)
  editor_file.editLoc = function(editor,x,y,input_value,callback){
    if (isset(callback)) callback({"events":` [ // 守着道具的老人
      "\t[老人,man]这些是本样板支持的所有的道具。\n\n道具分为三类：items, constants, tools。\nitems 为即捡即用类道具，例如宝石、血瓶、剑盾等。\nconstants 为永久道具，例如怪物手册、楼层传送器、幸运金币等。\ntools 为消耗类道具，例如破墙镐、炸弹、中心对称飞行器等。\n\n后两类道具在工具栏中可以看到并使用。",
      "\t[老人,man]有关道具效果，定义在items.js中。\n目前大多数道具已有默认行为，如有自定义的需求则需在items.js中修改代码。",
      "\t[老人,man]constants 和 tools 各最多只允许12种，多了会导致图标溢出。",
      "\t[老人,man]拾取道具结束后可触发 afterGetItem 事件。\n\n有关事件的各种信息在下一层会有更为详细的说明。",
      {"type": "hide", "time": 500} // 消失
  ],`,"changeFloor":"","afterBattle":"","afterGetItem":"","afterOpenDoor":""},null);
  }
  //callback(obj,err:String)
  editor_file.editFloor = function(editor,input_value,callback){
    if (isset(callback)) callback({"floorId": "sample0",
    "title": "样板 0 层",
    "name": "0",
    "canFlyTo": true,
    "canUseQuickShop": true,
    "defaultGround": "ground",
    "firstArrive":` [ // 第一次到该楼层触发的事件
      "\t[样板提示]首次到达某层可以触发 firstArrive 事件，该事件可类似于RMXP中的“自动执行脚本”。\n\n本事件支持一切的事件类型，常常用来触发对话，例如：",
      "\t[hero]我是谁？我从哪来？我又要到哪去？",
      "\t[仙子,fairy]你问我...？我也不知道啊...",
      "本层主要对道具、门、怪物等进行介绍，有关事件的各种信息在下一层会有更为详细的说明。",
  ],`},null);
  }
  //callback(obj,err:String)
  var isset = function (val) {
    if (val == undefined || val == null) {
        return false;
    }
    return true
  }
})();