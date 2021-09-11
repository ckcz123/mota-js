// 编辑此文件用的vscode插件: https://marketplace.visualstudio.com/items?itemName=zhaouv.vscode-mota-js-extension
// 此文件通过antlr-blockly生成编辑器中的图块, 相关帮助说明: https://zhaouv.github.io/antlr-blockly/docs/#/README
// 添加和修改图块的说明见 _docs/editor.md ~ http://127.0.0.1:1055/_docs/#/editor?id=修改事件编辑器

/*
特殊注入demo
doubleclicktext : EvalString_1
previewBlock : true
// [x, y, floorId, forceFloor]
selectPoint : ["PosString_0", "PosString_1", "IdString_0", true]
// 自动补全
allIds : ['EvalString_1']
allEnemys : ['EvalString_1']
allItems : ['EvalString_1']
allImages : ['EvalString_1']
allAnimates : ['EvalString_1']
allBgms : ['EvalString_1']
allSounds : ['EvalString_1']
allShops : ['EvalString_1']
allFloorIds : ['EvalString_1']
// 选择素材
material : ["./project/animates/", "IdString_0"]
*/


grammar MotaAction;

//===============parser===============
//===blockly语句===

common_m
    :   '编辑事件' BGNL? Newline action+ BEND
    

/* common_m
tooltip : 编辑事件
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;


//事件 事件编辑器入口之一
event_m
    :   '事件' BGNL? Newline '覆盖触发器' Bool '启用' Bool '通行状态' B_0_List '显伤' Bool '不透明度' Number BGNL? Newline '该点特效' '虚化' Number '色相' Int '灰度' Number '反色' Bool '阴影' Number BGNL? Newline action+ BEND
    

/* event_m
tooltip : 编辑魔塔的事件
helpUrl : /_docs/#/instruction
default : [false,true,null,true,1,0,0,0,false,0,null]
B_0_List_0=eval(B_0_List_0);
if (Number_0 < 0 || Number_0 > 1) throw '不透明度需要在0~1之间';
if (Number_1 < 0) throw '虚化不得小于0；0为完全没有虚化';
if (Int_0 < 0 || Int_0 >= 360) throw '色相需要在0~359之间';
if (Number_2 < 0 || Number_2 > 1) throw '灰度需要在0~1之间';
if (Number_3 < 0) throw '阴影不得小于0；0为完全没有阴影';
var code = {
    'trigger': Bool_0?'action':null,
    'enable': Bool_1,
    'noPass': B_0_List_0,
    'displayDamage': Bool_2,
    'opacity': Number_0,
    'filter': {
        'blur': Number_1,
        'hue': Int_0,
        'grayscale': Number_2,
        'invert': Bool_3,
        'shadow': Number_3
    },
    'data': 'data_asdfefw'
}
if (!Bool_0 && Bool_1 && B_0_List_0===null && Bool_2 && Number_0==1.0 && Number_1==0 && Int_0==0 && Number_2==0 && !Bool_3 && Number_3==0) 
    code = 'data_asdfefw';
code=JSON.stringify(code,null,2).split('"data_asdfefw"').join('[\n'+action_0+']\n');
return code;
*/;


//自动事件 事件编辑器入口之一
autoEvent_m
    :   '自动事件：' '触发条件' EvalString_Multi '优先级' Int BGNL? Newline '仅在本层检测' Bool '事件流中延迟执行' Bool '允许多次执行' Bool BGNL? Newline action+ BEND
    

/* autoEvent_m
tooltip : 自动事件
helpUrl : /_docs/#/instruction
default : ["flag:__door__===2",0,true,false,false,null]
var code = {
    "condition": 'autoEvent_condition', // 条件不可为null
    "currentFloor": Bool_0, // 是否仅在本层检测
    "priority": Int_0, // 优先级
    "delayExecute": Bool_1, // 延迟执行
    "multiExecute": Bool_2, // 是否允许多次执行
    "data": 'autoEvent_asdfefw', // 事件列表
};
code=JSON.stringify(code,null,2).replace('autoEvent_condition', EvalString_Multi_0).split('"autoEvent_asdfefw"').join('[\n'+action_0+']\n');
return code;
*/;

//升级 事件编辑器入口之一
level_m
    :   '等级提升' BGNL? Newline levelCase+ BEND
    

/* level_m
tooltip : 升级事件
helpUrl : /_docs/#/instruction
var code = '[\n'+levelCase_0+']\n';
return code;
*/;

levelCase
    :   '需求' expression '称号' EvalString? '是否扣除经验' Bool BGNL? Newline action+


/* levelCase
tooltip : 升级设定
helpUrl : /_docs/#/instruction
default : [0,"",false,null]
colour : this.subColor
Bool_0 = Bool_0?', "clear": true':'';
var code = '{"need": "'+expression_0+'", "title": "'+EvalString_0+'"'+Bool_0+', "action": [\n'+action_0+']},\n';
return code;
*/;

//商店 事件编辑器入口之一
shop_m
    :   '全局商店列表' BGNL? Newline shoplist+
    
/* shop_m
tooltip : 全局商店列表
helpUrl : /_docs/#/instruction
var code = '['+shoplist_0+']\n';
return code;
*/;

shoplist
    :   shopsub
    |   shopitem
    |   shopcommonevent
    |   emptyshop
    ;

emptyshop
    :   Newline
    

/* emptyshop
var code = ' \n';
return code;
*/;

shopsub
    :   '商店 id' IdString '标题' EvalString? '图像' IdString? BGNL? Newline '文字' EvalString_Multi? BGNL? Newline '快捷名称' EvalString '未开启不显示' Bool '不可预览' Bool BGNL? Newline shopChoices+ BEND
    

/* shopsub
tooltip : 全局商店
helpUrl : /_docs/#/instruction
doubleclicktext : EvalString_Multi_0
allIds : ['IdString_1']
default : ["shop1","贪婪之神","moneyShop","勇敢的武士啊, 给我${20+2*flag:shop1}金币就可以：","金币商店",false,false]
var title='';
if (EvalString_0==''){
    if (IdString_1=='') title='';
    else title='\t['+IdString_1+']';
} else {
    if (IdString_1=='')title='\t['+EvalString_0+']';
    else title='\t['+EvalString_0+','+IdString_1+']';
}
title += EvalString_Multi_0;
var code = '{\n"id": "'+IdString_0+'",\n"text": "'+title+'",\n"textInList": "'+EvalString_1+'",\n"mustEnable": '+Bool_0+',\n"disablePreview": '+Bool_1+',\n"choices":[\n'+shopChoices_0+']},\n';
return code;
*/;

shopChoices
    :   '商店选项' EvalString '使用条件' EvalString BGNL? Newline '图标' IdString? '颜色' ColorString? Colour '出现条件' EvalString? BGNL? Newline action+ BEND
    

/* shopChoices
tooltip : 商店选项
helpUrl : /_docs/#/instruction
default : ["攻击+1","status:money>=20+2*flag:shop1","","","rgba(255,255,255,1)",""]
allIds : ['IdString_0']
colour : this.subColor
ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
EvalString_2 = EvalString_2 && (', "condition": "'+EvalString_2+'"')
IdString_0 = IdString_0? (', "icon": "'+IdString_0+'"'):'';
var code = '{"text": "'+EvalString_0+'", "need": "'+EvalString_1+'"'+IdString_0+ColorString_0+EvalString_2+', "action": [\n'+action_0+']},\n';
return code;
*/;

shopitem
    :   '道具商店 id' IdString '快捷名称' EvalString '使用' ShopUse_List '未开启不显示' Bool BGNL? Newline shopItemChoices+ BEND


/* shopitem
tooltip : 道具商店
helpUrl : /_docs/#/instruction
default : ["itemShop","道具商店",false]
var code = {
    'id': IdString_0,
    'item': true,
    'textInList': EvalString_0,
    'use': ShopUse_List_0 || 'money',
    'mustEnable': Bool_0,
    'choices': 'choices_aqwedsa'
}
code=JSON.stringify(code,null,2).split('"choices_aqwedsa"').join('[\n'+shopItemChoices_0+']')+',\n';
return code;
*/;

shopItemChoices
    :   '道具名' IdString '存量' IntString? '买入价格' EvalString? '卖出价格' EvalString? '出现条件' EvalString? BEND



/* shopItemChoices
tooltip : 道具商店选项，每一项是道具名；买入或卖出可以不填表示只能卖出或买入
helpUrl : /_docs/#/instruction
default : ["yellowKey","","10","",""]
colour : this.subColor
IntString_0 = IntString_0 ? (', "number": '+IntString_0) : '';
EvalString_0 = EvalString_0 ? (', "money": "'+EvalString_0+'"') : '';
EvalString_1 = EvalString_1 ? (', "sell": "'+EvalString_1+'"') : '';
if (!EvalString_0 && !EvalString_1) throw "买入金额和卖出金额至少需要填写一个";
EvalString_2 = EvalString_2 ? (', "condition": "'+EvalString_2+'"') : '';
var code = '{"id": "' + IdString_0 + '"' + IntString_0 + EvalString_0 + EvalString_1 + EvalString_2 + '},\n';
return code;
*/;

shopcommonevent
    :   '公共事件商店 id' IdString '快捷名称' EvalString '未开启不显示' Bool BGNL? '执行的公共事件名' EvalString '参数列表' JsonEvalString?
    
/* shopcommonevent
tooltip : 全局商店, 执行一个公共事件
helpUrl : /_docs/#/instruction
default : ["shop1","回收钥匙商店",false,"回收钥匙商店",""]
if (JsonEvalString_0) {
    if (!(JSON.parse(JsonEvalString_0) instanceof Array))
        throw new Error('参数列表必须是个有效的数组！');
}
var code = {
    'id': IdString_0,
    'textInList': EvalString_0,
    'mustEnable': Bool_0,
    'commonEvent': EvalString_1
}
if (JsonEvalString_0) code.args = JSON.parse(JsonEvalString_0);
code=JSON.stringify(code,null,2)+',\n';
return code;
*/;

//beforeBattle 事件编辑器入口之一
beforeBattle_m
    :   '战斗开始前' BGNL? Newline action+ BEND
    

/* beforeBattle_m
tooltip : 战斗开始前
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

//afterBattle 事件编辑器入口之一
afterBattle_m
    :   '战斗结束后' BGNL? Newline action+ BEND
    

/* afterBattle_m
tooltip : 系统引发的战后
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

//afterGetItem 事件编辑器入口之一
afterGetItem_m
    :   '获取道具后' '轻按时不触发' Bool BGNL? Newline action+ BEND
    

/* afterGetItem_m
tooltip : 系统引发的道具后事件
helpUrl : /_docs/#/instruction
if (Bool_0) {
  return '{"disableOnGentleClick": true, "data": [\n'+action_0+']\n}';
} else {
  return '[\n'+action_0+']\n';
}
*/;

//afterOpenDoor 事件编辑器入口之一
afterOpenDoor_m
    :   '打开门后' BGNL? Newline action+ BEND
    

/* afterOpenDoor_m
tooltip : 系统引发的自定义事件
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

//firstArrive 事件编辑器入口之一
firstArrive_m
    :   '首次到达楼层' BGNL? Newline action+ BEND
    

/* firstArrive_m
tooltip : 首次到达楼层
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

//eachArrive 事件编辑器入口之一
eachArrive_m
    :   '每次到达楼层' BGNL? Newline action+ BEND


/* eachArrive_m
tooltip : 每次到达楼层
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

//changeFloor 事件编辑器入口之一
changeFloor_m
    :   '楼梯, 传送门' BGNL? Newline Floor_List IdString? Stair_List 'x' PosString? ',' 'y' PosString? '朝向' DirectionEx_List '动画时间' IntString? '穿透性' IgnoreChangeFloor_List BEND
    

/* changeFloor_m
tooltip : 楼梯, 传送门, 如果目标楼层有多个楼梯, 写upFloor或downFloor可能会导致到达的楼梯不确定, 这时候请使用loc方式来指定具体的点位置
helpUrl : /_docs/#/instruction
default : [null,"MTx",null,"","",null,"",null]
selectPoint : ["PosString_0", "PosString_1", "IdString_0", true]
allFloorIds : ['IdString_0']
var toFloorId = IdString_0;
if (Floor_List_0!='floorId') toFloorId = Floor_List_0;
var loc = '';
if (PosString_0 && PosString_1) {
  loc = ', "loc": ['+PosString_0+', '+PosString_1+']';
}
if (Stair_List_0===':now') loc = '';
else if (Stair_List_0!=='loc')loc = ', "stair": "'+Stair_List_0+'"';
if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
if (IgnoreChangeFloor_List_0!='null') {
  IgnoreChangeFloor_List_0 = ', "ignoreChangeFloor": '+IgnoreChangeFloor_List_0;
} else {
  IgnoreChangeFloor_List_0 = '';
}
var code = '{"floorId": "'+toFloorId+'"'+loc+DirectionEx_List_0+IntString_0+IgnoreChangeFloor_List_0+' }\n';
return code;
*/;

//commonEvent 事件编辑器入口之一
commonEvent_m
    :   '公共事件' BGNL? Newline action+ BEND


/* commonEvent_m
tooltip : 公共事件
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

//item 事件编辑器入口之一
item_m
    :   '使用道具事件' BGNL? Newline action+ BEND


/* item_m
tooltip : 使用道具事件
helpUrl : /_docs/#/instruction
var code = '[\n'+action_0+']\n';
return code;
*/;

// levelChoose 事件编辑器入口之一
levelChoose_m
    :   '难度分歧' BGNL? levelChooseList+ BEND


/* levelChoose_m
tooltip : 难度分歧
helpUrl : /_docs/#/instruction
var code = '[\n'+levelChooseList_0+']\n';
return code;
*/;

levelChooseList
    : levelChooseChoice
    | levelChooseEmpty;

levelChooseEmpty
    :   Newline
    
/* levelChooseEmpty
var code = ' \n';
return code;
*/;

levelChooseChoice
   :    '难度分歧项' '名称' EvalString '简写' EvalString '变量:hard值' NInt '颜色' ColorString? Colour BGNL Newline action+ BEND

/* levelChooseChoice
tooltip : 难度分歧项
helpUrl : /_docs/#/instruction
default : ['简单','Easy',1,'']
ColorString_0 = ColorString_0 ? (', "color": [' + ColorString_0 + ']') : '';
var code = '{"title": "'+EvalString_0+'", "name": "'+EvalString_1+'", "hard": '+NInt_0+ColorString_0+', "action": [\n'+action_0+']},\n';
return code;
*/;

floorPartition_m
    :   '高层塔分区管理' BGNL? floorPartitionList+ BEND


/* floorPartition_m
tooltip : 高层塔分区管理
helpUrl : /_docs/#/instruction
var code = '[\n'+floorPartitionList_0+']\n';
return code;
*/;

floorPartitionList
    : floorPartitionItem
    | floorPartitionEmpty;

floorPartitionEmpty
    :   Newline
    
/* floorPartitionEmpty
var code = ' \n';
return code;
*/;

floorPartitionItem
   :    '分区项' '起始楼层ID' IdString '终止楼层ID（不填代表到最后一层）' IdString? BEND

/* floorPartitionItem
tooltip : 难度分歧项
helpUrl : /_docs/#/instruction
default : ['MTx','']
IdString_1 = IdString_1 ? (', "'+IdString_1+'"') : '';
var code = '["'+IdString_0+'"'+IdString_1+'],\n';
return code;
*/;


// equip 事件编辑器入口之一
equip_m 
    :   '装备' '类型' EvalString '装备动画（第一个装备格有效）' IdString? BGNL? '数值提升项' equipList+ '百分比提升项' equipList+ '穿上时事件' action+ '脱下时事件' action+ '此道具cls须为equips并设置canUseItemEffect' BEND


/* equip_m
tooltip : 装备
default : ['0', '']
helpUrl : /_docs/#/instruction
allAnimates : ['IdString_0']
if (!/^\d+$/.test(EvalString_0)) {
    EvalString_0 = '"' + EvalString_0 + '"';
}
IdString_0 = IdString_0 && (', "animate": "'+IdString_0+'"');
if (action_0.trim()) action_0 = ', "equipEvent": [\n' + action_0 + ']';
if (action_1.trim()) action_1 = ', "unequipEvent": [\n' + action_1 + ']';
var code = '{"type": '+EvalString_0+IdString_0+', "value": {\n'+equipList_0+'\n}, "percentage": {\n'+equipList_1+'\n}'+action_0+action_1+'}';
return code;
*/;

equipList
    : equipKnown
    | equipUnknown
    | equipEmpty;


equipKnown
    : Equip_List ':' EvalString BEND


/* equipKnown
tooltip : 装备项
default : ['atk', 10]
helpUrl : /_docs/#/instruction
if (!/^[+-]?\d+(\.\d+)?$/.test(EvalString_0)) EvalString_0 = '"' + EvalString_0 + '"';
return '"'+Equip_List_0+'": '+EvalString_0+', ';
*/;

equipUnknown
    : EvalString ':' EvalString BEND


/* equipUnknown
tooltip : 装备项
default : ['speed', 10]
helpUrl : /_docs/#/instruction
if (!/^[+-]?\d+(\.\d+)?$/.test(EvalString_1)) EvalString_1 = '"' + EvalString_1 + '"';
return '"'+EvalString_0+'": '+EvalString_1+', ';
*/;


equipEmpty
    :   Newline
    
/* equipEmpty
var code = ' \n';
return code;
*/;

floorImage_m
    : '楼层贴图' BGNL? Newline floorImageList+ BEND


/* floorImage_m
tooltip : 楼层贴图
helpUrl : /_docs/#/instruction
var code = '[\n'+floorImageList_0+']\n';
return code;
*/;

floorImageList
    :   floorOneImage
    |   floorEmptyImage;

floorOneImage
    :   '图片名' EvalString '翻转' Reverse_List '图层' Bg_Fg2_List '绘制坐标' 'x' NInt 'y' NInt '初始禁用' Bool BGNL? Newline 
        '裁剪起点坐标' 'x' IntString? 'y' IntString? '宽' IntString? '高' IntString? '帧数' IntString? BEND


/* floorOneImage
tooltip : 楼层贴图
default : ["bg.jpg","null","bg",0,0,false,"","","","",""]
helpUrl : /_docs/#/instruction
allImages : ['EvalString_0']
previewBlock : true
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
Bool_0 = Bool_0 ? (', "disable": true') : '';
IntString_0 = IntString_0 && (', "sx": '+IntString_0);
IntString_1 = IntString_1 && (', "sy": '+IntString_1);
IntString_2 = IntString_2 && (', "w": '+IntString_2);
IntString_3 = IntString_3 && (', "h": '+IntString_3);
IntString_4 = IntString_4 && (', "frame": '+IntString_4);
return '{"name": "'+EvalString_0+'"'+Reverse_List_0+', "canvas": "'+Bg_Fg2_List_0+'", "x": '+NInt_0+', "y": '+NInt_1+Bool_0+IntString_0+IntString_1+IntString_2+IntString_3+IntString_4+'},\n';
*/;

floorEmptyImage
    :   Newline
    
/* floorEmptyImage
var code = ' \n';
return code;
*/;


// doorInfo 事件编辑器入口之一
doorInfo_m 
    :   '门信息' '开关门时间' Int '开门音效' EvalString? '关门音效' EvalString? BGNL? Newline '需要钥匙' doorKeyList+ '如需撞到开门还需要把图块触发器改成 openDoor' BGNL? Newline '开门后事件' action+ BEND


/* doorInfo_m
tooltip : 开门信息
default : [160, 'door.mp3', 'door.mp3']
helpUrl : /_docs/#/instruction
EvalString_0 = EvalString_0 && (', "openSound": "' + EvalString_0 + '"');
EvalString_1 = EvalString_1 && (', "closeSound": "' + EvalString_1 + '"');
if (action_0.trim()) action_0 = ', "afterOpenDoor": [\n' + action_0 + ']';
var code = '{"time": '+Int_0+EvalString_0+EvalString_1+', "keys": {\n'+doorKeyList_0+'\n}'+action_0.trim()+'}';
return code;
*/;

doorKeyList
    : doorKeyKnown
    | doorKeyUnknown
    | doorKeyEmpty;


doorKeyKnown
    : Key_List ':' Int '需要但不消耗' Bool BEND


/* doorKeyKnown
tooltip : 开门需要钥匙
default : ['yellowKey', 1, false]
helpUrl : /_docs/#/instruction
if (Bool_0) Key_List_0 += ':o';
return '"'+Key_List_0+'": '+Int_0+', ';
*/;

doorKeyUnknown
    : IdString ':' Int '需要但不消耗' Bool BEND


/* doorKeyUnknown
tooltip : 开门需要钥匙
default : ['orangeKey', 1, false]
helpUrl : /_docs/#/instruction
allItems : ['IdString_0']
if (Bool_0) IdString_0 += ':o';
return '"'+IdString_0+'": '+Int_0+', ';
*/;


doorKeyEmpty
    :   Newline
    
/* doorKeyEmpty
var code = ' \n';
return code;
*/;


faceIds_m
    : '行走图朝向:' BGNL? Newline '向下ID' IdString? '向左ID' IdString? '向右ID' IdString? '向上ID' IdString?  BEND


/* faceIds_m
tooltip : 行走图朝向
default : ["","","",""]
allIds : ['IdString_0','IdString_1','IdString_2','IdString_3']
helpUrl : /_docs/#/instruction
return '{' + [
    IdString_0 && ('"down": "' + IdString_0 +'"'),
    IdString_1 && ('"left": "' + IdString_1 +'"'),
    IdString_2 && ('"right": "' + IdString_2 +'"'),
    IdString_3 && ('"up": "' + IdString_3 +'"'),
].filter(function (x) { return x; }).join(', ') + '}\n';
*/;


mainStyle_m
    : '主要样式设置：' '标题界面背景图：' EvalString BGNL? Newline 
      '竖屏标题界面背景图：' EvalString BGNL? Newline 
      '标题样式；可写 display: none 隐藏标题' EvalString BGNL? Newline 
      '标题按钮样式：' EvalString BGNL? Newline 
      '横屏状态栏背景；url(...) 0 0/100% 100% no-repeat 可将图片拉伸自适配' BGNL? Newline EvalString BGNL? Newline  
      '竖屏状态栏背景：' EvalString BGNL? Newline 
      '竖屏工具栏背景：' EvalString BGNL? Newline 
      '楼层切换样式：' EvalString BGNL? Newline
      '状态栏颜色' ColorString Colour '边框颜色' ColorString Colour BGNL? Newline
      '选中框颜色' ColorString Colour '全局字体' EvalString BEND

/* mainStyle_m
tooltip : 主要样式设置
default : ["project/images/bg.jpg", "project/images/bg.jpg", "color: white", "background-color: #32369F; opacity: 0.85; color: #FFFFFF; border: #FFFFFF 2px solid; caret-color: #FFD700;", "url(project/materials/ground.png) repeat", "url(project/materials/ground.png) repeat", "url(project/materials/ground.png) repeat", "background-color: black; color: white", "255,255,255,1", "rgba(255,255,255,1)", "204,204,204,1", "rgba(204,204,204,1)", "255,215,0,1", "rgba(255,215,0,1)", "Verdana"]
helpUrl : /_docs/#/instruction
var code = {
    startBackground: EvalString_0,
    startVerticalBackground: EvalString_1,
    startLogoStyle: EvalString_2,
    startButtonsStyle: EvalString_3,
    statusLeftBackground: EvalString_4,
    statusTopBackground: EvalString_5,
    toolsBackground: EvalString_6,
    floorChangingStyle: EvalString_7,
    statusBarColor: JSON.parse('['+ColorString_0+']'),
    borderColor: JSON.parse('['+ColorString_1+']'),
    selectColor: JSON.parse('['+ColorString_2+']'),
    font: EvalString_8
};
return JSON.stringify(code);
*/;

nameMap_m
    : '文件别名设置' '（可以游戏中使用此别名代替原始文件名）' BGNL? Newline nameMapList+ BEND

/* nameMap_m
tooltip : 文件别名设置
helpUrl : /_docs/#/instruction
var value = nameMapList_0.trim();
if (value.startsWith(',')) value = value.substring(1);
return '{'+value+'}';
*/;

nameMapList
    :   nameMapBgm
    |   nameMapSoundKnown
    |   nameMapSoundUnknown
    |   nameMapImage
    |   nameMapAnimate
    |   nameMapUnknown
    |   nameMapEmpty;

nameMapBgm
    : '映射背景音乐' '名称' EvalString '映射到文件' EvalString BEND

/* nameMapBgm
tooltip : 映射背景音乐
default : ['背景音乐', 'bgm.mp3']
allBgms : ['EvalString_1']
material : ["./project/bgms/", "EvalString_1"]
helpUrl : /_docs/#/instruction
return ',"'+EvalString_0+'":"'+EvalString_1+'"';
*/;

nameMapSoundKnown
    : '映射系统音效' '名称' NameMap_List '映射到文件' EvalString BEND

/* nameMapSoundKnown
tooltip : 映射系统音效
default : ['确定', 'confirm.mp3']
allSounds : ['EvalString_0']
material : ["./project/sounds/", "EvalString_0"]
helpUrl : /_docs/#/instruction
return ',"'+NameMap_List_0+'":"'+EvalString_0+'"';
*/;

nameMapSoundUnknown
    : '映射音效' '名称' EvalString '映射到文件' EvalString BEND

/* nameMapSoundUnknown
tooltip : 映射音效
default : ['攻击', 'attack.mp3']
allSounds : ['EvalString_1']
material : ["./project/sounds/", "EvalString_1"]
helpUrl : /_docs/#/instruction
return ',"'+EvalString_0+'":"'+EvalString_1+'"';
*/;

nameMapImage
    : '映射图片' '名称' EvalString '映射到文件' EvalString BEND

/* nameMapImage
tooltip : 映射图片
default : ['背景图', 'bg.jpg']
allImages : ['EvalString_1']
material : ["./project/images/:images", "EvalString_1"]
helpUrl : /_docs/#/instruction
return ',"'+EvalString_0+'":"'+EvalString_1+'"';
*/;

nameMapAnimate
    : '映射动画' '名称' EvalString '映射到文件' IdString BEND

/* nameMapAnimate
tooltip : 映射图片
default : ['领域', 'zone']
allAnimates : ['IdString_0']
material : ["./project/animates/", "IdString_0"]
helpUrl : /_docs/#/instruction
return ',"'+EvalString_0+'":"'+IdString_0+'"';
*/;

nameMapUnknown
    : '未知映射' '名称' EvalString '映射到文件' EvalString BEND

/* nameMapUnknown
tooltip : 未知映射
default : ['文件名', 'file.jpg']
helpUrl : /_docs/#/instruction
return ',"'+EvalString_0+'":"'+EvalString_1+'"';
*/;

nameMapEmpty
    :   Newline
    
/* nameMapEmpty
return ' \n';
*/;


splitImages_m
    :   '图片切分（你可以将一张png格式的大图切分为若干小图）' BGNL? splitImagesList+ BEND


/* splitImages_m
tooltip: 图片裁剪
helpUrl : /_docs/#/instruction
var code = '[\n'+splitImagesList_0+']\n';
return code;
*/;

splitImagesList
    : splitImagesOne
    | splitImagesEmpty;


splitImagesOne
    :   '图片切分项' '图片名' EvalString '每个小图宽度' Int '高度' Int '生成小图的前缀' EvalString BEND

/* splitImagesOne
tooltip : 图片裁剪项
helpUrl : /_docs/#/instruction
default : ['hero.png', 32, 32, 'hero_']
material : ["./project/images/:images", "EvalString_0"]
allImages : ['EvalString_0']
var code = '{"name": "'+EvalString_0+'", "width": '+Int_0+', "height": '+Int_1+', "prefix": "'+EvalString_1+'"},\n';
return code;
*/;

splitImagesEmpty
    :   Newline
    
/* splitImagesEmpty
var code = ' \n';
return code;
*/;

//为了避免关键字冲突,全部加了_s
//动作
action
    :   text_0_s
    |   text_1_s
    |   text_2_s
    |   moveTextBox_s
    |   clearTextBox_s
    |   comment_s
    |   autoText_s
    |   scrollText_s
    |   setText_s
    |   tip_s
    |   setValue_s
    |   setEnemy_s
    |   setEnemyOnPoint_s
    |   resetEnemyOnPoint_s
    |   moveEnemyOnPoint_s
    |   moveEnemyOnPoint_1_s
    |   setEquip_s
    |   setFloor_s
    |   setGlobalAttribute_s
    |   setGlobalValue_s
    |   setGlobalFlag_s
    |   setNameMap_s
    |   show_s
    |   hide_s
    |   setBlockOpacity_s
    |   setBlockFilter_s
    |   trigger_s
    |   insert_1_s
    |   insert_2_s
    |   exit_s
    |   setBlock_s
    |   turnBlock_s
    |   showFloorImg_s
    |   hideFloorImg_s
    |   showBgFgMap_s
    |   hideBgFgMap_s
    |   setBgFgBlock_s
    |   setHeroIcon_s
    |   update_s
    |   showStatusBar_s
    |   hideStatusBar_s
    |   setHeroOpacity_s
    |   sleep_s
    |   wait_s
    |   waitAsync_s
    |   stopAsync_s
    |   battle_s
    |   battle_1_s
    |   openDoor_s
    |   closeDoor_s
    |   changeFloor_s
    |   changePos_s
    |   setViewport_s
    |   setViewport_1_s
    |   lockViewport_s
    |   useItem_s
    |   loadEquip_s
    |   unloadEquip_s
    |   openShop_s
    |   disableShop_s
    |   follow_s
    |   unfollow_s
    |   animate_s
    |   animate_1_s
    |   stopAnimate_s
    |   vibrate_s
    |   showImage_s
    |   showImage_1_s
    |   hideImage_s
    |   showTextImage_s
    |   moveImage_s
    |   rotateImage_s
    |   scaleImage_s
    |   showGif_s
    |   setCurtain_0_s
    |   setCurtain_1_s
    |   screenFlash_s
    |   setWeather_s
    |   move_s
    |   moveAction_s
    |   moveHero_s
    |   jump_s
    |   jump_1_s
    |   jumpHero_s
    |   jumpHero_1_s
    |   playBgm_s
    |   pauseBgm_s
    |   resumeBgm_s
    |   loadBgm_s
    |   freeBgm_s
    |   playSound_s
    |   playSound_1_s
    |   stopSound_s
    |   setVolume_s
    |   setBgmSpeed_s
    |   win_s
    |   lose_s
    |   restart_s
    |   if_s
    |   if_1_s
    |   switch_s
    |   for_s
    |   forEach_s
    |   while_s
    |   dowhile_s
    |   break_s
    |   continue_s
    |   input_s
    |   input2_s
    |   choices_s
    |   confirm_s
    |   callBook_s
    |   callSave_s
    |   autoSave_s
    |   forbidSave_s
    |   callLoad_s
    |   previewUI_s
    |   clearMap_s
    |   setAttribute_s
    |   setFilter_s
    |   fillText_s
    |   fillBoldText_s
    |   drawTextContent_s
    |   fillRect_s
    |   strokeRect_s
    |   drawLine_s
    |   drawArrow_s
    |   fillPolygon_s
    |   strokePolygon_s
    |   fillEllipse_s
    |   strokeEllipse_s
    |   fillArc_s
    |   strokeArc_s
    |   drawImage_s
    |   drawImage_1_s
    |   drawIcon_s
    |   drawBackground_s
    |   drawSelector_s
    |   drawSelector_1_s
    |   unknown_s
    |   function_s
    |   pass_s
    ;

text_0_s
    :   '显示文章' ':' EvalString_Multi Newline
    

/* text_0_s
tooltip : text：显示一段文字（剧情）
helpUrl : /_docs/#/instruction
previewBlock : true
default : ["欢迎使用事件编辑器(双击方块可直接预览)"]
var code = '"'+EvalString_Multi_0+'"';
if (block.isCollapsed() || !block.isEnabled()) {
    code = '{"type": "text", "text": '+code;
    if (block.isCollapsed()) code += ', "_collapsed": true';
    if (!block.isEnabled()) code += ', "_disabled": true';
    code += '}';
}
return code+',\n';
*/;

text_1_s
    :   '标题' EvalString? '图像' EvalString? '对话框效果' EvalString? '起点 px' PosString? 'py' PosString? '宽' PosString? '编号' Int '不等待操作' Bool BGNL? Newline EvalString_Multi Newline
    

/* text_1_s
tooltip : text：显示一段文字（剧情）,选项较多请右键点击帮助
helpUrl : /_docs/#/instruction
previewBlock : true
allIds : ['EvalString_1']
default : ["小妖精","fairy","","","","",0,false,"欢迎使用事件编辑器(双击方块可直接预览)"]
var title='';
if (EvalString_0==''){
    if (EvalString_1=='' )title='';
    else title='\\t['+EvalString_1+']';
} else {
    if (EvalString_1=='')title='\\t['+EvalString_0+']';
    else title='\\t['+EvalString_0+','+EvalString_1+']';
}
var pos = '';
if (PosString_0 || PosString_1) {
    if (EvalString_2) throw new Error('对话框效果和起点像素位置只能设置一项！');
    pos = '[' + (PosString_0||0) + ',' + (PosString_1||0);
    if (PosString_2) pos += ',' + PosString_2;
    pos += ']';
}
if(EvalString_2 && !(/^(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?$/.test(EvalString_2))) {
  throw new Error('对话框效果的用法请右键点击帮助');
}
EvalString_2 = EvalString_2 && ('\\b['+EvalString_2+']');
var code =  '"'+title+EvalString_2+EvalString_Multi_0+'"';
if (block.isCollapsed() || !block.isEnabled() || pos || Int_0 || Bool_0) {
    code = '{"type": "text", "text": '+code;
    if (pos) code += ', "pos": ' + pos;
    if (Int_0) code += ', "code": ' + Int_0;
    if (Bool_0) code += ', "async": true';
    if (block.isCollapsed()) code += ', "_collapsed": true';
    if (!block.isEnabled()) code += ', "_disabled": true';
    code += '}';
}
return code+',\n';
*/;

text_2_s
    :   '标题' EvalString? '图像' EvalString? '对话框效果' EvalString? '起点 px' PosString? 'py' PosString? '宽' PosString? '编号' Int '不等待操作' Bool BGNL? Newline EvalString_Multi BGNL? Newline textDrawingList* Newline
    

/* text_2_s
tooltip : text：显示一段文字（剧情）,选项较多请右键点击帮助
helpUrl : /_docs/#/instruction
previewBlock : true
allIds : ['EvalString_1']
default : ["小妖精","fairy","","","","",0,"欢迎使用事件编辑器(双击方块可直接预览)",null]
var title='';
if (EvalString_0==''){
    if (EvalString_1=='' )title='';
    else title='\\t['+EvalString_1+']';
} else {
    if (EvalString_1=='')title='\\t['+EvalString_0+']';
    else title='\\t['+EvalString_0+','+EvalString_1+']';
}
var pos = '';
if (PosString_0 || PosString_1) {
    if (EvalString_2) throw new Error('对话框效果和起点像素位置只能设置一项！');
    pos = '[' + (PosString_0||0) + ',' + (PosString_1||0);
    if (PosString_2) pos += ',' + PosString_2;
    pos += ']';
}
if(EvalString_2 && !(/^(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?$/.test(EvalString_2))) {
  throw new Error('对话框效果的用法请右键点击帮助');
}
EvalString_2 = EvalString_2 && ('\\b['+EvalString_2+']');
var code =  '"'+title+EvalString_2+textDrawingList_0.replace(/\s/g, '')+EvalString_Multi_0+'"';
if (block.isCollapsed() || !block.isEnabled() || pos || Int_0 || Bool_0) {
    code = '{"type": "text", "text": '+code;
    if (pos) code += ', "pos": ' + pos;
    if (Int_0) code += ', "code": ' + Int_0;
    if (Bool_0) code += ', "async": true';
    if (block.isCollapsed()) code += ', "_collapsed": true';
    if (!block.isEnabled()) code += ', "_disabled": true';
    code += '}';
}
return code+',\n';
*/;

textDrawingList
    : textDrawing
    | textDrawingEmpty;


textDrawing
    : '立绘' EvalString '翻转' Reverse_List '绘制坐标' 'x' IntString 'y' IntString '宽' IntString? '高' IntString? BGNL? Newline
      '裁剪坐标' 'x' IntString? 'y' IntString? '宽' IntString? '高' IntString? '不透明度' EvalString? '旋转角度' IntString?

/* textDrawing
tooltip : 立绘
helpUrl : /_docs/#/instruction
default : ["fairy.png","null","0","0","","","","","","","",""]
colour : this.subColor
previewBlock : true
allImages : ['EvalString_0']
if (Reverse_List_0 && Reverse_List_0 != 'null') EvalString_0 += Reverse_List_0;
var list = [EvalString_0, IntString_0, IntString_1];
if (IntString_2 || IntString_3) {
    if (list.length != 3 || !IntString_2 || !IntString_3) {
        throw "绘制的宽和高需同时设置";
    }
    list.push(IntString_2);
    list.push(IntString_3);
}
if (IntString_4 || IntString_5 || IntString_6 || IntString_7) {
    if (list.length != 5) throw "如设置裁剪区域，请先设置绘制区域的宽高";
    if (!IntString_4 || !IntString_5 || !IntString_6 || !IntString_7) {
        throw "如设置裁剪区域，请同时设置全部的裁剪坐标和宽高";
    }
    list.splice(1, 0, IntString_4, IntString_5, IntString_6, IntString_7);
}
if (EvalString_1) {
    if (list.length != 9) throw "如设置不透明度，需填满所有坐标和宽高";
    var opacity = parseFloat(EvalString_1);
    if (isNaN(opacity) || opacity < 0 || opacity > 1) throw "不合法的不透明度，必须是0到1之间"
    list.push(opacity);
}
if (IntString_8) {
    if (list.length != 10) throw "如设置旋转角度，需填满所有坐标和宽高，以及不透明度";
    list.push(IntString_8);
}
return "\\f[" + list.join(",")+"]";
*/;

textDrawingEmpty
    :   Newline
    
/* textDrawingEmpty
var code = '';
return code;
*/;

moveTextBox_s
    :   '移动对话框' ':' Int 'px' PosString 'py' PosString '使用增量' Bool '移动方式' MoveMode_List '动画时间' Int '不等待执行完毕' Bool Newline

/* moveTextBox_s
tooltip : 移动对话框
helpUrl : /_docs/#/instruction
default : [1,"0","0",false,'',500,false]
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
Bool_0 = Bool_0 ?', "relative": true':'';
Bool_1 = Bool_1 ?', "async": true':'';
var code = '{"type": "moveTextBox", "code": '+Int_0+', "loc": ['+PosString_0+','+PosString_1+']'+Bool_0+MoveMode_List_0+', "time": '+Int_1+Bool_1+'},\n';
return code;
*/;

clearTextBox_s
    :   '清除对话框' ':' EvalString? Newline

/* clearTextBox_s
tooltip : 清除对话框
helpUrl : /_docs/#/instruction
default : ["1"]
if (EvalString_0 && !/^\d+(,\d+)*$/.test(EvalString_0)) throw new Error('对话框编号需要以逗号分隔');
EvalString_0 = EvalString_0 ? (', "code": ['+EvalString_0+']') : '';
var code = '{"type": "clearTextBox"'+EvalString_0+'},\n';
return code;
*/;


comment_s
    :   '添加注释' ':' EvalString_Multi Newline


/* comment_s
tooltip : comment：添加一段会被游戏跳过的注释内容
helpUrl : /_docs/#/instruction
doubleclicktext : EvalString_Multi_0
default : ["可以在这里写添加任何注释内容"]
colour : this.commentColor
var code = '{"type": "comment", "text": "'+EvalString_Multi_0+'"},\n';
return code;
*/;

autoText_s
    :   '自动剧情文本: 标题' EvalString? '图像' EvalString? '对话框效果' EvalString? '时间' Int BGNL? EvalString_Multi Newline
    

/* autoText_s
tooltip : autoText：自动剧情文本,用户无法跳过自动剧情文本,大段剧情文本请添加“是否跳过剧情”的提示
helpUrl : /_docs/#/instruction
doubleclicktext : EvalString_Multi_0
allIds : ['EvalString_1']
default : ["小妖精","fairy","",3000,"用户无法跳过自动剧情文本，大段剧情文本请添加“是否跳过剧情”的提示"]
var title='';
if (EvalString_0==''){
    if (EvalString_1=='' )title='';
    else title='\\t['+EvalString_1+']';
} else {
    if (EvalString_1=='')title='\\t['+EvalString_0+']';
    else title='\\t['+EvalString_0+','+EvalString_1+']';
}
if(EvalString_2 && !(/^(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?$/.test(EvalString_2))) {
  throw new Error('对话框效果的用法请右键点击帮助');
}
EvalString_2 = EvalString_2 && ('\\b['+EvalString_2+']');
var code =  '{"type": "autoText", "text": "'+title+EvalString_2+EvalString_Multi_0+'", "time": '+Int_0+'},\n';
return code;
*/;

scrollText_s
    :   '滚动剧情文本:' '时间' Int '行距' Number '不等待执行完毕' Bool? BGNL? EvalString_Multi Newline


/* scrollText_s
tooltip : scrollText：滚动剧情文本，将从下到上进行滚动显示。
helpUrl : /_docs/#/instruction
doubleclicktext : EvalString_Multi_0
default : [5000,1.4,false,"时间是总时间，可以使用setText事件来控制字体、颜色、大小、偏移量等"]
Bool_0 = Bool_0?', "async": true':'';
var code =  '{"type": "scrollText", "text": "'+EvalString_Multi_0+'"'+Bool_0+', "time" :'+Int_0+', "lineHeight": '+Number_0+'},\n';
return code;
*/;

setText_s
    :   '设置剧情文本的属性' '位置' SetTextPosition_List '偏移像素' IntString? '对齐' TextAlign_List? '粗体' B_1_List? BGNL? '标题颜色' ColorString? Colour '正文颜色' ColorString? Colour '背景色' EvalString? Colour BGNL? '标题大小' IntString? '正文大小' IntString? '行距' IntString? '打字间隔' IntString? '字符间距' IntString? '淡入淡出时间' IntString? Newline
    

/* setText_s
tooltip : setText：设置剧情文本的属性,颜色为RGB三元组或RGBA四元组,打字间隔为剧情文字添加的时间间隔,为整数或不填，字符间距为字符之间的距离，为整数或不填。
helpUrl : /_docs/#/instruction
previewBlock : true
default : [null,"",null,null,"",'rgba(255,255,255,1)',"",'rgba(255,255,255,1)',"",'rgba(255,255,255,1)',"","","","","",""]
SetTextPosition_List_0 =SetTextPosition_List_0==='null'?'': ', "position": "'+SetTextPosition_List_0+'"';
TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
var colorRe = MotaActionFunctions.pattern.colorRe;
IntString_0 = IntString_0 ? (', "offset": '+IntString_0) : '';
ColorString_0 = ColorString_0 ? (', "title": ['+ColorString_0+']') : '';
ColorString_1 = ColorString_1 ? (', "text": ['+ColorString_1+']') : '';
if (EvalString_0) {
  if (colorRe.test(EvalString_0)) {
    EvalString_0 = ', "background": ['+EvalString_0+']';
  }
  else if (/^\w+\.png$/.test(EvalString_0)) {
    EvalString_0 = ', "background": "'+EvalString_0+'"';
  }
  else {
    throw new Error('背景格式错误,必须是形如0~255,0~255,0~255,0~1的颜色，或一个WindowSkin的png图片名称');
  }
}
IntString_1 = IntString_1 ? (', "titlefont": '+IntString_1) : '';
IntString_2 = IntString_2 ? (', "textfont": '+IntString_2) : '';
IntString_3 = IntString_3 ? (', "lineHeight": '+IntString_3) : '';
IntString_4 = IntString_4 ? (', "time": '+IntString_4) : '';
IntString_5 = IntString_5 ? (', "letterSpacing": '+IntString_5) : '';
IntString_6 = IntString_6 ? (', "animateTime": ' + IntString_6) : '';
B_1_List_0 = B_1_List_0==='null'?'':', "bold": '+B_1_List_0;
var code = '{"type": "setText"'+SetTextPosition_List_0+IntString_0+TextAlign_List_0+B_1_List_0+ColorString_0+ColorString_1+EvalString_0+IntString_1+IntString_2+IntString_3+IntString_4+IntString_5+IntString_6+'},\n';
return code;
*/;

tip_s
    :   '显示提示' ':' EvalString '图标ID' IdString? Newline
    

/* tip_s
tooltip : tip：显示一段提示文字
helpUrl : /_docs/#/instruction
allIds : ['IdString_0']
default : ["这段话将在左上角以气泡形式显示",""]
IdString_0 = IdString_0 && (', "icon": "' + IdString_0 + '"');
var code = '{"type": "tip", "text": "'+EvalString_0+'"'+IdString_0+'},\n';
return code;
*/;

setValue_s
    :   '数值操作' ':' '名称' idString_e AssignOperator_List expression '不刷新状态栏' Bool Newline
    

/* setValue_s
tooltip : setValue：设置勇士的某个属性、道具个数, 或某个变量/Flag的值
helpUrl : /_docs/#/instruction
default : ["","","",false]
colour : this.dataColor
if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
  AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
} else AssignOperator_List_0 = '';
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "setValue", "name": "'+idString_e_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"' + Bool_0 + '},\n';
return code;
*/;


setEnemy_s
    :   '设置怪物属性' ':' '怪物ID' IdString '的' EnemyId_List AssignOperator_List expression '不刷新显伤' Bool Newline


/* setEnemy_s
tooltip : setEnemy：设置某个怪物的属性
helpUrl : /_docs/#/instruction
default : ["greenSlime", "atk", "=", "", false]
allEnemys : ['IdString_0']
colour : this.dataColor
if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
  AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
} else AssignOperator_List_0 = '';
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "setEnemy", "id": "'+IdString_0+'", "name": "'+EnemyId_List_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"'+Bool_0+'},\n';
return code;
*/;


setEquip_s
    :   '设置装备属性' ':' '装备ID' IdString EquipValueType_List '的' EvalString AssignOperator_List expression Newline


/* setEquip_s
tooltip : setEquip：设置某个怪物的属性
helpUrl : /_docs/#/instruction
default : ["sword1", "value", "atk", "="]
allEquips : ['IdString_0']
colour : this.dataColor
EquipValueType_List_0 = EquipValueType_List_0 == 'percentage' ? ', "valueType": "percentage"' : ', "valueType": "value"';
if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
  AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
} else AssignOperator_List_0 = '';
var code = '{"type": "setEquip", "id": "'+IdString_0+'"'+EquipValueType_List_0+', "name": "'+EvalString_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"},\n';
return code;
*/;


setEnemyOnPoint_s
    :   '设置某点怪物属性' ':' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '的' EnemyPoint_List AssignOperator_List expression '不刷新显伤' Bool Newline


/* setEnemyOnPoint_s
tooltip : setEnemyOnPoint：设置某个点上怪物的属性
helpUrl : /_docs/#/instruction
default : ["", "", "", "atk", "=", "", false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.dataColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
  AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
} else AssignOperator_List_0 = '';
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "setEnemyOnPoint"'+floorstr+IdString_0+', "name": "'+EnemyPoint_List_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"'+Bool_0+'},\n';
return code;
*/;

resetEnemyOnPoint_s
    :   '重置某点怪物属性' ':' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '不刷新显伤' Bool Newline


/* resetEnemyOnPoint_s
tooltip : resetEnemyOnPoint：重置某个点上怪物的属性
helpUrl : /_docs/#/instruction
default : ["", "", "", false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.dataColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "resetEnemyOnPoint"'+floorstr+IdString_0+Bool_0+'},\n';
return code;
*/;

moveEnemyOnPoint_s
    :   '移动某点怪物属性' ':' '起点' 'x' PosString? ',' 'y' PosString? '终点' 'x' PosString? 'y' PosString? '楼层' IdString? '不刷新显伤' Bool Newline


/* moveEnemyOnPoint_s
tooltip : moveEnemyOnPoint：移动某个点上怪物的属性到其他点
helpUrl : /_docs/#/instruction
default : ["", "", "", "", "", false]
allFloorIds : ['IdString_0']
selectPoint : ["PosString_2", "PosString_3"]
menu : [['选择起点位置','editor_blockly.selectPoint(block,["PosString_0", "PosString_1"])']]
colour : this.dataColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var floorstr = PosString_0 && PosString_1 ? ', "from": ['+PosString_0+','+PosString_1+']' : '';
if (PosString_2 && PosString_3) floorstr += ', "to": ['+PosString_2+','+PosString_3+']'
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "moveEnemyOnPoint"'+floorstr+IdString_0+Bool_0+'},\n';
return code;
*/;

moveEnemyOnPoint_1_s
    :   '移动某点怪物属性' ':' '起点' 'x' PosString? ',' 'y' PosString? '增量' 'dx' PosString? 'dy' PosString? '楼层' IdString? '不刷新显伤' Bool Newline


/* moveEnemyOnPoint_1_s
tooltip : moveEnemyOnPoint：移动某个点上怪物的属性到其他点
helpUrl : /_docs/#/instruction
default : ["", "", "", "", "", false]
allFloorIds : ['IdString_0']
selectPoint : ["PosString_0", "PosString_1"]
colour : this.dataColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var floorstr = PosString_0 && PosString_1 ? ', "from": ['+PosString_0+','+PosString_1+']' : '';
if (PosString_2 && PosString_3) floorstr += ', "dxy": ['+PosString_2+','+PosString_3+']'
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "moveEnemyOnPoint"'+floorstr+IdString_0+Bool_0+'},\n';
return code;
*/;

setFloor_s
    :   '设置楼层属性' ':' Floor_Meta_List '楼层名' IdString? '为' JsonEvalString Newline


/* setFloor_s
tooltip : setFloor：设置楼层属性；该楼层属性和编辑器中的楼层属性一一对应
helpUrl : /_docs/#/instruction
default : ["title","","\"新楼层名\""]
allFloorIds : ['IdString_0']
colour : this.dataColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "setFloor", "name": "'+Floor_Meta_List_0+'"'+IdString_0+', "value": '+JsonEvalString_0+'},\n';
return code;
*/;


setGlobalAttribute_s
    :   '设置全局属性' ':' Global_Attribute_List '为' EvalString Newline


/* setGlobalAttribute_s
tooltip : setGlobalAttribute：设置全局属性
helpUrl : /_docs/#/instruction
default : ["font","Verdana"]
colour : this.dataColor
var code = '{"type": "setGlobalAttribute", "name": "'+Global_Attribute_List_0+'", "value": "'+EvalString_0+'"},\n';
return code;
*/;


setGlobalValue_s
    :   '设置全局数值' ':' Global_Value_List '为' EvalString Newline


/* setGlobalValue_s
tooltip : setGlobalValue：设置全局属性
helpUrl : /_docs/#/instruction
default : ["lavaDamage","100"]
colour : this.dataColor
var code = '{"type": "setGlobalValue", "name": "'+Global_Value_List_0+'", "value": '+EvalString_0+'},\n';
return code;
*/;


setGlobalFlag_s
    :   '设置系统开关' ':' Global_Flag_List Bool Newline


/* setGlobalFlag_s
tooltip : setGlobalFlag：设置系统开关
helpUrl : /_docs/#/instruction
default : ["s:enableFloor","true"]
colour : this.dataColor
var code = '{"type": "setGlobalFlag", "name": "'+Global_Flag_List_0+'", "value": '+Bool_0+'},\n';
return code;
*/;


setNameMap_s
    :   '设置文件别名' ':' EvalString '为' EvalString? Newline


/* setNameMap_s
tooltip : setNameMap：设置文件别名
helpUrl : /_docs/#/instruction
default : ["背景音乐",""]
colour : this.dataColor
EvalString_1 = EvalString_1 ? (', "value": "' + EvalString_1 + '"') : '';
var code = '{"type": "setNameMap", "name": "'+EvalString_0+'"'+EvalString_1+'},\n';
return code;
*/;

show_s
    :   '显示事件' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '动画时间' IntString? '不等待执行完毕' Bool? Newline
    

/* show_s
tooltip : show: 将禁用事件启用,楼层和动画时间可不填,xy可用逗号分隔表示多个点
helpUrl : /_docs/#/instruction
default : ["","","","",false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0 ?', "async": true':'';
var code = '{"type": "show"'+floorstr+IdString_0+''+IntString_0+Bool_0+'},\n';
return code;
*/;

hide_s
    :   '隐藏事件' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '同时删除' Bool '动画时间' IntString? '不等待执行完毕' Bool? Newline
    

/* hide_s
tooltip : hide: 隐藏事件，同时可删除
helpUrl : /_docs/#/instruction
default : ["","","",true,"",false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0 ?', "remove": true':'';
Bool_1 = Bool_1 ?', "async": true':'';
var code = '{"type": "hide"'+floorstr+IdString_0+Bool_0+IntString_0+Bool_1+'},\n';
return code;
*/;

setBlockOpacity_s
    :   '设置图块不透明度' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '不透明度' Number '动画时间' IntString? '不等待执行完毕' Bool? Newline
    

/* setBlockOpacity_s
tooltip : setBlockOpacity: 设置图块不透明度
helpUrl : /_docs/#/instruction
default : ["","","",1.0,"",false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
if (Number_0 < 0 || Number_0 > 1) throw new Error('不透明度需要在0~1之间');
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0 ?', "async": true':'';
var code = '{"type": "setBlockOpacity"'+floorstr+IdString_0+', "opacity": '+Number_0+IntString_0+Bool_0+'},\n';
return code;
*/;

setBlockFilter_s
    :   '设置图块特效' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '虚化' Number '色相' Int '灰度' Number '反色' Bool '阴影' Number Newline
    

/* setBlockFilter_s
tooltip : setBlockFilter: 设置图块特效
helpUrl : /_docs/#/instruction
default : ["","","",0,0,0,false,0]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
if (Number_0 < 0) throw '虚化不得小于0；0为完全没有虚化';
if (Int_0 < 0 || Int_0 >= 360) throw '色相需要在0~359之间';
if (Number_1 < 0 || Number_1 > 1) throw '灰度需要在0~1之间';
if (Number_2 < 0) throw '阴影不得小于0；0为完全没有阴影';

var code = '{"type": "setBlockFilter"'+floorstr+IdString_0+', "blur": '+Number_0+', "hue": '+Int_0+', "grayscale": '+Number_1+', "invert": '+Bool_0+', "shadow": '+Number_2+'},\n';
return code;
*/;


trigger_s
    :   '触发系统事件' 'x' PosString? ',' 'y' PosString? Newline
    

/* trigger_s
tooltip : trigger: 立即触发另一个地点的事件
helpUrl : /_docs/#/instruction
default : ["",""]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.eventColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
var code = '{"type": "trigger"'+floorstr+'},\n';
return code;
*/;

insert_1_s
    :   '插入公共事件' EvalString '参数列表' JsonEvalString? Newline


/* insert_1_s
tooltip : insert: 插入公共事件并执行
helpUrl : /_docs/#/instruction
allEvents : ['EvalString_0']
default : ["加点事件", ""]
colour : this.eventColor
if (JsonEvalString_0) {
    if (!(JSON.parse(JsonEvalString_0) instanceof Array))
        throw new Error('参数列表必须是个有效的数组！');
    JsonEvalString_0 = ', "args": ' +JsonEvalString_0;
}
var code = '{"type": "insert", "name": "'+EvalString_0+'"'+JsonEvalString_0+'},\n';
return code;
*/;

insert_2_s
    :   '插入事件' 'x' PosString? ',' 'y' PosString? Event_List? '楼层' IdString? '参数列表' JsonEvalString? Newline


/* insert_2_s
tooltip : insert: 立即插入另一个地点的事件执行，当前事件不会中断，事件坐标不会改变
helpUrl : /_docs/#/instruction
default : ["0","0",null,"",""]
colour : this.eventColor
allFloorIds : ['IdString_0']
selectPoint : ["PosString_0", "PosString_1", "IdString_0"]
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
if (JsonEvalString_0) {
    if (!(JSON.parse(JsonEvalString_0) instanceof Array))
        throw new Error('参数列表必须是个有效的数组！');
    JsonEvalString_0 = ', "args": ' +JsonEvalString_0;
}
if (Event_List_0 && Event_List_0 !=='null')
    Event_List_0 = ', "which": "'+Event_List_0+'"';
else Event_List_0 = '';
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
var code = '{"type": "insert"'+floorstr+Event_List_0+IdString_0+JsonEvalString_0+'},\n';
return code;
*/;

exit_s
    :   '立刻结束当前事件' Newline
    

/* exit_s
tooltip : exit: 立刻结束当前事件
helpUrl : /_docs/#/instruction
colour : this.eventColor
var code = '{"type": "exit"},\n';
return code;
*/;

setBlock_s
    :   '转变图块为' EvalString 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '动画时间' IntString? '不等待执行完毕' Bool Newline
    

/* setBlock_s
tooltip : setBlock：设置某个图块,忽略坐标楼层则为当前事件
helpUrl : /_docs/#/instruction
colour : this.mapColor
allFloorIds : ['IdString_0']
allIds : ['EvalString_0']
default : ["yellowDoor","","","","",false]
selectPoint : ["EvalString_1", "EvalString_2", "IdString_0"]
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_1, EvalString_2);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
IntString_0 = IntString_0 && (', "time": ' + IntString_0);
Bool_0 = Bool_0 ? (', "async": true') : '';
var code = '{"type": "setBlock", "number": "'+EvalString_0+'"'+floorstr+IdString_0+IntString_0+Bool_0+'},\n';
return code;
*/;

turnBlock_s
    :   '事件转向' DirectionEx_List 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline
    

/* turnBlock_s
tooltip : turnBlock：事件转向；自动检索faceIds
helpUrl : /_docs/#/instruction
colour : this.mapColor
allFloorIds : ['IdString_0']
default : [null,"","",""]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "turnBlock"'+DirectionEx_List_0+floorstr+IdString_0+'},\n';
return code;
*/;

showFloorImg_s
    :   '显示贴图' '像素坐标' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* showFloorImg_s
tooltip : showFloorImg: 显示一个贴图，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : /_docs/#/instruction
default : ["","",""]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "showFloorImg"'+floorstr+IdString_0+'},\n';
return code;
*/;

hideFloorImg_s
    :   '隐藏贴图' '像素坐标' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* hideFloorImg_s
tooltip : hideFloorImg: 隐藏一个贴图，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : /_docs/#/instruction
default : ["","",""]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "hideFloorImg"'+floorstr+IdString_0+'},\n';
return code;
*/;

showBgFgMap_s
    :   '显示图层块' Bg_Fg_List 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* showBgFgMap_s
tooltip : showBgFgMap: 显示图层块，即背景图层/前景图层的某些图块，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : /_docs/#/instruction
default : ["bg","","",""]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "showBgFgMap", "name": "' + Bg_Fg_List_0 + '"' +floorstr+IdString_0+'},\n';
return code;
*/;

hideBgFgMap_s
    :   '隐藏图层块' Bg_Fg_List 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* hideBgFgMap_s
tooltip : hideBgFgMap: 隐藏图层块，即背景图层/前景图层的某些图块，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : /_docs/#/instruction
default : ["bg","","",""]
allFloorIds : ['IdString_0']
colour : this.mapColor
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "hideBgFgMap", "name": "' + Bg_Fg_List_0 + '"' +floorstr+IdString_0+'},\n';
return code;
*/;

setBgFgBlock_s
    :   '转变图层块' Bg_Fg_List '为' EvalString 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* setBgFgBlock_s
tooltip : setBgFgBlock：设置某个图层块,忽略坐标楼层则为当前点
helpUrl : /_docs/#/instruction
colour : this.mapColor
selectPoint : ["EvalString_1", "EvalString_2", "IdString_0"]
allIds : ['EvalString_0']
allFloorIds : ['IdString_0']
default : ["bg","yellowDoor","","",""]
var floorstr = MotaActionFunctions.processMultiLoc(EvalString_1, EvalString_2);
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "setBgFgBlock", "name": "' + Bg_Fg_List_0 + '", "number": "'+EvalString_0+'"'+floorstr+IdString_0+'},\n';
return code;
*/;

setHeroIcon_s
    :   '更改角色行走图' EvalString? '不重绘' Bool Newline
    

/* setHeroIcon_s
tooltip : setHeroIcon：更改角色行走图
helpUrl : /_docs/#/instruction
colour : this.dataColor
default : ["hero.png", false]
allImages : ['EvalString_0']
material : ["./project/images/:images", "EvalString_0"]
EvalString_0 = EvalString_0 && (', "name": "'+EvalString_0+'"');
Bool_0 = Bool_0 ? (', "noDraw": true') : '';
var code = '{"type": "setHeroIcon"'+EvalString_0+Bool_0+'},\n';
return code;
*/;

update_s
    :   '更新状态栏和地图显伤' '不检查自动事件' Bool Newline
    

/* update_s
tooltip : update: 立刻更新状态栏和地图显伤
helpUrl : /_docs/#/instruction
default : [false]
colour : this.dataColor
Bool_0 = Bool_0 ? (', "doNotCheckAutoEvents": true') : ''
var code = '{"type": "update"'+Bool_0+'},\n';
return code;
*/;

showStatusBar_s
    :   '显示状态栏' Newline


/* showStatusBar_s
tooltip : showStatusBar: 显示状态栏
helpUrl : /_docs/#/instruction
colour : this.soundColor
var code = '{"type": "showStatusBar"},\n';
return code;
*/;

hideStatusBar_s
    :   '隐藏状态栏' '不隐藏竖屏工具栏' Bool Newline


/* hideStatusBar_s
tooltip : hideStatusBar: 隐藏状态栏
helpUrl : /_docs/#/instruction
colour : this.soundColor
default : [false]
Bool_0 = Bool_0?', "toolbox": true':'';
var code = '{"type": "hideStatusBar"'+Bool_0+'},\n';
return code;
*/;

setHeroOpacity_s
    :   '设置勇士不透明度' Number '渐变方式' MoveMode_List '动画时间' IntString? '不等待执行完毕' Bool Newline

/* setHeroOpacity_s
tooltip : setHeroOpacity: 设置勇士不透明度
helpUrl : /_docs/#/instruction
default : [1,'','',false]
colour : this.soundColor
if (Number_0 < 0 || Number_0 > 1) throw new Error('不透明度需要在0~1之间');
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
IntString_0 = IntString_0 && (', "time": ' + IntString_0);
Bool_0 = Bool_0 ? (', "async": true') : '';
var code = '{"type": "setHeroOpacity", "opacity": '+Number_0+MoveMode_List_0+IntString_0+Bool_0+'},\n';
return code;
*/;

sleep_s
    :   '等待' Int '毫秒' '不可被Ctrl跳过' Bool Newline
    

/* sleep_s
tooltip : sleep: 等待多少毫秒
helpUrl : /_docs/#/instruction
default : [500, false]
colour : this.soundColor
Bool_0 = Bool_0?', "noSkip": true':'';
var code = '{"type": "sleep", "time": '+Int_0+Bool_0+'},\n';
return code;
*/;


battle_s
    :   '强制战斗' IdString Newline
    

/* battle_s
tooltip : battle: 强制战斗
helpUrl : /_docs/#/instruction
default : ["greenSlime"]
allEnemys : ['IdString_0']
colour : this.dataColor
var code = '{"type": "battle", "id": "'+IdString_0+'"},\n';
return code;
*/;


battle_1_s
    :   '强制战斗' 'x' PosString? ',' 'y' PosString? Newline


/* battle_1_s
tooltip : battle: 强制战斗
helpUrl : /_docs/#/instruction
default : ["","",""]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.mapColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
var code = '{"type": "battle"'+floorstr+'},\n';
return code;
*/;

openDoor_s
    :   '开门' 'x' PosString? ',' 'y' PosString? '楼层' IdString? '需要钥匙' Bool? '不等待执行完毕' Bool Newline
    

/* openDoor_s
tooltip : openDoor: 开门,楼层可不填表示当前层
helpUrl : /_docs/#/instruction
default : ["","","",false,false]
selectPoint : ["PosString_0", "PosString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
Bool_0 = Bool_0 ? ', "needKey": true' : '';
Bool_1 = Bool_1 ? ', "async": true' : '';
var code = '{"type": "openDoor"'+floorstr+IdString_0+Bool_0+Bool_1+'},\n';
return code;
*/;

closeDoor_s
    :   '关门' 'x' PosString? ',' 'y' PosString? 'ID' IdString '不等待执行完毕' Bool Newline


/* closeDoor_s
tooltip : closeDoor: 关门事件，需要该点本身无事件
helpUrl : /_docs/#/instruction
default : ["","","yellowDoor",false]
selectPoint : ["PosString_0", "PosString_1"]
allDoors : ['IdString_0']
colour : this.mapColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
Bool_0 = Bool_0 ? ', "async": true' : '';
var code = '{"type": "closeDoor", "id": "'+IdString_0+'"'+floorstr+Bool_0+'},\n';
return code;
*/;

changeFloor_s
    :   '楼层切换' Floor_List IdString? Stair_List 'x' PosString? ',' 'y' PosString? '朝向' DirectionEx_List '动画时间' IntString? Newline
    

/* changeFloor_s
tooltip : changeFloor: 楼层切换,动画时间可不填
helpUrl : /_docs/#/instruction
default : [null,"",null,"","",null,"",null]
selectPoint : ["PosString_0", "PosString_1", "IdString_0", true]
allFloorIds : ['IdString_0']
colour : this.dataColor
var toFloorId = IdString_0;
if (Floor_List_0!='floorId') toFloorId = Floor_List_0;
toFloorId = toFloorId ? (', "floorId": "' + toFloorId +'"') : '';
var loc = '';
if (PosString_0 && PosString_1) {
  loc = ', "loc": ['+PosString_0+', '+PosString_1+']';
}
if (Stair_List_0===':now') loc = '';
else if (Stair_List_0!=='loc')loc = ', "stair": "'+Stair_List_0+'"';
if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
var code = '{"type": "changeFloor"'+toFloorId+loc+DirectionEx_List_0+IntString_0+' },\n';
return code;
*/;

changePos_s
    :   '位置朝向切换' 'x' PosString? ',' 'y' PosString? '朝向' DirectionEx_List Newline
    

/* changePos_s
tooltip : changePos: 当前位置切换
helpUrl : /_docs/#/instruction
default : ["","",null]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.dataColor
var loc = (PosString_0 && PosString_1) ? (', "loc": ['+PosString_0+','+PosString_1+']') : '';
if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
var code = '{"type": "changePos"'+loc+DirectionEx_List_0+'},\n';
return code;
*/;

useItem_s
    :   '使用道具' IdString Newline


/* useItem_s
tooltip : useItem: 使用道具
helpUrl : /_docs/#/instruction
colour : this.dataColor
allItems : ['IdString_0']
default : ["pickaxe"]
var code = '{"type": "useItem", "id": "'+IdString_0+'"},\n';
return code;
*/;

loadEquip_s
    :   '装上装备' IdString Newline


/* loadEquip_s
tooltip : loadEquip: 装上装备
helpUrl : /_docs/#/instruction
colour : this.dataColor
default : ["sword1"]
allEquips : ['IdString_0']
var code = '{"type": "loadEquip", "id": "'+IdString_0+'"},\n';
return code;
*/;

unloadEquip_s
    :   '卸下第' Int '格装备孔的装备' Newline


/* unloadEquip_s
tooltip : unloadEquip: 卸下装备
helpUrl : /_docs/#/instruction
colour : this.dataColor
default : [0]
var code = '{"type": "unloadEquip", "pos": '+Int_0+'},\n';
return code;
*/;

openShop_s
    :   '启用全局商店' IdString '同时打开' Bool Newline
    

/* openShop_s
tooltip : 全局商店
helpUrl : /_docs/#/instruction
colour : this.dataColor
default : ["shop1", true]
allShops : ['IdString_0']
Bool_0 = Bool_0 ? (', "open": true') : '';
var code = '{"type": "openShop", "id": "'+IdString_0+'"'+Bool_0+'},\n';
return code;
*/;

disableShop_s
    :   '禁用全局商店' IdString Newline
    

/* disableShop_s
tooltip : 全局商店
helpUrl : /_docs/#/instruction
default : ["shop1"]
allShops : ['IdString_0']
colour : this.dataColor
var code = '{"type": "disableShop", "id": "'+IdString_0+'"},\n';
return code;
*/;

follow_s
    :   '跟随勇士' '行走图' EvalString Newline


/* follow_s
tooltip : follow: 跟随勇士
helpUrl : /_docs/#/instruction
default : ["npc.png"]
allImages : ['EvalString_0']
material : ["./project/images/:images", "EvalString_0"]
colour : this.dataColor
var code = '{"type": "follow", "name": "'+EvalString_0+'"},\n';
return code;
*/;

unfollow_s
    :   '取消跟随' '行走图' EvalString? Newline


/* unfollow_s
tooltip : unfollow: 取消跟随
helpUrl : /_docs/#/instruction
default : [""]
allImages : ['EvalString_0']
material : ["./project/images/:images", "EvalString_0"]
colour : this.dataColor
EvalString_0 = EvalString_0 ? (', "name": "' + EvalString_0 + '"') : "";
var code = '{"type": "unfollow"' + EvalString_0 + '},\n';
return code;
*/;

vibrate_s
    :   '画面震动' '方向' Vibrate_List '时间' Int '速度' Int '振幅' Int '不等待执行完毕' Bool Newline


/* vibrate_s
tooltip : vibrate: 画面震动
helpUrl : /_docs/#/instruction
default : ["horizontal",2000,10,10,false]
colour : this.soundColor
var async = Bool_0?', "async": true':''
var code = '{"type": "vibrate", "direction": "'+Vibrate_List_0+'", "time": '+Int_0+', "speed": '+Int_1+', "power": '+Int_2+async+'},\n';
return code;
*/;

animate_s
    :   '显示动画' EvalString '位置' 'x' PosString? 'y' PosString? '相对窗口坐标' Bool '不等待执行完毕' Bool Newline
    

/* animate_s
tooltip : animate：显示动画,位置填hero或者1,2形式的位置,或者不填代表当前事件点
helpUrl : /_docs/#/instruction
default : ["zone","","",false,false]
allAnimates : ['EvalString_0']
material : ["./project/animates/", "EvalString_0"]
menu : [['选择位置', 'editor_blockly.selectPoint(block, ["PosString_0", "PosString_1"])']]
colour : this.soundColor
var loc = PosString_0&&PosString_1?(', "loc": ['+PosString_0+','+PosString_1+']'):'';
Bool_0 = Bool_0?', "alignWindow": true':'';
Bool_1 = Bool_1?', "async": true':'';
var code = '{"type": "animate", "name": "'+EvalString_0+'"'+loc+Bool_0+Bool_1+'},\n';
return code;
*/;

animate_1_s
    :   '显示动画并跟随角色' EvalString '不等待执行完毕' Bool Newline
    

/* animate_1_s
tooltip : animate：显示动画并跟随角色
helpUrl : /_docs/#/instruction
default : ["zone",false]
allAnimates : ['EvalString_0']
material : ["./project/animates/", "EvalString_0"]
colour : this.soundColor
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "animate", "name": "'+EvalString_0+'", "loc": "hero"'+Bool_0+'},\n';
return code;
*/;

stopAnimate_s
    :   '停止所有动画' '执行动画回调' Bool Newline

/* stopAnimate_s
tooltip : stopAnimate：停止所有动画
helpUrl : /_docs/#/instruction
default : [false]
colour : this.soundColor
Bool_0 = Bool_0?', "doCallback": true':'';
var code = '{"type": "stopAnimate"'+Bool_0+'},\n';
return code;
*/;

setViewport_s
    :   '设置视角' '左上角坐标' 'x' PosString? ',' 'y' PosString? '移动方式' MoveMode_List '动画时间' Int '不等待执行完毕' Bool Newline


/* setViewport_s
tooltip : setViewport: 设置视角
helpUrl : /_docs/#/instruction
default : ["","","",0,false]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.soundColor
var loc = '';
if (PosString_0 && PosString_1) {
    loc = ', "loc": ['+PosString_0+','+PosString_1+']';
}
Int_0 = Int_0 ?(', "time": '+Int_0):'';
Bool_0 = Bool_0?', "async": true':'';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var code = '{"type": "setViewport"'+loc+MoveMode_List_0+Int_0+Bool_0+'},\n';
return code;
*/;

setViewport_1_s
    :   '设置视角' '增量坐标' 'dx' PosString? ',' 'dy' PosString? '移动方式' MoveMode_List '动画时间' Int '不等待执行完毕' Bool Newline


/* setViewport_1_s
tooltip : setViewport: 设置视角
helpUrl : /_docs/#/instruction
default : ["0","0","",0,false]
colour : this.soundColor
var loc = '';
if (PosString_0 && PosString_1) {
    loc = ', "dxy": ['+PosString_0+','+PosString_1+']';
}
Int_0 = Int_0 ?(', "time": '+Int_0):'';
Bool_0 = Bool_0?', "async": true':'';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var code = '{"type": "setViewport"'+loc+MoveMode_List_0+Int_0+Bool_0+'},\n';
return code;
*/;

lockViewport_s
    :   '是否锁定视角' Bool Newline

/* lockViewport_s
tooltip : lockViewport: 是否锁定视角
helpUrl : /_docs/#/instruction
default : [false]
colour : this.soundColor
Bool_0 = Bool_0 ? (', "lock": true') : '';
var code = '{"type": "lockViewport"'+Bool_0+'},\n';
return code;
*/;

showImage_s
    :   '显示图片' '图片编号' NInt '图片' EvalString '翻转' Reverse_List BGNL?
        '绘制的起点像素' 'x' PosString 'y' PosString '不透明度' Number '时间' Int '不等待执行完毕' Bool Newline
    

/* showImage_s
tooltip : showImage：显示图片
helpUrl : /_docs/#/instruction
default : [1,"bg.jpg","null","0","0",1,0,false]
allImages : ['EvalString_0']
menu : [['选择图片','editor_blockly.selectMaterial(block, ["./project/images/:images", "EvalString_0"])']]
previewBlock : true
colour : this.imageColor
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
var async = Bool_0?', "async": true':'';
var code = '{"type": "showImage", "code": '+NInt_0+', "image": "'+EvalString_0+'"'+Reverse_List_0+', "loc": ['+PosString_0+','+PosString_1+'], "opacity": '+Number_0+', "time": '+Int_0+async+'},\n';
return code;
*/;

showImage_1_s
    :   '显示图片' '图片编号' NInt '图片' EvalString '翻转' Reverse_List BGNL?
        '裁剪的起点像素' 'x' PosString 'y' PosString '宽' PosString? '高' PosString? '不透明度' Number BGNL?
        '绘制的起点像素' 'x' PosString 'y' PosString '宽' PosString? '高' PosString? '时间' Int '不等待执行完毕' Bool Newline


/* showImage_1_s
tooltip : showImage_1：显示图片
helpUrl : /_docs/#/instruction
default : [1,"bg.jpg","null","0","0","","",1,"0","0","","",0,false]
allImages : ['EvalString_0']
menu : [['选择图片','editor_blockly.selectMaterial(block, ["./project/images/:images", "EvalString_0"])']]
previewBlock : true
colour : this.imageColor
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
var async = Bool_0?', "async": true':'';
var code = '{"type": "showImage", "code": '+NInt_0+', "image": "'+EvalString_0+'"'+Reverse_List_0+', '+
           '"sloc": ['+PosString_0+','+PosString_1+','+PosString_2+','+PosString_3+'], '+
           '"loc": ['+PosString_4+','+PosString_5+','+PosString_6+','+PosString_7+'], '+
           '"opacity": '+Number_0+', "time": '+Int_0+async+'},\n';
return code;
*/;

showTextImage_s
    :   '显示图片化文本' EvalString_Multi BGNL?
        '图片编号' NInt '起点像素' 'x' PosString 'y' PosString '行距' Number '翻转' Reverse_List '不透明度' Number '时间' Int '不等待执行完毕' Bool Newline
    

/* showTextImage_s
tooltip : showTextImage：显示图片化文本
helpUrl : /_docs/#/instruction
colour : this.imageColor
doubleclicktext : EvalString_Multi_0
default : ["可以使用setText事件来控制字体、颜色、大小、偏移量等",1,"0","0",1.4,"null",1,0,false]
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
var async = Bool_0?', "async": true':'';
var code = '{"type": "showTextImage", "code": '+NInt_0+', "text": "'+EvalString_Multi_0+'", "loc": ['+PosString_0+','+PosString_1+'], "lineHeight": '+Number_0+Reverse_List_0+', "opacity": '+Number_1+', "time": '+Int_0+async+'},\n';
return code;
*/;

hideImage_s
    :   '清除图片' '图片编号' NInt '时间' Int '不等待执行完毕' Bool Newline
    

/* hideImage_s
tooltip : hideImage：清除图片
helpUrl : /_docs/#/instruction
default : [1,0,false]
colour : this.imageColor
var async = Bool_0?', "async": true':'';
var code = '{"type": "hideImage", "code": '+NInt_0+', "time": '+Int_0+async+'},\n';
return code;
*/;

showGif_s
    :   '显示或清除动图' EvalString? '起点像素位置' 'x' PosString? 'y' PosString? Newline
    

/* showGif_s
tooltip : showGif：显示动图
helpUrl : /_docs/#/instruction
default : ["","",""]
allImages : ['EvalString_0']
previewBlock : true
colour : this.imageColor
EvalString_0 = EvalString_0 ? (', "name": "'+EvalString_0+'"') : '';
var loc = (PosString_0 && PosString_1) ? (', "loc": ['+PosString_0+','+PosString_1+']') : '';
var code = '{"type": "showGif"'+EvalString_0+loc+'},\n';
return code;
*/;

moveImage_s
    :   '图片移动' '图片编号' NInt '终点像素位置' 'x' PosString? 'y' PosString? BGNL?
        '不透明度' EvalString? '移动方式' MoveMode_List '移动时间' Int '不等待执行完毕' Bool Newline
    

/* moveImage_s
tooltip : moveImage：图片移动
helpUrl : /_docs/#/instruction
default : [1,'','','','',500,false]
colour : this.imageColor
var toloc = '';
if (PosString_0 && PosString_1)
  toloc = ', "to": ['+PosString_0+','+PosString_1+']';
EvalString_0 = (EvalString_0!=='') ? (', "opacity": '+EvalString_0):'';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "moveImage", "code": '+NInt_0+toloc+MoveMode_List_0+EvalString_0+', "time": '+Int_0+async+'},\n';
return code;
*/;

rotateImage_s
    :   '图片旋转' '图片编号' NInt '中心点像素' 'x' PosString? 'y' PosString? '移动方式' MoveMode_List BGNL? '旋转度数（正数顺时针，负数逆时针）' NInt '旋转时间' Int '不等待执行完毕' Bool Newline
    

/* rotateImage_s
tooltip : rotateImage：图片旋转
helpUrl : /_docs/#/instruction
default : [1,'','','',90,500,false]
colour : this.imageColor
var loc = '';
if (PosString_0 && PosString_1)
  loc = ', "center": ['+PosString_0+','+PosString_1+']';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "rotateImage", "code": '+NInt_0+loc+', "angle": '+NInt_1+MoveMode_List_0+', "time": '+Int_0+async+'},\n';
return code;
*/;

scaleImage_s
    :   '图片放缩' '图片编号' NInt '中心点像素' 'x' PosString? 'y' PosString? '移动方式' MoveMode_List BGNL? '放缩比例' Number '动画时间' Int '不等待执行完毕' Bool Newline
       

/* scaleImage_s
tooltip : scaleImage：图片放缩
helpUrl : /_docs/#/instruction
default : [1,'','','',0.8,0,false]
colour : this.imageColor
if (Number_0 <= 0) throw new Error('放缩比例需要大于0'); 
var loc = '';
if (PosString_0 && PosString_1)
  loc = ', "center": ['+PosString_0+','+PosString_1+']';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "scaleImage", "code": '+NInt_0+loc+', "scale": '+Number_0+MoveMode_List_0+', "time": '+Int_0+async+'},\n';
return code;
*/;

setCurtain_0_s
    :   '更改画面色调' ColorString Colour '动画时间' IntString? BGNL? Newline '渐变方式' MoveMode_List '持续到下一个本事件' Bool '不等待执行完毕' Bool Newline
    

/* setCurtain_0_s
tooltip : setCurtain: 更改画面色调,动画时间可不填
helpUrl : /_docs/#/instruction
default : ["255,255,255,1",'rgba(255,255,255,1)',500,'',true,false]
colour : this.soundColor
previewBlock : true
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
Bool_0 = Bool_0 ? ', "keep": true' : '';
var async = Bool_1?', "async": true':'';
var code = '{"type": "setCurtain", "color": ['+ColorString_0+']'+IntString_0+MoveMode_List_0+Bool_0+async+'},\n';
return code;
*/;

setCurtain_1_s
    :   '恢复画面色调' '动画时间' IntString? '渐变方式' MoveMode_List '不等待执行完毕' Bool Newline
    

/* setCurtain_1_s
tooltip : setCurtain: 恢复画面色调,动画时间可不填
helpUrl : /_docs/#/instruction
default : [500,'',false]
colour : this.soundColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "setCurtain"'+IntString_0+MoveMode_List_0 +async+'},\n';
return code;
*/;

screenFlash_s
    :   '画面闪烁' ColorString Colour '单次时间' Int '执行次数' IntString? '渐变方式' MoveMode_List '不等待执行完毕' Bool Newline

/* screenFlash_s
tooltip : screenFlash: 画面闪烁,动画时间可不填
helpUrl : /_docs/#/instruction
default : ["255,255,255,1",'rgba(255,255,255,1)',500,1,'',false]
colour : this.soundColor
if (ColorString_0 == '') throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
IntString_0 = IntString_0 ? (', "times": '+IntString_0):'';
MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "screenFlash", "color": ['+ColorString_0+'], "time": '+Int_0 +IntString_0+MoveMode_List_0+async+'},\n';
return code;
*/;

setWeather_s
    :   '更改天气' Weather_List '强度' Int '持续到下个本事件' Bool Newline
    

/* setWeather_s
tooltip : setWeather：更改天气
helpUrl : /_docs/#/instruction
default : [null,1,true]
colour : this.soundColor
if(Int_0<1 || Int_0>10) throw new Error('天气的强度等级, 在1-10之间');
Bool_0 = Bool_0 ? ', "keep": true' : ''
var code = '{"type": "setWeather", "name": "'+Weather_List_0+'", "level": '+Int_0+Bool_0+'},\n';
if(Weather_List_0===''||Weather_List_0==='null'||Weather_List_0==null)code = '{"type": "setWeather"},\n';
return code;
*/;

move_s
    :   '移动事件' 'x' PosString? ',' 'y' PosString? '动画时间' IntString? '不消失' Bool '不等待执行完毕' Bool BGNL? moveDirection+ Newline
    

/* move_s
tooltip : move: 让某个NPC/怪物移动,位置可不填代表当前事件
helpUrl : /_docs/#/instruction
default : ["","",500,true,false,null]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.mapColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "keep": true':'';
Bool_1 = Bool_1?', "async": true':'';
var code = '{"type": "move"'+floorstr+IntString_0+Bool_0+Bool_1+', "steps": ['+moveDirection_0.trim().substring(2)+']},\n';
return code;
*/;

moveDirection
    :   '移动方向' Move_List '格数' Int Newline

/* moveDirection
tooltip : 移动方向
helpUrl : /_docs/#/instruction
default : ["up", 0]
colour : this.subColor
if (Move_List_0 == 'speed' && Int_0 < 16) throw '设置的移动速度值不得小于16';
return ', "' + Move_List_0 + ':' + Int_0 + '"';
*/;

moveAction_s
    :   '勇士前进一格或撞击' Newline
    

/* moveAction_s
tooltip : moveAction: 前进一格或撞击
helpUrl : /_docs/#/instruction
colour : this.dataColor
return '{"type": "moveAction"},\n';
*/;



moveHero_s
    :   '无视地形移动勇士' '动画时间' IntString? '不等待执行完毕' Bool BGNL? moveDirection+ Newline
    

/* moveHero_s
tooltip : moveHero：移动勇士,用这种方式移动勇士的过程中将无视一切地形, 无视一切事件, 中毒状态也不会扣血
helpUrl : /_docs/#/instruction
default : ["",false,"上右3下2后4左前2"]
colour : this.mapColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "moveHero"'+IntString_0+Bool_0+', "steps": ['+moveDirection_0.trim().substring(2)+']},\n';
return code;
*/;

jump_s
    :   '跳跃事件' '起始 x' PosString? ',' 'y' PosString? '终止 x' PosString? ',' 'y' PosString? '动画时间' IntString? '不消失' Bool '不等待执行完毕' Bool Newline


/* jump_s
tooltip : jump: 让某个NPC/怪物跳跃
helpUrl : /_docs/#/instruction
default : ["","","","",500,true,false]
selectPoint : ["PosString_2", "PosString_3"]
menu : [['选择起点位置','editor_blockly.selectPoint(block,["PosString_0", "PosString_1"])']]
colour : this.mapColor

var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr += ', "from": ['+PosString_0+','+PosString_1+']';
}
if (PosString_2 && PosString_3) {
    floorstr += ', "to": ['+PosString_2+','+PosString_3+']';
}
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "keep": true':'';
Bool_1 = Bool_1?', "async": true':'';
var code = '{"type": "jump"'+floorstr+''+IntString_0+Bool_0+Bool_1+'},\n';
return code;
*/;

jump_1_s
    :   '跳跃事件' '起始 x' PosString? ',' 'y' PosString? '增量 dx' PosString? ',' 'dy' PosString? '动画时间' IntString? '不消失' Bool '不等待执行完毕' Bool Newline


/* jump_1_s
tooltip : jump: 让某个NPC/怪物跳跃，给定增量
helpUrl : /_docs/#/instruction
default : ["","","0","0",500,true,false]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.mapColor

var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr += ', "from": ['+PosString_0+','+PosString_1+']';
}
if (PosString_2 && PosString_3) {
    floorstr += ', "dxy": ['+PosString_2+','+PosString_3+']';
}
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "keep": true':'';
Bool_1 = Bool_1?', "async": true':'';
var code = '{"type": "jump"'+floorstr+''+IntString_0+Bool_0+Bool_1+'},\n';
return code;
*/;

jumpHero_s
    :   '跳跃勇士' 'x' PosString? ',' 'y' PosString? '动画时间' IntString? '不等待执行完毕' Bool Newline


/* jumpHero_s
tooltip : jumpHero: 跳跃勇士
helpUrl : /_docs/#/instruction
default : ["","",500,false]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.mapColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "jumpHero"'+floorstr+IntString_0+Bool_0+'},\n';
return code;
*/;

jumpHero_1_s
    :   '跳跃勇士' '增量 dx' PosString? ',' 'dy' PosString? '动画时间' IntString? '不等待执行完毕' Bool Newline


/* jumpHero_1_s
tooltip : jumpHero: 跳跃勇士，给定增量
helpUrl : /_docs/#/instruction
default : ["0","0",500,false]
colour : this.mapColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "dxy": ['+PosString_0+','+PosString_1+']';
}
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "jumpHero"'+floorstr+IntString_0+Bool_0+'},\n';
return code;
*/;

playBgm_s
    :   '播放背景音乐' EvalString '开始播放秒数' Int '持续到下个本事件' Bool Newline
    

/* playBgm_s
tooltip : playBgm: 播放背景音乐
helpUrl : /_docs/#/instruction
default : ["bgm.mp3", 0, true]
allBgms : ['EvalString_0']
material : ["./project/bgms/", "EvalString_0"]
colour : this.imageColor
Int_0 = Int_0 ? (', "startTime": '+Int_0) : '';
Bool_0 = Bool_0 ? ', "keep": true' : '';
var code = '{"type": "playBgm", "name": "'+EvalString_0+'"'+Int_0+Bool_0+'},\n';
return code;
*/;

pauseBgm_s
    :   '暂停背景音乐' Newline
    

/* pauseBgm_s
tooltip : pauseBgm: 暂停背景音乐
helpUrl : /_docs/#/instruction
colour : this.imageColor
var code = '{"type": "pauseBgm"},\n';
return code;
*/;

resumeBgm_s
    :   '恢复背景音乐' '从暂停位置继续播放' Bool Newline
    

/* resumeBgm_s
tooltip : resumeBgm: 恢复背景音乐
helpUrl : /_docs/#/instruction
colour : this.imageColor
Bool_0 = Bool_0 ? ', "resume": true' : '';
var code = '{"type": "resumeBgm"' + Bool_0 + '},\n';
return code;
*/;

loadBgm_s
    :   '预加载背景音乐' EvalString Newline


/* loadBgm_s
tooltip : loadBgm: 预加载某个背景音乐，之后可以直接播放
helpUrl : /_docs/#/instruction
default : ["bgm.mp3"]
allBgms : ['EvalString_0']
material : ["./project/bgms/", "EvalString_0"]
colour : this.imageColor
var code = '{"type": "loadBgm", "name": "'+EvalString_0+'"},\n';
return code;
*/;

freeBgm_s
    :   '释放背景音乐的缓存' EvalString Newline


/* freeBgm_s
tooltip : freeBgm: 释放背景音乐的缓存
helpUrl : /_docs/#/instruction
default : ["bgm.mp3"]
allBgms : ['EvalString_0']
colour : this.imageColor
var code = '{"type": "freeBgm", "name": "'+EvalString_0+'"},\n';
return code;
*/;

playSound_s
    :   '播放音效' EvalString '停止之前音效' Bool? '音调' IntString? '等待播放完毕' Bool? Newline
    

/* playSound_s
tooltip : playSound: 播放音效
helpUrl : /_docs/#/instruction
default : ["item.mp3",false,"",false]
colour : this.imageColor
allSounds : ['EvalString_0']
material : ["./project/sounds/", "EvalString_0"]
if (IntString_0) {
    if (parseInt(IntString_0) < 30 || parseInt(IntString_0) > 300) throw '音调设置只能在30-300之间；100为正常音调。';
    IntString_0 = ', "pitch": ' + IntString_0;
} else IntString_0 = '';
Bool_0 = Bool_0 ? ', "stop": true' : '';
Bool_1 = Bool_1 ? ', "sync": true' : '';
var code = '{"type": "playSound", "name": "'+EvalString_0+'"'+Bool_0+IntString_0+Bool_1+'},\n';
return code;
*/;

playSound_1_s
    :   '播放系统音效' NameMap_List '停止之前音效' Bool? '音调' IntString? '等待播放完毕' Bool? Newline
    

/* playSound_1_s
tooltip : playSound: 播放系统音效
helpUrl : /_docs/#/instruction
default : ["确定",false,"",false]
colour : this.imageColor
if (IntString_0) {
    if (parseInt(IntString_0) < 30 || parseInt(IntString_0) > 300) throw '音调设置只能在30-300之间；100为正常音调。';
    IntString_0 = ', "pitch": ' + IntString_0;
} else IntString_0 = '';
Bool_0 = Bool_0 ? ', "stop": true' : '';
Bool_1 = Bool_1 ? ', "sync": true' : '';
var code = '{"type": "playSound", "name": "'+NameMap_List_0+'"'+Bool_0+IntString_0+Bool_1+'},\n';
return code;
*/;

stopSound_s
    :   '停止所有音效' Newline


/* stopSound_s
tooltip : stopSound: 停止所有音效
helpUrl : /_docs/#/instruction
colour : this.imageColor
var code = '{"type": "stopSound"},\n';
return code;
*/;

setVolume_s
    :   '设置音量' Int '渐变时间' IntString? '不等待执行完毕' Bool Newline
    

/* setVolume_s
tooltip : setVolume: 设置音量
helpUrl : /_docs/#/instruction
default : [90, 500, false]
colour : this.imageColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "setVolume", "value": '+Int_0+IntString_0+async+'},\n';
return code;
*/;

setBgmSpeed_s
    :   '设置背景音乐播放速度' Int '同时改变音调' B_1_List Newline
    

/* setBgmSpeed_s
tooltip : setSpeed: 设置背景音乐播放速度
helpUrl : /_docs/#/instruction
default : [100, true]
colour : this.imageColor
if (Int_0 < 30 || Int_0 > 300) throw '速度只能设置只能在30-300之间；100为正常速度。';
B_1_List_0 = ', "pitch": ' + B_1_List_0;
var code = '{"type": "setBgmSpeed", "value": '+Int_0+B_1_List_0+'},\n';
return code;
*/;

win_s
    :   '游戏胜利,结局' ':' EvalString? '不计入榜单' Bool '不结束游戏' Bool Newline
    

/* win_s
tooltip : win: 获得胜利, 该事件会显示获胜页面, 并重新游戏
helpUrl : /_docs/#/instruction
default : ["",false, false]
Bool_0 = Bool_0?', "norank": 1':'';
Bool_1 = Bool_1?', "noexit": 1':'';
var code = '{"type": "win", "reason": "'+EvalString_0+'"'+Bool_0+Bool_1+'},\n';
return code;
*/;

lose_s
    :   '游戏失败,结局' ':' EvalString? Newline
    

/* lose_s
tooltip : lose: 游戏失败, 该事件会显示失败页面, 并重新开始游戏
helpUrl : /_docs/#/instruction
default : [""]
var code = '{"type": "lose", "reason": "'+EvalString_0+'"},\n';
return code;
*/;

restart_s
    :   '直接回到标题界面' Newline


/* restart_s
tooltip : restart: 直接回到标题界面
helpUrl : /_docs/#/instruction
var code = '{"type": "restart"},\n';
return code;
*/;

input_s
    :   '接受用户输入数字,提示' ':' EvalString Newline
    

/* input_s
tooltip : input：接受用户输入数字, 事件只能接受非负整数输入, 所有非法的输入将全部变成0
helpUrl : /_docs/#/instruction
default : ["请输入一个数"]
colour : this.dataColor
var code = '{"type": "input", "text": "'+EvalString_0+'"},\n';
return code;
*/;

input2_s
    :   '接受用户输入文本,提示' ':' EvalString Newline


/* input2_s
tooltip : input2：接受用户输入文本, 允许用户输入任何形式的文本
helpUrl : /_docs/#/instruction
default : ["请输入文本"]
colour : this.dataColor
var code = '{"type": "input2", "text": "'+EvalString_0+'"},\n';
return code;
*/;

if_s
    :   '如果' ':' expression BGNL? Newline action+ '否则' ':' BGNL? Newline action+ BEND Newline
    

/* if_s
tooltip : if: 条件判断
helpUrl : /_docs/#/instruction
colour : this.eventColor
var code = ['{"type": "if", "condition": "',expression_0,'",',
    block.isCollapsed()?' "_collapsed": true,':'',
    block.isEnabled()?'':' "_disabled": true,',
    '\n"true": [\n',action_0,'],\n',
    '"false": [\n',action_1,']',
'},\n'].join('');
return code;
*/;

if_1_s
    :   '如果' ':' expression BGNL? Newline action+  BEND Newline


/* if_1_s
tooltip : if: 条件判断
helpUrl : /_docs/#/instruction
colour : this.eventColor
var code = ['{"type": "if", "condition": "',expression_0,'",',
    block.isCollapsed()?' "_collapsed": true,':'',
    block.isEnabled()?'':' "_disabled": true,',
    '\n"true": [\n',action_0,']',
'},\n'].join('');
return code;
*/;

switch_s
    :   '多重分歧 条件判定' ':' expression BGNL? Newline switchCase+ BEND Newline


/* switch_s
tooltip : switch: 多重条件分歧
helpUrl : /_docs/#/instruction
default : ["判别值"]
colour : this.eventColor
var code = ['{"type": "switch", "condition": "',expression_0,'", ',
    block.isCollapsed()?'"_collapsed": true, ':'',
    block.isEnabled()?'':'"_disabled": true, ',
    '"caseList": [\n',
    switchCase_0,
'], },\n'].join('');
return code;
*/;

switchCase
    :   '如果是' expression '的场合' '不跳出' Bool BGNL? Newline action+


/* switchCase
tooltip : 选项的选择
helpUrl : /_docs/#/instruction
default : ["", false]
colour : this.subColor
Bool_0 = Bool_0?', "nobreak": true':'';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"case": "'+expression_0+'"'+Bool_0+collapsed+disabled+', "action": [\n'+action_0+']},\n';
return code;
*/;

choices_s
    :   '选项' ':' EvalString_Multi? BGNL? '标题' EvalString? '图像' IdString? '超时毫秒数' Int '宽度' IntString? BGNL? Newline choicesContext+ BEND Newline


/* choices_s
tooltip : choices: 给用户提供选项
helpUrl : /_docs/#/instruction
previewBlock : true
default : ["","流浪者","trader",0,'']
allIds : ['IdString_0']
var title='';
if (EvalString_0==''){
    if (IdString_0=='')title='';
    else title='\\t['+IdString_0+']';
} else {
    if (IdString_0=='')title='\\t['+EvalString_0+']';
    else title='\\t['+EvalString_0+','+IdString_0+']';
}
EvalString_Multi_0 = title+EvalString_Multi_0;
EvalString_Multi_0 = EvalString_Multi_0 ?(', "text": "'+EvalString_Multi_0+'"'):'';
Int_0 = Int_0 ? (', "timeout": '+Int_0) : '';
IntString_0 = IntString_0 ? (', "width": ' + IntString_0) : '';
var code = ['{"type": "choices"',EvalString_Multi_0,Int_0,IntString_0,
    block.isCollapsed()?', "_collapsed": true':'',
    block.isEnabled()?'':', "_disabled": true',
    ', "choices": [\n',
    choicesContext_0,
']},\n'].join('');
return code;
*/;

choicesContext
    :   '子选项' EvalString '图标' IdString? '颜色' ColorString? Colour '启用条件' EvalString? '出现条件' EvalString? BGNL? Newline action+


/* choicesContext
tooltip : 选项的选择
helpUrl : /_docs/#/instruction
default : ["提示文字:红钥匙","","","",""]
allIds : ['IdString_0']
colour : this.subColor
ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
EvalString_1 = EvalString_1 && (', "need": "'+EvalString_1+'"');
EvalString_2 = EvalString_2 && (', "condition": "'+EvalString_2+'"');
IdString_0 = IdString_0?(', "icon": "'+IdString_0+'"'):'';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"text": "'+EvalString_0+'"'+IdString_0+ColorString_0+EvalString_1+EvalString_2+collapsed+disabled+', "action": [\n'+action_0+']},\n';
return code;
*/;

confirm_s
    :   '显示确认框' ':' EvalString_Multi '超时毫秒数' Int BGNL? '确定的场合' ':' '（默认选中' Bool '）' BGNL? Newline action+ '取消的场合' ':' BGNL? Newline action+ BEND Newline

/* confirm_s
tooltip : 弹出确认框
helpUrl : /_docs/#/instruction
default : ["确认要xxx吗?",0,false]
previewBlock : true
Bool_0 = Bool_0?', "default": true':''
Int_0 = Int_0 ? (', "timeout": '+Int_0) : '';
var code = ['{"type": "confirm"'+Int_0+Bool_0+', "text": "',EvalString_Multi_0,'",',
    block.isCollapsed()?' "_collapsed": true,':'',
    block.isEnabled()?'':' "_disabled": true,',
    '\n"yes": [\n',action_0,'],\n',
    '"no": [\n',action_1,']\n',
'},\n'].join('');
return code;
*/;

for_s
    :   '循环遍历' ': ' expression '从' EvalString '到' EvalString '步增' EvalString BGNL? Newline action+ BEND Newline

/* for_s
tooltip : for：循环遍历
helpUrl : /_docs/#/instruction
colour : this.eventColor
if (!/^temp:[A-Z]$/.test(expression_0)) {
  throw new Error('循环遍历仅允许使用临时变量！');
}
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
return '{"type": "for", "name": "'+expression_0+'", "from": "'+EvalString_0+'", "to": "'+EvalString_1+'", "step": "'+EvalString_2+'"'+collapsed+disabled+',\n"data": [\n'+action_0+']},\n';
*/;    

forEach_s
    :   '循环遍历' ': 以' expression '逐项读取列表' JsonEvalString BGNL? Newline action+ BEND Newline

/* forEach_s
tooltip : forEach：循环遍历列表
helpUrl : /_docs/#/instruction
colour : this.eventColor
if (!/^temp:[A-Z]$/.test(expression_0)) {
  throw new Error('循环遍历仅允许使用临时变量！');
}
if (JsonEvalString_0 == '' || !(JSON.parse(JsonEvalString_0) instanceof Array)) {
  throw new Error('参数列表必须是个有效的数组！');
}
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
return '{"type": "forEach", "name": "'+expression_0+'", "list": '+JsonEvalString_0 + collapsed+disabled+',\n"data": [\n'+action_0+']},\n';
*/;

while_s
    :   '前置条件循环' '：' '当' expression '时' BGNL? Newline action+ BEND Newline

/* while_s
tooltip : while：前置条件循环
helpUrl : /_docs/#/instruction
colour : this.eventColor
var code = ['{"type": "while", "condition": "',expression_0,'",',
    block.isCollapsed()?' "_collapsed": true,':'',
    block.isEnabled()?'':' "_disabled": true,',
    '\n"data": [\n',action_0,'],\n',
'},\n'].join('');
return code;
*/;

dowhile_s
    :   '后置条件循环' '：'  BGNL? Newline action+ BEND '当' expression '时' Newline

/* dowhile_s
tooltip : dowhile：后置条件循环
helpUrl : /_docs/#/instruction
colour : this.eventColor
var code = ['{"type": "dowhile", "condition": "',expression_0,'",',
    block.isCollapsed()?' "_collapsed": true,':'',
    block.isEnabled()?'':' "_disabled": true,',
    '\n"data": [\n',action_0,'],\n',
'},\n'].join('');
return code;
*/;

break_s
    :   '跳出循环或公共事件' '层数' Int Newline

/* break_s
tooltip : break：跳出循环或公共事件！
helpUrl : /_docs/#/instruction
colour : this.eventColor
default : [1]
if (Int_0 <= 0) throw "层数至少为1！";
var code = '{"type": "break", "n": '+Int_0+'},\n';
return code;
*/;

continue_s
    :   '提前结束循环或跳出公共事件' '层数' Int Newline

/* continue_s
tooltip : continue：提前结束循环或跳出公共事件，或跳出公共事件！
helpUrl : /_docs/#/instruction
colour : this.eventColor
default : [1]
if (Int_0 <= 0) throw "层数至少为1！";
var code = '{"type": "continue", "n": '+Int_0+'},\n';
return code;
*/;


wait_s
    :   '等待用户操作并获得按键或点击信息' '仅检测子块' Bool '超时毫秒数' Int BGNL? Newline waitContext* BEND Newline


/* wait_s
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : /_docs/#/instruction
default : [true,0]
colour : this.soundColor
Bool_0 = Bool_0?(', "forceChild": true'):'';
Int_0 = Int_0?(', "timeout": ' + Int_0):'';
waitContext_0 = waitContext_0 ? (', "data": [\n' + waitContext_0 + ']') : '';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"type": "wait"' + Bool_0 + Int_0 + collapsed + disabled + waitContext_0 + '},\n';
return code;
*/;


waitContext
    : waitContext_1
    | waitContext_2
    | waitContext_3
    | waitContext_4
    | waitContext_empty;


waitContext_1
    : '按键的场合：' '键值（右键查表）' EvalString '不进行剩余判定' Bool BGNL? Newline action+ BEND Newline

/* waitContext_1
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : /_docs/#/instruction
colour : this.subColor
default : ["",false]
menu : [["查询键值表", "editor_blockly.showKeyCodes()"]]
if (!/^\d+(,\d+)*$/.test(EvalString_0)) {
  throw new Error('键值必须是正整数，可以以逗号分隔');
}
Bool_0 = Bool_0?', "break": true':'';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"case": "keyboard", "keycode": "' + EvalString_0 + '"'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
return code;
*/;


waitContext_2
    : '点击的场合：' '像素x范围' PosString '~' PosString '; y范围' PosString '~' PosString '不进行剩余判定' Bool BGNL? Newline action+ BEND Newline

/* waitContext_2
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : /_docs/#/instruction
default : [0,32,0,32,false]
previewBlock : true
colour : this.subColor
Bool_0 = Bool_0?', "break": true':'';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"case": "mouse", "px": [' + PosString_0 + ',' + PosString_1 + '], "py": [' + PosString_2 + ',' + PosString_3 + ']'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
return code;
*/;

waitContext_3
    : '自定义条件的场合：' expression '不进行剩余判定' Bool BGNL? Newline action+ BEND Newline

/* waitContext_3
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : /_docs/#/instruction
default : ["true",false]
colour : this.subColor
Bool_0 = Bool_0?', "break": true':'';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"case": "condition", "condition": "'+expression_0+'"'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
return code;
*/;

waitContext_4
    : '超时的场合：' '不进行剩余判定' Bool BGNL? Newline action+ BEND Newline

/* waitContext_4
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : /_docs/#/instruction
colour : this.subColor
default : [false]
Bool_0 = Bool_0?', "break": true':'';
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = '{"case": "timeout"'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
return code;
*/;

waitContext_empty : Newline

/* waitContext_empty
return '';
*/;


waitAsync_s
    :   '等待所有异步事件执行完毕' '不等待动画' Bool '等待音效' Bool


/* waitAsync_s
tooltip : waitAsync: 等待所有异步事件执行完毕
helpUrl : /_docs/#/instruction
default : [false, false]
colour : this.soundColor
Bool_0 = Bool_0 ? ', "excludeAnimates": true' : '';
Bool_1 = Bool_1 ? ', "includeSounds": true' : '';
var code = '{"type": "waitAsync"'+Bool_0+Bool_1+'},\n';
return code;
*/;


stopAsync_s
    :   '立刻结束所有异步事件' BGNL Newline


/* stopAsync_s
tooltip : stopAsync: 立刻结束所有异步事件
helpUrl : /_docs/#/instruction
colour : this.soundColor
var code = '{"type": "stopAsync"},\n';
return code;
*/;


callBook_s
    :   '呼出怪物手册'


/* callBook_s
tooltip : callBook: 呼出怪物手册；返回游戏后将继续执行后面的事件
helpUrl : /_docs/#/instruction
colour : this.soundColor
var code = '{"type": "callBook"},\n';
return code;
*/;


callSave_s
    :   '呼出存档页面'


/* callSave_s
tooltip : callSave: 呼出存档页面
helpUrl : /_docs/#/instruction
colour : this.soundColor
var code = '{"type": "callSave"},\n';
return code;
*/;


autoSave_s
    :   '自动存档' '不提示' Bool Newline


/* autoSave_s
tooltip : autoSave: 自动存档
helpUrl : /_docs/#/instruction
colour : this.soundColor
default : [false]
Bool_0 = Bool_0 ? (', "nohint": true') : '';
var code = '{"type": "autoSave"'+Bool_0+'},\n';
return code;
*/;


forbidSave_s
    :   '是否禁止存档' Bool Newline


/* forbidSave_s
tooltip : forbidSave: 禁止存档
helpUrl : /_docs/#/instruction
colour : this.soundColor
default : [false]
Bool_0 = Bool_0 ? (', "forbid": true') : '';
var code = '{"type": "forbidSave"'+Bool_0+'},\n';
return code;
*/;


callLoad_s
    :   '呼出读档页面' Newline


/* callLoad_s
tooltip : callLoad: 呼出存档页面；返回游戏后将继续执行后面的事件
helpUrl : /_docs/#/instruction
colour : this.soundColor
var code = '{"type": "callLoad"},\n';
return code;
*/;


previewUI_s
    :   'ui绘制并预览' '（双击此项可进行预览）' BGNL? Newline action+  BEND Newline


/* previewUI_s
tooltip : previewUI: ui绘制并预览
helpUrl : /_docs/#/instruction
previewBlock : true
var collapsed=block.isCollapsed()?', "_collapsed": true':'';
var disabled=block.isEnabled()?'':', "_disabled": true';
var code = ['{"type": "previewUI"'+collapsed+disabled+', "action": [\n', action_0,']},\n'].join('');
return code;
*/;


clearMap_s
    :   '清除画布' '起点像素' 'x' PosString? 'y' PosString? '宽' PosString? '高' PosString? Newline

/* clearMap_s
tooltip : clearMap: 清除画布
helpUrl : /_docs/#/instruction
colour : this.uiColor
default : ["", "", "", ""]
previewBlock : true
PosString_0 = PosString_0 && (', "x": ' + PosString_0);
PosString_1 = PosString_1 && (', "y": ' + PosString_1);
PosString_2 = PosString_2 && (', "width": ' + PosString_2);
PosString_3 = PosString_3 && (', "height": ' + PosString_3);
var code = '{"type": "clearMap"'+PosString_0+PosString_1+PosString_2+PosString_3+'},\n';
return code;
*/;


setAttribute_s
    : '设置画布属性' '字体' FontString? '填充样式' ColorString? Colour '边框样式' ColorString? Colour BGNL? '线宽度' IntString? '不透明度' EvalString? '对齐' TextAlign_List '基准线' TextBaseline_List 'z值' IntString? Newline

/* setAttribute_s
tooltip : setAttribute：设置画布属性
helpUrl : /_docs/#/instruction
previewBlock : true
colour : this.uiColor
default : ["","",'rgba(255,255,255,1)',"",'rgba(255,255,255,1)',"","",null,null,""]
TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
TextBaseline_List_0 = TextBaseline_List_0==='null'?'': ', "baseline": "'+TextBaseline_List_0+'"';
FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
ColorString_0 = ColorString_0 ? (', "fillStyle": ['+ColorString_0+']') : '';
ColorString_1 = ColorString_1 ? (', "strokeStyle": ['+ColorString_1+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
if (EvalString_0) {
  var f = parseFloat(EvalString_0);
  if (isNaN(f) || f<0 || f>1) throw new Error('不透明度必须是0到1的浮点数或不填');
  EvalString_0 = ', "alpha": '+EvalString_0;
}
IntString_1 = IntString_1 ? (', "z": '+IntString_1) : '';
var code = '{"type": "setAttribute"'+FontString_0+ColorString_0+ColorString_1+IntString_0+
  EvalString_0+TextAlign_List_0+TextBaseline_List_0+IntString_1+'},\n';
return code;
*/;


setFilter_s
    :   '设置画布特效' '虚化' Number '色相' Int '灰度' Number '反色' Bool '阴影' Number Newline
    

/* setFilter_s
tooltip : setFilter: 设置画布特效
helpUrl : /_docs/#/instruction
default : [0,0,0,false,0]
previewBlock : true
colour : this.uiColor
if (Number_0 < 0) throw '虚化不得小于0；0为完全没有虚化';
if (Int_0 < 0 || Int_0 >= 360) throw '色相需要在0~359之间';
if (Number_1 < 0 || Number_1 > 1) throw '灰度需要在0~1之间';
if (Number_2 < 0) throw '阴影不得小于0；0为完全没有阴影';
var code = '{"type": "setFilter", "blur": '+Number_0+', "hue": '+Int_0+', "grayscale": '+Number_1+', "invert": '+Bool_0+', "shadow": '+Number_2+'},\n';
return code;
*/;


fillText_s
    :   '绘制文本' 'x' PosString 'y' PosString '样式' ColorString? Colour '字体' FontString? '最大宽度' IntString? BGNL? EvalString Newline

/* fillText_s
tooltip : fillText：绘制一行文本；可以设置最大宽度进行放缩
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","",'rgba(255,255,255,1)',"","","绘制一行文本"]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
IntString_0 = IntString_0 ? (', "maxWidth": '+IntString_0) : '';
var code = '{"type": "fillText", "x": '+PosString_0+', "y": '+PosString_1+ColorString_0+FontString_0+IntString_0+', "text": "'+EvalString_0+'"},\n';
return code;
*/;

fillBoldText_s
    :   '绘制描边文本' 'x' PosString 'y' PosString '样式' ColorString? Colour '描边颜色' ColorString? Colour '字体' FontString? BGNL? EvalString Newline

/* fillBoldText_s
tooltip : fillBoldText：绘制一行描边文本
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","",'rgba(255,255,255,1)',"",'rgba(0,0,0,1)',"","绘制一行描边文本"]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
ColorString_1 = ColorString_1 ? (', "strokeStyle": ['+ColorString_1+']') : '';
FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
var code = '{"type": "fillBoldText", "x": '+PosString_0+', "y": '+PosString_1+ColorString_0+ColorString_1+FontString_0+', "text": "'+EvalString_0+'"},\n';
return code;
*/;

drawTextContent_s
    :   '绘制多行文本'  EvalString_Multi BGNL? '起点像素' 'x' PosString 'y' PosString '最大宽度' IntString? '颜色' ColorString? Colour BGNL? '对齐' TextAlign_List '字体大小' IntString? '行距' IntString? '粗体' Bool Newline

/* drawTextContent_s
tooltip : drawTextContent：绘制多行文本
helpUrl : /_docs/#/instruction
doubleclicktext : EvalString_Multi_0
menu : [['预览多行文本','editor_blockly.previewBlock(block)']]
colour : this.uiColor
default : ["绘制多行文本\\n可双击编辑","0","0","","",'rgba(255,255,255,1)',null,"","",false]
TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
Bool_0 = Bool_0 ?  (', "bold": true') : '';
IntString_0 = IntString_0 ? (', "maxWidth": '+IntString_0) : '';
IntString_1 = IntString_1 ? (', "fontSize": '+IntString_1) : '';
IntString_2 = IntString_2 ? (', "lineHeight": '+IntString_2) : '';
ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
var code = '{"type": "drawTextContent", "text": "'+EvalString_Multi_0+'", "left": '+PosString_0+', "top": '+PosString_1+TextAlign_List_0+IntString_0+IntString_1+IntString_2+ColorString_0+Bool_0+'},\n';
return code;
*/;

fillRect_s
    :   '绘制矩形' '起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString '圆角半径' PosString? '旋转度数' PosString? '颜色' ColorString? Colour Newline

/* fillRect_s
tooltip : fillRect：绘制矩形
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","flag:x","300","","","","rgba(255,255,255,1)"]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
PosString_4 = PosString_4 ? (', "radius": '+PosString_4) : '';
PosString_5 = PosString_5 ? (', "angle": ' + PosString_5) : '';
var code = '{"type": "fillRect", "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+PosString_4+PosString_5+ColorString_0+'},\n';
return code;
*/;

strokeRect_s
    :   '绘制矩形边框' '起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString '圆角半径' PosString? '旋转度数' PosString? '颜色' ColorString? Colour '线宽' IntString? Newline

/* strokeRect_s
tooltip : strokeRect：绘制矩形边框
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","flag:x","300","","","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
PosString_4 = PosString_4 ? (', "radius": '+PosString_4) : '';
PosString_5 = PosString_5 ? (', "angle": ' + PosString_5) : '';
var code = '{"type": "strokeRect", "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+PosString_4+PosString_5+ColorString_0+IntString_0+'},\n';
return code;
*/;

drawLine_s
    :   '绘制线段' '起点像素' 'x' PosString 'y' PosString '终点像素' 'x' PosString 'y' PosString '颜色' ColorString? Colour '线宽' IntString? Newline

/* drawLine_s
tooltip : drawLine：绘制线段
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","flag:x","300","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
var code = '{"type": "drawLine", "x1": '+PosString_0+', "y1": '+PosString_1+', "x2": '+PosString_2+', "y2": '+PosString_3+ColorString_0+IntString_0+'},\n';
return code;
*/;

drawArrow_s
    :   '绘制箭头' '起点像素' 'x' PosString 'y' PosString '终点像素' 'x' PosString 'y' PosString '颜色' ColorString? Colour '线宽' IntString? Newline

/* drawArrow_s
tooltip : drawArrow：绘制箭头
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","flag:x","300","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
var code = '{"type": "drawArrow", "x1": '+PosString_0+', "y1": '+PosString_1+', "x2": '+PosString_2+', "y2": '+PosString_3+ColorString_0+IntString_0+'},\n';
return code;
*/;


fillPolygon_s
    :   '绘制多边形' '顶点像素列表' 'x' EvalString 'y' EvalString '颜色' ColorString? Colour Newline

/* fillPolygon_s
tooltip : fillPolygon：绘制多边形
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0,0,100","0,100,0","","rgba(255,255,255,1)"]
var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
EvalString_0=EvalString_0.split(',');
EvalString_1=EvalString_1.split(',');
if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
var code = '{"type": "fillPolygon", "nodes": ['+EvalString_0+']'+ColorString_0+'},\n';
return code;
*/;


strokePolygon_s
    :   '绘制多边形边框' '顶点像素列表' 'x' EvalString 'y' EvalString '颜色' ColorString? Colour '线宽' IntString? Newline

/* strokePolygon_s
tooltip : strokePolygon：绘制多边形边框
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0,0,100","0,100,0","","rgba(255,255,255,1)",""]
var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
EvalString_0=EvalString_0.split(',');
EvalString_1=EvalString_1.split(',');
if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
var code = '{"type": "strokePolygon", "nodes": ['+EvalString_0+']'+ColorString_0+IntString_0+'},\n';
return code;
*/;

fillEllipse_s
    :   '绘制椭圆' '中心' 'x' PosString 'y' PosString '长半径' PosString '短半径' PosString '旋转度数' PosString? '颜色' ColorString? Colour Newline

/* fillEllipse_s
tooltip : fillEllipse：绘制椭圆
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","100","100","0","","rgba(255,255,255,1)"]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
PosString_4 = PosString_4 ? (', "angle": ' + PosString_4) : '';
var code = '{"type": "fillEllipse", "x": '+PosString_0+', "y": '+PosString_1+', "a": '+PosString_2+', "b": '+PosString_3+PosString_4+ColorString_0+'},\n';
return code;
*/;

strokeEllipse_s
    :   '绘制椭圆边框' '中心' 'x' PosString 'y' PosString '长半径' PosString '短半径' PosString '旋转度数' PosString? '颜色' ColorString? Colour '线宽' IntString? Newline

/* strokeEllipse_s
tooltip : strokeEllipse：绘制椭圆边框
helpUrl : /_docs/#/instruction
colour : this.uiColor
previewBlock : true
default : ["0","0","100","100","0","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
PosString_4 = PosString_4 ? (', "angle": ' + PosString_4) : '';
var code = '{"type": "strokeEllipse", "x": '+PosString_0+', "y": '+PosString_1+', "a": '+PosString_2+', "b": '+PosString_3+PosString_4+ColorString_0+IntString_0+'},\n';
return code;
*/;

fillArc_s
    :   '绘制扇形' '中心' 'x' PosString 'y' PosString '半径' PosString '起点角度' PosString '终点角度' PosString '颜色' ColorString? Colour Newline

/* fillArc_s
tooltip : fillArc：绘制扇形
helpUrl : /_docs/#/instruction
colour : this.uiColor
default : ["0","0","100","0","90","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
var code = '{"type": "fillArc", "x": '+PosString_0+', "y": '+PosString_1+', "r": '+PosString_2+', "start": '+PosString_3+', "end": '+PosString_4+ColorString_0+'},\n';
return code;
*/;


strokeArc_s
    :   '绘制弧' '中心' 'x' PosString 'y' PosString '半径' PosString '起点角度' PosString '终点角度' PosString '颜色' ColorString? Colour '线宽' IntString? Newline

/* strokeArc_s
tooltip : strokeArc：绘制弧
helpUrl : /_docs/#/instruction
colour : this.uiColor
default : ["0","0","100","0","90","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
var code = '{"type": "strokeArc", "x": '+PosString_0+', "y": '+PosString_1+', "r": '+PosString_2+', "start": '+PosString_3+', "end": '+PosString_4+ColorString_0+IntString_0+'},\n';
return code;
*/;



drawImage_s
    :   '绘制图片' EvalString '翻转' Reverse_List '起点像素' 'x' PosString 'y' PosString '宽' PosString? '高' PosString? '旋转度数' PosString? Newline


/* drawImage_s
tooltip : drawImage：绘制图片
helpUrl : /_docs/#/instruction
previewBlock : true
allImages : ['EvalString_0']
default : ["bg.jpg","null","0","0","","",""]
colour : this.uiColor
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
PosString_2 = PosString_2 ? (', "w": '+PosString_2) : '';
PosString_3 = PosString_3 ? (', "h": '+PosString_3) : '';
PosString_4 = PosString_4 ? (', "angle": ' + PosString_4) : '';
var code = '{"type": "drawImage", "image": "'+EvalString_0+'"'+Reverse_List_0+', "x": '+PosString_0+', "y": '+PosString_1+PosString_2+PosString_3+PosString_4+'},\n';
return code;
*/;

drawImage_1_s
    :   '绘制图片' EvalString '翻转' Reverse_List '裁剪的起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString BGNL?
        '绘制的起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString '旋转度数' PosString? Newline


/* drawImage_1_s
tooltip : drawImage：绘制图片
helpUrl : /_docs/#/instruction
default : ["bg.jpg","null","0","0","32","32","0","0","32","32",""]
colour : this.uiColor
allImages : ['EvalString_0']
previewBlock : true
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
PosString_8 = PosString_8 ? (', "angle": ' + PosString_8) : '';
var code = '{"type": "drawImage", "image": "'+EvalString_0+'"'+Reverse_List_0+
           ', "x": '+PosString_0+', "y": '+PosString_1+', "w": '+PosString_2+', "h": '+PosString_3+
           ', "x1": '+PosString_4+', "y1": '+PosString_5+', "w1": '+PosString_6+', "h1": '+PosString_7+PosString_8+'},\n';
return code;
*/;

drawIcon_s
    :   '绘制图标' 'ID' IdString '帧' Int '起点像素' 'x' PosString 'y' PosString '宽' PosString? '高' PosString? Newline


/* drawIcon_s
tooltip : drawIcon：绘制图标
helpUrl : /_docs/#/instruction
default : ["yellowKey",0,"0","0","",""]
previewBlock : true
allIds : ['IdString_0']
colour : this.uiColor
Int_0 = Int_0 ? (', "frame": '+Int_0) : '';
PosString_2 = PosString_2 ? (', "width": '+PosString_2) : '';
PosString_3 = PosString_3 ? (', "height": '+PosString_3) : '';
var code = '{"type": "drawIcon", "id": "'+IdString_0+'"'+Int_0+', "x": '+PosString_0+', "y": '+PosString_1+PosString_2+PosString_3+'},\n';
return code;
*/;

drawBackground_s
    :   '绘制背景图' EvalString Colour '起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString Newline


/* drawBackground_s
tooltip : drawBackground：绘制背景
helpUrl : /_docs/#/instruction
default : ["winskin.png","rgba(255,255,255,1)","0","0","100","100"]
colour : this.uiColor
previewBlock : true
var colorRe = MotaActionFunctions.pattern.colorRe;
if (colorRe.test(EvalString_0)) {
  EvalString_0 = ', "background": ['+EvalString_0+']';
}
else if (/^\w+\.png$/.test(EvalString_0)) {
  EvalString_0 = ', "background": "'+EvalString_0+'"';
}
else {
  throw new Error('背景格式错误,必须是形如0~255,0~255,0~255,0~1的颜色，或一个WindowSkin的png图片名称');
}
var code = '{"type": "drawBackground"'+EvalString_0+', "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+'},\n';
return code;
*/;

drawSelector_s
    :   '绘制闪烁光标' EvalString '编号' Int '起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString Newline


/* drawSelector_s
tooltip : drawSelector：绘制闪烁光标
helpUrl : /_docs/#/instruction
previewBlock : true
default : ["winskin.png","1","0","0","100","100"]
colour : this.uiColor
var code = '{"type": "drawSelector", "image": "'+EvalString_0+'", "code": '+Int_0+', "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+'},\n';
return code;
*/;

drawSelector_1_s
    :   '清除闪烁光标' '编号' Int Newline


/* drawSelector_1_s
tooltip : drawSelector：清除闪烁光标
helpUrl : /_docs/#/instruction
default : ["1"]
previewBlock : true
colour : this.uiColor
var code = '{"type": "drawSelector", "code": '+Int_0+'},\n';
return code;
*/;

unknown_s
    :   '自定义事件' BGNL? JsonEvalString

/* unknown_s
tooltip : 通过脚本自定义的事件类型, 以及编辑器不识别的事件类型
helpUrl : /_docs/#/instruction
default : ['{"type":"test", "data": "这是自定义的参数"}']
colour : this.dataColor
try {
    var tempobj = JSON.parse(JsonEvalString_0);
} catch (e) {throw new Error("不合法的JSON格式！");}
if (!tempobj.type) throw new Error("自定义事件需要一个type:xxx");
var code = JSON.stringify(tempobj) +',\n';
return code;
*/;

function_s
    :   '自定义JS脚本' '不自动执行下一个事件' Bool BGNL? Newline RawEvalString Newline BEND Newline
    

/* function_s
tooltip : 可双击多行编辑，请勿使用异步代码。常见API参见文档附录。
helpUrl : /_docs/#/instruction
default : [false,"alert(core.getStatus(\"atk\"));"]
colour : this.dataColor
doubleclicktext : RawEvalString_0
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "function"'+Bool_0+', "function": "function(){\\n'+JSON.stringify(RawEvalString_0).slice(1,-1).split('\\\\n').join('\\n')+'\\n}"},\n';
return code;
*/;

pass_s
    :   Newline
    

/* pass_s
var code = ' \n';
return code;
*/;

statExprSplit : '=== statement ^ === expression v ===' ;
//===blockly表达式===

expression
    :   expression Arithmetic_List expression
    |   negate_e
    |   unaryOperation_e
    |   bool_e
    |   idFixedList_e
    |   idFlag_e
    |   idTemp_e
    |   idIdList_e
    |   idString_e
    |   enemyattr_e
    |   blockId_e
    |   blockNumber_e
    |   blockCls_e
    |   equip_e
    |   nextXY_e
    |   isReplaying_e
    |   hasVisitedFloor_e
    |   isShopVisited_e
    |   hasEquip_e
    |   canBattle_e
    |   rand_e
    |   evalString_e
    

/* expression_arithmetic_0
//todo 修改recieveOrder,根据Arithmetic_List_0不同的值设定不同的recieveOrder
var code = expression_0 + Arithmetic_List_0 + expression_1;
var ops = {
    '**': 'Math.pow('+expression_0+','+expression_1+')',
    'min': 'Math.min('+expression_0+','+expression_1+')',
    'max': 'Math.max('+expression_0+','+expression_1+')',
    'startsWith': expression_0+'.startsWith('+expression_1+')',
    'endsWith': expression_0+'.endsWith('+expression_1+')',
    'includes': expression_0+'.includes('+expression_1+')',
}
if (ops[Arithmetic_List_0])code = ops[Arithmetic_List_0];
var orders = {
    '+': Blockly.JavaScript.ORDER_ADDITION,
    '-': Blockly.JavaScript.ORDER_SUBTRACTION,
    '*': Blockly.JavaScript.ORDER_MULTIPLICATION,
    '/': Blockly.JavaScript.ORDER_DIVISION,
    '%': Blockly.JavaScript.ORDER_MODULUS,
    '**': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    '==': Blockly.JavaScript.ORDER_EQUALITY,
    '!=': Blockly.JavaScript.ORDER_EQUALITY,
    '===': Blockly.JavaScript.ORDER_EQUALITY,
    '!==': Blockly.JavaScript.ORDER_EQUALITY,
    '>': Blockly.JavaScript.ORDER_RELATIONAL,
    '<': Blockly.JavaScript.ORDER_RELATIONAL,
    '>=': Blockly.JavaScript.ORDER_RELATIONAL,
    '<=': Blockly.JavaScript.ORDER_RELATIONAL,
    '&&': Blockly.JavaScript.ORDER_LOGICAL_AND,
    '||': Blockly.JavaScript.ORDER_LOGICAL_OR,
    '^': Blockly.JavaScript.ORDER_BITWISE_XOR,
    'min': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    'max': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    'startsWith': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    'endsWith': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    'includes': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
}
return [code, orders[Arithmetic_List_0]];
*/;

negate_e
    :   '非' expression
    

/* negate_e
//todo 修改recieveOrder : ORDER_LOGICAL_NOT 修改 inputsInline
var code = '!'+expression_0;
return [code, Blockly.JavaScript.ORDER_LOGICAL_NOT];
*/;

unaryOperation_e
    :   UnaryOperator_List expression
    

/* unaryOperation_e
var code = UnaryOperator_List_0 + '(' + expression_0 + ')';
return [code, Blockly.JavaScript.ORDER_MEMBER];
*/;


bool_e
    :   ':' Bool
    

/* bool_e
tooltip : 逻辑是否
var code = Bool_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


idString_e
    :   IdString
    

/* idString_e
colour : this.idstring_eColor
default : ["变量：生命"]
var code = IdString_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;

idIdList_e
    :   Id_List ':' IdText
    

/* idIdList_e
colour : this.idstring_eColor
default : [null,"自定义flag"]
var code = MotaActionFunctions.replaceFromName(MotaActionFunctions.replaceToName(Id_List_0+':'+IdText_0));
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;

idFixedList_e
    :   FixedId_List
    

/* idFixedList_e
colour : this.idstring_eColor
var code = FixedId_List_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


enemyattr_e
    :   '怪物' IdString '的' EnemyId_List


/* enemyattr_e
default : ['greenSlime',"hp"]
allEnemys : ['IdString_0']
var code = 'enemy:'+IdString_0+':'+EnemyId_List_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


blockId_e
    :   '图块ID:' PosString ',' PosString


/* blockId_e
default : [0,0]
if (/^\d+$/.test(PosString_0) && /^\d+$/.test(PosString_1)) {
    return ['blockId:'+PosString_0+','+PosString_1, Blockly.JavaScript.ORDER_ATOMIC];
}
if (PosString_0.startsWith('"')) {
    PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
}
if (PosString_1.startsWith('"')) {
    PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
}
return ['core.getBlockId('+PosString_0+','+PosString_1+')', Blockly.JavaScript.ORDER_ATOMIC];
*/;


blockNumber_e
    :   '图块数字:' PosString ',' PosString


/* blockNumber_e
default : [0,0]
if (/^\d+$/.test(PosString_0) && /^\d+$/.test(PosString_1)) {
    return ['blockNumber:'+PosString_0+','+PosString_1, Blockly.JavaScript.ORDER_ATOMIC];
}
if (PosString_0.startsWith('"')) {
    PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
}
if (PosString_1.startsWith('"')) {
    PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
}
return ['core.getBlockNumber('+PosString_0+','+PosString_1+')', Blockly.JavaScript.ORDER_ATOMIC];
*/;


blockCls_e
    :   '图块类别:' PosString ',' PosString


/* blockCls_e
default : [0,0]
if (/^\d+$/.test(PosString_0) && /^\d+$/.test(PosString_1)) {
    return ['blockCls:'+PosString_0+','+PosString_1, Blockly.JavaScript.ORDER_ATOMIC];
}
if (PosString_0.startsWith('"')) {
    PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
}
if (PosString_1.startsWith('"')) {
    PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
}
return ['core.getBlockCls('+PosString_0+','+PosString_1+')', Blockly.JavaScript.ORDER_ATOMIC];
*/;


nextXY_e
    :   '前方' NInt '格的' NextXY_List

/* nextXY_e
default : [1, 'nextX']
var code = NextXY_List_0 == 'nextY' ? ('core.nextY('+NInt_0+')') : ('core.nextX('+NInt_0+')');
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


isReplaying_e
    :   '录像播放中'

/* isReplaying_e
var code = 'core.isReplaying()';
return [code, Blockly.JavaScript.ORDER_ATOMIC];;
*/;


hasVisitedFloor_e
    :   '访问过楼层' IdString

/* hasVisitedFloor_e
default : ['MT0']
allFloorIds : ['IdString_0']    
var code = 'core.hasVisitedFloor(\'' + IdString_0 + '\')';
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


isShopVisited_e
    :   '开启过商店' IdString

/* isShopVisited_e
default : ['shop1']
allShops : ['IdString_0']    
var code = 'core.isShopVisited(\'' + IdString_0 + '\')';
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


hasEquip_e
    :   '当前正在装备' IdString

/* hasEquip_e
default : ['sword1']
allEquips : ['IdString_0']    
var code = 'core.hasEquip(\'' + IdString_0 + '\')';
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


canBattle_e
    :   '当前能否战斗' IdString

/* canBattle_e
default : ['greenSlime']
allEnemys : ['IdString_0']
var code = 'core.canBattle(\'' + IdString_0 + '\')';
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


rand_e
    :   '随机数 [0, ' Int ')'

/* rand_e
default : ['10']
var code = 'core.rand(' + Int_0 + ')';
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


equip_e
    :   '第' Int '格装备孔'


/* equip_e
default : [0]
var code = 'equip:'+Int_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


idFlag_e
    :   '独立开关' Letter_List


/* idFlag_e
colour : this.idstring_eColor
default : ["A"]
var code = "switch:"+Letter_List_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


idTemp_e
    :   '临时变量' Letter_List


/* idTemp_e
colour : this.idstring_eColor
default : ["A"]
var code = "temp:"+Letter_List_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


evalString_e
    :   EvalString_Multi
    

/* evalString_e
default : ["值"]
var code = EvalString_Multi_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;

//===============lexer===============

IdText
    :   'sdeirughvuiyasdeb'+ //为了被识别为复杂词法规则
    ;

RawEvalString
    :   'sdeirughvuiyasdbe'+ //为了被识别为复杂词法规则
    ;

JsonEvalString
    :   'sdeirughvuiyasdbe'+ //为了被识别为复杂词法规则
    ;  

PosString
    :   'sdeirughvuiyasbde'+ //为了被识别为复杂词法规则
    ;

IntString
    :   'sdeirughvuiyasbde'+ //为了被识别为复杂词法规则
    ;

ColorString
    :   'sdeirughvuiyasbde'+ //为了被识别为复杂词法规则
    ;

FontString
    :   'sdeirughvuiyasbde'+ //为了被识别为复杂词法规则
    ;

Floor_List
    :   '楼层ID'|'前一楼'|'后一楼'|'当前楼'
    /*Floor_List ['floorId',':before',':next',':now']*/;

Stair_List
    :   '坐标'|'上楼梯'|'下楼梯'|'保持不变'|'中心对称点'|'x对称点'|'y对称点'|'楼传落点'
    /*Stair_List ['loc','upFloor','downFloor',':now',':symmetry',':symmetry_x',':symmetry_y','flyPoint']*/;

SetTextPosition_List
    :   '不改变'|'距离顶部'|'居中'|'距离底部'
    /*SetTextPosition_List ['null','up','center','down']*/;

TextAlign_List
    :   '不改变'|'左对齐'|'左右居中'|'右对齐'
    /*TextAlign_List ['null','left','center','right']*/;

TextBaseline_List
    :   '不改变'|'顶部'|'悬挂'|'居中'|'拉丁字母'|'中日韩越'|'底部'
    /*TextBaseline_List ['null','top','hanging','middle','alphabetic','ideographic','bottom']*/;

Reverse_List
    :   '不改变'|'左右翻转'|'上下翻转'|'中心翻转'
    /*Reverse_List ['null',':x',':y',':o']*/;

ShopUse_List
    :   '金币' | '经验'
    /*ShopUse_List ['money','exp']*/;

Arithmetic_List
    :   '加'|'减'|'乘'|'除'|'取余'|'乘方'|'等于'|'不等于'|'大于'|'小于'|'大于等于'|'小于等于'|'且'|'或'|'异或'|'取较大'|'取较小'|'弱相等'|'弱不相等'|'开始于'|'结束于'|'包含'
    /*Arithmetic_List ['+','-','*','/','%','**','===','!==','>','<','>=','<=','&&','||','^','max','min','==','!=','startsWith','endsWith','includes']*/;

AssignOperator_List
    :   '设为'|'增加'|'减少'|'乘以'|'除以'|'乘方'|'除以并取商'|'除以并取余'|'设为不小于'|'设为不大于'
    /*AssignOperator_List ['=','+=','-=','*=','/=','**=','//=','%=','max=','min=']*/;  

UnaryOperator_List
    :   '向下取整'|'向上取整'|'四舍五入'|'整数截断'|'绝对值'|'开方'|'变量类型'
    /*UnaryOperator_List ['Math.floor', 'Math.ceil', 'Math.round', 'Math.trunc', 'Math.abs', 'Math.sqrt', 'typeof']*/;

Weather_List
    :   '无'|'雨'|'雪'|'晴'|'雾'|'云'
    /*Weather_List ['null','rain','snow','sun','fog','cloud']*/;

B_0_List
    :   '不改变'|'不可通行'|'可以通行'
    /*B_0_List ['null','true','false']*/;

B_1_List
    :   '不变'|'是'|'否'
    /*B_1_List ['null','true','false']*/;

Bg_Fg_List
    :   '背景层'|'前景层'
    /*Bg_Fg_List ['bg','fg']*/;

Bg_Fg2_List
    :   '背景层'|'前景层'|'自适配'
    /*Bg_Fg2_List ['bg','fg','auto']*/;

IgnoreChangeFloor_List
    :   '全局默认值' | '可穿透' | '不可穿透'
    /*IgnoreChangeFloor_List ['null','true','false']*/;

Event_List
    :   '普通事件'|'战前事件'|'战后事件'|'道具后事件'|'开门后事件'
    /*Event_List ['null','beforeBattle','afterBattle','afterGetItem','afterOpenDoor']*/;

Floor_Meta_List
    :   '楼层中文名'|'状态栏名称'|'能否楼传飞到'|'能否楼传飞出'|'能否打开快捷商店'|'是否不可浏览地图'|'是否不可瞬间移动'|'默认地面ID'|'宝石血瓶效果'|'上楼点坐标'|'下楼点坐标'|'楼传落点坐标'|'背景音乐'|'画面色调'|'天气和强度'|'是否地下层'
    /*Floor_Meta_List ['title','name','canFlyTo', 'canFlyFrom', 'canUseQuickShop', 'cannotViewMap', 'cannotMoveDirectly', 'defaultGround', 'ratio', 'upFloor', 'downFloor', 'flyPoint', 'bgm', 'color', 'weather', 'underGround']*/;

Global_Attribute_List
    :   '全局字体'|'横屏左侧状态栏背景'|'竖屏上方状态栏背景'|'竖屏下方道具栏背景'|'边框颜色'|'状态栏文字色'|'选中框颜色'|'楼层转换样式'|'装备列表'
    /*Global_Attribute_List ['font','statusLeftBackground','statusTopBackground', 'toolsBackground', 'borderColor', 'statusBarColor', 'selectColor', 'floorChangingStyle', 'equipName']*/;

Global_Value_List
    :   '血网伤害'|'中毒伤害'|'衰弱效果'|'红宝石效果'|'蓝宝石效果'|'绿宝石效果'|'红血瓶效果'|'蓝血瓶效果'|'黄血瓶效果'|'绿血瓶效果'|'破甲比例'|'反击比例'|'净化比例'|'仇恨增加值'|'图块每帧时间'|'上下楼时间'
    /*Global_Value_List ['lavaDamage','poisonDamage','weakValue', 'redGem', 'blueGem', 'greenGem', 'redPotion', 'bluePotion', 'yellowPotion', 'greenPotion', 'breakArmor', 'counterAttack', 'purify', 'hatred', 'animateSpeed', 'floorChangeTime']*/;


Global_Flag_List
    :   '显示当前楼层'|'显示勇士图标'|'显示当前等级'|'启用生命上限'|'显示生命值'|'显示魔力值'|'显示攻击力'|'显示防御力'|'显示护盾值'|'显示金币值'|'显示经验值'|'允许等级提升'|'升级扣除模式'|'显示钥匙数量'|'显示绿钥匙'|'显示破炸飞'|'显示毒衰咒'|'显示当前技能'|'横屏底部工具栏'|'楼梯边才能楼传'|'楼传平面塔模式'|'开启加点'|'开启负伤'|'夹击不超伤害值'|'二分计算临界'|'允许轻按'|'允许走到将死领域'|'允许瞬间移动'|'阻激夹域后禁用快捷商店'|'虚化前景层'
    /*Global_Flag_List ['s:enableFloor','s:enableName','s:enableLv', 's:enableHPMax', 's:enableHP', 's:enableMana', 's:enableAtk', 's:enableDef', 's:enableMDef', 's:enableMoney', 's:enableExp', 's:enableLevelUp', 's:levelUpLeftMode', 's:enableKeys', 's:enableGreenKey', 's:enablePZF', 's:enableDebuff', 's:enableSkill', 'extendToolbar', 'flyNearStair', 'flyRecordPosition', 'enableAddPoint', 'enableNegativeDamage', 'betweenAttackMax', 'useLoop', 'enableGentleClick', 'canGoDeadZone', 'enableMoveDirectly', 'disableShopOnDamage', 'blurFg']*/;

NextXY_List
    :   '横坐标'|'纵坐标'
    /*NextXY_List ['nextX','nextY']*/;

EquipValueType_List
    :   '数值项'|'百分比项'
    /*EquipValueType_List ['value','percentage']*/;

Vibrate_List
    :   '左右'|'上下'|'左上-右下'|'左下-右上'|'随机'
    /*Vibrate_List ['horizontal','vertical','diagonal1','diagonal2','random']*/;

Colour
    :   'sdeirughvuiyasdeb'+ //为了被识别为复杂词法规则
    ;

Angle
    :   'sdeirughvuiyasdeb'+ //为了被识别为复杂词法规则
    ;

Bool:   'TRUE' 
    |   'FALSE'
    ;

Int :   '0' | [1-9][0-9]* ; // no leading zeros

NInt : '0' | '-'? [1-9][0-9]* ;

Letter_List
    :  'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'
    /*Letter_List ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']*/;


Number
    :   '-'? Int '.' Int EXP?   // 1.35, 1.35E-9, 0.3, -4.5
    |   '-'? Int EXP            // 1e10 -3e4
    |   '-'? Int                // -3, 45
    ;
fragment EXP : [Ee] [+\-]? Int ; // \- since - means "range" inside [...]

Direction_List
    :   '上'|'下'|'左'|'右'
    /*Direction_List ['up','down','left','right']*/;

DirectionEx_List
    :   '不变'|'朝上'|'朝下'|'朝左'|'朝右'|'左转'|'右转'|'背对'|'角色同向'|'角色反向'
    /*DirectionEx_List ['null','up','down','left','right',':left',':right',':back',':hero',':backhero']*/;

StepString
    :   (Direction_List Int?)+
    ;

IdString
    :   [0-9a-zA-Z_][0-9a-zA-Z_:]*
    ;

FixedId_List
    :   '生命'|'生命上限'|'攻击'|'防御'|'护盾'|'黄钥匙'|'蓝钥匙'|'红钥匙'|'金币'|'经验'|'魔力'|'魔力上限'|'当前横坐标'|'当前纵坐标'|'当前朝向'|'攻击增益'|'防御增益'|'护盾增益'
    /*FixedId_List ['status:hp','status:hpmax','status:atk','status:def','status:mdef','item:yellowKey','item:blueKey','item:redKey','status:money','status:exp','status:mana','status:manamax','status:x','status:y','status:direction','buff:atk','buff:def','buff:mdef']*/;

Id_List
    :   '变量' | '状态' | '物品' | '增益' | '独立开关' | '临时变量' |'全局存储'
    /*Id_List ['flag','status','item', 'buff', 'switch', 'temp', 'global']*/;

EnemyId_List
    :   '生命'|'攻击'|'防御'|'金币'|'经验'|'加点'|'特殊属性'|'名称'|'映射名'|'属性值'|'退化扣攻'|'退化扣防'|'不可炸'|'九宫格领域'|'领域范围'|'连击数'|'吸血到自身'|'固伤值'
    /*EnemyId_List ['hp','atk','def','money','exp','point','special','name','displayInBook','value','atkValue','defValue','notBomb','zoneSquare','range','n','add','damage']*/;

EnemyPoint_List
    :   '生命'|'攻击'|'防御'|'金币'|'经验'|'加点'|'名称'
    /*EnemyPoint_List ['hp','atk','def','money','exp','point','name']*/;

Equip_List
    :   '生命'|'生命上限'|'攻击'|'防御'|'护盾'|'魔力'|'魔力上限'
    /*Equip_List ['hp','hpmax','atk','def','mdef','mana','manamax']*/;

Key_List
    :   '黄钥匙'|'蓝钥匙'|'红钥匙'|'绿钥匙'|'铁门钥匙'
    /*Key_List ['yellowKey','blueKey','redKey','greenKey','steelKey']*/;

Move_List
    :   '上'|'下'|'左'|'右'|'前'|'后'|'左上'|'左下'|'右上'|'右下'|'设置速度'
    /*Move_List ['up','down','left','right','forward','backward','leftup','leftdown','rightup','rightdown','speed']*/;

MoveMode_List
    :   '匀速移动'|'缓入快出'|'快入缓出'|'缓入缓出'|'随机'
    /*MoveMode_List ['', 'easeIn', 'easeOut', 'easeInOut', 'random']*/;

NameMap_List
    :   '确定'|'取消'|'操作失败'|'光标移动'|'打开界面'|'读档'|'存档'|'获得道具'|'回血'|'宝石'|'炸弹'|'飞行器'|'开关门'|'上下楼'|'跳跃'|'破墙镐'|'破冰镐'|'阻激夹域'|'穿脱装备'|'商店'
    /*NameMap_List ['确定','取消','操作失败','光标移动','打开界面','读档','存档','获得道具','回血','宝石','炸弹','飞行器','开关门','上下楼','跳跃','破墙镐','破冰镐','阻激夹域','穿脱装备','商店']*/;

//转blockly后不保留需要加"
EvalString
    :   Equote_double (ESC_double | ~["\\])* Equote_double
    ;

EvalString_Multi
    :   Equote_double (ESC_double | ~["\\])* Equote_double
    ;

fragment ESC_double :   '\\' (["\\/bfnrt] | UNICODE) ;
fragment UNICODE : 'u' HEX HEX HEX HEX ;
fragment HEX : [0-9a-fA-F] ;

BGNL
    :   'BGNLaergayergfuybgv'
    ;

MeaningfulSplit : '=== meaningful ^ ===' ;

fragment Equote_double : '"' ;

BSTART
    :   '开始'
    ;

BEND:   '结束'
    ;

Newline
    :   ('\r' '\n'?| '\n')// -> skip
    ;

WhiteSpace
    :   [ \t]+ -> skip
    ;

BlockComment
    :   '/*' .*? '*/' -> skip
    ;

LineComment
    :   '//' ~[\r\n]* -> skip
    ;

/* Function_0
//this.evisitor.recieveOrder='ORDER_NONE';
this.evisitor.valueColor=330;
this.evisitor.statementColor=70;
this.evisitor.entryColor=250;

this.evisitor.idstring_eColor=310;
this.evisitor.subColor=250;
this.evisitor.dataColor=130;
this.evisitor.eventColor=220;
this.evisitor.soundColor=20;
this.evisitor.commentColor=285;
this.evisitor.mapColor=175;
this.evisitor.uiColor=359;
this.evisitor.imageColor=45;
*/

/* Function_1
delete(this.block('negate_e').inputsInline);
this.block('idIdList_e').output='idString_e';
this.block('idFixedList_e').output='idString_e';
this.block('idFlag_e').output='idString_e';
this.block('idTemp_e').output='idString_e';
*/

/* Functions

MotaActionParser()

*/
