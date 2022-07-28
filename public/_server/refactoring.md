# 重构

> 目前状态: 按功能分类, 维持稳定状态, 在3.0中重写

总体思路  
+ 按功能拆分文件
+ 左侧页面模块化, 方便添加
+ 不同的模式的文件操作尽可能模块化

目前主要在重构editor_file, 思路是editor.file负责把editor.game内的游戏数据格式化成字符串以及写入到文件, 由editor.game来修改数据
+ editor.file维护一些标记, 描述哪些数据需要格式化并写入, 在save时写入文件(自动保存的话就是每次修改数据都触发save)
+ editor.game修改数据, 并修改editor.file中的标记
+ 此思路下editor.file的大部分内容会挪到editor.game, editor.game和editor.table可能会再进一步合并拆分

editor_file之后是更改editor.map的储存方式, 现有的存对象的模式要在对象和数字间来回转换, 非常繁琐和奇怪

## 文件结构

(全部小写,必要时用下划线分割)

+ [ ] editor_blockly 图块化事件编辑器
+ [ ] editor_multi 多行文本编辑器
+ [x] editor_table 处理表格的生成, 及其响应的事件, 从原editor\_mode中分离
+ [ ] editor_file 调用fs.js编辑文件, 把原editor\_file模块化, 并且只负责文件写入
+ [ ] editor_game 处理游戏数据, 导入为editor的数据, 编辑数据, 从原editor和editor_file中抽离. **只有此文件允许`\s(main|core)`形式的调用**(以及其初始化`editor_game_wrapper(editor, main, core);`)
+ [x] editor_util 生成guid/处理颜色 等函数, 从editor分离
+ [ ] editor_listen 处理界面上的按钮/下拉框点击等用户的操作与功能函数的绑定, 维护editor.dom, unsorted_1/2中的绑定挪到此处, 其中的函数内容, 分类放在其他文件
+ [ ] editor_mappanel 与地图区相关的功能, <-unsorted_1/2/3
+ [ ] editor_datapanel 与数据区相关的功能, <-unsorted_1/2/3
+ [ ] editor_materialpanel 与素材区相关的功能, <-unsorted_1/2/3
+ [ ] editor_ui 维护printe/printf/tip, 以及之后可能的窗口化, ui事件中没有具体到前三个区中的函数 <-unsorted_1/2/3
+ [ ] editor 执行初始化流程加组合各组件
+ [ ] 原editor_mode 移除
+ [x] 原vm 移除
+ [x] \*comment.js 表格注释与结构, 移至table/\*comment.js

## 对象结构

```
editor: {
    __proto__: {
        fs
        util
        file
        table
        multi
        blockly
        game
    }
    config: 编辑器配置
    mode: 当前的模式(左侧的选择)
    map: 当前编辑层的地图
    isMobile: 编辑器是否是手机端
    currentFloorData: 当前编辑的楼层数据
    ...
}
```

---

## 某些注意到的点&准备修改的内容

+ 插入公共事件的参数的转义处理, .g4中添加ObjectString, 要求其中的值可以JSON.parse, 生成的code中也是作为对象而不是字符串出现

+ 修改editor.multi中的转义处理, 目前双击某些方块使用文本编辑的处理, 一部分在editor.blockly, 一部分在editor.multi, 比较混乱

+ 地图的编辑与其他(如全塔属性和楼层属性), 现在的文件操作的模式是完全不同的  
  楼层文件的储存与其他不同

+ [x] editor.file在修改时不再返回obj和commentobj,只在查询时返回

+ editor.file中的各个条目, 非常相似, 但是细节的不同处理非常麻烦. 是类似的代码复制后修改一部分, 尝试模块化(或者重写)

+ functions和plugins的借助JSON.stringify的replacer特殊处理, 与其他项的处理完全不同, 改成用统一的方法处理(为了统一,全部使用这种不直观的replacer的处理)

+ 怪物/物品/地图选点事件的处理, field中怪物id等明显与其他节地位不等, 处理起来很繁琐

+ 目前editor.map中储存的是info\<object\>, 准备改为和core一致只储存数字

+ editor.widthX特别不直观

+ ? 编辑器使用可拖拽和调大小的窗口做容器

## 功能改进

+ [x] 大地图  
  在切换时, 每次都回到最左上->每个楼层记录一个位置  
  四个箭头支持长按  
  ? 滚动条

+ [ ] ? 表格折叠  
  变为四栏, 可以折叠展开

+ [x] blockly对于无法识别的图块原样返回

+ [ ] ? 简洁的事件方块注册
  `editor.registerEvent('log',[['test','Int','测试',0],['floorId','Idstring','楼层','MT0']])`

+ [x] 一个显示所有快捷键的文本

+ [x] 更多快捷键  
  【全塔属性】、【楼层属性】等常用的编辑栏切换  

+ [x] ? 地图编辑优化
  常用的地图编辑快捷键/命令：复制ctrl+c、粘贴ctrl+v、（复制可绑定为现在的“选中xx位置事件” 粘贴为复制xx事件到此处），撤回ctrl+z、取消撤回ctrl+y  
  可以按住拖动图块与事件。

+ [ ] ? 自由建立快捷键到命令的注册表。

+ [ ] 画地图也自动保存

+ [x] 修改系统的触发器（下拉菜单增加新项）  
  在编辑器修改`comment.js`：现场发readFile请求读文件，然后开脚本编辑器进行编辑

+ [x] ? 删除注册项/修改图块ID

+ [ ] ? 怪物和道具也能像其他类型那样查看“图块信息”（而不只是具体的怪物属性）

+ [x] 素材区自动换列  
  怪物或道具太多时, 按照每100个进行拆分新开列来显示  

+ [x] 多帧素材只显示第一帧  

+ [x] `显示文章`以及`选项`等方块, 把`标题`和`图像`从字符串提取出填回相应的空

+ [x] blockly中某些需要选点的填空, 增加按钮, 点击后从缩略图中点击位置

+ [ ] 插件编写增加判定，如果保存时框内不是以 "function\s*()" 开头（也就是用户直接写的脚本），则自动添加一个 function() { } 将代码包装起来。

## 左侧页面模式

标题? 保存按钮? 添加按钮? 删除按钮?

自定义内容?

表格?
