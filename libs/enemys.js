function enemys() {

}

enemys.prototype.init = function () {
    // 怪物属性初始化定义：
    this.enemys = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80;
    delete(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80);
}

enemys.prototype.getEnemys = function (enemyId) {
    if (enemyId == undefined) {
        return this.enemys;
    }
    return this.enemys[enemyId];
}

enemys.prototype.hasSpecial = function (special, test) {
    return (special instanceof Array)?special.indexOf(test)>=0:(special!=0&&(special%100==test||this.hasSpecial(parseInt(special/100), test)));
}

enemys.prototype.getSpecialText = function (enemyId) {
    if (enemyId == undefined) return "";
    var special = this.enemys[enemyId].special;
    var text = [];
    if (this.hasSpecial(special, 1)) text.push("先攻");
    if (this.hasSpecial(special, 2)) text.push("魔攻");
    if (this.hasSpecial(special, 3)) text.push("坚固");
    if (this.hasSpecial(special, 4)) text.push("2连击");
    if (this.hasSpecial(special, 5)) text.push("3连击");
    if (this.hasSpecial(special, 6)) text.push("4连击");
    if (this.hasSpecial(special, 7)) text.push("破甲");
    if (this.hasSpecial(special, 8)) text.push("反击");
    if (this.hasSpecial(special, 9)) text.push("净化");
    if (this.hasSpecial(special, 10)) text.push("模仿");
    if (this.hasSpecial(special, 11)) text.push("吸血");
    if (this.hasSpecial(special, 12)) text.push("中毒");
    if (this.hasSpecial(special, 13)) text.push("衰弱");
    if (this.hasSpecial(special, 14)) text.push("诅咒");
    if (this.hasSpecial(special, 15)) text.push("领域");
    if (this.hasSpecial(special, 16)) text.push("夹击");
    if (this.hasSpecial(special, 17)) text.push("仇恨");
    return text.join("  ");
}

enemys.prototype.getDamage = function (monsterId) {
    var monster = core.material.enemys[monsterId];
    var hero_atk = core.status.hero.atk, hero_def = core.status.hero.def, hero_mdef = core.status.hero.mdef;
    var mon_hp = monster.hp, mon_atk = monster.atk, mon_def = monster.def, mon_special = monster.special;
    var damage = this.calDamage(hero_atk, hero_def, hero_mdef, mon_hp, mon_atk, mon_def, mon_special);
    if (damage == 999999999) return damage;
    return damage + this.getExtraDamage(monster);
}

enemys.prototype.getExtraDamage = function (monster) {
    var extra_damage = 0;
    if (this.hasSpecial(monster.special, 11)) { // 吸血
        // 吸血的比例
        extra_damage = core.status.hero.hp * monster.value;
        extra_damage = parseInt(extra_damage);
    }
    if (this.hasSpecial(monster.special, 17)) { // 仇恨
        extra_damage += core.getFlag('hatred', 0);
    }
    return extra_damage;
}

// 临界值计算
enemys.prototype.getCritical = function (monsterId) {
    var monster = core.material.enemys[monsterId];
    if (this.hasSpecial(monster.special, 3) || this.hasSpecial(monster.special, 10)) return "???";
    var last = this.calDamage(core.status.hero.atk, core.status.hero.def, core.status.hero.mdef,
        monster.hp, monster.atk, monster.def, monster.special);
    if (last <= 0) return 0;

    for (var i = core.status.hero.atk + 1; i <= monster.hp + monster.def; i++) {
        var damage = this.calDamage(i, core.status.hero.def, core.status.hero.mdef,
            monster.hp, monster.atk, monster.def, monster.special);
        if (damage < last)
            return i - core.status.hero.atk;
        last = damage;
    }
    return 0;
}

// 临界减伤计算
enemys.prototype.getCriticalDamage = function (monsterId) {
    var c = this.getCritical(monsterId);
    if (c == '???') return '???';
    if (c <= 0) return 0;
    var monster = core.material.enemys[monsterId];
    var last = this.calDamage(core.status.hero.atk, core.status.hero.def, core.status.hero.mdef,
        monster.hp, monster.atk, monster.def, monster.special);
    if (last == 999999999) return '???';

    return last - this.calDamage(core.status.hero.atk + c, core.status.hero.def, core.status.hero.mdef,
        monster.hp, monster.atk, monster.def, monster.special);
}

// 1防减伤计算
enemys.prototype.getDefDamage = function (monsterId) {
    var monster = core.material.enemys[monsterId];
    return this.calDamage(core.status.hero.atk, core.status.hero.def, core.status.hero.mdef,
        monster.hp, monster.atk, monster.def, monster.special) -
        this.calDamage(core.status.hero.atk, core.status.hero.def + 1, core.status.hero.mdef,
            monster.hp, monster.atk, monster.def, monster.special)
}

enemys.prototype.calDamage = function (hero_atk, hero_def, hero_mdef, mon_hp, mon_atk, mon_def, mon_special) {
    // 魔攻
    if (this.hasSpecial(mon_special,2)) hero_def = 0;
    // 坚固
    if (this.hasSpecial(mon_special,3) && mon_def < hero_atk - 1) mon_def = hero_atk - 1;
    // 模仿
    if (this.hasSpecial(mon_special,10)) {
        mon_atk = hero_atk;
        mon_def = hero_def;
    }
    if (hero_atk <= mon_def) return 999999999; // 不可战斗时请直接返回999999999

    var per_damage = mon_atk - hero_def;
    if (per_damage < 0) per_damage = 0;
    // 2连击 & 3连击

    if (this.hasSpecial(mon_special, 4)) per_damage *= 2;
    if (this.hasSpecial(mon_special, 5)) per_damage *= 3;
    if (this.hasSpecial(mon_special, 6)) per_damage *= 4;

    var counterDamage = 0;
    // 反击
    if (this.hasSpecial(mon_special, 8)) counterDamage += parseInt(core.values.counterAttack * hero_atk);

    // 先攻
    var damage = mon_special == 1 ? per_damage : 0;
    // 破甲
    if (this.hasSpecial(mon_special, 7)) damage += parseInt(core.values.breakArmor * hero_def);
    // 净化
    if (this.hasSpecial(mon_special, 9)) damage = core.values.purify * hero_mdef;

    var turn = parseInt((mon_hp - 1) / (hero_atk - mon_def));
    var ans = damage + turn * per_damage + (turn + 1) * counterDamage;
    ans -= hero_mdef;

    return core.flags.enableNegativeDamage?ans:Math.max(0, ans);
}

// 获得当前楼层的怪物列表
enemys.prototype.getCurrentEnemys = function () {
    var enemys = [];
    var used = {};
    var mapBlocks = core.status.thisMap.blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (core.isset(mapBlocks[b].event) && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable) && mapBlocks[b].event.cls == 'enemys') {
            var monsterId = mapBlocks[b].event.id;
            if (core.isset(used[monsterId])) continue;

            var monster = core.material.enemys[monsterId];
            var mon_atk = monster.atk, mon_def = monster.def;
            // 坚固
            if (this.hasSpecial(monster.special, 3) && mon_def < core.status.hero.atk - 1)
                mon_def = core.status.hero.atk - 1;
            if (this.hasSpecial(monster.special, 10)) {
                mon_atk=core.status.hero.atk;
                mon_def=core.status.hero.def;
            }

            enemys.push({
                'id': monsterId,
                'name': monster.name,
                'hp': monster.hp,
                'atk': mon_atk,
                'def': mon_def,
                'money': monster.money,
                'experience': monster.experience,
                'special': core.enemys.getSpecialText(monsterId),
                'damage': this.getDamage(monsterId),
                'critical': this.getCritical(monsterId),
                'criticalDamage': this.getCriticalDamage(monsterId),
                'defDamage': this.getDefDamage(monsterId)
            });

            used[monsterId] = true;
        }
    }

    enemys.sort(function (a, b) {
        if (a.damage == b.damage) {
            return a.money - b.money;
        }
        return a.damage - b.damage;
    });
    return enemys;
}

main.instance.enemys = new enemys();