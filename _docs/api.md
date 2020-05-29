# 附录：API列表

?> 目前版本**v2.6.6**，上次更新时间：* {docsify-updated} *

这里将列出所有被转发到core的API，没有被转发的函数此处不会列出，请自行在代码中查看。

本附录量较大，如有什么需求请自行Ctrl+F进行搜索。

如有任何疑问，请联系小艾寻求帮助。

## core.js

core.js中只有很少的几个函数，主要是游戏开始前的初始化等。

但是，core中定义了很多游戏运行时的状态，这些状态很多都会被使用到。

``` text
core.__SIZE__, core.__PIXELS__
游戏窗口大小；对于13x13的游戏而言这两个值分别是13和416，15x15来说分别是15和480。


core.material
游戏中的所有资源列表，具体分为如下内容：
core.material.animates  （动画）
core.material.bgms    （背景音乐）
core.material.enemys    （怪物信息，来自于 project/enemys.js）
core.material.icons    （图标信息，来自于 project/icons.js）
core.material.images    （图片素材，存放了各项素材图片如items.png等）
    core.material.images.autotile    （所有的自动元件图片）
    core.material.images.tilesets    （所有的额外素材图片）
    core.material.images.images    （用户引入的其他图片）
core.material.items    （道具信息）
core.material.sounds    （音效）


core.animateFrame
主要是记录和requestAnimationFrame相关的一些数据，常用的如下：
core.animateFrame.totalTime    （游戏总的运行时时间）
core.animateFrame.weather    （当前的天气信息）
core.animateFrame.asyncId    （当前的异步处理事件的内容）


core.musicStatus
主要是记录和音效相关的内容，常用的如下：
core.musicStatus.bgmStatus    （音乐开启状态）
core.musicStatus.soundStatus    （音效开启状态）
core.musicStatus.playingBgm    （当前正在播放的BGM）
core.musicStatus.lastBgm    （最近一次尝试播放的BGM）
core.musicStatus.volume    （当前的音量）
core.musicStatus.cachedBgms    （背景音乐的缓存内容）
core.musicStatus.cacheBgmCount    （背景音乐的缓存数量，默认值是4）


core.platform
游戏平台相关信息，常见的几个如下：
core.platform.isPC    （是否是电脑端）
core.platform.isAndroid    （是否是安卓端）
core.platform.isIOS    （是否是iOS端）
core.platform.useLocalForage    （是否开启了新版存档）


core.domStyle
游戏的界面信息，包含如下几个：
core.domStyle.scale    （当前的放缩比）
core.domStyle.isVertical    （当前是否是竖屏状态）
core.domStyle.showStatusBar    （当前是否显示状态栏）
core.domStyle.toolbarBtn    （当前是否显示工具栏）


core.bigmap
当前的地图的尺寸信息，主要包含如下几个
core.bigmap.width    （当前地图的宽度）
core.bigmap.height    （当前地图的高度）
core.bigmap.offsetX    （当前地图针对窗口左上角的偏移像素x）
core.bigmap.offsetX    （当前地图针对窗口左上角的偏移像素y）
core.bigmap.tempCanvas    （一个临时画布，可以用来临时绘制很多东西）


core.saves
和存档相关的信息，包含如下几个：
core.saves.saveIndex    （上次保存或读取的存档编号）
core.saves.ids    （当前存在存档的编号列表）
core.saves.autosave    （自动存档的信息）
core.saves.favorite    （收藏的存档）
core.saves.favoriteNames    （自定义存档的名称）


core.status
游戏的状态相关，是整个游戏中最重要的东西，其核心是如下几条：
请注意，每次重新开始、存档或读档时，core.status都会重新初始化。
core.status.played    （当前是否在游戏中）
core.status.gameOver    （当前是否已经游戏结束，即win或lose）
core.status.hero    （勇士信息；此项和全塔属性中的hero大体是对应的）
    core.status.hero.name    勇士名
    core.status.hero.lv      当前等级
    core.status.hero.hpmax   当前生命上限
    core.status.hero.hp      当前生命值
    core.status.hero.manamax   当前魔力上限
    core.status.hero.mana    当前魔力值
    core.status.hero.atk     当前攻击力
    core.status.hero.def     当前防御力
    core.status.hero.mdef    当前护盾值
    core.status.hero.money   当前金币值
    core.status.hero.exp    当前经验值
    core.status.hero.loc     当前的位置信息
    core.status.hero.equipment     当前装上的装备
    core.status.hero.items   当前拥有的道具信息
    core.status.hero.flags   当前的各项flag信息
    core.status.hero.step    当前的步数值
    core.status.hero.statistics    当前的统计信息
core.status.floorId    （当前所在的楼层）    
core.status.maps    （所有的地图信息）
core.status.thisMap    （当前的地图信息，等价于core.status.maps[core.status.floorId]）
core.status.bgmaps   （所有背景层的信息）
core.status.fgmaps    （所有的前景层的信息）
core.status.checkBlock    （地图上的阻激夹域信息，也作为光环的缓存）
core.status.lockControl    （当前是否是控制锁定状态）
core.status.automaticRoute    （当前的自动寻路信息）
core.status.route    （当前记录的录像）
core.status.replay    （录像回放时要用到的信息）
core.status.shops    （所有全局商店信息）
core.status.textAttribute    （当前的文字属性，如颜色、背景等信息，和setText事件对应）
core.status.globalAttribute    （当前的全局属性，如边框色、装备栏等）
core.status.curtainColor    （当前色调层的颜色）
core.status.globalAnimateObjs    （当前的全局帧动画效果）
core.status.floorAnimateObjs    （当前的楼层贴图帧动画效果）
core.status.boxAnimateObjs    （当前的盒子帧动画效果，例如怪物手册中的怪物）
core.status.autotileAnimateObjs    （当前楼层的自动元件动画效果）
core.status.globalAnimateStatus    （当前的帧动画的状态）
core.status.animateObjs    （当前的播放动画信息）


core.floorIds
一个数组，表示所有的楼层ID，和全塔属性中的floorIds一致。


core.floors
从楼层文件中读取全部的地图数据。
和core.status.maps不同的是，后者在每次重新开始和读档时都会重置，也允许被修改（会存入存档）。
而core.floors全程唯一，不允许被修改。


core.statusBar
状态栏信息，例如状态栏图片，图标，以及各个内容的DOM定义等。
core.statusBar.images    （所有的系统图标，和icons.png对应）
core.statusBar.icons    （状态栏中绘制的图标内容）


core.values
所有的全局数值信息，和全塔属性中的values一致。
此项允许被直接修改，会存入存档。


core.flags
所有的全塔开关，和全塔属性中的flags一致。
此项不允许被直接修改，如有需要请使用“设置系统开关”事件，或者调用core.setGlobalFlag这个API。


core.plugin
定义的插件函数。


core.doFunc(func, _this)
执行一个函数，func为函数体或者插件中的函数名，_this为使用的this。
如果func为一个字符串，则视为插件中的函数名，同时_this将被设置成core.plugin。
此函数剩余参数将作为参数被传入func。
```

## actions.js

actions.js主要是处理一些和用户交互相关的内容。

```text
core.registerAction(action, name, func, priority)
注册一个用户交互行为。
action：要注册的交互类型，如 ondown, onclick, keyDown 等等。
name：你的自定义名称，可被注销使用；同名重复注册将后者覆盖前者。
func：执行函数；可以是一个具体的函数体，或者是一个插件中的函数名。
priority：优先级；优先级高的被注册项将会被执行。此项可不填，默认为0。
返回：如果func返回true，则不会再继续执行其他的交互函数；否则会继续执行其他的交互函数。


core.unregisterAction(action, name)
注销一个用户交互行为。


core.doRegisteredAction(action)
执行一个用户交互行为。
此函数将在该交互行为所注册的所有函数中，按照优先级从高到底依次执行。
此函数剩余的参数将会作为参数传入该执行函数中。
当某个执行函数返回true时将终止这一过程。


core.onkeyDown(e)
当按下某个键时的操作，e为KeyboardEvent。
请勿直接覆盖或调用此函数，如有需要请注册一个"onkeyDown"的交互函数。


core.onkeyUp(e)
当放开某个键时的操作，e为KeyboardEvent。
请勿直接覆盖或调用此函数，如有需要请注册一个"onkeyUp"的交互函数。


core.pressKey(keyCode)
当按住某个键不动时的操作，目前只对方向键有效。
如果需要添加对于其他键的长按，请复写_sys_onkeyDown和_sys_onkeyUp。
请勿直接覆盖或调用此函数，如有需要请注册一个"pressKey"的交互函数。


core.keyDown(keyCode)
当按下某个键时的操作，参数为该键的keyCode值。
请勿直接覆盖或调用此函数，如有需要请注册一个"keyDown"的交互函数。


core.keyUp(keyCode, altKey, fromReplay)
当按下某个键时的操作，参数为该键的keyCode值。
altKey标志了Alt键是否同时被按下，fromReplay表示是否是从录像回放中调用的。
请勿直接覆盖或调用此函数，如有需要请注册一个"keyUp"的交互函数。


core.ondown(loc)
当点击屏幕时的操作。loc为点击的信息。
请勿直接覆盖或调用此函数，如有需要请注册一个"ondown"的交互函数。
注册的ondown交互函数需要接受x, y, px, py四个参数，代表点击的位置和像素坐标。


core.onmove(loc)
当在屏幕上滑动时的操作。loc为当前的坐标信息。
请勿直接覆盖或调用此函数，如有需要请注册一个"onmove"的交互函数。
注册的onmove交互函数需要接受x, y, px, py四个参数，代表当前的的位置和像素坐标。


core.onup()
当从屏幕上离开时的操作。请注意此函数是没有参数的。
请勿直接覆盖或调用此函数，如有需要请注册一个"onup"的交互函数。


core.onclick(x, y)
当点击屏幕上的某点位置时执行的操作，请注意这里的x和y是位置坐标。
一般而言，一个完整的ondown到onup将触发一个onclick事件。
请勿直接覆盖或调用此函数，如有需要请注册一个"onclick"的交互函数。


core.onmousewheel(direct)
当滚动鼠标滑轮时执行的操作。direct为滑轮方向，上为1，下为-1。
请勿直接覆盖或调用此函数，如有需要请注册一个"onmousewheel"的交互函数。


core.keyDownCtrl()
当长按Ctrl键不动时执行的操作。
请勿直接覆盖或调用此函数，如有需要请注册一个"keyDownCtrl"的交互函数。


core.longClick()
当长按住屏幕时执行的操作。
请勿直接覆盖或调用此函数，如有需要请注册一个"keyDownCtrl"的交互函数。
注册的交互函数如果某一项返回true，则之后仍然会继续触发该长按，
如果全部返回false则将停止本次长按行为，直到手指离开屏幕并重新进行长按为止。
```

## control.js

control.js将负责整个游戏的核心控制系统，分为如下几个部分：
- requestAnimationFrame相关
- 标题界面，开始和重新开始游戏
- 自动寻路和人物行走相关
- 画布、位置、阻激夹域、显伤等相关
- 录像的回放相关
- 存读档，自动存档，同步存档等相关
- 人物属性和状态、位置、变量等相关
- 天气、色调、音乐和音效的播放
- 状态栏和工具栏相关
- 界面resize相关

```text
// ------ requestAnimationFrame 相关 ------ //

core.registerAnimationFrame(name, needPlaying, func)
注册一个animationFrame。它将在每次浏览器的帧刷新时（约16.6ms）被执行。
name：你的自定义名称，可被注销使用；同名重复注册将后者覆盖前者。
needPlaying：如果此项为true，则仅在游戏开始后才会被执行（标题界面不执行）
func：执行函数；可以是一个具体的函数体，或者是一个插件中的函数名。
func可以接受一个timestamp作为参数，表示从整个页面加载完毕到当前时刻所经过的毫秒数。
如果func执行报错，将在控制台打出一条信息，并自动进行注销。


core.unregisterAnimationFrame(name)
注销一个animationFrame，参数是你的上面的自定义名称。

// ------ 开始界面相关 ------ //

core.showStartAnimate(noAnimate, callback)
重置所有内容并显示游戏标题界面。
noAnimate如果为true则不会有淡入动画，callback为执行完毕的回调。


core.hideStartAnimate(callback)
淡出隐藏游戏标题界面，callback为执行完毕的回调。


core.isPlaying()
当前是否正在游戏中。


core.clearStatus()
清除所有的游戏状态和数据，包括状态栏的显示。

// ------ 自动寻路、人物行走 ------ //

core.stopAutomaticRoute()
停止自动寻路的操作


core.saveAndStopAutomaticRoute()
保存剩下的寻路路线并停止自动寻路操作。主要用于打怪开门后继续寻路使用。


core.continueAutomaticRoute()
继续剩下的自动寻路操作。主要用于打怪开门后继续寻路使用。


core.clearContinueAutomaticRoute()
清空剩下的自动寻路操作。


core.setAutomaticRoute(destX, destY, stepPostfix)
尝试开始进行一个自动寻路。stepPostfix是鼠标拖动的路径。
此函数将检测是否在寻路中（在则停止或双击瞬移），检测是否点击自己（转身或轻按），
检测是否能单击瞬移，最后找寻自动寻路路线并开始寻路。


core.setAutoHeroMove(steps)
设置勇士的自动行走路线，并立刻开始行走。


core.setHeroMoveInterval(callback)
设置勇士行走动画。callback是每一步行走完毕后的回调。


core.moveOneStep(x, y)
每走完一步后执行的操作，被转发到了脚本编辑中，执行脚本编辑moveOneStep中的内容。


core.moveAction(callback)
尝试执行单步行走。callback是执行完毕的回调。
如果勇士面对的方向是noPass的，将直接触发事件并执行回调。


core.moveHero(direction, callback)
令勇士朝一个方向行走。如果设置了callback，则只会行走一步，并执行回调。
否则，将一直朝该方向行走，直到core.status.heroStop为true为止。
direction可为"up","down","right","left"，分别对应上，下，右，左。


core.isMoving()
当前是否正在处于行走状态


core.waitHeroToStop(callback)
停止勇士的行走，等待行动结束后，再异步执行回调。


core.turnHero(direction)
转向。如果设置了direction则会转到该方向，否则会右转。该函数会自动计入录像。
direction可为"up","down","right","left"，分别对应上，下，右，左。


core.moveDirectly(destX, destY)
尝试瞬间移动到某点，被转发到了脚本编辑中，执行脚本编辑中的内容。
此函数返回非负值代表成功进行瞬移，返回值是省略的步数；如果返回-1则代表没有成功瞬移。


core.tryMoveDirectly(destX, destY)
尝试单击瞬移到某点。
如果该点可被直接瞬间移动到，则直接瞬移到该点；否则尝试瞬移到相邻的上下左右点并行走一步。


core.drawHero(status, offset)
绘制勇士。
status可选，为'stop','leftFoot'和'rightFoot'之一，不填或null默认是'stop'。
offset可选，表示具体当前格子的偏移量。不填默认为0。
此函数将重新计算地图的偏移量，调整窗口位置，绘制勇士和跟随者信息。

// ------ 画布、位置、阻激夹域、显伤 ------ //

core.setGameCanvasTranslate(canvas, x, y)
设置某个画布的偏移量


core.addGameCanvasTranslate(x, y)
加减所有系统画布（ui和data除外）的偏移量。主要是被“画面震动”所使用。


core.updateViewport()
根据大地图的偏移量来更新窗口的视野范围。


core.nextX(n) / core.nextY(n)
获得勇士面对的第n个位置的横纵坐标。n可不填，默认为1。


core.nearHero(x, y, n)
判定某个点是否和勇士的距离不大于n。n可不填，默认为1。


core.gatherFollowers()
聚集所有的跟随者到勇士的位置。


core.updateFollowers()
更新跟随者们的坐标。


core.updateCheckBlock(floorId)
更新阻激夹域的信息，被转发到了脚本编辑中。


core.checkBlock()
检查勇士坐标点的阻激夹域信息。


core.updateDamage(floorId, ctx)
更新全地图的显伤。floorId可选，默认为当前楼层。
ctx可选，为画布；如果不为空，则将会绘制到该画布上而不是damage层上。

// ------ 录像相关 ------ //

core.chooseReplayFile()
弹出选择文件窗口，让用户选择录像文件。


core.startReplay(list)
开始播放一段录像。list为录像的操作数组。


core.triggerReplay()
播放或暂停录像，实际上是pauseReplay或resumeReplay之一。


core.pauseReplay() / core.resumeReplay()
暂停和继续录像播放。


core.speedUpReplay() / core.speedDownReplay()
加速和减速录像播放。


core.setReplaySpeed(speed)
直接设置录像回放速度。


core.stopReplay(force)
停止录像回放。如果force为true则强制停止。


core.rewindReplay()
回退一个录像节点。


core.saveReplay() / core.bookReplay() / core.viewMapReplay()
回放录像时的存档、查看怪物手册、浏览地图操作。


core.isReplaying()
当前是否正在录像播放中。


core.registerReplayAction(name, func)
注册一个自定义的录像行为。
name：自定义名称，可用户注销使用。
func：具体执行录像的函数，是一个函数体或者插件中的函数名。
func需要接受action参数，代表录像回放时的当前操作行为。
如果func返回true，则代表成功处理了此次操作，返回false代表没有进行处理。
自己添加的录像项只能由数字、大小写、下划线线、冒号等符号组成，否则无法正常压缩和解压缩。
对于自定义内容（比如中文文本或数组）请使用JSON.stringify再core.encodeBase64处理。
请注意回放录像时的二次记录问题（即回放时录像会重新记录路线）。


core.unregisterReplayAction(name)
注销一个录像行为。此函数一般不应当被使用。

// ------ 存读档相关 ------ //

core.autosave(remoreLast)
进行一个自动存档，实际上是加入到缓存之中。
removeLast如果为true则会从路线中删除最后一项再存（打怪开门前的状态）。
在事件处理中不允许调用本函数，如有需要请呼出存档页面。


core.checkAutosave()
将缓存的自动存档写入存储中。平均每五秒钟，或在窗口失去焦点时被执行。


core.doSL(id, type)
实际执行一个存读档事件。id为存档编号，自动存档为'autoSave'。
type只能为'save', 'load', 'replayLoad'之一，代表存档、读档和从存档回放录像。


core.syncSave(type) / core.syncLoad()
向服务器同步存档，从服务器加载存档。type如果为'all'则会向服务器同步所有存档。


core.saveData()
获得要存档的内容，实际转发到了脚本编辑中，执行脚本编辑中的内容。


core.loadData(data, callback)
实际执行一次读档行为，data为读取到的数据，callback为执行完毕的回调。
实际转发到了脚本编辑中，执行脚本编辑中的内容。


core.getSave(index, callback)
获得某个存档位的存档。index为存档编号，0代表自动存档。


core.getSaves(ids, callback)
获得若干个存档位的存档。ids为一个存档编号数组，0代表自动存档。


core.getAllSaves(callback)
获得全部的存档内容。目前仅被同步全部存档和下载全部存档所调用。


core.getSaveIndexes(callback)
刷新全部的存档信息，将哪些档位有存档的记录到core.saves.ids中。


core.hasSave(index)
判定某个存档位是否存在存档。index为存档编号，0代表自动存档。


core.removeSave(index)
删除某个存档。index为存档编号，0代表自动存档。


// ------ 属性、状态、位置、变量等 ------ //

core.setStatus(name, value)
设置勇士当前的某个属性，name可为"atk","def","hp"等。
如core.setStatus("atk", 100)则为设置勇士攻击为100。


core.addStatus(name, value)
加减勇士当前的某个属性，name可为"atk","def","hp"等。
如core.addStatus("atk", 100)则为增加勇士攻击100点。
等价于 core.setStatus(name, core.getStatus(name) + value)。


core.getStatus(name)
获得勇士的某个原始属性值，该值不受百分比增幅影响。
譬如你有一件道具加10%的攻击，你可以使用该函数获得你的攻击被增幅前的数值


core.getStatusOrDefault(status, name)
尝试从status中获得某个原始属性值，该值不受百分比增幅影响；如果status为null或不存在对应属性值则从勇士属性中获取。
此项在伤害计算函数中使用较多，例如传递新的攻击和防御来计算临界和1防减伤。


core.getRealStatus(name)
获得勇士的某个计算属性值。该属性值是在加成buff之后得到的。
该函数等价于 core.getStatus(name) * core.getBuff(name)


core.getRealStatusOrDefault(status, name)
尝试从status中获得某个原始属性值再进行增幅，如果不存在则获取勇士本身的计算属性值。


core.setBuff(name, value)
设置勇士的某个属性的增幅值。value为1代表无增幅。


core.addBuff(name, value)
增减勇士的某个属性的增幅值。等价于 core.setBuff(name, core.getBuff(name) + value)


core.getBuff(name)
获得勇士的某个属性的增幅值。默认值是1。


core.setHeroLoc(name, value, noGather)
设置勇士位置属性。name只能为'x'（勇士x坐标）, 'y'（勇士y坐标）和'direction'（勇士朝向）之一。
如果noGather为true，则不会聚集所有的跟随者。
譬如core.setHeroLoc("x", 1, true)则为设置勇士x坐标为1，不聚集所有跟随者。


core.getHeroLoc(name)
获得勇士的某个位置属性。如果name为null则直接返回core.status.hero.loc。
譬如core.getHeroLoc("x")则返回勇士当前x坐标


core.getLvName(lv)
获得某个等级对应的名称，其在全塔属性的levelUp中定义。如果不存在则返回原始数值。


core.setFlag(name, value)
设置某个自定义变量或flag。如果value为null则会调用core.removeFlag进行删除。
这里的变量与事件中使用的变量等价
譬如core.setFlag("xxx",1)则为设置变量xxx为1。


core.addFlag(name, value)
加减某个自定义的变量或flag。等价于 core.setFlag(name, core.getFlag(name, 0) + value)
这里的变量与事件中使用的变量等价
譬如core.addFlag("xxx",1)则为增加变量xxx1


core.getFlag(name, defaultValue)
获得某个自定义的变量或flag。如果该flag不存在（从未赋值过），则返回defaultValue的值。
这里的变量与事件中使用的变量等价
譬如core.getFlag("xxx",1)则为获得变量xxx的值，如变量xxx不存在则返回1


core.hasFlag(name)
判定是否拥有某个自定义变量或flag。等价于 !!core.getFlag(name, 0)
这里的变量与事件中使用的变量等价
譬如core.hasFlag("xxx",1)则为判断变量xxx是否存在

core.removeFlag(name)
删除一个自定义变量或flag。


core.lockControl() / core.unlockControl()
锁定和解锁控制。常常应用于事件处理。


core.debug()
开启调试模式。此模式下可以按住Ctrl进行穿墙。

// ------ 天气，色调，音乐和音效 ------ // 

core.setWeather(type, level)
设置当前的天气。type只能为'rain', 'snow'或'fog'，level为1-10之间代表强度信息。


core.setCurtain(color, time, callback)
更改画面色调。color为更改到的色调，是个三元或四元组；time为渐变时间，0代表立刻切换。
譬如core.setCurtain([255,255,255,1], 0)即为无回调无等待更改画面色调为白色



core.screenFlash(color, time, times, callback)
画面闪烁。color为色调，三元或四元组；time为单次闪烁时间，times为总闪烁次数。


core.playBgm(bgm, startTime)
播放一个bgm。startTime可以控制开始时间，不填默认为0。
如果bgm不存在、不被支持，或当前不允许播放背景音乐，则会跳过。


core.pauseBgm() / core.resumeBgm()
暂停和恢复当前bgm的播放。


core.triggerBgm()
更改当前bgm的播放状态。


core.playSound(sound) / core.stopSound()
播放一个音效，停止全部音效。
如果sound不存在、不被支持，或当前不允许播放音效，则会忽略。


core.checkBgm()
检查bgm的状态。
有的时候，刚打开页面时，浏览器是不允许自动播放标题界面bgm的，一定要经过一次用户操作行为。
这时候我们可以给开始按钮增加core.checkBgm()，如果之前没有成功播放则重新播放。

// ------ 状态栏和工具栏相关 ------ //

core.clearStatusBar()
清空状态栏的数据。


core.updateStatusBar(doNotCheckAutoEvents)
更新状态栏，被转发到了脚本编辑中。此函数还会根据是否在回放来设置工具栏的图标。
如果doNotCheckAutoEvents为true则此时不检查自动事件。

core.showStatusBar() / core.hideStatusBar(showToolbox)
显示和隐藏状态栏。
如果showToolbox为true，则在竖屏模式下不隐藏工具栏，方便手机存读档操作。


core.updateHeroIcon()
更新状态栏上的勇士图标。


core.setToolbarButton(useButtom)
设置工具栏是否是拓展键盘。

// ------ resize 相关 ------ //

core.registerResize(name, func)
注册一个resize函数。
name为自定义名称，可供注销使用。
func可以是一个函数，或插件中的函数名，可以接受一个obj作为参数。
具体详见resize函数。


core.unregisterResize(name)
注销一个resize函数。


core.resize()
屏幕分辨率改变后的重新自适应。
此函数将根据当前的屏幕分辨率信息，生成一个obj，并传入各个注册好的resize函数中执行。
```

## enemys.js

enemys.js中定义了一系列和怪物相关的API函数。

```text
core.hasSpecial(special, test)
判断是否含有某个特殊属性。test为要检查的特殊属性编号。
special为要测试的内容，允许接收如下类型参数：
 - 一个数字：将直接和test进行判等。
 - 一个数组：将检查test是否在该数组之中存在。
 - 一个怪物信息：将检查test是否在该怪物的特殊属性中存在
 - 一个字符串：视为怪物ID，将检查该怪物的特殊属性


core.getSpecials()
获得所有特殊属性的列表。实际上被转发到了脚本编辑中，执行脚本编辑中的内容。


core.getSpecialText(enemy)
获得某个怪物的全部特殊属性名称。enemy可以是怪物信息或怪物ID。
将返回一个数组，每一项是该怪物所拥有的一个特殊属性的名称。


core.getSpecialHint(enemy, special)
获得怪物的某个特殊属性的描述。enemy可以是怪物信息或怪物ID，special为该特殊属性编号。


core.canBattle(enemy, x, y, floorId)
判定当前能否战胜某个怪物。
enemy可以是怪物信息或怪物ID，x,y,floorId为当前坐标和楼层。（下同）
能战胜返回true，不能战胜返回false。


core.getDamage(enemy, x, y, floorId)
获得某个怪物的全部伤害值。
如果没有破防或无法战斗则返回null，否则返回具体的伤害值。


core.getDamageString(enemy, x, y, floorId)
获得某个怪物伤害字符串和颜色信息，以便于在地图上绘制显伤。


core.nextCriticals(enemy, number, x, y, floorId)
获得接下来的N个临界值和临界减伤。enemy可以是怪物信息或怪物ID，x,y,floorId为当前坐标和楼层。
number为要计算的临界值数量，不填默认为1。
如果全塔属性中的useLoop开关被开启，则将使用循环法或二分法计算临界，否则使用回合法计算临界。
返回一个二维数组 [[x1,y1],[x2,y2],...] 表示接下来的每个临界值和减伤值。


core.getDefDamage(enemy, k, x, y, floorId)
获得某个怪物的k防减伤值。k可不填默认为1，x,y,floorId为当前xy坐标和楼层。


core.getEnemyInfo(enemy, hero, x, y, floorId)
获得某个怪物的实际计算时的属性。该函数实际被转发到了脚本编辑中。
hero可为null或一个对象，具体将使用core.getRealStatusOrDefault(hero, "atk")来获得攻击力数值。
该函数应当返回一个对象，记录了怪物的实际计算时的属性。


core.getDamageInfo(enemy, hero, x, y, floorId)
获得某个怪物的战斗信息。该函数实际被转发到了脚本编辑中。
hero可为null或一个对象，具体将使用core.getRealStatusOrDefault(hero, "atk")来获得攻击力数值。
如果该函数返回null，则代表不可战斗（如没有破防，或无敌等）。
否则，该函数应该返回一个对象，记录了战斗伤害信息，如战斗回合数等。
从V2.5.5开始，该函数也允许直接返回一个数字，代表战斗伤害值，此时回合数将视为0。


core.getCurrentEnemys(floorId)
获得某个楼层不重复的怪物信息，floorId不填默认为当前楼层。该函数会被怪物手册所调用。
该函数将返回一个列表，每一项都是一个不同的怪物，按照伤害值从小到大排序。
另外值得注意的是，如果设置了某个怪物的displayIdInBook，则会返回对应的怪物。


core.hasEnemyLeft(enemyId, floorId)
检查某个楼层是否还有剩余的（指定）怪物。
floorId为楼层ID，可忽略表示当前楼层。也可以填数组如["MT0","MT1"]同时检测多个楼层。
enemyId如果不填或null则检查是否剩余任何怪物，否则只检查是否剩余指定的某类怪物。
```

## events.js

events.js将处理所有和事件相关的操作，主要分为五个部分：
- 游戏的开始和结束
- 系统事件的处理
- 自定义事件的处理
- 点击状态栏图标所进行的操作
- 一些具体事件的执行内容


```text
// ------ 游戏的开始和结束 ------ //

core.resetGame(hero, hard, floorId, maps, values)
重置整个游戏。该函数实际被转发到了脚本编辑中。


core.startGame(hard, seed, route, callback)
开始新游戏。
hard为难度字符串，会被设置为core.status.hard。
seed为开始时要设置的的种子，route为要开始播放的录像，callback为回调函数。
该函数将重置整个游戏，执行startText事件，上传游戏人数统计信息等。


core.win(reason, norank)
游戏胜利，reason为结局名，norank如果为真则该结局不计入榜单。
该函数实际被转发到了脚本编辑中，执行脚本编辑中的内容。


core.lose(reason)
游戏失败，reason为结局名。该函数实际被转发到了脚本编辑中，执行脚本编辑中的内容。


core.gameOver(ending, fromReplay, norank)
游戏结束。ending为获胜结局名，null代表失败；fromReplay标识是否是录像触发的。
此函数将询问是否上传成绩（如果ending不是null），是否下载录像等，并重新开始。


core.restart()
重新开始游戏。本质上就是播放标题界面的BGM并调用showStartAnimate。


core.confirmRestart()
确认用户是否需要重新开始。

// ------ 系统事件处理 ------ //

core.registerSystemEvent(type, func)
注册一个系统事件，即通过图块的默认触发器所触发的事件。
type为一个要注册的事件类型，func为要执行的函数体或插件中的函数名。
func需要接受(data, callback)作为参数，分别是触发点的图块信息，和执行完毕时的回调。
如果注册一个已经存在的系统事件，比如openDoor，则会覆盖系统的默认函数。


core.unregisterSystemEvent(type)
注销一个系统事件。type是上面你注册的事件类型。


core.doSystemEvent(type, data, callback)
执行一个系统事件。type为事件类型，data为该事件点的图块信息，callback为执行完毕的回调。


core.battle(id, x, y, force, callback)
和怪物进行战斗。
id为怪物的ID，x和y为怪物坐标，force如果为真将强制战斗，callback为执行完毕的回调。
如果填写了怪物坐标，则会删除对应点的图块并执行该点战后事件。
如果是在事件流的执行过程中调用此函数，则不会进行自动存档，且会强制战斗。


core.beforeBattle(enemyId, x, y)
战前事件。实际被转发到了脚本编辑中，执行脚本编辑中的内容，可以用于加上一些战前特效。
此函数在“检测能否战斗和自动存档”【之后】执行。
如果需要更早的战前事件，请在插件中覆重写 core.events.doSystemEvent 函数。
此函数返回true则将继续本次战斗，返回false将不再战斗。


core.afterBattle(enemyId, x, y, callback)
战后事件，将执行扣血、加金币经验、特殊属性处理、战后事件处理等操作。
实际被转发到了脚本编辑中，执行脚本编辑中的内容。


core.openDoor(x, y, needKey, callback)
尝试开一个门。x和y为门的坐标，needKey表示是否需要钥匙，callback为执行完毕的回调。
如果不是一个有效的门，需要钥匙且未持有等，均会忽略此事件并直接执行callback。


core.afterOpenDoor(doorId, x, y, callback)
开完一个门后执行的事件，实际被转发到了脚本编辑中，执行脚本编辑中的内容。


core.getItem(id, num, x, y, callback)
获得若干个道具。itemId为道具ID，itemNum为获得的道具个数，不填默认为1。
x和y为道具点的坐标，如果设置则会擦除地图上的该点，也可不填。
譬如core.getItem("yellowKey",2)会直接获得两把黄钥匙。


core.afterGetItem(id, x, y, callback)
获得一个道具后执行的事件，实际被转发到了脚本编辑中，执行脚本编辑中的内容。


core.getNextItem(noRoute)
轻按，即获得面对的道具。如果noRoute为真则这个轻按行为不会计入录像。


core.changeFloor(floorId, stair, heroLoc, time, callback, fromLoad)
楼层切换。floorId为目标楼层ID，stair为是什么楼梯，heroLoc为目标点坐标。
time为切换时间，callback为切换完毕的回调，fromLoad标志是否是从读档造成的切换。
floorId也可以填":before"和":next"表示前一层和后一层。
heroLoc为{"x": 0, "y": 0, "direction": "up"}的形式。不存在则从勇士位置取。
如果stair不为null，则会在该楼层中找对应的图块作为目标点的坐标并覆盖heroLoc。
一般设置的是"upFloor"和"downFloor"，但也可以用任何其他的图块ID。


core.changingFloor(floorId, heroLoc, fromLoad)
正在执行楼层切换中执行的操作，实际被转发到了脚本编辑中。


core.hasVisitedFloor(floorId)
是否曾经到达过某一层。


core.visitFloor(floorId)
标记曾经到达了某一层。


core.passNet(data)
执行一个路障处理。这里只有毒衰咒网的处理，血网被移动到了updateCheckBlock中。


core.pushBox(data)
执行一个推箱子事件。


core.afterPushBox()
推箱子之后触发的事件，实际被转发到了脚本编辑中，执行脚本编辑中的内容。


core.changeLight(id, x, y)
踩灯后的事件。

// ------ 自定义事件的处理 ------ //

core.registerEvent(type, func)
注册一个自定义事件。type为事件名，func为执行事件的函数体或插件中的函数名。
func可以接受(data, x, y, prefix)参数，其中data为事件内容，x和y为该点坐标，prefix为该点前缀。
同名注册的事件将进行覆盖。
请记得在自定义处理事件完毕后调用core.doAction()再继续执行下一个事件！


core.unregisterEvent(type)
注销一个自定义事件。


core.doEvent(data, x, y, prefix)
执行一个自定义事件。data为事件内容，将根据data.type去注册的事件列表中查找对应的执行函数。
x和y为该点坐标，prefix为该点前缀。执行事件时也会把(data, x, y, prefix)传入执行函数。


core.setEvents(list, x, y, callback)
设置自定义事件的执行列表，坐标和回调函数。


core.startEvents(list, x, y, callback)
开始执行一系列的自定义事件。list为事件列表，x和y为事件坐标，callback为执行完毕的回调。
此函数将调用core.setEvents，然后停止勇士，再执行core.doAction()。


core.doAction(keepUI)
执行下一个自定义事件。
此函数将检测事件列表是否全部执行完毕，如果是则执行回调函数。
否则，将从事件列表中弹出下一个事件，并调用core.doEvent进行执行。
如果keepUI为true，则不会清掉UI层和selector，适合于自己用脚本的绘制。


core.insertAction(action, x, y, callback, addToLast)
向当前的事件列表中插入一个或多个事件并执行。
如果当前并不是在事件执行流中，则会调用core.startEvents()开始执行事件，否则仅仅执行插入操作。
action为要插入的事件，可以是一个单独的事件，或者是一个事件列表。
x,y,callback如果设置了且不为null，则会覆盖当前的坐标和回调函数。
addToLast如果为真，则会插入到事件执行列表的尾部，否则是插入到执行列表的头部。


core.getCommonEvent(name)
根据名称获得某个公共事件内容。


core.recoverEvents(data)
恢复事件现场。一般用于呼出怪物手册、呼出存读档页面等时，恢复事件执行流。


core.checkAutoEvents()
检测自动事件并执行。


core.precompile(events)
尝试预编译一段事件。


// ------ 点击状态栏图标时执行的一些操作 ------ //

core.openBook(fromUserAction)
尝试打开怪物手册。fromUserAction标志是否是从用户的行为触发，如按键或点击状态栏。（下同）
不建议复写此函数，否则【呼出怪物手册】事件会出问题。


core.useFly(fromUserAction)
尝试使用楼传器。可以安全的复写此函数，参见文档-个性化-覆盖楼传事件。


core.flyTo(toId, callback)
尝试飞行到某个楼层，被转发到了脚本编辑中。
如果此函数返回true代表成功进行了飞行，false代表不能进行飞行。


core.openEquipbox(fromUserAction) / core.openToolbox(fromUserAction)
尝试打开道具栏和装备栏。可以安全复写这两个函数。


core.openQuickShop(fromUserAction) / core.openKeyBoard(fromUserAction)
尝试打开快捷商店和虚拟键盘。可以安全复写这两个函数。


core.save(fromUserAction) / core.load(fromUserAction)
尝试打开存读档页面。
不建议复写这两个函数，否则【呼出存读档页面】事件会出问题。


core.openSettings(fromUserAction)
尝试打开系统菜单。不建议复写此函数。


// ------ 一些具体事件的执行内容 ------ //

core.hasAsync()
当前是否存在未执行完毕的异步事件。请注意正在播放的动画也算异步事件。


core.follow(name) / core.unfollow(name)
跟随勇士/取消跟随。name为行走图名称。
在取消跟随时如果指定了name，则会从跟随列表中选取一个该行走图取消，否则取消所有跟随。
跟随和取消跟随都会调用core.gatherFollowers()来聚集所有的跟随者。


core.setValue(name, operator, value, prefix) / core.addValue(name, value, prefix)
设置/增减某个数值。name可以是status:xxx，item:xxx或flag:xxx。
value可以是一个表达式，将调用core.calValue()计算。prefix为前缀，独立开关使用，脚本中一般忽略。


core.doEffect(effect, need, times)
执行一个effect操作。该函数目前仅被全局商店的status:xxx+=yyy所调用。


core.setEnemy(id, name, value, prefix)
设置一个怪物属性。id为怪物的ID，name为要设置的项，比如hp,atk,def等等。
value可以是一个表达式，将调用core.calValue()计算。prefix为前缀，独立开关使用，脚本中一般忽略。


core.setFloorInfo(name, values, floorId, prefix)
设置某层楼的楼层属性，其中name为该楼层属性对应的条目，values为要设置的值，floorId为楼层id，prefix一般直接忽略。
譬如core.setFloorInfo("name","4", "MT1")则为设置MT1显示在状态栏中的层数为4


core.setGlobalAttribute(name, value)
设置一个全局属性，如边框颜色等。


core.setGlobalFlag(name, value)
设置一个全局开关，如enableXXX等。
如果需要设置一个全局数值如红宝石数值，可以直接简单的修改core.values，因此没有单独列出函数。


core.closeDoor(x, y, id, callback)
执行一个关门事件。如果不是一个合法的门，或者该点不为空地，则会忽略本事件。


core.showImage(code, image, sloc, loc, opacityVal, time, callback)
显示一张图片。code为图片编号，image为图片内容或图片名。
sloc为[x,y,w,h]形式，表示在原始图片上裁剪的区域，也可直接设为null表示整张图片。
loc为[x,y,w,h]形式，表示在界面上绘制的位置和大小，w和h可忽略表示使用绘制大小。
opacityVal为绘制的不透明度，time为淡入时间。
此函数将创建一个画布，其z-index是100+code，即图片编号为1则是101，编号50则是150。
请注意，curtain层的z-index是125，UI层的z-index是140；因此可以通过图片编号来调整覆盖关系。


core.hideImage(code, time, callback)
隐藏一张图片。code为图片编号，time为淡出时间。


core.moveImage(code, to, opacityVal, time, callback)
移动一张图片。code为图片编号，to为[x,y]表示目标位置，opacityVal目标不透明度，time为移动时间。


core.showGif(name, x, y)
绘制一张gif图片或取消所有绘制内容。如果name不设置则视为取消。x和y为左上角像素坐标。


core.setVolume(value, time, callback)
设置音量。value为目标音量大小，在0到1之间。time为音量渐变的时间。


core.vibrate(time, callback)
画面震动。time为震动时间。
请注意，画面震动时间必须是500的倍数，系统也会自动把time调整为上整的500倍数值。


core.eventMoveHero(steps, time, callback)
使用事件移动勇士。time为每步的移动时间。
steps为移动数组，可以接受'up','down','left','right','forward'和'backward'项。
使用事件移动勇士将不会触发任何地图上的事件。


core.jumpHero(ex, ey, time, callback)
跳跃勇士。ex和ey为目标点的坐标，可以为null表示原地跳跃。time为总跳跃时间。


core.openShop(shopId, needVisited)
打开一个全局商店。needVisited表示是否需要该商店原本就是启用状态。
如果该商店对应的实际上是一个全局事件，则会直接插入并执行。


core.disableQuickShop(shopId)
禁用一个全局商店，即把一个商店从启用变成禁用状态。


core.canUseQuickShop(shopId)
当前能否使用某个全局商店，实际被转发到了脚本编辑中。
如果此函数返回null则表示可以使用，返回一个字符串表示不可以，该字符串表示不可以的原因。


core.setHeroIcon(name, noDraw)
设置勇士的行走图。
name为行走图名称，noDraw如果为真则不会调用core.drawHero()函数进行刷新。


core.checkLvUp()
检查升级事件。该函数将判定当前是否升级（或连续升级），然后执行升级事件。


core.tryUseItem(itemId)
尝试使用一个道具。
对于怪物手册和楼传器，将分别调用core.openBook()和core.useFly()函数。
对于中心对称飞行器，则会调用core.drawCenterFly()函数。
对于其他的道具，将检查是否拥有，能否使用，并且进行使用。
```

## icons.js

icons.js主要是负责素材相关信息，比如某个素材在对应的图片上的位置。

```text
core.getClsFromId(id)
根据某个素材的ID获得该素材的cls


core.getTilesetOffset(id)
根据某个素材来获得对应的tileset和坐标信息。
如果该素材不是tileset，则返回null。
```

## items.js

items.js主要负责一切和道具相关的内容。

```text
core.getItemEffect(itemId, itemNum)
即捡即用类的道具获得时的效果。实际对应道具图块属性中的itemEffect框。


core.getItemEffectTip(itemId)
即捡即用类的道具获得时的额外提示，比如“，攻击+100”。
实际对应道具图块属性中的itemEffectTip框。


core.useItem(itemId, noRoute, callback)
尝试使用一个道具。实际对应道具图块属性中的useItemEffect框。
此函数也会调用一遍core.canUseItem()，如果无法使用将直接返回。
noRoute如果为真，则这次使用道具的过程不会被计入录像。
使用道具完毕后，对于消耗道具将自动扣除，永久道具不会扣除。


core.canUseItem(itemId)
当前能否使用某个道具。
有些系统道具如破炸和上下楼器等，会在计算出目标点的坐标后存入core.status.event.ui。
使用道具时将直接从core.status.event.ui调用，不会重新计算。


core.itemCount(itemId)
获得某个道具的个数。


core.hasItem(itemId)
当前是否拥有某个道具。等价于 core.itemCount(itemId) > 0
请注意，装备上的装备不视为拥有该道具，即core.hasEquip()和core.hasItem()是完全不同的。


core.hasEquip(itemId)
当前是否装备上某个装备。
请注意，装备上的装备不视为拥有该道具，即core.hasEquip()和core.hasItem()是完全不同的。


core.getEquip(equipType)
获得某个装备位的当前装备。equipType为装备类型，从0开始。
如果该装备位没有装备则返回null，否则返回当前装备的ID。


core.setItem(itemId, itemNum)
设置某个道具的个数。


core.addItem(itemId, itemNum)
增减某个道具的个数，itemNum可不填默认为1。


core.getEquipTypeByName(name)
根据装备位名称来找到一个空的装备孔，适用于多重装备，装备位名称可在全塔属性中设置。
如果没有一个装备孔是该装备名称，则返回-1。
譬如：core.getEquipTypeByName("武器")默认返回全塔属性中武器对应的装备孔号0。


core.getEquipTypeById(equipId)
获得某个装备的装备类型。
如果其type写的是装备名（多重装备），则调用core.getEquipTypeByName()函数。


core.canEquip(equipId, hint)
当前能否穿上某个装备。如果hint为真，则不可装备时会气泡提示原因。


core.loadEquip(equipId, callback)
穿上某个装备，equipId为装备id。


core.unloadEquip(equipType, callback)
脱下某个装备孔的装备。
譬如core.unloadEquip(0)则为脱下0号装备孔中的装备，默认0号装备孔对应“武器”，1号装备孔对应“盾牌”


core.compareEquipment(compareEquipId, beComparedEquipId)
比较两个套装的差异。
此函数将对所有的勇士属性包括生命魔力攻防护盾金币等进行比较。
如果存在差异的，将作为一个对象返回其差异内容。


core.quickSaveEquip(index)
保存当前套装。index为保存的套装编号。


core.quickLoadEquip()
读取当前套装。index为读取的套装编号。


core.getEquippedStatus(name)
获得装备直接增加的属性数据。
```

## loader.js

loader.js主要负责资源加载相关的内容。

```text
core.loadImage(imgName, callback)
从 project/images/ 中加载一张图片。imgName为图片名。
callback为执行完毕的回调函数，接收(imgName, image)即图片名和图片内容作为参数。
如果图片不存在或加载失败则会在控制台打出一条错误日志，不会执行回调。


core.loadImages(names, toSave, callback)
从 project/images/ 中加载若干张图片。
names为一个图片名的列表，toSave为加载并存到的对象。
callback为全部加载完毕执行的回调。


core.loadOneMusic(name)
从 project/sounds/ 或第三方中加载一个音乐，并存入core.material.bgms中。name为音乐名。


core.loadOneSound(name)
从 project/sounds/ 中加载一个音效，并存入core.material.sounds中。name为音效名。


core.loadBgm(name)
预加载一个bgm并加入缓存列表core.musicStatus.cachedBgms。
此函数将会检查bgm的缓存，预加载和静音播放。
如果缓存列表溢出(core.musicStatus.cacheBgmCount)则通过LRU算法选择一个bgm并调用core.freeBgm()。


core.freeBgm(name)
释放一个bgm的内存并移出缓存列表。如果该bgm正在播放则也会立刻停止。
```

## map.js

maps.js负责一切和地图相关的处理内容，包括如下几个方面：
- 地图的初始化，保存和读取，地图数组的生成
- 是否可移动或瞬间移动的判定
- 地图的绘制
- 获得某个点的图块信息
- 启用和禁用图块，改变图块
- 移动/跳跃图块，淡入淡出图块
- 全局动画控制，动画的绘制

```text
// ------ 地图的初始化，保存和读取，地图数组的生成 ------ //

core.loadFloor(floorId, map)
从楼层或者存档中生成core.status.maps的内容。
map为存档信息，如果某项在map中不存在则会从core.floors中读取。


core.getNumberById(id)
给定一个图块ID，找到图块对应的图块编号。


core.initBlock(x, y, id, addInfo, eventFloor)
给定一个数字，初始化一个图块信息。
x和y为坐标，id为数字或者可以:t或:f结尾表示初始是启用还是禁用状态。
addInfo如果为true则会填充上图块的默认信息，比如给怪物添加battle触发器。
eventFloor如果设置为某个楼层信息，则会填充上该点的自定义或楼层切换事件。


core.compressMap(mapArr, floorId)
压缩地图。mapArr为要压缩的二维数组，floorId为对应的楼层。
此函数将把mapArr和对应的楼层中的数组进行比较，并只取差异值进行存储。
通过这种压缩地图的方式，不仅节省了存档空间，还支持了任意修改地图的接档。


core.decompressMap(mapArr, floorId)
解压缩地图。mapArr为压缩后的地图，floorId为对应的楼层。
此函数返回解压后的二维数组。


core.saveMap(floorId)
将某层楼的数据生成存档所保存的内容。在core.saveData()中被调用。


core.loadMap(data, floorId)
从data中读取楼层数据，并调用core.loadFloor()进行初始化。


core.removeMaps(fromId, toId)
删除某个区域的地图。调用此函数后，这些楼层将不可飞，不可被浏览地图，也不计入存档。
fromId和toId为要删除的起终点楼层ID；toId也可以不填代表只删除某一层。
此函数适用于高层塔的砍层，例如每100层一个区域且互相独立，不可再返回的情况。


core.resizeMap(floorId)
根据某层楼的地图大小来调整大地图的画布大小。floorId可为null表示当前层。


core.getMapArray(floorId, showDisable)
生成某层楼的二维数组。floorId可不填代表当前楼层。
showDisable若为真，则对于禁用的点会加上:f表示，否则视为0。


core.getMapBlocksObj(floorId, showDisable)
以x,y的形式返回每个点的图块信息。floorId可不填表示当前楼层。
此函数将返回 {"0,0": {...}, "0,1": {...}} 这样的结构，其中内部为对应点的block信息。


core.getBgMapArray(floorId, noCache)
获得某层楼的背景层的二维数组。floorId可不填表示当前楼层。
如果noCache为真则重新从剧本中读取而不使用缓存数据。


core.getFgMapArray(floorId, noCache)
获得某层楼的前景层的二维数组。floorId可不填表示当前楼层。
如果noCache为真则重新从剧本中读取而不使用缓存数据。


core.getBgNumber(x, y, floorId, noCache)
获得某层楼的背景层中某个点的数字。floorId可不填表示当前楼层。
如果noCache为真则重新从剧本中读取而不使用缓存数据。
本函数实际等价于 core.getBgMapArray(floorId, noCache)[y][x]


core.getBgNumber(x, y, floorId, noCache)
获得某层楼的前景层中某个点的数字。参数和方法同上。

// ------ 是否可移动或瞬间移动的判定 ------ //

core.generateMovableArray(floorId, x, y, direction)
生成全图或某个点的可通行方向数组。floorId为楼层Id，可不填默认为当前点。
这里的可通行方向数组，指的是["up","down","left","right"]中的一个或多个组成的数组。
 - 如果不设置x和y，则会返回一个三维数组，其中每个点都是一个该点可通行方向的数组。
 - 如果设置了x和y但没有设置direction，则只会返回该点的可通行方向数组，
 - 如果设置了x和y以及direction，则会判定direction是否在该点可通行方向数组中，并返回true或false。
可以使用core.inArray()来判定某个方向是否在可通行方向数组中。


core.canMoveHero(x, y, direction, floorId)
某个点是否可朝某个方向移动。x和y可选，不填或为null则默认为勇士当前点。
direction可选，不填或为null则默认勇士当前朝向。floorId不填则默认为当前楼层。
此函数将直接调用 core.generateMovableArray() 进行判定。


core.canMoveDirectly(destX, destY)
当前能否瞬间移动到某个点。
如果可以瞬移则返回非负数，其值为该次瞬移所少走的步数；如果不能瞬移则返回-1。


core.automaticRoute(destX, destY)
找寻到目标点的一条自动寻路路径。

// ------ 绘制地图相关 ------ //

core.drawBlock(block, animate)
重新绘制一个图块，block为图块信息。
如果animate不为null则代表是通过全局动画的绘制，其值为当前的帧数。


core.generateGroundPattern(floorId)
生成某个楼层的地板信息。floorId不填默认为当前楼层。
该函数可被怪物手册、对话框帧动画等地方使用。


core.drawMap(floorId, callback)
绘制某层楼的地图。floorId为目标楼层ID，可不填表示当前楼层。
此函数会将core.status.floorId设置为floorId，并设置core.status.thisMap。
将依次调用core.drawBg(), core.drawEvents()和core.drawFg()函数，最后绘制勇士和更新地图显伤。


core.drawBg(floorId, ctx)
绘制背景层。floorId为目标楼层ID，可不填表示当前楼层。
如果ctx不为null，则背景层将绘制在该画布上而不是bg层上（drawThumbnail使用）。
可以通过复写该函数，调整_drawFloorImages和_drawBgFgMap的顺序来调整背景图块和贴图的遮挡顺序。


core.drawEvents(floorId, blocks, ctx)
绘制事件层。floorId为目标楼层ID，可不填表示当前楼层。
block表示要绘制的图块列表，可不填使用当前楼层的图块列表。
如果ctx不为null，则背景层将绘制在该画布上而不是event层上（drawThumbnail使用）。


core.drawFg(floorId, ctx)
绘制前景层。floorId为目标楼层ID，可不填表示当前楼层。
如果ctx不为null，则背景层将绘制在该画布上而不是fg层上（drawThumbnail使用）。
可以通过复写该函数，调整_drawFloorImages和_drawBgFgMap的顺序来调整前景图块和贴图的遮挡顺序。


core.drawThumbnail(floorId, blocks, options, toDraw)
绘制一个楼层的缩略图。floorId为目标楼层ID，可不填表示当前楼层。
block表示要绘制的图块列表，可不填使用当前楼层的图块列表。
options为绘制选项（可为null），包括：
    heroLoc: 勇士位置；heroIcon：勇士图标（默认当前勇士）；damage：是否绘制显伤；
    flags：当前的flags（在存读档时使用）
toDraw为要绘制到的信息（可为null，或为一个画布名），包括：
    ctx：要绘制到的画布（名）；x,y：起点横纵坐标（默认0）；size：绘制大小（默认416/480）；
    all：是否绘制全图（默认false）；centerX,centerY：截取中心（默认为地图正中心）

// ------ 获得某个点的图块信息 ------ //

core.noPass(x, y, floorId)
判定某个点是否有noPass（不可通行）的图块。


core.npcExists(x, y, floorId)
判定某个点是否有NPC的存在。


core.terrainExists(x, y, id, floorId)
判定某个点是否有（id对应的）地形存在。
如果id为null，则只要存在terrains即为真，否则还会判定对应点的ID。


core.stairExists(x, y, floorId)
判定某个点是否存在楼梯。


core.nearStair()
判定当前勇士是否在楼梯上或旁边（距离不超过1）。


core.enemyExists(x, y, id, floorId)
判定某个点是否有（id对应的）怪物存在。
如果id为null，则只要存在怪物即为真，否则还会判定对应点的怪物ID。
请注意，如果需要判定某个楼层是否存在怪物请使用core.hasEnemyLeft()函数。


core.getBlock(x, y, floorId, showDisable)
获得某个点的当前图块信息。x和y为坐标；floorId为楼层ID，可忽略或null表示当前楼层。
showDisable如果为true，则对于禁用的点和事件也会进行返回。
如果该点不存在图块，则返回null。
否则，返回值如下： {"index": xxx, "block": xxx}
其中index为该点在该楼层blocks数组中的索引，block为该图块实际内容。


core.getBlockId(x, y, floorId, showDisable)
获得某个点的图块ID。如果该点不存在图块则返回null。


core.getBlockCls(x, y, floorId, showDisable)
获得某个点的图块类型。如果该点不存在图块则返回null。


core.getBlockInfo(block)
根据某个的图块信息获得其详细的素材信息。
如果参数block为字符串，则视为图块ID；如果参数为数字，则视为图块的数字。
此函数将返回一个非常详尽的素材信息，目前包括如下几项：
number：素材数字；id：素材id；cls：素材类型；image：素材所在的素材图片；animate：素材的帧数。
posX, posY：素材在该素材图片上的位置；height：素材的高度；faceIds：NPC朝向记录。


core.searchBlock(id, floorId, showDisable)
搜索一个图块出现过的所有位置。id为图块ID，也可以传入图块的数字。
id支持通配符搜索，比如"*Door"可以搜索所有的门，"unknownEvent*"可以所有所有的unknownEvent。
floorId为要搜索的楼层，可以是一个楼层ID，或者一个楼层数组。如果floorId不填则只搜索当前楼层。
showDisable如果为真，则对于禁用的图块也会返回。
此函数将返回一个数组，每一项为一个搜索到的结果：
{"floorId": ..., "index": ..., "block": {...}, "x": ..., "y": ...}
即包含该图块所在的楼层ID，在该楼层的blocks数组的索引，图块内容，和横纵坐标。


// ------ 启用和禁用图块，改变图块 ------ //

core.showBlock(x, y, floorId)
将某个点从禁用变成启用状态。floorId可不填或null表示当前楼层。


core.hideBlock(x, y, floorId)
将某个点从启用变成禁用状态，但不会对其进行删除。floorId可不填或null表示当前楼层。
此函数不会实际将该块从地图中进行删除，而是将该点设置为禁用，以供以后可能的启用事件。


core.removeBlock(x, y, floorId)
将从启用变成禁用状态，并尽可能将其从地图上删除。
和hideBlock相比，如果该点不存在自定义事件（比如门或普通的怪物），则将直接从地图中删除。
如果存在自定义事件，则简单的禁用它，以供以后可能的启用事件。


core.removeBlockByIndex(index, floorId)
每个楼层的图块存成一个数组，index即为该数组中的索引，每个索引对应该地图中的一个图块
根据索引从地图的block数组中尽可能删除一个图块。floorId可不填或null表示当前楼层。


core.removeBlockByIndexes(indexes, floorId)
indexes为由索引组成的数组，如[0,1]等
根据索引数组从地图的block数组中尽可能删除一系列图块。floorId可不填或null表示当前楼层。


core.canRemoveBlock(block, floorId)
block为图块信息，可由core.getBlock获取
判定当前能否完全删除某个图块。floorId可不填或null表示当前楼层。
如果该点存在自定义事件，或者是重生怪，则不可进行删除。


core.showBgFgMap(name, loc, floorId, callback)
显示某层楼中某个背景/前景层的图块。name只能为'bg'或'fg'表示背景或前景层。
loc为该点坐标，floorId可不填默认为当前楼层。callback为执行完毕的回调。


core.hideBgFgMap(name, loc, floorId, callback)
隐藏某层楼中某个背景/前景层的图块。name只能为'bg'或'fg'表示背景或前景层。
loc为该点坐标，floorId可不填默认为当前楼层。callback为执行完毕的回调。


core.showFloorImage(loc, floorId, callback)
显示某层楼中的某个楼层贴图。loc为该贴图的左上角坐标。floorId可省略表示当前楼层。


core.hideFloorImage(loc, floorId, callback)
隐藏某层楼中的某个楼层贴图。loc为该贴图的左上角坐标。floorId可省略表示当前楼层。


core.setBlock(number, x, y, floorId)
改变某个楼层的某个图块。
number为要改变到的数字，也可以传入图块id（将调用core.getNumberById()来获得数字）。
x,y和floorId为目标点坐标和楼层，可忽略为当前点和当前楼层。


core.replaceBlock(fromNumber, toNumber, floorId)
将某个或某些楼层中的所有某个图块替换成另一个图块
fromNumber和toNumber为要被替换和替换到的数字。
floorId可为某个楼层ID，或者一个楼层数组；如果不填只视为当前楼层。
值得注意的是，使用此函数转了的点上的自定义事件可能无法被执行。
如有需要，再对那些存在事件的点执行core.setBlock()即可


core.setBgFgBlock(name, number, x, y, floorId)
设置前景/背景层的某个图块。name只能为'bg'或'fg'表示前景或背景层。
number为要设置到的图块数字，x,y和floorId为目标点坐标和楼层，可忽略为当前点和当前楼层。


core.resetMap(floorId)
重置某层或若干层的地图和楼层属性。
floorId可为某个楼层ID，或者一个楼层数组如["MT1","MT2"]（同时重置若干层）；如果不填则只重置当前楼层。

// ------ 移动/跳跃图块，淡入淡出图块 ------ //

core.moveBlock(x, y, steps, time, keep, callback)
移动一个图块，x和y为图块的坐标。
steps为移动的数组，每一项只能是"up","down","left","right"之一。
time为每一步的移动时间，不填默认为500ms。
如果keep为真，则在移动完毕后将自动调用一个setBlock事件，改变目标点的图块（即不消失），
否则会按照time时间来淡出消失。callback会执行完毕后的回调。


core.jumpBlock(sx, sy, ex, ey, time, keep, callback)
跳跃一个图块，sx和sy为图块的坐标，ex和ey为目标坐标。time为整个跳跃过程中的全程用时，不填默认500。
如果keep为真，则在移动完毕后将自动调用一个setBlock事件，改变目标点的图块（即不消失），
否则会按照time时间来淡出消失。callback会执行完毕后的回调。


core.animateBlock(loc, type, time, callback)
淡入/淡出一个或多个图块。
loc为一个图块坐标，或者一个二维数组表示一系列图块坐标（将同时显示和隐藏）。
type只能为'show'或'hide'表示是淡入但是淡出。time为动画时间，callback为执行完毕的回调。

// ------ 全局动画控制，动画的绘制 ------ //

core.addGlobalAnimate(block)
添加一个全局帧动画。


core.removeGlobalAnimate(x, y, name)
删除一个或全部的全局帧动画。name可为'bg',null或'fg'表示某个图层。
x和y如果为null，则会删除全部的全局帧动画，否则只会删除该点的该层的帧动画。


core.drawBoxAnimate()
绘制UI层的box动画，如怪物手册和对话框中的帧动画等。


core.drawAnimate(name, x, y, alignWindow, callback)
绘制一个动画。name为动画名，x和y为绘制的基准坐标，callback为绘制完毕的回调函数。
此函数将播放动画音效，并异步开始绘制该动画。
此函数会返回一个动画id，可以通过core.stopAnimate()立刻停止该动画的播放。


core.drawHeroAnimate(name, callback)
绘制一个跟随勇士行动的动画。name为动画名，callback为绘制完毕的回调函数。
此函数将播放动画音效，并异步开始绘制该动画。
此函数会返回一个动画id，可以通过core.stopAnimate()立刻停止该动画的播放。


core.stopAnimate(id, doCallback)
立刻停止某个动画的播放。id为上面core.drawAnimate的返回值。
如果doCallback为真，则会执行该动画所对应的回调函数。
```

## ui.js

ui.js负责一切UI界面的绘制。主要包括三个部分：
- 设置某个画布的属性的相关API
- 具体的某个UI界面的绘制
- 动态创建画布相关的API

```text
// ------ 设置某个画布的属性的相关API ------//
这系列函数的name一般都是画布名，可以是系统画布或动态创建的画布。
但也同时也允许直接传画布的context本身，将返回自身。


core.getContextByName(name)
根据画布名找到一个画布的context；支持系统画布和自定义画布。
如果不存在画布此函数返回null。
该参数也可以直接传画布的context自身，则返回自己。


core.clearMap(name)
清空某个画布图层。
该函数的name也可以是'all'，若为'all'则为清空所有系统画布。


core.fillText(name, text, x, y, style, font, maxWidth)
在某个画布上绘制一段文字。
text为要绘制的文本，x,y为要绘制的坐标，style可选为绘制的样式，font可选为绘制的字体。（下同）
style可直接使用"red","white"等或用"rgba(255,255,255,1)"或用"#FFFFFF"等方式来获得字体对应的颜色
font的格式为"20px Verdana"前者为字体大小，后者为字体
如果maxWidth不为null，则视为文字最大宽度，如果超过此宽度则会自动放缩文字直到自适应为止。
请注意textAlign和textBaseline将决定绘制的左右对齐和上下对齐方式。
具体可详见core.setTextAlign()和core.setTextBaseline()函数。
譬如：core.fillText("ui", "这是要描绘的文字", 10, 10, "red", "20px Verdana", 100)
即是在ui图层上，以10,10为起始点，描绘20像素大小，Verdana字体的红色字，长度不超过100像素


core.fillBoldText(name, text, x, y, style, font)
在某个画布上绘制一个描黑边的文字。


core.fillRect(name, x, y, width, height, style)
绘制一个矩形。width, height为矩形宽高，style可选为绘制样式。如果设置将调用core.setFillStyle()。（下同）


core.strokeRect(name, x, y, width, height, style, lineWidth)
绘制一个矩形的边框。style可选为绘制样式，如果设置将调用core.setStrokeStyle()。
lineWidth如果设置将调用core.setLineWidth()。（下同）


core.drawLine(name, x1, y1, x2, y2, style, lineWidth)
绘制一条线，x1y1为起始点像素，x2y2为终止点像素。


core.drawArrow(name, x1, y1, x2, y2, style, lineWidth)
绘制一个箭头，x1y1为起始点像素，x2y2为终止点像素。


core.setFont(name, font) / core.setLineWidth(name, lineWidth)
设置一个画布的字体/线宽。


core.setAlpha(name, font) / core.setOpacity(name, font)
设置一个画布的绘制不透明度和画布本身的不透明度。
两者区别如下：
  - setAlpha是设置"接下来绘制的内容的不透明度"，不会对已经绘制的内容产生影响。
    > 比如setAlpha('ui', 0.5)则会在接下来的绘制中使用0.5的不透明度。
  - setOpacity是设置"画布本身的不透明度"，已经绘制的内容也会产生影响。
    > 比如我已经在UI层绘制了一段文字，再setOpacity则也会让已经绘制的文字变得透明。
尽量不要对系统画布使用setOpacity（因为会对已经绘制的内容产生影响），自定义创建的画布则不受此限制。


core.setFillStyle(name, style) / core.setStrokeStyle(name, style)
设置一个画布的填充样式/描边样式。


core.setTextAlign(name, align)
设置一个画布的文字横向对齐模式，这里的align只能为'left', 'right'和'center'，分别对应左对齐，右对齐，居中。
默认为'left'。


core.setTextBaseline(name, baseline)
设置一个画布的纵向对齐模式。有关textBaseline的说明可参见如下资料：
http://www.runoob.com/tags/canvas-textbaseline.html
默认值是'alphabetic'。
请注意，系统画布在绘制前都是没有设置过textBaseline的，都是按照alphabetic进行坐标绘制。
因此，如果你修改了系统画布的textBaseline来绘图，记得再绘制完毕后修改回来。


core.calWidth(name, text, font)
计算一段文字在某个画布上的绘制宽度，此函数其实是ctx.measureText()的包装。
font可选，如果存在则会先设置该画布上的字体。
此函数不会对文字进行换行，如需换行版本请使用core.splitLines()函数。


core.splitLines(name, text, maxWidth, font)
计算一段文字在某画布上换行分割的结果。
text为文字内容，maxWidth为最大宽度，可为null表示不自动换行。
font可选，如果存在则会先设置该画布上的字体。
此函数将返回一个换行完毕的文本列表。


core.drawImage(name, image, x, y, w, h, x1, y1, w1, h1)
在一张画布上绘制一张图片，此函数其实是ctx.drawImage()的包装。
可以查看下面的文档以了解各项参数的信息：
http://www.w3school.com.cn/html5/canvas_drawimage.asp
这里的image允许传一个图片，画布。也允许传递图片名，将从你导入的图片中获取图片内容。


core.drawIcon(name, id, x, y, w, h)
在一张画布上绘制一个图标。
id为注册过的图标ID，也可以使用状态栏的图标ID，例如lv, hp, up, save, settings等。
x和y为绘制的左上角坐标；w和h可选为绘制的宽高，如果不填或null则使用该图标的默认宽高。


// ------ 具体的某个UI界面的绘制 ------ //
core.closePanel()
结束一切事件和UI绘制，关闭UI窗口，返回游戏。
此函数将以此调用core.clearUI()，core.unlockControl()，并清空core.status.event里面的内容。


core.clearUI()
重置UI窗口。此函数将清掉所有的UI帧动画和光标，清空UI画布，并将alpha设为1。


core.drawTip(text, id, clear)
在左上角以气泡的形式绘制一段提示。
text为文字内容，仅支持${}的表达式计算，不支持换行和变色。
id可选，为同时绘制的图标ID，如果不为null则会同时绘制该图标（仅对32x32的素材有效）。
也可以使用状态栏的图标ID，例如lv, hp, up, save, settings等。
如果clear为true，则会清空当前所有正在显示的提示。


core.clearTip()
清空当前所有正在显示的提示。


core.drawText(content, callback)
绘制一段文字。contents为一个字符串或一个字符串数组，callback为全部绘制完毕的回调。
支持所有的文字效果（如\n，${}，\r，\\i，\\c，\\d，\\e等），也支持\t和\b的语法。
如果当前在事件处理中或录像回放中，则会自动转成core.insertAction处理。
不建议使用该函数，如有绘制文字的需求请尽量使用core.insertAction()插入剧情文本事件。


core.drawWindowSelector(background, x, y, w, h)
绘制一个WindowSkin的闪烁光标。background可为winskin的图片名或图片本身。
x,y,w,h为绘制的左上角位置和宽高，都是像素为单位。


core.drawWindowSkin(background, ctx, x, y, w, h, direction, px, py)
绘制一个WindowSkin。background可为winskin的图片名或图片本身。
ctx为画布名或画布本身，x,y,w,h为左上角位置和宽高，都是像素为单位。
direction, px, py可选，如果设置则会绘制一个对话框箭头。


core.drawBackground(left, top, right, bottom, posInfo)
绘制一个背景图。此函数将使用你在【剧情文本设置】中设置的背景，即用纯色或WindowSkin来绘制。
left, top, right, bottom为你要绘制的左上角和右下角的坐标。
posInfo如果不为null则是一个含position, px和py的对象，表示一个对话框箭头的绘制。


core.drawTextContent(ctx, content, config)
根据配置在某个画布上绘制一段文字。此函数会被core.drawTextBox()所调用。
ctx为画布名或画布本身，如果不设置则会忽略该函数。
content为要绘制的文字内容，支持所有的文字效果（如\n，${}，\r，\\i，\\c，\\d，\\e等）
    ，但不支持支持\t和\b的语法。
config为绘制的配置项，目前可以包括如下几项：
 - left, top：在该画布上绘制的左上角像素位置，不设置默认为(0,0)。
   > 该函数绘制时会将textBaseline设置为'top'，因此只需要考虑第一个字的左上角位置。
 - maxWidth：单行最大宽度，超过此宽度将自动换行，不设置不会自动换行。
 - color：默认颜色，为#XXXXXX形式。如果不设置则使用剧情文本设置中的正文颜色。
 - bold：是否粗体。如果不设置默认为false。
 - align：文字对齐方式，仅在maxWidth设置时有效，默认为'left'。
 - fontSize：字体大小，如果不设置则使用剧情文本设置中的正文字体大小。
 - lineHeight：绘制的行距值，如果不设置则使用fontSize*1.3（即1.3倍行距）。
 - time：打字机效果。若不为0，则会逐个字进行绘制，并设置core.status.event.interval定时器。
 - interval：字符间的间距。值表示绘制每个字符之间间隔的距离，默认为0。


core.drawTextBox(content, showAll)
绘制一个对话框。content为一个字符串或一个字符串数组。
支持所有的文字效果（如\n，${}，\r，\\i，\\c，\\d，\\e等），也支持\t和\b的语法。
该函数将使用用户在剧情文本设置中的配置项进行绘制。
实际执行时，会计算文本框宽度并绘制背景，绘制标题和头像，再调用core.drawTextContent()绘制正文内容。
showAll可选，如果为true则不会使用打字机效果而全部显示，主要用于打字机效果的点击显示全部。


core.drawScrollText(content, time, lineHeight, callback)
绘制一个滚动字幕。content为绘制内容，time为总时间（默认为5000），lineHeight为行距比例（默认为1.4）。
滚动字幕将绘制在UI上，支持所有的文字效果（如\n，${}，\r，\\i，\\c，\\d，\\e等），但不支持\t和\b效果。
可以通过剧情文本设置中的align控制是否居中绘制，offset控制其距离左边的偏移量。


core.textImage(content, lineHeight)
将文本图片化。content为绘制内容，lineHeight为行距比例（默认为1.4）。
可以通过剧情文本设置中的align控制是否居中绘制。
此函数将返回一个临时画布的canvas，供转绘到其他画布上使用。


core.drawChoices(content, choices)
绘制一个选项框。
content可选，为选项上方的提示文字，支持所有的文字效果（如\n，${}，\r，\\i，\\c，\\d，\\e等），也支持\t。
choices必选，为要绘制的选项内容，是一个列表。其中的每一项：
 - 可以是一个字符串，表示选项文字，将使用剧情文本设置中的正文颜色来绘制，仅支持${}表达式计算。
 - 或者是一个包含text, color和icon的对象。
   > text必选，为要绘制的文字内容，仅支持${}的表达式计算，
   > color为要绘制的选项颜色，可以是#XXXXXX的格式或RGBA数组。不设置则使用正文颜色。
   > icon为要绘制的图标ID，支持使用素材的ID，或者系统图标。


core.drawConfirmBox(text, yesCallback, noCallback)
绘制一个确认框。text为确认文字，支持\n换行（但不支持自动换行）和${}表达式计算。
yesCallback和noCallback分别为确定和取消的回调函数。
可以在调用此函数前设置core.status.event.selection来控制默认的选中项（0确定1取消）。
此函数和core.myconfirm的区别主要在于：
 - 此函数会清掉UI层原有的绘制信息，core.myconfirm不会清除。
 - 此函数可以用键盘进行操作，core.myconfirm必须用鼠标点击。
另外请注意：本函数和事件流的执行不兼容，选择也不会进录像。
如果需要在事件流中调用请使用提供选择项。


core.drawWaiting(text)
绘制一个等待界面，一般用于同步存档之类的操作。
调用此函数后，需要再调用core.closePanel()才会恢复游戏。


core.drawPagination(page, totalPage, y)
绘制一个分页。y如果不设置则绘制在最后一行。


core.drawBook(index) / core.drawBookDetail(index)
绘制怪物手册，绘制怪物的详细信息。


core.drawFly(page) / core.drawCenterFly() / core.drawShop(shopId)
绘制楼传页面，中心对称飞行器，绘制商店
 
 
core.drawToolbox(index) / core.drawEquipbox(index) / core.drawKeyBoard()
绘制道具栏，绘制装备栏，绘制虚拟键盘。
 
 
core.drawMaps(index, x, y) / core.drawSLPanel(index, refresh) 
绘制浏览地图，绘制存读档界面。


core.drawStatusBar()
自定义绘制状态栏，仅在状态栏canvas化开启时有效，实际被转发到了脚本编辑中。


core.drawStatistics()
绘制数据统计。将从脚本编辑中获得要统计的数据列表，再遍历所有地图进行统计。


core.drawAbout() / core.drawHelp()
绘制关于界面，帮助界面。

// ------ 动态创建画布相关的API ------ //


core.ui.createCanvas(name, x, y, width, height, z)
动态创建一个自定义画布。name为要创建的画布名，如果已存在则会直接取用当前存在的。
x,y为创建的画布相对窗口左上角的像素坐标，width,height为创建的长宽。
z值为创建的纵向高度（关系到画布之间的覆盖），z值高的将覆盖z值低的；系统画布的z值可在个性化中查看。
返回创建的画布的context，也可以通过core.dymCanvas[name]或core.getContextByName获得。


core.ui.relocateCanvas(name, x, y)
重新定位一个自定义画布。x和y为画布的左上角坐标，name为画布名。


core.ui.resizeCanvas(name, width, height, styleOnly)
重新设置一个自定义画布的大小。width和height为新设置的宽高。
styleOnly控制是否只修改画布的显示大小（而不修改画布的内部大小）。
如果styleOnly为true，则只修改其显示大小（即canvas.style.width）；
否则，则会同时修改画布的显示大小和内部大小并清空画布内容。


core.ui.deleteCanvas(name)
删除一个自定义画布。


core.ui.deleteAllCanvas()
删除所有的自定义画布。
```

## utils.js

utils.js是一个工具函数库，里面有各个样板中使用到的工具函数。

```text
core.replayText(text, need, times)
将一段文字中的${}（表达式）进行替换。need和time一般可以直接忽略。


core.replaceValue(value)
对一个表达式中的特殊规则进行替换，如status:xxx等。
请注意，此项不会对独立开关如switch:A进行替换。


core.calValue(value, prefix, need, time)
计算一个表达式的值，支持status:xxx等的计算。
prefix为前缀（switch:xxx的独立开关使用），need和time一般可以直接忽略。


core.unshift(a, b) / core.push(a, b)
将b插入到列表a之前或之后。b可以是一个元素或者一个数组。


core.decompress(value)
解压缩一个字符串并进行JSON解析。value可能会被LZString或LZW算法进行压缩。
返回解压后的JSON格式内容，如果无法解压则返回null。


core.setLocalStorage(key, value)
将一个键值对存入localStorage中，会立刻返回结果。
此函数会自动给key加上它的name作为前缀，以便于不同塔之间的区分。
value为要存储的内容，存储前会被JSON转成字符串形式，并LZW算法进行压缩。
如果value为null，则实际会调用core.removeLocalStorage()函数清除该key。
localStorage为浏览器的默认存储，和存档无关，只有5M的空间大小。
此函数立刻返回true或false，如果为false则代表存储失败，一般指的是空间满了。


core.getLocalStorage(key, defaultValue)
从localStorage中获得一个键的值，会立刻返回结果。
此函数会自动给key加上它的name作为前缀，以便于不同塔之间的区分。
如果对应的键值不存在或为null，则会返回defaultValue。
返回的结果会被调用core.decompress进行解压缩和JSON解析。


core.removeLocalStorage(key)
从localStorage中删除一个键的值，会立刻返回。
此函数会自动给key加上它的name作为前缀，以便于不同塔之间的区分。


core.setLocalForage(key, value, successCallback, errorCallback)
将一个键值对存入localForage中，异步返回结果。
如果用户没有开启【新版存档】开关，则仍然会使用core.setLocalStorage()。
localForage为一个开源库，项目地址 https://github.com/localForage/localForage
一般存入的是indexedDB，这是一个浏览器的自带数据库，没有空间限制。
successCallback和errorCallback均可选，表示该次存储成功或失败的回调，
此函数为异步的，只能通过回调函数来获得存储的成功或失败信息。


core.getLocalForage(key, defaultValue, successCallback, errorCallback)
从localForage中获得一个键的值，异步返回结果。
如果对应的键值不存在，则会使用defaultValue。
如果获得成功，则会将core.decompress后的结果传入successCallback回调函数执行。
errorCallback可选，如果失败，则会将错误信息传入errorCallback()。
此函数是异步的，只能通过回调函数来获得读取的结果或错误信息。


core.setGlobal(key, value)
设置一个全局存储，适用于global:xxx。
录像播放时将忽略此函数，否则直接调用core.setLocalStorage。


core.getGlobal(key, value)
获得一个全局存储，适用于global:xxx，支持录像。
正常游戏时将使用core.getLocalStorage获得具体的数据，并将结果存放到录像中。
录像播放时会直接从录像中获得对应的数据。


core.clone(data, filter, recursion)
深拷贝一个对象。有关浅拷贝，深拷贝，基本类型和引用类型等相关知识可参见：
https://zhuanlan.zhihu.com/p/26282765
filter为过滤函数，如果设置且不为null则需传递一个可接受(name, value)的函数，
并返回true或false，表示该项是否应该被深拷贝。
recursion表示该filter是否应递归向下传递，如果为true则递归函数也将传该filter。
例如：
core.clone(core.status.hero, function(name, value) {
    return name == 'items' || typeof value == 'number';
}, false);
这个例子将会深拷贝勇士的属性和道具。


core.splitImage(image, width, height)
等比例切分一张图片。width和height为每张子图片的宽高。
请确保原始图片的宽度和高度都是是width和height的倍数。
此函数将返回一个一维数组，每一项都是一张切分好的图片，横向再纵向排列。
例如4x3的图片按1x1切分得到一个长度为12的数组，按如下方式进行排列：
0   1   2   3
4   5   6   7
8   9  10  11
可以将很多需要的图片拼在一张大图上，然后在插件的_afterLoadResources中切分。
切分好的图片再存入core.material.images.images中，这样可以少很多IO请求。


core.formatDate(date) / core.formatDate2(date) / core.formatTime(time)
格式化日期和时间。


core.setTwoDigits(x)
将x变成两位数。其实就是 parseInt(x) < 10 ? "0" + x : x


core.formatBigNumber(x, onMap)
大数据格式化。x为要格式化的内容，如果不合法会返回???。
onMap标记是否在地图上调用，如果为真则尝试格式化成六位，否则五位。


core.arrayToRGB(color) / core.arrayToRGBA(color)
将一个颜色数组，例如[255,0,0,1]转成#FF0000或rgba(255,0,0,1)的形式。


core.encodeRoute(route)
录像压缩和解压缩。route为要压缩的路线数组。
此函数将尽可能对录像进行压缩。对于无法识别的项目（比如自己添加的），将不压缩而原样放入。
例如，["up","up","left","move:3:5","test:2333","getNext","item:bomb","down"]
将被压缩成"U2LM3:5(test:2333)GIbomb:D"。
自己添加的录像项只能由数字、大小写、下划线线、冒号等符号组成，否则无法正常压缩和解压缩。
对于自定义内容（比如中文文本或数组）请使用JSON.stringify再core.encodeBase64处理。
压缩的结果将再次进行LZString.compressToBase64()的压缩以进一步节省空间。


core.decodeRoute(route)
解压缩一个录像，返回解压完毕的路线数组。


core.isset(v)
判定v是不是null, undefined或NaN。
请尽量避免使用此函数，而是直接判定 v == null （请注意 null==undefined ！）


core.subarray(a, b)
判定数组b是不是数组a的一个前缀子数组。
如果是，则返回a中除去b后的剩余数组，否则返回null。


core.inArray(array, element)
判定array是不是一个数组，以及element是否在该数组中。


core.clamp(x, a, b)
将x限定在[a,b]区间内。


core.getCookie(name)
获得一个cookie值，如果不存在该cookie则返回null。


core.setStatusBarInnerHTML(name, value, css)
设置一个状态栏的innerHTML。此函数会自动设置状态栏的文字放缩和斜体等效果。
name为状态栏的名称，如atk, def等。需要是core.statusBar中的一个合法项。
value为要设置到的数值，如果是数字则会先core.formatBigNumber()进行格式化。
css可选，为增添的额外css内容，比如可以设定颜色等。


core.strlen(str)
计算某个字符串的实际长度。每个字符的长度，ASCII码视为1，中文等视为2。


core.reverseDirection(direction)
翻转方向，即"up"转成"down", "left"转成"right"等。


core.matchWildcard(pattern, string)
进行通配符的匹配判定，目前仅支持*（可匹配0或任意个字符）。比如"a*b*c"可以匹配"aa012bc"。


core.encodeBase64(str) / core.decodeBase64(str)
将字符串进行base64加密或解密。
可用于解压缩录像数据


core.rand(num)
使用伪种子生成伪随机数。该随机函数能被录像支持。
num如果设置大于0，则生成一个[0, num-1]之间的数；否则生成一个0到1之间的浮点数。
此函数为伪随机算法，SL大法无效。（即多次SL后调用的该函数返回的值都是相同的。）


core.rand2(num)
使用系统的随机数算法得到的随机数。该随机函数能被录像支持。
num如果设置大于0，则生成一个[0, num-1]之间的数；否则生成一个0到2147483647之间的整数。
此函数使用了系统的Math.random()函数，支持SL大法。
但是，此函数会将生成的随机数值存入录像，因此如果调用次数太多则会导致录像文件过大。
对于需要大量生成随机数，但又想使用真随机支持SL大法的（例如随机生成地图等），可以采用如下方式：
  var x = core.rand2(100); for (var i = 0; i < x; i++) core.rand()
即先生成一个真随机数，根据该数来推进伪随机的种子，这样就可以放心调用core.rand()啦。


core.readFile(success, error, accept)
读取一个本地文件内容。success和error分别为读取成功或失败的回调函数。
accept如果设置则控制能选择的文件类型。
iOS平台暂不支持读取文件操作。


core.readFileContent(content)
读取到的文件内容。此函数会被APP等调用，来传递文件的具体内容。


core.download(filename, content)
生成一个文件并下载。filename为文件名，content为具体的文件内容。
iOS平台暂不支持下载文件操作。


core.copy(data)
将一段内容拷贝到剪切板。


core.myconfirm(hint, yesCallback, noCallback)
弹窗绘制一段提示信息并让用户确认。hint为提示信息。
yesCallback和noCallback分别为确定和取消的回调函数。
此函数和core.drawConfirmBox的区别主要在于：
 - drawConfirmBox会清掉UI层原有的绘制信息，此函数不会清除。
 - drawConfirmBox可以用键盘进行操作，此函数必须用鼠标点击。
另外请注意：本函数的选择也不会进录像，一般用于全局的提示。
如果需要在事件流中调用请使用显示确认框或显示选择项。


core.myprompt(hint, value, callback)
弹窗让用户输入一段内容。hint为提示信息，value为框内的默认填写内容。
callback为用户点击确认或取消后的回调。
如果用户点击了确认，则会把框内的内容（可能是空串）传递给callback，否则把null传递给callback。


core.showWithAnimate(obj, speed, callback) / core.hideWithAnimate(obj, speed, callback)
动画淡入或淡出一个对象。


core.same(a, b)
判定a和b是否相同，包括类型相同和值相同。
如果a和b都是数组，则会递归依次比较数组中的值；如果都是对象亦然。


core.unzip(blobOrUrl, success, error, convertToText)
解压一个zip文件。
blobOrUrl为传入的二进制zip文件Blob格式，或zip文件的地址。
success为成功后的回调，接收 文件名-文件内容 形式的对象，即
{"filename1": ..., "filename2": ...}
error为失败的回调，接收参数message为错误信息。
convertToText如果为true则会将每个文件内容转成纯文本而不是二进制格式。


core.http(type, url, formData, success, error, mimeType, responseType)
发送一个异步HTTP请求。
type为'GET'或者'POST'；url为目标地址；formData如果是POST请求则为表单数据。
success为成功后的回调，error为失败后的回调。
mimeType和responseType如果设置将会覆盖默认值。


lzw_encode(s) / lzw_decode(s)
LZW压缩算法，来自https://gist.github.com/revolunet/843889
```
