editor_file_wrapper = function (editor) {
    editor_file_proto = function () {

    }

    // 这个函数之后挪到editor.table?
    editor_file_proto.prototype.loadCommentjs=function(callback){
        var commentjs = {
            'comment': 'comment',
            'data.comment': 'dataComment',
            'functions.comment': 'functionsComment',
            'events.comment': 'eventsComment',
            'plugins.comment': 'pluginsComment',
        }
        for (var key in commentjs) {
            (function (key) {
                var value = commentjs[key];
                var script = document.createElement('script');
                if (window.location.href.indexOf('_server') !== -1)
                    script.src = key + '.js';
                else
                    script.src = '_server/table/' + key + '.js';
                document.body.appendChild(script);
                script.onload = function () {
                    editor.file[value] = eval(key.replace('.', '_') + '_c456ea59_6018_45ef_8bcc_211a24c627dc');
                    var loaded = Boolean(callback);
                    for (var key_ in commentjs) {
                        loaded = loaded && editor.file[commentjs[key_]]
                    }
                    if (loaded) callback();
                }
            })(key);
        }
    }


}