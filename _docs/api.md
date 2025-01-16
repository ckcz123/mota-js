# 附录：API列表

?> 样板全部的API列表都在这里了！

这里将列出所有被转发到core的API，没有被转发的函数此处不会列出，请自行在代码中查看。

本附录量较大，如有什么需求请自行Ctrl+F进行搜索。

如有任何疑问，请联系小艾寻求帮助。

## core.js

core.js中只有很少的几个函数，主要是游戏开始前的初始化等。

但是，core中定义了很多游戏运行时的状态，这些状态很多都会被使用到。

```text
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


core.domStyle
游戏的界面信息，包含如下几个：
core.domStyle.scale    （当前的放缩比）
core.domStyle.ratio    （高清UI的放缩比）
core.domStyle.isVertical    （当前是否是竖屏状态）
core.domStyle.showStatusBar    （当前是否显示状态栏）
core.domStyle.toolbarBtn    （当前是否显示工具栏）


core.bigmap
当前的地图的尺寸信息，主要包含如下几个
core.bigmap.width    （当前地图的宽度）
core.bigmap.height    （当前地图的高度）
core.bigmap.offsetX    （当前地图针对窗口左上角的偏移像素x）
core.bigmap.offsetY    （当前地图针对窗口左上角的偏移像素y）
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
    core.status.hero.steps    当前的步数值
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

主要是处理一些和用户交互相关的内容。

```text
doRegisteredAction: fn(action: string, params: ?)
执行一个用户交互行为

keyDown: fn(keyCode: number)
根据按下键的code来执行一系列操作

keyDownCtrl: fn() -> bool
长按Ctrl键时

keyUp: fn(keyCode: number, altKey?: bool, fromReplay?: bool)
根据放开键的code来执行一系列操作

longClick: fn(x: number, y: number, px: number, py: number, fromEvent?: bool)
长按

onStatusBarClick: fn(e?: Event)
点击自绘状态栏时

onclick: fn(x: number, y: number, px: number, py: number, stepPostfix?: [?])
具体点击屏幕上(x,y)点时，执行的操作

ondown: fn(loc: {x: number, y: number, size: number})
点击（触摸）事件按下时

onkeyDown: fn(e: Event)
按下某个键时

onkeyUp: fn(e: Event)
放开某个键时

onmousewheel: fn(direct: number)
滑动鼠标滚轮时的操作

onmove: fn(loc: {x: number, y: number, size: number})
当在触摸屏上滑动时

onup: fn(loc: {x: number, y: number, size: number})
当点击（触摸）事件放开时

pressKey: fn(keyCode: number)
按住某个键时

registerAction: fn(action: string, name: string, func: string|fn(params: ?), priority?: number)
此函数将注册一个用户交互行为。
action: 要注册的交互类型，如 ondown, onclick, keyDown 等等。
name: 你的自定义名称，可被注销使用；同名重复注册将后者覆盖前者。
func: 执行函数。
如果func返回true，则不会再继续执行其他的交互函数；否则会继续执行其他的交互函数。
priority: 优先级；优先级高的将会被执行。此项可不填，默认为0

unregisterAction: fn(action: string, name: string)
注销一个用户交互行为
```

## control.js

负责整个游戏的核心控制系统，分为如下几个部分：
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
addBuff: fn(name: string, value: number)
增减主角某个属性的百分比修正倍率，加减法叠加和抵消。等价于 core.setBuff(name, core.getBuff(name) + value)
例如：core.addBuff('atk', -0.1); // 主角获得一层“攻击力减一成”的负面效果
name: 属性的英文名，请注意只能用于数值类属性哦，否则随后的乘法会得到NaN
value: 倍率的增量

addFlag: fn(name: string, value: number)
增减一个flag变量，等价于 core.setFlag(name, core.getFlag(name, 0) + value)
例如：core.addFlag('hatred', 1); // 增加1点仇恨值
name: 变量名，支持中文
value: 变量的增量

addGameCanvasTranslate: fn(x?: number, y?: number)
加减画布偏移

addStatus: fn(name: string, value: number)
增减主角的某个属性，等价于core.setStatus(name, core.getStatus(name) + value)
例如：core.addStatus('atk', 100'); // 给主角攻击力加100
name: 属性的英文名
value: 属性的增量

addSwitch: fn(x: number, y: number, floorId: string, name: string, value: number)
增加某个独立开关的值

autosave: fn(removeLast?: bool)
自动存档

checkAutosave: fn()
实际将自动存档写入存储

checkBgm: fn()
检查bgm状态

checkBlock: fn()
检查并执行领域、夹击、阻击事件

checkRouteFolding: fn()
检查录像折叠信息

chooseReplayFile: fn()
选择录像文件

clearAutomaticRouteNode: fn(x?: number, y?: number)
清除自动寻路路线

clearContinueAutomaticRoute: fn(callback?: fn())
清空剩下的自动寻路列表

clearRouteFolding: fn()
清空录像折叠信息

clearStatus: fn()
清除游戏状态和数据

clearStatusBar: fn()
清空状态栏

continueAutomaticRoute: fn()
继续剩下的自动寻路操作

debug: fn()
开启调试模式, 此模式下可以按Ctrl键进行穿墙, 并忽略一切事件。
此模式下不可回放录像和上传成绩。

doSL: fn(id?: string, type?: string)
实际进行存读档事件

drawDamage: fn(string|CanvasRenderingContext2D)
仅绘制地图显伤

drawHero: fn(status?: string, offset?: number, frame?: number)
绘制主角和跟随者并重置视野到以主角为中心
例如：core.drawHero(); // 原地绘制主角的静止帧并重置视野野
status: 只能为 stop, leftFoot 和 rightFoot，不填用stop。
offset: 相对主角逻辑位置的偏移量，不填视为无偏移。
frame: 绘制的第几帧

gatherFollowers: fn()
立刻聚集所有的跟随者

getAllSaves: fn(callback?: fn())
获得所有存档内容

getBuff: fn(name: string) -> number
读取主角某个属性的百分比修正倍率，初始值为1
例如：core.getBuff('atk'); // 主角当前能发挥出多大比例的攻击力
name: 属性的英文名

getFlag: fn(name: string, defaultValue?: ?)
读取一个flag变量
name: 变量名，支持中文
defaultValue: 当变量不存在时的返回值，可选（事件流中默认填0）。

getHeroLoc: fn(name: string) -> string|number
读取主角的位置和/或朝向
例如：core.getHeroLoc(); // 读取主角的位置和朝向
name: 要读取横坐标还是纵坐标还是朝向还是都读取
返回值：name ? core.status.hero.loc[name] : core.status.hero.loc

getLvName: fn(lv?: number) -> string|number
根据级别的数字获取对应的名称，后者定义在全塔属性
例如：core.getLvName(); // 获取主角当前级别的名称，如“下级佣兵”
lv: 级别的数字，不填则视为主角当前的级别
返回值：级别的名称，如果不存在就还是返回数字

getMappedName: fn(name: string) -> string
获得映射文件名

getNakedStatus: fn(name: string)
获得勇士原始属性（无装备和衰弱影响）

getNextLvUpNeed: fn() -> number
获得下次升级需要的经验值。
升级扣除模式下会返回经验差值；非扣除模式下会返回总共需要的经验值。
如果无法进行下次升级，返回null。

getPlayingSounds: fn(name?: string) -> [number]
获得当前正在播放的所有（指定）音效的id列表
name: 音效名，可用别名；不填代表返回正在播放的全部音效
返回值: 一个列表，每一项为一个正在播放的音效id；可用core.stopSound立刻停止播放

getRealStatus: fn(name: string)
计算主角的某个属性，包括百分比修正
例如：core.getRealStatus('atk'); // 计算主角的攻击力，包括百分比修正。战斗使用的就是这个值
name: 属性的英文名，请注意只能用于数值类属性哦，否则乘法会得到NaN

getRealStatusOrDefault: fn(status?: ?, name?: string)
从status中获得实际属性（增幅后的），如果不存在则从勇士属性中获取

getSave: fn(index?: number, callback?: fn(data: ?))
获得某个存档内容

getSaveIndexes: fn(callback?: fn())
获得所有存在存档的存档位

getSaves: fn(ids?: ?, callback?: fn())
获得某些存档内容

getStatus: fn(name: string) -> number
读取主角的某个属性，不包括百分比修正
例如：core.getStatus('atk'); // 读取主角的攻击力
name: 属性的英文名，其中'x'、'y'和'direction'会被特殊处理为 core.getHeroLoc(name)，其他的会直接读取 core.status.hero[name]

getStatusLabel: fn(name: string) -> string
获得某个状态的名字，如atk->攻击，def->防御等

getStatusOrDefault: fn(status?: ?, name?: string)
从status中获得属性，如果不存在则从勇士属性中获取

getSwitch: fn(x: number, y: number, floorId: string, name: string, defaultValue?: ?)
获得某个独立开关的值

hasFlag: fn(name: string) -> bool
判定一个flag变量是否存在且不为false、0、''、null、undefined和NaN
例如：core.hasFlag('poison'); // 判断主角当前是否中毒
name: 变量名，支持中文
此函数等价于 !!core.getFlag(name)

hasSave: fn(index?: number) -> bool
判断某个存档位是否存在存档

hasSwitch: fn(x: number, y: number, floorId: string, name: string) -> bool
判定某个独立开关的值

hideStartAnimate: fn(callback?: fn())
淡出标题画面
例如：core.hideStartAnimate(core.startGame); // 淡出标题画面并开始新游戏，跳过难度选择
callback: 标题画面完全淡出后的回调函数

hideStatusBar: fn(showToolbox?: bool)
隐藏状态栏
showToolbox: 是否不隐藏竖屏工具栏

isMoving: fn() -> bool
当前是否正在移动

isPlaying: fn() -> bool
游戏是否已经开始

isReplaying: fn() -> bool
是否正在播放录像

loadData: fn(data?: ?, callback?: fn())
从本地读档

lockControl: fn()
锁定用户控制，常常用于事件处理

moveAction: fn(callback?: fn())
尝试前进一步，如果面前不可被踏入就会直接触发该点事件
请勿直接使用此函数，如有需要请使用「勇士前进一步或撞击」事件
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

moveDirectly: fn(destX?: number, destY?: number, ignoreSteps?: number)
瞬间移动

moveHero: fn(direction?: string, callback?: fn())
连续前进，不撞南墙不回头
例如：core.moveHero(); // 连续前进
direction: 可选，如果设置了就会先转身到该方向
callback: 可选，如果设置了就只走一步
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

moveOneStep: fn(callback?: fn())
每移动一格后执行的事件
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

moveViewport: fn(x: number, y: number, time?: number, callback?: fn())
移动视野范围

nearHero: fn(x: number, y: number, n?: number) -> bool
判定主角是否身处某个点的锯齿领域(取曼哈顿距离)
例如：core.nearHero(6, 6, 6); // 判定主角是否身处点（6，6）的半径为6的锯齿领域
x: 领域的中心横坐标
y: 领域的中心纵坐标
n: 领域的半径，不填视为1

nextX: fn(n?: number) -> number
获取主角面前第n格的横坐标
例如：core.closeDoor(core.nextX(), core.nextY(), 'yellowDoor', core.turnHero); // 在主角面前关上一扇黄门，然后主角顺时针旋转90°
n: 目标格与主角的距离，面前为正数，背后为负数，脚下为0，不填视为1

nextY: fn(n?: number) -> number
获取主角面前第n格的纵坐标
例如：core.jumpHero(core.nextX(2), core.nextY(2)); // 主角向前跃过一格，即跳跃靴道具的使用效果
n: 目标格与主角的距离，面前为正数，背后为负数，脚下为0，不填视为1

pauseBgm: fn()
暂停背景音乐的播放

pauseReplay: fn()
暂停播放

playBgm: fn(bgm: string, startTime?: number)
播放背景音乐，中途开播但不计入存档且只会持续到下次场景切换。如需长期生效请将背景音乐的文件名赋值给flags.__bgm__
例如：core.playBgm('bgm.mp3', 30); // 播放bgm.mp3，并跳过前半分钟
bgm: 背景音乐的文件名，支持全塔属性中映射前的中文名
startTime: 跳过前多少秒，不填则不跳过

playSound: fn(sound: string, pitch?: number, callback?: fn()) -> number
播放一个音效
sound: 音效名；可以使用文件别名。
pitch: 播放的音调；可选，如果设置则为30-300之间的数值；100为正常音调。
callback: 可选，播放完毕后执行的回调函数。
返回：一个数字，可用于core.stopSound的参数来只停止该音效。

registerAnimationFrame: fn(name: string, needPlaying: bool, func?: fn(timestamp: number))
注册一个 animationFrame
name: 名称，可用来作为注销使用
needPlaying: 是否只在游戏运行时才执行（在标题界面不执行）
func: 要执行的函数，或插件中的函数名；可接受timestamp（从页面加载完毕到当前所经过的时间）作为参数

registerReplayAction: fn(name: string, func: fn(action?: string) -> bool)
注册一个录像行为
name: 自定义名称，可用于注销使用
func: 具体执行录像的函数，可为一个函数或插件中的函数名；
需要接受一个action参数，代表录像回放时的下一个操作
func返回true代表成功处理了此录像行为，false代表没有处理此录像行为。

registerResize: fn(name: string, func: fn(obj: ?))
注册一个resize函数
name: 名称，可供注销使用
func: 可以是一个函数，或者是插件中的函数名；可以接受obj参数，详见resize函数。

registerWeather: fn(name: string, initFunc: fn(level: number), frameFunc?: fn(timestamp: number, level: number))
注册一个天气
name: 要注册的天气名
initFunc: 当切换到此天气时的初始化；接受level（天气等级）为参数；可用于创建多个节点（如初始化雪花）
frameFunc: 每帧的天气效果变化；可接受timestamp（从页面加载完毕到当前所经过的时间）和level（天气等级）作为参数
天气应当仅在weather层进行绘制，推荐使用core.animateFrame.weather.nodes用于节点信息。

removeFlag: fn(name: string)
删除某个flag/变量

removeSave: fn(index?: number, callback?: fn())
删除某个存档

removeSwitch: fn(x: number, y: number, floorId: string, name: string)
删除某个独立开关

replay: fn()
回放下一个操作

resize: fn()
屏幕分辨率改变后重新自适应

resumeBgm: fn(resumeTime?: number)
恢复背景音乐的播放
resumeTime: 从哪一秒开始恢复播放

resumeReplay: fn()
恢复播放

rewindReplay: fn()
回退到上一个录像节点

saveAndStopAutomaticRoute: fn()
保存剩下的寻路，并停止

saveData: fn()
存档到本地

screenFlash: fn(color: [number], time: number, times?: number, moveMode?: string, callback?: fn())
画面闪烁
例如：core.screenFlash([255, 0, 0, 1], 3); // 红屏一闪而过
color: 一行三列（第四列视为1）或一行四列（第四列若大于1则会被视为1，第四列若填负数则会被视为0）的颜色数组，必填
time: 单次闪烁时长，实际闪烁效果为先花其三分之一的时间渐变到目标色调，再花剩余三分之二的时间渐变回去
times: 闪烁的总次数，不填或填0都视为1
moveMode: 渐变方式
callback: 闪烁全部完毕后的回调函数，可选

setAutoHeroMove: fn(steps: [?])
连续行走
例如：core.setAutoHeroMove([{direction: "up", step: 1}, {direction: "left", step: 3}]); // 上左左左
steps: 压缩的步伐数组，每项表示朝某方向走多少步

setAutomaticRoute: fn(destX: number, destY: number, stepPostfix: [{x: number, y: number, direction: string}])
半自动寻路，用于鼠标或手指拖动
例如：core.setAutomaticRoute(0, 0, [{direction: "right", x: 4, y: 9}, {direction: "right", x: 5, y: 9}]);
destX: 鼠标或手指的起拖点横坐标
destY: 鼠标或手指的起拖点纵坐标
stepPostfix: 拖动轨迹的数组表示，每项为一步的方向和目标点。

setBgmSpeed: fn(speed: number, usePitch?: bool)
设置背景音乐的播放速度和音调
speed: 播放速度，必须为30-300中间的值。100为正常速度。
usePitch: 是否同时改变音调（部分设备可能不支持）

setBuff: fn(name: string, value: number)
设置主角某个属性的百分比修正倍率，初始值为1，
倍率存放在flag: '__'+name+'_buff__' 中
例如：core.setBuff('atk', 0.5); // 主角能发挥出的攻击力减半
name: 属性的英文名，请注意只能用于数值类属性哦，否则随后的乘法会得到NaN
value: 新的百分比修正倍率，不填（效果上）视为1

setCurtain: fn(color?: [number], time?: number, moveMode?: string, callback?: fn())
更改画面色调，不计入存档。如需长期生效请使用core.events._action_setCurtain()函数
例如：core.setCurtain(); // 恢复画面色调，用时四分之三秒
color: 一行三列（第四列视为1）或一行四列（第四列若大于1则会被视为1，第四列若为负数则会被视为0）的颜色数组，不填视为[0, 0, 0, 0]
time: 渐变时间，单位为毫秒。不填视为750ms，负数视为0（无渐变，立即更改）
moveMode: 渐变方式
callback: 更改完毕后的回调函数，可选。事件流中常取core.doAction

setDisplayScale: fn(delta: number)
设置屏幕放缩

setFlag: fn(name: string, value: ?)
设置一个flag变量
例如：core.setFlag('poison', true); // 令主角中毒
name: 变量名，支持中文
value: 变量的新值，不填或填null视为删除

setGameCanvasTranslate: fn(ctx: string|CanvasRenderingContext2D, x: number, y: number)
设置大地图的偏移量

setHeroLoc: fn(name: string, value: string|number, noGather?: bool)
设置勇士位置
值得注意的是，这句话虽然会使勇士改变位置，但并不会使界面重新绘制；
如需立刻重新绘制地图还需调用：core.clearMap('hero'); core.drawHero(); 来对界面进行更新。
例如：core.setHeroLoc('x', 5) // 将勇士当前位置的横坐标设置为5。
name: 要设置的坐标属性
value: 新值
noGather: 是否聚集跟随者

setHeroMoveInterval: fn(callback?: fn())
设置行走的效果动画

setHeroOpacity: fn(opacity?: number, moveMode?: string, time?: number, callback?: fn())
改变勇士的不透明度

setMusicBtn: fn()
设置音乐图标的显隐状态

setReplaySpeed: fn(speed: number)
设置播放速度

setStatus: fn(name: string, value: number)
设置主角的某个属性
例如：core.setStatus('atk', 100); // 设置攻击力为100
name: 属性的英文名，其中'x'、'y'和'direction'会被特殊处理为 core.setHeroLoc(name, value)，其他的会直接对 core.status.hero[name] 赋值
value: 属性的新值

setSwitch: fn(x: number, y: number, floorId: string, name: string, value?: ?)
设置某个独立开关的值

setToolbarButton: fn(useButton?: bool)
改变工具栏为按钮1-8

setViewport: fn(px?: number, py?: number)
设置视野范围
px,py: 左上角相对大地图的像素坐标，不需要为32倍数

setWeather: fn(type?: string, level?: number)
设置天气，不计入存档。如需长期生效请使用core.events._action_setWeather()函数
例如：core.setWeather('fog', 10); // 设置十级大雾天
type: 新天气的类型，不填视为晴天
level: 新天气（晴天除外）的级别，必须为不大于10的正整数，不填视为5

showStartAnimate: fn(noAnimate?: bool, callback?: fn())
进入标题画面
例如：core.showStartAnimate(); // 重启游戏但不重置bgm
noAnimate: 可选，true表示不由黑屏淡入而是立即亮屏
callback: 可选，完全亮屏后的回调函数

showStatusBar: fn()
显示状态栏

speedDownReplay: fn()
减速播放

speedUpReplay: fn()
加速播放

startReplay: fn(list: [string])
开始播放录像

stepReplay: fn()
单步播放

stopAutomaticRoute: fn()
停止自动寻路操作

stopReplay: fn(force?: bool)
停止播放

stopSound: fn(id?: number)
停止播放音效。如果未指定id则停止所有音效，否则只停止指定的音效。

syncLoad: fn()
从服务器加载存档

syncSave: fn(type?: string)
同步存档到服务器

triggerBgm: fn()
开启或关闭背景音乐的播放

triggerDebuff: fn(action: string, type: string|[string])
获得或移除毒衰咒效果
action: 要获得还是移除，'get'为获得，'remove'为移除
type: 获得或移除的内容（poison/weak/curse），可以为字符串或数组

triggerReplay: fn()
播放或暂停录像回放

tryMoveDirectly: fn(destX: number, destY: number)
尝试瞬移，如果该点有图块/事件/阻激夹域捕则会瞬移到它旁边再走一步（不可踏入的话当然还是触发该点事件），这一步的方向优先和瞬移前主角的朝向一致
例如：core.tryMoveDirectly(6, 0); // 尝试瞬移到地图顶部的正中央，以样板0层为例，实际效果是瞬移到了上楼梯下面一格然后向上走一步并触发上楼事件
destX: 目标点的横坐标
destY: 目标点的纵坐标

turnHero: fn(direction?: string)
主角转向并计入录像，不会导致跟随者聚集，会导致视野重置到以主角为中心
例如：core.turnHero(); // 主角顺时针旋转90°，即单击主角或按下Z键的效果
direction: 主角的新朝向，可为 up, down, left, right, :left, :right, :back 七种之一

unlockControl: fn()
解锁用户控制行为

unregisterAnimationFrame: fn(name: string)
注销一个animationFrame

unregisterReplayAction: fn(name: string)
注销一个录像行为

unregisterResize: fn(name: string)
注销一个resize函数

unregisterWeather: fn(name: string)
注销一个天气

updateCheckBlock: fn(floorId?: string)
更新领域、夹击、阻击的伤害地图

updateDamage: fn(floorId?: string, ctx?: string|CanvasRenderingContext2D)
重算并绘制地图显伤
例如：core.updateDamage(); // 更新当前地图的显伤，绘制在显伤层（废话）
floorId: 地图id，不填视为当前地图。预览地图时填写
ctx: 绘制到的画布，如果填写了就会画在该画布而不是显伤层

updateFollowers: fn()
更新跟随者坐标

updateHeroIcon: fn(name: string)
更新状态栏的勇士图标

updateStatusBar: fn(doNotCheckAutoEvents?: bool)
立刻刷新状态栏和地图显伤
doNotCheckAutoEvents: 是否不检查自动事件

updateViewport: fn()
更新大地图的可见区域

waitHeroToStop: fn(callback?: fn())
等待主角停下
例如：core.waitHeroToStop(core.vibrate); // 等待主角停下，然后视野左右抖动1秒
callback: 主角停止后的回调函数
```

## enemys.js

定义了一系列和怪物相关的API函数。

```text
canBattle: fn(enemy: string|enemy, x?: number, y?: number, floorId?: string) -> bool
判定主角当前能否打败某只敌人
例如：core.canBattle('greenSlime',0,0,'MT0') // 能否打败主塔0层左上角的绿头怪（假设有）
enemy: 敌人id或敌人对象
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
floorId: 敌人所在的地图，可选
返回值：true表示可以打败，false表示无法打败

getCurrentEnemys: fn(floorId?: string) -> [enemy]
获得某张地图的敌人集合，用于手册绘制
例如：core.getCurrentEnemys('MT0') // 主塔0层的敌人集合
floorId: 地图id，可选
返回值：敌人集合，按伤害升序排列，支持多朝向怪合并

getDamage: fn(enemy: string|enemy, x?: number, y?: number, floorId?: string) -> number
获得某只敌人对主角的总伤害
例如：core.getDamage('greenSlime',0,0,'MT0') // 绿头怪的总伤害
enemy: 敌人id或敌人对象
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
floorId: 敌人所在的地图，可选
返回值：总伤害，如果因为没有破防或无敌怪等其他原因无法战斗，则返回null

getDamageInfo: fn(enemy: string|enemy, hero?: ?, x?: number, y?: number, floorId?: string) -> {damage: number, per_damage: number, hero_per_damage: number, init_damage: number, mon_hp: number, mon_atk: number, mon_def: number, turn: number}
获得战斗伤害信息
例如：core.getDamage('greenSlime',0,0,'MT0') // 绿头怪的总伤害
enemy: 敌人id或敌人对象
hero: 可选，此时的勇士属性
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
floorId: 敌人所在的地图，可选
返回值：伤害计算信息，如果因为没有破防或无敌怪等其他原因无法战斗，则返回null

getDamageString: fn(enemy: string|enemy, x?: number, y?: number, floorId?: string) -> {color: string, damage: string}
获得某只敌人的地图显伤，包括颜色
例如：core.getDamageString('greenSlime', 0, 0, 'MT0') // 绿头怪的地图显伤
enemy: 敌人id或敌人对象
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
floorId: 敌人所在的地图，可选
返回值：damage: 表示伤害值或为'???'，color: 形如'#RrGgBb'

getDefDamage: fn(enemy: string|enemy, k?: number, x?: number, y?: number, floorId?: string) -> number
计算再加若干点防御能使某只敌人对主角的总伤害降低多少
例如：core.getDefDamage('greenSlime', 10, 0, 0, 'MT0') // 再加10点防御能使绿头怪的伤害降低多少
enemy: 敌人id或敌人对象
k: 假设主角增加的防御力，可选，默认为1
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
floorId: 敌人所在的地图，可选

getEnemyInfo: fn(enemy: string|enemy, hero?: ?, x?: number, y?: number, floorId?: string) -> {hp: number, atk: number, def: number, money: number, exp: number, special: [number], point: number, guards: [?]}
获得怪物真实属性
hero: 可选，此时的勇士属性
此函数将会计算包括坚固、模仿、光环等若干效果，将同时被怪物手册和伤害计算调用

getEnemys: fn()
获得所有怪物原始数据的一个副本。
请使用core.material.enemys获得当前各项怪物属性。

getEnemyValue: fn(enemy?: string|enemy, name: string, x?: number, y?: number, floorId?: string)
获得某个点上怪物的某个属性值

getSpecialColor: fn(enemy: string|enemy) -> [string]
获得某个怪物所有特殊属性的颜色

getSpecialFlag: fn(enemy: string|enemy) -> number
获得某个怪物所有特殊属性的额外标记。

例如，1为全图性技能，需要进行遍历全图（光环/支援等)

getSpecialHint: fn(enemy: string|enemy, special: number) -> string
获得某种敌人的某种特殊属性的介绍
例如：core.getSpecialHint('bat', 1) // '先攻：怪物首先攻击'
enemy: 敌人id或敌人对象，用于确定属性的具体数值，否则可选
special: 属性编号，可以是该敌人没有的属性
返回值：属性的介绍，以属性名加中文冒号开头

getSpecialText: fn(enemy: string|enemy) -> [string]
获得某种敌人的全部特殊属性名称
例如：core.getSpecialText('greenSlime') // ['先攻', '3连击', '破甲', '反击']
enemy: 敌人id或敌人对象，如core.material.enemys.greenSlime
返回值：字符串数组

getSpecials: fn() -> [[?]]
获得所有特殊属性的定义

hasEnemyLeft: fn(enemyId?: string, floorId?: string|[string]) -> bool
检查某些楼层是否还有漏打的（某种）敌人
例如：core.hasEnemyLeft('greenSlime', ['sample0', 'sample1']) // 样板0层和1层是否有漏打的绿头怪
enemyId: 敌人id，可选，null表示任意敌人
floorId: 地图id或其数组，可选，不填为当前地图
返回值：地图中是否还存在该种敌人

hasSpecial: fn(special: number|[number]|string|number, test: number) -> bool
判定某种特殊属性的有无
例如：core.hasSpecial('greenSlime', 1) // 判定绿头怪有无先攻属性
special: 敌人id或敌人对象或正整数数组或自然数
test: 待检查的属性编号


nextCriticals: fn(enemy: string|enemy, number?: number, x?: number, y?: number, floorId?: string) -> [[number]]
获得某只敌人接下来的若干个临界及其减伤，算法基于useLoop开关选择回合法或二分法
例如：core.nextCriticals('greenSlime', 9, 0, 0, 'MT0') // 绿头怪接下来的9个临界
enemy: 敌人id或敌人对象
number: 要计算的临界数量，可选，默认为1
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
floorId: 敌人所在的地图，可选
返回：两列的二维数组，每行表示一个临界及其减伤
```

## events.js

events.js将处理所有和事件相关的操作，主要分为五个部分：
- 游戏的开始和结束
- 系统事件的处理
- 自定义事件的处理
- 点击状态栏图标所进行的操作
- 一些具体事件的执行内容

```text
afterBattle: fn(enemyId?: string, x?: number, y?: number)
战斗结束后触发的事件

afterChangeFloor: fn(floorId?: string)
转换楼层结束的事件

afterGetItem: fn(id?: string, x?: number, y?: number, isGentleClick?: bool)
获得一个道具后的事件

afterOpenDoor: fn(doorId?: string, x?: number, y?: number)
开一个门后触发的事件

afterPushBox: fn()
推箱子后的事件

autoEventExecuted: fn(symbol?: string, value?: ?) -> bool
当前是否执行过某个自动事件

autoEventExecuting: fn(symbol?: string, value?: ?) -> bool
当前是否在执行某个自动事件

battle: fn(id: string, x?: number, y?: number, force?: bool, callback?: fn())
战斗，如果填写了坐标就会删除该点的敌人并触发战后事件
例如：core.battle('greenSlime'); // 和从天而降的绿头怪战斗（如果打得过）
id: 敌人id，必填
x: 敌人的横坐标，可选
y: 敌人的纵坐标，可选
force: true表示强制战斗，可选
callback: 回调函数，可选

beforeBattle: fn(enemyId?: string, x?: number, y?: number) -> bool
战斗前触发的事件；返回false代表不进行战斗

changeFloor: fn(floorId: string, stair?: string, heroLoc?: {x?: number, y?: number, direction?: string}, time?: number, callback?: fn())
场景切换
例如：core.changeFloor('MT0'); // 传送到主塔0层，主角坐标和朝向不变，黑屏时间取用户定义的值
floorId: 传送的目标地图id，可以填':before'和':next'分别表示楼下或楼上
stair: 传送的位置
heroLoc: 传送的坐标；会覆盖stair
time: 传送的黑屏时间，单位为毫秒；不填为用户设置值
callback: 传送的回调函数
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

changingFloor: fn(floorId?: string, heroLoc?: {x: number, y: number, direction: string})
楼层转换中

checkAutoEvents: fn()
检测自动事件

checkLvUp: fn()
检查升级事件

clearTextBox: fn(code: number)
清除对话框

closeDoor: fn(x: number, y: number, id: string, callback?: fn())
关门，目标点必须为空地
例如：core.closeDoor(0, 0, 'yellowWall', core.jumpHero); // 在左上角关掉一堵黄墙，然后主角原地跳跃半秒
x: 横坐标
y: 纵坐标
id: 门的id，也可以用三种基础墙
callback: 门完全关上后的回调函数，可选
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

confirmRestart: fn()
询问是否需要重新开始

doAction: fn()
执行下一个事件指令，常作为回调
例如：core.setCurtain([0,0,0,1], undefined, null, core.doAction); // 事件中的原生脚本，配合勾选“不自动执行下一个事件”来达到此改变色调只持续到下次场景切换的效果

doEvent: fn(data?: ?, x?: number, y?: number, prefix?: string)
执行一个自定义事件

doSystemEvent: fn(type: string, data?: ?, callback?: fn())
执行一个系统事件

eventMoveHero: fn(steps: [step], time?: number, callback?: fn())
强制移动主角（包括后退），这个函数的作者已经看不懂这个函数了
例如：core.eventMoveHero(['forward'], 125, core.jumpHero); // 主角强制前进一步，用时1/8秒，然后主角原地跳跃半秒
steps: 步伐数组，注意后退时跟随者的行为会很难看
time: 每步的用时，单位为毫秒。0或不填则取主角的移速，如果后者也不存在就取0.1秒
callback: 移动完毕后的回调函数，可选
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

flyTo: fn(toId?: string, callback?: fn()) -> bool
飞往某一层

follow: fn(name: string)
跟随
name: 要跟随的一个合法的4x4的行走图名称，需要在全塔属性注册

gameOver: fn(ending?: string, fromReplay?: bool, norank?: bool)
游戏结束
例如：core.gameOver(); // 游戏失败
ending: 结局名，省略表示失败
fromReplay: true表示在播放录像，可选
norank: true表示不计入榜单，可选

getCommonEvent: fn(name: string) -> [?]
获得一个公共事件

getItem: fn(id: string, num?: number, x?: number, y?: number, callback?: fn())
获得道具并提示，如果填写了坐标就会删除该点的该道具
例如：core.getItem('book'); // 获得敌人手册并提示
id: 道具id，必填
num: 获得的数量，不填视为1，填了就别填坐标了
x: 道具的横坐标，可选
y: 道具的纵坐标，可选
callback: 回调函数，可选

getNextItem: fn(noRoute?: bool)
轻按获得面前的物品或周围唯一物品
noRoute: 若为true则不计入录像

hasAsync: fn() -> bool
当前是否有未处理完毕的异步事件（不包含动画和音效）

hasVisitedFloor: fn(floorId?: string) -> bool
是否到达过某个楼层

hideImage: fn(code: number, time?: number, callback?: fn())
隐藏一张图片
例如：core.hideImage(1, 1000, core.jumpHero); // 1秒内淡出1号图片，然后主角原地跳跃半秒
code: 图片编号
time: 淡出时间，单位为毫秒
callback: 图片完全消失后的回调函数，可选

insertAction: fn(action: string|?|[?], x?: number, y?: number, callback?: fn(), addToLast?: bool)
插入一段事件；此项不可插入公共事件，请用 core.insertCommonEvent
例如：core.insertAction('一段文字'); // 插入一个显示文章
action: 单个事件指令，或事件指令数组
x: 新的当前点横坐标，可选
y: 新的当前点纵坐标，可选
callback: 新的回调函数，可选
addToLast: 插入的位置，true表示插入到末尾，否则插入到开头

insertCommonEvent: fn(name?: string, args?: [?], x?: number, y?: number, callback?: fn(), addToLast?: bool)
插入一个公共事件
例如：core.insertCommonEvent('加点事件', [3]);
name: 公共事件名；如果公共事件不存在则直接忽略
args: 参数列表，为一个数组，将依次赋值给 flag:arg1, flag:arg2, ...
x: 新的当前点横坐标，可选
y: 新的当前点纵坐标，可选
callback： 新的回调函数，可选
addToLast: 插入的位置，true表示插入到末尾，否则插入到开头

jumpHero: fn(ex?: number, ey?: number, time?: number, callback?: fn())
主角跳跃，跳跃勇士。ex和ey为目标点的坐标，可以为null表示原地跳跃。time为总跳跃时间。
例如：core.jumpHero(); // 主角原地跳跃半秒
ex: 跳跃后的横坐标
ey: 跳跃后的纵坐标
time: 跳跃时长，单位为毫秒。不填视为半秒
callback: 跳跃完毕后的回调函数，可选
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

load: fn(fromUserAction?: bool)
点击读档按钮时的打开操作

lose: fn(reason?: string)
游戏失败事件

moveEnemyOnPoint: fn(fromX: number, fromY: number, toX: number, toY: number, floorId?: string)
将某个点已经设置的敌人属性移动到其他点

moveImage: fn(code: number, to?: [number], opacityVal?: number, moveMode?: string, time?: number, callback?: fn())
移动一张图片并/或改变其透明度
例如：core.moveImage(1, null, 0.5); // 1秒内把1号图片变为50%透明
code: 图片编号
to: 新的左上角坐标，省略表示原地改变透明度
opacityVal: 新的透明度，省略表示不变
moveMode: 移动模式
time: 移动用时，单位为毫秒。不填视为1秒
callback: 图片移动完毕后的回调函数，可选

moveTextBox: fn(code: number, loc: [number], relative?: bool, moveMode?: string, time?: number, callback?: fn())
移动对话框

onSki: fn(number?: number) -> bool
当前是否在冰上

openBook: fn(fromUserAction?: bool)
点击怪物手册时的打开操作

openDoor: fn(x: number, y: number, needKey?: bool, callback?: fn())
开门（包括三种基础墙）
例如：core.openDoor(0, 0, true, core.jumpHero); // 打开左上角的门，需要钥匙，然后主角原地跳跃半秒
x: 门的横坐标
y: 门的纵坐标
needKey: true表示需要钥匙，会导致机关门打不开
callback: 门完全打开后或打不开时的回调函数，可选
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

openEquipbox: fn(fromUserAction?: bool)
点击装备栏时的打开操作

openKeyBoard: fn(fromUserAction?: bool)
点击虚拟键盘时的打开操作

openQuickShop: fn(fromUserAction?: bool)
点击快捷商店按钮时的打开操作

openSettings: fn(fromUserAction?: bool)
点击设置按钮时的操作

openToolbox: fn(fromUserAction?: bool)
点击工具栏时的打开操作

popEventLoc: fn()
将当前点坐标入栈

precompile: fn(data?: ?)
预编辑事件

pushBox: fn(data?: ?)
推箱子

pushEventLoc: fn(x?: number, y?: number, floorId?: string) -> bool
将当前点坐标入栈

recoverEvents: fn(data?: ?)
恢复一个事件

registerEvent: fn(type: string, func: fn(data: ?, x?: number, y?: number, prefix?: string))
注册一个自定义事件
type: 事件类型
func: 事件的处理函数，可接受(data, x, y, prefix)参数
data为事件内容，x和y为当前点坐标（可为null），prefix为当前点前缀

registerSystemEvent: fn(type: string, func: fn(data?: ?, callback?: fn()))
注册一个系统事件
type: 事件名
func: 为事件的处理函数，可接受(data,callback)参数

resetEnemyOnPoint: fn(x: number, y: number, floorId?: string)
重置某个点的怪物属性

resetGame: fn(hero?: ?, hard?: ?, floorId?: string, maps?: ?, values?: ?)
初始化游戏

restart: fn()
重新开始游戏；此函数将回到标题页面

rotateImage: fn(code: number, center?: [number], angle?: number, moveMode?: string, time?: number, callback?: fn())
旋转一张图片
code: 图片编号
center: 旋转中心像素坐标（以屏幕为基准）；不填视为图片本身中心
angle: 旋转角度；正数为顺时针，负数为逆时针
moveMode: 旋转模式
time: 旋转用时，单位为毫秒。不填视为1秒
callback: 图片旋转完毕后的回调函数，可选

save: fn(fromUserAction?: bool)
点击存档按钮时的打开操作

scaleImage: fn(code: number, center?: [number], scale?: number, moveMode?: string, time?: number, callback?: fn())
放缩一张图片

setEnemy: fn(id: string, name: string, value: ?, operator?: string, prefix?: string)
设置一项敌人属性并计入存档
例如：core.setEnemy('greenSlime', 'def', 0); // 把绿头怪的防御设为0
id: 敌人id
name: 属性的英文缩写
value: 属性的新值，可选
operator: 运算操作符，可选
prefix: 独立开关前缀，一般不需要，下同

setEnemyOnPoint: fn(x: number, y: number, floorId?: string, name: string, value: ?, operator?: string, prefix?: string)
设置某个点的敌人属性。如果该点不是怪物，则忽略此函数。
例如：core.setEnemyOnPoint(3, 5, null, 'atk', 100, '+='); // 仅将(3,5)点怪物的攻击力加100。

setEvents: fn(list?: [?], x?: number, y?: number, callback?: fn())
直接设置事件列表

setFloorInfo: fn(name: string, values: ?, floorId?: string, prefix?: string)
设置一项楼层属性并刷新状态栏
例如：core.setFloorInfo('ratio', 2, 'MT0'); // 把主塔0层的血瓶和宝石变为双倍效果
name: 要修改的属性名
values: 属性的新值。
floorId: 楼层id，不填视为当前层
prefix: 独立开关前缀，一般不需要

setGlobalAttribute: fn(name: string, value: string)
设置全塔属性

setGlobalFlag: fn(name: string, value: bool)
设置一个系统开关
例如：core.setGlobalFlag('steelDoorWithoutKey', true); // 使全塔的所有铁门都不再需要钥匙就能打开
name: 系统开关的英文名
value: 开关的新值，您可以用!core.flags[name]简单地表示将此开关反转

setHeroIcon: fn(name: string, noDraw?: bool)
更改主角行走图
例如：core.setHeroIcon('npc48.png', true); // 把主角从阳光变成样板0层左下角的小姐姐，但不立即刷新
name: 新的行走图文件名，可以是全塔属性中映射前的中文名。映射后会被存入core.status.hero.image
noDraw: true表示不立即刷新（刷新会导致大地图下视野重置到以主角为中心）

setNameMap: fn(name: string, value?: string)
设置文件别名

setTextAttribute: fn(data: ?)
设置剧情文本的属性

setValue: fn(name: string, operator: string, value: ?, prefix?: string)
数值操作

setVolume: fn(value: number, time?: number, callback?: fn())
调节bgm的音量
例如：core.setVolume(0, 100, core.jumpHero); // 0.1秒内淡出bgm，然后主角原地跳跃半秒
value: 新的音量，为0或不大于1的正数。注意系统设置中是这个值的平方根的十倍
time: 渐变用时，单位为毫秒。不填或小于100毫秒都视为0
callback: 渐变完成后的回调函数，可选

showGif: fn(name?: string, x?: number, y?: number)
绘制一张动图或擦除所有动图
例如：core.showGif(); // 擦除所有动图
name: 动图文件名，可以是全塔属性中映射前的中文名
x: 动图在视野中的左上角横坐标
y: 动图在视野中的左上角纵坐标

showImage: fn(code: number, image: string|image, sloc?: [number], loc?: [number], opacityVal?: number, time?: number, callback?: fn())
显示一张图片
例如：core.showImage(1, core.material.images.images['winskin.png'], [0,0,128,128], [0,0,416,416], 0.5, 1000); // 裁剪winskin.png的最左边128×128px，放大到铺满整个视野，1秒内淡入到50%透明，编号为1
code: 图片编号，为不大于50的正整数，加上100后就是对应画布层的z值，较大的会遮罩较小的，注意色调层的z值为125，UI层为140
image: 图片文件名（可以是全塔属性中映射前的中文名）或图片对象（见上面的例子）
sloc: 一行且至多四列的数组，表示从原图裁剪的左上角坐标和宽高，可选
loc: 一行且至多四列的数组，表示图片在视野中的左上角坐标和宽高，可选
opacityVal: 不透明度，为小于1的正数。不填视为1
time: 淡入时间，单位为毫秒。不填视为0
callback: 图片完全显示出来后的回调函数，可选

startEvents: fn(list?: [?], x?: number, y?: number, callback?: fn())
开始执行一系列自定义事件

startGame: fn(hard: string, seed: number, route: string, callback?: fn())
开始新游戏
例如：core.startGame('咸鱼乱撞', 0, ''); // 开始一局咸鱼乱撞难度的新游戏，随机种子为0
hard: 难度名，会显示在左下角（横屏）或右下角（竖屏）
seed: 随机种子，相同的种子保证了录像的可重复性
route: 经由base64压缩后的录像，用于从头开始的录像回放
callback: 回调函数，可选

stopAsync: fn()
立刻停止所有正在进行的异步事件

trigger: fn(x?: number, y?: number, callback?: fn())
触发(x,y)点的系统事件；会执行该点图块的script属性，同时支持战斗（会触发战后）、道具（会触发道具后）、楼层切换等等
callback: 执行完毕的回调函数
【异步脚本，请勿在脚本中直接调用（而是使用对应的事件），否则可能导致录像出错】

tryUseItem: fn(itemId: string)
尝试使用一个道具
例如：core.tryUseItem('pickaxe'); // 尝试使用破墙镐
itemId: 道具id，其中敌人手册、传送器和飞行器会被特殊处理

unfollow: fn(name?: string)
取消跟随
name: 取消跟随的行走图，不填则取消全部跟随者

unregisterEvent: fn(type: string)
注销一个自定义事件

unregisterSystemEvent: fn(type: string)
注销一个系统事件

useFly: fn(fromUserAction?: bool)
点击楼层传送器时的打开操作

vibrate: fn(direction?: string, time?: number, speed?: number, power?: number, callback?: fn())
视野抖动
例如：core.vibrate(); // 视野左右抖动1秒
direction: 抖动方向；可填 horizontal(左右)，vertical（上下），diagonal1（左上右下），diagonal2（左下右上）
time: 抖动时长，单位为毫秒
speed: 抖动速度
power: 抖动幅度
callback: 抖动平息后的回调函数，可选

visitFloor: fn(floorId?: string)
到达某楼层

win: fn(reason?: string, norank?: bool, noexit?: bool)
游戏获胜事件
```

## icons.js

图标信息

```text
getAllIconIds: fn() -> [string]
获得所有图标的ID

getClsFromId: fn(id?: string) -> string
根据ID获得其图标类型

getIcons: fn()
获得所有图标类型

getTilesetOffset: fn(id?: string) -> {image: ?, x: number, y: number}
根据图块数字或ID获得所在的tileset和坐标信息
```

## items.js

道具相关的函数

```text
addItem: fn(itemId: string, itemNum?: number)
静默增减某种道具的持有量 不会更新游戏画面或是显示提示
例如：core.addItem('yellowKey', -2) // 没收两把黄钥匙
itemId: 道具id
itemNum: 增加量，负数表示没收

canEquip: fn(equipId: string, hint?: bool) -> bool
检查能否穿上某件装备
例如：core.canEquip('sword5', true) // 主角可以装备神圣剑吗，如果不能会有提示
equipId: 装备id
hint: 无法穿上时是否提示（比如是因为未持有还是别的什么原因）
返回值：true表示可以穿上，false表示无法穿上

canUseItem: fn(itemId: string) -> bool
检查能否使用某种道具
例如：core.canUseItem('pickaxe') // 能否使用破墙镐
itemId: 道具id
返回值：true表示可以使用

compareEquipment: fn(compareEquipId: string, beComparedEquipId: string) -> {value: ?, percentage: ?}
比较两件（类型可不同）装备的优劣
例如：core.compareEquipment('sword5', 'shield5') // 比较神圣剑和神圣盾的优劣
compareEquipId: 装备甲的id
beComparedEquipId: 装备乙的id
返回值：两装备的各属性差，甲减乙，0省略

getEquip: fn(equipType: number) -> string
检查主角某种类型的装备目前是什么
例如：core.getEquip(1) // 主角目前装备了什么盾牌
equipType: 装备类型，自然数
返回值：装备id，null表示未穿戴

getEquipTypeById: fn(equipId: string) -> number
判定某件装备的类型
例如：core.getEquipTypeById('shield5') // 1（盾牌）
equipId: 装备id
返回值：类型编号，自然数

getEquipTypeByName: fn(name?: string)
根据类型获得一个可用的装备孔

getItemEffect: fn(itemId: string, itemNum?: number)
即捡即用类的道具获得时的效果
例如：core.getItemEffect('redPotion', 10) // 执行获得10瓶红血的效果
itemId: 道具id
itemNum: 道具数量，可选，默认为1

getItemEffectTip: fn(itemId: string) -> string
即捡即用类的道具获得时的额外提示
例如：core.getItemEffectTip(redPotion) // （获得 红血瓶）'，生命+100'
itemId: 道具id
返回值：图块属性itemEffectTip的内容

getItems: fn()
获得所有道具

hasEquip: fn(itemId: string) -> bool
检查主角是否穿戴着某件装备
例如：core.hasEquip('sword5') // 主角是否装备了神圣剑
itemId: 装备id
返回值：true表示已装备

hasItem: fn(itemId: string) -> bool
检查主角是否持有某种道具(不包括已穿戴的装备)
例如：core.hasItem('yellowKey') // 主角是否持有黄钥匙
itemId: 道具id
返回值：true表示持有

itemCount: fn(itemId: string) -> number
统计某种道具的持有量
例如：core.itemCount('yellowKey') // 持有多少把黄钥匙
itemId: 道具id
返回值：该种道具的持有量，不包括已穿戴的装备

loadEquip: fn(equipId: string, callback?: fn())
尝试穿上某件背包里面的装备并提示
例如：core.loadEquip('sword5') // 尝试装备上背包里面的神圣剑，无回调
equipId: 装备id
callback: 穿戴成功或失败后的回调函数

quickLoadEquip: fn(index: number)
快速换装
例如：core.quickLoadEquip(1) // 快速换上1号套装
index: 套装编号，自然数

quickSaveEquip: fn(index: number)
保存当前套装
例如：core.quickSaveEquip(1) // 将当前套装保存为1号套装
index: 套装编号，自然数

removeItem: fn(itemId?: string, itemNum?: number)
删除某个物品

setEquip: fn(equipId: string, valueType: string, name: string, value: ?, operator?: string, prefix?: string)
设置某个装备的属性并计入存档
例如：core.setEquip('sword1', 'value', 'atk', 300, '+='); // 设置铁剑的攻击力数值再加300
equipId: 装备id
valueType: 增幅类型，只能是value（数值）或percentage（百分比）
name: 要修改的属性名称，如atk
value: 要修改到的属性数值
operator: 操作符，可选，如+=表示在原始值上增加
prefix: 独立开关前缀，一般不需要

setItem: fn(itemId: string, itemNum?: number)
设置某种道具的持有量
例如：core.setItem('yellowKey', 3) // 设置黄钥匙为3把
itemId: 道具id
itemNum: 新的持有量，可选，自然数，默认为0

unloadEquip: fn(equipType: number, callback?: fn())
脱下某个类型的装备
例如：core.unloadEquip(1) // 卸下盾牌，无回调
equipType: 装备类型编号，自然数
callback: 卸下装备后的回调函数

useItem: fn(itemId: string, noRoute?: bool, callback?: fn())
使用一个道具
例如：core.useItem('pickaxe', true) // 使用破墙镐，不计入录像，无回调
itemId: 道具id
noRoute: 是否不计入录像，快捷键使用的请填true，否则可省略
callback: 道具使用完毕或使用失败后的回调函数
```

## loader.js

资源加载相关的函数

```text
freeBgm: fn(name: string)
释放一个bgm的缓存

loadBgm: fn(name: string)
加载一个bgm

loadImage: fn(dir: name, imgName: name, callback?: fn())
加载某一张图片

loadImages: fn(dir: string, names: [string], toSave: ?, callback?: fn()) 
加载一系列图片

loadImagesFromZip: fn(url: string, names: [string], toSave?: ?, onprogress?: ?, onfinished?: ?)
从zip中加载一系列图片

loadOneMusic: fn(name: string)
加载一个音乐或音效

loadOneSound: fn(name: string)
加载一个音效
```

## maps.js

负责一切和地图相关的处理内容，包括如下几个方面：
- 地图的初始化，保存和读取，地图数组的生成
- 是否可移动或瞬间移动的判定
- 地图的绘制
- 获得某个点的图块信息
- 启用和禁用图块，改变图块
- 移动/跳跃图块，淡入淡出图块
- 全局动画控制，动画的绘制

```text
addGlobalAnimate: fn(block?: block)
添加一个全局动画

animateBlock: fn(loc?: [number]|[[number]], type?: string|number, time?: number, callback?: fn())
显示/隐藏某个块时的动画效果

animateSetBlock: fn(number: number|string, x: number, y: number, floorId?: string, time?: number, callback?: fn())
动画形式转变某点图块

animateSetBlocks: fn(number: number|string, locs: [?], floorId?: string, time?: number, callback?: fn())
动画形式同时转变若干点图块

automaticRoute: fn(destX: number, destY: number) -> [{x: number, y: number, direction: string}]
自动寻路
例如：core.automaticRoute(0, 0); // 自动寻路到地图左上角
destX: 目标点的横坐标
destY: 目标点的纵坐标
返回值：每步走完后主角的loc属性组成的一维数组

canMoveDirectly: fn(destX: number, destY: number) -> number
能否瞬移到某点，并求出节约的步数。
例如：core.canMoveDirectly(0, 0); // 能否瞬移到地图左上角
destX: 目标点的横坐标
destY: 目标点的纵坐标
返回值：正数表示节约的步数，-1表示不可瞬移

canMoveDirectlyArray: fn(locs?: [[number]])
获得某些点可否通行的信息

canMoveHero: fn(x?: number, y?: number, direction?: string, floorId?: string) -> bool
单点单朝向的可通行性判定；受各图层cannotInOut、起点cannotMove和canGoDeadZone影响，不受canPass和noPass影响
x: 起点横坐标，不填视为主角当前的
y: 起点纵坐标，不填视为主角当前的
direction: 移动的方向，不填视为主角面对的方向
floorId: 地图id，不填视为当前地图

compressMap: fn(mapArr: [[number]], floorId?: string) -> [[number]]
压缩地图

decompressMap: fn(mapArr: [[number]], floorId?: string) -> [[number]]
解压缩地图

drawAnimate: fn(name: string, x: number, y: number, alignWindow: bool, callback?: fn()) -> number
播放动画，注意即使指定了主角的坐标也不会跟随主角移动，如有需要请使用core.drawHeroAnimate(name, callback)函数
例如：core.drawAnimate('attack', core.nextX(), core.nextY(), false, core.vibrate); // 在主角面前一格播放普攻动画，动画停止后视野左右抖动1秒
name: 动画文件名，不含后缀
x: 横坐标
y: 纵坐标
alignWindow: 是否是相对窗口的坐标
callback: 动画停止后的回调函数，可选
返回值：一个数字，可作为core.stopAnimate()的参数来立即停止播放（届时还可选择是否执行此次播放的回调函数）

drawBg: fn(floorId?: string, ctx?: CanvasRenderingContext2D)
绘制背景层（含贴图，其与背景层矩阵的绘制顺序可通过复写此函数来改变）
例如：core.drawBg(); // 绘制当前地图的背景层
floorId: 地图id，不填视为当前地图
ctx: 某画布的ctx，用于绘制缩略图，一般不需要

drawBlock: fn(block?: block, animate?: number)
绘制一个图块

drawBoxAnimate: fn()
绘制UI层的box动画

drawEvents: fn(floorId?: string, blocks?: [block], ctx?: CanvasRenderingContext2D)
绘制事件层
例如：core.drawEvents(); // 绘制当前地图的事件层
floorId: 地图id，不填视为当前地图
blocks: 一般不需要
ctx: 某画布的ctx，用于绘制缩略图，一般不需要

drawFg: fn(floorId?: string, ctx?: CanvasRenderingContext2D)
绘制前景层（含贴图，其与前景层矩阵的绘制顺序可通过复写此函数来改变）
例如：core.drawFg(); // 绘制当前地图的前景层
floorId: 地图id，不填视为当前地图
ctx: 某画布的ctx，用于绘制缩略图，一般不需要

drawHeroAnimate: fn(name: string, callback?: fn()) -> number
播放跟随勇士的动画
name: 动画名
callback: 动画停止后的回调函数，可选
返回值：一个数字，可作为core.stopAnimate()的参数来立即停止播放（届时还可选择是否执行此次播放的回调函数）

drawMap: fn(floorId?: string)
地图重绘
例如：core.drawMap(); // 重绘当前地图，常用于更改贴图或改变自动元件后的刷新
floorId: 地图id，可省略表示当前楼层
callback: 重绘完毕后的回调函数，可选

drawThumbnail: fn(floorId?: string, blocks?: [block], options?: ?)
绘制缩略图
例如：core.drawThumbnail(); // 绘制当前地图的缩略图
floorId: 地图id，不填视为当前地图
blocks: 一般不需要
options: 绘制信息，可选。可以增绘主角位置和朝向、采用不同于游戏中的主角行走图、增绘显伤、提供flags用于存读档，同时包含要绘制到的画布名或画布的ctx或还有其他信息，如起绘坐标、绘制大小、是否绘制全图、截取中心

enemyExists: fn(x: number, y: number, id?: string, floorId?: string) -> bool
某个点是否存在（指定的）怪物

extractBlocks: fn(map?: ?)
根据需求解析出blocks

extractBlocksForUI: fn(map?: ?, flags?: ?)
根据需求为UI解析出blocks

generateGroundPattern: fn(floorId?: string)
生成groundPattern

generateMovableArray: fn(floorId?: string) -> [[[string]]]
可通行性判定
例如：core.generateMovableArray(); // 判断当前地图主角从各点能向何方向移动
floorId: 地图id，不填视为当前地图
返回值：从各点可移动方向的三维数组

getBgMapArray: fn(floorId?: string, noCache?: bool) -> [[number]]
生成背景层矩阵
例如：core.getBgMapArray('MT0'); // 生成主塔0层的背景层矩阵，使用缓存
floorId: 地图id，不填视为当前地图
noCache: 可选，true表示不使用缓存
返回值：背景层矩阵，注意对其阵元的访问是[y][x]

getBgNumber: fn(x?: number, y?: number, floorId?: string, noCache?: bool) -> number
判定某点的背景层的数字
例如：core.getBgNumber(); // 判断主角脚下的背景层图块的数字
x: 横坐标，不填为勇士坐标
y: 纵坐标，不填为勇士坐标
floorId: 地图id，不填视为当前地图
noCache: 可选，true表示不使用缓存而强制重算

getBlock: fn(x: number, y: number, floorId?: string, showDisable?: bool) -> block
获得某个点的block

getBlockById: fn(id: string) -> block
根据ID获得图块

getBlockByNumber: fn(number: number) -> block
根据数字获得图块

getBlockCls: fn(x: number, y: number, floorId?: string, showDisable?: bool) -> string
判定某个点的图块类型
例如：if(core.getBlockCls(x1, y1) != 'enemys' && core.getBlockCls(x2, y2) != 'enemy48') core.openDoor(x3, y3); // 另一个简单的机关门事件，打败或炸掉这一对不同身高的敌人就开门
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图
showDisable: 隐藏点是否不返回null，true表示不返回null
返回值：图块类型，即“地形、四帧动画、矮敌人、高敌人、道具、矮npc、高npc、自动元件、额外地形”之一

getBlockFilter: fn(x: number, y: number, floorId?: string, showDisable?: bool) -> ?
获得某个点的图块特效

getBlockId: fn(x: number, y: number, floorId?: string, showDisable?: bool) -> string
判定某个点的图块id
例如：if(core.getBlockId(x1, y1) != 'greenSlime' && core.getBlockId(x2, y2) != 'redSlime') core.openDoor(x3, y3); // 一个简单的机关门事件，打败或炸掉这一对绿头怪和红头怪就开门
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图
showDisable: 隐藏点是否不返回null，true表示不返回null
返回值：图块id，该点无图块则返回null

getBlockInfo: fn(block?: number|string|block) -> blockInfo
获得某个图块或素材的信息，包括ID，cls，图片，坐标，faceIds等等

getBlockNumber: fn(x: number, y: number, floorId?: string, showDisable?: bool) -> number
判定某个点的图块数字
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图
showDisable: 隐藏点是否不返回null，true表示不返回null
返回值：图块数字，该点无图块则返回null

getBlockOpacity: fn(x: number, y: number, floorId?: string, showDisable?: bool) -> number
判定某个点的不透明度。如果该点无图块则返回null。

getFaceDownId: fn(block?: string|number|block) -> string
获得某个图块对应行走图朝向向下的那一项的id；如果不存在行走图绑定则返回自身id。

getFgMapArray: fn(floorId?: string, noCache?: bool) -> [[number]]
生成前景层矩阵
例如：core.getFgMapArray('MT0'); // 生成主塔0层的前景层矩阵，使用缓存
floorId: 地图id，不填视为当前地图
noCache: 可选，true表示不使用缓存
返回值：前景层矩阵，注意对其阵元的访问是[y][x]

getFgNumber: fn(x: number, y: number, floorId?: string, noCache?: bool) -> number
判定某点的前景层的数字
例如：core.getFgNumber(); // 判断主角脚下的前景层图块的数字
x: 横坐标，不填为勇士坐标
y: 纵坐标，不填为勇士坐标floorId: 地图id，不填视为当前地图
noCache: 可选，true表示不使用缓存而强制重算

getIdOfThis: fn(id?: string) -> string
获得当前事件点的ID

getMapArray: fn(floorId?: string, noCache?: bool) -> [[number]]
生成事件层矩阵
例如：core.getMapArray('MT0'); // 生成主塔0层的事件层矩阵，隐藏的图块视为0
floorId: 地图id，不填视为当前地图
showDisable: 可选，true表示隐藏的图块也会被表示出来
返回值：事件层矩阵，注意对其阵元的访问是[y][x]

getMapBlocksObj: fn(floorId?: string, noCache?: bool)
以x,y的形式返回每个点的事件

getMapNumber: fn(x: number, y: number, floorId?: string, noCache?: bool) -> number
获得事件层某个点的数字

getNumberById: fn(id: string) -> number
根据图块id得到数字（地图矩阵中的值）
例如：core.getNumberById('yellowWall'); // 1
id: 图块id
返回值：图块的数字，定义在project\maps.js（请注意和project\icons.js中的“图块索引”相区分！）

getPlayingAnimates: fn(name?: string) -> [number]
获得当前正在播放的所有（指定）动画的id列表
name: 动画名；不填代表返回全部正在播放的动画
返回值: 一个数组，每一项为一个正在播放的动画；可用core.stopAnimate停止播放。

hideBgFgMap: fn(name?: string, loc?: [number]|[[number]], floorId?: string, callback?: fn())
隐藏前景/背景地图

hideBlock: fn(x: number, y: number, floorId?: string)
隐藏一个图块，对应于「隐藏事件」且不删除
例如：core.hideBlock(0, 0); // 隐藏地图左上角的图块
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图

hideBlockByIndex: fn(index?: number, floorId?: string)
根据图块的索引来隐藏图块

hideBlockByIndexes: fn(indexes?: [number], floorId?: string)
一次性隐藏多个block

hideFloorImage: fn(loc?: [number]|[[number]], floorId?: string, callback?: fn())
隐藏一个楼层贴图

initBlock: fn(x: number, y: number, id: string|number, addInfo?: bool, eventFloor?: ?) -> block
初始化一个图块

isMapBlockDisabled: fn(floorId?: string, x?: number, y?: number, flags?: ?) -> bool
某个点图块是否被强制启用或禁用

jumpBlock: fn(sx: number, sy: number, ex: number, ey: number, time?: number, keep?: bool, callback?: fn())
跳跃图块；从V2.7开始不再有音效
例如：core.jumpBlock(0, 0, 0, 0); // 令地图左上角的图块原地跳跃半秒，再花半秒淡出
sx: 起点的横坐标
sy: 起点的纵坐标
ex: 终点的横坐标
ey: 终点的纵坐标
time: 单步和淡出用时，单位为毫秒。不填视为半秒
keep: 是否不淡出，true表示不淡出
callback: 落地或淡出后的回调函数，可选

loadFloor: fn(floorId?: string, map?: ?)
从文件或存档中加载某个楼层

loadMap: fn(data?: ?, floorId?: string, flags?: ?)
将存档中的地图信息重新读取出来

moveBlock: fn(x: number, y: number, steps: [string], time?: number, keep?: bool, callback?: fn())
移动图块
例如：core.moveBlock(0, 0, ['down']); // 令地图左上角的图块下移一格
x: 起点的横坐标
y: 起点的纵坐标
steps: 步伐数组
time: 单步和淡出用时，单位为毫秒。不填视为半秒
keep: 是否不淡出，true表示不淡出
callback: 移动或淡出后的回调函数，可选

nearStair: fn() -> bool
当前位置是否在楼梯边；在楼传平面塔模式下对箭头也有效

noPass: fn(x: number, y: number, floorId?: string) -> bool
判定某个点是否不可被踏入（不基于主角生命值和图块cannotIn属性）
例如：core.noPass(0, 0); // 判断地图左上角能否被踏入
x: 目标点的横坐标
y: 目标点的纵坐标
floorId: 目标点所在的地图id，不填视为当前地图
返回值：true表示可踏入

npcExists: fn(x: number, y: number, floorId?: string) -> bool
某个点是否存在NPC

removeBlock: fn(x: number, y: number, floorId?: string)
删除一个图块，对应于「隐藏事件」并同时删除
例如：core.removeBlock(0, 0); // 尝试删除地图左上角的图块
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图

removeBlockByIndex: fn(index: number, floorId?: string)
根据block的索引删除该块

removeBlockByIndexes: fn(indexes?: [number], floorId?: string)
一次性删除多个block

removeGlobalAnimate: fn(x?: number, y?: number, name?: string)
删除一个或所有全局动画

replaceBlock: fn(fromNumber: number, toNumber: number, floorId?: string|[string])
批量替换图块
例如：core.replaceBlock(21, 22, core.floorIds); // 把游戏中地上当前所有的黄钥匙都变成蓝钥匙
fromNumber: 旧图块的数字
toNumber: 新图块的数字
floorId: 地图id或其数组，不填视为当前地图

resetMap: fn(floorId?: string|[string])
重置地图

resizeMap: fn(floorId?: string)
更改地图画布的尺寸

saveMap: fn(floorId?: string)
将当前地图重新变成数字，以便于存档

searchBlock: fn(id: string, floorId?: string|[string], showDisable?: bool) -> [{floorId: string, index: number, x: number, y: number, block: block}]
搜索图块, 支持通配符和正则表达式
例如：core.searchBlock('*Door'); // 搜索当前地图的所有门
id: 图块id，支持星号表示任意多个（0个起）字符
floorId: 地图id或数组，不填视为当前地图
showDisable: 隐藏点是否计入，true表示计入
返回值：一个详尽的数组，一般只用到其长度

searchBlockWithFilter: fn(blockFilter: fn(block: block) -> bool, floorId?: string|[string], showDisable?: bool): [{floorId: string, index: number, x: number, y: number, block: block}]
根据给定的筛选函数搜索全部满足条件的图块
例如：core.searchBlockWithFilter(function (block) { return block.event.id.endsWith('Door'); }); // 搜索当前地图的所有门
blockFilter: 筛选函数，可接受block输入，应当返回一个boolean值
floorId: 地图id或数组，不填视为当前地图
showDisable: 隐藏点是否计入，true表示计入
返回值：一个详尽的数组

setBgFgBlock: fn(name: string, number: number|string, x: number, y: number, floorId?: string)
转变图层块
例如：core.setBgFgBlock('bg', 167, 6, 6); // 把当前地图背景层的中心块改为滑冰
name: 背景还是前景
number: 新图层块的数字（也支持纯数字字符串如'1'）或id
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图

setBlock: fn(number: number|string, x: number, y: number, floorId?: string)
转变图块
例如：core.setBlock(1, 0, 0); // 把地图左上角变成黄墙
number: 新图块的数字（也支持纯数字字符串如'1'）或id
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图

setBlockFilter: fn(filter?: ?, x?: number, y?: number, floorId?: string)
设置某个点图块的特效

setBlockOpacity: fn(opacity?: number, x?: number, y?: number, floorId?: string)
设置某个点图块的不透明度

setMapBlockDisabled: fn(floorId?: string, x?: number, y?: number, disabled?: bool)
设置某个点图块的强制启用或禁用状态

showBgFgMap: fn(name?: string, loc?: [number]|[[number]], floorId?: string, callback?: fn())
显示前景/背景地图

showBlock: fn(x: number, y: number, floorId?: string)
显示（隐藏或显示的）图块，此函数将被“显示事件”指令和勾选了“不消失”的“移动/跳跃事件”指令（如阻击怪）的终点调用
例如：core.showBlock(0, 0); // 显示地图左上角的图块
x: 横坐标
y: 纵坐标
floorId: 地图id，不填视为当前地图

showFloorImage: fn(loc?: [number]|[[number]], floorId?: string, callback?: fn())
显示一个楼层贴图

stairExists: fn(x: number, y: number, floorId?: string) -> bool
某个点是否存在楼梯

stopAnimate: fn(id?: number, doCallback?: bool)
立刻停止一个动画播放
id: 播放动画的编号，即drawAnimate或drawHeroAnimate的返回值；不填视为停止所有动画
doCallback: 是否执行该动画的回调函数

terrainExists: fn(x: number, y: number, id?: string, floorId?: string) -> bool
某个点是否存在（指定的）地形

turnBlock: fn(direction?: string, x?: number, y?: number, floorId?: string)
事件转向
```

## ui.js

负责一切UI界面的绘制。主要包括三个部分：
- 设置某个画布的属性与在某个画布上绘制的相关API
- 具体的某个UI界面的绘制
- 动态创建画布相关的API

```text
calWidth: fn(name: string|CanvasRenderingContext2D, text: string, font?: string) -> number
计算某段文字的宽度
参考资料：https://www.w3school.com.cn/tags/canvas_measuretext.asp

clearMap: fn(name: string|CanvasRenderingContext2D, x?: number, y?: number, width?: number, height?: number)
清空某个画布图层
name为画布名，可以是系统画布之一，也可以是任意自定义动态创建的画布名；还可以直接传画布的context本身。
如果name也可以是'all'，若为all则为清空所有系统画布。
参考资料：https://www.w3school.com.cn/tags/canvas_clearrect.asp

clearUI: fn()
清空UI层内容

clearUIEventSelector: fn(codes?: number|[number])
清除若干个自绘的选择光标
codes: 清除的光标编号；可以是单个编号或编号数组；不填则清除所有光标

closePanel: fn()
结束一切事件和绘制，关闭UI窗口，返回游戏进程

createCanvas: fn(name: string, x: number, y: number, width: number, height: number, zIndex: number) -> CanvasRenderingContext2D
动态创建一个画布。
name： 要创建的画布名，如果已存在则会直接取用当前存在的。
x,y: 创建的画布相对窗口左上角的像素坐标
width,height: 创建的长宽。
zIndex: 创建的纵向高度（关系到画布之间的覆盖），z值高的将覆盖z值低的；系统画布的z值可在个性化中查看。
返回创建的画布的context，也可以通过core.dymCanvas[name]调用。

deleteAllCanvas: fn()
清空所有的自定义画布

deleteCanvas: fn(name: string|fn(name: string) -> bool)
删除一个自定义画布
name: 画布名；也可以传入一个filter对画布名进行筛选。

drawArrow: fn(name: string|CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number)
在某个canvas上绘制一个箭头

drawBackground: fn(left: string, top: string, right: string, bottom: string, posInfo?: {px: number, py: number, direction: string})
绘制一个背景图，可绘制winskin或纯色背景；支持小箭头绘制

drawBook: fn(index?: ?)
绘制怪物手册

drawChoices: fn(content?: string, choices?: [?], width?: number, ctx?: string|CanvasRenderingContext2D)
绘制一个选项界面

drawConfirmBox: fn(text: string, yesCallback?: fn(), noCallback?: fn())
绘制一个确认框
此项会打断事件流，如需不打断版本的请使用core.myconfirm()
text: 要绘制的内容，支持 ${} 语法
yesCallback: 点击确认后的回调
noCallback: 点击取消后的回调

drawFly: fn(page?: ?)
绘制楼层传送器

drawIcon: fn(name: string|CanvasRenderingContext2D, id: string, x: number, y: number, w?: number, h?: number, frame?: number)
在某个canvas上绘制一个图标

drawImage: fn(name: string|CanvasRenderingContext2D, image: string|image, x: number, y: number, w?: number, h?: number, x1?: number, y1?: number, w1?: number, h1?: number, angle?: number)
在一个画布上绘制图片
后面的8个坐标参数与canvas的drawImage的八个参数完全相同。
name: 可以是系统画布之一，也可以是任意自定义动态创建的画布名 画布名称或者画布的context
image: 要绘制的图片，可以是一个全塔属性中定义的图片名（会从images中去获取；支持加':x',':y',':o'翻转），图片本身，或者一个画布。
angle：旋转角度
参考资料：http://www.w3school.com.cn/html5/canvas_drawimage.asp

drawLine: fn(name: string|CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number)
在某个canvas上绘制一条线
参考资料：https://www.w3school.com.cn/tags/canvas_lineto.asp

drawPagination: fn(page?: ?, totalPage?: ?, y?: number)
绘制分页

drawScrollText: fn(content: string, time: number, lineHeight?: number, callback?: fn())
绘制滚动字幕

drawStatusBar: fn()
绘制状态栏

drawText: fn(contents: string, callback?: fn())
地图中间绘制一段文字

drawTextBox: fn(content: string, showAll?: bool)
绘制一个对话框

drawTextContent: fn(ctx: string|CanvasRenderingContext2D, content: string, config: ?)
绘制一段文字到某个画布上面
ctx: 要绘制到的画布
content: 要绘制的内容；转义字符不允许保留 \t, \b 和 \f
config: 绘制配置项，目前暂时包含如下内容（均为可选）
left, top：起始点位置；maxWidth：单行最大宽度；color：默认颜色；align：左中右
fontSize：字体大小；lineHeight：行高；time：打字机间隔；font：字体名
返回值：绘制信息

drawTip: fn(text: string, id?: string, frame?: number)
左上角绘制一段提示
text: 要提示的字符串，支持${}语法
id: 要绘制的图标ID
frame: 要绘制该图标的第几帧

drawUIEventSelector: fn(code: number, background: string, x: number, y: number, w: number, h: number, z?: number)
自绘一个闪烁的选择光标
code: 选择光标的编号，必填
background: 要绘制的光标背景，必须是一个合法的WindowSkin
x, y, w, h: 绘制的坐标和长宽
z: 可选，光标的的z值

drawWaiting: fn(text: string)
绘制等待界面

drawWindowSkin: fn(background: string, ctx: string|CanvasRenderingContext2D, x: number, y: number, w: string, h: string, direction?: string, px?: number, py?: number)
绘制WindowSkin

fillArc: fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, style?: string)
在某个canvas上绘制一个扇形
参考资料：https://www.w3school.com.cn/tags/canvas_arc.asp

fillBoldText: fn(name: string|CanvasRenderingContext2D, text: string, x: number, y: number, style?: string, strokeStyle?: string, font?: string, maxWidth?: number)
在某个画布上绘制一个描边文字
text: 要绘制的文本
style: 绘制的样式
strokeStyle: 要绘制的描边颜色
font: 绘制的字体
maxWidth: 最大宽度，超过此宽度会自动放缩

fillCircle: fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: number, style?: string)
在某个canvas上绘制一个圆
参考资料：https://www.w3school.com.cn/tags/canvas_arc.asp

fillEllipse: fn(name: string|CanvasRenderingContext2D, x: number, y: number, a: number, b: number, angle?: number, style?: string)
在某个canvas上绘制一个椭圆

fillPolygon: fn(name: string|CanvasRenderingContext2D, nodes?: [[number]], style?: string)
在某个canvas上绘制一个多边形

fillRect: fn(name: string|CanvasRenderingContext2D, x: number, y: number, width: number, height: number, style?: string, angle?: number)
绘制一个矩形。
x,y: 绘制的坐标
width,height: 绘制的长宽
style: 绘制的样式
angle: 旋转的角度，弧度制，如Math.PI/2代表90度
参考资料：https://www.w3school.com.cn/tags/canvas_fillrect.asp

fillRoundRect: fn(name: string|CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, style?: string, angle?: number)
在某个canvas上绘制一个圆角矩形

fillText: fn(name: string|CanvasRenderingContext2D, text: string, x: number, y: number, style?: string, font?: string, maxWidth?: number)
在某个画布上绘制一段文字
text: 要绘制的文本
style: 绘制的样式
font: 绘制的字体
maxWidth: 最大宽度，超过此宽度会自动放缩
参考资料：https://www.w3school.com.cn/tags/canvas_filltext.asp

getContextByName: fn(canvas: string|CanvasRenderingContext2D) -> CanvasRenderingContext2D
根据画布名找到一个画布的context；支持系统画布和自定义画布。如果不存在画布返回null。
也可以传画布的context自身，则返回自己。

getTextContentHeight: fn(content: string, config?: ?)
获得某段文字的预计绘制高度；参数说明详见 drawTextContent

getToolboxItems: fn(cls: string) -> [string]
获得所有应该在道具栏显示的某个类型道具

loadCanvas: fn(name: string|CanvasRenderingContext2D)
加载某个canvas状态

relocateCanvas: fn(name: string, x: number, y: number, useDelta: bool)
重新定位一个自定义画布

resizeCanvas: fn(name: string, x: number, y: number)
重新设置一个自定义画布的大小

rotateCanvas: fn(name: string, angle: number, centerX?: number, centerY?: number)
设置一个自定义画布的旋转角度
centerX, centerY: 旋转中心（以屏幕像素为基准）；不填视为图片正中心。

saveCanvas: fn(name: string|CanvasRenderingContext2D)
保存某个canvas状态

setAlpha: fn(name: string|CanvasRenderingContext2D, alpha: number) -> number
设置某个canvas接下来绘制的不透明度；不会影响已经绘制的内容
返回设置之前画布的不透明度。
如果需要修改画布本身的不透明度请使用setOpacity
参考资料：https://www.w3school.com.cn/tags/canvas_globalalpha.asp

setFillStyle: fn(name: string|CanvasRenderingContext2D, style: string)
设置某个canvas的绘制属性（如颜色等）
参考资料：https://www.w3school.com.cn/tags/canvas_fillstyle.asp

setFilter: fn(name: string|CanvasRenderingContext2D, filter: any)
设置某个canvas接下来绘制的filter

setFont: fn(name: string|CanvasRenderingContext2D, font: string)
设置某个canvas的文字字体
参考资料：https://www.w3school.com.cn/tags/canvas_font.asp

setFontForMaxWidth: fn(name: string|CanvasRenderingContext2D, text: string, maxWidth: number, font?: ?) -> string
根据最大宽度自动缩小字体

setLineWidth: fn(name: string|CanvasRenderingContext2D, lineWidth: number)
设置某个canvas的线宽度
参考资料：https://www.w3school.com.cn/tags/canvas_linewidth.asp

setOpacity: fn(name: string|CanvasRenderingContext2D, opacity: number)
设置某个canvas整体的透明度；此函数直接改变画布本身，对已经绘制的内容也生效
如果仅想对接下来的绘制生效请使用setAlpha

setStrokeStyle: fn(name: string|CanvasRenderingContext2D, style: string)
设置某个canvas边框属性
参考资料：https://www.w3school.com.cn/tags/canvas_strokestyle.asp

setTextAlign: fn(name: string|CanvasRenderingContext2D, align: string)
设置某个canvas的对齐
参考资料：https://www.w3school.com.cn/tags/canvas_textalign.asp

setTextBaseline: fn(name: string|CanvasRenderingContext2D, baseline: string)
设置某个canvas的基准线
baseline: 可为alphabetic, top, hanging, middle, ideographic, bottom
参考资料：https://www.w3school.com.cn/tags/canvas_textbaseline.asp

splitLines: fn(name: string|CanvasRenderingContext2D, text: string, maxWidth?: number, font?: string)
字符串自动换行的分割

strokeArc: fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, style?: string, lineWidth?: number)
在某个canvas上绘制一段弧
参考资料：https://www.w3school.com.cn/tags/canvas_arc.asp

strokeCircle: fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: ?, style?: string, lineWidth?: number)
在某个canvas上绘制一个圆的边框
参考资料：https://www.w3school.com.cn/tags/canvas_arc.asp

strokeEllipse: fn(name: string|CanvasRenderingContext2D, x: number, y: number, a: number, b: number, angle?: number, style?: string, lineWidth?: number)
在某个canvas上绘制一个椭圆的边框

strokePolygon: fn(name: string|CanvasRenderingContext2D, nodes?: [[number]], style?: string, lineWidth?: number)
在某个canvas上绘制一个多边形的边框

strokeRect: fn(name: string|CanvasRenderingContext2D, x: number, y: number, width: number, height: number, style?: string, lineWidth?: number, angle?: number)
绘制一个矩形的边框
style: 绘制的样式
lineWidth: 线宽
angle: 旋转角度，弧度制，如Math.PI/2为90度
参考资料：https://www.w3school.com.cn/tags/canvas_strokerect.asp

strokeRoundRect: fn(name: string|CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, style?: string, lineWidth?: number, angle?: number)
在某个canvas上绘制一个圆角矩形的边框

textImage: fn(content: string, lineHeight?: number) -> image
文本图片化
```

## utils.js

工具函数库，里面有各个样板中使用到的工具函数。

```text
applyEasing: fn(mode?: string) -> fn(t: number) -> number
获得变速移动曲线

arrayToRGB: fn(color: [number]) -> string
颜色数组转字符串
例如：core.arrayToRGB([102, 204, 255]); // "#66ccff"
color: 一行三列的数组，必须为不大于255的自然数
返回值：该颜色的#xxxxxx字符串表示

arrayToRGBA: fn(color: [number]) -> string
颜色数组转字符串
例如：core.arrayToRGBA([102, 204, 255, 0.3]); // "rgba(102,204,255,0.3)"
color: 一行三列或一行四列的数组，前三个元素必须为不大于255的自然数。第四个元素（如果有）必须为0或不大于1的数字，第四个元素不填视为1
返回值：该颜色的rgba(...)字符串表示

calValue: fn(value: string, prefix?: string)
计算一个表达式的值，支持status:xxx等的计算。
例如：core.calValue('status:hp + status:def'); // 计算主角的生命值加防御力
value: 待求值的表达式
prefix: 独立开关前缀，一般可省略
返回值：求出的值

clamp: fn(x: number, a: number, b: number) -> number
将x限定在[a,b]区间内，注意a和b可交换
例如：core.clamp(1200, 1, 1000); // 1000
x: 原始值，!x为true时x一律视为0
a: 下限值，大于b将导致与b交换
b: 上限值，小于a将导致与a交换

clone: fn(data?: ?, filter?: fn(name: string, value: ?) -> bool, recursion?: bool)
深拷贝一个对象(函数将原样返回)
例如：core.clone(core.status.hero, (name, value) => (name == 'items' || typeof value == 'number'), false); // 深拷贝主角的属性和道具
data: 待拷贝对象
filter: 过滤器，可选，表示data为数组或对象时拷贝哪些项或属性，true表示拷贝
recursion: 过滤器是否递归，可选。true表示过滤器也被递归
返回值：拷贝的结果，注意函数将原样返回

cloneArray: fn(data?: [number]|[[number]]) -> [number]|[[number]]
深拷贝一个1D或2D数组对象
例如：core.cloneArray(core.status.thisMap.map)

copy: fn(data: string) -> bool
尝试复制一段文本到剪切板。

decodeBase64: fn(str: string) -> string
base64解密
例如：core.decodeBase64('YWJjZA=='); // "abcd"
str: 密文
返回值：明文

decodeRoute: fn(route: string) -> [string]
录像解压的最后一步，即一压的逆过程
例如：core.decodeRoute(core.encodeRoute(core.status.route)); // 一压当前录像再解压-_-|
route: 录像解压倒数第二步的结果，即一压的结果
返回值：原始录像

decompress: fn(value: ?)
解压缩一个数据

download: fn(filename: string, content: string)
弹窗请求下载一个文本文件
例如：core.download('route.txt', JSON.stringify(core.status.route)); // 弹窗请求下载录像
filename: 文件名
content: 文件内容

encodeBase64: fn(str: string) -> string
base64加密
例如：core.encodeBase64('abcd'); // 'YWJjZA=='
str: 明文
返回值：密文

encodeRoute: fn(route: [string]) -> string
录像压缩缩
例如：core.encodeRoute(core.status.route); // 压缩当前录像
route: 原始录像，自定义内容（不予压缩，原样写入）必须由0-9A-Za-z和下划线、冒号组成，所以中文和数组需要用JSON.stringify预处理再base64压缩才能交由一压
返回值：一压的结果

formatBigNumber: fn(x: number, onMap?: bool) -> string
大数字格式化，单位为10000的倍数（w,e,z,j,g），末尾四舍五入
例如：core.formatBigNumber(123456789, false); // "12346w"
x: 原数字
onMap: 可选，true表示用于地图显伤，结果总字符数最多为5，否则最多为6
返回值：格式化结果

formatDate: fn(date: ?) -> string
格式化日期为字符串

formatDate2: fn(date: ?) -> string
格式化日期为最简字符串

formatSize: fn(size: number) -> string
格式化文件大小

formatTime: fn(time: number) -> string
格式化时间

getCookie: fn(name: string) -> string
访问浏览器cookie

getGlobal: fn(key: string, defaultValue?: ?)
读取一个全局存储，适用于global:xxx，支持录像。
例如：if (core.getGlobal('一周目已通关', false) === true) core.getItem('dagger'); // 二周目游戏进行到此处时会获得一把屠龙匕首
key: 全局变量名称，支持中文
defaultValue: 可选，当此全局变量不存在或值为null、undefined时，用此值代替
返回值：全局变量的值

getGuid: fn() -> string
获得或生成浏览器唯一的guid

getLocalForage: fn(key: string, defaultValue?: ?, successCallback?: fn(data: ?), errorCallback?: fn())
从本地数据库读出一段数据

getLocalStorage: fn(key: string, defaultValue?: ?)
获得本地存储

hideWithAnimate: fn(obj?: ?, speed?: number, callback?: fn())
动画使某对象消失

http: fn(type: string, url: string, formData: ?, success?: fn(data: string), error?: fn(message: string), mimeType?: string, responseType?: string, onprogress?: fn(loaded: number, total: number))
发送一个HTTP请求 [异步]
type: 请求类型，只能为GET或POST
url: 目标地址
formData: 如果是POST请求则为表单数据
success: 成功后的回调
error: 失败后的回调

inArray: fn(array?: ?, element?: ?) -> bool
判定array是不是一个数组，以及element是否在该数组中。
array: 可能的数组，不为数组或不填将导致返回值为false
element: 待查找的元素
返回值：如果array为数组且具有element这项，就返回true，否则返回false

isset: fn(v?: ?) -> bool
判断一个值是否不为null，undefined和NaN
例如：core.isset(0/0); // false，因为0/0等于NaN
v: 待测值，可选
返回值：false表示待测值为null、undefined、NaN或未填写，true表示为其他值。

matchRegex: fn(pattern: string, string: string) -> string
是否满足正则表达式

matchWildcard: fn(pattern: string, string: string) -> bool
通配符匹配，用于搜索图块等批量处理。
例如：core.playSound(core.matchWildcard('*Key', itemId) ? 'item.mp3' : 'door.mp3'); // 判断捡到的是钥匙还是别的道具，从而播放不同的音效
pattern: 模式串，每个星号表示任意多个（0个起）字符
string: 待测串
返回值：true表示匹配成功，false表示匹配失败

myconfirm: fn(hint: string, yesCallback?: fn(), noCallback?: fn())
显示确认框，类似core.drawConfirmBox()，但不打断事件流
例如：core.myconfirm('重启游戏？', core.restart); // 弹窗询问玩家是否重启游戏
hint: 弹窗的内容，支持 ${} 语法
yesCallback: 确定后的回调函数
noCallback: 取消后的回调函数，可选

myprompt: fn(hint: string, value: string, callback?: fn(data?: string))
让用户输入一段文字

push: fn(a: [?], b: ?) -> [?]
将b（可以是另一个数组）插入数组a的末尾，此函数用于弥补a.push(b)中b只能是单项的不足。
例如：core.push(todo, {type: 'unfollow'}); // 在事件指令数组todo的末尾插入“取消所有跟随者”指令
a: 原数组
b: 待插入的新末项或后缀数组
返回值：插入完毕后的新数组，它是改变原数组a本身得到的

rand: fn(num?: number) -> number
不支持SL的随机数
例如：1 + core.rand(6); // 随机生成一个小于7的正整数，模拟骰子的效果
num: 填正数表示生成小于num的随机自然数，否则生成小于1的随机正数
返回值：随机数，即使读档也不会改变结果

rand2: fn(num?: number) -> number
支持SL的随机数，并计入录像
例如：1 + core.rand2(6); // 随机生成一个小于7的正整数，模拟骰子的效果
num: 正整数，0或不填会被视为2147483648
返回值：属于 [0, num) 的随机数

readFile: fn(success?: fn(data: string), error?: fn(message: string), readType?: bool)
尝试请求读取一个本地文件内容 [异步]
success: 成功后的回调
error: 失败后的回调
readType: 不设置则以文本读取，否则以DataUrl形式读取

readFileContent: fn(content: string)
文件读取完毕后的内容处理 [异步]

removeLocalForage: fn(key: string, successCallback?: fn(), errorCallback?: fn())
移除本地数据库的数据

removeLocalStorage: fn(key: string)
移除本地存储

replaceText: fn(text: string, prefix?: string) -> string
将一段文字中的${}（表达式）进行替换。
例如：core.replaceText('衬衫的价格是${status:hp}镑${item:yellowKey}便士。'); // 把主角的生命值和持有的黄钥匙数量代入这句话
text: 模板字符串，可以使用${}计算js表达式，支持“状态、物品、变量、独立开关、全局存储、图块id、图块类型、敌人数据、装备id”等量参与运算
返回值：替换完毕后的字符串

replaceValue: fn(value: string) -> string
对一个表达式中的特殊规则进行替换，如status:xxx等。
例如：core.replaceValue('status:atk+item:yellowKey'); // 把这两个冒号表达式替换为core.getStatus('hp')和core.itemCount('yellowKey')这样的函数调用
value: 模板字符串，注意独立开关不会被替换
返回值：替换完毕后的字符串

same: fn(a?: ?, b?: ?) -> bool
判定深层相等, 会逐层比较每个元素
例如：core.same(['1', 2], ['1', 2]); // true

setGlobal: fn(key: string, value?: ?)
设置一个全局存储，适用于global:xxx，录像播放时将忽略此函数。
例如：core.setBlobal('一周目已通关', true); // 设置全局存储“一周目已通关”为true，方便二周目游戏中的新要素。
key: 全局变量名称，支持中文
value: 全局变量的新值，不填或null表示清除此全局存储

setLocalForage: fn(key: string, value?: ?, successCallback?: fn(), errorCallback?: fn())
往数据库写入一段数据

setLocalStorage: fn(key: string, value?: ?)
设置本地存储

setStatusBarInnerHTML: fn(name: string, value: ?, css?: string)
填写非自绘状态栏
例如：core.setStatusBarInnerHTML('hp', core.status.hero.hp, 'color: #66CCFF'); // 更新状态栏中的主角生命，使用加载画面的宣传色
name: 状态栏项的名称，如'hp', 'atk', 'def'等。必须是core.statusBar中的一个合法项
value: 要填写的内容，大数字会被格式化为至多6个字符，无中文的内容会被自动设为斜体
css: 额外的css样式，可选。如更改颜色等

setTwoDigits: fn(x: number) -> string
两位数显示

showWithAnimate: fn(obj?: ?, speed?: number, callback?: fn())
动画显示某对象

splitImage: fn(image?: string|image, width?: number, height?: number) -> [image]
等比例切分一张图片
例如：core.splitImage(core.material.images.images['npc48.png'], 32, 48); // 把npc48.png切分成若干32×48px的小人
image: 图片名（支持映射前的中文名）或图片对象（参见上面的例子），获取不到时返回[]
width: 子图的宽度，单位为像素。原图总宽度必须是其倍数，不填视为32
height: 子图的高度，单位为像素。原图总高度必须是其倍数，不填视为正方形
返回值：子图组成的数组，在原图中呈先行后列，从左到右、从上到下排列。

strlen: fn(str: string) -> number
求字符串的国标码字节数，也可用于等宽字体下文本的宽度测算。请注意样板的默认字体Verdana不是等宽字体
例如：core.strlen('无敌ad'); // 6
str: 待测字符串
返回值：字符串的国标码字节数，每个汉字为2，每个ASCII字符为1

subarray: fn(a?: [?], b?: [?]) -> [?]|null
判定一个数组是否为另一个数组的前缀，用于录像接续播放。请注意函数名没有大写字母
例如：core.subarray(['ad', '米库', '小精灵', '小破草', '小艾'], ['ad', '米库', '小精灵']); // ['小破草', '小艾']
a: 可能的母数组，不填或比b短将返回null
b: 可能的前缀，不填或比a长将返回null
返回值：如果b不是a的前缀将返回null，否则将返回a去掉此前缀后的剩余数组

turnDirection: fn(turn: string, direction?: string) -> string
计算应当转向某个方向
turn: 转向的方向，可为 up,down,left,right,:left,:right,:back 七种
direction: 当前方向

unshift: fn(a: [?], b: ?) -> [?]
将b（可以是另一个数组）插入数组a的开头，此函数用于弥补a.unshift(b)中b只能是单项的不足。
例如：core.unshift(todo, {type: 'unfollow'}); // 在事件指令数组todo的开头插入“取消所有跟随者”指令
a: 原数组
b: 待插入的新首项或前缀数组
返回值：插入完毕后的新数组，它是改变原数组a本身得到的

unzip: fn(blobOrUrl?: ?, success?: fn(data: ?), error?: fn(error: string), convertToText?: bool, onprogress?: fn(loaded: number, total: number))
解压一段内容
```

## plugin.js

插件编写中内置了一些常用的插件。

```text
autoRemoveMaps: fn(floorId: string)
根据楼层分区信息自动砍层与恢复

canOpenShop: fn(id: string) -> bool
当前能否打开某个商店

canUseQuickShop: fn(id: string) -> string
当前能否使用某个快捷商店
如果返回一个字符串，则代表不能，返回的字符串作为不能的提示；返回null表示可以使用

drawLight: fn(name: string|CanvasRenderingContext2D, color?: number, lights?: [[number]], lightDec?: number)
绘制一段灯光效果
name：必填，要绘制到的画布名；可以是一个系统画布，或者是个自定义画布；如果不存在则创建
color：可选，只能是一个0~1之间的数，为不透明度的值。不填则默认为0.9。
lights：可选，一个数组，定义了每个独立的灯光。其中每一项是三元组 [x,y,r] x和y分别为该灯光的横纵坐标，r为该灯光的半径。
lightDec：可选，0到1之间，光从多少百分比才开始衰减（在此范围内保持全亮），不设置默认为0。比如lightDec为0.5代表，每个灯光部分内圈50%的范围全亮，50%以后才开始快速衰减。
例如：core.plugin.drawLight('test', 0.2, [[25,11,46,0.1]]); // 创建一个test图层，不透明度0.2，其中在(25,11)点存在一个半径为46的灯光效果，灯光中心不透明度0.1。
core.plugin.drawLight('test2', 0.9, [[25,11,46],[105,121,88],[301,221,106]]); // 创建test2图层，且存在三个灯光效果，分别是中心(25,11)半径46，中心(105,121)半径88，中心(301,221)半径106。

isShopVisited: fn(id: string) -> bool
某个全局商店是否被访问过

listShopIds: fn() -> [string]
列出所有应当显示的快捷商店列表

openItemShop: fn(itemShopId: string)
打开一个道具商店

openShop: fn(shopId: string, noRoute?: bool)
打开一个全局商店
shopId: 要开启的商店ID
noRoute: 打开行为是否不计入录像

removeMaps: fn(fromId: string, toId?: string)
删除某一些楼层；删除后不会存入存档，不可浏览地图也不可飞到。
fromId: 开始删除的楼层ID
toId: 删除到的楼层编号；可选，不填则视为fromId
例如：core.removeMaps("MT1", "MT300") 删除MT1~MT300之间的全部层
core.removeMaps("MT10") 只删除MT10层

resumeMaps: fn(fromId: string, toId?: string)
恢复某一些被删除楼层。
fromId: 开始恢复的楼层ID
toId: 恢复到的楼层编号；可选，不填则视为fromId
例如：core.resumeMaps("MT1", "MT300") 恢复MT1~MT300之间的全部层
core.resumeMaps("MT10") 只删恢复MT10层

setShopVisited: fn(id: string, visited?: bool)
设置某个商店的访问状态
```
