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
        if (itemId in this.itemEffect)eval(this.itemEffect[itemId]);
    }
    else {
        core.addItem(itemId, itemNum);
    }
}

////// “即捡即用类”道具的文字提示 //////
items.prototype.getItemEffectTip = function(itemId) {
    var ratio = parseInt(core.floors[core.status.floorId].item_ratio) || 1;
    if (itemId in this.itemEffectTip && (!this.items[itemId].isEquipment || !core.flags.equipment)) {
        return eval(this.itemEffectTip[itemId]);
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
}

