var terndefs_f6783a0a_522d_417e_8407_94c67b692e50 = [
  {
    "!name": "browser",
    "Node": {
      "!type": "fn()",
      "prototype": {
        "nextSibling": {
          "!type": "+Element",
          "!doc": "Returns the node immediately following the specified one in its parent's childNodes list, or null if the specified node is the last node in that list."
        },
        "previousSibling": {
          "!type": "+Element",
          "!doc": "Returns the node immediately preceding the specified one in its parent's childNodes list, null if the specified node is the first in that list."
        },
        "lastChild": {
          "!type": "+Element",
          "!doc": "Returns the last child of a node."
        },
        "firstChild": {
          "!type": "+Element",
          "!doc": "Returns the node's first child in the tree, or null if the node is childless. If the node is a Document, it returns the first node in the list of its direct children."
        },
        "childNodes": {
          "!type": "+NodeList",
          "!doc": "Returns a collection of child nodes of the given element."
        },
        "parentNode": {
          "!type": "+Element",
          "!doc": "Returns the parent of the specified node in the DOM tree."
        },
        "tagName": {
          "!type": "string",
          "!doc": "Returns the name of the current node as a string."
        },
        "insertBefore": {
          "!type": "fn(newElt: +Element, before: +Element) -> +Element",
          "!doc": "Inserts the specified node before a reference element as a child of the current node."
        },
        "removeChild": {
          "!type": "fn(oldNode: +Element) -> +Element",
          "!doc": "Removes a child node from the DOM. Returns removed node."
        },
        "appendChild": {
          "!type": "fn(newNode: +Element) -> +Element",
          "!doc": "Adds a node to the end of the list of children of a specified parent node. If the node already exists it is removed from current parent node, then added to new parent node."
        },
        "cloneNode": {
          "!type": "fn(deep: bool) -> +Element",
          "!doc": "Returns a duplicate of the node on which this method was called."
        },
        "addEventListener": {
          "!type": "fn(type: string, listener: fn(e: +Event), capture: bool)",
          "!doc": "Registers a single event listener on a single target. The event target may be a single element in a document, the document itself, a window, or an XMLHttpRequest."
        },
        "removeEventListener": {
          "!type": "fn(type: string, listener: fn(), capture: bool)",
          "!doc": "Allows the removal of event listeners from the event target."
        },
        "innerText": {
          "!type": "string",
          "!doc": "Gets or sets the text content of a node and its descendants."
        }
      },
      "!doc": "A Node is an interface from which a number of DOM types inherit, and allows these various types to be treated (or tested) similarly."
    },
    "Element": {
      "!type": "fn()",
      "prototype": {
        "!proto": "Node.prototype",
        "getAttribute": {
          "!type": "fn(name: string) -> string",
          "!doc": "Returns the value of the named attribute on the specified element. If the named attribute does not exist, the value returned will either be null or \"\" (the empty string)."
        },
        "setAttribute": {
          "!type": "fn(name: string, value: string)",
          "!doc": "Adds a new attribute or changes the value of an existing attribute on the specified element."
        },
        "removeAttribute": {
          "!type": "fn(name: string)",
          "!doc": "Removes an attribute from the specified element."
        },
        "getElementsByTagName": {
          "!type": "fn(tagName: string) -> +NodeList",
          "!doc": "Returns a list of elements with the given tag name. The subtree underneath the specified element is searched, excluding the element itself. The returned list is live, meaning that it updates itself with the DOM tree automatically. Consequently, there is no need to call several times element.getElementsByTagName with the same element and arguments."
        },
        "getElementsByClassName": {
          "!type": "fn(name: string) -> +NodeList",
          "!doc": "Returns a set of elements which have all the given class names. When called on the document object, the complete document is searched, including the root node. You may also call getElementsByClassName on any element; it will return only elements which are descendants of the specified root element with the given class names."
        },
        "children": {
          "!type": "+HTMLCollection",
          "!doc": "Returns a collection of child elements of the given element."
        },
        "className": {
          "!type": "string",
          "!doc": "Gets and sets the value of the class attribute of the specified element."
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
          "!doc": "Returns an object that represents the element's style attribute."
        },
        "classList": {
          "!type": "+DOMTokenList",
          "!doc": "Returns a token list of the class attribute of the element."
        },
        "title": {
          "!type": "string",
          "!doc": "Establishes the text to be displayed in a 'tool tip' popup when the mouse is over the displayed node."
        },
        "width": {
          "!type": "number",
          "!doc": "Returns the layout width of an element."
        },
        "height": {
          "!type": "number",
          "!doc": "Height of an element relative to the element's offsetParent."
        },
        "getContext": {
          "!type": "fn(id: string) -> CanvasRenderingContext2D",
          "!doc": "DOM canvas elements expose the HTMLCanvasElement interface, which provides properties and methods for manipulating the layout and presentation of canvas elements. The HTMLCanvasElement interface inherits the properties and methods of the element object interface."
        },
        "innerHTML": {
          "!type": "string",
          "!doc": "Sets or gets the HTML syntax describing the element's descendants."
        }
      },
      "!doc": "Represents an element in an HTML or XML document."
    },
    "Document": {
      "!type": "fn()",
      "prototype": {
        "!proto": "Node.prototype",
        "height": {
          "!type": "number",
          "!doc": "Returns the height of the <body> element of the current document."
        },
        "width": {
          "!type": "number",
          "!doc": "Returns the width of the <body> element of the current document in pixels."
        },
        "body": {
          "!type": "+Element",
          "!doc": "Returns the <body> or <frameset> node of the current document."
        },
        "cookie": {
          "!type": "string",
          "!doc": "Get and set the cookies associated with the current document."
        },
        "URL": "string",
        "title": {
          "!type": "string",
          "!doc": "Gets or sets the title of the document."
        },
        "getElementById": {
          "!type": "fn(id: string) -> +Element",
          "!doc": "Returns a reference to the element by its ID."
        },
        "getElementsByTagName": {
          "!type": "fn(tagName: string) -> +NodeList",
          "!doc": "Returns a NodeList of elements with the given tag name. The complete document is searched, including the root node. The returned NodeList is live, meaning that it updates itself automatically to stay in sync with the DOM tree without having to call document.getElementsByTagName again."
        },
        "getElementsByName": {
          "!type": "fn(name: string) -> +HTMLCollection",
          "!doc": "Returns a list of elements with a given name in the HTML document."
        },
        "getElementsByClassName": "Element.prototype.getElementsByClassName"
      },
      "!doc": "Each web page loaded in the browser has its own document object. This object serves as an entry point to the web page's content (the DOM tree, including elements such as <body> and <table>) and provides functionality global to the document (such as obtaining the page's URL and creating new elements in the document)."
    },
    "document": {
      "!type": "+Document",
      "!doc": "Each web page loaded in the browser has its own document object. This object serves as an entry point to the web page's content (the DOM tree, including elements such as <body> and <table>) and provides functionality global to the document (such as obtaining the page's URL and creating new elements in the document)."
    },
    "Event": {
      "!type": "fn()",
      "prototype": {
        "stopPropagation": {
          "!type": "fn()",
          "!doc": "Prevents further propagation of the current event."
        },
        "preventDefault": {
          "!type": "fn()",
          "!doc": "Cancels the event if it is cancelable, without stopping further propagation of the event."
        },
        "stopImmediatePropagation": {
          "!type": "fn()",
          "!doc": "Prevents other listeners of the same event to be called."
        },
        "type": {
          "!type": "string",
          "!doc": "Returns a string containing the type of event."
        },
        "target": {
          "!type": "+Element",
          "!doc": "An EventTarget is a DOM interface implemented by objects that can receive DOM events and have listeners for them. The most common EventTargets are DOM elements, although other objects can be EventTargets too, for example document, window, XMLHttpRequest, and others."
        },
        "clientX": {
          "!type": "number",
          "!doc": "Returns the horizontal coordinate within the application's client area at which the event occurred (as opposed to the coordinates within the page). For example, clicking in the top-left corner of the client area will always result in a mouse event with a clientX value of 0, regardless of whether the page is scrolled horizontally."
        },
        "clientY": {
          "!type": "number",
          "!doc": "Returns the vertical coordinate within the application's client area at which the event occurred (as opposed to the coordinates within the page). For example, clicking in the top-left corner of the client area will always result in a mouse event with a clientY value of 0, regardless of whether the page is scrolled vertically."
        },
        "keyCode": {
          "!type": "number",
          "!doc": "Returns the Unicode value of a non-character key in a keypress event or any key in any other type of keyboard event."
        },
        "charCode": {
          "!type": "number",
          "!doc": "Returns the Unicode value of a character key pressed during a keypress event."
        },
        "which": {
          "!type": "number",
          "!doc": "Returns the numeric keyCode of the key pressed, or the character code (charCode) for an alphanumeric key pressed."
        },
        "button": {
          "!type": "number",
          "!doc": "Indicates which mouse button caused the event."
        },
        "shiftKey": {
          "!type": "bool",
          "!doc": "Indicates whether the SHIFT key was pressed when the event fired."
        },
        "ctrlKey": {
          "!type": "bool",
          "!doc": "Indicates whether the CTRL key was pressed when the event fired."
        },
        "altKey": {
          "!type": "bool",
          "!doc": "Indicates whether the ALT key was pressed when the event fired."
        }
      }
    },
    "Storage": {
      "length": {
        "!type": "number",
        "!doc": "The length read-only property of the Storage interface returns an integer representing the number of data items stored in the Storage object."
      },
      "setItem": {
        "!type": "fn(name: string, value: string)",
        "!doc": "The setItem() method of the Storage interface, when passed a key name and value, will add that key to the storage, or update that key's value if it already exists."
      },
      "getItem": {
        "!type": "fn(name: string) -> string",
        "!doc": "The getItem() method of the Storage interface, when passed a key name, will return that key's value."
      },
      "key": {
        "!type": "fn(index: number) -> string",
        "!doc": "The key() method of the Storage interface, when passed a number n, returns the name of the nth key in the storage. The order of keys is user-agent defined, so you should not rely on it."
      },
      "removeItem": {
        "!type": "fn(key: string)",
        "!doc": "The removeItem() method of the Storage interface, when passed a key name, will remove that key from the storage."
      },
      "clear": {
        "!type": "fn()",
        "!doc": "The clear() method of the Storage interface, when invoked, will empty all keys out of the storage"
      }
    },
    "localStorage": {
      "!type": "Storage",
      "!doc": "The localStorage property allows you to access a local Storage object. localStorage is similar to sessionStorage. The only difference is that, while data stored in localStorage has no expiration time, data stored in sessionStorage gets cleared when the browsing session ends - that is, when the browser is closed.\n\nIt should be noted that data stored in either localStorage or sessionStorage is specific to the protocol of the page."
    },
    "console": {
      "assert": {
        "!type": "fn(assertion: bool, text: string)",
        "!doc": "Writes an error message to the console if the assertion is false."
      },
      "error": {
        "!type": "fn(...msg: ?)",
        "!doc": "Outputs an error message to the Web Console."
      },
      "info": {
        "!type": "fn(...msg: ?)",
        "!doc": "Outputs an informational message to the Web Console."
      },
      "log": {
        "!type": "fn(...msg: ?)",
        "!doc": "Outputs a message to the Web Console."
      },
      "time": {
        "!type": "fn(label: string)",
        "!doc": "Starts a timer you can use to track how long an operation takes."
      },
      "timeEnd": {
        "!type": "fn(label: string)",
        "!doc": "Stops a timer that was previously started by calling console.time()."
      },
      "trace": {
        "!type": "fn()",
        "!doc": "Outputs a stack trace to the Web Console."
      },
      "warn": {
        "!type": "fn(...msg: ?)",
        "!doc": "Outputs a warning message to the Web Console."
      },
      "!doc": "The console object provides access to the browser's debugging console. The specifics of how it works vary from browser to browser, but there is a de facto set of features that are typically provided."
    },
    "window": {
      "!type": "<top>",
      "!doc": "The window object represents a window containing a DOM document."
    },
    "self": {
      "!type": "<top>",
      "!doc": "Returns an object reference to the window object. "
    },
    "devicePixelRatio": "number",
    "requestAnimationFrame": {
      "!type": "fn(callback: fn(timestamp: number)) -> number",
      "!doc": "The Window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint."
    },
    "cancelAnimationFrame": {
      "!type": "fn(number)n",
      "!doc": "Cancels a previously scheduled animation frame request."
    },
    "alert": {
      "!type": "fn(message: string)",
      "!doc": "Display an alert dialog with the specified content and an OK button."
    },
    "confirm": {
      "!type": "fn(message: string) -> bool",
      "!doc": "Displays a modal dialog with a message and two buttons, OK and Cancel."
    },
    "prompt": {
      "!type": "fn(message: string, value: string) -> string",
      "!doc": "Displays a dialog with a message prompting the user to input some text."
    },
    "setTimeout": {
      "!type": "fn(f: fn(), ms: number) -> number",
      "!doc": "Calls a function or executes a code snippet after specified delay."
    },
    "clearTimeout": {
      "!type": "fn(timeout: number)",
      "!doc": "Clears the delay set by window.setTimeout()."
    },
    "setInterval": {
      "!type": "fn(f: fn(), ms: number) -> number",
      "!doc": "Calls a function or executes a code snippet repeatedly, with a fixed time delay between each call to that function."
    },
    "clearInterval": {
      "!type": "fn(interval: number)",
      "!doc": "Cancels repeated action which was set up using setInterval."
    },
    "atob": {
      "!type": "fn(encoded: string) -> string",
      "!doc": "Decodes a string of data which has been encoded using base-64 encoding."
    },
    "btoa": {
      "!type": "fn(data: string) -> string",
      "!doc": "Creates a base-64 encoded ASCII string from a string of binary data."
    },
    "getComputedStyle": {
      "!type": "fn(node: +Element, pseudo?: string) -> Element.prototype.style",
      "!doc": "Gives the final used values of all the CSS properties of an element."
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
    }
  },
  {
    "!name": "ecmascript",
    "Infinity": {
      "!type": "number",
      "!doc": "A numeric value representing infinity."
    },
    "undefined": {
      "!type": "?",
      "!doc": "The value undefined."
    },
    "NaN": {
      "!type": "number",
      "!doc": "A value representing Not-A-Number."
    },
    "Object": {
      "!type": "fn()",
      "create": {
        "!type": "fn(proto: ?) -> !custom:Object_create",
        "!doc": "Creates a new object with the specified prototype object and properties."
      },
      "defineProperty": {
        "!type": "fn(obj: ?, prop: string, desc: propertyDescriptor) -> !custom:Object_defineProperty",
        "!doc": "Defines a new property directly on an object, or modifies an existing property on an object, and returns the object. If you want to see how to use the Object.defineProperty method with a binary-flags-like syntax, see this article."
      },
      "keys": {
        "!type": "fn(obj: ?) -> [string]",
        "!doc": "Returns an array of a given object's own enumerable properties, in the same order as that provided by a for-in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well)."
      },
      "assign": {
        "!type": "fn(target: ?, source: ?, source?: ?) -> !0",
        "!effects": ["copy !1 !0", "copy !2 !0", "copy !3 !0"],
        "!doc": "The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.",
      },
      "prototype": {
        "!stdProto": "Object",
        "toString": {
          "!type": "fn() -> string",
          "!doc": "Returns a string representing the object."
        },
        "hasOwnProperty": {
          "!type": "fn(prop: string) -> bool",
          "!doc": "Returns a boolean indicating whether the object has the specified property."
        }
      },
      "!doc": "Creates an object wrapper."
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
          "!doc": "Calls a function with a given this value and arguments provided as an array (or an array like object)."
        },
        "call": {
          "!type": "fn(this: ?, args?: ?) -> !this.!ret",
          "!effects": [
            "call and return !this this=!0 !1 !2 !3 !4"
          ],
          "!doc": "Calls a function with a given this value and arguments provided individually."
        },
        "bind": {
          "!type": "fn(this: ?, args?: ?) -> !custom:Function_bind",
          "!doc": "Creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function was called."
        },
        "prototype": "?"
      },
      "!doc": "Every function in JavaScript is actually a Function object."
    },
    "Array": {
      "!type": "fn(size: number) -> !custom:Array_ctor",
      "isArray": {
        "!type": "fn(value: ?) -> bool",
        "!doc": "Returns true if an object is an array, false if it is not."
      },
      "from": {
        "!type": "fn(arrayLike: ?, mapFn?: fn(elt: ?, i: number) -> ?, thisArg?: ?) -> [!0.<i>]",
        "!effects": [
          "call !1 this=!2 !0.<i> number"
        ],
        "!doc": "The Array.from() method creates a new Array instance from an array-like or iterable object.",
      },
      "of": {
        "!type": "fn(elementN: ?) -> [!0]",
        "!doc": "The Array.of() method creates a new Array instance with a variable number of arguments, regardless of number or type of the arguments.",
      },
      "prototype": {
        "!stdProto": "Array",
        "length": {
          "!type": "number",
          "!doc": "An unsigned, 32-bit integer that specifies the number of elements in an array."
        },
        "concat": {
          "!type": "fn(other: [?]) -> !this",
          "!doc": "Returns a new array comprised of this array joined with other array(s) and/or value(s)."
        },
        "join": {
          "!type": "fn(separator?: string) -> string",
          "!doc": "Joins all elements of an array into a string."
        },
        "splice": {
          "!type": "fn(pos: number, amount: number, newelt?: ?) -> [?]",
          "!doc": "Changes the content of an array, adding new elements while removing old elements."
        },
        "pop": {
          "!type": "fn() -> !this.<i>",
          "!doc": "Removes the last element from an array and returns that element."
        },
        "push": {
          "!type": "fn(newelt: ?) -> number",
          "!effects": [
            "propagate !0 !this.<i>"
          ],
          "!doc": "Mutates an array by appending the given elements and returning the new length of the array."
        },
        "shift": {
          "!type": "fn() -> !this.<i>",
          "!doc": "Removes the first element from an array and returns that element. This method changes the length of the array."
        },
        "unshift": {
          "!type": "fn(newelt: ?) -> number",
          "!effects": [
            "propagate !0 !this.<i>"
          ],
          "!doc": "Adds one or more elements to the beginning of an array and returns the new length of the array."
        },
        "slice": {
          "!type": "fn(from?: number, to?: number) -> !this",
          "!doc": "Returns a shallow copy of a portion of an array."
        },
        "reverse": {
          "!type": "fn()",
          "!doc": "Reverses an array in place.  The first array element becomes the last and the last becomes the first."
        },
        "sort": {
          "!type": "fn(compare?: fn(a: ?, b: ?) -> number)",
          "!effects": [
            "call !0 !this.<i> !this.<i>"
          ],
          "!doc": "Sorts the elements of an array in place and returns the array."
        },
        "indexOf": {
          "!type": "fn(elt: ?, from?: number) -> number",
          "!doc": "Returns the first index at which a given element can be found in the array, or -1 if it is not present."
        },
        "lastIndexOf": {
          "!type": "fn(elt: ?, from?: number) -> number",
          "!doc": "Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex."
        },
        "filter": {
          "!type": "fn(test: fn(elt: ?, i: number, array: +Array) -> bool, context?: ?) -> !this",
          "!effects": [
            "call !0 this=!1 !this.<i> number !this"
          ],
          "!doc": "Creates a new array with all elements that pass the test implemented by the provided function."
        },
        "forEach": {
          "!type": "fn(f: fn(elt: ?, i: number, array: +Array), context?: ?)",
          "!effects": [
            "call !0 this=!1 !this.<i> number !this"
          ],
          "!doc": "Executes a provided function once per array element."
        },
        "map": {
          "!type": "fn(f: fn(elt: ?, i: number, array: +Array) -> ?, context?: ?) -> [!0.!ret]",
          "!effects": [
            "call !0 this=!1 !this.<i> number !this"
          ],
          "!doc": "Creates a new array with the results of calling a provided function on every element in this array."
        },
        "reduce": {
          "!type": "fn(combine: fn(sum: ?, elt: ?, i: number, array: +Array) -> ?, init?: ?) -> !0.!ret",
          "!effects": [
            "call !0 !1 !this.<i> number !this"
          ],
          "!doc": "Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value."
        },
        "fill": {
          "!type": "fn(value: ?, start?: number, end?: number) -> !this",
          "!doc": "The fill() method fills all the elements of an array from a start index to an end index with a static value.",
        },
        "find": {
          "!type": "fn(callback: fn(element: ?, index: number, array: [?]) -> bool, thisArg?: ?) -> !this.<i>",
          "!effects": ["call !0 this=!2 !this.<i> number"],
          "!doc": "The find() method returns a value in the array, if an element in the array satisfies the provided testing function. Otherwise undefined is returned.",
        },
        "findIndex": {
          "!type": "fn(callback: fn(element: ?, index: number, array: [?]), thisArg?: ?) -> number",
          "!effects": ["call !0 this=!2 !this.<i> number"],
          "!doc": "The findIndex() method returns an index in the array, if an element in the array satisfies the provided testing function. Otherwise -1 is returned.",
        },
        "keys": {
          "!type": "fn() -> +iter[:t=number]",
          "!doc": "The keys() method returns a new Array Iterator that contains the keys for each index in the array.",
        },
        "values": {
          "!type": "fn() -> +iter[:t=!this.<i>]",
          "!doc": "The values() method returns a new Array Iterator object that contains the values for each index in the array.",
        },
        "includes": {
          "!type": "fn(value: ?, fromIndex?: number) -> bool",
          "!doc": "Determines whether an array includes a certain element, returning true or false as appropriate.",
        }
      },
      "!doc": "The JavaScript Array global object is a constructor for arrays, which are high-level, list-like objects."
    },
    "String": {
      "!type": "fn(value: ?) -> string",
      "prototype": {
        "!stdProto": "String",
        "length": {
          "!type": "number",
          "!doc": "Represents the length of a string."
        },
        "<i>": "string",
        "charAt": {
          "!type": "fn(i: number) -> string",
          "!doc": "Returns the specified character from a string."
        },
        "charCodeAt": {
          "!type": "fn(i: number) -> number",
          "!doc": "Returns the numeric Unicode value of the character at the given index (except for unicode codepoints > 0x10000)."
        },
        "indexOf": {
          "!type": "fn(char: string, from?: number) -> number",
          "!doc": "Returns the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex,\nreturns -1 if the value is not found."
        },
        "lastIndexOf": {
          "!type": "fn(char: string, from?: number) -> number",
          "!doc": "Returns the index within the calling String object of the last occurrence of the specified value, or -1 if not found. The calling string is searched backward, starting at fromIndex."
        },
        "substring": {
          "!type": "fn(from: number, to?: number) -> string",
          "!doc": "Returns a subset of a string between one index and another, or through the end of the string."
        },
        "substr": {
          "!type": "fn(from: number, length?: number) -> string",
          "!doc": "Returns the characters in a string beginning at the specified location through the specified number of characters."
        },
        "slice": {
          "!type": "fn(from: number, to?: number) -> string",
          "!doc": "Extracts a section of a string and returns a new string."
        },
        "padStart": {
          "!type": "fn(targetLength: number, padString?: string) -> string",
          "!doc": "Pads the current string with another string (repeated, if needed) so that the resulting string reaches the given length."
        },
        "padEnd": {
          "!type": "fn(targetLength: number, padString?: string) -> string",
          "!doc": "pads the current string with a given string (repeated, if needed) so that the resulting string reaches a given length."
        },
        "trim": {
          "!type": "fn() -> string",
          "!doc": "Removes whitespace from both ends of the string."
        },
        "trimStart": {
          "!type": "fn() -> string",
          "!doc": "Removes whitespace from the beginning of a string. "
        },
        "trimEnd": {
          "!type": "fn() -> string",
          "!doc": "Removes whitespace from the end of a string."
        },
        "toUpperCase": {
          "!type": "fn() -> string",
          "!doc": "Returns the calling string value converted to uppercase."
        },
        "toLowerCase": {
          "!type": "fn() -> string",
          "!doc": "Returns the calling string value converted to lowercase."
        },
        "split": {
          "!type": "fn(pattern?: string|+RegExp, limit?: number) -> [string]",
          "!doc": "Splits a String object into an array of strings by separating the string into substrings."
        },
        "concat": {
          "!type": "fn(other: string) -> string",
          "!doc": "Combines the text of two or more strings and returns a new string."
        },
        "match": {
          "!type": "fn(pattern: +RegExp) -> [string]",
          "!doc": "Used to retrieve the matches when matching a string against a regular expression."
        },
        "replace": {
          "!type": "fn(pattern: string|+RegExp, replacement: string) -> string",
          "!doc": "Returns a new string with some or all matches of a pattern replaced by a replacement.  The pattern can be a string or a RegExp, and the replacement can be a string or a function to be called for each match."
        },
        "endsWith": {
          "!type": "fn(searchString: string, position?: number) -> bool",
          "!doc": "The endsWith() method determines whether a string ends with the characters of another string, returning true or false as appropriate.",
        },
        "startsWith": {
          "!type": "fn(searchString: string, position?: number) -> bool",
          "!doc": "The startsWith() method determines whether a string begins with the characters of another string, returning true or false as appropriate.",
        }
      },
      "!doc": "The String global object is a constructor for strings, or a sequence of characters."
    },
    "Number": {
      "!type": "fn(value: ?) -> number",
      "MAX_VALUE": {
        "!type": "number",
        "!doc": "The maximum numeric value representable in JavaScript."
      },
      "MIN_VALUE": {
        "!type": "number",
        "!doc": "The smallest positive numeric value representable in JavaScript."
      },
      "POSITIVE_INFINITY": {
        "!type": "number",
        "!doc": "A value representing the positive Infinity value."
      },
      "NEGATIVE_INFINITY": {
        "!type": "number",
        "!doc": "A value representing the negative Infinity value."
      },
      "prototype": {
        "!stdProto": "Number",
        "toString": {
          "!type": "fn(radix?: number) -> string",
          "!doc": "Returns a string representing the specified Number object"
        },
        "toFixed": {
          "!type": "fn(digits: number) -> string",
          "!doc": "Formats a number using fixed-point notation"
        },
        "toExponential": {
          "!type": "fn(digits: number) -> string",
          "!doc": "Returns a string representing the Number object in exponential notation"
        },
        "toPrecision": {
          "!type": "fn(digits: number) -> string",
          "!doc": "The toPrecision() method returns a string representing the number to the specified precision."
        }
      },
      "EPSILON": {
        "!type": "number",
        "!doc": "The Number.EPSILON property represents the difference between one and the smallest value greater than one that can be represented as a Number.",
      },
      "MAX_SAFE_INTEGER": {
        "!type": "number",
        "!doc": "The Number.MAX_SAFE_INTEGER constant represents the maximum safe integer in JavaScript (2^53 - 1).",
      },
      "MIN_SAFE_INTEGER": {
        "!type": "number",
        "!doc": "The Number.MIN_SAFE_INTEGER constant represents the minimum safe integer in JavaScript (-(2^53 - 1)).",
      },
      "isFinite": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": "The Number.isFinite() method determines whether the passed value is finite.",
      },
      "isInteger": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": "The Number.isInteger() method determines whether the passed value is an integer.",
      },
      "isNaN": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": "The Number.isNaN() method determines whether the passed value is NaN. More robust version of the original global isNaN().",
      },
      "isSafeInteger": {
        "!type": "fn(testValue: ?) -> bool",
        "!doc": "The Number.isSafeInteger() method determines whether the provided value is a number that is a safe integer. A safe integer is an integer that",
      },
      "parseFloat": {
        "!type": "fn(string: string) -> number",
        "!doc": "The Number.parseFloat() method parses a string argument and returns a floating point number.",
      },
      "parseInt": {
        "!type": "fn(string: string, radix?: number) -> number",
        "!doc": "The Number.parseInt() method parses a string argument and returns an integer of the specified radix or base.",
      },
      "!doc": "The Number JavaScript object is a wrapper object allowing you to work with numerical values. A Number object is created using the Number() constructor."
    },
    "Boolean": {
      "!type": "fn(value: ?) -> bool",
      "prototype": {
        "!stdProto": "Boolean"
      },
      "!doc": "The Boolean object is an object wrapper for a boolean value."
    },
    "RegExp": {
      "!type": "fn(source: string, flags?: string)",
      "prototype": {
        "!stdProto": "RegExp",
        "exec": {
          "!type": "fn(input: string) -> [string]",
          "!doc": "Executes a search for a match in a specified string. Returns a result array, or null."
        },
        "test": {
          "!type": "fn(input: string) -> bool",
          "!doc": "Executes the search for a match between a regular expression and a specified string. Returns true or false."
        }
      },
      "!doc": "Creates a regular expression object for matching text with a pattern."
    },
    "parseInt": {
      "!type": "fn(string: string, radix?: number) -> number",
      "!doc": "Parses a string argument and returns an integer of the specified radix or base."
    },
    "parseFloat": {
      "!type": "fn(string: string) -> number",
      "!doc": "Parses a string argument and returns a floating point number."
    },
    "isNaN": {
      "!type": "fn(value: number) -> bool",
      "!doc": "Determines whether a value is NaN or not. Be careful, this function is broken. You may be interested in ECMAScript 6 Number.isNaN."
    },
    "isFinite": {
      "!type": "fn(value: number) -> bool",
      "!doc": "Determines whether the passed value is a finite number."
    },
    "eval": {
      "!type": "fn(code: string) -> ?",
      "!doc": "Evaluates JavaScript code represented as a string."
    },
    "encodeURI": {
      "!type": "fn(uri: string) -> string",
      "!doc": "Encodes a Uniform Resource Identifier (URI) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape sequences for characters composed of two \"surrogate\" characters)."
    },
    "encodeURIComponent": {
      "!type": "fn(uri: string) -> string",
      "!doc": "Encodes a Uniform Resource Identifier (URI) component by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape sequences for characters composed of two \"surrogate\" characters)."
    },
    "decodeURI": {
      "!type": "fn(uri: string) -> string",
      "!doc": "Decodes a Uniform Resource Identifier (URI) previously created by encodeURI or by a similar routine."
    },
    "decodeURIComponent": {
      "!type": "fn(uri: string) -> string",
      "!doc": "Decodes a Uniform Resource Identifier (URI) component previously created by encodeURIComponent or by a similar routine."
    },
    "Math": {
      "E": {
        "!type": "number",
        "!doc": "The base of natural logarithms, e, approximately 2.718."
      },
      "LN2": {
        "!type": "number",
        "!doc": "The natural logarithm of 2, approximately 0.693."
      },
      "LN10": {
        "!type": "number",
        "!doc": "The natural logarithm of 10, approximately 2.302."
      },
      "LOG2E": {
        "!type": "number",
        "!doc": "The base 2 logarithm of E (approximately 1.442)."
      },
      "LOG10E": {
        "!type": "number",
        "!doc": "The base 10 logarithm of E (approximately 0.434)."
      },
      "SQRT1_2": {
        "!type": "number",
        "!doc": "The square root of 1/2; equivalently, 1 over the square root of 2, approximately 0.707."
      },
      "SQRT2": {
        "!type": "number",
        "!doc": "The square root of 2, approximately 1.414."
      },
      "PI": {
        "!type": "number",
        "!doc": "The ratio of the circumference of a circle to its diameter, approximately 3.14159."
      },
      "abs": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the absolute value of a number."
      },
      "cos": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the cosine of a number."
      },
      "sin": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the sine of a number."
      },
      "tan": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the tangent of a number."
      },
      "acos": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the arccosine (in radians) of a number."
      },
      "asin": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the arcsine (in radians) of a number."
      },
      "atan": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the arctangent (in radians) of a number."
      },
      "atan2": {
        "!type": "fn(y: number, x: number) -> number",
        "!doc": "Returns the arctangent of the quotient of its arguments."
      },
      "ceil": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the smallest integer greater than or equal to a number."
      },
      "floor": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the largest integer less than or equal to a number."
      },
      "round": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the value of a number rounded to the nearest integer."
      },
      "exp": {
        "!type": "fn(number) -> number",
        "!doc": "Returns E^x, where x is the argument, and E is Euler's constant, the base of the natural logarithms."
      },
      "log": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the natural logarithm (base E) of a number."
      },
      "sqrt": {
        "!type": "fn(number) -> number",
        "!doc": "Returns the square root of a number."
      },
      "pow": {
        "!type": "fn(number, number) -> number",
        "!doc": "Returns base to the exponent power, that is, baseexponent."
      },
      "max": {
        "!type": "fn(number, number) -> number",
        "!doc": "Returns the largest of zero or more numbers."
      },
      "min": {
        "!type": "fn(number, number) -> number",
        "!doc": "Returns the smallest of zero or more numbers."
      },
      "random": {
        "!type": "fn() -> number",
        "!doc": "Returns a floating-point, pseudo-random number in the range [0, 1) that is, from 0 (inclusive) up to but not including 1 (exclusive), which you can then scale to your desired range."
      },
      "log10": {
        "!type": "fn(x: number) -> number",
        "!doc": "The Math.log10() function returns the base 10 logarithm of a number.",
      },
      "log2": {
        "!type": "fn(x: number) -> number",
        "!doc": "The Math.log2() function returns the base 2 logarithm of a number.",
      },
      "sign": {
        "!type": "fn(x: number) -> number",
        "!doc": "The Math.sign() function returns the sign of a number, indicating whether the number is positive, negative or zero.",
      },
      "trunc": {
        "!type": "fn(x: number) -> number",
        "!doc": "The Math.trunc() function returns the integral part of a number by removing any fractional digits. It does not round any numbers. The function can be expressed with the floor() and ceil() function:",
      },
      "!doc": "A built-in object that has properties and methods for mathematical constants and functions."
    },
    "JSON": {
      "parse": {
        "!type": "fn(json: string, reviver?: fn(key: string, value: ?) -> ?) -> ?",
        "!doc": "Parse a string as JSON, optionally transforming the value produced by parsing."
      },
      "stringify": {
        "!type": "fn(value: ?, replacer?: fn(key: string, value: ?) -> ?, space?: string|number) -> string",
        "!doc": "Convert a value to JSON, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified."
      },
      "!doc": "JSON (JavaScript Object Notation) is a data-interchange format.  It closely resembles a subset of JavaScript syntax, although it is not a strict subset. (See JSON in the JavaScript Reference for full details.)  It is useful when writing any kind of JavaScript-based application, including websites and browser extensions.  For example, you might store user information in JSON format in a cookie, or you might store extension preferences in JSON in a string-valued browser preference."
    }
  },
  {
    "!name": "core",
    "!define": {
      "image": {
        "!doc": "图片信息",
        "width": "number",
        "height": "number",
        "src": "string"
      },
      "audio": {
        "!doc": "音乐音效信息",
        "currentTime": "number",
        "play": "fn()",
        "pause": "fn()",
        "paused": "bool",
        "duration": "number",
        "volume": "number",
      },
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
      "loc": {
        "!doc": "勇士坐标",
        "x": "number",
        "y": "number",
        "direction": "string"
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
          "!type": "loc",
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
      "blockInfo": {
        "!doc": "图块的更多信息",
        "animate": {
          "!type": "number",
          "!doc": "动画帧数"
        },
        "cls": {
          "!type": "string",
          "!doc": "图块类别"
        },
        "faceIds": {
          "!doc": "行走图朝向",
          "up": "string",
          "down": "string",
          "left": "string",
          "right": "string"
        },
        "height": {
          "!type": "number",
          "!doc": "图块高度"
        },
        "id": {
          "!type": "string",
          "!doc": "图块ID"
        },
        "image": {
          "!type": "image",
          "!doc": "图块所在的图片"
        },
        "name": {
          "!type": "string",
          "!doc": "图块名称"
        },
        "number": {
          "!type": "number",
          "!doc": "图块使用的数字"
        },
        "posX": {
          "!type": "number",
          "!doc": "图块在图片上的横坐标"
        },
        "posY": {
          "!type": "number",
          "!doc": "图块在图片上的纵坐标"
        },
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
      "control": {
        "!doc": "游戏控制",
        "showStatusBar": {
          "!doc": "显示状态栏", 
          "!type": "fn()"
        }, 
        "startReplay": {
          "!doc": "开始播放", 
          "!type": "fn(list: [string])"
        }, 
        "triggerReplay": {
          "!doc": "更改播放状态", 
          "!type": "fn()"
        }, 
        "screenFlash": {
          "!doc": "画面闪烁<br/>例如：core.screenFlash([255, 0, 0, 1], 3); // 红屏一闪而过<br/>color: 一行三列（第四列视为1）或一行四列（第四列若大于1则会被视为1，第四列若填负数则会被视为0）的颜色数组，必填<br/>time: 单次闪烁时长，实际闪烁效果为先花其三分之一的时间渐变到目标色调，再花剩余三分之二的时间渐变回去<br/>times: 闪烁的总次数，不填或填0都视为1<br/>callback: 闪烁全部完毕后的回调函数，可选", 
          "!type": "fn(color: [number], time: number, times?: number, callback?: fn())"
        }, 
        "setCurtain": {
          "!doc": "更改画面色调，不计入存档。如需长期生效请使用core.events._action_setCurtain()函数<br/>例如：core.setCurtain(); // 恢复画面色调，用时四分之三秒<br/>color: 一行三列（第四列视为1）或一行四列（第四列若大于1则会被视为1，第四列若为负数则会被视为0）的颜色数组，不填视为[0, 0, 0, 0]<br/>time: 渐变时间，单位为毫秒。不填视为750ms，负数视为0（无渐变，立即更改）<br/>callback: 更改完毕后的回调函数，可选。事件流中常取core.doAction", 
          "!type": "fn(color?: [number], time?: number, callback?: fn())"
        }, 
        "updateDamage": {
          "!doc": "更新地图显伤<br/>例如：core.updateDamage(); // 更新当前地图的显伤，绘制在显伤层（废话）<br/>floorId: 地图id，不填视为当前地图。预览地图时填写<br/>ctx: 绘制到的画布，如果填写了就会画在该画布而不是显伤层", 
          "!type": "fn(floorId?: string, ctx?: string|CanvasRenderingContext2D)"
        }, 
        "nextX": {
          "!doc": "获取主角面前第n格的横坐标<br/>例如：core.closeDoor(core.nextX(), core.nextY(), 'yellowDoor', core.turnHero); // 在主角面前关上一扇黄门，然后主角顺时针旋转90°<br/>n: 目标格与主角的距离，面前为正数，背后为负数，脚下为0，不填视为1", 
          "!type": "fn(n?: number) -> number"
        }, 
        "nextY": {
          "!doc": "获取主角面前第n格的纵坐标<br/>例如：core.jumpHero(core.nextX(2), core.nextY(2)); // 主角向前跃过一格，即跳跃靴道具的使用效果<br/>n: 目标格与主角的距离，面前为正数，背后为负数，脚下为0，不填视为1", 
          "!type": "fn(n?: number) -> number"
        }, 
        "clearContinueAutomaticRoute": {
          "!doc": "清空剩下的自动寻路列表", 
          "!type": "fn(callback?: fn())"
        }, 
        "updateViewport": {
          "!doc": "更新大地图的可见区域", 
          "!type": "fn()"
        }, 
        "getMappedName": {
          "!doc": "获得映射文件名", 
          "!type": "fn(name: string) -> string"
        }, 
        "addFlag": {
          "!doc": "增减一个flag变量，等价于 core.setFlag(name, core.getFlag(name, 0) + value)<br/>例如：core.addFlag('hatred', 1); // 增加1点仇恨值<br/>name: 变量名，支持中文<br/>value: 变量的增量", 
          "!type": "fn(name: string, value: number)"
        }, 
        "setFlag": {
          "!doc": "设置一个flag变量<br/>例如：core.setFlag('poison', true); // 令主角中毒<br/>name: 变量名，支持中文<br/>value: 变量的新值，不填或填null视为删除", 
          "!type": "fn(name: string, value: ?)"
        }, 
        "viewMapReplay": {
          "!doc": "回放录像时浏览地图", 
          "!type": "fn()"
        }, 
        "stopSound": {
          "!doc": "停止所有音频", 
          "!type": "fn()"
        }, 
        "addGameCanvasTranslate": {
          "!doc": "加减画布偏移", 
          "!type": "fn(x?: number, y?: number)"
        }, 
        "addBuff": {
          "!doc": "增减主角某个属性的百分比修正倍率，加减法叠加和抵消。等价于 core.setBuff(name, core.getBuff(name) + value)<br/>例如：core.addBuff('atk', -0.1); // 主角获得一层“攻击力减一成”的负面效果<br/>name: 属性的英文名，请注意只能用于数值类属性哦，否则随后的乘法会得到NaN<br/>value: 倍率的增量", 
          "!type": "fn(name: string, value: number)"
        }, 
        "drawHero": {
          "!doc": "绘制主角和跟随者并重置视野到以主角为中心<br/>例如：core.drawHero(); // 原地绘制主角的静止帧（第一帧）并重置视野，这样调用一般就是用来重置视野<br/>status: 绘制第几帧（默认支持1、2、4，推荐在project\\icons.js中把第三帧也注册了，这里预留了一个'midFoot'作为其枚举值），不填视为静止帧（第一帧）。<br/>offset: 相对主角逻辑位置的偏移量，不填视为无偏移。用于绘制行走中的主角（正数表示前进，负数表示后退，但跟随者的后退很难看）或表现一些特殊的演出效果", 
          "!type": "fn(status?: string, offset?: number, frame?: number)"
        }, 
        "pauseBgm": {
          "!doc": "暂停背景音乐的播放", 
          "!type": "fn()"
        }, 
        "setReplaySpeed": {
          "!doc": "设置播放速度", 
          "!type": "fn(speed: number)"
        }, 
        "pauseReplay": {
          "!doc": "暂停播放", 
          "!type": "fn()"
        }, 
        "doSL": {
          "!doc": "实际进行存读档事件", 
          "!type": "fn(id?: string, type?: string)"
        }, 
        "setStatus": {
          "!doc": "设置主角的某个属性<br/>例如：core.setStatus('atk', 100); // 设置攻击力为100<br/>name: 属性的英文名，其中'x'、'y'和'direction'会被特殊处理为 core.setHeroLoc(name, value)，其他的会直接对 core.status.hero[name] 赋值<br/>value: 属性的新值", 
          "!type": "fn(name: string, value: number)"
        }, 
        "setAutomaticRoute": {
          "!doc": "半自动寻路，用于鼠标或手指拖动<br/>例如：core.setAutomaticRoute(0, 0, [{direction: \"right\", x: 4, y: 9}, {direction: \"right\", x: 5, y: 9}, {direction: \"right\", x: 6, y: 9}, {direction: \"up\", x: 6, y: 8}]);<br/>destX: 鼠标或手指的起拖点横坐标<br/>destY: 鼠标或手指的起拖点横坐标<br/>stepPostfix: 拖动轨迹的数组表示，每项为一步的方向和目标点。", 
          "!type": "fn(destX: number, destY: number, stepPostfix: [loc])"
        }, 
        "triggerHero": {
          "!doc": "改变勇士的显隐状态", 
          "!type": "fn(type?: string, time?: number, callback?: fn())"
        }, 
        "gatherFollowers": {
          "!doc": "立刻聚集所有的跟随者", 
          "!type": "fn()"
        }, 
        "getStatus": {
          "!doc": "读取主角的某个属性，不包括百分比修正<br/>例如：core.getStatus('atk'); // 读取主角的攻击力<br/>name: 属性的英文名，其中'x'、'y'和'direction'会被特殊处理为 core.getHeroLoc(name)，其他的会直接读取 core.status.hero[name]", 
          "!type": "fn(name: string) -> number"
        }, 
        "setHeroLoc": {
          "!doc": "设置勇士位置<br/>值得注意的是，这句话虽然会使勇士改变位置，但并不会使界面重新绘制；<br/>如需立刻重新绘制地图还需调用：core.clearMap('hero'); core.drawHero(); 来对界面进行更新。<br/>例如：core.setHeroLoc('x', 5) // 将勇士当前位置的横坐标设置为5。<br/>name: 要设置的坐标属性<br/>value: 新值<br/>noGather: 是否聚集跟随者", 
          "!type": "fn(name: string, value: string|number, noGather?: bool)"
        }, 
        "getLvName": {
          "!doc": "根据级别的数字获取对应的名称，后者定义在全塔属性<br/>例如：core.getLvName(); // 获取主角当前级别的名称，如“下级佣兵”<br/>lv: 级别的数字，不填则视为主角当前的级别<br/>返回值：级别的名称，如果不存在就还是返回数字", 
          "!type": "fn(lv?: number) -> string|number"
        }, 
        "addStatus": {
          "!doc": "增减主角的某个属性，等价于core.setStatus(name, core.getStatus(name) + value)<br/>例如：core.addStatus('atk', 100'); // 给主角攻击力加100<br/>name: 属性的英文名<br/>value: 属性的增量", 
          "!type": "fn(name: string, value: number)"
        }, 
        "speedUpReplay": {
          "!doc": "加速播放", 
          "!type": "fn()"
        }, 
        "loadData": {
          "!doc": "从本地读档", 
          "!type": "fn(data?: ?, callback?: fn())"
        }, 
        "debug": {
          "!doc": "开启调试模式, 此模式下可以按Ctrl键进行穿墙, 并忽略一切事件。<br/>此模式下不可回放录像和上传成绩。", 
          "!type": "fn()"
        }, 
        "moveOneStep": {
          "!doc": "每移动一格后执行的事件", 
          "!type": "fn(callback?: fn())"
        }, 
        "clearStatus": {
          "!doc": "清除游戏状态和数据", 
          "!type": "fn()"
        }, 
        "updateFollowers": {
          "!doc": "更新跟随者坐标", 
          "!type": "fn()"
        }, 
        "waitHeroToStop": {
          "!doc": "等待主角停下<br/>例如：core.waitHeroToStop(core.vibrate); // 等待主角停下，然后视野左右抖动1秒<br/>callback: 主角停止后的回调函数", 
          "!type": "fn(callback?: fn())"
        }, 
        "hideStatusBar": {
          "!doc": "隐藏状态栏", 
          "!type": "fn(showToolbox?: bool)"
        }, 
        "getBuff": {
          "!doc": "读取主角某个属性的百分比修正倍率，初始值为1<br/>例如：core.getBuff('atk'); // 主角当前能发挥出多大比例的攻击力<br/>name: 属性的英文名", 
          "!type": "fn(name: string) -> number"
        }, 
        "setToolbarButton": {
          "!doc": "改变工具栏为按钮1-8", 
          "!type": "fn(useButton?: bool)"
        }, 
        "getSaves": {
          "!doc": "获得某些存档内容", 
          "!type": "fn(ids?: ?, callback?: fn())"
        }, 
        "replay": {
          "!doc": "回放下一个操作", 
          "!type": "fn()"
        }, 
        "getStatusOrDefault": {
          "!doc": "从status中获得属性，如果不存在则从勇士属性中获取", 
          "!type": "fn(status?: ?, name?: string)"
        }, 
        "unregisterReplayAction": {
          "!doc": "注销一个录像行为", 
          "!type": "fn(name: string)"
        }, 
        "setBuff": {
          "!doc": "设置主角某个属性的百分比修正倍率，初始值为1，<br/>倍率存放在flag: '__'+name+'_buff__' 中<br/>例如：core.setBuff('atk', 0.5); // 主角能发挥出的攻击力减半<br/>name: 属性的英文名，请注意只能用于数值类属性哦，否则随后的乘法会得到NaN<br/>value: 新的百分比修正倍率，不填（效果上）视为1", 
          "!type": "fn(name: string, value: number)"
        }, 
        "continueAutomaticRoute": {
          "!doc": "继续剩下的自动寻路操作", 
          "!type": "fn()"
        }, 
        "saveReplay": {
          "!doc": "回放时存档", 
          "!type": "fn()"
        }, 
        "setAutoHeroMove": {
          "!doc": "连续行走<br/>例如：core.setAutoHeroMove([{direction: \"up\", step: 1}, {direction: \"left\", step: 3}, {direction: \"right\", step: 3}, {direction: \"up\", step: 9}]); // 上左左左右右右上9<br/>steps: 压缩的步伐数组，每项表示朝某方向走多少步", 
          "!type": "fn(steps: [?])"
        },
        "fillPosWithPoint": {
          "!doc": "显示离散的寻路点",
          "!type": "fn(pos?: ?)"
        }, 
        "unregisterResize": {
          "!doc": "注销一个resize函数", 
          "!type": "fn(name: string)"
        }, 
        "saveAndStopAutomaticRoute": {
          "!doc": "保存剩下的寻路，并停止", 
          "!type": "fn()"
        }, 
        "hideStartAnimate": {
          "!doc": "淡出标题画面<br/>例如：core.hideStartAnimate(core.startGame); // 淡出标题画面并开始新游戏，跳过难度选择<br/>callback: 标题画面完全淡出后的回调函数", 
          "!type": "fn(callback?: fn())"
        }, 
        "getAllSaves": {
          "!doc": "获得所有存档内容", 
          "!type": "fn(callback?: fn())"
        }, 
        "updateHeroIcon": {
          "!doc": "更新状态栏的勇士图标", 
          "!type": "fn(name: string)"
        }, 
        "setMusicBtn": {
          "!doc": "设置音乐图标的显隐状态", 
          "!type": "fn()"
        }, 
        "isPlaying": {
          "!doc": "游戏是否已经开始", 
          "!type": "fn() -> bool"
        }, 
        "triggerBgm": {
          "!doc": "更改背景音乐的播放", 
          "!type": "fn()"
        }, 
        "moveHero": {
          "!doc": "连续前进，不撞南墙不回头<br/>例如：core.moveHero(); // 连续前进<br/>direction: 可选，如果设置了就会先转身到该方向<br/>callback: 可选，如果设置了就只走一步", 
          "!type": "fn(direction?: string, callback?: fn())"
        }, 
        "getRealStatusOrDefault": {
          "!doc": "从status中获得实际属性（增幅后的），如果不存在则从勇士属性中获取", 
          "!type": "fn(status?: ?, name?: string)"
        }, 
        "removeSave": {
          "!doc": "删除某个存档", 
          "!type": "fn(index?: number, callback?: fn())"
        }, 
        "registerAnimationFrame": {
          "!doc": "注册一个 animationFrame<br/>name: 名称，可用来作为注销使用<br/>needPlaying: 是否只在游戏运行时才执行（在标题界面不执行）<br/>func: 要执行的函数，或插件中的函数名；可接受timestamp（从页面加载完毕到当前所经过的时间）作为参数", 
          "!type": "fn(name: string, needPlaying: bool, func?: fn(timestamp: number))"
        }, 
        "getHeroLoc": {
          "!doc": "读取主角的位置和/或朝向<br/>例如：core.getHeroLoc(); // 读取主角的位置和朝向<br/>name: 要读取横坐标还是纵坐标还是朝向还是都读取<br/>返回值：name ? core.status.hero.loc[name] : core.status.hero.loc", 
          "!type": "fn(name: string) -> string|number"
        },
        "stopAutomaticRoute": {
          "!doc": "停止自动寻路操作", 
          "!type": "fn()"
        }, 
        "setWeather": {
          "!doc": "设置天气，不计入存档。如需长期生效请使用core.events._action_setWeather()函数<br/>例如：core.setWeather('fog', 10); // 设置十级大雾天<br/>type: 新天气的类型，不填视为晴天<br/>level: 新天气（晴天除外）的级别，必须为不大于10的正整数，不填视为5", 
          "!type": "fn(type?: string, level?: number)"
        }, 
        "updateStatusBar": {
          "!doc": "立刻刷新状态栏和地图显伤", 
          "!type": "fn()"
        }, 
        "autosave": {
          "!doc": "自动存档", 
          "!type": "fn(removeLast?: bool)"
        }, 
        "clearStatusBar": {
          "!doc": "清空状态栏", 
          "!type": "fn()"
        }, 
        "moveAction": {
          "!doc": "尝试前进一步，如果面前不可被踏入就会直接触发该点事件<br/>例如：core.moveAction(core.doAction); // 尝试前进一步，然后继续事件处理。常用于在事件流中让主角像自由行动时一样前进一步，可以照常触发moveOneStep（跑毒和计步）和面前的事件（包括但不限于阻激夹域捕）<br/>callback: 走一步后的回调函数，可选", 
          "!type": "fn(callback?: fn())"
        }, 
        "hasFlag": {
          "!doc": "判定一个flag变量是否存在且不为false、0、''、null、undefined和NaN<br/>例如：core.hasFlag('poison'); // 判断主角当前是否中毒<br/>name: 变量名，支持中文<br/>此函数等价于 !!core.getFlag(name)", 
          "!type": "fn(name: string) -> bool"
        }, 
        "rewindReplay": {
          "!doc": "回退", 
          "!type": "fn()"
        }, 
        "toolboxReplay": {
          "!doc": "回放录像时打开道具栏", 
          "!type": "fn()"
        }, 
        "playBgm": {
          "!doc": "播放背景音乐，中途开播但不计入存档且只会持续到下次场景切换。如需长期生效请将背景音乐的文件名赋值给flags.__bgm__<br/>例如：core.playBgm('bgm.mp3', 30); // 播放bgm.mp3，并跳过前半分钟<br/>bgm: 背景音乐的文件名，支持全塔属性中映射前的中文名<br/>startTime: 跳过前多少秒，不填则不跳过", 
          "!type": "fn(bgm: string, startTime?: number)"
        }, 
        "isReplaying": {
          "!doc": "是否正在播放录像", 
          "!type": "fn() -> bool"
        }, 
        "isMoving": {
          "!doc": "当前是否正在移动", 
          "!type": "fn() -> bool"
        }, 
        "getSaveIndexes": {
          "!doc": "获得所有存在存档的存档位", 
          "!type": "fn(callback?: fn())"
        }, 
        "unLockControl": {
          "!doc": "解锁状态栏", 
          "!type": "fn()"
        }, 
        "syncSave": {
          "!doc": "同步存档到服务器", 
          "!type": "fn(type?: string)"
        }, 
        "removeFlag": {
          "!doc": "删除某个flag/变量", 
          "!type": "fn(name: string)"
        }, 
        "registerResize": {
          "!doc": "注册一个resize函数<br/>name: 名称，可供注销使用<br/>func: 可以是一个函数，或者是插件中的函数名；可以接受obj参数，详见resize函数。", 
          "!type": "fn(name: string, func: fn(obj: ?))"
        }, 
        "stopReplay": {
          "!doc": "停止播放", 
          "!type": "fn(force?: bool)"
        }, 
        "bookReplay": {
          "!doc": "回放时查看怪物手册", 
          "!type": "fn()"
        }, 
        "turnHero": {
          "!doc": "主角转向并计入录像，不会导致跟随者聚集，会导致视野重置到以主角为中心<br/>例如：core.turnHero(); // 主角顺时针旋转90°，即单击主角或按下Z键的效果<br/>direction: 主角的新朝向，可选", 
          "!type": "fn(direction?: string)"
        }, 
        "resumeReplay": {
          "!doc": "恢复播放", 
          "!type": "fn()"
        }, 
        "resize": {
          "!doc": "屏幕分辨率改变后重新自适应", 
          "!type": "fn()"
        }, 
        "equipboxReplay": {
          "!doc": "回放录像时打开装备栏", 
          "!type": "fn()"
        }, 
        "getSave": {
          "!doc": "获得某个存档内容", 
          "!type": "fn(index?: number, callback?: fn(data: ?))"
        }, 
        "setViewport": {
          "!doc": "设置视野范围", 
          "!type": "fn(x?: number, y?: number)"
        }, 
        "chooseReplayFile": {
          "!doc": "选择录像文件", 
          "!type": "fn()"
        }, 
        "lockControl": {
          "!doc": "锁定状态栏，常常用于事件处理", 
          "!type": "fn()"
        }, 
        "updateCheckBlock": {
          "!doc": "更新领域、夹击、阻击的伤害地图", 
          "!type": "fn(floorId?: string)"
        }, 
        "checkBlock": {
          "!doc": "检查并执行领域、夹击、阻击事件", 
          "!type": "fn()"
        }, 
        "clearAutomaticRouteNode": {
          "!doc": "清除自动寻路路线", 
          "!type": "fn(x?: number, y?: number)"
        }, 
        "getFlag": {
          "!doc": "读取一个flag变量<br/>name: 变量名，支持中文<br/>defaultValue: 当变量不存在时的返回值，可选（事件流中默认填0）。", 
          "!type": "fn(name: string, defaultValue?: ?)"
        }, 
        "getNakedStatus": {
          "!doc": "获得勇士原始属性（无装备和衰弱影响）", 
          "!type": "fn(name: string)"
        }, 
        "nearHero": {
          "!doc": "判定主角是否身处某个点的锯齿领域(即曼哈顿距离)<br/>例如：core.nearHero(6, 6, 6); // 判定主角是否身处点（6，6）的半径为6的锯齿领域<br/>x: 领域的中心横坐标<br/>y: 领域的中心纵坐标<br/>n: 领域的半径，不填视为1", 
          "!type": "fn(x: number, y: number, n?: number) -> bool"
        }, 
        "stepReplay": {
          "!doc": "单步播放", 
          "!type": "fn()"
        }, 
        "hasSave": {
          "!doc": "判断某个存档位是否存在存档", 
          "!type": "fn(index?: number) -> bool"
        }, 
        "showStartAnimate": {
          "!doc": "进入标题画面<br/>例如：core.showStartAnimate(); // 重启游戏但不重置bgm<br/>noAnimate: 可选，true表示不由黑屏淡入而是立即亮屏<br/>callback: 可选，完全亮屏后的回调函数", 
          "!type": "fn(noAnimate?: bool, callback?: fn())"
        }, 
        "moveViewport": {
          "!doc": "移动视野范围", 
          "!type": "fn(steps?: ?, time?: number, callback?: fn())"
        }, 
        "syncLoad": {
          "!doc": "从服务器加载存档", 
          "!type": "fn()"
        }, 
        "setHeroMoveInterval": {
          "!doc": "设置行走的效果动画", 
          "!type": "fn(callback?: fn())"
        }, 
        "registerReplayAction": {
          "!doc": "注册一个录像行为<br/>name: 自定义名称，可用于注销使用<br/>func: 具体执行录像的函数，可为一个函数或插件中的函数名；<br/>需要接受一个action参数，代表录像回放时的下一个操作<br/>func返回true代表成功处理了此录像行为，false代表没有处理此录像行为。", 
          "!type": "fn(name: string, func: fn(action?: string) -> bool)"
        }, 
        "checkAutosave": {
          "!doc": "实际将自动存档写入存储", 
          "!type": "fn()"
        }, 
        "resumeBgm": {
          "!doc": "恢复背景音乐的播放", 
          "!type": "fn(resumeTime?: number)"
        }, 
        "setGameCanvasTranslate": {
          "!doc": "设置大地图的偏移量", 
          "!type": "fn(ctx: string|CanvasRenderingContext2D, x: number, y: number)"
        }, 
        "checkBgm": {
          "!doc": "检查bgm状态", 
          "!type": "fn()"
        }, 
        "speedDownReplay": {
          "!doc": "减速播放", 
          "!type": "fn()"
        }, 
        "getRealStatus": {
          "!doc": "计算主角的某个属性，包括百分比修正<br/>例如：core.getRealStatus('atk'); // 计算主角的攻击力，包括百分比修正。战斗使用的就是这个值<br/>name: 属性的英文名，请注意只能用于数值类属性哦，否则乘法会得到NaN", 
          "!type": "fn(name: string)"
        }, 
        "saveData": {
          "!doc": "存档到本地", 
          "!type": "fn()"
        }, 
        "unregisterAnimationFrame": {
          "!doc": "注销一个animationFrame", 
          "!type": "fn(name: string)"
        }, 
        "tryMoveDirectly": {
          "!doc": "尝试瞬移，如果该点有图块/事件/阻激夹域捕则会瞬移到它旁边再走一步（不可踏入的话当然还是触发该点事件），这一步的方向优先和瞬移前主角的朝向一致<br/>例如：core.tryMoveDirectly(6, 0); // 尝试瞬移到地图顶部的正中央，以样板0层为例，实际效果是瞬移到了上楼梯下面一格然后向上走一步并触发上楼事件<br/>destX: 目标点的横坐标<br/>destY: 目标点的纵坐标", 
          "!type": "fn(destX: number, destY: number)"
        }, 
        "moveDirectly": {
          "!doc": "瞬间移动", 
          "!type": "fn(destX?: number, destY?: number, ignoreSteps?: number)"
        }
      }, 
      "icons": {
        "!doc": "图标信息",
        "getTilesetOffset": {
          "!doc": "根据图块数字或ID获得所在的tileset和坐标信息", 
          "!type": "fn(id?: string) -> {image: ?, x: number, y: number}"
        }, 
        "getClsFromId": {
          "!doc": "根据ID获得其图标类型", 
          "!type": "fn(id?: string) -> string"
        }, 
        "getAllIconIds": {
          "!doc": "获得所有图标的ID", 
          "!type": "fn() -> [string]"
        }, 
        "getIcons": {
          "!doc": "获得所有图标类型", 
          "!type": "fn()"
        }
      }, 
      "items": {
        "!doc": "道具相关的函数",
        "getEquip": {
          "!doc": "检查主角某种类型的装备目前是什么<br/>例如：core.getEquip(1) // 主角目前装备了什么盾牌<br/>equipType: 装备类型，自然数<br/>返回值：装备id，null表示未穿戴", 
          "!type": "fn(equipType: number) -> string"
        }, 
        "loadEquip": {
          "!doc": "尝试穿上某件装备并提示<br/>例如：core.loadEquip('sword5') // 尝试装备上神圣剑，无回调<br/>equipId: 装备id<br/>callback: 穿戴成功或失败后的回调函数", 
          "!type": "fn(equipId: string, callback?: fn())"
        }, 
        "itemCount": {
          "!doc": "统计某种道具的持有量<br/>例如：core.itemCount('yellowKey') // 持有多少把黄钥匙<br/>itemId: 道具id<br/>返回值：该种道具的持有量，不包括已穿戴的装备", 
          "!type": "fn(itemId: string) -> number"
        }, 
        "getItems": {
          "!doc": "获得所有道具", 
          "!type": "fn()"
        }, 
        "canUseItem": {
          "!doc": "检查能否使用某种道具<br/>例如：core.canUseItem('pickaxe') // 能否使用破墙镐<br/>itemId: 道具id<br/>返回值：true表示可以使用", 
          "!type": "fn(itemId: string) -> bool"
        }, 
        "hasItem": {
          "!doc": "检查主角是否持有某种道具(不包括已穿戴的装备)<br/>例如：core.hasItem('yellowKey') // 主角是否持有黄钥匙<br/>itemId: 道具id<br/>返回值：true表示持有", 
          "!type": "fn(itemId: string) -> bool"
        }, 
        "addItem": {
          "!doc": "静默增减某种道具的持有量 不会更新游戏画面或是显示提示<br/>例如：core.addItem('yellowKey', -2) // 没收两把黄钥匙<br/>itemId: 道具id<br/>itemNum: 增加量，负数表示没收", 
          "!type": "fn(itemId: string, itemNum?: number)"
        }, 
        "unloadEquip": {
          "!doc": "脱下某个类型的装备<br/>例如：core.unloadEquip(1) // 卸下盾牌，无回调<br/>equipType: 装备类型编号，自然数<br/>callback: 卸下装备后的回调函数", 
          "!type": "fn(equipType: number, callback?: fn())"
        }, 
        "quickLoadEquip": {
          "!doc": "快速换装<br/>例如：core.quickLoadEquip(1) // 快速换上1号套装<br/>index: 套装编号，自然数", 
          "!type": "fn(index: number)"
        }, 
        "getItemEffect": {
          "!doc": "即捡即用类的道具获得时的效果<br/>例如：core.getItemEffect('redPotion', 10) // 执行获得10瓶红血的效果<br/>itemId: 道具id<br/>itemNum: 道具数量，可选，默认为1", 
          "!type": "fn(itemId: string, itemNum?: number)"
        }, 
        "quickSaveEquip": {
          "!doc": "保存当前套装<br/>例如：core.quickSaveEquip(1) // 将当前套装保存为1号套装<br/>index: 套装编号，自然数", 
          "!type": "fn(index: number)"
        }, 
        "setItem": {
          "!doc": "设置某种道具的持有量<br/>例如：core.setItem('shoes') // 没收绿鞋，重新启用passNet触发器<br/>itemId: 道具id<br/>itemNum: 新的持有量，可选，自然数，默认为0", 
          "!type": "fn(itemId: string, itemNum?: number)"
        }, 
        "compareEquipment": {
          "!doc": "比较两件（类型可不同）装备的优劣<br/>例如：core.compareEquipment('sword5', 'shield5') // 比较神圣剑和神圣盾的优劣<br/>compareEquipId: 装备甲的id<br/>beComparedEquipId: 装备乙的id<br/>返回值：两装备的各属性差，甲减乙，0省略", 
          "!type": "fn(compareEquipId: string, beComparedEquipId: string) -> {value: ?, percentage: ?}"
        }, 
        "removeItem": {
          "!doc": "删除某个物品", 
          "!type": "fn(itemId?: string, itemNum?: number)"
        }, 
        "getEquipTypeById": {
          "!doc": "判定某件装备的类型<br/>例如：core.getEquipTypeById('shield5') // 1（盾牌）<br/>equipId: 装备id<br/>返回值：类型编号，自然数", 
          "!type": "fn(equipId: string) -> number"
        }, 
        "getEquipTypeByName": {
          "!doc": "根据类型获得一个可用的装备孔", 
          "!type": "fn(name?: string)"
        }, 
        "useItem": {
          "!doc": "使用一个道具<br/>例如：core.useItem('pickaxe', true) // 使用破墙镐，不计入录像，无回调<br/>itemId: 道具id<br/>noRoute: 是否不计入录像，快捷键使用的请填true，否则可省略<br/>callback: 道具使用完毕或使用失败后的回调函数", 
          "!type": "fn(itemId: string, noRoute?: bool, callback?: fn())"
        }, 
        "hasEquip": {
          "!doc": "检查主角是否穿戴着某件装备<br/>例如：core.hasEquip('sword5') // 主角是否装备了神圣剑<br/>itemId: 装备id<br/>返回值：true表示已装备", 
          "!type": "fn(itemId: string) -> bool"
        }, 
        "getItemEffectTip": {
          "!doc": "即捡即用类的道具获得时的额外提示<br/>例如：core.getItemEffectTip(redPotion) // （获得 红血瓶）'，生命+100'<br/>itemId: 道具id<br/>返回值：图块属性itemEffectTip的内容", 
          "!type": "fn(itemId: string) -> string"
        }, 
        "canEquip": {
          "!doc": "检查能否穿上某件装备<br/>例如：core.canEquip('sword5', true) // 主角可以装备神圣剑吗，如果不能会有提示<br/>equipId: 装备id<br/>hint: 无法穿上时是否提示（比如是因为未持有还是别的什么原因）<br/>返回值：true表示可以穿上，false表示无法穿上", 
          "!type": "fn(equipId: string, hint?: bool) -> bool"
        }
      }, 
      "utils": {
        "!doc": "工具类函数",
        "scan": {
          "!doc": "朝向到x,y映射",
          "up": {
            "x": "number",
            "y": "number"
          },
          "down": {
            "x": "number",
            "y": "number"
          },
          "left": {
            "x": "number",
            "y": "number"
          },
          "right": {
            "x": "number",
            "y": "number"
          },
        },
        "clamp": {
          "!doc": "将x限定在[a,b]区间内，注意a和b可交换<br/>例如：core.clamp(1200, 1, 1000); // 1000<br/>x: 原始值，!x为true时x一律视为0<br/>a: 下限值，大于b将导致与b交换<br/>b: 上限值，小于a将导致与a交换", 
          "!type": "fn(x: number, a: number, b: number) -> number"
        }, 
        "rand": {
          "!doc": "不支持SL的随机数<br/>例如：1 + core.rand(6); // 随机生成一个小于7的正整数，模拟骰子的效果<br/>num: 填正数表示生成小于num的随机自然数，否则生成小于1的随机正数<br/>返回值：随机数，即使读档也不会改变结果", 
          "!type": "fn(num?: number) -> number"
        }, 
        "clone": {
          "!doc": "深拷贝一个对象(函数将原样返回)<br/>例如：core.clone(core.status.hero, (name, value) => (name == 'items' || typeof value == 'number'), false); // 深拷贝主角的属性和道具<br/>data: 待拷贝对象<br/>filter: 过滤器，可选，表示data为数组或对象时拷贝哪些项或属性，true表示拷贝<br/>recursion: 过滤器是否递归，可选。true表示过滤器也被递归<br/>返回值：拷贝的结果，注意函数将原样返回", 
          "!type": "fn(data?: ?, filter?: fn(name: string, value: ?) -> bool, recursion?: bool)"
        }, 
        "setLocalForage": {
          "!doc": "往数据库写入一段数据", 
          "!type": "fn(key: string, value?: ?, successCallback?: fn(), errorCallback?: fn())"
        }, 
        "getGlobal": {
          "!doc": "读取一个全局存储，适用于global:xxx，支持录像。<br/>例如：if (core.getGlobal('一周目已通关', false) === true) core.getItem('dagger'); // 二周目游戏进行到此处时会获得一把屠龙匕首<br/>key: 全局变量名称，支持中文<br/>defaultValue: 可选，当此全局变量不存在或值为null、undefined时，用此值代替<br/>返回值：全局变量的值", 
          "!type": "fn(key: string, defaultValue?: ?)"
        }, 
        "replaceText": {
          "!doc": "将一段文字中的${}（表达式）进行替换。<br/>例如：core.replaceText('衬衫的价格是${status:hp}镑${item:yellowKey}便士。'); // 把主角的生命值和持有的黄钥匙数量代入这句话<br/>text: 模板字符串，可以使用${}计算js表达式，支持“状态、物品、变量、独立开关、全局存储、图块id、图块类型、敌人数据、装备id”等量参与运算<br/>返回值：替换完毕后的字符串", 
          "!type": "fn(text: string, prefix?: string) -> string"
        }, 
        "removeLocalStorage": {
          "!doc": "移除本地存储", 
          "!type": "fn(key: string)"
        }, 
        "unzip": {
          "!doc": "解压一段内容", 
          "!type": "fn(blobOrUrl?: ?, success?: fn(data: ?), error?: fn(error: string), convertToText?: bool, onprogress?: fn(loaded: number, total: number))"
        }, 
        "formatTime": {
          "!doc": "格式化时间", 
          "!type": "fn(time: number) -> string"
        }, 
        "readFile": {
          "!doc": "尝试请求读取一个本地文件内容 [异步]<br/>success: 成功后的回调<br/>error: 失败后的回调<br/>readType: 不设置则以文本读取，否则以DataUrl形式读取", 
          "!type": "fn(success?: fn(data: string), error?: fn(message: string), readType?: bool)"
        }, 
        "readFileContent": {
          "!doc": "文件读取完毕后的内容处理 [异步]", 
          "!type": "fn(content: string)"
        }, 
        "formatDate": {
          "!doc": "格式化日期为字符串", 
          "!type": "fn(date: ?) -> string"
        }, 
        "download": {
          "!doc": "弹窗请求下载一个文本文件<br/>例如：core.download('route.txt', JSON.stringify(core.status.route)); // 弹窗请求下载录像<br/>filename: 文件名<br/>content: 文件内容", 
          "!type": "fn(filename: string, content: string)"
        }, 
        "encodeBase64": {
          "!doc": "base64加密<br/>例如：core.encodeBase64('abcd'); // 'YWJjZA=='<br/>str: 明文<br/>返回值：密文", 
          "!type": "fn(str: string) -> string"
        }, 
        "strlen": {
          "!doc": "求字符串的国标码字节数，也可用于等宽字体下文本的宽度测算。请注意样板的默认字体Verdana不是等宽字体<br/>例如：core.strlen('无敌ad'); // 6<br/>str: 待测字符串<br/>返回值：字符串的国标码字节数，每个汉字为2，每个ASCII字符为1", 
          "!type": "fn(str: string) -> number"
        }, 
        "myprompt": {
          "!doc": "让用户输入一段文字", 
          "!type": "fn(hint: string, value: string, callback?: fn(data?: string))"
        }, 
        "getCookie": {
          "!doc": "访问浏览器cookie", 
          "!type": "fn(name: string) -> string"
        }, 
        "decodeRoute": {
          "!doc": "录像解压的最后一步，即一压的逆过程<br/>例如：core.decodeRoute(core.encodeRoute(core.status.route)); // 一压当前录像再解压-_-|<br/>route: 录像解压倒数第二步的结果，即一压的结果<br/>返回值：原始录像", 
          "!type": "fn(route: string) -> [string]"
        }, 
        "formatDate2": {
          "!doc": "格式化日期为最简字符串", 
          "!type": "fn(date: ?) -> string"
        }, 
        "unshift": {
          "!doc": "将b（可以是另一个数组）插入数组a的开头，此函数用于弥补a.unshift(b)中b只能是单项的不足。<br/>例如：core.unshift(todo, {type: 'unfollow'}); // 在事件指令数组todo的开头插入“取消所有跟随者”指令<br/>a: 原数组<br/>b: 待插入的新首项或前缀数组<br/>返回值：插入完毕后的新数组，它是改变原数组a本身得到的", 
          "!type": "fn(a: [?], b: ?) -> [?]"
        }, 
        "same": {
          "!doc": "判定深层相等, 会逐层比较每个元素<br/>例如：core.same(['1', 2], ['1', 2]); // true", 
          "!type": "fn(a?: ?, b?: ?) -> bool"
        }, 
        "setTwoDigits": {
          "!doc": "两位数显示", 
          "!type": "fn(x: number) -> string"
        }, 
        "splitImage": {
          "!doc": "等比例切分一张图片<br/>例如：core.splitImage(core.material.images.images['npc48.png'], 32, 48); // 把npc48.png切分成若干32×48px的小人<br/>image: 图片名（支持映射前的中文名）或图片对象（参见上面的例子），获取不到时返回[]<br/>width: 子图的宽度，单位为像素。原图总宽度必须是其倍数，不填视为32<br/>height: 子图的高度，单位为像素。原图总高度必须是其倍数，不填视为正方形<br/>返回值：子图组成的数组，在原图中呈先行后列，从左到右、从上到下排列。", 
          "!type": "fn(image?: string|image, width?: number, height?: number) -> [image]"
        }, 
        "decompress": {
          "!doc": "解压缩一个数据", 
          "!type": "fn(value: ?)"
        }, 
        "showWithAnimate": {
          "!doc": "动画显示某对象", 
          "!type": "fn(obj?: ?, speed?: number, callback?: fn())"
        }, 
        "subarray": {
          "!doc": "判定一个数组是否为另一个数组的前缀，用于录像接续播放。请注意函数名没有大写字母<br/>例如：core.subarray(['ad', '米库', '小精灵', '小破草', '小艾'], ['ad', '米库', '小精灵']); // ['小破草', '小艾']<br/>a: 可能的母数组，不填或比b短将返回null<br/>b: 可能的前缀，不填或比a长将返回null<br/>返回值：如果b不是a的前缀将返回null，否则将返回a去掉此前缀后的剩余数组", 
          "!type": "fn(a?: [?], b?: [?]) -> [?]|null"
        }, 
        "turnDirection": {
          "!doc": "转向某方向<br/>turn: 转向的方向，可为 up,down,left,right,:left,:right,:back 七种<br/>direction: 当前方向", 
          "!type": "fn(turn: string, direction?: string) -> string"
        }, 
        "myconfirm": {
          "!doc": "显示确认框，类似core.drawConfirmBox()<br/>例如：core.myconfirm('重启游戏？', core.restart); // 弹窗询问玩家是否重启游戏<br/>hint: 弹窗的内容<br/>yesCallback: 确定后的回调函数<br/>noCallback: 取消后的回调函数，可选", 
          "!type": "fn(hint: string, yesCallback?: fn(), noCallback?: fn())"
        }, 
        "calValue": {
          "!doc": "计算一个表达式的值，支持status:xxx等的计算。<br/>例如：core.calValue('status:hp + status:def'); // 计算主角的生命值加防御力<br/>value: 待求值的表达式<br/>prefix: 独立开关前缀，一般可省略<br/>返回值：求出的值", 
          "!type": "fn(value: string, prefix?: string)"
        }, 
        "encodeRoute": {
          "!doc": "录像压缩缩<br/>例如：core.encodeRoute(core.status.route); // 压缩当前录像<br/>route: 原始录像，自定义内容（不予压缩，原样写入）必须由0-9A-Za-z和下划线、冒号组成，所以中文和数组需要用JSON.stringify预处理再base64压缩才能交由一压<br/>返回值：一压的结果", 
          "!type": "fn(route: [string]) -> string"
        }, 
        "decodeBase64": {
          "!doc": "base64解密<br/>例如：core.decodeBase64('YWJjZA=='); // \"abcd\"<br/>str: 密文<br/>返回值：明文", 
          "!type": "fn(str: string) -> string"
        }, 
        "http": {
          "!doc": "发送一个HTTP请求 [异步]<br/>type: 请求类型，只能为GET或POST<br/>url: 目标地址<br/>formData: 如果是POST请求则为表单数据<br/>success: 成功后的回调<br/>error: 失败后的回调", 
          "!type": "fn(type: string, url: string, formData: ?, success?: fn(data: string), error?: fn(message: string), mimeType?: string, responseType?: string, onprogress?: fn(loaded: number, total: number))"
        }, 
        "getLocalStorage": {
          "!doc": "获得本地存储", 
          "!type": "fn(key: string, defaultValue?: ?)"
        }, 
        "arrayToRGB": {
          "!doc": "颜色数组转字符串<br/>例如：core.arrayToRGBA([102, 204, 255]); // \"rgba(102,204,255,1)\"<br/>color: 一行三列或一行四列的数组，前三个元素必须为不大于255的自然数。第四个元素（如果有）必须为0或不大于1的数字，第四个元素不填视为1<br/>返回值：该颜色的字符串表示", 
          "!type": "fn(color: [number]) -> string"
        }, 
        "formatBigNumber": {
          "!doc": "大数字格式化，单位为10000的倍数（w,e,z,j,g），末尾四舍五入<br/>例如：core.formatBigNumber(123456789, false); // \"12346w\"<br/>x: 原数字<br/>onMap: 可选，true表示用于地图显伤，结果总字符数最多为5，否则最多为6<br/>返回值：格式化结果", 
          "!type": "fn(x: number, onMap?: bool) -> string"
        }, 
        "removeLocalForage": {
          "!doc": "移除本地数据库的数据", 
          "!type": "fn(key: string, successCallback?: fn(), errorCallback?: fn())"
        }, 
        "matchWildcard": {
          "!doc": "通配符匹配，用于搜索图块等批量处理。<br/>例如：core.playSound(core.matchWildcard('*Key', itemId) ? 'item.mp3' : 'door.mp3'); // 判断捡到的是钥匙还是别的道具，从而播放不同的音效<br/>pattern: 模式串，每个星号表示任意多个（0个起）字符<br/>string: 待测串<br/>返回值：true表示匹配成功，false表示匹配失败", 
          "!type": "fn(pattern: string, string: string) -> bool"
        }, 
        "setLocalStorage": {
          "!doc": "设置本地存储", 
          "!type": "fn(key: string, value?: ?)"
        }, 
        "hideWithAnimate": {
          "!doc": "动画使某对象消失", 
          "!type": "fn(obj?: ?, speed?: number, callback?: fn())"
        }, 
        "copy": {
          "!doc": "尝试复制一段文本到剪切板。", 
          "!type": "fn(data: string) -> bool"
        }, 
        "isset": {
          "!doc": "判断一个值是否不为null，undefined和NaN<br/>例如：core.isset(0/0); // false，因为0/0等于NaN<br/>v: 待测值，可选<br/>返回值：false表示待测值为null、undefined、NaN或未填写，true表示为其他值。", 
          "!type": "fn(v?: ?) -> bool"
        }, 
        "replaceValue": {
          "!doc": "对一个表达式中的特殊规则进行替换，如status:xxx等。<br/>例如：core.replaceValue('status:atk+item:yellowKey'); // 把这两个冒号表达式替换为core.getStatus('hp')和core.itemCount('yellowKey')这样的函数调用<br/>value: 模板字符串，注意独立开关不会被替换<br/>返回值：替换完毕后的字符串", 
          "!type": "fn(value: string) -> string"
        }, 
        "getLocalForage": {
          "!doc": "从本地数据库读出一段数据", 
          "!type": "fn(key: string, defaultValue?: ?, successCallback?: fn(data: ?), errorCallback?: fn())"
        }, 
        "inArray": {
          "!doc": "判定array是不是一个数组，以及element是否在该数组中。<br/>例如：core.inArray(core.material.enemys.greenSlime.special, 1); // 判定绿头怪除先攻外还有无其他特殊属性<br/>array: 可能的数组，不为数组或不填将导致返回值为false<br/>element: 待查找的元素<br/>返回值：如果array为数组且具有element这项，就返回true，否则返回false", 
          "!type": "fn(array?: ?, element?: ?) -> bool"
        }, 
        "setGlobal": {
          "!doc": "设置一个全局存储，适用于global:xxx，录像播放时将忽略此函数。<br/>例如：core.setBlobal('一周目已通关', true); // 设置全局存储“一周目已通关”为true，方便二周目游戏中的新要素。<br/>key: 全局变量名称，支持中文<br/>value: 全局变量的新值，不填或null表示清除此全局存储", 
          "!type": "fn(key: string, value?: ?)"
        }, 
        "rand2": {
          "!doc": "支持SL的随机数，并计入录像<br/>例如：1 + core.rand2(6); // 随机生成一个小于7的正整数，模拟骰子的效果<br/>num: 正整数，0或不填会被视为2147483648<br/>返回值：属于 [0, num) 的随机数", 
          "!type": "fn(num?: number) -> number"
        }, 
        "setStatusBarInnerHTML": {
          "!doc": "填写非自绘状态栏<br/>例如：core.setStatusBarInnerHTML('hp', core.status.hero.hp, 'color: #66CCFF'); // 更新状态栏中的主角生命，使用加载画面的宣传色<br/>name: 状态栏项的名称，如'hp', 'atk', 'def'等。必须是core.statusBar中的一个合法项<br/>value: 要填写的内容，大数字会被格式化为至多6个字符，无中文的内容会被自动设为斜体<br/>css: 额外的css样式，可选。如更改颜色等", 
          "!type": "fn(name: string, value: ?, css?: string)"
        }, 
        "matchRegex": {
          "!doc": "是否满足正则表达式", 
          "!type": "fn(pattern: string, string: string) -> string"
        }, 
        "push": {
          "!doc": "将b（可以是另一个数组）插入数组a的末尾，此函数用于弥补a.push(b)中b只能是单项的不足。<br/>例如：core.push(todo, {type: 'unfollow'}); // 在事件指令数组todo的末尾插入“取消所有跟随者”指令<br/>a: 原数组<br/>b: 待插入的新末项或后缀数组<br/>返回值：插入完毕后的新数组，它是改变原数组a本身得到的", 
          "!type": "fn(a: [?], b: ?) -> [?]"
        }, 
        "formatSize": {
          "!doc": "格式化文件大小", 
          "!type": "fn(size: number) -> string"
        }
      }, 
      "actions": {
        "!doc": "用户操作相关的函数",
        "onup": {
          "!doc": "当点击（触摸）事件放开时", 
          "!type": "fn(loc: {x: number, y: number, size: number})"
        }, 
        "pressKey": {
          "!doc": "按住某个键时", 
          "!type": "fn(keyCode: number)"
        }, 
        "keyUp": {
          "!doc": "根据放开键的code来执行一系列操作", 
          "!type": "fn(keyCode: number, altKey?: bool, fromReplay?: bool)"
        }, 
        "ondown": {
          "!doc": "点击（触摸）事件按下时", 
          "!type": "fn(loc: {x: number, y: number, size: number})"
        }, 
        "registerAction": {
          "!doc": "此函数将注册一个用户交互行为。<br/>action: 要注册的交互类型，如 ondown, onclick, keyDown 等等。<br/>name: 你的自定义名称，可被注销使用；同名重复注册将后者覆盖前者。<br/>func: 执行函数。<br/>如果func返回true，则不会再继续执行其他的交互函数；否则会继续执行其他的交互函数。<br/>priority: 优先级；优先级高的将会被执行。此项可不填，默认为0", 
          "!type": "fn(action: string, name: string, func: string|fn(params: ?), priority?: number)"
        }, 
        "onkeyDown": {
          "!doc": "按下某个键时", 
          "!type": "fn(e: Event)"
        }, 
        "keyDown": {
          "!doc": "根据按下键的code来执行一系列操作", 
          "!type": "fn(keyCode: number)"
        }, 
        "onStatusBarClick": {
          "!doc": "点击自绘状态栏时", 
          "!type": "fn(e?: Event)"
        }, 
        "longClick": {
          "!doc": "长按", 
          "!type": "fn(x: number, y: number, fromEvent?: bool)"
        }, 
        "unregisterAction": {
          "!doc": "注销一个用户交互行为", 
          "!type": "fn(action: string, name: string)"
        }, 
        "keyDownCtrl": {
          "!doc": "长按Ctrl键时", 
          "!type": "fn() -> bool"
        }, 
        "onclick": {
          "!doc": "具体点击屏幕上(x,y)点时，执行的操作", 
          "!type": "fn(x: number, y: number, stepPostfix?: ?)"
        }, 
        "doRegisteredAction": {
          "!doc": "执行一个用户交互行为", 
          "!type": "fn(action: string, params: ?)"
        }, 
        "onkeyUp": {
          "!doc": "放开某个键时", 
          "!type": "fn(e: Event)"
        }, 
        "onmousewheel": {
          "!doc": "滑动鼠标滚轮时的操作", 
          "!type": "fn(direct: number)"
        }, 
        "onmove": {
          "!doc": "当在触摸屏上滑动时", 
          "!type": "fn(loc: {x: number, y: number, size: number})"
        }
      }, 
      "loader": {
        "!doc": "资源加载相关的函数",
        "loadImages": {
          "!doc": "加载一系列图片", 
          "!type": "fn(dir: string, names: [string], toSave: ?, callback?: fn()) "
        }, 
        "loadImagesFromZip": {
          "!doc": "从zip中加载一系列图片", 
          "!type": "fn(url: string, names: [string], toSave?: ?, onprogress?: ?, onfinished?: ?)"
        }, 
        "loadBgm": {
          "!doc": "加载一个bgm", 
          "!type": "fn(name: string)"
        }, 
        "loadOneMusic": {
          "!doc": "加载一个音乐或音效", 
          "!type": "fn(name: string)"
        }, 
        "freeBgm": {
          "!doc": "释放一个bgm的缓存", 
          "!type": "fn(name: string)"
        }, 
        "loadOneSound": {
          "!doc": "加载一个音效", 
          "!type": "fn(name: string)"
        }, 
        "loadImage": {
          "!doc": "加载某一张图片", 
          "!type": "fn(dir: name, imgName: name, callback?: fn())"
        }
      }, 
      "maps": {
        "!doc": "地图处理相关的函数",
        "noPass": {
          "!doc": "判定某个点是否不可被踏入（不基于主角生命值和图块cannotIn属性）<br/>例如：core.noPass(0, 0); // 判断地图左上角能否被踏入<br/>x: 目标点的横坐标<br/>y: 目标点的纵坐标<br/>floorId: 目标点所在的地图id，不填视为当前地图<br/>返回值：true表示可踏入", 
          "!type": "fn(x: number, y: number, floorId?: string) -> bool"
        }, 
        "drawAnimate": {
          "!doc": "播放动画，注意即使指定了主角的坐标也不会跟随主角移动，如有需要请使用core.drawHeroAnimate(name, callback)函数<br/>例如：core.drawAnimate('attack', core.nextX(), core.nextY(), core.vibrate); // 在主角面前一格播放普攻动画，动画停止后视野左右抖动1秒<br/>name: 动画文件名，不含后缀<br/>x: 绝对横坐标<br/>y: 绝对纵坐标<br/>callback: 动画停止后的回调函数，可选<br/>返回值：一个数字，可作为core.stopAnimate()的参数来立即停止播放（届时还可选择是否执行此次播放的回调函数）", 
          "!type": "fn(name: string, x: number, y: number, alignWindow: bool, callback?: fn()) -> number"
        }, 
        "getBlockCls": {
          "!doc": "判定某个点的图块类型<br/>例如：if(core.getBlockCls(x1, y1) != 'enemys' && core.getBlockCls(x2, y2) != 'enemy48') core.openDoor(x3, y3); // 另一个简单的机关门事件，打败或炸掉这一对不同身高的敌人就开门<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图<br/>showDisable: 隐藏点是否不返回null，true表示不返回null<br/>返回值：图块类型，即“地形、四帧动画、矮敌人、高敌人、道具、矮npc、高npc、自动元件、额外地形”之一", 
          "!type": "fn(x: number, y: number, floorId?: string, showDisable?: bool) -> string"
        }, 
        "drawMap": {
          "!doc": "地图重绘<br/>例如：core.drawMap(); // 重绘当前地图，常用于更改贴图后的刷新<br/>floorId: 地图id，建议省略<br/>callback: 重绘完毕后的回调函数，可选", 
          "!type": "fn(floorId?: string)"
        }, 
        "nearStair": {
          "!doc": "当前位置是否在楼梯边", 
          "!type": "fn() -> bool"
        }, 
        "turnBlock": {
          "!doc": "事件转向", 
          "!type": "fn(direction?: string, x?: number, y?: number, floorId?: string)"
        }, 
        "getMapArray": {
          "!doc": "生成事件层矩阵<br/>例如：core.getMapArray('MT0'); // 生成主塔0层的事件层矩阵，隐藏的图块视为0<br/>floorId: 地图id，不填视为当前地图<br/>showDisable: 可选，true表示隐藏的图块也会被表示出来<br/>返回值：事件层矩阵，注意对其阵元的访问是[y][x]", 
          "!type": "fn(floorId?: string) -> [[number]]"
        }, 
        "jumpBlock": {
          "!doc": "跳跃图块<br/>例如：core.jumpBlock(0, 0, 0, 0); // 令地图左上角的图块原地跳跃半秒，再花半秒淡出<br/>sx: 起点的横坐标<br/>sy: 起点的纵坐标<br/>ex: 终点的横坐标<br/>ey: 终点的纵坐标<br/>time: 单步和淡出用时，单位为毫秒。不填视为半秒<br/>keep: 是否不淡出，true表示不淡出<br/>callback: 落地或淡出后的回调函数，可选", 
          "!type": "fn(sx: number, sy: number, ex: number, ey: number, time?: number, keep?: bool, callback?: fn())"
        }, 
        "replaceBlock": {
          "!doc": "批量替换图块<br/>例如：core.replaceBlock(21, 22, core.floorIds); // 把游戏中地上当前所有的黄钥匙都变成蓝钥匙<br/>fromNumber: 旧图块的数字<br/>toNumber: 新图块的数字<br/>floorId: 地图id或其数组，不填视为当前地图", 
          "!type": "fn(fromNumber: number, toNumber: number, floorId?: string|[string])"
        }, 
        "drawBlock": {
          "!doc": "绘制一个图块", 
          "!type": "fn(block?: block, animate?: number)"
        }, 
        "resetMap": {
          "!doc": "重置地图", 
          "!type": "fn(floorId?: string|[string])"
        }, 
        "animateSetBlock": {
          "!doc": "动画形式转变某点图块", 
          "!type": "fn(number: number|string, x: number, y: number, floorId?: string, time?: number, callback?: fn())"
        }, 
        "animateSetBlocks": {
          "!doc": "动画形式同时转变若干点图块", 
          "!type": "fn(number: number|string, locs: [?], floorId?: string, time?: number, callback?: fn())"
        }, 
        "compressMap": {
          "!doc": "压缩地图", 
          "!type": "fn(mapArr: [[number]], floorId?: string) -> [[number]]"
        }, 
        "enemyExists": {
          "!doc": "某个点是否存在（指定的）怪物", 
          "!type": "fn(x: number, y: number, id?: string, floorId?: string) -> bool"
        }, 
        "npcExists": {
          "!doc": "某个点是否存在NPC", 
          "!type": "fn(x: number, y: number, floorId?: string) -> bool"
        }, 
        "getBlockByNumber": {
          "!doc": "根据数字获得图块", 
          "!type": "fn(number: number) -> block"
        }, 
        "removeBlock": {
          "!doc": "尝试删除一个图块，此函数会被打怪开门捡道具、“隐藏事件”指令和“移动/跳跃事件”指令的起点直接调用。<br/>例如：core.removeBlock(0, 0); // 尝试删除地图左上角的图块<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图", 
          "!type": "fn(x: number, y: number, floorId?: string)"
        }, 
        "hideBlock": {
          "!doc": "隐藏（显示或隐藏的）图块，此函数不会被任何事件指令【直接】调用<br/>例如：core.hideBlock(0, 0); // 隐藏地图左上角的图块<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图", 
          "!type": "fn(x: number, y: number, floorId?: string)"
        }, 
        "removeBlockByIndex": {
          "!doc": "根据block的索引删除该块", 
          "!type": "fn(index: number, floorId?: string)"
        }, 
        "stairExists": {
          "!doc": "某个点是否存在楼梯", 
          "!type": "fn(x: number, y: number, floorId?: string) -> bool"
        }, 
        "decompressMap": {
          "!doc": "解压缩地图", 
          "!type": "fn(mapArr: [[number]], floorId?: string) -> [[number]]"
        }, 
        "automaticRoute": {
          "!doc": "自动寻路<br/>例如：core.automaticRoute(0, 0); // 自动寻路到地图左上角<br/>destX: 目标点的横坐标<br/>destY: 目标点的纵坐标<br/>返回值：每步走完后主角的loc属性组成的一维数组", 
          "!type": "fn(destX: number, destY: number) -> [loc]"
        }, 
        "resizeMap": {
          "!doc": "更改地图画布的尺寸", 
          "!type": "fn(floorId?: string)"
        }, 
        "getFgNumber": {
          "!doc": "判定前景层的一个位置是什么<br/>例如：core.getFgNumber(core.status.hero.loc.x, core.status.hero.loc.y); // 判断主角脚下的前景层图块的数字<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图<br/>noCache: 可选，true表示不使用缓存", 
          "!type": "fn(x: number, y: number, floorId?: string, noCache?: bool) -> number"
        }, 
        "moveBlock": {
          "!doc": "移动图块<br/>例如：core.moveBlock(0, 0, ['down']); // 令地图左上角的图块下移一格，用时半秒，再花半秒淡出<br/>x: 起点的横坐标<br/>y: 起点的纵坐标<br/>steps: 步伐数组，前进和后退用于带朝向的npc<br/>time: 单步和淡出用时，单位为毫秒。不填视为半秒<br/>keep: 是否不淡出，true表示不淡出<br/>callback: 移动或淡出后的回调函数，可选", 
          "!type": "fn(x: number, y: number, steps: [string], time?: number, keep?: bool, callback?: fn())"
        }, 
        "getBgNumber": {
          "!doc": "判定背景层的一个位置是什么，主要用于滑冰（167）<br/>例如：core.getBgNumber(core.status.hero.loc.x, core.status.hero.loc.y); // 判断主角脚下的背景层图块的数字<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图<br/>@param 可选，true表示不使用缓存", 
          "!type": "fn(x: number, y: number, floorId?: string, noCache?: bool) -> number"
        }, 
        "getIdOfThis": {
          "!doc": "获得当前事件点的ID", 
          "!type": "fn(id?: string) -> string"
        }, 
        "searchBlock": {
          "!doc": "搜索图块, 支持通配符和正则表达式<br/>例如：core.searchBlock('*Door'); // 搜索当前地图的所有门<br/>id: 图块id，支持星号表示任意多个（0个起）字符<br/>floorId: 地图id，不填视为当前地图<br/>showDisable: 隐藏点是否计入，true表示计入<br/>返回值：一个详尽的数组，一般只用到其长度", 
          "!type": "fn(id: string, floorId?: string, showDisable?: bool) -> Array<{ floorId -> string, index -> number, x -> number, y -> number, block -> Block }>"
        },
        "hideBgFgMap": {
          "!doc": "隐藏前景/背景地图", 
          "!type": "fn(name?: string, loc?: [number]|[[number]], floorId?: string, callback?: fn())"
        }, 
        "getBlockInfo": {
          "!doc": "获得某个图块或素材的信息，包括ID，cls，图片，坐标，faceIds等等", 
          "!type": "fn(block?: number|string|block) -> blockInfo"
        }, 
        "canMoveDirectlyArray": {
          "!doc": "获得某些点可否通行的信息", 
          "!type": "fn(locs?: [[number]])"
        }, 
        "hideFloorImage": {
          "!doc": "隐藏一个楼层贴图", 
          "!type": "fn(loc?: [number]|[[number]], floorId?: string, callback?: fn())"
        }, 
        "extractBlocks": {
          "!doc": "根据需求解析出blocks", 
          "!type": "fn(map?: [[number]], flags?: flags)"
        }, 
        "getBlockId": {
          "!doc": "判定某个点的图块id<br/>例如：if(core.getBlockId(x1, y1) != 'greenSlime' && core.getBlockId(x2, y2) != 'redSlime') core.openDoor(x3, y3); // 一个简单的机关门事件，打败或炸掉这一对绿头怪和红头怪就开门<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图<br/>showDisable: 隐藏点是否不返回null，true表示不返回null<br/>返回值：图块id，该点无图块则返回null", 
          "!type": "fn(x: number, y: number, floorId?: string, showDisable?: bool) -> string"
        }, 
        "loadFloor": {
          "!doc": "从文件或存档中加载某个楼层", 
          "!type": "fn(floorId?: string, map?: ?)"
        }, 
        "generateMovableArray": {
          "!doc": "可通行性判定<br/>例如：core.generateMovableArray(); // 判断当前地图主角从各点能向何方向移动<br/>floorId: 地图id，不填视为当前地图<br/>x: 起点横坐标，不填视为挨个判定<br/>y: 起点纵坐标，不填视为挨个判定<br/>direction: 可选，必须和坐标一起使用。填写后将只检查是否可向该方向移动并返回布尔值<br/>返回值：不设置坐标时为从各点可移动方向的三维数组，设置坐标但不设置方向时为该点可移动方向的一维数组，都设置时为布尔值", 
          "!type": "fn(floorId?: string, x?: number, y?: number, direction?: string)"
        }, 
        "terrainExists": {
          "!doc": "某个点是否存在（指定的）地形", 
          "!type": "fn(x: number, y: number, id?: string, floorId?: string) -> bool"
        }, 
        "getBlockById": {
          "!doc": "根据ID获得图块", 
          "!type": "fn(id: string) -> block"
        }, 
        "drawBg": {
          "!doc": "绘制背景层（含贴图，其与背景层矩阵的绘制顺序可通过复写此函数来改变）<br/>例如：core.drawBg(); // 绘制当前地图的背景层<br/>floorId: 地图id，不填视为当前地图<br/>ctx: 某画布的ctx，用于绘制缩略图，一般不需要", 
          "!type": "fn(floorId?: string, ctx?: CanvasRenderingContext2D)"
        }, 
        "showBlock": {
          "!doc": "显示（隐藏或显示的）图块，此函数将被“显示事件”指令和勾选了“不消失”的“移动/跳跃事件”指令（如阻击怪）的终点调用<br/>例如：core.showBlock(0, 0); // 显示地图左上角的图块<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图", 
          "!type": "fn(x: number, y: number, floorId?: string)"
        }, 
        "getMapBlocksObj": {
          "!doc": "以x,y的形式返回每个点的事件", 
          "!type": "fn(floorId?: string, showDisable?: bool)"
        }, 
        "removeGlobalAnimate": {
          "!doc": "删除一个或所有全局动画", 
          "!type": "fn(x?: number, y?: number, name?: string)"
        }, 
        "drawEvents": {
          "!doc": "绘制事件层<br/>例如：core.drawEvents(); // 绘制当前地图的事件层<br/>floorId: 地图id，不填视为当前地图<br/>blocks: 一般不需要<br/>ctx: 某画布的ctx，用于绘制缩略图，一般不需要", 
          "!type": "fn(floorId?: string, blocks?: [block], ctx?: CanvasRenderingContext2D)"
        }, 
        "canMoveDirectly": {
          "!doc": "能否瞬移到某点，并求出节约的步数。此函数会无视可通行图块的script属性，如需使用该属性请手动禁止瞬移<br/>例如：core.canMoveDirectly(0, 0); // 能否瞬移到地图左上角<br/>destX: 目标点的横坐标<br/>destY: 目标点的纵坐标<br/>返回值：正数表示节约的步数，-1表示不可瞬移", 
          "!type": "fn(destX: number, destY: number) -> number"
        }, 
        "saveMap": {
          "!doc": "将当前地图重新变成数字，以便于存档", 
          "!type": "fn(floorId?: string)"
        }, 
        "drawBoxAnimate": {
          "!doc": "绘制UI层的box动画", 
          "!type": "fn()"
        }, 
        "setBgFgBlock": {
          "!doc": "转变图层块<br/>例如：core.setBgFgBlock('bg', 167, 6, 6); // 把当前地图背景层的中心块改为滑冰<br/>name: 背景还是前景<br/>number: 新图层块的数字（也支持纯数字字符串如'1'）或id<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图", 
          "!type": "fn(name: string, number: number|string, x: number, y: number, floorId?: string)"
        }, 
        "drawFg": {
          "!doc": "绘制前景层（含贴图，其与前景层矩阵的绘制顺序可通过复写此函数来改变）<br/>例如：core.drawFg(); // 绘制当前地图的前景层<br/>floorId: 地图id，不填视为当前地图<br/>ctx: 某画布的ctx，用于绘制缩略图，一般不需要", 
          "!type": "fn(floorId?: string, ctx?: CanvasRenderingContext2D)"
        }, 
        "getBlock": {
          "!doc": "获得某个点的block", 
          "!type": "fn(x: number, y: number, floorId?: string, showDisable?: bool) -> block"
        }, 
        "initBlock": {
          "!doc": "初始化一个图块", 
          "!type": "fn(x: number, y: number, id: string|number, addInfo?: bool, eventFloor?: ?, flags?: ?) -> block"
        }, 
        "addGlobalAnimate": {
          "!doc": "添加一个全局动画", 
          "!type": "fn(block?: block)"
        }, 
        "animateBlock": {
          "!doc": "显示/隐藏某个块时的动画效果", 
          "!type": "fn(loc?: [number]|[[number]], type?: string, time?: number, callback?: fn())"
        }, 
        "loadMap": {
          "!doc": "将存档中的地图信息重新读取出来", 
          "!type": "fn(data?: ?, floorId?: string)"
        }, 
        "setBlock": {
          "!doc": "转变图块<br/>例如：core.setBlock(1, 0, 0); // 把地图左上角变成黄墙<br/>number: 新图块的数字（也支持纯数字字符串如'1'）或id<br/>x: 横坐标<br/>y: 纵坐标<br/>floorId: 地图id，不填视为当前地图", 
          "!type": "fn(number: number|string, x: number, y: number, floorId?: string)"
        }, 
        "getFgMapArray": {
          "!doc": "生成前景层矩阵<br/>例如：core.getFgMapArray('MT0'); // 生成主塔0层的前景层矩阵，使用缓存<br/>floorId: 地图id，不填视为当前地图<br/>noCache: 可选，true表示不使用缓存<br/>返回值：前景层矩阵，注意对其阵元的访问是[y][x]", 
          "!type": "fn(floorId?: string, noCache?: bool) -> [[number]]"
        }, 
        "getBgMapArray": {
          "!doc": "生成背景层矩阵<br/>例如：core.getBgMapArray('MT0'); // 生成主塔0层的背景层矩阵，使用缓存<br/>floorId: 地图id，不填视为当前地图<br/>noCache: 可选，true表示不使用缓存<br/>返回值：背景层矩阵，注意对其阵元的访问是[y][x]", 
          "!type": "fn(floorId?: string, noCache?: bool) -> [[number]]"
        }, 
        "canMoveHero": {
          "!doc": "单点单朝向的可通行性判定<br/>@exmaple core.canMoveHero(); // 判断主角是否可以前进一步<br/>x: 起点横坐标，不填视为主角当前的<br/>y: 起点纵坐标，不填视为主角当前的<br/>direction: 移动的方向，不填视为主角面对的方向<br/>floorId: 地图id，不填视为当前地图<br/>返回值：true表示可移动，false表示不可移动", 
          "!type": "fn(x?: number, y?: number, direction?: string, floorId?: string) -> bool"
        }, 
        "drawThumbnail": {
          "!doc": "绘制缩略图<br/>例如：core.drawThumbnail(); // 绘制当前地图的缩略图<br/>floorId: 地图id，不填视为当前地图<br/>blocks: 一般不需要<br/>options: 额外的绘制项，可选。可以增绘主角位置和朝向、采用不同于游戏中的主角行走图、增绘显伤、提供flags用于存读档<br/>toDraw: 要绘制到的画布名或画布的ctx或还有其他信息，如起绘坐标、绘制大小、是否绘制全图、截取中心", 
          "!type": "fn(floorId?: string, blocks?: [block], options?: ?, toDraw?: string|CanvasRenderingContext2D|?)"
        }, 
        "hideBlockByIndex": {
          "!doc": "根据图块的索引来隐藏图块", 
          "!type": "fn(index?: number, floorId?: string)"
        }, 
        "getNumberById": {
          "!doc": "根据图块id得到数字（地图矩阵中的值）<br/>例如：core.getNumberById('yellowWall'); // 1<br/>id: 图块id<br/>返回值：图块的数字，定义在project\\maps.js（请注意和project\\icons.js中的“图块索引”相区分！）", 
          "!type": "fn(id: string) -> number"
        }, 
        "removeBlockByIndexes": {
          "!doc": "一次性删除多个block", 
          "!type": "fn(indexes?: [number], floorId?: string)"
        }, 
        "hideBlockByIndexes": {
          "!doc": "一次性隐藏多个block", 
          "!type": "fn(indexes?: [number], floorId?: string)"
        }, 
        "generateGroundPattern": {
          "!doc": "生成groundPattern", 
          "!type": "fn(floorId?: string)"
        }, 
        "showBgFgMap": {
          "!doc": "显示前景/背景地图", 
          "!type": "fn(name?: string, loc?: [number]|[[number]], floorId?: string, callback?: fn())"
        }, 
        "showFloorImage": {
          "!doc": "显示一个楼层贴图", 
          "!type": "fn(loc?: [number]|[[number]], floorId?: string, callback?: fn())"
        }
      }, 
      "ui": {
        "!doc": "UI绘制相关的函数",
        "resizeCanvas": {
          "!doc": "重新设置一个自定义画布的大小", 
          "!type": "fn(name: string, x: number, y: number)"
        }, 
        "deleteCanvas": {
          "!doc": "删除一个自定义画布", 
          "!type": "fn(name: string)"
        }, 
        "drawSLPanel": {
          "!doc": "绘制存档/读档界面", 
          "!type": "fn(index?: ?, refresh?: bool)"
        }, 
        "drawKeyBoard": {
          "!doc": "绘制虚拟键盘", 
          "!type": "fn()"
        }, 
        "drawStorageRemove": {
          "!doc": "绘制存档删除页面", 
          "!type": "fn()"
        }, 
        "deleteAllCanvas": {
          "!doc": "清空所有的自定义画布", 
          "!type": "fn()"
        },
        "drawIcon": {
          "!doc": "在某个canvas上绘制一个图标", 
          "!type": "fn(name: string|CanvasRenderingContext2D, id: string, x: number, y: number, w?: number, h?: number, frame?: number)"
        }, 
        "drawFly": {
          "!doc": "绘制楼层传送器", 
          "!type": "fn(page?: ?)"
        }, 
        "setOpacity": {
          "!doc": "设置某个canvas的透明度；尽量不要使用本函数，而是全部换成setAlpha实现", 
          "!type": "fn(name: string|CanvasRenderingContext2D, opacity: number)"
        }, 
        "drawAbout": {
          "!doc": "绘制“关于”界面", 
          "!type": "fn()"
        }, 
        "getTextContentHeight": {
          "!doc": "获得某段文字的预计绘制高度；参数说明详见 drawTextContent", 
          "!type": "fn(content: string, config?: ?)"
        }, 
        "drawSwitchs": {
          "!doc": "绘制系统设置界面", 
          "!type": "fn()"
        }, 
        "drawSyncSelect": {
          "!doc": "绘制存档同步选择页面", 
          "!type": "fn()"
        }, 
        "drawArrow": {
          "!doc": "在某个canvas上绘制一个箭头", 
          "!type": "fn(name: string|CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number)"
        }, 
        "drawReplay": {
          "!doc": "绘制回放界面", 
          "!type": "fn()"
        }, 
        "strokeEllipse": {
          "!doc": "在某个canvas上绘制一个椭圆的边框", 
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, a: number, b: number, angle?: number, style?: string, lineWidth?: number)"
        }, 
        "fillCircle": {
          "!doc": "在某个canvas上绘制一个圆", 
          "!url": "https://www.w3school.com.cn/tags/canvas_arc.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: number, style?: string)"
        }, 
        "clearTip": {
          "!doc": "清除左上角提示内容", 
          "!type": "fn()"
        }, 
        "strokeRoundRect": {
          "!doc": "在某个canvas上绘制一个圆角矩形的边框", 
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, style?: string, lineWidth?: number, angle?: number)"
        }, 
        "getContextByName": {
          "!doc": "根据画布名找到一个画布的context；支持系统画布和自定义画布。如果不存在画布返回null。<br/>也可以传画布的context自身，则返回自己。", 
          "!type": "fn(canvas: string|CanvasRenderingContext2D) -> CanvasRenderingContext2D"
        }, 
        "drawImage": {
          "!doc": "在一个画布上绘制图片<br/>后面的8个坐标参数与canvas的drawImage的八个参数完全相同。<br/>name: 可以是系统画布之一，也可以是任意自定义动态创建的画布名 画布名称或者画布的context<br/>image: 要绘制的图片，可以是一个全塔属性中定义的图片名（会从images中去获取；支持加':x',':y',':o'翻转），图片本身，或者一个画布。<br/>angle：旋转角度", 
          "!url": "http://www.w3school.com.cn/html5/canvas_drawimage.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, image: string|image, x: number, y: number, w?: number, h?: number, x1?: number, y1?: number, w1?: number, h1?: number, angle?: number)"
        }, 
        "drawTip": {
          "!doc": "左上角绘制一段提示", 
          "!type": "fn(text: string, id?: string, frame?: number)"
        }, 
        "drawBackground": {
          "!doc": "绘制一个背景图，可绘制winskin或纯色背景；支持小箭头绘制", 
          "!type": "fn(left: string, top: string, right: string, bottom: string, posInfo?: {px: number, py: number, direction: string})"
        }, 
        "fillEllipse": {
          "!doc": "在某个canvas上绘制一个椭圆", 
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, a: number, b: number, angle?: number, style?: string)"
        }, 
        "setFillStyle": {
          "!doc": "设置某个canvas的绘制属性（如颜色等）", 
          "!url": "https://www.w3school.com.cn/tags/canvas_fillstyle.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, style: string)"
        }, 
        "drawText": {
          "!doc": "地图中间绘制一段文字", 
          "!type": "fn(contents: string, callback?: fn())"
        }, 
        "fillPolygon": {
          "!doc": "在某个canvas上绘制一个多边形", 
          "!type": "fn(name: string|CanvasRenderingContext2D, nodes?: [[number]], style?: string)"
        }, 
        "drawStatistics": {
          "!doc": "绘制“数据统计”界面", 
          "!type": "fn(floorIds?: string)"
        }, 
        "fillText": {
          "!doc": "在某个画布上绘制一段文字<br/>text: 要绘制的文本<br/>style: 绘制的样式<br/>font: 绘制的字体<br/>最大宽度，超过此宽度会自动放缩", 
          "!url": "https://www.w3school.com.cn/tags/canvas_filltext.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, text: string, x: number, y: number, style?: string, font?: string, maxWidth?: number)"
        }, 
        "setTextBaseline": {
          "!doc": "设置某个canvas的baseline", 
          "!url": "https://www.w3school.com.cn/tags/canvas_textbaseline.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, baseline: string)"
        }, 
        "drawSettings": {
          "!doc": "绘制系统菜单栏", 
          "!type": "fn()"
        }, 
        "loadCanvas": {
          "!doc": "加载某个canvas状态", 
          "!type": "fn(name: string|CanvasRenderingContext2D)"
        }, 
        "splitLines": {
          "!doc": "字符串自动换行的分割", 
          "!type": "fn(name: string|CanvasRenderingContext2D, text: string, maxWidth?: number, font?: string)"
        }, 
        "setAlpha": {
          "!doc": "设置某个canvas的alpha值", 
          "!url": "https://www.w3school.com.cn/tags/canvas_globalalpha.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, alpha: number)"
        }, 
        "setLineWidth": {
          "!doc": "设置某个canvas的线宽度", 
          "!url": "https://www.w3school.com.cn/tags/canvas_linewidth.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, lineWidth: number)"
        }, 
        "drawEquipbox": {
          "!doc": "绘制装备界面", 
          "!type": "fn(index?: ?)"
        }, 
        "drawTextBox": {
          "!doc": "绘制一个对话框", 
          "!type": "fn(content: string, showAll?: bool)"
        }, 
        "relocateCanvas": {
          "!doc": "重新定位一个自定义画布", 
          "!type": "fn(name: string, x: number, y: number)"
        }, 
        "closePanel": {
          "!doc": "结束一切事件和绘制，关闭UI窗口，返回游戏进程", 
          "!type": "fn()"
        }, 
        "textImage": {
          "!doc": "文本图片化", 
          "!type": "fn(content: string, lineHeight?: number) -> image"
        }, 
        "drawStatusBar": {
          "!doc": "绘制状态栏", 
          "!type": "fn()"
        }, 
        "setStrokeStyle": {
          "!doc": "设置某个canvas边框属性", 
          "!url": "https://www.w3school.com.cn/tags/canvas_strokestyle.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, style: string)"
        }, 
        "clearUI": {
          "!doc": "清空UI层内容", 
          "!type": "fn()"
        }, 
        "drawWindowSkin": {
          "!doc": "绘制WindowSkin", 
          "!type": "fn(background: string, ctx: string|CanvasRenderingContext2D, x: number, y: number, w: string, h: string, direction?: string, px?: number, py?: number)"
        }, 
        "drawGameInfo": {
          "!doc": "绘制游戏信息界面", 
          "!type": "fn()"
        }, 
        "fillRect": {
          "!doc": "绘制一个矩形。style可选为绘制样式<br/>text: 要绘制的文本<br/>style: 绘制的样式<br/>font: 绘制的字体", 
          "!url": "https://www.w3school.com.cn/tags/canvas_fillrect.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, text: string, x: number, y: number, style?: string, font?: string)"
        }, 
        "drawScrollText": {
          "!doc": "绘制滚动字幕", 
          "!type": "fn(content: string, time: number, lineHeight?: number, callback?: fn())"
        }, 
        "strokePolygon": {
          "!doc": "在某个canvas上绘制一个多边形的边框", 
          "!type": "fn(name: string|CanvasRenderingContext2D, nodes?: [[number]], style?: string, lineWidth?: number)"
        }, 
        "strokeCircle": {
          "!doc": "在某个canvas上绘制一个圆的边框", 
          "!url": "https://www.w3school.com.cn/tags/canvas_arc.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: ?, style?: string, lineWidth?: number)"
        }, 
        "drawLocalSaveSelect": {
          "!doc": "绘制单存档界面", 
          "!type": "fn()"
        }, 
        "drawWaiting": {
          "!doc": "绘制等待界面", 
          "!type": "fn(text: string)"
        }, 
        "setFont": {
          "!doc": "设置某个canvas的文字字体", 
          "!url": "https://www.w3school.com.cn/tags/canvas_font.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, font: string)"
        }, 
        "drawChoices": {
          "!doc": "绘制一个选项界面", 
          "!type": "fn(content?: string, choices?: [?])"
        }, 
        "setFontForMaxWidth": {
          "!doc": "根据最大宽度自动缩小字体", 
          "!type": "fn(name: string|CanvasRenderingContext2D, text: string, maxWidth: number, font?: ?) -> string"
        }, 
        "clearMap": {
          "!doc": "清空某个画布图层<br/>name为画布名，可以是系统画布之一，也可以是任意自定义动态创建的画布名；还可以直接传画布的context本身。（下同）<br/>如果name也可以是'all'，若为all则为清空所有系统画布。", 
          "!url": "https://www.w3school.com.cn/tags/canvas_clearrect.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, x?: number, y?: number, width?: number, height?: number)"
        }, 
        "drawTextContent": {
          "!doc": "绘制一段文字到某个画布上面<br/>ctx: 要绘制到的画布<br/>content: 要绘制的内容；转义字符不允许保留 \\t, \\b 和 \\f<br/>config: 绘制配置项，目前暂时包含如下内容（均为可选）<br/>left, top：起始点位置；maxWidth：单行最大宽度；color：默认颜色；align：左中右<br/>fontSize：字体大小；lineHeight：行高；time：打字机间隔<br/>返回值：绘制信息", 
          "!type": "fn(ctx: string|CanvasRenderingContext2D, content: string, config: ?)"
        }, 
        "calWidth": {
          "!doc": "计算某段文字的宽度", 
          "!url": "https://www.w3school.com.cn/tags/canvas_measuretext.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, text: string, font?: string) -> number"
        }, 
        "fillArc": {
          "!doc": "在某个canvas上绘制一个扇形", 
          "!url": "https://www.w3school.com.cn/tags/canvas_arc.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, style?: string)"
        }, 
        "drawWindowSelector": {
          "!doc": "绘制选择光标", 
          "!type": "fn(background: ?, x: number, y: number, w: number, h: number)"
        }, 
        "strokeArc": {
          "!doc": "在某个canvas上绘制一段弧", 
          "!url": "https://www.w3school.com.cn/tags/canvas_arc.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, style?: string, lineWidth?: number)"
        }, 
        "drawLine": {
          "!doc": "在某个canvas上绘制一条线", 
          "!url": "https://www.w3school.com.cn/tags/canvas_lineto.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number)"
        }, 
        "drawPagination": {
          "!doc": "绘制分页", 
          "!type": "fn(page?: ?, totalPage?: ?, y?: number)"
        }, 
        "drawBookDetail": {
          "!doc": "绘制怪物属性的详细信息", 
          "!type": "fn(index?: ?)"
        }, 
        "drawToolbox": {
          "!doc": "绘制道具栏", 
          "!type": "fn(index?: ?)"
        }, 
        "drawHelp": {
          "!doc": "绘制帮助页面", 
          "!type": "fn()"
        }, 
        "drawQuickShop": {
          "!doc": "绘制快捷商店选择栏", 
          "!type": "fn()"
        }, 
        "drawCenterFly": {
          "!doc": "绘制中心对称飞行器", 
          "!type": "fn()"
        }, 
        "strokeRect": {
          "!doc": "绘制一个矩形的边框<br/>style: 绘制的样式", 
          "!url": "https://www.w3school.com.cn/tags/canvas_strokerect.asp",
          "!type": "fn(name: CtxRefer, x: number, y: number, width: number, height: number, style: string)"
        }, 
        "drawBook": {
          "!doc": "绘制怪物手册", 
          "!type": "fn(index?: ?)"
        }, 
        "fillRoundRect": {
          "!doc": "在某个canvas上绘制一个圆角矩形", 
          "!type": "fn(name: string|CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, style?: string, angle?: number)"
        }, 
        "fillBoldText": {
          "!doc": "在某个画布上绘制一个描黑边的文字<br/>text: 要绘制的文本<br/>style: 绘制的样式<br/>font: 绘制的字体", 
          "!type": "fn(name: CtxRefer, text: string, x: number, y: number, style: string, font: string)"
        }, 
        "drawSyncSave": {
          "!doc": "绘制存档同步界面", 
          "!type": "fn()"
        }, 
        "saveCanvas": {
          "!doc": "保存某个canvas状态", 
          "!type": "fn(name: string|CanvasRenderingContext2D)"
        }, 
        "drawCursor": {
          "!doc": "绘制键盘光标", 
          "!type": "fn()"
        },
        "createCanvas": {
          "!doc": "动态创建一个画布。name为要创建的画布名，如果已存在则会直接取用当前存在的。<br/>x,y为创建的画布相对窗口左上角的像素坐标，width,height为创建的长宽。<br/>zIndex为创建的纵向高度（关系到画布之间的覆盖），z值高的将覆盖z值低的；系统画布的z值可在个性化中查看。<br/>返回创建的画布的context，也可以通过core.dymCanvas[name]调用。<br/>name:<br/>x:<br/>y:<br/>width:<br/>height:<br/>zIndex:", 
          "!type": "fn(name: string, x: number, y: number, width: number, height: number, zIndex: number) -> CanvasRenderingContext2D"
        }, 
        "setTextAlign": {
          "!doc": "设置某个canvas的对齐", 
          "!url": "https://www.w3school.com.cn/tags/canvas_textalign.asp",
          "!type": "fn(name: string|CanvasRenderingContext2D, align: string)"
        }, 
        "drawMaps": {
          "!doc": "绘制浏览地图界面", 
          "!type": "fn(index?: ?, x?: number, y?: number)"
        }
      }, 
      "enemys": {
        "!doc": "怪物处理的相关函数",
        "getSpecialHint": {
          "!doc": "获得某种敌人的某种特殊属性的介绍<br/>例如：core.getSpecialHint('bat', 1) // '先攻：怪物首先攻击'<br/>enemy: 敌人id或敌人对象，用于确定属性的具体数值，否则可选<br/>special: 属性编号，可以是该敌人没有的属性<br/>返回值：属性的介绍，以属性名加中文冒号开头", 
          "!type": "fn(enemy: string|enemy, special: number) -> string"
        }, 
        "getSpecialText": {
          "!doc": "获得某种敌人的全部特殊属性名称<br/>例如：core.getSpecialText('greenSlime') // ['先攻', '3连击', '破甲', '反击']<br/>enemy: 敌人id或敌人对象，如core.material.enemys.greenSlime<br/>返回值：字符串数组", 
          "!type": "fn(enemy: string|enemy) -> [string]"
        },
        "hasSpecial": {
          "!doc": "判定某种特殊属性的有无<br/>例如：core.hasSpecial('greenSlime', 1) // 判定绿头怪有无先攻属性<br/>special: 敌人id或敌人对象或正整数数组或自然数<br/>test: 待检查的属性编号<br/>", 
          "!type": "fn(special: number|[number]|string|number, test: number) -> bool"
        }, 
        "canBattle": {
          "!doc": "判定主角当前能否打败某只敌人<br/>例如：core.canBattle('greenSlime',0,0,'MT0') // 能否打败主塔0层左上角的绿头怪（假设有）<br/>enemy: 敌人id或敌人对象<br/>x: 敌人的横坐标，可选<br/>y: 敌人的纵坐标，可选<br/>floorId: 敌人所在的地图，可选<br/>返回值：true表示可以打败，false表示无法打败", 
          "!type": "fn(enemy: string|enemy, x?: number, y?: number, floorId?: string) -> bool"
        }, 
        "getDamage": {
          "!doc": "获得某只敌人对主角的总伤害<br/>例如：core.getDamage('greenSlime',0,0,'MT0') // 绿头怪的总伤害<br/>enemy: 敌人id或敌人对象<br/>x: 敌人的横坐标，可选<br/>y: 敌人的纵坐标，可选<br/>floorId: 敌人所在的地图，可选<br/>返回值：总伤害，如果因为没有破防或无敌怪等其他原因无法战斗，则返回null", 
          "!type": "fn(enemy: string|enemy, x?: number, y?: number, floorId?: string) -> number"
        },
        "getDamageString": {
          "!doc": "获得某只敌人的地图显伤，包括颜色<br/>例如：core.getDamageString('greenSlime', 0, 0, 'MT0') // 绿头怪的地图显伤<br/>enemy: 敌人id或敌人对象<br/>x: 敌人的横坐标，可选<br/>y: 敌人的纵坐标，可选<br/>floorId: 敌人所在的地图，可选<br/>返回值：damage: 表示伤害值或为'???'，color: 形如'#RrGgBb'", 
          "!type": "fn(enemy: string|enemy, x?: number, y?: number, floorId?: string) -> {color: string, damage: string}"
        }
      }, 
      "events": {
        "!doc": "事件处理相关的函数",
        "afterChangeFloor": {
          "!doc": "转换楼层结束的事件", 
          "!type": "fn(floorId?: string)"
        }, 
        "popEventLoc": {
          "!doc": "将当前点坐标入栈", 
          "!type": "fn()"
        }, 
        "afterOpenDoor": {
          "!doc": "开一个门后触发的事件", 
          "!type": "fn(doorId?: string, x?: number, y?: number)"
        }, 
        "checkLvUp": {
          "!doc": "检查升级事件", 
          "!type": "fn()"
        }, 
        "insertAction": {
          "!doc": "插入事件<br/>例如：core.insertAction('一段文字'); // 插入一个显示文章<br/>action: 单个事件指令，或事件指令数组<br/>x: 新的当前点横坐标，可选<br/>y: 新的当前点纵坐标，可选<br/>callback: 新的回调函数，可选<br/>addToLast: 插入的位置，true表示插入到末尾，否则插入到开头", 
          "!type": "fn(action: string|?|[?], x?: number, y?: number, callback?: fn(), addToLast?: bool)"
        }, 
        "unfollow": {
          "!doc": "取消跟随", 
          "!type": "fn(name?: string)"
        }, 
        "hasVisitedFloor": {
          "!doc": "是否到达过某个楼层", 
          "!type": "fn(floorId?: string) -> bool"
        }, 
        "startEvents": {
          "!doc": "开始执行一系列自定义事件", 
          "!type": "fn(list?: [?], x?: number, y?: number, callback?: fn())"
        }, 
        "setHeroIcon": {
          "!doc": "更改主角行走图<br/>例如：core.setHeroIcon('npc48.png', true); // 把主角从阳光变成样板0层左下角的小姐姐，但不立即刷新<br/>name: 新的行走图文件名，可以是全塔属性中映射前的中文名。映射后会被存入core.status.hero.image<br/>noDraw: true表示不立即刷新（刷新会导致大地图下视野重置到以主角为中心）", 
          "!type": "fn(name: string, noDraw?: bool)"
        }, 
        "changingFloor": {
          "!doc": "楼层转换中", 
          "!type": "fn(floorId?: string, heroLoc?: {x: number, y: number, direction: string})"
        }, 
        "setEvents": {
          "!doc": "直接设置事件列表", 
          "!type": "fn(list?: [?], x?: number, y?: number, callback?: fn())"
        }, 
        "setValue": {
          "!doc": "数值操作", 
          "!type": "fn(name: string, operator: string, value: ?, prefix?: string)"
        }, 
        "precompile": {
          "!doc": "预编辑事件", 
          "!type": "fn(data?: ?)"
        }, 
        "vibrate": {
          "!doc": "视野左右抖动<br/>例如：core.vibrate(); // 视野左右抖动1秒<br/>time: 抖动时长，单位为毫秒。必须为半秒的倍数，不填或小于1秒都视为1秒<br/>callback: 抖动平息后的回调函数，可选", 
          "!type": "fn(time?: number, callback?: fn())"
        }, 
        "confirmRestart": {
          "!doc": "询问是否需要重新开始", 
          "!type": "fn()"
        }, 
        "battle": {
          "!doc": "战斗，如果填写了坐标就会删除该点的敌人并触发战后事件<br/>例如：core.battle('greenSlime'); // 和从天而降的绿头怪战斗（如果打得过）<br/>id: 敌人id，必填<br/>x: 敌人的横坐标，可选<br/>y: 敌人的纵坐标，可选<br/>force: true表示强制战斗，可选<br/>callback: 回调函数，可选", 
          "!type": "fn(id: string, x?: number, y?: number, force?: bool, callback?: fn())"
        }, 
        "follow": {
          "!doc": "跟随", 
          "!type": "fn(name: string)"
        }, 
        "beforeBattle": {
          "!doc": "战斗前触发的事件；返回false代表不进行战斗", 
          "!type": "fn(enemyId?: string, x?: number, y?: number) -> bool"
        }, 
        "registerEvent": {
          "!doc": "注册一个自定义事件<br/>type: 事件类型<br/>func: 事件的处理函数，可接受(data, x, y, prefix)参数<br/>data为事件内容，x和y为当前点坐标（可为null），prefix为当前点前缀", 
          "!type": "fn(type: string, func: fn(data: ?, x?: number, y?: number, prefix?: string))"
        }, 
        "flyTo": {
          "!doc": "飞往某一层", 
          "!type": "fn(toId?: string, callback?: fn()) -> bool"
        }, 
        "afterGetItem": {
          "!doc": "获得一个道具后的事件", 
          "!type": "fn(id?: string, x?: number, y?: number, isGentleClick?: bool)"
        }, 
        "doAction": {
          "!doc": "执行下一个事件指令，常作为回调<br/>例如：core.setCurtain([0,0,0,1], undefined, core.doAction); // 事件中的原生脚本，配合勾选“不自动执行下一个事件”来达到此改变色调只持续到下次场景切换的效果<br/>keepUI: true表示不清除UI画布和选择光标", 
          "!type": "fn(keepUI?: true)"
        }, 
        "openBook": {
          "!doc": "点击怪物手册时的打开操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "getNextItem": {
          "!doc": "获得面前的物品（轻按）", 
          "!type": "fn(noRoute?: bool)"
        }, 
        "hasAsync": {
          "!doc": "当前是否有未处理完毕的异步事件", 
          "!type": "fn() -> bool"
        }, 
        "openEquipbox": {
          "!doc": "点击装备栏时的打开操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "recoverEvents": {
          "!doc": "恢复一个事件", 
          "!type": "fn(data?: ?)"
        }, 
        "setGlobalFlag": {
          "!doc": "设置一个系统开关<br/>例如：core.setGlobalFlag('steelDoorWithoutKey', true); // 使全塔的所有铁门都不再需要钥匙就能打开<br/>name: 系统开关的英文名<br/>value: 开关的新值，您可以用!core.flags[name]简单地表示将此开关反转", 
          "!type": "fn(name: string, value: bool)"
        }, 
        "moveImage": {
          "!doc": "移动一张图片并/或改变其透明度<br/>例如：core.moveImage(1, null, 0.5); // 1秒内把1号图片变为50%透明<br/>code: 图片编号<br/>to: 新的左上角坐标，省略表示原地改变透明度<br/>opacityVal: 新的透明度，省略表示不变<br/>time: 移动用时，单位为毫秒。不填视为1秒<br/>callback: 图片移动完毕后的回调函数，可选", 
          "!type": "fn(code: number, to?: [number], opacityVal?: number, time?: number, callback?: fn())"
        }, 
        "openSettings": {
          "!doc": "点击设置按钮时的操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "afterPushBox": {
          "!doc": "推箱子后的事件", 
          "!type": "fn()"
        }, 
        "unregisterSystemEvent": {
          "!doc": "注销一个系统事件", 
          "!type": "fn(type: string)"
        }, 
        "trigger": {
          "!doc": "触发(x,y)点的事件", 
          "!type": "fn(x?: number, y?: number, callback?: fn())"
        }, 
        "restart": {
          "!doc": "重新开始游戏；此函数将回到标题页面", 
          "!type": "fn()"
        }, 
        "doEvent": {
          "!doc": "执行一个自定义事件", 
          "!type": "fn(data?: ?, x?: number, y?: number, prefix?: string)"
        }, 
        "win": {
          "!doc": "游戏获胜事件", 
          "!type": "fn(reason?: string, norank?: bool, noexit?: bool)"
        }, 
        "setGlobalAttribute": {
          "!doc": "设置全塔属性", 
          "!type": "fn(name: string, value: string)"
        }, 
        "openToolbox": {
          "!doc": "点击工具栏时的打开操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "setVolume": {
          "!doc": "调节bgm的音量<br/>例如：core.setVolume(0, 100, core.jumpHero); // 0.1秒内淡出bgm，然后主角原地跳跃半秒<br/>value: 新的音量，为0或不大于1的正数。注意系统设置中是这个值的平方根的十倍<br/>time: 渐变用时，单位为毫秒。不填或小于100毫秒都视为0<br/>callback: 渐变完成后的回调函数，可选", 
          "!type": "fn(value: number, time?: number, callback?: fn())"
        }, 
        "pushEventLoc": {
          "!doc": "将当前点坐标入栈", 
          "!type": "fn(x?: number, y?: number, floorId?: string) -> bool"
        }, 
        "openKeyBoard": {
          "!doc": "点击虚拟键盘时的打开操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "insertCommonEvent": {
          "!doc": "往当前事件列表之前或之后添加一个公共事件", 
          "!type": "fn(name?: string, args?: [?], x?: number, y?: number, callback?: fn(), addToLast?: bool)"
        }, 
        "hideImage": {
          "!doc": "隐藏一张图片<br/>例如：core.hideImage(1, 1000, core.jumpHero); // 1秒内淡出1号图片，然后主角原地跳跃半秒<br/>code: 图片编号<br/>time: 淡出时间，单位为毫秒<br/>callback: 图片完全消失后的回调函数，可选", 
          "!type": "fn(code: number, time?: number, callback?: fn())"
        }, 
        "visitFloor": {
          "!doc": "到达某楼层", 
          "!type": "fn(floorId?: string)"
        }, 
        "openQuickShop": {
          "!doc": "点击快捷商店按钮时的打开操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "afterBattle": {
          "!doc": "战斗结束后触发的事件", 
          "!type": "fn(enemyId?: string, x?: number, y?: number)"
        }, 
        "pushBox": {
          "!doc": "推箱子", 
          "!type": "fn(data?: ?)"
        }, 
        "autoEventExecuted": {
          "!doc": "当前是否执行过某个自动事件", 
          "!type": "fn(symbol?: string, value?: ?) -> bool"
        }, 
        "addValue": {
          "!doc": "数值增减", 
          "!type": "fn(name: string, value: ?, prefix?: string)"
        }, 
        "onSki": {
          "!doc": "当前是否在冰上", 
          "!type": "fn(number?: number) -> bool"
        }, 
        "showImage": {
          "!doc": "显示一张图片<br/>例如：core.showImage(1, core.material.images.images['winskin.png'], [0,0,128,128], [0,0,416,416], 0.5, 1000); // 裁剪winskin.png的最左边128×128px，放大到铺满整个视野，1秒内淡入到50%透明，编号为1<br/>code: 图片编号，为不大于50的正整数，加上100后就是对应画布层的z值，较大的会遮罩较小的，注意色调层的z值为125，UI层为140<br/>image: 图片文件名（可以是全塔属性中映射前的中文名）或图片对象（见上面的例子）<br/>sloc: 一行且至多四列的数组，表示从原图裁剪的左上角坐标和宽高，可选<br/>loc: 一行且至多四列的数组，表示图片在视野中的左上角坐标和宽高，可选<br/>opacityVal: 不透明度，为小于1的正数。不填视为1<br/>time: 淡入时间，单位为毫秒。不填视为0<br/>callback: 图片完全显示出来后的回调函数，可选", 
          "!type": "fn(code: number, image: string|image, sloc?: [number], loc?: [number], opacityVal?: number, time?: number, callback?: fn())"
        }, 
        "getItem": {
          "!doc": "获得道具并提示，如果填写了坐标就会删除该点的该道具<br/>例如：core.getItem('book'); // 获得敌人手册并提示<br/>id: 道具id，必填<br/>num: 获得的数量，不填视为1，填了就别填坐标了<br/>x: 道具的横坐标，可选<br/>y: 道具的纵坐标，可选<br/>callback: 回调函数，可选", 
          "!type": "fn(id: string, num?: number, x?: number, y?: number, callback?: fn())"
        }, 
        "registerSystemEvent": {
          "!doc": "注册一个系统事件<br/>type: 事件名<br/>func: 为事件的处理函数，可接受(data,callback)参数", 
          "!type": "fn(type: string, func: fn(data?: ?, callback?: fn()))"
        }, 
        "startGame": {
          "!doc": "开始新游戏<br/>例如：core.startGame('咸鱼乱撞', 0, ''); // 开始一局咸鱼乱撞难度的新游戏，随机种子为0<br/>hard: 难度名，会显示在左下角（横屏）或右下角（竖屏）<br/>seed: 随机种子，相同的种子保证了录像的可重复性<br/>route: 经由base64压缩后的录像，用于从头开始的录像回放<br/>callback: 回调函数，可选", 
          "!type": "fn(hard: string, seed: number, route: string, callback?: fn())"
        }, 
        "doSystemEvent": {
          "!doc": "执行一个系统事件", 
          "!type": "fn(type: string, data?: ?, callback?: fn())"
        }, 
        "resetGame": {
          "!doc": "初始化游戏", 
          "!type": "fn(hero?: ?, hard?: ?, floorId?: string, maps?: ?, values?: ?)"
        }, 
        "setFloorInfo": {
          "!doc": "设置一项楼层属性并刷新状态栏<br/>例如：core.setFloorInfo('ratio', 2, 'MT0'); // 把主塔0层的血瓶和宝石变为双倍效果<br/>name: 'title','name','canFlyTo','canUseQuickShop','cannotViewMap','cannotMoveDirectly','upFloor','downFloor','defaultGround','images','color','weather','bgm','ratio','underGround'之一<br/>values: 属性的新值，可选。对'title'、'name'、'defaultGround'和'bgm'需要是字符串，对'underGround'和四个'canXxx'需要是布尔值，对两个'xxxFloor'需要是一行两列的自然数数组，对'ratio'需要是数字<br/>floorId: 楼层id，不填视为当前层<br/>prefix: 独立开关前缀，一般不需要，下同", 
          "!type": "fn(name: string, values: ?, floorId?: string, prefix?: string)"
        }, 
        "openDoor": {
          "!doc": "开门（包括三种基础墙）<br/>例如：core.openDoor(0, 0, true, core.jumpHero); // 打开左上角的门，需要钥匙，然后主角原地跳跃半秒<br/>x: 门的横坐标<br/>y: 门的纵坐标<br/>needKey: true表示需要钥匙，会导致机关门打不开<br/>callback: 门完全打开后或打不开时的回调函数，可选", 
          "!type": "fn(x: number, y: number, needKey?: bool, callback?: fn())"
        }, 
        "setEnemy": {
          "!doc": "设置一项敌人属性并计入存档<br/>例如：core.setEnemy('greenSlime', 'def', 0); // 把绿头怪的防御设为0<br/>id: 敌人id<br/>name: 属性的英文缩写<br/>value: 属性的新值，可选<br/>prefix: 独立开关前缀，一般不需要，下同", 
          "!type": "fn(id: string, name: string, value: ?, prefix?: string)"
        }, 
        "autoEventExecuting": {
          "!doc": "当前是否在执行某个自动事件", 
          "!type": "fn(symbol?: string, value?: ?) -> bool"
        }, 
        "checkAutoEvents": {
          "!doc": "检测自动事件", 
          "!type": "fn()"
        }, 
        "showGif": {
          "!doc": "绘制一张动图或擦除所有动图<br/>例如：core.showGif(); // 擦除所有动图<br/>name: 动图文件名，可以是全塔属性中映射前的中文名<br/>x: 动图在视野中的左上角横坐标<br/>y: 动图在视野中的左上角纵坐标", 
          "!type": "fn(name?: string, x?: number, y?: number)"
        }, 
        "unregisterEvent": {
          "!doc": "注销一个自定义事件", 
          "!type": "fn(type: string)"
        }, 
        "jumpHero": {
          "!doc": "主角跳跃，跳跃勇士。ex和ey为目标点的坐标，可以为null表示原地跳跃。time为总跳跃时间。<br/>例如：core.jumpHero(); // 主角原地跳跃半秒<br/>ex: 跳跃后的横坐标<br/>ey: 跳跃后的纵坐标<br/>time: 跳跃时长，单位为毫秒。不填视为半秒<br/>callback: 跳跃完毕后的回调函数，可选", 
          "!type": "fn(ex?: number, ey?: number, time?: number, callback?: fn())"
        }, 
        "closeDoor": {
          "!doc": "关门，目标点必须为空地<br/>例如：core.closeDoor(0, 0, 'yellowWall', core.jumpHero); // 在左上角关掉一堵黄墙，然后主角原地跳跃半秒<br/>x: 横坐标<br/>y: 纵坐标<br/>id: 门的id，也可以用三种基础墙<br/>callback: 门完全关上后的回调函数，可选", 
          "!type": "fn(x: number, y: number, id: string, callback?: fn())"
        }, 
        "eventMoveHero": {
          "!doc": "强制移动主角（包括后退），这个函数的作者已经看不懂这个函数了<br/>例如：core.eventMoveHero(['forward'], 125, core.jumpHero); // 主角强制前进一步，用时1/8秒，然后主角原地跳跃半秒<br/>steps: 步伐数组，注意后退时跟随者的行为会很难看<br/>time: 每步的用时，单位为毫秒。0或不填则取主角的移速，如果后者也不存在就取0.1秒<br/>callback: 移动完毕后的回调函数，可选", 
          "!type": "fn(steps: [step], time?: number, callback?: fn())"
        }, 
        "changeFloor": {
          "!doc": "场景切换<br/>例如：core.changeFloor('MT0'); // 传送到主塔0层，主角坐标和朝向不变，黑屏时间取全塔属性中的值<br/>floorId: 传送的目标地图id，可以填':before'和':after'分别表示楼下或楼上<br/>stair: 传送的位置，可以填':now'（保持不变，可省略）,':symmetry'（中心对称）,':symmetry_x'（左右对称）,':symmetry_y'（上下对称）或图块id（该图块最好在目标层唯一，一般为'downFloor'或'upFloor'）<br/>heroLoc: 传送的坐标（如果填写了，就会覆盖上述的粗略目标位置）和传送后主角的朝向（不填表示保持不变）<br/>time: 传送的黑屏时间，单位为毫秒。可以填0（无黑屏）或不小于100的正整数，也可以省略（取全塔属性中的值）<br/>callback: 黑屏结束后的回调函数，可选（这居然不是最后一个参数）<br/>fromLoad: 本次场景切换是否为读档，读档会提示且没有黑屏，不会触发“每次到达事件”，也不会导致重生怪复活", 
          "!type": "fn(floorId: string, stair?: string, heroLoc?: {x?: number, y?: number, direction?: string}, time?: number, callback?: fn(), fromLoad?: bool)"
        }, 
        "getCommonEvent": {
          "!doc": "获得一个公共事件", 
          "!type": "fn(name: string) -> [?]"
        }, 
        "lose": {
          "!doc": "游戏失败事件", 
          "!type": "fn(reason?: string)"
        }, 
        "gameOver": {
          "!doc": "游戏结束<br/>例如：core.gameOver(); // 游戏失败<br/>ending: 结局名，省略表示失败<br/>fromReplay: true表示在播放录像，可选<br/>norank: true表示不计入榜单，可选", 
          "!type": "fn(ending?: string, fromReplay?: bool, norank?: bool)"
        }, 
        "useFly": {
          "!doc": "点击楼层传送器时的打开操作", 
          "!type": "fn(fromUserAction?: bool)"
        }, 
        "tryUseItem": {
          "!doc": "尝试使用一个道具<br/>例如：core.tryUseItem('pickaxe'); // 尝试使用破墙镐<br/>itemId: 道具id，其中敌人手册、传送器和飞行器会被特殊处理", 
          "!type": "fn(itemId: string)"
        }
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