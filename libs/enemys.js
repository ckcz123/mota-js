function enemys() {

}

enemys.prototype.init = function () {
    this.enemys = {
         'greenSlime': {'name': '绿头怪', 'hp': 50, 'atk': 18, 'def': 1, 'money': 1, 'experience': 1, 'special': 0},   
        'redSlime': {'name': '红头怪', 'hp': 70, 'atk': 20, 'def': 2, 'money': 2, 'experience': 2, 'special': 0},
     /*   'blackSlime': {'name': '青头怪', 'hp': 189, 'atk': 27, 'def': 6, 'money': 3, 'experience': 1, 'special': 0},  */
     /*   'slimelord': {'name': '怪王', 'hp': 472, 'atk': 300, 'def': 150, 'money': 35, 'experience': 1,'special': 0},   */
        'bat': {'name': '小蝙蝠', 'hp': 90, 'atk': 30, 'def': 4, 'money': 4, 'experience': 3,'special': 0},
    /*    'bigBat': {'name': '大蝙蝠', 'hp': 451, 'atk': 92, 'def': 18, 'money': 12,'experience': 1, 'special': 0},   */
    /*   'redBat': {'name': '红蝙蝠', 'hp': 439, 'atk': 260, 'def': 140, 'money': 30,'experience': 1, 'special': 0},  */
        'vampire': {'name': '冥灵魔王', 'hp': 10000, 'atk': 2000, 'def': 2000, 'money': 100,'experience': 100, 'special': 0, 'bomb': false },
        'skeleton': {'name': '骷髅人', 'hp': 100, 'atk': 35, 'def': 5, 'money': 6,'experience': 4, 'special': 0},
        'skeletonSoilder': {'name': '骷髅士兵', 'hp': 150, 'atk': 55, 'def': 15, 'money': 10,'experience': 8, 'special': 0},
     /*    'skeletonCaptain': {'name': '骷髅队长', 'hp': 600, 'atk': 110, 'def': 20, 'money': 13,'experience': 1, 'special': 0},  */  
     /*   'ghostSkeleton': {'name': '冥队长', 'hp': 836, 'atk': 236, 'def': 81, 'money': 28,'experience': 1, 'special': 0},   */
        'zombie': {'name': '兽人', 'hp': 1000, 'atk': 245, 'def': 45, 'money': 26,'experience': 21, 'special': 0},
        'zombieKnight': {'name': '兽人武士', 'hp': 2000, 'atk': 340, 'def': 170, 'money': 70,'experience': 55, 'special': 0},
        'rock': {'name': '石头人', 'hp': 1600, 'atk': 750, 'def': 950, 'money': 31,'experience': 23, 'special': 3},
        'slimeMan': {'name': '影子战士', 'hp': 3000, 'atk': 500, 'def': 250, 'money': 80,'experience': 60, 'special': 0},
        'bluePriest': {'name': '初级法师', 'hp': 150, 'atk': 50, 'def': 10, 'money': 8,'experience': 7, 'special': 0},
        'redPriest': {'name': '高级法师', 'hp': 300, 'atk': 100, 'def': 20, 'money': 20,'experience': 15,'special': 0},
      /*  'brownWizard': {'name': '初级巫师', 'hp': 500, 'atk': 358, 'def': 222, 'money': 44,'experience': 1, 'special': 2},  */
      /*  'redWizard': {'name': '高级巫师', 'hp': 1000, 'atk': 100, 'def': 350, 'money': 51,'experience': 1, 'special': 2},   */
      /*  'yellowGuard': {'name': '初级卫兵', 'hp': 444, 'atk': 85, 'def': 24, 'money': 10,'experience': 1,'special': 0},  */
       /* 'blueGuard': {'name': '中级卫兵', 'hp': 746, 'atk': 160, 'def': 90, 'money': 24,'experience': 1, 'special': 0}, */
      /*  'redGuard': {'name': '高级卫兵', 'hp': 560, 'atk': 280, 'def': 160, 'money': 33,'experience': 1, 'special': 0},  */
        'swordsman': {'name': '双手剑士', 'hp': 600, 'atk': 888, 'def': 60, 'money': 77,'experience': 66, 'special': 4},
      /*  'soldier': {'name': '冥战士', 'hp': 888, 'atk': 388, 'def': 88, 'money': 39,'experience': 1, 'special': 0},  */
        'yellowKnight': {'name': '金骑士', 'hp': 2000, 'atk': 1200, 'def': 1000, 'money': 103,'experience': 94, 'special': 0}, 
         'redKnight': {'name': '红骑士', 'hp': 3500, 'atk': 1350, 'def': 1200, 'money': 125,'experience': 112, 'special': 0},
        'darkKnight': {'name': '黑骑士', 'hp': 6000, 'atk': 1600, 'def': 1400, 'money': 173,'experience': 144, 'special': 0},
       /* 'blackKing': {'name': '黑衣魔王', 'hp': 1356, 'atk': 650, 'def': 356, 'money': 0,'experience': 1, 'special': 0},*/
      /*  'yellowKing': {'name': '黄衣魔王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
       /* 'greenKing': {'name': '青衣武士', 'hp': 688, 'atk': 502, 'def': 332, 'money': 53, 'experience': 1,'special': 0},*/
      /*  'blueKnight': {'name': '近卫骑士', 'hp': 400, 'atk': 375, 'def': 350, 'money': 49, 'experience': 1,'special': 0},*/
      /*  'goldSlime': {'name': '黄头怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
      /*  'poisonSkeleton': {'name': '紫骷髅', 'hp': 550, 'atk': 370, 'def': 250, 'money': 42,'experience': 1, 'special': 0},*/
     /*   'poisonBat': {'name': '紫蝙蝠', 'hp': 743, 'atk': 440, 'def': 304, 'money': 52,'experience': 1, 'special': 0},*/
     /*   'steelRock': {'name': '铁面人', 'hp': 120, 'atk': 270, 'def': 0, 'money': 50, 'experience': 1,'special': 3},*/
     /*   'skeletonPriest': {'name': '骷髅法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
      /*  'skeletonKing': {'name': '骷髅王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
     /*   'skeletonWizard': {'name': '骷髅巫师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
     /*   'redSkeletonCaption': {'name': '骷髅武士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'special': 0},*/
     /*   'badHero': {'name': '迷失勇者', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
     /*   'demon': {'name': '魔神武士', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
      /*  'demonPriest': {'name': '魔神法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
     /*   'goldHornSlime': {'name': '金角怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
      /*  'redKing': {'name': '红衣魔王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0}, */
      /*  'whiteKing': {'name': '白衣武士', 'hp': 766, 'atk': 544, 'def': 162, 'money': 46, 'experience': 1,'special': 0}, */
        'blackMagician': {'name': '黑魔法师', 'hp': 7000, 'atk': 2000, 'def': 1500, 'money': 200,'experience': 156,'special': 11, 'value': 1/3},
     /*   'silverSlime': {'name': '银头怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0}, */
     /*    'swordEmperor': {'name': '剑圣', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0}, */
     /*    'whiteHornSlime': {'name': '尖角怪', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
     /*    'badPrincess': {'name': '痛苦魔女', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
     /*    'badFairy': {'name': '黑暗仙子', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
      /*   'grayPriest': {'name': '中级法师', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0,'experience': 1, 'special': 0},*/
      /*   'redSwordsman': {'name': '剑王', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 1,'special': 0},*/
         'whiteGhost': {'name': '水银战士', 'hp': 4500, 'atk': 1000, 'def': 500, 'money': 100, 'experience': 80,'special': 0}, 
      /*   'poisonZombie': {'name': '绿兽人', 'hp': 660, 'atk': 443, 'def': 210, 'money': 43, 'experience': 1,'special': 0},*/
         'magicDragon': {'name': '魔龙', 'hp': 33333, 'atk': 3333, 'def': 3333, 'money': 0, 'experience': 0,'special': 0, 'bomb': false },
         'octopus': {'name': '血影', 'hp': 10000, 'atk': 999, 'def': 999, 'money': 999, 'experience': 999, 'special': 0},
         'fairy': {'name': '仙子', 'hp': 600000, 'atk': 250000, 'def': 50000, 'money': 0, 'experience': 0,'special': 0, 'bomb': false },
         'greenKnight': {'name': '强盾骑士', 'hp': 15000, 'atk': 3000, 'def': 2000, 'money': 148, 'experience': 133,'special': 3},
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
    if (special == 11) return "吸血"; 
    return "";
}

enemys.prototype.getDamage = function (monsterId) {
    var monster = core.material.enemys[monsterId];
    var hero_atk = core.status.hero.atk, hero_def = core.status.hero.def, hero_mdef = core.status.hero.mdef;
    var mon_hp = monster.hp, mon_atk = monster.atk, mon_def = monster.def, mon_special = monster.special;
    var damage = this.calDamage(hero_atk, hero_def, hero_mdef, mon_hp, mon_atk, mon_def, mon_special);
    var extra_damage = 0;
    if (monster.special == 11) { // 吸血
        // 吸血的比例
        extra_damage = core.status.hero.hp * monster.value;

        if (core.status.hero.flags.hasShield5) // 存在神圣盾
            extra_damage /= 2;

        extra_damage = parseInt(extra_damage);
    }
    return damage + extra_damage;
}

// 临界值计算
enemys.prototype.getCritical = function (monsterId) {
    var monster = core.material.enemys[monsterId];
    if (monster.special == 3) return "???";
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
    if (hero_atk <= mon_def) return 999999999;

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
        if (core.isset(mapBlocks[b].event) && mapBlocks[b].event.cls == 'enemys') {
            var monsterId = mapBlocks[b].event.id;
            if (core.isset(used[monsterId])) continue;

            var monster = core.material.enemys[monsterId];
            var mon_def = monster.def;
            // 坚固
            if (monster.special==3 && mon_def<core.status.hero.atk-1)
                mon_def = core.status.hero.atk-1;

            enemys.push({
                'id': monsterId, 'name': monster.name, 'hp': monster.hp, 'atk': monster.atk, 'def': mon_def,
                'money': monster.money, 'experience': monster.experience, 'special': core.enemys.getSpecialText(monsterId),
                'damage': this.getDamage(monsterId), 'critical': this.getCritical(monsterId),
                'criticalDamage': this.getCriticalDamage(monsterId), 'defDamage': this.getDefDamage(monsterId)
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