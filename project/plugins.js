var plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = 
{
    "init": function () {
	main.log = function () {} // console.log("插件编写测试");
	// 可以写一些直接执行的代码
	// 在这里写的代码将会在【资源加载前】被执行，此时图片等资源尚未被加载。
	// 请勿在这里对包括bgm，图片等资源进行操作。
	this._afterLoadResources = function () {
		// 本函数将在所有资源加载完毕后，游戏开启前被执行
		// 可以在这个函数里面对资源进行一些操作。
		// 若需要进行切分图片，可以使用 core.splitImage() 函数，或直接在全塔属性-图片切分中操作
	}
	// 可以在任何地方（如afterXXX或自定义脚本事件）调用函数，方法为 core.plugin.xxx();
	// 从V2.6开始，插件中用this.XXX方式定义的函数也会被转发到core中，详见文档-脚本-函数的转发。
},
    "drawLight": function () {

	// 绘制灯光/漆黑层效果。调用方式 core.plugin.drawLight(...)
	// 【参数说明】
	// name：必填，要绘制到的画布名；可以是一个系统画布，或者是个自定义画布；如果不存在则创建
	// color：可选，只能是一个0~1之间的数，为不透明度的值。不填则默认为0.9。
	// lights：可选，一个数组，定义了每个独立的灯光。
	//        其中每一项是三元组 [x,y,r] x和y分别为该灯光的横纵坐标，r为该灯光的半径。
	// lightDec：可选，0到1之间，光从多少百分比才开始衰减（在此范围内保持全亮），不设置默认为0。
	//        比如lightDec为0.5代表，每个灯光部分内圈50%的范围全亮，50%以后才开始快速衰减。
	// 【调用样例】
	// core.plugin.drawLight('curtain'); // 在curtain层绘制全图不透明度0.9，等价于更改画面色调为[0,0,0,0.9]。
	// core.plugin.drawLight('ui', 0.95, [[25,11,46]]); // 在ui层绘制全图不透明度0.95，其中在(25,11)点存在一个半径为46的灯光效果。
	// core.plugin.drawLight('test', 0.2, [[25,11,46,0.1]]); // 创建一个test图层，不透明度0.2，其中在(25,11)点存在一个半径为46的灯光效果，灯光中心不透明度0.1。
	// core.plugin.drawLight('test2', 0.9, [[25,11,46],[105,121,88],[301,221,106]]); // 创建test2图层，且存在三个灯光效果，分别是中心(25,11)半径46，中心(105,121)半径88，中心(301,221)半径106。
	// core.plugin.drawLight('xxx', 0.3, [[25,11,46],[105,121,88,0.2]], 0.4); // 存在两个灯光效果，它们在内圈40%范围内保持全亮，40%后才开始衰减。
	this.drawLight = function (name, color, lights, lightDec) {

		// 清空色调层；也可以修改成其它层比如animate/weather层，或者用自己创建的canvas
		var ctx = core.getContextByName(name);
		if (ctx == null) {
			if (typeof name == 'string')
				ctx = core.createCanvas(name, 0, 0, core.__PX_WIDTH__, core.__PX_HEIGHT__, 98);
			else return;
		}

		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

		core.clearMap(name);
		// 绘制色调层，默认不透明度
		if (color == null) color = 0.9;
		ctx.fillStyle = "rgba(0,0,0," + color + ")";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		lightDec = core.clamp(lightDec, 0, 1);

		// 绘制每个灯光效果
		ctx.globalCompositeOperation = 'destination-out';
		lights.forEach(function (light) {
			// 坐标，半径，中心不透明度
			var x = light[0],
				y = light[1],
				r = light[2];
			// 计算衰减距离
			var decDistance = parseInt(r * lightDec);
			// 正方形区域的直径和左上角坐标
			var grd = ctx.createRadialGradient(x, y, decDistance, x, y, r);
			grd.addColorStop(0, "rgba(0,0,0,1)");
			grd.addColorStop(1, "rgba(0,0,0,0)");
			ctx.beginPath();
			ctx.fillStyle = grd;
			ctx.arc(x, y, r, 0, 2 * Math.PI);
			ctx.fill();
		});
		ctx.globalCompositeOperation = 'source-over';
		// 可以在任何地方（如afterXXX或自定义脚本事件）调用函数，方法为  core.plugin.xxx();
	}
},
    "shop": function () {
	// 【全局商店】相关的功能
	// 
	// 打开一个全局商店
	// shopId：要打开的商店id；noRoute：是否不计入录像
	this.openShop = function (shopId, noRoute) {
		var shop = core.status.shops[shopId];
		// Step 1: 检查能否打开此商店
		if (!this.canOpenShop(shopId)) {
			core.drawTip("该商店尚未开启");
			return false;
		}

		// Step 2: （如有必要）记录打开商店的脚本事件
		if (!noRoute) {
			core.status.route.push("shop:" + shopId);
		}

		// Step 3: 检查道具商店 or 公共事件
		if (shop.item) {
			if (core.openItemShop) {
				core.openItemShop(shopId);
			} else {
				core.playSound('操作失败');
				core.insertAction("道具商店插件不存在！请检查是否存在该插件！");
			}
			return;
		}
		if (shop.commonEvent) {
			core.insertCommonEvent(shop.commonEvent, shop.args);
			return;
		}

		_shouldProcessKeyUp = true;

		// Step 4: 执行标准公共商店    
		core.insertAction(this._convertShop(shop));
		return true;
	}

	////// 将一个全局商店转变成可预览的公共事件 //////
	this._convertShop = function (shop) {
		return [
			{ "type": "function", "function": "function() {core.addFlag('@temp@shop', 1);}" },
			{
				"type": "while",
				"condition": "true",
				"data": [
					// 检测能否访问该商店
					{
						"type": "if",
						"condition": "core.isShopVisited('" + shop.id + "')",
						"true": [
							// 可以访问，直接插入执行效果
							{ "type": "function", "function": "function() { core.plugin._convertShop_replaceChoices('" + shop.id + "', false) }" },
						],
						"false": [
							// 不能访问的情况下：检测能否预览
							{
								"type": "if",
								"condition": shop.disablePreview,
								"true": [
									// 不可预览，提示并退出
									{ "type": "playSound", "name": "操作失败" },
									"当前无法访问该商店！",
									{ "type": "break" },
								],
								"false": [
									// 可以预览：将商店全部内容进行替换
									{ "type": "tip", "text": "当前处于预览模式，不可购买" },
									{ "type": "function", "function": "function() { core.plugin._convertShop_replaceChoices('" + shop.id + "', true) }" },
								]
							}
						]
					}
				]
			},
			{ "type": "function", "function": "function() {core.addFlag('@temp@shop', -1);}" }
		];
	}

	this._convertShop_replaceChoices = function (shopId, previewMode) {
		var shop = core.status.shops[shopId];
		var choices = (shop.choices || []).filter(function (choice) {
			if (choice.condition == null || choice.condition == '') return true;
			try { return core.calValue(choice.condition); } catch (e) { return true; }
		}).map(function (choice) {
			var ableToBuy = core.calValue(choice.need);
			return {
				"text": choice.text,
				"icon": choice.icon,
				"color": ableToBuy && !previewMode ? choice.color : [153, 153, 153, 1],
				"action": ableToBuy && !previewMode ? [{ "type": "playSound", "name": "商店" }].concat(choice.action) : [
					{ "type": "playSound", "name": "操作失败" },
					{ "type": "tip", "text": previewMode ? "预览模式下不可购买" : "购买条件不足" }
				]
			};
		}).concat({ "text": "离开", "action": [{ "type": "playSound", "name": "取消" }, { "type": "break" }] });
		core.insertAction({ "type": "choices", "text": shop.text, "choices": choices });
	}

	/// 是否访问过某个快捷商店
	this.isShopVisited = function (id) {
		if (!core.hasFlag("__shops__")) core.setFlag("__shops__", {});
		var shops = core.getFlag("__shops__");
		if (!shops[id]) shops[id] = {};
		return shops[id].visited;
	}

	/// 当前应当显示的快捷商店列表
	this.listShopIds = function () {
		return Object.keys(core.status.shops).filter(function (id) {
			return core.isShopVisited(id) || !core.status.shops[id].mustEnable;
		});
	}

	/// 是否能够打开某个商店
	this.canOpenShop = function (id) {
		if (this.isShopVisited(id)) return true;
		var shop = core.status.shops[id];
		if (shop.item || shop.commonEvent || shop.mustEnable) return false;
		return true;
	}

	/// 启用或禁用某个快捷商店
	this.setShopVisited = function (id, visited) {
		if (!core.hasFlag("__shops__")) core.setFlag("__shops__", {});
		var shops = core.getFlag("__shops__");
		if (!shops[id]) shops[id] = {};
		if (visited) shops[id].visited = true;
		else delete shops[id].visited;
	}

	/// 能否使用快捷商店
	this.canUseQuickShop = function (id) {
		// 如果返回一个字符串，表示不能，字符串为不能使用的提示
		// 返回null代表可以使用

		// 检查当前楼层的canUseQuickShop选项是否为false
		if (core.status.thisMap.canUseQuickShop === false)
			return '当前楼层不能使用快捷商店。';
		return null;
	}

	var _shouldProcessKeyUp = true;

	/// 允许商店X键退出
	core.registerAction('keyUp', 'shops', function (keycode) {
		if (!core.status.lockControl || core.status.event.id != 'action') return false;
		if ((keycode == 13 || keycode == 32) && !_shouldProcessKeyUp) {
			_shouldProcessKeyUp = true;
			return true;
		}

		if (!core.hasFlag("@temp@shop") || core.status.event.data.type != 'choices') return false;
		var data = core.status.event.data.current;
		var choices = data.choices;
		var topIndex = core.actions._getChoicesTopIndex(choices.length);
		if (keycode == 88 || keycode == 27) { // X, ESC
			core.actions._clickAction(core.actions.H_WIDTH, topIndex + choices.length - 1);
			return true;
		}
		return false;
	}, 60);

	/// 允许长按空格或回车连续执行操作
	core.registerAction('keyDown', 'shops', function (keycode) {
		if (!core.status.lockControl || !core.hasFlag("@temp@shop") || core.status.event.id != 'action') return false;
		if (core.status.event.data.type != 'choices') return false;
		var data = core.status.event.data.current;
		var choices = data.choices;
		var topIndex = core.actions._getChoicesTopIndex(choices.length);
		if (keycode == 13 || keycode == 32) { // Space, Enter
			core.actions._clickAction(core.actions.H_WIDTH, topIndex + core.status.event.selection);
			_shouldProcessKeyUp = false;
			return true;
		}
		return false;
	}, 60);

	// 允许长按屏幕连续执行操作
	core.registerAction('longClick', 'shops', function (x, y, px, py) {
		if (!core.status.lockControl || !core.hasFlag("@temp@shop") || core.status.event.id != 'action') return false;
		if (core.status.event.data.type != 'choices') return false;
		var data = core.status.event.data.current;
		var choices = data.choices;
		var topIndex = core.actions._getChoicesTopIndex(choices.length);
		if (x >= core.actions.CHOICES_LEFT && x <= core.actions.CHOICES_RIGHT && y >= topIndex && y < topIndex + choices.length) {
			core.actions._clickAction(x, y);
			return true;
		}
		return false;
	}, 60);
},
    "removeMap": function () {
	// 高层塔砍层插件，删除后不会存入存档，不可浏览地图也不可飞到。
	// 推荐用法：
	// 对于超高层或分区域塔，当在1区时将2区以后的地图删除；1区结束时恢复2区，进二区时删除1区地图，以此类推
	// 这样可以大幅减少存档空间，以及加快存读档速度

	// 删除楼层
	// core.removeMaps("MT1", "MT300") 删除MT1~MT300之间的全部层
	// core.removeMaps("MT10") 只删除MT10层
	this.removeMaps = function (fromId, toId) {
		toId = toId || fromId;
		var fromIndex = core.floorIds.indexOf(fromId),
			toIndex = core.floorIds.indexOf(toId);
		if (toIndex < 0) toIndex = core.floorIds.length - 1;
		flags.__visited__ = flags.__visited__ || {};
		flags.__removed__ = flags.__removed__ || [];
		flags.__disabled__ = flags.__disabled__ || {};
		flags.__leaveLoc__ = flags.__leaveLoc__ || {};
		for (var i = fromIndex; i <= toIndex; ++i) {
			var floorId = core.floorIds[i];
			if (core.status.maps[floorId].deleted) continue;
			delete flags.__visited__[floorId];
			flags.__removed__.push(floorId);
			delete flags.__disabled__[floorId];
			delete flags.__leaveLoc__[floorId];
			(core.status.autoEvents || []).forEach(function (event) {
				if (event.floorId == floorId && event.currentFloor) {
					core.autoEventExecuting(event.symbol, false);
					core.autoEventExecuted(event.symbol, false);
				} 
			});
			core.status.maps[floorId].deleted = true;
			core.status.maps[floorId].canFlyTo = false;
			core.status.maps[floorId].canFlyFrom = false;
			core.status.maps[floorId].cannotViewMap = true;
		}
	}

	// 恢复楼层
	// core.resumeMaps("MT1", "MT300") 恢复MT1~MT300之间的全部层
	// core.resumeMaps("MT10") 只恢复MT10层
	this.resumeMaps = function (fromId, toId) {
		toId = toId || fromId;
		var fromIndex = core.floorIds.indexOf(fromId),
			toIndex = core.floorIds.indexOf(toId);
		if (toIndex < 0) toIndex = core.floorIds.length - 1;
		flags.__removed__ = flags.__removed__ || [];
		for (var i = fromIndex; i <= toIndex; ++i) {
			var floorId = core.floorIds[i];
			if (!core.status.maps[floorId].deleted) continue;
			flags.__removed__ = flags.__removed__.filter(function (f) { return f != floorId; });
			core.status.maps[floorId] = core.loadFloor(floorId);
		}
	}

	// 分区砍层相关
	var inAnyPartition = function (floorId) {
		var inPartition = false;
		(core.floorPartitions || []).forEach(function (floor) {
			var fromIndex = core.floorIds.indexOf(floor[0]);
			var toIndex = core.floorIds.indexOf(floor[1]);
			var index = core.floorIds.indexOf(floorId);
			if (fromIndex < 0 || index < 0) return;
			if (toIndex < 0) toIndex = core.floorIds.length - 1;
			if (index >= fromIndex && index <= toIndex) inPartition = true;
		});
		return inPartition;
	}

	// 分区砍层
	this.autoRemoveMaps = function (floorId) {
		if (main.mode != 'play' || !inAnyPartition(floorId)) return;
		// 根据分区信息自动砍层与恢复
		(core.floorPartitions || []).forEach(function (floor) {
			var fromIndex = core.floorIds.indexOf(floor[0]);
			var toIndex = core.floorIds.indexOf(floor[1]);
			var index = core.floorIds.indexOf(floorId);
			if (fromIndex < 0 || index < 0) return;
			if (toIndex < 0) toIndex = core.floorIds.length - 1;
			if (index >= fromIndex && index <= toIndex) {
				core.resumeMaps(core.floorIds[fromIndex], core.floorIds[toIndex]);
			} else {
				core.removeMaps(core.floorIds[fromIndex], core.floorIds[toIndex]);
			}
		});
	}
},
    "fiveLayers": function () {
	// 是否启用五图层（增加背景2层和前景2层） 将__enable置为true即会启用；启用后请保存后刷新编辑器
	// 背景层2将会覆盖背景层 被事件层覆盖 前景层2将会覆盖前景层
	// 另外 请注意加入两个新图层 会让大地图的性能降低一些
	// 插件作者：ad
	var __enable = false;
	if (!__enable) return;

	// 创建新图层
	function createCanvas(name, zIndex) {
		if (!name) return;
		var canvas = document.createElement('canvas');
		canvas.id = name;
		canvas.className = 'gameCanvas';
		// 编辑器模式下设置zIndex会导致加入的图层覆盖优先级过高
		if (main.mode != "editor") canvas.style.zIndex = zIndex || 0;
		// 将图层插入进游戏内容
		document.getElementById('gameDraw').appendChild(canvas);
		var ctx = canvas.getContext('2d');
		core.canvas[name] = ctx;
		canvas.width = core.__PX_WIDTH__;
		canvas.height = core.__PX_HEIGHT__;
		return canvas;
	}

	var bg2Canvas = createCanvas('bg2', 20);
	var fg2Canvas = createCanvas('fg2', 63);
	// 大地图适配
	core.bigmap.canvas = ["bg2", "fg2", "bg", "event", "event2", "fg", "damage"];
	core.initStatus.bg2maps = {};
	core.initStatus.fg2maps = {};

	if (main.mode == 'editor') {
		/*插入编辑器的图层 不做此步新增图层无法在编辑器显示*/
		// 编辑器图层覆盖优先级 eui > efg > fg(前景层) > event2(48*32图块的事件层) > event(事件层) > bg(背景层)
		// 背景层2(bg2) 插入事件层(event)之前(即bg与event之间)
		document.getElementById('mapEdit').insertBefore(bg2Canvas, document.getElementById('event'));
		// 前景层2(fg2) 插入编辑器前景(efg)之前(即fg之后)
		document.getElementById('mapEdit').insertBefore(fg2Canvas, document.getElementById('ebm'));
		// 原本有三个图层 从4开始添加
		var num = 4;
		// 新增图层存入editor.dom中
		editor.dom.bg2c = core.canvas.bg2.canvas;
		editor.dom.bg2Ctx = core.canvas.bg2;
		editor.dom.fg2c = core.canvas.fg2.canvas;
		editor.dom.fg2Ctx = core.canvas.fg2;
		editor.dom.maps.push('bg2map', 'fg2map');
		editor.dom.canvas.push('bg2', 'fg2');

		// 创建编辑器上的按钮
		var createCanvasBtn = function (name) {
			// 电脑端创建按钮
			var input = document.createElement('input');
			// layerMod4/layerMod5
			var id = 'layerMod' + num++;
			// bg2map/fg2map
			var value = name + 'map';
			input.type = 'radio';
			input.name = 'layerMod';
			input.id = id;
			input.value = value;
			editor.dom[id] = input;
			input.onchange = function () {
				editor.uifunctions.setLayerMod(value);
			}
			return input;
		};

		var createCanvasBtn_mobile = function (name) {
			// 手机端往选择列表中添加子选项
			var input = document.createElement('option');
			var id = 'layerMod' + num++;
			var value = name + 'map';
			input.name = 'layerMod';
			input.value = value;
			editor.dom[id] = input;
			return input;
		};
		if (!editor.isMobile) {
			var input = createCanvasBtn('bg2');
			var input2 = createCanvasBtn('fg2');
			// 获取事件层及其父节点
			var child = document.getElementById('layerMod'),
				parent = child.parentNode;
			// 背景层2插入事件层前
			parent.insertBefore(input, child);
			// 不能直接更改背景层2的innerText 所以创建文本节点
			var txt = document.createTextNode('背景2');
			// 插入事件层前(即新插入的背景层2前)
			parent.insertBefore(txt, child);
			// 向最后插入前景层2(即插入前景层后)
			parent.appendChild(input2);
			var txt2 = document.createTextNode('前景2');
			parent.appendChild(txt2);
			// parent.childNodes[2].replaceWith("bg");
			// parent.childNodes[6].replaceWith("事件");
			// parent.childNodes[8].replaceWith("fg");
		} else {
			var input = createCanvasBtn_mobile('bg2');
			var input2 = createCanvasBtn_mobile('fg2');
			// 手机端因为是选项 所以可以直接改innerText
			input.innerText = '背景层2';
			input2.innerText = '前景层2';
			var parent = document.getElementById('layerMod');
			parent.insertBefore(input, parent.children[1]);
			parent.appendChild(input2);
		}
	}

	var _loadFloor_doNotCopy = core.maps._loadFloor_doNotCopy;
	core.maps._loadFloor_doNotCopy = function () {
		return ["bg2map", "fg2map"].concat(_loadFloor_doNotCopy());
	}
	////// 绘制背景和前景层 //////
	core.maps._drawBg_draw = function (floorId, toDrawCtx, cacheCtx, config) {
		config.ctx = cacheCtx;
		core.maps._drawBg_drawBackground(floorId, config);
		// ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制背景图块；后绘制的覆盖先绘制的。
		core.maps._drawFloorImages(floorId, config.ctx, 'bg', null, null, config.onMap);
		core.maps._drawBgFgMap(floorId, 'bg', config);
		if (config.onMap) {
			core.drawImage(toDrawCtx, cacheCtx.canvas, core.bigmap.v2 ? -32 : 0, core.bigmap.v2 ? -32 : 0);
			core.clearMap('bg2');
			core.clearMap(cacheCtx);
		}
		core.maps._drawBgFgMap(floorId, 'bg2', config);
		if (config.onMap) core.drawImage('bg2', cacheCtx.canvas, core.bigmap.v2 ? -32 : 0, core.bigmap.v2 ? -32 : 0);
		config.ctx = toDrawCtx;
	}
	core.maps._drawFg_draw = function (floorId, toDrawCtx, cacheCtx, config) {
		config.ctx = cacheCtx;
		// ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制前景图块；后绘制的覆盖先绘制的。
		core.maps._drawFloorImages(floorId, config.ctx, 'fg', null, null, config.onMap);
		core.maps._drawBgFgMap(floorId, 'fg', config);
		if (config.onMap) {
			core.drawImage(toDrawCtx, cacheCtx.canvas, core.bigmap.v2 ? -32 : 0, core.bigmap.v2 ? -32 : 0);
			core.clearMap('fg2');
			core.clearMap(cacheCtx);
		}
		core.maps._drawBgFgMap(floorId, 'fg2', config);
		if (config.onMap) core.drawImage('fg2', cacheCtx.canvas, core.bigmap.v2 ? -32 : 0, core.bigmap.v2 ? -32 : 0);
		config.ctx = toDrawCtx;
	}
	////// 移动判定 //////
	core.maps._generateMovableArray_arrays = function (floorId) {
		return {
			bgArray: this.getBgMapArray(floorId),
			fgArray: this.getFgMapArray(floorId),
			eventArray: this.getMapArray(floorId),
			bg2Array: this._getBgFgMapArray('bg2', floorId),
			fg2Array: this._getBgFgMapArray('fg2', floorId)
		};
	}
},
    "itemShop": function () {
	// 道具商店相关的插件
	// 可在全塔属性-全局商店中使用「道具商店」事件块进行编辑（如果找不到可以在入口方块中找）

	var shopId = null; // 当前商店ID
	var type = 0; // 当前正在选中的类型，0买入1卖出
	var selectItem = 0; // 当前正在选中的道具
	var selectCount = 0; // 当前已经选中的数量
	var page = 0;
	var totalPage = 0;
	var totalMoney = 0;
	var list = [];
	var shopInfo = null; // 商店信息
	var choices = []; // 商店选项
	var use = 'money';
	var useText = '金币';

	var bigFont = core.ui._buildFont(20, false),
		middleFont = core.ui._buildFont(18, false);

	this._drawItemShop = function () {
		// 绘制道具商店

		// Step 1: 背景和固定的几个文字
		core.ui._createUIEvent();
		core.clearMap('uievent');
		core.ui.clearUIEventSelector();
		core.setTextAlign('uievent', 'left');
		core.setTextBaseline('uievent', 'top');
		core.fillRect('uievent', 0, 0, 416, 416, 'black');
		core.drawWindowSkin('winskin.png', 'uievent', 0, 0, 416, 56);
		core.drawWindowSkin('winskin.png', 'uievent', 0, 56, 312, 56);
		core.drawWindowSkin('winskin.png', 'uievent', 0, 112, 312, 304);
		core.drawWindowSkin('winskin.png', 'uievent', 312, 56, 104, 56);
		core.drawWindowSkin('winskin.png', 'uievent', 312, 112, 104, 304);
		core.setFillStyle('uievent', 'white');
		core.setStrokeStyle('uievent', 'white');
		core.fillText("uievent", "购买", 32, 74, 'white', bigFont);
		core.fillText("uievent", "卖出", 132, 74);
		core.fillText("uievent", "离开", 232, 74);
		core.fillText("uievent", "当前" + useText, 324, 66, null, middleFont);
		core.setTextAlign("uievent", "right");
		core.fillText("uievent", core.formatBigNumber(core.status.hero[use]), 405, 89);
		core.setTextAlign("uievent", "left");
		core.ui.drawUIEventSelector(1, "winskin.png", 22 + 100 * type, 66, 60, 33);
		if (selectItem != null) {
			core.setTextAlign('uievent', 'center');
			core.fillText("uievent", type == 0 ? "买入个数" : "卖出个数", 364, 320, null, bigFont);
			core.fillText("uievent", "<   " + selectCount + "   >", 364, 350);
			core.fillText("uievent", "确定", 364, 380);
		}

		// Step 2：获得列表并展示
		list = choices.filter(function (one) {
			if (one.condition != null && one.condition != '') {
				try { if (!core.calValue(one.condition)) return false; } catch (e) {}
			}
			return (type == 0 && one.money != null) || (type == 1 && one.sell != null);
		});
		var per_page = 6;
		totalPage = Math.ceil(list.length / per_page);
		page = Math.floor((selectItem || 0) / per_page) + 1;

		// 绘制分页
		if (totalPage > 1) {
			var half = 156;
			core.setTextAlign('uievent', 'center');
			core.fillText('uievent', page + " / " + totalPage, half, 388, null, middleFont);
			if (page > 1) core.fillText('uievent', '上一页', half - 80, 388);
			if (page < totalPage) core.fillText('uievent', '下一页', half + 80, 388);
		}
		core.setTextAlign('uievent', 'left');

		// 绘制每一项
		var start = (page - 1) * per_page;
		for (var i = 0; i < per_page; ++i) {
			var curr = start + i;
			if (curr >= list.length) break;
			var item = list[curr];
			core.drawIcon('uievent', item.id, 10, 125 + i * 40);
			core.setTextAlign('uievent', 'left');
			core.fillText('uievent', core.material.items[item.id].name, 50, 132 + i * 40, null, bigFont);
			core.setTextAlign('uievent', 'right');
			core.fillText('uievent', (type == 0 ? core.calValue(item.money) : core.calValue(item.sell)) + useText + "/个", 300, 133 + i * 40, null, middleFont);
			core.setTextAlign("uievent", "left");
			if (curr == selectItem) {
				// 绘制描述，文字自动放缩
				var text = core.material.items[item.id].text || "该道具暂无描述";
				try { text = core.replaceText(text); } catch (e) {}
				for (var fontSize = 20; fontSize >= 8; fontSize -= 2) {
					var config = { left: 10, fontSize: fontSize, maxWidth: 403 };
					var height = core.getTextContentHeight(text, config);
					if (height <= 50) {
						config.top = (56 - height) / 2;
						core.drawTextContent("uievent", text, config);
						break;
					}
				}
				core.ui.drawUIEventSelector(2, "winskin.png", 8, 120 + i * 40, 295, 40);
				if (type == 0 && item.number != null) {
					core.fillText("uievent", "存货", 324, 132, null, bigFont);
					core.setTextAlign("uievent", "right");
					core.fillText("uievent", item.number, 406, 132, null, null, 40);
				} else if (type == 1) {
					core.fillText("uievent", "数量", 324, 132, null, bigFont);
					core.setTextAlign("uievent", "right");
					core.fillText("uievent", core.itemCount(item.id), 406, 132, null, null, 40);
				}
				core.setTextAlign("uievent", "left");
				core.fillText("uievent", "预计" + useText, 324, 250);
				core.setTextAlign("uievent", "right");
				totalMoney = selectCount * (type == 0 ? core.calValue(item.money) : core.calValue(item.sell));
				core.fillText("uievent", core.formatBigNumber(totalMoney), 405, 280);

				core.setTextAlign("uievent", "left");
				core.fillText("uievent", type == 0 ? "已购次数" : "已卖次数", 324, 170);
				core.setTextAlign("uievent", "right");
				core.fillText("uievent", (type == 0 ? item.money_count : item.sell_count) || 0, 405, 200);
			}
		}

		core.setTextAlign('uievent', 'left');
		core.setTextBaseline('uievent', 'alphabetic');
	}

	var _add = function (item, delta) {
		if (item == null) return;
		selectCount = core.clamp(
			selectCount + delta, 0,
			Math.min(type == 0 ? Math.floor(core.status.hero[use] / core.calValue(item.money)) : core.itemCount(item.id),
				type == 0 && item.number != null ? item.number : Number.MAX_SAFE_INTEGER)
		);
	}

	var _confirm = function (item) {
		if (item == null || selectCount == 0) return;
		if (type == 0) {
			core.status.hero[use] -= totalMoney;
			core.getItem(item.id, selectCount);
			core.stopSound();
			core.playSound('确定');
			if (item.number != null) item.number -= selectCount;
			item.money_count = (item.money_count || 0) + selectCount;
		} else {
			core.status.hero[use] += totalMoney;
			core.removeItem(item.id, selectCount);
			core.playSound('确定');
			core.drawTip("成功卖出" + selectCount + "个" + core.material.items[item.id].name, item.id);
			if (item.number != null) item.number += selectCount;
			item.sell_count = (item.sell_count || 0) + selectCount;
		}
		selectCount = 0;
	}

	this._performItemShopKeyBoard = function (keycode) {
		var item = list[selectItem] || null;
		// 键盘操作
		switch (keycode) {
		case 38: // up
			if (selectItem == null) break;
			if (selectItem == 0) selectItem = null;
			else selectItem--;
			selectCount = 0;
			break;
		case 37: // left
			if (selectItem == null) {
				if (type > 0) type--;
				break;
			}
			_add(item, -1);
			break;
		case 39: // right
			if (selectItem == null) {
				if (type < 2) type++;
				break;
			}
			_add(item, 1);
			break;
		case 40: // down
			if (selectItem == null) {
				if (list.length > 0) selectItem = 0;
				break;
			}
			if (list.length == 0) break;
			selectItem = Math.min(selectItem + 1, list.length - 1);
			selectCount = 0;
			break;
		case 13:
		case 32: // Enter/Space
			if (selectItem == null) {
				if (type == 2)
					core.insertAction({ "type": "break" });
				else if (list.length > 0)
					selectItem = 0;
				break;
			}
			_confirm(item);
			break;
		case 27: // ESC
			if (selectItem == null) {
				core.insertAction({ "type": "break" });
				break;
			}
			selectItem = null;
			break;
		}
	}

	this._performItemShopClick = function (px, py) {
		var item = list[selectItem] || null;
		// 鼠标操作
		if (px >= 22 && px <= 82 && py >= 71 && py <= 102) {
			// 买
			if (type != 0) {
				type = 0;
				selectItem = null;
				selectCount = 0;
			}
			return;
		}
		if (px >= 122 && px <= 182 && py >= 71 && py <= 102) {
			// 卖
			if (type != 1) {
				type = 1;
				selectItem = null;
				selectCount = 0;
			}
			return;
		}
		if (px >= 222 && px <= 282 && py >= 71 && py <= 102) // 离开
			return core.insertAction({ "type": "break" });
		// < >
		if (px >= 318 && px <= 341 && py >= 348 && py <= 376)
			return _add(item, -1);
		if (px >= 388 && px <= 416 && py >= 348 && py <= 376)
			return _add(item, 1);
		// 确定
		if (px >= 341 && px <= 387 && py >= 380 && py <= 407)
			return _confirm(item);

		// 上一页/下一页
		if (px >= 45 && px <= 105 && py >= 388) {
			if (page > 1) {
				selectItem -= 6;
				selectCount = 0;
			}
			return;
		}
		if (px >= 208 && px <= 268 && py >= 388) {
			if (page < totalPage) {
				selectItem = Math.min(selectItem + 6, list.length - 1);
				selectCount = 0;
			}
			return;
		}

		// 实际区域
		if (px >= 9 && px <= 300 && py >= 120 && py < 360) {
			if (list.length == 0) return;
			var index = parseInt((py - 120) / 40);
			var newItem = 6 * (page - 1) + index;
			if (newItem >= list.length) newItem = list.length - 1;
			if (newItem != selectItem) {
				selectItem = newItem;
				selectCount = 0;
			}
			return;
		}
	}

	this._performItemShopAction = function () {
		if (flags.type == 0) return this._performItemShopKeyBoard(flags.keycode);
		else return this._performItemShopClick(flags.px, flags.py);
	}

	this.openItemShop = function (itemShopId) {
		shopId = itemShopId;
		type = 0;
		page = 0;
		selectItem = null;
		selectCount = 0;
		core.isShopVisited(itemShopId);
		shopInfo = flags.__shops__[shopId];
		if (shopInfo.choices == null) shopInfo.choices = core.clone(core.status.shops[shopId].choices);
		choices = shopInfo.choices;
		use = core.status.shops[shopId].use;
		if (use != 'exp') use = 'money';
		useText = use == 'money' ? '金币' : '经验';

		core.insertAction([{
				"type": "while",
				"condition": "true",
				"data": [
					{ "type": "function", "function": "function () { core.plugin._drawItemShop(); }" },
					{ "type": "wait" },
					{ "type": "function", "function": "function() { core.plugin._performItemShopAction(); }" }
				]
			},
			{
				"type": "function",
				"function": "function () { core.deleteCanvas('uievent'); core.ui.clearUIEventSelector(); }"
			}
		]);
	}

},
    "enemyLevel": function () {
	// 此插件将提供怪物手册中的怪物境界显示
	// 使用此插件需要先给每个怪物定义境界，方法如下：
	// 点击怪物的【配置表格】，找到“【怪物】相关的表格配置”，然后在【名称】仿照增加境界定义：
	/*
	 "level": {
	 	"_leaf": true,
	 	"_type": "textarea",
	 	"_string": true,
	 	"_data": "境界"
	 },
	 */
	// 然后保存刷新，可以看到怪物的属性定义中出现了【境界】。再开启本插件即可。

	// 是否开启本插件，默认禁用；将此改成 true 将启用本插件。
	var __enable = false;
	if (!__enable) return;

	// 这里定义每个境界的显示颜色；可以写'red', '#RRGGBB' 或者[r,g,b,a]四元数组
	var levelToColors = {
		"萌新一阶": "red",
		"萌新二阶": "#FF0000",
		"萌新三阶": [255, 0, 0, 1],
	};

	// 复写 _drawBook_drawName
	var originDrawBook = core.ui._drawBook_drawName;
	core.ui._drawBook_drawName = function (index, enemy, top, left, width) {
		// 如果没有境界，则直接调用原始代码绘制
		if (!enemy.level) return originDrawBook.call(core.ui, index, enemy, top, left, width);
		// 存在境界，则额外进行绘制
		core.setTextAlign('ui', 'center');
		if (enemy.specialText.length == 0) {
			core.fillText('ui', enemy.name, left + width / 2,
				top + 27, '#DDDDDD', this._buildFont(17, true));
			core.fillText('ui', enemy.level, left + width / 2,
				top + 51, core.arrayToRGBA(levelToColors[enemy.level] || '#DDDDDD'), this._buildFont(14, true));
		} else {
			core.fillText('ui', enemy.name, left + width / 2,
				top + 20, '#DDDDDD', this._buildFont(17, true), width);
			switch (enemy.specialText.length) {
			case 1:
				core.fillText('ui', enemy.specialText[0], left + width / 2,
					top + 38, core.arrayToRGBA((enemy.specialColor || [])[0] || '#FF6A6A'),
					this._buildFont(14, true), width);
				break;
			case 2:
				// Step 1: 计算字体
				var text = enemy.specialText[0] + "  " + enemy.specialText[1];
				core.setFontForMaxWidth('ui', text, width, this._buildFont(14, true));
				// Step 2: 计算总宽度
				var totalWidth = core.calWidth('ui', text);
				var leftWidth = core.calWidth('ui', enemy.specialText[0]);
				var rightWidth = core.calWidth('ui', enemy.specialText[1]);
				// Step 3: 绘制
				core.fillText('ui', enemy.specialText[0], left + (width + leftWidth - totalWidth) / 2,
					top + 38, core.arrayToRGBA((enemy.specialColor || [])[0] || '#FF6A6A'));
				core.fillText('ui', enemy.specialText[1], left + (width + totalWidth - rightWidth) / 2,
					top + 38, core.arrayToRGBA((enemy.specialColor || [])[1] || '#FF6A6A'));
				break;
			default:
				core.fillText('ui', '多属性...', left + width / 2,
					top + 38, '#FF6A6A', this._buildFont(14, true), width);
			}
			core.fillText('ui', enemy.level, left + width / 2,
				top + 56, core.arrayToRGBA(levelToColors[enemy.level] || '#DDDDDD'), this._buildFont(14, true));
		}
	}

	// 也可以复写其他的属性颜色如怪物攻防等，具体参见下面的例子的注释部分
	core.ui._drawBook_drawRow1 = function (index, enemy, top, left, width, position) {
		// 绘制第一行
		core.setTextAlign('ui', 'left');
		var b13 = this._buildFont(13, true),
			f13 = this._buildFont(13, false);
		var col1 = left,
			col2 = left + width * 9 / 25,
			col3 = left + width * 17 / 25;
		core.fillText('ui', '生命', col1, position, '#DDDDDD', f13);
		core.fillText('ui', core.formatBigNumber(enemy.hp || 0), col1 + 30, position, /*'red' */ null, b13);
		core.fillText('ui', '攻击', col2, position, null, f13);
		core.fillText('ui', core.formatBigNumber(enemy.atk || 0), col2 + 30, position, /* '#FF0000' */ null, b13);
		core.fillText('ui', '防御', col3, position, null, f13);
		core.fillText('ui', core.formatBigNumber(enemy.def || 0), col3 + 30, position, /* [255, 0, 0, 1] */ null, b13);
	}


},
    "dynamicHp": function () {
	// 此插件允许人物血量动态进行变化
	// 原作：Fux2（老黄鸡）

	// 是否开启本插件，默认禁用；将此改成 true 将启用本插件。
	var __enable = false;
	if (!__enable) return;

	var speed = 0.05; // 动态血量变化速度，越大越快。

	var _currentHp = null;
	var _lastStatus = null;
	var _check = function () {
		if (_lastStatus != core.status.hero) {
			_lastStatus = core.status.hero;
			_currentHp = core.status.hero.hp;
		}
	}

	core.registerAnimationFrame('dynamicHp', true, function () {
		_check();
		if (core.status.hero.hp != _currentHp) {
			var dis = (_currentHp - core.status.hero.hp) * speed;
			if (Math.abs(dis) < 2) {
				_currentHp = core.status.hero.hp;
			} else {
				_currentHp -= dis;
			}
			core.setStatusBarInnerHTML('hp', _currentHp);
		}
	});
},
    "multiHeros": function () {
	// 多角色插件
	// Step 1: 启用本插件
	// Step 2: 定义每个新的角色各项初始数据（参见下方注释）
	// Step 3: 在游戏中的任何地方都可以调用 `core.changeHero()` 进行切换；也可以 `core.changeHero(1)` 来切换到某个具体的角色上

	// 是否开启本插件，默认禁用；将此改成 true 将启用本插件。
	var __enable = false;
	if (!__enable) return;

	// 在这里定义全部的新角色属性
	// 请注意，在这里定义的内容不会多角色共用，在切换时会进行恢复。
	// 你也可以自行新增或删除，比如不共用金币则可以加上"money"的初始化，不共用道具则可以加上"items"的初始化，
	// 多角色共用hp的话则删除hp，等等。总之，不共用的属性都在这里进行定义就好。
	var hero1 = {
		"floorId": "MT0", // 该角色初始楼层ID；如果共用楼层可以注释此项
		"image": "brave.png", // 角色的行走图名称；此项必填不然会报错
		"name": "1号角色",
		"lv": 1,
		"hp": 10000, // 如果HP共用可注释此项
		"atk": 1000,
		"def": 1000,
		"mdef": 0,
		// "money": 0, // 如果要不共用金币则取消此项注释
		// "exp": 0, // 如果要不共用经验则取消此项注释
		"loc": { "x": 0, "y": 0, "direction": "up" }, // 该角色初始位置；如果共用位置可注释此项
		"items": {
			"tools": {}, // 如果共用消耗道具（含钥匙）则可注释此项
			// "constants": {}, // 如果不共用永久道具（如手册）可取消注释此项
			"equips": {}, // 如果共用在背包的装备可注释此项
		},
		"equipment": [], // 如果共用装备可注释此项；此项和上面的「共用在背包的装备」需要拥有相同状态，不然可能出现问题
	};
	// 也可以类似新增其他角色
	// 新增的角色，各项属性共用与不共用的选择必须和上面完全相同，否则可能出现问题。
	// var hero2 = { ...

	var heroCount = 2; // 包含默认角色在内总共多少个角色，该值需手动修改。

	this.initHeros = function () {
		core.setFlag("hero1", core.clone(hero1)); // 将属性值存到变量中
		// core.setFlag("hero2", core.clone(hero2)); // 更多的角色也存入变量中；每个定义的角色都需要新增一行

		// 检测是否存在装备
		if (hero1.equipment) {
			if (!hero1.items || !hero1.items.equips) {
				alert('多角色插件的equipment和道具中的equips必须拥有相同状态！');
			}
			// 存99号套装为全空
			var saveEquips = core.getFlag("saveEquips", []);
			saveEquips[99] = [];
			core.setFlag("saveEquips", saveEquips);
		} else {
			if (hero1.items && hero1.items.equips) {
				alert('多角色插件的equipment和道具中的equips必须拥有相同状态！');
			}
		}
	}

	// 在游戏开始注入initHeros
	var _startGame_setHard = core.events._startGame_setHard;
	core.events._startGame_setHard = function () {
		_startGame_setHard.call(core.events);
		core.initHeros();
	}

	// 切换角色
	// 可以使用 core.changeHero() 来切换到下一个角色
	// 也可以 core.changeHero(1) 来切换到某个角色（默认角色为0）
	this.changeHero = function (toHeroId) {
		var currHeroId = core.getFlag("heroId", 0); // 获得当前角色ID
		if (toHeroId == null) {
			toHeroId = (currHeroId + 1) % heroCount;
		}
		if (currHeroId == toHeroId) return;

		var saveList = Object.keys(hero1);

		// 保存当前内容
		var toSave = {};
		// 暂时干掉 drawTip 和 音效，避免切装时的提示
		var _drawTip = core.ui.drawTip;
		core.ui.drawTip = function () {};
		var _playSound = core.control.playSound;
		core.control.playSound = function () {}
		// 记录当前录像，因为可能存在换装问题
		core.clearRouteFolding();
		var routeLength = core.status.route.length;
		// 优先判定装备
		if (hero1.equipment) {
			core.items.quickSaveEquip(100 + currHeroId);
			core.items.quickLoadEquip(99);
		}

		saveList.forEach(function (name) {
			if (name == 'floorId') toSave[name] = core.status.floorId; // 楼层单独设置
			else if (name == 'items') {
				toSave.items = core.clone(core.status.hero.items);
				Object.keys(toSave.items).forEach(function (one) {
					if (!hero1.items[one]) delete toSave.items[one];
				});
			} else toSave[name] = core.clone(core.status.hero[name]); // 使用core.clone()来创建新对象
		});

		core.setFlag("hero" + currHeroId, toSave); // 将当前角色信息进行保存
		var data = core.getFlag("hero" + toHeroId); // 获得要切换的角色保存内容

		// 设置角色的属性值
		saveList.forEach(function (name) {
			if (name == "floorId");
			else if (name == "items") {
				Object.keys(core.status.hero.items).forEach(function (one) {
					if (data.items[one]) core.status.hero.items[one] = core.clone(data.items[one]);
				});
			} else {
				core.status.hero[name] = core.clone(data[name]);
			}
		});
		// 最后装上装备
		if (hero1.equipment) {
			core.items.quickLoadEquip(100 + toHeroId);
		}

		core.ui.drawTip = _drawTip;
		core.control.playSound = _playSound;
		core.status.route = core.status.route.slice(0, routeLength);
		core.control._bindRoutePush();

		// 插入事件：改变角色行走图并进行楼层切换
		var toFloorId = data.floorId || core.status.floorId;
		var toLoc = data.loc || core.status.hero.loc;
		core.insertAction([
			{ "type": "setHeroIcon", "name": data.image || "hero.png" }, // 改变行走图
			// 同层则用changePos，不同层则用changeFloor；这是为了避免共用楼层造成触发eachArrive
			toFloorId != core.status.floorId ? {
				"type": "changeFloor",
				"floorId": toFloorId,
				"loc": [toLoc.x, toLoc.y],
				"direction": toLoc.direction,
				"time": 0 // 可以在这里设置切换时间
			} : { "type": "changePos", "loc": [toLoc.x, toLoc.y], "direction": toLoc.direction }
			// 你还可以在这里执行其他事件，比如增加或取消跟随效果
		]);
		core.setFlag("heroId", toHeroId); // 保存切换到的角色ID
	}
},
    "itemCategory": function () {
	// 物品分类插件。此插件允许你对消耗道具和永久道具进行分类，比如标记「宝物类」「剧情道具」「药品」等等。
	// 使用方法：
	// 1. 启用本插件
	// 2. 在下方数组中定义全部的物品分类类型
	// 3. 点击道具的【配置表格】，找到“【道具】相关的表格配置”，然后在【道具描述】之后仿照增加道具的分类：
	/*
	 "category": {
	 	"_leaf": true,
	 	"_type": "textarea",
	 	"_string": true,
	 	"_data": "道具分类"
	 },
	 */
	// （你也可以选择使用下拉框的方式定义每个道具的分类，写法参见上面的cls）
	// 然后刷新编辑器，就可以对每个物品进行分类了

	// 是否开启本插件，默认禁用；将此改成 true 将启用本插件。
	var __enable = false;
	if (!__enable) return;

	// 在这里定义所有的道具分类类型，一行一个
	var categories = [
		"宝物类",
		"辅助类",
		"技能类",
		"剧情道具",
		"增益道具",
	];
	// 当前选中的道具类别
	var currentCategory = null;

	// 重写 core.ui._drawToolbox 以绘制分类类别
	var _drawToolbox = core.ui._drawToolbox;
	core.ui._drawToolbox = function (index) {
		_drawToolbox.call(this, index);
		core.setTextAlign('ui', 'left');
		core.fillText('ui', '类别[E]：' + (currentCategory || "全部"), 15, this.PX_WIDTH - 13);
	}

	// 获得所有应该在道具栏显示的某个类型道具
	core.ui.getToolboxItems = function (cls) {
		// 检查类别
		return Object.keys(core.status.hero.items[cls])
			.filter(function (id) {
				return !core.material.items[id].hideInToolbox &&
					(currentCategory == null || core.material.items[id].category == currentCategory);
			}).sort();
	}

	// 注入道具栏的点击事件（点击类别）
	var _clickToolbox = core.actions._clickToolbox;
	core.actions._clickToolbox = function (x, y) {
		if (x >= 0 && x <= this.H_WIDTH - 4 && y == this.Y_LAST) {
			drawToolboxCategory();
			return;
		}
		return _clickToolbox.call(core.actions, x, y);
	}

	// 注入道具栏的按键事件（E键）
	var _keyUpToolbox = core.actions._keyUpToolbox;
	core.actions._keyUpToolbox = function (keyCode) {
		if (keyCode == 69) {
			// 按E键则打开分类类别选择
			drawToolboxCategory();
			return;
		}
		return _keyUpToolbox.call(core.actions, keyCode);
	}

	// ------ 以下为选择道具分类的相关代码 ------ //

	// 关闭窗口时清除分类选择项
	var _closePanel = core.ui.closePanel;
	core.ui.closePanel = function () {
		currentCategory = null;
		_closePanel.call(core.ui);
	}

	// 弹出菜单以选择具体哪个分类
	// 直接使用 core.drawChoices 进行绘制
	var drawToolboxCategory = function () {
		if (core.status.event.id != 'toolbox') return;
		var selection = categories.indexOf(currentCategory) + 1;
		core.ui.closePanel();
		core.status.event.id = 'toolbox-category';
		core.status.event.selection = selection;
		core.lockControl();
		// 给第一项插入「全部」
		core.drawChoices('请选择道具类别', ["全部"].concat(categories));
	}

	// 选择某一项
	var _selectCategory = function (index) {
		core.ui.closePanel();
		if (index <= 0 || index > categories.length) currentCategory = null;
		else currentCategory = categories[index - 1];
		core.openToolbox();
	}

	var _clickToolBoxCategory = function (x, y) {
		if (!core.status.lockControl || core.status.event.id != 'toolbox-category') return false;

		if (x < core.actions.CHOICES_LEFT || x > core.actions.CHOICES_RIGHT) return false;
		var choices = core.status.event.ui.choices;
		var topIndex = core.actions._getChoicesTopIndex(choices.length);
		if (y >= topIndex && y < topIndex + choices.length) {
			_selectCategory(y - topIndex);
		}
		return true;
	}

	// 注入点击事件
	core.registerAction('onclick', 'toolbox-category', _clickToolBoxCategory, 100);

	// 注入光标跟随事件
	core.registerAction('onmove', 'toolbox-category', function (x, y) {
		if (!core.status.lockControl || core.status.event.id != 'toolbox-category') return false;
		core.actions._onMoveChoices(x, y);
		return true;
	}, 100);

	// 注入键盘光标事件
	core.registerAction('keyDown', 'toolbox-category', function (keyCode) {
		if (!core.status.lockControl || core.status.event.id != 'toolbox-category') return false;
		core.actions._keyDownChoices(keyCode);
		return true;
	}, 100);

	// 注入键盘按键事件
	core.registerAction('keyUp', 'toolbox-category', function (keyCode) {
		if (!core.status.lockControl || core.status.event.id != 'toolbox-category') return false;
		core.actions._selectChoices(core.status.event.ui.choices.length, keyCode, _clickToolBoxCategory);
		return true;
	}, 100);

},
    "heroFourFrames": function () {
	// 样板的勇士/跟随者移动时只使用2、4两帧，观感较差。本插件可以将四帧全用上。

	// 是否启用本插件
	var __enable = true;
	if (!__enable) return;

	["up", "down", "left", "right"].forEach(function (one) {
		// 指定中间帧动画
		core.material.icons.hero[one].midFoot = 2;
	});

	var heroMoving = function (timestamp) {
		if (core.status.heroMoving <= 0) return;
		if (timestamp - core.animateFrame.moveTime > core.values.moveSpeed) {
			core.animateFrame.leftLeg++;
			core.animateFrame.moveTime = timestamp;
		}
		core.drawHero(['stop', 'leftFoot', 'midFoot', 'rightFoot'][core.animateFrame.leftLeg % 4], 4 * core.status.heroMoving);
	}
	core.registerAnimationFrame('heroMoving', true, heroMoving);

	core.events._eventMoveHero_moving = function (step, moveSteps) {
		var curr = moveSteps[0];
		var direction = curr[0], x = core.getHeroLoc('x'), y = core.getHeroLoc('y');
		// ------ 前进/后退
		var o = direction == 'backward' ? -1 : 1;
		if (direction == 'forward' || direction == 'backward') direction = core.getHeroLoc('direction');
		var faceDirection = direction;
		if (direction == 'leftup' || direction == 'leftdown') faceDirection = 'left';
		if (direction == 'rightup' || direction == 'rightdown') faceDirection = 'right';
		core.setHeroLoc('direction', direction);
		if (curr[1] <= 0) {
			core.setHeroLoc('direction', faceDirection);
			moveSteps.shift();
			return true;
		}
		if (step <= 4) core.drawHero('stop', 4 * o * step);
		else if (step <= 8) core.drawHero('leftFoot', 4 * o * step);
		else if (step <= 12) core.drawHero('midFoot', 4 * o * (step - 8));
		else if (step <= 16) core.drawHero('rightFoot', 4 * o * (step - 8)); // if (step == 8) {
		if (step == 8 || step == 16) {
			core.setHeroLoc('x', x + o * core.utils.scan2[direction].x, true);
			core.setHeroLoc('y', y + o * core.utils.scan2[direction].y, true);
			core.updateFollowers();
			curr[1]--;
			if (curr[1] <= 0) moveSteps.shift();
			core.setHeroLoc('direction', faceDirection);
			return step == 16;
		}
		return false;
	}
},
    "startCanvas": function () {
	// 使用本插件可以将自绘的标题界面居中。仅在【标题开启事件化】后才有效。
	// 由于一些技术性的原因，标题界面事件化无法应用到覆盖状态栏的整个界面。
	// 这是一个较为妥协的插件，会在自绘标题界面时隐藏状态栏、工具栏和边框，并将画布进行居中。
	// 本插件仅在全塔属性的 "startCanvas" 生效；进入 "startText" 时将会离开居中状态，回归正常界面。

	// 是否开启本插件，默认禁用；将此改成 true 将启用本插件。
	var __enable = false;
	if (!__enable) return;

	// 检查【标题开启事件化】是否开启
	if (!core.flags.startUsingCanvas || main.mode != 'play') return;

	var _isTitleCanvasEnabled = false;
	var _getClickLoc = core.actions._getClickLoc;
	this._setTitleCanvas = function () {
		if (_isTitleCanvasEnabled) return;
		_isTitleCanvasEnabled = true;

		// 禁用窗口resize
		window.onresize = function () {};
		core.resize = function () {}

		// 隐藏状态栏
		core.dom.statusBar.style.display = 'none';
		core.dom.statusCanvas.style.display = 'none';
		core.dom.toolBar.style.display = 'none';
		// 居中画布
		if (core.domStyle.isVertical) {
			core.dom.gameDraw.style.top =
				(parseInt(core.dom.gameGroup.style.height) - parseInt(core.dom.gameDraw.style.height)) / 2 + "px";
		} else {
			core.dom.gameDraw.style.right =
				(parseInt(core.dom.gameGroup.style.width) - parseInt(core.dom.gameDraw.style.width)) / 2 + "px";
		}
		core.dom.gameDraw.style.border = '3px transparent solid';
		core.actions._getClickLoc = function (x, y) {
			var left = core.dom.gameGroup.offsetLeft + core.dom.gameDraw.offsetLeft + 3;
			var top = core.dom.gameGroup.offsetTop + core.dom.gameDraw.offsetTop + 3;
			var loc = { 'x': Math.max(x - left, 0), 'y': Math.max(y - top, 0), 'size': 32 * core.domStyle.scale };
			return loc;
		}
	}

	this._resetTitleCanvas = function () {
		if (!_isTitleCanvasEnabled) return;
		_isTitleCanvasEnabled = false;
		window.onresize = function () { try { main.core.resize(); } catch (e) { main.log(e); } }
		core.resize = function () { return core.control.resize(); }
		core.resize();
		core.actions._getClickLoc = _getClickLoc;
	}

	// 复写“开始游戏”
	core.events._startGame_start = function (hard, seed, route, callback) {
		// console.log('开始游戏');
		core.resetGame(core.firstData.hero, hard, null, core.cloneArray(core.initStatus.maps));
		core.setHeroLoc('x', -1);
		core.setHeroLoc('y', -1);

		if (seed != null && seed > 0) {
			core.setFlag('__seed__', seed);
			core.setFlag('__rand__', seed);
		} else core.utils.__init_seed();

		core.clearStatusBar();
		core.plugin._setTitleCanvas();

		var todo = [];
		core.hideStatusBar();
		core.push(todo, core.firstData.startCanvas);
		core.push(todo, { "type": "function", "function": "function() { core.plugin._resetTitleCanvas(); core.events._startGame_setHard(); }" })
		core.push(todo, core.firstData.startText);
		this.insertAction(todo, null, null, function () {
			core.events._startGame_afterStart(callback);
		});

		if (route != null) core.startReplay(route);
	}

	var _loadData = core.control.loadData;
	core.control.loadData = function (data, callback) {
		core.plugin._resetTitleCanvas();
		_loadData.call(core.control, data, callback);
	}
},
    "routeFixing": function () {
	// 是否开启本插件，true 表示启用，false 表示禁用。
	var __enable = true;
	if (!__enable) return;
	/*
	 使用说明：启用本插件后，录像回放时您可以用数字键1或6分别切换到原速或24倍速。
	 暂停播放时按数字键7（电脑按N）可以单步播放，数字键2-5可以进行录像自助精修。
	 具体描述见下（实际弹窗请求您输入时不要带有任何空格）：
	 
	 up down left right 勇士向某个方向行走一步
	 item:ID 使用某件道具，如item:bomb表示使用炸弹
	 unEquip:n 卸掉身上第(n+1)件装备（n从0开始），如unEquip:1默认表示卸掉盾牌
	 equip:ID 穿上某件装备，如equip:sword1表示装上铁剑
	 saveEquip:n 将身上的当前套装保存到第n套快捷套装（n从0开始）
	 loadEquip:n 快捷换上之前保存好的第n套套装
	 fly:ID 使用楼传飞到某一层，如fly:MT10表示飞到主塔10层
	 choices:none 确认框/选择项超时（作者未设置超时时间则此项视为缺失）
	 choices:n 确认框/选择项选择第(n+1)项（选择项n从0开始，确认框n为0表示确定，1表示取消），n越界将会报错
	 选择项n为负数时表示选择倒数第-n项，如-1表示最后一项（V2.8.2起标准全局商店的“离开”项）
	 此项缺失的话，确认框将选择作者指定的默认项（初始光标位置），选择项将弹窗请求补选（后台录像验证中则选第一项0，可以复写函数来修改）
	 shop:ID 打开某个全局商店，如shop:itemShop表示打开道具商店。因此连载塔千万不要中途修改商店ID！
	 turn 单击勇士（Z键）转身
	 turn:dir 勇士转向某个方向，dir可以为up down left right
	 getNext 轻按获得身边道具，优先获得面前的，身边如果没有道具则此项会导致报错
	 input:none “等待用户操作事件”中超时（作者未设置超时时间则此项会导致报错）
	 input:xxx 可能表示“等待用户操作事件”的一个操作（如按键操作将直接记录input:keycode），也可能表示一个“接受用户输入数字”的输入，后者的情况下xxx为输入的数字。此项缺失的话前者将直接报错，后者将用0代替
	 input2:xxx 可能表示“读取全局存储（core.getGlobal）”读取到的值，也可能表示一个“接受用户输入文本”的输入，两种情况下xxx都为base64编码。此项缺失的话前者将重新现场读取，后者将用空字符串代替
	 no 可能表示走到可穿透的楼梯上不触发楼层切换事件，也可能表示在不关闭装备栏的情况下连续切装不重复触发穿脱事件
	 move:x:y 尝试瞬移到[x,y]点
	 key:n 按下键值为n的键，如key:49表示按下大键盘数字键1，默认会触发使用破墙镐
	 click:n:px:py 点击自绘状态栏，n为0表示横屏1表示竖屏，[px,py]为点击的像素坐标
	 random:n 生成了随机数n，即core.rand2(num)的返回结果，n必须在[0,num-1]范围，num必须为正整数。此项缺失将导致现场重新随机生成数值，可能导致回放结果不一致！
	 作者自定义的新项（一般为js对象，可以先JSON.stringify()再core.encodeBase64()得到纯英文数字的内容）需要用(半角圆括弧)括起来。
	 
	 当您使用数字键5将一些项追加到即将播放内容的开头时，请注意要逆序逐项追加，或者每追加一项就按下数字键7或字母键N单步播放。
	 电脑端熟练以后推荐直接在控制台操作core.status.route和core.status.replay.toReplay（后者录像回放时才有），配合var以及core.push()和core.unshift()更加灵活自由哦！
	 */
	core.registerAction('onkeyUp', '_sys_onkeyUp_replay', function (e) { // 重新注册录像回放时的按键处理行为，将7设为单步播放，2-5设为录像精修
		if (this._checkReplaying()) {
			if (e.keyCode == 27) // ESCAPE
				core.stopReplay();
			else if (e.keyCode == 90) // Z
				core.speedDownReplay();
			else if (e.keyCode == 67) // C
				core.speedUpReplay();
			else if (e.keyCode == 32) // SPACE
				core.triggerReplay();
			else if (e.keyCode == 65) // A
				core.rewindReplay();
			else if (e.keyCode == 83) // S
				core.control._replay_SL();
			else if (e.keyCode == 88) // X
				core.control._replay_book();
			else if (e.keyCode == 33 || e.keyCode == 34) // PgUp/PgDn
				core.control._replay_viewMap();
			else if (e.keyCode == 78 || e.keyCode == 55) // N/7，单步播放
				core.stepReplay();
			else if (e.keyCode == 84) // T
				core.control._replay_toolbox();
			else if (e.keyCode == 81) // Q
				core.control._replay_equipbox();
			else if (e.keyCode == 66) // B
				core.ui._drawStatistics();
			else if (e.keyCode == 49 || e.keyCode == 54) // 1/6，原速/24倍速播放
				core.setReplaySpeed(e.keyCode == 49 ? 1 : 24);
			else if (e.keyCode > 49 && e.keyCode < 54) { // 2-5，录像精修
				switch (e.keyCode - 48) {
				case 2: // pop
					alert("您已移除已录制内容的最后一项：" + core.status.route.pop());
					break;
				case 3: // push
					core.utils.myprompt("请输入您要追加到已录制内容末尾的项：", "", function (value) {
						if (value != null) core.status.route.push(value);
					});
					break;
				case 4: // shift
					alert("您已移除即将播放内容的第一项：" + core.status.replay.toReplay.shift());
					break;
				case 5: // unshift
					core.utils.myprompt("请输入您要追加到即将播放内容开头的项：", "", function (value) {
						if (value != null) core.status.replay.toReplay.unshift(value);
					});
				}
			}
			return true;
		}
	}, 100);
},
    "myNumpad": function () {
	// 样板自带的整数输入事件为白屏弹窗且可以误输入任意非法内容，观感较差。本插件可以将其美化成仿RM样式，同时带有音效
	// 另一方面，4399等第三方平台不允许使用包括core.myprompt和core.myconfirm在内的弹窗，因此也需要此插件来替代，不然类似生命魔杖的道具就不好实现了

	// 是否启用本插件，false表示禁用，true表示启用
	var __enable = true;
	if (!__enable) return;

	core.events._action_input = function (data, x, y, prefix) { // 复写整数输入事件
		if (core.isReplaying()) { // 录像回放时，处理方式不变，但增加负整数支持
			core.events.__action_getInput(core.replaceText(data.text, prefix), false, function (value) {
				value = parseInt(value) || 0; // 去掉了取绝对值的步骤
				core.status.route.push("input:" + value);
				core.setFlag("input", value);
				core.doAction();
			});
		} else {
			// 正常游戏中，采用暂停录制的方式然后用事件流循环“绘制-等待-变量操作”三板斧实现（按照13*13适配的）。
			// 您可以自行修改下述公共事件的内容来适配15*15或其他需求，但请务必注意要在事件结尾裁剪录像。
			core.setFlag('@temp@text', core.replaceText(data.text, prefix)); // 预替换提示文字，因为公共事件里无法引用data和prefix这两个自变量
			core.setFlag('@temp@length', core.status.route.length); // 记录当前录像长度，公共事件结束后裁剪，达到“暂停录制”的效果
			core.setFlag('input', 0); // 输入值归零
			core.insertCommonEvent('整数输入', null, x, y); // 插入公共事件
			core.events.doAction(); // 重要！继续处理刚刚插入的公共事件
		}
	}
},
    "precompile": function () {
	// 使用说明：将原本写在core.insertAction([...])处的json事件指令数组用（即事件编辑器右侧的文本内容，如果是公共事件则可以用core.events.getCommonEvent('公共事件名')得到）
	// var script = core.plugin.compile([...])编译成字符串，然后
	// try { eval(script); } catch (e) { if (e != 'exit') console.log(e); }
	// 即可，尤其适用于UI绘制事件（甚至伤害计算？）。此插件尚在公测中，如有bug请立即向群内ad、小艾、古祠、理派四阵 等技术人员反馈
	this.compile = function (arr) { // json事件指令编译为js脚本，不能编译异步事件和独立开关，不支持“省略当前点”、地图处理、多层跳出/继续循环等
		if (!(arr instanceof Array) || arr.length <= 0) return ''; // arr不为数组或长度不为正数，则直接返回空串
		var s = ''; // 编译的结果，可被eval，最好套一层 try{...}catch(e){...} 并在第二对花括弧中特判 e === 'exit'
		for (var i in arr) {
			var data = arr[i];
			switch (data.type) {
				/* 显示文字 Start */
			case 'setText': // 设置剧情文本的属性
				s += 'core.events.setTextAttribute(' + JSON.stringify(data) + ');';
				break;
			case 'tip': // 左上角的气泡提示，这里提供frame参数
				s += 'core.ui.drawTip(core.utils.replaceText("' + data.text + '"),"' + data.icon + '",' + data.frame + ');';
				break;
			case 'win': // 游戏胜利
				s += 'core.events.win(core.utils.replaceText("' + data.reason + '"),' + data.norank + ',' + data.noexit + ');';
				break;
			case 'lose': // 游戏失败
				s += 'core.events.lose(core.utils.replaceText("' + data.reason + '"));';
				break;
			case 'restart': // 重启游戏，瞬间完成且不切换背景音乐
				s += 'core.showStartAnimate(true);';
				break;
				/* 显示文字 End */
				/* 数据相关 Start */
			case 'setValue': // 数值操作，强制不刷新状态栏
				s += 'core.events.setValue("' + data.name + '","' + (data.operator || '=') + '","' + data.value + '");';
				break;
			case 'setEnemy': // 设置某个id的怪物属性
				s += 'core.events.setEnemy("' + data.id + '","' + data.name + '","' + data.value + '","' + (data.operator || '=') + '",null,true);'; // 强制不刷新显伤
				break; // “定点设置/重置/移动怪物属性”等可以填多个坐标的事件还在研究
			case 'setEquip': // 设置某个id的装备属性，如果是已经穿在身上的装备则会触发【刷新状态栏】，请务必注意！
				s += 'core.items.setEquip("' + data.id + '","' + data.valueType + '","' + data.name + '","' + data.value + '","' + (data.operator || '=') + '");';
				break;
			case 'setFloor': // 设置某个id或当前层的楼层属性
				s += 'core.status.maps.' + (data.floorId || core.status.floorId) + '.' + data.name + '=' + JSON.stringify(data.value) + ';'; // 强制不刷新状态栏
				break;
			case 'setGlobalAttribute': // 设置全局属性/主样式
				s += 'core.events.setGlobalAttribute("' + data.name + '","' + data.value + '");';
				break;
			case 'setGlobalValue': // 设置全局数值，不建议使用，因为不支持运算符且data.value只能写常数，建议直接写脚本
				s += 'core.values.' + data.name + '=' + data.value + ';';
				break;
			case 'setGlobalFlag': // 设置系统开关，注意不要出现开启“自绘状态栏”却没开启“横屏底部工具栏”的情况，否则横屏工具栏会挤在左下角！
				s += 'core.events.setGlobalFlag("' + data.name + '",' + data.value + ');';
				break;
			case 'setNameMap': // 设置文件别名，并计入存档
				s += 'core.events.setNameMap("' + data.name + '","' + (data.value || '') + '");';
				break;
			case 'update': // 刷新状态栏和地图显伤
				s += 'core.updateStatusBar(' + data.doNotCheckAutoEvents + ');';
				break;
			case 'loadEquip':
			case 'unloadEquip':
				s += 'core.items.' + data.type + '(' + (data.id ? '"' + data.id + '"' : data.pos) + ');'; // 穿脱装备
				break;
			case 'openShop':
			case 'disableShop':
				s += 'core.plugin.setShopVisited("' + data.id + '",' + (data.type.charAt(0) == 'o') + ');'; // 开关全局商店，注意这里不支持设为启用后立即打开
				break;
			case 'setHeroIcon': // 更改勇士行走图
				s += 'core.events.setHeroIcon("' + data.name + '",true);'; // 强制不重绘
				break;
			case 'follow':
			case 'unfollow':
				s += 'core.events.' + data.type + '("' + (data.name || '') + '");'; // 跟随者入队/离队，会触发勇士重绘
				break;
				/* 数据相关 End */
				// 地图处理类除了战斗、开门、移动、跳跃，都可以写多个坐标，而这四个是异步的，因此全都摸了
				/* 事件控制 Start */
			case 'if': // 条件分歧
				s += 'if(core.utils.calValue("' + data.condition + '")){' + this.compile(data['true']) + '}';
				if (data['false']) s += 'else{' + this.compile(data['false']) + '}'; // “否则”分支
				break;
			case 'switch': // 多重分歧，使用匿名函数闭包防止“判别值”的作用域污染，同时使得“跳出”能够用 return 关键字实现。
				s += '(function(){var key=core.utils.calValue("' + data.condition + '");'; // “判别值”只计算一次
				for (var i in data.caseList) {
					s += 'if(' + (data.caseList[i].case != 'default' ? 'core.utils.calValue("' + data.caseList[i].case+'")===key' : 'true') + '){';
					s += this.compile(data.caseList[i].action) + (data.caseList[i].nobreak ? '' : 'return') + '}';
				}
				s += '})();';
				break;
			case 'for': // 计数循环遍历
				var temp = "'@temp@" + data.name.substring(5) + "'",
					step = core.utils.calValue(data.step); // 循环变量的flag名和步长
				s += 'for(core.setFlag(' + temp + ',core.utils.calValue("' + data.from + '"));';
				if (step) s += 'core.getFlag(' + temp + ',0)' + (step > 0 ? '<=' : '>=') + 'core.utils.calValue("' + data.to + '")';
				s += ';core.addFlag(' + temp + ',' + step + ')){' + this.compile(data.data) + '}';
				break;
			case 'forEach': // 数组循环遍历
				var listName = "'@temp@forEach@" + data.name.substring(5) + "'";
				s += 'for(core.setFlag(' + listName + ',core.clone(' + JSON.stringify(data.list) + '));core.getFlag(' + listName + ',[]).length>0;){core.setFlag(';
				s += ("'@temp@" + data.name.substring(5) + "'") + ',core.getFlag(' + listName + ',[]).shift());' + this.compile(data.data) + '}';
				break;
			case 'while': // 前置条件循环
				s += 'while(core.utils.calValue("' + data.condition + '")){' + this.compile(data.data) + '}';
				break;
			case 'dowhile': // 后置条件循环
				s += 'do{' + this.compile(data.data) + '}while(core.utils.calValue("' + data.condition + '"));';
				break;
			case 'break':
			case 'continue':
				s += data.type + ';'; // 跳出/提前结束本轮的最内层循环，这里不支持指定层数
				break;
			case 'exit': // 立刻结束当前事件，直接抛出异常
				s += "throw 'exit';";
				break;
				/* 事件控制 End */
				/* 特效表现 Start */
			case 'stopAsync': // 停止所有异步事件
			case 'showStatusBar': // 显示/隐藏状态栏
			case 'hideStatusBar':
				s += 'core.' + data.type + '(' + data.toolbox + ');';
				break;
			case 'animate': // 播放动画，强制不等待执行完毕，位置不填视为勇士
				if (!data.loc || data.loc == 'hero') s += 'core.maps.drawHeroAnimate("' + data.name + '");';
				else s += 'core.drawAnimate("' + data.name + '",' + 'core.calValue("' + data.loc[0] + '"),' + 'core.calValue("' + data.loc[1] + '"),' + data.alignWindow + ');';
				break;
			case 'stopAnimate': // 停止所有动画，可以选择是否执行回调（例如不执行回调从而让自我回调的循环动画彻底停止）
				s += 'core.stopAnimate(null,' + data.doCallback + ');';
				break;
			case 'lockViewport': // 锁定/解锁视角
				s += 'core.setFlag("__lockViewport__",' + data.lock + ');';
				break;
			case 'setHeroOpacity': // 设置勇士不透明度，瞬间完成，强制不重绘
				s += 'core.setFlag("__heroOpacity__",' + data.opacity + ');';
				break;
			case 'setCurtain': // 更改画面色调，瞬间完成
				data.color = JSON.stringify(data.color);
				s += 'core.clearMap("curtain");core.fillRect("curtain",0,0,core.__PX_WIDTH__,core.__PX_HEIGHT__,core.arrayToRGBA(core.status.curtainColor=';
				s += (data.color || 'core.status.thisMap.color') + '||[0,0,0,0]));'
				s += 'if(!' + data.color + '||' + data.keep + ')core.setFlag("__color__",' + data.color + ');';
				break;
			case 'setWeather': // 更改天气
				s += data.name ? 'core.setWeather("' + data.name + '",' + data.level + ');' : 'core.setWeather();';
				s += 'if(' + data.keep + ')core.setFlag("__weather__",["' + data.name + '",' + data.level + ']);else core.removeFlag("__weather__");';
				break;
			case 'autoSave': // 自动存档，强制不提示，且不能无视下面的禁止存档状态
				s += 'core.control.autosave();';
				break;
			case 'forbidSave': // 是否禁止存档
				s += 'core.setFlag("__forbidSave__",' + data.forbid + ');';
				break;
				/* 特效表现 End */
				/* 音像处理 Start */
			case 'showGif': // 显示或清空动图
				if (data.loc) s += 'core.events.showGif("' + (data.name || '') + '",' + 'core.calValue("' + data.loc[0] + '"),' + 'core.calValue("' + data.loc[1] + '"));';
				else s += 'core.events.showGif("' + (data.name || '') + '");'
				break;
			case 'playBgm': // 播放背景音乐
				s += 'core.playBgm("' + data.name + '",' + data.startTime + ');core.setFlag("__bgm__",' + (data.keep ? '"' + data.name + '"' : null) + ');';
				break;
			case 'pauseBgm': // 暂停/继续背景音乐
			case 'resumeBgm':
			case 'loadBgm': // 预加载/释放背景音乐
			case 'freeBgm':
				s += 'core.' + data.type + '(' + (data.name ? '"' + data.name + '"' : data.resume) + ');'
				break;
			case 'playSound': // 播放音效
				s += 'if(' + data.stop + ')core.stopSound();core.playSound("' + data.name + '",' + data.pitch + ');';
				break;
			case 'stopSound': // 停止所有音效
				s += 'core.control.stopSound();';
				break;
			case 'setVolume': // 设置bgm音量，瞬间完成
				s += 'core.setFlag("__volume__",' + (data.value = core.utils.clamp(parseInt(data.value) / 100, 0, 1)) + ');core.setVolume(flags.__volume__,0);';
				break;
			case 'setBgmSpeed': // 更改背景音乐播放速度，可以选择是否同时改变音调（由勾选框改为下拉框，确保 null false true 三种值都有效）
				s += 'core.setBgmSpeed(' + data.value + ',' + data.pitch + ');';
				break;
				/* 音像处理 End */
			case 'function': // 原生js脚本，data.function 已经是匿名函数了，直接闭包即可
				s += '(' + data.function+')();';
				break;
			case 'previewUI': // UI绘制预览
				s += this.compile(data.action);
				break;
			default: // UI绘制
				if (core.ui['_uievent_' + data.type]) s += 'core.ui._uievent_' + data.type + '(' + JSON.stringify(data) + ');';
			}
		}
		return s;
	}
}
}