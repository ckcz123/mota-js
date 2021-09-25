/// <reference path="../runtime.d.ts" />

"use strict";

function enemys() {
    this._init();
}

////// 初始化 //////
enemys.prototype._init = function () {
    this.enemys = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80;
    this.enemydata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.enemys;
    for (var enemyId in this.enemys) {
        this.enemys[enemyId].id = enemyId;
    }
    if (main.mode == 'play') {
        this.enemydata.hasSpecial = function (a, b) {
            return core.enemys.hasSpecial(a, b)
        };
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
    // 将所有怪物的各项属性映射到朝下的
    for (var id in enemys) {
        if (enemys[id].faceIds) {
            var downId = enemys[id].faceIds.down;
            if (downId != null && downId != id && enemys[downId]) {
                enemys[id] = {id: id};
                for (var property in enemys[downId]) {
                    if (property != 'id' && enemys[downId].hasOwnProperty(property)) {
                        (function (id, downId, property) {
                            Object.defineProperty(enemys[id], property, {
                                get: function () { return enemys[downId][property] },
                                set: function (v) { enemys[downId][property] = v },
                                enumerable: true
                            })
                        })(id, downId, property);
                    }
                } 
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

////// 获得所有特殊属性的颜色 //////
enemys.prototype.getSpecialColor = function (enemy) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (!enemy) return [];
    var special = enemy.special;
    var colors = [];

    var specials = this.getSpecials();
    if (specials) {
        for (var i = 0; i < specials.length; i++) {
            if (this.hasSpecial(special, specials[i][0]))
                colors.push(specials[i][3] || null);
        }
    }
    return colors;

}

////// 获得所有特殊属性的额外标记 //////
enemys.prototype.getSpecialFlag = function (enemy) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (!enemy) return [];
    var special = enemy.special;
    var flag = 0;

    var specials = this.getSpecials();
    if (specials) {
        for (var i = 0; i < specials.length; i++) {
            if (this.hasSpecial(special, specials[i][0]))
                flag |= (specials[i][4] || 0);
        }
    }
    return flag;
}

////// 获得每个特殊属性的说明 //////
enemys.prototype.getSpecialHint = function (enemy, special) {
    var specials = this.getSpecials();

    if (special == null) {
        if (specials == null) return [];
        var hints = [];
        for (var i = 0; i < specials.length; i++) {
            if (this.hasSpecial(enemy, specials[i][0]))
                hints.push("\r[" + core.arrayToRGBA(specials[i][3] || "#FF6A6A") + "]\\d" + this._calSpecialContent(enemy, specials[i][1]) +
                    "：\\d\r[]" + this._calSpecialContent(enemy, specials[i][2]));
        }
        return hints;
    }

    if (specials == null) return "";
    for (var i = 0; i < specials.length; i++) {
        if (special == specials[i][0])
            return "\r[#FF6A6A]\\d"+this._calSpecialContent(enemy, specials[i][1]) + "：\\d\r[]" + this._calSpecialContent(enemy, specials[i][2]);
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

////// 获得某个点上某个怪物的某项属性 //////
enemys.prototype.getEnemyValue = function (enemy, name, x, y, floorId) {
    floorId = floorId || core.status.floorId;
    if ((((flags.enemyOnPoint||{})[floorId]||{})[x+","+y]||{})[name] != null) {
        return flags.enemyOnPoint[floorId][x+","+y][name];
    }
    if (enemy == null) {
        var block = core.getBlock(x, y, floorId);
        if (block == null) return null;
        enemy = core.material.enemys[block.event.id];
    }
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (enemy == null) return null;
    return enemy[name];
}

////// 能否获胜 //////
enemys.prototype.canBattle = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = this.getDamage(enemy, x, y, floorId);
    return damage != null && damage < core.status.hero.hp;
}

enemys.prototype.getDamageString = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = this.getDamage(enemy, x, y, floorId);

    var color = '#000000';

    if (damage == null) {
        damage = "???";
        color = '#FF2222';
    }
    else {
        if (damage <= 0) color = '#11FF11';
        else if (damage < core.status.hero.hp / 3) color = '#FFFFFF';
        else if (damage < core.status.hero.hp * 2 / 3) color = '#FFFF00';
        else if (damage < core.status.hero.hp) color = '#FF9933';
        else color = '#FF2222';

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

    var specialCriticals = this._nextCriticals_special(enemy, number, x, y, floorId);
    if (specialCriticals != null) return specialCriticals;
    var info = this.getDamageInfo(enemy, null, x, y, floorId);
    if (info == null) { // 如果未破防...
        var overAtk = this._nextCriticals_overAtk(enemy, x, y, floorId);
        if (overAtk == null) return [];
        if (typeof overAtk[1] == 'number') return [[overAtk[0], -overAtk[1]]];
        info = overAtk[1];
        info.__over__ = true;
        info.__overAtk__ = overAtk[0];
    }

    if (typeof info == 'number') return [[0,0]];
    if (info.damage <= 0 && !core.flags.enableNegativeDamage) {
        return [[info.__overAtk__ || 0, 0]];
    }

    if (core.flags.useLoop) {
        if (core.status.hero.atk <= (main.criticalUseLoop || 1)) {
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

/// 未破防临界采用二分计算
enemys.prototype._nextCriticals_overAtk = function (enemy, x, y, floorId) {
    var calNext = function (currAtk, maxAtk) {
        var start = currAtk, end = maxAtk;
        if (start > end) return null;

        while (start < end) {
            var mid = Math.floor((start + end) / 2);
            if (mid - start > end - mid) mid--;
            var nextInfo = core.enemys.getDamageInfo(enemy, {"atk": mid}, x, y, floorId);
            if (nextInfo != null) end = mid;
            else start = mid + 1;
        }
        var nextInfo = core.enemys.getDamageInfo(enemy, {"atk": start}, x, y, floorId);
        return nextInfo == null ? null : [start - core.status.hero.atk, nextInfo];
    }
    return calNext(core.status.hero.atk + 1, 
        core.getEnemyValue(enemy, 'hp', x, y, floorId)  + core.getEnemyValue(enemy, 'def', x, y, floorId));
}

enemys.prototype._nextCriticals_special = function (enemy, number, x, y, floorId) {
    if (this.hasSpecial(enemy.special, 10) || this.hasSpecial(enemy.special, 3))
        return []; // 模仿or坚固临界
    return null;
}

enemys.prototype._nextCriticals_useLoop = function (enemy, info, number, x, y, floorId) {
    var mon_hp = info.mon_hp, hero_atk = core.status.hero.atk, mon_def = info.mon_def, pre = info.damage;
    var list = [];
    var start_atk = hero_atk;
    if (info.__over__) {
        start_atk += info.__overAtk__;
        list.push([info.__overAtk__, -info.damage]);
    }
    for (var atk = start_atk + 1; atk <= mon_hp + mon_def; atk++) {
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
    var start_atk = hero_atk;
    if (info.__over__) {
        start_atk += info.__overAtk__;
        list.push([info.__overAtk__, -info.damage]);
    }
    var calNext = function (currAtk, maxAtk) {
        var start = Math.floor(currAtk), end = Math.floor(maxAtk);
        if (start > end) return null;

        while (start < end) {
            var mid = Math.floor((start + end) / 2);
            if (mid - start > end - mid) mid--;
            var nextInfo = core.enemys.getDamageInfo(enemy, {"atk": mid}, x, y, floorId);
            if (nextInfo == null || (typeof nextInfo == 'number')) return null;
            if (pre > nextInfo.damage) end = mid;
            else start = mid + 1;
        }
        var nextInfo = core.enemys.getDamageInfo(enemy, {"atk": start}, x, y, floorId);
        return nextInfo == null || (typeof nextInfo == 'number') || nextInfo.damage >= pre ? null : [start, nextInfo.damage];
    }
    var currAtk = start_atk;
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
    var start_atk = hero_atk;
    if (info.__over__) {
        start_atk += info.__overAtk__;
        list.push([info.__overAtk__, -info.damage]);
    }
    for (var t = turn - 1; t >= 1; t--) {
        var nextAtk = Math.ceil(mon_hp / t) + mon_def;
        // 装备提升比例的计算临界
        nextAtk = Math.ceil(nextAtk / core.getBuff('atk'));
        if (nextAtk <= start_atk) break;
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
    var nowDamage = this._getDamage(enemy, null, x, y, floorId);
    var nextDamage = this._getDamage(enemy, {"def": core.status.hero.def + k}, x, y, floorId);
    if (nowDamage == null || nextDamage == null) return "???";
    return nowDamage - nextDamage;
}

enemys.prototype.getEnemyInfo = function (enemy, hero, x, y, floorId) {
    if (enemy == null) return null;
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    return this.enemydata.getEnemyInfo(enemy, hero, x, y, floorId)
}

////// 获得战斗伤害信息（实际伤害计算函数） //////
enemys.prototype.getDamageInfo = function (enemy, hero, x, y, floorId) {
    if (enemy == null) return null;
    // 移动到了脚本编辑 - getDamageInfo中
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    return this.enemydata.getDamageInfo(enemy, hero, x, y, floorId);
}

////// 获得在某个勇士属性下怪物伤害 //////
enemys.prototype.getDamage = function (enemy, x, y, floorId) {
    return this._getDamage(enemy, null, x, y, floorId);
}

enemys.prototype._getDamage = function (enemy, hero, x, y, floorId) {
    if (enemy == null) return null;
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];

    var info = this.getDamageInfo(enemy, hero, x, y, floorId);
    if (info == null) return null;
    if (typeof info == 'number') return info;
    return info.damage;
}

////// 获得当前楼层的怪物列表 //////
enemys.prototype.getCurrentEnemys = function (floorId) {
    floorId = floorId || core.status.floorId;
    var enemys = [], used = {};
    core.extractBlocks(floorId);
    core.status.maps[floorId].blocks.forEach(function (block) {
        if (!block.disable && block.event.cls.indexOf('enemy') == 0) {
            this._getCurrentEnemys_addEnemy(block.event.id, enemys, used, block.x, block.y, floorId);
        }
    }, this);
    return this._getCurrentEnemys_sort(enemys);
}

enemys.prototype._getCurrentEnemys_getEnemy = function (enemyId) {
    var enemy = core.material.enemys[enemyId];
    if (!enemy) return null;

    // 检查朝向；displayIdInBook
    return core.material.enemys[enemy.displayIdInBook] || core.material.enemys[(enemy.faceIds || {}).down] ||  enemy;
}

enemys.prototype._getCurrentEnemys_addEnemy = function (enemyId, enemys, used, x, y, floorId) {
    var enemy = this._getCurrentEnemys_getEnemy(enemyId);
    if (enemy == null) return;

    var id = enemy.id;

    var enemyInfo = this.getEnemyInfo(enemy, null, null, null, floorId);
    var locEnemyInfo = this.getEnemyInfo(enemy, null, x, y, floorId);

    if (!core.flags.enableEnemyPoint ||
        (locEnemyInfo.atk == enemyInfo.atk && locEnemyInfo.def == enemyInfo.def && locEnemyInfo.hp == enemyInfo.hp)) {
        x = null;
        y = null;
    } else {
        // 检查enemys里面是否使用了存在的内容
        for (var i = 0; i < enemys.length; ++i) {
            var one = enemys[i];
            if (id == one.id && one.locs != null &&
                locEnemyInfo.atk == one.atk && locEnemyInfo.def == one.def && locEnemyInfo.hp == one.hp) {
                one.locs.push([x, y]);
                return;
            }
        }
        enemyInfo = locEnemyInfo;
    }
    var id = enemy.id + ":" + x + ":" + y;
    if (used[id]) return;
    used[id] = true;

    var specialText = core.enemys.getSpecialText(enemy);
    var specialColor = core.enemys.getSpecialColor(enemy);

    var critical = this.nextCriticals(enemy, 1, x, y, floorId);
    if (critical.length > 0) critical = critical[0];

    var e = core.clone(enemy);
    for (var v in enemyInfo) {
        e[v] = enemyInfo[v];
    }
    if (x != null && y != null) {
        e.locs = [[x, y]];
    }
    e.name = core.getEnemyValue(enemy, 'name', x, y, floorId);
    e.specialText = specialText;
    e.specialColor = specialColor;
    e.damage = this.getDamage(enemy, x, y, floorId);
    e.critical = critical[0];
    e.criticalDamage = critical[1];
    e.defDamage = this._getCurrentEnemys_addEnemy_defDamage(enemy, x, y, floorId);
    enemys.push(e);
}

enemys.prototype._getCurrentEnemys_addEnemy_defDamage = function (enemy, x, y, floorId) {
    var ratio = core.status.maps[floorId || core.status.floorId].ratio || 1;
    return this.getDefDamage(enemy, ratio, x, y, floorId);
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
    if (!(floorId instanceof Array)) floorId = [floorId];
    var enemyMap = {};
    if (enemyId instanceof Array) enemyId.forEach(function(v) { enemyMap[v] = true;});
    else if (enemyId) enemyMap[enemyId] = true;
    else enemyMap = null;
    for (var i = 0; i < floorId.length; i++) {
        core.extractBlocks(floorId[i]);
        var mapBlocks = core.status.maps[floorId[i]].blocks;
        for (var b = 0; b < mapBlocks.length; b++) {
            if (!mapBlocks[b].disable && mapBlocks[b].event.cls.indexOf('enemy') === 0) {
                if (enemyMap === null || enemyMap[core.getFaceDownId(mapBlocks[b])]) return true;
            }
        }
    }
    return false;
}
