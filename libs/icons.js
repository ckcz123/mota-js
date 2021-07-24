/// <reference path="../runtime.d.ts" />

"use strict";

function icons() {
    this._init();
}

icons.prototype._init = function () {
    this.icons = icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1;
    //delete(icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1);

    // tileset的起点
    this.tilesetStartOffset = 10000;
}

icons.prototype.getIcons = function () {
    var icons = core.clone(this.icons);
    icons.hero.leftup = icons.hero.leftdown = icons.hero.left;
    icons.hero.rightup = icons.hero.rightdown = icons.hero.right;
    return icons;
}

////// 根据道具ID获得其cls //////
icons.prototype.getClsFromId = function (id) {
    for (var cls in core.material.icons) {
        if (cls != 'hero' && id in core.material.icons[cls])
            return cls;
    }
    return null;
}

icons.prototype.getAllIconIds = function () {
    if (this.allIconIds) return this.allIconIds;
    this.allIconIds = [];
    for (var type in this.icons) {
        this.allIconIds = this.allIconIds.concat(Object.keys(this.icons[type]));
    }
    return this.allIconIds;
}

icons.prototype._getAnimateFrames = function (cls) {
    if (cls == 'enemys' || cls == 'npcs') {
        return 2;
    }
    if (cls == 'animates' || cls == 'enemy48' || cls == 'npc48') {
        return 4;
    }
    return 1;
}

////// 根据图块数字或ID获得所在的tileset和坐标信息 //////
icons.prototype.getTilesetOffset = function (id) {

    if (typeof id == 'string') {
        id = core.getIdOfThis(id);
        // Tileset的ID必须是 X+数字 的形式
        if (!/^X\d+$/.test(id)) return null;
        id = parseInt(id.substring(1));
    }
    else if (typeof id != 'number') {
        return null;
    }

    core.tilesets = core.tilesets || [];
    var startOffset = this.tilesetStartOffset;
    for (var i in core.tilesets) {
        var imgName = core.tilesets[i];
        var img = core.material.images.tilesets[imgName];
        var width = Math.floor(parseInt(img.getAttribute('_width')) / 32), height = Math.floor(parseInt(img.getAttribute('_height')) / 32);
        if (id >= startOffset && id < startOffset + width * height) {
            var x = (id - startOffset) % width, y = parseInt((id - startOffset) / width);
            return {"image": imgName, "x": x, "y": y};
        }
        startOffset += this.tilesetStartOffset;
    }
    return null;
}
