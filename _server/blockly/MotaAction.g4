grammar MotaAction;

//===============parser===============
//===blockly语句===

//事件 事件编辑器入口之一
event_m
    :   '事件' BGNL? Newline '启用' Bool '不可通行' Bool '显伤' Bool BGNL? Newline action+ BEND
    ;

/* event_m
tooltip : 编辑魔塔的事件
helpUrl : https://ckcz123.github.io/mota-js/#/event
default : [null,null,false]
var code = {
    'trigger': 'action',
    'enable': Bool_0,
    'noPass': Bool_1,
    'displayDamage': Bool_2,
    'data': 'data_asdfefw'
}
if (Bool_0 && Bool_1 && !Bool_2) code = 'data_asdfefw';
code=JSON.stringify(code,null,2).split('"data_asdfefw"').join('[\n'+action_0+']\n');
return code;
*/

//加点 事件编辑器入口之一
point_m
    :   '加点' BGNL? Newline choicesContext+ BEND
    ;

/* point_m
tooltip : 加点事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e5%8a%a0%e7%82%b9%e4%ba%8b%e4%bb%b6
var code = '{"type": "choices", "choices": [\n'+choicesContext_0+']}\n';
return code;
*/

//商店 事件编辑器入口之一
shop_m
    :   '商店 id' IdString '标题' EvalString '图标' IdString BGNL? Newline '快捷商店栏中名称' EvalString BGNL? Newline '使用' ShopUse_List '消耗' EvalString BGNL? Newline '显示文字' EvalString BGNL? Newline shopChoices+ BEND
    ;

/* shop_m
tooltip : 全局商店,消耗填-1表示每个选项的消耗不同,正数表示消耗数值
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
default : ["shop1","贪婪之神","blueShop","1F金币商店",null,"20+10*times*(times+1)","勇敢的武士啊, 给我${need}金币就可以："]
var code = {
    'id': IdString_0,
    'name': EvalString_0,
    'icon': IdString_1,
    'textInList': EvalString_1,
    'use': ShopUse_List_0,
    'need': EvalString_2,
    'text': EvalString_3,
    'choices': 'choices_asdfefw'
}
code=JSON.stringify(code,null,2).split('"choices_asdfefw"').join('[\n'+shopChoices_0+']\n');
return code;
*/

shopChoices
    :   '商店选项' EvalString '消耗' EvalString? BGNL? Newline shopEffect+
    ;

/* shopChoices
tooltip : 商店选项,商店消耗是-1时,这里的消耗对应各自选项的消耗,商店消耗不是-1时这里的消耗不填
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
default : ["攻击+1",""]
colour : this.subColor
EvalString_1 = EvalString_1 && (', "need": "'+EvalString_1+'"');
var code = '{"text": "'+EvalString_0+'"'+EvalString_1+', "effect": "'+shopEffect_0.slice(2,-1)+'"},\n';
return code;
*/

shopEffect
    :   idString_e '+=' expression
    ;

/* shopEffect
colour : this.subColor
var code = idString_e_0+'+='+expression_0+';'
return code;
*/

//afterBattle 事件编辑器入口之一
afterBattle_m
    :   '战斗结束后' BGNL? Newline action+ BEND
    ;

/* afterBattle_m
tooltip : 系统引发的自定义事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/

//afterGetItem 事件编辑器入口之一
afterGetItem_m
    :   '获取道具后' BGNL? Newline action+ BEND
    ;

/* afterGetItem_m
tooltip : 系统引发的自定义事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/

//afterOpenDoor 事件编辑器入口之一
afterOpenDoor_m
    :   '打开门后' BGNL? Newline action+ BEND
    ;

/* afterOpenDoor_m
tooltip : 系统引发的自定义事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/

//firstArrive 事件编辑器入口之一
firstArrive_m
    :   '首次到达楼层' BGNL? Newline action+ BEND
    ;

/* firstArrive_m
tooltip : 首次到达楼层
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e7%b3%bb%e7%bb%9f%e5%bc%95%e5%8f%91%e7%9a%84%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6
var code = '[\n'+action_0+']\n';
return code;
*/

//changeFloor 事件编辑器入口之一
changeFloor_m
    :   '楼梯, 传送门' BGNL? Newline '目标楼层' IdString Stair_List 'x' Int ',' 'y' Int '朝向' DirectionEx_List '动画时间' Int? '允许穿透' Bool BEND
    ;

/* changeFloor_m
tooltip : 楼梯, 传送门, 如果目标楼层有多个楼梯, 写upFloor或downFloor可能会导致到达的楼梯不确定, 这时候请使用loc方式来指定具体的点位置
helpUrl : https://ckcz123.github.io/mota-js/#/element?id=%e8%b7%af%e9%9a%9c%ef%bc%8c%e6%a5%bc%e6%a2%af%ef%bc%8c%e4%bc%a0%e9%80%81%e9%97%a8
default : ["MT1",null,0,0,null,500,null]
var loc = ', "loc": ['+Int_0+', '+Int_1+']';
if (Stair_List_0!=='loc')loc = ', "stair": "'+Stair_List_0+'"';
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
Int_2 = Int_2 ?(', "time": '+Int_2):'';
Bool_0 = Bool_0 ?'':(', "portalWithoutTrigger": false');
var code = '{"floorId": "'+IdString_0+'"'+loc+DirectionEx_List_0+Int_2+Bool_0+' }\n';
return code;
*/

//为了避免关键字冲突,全部加了_s
//动作
action
    :   text_0_s
    |   text_1_s
    |   setText_s
    |   tip_s
    |   setValue_s
    |   show_s
    |   hide_s
    |   trigger_s
    |   revisit_s
    |   exit_s
    |   setBlock_s
    |   update_s
    |   sleep_s
    |   battle_s
    |   openDoor_s
    |   changeFloor_s
    |   changePos_0_s
    |   changePos_1_s
    |   openShop_s
    |   disableShop_s
    |   animate_s
    |   showImage_0_s
    |   showImage_1_s
    |   setFg_0_s
    |   setFg_1_s
    |   setWeather_s
    |   move_s
    |   moveHero_s
    |   playBgm_s
    |   pauseBgm_s
    |   resumeBgm_s
    |   playSound_s
    |   win_s
    |   lose_s
    |   if_s
    |   choices_s
    |   function_s
    |   pass_s
    ;

text_0_s
    :   '显示文章' ':' EvalString Newline
    ;

/* text_0_s
tooltip : text：显示一段文字（剧情）
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=text%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%96%87%e5%ad%97%ef%bc%88%e5%89%a7%e6%83%85%ef%bc%89
default : ["欢迎使用事件编辑器"]
var code = '"'+EvalString_0+'",\n';
return code;
*/

text_1_s
    :   '标题' EvalString? '图像' IdString? '对话框效果' EvalString? ':' EvalString Newline
    ;

/* text_1_s
tooltip : text：显示一段文字（剧情）,选项较多请右键点击帮助
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=text%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%96%87%e5%ad%97%ef%bc%88%e5%89%a7%e6%83%85%ef%bc%89
default : ["小妖精","fairy","","欢迎使用事件编辑器"]
var title='';
if (EvalString_0==''){
    if (IdString_0=='')title='';
    else title='\\t['+IdString_0+']';
} else {
    if (IdString_0=='')title='\\t['+EvalString_0+']';
    else title='\\t['+EvalString_0+','+IdString_0+']';
}
if(EvalString_1 && !(/^(up|down)(,hero)?(,([0-9]|1[0-2]),([0-9]|1[0-2]))?$/.test(EvalString_1))) {
  throw new Error('对话框效果的用法请右键点击帮助');
}
EvalString_1 = EvalString_1 && ('\\b['+EvalString_1+']');
var code =  '"'+title+EvalString_1+EvalString_2+'",\n';
return code;
*/

setText_s
    :   '设置剧情文本的属性' '位置' SetTextPosition_List BGNL? '标题颜色' EvalString? '正文颜色' EvalString? '背景色' EvalString? Newline
    ;

/* setText_s
tooltip : setText：设置剧情文本的属性,颜色为RGB三元组或RGBA四元组
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=settext%ef%bc%9a%e8%ae%be%e7%bd%ae%e5%89%a7%e6%83%85%e6%96%87%e6%9c%ac%e7%9a%84%e5%b1%9e%e6%80%a7
default : [null,"255,215,0,1","255,255,255,1","0,0,0,0.85"]
SetTextPosition_List_0 = ', "position": "'+SetTextPosition_List_0+'"';
var colorRe = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d),(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d),(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(,0(\.\d+)?|,1)?$/;
if (EvalString_0) {
  if (!colorRe.test(EvalString_0))throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
  EvalString_0 = ', "title": ['+EvalString_0+']';
}
if (EvalString_1) {
  if (!colorRe.test(EvalString_1))throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
  EvalString_1 = ', "text": ['+EvalString_1+']';
}
if (EvalString_2) {
  if (!colorRe.test(EvalString_2))throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
  EvalString_2 = ', "background": ['+EvalString_2+']';
}
var code = '{"type": "setText"'+SetTextPosition_List_0+EvalString_0+EvalString_1+EvalString_2+'},\n';
return code;
*/

tip_s
    :   '显示提示' ':' EvalString Newline
    ;

/* tip_s
tooltip : tip：显示一段提示文字
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=tip%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%8f%90%e7%a4%ba%e6%96%87%e5%ad%97
default : ["这段话将在左上角以气泡形式显示"]
var code = '{"type": "tip", "text": "'+EvalString_0+'"},\n';
return code;
*/

setValue_s
    :   '变量操作' ':' '名称' idString_e '值' expression Newline
    ;

/* setValue_s
tooltip : setValue：设置勇士的某个属性、道具个数, 或某个变量/Flag的值
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=text%ef%bc%9a%e6%98%be%e7%a4%ba%e4%b8%80%e6%ae%b5%e6%96%87%e5%ad%97%ef%bc%88%e5%89%a7%e6%83%85%ef%bc%89
colour : this.dataColor
var code = '{"type": "setValue", "name": "'+idString_e_0+'", "value": "'+expression_0+'"},\n';
return code;
*/

show_s
    :   '显示事件' 'x' Int ',' 'y' Int '楼层' IdString? '动画时间' Int? Newline
    ;

/* show_s
tooltip : show: 将一个禁用事件启用,楼层和动画时间可不填
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=show-%e5%b0%86%e4%b8%80%e4%b8%aa%e7%a6%81%e7%94%a8%e4%ba%8b%e4%bb%b6%e5%90%af%e7%94%a8
default : [0,0,"",500]
colour : this.eventColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
Int_2 = Int_2 ?(', "time": '+Int_2):'';
var code = '{"type": "show", "loc": ['+Int_0+','+Int_1+']'+IdString_0+''+Int_2+'},\n';
return code;
*/

hide_s
    :   '隐藏事件' 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? '动画时间' Int? Newline
    ;

/* hide_s
tooltip : hide: 将一个启用事件禁用,所有参数均可不填,代表禁用事件自身
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=hide-%e5%b0%86%e4%b8%80%e4%b8%aa%e5%90%af%e7%94%a8%e4%ba%8b%e4%bb%b6%e7%a6%81%e7%94%a8
default : ["","","",500]
colour : this.eventColor
var floorstr = '';
if (EvalString_0 && EvalString_1) {
    floorstr = ', "loc": ['+EvalString_0+','+EvalString_1+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
Int_0 = Int_0 ?(', "time": '+Int_0):'';
var code = '{"type": "hide"'+floorstr+IdString_0+''+Int_0+'},\n';
return code;
*/

trigger_s
    :   '触发事件' 'x' Int ',' 'y' Int Newline
    ;

/* trigger_s
tooltip : trigger: 立即触发另一个地点的事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=trigger-%e7%ab%8b%e5%8d%b3%e8%a7%a6%e5%8f%91%e5%8f%a6%e4%b8%80%e4%b8%aa%e5%9c%b0%e7%82%b9%e7%9a%84%e4%ba%8b%e4%bb%b6
default : [0,0]
colour : this.eventColor
var code = '{"type": "trigger", "loc": ['+Int_0+','+Int_1+']},\n';
return code;
*/

revisit_s
    :   '重启当前事件' Newline
    ;

/* revisit_s
tooltip : revisit: 立即重启当前事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=revisit-%e7%ab%8b%e5%8d%b3%e9%87%8d%e5%90%af%e5%bd%93%e5%89%8d%e4%ba%8b%e4%bb%b6
colour : this.eventColor
var code = '{"type": "revisit"},\n';
return code;
*/

exit_s
    :   '立刻结束当前事件' Newline
    ;

/* exit_s
tooltip : exit: 立刻结束当前事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=exit-%e7%ab%8b%e5%88%bb%e7%bb%93%e6%9d%9f%e5%bd%93%e5%89%8d%e4%ba%8b%e4%bb%b6
colour : this.eventColor
var code = '{"type": "exit"},\n';
return code;
*/

setBlock_s
    :   '转变图块为' Int 'x' EvalString? ',' 'y' EvalString? '楼层' IdString? Newline
    ;

/* setBlock_s
tooltip : setBlock：设置某个图块,忽略坐标楼层则为当前事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=setblock%ef%bc%9a%e8%ae%be%e7%bd%ae%e6%9f%90%e4%b8%aa%e5%9b%be%e5%9d%97
colour : this.dataColor
default : [0,"","",""]
var floorstr = '';
if (EvalString_0 && EvalString_1) {
    floorstr = ', "loc": ['+EvalString_0+','+EvalString_1+']';
}
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "setBlock", "number":'+Int_0+floorstr+IdString_0+'},\n';
return code;
*/

update_s
    :   '更新状态栏和地图显伤' Newline
    ;

/* update_s
tooltip : update: 立刻更新状态栏和地图显伤
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=update-%e7%ab%8b%e5%88%bb%e6%9b%b4%e6%96%b0%e7%8a%b6%e6%80%81%e6%a0%8f%e5%92%8c%e5%9c%b0%e5%9b%be%e6%98%be%e4%bc%a4
colour : this.dataColor
var code = '{"type": "update"},\n';
return code;
*/

sleep_s
    :   '等待' Int '毫秒' Newline
    ;

/* sleep_s
tooltip : sleep: 等待多少毫秒
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=sleep-%e7%ad%89%e5%be%85%e5%a4%9a%e5%b0%91%e6%af%ab%e7%a7%92
default : [500]
colour : this.soundColor
var code = '{"type": "sleep", "time": '+Int_0+'},\n';
return code;
*/

battle_s
    :   '强制战斗' IdString Newline
    ;

/* battle_s
tooltip : battle: 强制战斗
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=battle-%e5%bc%ba%e5%88%b6%e6%88%98%e6%96%97
default : ["greenSlime"]
colour : this.dataColor
var code = '{"type": "battle", "id": "'+IdString_0+'"},\n';
return code;
*/

openDoor_s
    :   '开门' 'x' Int ',' 'y' Int '楼层' IdString? Newline
    ;

/* openDoor_s
tooltip : openDoor: 开门,楼层可不填表示当前层
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=opendoor-%e5%bc%80%e9%97%a8
default : [0,0,""]
colour : this.dataColor
IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
var code = '{"type": "openDoor", "loc": ['+Int_0+','+Int_1+']'+IdString_0+'},\n';
return code;
*/

changeFloor_s
    :   '楼层切换' IdString 'x' Int ',' 'y' Int '朝向' DirectionEx_List '动画时间' Int? Newline
    ;

/* changeFloor_s
tooltip : changeFloor: 楼层切换,动画时间可不填
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=changefloor-%e6%a5%bc%e5%b1%82%e5%88%87%e6%8d%a2
default : ["MT1",0,0,null,500]
colour : this.dataColor
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
Int_2 = Int_2 ?(', "time": '+Int_2):'';
var code = '{"type": "changeFloor", "floorId": "'+IdString_0+'", "loc": ['+Int_0+', '+Int_1+']'+DirectionEx_List_0+Int_2+' },\n';
return code;
*/

changePos_0_s
    :   '位置切换' 'x' Int ',' 'y' Int '朝向' DirectionEx_List Newline
    ;

/* changePos_0_s
tooltip : changePos: 当前位置切换
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=changepos-%e5%bd%93%e5%89%8d%e4%bd%8d%e7%bd%ae%e5%88%87%e6%8d%a2%e5%8b%87%e5%a3%ab%e8%bd%ac%e5%90%91
default : [0,0,null]
colour : this.dataColor
DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
var code = '{"type": "changePos", "loc": ['+Int_0+','+Int_1+']'+DirectionEx_List_0+'},\n';
return code;
*/

changePos_1_s
    :   '勇士转向' Direction_List Newline
    ;

/* changePos_1_s
tooltip : changePos: 勇士转向
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=changepos-%e5%bd%93%e5%89%8d%e4%bd%8d%e7%bd%ae%e5%88%87%e6%8d%a2%e5%8b%87%e5%a3%ab%e8%bd%ac%e5%90%91
colour : this.dataColor
var code = '{"type": "changePos", "direction": "'+Direction_List_0+'"},\n';
return code;
*/

openShop_s
    :   '打开全局商店' IdString Newline
    ;

/* openShop_s
tooltip : 全局商店
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
default : ["shop1"]
var code = '{"type": "openShop", "id": "'+IdString_0+'"},\n';
return code;
*/

disableShop_s
    :   '禁用全局商店' IdString Newline
    ;

/* disableShop_s
tooltip : 全局商店
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=%e5%85%a8%e5%b1%80%e5%95%86%e5%ba%97
default : ["shop1"]
colour : this.eventColor
var code = '{"type": "disableShop", "id": "'+IdString_0+'"},\n';
return code;
*/

animate_s
    :   '显示动画' IdString '位置' EvalString? Newline
    ;

/* animate_s
tooltip : animate：显示动画,位置填hero或者1,2形式的位置,或者不填代表当前事件点
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=animate%ef%bc%9a%e6%98%be%e7%a4%ba%e5%8a%a8%e7%94%bb
default : ["zone","hero"]
colour : this.soundColor
if (EvalString_0) {
  if(/hero|([0-9]|1[0-2]),([0-9]|1[0-2])/.test(EvalString_0)) {
    if(EvalString_0.indexOf(',')!==-1)EvalString_0='['+EvalString_0+']';
    else EvalString_0='"'+EvalString_0+'"';
    EvalString_0 = ', "loc": '+EvalString_0;
  } else {
    throw new Error('此处只能填hero或者1,2形式的位置,或者不填代表当前事件点');
  }
}
var code = '{"type": "animate", "name": "'+IdString_0+'"'+EvalString_0+'},\n';
return code;
*/

showImage_0_s
    :   '显示图片' IdString '起点像素位置' 'x' Int 'y' Int Newline
    ;

/* showImage_0_s
tooltip : showImage：显示图片
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=showimage%ef%bc%9a%e6%98%be%e7%a4%ba%e5%9b%be%e7%89%87
default : ["bg",0,0]
colour : this.printColor
var code = '{"type": "showImage", "name": "'+IdString_0+'", "loc": ['+Int_0+','+Int_1+']},\n';
return code;
*/

showImage_1_s
    :   '清除所有图片' Newline
    ;

/* showImage_1_s
tooltip : showImage：清除所有显示的图片
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=showimage%ef%bc%9a%e6%98%be%e7%a4%ba%e5%9b%be%e7%89%87
colour : this.printColor
var code = '{"type": "showImage"},\n';
return code;
*/

setFg_0_s
    :   '更改画面色调' Number ',' Number ',' Number ',' Number '动画时间' Int? Newline
    ;

/* setFg_0_s
tooltip : setFg: 更改画面色调,动画时间可不填
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=setfg-%e6%9b%b4%e6%94%b9%e7%94%bb%e9%9d%a2%e8%89%b2%e8%b0%83
default : [255,255,255,1,500]
colour : this.soundColor
var limit = function(v,min,max) {
    if(v>max) return max;
    if(v<min) return min;
    return v;
}
Number_0 = limit(Number_0,0,255);
Number_1 = limit(Number_1,0,255);
Number_2 = limit(Number_2,0,255);
Number_3 = limit(Number_3,0,1);
Int_0 = Int_0 ?(', "time": '+Int_0):'';
var code = '{"type": "setFg", "color": ['+Number_0+','+Number_1+','+Number_2+','+Number_3+']'+Int_0 +'},\n';
return code;
*/

setFg_1_s
    :   '恢复画面色调' '动画时间' Int? Newline
    ;

/* setFg_1_s
tooltip : setFg: 恢复画面色调,动画时间可不填
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=setfg-%e6%9b%b4%e6%94%b9%e7%94%bb%e9%9d%a2%e8%89%b2%e8%b0%83
default : [500]
colour : this.soundColor
Int_0 = Int_0 ?(', "time": '+Int_0):'';
var code = '{"type": "setFg"'+Int_0 +'},\n';
return code;
*/

setWeather_s
    :   '更改天气' Weather_List '强度' Int Newline
    ;

/* setWeather_s
tooltip : setWeather：更改天气
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=setweather%ef%bc%9a%e6%9b%b4%e6%94%b9%e5%a4%a9%e6%b0%94
default : [null,1]
colour : this.soundColor
if(Int_0<1 || Int_0>10) throw new Error('天气的强度等级, 在1-10之间');
var code = '{"type": "setWeather", "name": "'+Weather_List_0+'", "level": '+Int_0+'},\n';
if(Weather_List_0==='无')code = '{"type": "setWeather"},\n';
return code;
*/

move_s
    :   '移动事件' 'x' EvalString? ',' 'y' EvalString? '动画时间' Int? '消失时无动画时间' Bool BGNL? StepString Newline
    ;

/* move_s
tooltip : move: 让某个NPC/怪物移动,位置可不填代表当前事件
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=move-%e8%ae%a9%e6%9f%90%e4%b8%aanpc%e6%80%aa%e7%89%a9%e7%a7%bb%e5%8a%a8
default : ["","",500,null,"上右3下2左上左2"]
colour : this.eventColor
var floorstr = '';
if (EvalString_0 && EvalString_1) {
    floorstr = ', "loc": ['+EvalString_0+','+EvalString_1+']';
}
Int_0 = Int_0 ?(', "time": '+Int_0):'';
var code = '{"type": "move"'+floorstr+''+Int_0+', "steps": '+JSON.stringify(StepString_0)+', "immediateHide": '+Bool_0+'},\n';
return code;
*/

moveHero_s
    :   '移动勇士' '动画时间' Int? BGNL? StepString Newline
    ;

/* moveHero_s
tooltip : moveHero：移动勇士,用这种方式移动勇士的过程中将无视一切地形, 无视一切事件, 中毒状态也不会扣血
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=movehero%ef%bc%9a%e7%a7%bb%e5%8a%a8%e5%8b%87%e5%a3%ab
default : [500,"上右3下2左上左2"]
colour : this.dataColor
Int_0 = Int_0 ?(', "time": '+Int_0):'';
var code = '{"type": "moveHero"'+Int_0+', "steps": '+JSON.stringify(StepString_0)+'},\n';
return code;
*/

playBgm_s
    :   '播放背景音乐' EvalString Newline
    ;

/* playBgm_s
tooltip : playBgm: 播放背景音乐
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=playbgm-%e6%92%ad%e6%94%be%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90
default : ["bgm.mp3"]
colour : this.soundColor
var code = '{"type": "playBgm", "name": "'+EvalString_0+'"},\n';
return code;
*/

pauseBgm_s
    :   '暂停背景音乐' Newline
    ;

/* pauseBgm_s
tooltip : pauseBgm: 暂停背景音乐
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=pausebgm-%e6%9a%82%e5%81%9c%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90
colour : this.soundColor
var code = '{"type": "pauseBgm"},\n';
return code;
*/

resumeBgm_s
    :   '恢复背景音乐' Newline
    ;

/* resumeBgm_s
tooltip : resumeBgm: 恢复背景音乐
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=resumebgm-%e6%81%a2%e5%a4%8d%e8%83%8c%e6%99%af%e9%9f%b3%e4%b9%90
colour : this.soundColor
var code = '{"type": "resumeBgm"},\n';
return code;
*/

playSound_s
    :   '播放音效' EvalString Newline
    ;

/* playSound_s
tooltip : playSound: 播放音效
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=playsound-%e6%92%ad%e6%94%be%e9%9f%b3%e6%95%88
default : ["item.ogg"]
colour : this.soundColor
var code = '{"type": "playSound", "name": "'+EvalString_0+'"},\n';
return code;
*/

win_s
    :   '游戏胜利,原因' ':' EvalString Newline
    ;

/* win_s
tooltip : win: 获得胜利, 该事件会显示获胜页面, 并重新游戏
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=win-%e8%8e%b7%e5%be%97%e8%83%9c%e5%88%a9
default : [" "]
var code = '{"type": "win", "reason": "'+EvalString_0+'"},\n';
return code;
*/

lose_s
    :   '游戏失败,原因' ':' EvalString Newline
    ;

/* lose_s
tooltip : lose: 游戏失败, 该事件会显示失败页面, 并重新开始游戏
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=lose-%e6%b8%b8%e6%88%8f%e5%a4%b1%e8%b4%a5
default : [" "]
var code = '{"type": "lose", "reason": "'+EvalString_0+'"},\n';
return code;
*/

if_s
    :   '如果' ':' expression BGNL? Newline action+ '否则' ':' BGNL? Newline action+ BEND Newline
    ;

/* if_s
tooltip : if: 条件判断
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=if-%e6%9d%a1%e4%bb%b6%e5%88%a4%e6%96%ad
colour : this.eventColor
var code = ['{"type": "if", "condition": "',expression_0,'",\n',
    '"true": [\n',action_0,'],\n',
    '"false": [\n',action_1,']\n',
'},\n'].join('');
return code;
*/

choices_s
    :   '选项' ':' EvalString BGNL? '标题' EvalString? '图像' IdString? BGNL? Newline choicesContext+ BEND Newline
    ;

/* choices_s
tooltip : choices: 给用户提供选项
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=choices-%e7%bb%99%e7%94%a8%e6%88%b7%e6%8f%90%e4%be%9b%e9%80%89%e9%a1%b9
default : ["提示文字:选择一种钥匙","流浪者","woman"]
var title='';
if (EvalString_1==''){
    if (IdString_0=='')title='';
    else title='\\t['+IdString_0+']';
} else {
    if (IdString_0=='')title='\\t['+EvalString_1+']';
    else title='\\t['+EvalString_1+','+IdString_0+']';
}
var code = ['{"type": "choices", "text": "',title+EvalString_0,'", "choices": [\n',
    choicesContext_0,
']},\n'].join('');
return code;
*/

choicesContext
    :   '子选项' EvalString BGNL? Newline action+
    ;

/* choicesContext
tooltip : 选项的选择
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=choices-%e7%bb%99%e7%94%a8%e6%88%b7%e6%8f%90%e4%be%9b%e9%80%89%e9%a1%b9
default : ["提示文字:红钥匙"]
colour : this.subColor
var code = '{"text": "'+EvalString_0+'", "action": [\n'+action_0+']},\n';
return code;
*/

function_s
    :   '自定义JS脚本' BGNL? Newline RawEvalString Newline BEND Newline
    ;

/* function_s
tooltip : function: 自定义JS脚本
helpUrl : https://ckcz123.github.io/mota-js/#/event?id=function-%e8%87%aa%e5%ae%9a%e4%b9%89js%e8%84%9a%e6%9c%ac
default : ["alert(core.getStatus(\"atk\"));"]
colour : this.dataColor
var code = '{"type": "function", "function": "function(){\\n'+JSON.stringify(RawEvalString_0).slice(1,-1)+'\\n}"},\n';
return code;
*/

pass_s
    :   Newline
    ;

/* pass_s
var code = ' \n';
return code;
*/

statExprSplit : '=== statement ^ === expression v ===' ;
//===blockly表达式===

expression
    :   expression Arithmetic_List expression
    |   negate_e
    |   bool_e
    |   idString_e
    |   evalString_e
    ;

/* expression_arithmetic_0
//todo 修改recieveOrder,根据Arithmetic_List_0不同的值设定不同的recieveOrder
var code = expression_0 + Arithmetic_List_0 + expression_1;
var ops = {
    '^': 'Math.pow('+expression_0+','+expression_1+')',
    '和': expression_0+' && '+expression_1,
    '或': expression_0+' || '+expression_1,
}
if (ops[Arithmetic_List_0])code = ops[Arithmetic_List_0];
var orders = {
    '+': Blockly.JavaScript.ORDER_UNARY_PLUS,
    '-': Blockly.JavaScript.ORDER_UNARY_NEGATION,
    '*': Blockly.JavaScript.ORDER_MULTIPLICATION,
    '/': Blockly.JavaScript.ORDER_DIVISION,
    '^': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
    '==': Blockly.JavaScript.ORDER_EQUALITY,
    '!=': Blockly.JavaScript.ORDER_EQUALITY,
    '>': Blockly.JavaScript.ORDER_RELATIONAL,
    '<': Blockly.JavaScript.ORDER_RELATIONAL,
    '>=': Blockly.JavaScript.ORDER_RELATIONAL,
    '<=': Blockly.JavaScript.ORDER_RELATIONAL,
    '和': Blockly.JavaScript.ORDER_LOGICAL_AND,
    '或': Blockly.JavaScript.ORDER_LOGICAL_OR
}
return [code, orders[Arithmetic_List_0]];
*/

negate_e
    :   '非' expression
    ;

/* negate_e
//todo 修改recieveOrder : ORDER_LOGICAL_NOT 修改 inputsInline
var code = '!'+expression_0;
return [code, Blockly.JavaScript.ORDER_LOGICAL_NOT];
*/

bool_e
    :   Bool
    ;

/* bool_e
var code = Bool_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/


idString_e
    :   IdString
    ;

/* idString_e
colour : this.idstring_eColor
default : ["status:hp"]
var code = IdString_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/

//这一条不会被antlr识别,总是会被归到idString_e
idString_1_e
    :   Id_List ':' IdText
    ;

/* idString_1_e
colour : this.idstring_eColor
default : [null,"自定义flag"]
//todo 将其output改成'idString_e'
var code = Id_List_0+':'+IdText_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/

//这一条不会被antlr识别,总是会被归到idString_e
idString_2_e
    :   FixedId_List
    ;

/* idString_2_e
colour : this.idstring_eColor
//todo 将其output改成'idString_e'
var code = FixedId_List_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/

evalString_e
    :   EvalString
    ;

/* evalString_e
default : ["值"]
var code = EvalString_0;
return [code, Blockly.JavaScript.ORDER_ATOMIC];
*/

//===============lexer===============

IdText
    :   'sdeirughvuiyasdeb'+ //为了被识别为复杂词法规则
    ;

RawEvalString
    :   'sdeirughvuiyasdbe'+ //为了被识别为复杂词法规则
    ;

Stair_List
    :   'loc'|'upFloor'|'downFloor'
    ;

SetTextPosition_List
    :   'center'|'up'|'down'
    ;

ShopUse_List
    :   'money' | 'experience'
    ;

Arithmetic_List
    :   '+'|'-'|'*'|'/'|'^'|'=='|'!='|'>'|'<'|'>='|'<='|'和'|'或'
    ;

Weather_List
    :   '无'|'rain'|'snow'
    ;

Bool:   'TRUE' 
    |   'FALSE'
    ;

Int :   '0' | [1-9][0-9]* ; // no leading zeros

Number
    :   '-'? Int '.' Int EXP?   // 1.35, 1.35E-9, 0.3, -4.5
    |   '-'? Int EXP            // 1e10 -3e4
    |   '-'? Int                // -3, 45
    ;
fragment EXP : [Ee] [+\-]? Int ; // \- since - means "range" inside [...]

Direction_List
    :   '上'|'下'|'左'|'右'
    ;

DirectionEx_List
    :   '不变'|'上'|'下'|'左'|'右'
    ;

StepString
    :   (Direction_List Int?)+
    ;

IdString
    :   [a-zA-Z_][0-9a-zA-Z_\-:]*
    ;

FixedId_List
    :   'item:blueKey'|'status:hp'|'status:atk'|'status:def'|'item:yellowKey'
    ;

Id_List
    :   'flag' | 'status' | 'item'
    ;

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
//converter.evisitor.recieveOrder='ORDER_NONE';
converter.evisitor.valueColor=330;
converter.evisitor.statementColor=70;
converter.evisitor.entryColor=250;

converter.evisitor.idstring_eColor=310;
converter.evisitor.subColor=190;
converter.evisitor.printColor=70;
converter.evisitor.dataColor=130;
converter.evisitor.eventColor=220;
converter.evisitor.soundColor=20;
*/

/* Function_1
delete(converter.evisitor.expressionRules.negate_e.blockjs.inputsInline);
converter.evisitor.expressionRules.idString_1_e.blockjs.output='idString_e';
converter.evisitor.expressionRules.idString_2_e.blockjs.output='idString_e';
*/

/* Functions

function ActionParser(){
}

ActionParser.prototype.parse = function (obj,type) {
  switch (type) {
    case 'event':
      if(!obj)obj={};
      if(typeof(obj)===typeof('')) obj={'data':[obj]};
      if(obj instanceof Array) obj={'data':obj};
      return MotaActionBlocks['event_m'].xmlText([
        obj.enable,obj.noPass,obj.displayDamage,this.parseList(obj.data)
      ]);
    
    case 'changeFloor':
      if(!obj)obj={};
      if(!this.isset(obj.loc))obj.loc=[0,0];
      return MotaActionBlocks['changeFloor_m'].xmlText([
        obj.floorId,obj.stair||'loc',obj.loc[0],obj.loc[1],this.Direction(obj.direction),obj.time||0,!this.isset(obj.portalWithoutTrigger)
      ]);

    case 'point':
      if(!obj)obj={};
      var text_choices = null;
      for(var ii=obj.choices.length-1,choice;choice=obj.choices[ii];ii--) {
        text_choices=MotaActionBlocks['choicesContext'].xmlText([
          choice.text,this.parseList(choice.action),text_choices]);
      }
      return MotaActionBlocks['point_m'].xmlText([text_choices]);

    case 'shop':
      var text_choices = null;
      for(var ii=obj.choices.length-1,choice;choice=obj.choices[ii];ii--) {
        var text_effect = null;
        var effectList = choice.effect.split(';');
        for(var jj=effectList.length-1,effect;effect=effectList[jj];jj--) {
          if(effect.split('+=').length!==2){
            throw new Error('一个商店效果中必须包含恰好一个"+="');
          }
          text_effect=MotaActionBlocks['shopEffect'].xmlText([
            MotaActionBlocks['idString_e'].xmlText([effect.split('+=')[0]]),
            MotaActionBlocks['evalString_e'].xmlText([effect.split('+=')[1]]),
            text_effect]);
        }
        text_choices=MotaActionBlocks['shopChoices'].xmlText([
          choice.text,choice.need||'',text_effect,text_choices]);
      }
      return MotaActionBlocks['shop_m'].xmlText([
        obj.id,obj.name,obj.icon,obj.textInList,obj.use,obj.need,this.EvalString(obj.text),text_choices
      ]);
    
    default:
      return MotaActionBlocks[type+'_m'].xmlText([this.parseList(obj)]);
  }
}

////// 开始解析一系列自定义事件 //////
ActionParser.prototype.parseList = function (list) {
  if (!this.isset(list)) return MotaActionBlocks['pass_s'].xmlText([],true);
  if (!(list instanceof Array)) {
    list = [list];
  }
  if (list.length===0) return MotaActionBlocks['pass_s'].xmlText([],true);
  this.event = {'id': 'action', 'data': {
    'list': list
  }}
  this.next = null;
  this.result = null;
  this.parseAction();
  return this.result;
}

////// 解析当前自定义事件列表中的最后一个事件 //////
ActionParser.prototype.parseAction = function() {

  // 事件处理完毕
  if (this.event.data.list.length==0) {
    this.result = this.next;
    this.next = null;
    return;
  }

  var data = this.event.data.list.pop();
  this.event.data.current = data;

  // 不同种类的事件

  // 如果是文字：显示
  if (typeof data == "string") {
      data={"type": "text", "data": data}
  }
  this.event.data.type=data.type;
  switch (data.type) {
    case "_next":
      this.result = this.next;
      this.next = data.next;
      return;
    case "text": // 文字/对话
      this.next = MotaActionBlocks['text_0_s'].xmlText([
        this.EvalString(data.data),this.next]);
      break;
    case "setText": // 设置剧情文本的属性
      var setTextfunc = function(a){return a?JSON.stringify(a).slice(1,-1):null;}
      data.title=setTextfunc(data.title);
      data.text=setTextfunc(data.text);
      data.background=setTextfunc(data.background);
      this.next = MotaActionBlocks['setText_s'].xmlText([
        data.position,data.title,data.text,data.background,this.next]);
      break;
    case "tip":
      this.next = MotaActionBlocks['tip_s'].xmlText([
        data.data,this.next]);
      this.parseAction();
      break;
    case "show": // 显示
      this.next = MotaActionBlocks['show_s'].xmlText([
        data.loc[0],data.loc[1],data.floorId||'',data.time||0,this.next]);
      break;
    case "hide": // 消失
      data.loc=data.loc||[];
      this.next = MotaActionBlocks['hide_s'].xmlText([
        data.loc[0]||'',data.loc[1]||'',data.floorId||'',data.time||0,this.next]);
      break;
    case "setBlock": // 设置图块
      data.loc=data.loc||[];
      this.next = MotaActionBlocks['setBlock_s'].xmlText([
        data.number||0,data.loc[0]||'',data.loc[1]||'',data.floorId||'',this.next]);
      break;
    case "move": // 移动事件
      data.loc=data.loc||[];
      this.next = MotaActionBlocks['move_s'].xmlText([
        data.loc[0]||'',data.loc[1]||'',data.time||0,data.immediateHide,this.StepString(data.steps),this.next]);
      break;
    case "moveHero":
      this.next = MotaActionBlocks['moveHero_s'].xmlText([
        data.time||0,this.StepString(data.steps),this.next]);
      break;
    case "changeFloor": // 楼层转换
      this.next = MotaActionBlocks['changeFloor_s'].xmlText([
        data.floorId,data.loc[0],data.loc[1],this.Direction(data.direction),this.time||0,this.next]);
      break;
    case "changePos": // 直接更换勇士位置, 不切换楼层
      if(this.isset(data.loc)){
        this.next = MotaActionBlocks['changePos_0_s'].xmlText([
          data.loc[0],data.loc[1],this.Direction(data.direction),this.next]);
      } else {
        this.next = MotaActionBlocks['changePos_1_s'].xmlText([
          this.Direction(data.direction),this.next]);
      }
      break;
    case "animate": // 显示动画
      var animate_loc = data.loc||'';
      if(animate_loc && animate_loc!=='hero')animate_loc = animate_loc[0]+','+animate_loc[1];
      this.next = MotaActionBlocks['animate_s'].xmlText([
        data.name,animate_loc,this.next]);
      break;
    case "showImage": // 显示图片
      if(this.isset(data.name)){
        this.next = MotaActionBlocks['showImage_0_s'].xmlText([
          data.name,data.loc[0],data.loc[1],this.next]);
      } else {
        this.next = MotaActionBlocks['showImage_1_s'].xmlText([
          this.next]);
      }
      break;
    case "setFg": // 颜色渐变
      if(this.isset(data.color)){
        this.next = MotaActionBlocks['setFg_0_s'].xmlText([
          data.color[0],data.color[1],data.color[2],data.color[3]||1,data.time||0,this.next]);
      } else {
        this.next = MotaActionBlocks['setFg_1_s'].xmlText([
          data.time||0,this.next]);
      }
      break;
    case "setWeather": // 更改天气
      this.next = MotaActionBlocks['setWeather_s'].xmlText([
        data.name||'无',data.level||1,this.next]);
      break;
    case "openDoor": // 开一个门, 包括暗墙
      this.next = MotaActionBlocks['openDoor_s'].xmlText([
        data.loc[0],data.loc[1],data.floorId||'',this.next]);
      break;
    case "openShop": // 打开一个全局商店
      this.next = MotaActionBlocks['openShop_s'].xmlText([
        data.id,this.next]);
      break;
    case "disableShop": // 禁用一个全局商店
      this.next = MotaActionBlocks['disableShop_s'].xmlText([
        data.id,this.next]);
      break;
    case "battle": // 强制战斗
      this.next = MotaActionBlocks['battle_s'].xmlText([
        data.id,this.next]);
      break;
    case "trigger": // 触发另一个事件；当前事件会被立刻结束。需要另一个地点的事件是有效的
      this.next = MotaActionBlocks['trigger_s'].xmlText([
        data.loc[0],data.loc[1],this.next]);
      break;
    case "playSound":
      this.next = MotaActionBlocks['playSound_s'].xmlText([
        data.name,this.next]);
      break;
    case "playBgm":
      this.next = MotaActionBlocks['playBgm_s'].xmlText([
        data.name,this.next]);
      break
    case "pauseBgm":
      this.next = MotaActionBlocks['pauseBgm_s'].xmlText([
        this.next]);
      break
    case "resumeBgm":
      this.next = MotaActionBlocks['resumeBgm_s'].xmlText([
        this.next]);
      break
    case "setValue":
      this.next = MotaActionBlocks['setValue_s'].xmlText([
        MotaActionBlocks['idString_e'].xmlText([data.name]),
        MotaActionBlocks['evalString_e'].xmlText([data.value]),
        this.next]);
      break;
    case "if": // 条件判断
      this.next = MotaActionBlocks['if_s'].xmlText([
        MotaActionBlocks['evalString_e'].xmlText([data.condition]),
        this.insertActionList(data["true"]),
        this.insertActionList(data["false"]),
        this.next]);
      break;
    case "choices": // 提供选项
      var text_choices = null;
      for(var ii=data.choices.length-1,choice;choice=data.choices[ii];ii--) {
        text_choices=MotaActionBlocks['choicesContext'].xmlText([
          choice.text,this.insertActionList(choice.action),text_choices]);
      }
      this.next = MotaActionBlocks['choices_s'].xmlText([
        this.EvalString(data.text),'','',text_choices,this.next]);
      break;
    case "win":
      this.next = MotaActionBlocks['win_s'].xmlText([
        data.reason,this.next]);
      break;
    case "lose":
      this.next = MotaActionBlocks['lose_s'].xmlText([
        data.reason,this.next]);
      break;
    case "function":
      var func = data["function"];
      func=func.split('{').slice(1).join('{').split('}').slice(0,-1).join('}').trim();
      this.next = MotaActionBlocks['function_s'].xmlText([
        this.EvalString(func),this.next]);
      break;
    case "update":
      this.next = MotaActionBlocks['update_s'].xmlText([
        this.next]);
      break;
    case "sleep": // 等待多少毫秒
      this.next = MotaActionBlocks['sleep_s'].xmlText([
        data.time,this.next]);
      break;
    case "revisit": // 立刻重新执行该事件
      this.next = MotaActionBlocks['revisit_s'].xmlText([
        this.next]);
      break;
    case "exit": // 立刻结束事件
      this.next = MotaActionBlocks['exit_s'].xmlText([
        this.next]);
      break;
    default:
      throw new Error("[警告]出错啦！\n"+data.type+" 事件不被支持...");
  }
  this.parseAction();
  return;
}

////// 往当前事件列表之后添加一个事件组 //////
ActionParser.prototype.insertActionList = function (actionList) {
  if (actionList.length===0) return null;
  this.event.data.list.push({"type": "_next", "next": this.next});
  this.event.data.list=this.event.data.list.concat(actionList);
  this.next = null;
  this.parseAction();
  return this.result;
}

////// 判断某对象是否不为undefined也不会null //////
ActionParser.prototype.isset = function (val) {
    if (val === undefined || val === null) {
        return false;
    }
    return true
}

ActionParser.prototype.StepString = function(steplist) {
  var stepchar = {
    'up': '上',
    'down': '下',
    'left': '左',
    'right': '右'
  }
  var StepString = [];
  for(var ii=0,obj;obj=steplist[ii];ii++) {
    if(typeof(obj)===typeof('')) {
      StepString.push(stepchar[obj]);
    } else {
      StepString.push(stepchar[obj['direction']]);
      StepString.push(obj['value']);
    }
  }
  return StepString.join('');
}

ActionParser.prototype.Direction = function(Direction) {
  var stepchar = {
    'up': '上',
    'down': '下',
    'left': '左',
    'right': '右'
  }
  Direction=stepchar[Direction];
  if(!Direction)Direction='不变';
  return Direction;
}

ActionParser.prototype.EvalString = function(EvalString) {
  return EvalString.split('\b').join('\\b').split('\t').join('\\t').split('\n').join('\\n');
}

MotaActionFunctions.actionParser = new ActionParser();

MotaActionFunctions.workspace = function(){return workspace}

MotaActionFunctions.parse = function(obj,type) {
  MotaActionFunctions.workspace().clear();
  xml_text = MotaActionFunctions.actionParser.parse(obj,type||'event');
  xml = Blockly.Xml.textToDom('<xml>'+xml_text+'</xml>');
  Blockly.Xml.domToWorkspace(xml, MotaActionFunctions.workspace());
}

MotaActionFunctions.EvalString_pre = function(EvalString){
  if (EvalString.indexOf('__door_name__')!==-1) throw new Error('请修改__door_name__,建议如开MT1层的[3,3]点的门, 则使用flag:MT1_3_3作为开门变量');
  return EvalString.replace(/([^\\])"/g,'$1\\"').replace(/^"/g,'\\"').replace(/""/g,'"\\"');
}

MotaActionFunctions.IdString_pre = function(IdString){
  if (IdString.indexOf('__door_name__')!==-1) throw new Error('请修改__door_name__,建议如开MT1层的[3,3]点的门, 则使用flag:MT1_3_3作为开门变量');
  if (IdString && !(/^[a-zA-Z_][0-9a-zA-Z_\-:]*$/.test(IdString)))throw new Error('id: '+IdString+'中包含了0-9 a-z A-Z _ - :之外的字符');
  return IdString;
}

MotaActionFunctions.DirectionEx_List_pre = function(DirectionEx_List){
  var directionchar = {
    '上': 'up',
    '下': 'down',
    '左': 'left',
    '右': 'right'
  }
  Direction=directionchar[DirectionEx_List];
  if(!Direction)Direction='';
  return Direction;
}

MotaActionFunctions.Direction_List_pre = MotaActionFunctions.DirectionEx_List_pre

MotaActionFunctions.StepString_pre = function(StepString){
  //StepString='上右3下2左上左2'
  var route = StepString.replace(/上/g,'U').replace(/下/g,'D').replace(/左/g,'L').replace(/右/g,'R');

  //copyed from core.js
  var ans=[], index=0;

  var isset = function(a) {
    if (a == undefined || a == null) {
      return false;
    }
    return true;
  }
  var getNumber = function (noparse) {
    var num="";
    while (index<route.length && !isNaN(route.charAt(index))) {
      num+=route.charAt(index++);
    }
    if (num.length==0) num="1";
    return isset(noparse)?num:parseInt(num);
  }

  while (index<route.length) {
    var c=route.charAt(index++);
    var number=getNumber();

    switch (c) {
      case "U": for (var i=0;i<number;i++) ans.push("up"); break;
      case "D": for (var i=0;i<number;i++) ans.push("down"); break;
      case "L": for (var i=0;i<number;i++) ans.push("left"); break;
      case "R": for (var i=0;i<number;i++) ans.push("right"); break;
    }
  }
  return ans;
}

*/