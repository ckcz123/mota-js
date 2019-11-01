"use strict";
/**
 * editor_view.js 控制编辑器主体外观显示
 */

var editor_view_wrapper = function(editor) {

// 顶部导航栏
class navBar {

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
 * @param items 菜单内容 格式为[{"text": 显示的项目名, "action": 点击时进行的操作}], 若为{}则增加分割线
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



// var $tips = [
//     '表格的文本域可以双击进行编辑',
//     '双击地图可以选中素材，右键可以弹出菜单',
//     '双击事件编辑器的图块可以进行长文本编辑/脚本编辑/地图选点/UI绘制预览等操作',
//     'ESC或点击空白处可以自动保存当前修改',
//     'H键可以打开操作帮助哦',
//     'tileset贴图模式下可以按选中tileset素材，并在地图上拖动来一次绘制一个区域',
//     '可以拖动地图上的图块和事件，或按Ctrl+C, Ctrl+X和Ctrl+V进行复制，剪切和粘贴，Delete删除'
// ];

// tip.hasId= true
// tip.isAutotile= false
// tip._isSelectedBlock= false
// tip.isSelectedBlock=function(value){
//     if(value!=null){
//         var dshow=document.getElementById('isSelectedBlock-if')
//         var dhide=document.getElementById('isSelectedBlock-else')
//         if(!value) {
//             var dtemp=dshow
//             dshow=dhide
//             dhide=dtemp
//         }
//         dshow.style.display=''
//         dhide.style.display='none'
//         tip._isSelectedBlock=value
//     }
//     return tip._isSelectedBlock
// }
// tip._isClearBlock= false
// tip.isClearBlock=function(value){
//     if(value!=null){
//         var dshow=document.getElementById('isClearBlock-if')
//         var dhide=document.getElementById('isClearBlock-else')
//         if(!value){
//             var dtemp=dshow
//             dshow=dhide
//             dhide=dtemp
//         }
//         dshow.style.display=''
//         dhide.style.display='none'
//         tip._isClearBlock=value
//     }
//     return tip._isClearBlock
// }
// tip._isAirwall= false
// tip.isAirwall=function(value) {
//     if(value!=null){
//         var dshow=document.getElementById('isAirwall-if')
//         var dhide=document.getElementById('isAirwall-else')
//         if(!value){
//             var dtemp=dshow
//             dshow=dhide
//             dhide=dtemp
//         }
//         dshow.style.display=''
//         dhide.style.display='none'
//         tip._isAirwall=value
//     }
//     return tip._isAirwall
// }
// tip.geneMapSuccess= false
// tip.timer= null
// tip.msgs= [ //分别编号1,2,3,4,5,6,7,8,9,10；奇数警告，偶数成功
//     "当前未选择任何图块，请先在右边选择要画的图块!",
//     "生成地图成功！可点击复制按钮复制地图数组到剪切板",
//     "生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！",
//     "地图清除成功!",
//     "复制失败！",
//     "复制成功！可直接粘贴到楼层文件的地图数组中。",
//     "复制失败！当前还没有数据",
//     "修改成功！可点击复制按钮复制地图数组到剪切板",
//     "选择背景图片失败！文件名格式错误或图片不存在！",
//     "更新背景图片成功！",
//     "11:警告",
//     "12:成功"
// ]
// tip._mapMsg= ''
// tip.mapMsg=function(value){
//     if(value!=null){
//         document.getElementById('whichShow-if').innerText=value
//         tip._mapMsg=value
//     }
//     return tip._mapMsg
// }
// tip._whichShow= 0
// tip.whichShow=function(value){
//     if(value!=null){

//         var dshow=document.getElementById('whichShow-if')
//         var dhide=null
//         if(!value){
//             var dtemp=dshow
//             dshow=dhide
//             dhide=dtemp
//         }
//         if(dshow)dshow.style.display=''
//         if(dhide)dhide.style.display='none'

//         if(dshow)dshow.setAttribute('class',(value%2) ? 'warnText' : 'successText')

//         tip.mapMsg('');
//         tip.msgs[4] = "复制失败！" + editTip.err;
//         clearTimeout(tip.timer);
//         if (value) {
//             tip.mapMsg(tip.msgs[value - 1]);
//             tip.timer = setTimeout(function () {
//                 if (!(value % 2))
//                 value = 0;
//             }, 5000); //5秒后自动清除success，warn不清除
//         }
//         tip._whichShow=value
//     }
//     return tip._whichShow
// }
    editor.navBar = new navBar();
    editor.infoBar = new infoBar();
}