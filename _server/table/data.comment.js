/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：全塔属性的配置项。
 */

var data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc = {
	"_type": "object",
	"_data": {
		"main": {
			"_type": "object",
			"_data": {
				"floorIds": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "editor.mode.checkFloorIds(thiseval)",
					"_data": "在这里按顺序放所有的楼层；其顺序直接影响到楼层传送器、浏览地图和上/下楼器的顺序"
				},
				"images": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "editor.mode.checkUnique(thiseval)",
					"_data": "在此存放所有可能使用的图片（tilesets除外） \n图片可以被作为背景图（的一部分），也可以直接用自定义事件进行显示。 \n 图片名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好 \n 建议对于较大的图片，在网上使用在线的“图片压缩工具(http://compresspng.com/zh/)”来进行压缩，以节省流量 \n 依次向后添加"
				},
				"tilesets": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "editor.mode.checkUnique(thiseval)",
					"_data": "在此存放额外素材的图片名, \n可以自定导入任意张素材图片，无需PS，无需注册，即可直接在游戏中使用 \n 形式如[\"1.png\", \"2.png\"] ,将需要的素材图片放在images目录下 \n 素材的宽高必须都是32的倍数，且图片上的总图块数不超过1000（即最多有1000个32*32的图块在该图片上）"
				},
				"animates": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "editor.mode.checkUnique(thiseval)",
					"_data": "在此存放所有可能使用的动画，必须是animate格式，在这里不写后缀名 \n动画必须放在animates目录下；文件名不能使用中文，不能带空格或特殊字符 \n \"jianji\", \"thunder\" 根据需求自行添加"
				},
				"bgms": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "editor.mode.checkUnique(thiseval)",
					"_data": "在此存放所有的bgm，和文件名一致。 \n音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好"
				},
				"sounds": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "editor.mode.checkUnique(thiseval)",
					"_data": "在此存放所有的SE，和文件名一致 \n音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好"
				},
				"nameMap": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "文件名映射，目前仅对images, animates, bgms, sounds有效。\n例如定义 {\"精灵石.mp3\":\"jinglingshi.mp3\"} 就可以使用\ncore.playBgm(\"精灵石.mp3\") 或对应的事件来播放该bgm。"
				},
				"startBackground": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "标题界面的背景，建议使用jpg格式以压缩背景图空间"
				},
				"startLogoStyle": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "标题样式：可以改变颜色，也可以写\"display: none\"来隐藏标题"
				},
				"startButtonsStyle": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "标题界面按钮的样式；caret-color指的是当前选中项的边框颜色"
				},
				"levelChoose": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval instanceof Array && thiseval.length>=1 && thiseval[0] instanceof Array && thiseval[0].length==2",
					"_data": "难度选择：每个数组的第一个是其在标题界面显示的难度，第二个是在游戏内部传输的字符串，会显示在状态栏，修改此处后需要在project/functions中作相应更改。\n如果需直接开始游戏将下面的startDirectly开关打开即可。"
				},
				"equipName": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "(thiseval instanceof Array && thiseval.length<=6)||thiseval==null",
					"_data": "装备位名称，为不超过6个的数组，此项的顺序与equiptype数值关联；例如可写[\"武器\",\"防具\",\"首饰\"]等等。"
				},
				"startBgm": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "在标题界面应该播放的bgm内容"
				},
				"statusLeftBackground": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "横屏时左侧状态栏的背景样式，可以定义背景图、平铺方式等。\n具体请网上搜索\"css background\"了解写法。\n如果弄一张图片作为背景图，推荐写法：\n\"url(project/images/XXX.png) 0 0/100% 100% no-repeat\"\n图片最好进行一些压缩等操作节省流量。"
				},
				"statusTopBackground": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "竖屏时上方状态栏的背景样式，可以定义背景图、平铺方式等。\n具体请网上搜索\"css background\"了解写法。\n如果弄一张图片作为背景图，推荐写法：\n\"url(project/images/XXX.png) 0 0/100% 100% no-repeat\"\n图片最好进行一些压缩等操作节省流量。"
				},
				"toolsBackground": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "竖屏时下方道具栏的背景样式，可以定义背景图、平铺方式等。\n具体请网上搜索\"css background\"了解写法。\n如果弄一张图片作为背景图，推荐写法：\n\"url(project/images/XXX.png) 0 0/100% 100% no-repeat\"\n图片最好进行一些压缩等操作节省流量。"
				},
				"borderColor": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "边框颜色，包括游戏边界的边框和对话框边框等。"
				},
				"statusBarColor": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "状态栏的文字颜色，默认是白色"
				},
				"hardLabelColor": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "难度显示的颜色，默认是红色"
				},
				"floorChangingBackground": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "楼层转换界面的背景样式；可以使用纯色（默认值black），也可以使用图片（参见状态栏的图片写法）"
				},
				"floorChangingTextColor": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "楼层转换界面的文字颜色，默认是白色"
				},
				"font": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "游戏中使用的字体，默认是Verdana"
				}
			}
		},
		"firstData": {
			"_type": "object",
			"_data": {
				"title": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "游戏名，将显示在标题页面以及切换楼层的界面中"
				},
				"name": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_range": "/^[a-zA-Z0-9_]{1,30}$/.test(thiseval)",
					"_data": "游戏的唯一英文标识符。由英文、数字、下划线组成，不能超过30个字符。\n此项必须修改，其将直接影响到存档的定位！"
				},
				"version": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "当前游戏版本；版本不一致的存档不能通用。"
				},
				"floorId": {
					"_leaf": true,
					"_type": "select",
					"_select": {
						"values": data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds
					},
					"_range": "data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds.indexOf(thiseval)!==-1",
					"_data": "初始楼层的ID"
				},
				"hero": {
					"_type": "object",
					"_data": {
						"name": {
							"_leaf": true,
							"_type": "textarea",
							"_string": true,
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
						"manamax": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "魔力上限；此项非负才会生效（null或小于0都不会生效）"
						},
						"mana": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "初始魔力值，只在enableMana开启时才有效"
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
						"equipment": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "thiseval instanceof Array",
							"_data": "初始装上的装备，此处建议请直接留空数组"
						},
						"items": {
							"_type": "object",
							"_data": {
								"keys": {
									"_leaf": true,
									"_type": "textarea",
									"_range": "thiseval instanceof Object && !(thiseval instanceof Array)",
									"_data": "初始三种钥匙个数"
								},
								"constants": {
									"_leaf": true,
									"_type": "textarea",
									"_range": "thiseval instanceof Object && !(thiseval instanceof Array)",
									"_data": "初始永久道具个数，例如初始送手册可以写 {\"book\": 1}"
								},
								"tools": {
									"_leaf": true,
									"_type": "textarea",
									"_range": "thiseval instanceof Object && !(thiseval instanceof Array)",
									"_data": "初始消耗道具个数，例如初始有两破可以写 {\"pickaxe\": 2}"
								},
								"equips": {
									"_leaf": true,
									"_type": "textarea",
									"_range": "thiseval instanceof Object && !(thiseval instanceof Array)",
									"_data": "初始装备个数，例如初始送铁剑可以写 {\"sword1\": 1}"
								}
							}
						},
						"loc": {
							"_type": "object",
							"_data": {
								"direction": {
									"_leaf": true,
									"_type": "select",
									"_data": "勇士初始方向",
									"_select": {
										"values": [
											"up",
											"down",
											"left",
											"right"
										]
									},
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
							"_range": "thiseval instanceof Object && !(thiseval instanceof Array)",
							"_data": "游戏过程中的变量或flags"
						},
						"steps": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "行走步数统计"
						}
					}
				},
				"startCanvas": {
					"_leaf": true,
					"_type": "event",
					"_event": "firstArrive",
					"_range": "thiseval==null || thiseval instanceof Array",
					"_data": "标题界面事件化，可以使用事件流的形式来绘制开始界面等。\n需要开启startUsingCanvas这个开关。\n详见文档-个性化-标题界面事件化。"
				},
				"startText": {
					"_leaf": true,
					"_type": "event",
					"_event": "firstArrive",
					"_range": "thiseval==null || thiseval instanceof Array",
					"_data": "游戏开始前剧情，可以执行任意自定义事件。\n双击进入事件编辑器。\n如果无剧情直接留一个空数组即可。"
				},
				"shops": {
					"_leaf": true,
					"_type": "event",
					"_event": "shop",
					"_range": "thiseval instanceof Array",
					"_data": "全局商店，是一个数组，可以双击进入事件编辑器。"
				},
				"levelUp": {
					"_leaf": true,
					"_type": "event",
					"_event": "level",
					"_range": "thiseval==null || thiseval instanceof Array",
					"_data": "经验升级所需要的数值，是一个数组，可以双击进行编辑。 \n 第一项为初始等级，仅title生效 \n 每一个里面可以含有三个参数 need, title, action \n need为所需要的经验数值，可以是个表达式。请确保need依次递增 \n title为该等级的名称，也可以省略代表使用系统默认值；本项将显示在状态栏中 \n action为本次升级所执行的事件，可由若干项组成"
				}
			}
		},
		"values": {
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
				"moveSpeed": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "行走速度，即勇士每走一格的时间，一般100比较合适"
				},
				"animateSpeed": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "全局动画时间，即怪物振动频率，一般300比较合适"
				},
				"floorChangeTime": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "默认楼层切换时间"
				}
			}
		},
		"flags": {
			"_type": "object",
			"_data": {
				"enableFloor": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否在状态栏显示当前楼层"
				},
				"enableName": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否在状态栏显示勇士名字"
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
				"enableMana": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否开启魔力值"
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
				"levelUpLeftMode": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "进阶使用扣除模式，即在状态栏显示距离下个等级所需要的经验值；只有enableExperience和enableLevelUp均开启时才有效。"
				},
				"enableKeys": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否在状态栏显示三色钥匙数量"
				},
				"enablePZF": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否在状态栏显示破炸飞数量"
				},
				"enableDebuff": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否在状态栏显示毒衰咒"
				},
				"enableSkill": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否启用技能栏"
				},
				"flyNearStair": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "传送器是否需要在楼梯边使用；如果flyRecordPosition开启，则此项对箭头也有效。"
				},
				"flyRecordPosition": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "传送器平面塔模式；此模式下楼层传送器将飞到上次离开该楼层的位置。"
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
				"steelDoorWithoutKey": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "铁门是否不需要钥匙开启。如果此项为true，则无需钥匙也可以开铁门。"
				},
				"itemFirstText": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "首次获得道具是否提示"
				},
				"equipment": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "剑和盾是否作为装备。如果此项为true，则作为装备，需要在装备栏使用，否则将直接加属性。"
				},
				"equipboxButton": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "状态栏的装备按钮。若此项为true则将状态栏中的楼层转换器按钮换为装备栏按钮"
				},
				"iconInEquipbox": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "在装备栏中的属性变化，是否绘制图标；如果此项开启，则会绘制图标而不是文字"
				},
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
					"_data": "夹击上整还是下整。如果此项为true则夹击伤害值向上取整，为false则为向下取整"
				},
				"betweenAttackMax": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "夹击伤害是否不超过怪物伤害值。"
				},
				"useLoop": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否循环计算临界；如果此项为true则使用循环法（而不是回合数计算法）来算临界\n从V2.5.3开始，对于大数据的循环法将改为使用二分法进行计算"
				},
				"startUsingCanvas": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否开始菜单canvas化；如果此项为true，则将使用canvas来绘制开始菜单"
				},
				"startDirectly": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "点击“开始游戏”后是否立刻开始游戏而不显示难度选择界面"
				},
				"statusCanvas": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否状态栏canvas化，即手动自定义绘制状态栏。\n如果此项开启，则可在脚本编辑的drawStatusBar中自定义绘制菜单栏。"
				},
				"statusCanvasRowsOnMobile": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==null || (thiseval>0 && thiseval<=4)",
					"_data": "竖屏模式下，顶端状态栏canvas化后的行数。\n此项将决定竖屏的状态栏高度，如果设置则不小于1且不大于4。\n仅在statusCanvas开启时才有效"
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
				"ignoreChangeFloor": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "经过楼梯、传送门时是否能“穿透”。\n穿透的意思是，自动寻路得到的的路径中间经过了楼梯，行走时是否触发楼层转换事件"
				},
				"canGoDeadZone": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否允许走到将死的领域上。如果此项为true，则可以走到将死的领域上"
				},
				"enableMoveDirectly": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否允许瞬间移动"
				},
				"enableDisabledShop": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否允许查看未开启状态的快捷商店内容；如果此项为真，则对于未开启状态的商店允许查看其内容（但不能购买）"
				},
				"disableShopOnDamage": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否在经过领域/夹击/路障等伤害后禁用快捷商店。"
				},
				"blurFg": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否虚化前景层；如果此项开启，则在游戏中事件层有东西（如宝石等）时虚化前景层。"
				},
				"checkConsole": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "是否检查控制台的开启情况。"
				}
			}
		}
	}
}