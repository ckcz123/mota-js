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
		],
		"整数输入": [
			{
				"type": "while",
				"condition": "true",
				"data": [
					{
						"type": "previewUI",
						"action": [
							{
								"type": "drawBackground",
								"background": "winskin.png",
								"x": 16,
								"y": 16,
								"width": 384,
								"height": 384
							},
							{
								"type": "drawIcon",
								"id": "X10181",
								"x": 32,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10185",
								"x": 64,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10186",
								"x": 96,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10187",
								"x": 128,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10188",
								"x": 160,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10189",
								"x": 192,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10193",
								"x": 224,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10194",
								"x": 256,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10195",
								"x": 288,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10196",
								"x": 320,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10197",
								"x": 352,
								"y": 288
							},
							{
								"type": "drawIcon",
								"id": "X10286",
								"x": 32,
								"y": 352
							},
							{
								"type": "drawIcon",
								"id": "X10169",
								"x": 96,
								"y": 352
							},
							{
								"type": "drawIcon",
								"id": "X10232",
								"x": 128,
								"y": 352
							},
							{
								"type": "drawIcon",
								"id": "X10185",
								"x": 320,
								"y": 352
							},
							{
								"type": "drawIcon",
								"id": "X10242",
								"x": 352,
								"y": 352
							},
							{
								"type": "fillBoldText",
								"x": 48,
								"y": 256,
								"style": [
									255,
									255,
									255,
									1
								],
								"font": "bold 32px Consolas",
								"text": "${flag:input}"
							},
							{
								"type": "fillBoldText",
								"x": 32,
								"y": 48,
								"style": [
									255,
									255,
									255,
									1
								],
								"font": "16px Consolas",
								"text": "${temp:text}"
							}
						]
					},
					{
						"type": "wait",
						"forceChild": true,
						"data": [
							{
								"case": "keyboard",
								"keycode": "48,49,50,51,52,53,54,55,56,57",
								"action": [
									{
										"type": "playSound",
										"name": "光标移动"
									},
									{
										"type": "if",
										"condition": "(flag:input<0)",
										"true": [
											{
												"type": "setValue",
												"name": "flag:input",
												"value": "10*flag:input-(flag:keycode-48)",
												"norefresh": true
											}
										],
										"false": [
											{
												"type": "setValue",
												"name": "flag:input",
												"value": "10*flag:input+(flag:keycode-48)",
												"norefresh": true
											}
										]
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"value": "core.clamp(flag:input,Number.MIN_SAFE_INTEGER,\nNumber.MAX_SAFE_INTEGER)",
										"norefresh": true
									}
								]
							},
							{
								"case": "keyboard",
								"keycode": "189",
								"action": [
									{
										"type": "playSound",
										"name": "跳跃"
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"value": "-flag:input",
										"norefresh": true
									}
								]
							},
							{
								"case": "keyboard",
								"keycode": "8",
								"action": [
									{
										"type": "playSound",
										"name": "取消"
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"operator": "//=",
										"value": "10",
										"norefresh": true
									}
								]
							},
							{
								"case": "keyboard",
								"keycode": "27",
								"action": [
									{
										"type": "playSound",
										"name": "读档"
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"value": "0",
										"norefresh": true
									}
								]
							},
							{
								"case": "keyboard",
								"keycode": "13",
								"action": [
									{
										"type": "break",
										"n": 1
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									32,
									63
								],
								"py": [
									288,
									320
								],
								"action": [
									{
										"type": "playSound",
										"name": "跳跃"
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"value": "-flag:input",
										"norefresh": true
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									64,
									384
								],
								"py": [
									288,
									320
								],
								"action": [
									{
										"type": "playSound",
										"name": "光标移动"
									},
									{
										"type": "if",
										"condition": "(flag:input<0)",
										"true": [
											{
												"type": "setValue",
												"name": "flag:input",
												"value": "10*flag:input-(flag:x-2)",
												"norefresh": true
											}
										],
										"false": [
											{
												"type": "setValue",
												"name": "flag:input",
												"value": "10*flag:input+(flag:x-2)",
												"norefresh": true
											}
										]
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"value": "core.clamp(flag:input,Number.MIN_SAFE_INTEGER,\nNumber.MAX_SAFE_INTEGER)",
										"norefresh": true
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									32,
									64
								],
								"py": [
									352,
									384
								],
								"action": [
									{
										"type": "playSound",
										"name": "取消"
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"operator": "//=",
										"value": "10",
										"norefresh": true
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									96,
									160
								],
								"py": [
									352,
									384
								],
								"action": [
									{
										"type": "playSound",
										"name": "读档"
									},
									{
										"type": "setValue",
										"name": "flag:input",
										"value": "0",
										"norefresh": true
									}
								]
							},
							{
								"case": "mouse",
								"px": [
									320,
									384
								],
								"py": [
									352,
									384
								],
								"action": [
									{
										"type": "break",
										"n": 1
									}
								]
							}
						]
					}
				]
			},
			{
				"type": "clearMap",
				"x": 8,
				"y": 8,
				"width": 400,
				"height": 400
			},
			{
				"type": "function",
				"function": "function(){\ncore.status.route.splice(flags['@temp@length']);core.status.route.push('input:'+core.getFlag('input',0))\n}"
			}
		],
		"自绘状态栏": [
			{
				"type": "comment",
				"text": "自绘状态栏的横屏模式，画在地图上，z值设为66以覆盖显伤，被动画、色调、天气等覆盖。\n本事件将被插件core.compile()函数编译后执行，因此允许使用的指令种类有限制。\n请查阅该插件以了解详情。"
			},
			{
				"type": "clearMap",
				"x": "flag:__canvas_left__",
				"y": 0,
				"width": "Math.floor(core.__WIDTH__/4)*core.__UNIT__",
				"height": "core.__PX_HEIGHT__"
			},
			{
				"type": "setAttribute",
				"baseline": "ideographic",
				"z": 66
			},
			{
				"type": "previewUI",
				"action": [
					{
						"type": "setValue",
						"name": "flag:__canvas_left__",
						"value": "core.__PX_WIDTH__-Math.floor(core.__WIDTH__/4)*core.__UNIT__"
					},
					{
						"type": "if",
						"condition": "(core.bigmap.width>core.__WIDTH__)",
						"true": [
							{
								"type": "comment",
								"text": "横向大地图的状态栏将添加半透明背景，同时判定勇士是否在画面靠右1/3部分。\n如果是，则状态栏画在左侧，否则画在右侧"
							},
							{
								"type": "if",
								"condition": "((status:x-core.bigmap.offsetX/core.__UNIT__)>core.__WIDTH__*2/3)",
								"true": [
									{
										"type": "setValue",
										"name": "flag:__canvas_left__",
										"value": "0"
									}
								]
							},
							{
								"type": "setAttribute",
								"alpha": 0.75
							},
							{
								"type": "drawBackground",
								"background": "winskin.png",
								"x": "flag:__canvas_left__",
								"y": 0,
								"width": "Math.floor(core.__WIDTH__/4)*core.__UNIT__",
								"height": "core.__PX_HEIGHT__"
							},
							{
								"type": "setAttribute",
								"alpha": 1
							}
						]
					},
					{
						"type": "drawIcon",
						"id": "upFloor",
						"x": "flag:__canvas_left__+6",
						"y": 6,
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "drawIcon",
						"id": "hp",
						"x": "flag:__canvas_left__+6",
						"y": "6+core.__UNIT__",
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "drawIcon",
						"id": "sword1",
						"x": "flag:__canvas_left__+6",
						"y": "6+core.__UNIT__*2",
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "drawIcon",
						"id": "shield1",
						"x": "flag:__canvas_left__+6",
						"y": "6+core.__UNIT__*3",
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "drawIcon",
						"id": "mdef",
						"x": "flag:__canvas_left__+6",
						"y": "6+core.__UNIT__*4",
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "drawIcon",
						"id": "coin",
						"x": "flag:__canvas_left__+6",
						"y": "6+core.__UNIT__*5",
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "drawIcon",
						"id": "exp",
						"x": "flag:__canvas_left__+6",
						"y": "6+core.__UNIT__*6",
						"width": "core.__UNIT__*7/8",
						"height": "core.__UNIT__*7/8"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__",
						"style": [
							255,
							255,
							255,
							1
						],
						"font": "bold 20px Verdana",
						"text": "${(core.status.thisMap||{}).name||''}"
					},
					{
						"type": "setAttribute",
						"font": "italic bold 20px Verdana"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__+core.__UNIT__",
						"text": "${core.formatBigNumber(core.getRealStatus('hp'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__*3",
						"text": "${core.formatBigNumber(core.getRealStatus('atk'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__*4",
						"text": "${core.formatBigNumber(core.getRealStatus('def'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__*5",
						"text": "${core.formatBigNumber(core.getRealStatus('mdef'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__*6",
						"text": "${core.formatBigNumber(core.getRealStatus('money'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+6+core.__UNIT__",
						"y": "core.__UNIT__*7",
						"text": "${core.formatBigNumber(core.getRealStatus('exp'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+10",
						"y": "core.__UNIT__*8",
						"style": [
							255,
							204,
							170,
							1
						],
						"text": "${core.setTwoDigits(core.itemCount('yellowKey'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+15+core.__UNIT__",
						"y": "core.__UNIT__*8",
						"style": [
							170,
							170,
							221,
							1
						],
						"text": "${core.setTwoDigits(core.itemCount('blueKey'))}"
					},
					{
						"type": "fillBoldText",
						"x": "flag:__canvas_left__+20+core.__UNIT__*2",
						"y": "core.__UNIT__*8",
						"style": [
							255,
							136,
							136
						],
						"text": "${core.setTwoDigits(core.itemCount('redKey'))}"
					}
				]
			}
		]
	}
}