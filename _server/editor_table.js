editor_table_wrapper = function (editor) {

    editor_table = function () {

    }

    /////////////////////////////////////////////////////////////////////////////
    // HTML模板

    editor_table.prototype.select = function (value, values) {
        return `<select>\n${
            editor.table.option(value) +
            values.map(function (v) {
                return editor.table.option(v)
            }).join('')
            }</select>\n`
    }
    editor_table.prototype.option = function (value) {
        return `<option value='${JSON.stringify(value)}'>${JSON.stringify(value)}</option>\n`
    }
    editor_table.prototype.text = function (value) {
        return `<input type='text' spellcheck='false' value='${JSON.stringify(value)}'/>\n`
    }
    editor_table.prototype.checkbox = function (value) {
        return `<input type='checkbox' ${(value ? 'checked ' : '')}/>\n`
    }
    editor_table.prototype.textarea = function (value, indent) {
        return `<textarea spellcheck='false'>${JSON.stringify(value, null, indent || 0)}</textarea>\n`
    }

    editor_table.prototype.title = function () {
        return `\n<tr><td>条目</td><td>注释</td><td>值</td></tr>\n`
    }

    editor_table.prototype.gap = function (field) {
        return `<tr><td>----</td><td>----</td><td>${field}</td></tr>\n`
    }


    /////////////////////////////////////////////////////////////////////////////
    // 表格生成的控制


    /**
     * 缩进控制, 此函数未实装, 目前全部使用的是0
     */
    editor_table.prototype.indent = function (field) {
        var num = '\t';
        if (field.indexOf("['main']") === 0) return 0;
        if (field === "['special']") return 0;
        return num;
    }

    /**
     * 注释对象的默认值
     */
    editor_table.prototype.defaultcobj = {
        // 默认是文本域
        _type: 'textarea',
        _data: '',
        _string: function (args) {//object~[field,cfield,vobj,cobj]
            var thiseval = args.vobj;
            return (typeof (thiseval) === typeof ('')) && thiseval[0] === '"';
        },
        // 默认情况下 非对象和数组的视为叶节点
        _leaf: function (args) {//object~[field,cfield,vobj,cobj]
            var thiseval = args.vobj;
            if (thiseval == null || thiseval == undefined) return true;//null,undefined
            if (typeof (thiseval) === typeof ('')) return true;//字符串
            if (Object.keys(thiseval).length === 0) return true;//数字,true,false,空数组,空对象
            return false;
        },
    }

    /**
     * 把来自数据文件的obj和来自*comment.js的commentObj组装成表格
     * commentObj在无视['_data']的意义下与obj同形
     * 即: commentObj['_data']['a']['_data']['b'] 与 obj['a']['b'] 是对应的
     *     在此意义下, 两者的结构是一致的
     *     在commentObj没有被定义的obj的分支, 会取defaultcobj作为默认值
     * 因此在深度优先遍历时,维护 
     *     field="['a']['b']"
     *     cfield="['_data']['a']['_data']['b']"
     *     vobj=obj['a']['b']
     *     cobj=commentObj['_data']['a']['_data']['b']
     * cobj
     *     cobj = Object.assign({}, defaultcobj, pcobj['_data'][ii])
     *     每一项若未定义,就从defaultcobj中取
     *     当其是函数不是具体值时,把args = {field: field, cfield: cfield, vobj: vobj, cobj: cobj}代入算出该值
     * 得到的叶节点的<tr>结构如下
     *     tr>td[title=field]
     *       >td[title=comment,cobj=cobj:json]
     *       >td>div>input[value=thiseval]
     * 返回结果
     *     返回一个对象, 假设被命名为tableinfo
     *     在把一个 table 的 innerHTML 赋值为 tableinfo.HTML 后
     *     再调 tableinfo.listen(tableinfo.guids) 进行绑定事件
     * @param {Object} obj 
     * @param {Object} commentObj 
     * @returns {{"HTML":String,"guids":String[],"listen":Function}}
     */
    editor_table.prototype.objToTable_ = function (obj, commentObj) {
        // 表格抬头
        var outstr = [editor.table.title()];
        var guids = [];
        var defaultcobj = this.defaultcobj
        /**
         * 深度优先遍历, p*即为父节点的四个属性
         * @param {String} pfield 
         * @param {String} pcfield 
         * @param {Object} pvobj 
         * @param {Object} pcobj 
         */
        var recursionParse = function (pfield, pcfield, pvobj, pcobj) {
            var keysForTableOrder = {};
            var voidMark = {};
            // 1. 按照pcobj排序生成
            if (pcobj && pcobj['_data']) {
                for (var ii in pcobj['_data']) keysForTableOrder[ii] = voidMark;
            }
            // 2. 对每个pvobj且不在pcobj的，再添加到最后
            keysForTableOrder = Object.assign(keysForTableOrder, pvobj)
            for (var ii in keysForTableOrder) {
                // 3. 对于pcobj有但是pvobj中没有的, 弹出提示, (正常情况下editor_file会补全成null)
                //    事实上能执行到这一步工程没崩掉打不开,就继续吧..
                if (keysForTableOrder[ii] === voidMark) {
                    if (typeof id_815975ad_ee6f_4684_aac7_397b7e392702 === "undefined") {
                        alert('comment和data不匹配,请在群 HTML5造塔技术交流群 959329661 内反馈')
                        console.error('comment和data不匹配,请在群 HTML5造塔技术交流群 959329661 内反馈')
                        id_815975ad_ee6f_4684_aac7_397b7e392702 = 1;
                    }
                    pvobj[ii] = null;
                }
                var field = pfield + "['" + ii + "']";
                var cfield = pcfield + "['_data']['" + ii + "']";
                var vobj = pvobj[ii];
                var cobj = null;
                if (pcobj && pcobj['_data'] && pcobj['_data'][ii]) {
                    // cobj存在时直接取
                    cobj = Object.assign({}, defaultcobj, pcobj['_data'][ii]);
                } else {
                    // 当其函数时代入参数算出cobj, 不存在时只取defaultcobj
                    if (pcobj && (pcobj['_data'] instanceof Function)) cobj = Object.assign({}, defaultcobj, pcobj['_data'](ii));
                    else cobj = Object.assign({}, defaultcobj);
                }
                var args = { field: field, cfield: cfield, vobj: vobj, cobj: cobj }
                // 当cobj的参数为函数时,代入args算出值
                for (var key in cobj) {
                    if (key === '_data') continue;
                    if (cobj[key] instanceof Function) cobj[key] = cobj[key](args);
                }
                // 标记为_hide的属性不展示
                if (cobj._hide) continue;
                if (!cobj._leaf) {
                    // 不是叶节点时, 插入展开的标记并继续遍历, 此处可以改成按钮用来添加新项或折叠等
                    outstr.push(editor.table.gap(field));
                    recursionParse(field, cfield, vobj, cobj);
                } else {
                    // 是叶节点时, 调objToTr_渲染<tr>
                    var leafnode = editor_table.objToTr_(obj, commentObj, field, cfield, vobj, cobj);
                    outstr.push(leafnode[0]);
                    guids.push(leafnode[1]);
                }
            }
        }
        // 开始遍历
        recursionParse("", "", obj, commentObj);
        
        var listen = function (guids) {
            // 每个叶节点的事件绑定
            guids.forEach(guidListen);
        }
        return { "HTML": outstr.join(''), "guids": guids, "listen": listen };
    }

    /**
     * 返回叶节点<tr>形如
     * tr>td[title=field]
     *   >td[title=comment,cobj=cobj:json]
     *   >td>div>input[value=thiseval]
     * 参数意义在 objToTable_ 中已解释
     * @param {Object} obj 
     * @param {Object} commentObj 
     * @param {String} field 
     * @param {String} cfield 
     * @param {Object} vobj 
     * @param {Object} cobj 
     */
    editor_table.prototype.objToTr_ = function (obj, commentObj, field, cfield, vobj, cobj) {
        var guid = editor.guid();
        var thiseval = vobj;
        var comment = String(cobj._data);

        var charlength = 10;
        // "['a']['b']" => "b"
        var shortField = field.split("']").slice(-2)[0].split("['").slice(-1)[0];
        // 把长度超过 charlength 的字符改成 固定长度+...的形式
        shortField = (shortField.length < charlength ? shortField : shortField.slice(0, charlength) + '...');

        // 完整的内容转义后供悬停查看
        var commentHTMLescape = editor.HTMLescape(comment);
        // 把长度超过 charlength 的字符改成 固定长度+...的形式
        var shortCommentHTMLescape = (comment.length < charlength ? commentHTMLescape : editor.HTMLescape(comment.slice(0, charlength)) + '...');

        var cobjstr = Object.assign({}, cobj);
        delete cobjstr._data;
        // 把cobj塞到第二个td的[cobj]中, 方便绑定事件时取
        cobjstr = editor.HTMLescape(JSON.stringify(cobjstr));

        var outstr = ['<tr id="', guid, '"><td title="', field, '">', shortField, '</td>',
            '<td title="', commentHTMLescape, '" cobj="', cobjstr, '">', shortCommentHTMLescape, '</td>',
            '<td><div class="etableInputDiv">', editor_mode.objToTd_(obj, commentObj, field, cfield, vobj, cobj), '</div></td></tr>\n',
        ];
        return [outstr.join(''), guid];
    }

    editor_table.prototype.objToTd_ = function (obj, commentObj, field, cfield, vobj, cobj) {
        var thiseval = vobj;
        if (cobj._select) {
            var values = cobj._select.values;
            return editor.table.select(thiseval,values);
        } else if (cobj._input) {
            return editor.table.text(thiseval);
        } else if (cobj._bool) {
            return editor.table.checkbox(thiseval);
        } else {
            var num = 0;//editor_table.indent(field);
            return editor.table.textarea(thiseval,num);
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // 表格的用户交互

    var checkRange = function (cobj, thiseval) {
        if (cobj._range) {
            return eval(cobj._range);
        }
        if (cobj._select) {
            return cobj._select.values.indexOf(thiseval) !== -1;
        }
        if (cobj._bool) {
            return [true, false].indexOf(thiseval) !== -1;
        }
        return true;
    }

    var guidListen=function (guid) {
        // tr>td[title=field]
        //   >td[title=comment,cobj=cobj:json]
        //   >td>div>input[value=thiseval]
        var thisTr = document.getElementById(guid);
        var input = thisTr.children[2].children[0].children[0];
        var field = thisTr.children[0].getAttribute('title');
        var cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
        var modeNode = thisTr.parentNode;
        while (!editor_mode._ids.hasOwnProperty(modeNode.getAttribute('id'))) {
            modeNode = modeNode.parentNode;
        }
        input.onchange = function () {
            editor_mode.onmode(editor_mode._ids[modeNode.getAttribute('id')]);
            var thiseval = null;
            if (input.checked != null) input.value = input.checked;
            try {
                thiseval = JSON.parse(input.value);
            } catch (ee) {
                printe(field + ' : ' + ee);
                throw ee;
            }
            if (checkRange(cobj, thiseval)) {
                editor_mode.addAction(['change', field, thiseval]);
                editor_mode.onmode('save');//自动保存 删掉此行的话点保存按钮才会保存
            } else {
                printe(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
            }
        }
        // 双击表格时
        //    正常编辑: 尝试用事件编辑器或多行文本编辑器打开
        //    添加: 在该项的同一级创建一个内容为null新的项, 刷新后生效并可以继续编辑
        //    删除: 删除该项, 刷新后生效
        // 在点击按钮 添加/删除 后,下一次双击将被视为 添加/删除
        var dblclickfunc = function () {
            if (editor_mode.doubleClickMode === 'change') {
                if (cobj._type === 'event') editor_blockly.import(guid, { type: cobj._event });
                if (cobj._type === 'textarea') editor_multi.import(guid, { lint: cobj._lint, string: cobj._string });
            }
            if (editor_mode.doubleClickMode === 'add') {
                editor_mode.doubleClickMode = 'change';
                addfunc()
            }
            if (editor_mode.doubleClickMode === 'delete') {
                editor_mode.doubleClickMode = 'change';
                deletefunc()
            }
        }
        input.ondblclick = dblclickfunc
        var doubleClickCheck = [0];
        thisTr.onclick = function () {
            var newClick = new Date().getTime();
            var lastClick = doubleClickCheck.shift();
            doubleClickCheck.push(newClick);
            if (newClick - lastClick < 500) {
                dblclickfunc()
            }
        }
        var deletefunc = function () {
            editor_mode.onmode(editor_mode._ids[modeNode.getAttribute('id')]);
            if (checkRange(cobj, null)) {
                editor_mode.addAction(['delete', field, undefined]);
                editor_mode.onmode('save');//自动保存 删掉此行的话点保存按钮才会保存
            } else {
                printe(field + ' : 该值不允许为null，无法删除');
            }
        }
        var addfunc = function () {
            editor_mode.onmode(editor_mode._ids[modeNode.getAttribute('id')]);

            var mode = document.getElementById('editModeSelect').value;

            // 1.输入id
            var newid = prompt('请输入新项的ID（仅公共事件支持中文ID）');
            if (newid == null || newid.length == 0) {
                return;
            }

            // 检查commentEvents
            if (mode !== 'commonevent') {
                // 2.检查id是否符合规范或与已有id重复
                if (!/^[a-zA-Z0-9_]+$/.test(newid)) {
                    printe('id不符合规范, 请使用大小写字母数字下划线来构成');
                    return;
                }
            }

            var conflict = true;
            var basefield = field.replace(/\[[^\[]*\]$/, '');
            if (basefield === "['main']") {
                printe("全塔属性 ~ ['main'] 不允许添加新值");
                return;
            }
            try {
                var baseobj = eval('obj' + basefield);
                conflict = newid in baseobj;
            } catch (ee) {
                // 理论上这里不会发生错误
                printe(ee);
                throw ee;
            }
            if (conflict) {
                printe('id已存在, 请直接修改该项的值');
                return;
            }
            // 3.添加 
            editor_mode.addAction(['add', basefield + "['" + newid + "']", null]);
            editor_mode.onmode('save');//自动保存 删掉此行的话点保存按钮才会保存
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    editor.constructor.prototype.table = new editor_table();
}
//editor_table_wrapper(editor);