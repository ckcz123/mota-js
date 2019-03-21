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
    }
    game: 来自游戏的数据
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

## 左侧页面模式

标题? 保存按钮? 添加按钮? 删除按钮?

自定义内容?

表格?
