/*
 * 表格配置项。
 * 在这里可以对表格中的各项显示进行配置，包括表格项、提示内容等内容。具体写法照葫芦画瓢即可。
 * 本配置项包括：插件编写。
 */

var plugins_comment_c456ea59_6018_45ef_8bcc_211a24c627dc = {
	"_type": "object",
	"_data": function (key) {
		var obj = {
			"init": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string'",
				"_data": "自定义插件"
			},
			"shop": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string'",
				"_data": "全局商店"
			},
			"drawLight": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string' || thiseval==null",
				"_data": "灯光效果"
			},
			"removeMap": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string' || thiseval==null",
				"_data": "砍层插件"
			},
			"fiveLayers": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string' || thiseval==null",
				"_data": "五图层(背景前景2)"
			},
			"itemShop": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string' || thiseval==null",
				"_data": "道具商店"
			},
			"smoothCamera": {
				"_leaf": true,
				"_type": "textarea",
				"_range": "typeof(thiseval)=='string' || thiseval==null",
				"_data": "平滑移动镜头"
			},
		}
		if (obj[key]) return obj[key];
		return {
			"_leaf": true,
			"_type": "textarea",
			"_range": "typeof(thiseval)=='string' || thiseval==null",
			"_data": "自定义插件"
		}
	}
}