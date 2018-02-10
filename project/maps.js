maps_90f36752_8815_4be8_b32b_d7fad1d0542e = 
{
    ////////////////////////// 地形部分 //////////////////////////

    // 0-20 地形
    '1':{'cls': 'terrains', 'id': 'yellowWall'}, // 黄墙
    '2':{'cls': 'terrains', 'id': 'whiteWall'}, // 白墙
    '3':{'cls': 'terrains', 'id': 'blueWall'}, // 蓝墙
    '4':{'cls': 'animates', 'id': 'star', 'noPass': true}, // 星空
    '5':{'cls': 'animates', 'id': 'lava', 'noPass': true}, // 岩浆
    '6':{'cls': 'terrains', 'id': 'ice'}, // 冰面
    '7':{'cls': 'terrains', 'id': 'blueShop-left'}, // 蓝色商店左
    '8':{'cls': 'terrains', 'id': 'blueShop-right'}, // 蓝色商店右
    '9':{'cls': 'terrains', 'id': 'pinkShop-left'}, // 粉色商店左
    '10':{'cls': 'terrains', 'id': 'pinkShop-right'}, // 粉色商店左
    '11':{'cls': 'animates', 'id': 'lavaNet', 'noPass': false, 'trigger': 'passNet'}, // 血网
    '12':{'cls': 'animates', 'id': 'poisonNet', 'noPass': false, 'trigger': 'passNet'}, // 毒网
    '13':{'cls': 'animates', 'id': 'weakNet', 'noPass': false, 'trigger': 'passNet'}, // 衰网
    '14':{'cls': 'animates', 'id': 'curseNet', 'noPass': false, 'trigger': 'passNet'}, // 咒网
    '15':{'cls': 'animates', 'id': 'water', 'noPass': true}, // 水
    // 在这里添加更多地形
    // 如果空位不足，可以从180以后开始继续放，只要不和现有的数字冲突即可

    // Autotile
    '20':{'cls': 'autotile', 'id': 'autotile', 'noPass': true}, // autotile
    // 更多的autotile从151到160等，只要不和现有的数字冲突即可
    '151':{'cls': 'autotile', 'id': 'autotile1', 'noPass': true},
    '152':{'cls': 'autotile', 'id': 'autotile2', 'noPass': true},
    '153':{'cls': 'autotile', 'id': 'autotile3', 'noPass': true},

    ////////////////////////// 物品部分 //////////////////////////

    // 21-80 物品
    '21':{'cls': 'items', 'id': 'yellowKey'}, // 黄钥匙
    '22':{'cls': 'items', 'id': 'blueKey'}, // 蓝钥匙
    '23':{'cls': 'items', 'id': 'redKey'}, // 红钥匙
    '24':{'cls': 'items', 'id': 'greenKey'}, // 绿钥匙
    '25':{'cls': 'items', 'id': 'steelKey'}, // 铁门钥匙
    '26':{'cls': 'items', 'id': 'bigKey'}, // 大黄门钥匙（钥匙盒）
    '27':{'cls': 'items', 'id': 'redJewel'}, // 红宝石
    '28':{'cls': 'items', 'id': 'blueJewel'}, // 蓝宝石
    '29':{'cls': 'items', 'id': 'greenJewel'}, // 绿宝石
    '30':{'cls': 'items', 'id': 'yellowJewel'}, // 黄宝石
    '31':{'cls': 'items', 'id': 'redPotion'}, // 红血瓶
    '32':{'cls': 'items', 'id': 'bluePotion'}, // 蓝血瓶
    '33':{'cls': 'items', 'id': 'greenPotion'}, // 绿血瓶
    '34':{'cls': 'items', 'id': 'yellowPotion'}, // 黄血瓶
    '35':{'cls': 'items', 'id': 'sword1'}, // 铁剑
    '36':{'cls': 'items', 'id': 'shield1'}, // 铁盾
    '37':{'cls': 'items', 'id': 'sword2'}, // 银剑
    '38':{'cls': 'items', 'id': 'shield2'}, // 银盾
    '39':{'cls': 'items', 'id': 'sword3'}, // 骑士剑
    '40':{'cls': 'items', 'id': 'shield3'}, // 骑士盾
    '41':{'cls': 'items', 'id': 'sword4'}, // 圣剑
    '42':{'cls': 'items', 'id': 'shield4'}, // 圣盾
    '43':{'cls': 'items', 'id': 'sword5'}, // 神圣剑
    '44':{'cls': 'items', 'id': 'shield5'}, // 神圣盾
    '45':{'cls': 'items', 'id': 'book'}, // 怪物手册
    '46':{'cls': 'items', 'id': 'fly'}, // 楼层传送器
    '47':{'cls': 'items', 'id': 'pickaxe'}, // 破墙镐
    '48':{'cls': 'items', 'id': 'icePickaxe'}, // 破冰镐
    '49':{'cls': 'items', 'id': 'bomb'}, // 炸弹
    '50':{'cls': 'items', 'id': 'centerFly'}, // 中心对称
    '51':{'cls': 'items', 'id': 'upFly'}, // 上楼器
    '52':{'cls': 'items', 'id': 'downFly'}, // 下楼器
    '53':{'cls': 'items', 'id': 'coin'}, // 幸运金币
    '54':{'cls': 'items', 'id': 'snow'}, // 冰冻徽章
    '55':{'cls': 'items', 'id': 'cross'}, // 十字架
    '56':{'cls': 'items', 'id': 'superPotion'}, // 圣水
    '57':{'cls': 'items', 'id': 'earthquake'}, // 地震卷轴
    '58':{'cls': 'items', 'id': 'poisonWine'}, // 解毒药水
    '59':{'cls': 'items', 'id': 'weakWine'}, // 解衰药水
    '60':{'cls': 'items', 'id': 'curseWine'}, // 解咒药水
    '61':{'cls': 'items', 'id': 'superWine'}, // 万能药水
    '62':{'cls': 'items', 'id': 'knife'}, // 屠龙匕首
    '63':{'cls': 'items', 'id': 'moneyPocket'}, // 金钱袋
    '64':{'cls': 'items', 'id': 'shoes'}, // 绿鞋
    '65':{'cls': 'items', 'id': 'hammer'}, // 圣锤


    ////////////////////////// 门、楼梯、传送点部分 //////////////////////////

    // 81-100 门
    '81':{'cls': 'terrains', 'id': 'yellowDoor', 'trigger': 'openDoor'}, // 黄门
    '82':{'cls': 'terrains', 'id': 'blueDoor', 'trigger': 'openDoor'}, // 蓝门
    '83':{'cls': 'terrains', 'id': 'redDoor', 'trigger': 'openDoor'}, // 红门
    '84':{'cls': 'terrains', 'id': 'greenDoor', 'trigger': 'openDoor'}, // 绿门
    '85':{'cls': 'terrains', 'id': 'specialDoor', 'trigger': 'openDoor'}, // 机关门左
    '86':{'cls': 'terrains', 'id': 'steelDoor', 'trigger': 'openDoor'}, // 铁门
    '87':{'cls': 'terrains', 'id': 'upFloor', 'noPass': false}, // 上楼梯
    '88':{'cls': 'terrains', 'id': 'downFloor', 'noPass': false}, // 下楼梯
    '89':{'cls': 'animates', 'id': 'portal', 'noPass': false}, // 传送门
    '90':{'cls': 'animates', 'id': 'starPortal', 'noPass': false}, // 星空传送门
    '91':{'cls': 'animates', 'id': 'upPortal', 'noPass': false}, // 上箭头
    '92':{'cls': 'animates', 'id': 'leftPortal', 'noPass': false}, // 左箭头
    '93':{'cls': 'animates', 'id': 'downPortal', 'noPass': false}, // 下箭头
    '94':{'cls': 'animates', 'id': 'rightPortal', 'noPass': false}, // 右箭头


    ////////////////////////// NPC部分 //////////////////////////

    // 121-150 NPC
    '121':{'cls': 'npcs', 'id': 'man'},
    '122':{'cls': 'npcs', 'id': 'woman'},
    '123':{'cls': 'npcs', 'id': 'thief'},
    '124':{'cls': 'npcs', 'id': 'fairy'},
    '125':{'cls': 'npcs', 'id': 'magician'},
    '126':{'cls': 'npcs', 'id': 'womanMagician'},
    '127':{'cls': 'npcs', 'id': 'oldMan'},
    '128':{'cls': 'npcs', 'id': 'child'},
    '129':{'cls': 'npcs', 'id': 'wood'},
    '130':{'cls': 'npcs', 'id': 'pinkShop'},
    '131':{'cls': 'npcs', 'id': 'blueShop'},
    '132':{'cls': 'npcs', 'id': 'princess'},

    ////////////////////////// 其他部分 //////////////////////////

    // 161-200 其他（单向箭头、灯、箱子等等）
    '161':{'cls': 'terrains', 'id': 'arrowUp', 'noPass': false}, // 单向上箭头
    '162':{'cls': 'terrains', 'id': 'arrowDown', 'noPass': false}, // 单向下箭头
    '163':{'cls': 'terrains', 'id': 'arrowLeft', 'noPass': false}, // 单向左箭头
    '164':{'cls': 'terrains', 'id': 'arrowRight', 'noPass': false}, // 单向右箭头
    '165':{'cls': 'terrains', 'id': 'light', 'trigger': 'changeLight', 'noPass': false}, // 灯
    '166':{'cls': 'terrains', 'id': 'darkLight', 'noPass': true}, // 暗灯


    ////////////////////////// 怪物部分 //////////////////////////

    // 201-300 怪物
    '201':{'cls': 'enemys', 'id': 'greenSlime'},
    '202':{'cls': 'enemys', 'id': 'redSlime'},
    '203':{'cls': 'enemys', 'id': 'blackSlime'},
    '204':{'cls': 'enemys', 'id': 'slimelord'},
    '205':{'cls': 'enemys', 'id': 'bat'},
    '206':{'cls': 'enemys', 'id': 'bigBat'},
    '207':{'cls': 'enemys', 'id': 'redBat'},
    '208':{'cls': 'enemys', 'id': 'vampire'},
    '209':{'cls': 'enemys', 'id': 'skeleton'},
    '210':{'cls': 'enemys', 'id': 'skeletonSoilder'},
    '211':{'cls': 'enemys', 'id': 'skeletonCaptain'},
    '212':{'cls': 'enemys', 'id': 'ghostSkeleton'},
    '213':{'cls': 'enemys', 'id': 'zombie'},
    '214':{'cls': 'enemys', 'id': 'zombieKnight'},
    '215':{'cls': 'enemys', 'id': 'rock'},
    '216':{'cls': 'enemys', 'id': 'slimeMan'},
    '217':{'cls': 'enemys', 'id': 'bluePriest'},
    '218':{'cls': 'enemys', 'id': 'redPriest'},
    '219':{'cls': 'enemys', 'id': 'brownWizard'},
    '220':{'cls': 'enemys', 'id': 'redWizard'},
    '221':{'cls': 'enemys', 'id': 'yellowGuard'},
    '222':{'cls': 'enemys', 'id': 'blueGuard'},
    '223':{'cls': 'enemys', 'id': 'redGuard'},
    '224':{'cls': 'enemys', 'id': 'swordsman'},
    '225':{'cls': 'enemys', 'id': 'soldier'},
    '226':{'cls': 'enemys', 'id': 'yellowKnight'},
    '227':{'cls': 'enemys', 'id': 'redKnight'},
    '228':{'cls': 'enemys', 'id': 'darkKnight'},
    '229':{'cls': 'enemys', 'id': 'blackKing'},
    '230':{'cls': 'enemys', 'id': 'yellowKing'},
    '231':{'cls': 'enemys', 'id': 'greenKing'},
    '232':{'cls': 'enemys', 'id': 'blueKnight'},
    '233':{'cls': 'enemys', 'id': 'goldSlime'},
    '234':{'cls': 'enemys', 'id': 'poisonSkeleton'},
    '235':{'cls': 'enemys', 'id': 'poisonBat'},
    '236':{'cls': 'enemys', 'id': 'steelRock'},
    '237':{'cls': 'enemys', 'id': 'skeletonPriest'},
    '238':{'cls': 'enemys', 'id': 'skeletonKing'},
    '239':{'cls': 'enemys', 'id': 'skeletonWizard'},
    '240':{'cls': 'enemys', 'id': 'redSkeletonCaption'},
    '241':{'cls': 'enemys', 'id': 'badHero'},
    '242':{'cls': 'enemys', 'id': 'demon'},
    '243':{'cls': 'enemys', 'id': 'demonPriest'},
    '244':{'cls': 'enemys', 'id': 'goldHornSlime'},
    '245':{'cls': 'enemys', 'id': 'redKing'},
    '246':{'cls': 'enemys', 'id': 'whiteKing'},
    '247':{'cls': 'enemys', 'id': 'blackMagician'},
    '248':{'cls': 'enemys', 'id': 'silverSlime'},
    '249':{'cls': 'enemys', 'id': 'swordEmperor'},
    '250':{'cls': 'enemys', 'id': 'whiteHornSlime'},
    '251':{'cls': 'enemys', 'id': 'badPrincess'},
    '252':{'cls': 'enemys', 'id': 'badFairy'},
    '253':{'cls': 'enemys', 'id': 'grayPriest'},
    '254':{'cls': 'enemys', 'id': 'redSwordsman'},
    '255':{'cls': 'enemys', 'id': 'whiteGhost'},
    '256':{'cls': 'enemys', 'id': 'poisonZombie'},
    '257':{'cls': 'enemys', 'id': 'magicDragon'},
    '258':{'cls': 'enemys', 'id': 'octopus'},
    '259':{'cls': 'enemys', 'id': 'darkFairy'},
    '260':{'cls': 'enemys', 'id': 'greenKnight'},

    ////////////////////////// 待定... //////////////////////////
    // 目前ID暂时不要超过400
}