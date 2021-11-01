1. 在怪物特殊属性中增加一行，分别定义特殊属性的数字、名字、描述、颜色，以及是否是地图类技能（如光环）。

2. 使用`function (enemy) {}`，里面可以取用`enemy.xxx`调用数值；例如`enemy.value`可以调用怪物的value值。

3. 仅在地图类技能时需要写1。当怪物的该项为1时，意味着该怪物的技能是和地图上其他图块有关的（而不是怪物自身独立的）。例如，先攻魔攻这些技能就是自身独立（和地图上其他图块无关），而光环，匙之力（根据周边钥匙数量提升属性）等这些技能就是与地图上其他怪物有关的。

4. 点击「配置表格」，找到怪物相关项目，并照葫芦画瓢即可。常见写法如下。

    ```js
    "value": {
		"_leaf": true,
		"_type": "textarea",
		"_docs": "特殊属性数值",
		"_data": "特殊属性的数值\n如：领域/阻激/激光怪的伤害值；吸血怪的吸血比例；光环怪增加生命的比例"
	},
    ```

5. 可定义不同项目如v1, v2, v3等分别表示伤害值；然后修改特殊描述和实际效果以取用v1, v2, v3等来代替原来的value。参见第10题解答。

6. 
    - 活力光环；周围十字范围内2格的友军生命提升10%，不可叠加。
    - 懒散光环；同楼层所有友军生命降低20%，防御提升30%，不可叠加。（注意，不会显示坚毅光环！）
    - 魔力光环：同楼层所有友军生命提升10%，攻击提升20%，防御提升30%，线性叠加。
    - range=5, zoneSquare = true, hpValue=10, atkValue=-20, add=true；活力光环。
    - range=3, hpValue = 20, atkValue = 10, defValue = 5；魔力光环。

7.    
    - 直接使用`enemy.value`获得当前吸血比例，乘以玩家当前生命值`core.getRealStatus('hp')`获得吸血数值，并取整再显示。
    - 可以通过额外的if来修改具体的描述。
    - 可以在简单难度下将value减半以达到效果。

    ```js
    [11, "吸血", function (enemy) {
        var value = enemy.value || 0; // 怪物吸血比例
        if (flags.hard == 1) value /= 2; // 简单难度下吸血值减半
        // 使用局部变量 value 代替 enemy.value
        var str = "\r[\#e525ff]【红海技能】\r战斗前，首先吸取对方的" 
            + Math.floor(100 * value) + "%生命（约" 
            + Math.floor(value * core.getRealStatus('hp')) + "点）作为伤害" 
            + (enemy.add ? "，并把伤害数值加到自身生命上" : "");
        if (core.hasItem("I_noVampire")) str += "\r[yellow]（对你无效）\r";
        return str;
    }, "#ff00d2"],
    ```

8. 
    ```js
    [28, function (enemy) {
        if (enemy.value28 > 0) return "迅捷光环";
        return "怠惰光环";
    }, function (enemy) {
        var str;
        // 直接 return 可以不显示具体技能内容。
        if (flags.hard == 1) return '此技能在简单难度下无效！';
        if (core.hasItem('I123')) return '此技能已被魔杖抵消！';
        if (!enemy.range) {
            str = "同楼层所有友军";
        } else {
            str = "周围" + (enemy.zoneSquare ? "方形" : "十字") + "范围内\r[yellow]" + (enemy.range || 1) + "\r格的友军";
        }
        if (enemy.value28 > 0) {
            str += "先攻\r[yellow]" + (enemy.value28 || 0) + "\r回合。";
        } else {
            str += "被先攻\r[yellow]" + (-enemy.value28 || 0) + "\r回合。";
        }
        return str;
    }, "#00dd00", 1],
    ```

9. 
    ```js
    [30, "匙之力", function (enemy) {
        var str = "";
        if (enemy.range) {
            str += "周围" + (enemy.zoneSquare ? "方形" : "十字") + "范围内\r[yellow]" + enemy.range + "\r格，每存在一把黄钥匙，";
        }
        else str += "同楼层每存在一把黄钥匙，";
        if (enemy.value) str += "生命增加\r[yellow]" + enemy.value + "\r点，";
        if (enemy.atkValue) str += "攻击增加\r[yellow]" + enemy.atkValue + "\r点，";
        if (enemy.defValue) str += "防御增加\r[yellow]" + enemy.defValue + "\r点，";
        str += "线性叠加。1把蓝钥匙=3把黄钥匙，1把红钥匙=10把黄钥匙。";
        return str;
    }, "#A0A000", 1],
    ```

10. 使用配置表格增设如下项目（也可以使用更好的名称如laserValue）：
    ```js
    "v1": {
		"_leaf": true,
		"_type": "textarea",
		"_docs": "阻击伤害"
	},
    "v2": {
		"_leaf": true,
		"_type": "textarea",
		"_docs": "激光伤害"
	},
    "v3": {
		"_leaf": true,
		"_type": "textarea",
		"_docs": "领域伤害"
	},
    "v4": {
		"_leaf": true,
		"_type": "textarea",
		"_docs": "吸血比例"
	},
    ```
    然后，特殊描述可以如下修改（分别使用v1, v2, v3, v4代替value）：
    ```js
    [11, "吸血", function (enemy) { return "战斗前，怪物首先吸取角色的" + Math.floor(100 * enemy.v4 || 0) + "%生命（约" + Math.floor((enemy.v4 || 0) * core.getStatus('hp')) + "点）作为伤害" + (enemy.add ? "，并把伤害数值加到自身生命上" : ""); }, "#dd4448"],
    [15, "领域", function (enemy) { return "经过怪物周围" + (enemy.zoneSquare ? "九宫格" : "十字") + "范围内" + (enemy.range || 1) + "格时自动减生命" + (enemy.v3 || 0) + "点"; }, "#c677dd"],
    [18, "阻击", function (enemy) { return "经过怪物周围" + (enemy.zoneSquare ? "九宫格" : "十字") + "时自动减生命" + (enemy.v1 || 0) + "点，同时怪物后退一格"; }, "#8888e6"],
    [24, "激光", function (enemy) { return "经过怪物同行或同列时自动减生命" + (enemy.v2 || 0) + "点"; }, "#dda0dd"],
    ```
    最后，修改实际效果。
    ```js
    // 吸血：getDamageInfo（节选）
	if (core.hasSpecial(mon_special, 11)) {
        /** ！！使用enemy.v4替代enemy.value！！ **/
		var vampire_damage = hero_hp * enemy.v4;

		// 如果有神圣盾免疫吸血等可以在这里写
		// 也可以用hasItem和hasEquip来判定装备
		// if (core.hasFlag('shield5')) vampire_damage = 0;

		vampire_damage = Math.floor(vampire_damage) || 0;
		// 加到自身
		if (enemy.add) // 如果加到自身
			mon_hp += vampire_damage;

		init_damage += vampire_damage;
	}
    ```
    ```js
    // 领域：updateCheckBlock（节选）
    for (var dx = -range; dx <= range; dx++) {
        for (var dy = -range; dy <= range; dy++) {
            if (dx == 0 && dy == 0) continue;
            var nx = x + dx,
                ny = y + dy,
                currloc = nx + "," + ny;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            // 如果是十字领域，则还需要满足 |dx|+|dy|<=range
            if (!zoneSquare && Math.abs(dx) + Math.abs(dy) > range) continue;
            /** ！！使用enemy.v3替代enemy.value！！ **/
            damage[currloc] = (damage[currloc] || 0) + (enemy.v3 || 0);
            type[currloc] = type[currloc] || {};
            type[currloc]["领域伤害"] = true;
        }
    }
    ```
    激光和阻击同领域实现。
