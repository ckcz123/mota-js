editor_listen_wrapper = function (editor) {

    editor.constructor.prototype.listen = function () {

        editor.dom.body.onmousedown = editor.uifunctions.body_click;

        editor.dom.eui.oncontextmenu = function (e) { e.preventDefault() } // 自定义了右键菜单, 阻止默认行为
        editor.dom.midMenu.oncontextmenu = function (e) { e.preventDefault() }

        editor.dom.eui.ondblclick = editor.uifunctions.map_doubleClick

        editor.dom.eui.onmousedown = editor.uifunctions.map_ondown
        editor.dom.eui.onmousemove = editor.uifunctions.map_onmove
        editor.dom.eui.onmouseup = editor.uifunctions.map_onup

        editor.dom.mid.onmousewheel = editor.uifunctions.map_mousewheel

        editor.uivalues.shortcut = core.getLocalStorage('shortcut', { 48: 0, 49: 0, 50: 0, 51: 0, 52: 0, 53: 0, 54: 0, 55: 0, 56: 0, 57: 0 });
        editor.dom.body.onkeydown = editor.uifunctions.body_shortcut

        editor.uivalues.scrollBarHeight = editor.uifunctions.getScrollBarHeight();
        editor.dom.iconExpandBtn.style.display = 'block';
        editor.dom.iconExpandBtn.innerText = editor.uivalues.folded ? "展开素材区" : "折叠素材区";
        editor.dom.iconExpandBtn.onclick = editor.uifunctions.fold_material_click

        editor.dom.iconLib.onmousedown = editor.uifunctions.material_ondown
        editor.dom.iconLib.oncontextmenu = function (e) { e.preventDefault() }

        editor.dom.extraEvent.onmousedown = editor.uifunctions.extraEvent_click
        editor.dom.chooseThis.onmousedown = editor.uifunctions.chooseThis_click
        editor.dom.chooseInRight.onmousedown = editor.uifunctions.chooseInRight_click
        editor.dom.copyLoc.onmousedown = editor.uifunctions.copyLoc_click
        editor.dom.moveLoc.onmousedown = editor.uifunctions.moveLoc_click
        editor.dom.clearEvent.onmousedown = editor.uifunctions.clearEvent_click
        editor.dom.clearLoc.onmousedown = editor.uifunctions.clearLoc_click

        editor.dom.lastUsed.onmousedown = editor.uifunctions.lastUsed_click;
        editor.dom.lockMode.onchange = editor.uifunctions.lockMode_onchange;

        editor.dom.brushMod.onchange = editor.uifunctions.brushMod_onchange
        if (editor.dom.brushMod2) editor.dom.brushMod2.onchange = editor.uifunctions.brushMod2_onchange;
        if (editor.dom.brushMod3) editor.dom.brushMod3.onchange = editor.uifunctions.brushMod3_onchange;

        editor.dom.layerMod.onchange = editor.uifunctions.layerMod_onchange
        if (editor.dom.layerMod2) editor.dom.layerMod2.onchange = editor.uifunctions.layerMod2_onchange;
        if (editor.dom.layerMod3) editor.dom.layerMod3.onchange = editor.uifunctions.layerMod3_onchange;

        editor.uifunctions.viewportButtons_func()
    }

    editor.constructor.prototype.mobile_listen = function () {
        if (!editor.isMobile) return;

        var mobileview = document.getElementById('mobileview');
        var mid = document.getElementById('mid');
        var right = document.getElementById('right');
        // var mobileeditdata = document.getElementById('mobileeditdata');


        editor.showdataarea = function (callShowMode) {
            mid.style = 'z-index:-1;opacity: 0;';
            right.style = 'z-index:-1;opacity: 0;';
            // mobileeditdata.style = '';
            if (callShowMode) editor.mode.showMode(editor.dom.editModeSelect.value);
            editor.uifunctions.hideMidMenu();
        }
        mobileview.children[0].onclick = function () {
            editor.showdataarea(true)
        }
        mobileview.children[1].onclick = function () {
            mid.style = '';
            right.style = 'z-index:-1;opacity: 0;';
            // mobileeditdata.style = 'z-index:-1;opacity: 0;';
            editor.lastClickId = '';
        }
        mobileview.children[3].onclick = function () {
            mid.style = 'z-index:-1;opacity: 0;';
            right.style = '';
            // mobileeditdata.style = 'z-index:-1;opacity: 0;';
            editor.lastClickId = '';
        }

        /*
        var gettrbyid = function () {
            if (!editor.lastClickId) return false;
            thisTr = document.getElementById(editor.lastClickId);
            input = thisTr.children[2].children[0].children[0];
            field = thisTr.children[0].getAttribute('title');
            cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
            return [thisTr, input, field, cobj];
        }
        mobileeditdata.children[0].onclick = function () {
            var info = gettrbyid()
            if (!info) return;
            info[1].ondblclick()
        }
        mobileeditdata.children[1].onclick = function () {
            var info = gettrbyid()
            if (!info) return;
            printf(info[2])
        }
        mobileeditdata.children[2].onclick = function () {
            var info = gettrbyid()
            if (!info) return;
            printf(info[0].children[1].getAttribute('title'))
        }
        */

        //=====

        document.body.ontouchstart = document.body.onmousedown;
        document.body.onmousedown = null;

        editor.dom.eui.ontouchstart = editor.dom.eui.onmousedown
        editor.dom.eui.onmousedown = null
        editor.dom.eui.ontouchmove = editor.dom.eui.onmousemove
        editor.dom.eui.onmousemove = null
        editor.dom.eui.ontouchend = editor.dom.eui.onmouseup
        editor.dom.eui.onmouseup = null


        editor.dom.chooseThis.ontouchstart = editor.dom.chooseThis.onmousedown
        editor.dom.chooseThis.onmousedown = null
        editor.dom.chooseInRight.ontouchstart = editor.dom.chooseInRight.onmousedown
        editor.dom.chooseInRight.onmousedown = null
        editor.dom.copyLoc.ontouchstart = editor.dom.copyLoc.onmousedown
        editor.dom.copyLoc.onmousedown = null
        editor.dom.moveLoc.ontouchstart = editor.dom.moveLoc.onmousedown
        editor.dom.moveLoc.onmousedown = null
        editor.dom.clearLoc.ontouchstart = editor.dom.clearLoc.onmousedown
        editor.dom.clearLoc.onmousedown = null
    }

    editor.constructor.prototype.mode_listen = function (callback) {

        // 这里的函数还没有写jsdoc, 通过_func()的方式先完成分类

        editor.uifunctions.newIdIdnum_func()
        editor.uifunctions.changeId_func()
        editor.uifunctions.copyPasteEnemyItem_func();

        editor.uifunctions.selectFloor_func()
        editor.uifunctions.saveFloor_func()

        editor.uifunctions.newMap_func()

        editor.uifunctions.createNewMaps_func()

        editor.uifunctions.changeFloorId_func()

        editor.uifunctions.fixCtx_func()

        editor.uifunctions.selectAppend_func()
        editor.uifunctions.selectFileBtn_func()
        editor.uifunctions.changeColorInput_func()
        editor.uifunctions.picClick_func()
        editor.uifunctions.appendConfirm_func()

        editor.dom.editModeSelect.onchange = editor.mode.editModeSelect_onchange

        if (Boolean(callback)) callback();
    }

}