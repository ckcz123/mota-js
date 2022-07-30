# 操作列表

每个操作均有画布名称一项，不再一一列出

## 创建画布  createCanvas

id: cretae

- 横纵坐标：number
- 长宽：number
- 纵深（z）：number

交互操作：选中时展示边框，可拖动

## 删除画布  deleteCanvas

id: delete

交互操作：选中时点delete可直接追加一个删除画布的操作

## 移动画布  relocateCanvas

id: move

- 横纵坐标：移动至的横纵坐标
- 相对原来位置：是否相对原来位置

交互操作：选中画布时，直至焦点离开画布时，如果画布移动了，会创建一个移动操作

## 缩放画布  resizeCanvas

id: resize

- 长宽：要修改至的长宽
- 只修改style：如果是，那么会变模糊，如果否，之前的绘制会被清除

交互操作：选中画布时，直至焦点离开画布时，如果画布缩放了，会创建一个缩放操作

## 旋转画布  rotateCanvas

id: rotate

- 中心点
- 角度：角度制

交互操作：选中画布时，直至焦点离开画布时，如果画布旋转了，会创建一个旋转操作

## 清除画布  clearMap

id: clear

无交互

## 设置css  HTMLCanvasElement.style

id: css

大概不可能把所有属性都列出来

无交互

## 设置混合方式  CanvasRenderingContext2D.globalCompositing

id: composite

这个数量有限，可以列出来

无交互

## 设置滤镜  CanvasRenderingContext2D.filter

id: filter

或许可以考虑全部列出?

无交互

## 设置阴影  CanvasRenderingContext2D.shadow(Color|OffsetX|OffsetY|Blur)

id: shadow

可以全部列出

无交互

## 设置文字信息  CanvasRenderingContext2D.(direction|textAlign|textBaseline)

id: textInfo

只提供三种信息

无交互

## 保存绘制信息  CanvasRenderingContext2D.save

id: save

## 回退绘制信息  CanvasRenderingContext2D.restore

id: restore

## 绘制线段  drawLine

id: line

几个坐标参数，以及颜色、线条粗细参数

交互操作：拖拽调始末位置坐标

## 绘制圆弧  (stroke|fill)Arc

id: arc

中心、半径、始末点弧度，以及一个重要参数，是否为描边

## 绘制圆

id: circle

## 绘制矩形、圆角矩形

id: rect  roundRect

## 绘制多边形

id: polygon

参数数量不确定

## 绘制椭圆、箭头

id: ellipse  arrow

## 绘制贝塞尔曲线  CanvasRenderingContext2D.bezierCurveTo

id: bezierCurve

## 绘制图片、图标

id: image  icon

## 绘制窗口皮肤

id: winskin

有一个背景图的参数

## 绘制单行、多行文本

id: text  textContent

## 等待

id: wait

等待若干毫秒

## 设置过渡  transition

id: transition

显然不能每个都单列，不过可以设置属性、时间、速度函数、延迟