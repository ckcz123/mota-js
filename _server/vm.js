// vue 相关处理

document.body.onmousedown = function (e) {
    //console.log(e);
    var eid = [];
    e.path.forEach(function (node) {
        if (!node.getAttribute) return;
        var id_ = node.getAttribute('id');
        if (id_) {
            if (['left', 'left1', 'left2', 'left3', 'left4', 'left5', 'left8'].indexOf(id_) !== -1) eid.push('edit');
            eid.push(id_);
        }
    });
    //console.log(eid);
    if (eid.indexOf('edit') === -1) {
        if (eid.indexOf('tip') === -1) {
            if (selectBox.isSelected) {
                editor_mode.onmode('');
                editor.file.saveFloorFile(function (err) {
                    if (err) {
                        printe(err);
                        throw(err)
                    }
                    ;printf('地图保存成功');
                });
            }
            selectBox.isSelected = false;
        }
    }
    //editor.mode.onmode('');
    editor.info = {};
    if (e.button!=2){
        editor.hideMidMenu();
    }
}
iconLib.onmousedown = function (e) {
    e.stopPropagation();
}
var exportMap = new Vue({
    el: '#exportMap',
    data: {
        isExport: false,
    },
    methods: {
        exportMap: function () {
            editor.updateMap();

            var filestr = '';
            for (var yy = 0; yy < 13; yy++) {
                filestr += '['
                for (var xx = 0; xx < 13; xx++) {
                    var mapxy = editor.map[yy][xx];
                    if (typeof(mapxy) == typeof({})) {
                        if ('idnum' in mapxy) mapxy = mapxy.idnum;
                        else {
                            // mapxy='!!?';
                            tip.whichShow = 3;
                            return;
                        }
                    } else if (typeof(mapxy) == 'undefined') {
                        tip.whichShow = 3;
                        return;
                    }
                    mapxy = String(mapxy);
                    mapxy = Array(Math.max(4 - mapxy.length, 0)).join(' ') + mapxy;
                    filestr += mapxy + (xx == 12 ? '' : ',')
                }

                filestr += ']' + (yy == 12 ? '' : ',\n');
            }
            pout.value = filestr;
            editArea.mapArr = filestr;
            this.isExport = true;
            editArea.error = 0;
            tip.whichShow = 2;
        }
    }
})
var editArea = new Vue({
    el: '#editArea',
    data: {
        mapArr: '',
        errors: [ // 编号1,2,3,4
            "格式错误！请使用正确格式(13*13数组，如不清楚，可先点击生成地图查看正确格式)",
            "当前有未定义ID（在地图区域显示红块），请修改ID或者到icons.js和maps.js中进行定义！",
            "ID越界（在地图区域显示红块），当前编辑器暂时支持编号小于400，请修改编号！",
            // "发生错误！",
        ],
        error: 0,
        formatTimer: null,
    },
    watch: {
        mapArr: function (val, oldval) {
            var that = this;
            if (val == '') return;
            if (exportMap.isExport) {
                exportMap.isExport = false;
                return;
            }
            if (that.formatArr()) {
                that.error = 0;

                setTimeout(function () {
                    that.mapArr = that.formatArr();
                    that.drawMap();
                    tip.whichShow = 8
                }, 1000);
                that.formatTimer = setTimeout(function () {
                    pout.value = that.formatArr();
                }, 5000); //5s后再格式化，不然光标跳到最后很烦
            } else {
                that.error = 1;
            }
        },
        error: function () {
            // console.log(editArea.mapArr);
        }
    },
    methods: {
        drawMap: function () {
            var that = this;

            // var mapArray = that.mapArr.split(/\D+/).join(' ').trim().split(' ');
            var mapArray = JSON.parse('[' + that.mapArr + ']');
            for (var y = 0; y < 13; y++)
                for (var x = 0; x < 13; x++) {
                    var num = mapArray[y][x];
                    if (num == 0)
                        editor.map[y][x] = 0;
                    else if (num >= 1000) {
                        that.error = 3;
                        editor.map[y][x] = undefined;
                    } else if (typeof(editor.indexs[num][0]) == 'undefined') {
                        that.error = 2;
                        editor.map[y][x] = undefined;
                    } else editor.map[y][x] = editor.ids[[editor.indexs[num][0]]];
                }

            editor.updateMap();

        },
        formatArr: function () {
            var formatArrStr = '';
            var that = this;
            clearTimeout(that.formatTimer);
            if (this.mapArr.split(/\D+/).join(' ').trim().split(' ').length != 169) return false;
            var arr = this.mapArr.replace(/\s+/g, '').split('],[');

            if (arr.length != 13) return;
            for (var i = 0; i < 13; i++) {
                var a = [];
                formatArrStr += '[';
                if (i == 0 || i == 12) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
                else a = arr[i].split(/\D+/);
                if (a.length != 13) {
                    formatArrStr = '';
                    return;
                }

                for (var k = 0; k < 13; k++) {
                    var num = parseInt(a[k]);
                    formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == 12 ? '' : ',');
                }
                formatArrStr += ']' + (i == 12 ? '' : ',\n');
            }
            return formatArrStr;
        }
    }
});
var copyMap = new Vue({
    el: '#copyMap',
    data: {
        err: ''
    },
    methods: {
        copyMap: function () {

            tip.whichShow = 0;
            if (pout.value.trim() != '') {
                if (editArea.error) {
                    this.err = editArea.errors[editArea.error - 1];
                    tip.whichShow = 5
                    return;
                }
                try {
                    pout.select();
                    document.execCommand("Copy");
                    tip.whichShow = 6;
                } catch (e) {
                    this.err = e;
                    tip.whichShow = 5;
                }
            } else {
                tip.whichShow = 7;
            }
        }
    },
})
var clearMap = new Vue({
    el: '#clearMap',

    methods: {
        clearMap: function () {
            editor.mapInit();
            editor_mode.onmode('');
            editor.file.saveFloorFile(function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                ;printf('地图清除成功');
            });
            editor.updateMap();
            clearTimeout(editArea.formatTimer);
            clearTimeout(tip.timer);
            pout.value = '';
            editArea.mapArr = '';
            tip.whichShow = 4;
            editArea.error = 0;
        }
    }
})
var deleteMap = new Vue({
    el: '#deleteMap',
    methods: {
        deleteMap: function () {
            editor_mode.onmode('');
            var index = core.floorIds.indexOf(editor.currentFloorId);
            if (index>=0) {
                core.floorIds.splice(index,1);
                editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {/*console.log(objs_);*/
                    if (objs_.slice(-1)[0] != null) {
                        printe(objs_.slice(-1)[0]);
                        throw(objs_.slice(-1)[0])
                    }
                    ;printe('删除成功,请F5刷新编辑器生效');
                });
            }
            else printe('删除成功,请F5刷新编辑器生效');
        }
    }
})
printf = function (str_, type) {
    selectBox.isSelected = false;
    if (!type) {
        tip.whichShow = 11;
    } else {
        tip.whichShow = 12;
    }
    setTimeout(function () {
        if (!type) {
            tip.msgs[11] = String(str_);
            tip.whichShow = 12;
        } else {
            tip.msgs[10] = String(str_);
            tip.whichShow = 11;
        }
    }, 1);
}
printe = function (str_) {
    printf(str_, 'error')
}
tip_in_showMode = [
    '涉及图片的更改需要F5刷新浏览器来生效',
    '文本域可以通过双击,在文本编辑器或事件编辑器中编辑',
    '事件编辑器中的显示文本和自定义脚本的方块也可以双击',
    "画出的地图要点击\"保存地图\"才会写入到文件中",
];
var tip = new Vue({
    el: '#tip',
    data: {
        infos: {},
        hasId: true,
        isAutotile: false,
        isSelectedBlock: false,
        isClearBlock: false,
        geneMapSuccess: false,
        timer: null,
        msgs: [ //分别编号1,2,3,4,5,6,7,8,9,10；奇数警告，偶数成功
            "当前未选择任何图块，请先在右边选择要画的图块!",
            "生成地图成功！可点击复制按钮复制地图数组到剪切板",
            "生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！",
            "地图清除成功!",
            "复制失败！",
            "复制成功！可直接粘贴到楼层文件的地图数组中。",
            "复制失败！当前还没有数据",
            "修改成功！可点击复制按钮复制地图数组到剪切板",
            "选择背景图片失败！文件名格式错误或图片不存在！",
            "更新背景图片成功！",
            "11:警告",
            "12:成功"
        ],
        mapMsg: '',
        whichShow: 0,
    },
    watch: {
        infos: {
            handler: function (val, oldval) {
                this.isClearBlock = false;
                if (typeof(val) != 'undefined') {
                    if (val == 0) {
                        this.isClearBlock = true;
                        return;
                    }
                    if ('id' in val) {
                        this.hasId = true;
                    } else {
                        this.hasId = false;
                    }
                    this.isAutotile = false;
                    if (val.images == "autotile" && this.hasId) this.isAutotile = true;
                }
            },
            deep: true
        },

        whichShow: function () {
            var that = this;
            that.mapMsg = '';
            that.msgs[4] = "复制失败！" + editTip.err;
            clearTimeout(that.timer);
            if (that.whichShow) {
                that.mapMsg = that.msgs[that.whichShow - 1];
                that.timer = setTimeout(function () {
                    if (!(that.whichShow % 2))
                        that.whichShow = 0;
                }, 5000); //5秒后自动清除success，warn不清除
            }
        }
    }
})

var selectBox = new Vue({
    el: '#selectBox',
    data: {
        isSelected: false
    },
    watch: {
        isSelected: function () {
            tip.isSelectedBlock = this.isSelected;
            tip.whichShow = 0;
            clearTimeout(tip.timer);
        }
    }
})

var bgSelect = new Vue({
    el: '#bgSelect',
    data: {
        bgs: {},
        selectedBg: 'ground',
        imgname: ''
    },
    watch: {
        selectedBg: function () {
            editor.bgY = this.bgs.indexOf(this.selectedBg);
            editor.drawMapBg();
        }
    },
    methods: {
        updatebg: function () {
            tip.whichShow = 0;
            var regx = /\S+\.(png|bmp|jpg|jpeg|gif)$/i;
            if (regx.test(this.imgname)) {
                var url = 'images/' + this.imgname;
                editor.loadImg(url).then(function (img) {
                    editor.drawMapBg(img);
                    tip.whichShow = 10;
                }).catch(function (err) {
                    console.log(err);
                    tip.whichShow = 9;
                });
            } else {
                tip.whichShow = 9;
            }
        }
    }
})