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
        var ratio = parseInt(core.floors[core.status.floorId].item_ratio) || 1;
        var curr_hp = core.status.hero.hp;
        if (itemId in this.itemEffect)eval(this.itemEffect[itemId]);
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
        var ratio = parseInt(core.floors[core.status.floorId].item_ratio) || 1;
        if (itemId in this.itemEffectTip) return eval(this.itemEffectTip[itemId])||"";
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
        eval(this.useItemEffect[itemId]);
    }

    core.updateStatusBar();

    // 记录路线
    if (itemId!='book' && itemId!='fly') {
        core.status.route.push("item:"+itemId);
    }

    // 道具使用完毕：删除
    if (itemCls=='tools')
        core.status.hero.items[itemCls][itemId]--;
    if (core.status.hero.items[itemCls][itemId]==0)
        delete core.status.hero.items[itemCls][itemId];

    if (core.isset(callback)) callback();
}

////// 当前能否使用道具 //////
items.prototype.canUseItem = function (itemId) {
    // 没有道具
    if (!core.hasItem(itemId)) return false;

    if (itemId in this.canUseItemEffect) {
        return eval(this.canUseItemEffect[itemId]);
    }

    return false;
}

////// 获得某个物品的个数 //////
items.prototype.itemCount = function (itemId) {
    if (!core.isset(itemId) || !core.isset(core.material.items[itemId])) return 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls=="items") return 0;
    return core.isset(core.status.hero.items[itemCls][itemId]) ? core.status.hero.items[itemCls][itemId] : 0;
}

////// 是否存在某个物品 //////
items.prototype.hasItem = function (itemId) {
    return core.itemCount(itemId) > 0;
}

////// 是否装备某件装备 //////
items.prototype.hasEquip = function (equipId) {
    return core.status.hero.equipment.indexOf(equipId) != -1 ; 
}

////// 设置某个物品的个数 //////
items.prototype.setItem = function (itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
    }
    core.status.hero.items[itemCls][itemId] = itemNum;
    if (itemCls!='keys' && itemNum==0) {
        delete core.status.hero.items[itemCls][itemId];
    }
}

////// 删除某个物品 //////
items.prototype.removeItem = function (itemId) {
    if (!core.hasItem(itemId)) return false;
    var itemCls = core.material.items[itemId].cls;
    core.status.hero.items[itemCls][itemId]--;
    if (itemCls!='keys' && core.status.hero.items[itemCls][itemId]==0) {
        delete core.status.hero.items[itemCls][itemId];
    }
    core.updateStatusBar();
    return true;
}

////// 增加某个物品的个数 //////
items.prototype.addItem = function (itemId, itemNum) {
    itemNum=itemNum||1;
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
    // 永久道具只能有一个
    if (itemCls == 'constants' && core.status.hero.items[itemCls][itemId]>1)
        core.status.hero.items[itemCls][itemId] = 1;
}


////// 换上 //////
items.prototype.loadEquip = function (equipId, callback) {
    
    core.playSound('equip.mp3');

    var loadEquip = core.material.items[equipId];
    var loadEquipType = loadEquip.equipType;
    var unloadEquipId = core.status.hero.equipment[loadEquipType];
    
    // 比较能力值
    var result = core.compareEquipment(equipId,unloadEquipId);
    
    core.status.hero.atk += result.atk;
    core.status.hero.def += result.def;
    core.status.hero.mdef += result.mdef;

    // 更新装备状态
    core.status.hero.equipment[loadEquipType] = equipId;

    core.updateStatusBar();

    // 记录路线
    core.status.route.push("equip:"+equipId);

    // 装备更换完毕：删除换上的装备
    core.status.hero.items["equips"][equipId]--;
    if (core.status.hero.items["equips"][equipId]==0)
        delete core.status.hero.items["equips"][equipId];
    
    // 装备更换完毕：增加卸下的装备
    if (unloadEquipId != "blank")
        core.addItem(unloadEquipId, 1);

    if (core.isset(callback)) callback();
}

////// 卸下 //////
items.prototype.unloadEquip = function (equipType, callback) {
    
    core.playSound('equip.mp3');

    var unloadEquipId = core.status.hero.equipment[equipType];
    var unloadEquip = core.material.items[unloadEquipId];

    // 处理能力值改变
    if (core.isset(unloadEquip.equipEffect.atk))
        core.status.hero.atk -= unloadEquip.equipEffect.atk
    if (core.isset(unloadEquip.equipEffect.def))
        core.status.hero.def -= unloadEquip.equipEffect.def
    if (core.isset(unloadEquip.equipEffect.mdef))
        core.status.hero.mdef -= unloadEquip.equipEffect.mdef

    // 更新装备状态
    core.status.hero.equipment[equipType] = "blank";

    core.updateStatusBar();

    // 记录路线
    core.status.route.push("unEquip:"+unloadEquipId);
    
    // 装备更换完毕：增加卸下的装备
    core.addItem(unloadEquipId, 1);

    if (core.isset(callback)) callback();
}

items.prototype.compareEquipment = function (compareEquipId, beComparedEquipId) {
    var compareEquip = core.material.items[compareEquipId];
    var beComparedEquip = core.material.items[beComparedEquipId];
    var compareAtk = 0, compareDef = 0, compareMdef = 0;
    if (core.isset(compareEquip.equipEffect.atk))
        compareAtk += compareEquip.equipEffect.atk;
    if (core.isset(compareEquip.equipEffect.def))
        compareDef += compareEquip.equipEffect.def;
    if (core.isset(compareEquip.equipEffect.mdef))
        compareMdef += compareEquip.equipEffect.mdef;
    if (core.isset(beComparedEquip.equipEffect.atk))
        compareAtk -= beComparedEquip.equipEffect.atk;
    if (core.isset(beComparedEquip.equipEffect.def))
        compareDef -= beComparedEquip.equipEffect.def;
    if (core.isset(beComparedEquip.equipEffect.mdef))
        compareMdef -= beComparedEquip.equipEffect.mdef;
    return {"atk":compareAtk,"def":compareDef,"mdef":compareMdef};
}