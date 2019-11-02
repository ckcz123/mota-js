"use strict";

var editor_list_wrapper = function (editor) {

editor.constructor.prototype.list = class editor_list {

    data = null;

    constructor(elm, commentObj, getData) {
        this.body = elm;
        this.commentObj = commentObj;
        this.getData = getData;
        this.body.addEventListener("change", this.proxyChangeListener.bind(this));
        this.body.addEventListener("click", this.proxyClickListener.bind(this));
    }

    /////////////////////////////////////////////////////////////////////////////
    // HTML模板

    select(value, values) {
        var _this = this;
        let content = this.option(value) +
            values.map(function (v) {
                return _this.option(v)
            }).join('')
        return /* html */`<select>\n${content}</select>\n`
    }

    option(value) {
        return /* html */`<option value='${JSON.stringify(value)}'>${JSON.stringify(value)}</option>\n`
    }

    text(value) {
        return /* html */`<input type='text' spellcheck='false' value='${JSON.stringify(value)}'/>\n`
    }

    em(value) {
        return /* html */`<em>${JSON.stringify(value)}</em>\n`
    }

    checkbox(value) {
        return /* html */`<input type="checkbox" ${(value ? 'checked' : '')}>
        <div class="switch ${(value ? 'on' : '')}">
            <em>${(value ? 'T' : 'F')}</em>
            <i></i>
        </div>\n`;
    }

    scriptEntry(field) {
        let shortField = field.split("']").slice(-2)[0].split("['").slice(-1)[0];
        return /* html */`<img class="icon-f" src="_server/icon/javascript.svg"></img>
        <span 
            class="scriptEntry"
            data-field="${field}"
            >${shortField}
        </span>\n`
    }

    textarea(value, indent) {
        var content = JSON.stringify(value, null, indent || 0);
        return /* html */`<div class="staticIcon" data-text='${content}'>
        <img class='editEntry' src='_server/icon/${editor.util.isset(value)?'edit':'add'}Event.svg'/>
        </div>\n`
    }

    gap(shortfield, depth) {
        // 初始默认展开
        return /* html */`<li 
            depth=${depth}
            data-type="gap">
            <i class="codicon codicon-chevron-down"></i>
            <span>${shortfield}</span>
        </li>\n`
    }

    li(field, shortField, commentHTMLescape, typestr, cobjstr, controlstr, name, depth) {
        return /* html */`<li 
            depth=${depth}
            data-type="${typestr}">
            <span
                class="comment"
                title="${commentHTMLescape}\n[${shortField}]"
                data-field="${field}"
                cobj="${cobjstr}">
            ${name}</span>
            <div class="elistInputDiv">${controlstr}</div>
        </li>\n`
    }

    // 控件的响应函数

    toggleCheckbox(e) {
        e.classList.toggle("on");
        e.children[0].innerText = e.children[0].innerText == "T" ? "F" : "T";
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, false);
        e.parentNode.children[0].dispatchEvent(evt);
    }

    openCodeEditor(e) {
        editor.multi.import(this.data, e.children[0].dataset.field);
    }
    
    /////////////////////////////////////////////////////////////////////////////
    // 表格生成的控制

    /**
     * 注释对象的默认值
     */
    defaultcobj = {
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
     *     返回列表的HTML
     * @param {Object} obj 
     * @returns {String} HTML
     */
    objToList(obj) {
        var outstr = [];
        var defaultcobj = this.defaultcobj
        /**
         * 深度优先遍历, p*即为父节点的四个属性
         * @param {String} pfield 
         * @param {String} pcfield 
         * @param {Object} pvobj 
         * @param {Object} pcobj 
         */
        var _this = this;
        var recursionParse = function (pfield, pcfield, pvobj, pcobj) {
            var keysForlistOrder = {};
            var voidMark = {};
            // 1. 按照pcobj排序生成
            if (pcobj && pcobj['_data']) {
                for (var ii in pcobj['_data']) keysForlistOrder[ii] = voidMark;
            }
            // 2. 对每个pvobj且不在pcobj的，再添加到最后
            keysForlistOrder = Object.assign(keysForlistOrder, pvobj)
            for (var ii in keysForlistOrder) {
                // 3. 对于pcobj有但是pvobj中没有的, 弹出提示, (正常情况下editor_file会补全成null)
                //    事实上能执行到这一步工程没崩掉打不开,就继续吧..
                if (keysForlistOrder[ii] === voidMark) {
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
                for (let key in cobj) {
                    if (key === '_data') continue;
                    if (cobj[key] instanceof Function) cobj[key] = cobj[key](args);
                }
                // 标记为_hide的属性不展示
                if (cobj._hide) continue;
                let node = _this.objToLi(obj, _this.commentObj, field, cfield, vobj, cobj);
                outstr.push(node);
                // 不是叶节点时, 插入展开的标记并继续遍历
                if (!cobj._leaf) {
                    recursionParse(field, cfield, vobj, cobj);
                }
            }
        }
        // 开始遍历
        recursionParse("", "", obj, _this.commentObj);
        return outstr.join('');
    }

    /**
     * 返回叶节点<li>形如
     * li>span[title=comment,cobj=cobj:json]
     *   >div>input[value=thiseval]
     * 参数意义在 objTolist 中已解释
     * @param {Object} obj 
     * @param {Object} commentObj 
     * @param {String} field 
     * @param {String} cfield 
     * @param {Object} vobj 
     * @param {Object} cobj 
     */
    objToLi(obj, commentObj, field, cfield, vobj, cobj) {
        let comment = String(cobj._data);

        // "['a']['b']" => "b"
        let fields = field.split("']");
        let depth = fields.length-1;
        let shortField = fields.slice(-2)[0].split("['").slice(-1)[0];
        // 完整的内容转义后供悬停查看
        let commentHTMLescape = editor.util.HTMLescape(comment);
        let typestr = cobj._type;
        let cobjstr = Object.assign({}, cobj);
        delete cobjstr._data;
        delete cobjstr._type;
        // 把cobj塞到span的[cobj]中, 方便绑定事件时取
        cobjstr = editor.util.HTMLescape(JSON.stringify(cobjstr));

        let name = cobj["_name"];
        if (!cobj._leaf) return this.gap(shortField, depth);
        let controlstr = this.objToControl(obj, commentObj, field, cfield, vobj, cobj);
        let outstr = this.li(field, shortField, commentHTMLescape, typestr, cobjstr, controlstr, name, depth);
        return outstr;
    }

    objToControl(obj, commentObj, field, cfield, vobj, cobj) {
        var thiseval = vobj;
        console.log(field);
        switch(cobj._type) {
            case "select": {
                var values = cobj._select.values;
                return this.select(thiseval, values);
            }
            case "em": { // 不能编辑的项
                return this.em(thiseval);
            }
            case "text": {
                return this.text(thiseval);
            }
            case "number": {
                return this.text(thiseval);
            }
            case "checkbox": {
                return this.checkbox(thiseval);
            }
            case "script": { // 脚本编辑面板
                return this.scriptEntry(field);
            }
            default: {
                var indent = 0;
                return this.textarea(thiseval, indent);
            }
        }
    }

    update(callback) {
        console.log(this);
        this.data = this.getData();
        this.body.innerHTML = this.objToList(this.data);
        if (Boolean(callback)) callback();
    }

    /////////////////////////////////////////////////////////////////////////////
    // 列表的用户交互

    /**
     * 检查一个值是否允许被设置为当前输入
     * @param {Object} cobj 
     * @param {*} thiseval 
     */
    checkRange(cobj, thiseval) {
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
     * 编辑事件代理
     * @param {Object} e 
     */
    proxyChangeListener(e) {
        console.log(e);
        // tr>td[title=field]
        //   >td[title=comment,cobj=cobj:json]
        //   >td>div>input[value=thiseval]
        for (let i = 0; i < e.path.length; i++) {
            if (e.path[i] instanceof HTMLLIElement) {
                var field = e.path[i].children[0].getAttribute('field');
                var cobj = JSON.parse(e.path[i].children[0].getAttribute('cobj'));
                this.onchange(e.tagert, e.path[i], field, cobj);
                return;
            }
        }
    }

    /**
     * 表格的值变化时
     */
    onchange(input, thisLi, field, cobj) {
        var thiseval = null;
        if (input.checked != null) input.value = input.checked;
        try {
            thiseval = JSON.parse(input.value);
        } catch (ee) {
            printe(field + ' : ' + ee);
            throw ee;
        }
        if (this.checkRange(cobj, thiseval)) {
            // editor_mode.addAction(['change', field, thiseval]);
            // editor_mode.onmode('save');//自动保存 删掉此行的话点保存按钮才会保存
        } else {
            printe(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
        }
    }

    doubleClickCheck = [[null, 0]];
    /**
     * 点击事件代理
     * @param {Object} e 点击事件
     */
    proxyClickListener(e) {
        for (let i = 0; i < e.path.length; i++) {
            if (e.path[i].classList.contains("switch")) {
                this.toggleCheckbox(e.path[i]);
            }
            if (e.path[i].dataset.type == "script") {
                this.openCodeEditor(e.path[i]);
            }
            if (e.path[i].tagName == "LI") {
                let newClick = [e.path[i], new Date().getTime()];
                let lastClick = this.doubleClickCheck.shift();
                this.doubleClickCheck.push(newClick);
                if (newClick[0] == lastClick[0] && newClick[1] - lastClick[1] < 500) {
                    var field = e.path[i].children[0].getAttribute('field');
                    var cobj = JSON.parse(e.path[i].children[0].getAttribute('cobj'));
                    //this.dblclickfunc(obj, commentObj, thisLi, input, field, cobj)
                }
                return;
            }
        }
    }

    /**
     * 双击表格时
     *     正常编辑: 尝试用事件编辑器或多行文本编辑器打开
     *     添加: 在该项的同一级创建一个内容为null新的项, 刷新后生效并可以继续编辑
     *     删除: 删除该项, 刷新后生效
     * 在点击按钮 添加/删除 后,下一次双击将被视为 添加/删除
     */
    dblclickfunc(obj, commentObj, thisTr, input, field, cobj) {
        if (editor_mode.doubleClickMode === 'change') {
            // if (cobj._type === 'event') editor_blockly.import(obj, { type: cobj._event });
            // if (cobj._type === 'textarea') editor_multi.import(obj, { lint: cobj._lint, string: cobj._string });
        } else if (editor_mode.doubleClickMode === 'add') {
            editor_mode.doubleClickMode = 'change';
            this.addfunc(obj, commentObj, thisTr, input, field, cobj)
        } else if (editor_mode.doubleClickMode === 'delete') {
            editor_mode.doubleClickMode = 'change';
            this.deletefunc(obj, commentObj, thisTr, input, field, cobj)
        }
    }

    /**
     * 删除表格项
     */
    deletefunc(obj, commentObj, thisTr, input, field, cobj) {
        if (this.checkRange(cobj, null)) {
            editor_mode.addAction(['delete', field, undefined]);
            editor_mode.onmode('save');//自动保存 删掉此行的话点保存按钮才会保存
        } else {
            printe(field + ' : 该值不允许为null，无法删除');
        }
    }

    /**
     * 添加表格项
     */
    addfunc(guid, obj, commentObj, thisTr, input, field, cobj) {

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

}
//editor_list_wrapper(editor);