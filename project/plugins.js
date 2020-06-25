var plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = 
{
    "init": function () {

	console.log("插件编写测试");

	// 可以写一些直接执行的代码
	// 在这里写的代码将会在【资源加载前】被执行，此时图片等资源尚未被加载。
	// 请勿在这里对包括bgm，图片等资源进行操作。


	this._afterLoadResources = function () {
		// 本函数将在所有资源加载完毕后，游戏开启前被执行
		// 可以在这个函数里面对资源进行一些操作，比如切分图片等。

		// 这是一个将assets.png拆分成若干个32x32像素的小图片并保存的样例。
		// var arr = core.splitImage("assets.png", 32, 32);
		// for (var i = 0; i < arr.length; i++) {
		//     core.material.images.images["asset"+i+".png"] = arr[i];
		// }

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
				ctx = core.createCanvas(name, 0, 0, core.__PIXELS__, core.__PIXELS__, 98);
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
				core.insertAction("道具商店插件不存在！请检查是否存在该插件！");
			}
			return;
		}
		if (shop.commonEvent) {
			core.insertCommonEvent(shop.commonEvent, shop.args);
			return;
		}

		// Step 4: 执行标准公共商店    
		core.insertAction(this._convertShop(shop));
		return true;
	}

	////// 将一个全局商店转变成可预览的公共事件 //////
	this._convertShop = function (shop) {
		return [
			{ "type": "function", "function": "function() {core.setFlag('@temp@shop', true);}" },
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
			{ "type": "function", "function": "function() {core.removeFlag('@temp@shop');}" }
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
				"action": ableToBuy && !previewMode ? choice.action : [
					{ "type": "tip", "text": previewMode ? "预览模式下不可购买" : "购买条件不足" }
				]
			};
		}).concat({ "text": "离开", "action": [{ "type": "break" }] });
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

	/// 允许商店X键退出
	core.registerAction('keyUp', 'shops', function (keycode) {
		if (!core.status.lockControl || !core.hasFlag("@temp@shop") || core.status.event.id != 'action') return false;
		if (core.status.event.data.type != 'choices') return false;
		var data = core.status.event.data.current;
		var choices = data.choices;
		var topIndex = core.actions.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
		if (keycode == 88 || keycode == 27) { // X, ESC
			core.actions._clickAction(core.actions.HSIZE, topIndex + choices.length - 1);
			return true;
		}
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
		for (var i = fromIndex; i <= toIndex; ++i) {
			var floorId = core.floorIds[i];
			if (core.status.maps[floorId].deleted) continue;
			delete flags.__visited__[floorId];
			flags.__removed__.push(floorId);
			delete flags.__disabled__[floorId];
			core.status.maps[floorId].deleted = true;
			core.status.maps[floorId].canFlyTo = false;
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
		canvas.width = canvas.height = core.__PIXELS__;
		// 编辑器模式下设置zIndex会导致加入的图层覆盖优先级过高
		if (main.mode != "editor") canvas.style.zIndex = zIndex || 0;
		// 将图层插入进游戏内容
		document.getElementById('gameDraw').appendChild(canvas);
		var ctx = canvas.getContext('2d');
		core.canvas[name] = ctx;
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
		document.getElementById('mapEdit').insertBefore(fg2Canvas, document.getElementById('efg'));
		// 原本有三个图层 从4开始添加
		var num = 4;
		// 新增图层存入editor.dom中
		editor.dom.bg2c = core.canvas.bg2.canvas;
		editor.dom.bg2Ctx = core.canvas.bg2;
		editor.dom.fg2c = core.canvas.fg2.canvas;
		editor.dom.fg2Ctx = core.canvas.fg2;
		editor.dom.maps.push('bg2map', 'fg2map');
		editor.dom.canvas.push('bg2', 'fg2');

		// 默认全空
		var defaultMap = [];
		for (var i = 0; i < core.__SIZE__; ++i) {
			var row = [];
			for (var j = 0; j < core.__SIZE__; ++j) {
				row.push(0);
			}
			defaultMap.push(row);
		}

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
			editor[value] = editor[value] || defaultMap;
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
			editor[value] = editor[value] || defaultMap;
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
			var txt = document.createTextNode('背景层2');
			// 插入事件层前(即新插入的背景层2前)
			parent.insertBefore(txt, child);
			// 向最后插入前景层2(即插入前景层后)
			parent.appendChild(input2);
			var txt2 = document.createTextNode('前景层2');
			parent.appendChild(txt2);
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

	////// 绘制背景层 //////
	core.maps.drawBg = function (floorId, ctx) {
		floorId = floorId || core.status.floorId;
		var onMap = ctx == null;
		if (onMap) {
			ctx = core.canvas.bg;
			core.clearMap(ctx);
			core.status.floorAnimateObjs = this._getFloorImages(floorId);
		}
		core.maps._drawBg_drawBackground(floorId, ctx);
		// ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制背景图块；后绘制的覆盖先绘制的。
		core.maps._drawFloorImages(floorId, ctx, 'bg');
		core.maps._drawBgFgMap(floorId, ctx, 'bg', onMap);
		// 绘制背景层2
		core.maps._drawBgFgMap(floorId, ctx, 'bg2', onMap);
	};

	////// 绘制前景层 //////
	core.maps.drawFg = function (floorId, ctx) {
		floorId = floorId || core.status.floorId;
		var onMap = ctx == null;
		if (onMap) {
			ctx = core.canvas.fg;
			core.status.floorAnimateObjs = this._getFloorImages(floorId);
		}
		// ------ 调整这两行的顺序来控制是先绘制贴图还是先绘制前景图块；后绘制的覆盖先绘制的。
		this._drawFloorImages(floorId, ctx, 'fg');
		this._drawBgFgMap(floorId, ctx, 'fg', onMap);
		// 绘制前景层2
		this._drawBgFgMap(floorId, ctx, 'fg2', onMap);
	};
	/* cannotIn/cannotOut适配 start*/
	core.maps.generateMovableArray = function (floorId, x, y, direction) {
		floorId = floorId || core.status.floorId;
		if (!floorId) return null;
		var width = core.floors[floorId].width,
			height = core.floors[floorId].height;
		var bgArray = this.getBgMapArray(floorId),
			bg2Array = this._getBgFgMapArray('bg2', floorId),
			fgArray = this.getFgMapArray(floorId),
			fg2Array = this._getBgFgMapArray('fg2', floorId),
			eventArray = this.getMapArray(floorId);

		var generate = function (x, y, direction) {
			if (direction != null) {
				return core.maps._canMoveHero_checkPoint(x, y, direction, floorId, {
					bgArray: bgArray,
					fgArray: fgArray,
					bg2Array: bg2Array,
					fg2Array: fg2Array,
					eventArray: eventArray
				});
			}
			return ["left", "down", "up", "right"].filter(function (direction) {
				return core.maps._canMoveHero_checkPoint(x, y, direction, floorId, {
					bgArray: bgArray,
					fgArray: fgArray,
					bg2Array: bg2Array,
					fg2Array: fg2Array,
					eventArray: eventArray
				});
			});
		};

		if (x != null && y != null) return generate(x, y, direction);
		var array = [];
		for (var x = 0; x < width; x++) {
			array[x] = [];
			for (var y = 0; y < height; y++) {
				array[x][y] = generate(x, y);
			}
		}
		return array;
	};
	core.maps._canMoveHero_checkPoint = function (x, y, direction, floorId, extraData) {
		// 1. 检查该点 cannotMove
		if (core.inArray((core.floors[floorId].cannotMove || {})[x + "," + y], direction))
			return false;

		var nx = x + core.utils.scan[direction].x,
			ny = y + core.utils.scan[direction].y;
		if (nx < 0 || ny < 0 || nx >= core.floors[floorId].width || ny >= core.floors[floorId].height)
			return false;

		// 2. 检查该点素材的 cannotOut 和下一个点的 cannotIn
		if (this._canMoveHero_checkCannotInOut([
				extraData.bgArray[y][x], extraData.bg2Array[y][x], extraData.fgArray[y][x], extraData.fg2Array[y][x], extraData.eventArray[y][x]
			], "cannotOut", direction))
			return false;
		if (this._canMoveHero_checkCannotInOut([
				extraData.bgArray[ny][nx], extraData.bg2Array[ny][nx], extraData.fgArray[ny][nx], extraData.fg2Array[ny][nx], extraData.eventArray[ny][nx]
			], "cannotIn", direction))
			return false;

		// 3. 检查是否能进将死的领域
		if (floorId == core.status.floorId && !core.flags.canGoDeadZone &&
			core.status.hero.hp <= (core.status.checkBlock.damage[nx + "," + ny] || 0) &&
			extraData.eventArray[ny][nx] == 0)
			return false;

		return true;
	};
	/* cannotIn/cannotOut适配 end*/
	// 前景层2与背景层2的隐藏与显示适配
	// 比如:可以用core.hideBgFgMap("bg2",[x, y], floorId)隐藏当前楼层的背景层2图块
	core.maps._triggerBgFgMap = function (type, name, loc, floorId, callback) {
		if (type != 'show') type = 'hide';
		if (!name) name = 'bg';
		if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
			loc = [loc];
		floorId = floorId || core.status.floorId;
		if (!floorId) return;

		if (loc.length == 0) return;
		loc.forEach(function (t) {
			var x = t[0],
				y = t[1];
			var flag = [floorId, x, y, name + '_disable'].join('@');
			if (type == 'hide') core.setFlag(flag, true);
			else core.removeFlag(flag);
		});
		core.status[name + "maps"][floorId] = null;

		if (floorId == core.status.floorId) {
			core.drawMap(floorId, callback);
		} else {
			if (callback) callback();
		}
	};
	// 改变背景层2与前景层2图块 例:core.setBgFgBlock('fg2',312,core.nextX(),core.nextY())
	core.maps.setBgFgBlock = function (name, number, x, y, floorId) {
		floorId = floorId || core.status.floorId;
		if (!floorId || number == null || x == null || y == null) return;
		if (x < 0 || x >= core.floors[floorId].width || y < 0 || y >= core.floors[floorId].height) return;
		if (name != 'bg' && name != 'fg' && name != 'bg2' && name != 'fg2') return;
		if (typeof number == 'string') {
			if (/^\d+$/.test(number)) number = parseInt(number);
			else number = core.getNumberById(number);
		}

		var vFlag = [floorId, x, y, name + "_value"].join('@');
		core.setFlag(vFlag, number);
		core.status[name + "maps"][floorId] = null;

		if (floorId == core.status.floorId) {
			core.clearMap(name);
			if (name.startsWith('bg')) core.drawBg(floorId);
			else core.drawFg(floorId);
		}
	};
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
		core.ui._clearUIEventSelector([1, 2]);
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
		core.ui._uievent_drawSelector({
			"type": "drawSelector",
			"image": "winskin.png",
			"code": 2,
			"x": 22 + 100 * type,
			"y": 66,
			"width": 60,
			"height": 33
		});
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
				core.ui._uievent_drawSelector({ "type": "drawSelector", "image": "winskin.png", "code": 1, "x": 8, "y": 120 + i * 40, "width": 295, "height": 40 });
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
			if (item.number != null) item.number -= selectCount;
			item.money_count = (item.money_count || 0) + selectCount;
		} else {
			core.status.hero[use] += totalMoney;
			core.removeItem(item.id, selectCount);
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
				"function": "function () { core.deleteCanvas('uievent'); core.ui._clearUIEventSelector([1, 2]); }"
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
    "flyHideFloors": function () {
	// 此插件可以让用户在楼传页面手动隐藏某些楼层	
	// 原作：一桶天下

	// 是否开启本插件，默认禁用；将此改成 true 将启用本插件。
	var __enable = false;
	if (!__enable) return;

	var _drawFly = core.ui.drawFly;
	core.ui.drawFly = function (page) {
		_drawFly.call(core.ui, page);
		// 绘制「显示本层」和「显示全部」
		var __hideFloors__ = core.getFlag('__hideFloors__', {});
		var __showAllFloor__ = core.getFlag('__showAllFloor__', false);
		var floorId = core.floorIds[page];
		core.fillText('ui', '显示该层', this.HPIXEL - 120, 60, __hideFloors__[floorId] ? '#FFFFFF' : 'yellow', this._buildFont(20, false));
		core.fillText('ui', '显示全部', this.HPIXEL + 120, 60, !__showAllFloor__ ? '#FFFFFF' : 'yellow', this._buildFont(20, false));
	}

	var _clickFly = core.actions._clickFly;
	core.actions._clickFly = function (x, y) {
		_clickFly.call(core.actions, x, y);

		var __hideFloors__ = core.getFlag('__hideFloors__', {})
		var __showAllFloor__ = core.getFlag('__showAllFloor__', false)
		var _floorId = core.floorIds[core.status.event.data]

		if (y == 1 && x >= this.HSIZE - 5 && x <= this.HSIZE - 2) {
			__hideFloors__[_floorId] = !__hideFloors__[_floorId]
			core.setFlag('__hideFloors__', __hideFloors__)
			core.ui.drawFly(this._getNextFlyFloor(0))
		}
		if (y == 1 && x >= this.HSIZE + 2 && x <= this.HSIZE + 5) {
			core.setFlag('__showAllFloor__', !__showAllFloor__)
			core.ui.drawFly(this._getNextFlyFloor(0))
		}
	}

	var _keyUpFly = core.actions._keyUpFly;
	core.actions._keyUpFly = function (keycode) {
		_keyUpFly.call(core.actions, keycode);

		var __hideFloors__ = core.getFlag('__hideFloors__', {})
		var __showAllFloor__ = core.getFlag('__showAllFloor__', false)
		var _floorId = core.floorIds[core.status.event.data]

		// Q
		if (keycode == 81) {
			__hideFloors__[_floorId] = !__hideFloors__[_floorId]
			core.setFlag('__hideFloors__', __hideFloors__)
			core.ui.drawFly(this._getNextFlyFloor(0));
		} else if (keycode == 69) {
			// E			
			core.setFlag('__showAllFloor__', !__showAllFloor__)
			core.ui.drawFly(this._getNextFlyFloor(0))
		}
	}

	core.actions._getNextFlyFloor = function (delta, index) {
		var __hideFloors__ = core.getFlag('__hideFloors__', {})
		var __showAllFloor__ = core.getFlag('__showAllFloor__', false)
		if (index == null) index = core.status.event.data;
		if (delta == 0) return index;
		var sign = Math.sign(delta);
		delta = Math.abs(delta);
		var ans = index;
		while (true) {
			index += sign;
			if (index < 0 || index >= core.floorIds.length) break;
			var floorId = core.floorIds[index];
			if (core.status.maps[floorId].canFlyTo && core.hasVisitedFloor(floorId) && (__showAllFloor__ || !__hideFloors__[floorId])) {
				delta--;
				ans = index;
			}
			if (delta == 0) break;
		}
		return ans;
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

	// 重写 core.ui.drawToolbox 以绘制分类类别
	var _drawToolbox = core.ui.drawToolbox;
	core.ui.drawToolbox = function (index) {
		_drawToolbox.call(this, index);
		core.setTextAlign('ui', 'left');
		core.fillText('ui', '类别[E]：' + (currentCategory || "全部"), 15, this.PIXEL - 13);
	}

	// 获得所有应该在道具栏显示的某个类型道具
	core.items.getDisplayItemsInToolbox = function (cls) {
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
		if (x >= 0 && x <= this.HSIZE - 4 && y == this.LAST) {
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
		var topIndex = core.actions.HSIZE - parseInt((choices.length - 1) / 2) + (core.status.event.ui.offset || 0);
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
    "smoothCamera": function () {
	// 此插件开启后，大地图的瞬间移动将开启平滑镜头移动，避免突兀感
	// 插件作者：老黄鸡

	// 是否启用本插件，默认不启用
	var __enable = false;
	if (!__enable) return;

	this.Camera = function () {

		// 下面这个变量决定本插件的开关
		// 你可以在游戏中使用core.setFlag('smoothCamera',false)来关闭本插件的功能
		// 同时也可以core.setFlag('smoothCamera',true)重新开启
		// 此项默认为true
		// 
		this.__switchName = 'smoothCamera';

		// 初始化成员变量
		this._cameraNeedRefresh = true;
		this._nowOffsetX = 0;
		this._nowOffsetY = 0;
		this._targetOffsetX = 0;
		this._targetOffsetY = 0;
		this._currentFloorId = null;

		// 重置镜头，在楼层变更时使用
		this.resetCamera = function () {
			this._targetOffsetX = core.bigmap.offsetX;
			this._targetOffsetY = core.bigmap.offsetY;
			this._nowOffsetX = this._targetOffsetX;
			this._nowOffsetY = this._targetOffsetY;
			this._cameraNeedRefresh = true;
		};

		// 设置焦点坐标，目前没有用
		this.setTarget = function (x, y) {
			this._targetOffsetX = x;
			this._targetOffsetY = y;
		};

		// 请求镜头更新
		this.requestCameraUpdate = function () {
			this._cameraNeedRefresh = true;
		};

		// 更新焦点坐标，目前仅根据大地图偏移决定
		this.updateTargetPosition = function () {
			this._targetOffsetX = core.bigmap.offsetX;
			this._targetOffsetY = core.bigmap.offsetY;
		};

		// 更新额外的刷新条件，即镜头未指向焦点时
		this.updateRefreshFlag = function () {
			if (this._nowOffsetX != this._targetOffsetX || this._nowOffsetY != this._targetOffsetY) {
				this._cameraNeedRefresh = true;
			}
		};

		// 判断是否禁止了弹性滚动
		this.canDirectMove = function () {
			return !core.getFlag(this.__switchName, true);
		};

		// 更新镜头坐标
		this.updateCameraPosition = function () {
			if (this._cameraNeedRefresh) {
				this._cameraNeedRefresh = false;
				var disX = this._targetOffsetX - this._nowOffsetX;
				var disY = this._targetOffsetY - this._nowOffsetY;
				if (Math.abs(disX) <= 2 && Math.abs(disY) <= 2 || this.canDirectMove()) {
					this._nowOffsetX = this._targetOffsetX;
					this._nowOffsetY = this._targetOffsetY;
				} else {
					this._nowOffsetX += disX / 10;
					this._nowOffsetY += disY / 10;
				}
				var x = -Math.floor(this._nowOffsetX);
				var y = -Math.floor(this._nowOffsetY);
				core.bigmap.canvas.forEach(function (cn) {
					core.control.setGameCanvasTranslate(cn, x, y);
				});
				core.relocateCanvas('route', core.status.automaticRoute.offsetX + x, core.status.automaticRoute.offsetY + y);
				core.setGameCanvasTranslate('hero', x + this._targetOffsetX, y + this._targetOffsetY);
			}
		};

		// 更新逻辑主体
		this.update = function () {
			this.updateTargetPosition();
			this.updateRefreshFlag();
			this.updateCameraPosition();
		};
	};

	// 创建摄像机对象
	this.camera = new this.Camera();

	// 帧事件 更新摄像机
	this.updateCameraEx = function () {
		this.camera.update();
	};

	core.control._drawHero_updateViewport = function () {
		core.control.updateViewport();
	}

	// 代理原本的镜头事件
	core.control.updateViewport = function () {
		core.plugin.camera.requestCameraUpdate();
	};

	// 更变楼层的行为追加，重置镜头
	core.events.changingFloor = function (floorId, heroLoc) {
		this.eventdata.changingFloor(floorId, heroLoc);
		core.plugin.camera.resetCamera();
	};

	// 注册帧事件
	core.registerAnimationFrame('smoothCameraFlash', true, this.updateCameraEx.bind(this));
}
}