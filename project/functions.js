functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a = 
{
"events":{
////// 游戏开始前的一些初始化操作 //////
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
	if (core.flags.equipment) {
		core.material.items.sword1.cls = 'constants';
		core.material.items.sword2.cls = 'constants';
		core.material.items.sword3.cls = 'constants';
		core.material.items.sword4.cls = 'constants';
		core.material.items.sword5.cls = 'constants';
		core.material.items.shield1.cls = 'constants';
		core.material.items.shield2.cls = 'constants';
		core.material.items.shield3.cls = 'constants';
		core.material.items.shield4.cls = 'constants';
		core.material.items.shield5.cls = 'constants';
	}
},
////// 不同难度分别设置初始属性 //////
"setInitData":function (hard) {
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
////// 游戏获胜事件 //////
"win" : function(reason, norank) {
	// 游戏获胜事件 
	core.ui.closePanel();
	var replaying = core.status.replay.replaying;
	core.stopReplay();
	core.waitHeroToStop(function() {
		core.removeGlobalAnimate(0,0,true);
		core.clearMap('all'); // 清空全地图
		core.drawText([
			"\t[" + (reason||"恭喜通关") + "]你的分数是${status:hp}。"
		], function () {
			core.events.gameOver(reason||'', replaying, norank);
		})
	});
},
////// 游戏失败事件 //////
"lose" : function(reason) {
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
////// 转换楼层结束的事件 //////
"afterChangeFloor" : function (floorId) {
	// 转换楼层结束的事件
	if (!core.hasFlag("visited_"+floorId)) {
		core.insertAction(core.floors[floorId].firstArrive);
		core.setFlag("visited_"+floorId, true);
	}
},
////// 加点事件 //////
"addPoint" : function (enemy) {
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
////// 战斗结束后触发的事件 //////
"afterBattle" : function(enemyId,x,y,callback) {
	// 战斗结束后触发的事件

	var enemy = core.material.enemys[enemyId];

	var damage = core.enemys.getDamage(enemyId);
	if (damage == null) damage = core.status.hero.hp+1;

	// 扣减体力值
	core.status.hero.hp -= damage;

	// 记录
	core.status.hero.statistics.battleDamage += damage;

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
		core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
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
////// 开一个门后触发的事件 //////
"afterOpenDoor" : function(doorId,x,y,callback) {
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
////// 改变亮灯之后，可以触发的事件 //////
"afterChangeLight" : function(x,y) {
	// 改变亮灯之后，可以触发的事件

},
////// 推箱子后的事件 //////
"afterPushBox" : function () {
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
////// 使用炸弹/圣锤后的事件 //////
"afterUseBomb" : function () {
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
////// 即将存档前可以执行的操作 //////
"beforeSaveData" : function(data) {
	// 即将存档前可以执行的操作

},
////// 读档事件后，载入事件前，可以执行的操作 //////
"afterLoadData" : function(data) {
	// 读档事件后，载入事件前，可以执行的操作
	// 怪物数据的动态修改迁移到了“脚本编辑 - updateEnemys”中，详见文档说明

	core.enemys.updateEnemys();
}
},
"enemys": {
"getSpecials" : function() {
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
		[11, "吸血", function (enemy) {return "吸血：战斗前，怪物首先吸取角色的"+Math.floor(100*enemy.value||0)+"%生命作为伤害"+(enemy.add?"，并把伤害数值加到自身生命上":"");}],
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
		[23, "重生", "怪物被击败后，角色转换楼层则怪物将再次出现"]
	];
},
"getDamageInfo" : function (enemy, hero_hp, hero_atk, hero_def, hero_mdef) {
	// 获得战斗伤害信息（实际伤害计算函数）

	// 怪物生命，怪物攻击、防御、特殊属性
	var mon_hp = enemy.hp, mon_atk = enemy.atk, mon_def = enemy.def, mon_special = enemy.special;
	// 勇士的负属性都按0计算
	hero_hp=Math.max(0, hero_hp); hero_atk=Math.max(0, hero_atk); hero_def=Math.max(0, hero_def); hero_mdef=Math.max(0, hero_mdef);

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

	// 模仿
	if (this.hasSpecial(mon_special, 10)) {
		mon_atk = hero_atk;
		mon_def = hero_def;
	}
	// 坚固
	if (this.hasSpecial(mon_special, 3) && mon_def < hero_atk - 1)
		mon_def = hero_atk - 1;

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
"updateEnemys" : function () {
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
"ui":{
////// 绘制“关于”界面 //////
"drawAbout" : function() {
	// 绘制“关于”界面
	if (!core.isPlaying()) {
		core.status.event = {'id': null, 'data': null};
		core.dom.startPanel.style.display = 'none';
	}
	core.lockControl();
	core.status.event.id = 'about';

	core.clearMap('ui', 0, 0, 416, 416);
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
"plugin": function () {
	////// 插件编写，可以在这里写自己额外需要执行的脚本 //////

	// 在这里写的代码，在所有模块加载完毕后，游戏开始前会被执行
	console.log("插件编写测试");
	// 可以写一些其他的被直接执行的代码


	// 在这里写所有需要自定义的函数
	// 写法必须是 this.xxx = function (args) { ...
	// 如果不写this的话，函数将无法被外部所访问
	this.test  = function () {
		console.log("插件函数执行测试");
	}

	var _useEquipment = function (itemId, name, type) { // 具体的装备使用效果
		if (itemId.indexOf(name)==0) {
			var now=core.getFlag(name, name+"0");

			if (typeof core.values[now] == 'number') {
				core.status.hero[type] -= core.values[now];
			}
			else {
				core.status.hero.atk -= core.values[now].atk || 0;
				core.status.hero.def -= core.values[now].def || 0;
				core.status.hero.mdef -= core.values[now].mdef || 0;
			}

			if (typeof core.values[itemId] == 'number') {
				core.status.hero[type] += core.values[itemId];
			}
			else {
				core.status.hero.atk += core.values[itemId].atk || 0;
				core.status.hero.def += core.values[itemId].def || 0;
				core.status.hero.mdef += core.values[itemId].mdef || 0;
			}

			core.setItem(now, 1);
			core.setItem(itemId, 0);
			core.setFlag(name, itemId);
			core.drawTip("已装备"+core.material.items[itemId].name);
		}
	}

	this.useEquipment = function (itemId) { // 使用装备
		_useEquipment(itemId, "sword", "atk");
		_useEquipment(itemId, "shield", "def");
	}
	
	// 可以在任何地方（如afterXXX或自定义脚本事件）调用函数，方法为  core.plugin.xxx();

}
}
}