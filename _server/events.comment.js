var events_comment_c456ea59_6018_45ef_8bcc_211a24c627dc =
{
    
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
                        "_data": "打败怪物后进行加点"
                    },
                    "毒衰咒处理": {
                        "_leaf": true,
                        "_type": "event",
                        "_range": "thiseval instanceof Array",
                        "_event": "commonEvent",
                        "_data": "对毒衰咒效果进行的处理"
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