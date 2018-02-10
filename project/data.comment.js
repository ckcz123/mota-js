data_comment_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = 
{
    "main": {
        "useCompress": " 是否使用压缩文件 \n 当你即将发布你的塔时，请使用“JS代码压缩工具”将所有js代码进行压缩，然后将这里的useCompress改为true。 \n 请注意，只有useCompress是false时才会读取floors目录下的文件，为true时会直接读取libs目录下的floors.min.js文件。 \n 如果要进行剧本的修改请务必将其改成false。 \n$select({\"values\":[false]})$end",
        "floorIds": " 在这里按顺序放所有的楼层；其顺序直接影响到楼层传送器的顺序和上楼器/下楼器的顺序 \n$leaf(true)$end",
        "pngs": "  在此存放所有可能使用的图片，只能是png格式，可以不写后缀名 \n  图片可以被作为背景图（的一部分），也可以直接用自定义事件进行显示。 \n 图片名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好 \n 建议对于较大的图片，在网上使用在线的“图片压缩工具(http://compresspng.com/zh/)”来进行压缩，以节省流量 \n 依次向后添加 \n$leaf(true)$end",
        "animates": "  在此存放所有可能使用的动画，必须是animate格式，在这里不写后缀名 \n 动画必须放在animates目录下；文件名不能使用中文，不能带空格或特殊字符 \n \"jianji\", \"thunder\" \n 根据需求自行添加 \n$leaf(true)$end",
        "bgms": " 在此存放所有的bgm，和文件名一致。第一项为默认播放项 \n 音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好 \n$leaf(true)$end",
        "sounds": " 在此存放所有的SE，和文件名一致 \n 音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好 \n$leaf(true)$end"
    },
    "firstData": {
        "title": " 游戏名，将显示在标题页面以及切换楼层的界面中 ",
        "name": " 游戏的唯一英文标识符。由英文、数字、下划线组成，不能超过20个字符。 ",
        "version": " 当前游戏版本；版本不一致的存档不能通用。 ",
        "floorId": " 初始楼层ID ",
        "hero": {
            "name": " 勇士初始数据 \n 勇士名；可以改成喜欢的 ",
            "lv": " 初始等级，该项必须为正整数 \n$range(thiseval==~~thiseval &&thiseval>0)$end",
            "hp": " 初始生命值 ",
            "atk": " 初始攻击 ",
            "def": " 初始防御 ",
            "mdef": " 初始魔防 ",
            "money": " 初始金币 ",
            "experience": " 初始经验 ",
            "items": {
                "keys": {
                    "yellowKey": " 初始道具个数 ",
                    "blueKey": "",
                    "redKey": ""
                },
                "constants": "\n$leaf(true)$end",
                "tools": "\n$leaf(true)$end"
            },
            "flyRange": " 初始可飞的楼层；一般留空数组即可 \n$leaf(true)$end",
            "loc": {
                "direction": " 勇士初始位置 ",
                "x": "",
                "y": ""
            },
            "flags": {
                "poison": " 游戏过程中的变量或flags \n 毒 ",
                "weak": " 衰 ",
                "curse": " 咒 "
            },
            "steps": " 行走步数统计 ",
        },
        "startText": " 游戏开始前剧情。如果无剧情直接留一个空数组即可。 \n$leaf(true)$end",
        "shops": "全局商店\n$leaf(true)$end",/*{
            "moneyShop1": {
                "name": " 定义全局商店（即快捷商店） \n 商店唯一ID \n 商店名称（标题） ",
                "icon": " 商店图标，blueShop为蓝色商店，pinkShop为粉色商店 ",
                "textInList": " 在快捷商店栏中显示的名称 ",
                "use": " 商店所要使用的。只能是\"money\"或\"experience\"。 ",
                "need": " 商店需要的金币/经验数值；可以是一个表达式，以times作为参数计算。 \n 这里用到的times为该商店的已经的访问次数。首次访问该商店时times的值为0。 \n 上面的例子是50层商店的计算公式。你也可以写任意其他的计算公式，只要以times作为参数即可。 \n 例如： \"need\": \"25\" 就是恒定需要25金币的商店； \"need\": \"20+2*times\" 就是第一次访问要20金币，以后每次递增2金币的商店。 \n 如果是对于每个选项有不同的计算公式，写 \"need\": \"-1\" 即可。可参见下面的经验商店。 ",
                "text": " 显示的文字，需手动加换行符。可以使用${need}表示上面的need值。 ",
                "choices": [
                    {
                        "text": "",
                        "effect": " 商店的选项 \n 如果有多个effect以分号分开，参见下面的经验商店 "
                    },
                    {
                        "text": "",
                        "effect": ""
                    },
                    {
                        "text": "",
                        "effect": ""
                    },
                    {
                        "text": "",
                        "effect": " effect只能对status和item进行操作，不能修改flag值。 \n 必须是X+=Y的形式，其中Y可以是一个表达式，以status:xxx或item:xxx为参数 \n 其他effect样例： \n \"item:yellowKey+=1\" 黄钥匙+1 \n \"item:pickaxe+=3\" 破墙镐+3 \n \"status:hp+=2*(status:atk+status:def)\" 将生命提升攻防和的数值的两倍 "
                    }
                ]
            },
            "expShop1": {
                "name": " 商店唯一ID ",
                "icon": "",
                "textInList": "",
                "use": " 该商店使用的是经验进行计算 ",
                "need": " 如果是对于每个选项所需要的数值不同，这里直接写-1，然后下面选项里给定具体数值 ",
                "text": "",
                "choices": [
                    {
                        "text": "",
                        "need": "",
                        "effect": " 在choices中写need，可以针对每个选项都有不同的需求。 \n 这里的need同样可以以times作为参数，比如 \"need\": \"100+20*times\" 多个effect直接以分号分开即可。如上面的意思是生命+1000，攻击+7，防御+7。 "
                    },
                    {
                        "text": "",
                        "need": "",
                        "effect": ""
                    },
                    {
                        "text": "",
                        "need": "",
                        "effect": ""
                    }
                ]
            }
        },*/
        "levelUp": [
            " 经验升级所需要的数值，是一个数组 \n 第一项为初始等级，可以简单留空，也可以写name \n 每一个里面可以含有三个参数 need, name, effect \n need为所需要的经验数值，是一个正整数。请确保need所需的依次递增 \n name为该等级的名称，也可以省略代表使用系统默认值；本项将显示在状态栏中 \n effect为本次升级所执行的操作，可由若干项组成，由分号分开 \n 其中每一项写法和上面的商店完全相同，同样必须是X+=Y的形式，Y是一个表达式，同样可以使用status:xxx或item:xxx代表勇士的某项数值/道具个数 \n$leaf(true)$end",
            {
                "need": "",
                "name": "",
                "effect": " 先将生命提升攻防和的2倍；再将攻击+10，防御+10 "
            },
            {
                "need": "",
                "effect": " effect也允许写一个function，代表本次升级将会执行的操作 \n 依次往下写需要的数值即可 "
            }
        ]
    },
    "values": {
        "HPMAX": " 各种数值；一些数值可以在这里设置\n /****** 角色相关 ******/ \n HP上限；-1则无上限 ",
        "lavaDamage": " 经过血网受到的伤害 ",
        "poisonDamage": " 中毒后每步受到的伤害 ",
        "weakValue": " 衰弱状态下攻防减少的数值 ",
        "redJewel": " /****** 道具相关 ******/ \n 红宝石加攻击的数值 ",
        "blueJewel": " 蓝宝石加防御的数值 ",
        "greenJewel": " 绿宝石加魔防的数值 ",
        "redPotion": " 红血瓶加血数值 ",
        "bluePotion": " 蓝血瓶加血数值 ",
        "yellowPotion": " 黄血瓶加血数值 ",
        "greenPotion": " 绿血瓶加血数值 ",
        "sword0": " 默认装备折断的剑的攻击力 ",
        "shield0": " 默认装备残破的盾的防御力 ",
        "sword1": " 铁剑加攻数值 ",
        "shield1": " 铁盾加防数值 ",
        "sword2": " 银剑加攻数值 ",
        "shield2": " 银盾加防数值 ",
        "sword3": " 骑士剑加攻数值 ",
        "shield3": " 骑士盾加防数值 ",
        "sword4": " 圣剑加攻数值 ",
        "shield4": " 圣盾加防数值 ",
        "sword5": " 神圣剑加攻数值 ",
        "shield5": " 神圣盾加防数值 ",
        "moneyPocket": " 金钱袋加金币的数值 ",
        "breakArmor": " /****** 怪物相关 ******/ \n 破甲的比例（战斗前，怪物附加角色防御的x%作为伤害） ",
        "counterAttack": " 反击的比例（战斗时，怪物每回合附加角色攻击的x%作为伤害，无视角色防御） ",
        "purify": " 净化的比例（战斗前，怪物附加勇士魔防的x倍作为伤害） ",
        "hatred": " 仇恨属性中，每杀死一个怪物获得的仇恨值 ",
        "animateSpeed": " /****** 系统相关 ******/ \n 动画时间 "
    },
    "flags": {
        "enableFloor": " 系统FLAG，在游戏运行中中请不要修改它。 /****** 状态栏相关 ******/ \n 是否在状态栏显示当前楼层 \n$select({\"values\":[true,false]})$end",
        "enableLv": " 是否在状态栏显示当前等级 \n$select({\"values\":[true,false]})$end",
        "enableMDef": " 是否在状态栏及战斗界面显示魔防（护盾） \n$select({\"values\":[true,false]})$end",
        "enableMoney": " 是否在状态栏、怪物手册及战斗界面显示金币 \n$select({\"values\":[true,false]})$end",
        "enableExperience": " 是否在状态栏、怪物手册及战斗界面显示经验 \n$select({\"values\":[true,false]})$end",
        "enableLevelUp": " 是否允许等级提升（进阶）；如果上面enableExperience为false，则此项恒视为false \n$select({\"values\":[true,false]})$end",
        "enableDebuff": " 是否涉及毒衰咒；如果此项为false则不会在状态栏中显示毒衰咒的debuff ////// 上述的几个开关将直接影响状态栏的显示效果 ////// \n$select({\"values\":[true,false]})$end",
        "flyNearStair": " /****** 道具相关 ******/ \n 是否需要在楼梯边使用传送器 \n$select({\"values\":[true,false]})$end",
        "pickaxeFourDirections": " 使用破墙镐是否四个方向都破坏；如果false则只破坏面前的墙壁 \n$select({\"values\":[true,false]})$end",
        "bombFourDirections": " 使用炸弹是否四个方向都会炸；如果false则只炸面前的怪物（即和圣锤等价） \n$select({\"values\":[true,false]})$end",
        "bigKeyIsBox": " 如果此项为true，则视为钥匙盒，红黄蓝钥匙+1；若为false，则视为大黄门钥匙 \n$select({\"values\":[true,false]})$end",
        "equipment": " 剑和盾是否直接作为装备。如果此项为true，则作为装备，需要在道具栏使用，否则将直接加属性。 \n$select({\"values\":[true,false]})$end",
        "enableDeleteItem": " 是否允许删除（丢弃）道具 \n$select({\"values\":[true,false]})$end",
        "enableNegativeDamage": " /****** 怪物相关 ******/ \n 是否支持负伤害（回血） \n$select({\"values\":[true,false]})$end",
        "hatredDecrease": " 是否在和仇恨怪战斗后减一半的仇恨值，此项为false则和仇恨怪不会扣减仇恨值。 \n$select({\"values\":[true,false]})$end", 
        "betweenAttackCeil": " 夹击方式是向上取整还是向下取整。如果此项为true则为向上取整，为false则为向下取整 \n$select({\"values\":[true,false]})$end", 
        "startDirectly": " /****** 系统相关 ******/ \n 点击“开始游戏”后是否立刻开始游戏而不显示难度选择界面 \n$select({\"values\":[true,false]})$end",
        "canOpenBattleAnimate": " 是否允许用户开启战斗过程；如果此项为false，则下面两项均强制视为false \n$select({\"values\":[true,false]})$end",
        "showBattleAnimateConfirm": " 是否在游戏开始时提供“是否开启战斗动画”的选项 \n$select({\"values\":[true,false]})$end",
        "battleAnimate": " 是否默认显示战斗动画；用户可以手动在菜单栏中开关 \n$select({\"values\":[true,false]})$end",
        "displayEnemyDamage": " 是否地图怪物显伤；用户可以手动在菜单栏中开关 \n$select({\"values\":[true,false]})$end",
        "displayExtraDamage": " 是否地图高级显伤（领域、夹击等）；用户可以手动在菜单栏中开关 \n$select({\"values\":[true,false]})$end",
        "enableGentleClick": " 是否允许轻触（获得面前物品） \n$select({\"values\":[true,false]})$end",
        "potionWhileRouting": " 寻路算法是否经过血瓶；如果该项为false，则寻路算法会自动尽量绕过血瓶 \n$select({\"values\":[true,false]})$end",
        "enableViewMaps": " 是否支持在菜单栏中查看所有楼层的地图 \n$select({\"values\":[true,false]})$end",
        "portalWithoutTrigger": " 经过楼梯、传送门时是否能“穿透”。穿透的意思是，自动寻路得到的的路径中间经过了楼梯，行走时是否触发楼层转换事件 \n$select({\"values\":[true,false]})$end",
        "enableMoveDirectly": " 是否允许瞬间移动 \n$select({\"values\":[true,false]})$end"
    }
}