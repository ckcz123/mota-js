function data() {

}

data.prototype.init = function() {
    this.firstData = {
        'title': '魔塔样板',
        'name': 'template',
        'version': 'Ver 1.0.0 (Beta)',
        'floorId': 'MT1',
        'enableExperience': true,
        'hero': {
            'id': 'hero1',
            'name': '勇士',
            'hp': 1000,
            'atk': 10,
            'def': 10,
            'mdef': 0,
            'money': 0,
            'experience': 0,
            'items': {
                'keys': {
                    'yellowKey': 0,
                    'blueKey': 0,
                    'redKey': 0
                },
                'constants': {},
                'tools': {}
            },
            'flyRange': [],
            'loc': {'direction': 'up', 'x': 6, 'y': 11},
            'steps': 0,
            'time': {
                'starttime': new Date(),
                'playtime': 0,
                'totaltime': 0,
                'lasttime': new Date()
            },
            'flags': {
                'visitFloors': {},
                'passLava': false, // 经过岩浆则禁用商店
                'hasShield5': false, // 有神圣盾
                'seal20F': false, // 20F封印
                'poison': true,
            }
        },
        'shops': {
            'shop1': {
                'id': 'shop1', 'title': '贪婪之神', 'name': '3楼金币商店', 'icon': 'blueShop',
                'times': 0, 'need': "25", 'visited': false, 'use': 'money',
                'choices': [
                    {'text': '生命+800', 'effect': 'status,hp,800'},
                    {'text': '攻击+4', 'effect': 'status,atk,4'},
                    {'text': '防御+4', 'effect': 'status,def,4'}
                ]
            },
            'shop2': {
                'id': 'shop2', 'title': '经验之神', 'name': '5楼经验商店', 'icon': 'redShop',
                'times': 0, 'need': -1, 'visited': false, 'use': 'experience',
                'choices': [
                    {'text': '攻击+5', 'effect': 'status,atk,5', 'need': '30'},
                    {'text': '防御+5', 'effect': 'status,def,5' ,'need': '30'},
                    {'text': '等级+1', 'effect': 'status,hp,1000;status,atk,7;status,def,7', 'need': '100'}
                ]
            },
            'shop3': {
                'id': 'shop3', 'title': '钥匙商人', 'name': '6楼钥匙商人', 'icon': 'womanMagician',
                'times': 0, 'need': -1, 'visited': false, 'use': 'money',
                'choices': [
                    {'text': '黄钥匙+1', 'effect': 'item,yellowKey,1', 'need': '10'},
                    {'text': '蓝钥匙+1', 'effect': 'item,blueKey,1', 'need': '50'},
                    {'text': '红钥匙+1', 'effect': 'item,redKey,1', 'need': '100'}
                ]
            },
            'shop4': {
                'id': 'shop4', 'title': '贪婪之神', 'name': '10楼金币商店', 'icon': 'blueShop',
                'times': 0, 'need': "100", 'visited': false, 'use': 'money',
                'choices': [
                    {'text': '生命+4000', 'effect': 'status,hp,4000'},
                    {'text': '攻击+20', 'effect': 'status,atk,20'},
                    {'text': '防御+20', 'effect': 'status,def,20'}
                ]
            },
            'shop5': {
                'id': 'shop5', 'title': '经验之神', 'name': '15楼经验商店', 'icon': 'redShop',
                'times': 0, 'need': -1, 'visited': false, 'use': 'experience',
                'choices': [
                    {'text': '攻击+17', 'effect': 'status,atk,17', 'need': '95'},
                    {'text': '防御+17', 'effect': 'status,def,17' ,'need': '95'},
                    {'text': '等级+3', 'effect': 'status,hp,3000;status,atk,21;status,def,21', 'need': '270'}
                ]
            },
        },
        'npcs': {},
        'animateSpeed': 500,
        'startText': [
            "测试"
        ]
    }
    // 系统FLAG，在游戏运行中中请不要修改它。
    this.flags = {

        /****** 角色状态相关 ******/
        "HPMAX": 999999, // HP上限；-1则无上限
        "enableMDef": true, // 是否涉及勇士的魔防值；如果此项为false，则状态栏不会显示勇士的魔防值
        "enableExperience": true, // 是否涉及经验值；如果此项为false，则状态栏和怪物手册均将不会显示经验值
        // 重要说明：如果enableMDef和enableExperience均为true，则在状态栏不会显示当前楼层！！！！ //


        /****** 道具相关 ******/
        "flyNearStair": false, // 是否需要在楼梯边使用传送器
        "bombTrigger": true, // 使用炸弹后是否触发怪物事件（如开门）
        "pickaxeFourDirections": true, // 使用破墙镐是否四个方向都破坏；如果false则只破坏面前的墙壁
        "bigKeyIsBox": true, // 如果此项为true，则视为钥匙盒，红黄蓝钥匙+1；若为false，则视为大黄门钥匙


        /****** 系统相关 ******/
        "potionWhileRouting": false, // 寻路算法是否经过血瓶；如果该项为false，则寻路算法会自动尽量绕过血瓶
    }
}

data.prototype.getFirstData = function() {
    return core.clone(this.firstData);
}

main.instance.data = new data();