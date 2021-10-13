editor_uievent_wrapper = function (editor) {

    // ------ UI预览 & 地图选点相关 ------ //

    var uievent = {
        elements: {},
        values: {},
        isOpen: false,
        mode: ""
    };

    uievent.elements.div = document.getElementById('uieventDiv');
    uievent.elements.title = document.getElementById('uieventTitle');
    uievent.elements.yes = document.getElementById('uieventYes');
    uievent.elements.no = document.getElementById('uieventNo');
    uievent.elements.select = document.getElementById('uieventSelect');
    uievent.elements.selectPoint = document.getElementById('selectPoint');
    uievent.elements.selectFloor = document.getElementById('selectPointFloor');
    uievent.elements.selectPointBox = document.getElementById('selectPointBox');
    uievent.elements.body = document.getElementById('uieventBody');
    uievent.elements.selectPointButtons = document.getElementById('selectPointButtons');
    uievent.elements.canvas = document.getElementById('uievent');
    uievent.elements.extraBody = document.getElementById('uieventExtraBody');

    uievent.close = function () {
        uievent.isOpen = false;
        uievent.elements.div.style.display = 'none';
        if (uievent.values.interval) {
            clearTimeout(uievent.values.interval);
            clearInterval(uievent.values.interval);
        }
        uievent.values = {};
    }
    uievent.elements.no.onclick = uievent.close;

    uievent.drawPreviewUI = function () {
        core.setAlpha('uievent', 1);
        core.clearMap('uievent');
        core.setFilter('uievent', null);

        // 绘制UI
        var background = uievent.elements.select.value;
        if (background == 'thumbnail') {
            core.drawThumbnail(editor.currentFloorId, null, {ctx: 'uievent'});
        }
        else {
            core.fillRect('uievent', 0, 0, core.__PIXELS__, core.__PIXELS__, background);
        }

        if (uievent.values.list instanceof Array) {
            uievent.values.list.forEach(function (data) {
                if (typeof data == 'string') data = { "type": "text", "text": data };
                var type = data.type;
                if (type == "text") {
                    data.ctx = 'uievent';
                    core.saveCanvas('uievent');
                    core.drawTextBox(data.text, data);
                    core.loadCanvas('uievent');
                    return;
                }
                else if (type == "choices") {
                    for (var i = 0; i < data.choices.length; i++) {
                        if (typeof data.choices[i] === 'string')
                            data.choices[i] = {"text": data.choices[i]};
                        data.choices[i].text = core.replaceText(data.choices[i].text);
                    }
                    core.saveCanvas('uievent');
                    core.status.event.selection = data.selected || 0;
                    core.drawChoices(core.replaceText(data.text), data.choices, data.width, 'uievent');
                    core.status.event.selection = null;
                    core.loadCanvas('uievent');
                    return;
                } else if (type == "confirm") {
                    core.saveCanvas('uievent');
                    core.drawConfirmBox(data.text, null, null, 'uievent');                    
                    core.loadCanvas('uievent');
                } else if (core.ui["_uievent_" + type])
                    core.ui["_uievent_" + type](data);
            })
        }
    }

    uievent.previewUI = function (list) {
        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'previewUI';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'none';
        uievent.elements.title.innerText = 'UI绘制预览';
        uievent.elements.select.style.display = 'inline';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'block';
        uievent.elements.extraBody.style.display = 'none';
        uievent.elements.body.style.overflow = "hidden";

        uievent.elements.select.innerHTML = 
            '<option value="thumbnail" selected>缩略图</option>' + 
            '<option value="#000000">黑色</option>' + 
            '<option value="#FFFFFF">白色</option>';
        uievent.elements.select.onchange = function () {
            uievent.drawPreviewUI();
        }

        uievent.values.list = list;
        uievent.drawPreviewUI();
    }

    uievent.selectPoint = function (floorId, x, y, bigmap, callback) {
        uievent.values.bigmap = bigmap;
        uievent.values.size = editor.isMobile ? window.innerWidth / core.__SIZE__ : 32 * 540 / core.__PIXELS__;

        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'selectPoint';
        uievent.elements.selectPoint.style.display = 'block';
        uievent.elements.yes.style.display = 'inline';
        uievent.elements.select.style.display = 'none';
        uievent.elements.selectFloor.style.display = 'inline';
        uievent.elements.selectPointBox.style.display = 'block';
        uievent.elements.canvas.style.display = 'block';
        uievent.elements.extraBody.style.display = 'none';
        uievent.elements.body.style.overflow = "hidden";
        uievent.elements.yes.onclick = function () {
            var floorId = uievent.values.floorId, x = uievent.values.x, y = uievent.values.y;
            var multipoints = uievent.values.multipoints || [];
            uievent.close();
            if (callback) {
                if (multipoints.length > 0) {
                    callback(floorId, multipoints.map(function (one) { return one.split(',')[0]}).join(','),
                    multipoints.map(function (one) { return one.split(',')[1]}).join(','));
                } else {
                    callback(floorId, x, y);
                }
            }
        }

        // Append children
        var floors = "";
        core.floorIds.forEach(function (f) {
            floors += "<option value=" + f + ">" + f + "</option>";
        })
        uievent.elements.selectFloor.innerHTML = floors;
        // 检查多选点
        if (/^\d+(,\d+)+$/.test(x) && /^\d+(,\d+)+$/.test(y)) {
            var xx = x.split(','), yy = y.split(',');
            uievent.values.multipoints = [];
            for (var i = 0; i < xx.length; ++i) {
                uievent.values.multipoints.push(xx[i] + "," + yy[i]);
            }
            x = xx[xx.length - 1];
            y = yy[yy.length - 1];
        }
        this.setPoint(floorId || editor.currentFloorId, core.calValue(x) || 0, core.calValue(y) || 0);
    }

    uievent.updateSelectPoint = function (redraw) {
        uievent.elements.title.innerText = '地图选点【右键多选】 (' + uievent.values.x + "," + uievent.values.y + ')';
        // 计算size
        uievent.values.boxSize = uievent.values.size * 
            (uievent.values.bigmap ? (core.__SIZE__ / Math.max(uievent.values.width, uievent.values.height)) : 1);
        uievent.values.boxLeft = uievent.values.bigmap ?
            (core.__PIXELS__ * Math.max(0, (1 - uievent.values.width / uievent.values.height) / 2)) : 0;
        uievent.values.boxTop = uievent.values.bigmap ?
            (core.__PIXELS__ * Math.max(0, (1 - uievent.values.height / uievent.values.width) / 2)) : 0;

        if (uievent.values.bigmap) {
            uievent.elements.selectPointBox.style.left = uievent.values.boxSize * uievent.values.x + uievent.values.boxLeft + "px";
            uievent.elements.selectPointBox.style.top = uievent.values.boxSize * uievent.values.y + uievent.values.boxTop + "px";
        } else {
            uievent.elements.selectPointBox.style.left = uievent.values.boxSize * (uievent.values.x - uievent.values.left) + "px";
            uievent.elements.selectPointBox.style.top = uievent.values.boxSize * (uievent.values.y - uievent.values.top) + "px";
        }
        uievent.elements.selectPointBox.style.width = uievent.values.boxSize - 6 + "px";
        uievent.elements.selectPointBox.style.height = uievent.values.boxSize - 6 + "px";

        if (redraw) {
            core.setAlpha('uievent', 1);
            core.clearMap('uievent');
            core.drawThumbnail(uievent.values.floorId, null, {
                ctx: 'uievent', centerX: uievent.values.left + core.__HALF_SIZE__,
                centerY: uievent.values.top + core.__HALF_SIZE__, all: uievent.values.bigmap
            });
            uievent.values.multipoints = uievent.values.multipoints || [];
            core.setTextAlign('uievent', 'right');
            for (var i = 0; i < uievent.values.multipoints.length; ++i) {
                var xy = uievent.values.multipoints[i].split(","), x = parseInt(xy[0]), y = parseInt(xy[1]);
                core.fillBoldText('uievent', i + 1,
                    32 * (x - uievent.values.left) + 28 , 32 * (y - uievent.values.top) + 26, '#FF7F00', null, '14px Verdana');
            }
            core.setTextAlign('uievent', 'left');
        }
    }

    uievent.setPoint = function (floorId, x, y) {
        if (core.floorIds.indexOf(floorId) == -1) floorId = editor.currentFloorId;
        uievent.values.floorId = floorId;
        uievent.elements.selectFloor.value = floorId;
        uievent.values.x = x != null ? x : (uievent.values.x || 0);
        uievent.values.y = y != null ? y : (uievent.values.y || 0);
        uievent.values.width = core.floors[uievent.values.floorId].width || core.__SIZE__;
        uievent.values.height = core.floors[uievent.values.floorId].height || core.__SIZE__;
        uievent.values.left = core.clamp(uievent.values.x - core.__HALF_SIZE__, 0, uievent.values.width - core.__SIZE__);
        uievent.values.top = core.clamp(uievent.values.y - core.__HALF_SIZE__, 0, uievent.values.height - core.__SIZE__);
        uievent.updateSelectPoint(true);
    }

    uievent.elements.selectFloor.onchange = function () {
        uievent.values.multipoints = [];
        uievent.setPoint(uievent.elements.selectFloor.value);
    }

    uievent.elements.selectPointBox.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    uievent.elements.body.onclick = function (e) {
        if (uievent.mode != 'selectPoint') return;
        if (uievent.values.bigmap) {
            uievent.values.x = core.clamp(Math.floor((e.offsetX - uievent.values.boxLeft) / uievent.values.boxSize), 0, uievent.values.width - 1);
            uievent.values.y = core.clamp(Math.floor((e.offsetY - uievent.values.boxTop) / uievent.values.boxSize), 0, uievent.values.height - 1);
        } else {
            uievent.values.x = uievent.values.left + Math.floor(e.offsetX / uievent.values.size);
            uievent.values.y = uievent.values.top + Math.floor(e.offsetY / uievent.values.size);
        }
        uievent.updateSelectPoint(false);
    }

    uievent.elements.body.oncontextmenu = function (e) { 
        e.preventDefault();
        e.stopPropagation();
        if (uievent.mode != 'selectPoint' || uievent.values.bigmap) return;
        var x = uievent.values.left + Math.floor(e.offsetX / uievent.values.size);
        var y = uievent.values.top + Math.floor(e.offsetY / uievent.values.size);
        uievent.values.multipoints = uievent.values.multipoints || [];
        if (uievent.values.multipoints.indexOf(x+","+y) >= 0) {
            uievent.values.multipoints = uievent.values.multipoints.filter(function (o) { return o != x+","+y;})
        } else {
            uievent.values.multipoints.push(x+","+y);
        }
        uievent.values.x = x;
        uievent.values.y = y;
        uievent.updateSelectPoint(true);
        return false;
    }

    uievent.move = function (dx, dy) {
        if (uievent.mode != 'selectPoint') return;
        if (uievent.values.bigmap) return;
        uievent.values.left = core.clamp(uievent.values.left + dx, 0, uievent.values.width - core.__SIZE__);
        uievent.values.top = core.clamp(uievent.values.top + dy, 0, uievent.values.height - core.__SIZE__);
        this.updateSelectPoint(true);
    };

    uievent.triggerBigmap = function () {
        if (uievent.mode != 'selectPoint') return;
        uievent.values.bigmap = !uievent.values.bigmap;
        uievent.values.multipoints = [];
        uievent.setPoint(uievent.values.floorId);
    };

    (function () {

        var viewportButtons = uievent.elements.selectPointButtons;
        var pressTimer = null;
        for (var ii = 0, node; node = viewportButtons.children[ii]; ii++) {
            if (ii == 4) {
                node.onclick = uievent.triggerBigmap;
                continue;
            }
            if (ii == 5) {
                node.onclick = function () {
                    alert(core.copy(uievent.values.floorId) ? ('楼层ID '+uievent.values.floorId+' 已成功复制到剪切板') : '无法复制楼层ID');
                }
            }
            (function (x, y) {
                var move = function () {
                    uievent.move(x, y);
                }
                node.onmousedown = function () {
                    clearTimeout(pressTimer);
                    pressTimer = setTimeout(function () {
                        pressTimer = -1;
                        var f = function () {
                            if (pressTimer != null) {
                                move();
                                setTimeout(f, 150);
                            }
                        }
                        f();
                    }, 500);
                };
                node.onmouseup = function () {
                    if (pressTimer > 0) {
                        clearTimeout(pressTimer);
                        move();
                    }
                    pressTimer = null;
                }
            })([-1, 0, 0, 1][ii], [0, -1, 1, 0][ii]);
        }
    })();

    uievent.elements.div.onmousewheel = function (e) {
        if (uievent.mode != 'selectPoint') return;
        var index = core.floorIds.indexOf(uievent.values.floorId);
        try {
            if (e.wheelDelta)
                index += Math.sign(e.wheelDelta);
            else if (e.detail)
                index += Math.sign(e.detail);
        } catch (ee) { main.log(ee); }
        index = core.clamp(index, 0, core.floorIds.length - 1);
        uievent.values.multipoints = [];
        uievent.setPoint(core.floorIds[index]);
    }

    uievent.onKeyDown = function (e) {
        if (e.keyCode == 27) editor.uievent.close();
        if (uievent.mode == 'selectPoint') {
            if (e.keyCode == 87) editor.uievent.move(0, -1)
            if (e.keyCode == 65) editor.uievent.move(-1, 0)
            if (e.keyCode == 83) editor.uievent.move(0, 1);
            if (e.keyCode == 68) editor.uievent.move(1, 0);
        }
    }

    // ------ 搜索变量出现的位置，也放在uievent好了 ------ //

    uievent.searchUsedFlags = function () {
        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'searchUsedFlags';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'none';
        uievent.elements.title.innerText = '搜索变量';
        uievent.elements.select.style.display = 'inline';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'none';
        uievent.elements.extraBody.style.display = 'block';
        uievent.elements.body.style.overflow = "auto";

        // build flags
        var html = "";
        Object.keys(editor.used_flags).sort().forEach(function (v) {
            v = "flag:" + v;
            html += "<option value='" + v + "'>" + v + "</option>";
        });
        uievent.elements.select.innerHTML = html;
        uievent.elements.select.onchange = uievent.doSearchUsedFlags;

        uievent.doSearchUsedFlags();
    }

    uievent.doSearchUsedFlags = function () {
        var flag = uievent.elements.select.value;

        var html = "<p style='margin-left: 10px'>该变量出现的所有位置如下：</p><ul>";
        var list = uievent._searchUsedFlags(flag);
        list.forEach(function (x) {
            html += "<li>" + x + "</li>";
        });
        html += "</ul>";
        uievent.elements.extraBody.innerHTML = html;
    }

    var hasUsedFlags = function (obj, flag) {
        if (obj == null) return false;
        if (typeof obj != 'string') return hasUsedFlags(JSON.stringify(obj), flag);

        var index = -1, length = flag.length;
        while (true) {
            index = obj.indexOf(flag, index + 1);
            if (index < 0) return false;
            if (!/^[a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]$/.test(obj.charAt(index + length))) return true;
        }
    }

    uievent._searchUsedFlags = function (flag) {
        var list = [];
        // 每个点的事件
        var events = ["events", "autoEvent", "changeFloor", "beforeBattle", "afterBattle", "afterGetItem", "afterOpenDoor"]
        for (var floorId in core.floors) {
            var floor = core.floors[floorId];
            if (hasUsedFlags(floor.firstArrive, flag)) list.push([floorId, "firstArrive"]);
            if (hasUsedFlags(floor.eachArrive, flag)) list.push([floorId, "eachArrive"]);
            events.forEach(function (e) {
                if (floor[e]) {
                    for (var loc in floor[e]) {
                        if (hasUsedFlags(floor[e][loc], flag)) {
                            list.push(floorId + " 层 " + e + " 的 (" + loc + ") 点");
                        }
                    }
                }
            });
        }
        // 公共事件
        for (var name in events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent) {
            if (hasUsedFlags(events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent[name], flag))
                list.push("公共事件 " + name);
        }
        // 道具 & 装备属性
        for (var id in items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a) {
            var item = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id];
            // 装备属性
            if (hasUsedFlags(item.equip, flag)) {
                list.push("道具 " + (item.name || id) + " 的装备属性");
            }
            // 使用事件
            if (hasUsedFlags(item.useItemEvent, flag)) { 
                list.push("道具 " + (item.name || id) + " 的使用事件");
            }
        }
        // 怪物战前 & 战后
        for (var id in enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80) {
            var enemy = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id];
            if (hasUsedFlags(enemy.beforeBattle, flag)) {
                list.push("怪物 " + (enemy.name || id) + " 的战前事件");
            }
            if (hasUsedFlags(enemy.afterBattle, flag)) {
                list.push("怪物 " + (enemy.name || id) + " 的战后事件");
            }
        }
        // 图块的碰触 & 门信息
        for (var id in maps_90f36752_8815_4be8_b32b_d7fad1d0542e) {
            var mapInfo = maps_90f36752_8815_4be8_b32b_d7fad1d0542e[id];
            if (hasUsedFlags(mapInfo.doorInfo, flag))
                list.push("图块 " + (mapInfo.name || mapInfo.id) + " 的门信息");
            if (hasUsedFlags(mapInfo.event, flag))
                list.push("图块 " + (mapInfo.name || mapInfo.id) + " 碰触事件");
        }
        // 难度 & 标题事件 & 开场剧情 & 等级提升
        if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.levelChoose, flag))
            list.push("难度分歧");
        if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.startCanvas, flag))
            list.push("标题事件");
        if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.startText, flag))
            list.push("开场剧情");
        if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.levelUp, flag))
            list.push("等级提升");
        // 全局商店
        (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.shops || []).forEach(function (shop) {
            if (hasUsedFlags(shop, flag)) list.push("商店 " + shop.id);
        });

        return list;
    }

    // ------ 选择楼层 ------ //
    uievent.selectFloor = function (floorId, title, callback) {
        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'selectFloor';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'block';
        uievent.elements.title.innerText = title;
        uievent.elements.select.style.display = 'none';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'none';
        uievent.elements.extraBody.style.display = 'block';
        uievent.elements.body.style.overflow = "auto";

        uievent.elements.yes.onclick = function () {
            var floorId = uievent.values.floorId;
            uievent.close();
            if (callback) callback(floorId);
        }

        if (floorId instanceof Array) floorId = floorId[0];
        if (!floorId) floorId = editor.currentFloorId;
        uievent.values.floorId = floorId;

        var html = "<p style='margin-left: 10px; line-height: 25px'>";
        html += "搜索楼层：<input type='text' oninput='editor.uievent._selectFloor_update(this.value)' "
        html += "placeholder='楼层ID或楼层名...' style='vertical-align:text-bottom'><br/>"
        html += '<span id="selectFloor_floorList"></span>';
        html += "</p>";

        uievent.elements.extraBody.innerHTML = html;
        uievent._selectFloor_update();
    }

    uievent._selectFloor_update = function (value) {
        value = value || '';
        var floorList = document.getElementById('selectFloor_floorList');
        var html = '';
        core.floorIds.forEach(function (one) {
            var checked = one == uievent.values.floorId;
            var floor = core.floors[one];
            if (floor == null) return;
            if (!one.includes(value) && !(floor.title||"").includes(value) && !(floor.name||"").includes(value)) return;
            html += "<input type='radio' name='uievent_selectFloor' onchange='editor.uievent.values.floorId=\""+one+"\"'" + (checked ? ' checked' : '') + ">";
            html += "<span onclick='this.previousElementSibling.checked=true;editor.uievent.values.floorId=\""+one+"\"' style='cursor: default'>" 
                + one + '（' + floor.title + '）' + "</span>";
            html += "<button onclick='editor.uievent._selectFloor_preview(this)' style='margin-left: 10px'>预览</button>";
            html += "<span style='display:none;' key='"+one+"'></span>";
            html += '<br/>';
        });
        floorList.innerHTML = html;
    }

    uievent._selectFloor_preview = function (button) {
        var span = button.nextElementSibling;
        while (span.firstChild) span.removeChild(span.lastChild);
        var floorId = span.getAttribute('key');

        if (span.style.display == 'none') {
            button.innerText = '收起';
            span.style.display = 'inline';
            if (!uievent.values.dom) {
                var canvas = document.createElement('canvas');
                canvas.style.position = 'relative';
                canvas.style.marginLeft = "-10px";
                canvas.style.marginTop = '5px';
                canvas.width = canvas.height = core.__PIXELS__;
                uievent.values.dom = canvas;
                uievent.values.ctx = canvas.getContext('2d');
            }
            span.appendChild(uievent.values.dom);
            core.clearMap(uievent.values.ctx);
            core.drawThumbnail(floorId, null, {ctx: uievent.values.ctx, all: true});
        } else {
            button.innerText = '预览';
            span.style.display = 'none';
        }
    }

    // ------ 素材选择框 ------ //
    uievent.selectMaterial = function (value, title, directory, transform, callback) {
        var one = directory.split(':');
        if (one.length > 1) directory = one[0];
        var appendedImages = one[1] == 'images' ? core.material.images.images : {};

        fs.readdir(directory, function (err, data) {
            if (err) {
                printe(directory + '不存在！');
                throw (directory + '不存在！');
            }
            if (!(data instanceof Array)) {
                printe('没有可显示的内容')
                return;
            }
            value = value || [];
            data = (transform ? data.map(transform) : data).filter(function (one) {return one;}).sort();
            var data2 = Object.keys(appendedImages);
            data2 = (transform ? data2.map(transform) : data2).filter(function (one) {
                return one && data.indexOf(one) < 0;
            }).sort();

            uievent.isOpen = true;
            uievent.elements.div.style.display = 'block';
            uievent.mode = 'selectMaterial';
            uievent.elements.selectPoint.style.display = 'none';
            uievent.elements.yes.style.display = 'block';
            uievent.elements.title.innerText = title;
            uievent.elements.select.style.display = 'none';
            uievent.elements.selectFloor.style.display = 'none';
            uievent.elements.selectPointBox.style.display = 'none';
            uievent.elements.canvas.style.display = 'none';
            uievent.elements.extraBody.style.display = 'block';
            uievent.elements.body.style.overflow = "auto";

            uievent.elements.yes.onclick = function () {
                var list = Array.from(document.getElementsByClassName('materialCheckbox')).filter(function (one) {
                    return one.checked;
                }).map(function (one) {return one.getAttribute('key'); });
                uievent.close();
                if (callback) callback(list);
            }

            var _isTileset = directory.indexOf('project/tilesets') >= 0;

            // 显示每一项内容
            var html = "<p style='margin-left: 10px; line-height: 25px'>";
            html += "<button onclick='editor.uievent._selectAllMaterial(true)'>全选</button>"+
                    "<button style='margin-left: 10px' onclick='editor.uievent._selectAllMaterial(false)'>全不选</button><br/>";
            if (_isTileset) {
                html += "<b style='margin-top: 5px;'>警告！额外素材一旦注册成功将不可删除，否则可能会导致素材错位风险！如果你不再想用某个额外素材，"
                    +"但又不想让它出现在素材区，可以考虑使用空气墙同名替换该额外素材文件。</b><br/>"
            }
            data.forEach(function (one) {
                var checked = value.indexOf(one) >= 0? 'checked' : '';
                var disabled = _isTileset && value.indexOf(one) >= 0 ? 'disabled' : ''
                html += `<input type="checkbox" key="${one}" class="materialCheckbox" ${checked} ${disabled}/> ${one}`;
                // 预览图片
                if (one.endsWith('.png') || one.endsWith('.jpg') || one.endsWith('.jpeg') || one.endsWith('.gif')) {
                    html += "<button onclick='editor.uievent._previewMaterialImage(this)' style='margin-left: 10px'>预览</button>";
                    html += '<br style="display:none"/><img key="'+directory+one+'" style="display:none; max-width: 100%"/>';
                }
                // 试听音频
                if (one.endsWith('.mp3') || one.endsWith('.ogg') || one.endsWith('.wav') || one.endsWith('.m4a') || one.endsWith('.flac')) {
                    html += "<button onclick='editor.uievent._previewMaterialAudio(this)' style='margin-left: 10px'>播放</button>"
                    html += "<small> 音调：<input value='100' style='width:28px' onchange='editor.uievent._previewMaterialAudio_onPitchChange(this)'></small>";
                    html += `<small style='display:none; margin-left: 15px'>0:00 / 0:00</small><br style="display:none"/>
                        <audio preload="none" src="${directory+one}" ontimeupdate="editor.uievent._previewMaterialAudio_onTimeUpdate(this)"></audio>
                        <progress value="0" max="1" style="display:none; width:100%" onclick="editor.uievent._previewMaterialAudio_seek(this, event)"></progress>`;
                }
                // 预览动画
                if (directory.indexOf('animates') >= 0) {
                    html += "<button onclick='editor.uievent._previewMaterialAnimate(this)' style='margin-left: 10px'>预览</button>";
                    html += "<span style='display:none; margin-left: 10px' key='"+directory+one+".animate'></span>";
                }
                html += '<br/>';
            });
            data2.forEach(function (one) {
                var checked = value.indexOf(one) >= 0? 'checked' : '';
                var disabled = _isTileset && value.indexOf(one) >= 0 ? 'disabled' : '';
                html += `<input type="checkbox" key="${one}" class="materialCheckbox" ${checked} ${disabled}/> ${one}`;
                // 预览图片
                if (one.endsWith('.png') || one.endsWith('.jpg') || one.endsWith('.jpeg') || one.endsWith('.gif')) {
                    html += "<button onclick='editor.uievent._previewMaterialImage2(this)' style='margin-left: 10px'>预览</button>";
                    html += '<br style="display:none" key="'+one+'"/><br/>';
                }
            })
            html += "</p>";
            html += "<p style='margin-left: 10px'><small>如果文件未在此列表显示，请检查文件名是否合法（只能由数字字母下划线横线和点组成），后缀名是否正确。</small></p>";
            uievent.elements.extraBody.innerHTML = html;
        });
    }

    uievent._selectAllMaterial = function (checked) {
        Array.from(document.getElementsByClassName('materialCheckbox')).forEach(function (one) {
            if (!one.disabled) one.checked = checked;
        })
    }

    uievent._previewMaterialImage = function (button) {
        var br = button.nextElementSibling;
        var img = br.nextElementSibling;
        if (br.style.display == 'none') {
            button.innerText = '折叠';
            br.style.display = 'block';
            img.style.display = 'block';
            img.src = img.getAttribute('key');
        } else {
            button.innerText = '预览';
            br.style.display = 'none';
            img.style.display = 'none';
        }
    }

    uievent._previewMaterialImage2 = function (button) {
        var br = button.nextElementSibling;
        if (br.style.display == 'none') {
            button.innerText = '折叠';
            br.style.display = 'block';
            br.parentElement.insertBefore(core.material.images.images[br.getAttribute('key')], br.nextElementSibling);
        } else {
            button.innerText = '预览';
            br.style.display = 'none';
            br.parentElement.removeChild(core.material.images.images[br.getAttribute('key')]);
        }
    }

    uievent._previewMaterialAudio = function (button) {
        var span = button.nextElementSibling.nextElementSibling;
        var br = span.nextElementSibling;
        var audio = br.nextElementSibling;
        var progress = audio.nextElementSibling;
        if (br.style.display == 'none') {
            button.innerText = '暂停';
            br.style.display = 'block';
            progress.style.display = 'block';
            span.style.display = 'inline';
            audio.play();
        } else {
            button.innerText = '播放';
            br.style.display = 'none';
            progress.style.display='none';
            span.style.display = 'none';
            audio.pause();
        }
    }

    uievent._previewMaterialAudio_onPitchChange = function (input) {
        var audio = input.parentElement.nextElementSibling.nextElementSibling.nextElementSibling;
        audio.preservesPitch = false;
        audio.playbackRate = core.clamp((parseInt(input.value) || 100) / 100, 0.3, 3.0);
    }

    uievent._previewMaterialAudio_onTimeUpdate = function (audio) {
        var _format = function (time) { return parseInt(time/60) + ":" + core.setTwoDigits(parseInt(time) % 60); }
        if (audio.duration > 0) {
            audio.previousElementSibling.previousElementSibling.innerText = _format(audio.currentTime) + " / " + _format(audio.duration);
            audio.nextElementSibling.setAttribute('value', audio.currentTime / audio.duration);
        }
    }

    uievent._previewMaterialAudio_seek = function (element, event) {
        var audio = element.previousElementSibling;
        var value = event.offsetX * element.max / element.offsetWidth;
        element.setAttribute("value", value);
        audio.currentTime = audio.duration * value;
        if (audio.paused) audio.play();
    }

    var _previewMaterialAnimate = function (span, content) {
        _previewMaterialAnimate_buildSounds(span, content);

        // 创建dom
        if (!uievent.values.dom) {
            var dom = document.createElement('span');
            dom.style.position = "relative";
            dom.style.marginLeft = "-10px";
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = core.__PIXELS__;
            canvas.style.position = 'absolute';
            core.drawThumbnail(editor.currentFloorId, null, {ctx: canvas.getContext('2d')});
            dom.appendChild(canvas);
            var canvas2 = document.createElement('canvas');
            canvas2.style.position = 'absolute';
            canvas2.width = canvas2.height = core.__PIXELS__;
            uievent.values.ctx = canvas2.getContext('2d');
            dom.appendChild(canvas2);
            var canvas3 = document.createElement('canvas');
            canvas3.width = canvas3.height = core.__PIXELS__;
            dom.appendChild(canvas3);
            uievent.values.dom = dom;
        }

        span.appendChild(uievent.values.dom);
        clearInterval(uievent.values.interval);
        var frame = 0;
        uievent.values.interval = setInterval(function () {
            if (span.style.display == 'none') {
                clearInterval(uievent.values.interval);
                uievent.values.interval = null;
                return;
            }
            core.clearMap(uievent.values.ctx);
            core.maps._drawAnimateFrame(uievent.values.ctx, content, core.__PIXELS__ / 2, core.__PIXELS__ / 2, frame++);
        }, 50);
    }

    var _previewMaterialAnimate_buildSounds = function (span, content) {
        var sounds = content.se || {};
        if (typeof sounds == 'string') sounds = {1: sounds};
        var pitch = content.pitch || {};

        span.appendChild(document.createElement('br'));
        var dom = document.createElement('span');
        dom.setAttribute('frames', content.frame);
        var html = "";
        Object.keys(sounds).forEach(function (frame) {
            html += "<span>" + _previewMaterialAnimate_buildSoundRow(frame, sounds[frame], content.frame, pitch[frame]) + "</span>";
        });
        html += '<button onclick="editor.uievent._previewMaterialAnimate_addSound(this)">添加音效</button>';
        html += '<button onclick="editor.uievent._previewMaterialAnimate_saveSound(this)" style="margin-left:10px">保存</button>';
        html += "<br/><br/>";
        dom.innerHTML = html;
        span.appendChild(dom);
        _previewMaterialAnimate_awesomplete(span);
    }

    var _previewMaterialAnimate_buildSoundRow = function (index, se, frames, pitch) {
        var audios = Object.keys(core.material.sounds).sort().join(",");
        var html = "";
        html += "第 <select>";
        for (var i = 1; i <= frames; ++i) {
            html += "<option value="+i;
            if (index == i) html += " selected";
            html += ">"+i+"</option>";
        }
        html += "</select> 帧：";
        html += '<input type="text" class="_audio" data-list="'+audios+'" data-minchars="1" data-autofirst="true" style="width: 110px" value="'+se+'"/>';
        html += '<button onclick="editor.uievent._previewMaterialAnimate_previewSound(this)" style="margin-left: 10px">试听</button>';
        html += "<small> 音调：<input value='"+(pitch||100)+"' style='width:28px'></small>";
        html += '<button onclick="editor.uievent._previewMaterialAnimate_deleteSound(this)" style="margin-left: 10px">删除</button>';
        html += '<br/>';
        return html;
    }

    var _previewMaterialAnimate_awesomplete = function (span) {
        var inputs = span.getElementsByClassName("_audio");
        for (var i = 0; i < inputs.length; ++i) {
            var input = inputs[i];
            if (!input.hasAttribute('awesomplete')) {
                input.setAttribute('awesomplete', '1');
                new Awesomplete(input);
            }
        }
    }

    uievent._previewMaterialAnimate = function (button) {
        var span = button.nextElementSibling;
        while (span.firstChild) span.removeChild(span.lastChild);
        var filename = span.getAttribute("key");
        uievent.values.animates = uievent.values.animates || {};
        if (span.style.display == 'none') {
            button.innerText = '收起';
            span.style.display = 'inline';
            if (uievent.values.animates[filename]) {
                _previewMaterialAnimate(span, uievent.values.animates[filename]);
            } else {
                fs.readFile(filename, 'utf-8', function (e, d) {
                    if (e) {
                        alert('无法打开动画文件！'+e); return;
                    }
                    uievent.values.animates[filename] = core.loader._loadAnimate(d);
                    if (uievent.values.animates[filename]) {
                        uievent.values.animates[filename + ':raw'] = JSON.parse(d);
                        _previewMaterialAnimate(span, uievent.values.animates[filename]);
                    }
                })
            }
        } else {
            button.innerText = '预览';
            span.style.display = 'none';
        }
    }

    uievent._previewMaterialAnimate_previewSound = function (button) {
        var input = button.previousElementSibling;
        if (input.tagName == 'DIV') input = input.firstChild;
        if (!input.value) return;
        if (!uievent.values.audio)
            uievent.values.audio = new Audio();
        uievent.values.audio.src = './project/sounds/' + input.value;
        uievent.values.audio.preservesPitch = false;
        uievent.values.audio.playbackRate = core.clamp((parseInt(button.nextElementSibling.children[0].value) || 100) / 100, 0.3, 3.0);
        uievent.values.audio.play();
    }

    uievent._previewMaterialAnimate_addSound = function (button) {
        var parent = button.parentElement;
        var span = document.createElement("span");
        span.innerHTML = _previewMaterialAnimate_buildSoundRow(1, "", parseInt(parent.getAttribute("frames")));
        parent.insertBefore(span, button);
        _previewMaterialAnimate_awesomplete(parent);
    }

    uievent._previewMaterialAnimate_deleteSound = function (button) {
        var element = button.parentElement;
        element.parentElement.removeChild(element);
    }

    uievent._previewMaterialAnimate_saveSound = function (button) {
        var span = button.parentElement;
        var filename = span.parentElement.getAttribute("key");
        if (!filename || !uievent.values.animates[filename]) return;
        var se = {};
        var pitch = {};

        var audios = span.getElementsByClassName("_audio");
        for (var i = 0; i < audios.length; ++i) {
            var audio = audios[i];
            var select = audio.parentElement.previousElementSibling;
            if (audio.value && select.tagName == 'SELECT') {
                se[select.value] = audio.value;
                var p = audio.parentElement.nextElementSibling.nextElementSibling.children[0];
                pitch[select.value] = core.clamp(parseInt(p.value) || 100, 30, 300);
            }
        }
        uievent.values.animates[filename].se = se;
        uievent.values.animates[filename+':raw'].se = se;
        uievent.values.animates[filename].pitch = pitch;
        uievent.values.animates[filename+':raw'].pitch = pitch;
        fs.writeFile(filename, JSON.stringify(uievent.values.animates[filename+':raw']), 'utf-8', function (e, d) {
            if (e) alert('无法修改音效文件！'+e);
            else {
                alert('动画音效修改成功！别忘了在全塔属性中注册音效哦！');
            }
        })
    }

    // ------ 多选框 ------ //
    uievent.popCheckboxSet = function (value, comments, title, callback) {
        if (value == null) value = [];
        if (!(value instanceof Array)) {
            if (value == 0) value = [];
            else value = [value];
        }

        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'popCheckboxSet';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'block';
        uievent.elements.title.innerText = title;
        uievent.elements.select.style.display = 'none';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'none';
        uievent.elements.extraBody.style.display = 'block';
        uievent.elements.body.style.overflow = "auto";

        uievent.elements.yes.onclick = function () {
            var list = Array.from(document.getElementsByClassName('uieventCheckboxSet')).filter(function (one) {
                return one.checked;
            }).map(function (one) {
                var value = one.getAttribute('key');
                if (one.getAttribute('_type') == 'number') value = parseFloat(value);
                return value; 
            });
            uievent.close();
            if (callback) callback(list);
        }

        var keys=Array.from(comments.key)
        var prefixStrings=Array.from(comments.prefix)
        for (var index = 0; index < value.length; index++) {
            if (keys.indexOf(value[index])==-1) {
                prefixStrings.push(value[index]+': ')
                keys.push(value[index])
            }
        }
        var table = '<table style="width: 100%">';

        for (var index = 0; index < keys.length; index++) {
            var one = keys[index];
            if (index % 3 == 0) {
                table += '<tr>';
            }
            table += `<td class='popCheckboxItem'>${prefixStrings[index]}<input type="checkbox" _type="${typeof one}" key="${one}" class="uieventCheckboxSet" ${value.indexOf(one) >= 0? 'checked' : ''}/></td>`;
            if (index % 3 == 2) {
                table += '</tr>';
            }
        }
        if (keys.length % 3 != 0) table += '</tr>';
        table += '</table>';

        uievent.elements.extraBody.innerHTML = "<p>"+table+"</p>";
    }

    uievent.previewEditorMulti = function (mode, code) {
        if (mode == 'statusBar') return uievent.previewStatusBar(code);
    }

    // ------ 状态栏预览 ------ //
    uievent.previewStatusBar = function (code) {
        if (!/^function\s*\(\)\s*{/.test(code)) return;

        uievent.isOpen = true;
        uievent.elements.div.style.display = 'block';
        uievent.mode = 'previewStatusBar';
        uievent.elements.selectPoint.style.display = 'none';
        uievent.elements.yes.style.display = 'none';
        uievent.elements.title.innerText = '状态栏自绘预览';
        uievent.elements.select.style.display = 'inline';
        uievent.elements.selectFloor.style.display = 'none';
        uievent.elements.selectPointBox.style.display = 'none';
        uievent.elements.canvas.style.display = 'none';
        uievent.elements.extraBody.style.display = 'block';
        uievent.elements.body.style.overflow = "auto";

        uievent.elements.select.innerHTML = '<option value="horizontal">横屏</option><option value="vertical" selected>竖屏</option>'
        uievent.elements.select.onchange = uievent._previewStatusBar;

        // 计算在自绘状态栏中使用到的所有flag
        var flags = {};
        code.replace(/flag:([a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]+)/g, function (s0, s1) {
            flags[s1] = 0; return s0;
        });
        code.replace(/(core\.)?flags.([a-zA-Z0-9_]+)/g, function (s0, s1, s2) {
            if (!s1) flags[s2] = 0; return s0;
        });
        code.replace(/core\.(has|get|set|add|remove)Flag\('(.*?)'/g, function (s0, s1, s2) {
            flags[s2] = 0; return s0;
        });
        code.replace(/core\.(has|get|set|add|remove)Flag\("(.*?)"/g, function (s0, s1, s2) {
            flags[s2] = 0; return s0;
        });

        var html = '';
        html += "<p style='margin-left: 10px; margin-right: 10px'><b>注：此处预览效果与实际游戏内效果会有所出入，仅供参考，请以游戏内实际效果为准。</b></p>";
        html += "<p id='_previewStatusBarP' style='display:flex; flex-wrap: nowrap'><canvas id='_previewStatusBarCanvas' style='max-width: 100%'></canvas>";
        html += "<span style='margin: 10px' id='_previewStatusBarValue'>";
        html += "属性设置: <button onclick='editor.uievent._previewStatusBar()'>确定</button><br/>"
        html += "名称:<input value='阳光'> 生命:<input value='1000'> 上限:<input value='9999'> 攻击:<input value='10'> 防御:<input value='10'> 护盾:<input value='0'> ";
        html += "魔力:<input value='0'> 上限:<input value='-1'> 金币:<input value='0'> 经验:<input value='0'> 等级:<input value='1'> ";
        html += "<br/>当前道具ID（以逗号分隔)：<br/><textarea style='width:300px;height:40px'>yellowKey,yellowKey,blueKey</textarea>";
        html += "<br/>当前装备ID（以逗号分隔)：<br/><textarea style='width:300px;height:40px'>sword1,sheild1</textarea>";
        html += "<br/>当前变量值（JSON格式）：<br/><textarea style='width:300px;height:80px'>"+JSON.stringify(flags)+"</textarea>";
        html += "</span></p>"
        uievent.elements.extraBody.innerHTML = html;

        var inputs = document.querySelectorAll('#_previewStatusBarP input');
        for (var i = 0; i < inputs.length; ++i) inputs[i].style.width = '50px';

        uievent.values.code = code;
        uievent._previewStatusBar();
    }

    uievent._previewStatusBar = function () {
        var domStyle = core.clone(core.domStyle);
        var hero = core.clone(core.status.hero);
        core.status.hero.flags.__statistics__ = true;

        var statusCanvasCtx = core.dom.statusCanvasCtx;
        var enable = core.flags.statusCanvas;

        core.domStyle.showStatusBar = true;
        core.flags.statusCanvas = true;
        core.domStyle.isVertical = uievent.elements.select.value == 'vertical';

        var canvas = document.getElementById('_previewStatusBarCanvas');
        var canvas2 = document.createElement('canvas');

        document.getElementById('_previewStatusBarP').style.flexWrap = core.domStyle.isVertical ? 'wrap' : 'nowrap';

        var values = Array.from(document.getElementById('_previewStatusBarValue').children).filter(function (one) {
            return one.tagName == 'INPUT' || one.tagName == 'TEXTAREA';
        }).map(function (one) { return one.value; });
        core.status.hero.name = values[0];
        core.status.hero.hp = parseFloat(values[1]);
        core.status.hero.hpmax = parseFloat(values[2]);
        core.status.hero.atk = parseFloat(values[3]);
        core.status.hero.def = parseFloat(values[4]);
        core.status.hero.mdef = parseFloat(values[5]);
        core.status.hero.mana = parseFloat(values[6]);
        core.status.hero.manamax = parseFloat(values[7]);
        core.status.hero.money = parseFloat(values[8]);
        core.status.hero.exp = parseFloat(values[9]);
        core.status.hero.lv = parseFloat(values[10]);

        values[11].split(',').forEach(function (itemId) {
            if (!core.material.items[itemId]) return;
            var itemCls = core.material.items[itemId].cls;
            if (itemCls == 'items') return;        
            core.status.hero.items[itemCls][itemId] = (core.status.hero.items[itemCls][itemId]||0) + 1;
        });
        core.status.hero.equipment = values[12].split(',');
        try {
            var flags = JSON.parse(values[13]);
            for (var flag in flags) {
                core.status.hero.flags[flag] = flags[flag];
            }
        } catch (e) {}
        
        var ctx = canvas2.getContext('2d');

        if (core.domStyle.isVertical) {
            canvas.width = canvas2.width = core.__PIXELS__;
            canvas.height = canvas2.height = 32*(core.values.statusCanvasRowsOnMobile||3)+9;
        } else if (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.flags.extendToolbar) {
            canvas.width = canvas2.width = Math.round(core.__PIXELS__ * 0.31);
            canvas.height = canvas2.height = core.__PIXELS__ + 3 + 38;
        } else {
            canvas.width = canvas2.width = Math.round(core.__PIXELS__ * 0.31);
            canvas.height = canvas2.height = core.__PIXELS__;
        }

        core.dom.statusCanvasCtx = ctx;

        try {
            eval('(' + uievent.values.code + ')()');
        } catch (e) {
            console.error(e);
        }

        var toCtx = canvas.getContext('2d');
        core.fillRect(toCtx, 0, 0, canvas.width, canvas.height, 'black');
        core.drawImage(toCtx, canvas2, 0, 0);

        core.dom.statusCanvasCtx = statusCanvasCtx;
        core.domStyle = domStyle;
        core.flags.statusCanvas = enable;
        core.status.hero = hero;
        // window.hero = hero;
        window.flags = core.status.hero.flags;
    }

    editor.constructor.prototype.uievent=uievent;
}