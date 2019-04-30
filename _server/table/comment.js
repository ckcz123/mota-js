/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：道具、怪物、图块属性、楼层属性等内容。
 */

var comment_c456ea59_6018_45ef_8bcc_211a24c627dc = {
	"_type": "object",
	"_data": {
		// --------------------------- 【道具】相关的表格配置 --------------------------- //
		"items": {
			"_type": "object",
			"_data": {
				"items": {
					"_type": "object",
					"_data": {
						"cls": {
							"_leaf": true,
							"_type": "select",
							"_select": {
								"values": [
									"keys",
									"items",
									"constants",
									"tools",
									"equips"
								]
							},
							"_data": "只能取keys(钥匙) items(宝石、血瓶) constants(永久物品) tools(消耗道具) equips(装备)"
						},
						"name": {
							"_leaf": true,
							"_type": "textarea",
							"_string": true,
							"_data": "名称"
						},
						"text": {
							"_leaf": true,
							"_type": "textarea",
							"_string": true,
							"_data": "道具在道具栏中显示的描述"
						},
						"equip": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "装备属性设置，仅对cls为equips有效。\n如果此项不为null，需要是一个对象，里面可含\"type\"，\"atk\"，\"def\"，\"mdef\"，\"animate\"五项，分别对应装备部位、攻防魔防和动画。\n具体详见文档（元件说明-装备）和已有的几个装备的写法。"
						},
						"hideInReplay": {
							"_leaf": true,
							"_type": "checkbox",
							"_bool": "bool",
							"_data": "是否回放时绘制道具栏。\n如果此项为true，则在回放录像时使用本道具将不会绘制道具栏页面，而是直接使用。\n此项建议在会频繁连续多次使用的道具开启（如开启技能，或者《镜子》那样的镜像切换等等）"
						}
					}
				},
				"itemEffect": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_data": "即捡即用类物品的效果，仅对cls为items有效。"
				},
				"itemEffectTip": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_data": "即捡即用类物品在获得时提示的文字，仅对cls为items有效。"
				},
				"useItemEffect": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_data": "道具效果，仅对cls为tools或constants有效。"
				},
				"canUseItemEffect": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_data": "当前能否使用该道具，仅对cls为tools或constants有效。"
				},
				"equipCondition": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_data": "能装备某个装备的条件，仅对cls为equips有效。\n与canUseItemEffect不同，这里null代表可以装备。"
				}
			}
		},
		"items_template": { 'cls': 'items', 'name': '新物品' },


		// --------------------------- 【怪物】相关的表格配置 --------------------------- //
		"enemys": {
			"_type": "object",
			"_data": {
				"name": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "名称"
				},
				"displayIdInBook": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "在怪物手册中映射到的怪物ID。如果此项不为null，则在怪物手册中，将用目标ID来替换该怪物原本的ID。\n此项应被运用在同一个怪物的多朝向上。\n例如，如果想定义同一个怪物的向下和向左的行走图，则需要建立两个属性完全相同的怪物。\n但是这样会导致在怪物手册中同时存在向下和向左的两种怪物的显示。\n可以将朝向左的怪物的displayIdInBook项指定为朝向下的怪物ID，这样在怪物手册中则会归一化，只显示一个。"
				},
				"hp": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "生命值"
				},
				"atk": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "攻击力"
				},
				"def": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "防御力"
				},
				"money": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "金币"
				},
				"experience": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "经验"
				},
				"point": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "加点"
				},
				"special": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==null || thiseval instanceof Array || (thiseval==~~thiseval && thiseval>=0)",
					"_data": "特殊属性\n\n0:无,1:先攻,2:魔攻,3:坚固,4:2连击,\n5:3连击,6:n连击,7:破甲,8:反击,9:净化,\n10:模仿,11:吸血,12:中毒,13:衰弱,14:诅咒,\n15:领域,16:夹击,17:仇恨,18:阻击,19:自爆,\n20:无敌,21:退化,22:固伤,23:重生,24:激光,25:光环\n\n多个属性例如用[1,4,11]表示先攻2连击吸血"
				},
				"value": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "特殊属性的数值\n如：领域/阻激/激光怪的伤害值；吸血怪的吸血比例；光环怪增加生命的比例"
				},
				"zoneSquare": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "领域怪是否九宫格伤害"
				},
				"range": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "(thiseval==~~thiseval && thiseval>0)||thiseval==null",
					"_data": "领域伤害的范围；不加默认为1"
				},
				"notBomb": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "该怪物不可被炸"
				},
				"n": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "(thiseval==~~thiseval && thiseval>0)||thiseval==null",
					"_data": "多连击的连击数"
				},
				"add": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "吸血后是否加到自身；光环是否叠加"
				},
				"atkValue": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_data": "退化时勇士下降的攻击力点数；光环怪增加攻击的比例"
				},
				"defValue": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_data": "退化时勇士下降的防御力点数；光环怪增加防御的比例"
				},
				"damage": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_data": "战前扣血的点数"
				}
			}
		},
		"enemys_template": { 'name': '新敌人', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'experience': 0, 'point': 0, 'special': 0 },


		// --------------------------- 【图块属性】相关的表格配置 --------------------------- //
		"maps": {
			"_type": "object",
			"_data": {
				"id": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "false",
					"_data": "图块ID"
				},
				"idnum": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "false",
					"_data": "图块数字"
				},
				"cls": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "false",
					"_data": "图块类别"
				},
				"trigger": {
					"_leaf": true,
					"_type": "select",
					"_select": {
						"values": [
							"null",
							"openDoor",
							"passNet",
							"changeLight",
							"pushBox",
							"custom"
						]
					},
					"_data": "该图块的默认触发器"
				},
				"noPass": {
					"_leaf": true,
					"_type": "select",
					"_select": {
						"values": [
							"null",
							"true",
							"false"
						]
					},
					"_data": "该图块是否不可通行；true代表不可通行，false代表可通行，null代表使用系统缺省值"
				},
				"canBreak": {
					"_leaf": true,
					"_type": "checkbox",
					"_bool": "bool",
					"_data": "该图块是否可被破墙或地震"
				},
				"cannotOut": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==null||(thiseval instanceof Array)",
					"_data": "该图块的不可出方向\n可以在这里定义在该图块时不能前往哪个方向，可以达到悬崖之类的效果\n例如 [\"up\", \"left\"] 代表在该图块时不能往上和左走\n此值对背景层、事件层、前景层上的图块均有效"
				},
				"cannotIn": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==null||(thiseval instanceof Array)",
					"_data": "该图块的不可入方向\n可以在这里定义不能朝哪个方向进入该图块，可以达到悬崖之类的效果\n例如 [\"down\"] 代表不能从该图块的上方点朝向下进入此图块\n此值对背景层、事件层、前景层上的图块均有效"
				},
				"animate": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_data": "该图块的全局动画帧数。\n如果此项为null，则对于除了npc48外，使用素材默认帧数；npc48默认是1帧（即静止）。"
				},
				"faceIds": {
					"_leaf": true,
					"_type": "textarea",
					"_data": "行走图朝向，仅对NPC有效。可以在这里定义同一个NPC的多个朝向行走图。\n比如 {\"up\":\"N333\",\"down\":\"N334\",\"left\":\"N335\",\"right\":\"N336\"} 就将该素材的上下左右朝向分别绑定到N333,N334,N335和N336四个图块。\n在勇士撞上NPC时，或NPC在移动时，会自动选择最合适的朝向图块（如果存在定义）来进行绘制。"
				}
			}
		},


		// --------------------------- 【楼层属性】相关的表格配置 --------------------------- //
		"floors": {
			"_type": "object",
			"_data": {
				"floor": {
					"_type": "object",
					"_data": {
						"floorId": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "false",
							"_data": "文件名和floorId需要保持完全一致 \n楼层唯一标识符仅能由字母、数字、下划线组成，且不能由数字开头 \n推荐用法：第20层就用MT20，第38层就用MT38，地下6层就用MT_6（用下划线代替负号），隐藏3层用MT3h（h表示隐藏），等等 \n楼层唯一标识符，需要和名字完全一致 \n这里不能更改floorId,请通过另存为来实现"
						},
						"title": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "楼层中文名，将在切换楼层和浏览地图时显示"
						},
						"name": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "显示在状态栏中的层数"
						},
						"width": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "false",
							"_data": "地图x方向大小,这里不能更改,仅能在新建地图时设置,null视为13"
						},
						"height": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "false",
							"_data": "地图y方向大小,这里不能更改,仅能在新建地图时设置,null视为13"
						},
						"canFlyTo": {
							"_leaf": true,
							"_type": "checkbox",
							"_bool": "bool",
							"_data": "该楼能否被楼传器飞到（不能的话在该楼也不允许使用楼传器）"
						},
						"canUseQuickShop": {
							"_leaf": true,
							"_type": "checkbox",
							"_bool": "bool",
							"_data": "该层是否允许使用快捷商店"
						},
						"cannotViewMap": {
							"_leaf": true,
							"_type": "checkbox",
							"_bool": "bool",
							"_data": "该层是否不允许被浏览地图看到；如果勾上则浏览地图会跳过该层"
						},
						"cannotMoveDirectly": {
							"_leaf": true,
							"_type": "checkbox",
							"_bool": "bool",
							"_data": "该层是否不允许瞬间移动；如果勾上则不可在此层进行瞬移"
						},
						"firstArrive": {
							"_leaf": true,
							"_type": "event",
							"_event": "firstArrive",
							"_data": "第一次到该楼层触发的事件，可以双击进入事件编辑器。"
						},
						"eachArrive": {
							"_leaf": true,
							"_type": "event",
							"_event": "eachArrive",
							"_data": "每次到该楼层触发的事件，可以双击进入事件编辑器；该事件会在firstArrive执行后再执行。"
						},
						"parallelDo": {
							"_leaf": true,
							"_type": "textarea",
							"_string": true,
							"_lint": true,
							"_data": "在该层楼时执行的并行事件处理。\n可以在这里写上任意需要自动执行的脚本，比如打怪自动开门等。\n详见文档-事件-并行事件处理。"
						},
						"upFloor": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "thiseval==null||((thiseval instanceof Array) && thiseval.length==2)",
							"_data": "该层上楼点，如[2,3]。\n如果此项不为null，则楼层转换时的stair:upFloor，以及楼传器的落点会被替换成该点而不是该层的上楼梯。"
						},
						"downFloor": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "thiseval==null||((thiseval instanceof Array) && thiseval.length==2)",
							"_data": "该层下楼点，如[2,3]。\n如果此项不为null，则楼层转换时的stair:downFloor，以及楼传器的落点会被替换成该点而不是该层的下楼梯。"
						},
						"defaultGround": {
							"_leaf": true,
							"_type": "select",
							"_select": {
								"values": Object.keys(editor.core.icons.icons.terrains)
							},
							"_data": "默认地面的图块ID，此项修改后需要刷新才能看到效果。"
						},
						"images": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "背景/前景图；你可以选择若干张图片来作为背景/前景素材。详细用法请参见文档“自定义素材”中的说明。"
						},
						"color": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "该层的默认画面色调。本项可不写（代表无色调），如果写需要是一个RGBA数组如[255,0,0,0.3]"
						},
						"weather": {
							"_leaf": true,
							"_type": "textarea",
							"_data": "该层的默认天气。本项可忽略表示晴天，如果写则第一项为\"rain\"，\"snow\"或\"fog\"代表雨雪雾，第二项为1-10之间的数代表强度。\n如[\"rain\", 8]代表8级雨天。"
						},
						"bgm": {
							"_leaf": true,
							"_type": "select",
							"_select": {
								"values": [null].concat(Object.keys(editor.core.material.bgms))
							},
							"_data": "到达该层后默认播放的BGM。本项可忽略，或者为一个定义过的背景音乐如\"bgm.mp3\"。"
						},
						"item_ratio": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "(thiseval==~~thiseval && thiseval>=0)||thiseval==null",
							"_data": "每一层的宝石/血瓶效果，即获得宝石和血瓶时框内\"ratio\"的值。"
						},
						"underGround": {
							"_leaf": true,
							"_type": "checkbox",
							"_bool": "bool",
							"_data": "是否是地下层；如果该项为true则同层传送将传送至上楼梯"
						}
					}
				},
				"loc": {
					"_type": "object",
					"_data": {
						"events": {
							"_leaf": true,
							"_type": "event",
							"_event": "event",
							"_data": "该点的可能事件列表，可以双击进入事件编辑器。"
						},
						"changeFloor": {
							"_leaf": true,
							"_type": "event",
							"_event": "changeFloor",
							"_data": "该点楼层转换事件；该事件不能和上面的events同时出现，否则会被覆盖"
						},
						"afterBattle": {
							"_leaf": true,
							"_type": "event",
							"_event": "afterBattle",
							"_data": "该点战斗后可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"afterGetItem": {
							"_leaf": true,
							"_type": "event",
							"_event": "afterGetItem",
							"_data": "该点获得道具后可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"afterOpenDoor": {
							"_leaf": true,
							"_type": "event",
							"_event": "afterOpenDoor",
							"_data": "该点开完门后可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"cannotMove": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "thiseval==null||(thiseval instanceof Array)",
							"_data": "该点不可通行的方向 \n 可以在这里定义该点不能前往哪个方向，可以达到悬崖之类的效果\n例如 [\"up\", \"left\"] 代表该点不能往上和左走"
						}
					}
				}
			}
		},

		"floors_template": {
			"floorId": "to be covered",
			"title": "new floor",
			"name": "new floor",
			"width": 13,
			"height": 13,
			"canFlyTo": true,
			"canUseQuickShop": true,
			"cannotViewMap": false,
			"cannotMoveDirectly": false,
			"images": [],
			"item_ratio": 1,
			"defaultGround": "ground",
			"bgm": null,
			"upFloor": null,
			"downFloor": null,
			"color": null,
			"weather": null,
			"firstArrive": [],
			"eachArrive": [],
			"parallelDo": "",
			"events": {},
			"changeFloor": {},
			"afterBattle": {},
			"afterGetItem": {},
			"afterOpenDoor": {},
			"cannotMove": {}
		}
	}
}