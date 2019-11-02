"use strict";

/**
 * view_pluginpanel.js 插件管理界面
 */

var view_pluginpanel_wrapper = function(editor) {
    
class pluginPanel {

    constructor() {
        this.lib = document.getElementById('pluginLib');
        this.list = document.getElementById('pluginList');
        this.lib.addEventListener("click", this.proxyClick.bind(this));

        this.buffer = {};
        this.loadLib();
    }

    proxyClick(e) {
        for (let i = 0; i < e.path.length; i++) {
            if (e.path[i] instanceof HTMLLIElement) {
                this.chose(e.path[i]);
                this.showPlugin(e.path[i]._info);
                return;
            }
        }
    }

    chose(li) {
        if (this.chosen) {
            this.chosen.classList.remove("chosen");
        }
        li.classList.add("chosen");
        this.chosen = li;
    }

    showPlugin(e) {
        console.log(e);
    }

    loadLib() {
        try {
            var xhr = new XMLHttpRequest(), _this = this;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200){
                    _this.libList = JSON.parse(xhr.responseText);
                    for (let i = 0; i < _this.libList.num; i++) {
                        _this.appendLib(_this.libList.data[i]);
                    }
                }
            };  
            xhr.open("POST", "https://h5mota.com/plugins/getList.php", false);
            xhr.send();
        } catch (e) {
            main.log(e);
        }
    }

    appendLib(info) {
        var li = document.createElement("li");
        li.innerHTML = `<h5>${info.name}</h5>
            <p>${info.abstract}</p>
            <span>${info.author}</span>`;
        li._info = info;
        this.lib.append(li);
    }

    showDetail() {

    }

}

editor.pluginPanel = new pluginPanel();
}