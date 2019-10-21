/**
 * 运行时可编辑地图的扩展，By fux2（黄鸡）
 */

"use strict";

function dynamicMapEditor() {
	// 所有显示的ID
	this.displayIds = [
		'none', 'yellowWall', 'blueWall', 'whiteWall', 'yellowDoor', 'blueDoor', 'redDoor', 'star', 'lava', 'lavaNet',
		'yellowKey', 'blueKey', 'redKey', 'redJewel', 'blueJewel', 'greenJewel', 'yellowJewel',
		'redPotion', 'bluePotion', 'yellowPotion', 'greenPotion', 'pickaxe', 'bomb', 'centerFly',
		'cls:autotile', 'cls:enemys', 'cls:enemy48'
	];
	this.userParams = {
		hotKeys: {
			openToolBox: 219,
			save: 221,
			undo: 220
		}
	};
	this.items = [];
	this.userChanged = [];
	this.key2Function = {};
	this.dom = null;
	this.canvas = null;
	this.mapRecord = {};
	this.pageId = 0;
	this.pageMaxItems = 21;
	this.pageMax = 0;
	this.selectedIndex = 0;
	this.selectedItem = null;
	this._init();
}

// ------ init

dynamicMapEditor.prototype._init = function () {
	var hotkeys = this.userParams.hotKeys;
	this.key2Function[hotkeys.openToolBox] = this.openToolBox;
	this.key2Function[hotkeys.save] = this.applyCurrentChange;
	this.key2Function[hotkeys.undo] = this.undo;

	this.dom = document.createElement("canvas");
	this.dom.id = 'dynamicMapEditor';
	this.dom.style.display = 'none';
	this.dom.style.position = 'absolute';
	this.dom.style.left = '3px';
	this.dom.style.top = '3px';
	this.dom.style.zIndex = 99999;
	this.canvas = this.dom.getContext("2d");
	this.canvas.font = "12px Verdana";
	core.dom.gameGroup.appendChild(this.dom);

	this.initInfos();
	this.pageMax = Math.ceil(this.items.length / this.pageMaxItems);
	core.registerAction('onkeyUp', 'plugin_dme_keydown', this.onKeyDown.bind(this), 200);
	core.registerAction('onclick', 'plugin_dme_click', this.onMapClick.bind(this), 200);
	this.dom.addEventListener("click",this.onBoxClick.bind(this));
}

dynamicMapEditor.prototype.initInfos = function () {
	this.items = [];
	this.displayIds.forEach(function (v) {
		if (v.startsWith("cls:")) {
			var cls = v.substr(4);
			for (var id in core.maps.blocksInfo) {
				var u = core.maps.blocksInfo[id];
				if (u && u.cls == cls) {
					this.items.push(core.getBlockInfo(u.id));
				}
			}
		} else {
			this.items.push(core.getBlockInfo(v));
		}
	}, this);
}

// ------ bind actions

dynamicMapEditor.prototype.onKeyDown = function(e) {
	if(!core.isPlaying() || core.isReplaying() || core.status.lockControl) return false;
	var func = this.key2Function[e.keyCode];
	func && func.call(this);
	return false;
}

dynamicMapEditor.prototype.onMapClick = function(x, y) {
	if (!core.isPlaying() || core.isReplaying() || core.status.lockControl) return false;
	if (!this.isUsingTool || !this.selectedItem) return false;
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
	if (!core.isPlaying() || core.isReplaying() || !this.isUsingTool) return;
	var loc = this.getClickLoc(e), x = loc.x, y = loc.y;
	for(var i = 0; i < this.pageMaxItems; i++) {
		var rect = this.itemRect(i);
		if(x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
			this.onItemClick(i);
			return;
		}
	}
	// TODO: page up, page down,help
	if(y>=350) {
		if(x>=this.offsetX && x<=this.offsetX+60){
			this.changePage(-1);
		}else{
			this.changePage(1);
		}
	}
}

dynamicMapEditor.prototype.onItemClick = function(index) {
	var startIndex = this.pageId * this.pageMaxItems;
	var item = this.items[startIndex + index];
	if(!item) return;
	if(index == this.selectedIndex) {
		var enemy = core.material.enemys[item.id];
		if (!enemy) return;
		var nowData = [enemy.hp, enemy.atk, enemy.def, enemy.special].join(';');
		core.myprompt("请输入：血;攻;防;能力，以分号分隔", nowData, function (result) {
			if (result) {
				try {
					var finalData = result.split(';');
					if (finalData.length < 4) throw "";
					var hp = parseInt(finalData[0]) || 0;
					var atk = parseInt(finalData[1]) || 0;
					var def = parseInt(finalData[2]) || 0;
					var special = finalData[3].replace(/[\[\]]/g, "").split(',');
					if (special.length == 0) special = 0;
					else if (special.length == 1) special = special[0];
					dynamicMapEditor.addOperation('modify', item.id, hp, atk, def, special);
					core.drawTip('已更新' + enemy.name + '的数据');
					return;
				} catch (e) {}
			}
			core.drawTip('无效的输入数据');
		});
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
	this.dom.width = core.dom.statusCanvas.width;
	this.dom.style.height = core.dom.statusCanvas.style.height;
	this.dom.height = core.dom.statusCanvas.height;
	this.offsetX = this.dom.width / 2 - 60;
	this.refreshToolBox();
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
	} else if(type == 'modify') {
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
	} else { // {enemyId, originHp, originAtk, originDef, originSpecial}
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
	}
}

dynamicMapEditor.prototype.changePage = function(delta) {
	var newId = this.pageId + delta;
	if (newId < 0 || newId >= this.pageMax) return;
	this.pageId = newId;
	this.selectedItem = null;
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
		if (item.number == 0) continue;
		if (!item) break;
		var rect = this.itemRect(i);
		core.drawImage(this.canvas, item.image, 0, item.height * item.posY, 32, 32, rect.x + 4, rect.y, 32, 32);
		this.canvas.textAlign = 'center';
		if (item.name) core.fillText(this.canvas, item.name, rect.x + 20, rect.y + 44, null, '#FFFFFF', 40);
		this.canvas.textAlign = 'left';
		
		var damageString = core.enemys.getDamageString(item.id);
		core.fillBoldText(this.canvas, damageString.damage, rect.x + 5, rect.y + 31, damageString.color);

		var critical = core.enemys.nextCriticals(item.id, 1);
		critical = core.formatBigNumber((critical[0]||[])[0], true);
		if (critical == '???') critical = '?';
		core.fillBoldText(this.canvas, critical, rect.x+1, rect.y+21, '#FFFFFF');
	}

	if(this.pageId > 0) this.canvas.fillText('上一页', this.offsetX + 30, 380);
	if(this.pageId < this.pageMax-1) this.canvas.fillText('下一页',this.offsetX + 90, 380);
	if(this.selectedItem) {
		this.canvas.strokeStyle = '#FFFFFF';
		var rect = this.itemRect(this.selectedIndex);
		this.canvas.strokeRect(rect.x, rect.y, rect.w, rect.h);
	}
}

// ------ save

dynamicMapEditor.prototype.applyCurrentChange = function() {
	this.saveEnemys();
	this.saveFloors();
	this.mapRecord = {};
	core.drawTip('已将所有改动应用到文件，刷新后生效');
}

dynamicMapEditor.prototype.saveEnemys = function () {
	core.enemys.enemys = core.clone(core.material.enemys);
	var datastr = 'var enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n';
	var emap = {};
	var estr = JSON.stringify(core.enemys.enemys, function (k, v) {
		if (v.hp != null) {
			var id_ = ":" + k + ":";
			emap[id_] = JSON.stringify(v);
			return id_;
		} else return v
	}, '\t');
	for (var id_ in emap) {
		estr = estr.replace('"' + id_ + '"', emap[id_])
	}
	datastr += estr;
	fs.writeFile('project/enemys.js', core.encodeBase64(datastr), 'base64', function (e, d) {});
}

dynamicMapEditor.prototype.saveFloors = function () {
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
		tempJson = tempJson.replace('"' + v[1] + '"', '[\n' + dynamicMapEditor.formatMap(v[2], v[0] != 'map') + '\n]')
	});
	datastr = datastr.concat([tempJson]);
	datastr = datastr.join('');
	fs.writeFile(filename, core.encodeBase64(datastr), 'base64', function (e, d) {});
}

dynamicMapEditor.prototype.formapMap = function (mapArr, trySimplify) {
	if (!mapArr || JSON.stringify(mapArr) == JSON.stringify([])) return '';
	if (trySimplify) {
		//检查是否是全0二维数组
		var jsoncheck = JSON.stringify(mapArr).replace(/\D/g, '');
		if (jsoncheck == Array(jsoncheck.length + 1).join('0')) return '';
	}
	//把二维数组格式化
	var formatArrStr = '';
	var arr = JSON.stringify(mapArr).replace(/\s+/g, '').sdatastr
	var si = mapArr.length - 1, sk = mapArr[0].length - 1;datastr
	for (var i = 0; i <= si; i++) {
		var a = [];
		formatArrStr += '    [';
		if (i == 0 || i == si) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
		else a = arr[i].split(/\D+/);
		for (var k = 0; k <= sk; k++) {
			var num = parseInt(a[k]);
			formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == sk ? '' : ',');
		}
		formatArrStr += ']' + (i == si ? '' : ',\n');
	}
	return formatArrStr;
}

// ------ rewrite

dynamicMapEditor._resize_statusBar = core.control._resize_statusBar;
core.control._resize_statusBar = function (obj) {
	dynamicMapEditor._resize_statusBar.call(this,obj);
	dynamicMapEditor.refreshToolBox();
}

var dynamicMapEditor = new dynamicMapEditor();
