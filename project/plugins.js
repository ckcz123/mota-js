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
		if (keycode == 88) { // X
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
		flags.__removed__ = flags.__removed__ || [];
		flags.__disabled__ = flags.__disabled__ || [];
		for (var i = fromIndex; i <= toIndex; ++i) {
			var floorId = core.floorIds[i];
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
			flags.__removed__ = flags.__removed__.filter(function (f) { return f != floorId; });
			if (core.status.maps[floorId].deleted) {
				core.status.maps[floorId] = core.loadFloor(floorId);
			}
		}
	}
},
    "fiveLayers": function () {
	// 是否启用五图层（增加背景2层和前景2层） 将__enableFiveLayers置为true即会启用；启用后请保存后刷新编辑器
	// 背景层2将会覆盖背景层 被事件层覆盖 前景层2将会覆盖前景层
	// 另外 请注意加入两个新图层 会让大地图的性能降低一些
	// 插件作者：ad
	var __enableFiveLayers = false;
	if (!__enableFiveLayers) return;

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
		core.fillText("uievent", "当前金币", 324, 66, null, middleFont);
		core.setTextAlign("uievent", "right");
		core.fillText("uievent", core.formatBigNumber(core.status.hero.money), 405, 89);
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
			core.fillText('uievent', (type == 0 ? core.calValue(item.money) : core.calValue(item.sell)) + "金币/个", 300, 133 + i * 40, null, middleFont);
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
				core.fillText("uievent", "预计金额", 324, 250);
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
			Math.min(type == 0 ? Math.floor(core.status.hero.money / core.calValue(item.money)) : core.itemCount(item.id),
				type == 0 && item.number != null ? item.number : Number.MAX_SAFE_INTEGER)
		);
	}

	var _confirm = function (item) {
		if (item == null || selectCount == 0) return;
		if (type == 0) {
			core.status.hero.money -= totalMoney;
			core.getItem(item.id, selectCount);
			if (item.number != null) item.number -= selectCount;
			item.money_count = (item.money_count || 0) + selectCount;
		} else {
			core.status.hero.money += totalMoney;
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
    "smoothCamera": function () {
	// 此插件开启后，大地图的瞬间移动将开启平滑镜头移动，避免突兀感
	// 插件作者：老黄鸡

	// 是否启用本插件，默认不启用
	this.__enableSmoothCamera = false;
	if (!this.__enableSmoothCamera) return;

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