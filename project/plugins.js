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
	// core.plugin.drawLight('xxx', 0.3, [[25,11,46],[105,121,88,0.2]], 0.4); // 存在两个灯光效果，它们在内圈40%范围内保持全亮，且40%后才开始衰减。
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

	var bigFont = core.ui._buildFont(20, false),
		middleFont = core.ui._buildFont(18, false);

	this.drawItemShop = function () {
		// 绘制道具商店

		// Step 1: 背景和固定的几个文字
		core.ui._createUIEvent();
		core.clearMap('uievent');
		core.ui._uievent_drawSelector({ "code": 1 });
		core.ui._uievent_drawSelector({ "code": 2 });
		core.setTextAlign('uievent', 'left');
		core.setTextBaseline('uievent', 'top');
		core.fillRect('uievent', 0, 0, 416, 416, 'black');
		core.ui._uievent_drawBackground({ background: 'winskin.png', x: 0, y: 0, width: 416, height: 56 });
		core.ui._uievent_drawBackground({ background: 'winskin.png', x: 0, y: 56, width: 312, height: 56 });
		core.ui._uievent_drawBackground({ background: 'winskin.png', x: 0, y: 112, width: 312, height: 304 });
		core.ui._uievent_drawBackground({ background: 'winskin.png', x: 312, y: 56, width: 104, height: 56 });
		core.ui._uievent_drawBackground({ background: 'winskin.png', x: 312, y: 112, width: 104, height: 304 });
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
			core.fillText("uievent", "◀   " + selectCount + "   ▶", 364, 350);
			core.fillText("uievent", "确定", 364, 380);
		}

		// Step 2：获得列表并展示
		var choices = core.status.shops[shopId].choices;
		list = choices.filter(function (one) {
			if (one.condition != null) {
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
					var config = { left: 10, fontSize: fontSize, maxWidth: 403, lineHeight: 1.4 };
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
		// ◀，▶
		if (px >= 318 && px <= 341 && py >= 348 && py <= 376)
			return _add(item, -1);
		if (px >= 388 && px <= 416 && py >= 348 && py <= 376)
			return _add(item, 1);
		// 确定
		if (px >= 341 && px <= 387 && py >= 380 && py <= 407)
			return _confirm(item);

		// 上一页/下一页
		if (px >= 45 && px <= 105 && py >= 388) {
			if (page > 1) selectItem -= 6;
			return;
		}
		if (px >= 208 && px <= 268 && py >= 388) {
			if (page < totalPage) selectItem = Math.min(selectItem + 6, list.length - 1);
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

	this.performItemShopAction = function () {
		if (flags.type == 0) return this._performItemShopKeyBoard(flags.keycode);
		else return this._performItemShopClick(flags.px, flags.py);
	}

	this.openItemShop = function (itemShopId) {
		shopId = itemShopId;
		type = 0;
		page = 0;
		selectItem = null;
		selectCount = 0;
		core.insertAction([{
				"type": "while",
				"condition": "true",
				"data": [
					{ "type": "function", "function": "function () { core.drawItemShop(); }" },
					{ "type": "wait" },
					{ "type": "function", "function": "function() { core.performItemShopAction(); }" }
				]
			},
			{ "type": "function", "function": "function () { " +
					"core.deleteCanvas('uievent'); " +
					"core.ui._uievent_drawSelector({ \"code\": 1 }); " +
					"core.ui._uievent_drawSelector({ \"code\": 2 }); " +
					"}" }
		]);
	}

	// Write item number to save
	core.control.saveData = function () {
		var data = this.controldata.saveData();
		for (var shopId in core.status.shops) {
			if (core.status.shops[shopId].item) {
				data.shops[shopId].choices = core.status.shops[shopId].choices.map(function (t) {
					return {
						number: t.number,
						money_count: t.money_count || 0,
						sell_count: t.sell_count || 0
					}
				});
			}
		}
		return data;
	}

	core.control.loadData = function (data, callback) {
		this.controldata.loadData(data, callback);
		for (var shopId in data.shops) {
			if (data.shops[shopId].choices) {
				for (var i = 0; i < data.shops[shopId].choices.length; ++i) {
					core.status.shops[shopId].choices[i].number = data.shops[shopId].choices[i].number;
					core.status.shops[shopId].choices[i].money_count = data.shops[shopId].choices[i].money_count;
					core.status.shops[shopId].choices[i].sell_count = data.shops[shopId].choices[i].sell_count;
				}
			}
		}
	}

},
    "smoothCamera": function () {

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

	// 其实只注释了最后一行，只能这样了
	control.drawHero = function (status, offset) {
		if (!core.isPlaying() || !core.status.floorId || core.status.gameOver) return;
		var x = core.getHeroLoc('x'),
			y = core.getHeroLoc('y'),
			direction = core.getHeroLoc('direction');
		status = status || 'stop';
		offset = offset || 0;
		var way = core.utils.scan[direction];
		var dx = way.x,
			dy = way.y,
			offsetX = dx * offset,
			offsetY = dy * offset;
		core.bigmap.offsetX = core.clamp((x - core.__HALF_SIZE__) * 32 + offsetX, 0, 32 * core.bigmap.width - core.__PIXELS__);
		core.bigmap.offsetY = core.clamp((y - core.__HALF_SIZE__) * 32 + offsetY, 0, 32 * core.bigmap.height - core.__PIXELS__);
		core.clearAutomaticRouteNode(x + dx, y + dy);
		core.clearMap('hero');

		if (!core.hasFlag('hideHero')) {
			this._drawHero_getDrawObjs(direction, x, y, status, offset).forEach(function (block) {
				core.drawImage('hero', block.img, block.heroIcon[block.status] * block.width,
					block.heroIcon.loc * block.height, block.width, block.height,
					block.posx + (32 - block.width) / 2, block.posy + 32 - block.height, block.width, block.height);
			});
		}

		core.control.updateViewport();
		//core.setGameCanvasTranslate('hero', 0, 0);
	};

	// 复写转发
	core.drawHero = function (status, offset) {
		return core.control.drawHero(status, offset);
	};

	// 创建摄像机对象
	this.camera = new this.Camera();

	// 帧事件 更新摄像机
	this.updateCameraEx = function () {
		this.camera.update();
	};

	// 代理原本的镜头事件
	control.updateViewport = function () {
		core.plugin.camera.requestCameraUpdate();
	};

	// 更变楼层的行为追加，重置镜头
	events.prototype.changingFloor = function (floorId, heroLoc, fromLoad) {
		this.eventdata.changingFloor(floorId, heroLoc, fromLoad);
		core.plugin.camera.resetCamera();
	};

	// 注册帧事件
	core.registerAnimationFrame('smoothCameraFlash', true, this.updateCameraEx.bind(this));
}
}