

editor_multi = function () {

    var editor_multi = {};

    var extraKeys = {
        "Ctrl-/": function (cm) { cm.toggleComment(); },
        "Ctrl-B": function (cm) { ternServer.jumpToDef(cm); },
        "Ctrl-Q": function(cm) { ternServer.rename(cm); },
        "Cmd-F": CodeMirror.commands.findPersistent,
        "Ctrl-F": CodeMirror.commands.findPersistent,
        "Ctrl-R": CodeMirror.commands.replaceAll,
        "Ctrl-D": function(cm){ cm.foldCode(cm.getCursor()); },
        "Ctrl-O": function () { editor_multi.openUrl('/_docs/#/api'); },
        "Ctrl-P": function () { editor_multi.openUrl('https://h5mota.com/plugins/'); }
    };

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
        gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        lint: true,
        autocomplete: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        extraKeys: extraKeys,
        foldGutter: true,
        inputStyle: "textarea",
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
    });

    var commandsName = {
        'Ctrl-/': '注释当前选中行（Ctrl+/）',
        'Ctrl-B': '跳转到定义（Ctrl+B）',
        'Ctrl-Q': '重命名变量（Ctrl+Q）',
        'Ctrl-F': '查找（Ctrl+F）',
        'Ctrl-R': '全部替换（Ctrl+R）',
        'Ctrl-D': '折叠或展开块（Ctrl+D）',
        'Ctrl-O': '打开API列表（Ctrl+O）',
        'Ctrl-P': '打开在线插件列表（Ctrl+P）'
    };

    document.getElementById('codemirrorCommands').innerHTML = 
        "<option value='' selected>执行操作...</option>" + 
        Object.keys(commandsName).map(function (name) {
            return "<option value='" + name + "'>" + commandsName[name] + "</option>"
        }).join('');

    var coredef = terndefs_f6783a0a_522d_417e_8407_94c67b692e50[2];
    Object.keys(core.material.enemys).forEach(function (name){
        coredef.core.material.enemys[name] = {
            "!type": "enemy",
            "!doc": core.material.enemys[name].name || "怪物"
        }
    });
    Object.keys(core.material.bgms).forEach(function (name) {
        coredef.core.material.bgms[name] = {
            "!type": "audio",
            "!doc": "背景音乐"
        }
    });
    Object.keys(core.material.sounds).forEach(function (name) {
        coredef.core.material.sounds[name] = {
            "!type": "audio",
            "!doc": "音效"
        }
    });
    Object.keys(core.material.animates).forEach(function (name) {
        coredef.core.material.animates[name] = {
            "!type": "animate",
            "!doc": "动画"
        }
    });
    Object.keys(core.material.images).forEach(function (name) {
        if (core.material.images[name] instanceof Image) {
            coredef.core.material.images[name] = {
                "!type": "image",
                "!doc": "系统图片"
            }
        } else {
            coredef.core.material.images[name] = {
                "!doc": name == 'autotile' ? '自动元件' : name == 'tilesets' ? '额外素材' : name == 'images' ? '自定义图片' : '系统图片'
            }
            for (var v in core.material.images[name]) {
                coredef.core.material.images[name][v] = {
                    "!type": "image",
                }
            }
        }

    })
    Object.keys(core.material.items).forEach(function (name) {
        coredef.core.material.items[name] = {
            "!type": "item",
            "!doc": core.material.items[name].name || "道具"
        }
    });
    functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a.enemys.getSpecials().forEach(function (one) {
        var name = one[1];
        if (name instanceof Function) name = name({});
        coredef.core.enemys.hasSpecial["!doc"] += name + "(" + one[0] + "); ";
    });
    Object.keys(core.canvas).forEach(function (name) {
        coredef.core.canvas[name] = {
            "!type": "CanvasRenderingContext2D",
            "!doc": "系统画布"
        }
    });
    Object.keys(core.status.maps).forEach(function (name) {
        coredef.core.status.maps[name] = {
            "!type": "floor",
            "!doc": core.status.maps[name].title || ''
        }
        coredef.core.status.bgmaps[name] = {
            "!type": "[[number]]",
            "!doc": core.status.maps[name].title || ''
        }
        coredef.core.status.fgmaps[name] = {
            "!type": "[[number]]",
            "!doc": core.status.maps[name].title || ''
        }
    });
    Object.keys(core.status.shops).forEach(function (id) {
        coredef.core.status.shops[id] = {
            "!doc": core.status.shops[id].textInList || "全局商店"
        }
    });
    Object.keys(core.status.textAttribute).forEach(function (id) {
        coredef.core.status.textAttribute[id] = {};
    });
    // --- 转发函数
    for (var name in coredef.core) {
        if (typeof coredef.core[name] === 'object') {
            for (var funcname in coredef.core[name]) {
                var one = coredef.core[name][funcname] || {};
                var type = one["!type"] || "";
                if (type.startsWith("fn(")) {
                    var forwardname = (functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a[name] || {})[funcname] ? '脚本编辑' : name;
                    coredef.core[funcname] = {
                        "!type": one["!type"],
                        "!doc": one["!doc"] + "<br/>（转发到" + forwardname + "中）"
                    };
                    if (one["!url"]) coredef.core[funcname]["!url"] = one["!url"];
                }
            }
            for (var funcname in core[name]) {
                if (!(core[name][funcname] instanceof Function) || funcname.charAt(0) == '_' || coredef.core[name][funcname]) continue;
                var parameterInfo = /^\s*function\s*[\w_$]*\(([\w_,$\s]*)\)\s*\{/.exec(core[name][funcname].toString());
                var parameters = (parameterInfo == null ? "" : parameterInfo[1])
                    .replace(/\s*/g, '').replace(/,/g, ', ').split(', ')
                    .filter(function (one) { return one.trim() != ''; })
                    .map(function (one) { return one.trim() + ': ?'; }).join(', ');
                coredef.core[funcname] = coredef.core[name][funcname] = {
                    "!type": "fn(" + parameters + ")"
                }
            }
        }
    }

    Object.keys(core.values).forEach(function (id) {
        var one = data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc._data.values._data[id];
        if (!one) return;
        coredef.core.values[id] = {
            "!type": "number",
            "!doc": one._data,
        }
    });
    Object.keys(core.flags).forEach(function (id) {
        var one = data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc._data.flags._data[id];
        if (!one) return;
        coredef.core.flags[id] = {
            "!type": id == 'statusBarItems' ? '[string]' : 'bool',
            "!doc": one._data,
        }
    });

    var ternServer = new CodeMirror.TernServer({
        defs: terndefs_f6783a0a_522d_417e_8407_94c67b692e50,
        plugins: {
            doc_comment: true,
            complete_strings: true,
        },
        useWorker: false
    });

    editor_multi.ternServer = ternServer;
    editor_multi.codeEditor = codeEditor;

    codeEditor.on("cursorActivity", function (cm) {
        var cursor = cm.getCursor();
        if (codeEditor.getOption("autocomplete") && !(cursor.line == 0 && cursor.ch == 0)) {
            ternServer.updateArgHints(cm);
            ternServer.showDocs(cm);
        }
    });

    var ctrlRelease = new Date();
    codeEditor.on("keyup", function (cm, event) {
        var date = new Date();
        if (event.keyCode == 17 || event.keyCode == 91) { // ctrl, cmd
            ctrlRelease = date;
        }
        else if (codeEditor.getOption("autocomplete") && !event.ctrlKey && date - ctrlRelease >= 1000 && (
            (event.keyCode >= 65 && event.keyCode <= 90) ||
            (!event.shiftKey && event.keyCode == 190) || (event.shiftKey && event.keyCode == 189))) {
            try {
                ternServer.complete(cm);
            } catch (e) {
            }
        }
    });

    editor_multi.id = '';
    editor_multi.isString = false;
    editor_multi.lintAutocomplete = false;

    var lastOffset = {};

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
        var offset = (codeEditor.getScrollInfo() || {}).top || 0;
        _setValue(js_beautify(codeEditor.getValue(), {
            brace_style: "collapse-preserve-inline",
            indent_with_tabs: true,
            jslint_happy: true
        }));
        codeEditor.scrollTo(0, offset);
    }

    var _setValue = function (val) {
        codeEditor.setValue(val || '');
        ternServer.delDoc('doc');
        ternServer.addDoc('doc', new CodeMirror.Doc(val || '', 'javascript'));
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

    var _previewButton = document.getElementById('editor_multi_preview');

    _previewButton.onclick = function () {
        if (!editor_multi.preview) return;
        _format();
        if (editor_multi.hasError()) {
            alert("当前好像存在严重的语法错误，请处理后再预览。");
            return;
        }
        editor.uievent.previewEditorMulti(editor_multi.preview, codeEditor.getValue());
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
        editor_multi.preview = args.preview;
        _previewButton.style.display = editor_multi.preview ? 'inline' : 'none';
        if (args.lint === true) editor_multi.lintAutocomplete = true;
        if ((!input.value || input.value == 'null') && args.template)
            input.value = '"' + args.template + '"';
        if ((!input.value || input.value == 'null') && editor_mode.mode == 'plugins')
            input.value = '"function () {\\n\\t// 在此增加新插件\\n\\t\\n}"';
        // if ((!input.value || input.value == 'null') && args)
        if (input.value.slice(0, 1) === '"' || args.string) {
            editor_multi.isString = true;
            _setValue(JSON.parse(input.value) || '');
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
            _setValue(tstr || '');
        }
        editor_multi.show();
        codeEditor.scrollTo(0, lastOffset[editor_multi.id] || 0);
        return true;
    }

    editor_multi.cancel = function () {
        if (editor_multi.id && editor_multi.id != 'callFromBlockly' && editor_multi.id != 'importFile') {
            lastOffset[editor_multi.id] = (codeEditor.getScrollInfo() || {}).top;
        }
        editor_multi.hide();
        editor_multi.id = '';
        multiLineArgs = [null, null, null];
    }

    editor_multi.confirm = function (keep) {
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
            editor_multi.multiLineDone(keep);
            return;
        }

        if (editor_multi.id === 'importFile') {
            _format();
            editor_multi.writeFileDone(keep);
            return;
        }

        var setvalue = function (value) {
            var thisTr = document.getElementById(editor_multi.id);
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
            if (!keep) {
                editor_multi.id = '';
                editor_multi.hide();
            } else {
                alert('写入成功！');
            }
            input.onchange();
        }
        lastOffset[editor_multi.id] = (codeEditor.getScrollInfo() || {}).top;
        // ----- 自动格式化
        _format();
        setvalue(codeEditor.getValue() || '');
    }

    editor_multi.doCommand = function (select) {
        var value = select.value;
        select.selectedIndex = 0;
        if (extraKeys[value]) {
            extraKeys[value](codeEditor);
        }
    }

    editor_multi.openUrl = function (url) {
        if (editor.isMobile && !confirm('你确定要离开本页面么？')) return;
        window.open(url, '_blank');
    }

    var multiLineArgs = [null, null, null];
    editor_multi.multiLineEdit = function (value, b, f, args, callback) {
        editor_multi.id = 'callFromBlockly';
        _setValue(value.split('\\n').join('\n') || '');
        multiLineArgs[0] = b;
        multiLineArgs[1] = f;
        multiLineArgs[2] = callback;
        editor_multi.lintAutocomplete = Boolean(args.lint);
        editor_multi.show();
    }
    editor_multi.multiLineDone = function (keep) {
        if (!multiLineArgs[0] || !multiLineArgs[1] || !multiLineArgs[2]) return;
        var newvalue = codeEditor.getValue() || '';
        multiLineArgs[2](newvalue, multiLineArgs[0], multiLineArgs[1])
        if (!keep) {
            editor_multi.id = '';
            editor_multi.hide();
        } else {
            alert('写入成功！');
        }
    }

    var _fileValues = ['']
    editor_multi.importFile = function (filename) {
        editor_multi.id = 'importFile'
        _fileValues[0] = filename
        _setValue('loading')
        editor_multi.show();
        fs.readFile(filename, 'base64', function (e, d) {
            if (e) {
                _setValue('加载文件失败:\n' + e)
                editor_multi.id = ''
                return;
            }
            var str = editor.util.decode64(d)
            _setValue(str)
            _fileValues[1] = str
        })
    }

    editor_multi.writeFileDone = function (keep) {
        fs.writeFile(_fileValues[0], editor.util.encode64(codeEditor.getValue() || ''), 'base64', function (err, data) {
            if (err) printe('文件写入失败,请手动粘贴至' + _fileValues[0] + '\n' + err);
            else {
                if (!keep) {
                    editor_multi.id = '';
                    editor_multi.hide();
                } else {
                    alert('写入成功！');
                }
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