editor_unsorted_2_wrapper=function(editor_mode){

    editor_mode.constructor.prototype.listen=function (callback) {
        
        // 这里的函数还没有写jsdoc

        editor.uifunctions.newIdIdnum_func()
        editor.uifunctions.changeId_func()

        editor.uifunctions.selectFloor_func()
        editor.uifunctions.saveFloor_func()

        editor.uifunctions.newMap_func()

        editor.uifunctions.createNewMaps_func()

        editor.uifunctions.changeFloorId_func()
        
        editor.uifunctions.fixCtx_func()
        editor.uifunctions.selectAppend_func()




        var autoAdjust = function (image, callback) {
            var changed = false;

            // Step 1: 检测白底
            var tempCanvas = document.createElement('canvas').getContext('2d');
            tempCanvas.canvas.width = image.width;
            tempCanvas.canvas.height = image.height;
            tempCanvas.mozImageSmoothingEnabled = false;
            tempCanvas.webkitImageSmoothingEnabled = false;
            tempCanvas.msImageSmoothingEnabled = false;
            tempCanvas.imageSmoothingEnabled = false;
            tempCanvas.drawImage(image, 0, 0);
            var imgData = tempCanvas.getImageData(0, 0, image.width, image.height);
            var trans = 0, white = 0, black=0;
            for (var i=0;i<image.width;i++) {
                for (var j=0;j<image.height;j++) {
                    var pixel = editor.util.getPixel(imgData, i, j);
                    if (pixel[3]==0) trans++;
                    if (pixel[0]==255 && pixel[1]==255 && pixel[2]==255 && pixel[3]==255) white++;
                    // if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) black++;
                }
            }
            if (white>black && white>trans*10 && confirm("看起来这张图片是以纯白为底色，是否自动调整为透明底色？")) {
                for (var i=0;i<image.width;i++) {
                    for (var j=0;j<image.height;j++) {
                        var pixel = editor.util.getPixel(imgData, i, j);
                        if (pixel[0]==255 && pixel[1]==255 && pixel[2]==255 && pixel[3]==255) {
                            editor.util.setPixel(imgData, i, j, [0,0,0,0]);
                        }
                    }
                }
                tempCanvas.clearRect(0, 0, image.width, image.height);
                tempCanvas.putImageData(imgData, 0, 0);
                changed = true;
            }
            /*
            if (black>white && black>trans*10 && confirm("看起来这张图片是以纯黑为底色，是否自动调整为透明底色？")) {
                for (var i=0;i<image.width;i++) {
                    for (var j=0;j<image.height;j++) {
                        var pixel = editor.util.getPixel(imgData, i, j);
                        if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) {
                            editor.util.setPixel(imgData, i, j, [0,0,0,0]);
                        }
                    }
                }
                tempCanvas.clearRect(0, 0, image.width, image.height);
                tempCanvas.putImageData(imgData, 0, 0);
                changed = true;
            }
            */

            // Step 2: 检测长宽比
            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            if ((image.width%32!=0 || image.height%ysize!=0) && (image.width<=128 && image.height<=ysize*4)
                && confirm("目标长宽不符合条件，是否自动进行调整？")) {
                var ncanvas = document.createElement('canvas').getContext('2d');
                ncanvas.canvas.width = 128;
                ncanvas.canvas.height = 4*ysize;
                ncanvas.mozImageSmoothingEnabled = false;
                ncanvas.webkitImageSmoothingEnabled = false;
                ncanvas.msImageSmoothingEnabled = false;
                ncanvas.imageSmoothingEnabled = false;
                var w = image.width / 4, h = image.height / 4;
                for (var i=0;i<4;i++) {
                    for (var j=0;j<4;j++) {
                        ncanvas.drawImage(tempCanvas.canvas, i*w, j*h, w, h, i*32 + (32-w)/2, j*ysize + (ysize-h)/2, w, h);
                    }
                }
                tempCanvas = ncanvas;
                changed = true;
            }

            if (!changed) {
                callback(image);
            }
            else {
                var nimg = new Image();
                nimg.onload = function () {
                    callback(nimg);
                };
                nimg.src = tempCanvas.canvas.toDataURL();
            }
        }

        var selectFileBtn = document.getElementById('selectFileBtn');
        selectFileBtn.onclick = function () {
            var loadImage = function (content, callback) {
                var image = new Image();
                try {
                    image.onload = function () {
                        callback(image);
                    }
                    image.src = content;
                }
                catch (e) {
                    printe(e);
                }
            }
            core.readFile(function (content) {
                loadImage(content, function (image) {
                    autoAdjust(image, function (image) {
                        editor_mode.appendPic.img = image;
                        editor_mode.appendPic.width = image.width;
                        editor_mode.appendPic.height = image.height;

                        if (editor.dom.selectAppend.value == 'autotile') {
                            for (var ii = 0; ii < 3; ii++) {
                                var newsprite = editor.dom.appendPicCanvas.children[ii];
                                newsprite.style.width = (newsprite.width = image.width) / editor.uivalues.ratio + 'px';
                                newsprite.style.height = (newsprite.height = image.height) / editor.uivalues.ratio + 'px';
                            }
                            editor.dom.spriteCtx.clearRect(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
                            editor.dom.spriteCtx.drawImage(image, 0, 0);
                        }
                        else {
                            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
                            for (var ii = 0; ii < 3; ii++) {
                                var newsprite = editor.dom.appendPicCanvas.children[ii];
                                newsprite.style.width = (newsprite.width = Math.floor(image.width / 32) * 32) / editor.uivalues.ratio + 'px';
                                newsprite.style.height = (newsprite.height = Math.floor(image.height / ysize) * ysize) / editor.uivalues.ratio + 'px';
                            }
                        }

                        //画灰白相间的格子
                        var bgc = editor.dom.bg.getContext('2d');
                        var colorA = ["#f8f8f8", "#cccccc"];
                        var colorIndex;
                        var sratio = 4;
                        for (var ii = 0; ii < image.width / 32 * sratio; ii++) {
                            colorIndex = 1 - ii % 2;
                            for (var jj = 0; jj < image.height / 32 * sratio; jj++) {
                                bgc.fillStyle = colorA[colorIndex];
                                colorIndex = 1 - colorIndex;
                                bgc.fillRect(ii * 32 / sratio, jj * 32 / sratio, 32 / sratio, 32 / sratio);
                            }
                        }

                        //把导入的图片画出
                        editor.dom.sourceCtx.drawImage(image, 0, 0);
                        editor_mode.appendPic.sourceImageData=editor.dom.sourceCtx.getImageData(0,0,image.width,image.height);

                        //重置临时变量
                        editor.dom.selectAppend.onchange();
                    });
                });
            }, null, 'img');

            return;
        }

        var changeColorInput=document.getElementById('changeColorInput')
        changeColorInput.oninput=function(){
            var delta=(~~changeColorInput.value)*30;
            var imgData=editor_mode.appendPic.sourceImageData;
            var nimgData=new ImageData(imgData.width,imgData.height);
            // ImageData .data 形如一维数组,依次排着每个点的 R(0~255) G(0~255) B(0~255) A(0~255)
            var convert=function(rgba,delta){
                var rgbToHsl = editor.util.rgbToHsl
                var hue2rgb = editor.util.hue2rgb
                var hslToRgb = editor.util.hslToRgb
                //
                var hsl=rgbToHsl(rgba)
                hsl[0]=(hsl[0]+delta)%360
                var nrgb=hslToRgb(hsl)
                nrgb.push(rgba[3])
                return nrgb
            }
            for(var x=0; x<imgData.width; x++){
                for(var y=0 ; y<imgData.height; y++){
                    editor.util.setPixel(nimgData,x,y,convert(editor.util.getPixel(imgData,x,y),delta))
                }
            }
            editor.dom.sourceCtx.clearRect(0, 0, imgData.width, imgData.height);
            editor.dom.sourceCtx.putImageData(nimgData, 0, 0);
        }

        var left1 = document.getElementById('left1');
        var eToLoc = function (e) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            var loc = {
                'x': scrollLeft + e.clientX + editor.dom.appendPicCanvas.scrollLeft - left1.offsetLeft - editor.dom.appendPicCanvas.offsetLeft,
                'y': scrollTop + e.clientY + editor.dom.appendPicCanvas.scrollTop - left1.offsetTop - editor.dom.appendPicCanvas.offsetTop,
                'size': 32,
                'ysize': editor.dom.selectAppend.value.endsWith('48') ? 48 : 32
            };
            return loc;
        }//返回可用的组件内坐标

        var locToPos = function (loc) {
            var pos = {'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.ysize), 'ysize': loc.ysize}
            return pos;
        }

        editor.dom.picClick.onclick = function (e) {
            var loc = eToLoc(e);
            var pos = locToPos(loc);
            //console.log(e,loc,pos);
            var num = editor_mode.appendPic.num;
            var ii = editor_mode.appendPic.index;
            if (ii + 1 >= num) editor_mode.appendPic.index = ii + 1 - num;
            else editor_mode.appendPic.index++;
            editor_mode.appendPic.selectPos[ii] = pos;
            editor.dom.appendPicSelection.children[ii].style = [
                'left:', pos.x * 32, 'px;',
                'top:', pos.y * pos.ysize, 'px;',
                'height:', pos.ysize - 6, 'px;'
            ].join('');
        }

        var appendConfirm = document.getElementById('appendConfirm');
        appendConfirm.onclick = function () {

            var confirmAutotile = function () {
                var image = editor_mode.appendPic.img;
                if (image.width % 96 !=0 || image.height != 128) {
                    printe("不合法的Autotile图片！");
                    return;
                }
                var imgData = editor.dom.sourceCtx.getImageData(0,0,image.width,image.height);
                editor.dom.spriteCtx.putImageData(imgData, 0, 0);
                var imgbase64 = editor.dom.sprite.toDataURL().split(',')[1];

                // Step 1: List文件名
                fs.readdir('./project/images', function (err, data) {
                    if (err) {
                        printe(err);
                        throw(err);
                    }

                    // Step 2: 选择Autotile文件名
                    var filename;
                    for (var i=1;;++i) {
                        filename = 'autotile'+i;
                        if (data.indexOf(filename+".png")==-1) break;
                    }

                    // Step 3: 写入文件
                    fs.writeFile('./project/images/'+filename+".png", imgbase64, 'base64', function (err, data) {
                        if (err) {
                            printe(err);
                            throw(err);
                        }
                        // Step 4: 自动注册
                        editor.file.registerAutotile(filename, function (err) {
                            if (err) {
                                printe(err);
                                throw(err);
                            }
                            printe('自动元件'+filename+'注册成功,请F5刷新编辑器');
                        })

                    })

                })

            }

            if (editor.dom.selectAppend.value == 'autotile') {
                confirmAutotile();
                return;
            }

            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            for (var ii = 0, v; v = editor_mode.appendPic.selectPos[ii]; ii++) {
                // var imgData = editor.dom.sourceCtx.getImageData(v.x * 32, v.y * ysize, 32, ysize);
                // editor.dom.spriteCtx.putImageData(imgData, ii * 32, editor.dom.sprite.height - ysize);
                // editor.dom.spriteCtx.drawImage(editor_mode.appendPic.img, v.x * 32, v.y * ysize, 32, ysize,  ii * 32, height,  32, ysize)

                editor.dom.spriteCtx.drawImage(editor.dom.sourceCtx.canvas, v.x*32, v.y*ysize, 32, ysize, 32*ii, editor.dom.sprite.height - ysize, 32, ysize);
            }
            var dt = editor.dom.spriteCtx.getImageData(0, 0, editor.dom.sprite.width, editor.dom.sprite.height);
            var imgbase64 = editor.dom.sprite.toDataURL().split(',')[1];
            fs.writeFile('./project/images/' + editor_mode.appendPic.imageName + '.png', imgbase64, 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                printe('追加素材成功，请F5刷新编辑器，或继续追加当前素材');
                editor.dom.sprite.style.height = (editor.dom.sprite.height = (editor.dom.sprite.height+ysize)) + "px";
                editor.dom.spriteCtx.putImageData(dt, 0, 0);
            });
        }

        editor_mode.change = function (value) {
            editor_mode.onmode('nextChange');
            editor_mode.onmode(value);
            if(editor.isMobile)editor.showdataarea(false);
        }
        var editModeSelect = document.getElementById('editModeSelect');
        editModeSelect.onchange = function () {
            editor_mode.change(editModeSelect.value);
        }

        editor_mode.checkUnique = function (thiseval) {
            if (!(thiseval instanceof Array)) return false;
            var map = {};
            for (var i = 0; i<thiseval.length; ++i) {
                if (map[thiseval[i]]) {
                    alert("警告：存在重复定义！");
                    return false;
                }
                map[thiseval[i]] = true;
            }
            return true;
        }

        editor_mode.checkFloorIds = function(thiseval){
            if (!editor_mode.checkUnique(thiseval)) return false;
            var oldvalue = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.floorIds;
            fs.readdir('project/floors',function(err, data){
                if(err){
                    printe(err);
                    throw Error(err);
                }
                var newfiles=thiseval.map(function(v){return v+'.js'});
                var notExist='';
                for(var name,ii=0;name=newfiles[ii];ii++){
                    if(data.indexOf(name)===-1)notExist=name;
                }
                if(notExist){
                    var discard=confirm('文件'+notExist+'不存在, 保存会导致工程无法打开, 是否放弃更改');
                    if(discard){
                        editor.file.editTower([['change', "['main']['floorIds']", oldvalue]], function (objs_) {//console.log(objs_);
                            if (objs_.slice(-1)[0] != null) {
                                printe(objs_.slice(-1)[0]);
                                throw(objs_.slice(-1)[0])
                            }
                            ;printe('已放弃floorIds的修改，请F5进行刷新');
                        });
                    }
                }
            });
            return true
        }

        editor_mode.changeDoubleClickModeByButton=function(mode){
            ({
                delete:function(){
                    printf('下一次双击表格的项删除，切换下拉菜单可取消；编辑后需刷新浏览器生效。');
                    editor_mode.doubleClickMode=mode;
                },
                add:function(){
                    printf('下一次双击表格的项则在同级添加新项，切换下拉菜单可取消；编辑后需刷新浏览器生效。');
                    editor_mode.doubleClickMode=mode;
                }
            }[mode])();
        }

        if (Boolean(callback)) callback();
    }

}