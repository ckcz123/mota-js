function items() {

}

items.prototype.init = function () {
    this.items = {
        // 钥匙
        'yellowKey': {'cls': 'keys', 'name': '黄钥匙'},
        'blueKey': {'cls': 'keys', 'name': '蓝钥匙'},
        'redKey': {'cls': 'keys', 'name': '红钥匙'},

        // 宝石、血瓶
        'redJewel': {'cls': 'items', 'name': '红宝石'},
        'blueJewel': {'cls': 'items', 'name': '蓝宝石'},
        'greenJewel': {'cls': 'items', 'name': '绿宝石'},
        'yellowJewel': {'cls': 'items', 'name': '黄宝石'},
        'redPotion': {'cls': 'items', 'name': '红血瓶'},
        'bluePotion': {'cls': 'items', 'name': '蓝血瓶'},
        'yellowPotion': {'cls': 'items', 'name': '黄血瓶'},
        'greenPotion': {'cls': 'items', 'name': '绿血瓶'},
        'sword1': {'cls': 'items', 'name': '铁剑'},
        'sword2': {'cls': 'items', 'name': '银剑'},
        'sword3': {'cls': 'items', 'name': '骑士剑'},
        'sword4': {'cls': 'items', 'name': '圣剑'},
        'sword5': {'cls': 'items', 'name': '神圣剑'},
        'shield1': {'cls': 'items', 'name': '铁盾'},
        'shield2': {'cls': 'items', 'name': '银盾'},
        'shield3': {'cls': 'items', 'name': '骑士盾'},
        'shield4': {'cls': 'items', 'name': '圣盾'},
        'shield5': {'cls': 'items', 'name': '神圣盾'},
        'superPotion': {'cls': 'items', 'name': '圣水'},
        'bigKey': {'cls': 'items', 'name': '钥匙盒'},

        // 物品
        'greenKey': {'cls': 'tools', 'name': '绿钥匙', 'text': '可以打开一扇绿门'},
        'steelKey': {'cls': 'tools', 'name': '铁门钥匙', 'text': '可以打开一扇铁门'},
        'book': {'cls': 'constants', 'name': '怪物手册', 'text': '可以查看当前楼层各怪物属性。'},
        'fly': {'cls': 'constants', 'name': '楼层传送器', 'text': '可以自由往来去过的楼层。'},
        'coin': {'cls': 'constants', 'name': '幸运金币', 'text': '持有时打败怪物可得双倍金币'},
        'snow': {'cls': 'constants', 'name': '冰冻徽章', 'text': '可以将面前的一块熔岩变成平地'},
        'cross': {'cls': 'constants', 'name': '十字架', 'text': '持有后无视怪物的无敌属性'},

        // 道具
        'pickaxe': {'cls': 'tools', 'name': '破墙镐', 'text': '可以破坏勇士四周的墙。'},
        'icePickaxe': {'cls': 'tools', 'name': '破冰稿', 'text': '可以破坏勇士面前的一堵冰墙。'},
        'bomb': {'cls': 'tools', 'name': '炸弹', 'text': '可以炸掉勇士四周的怪物。'},
        'centerFly': {'cls': 'tools', 'name': '中心对称飞行器', 'text': '可以飞向当前楼层中心对称的位置。'},
        'upFly': {'cls': 'tools', 'name': '上楼器', 'text': '可以飞往楼上的相同位置。'},
        'downFly': {'cls': 'tools', 'name': '下楼器', 'text': '可以飞往楼下的相同位置。'},
        'earthquake': {'cls': 'tools', 'name': '地震卷轴', 'text': '可以破坏当前层的所有墙'}

    }
}

items.prototype.getItems = function (itemName) {
    if (itemName == undefined) {
        return this.items;
    }
    return this.items[itemsName];
}

main.instance.items = new items();


items.prototype.useItem = function (itemId) {
    // 使用道具
    if (!this.canUseItem(itemId)) return;
    var itemCls = core.material.items[itemId].cls;

    // 永久道具
    if (itemCls == 'constants') {
        if (itemId=='book') {
            core.ui.drawEnemyBook(1);
        }
        if (itemId=='fly') {
            core.ui.drawFly(core.status.hero.flyRange.indexOf(core.status.floorId));
        }
    }
    // 消耗道具
    if (itemCls == 'tools') {
        core.status.hero.items[itemCls][itemId]--;
        if (itemId == 'earthquake' || itemId == 'bomb' || itemId == 'pickaxe') {
            // 地震卷轴/炸弹/破墙镐
            core.removeBlockByIds(core.status.floorId, core.status.event.data);
            core.drawMap(core.status.floorId, function () {
                core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                core.updateFg();
                core.drawTip(core.material.items[itemId].name + "使用成功");
                if (itemId == 'bomb' && core.flags.bombTrigger) {
                    core.events.afterBattle();
                }
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
            core.changeFloor(core.status.event.data.id, null, {'direction': core.status.hero.loc.direction, 'x': core.status.event.data.x, 'y': core.status.event.data.y}, function (){
                core.drawTip(core.material.items[itemId].name + "使用成功");
            });
        }
        if (core.status.hero.items[itemCls][itemId]==0)
            delete core.status.hero.items[itemCls][itemId];
    }
}

items.prototype.canUseItem = function (itemId) {
    // 没有道具
    if (!core.hasItem(itemId)) return false;

    var itemCls = core.material.items[itemId].cls;

    if (itemId == 'book') return true;
    if (itemId == 'fly') return core.status.hero.flyRange.indexOf(core.status.floorId)>=0;
    if (itemId == 'pickaxe') {
        // 破墙镐
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && block.event.id == 'yellowWall') {

                // 四个方向
                if (core.flags.pickaxeFourDirections) {
                    if (Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                        ids.push(i);
                    }
                }
                else {
                    // 获得勇士的下一个位置
                    var scan = {
                        'up': {'x': 0, 'y': -1},
                        'left': {'x': -1, 'y': 0},
                        'down': {'x': 0, 'y': 1},
                        'right': {'x': 1, 'y': 0}
                    };
                    if (block.x == core.status.hero.loc.x+scan[core.status.hero.loc.direction].x && block.y == core.status.hero.loc.y+scan[core.status.hero.loc.direction].y) {
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
    if (itemId == 'bomb') {
        // 炸弹
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && block.event.cls == 'enemys' && Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                var enemy = core.material.enemys[block.event.id];
                if (core.isset(enemy.bomb) && !enemy.bomb) continue;
                ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'earthquake') {
        var ids = []
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && (block.event.id == 'yellowWall' || block.event.id == 'blueWall' || block.event.id == 'whiteWall'))
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
        var blocks = core.status.thisMap.blocks;
        for (var s = 0; s < blocks.length; s++) {
            if (blocks[s].x == toX && blocks[s].y == toY) {
                return false;
            }
        }
        core.status.event.data = {'x': toX, 'y': toY};
        return true;
    }
    if (itemId == 'upFly') {
        // 上楼器
        if (core.status.floorId == 'MT20' || core.status.floorId == 'MT21') // 禁用条件
            return false;
        var toId = null, found = false; // 上楼后的楼层ID
        for (var id in core.status.maps) {
            if (found) {toId = id; break;}
            if (id == core.status.floorId) found=true;
        }
        if (!found) return false;
        // 检查是否存在block（不是空地）
        var toX = core.getHeroLoc('x'), toY = core.getHeroLoc('y');
        var blocks = core.status.maps[toId].blocks;
        for (var s = 0; s < blocks.length; s++) {
            if (blocks[s].x == toX && blocks[s].y == toY) {
                return false;
            }
        }
        // 可以上楼，记录下位置信息，返回true
        core.status.event.data = {'id': toId, 'x': toX, 'y': toY};
        return true;
    }
    if (itemId == 'downFly') {
        // 下楼器
        if (core.status.floorId == 'MT0' || core.status.floorId == 'MT21')
            return false;
        var toId = null;
        for (var id in core.status.maps) {
            if (id == core.status.floorId) break;
            toId = id;
        }
        if (toId == null) return false;
        var toX = core.getHeroLoc('x'), toY = core.getHeroLoc('y');
        var blocks = core.status.maps[toId].blocks;
        for (var s = 0; s < blocks.length; s++) {
            if (blocks[s].x == toX && blocks[s].y == toY) {
                return false;
            }
        }
        core.status.event.data = {'id': toId, 'x': toX, 'y': toY};
        return true;
    }
    return false;
}

items.prototype.getItemEffect = function(itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        if (itemId === 'redJewel') core.status.hero.atk += 3;
        if (itemId === 'blueJewel') core.status.hero.def += 3;
        if (itemId === 'greenJewel') core.status.hero.mdef += 3;
        // if (itemId == 'yellowJewel') core.status.hero.atk+=0;
        if (itemId === 'redPotion') core.status.hero.hp += 200;
        if (itemId === 'bluePotion') core.status.hero.hp += 500;
        if (itemId === 'yellowPotion') core.status.hero.hp += 500;
        if (itemId === 'greenPotion') core.status.hero.hp += 800;
        if (itemId === 'sword1') core.status.hero.atk += 10;
        if (itemId === 'sword2') core.status.hero.atk += 100;
        if (itemId === 'sword5') core.status.hero.atk += 1000;
        if (itemId === 'shield1') core.status.hero.def += 10;
        if (itemId === 'shield2') core.status.hero.def += 100;
        if (itemId === 'shield5') {
            core.status.hero.def += 1000;
            core.status.hero.flags.hasShield5 = true;
        }
        if (itemId === 'bigKey') {
            core.status.hero.items.keys.yellowKey++;
            core.status.hero.items.keys.blueKey++;
            core.status.hero.items.keys.redKey++;
        }
        if (itemId == 'superPotion') core.status.hero.hp *= 2;
    }
    else {
        core.addItem(itemId, itemNum);
    }
}

items.prototype.getItemEffectTip = function(itemId) {
    if (itemId === 'redJewel') return "，攻击+3";
    if (itemId === 'blueJewel') return "，防御+3";
    if (itemId === 'greenJewel') return "，魔防+3";
    // if (itemId == 'yellowJewel') ;
    if (itemId === 'redPotion') return "，生命+200";
    if (itemId === 'bluePotion') return "，生命+500";
    if (itemId === 'yellowPotion') return "，生命+500";
    if (itemId === 'greenPotion') return "，生命+800";
    if (itemId === 'sword1') return "，攻击+10";
    if (itemId === 'sword2') return "，攻击+100";
    if (itemId === 'sword5') return "，攻击+1000";
    if (itemId === 'shield1') return "，防御+10";
    if (itemId === 'shield2') return "，防御+100";
    if (itemId === 'shield5') return "，防御+1000";
    if (itemId === 'bigKey') return "，全钥匙+1";
    if (itemId === 'superPotion') return "，生命值翻倍";
    return "";
}
