functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a = 
{
    "events": {
        "initGame": function() {
	// 游戏开始前的一些初始化操作

	// 根据flag来对道具进行修改
	if (core.flags.bigKeyIsBox)
		core.material.items.bigKey = {'cls': 'items', 'name': '钥匙盒'};
	// 面前的墙？四周的墙？
	if (core.flags.pickaxeFourDirections)
		core.material.items.pickaxe.text = "可以破坏勇士四周的墙";
	if (core.flags.bombFourDirections)
		core.material.items.bomb.text = "可以炸掉勇士四周的怪物";
	if (core.flags.snowFourDirections)
		core.material.items.bomb.text = "可以将四周的熔岩变成平地";
	// 是否启用装备栏
	if (core.flags.equipboxButton) {
		core.statusBar.image.fly.src = core.statusBar.icons.equipbox.src;
		core.flags.equipment = true;
	}
	if (core.flags.equipment) {
		core.material.items.sword1.cls = 'equips';
		core.material.items.sword2.cls = 'equips';
		core.material.items.sword3.cls = 'equips';
		core.material.items.sword4.cls = 'equips';
		core.material.items.sword5.cls = 'equips';
		core.material.items.shield1.cls = 'equips';
		core.material.items.shield2.cls = 'equips';
		core.material.items.shield3.cls = 'equips';
		core.material.items.shield4.cls = 'equips';
		core.material.items.shield5.cls = 'equips';
	}
},
        "setInitData": function (hard) {
	// 不同难度分别设置初始属性
	if (hard=='Easy') { // 简单难度
		core.setFlag('hard', 1); // 可以用flag:hard来获得当前难度
		// 可以在此设置一些初始福利，比如设置初始生命值可以调用：
		// core.setStatus("hp", 10000);
		// 赠送一把黄钥匙可以调用
		// core.setItem("yellowKey", 1);
	}
	if (hard=='Normal') { // 普通难度
		core.setFlag('hard', 2); // 可以用flag:hard来获得当前难度
	}
	if (hard=='Hard') { // 困难难度
		core.setFlag('hard', 3); // 可以用flag:hard来获得当前难度
	}
	if (hard=='Hell') { // 噩梦难度
		core.setFlag('hard', 4); // 可以用flag:hard来获得当前难度
	}
	core.events.afterLoadData();
},
        "win": function(reason, norank) {
	// 游戏获胜事件 
	core.ui.closePanel();
	var replaying = core.status.replay.replaying;
	core.stopReplay();
	core.waitHeroToStop(function() {
		core.removeGlobalAnimate(0,0,true);
		core.clearMap('all'); // 清空全地图
		// 请注意：
		// 成绩统计时是按照hp进行上传并排名，因此光在这里改${status:hp}是无效的
		// 如需按照其他的的分数统计方式，请先将hp设置为你的得分
		// core.setStatus('hp', ...);
		core.drawText([
			"\t[" + (reason||"恭喜通关") + "]你的分数是${status:hp}。"
		], function () {
			core.events.gameOver(reason||'', replaying, norank);
		})
	});
},
        "lose": function(reason) {
	// 游戏失败事件
	core.ui.closePanel();
	var replaying = core.status.replay.replaying;
	core.stopReplay();
	core.waitHeroToStop(function() {
		core.drawText([
			"\t["+(reason||"结局1")+"]你死了。\n如题。"
		], function () {
			core.events.gameOver(null, replaying);
		});
	})
},
        "afterChangeFloor": function (floorId, fromLoad) {
	// 转换楼层结束的事件
	// floorId是切换到的楼层；fromLoad若为true则代表是从读档行为造成的楼层切换
	if (!core.hasFlag("visited_"+floorId)) {
		core.insertAction(core.floors[floorId].firstArrive);
		core.setFlag("visited_"+floorId, true);
	}
},
        "addPoint": function (enemy) {
	// 加点事件
	var point = enemy.point;
	if (!core.flags.enableAddPoint || !core.isset(point) || point<=0) return [];

	// 加点，返回一个choices事件
	return [
		{"type": "choices",
			"choices": [
				{"text": "攻击+"+(1*point), "action": [
					{"type": "setValue", "name": "status:atk", "value": "status:atk+"+(1*point)}
				]},
				{"text": "防御+"+(2*point), "action": [
					{"type": "setValue", "name": "status:def", "value": "status:def+"+(2*point)}
				]},
				{"text": "生命+"+(200*point), "action": [
					{"type": "setValue", "name": "status:hp", "value": "status:hp+"+(200*point)}
				]},
			]
		}
	];
},
        "afterBattle": function(enemyId,x,y,callback) {
	// 战斗结束后触发的事件

	var enemy = core.material.enemys[enemyId];

	// 播放战斗音效和动画
	var equipAnimate = 'hand', equipId = (core.status.hero.equipment||[])[0];
	if (core.isset(equipId) && core.isset((core.material.items[equipId].equip||{}).animate))
		equipAnimate = core.material.items[equipId].equip.animate;
	// 检查equipAnimate是否存在SE，如果不存在则使用默认音效
	if (!core.isset((core.material.animates[equipAnimate]||{}).se))
		core.playSound('attack.mp3');
	core.drawAnimate(equipAnimate, x, y);

	var damage = core.enemys.getDamage(enemyId, x, y);
	if (damage == null) damage = core.status.hero.hp+1;

	// 扣减体力值
	core.status.hero.hp -= damage;

	// 记录
	core.status.hero.statistics.battleDamage += damage;
	core.status.hero.statistics.battle++;

	if (core.status.hero.hp<=0) {
		core.status.hero.hp=0;
		core.updateStatusBar();
		core.events.lose('战斗失败');
		return;
	}
	// 获得金币和经验
	var money = enemy.money;
	if (core.hasItem('coin')) money *= 2;
	if (core.hasFlag('curse')) money=0;
	core.status.hero.money += money;
	var experience =enemy.experience;
	if (core.hasFlag('curse')) experience=0;
	core.status.hero.experience += experience;
	var hint = "打败 " + enemy.name;
	if (core.flags.enableMoney)
		hint += "，金币+" + money;
	if (core.flags.enableExperience)
		hint += "，经验+" + experience;
	core.drawTip(hint);

	// 删除该块
	if (core.isset(x) && core.isset(y)) {
		core.removeBlock(x, y);
	}

	// 毒衰咒的处理
	var special = enemy.special;
	// 中毒
	if (core.enemys.hasSpecial(special, 12) && !core.hasFlag('poison')) {
		core.setFlag('poison', true);
	}
	// 衰弱
	if (core.enemys.hasSpecial(special, 13) && !core.hasFlag('weak')) {
		core.setFlag('weak', true);
		var weakValue = core.values.weakValue;
		var weakAtk = weakValue>=1?weakValue:Math.floor(weakValue*core.status.hero.atk);
		var weakDef = weakValue>=1?weakValue:Math.floor(weakValue*core.status.hero.def);
		core.setFlag('weakAtk', weakAtk);
		core.setFlag('weakDef', weakDef);
		core.status.hero.atk-=weakAtk;
		core.status.hero.def-=weakDef;
	}
	// 诅咒
	if (core.enemys.hasSpecial(special, 14) && !core.hasFlag('curse')) {
		core.setFlag('curse', true);
	}
	// 仇恨属性：减半
	if (core.flags.hatredDecrease && core.enemys.hasSpecial(special, 17)) {
		core.setFlag('hatred', parseInt(core.getFlag('hatred', 0)/2));
	}
	// 自爆
	if (core.enemys.hasSpecial(special, 19)) {
		core.status.hero.hp = 1;
	}
	// 退化
	if (core.enemys.hasSpecial(special, 21)) {
		core.status.hero.atk -= (enemy.atkValue||0);
		core.status.hero.def -= (enemy.defValue||0);
		if (core.status.hero.atk<0) core.status.hero.atk=0;
		if (core.status.hero.def<0) core.status.hero.def=0;
	}
	// 增加仇恨值
	core.setFlag('hatred', core.getFlag('hatred',0)+core.values.hatred);
	
	// 战后的技能处理，比如扣除魔力值
	if (core.flags.enableSkill) {
		// 检测当前开启的技能类型
		var skill = core.getFlag('skill', 0);
		if (skill==1) { // 技能1：二倍斩
			core.status.hero.mana-=5; // 扣除5点魔力值
		}
		// 关闭技能
		core.setFlag('skill', 0);
		core.setFlag('skillName', '无');
	}
	
	core.updateStatusBar();


	// 事件的处理
	var todo = [];
	// 如果不为阻击，且该点存在，且有事件
	if (!core.enemys.hasSpecial(special, 18) && core.isset(x) && core.isset(y)) {
		var event = core.floors[core.status.floorId].afterBattle[x+","+y];
		if (core.isset(event)) {
			// 插入事件
			core.unshift(todo, event);
		}
	}
	// 如果有加点
	var point = core.material.enemys[enemyId].point;
	if (core.isset(point) && point>0) {
		core.unshift(todo, core.events.addPoint(core.material.enemys[enemyId]));
	}

	// 在这里增加其他的自定义事件需求
	/*
	if (enemyId=='xxx') {
		core.unshift(todo, [
			{"type": "...", ...},
		]);
	}
	*/

	// 如果事件不为空，将其插入
	if (todo.length>0) {
		core.events.insertAction(todo,x,y);
	}

	// 如果已有事件正在处理中
	if (core.status.event.id == null) {
		core.continueAutomaticRoute();
	}
	else {
		core.clearContinueAutomaticRoute();
	}
	if (core.isset(callback)) callback();

},
        "afterOpenDoor": function(doorId,x,y,callback) {
	// 开一个门后触发的事件
	
	var todo = [];
	if (core.isset(x) && core.isset(y)) {
		var event = core.floors[core.status.floorId].afterOpenDoor[x+","+y];
		if (core.isset(event)) {
			core.unshift(todo, event);
		}
	}

	if (todo.length>0) {
		core.events.insertAction(todo,x,y);
	}

	if (core.status.event.id == null) {
		core.continueAutomaticRoute();
	}
	else {
		core.clearContinueAutomaticRoute();
	}
	if (core.isset(callback)) callback();
},
        "afterGetItem": function(itemId,x,y,callback) {
	// 获得一个道具后触发的事件

	var todo = [];
	if (core.isset(x) && core.isset(y)) {
		var event = core.floors[core.status.floorId].afterGetItem[x+","+y];
		if (core.isset(event)) {
			core.unshift(todo, event);
		}
	}

	if (todo.length>0) {
		core.events.insertAction(todo,x,y);
	}

	if (core.isset(callback)) callback();
},
        "afterChangeLight": function(x,y) {
	// 改变亮灯之后，可以触发的事件

},
        "afterPushBox": function () {
	// 推箱子后的事件

	var noBoxLeft = function () {
		// 地图上是否还存在未推到的箱子，如果不存在则返回true，存在则返回false
		for (var i=0;i<core.status.thisMap.blocks.length;i++) {
			var block=core.status.thisMap.blocks[i];
			if (core.isset(block.event) && block.event.id=='box') return false;
		}
		return true;
	}

	if (noBoxLeft()) {
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
        "beforeSaveData": function(data) {
	// 即将存档前可以执行的操作

},
        "afterLoadData": function(data) {
	// 读档事件后，载入事件前，可以执行的操作
	// 怪物数据的动态修改迁移到了“脚本编辑 - updateEnemys”中，详见文档说明

	core.enemys.updateEnemys();
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
        "getSpecials": function() {
	// 获得怪物的特殊属性，每一行定义一个特殊属性。
	// 分为三项，第一项为该特殊属性的数字，第二项为特殊属性的名字，第三项为特殊属性的描述
	// 可以直接写字符串，也可以写个function将怪物传进去
	return [
		[1, "先攻", "怪物首先攻击"],
		[2, "魔攻", "怪物无视勇士的防御"],
		[3, "坚固", "勇士每回合最多只能对怪物造成1点伤害"],
		[4, "2连击", "怪物每回合攻击2次"],
		[5, "3连击", "怪物每回合攻击3次"],
		[6, function(enemy) {return (enemy.n||4)+"连击";}, function(enemy) {return "怪物每回合攻击"+(enemy.n||4)+"次";}],
		[7, "破甲", "战斗前，怪物附加角色防御的"+Math.floor(100*core.values.breakArmor||0)+"%作为伤害"],
		[8, "反击", "战斗时，怪物每回合附加角色攻击的"+Math.floor(100*core.values.counterAttack||0)+"%作为伤害，无视角色防御"],
		[9, "净化", "战斗前，怪物附加勇士魔防的"+core.values.purify+"倍作为伤害"],
		[10, "模仿", "怪物的攻防和勇士攻防相等"],
		[11, "吸血", function (enemy) {return "战斗前，怪物首先吸取角色的"+Math.floor(100*enemy.value||0)+"%生命（约" + Math.floor((enemy.value||0)*core.getStatus('hp')) + "点）作为伤害"+(enemy.add?"，并把伤害数值加到自身生命上":"");}],
		[12, "中毒", "战斗后，勇士陷入中毒状态，每一步损失生命"+core.values.poisonDamage+"点"],
		[13, "衰弱", "战斗后，勇士陷入衰弱状态，攻防暂时下降"+(core.values.weakValue>=1?core.values.weakValue+"点":parseInt(core.values.weakValue*100)+"%")],
		[14, "诅咒", "战斗后，勇士陷入诅咒状态，战斗无法获得金币和经验"],
		[15, "领域", function (enemy) {return "经过怪物周围"+(enemy.range||1)+"格时自动减生命"+(enemy.value||0)+"点";}],
		[16, "夹击", "经过两只相同的怪物中间，勇士生命值变成一半"],
		[17, "仇恨", "战斗前，怪物附加之前积累的仇恨值作为伤害"+(core.flags.hatredDecrease?"；战斗后，释放一半的仇恨值":"")+"。（每杀死一个怪物获得"+(core.values.hatred||0)+"点仇恨值）"],
		[18, "阻击", function (enemy) {return "经过怪物的十字领域时自动减生命"+(enemy.value||0)+"点，同时怪物后退一格";}],
		[19, "自爆", "战斗后勇士的生命值变成1"],
		[20, "无敌", "勇士无法打败怪物，除非拥有十字架"],
		[21, "退化", function (enemy) {return "战斗后勇士永久下降"+(enemy.atkValue||0)+"点攻击和"+(enemy.defValue||0)+"点防御";}],
		[22, "固伤", function (enemy) {return "战斗前，怪物对勇士造成"+(enemy.damage||0)+"点固定伤害，无视勇士魔防。";}],
		[23, "重生", "怪物被击败后，角色转换楼层则怪物将再次出现"],
		[24, "激光", function (enemy) {return "经过怪物同行或同列时自动减生命"+(enemy.value||0)+"点";}],
		[25, "光环", function (enemy) {return "同楼层所有怪物生命提升"+(enemy.value||0)+"%，攻击提升"+(enemy.atkValue||0)+"%，防御提升"+(enemy.defValue||0)+"%，"+(enemy.add?"可叠加":"不可叠加");}]
	];
},
        "getEnemyInfo": function (enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId) {
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
	var mon_hp = enemy.hp, mon_atk = enemy.atk, mon_def = enemy.def, mon_special = enemy.special;
	var mon_money = enemy.money, mon_experience = enemy.experience, mon_point = enemy.point;
	// 模仿
	if (this.hasSpecial(mon_special, 10)) {
		mon_atk = hero_atk;
		mon_def = hero_def;
	}
	// 坚固
	if (this.hasSpecial(mon_special, 3) && mon_def < hero_atk - 1) {
		mon_def = hero_atk - 1;
	}
	
	// 光环效果
	// 检查当前楼层所有光环怪物（数字25）
	var hp_delta = 0, atk_delta = 0, def_delta = 0, cnt = 0;
	// 遍历每个图块
	core.status.maps[floorId].blocks.forEach(function (block) {
		if (core.isset(block.event) && !block.disable) {
			// 获得该图块的ID
			var id = block.event.id, enemy = core.material.enemys[id];
			// 检查是不是怪物，且是否拥有该特殊属性
			if (core.isset(enemy) && core.hasSpecial(enemy.special, 25)) {
				// 检查是否可叠加
				if (enemy.add || cnt == 0) {
					hp_delta += enemy.value || 0;
					atk_delta += enemy.atkValue || 0;
					def_delta += enemy.defValue || 0;
					cnt++;
				}
			}
		}
	});
	// 增加比例；如果要增加数值可以直接在这里修改
	mon_hp *= (1+hp_delta/100);
	mon_atk *= (1+atk_delta/100);
	mon_def *= (1+def_delta/100);
	
	// TODO：可以在这里新增其他的怪物数据变化
	// 比如仿攻（怪物攻击不低于勇士攻击）：
	// if (this.hasSpecial(mon_special, 27) && mon_atk < hero_atk) {
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
		"special": mon_special
	};
},
        "getDamageInfo": function (enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId) {
	// 获得战斗伤害信息（实际伤害计算函数）
	// 
	// 参数说明：
	// enemy：该怪物信息
	// hero_hp,hero_atk,hero_def,hero_mdef：勇士的生命攻防魔防数据
	// x,y：该怪物的坐标（查看手册和强制战斗时为undefined）
	// floorId：该怪物所在的楼层
	// 后面三个参数主要是可以在光环等效果上可以适用
	floorId = floorId || core.status.floorId;	

	// 勇士的负属性都按0计算
	hero_hp=Math.max(0, hero_hp);
	hero_atk=Math.max(0, hero_atk);
	hero_def=Math.max(0, hero_def);
	hero_mdef=Math.max(0, hero_mdef);

	// 装备按比例增加属性
	if (core.flags.equipPercentage) {
		hero_atk = Math.floor(core.getFlag('equip_atk_buff',1)*hero_atk);
		hero_def = Math.floor(core.getFlag('equip_def_buff',1)*hero_def);
		hero_mdef = Math.floor(core.getFlag('equip_mdef_buff',1)*hero_mdef);
	}
	
	// 怪物的各项数据
	// 对坚固模仿等处理扔到了脚本编辑-getEnemyInfo之中
	var enemyInfo = core.enemys.getEnemyInfo(enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId);
	var mon_hp = enemyInfo.hp, mon_atk = enemyInfo.atk, mon_def = enemyInfo.def, mon_special = enemyInfo.special;
	
	// 技能的处理
	if (core.getFlag('skill', 0)==1) { // 开启了技能1：二倍斩
		hero_atk *= 2; // 计算时攻击力翻倍	
	}

	// 如果是无敌属性，且勇士未持有十字架
	if (this.hasSpecial(mon_special, 20) && !core.hasItem("cross"))
		return null; // 不可战斗
	
	// 战前造成的额外伤害（可被魔防抵消）
	var init_damage = 0;

	// 吸血
	if (this.hasSpecial(mon_special, 11)) {
		var vampire_damage = hero_hp * enemy.value;

		// 如果有神圣盾免疫吸血等可以在这里写
		// if (core.hasFlag('shield5')) vampire_damage = 0;

		vampire_damage = Math.floor(vampire_damage) || 0;
		// 加到自身
		if (enemy.add) // 如果加到自身
			mon_hp += vampire_damage;

		init_damage += vampire_damage;
	}

	// 检查是否破防；否则直接返回不可战斗
	if (hero_atk <= mon_def) return null;

	// 每回合怪物对勇士造成的战斗伤害
	var per_damage = mon_atk - hero_def;
	// 魔攻：战斗伤害就是怪物攻击力
	if (this.hasSpecial(mon_special, 2)) per_damage = mon_atk;
	// 战斗伤害不能为负值
	if (per_damage < 0) per_damage = 0;

	// 2连击 & 3连击 & N连击
	if (this.hasSpecial(mon_special, 4)) per_damage *= 2;
	if (this.hasSpecial(mon_special, 5)) per_damage *= 3;
	if (this.hasSpecial(mon_special, 6)) per_damage *= (enemy.n||4);

	// 每回合的反击伤害；反击是按照勇士的攻击次数来计算回合
	var counterDamage = 0;
	if (this.hasSpecial(mon_special, 8)) counterDamage += Math.floor(core.values.counterAttack * hero_atk);

	// 先攻
	if (this.hasSpecial(mon_special, 1)) init_damage += per_damage;

	// 破甲
	if (this.hasSpecial(mon_special, 7))
		init_damage += Math.floor(core.values.breakArmor * hero_def);

	// 净化
	if (this.hasSpecial(mon_special, 9))
		init_damage += Math.floor(core.values.purify * hero_mdef);

	// 勇士每回合对怪物造成的伤害
	var hero_per_damage = hero_atk - mon_def;
	// 勇士的攻击回合数；为怪物生命除以每回合伤害向上取整
	var turn = Math.ceil(mon_hp / hero_per_damage);
	// 最终伤害：初始伤害 + 怪物对勇士造成的伤害 + 反击伤害
	var damage = init_damage + (turn - 1) * per_damage + turn * counterDamage;
	// 再扣去魔防
	damage -= hero_mdef;

	// 检查是否允许负伤
	if (!core.flags.enableNegativeDamage)
		damage=Math.max(0, damage);

	return {
		"mon_hp": mon_hp,
		"mon_atk": mon_atk,
		"mon_def": mon_def,
		"init_damage": init_damage,
		"per_damage": per_damage,
		"hero_per_damage": hero_per_damage,
		"turn": turn,
		"damage": damage
	};
},
        "updateEnemys": function () {
	// 更新怪物数据，可以在这里对怪物属性和数据进行动态更新，详见文档——事件——怪物数据的动态修改
	// 比如下面这个例子，如果flag:xxx为真，则将绿头怪的攻击设为100，金币设为20
	/*
	if (core.hasFlag('xxx')) {
		core.material.enemys.greenSlime.atk = 100;
		core.material.enemys.greenSlime.money = 20;
	}
	*/
	// 别忘了在事件中调用“更新怪物数据”事件！
}
    },
    "actions": {
        "onKeyUp": function (keyCode, altKey) {
	// 键盘按键处理，可以在这里自定义快捷键列表
	// keyCode：当前按键的keyCode（每个键的keyCode自行百度）
	// altKey：Alt键是否被按下，为true代表同时按下了Alt键
	// 可以在这里任意增加或编辑每个按键的行为
	
	// 如果处于正在行走状态，则不处理
	if (!core.status.heroStop)
		return;

	// Alt+0~9，快捷换上套装
	if (altKey && keyCode>=48 && keyCode<=57) {
		core.items.quickLoadEquip(keyCode-48);
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
		case 68: // D：独挡
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
		case 75: case 86: // K/V：打开快捷商店列表
			core.openQuickShop(true);
			break;
		case 32: // SPACE：轻按
			core.getNextItem();
			break;
		case 82: // R：回放录像
			if (core.hasFlag('debug')) {
				core.drawText("\t[系统提示]调试模式下无法回放录像");
			}
			else {
				core.ui.drawReplay();
			}
			break;
		case 33: case 34: // PgUp/PgDn：浏览地图
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
		case 49: // 快捷键1: 破
			if (core.hasItem('pickaxe')) {
				if (core.canUseItem('pickaxe')) {
					core.useItem('pickaxe');
				}
				else {
					core.drawTip('当前不能使用破墙镐');
				}
			}
			break;
		case 50: // 快捷键2: 炸
			if (core.hasItem('bomb')) {
				if (core.canUseItem('bomb')) {
					core.useItem('bomb');
				}
				else {
					core.drawTip('当前不能使用炸弹');
				}
			}
			else if (core.hasItem('hammer')) {
				if (core.canUseItem('hammer')) {
					core.useItem('hammer');
				}
				else {
					core.drawTip('当前不能使用圣锤');
				}

			}
			break;
		case 51: // 快捷键3: 飞
			if (core.hasItem('centerFly')) {
				core.events.useItem('centerFly');
			}
			break;
		case 52: // 快捷键4：破冰/冰冻/地震/上下楼器/... 其他道具依次判断
			{
				var list = ["icePickaxe", "snow", "earthquake", "upFly", "downFly", "jumpShoes", "lifeWand", "poisonWine", "weakWine", "curseWine", "superWine"];
				for (var i=0;i<list.length;i++) {
					var itemId = list[i];
					if (core.canUseItem(itemId)) {
						core.useItem(itemId);
						break;
					}
				}
			}
			break;
		case 118: // F7：开启debug模式
			core.debug();
			break;
		case 87: // W：开启技能“二倍斩”
			// 检测是否拥有“二倍斩”这个技能道具
			if (core.hasItem('skill1')) {
				core.useItem('skill1');
			}
			break;
		// 在这里可以任意新增或编辑已有的快捷键内容
		/*
		case 0: // 使用该按键的keyCode
			// 还可以再判定altKey是否被按下，即 if (altKey) { ...

			// ... 在这里写你要执行脚本
			// **强烈建议所有新增的自定义快捷键均能给个对应的道具可点击，以方便手机端的行为**
			if (core.hasItem('...')) {
				core.useItem('...');
			}

			break;
		*/
    }
	
}
    },
    "control": {
        "flyTo": function (toId, callback) {
	// 楼层传送器的使用，从当前楼层飞往toId
	// 如果不能飞行请返回false

	var fromId = core.status.floorId;
	
	// 检查能否飞行
	if (!core.status.maps[fromId].canFlyTo || !core.status.maps[toId].canFlyTo) {
		core.drawTip("无法飞往" + core.status.maps[toId].title +"！");
		return false;
	}
	
	// 获得两个楼层的索引，以决定是上楼梯还是下楼梯
	var fromIndex = core.floorIds.indexOf(fromId), toIndex = core.floorIds.indexOf(toId);
	var stair = fromIndex<=toIndex?"downFloor":"upFloor";
	// 地下层：同层传送至上楼梯
	if (fromIndex == toIndex && core.status.maps[fromId].underGround) stair = "upFloor";
	// 记录录像
	core.status.route.push("fly:"+toId);
	// 传送
	core.ui.closePanel();
	core.changeFloor(toId, stair, null, null, callback);
	
	return true;
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
	core.events.setFloorName();

	// 设置勇士名字和图标
	core.statusBar.name.innerHTML = core.getStatus('name');

	// 设置等级名称
	var lvName = core.getLvName();
	core.statusBar.lv.innerHTML = lvName;
	// 检测是不是纯数字；如果带中文等需要取消斜体（不然很难看的！）
	if (/^[+-]?\d+$/.test(lvName))
		core.statusBar.lv.style.fontStyle = 'italic';
	else core.statusBar.lv.style.fontStyle = 'normal';

	// 设置生命上限、生命值、攻防魔防金币和经验值
	var statusList = ['hpmax', 'hp', 'mana', 'atk', 'def', 'mdef', 'money', 'experience'];
	statusList.forEach(function (item) {
		// 向下取整
		if (core.isset(core.status.hero[item]))
			core.status.hero[item] = Math.floor(core.status.hero[item]);
		// 大数据格式化
		core.statusBar[item].innerHTML = core.formatBigNumber(core.getStatus(item));
	});

	// 装备按比例增加属性
	if (core.flags.equipPercentage) {
		core.statusBar.atk.innerHTML = core.formatBigNumber(Math.floor(core.getFlag('equip_atk_buff',1)*core.getStatus('atk')));
		core.statusBar.def.innerHTML = core.formatBigNumber(Math.floor(core.getFlag('equip_def_buff',1)*core.getStatus('def')));
		core.statusBar.mdef.innerHTML = core.formatBigNumber(Math.floor(core.getFlag('equip_mdef_buff',1)*core.getStatus('mdef')));
	}
	
	// 设置魔力值
	if (core.flags.enableMana) {
		// 也可以使用flag:manaMax来表示最大魔力值；详见文档-个性化-技能塔的支持
		// core.status.hero.mana = Math.max(core.status.hero.mana, core.getFlag('manaMax', 10));
		// core.statusBar.mana.innerHTML = core.status.hero.mana + "/" + core.getFlag('manaMax', 10);
	}
	// 设置技能栏
	if (core.flags.enableSkill) {
		// 可以用flag:skill表示当前开启的技能类型，flag:skillName显示技能名；详见文档-个性化-技能塔的支持
		core.statusBar.skill.innerHTML = core.getFlag('skillName', '无');
	}

	// 可以在这里添加自己额外的状态栏信息，比如想攻击显示 +0.5 可以这么写：
	// if (core.hasFlag('halfAtk')) core.statusBar.atk.innerHTML += "+0.5";

	// 如果是自定义添加的状态栏，也需要在这里进行设置显示的数值

	// 进阶
	if (core.flags.enableLevelUp && core.status.hero.lv<core.firstData.levelUp.length) {
		core.statusBar.up.innerHTML = core.firstData.levelUp[core.status.hero.lv].need || " ";
	}
	else core.statusBar.up.innerHTML = " ";

	// 钥匙
	var keys = ['yellowKey', 'blueKey', 'redKey'];
	keys.forEach(function (key) {
		core.statusBar[key].innerHTML = core.setTwoDigits(core.status.hero.items.keys[key]);
	});
	// 毒衰咒
	if(core.flags.enableDebuff){
		core.statusBar.poison.innerHTML = core.hasFlag('poison')?"毒":"";
		core.statusBar.weak.innerHTML = core.hasFlag('weak')?"衰":"";
		core.statusBar.curse.innerHTML = core.hasFlag('curse')?"咒":"";
	}
	// 破炸飞
	if (core.flags.enablePZF) {
		core.statusBar.pickaxe.innerHTML = "破"+core.itemCount('pickaxe');
		core.statusBar.bomb.innerHTML = "炸"+core.itemCount('bomb');
		core.statusBar.fly.innerHTML = "飞"+core.itemCount('centerFly');
	}

	// 难度
	core.statusBar.hard.innerHTML = core.status.hard;

	// 更新阻激夹域的伤害值
	core.updateCheckBlock();
	// 更新全地图显伤
	core.updateDamage();
},
        "updateCheckBlock": function () {
	// 领域、夹击、阻击等的伤害值计算

	core.status.checkBlock = {};
	if (!core.isset(core.status.thisMap)) return;
	var blocks = core.status.thisMap.blocks;

	// Step1: 更新怪物地图
	core.status.checkBlock.map = []; // 记录怪物地图
	for (var n=0;n<blocks.length;n++) {
		var block = blocks[n];
		if (core.isset(block.event) && !block.disable && block.event.cls.indexOf('enemy')==0) {
			var id = block.event.id, enemy = core.material.enemys[id];
			if (core.isset(enemy)) {
				core.status.checkBlock.map[block.x+core.bigmap.width*block.y]=id;
			}
		}
		// 血网
		if (core.isset(block.event) && !block.disable &&
			block.event.id=='lavaNet' && block.event.trigger=='passNet' && !core.hasItem("shoes")) {
			core.status.checkBlock.map[block.x+core.bigmap.width*block.y]="lavaNet";
		}
	}

	// Step2: 更新领域、阻击伤害
	core.status.checkBlock.damage = []; // 记录(x,y)点的伤害；(x,y)对应的值是 x+core.bigmap.width*y
	for (var x=0;x<core.bigmap.width*core.bigmap.height;x++) core.status.checkBlock.damage[x]=0;

	for (var x=0;x<core.bigmap.width;x++) {
		for (var y=0;y<core.bigmap.height;y++) {
			var id = core.status.checkBlock.map[x+core.bigmap.width*y];
			if (core.isset(id)) {

				// 如果是血网，直接加上伤害值
				if (id=="lavaNet") {
					core.status.checkBlock.damage[x+core.bigmap.width*y]+=core.values.lavaDamage||0;
					continue;
				}

				var enemy = core.material.enemys[id];
				// 存在领域
				// 如果要防止领域伤害，可以直接简单的将 flag:no_zone 设为true
				if (core.enemys.hasSpecial(enemy.special, 15) && !core.hasFlag("no_zone")) {
					// 领域范围，默认为1
					var range = enemy.range || 1;
					// 是否是九宫格领域
					var zoneSquare = false;
					if (core.isset(enemy.zoneSquare)) zoneSquare=enemy.zoneSquare;
					// 在范围内进行搜索，增加领域伤害值
					for (var dx=-range;dx<=range;dx++) {
						for (var dy=-range;dy<=range;dy++) {
							if (dx==0 && dy==0) continue;
							var nx=x+dx, ny=y+dy;
							if (nx<0 || nx>=core.bigmap.width || ny<0 || ny>=core.bigmap.height) continue;
							// 如果是十字领域，则还需要满足 |dx|+|dy|<=range
							if (!zoneSquare && Math.abs(dx)+Math.abs(dy)>range) continue;
							core.status.checkBlock.damage[nx+ny*core.bigmap.width]+=enemy.value||0;
						}
					}
				}
				// 存在激光
				// 如果要防止激光伤害，可以直接简单的将 flag:no_laser 设为true
				if (core.enemys.hasSpecial(enemy.special, 24) && !core.hasFlag("no_laser")) {
					// 检查同行和同列，增加激光伤害值
					for (var nx=0;nx<core.bigmap.width;nx++) {
						if (nx!=x) core.status.checkBlock.damage[nx+y*core.bigmap.width]+=enemy.value||0;
					}
					for (var ny=0;ny<core.bigmap.height;ny++) {
						if (ny!=y) core.status.checkBlock.damage[x+ny*core.bigmap.width]+=enemy.value||0;
					}
				}
				// 存在阻击
				// 如果要防止阻击伤害，可以直接简单的将 flag:no_snipe 设为true
				if (core.enemys.hasSpecial(enemy.special, 18) && !core.hasFlag("no_snipe")) {
					for (var dx=-1;dx<=1;dx++) {
						for (var dy=-1;dy<=1;dy++) {
							if (dx==0 && dy==0) continue;
							var nx=x+dx, ny=y+dy;
							if (nx<0 || nx>=core.bigmap.width || ny<0 || ny>=core.bigmap.height || Math.abs(dx)+Math.abs(dy)>1) continue;
							core.status.checkBlock.damage[nx+ny*core.bigmap.width]+=enemy.value||0;
						}
					}
				}
			}
		}
	}

	// Step3: 更新夹击点坐标，并将夹击伤害加入到damage中
	core.status.checkBlock.betweenAttack = []; // 记录(x,y)点是否有夹击
	// 如果要防止夹击伤害，可以简单的将 flag:no_betweenAttack 设为true
	if (!core.hasFlag('no_betweenAttack')) {
		for (var x=0;x<core.bigmap.width;x++) {
			for (var y=0;y<core.bigmap.height;y++) {
				// 该点是否存在夹击
				var has=false;
				// 检测左右是否存在相同的怪物，且拥有夹击属性
				if (x>0 && x<core.bigmap.width-1) {
					var id1=core.status.checkBlock.map[x-1+core.bigmap.width*y],
						id2=core.status.checkBlock.map[x+1+core.bigmap.width*y];
					if (core.isset(id1) && core.isset(id2) && id1==id2) {
						var enemy = core.material.enemys[id1];
						if (core.isset(enemy) && core.enemys.hasSpecial(enemy.special, 16)) {
							has = true;
						}
					}
				}
				// 检测上下是否存在相同的怪物，且拥有夹击属性
				if (y>0 && y<core.bigmap.height-1) {
					var id1=core.status.checkBlock.map[x+core.bigmap.width*(y-1)],
						id2=core.status.checkBlock.map[x+core.bigmap.width*(y+1)];
					if (core.isset(id1) && core.isset(id2) && id1==id2) {
						var enemy = core.material.enemys[id1];
						if (core.isset(enemy) && core.enemys.hasSpecial(enemy.special, 16)) {
							has = true;
						}
					}
				}
				// 计算夹击伤害
				if (has) {
					core.status.checkBlock.betweenAttack[x+core.bigmap.width*y]=true;
					// 先扣除该点领域/阻击/激光造成的伤害，再算夹击
					var leftHp = core.status.hero.hp - core.status.checkBlock.damage[x+core.bigmap.width*y];
					// 1血不夹；core.flags.betweenAttackCeil控制向上还是向下
					if (leftHp>1)
						core.status.checkBlock.damage[x+core.bigmap.width*y] += Math.floor((leftHp+(core.flags.betweenAttackCeil?0:1))/2);
				}
			}
		}
	}
}
    },
    "ui": {
        "drawStatistics": function () {
	// 浏览地图时参与的统计项目
	
	return [
		'yellowDoor', 'blueDoor', 'redDoor', 'greenDoor', 'steelDoor',
		'yellowKey', 'blueKey', 'redKey', 'greenKey', 'steelKey',
		'redJewel', 'blueJewel', 'greenJewel', 'yellowJewel',
		'redPotion', 'bluePotion', 'greenPotion', 'yellowPotion', 'superPotion',
		'pickaxe', 'bomb', 'centerFly',
		'poisonWine', 'weakWine', 'curseWine', 'superWine',
		'sword1', 'sword2', 'sword3', 'sword4', 'sword5',
		'shield1', 'shield2', 'shield3', 'shield4', 'shield5',
		// 在这里可以增加新的ID来进行统计个数，只能增加道具ID
	];
},
        "drawAbout": function() {
	// 绘制“关于”界面
	if (!core.isPlaying()) {
		core.status.event = {'id': null, 'data': null};
		core.dom.startPanel.style.display = 'none';
	}
	core.lockControl();
	core.status.event.id = 'about';

	core.clearMap('ui');
	var left = 48, top = 36, right = 416 - 2 * left, bottom = 416 - 2 * top;

	core.setAlpha('ui', 0.85);
	core.fillRect('ui', left, top, right, bottom, '#000000');
	core.setAlpha('ui', 1);
	core.strokeRect('ui', left - 1, top - 1, right + 1, bottom + 1, '#FFFFFF', 2);

	var text_start = left + 24;

	// 名称
	core.canvas.ui.textAlign = "left";
	core.fillText('ui', "HTML5 魔塔样板", text_start, top+35, "#FFD700", "bold 22px Verdana");
	core.fillText('ui', "版本： "+core.firstData.version, text_start, top + 80, "#FFFFFF", "bold 17px Verdana");
	core.fillText('ui', "作者： 艾之葵", text_start, top + 112);
	core.fillText('ui', 'HTML5魔塔交流群：539113091', text_start, top+112+32);
	// TODO: 写自己的“关于”页面，每次增加32像素即可
}
    },
    "plugins": {
        "parallelDo": function (timestamp) {
	// 并行事件处理，可以在这里写任何需要并行处理的脚本或事件
	// 该函数将被系统反复执行，每次执行间隔视浏览器或设备性能而定，一般约为16.6ms一次
	// 参数timestamp为“从游戏资源加载完毕到当前函数执行时”的时间差，以毫秒为单位

	// 检查当前是否处于游戏开始状态
	if (!core.isPlaying()) return;
	
	// 下面是一个并行事件开门的样例
	/*
	// 如果某个flag为真
	if (core.hasFlag("xxx")) {
		// 千万别忘了将该flag清空！否则下次仍然会执行这段代码。
		core.setFlag("xxx", false);
		// 使用insertAction来插入若干自定义事件执行
		core.insertAction([
			{"type":"openDoor", "loc":[0,0], "floorId": "MT0"}
		])
		// 也可以写任意其他的脚本代码
	}
	 */
	
},
        "plugin": function () {
	////// 插件编写，可以在这里写自己额外需要执行的脚本 //////

	// 在这里写的代码，在所有模块加载完毕后，游戏开始前会被执行
	console.log("插件编写测试");
	// 可以写一些其他的被直接执行的代码


	// 在这里写所有需要自定义的函数
	// 写法必须是 this.xxx = function (args) { ...
	// 如果不写this的话，函数将无法被外部所访问
	this.test = function () {
		console.log("插件函数执行测试");
	};


	// 绘制灯光/漆黑层效果。调用方式 core.plugin.drawLight(...)
	// 【参数说明】
	// color：可选，灯光以外部分的颜色，可以是一个四元数组，或者简单的一个0到1之间的数。忽略则默认为0.9。
	//        如果是四元数组，则代表RGBA值，如 [255,255,0,0.2] 就代表 #FFFF00 且不透明度0.2
	//        如果是一个数，则只是不透明度的值，RGB均为0，如 0.9 就代表 [0,0,0,0.9]
	// lights：可选，一个数组，定义了每个独立的灯光。
	//        其中每一项是三元组 [x,y,r] 或者四元组 [x,y,r,o]
	//        x和y分别为该灯光的横纵坐标，r为该灯光的半径，o为该灯光中心的不透明度，可忽略默认为0。
	// lightDec：可选，0到1之间，光从多少百分比才开始衰减（在此范围内保持全亮），不设置默认为0。
	//        比如lightDec为0.5代表，每个灯光部分内圈50%的范围全亮，50%以后才开始快速衰减。
	// 【调用样例】
	// core.plugin.drawLight(); // 绘制一个0.9的全图不透明度，等价于更改画面色调为[0,0,0,0.9]。
	// core.plugin.drawLight(0.95, [[25,11,46]]); // 全图不透明度0.95，其中在(25,11)点存在一个半径为46的灯光效果。
	// core.plugin.drawLight([255,255,0,0.2], [[25,11,46,0.1]]); // 全图为不透明度0.2的黄色，其中在(25,11)点存在一个半径为46的灯光效果，灯光中心不透明度0.1。
	// core.plugin.drawLight(0.9, [[25,11,46],[105,121,88],[301,221,106]]); // 存在三个灯光效果，分别是中心(25,11)半径46，中心(105,121)半径88，中心(301,221)半径106。
	// core.plugin.drawLight([0,0,255,0.3], [[25,11,46],[105,121,88,0.2]], 0.4); // 存在两个灯光效果，它们在内圈40%范围内保持全亮，且40%后才开始衰减。
	// 【注意事项】
	// 此函数会和更改画面色调发生冲突，请只选择一个使用。
	this.drawLight = function (color, lights, lightDec) {
		// 清空色调层
		var ctx = core.canvas.curtain;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		core.clearMap('curtain');
		core.setOpacity('curtain', 1);
		core.setAlpha('curtain', 1);

		// 绘制色调层，默认不透明度
		if (!core.isset(color)) color = 0.9;
		if (typeof color == "number") color = [0,0,0,color];
		core.fillRect('curtain', 0, 0, 416, 416,
			'rgba('+color[0]+','+color[1]+','+color[2]+','+core.clamp(color[3],0,1)+')');

		// 绘制每个灯光效果
		if (!core.isset(lights) || lights.length==0) return;
		lightDec = core.clamp(lightDec, 0, 1);
		lights.forEach(function (light) {
			// 坐标，半径，中心不透明度
			var x = light[0], y = light[1], r = light[2], o = 255 * (1 - core.clamp(light[3], 0, 1));
			// 计算衰减距离
			var decDistance = parseInt(r * lightDec), leftDistance = r - decDistance;
			// 正方形区域的直径和左上角坐标
			var d = r * 2, sx = x - r, sy = y - r;
			// 获得正方形区域的颜色信息
			var imageData = ctx.getImageData(sx, sy, d, d);
			// 对每个像素点进行遍历
			for (var i = 0; i < imageData.data.length; i+=4) {
				// 当前点的坐标
				var index = i / 4, cx = parseInt(index/d), cy = index%d;
				// 当前点距离中心点的距离
				var dx = r - cx, dy = r - cy, distance = Math.sqrt(dx*dx+dy*dy);
				if (distance >= r) continue;
				// 计算当前点的alpha值
				var alpha = imageData.data[i+3] - (distance<decDistance?1:(r-distance)/leftDistance)*o;
				imageData.data[i+3] = core.clamp(alpha, 0, 255);
			}
			ctx.putImageData(imageData, sx, sy);
		});
	}


	// 可以在任何地方（如afterXXX或自定义脚本事件）调用函数，方法为  core.plugin.xxx();

}
    }
}