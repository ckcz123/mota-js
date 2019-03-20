var plugins_comment_c456ea59_6018_45ef_8bcc_211a24c627dc =
{
    "_type": "object",
    "_data": function (key) {
        var obj = {
            "init": {
                "_leaf": true,
                "_type": "textarea",
                "_range": "typeof(thiseval)=='string'",
                "_data": "自定义插件"
            },
            "drawLight": {
                "_leaf": true,
                "_type": "textarea",
                "_range": "typeof(thiseval)=='string' || thiseval==null",
                "_data": "绘制灯光效果"
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