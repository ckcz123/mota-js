/**
 * 运行时可编辑地图的扩展，By fux2（黄鸡）
 */

"use strict";

function dynamicMapEditor() {
	this.userParams = {
		hotKeys: {
			openToolBox: 219,
			save: 221,
			undo: 220
		}
	};
	this.userChanged = [];
	this.key2Function = {};
	this.dom = null;
	this.canvas = null;
	this.database = [];
	this.mapRecord = {};
	this.enemy2id = {};
	this.pageId = 0;
	this.pageMaxItems = 21;
	this.pageMax = 0;
	this.selectedIndex = 0;
	this.selectedItem = null;
	this._init();
}

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
	core.dom.gameGroup.appendChild(this.dom);

	for(var k in core.material.enemys) {
		var index = core.material.icons.enemys[k];
		if(index !== undefined) {
			this.database[index] = k;
		}
	}
	this.database = this.database.filter(function(item){ return !!item; });
	for(var k in core.maps.blocksInfo) {
		var block = core.maps.blocksInfo[k];
		if(block.cls == 'enemys') {
			this.enemy2id[block.id] = k;
		}
	}
	this.pageMax = Math.ceil(this.database.length / this.pageMaxItems);
	core.actions.registerAction('onkeyUp', 'plugin_dme_keydown', this.onKeyDown.bind(this), 200);
	core.actions.registerAction('onclick', 'plugin_dme_click', this.onMapClick.bind(this), 200);
	this.dom.addEventListener("click",this.onBoxClick.bind(this));
}

dynamicMapEditor.prototype.openToolBox = function() {
	this.isUsingTool = !this.isUsingTool;
	this.selectedItem = null;
	this.selectedIndex = -1;
	this.refreshToolBox();
}

dynamicMapEditor.prototype.applyCurrentChange = function() {
	core.initStatus.maps = core.maps._initMaps();
	core.enemys.enemys = core.clone(core.material.enemys);
	var enemyString = 'var enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = '+JSON.stringify(core.enemys.enemys);
	fs.writeFile('project/enemys.js', enemyString, 'utf-8', function (e, d) {})
	for(var k in this.mapRecord) {
		if(this.mapRecord[k]) {
			var mapString = 'main.floors.' + k + '=' + JSON.stringify(core.floors[k]);
			fs.writeFile('project/floors/'+k+'.js', mapString, 'utf-8', function (e, d) { });
		}
	}
	this.mapRecord = {};
	core.drawTip('已将所有改动应用到文件，刷新后生效');
}

dynamicMapEditor.prototype.undo = function() {
	var operation = this.userChanged.pop();
	if(!operation) {
		core.drawTip('没有动作可以撤销');
		return;
	}
	var type = operation.type;
	if(type == 'put') {
		var blockId = operation.originId;
		var x = operation.x;
		var y = operation.y;
		var floorId = operation.floorId;
		var originData = core.floors[floorId];
		core.floors[floorId].map[y][x] = blockId;
		this.mapRecord[floorId] = true;
		core.removeBlock(x,y,floorId);
		core.drawTip('已撤销'+floorId+'在('+x+','+y+')的图块操作');
	}else{
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
		core.drawTip('已撤销对'+enemy.name+'的属性修改');
	}
}

dynamicMapEditor.prototype.onKeyDown = function(e) {
	if(core.status.lockControl) return false;
	var func = this.key2Function[e.keyCode];
	func && func.call(this);
	return false;
}

dynamicMapEditor.prototype.addOperation = function() {
	var operation = {};
	var type = arguments[0];
	operation.type = type;
	if(type == 'put') {
		operation.applyId = arguments[1];
		operation.x = arguments[2];
		operation.y = arguments[3];
		operation.floorId = arguments[4];
		operation.originId = core.floors[operation.floorId].map[operation.y][operation.x];
		core.floors[operation.floorId].map[operation.y][operation.x] = operation.applyId;
		this.mapRecord[operation.floorId] = true;
	}else if(type == 'modify') {
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

dynamicMapEditor.prototype.onMapClick = function(x,y) {
	if(core.status.lockControl) return false;
	if(!this.isUsingTool) return false;
	if(!this.selectedItem) return false;
	var blockId = Number(this.enemy2id[this.selectedItem.id]);
	this.addOperation('put',blockId,x,y,core.status.floorId);
	core.setBlock(blockId, x, y, core.status.floorId);
	return true;
}

dynamicMapEditor.prototype.onItemClick = function(index) {
	var startIndex = this.pageId * this.pageMaxItems;
	var item = this.database[startIndex + index];
	if(!item) return;
	if(index == this.selectedIndex) {
		var enemy = core.material.enemys[item];
		var nowData = [enemy.hp,enemy.atk,enemy.def,enemy.special].join(',');
		var result = prompt("输入血,攻,防,能力",nowData);
		if(result) {
			var finalData = result.split(/,/);
			var hp = Number(finalData[0]);
			var atk = Number(finalData[1]);
			var def = Number(finalData[2]);
			var special = eval(finalData[3]);
			this.addOperation('modify',item,hp,atk,def,special);
			core.drawTip('已更新'+enemy.name+'的数据');
			this.refreshToolBox();
		}else{
			core.drawTip('无效的输入数据');
		}
	}else{
		this.selectedIndex = index;
		this.selectedItem = core.material.enemys[item];
		this.refreshToolBox();
	}
}

dynamicMapEditor.prototype.onPageUp = function() {
	if(this.pageId>0) {
		this.pageId--;
		this.selectedItem = null;
		this.refreshToolBox();
	}
}

dynamicMapEditor.prototype.onPageDown = function() {
	if(this.pageId<this.pageMax-1) {
		this.pageId++;
		this.selectedItem = null;
		this.refreshToolBox();
	}
}

dynamicMapEditor.prototype.onBoxClick = function(e) {
	if(!this.isUsingTool) return;
	var x = e.layerX;
	var y = e.layerY;
	for(var i=0;i<this.pageMaxItems;i++) {
		var rect = this.itemRect(i);
		if(x>=rect.x && x<=rect.x+rect.w && y>=rect.y && y<=rect.y+rect.h) {
			this.onItemClick(i);
			return;
		}
	}
	if(y>=350) {
		if(x>=this.offsetX && x<=this.offsetX+60){
			this.onPageUp();
		}else{
			this.onPageDown();
		}
	}
}

dynamicMapEditor.prototype.resetCanvas = function() {
	this.canvas.font = "12px 宋体";
	this.canvas.textBaseline = 'alphabetic';
	this.canvas.mozImageSmoothingEnabled = false;
	this.canvas.webkitImageSmoothingEnabled = false;
	this.canvas.msImageSmoothingEnabled = false;
	this.canvas.imageSmoothingEnabled = false;
}

dynamicMapEditor.prototype.itemRect = function(index) {
	return {
		'x' : this.offsetX+(index%3)*40,
		'y' : Math.floor(index/3)*50,
		'w'	: 40,
		'h'	: 50
	};
}

dynamicMapEditor.prototype.fillTextWithOutline = function(text,x,y,style) {
	this.canvas.fillStyle = '#000000';
	this.canvas.fillText(text, x-1, y-1);
	this.canvas.fillText(text, x-1, y+1);
	this.canvas.fillText(text, x+1, y-1);
	this.canvas.fillText(text, x+1, y+1);
	this.canvas.fillStyle = style;
	this.canvas.fillText(text, x, y);
}

dynamicMapEditor.prototype.refreshToolBox = function() {
	this.dom.style.width = core.dom.statusCanvas.style.width;
	this.dom.width = core.dom.statusCanvas.width;
	this.dom.style.height = core.dom.statusCanvas.style.height;
	this.dom.height = core.dom.statusCanvas.height;
	this.offsetX = this.dom.width / 2 - 60;;
	if(this.isUsingTool) {
		this.canvas.fillStyle = '#000000';
		this.canvas.fillRect(0,0,this.dom.width,this.dom.height);
		if(!core.domStyle.isVertical) {
			this.resetCanvas();
			var source = core.material.images.enemys;
			var enemyCount = this.database.length;
			var startIndex = this.pageId * this.pageMaxItems;
			for(var i=0;i<this.pageMaxItems;i++) {
				var item = this.database[startIndex + i];
				if(!item) break;
				var name = core.material.enemys[item].name;
				var si = core.material.icons.enemys[item]*32;
				var rect = this.itemRect(i);
				this.canvas.drawImage(source,0,si,32,32,rect.x+4,rect.y,32,32);

				this.canvas.textAlign = 'center';
				this.canvas.fillText(name,rect.x+20,rect.y+44);

				var damageString = core.enemys.getDamageString(item, 0, 0, core.status.floorId);
				var damage = damageString.damage
				this.fillTextWithOutline(damage,rect.x+20,rect.y+32,damageString.color);
				
				this.canvas.textAlign = 'left';
				var critical = core.enemys.nextCriticals(item, 1, 0, 0, core.status.floorId);
				critical = core.formatBigNumber((critical[0]||[])[0], true);
				if (critical == '???') critical = '?';
				this.fillTextWithOutline(critical,rect.x+2,rect.y+12,'#FFFFFF');
			}
			this.canvas.textAlign = 'center';
			if(this.pageId>0) this.canvas.fillText('上一页',this.offsetX + 30,380);
			if(this.pageId<this.pageMax-1) this.canvas.fillText('下一页',this.offsetX + 90,380);
			if(this.selectedItem) {
				this.canvas.strokeStyle = '#FFFFFF';
				var rect = this.itemRect(this.selectedIndex);
				this.canvas.strokeRect(rect.x,rect.y,rect.w,rect.h);
			}
		}
	}
	this.dom.style.display = this.isUsingTool ? 'block' : 'none';
}

// re
dynamicMapEditor._resize_statusBar = core.control._resize_statusBar;
core.control._resize_statusBar = function (obj) {
	dynamicMapEditor._resize_statusBar.call(this,obj);
	dynamicMapEditor.refreshToolBox();
}

var dynamicMapEditor = new dynamicMapEditor();
