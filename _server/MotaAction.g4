// 编辑此文件用的vscode插件: https://marketplace.visualstudio.com/items?itemName=zhaouv.vscode-mota-js-extension
// 此文件通过antlr-blockly生成编辑器中的图块, 相关帮助说明: https://zhaouv.github.io/antlr-blockly/docs/#/README


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
*/


grammar MotaAction;

//===============parser===============
//===blockly语句===

//事件 事件编辑器入口之一
event_m
    :   '事件' BGNL? Newline '覆盖触发器' Bool '启用' Bool '通行状态' B_0_List '显伤' Bool BGNL? Newline action+ BEND
    

/* event_m
tooltip : 编辑魔塔的事件
helpUrl : https://h5mota.com/games/template/_docs/#/event
default : [false,null,null,null,null]
B_0_List_0=eval(B_0_List_0);
var code = {
    'trigger': Bool_0?'action':null,
    'enable': Bool_1,
    'noPass': B_0_List_0,
    'displayDamage': Bool_2,
    'data': 'data_asdfefw'
}
if (!Bool_0 && Bool_1 && (B_0_List_0===null) && Bool_2) code = 'data_asdfefw';
code=JSON.stringify(code,null,2).split('"data_asdfefw"').join('[\n'+action_0+']\n');
return code;
*/;


//自动事件 事件编辑器入口之一
autoEvent_m
    :   '自动事件：' '触发条件' EvalString '优先级' Int BGNL? Newline '仅在本层检测' Bool '事件流中延迟执行' Bool '允许多次执行' Bool BGNL? Newline action+ BEND
    

/* autoEvent_m
tooltip : 自动事件
helpUrl : https://h5mota.com/games/template/_docs/#/event
default : ["flag:__door__==2",0,true,false,false,null]
var code = {
    "condition": EvalString_0, // 条件不可为null
    "currentFloor": Bool_0, // 是否仅在本层检测
    "priority": Int_0, // 优先级
    "delayExecute": Bool_1, // 延迟执行
    "multiExecute": Bool_2, // 是否允许多次执行
    "data": 'autoEvent_asdfefw', // 事件列表
};
code=JSON.stringify(code,null,2).split('"autoEvent_asdfefw"').join('[\n'+action_0+']\n');
return code;
*/;

//升级 事件编辑器入口之一
level_m
    :   '等级提升' BGNL? Newline levelCase+ BEND
    

/* level_m
tooltip : 升级事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%bb%8f%e9%aa%8c%e5%8d%87%e7%ba%a7%ef%bc%88%e8%bf%9b%e9%98%b6%2f%e5%a2%83%e7%95%8c%e5%a1%94%ef%bc%89
var code = '[\n'+levelCase_0+']\n';
return code;
*/;

levelCase
    :   '需求' expression '称号' EvalString? '是否扣除经验' Bool BGNL? Newline action+


/* levelCase
tooltip : 升级设定
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%bb%8f%e9%aa%8c%e5%8d%87%e7%ba%a7%ef%bc%88%e8%bf%9b%e9%98%b6%2f%e5%a2%83%e7%95%8c%e5%a1%94%ef%bc%89
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
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
    :   '商店 id' IdString '标题' EvalString? '图像' IdString? BGNL? Newline '文字' EvalString? BGNL? Newline '快捷名称' EvalString '未开启不显示' Bool '不可预览' Bool BGNL? Newline shopChoices+ BEND
    

/* shopsub
tooltip : 全局商店
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
doubleclicktext : EvalString_1
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
var code = {
    'id': IdString_0,
    'text': title+EvalString_1,
    'textInList': EvalString_2,
    'mustEnable': Bool_0,
    'disablePreview': Bool_1,
    'choices': 'choices_asdfefw'
}
code=JSON.stringify(code,null,2).split('"choices_asdfefw"').join('[\n'+shopChoices_0+']')+',\n';
return code;
*/;

shopChoices
    :   '商店选项' EvalString '使用条件' EvalString BGNL? Newline '图标' IdString? '颜色' ColorString? Colour '出现条件' EvalString? BGNL? Newline action+ BEND
    

/* shopChoices
tooltip : 商店选项,商店消耗是-1时,这里的消耗对应各自选项的消耗,商店消耗不是-1时这里的消耗不填
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
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
    :   '道具商店 id' IdString '快捷名称' EvalString '未开启不显示' Bool BGNL? Newline shopItemChoices+ BEND


/* shopitem
tooltip : 道具商店
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
default : ["itemShop","道具商店",false]
var code = {
    'id': IdString_0,
    'item': true,
    'textInList': EvalString_0,
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
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
helpUrl : https://h5mota.com/games/template/_docs/#/
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

//afterBattle 事件编辑器入口之一
afterBattle_m
    :   '战斗结束后' BGNL? Newline action+ BEND
    

/* afterBattle_m
tooltip : 系统引发的自定义事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/;

//afterGetItem 事件编辑器入口之一
afterGetItem_m
    :   '获取道具后' '轻按时不触发' Bool BGNL? Newline action+ BEND
    

/* afterGetItem_m
tooltip : 系统引发的自定义事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/;

//firstArrive 事件编辑器入口之一
firstArrive_m
    :   '首次到达楼层' BGNL? Newline action+ BEND
    

/* firstArrive_m
tooltip : 首次到达楼层
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/;

//eachArrive 事件编辑器入口之一
eachArrive_m
    :   '每次到达楼层' BGNL? Newline action+ BEND


/* eachArrive_m
tooltip : 每次到达楼层
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/;

//changeFloor 事件编辑器入口之一
changeFloor_m
    :   '楼梯, 传送门' BGNL? Newline Floor_List IdString? Stair_List 'x' PosString? ',' 'y' PosString? '朝向' DirectionEx_List '动画时间' IntString? '穿透性' IgnoreChangeFloor_List BEND
    

/* changeFloor_m
tooltip : 楼梯, 传送门, 如果目标楼层有多个楼梯, 写upFloor或downFloor可能会导致到达的楼梯不确定, 这时候请使用loc方式来指定具体的点位置
helpUrl : https://h5mota.com/games/template/_docs/#/element?id=%e8%b7%af%e9%9a%9c%ef%bc%8c%e6%a5%bc%e6%a2%af%ef%bc%8c%e4%bc%a0%e9%80%81%e9%97%a8
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
helpUrl : https://h5mota.com/games/template/_docs/#/event
var code = '[\n'+action_0+']\n';
return code;
*/;

//item 事件编辑器入口之一
item_m
    :   '使用道具事件' BGNL? Newline action+ BEND


/* item_m
tooltip : 使用道具事件
helpUrl : https://h5mota.com/games/template/_docs/#/event
var code = '[\n'+action_0+']\n';
return code;
*/;

// levelChoose 事件编辑器入口之一
levelChoose_m
    :   '难度分歧' BGNL? levelChooseList+ BEND


/* levelChoose_m
tooltip : 难度分歧
helpUrl : https://h5mota.com/games/template/_docs/#/event
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
   :    '难度分歧项' '名称' EvalString '简写' EvalString '变量:hard值' Int '颜色' ColorString? Colour BGNL Newline action+ BEND

/* levelChooseChoice
tooltip : 难度分歧项
helpUrl : https://h5mota.com/games/template/_docs/#/event
default : ['简单','Easy',1,'']
ColorString_0 = ColorString_0 ? (', "color": [' + ColorString_0 + ']') : '';
var code = '{"title": "'+EvalString_0+'", "name": "'+EvalString_1+'", "hard": '+Int_0+ColorString_0+', "action": [\n'+action_0+']},\n';
return code;
*/;

// equip 事件编辑器入口之一
equip_m 
    :   '装备' '类型' EvalString '装备动画（第一个装备格有效）' IdString? BGNL? '数值提升项' equipList+ '百分比提升项' equipList+ BEND


/* equip_m
tooltip : 装备
default : ['0', '']
helpUrl : https://h5mota.com/games/template/_docs/#/event
allAnimates : ['IdString_0']
if (!/^\d+$/.test(EvalString_0)) {
    EvalString_0 = '"' + EvalString_0 + '"';
}
IdString_0 = IdString_0 && (', "animate": "'+IdString_0+'"');
var code = '{"type": '+EvalString_0+IdString_0+', "value": {\n'+equipList_0+'\n}, "percentage": {\n'+equipList_1+'\n}}';
return code;
*/;

equipList
    : equipKnown
    | equipUnknown
    | equipEmpty;


equipKnown
    : Equip_List ':' Number BEND


/* equipKnown
tooltip : 装备项
default : ['atk', 10]
helpUrl : https://h5mota.com/games/template/_docs/#/event
return '"'+Equip_List_0+'": '+Number_0+', ';
*/;

equipUnknown
    : EvalString ':' Number BEND


/* equipUnknown
tooltip : 装备项
default : ['speed', 10]
helpUrl : https://h5mota.com/games/template/_docs/#/event
return '"'+EvalString_0+'": '+Number_0+', ';
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
helpUrl : https://h5mota.com/games/template/_docs/#/event
var code = '[\n'+floorImageList_0+']\n';
return code;
*/;

floorImageList
    :   floorOneImage
    |   floorEmptyImage;

floorOneImage
    :   '图片名' EvalString '翻转' Reverse_List '图层' Bg_Fg2_List '绘制坐标' 'x' Int 'y' Int '初始禁用' Bool BGNL? Newline 
        '裁剪起点坐标' 'x' IntString? 'y' IntString? '宽' IntString? '高' IntString? '帧数' IntString? BEND


/* floorOneImage
tooltip : 楼层贴图
default : ["bg.jpg","null","bg",0,0,false,"","","","",""]
helpUrl : https://h5mota.com/games/template/_docs/#/event
allImages : ['EvalString_0']
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
Bool_0 = Bool_0 ? (', "disable": true') : '';
IntString_0 = IntString_0 && (', "sx": '+IntString_0);
IntString_1 = IntString_1 && (', "sy": '+IntString_1);
IntString_2 = IntString_2 && (', "w": '+IntString_2);
IntString_3 = IntString_3 && (', "h": '+IntString_3);
IntString_4 = IntString_4 && (', "frame": '+IntString_4);
return '{"name": "'+EvalString_0+'"'+Reverse_List_0+', "canvas": "'+Bg_Fg2_List_0+'", "x": '+Int_0+', "y": '+Int_1+Bool_0+IntString_0+IntString_1+IntString_2+IntString_3+IntString_4+'},\n';
*/;

floorEmptyImage
    :   Newline
    
/* floorEmptyImage
var code = ' \n';
return code;
*/;


// doorInfo 事件编辑器入口之一
doorInfo_m 
    :   '门信息' '开关门时间' Int '开门音效' EvalString? '关门音效' EvalString? BGNL? Newline '需要钥匙' doorKeyList+ BEND


/* doorInfo_m
tooltip : 开门信息
default : [160, 'door.mp3', 'door.mp3']
helpUrl : https://h5mota.com/games/template/_docs/#/event
EvalString_0 = EvalString_0 && (', "openSound": "' + EvalString_0 + '"');
EvalString_1 = EvalString_1 && (', "closeSound": "' + EvalString_1 + '"');
var code = '{"time": '+Int_0+EvalString_0+EvalString_1+', "keys": {\n'+doorKeyList_0+'\n}}';
return code;
*/;

doorKeyList
    : doorKeyKnown
    | doorKeyUnknown
    | doorKeyEmpty;


doorKeyKnown
    : Key_List ':' Int '需要但不消耗' Bool BEND


/* doorKeyKnown
tooltip : 需要钥匙
default : ['yellowKey', 1, false]
helpUrl : https://h5mota.com/games/template/_docs/#/event
if (Bool_0) Key_List_0 += ':o';
return '"'+Key_List_0+'": '+Int_0+', ';
*/;

doorKeyUnknown
    : IdString ':' Int '需要但不消耗' Bool BEND


/* doorKeyUnknown
tooltip : 需要钥匙
default : ['orangeKey', 1, false]
helpUrl : https://h5mota.com/games/template/_docs/#/event
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
    : '行走图朝向:' BGNL? Newline '向上ID' IdString? '向下ID' IdString? '向左ID' IdString? '向右ID' IdString? BEND


/* faceIds_m
tooltip : 行走图朝向
default : ["","","",""]
allIds : ['IdString_0','IdString_1','IdString_2','IdString_3']
helpUrl : https://h5mota.com/games/template/_docs/#/event
return '{' + [
    IdString_0 && ('"up": "' + IdString_0 +'"'),
    IdString_1 && ('"down": "' + IdString_1 +'"'),
    IdString_2 && ('"left": "' + IdString_2 +'"'),
    IdString_3 && ('"right": "' + IdString_3 +'"'),
].filter(function (x) { return x; }).join(', ') + '}\n';
*/;


mainStyle_m
    : '主要样式设置：' '标题界面背景图（544x422）：' EvalString BGNL? Newline 
      '竖屏标题界面背景图（422x580）' EvalString BGNL? Newline 
      '标题样式；可写 display: none 隐藏标题' EvalString BGNL? Newline 
      '标题按钮样式：' EvalString BGNL? Newline 
      '横屏状态栏背景；url(...) 0 0/100% 100% no-repeat 可将图片拉伸自适配' BGNL? Newline EvalString BGNL? Newline  
      '竖屏状态栏背景：' EvalString BGNL? Newline 
      '竖屏工具栏背景：' EvalString BGNL? Newline 
      '楼层切换样式：' EvalString BGNL? Newline
      '状态栏颜色' ColorString Colour '边框颜色' ColorString Colour '全局字体' EvalString BEND

/* mainStyle_m
tooltip : 主要样式设置
default : ["project/images/bg.jpg", "project/images/bg.jpg", "color: black", "background-color: #32369F; opacity: 0.85; color: #FFFFFF; border: #FFFFFF 2px solid; caret-color: #FFD700;", "url(project/materials/ground.png) repeat", "url(project/materials/ground.png) repeat", "url(project/materials/ground.png) repeat", "background-color: black; color: white", "255,255,255,1", "rgba(255,255,255,1)", "204,204,204,1", "rgba(204,204,204,1)", "Verdana"]
helpUrl : https://h5mota.com/games/template/_docs/#/event
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
    font: EvalString_8
};
return JSON.stringify(code);
*/;

//为了避免关键字冲突,全部加了_s
//动作
action
    :   text_0_s
    |   text_1_s
    |   comment_s
    |   autoText_s
    |   scrollText_s
    |   setText_s
    |   tip_s
    |   setValue_s
    |   setEnemy_s
    |   setFloor_s
    |   setGlobalAttribute_s
    |   setGlobalValue_s
    |   setGlobalFlag_s
    |   show_s
    |   hide_s
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
    |   showHero_s
    |   hideHero_s
    |   sleep_s
    |   wait_s
    |   waitAsync_s
    |   battle_s
    |   battle_1_s
    |   openDoor_s
    |   closeDoor_s
    |   changeFloor_s
    |   changePos_s
    |   setViewport_s
    |   moveViewport_s
    |   useItem_s
    |   loadEquip_s
    |   unloadEquip_s
    |   openShop_s
    |   disableShop_s
    |   follow_s
    |   unfollow_s
    |   animate_s
    |   vibrate_s
    |   showImage_s
    |   showImage_1_s
    |   hideImage_s
    |   showTextImage_s
    |   moveImage_s
    |   showGif_s
    |   setCurtain_0_s
    |   setCurtain_1_s
    |   screenFlash_s
    |   setWeather_s
    |   move_s
    |   moveAction_s
    |   moveHero_s
    |   jump_s
    |   jumpHero_s
    |   playBgm_s
    |   pauseBgm_s
    |   resumeBgm_s
    |   loadBgm_s
    |   freeBgm_s
    |   playSound_s
    |   stopSound_s
    |   setVolume_s
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
    |   callLoad_s
    |   previewUI_s
    |   clearMap_s
    |   setAttribute_s
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
    :   '显示文章' ':' EvalString Newline
    

/* text_0_s
tooltip : text：显示一段文字（剧情）
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=text%EF%BC%9A%E6%98%BE%E7%A4%BA%E4%B8%80%E6%AE%B5%E6%96%87%E5%AD%97%EF%BC%88%E5%89%A7%E6%83%85%EF%BC%89
doubleclicktext : EvalString_0
default : ["欢迎使用事件编辑器(双击方块进入多行编辑)"]
var code = '"'+EvalString_0+'",\n';
return code;
*/;

text_1_s
    :   '标题' EvalString? '图像' EvalString? '对话框效果' EvalString? ':' EvalString Newline
    

/* text_1_s
tooltip : text：显示一段文字（剧情）,选项较多请右键点击帮助
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=text%EF%BC%9A%E6%98%BE%E7%A4%BA%E4%B8%80%E6%AE%B5%E6%96%87%E5%AD%97%EF%BC%88%E5%89%A7%E6%83%85%EF%BC%89
doubleclicktext : EvalString_3
allIds : ['EvalString_1']
default : ["小妖精","fairy","","欢迎使用事件编辑器(双击方块进入多行编辑)"]
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
var code =  '"'+title+EvalString_2+EvalString_3+'",\n';
return code;
*/;

comment_s
    :   '添加注释' ':' EvalString Newline


/* comment_s
tooltip : comment：添加一段会被游戏跳过的注释内容
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=comment%ef%bc%9a%e6%b7%bb%e5%8a%a0%e6%b3%a8%e9%87%8a
doubleclicktext : EvalString_0
default : ["可以在这里写添加任何注释内容"]
colour : this.commentColor
var code = '{"type": "comment", "text": "'+EvalString_0+'"},\n';
return code;
*/;

autoText_s
    :   '自动剧情文本: 标题' EvalString? '图像' EvalString? '对话框效果' EvalString? '时间' Int BGNL? EvalString Newline
    

/* autoText_s
tooltip : autoText：自动剧情文本,用户无法跳过自动剧情文本,大段剧情文本请添加“是否跳过剧情”的提示
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=autotext%EF%BC%9A%E8%87%AA%E5%8A%A8%E5%89%A7%E6%83%85%E6%96%87%E6%9C%AC
doubleclicktext : EvalString_2
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
var code =  '{"type": "autoText", "text": "'+title+EvalString_2+EvalString_3+'", "time": '+Int_0+'},\n';
return code;
*/;

scrollText_s
    :   '滚动剧情文本:' '时间' Int '行距' Number '不等待执行完毕' Bool? BGNL? EvalString Newline


/* scrollText_s
tooltip : scrollText：滚动剧情文本，将从下到上进行滚动显示。
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=scrollText%ef%bc%9a%e6%bb%9a%e5%8a%a8%e5%89%a7%e6%83%85%e6%96%87%e6%9c%ac
doubleclicktext : EvalString_0
default : [5000,1.4,false,"时间是总时间，可以使用setText事件来控制字体、颜色、大小、偏移量等"]
Bool_0 = Bool_0?', "async": true':'';
var code =  '{"type": "scrollText", "text": "'+EvalString_0+'"'+Bool_0+', "time" :'+Int_0+', "lineHeight": '+Number_0+'},\n';
return code;
*/;

setText_s
    :   '设置剧情文本的属性' '位置' SetTextPosition_List '偏移像素' IntString? '对齐' TextAlign_List? BGNL? '标题颜色' ColorString? Colour '正文颜色' ColorString? Colour '背景色' EvalString? Colour BGNL? '粗体' B_1_List '标题字体大小' IntString? '正文字体大小' IntString? '行距' IntString? '打字间隔' IntString? '字符间距' IntString? Newline
    

/* setText_s
tooltip : setText：设置剧情文本的属性,颜色为RGB三元组或RGBA四元组,打字间隔为剧情文字添加的时间间隔,为整数或不填，字符间距为字符之间的距离，为整数或不填。
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=settext%EF%BC%9A%E8%AE%BE%E7%BD%AE%E5%89%A7%E6%83%85%E6%96%87%E6%9C%AC%E7%9A%84%E5%B1%9E%E6%80%A7
default : [null,"",null,"",'rgba(255,255,255,1)',"",'rgba(255,255,255,1)',"",'rgba(255,255,255,1)',null,"","","","",""]
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
IntString_5 = IntString_5 ? (', "interval": '+IntString_5) : '';
B_1_List_0 = B_1_List_0==='null'?'':', "bold": '+B_1_List_0;
var code = '{"type": "setText"'+SetTextPosition_List_0+IntString_0+TextAlign_List_0+ColorString_0+ColorString_1+B_1_List_0+EvalString_0+IntString_1+IntString_2+IntString_3+IntString_4+IntString_5+'},\n';
return code;
*/;

tip_s
    :   '显示提示' ':' EvalString '图标ID' IdString? Newline
    

/* tip_s
tooltip : tip：显示一段提示文字
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=tip%EF%BC%9A%E6%98%BE%E7%A4%BA%E4%B8%80%E6%AE%B5%E6%8F%90%E7%A4%BA%E6%96%87%E5%AD%97
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setvalue%EF%BC%9A%E8%AE%BE%E7%BD%AE%E5%8B%87%E5%A3%AB%E7%9A%84%E6%9F%90%E4%B8%AA%E5%B1%9E%E6%80%A7%E3%80%81%E9%81%93%E5%85%B7%E4%B8%AA%E6%95%B0%EF%BC%8C%E6%88%96%E6%9F%90%E4%B8%AA%E5%8F%98%E9%87%8Fflag%E7%9A%84%E5%80%BC
colour : this.dataColor
if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
  AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
} else AssignOperator_List_0 = '';
Bool_0 = Bool_0 ? ', "norefresh": true' : '';
var code = '{"type": "setValue", "name": "'+idString_e_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"' + Bool_0 + '},\n';
return code;
*/;


setEnemy_s
    :   '设置怪物属性' ':' '怪物ID' IdString '的' EnemyId_List '值' expression Newline


/* setEnemy_s
tooltip : setEnemy：设置某个怪物的属性
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setEnemy%ef%bc%9a%e5%a2%9e%e5%87%8f%e5%8b%87%e5%a3%ab%e7%9a%84%e6%9f%90%e4%b8%aa%e5%b1%9e%e6%80%a7%e3%80%81%e9%81%93%e5%85%b7%e4%b8%aa%e6%95%b0%ef%bc%8c%e6%88%96%e6%9f%90%e4%b8%aa%e5%8f%98%e9%87%8f%2fFlag%e7%9a%84%e5%80%bc
default : ["greenSlime", "atk", "0"]
allEnemys : ['IdString_0']
colour : this.dataColor
var code = '{"type": "setEnemy", "id": "'+IdString_0+'", "name": "'+EnemyId_List_0+'", "value": "'+expression_0+'"},\n';
return code;
*/;


setFloor_s
    :   '设置楼层属性' ':' Floor_Meta_List '楼层名' IdString? '值' JsonEvalString Newline


/* setFloor_s
tooltip : setFloor：设置楼层属性；该楼层属性和编辑器中的楼层属性一一对应
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setFloor%ef%bc%9a%e8%ae%be%e7%bd%ae%e6%a5%bc%e5%b1%82%e5%b1%9e%e6%80%a7
default : ["title","","\"新楼层名\""]
allFloorIds : ['IdString_0']
colour : this.dataColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "setFloor", "name": "'+Floor_Meta_List_0+'"'+IdString_0+', "value": '+JsonEvalString_0+'},\n';
return code;
*/;


setGlobalAttribute_s
    :   '设置全局属性' ':' Global_Attribute_List '值' EvalString Newline


/* setGlobalAttribute_s
tooltip : setGlobalAttribute：设置全局属性
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setGlobalAttribute%ef%bc%9a%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e5%85%a8%e5%b1%80%e5%b1%9e%e6%80%a7
default : ["font","Verdana"]
colour : this.dataColor
var code = '{"type": "setGlobalAttribute", "name": "'+Global_Attribute_List_0+'", "value": "'+EvalString_0+'"},\n';
return code;
*/;


setGlobalValue_s
    :   '设置全局数值' ':' Global_Value_List '值' EvalString Newline


/* setGlobalValue_s
tooltip : setGlobalValue：设置全局属性
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setGlobalValue%ef%bc%9a%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e5%85%a8%e5%b1%80%e6%95%b0%e5%80%bc
default : ["lavaDamage","100"]
colour : this.dataColor
var code = '{"type": "setGlobalValue", "name": "'+Global_Value_List_0+'", "value": '+EvalString_0+'},\n';
return code;
*/;


setGlobalFlag_s
    :   '设置系统开关' ':' Global_Flag_List Bool Newline


/* setGlobalFlag_s
tooltip : setGlobalFlag：设置系统开关
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setGlobalFlag%ef%bc%9a%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%b3%bb%e7%bb%9f%e5%bc%80%e5%85%b3
default : ["s:enableFloor","true"]
colour : this.dataColor
var code = '{"type": "setGlobalFlag", "name": "'+Global_Flag_List_0+'", "value": '+Bool_0+'},\n';
return code;
*/;


show_s
    :   '显示事件' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '动画时间' IntString? '不等待执行完毕' Bool? Newline
    

/* show_s
tooltip : show: 将禁用事件启用,楼层和动画时间可不填,xy可用逗号分隔表示多个点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=show%EF%BC%9A%E5%B0%86%E4%B8%80%E4%B8%AA%E7%A6%81%E7%94%A8%E4%BA%8B%E4%BB%B6%E5%90%AF%E7%94%A8
default : ["","","","",false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=hide%EF%BC%9A%E5%B0%86%E4%B8%80%E4%B8%AA%E5%90%AF%E7%94%A8%E4%BA%8B%E4%BB%B6%E7%A6%81%E7%94%A8
default : ["","","",true,"",false]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0 ?', "remove": true':'';
Bool_1 = Bool_1 ?', "async": true':'';
var code = '{"type": "hide"'+floorstr+IdString_0+Bool_0+IntString_0+Bool_1+'},\n';
return code;
*/;

trigger_s
    :   '触发系统事件' 'x' PosString? ',' 'y' PosString? Newline
    

/* trigger_s
tooltip : trigger: 立即触发另一个地点的事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=trigger%EF%BC%9A%E7%AB%8B%E5%8D%B3%E8%A7%A6%E5%8F%91%E5%8F%A6%E4%B8%80%E4%B8%AA%E5%9C%B0%E7%82%B9%E7%9A%84%E4%BA%8B%E4%BB%B6
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=insert%ef%bc%9a%e6%8f%92%e5%85%a5%e5%85%ac%e5%85%b1%e4%ba%8b%e4%bb%b6%e6%88%96%e5%8f%a6%e4%b8%80%e4%b8%aa%e5%9c%b0%e7%82%b9%e7%9a%84%e4%ba%8b%e4%bb%b6%e5%b9%b6%e6%89%a7%e8%a1%8c
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=insert%ef%bc%9a%e6%8f%92%e5%85%a5%e5%85%ac%e5%85%b1%e4%ba%8b%e4%bb%b6%e6%88%96%e5%8f%a6%e4%b8%80%e4%b8%aa%e5%9c%b0%e7%82%b9%e7%9a%84%e4%ba%8b%e4%bb%b6%e5%b9%b6%e6%89%a7%e8%a1%8c
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=exit%EF%BC%9A%E7%AB%8B%E5%88%BB%E7%BB%93%E6%9D%9F%E5%BD%93%E5%89%8D%E4%BA%8B%E4%BB%B6
colour : this.eventColor
var code = '{"type": "exit"},\n';
return code;
*/;

setBlock_s
    :   '转变图块为' EvalString 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '动画时间' IntString? '不等待执行完毕' Bool Newline
    

/* setBlock_s
tooltip : setBlock：设置某个图块,忽略坐标楼层则为当前事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setblock%EF%BC%9A%E8%AE%BE%E7%BD%AE%E6%9F%90%E4%B8%AA%E5%9B%BE%E5%9D%97
colour : this.mapColor
allFloorIds : ['IdString_0']
allIds : ['EvalString_0']
default : ["yellowDoor","","","","",false]
selectPoint : ["EvalString_1", "EvalString_2", "IdString_0"]
var floorstr = '';
if (EvalString_1 && EvalString_2) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_1) || pattern1.test(EvalString_2)){
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_2=MotaActionFunctions.PosString_pre(EvalString_2);
    EvalString_1=[EvalString_1,EvalString_2]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_1) || !pattern2.test(EvalString_2))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_1=EvalString_1.split(',');
    EvalString_2=EvalString_2.split(',');
    if(EvalString_1.length!==EvalString_2.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_1.length;ii++)EvalString_1[ii]='['+EvalString_1[ii]+','+EvalString_2[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_1.join(',')+']';
}
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setblock%EF%BC%9A%E8%AE%BE%E7%BD%AE%E6%9F%90%E4%B8%AA%E5%9B%BE%E5%9D%97
colour : this.mapColor
allFloorIds : ['IdString_0']
default : [null,"","",""]
selectPoint : ["EvalString_1", "EvalString_2", "IdString_0"]
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "turnBlock"'+DirectionEx_List_0+floorstr+IdString_0+'},\n';
return code;
*/;

showFloorImg_s
    :   '显示贴图' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* showFloorImg_s
tooltip : showFloorImg: 显示一个贴图，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showFloorImg%ef%bc%9a%e6%98%be%e7%a4%ba%e8%b4%b4%e5%9b%be
default : ["","",""]
allFloorIds : ['IdString_0']
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
colour : this.mapColor
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "showFloorImg"'+floorstr+IdString_0+'},\n';
return code;
*/;

hideFloorImg_s
    :   '隐藏贴图' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* hideFloorImg_s
tooltip : hideFloorImg: 隐藏一个贴图，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=hideFloorImg%ef%bc%9a%e9%9a%90%e8%97%8f%e8%b4%b4%e5%9b%be
default : ["","",""]
allFloorIds : ['IdString_0']
colour : this.mapColor
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "hideFloorImg"'+floorstr+IdString_0+'},\n';
return code;
*/;

showBgFgMap_s
    :   '显示图层块' Bg_Fg_List 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* showBgFgMap_s
tooltip : showBgFgMap: 显示图层块，即背景图层/前景图层的某些图块，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showFloorImg%ef%bc%9a%e6%98%be%e7%a4%ba%e8%b4%b4%e5%9b%be
default : ["bg","","",""]
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
allFloorIds : ['IdString_0']
colour : this.mapColor
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "showBgFgMap", "name": "' + Bg_Fg_List_0 + '"' +floorstr+IdString_0+'},\n';
return code;
*/;

hideBgFgMap_s
    :   '隐藏图层块' Bg_Fg_List 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* hideBgFgMap_s
tooltip : hideBgFgMap: 隐藏图层块，即背景图层/前景图层的某些图块，xy为左上角坐标，可用逗号分隔表示多个点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=hideFloorImg%ef%bc%9a%e9%9a%90%e8%97%8f%e8%b4%b4%e5%9b%be
default : ["bg","","",""]
allFloorIds : ['IdString_0']
colour : this.mapColor
selectPoint : ["EvalString_0", "EvalString_1", "IdString_0"]
var floorstr = '';
if (EvalString_0 && EvalString_1) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_0) || pattern1.test(EvalString_1)){
    EvalString_0=MotaActionFunctions.PosString_pre(EvalString_0);
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_0=[EvalString_0,EvalString_1]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_0=EvalString_0.split(',');
    EvalString_1=EvalString_1.split(',');
    if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_0.join(',')+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "hideBgFgMap", "name": "' + Bg_Fg_List_0 + '"' +floorstr+IdString_0+'},\n';
return code;
*/;

setBgFgBlock_s
    :   '转变图层块' Bg_Fg_List '为' EvalString 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline


/* setBgFgBlock_s
tooltip : setBgFgBlock：设置某个图层块,忽略坐标楼层则为当前点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setblock%EF%BC%9A%E8%AE%BE%E7%BD%AE%E6%9F%90%E4%B8%AA%E5%9B%BE%E5%9D%97
colour : this.mapColor
selectPoint : ["EvalString_1", "EvalString_2", "IdString_0"]
allIds : ['EvalString_0']
allFloorIds : ['IdString_0']
default : ["bg","yellowDoor","","",""]
var floorstr = '';
if (EvalString_1 && EvalString_2) {
  var pattern1 = MotaActionFunctions.pattern.id;
  if(pattern1.test(EvalString_1) || pattern1.test(EvalString_2)){
    EvalString_1=MotaActionFunctions.PosString_pre(EvalString_1);
    EvalString_2=MotaActionFunctions.PosString_pre(EvalString_2);
    EvalString_1=[EvalString_1,EvalString_2]
  } else {
    var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
    if(!pattern2.test(EvalString_1) || !pattern2.test(EvalString_2))throw new Error('坐标格式错误,请右键点击帮助查看格式');
    EvalString_1=EvalString_1.split(',');
    EvalString_2=EvalString_2.split(',');
    if(EvalString_1.length!==EvalString_2.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
    for(var ii=0;ii<EvalString_1.length;ii++)EvalString_1[ii]='['+EvalString_1[ii]+','+EvalString_2[ii]+']';
  }
  floorstr = ', "loc": ['+EvalString_1.join(',')+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "setBgFgBlock", "name": "' + Bg_Fg_List_0 + '", "number": "'+EvalString_0+'"'+floorstr+IdString_0+'},\n';
return code;
*/;

setHeroIcon_s
    :   '更改角色行走图' EvalString? Newline
    

/* setHeroIcon_s
tooltip : setHeroIcon：更改角色行走图
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setheroicon%EF%BC%9A%E6%9B%B4%E6%94%B9%E8%A7%92%E8%89%B2%E8%A1%8C%E8%B5%B0%E5%9B%BE
colour : this.dataColor
default : ["hero.png"]
allImages : ['EvalString_0']
EvalString_0 = EvalString_0 && (', "name": "'+EvalString_0+'"');
var code = '{"type": "setHeroIcon"'+EvalString_0+'},\n';
return code;
*/;

update_s
    :   '更新状态栏和地图显伤' '不检查自动事件' Bool Newline
    

/* update_s
tooltip : update: 立刻更新状态栏和地图显伤
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=update%EF%BC%9A%E7%AB%8B%E5%88%BB%E6%9B%B4%E6%96%B0%E7%8A%B6%E6%80%81%E6%A0%8F%E5%92%8C%E5%9C%B0%E5%9B%BE%E6%98%BE%E4%BC%A4
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showStatusBar%ef%bc%9a%e6%98%be%e7%a4%ba%e7%8a%b6%e6%80%81%e6%a0%8f
colour : this.soundColor
var code = '{"type": "showStatusBar"},\n';
return code;
*/;

hideStatusBar_s
    :   '隐藏状态栏' '不隐藏竖屏工具栏' Bool Newline


/* hideStatusBar_s
tooltip : hideStatusBar: 隐藏状态栏
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=hideStatusBar%ef%bc%9a%e9%9a%90%e8%97%8f%e7%8a%b6%e6%80%81%e6%a0%8f
colour : this.soundColor
default : [false]
Bool_0 = Bool_0?', "toolbox": true':'';
var code = '{"type": "hideStatusBar"'+Bool_0+'},\n';
return code;
*/;

showHero_s
    :   '显示勇士' '动画时间' IntString? '不等待执行完毕' Bool Newline


/* showHero_s
tooltip : showHero: 显示勇士
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showHero%3a+%e6%98%be%e7%a4%ba%e5%8b%87%e5%a3%ab
default : ['',false]
colour : this.soundColor
IntString_0 = IntString_0 && (', "time": ' + IntString_0);
Bool_0 = Bool_0 ? (', "async": true') : '';
var code = '{"type": "showHero"'+IntString_0+Bool_0+'},\n';
return code;
*/;

hideHero_s
    :   '隐藏勇士' '动画时间' IntString? '不等待执行完毕' Bool Newline


/* hideHero_s
tooltip : hideHero: 隐藏勇士
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=hideHero%ef%bc%9a%e9%9a%90%e8%97%8f%e5%8b%87%e5%a3%ab
default : ['',false]
colour : this.soundColor
IntString_0 = IntString_0 && (', "time": ' + IntString_0);
Bool_0 = Bool_0 ? (', "async": true') : '';
var code = '{"type": "hideHero"'+IntString_0+Bool_0+'},\n';
return code;
*/;

sleep_s
    :   '等待' Int '毫秒' '不可被Ctrl跳过' Bool Newline
    

/* sleep_s
tooltip : sleep: 等待多少毫秒
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=sleep%EF%BC%9A%E7%AD%89%E5%BE%85%E5%A4%9A%E5%B0%91%E6%AF%AB%E7%A7%92
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=battle%EF%BC%9A%E5%BC%BA%E5%88%B6%E6%88%98%E6%96%97
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=battle%EF%BC%9A%E5%BC%BA%E5%88%B6%E6%88%98%E6%96%97
default : ["","",""]
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=opendoor%EF%BC%9A%E5%BC%80%E9%97%A8
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=opendoor%EF%BC%9A%E5%BC%80%E9%97%A8
default : ["","","yellowDoor",false]
selectPoint : ["PosString_0", "PosString_1"]
allIds : ['IdString_0']
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=changefloor%EF%BC%9A%E6%A5%BC%E5%B1%82%E5%88%87%E6%8D%A2
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=changepos%EF%BC%9A%E5%BD%93%E5%89%8D%E4%BD%8D%E7%BD%AE%E5%88%87%E6%8D%A2%E5%8B%87%E5%A3%AB%E8%BD%AC%E5%90%91
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=useItem%ef%bc%9a%e4%bd%bf%e7%94%a8%e9%81%93%e5%85%b7
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=useItem%ef%bc%9a%e4%bd%bf%e7%94%a8%e9%81%93%e5%85%b7
colour : this.dataColor
default : ["sword1"]
allItems : ['IdString_0']
var code = '{"type": "loadEquip", "id": "'+IdString_0+'"},\n';
return code;
*/;

unloadEquip_s
    :   '卸下装备孔' Int '的装备' Newline


/* unloadEquip_s
tooltip : unloadEquip: 卸下装备
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=useItem%ef%bc%9a%e4%bd%bf%e7%94%a8%e9%81%93%e5%85%b7
colour : this.dataColor
default : [0]
var code = '{"type": "unloadEquip", "pos": '+Int_0+'},\n';
return code;
*/;

openShop_s
    :   '启用全局商店' IdString '同时打开' Bool Newline
    

/* openShop_s
tooltip : 全局商店
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=openshop%EF%BC%9A%E6%89%93%E5%BC%80%E4%B8%80%E4%B8%AA%E5%85%A8%E5%B1%80%E5%95%86%E5%BA%97
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=disableshop%EF%BC%9A%E7%A6%81%E7%94%A8%E4%B8%80%E4%B8%AA%E5%85%A8%E5%B1%80%E5%95%86%E5%BA%97
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=follow%ef%bc%9a%e8%b7%9f%e9%9a%8f%e5%8b%87%e5%a3%ab
default : ["npc.png"]
allImages : ['EvalString_0']
colour : this.dataColor
var code = '{"type": "follow", "name": "'+EvalString_0+'"},\n';
return code;
*/;

unfollow_s
    :   '取消跟随' '行走图' EvalString? Newline


/* unfollow_s
tooltip : unfollow: 取消跟随
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=unfollow%ef%bc%9a%e5%8f%96%e6%b6%88%e8%b7%9f%e9%9a%8f
default : [""]
allImages : ['EvalString_0']
colour : this.dataColor
EvalString_0 = EvalString_0 ? (', "name": "' + EvalString_0 + '"') : "";
var code = '{"type": "unfollow"' + EvalString_0 + '},\n';
return code;
*/;

vibrate_s
    :   '画面震动' '时间' Int '不等待执行完毕' Bool Newline


/* vibrate_s
tooltip : vibrate: 画面震动
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=vibrate%ef%bc%9a%e7%94%bb%e9%9d%a2%e9%9c%87%e5%8a%a8
default : [2000,false]
colour : this.soundColor
Int_0 = Int_0 ?(', "time": '+Int_0):'';
var async = Bool_0?', "async": true':''
var code = '{"type": "vibrate"' + Int_0 + async + '},\n';
return code;
*/;

animate_s
    :   '显示动画' IdString '位置' EvalString? '相对窗口坐标' Bool '不等待执行完毕' Bool Newline
    

/* animate_s
tooltip : animate：显示动画,位置填hero或者1,2形式的位置,或者不填代表当前事件点
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=animate%EF%BC%9A%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB
default : ["zone","hero",false,false]
allAnimates : ['IdString_0']
selectPoint : ["EvalString_0", "EvalString_0"]
colour : this.soundColor
if (EvalString_0) {
  if(MotaActionFunctions.pattern.id2.test(EvalString_0)) {
    EvalString_0=', "loc": ["'+EvalString_0.split(',').join('","')+'"]';
  } else if (/hero|([+-]?\d+),([+-]?\d+)/.test(EvalString_0)) {
    if(EvalString_0.indexOf(',')!==-1)EvalString_0='['+EvalString_0+']';
    else EvalString_0='"'+EvalString_0+'"';
    EvalString_0 = ', "loc": '+EvalString_0;
  } else {
    throw new Error('此处只能填hero或者1,2形式的位置,或者不填代表当前事件点');
  }
}
Bool_0 = Bool_0?', "alignWindow": true':'';
var async = Bool_1?', "async": true':'';
var code = '{"type": "animate", "name": "'+IdString_0+'"'+EvalString_0+Bool_0+async+'},\n';
return code;
*/;

setViewport_s
    :   '设置视角' '左上角坐标' 'x' PosString? ',' 'y' PosString? Newline


/* setViewport_s
tooltip : setViewport: 设置视角
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=changepos%EF%BC%9A%E5%BD%93%E5%89%8D%E4%BD%8D%E7%BD%AE%E5%88%87%E6%8D%A2%E5%8B%87%E5%A3%AB%E8%BD%AC%E5%90%91
default : ["",""]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.soundColor
var loc = '';
if (PosString_0 && PosString_1) {
    loc = ', "loc": ['+PosString_0+','+PosString_1+']';
}
var code = '{"type": "setViewport"'+loc+'},\n';
return code;
*/;

moveViewport_s
    :   '移动视角' '动画时间' IntString '不等待执行完毕' Bool BGNL? StepString Newline


/* moveViewport_s
tooltip : moveViewport：移动视角
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=movehero%EF%BC%9A%E7%A7%BB%E5%8A%A8%E5%8B%87%E5%A3%AB
default : [300,false,"上右3下2左"]
colour : this.soundColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "moveViewport"'+IntString_0+Bool_0+', "steps": '+JSON.stringify(StepString_0)+'},\n';
return code;
*/;

showImage_s
    :   '显示图片' '图片编号' Int '图片' EvalString '翻转' Reverse_List BGNL?
        '绘制的起点像素' 'x' PosString 'y' PosString '不透明度' Number '时间' Int '不等待执行完毕' Bool Newline
    

/* showImage_s
tooltip : showImage：显示图片
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showImage%ef%bc%9a%e6%98%be%e7%a4%ba%e5%9b%be%e7%89%87
default : [1,"bg.jpg","null","0","0",1,0,false]
allImages : ['EvalString_0']
colour : this.printColor
if(Int_0<=0 || Int_0>50) throw new Error('图片编号在1~50之间');
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
var async = Bool_0?', "async": true':'';
var code = '{"type": "showImage", "code": '+Int_0+', "image": "'+EvalString_0+'"'+Reverse_List_0+', "loc": ['+PosString_0+','+PosString_1+'], "opacity": '+Number_0+', "time": '+Int_1+async+'},\n';
return code;
*/;

showImage_1_s
    :   '显示图片' '图片编号' Int '图片' EvalString '翻转' Reverse_List BGNL?
        '裁剪的起点像素' 'x' PosString 'y' PosString '宽' PosString? '高' PosString? '不透明度' Number BGNL?
        '绘制的起点像素' 'x' PosString 'y' PosString '宽' PosString? '高' PosString? '时间' Int '不等待执行完毕' Bool Newline


/* showImage_1_s
tooltip : showImage_1：显示图片
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showImage%ef%bc%9a%e6%98%be%e7%a4%ba%e5%9b%be%e7%89%87
default : [1,"bg.jpg","null","0","0","","",1,"0","0","","",0,false]
allImages : ['EvalString_0']
colour : this.printColor
if(Int_0<=0 || Int_0>50) throw new Error('图片编号在1~50之间');
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
var async = Bool_0?', "async": true':'';
var code = '{"type": "showImage", "code": '+Int_0+', "image": "'+EvalString_0+'"'+Reverse_List_0+', '+
           '"sloc": ['+PosString_0+','+PosString_1+','+PosString_2+','+PosString_3+'], '+
           '"loc": ['+PosString_4+','+PosString_5+','+PosString_6+','+PosString_7+'], '+
           '"opacity": '+Number_0+', "time": '+Int_1+async+'},\n';
return code;
*/;

showTextImage_s
    :   '显示图片化文本' '文本内容' EvalString BGNL?
        '图片编号' Int '起点像素' 'x' PosString 'y' PosString '行距' Number '翻转' Reverse_List '不透明度' Number '时间' Int '不等待执行完毕' Bool Newline
    

/* showTextImage_s
tooltip : showTextImage：显示图片化文本
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showTextImage%ef%bc%9a%e6%98%be%e7%a4%ba%e6%96%87%e6%9c%ac%e5%8c%96%e5%9b%be%e7%89%87
doubleclicktext : EvalString_0
colour : this.printColor
default : ["可以使用setText事件来控制字体、颜色、大小、偏移量等",1,"0","0",1.4,"null",1,0,false]
if(Int_0<=0 || Int_0>50) throw new Error('图片编号在1~50之间');
if (Reverse_List_0 && Reverse_List_0 != 'null') {
    Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
} else Reverse_List_0 = '';
var async = Bool_0?', "async": true':'';
var code = '{"type": "showTextImage", "code": '+Int_0+', "text": "'+EvalString_0+'", "loc": ['+PosString_0+','+PosString_1+'], "lineHeight": '+Number_0+Reverse_List_0+', "opacity": '+Number_1+', "time": '+Int_1+async+'},\n';
return code;
*/;

hideImage_s
    :   '清除图片' '图片编号' Int '时间' Int '不等待执行完毕' Bool Newline
    

/* hideImage_s
tooltip : hideImage：清除图片
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=hideImage%ef%bc%9a%e6%b8%85%e9%99%a4%e5%9b%be%e7%89%87
colour : this.printColor
default : [1,0,false]
if(Int_0<=0 || Int_0>50) throw new Error('图片编号在1~50之间');
var async = Bool_0?', "async": true':'';
var code = '{"type": "hideImage", "code": '+Int_0+', "time": '+Int_1+async+'},\n';
return code;
*/;

showGif_s
    :   '显示或清除动图' EvalString? '起点像素位置' 'x' PosString? 'y' PosString? Newline
    

/* showGif_s
tooltip : showGif：显示动图
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showgif%EF%BC%9A%E6%98%BE%E7%A4%BA%E5%8A%A8%E5%9B%BE
default : ["","",""]
allImages : ['EvalString_0']
colour : this.printColor
EvalString_0 = EvalString_0 ? (', "name": "'+EvalString_0+'"') : '';
var loc = (PosString_0 && PosString_1) ? (', "loc": ['+PosString_0+','+PosString_1+']') : '';
var code = '{"type": "showGif"'+EvalString_0+loc+'},\n';
return code;
*/;

moveImage_s
    :   '图片移动' '图片编号' Int '终点像素位置' 'x' PosString? 'y' PosString? BGNL?
        '不透明度' EvalString? '移动时间' Int '不等待执行完毕' Bool Newline
    

/* moveImage_s
tooltip : moveImage：图片移动
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=moveImage%ef%bc%9a%e5%9b%be%e7%89%87%e7%a7%bb%e5%8a%a8
default : [1,'','','',500,false]
colour : this.printColor
if(Int_0<=0 || Int_0>50) throw new Error('图片编号在1~50之间');
var toloc = '';
if (PosString_0 && PosString_1)
  toloc = ', "to": ['+PosString_0+','+PosString_1+']';
EvalString_0 = (EvalString_0!=='') ? (', "opacity": '+EvalString_0):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "moveImage", "code": '+Int_0+toloc+EvalString_0+',"time": '+Int_1+async+'},\n';
return code;
*/;

setCurtain_0_s
    :   '更改画面色调' ColorString Colour '动画时间' IntString '持续到下一个本事件' Bool '不等待执行完毕' Bool Newline
    

/* setCurtain_0_s
tooltip : setCurtain: 更改画面色调,动画时间可不填
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setcurtain%EF%BC%9A%E6%9B%B4%E6%94%B9%E7%94%BB%E9%9D%A2%E8%89%B2%E8%B0%83
default : ["255,255,255,1",'rgba(255,255,255,1)',500,true,false]
colour : this.soundColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0 ? ', "keep": true' : '';
var async = Bool_1?', "async": true':'';
var code = '{"type": "setCurtain", "color": ['+ColorString_0+']'+IntString_0 +Bool_0+async+'},\n';
return code;
*/;

setCurtain_1_s
    :   '恢复画面色调' '动画时间' IntString? '不等待执行完毕' Bool Newline
    

/* setCurtain_1_s
tooltip : setCurtain: 恢复画面色调,动画时间可不填
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setcurtain%EF%BC%9A%E6%9B%B4%E6%94%B9%E7%94%BB%E9%9D%A2%E8%89%B2%E8%B0%83
default : [500,false]
colour : this.soundColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "setCurtain"'+IntString_0 +async+'},\n';
return code;
*/;

screenFlash_s
    :   '画面闪烁' ColorString Colour '单次时间' Int '执行次数' IntString? '不等待执行完毕' Bool Newline

/* screenFlash_s
tooltip : screenFlash: 画面闪烁,动画时间可不填
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=screenFlash%EF%BC%9A%E7%94%BB%E9%9D%A2%E9%97%AA%E7%83%81
default : ["255,255,255,1",'rgba(255,255,255,1)',500,1,false]
colour : this.soundColor
if (ColorString_0 == '') throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
IntString_0 = IntString_0 ? (', "times": '+IntString_0):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "screenFlash", "color": ['+ColorString_0+'], "time": '+Int_0 +IntString_0+async+'},\n';
return code;
*/;

setWeather_s
    :   '更改天气' Weather_List '强度' Int '持续到下个本事件' Bool Newline
    

/* setWeather_s
tooltip : setWeather：更改天气
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setweather%EF%BC%9A%E6%9B%B4%E6%94%B9%E5%A4%A9%E6%B0%94
default : [null,1,true]
colour : this.soundColor
if(Int_0<1 || Int_0>10) throw new Error('天气的强度等级, 在1-10之间');
Bool_0 = Bool_0 ? ', "keep": true' : ''
var code = '{"type": "setWeather", "name": "'+Weather_List_0+'", "level": '+Int_0+Bool_0+'},\n';
if(Weather_List_0===''||Weather_List_0==='null'||Weather_List_0==null)code = '{"type": "setWeather"},\n';
return code;
*/;

move_s
    :   '移动事件' 'x' PosString? ',' 'y' PosString? '动画时间' IntString? '不消失' Bool '不等待执行完毕' Bool BGNL? StepString Newline
    

/* move_s
tooltip : move: 让某个NPC/怪物移动,位置可不填代表当前事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=move%EF%BC%9A%E8%AE%A9%E6%9F%90%E4%B8%AAnpc%E6%80%AA%E7%89%A9%E7%A7%BB%E5%8A%A8
default : ["","",500,false,false,"上右3下2后4左前2"]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.mapColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
}
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "keep": true':'';
Bool_1 = Bool_1?', "async": true':'';
var code = '{"type": "move"'+floorstr+IntString_0+Bool_0+Bool_1+', "steps": '+JSON.stringify(StepString_0)+'},\n';
return code;
*/;

moveAction_s
    :   '勇士前进一格或撞击' Newline
    

/* moveAction_s
tooltip : moveAction: 前进一格或撞击
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=move%EF%BC%9A%E8%AE%A9%E6%9F%90%E4%B8%AAnpc%E6%80%AA%E7%89%A9%E7%A7%BB%E5%8A%A8
colour : this.dataColor
return '{"type": "moveAction"},\n';
*/;



moveHero_s
    :   '无视地形移动勇士' '动画时间' IntString? '不等待执行完毕' Bool BGNL? StepString Newline
    

/* moveHero_s
tooltip : moveHero：移动勇士,用这种方式移动勇士的过程中将无视一切地形, 无视一切事件, 中毒状态也不会扣血
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=movehero%EF%BC%9A%E7%A7%BB%E5%8A%A8%E5%8B%87%E5%A3%AB
default : ["",false,"上右3下2后4左前2"]
colour : this.dataColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
Bool_0 = Bool_0?', "async": true':'';
var code = '{"type": "moveHero"'+IntString_0+Bool_0+', "steps": '+JSON.stringify(StepString_0)+'},\n';
return code;
*/;

jump_s
    :   '跳跃事件' '起始 x' PosString? ',' 'y' PosString? '终止 x' PosString? ',' 'y' PosString? '动画时间' IntString? '不消失' Bool '不等待执行完毕' Bool Newline


/* jump_s
tooltip : jump: 让某个NPC/怪物跳跃
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=jump%EF%BC%9A%E8%AE%A9%E6%9F%90%E4%B8%AANPC%2F%E6%80%AA%E7%89%A9%E8%B7%B3%E8%B7%83
default : ["","","","",500,true,false]
selectPoint : ["PosString_2", "PosString_3"]
colour : this.mapColor

// selectPoint 跳跃暂时只考虑终点
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

jumpHero_s
    :   '跳跃勇士' 'x' PosString? ',' 'y' PosString? '动画时间' IntString? '不等待执行完毕' Bool Newline


/* jumpHero_s
tooltip : jumpHero: 跳跃勇士
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=jumpHero%EF%BC%9A%E8%B7%B3%E8%B7%83%E5%8B%87%E5%A3%AB
default : ["","",500,false]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.dataColor
var floorstr = '';
if (PosString_0 && PosString_1) {
    floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=playbgm%EF%BC%9A%E6%92%AD%E6%94%BE%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90
default : ["bgm.mp3", 0, true]
allBgms : ['EvalString_0']
colour : this.soundColor
Int_0 = Int_0 ? (', "startTime": '+Int_0) : '';
Bool_0 = Bool_0 ? ', "keep": true' : '';
var code = '{"type": "playBgm", "name": "'+EvalString_0+'"'+Int_0+Bool_0+'},\n';
return code;
*/;

pauseBgm_s
    :   '暂停背景音乐' Newline
    

/* pauseBgm_s
tooltip : pauseBgm: 暂停背景音乐
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=pausebgm%EF%BC%9A%E6%9A%82%E5%81%9C%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90
colour : this.soundColor
var code = '{"type": "pauseBgm"},\n';
return code;
*/;

resumeBgm_s
    :   '恢复背景音乐' '从暂停位置继续播放' Bool Newline
    

/* resumeBgm_s
tooltip : resumeBgm: 恢复背景音乐
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=resumebgm%EF%BC%9A%E6%81%A2%E5%A4%8D%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90
colour : this.soundColor
Bool_0 = Bool_0 ? ', "resume": true' : '';
var code = '{"type": "resumeBgm"' + Bool_0 + '},\n';
return code;
*/;

loadBgm_s
    :   '预加载背景音乐' EvalString Newline


/* loadBgm_s
tooltip : loadBgm: 预加载某个背景音乐，之后可以直接播放
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=loadBgm%ef%bc%9a%e9%a2%84%e5%8a%a0%e8%bd%bd%e4%b8%80%e4%b8%aa%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90
default : ["bgm.mp3"]
allBgms : ['EvalString_0']
colour : this.soundColor
var code = '{"type": "loadBgm", "name": "'+EvalString_0+'"},\n';
return code;
*/;

freeBgm_s
    :   '释放背景音乐的缓存' EvalString Newline


/* freeBgm_s
tooltip : freeBgm: 释放背景音乐的缓存
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=freeBgm%ef%bc%9a%e9%87%8a%e6%94%be%e4%b8%80%e4%b8%aa%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90%e7%9a%84%e7%bc%93%e5%ad%98
default : ["bgm.mp3"]
allBgms : ['EvalString_0']
colour : this.soundColor
var code = '{"type": "freeBgm", "name": "'+EvalString_0+'"},\n';
return code;
*/;

playSound_s
    :   '播放音效' EvalString '停止之前音效' Bool? Newline
    

/* playSound_s
tooltip : playSound: 播放音效
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=playsound%EF%BC%9A%E6%92%AD%E6%94%BE%E9%9F%B3%E6%95%88
default : ["item.mp3",false]
colour : this.soundColor
allSounds : ['EvalString_0']
Bool_0 = Bool_0 ? ', "stop": true' : '';
var code = '{"type": "playSound", "name": "'+EvalString_0+'"'+Bool_0+'},\n';
return code;
*/;

stopSound_s
    :   '停止所有音效' Newline


/* stopSound_s
tooltip : stopSound: 停止所有音效
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=stopSound%ef%bc%9a%e5%81%9c%e6%ad%a2%e6%89%80%e6%9c%89%e9%9f%b3%e6%95%88
colour : this.soundColor
var code = '{"type": "stopSound"},\n';
return code;
*/;

setVolume_s
    :   '设置音量' Int '渐变时间' IntString? '不等待执行完毕' Bool Newline
    

/* setVolume_s
tooltip : setVolume: 设置音量
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setvolume%EF%BC%9A%E8%AE%BE%E7%BD%AE%E9%9F%B3%E9%87%8F
default : [90, 500, false]
colour : this.soundColor
IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
var async = Bool_0?', "async": true':'';
var code = '{"type": "setVolume", "value": '+Int_0+IntString_0+async+'},\n';
return code;
*/;

win_s
    :   '游戏胜利,结局' ':' EvalString? '不计入榜单' Bool '不结束游戏' Bool Newline
    

/* win_s
tooltip : win: 获得胜利, 该事件会显示获胜页面, 并重新游戏
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=win%EF%BC%9A%E8%8E%B7%E5%BE%97%E8%83%9C%E5%88%A9
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=lose%EF%BC%9A%E6%B8%B8%E6%88%8F%E5%A4%B1%E8%B4%A5
default : [""]
var code = '{"type": "lose", "reason": "'+EvalString_0+'"},\n';
return code;
*/;

restart_s
    :   '直接回到标题界面' Newline


/* restart_s
tooltip : restart: 直接回到标题界面
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=restart%ef%bc%9a%e7%9b%b4%e6%8e%a5%e5%9b%9e%e5%88%b0%e6%a0%87%e9%a2%98%e7%95%8c%e9%9d%a2
var code = '{"type": "restart"},\n';
return code;
*/;

input_s
    :   '接受用户输入数字,提示' ':' EvalString Newline
    

/* input_s
tooltip : input：接受用户输入数字, 事件只能接受非负整数输入, 所有非法的输入将全部变成0
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=input%ef%bc%9a%e6%8e%a5%e5%8f%97%e7%94%a8%e6%88%b7%e8%be%93%e5%85%a5%e6%95%b0%e5%ad%97
default : ["请输入一个数"]
colour : this.dataColor
var code = '{"type": "input", "text": "'+EvalString_0+'"},\n';
return code;
*/;

input2_s
    :   '接受用户输入文本,提示' ':' EvalString Newline


/* input2_s
tooltip : input2：接受用户输入文本, 允许用户输入任何形式的文本
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=input2%ef%bc%9a%e6%8e%a5%e5%8f%97%e7%94%a8%e6%88%b7%e8%be%93%e5%85%a5%e6%96%87%e6%9c%ac
default : ["请输入文本"]
colour : this.dataColor
var code = '{"type": "input2", "text": "'+EvalString_0+'"},\n';
return code;
*/;

if_s
    :   '如果' ':' expression BGNL? Newline action+ '否则' ':' BGNL? Newline action+ BEND Newline
    

/* if_s
tooltip : if: 条件判断
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=if%EF%BC%9A%E6%9D%A1%E4%BB%B6%E5%88%A4%E6%96%AD
colour : this.eventColor
var code = ['{"type": "if", "condition": "',expression_0,'",\n',
    '"true": [\n',action_0,'],\n',
    '"false": [\n',action_1,']\n',
'},\n'].join('');
return code;
*/;

if_1_s
    :   '如果' ':' expression BGNL? Newline action+  BEND Newline


/* if_1_s
tooltip : if: 条件判断
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=if%EF%BC%9A%E6%9D%A1%E4%BB%B6%E5%88%A4%E6%96%AD
colour : this.eventColor
var code = ['{"type": "if", "condition": "',expression_0,'",\n',
    '"true": [\n',action_0,'],\n',
'},\n'].join('');
return code;
*/;

switch_s
    :   '多重分歧 条件判定' ':' expression BGNL? Newline switchCase+ BEND Newline


/* switch_s
tooltip : switch: 多重条件分歧
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=switch%EF%BC%9A%E5%A4%9A%E9%87%8D%E6%9D%A1%E4%BB%B6%E5%88%86%E6%AD%A7
default : ["判别值"]
colour : this.eventColor
var code = ['{"type": "switch", "condition": "',expression_0,'", "caseList": [\n',
    switchCase_0,
'], },\n'].join('');
return code;
*/;

switchCase
    :   '如果是' expression '的场合' '不跳出' Bool BGNL? Newline action+


/* switchCase
tooltip : 选项的选择
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=switch%EF%BC%9A%E5%A4%9A%E9%87%8D%E6%9D%A1%E4%BB%B6%E5%88%86%E6%AD%A7
default : ["", false]
colour : this.subColor
Bool_0 = Bool_0?', "nobreak": true':'';
var code = '{"case": "'+expression_0+'"'+Bool_0+', "action": [\n'+action_0+']},\n';
return code;
*/;

choices_s
    :   '选项' ':' EvalString? BGNL? '标题' EvalString? '图像' IdString? '超时毫秒数' Int BGNL? Newline choicesContext+ BEND Newline


/* choices_s
tooltip : choices: 给用户提供选项
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=choices%EF%BC%9A%E7%BB%99%E7%94%A8%E6%88%B7%E6%8F%90%E4%BE%9B%E9%80%89%E9%A1%B9
doubleclicktext : EvalString_0
default : ["","流浪者","trader",0]
allIds : ['IdString_0']
var title='';
if (EvalString_1==''){
    if (IdString_0=='')title='';
    else title='\\t['+IdString_0+']';
} else {
    if (IdString_0=='')title='\\t['+EvalString_1+']';
    else title='\\t['+EvalString_1+','+IdString_0+']';
}
EvalString_0 = title+EvalString_0;
EvalString_0 = EvalString_0 ?(', "text": "'+EvalString_0+'"'):'';
Int_0 = Int_0 ? (', "timeout": '+Int_0) : '';
var code = ['{"type": "choices"',EvalString_0,Int_0,', "choices": [\n',
    choicesContext_0,
']},\n'].join('');
return code;
*/;

choicesContext
    :   '子选项' EvalString '图标' IdString? '颜色' ColorString? Colour '出现条件' EvalString? BGNL? Newline action+


/* choicesContext
tooltip : 选项的选择
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=choices%EF%BC%9A%E7%BB%99%E7%94%A8%E6%88%B7%E6%8F%90%E4%BE%9B%E9%80%89%E9%A1%B9
default : ["提示文字:红钥匙","","",""]
allIds : ['IdString_0']
colour : this.subColor
ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
EvalString_1 = EvalString_1 && (', "condition": "'+EvalString_1+'"')
IdString_0 = IdString_0?(', "icon": "'+IdString_0+'"'):'';
var code = '{"text": "'+EvalString_0+'"'+IdString_0+ColorString_0+EvalString_1+', "action": [\n'+action_0+']},\n';
return code;
*/;

confirm_s
    :   '显示确认框' ':' EvalString '超时毫秒数' Int BGNL? '确定的场合' ':' '（默认选中' Bool '）' BGNL? Newline action+ '取消的场合' ':' BGNL? Newline action+ BEND Newline

/* confirm_s
tooltip : 弹出确认框
helpUrl : https://h5mota.com/games/template/_docs/#/
default : ["确认要xxx吗?",0,false]
doubleclicktext : EvalString_0
Bool_0 = Bool_0?', "default": true':''
Int_0 = Int_0 ? (', "timeout": '+Int_0) : '';
var code = ['{"type": "confirm"'+Int_0+Bool_0+', "text": "',EvalString_0,'",\n',
    '"yes": [\n',action_0,'],\n',
    '"no": [\n',action_1,']\n',
'},\n'].join('');
return code;
*/;

for_s
    :   '循环遍历' ': ' expression '从' EvalString '到' EvalString '步增' EvalString BGNL? Newline action+ BEND Newline

/* for_s
tooltip : for：循环遍历
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=while%ef%bc%9a%e5%89%8d%e7%bd%ae%e6%9d%a1%e4%bb%b6%e5%be%aa%e7%8e%af
colour : this.eventColor
if (!/^temp:[A-Z]$/.test(expression_0)) {
  throw new Error('循环遍历仅允许使用临时变量！');
}
return '{"type": "for", "name": "'+expression_0+'", "from": "'+EvalString_0+'", "to": "'+EvalString_1+'", "step": "'+EvalString_2+'",\n"data": [\n'+action_0+']},\n';
*/;    

forEach_s
    :   '循环遍历' ': 以' expression '逐项读取列表' JsonEvalString BGNL? Newline action+ BEND Newline

/* forEach_s
tooltip : forEach：循环遍历列表
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=while%ef%bc%9a%e5%89%8d%e7%bd%ae%e6%9d%a1%e4%bb%b6%e5%be%aa%e7%8e%af
colour : this.eventColor
if (!/^temp:[A-Z]$/.test(expression_0)) {
  throw new Error('循环遍历仅允许使用临时变量！');
}
if (JsonEvalString_0 == '' || !(JSON.parse(JsonEvalString_0) instanceof Array)) {
  throw new Error('参数列表必须是个有效的数组！');
}
return '{"type": "forEach", "name": "'+expression_0+'", "list": '+JsonEvalString_0 + ',\n"data": [\n'+action_0+']},\n';
*/;

while_s
    :   '前置条件循环' '：' '当' expression '时' BGNL? Newline action+ BEND Newline

/* while_s
tooltip : while：前置条件循环
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=while%ef%bc%9a%e5%89%8d%e7%bd%ae%e6%9d%a1%e4%bb%b6%e5%be%aa%e7%8e%af
colour : this.eventColor
var code = ['{"type": "while", "condition": "',expression_0,'",\n',
    '"data": [\n',action_0,'],\n',
'},\n'].join('');
return code;
*/;

dowhile_s
    :   '后置条件循环' '：'  BGNL? Newline action+ BEND '当' expression '时' Newline

/* dowhile_s
tooltip : dowhile：后置条件循环
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=dowhile%ef%bc%9a%e5%90%8e%e7%bd%ae%e6%9d%a1%e4%bb%b6%e5%be%aa%e7%8e%af
colour : this.eventColor
var code = ['{"type": "dowhile", "condition": "',expression_0,'",\n',
    '"data": [\n',action_0,'],\n',
'},\n'].join('');
return code;
*/;

break_s
    :   '跳出当前循环或公共事件' Newline

/* break_s
tooltip : break：跳出循环, 如果break事件不在任何循环中被执行，则和exit等价，即会立刻结束当前事件！
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=break%EF%BC%9A%E8%B7%B3%E5%87%BA%E5%BE%AA%E7%8E%AF
colour : this.eventColor
var code = '{"type": "break"},\n';
return code;
*/;

continue_s
    :   '继续当前循环' Newline

/* continue_s
tooltip : continue：继续执行当前循环的下一轮, 如果continue事件不在任何循环中被执行，则和exit等价，即会立刻结束当前事件！
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=continue%EF%BC%9A%E7%BB%A7%E7%BB%AD%E6%89%A7%E8%A1%8C%E5%BD%93%E5%89%8D%E5%BE%AA%E7%8E%AF
colour : this.eventColor
var code = '{"type": "continue"},\n';
return code;
*/;


wait_s
    :   '等待用户操作并获得按键或点击信息' '超时毫秒数' Int BGNL? Newline waitContext* BEND Newline


/* wait_s
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=wait%EF%BC%9A%E7%AD%89%E5%BE%85%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C
default : [0]
colour : this.soundColor
Int_0 = Int_0?(', "timeout": ' + Int_0):'';
waitContext_0 = waitContext_0 ? (', "data": [\n' + waitContext_0 + ']') : '';
var code = '{"type": "wait"' + Int_0 + waitContext_0 + '},\n';
return code;
*/;


waitContext
    : waitContext_1
    | waitContext_2
    | waitContext_empty;


waitContext_1
    : '按键的场合' '键值' EvalString BGNL? Newline action+ BEND Newline

/* waitContext_1
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=wait%EF%BC%9A%E7%AD%89%E5%BE%85%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C
colour : this.subColor
if (!/^\d+(,\d+)*$/.test(EvalString_0)) {
  throw new Error('键值必须是正整数，可以以逗号分隔');
}
var code = '{"case": "keyboard", "keycode": "' + EvalString_0 + '", "action": [\n' + action_0 + ']},\n';
return code;
*/;


waitContext_2
    : '点击的场合' '像素x范围' PosString '~' PosString '; y范围' PosString '~' PosString BGNL? Newline action+ BEND Newline

/* waitContext_2
tooltip : wait: 等待用户操作并获得按键或点击信息
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=wait%EF%BC%9A%E7%AD%89%E5%BE%85%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C
default : [0,32,0,32]
previewBlock : true
colour : this.subColor
var code = '{"case": "mouse", "px": [' + PosString_0 + ',' + PosString_1 + '], "py": [' + PosString_2 + ',' + PosString_3 + '], "action": [\n' + action_0 + ']},\n';
return code;
*/;

waitContext_empty : Newline

/* waitContext_empty
return '';
*/;


waitAsync_s
    :   '等待所有异步事件执行完毕'


/* waitAsync_s
tooltip : waitAsync: 等待所有异步事件执行完毕
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=waitAsync%ef%bc%9a%e7%ad%89%e5%be%85%e6%89%80%e6%9c%89%e5%bc%82%e6%ad%a5%e4%ba%8b%e4%bb%b6%e6%89%a7%e8%a1%8c%e5%ae%8c%e6%af%95
colour : this.soundColor
var code = '{"type": "waitAsync"},\n';
return code;
*/;


callBook_s
    :   '呼出怪物手册'


/* callBook_s
tooltip : callBook: 呼出怪物手册；返回游戏后将继续执行后面的事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=callBook%ef%bc%9a%e5%91%bc%e5%87%ba%e6%80%aa%e7%89%a9%e6%89%8b%e5%86%8c
colour : this.soundColor
var code = '{"type": "callBook"},\n';
return code;
*/;


callSave_s
    :   '呼出存档页面'


/* callSave_s
tooltip : callSave: 呼出存档页面
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=callSave%ef%bc%9a%e5%91%bc%e5%87%ba%e5%ad%98%e6%a1%a3%e7%95%8c%e9%9d%a2
colour : this.soundColor
var code = '{"type": "callSave"},\n';
return code;
*/;


autoSave_s
    :   '自动存档' '不提示' Bool Newline


/* autoSave_s
tooltip : autoSave: 自动存档
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=autoSave%ef%bc%9a%e8%87%aa%e5%8a%a8%e5%ad%98%e6%a1%a3
colour : this.soundColor
default : [false]
Bool_0 = Bool_0 ? (', "nohint": true') : '';
var code = '{"type": "autoSave"'+Bool_0+'},\n';
return code;
*/;


callLoad_s
    :   '呼出读档页面' Newline


/* callLoad_s
tooltip : callLoad: 呼出存档页面；返回游戏后将继续执行后面的事件
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=callLoad%ef%bc%9a%e5%91%bc%e5%87%ba%e8%af%bb%e6%a1%a3%e7%95%8c%e9%9d%a2
colour : this.soundColor
var code = '{"type": "callLoad"},\n';
return code;
*/;


previewUI_s
    :   'ui绘制并预览' '（双击此项可进行预览）' BGNL? Newline action+  BEND Newline


/* previewUI_s
tooltip : previewUI: ui绘制并预览
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=previewUI%ef%bc%9aUI%e7%bb%98%e5%88%b6%e5%b9%b6%e9%a2%84%e8%a7%88
previewBlock : true
var code = ['{"type": "previewUI", "action": [\n', action_0,']},\n'].join('');
return code;
*/;


clearMap_s
    :   '清除画布' '起点像素' 'x' PosString? 'y' PosString? '宽' PosString? '高' PosString? Newline

/* clearMap_s
tooltip : clearMap: 清除画布
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=clearMap%ef%bc%9a%e6%b8%85%e9%99%a4%e7%94%bb%e5%b8%83
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=setAttribute%ef%bc%9a%e8%ae%be%e7%bd%ae%e7%94%bb%e5%b8%83%e5%b1%9e%e6%80%a7
previewBlock : true
colour : this.subColor
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

fillText_s
    :   '绘制文本' 'x' PosString 'y' PosString '样式' ColorString? Colour '字体' FontString? '最大宽度' IntString? BGNL? EvalString Newline

/* fillText_s
tooltip : fillText：绘制一行文本；可以设置最大宽度进行放缩
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillText%ef%bc%9a%e7%bb%98%e5%88%b6%e6%96%87%e6%9c%ac
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillBoldText%ef%bc%9a%e7%bb%98%e5%88%b6%e6%8f%8f%e8%be%b9%e6%96%87%e6%9c%ac
colour : this.subColor
previewBlock : true
default : ["0","0","",'rgba(255,255,255,1)',"",'rgba(0,0,0,1)',"","绘制一行描边文本"]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
ColorString_1 = ColorString_1 ? (', "strokeStyle": ['+ColorString_1+']') : '';
FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
var code = '{"type": "fillBoldText", "x": '+PosString_0+', "y": '+PosString_1+ColorString_0+ColorString_1+FontString_0+', "text": "'+EvalString_0+'"},\n';
return code;
*/;

drawTextContent_s
    :   '绘制多行文本'  EvalString BGNL? '起点像素' 'x' PosString 'y' PosString '最大宽度' IntString? '颜色' ColorString? Colour BGNL? '对齐' TextAlign_List '字体大小' IntString? '行距' IntString? '粗体' Bool Newline

/* drawTextContent_s
tooltip : drawTextContent：绘制多行文本
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawTextContent%ef%bc%9a%e7%bb%98%e5%88%b6%e5%a4%9a%e8%a1%8c%e6%96%87%e6%9c%ac
doubleclicktext : EvalString_0
colour : this.subColor
default : ["绘制多行文本\\n可双击编辑","0","0","","",'rgba(255,255,255,1)',null,"","",false]
TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
Bool_0 = Bool_0 ?  (', "bold": true') : '';
IntString_0 = IntString_0 ? (', "maxWidth": '+IntString_0) : '';
IntString_1 = IntString_1 ? (', "fontSize": '+IntString_1) : '';
IntString_2 = IntString_2 ? (', "lineHeight": '+IntString_2) : '';
ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
var code = '{"type": "drawTextContent", "text": "'+EvalString_0+'", "left": '+PosString_0+', "top": '+PosString_1+TextAlign_List_0+IntString_0+IntString_1+IntString_2+ColorString_0+Bool_0+'},\n';
return code;
*/;

fillRect_s
    :   '绘制矩形' '起点像素' 'x' PosString 'y' PosString '宽' PosString '高' PosString '圆角半径' PosString? '旋转度数' PosString? '颜色' ColorString? Colour Newline

/* fillRect_s
tooltip : fillRect：绘制矩形
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillRect%ef%bc%9a%e7%bb%98%e5%88%b6%e7%9f%a9%e5%bd%a2
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=strokeRect%ef%bc%9a%e7%bb%98%e5%88%b6%e7%9f%a9%e5%bd%a2%e8%be%b9%e6%a1%86
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawLine%ef%bc%9a%e7%bb%98%e5%88%b6%e7%ba%bf%e6%ae%b5
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawArrow%ef%bc%9a%e7%bb%98%e5%88%b6%e7%ae%ad%e5%a4%b4
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillPolygon%ef%bc%9a%e7%bb%98%e5%88%b6%e5%a4%9a%e8%be%b9%e5%bd%a2
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=strokePolygon%ef%bc%9a%e7%bb%98%e5%88%b6%e5%a4%9a%e8%be%b9%e5%bd%a2%e8%be%b9%e6%a1%86
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillEllipse%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9c%86
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=strokeEllipse%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9c%86%e8%be%b9%e6%a1%86
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillEllipse%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9c%86
colour : this.subColor
default : ["0","0","100","0","90","","rgba(255,255,255,1)",""]
ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
var code = '{"type": "fillArc", "x": '+PosString_0+', "y": '+PosString_1+', "r": '+PosString_2+', "start": '+PosString_3+', "end": '+PosString_4+ColorString_0+'},\n';
return code;
*/;


strokeArc_s
    :   '绘制弧' '中心' 'x' PosString 'y' PosString '半径' PosString '起点角度' PosString '终点角度' PosString '颜色' ColorString? Colour '线宽' IntString? Newline

/* strokeArc_s
tooltip : strokeArc：绘制弧
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=fillEllipse%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9c%86
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawImage%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9b%be%e7%89%87
previewBlock : true
allImages : ['EvalString_0']
default : ["bg.jpg","null","0","0","","",""]
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawImage%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9b%be%e7%89%87
default : ["bg.jpg","null","0","0","32","32","0","0","32","32",""]
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawIcon%ef%bc%9a%e7%bb%98%e5%88%b6%e5%9b%be%e6%a0%87
default : ["yellowKey",0,"0","0","",""]
previewBlock : true
allIds : ['IdString_0']
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawBackground%ef%bc%9a%e7%bb%98%e5%88%b6%e8%83%8c%e6%99%af%e5%9b%be
default : ["winskin.png","rgba(255,255,255,1)","0","0","100","100"]
colour : this.subColor
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=drawSelector%ef%bc%9a%e7%bb%98%e5%88%b6%e9%97%aa%e7%83%81%e5%85%89%e6%a0%87
previewBlock : true
default : ["winskin.png","1","0","0","100","100"]
colour : this.subColor
var code = '{"type": "drawSelector", "image": "'+EvalString_0+'", "code": '+Int_0+', "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+'},\n';
return code;
*/;

drawSelector_1_s
    :   '清除闪烁光标' '编号' Int Newline


/* drawSelector_1_s
tooltip : drawSelector：清除闪烁光标
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=showImage%ef%bc%9a%e6%98%be%e7%a4%ba%e5%9b%be%e7%89%87
default : ["1"]
previewBlock : true
colour : this.subColor
var code = '{"type": "drawSelector", "code": '+Int_0+'},\n';
return code;
*/;

unknown_s
    :   '自定义事件' BGNL? JsonEvalString

/* unknown_s
tooltip : 通过脚本自定义的事件类型, 以及编辑器不识别的事件类型
helpUrl : https://h5mota.com/games/template/_docs/#/
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
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=function%EF%BC%9A%E8%87%AA%E5%AE%9A%E4%B9%89js%E8%84%9A%E6%9C%AC
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
    |   bool_e
    |   idFixedList_e
    |   idFlag_e
    |   idTemp_e
    |   idIdList_e
    |   idString_e
    |   enemyattr_e
    |   blockId_e
    |   blockCls_e
    |   equip_e
    |   evalString_e
    

/* expression_arithmetic_0
//todo 修改recieveOrder,根据Arithmetic_List_0不同的值设定不同的recieveOrder
var code = expression_0 + Arithmetic_List_0 + expression_1;
var ops = {
    '^': 'Math.pow('+expression_0+','+expression_1+')'
}
if (ops[Arithmetic_List_0])code = ops[Arithmetic_List_0];
var orders = {
    '+': Blockly.JavaScript.ORDER_ADDITION,
    '-': Blockly.JavaScript.ORDER_SUBTRACTION,
    '*': Blockly.JavaScript.ORDER_MULTIPLICATION,
    '/': Blockly.JavaScript.ORDER_DIVISION,
    '^': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    '==': Blockly.JavaScript.ORDER_EQUALITY,
    '!=': Blockly.JavaScript.ORDER_EQUALITY,
    '===': Blockly.JavaScript.ORDER_EQUALITY,
    '!==': Blockly.JavaScript.ORDER_EQUALITY,
    '>': Blockly.JavaScript.ORDER_RELATIONAL,
    '<': Blockly.JavaScript.ORDER_RELATIONAL,
    '>=': Blockly.JavaScript.ORDER_RELATIONAL,
    '<=': Blockly.JavaScript.ORDER_RELATIONAL,
    '&&': Blockly.JavaScript.ORDER_LOGICAL_AND,
    '||': Blockly.JavaScript.ORDER_LOGICAL_OR
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
default : ['greenSlime',"攻击"]
allEnemys : ['IdString_0']
var code = 'enemy:'+IdString_0+':'+EnemyId_List_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


blockId_e
    :   '图块ID:' Int ',' Int


/* blockId_e
default : [0,0]
var code = 'blockId:'+Int_0+','+Int_1;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


blockCls_e
    :   '图块类别:' Int ',' Int


/* blockCls_e
default : [0,0]
var code = 'blockCls:'+Int_0+','+Int_1;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/;


equip_e
    :   '装备孔:' Int


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
    :   EvalString
    

/* evalString_e
default : ["值"]
var code = EvalString_0;
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
    :   '坐标'|'上楼梯'|'下楼梯'|'保持不变'|'中心对称点'|'x对称点'|'y对称点'
    /*Stair_List ['loc','upFloor','downFloor',':now',':symmetry',':symmetry_x',':symmetry_y']*/;

SetTextPosition_List
    :   '不改变'|'距离顶部'|'居中'|'距离底部'
    /*SetTextPosition_List ['null','up','center','down']*/;

TextAlign_List
    :   '不改变'|'左对齐'|'左右居中'|'右对齐'
    /*TextAlign_List ['null','left','center','right']*/;

TextBaseline_List
    :   '不改变'|'顶部'|'悬挂'|'居中'|'标准值'|'ideographic'|'底部'
    /*TextBaseline_List ['null','top','hanging','middle','alphabetic','ideographic','bottom']*/;

Reverse_List
    :   '不改变'|'左右翻转'|'上下翻转'|'中心翻转'
    /*Reverse_List ['null',':x',':y',':o']*/;

ShopUse_List
    :   '金币' | '经验'
    /*ShopUse_List ['money','exp']*/;

Arithmetic_List
    :   '+'|'-'|'*'|'/'|'^'|'=='|'!='|'==='|'!=='|'>'|'<'|'>='|'<='|'且'|'或'
    /*Arithmetic_List ['+','-','*','/','^','==','!=','===','!==','>','<','>=','<=','&&','||']*/;

AssignOperator_List
    :   '='|'+='|'-='|'*='|'/='|'**='|'//='|'%='
    ;  

Weather_List
    :   '无'|'雨'|'雪'|'雾'
    /*Weather_List ['null','rain','snow','fog']*/;

B_0_List
    :   '不改变'|'不可通行'|'可以通行'
    /*B_0_List ['null','true','false']*/;

B_1_List
    :   '不改变'|'设为粗体'|'取消粗体'
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
    :   '普通事件'|'战后事件'|'道具后事件'|'开门后事件'
    /*Event_List ['null','afterBattle','afterGetItem','afterOpenDoor']*/;

Floor_Meta_List
    :   '楼层中文名'|'状态栏名称'|'能否使用楼传'|'能否打开快捷商店'|'是否不可浏览地图'|'是否不可瞬间移动'|'默认地面ID'|'楼层贴图'|'宝石血瓶效果'|'上楼点坐标'|'下楼点坐标'|'背景音乐'|'画面色调'|'天气和强度'|'是否地下层'
    /*Floor_Meta_List ['title','name','canFlyTo', 'canUseQuickShop', 'cannotViewMap', 'cannotMoveDirectly', 'defaultGround', 'images', 'ratio', 'upFloor', 'downFloor', 'bgm', 'color', 'weather', 'underGround']*/;

Global_Attribute_List
    :   '全局字体'|'横屏左侧状态栏背景'|'竖屏上方状态栏背景'|'竖屏下方道具栏背景'|'边框颜色'|'状态栏文字色'|'楼层转换样式'|'装备列表'
    /*Global_Attribute_List ['font','statusLeftBackground','statusTopBackground', 'toolsBackground', 'borderColor', 'statusBarColor', 'floorChangingStyle', 'equipName']*/;

Global_Value_List
    :   '血网伤害'|'中毒伤害'|'衰弱效果'|'红宝石效果'|'蓝宝石效果'|'绿宝石效果'|'红血瓶效果'|'蓝血瓶效果'|'黄血瓶效果'|'绿血瓶效果'|'破甲比例'|'反击比例'|'净化比例'|'仇恨增加值'|'动画时间'
    /*Global_Value_List ['lavaDamage','poisonDamage','weakValue', 'redGem', 'blueGem', 'greenGem', 'redPotion', 'bluePotion', 'yellowPotion', 'greenPotion', 'breakArmor', 'counterAttack', 'purify', 'hatred', 'animateSpeed']*/;


Global_Flag_List
    :   '显示当前楼层'|'显示勇士图标'|'显示当前等级'|'启用生命上限'|'显示生命值'|'显示魔力值'|'显示攻击力'|'显示防御力'|'显示护盾值'|'显示金币值'|'显示经验值'|'允许等级提升'|'升级扣除模式'|'显示钥匙数量'|'显示绿钥匙'|'显示破炸飞'|'显示毒衰咒'|'显示当前技能'|'楼梯边才能楼传'|'楼传平面塔模式'|'铁门不需要钥匙'|'开启加点'|'开启负伤'|'夹击不超伤害值'|'循环计算临界'|'允许轻按'|'允许走到将死领域'|'允许瞬间移动'|'阻激夹域后禁用快捷商店'|'虚化前景层'|'检查控制台'
    /*Global_Flag_List ['s:enableFloor','s:enableName','s:enableLv', 's:enableHPMax', 's:enableHP', 's:enableMana', 's:enableAtk', 's:enableDef', 's:enableMDef', 's:enableMoney', 's:enableExp', 's:enableLevelUp', 's:levelUpLeftMode', 's:enableKeys', 's:enableGreenKey', 's:enablePZF', 's:enableDebuff', 's:enableSkill', 'flyNearStair', 'flyRecordPosition', 'steelDoorWithoutKey', 'enableAddPoint', 'enableNegativeDamage', 'betweenAttackMax', 'useLoop', 'enableGentleClick', 'canGoDeadZone', 'enableMoveDirectly', 'disableShopOnDamage', 'blurFg']*/;

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
    :   '不变'|'朝上'|'朝下'|'朝左'|'朝右'|'左转'|'右转'|'背对'
    /*DirectionEx_List ['null','up','down','left','right',':left',':right',':back']*/;

StepString
    :   (Direction_List Int?)+
    ;

IdString
    :   [0-9a-zA-Z_][0-9a-zA-Z_:]*
    ;

FixedId_List
    :   '生命'|'生命上限'|'攻击'|'防御'|'护盾'|'黄钥匙'|'蓝钥匙'|'红钥匙'|'金币'|'经验'|'魔力'|'魔力上限'
    /*FixedId_List ['status:hp','status:hpmax','status:atk','status:def','status:mdef','item:yellowKey','item:blueKey','item:redKey','status:money','status:exp','status:mana','status:manamax']*/;

Id_List
    :   '变量' | '状态' | '物品' | '独立开关' | '临时变量' |'全局存储'
    /*Id_List ['flag','status','item', 'switch', 'temp', 'global']*/;

EnemyId_List
    :   '生命'|'攻击'|'防御'|'金币'|'经验'|'加点'|'属性'|'名称'|'映射名'|'value'|'atkValue'|'defValue'|'notBomb'|'zoneSquare'|'range'|'n'|'add'|'damage'
    /*EnemyId_List ['hp','atk','def','money','exp','point','special','name','displayInBook','属性值','退化扣攻','退化扣防','不可炸','九宫格领域','领域范围','连击数','吸血到自身','固伤值']*/;

Equip_List
    :   '生命'|'生命上限'|'攻击'|'防御'|'护盾'|'魔力'|'魔力上限'
    /*Equip_List ['hp','hpmax','atk','def','mdef','mana','manamax']*/;

Key_List
    :   '黄钥匙'|'蓝钥匙'|'红钥匙'|'绿钥匙'|'铁门钥匙'
    /*Key_List ['yellowKey','blueKey','redKey','greenKey','steelKey']*/;

//转blockly后不保留需要加"
EvalString
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
this.evisitor.subColor=190;
this.evisitor.printColor=70;
this.evisitor.dataColor=130;
this.evisitor.eventColor=220;
this.evisitor.soundColor=20;
this.evisitor.commentColor=285;
this.evisitor.mapColor=175;
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