/// <reference path="../runtime.d.ts" />

"use strict";

function items() {
    this._init();
}

////// 初始化 //////
items.prototype._init = function () {
    this.items = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a;
    for (var itemId in this.items) {
        this.items[itemId].id = itemId;
    }
}

////// 获得所有道具 //////
items.prototype.getItems = function () {
    var items = core.clone(this.items);
    var equipInfo = core.getFlag('equipInfo');
    if (equipInfo) {
        for (var id in equipInfo) {
            items[id].equip = core.clone(equipInfo[id]);
        }
    }
    return items;
}

////// “即捡即用类”道具的使用效果 //////
items.prototype.getItemEffect = function (itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        var curr_hp = core.status.hero.hp;
        var itemEffect = core.material.items[itemId].itemEffect;
        if (itemEffect) {
            try {
                for (var i = 0; i < itemNum; ++i)
                    eval(itemEffect);
            }
            catch (e) {
                main.log(e);
            }
        }
        core.status.hero.statistics.hp += core.status.hero.hp - curr_hp;

        var useItemEvent = core.material.items[itemId].useItemEvent;
        if (useItemEvent) {
            try {
                core.insertAction(useItemEvent);
            }
            catch (e) {
                main.log(e);
            }
        }
        core.updateStatusBar();
    }
    else {
        core.addItem(itemId, itemNum);
    }
}

////// “即捡即用类”道具的文字提示 //////
items.prototype.getItemEffectTip = function (itemId) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        var itemEffectTip = core.material.items[itemId].itemEffectTip;
        if (itemEffectTip) {
            try {
                return core.replaceText(itemEffectTip) || "";
            } catch (e) {
                main.log(e);
                return "";
            }
        }
    }
    return "";
}

////// 使用道具 //////
items.prototype.useItem = function (itemId, noRoute, callback) {
    if (!this.canUseItem(itemId)) {
        if (callback) callback();
        return;
    }
    // 执行道具效果
    this._useItemEffect(itemId);
    // 执行完毕
    this._afterUseItem(itemId);
    // 记录路线
    if (!noRoute) core.status.route.push("item:" + itemId);
    if (callback) callback();
}

items.prototype._useItemEffect = function (itemId) {
    var useItemEffect = core.material.items[itemId].useItemEffect;
    if (useItemEffect) {
        try {
            eval(useItemEffect);
        }
        catch (e) {
            main.log(e);
        }
    }
    var useItemEvent = core.material.items[itemId].useItemEvent;
    if (useItemEvent) {
        try {
            core.insertAction(useItemEvent);
        }
        catch (e) {
            main.log(e);
        }
    }
}

items.prototype._afterUseItem = function (itemId) {
    // 道具使用完毕：删除
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'tools')
        core.status.hero.items[itemCls][itemId]--;
    if (core.status.hero.items[itemCls][itemId] <= 0)
        delete core.status.hero.items[itemCls][itemId];
    core.updateStatusBar();
}

////// 当前能否使用道具 //////
items.prototype.canUseItem = function (itemId) {
    // 没有道具
    if (!core.hasItem(itemId)) return false;
    
    var canUseItemEffect = core.material.items[itemId].canUseItemEffect;
    if (canUseItemEffect) {
        try {
            return eval(canUseItemEffect);
        }
        catch (e) {
            main.log(e);
            return false;
        }
    }
}

////// 获得某个物品的个数 //////
items.prototype.itemCount = function (itemId) {
    if (!core.material.items[itemId] || !core.isPlaying()) return 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == "items") return 0;
    return core.status.hero.items[itemCls][itemId] || 0;
}

////// 是否存在某个物品 //////
items.prototype.hasItem = function (itemId) {
    return this.itemCount(itemId) > 0;
}

////// 是否装备某件装备 //////
items.prototype.hasEquip = function (itemId) {
    if (!(core.material.items[itemId] || {}).equip || !core.isPlaying()) return null;

    for (var i in core.status.hero.equipment)
        if (core.status.hero.equipment[i] == itemId)
            return true;
    return false
}

////// 获得某个装备类型的当前装备 //////
items.prototype.getEquip = function (equipType) {
    return core.status.hero.equipment[equipType] || null;
}

////// 设置某个物品的个数 //////
items.prototype.setItem = function (itemId, itemNum) {
    itemNum = itemNum || 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'items') return;

    core.status.hero.items[itemCls][itemId] = itemNum;
    if (core.status.hero.items[itemCls][itemId] <= 0) {
        delete core.status.hero.items[itemCls][itemId];
    }
    core.updateStatusBar();
}

////// 增加某个物品的个数 //////
items.prototype.addItem = function (itemId, itemNum) {
    if (itemNum == null) itemNum = 1;
    var itemData = core.material.items[itemId];
    var itemCls = itemData.cls;
    if (itemCls == 'items') return;
    if (core.status.hero.items[itemCls][itemId] == null) {
        core.status.hero.items[itemCls][itemId] = 0;
    }
    core.status.hero.items[itemCls][itemId] += itemNum;
    if (core.status.hero.items[itemCls][itemId] <= 0) {
        delete core.status.hero.items[itemCls][itemId];
    }
    // 永久道具只能有一个
    if (itemCls == 'constants' && core.status.hero.items[itemCls][itemId] > 1)
        core.status.hero.items[itemCls][itemId] = 1;
    core.updateStatusBar();
}

////// 删除某个物品 //////
items.prototype.removeItem = function (itemId, itemNum) {
    if (itemNum == null) itemNum = 1;
    if (!core.hasItem(itemId)) return false;
    var itemCls = core.material.items[itemId].cls;
    core.status.hero.items[itemCls][itemId] -= itemNum;
    if (core.status.hero.items[itemCls][itemId] <= 0) {
        delete core.status.hero.items[itemCls][itemId];
    }
    core.updateStatusBar();
    return true;
}

// ---------- 装备相关 ------------ //

items.prototype.getEquipTypeByName = function (name) {
    var names = core.status.globalAttribute.equipName;
    var types = [];
    for (var i = 0; i < names.length; ++i) {
        if (names[i] === name) {
            types.push(i);
            if (!core.status.hero.equipment[i]) return i;
        }
    }
    return types.length == 1 ? types[0] : -1;
}

items.prototype.getEquipTypeById = function (equipId) {
    var type = core.material.items[equipId].equip.type;
    if (typeof type == 'string')
        type = this.getEquipTypeByName(type);
    return type;
}

// 当前能否撞上某装备
items.prototype.canEquip = function (equipId, hint) {
    // 装备是否合法
    var equip = core.material.items[equipId] || {};
    if (!equip.equip) {
        if (hint) {
            core.playSound('操作失败');
            core.drawTip("不合法的装备！",equipId);
        }
        return false;
    }

    // 是否拥有该装备
    if (!core.hasItem(equipId) && !core.hasEquip(equipId)) {
        if (hint) {
            core.playSound('操作失败');
            core.drawTip("你当前没有" + equip.name + "，无法换装",equipId);
        }
        return false;
    }

    // 可装备条件
    var canUseItemEffect = core.material.items[equipId].canUseItemEffect;
    if (canUseItemEffect) {
        try {
            if (!eval(canUseItemEffect)) {
                if (hint) {
                    core.playSound('操作失败');
                    core.drawTip("当前不可换上" + equip.name,equipId);
                }
                return false;
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    return true;
}

////// 换上 //////
items.prototype.loadEquip = function (equipId, callback) {
    if (!this.canEquip(equipId, true)) {
        if (callback) callback();
        return;
    }

    var loadEquip = core.material.items[equipId] || {};
    var type = this.getEquipTypeById(equipId);
    if (type < 0) {
        core.playSound('操作失败');
        core.drawTip("当前没有" + loadEquip.equip.type + "的空位！",equipId);
        if (callback) callback();
        return;
    }

    this._realLoadEquip(type, equipId, core.status.hero.equipment[type], callback);
}

////// 卸下 //////
items.prototype.unloadEquip = function (equipType, callback) {
    var unloadEquipId = core.status.hero.equipment[equipType];
    if (!unloadEquipId) {
        if (callback) callback();
        return;
    }

    this._realLoadEquip(equipType, null, unloadEquipId, callback);
}

items.prototype.compareEquipment = function (compareEquipId, beComparedEquipId) {
    var result = {"value": {}, "percentage": {}};
    var first = core.material.items[compareEquipId], second = core.material.items[beComparedEquipId];
    for (var one in result) {
        for (var name in core.status.hero) {
            if (typeof core.status.hero[name] == 'number') {
                var ans = 0;
                if (first) ans += ((first.equip || {})[one] || {})[name] || 0;
                if (second) ans -= ((second.equip || {})[one] || {})[name] || 0;
                if (ans != 0) result[one][name] = ans;
            }
        }
    }
    return result;
}

////// 实际换装的效果 //////
items.prototype._loadEquipEffect = function (equipId, unloadEquipId) {
    // 比较能力值
    var result = core.compareEquipment(equipId, unloadEquipId);

    for (var name in result.percentage)
        core.addBuff(name, result.percentage[name] / 100);

    for (var name in result.value)
        core.status.hero[name] += result.value[name];
}

items.prototype._realLoadEquip = function (type, loadId, unloadId, callback) {
    var loadEquip = core.material.items[loadId] || {}, unloadEquip = core.material.items[unloadId] || {};

    // --- 音效
    this._realLoadEquip_playSound();

    // --- 实际换装
    this._loadEquipEffect(loadId, unloadId);

    // --- 加减
    if (loadId) core.removeItem(loadId);
    if (unloadId) core.addItem(unloadId);
    core.status.hero.equipment[type] = loadId || null;

    // --- 提示
    if (loadId) core.drawTip("已装备上" + loadEquip.name, loadId);
    else if (unloadId) core.drawTip("已卸下" + unloadEquip.name, unloadId);

    if (callback) callback();
}

items.prototype._realLoadEquip_playSound = function () {
    if (core.hasFlag("__quickLoadEquip__")) return;
    core.stopSound();
    core.playSound('穿脱装备');
}

////// 保存装备 //////
items.prototype.quickSaveEquip = function (index) {
    var saveEquips = core.getFlag("saveEquips", []);
    saveEquips[index] = core.clone(core.status.hero.equipment);
    core.setFlag("saveEquips", saveEquips);
    core.status.route.push("saveEquip:"+index);
    core.drawTip("已保存" + index + "号套装",'equipbox');
}

////// 读取装备 //////
items.prototype.quickLoadEquip = function (index) {
    var current = core.getFlag("saveEquips", [])[index];
    if (!current) {
        core.playSound('操作失败');
        core.drawTip(index + "号套装不存在",'equipbox');
        return;
    }
    // 检查所有的装备
    var equipSize = core.status.globalAttribute.equipName.length;
    for (var i = 0; i < equipSize; i++) {
        var v = current[i];
        if (v && !this.canEquip(v, true))
            return;
    }
    core.status.route.push("loadEquip:"+index);
    core.setFlag("__quickLoadEquip__", true);
    // 快速换装
    var toEquip = [];
    for (var i = 0; i < equipSize; i++) {
        var now = core.status.hero.equipment[i];
        // --- 只考虑diff的装备
        var to = current[i];
        if (now != to) {
            toEquip.push(to || null);
            if (now) {
                this.unloadEquip(i);
            }
        }
    }
    for (var i in toEquip) {
        var to = toEquip[i];
        if (to) {
            this.loadEquip(to);
        }
    }
    core.removeFlag("__quickLoadEquip__");
    this._realLoadEquip_playSound();

    core.drawTip("成功换上" + index + "号套装",'equipbox');
}

////// 设置装备属性 //////
items.prototype.setEquip = function (equipId, valueType, name, value, operator, prefix) {
    var equip = core.material.items[equipId];
    if (!equip || equip.cls != 'equips') return; 
    var equipInfo = equip.equip || {};
    if (!equipInfo[valueType]) equipInfo[valueType] = {};
    var toEquipInfo = core.clone(equipInfo);
    toEquipInfo[valueType][name] = core.events._updateValueByOperator(core.calValue(value, prefix), equipInfo[valueType][name], operator);
    // 如果是穿上状态，则还需要直接修改当前数值
    if (core.hasEquip(equipId)) {
        // 设置一个临时装备，然后模拟换装操作
        var tempId = 'temp:' + equipId;
        core.material.items[tempId] = {'cls': 'equips', 'equip': core.clone(toEquipInfo)};
        this._loadEquipEffect(tempId, equipId);
        delete core.material.items[tempId];
        core.updateStatusBar();
    }
    equip.equip = core.clone(toEquipInfo);
    flags.equipInfo = flags.equipInfo || {};
    flags.equipInfo[equipId] = core.clone(toEquipInfo);
}
