/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：脚本编辑。
 * 相关文档 _docs/editor.md ~ http://127.0.0.1:1055/_docs/#/editor?id=修改表格
 */

var functions_comment_c456ea59_6018_45ef_8bcc_211a24c627dc = {
	"_type": "object",
	"_data": {
		"events": {
			"_type": "object",
			"_data": {
				"resetGame": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "重置游戏"
				},
				"win": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "游戏获胜"
				},
				"lose": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "游戏失败"
				},
				"changingFloor": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "切换楼层中"
				},
				"afterChangeFloor": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "切换楼层后"
				},
				"flyTo": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "楼层飞行"
				},
				"beforeBattle": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "战前判定"
				},
				"afterBattle": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "战后脚本"
				},
				"afterOpenDoor": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "开门后脚本"
				},
				"afterGetItem": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "道具后脚本"
				},
				"afterPushBox": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "推箱子后"
				}
			}
		},
		"enemys": {
			"_type": "object",
			"_data": {
				"getSpecials": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "怪物特殊属性"
				},
				"getEnemyInfo": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "怪物真实属性"
				},
				"getDamageInfo": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "战斗伤害信息"
				}
			}
		},
		"actions": {
			"_type": "object",
			"_data": {
				"onKeyUp": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "按键处理"
				},
				"onStatusBarClick": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_docs": "点击状态栏",
					"_data": "状态栏点击事件，仅在开启自绘状态栏时生效"
				}
			}
		},
		"control": {
			"_type": "object",
			"_data": {
				"saveData": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "存档操作"
				},
				"loadData": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "读档操作"
				},
				"getStatusLabel": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "状态名定义"
				},
				"triggerDebuff": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "毒衰咒处理"
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
					"_data": "阻激夹域伤害"
				},
				"moveOneStep": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "每步后操作"
				},
				"moveDirectly": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "瞬间移动"
				},
				"parallelDo": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "并行脚本"
				}
			}
		},
		"ui": {
			"_type": "object",
			"_data": {
				"getToolboxItems": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "道具栏显示项"
				},
				"drawStatusBar": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_preview": "statusBar",
					"_data": "自绘状态栏"
				},
				"drawStatistics": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "数据统计"
				},
				"drawAbout": {
					"_leaf": true,
					"_type": "textarea",
					"_lint": true,
					"_data": "关于界面"
				}
			}
		}
	}
}