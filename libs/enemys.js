"use strict";

function enemys() {
    this._init();
}

////// 初始化 //////
enemys.prototype._init = function () {
    this.enemys = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80;
    this.enemydata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.enemys;
    if (main.mode == 'play') {
        this.enemydata.hasSpecial = function (a, b) {
            return core.enemys.hasSpecial(a, b)
        };
        for (var enemyId in this.enemys) {
            this.enemys[enemyId].id = enemyId;
        }
    }
}

enemys.prototype.getEnemys = function () {
    var enemys = core.clone(this.enemys);
    var enemyInfo = core.getFlag('enemyInfo');
    if (enemyInfo) {
        for (var id in enemyInfo) {
            for (var name in enemyInfo[id]) {
                enemys[id][name] = core.clone(enemyInfo[id][name]);
            }
        }
    }
    return enemys;
}

////// 判断是否含有某特殊属性 //////
enemys.prototype.hasSpecial = function (special, test) {
    if (special == null) return false;

    if (special instanceof Array) {
        return special.indexOf(test) >= 0;
    }

    if (typeof special == 'number') {
        return special === test;
    }

    if (typeof special == 'string') {
        return this.hasSpecial(core.material.enemys[special], test);
    }

    if (special.special != null) {
        return this.hasSpecial(special.special, test);
    }

    return false;
}

enemys.prototype.getSpecials = function () {
    return this.enemydata.getSpecials();
}

////// 获得所有特殊属性的名称 //////
enemys.prototype.getSpecialText = function (enemy) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (!enemy) return [];
    var special = enemy.special;
    var text = [];

    var specials = this.getSpecials();
    if (specials) {
        for (var i = 0; i < specials.length; i++) {
            if (this.hasSpecial(special, specials[i][0]))
                text.push(this._calSpecialContent(enemy, specials[i][1]));
        }
    }
    return text;
}

////// 获得每个特殊属性的说明 //////
enemys.prototype.getSpecialHint = function (enemy, special) {
    var specials = this.getSpecials();

    if (special == null) {
        if (specials == null) return [];
        var hints = [];
        for (var i = 0; i < specials.length; i++) {
            if (this.hasSpecial(enemy, specials[i][0]))
                hints.push(this._calSpecialContent(enemy, specials[i][1]) + "：" + this._calSpecialContent(enemy, specials[i][2]));
        }
        return hints;
    }

    if (specials == null) return "";
    for (var i = 0; i < specials.length; i++) {
        if (special == specials[i][0])
            return this._calSpecialContent(enemy, specials[i][1]) + "：" + this._calSpecialContent(enemy, specials[i][2]);
    }
    return "";
}

enemys.prototype._calSpecialContent = function (enemy, content) {
    if (typeof content == 'string') return content;
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (content instanceof Function) {
        return content(enemy);
    }
    return "";
}

////// 能否获胜 //////
enemys.prototype.canBattle = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = this.getDamage(enemy, x, y, floorId);
    return damage != null && damage < core.status.hero.hp;
}

////// 获得某个怪物的伤害 //////
enemys.prototype.getDamage = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = this._calDamage(enemy, null, x, y, floorId);
    if (damage == null) return null;
    return damage + this.getExtraDamage(enemy, x, y, floorId);
}

////// 获得某个怪物的额外伤害 //////
enemys.prototype.getExtraDamage = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var extra_damage = 0;
    if (this.hasSpecial(enemy.special, 17)) { // 仇恨
        extra_damage += core.getFlag('hatred', 0);
    }
    if (this.hasSpecial(enemy.special, 22)) { // 固伤
        extra_damage += enemy.damage || 0;
    }
    return extra_damage;
}

enemys.prototype.getDamageString = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = this.getDamage(enemy, x, y, floorId);

    var color = '#000000';

    if (damage == null) {
        damage = "???";
        color = '#FF0000';
    }
    else {
        if (damage <= 0) color = '#00FF00';
        else if (damage < core.status.hero.hp / 3) color = '#FFFFFF';
        else if (damage < core.status.hero.hp * 2 / 3) color = '#FFFF00';
        else if (damage < core.status.hero.hp) color = '#FF7F00';
        else color = '#FF0000';

        damage = core.formatBigNumber(damage, true);
        if (core.enemys.hasSpecial(enemy, 19))
            damage += "+";
        if (core.enemys.hasSpecial(enemy, 21))
            damage += "-";
        if (core.enemys.hasSpecial(enemy, 11))
            damage += "^";
    }

    return {
        "damage": damage,
        "color": color
    };
}

////// 接下来N个临界值和临界减伤计算 //////
enemys.prototype.nextCriticals = function (enemy, number, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    number = number || 1;

    if (this.hasSpecial(enemy.special, 10)) return []; // 模仿怪物临界
    var info = this.getDamageInfo(enemy, null, x, y, floorId);
    if (info == null || this.hasSpecial(enemy.special, 3)) { // 未破防，或是坚固怪
        info = this.getEnemyInfo(enemy, null, x, y, floorId);
        if (core.status.hero.atk <= info.def) {
            return [[info.def + 1 - core.status.hero.atk, '?']];
        }
        return [];
    }

    // getDamageInfo直接返回数字；0伤且无负伤
    if (typeof info == 'number' || (info.damage <= 0 && !core.flags.enableNegativeDamage)) {
        return [[0, 0]];
    }

    if (core.flags.useLoop) {
        var LOOP_MAX_VALUE = 1;
        if (core.status.hero.atk <= LOOP_MAX_VALUE) {
            return this._nextCriticals_useLoop(enemy, info, number, x, y, floorId);
        }
        else {
            return this._nextCriticals_useBinarySearch(enemy, info, number, x, y, floorId);
        }
    }
    else {
        return this._nextCriticals_useTurn(enemy, info, number, x, y, floorId);
    }
}

enemys.prototype._nextCriticals_useLoop = function (enemy, info, number, x, y, floorId) {
    var mon_hp = info.mon_hp, hero_atk = core.status.hero.atk, mon_def = info.mon_def, pre = info.damage;
    var list = [];
    for (var atk = hero_atk + 1; atk <= mon_hp + mon_def; atk++) {
        var nextInfo = this.getDamageInfo(enemy, {"atk": atk}, x, y, floorId);
        if (nextInfo == null || (typeof nextInfo == 'number')) break;
        if (pre > nextInfo.damage) {
            pre = nextInfo.damage;
            list.push([atk - hero_atk, info.damage - nextInfo.damage]);
            if (nextInfo.damage <= 0 && !core.flags.enableNegativeDamage) break;
            if (list.length >= number) break;
        }
    }
    if (list.length == 0) list.push([0, 0]);
    return list;
}

enemys.prototype._nextCriticals_useBinarySearch = function (enemy, info, number, x, y, floorId) {
    var mon_hp = info.mon_hp, hero_atk = core.status.hero.atk, mon_def = info.mon_def, pre = info.damage;
    var list = [];
    var calNext = function (currAtk, maxAtk) {
        var start = Math.floor(currAtk), end = Math.floor(maxAtk);
        if (start > end) return null;

        while (start < end) {
            var mid = Math.floor((start + end) / 2);
            var nextInfo = core.enemys.getDamageInfo(enemy, {"atk": mid}, x, y, floorId);
            if (nextInfo == null || (typeof nextInfo == 'number')) return null;
            if (pre > nextInfo.damage) end = mid;
            else start = mid + 1;
        }
        var nextInfo = core.enemys.getDamageInfo(enemy, {"atk": start}, x, y, floorId);
        return nextInfo == null || (typeof nextInfo == 'number') || nextInfo.damage >= pre ? null : [start, nextInfo.damage];
    }
    var currAtk = hero_atk;
    while (true) {
        var next = calNext(currAtk + 1, mon_hp + mon_def, pre);
        if (next == null) break;
        currAtk = next[0];
        pre = next[1];
        list.push([currAtk - hero_atk, info.damage - pre]);
        if (pre <= 0 && !core.flags.enableNegativeDamage) break;
        if (list.length >= number) break;
    }
    if (list.length == 0) list.push([0, 0]);
    return list;
}

enemys.prototype._nextCriticals_useTurn = function (enemy, info, number, x, y, floorId) {
    var mon_hp = info.mon_hp, hero_atk = core.status.hero.atk, mon_def = info.mon_def, turn = info.turn;
    // ------ 超大回合数强制使用二分算临界
    // 以避免1攻10e回合，2攻5e回合导致下述循环卡死问题
    if (turn >= 1e6) { // 100w回合以上强制二分计算临界
        return this._nextCriticals_useBinarySearch(enemy, info, number, x, y, floorId);
    }
    var list = [], pre = null;
    for (var t = turn - 1; t >= 1; t--) {
        var nextAtk = Math.ceil(mon_hp / t) + mon_def;
        // 装备提升比例的计算临界
        nextAtk = Math.ceil(nextAtk / core.getBuff('atk'));
        if (nextAtk <= hero_atk) break;
        if (nextAtk != pre) {
            var nextInfo = this.getDamageInfo(enemy, {"atk": nextAtk}, x, y, floorId);
            if (nextInfo == null || (typeof nextInfo == 'number')) break;
            list.push([nextAtk - hero_atk, Math.floor(info.damage - nextInfo.damage)]);
            if (nextInfo.damage <= 0 && !core.flags.enableNegativeDamage) break;
            pre = nextAtk;
        }
        if (list.length >= number)
            break;
    }
    if (list.length == 0) list.push([0, 0]);
    return list;
}

////// N防减伤计算 //////
enemys.prototype.getDefDamage = function (enemy, k, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    k = k || 1;
    var nowDamage = this._calDamage(enemy, null, x, y, floorId);
    var nextDamage = this._calDamage(enemy, {"def": core.status.hero.def + k}, x, y, floorId);
    if (nowDamage == null || nextDamage == null) return "???";
    return nowDamage - nextDamage;
}

enemys.prototype.getEnemyInfo = function (enemy, hero, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    return this.enemydata.getEnemyInfo(enemy, hero, x, y, floorId)
}

////// 获得战斗伤害信息（实际伤害计算函数） //////
enemys.prototype.getDamageInfo = function (enemy, hero, x, y, floorId) {
    // 移动到了脚本编辑 - getDamageInfo中
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    return this.enemydata.getDamageInfo(enemy, hero, x, y, floorId);
}

////// 获得在某个勇士属性下怪物伤害 //////
enemys.prototype._calDamage = function (enemy, hero, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];

    var info = this.getDamageInfo(enemy, hero, x, y, floorId);
    if (info == null) return null;
    if (typeof info == 'number') return info;
    return info.damage;
}

////// 更新怪物数据。已经不再使用，这里留空进行兼容。 //////
enemys.prototype.updateEnemys = function () {}

////// 获得当前楼层的怪物列表 //////
enemys.prototype.getCurrentEnemys = function (floorId) {
    floorId = floorId || core.status.floorId;
    var enemys = [], used = {};
    var mapBlocks = core.status.maps[floorId].blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (!mapBlocks[b].disable && mapBlocks[b].event.cls.indexOf('enemy') == 0) {
            this._getCurrentEnemys_addEnemy(mapBlocks[b].event.id, enemys, used, floorId);
        }
    }
    return this._getCurrentEnemys_sort(enemys);
}

enemys.prototype._getCurrentEnemys_getEnemy = function (enemyId) {
    var enemy = core.material.enemys[enemyId];
    if (!enemy) return null;

    // 检查displayIdInBook
    return core.material.enemys[enemy.displayIdInBook] || enemy;
}

enemys.prototype._getCurrentEnemys_addEnemy = function (enemyId, enemys, used, floorId) {
    var enemy = this._getCurrentEnemys_getEnemy(enemyId);
    if (enemy == null || used[enemy.id]) return;

    var enemyInfo = this.getEnemyInfo(enemy, null, null, null, floorId);
    var specialText = core.enemys.getSpecialText(enemy);
    if (specialText.length >= 3) specialText = "多属性...";
    else specialText = specialText.join("  ");

    var critical = this.nextCriticals(enemy, 1, null, null, floorId);
    if (critical.length > 0) critical = critical[0];

    var e = core.clone(enemy);
    for (var x in enemyInfo) {
        e[x] = enemyInfo[x];
    }
    e.specialText = specialText;
    e.damage = this.getDamage(enemy, null, null, floorId);
    e.critical = critical[0];
    e.criticalDamage = critical[1];
    e.defDamage = this.getDefDamage(enemy, 1, null, null, floorId);
    enemys.push(e);
    used[enemy.id] = true;
}

enemys.prototype._getCurrentEnemys_sort = function (enemys) {
    return enemys.sort(function (a, b) {
        if (a.damage == b.damage) {
            return a.money - b.money;
        }
        if (a.damage == null) {
            return 1;
        }
        if (b.damage == null) {
            return -1;
        }
        return a.damage - b.damage;
    });
}

enemys.prototype.hasEnemyLeft = function (enemyId, floorId) {
    if (floorId == null) floorId = core.status.floorId;
    if (floorId instanceof Array) {
        for (var i = 0; i < floorId.length; ++i) {
            if (core.hasEnemyLeft(enemyId, floorId[i]))
                return true;
        }
        return false;
    }
    return core.getCurrentEnemys(floorId).filter(function (enemy) {
        return enemyId == null || enemy.id == enemyId;
    }).length > 0;
}