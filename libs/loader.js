/*
loader.js：负责对资源的加载

 */
"use strict";

function loader() {
    this._init();
}

loader.prototype._init = function () {

}

////// 设置加载进度条进度 //////
loader.prototype._setStartProgressVal = function (val) {
    core.dom.startTopProgress.style.width = val + '%';
}

////// 设置加载进度条提示文字 //////
loader.prototype._setStartLoadTipText = function (text) {
    core.dom.startTopLoadTips.innerText = text;
}

loader.prototype._load = function (callback) {
    this._loadIcons();
    this._loadAnimates();
    this._loadMusic();

    core.loader._loadMaterialImages(function () {
        core.loader._loadExtraImages(function () {
            core.loader._loadAutotiles(function () {
                core.loader._loadTilesets(callback);
            })
        })
    });
}

loader.prototype._loadIcons = function () {
    this.loadImage("icons.png", function (id, image) {
        var images = core.splitImage(image);
        for (var key in core.statusBar.icons) {
            if (typeof core.statusBar.icons[key] == 'number') {
                core.statusBar.icons[key] = images[core.statusBar.icons[key]];
                if (core.statusBar.image[key] != null)
                    core.statusBar.image[key].src = core.statusBar.icons[key].src;
            }
        }
    });
}

loader.prototype._loadMaterialImages = function (callback) {
    this._setStartLoadTipText("正在加载资源文件...");
    if (main.useCompress) {
        this.loadImagesFromZip('project/images/materials.h5data', core.materials, core.material.images, callback);
    } else {
        this.loadImages(core.materials, core.material.images, callback);
    }
}

loader.prototype._loadExtraImages = function (callback) {
    core.material.images.images = {};

    var images = core.clone(core.images);
    if (images.indexOf("hero.png") < 0)
        images.push("hero.png");

    this._setStartLoadTipText("正在加载图片文件...");
    if (main.useCompress) {
        // Check .gif
        var gifs = images.filter(function (name) {
            return name.toLowerCase().endsWith('.gif');
        });
        images = images.filter(function (name) {
            return !name.toLowerCase().endsWith('.gif');
        });

        this.loadImagesFromZip('project/images/images.h5data', images, core.material.images.images, callback);
        gifs.forEach(function (gif) {
            this.loadImage(gif, function (id, image) {
                if (image != null) {
                    core.material.images.images[gif] = image;
                }
            });
        }, this);
    } else {
        this.loadImages(images, core.material.images.images, callback);
    }
}

loader.prototype._loadAutotiles = function (callback) {
    core.material.images.autotile = {};
    var keys = Object.keys(core.material.icons.autotile);
    var autotiles = {};
    var _callback = function () {
        keys.forEach(function (v) {
            core.material.images.autotile[v] = autotiles[v];
        });

        setTimeout(function () {
            core.maps._makeAutotileEdges();
        });

        callback();
    }
    this._setStartLoadTipText("正在加载自动元件...");
    if (main.useCompress) {
        this.loadImagesFromZip('project/images/autotiles.h5data', keys, autotiles, _callback);
    } else {
        this.loadImages(keys, autotiles, _callback);
    }
}

loader.prototype._loadTilesets = function (callback) {
    core.material.images.tilesets = {};
    core.tilesets = core.tilesets || [];
    var _callback = function () {
        // 检查宽高是32倍数，如果出错在控制台报错
        for (var imgName in core.material.images.tilesets) {
            var img = core.material.images.tilesets[imgName];
            if (img.width % 32 != 0 || img.height % 32 != 0) {
                console.warn("警告！" + imgName + "的宽或高不是32的倍数！");
            }
            if (img.width * img.height > 32 * 32 * 3000) {
                console.warn("警告！" + imgName + "上的图块素材个数大于3000！");
            }
        }
        callback();
    }
    this._setStartLoadTipText("正在加载额外素材...");
    if (main.useCompress) {
        this.loadImagesFromZip('project/images/tilesets.h5data', core.tilesets, core.material.images.tilesets, _callback);
    } else {
        this.loadImages(core.tilesets, core.material.images.tilesets, _callback);
    }
}

loader.prototype.loadImages = function (names, toSave, callback) {
    if (!names || names.length == 0) {
        if (callback) callback();
        return;
    }
    var items = 0;
    for (var i = 0; i < names.length; i++) {
        this.loadImage(names[i], function (id, image) {
            core.loader._setStartLoadTipText('正在加载图片 ' + id + "...");
            if (toSave[id] !== undefined) {
                if (image != null)
                    toSave[id] = image;
                return;
            }
            toSave[id] = image;
            items++;
            core.loader._setStartProgressVal(items * (100 / names.length));
            if (items == names.length) {
                if (callback) callback();
            }
        })
    }
}

loader.prototype.loadImagesFromZip = function (url, names, toSave, callback) {
    if (!names || names.length == 0) {
        if (callback) callback();
        return;
    }

    core.unzip(url + "?v=" + main.version, function (data) {
        var cnt = 1;
        names.forEach(function (name) {
            var imgName = name;
            if (imgName.indexOf('.') < 0) imgName += '.png';
            if (imgName in data) {
                var img = new Image();
                var url = URL.createObjectURL(data[imgName]);
                cnt++;
                img.onload = function () {
                    cnt--;
                    URL.revokeObjectURL(url);
                    if (cnt == 0 && callback) callback();
                }
                img.src = url;
                toSave[name] = img;
            }
        });
        cnt--;
        if (cnt == 0 && callback) callback();
    }, null, false, function (percentage) {
        core.loader._setStartProgressVal(percentage * 100);
    });
}

loader.prototype.loadImage = function (imgName, callback) {
    try {
        var name = imgName;
        if (name.indexOf(".") < 0)
            name = name + ".png";
        var image = new Image();
        image.onload = function () {
            callback(imgName, image);
        }
        image.onerror = function () {
            callback(imgName, null);
        }
        image.src = 'project/images/' + name + "?v=" + main.version;
        if (name.endsWith('.gif'))
            callback(imgName, null);
    }
    catch (e) {
        main.log(e);
    }
}

loader.prototype._loadAnimates = function () {
    this._setStartLoadTipText("正在加载动画文件...");
    if (main.useCompress) {
        core.unzip('project/animates/animates.h5data?v=' + main.version, function (animates) {
            for (var name in animates) {
                if (name.endsWith(".animate")) {
                    var t = name.substring(0, name.length - 8);
                    if (core.animates.indexOf(t) >= 0)
                        core.loader._loadAnimate(t, animates[name]);
                }
            }
        }, null, true);
    } else {
        core.animates.forEach(function (t) {
            core.http('GET', 'project/animates/' + t + ".animate?v=" + main.version, null, function (content) {
                core.loader._loadAnimate(t, content);
            }, function (e) {
                main.log(e);
                core.material.animates[t] = null;
            }, "text/plain; charset=x-user-defined")
        })
    }
}

loader.prototype._loadAnimate = function (name, content) {
    try {
        content = JSON.parse(content);
        var data = {};
        data.ratio = content.ratio;
        data.se = content.se;
        data.images = [];
        data.images_rev = [];
        content.bitmaps.forEach(function (t2) {
            if (!t2) {
                data.images.push(null);
            }
            else {
                try {
                    var image = new Image();
                    image.src = t2;
                    data.images.push(image);
                } catch (e) {
                    main.log(e);
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
        core.material.animates[name] = data;
    }
    catch (e) {
        main.log(e);
        core.material.animates[name] = null;
    }
}

////// 加载音频 //////
loader.prototype._loadMusic = function () {
    core.bgms.forEach(function (t) {
        core.loader.loadOneMusic(t);
    });

    this._setStartLoadTipText("正在加载音效文件...");
    if (main.useCompress && core.musicStatus.audioContext) {
        core.unzip('project/sounds/sounds.h5data?v=' + main.version, function (data) {
            for (var name in data) {
                if (core.sounds.indexOf(name) >= 0) {
                    core.loader._loadOneSound_decodeData(name, data[name]);
                }
            }
        });
    } else {
        core.sounds.forEach(function (t) {
            core.loader.loadOneSound(t);
        });
    }
    // 直接开始播放
    core.playBgm(main.startBgm);
}

loader.prototype.loadOneMusic = function (name) {
    var music = new Audio();
    music.preload = 'none';
    if (main.bgmRemote) music.src = main.bgmRemoteRoot + core.firstData.name + '/' + name;
    else music.src = 'project/sounds/' + name;
    music.loop = 'loop';
    core.material.bgms[name] = music;
}

loader.prototype.loadOneSound = function (name) {
    if (core.musicStatus.audioContext != null) {
        core.http('GET', 'project/sounds/' + name + "?v=" + main.version, null, function (data) {
            core.loader._loadOneSound_decodeData(name, data);
        }, function (e) {
            main.log(e);
            core.material.sounds[name] = null;
        }, null, 'arraybuffer');
    }
    else {
        var music = new Audio();
        music.src = 'project/sounds/' + name;
        core.material.sounds[name] = music;
    }
}

loader.prototype._loadOneSound_decodeData = function (name, data) {
    if (data instanceof Blob) {
        var blobReader = new zip.BlobReader(data);
        blobReader.init(function () {
            blobReader.readUint8Array(0, blobReader.size, function (uint8) {
                core.loader._loadOneSound_decodeData(name, uint8.buffer);
            })
        });
        return;
    }
    try {
        core.musicStatus.audioContext.decodeAudioData(data, function (buffer) {
            core.material.sounds[name] = buffer;
        }, function (e) {
            main.log(e);
            core.material.sounds[name] = null;
        })
    }
    catch (e) {
        main.log(e);
        core.material.sounds[name] = null;
    }
}

loader.prototype.loadBgm = function (name) {
    name = core.getMappedName(name);
    if (!core.material.bgms[name]) return;
    // 如果没开启音乐，则不预加载
    if (!core.musicStatus.bgmStatus) return;
    // 是否已经预加载过
    var index = core.musicStatus.cachedBgms.indexOf(name);
    if (index >= 0) {
        core.musicStatus.cachedBgms.splice(index, 1);
    }
    else {
        // 预加载BGM
        this._preloadBgm(core.material.bgms[name]);
        // core.material.bgms[name].load();
        // 清理尾巴
        if (core.musicStatus.cachedBgms.length == core.musicStatus.cachedBgmCount) {
            this.freeBgm(core.musicStatus.cachedBgms.pop());
        }
    }
    // 移动到缓存最前方
    core.musicStatus.cachedBgms.unshift(name);
}

loader.prototype._preloadBgm = function (bgm) {
    bgm.volume = 0;
    bgm.play();
}

loader.prototype.freeBgm = function (name) {
    name = core.getMappedName(name);
    if (!core.material.bgms[name]) return;
    // 从cachedBgms中删除
    core.musicStatus.cachedBgms = core.musicStatus.cachedBgms.filter(function (t) {
        return t != name;
    });
    // 清掉缓存
    core.material.bgms[name].removeAttribute("src");
    core.material.bgms[name].load();
    core.material.bgms[name] = null;
    if (name == core.musicStatus.playingBgm) {
        core.musicStatus.playingBgm = null;
    }
    // 三秒后重新加载
    setTimeout(function () {
        core.loader.loadOneMusic(name);
    }, 3000);
}