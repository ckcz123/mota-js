;(function(window, undefined){
	"use strict"

	var _data = window.ColorPicker, // will be deleted in buildView() and holds:
		// window.ColorPicker = { // comes from colorPicker.data.js and will be overwritten.
		// 	_html: ..., // holds the HTML markup of colorPicker
		// 	_cssFunc: ..., // CSS for all the sliders
		// 	_cssMain: ..., // CSS of the GUI
		// 	_horizontalPng: ..., // horizontal background images for sliders
		// 	_verticalPng: ..., // vertical background images for sliders
		// 	_patchesPng: ..., // background images for square sliders in RGB mode
		// 	_iconsPng: ..., // some icon sprite images
		// 	_bgsPng: ..., // some more icon sprite images
		// }
		_devMode = !_data, // if no _data we assume that colorPicker.data.js is missing (for development)
		_isIE = false,
		_doesOpacity = false,
		// _isIE8 = _isIE && document.querySelectorAll,

		_valueRanges = {}, // will be assigned in initInstance() by Colors instance
		// _valueRanges = {
		// 	rgb:   {r: [0, 255], g: [0, 255], b: [0, 255]},
		// 	hsv:   {h: [0, 360], s: [0, 100], v: [0, 100]},
		// 	hsl:   {h: [0, 360], s: [0, 100], l: [0, 100]},
		// 	cmyk:  {c: [0, 100], m: [0, 100], y: [0, 100], k: [0, 100]},
		// 	cmy:   {c: [0, 100], m: [0, 100], y: [0, 100]},
		// 	XYZ:   {X: [0, 100], Y: [0, 100], Z: [0, 100]},
		// 	Lab:   {L: [0, 100], a: [-128, 127], b: [-128, 127]},
		// 	alpha: {alpha: [0, 1]},
		// 	HEX:   {HEX: [0, 16777215]}
		// },
		_bgTypes = {w: 'White', b: 'Black', c: 'Custom'},

		_mouseMoveAction, // current mouseMove handler assigned on mouseDown
		_action = '', // needed for action callback; needed due to minification of javaScript
		_mainTarget, // target on mouseDown, might be parent element though...
		_valueType, // check this variable; gets missused/polutet over time
		_delayState = 1, // mouseMove offset (y-axis) in display elements // same here...
		_startCoords = {},
		_targetOrigin = {},
		_renderTimer, // animationFrame/interval variable
		_newData = true,
		// _txt = {
		// 	selection: document.selection || window.getSelection(),
		// 	range: (document.createRange ? document.createRange() : document.body.createTextRange())
		// },

		_renderVars = {}, // used only in renderAll and convertColors
		_cashedVars = {}, // reset in initSliders

		_colorPicker,
		_previousInstance, // only used for recycling purposes in buildView()
		_colorInstance = {},
		_colors = {},
		_options = {},
		_nodes = {},

		_math = Math,

		animationFrame = 'AnimationFrame', // we also need this later
		requestAnimationFrame = 'request' + animationFrame,
		cancelAnimationFrame = 'cancel' + animationFrame,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		
		ColorPicker = function(options) { // as tiny as possible...
			this.options = {
				color: 'rgba(204, 82, 37, 0.8)',
				mode: 'rgb-b',
				fps: 60, // 1000 / 60 = ~16.7ms
				delayOffset: 8,
				CSSPrefix: 'cp-',
				allMixDetails: true,
				alphaBG: 'w',
				imagePath: ''
				// devPicker: false // uses existing HTML for development...
				// noAlpha: true,
				// customBG: '#808080'
				// size: 0,
				// cmyOnly: false,
				// initStyle: 'display: none',

				// memoryColors: "'rgba(82,80,151,1)','rgba(100,200,10,0.5)','rgba(100,0,0,1)','rgba(0,0,0,1)'"
				// memoryColors: [{r: 100, g: 200, b: 10, a: 0.5}] //  

				// opacityPositionRelative: undefined,
				// customCSS: undefined,
				// appendTo: document.body,
				// noRangeBackground: false,
				// textRight: false, ?????
				// noHexButton: false,
				// noResize: false,

				// noRGBr: false,
				// noRGBg: false,
				// noRGBb: false,

				// ------ CSSStrength: 'div.',
				// XYZMatrix: XYZMatrix,
				// XYZReference: {},
				// grey: grey,
				// luminance: luminance,

				// renderCallback: undefined,
				// actionCallback: undefined,
				// convertCallback: undefined,
			};
			initInstance(this, options || {});
		};

	window.ColorPicker = ColorPicker; // export differently
	ColorPicker.addEvent = addEvent;
	ColorPicker.removeEvent = removeEvent;
	ColorPicker.getOrigin = getOrigin;
	ColorPicker.limitValue = limitValue;
	ColorPicker.changeClass = changeClass;

	// ------------------------------------------------------ //

	ColorPicker.prototype.setColor = function(newCol, type, alpha, forceRender) {
		focusInstance(this);
		_valueType = true; // right cursor...
		// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
		preRenderAll(_colorInstance.setColor.apply(_colorInstance, arguments));
		if (forceRender) {
			this.startRender(true);
		}
	};

	ColorPicker.prototype.saveAsBackground = function() {
		focusInstance(this);
		return saveAsBackground(true);
	};

	ColorPicker.prototype.setCustomBackground = function(col) {
		focusInstance(this); // needed???
		return _colorInstance.setCustomBackground(col);
	};

	ColorPicker.prototype.startRender = function(oneTime) {
		focusInstance(this);
		if (oneTime) {
			_mouseMoveAction = false; // prevents window[requestAnimationFrame] in renderAll()
			renderAll();
			this.stopRender();
		} else {
			_mouseMoveAction = 1;
			_renderTimer = window[requestAnimationFrame](renderAll);
		}
	};

	ColorPicker.prototype.stopRender = function() {
		focusInstance(this); // check again
		window[cancelAnimationFrame](_renderTimer);
		if (_valueType) {
			// renderAll();
			_mouseMoveAction = 1;
			stopChange(undefined, 'external');
			// _valueType = undefined;
		}
	};

	ColorPicker.prototype.setMode = function(mode) { // check again ... right cursor
		focusInstance(this);
		setMode(mode);
		initSliders();
		renderAll();
	};

	ColorPicker.prototype.destroyAll = function() { // check this again...
		var html = this.nodes.colorPicker,
			destroyReferences = function(nodes) {
			for (var n in nodes) {
				if (nodes[n] && nodes[n].toString() === '[object Object]' || nodes[n] instanceof Array) {
					destroyReferences(nodes[n]);
				}
				nodes[n] = null;
				delete nodes[n];
			}
		};

		this.stopRender();
		installEventListeners(this, true);
		destroyReferences(this);
		html.parentNode.removeChild(html);
		html = null;
	};

	ColorPicker.prototype.renderMemory = function(memory) {
		var memos = this.nodes.memos,
			tmp = [];

		if (typeof memory === 'string') { // revisit!!!
			memory = memory.replace(/^'|'$/g, '').replace(/\s*/, '').split('\',\'');
		}
		for (var n = memos.length; n--; ) { // check again how to handle alpha...
			if (memory && typeof memory[n] === 'string') {
				tmp = memory[n].replace('rgba(', '').replace(')', '').split(',');
				memory[n] = {r: tmp[0], g: tmp[1], b: tmp[2], a: tmp[3]}
			}
			memos[n].style.cssText = 'background-color: ' + (memory && memory[n] !== undefined ?
				color2string(memory[n]) + ';' + getOpacityCSS(memory[n]['a'] || 1) : 'rgb(0,0,0);');
		}
	};

	// ------------------------------------------------------ //

	function initInstance(THIS, options) {
		var exporter, // do something here..
			mode = '',
			CSSPrefix = '',
			optionButtons;

		for (var option in options) { // deep copy ??
			THIS.options[option] = options[option];
		}
		_isIE = document.createStyleSheet !== undefined && document.getElementById || !!window.MSInputMethodContext;
		_doesOpacity = typeof document.body.style.opacity !== 'undefined';
		_colorInstance = new Colors(THIS.options);
		// We transfer the responsibility to the instance of Color (to save space and memory)
		delete THIS.options;
		_options = _colorInstance.options;
		_options.scale = 1;
		CSSPrefix = _options.CSSPrefix;

		THIS.color = _colorInstance; // check this again...
		_valueRanges = _options.valueRanges;
		THIS.nodes = _nodes = getInstanceNodes(buildView(THIS), THIS); // ha, ha,... make this different
		setMode(_options.mode);
		focusInstance(THIS);
		saveAsBackground();

		mode = ' ' + _options.mode.type + '-' + _options.mode.z;
		_nodes.slds.className += mode;
		_nodes.panel.className += mode;
		//_nodes.colorPicker.className += ' cmy-' + _options.cmyOnly;

		if (_options.noHexButton) {
			changeClass(_nodes.HEX_butt, CSSPrefix + 'butt', CSSPrefix + 'labl');
		}

		if (_options.size !== undefined) {
			resizeApp(undefined, _options.size);
		}

		optionButtons = {
			alphaBG: _nodes.alpha_labl,
			cmyOnly: _nodes.HEX_labl // test... take out
		};
		for (var n in optionButtons) {
			if (_options[n] !== undefined) {
				buttonActions({target: optionButtons[n], data: _options[n]});
			}
		}
		if (_options.noAlpha) {
			_nodes.colorPicker.className += ' no-alpha'; // IE6 ??? maybe for IE6 on document.body
		}

		THIS.renderMemory(_options.memoryColors);

		installEventListeners(THIS);
		
		_mouseMoveAction = true;
		stopChange(undefined, 'init');

		if (_previousInstance) {
			focusInstance(_previousInstance);
			renderAll();
		}
	}

	function focusInstance(THIS) {
		_newData = true;
		if (_colorPicker !== THIS) {
			_colorPicker = THIS;
			_colors = THIS.color.colors;
			_options = THIS.color.options;
			_nodes = THIS.nodes;
			_colorInstance = THIS.color;

			_cashedVars = {};
			preRenderAll(_colors);
		}
	}

	function getUISizes() {
		var sizes = ['L', 'S', 'XS', 'XXS'];
		_options.sizes = {};
		_nodes.testNode.style.cssText = 'position:absolute;left:-1000px;top:-1000px;';
		document.body.appendChild(_nodes.testNode);
		for (var n = sizes.length; n--; ) {
			_nodes.testNode.className = _options.CSSPrefix + 'app ' + sizes[n];
			_options.sizes[sizes[n]] = [_nodes.testNode.offsetWidth, _nodes.testNode.offsetHeight];
		}
		if (_nodes.testNode.removeNode) { // old IEs
			_nodes.testNode.removeNode(true);
		} else {
			document.body.removeChild(_nodes.testNode);
		}
	}

	function buildView(THIS) {
		var app = document.createElement('div'),
			prefix = _options.CSSPrefix,
			urlData = 'data:image/png;base64,',
			addStyleSheet = function(cssText, id) {
				var style = document.createElement('style');

				style.setAttribute('type', 'text/css');
				if (id) {
					style.setAttribute('id', id);
				}
				if (!style.styleSheet) {
					style.appendChild(document.createTextNode(cssText));
				}
				document.getElementsByTagName('head')[0].appendChild(style);
				if (style.styleSheet) { // IE compatible
					document.styleSheets[document.styleSheets.length-1].cssText = cssText;
				}
			},
			processCSS = function(doesBAS64){
				// CSS - system
				_data._cssFunc = _data._cssFunc.
					replace(/§/g, prefix).
					replace('_patches.png', doesBAS64 ? urlData + _data._patchesPng : _options.imagePath + '_patches.png').
					replace('_vertical.png', doesBAS64 ? urlData + _data._verticalPng : _options.imagePath + '_vertical.png').
					replace('_horizontal.png', doesBAS64 ? urlData + _data._horizontalPng :
						_options.imagePath + '_horizontal.png');
				addStyleSheet(_data._cssFunc, 'colorPickerCSS');
				// CSS - main
				if (!_options.customCSS) {
					_data._cssMain = _data._cssMain.
						replace(/§/g, prefix).
						replace('_bgs.png', doesBAS64 ? urlData + _data._bgsPng : _options.imagePath + '_bgs.png').
						replace('_icons.png', doesBAS64 ? urlData + _data._iconsPng : _options.imagePath + '_icons.png').
						// replace('"Courier New",', !_isIE ? '' : '"Courier New",').
						replace(/opacity:(\d*\.*(\d+))/g, function($1, $2){
							return !_doesOpacity ? '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=' +
							_math.round(+$2 * 100) + ')";filter: alpha(opacity=' + _math.round(+$2 * 100) + ')' :
							'-moz-opacity: ' + $2 + '; -khtml-opacity: ' + $2 + '; opacity: ' + $2;
						});
					// style.appendChild(document.createTextNode(_data._cssFunc));
					addStyleSheet(_data._cssMain);
				}
				// for (var n in _data) { // almost 25k of memory ;o)
				// 	_data[n] = null;
				// }
			},
			test = document.createElement('img');

		// development mode
		if (_devMode) {
			return THIS.color.options.devPicker;
		}

		// CSS
		if (!document.getElementById('colorPickerCSS')) { // only once needed
			test.onload = test.onerror = function(){
				if (_data._cssFunc) {
					processCSS(this.width === 1 && this.height === 1);
				}
				THIS.cssIsReady = true;
			};
			test.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		} else {
			THIS.cssIsReady = true;
		}

		// HTML
		if (_previousInstance = _colorPicker) {
			// we need to be careful with recycling HTML as slider calssNames might have been changed...
			initSliders();
		}
		// app.innerHTML = _colorPicker ? _colorPicker.nodes.colorPicker.outerHTML : _data._html.replace(/§/g, prefix);
		// faster ... FF8.0 (2011) though (but IE4)
		// outerHTML ... FF11 (2013)
		app.insertAdjacentHTML('afterbegin',
			_colorPicker ? _colorPicker.nodes.colorPicker.outerHTML ||
				new XMLSerializer().serializeToString(_colorPicker.nodes.colorPicker) : // FF before F11
				_data._html.replace(/§/g, prefix));
			// _colorPicker ? _colorPicker.nodes.colorPicker.parentNode.innerHTML : _data._html.replace(/§/g, prefix));
		// _data._html = null;

		app = app.children[0];
		app.style.cssText = _options.initStyle || ''; // for initial hiding...
		// get a better addClass for this....
		// app.className = app.className.split(' ')[0]; // cleanup for multy instances

		return (_options.appendTo || document.body).appendChild(app);
	}

	function getInstanceNodes(colorPicker, THIS) { // check nodes again... are they all needed?
		var all = colorPicker.getElementsByTagName('*'),
			nodes = {colorPicker: colorPicker}, // length ?? // rename nodes.colorPicker
			node,
			className,
			memoCounter = 0,
			regexp = new RegExp(_options.CSSPrefix);

		// nodes.displayStyles = {}; // not needed ... or change to CSS
		nodes.styles = {};
		// nodes.styles.displays = {};

		nodes.textNodes = {};
		nodes.memos = [];
		nodes.testNode = document.createElement('div');

		for (var n = 0, m = all.length; n < m; n++) {
			node = all[n];
			if ((className = node.className) && regexp.test(className)) {
				className = className.split(' ')[0].replace(_options.CSSPrefix, '').replace(/-/g, '_');
				if (/_disp/.test(className)) {
					className = className.replace('_disp', '');
					// nodes.styles.displays[className] = node.style;
					nodes.styles[className] = node.style;
					nodes.textNodes[className] = node.firstChild;
					node.contentEditable = true; // does this slow down rendering??
				} else {
					if (!(/(?:hs|cmyk|Lab).*?(?:butt|labl)/.test(className))) {
						nodes[className] = node;
					}
					if (/(?:cur|sld[^s]|opacity|cont|col)/.test(className)) {
						nodes.styles[className] = /(?:col\d)/.test(className) ? node.children[0].style : node.style;
					}
				}
			} else if (/memo/.test(node.parentNode.className)) {
				nodes.memos.push(node);
			}
		}

		// Chrome bug: focuses contenteditable on mouse over while dragging
		nodes.panelCover = nodes.panel.appendChild(document.createElement('div'));

		return nodes;
	}

	// ------------------------------------------------------ //
	// ---- Add event listners to colorPicker and window ---- //
	// -------------------------------------------------------//

	function installEventListeners(THIS, off) {
		var onOffEvent = off ? removeEvent : addEvent;

		onOffEvent(_nodes.colorPicker, 'mousedown', function(e) {
			var event = e || window.event,
				page = getPageXY(event),
				target = (event.button || event.which) < 2 ?
					(event.target || event.srcElement) : {},
				className = target.className;

			focusInstance(THIS);
			_mainTarget = target;
			stopChange(undefined, 'resetEventListener');
			_action = ''; // needed due to minification of javaScript

			if (target === _nodes.sldl_3 || target === _nodes.curm) {
				_mainTarget = _nodes.sldl_3;
				_mouseMoveAction = changeXYValue;
				_action = 'changeXYValue';
				changeClass(_nodes.slds, 'do-drag');
			} else if (/sldr/.test(className) || target === _nodes.curl || target === _nodes.curr) {
				_mainTarget = _nodes.sldr_4;
				_mouseMoveAction = changeZValue;
				_action = 'changeZValue';
			} else if (target === _nodes.opacity.children[0] || target === _nodes.opacity_slider) {
				_mainTarget = _nodes.opacity;
				_mouseMoveAction = changeOpacityValue;
				_action = 'changeOpacityValue';
			} else if (/-disp/.test(className) && !/HEX-/.test(className)) {
				_mouseMoveAction = changeInputValue;
				_action = 'changeInputValue';
				(target.nextSibling.nodeType === 3 ? target.nextSibling.nextSibling : target.nextSibling).
					appendChild(_nodes.nsarrow); // nextSibling for better text selection
				_valueType = className.split('-disp')[0].split('-');
				_valueType = {type: _valueType[0], z: _valueType[1] || ''};
				changeClass(_nodes.panel, 'start-change');
				_delayState = 0;
			} else if (target === _nodes.resize && !_options.noResize) {
				if (!_options.sizes) {
					getUISizes();
				}
				_mainTarget = _nodes.resizer;
				_mouseMoveAction = resizeApp;
				_action = 'resizeApp';
			} else {
				_mouseMoveAction = undefined;
			}

			if (_mouseMoveAction) {
				_startCoords = {pageX: page.X, pageY: page.Y};
				_mainTarget.style.display = 'block'; // for resizer...
				_targetOrigin = getOrigin(_mainTarget);
				_targetOrigin.width = _nodes.opacity.offsetWidth; // ???????
				_targetOrigin.childWidth = _nodes.opacity_slider.offsetWidth; // ???????
				_mainTarget.style.display = ''; // ??? for resizer...
				_mouseMoveAction(event);
				addEvent(_isIE ? document.body : window, 'mousemove', _mouseMoveAction);
				_renderTimer = window[requestAnimationFrame](renderAll);
			} else {
				// console.log(className)
				// console.log(THIS.nodes[className.split(' ')[0].replace('cp-', '').replace('-', '_')])
				// resize, button states, etc...
			}

			// if (_mouseMoveAction !== changeInputValue) preventDefault(event);
			if (!/-disp/.test(className)) {
				return preventDefault(event);
				// document.activeElement.blur();
			}
		});

		onOffEvent(_nodes.colorPicker, 'click', function(e) {
			focusInstance(THIS);
			buttonActions(e);
		});

		onOffEvent(_nodes.colorPicker, 'dblclick', buttonActions);

		onOffEvent(_nodes.colorPicker, 'keydown', function(e) {
			focusInstance(THIS);
			keyControl(e);
		});

		// keydown is before keypress and focuses already
		onOffEvent(_nodes.colorPicker, 'keypress', keyControl);
		// onOffEvent(_nodes.colorPicker, 'keyup', keyControl);

		onOffEvent(_nodes.colorPicker, 'paste', function(e) {
			e.target.firstChild.data = e.clipboardData.getData('Text');
			return preventDefault(e);
		});
	}

	addEvent(_isIE ? document.body : window, 'mouseup', stopChange);

	// ------------------------------------------------------ //
	// --------- Event listner's callback functions  -------- //
	// -------------------------------------------------------//

	function stopChange(e, action) {
		var mouseMoveAction = _mouseMoveAction;

		if (_mouseMoveAction) { // why??? please test again...
			// if (document.selection && _mouseMoveAction !== changeInputValue) {
			// 	//ie -> prevent showing the accelerator menu
			// 	document.selection.empty();
			// }
			window[cancelAnimationFrame](_renderTimer);
			removeEvent(_isIE ? document.body : window, 'mousemove', _mouseMoveAction);
			if (_delayState) { // hapens on inputs
				_valueType = {type: 'alpha'};
				renderAll();
			}
			// this is dirty... has to do with M|W|! button
			if (typeof _mouseMoveAction === 'function' || typeof _mouseMoveAction === 'number') {
				delete _options.webUnsave;
			}

			_delayState = 1;
			_mouseMoveAction = undefined;

			changeClass(_nodes.slds, 'do-drag', '');
			changeClass(_nodes.panel, '(?:start-change|do-change)', '');

			_nodes.resizer.style.cssText = '';
			_nodes.panelCover.style.cssText = '';

			_nodes.memo_store.style.cssText = 'background-color: ' +
				color2string(_colors.RND.rgb) + '; ' + getOpacityCSS(_colors.alpha);
			_nodes.memo.className = _nodes.memo.className.replace(/\s+(?:dark|light)/, '') +
				// (/dark/.test(_nodes.colorPicker.className) ? ' dark' : ' light');
				(_colors['rgbaMix' + _bgTypes[_options.alphaBG]].luminance < 0.22 ? ' dark' : ' light');
				// (_colors.rgbaMixCustom.luminance < 0.22 ? ' dark' : ' light')

			_valueType = undefined;

			resetCursors();

			if (_options.actionCallback) {
				_options.actionCallback(e, _action || mouseMoveAction.name || action || 'external');
			}
		}
	}

	function changeXYValue(e) {
		var event = e || window.event,
			scale = _options.scale,
			page = getPageXY(event),
			x = (page.X - _targetOrigin.left) * (scale === 4 ? 2 : scale),
			y = (page.Y - _targetOrigin.top) * scale,
			mode = _options.mode;

		_colors[mode.type][mode.x] = limitValue(x / 255, 0, 1);
		_colors[mode.type][mode.y] = 1 - limitValue(y / 255,  0, 1);
		convertColors();
		return preventDefault(event);
	}

	function changeZValue(e) { // make this part of changeXYValue
		var event = e || window.event,
			page = getPageXY(event),
			z = (page.Y - _targetOrigin.top) * _options.scale,
			mode = _options.mode;

		_colors[mode.type][mode.z] = 1 - limitValue(z / 255,  0, 1);
		convertColors();
		return preventDefault(event);
	}

	function changeOpacityValue(e) {
		var event = e || window.event,
			page = getPageXY(event);

		_newData = true;
		_colors.alpha = limitValue(_math.round(
			(page.X - _targetOrigin.left) / _targetOrigin.width * 100), 0, 100
		) / 100;
		convertColors('alpha');
		return preventDefault(event);
	}

	function changeInputValue(e) {
		var event = e || window.event,
			page = getPageXY(event),
			delta = _startCoords.pageY - page.Y,
			delayOffset = _options.delayOffset,
			type = _valueType.type,
			isAlpha = type === 'alpha',
			ranges;

		if (_delayState || _math.abs(delta) >= delayOffset) {
			if (!_delayState) {
				_delayState = (delta > 0 ? -delayOffset : delayOffset) +
					(+_mainTarget.firstChild.data) * (isAlpha ? 100 : 1);
				_startCoords.pageY += _delayState;
				delta += _delayState;
				_delayState = 1;
				changeClass(_nodes.panel, 'start-change', 'do-change');
				_nodes.panelCover.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0';
				// window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				document.activeElement.blur();
				_renderTimer = window[requestAnimationFrame](renderAll);
			}

			if (type === 'cmyk' && _options.cmyOnly) {
				type = 'cmy';
			}

			if (isAlpha) {
				_newData = true;
				_colors.alpha = limitValue(delta / 100, 0, 1);
			} else {
				ranges = _valueRanges[type][_valueType.z];
				_colors[type][_valueType.z] = type === 'Lab' ? limitValue(delta, ranges[0], ranges[1]) :
					limitValue(delta / ranges[1], 0, 1);
			}
			convertColors(isAlpha ? 'alpha' : type);
			// event.returnValue is deprecated. Please use the standard event.preventDefault() instead.
			// event.returnValue = false; // see: pauseEvent(event);
			return preventDefault(event);
		}
	}

	function keyControl(e) { // this is quite big for what it does...
		var event = e || window.event,
			keyCode =  event.which || event.keyCode,
			key = String.fromCharCode(keyCode),
			elm = document.activeElement,

			cln = elm.className.replace(_options.CSSPrefix, '').split('-'),
			type = cln[0],
			mode = cln[1],

			isAlpha = type === 'alpha',
			isHex = type === 'HEX',
			arrowKey = {k40: -1, k38: 1, k34: -10, k33: 10}['k' + keyCode] / (isAlpha ? 100 : 1),
			validKeys = {'HEX': /[0-9a-fA-F]/, 'Lab': /[\-0-9]/, 'alpha': /[\.0-9]/}[type] || /[0-9]/,
			valueRange = _valueRanges[type][type] || _valueRanges[type][mode], // let op!

			textNode = elm.firstChild, // chnge on TAB key
			rangeData = caret(elm),
			origValue = textNode.data, // do not change
			value,
			val = origValue === '0' && !isHex ? [] : origValue.split(''); // gefixt

		if (/^(?:27|13)$/.test(keyCode)) { // ENTER || ESC
			preventDefault(event);
			elm.blur();
		} else if (event.type === 'keydown') { // functional keys
			if (arrowKey) { // arrow/page keys
				value = limitValue(_math.round((+origValue + arrowKey) * 1e+6) / 1e+6, valueRange[0], valueRange[1]);
			} else if (/^(?:8|46)$/.test(keyCode)) { // DELETE / BACKSPACE
				if (!rangeData.range) {
					rangeData.range++;
					rangeData.start -= keyCode === 8 ? 1 : 0;
				}
				val.splice(rangeData.start, rangeData.range);
				value = val.join('') || '0'; // never loose elm.firstChild
			}

			if (value !== undefined) { // prevent keypress
				preventDefault(event, true);
			}
		} else if (event.type === 'keypress') {
			if (!/^(?:37|39|8|46|9)$/.test(keyCode)) { // left, right,DEL, BACK, TAB for FF
				preventDefault(event, true);
			}
			if (validKeys.test(key)) { // regular input
				val.splice(rangeData.start, rangeData.range, key);
				value = val.join('');
			}
			rangeData.start++;
		}

		if (keyCode === 13 && isHex) {
			if (textNode.data.length % 3 === 0 || textNode.data === '0') { // textNode.data.length && 
				return _colorPicker.setColor(textNode.data === '0' ? '000' : textNode.data, 'rgb', _colors.alpha, true);
			} else {
				preventDefault(event, true);
				return elm.focus();
			}
		}

		if (isHex && value !== undefined) {
			value = /^0+/.test(value) ? value : parseInt(''+value, 16) || 0;
		}

		if (value !== undefined && value !== '' && +value >= valueRange[0] && +value <= valueRange[1]) {
			if (isHex) {
				value = value.toString(16).toUpperCase() || '0';
			}
			if (isAlpha) {
				_colors[type] = +value;
			} else if (!isHex) {
				_colors[type][mode] = +value / (type === 'Lab' ? 1 : valueRange[1]);
			}
			convertColors(isAlpha ? 'alpha' : type);

			preRenderAll(_colors);
			_mouseMoveAction = true;
			stopChange(e, event.type);

			textNode.data = value; // if 
			caret(elm, _math.min(elm.firstChild.data.length, rangeData.start < 0 ? 0 : rangeData.start));
		}
	}

	function buttonActions(e) {
		var event = e || window.event,
			target = event.target || event.srcElement,
			targetClass = target.className,
			parent = target.parentNode,
			options = _options,
			RGB = _colors.RND.rgb,
			customBG, alphaBG,
			mode = _options.mode,
			newMode = '',
			prefix = options.CSSPrefix,
			isModeButton = /(?:hs|rgb)/.test(parent.className) && /^[HSBLRG]$/.test(
				target.firstChild ? target.firstChild.data : ''
			),
			isDblClick = /dblc/.test(event.type),
			buttonAction = ''; // think this over again....

		if (isDblClick && !isModeButton) {
			return;
		} else if (targetClass.indexOf('-labl ' + prefix + 'labl') !== -1) { // HSB -> HSL; CMYK -> Lab buttons
			changeClass(_nodes[targetClass.split('-')[0]], prefix + 'hide', '');
			changeClass(_nodes[parent.className.split('-')[1]], prefix + 'hide');
		} else if (targetClass.indexOf(prefix + 'butt') !== -1) { // BUTTONS
			if (isModeButton) { // set render modes
				if (isDblClick && _options.scale === 2) {
					newMode = /hs/.test(mode.type) ? 'rgb' : /hide/.test(_nodes.hsl.className) ? 'hsv' : 'hsl';
					newMode = newMode + '-' + newMode[mode.type.indexOf(mode.z)];
				}
				_colorPicker.setMode(newMode ? newMode : targetClass.replace('-butt', '').split(' ')[0]);
				buttonAction = 'modeChange';
			} else if (/^[rgb]/.test(targetClass)) { // no vertical slider rendering in RGB mode
				newMode = targetClass.split('-')[1];
				changeClass(_nodes.colorPicker, 'no-rgb-' + newMode,
					(options['noRGB' + newMode] = !options['noRGB' + newMode]) ? undefined : '');
				buttonAction = 'noRGB' + newMode;
				// preRenderAll();
			} else if (target === _nodes.alpha_labl) { // alpha button right (background of raster)
				customBG = options.customBG;
				alphaBG = options.alphaBG;
				changeClass(_nodes.colorPicker, 'alpha-bg-' + alphaBG, 'alpha-bg-' +
					(alphaBG = options.alphaBG = e.data || (alphaBG === 'w' ? (customBG ? 'c' : 'b') :
					alphaBG === 'c' ? 'b' : 'w')));
				target.firstChild.data = alphaBG.toUpperCase();
				_nodes.ctrl.style.backgroundColor = _nodes.memo.style.backgroundColor =
					alphaBG !== 'c' ? '' : 'rgb(' + _math.round(customBG.r * 255) + ', ' +
					_math.round(customBG.g * 255) + ', ' +
					_math.round(customBG.b * 255) + ')';
				_nodes.raster.style.cssText = _nodes.raster_bg.previousSibling.style.cssText =
					alphaBG !== 'c' ? '' : getOpacityCSS(customBG.luminance < 0.22 ? 0.5 : 0.4);
				buttonAction = 'alphaBackground';
			} else if (target === _nodes.alpha_butt) { // alpha button left (disable alpha rendering)
				changeClass(_nodes.colorPicker, 'mute-alpha', (options.muteAlpha = !options.muteAlpha) ? undefined : '');
				buttonAction = 'alphaState';
			} else if (target === _nodes.HEX_butt) { // make it on/off
				changeClass(_nodes.colorPicker, 'no-HEX', (options.HEXState = !options.HEXState) ? undefined : '');
				buttonAction = 'HEXState';
			} else if (target === _nodes.HEX_labl) { // web save state change
				var isWebSave = _colors.saveColor === 'web save';

				if (_colors.saveColor !== 'web smart' && !isWebSave) {
					options.webUnsave = copyColor(RGB);
					_colorPicker.setColor(_colors.webSmart, 'rgb');
				} else if (!isWebSave) {
					if (!options.webUnsave) {
						options.webUnsave = copyColor(RGB);
					}
					_colorPicker.setColor(_colors.webSave, 'rgb');
				} else {
					_colorPicker.setColor(options.webUnsave, 'rgb');
				}
				buttonAction = 'webColorState';
			} else if (/Lab-x-labl/.test(targetClass)) { //target === _nodes.cmyk_type) {
				// switch between CMYK and CMY
				changeClass(_nodes.colorPicker, 'cmy-only', (options.cmyOnly = !options.cmyOnly) ? undefined : '');
				buttonAction = 'cmykState';
			}
		} else if (target === _nodes.bsav) { // SAVE
			saveAsBackground();
			buttonAction = 'saveAsBackground';
		} else if (target === _nodes.bres) { // RESET
			var tmpColor = copyColor(RGB),
				tmpAlpha = _colors.alpha;

			// a bit heavy but... doesn't matter here
			// newCol, type, alpha, forceRender
			_colorPicker.setColor(options.color);
			saveAsBackground();
			_colorPicker.setColor(tmpColor, 'rgb', tmpAlpha);
			buttonAction = 'resetColor';
		} else if (parent === _nodes.col1) { // COLOR left
			// _colors.hsv.h = (_colors.hsv.h + 0.5) % 1; // not acurate
			_colors.hsv.h -= (_colors.hsv.h > 0.5 ? 0.5 : -0.5);
			convertColors('hsv');
			buttonAction = 'shiftColor';

		} else if (parent === _nodes.col2) { // COLOR right
			_colorPicker.setColor(target.style.backgroundColor, 'rgb', _colors.background.alpha);
			buttonAction = 'setSavedColor';
		} else if (parent === _nodes.memo) { // MEMORIES // revisit...
			var resetBlink = function() {
					if (_nodes.memos.blinker) _nodes.memos.blinker.style.cssText = _nodes.memos.cssText;
				},
				doBlink = function(elm) {
					_nodes.memos.blinker = elm;
					elm.style.cssText = 'background-color:' + (_colors.RGBLuminance > 0.22 ? '#333' : '#DDD');
					window.setTimeout(resetBlink, 200);
				};

			if (target === _nodes.memo_cursor) { // save color in memo
				resetBlink();
				_nodes.memos.blinker = undefined;
				_nodes.testNode.style.cssText = _nodes.memo_store.style.cssText;
				_nodes.memos.cssText = _nodes.testNode.style.cssText; // ...how browser sees css
				for (var n = _nodes.memos.length - 1; n--; ) { // check if color already exists
					if (_nodes.memos.cssText === _nodes.memos[n].style.cssText) {
						doBlink(_nodes.memos[n]); // sets _nodes.memos.blinker
						break;
					}
				}
				if (!_nodes.memos.blinker) { // right shift colors
					for (var n = _nodes.memos.length - 1; n--; ) {
						_nodes.memos[n + 1].style.cssText = _nodes.memos[n].style.cssText;
					}
					_nodes.memos[0].style.cssText = _nodes.memo_store.style.cssText;
				}
				buttonAction = 'toMemory';
			} else { // reset color from memo
				resetBlink();
				_colorPicker.setColor(target.style.backgroundColor, 'rgb', target.style.opacity || 1);
				_nodes.memos.cssText = target.style.cssText;
				doBlink(target);
				// this is dirty... has to do with M|W|! button
				_mouseMoveAction = 1;
				buttonAction = 'fromMemory';
			}

		}
		// think this over again, does this need to be like this??
		if (buttonAction) {
			preRenderAll(_colors);
			_mouseMoveAction = _mouseMoveAction || true; // !!!! search for: // this is dirty...
			stopChange(e, buttonAction);
		}
	}

	function resizeApp(e, size) {
		var event = e || window.event,
			page = event ? getPageXY(event) : {},
			isSize = size !== undefined,
			x = isSize ? size : page.X - _targetOrigin.left + 8,
			y = isSize ? size : page.Y - _targetOrigin.top + 8,
			values = [' S XS XXS', ' S XS', ' S', ''],
			sizes = _options.sizes, // from getUISizes();
			currentSize = isSize ? size :
				y < sizes.XXS[1] + 25 ? 0 :
				x < sizes.XS[0] + 25 ? 1 :
				x < sizes.S[0] + 25 || y < sizes.S[1] + 25 ? 2 : 3,
			value = values[currentSize],
			isXXS = false,
			mode,
			tmp = '';

		if (_cashedVars.resizer !== value) {
			isXXS = /XX/.test(value);
			mode = _options.mode;

			if (isXXS && (!/hs/.test(mode.type) || mode.z === 'h')) {
				tmp = mode.type + '-' + mode.z;
				_colorPicker.setMode(/hs/.test(mode.type) ? mode.type + '-s': 'hsv-s');
				_options.mode.original = tmp;
			} else if (mode.original) {
				// setMode(mode) creates a new object so mode.original gets deleted automatically
				_colorPicker.setMode(mode.original);
			}

			_nodes.colorPicker.className = _nodes.colorPicker.className.replace(/\s+(?:S|XS|XXS)/g, '') + value;
			_options.scale = isXXS ? 4 : /S/.test(value) ? 2 : 1;
			_options.currentSize = currentSize;

			_cashedVars.resizer = value;

			// fix this... from this point on inside if() ... convertColors();
			_newData = true;
			renderAll();
			resetCursors();
		}

		_nodes.resizer.style.cssText = 'display: block;' +
			'width: '  + (x > 10 ? x : 10) + 'px;' +
			'height: ' + (y > 10 ? y : 10) + 'px;';
	}

	// ------------------------------------------------------ //
	// --- Colors calculation and rendering related stuff  --- //
	// -------------------------------------------------------//

	function setMode(mode) {
		var ModeMatrix = {
			rgb_r : {x: 'b', y: 'g'},
			rgb_g : {x: 'b', y: 'r'},
			rgb_b : {x: 'r', y: 'g'},

			hsv_h : {x: 's', y: 'v'},
			hsv_s : {x: 'h', y: 'v'},
			hsv_v : {x: 'h', y: 's'},

			hsl_h : {x: 's', y: 'l'},
			hsl_s : {x: 'h', y: 'l'},
			hsl_l : {x: 'h', y: 's'}
		},
		key = mode.replace('-', '_'),
		regex = '\\b(?:rg|hs)\\w\\-\\w\\b'; // \\b\\w{3}\\-\\w\\b';

		// changeClass(_nodes.colorPicker, '(?:.*?)$', mode);
		// changeClass(_nodes.colorPicker, '\\b\\w{3}\\-\\w\\b', mode);
		// changeClass(_nodes.slds, '\\b\\w{3}\\-\\w\\b', mode);
		changeClass(_nodes.panel, regex, mode);
		changeClass(_nodes.slds, regex, mode);

		mode = mode.split('-');
		return _options.mode = {
			type: mode[0],
			x: ModeMatrix[key].x,
			y: ModeMatrix[key].y,
			z: mode[1]
		};
	}

	function initSliders() { // function name...
		var regex = /\s+(?:hue-)*(?:dark|light)/g,
			className = 'className'; // minification

		_nodes.curl[className] = _nodes.curl[className].replace(regex, ''); // .....
		_nodes.curr[className] = _nodes.curr[className].replace(regex, ''); // .....
		_nodes.slds[className] = _nodes.slds[className].replace(regex, '');
		// var sldrs = ['sldr_2', 'sldr_4', 'sldl_3'];
		// for (var n = sldrs.length; n--; ) {
		// 	_nodes[sldrs[n]][className] = _options.CSSPrefix + sldrs[n].replace('_', '-');
		// }
		_nodes.sldr_2[className] = _options.CSSPrefix + 'sldr-2';
		_nodes.sldr_4[className] = _options.CSSPrefix + 'sldr-4';
		_nodes.sldl_3[className] = _options.CSSPrefix + 'sldl-3';

		for (var style in _nodes.styles) {
			if (!style.indexOf('sld')) _nodes.styles[style].cssText = '';
		}
		_cashedVars = {};
	}

	function resetCursors() {
		// _renderVars.isNoRGB = undefined;
		_nodes.styles.curr.cssText = _nodes.styles.curl.cssText; // only coordinates
		_nodes.curl.className = _options.CSSPrefix + 'curl' + (
			_renderVars.noRGBZ ? ' ' + _options.CSSPrefix + 'curl-' +_renderVars.noRGBZ: '');
		_nodes.curr.className = _options.CSSPrefix + 'curr ' + _options.CSSPrefix + 'curr-' +
			(_options.mode.z === 'h' ? _renderVars.HUEContrast : _renderVars.noRGBZ ?
				_renderVars.noRGBZ : _renderVars.RGBLuminance);
	}

	function convertColors(type) {
		preRenderAll(_colorInstance.setColor(undefined, type || _options.mode.type));
		_newData = true;
	}

	function saveAsBackground(refresh) {
		_colorInstance.saveAsBackground();
		_nodes.styles.col2.cssText = 'background-color: ' + color2string(_colors.background.RGB) + ';' +
			getOpacityCSS(_colors.background.alpha);
		
		if (refresh) {
			preRenderAll(_colors);
			// renderAll();
		}
		return (_colors);
	}

	function preRenderAll(colors) {
		var _Math = _math,
			renderVars = _renderVars,
			bgType = _bgTypes[_options.alphaBG];

		renderVars.hueDelta = _Math.round(colors['rgbaMixBGMix' + bgType].hueDelta * 100);
		// renderVars.RGBLuminanceDelta = _Math.round(colors.RGBLuminanceDelta * 100);
		renderVars.luminanceDelta = _Math.round(colors['rgbaMixBGMix' + bgType].luminanceDelta * 100);
		renderVars.RGBLuminance = colors.RGBLuminance > 0.22 ? 'light' : 'dark';
		renderVars.HUEContrast = colors.HUELuminance > 0.22 ? 'light' : 'dark';
		// renderVars.contrast = renderVars.RGBLuminanceDelta > renderVars.hueDelta ? 'contrast' : '';
		renderVars.contrast = renderVars.luminanceDelta > renderVars.hueDelta ? 'contrast' : '';
		renderVars.readabiltiy =
			colors['rgbaMixBGMix' + bgType].WCAG2Ratio >= 7 ? 'green' :
			colors['rgbaMixBGMix' + bgType].WCAG2Ratio >= 4.5 ? 'orange': '';
		renderVars.noRGBZ = _options['no' + _options.mode.type.toUpperCase() + _options.mode.z] ?
			(_options.mode.z === 'g' && colors.rgb.g < 0.59 || _options.mode.z === 'b' || _options.mode.z === 'r' ?
			'dark' : 'light') : undefined;
	}

	function renderAll() { // maybe render alpha seperately...
		if (_mouseMoveAction) {
			// _renderTimer = window[requestAnimationFrame](renderAll);
			if (!_newData) return (_renderTimer = window[requestAnimationFrame](renderAll));
			_newData = false;
		}
		// console.time('renderAll');
		var options = _options,
			mode = options.mode,
			scale = options.scale,
			prefix = options.CSSPrefix,
			colors = _colors,
			nodes = _nodes,
			CSS = nodes.styles,
			textNodes = nodes.textNodes,
			valueRanges = _valueRanges,
			valueType = _valueType,
			renderVars = _renderVars,
			cashedVars = _cashedVars,

			_Math = _math,
			_getOpacityCSS = getOpacityCSS,
			_color2string = color2string,

			a = 0,
			b = 0,
			x  = colors[mode.type][mode.x],
			X = _Math.round(x * 255 / (scale === 4 ? 2 : scale)),
			y_ = colors[mode.type][mode.y],
			y = 1 - y_,
			Y = _Math.round(y * 255 / scale),
			z  = 1 - colors[mode.type][mode.z],
			Z = _Math.round(z * 255 / scale),
			coords = (1 === 1) ? [x, y_] : [0, 0], // (1 === 2) button label up

			isRGB = mode.type === 'rgb',
			isHue = mode.z === 'h',
			isHSL = mode.type === 'hsl',
			isHSL_S = isHSL && mode.z === 's',
			moveXY = _mouseMoveAction === changeXYValue,
			moveZ  = _mouseMoveAction === changeZValue,
			display, tmp, value, slider;

		if (isRGB) {
			if (coords[0] >= coords[1]) b = 1; else a = 1;
			if (cashedVars.sliderSwap !== a) {
				nodes.sldr_2.className = options.CSSPrefix + 'sldr-' + (3 - a);
				cashedVars.sliderSwap = a;
			}
		}
		if ((isRGB && !moveZ) || (isHue && !moveXY) || (!isHue && !moveZ)) {
			CSS[isHue ? 'sldl_2' : 'sldr_2'][isRGB ? 'cssText' : 'backgroundColor'] =
				isRGB ? _getOpacityCSS((coords[a] - coords[b]) / (1 - (coords[b]) || 0)) : _color2string(colors.hueRGB);
		}
		if (!isHue) {
			if (!moveZ)  CSS.sldr_4.cssText = _getOpacityCSS(isRGB ? coords[b] : isHSL_S ? _Math.abs(1 - y * 2) : y);
			if (!moveXY) CSS.sldl_3.cssText = _getOpacityCSS(isHSL && mode.z === 'l' ? _Math.abs(1 - z * 2) : z);
			if (isHSL) { // switch slider class name for black/white color half way through in HSL(S|L) mode(s)
				slider = isHSL_S ? 'sldr_4' : 'sldl_3';
				tmp = isHSL_S ? 'r-' : 'l-';
				value = isHSL_S ? (y > 0.5 ? 4 : 3) : (z > 0.5 ? 3 : 4);

				if (cashedVars[slider] !== value) {
					nodes[slider].className = options.CSSPrefix + 'sld' + tmp + value;
					cashedVars[slider] = value;
				}
			}
		}

		if (!moveZ) CSS.curm.cssText = 'left: ' + X + 'px; top: ' + Y + 'px;';
		if (!moveXY) CSS.curl.top = Z + 'px';
		if (valueType) CSS.curr.top = Z + 'px'; // && valueType.type !== mode.type
		if ((valueType && valueType.type === 'alpha') || _mainTarget === nodes.opacity) {
			CSS.opacity_slider.left = options.opacityPositionRelative ? (colors.alpha * (
				(_targetOrigin.width || nodes.opacity.offsetWidth) -
				(_targetOrigin.childWidth || nodes.opacity_slider.offsetWidth))) + 'px' :
				(colors.alpha * 100) + '%';
		}

		CSS.col1.cssText = 'background-color: ' + _color2string(colors.RND.rgb) + '; ' +
			(options.muteAlpha ? '' : _getOpacityCSS(colors.alpha));
		CSS.opacity.backgroundColor = _color2string(colors.RND.rgb);
		CSS.cold.width = renderVars.hueDelta + '%';
		CSS.cont.width = renderVars.luminanceDelta + '%';

		for (display in textNodes) {
			tmp = display.split('_');
			if (options.cmyOnly) {
				tmp[0] = tmp[0].replace('k', '');
			}
			value = tmp[1] ? colors.RND[tmp[0]][tmp[1]] : colors.RND[tmp[0]] || colors[tmp[0]];
			if (cashedVars[display] !== value) {
				cashedVars[display] = value;
				textNodes[display].data = value > 359.5 && display !== 'HEX' ? 0 : value;

				if (display !== 'HEX' && !options.noRangeBackground) {
					value = colors[tmp[0]][tmp[1]] !== undefined ? colors[tmp[0]][tmp[1]] : colors[tmp[0]];
					if (tmp[0] === 'Lab') {
						value = (value - valueRanges[tmp[0]][tmp[1]][0]) /
							(valueRanges[tmp[0]][tmp[1]][1] - valueRanges[tmp[0]][tmp[1]][0]);
					}
					CSS[display].backgroundPosition = _Math.round((1 - value) * 100) + '% 0%';
				}
			}
		}
		// Lab out of gammut
		tmp = colors._rgb ? [
			colors._rgb.r !== colors.rgb.r,
			colors._rgb.g !== colors.rgb.g,
			colors._rgb.b !== colors.rgb.b
		] : [];
		if (tmp.join('') !== cashedVars.outOfGammut) {
			nodes.rgb_r_labl.firstChild.data = tmp[0] ? '!' : ' ';
			nodes.rgb_g_labl.firstChild.data = tmp[1] ? '!' : ' ';
			nodes.rgb_b_labl.firstChild.data = tmp[2] ? '!' : ' ';
			cashedVars.outOfGammut = tmp.join('');
		}
		if (renderVars.noRGBZ) {
			if (cashedVars.noRGBZ !== renderVars.noRGBZ) {
				nodes.curl.className = prefix + 'curl ' + prefix + 'curl-' + renderVars.noRGBZ;
					
				if (!moveZ) {
					nodes.curr.className = prefix + 'curr ' + prefix + 'curr-' + renderVars.noRGBZ;
				}
				cashedVars.noRGBZ = renderVars.noRGBZ;
			}
		}
		if (cashedVars.HUEContrast !== renderVars.HUEContrast && mode.z === 'h') {
			nodes.slds.className = nodes.slds.className.replace(/\s+hue-(?:dark|light)/, '') +
				' hue-' + renderVars.HUEContrast;
			if (!moveZ) {
				nodes.curr.className = prefix + 'curr ' + prefix + 'curr-' + renderVars.HUEContrast;
			}
			cashedVars.HUEContrast = renderVars.HUEContrast;
		} else if (cashedVars.RGBLuminance !== renderVars.RGBLuminance) { // test for no else
			nodes.colorPicker.className = nodes.colorPicker.className.replace(/\s+(?:dark|light)/, '') +
				' ' + renderVars.RGBLuminance;
			if (!moveZ && mode.z !== 'h' && !renderVars.noRGBZ) {
				nodes.curr.className = prefix + 'curr ' + prefix + 'curr-' + renderVars.RGBLuminance;
			}
			cashedVars.RGBLuminance = renderVars.RGBLuminance;
		}

		if (cashedVars.contrast !== renderVars.contrast || cashedVars.readabiltiy !== renderVars.readabiltiy) {
			nodes.ctrl.className = nodes.ctrl.className.replace(' contrast', '').replace(/\s*(?:orange|green)/, '') +
				(renderVars.contrast ? ' ' + renderVars.contrast : '') +
				(renderVars.readabiltiy ? ' ' + renderVars.readabiltiy : '');
			cashedVars.contrast = renderVars.contrast;
			cashedVars.readabiltiy = renderVars.readabiltiy;
		}

		if (cashedVars.saveColor !== colors.saveColor) {
			nodes.HEX_labl.firstChild.data = !colors.saveColor ? '!' : colors.saveColor === 'web save' ? 'W' : 'M';
			cashedVars.saveColor = colors.saveColor;
		}

		if (options.renderCallback) {
			options.renderCallback(colors, mode); // maybe more parameters
		}

		if (_mouseMoveAction) {
			_renderTimer = window[requestAnimationFrame](renderAll);
		}

		// console.timeEnd('renderAll')
	}


	// ------------------------------------------------------ //
	// ------------------ helper functions ------------------ //
	// -------------------------------------------------------//

	function copyColor(color) {
		var newColor = {};

		for (var n in color) {
			newColor[n] = color[n];
		}
		return newColor;
	}

	// function color2string(color, type) {
	// 	var out = [],
	// 		n = 0;

	// 	type = type || 'rgb';
	// 	while (type.charAt(n)) { // IE7 // V8 type[n] || 
	// 		out.push(color[type.charAt(n)]);
	// 		n++;
	// 	}
	// 	return type + '(' + out.join(', ') + ')';
	// }

	function color2string(color, type) { // ~2 x faster on V8
		var out = '',
			t = (type || 'rgb').split(''),
			n = t.length;

		for ( ; n--; ) {
			out = ', ' + color[t[n]] + out;
		}
		return (type || 'rgb') + '(' + out.substr(2) + ')';
	}


	function limitValue(value, min, max) {
		// return Math.max(min, Math.min(max, value)); // faster??
		return (value > max ? max : value < min ? min : value);
	}

	function getOpacityCSS(value) {
		if (value === undefined) value = 1;

		if (_doesOpacity) {
			return 'opacity: ' + (_math.round(value * 10000000000) / 10000000000) + ';'; // value.toFixed(16) = 99% slower
			// some speed test:
			// return ['opacity: ', (Math.round(value * 1e+10) / 1e+10), ';'].join('');
		} else {
			return 'filter: alpha(opacity=' + _math.round(value * 100) + ');';
		}
	}

	function preventDefault(e, skip) {
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		if (!skip) window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		return false;
	}

	function changeClass(elm, cln, newCln) {
		return  !elm ? false : elm.className = (newCln !== undefined ?
			elm.className.replace(new RegExp('\\s+?' + cln, 'g'), newCln ? ' ' + newCln : '') :
			elm.className + ' ' + cln);
	}

	function getOrigin(elm) {
		var box = (elm.getBoundingClientRect) ? elm.getBoundingClientRect() : {top: 0, left: 0},
			doc = elm && elm.ownerDocument,
			body = doc.body,
			win = doc.defaultView || doc.parentWindow || window,
			docElem = doc.documentElement || body.parentNode,
			clientTop  = docElem.clientTop  || body.clientTop  || 0, // border on html or body or both
			clientLeft =  docElem.clientLeft || body.clientLeft || 0;

		return {
			left: box.left + (win.pageXOffset || docElem.scrollLeft) - clientLeft,
			top:  box.top  + (win.pageYOffset || docElem.scrollTop)  - clientTop
		};
	}

	function getPageXY(e) {
		var doc = window.document;

		return {
			X: e.pageX || e.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft,
			Y: e.pageY || e.clientY + doc.body.scrollTop + doc.documentElement.scrollTop
		};
	}

	function addEvent(obj, type, func) {
		addEvent.cache = addEvent.cache || {
			_get: function(obj, type, func, checkOnly) {
				var cache = addEvent.cache[type] || [];

				for (var n = cache.length; n--; ) {
					if (obj === cache[n].obj && '' + func === '' + cache[n].func) {
						func = cache[n].func;
						if (!checkOnly) {
							cache[n] = cache[n].obj = cache[n].func = null;
							cache.splice(n, 1);
						}
						return func;
					}
				}
			},
			_set: function(obj, type, func) {
				var cache = addEvent.cache[type] = addEvent.cache[type] || [];
				
				if (addEvent.cache._get(obj, type, func, true)) {
					return true;
				} else {
					cache.push({
						func: func,
						obj: obj
					});
				}
			}
		};

		if (!func.name && addEvent.cache._set(obj, type, func) || typeof func !== 'function') {
			return;
		}

		if (obj.addEventListener) obj.addEventListener(type, func, false);
		else obj.attachEvent('on' + type, func);
	}

	function removeEvent(obj, type, func) {
		if (typeof func !== 'function') return;
		if (!func.name) {
			func = addEvent.cache._get(obj, type, func) || func;
		}

		if (obj.removeEventListener) obj.removeEventListener(type, func, false);
		else obj.detachEvent('on' + type, func);
	}

	function caret(target, pos) { // only for contenteditable
		var out = {};

		if (pos === undefined) { // get
			if (window.getSelection) { // HTML5
				target.focus();
				var range1 = window.getSelection().getRangeAt(0),
					range2 = range1.cloneRange();
				range2.selectNodeContents(target);
				range2.setEnd(range1.endContainer, range1.endOffset);
				out = {
					end: range2.toString().length,
					range: range1.toString().length
				};
			} else { // IE < 9
				target.focus();
				var range1 = document.selection.createRange(),
					range2 = document.body.createTextRange();
				range2.moveToElementText(target);
				range2.setEndPoint('EndToEnd', range1);
				out = {
					end: range2.text.length,
					range: range1.text.length
				};
			}
			out.start = out.end - out.range;
			return out;
		}
		// set
		if (pos == -1) pos = target['text']().length;
		
		if (window.getSelection) { // HTML5
			target.focus();
			window.getSelection().collapse(target.firstChild, pos);
		} else { // IE < 9
			var range = document.body.createTextRange();
			range.moveToElementText(target);
			range.moveStart('character', pos);
			range.collapse(true);
			range.select();
		}
		return pos;
	}

	// ------------- requestAnimationFrame shim ------------- //
	// ---------- quite optimized for minification ---------- //

	for(var n = vendors.length; n-- && !window[requestAnimationFrame]; ) {
		window[requestAnimationFrame] = window[vendors[n] + 'Request' + animationFrame];
		window[cancelAnimationFrame]  = window[vendors[n] + 'Cancel'  + animationFrame] ||
			window[vendors[n] + 'CancelRequest' + animationFrame];
	}

	window[requestAnimationFrame] = window[requestAnimationFrame] || function(callback) {
		// this is good enough... and better than setTimeout
			return window.setTimeout(callback, 1000 / _options.fps);
		// return _renderTimer ? _renderTimer : window.setInterval(callback, 1000 / _options.fps);
	};

	window[cancelAnimationFrame] = window[cancelAnimationFrame] || function(id) {
		// console.log('OFF-', id + '-' + _renderTimer)
		window.clearTimeout(id);
		return _renderTimer = null;
	};

})(window);