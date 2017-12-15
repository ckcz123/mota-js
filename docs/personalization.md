# 个性化

有时候只靠样板本身可能是不够的。我们需要一些个性化、自定义的素材，道具效果，怪物属性，等等。

## 自定义素材

所有素材的图片都在`images`目录下。
- `animates.png` 为所有动画效果。主要是星空熔岩，开门，毒网，传送门之类的效果。为四帧。
- `enemys.png` 为所有怪物的图片。地图生成器中对应的数字，从上至下依次是会从201开始计算（即，绿色史莱姆为201，小蝙蝠为205，依次类推）。请注意，动画效果为两帧，一般是原始四帧中的1和3。（四帧中12相同，34相同，因此只取1和3即可）
- `heros.png`为勇士行走图。
- `items.png` 为所有道具的图标。
- `npcs.png` 为所有NPC的图标，也是两帧。
- `terrains.png` 为所有地形的图标。

系统会读取`icon.js`文件，并获取每个ID对应的图标所在的位置。

### 地图生成器使用自定义素材

地图生成器可以将数字和图标一一对应，从数字生成图标或从图标生成数字。

在使用自定义素材后，我们可以使用地图生成器来识别新的素材。打开同目录下的`meaning.txt`，按照已有的方式来增加或编辑内容即可。

第一列是地图生成器中的数字，第二列是它所在的文件名，第三列是坐标。

![地图含义](./img/mapmean.png)

### 使用自定义地形（路面、墙壁等）

你需要自行P一张图，里面是你需要的地形素材。然后将其覆盖`terrains.png`文件，请注意所有元件的位置需要完全相同对应。

岩浆、星空、传送门、箭头、门的开启动画、暗墙的开启动画在`animates.png`中，可能也需要对应进行修改。

请打开`items.js`中，对比素材的位置。

另外需要注意的一点是，本样板不支持`Autotile`，换句话说野外地图（草地等）这种自然风可能不会太适合。

### 使用自定义道具图标

如果你觉得已有的道具图标不够，想自己添加图标也是可以的。

如果`items.png`中不存在你需要的图标，则可以自己P一张图，将你需要的图标覆盖到某个用不到的图标上。或者也可以接着后面向下拉伸。

所有道具必须是`32x32`像素。

P图完毕后，可以在地图生成器中加入对应的数字和图标的对应关系。

要在系统中启用你的图标，你需要自己指定一个道具的ID（不能和任何已有的重名），然后进行如下操作：
1. 在`items.js`中道具的定义列表中编辑，修改你的自定义道具的名称，类型，说明文字等。
  - 即捡即用类道具的cls为items，消耗类道具的cls为tools，永久类道具的cls为constants。
2. 在`icon.js`中，找到items一栏，往里面添加你的图标位置。
3. 在`maps.js`中，找到对应位置，往里面添加自己的数字和道具的一一对应关系。（该数字可任意指定，不能和已有的冲突）,类似下面这样

``` js
if (id == 63) tmp.event = {'cls': 'items', 'id': 'moneyPocket'} // 金钱袋
if (id == 64) tmp.event = {'cls': 'items', 'id': 'shoes'} // 绿鞋
if (id == 65) tmp.event = {'cls': 'items', 'id': 'hammer'} // 圣锤
// 可以在这里添加自己的数字-道具对应关系
```

有关如何自行实现一个道具的效果，参见[自定义道具效果](#自定义道具效果)。

### 使用自定义怪物图标

如果你觉得已有的怪物图标不够，也可以自行向后添加你需要的怪物。

在`enemys.js`中，直接向后P图，并将你需要的怪物的两帧动画放到正确的位置（注意：普通四帧动画的1和3帧）。

P图完毕后，可以在地图生成器中加入对应的数字和图标的对应关系。

要在系统中启用你的图标，你需要自己指定一个怪物的ID（不能和任何已有的重名），然后进行如下操作：

1. 在`enemys.js`中，向怪物的定义列表中，添加一个怪物。
2. 在`icon.js`中，找到enemys一栏，往里面添加你的图标位置。
3. 在`maps.js`中，找到对应位置，往里面添加自己的数字和怪物的一一对应关系。一般对于怪物而言，对应的数字就是`200+`位置。

有关如何自行实现一个怪物的特殊属性或伤害计算公式，参见[怪物的特殊属性](#怪物的特殊属性)。

### 使用自定义NPC图标

同上，你也可以自定义NPC图标。只需要将你NPC的两帧动画接到`npcs.js`中即可。

P图完毕后，可以在地图生成器中加入对应的数字和图标的对应关系。

要在系统中启用你的图标，你需要自己指定一个NPC的ID（不能和任何已有的重名），然后进行如下操作：

1. 在`icon.js`中，找到npcs一栏，往里面添加你的图标位置。
2. 在`maps.js`中，找到对应位置，往里面添加自己的数字和NPC的一一对应关系。

### 使用自定义勇士图标

我们同样可以使用自定义的勇士图标，比如小可绒之类。

直接拿一个勇士的行走图覆盖`hero.png`即可。

**支持任何行走大图，如`32x32`, `48x32`, `64x32`等等。**

&nbsp;

通过上述这几种方式，我们可以修改素材图片（使用自定义素材），指定数字并放入地图生成器中，然后在系统中进行启用。

!> **请注意：除了勇士行走图外，其他所有素材强制要求必须是`32x32`的，不然可能会造成不可预料的后果。**

## 自定义道具效果

本节中将继续介绍如何自己编辑一个道具的效果。

道具效果的具体实现都在`items.js`中。

### 即捡即用类道具（cls: items）

对于即捡即用类道具，如宝石、血瓶、剑盾等，我们可以简单地修改`data.js`中的value一栏即可。

如果你有更高级的需求（例如每个区域的效果不同），则需要编辑`items.js`文件。具体方式是：

1. 找到`getItemEffect`函数；所有即捡即用类道具的效果都在这里实现。
2. 算道具效果系数，或应该增加的值。
``` js
items.prototype.getItemEffect = function(itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        var floor = parseInt(core.status.thisMap.name); // 获得当前楼层。此name和剧本中的name完全一致。
        var ratio = 1; // 道具效果系数
        if (floor>=11 && floor<=20 ) ratio = 2; // 11-20F（二区），道具效果翻倍
        if (floor>=21 && floor<=30 ) ratio = 3; // 21-30F（二区），道具效果三倍
        // ... 根据自己的需要来写
        
        if (itemId === 'redJewel') core.status.hero.atk += core.values.redJewel * ratio; // 将初始效果乘以倍数
        if (itemId === 'blueJewel') core.status.hero.def += core.values.blueJewel * ratio; // 将初始效果乘以倍数
        if (itemId === 'greenJewel') core.status.hero.mdef += core.values.greenJewel * ratio; // 将初始效果乘以倍数
        if (itemId == 'yellowJewel') { // 黄宝石属性：需自己定义
// ... 下略
```
3. 修改同样修改下面的`getItemEffectTip`函数，使提示文字相应变动。

!> **请注意这里`core.status.thisMap.name`获取的是当前层中，你在剧本文件里写的name那一项（即状态栏中的层数显示）。然后可以通过几个简单的if来判断应该增加的值。**

### 消耗类道具（cls: tools）；永久类道具（cls: constants）

如果要自己实现消耗类道具或永久类道具的使用效果，则需修改`items.js`中的canUseItem和useItem两个函数。

具体过程比较复杂，需要一定的JS能力，在这里就不多说了，有需求可以找`艾之葵`进行了解。

但值得一提的是，我们可以使用`core.hasItem(name)` 来判断是否某个道具是否存在。例如下面是passNet（通过路障处理）的一部分：

``` js
/****** 经过路障 ******/
events.prototype.passNet = function (data) {
    // 有鞋子
    if (core.hasItem('shoes')) return;
    if (data.event.id=='lavaNet') { // 血网
// ... 下略
```

我们进行了一个简单的判断，如果拥有绿鞋，则不进行任何路障的处理。

### 实战！拿到神圣盾后免疫吸血、领域、夹击效果

1. 在getItemEffect中修改拿到神圣盾时的效果，标记一个自定义Flag。
``` js
if (itemId === 'shield5') {
    core.status.hero.def += core.values.shield5;
    core.setFlag("shield5", true); // 增加一个自定义Flag：已经拿到神圣盾
}
```
2. 免疫吸血效果：在`enemys.js`的getExtraDamage函数中，编辑成如果存在神圣盾标记，额外伤害为0。
``` js
enemys.prototype.getExtraDamage = function (monster) {
    var extra_damage = 0;
    if (monster.special == 11) { // 吸血
        // 吸血的比例
        extra_damage = core.status.hero.hp * monster.value;
        if (core.hasFlag("shield5")) extra_damage = 0; // 如果存在神圣盾，则免疫吸血
        extra_damage = parseInt(extra_damage);
    }
    return extra_damage;
}
```
3. 免疫领域、夹击效果：在`events.js`中，找到checkBlock函数，并编辑成如果有神圣盾标记，则直接返回。
``` js
////// 检查领域、夹击事件 //////
events.prototype.checkBlock = function (x,y) {
    if (core.hasFlag("shield5")) return; // 如果拥有神圣盾立刻返回，免疫领域和夹击
    var damage = 0;
    // 获得四个方向的怪物
    var directions = [[0,-1],[-1,0],[0,1],[1,0]]; // 上，左，下，右
    var enemys = [null,null,null,null];
// ... 下略
```
4. 如果有更高的需求，例如想让吸血效果变成一半（如异空间），则还是在上面这些地方进行对应的修改即可。

## 自定义怪物属性

如果你对现有的怪物不满意，想自行添加怪物属性（例如让怪物拥有双属性乃至更多属性），也是可以的。具体参见`enemys.js`文件。

你需自己指定一个special数字，修改getSpecialText函数。

如果要修改伤害计算公式，请修改下面的calDamage函数。请注意，如果无法战斗，该函数必须返回`999999999`。

因此无敌属性可以这样设置：

``` js
// 我们需要对无敌属性指定一个数字，比如18

enemys.prototype.calDamage = function (hero_atk, hero_def, hero_mdef, mon_hp, mon_atk, mon_def, mon_special) {
    if (mon_special==18 && !core.hasItem("cross")) // 如果是无敌属性，且勇士未持有十字架
        return 999999999; // 返回无限大

    // 魔攻
    if (mon_special == 2) hero_def = 0;
// ... 下略
```

对于吸血怪的额外伤害计算在getExtraDamage中。

对于毒衰弱怪物的战斗后结算在`events.js`中的afterBattle函数中。

对于领域、夹击怪物的检查在`events.js`中的checkBlock函数中。

`getCritical`, `getCriticalDamage`和`getDefDamage`三个函数依次计算的是该怪物的临界值、临界减伤和1防减伤。也可以适当进行修改。

## 根据难度分歧来自定义地图

遗憾的是，所有地图数据必须在剧本的map中指定，换句话说，我们无法在游戏进行中动态修改地图，比如为简单难度增加一个血瓶。

幸运的是，我们可以采用如下方式进行难度分歧，为用户简单难度下增加额外的血瓶或宝石。

``` js
"firstArrive": [ // 第一次到该楼层触发的事件
    {"type": "if", "condition": "flag:hard!=3", // 判断是否困难难度
        "true": [ // 不为困难，则为普通或简单难度
            {"type": "show", "loc": [3,6]} // 显示血瓶
            {"type": "if", "condition": "flag:hard==1", // 判断是否是简单难度
                "true": [
                    {"type": "show", "loc": [3,7]} // 简单难度则显示宝石
                ],
                "false": [] // 普通难度则只显示血瓶
            },
        ],
        "false": [] // 困难难度，不进行任何操作
  },
],
"events": {
  "3,6": {"enable": false} // 比如[3,6]点是一个血瓶，初始不可见
  "3,7": {"enable": false} // 比如[3,7]点是一个宝石，初始不可见
}
```

如上所示，我们在地图上设置一个额外的血瓶和宝石，并初始时设为禁用状态。

当第一次到达该楼层时，进行一次判断；如果不为困难难度，则将血瓶显示出来；再判断是否为简单难度，如果是则再把宝石显示出来。

通过对`flag:hard`进行判断的方式，我们也可以达成“对于不同的难度有着不同的地图效果”。

==========================================================================================

[继续阅读附录：所有API列表](api)
