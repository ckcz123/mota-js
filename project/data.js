var data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = 
{
	"main": {
		"floorIds": [
			"sample0",
			"sample1",
			"sample2",
			"MT0"
		],
		"floorPartitions": [],
		"images": [
			"bear.png",
			"bg.jpg",
			"dragon.png",
			"hero.png",
			"winskin.png"
		],
		"tilesets": [
			"magictower.png"
		],
		"animates": [
			"hand",
			"sword",
			"zone"
		],
		"bgms": [
			"bgm.mp3"
		],
		"sounds": [
			"attack.mp3",
			"bomb.mp3",
			"cancel.mp3",
			"centerFly.mp3",
			"confirm.mp3",
			"cursor.mp3",
			"door.mp3",
			"equip.mp3",
			"error.mp3",
			"floor.mp3",
			"gem.mp3",
			"icePickaxe.mp3",
			"item.mp3",
			"jump.mp3",
			"load.mp3",
			"open_ui.mp3",
			"pickaxe.mp3",
			"recovery.mp3",
			"save.mp3",
			"shop.mp3",
			"zone.mp3"
		],
		"fonts": [],
		"nameMap": {
			"确定": "confirm.mp3",
			"取消": "cancel.mp3",
			"操作失败": "error.mp3",
			"光标移动": "cursor.mp3",
			"打开界面": "open_ui.mp3",
			"读档": "load.mp3",
			"存档": "save.mp3",
			"获得道具": "item.mp3",
			"回血": "recovery.mp3",
			"炸弹": "bomb.mp3",
			"飞行器": "centerFly.mp3",
			"开关门": "door.mp3",
			"上下楼": "floor.mp3",
			"跳跃": "jump.mp3",
			"破墙镐": "pickaxe.mp3",
			"破冰镐": "icePickaxe.mp3",
			"宝石": "gem.mp3",
			"阻激夹域": "zone.mp3",
			"穿脱装备": "equip.mp3",
			"背景音乐": "bgm.mp3",
			"攻击": "attack.mp3",
			"背景图": "bg.jpg",
			"商店": "shop.mp3",
			"领域": "zone"
		},
		"levelChoose": [
			{
				"title": "简单",
				"name": "Easy",
				"hard": 1,
				"color": [
					64,
					255,
					85,
					1
				],
				"action": [
					{
						"type": "comment",
						"text": "在这里写该难度需执行的事件"
					}
				]
			},
			{
				"title": "普通",
				"name": "Normal",
				"hard": 2,
				"color": [
					255,
					221,
					32,
					1
				],
				"action": []
			},
			{
				"title": "困难",
				"name": "Hard",
				"hard": 3,
				"color": [
					255,
					68,
					64,
					1
				],
				"action": []
			}
		],
		"equipName": [
			"武器",
			"盾牌"
		],
		"startBgm": null,
		"styles": {
			"startBackground": "project/images/bg.jpg",
			"startVerticalBackground": "project/images/bg.jpg",
			"startLogoStyle": "color: black",
			"startButtonsStyle": "background-color: #32369F; opacity: 0.85; color: #FFFFFF; border: #FFFFFF 2px solid; caret-color: #FFD700;",
			"statusLeftBackground": "url(project/materials/ground.png) repeat",
			"statusTopBackground": "url(project/materials/ground.png) repeat",
			"toolsBackground": "black",
			"borderColor": [
				0,
				0,
				0,
				1
			],
			"statusBarColor": [
				255,
				255,
				255,
				1
			],
			"selectColor": [
				255,
				215,
				0,
				1
			],
			"floorChangingStyle": "background-color: black; color: white",
			"font": "Verdana"
		},
		"splitImages": [
			{
				"name": "dragon.png",
				"width": 384,
				"height": 96,
				"prefix": "dragon_"
			}
		]
	},
	"firstData": {
		"title": "魔塔样板",
		"name": "template",
		"version": "Ver 2.10.0",
		"floorId": "sample0",
		"hero": {
			"image": "hero.png",
			"animate": false,
			"name": "阳光",
			"lv": 1,
			"hpmax": 9999,
			"hp": 1000,
			"manamax": -1,
			"mana": 0,
			"atk": 100,
			"def": 100,
			"mdef": 0,
			"money": 0,
			"exp": 0,
			"equipment": [],
			"items": {
				"constants": {},
				"tools": {},
				"equips": {}
			},
			"loc": {
				"direction": "up",
				"x": 6,
				"y": 10
			},
			"flags": {},
			"followers": [],
			"steps": 0
		},
		"startCanvas": [
			{
				"type": "comment",
				"text": "在这里可以用事件来自定义绘制标题界面的背景图等"
			},
			{
				"type": "comment",
				"text": "也可以直接切换到其他楼层（比如某个开始剧情楼层）进行操作。"
			},
			{
				"type": "previewUI",
				"action": [
					{
						"type": "fillRect",
						"x": 0,
						"y": 0,
						"width": "core._PX_ || core.__PIXELS__",
						"height": "core._PY_ || core.__PIXELS__",
						"style": [
							82,
							82,
							82,
							1
						]
					},
					{
						"type": "setAttribute",
						"align": "center"
					},
					{
						"type": "fillBoldText",
						"x": "(core._PX_ || core.__PIXELS__) / 2",
						"y": 80,
						"style": [
							255,
							255,
							255,
							1
						],
						"strokeStyle": [
							0,
							0,
							0,
							1
						],
						"font": "bold 40px Verdana",
						"text": "${core.firstData.title}"
					}
				]
			},
			{
				"type": "setValue",
				"name": "flag:selection",
				"value": "0"
			},
			{
				"type": "comment",
				"text": "在右下方自绘一个对话框进行显示选择项"
			},
			{
				"type": "previewUI",
				"action": [
					{
						"type": "fillRect",
						"x": 230,
						"y": 250,
						"width": 150,
						"height": 142,
						"radius": 10,
						"style": [
							50,
							54,
							159,
							0.85
						]
					},
					{
						"type": "strokeRect",
						"x": 230,
						"y": 250,
						"width": 150,
						"height": 142,
						"radius": 10,
						"style": [
							255,
							255,
							255,
							1
						],
						"lineWidth": 2
					},
					{
						"type": "fillBoldText",
						"x": 305,
						"y": 290,
						"style": [
							255,
							255,
							255,
							1
						],
						"font": "bold 25px Verdana",
						"text": "开始游戏"
					},
					{
						"type": "fillBoldText",
						"x": 305,
						"y": 330,
						"font": "bold 25px Verdana",
						"text": "读取存档"
					},
					{
						"type": "fillBoldText",
						"x": 305,
						"y": 370,
						"font": "bold 25px Verdana",
						"text": "回放录像"
					}
				]
			},
			{
				"type": "while",
				"condition": "1",
				"data": [
					{
						"type": "drawSelector",
						"image": "winskin.png",
						"code": 1,
						"x": 245,
						"y": "261 + 40*flag:selection",
						"width": 120,
						"height": 40
					},
					{
						"type": "wait",
						"data": [
							{
								"case": "keyboard",
								"keycode": "13,32",
								"break": true,
								"action": [
									{
										"type": "switch",
										"condition": "flag:selection",
										"caseList": [
											{
												"case": "0",
												"action": [
													{
														"type": "comment",
														"text": "在“开始游戏”确定"
													},
													{
														"type": "break",
														"n": 1
													}
												]
											},
											{
												"case": "1",
												"action": [
													{
														"type": "comment",
														"text": "在“读取存档”确定"
													},
													{
														"type": "callLoad"
													}
												]
											},
											{
												"case": "2",
												"action": [
													{
														"type": "comment",
														"text": "在“回放录像”确定"
													},
													{
														"type": "if",
														"condition": "(!core.isReplaying())",
														"true": [
															{
																"type": "function",
																"function": "function(){\ncore.chooseReplayFile()\n}"
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
								"case": "keyboard",
								"keycode": "38",
								"break": true,
								"action": [
									{
										"type": "comment",
										"text": "光标上键"
									},
									{
										"type": "setValue",
										"name": "flag:selection",
										"value": "(flag:selection + 2) % 3"
									}
								]
							},
							{
								"case": "keyboard",
								"keycode": "40",
								"break": true,
								"action": [
									{
										"type": "comment",
										"text": "光标下键"
									},
									{
										"type": "setValue",
										"name": "flag:selection",
										"value": "(flag:selection + 1) % 3"
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									245,
									365
								],
								"py": [
									261,
									300
								],
								"break": true,
								"action": [
									{
										"type": "comment",
										"text": "点击“开始游戏”"
									},
									{
										"type": "break",
										"n": 1
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									245,
									365
								],
								"py": [
									301,
									340
								],
								"break": true,
								"action": [
									{
										"type": "comment",
										"text": "点击“读取存档”"
									},
									{
										"type": "callLoad"
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									245,
									365
								],
								"py": [
									341,
									380
								],
								"break": true,
								"action": [
									{
										"type": "comment",
										"text": "点击“播放录像”"
									},
									{
										"type": "if",
										"condition": "(!core.isReplaying())",
										"true": [
											{
												"type": "function",
												"function": "function(){\ncore.chooseReplayFile()\n}"
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
				"name": "flag:selection",
				"value": "null"
			},
			{
				"type": "drawSelector",
				"code": 1
			},
			{
				"type": "clearMap"
			},
			{
				"type": "function",
				"function": "function(){\ncore.control.checkBgm()\n}"
			},
			{
				"type": "if",
				"condition": "(main.levelChoose.length == 0)",
				"true": [
					{
						"type": "comment",
						"text": "没有难度选择：直接开始游戏"
					}
				],
				"false": [
					{
						"type": "comment",
						"text": "难度选择：作为样例，这里只提供了一个显示选择项。"
					},
					{
						"type": "function",
						"function": "function(){\nvar choices = [];\nmain.levelChoose.forEach(function (one) {\n\tchoices.push({\n\t\t\"text\": one.title || '',\n\t\t\"action\": [\n\t\t\t{ \"type\": \"function\", \"function\": \"function() { core.status.hard = '\" + (one.name || '') + \"'; }\" }\n\t\t]\n\t});\n})\ncore.insertAction({ \"type\": \"choices\", \"choices\": choices });\n}"
					},
					{
						"type": "comment",
						"text": "你也可以仿照上面的样例进行自己创建等待用户操作来处理不同的难度分歧。\n如需自己处理，请设置 core.status.hard \n（例如，自定义js脚本：core.status.hard = 'Easy' ）"
					}
				]
			},
			{
				"type": "clearMap"
			},
			{
				"type": "comment",
				"text": "接下来会执行startText中的事件"
			},
			{
				"type": "comment",
				"text": "状态栏默认处于隐藏状态；可以使用“显示状态栏”事件进行显示。"
			}
		],
		"startText": [
			{
				"type": "comment",
				"text": "初始剧情"
			},
			"Hi，欢迎来到 HTML5 魔塔样板！\n\n本样板由艾之葵制作，可以让你在不会写任何代码\n的情况下也能做出属于自己的H5魔塔！",
			"这里游戏开始时的剧情。\n\n你可以在这里写上自己的内容。\n赶快来试一试吧！"
		],
		"shops": [
			{
				"id": "shop1",
				"text": "\t[贪婪之神,moneyShop]勇敢的武士啊, 给我${20+2*flag:shop1}金币就可以：",
				"textInList": "1F金币商店",
				"mustEnable": false,
				"disablePreview": false,
				"choices": [
					{
						"text": "生命+800",
						"need": "status:money>=20+2*flag:shop1",
						"action": [
							{
								"type": "comment",
								"text": "新版商店中需要手动扣减金币和增加访问次数"
							},
							{
								"type": "setValue",
								"name": "status:money",
								"operator": "-=",
								"value": "20+2*flag:shop1"
							},
							{
								"type": "setValue",
								"name": "flag:shop1",
								"operator": "+=",
								"value": "1"
							},
							{
								"type": "setValue",
								"name": "status:hp",
								"operator": "+=",
								"value": "800"
							}
						]
					},
					{
						"text": "攻击+4",
						"need": "status:money>=20+2*flag:shop1",
						"action": [
							{
								"type": "comment",
								"text": "新版商店中需要手动扣减金币和增加访问次数"
							},
							{
								"type": "setValue",
								"name": "status:money",
								"operator": "-=",
								"value": "20+2*flag:shop1"
							},
							{
								"type": "setValue",
								"name": "flag:shop1",
								"operator": "+=",
								"value": "1"
							},
							{
								"type": "setValue",
								"name": "status:atk",
								"operator": "+=",
								"value": "4"
							}
						]
					}
				]
			},
			{
				"id": "shop2",
				"text": "\t[贪婪之神,expShop]勇敢的武士啊, 给我一定经验就可以：",
				"textInList": "1F经验商店",
				"mustEnable": false,
				"disablePreview": true,
				"choices": [
					{
						"text": "等级+1（100经验）",
						"need": "status:exp>=100",
						"action": [
							{
								"type": "setValue",
								"name": "status:exp",
								"operator": "-=",
								"value": "100"
							},
							{
								"type": "setValue",
								"name": "status:lv",
								"operator": "+=",
								"value": "1"
							},
							{
								"type": "setValue",
								"name": "status:hp",
								"operator": "+=",
								"value": "1000"
							}
						]
					}
				]
			},
			{
				"id": "itemShop",
				"item": true,
				"textInList": "道具商店",
				"mustEnable": false,
				"choices": [
					{
						"id": "yellowKey",
						"number": 10,
						"money": "10",
						"sell": "5"
					}
				]
			},
			{
				"id": "keyShop",
				"textInList": "回收钥匙商店",
				"mustEnable": false,
				"commonEvent": "回收钥匙商店"
			}
		],
		"levelUp": [
			{
				"need": "0",
				"title": "",
				"action": [
					{
						"type": "comment",
						"text": "此处是初始等级，只需填写称号"
					}
				]
			},
			{
				"need": "20",
				"title": "",
				"action": [
					{
						"type": "setValue",
						"name": "status:atk",
						"operator": "+=",
						"value": "10"
					},
					{
						"type": "setValue",
						"name": "status:def",
						"operator": "+=",
						"value": "10"
					}
				]
			},
			{
				"need": "40",
				"title": "",
				"action": [
					{
						"type": "tip",
						"text": "恭喜升级"
					}
				]
			}
		]
	},
	"values": {
		"lavaDamage": 100,
		"poisonDamage": 10,
		"weakValue": 20,
		"redGem": 3,
		"blueGem": 3,
		"greenGem": 5,
		"redPotion": 100,
		"bluePotion": 250,
		"yellowPotion": 500,
		"greenPotion": 800,
		"breakArmor": 0.9,
		"counterAttack": 0.1,
		"purify": 3,
		"hatred": 2,
		"animateSpeed": 300,
		"moveSpeed": 100,
		"statusCanvasRowsOnMobile": 3,
		"floorChangeTime": 100
	},
	"flags": {
		"statusBarItems": [
			"enableFloor",
			"enableLv",
			"enableHP",
			"enableMana",
			"enableAtk",
			"enableDef",
			"enableMDef",
			"enableMoney",
			"enableExp",
			"enableKeys",
			"enablePZF",
			"enableSkill"
		],
		"autoScale": true,
		"extendToolbar": false,
		"flyNearStair": true,
		"flyRecordPosition": false,
		"itemFirstText": false,
		"equipboxButton": false,
		"enableAddPoint": false,
		"enableNegativeDamage": false,
		"betweenAttackMax": false,
		"useLoop": false,
		"startUsingCanvas": false,
		"statusCanvas": false,
		"enableEnemyPoint": true,
		"enableGentleClick": true,
		"ignoreChangeFloor": true,
		"canGoDeadZone": false,
		"enableMoveDirectly": true,
		"enableRouteFolding": true,
		"disableShopOnDamage": false,
		"blurFg": false
	}
}