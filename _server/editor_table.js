editor_table_wrapper = function (editor) {

    editor_table = function () {

    }

    /////////////////////////////////////////////////////////////////////////////
    // HTML模板

    editor_table.prototype.select = function (value, values) {
        if (values.indexOf(value) < 0) values = [value].concat(values);
        var content = values.map(function (v) {
                return editor.table.option(v, v == value)
            }).join('')
        return /* html */`<select>\n${content}</select>\n`
    }
    editor_table.prototype.option = function (value, selected) {
        return /* html */`<option value='${JSON.stringify(value)}' ${selected ? 'selected' : ''}>${JSON.stringify(value)}</option>\n`
    }
    editor_table.prototype.text = function (value) {
        return /* html */`<input type='text' spellcheck='false' value='${JSON.stringify(value)}'/>\n`
    }
    editor_table.prototype.checkbox = function (value) {
        return /* html */`<input type='checkbox' class='checkbox' ${(value ? 'checked ' : '')}/>\n`
    }
    editor_table.prototype.textarea = function (value, indent, disable) {
        return /* html */`<textarea spellcheck='false' ${disable ? 'disabled readonly' : ''}>${JSON.stringify(value, null, indent || 0)}</textarea>\n`
    }
    editor_table.prototype.checkboxSet = function (value, keys, prefixStrings) {
        if (value == null) value = [];
        if (!(value instanceof Array)) {
            if (value == 0) value = [];
            else value = [value];
        }
        keys=Array.from(keys)
        prefixStrings=Array.from(prefixStrings)
        for (var index = 0; index < value.length; index++) {
            if (keys.indexOf(value[index])==-1) {
                keys.push(value[index])
                prefixStrings.push('<br>'+value[index]+': ')
            }
        }
        var content=[]
        for (var index = 0; index < keys.length; index++) {
            content.push(editor.table.checkboxSetMember(value.indexOf(keys[index])!=-1,keys[index],prefixStrings[index]))
        }
        return /* html */`<div class='checkboxSet'>${content.join('')}</div>\n`;
    }
    editor_table.prototype.checkboxSetMember = function (value,key,prefixString) {
        return /* html */`${prefixString}<input key='${key}' ctype='${typeof key}' type='checkbox' class='checkboxSetMember' onchange='editor.table.checkboxSetMemberOnchange(this)' ${(value ? 'checked ' : '')}/>\n`;
    }
    editor_table.prototype.editGrid = function (showComment, type) {
        var list = [];
        if (showComment) list.push("<button onclick='editor.table.onCommentBtnClick(this)'>注释</button>");
        if (type != 'select' && type != 'checkbox' && type != 'checkboxSet' && type != 'popCheckboxSet' && type != 'disable')
            list.push("<button onclick='editor.table.onEditBtnClick(this)' class='editorTableEditBtn'>编辑</button>");
        if (type == 'popCheckboxSet')
        list.push("<button onclick='editor.table.onEditBtnClick(this)' class='editorTableEditBtn'>多选框编辑</button>");
        if (type == 'disable') list.push("<button onclick='editor.table.onCopyBtnClick(this)'>复制</button>");
        return list.join(' ');
    }

    editor_table.prototype.title = function () {
        return /* html */`\n<tr><td>条目</td><td>注释</td><td>值</td><td>操作</td></tr>\n`
    }

    editor_table.prototype.gap = function (field) {
        var tokenlist = field.slice(2, -2).split("']['");
        var rule = tokenlist.join("-");
        tokenlist.pop();
        var self = tokenlist.join("-");
        var status = !!tokenPool[rule];
        return /* html */`<tr data-gap="${rule}" data-field="${self}">
            <td>----</td>
            <td>----</td>
            <td>${field}</td>
            <td><button class='editorTableFoldBtn' onclick='editor.table.onFoldBtnClick(this)' data-fold="${ status ? "true" : "false" }">${ status ? "展开" : "折叠" }</button></td>
        </tr>\n`
    }

    editor_table.prototype.tr = function (guid, field, shortField, commentHTMLescape, cobjstr, shortComment, tdstr, type) {
        return /* html */`<tr id="${guid}" data-field="${field.slice(2, -2).split("']['").join("-")}">
        <td title="${field}">${shortField}</td>
        <td title="${commentHTMLescape}" cobj="${cobjstr}">${shortComment || commentHTMLescape}</td>
        <td><div class="etableInputDiv ${type}">${tdstr}</div></td>
        <td>${editor.table.editGrid(shortComment, type)}</td>
        </tr>\n`
    }


    /**
     * checkboxset中checkbox的onchange
     * 这个函数本质是模板editor_table.prototype.checkboxSetMember的一部分
     * 故放在HTML模板分类下
     */
    editor_table.prototype.checkboxSetMemberOnchange = function (onemember) {
        var thisset=onemember.parentNode
        var inputs=thisset.children
        var value=[]
        for (var i in inputs) {
            if (inputs[i].nodeName == 'INPUT') {
                if (inputs[i].checked) {
                    var one = inputs[i].getAttribute('key');
                    if (inputs[i].getAttribute('ctype') == 'number') one = parseFloat(one);
                    value.push(one);
                }
            }
        }
        thiseval = value;
        // if (value.length == 0) thiseval = null;
        thisset.value=JSON.stringify(thiseval)
        thisset.onchange()
    }


    /////////////////////////////////////////////////////////////////////////////
    // 表格生成的控制

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
    editor_table.prototype.objToTable = function (obj, commentObj) {
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
                        // alert('comment和data不匹配,请在群 HTML5造塔技术交流群 959329661 内反馈')
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
                pvobj[ii] = vobj = args.vobj;
                // 标记为_hide的属性不展示
                if (cobj._hide) continue;
                if (!cobj._leaf) {
                    // 不是叶节点时, 插入展开的标记并继续遍历, 此处可以改成按钮用来添加新项或折叠等
                    outstr.push(editor.table.gap(field));
                    recursionParse(field, cfield, vobj, cobj);
                } else {
                    // 是叶节点时, 调objToTr_渲染<tr>
                    var leafnode = editor.table.objToTr(obj, commentObj, field, cfield, vobj, cobj);
                    outstr.push(leafnode[0]);
                    guids.push(leafnode[1]);
                }
            }
        }
        // 开始遍历
        recursionParse("", "", obj, commentObj);

        var listen = function (guids) {
            // 每个叶节点的事件绑定
            var tableid = editor.util.guid();
            editor.mode.currentTable=tableid;
            guids.forEach(function (guid) {
                editor.table.guidListen(guid, tableid, obj, commentObj)
            });
        }
        return { "HTML": outstr.join(''), "guids": guids, "listen": listen };
    }

    /**
     * 返回叶节点<tr>形如
     * tr>td[title=field]
     *   >td[title=comment,cobj=cobj:json]
     *   >td>div>input[value=thiseval]
     * 参数意义在 objToTable 中已解释
     * @param {Object} obj 
     * @param {Object} commentObj 
     * @param {String} field 
     * @param {String} cfield 
     * @param {Object} vobj 
     * @param {Object} cobj 
     */
    editor_table.prototype.objToTr = function (obj, commentObj, field, cfield, vobj, cobj) {
        var guid = editor.util.guid();
        var thiseval = vobj;
        var comment = String(cobj._data);

        // var charlength = 15;
        // "['a']['b']" => "b"
        var shortField = field.split("']").slice(-2)[0].split("['").slice(-1)[0];
        // 把长度超过 charlength 的字符改成 固定长度+...的形式
        // shortField = (shortField.length < charlength ? shortField : shortField.slice(0, charlength) + '...');

        // 完整的内容转义后供悬停查看
        var commentHTMLescape = editor.util.HTMLescape(comment);
        // 把长度超过 charlength 的字符改成 固定长度+...的形式
        // var shortCommentHTMLescape = (comment.length < charlength ? commentHTMLescape : editor.util.HTMLescape(comment.slice(0, charlength)) + '...');

        var cobjstr = Object.assign({}, cobj);
        delete cobjstr._data;
        // 把cobj塞到第二个td的[cobj]中, 方便绑定事件时取
        cobjstr = editor.util.HTMLescape(JSON.stringify(cobjstr));

        var tdstr = editor.table.objToTd(obj, commentObj, field, cfield, vobj, cobj)
        var outstr = editor.table.tr(guid, field, shortField, commentHTMLescape, cobjstr, cobj._docs, tdstr, cobj._type)
        return [outstr, guid];
    }

    editor_table.prototype.objToTd = function (obj, commentObj, field, cfield, vobj, cobj) {
        var thiseval = vobj;
        switch (cobj._type) {
            case 'select':
                return editor.table.select(thiseval, cobj._select.values);
            case 'checkbox':
                return editor.table.checkbox(thiseval);
            case 'checkboxSet':
                return editor.table.checkboxSet(thiseval, cobj._checkboxSet.key, cobj._checkboxSet.prefix);
            default: 
                return editor.table.textarea(thiseval, cobj.indent || 0, cobj._type == 'disable');
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // 表格的用户交互

    /**
     * 检查一个值是否允许被设置为当前输入
     * @param {Object} cobj 
     * @param {*} thiseval 
     */
    editor_table.prototype.checkRange = function (cobj, thiseval) {
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

    /**
     * 监听一个guid对应的表格项
     * @param {String} guid 
     */
    editor_table.prototype.guidListen = function (guid, tableid, obj, commentObj) {
        // tr>td[title=field]
        //   >td[title=comment,cobj=cobj:json]
        //   >td>div>input[value=thiseval]
        var thisTr = document.getElementById(guid);
        var input = thisTr.children[2].children[0].children[0];
        var field = thisTr.children[0].getAttribute('title');
        var cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
        var modeNode = thisTr.parentNode;
        thisTr.setAttribute('tableid',tableid)
        while (!editor_mode._ids.hasOwnProperty(modeNode.getAttribute('id'))) {
            modeNode = modeNode.parentNode;
        }
        input.onchange = function () {
            editor.table.onchange(guid, obj, commentObj, thisTr, input, field, cobj, modeNode)
        }
        // 用检测两次单击的方式来实现双击(以支持手机端的双击)
        var doubleClickCheck = [0];
        thisTr.onclick = function () {
            var newClick = new Date().getTime();
            var lastClick = doubleClickCheck.shift();
            doubleClickCheck.push(newClick);
            if (newClick - lastClick < 500) {
                editor.table.dblclickfunc(guid, obj, commentObj, thisTr, input, field, cobj, modeNode)
            }
        }
    }

    /**
     * 表格的值变化时
     */
    editor_table.prototype.onchange = function (guid, obj, commentObj, thisTr, input, field, cobj, modeNode) {
        editor_mode.onmode(editor_mode._ids[modeNode.getAttribute('id')]);
        if (editor.mode.currentTable!=thisTr.getAttribute('tableid')) return;
        var thiseval = null;
        if (input.checked != null) input.value = input.checked;
        try {
            if (input.value == '') input.value = 'null';
            thiseval = JSON.parse(input.value);
        } catch (ee) {
            printe(field + ' : ' + ee);
            throw ee;
        }
        if (editor.table.checkRange(cobj, thiseval)) {
            editor_mode.addAction(['change', field, thiseval]);
            editor_mode.onmode('save');//自动保存 删掉此行的话点保存按钮才会保存
        } else {
            printe(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
        }
    }

    var tokenPool = {};
    var tokenstyle = document.createElement("style");
    document.body.appendChild(tokenstyle);

    var tokenPoolRender = function() {
        var content = "";
        Object.keys(tokenPool).forEach(function(k) {
            content += /* CSS */`[data-field|=${k}]{ display: none }`;
        })
        tokenstyle.innerHTML = content;
    }

    /**
     * 当"折叠"被按下时
     */
    editor_table.prototype.onFoldBtnClick = function (button) {
        var tr = button.parentNode.parentNode;
        if (button.dataset.fold == "true") {
            delete tokenPool[tr.dataset.gap];
            tokenPoolRender();
            button.dataset.fold = "false";
            button.innerText = "折叠";
        } else {
            tokenPool[tr.dataset.gap] = true;
            tokenPoolRender();
            button.dataset.fold = "true";
            button.innerText = "展开";
        }
    }

    /**
     * 当"显示完整注释"被按下时
     */
    editor_table.prototype.onCommentBtnClick = function (button) {
        var tr = button.parentNode.parentNode;
        printf(tr.children[1].getAttribute('title'));
    }

    /**
     * 当"编辑表格内容"被按下时
     */
    editor_table.prototype.onEditBtnClick = function (button) {
        var tr = button.parentNode.parentNode;
        var guid = tr.getAttribute('id');
        var cobj = JSON.parse(tr.children[1].getAttribute('cobj'));
        var input = tr.children[2].children[0].children[0];
        if (cobj._type === 'event') editor_blockly.import(guid, { type: cobj._event });
        if (cobj._type === 'textarea') editor_multi.import(guid, { lint: cobj._lint, string: cobj._string, template: cobj._template, preview: cobj._preview });
        if (cobj._type === 'material') editor.table.selectMaterial(input, cobj);
        if (cobj._type === 'color') editor.table.selectColor(input);
        if (cobj._type === 'point') editor.table.selectPoint(input);
        if (cobj._type === 'popCheckboxSet') editor.table.popCheckboxSet(input, cobj);
    }

    editor_table.prototype.onCopyBtnClick = function (button) {
        var tr = button.parentNode.parentNode;
        var input = tr.children[2].children[0].children[0];
        var value = JSON.parse(input.value);
        if (value == null) {
            printe('没有赋值的内容');
            return;
        }
        if (core.copy(value.toString())) {
            printf('复制成功！');
        } else {
            printe('无法复制此内容，请手动选择复制');
        }
    }

    /**
     * 双击表格时
     *     正常编辑: 尝试用事件编辑器或多行文本编辑器打开
     *     添加: 在该项的同一级创建一个内容为null新的项, 刷新后生效并可以继续编辑
     *     删除: 删除该项, 刷新后生效
     * 在点击按钮 添加/删除 后,下一次双击将被视为 添加/删除
     */
    editor_table.prototype.dblclickfunc = function (guid, obj, commentObj, thisTr, input, field, cobj, modeNode) {
        if (editor_mode.doubleClickMode === 'change') {
            if (cobj._type === 'event') editor_blockly.import(guid, { type: cobj._event });
            if (cobj._type === 'textarea') editor_multi.import(guid, { lint: cobj._lint, string: cobj._string, template: cobj._template, preview: cobj._preview });
            if (cobj._type === 'material') editor.table.selectMaterial(input, cobj);
            if (cobj._type === 'color') editor.table.selectColor(input);
            if (cobj._type === 'point') editor.table.selectPoint(input);
            if (cobj._type === 'popCheckboxSet') editor.table.popCheckboxSet(input, cobj);
        } else if (editor_mode.doubleClickMode === 'add') {
            editor_mode.doubleClickMode = 'change';
            editor.table.addfunc(guid, obj, commentObj, thisTr, input, field, cobj, modeNode)
        } else if (editor_mode.doubleClickMode === 'delete') {
            editor_mode.doubleClickMode = 'change';
            editor.table.deletefunc(guid, obj, commentObj, thisTr, input, field, cobj, modeNode)
        }
    }

    editor_table.prototype.selectMaterial = function (input, cobj) {
        editor.uievent.selectMaterial(input.value, cobj._docs || cobj._data || '请选择素材', cobj._directory, function (one) {
            if (!/^[-A-Za-z0-9_.]+$/.test(one)) return null;
            if (cobj._transform) return eval("("+cobj._transform+")(one)");
            return one;
        }, function (data) {
            input.value = JSON.stringify(cobj._onconfirm ? eval("("+cobj._onconfirm+")(JSON.parse(input.value), data)") : data);
            input.onchange();
        })
    }

    editor_table.prototype.selectColor = function (input) {
        if (input.value != null) {
            var str = input.value.toString().replace(/[^\d.,]/g, '');
            if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(str)) {            
                document.getElementById('colorPicker').value = str;
            }
        }
        var boundingBox = input.getBoundingClientRect();
        openColorPicker(boundingBox.x, boundingBox.y + boundingBox.height, function (value) {
            value = value.replace(/[^\d.,]/g, '');
            input.value = '[' + value +']';
            input.onchange();
        })
    }

    editor_table.prototype.selectPoint = function (input) {
        var x = 0, y = 0, value = input.value;
        if (value != null) {
            try {
                var loc = JSON.parse(value);
                if (loc instanceof Array && loc.length == 2) {
                    x = loc[0];
                    y = loc[1];
                }
            } catch (e) {}
        }
        editor.uievent.selectPoint(editor.currentFloorId, x, y, false, function (floorId, x, y) {
            input.value = '['+x+','+y+']';
            input.onchange();
        })
    }

    editor_table.prototype.popCheckboxSet = function (input, cobj) {
        editor.uievent.popCheckboxSet(JSON.parse(input.value), cobj._checkboxSet, cobj._docs || cobj._data || '请选择多选项', function (value) {
            input.value = JSON.stringify(value);
            input.onchange();
        })
    }

    /**
     * 删除表格项
     */
    editor_table.prototype.deletefunc = function (guid, obj, commentObj, thisTr, input, field, cobj, modeNode) {
        editor_mode.onmode(editor_mode._ids[modeNode.getAttribute('id')]);
        if (editor.table.checkRange(cobj, null)) {
            editor_mode.addAction(['delete', field, undefined]);
            editor_mode.onmode('save', function () {
                printf('删除成功，刷新后生效。')
            });
        } else {
            printe(field + ' : 该值不允许为null，无法删除');
        }
    }

    /**
     * 添加表格项
     */
    editor_table.prototype.addfunc = function (guid, obj, commentObj, thisTr, input, field, cobj, modeNode) {
        if (modeNode) {
            editor_mode.onmode(editor_mode._ids[modeNode.getAttribute('id')]);
        }

        var mode = editor.dom.editModeSelect.value;
        var supportText = mode === 'commonevent' || mode === 'plugins';

        if (obj == null) {
            if (mode === 'commonevent') obj = events_c12a15a8_c380_4b28_8144_256cba95f760;
            else if (mode === 'plugins') obj = plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1;
            else return;
        }

        // 1.输入id
        var newid = '2';
        if (mode == 'loc') {
            var ae = editor.currentFloorData.autoEvent[editor_mode.pos.x + ',' + editor_mode.pos.y];
            if (ae != null) {
                var testid;
                for (testid = 2; Object.hasOwnProperty.call(ae, testid); testid++); // 从3开始是因为comment中设置了始终显示012
                newid = testid + '';
            }
        } else {
            newid = prompt(supportText ? '请输入新项的ID（支持中文）' : '请输入新项的ID（数字字母下划线）');
            if (newid == null || newid.length == 0) {
                return;
            }
        }

        // 2.检查id是否符合规范或与已有id重复
        if (!supportText) {
            if (!/^[a-zA-Z0-9_]+$/.test(newid)) {
                printe('id不符合规范, 请使用大小写字母数字下划线来构成');
                return;
            }
        }

        var conflict = true;
        var basefield = (field || "").replace(/\[[^\[]*\]$/, '');
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
        editor_mode.onmode('save', function () {
            printf('添加成功，刷新后生效；也可以继续新增其他项目。')
        });//自动保存 删掉此行的话点保存按钮才会保存
    }

    /////////////////////////////////////////////////////////////////////////////
    editor.constructor.prototype.table = new editor_table();
}
//editor_table_wrapper(editor);