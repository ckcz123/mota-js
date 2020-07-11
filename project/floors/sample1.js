main.floors.sample1=
{
    "floorId": "sample1",
    "title": "样板 1 层",
    "name": "1",
    "canFlyTo": true,
    "canUseQuickShop": true,
    "defaultGround": "grass",
    "images": [
        {
            "name": "bg.jpg",
            "canvas": "bg",
            "x": 0,
            "y": 0,
            "w": 416,
            "h": 416
        }
    ],
    "weather": [
        "snow",
        6
    ],
    "ratio": 1,
    "map": [
    [  7,131,  8,152,  9,130, 10,152,166,165,132,165,166],
    [  0,  0,  0,  0,  0,  0,  0,152,165,164,  0,162,165],
    [152,152,152,152,121,152,152,152,  0,  0,229,  0,  0],
    [ 43, 33, 44,151,  0,  0,  0,152,165,161,  0,163,165],
    [ 21, 22, 21,151,  0,  0,  0,152,166,165,  0,165,166],
    [151,  0,151,151,  0, 87,  0,152,152,152, 85,153,153],
    [  0,  0,  0,151,  0,  0,  0,152,152,221,  0,221,153],
    [  0,  0,  0,151,  0,  0,  0,121,  0,  0,  0,  0,153],
    [151,  0,151,151,  0,153,153,153,153,153,153,153,153],
    [  0,  0,  0,  0,  0,  0,  0,164,  0,  0,163,  0,  0],
    [  1,  1,  1,  1,  0, 20,  0,  0,  0,162,  0,161,  0],
    [  1,  0,123,  1,  0, 20,124,  0,121,  0,122,  0,126],
    [  1,  0,  0,  1, 88, 20,  0,  0,  0,  0,  0,  0,  0]
],
    "firstArrive": [],
    "events": {
        "4,10": [
            "\t[样板提示]本层楼将会对各类事件进行介绍。",
            "左边是一个仿51层的陷阱做法，上方是商店、快捷商店的使用方法，右上是一个典型的杀怪开门的例子，右下是各类可能的NPC事件。",
            "本样板目前支持的事件列表大致有：\ntext: 显示一段文字（比如你现在正在看到的）\ntip: 左上角显示提示\nshow: 使一个事件有效（可见、可被交互）\nhide: 使一个事件失效（不可见、不可被交互）\ntrigger: 触发另一个地点的事件\nanimate: 显示动画\nbattle: 强制和某怪物战斗\nopenDoor: 无需钥匙开门（例如机关门、暗墙）",
            "openShop: 打开一个全局商店\ndisableShop: 禁用一个全局商店\nchangeFloor: 传送勇士到某层某位置\nchangePos: 传送勇士到当层某位置；转向\nshowImage: 显示图片\nsetCurtain: 更改画面色调\nsetWeather: 更改天气\nmove: 移动事件效果\nmoveHero: 移动勇士效果\nplayBgm: 播放某个背景音乐\npauseBgm: 暂停背景音乐\nresumeBgm: 恢复背景音乐的播放\nplaySound: 播放某个音频",
            "if: 条件判断\nchoices: 提供选项\nsetValue: 设置勇士属性道具，或某个变量/flag\nupdate: 更新状态栏和地图显伤\nwin: 获得胜利（游戏通关）\nlose: 游戏失败\nsleep: 等待多少毫秒\nexit: 立刻结束当前事件\nfunction: 自定义JS脚本\n\n更多支持的事件还在编写中，欢迎您宝贵的意见。",
            "有关各事件的样例，可参见本层一些NPC的写法。\n所有事件样例本层都有介绍。\n\n一个自定义事件处理完后，需要调用{\"type\": \"hide\"}该事件才不会再次出现。",
            {
                "type": "hide"
            }
        ],
        "1,7": [
            {
                "type": "setBlock",
                "number": "redKing",
                "loc": [
                    [
                        1,
                        5
                    ]
                ],
                "time": 1500
            },
            {
                "type": "sleep",
                "time": 500
            },
            "\t[redKing]\b[this,1,5]欢迎来到魔塔，你是第一百位挑战者。\n若你能打败我所有的手下，我就与你一对一的决斗。\n现在你必须接受我的安排。",
            {
                "type": "setBlock",
                "number": "blueKing",
                "loc": [
                    [
                        1,
                        6
                    ],
                    [
                        0,
                        7
                    ],
                    [
                        1,
                        8
                    ],
                    [
                        2,
                        7
                    ]
                ],
                "time": 500
            },
            "\t[hero]\b[hero]什么？",
            {
                "type": "animate",
                "name": "hand",
                "loc": "hero"
            },
            {
                "type": "setValue",
                "name": "status:atk",
                "operator": "/=",
                "value": "10"
            },
            {
                "type": "setValue",
                "name": "status:def",
                "operator": "/=",
                "value": "10"
            },
            {
                "type": "hide",
                "loc": [
                    [
                        1,
                        6
                    ],
                    [
                        0,
                        7
                    ],
                    [
                        2,
                        7
                    ],
                    [
                        1,
                        8
                    ]
                ],
                "time": 500
            },
            {
                "type": "hide",
                "loc": [
                    [
                        1,
                        5
                    ]
                ],
                "time": 500
            },
            {
                "type": "hide"
            },
            {
                "type": "setCurtain",
                "color": [
                    0,
                    0,
                    0
                ],
                "time": 1250
            },
            {
                "type": "sleep",
                "time": 700
            },
            {
                "type": "changeFloor",
                "floorId": "sample1",
                "loc": [
                    1,
                    11
                ],
                "direction": "right",
                "time": 1000
            },
            {
                "type": "trigger",
                "loc": [
                    2,
                    11
                ]
            }
        ],
        "2,11": [
            "\t[杰克,thief]\b[this]喂！醒醒！快醒醒！",
            {
                "type": "setCurtain",
                "time": 1500
            },
            "\t[hero]\b[hero]额，我这是在什么地方？",
            "\t[杰克,thief]\b[this]你被魔王抓了起来扔进了监狱，和我关在了一起，但是幸运的是我在昨天刚刚挖好一条越狱的暗道！",
            {
                "type": "openDoor",
                "loc": [
                    3,
                    11
                ]
            },
            {
                "type": "sleep",
                "time": 300
            },
            "\t[杰克,thief]\b[this]我先走了，祝你好运！",
            {
                "type": "move",
                "time": 750,
                "steps": [
                    "right",
                    "right",
                    "down"
                ]
            },
            "上面是个move事件，可以对NPC等进行移动。\n详见样板中小偷事件的写法。",
            "\t[hero]\b[hero]怎么跑的这么快..."
        ],
        "4,2": [
            "\t[老人,man]\b[this]本塔的商店有两类，全局商店和非全局商店。\n\n所谓非全局商店，就类似于右下角那个卖钥匙的老人一样，一定要碰到才能触发事件。\n\n而全局商店，则能在快捷商店中直接使用。",
            "\t[老人,man]\b[this]要注册一个全局商店，你需要在全塔属性中，找到“全局商店”，并在内添加你的商店信息。",
            "\t[老人,man]\b[this]商店信息添加后，可以在需要的事件处调用{\"type\": \"openShop\"}来打开你添加的全局商店。",
            "\t[老人,man]\b[this]在上面的例子里，左边是一个仿51层的金币商店，右边是一个仿24层的经验商店。\n\n商店被访问后即可在快捷商店中进行使用。",
            "\t[老人,man]\b[this]如果你需要在某层禁用快捷商店，可以在其楼层属性中设置“快捷商店”。\n如果需要永久禁用商店（直到重新通过触碰NPC打开），请使用{\"type\":\"disableShop\"}",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "1,0": [
            {
                "type": "openShop",
                "id": "shop1",
                "open": true
            }
        ],
        "5,0": [
            {
                "type": "openShop",
                "id": "shop2",
                "open": true
            }
        ],
        "7,7": [
            "\t[老人,man]\b[this]这是一个典型的杀怪开门、强制战斗事件。",
            "\t[老人,man]\b[this]下面的那四个箭头表示单向通行，画在任何一个图层都有效。",
            {
                "type": "hide",
                "time": 500
            }
        ],
        "9,7": [
            {
                "type": "closeDoor",
                "id": "specialDoor",
                "loc": [
                    8,
                    7
                ]
            },
            {
                "type": "hide"
            }
        ],
        "10,4": [
            "\t[blackKing]\b[this]你终于还是来了。",
            "\t[hero]\b[hero]放开我们的公主！",
            "\t[blackKing]\b[this]如果我不愿意呢？",
            "\t[hero]\b[hero]无需多说，拔剑吧！",
            {
                "type": "battle",
                "loc": [
                    10,
                    2
                ]
            },
            {
                "type": "openDoor",
                "loc": [
                    8,
                    7
                ]
            },
            "\t[blackKing]没想到你已经变得这么强大了... 算你厉害。\n公主就交给你了，请好好对她。",
            {
                "type": "hide"
            }
        ],
        "10,0": [
            "\t[hero]\b[hero]公主，我来救你了~",
            "\t[公主,princess]\b[this]快救我出去！我受够这里了！",
            "\t[hero]\b[hero]公主别怕，我们走吧~",
            {
                "type": "win",
                "reason": "救出公主"
            }
        ],
        "6,11": [
            "\t[仙子,fairy]\b[this]通过调用 {\"type\": \"closeDoor\"} 可以在空地关上一扇门或墙。\n比如我下面这个机关门。",
            {
                "type": "closeDoor",
                "id": "steelDoor",
                "loc": [
                    6,
                    12
                ]
            },
            "\t[仙子,fairy]\b[this]通过调用 {\"type\": \"openDoor\"} 可以无需钥匙打开一扇门或暗墙。",
            {
                "type": "openDoor",
                "loc": [
                    6,
                    12
                ]
            },
            "\t[仙子,fairy]\b[this]同时，也可以对其它层进行操作，比如楼下的机关门，现在已经为你打开了。",
            {
                "type": "openDoor",
                "loc": [
                    11,
                    10
                ],
                "floorId": "sample0"
            },
            "\t[仙子,fairy]\b[this]如果当前楼层的 show 或 hide 指定了 time 参数，则以动画效果显示，指定的参数作为淡入淡出时间（毫秒）来计算。",
            "\t[仙子,fairy]\b[this]现在到楼下来找我吧~",
            {
                "type": "show",
                "loc": [
                    [
                        12,
                        10
                    ]
                ],
                "floorId": "sample0"
            },
            {
                "type": "hide",
                "time": 500
            }
        ],
        "8,11": [
            {
                "type": "setValue",
                "name": "flag:man_times",
                "operator": "+=",
                "value": "1"
            },
            "\t[老人,man]\b[this]在文字中使用$+{}可以计算并显示一个表达式的结果。\n",
            "\t[老人,man]\b[this]例如：\n你的当前攻击力是${status:atk}，防御力是${status:def}。\n攻防和的十倍是${10*(status:atk+status:def)}，攻防之积是${status:atk*status:def}。\n你有${item:yellowKey}把黄钥匙，${item:blueKey}把蓝钥匙，${item:redKey}把红钥匙。\n你有${item:pickaxe}个破，${item:bomb}个炸，${item:centerFly}个飞。\n这是你第${flag:man_times}次和我对话。",
            "\t[老人,man]\b[this]同时，你也可以通过{\"type\": \"setValue\"}来设置一个勇士的属性、道具，或某个Flag。",
            "\t[老人,man]\b[this]例如：\n现在我将让你的攻防提升50%，再将攻防和的十倍加到生命值上。",
            {
                "type": "setValue",
                "name": "status:atk",
                "operator": "*=",
                "value": "1.5"
            },
            {
                "type": "setValue",
                "name": "status:def",
                "operator": "*=",
                "value": "1.5"
            },
            {
                "type": "setValue",
                "name": "status:hp",
                "operator": "+=",
                "value": "10*(status:atk+status:def)"
            },
            "\t[老人,man]\b[this]再送你500金币，1000经验，1破2炸3飞！",
            {
                "type": "setValue",
                "name": "status:money",
                "operator": "+=",
                "value": "500"
            },
            {
                "type": "setValue",
                "name": "status:exp",
                "operator": "+=",
                "value": "1000"
            },
            {
                "type": "setValue",
                "name": "item:pickaxe",
                "operator": "+=",
                "value": "1"
            },
            {
                "type": "setValue",
                "name": "item:bomb",
                "operator": "+=",
                "value": "2"
            },
            {
                "type": "setValue",
                "name": "item:centerFly",
                "operator": "+=",
                "value": "3"
            },
            "\t[老人,man]\b[this]status:xxx 代表勇士的某个属性。\n其中xxx可取生命、攻击、防御、护盾、金币、经验等很多项。\n\nitem:xxx 代表勇士的某个道具的个数。\nxxx为道具ID，具体可参见items.js中的定义。\n\nflag:xxx 代表某个自定义Flag或变量。\nxxx为Flag/变量名，可以自行定义，由字母、数字和下划线甚至中文组成。\n未定义过而直接取用的Flag默认值为0.",
            "\t[老人,man]\b[this]你现在可以重新和我进行对话，进一步看到属性值的改变。"
        ],
        "10,11": [
            {
                "type": "while",
                "condition": "true",
                "data": [
                    {
                        "type": "switch",
                        "condition": "flag:woman_times",
                        "caseList": [
                            {
                                "case": "0",
                                "action": [
                                    "\t[老人,trader]这是个很复杂的例子，它将教会你如何使用if 语句进行条件判断，以及 choices 提供选项来供用户进行选择。",
                                    "\t[老人,trader]第一次访问我将显示这段文字；从第二次开始将会向你出售钥匙。\n钥匙价格将随着访问次数递增。\n当合计出售了七把钥匙后，将送你一把大黄门钥匙，并消失不再出现。",
                                    "\t[老人,trader]这部分的逻辑比较长，请细心看样板的写法，是很容易看懂并理解的。"
                                ]
                            },
                            {
                                "case": "8",
                                "action": [
                                    "\t[老人,trader]你购买的钥匙已经够多了，再继续卖给你的话我会有危险的。",
                                    "\t[老人,trader]看在你贡献给我这么多钱的份上，送你一把大黄门钥匙吧，希望你能好好用它。",
                                    {
                                        "type": "setValue",
                                        "name": "item:bigKey",
                                        "operator": "+=",
                                        "value": "1"
                                    },
                                    "\t[老人,trader]我先走了，拜拜~",
                                    {
                                        "type": "hide",
                                        "time": 500
                                    },
                                    {
                                        "type": "exit"
                                    }
                                ]
                            },
                            {
                                "case": "default",
                                "action": [
                                    {
                                        "type": "choices",
                                        "text": "\t[老人,trader]少年，你需要钥匙吗？\n我这里有大把的！",
                                        "choices": [
                                            {
                                                "text": "黄钥匙（${9+flag:woman_times}金币）",
                                                "action": [
                                                    {
                                                        "type": "if",
                                                        "condition": "status:money>=9+flag:woman_times",
                                                        "true": [
                                                            {
                                                                "type": "setValue",
                                                                "name": "status:money",
                                                                "operator": "-=",
                                                                "value": "9+flag:woman_times"
                                                            },
                                                            {
                                                                "type": "setValue",
                                                                "name": "item:yellowKey",
                                                                "operator": "+=",
                                                                "value": "1"
                                                            }
                                                        ],
                                                        "false": [
                                                            "\t[老人,trader]你的金钱不足！"
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "蓝钥匙（${18+2*flag:woman_times}金币）",
                                                "action": [
                                                    {
                                                        "type": "if",
                                                        "condition": "status:money>=18+2*flag:woman_times",
                                                        "true": [
                                                            {
                                                                "type": "setValue",
                                                                "name": "status:money",
                                                                "operator": "-=",
                                                                "value": "18+2*flag:woman_times"
                                                            },
                                                            {
                                                                "type": "setValue",
                                                                "name": "item:blueKey",
                                                                "operator": "+=",
                                                                "value": "1"
                                                            },
                                                            {
                                                                "type": "continue"
                                                            }
                                                        ],
                                                        "false": [
                                                            "\t[老人,trader]你的金钱不足！"
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "红钥匙（${36+4*flag:woman_times}金币）",
                                                "action": [
                                                    {
                                                        "type": "if",
                                                        "condition": "status:money>=36+4*flag:woman_times",
                                                        "true": [
                                                            {
                                                                "type": "setValue",
                                                                "name": "status:money",
                                                                "operator": "-=",
                                                                "value": "36+4*flag:woman_times"
                                                            },
                                                            {
                                                                "type": "setValue",
                                                                "name": "item:redKey",
                                                                "operator": "+=",
                                                                "value": "1"
                                                            }
                                                        ],
                                                        "false": [
                                                            "\t[老人,trader]你的金钱不足！",
                                                            {
                                                                "type": "continue"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "text": "离开",
                                                "action": [
                                                    {
                                                        "type": "exit"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "setValue",
                        "name": "flag:woman_times",
                        "operator": "+=",
                        "value": "1"
                    }
                ]
            }
        ],
        "12,11": [
            "\t[老人,recluse]\b[this]使用 {\"type\":\"input\"} 可以弹窗请求玩家输入数字",
            "\t[老人,recluse]\b[this]例如这个例子：即将弹出一个输入窗口，然后会将你的输入结果直接加到你的攻击力上。",
            {
                "type": "input",
                "text": "请输入你要加攻击力的数值："
            },
            {
                "type": "if",
                "condition": "(flag:input>0)",
                "true": [
                    {
                        "type": "setValue",
                        "name": "status:atk",
                        "operator": "+=",
                        "value": "flag:input"
                    },
                    {
                        "type": "tip",
                        "text": "操作成功，攻击+${flag:input}"
                    },
                    "操作成功，攻击+${flag:input}"
                ],
                "false": []
            },
            "\t[老人,recluse]\b[this]具体可参见样板中本事件的写法。"
        ]
    },
    "changeFloor": {
        "4,12": {
            "floorId": "sample0",
            "loc": [
                6,
                0
            ]
        },
        "5,5": {
            "floorId": "sample2",
            "stair": "downFloor",
            "direction": "up"
        },
        "10,12": null
    },
    "afterBattle": {
        "9,6": [
            {
                "type": "setValue",
                "name": "flag:door",
                "operator": "+=",
                "value": "1"
            }
        ],
        "11,6": [
            {
                "type": "setValue",
                "name": "flag:door",
                "operator": "+=",
                "value": "1"
            }
        ]
    },
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "bgmap": [

],
    "fgmap": [

],
    "autoEvent": {
        "10,5": {
            "0": {
                "condition": "flag:door==2",
                "currentFloor": true,
                "priority": 0,
                "delayExecute": false,
                "multiExecute": false,
                "data": [
                    {
                        "type": "openDoor"
                    }
                ]
            },
            "1": null
        }
    },
    "width": 13,
    "height": 13
}