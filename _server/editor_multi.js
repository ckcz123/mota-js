"use strict";
/**
 * editor_multi.js 代码编辑器
 */

var editor_multi_wrapper = function(editor) {
    
require.config({ paths: { 'vs': '_server/vs' }});

class editor_multi {

    constructor() {
        this.body = document.getElementById("mutli");
        this.container = document.getElementById("monacoContainer");
        var _this = this;
        require(['vs/editor/editor.main'], function() {
            _this.editor = monaco.editor.create(_this.container, {
                theme: 'vs-dark',
                mouseWheelScrollSensitivity: 0.4,
                language: 'javascript'
            });
        });
    }

    show() {
        this.body.style.zIndex = 1;
        this.body.style.opacity = 1;
    }

    hide() {
        this.body.style.zIndex = -1;
        this.body.style.opacity = 0;
    }

    import(src, path, onchange) {
        this.editor.setValue(eval("src"+path));
        this.show();
    }

}

editor.multi = new editor_multi();
}