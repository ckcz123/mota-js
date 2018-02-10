function items() {

}

////// 初始化 //////
items.prototype.init = function () {
    this.items = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.items;
    this.itemEffect = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.itemEffect;
    this.itemEffectTip = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a.itemEffectTip;
    //delete(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a);
}

////// 获得所有道具 //////
items.prototype.getItems = function () {
    // 大黄门钥匙？钥匙盒？
    if (core.flags.bigKeyIsBox)
        this.items['bigKey'] = {'cls': 'items', 'name': '钥匙盒'};
    // 面前的墙？四周的墙？
    if (core.flags.pickaxeFourDirections)
        this.items.pickaxe.text = "可以破坏勇士四周的墙";
    if (core.flags.bombFourDirections)
        this.items.bomb.text = "可以炸掉勇士四周的怪物";
    if (core.flags.equipment) {
        this.items.sword1 = {'cls': 'constants', 'name': '铁剑', 'text': '一把很普通的铁剑，攻击+'+core.values.sword1};
        this.items.sword2 = {'cls': 'constants', 'name': '银剑', 'text': '一把很普通的银剑，攻击+'+core.values.sword2};
        this.items.sword3 = {'cls': 'constants', 'name': '骑士剑', 'text': '一把很普通的骑士剑，攻击+'+core.values.sword3};
        this.items.sword4 = {'cls': 'constants', 'name': '圣剑', 'text': '一把很普通的圣剑，攻击+'+core.values.sword4};
        this.items.sword5 = {'cls': 'constants', 'name': '神圣剑', 'text': '一把很普通的神圣剑，攻击+'+core.values.sword5};
        this.items.shield1 = {'cls': 'constants', 'name': '铁盾', 'text': '一个很普通的铁盾，防御+'+core.values.shield1};
        this.items.shield2 = {'cls': 'constants', 'name': '银盾', 'text': '一个很普通的银盾，防御+'+core.values.shield2};
        this.items.shield3 = {'cls': 'constants', 'name': '骑士盾', 'text': '一个很普通的骑士盾，防御+'+core.values.shield3};
        this.items.shield4 = {'cls': 'constants', 'name': '圣盾', 'text': '一个很普通的圣盾，防御+'+core.values.shield4};
        this.items.shield5 = {'cls': 'constants', 'name': '神圣盾', 'text': '一个很普通的神圣盾，防御+'+core.values.shield5};
    }

    return this.items;
}

main.instance.items = new items();

////// “即捡即用类”道具的使用效果 //////
items.prototype.getItemEffect = function(itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        if (itemId in this.itemEffect)eval(this.itemEffect[itemId]);
    }
    else {
        core.addItem(itemId, itemNum);
    }
}

////// “即捡即用类”道具的文字提示 //////
items.prototype.getItemEffectTip = function(itemId) {
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

    if (itemId=='book') core.ui.drawBook(0);
    if (itemId=='fly') core.ui.drawFly(core.status.hero.flyRange.indexOf(core.status.floorId));
    if (itemId == 'earthquake' || itemId == 'bomb' || itemId == 'pickaxe' || itemId=='icePickaxe'
        || itemId == 'snow' || itemId == 'hammer' || itemId=='bigKey') {
        // 消除当前层的某些块
        core.removeBlockByIds(core.status.floorId, core.status.event.data);
        core.drawMap(core.status.floorId, function () {
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            core.updateFg();
            core.drawTip(core.material.items[itemId].name + "使用成功");

            if (itemId == 'bomb' || itemId == 'hammer')
                core.events.afterUseBomb();
        });
    }
    if (itemId == 'centerFly') {
        // 对称飞
        core.clearMap('hero', 0, 0, 416, 416);
        core.setHeroLoc('x', core.status.event.data.x);
        core.setHeroLoc('y', core.status.event.data.y);
        core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
        core.drawTip(core.material.items[itemId].name + "使用成功");
    }
    if (itemId == 'upFly' || itemId == 'downFly') {
        // 上楼器/下楼器
        core.changeFloor(core.status.event.data.id, null, {'direction': core.status.hero.loc.direction, 'x': core.status.event.data.x, 'y': core.status.event.data.y}, null, function (){
            core.drawTip(core.material.items[itemId].name + "使用成功");
            core.replay();
        });
    }
    if (itemId == 'poisonWine') core.setFlag('poison', false);
    if (itemId == 'weakWine') {
        core.setFlag('weak', false);
        core.status.hero.atk += core.values.weakValue;
        core.status.hero.def += core.values.weakValue;
    }
    if (itemId == 'curseWine') core.setFlag('curse', false);
    if (itemId == 'superWine') {
        core.setFlag('poison', false);
        if (core.hasFlag('weak')) {
            core.setFlag('weak', false);
            core.status.hero.atk += core.values.weakValue;
            core.status.hero.def += core.values.weakValue;
        }
        core.setFlag('curse', false);
    }

    // 剑
    if (itemId.indexOf("sword")==0) {
        var now=core.getFlag('sword', 'sword0'); // 当前装备剑的ID
        core.status.hero.atk -= core.values[now];
        core.setItem(now, 1);
        core.status.hero.atk += core.values[itemId];
        core.setItem(itemId, 0);
        core.setFlag('sword', itemId);
        core.drawTip("已装备"+core.material.items[itemId].name);
    }
    // 盾
    if (itemId.indexOf("shield")==0) {
        var now=core.getFlag('shield', 'shield0');
        core.status.hero.def -= core.values[now];
        core.setItem(now, 1);
        core.status.hero.def += core.values[itemId];
        core.setItem(itemId, 0);
        core.setFlag('shield', itemId);
        core.drawTip("已装备"+core.material.items[itemId].name);
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

    if (itemId == 'book') return true;
    if (itemId == 'fly') return core.status.hero.flyRange.indexOf(core.status.floorId)>=0;
    if (itemId == 'pickaxe') {
        // 破墙镐
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) &&
                (block.event.id == 'yellowWall' || block.event.id=='whiteWall' || block.event.id=='blueWall')) // 能破哪些墙
            {
                // 四个方向
                if (core.flags.pickaxeFourDirections) {
                    if (Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                        ids.push(i);
                    }
                }
                else {
                    if (block.x == core.nextX() && block.y == core.nextY()) {
                        ids.push(i);
                    }
                }
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'icePickaxe') {
        // 破冰镐
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.x==core.nextX() && block.y==core.nextY() && block.event.id=='ice') {
                core.status.event.data = [i];
                return true;
            }
        }
        return false;
    }
    if (itemId == 'bomb') {
        // 炸弹
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.cls == 'enemys' && Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                var enemy = core.material.enemys[block.event.id];
                if (core.isset(enemy.bomb) && !enemy.bomb) continue;
                if (core.flags.bombFourDirections || (block.x==core.nextX() && block.y==core.nextY()))
                    ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'hammer') {
        // 圣锤
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.cls == 'enemys' && block.x==core.nextX() && block.y==core.nextY()) {
                var enemy = core.material.enemys[block.event.id];
                if (core.isset(enemy.bomb) && !enemy.bomb) continue;
                core.status.event.data = [i];
                return true;
            }
        }
        return false;
    }
    if (itemId == 'earthquake') {
        var ids = []
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && (block.event.id == 'yellowWall' || block.event.id == 'blueWall' || block.event.id == 'whiteWall'))
                ids.push(i);
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'centerFly') {
        // 中心对称
        var toX = 12 - core.getHeroLoc('x'), toY = 12-core.getHeroLoc('y');
        var block = core.getBlock(toX, toY);
        if (block==null) {
            core.status.event.data = {'x': toX, 'y': toY};
            return true;
        }
        return false;
    }
    if (itemId == 'upFly') {
        // 上楼器
        var floorId = core.status.floorId;
        var index = core.floorIds.indexOf(floorId);
        if (index==core.floorIds.length-1) return false;
        var toId = core.floorIds[index+1];
        var toX = core.getHeroLoc('x'), toY = core.getHeroLoc('y');

        var block = core.getBlock(toX, toY, toId);
        if (block==null) {
            core.status.event.data = {'id': toId, 'x': toX, 'y': toY};
            return true;
        }
        return false;
    }
    if (itemId == 'downFly') {
        // 下楼器
        var floorId = core.status.floorId;
        var index = core.floorIds.indexOf(floorId);
        if (index==0) return false;
        var toId = core.floorIds[index-1];
        var toX = core.getHeroLoc('x'), toY = core.getHeroLoc('y');

        var block = core.getBlock(toX, toY, toId);
        if (block==null) {
            core.status.event.data = {'id': toId, 'x': toX, 'y': toY};
            return true;
        }
        return false;
    }
    if (itemId=='snow') {
        // 冰冻徽章
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.id == 'lava' && Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId=='bigKey') {
        // 大黄门钥匙
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.id == 'yellowDoor') {
                ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId=='poisonWine') return core.hasFlag('poison');
    if (itemId=='weakWine') return core.hasFlag('weak');
    if (itemId=='curseWine') return core.hasFlag('curse');
    if (itemId=='superWine') return core.hasFlag('poison') || core.hasFlag('weak') || core.hasFlag('curse');

    // 剑盾
    if (itemId.indexOf("sword")==0 || itemId.indexOf("shield")==0) return true;

    return false;
}
