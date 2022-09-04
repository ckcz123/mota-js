# 修改编辑器

?> 在这一节中，让我们来了解如何修改编辑器（包括配置表格和事件编辑器）

在改动core时, 有时会相应的更改project中存储数据的结构, 而表格和事件编辑器不做相应更改的话就无法顺畅的编辑改动了结构的数据了, 此文档帮助造塔者进行`配置表格`的修改, 以及修改_server/MotaAction.g4和其他相关文件来调整事件编辑器的图块.

## 修改表格

### demo - 给怪物增加 _速度_ 属性

点击素材区的怪物后点击配置表格, 或者直接打开_server/table/comment.js  
拉到`【怪物】相关的表格配置`的部分  
``` js
// --------------------------- 【怪物】相关的表格配置 --------------------------- //
"enemys": {
	"_type": "object",
	"_data": {
		"id": {
			"_leaf": true,
			"_type": "disable",
			"_docs": "怪物ID",
			"_data": "怪物ID，可于页面底部修改"
		},
		"name": {
			"_leaf": true,
			"_type": "textarea",
			"_string": true,
			"_data": "名称"
		},
		"displayIdInBook": {
			"_leaf": true,
			"_type": "textarea",
			"_string": true,
			"_docs": "手册映射ID",
			"_data": "在怪物手册中映射到的怪物ID。如果此项不为null，则在怪物手册中，将用目标ID来替换该怪物原本的ID。常被运用在同一个怪物的多朝向上。"
		},
		"hp": {
			"_leaf": true,
			"_type": "textarea",
			"_data": "生命值"
		},
		"atk": {
			"_leaf": true,
			"_type": "textarea",
			"_data": "攻击力"
		},
```
可以看到, project/enemys.js 中怪物的属性
```js
"greenSlime": {"name":"绿头怪","hp":100,"atk":120,"def":0,"money":1,"exp":1,"point":0,"special":[1,5,7,8]},
```
被逐条列出并解释

把hp的部分复制一份并修改
```js
"speed": {
	"_leaf": true,
	"_type": "textarea",
	"_data": "速度"
},
```
刷新之后, 怪物的表格在hp下面就多出了speed一项, 编辑后出现在了怪物属性中
```js
"greenSlime": {"name":"绿头怪","hp":100,"atk":120,"def":0,"money":1,"exp":1,"point":0,"special":[1,5,7,8],"speed":123123},
```
### 表格配置项含义

可以看出表格配置中的对象是一层套一层的结构, `_`开头的和数据的名字间隔着展开, 忽略所有`_`的层级的话, 这个对象和project中的对象是有相同的结构

**_leaf** 为真的项对应的数据将作为表格的编辑的内容, 数字/字符串/空对象和数组会被自动计算为true, 非空的对象和数组会被计算为false, 手动填写_leaf的值可以强制不展开对象和数组来进行编辑

**_type** 决定了表格如何展示该数据  
+ select 使用下拉菜单展示
+ checkbox 使用勾选框展示
+ checkboxSet 使用勾选框组展示
+ 其他 使用文本框展示, 根据类型区分, 双击或点编辑会有以下行为
  - textarea 文本编辑器(_type的默认值)
  - event 事件编辑器
  - material 素材选取
  - color 取色器
  - point 地图选点
  - disable 不允许编辑
  - popCheckBoxSet 以弹窗形式多选框

当某个event例如 门信息编辑 无法适应修改后的数据结构, 可以修改事件编辑器, 也可以把_type改成textarea  
以上类型的格式要如何写请搜索例如`"_type": "checkboxSet"`来查找例子, 此处不展示

**_range** 被编辑的值会作为`thiseval`来进行检测, 当字符串为真时才接收这个值, 同时当删除表格时会判定_range是否接收null

**拓展性**

注意这是js文件, 可以使用表达式, 如下例子引用了别处的数据作为下拉菜单
```js
"bgm": {
	"_leaf": true,
	"_type": "select",
	"_select": {
		"values": [null].concat(Object.keys(editor.core.material.bgms))
	},
	"_docs": "背景音乐",
	"_data": "到达该层后默认播放的BGM"
},
```

同时`_`开头的项可以使用函数. 同一级中`_data`最先被计算. 复杂的结构的注释可以利用函数动态生成  
`_data`的参数`key`是各子项的名字, 其他`_`开头的参数是`args`详见editor_table.prototype.objToTable的注释  
例如: 自动事件数组, `"_leaf": false`强制展开, 通过`_action`函数即使为空也显示两个空白的项, 同时`_data`函数给自动事件的每一项标记为event  
```js
"autoEvent": {
	"_type": "object",
	"_leaf": false,
	"_action": function (args) {
		args.vobj = args.vobj || {};
		for (var ii = 0; ii < 2; ii++) {
			args.vobj[ii] = args.vobj[ii] || null;
		}
	},
	"_data": function (key) {
		return {
			"_leaf": true,
			"_type": "event",
			"_event": "autoEvent",
			"_data": "自动事件"
		}
	}
},
```

## 修改事件编辑器

_type为event的表格项, 在双击时会进入事件编辑器. 是由[antlr-blockly](https://github.com/zhaouv/antlr-blockly)生成的图块式的可视化编辑器  

_event的内容例如autoEvent则是使用的入口图块的类型  

请先查看[antlr-blockly的文档](https://zhaouv.github.io/antlr-blockly/docs/#/README)来了解.g4语法文件和可视化编辑器blockly以及库antlr-blockly的基础知识

### 事件编辑器的运行机制简介

事件编辑器编辑一个表格项的流程有以下几步
+ 加载表格中的json, 将其根据类别转化成图块
+ 通过拖拽填写图块编辑内容
+ 将图块转化回json置入表格

其中图块到json 是由_server/MotaAction.g4完成的  
json到图块 是由_server/MotaActionParser.js完成的, 并依赖图块在g4中的定义  

图块到json首先由入口方块出发, 入口方块又依次去获取了嵌入在其中的方块和域, 嵌入的方块再递归访问其嵌入的内容, 从而访问了所有方块上域中的信息.  
例如 event_m 通过 action_0 获取了其中嵌入的所有语句生成的json, 插入到其自身的键'data'中

```antlr
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
```

值得注意的是shoplist和action这样的语句集合, 语句集合会选择其中的最后一项作为父方块的默认块, 所以在希望其允许空时, 要制作一个空项放在语句集合定义的末尾, 例如
```antlr
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
```

json到图块则是从ActionParser.prototype.parse出发, 递归的将js对象变为图块, 例如event类型的json, 使用event_m入口图块, 将obj.trigger/enable/noPass/displayDamage填到域中, obj.data交给this.parseList转化为语句的图块, 与g4中注入的语句做相反的事情
```js
ActionParser.prototype.parse = function (obj,type) {
  switch (type) {
    case 'event':
      if(!obj)obj={};
      if(typeof(obj)===typeof('')) obj={'data':[obj]};
      if(obj instanceof Array) obj={'data':obj};
      return MotaActionBlocks['event_m'].xmlText([
        obj.trigger==='action',obj.enable,obj.noPass,obj.displayDamage,this.parseList(obj.data)
      ]);
```

### demo - 给已有图块添加新域

例如给'播放背景音乐'图块再额外加一个参数列表  

不熟悉时, 对任意图块来说这都算是最简单粗暴的修改方式了, 复杂的修改需求也只需要改这一下, 只是填图块时没那么方便  

编辑g4时推荐使用vscode, 搜索并安装插件mota-js  

<pre><code>playBgm_s
    :   '播放背景音乐' EvalString '开始播放秒数' Int '持续到下个本事件' Bool <b style='color:green'>'参数列表' JsonEvalString?</b> Newline
    

/* playBgm_s
tooltip : playBgm: 播放背景音乐
helpUrl : https://h5mota.com/games/template/_docs/#/event?id=playbgm%EF%BC%9A%E6%92%AD%E6%94%BE%E8%83%8C%E6%99%AF%E9%9F%B3%E4%B9%90
default : ["bgm.mp3", 0, true]
allBgms : ['EvalString_0']
colour : this.soundColor
Int_0 = Int_0 ? (', "startTime": '+Int_0) : '';
Bool_0 = Bool_0 ? ', "keep": true' : '';
<b style='color:green'>if (JsonEvalString_0) {
    JsonEvalString_0 = ', "args": ' +JsonEvalString_0;
}</b>
var code = '{"type": "playBgm", "name": "'+EvalString_0+'"'+Int_0+Bool_0+<b style='color:green'>JsonEvalString_0+</b>'},\n';
return code;
*/;</code></pre>

使用了类型JsonEvalString, 并在注入的代码中处理了其新增出的JsonEvalString_0要如何体现在这个方块产生的json  
此处使用了antlr-blockly产生的'类型名_次数'的默认名称, 也可以开头加一行`name : [null,null,null,'args']`来把这个变量命名为args, 对于setText_s这种域比较多的块会很有帮助.  
在MotaAction中, 除了默认的Int/Number等  
常规的字符串使用EvalString  
ID类型的使用IdString  
允许空的自然数使用IntString  
位置坐标使用PosString  
不转义的多行文本使用RawEvalString  
json类型的文本使用JsonEvalString  

相应的也需要改json到图块的部分

<pre><code>      break;
    case "playBgm":
      this.next = MotaActionBlocks['playBgm_s'].xmlText([
        data.name,data.startTime||0,data.keep||false<b style='color:green'>,data.args</b>,this.next]);
      break
    case "pauseBgm":</code></pre>


### demo - 增加新语句图块

假设已经制作了一个名为`陨石坠落`的公共事件, 其参数列表是长度3的数组, 依次是陨石颜色, 陨石位置, 爆炸范围.

每次要使用插入公共事件并要填`陨石坠落`和形如`[[231,231,41],[5,7],1]`的长而且带有格式的内容, 并且无法使用取色器和地图选点功能. 此时就可以借助'注册一个自定义事件'并填加新语句图块来解决这个问题.

首先注册成名为'meteorite'的事件, 在插件编写的init中添加以下内容
```js
core.registerEvent('meteorite', function(data){
    core.insertAction({"type": "insert", "name": "陨石坠落", "args": [data.color, data.loc, data.range]});
	core.doAction();
})
```

然后在g4中修改以下位置(请善用搜索来定位)

<pre><code>    |   drawSelector_1_s
    |   unknown_s
    |   function_s<b style='color:green'>
    |   meteorite_s</b>
    |   pass_s
    ;

text_0_s</code></pre>

并在分号后面添加

```antlr
meteorite_s
    :   '陨石坠落' '颜色' ColorString? Colour 'x' PosString ',' 'y' PosString '爆炸范围' Int Newline
    

/* meteorite_s
tooltip : 陨石坠落
helpUrl : https://h5mota.com/games/template/_docs/#/event
default : ["255,0,0,1",'rgba(255,0,0,1)',"0","0",1]
selectPoint : ["PosString_0", "PosString_1"]
colour : this.soundColor
var loc = ', "loc": ['+PosString_0+','+PosString_1+']';
ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
var code = '{"type": "meteorite"'+ColorString_0+loc+', "range": '+Int_0+'},\n';
return code;
*/;
```

希望是特效的颜色, 于是在g4搜索'画面闪烁', 找到了`colour : this.soundColor`, 抄出其中的颜色的写法, 地图选点的写法同理, 搜索'强制战斗'后模仿其写法

在MotaActionParser.js中添加json到图块的代码, 同理模仿'画面闪烁'和'强制战斗'

<pre><code>      break;
    case "playBgm":
      this.next = MotaActionBlocks['playBgm_s'].xmlText([
        data.name,data.startTime||0,data.keep||false,this.next]);
      break;<b style='color:green'>
    case "meteorite":
      data.color = this.Colour(data.color)
      this.next = MotaActionBlocks['meteorite_s'].xmlText([
        data.color,'rgba('+data.color+')',data.loc[0],data.loc[1],data.range,this.next]);
      break;
    </b>case "pauseBgm":</code></pre>

最后在editor_blocklyconfig.js中将其加入到工具栏中

<pre><code>    '特效/声音':[<b style='color:green'>
      MotaActionBlocks['meteorite_s'].xmlText(),
      </b>MotaActionBlocks['sleep_s'].xmlText(),</code></pre>

==========================================================================================

[继续阅读下一章：UI编辑器](ui-editor)