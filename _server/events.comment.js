var events_comment_c456ea59_6018_45ef_8bcc_211a24c627dc =
{
    
    "_type": "object",
    "_data": {
        "commonEvent": {

            "_type": "object",
            "_data": function (key) {
                var obj = {
                    "addPoint": {
                        "_leaf": true,
                        "_type": "event",
                        "_range": "thiseval instanceof Array",
                        "_event": "commonEvent",
                        "_data": "加点事件，可以双击进入事件编辑器"
                    },
                    "test": {
                        "_leaf": true,
                        "_type": "event",
                        "_range": "thiseval instanceof Array",
                        "_event": "commonEvent",
                        "_data": "测试事件, events.comment.js中标记了_range不能为null, 所以应该无法删除"
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