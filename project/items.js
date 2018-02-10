items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = 
{

"items" : {
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
        'sword1': {'cls': 'items', 'name': '铁剑', 'isEquipment': true},
        'sword2': {'cls': 'items', 'name': '银剑', 'isEquipment': true},
        'sword3': {'cls': 'items', 'name': '骑士剑', 'isEquipment': true},
        'sword4': {'cls': 'items', 'name': '圣剑', 'isEquipment': true},
        'sword5': {'cls': 'items', 'name': '神圣剑', 'isEquipment': true},
        'shield1': {'cls': 'items', 'name': '铁盾', 'isEquipment': true},
        'shield2': {'cls': 'items', 'name': '银盾', 'isEquipment': true},
        'shield3': {'cls': 'items', 'name': '骑士盾', 'isEquipment': true},
        'shield4': {'cls': 'items', 'name': '圣盾', 'isEquipment': true},
        'shield5': {'cls': 'items', 'name': '神圣盾', 'isEquipment': true},
        'superPotion': {'cls': 'items', 'name': '圣水'},
        'moneyPocket': {'cls': 'items', 'name': '金钱袋'},

        // 物品
        'sword0': {'cls': 'constants', 'name': '折断的剑', 'text': '没有任何作用的剑，相当于脱掉装备。'},
        'shield0': {'cls': 'constants', 'name': '残破的盾', 'text': '没有任何作用的盾，相当于脱掉装备。'},
        'book': {'cls': 'constants', 'name': '怪物手册', 'text': '可以查看当前楼层各怪物属性'},
        'fly': {'cls': 'constants', 'name': '楼层传送器', 'text': '可以自由往来去过的楼层'},
        'coin': {'cls': 'constants', 'name': '幸运金币', 'text': '持有时打败怪物可得双倍金币'},
        'snow': {'cls': 'constants', 'name': '冰冻徽章', 'text': '可以将四周的熔岩变成平地'},
        'cross': {'cls': 'constants', 'name': '十字架', 'text': '持有后无视怪物的无敌属性'},
        'knife': {'cls': 'constants', 'name': '屠龙匕首', 'text': '该道具尚未被定义'},
        'shoes': {'cls': 'constants', 'name': '绿鞋', 'text': '持有时无视负面地形'},

        // 道具
        'bigKey': {'cls': 'tools', 'name': '大黄门钥匙', 'text': '可以开启当前层所有黄门'},
        'greenKey': {'cls': 'tools', 'name': '绿钥匙', 'text': '可以打开一扇绿门'},
        'steelKey': {'cls': 'tools', 'name': '铁门钥匙', 'text': '可以打开一扇铁门'},
        'pickaxe': {'cls': 'tools', 'name': '破墙镐', 'text': '可以破坏勇士面前的墙'},
        'icePickaxe': {'cls': 'tools', 'name': '破冰镐', 'text': '可以破坏勇士面前的一堵冰墙'},
        'bomb': {'cls': 'tools', 'name': '炸弹', 'text': '可以炸掉勇士面前的怪物'},
        'centerFly': {'cls': 'tools', 'name': '中心对称飞行器', 'text': '可以飞向当前楼层中心对称的位置'},
        'upFly': {'cls': 'tools', 'name': '上楼器', 'text': '可以飞往楼上的相同位置'},
        'downFly': {'cls': 'tools', 'name': '下楼器', 'text': '可以飞往楼下的相同位置'},
        'earthquake': {'cls': 'tools', 'name': '地震卷轴', 'text': '可以破坏当前层的所有墙'},
        'poisonWine': {'cls': 'tools', 'name': '解毒药水', 'text': '可以解除中毒状态'},
        'weakWine': {'cls': 'tools', 'name': '解衰药水', 'text': '可以解除衰弱状态'},
        'curseWine': {'cls': 'tools', 'name': '解咒药水', 'text': '可以解除诅咒状态'},
        'superWine': {'cls': 'tools', 'name': '万能药水', 'text': '可以解除所有不良状态'},
        'hammer': {'cls': 'tools', 'name': '圣锤', 'text': '可以炸掉勇士面前的怪物'}
},




"itemEffect" : {
        "redJewel":"core.status.hero.atk += core.values.redJewel",
        "blueJewel":"core.status.hero.def += core.values.blueJewel",
        "greenJewel":"core.status.hero.mdef += core.values.greenJewel",
        
        "yellowJewel":"core.status.hero.hp+=1000;core.status.hero.atk+=6;core.status.hero.def+=6;core.status.hero.mdef+=10;",
        // 黄宝石属性：需自己定义
        "redPotion":"core.status.hero.hp += core.values.redPotion",
        "bluePotion":"core.status.hero.hp += core.values.bluePotion",
        "yellowPotion":"core.status.hero.hp += core.values.yellowPotion",
        "greenPotion":"core.status.hero.hp += core.values.greenPotion",
        "sword1":"core.status.hero.atk += core.values.sword1",
        "sword2":"core.status.hero.atk += core.values.sword2",
        "sword3":"core.status.hero.atk += core.values.sword3",
        "sword4":"core.status.hero.atk += core.values.sword4",
        "sword5":"core.status.hero.atk += core.values.sword5",
        "shield1":"core.status.hero.def += core.values.shield1",
        "shield2":"core.status.hero.def += core.values.shield2",
        "shield3":"core.status.hero.def += core.values.shield3",
        "shield4":"core.status.hero.def += core.values.shield4",
        "shield5":"core.status.hero.def += core.values.shield5",
        
        "bigKey":"core.status.hero.items.keys.yellowKey++;core.status.hero.items.keys.blueKey++;core.status.hero.items.keys.redKey++;",
        // 只有是钥匙盒才会执行这一步
        "superPotion":"core.status.hero.hp *= 2",
        "moneyPocket":"core.status.hero.money += core.values.moneyPocket",
},
    

"itemEffectTip" : {
    "redJewel":"'，攻击+'+core.values.redJewel",
    "blueJewel":"'，防御+'+core.values.blueJewel",
    "greenJewel":"'，魔防+'+core.values.greenJewel",
    "yellowJewel":"'，全属性提升'",
    "redPotion":"'，生命+'+core.values.redPotion",
    "bluePotion":"'，生命+'+core.values.bluePotion",
    "yellowPotion":"'，生命+'+core.values.yellowPotion",
    "greenPotion":"'，生命+'+core.values.greenPotion",
    "sword1":"'，攻击+'+core.values.sword1",
    "sword2":"'，攻击+'+core.values.sword2",
    "sword3":"'，攻击+'+core.values.sword3",
    "sword4":"'，攻击+'+core.values.sword4",
    "sword5":"'，攻击+'+core.values.sword5",
    "shield1":"'，防御+'+core.values.shield1",
    "shield2":"'，防御+'+core.values.shield2",
    "shield3":"'，防御+'+core.values.shield3",
    "shield4":"'，防御+'+core.values.shield4",
    "shield5":"'，防御+'+core.values.shield5",
    "bigKey":"'，全钥匙+1'",
    "superPotion":"'，生命值翻倍'",
    "moneyPocket":"'，金币+'+core.values.moneyPocket",
}

}