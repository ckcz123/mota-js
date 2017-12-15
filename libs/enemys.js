function enemys() {

}

enemys.prototype.init = function () {
    // 怪物属性初始化定义：
    this.enemys = {
        'greenSlime': {'name': '绿头怪', 'hp': 100, 'atk': 120, 'def': 0, 'money': 1, 'experience': 0, 'special': 0},
        'redSlime': {'name': '红头怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'blackSlime': {'name': '青头怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'slimelord': {'name': '怪王', 'hp': 100, 'atk': 120, 'def': 0, 'money': 10, 'experience': 0, 'special': 9},
        'bat': {'name': '小蝙蝠', 'hp': 100, 'atk': 120, 'def': 0, 'money': 2, 'experience': 0, 'special': 1},
        'bigBat': {'name': '大蝙蝠', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'redBat': {'name': '红蝙蝠', 'hp': 100, 'atk': 120, 'def': 0, 'money': 5, 'experience': 0, 'special': 4},
        'vampire': {'name': '冥灵魔王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'skeleton': {'name': '骷髅人', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'skeletonSoilder': {'name': '骷髅士兵', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'skeletonCaptain': {'name': '骷髅队长', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'ghostSkeleton': {'name': '冥队长', 'hp': 100, 'atk': 120, 'def': 0, 'money': 8, 'experience': 0, 'special': 7},
        'zombie': {'name': '兽人', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'zombieKnight': {'name': '兽人武士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'rock': {'name': '石头人', 'hp': 100, 'atk': 120, 'def': 0, 'money': 4, 'experience': 0, 'special': 3},
        'slimeMan': {'name': '影子战士', 'hp': 100, 'atk': 0, 'def': 0, 'money': 11, 'experience': 0, 'special': 10}, // 模仿怪的攻防设为0就好
        'bluePriest': {'name': '初级法师', 'hp': 100, 'atk': 120, 'def': 0, 'money': 3, 'experience': 0, 'special': 2},
        'redPriest': {'name': '高级法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'brownWizard': {'name': '初级巫师', 'hp': 100, 'atk': 120, 'def': 0, 'money': 16, 'experience': 0, 'special': 15, 'value': 100}, // 领域怪需要加value表示领域伤害的数值
        'redWizard': {'name': '高级巫师', 'hp': 1000, 'atk': 1200, 'def': 0, 'money': 160, 'experience': 0, 'special': 15, 'value': 200},
        'yellowGuard': {'name': '初级卫兵', 'hp': 100, 'atk': 120, 'def': 0, 'money': 10, 'experience': 0, 'special': 0},
        'blueGuard': {'name': '中级卫兵', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'redGuard': {'name': '高级卫兵', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'swordsman': {'name': '双手剑士', 'hp': 100, 'atk': 120, 'def': 0, 'money': 6, 'experience': 0, 'special': 5},
        'soldier': {'name': '冥战士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'yellowKnight': {'name': '金骑士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'redKnight': {'name': '红骑士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'darkKnight': {'name': '黑骑士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'blackKing': {'name': '黑衣魔王', 'hp': 1000, 'atk': 500, 'def': 0, 'money': 1000, 'experience': 1000, 'special': 0, 'bomb': false}, // 加入 'bomb': false 代表该怪物不可被炸弹或圣锤炸掉
        'yellowKing': {'name': '黄衣魔王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'greenKing': {'name': '青衣武士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'blueKnight': {'name': '蓝骑士', 'hp': 100, 'atk': 120, 'def': 0, 'money': 9, 'experience': 0, 'special': 8},
        'goldSlime': {'name': '黄头怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'poisonSkeleton': {'name': '紫骷髅', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'poisonBat': {'name': '紫蝙蝠', 'hp': 100, 'atk': 120, 'def': 0, 'money': 14, 'experience': 0, 'special': 13},
        'steelRock': {'name': '铁面人', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'skeletonPriest': {'name': '骷髅法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'skeletonKing': {'name': '骷髅王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'skeletonWizard': {'name': '骷髅巫师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'redSkeletonCaption': {'name': '骷髅武士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'special': 0},
        'badHero': {'name': '迷失勇者', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'demon': {'name': '魔神武士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'demonPriest': {'name': '魔神法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'goldHornSlime': {'name': '金角怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'redKing': {'name': '红衣魔王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'whiteKing': {'name': '白衣武士', 'hp': 100, 'atk': 120, 'def': 0, 'money': 17, 'experience': 0, 'special': 16},
        'blackMagician': {'name': '黑暗大法师', 'hp': 100, 'atk': 120, 'def': 0, 'money': 12, 'experience': 0, 'special': 11, 'value': 1/3, 'bomb': false}, // 吸血怪需要在后面添加value代表吸血比例
        'silverSlime': {'name': '银头怪', 'hp': 100, 'atk': 120, 'def': 0, 'money': 15, 'experience': 0, 'special': 14},
        'swordEmperor': {'name': '剑圣', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'whiteHornSlime': {'name': '尖角怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'badPrincess': {'name': '痛苦魔女', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'badFairy': {'name': '黑暗仙子', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'grayPriest': {'name': '中级法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'redSwordsman': {'name': '剑王', 'hp': 100, 'atk': 120, 'def': 0, 'money': 7, 'experience': 0, 'special': 6},
        'whiteGhost': {'name': '水银战士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'poisonZombie': {'name': '绿兽人', 'hp': 100, 'atk': 120, 'def': 0, 'money': 13, 'experience': 0, 'special': 12},
        'magicDragon': {'name': '魔龙', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'octopus': {'name': '血影', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'fairy': {'name': '仙子', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
        'greenKnight': {'name': '强盾骑士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
    }
}

enemys.prototype.getEnemys = function (enemyId) {
    if (enemyId == undefined) {
        return this.enemys;
    }
    return this.enemys[enemyId];
}

enemys.prototype.getSpecialText = function (enemyId) {
    if (enemyId == undefined) return "";
    var special = this.enemys[enemyId].special;
    if (special == 1) return "先攻";
    if (special == 2) return "魔攻";
    if (special == 3) return "坚固";
    if (special == 4) return "2连击";
    if (special == 5) return "3连击";
    if (special == 6) return "4连击";
    if (special == 7) return "破甲";
    if (special == 8) return "反击";
    if (special == 9) return "净化";
    if (special == 10) return "模仿";
    if (special == 11) return "吸血";
    if (special == 12) return "中毒";
    if (special == 13) return "衰弱";
    if (special == 14) return "诅咒";
    if (special == 15) return "领域";
    if (special == 16) return "夹击";
    return "";
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
    if (monster.special == 11) { // 吸血
        // 吸血的比例
        extra_damage = core.status.hero.hp * monster.value;
        extra_damage = parseInt(extra_damage);
    }
    return extra_damage;
}

// 临界值计算
enemys.prototype.getCritical = function (monsterId) {
    var monster = core.material.enemys[monsterId];
    if (monster.special == 3 || monster.special == 10) return "???";
    var last = this.calDamage(core.status.hero.atk, core.status.hero.def, core.status.hero.mdef,
        monster.hp, monster.atk, monster.def, monster.special);
    if (last == 0) return 0;

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
    if (c == 0) return 0;
    var monster = core.material.enemys[monsterId];
    // if (c<=0) return 0;
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
    if (mon_special == 2) hero_def = 0;
    // 坚固
    if (mon_special == 3 && mon_def < hero_atk - 1) mon_def = hero_atk - 1;
    // 模仿
    if (mon_special == 10) {
        mon_atk = hero_atk;
        mon_def = hero_def;
    }
    if (hero_atk <= mon_def) return 999999999; // 不可战斗时请直接返回999999999

    var per_damage = mon_atk - hero_def;
    if (per_damage < 0) per_damage = 0;
    // 2连击 & 3连击

    if (mon_special == 4) per_damage *= 2;
    if (mon_special == 5) per_damage *= 3;
    if (mon_special == 6) per_damage *= 4;
    // 反击
    if (mon_special == 8) per_damage += parseInt(0.1 * hero_atk);

    // 先攻
    var damage = mon_special == 1 ? per_damage : 0;
    // 破甲
    if (mon_special == 7) damage = parseInt(0.9 * hero_def);
    // 净化
    if (mon_special == 9) damage = 3 * hero_mdef;

    var turn = parseInt((mon_hp - 1) / (hero_atk - mon_def));
    var ans = damage + turn * per_damage;
    ans -= hero_mdef;

    // 魔防回血
    // return ans;

    // 魔防不回血
    return ans <= 0 ? 0 : ans;
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
            if (monster.special == 3 && mon_def < core.status.hero.atk - 1)
                mon_def = core.status.hero.atk - 1;
            if (monster.special==10) {
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