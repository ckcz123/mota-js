# 个性化
?> 目前版本**v2.7**，上次更新时间：* {docsify-updated} *

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

## 自定义素材
所有系统素材的图片都在 `project\materials` 目录下。
- `animates.png` 为所有动画效果。主要是星空熔岩，开门，毒网，传送门之类的效果。为四帧。
- `enemys.png` 为所有怪物的图片。
- `enemy48.png` 为所有48x32怪物的图片。
- `items.png` 为所有道具的图标。
- `npcs.png` 为所有NPC的图标。
- `npc48.png` 为所有48x32的NPC图标。
- `terrains.png` 为所有地形的图标。

从V2.7起，自动元件和 `tileset` 图片被分别放在了独立的文件夹中，而其余的由作者追加的图片（如动图、勇士和跟随者行走图、楼层贴图、对话皮肤）等留在了 `project\images` 文件夹。<br>
系统会读取`icon.js`文件，并获取每个ID对应的图标所在的位置。
### 背景和前景图层

从V2.4.1开始，样板允许多个图层叠加，最多支持背景层、事件层和前景层三个图层。

在地图编辑器中绘图时，下拉框选中“背景层”或“前景层”即可在对应的图层上绘图。

其中背景层和前景层可以使用任何素材，以及使用自动元件（autotile）。

可以使用`showBgFgMap`, `hideBgFgMap`, `setBgFgBlock`等事件对背景和前景图层进行操作。

### 使用自己的图片作为某层楼的背景/前景素材

由于HTML5功能（素材）有限，导致了对很多比较复杂的素材（比如房子内）等无法有着较好的绘图方式。

为了解决这个问题，我们允许用户自己放置一张或多张图片作为某一层的背景/前景素材。

要启用这个功能，我们首先需要在全塔属性中将可能的图片进行注册。
``` json
"images": [ // 在此存放所有可能使用的图片
    // 图片可以被作为背景/前景图，也可以直接用自定义事件进行显示。
    // 图片名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好
    // 建议对于较大的图片，在网上使用在线的“图片压缩工具(http://compresspng.com/zh/)”来进行压缩，以节省流量
    "bg.jpg", "house.png", "bed.png"// 依次向后添加
];
```

!> 请使用网上的一些[在线图片压缩工具](http://compresspng.com/zh/)对图片进行压缩，以节省流量。

之后，我们可以在每层剧本的`"images"`里来定义该层的默认背景/前景层的图片素材。

从V2.5.4开始，贴图也允许进行帧动画。从V2.7开始，楼层贴图使用事件编辑器编辑。
``` json
[ // canvas为贴图所在的图层，可以写bg、fg或auto。"disable": true表示初始隐藏，frame为总帧数
  {"name": "bg.jpg", "canvas": "bg", "x": 0, "y": 0, "disable": true, "sx": 0, "sy": 0, "w": 416, "h": 416, "frame": 4},
] // x和y为绘制的左上角坐标，sx和sy为裁剪的左上角坐标，w和h为裁剪的宽高（不支持伸缩）
```
关于图层，`bg` 和 `fg` 分别表示该贴图全部画在背景层（如沼泽）或前景层（如云），被勇士遮挡或遮挡勇士。<br>`auto` 表示上部分画在前景层，下部分画在背景层。从而可以达到一个“自动调节遮挡的效果”。举例：树、房子等等。<br>
!> 如果写 `auto` 的话，最好让 `x, y` 和图片高度都是 `32` 的倍数！<br>
`frame` 为图片的帧数，可选。如果进行了设置，则会将该贴图视为帧动画，并【从左到右】切分成对应的帧数。<br>
例如，假设图片是100x100的，且帧数设为4，则视为四帧帧动画，每次绘制的图片大小实际上是25x100。

关于楼层贴图和前景、背景层的层叠覆盖关系，默认是：**地板 - 背景贴图 - 背景图块 - 事件 - 勇士 - 前景贴图 - 前景图块**。

可以通过修改`libs/maps.js`的`drawBg`和`drawFg`函数来改变其覆盖关系。

``` js
////// 绘制背景层 //////
maps.prototype.drawBg = function (floorId, ctx) {
    var onMap = ctx == null;
    if (onMap) {
        ctx = core.canvas.bg;
        core.clearMap(ctx);
    }
    this._drawBg_drawBackground(floorId, ctx);
    // ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制背景图块；后绘制的覆盖先绘制的。
    this._drawFloorImages(floorId, ctx, 'bg');
    this._drawBgFgMap(floorId, ctx, 'bg', onMap);
}
```

楼层贴图可以被事件隐藏和显示，详见[隐藏贴图](event#hideFloorImg：隐藏贴图)的写法。

**如果要让贴图的某些点不可通行，则可以使用noPass或者空气墙。**

!> 小技巧：可以使用帧动画贴图来贴一些大型怪物，比如魔龙、章鱼，或者《永不复还》中的恐怖利刃等等。如果使用帧贴图来贴怪物，则可以使用一个“透明的怪物”放置在对应位置并写上具体属性数值（这样就可以进行战斗和显伤了）；然后可以使用[displayIdInBook](element#怪物的朝向问题)在怪物手册中将该透明怪物映射到另一个有素材的怪物ID上。战斗完毕后使用[隐藏贴图](event#hideFloorImg：隐藏贴图)事件将贴图隐藏即可。

### 使用便捷PS工具生成素材

如果我们有更多的素材要求，我们可以使用“便捷PS工具”进行处理。

![便捷PS工具](img/ps.png)

我们可以打开有需求改变的素材，和我们需要被替换的素材，然后简单的Ctrl+C和Ctrl+V操作即可。

便捷PS工具同样支持图片色相的修改，和RMXP几乎完全相同。

用这种方式，我们能极快地替换或素材，包括需要新增的怪物。

### 添加素材到游戏

在使用地图编辑器编辑的过程中，我们有可能会出现“该数字和ID未被定义”的错误提示。

这是因为，该素材没有被定义，无法被游戏所识别。

!> 在V2.0中，我们可以简单的在地图编辑器中新增素材，以及定义新增素材的ID和数字，但是仍然**强烈建议**对素材的机制进行了解。

#### 素材的机制

本塔所有的素材都拥有三个属性：**ID**，**索引**，**数字**。
- **ID** 为该素材的唯一标识符，任何两个素材的ID都不能相同。
- **索引** 为该素材的在对应图片上的图标索引，即该素材是图片上的第几个。
- **数字** 为该素材的对应数字，以方便地图的生成和存储。

**`ID-索引` 对应关系定义在icons.js文件中。该文件将唯一确定一个ID在图片上所在的位置。**

**`ID-数字` 对应关系定义在maps.js文件中。该文件将唯一确定一个ID对应的数字是多少。**

在V2.0中，我们可以在地图编辑器中很方便查看每个图块的三个属性信息。

#### 注册素材

在V2.0的地图编辑器中，要注册新素材，我们只需要在图块属性一栏输入新素材的ID和数字。

![素材注册](./img/register.png)

ID必须由数字字母下划线组成，数字在1000以内，且均不能和已有的进行重复。

之后刷新编辑器即可。

我们也可以进行自动注册，只需要点击“自动注册”按钮，将对该栏下所有未注册的素材进行自动注册（自动分配ID和数字）。

素材注册完毕后，即可在游戏中正常使用，也可以被地图生成器所识别（需要重开地图生成器）。

#### Autotile自动元件的注册

但是，通过上面这种方式，我们是没办法新增并注册Autotile的。

除了替换样板现有的几个外，如果我们还需要新添加Autotile，则：

1. 下拉框切到“追加素材”，导入文件到画板，然后导入一张Autotile自动元件图片。
2. 下拉框选择autotile，然后点“追加”
3. 看到成功的提示后刷新编辑器即可。

### 额外素材

从V2.4.2开始，HTML5魔塔样板开始支持额外素材。

具体而言，通过上面的“素材导入”的方式，确实可以有效地添加素材到游戏。但是，如果想增加大量自定义素材，需要通过便捷PS工具将这些素材全部导入到`terrains.png`中，并且全部是单列，极度不友好。这也导致了野外风的制作相对变得很困难，增加了大量素材处理的工作量。

额外素材就是为了解决这个问题而被提出。

所谓`额外素材`，即用户可以自定导入任意张素材图片，无需PS，无需注册，即可直接在游戏中使用。这一点已经十分向RM靠拢了。

要使用额外素材，请将你需要的素材图片放在 `project\tilesets` 目录下，并在`全塔属性`的`tilesets`中定义图片名。
**该素材的宽高必须都是32的倍数，且图片上的总图块数不超过1000（即最多有1000个32*32的图块在该图片上）。**
```json
// 在全塔属性中的tilesets导入素材
"tilesets": ["1.png", "2.png"]    // 导入两个额外素材，文件名分别是1.png和2.png
```

刷新后，系统会自动加载该素材并添加到素材区。

额外素材无需导入，无需注册。在`tilesets`中定义了图片后，即可直接使用绘图，无需再注册其数字和ID。其ID、索引和数字均为系统自动分配，且不允许修改。

请注意，额外素材的ID、索引和数字，与该图片在tilesets数组中的index及该素材在图片上的位置都有关系。

!> **因此如果对`tilesets`数组随意删除或修改顺序，可能会导致所有额外素材全部发生变化！这点请务必注意！！！**

除此之外，额外素材在游戏中的使用和正式素材都是一致的，也能在前景或背景图层绘制。

额外素材可以使用“tileset平铺”的方式进行绘制，一次绘制一个矩形区域。

“辅助工具”中提供了“额外素材合并”，如果使用此功能，请不要对额外素材进行基于ID、索引和数字的判定和读写等操作，如确有此需求，可以创建一些玩家不可达也不可预览的隐藏样板层，然后用等量代换的办法去从样板层取用。
## 自定义道具效果

本节中将继续介绍如何自己编辑一个道具的效果。

道具效果的具体实现都在 `project\items.js` 中。
### 即捡即用类道具（cls: items）
对于即捡即用类道具，如宝石、血瓶等，我们可以简单地修改全塔属性中的 `values` 一栏即可。

如果你想要同种宝石在不同层效果不同的话，可以进行如下操作：

1. 在楼层的ratio中定义宝石的比率（比如1-10的写1，11-20层写2等）
2. 修改获得道具的itemEffect函数（编辑器中双击进行编辑）

``` js
core.status.hero.atk += core.values.redGem * core.status.thisMap.ratio
```

如果不是倍数增加（比如线性增加）也可以类似来写

``` js
// 一个二倍线性增加的例子
core.status.hero.atk += core.values.redGem + 2*core.status.thisMap.ratio
```

### 消耗类道具（cls: tools）；永久类道具（cls: constants）

如果要自己实现消耗类道具或永久类道具的使用效果，则需修改`items.js`中的canUseItem和useItem两个函数。

具体过程比较复杂，需要一定的JS能力，在这里就不多说了，有需求可以找`艾之葵`进行了解。

从V2.6.6起，道具的“图块属性”中，提供了 `useItemEvent` 项，您可以用事件而不是脚本去书写道具的使用效果（对 `cls: items` 也有效但会打断寻路），参见样板的黄宝石和生命魔杖。

如果弄不清楚 `canUseItem` ，也可以干脆统一填写为 `"true"`，先斩后奏，并在使用效果中再行判定，如果发现其实使用失败了，就悄咪咪返还给勇士一个该道具，参见样板的破墙镐和炸弹。
### 实战！拿到神圣盾后免疫吸血、领域、夹击效果

1. 在itemEffect中修改拿到神圣盾时的效果，标记一个自定义Flag。
``` js
core.status.hero.def += 100;
core.setFlag("shield5", true); // 增加一个自定义Flag：已经拿到神圣盾
```
2. 免疫吸血效果：在脚本编辑的getDamageInfo中，编辑成如果存在神圣盾标记，吸血伤害为0。
``` js
function (enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId) {
// ... 上略
    // 吸血
    if (this.hasSpecial(mon_special, 11)) {
        var vampireDamage = hero_hp * enemy.value;

        // 如果有神圣盾免疫吸血等可以在这里写
        // 也可以用hasItem或hasEquip来判断装备
        if (core.hasFlag("shield5")) vampireDamage = 0; // 存在神圣盾，吸血伤害为0

        vampireDamage = Math.floor(vampireDamage) || 0;
        // 加到自身
        if (enemy.add) // 如果加到自身
            mon_hp += vampireDamage;

        initDamage += vampireDamage;
    }
// ... 下略
```
3. 免疫领域、夹击、阻击效果：在2.4.1之后，可以直接将flag:no_zone设为true来免疫领域效果，其他几个同理。
``` json
[ // 写在获得道具后事件
    // 设置不同的flag可以分别无视对应的阻激夹域效果
    {"type": "setValue", "name": "flag:no_zone", "value": "true"}, // 免疫领域
    {"type": "setValue", "name": "flag:no_repulse", "value": "true"}, // 免疫阻击
    {"type": "setValue", "name": "flag:no_laser", "value": "true"}, // 免疫激光
    {"type": "setValue", "name": "flag:no_betweenAttack", "value": "true"}, // 免疫夹击
    {"type": "setValue", "name": "flag:no_ambush", "value": "true"}, // 免疫捕捉
    {"type": "setValue", "name": "item:amulet", "value": "1"} // 免疫路障
]
```
4. 如果有更高的需求，例如想让吸血效果变成一半，则还是在上面这些地方进行对应的修改即可。

## 新增门和对应的钥匙
如果要新增一个门和对应的钥匙，只需要进行如下三步：
1. 在 `project\images\animates.png` 或 `npc48.png` 中添加开门的四帧动画并注册，其中第一帧也作为未开启的静止门。
2. 在图块属性中将其默认触发器改为 `openDoor`（如果依然写 `null` 则和三色墙一样可以用来制作暗墙），动画帧数填 `1` 表示门未开启时静止在第一帧。
3. 在 `doorInfo` 中填写需要哪些钥匙（可以填任何消耗类道具）各多少把，开关门时间、开关门分别播放什么音效等。
## 覆盖楼传事件

对于特殊的塔，我们可以考虑修改楼传事件来完成一些特殊的要求，比如镜子可以按楼传来切换表里。

要修改楼传事件，需要进行如下两步：

1. 重写楼传的点击事件。在插件中对`core.control.useFly进行重写`。详细代码参见[重写点击楼传事件](script#重写点击楼传事件)。
2. 修改楼传的使用事件。和其他永久道具一样，在地图编辑器的图块属性中修改楼传的useItemEffect和canUseItemEffect两个内容。例如：
``` js
"useItemEffect": "core.insertAction([...])" // 执行某段自定义事件，或者其他脚本
"canUseItemEffect": "true" // 任何时候可用
```

除了覆盖楼传事件外，对于快捷商店、虚拟键盘等等也可以进行覆盖，只不过是仿照上述代码重写对应的函数（`openQuickShop`,`openKeyBoard`）即可。

## 自定义怪物属性

如果你对现有的怪物不满意，想自行添加怪物属性也是可以的。具体参见脚本编辑的 `getSpecials`。

你需自己指定一个special数字，修改属性名和属性提示文字。提示文字可以直接写字符串，或写个函数传入怪物。

如果要改动怪物在手册中的显示数值（也会被用于伤害计算，如模仿），请修改下面的 `getEnemyInfo` 函数。

如果要修改伤害计算公式，请修改下面的 `getDamageInfo` 函数。请注意，如果无法战斗，该函数必须返回`null`。

!> 如果改动了伤害计算公式，可能导致临界计算崩掉，因此建议将全塔属性中的`useLoop`置为true。

对于毒衰咒、自爆、退化怪物和加点、仇恨值累加等战斗后结算在脚本编辑中的 `afterBattle` 函数中。

对于领域、夹击、阻击、激光、捕捉怪物的检查在脚本编辑中的 `updateCheckBlock` 函数中。

如果想给怪物在血攻防之外添加新的数值项，请阅读 `@zhaouv` 撰写的另一篇文档，并配置表格来实现。
## 自定义快捷键

如果需要绑定某个快捷键为处理一段事件，也是可行的。

要修改按键，我们可以在脚本编辑的`onKeyUp`进行处理：

我们设置一个快捷键进行绑定，比如 `Y`，其 `keycode` 是 `89` 。<br>
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

可以使用altKey来判断Alt键是否被同时按下。

## 公共事件

从V2.5.4开始，样板提供了“公共事件”下拉框，我们可以在里面用事件编辑器进行编辑，并通过`{"type":"insert"}`进行调用。

![公共事件](./img/commonEvent.png)

具体详见[插入公共事件或另一个地点的事件并执行](event#insert：插入公共事件或另一个地点的事件并执行)。

当然，继续使用**插件**的写法也是可以的。

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

## 标题界面事件化

从V2.5.3开始，我们可以将标题界面的绘制和游戏开始用事件来完成。可以通过绘制画布、全塔属性，flags中的startUsingCanvas可以决定是否开启标题界面事件化。

然后就可以使用“事件流”的形式来绘制标题界面、提供选项等等。

在这里可以调用任意事件。例如，可以贴若干个图，可以事件切换楼层到某个剧情层再执行若干事件，等等。

关于选项，样板默认给出的是最简单的choices事件；你也可以使用贴按钮图，循环处理+等待操作来定制自己的按钮点击效果。

!> 开始游戏、读取存档、录像回放的效果已经默认给出，请不要修改或删减这些内容，以免出现问题。

标题界面事件全部处理完后，将再继续执行startText事件。

## 手机端按键模式

从V2.5.3以后，我们可以给手机端增加按键了，这样将非常有利于技能的释放。

用户在菜单栏打开“拓展键盘”后，在竖屏模式下点击工具栏，就会在工具栏按钮和快捷键模式之间进行切换。

切换到快捷键模式后，可以点1-8，分别等价于在电脑端按键1-8。

可以在脚本编辑的onKeyUp中定义每个快捷键的使用效果，比如使用道具或释放技能等。

默认值下，1使用破，2使用炸，3使用飞，4使用其他存在的道具，5读取上一个自动存档，6读取下一个自动存档，7轻按，8未定义。可以相应修改成自己的效果。

也可以替换icons.png中的对应图标，以及修改main.js中`main.statusBar.image.btn1~8`中的onclick事件来自定义按钮和对应按键。

非竖屏模式下、回放录像中、隐藏状态栏中，将不允许进行切换。

## 自绘状态栏

从V2.5.3开始允许自绘状态栏。要自绘状态栏，则应该打开全塔属性中的`statusCanvas`开关。

自绘模式下，全塔属性中的`statusCanvasRowsOnMobile`将控制竖屏模式下的状态栏行数。

开启自绘模式后，可以在脚本编辑的`drawStatusBar`中自行进行绘制。

横屏模式下的状态栏为`129x416`（15x15则是`149x480`）；竖屏模式下的状态栏为`416*(32*rows+9)`（15x15是480）。

具体可详见脚本编辑的`drawStatusBar`函数。

自绘状态栏开启后，金币图标将失去打开快捷商店的功能，您可以修改脚本编辑的 `onStatusBarCLick` 函数来适配。
## 自定义状态栏的显示项

在V2.2以后，我们可以自定义状态栏背景图（全塔属性 - statusLeftBackground）等等。

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
2. 在index.html的statusBar中（46行起），进行该状态栏项的定义。仿照其他几项，插在其应当显示的位置，注意替换掉相应的ID。
``` html
<div class="status" id="speedCol">
    <img id="img-speed">
    <p class='statusLabel' id='speed'></p>
</div>
```
3. 在editor.html中的statusBar（383行起），仿照第二点同样添加；这一项如果不进行则会地图编辑器报错。editor-mobile.html同理。
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
core.statusBar.speed.innerHTML = core.getStatus('speed');
// 设置其显示内容为flag:speed值，无需额外进行定义。
core.statusBar.speed.innerHTML = core.getFlag('speed', 0);
```
总的来说不建议这样做，因为 `main.js` 和几个 `html` 文件不在 `project` 文件夹，会导致随样板更新迁移接档变得困难。
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

在脚本编辑-updateStatusBar中，可以对状态栏显示内容进行修改。

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
core.statusBar.skill.innerHTML = core.getFlag('skillName', '无');
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

!> 由于现在手机端存在拓展键盘，也强烈建议直接覆盖1-8的使用效果，这样手机端使用也非常方便。

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

!> 开启技能后，建议将全塔属性的useLoop置为true，即改用循环计算临界值，这样临界计算才不会出问题！

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
- **`flag:heroIcon`**: 当前的勇士行走图名称。
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
