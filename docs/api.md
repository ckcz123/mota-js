# 附录: API列表

?> 目前版本**v2.3**，上次更新时间：* {docsify-updated} *

**这里只列出所有可能会被造塔者用到的常用API，更多的有关内容请在代码内进行查询。**

如有任何疑问，请联系小艾寻求帮助。

可以在chrome浏览器的控制台中（`ctrl+shift+I`，找到Console）中直接进行调用，以查看效果。

**以下所有异步API都会加上[异步]的说明，存在此说明的请勿在事件处理的自定义脚本中使用。**

!> 最常用的新手向命令，强烈建议每个人了解

``` text

core.status.floorId
获得当前层的floorId。


core.status.maps
获得所有楼层的地图信息。


core.status.thisMap
获得当前楼层信息，其等价于core.status.maps[core.status.floorId]。


core.floors
获得所有楼层的信息。例如core.floors[core.status.floorId].events可获得本楼层的所有自定义事件。


core.status.hero
获得当前勇士状态信息。例如core.status.hero.atk就是当前勇士的攻击力数值。


core.material.enemys
获得所有怪物信息。例如core.material.enemys.greenSlime就是获得绿色史莱姆的属性数据。


core.material.items
获得所有道具的信息。


core.debug()
开启调试模式。此模式下可以按Ctrl键进行穿墙，并忽略一切事件。
此模式下不可回放录像和上传成绩。


core.updateStatusBar()
立刻刷新状态栏和地图显伤。


core.setStatus('atk', 1000)
将攻击力设置为1000；这里把atk可以改成hp, def, mdef, money, experience等等。
本句等价于 core.status.hero.atk = 1000


core.getStatus('atk')
返回当前攻击力数值。本句等价于 core.status.hero.atk。


core.setHeroLoc('x', 5)
设置勇士位置。这句话的意思是将勇士当前位置的横坐标设置为5。
同理可以设置勇士纵坐标 core.setHeroLoc('y', 3)。
值得注意的是，这句话虽然会使勇士改变位置，但并不会使界面重新绘制；如需立刻重新绘制地图还需调用：
core.clearMap('hero'); core.drawHero();
来对界面进行更新。


core.setItem('pickaxe', 10)
将破墙镐个数设置为10个。这里可以写任何道具的ID。


core.getItem('pickaxe', 4)
另勇士获得四个破墙镐。这里可以写任何道具的ID。


core.itemCount('pickaxe')
返回当前破墙镐的个数。这里可以写任何道具的ID。


core.hasItem('pickaxe')
返回当前是否存在某个道具。等价于 core.itemCount('pickaxe')>0 。


core.setFlag('xyz', 2)
设置某个flag/变量的值为2。这里可以写任何的flag变量名。


core.getFlag('xyz', 7)
获得某个flag/变量的值；如果该变量不存在，则返回第二个参数。
比如 core.getFlag('point', 2) 则获得变量point的值；如果该变量从未定义过则返回2。


core.hasFlag('xyz')
返回是否存在某个变量且不为0。等价于 core.getFlag('xyz', 0)!=0 。


core.insertAction(list, x, y, callback)
插入并执行一段自定义事件。在这里你可以写任意的自定义事件列表，有关详细写法请参见文档-事件。
x和y如果设置则覆盖"当前事件点"的坐标，callback如果设置则覆盖事件执行完毕后的回调函数。
例如： core.insertAction(["楼层切换", {"type":"changeFloor", "floorId": "MT3"}])
将依次显示剧情文本，并执行一个楼层切换的自定义事件。


core.changeFloor(floorId, stair, heroLoc, time, callback)    [异步]
立刻切换到指定楼层。
floorId为目标楼层ID，stair为到达的目标楼梯，heroLoc为到达的指定点，time为动画时间，callback为切换完毕后的回调。
例如：
core.changeFloor('MT2', 'upFloor', null, 600) 切换到MT2层的上楼点，动画事件600ms
core.changeFloor('MT5', null, {'x': 3, 'y': 6}, 0) 无动画切换到MT5层的(3,6)位置。


core.resetMap()
重置当前楼层地图。
当我们修改某一层地图后，进游戏读档，会发现修改的内容并没有被更新上去。
这是因为，H5的存档是会存下来每一个楼层的地图的，读档会从档里面获得地图信息。
此时，如果我们在某一层地图执行 core.resetMap() ，则可以立刻从剧本中读取并重置当前楼层地图。
已经被修改过的内容也会相应出现。


R
录像回放的快捷键；这不是一个控制台命令，但是也把它放在这里供使用。
录像回放在修改地图或新增数据后会很有用。


localStorage
获得所有的存档数据。可以用 core.getLocalStorage('save1') 来具体获得某个存档。

```

!> 一些相对高级的命令，针对有一定脚本经验的人

``` text

========== 可直接从core中调用的，最常被使用的函数 ==========
core.js实际上是所有API的入口（路由），核心API的实现在其他几个文件中，core.js主要进行转发操作。


core.nextX(n)
获得勇士面向的第n个位置的x坐标，n可以省略默认为1（即正前方）


core.nextY(n)
获得勇士面向的第n个位置的y坐标，n可以省略默认为1（即正前方）


core.openDoor(id, x, y, needKey, callback)    [异步]
尝试开门操作。id为目标点的ID，x和y为坐标，needKey表示是否需要使用钥匙，callback为开门完毕后的回调函数。
例如：core.openDoor('yellowDoor', 10, 3, false, function() {console.log("1")})


core.battle(id, x, y, force, callback)    [异步]
执行战斗事件。id为怪物的id，x和y为坐标，force为bool值表示是否是强制战斗，callback为战斗完毕后的回调函数。
例如：core.battle('greenSlime', null, null, true)


core.trigger(x, y)    [异步]
触发某个地点的事件。


core.clearMap(mapName)
清空某个画布图层。
mapName可为'bg', 'event', 'fg', 'event2', 'hero', 'animate', 'weather', 'ui', 'data', 'all'之一。
如果mapName为'all'，则为清空所有画布；否则只清空对应的画布。


core.drawBlock(block)
重绘某个图块。block应为core.status.thisMap.blocks中的一项。


core.drawMap(floorId, callback)
重绘某一层的地图。floorId为要绘制楼层的floorId，callback为绘制完毕后的回调函数。


core.terrainExists(x, y, id, floorId)
检测某个点是否存在（指定的）地形。
x和y为坐标；id为地形ID，可为null表示任意地形；floorId为楼层ID，可忽略表示当前楼层。


core.enemyExists(x, y, id, floorId)
检测某个点是否存在（指定的）怪物。
x和y为坐标；id为怪物ID，可为null表示任意怪物；floorId为楼层ID，可忽略表示当前楼层。


core.getBlock(x, y, floorId, needEnable)
获得某个点的当前图块信息。
x和y为坐标；floorId为楼层ID，可忽略或null表示当前楼层。
needEnable表示该点是否启用时才返回，其值不设置则默认为true。
如果该点不存在图块，则返回null。
否则，返回值如下： {"index": xxx, "block": xxx}
其中index为该点在该楼层blocks数组中的索引，block为该图块实际内容。


core.getBlockId(x, y, floorId, needEnable)
获得某个点的图块ID。
x和y为坐标；floorId为楼层ID，可忽略或null表示当前楼层。
needEnable表示是否需要该点处于启用状态才返回，其值不设置则默认为true。
如果该点不存在图块，则返回null，否则返回该点的图块ID。


core.showBlock(x, y, floorId)
将某个点从禁用变成启用状态。


core.removeBlock(x, y, floorId)
将某个点删除或从启用变成禁用状态。
如果该点不存在自定义事件（比如普通的怪物），则将直接从地图中删除。
否则将该点设置为禁用，以供以后可能的启用事件。


core.setBlock(number, x, y, floorId)
改变图块。number为要改变到的图块数字，x和y为坐标，floorId为楼层ID，可忽略表示当前楼层。


core.useItem(itemId, callback)
尝试使用某个道具。itemId为道具ID，callback为成功或失败后的回调。


core.canUseItem(itemId)
返回当前能否使用某个道具。


core.addItem(itemId, number)
将某个道具增加number个。


core.removeItem(itemId)
将某个道具个数-1；如果道具个数归0则从道具列表删除。


core.getNextItem()
轻按。


core.drawTip(text, itemIcon)
在左上角绘制一段提示信息，2秒后消失。itemIcon为道具图标的索引。


core.drawText(contents, callback)    [异步]
绘制一段文字。
不推荐使用此函数，尽量使用core.insertAction(contents)来显示剧情文本。


core.closePanel()
结束一切事件和绘制，关闭UI窗口，返回游戏进程。


core.replaceText(text)
将一段文字中的${}进行计算并替换。


core.calValue(value)
计算表达式的实际值。这个函数可以传入status:atk等这样的参数。


core.getLocalStorage(key, defaultValue)
从localStorage中获得某个数据（已被parse）；如果对应的key不存在则返回defaultValue。


core.clone(data)
深拷贝某个对象。


core.isset(x)
测试x是否不为null，不为undefined也不为NaN。


core.rand(num)
使用伪种子生成伪随机数。该随机函数能被录像支持。
num如果设置大于0，则生成一个[0, num-1]之间的数；否则生成一个0到1之间的浮点数。
此函数为伪随机算法，SL大法无效。（即多次SL后调用的该函数返回的值都是相同的。）


core.rand2(num)
使用系统的随机数算法得到的随机数。该随机函数能被录像支持。
num如果设置大于0，则生成一个[0, num-1]之间的数；否则生成一个0到2147483647之间的整数。
此函数使用了系统的Math.random()函数，支持SL大法。
但是，此函数会将生成的随机数值存入录像，因此如果调用次数太多则会导致录像文件过大。


core.restart()    [异步]
返回标题界面。


========== core.actions.XXX 和游戏控制相关的函数 ==========
actions.js主要用来进行用户交互行为的处理。
所有用户行为，比如按键、点击、滑动等等，都会被此文件接收并进行操作。


========== core.control.XXX 和游戏控制相关的函数 ==========
control.js主要用来进行游戏控制，比如行走控制、自动寻路、存读档等等游戏核心内容。


========== core.enemys.XXX 和怪物相关的函数 ==========
enemys.js主要用来进行怪物相关的内容，比如怪物的特殊属性，伤害和临界计算等。


core.enemys.hasSpecial(special, test)
测试怪物是否含有某个特殊属性。
常见用法： core.enemys.hasSpecial(monster.special, 3)  ## 测试是否拥有坚固


core.enemys.getSpecialText(enemyId)
返回一个列表，包含该怪物ID对应的所有特殊属性。


core.enemys.getSpecialHint(enemy, special)
获得怪物某个（或全部）特殊属性的文字说明。


core.enemys.canBattle(enemyId)
返回当前能否战胜某个怪物。


core.enemys.getDamage(enemyId)
返回当前对某个怪物的战斗伤害。如果无法战斗，返回null。


core.enemys.getExtraDamage(enemyId)
返回某个怪物会对勇士造成的额外伤害（不可被魔防抵消），例如仇恨、固伤等等。


core.enemys.nextCriticals(enemyId, number)
返回一个列表，为接下来number（可忽略，默认为1）个该怪物的临界值和临界减伤。
列表每一项类似 [x,y] 表示临界值为x，且临界减伤为y。
如果无临界值，则返回空列表。


core.enemys.getDefDamage(enemyId, k)
获得k（可忽略，默认为1）防减伤值。


core.enemys.getDamageInfo(enemy, hero_hp, hero_atk, hero_def, hero_mdef)
获得实际战斗信息，比如伤害，回合数，每回合伤害等等。
此函数是实际战斗过程的计算。


core.enemys.calDamage(enemy, hero_hp, hero_atk, hero_def, hero_mdef)
计算战斗伤害；实际返回的是上面getDamageInfo中伤害的数值。


core.enemys.getCurrentEnemys(floorId)
获得某一层楼剩余所有怪物的信息（供怪物手册使用）


========== core.events.XXX 和事件相关的函数 ==========
events.js主要用来进行事件处理，比如自定义事件，以及某些条件下可能会被触发的事件。
大多数事件API都在脚本编辑中存在，这里只列出部分比较重要的脚本编辑中不存在的API。 


core.events.gameOver(ending, fromReplay)
游戏结束并上传的事件。
该函数将提问是否上传和是否下载录像，并返回标题界面。


core.events.doEvents(list, x, y, callback)    [异步]
开始执行某个事件。
请不要执行此函数，尽量使用 core.insertAction(list, x, y, callback) 来开始执行一段事件。


core.events.doAction()
执行下一个事件。此函数中将对所有自定义事件类型分别处理。


core.events.openShop(shopId, needVisited)    [异步]
打开一个全局商店。needVisited表示是否需要该商店已被打开过。


core.events.disableQuickShop(shopId)
禁用一个全局商店


core.events.canUseQuickShop(shopId)
当前能否使用某个快捷商店


core.events.setHeroIcon(name)
设置勇士行走图


========== core.items.XXX 和道具相关的函数 ==========
items.js将处理和道具相关的内容，比如道具的使用，获取和删除等等。


========== core.loader.XXX 和游戏加载相关的函数 ==========
loader.js将主要用来进行资源的加载，比如加载音乐、图片、动画等等。


========== core.maps.XXX 和地图处理相关的函数 ==========
maps.js主要用来进行地图相关的的操作。包括绘制地图，获取地图上的点等等。


core.maps.canMoveHero(x,y,direction,floorId)
判断能否前往某个方向。x,y为坐标，可忽略为当前点；direction为方向，可忽略为当前方向。
floorId为楼层ID，可忽略为当前楼层。


core.maps.canMoveDirectly(destX, destY)
判断当前能否瞬间移动到某个点。
该函数如果返回0则不可瞬间移动，大于0则可以瞬间移动，且返回值是跨度（即少走的步数）。


core.maps.removeBlockById(index, floorId)
根据索引删除或禁用某块。


core.maps.removeBlockByIds(floorId, ids)
根据索引删除或禁用若干块。


========== core.ui.XXX 和对话框绘制相关的函数 ==========
ui.js主要用来进行UI窗口的绘制，比如对话框、怪物手册、楼传器、存读档界面等等。


core.ui.drawThumbnail(floorId, canvas, blocks, x, y, size, heroLoc, heroIcon)
绘制一个缩略图，比如楼传器界面，存读档界面等情况。
floorId为目标楼层ID，canvas为要绘制到的图层，blocks为要绘制的所有图块。
x,y为该图层开始绘制的起始点坐标，size为每一格的像素，heroLoc为勇士坐标，heroIcon为勇士图标。


========== core.utils.XXX 工具类的辅助函数 ==========
utils.js主要用来进行一些辅助函数的计算。


core.utils.splitLines(canvas, text, maxLength, font)
自动切分长文本的换行。
canvas为图层，text为要自动换行的内容，maxLength为每行最长像素，font为文本的字体。


core.utils.cropImage(image, size)
纵向对图片进行切分（裁剪）。


core.utils.unshift(a, b)
向某个数组前插入另一个数组或元素


core.utils.encodeBase64(str)
Base64加密字符串


core.utils.decodeBase64(str)
Base64解密字符串


core.utils.formatBigNumber(x)
大数据的格式化


core.utils.arrayToRGB(color)
将形如[255,0,0]之类的数组转成#FF0000这样的RGB形式。


core.utils.encodeRoute(list)
压缩加密路线。可以使用core.encodeRoute(core.status.route)来压缩当前路线。


core.utils.decodeRoute(route)
解压缩（解密）路线。


core.utils.readFile(success, error, readType)    [异步]
尝试请求读取一个本地文件内容。
success和error为成功/失败后的回调，readType不设置则以文本读取，否则以DataUrl形式读取。


core.utils.readFileContent(content)    [异步]
文件读取完毕后的内容处理。


core.utils.download(filename, content)
尝试生成并下载一个文件。


core.utils.copy(data)
尝试复制一段文本到剪切板。


core.utils.http(type, url, formData, success, error)    [异步]
发送一个异步HTTP请求。
type为'GET'或者'POST'；url为目标地址；formData如果是POST请求则为表单数据。
success为成功后的回调，error为失败后的回调。

```
