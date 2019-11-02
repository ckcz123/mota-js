

editor_multi = function () {

    var editor_multi = {};

    var codeEditor = CodeMirror.fromTextArea(document.getElementById("multiLineCode"), {
        lineNumbers: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: true,
        smartIndent: true,
        mode: { name: "javascript", globalVars: true, localVars: true },
        lineWrapping: true,
        continueComments: "Enter",
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        autocomplete: true,
        autoCloseBrackets: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
    });

    editor_multi.codeEditor = codeEditor;

    codeEditor.on("keyup", function (cm, event) {
        if (codeEditor.getOption("autocomplete") && !event.ctrlKey && (
            (event.keyCode >= 65 && event.keyCode <= 90) ||
            (!event.shiftKey && event.keyCode == 190) || (event.shiftKey && event.keyCode == 189))) {
            try {
                CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
            } catch (e) {
            }
        }
    });

    editor_multi.id = '';
    editor_multi.isString = false;
    editor_multi.lintAutocomplete = false;

    editor_multi.show = function () {
        if (typeof (selectBox) !== typeof (undefined)) selectBox.isSelected(false);
        var valueNow = codeEditor.getValue();
        //try{eval('function _asdygakufyg_() { return '+valueNow+'\n}');editor_multi.lintAutocomplete=true;}catch(ee){}
        if (valueNow.slice(0, 8) === 'function') editor_multi.lintAutocomplete = true;
        editor_multi.setLint();
        document.getElementById('left7').style = '';
    }
    editor_multi.hide = function () {
        document.getElementById('left7').style = 'z-index:-1;opacity: 0;';
    }
    editor_multi.setLint = function () {
        codeEditor.setOption("lint", editor_multi.lintAutocomplete);
        codeEditor.setOption("autocomplete", editor_multi.lintAutocomplete);
        document.getElementById("lintCheckbox").checked = editor_multi.lintAutocomplete;
    }
    editor_multi.toggerLint = function () {
        editor_multi.lintAutocomplete = document.getElementById("lintCheckbox").checked;
        editor_multi.setLint();
    }

    editor_multi.indent = function (field) {
        if (typeof (editor) !== typeof (undefined) && editor && editor.mode && editor.mode.indent) return editor.mode.indent(field);
        return '\t';
    }

    var _format = function () {
        if (!editor_multi.lintAutocomplete) return;
        codeEditor.setValue(js_beautify(codeEditor.getValue(), {
            brace_style: "collapse-preserve-inline",
            indent_with_tabs: true,
            jslint_happy: true
        }));
    }

    editor_multi.format = function () {
        if (!editor_multi.lintAutocomplete) {
            alert("只有代码才能进行格式化操作！");
            return;
        }
        _format();
    }

    editor_multi.hasError = function () {
        if (!editor_multi.lintAutocomplete) return false;
        return JSHINT.errors.filter(function (e) {
            return e.code.startsWith("E")
        }).length > 0;
    }

    editor_multi.import = function (id_, args) {
        var thisTr = document.getElementById(id_);
        if (!thisTr) return false;
        var input = thisTr.children[2].children[0].children[0];
        var field = thisTr.children[0].getAttribute('title');
        var comment = thisTr.children[1].getAttribute('title');
        if (!input.type || input.type !== 'textarea') return false;
        editor_multi.id = id_;
        editor_multi.isString = false;
        editor_multi.lintAutocomplete = false;
        if (args.lint === true) editor_multi.lintAutocomplete = true;
        if (field.indexOf('Effect') !== -1) editor_multi.lintAutocomplete = true;
        if ((!input.value || input.value == 'null') && editor_mode.mode == 'plugins')
            input.value = '"function () {\\n\\t// 在此增加新插件\\n\\t\\n}"';
        if (input.value.slice(0, 1) === '"' || args.string) {
            editor_multi.isString = true;
            codeEditor.setValue(JSON.parse(input.value) || '');
        } else {
            var num = editor_multi.indent(field);
            eval('var tobj=' + (input.value || 'null'));
            var tmap = {};
            var tstr = JSON.stringify(tobj, function (k, v) {
                if (typeof (v) === typeof ('') && v.slice(0, 8) === 'function') {
                    var id_ = editor.util.guid();
                    tmap[id_] = v.toString();
                    return id_;
                } else return v
            }, num);
            for (var id_ in tmap) {
                tstr = tstr.replace('"' + id_ + '"', tmap[id_])
            }
            codeEditor.setValue(tstr || '');
        }
        document.getElementById('showPlugins').style.display = editor_mode.mode == 'plugins' ? 'block': 'none';
        editor_multi.show();
        return true;
    }

    editor_multi.cancel = function () {
        editor_multi.hide();
        editor_multi.id = '';
        multiLineArgs = [null, null, null];
    }

    editor_multi.confirm = function () {
        if (editor_multi.hasError()) {
            alert("当前好像存在严重的语法错误，请处理后再保存。\n严重的语法错误可能会导致整个编辑器的崩溃。");
            return;
        }

        if (!editor_multi.id) {
            editor_multi.id = '';
            return;
        }

        if (editor_multi.id === 'callFromBlockly') {
            // ----- 自动格式化
            _format();
            editor_multi.id = '';
            editor_multi.multiLineDone();
            return;
        }

        if (editor_multi.id === 'importFile') {
            _format();
            editor_multi.id = '';
            editor_multi.writeFileDone();
            return;
        }

        var setvalue = function (value) {
            var thisTr = document.getElementById(editor_multi.id);
            editor_multi.id = '';
            var input = thisTr.children[2].children[0].children[0];
            if (editor_multi.isString) {
                input.value = JSON.stringify(value);
            } else {
                eval('var tobj=' + (value || 'null'));
                var tmap = {};
                var tstr = JSON.stringify(tobj, function (k, v) {
                    if (v instanceof Function) {
                        var id_ = editor.util.guid();
                        tmap[id_] = v.toString();
                        return id_;
                    } else return v
                }, 4);
                for (var id_ in tmap) {
                    tstr = tstr.replace('"' + id_ + '"', JSON.stringify(tmap[id_]))
                }
                input.value = tstr;
            }
            editor_multi.hide();
            input.onchange();
        }
        // ----- 自动格式化
        _format();
        setvalue(codeEditor.getValue() || '');
    }

    editor_multi.showPlugins = function () {
        if (editor.isMobile && !confirm("你确定要跳转到云端插件列表吗？")) return;
        window.open("https://h5mota.com/plugins/", "_blank");
    }

    var multiLineArgs = [null, null, null];
    editor_multi.multiLineEdit = function (value, b, f, args, callback) {
        editor_multi.id = 'callFromBlockly';
        codeEditor.setValue(value.split('\\n').join('\n') || '');
        multiLineArgs[0] = b;
        multiLineArgs[1] = f;
        multiLineArgs[2] = callback;
        editor_multi.lintAutocomplete = Boolean(args.lint);
        editor_multi.show();
    }
    editor_multi.multiLineDone = function () {
        editor_multi.hide();
        if (!multiLineArgs[0] || !multiLineArgs[1] || !multiLineArgs[2]) return;
        var newvalue = codeEditor.getValue() || '';
        multiLineArgs[2](newvalue, multiLineArgs[0], multiLineArgs[1])
    }

    var _fileValues = ['']
    editor_multi.importFile = function (filename) {
        editor_multi.id = 'importFile'
        _fileValues[0] = filename
        codeEditor.setValue('loading')
        editor_multi.show();
        fs.readFile(filename, 'base64', function (e, d) {
            if (e) {
                codeEditor.setValue('加载文件失败:\n' + e)
                editor_multi.id = ''
                return;
            }
            var str = editor.util.decode64(d)
            codeEditor.setValue(str)
            _fileValues[1] = str
        })
    }

    editor_multi.writeFileDone = function () {
        fs.writeFile(_fileValues[0], editor.util.encode64(codeEditor.getValue() || ''), 'base64', function (err, data) {
            if (err) printe('文件写入失败,请手动粘贴至' + _fileValues[0] + '\n' + err);
            else {
                editor_multi.hide();
                printf(_fileValues[0] + " 写入成功，F5刷新后生效");
            }
        });
    }

    editor_multi.editCommentJs = function (mod) {
        var dict = {
            loc: '_server/table/comment.js',
            enemyitem: '_server/table/comment.js',
            floor: '_server/table/comment.js',
            tower: '_server/table/data.comment.js',
            functions: '_server/table/functions.comment.js',
            commonevent: '_server/table/events.comment.js',
            plugins: '_server/table/plugins.comment.js',
        }
        editor_multi.lintAutocomplete = true
        editor_multi.setLint()
        editor_multi.importFile(dict[mod])
    }

    return editor_multi;
}
//editor_multi=editor_multi();