editor_util_wrapper = function (editor) {

    editor_util = function () {

    }

    editor_util.prototype.guid = function () {
        return 'id_' + 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    editor_util.prototype.HTMLescape = function (str_) {
        return String(str_).split('').map(function (v) {
            return '&#' + v.charCodeAt(0) + ';'
        }).join('');
    }
    
    editor.constructor.prototype.util = new editor_util();
}
//editor_util_wrapper(editor);