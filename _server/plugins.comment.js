var plugins_comment_c456ea59_6018_45ef_8bcc_211a24c627dc =
{
    "_type": "object",
    "_data": function (key) {
        var obj = {
            "test": {
                "_leaf": true,
                "_type": "textarea",
                "_range": "thiseval instanceof Array",
                "_data": "插件函数执行测试, 这个函数在导入后被直接执行(因此不允许删除)"
            },
            "drawLight": {
                "_leaf": true,
                "_type": "textarea",
                "_range": "thiseval instanceof Array || thiseval==null",
                "_data": "绘制灯光/漆黑层效果"
            },
        }
        if (obj[key]) return obj[key];
        return {
            "_leaf": true,
            "_type": "textarea",
            "_range": "thiseval instanceof Array || thiseval==null",
            "_data": "自定义插件"
        }
    }
}