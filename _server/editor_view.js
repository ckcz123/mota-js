"use strict";
/**
 * editor_view.js 控制编辑器主体外观显示
 */

var editor_view_wrapper = function(editor) {

// 顶部导航栏
class topBar {

    constructor() {
        let navContainer = document.getElementById("navlist");
        this.nav = navContainer.getElementsByTagName("li");
        this.panels = document.getElementsByClassName("mainPanel");
        this.projectName = document.getElementById("projectName");
        this.projectName.innerText = editor.core.data.firstData.title;

        for (let i = 0; i < this.nav.length-1; i++) {
            this.nav[i].addEventListener("click", this.switchMainPanel.bind(this, i));
        }
    
        this.chosen = null;
        this.switchMainPanel(0);
    }
    
    switchMainPanel(id) {
        if (id != this.chosen) {
            this.chose(id);
            if (this.chosen != null) {
                this.unchose(this.chosen);
            }
            this.panels[id].classList.add("chosen");
            this.chosen = id;
        }
    }
    
    chose(id) {
        this.nav[id].classList.add("chosen");
        this.panels[id].classList.add("chosen");
    }
    
    unchose(id) {
        this.nav[id].classList.remove("chosen");
        this.panels[id].classList.remove("chosen");
    }
}


// 右键菜单控件
function contextMenu(obj, items) {
    this.initialize.apply(this, arguments);
}

contextMenu.prototype.current = null;
/**
 * 菜单内容 格式为[{"text": 显示的项目名, "action": 点击时进行的操作}], 若为{}则增加分割线
 * @param items
 */
contextMenu.prototype.initialize = function(obj, items) {
    this.menuBase = document.createElement("div");
    this.menuBase.setAttribute("class", "menu");
    var menuFrame = document.createElement("ul");
    for (var m in items) {
        var item = items[m];
        var menuItem = document.createElement("li");
        if (item == {}) {
            var hr = document.createElement("hr");
            menuItem.appendChild(hr);
        } else {
            menuItem.text = items.text;
            menuItem.addEventListener("click", items.action);
        }
        menuFrame.appendChild(menuItem);
    }

    document.body.appendChild(this.menuBase);
    obj.oncontextmenu = this.oncontext;
}

contextMenu.prototype.oncontext = function(e) {
    e.preventDefault();
    contextMenu.prototype.open.bind(this, e);
}

contextMenu.prototype.open = function(e) {
    console.log(e);
    if (contextMenu.prototype.current != null) {
        this.close.bind(contextMenu.prototype.current);
    }
    contextMenu.prototype.current = this;
    this.menuBase.style.display = "block";
    this.menuBase.style.left = e.clientX;
    this.menuBase.style.height = e.target.clientY;
}

// 关闭当前的
contextMenu.prototype.close = function() {
    contextMenu.prototype.current = null;
    this.menuBase.style.display = "none";
}

class infoBar {
    // 左侧信息栏为系统信息，右侧信息栏为面板/编辑器级信息
    constructor() {
        this.body = document.getElementById("infoBar");
        this.left = document.getElementById("infoLeft");
        this.tip = new infoBlock;
        this.left.append(this.tip.elm);
    
        let rights = document.getElementsByClassName("infoRight");
        this.rights = {
            'system': rights[2],
            'panel': rights[1],
            'editor': rights[0],
        }
    }
    
    showTip(tip, warn) {
        if (tip) this.tip.setContent(tip);
        this.setWarning(warn);
    }
    
    applyBlock(level, property) {
        var block = new infoBlock(property);
        this.rights[level].appendChild(block.elm);
        return block;
    }
    
    warning() {
        if (code == 'warn') {
            this.body.classList.add("warning");
        }
        this.body.classList.remove("warning");
    }

}

class infoBlock {
    constructor(property) {
        this.elm = document.createElement("li");
        this.elm.style.display = 'none';
        this.span = document.createElement("span");
        this.elm.appendChild(this.span);
        if (!property) return;
        if (property.HTML) {
            this.elm.innerHTML += property.HTML;
        }
    }

    show() {
        this.elm.style.display = 'block';
    }

    hide() {
        this.elm.style.display = 'none';
    }

    setContent(content) {
        this.span.textContent = content;
    }
}

editor.topBar = new topBar();
editor.infoBar = new infoBar();
}