/**
 * 运行时可编辑地图的扩展，By fux2（黄鸡）
 */

"use strict";

function dynamicMapEditor() {
	// 所有显示的ID
	this.displayIds = [
		'none', 'yellowWall', 'blueWall', 'whiteWall', 'yellowDoor', 'blueDoor', 'redDoor', 'star', 'lava', 'lavaNet',
		'yellowKey', 'blueKey', 'redKey', 'redGem', 'blueGem', 'greenGem', 'yellowGem',
		'redPotion', 'bluePotion', 'yellowPotion', 'greenPotion', 'pickaxe', 'bomb', 'centerFly',
		'cls:autotile', 'cls:enemys', 'cls:enemy48'
	];
	this.items = [];
	this.userChanged = [];
	this.savedItems = [];
	this.dom = null;
	this.canvas = null;
	this.mapRecord = {};
	this.enemyModified = false;
	this.valueModified = false;
	this.pageId = 0;
	this.pageMaxItems = 21;
	this.pageMax = 0;
	this.selectedIndex = 0;
	this.selectedItem = null;
	this._init();
}

// ------ init

dynamicMapEditor.prototype._init = function () {
	this.dom = document.createElement("canvas");
	this.dom.id = 'dynamicMapEditor';
	this.dom.style.display = 'none';
	this.dom.style.position = 'absolute';
	this.dom.style.left = '3px';
	this.dom.style.top = '3px';
	this.dom.style.zIndex = 99999;
	this.canvas = this.dom.getContext("2d");
	core.dom.gameGroup.appendChild(this.dom);

	this.initInfos();
	this.pageMax = Math.ceil(this.items.length / this.pageMaxItems);
	core.registerAction('onkeyUp', 'plugin_dme_keydown', this.onKeyUp.bind(this), 200);
	core.registerAction('onclick', 'plugin_dme_click', this.onMapClick.bind(this), 200);
	this.dom.addEventListener("click",this.onBoxClick.bind(this));
	this.showInitHelp();
}

dynamicMapEditor.prototype.initInfos = function () {
	this.items = [];
	var ids = {};
	this.displayIds.forEach(function (v) {
		if (v.startsWith("cls:")) {
			var cls = v.substr(4);
			for (var id in core.maps.blocksInfo) {
				var u = core.maps.blocksInfo[id];
				if (u && u.cls == cls) {
					if (ids[u.id]) continue;
					this.items.push(core.getBlockInfo(u.id));
					ids[u.id] = true;
				}
			}
		} else if (v == 'none') {
			this.items.push({"number": 0, "id": "none", "name": "清除块"});
		} else {
			this.items.push(core.getBlockInfo(v));
		}
	}, this);
	this.items = this.items.filter(function (v) { return v && v.id && v.number >= 0; });
	this.savedItems = core.getLocalStorage('_dynamicMapEditor_savedItems', []);
}

// ------ bind actions

dynamicMapEditor.prototype.isValid = function () {
	return main.mode == 'play' && core.isPlaying() && !core.isReplaying() && !core.status.lockControl;
}

dynamicMapEditor.prototype.onKeyUp = function(e) {
	if (!this.isValid()) return false;
	if (e.keyCode == 219) {
		this.openToolBox();
		return true;
	}
	if (!this.isUsingTool) return false;

	if (e.keyCode == 220) {
		this.undo();
		return true;
	} else if (e.keyCode == 221) {
		this.applyCurrentChange();
		return true;
	} else if (e.keyCode >= 48 && e.keyCode <= 57) {
		// 0-9
		if (e.altKey) {
			this.savedItem(e.keyCode - 48);
		} else {
			this.loadItem(e.keyCode - 48);
		}
		return true;
	}
	return false;
}

dynamicMapEditor.prototype.onMapClick = function(x, y) {
	if (!this.isValid()) return false;
	if (!this.isUsingTool || !this.selectedItem) return false;
	x += parseInt(core.bigmap.offsetX / 32);
	y += parseInt(core.bigmap.offsetY / 32);
	var number = this.selectedItem.number;
	this.addOperation('put', number, x, y, core.status.floorId);
	return true;
}

dynamicMapEditor.prototype.getClickLoc = function (e) {
	return {
		x: (e.clientX - core.dom.gameGroup.offsetLeft - 3) / core.domStyle.scale,
		y: (e.clientY - core.dom.gameGroup.offsetTop - 3) / core.domStyle.scale,
	};
}

dynamicMapEditor.prototype.onBoxClick = function (e) {
	if (!this.isValid() || !this.isUsingTool) return false;
	var loc = this.getClickLoc(e), x = loc.x, y = loc.y;
	for(var i = 0; i < this.pageMaxItems; i++) {
		var rect = this.itemRect(i);
		if(x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
			this.onItemClick(i);
			return;
		}
	}
	if(y>=350 && y <= 370) {
		if (x >= this.offsetX && x <= this.offsetX + 40) {
			this.changePage(-1);
		} else if (x >= this.offsetX + 40 && x <= this.offsetX + 80) {
			this.showHelp(true);
		} else if (x >= this.offsetX + 80 && x <= this.offsetX + 120) {
			this.changePage(1);
		}
	}
}

dynamicMapEditor.prototype.onItemClick = function(index) {
	var startIndex = this.pageId * this.pageMaxItems;
	var item = this.items[startIndex + index];
	if(!item) return;
	if(index == this.selectedIndex) {
		if (core.material.enemys[item.id]) {
			var enemy = core.material.enemys[item.id];
			var nowData = [enemy.hp, enemy.atk, enemy.def, enemy.special].join(';');
			core.myprompt("请输入新怪物属性\n血;攻;防;能力，以分号分隔", nowData, function (result) {
				if (result) {
					try {
						var finalData = result.split(';');
						if (finalData.length < 4) throw "";
						var hp = parseInt(finalData[0]) || 0;
						var atk = parseInt(finalData[1]) || 0;
						var def = parseInt(finalData[2]) || 0;
						var special = finalData[3].replace(/[\[\]]/g, "")
							.split(',').map(function (x) { return parseInt(x); });
						if (special.length == 0) special = 0;
						else if (special.length == 1) special = special[0];
						dynamicMapEditor.addOperation('modify', item.id, hp, atk, def, special);
						core.drawTip('已更新' + enemy.name + '的数据');
						return;
					} catch (e) {}
				}
				core.drawTip('无效的输入数据');
			});
			return;
		}
		if (core.values[item.id] != null) {
			var nowData = core.values[item.id];
			core.myprompt("请输入新" + (item.name || "") + "数值：", core.values[item.id], function (result) {
				if (result) {
					dynamicMapEditor.addOperation('value', item.id, parseInt(result) || 0, item.name || "");
					core.drawTip('已更新' + (item.name || "") + "的数值");
					return;
				}
				core.drawTip('无效的输入数据');
			});
			return;
		}
	} else {
		this.selectedIndex = index;
		this.selectedItem = item;
		this.refreshToolBox();
	}
}

// ------ methods

dynamicMapEditor.prototype.openToolBox = function() {
	if (!this.isUsingTool && core.domStyle.isVertical) {
		core.drawTip("竖屏模式下暂不支持此功能。");
		return;
	}
	this.isUsingTool = !this.isUsingTool;
	this.selectedItem = null;
	this.selectedIndex = -1;
	this.dom.style.display = this.isUsingTool ? 'block' : 'none';
	this.dom.style.width = core.dom.statusCanvas.style.width;
	this.dom.width = core.dom.statusCanvas.width / core.domStyle.ratio;
	this.dom.style.height = core.dom.statusCanvas.style.height;
	this.dom.height = core.dom.statusCanvas.height / core.domStyle.ratio;
	this.offsetX = this.dom.width / 2 - 60;
	this.refreshToolBox();
	if (this.isUsingTool) this.showHelp();
}

dynamicMapEditor.prototype.addOperation = function() {
	var operation = {};
	var type = arguments[0];
	operation.type = type;
	if (type == 'put') {
		operation.number = arguments[1];
		operation.x = arguments[2];
		operation.y = arguments[3];
		operation.floorId = arguments[4];
		operation.originNumber = core.floors[operation.floorId].map[operation.y][operation.x];
		core.floors[operation.floorId].map[operation.y][operation.x] = operation.number;
		core.setBlock(operation.number, operation.x, operation.y, operation.floorId);
		this.mapRecord[operation.floorId] = true;
	} else if (type == 'modify') {
		operation.enemyId = arguments[1];
		operation.hp = arguments[2];
		operation.atk = arguments[3];
		operation.def = arguments[4];
		operation.special = arguments[5];
		var enemy = core.material.enemys[operation.enemyId];
		operation.originHp = enemy.hp;
		operation.originAtk = enemy.atk;
		operation.originDef = enemy.def;
		operation.originSpecial = enemy.special;
		enemy.hp = operation.hp;
		enemy.atk = operation.atk;
		enemy.def = operation.def;
		enemy.special = operation.special;
		this.enemyModified = true;
	} else if (type == 'value') {
		operation.id = arguments[1];
		operation.value = arguments[2];
		operation.name = arguments[3];
		operation.originValue = core.values[operation.id];
		core.values[operation.id] = operation.value;
		this.valueModified = true;
	}
	this.userChanged.push(operation);
}

dynamicMapEditor.prototype.undo = function() {
	var operation = this.userChanged.pop();
	if(!operation) {
		core.drawTip('没有动作可以撤销');
		return;
	}
	var type = operation.type;
	if(type == 'put') { // {originNumber, x, y, floorId}
		var originNumber = operation.originNumber;
		var x = operation.x;
		var y = operation.y;
		var floorId = operation.floorId;
		core.floors[floorId].map[y][x] = originNumber;
		core.setBlock(originNumber, x, y, floorId);
		this.mapRecord[floorId] = true;
		core.drawTip('已撤销' + floorId + '在(' + x + ',' + y + ')的图块操作');
	} else if (type == 'modify') { // {enemyId, originHp, originAtk, originDef, originSpecial}
		var enemyId = operation.enemyId;
		var hp = operation.originHp;
		var atk = operation.originAtk;
		var def = operation.originDef;
		var special = operation.originSpecial;
		var enemy = core.material.enemys[enemyId];
		enemy.hp = hp;
		enemy.atk = atk;
		enemy.def = def;
		enemy.special = special;
		core.drawTip('已撤销对' + enemy.name + '的属性修改');
		this.enemyModified = true;
	} else if (type == 'value') { // {id, value, originValue}
		var id = operation.id;
		var value = operation.originValue;
		core.values[operation.id] = operation.originValue;
		core.drawTip('已撤销对' + operation.name + "数值的修改");
		this.valueModified = true;
	}
}

dynamicMapEditor.prototype.changePage = function(delta) {
	var newId = this.pageId + delta;
	if (newId < 0 || newId >= this.pageMax) return;
	this.pageId = newId;
	this.selectedItem = null;
	this.selectedIndex = -1;
	this.refreshToolBox();
}

dynamicMapEditor.prototype.savedItem = function (number) {
	if (!this.isUsingTool || this.selectedItem < 0) return;
	this.savedItems[number] = [this.pageId, this.selectedIndex];
	core.setLocalStorage('_dynamicMapEditor_savedItems', this.savedItems);
	core.drawTip("已保存此图块");
}

dynamicMapEditor.prototype.loadItem = function (number) {
	if (!this.isUsingTool) return;
	var u = this.savedItems[number];
	if (!u) return core.drawTip("没有保存的图块！");
	this.pageId = u[0];
	this.selectedIndex = u[1];
	this.selectedItem = this.items[this.pageId * this.pageMaxItems + this.selectedIndex];
	this.refreshToolBox();
}

// ------ draw

dynamicMapEditor.prototype.itemRect = function(index) {
	return {
		'x' : this.offsetX + (index % 3) * 40,
		'y' : Math.floor(index / 3) * 50,
		'w'	: 40,
		'h'	: 50
	};
}

dynamicMapEditor.prototype.refreshToolBox = function() {
	if (!this.isUsingTool) return;
	core.fillRect(this.canvas, 0, 0, this.dom.width, this.dom.height, '#000000');
	var startIndex = this.pageId * this.pageMaxItems;
	for (var i = 0; i < this.pageMaxItems; ++i) {
		var item = this.items[startIndex + i];
		if (!item) break;
		var rect = this.itemRect(i);
		if (item.image) core.drawImage(this.canvas, item.image, 0, item.height * item.posY, 32, 32, rect.x + 4, rect.y, 32, 32);
		if (item.name) {
			this.canvas.textAlign = 'center';
			core.fillText(this.canvas, item.name, rect.x + 20, rect.y + 44, '#FFFFFF', '11px Verdana', 40);
		}
		if (core.material.enemys[item.id]) {
			this.canvas.textAlign = 'left';
			var damageString = core.enemys.getDamageString(item.id);
			core.fillBoldText(this.canvas, damageString.damage, rect.x + 5, rect.y + 31, damageString.color, null, '11px Verdana');
			var critical = core.enemys.nextCriticals(item.id, 1);
			critical = core.formatBigNumber((critical[0]||[])[0], true);
			if (critical == '???') critical = '?';
			core.fillBoldText(this.canvas, critical, rect.x+5, rect.y+21, '#FFFFFF');
		}
	}

	this.canvas.textAlign = 'center';
	this.canvas.fillStyle = '#FFFFFF';
	if(this.pageId > 0) core.fillText(this.canvas, '上一页', this.offsetX + 20, 365, '#FFFFFF', '11px Verdana');
	if(this.pageId < this.pageMax-1) core.fillText(this.canvas, '下一页',this.offsetX + 100, 365, '#FFFFFF', '11px Verdana');
	core.fillText(this.canvas, '帮助', this.offsetX + 60, 365, '#FFFFFF');
	var text1 = core.formatBigNumber(core.getRealStatus('hp'), true) + "/" +
		core.formatBigNumber(core.getRealStatus('atk'), true) + "/" +
		core.formatBigNumber(core.getRealStatus("def"), true) + "/" +
		core.formatBigNumber(core.getRealStatus("mdef"), true);
	core.fillText(this.canvas, text1, this.offsetX + 60, 380, '#FF7F00', '11px Verdana', 120);
	var text2 = core.formatBigNumber(core.getRealStatus('money', true)) + "/" +
		core.formatBigNumber(core.getRealStatus('exp'), true) + "/" +
		core.itemCount('yellowKey') + '/' + core.itemCount('blueKey') + '/' +
		core.itemCount('redKey');
	core.fillText(this.canvas, text2, this.offsetX + 60, 395, '#FF7F00', '11px Verdana', 120);
	var text3 = core.itemCount('pickaxe') + '/' + core.itemCount('bomb') + '/' +
		core.itemCount('centerFly');
	if (core.hasFlag('poison')) text3 += "/毒";
	if (core.hasFlag('weak')) text3 += "/衰";
	if (core.hasFlag('curse')) text3 += "/咒";
	core.fillText(this.canvas, text3, this.offsetX + 60, 410, '#FF7F00', '11px Verdana', 120);
	if(this.selectedItem) {
		var rect = this.itemRect(this.selectedIndex);
		core.strokeRect(this.canvas, rect.x, rect.y, rect.w, rect.h, '#FF7F00', 4);
	}
}

dynamicMapEditor.prototype.showInitHelp = function () {
	if (main.mode != 'play' || core.getLocalStorage('_dynamicMapEditor_init')) return;
	var text = "新拓展：运行时动态编辑地图！\n\n在此状态下你可以一边游戏一边编辑地图或者修改数据。\n\n";
	text += "进游戏后按 [ 键可以激活，快来尝试吧！\n\n";
	text += "点取消后将不再提示本页面。";
	core.myconfirm(text, null, function () {
		core.setLocalStorage('_dynamicMapEditor_init', true);
		if (core.firstData.name != 'template') {
			localStorage.removeItem('template__dynamicMapEditor_init');
			localStorage.removeItem('template__dynamicMapEditor_help');
		}
	});
}

dynamicMapEditor.prototype.showHelp = function (fromButton) {
	if (main.mode != 'play' || (!fromButton && core.getLocalStorage('_dynamicMapEditor_help'))) return;
	var text = "欢迎使用黄鸡编写的运行时编辑拓展！你可以一边游戏一边编辑地图或者修改数据。\n\n";
	text += "基本操作：\n - 点击图块再点地图可以放置；\n - 双击图块可以编辑数据；\n";
	text += " - [ 键将开关此模式；\n - ] 键将会把改动保存到文件；\n - \\ 键将撤销上步操作。\n";
	text +=	" - Alt+0~9 保存当前图块 \n - 0~9 读取当前图块\n";
	text += "最下面三行数据分别是：\n"
	text += "血攻防护盾；金经黄蓝红；破炸飞和debuff。";
	if (!fromButton) text += "\n\n点取消将不再提示本页面。";
	core.myconfirm(text, null, function () {
		if (!fromButton) core.setLocalStorage("_dynamicMapEditor_help", true);
	})
}

// ------ save

dynamicMapEditor.prototype.applyCurrentChange = function() {
	this.saveEnemys();
	this.saveValues();
	this.saveFloors();
	this.enemyModified = false;
	this.valueModified = false;
	this.mapRecord = {};
	core.drawTip('已将所有改动应用到文件，记得刷新编辑器哦');
}

dynamicMapEditor.prototype.saveEnemys = function () {
	if (!this.enemyModified) return;
	core.enemys.enemys = core.clone(core.material.enemys);
	var datastr = 'var enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n';
	var emap = {};
	var estr = JSON.stringify(core.enemys.enemys, function (k, v) {
		var t = core.clone(v);
		if (t.hp != null) {
			delete t.id;
			var id_ = ":" + k + ":";
			emap[id_] = JSON.stringify(t);
			return id_;
		} else return t;
	}, '\t');
	for (var id_ in emap) {
		estr = estr.replace('"' + id_ + '"', emap[id_])
	}
	datastr += estr;
	fs.writeFile('project/enemys.js', core.encodeBase64(datastr), 'base64', function (e, d) {});
}

dynamicMapEditor.prototype.saveValues = function () {
	if (!this.valueModified) return;
	core.data.values = data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.values = core.clone(core.values);
	var datastr = 'var data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = \n' +
		JSON.stringify(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d, null, '\t');
	fs.writeFile('project/data.js', core.encodeBase64(datastr), 'base64', function (e, d) {});
}

dynamicMapEditor.prototype.saveFloors = function () {
	if (Object.keys(this.mapRecord).length == 0) return;
	core.initStatus.maps = core.maps._initMaps();
	for (var floorId in this.mapRecord) {
		if (this.mapRecord[floorId]) {
			this.saveFloor(floorId);
		}
	}
}

dynamicMapEditor.prototype.saveFloor = function (floorId) {
	var floorData = core.floors[floorId];
	var filename = 'project/floors/' + floorId + '.js';
	var datastr = ['main.floors.', floorId, '=\n'];

	var tempJsonObj = core.clone(floorData);
	var tempMap = [['map', ':map:'], ['bgmap', ':bgmap:'], ['fgmap', ':fgmap:']];
	tempMap.forEach(function (v) {
		v[2] = tempJsonObj[v[0]];
		tempJsonObj[v[0]] = v[1];
	});
	var tempJson = JSON.stringify(tempJsonObj, null, 4);
	tempMap.forEach(function (v) {
		tempJson = tempJson.replace('"' + v[1] + '"', '[\n' + this.formatMap(v[2], v[0] != 'map') + '\n]')
	}, this);
	datastr = datastr.concat([tempJson]);
	datastr = datastr.join('');
	fs.writeFile(filename, core.encodeBase64(datastr), 'base64', function (e, d) {});
}

dynamicMapEditor.prototype.formatMap = function (mapArr, trySimplify) {
	if (!mapArr || JSON.stringify(mapArr) == JSON.stringify([])) return '';
	if (trySimplify) {
		//检查是否是全0二维数组
		var jsoncheck = JSON.stringify(mapArr).replace(/\D/g, '');
		if (jsoncheck == Array(jsoncheck.length + 1).join('0')) return '';
	}
	//把二维数组格式化
	var formatArrStr = '';
	var si = mapArr.length - 1, sk = mapArr[0].length - 1;
	for (var i = 0; i <= si; i++) {
		formatArrStr += '    [';
		for (var k = 0; k <= sk; k++) {
			var num = parseInt(mapArr[i][k]);
			formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == sk ? '' : ',');
		}
		formatArrStr += ']' + (i == si ? '' : ',\n');
	}
	return formatArrStr;
}

// ------ rewrite

var dynamicMapEditor = new dynamicMapEditor();

dynamicMapEditor._resize_statusBar = core.control._resize_statusBar;
core.control._resize_statusBar = function (obj) {
	dynamicMapEditor._resize_statusBar.call(this,obj);
	dynamicMapEditor.refreshToolBox();
}

dynamicMapEditor.updateStatusBar = core.control.updateStatusBar;
core.control.updateStatusBar = function () {
	dynamicMapEditor.refreshToolBox();
	dynamicMapEditor.updateStatusBar.apply(core.control, Array.prototype.slice.call(arguments));
}