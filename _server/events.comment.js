/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：公共事件。
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
						"_data": "打败怪物后加点"
					},
					"毒衰咒处理": {
						"_leaf": true,
						"_type": "event",
						"_range": "thiseval instanceof Array",
						"_event": "commonEvent",
						"_data": "毒衰咒效果处理"
					},
					"滑冰事件": {
						"_leaf": true,
						"_type": "event",
						"_range": "thiseval instanceof Array",
						"_event": "commonEvent",
						"_data": "滑冰事件"
					},
				}
				if (obj[key]) return obj[key];
				return {
					"_leaf": true,
					"_type": "event",
					"_event": "commonEvent",
					"_data": "自定义公共事件，可以双击进入事件编辑器"
				}
			}
		}
	}
}