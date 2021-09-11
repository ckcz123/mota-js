# 个性化

?> 在这一节中，让我们来了解更多对样板个性化的修改

有时候只靠样板本身可能是不够的。我们需要一些个性化、自定义的素材，道具效果，怪物属性，等等。

## 图层的说明

HTML5魔塔是使用画布（canvas）来绘制，存在若干个图层，它们之间有一个覆盖关系，后面的图层将覆盖前面的图层。

所有图层从低往高依次如下：（加[B]的代表该层是大地图，[D]代表由系统按需动态创建，z-index代表该层的纵向高度）

- bg**[B]**：背景层；绘制背景图层素材bgmap，和背景贴图 (z-index: 10)
- event**[B]**：事件层；所有事件（道具、墙壁、NPC、怪物等）都绘制在这一层进行处理 (z-index: 30)
- hero：勇士层；主要用来绘制勇士 (z-index: 40)
- event2**[B]**：事件2层；本层主要用来绘制48x32的图片素材的上半部分（避免和勇士错位） (z-index: 50)
- fg**[B]**：前景层；绘制前景图层素材fgmap，和前景贴图 (z-index: 60)
- damage**[B]**：显伤层；主要用来绘制怪物显伤和领域显伤 (z-index: 65)
- animate：动画层；主要用来绘制动画。 (z-index: 70)
- weather**[D]**：天气层；主要用来绘制天气（雨/雪/雾） (z-index: 80)
- route**[D]**：路线层；主要用来绘制勇士的行走路线图。 (z-index: 95)
- curtain：色调层；用来控制当前楼层的画面色调 (z-index: 125)
- image1\~50**[D]**：图片层；用来绘制图片等操作。（z-index: 100+code, 101~150）
- uievent**[D]**：自定义UI绘制层；用来进行自定义UI绘制等操作。（z-index：135，可以通过事件设置该值）
- ui：UI层；用来绘制一切UI窗口，如剧情文本、怪物手册、楼传器、系统菜单等等 (z-index: 140)
- data：数据层；用来绘制一些顶层的或更新比较快的数据，如左上角的提示，战斗界面中数据的变化等等。 (z-index: 170)

请注意：显示图片事件将自动创建一个图片层，z-index是100+图片编号。

而，色调层的z-index是25，ui层的z-index是140；因此，图片编号在1~24的将被色调层遮挡，25~40的将被ui层遮挡，41~50的将遮挡UI层。

uievent层为自定义UI绘制所在的层，其z值初始是135，可以通过事件设置；自定义绘制的闪烁光标所在层的z值永远比该值大1。

### 动态创建canvas

从V2.5.3开始，可以在H5样板中任意动态创建canvas并进行使用。

使用`core.createCanvas(name, x, y, w, h, z)`来动态创建一个画布。

其中name为动态canvas名称，x,y,w,h为创建的画布相对窗口左上角的像素坐标和长宽，z为画布的纵向高度。

例如：`core.createCanvas('test', 10, 20, 100, 200, 74)` 创建了一个名为test的画布，其左上角相对窗口的像素坐标为(10,20)，宽100高200，纵向高度74（在动画层和天气层之间）。

该函数会返回画布的context，也可以通过 `core.dymCanvas[name]` 来获得；例如 `core.dymCanvas.test` 就是我们上面创建的画布的context，然后进行操作。

也可以简单的使用`core.fillText()`, `core.fillRect()`, `core.strokeRect()`等等对画布进行任意绘制。

``` js
core.fillText('test', '这是一段文字', 10, 30, '#FF0000', '16px Verdana'); // 绘制一段文本
```

使用 `core.deleteCanvas(name)` 删除一个动态创建的画布，例如 `core.deleteCanvas('test')`。

`core.deleteAllCanvas()`可以删除所有动态创建的画布，`core.relocateCanvas(name, x, y)`和`core.resizeCanvas(name, x, y)`可以对画布的位置和大小进行改变。

更多详细API请参见[API列表](api)。

## 单点多事件

带有独立开关的商人算是一个最为简单的单点多事件的例子了（提供在了事件编辑器左侧的“常用事件模板”），单点多事件最常用的指令就是“转变图块”（或关门）和“条件分歧”。下面以几个具体例子来进行详细说明：
1.  打怪变成门或道具、开门变成怪或道具：怪物、门、道具都是系统触发器，直接利用afterXxx事件。如：
    * 战后事件：关门`yellowDoor`（原地关上了一扇黄门）
    * 战后事件：转变图块为`yellowKey`（怪物掉落了黄钥匙）
    * 开门后事件：转变图块为`greenSlime`或`yellowKey`（开门变成了史莱姆或黄钥匙）
    * 打怪变成别的怪、开门关上别的门、门和怪来回变的，用独立开关计数。
    * 如有批量需求，请使用“脚本编辑 - `afterXxx`函数或怪物的（批量）战前/战后事件。
2.  打怪/开门/捡道具后变成传送点或npc：
    * 这时的传送点就不能用“楼梯、传送门”事件了，而应该用只有一条“场景切换”指令的普通事件。
    * 此事件不勾选“覆盖触发器”，这样怪物、门和道具的系统触发器会触发。
    * 在对应的`afterXxx`事件中“转变图块为”传送点或npc，淡入效果更佳哦。
    * 请注意，因为道具是可通行的，如果勇士走到道具上，就会和npc重合。
3.  （懒人的选择）利用`图块类别：x,y`和`图块ID：x,y`等值块集中处理：
    * 如果您实在搞不清楚“覆盖触发器”和“通行状态”这两项，那就干脆勾选前者并把后者设为不可通行，本希望可以通行的场合就得用“无视地形移动勇士”指令前进一步。
    * 用自动事件去转变图块，然后利用上述两个值块判定当前图块的状态等，再用“强制战斗”、“开门（需要钥匙）”和“增加道具”分别处理吧。

## 并行脚本：即时制的希望？

如前所述，自动事件可以让您不用考虑可能导致各值块发生变化的缘由，而是简单地在刷新状态栏时检测这些值块是否满足某些特定的关系。

然而，自动事件依然是通过插入到当前待执行指令队列的开头，或追加到队列的结尾来执行的。换言之，它占用的是事件流本身的线程资源。

那形如bgs、bgv、飘云飘雾、地图背景旋转等即使玩家挂机也会照常执行的特效，该怎么办呢？

js语言其实是没有多线程的，但我们可以写一些浏览器帧刷新时执行的脚本，也就是“并行脚本”。

并行脚本分为两种，全塔并行和楼层并行。前者在“脚本编辑—并行脚本”，后者在楼层属性。一般来说，当您有多个楼层需要执行相同的并行脚本时，建议写在前者并通过对`core.status.floorId`的范围进行判定（注意判空！）来决定具体执行的内容。

并行脚本将被系统反复执行，执行的时机是“浏览器帧刷新”，换言之相邻两次执行的间隔取决于浏览器或设备的性能，上限为60fps即每秒60次。

如果有一个bgs是1秒长的心跳声，我们把它注册到了全塔属性的音效中。假设这个bgs要被用于MT0层，那么我们在MT0层的“楼层属性——并行脚本”中写这样的代码：

``` js
if (core.hasFlag('frame')) {
    // 剧情事件中将“变量：frame”设为正整数来开启bgs，设为0来关闭
    core.status.hero.flags.frame %= 60000; // 防止挂机太久导致溢出
    if (core.getFlag('frame', 0) % 60 === 0)
        core.playSound('heartBeat.mp3'); // 每60帧即1秒播放一次，还可以指定音调。
    core.status.hero.flags.frame++; // 帧数加1
} // 其他特效也是一样的用法。
```

在并行脚本（全塔或楼层）里可以使用`timestamp`作为参数，表示从游戏开始到当前总共过了多少毫秒。

## 覆盖楼传事件

对于特殊的塔，我们可以考虑修改楼传事件来完成一些特殊的要求，比如镜子可以按楼传来切换表里。

要修改楼传事件，需要进行如下两步：

1. 重写楼传的点击事件。在插件中对`core.control.useFly`进行重写。详细代码参见[重写点击楼传事件](script#重写点击楼传事件)。
2. 修改楼传的使用事件。和其他永久道具一样，在地图编辑器的图块属性中修改楼传的`useItemEvent`（或`useItemEffect`）和`canUseItemEffect`两个内容。例如：
``` js
"useItemEvent": "[...]" // 执行某段自定义事件
"canUseItemEffect": "true" // 任何时候可用
```
3. 将全塔属性里的`楼梯边楼传`的勾去掉。

除了覆盖楼传事件外，对于快捷商店、虚拟键盘等等也可以进行覆盖，只不过是仿照上述代码重写对应的函数（`openQuickShop`,`openKeyBoard`）即可。

## 自定义快捷键

如果需要绑定某个快捷键为处理一段事件，也是可行的。

要修改按键，我们可以在脚本编辑的`onKeyUp`进行处理：

我们设置一个快捷键进行绑定，比如 `Y`，其 `keycode` 是 `89` 。
（大键盘数字键 `0-9` 的 `keycode` 为 `48-57, A-Z` 键的 `keycode` 为 `65-90` ，其他键的 `keycode` 搜一下就能得到）

然后在脚本编辑的`onKeyUp`函数的`switch`中进行处理。

``` js
case 89: // 使用该按键的keyCode，比如Y键就是89
    // 还可以再判定altKey是否被按下，即 if (altKey) { ...

    // ... 在这里写你要执行脚本
    // **强烈建议所有新增的自定义快捷键均能给个对应的道具可点击，以方便手机端的行为**
    if (core.hasItem('...')) {
        core.status.route.push("key:0"); // 记录按键到录像中
        core.useItem('...', true); // 第二个参数true代表该次使用道具是被按键触发的，使用过程不计入录像
    }

    break;
```
强烈建议所有新增的自定义非数字快捷键均给个对应的永久道具可点击，以方便手机端的行为。

使用`core.status.route.push("key:"+keyCode)`可以将这次按键记录在录像中。

!> 如果记录了按键，且使用道具的话，需要将useItem的第二个参数设为true，避免重复记录！

可以使用`altKey`来判断Alt键是否被同时按下（V2.8起，手机端的Alt键以粘滞键方式提供）。

## 左手模式
    
V2.7.3起，样板面向玩家提供了“左手模式”，可在ESC菜单中开启。开启后，wsad将用于勇士移动，ijkl将代替原本wsad的功能（存读档等）。

## 插件系统

在H5中，提供了“插件”系统。在V2.6中提供了一个插件下拉框，用户可以自行创建和写插件。

在插件编写的过程中，我们可以使用任何[常见API](api)里面的代码调用；也可以通过`core.insertAction`来插入自定义事件执行。

下面是一个很简单的例子，我编写一个插件函数，其效果是让勇士生命值变成原来的x倍，并令面前的图块消失。

``` js
this.myfunc = function(x) {
    core.status.hero.hp *= x; // 勇士生命翻若干倍
    core.insertAction([ // 自定义事件：令面前的图块消失。
        {"type": "setValue", "name": "flag:x", "value": "core.nextX()"},
        {"type": "setValue", "name": "flag:y", "value": "core.nextY()"},
        {"type": "hide", "loc": ["flag:x", "flag:y"]}
    ]);
}
```

然后比如我们在某个道具的使用效果 `useItemEffect` 中写 `core.plugin.myfunc(2)` 即可调用此插件函数。也可以在战后事件或自定义脚本等位置来写。

网站上也提供了一个[插件库](https://h5mota.com/plugins/)，欢迎大家把自己写的插件进行共享。

从V2.6开始，在插件中用`this.xxx`定义的函数将会被转发到core中。例如上述的`myfunc`除了`core.plugin.myfunc`外也可以直接`core.myfunc`调用。

详见[函数的转发](script#函数的转发)。

## 手机端按键模式

从V2.5.3以后，我们可以给手机端增加按键了，这样将非常有利于技能的释放。

用户在竖屏模式下点击难度标签，就会在工具栏按钮和快捷键模式之间进行切换。

切换到快捷键模式后，可以点1-7，分别等价于在电脑端按键1-7。

V2.8起，点击最后的A键则相当于电脑端按下/松开Alt键（即粘滞键），可以用来快捷换装。

可以在脚本编辑的`onKeyUp`中定义每个快捷键的使用效果，比如使用道具或释放技能等。

默认值下，1使用破，2使用炸，3使用飞，4使用其他存在的道具，5读取上一个自动存档，6读取下一个自动存档，7轻按。可以相应修改成自己的效果。

也可以替换icons.png中的对应图标，以及修改main.js中`main.statusBar.image.btn1~8`中的onclick事件来自定义按钮和对应按键。

非竖屏模式下、回放录像中、隐藏状态栏中，将不允许进行切换。

## 自绘状态栏

从V2.5.3开始允许自绘状态栏。要自绘状态栏，则应该打开全塔属性中的`statusCanvas`开关。

自绘模式下，全塔属性中的`statusCanvasRowsOnMobile`将控制竖屏模式下的状态栏行数（下面的`rows`）。

开启自绘模式后，可以在脚本编辑的`drawStatusBar`中自行进行绘制。

横屏模式下的状态栏为`129x416`（15x15则是`149x480`）；竖屏模式下的状态栏为`416*(32*rows+9)`（15x15是480）。

具体可详见脚本编辑的`drawStatusBar`函数。

自绘状态栏开启后，金币图标将失去打开快捷商店的功能，您可以修改脚本编辑的 `onStatusBarCLick` 函数来适配。

## 自定义状态栏的显示项

在V2.2以后，我们可以自定义状态栏背景图（全塔属性 - 主样式）等等。

但是，如果我们还想新增其他项目的显示，比如攻速或者暴击，该怎么办？

我们可以[自绘状态栏](#自绘状态栏)，或者采用下面两个方式之一来新增。

### 利用已有项目

一个最为简单的方式是，直接利用已有项目。

例如，如果本塔中没有技能栏，则可以使用技能栏所对应的显示项。

1. 覆盖project/icons.png中技能的图标
2. 打开全塔属性的enableSkill开关
3. 在脚本编辑-updateStatusBar中可以直接替换技能栏的显示内容

```
	// 替换成你想显示的内容，比如你定义的一个flag:abc。
	core.setStatusBarInnerHTML('skill', core.getFlag("abc", 0));
```

### 额外新增新项目

如果是在需要给状态栏新定义项目，则需要进行如下几个操作：

1. 定义ID；比如攻速我就定义speed，暴击可以简单的定义baoji；你也可以定义其他的ID，但是不能和已有的重复。这里以speed为例。
2. 在index.html的statusBar中，进行该状态栏项的定义。仿照其他几项，插在其应当显示的位置，注意替换掉相应的ID。
``` html
<div class="status" id="speedCol">
    <img id="img-speed">
    <p class='statusLabel' id='speed'></p>
</div>
```
4. 使用便捷PS工具，打开project/icons.png，新增一行并将魔力的图标P上去；记下其索引比如37（从0开始数）。
5. 在main.js的this.statusBar中增加图片、图标和内容的定义。
``` js
this.statusBar = {
    'images': {
        // ...其他略
        'speed': document.getElementById("img-speed"), // 图片的定义
    },
    'icons': {
        // ...其他略
        'speed': 37, // 图标的定义，这里对应的是icons.png中的索引
    },
    // ...其他略
    'speed': document.getElementById('speed'), // 显示内容（数据）的定义
}
```
6. 显示内容的设置。在脚本编辑的updateStatusBar函数，可以对该状态栏显示内容进行设置，下面是几个例子。
``` js
// 设置其显示内容为status:speed值；需要在project/data.js中firstData的hero那里新增初始值`"speed": 0`。
core.setStatusBarInnerHTML('speed', core.getStatus('speed'));
// 设置其显示内容为flag:speed值，无需额外进行定义。
core.setStatusBarInnerHTML('speed', core.getFlag('speed', 0));
```
总的来说不建议这样做，因为`main.js`和各种html文件不在`project`文件夹，会导致随样板更新迁移接档变得困难。

## 技能塔的支持

从V2.5开始，内置了"二倍斩"技能，可以仿照其制作自己的技能。要支持技能塔，可能需要如下几个方面：

- 魔力（和上限）的添加；技能的定义
- 状态栏的显示
- 技能的触发（按键与录像问题）
- 技能的效果

### 魔力的定义添加；技能的定义

从V2.5开始，提供了 `status:mana` 选项，可以直接代表当前魔力值。可以在全塔属性勾选来启用它。

如果需要魔力上限，则可以使用 `status:manaMax` 来表示当前的魔力最大值，负数表示没有上限。

同时，我们可以使用flag:skill表示当前开启的技能编号，flag:skillName表示当前开启的技能名称。

如果flag:skill不为0，则代表当前处于某个技能开启状态，且状态栏显示flag:skillName值。伤害计算函数中只需要对flag:skill进行处理即可。

### 状态栏的显示

从V2.5开始，魔力值和技能名的状态栏项目已经被添加，可以直接使用。

在脚本编辑-updateStatusBar中，可以对状态栏显示内容进行修改。带有上限时如果一行放不下，可以想办法像生命一样拆成两行。

``` js
// 设置魔力值; status:manamax 只有在非负时才生效。
if (core.status.hero.manamax != null && core.status.hero.manamax >= 0) {
    core.status.hero.mana = Math.min(core.status.hero.mana, core.status.hero.manamax);
    core.setStatusBarInnerHTML('mana', core.status.hero.mana + "/" + core.status.hero.manamax);
}
else {
    core.setStatusBarInnerHTML("mana", core.status.hero.mana);
}
// 设置技能栏
// 可以用flag:skill表示当前开启的技能类型，flag:skillName显示技能名
core.setStatusBarInnerHTML('skill', core.getFlag('skillName', '无'));
```

### 技能的触发

#### 使用道具作为技能

由于手机端按字母键不方便，虚拟键盘不好用，因此强烈推荐**给每个字母键技能设置一个道具，在道具栏点击使用！**

下面是个很简单的例子，要制作一个技能"二倍斩"。

我们可以设置一个道具，其cls是`constants`（永久道具），ID比如是`skill1`。

该道具的使用判定`canUseItemEffect`是`true`（表示任意时候都可使用），使用效果`useItemEffect`是：

``` js
if (core.getFlag('skill', 0)==0) { // 判断当前是否已经开了技能
    if (core.getStatus('mana')>=5) { // 这里要写当前能否开技能的条件判断，比如魔力值至少要多少
        core.setFlag('skill', 1); // 开技能1
        core.setFlag('skillName', '二倍斩'); // 设置技能名
    }
    else {
        core.drawTip("魔力不足，无法开技能");
    }
}
else { // 关闭技能
    core.setFlag('skill', 0); // 关闭技能状态
    core.setFlag('skillName', '无');
}
```

简单的说，用flag:skill判断当前开启的技能，flag:skillName表示该技能名。（可在状态栏显示）

该（技能）道具任何时候都可被使用；使用时，判断当前是否开启了技能，如果开启则关闭，没开则再判断是否允许开启（魔力值够不够等）。

V2.6.6起，道具提供了`useItemEvent`项，建议使用它而不是上面的脚本。'-

#### 快捷键触发技能

在PC端，我们还可以按键触发技能。

在技能的道具定义完毕后，再将该道具绑定到一个快捷键上。有关绑定按键请参见[自定义快捷键](#自定义快捷键)。

下面是一个很简单的例子，当勇士按下 `F` 后，触发我们上面定义的二倍斩技能。
``` js
case 70: // F：开启技能“二倍斩”
    // 是否拥有“二倍斩”这个技能道具
    if (core.hasItem('skill1')) {
        core.status.route.push("key:70");
        core.useItem('skill1', true);
    }
    break;
```
在勇士处于停止的条件下，按下 `F` 键时，判断技能的道具是否存在，如果存在再使用它。

!> 由于现在手机端存在拓展键盘，也强烈建议直接覆盖1-7的使用效果，这样手机端使用也非常方便。

### 技能的效果

最后一点就是技能的效果；其实到了这里就和RM差不多了。

技能的效果要分的话有地图类技能，战斗效果类技能，后续影响类技能什么的，这里只介绍最简单的战斗效果类技能。

其他的几类技能根据需求可能更为麻烦，有兴趣可自行进行研究。

战斗效果内技能要改两个地方：战斗伤害计算，战后扣除魔力值。

战斗伤害计算在脚本编辑的`getDamageInfo`函数，有需求直接修改这个函数即可。

战后扣除魔力值则在脚本编辑的`afterBattle`中进行编辑即可。

举个例子，我设置一个勇士的技能：二倍斩，开启技能消耗5点魔力，下一场战斗攻击力翻倍。

那么，直接在脚本编辑的`getDamageInfo`中进行判断：

``` js
if (core.getFlag('skill', 0)==1) { // 开启了技能1
    hero_atk *= 2; // 计算时攻击力翻倍
}
```

然后在脚本编辑的`afterBattle`中进行魔力值的扣除：

``` js
// 战后的技能处理，比如扣除魔力值
if (core.flags.statusBarItems.indexOf('enableSkill')>=0) {
    // 检测当前开启的技能类型
    var skill = core.getFlag('skill', 0);
    if (skill==1) { // 技能1：二倍斩
        core.status.hero.mana-=5; // 扣除5点魔力值
    }
    // 关闭技能
    core.setFlag('skill', 0);
    core.setFlag('skillName', '无');
}
```

!> 开启技能后，建议将全塔属性的`useLoop`置为`true`，即改用循环计算临界值，这样临界计算才不会出问题！

&nbsp;

通过上述这几种方式，我们就能成功的让H5支持技能啦！

## 系统使用的flag变量

众所周知，自定义flag变量都可以任意定义并取用（未定义直接取用的flag默认值为0）。

下面是一些可能会被系统设置或取用的flag变量：

- **`flag:hard`**: 当前的难度标志；此flag变量在setInitData中被定义，可以直接取用来判定当前难度分歧。上传成绩时将根据此flag来对不同难度进行排序。
- **`flag:posion`**, **`flag:weak`**, **`flag:curse`**: 中毒、衰弱、诅咒状态。
- **`flag:no_zone`**, **`flag:no_repulse`**, **`flag:no_laser`**, **`flag:no_betweenAttack`**: 是否分别免疫领域、阻击、激光、夹击效果。
- **`flag:hatred`**: 当前的仇恨数值。
- **`flag:commonTimes`**: 全局商店共用次数时的访问次数。
- **`flag:input`**: 接受用户输入的事件后，存放用户输入的结果。
- **`flag:type`**, **`flag:keycode`**, **`flag:x`**, **`flag:y`**, **`flag:px`**, **`flag:py`**: 等待用户操作后，用户的操作类型，按键keycode或点击/像素坐标。
- **`flag:skill`**, **`flag:skillName`**: 开启的技能编号和技能名。
- **`flag:saveEquips`**: 快速换装时保存的套装。
- **`flag:__visited__`**: 当前访问过的楼层。
- **`flag:__atk_buff__`**, **`flag:__def_buff__`**, **`flag:__mdef_buff__`**: 当前攻防护盾的实际计算比例加成。
- **`flag:__color__`**, **`flag:__weather__`**, **`flag:__volume__`**: 当前的画面色调、天气和音量。
- **`flag:__events__`**: 当前保存的事件列表，读档时会恢复（适用于在事件中存档）
- **`flag:textAttribute`**, **`flag:globalAttribute`**, **`flag:globalFlags`**: 当前的剧情文本属性，当前的全局属性，当前的全局开关。
- **`flag:cannotMoveDirectly`**, **`flag:__noClickMove__`**: 当前是否不允许瞬间移动，当前用户是否开启了单击瞬移。
- **`flag:hideStatusBar`**, **`flag:showToolbox`**: 是否隐藏状态栏，是否显示工具栏。
- **`flag:debug`**: 当前是否开启了调试模式。
- **`flag:__seed__`**, **`flag:__rand__`**: 伪随机数生成种子和当前的状态

==========================================================================================

[继续阅读脚本](script)
