var events_c12a15a8_c380_4b28_8144_256cba95f760 = 
{
	"commonEvent": {
		"加点事件": [
			{
				"type": "comment",
				"text": "通过传参，flag:arg1 表示当前应该的加点数值"
			},
			{
				"type": "choices",
				"choices": [
					{
						"text": "攻击+${1*flag:arg1}",
						"action": [
							{
								"type": "setValue",
								"name": "status:atk",
								"operator": "+=",
								"value": "1*flag:arg1"
							}
						]
					},
					{
						"text": "防御+${2*flag:arg1}",
						"action": [
							{
								"type": "setValue",
								"name": "status:def",
								"operator": "+=",
								"value": "2*flag:arg1"
							}
						]
					},
					{
						"text": "生命+${200*flag:arg1}",
						"action": [
							{
								"type": "setValue",
								"name": "status:hp",
								"operator": "+=",
								"value": "200*flag:arg1"
							}
						]
					}
				]
			}
		],
		"回收钥匙商店": [
			{
				"type": "comment",
				"text": "此事件在全局商店中被引用了(全局商店keyShop)"
			},
			{
				"type": "comment",
				"text": "解除引用前勿删除此事件"
			},
			{
				"type": "comment",
				"text": "玩家在快捷列表（V键）中可以使用本公共事件"
			},
			{
				"type": "while",
				"condition": "1",
				"data": [
					{
						"type": "choices",
						"text": "\t[商人,trader]你有多余的钥匙想要出售吗？",
						"choices": [
							{
								"text": "黄钥匙（10金币）",
								"color": [
									255,
									255,
									0,
									1
								],
								"action": [
									{
										"type": "if",
										"condition": "item:yellowKey >= 1",
										"true": [
											{
												"type": "setValue",
												"name": "item:yellowKey",
												"operator": "-=",
												"value": "1"
											},
											{
												"type": "setValue",
												"name": "status:money",
												"operator": "+=",
												"value": "10"
											}
										],
										"false": [
											"\t[商人,trader]你没有黄钥匙！"
										]
									}
								]
							},
							{
								"text": "蓝钥匙（50金币）",
								"color": [
									0,
									0,
									255,
									1
								],
								"action": [
									{
										"type": "if",
										"condition": "item:blueKey >= 1",
										"true": [
											{
												"type": "setValue",
												"name": "item:blueKey",
												"operator": "-=",
												"value": "1"
											},
											{
												"type": "setValue",
												"name": "status:money",
												"operator": "+=",
												"value": "50"
											}
										],
										"false": [
											"\t[商人,trader]你没有蓝钥匙！"
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
	"commonEventTemplate": {
		"检测音乐如果没有开启则系统提示开启": [
			{
				"type": "if",
				"condition": "!core.musicStatus.bgmStatus",
				"true": [
					"\t[系统提示]你当前音乐处于关闭状态，本塔开音乐游戏效果更佳"
				],
				"false": []
			}
		],
		"仿新新魔塔一次性商人": [
			{
				"type": "if",
				"condition": "switch:A",
				"true": [
					"\t[行商,trader]\b[this]这是购买我的道具后我给玩家的提示。",
					{
						"type": "comment",
						"text": "下一条指令可视情况使用或不使用"
					},
					{
						"type": "hide",
						"remove": true,
						"time": 250,
						"loc": [
							[]
						]
					}
				],
				"false": [
					{
						"type": "confirm",
						"text": "我有3把黄钥匙，\n你出50金币就卖给你。",
						"yes": [
							{
								"type": "if",
								"condition": "status:money>=50",
								"true": [
									{
										"type": "setValue",
										"name": "status:money",
										"operator": "-=",
										"value": "50"
									},
									{
										"type": "setValue",
										"name": "item:yellowKey",
										"operator": "+=",
										"value": "3"
									},
									{
										"type": "playSound",
										"name": "确定",
										"stop": true
									},
									{
										"type": "setValue",
										"name": "switch:A",
										"value": "true"
									}
								],
								"false": [
									{
										"type": "playSound",
										"name": "操作失败"
									},
									"\t[行商,trader]\b[this]你的金币不足！"
								]
							}
						],
						"no": []
					}
				]
			}
		],
		"全地图选中一个点": [
			{
				"type": "comment",
				"text": "全地图选中一个点，需要用鼠标或触屏操作"
			},
			{
				"type": "setValue",
				"name": "temp:X",
				"value": "status:x"
			},
			{
				"type": "setValue",
				"name": "temp:Y",
				"value": "status:y"
			},
			{
				"type": "tip",
				"text": "再次点击闪烁位置确认"
			},
			{
				"type": "while",
				"condition": "true",
				"data": [
					{
						"type": "drawSelector",
						"image": "winskin.png",
						"code": 1,
						"x": "32*temp:X",
						"y": "32*temp:Y",
						"width": 32,
						"height": 32
					},
					{
						"type": "wait"
					},
					{
						"type": "if",
						"condition": "(flag:type === 1)",
						"true": [
							{
								"type": "if",
								"condition": "((temp:X===flag:x)&&(temp:Y===flag:y))",
								"true": [
									{
										"type": "break",
										"n": 1
									}
								]
							},
							{
								"type": "setValue",
								"name": "temp:X",
								"value": "flag:x"
							},
							{
								"type": "setValue",
								"name": "temp:Y",
								"value": "flag:y"
							}
						]
					}
				]
			},
			{
				"type": "drawSelector",
				"code": 1
			},
			{
				"type": "comment",
				"text": "流程进行到这里可以对[X,Y]点进行处理，比如"
			},
			{
				"type": "closeDoor",
				"id": "yellowDoor",
				"loc": [
					"temp:X",
					"temp:Y"
				]
			}
		],
		"多阶段Boss战斗": [
			{
				"type": "comment",
				"text": "多阶段boss，请直接作为战后事件使用"
			},
			{
				"type": "setValue",
				"name": "switch:A",
				"operator": "+=",
				"value": "1"
			},
			{
				"type": "switch",
				"condition": "switch:A",
				"caseList": [
					{
						"case": "1",
						"action": [
							{
								"type": "setBlock",
								"number": "redSlime",
								"loc": [
									[]
								]
							},
							"\t[2阶段boss,redSlime]\b[this]你以为你已经打败我了吗？没听说过史莱姆有九条命吗？"
						]
					},
					{
						"case": "2",
						"action": [
							{
								"type": "setBlock",
								"number": "blackSlime",
								"loc": [
									[]
								]
							},
							"\t[3阶段boss,blackSlime]\b[this]不能消灭我的，只会让我更强大！"
						]
					},
					{
						"case": "3",
						"action": [
							{
								"type": "setBlock",
								"number": "slimelord",
								"loc": [
									[]
								]
							},
							"\t[4阶段boss,slimelord]\b[this]我还能打！"
						]
					},
					{
						"case": "4",
						"action": [
							"\t[4阶段boss,slimelord]我一定会回来的！"
						]
					}
				]
			}
		]
	}
}