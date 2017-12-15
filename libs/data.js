function data() {

}

data.prototype.init = function() {
    this.firstData = {
        "title": "魔塔样板", // 游戏名，将显示在标题页面以及切换楼层的界面中
        "name": "template", // 游戏的唯一英文标识符。由英文、数字、下划线组成，不能超过20个字符。
        "version": "Ver 1.0.0 (Beta)", // 当前游戏版本；版本不一致的存档不能通用。
        "floorId": "sample0", // 初始楼层ID
        "hero": { // 勇士初始数据
            "name": "阳光", // 勇士名；可以改成喜欢的
            "hp": 1000, // 初始生命值
            "atk": 100, // 初始攻击
            "def": 100, // 初始防御
            "mdef": 100, // 初始魔防
            "money": 100, // 初始金币
            "experience": 1000, // 初始经验
            "items": { // 初始道具个数
                "keys": {
                    "yellowKey": 0,
                    "blueKey": 0,
                    "redKey": 0
                },
                "constants": {},
                "tools": {}
            },
            "flyRange": [], // 初始可飞的楼层；一般留空数组即可
            "loc": {"direction": "up", "x": 6, "y": 10}, // 勇士初始位置
            "flags": { // 游戏过程中的变量或flags
                "poison": false, // 毒
                "weak": false, // 衰
                "curse": false, // 咒
            }
        },
        "startText": [ // 游戏开始前剧情。如果无剧情直接留一个空数组即可。
            "Hi，欢迎来到 HTML5 魔塔样板！\n\n本样板由艾之葵制作，可以让你在不会写任何代码\n的情况下也能做出属于自己的H5魔塔！",
            "这里游戏开始时的剧情。\n定义在data.js的startText处。\n\n你可以在这里写上自己的内容。",
            "赶快来试一试吧！"
        ],
        "shops": { // 定义全局商店（即快捷商店）
            "moneyShop1": { // 商店唯一ID
                "name": "贪婪之神", // 商店名称（标题）
                "icon": "blueShop", // 商店图标，blueShop为蓝色商店，pinkShop为粉色商店
                "textInList": "1F金币商店", // 在快捷商店栏中显示的名称
                "use": "money", // 商店所要使用的。只能是"money"或"experience"。
                "need": "20+10*times*(times+1)",  // 商店需要的金币/经验数值；可以是一个表达式，以times作为参数计算。
                // 这里用到的times为该商店的已经的访问次数。首次访问该商店时times的值为0。
                // 上面的例子是50层商店的计算公式。你也可以写任意其他的计算公式，只要以times作为参数即可。
                // 例如： "need": "25" 就是恒定需要25金币的商店； "need": "20+2*times" 就是第一次访问要20金币，以后每次递增2金币的商店。
                // 如果是对于每个选项有不同的计算公式，写 "need": "-1" 即可。可参见下面的经验商店。
                "text": "勇敢的武士啊，给我${need}金币就可以：", // 显示的文字，需手动加换行符。可以使用${need}表示上面的need值。
                "choices": [ // 商店的选项
                    {"text": "生命+800", "effect": "status:hp+=800"},
                    // 如果有多个effect以分号分开，参见下面的经验商店
                    {"text": "攻击+4", "effect": "status:atk+=4"},
                    {"text": "防御+4", "effect": "status:def+=4"},
                    {"text": "魔防+10", "effect": "status:mdef+=10"}
                    // effect只能对status和items进行操作，不能修改flag值。
                    // 中间只能用+=符号（也就是只能增加某个属性或道具）
                    // 其他effect样例：
                    // "items:yellowKey+=1" 黄钥匙+1
                    // "items:pickaxe+=3" 破墙镐+3
                ]
            },
            "expShop1": { // 商店唯一ID
                "name": "经验之神",
                "icon": "pinkShop",
                "textInList": "1F经验商店",
                "use": "experience", // 该商店使用的是经验进行计算
                "need": "-1", // 如果是对于每个选项所需要的数值不同，这里直接写-1，然后下面选项里给定具体数值
                "text": "勇敢的武士啊，给我若干经验就可以：",
                "choices": [
                    // 在choices中写need，可以针对每个选项都有不同的需求。
                    // 这里的need同样可以以times作为参数，比如 "need": "100+20*times"
                    {"text": "等级+1", "need": "100", "effect": "status:hp+=1000;status:atk+=7;status:def+=7"},
                    // 多个effect直接以分号分开即可。如上面的意思是生命+1000，攻击+7，防御+7。
                    {"text": "攻击+5", "need": "30", "effect": "status:atk+=5"},
                    {"text": "防御+5", "need": "30", "effect": "status:def+=5"},
                ]
            }
        },
    }
    // 各种数值；一些数值可以在这里设置
    this.values = {
        /****** 角色相关 ******/
        "HPMAX": 999999, // HP上限；-1则无上限
        "lavaDamage": 100, // 经过血网受到的伤害
        "poisonDamage": 10, // 中毒后每步受到的伤害
        "weakValue": 20, // 衰弱状态下攻防减少的数值
        /****** 道具相关 ******/
        "redJewel": 3, // 红宝石加攻击的数值
        "blueJewel": 3, // 蓝宝石加防御的数值
        "greenJewel": 5, // 绿宝石加魔防的数值
        "redPotion": 100, // 红血瓶加血数值
        "bluePotion": 250, // 蓝血瓶加血数值
        "yellowPotion": 500, // 黄血瓶加血数值
        "greenPotion": 800, // 绿血瓶加血数值
        "sword1": 10, // 铁剑加攻数值
        "shield1": 10, // 铁盾加防数值
        "sword2": 20, // 银剑加攻数值
        "shield2": 20, // 银盾加防数值
        "sword3": 40, // 骑士剑加攻数值
        "shield3": 40, // 骑士盾加防数值
        "sword4": 80, // 圣剑加攻数值
        "shield4": 80, // 圣盾加防数值
        "sword5": 160, // 神圣剑加攻数值
        "shield5": 160, // 神圣盾加防数值
        "moneyPocket": 500, // 金钱袋加金币的数值

        /****** 系统相关 ******/
        "cannotUseQuickShop": ["MT0"], // 不能使用快捷商店的楼层列表
        'animateSpeed': 500,
    }
    // 系统FLAG，在游戏运行中中请不要修改它。
    this.flags = {

        /****** 角色状态相关 ******/
        "enableMDef": true, // 是否涉及勇士的魔防值；如果此项为false，则状态栏不会显示勇士的魔防值
        "enableExperience": true, // 是否涉及经验值；如果此项为false，则状态栏和怪物手册均将不会显示经验值
        "enableDebuff": true, // 是否涉及毒衰咒；如果此项为false则不会在状态栏中显示毒衰咒的debuff
        /****** 道具相关 ******/
        "flyNearStair": true, // 是否需要在楼梯边使用传送器
        "pickaxeFourDirections": true, // 使用破墙镐是否四个方向都破坏；如果false则只破坏面前的墙壁
        "bigKeyIsBox": false, // 如果此项为true，则视为钥匙盒，红黄蓝钥匙+1；若为false，则视为大黄门钥匙

        /****** 系统相关 ******/
        "startDirectly": true, // 点击“开始游戏”后是否立刻开始游戏而不显示难度选择界面
        "battleAnimate": true, // 是否默认显示战斗动画；用户可以手动在菜单栏中关闭
        "portalWithoutTrigger": true, // 经过楼梯、传送门时是否能“穿透”。穿透的意思是，自动寻路得到的的路径中间经过了楼梯，行走时是否触发楼层转换事件
        "potionWhileRouting": false, // 寻路算法是否经过血瓶；如果该项为false，则寻路算法会自动尽量绕过血瓶
    }
}

data.prototype.getFirstData = function() {
    return core.clone(this.firstData);
}

main.instance.data = new data();