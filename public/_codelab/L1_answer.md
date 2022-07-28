```js
function (enemy, hero, x, y, floorId) {
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

	// 混乱（编号39）：战斗中，勇士攻防互换。
	if (core.hasSpecial(mon_special, 39)) {
		var temp = hero_atk;
		hero_atk = hero_def;
		hero_def = temp;
	}
	
	// 残暴斩杀（编号35）：战斗开始时，如果角色血量不大于怪物血量的200%，则直接暴毙。
	if (core.hasSpecial(mon_special, 35) && hero_hp < mon_hp * 2) {
		return null;
	}
	
	// 窥血为攻（编号36）：战斗开始时，自身攻击力变为角色当前生命值的10%，向下取整。
	if (core.hasSpecial(mon_special, 36)) {
		mon_atk = Math.floor(hero_hp / 10);
	}
	
	// 技能3：角色攻击在战斗时减少`flag:x3`，防御力增加`flag:x3`。
	if (core.getFlag('skill', 0) == 3) {
		// 注意这里直接改变的面板攻击力（经过装备增幅后的）而不是基础攻击力。
		hero_atk -= core.getFlag('x3', 0);
		hero_def += core.getFlag('x3', 0);
	}
	
	// 技能4：角色无视怪物的`flag:x4`%的防御力。（如，`flag:x4`是10时，无视怪物的10%防御力）
	if (core.getFlag('skill', 0) == 4) {
		mon_def -= Math.floor(core.getFlag('x4', 0) / 100);
	}

	// 如果是无敌属性，且勇士未持有十字架
	if (core.hasSpecial(mon_special, 20) && !core.hasItem("cross"))
		return null; // 不可战斗

	// 战前造成的额外伤害（可被护盾抵消）
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
	// 穿刺（编号32）：无视角色70%防御力。
	if (core.hasSpecial(mon_special, 32)) per_damage = Math.floor(mon_atk - 0.3 * hero_def);
	// 战斗伤害不能为负值
	if (per_damage < 0) per_damage = 0;
	
	// 中子束（编号34）：每回合普攻两次，魔攻一次。
	if (core.hasSpecial(mon_special, 34)) {
		per_damage *= 2;
		per_damage += mon_atk;
	}
	
	// 崩甲（编号38）：怪物每回合附加勇士战斗开始时的护盾数值的0.1倍作为伤害。
	if (core.hasSpecial(mon_special, 38)) {
		per_damage += Math.floor(hero_mdef * 0.1);
	}

	// 2连击 & 3连击 & N连击
	if (core.hasSpecial(mon_special, 4)) per_damage *= 2;
	if (core.hasSpecial(mon_special, 5)) per_damage *= 3;
	if (core.hasSpecial(mon_special, 6)) per_damage *= (enemy.n || 4);

	// 每回合的反击伤害；反击是按照勇士的攻击次数来计算回合
	var counterDamage = 0;
	if (core.hasSpecial(mon_special, 8))
		counterDamage += Math.floor((enemy.atkValue || core.values.counterAttack) * hero_atk);

	// 先攻
	if (core.hasSpecial(mon_special, 1)) init_damage += per_damage;

	// 破甲
	if (core.hasSpecial(mon_special, 7))
		init_damage += Math.floor((enemy.defValue || core.values.breakArmor) * hero_def);

	// 净化
	if (core.hasSpecial(mon_special, 9))
		init_damage += Math.floor((enemy.n || core.values.purify) * hero_mdef);
	
	// 冰冻（编号33）：怪物首先冰冻角色3回合，冰冻期间每回合额外造成角色护盾的20%伤害。
	if (core.hasSpecial(mon_special, 33)) {
		init_damage += Math.floor(3 * (per_damage + 0.2 * hero_mdef));
	}

	// 勇士每回合对怪物造成的伤害
	var hero_per_damage = Math.max(hero_atk - mon_def, 0);
	
	// 技能2：角色每回合造成和受到的伤害均提升`flag:x2`%。（如，`flag:x2`为10时，每回合造成和受到伤害都提升10%）
	if (core.getFlag("skill", 0) == 2) {
		per_damage += Math.floor(per_damage * core.getFlag('x2', 0) / 100);
		hero_per_damage += Math.floor(hero_per_damage * core.getFlag('x2', 0) / 100);
	}
	
	// 闪避（编号31）：受到伤害降低40%。
	if (core.hasSpecial(mon_special, 31)) {
		hero_per_damage = Math.floor(hero_per_damage * 0.6);
	}
	
	// 如果没有破防，则不可战斗
	if (hero_per_damage <= 0) return null;
	
	// 技能5：角色额外抢攻`flag:x5`回合。
	if (core.getFlag("skill", 0) == 5) {
		mon_hp -= core.getFlag('x5', 0) * hero_per_damage;
		// 判定是否已经秒杀 -> 注意mon_hp不能小于等于0否则回合计算会出问题
		if (mon_hp <= 0) mon_hp = 1;
	}
	
	// 暗影庇护（编号41）：处于无敌状态，但每回合损耗自身2%的最大生命值。
	if (core.hasSpecial(mon_special, 41)) {
		hero_per_damage = Math.floor(mon_hp * 0.02);
	}
	
	// 强击（编号40）：怪物第一回合三倍攻击。
	// 注意：需要判定角色是否秒杀怪物
	if (core.hasSpecial(mon_special, 40) && hero_per_damage < mon_hp) {
		init_damage += 2 * mon_atk;
	}

	
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
	
	// 匙之力（编号37）：角色身上每存在一把黄钥匙，最终伤害提升5%；蓝钥匙视为三把黄钥匙，红钥匙视为九把黄钥匙，线性叠加。
	// 需要判定是否负伤
	if (core.hasSpecial(mon_special, 37) && damage > 0) {
		var cnt = core.itemCount("yellowKey") + 3 * core.itemCount("blueKey") + 9 * core.itemCount("redKey");
		damage += Math.floor(damage * 0.05 * cnt);
	}

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
	
	// 技能1：角色每回合回复`flag:x1`%倍护盾的生命值。（如，`flag:x1`是10时，每回合回复10%护盾值的生命）
	if (core.getFlag("skill", 0) == 1) {
		damage -= Math.floor(core.getFlag('x1', 0) / 100 * hero_mdef * turn);
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
```
