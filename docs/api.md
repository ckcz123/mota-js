# 附录:API列表

?> 上次更新时间：* {docsify-updated} *

所有系统支持的API都列在了这里。所有可能被用到的API都在前面用\*标记。

可以在chrome浏览器的控制台中（`ctrl+shift+I`，找到Console）中直接进行调用，以查看效果。

!> **`main.js`：游戏入口，所有其他JS文件都是被此文件加载。**

``` js
main.init // 初始化
main.loaderJs // 动态加载所有核心JS文件
main,loaderFloors // 动态加载所有楼层（剧本）
main.loadMod // 加载某一个JS文件
main.loadFloor // 加载某一个楼层
main.setMainTipsText // 加载过程提示
window.onresize // 窗口大小变化时
main.dom.body.onkeydown // 在界面上按下某按键时
main.dom.body.onkeydown // 在界面上放开某按键时
main.dom.body.onselectstart // 开始选择时
main.dom.data.onmousedown // 鼠标按下时
main.dom.data.onmousemove // 鼠标移动时
main.dom.data.onmouseup // 鼠标放开时
main.dom.data.onmousewheel // 鼠标滑轮滚动时
main.dom.data.ontouchstart // 手指在触摸屏开始触摸时
main.dom.data.ontouchmove // 手指在触摸屏上移动时
main.dom.data.ontouchend // 手指离开触摸屏时
main.statusBar.image.book.onclick // 点击状态栏中的怪物手册时
main.statusBar.image.fly.onclick // 点击状态栏中的楼层传送器时
main.statusBar.image.toolbox.onclick // 点击状态栏中的工具箱时
main.statusBar.image.shop.onclick // 点击状态栏中的快捷商店时
main.statusBar.image.save.onclick // 点击状态栏中的存档按钮时
main.statusBar.image.load.onclick // 点击状态栏中的读档按钮时
main.statusBar.image.settings.onclick // 点击状态栏中的系统菜单时
main.dom.playGame.onclick // 点击“开始游戏”时
main.dom.loadGame.onclick // 点击“载入游戏”时
main.dom.replayGame.onclick // 点击“录像回放”时
main.dom.easyLevel.onclick // 点击“简单难度”时
main.dom.normalLevel.onclick // 点击“普通难度”时
main.dom.hardLevel.onclick // 点击“困难难度”时
```

!> **`core.js`：系统核心文件。所有核心逻辑处理都在此文件完成。**

``` js
* core.status.floorId // 获得当前层floorId
* core.status.thisMap // 获得当前层的地图信息
* core.status.maps // 获得所有楼层的地图信息
* core.floors // 获得所有楼层的剧本

// ------ 初始化部分 ------
core.init // 初始化
core.showStartAnimate // 显示游戏开始界面
core.hideStartAnimate // 隐藏游戏开始界面
core.setStartProgressVal // 设置加载进度条进度
core.setStartLoadTipText // 设置加载进度条提示文字
core.loader // 加载图片和音频
core.loadAutotile // 加载Autotile
core.loadImage // 加载图片
core.loadMusic // 加载音频
core.isPlaying // 游戏是否已经开始
core.clearStatus // 清除游戏状态和数据
core.resetStatus // 重置游戏状态和初始数据
core.startGame // 开始游戏
* core.restart // 重新开始游戏；此函数将回到标题页面

// ------ 键盘、鼠标事件 ------
core.onKeyDown // 按下某个键时
core.onKeyUp // 放开某个键时
core.pressKey // 按住某个键时
core.keyDown // 根据按下键的code来执行一系列操作
core.keyUp // 根据放开键的code来执行一系列操作
core.ondown // 点击（触摸）事件按下时
core.onmove // 当在触摸屏上滑动时
core.onup // 当点击（触摸）事件放开时
core.getClickLoc // 获得点击事件相对左上角的坐标（0到12之间）
core.onclick // 具体点击屏幕上(x,y)点时，执行的操作
core.onmousewheel // 滑动鼠标滚轮时的操作

// ------ 自动寻路代码相关 ------
core.clearAutomaticRouteNode // 清除自动寻路路线
core.stopAutomaticRoute // 停止自动寻路操作
core.continueAutomaticRoute // 继续剩下的自动寻路操作
core.clearContinueAutomaticRoute // 清空剩下的自动寻路列表
core.setAutomaticRoute // 设置自动寻路路线
core.automaticRoute // 自动寻路算法，找寻最优路径
core.fillPosWithPoint // 显示离散的寻路点
core.clearStepPostfix // 清除已经寻路过的部分

// ------ 自动行走，行走控制 ------
core.stopAutoHeroMove // 停止勇士的自动行走
core.setAutoHeroMove // 设置勇士的自动行走路线
core.autoHeroMove // 让勇士开始自动行走
core.setHeroMoveInterval // 设置行走的效果动画
core.setHeroMoveTriggerInterval // 设置勇士行走过程中对事件的触发检测
core.moveAction // 实际每一步的行走过程
* core.turnHero(direction) // 设置勇士的方向（转向）
core.canMoveHero // 勇士能否前往某方向
core.moveHero // 让勇士开始移动
core.eventMoveHero // 使用事件让勇士移动。这个函数将不会触发任何事件。
core.moveOneStep // 每移动一格后执行的事件。中毒时在这里进行扣血判断。
core.waitHeroToStop(callback) // 停止勇士的一切行动，等待勇士行动结束后，再执行callback回调函数。
core.stopHero // 停止勇士的移动状态。
core.drawHero // 绘制勇士。
* core.setHeroLoc(name, value) // 设置勇士的位置。name为”direction”,”x”,”y”
* core.getHeroLoc(name) // 获得勇士的位置。
* core.nextX // 获得勇士面对位置的x坐标
* core.nextY // 获得勇士面对位置的y坐标

// ------ 地图和事件处理 ------
* core.openDoor(id, x, y, needKey, callback) // 打开一扇位于 (x,y) 的门
* core.battle(id, x, y, force, callback) // 进行战斗；force表示是否强制战斗
core.afterBattle // 战斗完毕
core.trigger(x,y) // 触发x,y点的事件
* core.changeFloor(floorId, stair, heroLoc, time, callback) // 楼层切换。floorId为目标楼层Id，stair可指定为上/下楼梯，time动画时间
core.mapChangeAnimate // 地图切换动画效果
core.clearMap // 清除地图
core.fillText // 在某个canvas上绘制一段文字
core.fillRect // 在某个canvas上绘制一个矩形
core.strokeRect // 在某个canvas上绘制一个矩形的边框
core.drawLine // 在某个canvas上绘制一条线
core.setFont // 设置某个canvas的文字字体
core.setLineWidth // 设置某个canvas的线宽度
core.saveCanvas // 保存某个canvas状态
core.loadCanvas // 加载某个canvas状态
core.setStrokeStyle // 设置某个canvas边框属性
core.setAlpha // 设置某个canvas的alpha值
core.setOpacity // 设置某个canvas的透明度
core.setFillStyle // 设置某个canvas的绘制属性（如颜色等）
* core.drawMap(mapId, callback) // 绘制某张地图。mapId为地图Id，绘制完毕将执行callback回调函数。
core.drawAutotile // 绘制Autotile
* core.noPassExists(x,y) // 某个点是否不可通行
core.noPass // 某个点是否在区域内且不可通行
* core.npcExists(x,y) // 某个点是否存在NPC
* core.terrainExists(x,y) // 某个点是否存在（指定的）地形
* core.stairExists(x,y) // 某个点是否存在楼梯
* core.nearStair // 当前位置是否在楼梯边
* core.enemyExists(x,y) // 某个点是否存在（指定的）怪物
* core.getBlock(x, y, floorId, needEnable) // 获得某个点的block。floorId指定目标楼层，needEnable如果为false则即使该点的事件处于禁用状态也将被返回（否则只有事件启用的点才被返回）
core.moveBlock // 显示移动某块的动画，达到{“type”:”move”}的效果
core.animateBlock // 显示/隐藏某个块时的动画效果
core.showBlock // 将某个块从禁用变成启用状态
core.removeBlock // 将某个块从启用变成禁用状态
core.removeBlockById // 根据block的索引删除该块
core.removeBlockByIds // 一次性删除多个block
core.addGlobalAnimate // 添加一个全局动画
core.removeGlobalAnimate // 删除一个或所有全局动画
core.setGlobalAnimate // 设置全局动画的显示效果
core.syncGlobalAnimate // 同步所有的全局动画效果
core.setBoxAnimate // 显示UI层某个box的动画（如怪物手册中怪物的动画）
core.drawBoxAnimate // 绘制UI层的box动画
core.updateCheckBlock // 更新领域、夹击、阻击的伤害地图
core.checkBlock // 检查并执行领域、夹击、阻击事件
core.snipe // 阻击事件（动画效果）
core.setFg // 更改画面色调
* core.updateFg // 更新全地图显伤
* core.itemCount // 获得某个物品的个数
* core.hasItem // 是否存在某个物品
* core.setItem // 设置某个物品的个数
* core.removeItem // 删除某个物品
* core.useItem // 使用某个物品；直接调用items.js中的useItem函数。
* core.canUseItem // 能否使用某个物品。直接调用items.js中的canUseItem函数。
* core.addItem // 增加某个物品的个数
core.getNextItem // 获得面前的物品（轻按）
* core.getItem // 获得某个物品
* core.drawTip // 左上角绘制一段提示
* core.drawText // 地图中间绘制一段文字

// ------ 系统机制 ------
core.replaceText // 将文字中的${和}（表达式）进行替换
core.calValue // 计算表达式的值
core.doEffect // 执行一个表达式的effect操作
core.splitLines // 字符串自动换行的分割
core.unshift // 向某个数组前插入另一个数组或元素
core.setLocalStorage // 设置本地存储
core.getLocalStorage // 获得本地存储
core.removeLocalStorage // 移除本地存储
core.clone // 深拷贝一个对象
core.formatDate // 格式化时间为字符串
core.formatDate2 // 格式化时间为最简字符串
core.setTwoDigits // 两位数显示
core.debug // 进入Debug模式，攻防血和钥匙都调成很高的数值
core.replay // 开始回放
core.checkStatus // 判断当前能否进入某个事件
core.openBook // 点击怪物手册时的打开操作
core.useFly // 点击楼层传送器时的打开操作
core.openToolbox // 点击工具栏时的打开操作
core.openQuickShop // 点击快捷商店时的打开操作
core.save // 点击保存按钮时的打开操作
core.load // 点击读取按钮时的打开操作
core.openSettings // 点击设置按钮时的打开操作
core.autosave // 自动存档
core.doSL // 实际进行存读档事件
core.syncSave // 存档同步操作
core.saveData // 存档到本地
core.loadData // 从本地读档
core.encodeRoute // 将路线压缩
core.decodeRoute // 将路线解压缩
* core.setStatus // 设置勇士属性
* core.getStatus // 获得勇士属性
core.getLvName // 获得某个等级的名称
* core.setFlag // 设置某个自定义变量或flag
* core.getFlag // 获得某个自定义变量或flag
* core.hasFlag // 是否存在某个自定义变量或flag，且值为true
core.insertAction // 往当前事件列表之前插入一系列事件
* core.lockControl // 锁定状态栏，常常用于事件处理
* core.unlockControl // 解锁状态栏
* core.isset // 判断某对象是否不为undefined也不会null
core.readFile // 读取一个本地文件内容
core.download // 下载文件到本地
core.copy // 复制一段文字到剪切板
* core.playBgm // 播放背景音乐
* core.pauseBgm // 暂停背景音乐的播放
* core.resumeBgm // 恢复背景音乐的播放
* core.playSound // 播放音频
core.show // 动画显示某对象
core.hide // 动画使某对象消失
core.clearStatusBar // 清空状态栏
core.updateStatusBar // 更新状态栏
core.resize // 屏幕分辨率改变后重新自适应
core.domRenderer // 渲染DOM

// ------ core.js 结束 ------
```

!> **`data.js` 定义了一些初始化的数据信息。**

!> **`enemys.js` 定义了怪物信息。**

``` js
core.enemys.init // 初始化
* core.enemys.getEnemys // 获得一个或所有怪物数据
* core.enemys.hasSpecial // 判断是否含有某特殊属性
* core.enemys.getSpecialText // 获得所有特殊属性的名称
* core.enemys.getSpecialHint // 获得每个特殊属性的说明
* core.enemys.getDamage // 获得某个怪物的伤害
* core.enemys.getExtraDamage // 获得某个怪物的额外伤害
* core.enemys.getCritical // 临界值计算
* core.enemys.getCriticalDamage // 临界减伤计算
* core.enemys.getDefDamage // 1防减伤计算
* core.enemys.calDamage // 具体的伤害计算公式
core.enemys.getCurrentEnemys // 获得当前楼层的怪物列表
```

!> **`events.js` 定义了各个事件的处理流程。**

``` js
core.events.init // 初始化
core.events.getEvents // 获得一个或所有系统事件类型
core.events.startGame // 游戏开始事件
* core.events.setInitData // 不同难度分别设置初始属性
* core.events.win // 游戏获胜事件
* core.events.lose // 游戏失败事件
core.evens.gameOver // 游戏结束
core.events.afterChangeFloor // 转换楼层结束的事件
core.events.doEvents // 开始执行一系列自定义事件
core.events.doAction // 执行当前自定义事件列表中的下一个事件
core.events.insertAction // 往当前事件列表之前添加一个或多个事件
core.events.openShop // 打开一个全局商店
core.events.disableQuickShop // 禁用一个全局商店
* core.events.canUseQuickShop // 当前能否使用快捷商店
* core.events.checkLvUp // 检查升级事件
* core.events.useItem // 尝试使用道具
core.events.addPoint // 加点事件
core.events.afterBattle // 战斗结束后触发的事件
core.events.afterOpenDoor // 开一个门后触发的事件
core.events.passNet // 经过一个路障
core.events.changeLight // 改变亮灯（感叹号）的事件
* core.events.afterChangeLight // 改变亮灯之后，可以触发的事件
* core.events.afterUseBomb // 使用炸弹/圣锤后的事件
* core.events.beforeSaveData // 即将存档前可以执行的操作
* core.events.afterLoadData // 读档事件后，载入事件前，可以执行的操作

// ------ 点击事件和键盘事件的处理 ------
core.events.longClick // 长按
core.events.keyDownCtrl // 按下Ctrl键时（快捷跳过对话）
core.events.clickConfirmBox // 确认框界面时的点击操作
core.events.keyUpConfirmBox // 确认框界面时，放开某个键的操作
core.events.clickAction // 自定义事件时的点击操作
core.events.keyDownAction // 自定义事件时，按下某个键的操作
core.events.keyUpAction // 自定义事件时，放开某个键的操作
core.events.clickBook // 怪物手册界面的点击操作
core.events.keyDownBook // 怪物手册界面时，按下某个键的操作
core.events.keyUpBook // 怪物手册界面时，放开某个键的操作
core.events.clickBookDetail // 怪物手册属性显示界面时的点击操作
core.events.clickFly // 楼层传送器界面时的点击操作
core.events.keyDownFly // 楼层传送器界面时，按下某个键的操作
core.events.keyUpFly // 楼层传送器界面时，放开某个键的操作
core.events.clickViewMaps // 浏览地图界面时的点击操作
core.events.keyDownViewMaps // 浏览地图界面时，按下某个键的操作
core.events.keyUpViewMaps // 浏览地图界面时，放开某个键的操作
core.events.clickShop // 商店界面时的点击操作
core.events.keyDownShop // 商店界面时，按下某个键的操作
core.events.keyUpShop // 商店界面时，放开某个键的操作
core.events.clickQuickShop // 快捷商店界面时的点击操作
core.events.keyDownQuickShop // 快捷商店界面时，按下某个键的操作
core.events.keyUpQuickShop // 快捷商店界面时，放开某个键的操作
core.events.clickToolbox // 工具栏界面时的点击操作
core.events.clickToolboxIndex // 选择工具栏界面中某个Index后的操作
core.events.keyDownToolbox // 工具栏界面时，按下某个键的操作
core.events.keyUpToolbox // 工具栏界面时，放开某个键的操作
core.events.clickSL // 存读档界面时的点击操作
core.events.keyDownSL // 存读档界面时，按下某个键的操作
core.events.keyUpSL // 存读档界面时，放开某个键的操作
core.events.clickSwitchs // 系统设置界面时的点击操作
core.events.keyDownSwitchs // 系统设置界面时，按下某个键的操作
core.events.keyUpSwitchs // 系统设置界面时，放开某个键的操作
core.events.clickSettings // 系统菜单栏界面时的点击事件
core.events.keyDownSettings // 系统菜单栏界面时，按下某个键的操作
core.events.keyUpSettings // 系统菜单栏界面时，放开某个键的操作
core.events.clickSyncSave // 同步存档界面时的点击操作
core.events.keyDownSyncSave // 同步存档界面时，按下某个键的操作
core.events.keyUpSyncSave // 同步存档界面时，放开某个键的操作
core.events.clickKeyBoard // 虚拟键盘界面时的点击操作
core.events.clickAbout // “关于”界面时的点击操作
```

!> `icons.js` 定义了素材ID和它在图片上的索引的对应关系。

!> `items.js` 定义了每个道具的名称，以及使用效果。

``` js
core.items.init // 初始化
core.items.getItems // 获得所有道具
core.items.getItemEffect // “即捡即用类”道具的使用效果
core.items.getItemEffectTip // “即捡即用类”道具的文字提示
* core.items.useItem // 使用道具
* core.items.cauUseItem // 当前能否使用道具
```

!> `maps.js` 定义了数字-ID的对应关系。

``` js
core.maps.loadFloor // 加载某个楼层（从剧本或存档中）
core.maps.getBlock // 数字和ID的对应关系
core.maps.addEvent // 向该楼层添加剧本的自定义事件
core.maps.addChangeFloor // 向该楼层添加剧本的楼层转换事件
core.maps.initMaps // 初始化所有地图
core.maps.save // 将当前地图重新变成数字，以便于存档
core.maps.load // 将存档中的地图信息重新读取出来
core.maps.getMapArray // 将当前地图重新变成二维数组形式
```

!> `ui.js` 定义了各种界面的绘制。

``` js
core.ui.closePanel // 结束一切事件和绘制，关闭UI窗口，返回游戏进程
core.ui.drawTextBox // 绘制一个对话框
core.ui.drawChoices // 绘制一个选项界面
core.ui.drawConfirmBox // 绘制一个确认/取消的警告页面
core.ui.drawSwitchs // 绘制系统设置界面
core.ui.drawSettings // 绘制系统菜单栏
core.ui.drawQuickShop // 绘制快捷商店选择栏
core.ui.drawBattleAnimate // 绘制战斗动画
core.ui.drawWaiting // 绘制等待界面
core.ui.drawSyncSave // 绘制存档同步界面
core.ui.drawPagination // 绘制分页
core.ui.drawEnemyBook // 绘制怪物手册
core.ui.drawBookDetail // 绘制怪物属性的详细信息
core.ui.drawFly // 绘制楼层传送器
core.ui.drawMaps // 绘制浏览地图界面
core.ui.drawToolbox // 绘制道具栏
core.ui.drawSLPanel // 绘制存档/读档界面
core.ui.drawThumbnail // 绘制一个缩略图
core.ui.drawAbout // 绘制“关于”界面
core.ui.drawHelp // 绘制帮助界面
```
