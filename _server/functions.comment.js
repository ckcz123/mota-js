functions_comment_c456ea59_6018_45ef_8bcc_211a24c627dc = 
{
    "_leaf": false,
    "_type": "object",
    "_data": {
        "events": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "initGame": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "游戏开始前的一些初始化操作"
                },
                "setInitData": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "不同难度分别设置初始属性"
                },
                "win": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "游戏获胜事件"
                },
                "lose": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "游戏失败事件"
                },
                "afterChangeFloor": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "转换楼层结束的事件"
                },
                "addPoint": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "加点事件"
                },
                "afterBattle": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "战斗结束后触发的事件"
                },
                "afterOpenDoor": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "开一个门后触发的事件"
                },
                "afterGetItem": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "获得一个道具后触发的事件"
                },
                "afterChangeLight": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "改变亮灯之后，可以触发的事件"
                },
                "afterPushBox": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "推箱子后的事件"
                },
                "afterUseBomb": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "使用炸弹/圣锤后的事件"
                },
                "beforeSaveData": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "即将存档前可以执行的操作"
                },
                "afterLoadData": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "读档事件后，载入事件前，可以执行的操作"
                },
                "canUseQuickShop": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "当前能否使用快捷商店"
                }
            }
        },
        "enemys": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "getSpecials": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "怪物特殊属性的定义（获得怪物的特殊属性）"
                },
                "getEnemyInfo": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "获得某个怪物的当前属性数据\n该函数主要是会被伤害计算和怪物手册等使用"
                },
                "getDamageInfo": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "获得战斗伤害信息（实际伤害计算函数）"
                },
                "updateEnemys": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "更新怪物数据，可以在这里对怪物属性和数据进行动态更新"
                }
            }
        },
        "actions": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "onKeyUp": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "按键处理；可以在这里自定义快捷键，详见文档-个性化-自定义快捷键"
                }
            }
        },
        "control": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "flyTo": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "使用楼层传送器飞到某层"
                },
                "updateStatusBar": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "更新状态栏"
                },
                "updateCheckBlock": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "阻激夹域的伤害值计算"
                }
            }
        },
        "ui": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "drawStatistics": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "地图数据统计项的注册"
                },
                "drawAbout": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "绘制“关于”界面"
                }
            }
        },
        "plugins": {
            "_leaf": false,
            "_type": "object",
            "_data": {
                "parallelDo": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "并行事件处理"
                },
                "plugin": {
                    "_leaf": true,
                    "_type": "textarea",
                    "_lint": true,
                    "_data": "自定义插件编写"
                }
            }
        }
    }
}