function main() {
	this.dom = {
		'body': document.body,
		'gameGroup': document.getElementById('gameGroup'),
		'mainTips': document.getElementById('mainTips'),
		'musicBtn': document.getElementById('musicBtn'),
		'startPanel': document.getElementById('startPanel'),
		'startTop': document.getElementById('startTop'),
		'startTopProgressBar': document.getElementById('startTopProgressBar'),
		'startTopProgress': document.getElementById('startTopProgress'),
		'startTopLoadTips': document.getElementById('startTopLoadTips'),
		'startBackground': document.getElementById('startBackground'),
		'startButtonGroup': document.getElementById('startButtonGroup'),
		'floorMsgGroup': document.getElementById('floorMsgGroup'),
		'versionLabel': document.getElementById('versionLabel'),
		'floorNameLabel': document.getElementById('floorNameLabel'),
		'statusBar': document.getElementById('statusBar'),
		'gameCanvas': document.getElementsByClassName('gameCanvas'),
		'playGame': document.getElementById('playGame'),
		'loadGame': document.getElementById('loadGame'),
		'aboutGame': document.getElementById('aboutGame'),
		'data': document.getElementById('data'),
		'statusLabels': document.getElementsByClassName('statusLabel')
	};
	console.log('加载游戏容器和开始界面dom对象完成 如下');
	console.log(this.dom);
	this.loadList = [
		'items',
		'icons',
		'maps',
		'enemys',
		'events',
		'core'
	];
	console.log('加载js文件列表加载完成' + this.loadList);
	this.images = {
		'25': ['musicPlayed', 'musicPaused'],
		'32': ['animates', 'enemys', 'heros', 'items', 'npcs', 'terrains'],
		'64': []
	}
	this.sounds = {
		'mp3': ['bgm-loop', 'floor']
	}
	this.instance = {};
	console.log('存储实例变量已声明');
	this.canvas = {};
	console.log('存储canvas变量已声明');
	this.firstData = {
		'version': 'Ver 1.0.0 (Beta)',
		'floor': 'MT001',
		'heroId': 'hero1',
		'heroName': '勇士',
		'heroLoc': {'direction': 'down', 'x': 1, 'y': 5},
		'heroLevel': 1,
		'heroHp': 1000,
		'heroAtk': 10,
		'heroDef': 10,
		'heroGold': 0,
		'heroExp': 0,
		'heroItem': {
			'key': {
				'yellowKey': 0,
				'blueKey': 0,
				'redKey': 0,
				'greenKey': 0
			}
		},
		'animateSpeed': 500
	}
	console.log('初始数据已声明');
}

main.prototype.init = function() {
	console.log('main函数对象开始初始化');
	for(var i = 0;i < main.dom.gameCanvas.length;i++) {
		main.canvas[main.dom.gameCanvas[i].id] = main.dom.gameCanvas[i].getContext('2d');
		console.log('已转存canvas ' + main.dom.gameCanvas[i].id + ' dom对象到main的canvas对象');
	}
	console.log('js加载器开始运行');
	main.loader(function() {
		var coreData = {};
		for(i = 0;i < main.loadList.length;i++) {
			if(main.loadList[i] == 'core') {
				continue;
			}
			main[main.loadList[i]].init(main.dom);
			coreData[main.loadList[i]] = main[main.loadList[i]];
			console.log(main.loadList[i] + '函数对象初始化完成');
		}
		main.core.init(main.dom, main.canvas, main.images, main.sounds, main.firstData, coreData);
		console.log('core函数对象初始化完成');
		main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
		console.log('main函数对象初始化完成');
	});
}

main.prototype.loader = function(callback) {
	var instanceNum = 0;
	for(var i = 0;i < main.loadList.length;i++) {
		console.log('开始动态加载' + main.loadList[i] + '.js');
		main.loadMod(main.loadList[i], function(modName) {
			instanceNum = 0;
			console.log(modName + '.js 加载完成');
			main.setMainTipsText(modName + '.js 加载完毕');
			for(var key in main.instance) {
				instanceNum++;
			}
			if(instanceNum == main.loadList.length) {
				delete main.instance;
				main.dom.mainTips.style.display = 'none';
				console.log('所有js动态加载完成 成功销毁instance');
				callback();
			}
		});
	}
}

main.prototype.loadMod = function(modName, callback) {
	var script = document.createElement('script');
	script.src = 'libs/' + modName + '.js';
	main.dom.body.appendChild(script);
	script.onload = function() {
		main[modName] = main.instance[modName];
		console.log('成功将' + modName + '.js 的实例对象转存到main的instance');
		callback(modName);
	}
}

main.prototype.setMainTipsText = function(text) {
	main.dom.mainTips.innerHTML = text;
}

var main = new main();
main.init();

window.onresize = function() {
	console.log('触发了resize事件');
	main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
	console.log('当前界面已调整');
}

main.dom.body.onkeydown = function(e) {
	if(main.core.status.lockControl) {
		return;
	}
	main.core.keyDown(e);
}

main.dom.body.onkeyup = function(e) {
	if(main.core.status.lockControl) {
		return;
	}
	main.core.keyUp(e);
}

main.dom.playGame.onclick = function() {
	if(main.core.status.lockControl) {
		return;
	}
	main.core.playGameBtnClick();
}

main.dom.musicBtn.onclick = function() {
	if(main.core.status.lockControl) {
		return;
	}
	main.core.musicBtnClick();
}

main.dom.body.onselectstart = function() {
    return false;
}

main.dom.data.onmousedown = function(e) {
	if(main.core.status.lockControl) {
		return;
	}
	e.stopPropagation();
	var loc = main.core.getClickLoc(e.clientX, e.clientY);
	main.core.setAutomaticRoute(parseInt(loc.x / loc.size), parseInt(loc.y / loc.size));
}

main.dom.data.ontouchstart = function(e) {
	if(main.core.status.lockControl) {
		return;
	}
	e.preventDefault();
	var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
	main.core.setAutomaticRoute(parseInt(loc.x / loc.size), parseInt(loc.y / loc.size));
}