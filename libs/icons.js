"use strict";

function icons() {
    this.init();
}

icons.prototype.init = function () {
    this.icons = icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1;
    //delete(icons_4665ee12_3a1f_44a4_bea3_0fccba634dc1);

    // tileset的起点
    this.tilesetStartOffset = 10000;
}

icons.prototype.getIcons = function () {
    return this.icons;
}

////// 根据图块数字或ID获得所在的tileset和坐标信息 //////
icons.prototype.getTilesetOffset = function (id) {

    if (typeof id == 'string') {
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
        var width = Math.floor(img.width/32), height = Math.floor(img.height/32);
        if (id>=startOffset && id<startOffset+width*height) {
            var x = (id-startOffset)%width, y = parseInt((id-startOffset)/width);
            return {"image": imgName, "x": x, "y": y};
        }
        startOffset += this.tilesetStartOffset;
    }
    return null;
}