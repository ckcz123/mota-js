"use strict";

function enemys() {
    this.init();
}

////// 初始化 //////
enemys.prototype.init = function () {
    this.enemys = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80;
    this.enemydata = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.enemys;
    if (main.mode=='play') {
        this.enemydata.hasSpecial = function (a, b) {return core.enemys.hasSpecial(a, b)};
        for (var enemyId in this.enemys) {
            this.enemys[enemyId].id = enemyId;
        }
    }
}

////// 获得一个或所有怪物数据 //////
enemys.prototype.getEnemys = function (enemyId) {
    if (!core.isset(enemyId)) {
        return this.enemys;
    }
    return this.enemys[enemyId];
}

////// 判断是否含有某特殊属性 //////
enemys.prototype.hasSpecial = function (special, test) {

    if (!core.isset(special)) return false;

    if (special instanceof Array) {
        return special.indexOf(test)>=0;
    }

    if (typeof special == 'number') {
        return special!=0 && (special%100==test||this.hasSpecial(parseInt(special/100), test));
    }

    if (typeof special == 'string') {
        return this.hasSpecial(core.material.enemys[special], test);
    }

    if (core.isset(special.special)) {
        return this.hasSpecial(special.special, test);
    }

    return false;
}

enemys.prototype.getSpecials = function () {
    return this.enemydata.getSpecials();
}

enemys.prototype.calContent = function (enemy, content) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (typeof content == 'string') return content;
    if (content instanceof Function) {
        return content(enemy);
    }
    return "";
}

////// 获得所有特殊属性的名称 //////
enemys.prototype.getSpecialText = function (enemy) {
    // 移动到了脚本编辑 - getSpecials中

    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    if (!core.isset(enemy)) return [];
    var special = enemy.special;
    var text = [];

    var specials=this.getSpecials();
    if (core.isset(specials)) {
        for (var i=0;i<specials.length;i++) {
            if (this.hasSpecial(special, specials[i][0]))
                text.push(this.calContent(enemy, specials[i][1]));
        }
    }
    return text;
}

////// 获得每个特殊属性的说明 //////
enemys.prototype.getSpecialHint = function (enemy, special) {
    // 移动到了脚本编辑 - getSpecials中

    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var specials=this.getSpecials();

    if (!core.isset(special)) {
        if (!core.isset(specials)) return [];
        var hints = [];
        for (var i=0;i<specials.length;i++) {
            if (this.hasSpecial(enemy, specials[i][0]))
                hints.push(this.calContent(enemy, specials[i][1])+"："+this.calContent(enemy, specials[i][2]));
        }
        return hints;
    }

    if (!core.isset(specials)) return "";
    for (var i=0;i<specials.length;i++) {
        if (special == specials[i][0])
            return this.calContent(enemy, specials[i][1])+"："+this.calContent(enemy, specials[i][2]);
    }
    return "";
}

////// 能否获胜 //////
enemys.prototype.canBattle = function (enemyId, x, y, floorId) {
    var damage = this.getDamage(enemyId, x, y, floorId);
    return damage != null && damage < core.status.hero.hp;
}

////// 获得某个怪物的伤害 //////
enemys.prototype.getDamage = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = this.calDamage(enemy, core.status.hero.hp, core.status.hero.atk, core.status.hero.def, core.status.hero.mdef, x, y, floorId);
    if (damage == null) return null;
    return damage + this.getExtraDamage(enemy);
}

////// 获得某个怪物的额外伤害 //////
enemys.prototype.getExtraDamage = function (enemy) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var extra_damage = 0;
    if (this.hasSpecial(enemy.special, 17)) { // 仇恨
        extra_damage += core.getFlag('hatred', 0);
    }
    if (this.hasSpecial(enemy.special, 22)) { // 固伤
        extra_damage += enemy.damage||0;
    }
    return extra_damage;
}

enemys.prototype.getDamageString = function (enemy, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    var damage = core.enemys.getDamage(enemy, x, y, floorId);

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

    var useTurn = !core.flags.useLoop;

    number = number||1;

    if (this.hasSpecial(enemy.special, 3)) {
        if (core.status.hero.atk<=enemy.def) {
            return [[enemy.def+1-core.status.hero.atk,'?']];
        }
        return [];
    }

    // 坚固、模仿怪物没有临界！
    if (this.hasSpecial(enemy.special, 10)) return [];
    var info = this.getDamageInfo(enemy, core.status.hero.hp, core.status.hero.atk, core.status.hero.def, core.status.hero.mdef, x, y, floorId);

    if (info == null) {
        if (core.status.hero.atk<=enemy.def) {
            return [[enemy.def+1-core.status.hero.atk,'?']];
        }
        return [];
    }

    // getDamageInfo直接返回数字
    if (typeof info == 'number') {
        return [[0,0]];
    }

    if (info.damage<=0 && !core.flags.enableNegativeDamage) {
        return [[0,0]];
    }

    var list = [], pre = null;
    var mon_hp = info.mon_hp, hero_atk = core.status.hero.atk, mon_def = enemy.def, turn = info.turn;

    if (useTurn) { // 回合数计算法
        for (var t = turn-1;t>=1;t--) {
            var nextAtk = Math.ceil(mon_hp/t) + mon_def;
            // 装备提升比例的计算临界
            nextAtk = Math.ceil(nextAtk / core.getFlag('equip_atk_buff', 1));
            if (nextAtk<=hero_atk) break;
            if (nextAtk!=pre) {
                var nextInfo = this.getDamageInfo(enemy, core.status.hero.hp, nextAtk, core.status.hero.def, core.status.hero.mdef, x, y, floorId);
                if (nextInfo==null || (typeof nextInfo == 'number')) break;
                list.push([nextAtk-hero_atk,Math.floor(info.damage-nextInfo.damage)]);
                if (nextInfo.damage<=0 && !core.flags.enableNegativeDamage) break;
                pre = nextAtk;
            }
            if (list.length>=number)
                break;
        }
    }
    else { // 暴力for循环法

        // V2.5.3以后，大数据改为二分法进行计算
        var LOOP_MAX_VALUE = 1;
        pre = info.damage;
        if (hero_atk <= LOOP_MAX_VALUE) { // 循环法
            for (var atk=hero_atk+1;atk<=mon_hp+mon_def;atk++) {
                var nextInfo = this.getDamageInfo(enemy, core.status.hero.hp, atk, core.status.hero.def, core.status.hero.mdef, x, y, floorId);
                if (nextInfo==null || (typeof nextInfo == 'number')) break;
                if (pre>nextInfo.damage) {
                    pre = nextInfo.damage;
                    list.push([atk-hero_atk, info.damage-nextInfo.damage]);
                    if (nextInfo.damage<=0 && !core.flags.enableNegativeDamage) break;
                    if (list.length>=number) break;
                }
            }
        }
        else { // 二分法算临界
            var calNext = function (currAtk, maxAtk) {
                var start = Math.floor(currAtk), end = Math.floor(maxAtk);
                if (start>end) return null;

                while (start<end) {
                    var mid = Math.floor((start+end)/2);
                    var nextInfo = core.enemys.getDamageInfo(enemy, core.status.hero.hp, mid, core.status.hero.def, core.status.hero.mdef, x, y, floorId);
                    if (nextInfo == null || (typeof nextInfo == 'number')) return null;
                    if (pre>nextInfo.damage) end = mid;
                    else start = mid+1;
                }
                var nextInfo = core.enemys.getDamageInfo(enemy, core.status.hero.hp, start, core.status.hero.def, core.status.hero.mdef, x, y, floorId);
                return nextInfo==null||(typeof nextInfo == 'number')||nextInfo.damage>=pre?null:[start,nextInfo.damage];
            }
            var currAtk = hero_atk;
            while (true) {
                var next = calNext(currAtk+1, mon_hp+mon_def, pre);
                if (next == null) break;
                currAtk = next[0];
                pre = next[1];
                list.push([currAtk-hero_atk, info.damage-pre]);
                if (pre<=0 && !core.flags.enableNegativeDamage) break;
                if (list.length>=number) break;
            }
        }
    }
    if (list.length==0) list.push([0,0]);
    return list;
}

////// N防减伤计算 //////
enemys.prototype.getDefDamage = function (enemy, k, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    k = k || 1;
    var nowDamage = this.calDamage(enemy, core.status.hero.hp, core.status.hero.atk, core.status.hero.def, core.status.hero.mdef, x, y, floorId);
    var nextDamage = this.calDamage(enemy, core.status.hero.hp, core.status.hero.atk, core.status.hero.def + k, core.status.hero.mdef, x, y, floorId);
    if (nowDamage == null || nextDamage ==null) return "???";
    return nowDamage - nextDamage;
}

enemys.prototype.getEnemyInfo = function (enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    return this.enemydata.getEnemyInfo(enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId)
}

////// 获得战斗伤害信息（实际伤害计算函数） //////
enemys.prototype.getDamageInfo = function(enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId) {
    // 移动到了脚本编辑 - getDamageInfo中
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];
    return this.enemydata.getDamageInfo(enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId);
}

////// 获得在某个勇士属性下怪物伤害 //////
enemys.prototype.calDamage = function (enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId) {
    if (typeof enemy == 'string') enemy = core.material.enemys[enemy];

    var info = this.getDamageInfo(enemy, hero_hp, hero_atk, hero_def, hero_mdef, x, y, floorId);
    if (info == null) return null;
    if (typeof info == 'number') return info;
    return info.damage;
}

////// 更新怪物数据 //////
enemys.prototype.updateEnemys = function () {
    return this.enemydata.updateEnemys();
}

////// 获得当前楼层的怪物列表 //////
enemys.prototype.getCurrentEnemys = function (floorId) {
    floorId=floorId||core.status.floorId;
    var enemys = [];
    var used = {};
    var mapBlocks = core.status.maps[floorId].blocks;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (core.isset(mapBlocks[b].event) && !mapBlocks[b].disable
            && mapBlocks[b].event.cls.indexOf('enemy')==0) {
            var enemyId = mapBlocks[b].event.id;

            var enemy = core.material.enemys[enemyId];
            if (!core.isset(enemy)) continue;

            // 检查displayIdInBook
            var tmpId = enemy.displayIdInBook;
            if (core.isset(core.material.enemys[tmpId])) {
                enemyId = tmpId;
                enemy = core.material.enemys[tmpId];
            }
            if (core.isset(used[enemyId])) continue;

            var mon_hp = enemy.hp, mon_atk = enemy.atk, mon_def = enemy.def;
            var hero_atk = core.status.hero.atk, hero_def = core.status.hero.def, hero_mdef = core.status.hero.mdef;

            hero_atk = Math.floor(core.getFlag('equip_atk_buff',1)*hero_atk);
            hero_def = Math.floor(core.getFlag('equip_def_buff',1)*hero_def);
            hero_mdef = Math.floor(core.getFlag('equip_mdef_buff',1)*hero_mdef);

            var enemyInfo = this.getEnemyInfo(enemy, core.status.hero.hp, hero_atk, hero_def, hero_mdef, null, null, floorId);

            var specialText = core.enemys.getSpecialText(enemyId);
            if (specialText.length>=3) specialText = "多属性...";
            else specialText = specialText.join("  ");

            var critical = this.nextCriticals(enemyId, 1, null, null, floorId);
            if (critical.length>0) critical=critical[0];

            var e = core.clone(enemy);
            for (var x in enemyInfo) {
                e[x] = enemyInfo[x];
            }
            e.id = enemyId;
            e.specialText = specialText;
            e.damage = this.getDamage(enemyId, null, null, floorId);
            e.critical = critical[0];
            e.criticalDamage = critical[1];
            e.defDamage = this.getDefDamage(enemyId,1,null,null,floorId);
            enemys.push(e);
            used[enemyId] = true;
        }
    }

    enemys.sort(function (a, b) {
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
    return enemys;
}