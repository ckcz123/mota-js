# 重构

+ [ ] 按功能拆分文件
+ [ ] 左侧页面模块化, 方便添加
+ [ ] 不同的模式的文件操作尽可能模块化

---

文件结构

+ [x] editor_blockly 图块化事件编辑器, 基本不改动
+ [x] editor_multi 多行文本编辑器, 基本不改动
+ [ ] editor_table 处理表格的生成, 及其响应的事件, 从原editor\_mode中分离
+ [ ] editor_file 调用fs.js编辑文件, 把原editor\_file模块化
+ [ ] editor_game 处理来自core的数据, 导入为editor的数据, 从原editor中分离
+ [ ] editor_util 生成guid等函数, 从editor分离
+ [ ] editor 执行初始化流程加组合各组件

+ [ ] 原editor_mode 移除
+ [ ] 原vm 移除

---

对象结构

```
editor: {
    __proto__: {
        blockly: 组件
        multi: 组件
        file: 组件
        table: 组件
        util: 组件
    }
    game: 来自游戏的数据
    config: 编辑器配置
    mode: 当前的模式(左侧的选择)
    map: 当前编辑层的地图
    ...
}
```

---

某些注意到的点

+ 地图的编辑与其他(如全塔属性和楼层属性), 现在的文件操作的模式是完全不同的  
  楼层文件的储存与其他不同

+ functions和plugins的借助JSON.stringify的replacer特殊处理

+ 目前editor.map中储存的是info\<object\>, 准备改为和core一致只储存数字

## 功能改进

+ [ ] 大地图  
  在切换时, 每次都回到最左上->每个楼层记录一个位置  
  四个箭头目前不能长按

+ [ ] ? 表格折叠  
  变为四栏, 可以折叠展开

+ [ ] blockly对于无法识别的图块原样返回

+ [ ] ? 简洁的事件方块注册
  `editor.registerEvent('log',[['test','Int','测试',0],['floorId','Idstring','楼层','MT0']])`

+ [ ] 一个显示所有快捷键的文本

+ [ ] 更多快捷键  
  【全塔属性】、【楼层属性】等常用的编辑栏切换  

+ [ ] ? 地图编辑优化
  常用的地图编辑快捷键/命令：复制ctrl+c、粘贴ctrl+v、（复制可绑定为现在的“选中xx位置事件” 粘贴为复制xx事件到此处），撤回ctrl+z、取消撤回ctrl+y  
  可以按住拖动图块与事件。

+ [ ] ? 自由建立快捷键到命令的注册表。

+ [ ] 画地图也自动保存



## 左侧页面模式

标题? 保存按钮? 添加按钮? 删除按钮?

自定义内容?

表格?
