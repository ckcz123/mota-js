var terndefs_f6783a0a_522d_417e_8407_94c67b692e50 = [
  {
    "!name": "browser",
    "Node": {
      "!type": "fn()",
      "prototype": {
        "nextSibling": {
          "!type": "+Element",
          "!doc": "返回紧接其父节点的childNodes列表中指定节点之后的节点；如果指定节点是该列表中的最后一个节点,则返回null.",
        },
        "previousSibling": {
          "!type": "+Element",
          "!doc": "返回紧接其父节点的childNodes列表中指定节点之前的节点,如果指定节点是该列表中的第一个节点,则返回null.",
        },
        "lastChild": {
          "!type": "+Element",
          "!doc": "返回节点的最后一个孩子."
        },
        "firstChild": {
          "!type": "+Element",
          "!doc": "返回树中该节点的第一个子节点；如果该节点为无子节点,则返回null.如果该节点是Document,则返回其直接子节点列表中的第一个节点.",
        },
        "childNodes": {
          "!type": "+NodeList",
          "!doc": "返回给定元素的子节点的集合."
        },
        "parentNode": {
          "!type": "+Element",
          "!doc": "返回DOM树中指定节点的父级."
        },
        "tagName": {
          "!type": "string",
          "!doc": "将当前节点的名称作为字符串返回."
        },
        "insertBefore": {
          "!type": "fn(newElt: +Element, before: +Element) -> +Element",
          "!doc": "将指定的节点插入到参考元素之前,作为当前节点的子级.",
        },
        "removeChild": {
          "!type": "fn(oldNode: +Element) -> +Element",
          "!doc": "从DOM中删除一个子节点.返回已删除的节点.",
        },
        "appendChild": {
          "!type": "fn(newNode: +Element) -> +Element",
          "!doc": "将一个节点添加到指定父节点的子节点列表的末尾.如果该节点已经存在,则将其从当前父节点中删除,然后添加到新的父节点中.",
        },
        "cloneNode": {
          "!type": "fn(deep: bool) -> +Element",
          "!doc": "返回在其上调用此方法的节点的副本."
        },
        "addEventListener": {
          "!type": "fn(type: string, listener: fn(e: +Event), capture: bool)",
          "!doc": "在单个目标上注册单个事件侦听器.事件目标可以是文档中的单个元素,文档本身,窗口或XMLHttpRequest.",
        },
        "removeEventListener": {
          "!type": "fn(type: string, listener: fn(), capture: bool)",
          "!doc": "允许从事件目标中删除事件侦听器.",
        },
        "innerText": {
          "!type": "string",
          "!doc": "获取或设置节点及其后代的文本内容."
        }
      },
      "!doc": "节点是一个接口,许多DOM类型都从该接口继承,并允许类似地对待(或测试)这些各种类型.",
    },
    "Element": {
      "!type": "fn()",
      "prototype": {
        "!proto": "Node.prototype",
        "getAttribute": {
          "!type": "fn(name: string) -> string",
          "!doc": "返回指定元素上的命名属性的值.如果命名属性不存在,则返回的值将为null或\" \"(空字符串).",
        },
        "setAttribute": {
          "!type": "fn(name: string, value: string)",
          "!doc": "在指定元素上添加新属性或更改现有属性的值.",
        },
        "removeAttribute": {
          "!type": "fn(name: string)",
          "!doc": "从指定元素中删除属性.",
        },
        "getElementsByTagName": {
          "!type": "fn(tagName: string) -> +NodeList",
          "!doc": "返回具有给定标签名的元素列表.搜索指定元素下面的子树,不包括元素本身.返回的列表是活动的,这意味着它将自动使用DOM树进行更新.因此,无需使用相同的元素和参数多次调用element.getElementsByTagName."
        },
        "getElementsByClassName": {
          "!type": "fn(name: string) -> +NodeList",
          "!doc": "返回具有所有给定类名称的一组元素.在文档对象上调用时,将搜索整个文档,包括根节点.您还可以在任何元素上调用getElementsByClassName；它将仅返回元素,它们是具有给定类名的指定根元素的后代."
        },
        "children": {
          "!type": "+HTMLCollection",
          "!doc": "返回给定元素的子元素的集合."
        },
        "className": {
          "!type": "string",
          "!doc": "获取并设置指定元素的class属性的值.",
        },
        "style": {
          "cssText": "string",
          "alignmentBaseline": "string",
          "background": "string",
          "backgroundAttachment": "string",
          "backgroundClip": "string",
          "backgroundColor": "string",
          "backgroundImage": "string",
          "backgroundOrigin": "string",
          "backgroundPosition": "string",
          "backgroundPositionX": "string",
          "backgroundPositionY": "string",
          "backgroundRepeat": "string",
          "backgroundRepeatX": "string",
          "backgroundRepeatY": "string",
          "backgroundSize": "string",
          "baselineShift": "string",
          "border": "string",
          "borderBottom": "string",
          "borderBottomColor": "string",
          "borderBottomLeftRadius": "string",
          "borderBottomRightRadius": "string",
          "borderBottomStyle": "string",
          "borderBottomWidth": "string",
          "borderCollapse": "string",
          "borderColor": "string",
          "borderImage": "string",
          "borderImageOutset": "string",
          "borderImageRepeat": "string",
          "borderImageSlice": "string",
          "borderImageSource": "string",
          "borderImageWidth": "string",
          "borderLeft": "string",
          "borderLeftColor": "string",
          "borderLeftStyle": "string",
          "borderLeftWidth": "string",
          "borderRadius": "string",
          "borderRight": "string",
          "borderRightColor": "string",
          "borderRightStyle": "string",
          "borderRightWidth": "string",
          "borderSpacing": "string",
          "borderStyle": "string",
          "borderTop": "string",
          "borderTopColor": "string",
          "borderTopLeftRadius": "string",
          "borderTopRightRadius": "string",
          "borderTopStyle": "string",
          "borderTopWidth": "string",
          "borderWidth": "string",
          "bottom": "string",
          "boxShadow": "string",
          "boxSizing": "string",
          "captionSide": "string",
          "clear": "string",
          "clip": "string",
          "clipPath": "string",
          "clipRule": "string",
          "color": "string",
          "colorInterpolation": "string",
          "colorInterpolationFilters": "string",
          "colorProfile": "string",
          "colorRendering": "string",
          "content": "string",
          "counterIncrement": "string",
          "counterReset": "string",
          "cursor": "string",
          "direction": "string",
          "display": "string",
          "dominantBaseline": "string",
          "emptyCells": "string",
          "enableBackground": "string",
          "fill": "string",
          "fillOpacity": "string",
          "fillRule": "string",
          "filter": "string",
          "float": "string",
          "floodColor": "string",
          "floodOpacity": "string",
          "font": "string",
          "fontFamily": "string",
          "fontSize": "string",
          "fontStretch": "string",
          "fontStyle": "string",
          "fontVariant": "string",
          "fontWeight": "string",
          "glyphOrientationHorizontal": "string",
          "glyphOrientationVertical": "string",
          "height": "string",
          "imageRendering": "string",
          "kerning": "string",
          "left": "string",
          "letterSpacing": "string",
          "lightingColor": "string",
          "lineHeight": "string",
          "listStyle": "string",
          "listStyleImage": "string",
          "listStylePosition": "string",
          "listStyleType": "string",
          "margin": "string",
          "marginBottom": "string",
          "marginLeft": "string",
          "marginRight": "string",
          "marginTop": "string",
          "marker": "string",
          "markerEnd": "string",
          "markerMid": "string",
          "markerStart": "string",
          "mask": "string",
          "maxHeight": "string",
          "maxWidth": "string",
          "minHeight": "string",
          "minWidth": "string",
          "opacity": "string",
          "orphans": "string",
          "outline": "string",
          "outlineColor": "string",
          "outlineOffset": "string",
          "outlineStyle": "string",
          "outlineWidth": "string",
          "overflow": "string",
          "overflowWrap": "string",
          "overflowX": "string",
          "overflowY": "string",
          "padding": "string",
          "paddingBottom": "string",
          "paddingLeft": "string",
          "paddingRight": "string",
          "paddingTop": "string",
          "page": "string",
          "pageBreakAfter": "string",
          "pageBreakBefore": "string",
          "pageBreakInside": "string",
          "pointerEvents": "string",
          "position": "string",
          "quotes": "string",
          "resize": "string",
          "right": "string",
          "shapeRendering": "string",
          "size": "string",
          "speak": "string",
          "src": "string",
          "stopColor": "string",
          "stopOpacity": "string",
          "stroke": "string",
          "strokeDasharray": "string",
          "strokeDashoffset": "string",
          "strokeLinecap": "string",
          "strokeLinejoin": "string",
          "strokeMiterlimit": "string",
          "strokeOpacity": "string",
          "strokeWidth": "string",
          "tabSize": "string",
          "tableLayout": "string",
          "textAlign": "string",
          "textAnchor": "string",
          "textDecoration": "string",
          "textIndent": "string",
          "textLineThrough": "string",
          "textLineThroughColor": "string",
          "textLineThroughMode": "string",
          "textLineThroughStyle": "string",
          "textLineThroughWidth": "string",
          "textOverflow": "string",
          "textOverline": "string",
          "textOverlineColor": "string",
          "textOverlineMode": "string",
          "textOverlineStyle": "string",
          "textOverlineWidth": "string",
          "textRendering": "string",
          "textShadow": "string",
          "textTransform": "string",
          "textUnderline": "string",
          "textUnderlineColor": "string",
          "textUnderlineMode": "string",
          "textUnderlineStyle": "string",
          "textUnderlineWidth": "string",
          "top": "string",
          "unicodeBidi": "string",
          "unicodeRange": "string",
          "vectorEffect": "string",
          "verticalAlign": "string",
          "visibility": "string",
          "whiteSpace": "string",
          "width": "string",
          "wordBreak": "string",
          "wordSpacing": "string",
          "wordWrap": "string",
          "writingMode": "string",
          "zIndex": "string",
          "zoom": "string",
          "!doc": "返回一个表示元素的style属性的对象."
        },
        "classList": {
          "!type": "+DOMTokenList",
          "!doc": "返回元素的class属性的标记列表."
        },
        "title": {
          "!type": "string",
          "!doc":" \"\u5efa\u7acb\u5f53\u9f20\u6807\u60ac\u505c\u5728\u663e\u793a\u7684\u8282\u70b9\u4e0a\u65f6\u5728\"\u5de5\u5177\u63d0\u793a\"\u5f39\u51fa\u7a97\u53e3\u4e2d\u663e\u793a\u7684\u6587\u672c.\","
        },
        "width": {
          "!type": "number",
          "!doc": "返回元素的布局宽度."
        },
        "height": {
          "!type": "number",
          "!doc": "元素相对于元素的offsetParent的高度."
        },
        "getContext": {
          "!type": "fn(id: string) -> CanvasRenderingContext2D",
          "!doc": " DOM画布元素公开了HTMLCanvasElement接口,该接口提供了用于操纵画布元素的布局和表示的属性和方法.HTMLCanvasElement接口继承了元素对象接口的属性和方法.",
        },
        "innerHTML": {
          "!type": "string",
          "!doc": "设置或获取描述元素后代的HTML语法.",
        }
      },
      "!doc": "表示HTML或XML文档中的元素.",
    },
    "Document": {
      "!type": "fn()",
      "prototype": {
        "!proto": "Node.prototype",
        "height": {
          "!type": "number",
          "!doc": "返回当前文档的<body>元素的高度.",
        },
        "width": {
          "!type": "number",
          "!doc": "以像素为单位返回当前文档的<body>元素的宽度.",
        },
        "body": {
          "!type": "+Element",
          "!doc": "返回当前文档的<body>或<frameset>节点.",
        },
        "cookie": {
          "!type": "string",
          "!doc": "获取并设置与当前文档关联的cookie.",
        },
        "URL": "string",
        "title": {
          "!type": "string",
          "!doc": "获取或设置文档的标题."
        },
        "getElementById": {
          "!type": "fn(id: string) -> +Element",
          "!doc": "通过元素ID返回对该元素的引用."
        },
        "getElementsByTagName": {
          "!type": "fn(tagName: string) -> +NodeList",
          "!doc": "返回具有给定标签名称的元素的NodeList.将搜索整个文档,包括根节点.返回的NodeList处于活动状态,这意味着它会自动更新自身以与DOM树保持同步,而无需再次调用document.getElementsByTagName."
        },
        "getElementsByName": {
          "!type": "fn(name: string) -> +HTMLCollection",
          "!doc": "返回HTML文档中具有给定名称的元素列表.",
        },
        "getElementsByClassName": "Element.prototype.getElementsByClassName"
      },
      "!doc": "浏览器中加载的每个网页都有其自己的文档对象.此对象用作网页内容(DOM树,包括诸如<body>和<table>之类的元素)的入口点,并提供文档的全局功能(例如获取页面的URL和在文档中创建新元素)."
    },
    "document": {
      "!type": "+Document",
      "!doc": "浏览器中加载的每个网页都有其自己的文档对象.此对象用作网页内容(DOM树,包括诸如<body>和<table>之类的元素)的入口点,并提供文档的全局功能(例如获取页面的URL和在文档中创建新元素)."
    },
    "Event": {
      "!type": "fn()",
      "prototype": {
        "stopPropagation": {
          "!type": "fn()",
          "!doc": "防止当前事件进一步传播."
        },
        "preventDefault": {
          "!type": "fn()",
          "!doc": "如果可以取消事件,则取消该事件,而不停止事件的进一步传播."
        },
        "stopImmediatePropagation": {
          "!type": "fn()",
          "!doc": "防止同一事件的其他侦听器被调用."
        },
        "type": {
          "!type": "string",
          "!doc": "返回包含事件类型的字符串."
        },
        "target": {
          "!type": "+Element",
          "!doc": " EventTarget是由对象实现的DOM接口,这些对象可以接收DOM事件并具有侦听器.最常见的EventTarget是DOM元素,尽管其他对象也可以是EventTarget,例如文档,窗口,XMLHttpRequest,和别的."
        },
        "clientX": {
          "!type": "number",
          "!doc": "返回事件发生的应用程序客户区域内的水平坐标(与页面内的坐标相反).例如,单击客户区域左上角将始终显示clientX值为0的鼠标事件,无论页面是否水平滚动."
        },
        "clientY": {
          "!type": "number",
          "!doc": "返回事件发生在应用程序客户区中的垂直坐标(与页面中的坐标相反).例如,单击客户区左上角将始终显示不管页面是否垂直滚动,clientY值为0的鼠标事件."
        },
        "keyCode": {
          "!type": "number",
          "!doc": "返回按键事件中的非字符键或任何其他类型的键盘事件中的任何键的Unicode值.",
        },
        "charCode": {
          "!type": "number",
          "!doc": "返回在按键事件期间按下的字符键的Unicode值."
        },
        "which": {
          "!type": "number",
          "!doc": "返回所按下键的数字keyCode或所按下字母数字键的字符代码(charCode)."
        },
        "button": {
          "!type": "number",
          "!doc": "指示导致事件的鼠标按钮."
        },
        "shiftKey": {
          "!type": "bool",
          "!doc": "指示事件触发时是否按下SHIFT键.",
        },
        "ctrlKey": {
          "!type": "bool",
          "!doc": "指示事件触发时是否按下了CTRL键.",
        },
        "altKey": {
          "!type": "bool",
          "!doc": "指示事件触发时是否按下ALT键.",
        }
      }
    },
    "Storage": {
      "length": {
        "!type": "number",
        "!doc": "存储接口的length只读属性返回一个整数,该整数表示存储在存储对象中的数据项的数量.",
      },
      "setItem": {
        "!type": "fn(name: string, value: string)",
        "!doc": "存储接口的setItem()方法在传递键名称和值时,会将该键添加到存储中,或者更新该键的值(如果已存在).",
      },
      "getItem": {
        "!type": "fn(name: string) -> string",
        "!doc": "存储接口的getItem()方法在传递键名时将返回该键的值.",
      },
      "key": {
        "!type": "fn(index: number) -> string",
        "!doc": "存储接口的key()方法传递数字n时,返回存储中第n个键的名称.键的顺序是用户代理定义的,因此您不应依赖它."
      },
      "removeItem": {
        "!type": "fn(key: string)",
        "!doc": "存储接口的removeItem()方法在传递了键名后,将从存储中删除该键.",
      },
      "clear": {
        "!type": "fn()",
        "!doc": "存储接口的clear()方法在被调用时将从存储中清空所有键."
      }
    },
    "localStorage": {
      "!type": "Storage",
      "!doc": " localStorage属性允许您访问本地存储对象.localStorage与sessionStorage类似.唯一的区别是,虽然存储在localStorage中的数据没有到期时间,但是浏览会话时存储在sessionStorage中的数据将被清除.结束-也就是说,当浏览器关闭时.\ n \ n请注意,存储在localStorage或sessionStorage中的数据特定于页面协议."
    },
    "console": {
      "assert": {
        "!type": "fn(assertion: bool, text: string)",
        "!doc": "如果断言为false,则将错误消息写入控制台.",
      },
      "error": {
        "!type": "fn(...msg: ?)",
        "!doc": "将错误消息输出到Web控制台.",
      },
      "info": {
        "!type": "fn(...msg: ?)",
        "!doc": "将参考消息输出到Web控制台.",
      },
      "log": {
        "!type": "fn(...msg: ?)",
        "!doc": "将消息输出到Web控制台.",
      },
      "time": {
        "!type": "fn(label: string)",
        "!doc": "启动计时器,您可以使用该计时器来跟踪操作需要多长时间.",
      },
      "timeEnd": {
        "!type": "fn(label: string)",
        "!doc": "停止以前通过调用console.time()启动的计时器.",
      },
      "trace": {
        "!type": "fn()",
        "!doc": "将堆栈跟踪输出到Web控制台.",
      },
      "warn": {
        "!type": "fn(...msg: ?)",
        "!doc": "将警告消息输出到Web控制台.",
      },
      "!doc": "控制台对象提供对浏览器调试控制台的访问.其工作方式的细节因浏览器而异,但实际上提供了一组事实上的功能.",
    },
    "window": {
      "!type": "<top>",
      "!doc": "窗口对象代表一个包含DOM文档的窗口.",
    },
    "self": {
      "!type": "<top>",
      "!doc": "将对象引用返回到窗口对象.",
    },
    "devicePixelRatio": "number",
    "requestAnimationFrame": {
      "!type": "fn(callback: fn(timestamp: number)) -> number",
      "!doc": " Window.requestAnimationFrame()方法告诉浏览器您希望执行动画,并请求浏览器在下一次重绘之前调用指定的函数来更新动画.该方法将回调作为参数在重新粉刷之前被调用."
    },
    "cancelAnimationFrame": {
      "!type": "fn(number)n",
      "!doc": "取消先前安排的动画帧请求.",
    },
    "alert": {
      "!type": "fn(message: string)",
      "!doc": "显示具有指定内容和确定按钮的警报对话框."
    },
    "confirm": {
      "!type": "fn(message: string) -> bool",
      "!doc": "显示带有消息和两个按钮(确定和取消)的模式对话框.",
    },
    "prompt": {
      "!type": "fn(message: string, value: string) -> string",
      "!doc": "显示一个对话框,提示用户输入一些文本.",
    },
    "setTimeout": {
      "!type": "fn(f: fn(), ms: number) -> number",
      "!doc": "在指定的延迟后调用函数或执行代码段."
    },
    "clearTimeout": {
      "!type": "fn(timeout: number)",
      "!doc": "清除window.setTimeout()设置的延迟.",
    },
    "setInterval": {
      "!type": "fn(f: fn(), ms: number) -> number",
      "!doc": "反复调用一个函数或执行代码段,每次调用该函数之间有固定的时间延迟.",
    },
    "clearInterval": {
      "!type": "fn(interval: number)",
      "!doc": "取消使用setInterval设置的重复操作.",
    },
    "atob": {
      "!type": "fn(encoded: string) -> string",
      "!doc": "解码使用base-64编码编码的数据字符串."
    },
    "btoa": {
      "!type": "fn(data: string) -> string",
      "!doc": "从一串二进制数据创建一个base-64编码的ASCII字符串.",
    },
    "getComputedStyle": {
      "!type": "fn(node: +Element, pseudo?: string) -> Element.prototype.style",
      "!doc": "给出元素的所有CSS属性的最终使用值.",
    },
    "CanvasRenderingContext2D": {
      "canvas": "+Element",
      "width": "number",
      "height": "number",
      "commit": "fn()",
      "save": "fn()",
      "restore": "fn()",
      "currentTransform": "?",
      "scale": "fn(x: number, y: number)",
      "rotate": "fn(angle: number)",
      "translate": "fn(x: number, y: number)",
      "transform": "fn(a: number, b: number, c: number, d: number, e: number, f: number)",
      "setTransform": "fn(a: number, b: number, c: number, d: number, e: number, f: number)",
      "resetTransform": "fn()",
      "globalAlpha": "number",
      "globalCompositeOperation": "string",
      "imageSmoothingEnabled": "bool",
      "strokeStyle": "string",
      "fillStyle": "string",
      "createLinearGradient": "fn(x0: number, y0: number, x1: number, y1: number) -> ?",
      "createPattern": "fn(image: ?, repetition: string) -> ?",
      "shadowOffsetX": "number",
      "shadowOffsetY": "number",
      "shadowBlur": "number",
      "shadowColor": "string",
      "clearRect": "fn(x: number, y: number, w: number, h: number)",
      "fillRect": "fn(x: number, y: number, w: number, h: number)",
      "strokeRect": "fn(x: number, y: number, w: number, h: number)",
      "fillRule": "string",
      "fill": "fn()",
      "beginPath": "fn()",
      "stroke": "fn()",
      "clip": "fn()",
      "resetClip": "fn()",
      "fillText": "fn(text: string, x: number, y: number, maxWidth: number)",
      "strokeText": "fn(text: string, x: number, y: number, maxWidth: number)",
      "measureText": "fn(text: string) -> ?",
      "drawImage": "fn(image: ?, dx: number, dy: number)",
      "createImageData": "fn(sw: number, sh: number) -> ?",
      "getImageData": "fn(sx: number, sy: number, sw: number, sh: number) -> ?",
      "putImageData": "fn(imagedata: ?, dx: number, dy: number)",
      "lineWidth": "number",
      "lineCap": "string",
      "lineJoin": "string",
      "miterLimit": "number",
      "setLineDash": "fn(segments: [number])",
      "getLineDash": "fn() -> [number]",
      "lineDashOffset": "number",
      "font": "string",
      "textAlign": "string",
      "textBaseline": "string",
      "direction": "string",
      "closePath": "fn()",
      "moveTo": "fn(x: number, y: number)",
      "lineTo": "fn(x: number, y: number)",
      "quadraticCurveTo": "fn(cpx: number, cpy: number, x: number, y: number)",
      "bezierCurveTo": "fn(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number)",
      "arcTo": "fn(x1: number, y1: number, x2: number, y2: number, radius: number)",
      "rect": "fn(x: number, y: number, w: number, h: number)",
      "arc": "fn(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: bool)",
      "ellipse": "fn(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: bool)"
    },
    "Image": {
      "!type": "fn(width?: number, height?: number) -> +HTMLImageElement",
      "!doc": "图像元素构造函数.接受两个可选参数: Image([unsigned long width,unsigned long height]).返回HTMLImageElement实例,就像document.createElement('img')一样.",
    }
  },
  {
    "!name": "ecmascript",
    "Infinity": {
      "!type": "number",
      "!doc": "代表无穷大的数值."
    },
    "undefined": {
      "!type": "?",
      "!doc": "该值未定义.",
    },
    "NaN": {
      "!type": "number",
      "!doc": "代表非数字的值."
    },
    "Object": {
      "!type": "fn()",
      "create": {
        "!type": "fn(proto: ?) -> !custom:Object_create",
        "!doc": "使用指定的原型对象和属性创建一个新对象.",
      },
      "defineProperty": {
        "!type": "fn(obj: ?, prop: string, desc: propertyDescriptor) -> !custom:Object_defineProperty",
        "!doc": "直接在对象上定义新属性,或修改对象上的现有属性,然后返回对象.如果想了解如何将Object.defineProperty方法与类似二进制标志的语法一起使用,请参阅本文."
      },
      "keys": {
        "!type": "fn(obj: ?) -> [string]",
        "!doc": "返回一个给定对象自己的可枚举属性的数组,其顺序与for-in循环所提供的顺序相同(不同之处在于for-in循环也枚举了原型链中的属性). "
      },
      "assign": {
        "!type": "fn(target: ?, source: ?, source?: ?) -> !0",
        "!effects": ["copy !1 !0", "copy !2 !0", "copy !3 !0"],
        "!doc": " Object.assign()方法用于将所有可枚举的自身属性的值从一个或多个源对象复制到目标对象.它将返回目标对象.,",
      },
      "prototype": {
        "!stdProto": "Object",
        "toString": {
          "!type": "fn() -> string",
          "!doc": "返回表示对象的字符串."
        },
        "hasOwnProperty": {
          "!type": "fn(prop: string) -> bool",
          "!doc": "返回一个布尔值,指示对象是否具有指定的属性.",
        }
      },
      "!doc": "创建对象包装器.",
    },
    "Function": {
      "!type": "fn(body: string) -> fn()",
      "prototype": {
        "!stdProto": "Function",
        "apply": {
          "!type": "fn(this: ?, args: [?])",
          "!effects": [
            "call and return !this this=!0 !1.<i> !1.<i> !1.<i>"
          ],
          "!doc": "调用具有给定值的函数,并以数组(或类似对象的数组)形式提供参数.",
        },
        "call": {
          "!type": "fn(this: ?, args?: ?) -> !this.!ret",
          "!effects": [
            "call and return !this this=!0 !1 !2 !3 !4"
          ],
          "!doc": "调用具有给定值和单独提供的参数的函数.",
        },
        "bind": {
          "!type": "fn(this: ?, args?: ?) -> !custom:Function_bind",
          "!doc": "创建一个新函数,该函数在被调用时将其this关键字设置为提供的值,并在调用新函数时提供给定的参数序列.",
        },
        "prototype": "?"
      },
      "!doc": " JavaScript中的每个函数实际上都是一个Function对象."
    },
    "Array": {
      "!type": "fn(size: number) -> !custom:Array_ctor",
      "isArray": {
        "!type": "fn(value: ?) -> bool",
        "!doc": "如果对象是数组,则返回true,否则返回false.",
      },
      "from": {
        "!type": "fn(arrayLike: ?, mapFn?: fn(elt: ?, i: number) -> ?, thisArg?: ?) -> [!0.<i>]",
        "!effects": [
          "call !1 this=!2 !0.<i> number"
        ],
        "!doc": " Array.from()方法从类似数组或可迭代的对象创建一个新的Array实例.,",
      },
      "of": {
        "!type": "fn(elementN: ?) -> [!0]",
        "!doc": " Array.of()方法创建一个新的Array实例,该实例具有可变数量的参数,而不考虑参数的数量或类型.,",
      },
      "prototype": {
        "!stdProto": "Array",
        "length": {
          "!type": "number",
          "!doc": "一个无符号的32位整数,指定数组中的元素数.",
        },
        "concat": {
          "!type": "fn(other: [?]) -> !this",
          "!doc": "返回一个新数组,该数组由该数组与其他数组和/或值组成.",
        },
        "join": {
          "!type": "fn(separator?: string) -> string",
          "!doc": "将数组的所有元素连接到字符串中."
        },
        "splice": {
          "!type": "fn(pos: number, amount: number, newelt?: ?) -> [?]",
          "!doc": "更改数组的内容,在删除旧元素的同时添加新元素.",
        },
        "pop": {
          "!type": "fn() -> !this.<i>",
          "!doc": "从数组中删除最后一个元素并返回该元素.",
        },
        "push": {
          "!type": "fn(newelt: ?) -> number",
          "!effects": [
            "propagate !0 !this.<i>"
          ],
          "!doc": "通过添加给定元素并返回数组的新长度来更改数组.",
        },
        "shift": {
          "!type": "fn() -> !this.<i>",
          "!doc": "从数组中删除第一个元素并返回该元素.此方法更改数组的长度.",
        },
        "unshift": {
          "!type": "fn(newelt: ?) -> number",
          "!effects": [
            "propagate !0 !this.<i>"
          ],
          "!doc": "将一个或多个元素添加到数组的开头,并返回数组的新长度.",
        },
        "slice": {
          "!type": "fn(from?: number, to?: number) -> !this",
          "!doc": "返回数组一部分的浅表副本."
        },
        "reverse": {
          "!type": "fn()",
          "!doc": "就地反转数组.第一个数组元素变为最后一个,而最后一个数组变为第一个.",
        },
        "sort": {
          "!type": "fn(compare?: fn(a: ?, b: ?) -> number)",
          "!effects": [
            "call !0 !this.<i> !this.<i>"
          ],
          "!doc": "将数组中的元素排序并返回数组."
        },
        "indexOf": {
          "!type": "fn(elt: ?, from?: number) -> number",
          "!doc": "返回在数组中可以找到给定元素的第一个索引；如果不存在,则返回-1.",
        },
        "lastIndexOf": {
          "!type": "fn(elt: ?, from?: number) -> number",
          "!doc": "返回在数组中找到给定元素的最后一个索引,如果不存在则返回-1.从fromIndex开始向后搜索数组.",
        },
        "filter": {
          "!type": "fn(test: fn(elt: ?, i: number, array: +Array) -> bool, context?: ?) -> !this",
          "!effects": [
            "call !0 this=!1 !this.<i> number !this"
          ],
          "!doc": "创建一个新数组,其中包含所有通过提供的功能实现的测试的元素.",
        },
        "forEach": {
          "!type": "fn(f: fn(elt: ?, i: number, array: +Array), context?: ?)",
          "!effects": [
            "call !0 this=!1 !this.<i> number !this"
          ],
          "!doc": "每个数组元素执行一次提供的功能."
        },
        "map": {
          "!type": "fn(f: fn(elt: ?, i: number, array: +Array) -> ?, context?: ?) -> [!0.!ret]",
          "!effects": [
            "call !0 this=!1 !this.<i> number !this"
          ],
          "!doc": "创建一个新数组,其结果是对该数组中的每个元素调用提供的函数.",
        },
        "reduce": {
          "!type": "fn(combine: fn(sum: ?, elt: ?, i: number, array: +Array) -> ?, init?: ?) -> !0.!ret",
          "!effects": [
            "call !0 !1 !this.<i> number !this"
          ],
          "!doc": "对一个累加器和数组的每个值(从左到右)应用一个函数,以将其减小为单个值.",
        },
        "fill": {
          "!type": "fn(value: ?, start?: number, end?: number) -> !this",
          "!doc": " fill()方法使用静态值填充数组的所有元素,从开始索引到结束索引.,",
        },
        "find": {
          "!type": "fn(callback: fn(element: ?, index: number, array: [?]) -> bool, thisArg?: ?) -> !this.<i>",
          "!effects": ["call !0 this=!2 !this.<i> number"],
          "!doc": "如果数组中的元素满足提供的测试功能,则find()方法将在数组中返回一个值.否则,返回undefined.,",
        },
        "findIndex": {
          "!type": "fn(callback: fn(element: ?, index: number, array: [?]), thisArg?: ?) -> number",
          "!effects": ["call !0 this=!2 !this.<i> number"],
          "!doc": "如果数组中的元素满足提供的测试功能,则findIndex()方法将返回数组中的索引.否则返回-1.,",
        },
        "keys": {
          "!type": "fn() -> +iter[:t=number]",
          "!doc": " keys()方法返回一个新的数组迭代器,其中包含数组中每个索引的键.,",
        },
        "values": {
          "!type": "fn() -> +iter[:t=!this.<i>]",
          "!doc": " values()方法返回一个新的Array Iterator对象,该对象包含数组中每个索引的值.,",
        },
        "includes": {
          "!type": "fn(value: ?, fromIndex?: number) -> bool",
          "!doc": "确定数组是否包含某个元素,并根据需要返回true或false.,",
        }
      },
      "!doc": " JavaScript Array全局对象是数组的构造函数,这些数组是高级的,类似于列表的对象.",
    },
    "String": {
      "!type": "fn(value: ?) -> string",
      "prototype": {
        "!stdProto": "String",
        "length": {
          "!type": "number",
          "!doc": "表示字符串的长度."
        },
        "<i>": "string",
        "charAt": {
          "!type": "fn(i: number) -> string",
          "!doc": "从字符串中返回指定的字符.",
        },
        "charCodeAt": {
          "!type": "fn(i: number) -> number",
          "!doc": "返回给定索引处字符的数字Unicode值(Unicode代码点> 0x10000除外).",
        },
        "indexOf": {
          "!type": "fn(char: string, from?: number) -> number",
          "!doc": "返回指定值首次出现的调用String对象中的索引,从fromIndex开始搜索,\ n如果未找到该值,则返回-1.",
        },
        "lastIndexOf": {
          "!type": "fn(char: string, from?: number) -> number",
          "!doc": "返回指定值最后一次出现的调用String对象内的索引,如果未找到则返回-1.从fromIndex开始向后搜索调用字符串.",
        },
        "substring": {
          "!type": "fn(from: number, to?: number) -> string",
          "!doc": "返回一个索引与另一个索引之间或字符串末尾的字符串子集.",
        },
        "substr": {
          "!type": "fn(from: number, length?: number) -> string",
          "!doc": "以指定的字符数返回从指定位置开始的字符串中的字符.",
        },
        "slice": {
          "!type": "fn(from: number, to?: number) -> string",
          "!doc": "提取字符串的一部分并返回新的字符串.",
        },
        "padStart": {
          "!type": "fn(targetLength: number, padString?: string) -> string",
          "!doc": "用另一个字符串(如果需要,重复)填充当前字符串,以使结果字符串达到给定的长度.",
        },
        "padEnd": {
          "!type": "fn(targetLength: number, padString?: string) -> string",
          "!doc": "用给定的字符串(如果需要,重复)填充当前字符串,以使结果字符串达到给定的长度.",
        },
        "trim": {
          "!type": "fn() -> string",
          "!doc": "从字符串的两端删除空格.",
        },
        "trimStart": {
          "!type": "fn() -> string",
          "!doc": "从字符串的开头删除空格.",
        },
        "trimEnd": {
          "!type": "fn() -> string",
          "!doc": "从字符串末尾删除空格.",
        },
        "toUpperCase": {
          "!type": "fn() -> string",
          "!doc": "返回转换为大写的调用字符串值."
        },
        "toLowerCase": {
          "!type": "fn() -> string",
          "!doc": "返回转换为小写的调用字符串值."
        },
        "split": {
          "!type": "fn(pattern?: string|+RegExp, limit?: number) -> [string]",
          "!doc": "通过将字符串分成子字符串,将String对象拆分为字符串数组.",
        },
        "concat": {
          "!type": "fn(other: string) -> string",
          "!doc": "将两个或多个字符串的文本合并,并返回一个新字符串."
        },
        "match": {
          "!type": "fn(pattern: +RegExp) -> [string]",
          "!doc": "用于将字符串与正则表达式匹配时用于检索匹配.",
        },
        "replace": {
          "!type": "fn(pattern: string|+RegExp, replacement: string) -> string",
          "!doc": "返回一个新字符串,该字符串的某个或所有匹配项都由替换项替换.该模式可以是字符串或RegExp,并且替换项可以是字符串或每个匹配项将调用的函数. "
        },
        "endsWith": {
          "!type": "fn(searchString: string, position?: number) -> bool",
          "!doc": " endsWith()方法确定一个字符串是否以另一个字符串的字符结尾,并根据需要返回true或false.,",
        },
        "startsWith": {
          "!type": "fn(searchString: string, position?: number) -> bool",
          "!doc": " startsWith()方法确定一个字符串是否以另一个字符串的字符开头,并根据需要返回true或false.,",
        }
      },
      "!doc": " String全局对象是字符串或字符序列的构造函数.",
    },
    "Number": {
      "!type": "fn(value: ?) -> number",
      "MAX_VALUE": {
        "!type": "number",
        "!doc": " JavaScript中可表示的最大数值."
      },
      "MIN_VALUE": {
        "!type": "number",
        "!doc": " JavaScript中可表示的最小正数值."
      },
      "POSITIVE_INFINITY": {
        "!type": "number",
        "!doc": "代表正无穷大值的值."
      },
      "NEGATIVE_INFINITY": {
        "!type": "number",
        "!doc": "代表负无穷大值的值."
      },
      "prototype": {
        "!stdProto": "Number",
        "toString": {
          "!type": "fn(radix?: number) -> string",
          "!doc": "返回代表指定Number对象的字符串"
        },
        "toFixed": {
          "!type": "fn(digits: number) -> string",
          "!doc": "使用定点符号格式化数字"
        },
        "toExponential": {
          "!type": "fn(digits: number) -> string",
          "!doc": "返回以指数表示形式表示Number对象的字符串"
        },
        "toPrecision": {
          "!type": "fn(digits: number) -> string",
          "!doc": " toPrecision()方法返回一个字符串,该数字表示指定精度的数字.",
        }
      },
      "EPSILON": {
        "!type": "number",
        "!doc": " Number.EPSILON属性表示一个数值与可以表示为Number的最小值之间的差异.,",
      },
      "MAX_SAFE_INTEGER": {
        "!type": "number",
        "!doc": " Number.MAX_SAFE_INTEGER常量表示JavaScript中的最大安全整数(2 ^ 53-1).,",
      },
      "MIN_SAFE_INTEGER": {
        "!type": "number",
        "!doc": " Number.MIN_SAFE_INTEGER常量表示JavaScript(-(2 ^ 53-1))中的最小安全整数.,",
      },
      "isFinite": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": " Number.isFinite()方法确定传递的值是否为有限值.,",
      },
      "isInteger": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": " Number.isInteger()方法确定传递的值是否为整数.,",
      },
      "isNaN": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": " Number.isNaN()方法确定传递的值是否为NaN.原始全局isNaN()的更可靠的版本.,",
      },
      "isSafeInteger": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": " Number.isSafeInteger()方法确定所提供的值是否是一个安全整数的数字.安全整数是该数字的整数." ,
      },
      "parseFloat": {
        "!type": "fn(string: string) -> number",
        "!doc": " Number.parseFloat()方法解析字符串参数并返回浮点数.,",
      },
      "parseInt": {
        "!type": "fn(string: string, radix?: number) -> number",
        "!doc": " Number.parseInt()方法解析字符串参数并返回指定基数或基数的整数.,",
      },
      "!doc": " Number JavaScript对象是一个包装器对象,允许您使用数值.使用Number()构造函数创建Number对象.",
    },
    "Boolean": {
      "!type": "fn(value: ?) -> bool",
      "prototype": {
        "!stdProto": "Boolean"
      },
      "!doc": "布尔对象是布尔值的对象包装.",
    },
    "RegExp": {
      "!type": "fn(source: string, flags?: string)",
      "prototype": {
        "!stdProto": "RegExp",
        "exec": {
          "!type": "fn(input: string) -> [string]",
          "!doc": "搜索指定字符串中的匹配项.返回结果数组,或者为null.",
        },
        "test": {
          "!type": "fn(input: string) -> bool",
          "!doc": "执行正则表达式和指定字符串之间的匹配搜索.返回true或false.",
        }
      },
      "!doc": "创建正则表达式对象以将文本与模式匹配.",
    },
    "parseInt": {
      "!type": "fn(string: string, radix?: number) -> number",
      "!doc": "解析字符串参数并返回指定基数或基数的整数."
    },
    "parseFloat": {
      "!type": "fn(string: string) -> number",
      "!doc": "解析字符串参数并返回浮点数."
    },
    "isNaN": {
      "!type": "fn(value: number) -> bool",
      "!doc": "确定值是否为NaN.请注意,此函数已损坏.您可能对ECMAScript 6 Number.isNaN感兴趣.",
    },
    "isFinite": {
      "!type": "fn(value: number) -> bool",
      "!doc": "确定传递的值是否为有限数字."
    },
    "eval": {
      "!type": "fn(code: string) -> ?",
      "!doc": "评估以字符串形式表示的JavaScript代码."
    },
    "encodeURI": {
      "!type": "fn(uri: string) -> string",
      "!doc": "通过用表示字符的UTF-8编码的一个,两个,三个或四个转义序列替换某些字符的每个实例来编码统一资源标识符(URI)(对于字符而言将仅是四个转义序列由两个\"代理\"字符组成).",
    },
    "encodeURIComponent": {
      "!type": "fn(uri: string) -> string",
      "!doc": "通过用表示字符的UTF-8编码的一个,两个,三个或四个转义序列替换某些字符的每个实例来编码统一资源标识符(URI)组件(对于由两个\"代理\"字符组成的字符).",
    },
    "decodeURI": {
      "!type": "fn(uri: string) -> string",
      "!doc": "解码以前由encodeURI或类似例程创建的统一资源标识符(URI).",
    },
    "decodeURIComponent": {
      "!type": "fn(uri: string) -> string",
      "!doc": "解码以前由encodeURIComponent或类似例程创建的统一资源标识符(URI)组件.",
    },
    "Math": {
      "E": {
        "!type": "number",
        "!doc": "自然对数的底数,e约为2.718."
      },
      "LN2": {
        "!type": "number",
        "!doc": " 2的自然对数,大约为0.693."
      },
      "LN10": {
        "!type": "number",
        "!doc": " 10的自然对数,大约为2.302."
      },
      "LOG2E": {
        "!type": "number",
        "!doc": " E的以2为底的对数(大约1.442).",
      },
      "LOG10E": {
        "!type": "number",
        "!doc": " E的以10为底的对数(约0.434)."
      },
      "SQRT1_2": {
        "!type": "number",
        "!doc": " 1/2的平方根；等效于2的平方根上的1,大约为0.707."
      },
      "SQRT2": {
        "!type": "number",
        "!doc": " 2的平方根,大约为1.414."
      },
      "PI": {
        "!type": "number",
        "!doc": "圆的周长与其直径之比,大约为3.14159."
      },
      "abs": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的绝对值."
      },
      "cos": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的余弦."
      },
      "sin": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的正弦."
      },
      "tan": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的正切值."
      },
      "acos": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的反余弦(以弧度为单位)."
      },
      "asin": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的反正弦(以弧度为单位)."
      },
      "atan": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的反正切(以弧度为单位)."
      },
      "atan2": {
        "!type": "fn(y: number, x: number) -> number",
        "!doc": "返回其参数商的反正切值."
      },
      "ceil": {
        "!type": "fn(number) -> number",
        "!doc": "返回大于或等于数字的最小整数."
      },
      "floor": {
        "!type": "fn(number) -> number",
        "!doc": "返回小于或等于数字的最大整数."
      },
      "round": {
        "!type": "fn(number) -> number",
        "!doc": "返回四舍五入到最接近整数的数字的值."
      },
      "exp": {
        "!type": "fn(number) -> number",
        "!doc": "返回E ^ x,其中x是自变量,E是欧拉常数,自然对数的底."
      },
      "log": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的自然对数(以E为底).",
      },
      "sqrt": {
        "!type": "fn(number) -> number",
        "!doc": "返回数字的平方根."
      },
      "pow": {
        "!type": "fn(number, number) -> number",
        "!doc": "将基数返回指数幂,即baseexponent."
      },
      "max": {
        "!type": "fn(number, number) -> number",
        "!doc": "返回零个或多个数字中的最大值."
      },
      "min": {
        "!type": "fn(number, number) -> number",
        "!doc": "返回零个或多个数字中的最小值."
      },
      "random": {
        "!type": "fn() -> number",
        "!doc": "返回一个浮点伪随机数,范围为[0,1),即从0(包括)到不包括1(排除),然后您可以缩放到所需的值范围."
      },
      "log10": {
        "!type": "fn(x: number) -> number",
        "!doc": " Math.log10()函数返回数字的以10为底的对数." ,
      },
      "log2": {
        "!type": "fn(x: number) -> number",
        "!doc": " Math.log2()函数返回数字的以2为底的对数." ,
      },
      "sign": {
        "!type": "fn(x: number) -> number",
        "!doc": " Math.sign()函数返回数字的符号,指示数字是正数,负数还是零.,",
      },
      "trunc": {
        "!type": "fn(x: number) -> number",
        "!doc": " Math.trunc()函数通过删除任何小数位来返回数字的整数部分.它不舍入任何数字.该函数可以用floor()和ceil()函数表示: ,",
      },
      "!doc": "一个内置对象,具有用于数学常数和函数的属性和方法.",
    },
    "JSON": {
      "parse": {
        "!type": "fn(json: string, reviver?: fn(key: string, value: ?) -> ?) -> ?",
        "!doc": "将字符串解析为JSON,可以选择转换解析产生的值.",
      },
      "stringify": {
        "!type": "fn(value: ?, replacer?: fn(key: string, value: ?) -> ?, space?: string|number) -> string",
        "!doc": "将值转换为JSON,如果指定了replacer函数,则可以选择替换值,如果指定了replacer数组,则可以选择仅包括指定的属性.",
      },
      "!doc": " JSON(JavaScript对象表示法)是一种数据交换格式.尽管它不是严格的子集,但它非常类似于JavaScript语法的子集.(有关详细信息,请参见JavaScript参考中的JSON.)在编写任何类型的基于JavaScript的应用程序(包括网站和浏览器扩展程序)时非常有用.例如,您可以将JSON格式的用户信息存储在cookie中,或者可以将扩展名首选项以JSON形式存储在字符串值的浏览器首选项中."
    }
  },
  {
    "!name": "core",
    "!define": {
      "flag": {
        "!doc": "当前变量",
        "hard": {
          "!type": "number",
          "!doc": "当前难度编号"
        },
        "hatred":{
          "!type": "number",
          "!doc": "当前仇恨值"
        },
        "poison":{
          "!type": "bool",
          "!doc": "是否处于中毒状态"
        },
        "weak":{
          "!type": "number",
          "!doc": "是否处于衰弱状态"
        },
        "curse":{
          "!type": "number",
          "!doc": "是否处于诅咒状态"
        },
        "no_zone": {
          "!type": "bool",
          "!doc": "无视领域伤害"
        },
        "no_repulse": {
          "!type": "bool",
          "!doc": "无视阻击伤害"
        },
        "no_lasel": {
          "!type": "bool",
          "!doc": "无视激光伤害"
        },
        "no_ambush": {
          "!type": "bool",
          "!doc": "无视捕捉"
        },
        "__bgm__": {
          "!type": "string",
          "!doc": "背景音乐"
        },
        "__weather__": {
          "!doc": "天气"
        },
        "__color__": {
          "!doc": "色调"
        },
        "__volume__": {
          "!type": "number",
          "!doc": "音量"
        },
        "skill": {
          "!type": "number",
          "!doc": "当前开启的技能编号"
        },
        "skillName": {
          "!type": "string",
          "!doc": "当前开启的技能名"
        },
        "input": {
          "!type": "string|number",
          "!doc": "等待用户输入后的存放值"
        },
        "type": {
          "!type": "number",
          "!doc": "等待用户操作后获得的操作类型"
        },
        "keycode": {
          "!type": "number",
          "!doc": "等待用户操作后用户按键的键值"
        },
        "x": {
          "!type": "number",
          "!doc": "等待用户操作后用户点击的网格横坐标"
        },
        "y": {
          "!type": "number",
          "!doc": "等待用户操作后用户点击的网格纵坐标"
        },
        "px": {
          "!type": "number",
          "!doc": "等待用户操作后用户点击的像素横坐标"
        },
        "py": {
          "!type": "number",
          "!doc": "等待用户操作后用户点击的像素纵坐标"
        },
        "__visited__": {
          "!doc": "当前访问过的楼层"
        },
        "cannotMoveDirectly": {
          "!type": "bool",
          "!doc": "当前是否全局不可瞬移"
        },
      },
      "hero": {
        "!doc": "勇士当前属性",
        "image": {
          "!type": "string",
          "!doc": "行走图"
        },
        "animate": {
          "!type": "bool",
          "!doc": "是否开启帧动画"
        },
        "name": {
          "!type": "string",
          "!doc": "勇士名"
        },
        "lv": {
          "!type": "number",
          "!doc": "勇士等级"
        },
        "hpmax": {
          "!type": "number",
          "!doc": "勇士生命上限"
        },
        "hp": {
          "!type": "number",
          "!doc": "勇士当前生命值"
        },
        "atk": {
          "!type": "number",
          "!doc": "勇士当前攻击力"
        },
        "def": {
          "!type": "number",
          "!doc": "勇士当前防御力"
        },
        "manamax": {
          "!type": "number",
          "!doc": "勇士当前魔力上限，负数无效"
        },
        "mana": {
          "!type": "number",
          "!doc": "勇士当前魔力值"
        },
        "mdef": {
          "!type": "number",
          "!doc": "勇士当前护盾值"
        },
        "money": {
          "!type": "number",
          "!doc": "勇士当前金币"
        },
        "exp": {
          "!type": "number",
          "!doc": "勇士当前经验"
        },
        "equipment": {
          "!type": "[string]",
          "!doc": "勇士当前装备"
        },
        "items": {
          "!doc": "勇士当前道具",
          "constants": {
            "!doc": "永久道具"
          },
          "tools": {
            "!doc": "消耗道具",
            "yellowKey": {
              "!type": "number",
              "!doc": "黄钥匙个数"
            },
            "blueKey": {
              "!type": "number",
              "!doc": "蓝钥匙个数"
            },
            "redKey": {
              "!type": "number",
              "!doc": "红钥匙个数"
            },
            "greenKey": {
              "!type": "number",
              "!doc": "绿钥匙个数"
            },
            "steelKey": {
              "!type": "number",
              "!doc": "铁门钥匙个数"
            },
          },
          "equips": {
            "!doc": "未装备上的装备"
          },
        },
        "loc": {
          "!doc": "勇士当前坐标和朝向",
          "x": {
            "!type": "number",
            "!doc": "当前x坐标"
          },
          "y": {
            "!type": "number",
            "!doc": "当前y坐标"
          },
          "direction": {
            "!type": "number",
            "!doc": "当前朝向"
          },
        },
        "flags": {
          "!type": "flag",
          "!doc": "当前游戏中用到的变量"
        },
        "followers": {
          "!type": "[?]",
          "!doc": "跟随者信息"
        },
        "steps": {
          "!type": "number",
          "!doc": "当前步数"
        }
      },
      "block": {
        "!doc": "地图图块信息",
        "x": {
          "!type": "number",
          "!doc": "图块的x坐标"
        },
        "y": {
          "!type": "number",
          "!doc": "图块的y坐标"
        },
        "id": {
          "!type": "number",
          "!doc": "图块的数字"
        },
        "event": {
          "!doc": "图块上的事件信息",
          "id": {
            "!type": "string",
            "!doc": "图块的ID"
          },
          "cls": {
            "!type": "string",
            "!doc": "图块的类别，一般为所在图片名去掉后缀"
          },
          "disabled": {
            "!type": "bool",
            "!doc": "启用状态"
          }
        }
      },
      "enemy": {
        "!doc": "怪物信息",
        "id": {
          "!type": "string",
          "!doc": "怪物ID"
        },
        "name": {
          "!type": "string",
          "!doc": "怪物名称"
        },
        "displayIdInBook": {
          "!type": "string",
          "!doc": "在怪物手册映射ID"
        },
        "hp": {
          "!type": "number",
          "!doc": "怪物生命值"
        },
        "atk": {
          "!type": "number",
          "!doc": "怪物攻击"
        },
        "def": {
          "!type": "number",
          "!doc": "怪物防御"
        },
        "money": {
          "!type": "number",
          "!doc": "怪物金币"
        },
        "exp": {
          "!type": "number",
          "!doc": "怪物经验"
        },
        "special": {
          "!type": "[number]",
          "!doc": "怪物特殊属性"
        },
        "point": {
          "!type": "number",
          "!doc": "怪物加点"
        },
        "value": {
          "!type": "number",
          "!doc": "怪物特殊属性值：阻激夹域伤害值；吸血比例；光环增加生命比例"
        },
        "zoneSquare": {
          "!type": "bool",
          "!doc": "领域怪是否九宫格伤害；区域光环是否九宫格范围"
        },
        "range": {
          "!type": "number",
          "!doc": "领域伤害的范围；区域光环范围"
        },
        "notBomb": {
          "!type": "bool",
          "!doc": "怪物不可炸"
        },
        "n": {
          "!type": "number",
          "!doc": "多连击的连击数；净化比例"
        },
        "add": {
          "!type": "bool",
          "!doc": "吸血是否加到自身；光环是否叠加"
        },
        "atkValue": {
          "!type": "number",
          "!doc": "反击比例；退化扣除攻击；光环增加攻击；"
        },
        "defValue": {
          "!type": "number",
          "!doc": "破甲比例；退化扣除防御；光环增加防御"
        },
        "damage": {
          "!type": "number",
          "!doc": "固伤值"
        },
      },
      "item":{
        "!doc": "道具信息",
        "id": {
          "!type": "string",
          "!doc": "道具ID"
        },
        "cls": {
          "!type": "string",
          "!doc": "道具类型"
        },
        "name": {
          "!type": "string",
          "!doc": "道具名称"
        },
        "text": {
          "!type": "string",
          "!doc": "道具描述"
        },
        "hideInToolbox": {
          "!type": "bool",
          "!doc": "不显示在道具栏"
        },
        "equip": {
          "!doc": "装备属性",
          "type": {
            "!type": "number|string",
            "!doc": "装备类型"
          },
          "animate": {
            "!type": "string",
            "!doc": "装备动画"
          },
          "value": {
            "!doc": "数值加成"
          },
          "percentage": {
            "!doc": "比例加成"
          }
        },
        "hideInReplay": {
          "!type": "bool",
          "!doc": "回放不绘制道具栏"
        },
      },
      "floor": {
        "!doc": "楼层信息",
        "floorId": {
          "!type": "string",
          "!doc": "楼层ID"
        },
        "title": {
          "!type": "string",
          "!doc": "楼层中文名"
        },
        "name": {
          "!type": "string",
          "!doc": "状态栏显示值"
        },
        "width": {
          "!type": "number",
          "!doc": "地图宽"
        },
        "height": {
          "!type": "number",
          "!doc": "地图高"
        },
        "canFlyTo": {
          "!type": "bool",
          "!doc": "该楼是否可以楼传，包括飞来和飞走"
        },
        "canUseQuickShop": {
          "!type": "bool",
          "!doc": "该楼是否可快捷商店"
        },
        "cannotViewMap": {
          "!type": "bool",
          "!doc": "该层是否不允许被浏览地图看到，也不统计"
        },
        "cannotMoveDirectly": {
          "!type": "bool",
          "!doc": "该层是否不允许瞬间移动"
        },
        "upFloor": {
          "!type": "[number]",
          "!doc": "上楼点"
        },
        "downFloor": {
          "!type": "[number]",
          "!doc": "下楼点"
        },
        "flyPoint": {
          "!type": "[number]",
          "!doc": "楼传落点"
        },
        "color": {
          "!doc": "楼层色调"
        },
        "weather": {
          "!doc": "楼层天气"
        },
        "bgm": {
          "!type": "string",
          "!doc": "楼层背景音乐"
        },
        "ratio": {
          "!type": "number",
          "!doc": "宝石/血瓶效果"
        },
        "map": {
          "!type": "[[number]]",
          "!doc": "地图数据"
        },
        "blocks": {
          "!type": "[block]",
          "!doc": "本层图块信息"
        }
      },
      "animate": {
        "!doc": "动画信息",
        "se": {
          "!type": "string",
          "!doc": "动画音效"
        }
      }
    },
    "core": {
      "!doc": "核心游戏控制",
      "__SIZE__": {
        "!type": "number",
        "!doc": "窗口宽度，为13或15"
      },
      "__PIXELS__": {
        "!type": "number",
        "!doc": "窗口像素宽度，为416或480"
      },
      "__HALF_SIZE__": {
        "!type": "number",
        "!doc": "窗口宽度的一半，为6或7"
      },
      "material": {
        "!doc": "游戏所用到的资源",
        "animates": {
          "!doc": "注册的动画"
        },
        "images": {
          "!doc": "注册的图片"
        },
        "bgms": {
          "!doc": "注册的背景音乐"
        },
        "sounds": {
          "!doc": "注册的音效"
        },
        "enemys": {
          "!doc": "怪物定义",
        },
        "items": {
          "!doc": "道具定义"
        }
      },
      "timeout": {
        "!doc": "当前异步事件句柄"
      },
      "interval": {
        "!doc": "当前异步事件延时"
      },
      "animateFrame": {
        "!doc": "当前各个帧动画"
      },
      "musicStatus": {
        "!doc": "音乐音效状态",
        "bgmStatus": {
          "!type": "bool",
          "!doc": "是否播放BGM"
        },
        "soundStatus": {
          "!type": "bool",
          "!doc": "是否播放SE"
        },
        "playingBgm": {
          "!type": "string",
          "!doc": "正在播放的bgm"
        },
        "lastBgm": {
          "!type": "string",
          "!doc": "上次播放的bgm"
        },
        "playingSounds": {
          "!doc": "正在播放的SE"
        },
        "volume": {
          "!type": "number",
          "!doc": "当前bgm音量"
        }
      },
      "platform": {
        "!doc": "平台信息",
        "isPC": "bool",
        "isAndroid": "bool",
        "isIOS": "bool",
        "useLocalForage": "bool"
      },
      "domStyle": {
        "!doc": "界面样式",
        "scale": {
          "!type": "number",
          "!doc": "当前界面放缩比例",
        },
        "availableScale": {
          "!type": "[number]",
          "!doc": "当前界面支持的放缩比例"
        },
        "isVertical": {
          "!type": "bool",
          "!doc": "当前是否是竖屏"
        },
        "showStatusBar": {
          "!type": "bool",
          "!doc": "当前是否显示状态栏"
        },
        "toolbarBtn": {
          "!type": "bool",
          "!doc": "当前工具栏是否是1-8的按钮"
        },
      },
      "bigmap": {
        "!doc": "大地图信息",
        "canvas": {
          "!type": "[string]",
          "!doc": "大地图的画布"
        },
        "width": {
          "!type": "number",
          "!doc": "大地图高度"
        },
        "height": {
          "!type": "number",
          "!doc": "大地图宽度"
        },
        "offsetX": {
          "!type": "number",
          "!doc": "大地图视角横向偏移量"
        },
        "offsetY": {
          "!type": "number",
          "!doc": "大地图视角纵向偏移量"
        },
        "tempCanvas": {
          "!type": "CanvasRenderingContext2D",
          "!doc": "临时画布"
        }
      },
      "saves": {
        "!doc": "当前存档信息"
      },
      "dymCanvas": {
        "!doc": "各个自定义画布"
      },
      "statusBar": {
        "!doc": "状态栏信息"
      },
      "canvas": {
        "!doc": "系统画布"
      },
      "flags": {
        "!doc": "系统开关"
      },
      "values": {
        "!doc": "全局数值，如毒衰效果"
      },
      "firstData": {
        "!doc": "初始属性，如出生点"
      },
      "status": {
        "!doc": "状态信息",
        "hero": {
          "!type": "hero",
          "!doc": "勇士信息"
        },
        "automaticRoute": {
          "!doc": "自动寻路信息"
        },
        "bgmaps": {
          "!doc": "各地图背景层"
        },
        "fgmaps": {
          "!doc": "各地图前景层"
        },
        "boxAnimateObjs": {
          "!doc": "（手册和剧情文本的）帧动画对象"
        },
        "checkBlock": {
          "!doc": "阻激夹域捕捉信息",
          "damage": {
            "!doc": "每个点的伤害信息"
          },
          "type": {
            "!doc": "每个点的伤害类型"
          },
          "repluse": {
            "!doc": "每个点的阻击信息"
          },
          "ambush": {
            "!doc": "每个点的捕捉信息"
          },
          "needCache": {
            "!type": "bool",
            "!doc": "该楼层是否需要计算缓存"
          },
          "cache": {
            "!doc": "每个点的光环缓存"
          },
        },
        "ctrlDown": {
          "!type": "bool",
          "!doc": "Ctrl键是否被按下"
        },
        "curtainColor": {
          "!doc": "当前画面色调"
        },
        "event": {
          "!doc": "当前事件",
          "data": {
            "!doc": "事件信息，如坐标等"
          },
          "id": {
            "!type": "string",
            "!doc": "事件类型，如选择项/确认框"
          },
          "interval": {
            "!type": "number",
            "!doc": "打字机效果的定时器"
          },
          "selection": {
            "!type": "number",
            "!doc": "选择项和确认框的当前选中项"
          },
          "ui": {
            "!doc": "当前事件的界面信息，如楼传/手册/SL"
          }
        },
        "floorAnimateObjs": {
          "!doc": "楼层贴图的帧动画"
        },
        "floorId": {
          "!type": "string",
          "!doc": "当前楼层ID"
        },
        "gameOver": {
          "!type": "bool",
          "!doc": "游戏是否已结束"
        },
        "globalAnimateObjs": {
          "!doc": "各全局动画"
        },
        "globalAnimateStatus": {
          "!type": "number",
          "!doc": "全局动画的帧状态"
        },
        "globalAttribute": {
          "!doc": "全局css属性"
        },
        "hard": {
          "!type": "string",
          "!doc": "状态栏一角的难度名"
        },
        "downTime": {
          "!type": "number",
          "!doc": "方向键已按下的时间"
        },
        "heroCenter": {
          "!doc": "勇士中心像素坐标",
          "px": {
            "!type": "number",
            "!doc": "勇士中心的横坐标"
          },
          "py": {
            "!type": "number",
            "!doc": "勇士中心的纵坐标"
          },
        },
        "heroMoving": {
          "!type": "number",
          "!doc": "勇士行走的状态值"
        },
        "heroStop": {
          "!type": "bool",
          "!doc": "勇士是否已停下"
        },
        "holdingKeys": {
          "!type": "[number]",
          "!doc": "当前按下的键"
        },
        "id2number": {
          "!doc": "图块ID到数字的对应关系"
        },
        "lockControl": {
          "!type": "bool",
          "!doc": "当前是否是锁定操作状态"
        },
        "maps": {
          "!doc": "当前各地图信息"
        },
        "number2Block": {
          "!doc": "数字到图块对象的对应关系"
        },
        "openingDoor": {
          "!doc": "正在开关的门"
        },
        "played": {
          "!type": "bool",
          "!doc": "当前是否游戏中（不包括标题画面和录像回放）"
        },
        "replay": {
          "!doc": "当前录像回放信息",
          "animate": {
            "!type": "bool",
            "!doc": "回放是否正处于动画中"
          },
          "pausing": {
            "!type": "bool",
            "!doc": "回放是否暂停中"
          },
          "replaying": {
            "!type": "bool",
            "!doc": "当前是否回放中"
          },
          "save": {
            "!type": "[]",
            "!doc": "录像中的存档"
          },
          "speed": {
            "!type": "number",
            "!doc": "回放速度"
          },
          "steps": {
            "!type": "number",
            "!doc": "回放步数"
          },
          "toReplay": {
            "!type": "[string]",
            "!doc": "待回放的列表"
          },
          "totalList": {
            "!type": "[string]",
            "!doc": "回放总列表"
          }
        },
        "route": {
          "!type": "[string]",
          "!doc": "当前录像内容"
        },
        "shops": {
          "!doc": "全局商店列表"
        },
        "textAttribute": {
          "!doc": "当前剧情文本属性"
        },
        "thisMap": {
          "!type": "floor",
          "!doc": "当前地图信息"
        }
      },
      "hasSpecial": {
        "!type": "fn(special: ?, test: number) -> bool",
        "!doc": "判定怪物是否拥有某种特殊属性；special - 怪物的ID、特殊属性值或怪物本身；test - 待检查的的属性编号；"
      },
      "getBlock": {
        "!type": "fn(x?: number, y?: number, floorId?: string, showDisable?: bool) -> {index: number, block: block}",
        "_doc": "返回地图上某个点的图块信息"
      }
    },
    "hero": {
      "!type": "heroStatus",
      "!doc": "勇士信息，为 core.status.hero 的简写",
    },
    "flags": {
      "!doc": "游戏中用到的变量，为 core.status.hero.flags 的简写",
      "hatred":{
        "!type": "number",
        "!doc": "当前仇恨值"
      },
      "poison":{
        "!type": "bool",
        "!doc": "是否处于中毒状态"
      },
      "weak":{
        "!type": "number",
        "!doc": "是否处于衰弱状态"
      },
      "curse":{
        "!type": "number",
        "!doc": "是否处于诅咒状态"
      },
      "no_zone": {
        "!type": "bool",
        "!doc": "无视领域伤害"
      },
      "no_repulse": {
        "!type": "bool",
        "!doc": "无视阻击伤害"
      },
      "no_lasel": {
        "!type": "bool",
        "!doc": "无视激光伤害"
      },
      "no_ambush": {
        "!type": "bool",
        "!doc": "无视捕捉"
      },
      "__bgm__": {
        "!type": "string",
        "!doc": "背景音乐"
      },
      "__weather__": {
        "!doc": "天气"
      },
      "__color__": {
        "!doc": "色调"
      },
    }
  }
];