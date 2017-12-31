# 附录:API列表

?> 上次更新时间：* {docsify-updated} *

所有系统支持的API都列在了这里。所有可能被用到的API都在前面用\*标记。

可以在chrome浏览器的控制台中（`ctrl+shift+I`，找到Console）中直接进行调用，以查看效果。

!> **`core.js`：系统核心文件。所有核心逻辑处理都在此文件完成。**

``` js
* core.status.floorId // 获得当前层floorId
* core.status.thisMap // 获得当前层的地图信息

// ------ 初始化部分 ------
core.init // 初始化
core.showStartAnimate // 显示开始界面
core.hideStartAnimate // 隐藏开始界面
core.setStartProgressVal // 设置加载进度条进度
core.setStartLoadTipText // 设置加载进度条提示文字
core.loader // 加载图片和音频
core.loadImage // 加载图片
core.loadSound // 加载音频
core.loadSoundItem // 加载某一个音频
core.isPlaying // 游戏是否已经开始
core.clearStatus // 清除游戏状态和数据
core.resetStatus // 重置游戏状态和初始数据
core.startGame // 具体开始游戏
* core.restart // 重新开始游戏；此函数将回到标题页面

// ------ 键盘、鼠标事件 ------
core.onKeyDown // 按下某个键时
core.onKeyUp // 放开某个键时
core.pressKey // 按住某个键不动时
core.keyDown // 根据按下键的code来执行一系列操作
core.keyUp // 根据放开键的code来执行一系列操作
core.ondown // 点击（触摸）事件按下时
core.onmove // 当在触摸屏上滑动时
core.onup // 当点击（触摸）事件放开时
core.getClickLoc // 获得点击事件相对左上角的坐标（0到12之间）
core.onclick // 具体点击屏幕上(x,y)点时，执行的操作
core.onmousewheel // 滑动鼠标滚轮时的操作（楼层传送时可用滚轮切换楼层）

// ------ 自动寻路代码相关 ------
core.clearAutomaticRouteNode // 清除自动寻路路线
core.stopAutomaticRoute // 停止自动寻路操作
core.continueAutomaticRoute // 继续剩下的自动寻路操作
core.clearContinueAutomaticRoute // 清除剩下的自动寻路列表
core.setAutomaticRoute // 设置一个自动寻路
core.automaticRoute // 自动寻路算法，找寻最优路径
core.fillPosWithPoint // 显示离散的寻路点
core.clearStepPostfix // 清除已经寻路过的部分

// ------ 自动行走，行走控制 ------
core.stopAutoHeroMove // 停止勇士的自动行走
core.setAutoHeroMove // 设置勇士的自动行走路线
core.autoHeroMove // 让勇士开始自动行走
core.setHeroMoveInterval // 设置行走的效果动画
core.setHeroMoveTriggerInterval // 设置勇士行走过程中对途经事件的触发检测
* core.turnHero(direction) // 设置勇士的方向（转向）；如果指定了direction则会面向该方向，否则执行一个转向操作。
core.moveHero // 让勇士开始移动
core.moveOneStep // 每移动一格后执行的事件。中毒时在这里进行扣血判断。
core.waitHeroToStop(callback) // 停止勇士的一切行动，等待勇士行动结束后，再执行callback回调函数。
core.stopHero // 停止勇士的移动状态。
core.drawHero // 在hero层绘制勇士。
* core.setHeroLoc(name, value) // 设置勇士的位置。name为”direction”,”x”,”y”
* core.getHeroLoc(name) // 获得勇士的位置。
* core.nextX // 获得勇士面对位置的x坐标
* core.nextY // 获得勇士面对位置的y坐标

// ------ 地图和事件处理 ------
* core.openDoor(id, x, y, needKey, callback) // 打开一扇位于 (x,y) 的门
* core.battle(id, x, y, force, callback) // 进行战斗；force表示是否强制战斗
core.afterBattle // 战斗完毕
core.trigger(x,y) // 触发x,y点的事件
* core.changeFloor(floorId, stair, heroLoc, time, callback) // 楼层切换floorId为目标楼层Id，stair可指定为上/下楼梯，time动画时间
core.mapChangeAnimate // 实际切换的动画效果
core.clearMap // 清除地图显示
core.fillText // 在某个canvas上绘制一段文字
core.fillRect // 在某个canvas上绘制一个矩形
core.strokeRect // 在某个canvas上绘制一个矩形的边框
core.setFont // 设置某个canvas的文字字体
core.setLineWidth // 设置某个canvas的线宽度
core.saveCanvas // 保存某个canvas状态
core.loadCanvas // 读取某个canvas状态
core.setStrokeStyle // 设置某个canvas边框属性
core.setAlpha // 设置某个canvas的alpha值
core.setOpacity // 设置某个canvas的透明度
core.setFillStyle // 设置某个canvas的绘制属性（如颜色等）
* core.drawMap(mapId, callback) // 绘制某张地图。mapId为地图Id，绘制完毕将执行callback回调函数。
* core.noPassExists(x,y) // 某个点是否不可通行
core.noPass // 某个点是否在区域内且不可通行
* core.npcExists(x,y) // 某个点是否存在NPC
* core.terrainExists(x,y) // 某个点是否存在指定的地形
* core.stairExists(x,y) // 某个点是否存在楼梯
* core.nearStair // 当前位置是否在楼梯边
* core.enemyExists(x,y) // 某个点是否存在怪物
* core.getBlock(x, y, floorId, needEnable) // 获得某个点的block。floorId指定目标楼层，needEnable如果为false则即使该点的事件处于禁用状态也将被返回（否则只有事件启用的点才被返回）
core.moveBlock // 显示移动某块的动画，达到{“type”:”move”}的效果
core.animateBlock // 显示/隐藏某个块时的动画效果
core.addBlock // 将某个块从禁用变成启用状态
core.removeBlock // 将某个块从启用变成禁用状态
core.removeBlockById // 根据block的索引删除该块
core.removeBlockByIds // 一次性删除多个block
core.addGlobalAnimate // 添加一个全局动画
core.removeGlobalAnimate // 删除一个或所有全局动画
core.setGlobalAnimate // 设置全局动画的显示效果
core.setBoxAnimate // 显示UI层某个box的动画（如怪物手册中怪物的动画）
core.drawBoxAnimate // 绘制UI层的box动画
core.setFg // 色调渐变
* core.updateFg // 更新全地图的显伤
* core.itemCount // 获得某个物品的个数
* core.hasItem // 是否存在某个物品
* core.setItem // 设置某个物品的个数
* core.removeItem // 删除某个物品
* core.useItem // 使用某个物品；直接调用items.js中的useItem函数。
* core.canUseItem // 能否使用某个物品。直接调用items.js中的canUseItem函数。
* core.addItem // 增加某个物品的个数
* core.getItem // 获得某个物品时的事件
* core.drawTip // 左上角绘制一段提示
* core.drawText // 地图中间绘制一段文字

// ------ 系统机制 ------
core.replaceText // 将文字中的${和}（表达式）进行替换
core.calValue // 计算表达式的值
core.splitText // 字符串自动换行的分割
core.unshift // 向某个数组前插入另一个数组或元素
core.setLocalStorage // 设置本地存储
core.getLocalStorage // 获得本地存储
core.removeLocalStorage // 移除本地存储
core.clone // 复制一个对象
core.formatDate // 格式化时间为字符串
core.setTwoDigits // 两位数显示
core.win // 获胜；将直接调用events.js中的win函数
core.lose // 失败；将直接调用events.js中的lose函数
core.debug // 进入Debug模式，攻防血和钥匙都调成很高的数值
core.checkStatus // 判断当前能否进入某个事件
core.openBook // 点击怪物手册时的打开操作
core.useFly // 点击楼层传送器时的打开操作
core.openToolbox // 点击工具栏时的打开操作
core.save // 点击保存按钮时的打开操作
core.load // 点击读取按钮时的打开操作
core.doSL // 实际进行存读档事件
core.syncSave // 存档同步操作
core.saveData // 存档到本地
core.loadData // 从本地读档
* core.setStatus // 设置勇士属性
* core.getStatus // 获得勇士属性
* core.setFlag // 设置某个自定义变量或flag
* core.getFlag // 获得某个自定义变量或flag
* core.hasFlag // 是否存在某个自定义变量或flag，且值为true
core.insertAction // 往当前事件列表之前插入一系列事件
* core.lockControl // 锁定状态栏，常常用于事件处理
* core.unlockControl // 解锁状态栏
* core.isset // 判断某对象是否不为undefined也不会null
* core.playSound // 播放音频
* core.playBgm // 播放背景音乐
core.changeSoundStatus // 切换声音状态
core.enableSound // 启用音效
core.disableSound // 禁用音效
core.show // 动画显示某对象
core.hide // 动画使某对象消失
core.clearStatusBar // 清空状态栏
core.updateStatusBar // 更新状态栏
core.resize // 屏幕分辨率改变后重新自适应
core.resetSize // 屏幕分辨率改变后重新自适应

// ------ core.js 结束 ------
```

!> **`data.js` 定义了一些初始化的数据信息。**

!> **`enemys.js` 定义了怪物信息。**

``` js
* core.enemys.getSpecialText // 获得特殊属性的文字
* core.enemys.getDamage // 获得某个怪物的伤害
* core.enemys.getExtraDamage // 获得某个怪物的额外伤害（吸血）
* core.enemys.getCritical // 计算某个怪物的临界值
* core.enemys.getCriticalDamage // 计算某个怪物的临界减伤
* core.enemys.getDefDamage // 计算某个怪物的1防减伤
* core.enemys.calDamage // 实际的伤害计算公式
core.enemys.getCurrentEnemys // 获得当前层剩下的的怪物列表
```

!> **`events.js` 定义了各个事件的处理流程。**

``` js
* core.events.startGame // 开始游戏
* core.events.win // 获胜
* core.events.lose // 失败
core.events.checkBlock // 检查领域、夹击事件
core.events.afterChangeFloor // 楼层切换结束时的事件
core.events.doEvents // 开始执行一系列自定义事件
core.events.doAction // 执行当前自定义事件列表中的下一个事件
core.events.insertAction // 往当前自定义事件列表前插入若干个事件
core.events.openShop // 打开一个全局商店
core.events.disableQuickShop // 禁用一个快捷商店
* core.events.canUseQuickShop // 当前能否使用快捷商店
* core.events.useItem // 尝试使用道具
core.events.afterBattle // 战斗结束后触发的事件
core.events.afterOpenDoor // 开一个门后触发的事件
core.events.passNet // 经过一个路障
core.events.beforeSaveData // 即将存档前可以执行的操作
core.events.afterLoadData // 读档后，载入事件前可以执行的操作

// ------ 界面上的点击事件 ------
core.events.clickAction // 自定义事件处理时，对用户点击的处理
core.events.clickBook // 怪物手册打开时，对用户点击的处理
core.events.clickFly // 楼层传送器打开时，对用户点击的处理
core.events.clickShop // 全局商店打开时，对用户点击的处理
core.events.clickQuickShop // 快捷商店选项打开时
core.events.clickToolbox // 工具栏打开时
core.events.clickSL // 存/读档界面打开时
core.events.clickSettings // 设置页面打开时
```

!> `maps.js` 定义了地图，以及每个数字所代表的意义。

``` js
core.maps.loadFloor // 加载某个楼层（从剧本或存档中）
core.maps.getBlock // 将数字替换成实际的内容
core.maps.addEvent // 向该楼层添加剧本的自定义事件
core.maps.addChangeFloor // 向该楼层添加剧本的楼层转换事件
core.maps.initMaps // 初始化所有地图
core.maps.save // 将当前地图重新变成数字，以便于存档
core.maps.load // 将存档中的地图信息重新读取出来
```

!> `ui.js` 定义了各种界面的绘制。

``` js
core.ui.closePanel // 结束一切事件和绘制，关闭UI窗口，返回游戏进程
core.ui.drawTextBox // 绘制一个对话框
core.ui.drawChoices // 绘制一个选项界面
core.ui.drawConfirmBox // 绘制一个确认/取消的警告页面
core.ui.drawSettings // 绘制系统菜单栏
core.ui.drawQuickShop // 绘制快捷商店选择栏
core.ui.drawBattleAnimate // 绘制战斗过程
core.ui.drawWaiting // 绘制一个“请稍后”页面
core.ui.drawSyncSave // 绘制存档同步选项
core.ui.drawPagination // 绘制分页
core.ui.drawEnemyBook // 绘制怪物手册
core.ui.drawFly // 绘制楼层传送器
core.ui.drawToolbox // 绘制道具栏
core.ui.drawSLPanel // 绘制存档/读档界面
core.ui.drawThumbnail // 绘制一个缩略图
core.ui.drawAbout // 绘制“关于”界面
```
