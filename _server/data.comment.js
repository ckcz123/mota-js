data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc = 
{
    "_leaf": false,
    "_type": "object",
    "_data": {
        "main": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "floorIds": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "在这里按顺序放所有的楼层；其顺序直接影响到楼层传送器、浏览地图和上/下楼器的顺序"
                },
                "images": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "在此存放所有可能使用的图片 \n  图片可以被作为背景图（的一部分），也可以直接用自定义事件进行显示。 \n 图片名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好 \n 建议对于较大的图片，在网上使用在线的“图片压缩工具(http://compresspng.com/zh/)”来进行压缩，以节省流量 \n 依次向后添加"
                },
                "animates": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "在此存放所有可能使用的动画，必须是animate格式，在这里不写后缀名 \n 动画必须放在animates目录下；文件名不能使用中文，不能带空格或特殊字符 \n \"jianji\", \"thunder\" \n 根据需求自行添加"
                },
                "bgms": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "在此存放所有的bgm，和文件名一致。第一项为默认播放项 \n 音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好"
                },
                "sounds": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "在此存放所有的SE，和文件名一致 \n 音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好"
                },
                "startBackground": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "标题界面的背景，建议使用jpg格式以压缩背景图空间"
                },
                "startLogoStyle": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "标题样式：可以改变颜色，也可以写\"display: none\"来隐藏标题"
                },
                "levelChoose": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "难度选择:每个数组的第一个是其在标题界面显示的难度,第二个是在游戏内部传输的字符串,会显示在状态栏,修改此处后需要在project/functions中作相应更改"
                },
                "statusLeftBackground": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "横屏时左侧状态栏的背景样式，可以定义背景图、平铺方式等。\n具体请网上搜索\"css background\"了解写法。\n如果弄一张图片作为背景图，推荐写法：\n\"url(project/images/XXX.png) 0 0/100% 100% no-repeat\"\n图片最好进行一些压缩等操作节省流量。"
                },
                "statusTopBackground": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "竖屏时上方状态栏的背景样式，可以定义背景图、平铺方式等。\n具体请网上搜索\"css background\"了解写法。\n如果弄一张图片作为背景图，推荐写法：\n\"url(project/images/XXX.png) 0 0/100% 100% no-repeat\"\n图片最好进行一些压缩等操作节省流量。"
                },
                "toolsBackground": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "竖屏时下方道具栏的背景样式，可以定义背景图、平铺方式等。\n具体请网上搜索\"css background\"了解写法。\n如果弄一张图片作为背景图，推荐写法：\n\"url(project/images/XXX.png) 0 0/100% 100% no-repeat\"\n图片最好进行一些压缩等操作节省流量。"
                },
            }
        },
        "firstData": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "title": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "游戏名，将显示在标题页面以及切换楼层的界面中"
                },
                "name": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_range": "/^[a-zA-Z0-9_]{1,30}$/.test(thiseval)",
                    "_data": "游戏的唯一英文标识符。由英文、数字、下划线组成，不能超过30个字符。\n此项必须修改，其将直接影响到存档的定位！"
                },
                "version": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "当前游戏版本；版本不一致的存档不能通用。"
                },
                "floorId": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "初始楼层的ID"
                },
                "hero": {
                    "_leaf": false,
                    "_type": "object",
                    "_data": {
                        "name": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "勇士名；可以改成喜欢的"
                        },
                        "lv": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_range": "thiseval==~~thiseval &&thiseval>0",
                            "_data": "初始等级，该项必须为正整数"
                        },
                        "hpmax": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始生命上限，只有在enableHPMax开启时才有效"
                        },
                        "hp": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始生命值"
                        },
                        "atk": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始攻击"
                        },
                        "def": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始防御"
                        },
                        "mdef": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始魔防"
                        },
                        "money": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始金币"
                        },
                        "experience": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始经验"
                        },
                        "items": {
                            "_leaf": false,
                            "_type": "object",
                            "_data": {
                                "keys": {
                                    "_leaf": true,
                                    "_type": "textarea",
                                    "_data": "初始三种钥匙个数"
                                },
                                "constants": {
                                    "_leaf": true,
                                    "_type": "textarea",
                                    "_data": "初始永久道具个数，例如初始送手册可以写 {\"book\": 1}"
                                },
                                "tools": {
                                    "_leaf": true,
                                    "_type": "textarea",
                                    "_data": "初始消耗道具个数，例如初始有两破可以写 {\"pickaxe\": 2}"
                                }
                            }
                        },
                        "flyRange": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "初始可飞的楼层；一般留空数组即可"
                        },
                        "loc": {
                            "_leaf": false,
                            "_type": "object",
                            "_data": {
                                "direction": {
                                    "_leaf": true,
                                    "_type": "textarea",
                                    "_data": "勇士初始方向"
                                },
                                "x": {
                                    "_leaf": true,
                                    "_type": "textarea",
                                    "_data": "勇士初始x坐标"
                                },
                                "y": {
                                    "_leaf": true,
                                    "_type": "textarea",
                                    "_data": "勇士初始y坐标"
                                }
                            }
                        },
                        "flags": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "游戏过程中的变量或flags"
                        },
                        "steps": {
                            "_leaf": true,
                            "_type": "textarea",
                            "_data": "行走步数统计"
                        }
                    }
                },
                "startText": {
                    "_leaf": true,
                    "_type": "event",
                    "_event": "firstArrive",
                    "_data": "游戏开始前剧情。\n可以双击进入事件编辑器。\n如果无剧情直接留一个空数组即可。"
                },
                "shops": {
                    "_leaf": true,
                    "_type": "event",
                    "_event": "shop",
                    "_data": "全局商店，是一个数组，可以双击进入事件编辑器。"
                },
                "levelUp": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "经验升级所需要的数值，是一个数组，可以双击进行编辑。 \n 第一项为初始等级，可以简单留空，也可以写name \n 每一个里面可以含有三个参数 need, name, effect \n need为所需要的经验数值，是一个正整数。请确保need所需的依次递增 \n name为该等级的名称，也可以省略代表使用系统默认值；本项将显示在状态栏中 \n effect为本次升级所执行的操作，可由若干项组成，由分号分开 \n 其中每一项写法和上面的商店完全相同，同样必须是X+=Y的形式，Y是一个表达式，同样可以使用status:xxx或item:xxx代表勇士的某项数值/道具个数"
                }
            }
        },
        "values": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "lavaDamage": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "经过血网受到的伤害"
                },
                "poisonDamage": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "中毒后每步受到的伤害"
                },
                "weakValue": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "衰弱状态下攻防减少的数值\n如果此项不小于1，则作为实际下降的数值（比如10就是攻防各下降10）\n如果在0到1之间则为下降的比例（比如0.3就是下降30%的攻防）"
                },
                "redJewel": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "红宝石加攻击的数值"
                },
                "blueJewel": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "蓝宝石加防御的数值"
                },
                "greenJewel": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "绿宝石加魔防的数值"
                },
                "redPotion": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "红血瓶加血数值"
                },
                "bluePotion": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "蓝血瓶加血数值"
                },
                "yellowPotion": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "黄血瓶加血数值"
                },
                "greenPotion": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "绿血瓶加血数值"
                },
                "sword0": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "空剑的攻击力，此项请保持为0"
                },
                "shield0": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "空盾的防御力，此项请保持为0"
                },
                "sword1": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "铁剑加攻数值"
                },
                "shield1": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "铁盾加防数值"
                },
                "sword2": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "银剑加攻数值"
                },
                "shield2": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "银盾加防数值"
                },
                "sword3": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "骑士剑加攻数值"
                },
                "shield3": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "骑士盾加防数值"
                },
                "sword4": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "圣剑加攻数值"
                },
                "shield4": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "圣盾加防数值"
                },
                "sword5": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "神圣剑加攻数值"
                },
                "shield5": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "神圣盾加防数值"
                },
                "moneyPocket": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "金钱袋加金币的数值"
                },
                "breakArmor": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "破甲的比例（战斗前，怪物附加角色防御的x倍作为伤害）"
                },
                "counterAttack": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "反击的比例（战斗时，怪物每回合附加角色攻击的x倍作为伤害，无视角色防御）"
                },
                "purify": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "净化的比例（战斗前，怪物附加勇士魔防的x倍作为伤害）"
                },
                "hatred": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "仇恨属性中，每杀死一个怪物获得的仇恨值"
                },
                "maxValidHp": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_range": "thiseval==null||thiseval>0",
                    "_data": "最大合法生命值；如果此项不为null且用户通关血量超过本值，则视为作弊，不上传成绩"
                },
                "animateSpeed": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_data": "动画时间，一般300比较合适"
                }
            }
        },
        "flags": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "enableFloor": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在状态栏显示当前楼层"
                },
                "enableLv": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在状态栏显示当前等级"
                },
                "enableHPMax": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否是否启用生命上限"
                },
                "enableMDef": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在状态栏及战斗界面显示魔防（护盾）"
                },
                "enableMoney": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在状态栏、怪物手册及战斗界面显示金币"
                },
                "enableExperience": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在状态栏、怪物手册及战斗界面显示经验"
                },
                "enableLevelUp": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否允许等级提升（进阶）；如果上面enableExperience为false，则此项恒视为false"
                },
                "enableKeys": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在状态栏显示三色钥匙数量"
                },
                "enableDebuff": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否涉及毒衰咒；如果此项为false则不会在状态栏中显示毒衰咒的debuff"
                },
                "flyNearStair": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否需要在楼梯边使用传送器"
                },
                "pickaxeFourDirections": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "使用破墙镐是否四个方向都破坏；如果false则只破坏面前的墙壁"
                },
                "bombFourDirections": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "使用炸弹是否四个方向都会炸；如果false则只炸面前的怪物（即和圣锤等价）"
                },
                "snowFourDirections": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "使用冰冻徽章是否四个方向都会消除熔岩；如果false则只消除面前的熔岩"
                },
                "bigKeyIsBox": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "如果此项为true，则视为钥匙盒，红黄蓝钥匙+1；若为false，则视为大黄门钥匙"
                },
                "equipment": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "剑和盾是否直接作为装备。如果此项为true，则作为装备，需要在道具栏使用，否则将直接加属性。"
                },
                /*
                "enableDeleteItem": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否允许删除（丢弃）道具"
                },
                */
                "enableAddPoint": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否支持加点"
                },
                "enableNegativeDamage": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否支持负伤害（回血）"
                },
                "hatredDecrease": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在和仇恨怪战斗后减一半的仇恨值，此项为false则和仇恨怪不会扣减仇恨值。"
                },
                "betweenAttackCeil": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "夹击方式是向上取整还是向下取整。如果此项为true则为向上取整，为false则为向下取整"
                },
                "startDirectly": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "点击“开始游戏”后是否立刻开始游戏而不显示难度选择界面"
                },
                "canOpenBattleAnimate": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否允许用户开启战斗过程；如果此项为false，则下面两项均强制视为false"
                },
                "showBattleAnimateConfirm": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否在游戏开始时提供“是否开启战斗动画”的选项"
                },
                "battleAnimate": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否默认显示战斗动画；用户可以手动在菜单栏中开关"
                },
                "displayEnemyDamage": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否地图怪物显伤；用户可以手动在菜单栏中开关"
                },
                "displayCritical": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否地图显示临界；用户可以手动在菜单栏中开关"
                },
                "displayExtraDamage": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否地图高级显伤（领域、夹击等）；用户可以手动在菜单栏中开关"
                },
                "enableGentleClick": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否允许轻触（获得面前物品）"
                },
                "potionWhileRouting": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "寻路算法是否经过血瓶；如果该项为false，则寻路算法会自动尽量绕过血瓶"
                },
                "enableViewMaps": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否支持在菜单栏中查看所有楼层的地图"
                },
                "portalWithoutTrigger": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "经过楼梯、传送门时是否能“穿透”。\n穿透的意思是，自动寻路得到的的路径中间经过了楼梯，行走时是否触发楼层转换事件"
                },
                "enableMoveDirectly": {
                    "_leaf": true,
                    "_type": "checkbox",
                    "_bool": "bool",
                    "_data": "是否允许瞬间移动"
                }
            }
        }
    }
}