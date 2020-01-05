"use strict";

function items() {
    this._init();
}

////// 初始化 //////
items.prototype._init = function () {
    this.items = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.items;
    this.itemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.itemEffect;
    this.itemEffectTip = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.itemEffectTip;
    this.useItemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.useItemEffect;
    this.canUseItemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.canUseItemEffect;
    if (!items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.equipCondition)
        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.equipCondition = {};
    if (!items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.useItemEvent)
        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.useItemEvent = {};
    this.equipCondition = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.equipCondition;
    this.useItemEvent = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.useItemEvent;
}

////// 获得所有道具 //////
items.prototype.getItems = function () {
    return core.clone(this.items);
}

items.prototype._resetItems = function () {
    // 只有运行时才能执行此函数！
    if (main.mode != 'play') return;

    // 根据flag来对道具进行修改
    if (core.flags.bigKeyIsBox) {
        core.material.items.bigKey.cls = 'items';
        core.material.items.bigKey.name = '钥匙盒';
    }
    if (core.flags.pickaxeFourDirections)
        core.material.items.pickaxe.text = "可以破坏勇士四周的墙";
    if (core.flags.bombFourDirections)
        core.material.items.bomb.text = "可以炸掉勇士四周的怪物";
    if (core.flags.snowFourDirections)
        core.material.items.snow.text = "可以将四周的熔岩变成平地";
    if (core.flags.equipment) {
        core.material.items.sword1.cls = 'equips';
        core.material.items.sword2.cls = 'equips';
        core.material.items.sword3.cls = 'equips';
        core.material.items.sword4.cls = 'equips';
        core.material.items.sword5.cls = 'equips';
        core.material.items.shield1.cls = 'equips';
        core.material.items.shield2.cls = 'equips';
        core.material.items.shield3.cls = 'equips';
        core.material.items.shield4.cls = 'equips';
        core.material.items.shield5.cls = 'equips';
    }
}

////// “即捡即用类”道具的使用效果 //////
items.prototype.getItemEffect = function (itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        var ratio = parseInt(core.status.thisMap.item_ratio) || 1;
        var curr_hp = core.status.hero.hp;
        if (itemId in this.itemEffect) {
            try {
                for (var i = 0; i < itemNum; ++i)
                    eval(this.itemEffect[itemId]);
            }
            catch (e) {
                main.log(e);
            }
        }
        core.status.hero.statistics.hp += core.status.hero.hp - curr_hp;

        if (this.useItemEvent[itemId]) {
            try {
                core.insertAction(this.useItemEvent[itemId]);
            }
            catch (e) {
                main.log(e);
            }
        }
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
        var ratio = parseInt(core.status.thisMap.item_ratio) || 1;
        if (itemId in this.itemEffectTip) {
            try {
                return eval(this.itemEffectTip[itemId]) || "";
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
    if (itemId in this.useItemEffect) {
        try {
            var ratio = parseInt(core.status.thisMap.item_ratio) || 1;
            eval(this.useItemEffect[itemId]);
        }
        catch (e) {
            main.log(e);
        }
    }
    if (this.useItemEvent[itemId]) {
        try {
            core.insertAction(this.useItemEvent[itemId]);
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

    if (!core.status.event.id)
        core.status.event.ui = null;
    core.updateStatusBar();
}

////// 当前能否使用道具 //////
items.prototype.canUseItem = function (itemId) {
    // 没有道具
    if (!core.hasItem(itemId)) return false;

    var able = false;
    if (itemId in this.canUseItemEffect) {
        try {
            able = eval(this.canUseItemEffect[itemId]);
        }
        catch (e) {
            main.log(e);
        }
    }
    if (!able) {
        core.status.event.data = null;
        core.status.event.ui = null;
    }

    return able;
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
        if (itemCls != 'keys') delete core.status.hero.items[itemCls][itemId];
        else core.status.hero.items[itemCls][itemId] = 0;
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
        if (itemCls != 'keys') delete core.status.hero.items[itemCls][itemId];
        else core.status.hero.items[itemCls][itemId] = 0;
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
        if (itemCls != 'keys') delete core.status.hero.items[itemCls][itemId];
        else core.status.hero.items[itemCls][itemId] = 0;
    }
    core.updateStatusBar();
    return true;
}

// ---------- 装备相关 ------------ //

items.prototype.getEquipTypeByName = function (name) {
    var names = core.status.globalAttribute.equipName;
    for (var i = 0; i < names.length; ++i) {
        if (names[i] === name && !core.status.hero.equipment[i]) {
            return i;
        }
    }
    return -1;
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
        if (hint) core.drawTip("不合法的装备！");
        return false;
    }

    // 是否拥有该装备
    if (!core.hasItem(equipId) && !core.hasEquip(equipId)) {
        if (hint) core.drawTip("你当前没有" + equip.name + "，无法换装");
        return false;
    }

    // 可装备条件
    var condition = this.equipCondition[equipId];
    if (condition) {
        try {
            if (!eval(condition)) {
                if (hint) core.drawTip("当前不可换上" + equip.name);
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
        core.drawTip("当前没有" + loadEquip.equip.type + "的空位！");
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
    var result = {};
    var first = core.material.items[compareEquipId], second = core.material.items[beComparedEquipId];
    for (var name in core.status.hero) {
        if (typeof core.status.hero[name] == 'number') {
            var ans = 0;
            if (first) ans += (first.equip || {})[name] || 0;
            if (second) ans -= (second.equip || {})[name] || 0;
            if (ans != 0) result[name] = ans;
        }
    }
    return result;
}

////// 实际换装的效果 //////
items.prototype._loadEquipEffect = function (equipId, unloadEquipId, isPercentage) {
    // 比较能力值
    var result = core.compareEquipment(equipId, unloadEquipId);

    if (isPercentage) {
        for (var name in result)
            core.addBuff(name, result[name] / 100);
    }
    else {
        for (var name in result)
            core.status.hero[name] += result[name];
    }
}

items.prototype._realLoadEquip = function (type, loadId, unloadId, callback) {
    var loadEquip = core.material.items[loadId] || {}, unloadEquip = core.material.items[unloadId] || {};
    loadEquip.equip = loadEquip.equip || {};
    unloadEquip.equip = unloadEquip.equip || {}

    var loadPercentage = loadEquip.equip.percentage, unloadPercentage = unloadEquip.equip.percentage;

    if (loadId && unloadId && (loadPercentage || false) != (unloadPercentage || false)) {
        this.unloadEquip(type);
        this.loadEquip(loadId);
        if (callback) callback();
        return;
    }

    // --- 音效
    this._realLoadEquip_playSound();

    // --- 实际换装
    this._loadEquipEffect(loadId, unloadId, loadPercentage == null ? unloadPercentage : loadPercentage);

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
    core.playSound('equip.mp3');
}

////// 保存装备 //////
items.prototype.quickSaveEquip = function (index) {
    var saveEquips = core.getFlag("saveEquips", []);
    saveEquips[index] = core.clone(core.status.hero.equipment);
    core.setFlag("saveEquips", saveEquips);
    core.drawTip("已保存" + index + "号套装");
}

////// 读取装备 //////
items.prototype.quickLoadEquip = function (index) {
    var current = core.getFlag("saveEquips", [])[index];
    if (!current) {
        core.drawTip(index + "号套装不存在");
        return;
    }
    // 检查所有的装备
    var equipSize = core.status.globalAttribute.equipName.length;
    for (var i = 0; i < equipSize; i++) {
        var v = current[i];
        if (v && !this.canEquip(v, true))
            return;
    }
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
                core.status.route.push("unEquip:" + i);
            }
        }
    }
    for (var i in toEquip) {
        var to = toEquip[i];
        if (to) {
            this.loadEquip(to);
            core.status.route.push("equip:" + to);
        }
    }
    core.removeFlag("__quickLoadEquip__");
    this._realLoadEquip_playSound();

    core.drawTip("成功换上" + index + "号套装");
}

////// 获得装备直接增加的属性数据 //////
items.prototype.getEquippedStatus = function (name) {
    var value = 0;
    core.status.hero.equipment.forEach(function (v) {
        if (!v || !(core.material.items[v] || {}).equip) return;
        if (core.material.items[v].equip.percentage) return;
        value += core.material.items[v].equip[name] || 0;
    });
    return value;
}
