"use strict";
/**
 * view_mapPanel.js 地图编辑界面表现层
 */

var view_mapPanel_wrapper = function(editor) {

class mapPanel {

    /**
     * 地图编辑面板
     */
    constructor() {

        // 初始化面板本身的dom
        this.side = document.getElementById("mapSide");
        this.sideNav = this.side.getElementsByTagName("li");
        for (let i = 0; i < this.sideNav.length; i++) {
            this.sideNav[i].addEventListener("click", this.switchleftPanel.bind(this, i));
        }

        this.left = document.getElementById("mapLeft");
        this.leftPanels = this.left.children;
        this.leftPanel_now = 0;
        this.choseLeft(this.leftPanel_now);
        this.left_collapse = true;

        this.mid = document.getElementById("mapMid");

        this.toggleLeft(false);
        
        this.mapInfo = editor.infoBar.applyBlock('panel');
        this.locInfo = editor.infoBar.applyBlock('panel');
        // 初始化地图数据模块

        // 初始化各个表现层模块
        this.mapExplorer = new mapExplorer();
        this.mapEvent = new editor.list(
            document.getElementById("mapEventList"),
            editor.file.comment._data.floors._data.loc,
            function() {
                return (function () {
                    var locObj = {};
                    Object.keys(editor.file.comment._data.floors._data.loc._data).forEach(function (v) {
                        if (editor.util.isset(editor.map.currentFloorData[v][x + ',' + y]))
                            locObj[v] = editor.map.currentFloorData[v][x + ',' + y];
                        else
                            locObj[v] = null;
                    });
                    return locObj;
                })();
            }
        );
        this.mapProperty = new editor.list(
            document.getElementById("mapPropertyList"),
            editor.file.comment._data.floors._data.floor,
            function() {
                return (function () {
                    var locObj = Object.assign({}, editor.map.currentFloorData);
                    Object.keys(editor.file.comment._data.floors._data.floor._data).forEach(function (v) {
                        if (!editor.util.isset(editor.map.currentFloorData[v]))
                            locObj[v] = null;
                    });
                    Object.keys(editor.file.comment._data.floors._data.loc._data).forEach(function (v) {
                        delete(locObj[v]);
                    });
                    delete(locObj.map);
                    delete(locObj.bgmap);
                    delete(locObj.fgmap);
                    console.log(locObj);
                    return locObj;
                })();
            },
        );
    }

    switchleftPanel(chose) {
        if (chose == this.leftPanel_now) {
            this.toggleLeft();
        }
        else {
            this.choseLeft(chose);
            if (editor.util.isset(this.leftPanel_now)) {
                this.unchoseLeft(this.leftPanel_now);
            }
            this.leftPanel_now = chose;
            this.toggleLeft(false);
        } 
    }

    choseLeft(id) {
        this.sideNav[id].classList.add("chosen");
        this.leftPanels[id].classList.add("chosen");
    }

    unchoseLeft(id) {
        this.sideNav[id].classList.remove("chosen");
        this.leftPanels[id].classList.remove("chosen");
    }

    toggleLeft(code) {
        if (editor.util.isset(code)) {
            if (code == this.left_collapse) return;
            if (code) {
                this.left.classList.add("collapse");
                this.mid.classList.add("expand");
            } else {
                this.left.classList.remove("collapse");
                this.mid.classList.remove("expand");
            }
            this.left_collapse = code;
        } else {
            this.toggleLeft(!this.left_collapse);
        }
    }

    changeMap(mapId) {
        editor.map.changeFloor(mapId);
        this.mapInfo.setContent = editor.map.currentFloorData.title;
        this.mapProperty.update();
    }
}

class mapExplorer {

    constructor() {
        this.body = document.getElementById("mapExplorerUL");
        this.body.addEventListener("click", this.click.bind(this));
        this.sortable = Sortable.create(this.body, {
            animation: 150,
            onEnd: this.dragend.bind(this),
        });
        // this.search = new inputBar(
        //     document.getElementById("mapExplorerUL"), 
        //     this.filter.bind(this), 
        //     true
        // );
        // this.menu = new contextMenu(this.body, {
    
        // });
        this.list = {};
        this.chosen = null;

        this.initList();
    }
    
    filter(keyword) {
        keyword = keyword || "";
        for (var m in this.list) {
            var li = this.list[m];
            var text = this.getText(li._value);
            if (text.indexOf(keyword) != -1) {
                li.innerHTML = this.highlightKeyword(text, keyword);
                this.showLi(li);
            } else {
                this.hideLi(li);
            }
        }
    }
    
    getText(value) {
        return this.data[value];
    }
    
    showLi(li) {
        li.style.display = "block";
    }
    
    hideLi(li) {
        li.style.display = "none";
    }
    
    delete(id) {
        this.list.splice(id, 1);
        this.body.removeChild(this.list[id]);
    }
    
    chose(li) {
        if (editor.util.isset(this.chosen)) {
            this.chosen.classList.remove("chosen");
        }
        li.classList.add("chosen");
        this.chosen = li;
    }
    
    click(e) {
        for (let i = 0; i < e.path.length; i++) {
            if (e.path[i] instanceof HTMLLIElement) {
                this.chose(e.path[i]);
                editor.mapPanel.changeMap(e.path[i]._value);
                return;
            }
        }
    }

    dragend(e) {
        editor.map.setFloorList(e.oldIndex, e.newIndex);
    }
    
    initList() {
        for (let i = 0; i < editor.map.floorIds.length; i++) {
            this.insertFloor(editor.map.floorIds[i]);
        }
        //this.chosen = this.list[core.status.floorId];
        // editor.changeFloor(core.status.floorId);
    }
    
    insertFloor(name, target) {
        var li = document.createElement("li");
        li._value = name;
        li.innerHTML = `<i class="icon-i icon-file"></i>
        <span>${name}</span>`;
        this.list[name] = li;
        if (target) {
            if (target instanceof HTMLLIElement) target.insertBefore(li);
        } else {
            this.body.appendChild(li);
        }
    }
    
    highlightKeyword(text, keyword) {
        return text.replace(keyword,"<span class=\"keyword\">"+keyword+"</span>")
    }

}

class tileEditor {

    constructor() {
        this.paintInfo = infoBar.applyBlock('editor');
        this.airwallImg = new Image();
        this.airwallImg.src = './_server/img/airwall.png';
    }
    
    loc(callback) {
        //editor.pos={x: 0, y: 0};
        if (!editor.util.isset(editor.pos)) return;
        editor.mapPanel.locInfo.setContent(editor.map.pos.x + ',' + editor.map.pos.y);

        editor.mapPanel.mapEvent.update();
        if (Boolean(callback)) callback();
    }
    
    loadMap() {
    
    } 
    
    active() {
        paintInfo.show();
    }
    
    unactive() {
        paintInfo.hide();
    }
    
    updateBlockInfo() {
        if(value!=null) {
            var val=value
            var oldval=tip._infos
    
            tip.isClearBlock(false);
            tip.isAirwall(false);
            if (typeof(val) != 'undefined') {
                if (val == 0) {
                    tip.isClearBlock(true);
                    return;
                }
                if ('id' in val) {
                    if (val.idnum == 17) {
                        tip.isAirwall(true);
                        return;
                    }
                    tip.hasId = true;
                } else {
                    tip.hasId = false;
                }
                tip.isAutotile = false;
                if (val.images == "autotile" && tip.hasId) tip.isAutotile = true;
                document.getElementById('isAirwall-else').innerHTML=(tip.hasId?`<p>图块编号：<span class="infoText">${ value['idnum'] }</span></p>
                <p>图块ID：<span class="infoText">${ value['id'] }</span></p>`:`
                <p class="warnText">该图块无对应的数字或ID存在，请先前往icons.js和maps.js中进行定义！</p>`)+`
                <p>图块所在素材：<span class="infoText">${ value['images'] + (tip.isAutotile ? '( '+value['id']+' )' : '') }</span>
                </p>
                <p>图块索引：<span class="infoText">${ value['y'] }</span></p>`
            }
    
            tip._infos=value
        }
        return tip._infos
    
    }
    
    selectIcon() {
        
    }

}

editor.mapPanel = new mapPanel();
}