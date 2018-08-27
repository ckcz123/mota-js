/*
loader.js：负责对资源的加载

 */

function loader() {
    this.init();
}

loader.prototype.init = function () {

}

////// 设置加载进度条进度 //////
loader.prototype.setStartProgressVal = function (val) {
    core.dom.startTopProgress.style.width = val + '%';
}

////// 设置加载进度条提示文字 //////
loader.prototype.setStartLoadTipText = function (text) {
    core.dom.startTopLoadTips.innerHTML = text;
}

loader.prototype.load = function (callback) {

    // 加载icons
    core.loader.loadIcons();

    // 加载图片
    core.loader.loadImages(core.materials, core.material.images, function () {
        // 加载png图片
        core.material.images.images = {};

        var images = core.clone(core.images);
        if (images.indexOf("hero.png")<0)
            images.push("hero.png");

        core.loader.loadImages(images, core.material.images.images, function () {
            // 加载autotile
            core.material.images.autotile = {};
            core.loader.loadImages(Object.keys(core.material.icons.autotile), core.material.images.autotile, function () {
                core.loader.loadAnimates();
                core.loader.loadMusic();
                if (core.isset(callback))
                    callback();
            })
        })
    })
}

loader.prototype.loadIcons = function () {

    this.loadImage("icons.png", function (id, image) {
        var images = core.cropImage(image);
        for (var key in core.statusBar.icons) {
            if (typeof core.statusBar.icons[key] == 'number') {
                core.statusBar.icons[key] = images[core.statusBar.icons[key]];
                if (core.isset(core.statusBar.image[key]))
                    core.statusBar.image[key].src = core.statusBar.icons[key].src;
            }
        }
    });
}

loader.prototype.loadImages = function (names, toSave, callback) {
    if (names.length==0) {
        if (core.isset(callback)) callback();
        return;
    }
    var items = 0;
    for (var i=0;i<names.length;i++) {
        this.loadImage(names[i], function (id, image) {
            core.loader.setStartLoadTipText('正在加载图片 ' + id + "...");
            toSave[id] = image;
            items++;
            core.loader.setStartProgressVal(items * (100 / names.length));
            if (items == names.length) {
                if (core.isset(callback)) callback();
            }
        })
    }
}

loader.prototype.loadImage = function (imgName, callback) {
    try {
        var name=imgName;
        if (name.indexOf(".")<0)
            name=name+".png";
        var image = new Image();
        image.src = 'project/images/' + name + "?v=" + main.version;
        if (image.complete) {
            callback(imgName, image);
            return;
        }
        image.onload = function () {
            callback(imgName, image);
        }
    }
    catch (e) {
        console.log(e);
    }
}

loader.prototype.loadAnimates = function () {
    core.animates.forEach(function (t) {
        core.http('GET', 'project/animates/' + t + ".animate", null, function (content) {
            try {
                content = JSON.parse(content);
                var data = {};
                data.ratio = content.ratio;
                data.se = content.se;
                data.images = [];
                data.images_rev = [];
                content.bitmaps.forEach(function (t2) {
                    if (!core.isset(t2) || t2 == "") {
                        data.images.push(null);
                    }
                    else {
                        try {
                            var image = new Image();
                            image.src = t2;
                            data.images.push(image);
                        } catch (e) {
                            data.images.push(null);
                        }
                    }
                })
                data.frame = content.frame_max;
                data.frames = [];
                content.frames.forEach(function (t2) {
                    var info = [];
                    t2.forEach(function (t3) {
                        info.push({
                            'index': t3[0],
                            'x': t3[1],
                            'y': t3[2],
                            'zoom': t3[3],
                            'opacity': t3[4],
                            'mirror': t3[5] || 0,
                            'angle': t3[6] || 0,
                        })
                    })
                    data.frames.push(info);
                })
                core.material.animates[t] = data;
            }
            catch (e) {
                console.log(e);
                core.material.animates[t] = null;
            }
        }, function (e) {
            console.log(e);
            core.material.animates[t] = null;
        }, "text/plain; charset=x-user-defined")
    })
}

////// 加载音频 //////
loader.prototype.loadMusic = function () {
    core.bgms.forEach(function (t) {
        SoundManager.preloadBgm(t);
    });

    core.sounds.forEach(function (t) {
        SoundManager.preloadSe(t);
    });

    // 直接开始播放
    if (core.musicStatus.startDirectly && core.bgms.length>0)
        core.playBgm(core.bgms[0]);
}
