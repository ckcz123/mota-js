# editor

本目录下所有文件,以及`../editor.html`和`../启动服务.exe`([源码](http://github.com/ckcz123/mota-js-server/))是地图编辑器的所有组件.

`editor.js`,`editor_file.js`和`editor_mode.js`耦合较强,`editor_blockly.js`和`fs.js`基本可以独立使用.

## 各组件功能

### editor.js

暂略

### editor_file.js
提供了以下函数进行楼层`map`数组相关的操作
```javascript
editor.file.getFloorFileList
editor.file.loadFloorFile
editor.file.saveFloorFile
editor.file.saveFloorFileAs
```
5个编辑模式有关的查询
```javascript
editor.file.editItem('redJewel',[],function(a){console.log(a)});
editor.file.editEnemy('redBat',[],function(a){console.log(a)});
editor.file.editLoc(2,0,[],function(a){console.log(a)});
editor.file.editFloor([],function(a){console.log(a)});
editor.file.editTower([],function(a){console.log(a)});
```
5个编辑模式有关的编辑
```javascript
editor.info={images: "terrains", y: 9};
editor.file.changeIdAndIdnum('yellowWall2',16,editor.info,function(a){console.log(a)});
editor.file.editItem('book',[["change","['items']['name']","怪物手册的新名字"]],function(a){console.log(a)});
editor.file.editEnemy('redBat',[['change',"['atk']",20]],function(a){console.log(a)});
editor.file.editLoc(2,6,[["change","['afterBattle']",null]],function(a){console.log(a)});
editor.file.editFloor([["change","['title']",'样板 33 层']],function(a){console.log(a)});
editor.file.editTower([["change","['values']['lavaDamage']",200]],function(a){console.log(a)});
```

### editor_mode.js
4个生成表格并绑定事件的函数
```javascript
editor.mode.loc();
editor.mode.emenyitem();
editor.mode.floor();
editor.mode.tower();
```
切换模式
```javascript
editor.mode.onmode('');
editor.mode.onmode('loc');
editor.mode.onmode('emenyitem');
editor.mode.onmode('floor');
editor.mode.onmode('tower');
```
在切换模式时,改动才会保存到文件,并且需要刷新页面使得`editor`能看到改动

表格的`onchange`的实现中,获得当前模式的方式.不注意的话,修改`index.html`中页面的结构,会被坑
```javascript
var node = thisTr.parentNode;
while (!editor_mode._ids.hasOwnProperty(node.getAttribute('id'))) {
  node = node.parentNode;
}
editor_mode.onmode(editor_mode._ids[node.getAttribute('id')]);
```
### editor_blockly.js
把选定`id_`的事件用blockly编辑
``` js
editor_blockly.import(id_);
```
把文本区域的代码转换成图块
``` js
editor_blockly.parse();
```
把当前图块对应的事件返回给调用blockly的`id_`
``` js
editor_blockly.confirm();
```

### 待调整

多行文本编辑器独立作为组件
editor_multi.js

## z-index

目前主体部分使用了 0,75,100

暂定blockly使用 200 ,多行文本编辑器使用 300

完成后再调整