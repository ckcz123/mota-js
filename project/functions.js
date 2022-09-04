///<reference path='../runtime.d.ts'/>
var functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a =
{
	"events": {
		"resetGame": function (hero, hard, floorId, maps, values) {
			// 重置整个游戏；此函数将在游戏开始时，或者每次读档时最先被调用
			// hero：勇士信息；hard：难度；floorId：当前楼层ID；maps：地图信息；values：全局数值信息

			// 清除游戏数据
			// 这一步会清空状态栏和全部画布内容，并删除所有动态创建的画布
			core.clearStatus();
			// 初始化status
			core.status = core.clone(core.initStatus, function (name) {
				return name != 'hero' && name != 'maps';
			});
			core.control._bindRoutePush();
			core.status.played = true;
			// 初始化人物，图标，统计信息
			core.status.hero = core.clone(hero);
			window.hero = core.status.hero;
			window.flags = core.status.hero.flags;
			core.events.setHeroIcon(core.status.hero.image, true);
			core.control._initStatistics(core.animateFrame.totalTime);
			core.status.hero.statistics.totalTime = core.animateFrame.totalTime =
				Math.max(core.status.hero.statistics.totalTime, core.animateFrame.totalTime);
			core.status.hero.statistics.start = null;
			// 初始难度
			core.status.hard = hard || "";
			// 初始化地图
			core.status.floorId = floorId;
			core.status.maps = maps;
			core.maps._resetFloorImages();
			// 初始化怪物和道具
			core.material.enemys = core.enemys.getEnemys();
			core.material.items = core.items.getItems();
			// 初始化全局数值和全局开关
			core.values = core.clone(core.data.values);
			for (var key in values || {})
				core.values[key] = values[key];
			core.flags = core.clone(core.data.flags);
			var globalFlags = core.getFlag("globalFlags", {});
			for (var key in globalFlags)
				core.flags[key] = globalFlags[key];
			core._init_sys_flags();
			// 初始化界面，状态栏等
			core.resize();
			// 状态栏是否显示
			if (core.hasFlag('hideStatusBar'))
				core.hideStatusBar(core.hasFlag('showToolbox'));
			else
				core.showStatusBar();
			// 隐藏右下角的音乐按钮
			core.dom.musicBtn.style.display = 'none';
		},
		"win": function (reason, norank, noexit) {
			// 游戏获胜事件
			// 请注意，成绩统计时是按照hp进行上传并排名
			// 可以先在这里对最终分数进行计算，比如将2倍攻击和5倍黄钥匙数量加到分数上
			// core.status.hero.hp += 2 * core.getRealStatus('atk') + 5 * core.itemCount('yellowKey');

			// 如果不退出，则临时存储数据
			if (noexit) {
				core.status.extraEvent = core.clone(core.status.event);
			}

			// 游戏获胜事件 
			core.ui.closePanel();
			var replaying = core.isReplaying();
			if (replaying) core.stopReplay();
			core.waitHeroToStop(function () {
				if (!noexit) {
					core.clearMap('all'); // 清空全地图
					core.deleteAllCanvas(); // 删除所有创建的画布
					core.dom.gif2.innerHTML = "";
				}
				reason = core.replaceText(reason);
				core.drawText([
					"\t[" + (reason || "恭喜通关") + "]你的分数是${status:hp}。"
				], function () {
					core.events.gameOver(reason || '', replaying, norank);
				})
			});
		},
		"lose": function (reason) {
			// 游戏失败事件
			core.ui.closePanel();
			var replaying = core.isReplaying();
			core.stopReplay();
			core.waitHeroToStop(function () {
				core.drawText([
					"\t[" + (reason || "结局1") + "]你死了。\n如题。"
				], function () {
					core.events.gameOver(null, replaying);
				});
			})
		},
		"changingFloor": function (floorId, heroLoc) {
			// 正在切换楼层过程中执行的操作；此函数的执行时间是“屏幕完全变黑“的那一刻
			// floorId为要切换到的楼层ID；heroLoc表示勇士切换到的位置

			// ---------- 此时还没有进行切换，当前floorId还是原来的 ---------- //
			var currentId = core.status.floorId || null; // 获得当前的floorId，可能为null
			var fromLoad = core.hasFlag('__fromLoad__'); // 是否是读档造成的切换
			var isFlying = core.hasFlag('__isFlying__'); // 是否是楼传造成的切换
			if (!fromLoad && !(isFlying && currentId == floorId)) {
				if (!core.hasFlag("__leaveLoc__")) core.setFlag("__leaveLoc__", {});
				if (currentId != null) core.getFlag("__leaveLoc__")[currentId] = core.clone(core.status.hero.loc);
			}

			// 可以对currentId进行判定，比如删除某些自定义图层等
			// if (currentId == 'MT0') {
			//     core.deleteAllCanvas();
			// }

			// 根据分区信息自动砍层与恢复
			if (core.autoRemoveMaps) core.autoRemoveMaps(floorId);

			// 重置画布尺寸
			core.maps.resizeMap(floorId);
			// 设置勇士的位置
			heroLoc.direction = core.turnDirection(heroLoc.direction);
			core.status.hero.loc = heroLoc;
			// 检查重生怪并重置
			if (!fromLoad) {
				core.extractBlocks(floorId);
				core.status.maps[floorId].blocks.forEach(function (block) {
					if (block.disable && core.enemys.hasSpecial(block.event.id, 23)) {
						block.disable = false;
						core.setMapBlockDisabled(floorId, block.x, block.y, false);
						core.maps._updateMapArray(floorId, block.x, block.y);
					}
				});
				core.control.gatherFollowers();
			}

			// ---------- 重绘新地图；这一步将会设置core.status.floorId ---------- //
			core.drawMap(floorId);

			// 切换楼层BGM
			if (core.status.maps[floorId].bgm) {
				var bgm = core.status.maps[floorId].bgm;
				if (bgm instanceof Array) bgm = bgm[Math.floor(Math.random() * bgm.length)]; // 多个bgm则随机播放一个
				if (!core.hasFlag("__bgm__")) core.playBgm(bgm);
			} else if (fromLoad && !core.hasFlag("__bgm__")) {
				core.pauseBgm();
			}
			// 更改画面色调
			var color = core.getFlag('__color__', null);
			if (!color && core.status.maps[floorId].color)
				color = core.status.maps[floorId].color;
			core.clearMap('curtain');
			core.status.curtainColor = color;
			if (color) core.fillRect('curtain', 0, 0, core._PX_ || core.__PIXELS__, core._PY_ || core.__PIXELS__, core.arrayToRGBA(color));
			// 更改天气
			var weather = core.getFlag('__weather__', null);
			if (!weather && core.status.maps[floorId].weather)
				weather = core.status.maps[floorId].weather;
			if (weather)
				core.setWeather(weather[0], weather[1]);
			else core.setWeather();

			// ...可以新增一些其他内容，比如创建个画布在右上角显示什么内容等等

		},
		"afterChangeFloor": function (floorId) {
			// 转换楼层结束的事件；此函数会在整个楼层切换完全结束后再执行
			// floorId是切换到的楼层

			// 如果是读档，则进行检查（是否需要恢复事件）
			if (core.hasFlag('__fromLoad__')) {
				core.events.recoverEvents(core.getFlag("__events__"));
				core.removeFlag("__events__");
			} else {
				// 每次抵达楼层执行的事件
				core.insertAction(core.floors[floorId].eachArrive);

				// 首次抵达楼层时执行的事件（后插入，先执行）
				if (!core.hasVisitedFloor(floorId)) {
					core.insertAction(core.floors[floorId].firstArrive);
					core.visitFloor(floorId);
				}
			}
		},
		"flyTo": function (toId, callback) {
			// 楼层传送器的使用，从当前楼层飞往toId
			// 如果不能飞行请返回false

			var fromId = core.status.floorId;

			// 检查能否飞行
			if (!core.status.maps[fromId].canFlyFrom || !core.status.maps[toId].canFlyTo || !core.hasVisitedFloor(toId)) {
				core.playSound('操作失败');
				core.drawTip("无法飞往" + core.status.maps[toId].title + "！", 'fly');
				return false;
			}

			// 平面塔模式
			var stair = null,
				loc = null;
			if (core.flags.flyRecordPosition) {
				loc = core.getFlag("__leaveLoc__", {})[toId] || null;
			}
			if (core.status.maps[toId].flyPoint != null && core.status.maps[toId].flyPoint.length == 2) {
				stair = 'flyPoint';
			}
			if (stair == null && loc == null) {
				// 获得两个楼层的索引，以决定是上楼梯还是下楼梯
				var fromIndex = core.floorIds.indexOf(fromId),
					toIndex = core.floorIds.indexOf(toId);
				var stair = fromIndex <= toIndex ? "downFloor" : "upFloor";
				// 地下层：同层传送至上楼梯
				if (fromIndex == toIndex && core.status.maps[fromId].underGround) stair = "upFloor";
			}

			// 记录录像
			core.status.route.push("fly:" + toId);
			// 传送
			core.ui.closePanel();
			core.setFlag('__isFlying__', true);
			core.changeFloor(toId, stair, loc, null, function () {
				core.removeFlag("__isFlying__");
				if (callback) callback();
			});

			return true;
		},
		"beforeBattle": function (enemyId, x, y) {
			// 战斗前触发的事件，可以加上一些战前特效（详见下面支援的例子）
			// 此函数在“检测能否战斗和自动存档”【之后】执行。如果需要更早的战前事件，请在插件中覆重写 core.events.doSystemEvent 函数。
			// 返回true则将继续战斗，返回false将不再战斗。

			// ------ 支援技能 ------ //
			if (x != null && y != null) {
				var index = x + "," + y,
					cache = core.status.checkBlock.cache[index] || {},
					guards = cache.guards || [];
				// 如果存在支援怪
				if (guards.length > 0) {
					// 记录flag，当前要参与支援的怪物
					core.setFlag("__guards__" + x + "_" + y, guards);
					var actions = [{ "type": "playSound", "name": "跳跃" }];
					// 增加支援的特效动画（图块跳跃）
					guards.forEach(function (g) {
						core.push(actions, { "type": "jump", "from": [g[0], g[1]], "to": [x, y], "time": 300, "keep": false, "async": true });
					});
					core.push(actions, [
						{ "type": "waitAsync" }, // 等待所有异步事件执行完毕
						{ "type": "setBlock", "number": enemyId, "loc": [[x, y]] }, // 重新设置怪物自身
						{ "type": "battle", "loc": [x, y] } // 重要！重新触发本次战斗
					]);
					core.insertAction(actions);
					return false;
				}
			}

			return true;
		},
		"afterBattle": function (enemyId, x, y) {
			// 战斗结束后触发的事件

			var enemy = core.material.enemys[enemyId];
			var special = enemy.special;

			// 播放战斗音效和动画
			// 默认播放的动画；你也可以使用
			var animate = 'hand'; // 默认动画
			// 检查当前装备是否存在攻击动画
			var equipId = core.getEquip(0);
			if (equipId && (core.material.items[equipId].equip || {}).animate)
				animate = core.material.items[equipId].equip.animate;
			// 你也可以在这里根据自己的需要，比如enemyId或special或flag来修改播放的动画效果
			// if (enemyId == '...') animate = '...';

			// 检查该动画是否存在SE，如果不存在则使用默认音效
			if (!(core.material.animates[animate] || {}).se)
				core.playSound('attack.mp3');

			// 播放动画；如果不存在坐标（强制战斗）则播放到勇士自身
			if (x != null && y != null)
				core.drawAnimate(animate, x, y);
			else
				core.drawHeroAnimate(animate);

			// 获得战斗伤害信息
			var damageInfo = core.getDamageInfo(enemyId, null, x, y) || {};
			// 战斗伤害
			var damage = damageInfo.damage;
			// 当前战斗回合数，可用于战后所需的判定
			var turn = damageInfo.turn;
			// 判定是否致死
			if (damage == null || damage >= core.status.hero.hp) {
				core.status.hero.hp = 0;
				core.updateStatusBar(false, true);
				core.events.lose('战斗失败');
				return;
			}

			// 扣减体力值并记录统计数据
			core.status.hero.hp -= damage;
			core.status.hero.statistics.battleDamage += damage;
			core.status.hero.statistics.battle++;

			// 计算当前怪物的支援怪物
			var guards = [];
			if (x != null && y != null) {
				guards = core.getFlag("__guards__" + x + "_" + y, []);
				core.removeFlag("__guards__" + x + "_" + y);
			}

			// 获得金币
			var money = guards.reduce(function (curr, g) {
				return curr + core.material.enemys[g[2]].money;
			}, core.getEnemyValue(enemy, "money", x, y));
			if (core.hasItem('coin')) money *= 2; // 幸运金币：双倍
			if (core.hasFlag('curse')) money = 0; // 诅咒效果
			core.status.hero.money += money;
			core.status.hero.statistics.money += money;

			// 获得经验
			var exp = guards.reduce(function (curr, g) {
				return curr + core.material.enemys[g[2]].exp;
			}, core.getEnemyValue(enemy, "exp", x, y));
			if (core.hasFlag('curse')) exp = 0;
			core.status.hero.exp += exp;
			core.status.hero.statistics.exp += exp;

			var hint = "打败 " + core.getEnemyValue(enemy, "name", x, y);
			if (core.flags.statusBarItems.indexOf('enableMoney') >= 0)
				hint += ',' + core.getStatusLabel('money') + '+' + money; // hint += "，金币+" + money;
			if (core.flags.statusBarItems.indexOf('enableExp') >= 0)
				hint += ',' + core.getStatusLabel('exp') + '+' + exp; // hint += "，经验+" + exp;
			core.drawTip(hint, enemy.id);

			// 中毒
			if (core.enemys.hasSpecial(special, 12)) {
				core.triggerDebuff('get', 'poison');
			}
			// 衰弱
			if (core.enemys.hasSpecial(special, 13)) {
				core.triggerDebuff('get', 'weak');
			}
			// 诅咒
			if (core.enemys.hasSpecial(special, 14)) {
				core.triggerDebuff('get', 'curse');
			}
			// 仇恨怪物将仇恨值减半
			if (core.enemys.hasSpecial(special, 17)) {
				core.setFlag('hatred', Math.floor(core.getFlag('hatred', 0) / 2));
			}
			// 自爆
			if (core.enemys.hasSpecial(special, 19)) {
				core.status.hero.statistics.battleDamage += core.status.hero.hp - 1;
				core.status.hero.hp = 1;
			}
			// 退化
			if (core.enemys.hasSpecial(special, 21)) {
				core.status.hero.atk -= (enemy.atkValue || 0);
				core.status.hero.def -= (enemy.defValue || 0);
				if (core.status.hero.atk < 0) core.status.hero.atk = 0;
				if (core.status.hero.def < 0) core.status.hero.def = 0;
			}
			// 增加仇恨值
			core.setFlag('hatred', core.getFlag('hatred', 0) + core.values.hatred);

			// 战后的技能处理，比如扣除魔力值
			if (core.flags.statusBarItems.indexOf('enableSkill') >= 0) {
				// 检测当前开启的技能类型
				var skill = core.getFlag('skill', 0);
				if (skill == 1) { // 技能1：二倍斩
					core.status.hero.mana -= 5; // 扣除5点魔力值
				}
				// 关闭技能
				core.setFlag('skill', 0);
				core.setFlag('skillName', '无');
			}


			// 事件的处理
			var todo = [];

			// 加点事件
			var point = guards.reduce(function (curr, g) {
				return curr + core.material.enemys[g[2]].point;
			}, core.getEnemyValue(enemy, "point", x, y)) || 0;
			if (core.flags.enableAddPoint && point > 0) {
				core.push(todo, [{ "type": "insert", "name": "加点事件", "args": [point] }]);
			}

			// 战后事件
			if (core.status.floorId != null) {
				core.push(todo, core.floors[core.status.floorId].afterBattle[x + "," + y]);
			}
			core.push(todo, enemy.afterBattle);

			// 在这里增加其他的自定义事件需求
			/*
			if (enemyId=='xxx') {
				core.push(todo, [
					{"type": "...", ...},
				]);
			}
			*/

			// 如果事件不为空，将其插入
			if (todo.length > 0) core.insertAction(todo, x, y);

			// 删除该点设置的怪物信息
			delete ((flags.enemyOnPoint || {})[core.status.floorId] || {})[x + "," + y];

			// 因为removeBlock和hideBlock都会刷新状态栏，因此将删除部分移动到这里并保证刷新只执行一次，以提升效率
			if (core.getBlock(x, y) != null) {
				// 检查是否是重生怪物；如果是则仅隐藏不删除
				if (core.hasSpecial(enemy.special, 23)) {
					core.hideBlock(x, y);
				} else {
					core.removeBlock(x, y);
				}
			} else {
				core.updateStatusBar();
			}

			// 如果已有事件正在处理中
			if (core.status.event.id == null)
				core.continueAutomaticRoute();
			else
				core.clearContinueAutomaticRoute();

		},
		"afterOpenDoor": function (doorId, x, y) {
			// 开一个门后触发的事件

			var todo = [];
			// 检查该点的开门后事件
			if (core.status.floorId) {
				core.push(todo, core.floors[core.status.floorId].afterOpenDoor[x + "," + y]);
			}
			// 检查批量开门事件
			var door = core.getBlockById(doorId);
			if (door && door.event.doorInfo) {
				core.push(todo, door.event.doorInfo.afterOpenDoor);
			}

			if (todo.length > 0) core.insertAction(todo, x, y);

			if (core.status.event.id == null)
				core.continueAutomaticRoute();
			else
				core.clearContinueAutomaticRoute();
		},
		"afterGetItem": function (itemId, x, y, isGentleClick) {
			// 获得一个道具后触发的事件
			// itemId：获得的道具ID；x和y是该道具所在的坐标
			// isGentleClick：是否是轻按触发的
			if (itemId.endsWith('Potion') && core.material.items[itemId].cls == 'items')
				core.playSound('回血');
			else if (itemId.endsWith('Gem') && core.material.items[itemId].cls == 'items')
				core.playSound('宝石')
			else
				core.playSound('获得道具');

			var todo = [];
			// 检查该点的获得道具后事件。
			if (core.status.floorId == null) return;
			var event = core.floors[core.status.floorId].afterGetItem[x + "," + y];
			if (event && (event instanceof Array || !isGentleClick || !event.disableOnGentleClick)) {
				if (event.data) event = event.data;
				core.unshift(todo, event);
			}

			if (todo.length > 0) core.insertAction(todo, x, y);
		},
		"afterPushBox": function () {
			// 推箱子后的事件
			if (core.searchBlock('box').length == 0) {
				// 可以通过if语句来进行开门操作
				/*
				if (core.status.floorId=='xxx') { // 在某个楼层
					core.insertAction([ // 插入一条事件
						{"type": "openDoor", "loc": [x,y]} // 开门
					])
				}
				*/
			}
		}
	},
	"enemys": {
		"getSpecials": function () {
			// 获得怪物的特殊属性，每一行定义一个特殊属性。
			// 分为五项，第一项为该特殊属性的数字，第二项为特殊属性的名字，第三项为特殊属性的描述
			// 第四项为该特殊属性的颜色，可以写十六进制 #RRGGBB 或者 [r,g,b,a] 四元数组
			// 第五项为该特殊属性的标记；目前 1 代表是地图类技能（需要进行遍历全图）
			// 名字和描述可以直接写字符串，也可以写个function将怪物传进去
			return [
				[1, "先攻", "怪物首先攻击", "#ffcc33"],
				[2, "魔攻", "怪物无视角色的防御", "#bbb0ff"],
				[3, "坚固", "怪物防御不小于角色攻击-1", "#c0b088"],
				[4, "2连击", "怪物每回合攻击2次", "#ffee77"],
				[5, "3连击", "怪物每回合攻击3次", "#ffee77"],
				[6, function (enemy) { return (enemy.n || '') + "连击"; }, function (enemy) { return "怪物每回合攻击" + (enemy.n || 4) + "次"; }, "#ffee77"],
				[7, "破甲", function (enemy) { return "战斗前，怪物附加角色防御的" + Math.floor(100 * (enemy.breakArmor || core.values.breakArmor || 0)) + "%作为伤害"; }, "#88c0ff"],
				[8, "反击", function (enemy) { return "战斗时，怪物每回合附加角色攻击的" + Math.floor(100 * (enemy.counterAttack || core.values.counterAttack || 0)) + "%作为伤害，无视角色防御"; }, "#ffaa44"],
				[9, "净化", function (enemy) { return "战斗前，怪物附加角色护盾的" + (enemy.purify || core.values.purify) + "倍作为伤害"; }, "#80eed6"],
				[10, "模仿", "怪物的攻防和角色攻防相等", "#b0c0dd"],
				[11, "吸血", function (enemy) { return "战斗前，怪物首先吸取角色的" + Math.floor(100 * enemy.vampire || 0) + "%生命（约" + Math.floor((enemy.vampire || 0) * core.getStatus('hp')) + "点）作为伤害" + (enemy.add ? "，并把伤害数值加到自身生命上" : ""); }, "#dd4448"],
				[12, "中毒", "战斗后，角色陷入中毒状态，每一步损失生命" + core.values.poisonDamage + "点", "#99ee88"],
				[13, "衰弱", "战斗后，角色陷入衰弱状态，攻防暂时下降" + (core.values.weakValue >= 1 ? core.values.weakValue + "点" : parseInt(core.values.weakValue * 100) + "%"), "#f0bbcc"],
				[14, "诅咒", "战斗后，角色陷入诅咒状态，战斗无法获得金币和经验", "#bbeef0"],
				[15, "领域", function (enemy) { return "经过怪物周围" + (enemy.zoneSquare ? "九宫格" : "十字") + "范围内" + (enemy.range || 1) + "格时自动减生命" + (enemy.zone || 0) + "点"; }, "#c677dd"],
				[16, "夹击", "经过两只相同的怪物中间，角色生命值变成一半", "#bb99ee"],
				[17, "仇恨", "战斗前，怪物附加之前积累的仇恨值作为伤害；战斗后，释放一半的仇恨值。（每杀死一个怪物获得" + (core.values.hatred || 0) + "点仇恨值）", "#b0b666"],
				[18, "阻击", function (enemy) { return "经过怪物周围" + (enemy.zoneSquare ? "九宫格" : "十字") + "时自动减生命" + (enemy.repulse || 0) + "点，同时怪物后退一格"; }, "#8888e6"],
				[19, "自爆", "战斗后角色的生命值变成1", "#ff6666"],
				[20, "无敌", "角色无法打败怪物，除非拥有十字架", "#aaaaaa"],
				[21, "退化", function (enemy) { return "战斗后角色永久下降" + (enemy.atkValue || 0) + "点攻击和" + (enemy.defValue || 0) + "点防御"; }],
				[22, "固伤", function (enemy) { return "战斗前，怪物对角色造成" + (enemy.damage || 0) + "点固定伤害，未开启负伤时无视角色护盾。"; }, "#ff9977"],
				[23, "重生", "怪物被击败后，角色转换楼层则怪物将再次出现", "#a0e0ff"],
				[24, "激光", function (enemy) { return "经过怪物同行或同列时自动减生命" + (enemy.laser || 0) + "点"; }, "#dda0dd"],
				[25, "光环", function (enemy) { return (enemy.range != null ? ((enemy.haloSquare ? "该怪物九宫格" : "该怪物十字") + enemy.haloRange + "格范围内") : "同楼层所有") + "怪物生命提升" + (enemy.hpBuff || 0) + "%，攻击提升" + (enemy.atkBuff || 0) + "%，防御提升" + (enemy.defBuff || 0) + "%，" + (enemy.haloAdd ? "可叠加" : "不可叠加"); }, "#e6e099", 1],
				[26, "支援", "当周围一圈的怪物受到攻击时将上前支援，并组成小队战斗。", "#77c0b6", 1],
				[27, "捕捉", function (enemy) { return "当走到怪物周围" + (enemy.zoneSquare ? "九宫格" : "十字") + "时会强制进行战斗。"; }, "#c0ddbb"]
			];
		},
		"getEnemyInfo": function (enemy, hero, x, y, floorId) {
			// 获得某个怪物变化后的数据；该函数将被伤害计算和怪物手册使用
			// 例如：坚固、模仿、仿攻等等
			// 
			// 参数说明：
			// enemy：该怪物信息
			// hero_hp,hero_atk,hero_def,hero_mdef：勇士的生命攻防护盾数据
			// x,y：该怪物的坐标（查看手册和强制战斗时为undefined）
			// floorId：该怪物所在的楼层
			// 后面三个参数主要是可以在光环等效果上可以适用（也可以按需制作部分范围光环效果）
			floorId = floorId || core.status.floorId;
			var hero_hp = core.getRealStatusOrDefault(hero, 'hp'),
				hero_atk = core.getRealStatusOrDefault(hero, 'atk'),
				hero_def = core.getRealStatusOrDefault(hero, 'def'),
				hero_mdef = core.getRealStatusOrDefault(hero, 'mdef');

			var mon_hp = core.getEnemyValue(enemy, 'hp', x, y, floorId),
				mon_atk = core.getEnemyValue(enemy, 'atk', x, y, floorId),
				mon_def = core.getEnemyValue(enemy, 'def', x, y, floorId),
				mon_special = core.getEnemyValue(enemy, 'special', x, y, floorId);
			var mon_money = core.getEnemyValue(enemy, 'money', x, y, floorId),
				mon_exp = core.getEnemyValue(enemy, 'exp', x, y, floorId),
				mon_point = core.getEnemyValue(enemy, 'point', x, y, floorId);
			// 模仿
			if (core.hasSpecial(mon_special, 10)) {
				mon_atk = hero_atk;
				mon_def = hero_def;
			}
			// 坚固
			if (core.hasSpecial(mon_special, 3) && mon_def < hero_atk - 1) {
				mon_def = hero_atk - 1;
			}

			var guards = [];

			// 光环和支援检查
			if (!core.status.checkBlock) core.status.checkBlock = {};

			if (core.status.checkBlock.needCache) {
				// 从V2.5.4开始，对光环效果增加缓存，以解决多次重复计算的问题，从而大幅提升运行效率。
				var hp_buff = 0,
					atk_buff = 0,
					def_buff = 0;
				// 已经计算过的光环怪ID列表，用于判定叠加
				var usedEnemyIds = {};
				// 检查光环和支援的缓存
				var index = x != null && y != null ? (x + "," + y) : floorId;
				if (!core.status.checkBlock.cache) core.status.checkBlock.cache = {};
				var cache = core.status.checkBlock.cache[index];
				if (!cache) {
					// 没有该点的缓存，则遍历每个图块
					core.extractBlocks(floorId);
					core.status.maps[floorId].blocks.forEach(function (block) {
						if (!block.disable) {
							// 获得该图块的ID
							var id = block.event.id,
								enemy = core.material.enemys[id];
							// 检查【光环】技能，数字25
							if (enemy && core.hasSpecial(enemy.special, 25)) {
								// 检查是否是范围光环
								var inRange = enemy.haloRange == null;
								if (enemy.haloRange != null && x != null && y != null) {
									var dx = Math.abs(block.x - x),
										dy = Math.abs(block.y - y);
									// 检查十字和九宫格光环
									if (dx + dy <= enemy.haloRange) inRange = true;
									if (enemy.haloSquare && dx <= enemy.haloRange && dy <= enemy.haloRange) inRange = true;
								}
								// 检查是否可叠加
								if (inRange && (enemy.haloAdd || !usedEnemyIds[enemy.id])) {
									hp_buff += enemy.hpBuff || 0;
									atk_buff += enemy.atkBuff || 0;
									def_buff += enemy.defBuff || 0;
									usedEnemyIds[enemy.id] = true;
								}
							}
							// 检查【支援】技能，数字26
							if (enemy && core.hasSpecial(enemy.special, 26) &&
								// 检查支援条件，坐标存在，距离为1，且不能是自己
								// 其他类型的支援怪，比如十字之类的话.... 看着做是一样的
								x != null && y != null && Math.abs(block.x - x) <= 1 && Math.abs(block.y - y) <= 1 && !(x == block.x && y == block.y)) {
								// 记录怪物的x,y，ID
								guards.push([block.x, block.y, id]);
							}

							// TODO：如果有其他类型光环怪物在这里仿照添加检查
							// 注：新增新的类光环属性（需要遍历全图的）需要在特殊属性定义那里的第五项写1，参见光环和支援的特殊属性定义。
						}
					});

					core.status.checkBlock.cache[index] = { "hp_buff": hp_buff, "atk_buff": atk_buff, "def_buff": def_buff, "guards": guards };
				} else {
					// 直接使用缓存数据
					hp_buff = cache.hp_buff;
					atk_buff = cache.atk_buff;
					def_buff = cache.def_buff;
					guards = cache.guards;
				}

				// 增加比例；如果要增加数值可以直接在这里修改
				mon_hp *= (1 + hp_buff / 100);
				mon_atk *= (1 + atk_buff / 100);
				mon_def *= (1 + def_buff / 100);
			}

			// TODO：可以在这里新增其他的怪物数据变化
			// 比如仿攻（怪物攻击不低于勇士攻击）：
			// if (core.hasSpecial(mon_special, 27) && mon_atk < hero_atk) {
			//     mon_atk = hero_atk;
			// }
			// 也可以按需增加各种自定义内容

			return {
				"hp": Math.floor(mon_hp),
				"atk": Math.floor(mon_atk),
				"def": Math.floor(mon_def),
				"money": Math.floor(mon_money),
				"exp": Math.floor(mon_exp),
				"point": Math.floor(mon_point),
				"special": mon_special,
				"guards": guards, // 返回支援情况
			};
		},
		"getDamageInfo": function (enemy, hero, x, y, floorId) {
			// 获得战斗伤害信息（实际伤害计算函数）
			// 
			// 参数说明：
			// enemy：该怪物信息
			// hero：勇士的当前数据；如果对应项不存在则会从core.status.hero中取。
			// x,y：该怪物的坐标（查看手册和强制战斗时为undefined）
			// floorId：该怪物所在的楼层
			// 后面三个参数主要是可以在光环等效果上可以适用
			floorId = floorId || core.status.floorId;

			var hero_hp = core.getRealStatusOrDefault(hero, 'hp'),
				hero_atk = core.getRealStatusOrDefault(hero, 'atk'),
				hero_def = core.getRealStatusOrDefault(hero, 'def'),
				hero_mdef = core.getRealStatusOrDefault(hero, 'mdef'),
				origin_hero_hp = core.getStatusOrDefault(hero, 'hp'),
				origin_hero_atk = core.getStatusOrDefault(hero, 'atk'),
				origin_hero_def = core.getStatusOrDefault(hero, 'def');

			// 勇士的负属性都按0计算
			hero_hp = Math.max(0, hero_hp);
			hero_atk = Math.max(0, hero_atk);
			hero_def = Math.max(0, hero_def);
			hero_mdef = Math.max(0, hero_mdef);

			// 怪物的各项数据
			// 对坚固模仿等处理扔到了脚本编辑-getEnemyInfo之中
			var enemyInfo = core.enemys.getEnemyInfo(enemy, hero, x, y, floorId);
			var mon_hp = enemyInfo.hp,
				mon_atk = enemyInfo.atk,
				mon_def = enemyInfo.def,
				mon_special = enemyInfo.special;

			// 技能的处理
			if (core.getFlag('skill', 0) == 1) { // 开启了技能1：二倍斩
				hero_atk *= 2; // 计算时攻击力翻倍	
			}

			// 如果是无敌属性，且勇士未持有十字架
			if (core.hasSpecial(mon_special, 20) && !core.hasItem("cross"))
				return null; // 不可战斗

			// 战前造成的额外伤害（可被护盾抵消）
			var init_damage = 0;

			// 吸血
			if (core.hasSpecial(mon_special, 11)) {
				var vampire_damage = hero_hp * enemy.vampire;

				// 如果有神圣盾免疫吸血等可以在这里写
				// 也可以用hasItem和hasEquip来判定装备
				// if (core.hasFlag('shield5')) vampire_damage = 0;

				vampire_damage = Math.floor(vampire_damage) || 0;
				// 加到自身
				if (enemy.add) // 如果加到自身
					mon_hp += vampire_damage;

				init_damage += vampire_damage;
			}

			// 每回合怪物对勇士造成的战斗伤害
			var per_damage = mon_atk - hero_def;
			// 魔攻：战斗伤害就是怪物攻击力
			if (core.hasSpecial(mon_special, 2)) per_damage = mon_atk;
			// 战斗伤害不能为负值
			if (per_damage < 0) per_damage = 0;

			// 2连击 & 3连击 & N连击
			if (core.hasSpecial(mon_special, 4)) per_damage *= 2;
			if (core.hasSpecial(mon_special, 5)) per_damage *= 3;
			if (core.hasSpecial(mon_special, 6)) per_damage *= (enemy.n || 4);

			// 每回合的反击伤害；反击是按照勇士的攻击次数来计算回合
			var counterDamage = 0;
			if (core.hasSpecial(mon_special, 8))
				counterDamage += Math.floor((enemy.counterAttack || core.values.counterAttack) * hero_atk);

			// 先攻
			if (core.hasSpecial(mon_special, 1)) init_damage += per_damage;

			// 破甲
			if (core.hasSpecial(mon_special, 7))
				init_damage += Math.floor((enemy.breakArmor || core.values.breakArmor) * hero_def);

			// 净化
			if (core.hasSpecial(mon_special, 9))
				init_damage += Math.floor((enemy.purify || core.values.purify) * hero_mdef);

			// 勇士每回合对怪物造成的伤害
			var hero_per_damage = Math.max(hero_atk - mon_def, 0);

			// 如果没有破防，则不可战斗
			if (hero_per_damage <= 0) return null;

			// 勇士的攻击回合数；为怪物生命除以每回合伤害向上取整
			var turn = Math.ceil(mon_hp / hero_per_damage);

			// ------ 支援 ----- //
			// 这个递归最好想明白为什么，flag:__extraTurn__是怎么用的
			var guards = core.getFlag("__guards__" + x + "_" + y, enemyInfo.guards);
			var guard_before_current_enemy = false; // ------ 支援怪是先打(true)还是后打(false)？
			turn += core.getFlag("__extraTurn__", 0);
			if (guards.length > 0) {
				if (!guard_before_current_enemy) { // --- 先打当前怪物，记录当前回合数
					core.setFlag("__extraTurn__", turn);
				}
				// 获得那些怪物组成小队战斗
				for (var i = 0; i < guards.length; i++) {
					var gx = guards[i][0],
						gy = guards[i][1],
						gid = guards[i][2];
					// 递归计算支援怪伤害信息，这里不传x,y保证不会重复调用
					// 这里的mdef传0，因为护盾应该只会被计算一次
					var info = core.enemys.getDamageInfo(core.material.enemys[gid], { hp: origin_hero_hp, atk: origin_hero_atk, def: origin_hero_def, mdef: 0 });
					if (info == null) { // 小队中任何一个怪物不可战斗，直接返回null
						core.removeFlag("__extraTurn__");
						return null;
					}
					// 已经进行的回合数
					core.setFlag("__extraTurn__", info.turn);
					init_damage += info.damage;
				}
				if (guard_before_current_enemy) { // --- 先打支援怪物，增加当前回合数
					turn += core.getFlag("__extraTurn__", 0);
				}
			}
			core.removeFlag("__extraTurn__");
			// ------ 支援END ------ //

			// 最终伤害：初始伤害 + 怪物对勇士造成的伤害 + 反击伤害
			var damage = init_damage + (turn - 1) * per_damage + turn * counterDamage;
			// 再扣去护盾
			damage -= hero_mdef;

			// 检查是否允许负伤
			if (!core.flags.enableNegativeDamage)
				damage = Math.max(0, damage);

			// 最后处理仇恨和固伤（因为这两个不能被护盾减伤）
			if (core.hasSpecial(mon_special, 17)) { // 仇恨
				damage += core.getFlag('hatred', 0);
			}
			if (core.hasSpecial(mon_special, 22)) { // 固伤
				damage += enemy.damage || 0;
			}

			return {
				"mon_hp": Math.floor(mon_hp),
				"mon_atk": Math.floor(mon_atk),
				"mon_def": Math.floor(mon_def),
				"init_damage": Math.floor(init_damage),
				"per_damage": Math.floor(per_damage),
				"hero_per_damage": Math.floor(hero_per_damage),
				"turn": Math.floor(turn),
				"damage": Math.floor(damage)
			};
		}
	},
	"actions": {
		"onKeyUp": function (keyCode, altKey) {
			// 键盘按键处理，可以在这里自定义快捷键列表
			// keyCode：当前按键的keyCode（每个键的keyCode自行百度）
			// altKey：Alt键是否被按下，为true代表同时按下了Alt键
			// 可以在这里任意增加或编辑每个按键的行为

			// 如果处于正在行走状态，则不处理
			if (core.isMoving()) return;

			// 商店长按时忽略
			if (core.status.onShopLongDown) return core.status.onShopLongDown = false;

			// Alt+0~9，快捷换上套装
			if (altKey && keyCode >= 48 && keyCode <= 57) {
				core.items.quickLoadEquip(keyCode - 48);
				return;
			}

			// 根据keyCode值来执行对应操作
			switch (keyCode) {
				case 27: // ESC：打开菜单栏
					core.openSettings(true);
					break;
				case 88: // X：使用怪物手册
					core.openBook(true);
					break;
				case 71: // G：使用楼传器
					core.useFly(true);
					break;
				case 65: // A：读取自动存档（回退）
					core.doSL("autoSave", "load");
					break;
				case 87: // W：撤销回退
					core.doSL("autoSave", "reload");
					break;
				case 83: // S：存档
					core.save(true);
					break;
				case 68: // D：读档
					core.load(true);
					break;
				case 69: // E：打开光标
					core.ui._drawCursor();
					break;
				case 84: // T：打开道具栏
					core.openToolbox(true);
					break;
				case 81: // Q：打开装备栏
					core.openEquipbox(true);
					break;
				case 90: // Z：转向
					core.turnHero();
					break;
				case 86: // V：打开快捷商店列表
					core.openQuickShop(true);
					break;
				case 32: // SPACE：轻按
					core.getNextItem();
					break;
				case 82: // R：回放录像
					core.ui._drawReplay();
					break;
				case 33:
				case 34: // PgUp/PgDn：浏览地图
					core.ui._drawViewMaps();
					break;
				case 66: // B：打开数据统计
					core.ui._drawStatistics();
					break;
				case 72: // H：打开帮助页面
					core.ui._drawHelp();
					break;
				case 77: // M：打开存档笔记
					core.actions._clickNotes_show();
					break;
				case 78: // N：重新开始
					core.confirmRestart();
					break;
				case 79: // O：查看工程
					core.actions._clickGameInfo_openProject();
					break;
				case 80: // P：游戏主页
					core.actions._clickGameInfo_openComments();
					break;
				case 49: // 快捷键1: 破
					if (core.hasItem('pickaxe')) {
						core.status.route.push("key:49"); // 将按键记在录像中
						core.useItem('pickaxe', true); // 第二个参数true代表该次使用道具是被按键触发的，使用过程不计入录像
					}
					break;
				case 50: // 快捷键2: 炸
					if (core.hasItem('bomb')) {
						core.status.route.push("key:50"); // 将按键记在录像中
						core.useItem('bomb', true); // 第二个参数true代表该次使用道具是被按键触发的，使用过程不计入录像
					}
					break;
				case 51: // 快捷键3: 飞
					if (core.hasItem('centerFly')) {
						core.ui._drawCenterFly();
					}
					break;
				case 52: // 快捷键4：破冰/冰冻/地震/上下楼器/... 其他道具依次判断
					{
						var list = ["icePickaxe", "freezeBadge", "earthquake", "upFly", "downFly", "jumpShoes", "lifeWand", "poisonWine", "weakWine", "curseWine", "superWine"];
						for (var i = 0; i < list.length; i++) {
							var itemId = list[i];
							if (core.canUseItem(itemId)) {
								core.status.route.push("key:52");
								core.useItem(itemId, true);
								break;
							}
						}
					}
					break;
				case 53: // 5：读取自动存档（回退），方便手机版操作
					core.doSL("autoSave", "load");
					break;
				case 54: // 6：撤销回退，方便手机版操作
					core.doSL("autoSave", "reload");
					break;
				case 55: // 快捷键7：绑定为轻按，方便手机版操作
					core.getNextItem();
					break;
				case 118: // F7：开启debug模式
				case 119: // F8：由于F7与部分浏览器有冲突，故新增F8
					core.debug();
					break;
				case 70: // F：开启技能“二倍斩”
					// 检测是否拥有“二倍斩”这个技能道具
					if (core.hasItem('skill1')) {
						core.status.route.push("key:70");
						core.useItem('skill1', true);
					}
					break;
				// 在这里可以任意新增或编辑已有的快捷键内容
				/*
				case 0: // 使用该按键的keyCode
					// 还可以再判定altKey是否被按下，即 if (altKey) { ...
		
					// ... 在这里写你要执行脚本
					// **强烈建议所有新增的自定义快捷键均能给个对应的道具可点击，以方便手机端的行为**
					if (core.hasItem('...')) {
						core.status.route.push("key:0");
						core.useItem('...', true); // 增加true代表该使用道具不计入录像
					}
		
					break;
				*/
			}

		},
		"onStatusBarClick": function (px, py, vertical) {
			// 点击状态栏时触发的事件，仅在自绘状态栏开启时生效
			// px和py为点击的像素坐标
			// vertical为录像播放过程中的横竖屏信息
			// 
			// 横屏模式下状态栏的画布大小是 129*416 （开启拓展装备栏后是 129*457）
			// 竖屏模式下状态栏的画布大小是 416*(32*rows+9) 其中rows为状态栏行数，即全塔属性中statusCanvasRowsOnMobile值
			// 可以使用 _isVertical() 来判定当前是否是竖屏模式

			// 判定当前是否是竖屏模式。录像播放过程中可能会记录当时的横竖屏信息以覆盖。
			var _isVertical = function () {
				if (core.isReplaying() && vertical != null) return vertical;
				return core.domStyle.isVertical;
			}

			// 如果正在执行事件，则忽略
			if (core.status.lockControl) return;
			// 如果当前正在行走，则忽略；也可以使用 core.waitHeroToStop(callback) 来停止行走再回调执行脚本
			if (core.isMoving()) return;

			// 判定px和py来执行自己的脚本内容.... 注意横竖屏
			// console.log("onStatusBarClick: ", px, py, _isVertical());

			// 样例一：点击某个区域后使用一个道具
			/*
			if (core.hasItem("pickaxe")) {
				if (_isVertical()) {
					// 竖屏模式下
					if (px >= 200 && px <= 250 && py >= 50 && py <= 100) {
						core.useItem("pickaxe");
					}
				} else {
					// 横屏模式下
					if (px >= 50 && px <= 100 && py >= 200 && py <= 250) {
						core.useItem("pickaxe");
					}
				}
			}
			*/

			// 样例二：点击某个区域后执行一段公共事件或脚本
			/*
			if (core.hasFlag("xxx")) {
				if (_isVertical()) {
					// 竖屏模式下
					if (px >= 200 && px <= 250 && py >= 50 && py <= 100) {
						// 记录点击坐标。这里的1代表此时是竖屏！
						core.status.route.push("click:1:" + px + ":" + py);
						// 可以插入公共事件 / 普通事件 / 执行一段脚本（如打开自绘UI或增减flag）
						core.insertCommonEvent("道具商店");
						// core.insertAction(["一段事件"]);
						// core.openItemShop("shop1");
					}
				} else {
					// 横屏模式下
					if (px >= 50 && px <= 100 && py >= 200 && py <= 250) {
						// 记录点击坐标。这里的0代表此时是横屏！
						core.status.route.push("click:0:" + px + ":" + py);
						// 可以插入公共事件 / 普通事件 / 执行一段脚本（如打开自绘UI或增减flag）
						core.insertCommonEvent("道具商店");
						// core.insertAction(["一段事件"]);
						// core.openItemShop("shop1");
					}
				}
			}
			*/

		}
	},
	"control": {
		"saveData": function () {
			// 存档操作，此函数应该返回“具体要存档的内容”

			// 差异化存储values
			var values = {};
			for (var key in core.values) {
				if (!core.same(core.values[key], core.data.values[key]))
					values[key] = core.clone(core.values[key]);
			}

			// 要存档的内容
			var data = {
				'floorId': core.status.floorId,
				'hero': core.clone(core.status.hero),
				'hard': core.status.hard,
				'maps': core.clone(core.maps.saveMap()),
				'route': core.encodeRoute(core.status.route),
				'values': values,
				'version': core.firstData.version,
				'guid': core.getGuid(),
				"time": new Date().getTime()
			};

			return data;
		},
		"loadData": function (data, callback) {
			// 读档操作；从存储中读取了内容后的行为

			// 重置游戏和路线
			core.resetGame(data.hero, data.hard, data.floorId, core.maps.loadMap(data.maps, null, data.hero.flags), data.values);
			core.status.route = core.decodeRoute(data.route);
			core.control._bindRoutePush();
			// 文字属性，全局属性
			core.status.textAttribute = core.getFlag('textAttribute', core.status.textAttribute);
			var toAttribute = core.getFlag('globalAttribute', core.status.globalAttribute);
			if (!core.same(toAttribute, core.status.globalAttribute)) {
				core.status.globalAttribute = toAttribute;
				core.resize();
			}
			// 重置音量
			core.events.setVolume(core.getFlag("__volume__", 1), 0);
			// 加载勇士图标
			var icon = core.status.hero.image;
			icon = core.getMappedName(icon);
			if (core.material.images.images[icon]) {
				core.material.images.hero = core.material.images.images[icon];
				core.material.icons.hero.width = core.material.images.images[icon].width / 4;
				core.material.icons.hero.height = core.material.images.images[icon].height / 4;
			}
			core.setFlag('__fromLoad__', true);

			// TODO：增加自己的一些读档处理

			// 切换到对应的楼层
			core.changeFloor(data.floorId, null, data.hero.loc, 0, function () {
				// TODO：可以在这里设置读档后播放BGM
				if (core.hasFlag("__bgm__")) { // 持续播放
					core.playBgm(core.getFlag("__bgm__"));
				}

				core.removeFlag('__fromLoad__');
				if (callback) callback();
			});
		},
		"getStatusLabel": function (name) {
			// 返回某个状态英文名的对应中文标签，如atk -> 攻击，def -> 防御等。
			// 请注意此项仅影响 libs/ 下的内容（如绘制怪物手册、数据统计等）
			// 自行定义的（比如获得道具效果）中用到的“攻击+3”等需要自己去对应地方修改

			return {
				name: "名称",
				lv: "等级",
				hpmax: "生命上限",
				hp: "生命",
				manamax: "魔力上限",
				mana: "魔力",
				atk: "攻击",
				def: "防御",
				mdef: "护盾",
				money: "金币",
				exp: "经验",
				point: "加点",
				steps: "步数",
			}[name] || name;
		},
		"triggerDebuff": function (action, type) {
			// 毒衰咒效果的获得与解除
			// action：获得还是解除；'get'表示获得，'remove'表示解除
			// type：一个数组表示获得了哪些毒衰咒效果；poison, weak，curse
			if (!(type instanceof Array)) type = [type];

			if (action == 'get') {
				if (core.inArray(type, 'poison') && !core.hasFlag("poison")) {
					// 获得毒效果
					core.setFlag('poison', true);
				}
				if (core.inArray(type, 'weak') && !core.hasFlag('weak')) {
					// 获得衰效果
					core.setFlag('weak', true);
					if (core.values.weakValue >= 1) {
						// >=1，直接扣数值
						core.addStatus('atk', -core.values.weakValue);
						core.addStatus('def', -core.values.weakValue);
					} else {
						// <1，扣比例
						core.addBuff('atk', -core.values.weakValue);
						core.addBuff('def', -core.values.weakValue);
					}
				}
				if (core.inArray(type, 'curse') && !core.hasFlag('curse')) {
					// 获得咒效果
					core.setFlag('curse', true);
				}
			} else if (action == 'remove') {
				var success = false;
				if (core.inArray(type, "poison") && core.hasFlag("poison")) {
					success = true;
					// 移除毒效果
					core.setFlag("poison", false);
				}
				if (core.inArray(type, "weak") && core.hasFlag("weak")) {
					success = true;
					// 移除衰效果
					core.setFlag("weak", false);
					if (core.values.weakValue >= 1) {
						// >=1，直接扣数值
						core.addStatus('atk', core.values.weakValue);
						core.addStatus('def', core.values.weakValue);
					} else {
						// <1，扣比例
						core.addBuff('atk', core.values.weakValue);
						core.addBuff('def', core.values.weakValue);
					}
				}
				if (core.inArray(type, "curse") && core.hasFlag("curse")) {
					success = true;
					// 移除咒效果
					core.setFlag("curse", false);
				}
				if (success) core.playSound('回血');
			}
		},
		"updateStatusBar": function () {
			// 更新状态栏

			// 检查等级
			core.events.checkLvUp();

			// 检查HP上限
			if (core.flags.statusBarItems.indexOf('enableHPMax') >= 0) {
				core.setStatus('hp', Math.min(core.getRealStatus('hpmax'), core.getStatus('hp')));
			}

			// 设置楼层名
			if (core.status.floorId) {
				core.setStatusBarInnerHTML('floor', core.status.maps[core.status.floorId].name);
			}

			// 设置勇士名字和图标
			core.setStatusBarInnerHTML('name', core.getStatus('name'));
			// 设置等级名称
			core.setStatusBarInnerHTML('lv', core.getLvName());

			// 设置生命上限、生命值、攻防护盾金币和经验值
			var statusList = ['hpmax', 'hp', 'mana', 'atk', 'def', 'mdef', 'money', 'exp'];
			statusList.forEach(function (item) {
				// 向下取整
				core.status.hero[item] = Math.floor(core.status.hero[item]);
				// 大数据格式化
				core.setStatusBarInnerHTML(item, core.getRealStatus(item));
			});

			// 设置魔力值; status:manamax 只有在非负时才生效。
			if (core.status.hero.manamax != null && core.getRealStatus('manamax') >= 0) {
				core.status.hero.mana = Math.min(core.status.hero.mana, core.getRealStatus('manamax'));
				core.setStatusBarInnerHTML('mana', core.status.hero.mana + "/" + core.getRealStatus('manamax'));
			} else {
				core.setStatusBarInnerHTML("mana", core.status.hero.mana);
			}
			// 设置技能栏
			// 可以用flag:skill表示当前开启的技能类型，flag:skillName显示技能名；详见文档-个性化-技能塔的支持
			core.setStatusBarInnerHTML('skill', core.getFlag('skillName', '无'));

			// 可以在这里添加自己额外的状态栏信息，比如想攻击显示 +0.5 可以这么写：
			// if (core.hasFlag('halfAtk')) core.setStatusBarInnerHTML('atk', core.statusBar.atk.innerText + "+0.5");

			// 如果是自定义添加的状态栏，也需要在这里进行设置显示的数值

			// 进阶
			if (core.flags.statusBarItems.indexOf('enableLevelUp') >= 0) {
				core.setStatusBarInnerHTML('up', core.formatBigNumber(core.getNextLvUpNeed()) || "");
			} else core.setStatusBarInnerHTML('up', "");

			// 钥匙
			var keys = ['yellowKey', 'blueKey', 'redKey', 'greenKey'];
			keys.forEach(function (key) {
				core.setStatusBarInnerHTML(key, core.setTwoDigits(core.itemCount(key)));
			});
			// 毒衰咒
			core.setStatusBarInnerHTML('poison', core.hasFlag('poison') ? "毒" : "");
			core.setStatusBarInnerHTML('weak', core.hasFlag('weak') ? "衰" : "");
			core.setStatusBarInnerHTML('curse', core.hasFlag('curse') ? "咒" : "");
			// 破炸飞
			core.setStatusBarInnerHTML('pickaxe', "破" + core.itemCount('pickaxe'));
			core.setStatusBarInnerHTML('bomb', "炸" + core.itemCount('bomb'));
			core.setStatusBarInnerHTML('fly', "飞" + core.itemCount('centerFly'));

			// 难度
			if (core.statusBar.hard.innerText != core.status.hard) {
				core.statusBar.hard.innerText = core.status.hard;
			}
			var hardColor = core.getFlag('__hardColor__');
			if (hardColor == null) core.statusBar.hard.innerText = '';
			if (core.statusBar.hard.getAttribute('_style') != hardColor) {
				core.statusBar.hard.style.color = hardColor;
				core.statusBar.hard.setAttribute('_style', hardColor);
			}
			// 自定义状态栏绘制
			core.drawStatusBar();

			// 更新阻激夹域的伤害值
			core.updateCheckBlock();
			// updateDamage只能在此处执行！！更新全地图显伤
			core.updateDamage();
		},
		"updateCheckBlock": function (floorId) {
			// 领域、夹击、阻击等的伤害值计算
			floorId = floorId || core.status.floorId;
			if (!floorId || !core.status.maps) return;

			var width = core.floors[floorId].width,
				height = core.floors[floorId].height;
			var blocks = core.getMapBlocksObj(floorId);

			var damage = {}, // 每个点的伤害值
				type = {}, // 每个点的伤害类型
				repulse = {}, // 每个点的阻击怪信息
				ambush = {}; // 每个点的捕捉信息
			var betweenAttackLocs = {}; // 所有可能的夹击点
			var needCache = false;
			var canGoDeadZone = core.flags.canGoDeadZone;
			core.flags.canGoDeadZone = true;

			// 计算血网和领域、阻击、激光的伤害，计算捕捉信息
			for (var loc in blocks) {
				var block = blocks[loc],
					x = block.x,
					y = block.y,
					id = block.event.id,
					enemy = core.material.enemys[id];
				if (block.disable) continue;

				type[loc] = type[loc] || {};

				// 血网
				// 如需调用当前楼层的ratio可使用  core.status.maps[floorId].ratio
				if (id == 'lavaNet' && !core.hasItem('amulet')) {
					damage[loc] = (damage[loc] || 0) + core.values.lavaDamage;
					type[loc][(block.event.name || "血网") + "伤害"] = true;
				}

				// 领域
				// 如果要防止领域伤害，可以直接简单的将 flag:no_zone 设为true
				if (enemy && core.hasSpecial(enemy.special, 15) && !core.hasFlag('no_zone')) {
					// 领域范围，默认为1
					var range = enemy.range || 1;
					// 是否是九宫格领域
					var zoneSquare = false;
					if (enemy.zoneSquare != null) zoneSquare = enemy.zoneSquare;
					// 在范围内进行搜索，增加领域伤害值
					for (var dx = -range; dx <= range; dx++) {
						for (var dy = -range; dy <= range; dy++) {
							if (dx == 0 && dy == 0) continue;
							var nx = x + dx,
								ny = y + dy,
								currloc = nx + "," + ny;
							if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
							// 如果是十字领域，则还需要满足 |dx|+|dy|<=range
							if (!zoneSquare && Math.abs(dx) + Math.abs(dy) > range) continue;
							damage[currloc] = (damage[currloc] || 0) + (enemy.zone || 0);
							type[currloc] = type[currloc] || {};
							type[currloc]["领域伤害"] = true;
						}
					}
				}

				// 阻击
				// 如果要防止阻击伤害，可以直接简单的将 flag:no_repulse 设为true
				if (enemy && core.hasSpecial(enemy.special, 18) && !core.hasFlag('no_repulse')) {
					var scan = enemy.zoneSquare ? core.utils.scan2 : core.utils.scan;
					for (var dir in scan) {
						var nx = x + scan[dir].x,
							ny = y + scan[dir].y,
							currloc = nx + "," + ny;
						if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
						damage[currloc] = (damage[currloc] || 0) + (enemy.repulse || 0);
						type[currloc] = type[currloc] || {};
						type[currloc]["阻击伤害"] = true;

						var rdir = core.turnDirection(":back", dir);
						// 检查下一个点是否存在事件（从而判定是否移动）
						var rnx = x + scan[rdir].x,
							rny = y + scan[rdir].y;
						if (rnx < 0 || rnx >= width || rny < 0 || rny >= height) continue;
						// 如需禁止阻击被推到已隐藏的事件处（如重生怪处），可将这一句的false改为true
						if (core.getBlock(rnx, rny, floorId, false) != null) continue;
						if (core.utils.scan[rdir] && !core.canMoveHero(x, y, rdir, floorId)) continue;
						repulse[currloc] = (repulse[currloc] || []).concat([
							[x, y, id, rdir]
						]);
					}
				}

				// 激光
				// 如果要防止激光伤害，可以直接简单的将 flag:no_laser 设为true
				if (enemy && core.hasSpecial(enemy.special, 24) && !core.hasFlag("no_laser")) {
					for (var nx = 0; nx < width; nx++) {
						var currloc = nx + "," + y;
						if (nx != x) {
							damage[currloc] = (damage[currloc] || 0) + (enemy.laser || 0);
							type[currloc] = type[currloc] || {};
							type[currloc]["激光伤害"] = true;
						}
					}
					for (var ny = 0; ny < height; ny++) {
						var currloc = x + "," + ny;
						if (ny != y) {
							damage[currloc] = (damage[currloc] || 0) + (enemy.laser || 0);
							type[currloc] = type[currloc] || {};
							type[currloc]["激光伤害"] = true;
						}
					}
				}

				// 捕捉
				// 如果要防止捕捉效果，可以直接简单的将 flag:no_ambush 设为true
				if (enemy && core.enemys.hasSpecial(enemy.special, 27) && !core.hasFlag("no_ambush")) {
					var scan = enemy.zoneSquare ? core.utils.scan2 : core.utils.scan;
					// 给周围格子加上【捕捉】记号
					for (var dir in scan) {
						var nx = x + scan[dir].x,
							ny = y + scan[dir].y,
							currloc = nx + "," + ny;
						if (nx < 0 || nx >= width || ny < 0 || ny >= height || (core.utils.scan[dir] && !core.canMoveHero(x, y, dir, floorId))) continue;
						ambush[currloc] = (ambush[currloc] || []).concat([
							[x, y, id, dir]
						]);
					}
				}

				// 夹击；在这里提前计算所有可能的夹击点，具体计算逻辑在下面
				// 如果要防止夹击伤害，可以简单的将 flag:no_betweenAttack 设为true
				if (enemy && core.enemys.hasSpecial(enemy.special, 16) && !core.hasFlag('no_betweenAttack')) {
					for (var dir in core.utils.scan) {
						var nx = x + core.utils.scan[dir].x,
							ny = y + core.utils.scan[dir].y,
							currloc = nx + "," + ny;
						if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
						betweenAttackLocs[currloc] = true;
					}
				}

				// 检查地图范围类技能
				var specialFlag = core.getSpecialFlag(enemy);
				if (specialFlag & 1) needCache = true;
				if (core.status.event.id == 'viewMaps') needCache = true;
				if ((core.status.event.id == 'book' || core.status.event.id == 'bool-detail') && core.status.event.ui) needCache = true;
			}

			// 对每个可能的夹击点计算夹击伤害
			for (var loc in betweenAttackLocs) {
				var xy = loc.split(","),
					x = parseInt(xy[0]),
					y = parseInt(xy[1]);
				// 夹击怪物的ID
				var enemyId1 = null,
					enemyId2 = null;
				// 检查左右夹击
				var leftBlock = blocks[(x - 1) + "," + y],
					rightBlock = blocks[(x + 1) + "," + y];
				var leftId = core.getFaceDownId(leftBlock),
					rightId = core.getFaceDownId(rightBlock);
				if (leftBlock && !leftBlock.disable && rightBlock && !rightBlock.disable && leftId == rightId) {
					if (core.hasSpecial(leftId, 16))
						enemyId1 = leftId;
				}
				// 检查上下夹击
				var topBlock = blocks[x + "," + (y - 1)],
					bottomBlock = blocks[x + "," + (y + 1)];
				var topId = core.getFaceDownId(topBlock),
					bottomId = core.getFaceDownId(bottomBlock);
				if (topBlock && !topBlock.disable && bottomBlock && !bottomBlock.disable && topId == bottomId) {
					if (core.hasSpecial(topId, 16))
						enemyId2 = topId;
				}

				if (enemyId1 != null || enemyId2 != null) {
					var leftHp = core.status.hero.hp - (damage[loc] || 0);
					if (leftHp > 1) {
						// 夹击伤害值
						var value = Math.floor(leftHp / 2);
						// 是否不超过怪物伤害值
						if (core.flags.betweenAttackMax) {
							var enemyDamage1 = core.getDamage(enemyId1, x, y, floorId);
							if (enemyDamage1 != null && enemyDamage1 < value)
								value = enemyDamage1;
							var enemyDamage2 = core.getDamage(enemyId2, x, y, floorId);
							if (enemyDamage2 != null && enemyDamage2 < value)
								value = enemyDamage2;
						}
						if (value > 0) {
							damage[loc] = (damage[loc] || 0) + value;
							type[loc] = type[loc] || {};
							type[loc]["夹击伤害"] = true;
						}
					}
				}
			}

			// 取消注释下面这一段可以让护盾抵御阻激夹域伤害
			/*
			for (var loc in damage) {
				damage[loc] = Math.max(0, damage[loc] - core.getRealStatus('mdef'));
			}
			*/

			core.flags.canGoDeadZone = canGoDeadZone;
			core.status.checkBlock = {
				damage: damage,
				type: type,
				repulse: repulse,
				ambush: ambush,
				needCache: needCache,
				cache: {} // clear cache
			};
		},
		"moveOneStep": function (callback) {
			// 勇士每走一步后执行的操作。callback为行走完毕后的回调
			// 这个函数执行在“刚走完”的时候，即还没有检查该点的事件和领域伤害等。
			// 请注意：瞬间移动不会执行该函数。如果要控制能否瞬间移动有三种方法：
			// 1. 将全塔属性中的cannotMoveDirectly这个开关勾上，即可在全塔中全程禁止使用瞬移。
			// 2, 将楼层属性中的cannotMoveDirectly这个开关勾上，即禁止在该层楼使用瞬移。
			// 3. 将flag:cannotMoveDirectly置为true，即可使用flag控制在某段剧情范围内禁止瞬移。

			// 增加步数
			core.status.hero.steps++;
			// 更新跟随者状态，并绘制
			core.updateFollowers();
			core.drawHero();
			// 检查中毒状态的扣血和死亡
			if (core.hasFlag('poison')) {
				core.status.hero.statistics.poisonDamage += core.values.poisonDamage;
				core.status.hero.hp -= core.values.poisonDamage;
				if (core.status.hero.hp <= 0) {
					core.status.hero.hp = 0;
					core.updateStatusBar(false, true);
					core.events.lose();
					return;
				} else {
					core.updateStatusBar(false, true);
				}
			}

			// 从v2.7开始，每一步行走不会再刷新状态栏。
			// 如果有特殊要求（如每走一步都加buff之类），可手动取消注释下面这一句：
			// core.updateStatusBar(true, true);

			// 检查自动事件
			core.checkAutoEvents();

			// ------ 检查目标点事件 ------ //
			// 无事件的道具（如血瓶）需要优先于阻激夹域判定
			var nowx = core.getHeroLoc('x'),
				nowy = core.getHeroLoc('y');
			var block = core.getBlock(nowx, nowy);
			var hasTrigger = false;
			if (block != null && block.event.trigger == 'getItem' &&
				!core.floors[core.status.floorId].afterGetItem[nowx + "," + nowy]) {
				hasTrigger = true;
				core.trigger(nowx, nowy, callback);
			}
			// 执行目标点的阻激夹域事件
			core.checkBlock();

			// 执行目标点的script和事件
			if (!hasTrigger)
				core.trigger(nowx, nowy, callback);

			// 检查该点是否是滑冰
			if (core.onSki()) {
				// 延迟到事件最后执行，因为这之前可能有阻激夹域动画
				core.insertAction({ "type": "moveAction" }, null, null, null, true);
			}

			// ------ 检查目标点事件 END ------ //

			// 如需强行终止行走可以在这里条件判定：
			// core.stopAutomaticRoute();
		},
		"moveDirectly": function (x, y, ignoreSteps) {
			// 瞬间移动；x,y为要瞬间移动的点；ignoreSteps为减少的步数，可能之前已经被计算过
			// 返回true代表成功瞬移，false代表没有成功瞬移

			// 判定能否瞬移到该点
			if (ignoreSteps == null) ignoreSteps = core.canMoveDirectly(x, y);
			if (ignoreSteps >= 0) {
				// 中毒也允许瞬移
				if (core.hasFlag('poison')) {
					var damage = ignoreSteps * core.values.poisonDamage;
					if (damage >= core.status.hero.hp) return false;
					core.status.hero.statistics.poisonDamage += damage;
					core.status.hero.hp -= damage;
				}

				core.clearMap('hero');
				// 获得勇士最后的朝向
				var lastDirection = core.status.route[core.status.route.length - 1];
				if (['left', 'right', 'up', 'down'].indexOf(lastDirection) >= 0)
					core.setHeroLoc('direction', lastDirection);
				// 设置坐标，并绘制
				core.control._moveDirectyFollowers(x, y);
				core.status.hero.loc.x = x;
				core.status.hero.loc.y = y;
				core.drawHero();
				// 记录录像
				core.status.route.push("move:" + x + ":" + y);
				// 统计信息
				core.status.hero.statistics.moveDirectly++;
				core.status.hero.statistics.ignoreSteps += ignoreSteps;
				if (core.hasFlag('poison')) {
					core.updateStatusBar(false, true);
				}
				core.ui.drawStatusBar();
				core.checkRouteFolding();
				return true;
			}
			return false;
		},
		"parallelDo": function (timestamp) {
			// 并行事件处理，可以在这里写任何需要并行处理的脚本或事件
			// 该函数将被系统反复执行，每次执行间隔视浏览器或设备性能而定，一般约为16.6ms一次
			// 参数timestamp为“从游戏资源加载完毕到当前函数执行时”的时间差，以毫秒为单位

			// 检查当前是否处于游戏开始状态
			if (!core.isPlaying()) return;

			// 执行当前楼层的并行事件处理
			if (core.status.floorId) {
				try {
					eval(core.floors[core.status.floorId].parallelDo);
				} catch (e) {
					console.error(e);
				}
			}
		}
	},
	"ui": {
		"getToolboxItems": function (cls) {
			// 获得道具栏中当前某类型道具的显示项和显示顺序
			// cls为道具类型，只可能是 tools, constants 和 equips
			// 返回一个数组，代表当前某类型道具的显示内容和顺序
			// 默认按id升序排列，您可以取消下面的注释改为按名称排列

			return Object.keys(core.status.hero.items[cls] || {})
				.filter(function (id) { return !core.material.items[id].hideInToolbox; })
				.sort( /*function (id1, id2) { return core.material.items[id1].name <= core.material.items[id2].name ? -1 : 1 }*/);
		},
		"drawStatusBar": function () {
			var ctx, fill = function (text, x, y, style) {
				core.ui.setFont(ctx, (/\w+/.test(text) ? 'italic ' : '') + 'bold 18px Verdana');
				core.ui.fillBoldText(ctx, text, x, y, style);
			};
			if (core.flags.statusCanvas) { // 系统开关「自绘状态栏」开启
				core.ui.clearMap(ctx = core.dom.statusCanvasCtx); // 清空状态栏
				core.ui.setFillStyle(ctx, core.status.globalAttribute.statusBarColor);
				if (core.domStyle.isVertical) { // 竖屏
					core.drawImage(ctx, core.statusBar.icons.floor, 6, 6, 25, 25);
					fill((core.status.thisMap || {}).name || "Loading", 42, 26);
					core.drawImage(ctx, core.statusBar.icons.hp, 137, 6, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('hp')), 173, 26);
					core.drawImage(ctx, core.statusBar.icons.atk, 268, 6, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('atk')), 304, 26);
					core.drawImage(ctx, core.statusBar.icons.def, 6, 38, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('def')), 42, 58);
					core.drawImage(ctx, core.statusBar.icons.mdef, 137, 38, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('mdef')), 173, 58);
					core.drawImage(ctx, core.statusBar.icons.money, 268, 38, 25, 25);
					fill(core.formatBigNumber(core.status.hero.money), 304, 58);
					core.drawImage(ctx, core.statusBar.icons.exp, 6, 70, 25, 25);
					fill(core.formatBigNumber(core.status.hero.exp), 42, 90);
				} else if (!core.flags.extendToolbar) { // 横屏且未隐藏状态栏
					core.drawImage(ctx, core.statusBar.icons.floor, 6, 9, 25, 25);
					fill((core.status.thisMap || {}).name || "Loading", 42, 29);
					core.drawImage(ctx, core.statusBar.icons.hp, 6, 43, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('hp')), 42, 63);
					core.drawImage(ctx, core.statusBar.icons.atk, 6, 77, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('atk')), 42, 97);
					core.drawImage(ctx, core.statusBar.icons.def, 6, 111, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('def')), 42, 131);
					core.drawImage(ctx, core.statusBar.icons.mdef, 6, 145, 25, 25);
					fill(core.formatBigNumber(core.getRealStatus('mdef')), 42, 165);
					core.drawImage(ctx, core.statusBar.icons.money, 6, 179, 25, 25);
					fill(core.formatBigNumber(core.status.hero.money), 42, 199);
					core.drawImage(ctx, core.statusBar.icons.exp, 6, 213, 25, 25);
					fill(core.formatBigNumber(core.status.hero.exp), 42, 233);
					fill(core.setTwoDigits(core.itemCount('yellowKey')), 11, 267, '#FFCCAA');
					fill(core.setTwoDigits(core.itemCount('blueKey')), 46, 267, '#AAAADD');
					fill(core.setTwoDigits(core.itemCount('redKey')), 81, 267, '#FF8888');
				}
			} else if (core.flags.extendToolbar && !core.domStyle.isVertical) { // 横屏且隐藏状态栏
				if (!core.dymCanvas['status'])
					core.ui.createCanvas('status', 0, 0, core._PX_, core._PY_, 66); // 刚好盖过显伤层
				core.ui.clearMap(ctx = core.dymCanvas['status']);
				core.ui.setFillStyle(ctx, core.status.globalAttribute.statusBarColor);
				var offset = core.status.hero.loc.x - core.bigmap.offsetX / 32 >= core._HEIGHT_ ? 0 : core._PY_;
				core.ui.setAlpha(ctx, 0.75);
				core.ui.drawWindowSkin('winskin.png', ctx, offset, 0, core._PX_ - core._PY_, core._PY_);
				core.ui.setAlpha(ctx, 1);
				core.drawImage(ctx, core.statusBar.icons.floor, 6 + offset, 9, 25, 25);
				fill((core.status.thisMap || {}).name || "Loading", 42 + offset, 29);
				core.drawImage(ctx, core.statusBar.icons.hp, 6 + offset, 43, 25, 25);
				fill(core.formatBigNumber(core.getRealStatus('hp')), 42 + offset, 63);
				core.drawImage(ctx, core.statusBar.icons.atk, 6 + offset, 77, 25, 25);
				fill(core.formatBigNumber(core.getRealStatus('atk')), 42 + offset, 97);
				core.drawImage(ctx, core.statusBar.icons.def, 6 + offset, 111, 25, 25);
				fill(core.formatBigNumber(core.getRealStatus('def')), 42 + offset, 131);
				core.drawImage(ctx, core.statusBar.icons.mdef, 6 + offset, 145, 25, 25);
				fill(core.formatBigNumber(core.getRealStatus('mdef')), 42 + offset, 165);
				core.drawImage(ctx, core.statusBar.icons.money, 6 + offset, 179, 25, 25);
				fill(core.formatBigNumber(core.status.hero.money), 42 + offset, 199);
				core.drawImage(ctx, core.statusBar.icons.exp, 6 + offset, 213, 25, 25);
				fill(core.formatBigNumber(core.status.hero.exp), 42 + offset, 233);
				fill(core.setTwoDigits(core.itemCount('yellowKey')), 11 + offset, 267, '#FFCCAA');
				fill(core.setTwoDigits(core.itemCount('blueKey')), 46 + offset, 267, '#AAAADD');
				fill(core.setTwoDigits(core.itemCount('redKey')), 81 + offset, 267, '#FF8888');
			}
		},
		"drawStatistics": function () {
			// 浏览地图时参与的统计项目

			return [
				'yellowDoor', 'blueDoor', 'redDoor', 'greenDoor', 'steelDoor',
				'yellowKey', 'blueKey', 'redKey', 'greenKey', 'steelKey',
				'redGem', 'blueGem', 'greenGem', 'yellowGem',
				'redPotion', 'bluePotion', 'greenPotion', 'yellowPotion', 'superPotion',
				'pickaxe', 'bomb', 'centerFly', 'icePickaxe', 'freezeBadge',
				'earthquake', 'upFly', 'downFly', 'jumpShoes', 'lifeWand',
				'poisonWine', 'weakWine', 'curseWine', 'superWine',
				'sword1', 'sword2', 'sword3', 'sword4', 'sword5',
				'shield1', 'shield2', 'shield3', 'shield4', 'shield5',
				// 在这里可以增加新的ID来进行统计个数，只能增加道具ID
			];
		},
		"drawAbout": function () {
			// 绘制“关于”界面
			core.ui.closePanel();
			core.lockControl();
			core.status.event.id = 'about';

			var left = 48,
				top = 36,
				right = (core._PX_ || core.__PIXELS__) - 2 * left,
				bottom = (core._PY_ || core.__PIXELS__) - 2 * top;

			core.setAlpha('ui', 0.85);
			core.fillRect('ui', left, top, right, bottom, '#000000');
			core.setAlpha('ui', 1);
			core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

			var text_start = left + 24;

			// 名称
			core.setTextAlign('ui', 'left');
			var globalAttribute = core.status.globalAttribute || core.initStatus.globalAttribute;
			core.fillText('ui', "HTML5 魔塔样板", text_start, top + 35, globalAttribute.selectColor, "bold 22px " + globalAttribute.font);
			core.fillText('ui', "版本： " + main.__VERSION__, text_start, top + 80, "#FFFFFF", "bold 17px " + globalAttribute.font);
			core.fillText('ui', "作者： 艾之葵", text_start, top + 112);
			core.fillText('ui', 'HTML5魔塔交流群：539113091', text_start, top + 112 + 32);
			// TODO: 写自己的“关于”页面，每次增加32像素即可
			core.playSound('打开界面');
		}
	}
}