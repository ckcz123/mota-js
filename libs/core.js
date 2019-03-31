/**
 * 初始化 start
 */

function core() {
	this.dom = {};
	this.canvas = {};
	this.images = {};
	this.firstData = {};
	this.material = {
		'images': {
			'25': {},
			'32': {},
			'64': {}
		},
		'sounds': {
			'mp3': {}
		},
		'items': {},
		'enemys': {},
		'maps': {},
		'icons': {},
		'events': {}
	}
	this.timeout = {
		'loadSoundTimeout': null,
		'getItemTipTimeout': null
	}
	this.interval = {
		'twoAnimate': null,
		'fourAnimate': null,
		'changeAnimate': null,
		'heroMoveTriggerInterval': null,
		'heroMoveInterval': null,
		'heroAutoMoveScan': null,
		'getItemAnimate': [],
		'getItemTipAnimate': null
	}
	this.status = {
		'hero': {
			'id': '',
			'name': '',
			'level': 0,
			'hp': 0,
			'atk': 0,
			'def': 0,
			'gold': 0,
			'exp': 0,
		},
		'played': false,
		'soundStatus': true,
		'heroMoving': false,
		'heroStop': true,
		'lockControl': false,
		'keyBoardLock': false,
		'mouseLock': false,
		'autoHeroMove': false,
		'automaticRouting': false,
		'automaticRoued': false,
		'screenMode': 'adaptive'
	}
	this.temp = {
		'itemList': [],
		'thisMap': null,
		'playedSound': null,
		'playedBgm': null,
		'twoAnimateObjs': [],
		'fourAnimateObjs': [],
		'heroLoc': {'direction': 'down', 'x': 0, 'y': 1},
		'autoStep': 0,
		'movedStep': 0,
		'destStep': 0,
		'automaticRoutingTemp': {'destX': 0, 'destY': 0, 'moveStep': []}
	}
}

core.prototype.init = function(dom, canvas, images, sounds, firstData, coreData) {
	core.dom = dom;
	core.canvas = canvas;
	core.images = images;
	core.sounds = sounds;
	core.firstData = firstData;
	for(var key in coreData) {
		core[key] = coreData[key];
	}
	core.dom.versionLabel.innerHTML = firstData.version;
	core.material.items = core.items.getItems();
	core.material.maps = core.maps.getMaps();
	core.material.icons = core.icons.getIcons();
	core.material.events = core.events.getEvents();
	core.loader(function() {
		core.playBgm('bgm', 'mp3');
		if(core.soundPlayed('bgm', 'mp3')) {
			core.disabledSound();
		}
		else {
			core.enabledSound();
		}
		core.showStartAnimate(function() {
			
		});
	});
}

core.prototype.showStartAnimate = function(callback) {
	var opacityVal = 1;
	var startAnimate = window.setInterval(function() {
		opacityVal -= 0.03;
		if(opacityVal < 0) {
			clearInterval(startAnimate);
			core.dom.startTop.style.display = 'none';
			core.dom.startButtonGroup.style.display = 'block';
			callback();
		}
		core.dom.startTop.style.opacity = opacityVal;
	}, 30);
}

core.prototype.hideStartAnimate = function(callback) {
	var opacityVal = 1;
	var startAnimate = window.setInterval(function() {
		opacityVal -= 0.03;
		if(opacityVal < 0) {
			clearInterval(startAnimate);
			core.dom.startPanel.style.display = 'none';
			callback();
		}
		core.dom.startPanel.style.opacity = opacityVal;
	}, 30);
}

core.prototype.setStartProgressVal = function(val) {
	core.dom.startTopProgress.style.width = val + '%';
}

core.prototype.setStartLoadTipText = function(text) {
	core.dom.startTopLoadTips.innerHTML = text;
}

core.prototype.loader = function(callback) {
	var loadedImageNum = 0, allImageNum = 0, loadSoundNum = 0, allSoundNum = 0;
	for(var key in core.images) {
		allImageNum += core.images[key].length;
	}
	for(var key in core.sounds) {
		allSoundNum += core.sounds[key].length;
	}
	for(var key in core.images) {
		for(var i = 0;i < core.images[key].length;i++) {
			core.loadImage(core.images[key][i] + '-' + key + 'x' + key, key, function(imgName, imgSize, image) {
				imgName = imgName.split('-');
				imgName = imgName[0];
				core.material.images[imgSize][imgName] = image;
				loadedImageNum++;
				core.setStartLoadTipText(imgName + ' 加载完毕...');
				core.setStartProgressVal(loadedImageNum * (100 / allImageNum));
				if(loadedImageNum == allImageNum) {
					core.setStartLoadTipText('图片资源加载完毕，加载音频中...');
					core.setStartProgressVal(0);
					for(var key in core.sounds) {
						for(var i = 0;i < core.sounds[key].length;i++) {
							core.loadSound(core.sounds[key][i], key, function(soundName, soundType, sound) {
								clearTimeout(core.timeout.loadSoundTimeout);
								soundName = soundName.split('-');
								soundName = soundName[0];
								core.material.sounds[soundType][soundName] = sound;
								loadSoundNum++;
								core.setStartLoadTipText(soundName + ' 加载完毕...');
								core.setStartProgressVal(loadSoundNum * (100 / allSoundNum));
								if(loadSoundNum == allSoundNum) {
									core.setStartLoadTipText('音乐资源加载完毕');
									callback();
								}
							});
						}
					}
				}
			});
		}
	}
	console.log(core.material);
}

core.prototype.loadImage = function(imgName, imgSize, callback) {
	core.setStartLoadTipText('加载 ' + imgName + ' 中...');
	var image = new Image();
	image.src = 'images/' + imgName + '.png';
	if(image.complete) {
		callback(imgName, imgSize, image);
		return;
	}
	image.onload = function() {
		callback(imgName, imgSize, image);
	}
}

core.prototype.loadSound = function(soundName, soundType, callback) {
	soundName = soundName.split('-');
	core.setStartLoadTipText('加载 ' + soundName[0] + ' 中...');
	var sound = new Audio('audio');
	sound.src = 'sounds/' + soundName[0] + '.' + soundType;
	if(soundName[1] == 'loop') {
		sound.loop = 'loop';
	}
	if(!('oncanplaythrough' in document ? true : false)) {
		callback(soundName[0], soundType, sound);
		return;
	}
	sound.oncanplaythrough = function() {
		callback(soundName[0], soundType, sound);
	}
	core.timeout.loadSoundTimeout = window.setTimeout(function() {
		callback(soundName[0], soundType, sound);
	}, 15000);
}

core.prototype.playGame = function() {
	if(core.status.played) {
		return;
	}
	core.status.played = true;
	console.log('开始游戏');
	core.setFirstItem();
	core.setFloorName(core.firstData.floor);
	core.hideStartAnimate(function() {
		core.drawMap(core.firstData.floor, function() {
			core.playSound('floor', 'mp3');
			core.hide(core.dom.floorMsgGroup, 10);
			core.setHeroLoc('direction', core.firstData.heroLoc.direction);
			core.setHeroLoc('x', core.firstData.heroLoc.x);
			core.setHeroLoc('y', core.firstData.heroLoc.y);
			core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
			core.setHeroMoveTriggerInterval();
		});
	});
}

core.prototype.loadGame = function() {
	console.log('加载游戏');
}

core.prototype.exitGame = function() {
	console.log('关于纪元');
}

core.prototype.keyDown = function(e) {
	console.log(e.keyCode);
	if(!core.status.played || core.status.keyBoardLock) {
		return;
	}
	if(core.status.automaticRouting || core.status.automaticRoued) {
		core.stopAutomaticRoute();
		return;
	}
	switch(e.keyCode) {
		case 37:
			core.moveHero('left');
		break;
		case 38:
			e.preventDefault();
			core.moveHero('up');
		break;
		case 39:
			core.moveHero('right');
		break;
		case 40:
			e.preventDefault();
			core.moveHero('down');
		break;
		case 81:
			core.setAutoHeroMove([
				{'direction': 'right', 'step': 3},
				{'direction': 'up', 'step': 1},
				{'direction': 'down', 'step': 1},
				{'direction': 'left', 'step': 2},
				{'direction': 'up', 'step': 2}
			]);
		break;
	}
}

core.prototype.keyUp = function(e) {
	if(!core.status.played || e.keyCode == 81) {
		return;
	}
	core.unLockKeyBoard();
	core.stopHero();
}

core.prototype.playGameBtnClick = function() {
	core.playGame();
}

core.prototype.musicBtnClick = function() {
	core.changeSoundStatus();
}

/**
 * 初始化 end
 */

/**
 * 寻路代码 start
 */

core.prototype.clearAutomaticRouteNode = function(x, y) {
	core.canvas.data.clearRect(x * 32 + 5, y * 32 + 5, 27, 27);
}

core.prototype.stopAutomaticRoute = function() {
	if(!core.status.played) {
		return;
	}
	core.stopAutoHeroMove();
	core.status.automaticRouting = false;
	core.status.automaticRoued = false;
	core.temp.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
	core.canvas.data.clearRect(0, 0, 352, 352);
}

core.prototype.setAutomaticRoute = function(destX, destY) {
	if(!core.status.played || core.status.mouseLock) {
		return;
	}
	else if(core.status.automaticRouting) {
		core.stopAutomaticRoute();
		return;
	}
	if(core.temp.automaticRoutingTemp.moveStep.length != 0 && core.temp.automaticRoutingTemp.destX == destX && core.temp.automaticRoutingTemp.destY == destY) {
		core.status.automaticRouting = true;
		core.setAutoHeroMove(core.temp.automaticRoutingTemp.moveStep);
		core.temp.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
		return;
	}
	var step = 0;
	var tempStep = null;
	var moveStep;
	core.temp.automaticRoutingTemp = {'destX': 0, 'destY': 0, 'moveStep': []};
	if(!(moveStep = core.automaticRoute(destX, destY))) {
		core.canvas.data.clearRect(0, 0, 352, 352);
		return false;
	}
	core.temp.automaticRoutingTemp.destX = destX;
	core.temp.automaticRoutingTemp.destY = destY;
	core.canvas.data.save();
	core.canvas.data.clearRect(0, 0, 352, 352);
	core.canvas.data.fillStyle = '#bfbfbf';
	core.canvas.data.strokeStyle = '#bfbfbf';
	core.canvas.data.lineWidth = 8;
	for(var m = 0;m < moveStep.length;m++) {
		if(tempStep == null) {
			step++;
			tempStep = moveStep[m].direction;
		}
		else if(tempStep == moveStep[m].direction) {
			step++;
		}
		else {
			core.temp.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
			step = 1;
			tempStep = moveStep[m].direction;
		}
		if(m == moveStep.length - 1) {
			core.temp.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
			core.canvas.data.fillRect(moveStep[m].x * 32 + 10, moveStep[m].y * 32 + 10, 12, 12);
		}
		else {
			core.canvas.data.beginPath();
			if(core.isset(moveStep[m + 1]) && tempStep != moveStep[m + 1].direction) {
				if(tempStep == 'up' && moveStep[m + 1].direction == 'left' || tempStep == 'right' && moveStep[m + 1].direction == 'down') {
					core.canvas.data.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
				}
				else if(tempStep == 'up' && moveStep[m + 1].direction == 'right' || tempStep == 'left' && moveStep[m + 1].direction == 'down') {
					core.canvas.data.moveTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
				}
				else if(tempStep == 'left' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'right') {
					core.canvas.data.moveTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
				}
				else if(tempStep == 'right' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'left') {
					core.canvas.data.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
				}
				core.canvas.data.stroke();
				continue;
			}
			switch(tempStep) {
				case 'up':
				case 'down':
					core.canvas.data.beginPath();
					core.canvas.data.moveTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
					core.canvas.data.stroke();
				break;
				case 'left':
				case 'right':
					core.canvas.data.beginPath();
					core.canvas.data.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
					core.canvas.data.lineTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
					core.canvas.data.stroke();
				break;
			}
		}
	}
	console.log(core.temp.automaticRoutingTemp);
	core.canvas.data.restore();
	core.status.automaticRoued = true;
}

core.prototype.automaticRoute = function(destX, destY) {
	var startX = core.getHeroLoc('x');
	var startY = core.getHeroLoc('y');
	var nowX = startX;
	var nowY = startY;
	var scanItem = {'x': 0, 'y': 0};
	var scan = {'up': {'x': 0, 'y': -1}, 'left': {'x': -1, 'y': 0}, 'down': {'x': 0, 'y': 1}, 'right': {'x': 1, 'y': 0}};
	var min = {'x': 0, 'y': 0, 'step': 9999};
	var F = 0, G = 0, H = 0;
	var openList = [];
	var closeList = [{'x': nowX, 'y': nowY}];
	var tempList = [];
	for(var i = 0;i < 121;i++) {
		scanLoop:
		for(var direction in scan) {
			scanItem.x = nowX + scan[direction].x;
			scanItem.y = nowY + scan[direction].y;
			for(var c = 0;c < closeList.length;c++) {
				if(closeList[c].x == scanItem.x && closeList[c].y == scanItem.y) {
					continue scanLoop;
				}
			}
			if(!core.terrainExists(scanItem.x, scanItem.y) && !core.noPassExists(nowX, nowY) && ((scanItem.x == destX && scanItem.y == destY) || !core.stairExists(scanItem.x, scanItem.y))) {
				for(var o = 0;o < openList.length;o++) {
					if(openList[o].x == scanItem.x && openList[o].y == scanItem.y) {
						continue scanLoop;
					}
				}
				openList.push({'direction': direction, 'parentNode': {'x': nowX, 'y': nowY}, 'x': scanItem.x, 'y': scanItem.y});
			}
		}
		for(var o = 0;o < openList.length;o++) {
			H = Math.abs(openList[o].x - destX) + Math.abs(openList[o].y - destY);
			F = 1 + H;
			if(F < min.step) {
				min.index = o;
				min.direction = openList[o].direction;
				min.parentNode = openList[o].parentNode;
				min.x = openList[o].x;
				min.y = openList[o].y;
				min.step = F;
			}
		}
		openList.splice(min.index, 1);
		closeList.push({'parentNode': min.parentNode, 'direction': min.direction, 'x': min.x, 'y': min.y});
		min.step = 9999;
		nowX = min.x;
		nowY = min.y;
		if(nowX == destX && nowY == destY) {
			while(nowX != startX || nowY != startY) {
				for(var j = 0;j < closeList.length;j++) {
					if(closeList[j].x == nowX && closeList[j].y == nowY) {
						tempList.push({'direction': closeList[j].direction,'x': nowX, 'y': nowY});
						nowX = closeList[j].parentNode.x;
						nowY = closeList[j].parentNode.y;
						closeList.splice(j, 1);
					}
				}
			}
			tempList = tempList.reverse();
			console.log(tempList);
			console.log('自动寻路已找到目的地');
			return tempList;
		}
	}
	console.log('无法到达目的地');
	return false;
}

/**
 * 寻路代码 end
 */

/**
 * 自动行走 start
 */

core.prototype.stopAutoHeroMove = function() {
	core.status.autoHeroMove = false;
	core.status.automaticRouting = false;
	core.status.automaticRoued = false;
	core.temp.autoStep = 0;
	core.temp.destStep = 0;
	core.temp.movedStep = 0;
	core.stopHero();
	clearInterval(core.interval.heroAutoMoveScan);
}

core.prototype.setAutoHeroMove = function(steps, start) {
	if(steps.length == 0) {
		return;
	}
	core.temp.autoStep = 0;
	clearInterval(core.interval.heroAutoMoveScan);
	core.interval.heroAutoMoveScan = window.setInterval(function() {
		if(!core.status.autoHeroMove) {
			if(core.temp.autoStep == steps.length) {
				core.stopAutoHeroMove();
				return;
			}
			core.autoHeroMove(steps[core.temp.autoStep].direction, steps[core.temp.autoStep].step);
			core.temp.autoStep++;
		}
	}, 100);
}

core.prototype.autoHeroMove = function(direction, step) {
	core.status.autoHeroMove = true;
	core.temp.destStep = step;
	core.moveHero(direction);
}

/**
 * 自动行走 end
 */

 /**
  * 行走控制 start
  */

core.prototype.setHeroMoveInterval = function(direction, x, y, callback) {
	if(core.status.heroMoving) {
		return;
	}
	core.status.heroMoving = true;
	var moveStep = 0;
	core.interval.heroMoveInterval = window.setInterval(function() {
		switch(direction) {
			case 'up':
				moveStep -= 4;
				if(moveStep == -4 || moveStep == -8 || moveStep == -12 || moveStep == -16) {
					core.drawHero(direction, x, y, 'leftFoot', 0, moveStep);
				}
				else if(moveStep == -20 || moveStep == -24 ||moveStep == -28 || moveStep == -32) {
					core.drawHero(direction, x, y, 'rightFoot', 0, moveStep);
				}
				if(moveStep == -32) {
					core.setHeroLoc('y', '--');
					if(core.status.heroStop) {
						core.drawHero(direction, x, y - 1, 'stop');
					}
					if(core.isset(callback)) {
						callback();
					}
				}
			break;
			case 'left':
				moveStep -= 4;
				if(moveStep == -4 || moveStep == -8 || moveStep == -12 || moveStep == -16) {
					core.drawHero(direction, x, y, 'leftFoot', moveStep);
				}
				else if(moveStep == -20 || moveStep == -24 ||moveStep == -28 || moveStep == -32) {
					core.drawHero(direction, x, y, 'rightFoot', moveStep);
				}
				if(moveStep == -32) {
					core.setHeroLoc('x', '--');
					if(core.status.heroStop) {
						core.drawHero(direction, x - 1, y, 'stop');
					}
					if(core.isset(callback)) {
						callback();
					}
				}
			break;
			case 'down':
				moveStep += 4;
				if(moveStep == 4 || moveStep == 8 || moveStep == 12 || moveStep == 16) {
					core.drawHero(direction, x, y, 'leftFoot', 0, moveStep);
				}
				else if(moveStep == 20 || moveStep == 24 ||moveStep == 28 || moveStep == 32) {
					core.drawHero(direction, x, y, 'rightFoot', 0, moveStep);
				}
				if(moveStep == 32) {
					core.setHeroLoc('y', '++');
					if(core.status.heroStop) {
						core.drawHero(direction, x, y + 1, 'stop');
					}
					if(core.isset(callback)) {
						callback();
					}
				}
			break;
			case 'right':
				moveStep += 4;
				if(moveStep == 4 || moveStep == 8 || moveStep == 12 || moveStep == 16) {
					core.drawHero(direction, x, y, 'leftFoot', moveStep);
				}
				else if(moveStep == 20 || moveStep == 24 ||moveStep == 28 || moveStep == 32) {
					core.drawHero(direction, x, y, 'rightFoot', moveStep);
				}
				if(moveStep == 32) {
					core.setHeroLoc('x', '++');
					if(core.status.heroStop) {
						core.drawHero(direction, x + 1, y, 'stop');
					}
					if(core.isset(callback)) {
						callback();
					}
				}
			break;
		}
	}, 16.7);
}

core.prototype.setHeroMoveTriggerInterval = function() {
	var direction, x, y;
	var scan = {'up': {'x': 0, 'y': -1}, 'left': {'x': -1, 'y': 0}, 'down': {'x': 0, 'y': 1}, 'right': {'x': 1, 'y': 0}};
	core.interval.heroMoveTriggerInterval = window.setInterval(function() {
		if(!core.status.heroStop) {
			direction = core.getHeroLoc('direction');
			x = core.getHeroLoc('x');
			y = core.getHeroLoc('y');
			var noPass;
			noPass = core.noPass(x + scan[direction].x, y + scan[direction].y);
			if(noPass) {
				core.trigger(x + scan[direction].x, y + scan[direction].y);
				core.drawHero(direction, x, y, 'stop');
				if(core.status.autoHeroMove) {
					core.temp.movedStep++;
					if(core.temp.destStep == core.temp.movedStep) {
						core.status.autoHeroMove = false;
						core.temp.destStep = 0;
						core.temp.movedStep = 0;
						core.stopHero();
					}
				}
				else {
					core.lockKeyBoard();
					core.status.heroStop = true;
				}
				return;
			}
			core.setHeroMoveInterval(direction, x, y, function() {
				if(core.status.autoHeroMove) {
					core.temp.movedStep++;
					if(core.temp.destStep == core.temp.movedStep) {
						core.status.autoHeroMove = false;
						core.temp.destStep = 0;
						core.temp.movedStep = 0;
						core.stopHero();
						core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
					}
				}
				if(core.status.heroStop) {
					core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
				}
				core.trigger(core.getHeroLoc('x'), core.getHeroLoc('y'));
				clearInterval(core.interval.heroMoveInterval);
				core.status.heroMoving = false;
			});
		}
	}, 10);
}

core.prototype.moveHero = function(direction) {
	var heroIcon = core.material.icons.heros[core.firstData.heroId][direction];
	core.setHeroLoc('direction', direction);
	core.status.heroStop = false;
}

core.prototype.stopHero = function() {
	core.status.heroStop = true;
}

core.prototype.drawHero = function(direction, x, y, status, offsetX, offsetY) {
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	core.clearAutomaticRouteNode(x, y);
	var heroIcon = core.material.icons.heros[core.firstData.heroId][direction];
	x = x * heroIcon.size;
	y = y * heroIcon.size;
	core.canvas.hero.clearRect(x - 32, y - 32, 96, 96);
	core.canvas.hero.drawImage(core.material.images[heroIcon.size].heros, heroIcon.loc[status] * heroIcon.size, heroIcon.loc.iconLoc * heroIcon.size, heroIcon.size, heroIcon.size, x + offsetX, y + offsetY, heroIcon.size, heroIcon.size);
}

/**
 * 行走控制 end
 */

/**
 * 地图处理 start
 */

core.prototype.changeFloor = function(floorId, heroLoc) {
	core.lockControl();
	core.stopHero();
	core.stopAutoHeroMove();
	core.stopAutomaticRoute();
	core.setFloorName(floorId);
 	window.setTimeout(function() {
 		console.log('地图切换到' + floorId);
 		core.mapChangeAnimate('show', function() {
 			core.playSound('floor', 'mp3');
 			core.drawMap(floorId, function() {
				core.hide(core.dom.floorMsgGroup, 10, function() {
					core.unLockControl();
				});
				core.setHeroLoc('direction', heroLoc.direction);
				core.setHeroLoc('x', heroLoc.x);
				core.setHeroLoc('y', heroLoc.y);
				core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
 			});
 		});
 	}, 50);
}

core.prototype.mapChangeAnimate = function(mode, callback) {
	if(mode == 'show') {
		core.show(core.dom.floorMsgGroup, 10, function() {
			callback();
		});
	}
	else {
		core.hide(core.dom.floorMsgGroup, 10, function() {
			callback();
		});
	}
}

core.prototype.clearMap = function(map, x, y, width, height) {
	if(map == 'all') {
		for(var m in core.canvas) {
			core.canvas[m].clearRect(0, 0, 352, 352);
		}
	}
	else {
		core.canvas[map].clearRect(x, y, width, height);
	}
}

core.prototype.fillText = function(map, text, x, y, style, font) {
	if(core.isset(style)) {
		core.setFillStyle(map, style);
	}
	if(core.isset(font)) {
		core.setFont(map, font);
	}
	core.canvas[map].fillText(text, x, y);
}

core.prototype.fillRect = function(map, x, y, width, height, style) {
	if(core.isset(style)) {
		core.setFillStyle(map, style);
	}
	core.canvas[map].fillRect(x, y, width, height);
}

core.prototype.strokeRect = function(map, x, y, width, height, style, lineWidth) {
	if(core.isset(style)) {
		core.setStrokeStyle(map, style);
	}
	if(core.isset(lineWidth)) {
		core.setLineWidth(map, lineWidth);
	}
	core.canvas[map].strokeRect(x, y, width, height);
}

core.prototype.drawBlock = function(map, image, cutX, cutY, x, y, size, zoom, clear) {
	zoom = zoom || 1;
	if(core.isset(clear) && clear == true) {
		core.canvas[map].clearRect(x * size, y * size, size, size);
	}
	core.canvas[map].drawImage(core.material.images[size][image], cutX * size, cutY * size, size, size, x * size, y * size, size * zoom, size * zoom);
}

core.prototype.setFont = function(map, font) {
	core.canvas[map].font = font;
}

core.prototype.setLineWidth = function(map, lineWidth) {
	if(map == 'all') {
		for(var m in core.canvas) {
			core.canvas[m].lineWidth = lineWidth;
		}
	}
	core.canvas[map].lineWidth = lineWidth;
}

core.prototype.saveCanvas = function(map) {
	core.canvas[map].save();
}

core.prototype.loadCanvas = function(map) {
	core.canvas[map].restore();
}

core.prototype.setOpacity = function(map, opacity) {
	if(map == 'all') {
		for(var m in core.canvas) {
			core.canvas[m].globalAlpha = opacity;
		}
	}
	core.canvas[map].globalAlpha = opacity;
}

core.prototype.setStrokeStyle = function(map, style) {
	if(map == 'all') {
		for(var m in core.canvas) {
			core.canvas[m].strokeStyle = style;
		}
	}
	else {
		core.canvas[map].strokeStyle = style;
	}
}

core.prototype.setFillStyle = function(map, style) {
	if(map == 'all') {
		for(var m in core.canvas) {
			core.canvas[m].fillStyle = style;
		}
	}
	else {
		core.canvas[map].fillStyle = style;
	}
}

core.prototype.drawMap = function(mapName, callback) {
	var mapData = core.material.maps[mapName];
	var mapBlocks = mapData.blocks;
	core.temp.thisMap = mapData;
	var x, y, blockIcon, blockImage;
	core.clearMap('all');
	core.clearGetItemAnimate();
	core.rmGlobalAnimate(null, null, true);
	core.enabledAllTrigger();
	for(x = 0;x < 11;x++) {
		for(y = 0;y < 11;y++) {
			blockIcon = core.material.icons.terrains.blackFloor;
			blockImage = core.material.images[blockIcon.size].terrains;
			core.canvas.bg.drawImage(blockImage, 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x * blockIcon.size, y * blockIcon.size, blockIcon.size, blockIcon.size);
		}
	}
	x = 0;
	y = 0;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(core.isset(mapBlocks[b].bg)) {
			blockIcon = core.material.icons[mapBlocks[b].bg.cls][mapBlocks[b].bg.id];
			blockImage = core.material.images[blockIcon.size][mapBlocks[b].bg.cls];
			x = mapBlocks[b].x * blockIcon.size;
			y = mapBlocks[b].y * blockIcon.size;
			if(mapBlocks[b].bg.cls != 'empty') {
				core.canvas.bg.drawImage(blockImage, 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
				core.addGlobalAnimate(mapBlocks[b].bg.animate, x, y, 'bg', blockIcon.loc, blockIcon.size, blockImage);
			}
			else {
				core.canvas.bg.clearRect(x, y, blockIcon.size, blockIcon.size);
			}
		}
		else {
			blockIcon = core.material.icons.terrains.blackFloor;
			blockImage = core.material.images[blockIcon.size].terrains;
			x = mapBlocks[b].x * blockIcon.size;
			y = mapBlocks[b].y * blockIcon.size;
			core.canvas.bg.drawImage(blockImage, 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
		}
		if(core.isset(mapBlocks[b].event)) {
			blockIcon = core.material.icons[mapBlocks[b].event.cls][mapBlocks[b].event.id];
			blockImage = core.material.images[blockIcon.size][mapBlocks[b].event.cls];
			core.canvas.event.drawImage(core.material.images[blockIcon.size][mapBlocks[b].event.cls], 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
			core.addGlobalAnimate(mapBlocks[b].event.animate, x, y, 'event', blockIcon.loc, blockIcon.size, blockImage);
		}
		if(core.isset(mapBlocks[b].fg)) {
			blockIcon = core.material.icons[mapBlocks[b].fg.cls][mapBlocks[b].fg.id];
			blockImage = core.material.images[blockIcon.size][mapBlocks[b].fg.cls];
			core.canvas.fg.drawImage(core.material.images[blockIcon.size][mapBlocks[b].fg.cls], 0, blockIcon.loc * blockIcon.size, blockIcon.size, blockIcon.size, x, y, blockIcon.size, blockIcon.size);
			core.addGlobalAnimate(mapBlocks[b].fg.animate, x, y, 'fg', blockIcon.loc, blockIcon.size, blockImage);
		}
	}
	core.setGlobalAnimate(core.firstData.animateSpeed);
	callback();
}

core.prototype.setFloorName = function(floorId) {
	core.dom.floorNameLabel.innerHTML = core.material.maps[floorId].title;
}

core.prototype.noPassExists = function(x, y) {
	if(core.enemyExists(x, y) || core.npcExists(x, y)) {
		return true;
	}
	return false;
}

core.prototype.npcExists = function(x, y) {
	var blocks = core.temp.thisMap.blocks;
	for(var n = 0;n < blocks.length;n++) {
		if(blocks[n].x == x && blocks[n].y == y && core.isset(blocks[n].event) && blocks[n].event.cls == 'npcs') {
			return true;
		}
	}
	return false;
}

core.prototype.terrainExists = function(x, y) {
	if(x > 10 || y > 10 || x < 0 || y < 0) {
		return true;
	}
	if(core.stairExists(x, y)) {
		return false;
	}
	var blocks = core.temp.thisMap.blocks;
	for(var t = 0;t < blocks.length;t++) {
		if(blocks[t].x == x && blocks[t].y == y) {
			for(var map in core.canvas) {
				if(core.isset(blocks[t][map]) && (blocks[t][map].cls == 'terrains' || (blocks[t][map].cls == 'animates' && core.isset(blocks[t][map].noPass) && blocks[t][map].noPass == true))) {
					return true;
				}
			}
		}
	}
	return false;
}

core.prototype.stairExists = function(x, y) {
	var blocks = core.temp.thisMap.blocks;
	for(var s = 0;s < blocks.length;s++) {
		if(blocks[s].x == x && blocks[s].y == y && core.isset(blocks[s].event) && blocks[s].event.cls == 'terrains' && core.isset(blocks[s].event.id) && (blocks[s].event.id == 'upFloor' || blocks[s].event.id == 'downFloor')) {
			return true;
		}
	}
	return false;
}

core.prototype.enemyExists = function(x, y, id) {
	var blocks = core.temp.thisMap.blocks;
	for(var e = 0;e < blocks.length;e++) {
		if(blocks[e].x == x && blocks[e].y == y && core.isset(blocks[e].event) && blocks[e].event.cls == 'enemys' && ((core.isset(id) && core.isset(blocks[e].event.id)) ? blocks[e].event.id == id : true)) {
			return true;
		}
	}
	return false;
}

core.prototype.blockExists = function(x, y) {
	if(x > 10 || y > 10 || x < 0 || y < 0) {
		return true;
	}
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y) {
			return (mapBlocks[b].fg && mapBlocks[b].fg.noPass) || (mapBlocks[b].event && mapBlocks[b].event.noPass) || (mapBlocks[b].bg && mapBlocks[b].bg.noPass);
		}
	}
	return false;
}

core.prototype.rmBlock = function(map, x, y) {
	var map = map.split(',');
	var mapBlocks = core.temp.thisMap.blocks;
	var blockIcon;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y) {
			core.rmGlobalAnimate(x, y);
			for(var m = 0;m < map.length;m++) {
				if(!core.isset(mapBlocks[b][map[m]])) {
					continue;
				}
				blockIcon = core.material.icons[mapBlocks[b][map[m]].cls][mapBlocks[b][map[m]].id];
				core.canvas[map[m]].clearRect(x * blockIcon.size,y * blockIcon.size, blockIcon.size, blockIcon.size);
				delete core.temp.thisMap.blocks[b][map[m]];
			}
		}
	}
}

core.prototype.noPass = function(x, y) {
	if(x > 10 || y > 10 || x < 0 || y < 0) {
		return true;
	}
	var mapBlocks = core.temp.thisMap.blocks;
	var noPass;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y) {
			return noPass = (mapBlocks[b].fg && mapBlocks[b].fg.noPass) || (mapBlocks[b].event && mapBlocks[b].event.noPass) || (mapBlocks[b].bg && mapBlocks[b].bg.noPass);
		}
	}
}

core.prototype.trigger = function(x, y) {
	var mapBlocks = core.temp.thisMap.blocks;
	var noPass;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y) {
			noPass = (mapBlocks[b].fg && mapBlocks[b].fg.noPass) || (mapBlocks[b].event && mapBlocks[b].event.noPass) || (mapBlocks[b].bg && mapBlocks[b].bg.noPass);
			if(noPass) {
				core.clearAutomaticRouteNode(x, y);
			}
			if(core.isset(mapBlocks[b].fg) && core.isset(mapBlocks[b].fg.trigger) && (core.isset(mapBlocks[b].fg.disabledTrigger) ? mapBlocks[b].fg.disabledTrigger == false : true)) {
				core.material.events[mapBlocks[b].fg.trigger](mapBlocks[b], core, function(data) {
					
				});
			}
			else if(core.isset(mapBlocks[b].event) && core.isset(mapBlocks[b].event.trigger) && (core.isset(mapBlocks[b].event.disabledTrigger) ? mapBlocks[b].event.disabledTrigger == false : true)) {
				core.material.events[mapBlocks[b].event.trigger](mapBlocks[b], core, function(data) {
					
				});
			}
			else if(core.isset(mapBlocks[b].bg) && core.isset(mapBlocks[b].bg.trigger) && (core.isset(mapBlocks[b].bg.disabledTrigger) ? mapBlocks[b].bg.disabledTrigger == false : true)) {
				core.material.events[mapBlocks[b].bg.trigger](mapBlocks[b], core, function(data) {
					
				});
			}
		}
	}
}

core.prototype.setTrigger = function(x, y, map, triggerName) {
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map])) {
			mapBlocks[b][map].trigger = triggerName;
		}
	}
}

core.prototype.enabledTrigger = function(x, y, map) {
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
			mapBlocks[b][map].disabledTrigger = false;
		}
	}
}

core.prototype.enabledAllTrigger = function() {
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		for(var map in core.canvas) {
			if(core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
				mapBlocks[b][map].disabledTrigger = false;
			}
		}
	}
}

core.prototype.disabledTrigger = function(x, y, map) {
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
			mapBlocks[b][map].disabledTrigger = true;
		}
	}
}

core.prototype.rmTrigger = function(x, y, map) {
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == x && mapBlocks[b].y == y && core.isset(mapBlocks[b][map]) && core.isset(mapBlocks[b][map].trigger)) {
			delete mapBlocks[b][map].trigger;
		}
	}
}

core.prototype.addGlobalAnimate = function(animateMore, x, y, map, loc, size, image) {
	if(animateMore == 2) {
		core.temp.twoAnimateObjs.push({'x': x, 'y': y, 'map': map, 'status': 0, 'loc': loc, 'size': size, 'image': image});
	}
	else if(animateMore == 4) {
		core.temp.fourAnimateObjs.push({'x': x, 'y': y, 'map': map, 'status': 0, 'loc': loc, 'size': size, 'image': image});
	}
}

core.prototype.rmGlobalAnimate = function(x, y, all) {
	if(all == true) {
		core.temp.twoAnimateObjs = [];
		core.temp.fourAnimateObjs = [];
	}
	for(var t = 0;t < core.temp.twoAnimateObjs.length;t++) {
		if(core.temp.twoAnimateObjs[t].x == x * core.temp.twoAnimateObjs[t].size && core.temp.twoAnimateObjs[t].y == y * core.temp.twoAnimateObjs[t].size) {
			core.temp.twoAnimateObjs.splice(t, 1);
			return;
		}
	}
	for(var f = 0;f < core.temp.fourAnimateObjs.length;f++) {
		if(core.temp.fourAnimateObjs[f].x == x * core.temp.fourAnimateObjs[f].size && core.temp.fourAnimateObjs[f].y == y * core.temp.fourAnimateObjs[f].size) {
			core.temp.fourAnimateObjs.splice(f, 1);
			return;
		}
	}
}

core.prototype.setGlobalAnimate = function(speed) {
	clearInterval(core.interval.twoAnimate);
	clearInterval(core.interval.fourAnimate);
	var animateClose = false;
	core.interval.twoAnimate = window.setInterval(function() {
		for(var a = 0;a < core.temp.twoAnimateObjs.length;a++) {
			core.temp.twoAnimateObjs[a].status = core.temp.twoAnimateObjs[a].status == 0 ? 1 : 0;
			core.canvas[core.temp.twoAnimateObjs[a].map].clearRect(core.temp.twoAnimateObjs[a].x, core.temp.twoAnimateObjs[a].y, core.temp.twoAnimateObjs[a].size, core.temp.twoAnimateObjs[a].size);
			for(var b = 0;b < core.temp.thisMap.blocks.length;b++) {
				if(core.temp.thisMap.blocks[b].x * 32 == core.temp.twoAnimateObjs[a].x && core.temp.thisMap.blocks[b].y * 32 == core.temp.twoAnimateObjs[a].y && (!core.isset(core.temp.thisMap.blocks[b][core.temp.twoAnimateObjs[a].map]) || core.temp.thisMap.blocks[b][core.temp.twoAnimateObjs[a].map].animate == 0)) {
					animateClose = true;
				}
			}
			if(!animateClose) {
				core.canvas[core.temp.twoAnimateObjs[a].map].drawImage(core.temp.twoAnimateObjs[a].image, core.temp.twoAnimateObjs[a].status * 32, core.temp.twoAnimateObjs[a].loc * core.temp.twoAnimateObjs[a].size, core.temp.twoAnimateObjs[a].size, core.temp.twoAnimateObjs[a].size, core.temp.twoAnimateObjs[a].x, core.temp.twoAnimateObjs[a].y, core.temp.twoAnimateObjs[a].size, core.temp.twoAnimateObjs[a].size);
			}
			animateClose = false;
		}
	}, speed);
	core.interval.fourAnimate = window.setInterval(function() {
		for(var a = 0;a < core.temp.fourAnimateObjs.length;a++) {
			core.temp.fourAnimateObjs[a].status = (core.temp.fourAnimateObjs[a].status == 0 ? 1 : (core.temp.fourAnimateObjs[a].status == 1 ? 2 : (core.temp.fourAnimateObjs[a].status == 2 ? 3 : 0)));
			core.canvas[core.temp.fourAnimateObjs[a].map].clearRect(core.temp.fourAnimateObjs[a].x, core.temp.fourAnimateObjs[a].y, core.temp.fourAnimateObjs[a].size, core.temp.fourAnimateObjs[a].size);
			for(var b = 0;b < core.temp.thisMap.blocks.length;b++) {
				if(core.temp.thisMap.blocks[b].x * 32 == core.temp.fourAnimateObjs[a].x && core.temp.thisMap.blocks[b].y * 32 == core.temp.fourAnimateObjs[a].y && (!core.isset(core.temp.thisMap.blocks[b][core.temp.fourAnimateObjs[a].map]) || core.temp.thisMap.blocks[b][core.temp.fourAnimateObjs[a].map].animate == 0)) {
					animateClose = true;
				}
			}
			if(!animateClose) {
				core.canvas[core.temp.fourAnimateObjs[a].map].drawImage(core.temp.fourAnimateObjs[a].image, core.temp.fourAnimateObjs[a].status * 32, core.temp.fourAnimateObjs[a].loc * core.temp.fourAnimateObjs[a].size, core.temp.fourAnimateObjs[a].size, core.temp.fourAnimateObjs[a].size, core.temp.fourAnimateObjs[a].x, core.temp.fourAnimateObjs[a].y, core.temp.fourAnimateObjs[a].size, core.temp.fourAnimateObjs[a].size);
			}
			animateClose = false;
		}
	}, speed / 2);
}

core.prototype.setHeroLoc = function(itemName, itemVal) {
	if(itemVal == '++') {
		core.temp.heroLoc[itemName]++;
		return;
	}
	else if(itemVal == '--') {
		core.temp.heroLoc[itemName]--;
		return;
	}
	core.temp.heroLoc[itemName] = itemVal;
}

core.prototype.getHeroLoc = function(itemName) {
	return core.temp.heroLoc[itemName];
}

/**
 * 地图处理 end
 */

/**
 * 物品处理 start
 */

 core.prototype.addItem = function(itemId) {
 	var itemData = core.material.items[itemId];
 	var itemCls = itemData.cls;
 	core.temp.itemList[itemCls];
 	if(!core.isset(core.temp.itemList[itemCls])) {
 		core.temp.itemList[itemCls] = {};
 		core.temp.itemList[itemCls][itemId] = 0;
 	}
 	else if(!core.isset(core.temp.itemList[itemCls][itemId])) {
 		core.temp.itemList[itemCls][itemId] = 0;
 	}
 	core.temp.itemList[itemCls][itemId]++;
 	console.log(core.temp.itemList);
 }

core.prototype.rmItem = function(itemX, itemY) {
	var mapBlocks = core.temp.thisMap.blocks;
	for(var b = 0;b < mapBlocks.length;b++) {
		if(mapBlocks[b].x == itemX && mapBlocks[b].y == itemY && core.isset(mapBlocks[b].event) && mapBlocks[b].event.cls == 'items') {
			delete mapBlocks[b].event;
		}
	}
}

core.prototype.getItem = function(itemId, itemNum, itemX, itemY) {
	itemNum = itemNum || 1;
	core.getItemAnimate(itemId, itemNum, itemX, itemY);
	core.addItem(itemId);
	core.rmItem(itemX, itemY);
	core.updateStatus();
}

core.prototype.clearGetItemAnimate = function() {
	for(var a = 0;a < core.interval.getItemAnimate.length;a++) {
		clearInterval(core.interval.getItemAnimate[a]);
	}
}

core.prototype.getItemTip = function(text, type, itemIcon) {
	type = type || 'normal';
	var textX, textY, width, height, hide = false, opacityVal = 0;
	clearInterval(core.interval.getItemTipAnimate);
	core.saveCanvas('ui');
	core.setOpacity('ui', 0);
	if(type == 'normal') {
		textX = 8;
		textY = 5;
		width = textX * 2 + core.canvas.ui.measureText(text).width;
		height = 22;
	}
	else if(type == 'image' && core.isset(itemIcon)) {
		textX = 35;
		textY = 10;
		width = textX + core.canvas.ui.measureText(text).width + 8;
		height = 32;
	}
	else {
		core.loadCanvas('ui');
		return;
	}
	core.interval.getItemTipAnimate = window.setInterval(function() {
		if(hide) {
			opacityVal -= 0.1;
		}
		else {
			opacityVal += 0.1;
		}
		core.setOpacity('ui', opacityVal);
		core.clearMap('ui', 5, 5, width, height);
		core.fillRect('ui', 5, 5, width, height, '#000');
		if(core.isset(itemIcon)) {
			core.canvas.ui.drawImage(core.material.images['32'].items, 0, itemIcon.loc * itemIcon.size, itemIcon.size, itemIcon.size, 10, 8, itemIcon.size * 0.8, itemIcon.size * 0.8);
		}
		core.fillText('ui', text, textX + 5, textY + 15, '#fff');
		if(opacityVal > 0.6 || opacityVal < 0) {
			if(hide) {
				core.loadCanvas('ui');
				core.clearMap('ui', 5, 5, width, height);
				core.setOpacity('ui', 1);
				clearInterval(core.interval.getItemTipAnimate);
				return;
			}
			else {
				if(!core.timeout.getItemTipTimeout) {
					core.timeout.getItemTipTimeout = window.setTimeout(function() {
						hide = true;
						core.timeout.getItemTipTimeout = null;
					}, 1000);
				}
				opacityVal = 0.6;
				core.setOpacity('ui', opacityVal);
			}
		}
	}, 30);
}

core.prototype.getItemAnimate = function(itemId, itemNum, itemX, itemY) {
	var top = 0;
	var intervalIndex = core.interval.getItemAnimate.length;
	var itemIcon = core.material.icons.items[itemId];
	itemX = itemX * itemIcon.size;
	itemY = itemY * itemIcon.size;
	core.getItemTip('获得 ' + core.material.items[itemId].name + ' x ' + itemNum, 'image', itemIcon);
	core.interval.getItemAnimate[core.interval.getItemAnimate.length] = window.setInterval(function() {
		top += 3;
		core.canvas.event.clearRect(itemX, itemY, 32, 32);
		core.canvas.event.drawImage(core.material.images['32'].items, 0, itemIcon.loc * itemIcon.size - top, itemIcon.size, itemIcon.size, itemX, itemY, itemIcon.size, itemIcon.size);
		core.canvas.event.clearRect(itemX, itemY + 30, 32, 2);
		if(top >= 30) {
			top = 0;
			clearInterval(core.interval.getItemAnimate[intervalIndex]);
		}
	}, 30);
}

/**
 * 物品处理 end
 */

/**
 * 系统机制 start
 */

core.prototype.setFirstItem = function() {
	core.setStatus('level', core.firstData.heroLevel);
	core.setStatus('hp', core.firstData.heroHp);
	core.setStatus('atk', core.firstData.heroAtk);
	core.setStatus('def', core.firstData.heroDef);
	core.setStatus('gold', core.firstData.heroGold);
	core.setStatus('exp', core.firstData.heroExp);
	for(var itemClass in core.firstData.heroItem) {
		if(!core.isset(core.temp.itemList[itemClass])) {
			core.temp.itemList[itemClass] = {};
		}
		for(var itemName in core.firstData.heroItem[itemClass]) {
			if(!core.isset(core.temp.itemList[itemClass][itemName])) {
				core.temp.itemList[itemClass][itemName] = 0;
				console.log(core.temp.itemList[itemClass][itemName]);
			}
		}
	}
	console.log(core.temp.itemList);
}

core.prototype.setStatusLabel = function(itemName, itemVal) {
	for(var d = 0;d < core.dom.statusLabels.length;d++) {
		if(core.dom.statusLabels[d].id == itemName) {
			core.dom.statusLabels[d].innerHTML = itemVal;
		}
	}
}

core.prototype.setStatus = function(statusName, statusVal) {
	if(core.isset(core.status.hero[statusName])) {
		core.status.hero[statusName] = statusVal;
	}
}

core.prototype.getStatus = function(statusName) {
	if(core.isset(core.status.hero[statusName])) {
		return core.status.hero[statusName];
	}
}

core.prototype.updateStatus = function() {
	var statusList = ['level', 'hp', 'atk', 'def', 'gold', 'exp'];
	for(var i = 0;i < statusList.length;i++) {
		core.setStatusLabel(statusList[i], core.getStatus(statusList[i]));
	}
	core.setStatusLabel('yellowKey', core.temp.itemList.key.yellowKey);
	core.setStatusLabel('blueKey', core.temp.itemList.key.blueKey);
	core.setStatusLabel('redKey', core.temp.itemList.key.redKey);
	core.setStatusLabel('greenKey', core.temp.itemList.key.greenKey);
}

core.prototype.lockControl = function() {
	core.status.lockControl = true;
}

core.prototype.unLockControl = function() {
	core.status.lockControl = false;
}

core.prototype.lockKeyBoard = function() {
	core.status.keyBoardLock = true;
}

core.prototype.unLockKeyBoard = function() {
	core.status.keyBoardLock = false;
}

core.prototype.isset = function(val) {
	if(val == undefined || val == null) {
		return false;
	}
	return true
}

core.prototype.getClickLoc = function(x, y) {
	var statusBar = {'x': 0, 'y': 0};
	var size = 32;
	switch(core.status.screenMode) {
		case 'adaptive': 
			var zoom = ((core.dom.body.clientWidth - 6) / 352);
			statusBar.x = 0;
			statusBar.y = 102 * zoom;
			size = size * zoom;
		break;
		case 'vertical': 
			statusBar.x = 3;
			statusBar.y = 102; 
		break;
		case 'horizontal': 
			statusBar.x = 102;
			statusBar.y = 3; 
		break;
		case 'all': 
			statusBar.x = 202;
			statusBar.y = 3; 
			size = 64;
		break;
	}
	var left = core.dom.gameGroup.offsetLeft + statusBar.x;
	var top = core.dom.gameGroup.offsetTop + statusBar.y;
	return {'x': x - left, 'y': y - top, 'size': size};
}

core.prototype.soundPlayed = function(soundName, soundType) {
	return core.material.sounds[soundType][soundName].paused;
}

core.prototype.playSound = function(soundName, soundType) {
	if(!core.status.soundStatus) {
		return;
	}
	if(core.isset(core.temp.playedSound)) {
		core.temp.playedSound.pause();
	}
	core.temp.playedSound = core.material.sounds[soundType][soundName];
	core.temp.playedSound.play();
}

core.prototype.playBgm = function(bgmName, bgmType) {
	if(!core.status.soundStatus) {
		return;
	}
	if(core.isset(core.temp.playedBgm)) {
		core.temp.playedBgm.pause();
	}
	core.temp.playedBgm = core.material.sounds[bgmType][bgmName];
	core.temp.playedBgm.play();
}

core.prototype.changeSoundStatus = function() {
	if(core.status.soundStatus) {
		main.core.disabledSound();
	}
	else {
		main.core.enabledSound();
	}
}

core.prototype.enabledSound = function() {
	core.dom.musicBtn.src = core.material.images['25'].musicPlayed.src;
	core.temp.playedBgm.play();
	core.status.soundStatus = true;
}

core.prototype.disabledSound = function() {
	core.dom.musicBtn.src = core.material.images['25'].musicPaused.src;
	core.temp.playedBgm.pause();
	core.status.soundStatus = false;
}

core.prototype.show = function(obj, speed, callback) {
	if(!core.isset(speed)) {
		obj.style.display = 'block';
		return;
	}
	obj.style.display = 'block';
	obj.style.opacity = 0;
	var opacityVal = 0;
	var showAnimate = window.setInterval(function() {
		opacityVal += 0.03;
		obj.style.opacity = opacityVal;
		if(opacityVal > 1) {
			clearInterval(showAnimate);
			if(core.isset(callback)) {
				callback();
			}
		}
	}, speed);
}

core.prototype.hide = function(obj, speed, callback) {
	if(!core.isset(speed)) {
		obj.style.display = 'none';
		return;
	}
	var opacityVal = 1;
	var hideAnimate = window.setInterval(function() {
		opacityVal -= 0.03;
		obj.style.opacity = opacityVal;
		if(opacityVal < 0) {
			obj.style.display = 'none';
			clearInterval(hideAnimate);
			if(core.isset(callback)) {
				callback();
			}
		}
	}, speed);
}

core.prototype.resize = function(width, height) {
	console.log([width, height]);
	var halfWidth = width / 2;
	if(width < 352) {
		var zoom = (352 - width) / 3.52;
		var top = (97 - zoom);
		var helfmoveBtnGroupWidth = (109 - zoom) / 2;
		core.dom.gameGroup.style.width = (width - 3) + 'px';
		core.dom.gameGroup.style.height = (top + width) + 'px';
		core.dom.startTopLoadTips.style.fontSize = '0.6rem';
		core.dom.startBackground.style.height = (top + width) + 'px';
		core.dom.startButtonGroup.style.bottom = '15px';
		core.dom.startButtonGroup.style.fontSize = '1rem';
		core.dom.floorMsgGroup.style.width = (width - 3) + 'px';
		core.dom.statusBar.style.width = (width - 3) + 'px';
		core.dom.statusBar.style.height = top + 'px';
		for(var i = 0;i < core.dom.gameCanvas.length;i++) {
			core.dom.gameCanvas[i].style.borderTop = '3px #fff solid';
			core.dom.gameCanvas[i].style.borderLeft = '';
			core.dom.gameCanvas[i].style.top = top + 'px';
			core.dom.gameCanvas[i].style.left = '0px';
			core.dom.gameCanvas[i].style.right = '0px';
			core.dom.gameCanvas[i].style.width = (width - 3) + 'px';
			core.dom.gameCanvas[i].style.height = (width - 3) + 'px';
		}
		core.status.screenMode = 'adaptive';
		console.log('已调整为自适应屏');
	}
	else if(width < 452) {
		core.dom.gameGroup.style.left = (halfWidth - 176) + 'px';
		core.dom.gameGroup.style.top = '0px';
		core.dom.gameGroup.style.width = '349px';
		core.dom.gameGroup.style.height = '449px';
		core.dom.startTopLoadTips.style.fontSize = '0.6rem';
		core.dom.startBackground.style.height = '449px';
		core.dom.startButtonGroup.style.bottom = '20px';
		core.dom.startButtonGroup.style.fontSize = '1.2rem';
		core.dom.floorMsgGroup.style.width = '349px';
		core.dom.statusBar.style.width = '349px';
		core.dom.statusBar.style.height = '97px';
		for(var i = 0;i < core.dom.gameCanvas.length;i++) {
			core.dom.gameCanvas[i].style.borderTop = '3px #fff solid';
			core.dom.gameCanvas[i].style.borderLeft = '';
			core.dom.gameCanvas[i].style.top = '97px';
			core.dom.gameCanvas[i].style.left = '0px';
			core.dom.gameCanvas[i].style.right = '0px';
			core.dom.gameCanvas[i].style.width = '349px';
			core.dom.gameCanvas[i].style.height = '349px';
		}
		core.status.screenMode = 'vertical';
		console.log('已调整为竖屏');
	}
	else if(width < 1004){
		core.dom.gameGroup.style.left = (halfWidth - 226) + 'px';
		core.dom.gameGroup.style.top = (height / 2 - 176) + 'px';
		core.dom.gameGroup.style.width = '452px';
		core.dom.gameGroup.style.height = '352px';
		core.dom.startTopLoadTips.style.fontSize = '0.6rem';
		core.dom.startBackground.style.height = '352px';
		core.dom.startButtonGroup.style.bottom = '20px';
		core.dom.startButtonGroup.style.fontSize = '1.4rem';
		core.dom.floorMsgGroup.style.width = '352px';
		core.dom.statusBar.style.width = '97px';
		core.dom.statusBar.style.height = '352px';
		for(var i = 0;i < core.dom.gameCanvas.length;i++) {
			core.dom.gameCanvas[i].style.borderTop = '';
			core.dom.gameCanvas[i].style.borderLeft = '3px #fff solid';
			core.dom.gameCanvas[i].style.top = '0px';
			core.dom.gameCanvas[i].style.left = '97px';
			core.dom.gameCanvas[i].style.right = '0px';
			core.dom.gameCanvas[i].style.width = '352px';
			core.dom.gameCanvas[i].style.height = '352px';
		}
		core.status.screenMode = 'horizontal';
		console.log('已调整为横屏');
	}
	else {
		core.dom.gameGroup.style.left = (halfWidth - 452) + 'px';
		core.dom.gameGroup.style.top = '0px';
		core.dom.gameGroup.style.width = '904px';
		core.dom.gameGroup.style.height = '704px';
		core.dom.startTopLoadTips.style.fontSize = '1rem';
		core.dom.startBackground.style.height = '704px';
		core.dom.startButtonGroup.style.bottom = '60px';
		core.dom.startButtonGroup.style.fontSize = '1.8rem';
		core.dom.floorMsgGroup.style.width = '704px';
		core.dom.statusBar.style.width = '197px';
		core.dom.statusBar.style.height = '704px';
		for(var i = 0;i < core.dom.gameCanvas.length;i++) {
			core.dom.gameCanvas[i].style.borderTop = '';
			core.dom.gameCanvas[i].style.borderLeft = '3px #fff solid';
			core.dom.gameCanvas[i].style.top = '0px';
			core.dom.gameCanvas[i].style.left = '197px';
			core.dom.gameCanvas[i].style.right = '0px';
			core.dom.gameCanvas[i].style.width = '704px';
			core.dom.gameCanvas[i].style.height = '704px';
		}
		core.status.screenMode = 'all';
		console.log('已调整为全屏');
	}
	core.dom.startBackground.style.left = '-' + ((core.dom.startBackground.offsetWidth - core.dom.gameGroup.offsetWidth) / 2) + 'px';
}

/**
 * 系统机制 end
 */

var core = new core();
main.instance.core = core;