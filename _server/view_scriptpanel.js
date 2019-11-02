"use strict";

/**
 * view_scriptpanel.js 脚本编辑界面
 */

var view_scriptpanel_wrapper = function(editor) {
    
class scriptPanel {

    constructor() {
        var fmap = {};
        var fjson = JSON.stringify(functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a, function (k, v) {
            if (v instanceof Function) {
                var id_ = editor.util.guid();
                fmap[id_] = v.toString();
                return id_;
            } else return v
        }, 4);
        var fobj = JSON.parse(fjson);
        editor.file.functionsMap = fmap;
        editor.file.functionsJSON = fjson;
        var buildlocobj = function (locObj) {
            for (var key in locObj) {
                if (typeof(locObj[key]) !== typeof('')) buildlocobj(locObj[key]);
                else locObj[key] = fmap[locObj[key]];
            }
        };
        this.scriptList = new editor.list(
            document.getElementById("scriptList"),
            editor.file.functionsComment,
            function () {
                var locObj = JSON.parse(editor.file.functionsJSON);
                buildlocobj(locObj);
                return locObj;
            },
        );
        this.scriptList.update();
        this.positionInfo = editor.infoBar.applyBlock("editor");
        //editor.multi.editor.onMouseDown(this.updatePosition.bind(this));
    }

    active() {
        this.positionInfo.show();
    }

    unactive() {
        this.positionInfo.hide();
    }

    updatePosition(e) {
        console.log(e);
        this.positionInfo.setContent.call(this.positionInfo, `Ln ${e.target.range.startLineNumber}, Col ${e.target.range.startColumn}`);
    }
}

editor.scriptPanel = new scriptPanel();
}