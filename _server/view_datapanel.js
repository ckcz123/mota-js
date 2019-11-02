"use strict";
/**
 * view_datapanel.js 数据编辑界面
 */

var view_datapanel_wrapper = function(editor) {

class dataPanel {

    /**
     * 地图编辑面板
     */
    constructor() {
        editor.infoBar.applyBlock("panel");
        var data_obj = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d;
        // 初始化各个表
        this.firstData = new editor.list(
            document.getElementById("firstDataList"),
            editor.file.dataComment._data.firstData,
            function () {
                var locObj = Object.assign({}, data_obj.firstData);
                return locObj;
            },
        );
        this.globalValues = new editor.list(
            document.getElementById("globalValueList"),
            editor.file.dataComment._data.values,
            function () {
                var locObj = Object.assign({}, data_obj.values);
                return locObj;
            },
        );
        this.globalFlags = new editor.list(
            document.getElementById("globalFlagList"),
            editor.file.dataComment._data.flags,
            function () {
                var locObj = Object.assign({}, data_obj.flags);
                return locObj;
            },
        );
        this.firstData.update();
        this.globalValues.update();
        this.globalFlags.update();
    }
}

editor.dataPanel = new dataPanel();
}