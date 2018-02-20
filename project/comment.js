comment_c456ea59_6018_45ef_8bcc_211a24c627dc = 
{
    "items" : {
        'items':{
            'cls': "只能取keys(钥匙) items(宝石、血瓶) constants(物品) tools(道具)\n$select({\"values\":[\"keys\",\"items\",\"constants\",\"tools\"]})$end", 
            'name': '名称', 
            'text': '道具在道具栏中显示的描述',
            'isEquipment': '物品是否属于装备(仅在core.flags.equipment时有效)\n$select({\"values\":[true,false]})$end'
        },
        'itemEffect':'cls为items的即捡即用类物品的效果,执行时会对这里的字符串执行eval()',
        'itemEffectTip':'cls为items的即捡即用类物品,在获得时左上角额外显示的文字,执行时会对这里的字符串执行eval()得到字符串'
    },
    "items_template" : {'cls': 'items', 'name': '新物品'},
    "enemys" : {
        'name': '名称', 
        'hp': '生命值', 
        'atk': '攻击力', 
        'def': '防御力', 
        'money': '金币', 
        'experience': '经验', 
        'special': '特殊属性\n\n0:无,1:先攻,2:魔攻,3:坚固,4:2连击,\n5:3连击,6:n连击,7:破甲,8:反击,9:净化,\n10:模仿,11:吸血,12:中毒,13:衰弱,14:诅咒,\n15:领域,16:夹击,17:仇恨,18:阻击,19:自爆,\n20:无敌,21:退化,22:固伤\n\n多个属性例如用[1,4,11]表示先攻2连击吸血\n模仿怪的攻防设为0就好\n$leaf(true)$end', 
        'value': '特殊属性的数值\n领域怪需要加value表示领域伤害的数值\n吸血怪需要在后面添加value代表吸血比例', 
        'zoneSquare': '领域怪zoneSquare代表是否九宫格伤害',
        'range': 'range可选，代表领域伤害的范围；不加默认为1\n$range((thiseval==~~thiseval && thiseval>0)||thiseval==null)$end',
        'bomb':' 加入 "bomb": false 代表该怪物不可被炸弹或圣锤炸掉\n$select({\"values\":[true,false]})$end',
        'point': 'point可以在打败怪物后进行加点，详见文档说明\n$range((thiseval==~~thiseval && thiseval>0)||thiseval==null)$end',
        'n': '多连击需要在后面指定n代表是几连击\n$range((thiseval==~~thiseval && thiseval>0)||thiseval==null)$end',
        'atkValue':'退化时勇士下降的攻击力点数\n$range(thiseval==~~thiseval||thiseval==null)$end',
        'defValue':'退化时勇士下降的防御力点数\n$range(thiseval==~~thiseval||thiseval==null)$end',
        'damage':'战前扣血的点数\n$range(thiseval==~~thiseval||thiseval==null)$end'
    },
    "enemys_template" : {'name': '新敌人', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'special': 0},
    "floors" : {
        'floor' : {
            "floorId": "文件名和floorId需要保持完全一致 \n楼层唯一标识符仅能由字母、数字、下划线组成，且不能由数字开头 \n推荐用法：第20层就用MT20，第38层就用MT38，地下6层就用MT_6（用下划线代替负号），隐藏3层用MT3h（h表示隐藏），等等 \n楼层唯一标识符，需要和名字完全一致 \n这里不能更改floorId,请通过另存为来实现\n$range(false)$end",
            "title": "楼层中文名 ",
            "name": "显示在状态栏中的层数 ",
            "canFlyTo": "该楼能否被楼传器飞到（不能的话在该楼也不允许使用楼传器） \n$select({\"values\":[true,false]})$end",
            "canUseQuickShop": "该层是否允许使用快捷商店 \n$select({\"values\":[true,false]})$end",
            "defaultGround": "默认地面的图块ID（terrains中） ",
            "png": "背景图；你可以选择一张png图片来作为背景素材。详细用法请参见文档“自定义素材”中的说明。 \n$leaf(true)$end",
            "color": "该层的默认画面色调。本项可不写（代表无色调），如果写需要是一个RGBA数组。 \n$leaf(true)$end",
            "bgm": "到达该层后默认播放的BGM。本项可忽略。 ",
            //"map": "地图数据，需要是13x13，建议使用地图生成器来生成 ",
            "firstArrive": "第一次到该楼层触发的事件 \n$leaf(true)$end",
        },
        'loc' : {
            "events": "该楼的所有可能事件列表 \n$leaf(true)$end",
            "changeFloor": "楼层转换事件；该事件不能和上面的events有冲突（同位置点），否则会被覆盖 \n$leaf(true)$end",
            "afterBattle": "战斗后可能触发的事件列表 \n$leaf(true)$end",
            "afterGetItem": "获得道具后可能触发的事件列表 \n$leaf(true)$end",
            "afterOpenDoor": "开完门后可能触发的事件列表 \n$leaf(true)$end",
            "cannotMove": "每个图块不可通行的方向 \n 可以在这里定义每个点不能前往哪个方向，例如悬崖边不能跳下去 \n'x,y': ['up', 'left'], // (x,y)点不能往上和左走\n$leaf(true)$end",
        }
    },
    /* 
    'floors_template' : {
        "floorId": "tempfloor",
        "title": "主塔 0 层",
        "name": "0",
        "canFlyTo": true,
        "canUseQuickShop": true,
        "defaultGround": "ground",
        "map": [
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
        ],
        "firstArrive": [],
        "events": {},
        "changeFloor": {},
        "afterBattle": {},
        "afterGetItem": {},
        "afterOpenDoor": {}
    }, */
}