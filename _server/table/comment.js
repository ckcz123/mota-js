/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：道具、怪物、图块属性、楼层属性等内容。
 * 相关文档 _docs/editor.md ~ http://127.0.0.1:1055/_docs/#/editor?id=修改表格
 */

var comment_c456ea59_6018_45ef_8bcc_211a24c627dc = {
	"_type": "object",
	"_data": {
		// --------------------------- 【道具】相关的表格配置 --------------------------- //
		"items": {
			"_type": "object",
			"_data": {
				"id": {
					"_leaf": true,
					"_type": "disable",
					"_docs": "道具ID",
					"_data": "道具ID，可于页面底部修改"
				},
				"cls": {
					"_leaf": true,
					"_type": "select",
					"_select": {
						"values": [
							"items",
							"constants",
							"tools",
							"equips"
						]
					},
					"_docs": "道具类别",
					"_data": "items(宝石、血瓶) constants(永久物品) tools(消耗道具) equips(装备)"
				},
				"name": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "道具名称"
				},
				"text": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_docs": "道具描述",
					"_data": "道具在道具栏中显示的描述"
				},
				"hideInToolbox": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "不显示在道具栏",
				},
				"equip": {
					"_leaf": true,
					"_type": "event",
					"_event": "equip",
					"_docs": "道具的装备属性"
				},
				"hideInReplay": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "回放不绘制道具栏",
					"_data": "此项建议在会频繁连续多次使用的道具开启（如开启技能，或者《镜子》那样的镜像切换等等）"
				},
				"itemEffect": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_docs": "即捡即用效果",
					"_data": "即捡即用类物品的效果，仅对cls为items有效。"
				},
				"itemEffectTip": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_docs": "即捡即用提示",
					"_data": "即捡即用类物品在获得时提示的文字，仅对cls为items有效。"
				},
				"useItemEvent": {
					"_leaf": true,
					"_type": "event",
					"_event": "item",
					"_docs": "碰触或使用事件",
					"_data": "碰触或使用本道具所执行的事件，对所有cls有效"
				},
				"useItemEffect": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_docs": "使用效果",
					"_data": "道具效果，仅对cls为tools或constants有效。"
				},
				"canUseItemEffect": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_docs": "能否使用或装备",
					"_data": "当前能否使用或装备该道具，仅对cls不为items有效。null表示始终不可使用但可装备"
				}
			}
		},
		"items_template": { 'cls': 'items', 'name': '新物品', 'canUseItemEffect': 'true' },


		// --------------------------- 【怪物】相关的表格配置 --------------------------- //
		"enemys": {
			"_type": "object",
			"_data": {
				"id": {
					"_leaf": true,
					"_type": "disable",
					"_docs": "怪物ID",
					"_data": "怪物ID，可于页面底部修改"
				},
				"name": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "名称"
				},
				"description": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_docs": "怪物描述",
					"_data": "可在怪物详细信息页面写的怪物描述，支持颜色、字体大小和样式、粗体斜体等转义方式。"
				},
				"displayIdInBook": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_docs": "手册ID",
					"_data": "在怪物手册中映射到的怪物ID。如果此项不为null，则在怪物手册中，将用目标ID来替换该怪物原本的ID。常被运用在同一个怪物的多朝向上。"
				},
				"faceIds": {
					"_leaf": true,
					"_type": "event",
					"_event": "faceIds",
					"_docs": "行走朝向",
					"_data": "行走图朝向。在勇士撞上图块时，或图块在移动时，会自动选择最合适的朝向图块（如果存在定义）来进行绘制。"
				},
				"bigImage": {
					"_leaf": true,
					"_type": "material",
					"_directory": "./project/images/:images",
					"_transform": (function (one) {
						if (one.endsWith('.png')) return one;
						return null;
					}).toString(),
					"_onconfirm": (function (previous, current) {
						if (current.length == 0) return null;
						return current[0];
					}).toString(),
					"_docs": "绑定贴图",
					"_data": "该怪物绑定的怪物贴图，用法详见文档"
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
				"exp": {
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
					"_type": "popCheckboxSet",
					"_checkboxSet": function () {
						var array = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.enemys.getSpecials()
						var b = [],
							c = [];
						for (var index = 0; index < array.length; index++) {
							b.push(array[index][0])
							var name = array[index][1];
							if (name instanceof Function) name = name({});
							c.push(name + "(" + array[index][0] + ")")
						}
						return {
							"prefix": c,
							"key": b
						}
					},
					"_data": "特殊属性"
				},
				"value": {
					"_leaf": true,
					"_type": "textarea",
					"_docs": "特殊属性数值",
					"_data": "特殊属性的数值\n如：领域/阻激/激光怪的伤害值；吸血怪的吸血比例；光环怪增加生命的比例"
				},
				"zoneSquare": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "九宫格",
					"_data": "领域、阻击、光环或捕捉怪是否九宫格"
				},
				"range": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "(thiseval==~~thiseval && thiseval>0)||thiseval==null",
					"_docs": "领域范围",
					"_data": "领域或光环的范围；领域不加默认为1，光环不加则为全图效果"
				},
				"notBomb": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "不可炸",
					"_data": "该怪物不可被炸"
				},
				"n": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "(thiseval==~~thiseval && thiseval>0)||thiseval==null",
					"_docs": "连击数",
					"_data": "多连击的连击数，净化怪的净化倍率"
				},
				"add": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "吸血加到自身",
					"_data": "吸血后是否加到自身；光环是否叠加"
				},
				"atkValue": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_docs": "退化扣攻",
					"_data": "退化时勇士下降的攻击力点数；光环怪增加攻击的比例；反击的比例"
				},
				"defValue": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_docs": "退化扣防",
					"_data": "退化时勇士下降的防御力点数；光环怪增加防御的比例；破甲的比例"
				},
				"damage": {
					"_leaf": true,
					"_type": "textarea",
					"_range": "thiseval==~~thiseval||thiseval==null",
					"_docs": "固伤",
					"_data": "战前扣血的点数"
				},
				"beforeBattle": {
					"_leaf": true,
					"_type": "event",
					"_event": "beforeBattle",
					"_docs": "战前事件",
					"_data": "和该怪物战斗前触发的事件列表"
				},
				"afterBattle": {
					"_leaf": true,
					"_type": "event",
					"_event": "afterBattle",
					"_docs": "战后事件",
					"_data": "和该怪物战斗后触发的事件列表"
				}
			}
		},
		"enemys_template": { 'name': '新敌人', 'hp': 0, 'atk': 0, 'def': 0, 'money': 0, 'exp': 0, 'point': 0, 'special': [] },


		// --------------------------- 【图块属性】相关的表格配置 --------------------------- //
		"maps": {
			"_type": "object",
			"_data": {
				"id": {
					"_leaf": true,
					"_type": "disable",
					"_range": "false",
					"_docs": "图块ID",
					"_data": "图块唯一ID，可在页面底部修改"
				},
				"idnum": {
					"_leaf": true,
					"_type": "disable",
					"_range": "false",
					"_data": "图块数字"
				},
				"cls": {
					"_leaf": true,
					"_type": "disable",
					"_range": "false",
					"_data": "图块类别"
				},
				"name": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_data": "图块名称"
				},
				"trigger": {
					"_leaf": true,
					"_type": "select",
					"_select": {
						"values": [
							null,
							"openDoor",
							"pushBox",
							"ski",
							"custom"
						]
					},
					"_docs": "触发器",
					"_data": "该图块的默认触发器"
				},
				"canPass": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "可通行性",
				},
				"script": {
					"_leaf": true,
					"_type": "textarea",
					"_string": true,
					"_lint": true,
					"_docs": "碰触脚本",
					"_data": "触碰到该图块时自动执行的脚本内容；此脚本会在该点的触发器执行前执行"
				},
				"event": {
					"_leaf": true,
					"_type": "event",
					"_event": "item",
					"_docs": "碰触事件",
					"_data": "触碰到该图块时自动执行的事件内容；如果存在本事件则不会执行默认触发器"
				},
				"cannotOut": {
					"_leaf": true,
					"_type": "checkboxSet",
					"_checkboxSet": {
						"prefix": ["上: ", "下: ", "<br>左: ", "右: "],
						"key": ["up", "down", "left", "right"]
					},
					"_docs": "不可出方向",
					"_data": "该图块的不可出方向\n对背景层、事件层、前景层上的图块均有效"
				},
				"cannotIn": {
					"_leaf": true,
					"_type": "checkboxSet",
					"_checkboxSet": {
						"prefix": ["上: ", "下: ", "<br>左: ", "右: "],
						"key": ["up", "down", "left", "right"]
					},
					"_docs": "不可入方向",
					"_data": "该图块的不可入方向\n对背景层、事件层、前景层上的图块均有效"
				},
				"canBreak": {
					"_leaf": true,
					"_type": "checkbox",
					"_docs": "可破震",
					"_data": "该图块是否可被破墙或地震"
				},
				"animate": {
					"_leaf": true,
					"_type": "select",
					"_select": {
						"values": [null, 1, 2, 3, 4],
					},
					"_docs": "动画帧数",
					"_data": "null代表素材默认帧数"
				},
				"doorInfo": {
					"_leaf": true,
					"_type": "event",
					"_event": "doorInfo",
					"_docs": "门信息",
					"_data": "该图块的门信息，仅对animates和npc48生效。"
				},
				"faceIds": {
					"_leaf": true,
					"_type": "event",
					"_event": "faceIds",
					"_docs": "行走图朝向",
					"_data": "行走图朝向。在勇士撞上图块时，或图块在移动时，会自动选择最合适的朝向图块（如果存在定义）来进行绘制。"
				},
				"bigImage": {
					"_leaf": true,
					"_type": "material",
					"_directory": "./project/images/:images",
					"_transform": (function (one) {
						if (one.endsWith('.png')) return one;
						return null;
					}).toString(),
					"_onconfirm": (function (previous, current) {
						if (current.length == 0) return null;
						return current[0];
					}).toString(),
					"_docs": "绑定贴图",
					"_data": "该图块绑定的贴图，用法详见文档"
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
							"_type": "disable",
							"_range": "false",
							"_docs": "楼层ID",
							"_data": "文件名和floorId需要保持完全一致，可在页面底部修改"
						},
						"title": {
							"_leaf": true,
							"_type": "textarea",
							"_docs": "楼层名",
							"_data": "楼层中文名，将在切换楼层和浏览地图时显示"
						},
						"name": {
							"_leaf": true,
							"_type": "textarea",
							"_docs": "状态栏显示",
							"_data": "显示在状态栏中的层数"
						},
						"width": {
							"_leaf": true,
							"_type": "disable",
							"_range": "false",
							"_docs": "宽度",
							"_data": "地图x方向大小,请在表格最下方修改"
						},
						"height": {
							"_leaf": true,
							"_type": "disable",
							"_range": "false",
							"_docs": "高度",
							"_data": "地图y方向大小,请在表格最下方修改"
						},
						"canFlyTo": {
							"_leaf": true,
							"_type": "checkbox",
							"_docs": "可楼传飞到",
							"_data": "该楼能否被楼传器飞到"
						},
						"canFlyFrom": {
							"_leaf": true,
							"_type": "checkbox",
							"_docs": "可楼传飞出",
							"_data": "该楼能否用楼传器飞出"
						},
						"canUseQuickShop": {
							"_leaf": true,
							"_type": "checkbox",
							"_docs": "快捷商店",
							"_data": "该层是否允许使用快捷商店"
						},
						"cannotViewMap": {
							"_leaf": true,
							"_type": "checkbox",
							"_docs": "不可浏览",
							"_data": "该层是否不允许被浏览地图看到；如果勾上则浏览地图会跳过该层"
						},
						"cannotMoveDirectly": {
							"_leaf": true,
							"_type": "checkbox",
							"_docs": "不可瞬移",
							"_data": "该层是否不允许瞬间移动；如果勾上则不可在此层进行瞬移"
						},
						"underGround": {
							"_leaf": true,
							"_type": "checkbox",
							"_docs": "地下层",
							"_data": "是否是地下层；如果该项为true则同层传送将传送至上楼梯"
						},
						"firstArrive": {
							"_leaf": true,
							"_type": "event",
							"_event": "firstArrive",
							"_docs": "首次到达事件",
							"_data": "第一次到该楼层触发的事件，可以双击进入事件编辑器。"
						},
						"eachArrive": {
							"_leaf": true,
							"_type": "event",
							"_event": "eachArrive",
							"_docs": "每次到达事件",
							"_data": "每次到该楼层触发的事件，可以双击进入事件编辑器；该事件会在firstArrive执行后再执行。"
						},
						"parallelDo": {
							"_leaf": true,
							"_type": "textarea",
							"_string": true,
							"_lint": true,
							"_template": "(function (timestamp) {\\n\\t// 在这里写楼层并行脚本，大约每16.6ms执行一次\\n\\t// timestamp: 从游戏开始到当前所经过的毫秒数。\\n\\t\\n})(timestamp);",
							"_docs": "并行处理脚本",
							"_data": "在该层楼时执行的并行脚本处理。\n可以在这里写上任意需要自动执行的脚本，比如打怪自动开门等。\n详见文档-事件-并行事件处理。"
						},
						"upFloor": {
							"_leaf": true,
							"_type": "point",
							"_range": "thiseval==null||((thiseval instanceof Array) && thiseval.length==2)",
							"_docs": "上楼点",
							"_data": "该层上楼点，如[2,3]。\n如果此项不为null，则楼层转换时的stair:upFloor，以及楼传器的落点会被替换成该点而不是该层的上楼梯。"
						},
						"downFloor": {
							"_leaf": true,
							"_type": "point",
							"_range": "thiseval==null||((thiseval instanceof Array) && thiseval.length==2)",
							"_docs": "下楼点",
							"_data": "该层下楼点，如[2,3]。\n如果此项不为null，则楼层转换时的stair:downFloor，以及楼传器的落点会被替换成该点而不是该层的下楼梯。"
						},
						"flyPoint": {
							"_leaf": true,
							"_type": "point",
							"_range": "thiseval==null||((thiseval instanceof Array) && thiseval.length==2)",
							"_docs": "楼传落点",
							"_data": "该层楼传落点，如[2,3]。\n如果此项不为null，则楼层飞行器强行落到此点，无视上下楼或平面塔属性。"
						},
						"defaultGround": {
							"_leaf": true,
							"_type": "textarea",
							"_docs": "地面图块",
							"_data": "默认地面的图块ID，此项修改后需要刷新才能看到效果。不填则默认是ground"
						},
						"images": {
							"_leaf": true,
							"_type": "event",
							"_event": "floorImage",
							"_docs": "楼层贴图"
						},
						"color": {
							"_leaf": true,
							"_type": "color",
							"_docs": "色调",
							"_data": "该层的默认画面色调。本项可不写（代表无色调），如果写需要是一个RGBA数组如[255,0,0,0.3]"
						},
						"weather": {
							"_leaf": true,
							"_type": "textarea",
							"_docs": "天气",
							"_data": "该层的默认天气。本项可忽略表示晴天，如果写则第一项为\"rain\"，\"snow\", \"sun\", \"fog\", \"cloud\“代表对应的天气，第二项为1-10之间的数代表强度。\n如[\"rain\", 8]代表8级雨天。"
						},
						"bgm": {
							"_leaf": true,
							"_type": "material",
							"_directory": "./project/bgms/",
							"_transform": (function (one) {
								if (one.endsWith('.mp3') || one.endsWith('.ogg') || one.endsWith('.wav') || one.endsWith('.m4a') || one.endsWith('.flac'))
									return one;
								return null;
							}).toString(),
							"_onconfirm": (function (previous, current) {
								if (current.length == 0) return null;
								if (current.length == 1) return current[0];
								return current;
							}).toString(),
							"_docs": "背景音乐",
							"_data": "到达该层后默认播放的BGM"
						},
						"ratio": {
							"_leaf": true,
							"_type": "textarea",
							"_range": "thiseval==~~thiseval && thiseval>=0",
							"_docs": "宝石血瓶效果",
							"_data": "每一层的宝石/血瓶效果，即获得宝石和血瓶时框内\"ratio\"的值。"
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
							"_docs": "普通事件",
							"_data": "该点的可能事件列表，可以双击进入事件编辑器。"
						},
						"autoEvent": {
							"_type": "object",
							"_leaf": false,
							"_action": function (args) {
								args.vobj = args.vobj || {};
								for (var ii = 0; ii < 2; ii++) {
									args.vobj[ii] = args.vobj[ii] || null;
								}
							},
							"_data": function (key) {
								return {
									"_leaf": true,
									"_type": "event",
									"_event": "autoEvent",
									"_data": "自动事件"
								}
							}
						},
						"changeFloor": {
							"_leaf": true,
							"_type": "event",
							"_event": "changeFloor",
							"_docs": "楼层转换",
							"_data": "该点楼层转换事件；该事件不能和上面的events同时出现，否则会被覆盖"
						},
						"beforeBattle": {
							"_leaf": true,
							"_type": "event",
							"_event": "beforeBattle",
							"_docs": "战前事件",
							"_data": "该点战斗前可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"afterBattle": {
							"_leaf": true,
							"_type": "event",
							"_event": "afterBattle",
							"_docs": "战后事件",
							"_data": "该点战斗后可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"afterGetItem": {
							"_leaf": true,
							"_type": "event",
							"_event": "afterGetItem",
							"_docs": "道具后事件",
							"_data": "该点获得道具后可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"afterOpenDoor": {
							"_leaf": true,
							"_type": "event",
							"_event": "afterOpenDoor",
							"_docs": "开门后事件",
							"_data": "该点开完门后可能触发的事件列表，可以双击进入事件编辑器。"
						},
						"cannotMove": {
							"_leaf": true,
							"_type": "checkboxSet",
							"_checkboxSet": {
								"prefix": ["上: ", "下: ", "<br>左: ", "右: "],
								"key": ["up", "down", "left", "right"]
							},
							"_docs": "不可出方向",
							"_data": "该点不可通行出的方向 \n 可以在这里定义该点不能前往哪个方向，可以达到悬崖之类的效果"
						},
						"cannotMoveIn": {
							"_leaf": true,
							"_type": "checkboxSet",
							"_checkboxSet": {
								"prefix": ["上: ", "下: ", "<br>左: ", "右: "],
								"key": ["up", "down", "left", "right"]
							},
							"_docs": "不可入方向",
							"_data": "该点不可通行入的方向 \n 可以在这里定义从哪个方向前往该点，可以达到悬崖之类的效果"
						},
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
			"canFlyFrom": true,
			"canUseQuickShop": true,
			"cannotViewMap": false,
			"cannotMoveDirectly": false,
			"images": [],
			"ratio": 1,
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
			"beforeBattle": {},
			"afterBattle": {},
			"afterGetItem": {},
			"afterOpenDoor": {},
			"autoEvent": {},
			"cannotMove": {},
			"cannotMoveIn": {}
		}
	}
}