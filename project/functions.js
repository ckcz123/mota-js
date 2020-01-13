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
	core.status.played = true;
	// 初始化人物，图标，统计信息
	core.status.hero = core.clone(hero);
	window.flags = core.status.hero.flags;
	core.events.setHeroIcon(core.getFlag('heroIcon', 'hero.png'), true);
	core.control._initStatistics(core.animateFrame.totalTime);
	core.status.hero.statistics.totalTime = core.animateFrame.totalTime =
		Math.max(core.status.hero.statistics.totalTime, core.animateFrame.totalTime);
	core.status.hero.statistics.start = null;
	// 初始难度
	core.status.hard = hard || "";
	// 初始化地图
	core.status.floorId = floorId;
	core.status.maps = maps;
	// 初始化怪物和道具
	core.material.enemys = core.enemys.getEnemys();
	core.material.items = core.items.getItems();
	core.items._resetItems();
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
	core.updateGlobalAttribute();
	// 状态栏是否显示
	if (core.hasFlag('hideStatusBar'))
		core.hideStatusBar(core.hasFlag('showToolbox'));
	else
		core.showStatusBar();
	// 隐藏右下角的音乐按钮
	core.dom.musicBtn.style.display = 'none';
},
        "setInitData": function () {
	// 不同难度分别设置初始属性
	if (core.status.hard == 'Easy') { // 简单难度
		core.setFlag('hard', 1); // 可以用flag:hard来获得当前难度
		// 可以在此设置一些初始福利，比如设置初始生命值可以调用：
		// core.setStatus("hp", 10000);
		// 赠送一把黄钥匙可以调用
		// core.setItem("yellowKey", 1);
	}
	if (core.status.hard == 'Normal') { // 普通难度
		core.setFlag('hard', 2); // 可以用flag:hard来获得当前难度
	}
	if (core.status.hard == 'Hard') { // 困难难度
		core.setFlag('hard', 3); // 可以用flag:hard来获得当前难度
	}
	if (core.status.hard == 'Hell') { // 噩梦难度
		core.setFlag('hard', 4); // 可以用flag:hard来获得当前难度
	}

	// 设置已经到过的楼层
	core.setFlag("__visited__", {});
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
		core.drawText([
			"\t[" + (reason || "恭喜通关") + "]你的分数是${status:hp}。"
		], function () {
			core.events.gameOver(reason || '', replaying, norank);
		})
	});
},
        "lose": function(reason) {
	// 游戏失败事件
	core.ui.closePanel();
	var replaying = core.isReplaying();
	core.stopReplay();
	core.waitHeroToStop(function() {
		core.drawText([
			"\t["+(reason||"结局1")+"]你死了。\n如题。"
		], function () {
			core.events.gameOver(null, replaying);
		});
	})
},
        "changingFloor": function (floorId, heroLoc, fromLoad) {
	// 正在切换楼层过程中执行的操作；此函数的执行时间是“屏幕完全变黑“的那一刻
	// floorId为要切换到的楼层ID；heroLoc表示勇士切换到的位置；fromLoad表示是否是从读档造成的切换

	// ---------- 此时还没有进行切换，当前floorId还是原来的 ---------- //
	var currentId = core.status.floorId || null; // 获得当前的floorId，可能为null
	if (!core.hasFlag("__leaveLoc__")) core.setFlag("__leaveLoc__", {});
	if (currentId != null) core.getFlag("__leaveLoc__")[currentId] = core.status.hero.loc;

	// 可以对currentId进行判定，比如删除某些自定义图层等
	// if (currentId == 'MT0') {
	//     core.deleteAllCanvas();
	// }

	// 重置画布尺寸
	core.maps.resizeMap(floorId);
	// 检查重生怪并重置
	if (!fromLoad) {
		core.status.maps[floorId].blocks.forEach(function (block) {
			if (block.disable && core.enemys.hasSpecial(block.event.id, 23)) {
				block.disable = false;
			}
		});
	}
	// 设置勇士的位置
	core.status.hero.loc = heroLoc;
	core.control.gatherFollowers();

	// ---------- 重绘新地图；这一步将会设置core.status.floorId ---------- //
	core.drawMap(floorId);

	// 切换楼层BGM
	if (core.status.maps[floorId].bgm) {
		var bgm = core.status.maps[floorId].bgm;
		if (bgm instanceof Array) bgm = bgm[0];
		if (!core.hasFlag("__bgm__")) core.playBgm(bgm);
	}
	// 更改画面色调
	var color = core.getFlag('__color__', null);
	if (!color && core.status.maps[floorId].color)
		color = core.status.maps[floorId].color;
	core.clearMap('curtain');
	core.status.curtainColor = color;
	if (color) core.fillRect('curtain', 0, 0, core.__PIXELS__, core.__PIXELS__, core.arrayToRGBA(color));
	// 更改天气
	var weather = core.getFlag('__weather__', null);
	if (!weather && core.status.maps[floorId].weather)
		weather = core.status.maps[floorId].weather;
	if (weather)
		core.setWeather(weather[0], weather[1]);
	else core.setWeather();

	// ...可以新增一些其他内容，比如创建个画布在右上角显示什么内容等等

},
        "afterChangeFloor": function (floorId, fromLoad) {
	// 转换楼层结束的事件；此函数会在整个楼层切换完全结束后再执行
	// floorId是切换到的楼层；fromLoad若为true则代表是从读档行为造成的楼层切换

	// 如果是读档，则进行检查（是否需要恢复事件）
	if (fromLoad) {
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
	if (!core.status.maps[fromId].canFlyTo || !core.status.maps[toId].canFlyTo || !core.hasVisitedFloor(toId)) {
		core.drawTip("无法飞往" + core.status.maps[toId].title + "！");
		return false;
	}

	// 平面塔模式
	var stair = null,
		loc = null;
	if (core.flags.flyRecordPosition) {
		loc = core.getFlag("__leaveLoc__", {})[toId] || null;
	}
	if (loc == null) {
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
	core.changeFloor(toId, stair, loc, null, callback);

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
			var actions = [];
			// 增加支援的特效动画（图块跳跃）
			guards.forEach(function (g) {
				core.push(actions, { "type": "jump", "from": [g[0], g[1]], "to": [x, y], "time": 300, "keep": false, "async": true });
			});
			core.push(actions, [
				{ "type": "waitAsync" }, // 等待所有异步事件执行完毕
				{ "type": "trigger", "loc": [x, y] } // 重要！重新触发本点事件（即重新触发战斗）
			]);
			core.insertAction(actions);
			return false;
		}
	}

	return true;
},
        "afterBattle": function (enemyId, x, y, callback) {
	// 战斗结束后触发的事件

	var enemy = core.material.enemys[enemyId];

	// 播放战斗音效和动画
	var equipAnimate = 'hand',
		equipId = (core.status.hero.equipment || [])[0];
	if (equipId && (core.material.items[equipId].equip || {}).animate)
		equipAnimate = core.material.items[equipId].equip.animate;
	// 检查equipAnimate是否存在SE，如果不存在则使用默认音效
	if (!(core.material.animates[equipAnimate] || {}).se)
		core.playSound('attack.mp3');
	// 强制战斗的战斗动画
	if (x != null && y != null)
		core.drawAnimate(equipAnimate, x, y);
	else
		core.drawHeroAnimate(equipAnimate);

	var damage = core.enemys.getDamage(enemyId, x, y);
	if (damage == null) damage = core.status.hero.hp + 1;

	// 扣减体力值
	core.status.hero.hp -= damage;

	// 记录
	core.status.hero.statistics.battleDamage += damage;
	core.status.hero.statistics.battle++;

	if (core.status.hero.hp <= 0) {
		core.status.hero.hp = 0;
		core.updateStatusBar();
		core.events.lose('战斗失败');
		return;
	}

	// 删除该块
	var guards = []; // 支援
	if (x != null && y != null) {
		core.removeBlock(x, y);
		guards = core.getFlag("__guards__" + x + "_" + y, []);
		core.removeFlag("__guards__" + x + "_" + y);
	}

	// 获得金币和经验
	var money = guards.reduce(function (curr, g) {
		return curr + core.material.enemys[g[2]].money;
	}, enemy.money);
	if (core.hasItem('coin')) money *= 2;
	if (core.hasFlag('curse')) money = 0;
	core.status.hero.money += money;
	core.status.hero.statistics.money += money;

	var experience = guards.reduce(function (curr, g) {
		return curr + core.material.enemys[g[2]].experience;
	}, enemy.experience);
	if (core.hasFlag('curse')) experience = 0;
	core.status.hero.experience += experience;
	core.status.hero.statistics.experience += experience;

	var hint = "打败 " + enemy.name;
	if (core.flags.enableMoney) hint += "，金币+" + money;
	if (core.flags.enableExperience) hint += "，经验+" + experience;
	core.drawTip(hint, enemy.id);

	// 事件的处理
	var todo = [];

	var special = enemy.special;
	// 中毒
	if (core.enemys.hasSpecial(special, 12)) {
		core.push(todo, [{ "type": "insert", "name": "毒衰咒处理", "args": [0] }]);
	}
	// 衰弱
	if (core.enemys.hasSpecial(special, 13)) {
		core.push(todo, [{ "type": "insert", "name": "毒衰咒处理", "args": [1] }]);
	}
	// 诅咒
	if (core.enemys.hasSpecial(special, 14)) {
		core.push(todo, [{ "type": "insert", "name": "毒衰咒处理", "args": [2] }]);
	}
	// 仇恨属性：减半
	if (core.flags.hatredDecrease && core.enemys.hasSpecial(special, 17)) {
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
	if (core.flags.enableSkill) {
		// 检测当前开启的技能类型
		var skill = core.getFlag('skill', 0);
		if (skill == 1) { // 技能1：二倍斩
			core.status.hero.mana -= 5; // 扣除5点魔力值
		}
		// 关闭技能
		core.setFlag('skill', 0);
		core.setFlag('skillName', '无');
	}

	// 如果有加点
	var point = core.material.enemys[enemyId].point;
	if (core.flags.enableAddPoint && point > 0) {
		core.push(todo, [{ "type": "insert", "name": "加点事件", "args": [point] }]);
	}

	// 如果该点存在事件 -- V2.5.4 以后阻击怪也可以有战后事件了
	core.push(todo, core.floors[core.status.floorId].afterBattle[x + "," + y]);

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
	core.updateStatusBar();

	// 如果已有事件正在处理中
	if (core.status.event.id == null)
		core.continueAutomaticRoute();
	else
		core.clearContinueAutomaticRoute();

	if (callback) callback();

},
        "afterOpenDoor": function (doorId, x, y, callback) {
	// 开一个门后触发的事件

	var todo = [];
	var event = core.floors[core.status.floorId].afterOpenDoor[x + "," + y];
	if (event) core.unshift(todo, event);

	if (todo.length > 0) core.insertAction(todo, x, y);

	if (core.status.event.id == null)
		core.continueAutomaticRoute();
	else
		core.clearContinueAutomaticRoute();

	if (callback) callback();
},
        "afterGetItem": function (itemId, x, y, callback) {
	// 获得一个道具后触发的事件
	core.playSound('item.mp3');

	var todo = [];
	var event = core.floors[core.status.floorId].afterGetItem[x + "," + y];
	if (event) core.unshift(todo, event);

	if (todo.length > 0) core.insertAction(todo, x, y);

	if (callback) callback();
},
        "afterChangeLight": function(x,y) {
	// 改变亮灯之后，可以触发的事件

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
},
        "afterUseBomb": function () {
	// 使用炸弹/圣锤后的事件

	// 这是一个使用炸弹也能开门的例子
	/*
	if (core.status.floorId=='xxx' && core.terrainExists(x0,y0,'specialDoor') // 某个楼层，该机关门存在
		&& !core.enemyExists(x1,y1) && !core.enemyExists(x2,y2)) // 且守门的怪物都不存在
	{
		core.insertAction([ // 插入事件
			{"type": "openDoor", "loc": [x0,y0]} // 开门
		])
	}
	*/

},
        "afterPassNet": function (x, y, id) {
	// 经过特殊地形后的事件；x和y为当前坐标，id为当前的图块id

	// 这是个一次性血网的例子
	// if (id == 'lavaNet') core.removeBlock(x, y);

},
        "canUseQuickShop": function(shopId) {
	// 当前能否使用某个快捷商店
	// shopId：快捷商店ID
	// 如果返回一个字符串，表示不能，字符串为不能使用的提示
	// 返回null代表可以使用

	// 检查当前楼层的canUseQuickShop选项是否为false
	if (core.status.thisMap.canUseQuickShop === false)
		return '当前楼层不能使用快捷商店。';

	return null;
}
    },
    "enemys": {
        "getSpecials": function () {
	// 获得怪物的特殊属性，每一行定义一个特殊属性。
	// 分为三项，第一项为该特殊属性的数字，第二项为特殊属性的名字，第三项为特殊属性的描述
	// 可以直接写字符串，也可以写个function将怪物传进去
	return [
		[1, "先攻", "怪物首先攻击"],
		[2, "魔攻", "怪物无视勇士的防御"],
		[3, "坚固", "勇士每回合最多只能对怪物造成1点伤害"],
		[4, "2连击", "怪物每回合攻击2次"],
		[5, "3连击", "怪物每回合攻击3次"],
		[6, function (enemy) { return (enemy.n || 4) + "连击"; }, function (enemy) { return "怪物每回合攻击" + (enemy.n || 4) + "次"; }],
		[7, "破甲", "战斗前，怪物附加角色防御的" + Math.floor(100 * core.values.breakArmor || 0) + "%作为伤害"],
		[8, "反击", "战斗时，怪物每回合附加角色攻击的" + Math.floor(100 * core.values.counterAttack || 0) + "%作为伤害，无视角色防御"],
		[9, "净化", "战斗前，怪物附加勇士魔防的" + core.values.purify + "倍作为伤害"],
		[10, "模仿", "怪物的攻防和勇士攻防相等"],
		[11, "吸血", function (enemy) { return "战斗前，怪物首先吸取角色的" + Math.floor(100 * enemy.value || 0) + "%生命（约" + Math.floor((enemy.value || 0) * core.getStatus('hp')) + "点）作为伤害" + (enemy.add ? "，并把伤害数值加到自身生命上" : ""); }],
		[12, "中毒", "战斗后，勇士陷入中毒状态，每一步损失生命" + core.values.poisonDamage + "点"],
		[13, "衰弱", "战斗后，勇士陷入衰弱状态，攻防暂时下降" + (core.values.weakValue >= 1 ? core.values.weakValue + "点" : parseInt(core.values.weakValue * 100) + "%")],
		[14, "诅咒", "战斗后，勇士陷入诅咒状态，战斗无法获得金币和经验"],
		[15, "领域", function (enemy) { return "经过怪物周围" + (enemy.zoneSquare ? "九宫格" : "十字") + "范围内" + (enemy.range || 1) + "格时自动减生命" + (enemy.value || 0) + "点"; }],
		[16, "夹击", "经过两只相同的怪物中间，勇士生命值变成一半"],
		[17, "仇恨", "战斗前，怪物附加之前积累的仇恨值作为伤害" + (core.flags.hatredDecrease ? "；战斗后，释放一半的仇恨值" : "") + "。（每杀死一个怪物获得" + (core.values.hatred || 0) + "点仇恨值）"],
		[18, "阻击", function (enemy) { return "经过怪物的十字领域时自动减生命" + (enemy.value || 0) + "点，同时怪物后退一格"; }],
		[19, "自爆", "战斗后勇士的生命值变成1"],
		[20, "无敌", "勇士无法打败怪物，除非拥有十字架"],
		[21, "退化", function (enemy) { return "战斗后勇士永久下降" + (enemy.atkValue || 0) + "点攻击和" + (enemy.defValue || 0) + "点防御"; }],
		[22, "固伤", function (enemy) { return "战斗前，怪物对勇士造成" + (enemy.damage || 0) + "点固定伤害，无视勇士魔防。"; }],
		[23, "重生", "怪物被击败后，角色转换楼层则怪物将再次出现"],
		[24, "激光", function (enemy) { return "经过怪物同行或同列时自动减生命" + (enemy.value || 0) + "点"; }],
		[25, "光环", function (enemy) { return "同楼层所有怪物生命提升" + (enemy.value || 0) + "%，攻击提升" + (enemy.atkValue || 0) + "%，防御提升" + (enemy.defValue || 0) + "%，" + (enemy.add ? "可叠加" : "不可叠加"); }],
		[26, "支援", "当周围一圈的怪物受到攻击时将上前支援，并组成小队战斗。"],
		[27, "捕捉", "当走到怪物周围十字时会强制进行战斗。"]
	];
},
        "getEnemyInfo": function (enemy, hero, x, y, floorId) {
	// 获得某个怪物变化后的数据；该函数将被伤害计算和怪物手册使用
	// 例如：坚固、模仿、仿攻等等
	// 
	// 参数说明：
	// enemy：该怪物信息
	// hero_hp,hero_atk,hero_def,hero_mdef：勇士的生命攻防魔防数据
	// x,y：该怪物的坐标（查看手册和强制战斗时为undefined）
	// floorId：该怪物所在的楼层
	// 后面三个参数主要是可以在光环等效果上可以适用（也可以按需制作部分范围光环效果）
	floorId = floorId || core.status.floorId;
	var hero_hp = core.getRealStatusOrDefault(hero, 'hp'),
		hero_atk = core.getRealStatusOrDefault(hero, 'atk'),
		hero_def = core.getRealStatusOrDefault(hero, 'def'),
		hero_mdef = core.getRealStatusOrDefault(hero, 'mdef');

	var mon_hp = enemy.hp,
		mon_atk = enemy.atk,
		mon_def = enemy.def,
		mon_special = enemy.special;
	var mon_money = enemy.money,
		mon_experience = enemy.experience,
		mon_point = enemy.point;
	// 模仿
	if (core.hasSpecial(mon_special, 10)) {
		mon_atk = hero_atk;
		mon_def = hero_def;
	}
	// 坚固
	if (core.hasSpecial(mon_special, 3) && mon_def < hero_atk - 1) {
		mon_def = hero_atk - 1;
	}

	// ------ 支援 ------
	var guards = [];

	// 光环检查
	// 在这里判定是否需要遍历全图（由于光环需要遍历全图，应尽可能不需要以减少计算量，尤其是大地图）
	var query = function () {
		var floorIds = ["MTx"]; // 在这里给出所有需要遍历的楼层（即有光环或支援等）
		return core.inArray(floorIds, floorId); // 也可以写其他的判定条件
	}

	if (query()) {
		// 从V2.5.4开始，对光环效果增加缓存，以解决多次重复计算的问题，从而大幅提升运行效率。
		// 检查当前楼层所有光环怪物（数字25）
		var hp_buff = 0,
			atk_buff = 0,
			def_buff = 0,
			cnt = 0;
		// 检查光环缓存
		var index = x != null && y != null ? (x + "," + y) : "floor";
		if (!core.status.checkBlock) core.status.checkBlock = {};
		if (!core.status.checkBlock.cache) core.status.checkBlock.cache = {};
		var cache = core.status.checkBlock.cache[index];
		if (!cache) {
			// 没有该点的缓存，则遍历每个图块
			core.status.maps[floorId].blocks.forEach(function (block) {
				if (!block.disable) {
					// 获得该图块的ID
					var id = block.event.id,
						enemy = core.material.enemys[id];
					// 检查是不是怪物，且是否拥有该特殊属性
					if (enemy && core.hasSpecial(enemy.special, 25)) {
						// 检查是否可叠加
						if (enemy.add || cnt == 0) {
							hp_buff += enemy.value || 0;
							atk_buff += enemy.atkValue || 0;
							def_buff += enemy.defValue || 0;
							cnt++;
						}
					}
					// 检查【支援】技能
					if (enemy && core.hasSpecial(enemy.special, 26) &&
						// 检查支援条件，坐标存在，距离为1，且不能是自己
						// 其他类型的支援怪，比如十字之类的话.... 看着做是一样的
						x != null && y != null && Math.abs(block.x - x) <= 1 && Math.abs(block.y - y) <= 1 && !(x == block.x && y == block.y)) {
						// 记录怪物的x,y，ID
						guards.push([block.x, block.y, id]);
					}

					// TODO：如果有其他类型光环怪物在这里仿照添加检查
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
	// 也可以按需增加各种自定义内容（比如幻塔的魔杖效果等）

	return {
		"hp": Math.floor(mon_hp),
		"atk": Math.floor(mon_atk),
		"def": Math.floor(mon_def),
		"money": Math.floor(mon_money),
		"experience": Math.floor(mon_experience),
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

	// 战前造成的额外伤害（可被魔防抵消）
	var init_damage = 0;

	// 吸血
	if (core.hasSpecial(mon_special, 11)) {
		var vampire_damage = hero_hp * enemy.value;

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
	if (core.hasSpecial(mon_special, 8)) counterDamage += Math.floor(core.values.counterAttack * hero_atk);

	// 先攻
	if (core.hasSpecial(mon_special, 1)) init_damage += per_damage;

	// 破甲
	if (core.hasSpecial(mon_special, 7))
		init_damage += Math.floor(core.values.breakArmor * hero_def);

	// 净化
	if (core.hasSpecial(mon_special, 9))
		init_damage += Math.floor(core.values.purify * hero_mdef);

	// 勇士每回合对怪物造成的伤害
	var hero_per_damage = Math.max(hero_atk - mon_def, 0);

	// 如果没有破防，则不可战斗
	if (hero_per_damage <= 0) return null;

	// 勇士的攻击回合数；为怪物生命除以每回合伤害向上取整
	var turn = Math.ceil(mon_hp / hero_per_damage);

	// ------ 支援 ----- //
	// 这个递归最好想明白为什么，flag:extra_turn是怎么用的
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
	// 再扣去魔防
	damage -= hero_mdef;

	// 检查是否允许负伤
	if (!core.flags.enableNegativeDamage)
		damage = Math.max(0, damage);

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
	if (core.isMoving())
		return;

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
	case 83: // S：存档
		core.save(true);
		break;
	case 68: // D：读档
		core.load(true);
		break;
	case 69: // E：打开光标
		core.ui.drawCursor();
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
	case 75:
	case 86: // V：打开快捷商店列表
		core.openQuickShop(true);
		break;
	case 32: // SPACE：轻按
		core.getNextItem();
		break;
	case 82: // R：回放录像
		core.actions._clickSyncSave_replay();
		break;
	case 33:
	case 34: // PgUp/PgDn：浏览地图
		core.ui.drawMaps();
		break;
	case 77: // M：绘图模式
		core.ui.drawPaint();
		break;
	case 66: // B：打开数据统计
		core.ui.drawStatistics();
		break;
	case 72: // H：打开帮助页面
		core.ui.drawHelp();
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
			if (core.canUseItem('pickaxe')) {
				core.status.route.push("key:49"); // 将按键记在录像中
				core.useItem('pickaxe', true); // 第二个参数true代表该次使用道具是被按键触发的，使用过程不计入录像
			} else {
				core.drawTip('当前不能使用破墙镐');
			}
		}
		break;
	case 50: // 快捷键2: 炸
		if (core.hasItem('bomb')) {
			if (core.canUseItem('bomb')) {
				core.status.route.push("key:50"); // 将按键记在录像中
				core.useItem('bomb', true); // 第二个参数true代表该次使用道具是被按键触发的，使用过程不计入录像
			} else {
				core.drawTip('当前不能使用炸弹');
			}
		} else if (core.hasItem('hammer')) {
			if (core.canUseItem('hammer')) {
				core.status.route.push("key:50"); // 将按键记在录像中
				core.useItem('hammer', true); // 第二个参数true代表该次使用道具是被按键触发的，使用过程不计入录像
			} else {
				core.drawTip('当前不能使用圣锤');
			}

		}
		break;
	case 51: // 快捷键3: 飞
		if (core.hasItem('centerFly')) {
			core.ui.drawCenterFly();
		}
		break;
	case 52: // 快捷键4：破冰/冰冻/地震/上下楼器/... 其他道具依次判断
		{
			var list = ["icePickaxe", "snow", "earthquake", "upFly", "downFly", "jumpShoes", "lifeWand", "poisonWine", "weakWine", "curseWine", "superWine"];
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
	case 55: // 快捷键7：绑定为轻按，方便手机版操作
		core.getNextItem();
		break;
	case 118: // F7：开启debug模式
		core.debug();
		break;
	case 87: // W：开启技能“二倍斩”
		// 检测是否拥有“二倍斩”这个技能道具
		if (core.hasItem('skill1')) {
			core.status.route.push("key:87");
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
        "onStatusBarClick": function (px, py) {
	// 点击状态栏时触发的事件，仅在自绘状态栏开启时生效
	// px和py为点击的像素坐标
	// 
	// 横屏模式下状态栏的画布大小是 129*416
	// 竖屏模式下状态栏的画布大小是 416*(32*rows+9) 其中rows为状态栏行数，即全塔属性中statusCanvasRowsOnMobile值
	// 可以使用 core.domStyle.isVertical 来判定当前是否是竖屏模式

	// 如果正在执行事件，则忽略
	if (core.status.lockControl) return;
	// 如果当前正在行走，则忽略；也可以使用 core.waitHeroToStop(callback) 来停止行走再回调执行脚本
	if (core.isMoving()) return;

	// 判定px和py来执行自己的脚本内容.... 注意横竖屏
	// 这里是直接打出点击坐标的例子。
	// console.log("onStatusBarClick:", px, py);
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
		'maps': core.maps.saveMap(),
		'route': core.encodeRoute(core.status.route),
		'values': values,
		'shops': {},
		'version': core.firstData.version,
		"time": new Date().getTime()
	};
	if (core.flags.checkConsole) {
		data.hashCode = core.utils.hashCode(data.hero);
	}
	// 设置商店次数
	for (var shopId in core.status.shops) {
		data.shops[shopId] = {
			'times': core.status.shops[shopId].times || 0,
			'visited': core.status.shops[shopId].visited || false
		};
	}

	return data;
},
        "loadData": function (data, callback) {
	// 读档操作；从存储中读取了内容后的行为

	// 重置游戏和路线
	core.resetGame(data.hero, data.hard, data.floorId, core.maps.loadMap(data.maps), data.values);
	core.status.route = core.decodeRoute(data.route);
	// 加载商店信息
	for (var shopId in core.status.shops) {
		if (data.shops[shopId]) {
			core.status.shops[shopId].times = data.shops[shopId].times;
			core.status.shops[shopId].visited = data.shops[shopId].visited;
		}
	}
	// 文字属性，全局属性
	core.status.textAttribute = core.getFlag('textAttribute', core.status.textAttribute);
	var toAttribute = core.getFlag('globalAttribute', core.status.globalAttribute);
	if (!core.same(toAttribute, core.status.globalAttribute)) {
		core.status.globalAttribute = toAttribute;
		core.updateGlobalAttribute();
	}
	// 重置音量
	core.events.setVolume(core.getFlag("__volume__", 1), 0);
	// 加载勇士图标
	var icon = core.getFlag("heroIcon", "hero.png");
	icon = core.getMappedName(icon);
	if (core.material.images.images[icon]) {
		core.material.images.hero = core.material.images.images[icon];
		core.material.icons.hero.width = core.material.images.images[icon].width / 4;
		core.material.icons.hero.height = core.material.images.images[icon].height / 4;
	}

	// TODO：增加自己的一些读档处理

	// 切换到对应的楼层
	core.changeFloor(data.floorId, null, data.hero.loc, 0, function () {
		// TODO：可以在这里设置读档后播放BGM
		if (core.hasFlag("__bgm__")) { // 持续播放
			core.playBgm(core.getFlag("__bgm__"));
		}

		if (callback) callback();
	}, true);
},
        "updateStatusBar": function () {
	// 更新状态栏

	// 检查等级
	core.events.checkLvUp();

	// 检查HP上限
	if (core.flags.enableHPMax) {
		core.setStatus('hp', Math.min(core.getStatus('hpmax'), core.getStatus('hp')));
	}

	// 设置楼层名
	if (core.status.floorId) {
		core.setStatusBarInnerHTML('floor', core.status.maps[core.status.floorId].name);
	}

	// 设置勇士名字和图标
	core.setStatusBarInnerHTML('name', core.getStatus('name'));
	// 设置等级名称
	core.setStatusBarInnerHTML('lv', core.getLvName());

	// 设置生命上限、生命值、攻防魔防金币和经验值
	var statusList = ['hpmax', 'hp', 'mana', 'atk', 'def', 'mdef', 'money', 'experience'];
	statusList.forEach(function (item) {
		// 向下取整
		core.status.hero[item] = Math.floor(core.status.hero[item]);
		// 大数据格式化
		core.setStatusBarInnerHTML(item, core.getRealStatus(item));
	});

	// 设置魔力值
	if (core.flags.enableMana) {
		// status:manamax 只有在非负时才生效。
		if (core.status.hero.manamax != null && core.getRealStatus('manamax') >= 0) {
			core.status.hero.mana = Math.min(core.status.hero.mana, core.getRealStatus('manamax'));
			core.setStatusBarInnerHTML('mana', core.status.hero.mana + "/" + core.getRealStatus('manamax'));
		}
		else {
			core.setStatusBarInnerHTML("mana", core.status.hero.mana);
		}
	}
	// 设置技能栏
	if (core.flags.enableSkill) {
		// 可以用flag:skill表示当前开启的技能类型，flag:skillName显示技能名；详见文档-个性化-技能塔的支持
		core.setStatusBarInnerHTML('skill', core.getFlag('skillName', '无'));
	}

	// 可以在这里添加自己额外的状态栏信息，比如想攻击显示 +0.5 可以这么写：
	// if (core.hasFlag('halfAtk')) core.setStatusBarInnerHTML('atk', core.statusBar.atk.innerText + "+0.5");

	// 如果是自定义添加的状态栏，也需要在这里进行设置显示的数值

	// 进阶
	if (core.flags.enableLevelUp && core.status.hero.lv < core.firstData.levelUp.length) {
		var need = core.calValue(core.firstData.levelUp[core.status.hero.lv].need);
		if (core.flags.levelUpLeftMode)
			core.setStatusBarInnerHTML('up', core.formatBigNumber(need - core.getStatus('experience')) || "");
		else
			core.setStatusBarInnerHTML('up', core.formatBigNumber(need) || "");
	} else core.setStatusBarInnerHTML('up', "");

	// 钥匙
	var keys = ['yellowKey', 'blueKey', 'redKey'];
	keys.forEach(function (key) {
		core.setStatusBarInnerHTML(key, core.setTwoDigits(core.itemCount(key)));
	});
	// 毒衰咒
	if (core.flags.enableDebuff) {
		core.setStatusBarInnerHTML('poison', core.hasFlag('poison') ? "毒" : "");
		core.setStatusBarInnerHTML('weak', core.hasFlag('weak') ? "衰" : "");
		core.setStatusBarInnerHTML('curse', core.hasFlag('curse') ? "咒" : "");
	}
	// 破炸飞
	if (core.flags.enablePZF) {
		core.setStatusBarInnerHTML('pickaxe', "破" + core.itemCount('pickaxe'));
		core.setStatusBarInnerHTML('bomb', "炸" + core.itemCount('bomb'));
		core.setStatusBarInnerHTML('fly', "飞" + core.itemCount('centerFly'));
	}

	// 难度
	core.statusBar.hard.innerText = core.status.hard;
	// 自定义状态栏绘制
	core.drawStatusBar();

	// 更新阻激夹域的伤害值
	core.updateCheckBlock();
	// 更新全地图显伤
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
		snipe = {}, // 每个点的阻击怪信息
		ambush = {}; // 每个点的捕捉信息

	// 计算血网和领域、阻击、激光的伤害，计算捕捉信息
	for (var loc in blocks) {
		var block = blocks[loc],
			x = block.x,
			y = block.y,
			id = block.event.id,
			enemy = core.material.enemys[id];

		// 血网
		if (id == 'lavaNet' && block.event.trigger == 'passNet' && !core.hasItem('shoes')) {
			damage[loc] = (damage[loc] || 0) + core.values.lavaDamage;
			type[loc] = "血网伤害";
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
					damage[currloc] = (damage[currloc] || 0) + (enemy.value || 0);
					type[currloc] = "领域伤害";
				}
			}
		}

		// 阻击
		// 如果要防止阻击伤害，可以直接简单的将 flag:no_snipe 设为true
		if (enemy && core.hasSpecial(enemy.special, 18) && !core.hasFlag('no_snipe')) {
			for (var dir in core.utils.scan) {
				var nx = x + core.utils.scan[dir].x,
					ny = y + core.utils.scan[dir].y,
					currloc = nx + "," + ny;
				if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
				damage[currloc] = (damage[currloc] || 0) + (enemy.value || 0);
				type[currloc] = "阻击伤害";

				var rdir = core.reverseDirection(dir);
				// 检查下一个点是否存在事件（从而判定是否移动）
				var rnx = x + core.utils.scan[rdir].x,
					rny = y + core.utils.scan[rdir].y;
				if (rnx >= 0 && rnx < width && rny >= 0 && rny < height && core.getBlock(rnx, rny, floorId) == null) {
					snipe[currloc] = (snipe[currloc] || []).concat([
						[x, y, id, rdir]
					]);
				}
			}
		}

		// 激光
		// 如果要防止激光伤害，可以直接简单的将 flag:no_laser 设为true
		if (enemy && core.hasSpecial(enemy.special, 24) && !core.hasFlag("no_laser")) {
			for (var nx = 0; nx < width; nx++) {
				var currloc = nx + "," + y;
				if (nx != x) {
					damage[currloc] = (damage[currloc] || 0) + (enemy.value || 0);
					type[currloc] = "激光伤害";
				}
			}
			for (var ny = 0; ny < height; ny++) {
				var currloc = x + "," + ny;
				if (ny != y) {
					damage[currloc] = (damage[currloc] || 0) + (enemy.value || 0);
					type[currloc] = "激光伤害";
				}
			}
		}

		// 捕捉
		// 如果要防止捕捉效果，可以直接简单的将 flag:no_ambush 设为true
		if (enemy && core.enemys.hasSpecial(enemy.special, 27)) {
			// 给周围格子加上【捕捉】记号
			for (var dir in core.utils.scan) {
				var nx = x + core.utils.scan[dir].x,
					ny = y + core.utils.scan[dir].y,
					currloc = nx + "," + ny;
				if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
				ambush[currloc] = (ambush[currloc] || []).concat([
					[x, y, id, dir]
				]);
			}
		}
	}

	// 更新夹击伤害
	// 如果要防止夹击伤害，可以简单的将 flag:no_betweenAttack 设为true
	if (!core.hasFlag('no_betweenAttack')) {
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				var loc = x + "," + y;
				// 夹击怪物的ID
				var enemyId = null;
				// 检查左右夹击
				var leftBlock = blocks[(x - 1) + "," + y],
					rightBlock = blocks[(x + 1) + "," + y];
				if (leftBlock && rightBlock && leftBlock.id == rightBlock.id) {
					if (core.hasSpecial(leftBlock.event.id, 16))
						enemyId = leftBlock.event.id;
				}
				// 检查上下夹击
				var topBlock = blocks[x + "," + (y - 1)],
					bottomBlock = blocks[x + "," + (y + 1)];
				if (topBlock && bottomBlock && topBlock.id == bottomBlock.id) {
					if (core.hasSpecial(topBlock.event.id, 16))
						enemyId = topBlock.event.id;
				}

				if (enemyId != null) {
					var leftHp = core.status.hero.hp - (damage[loc] || 0);
					if (leftHp > 1) {
						// 上整/下整
						var value = Math.floor((leftHp + (core.flags.betweenAttackCeil ? 1 : 0)) / 2);
						// 是否不超过怪物伤害值
						if (core.flags.betweenAttackMax) {
							var enemyDamage = core.getDamage(enemyId, x, y, floorId);
							if (enemyDamage != null && enemyDamage < value)
								value = enemyDamage;
						}
						if (value > 0) {
							damage[loc] = (damage[loc] || 0) + value;
							type[loc] = "夹击伤害";
						}
					}
				}
			}
		}
	}

	core.status.checkBlock = {
		damage: damage,
		type: type,
		snipe: snipe,
		ambush: ambush,
		cache: {} // clear cache
	};
},
        "moveOneStep": function (x, y) {
	// 勇士每走一步后执行的操作，x,y为要移动到的坐标。
	// 这个函数执行在“刚走完”的时候，即还没有检查该点的事件和领域伤害等。
	// 请注意：瞬间移动不会执行该函数。如果要控制能否瞬间移动有三种方法：
	// 1. 将全塔属性中的cannotMoveDirectly这个开关勾上，即可在全塔中全程禁止使用瞬移。
	// 2, 将楼层属性中的cannotMoveDirectly这个开关勾上，即禁止在该层楼使用瞬移。
	// 3. 将flag:cannotMoveDirectly置为true，即可使用flag控制在某段剧情范围内禁止瞬移。

	// 设置当前坐标，增加步数
	core.setHeroLoc('x', x, true);
	core.setHeroLoc('y', y, true);
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
			core.updateStatusBar();
			core.events.lose();
			return;
		}
	}
	// 如需强行终止行走可以在这里条件判定：
	// core.stopAutomaticRoute();
},
        "moveDirectly": function (x, y, ignoreSteps) {
	// 瞬间移动；x,y为要瞬间移动的点；ignoreSteps为减少的步数，可能之前已经被计算过
	// 返回true代表成功瞬移，false代表没有成功瞬移

	// 判定能否瞬移到该点
	if (ignoreSteps == null) ignoreSteps = core.canMoveDirectly(x, y);
	if (ignoreSteps >= 0) {
		core.clearMap('hero');
		// 获得勇士最后的朝向
		var lastDirection = core.status.route[core.status.route.length - 1];
		if (['left', 'right', 'up', 'down'].indexOf(lastDirection) >= 0)
			core.setHeroLoc('direction', lastDirection);
		// 设置坐标，并绘制
		core.setHeroLoc('x', x);
		core.setHeroLoc('y', y);
		core.drawHero();
		// 记录录像
		core.status.route.push("move:" + x + ":" + y);
		// 统计信息
		core.status.hero.statistics.moveDirectly++;
		core.status.hero.statistics.ignoreSteps += ignoreSteps;
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
			main.log(e);
		}
	}
}
    },
    "ui": {
        "drawStatusBar": function () {
	// 自定义绘制状态栏，需要开启状态栏canvas化

	// 如果是非状态栏canvas化，直接返回
	if (!core.flags.statusCanvas) return;
	var canvas = core.dom.statusCanvas,
		ctx = core.dom.statusCanvasCtx;
	// 清空状态栏
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 如果是隐藏状态栏模式，直接返回
	if (!core.domStyle.showStatusBar) return;

	// 作为样板，只绘制楼层、生命、攻击、防御、魔防、金币、钥匙这七个内容
	// 需要其他的请自行进行修改；横竖屏都需要进行适配绘制。
	// （可以使用Chrome浏览器开控制台来模拟手机上的竖屏模式的显示效果，具体方式自行百度）
	// 横屏模式下的画布大小是 129*416
	// 竖屏模式下的画布大小是 416*(32*rows+9) 其中rows为状态栏行数，即全塔属性中statusCanvasRowsOnMobile值
	// 可以使用 core.domStyle.isVertical 来判定当前是否是竖屏模式

	ctx.fillStyle = core.status.globalAttribute.statusBarColor || core.initStatus.globalAttribute.statusBarColor;
	ctx.font = 'italic bold 18px Verdana';

	// 距离左侧边框6像素，上侧边框9像素，行距约为39像素
	var leftOffset = 6,
		topOffset = 9,
		lineHeight = 39;
	if (core.domStyle.isVertical) { // 竖屏模式，行高32像素
		leftOffset = 6;
		topOffset = 6;
		lineHeight = 32;
	}

	var toDraw = ["floor", "hp", "atk", "def", "mdef", "money"];
	for (var index = 0; index < toDraw.length; index++) {
		// 绘制下一个数据
		var name = toDraw[index];
		// 图片大小25x25
		ctx.drawImage(core.statusBar.icons[name], leftOffset, topOffset, 25, 25);
		// 文字内容
		var text = (core.statusBar[name] || {}).innerText || " ";
		// 斜体判定：如果不是纯数字和字母，斜体会非常难看，需要取消
		if (!/^[-a-zA-Z0-9`~!@#$%^&*()_=+\[{\]}\\|;:'",<.>\/?]*$/.test(text))
			ctx.font = 'bold 18px Verdana';
		// 绘制文字
		ctx.fillText(text, leftOffset + 36, topOffset + 20);
		ctx.font = 'italic bold 18px Verdana';
		// 计算下一个绘制的坐标
		if (core.domStyle.isVertical) {
			// 竖屏模式
			if (index % 3 != 2) leftOffset += 131;
			else {
				leftOffset = 6;
				topOffset += lineHeight;
			}
		} else {
			// 横屏模式
			topOffset += lineHeight;
		}
	}
	// 绘制三色钥匙
	ctx.fillStyle = '#FFCCAA';
	ctx.fillText(core.statusBar.yellowKey.innerText, leftOffset + 5, topOffset + 20);
	ctx.fillStyle = '#AAAADD';
	ctx.fillText(core.statusBar.blueKey.innerText, leftOffset + 40, topOffset + 20);
	ctx.fillStyle = '#FF8888';
	ctx.fillText(core.statusBar.redKey.innerText, leftOffset + 75, topOffset + 20);
},
        "drawStatistics": function () {
	// 浏览地图时参与的统计项目
	
	return [
		'yellowDoor', 'blueDoor', 'redDoor', 'greenDoor', 'steelDoor',
		'yellowKey', 'blueKey', 'redKey', 'greenKey', 'steelKey',
		'redJewel', 'blueJewel', 'greenJewel', 'yellowJewel',
		'redPotion', 'bluePotion', 'greenPotion', 'yellowPotion', 'superPotion',
		'pickaxe', 'bomb', 'centerFly', 'icePickaxe', 'snow',
		'earthquake', 'upFly', 'downFly', 'jumpShoes', 'lifeWand',
		'poisonWine', 'weakWine', 'curseWine', 'superWine',
		'sword1', 'sword2', 'sword3', 'sword4', 'sword5',
		'shield1', 'shield2', 'shield3', 'shield4', 'shield5',
		// 在这里可以增加新的ID来进行统计个数，只能增加道具ID
	];
},
        "drawAbout": function() {
	// 绘制“关于”界面
	core.ui.closePanel();
	core.lockControl();
	core.status.event.id = 'about';

	var left = 48, top = 36, right = core.__PIXELS__ - 2 * left, bottom = core.__PIXELS__ - 2 * top;

	core.setAlpha('ui', 0.85);
	core.fillRect('ui', left, top, right, bottom, '#000000');
	core.setAlpha('ui', 1);
	core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

	var text_start = left + 24;

	// 名称
	core.setTextAlign('ui', 'left');
	var globalFont = (core.status.globalAttribute||core.initStatus.globalAttribute).font;
	core.fillText('ui', "HTML5 魔塔样板", text_start, top+35, "#FFD700", "bold 22px "+globalFont);
	core.fillText('ui', "版本： "+main.__VERSION__, text_start, top + 80, "#FFFFFF", "bold 17px "+globalFont);
	core.fillText('ui', "作者： 艾之葵", text_start, top + 112);
	core.fillText('ui', 'HTML5魔塔交流群：539113091', text_start, top+112+32);
	// TODO: 写自己的“关于”页面，每次增加32像素即可
}
    }
}