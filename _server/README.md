# editor

>! 以下均是v2.0时的说明, 未及时改动

本目录下所有文件,以及`../editor.html`和`../启动服务.exe`([源码](http://github.com/ckcz123/mota-js-server/))是地图编辑器的所有组件.

`editor.js`,`editor_file.js`和`editor_mode.js`耦合较强,`editor_blockly.js`和`editor_multi.js`和`fs.js`基本可以独立使用.

## 各组件功能

### 总体上

以`display:none`的形式引入了`index.html`的`dom`,修改了原来的`.gameCanvas #ui #data`等的名字以避免冲突

通过`main.init('editor')`加载数据

`editor`模式关闭了部分动画

`core.drawMap`中`editor`模式下不再画图,而是生成画图的函数提供给`editor`

`editor`模式下`GlobalAnimate`可以独立的选择是否播放

`core.playBgm`和`core.playSound`中非`play`模式不再播放声音

`core.show`和`core.hide`中非`play`模式不再进行动画而是立刻完成并执行回调

`editor`模式不执行`core.resize`

### editor.js

``` js
editor.mapInit();//清空地图
editor.changeFloor('MT2')//切换地图
editor.guid()//产生一个可以作为id的长随机字符串
```

`editor.updateMap`中画未定义快的报错

### editor_file.js

提供了以下函数进行楼层`map`数组相关的操作
```javascript
editor.file.getFloorFileList
editor.file.loadFloorFile
editor.file.saveFloorFile
editor.file.saveFloorFileAs
```

编辑模式有关的查询
```javascript
editor.file.editItem('redJewel',[],function(a){console.log(a)});
editor.file.editEnemy('redBat',[],function(a){console.log(a)});
editor.file.editLoc(2,0,[],function(a){console.log(a)});
editor.file.editFloor([],function(a){console.log(a)});
editor.file.editTower([],function(a){console.log(a)});
editor.file.editFunctions([],function(a){console.log(a)});
```

编辑模式有关的编辑
```javascript
editor.info={images: "terrains", y: 9};
editor.file.changeIdAndIdnum('yellowWall2',16,editor.info,function(a){console.log(a)});
editor.file.editItem('book',[["change","['items']['name']","怪物手册的新名字"]],function(a){console.log(a)});
editor.file.editEnemy('redBat',[['change',"['atk']",20]],function(a){console.log(a)});
editor.file.editLoc(2,6,[["change","['afterBattle']",null]],function(a){console.log(a)});
editor.file.editFloor([["change","['title']",'样板 33 层']],function(a){console.log(a)});
editor.file.editTower([["change","['values']['lavaDamage']",200]],function(a){console.log(a)});
editor.file.editFunctions(["change","['events']['afterChangeLight']","function(x,y){console.log(x,y)}"],function(a){console.log(a)});
```

### editor_mode.js
生成表格并绑定事件的函数
```javascript
editor.mode.loc();
editor.mode.enemyitem();
editor.mode.floor();
editor.mode.tower();
editor.mode.functions();
```

切换模式
```javascript
editor.mode.onmode('');//清空
editor.mode.onmode('save');//保存
editor.mode.onmode('nextChange');//下次onmode时前端进行切换

editor.mode.onmode('loc');
editor.mode.onmode('enemyitem');
editor.mode.onmode('floor');
editor.mode.onmode('tower');
editor.mode.onmode('functions');
editor.mode.onmode('map');
editor.mode.onmode('appendpic');
```
在`onmode('save')`时,改动才会保存到文件,涉及到图片的改动需要刷新页面使得`editor`能看到

表格的`onchange`的实现中,获得当前模式的方式.不注意的话,修改`index.html`中页面的结构,会被坑
```javascript
var node = thisTr.parentNode;
while (!editor_mode._ids.hasOwnProperty(node.getAttribute('id'))) {
  node = node.parentNode;
}
editor_mode.onmode(editor_mode._ids[node.getAttribute('id')]);
```

`editor.mode.listen`中提供了追加素材的支持.


### editor_blockly.js

把选定`id_`的事件用blockly编辑
``` js
editor_blockly.import(id_,{type:'event'});
```

把文本区域的代码转换成图块
``` js
editor_blockly.parse();
```

### editor_multi.js

用[CodeMirror](https://github.com/codemirror/CodeMirror) 实现有高亮的多行文本编辑

编辑选定`id_`的文本域
``` js
editor_multi.import(id_,{lint:true})
```

编辑blockly方块的特定域
``` js
editor_multi.multiLineEdit(value,b,f,{lint:true},callback)
```

### fs.js

模仿node的fs模块提供如下api,与`启动服务.exe`配合为js提供文件读写功能
``` js
fs.readFile('file.in','utf-8',callback) 
//读文本文件
//callback:function(err, data)
//data:字符串
fs.readFile('file.in','base64',callback) 
//读二进制文件
//callback:function(err, data)  
//data:base64字符串

fs.writeFile('file.out', data ,'utf-8', callback)
//写文本文件
//callback:function(err)
//data:字符串
fs.writeFile('file.out', data ,'base64', callback)
//写二进制文件
//callback:function(err)
//data:base64字符串

fs.readdir(path, callback)
//callback:function(err, data) 
//path:支持"/"做分隔符
//data:[filename1,filename2,..] filename是字符串,只包含文件不包含目录

//所有参数不允许缺省
```

