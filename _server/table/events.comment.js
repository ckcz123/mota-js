/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：公共事件、常用事件模板。
 * 相关文档 _docs/editor.md ~ http://127.0.0.1:1055/_docs/#/editor?id=修改表格
 */

var events_comment_c456ea59_6018_45ef_8bcc_211a24c627dc = {
	"_type": "object",
	"_data": {
		"commonEvent": {
			"_type": "object",
			"_data": function (key) {
				var obj = {
					"加点事件": {
						"_leaf": true,
						"_type": "event",
						"_range": "thiseval instanceof Array",
						"_event": "commonEvent",
						"_data": "加点事件"
					},
					"回收钥匙商店": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "回收钥匙商店"
					},
				}
				if (obj[key]) return obj[key];
				return {
					"_leaf": true,
					"_type": "event",
					"_event": "commonEvent",
					"_data": "公共事件"
				}
			}
		},
		"commonEventTemplate": {
			"_type": "object",
			"_data": function (key) {
				var obj = {
					"检测音乐如果没有开启则系统提示开启": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "检测音乐如果没有开启则系统提示开启"
					},
					"仿新新魔塔一次性商人": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "仿新新魔塔一次性商人"
					},
					"全地图选中一个点": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "全地图选中一个点"
					},
					"多阶段Boss战斗": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "多阶段Boss战斗"
					},
				}
				if (obj[key]) return obj[key];
				return {
					"_leaf": true,
					"_type": "event",
					"_event": "commonEvent",
					"_data": "常見事件模板"
				}
			}
		}
	}
}