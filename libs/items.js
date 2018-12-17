"use strict";

function items() {
    this.init();
}

////// 初始化 //////
items.prototype.init = function () {
    this.items = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.items;
    this.itemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.itemEffect;
    this.itemEffectTip = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.itemEffectTip;
    this.useItemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.useItemEffect;
    this.canUseItemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.canUseItemEffect;
    if (!core.isset(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.canEquip))
        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.canEquip = {};
    this.canEquip = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.canEquip;

    //delete(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a);
}

////// 获得所有道具 //////
items.prototype.getItems = function () {
    return this.items;
}

////// “即捡即用类”道具的使用效果 //////
items.prototype.getItemEffect = function(itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        var ratio = parseInt(core.status.thisMap.item_ratio) || 1;
        var curr_hp = core.status.hero.hp;
        if (itemId in this.itemEffect) {
            try {
                eval(this.itemEffect[itemId]);
            }
            catch (e) {
                console.log(e);
            }
        }
        core.status.hero.statistics.hp += core.status.hero.hp - curr_hp;
    }
    else {
        core.addItem(itemId, itemNum);
    }
}

////// “即捡即用类”道具的文字提示 //////
items.prototype.getItemEffectTip = function(itemId) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        var ratio = parseInt(core.status.thisMap.item_ratio) || 1;
        if (itemId in this.itemEffectTip) {
            try {
                return eval(this.itemEffectTip[itemId])||"";
            } catch (e) {
                console.log(e);
                return "";
            }
        }
    }
    return "";
}

////// 使用道具 //////
items.prototype.useItem = function (itemId, callback) {
    if (!this.canUseItem(itemId)) {
        if (core.isset(callback)) callback();
        return;
    }
    var itemCls = core.material.items[itemId].cls;

    if (itemId in this.useItemEffect) {
        try {
            eval(this.useItemEffect[itemId]);
        }
        catch (e) {
            console.log(e);
        }
    }
    // 记录路线
    if (itemId!='book' && itemId!='fly') {
        core.status.route.push("item:"+itemId);
    }

    // 道具使用完毕：删除
    if (itemCls=='tools')
        core.status.hero.items[itemCls][itemId]--;
    if (core.status.hero.items[itemCls][itemId]<=0)
        delete core.status.hero.items[itemCls][itemId];

    core.updateStatusBar();
    if (!core.isset(core.status.event.id)) core.status.event.data = null;

    if (core.isset(callback)) callback();
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
            console.log(e);
        }
    }
    if (!able) core.status.event.data = null;

    return able;
}

////// 获得某个物品的个数 //////
items.prototype.itemCount = function (itemId) {
    if (!core.isset(itemId) || !core.isset(core.material.items[itemId])) return 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls=="items") return 0;
    return core.status.hero.items[itemCls][itemId]||0;
}

////// 是否存在某个物品 //////
items.prototype.hasItem = function (itemId) {
    return core.itemCount(itemId) > 0;
}

////// 是否装备某件装备 //////
items.prototype.hasEquip = function (itemId) {

    if (!core.isset(itemId)) return null;
    if (!core.isset((core.material.items[itemId]||{}).equip)) return null;

    return this.getEquip(core.material.items[itemId].equip.type) == itemId;
}

////// 获得某个装备类型的当前装备 //////
items.prototype.getEquip = function (equipType) {
    return (core.status.hero.equipment||[])[equipType]||null;
}

////// 设置某个物品的个数 //////
items.prototype.setItem = function (itemId, itemNum) {
    itemNum = itemNum || 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
    }
    core.status.hero.items[itemCls][itemId] = itemNum;
    if (core.status.hero.items[itemCls][itemId] <= 0) {
        if (itemCls!='keys') delete core.status.hero.items[itemCls][itemId];
        else core.status.hero.items[itemCls][itemId] = 0;
    }
    core.updateStatusBar();
}

////// 删除某个物品 //////
items.prototype.removeItem = function (itemId, itemNum) {
    itemNum = itemNum || 1;
    if (!core.hasItem(itemId)) return false;
    var itemCls = core.material.items[itemId].cls;
    core.status.hero.items[itemCls][itemId]-=itemNum;
    if (core.status.hero.items[itemCls][itemId] <= 0) {
        if (itemCls!='keys') delete core.status.hero.items[itemCls][itemId];
        else core.status.hero.items[itemCls][itemId] = 0;
    }
    core.updateStatusBar();
    return true;
}

////// 增加某个物品的个数 //////
items.prototype.addItem = function (itemId, itemNum) {
    itemNum = itemNum || 1;
    var itemData = core.material.items[itemId];
    var itemCls = itemData.cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
        core.status.hero.items[itemCls][itemId] = 0;
    }
    else if (!core.isset(core.status.hero.items[itemCls][itemId])) {
        core.status.hero.items[itemCls][itemId] = 0;
    }
    core.status.hero.items[itemCls][itemId] += itemNum;
    if (core.status.hero.items[itemCls][itemId] <= 0) {
        if (itemCls!='keys') delete core.status.hero.items[itemCls][itemId];
        else core.status.hero.items[itemCls][itemId] = 0;
    }
    // 永久道具只能有一个
    if (itemCls == 'constants' && core.status.hero.items[itemCls][itemId]>1)
        core.status.hero.items[itemCls][itemId] = 1;
    core.updateStatusBar();
}


////// 换上 //////
items.prototype.loadEquip = function (equipId, callback) {

    if (!core.isset(core.status.hero.equipment)) core.status.hero.equipment = [];

    var loadEquip = core.material.items[equipId]||{};
    if (!core.isset(loadEquip.equip)) {
        if (core.isset(callback)) callback();
        return;
    }

    var can = this.canEquip[equipId];
    if (core.isset(can)) {
        try {
            if (!eval(can)) {
                core.drawTip("当前不可换上"+loadEquip.name);
                if (core.isset(callback)) callback();
                return;
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    core.playSound('equip.mp3');

    var loadEquipType = loadEquip.equip.type;
    var unloadEquipId = core.status.hero.equipment[loadEquipType];
    var unloadEquip = core.material.items[unloadEquipId] || {};

    // ------ 如果当前装备和目标装备的模式不同（一个百分比一个数值），则需要先脱再穿 ------ //
    if (core.isset(unloadEquip.equip) && (unloadEquip.equip.percentage||false) != (loadEquip.equip.percentage||false)) {
        this.unloadEquip(loadEquipType);
        this.loadEquip(equipId);
        if (core.isset(callback)) callback();
        return;
    }
    // 下面保证了两者的模式是相同的

    // 比较能力值
    var result = core.compareEquipment(equipId,unloadEquipId);

    if (loadEquip.equip.percentage) {
        core.setFlag('equip_atk_buff', core.getFlag('equip_atk_buff',1)+result.atk/100);
        core.setFlag('equip_def_buff', core.getFlag('equip_def_buff',1)+result.def/100);
        core.setFlag('equip_mdef_buff', core.getFlag('equip_mdef_buff',1)+result.mdef/100);
    }
    else {
        core.status.hero.atk += result.atk;
        core.status.hero.def += result.def;
        core.status.hero.mdef += result.mdef;
    }

    // 更新装备状态
    core.status.hero.equipment[loadEquipType] = equipId;
    core.updateStatusBar();

    // 装备更换完毕：删除换上的装备
    core.removeItem(equipId);
    
    // 装备更换完毕：增加卸下的装备
    if (core.isset(unloadEquipId))
        core.addItem(unloadEquipId, 1);

    core.drawTip("已装备上"+loadEquip.name, core.material.icons.items[equipId]);

    if (core.isset(callback)) callback();
}

////// 卸下 //////
items.prototype.unloadEquip = function (equipType, callback) {

    if (!core.isset(core.status.hero.equipment)) core.status.hero.equipment = [];

    core.playSound('equip.mp3');

    var unloadEquipId = core.status.hero.equipment[equipType];
    if (!core.isset(unloadEquipId)) {
        if (core.isset(callback)) callback();
        return;
    }
    var unloadEquip = core.material.items[unloadEquipId] || {};

    // 处理能力值改变
    if (unloadEquip.equip.percentage) {
        core.setFlag('equip_atk_buff', core.getFlag('equip_atk_buff',1)-(unloadEquip.equip.atk||0)/100);
        core.setFlag('equip_def_buff', core.getFlag('equip_def_buff',1)-(unloadEquip.equip.def||0)/100);
        core.setFlag('equip_mdef_buff', core.getFlag('equip_mdef_buff',1)-(unloadEquip.equip.mdef||0)/100);
    }
    else {
        core.status.hero.atk -= unloadEquip.equip.atk || 0;
        core.status.hero.def -= unloadEquip.equip.def || 0;
        core.status.hero.mdef -= unloadEquip.equip.mdef || 0;
    }

    // 更新装备状态
    core.status.hero.equipment[equipType] = null;

    core.updateStatusBar();
    
    // 装备更换完毕：增加卸下的装备
    core.addItem(unloadEquipId, 1);

    core.drawTip("已卸下"+unloadEquip.name, core.material.icons.items[unloadEquipId]);

    if (core.isset(callback)) callback();
}

items.prototype.compareEquipment = function (compareEquipId, beComparedEquipId) {
    var compareAtk = 0, compareDef = 0, compareMdef = 0;
    if (core.isset(compareEquipId)) {
        var compareEquip = core.material.items[compareEquipId];
        compareAtk += (compareEquip.equip||{}).atk || 0;
        compareDef += (compareEquip.equip||{}).def || 0;
        compareMdef += (compareEquip.equip||{}).mdef || 0;
    }
    if (core.isset(beComparedEquipId)) {
        var beComparedEquip = core.material.items[beComparedEquipId];
        compareAtk -= (beComparedEquip.equip||{}).atk || 0;
        compareDef -= (beComparedEquip.equip||{}).def || 0;
        compareMdef -= (beComparedEquip.equip||{}).mdef || 0;
    }
    return {"atk":compareAtk,"def":compareDef,"mdef":compareMdef};
}

////// 保存装备 //////
items.prototype.quickSaveEquip = function (index) {
    if (!core.isset(core.status.hero.equipment)) core.status.hero.equipment = [];
    var saveEquips = core.getFlag("saveEquips", []);
    saveEquips[index] = core.clone(core.status.hero.equipment);
    core.setFlag("saveEquips", saveEquips);
    core.drawTip("已保存"+index+"号套装");
}

////// 读取装备 //////
items.prototype.quickLoadEquip = function (index) {
    var current = core.getFlag("saveEquips", [])[index];
    if (!core.isset(current)) {
        core.drawTip(index+"号套装不存在");
        return;
    }
    // 检查所有的装备
    var equipSize = (main.equipName||[]).length;
    for (var i=0;i<equipSize;i++) {
        var v = current[i];
        if (core.isset(v) && !core.hasItem(v) && !core.hasEquip(v)) {
            return;
        }
        if (core.isset(v)) {
            if (!core.hasItem(v) && !core.hasEquip(v)) {
                core.drawTip("你当前没有"+((core.material.items[v]||{}).name||"未知装备")+"，无法换装");
                return;
            }
            var can = this.canEquip[v];
            if (core.isset(can) && !eval(can)) {
                core.drawTip("当前不可换上"+((core.material.items[v]||{}).name||"未知装备"));
                return;
            }
        }
    }
    // 快速换装
    if (!core.isset(core.status.hero.equipment)) core.status.hero.equipment = [];
    for (var i=0;i<equipSize;i++) {
        var now = core.status.hero.equipment[i]||null;
        var to = current[i]||null;
        if (now==to) continue;
        if (to==null) {
            this.unloadEquip(i);
            core.status.route.push("unEquip:"+i);
        }
        else {
            this.loadEquip(to);
            core.status.route.push("equip:"+to);
        }
    }
    core.drawTip("成功换上"+index+"号套装");
}
