/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：公共事件。
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
					"整数输入": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "面板美化"
					},
					"自绘状态栏": {
						"_leaf": true,
						"_type": "event",
						"_event": "commonEvent",
						"_data": "横屏专用"
					}
				}
				if (obj[key]) return obj[key];
				return {
					"_leaf": true,
					"_type": "event",
					"_event": "commonEvent",
					"_data": "公共事件"
				}
			}
		}
	}
}