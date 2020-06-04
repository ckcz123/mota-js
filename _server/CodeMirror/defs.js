var terndefs_f6783a0a_522d_417e_8407_94c67b692e50 = [
{
  "!name": "browser",
  "!define": {
    "Geolocation": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation",
      "!doc": "The Geolocation interface represents an object able to programmatically obtain the position of the device. It gives Web content access to the location of the device. This allows a Web site or app to offer customized results based on the user's location.",
      "clearWatch": {
        "!type": "fn(id: number)",
        "!doc": "The Geolocation.clearWatch() method is used to unregister location/error monitoring handlers previously installed using Geolocation.watchPosition().",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/clearWatch"
      },
      "getCurrentPosition": {
        "!type": "fn(sucess: fn(Position), error?: fn(PositionError), options?: PositionOptions)",
        "!doc": "The Geolocation.getCurrentPosition() method is used to get the current position of the device.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition"
      },
      "watchPosition": {
        "!type": "fn(sucess: fn(Position), error?: fn(PositionError), options?: PositionOptions)",
        "!doc": "The Geolocation.watchPosition() method is used to register a handler function that will be called automatically each time the position of the device changes. You can also, optionally, specify an error handling callback function.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition"
      }
    },
    "PositionOptions": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions",
      "!doc": "The PositionOptions interface describes an object containing option properties to pass as a parameter of Geolocation.getCurrentPosition() and Geolocation.watchPosition().",
      "enableHighAccuracy": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions/enableHighAccuracy",
        "!doc": "The PositionOptions.enableHighAccuracy property is a Boolean that indicates the application would like to receive the best possible results. If true and if the device is able to provide a more accurate position, it will do so. Note that this can result in slower response times or increased power consumption (with a GPS chip on a mobile device for example). On the other hand, if false (the default value), the device can take the liberty to save resources by responding more quickly and/or using less power."
      },
      "timeout": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions/timeout",
        "!doc": "The PositionOptions.timeout property is a positive long value representing the maximum length of time (in milliseconds) the device is allowed to take in order to return a position. The default value is Infinity, meaning that getCurrentPosition() won't return until the position is available."
      },
      "maximumAge": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions/maximumAge",
        "!doc": "The PositionOptions.maximumAge property is a positive long value indicating the maximum age in milliseconds of a possible cached position that is acceptable to return. If set to 0, it means that the device cannot use a cached position and must attempt to retrieve the real current position. If set to Infinity the device must return a cached position regardless of its age."
      }
    },
    "PositionError": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionError",
      "!doc": "The PositionError interface represents the reason of an error occurring when using the geolocating device.",
      "code": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionError/code",
        "!doc": "The PositionError.code read-only property is an unsigned short representing the error code."
      },
      "message": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PositionError/message",
        "!doc": "The PositionError.message read-only property returns a human-readable DOMString describing the details of the error."
      }
    },
    "Position": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Position",
      "!doc": "The Position interface represents the position of the concerned device at a given time. The position, represented by a Coordinates object, comprehends the 2D position of the device, on a spheroid representing the Earth, but also its altitude and its speed.",
      "coords": {
        "!type": "Coordinates",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Position/coords",
        "!doc": "The Position.coords read-only property, a Coordinates object, represents a geographic attitude: it contains the location, that is longitude and latitude on the Earth, the altitude, and the speed of the object concerned, regrouped inside the returned value. It also contains accuracy information about these values."
      },
      "timestamp": {
        "!type": "+DOMTimeStamp",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Position/timestamp",
        "!doc": "The Position.timestamp read-only property, a DOMTimeStamp object, represents the date and the time of the creation of the Position object it belongs to. The precision is to the millisecond."
      }
    },
    "Coordinates": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates",
      "!doc": "The Coordinates interface represents the position and altitude of the device on Earth, as well as the accuracy with which these properties are calculated.",
      "latitude": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/latitude",
        "!doc": "The Coordinates.latitude read-only property is a double representing the latitude of the position in decimal degrees."
      },
      "longitude": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/longitude",
        "!doc": "The Coordinates.longitude read-only property is a double representing the longitude of the position in decimal degrees."
      },
      "altitude": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/altitude",
        "!doc": "The Coordinates.altitude read-only property is a double representing the altitude of the position in meters, relative to sea level. This value is null if the implementation cannot provide this data."
      },
      "accuracy": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/accuracy",
        "!doc": "The Coordinates.accuracy read-only property is a strictly positive double representing the accuracy, with a 95% confidence level, of the Coordinates.latitude and Coordinates.longitude properties expressed in meters."
      },
      "altitudeAccuracy": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/altitudeAccuracy",
        "!doc": "The Coordinates.altitudeAccuracy read-only property is a strictly positive double representing the accuracy, with a 95% confidence level, of the altitude expressed in meters. This value is null if the implementation doesn't support measuring altitude."
      },
      "heading": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/heading",
        "!doc": "The Coordinates.heading read-only property is a double representing the direction in which the device is traveling. This value, specified in degrees, indicates how far off from heading due north the device is. 0 degrees represents true true north, and the direction is determined clockwise (which means that east is 90 degrees and west is 270 degrees). If Coordinates.speed is 0, heading is NaN. If the device is not able to provide heading information, this value is null."
      },
      "speed": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/speed",
        "!doc": "The Coordinates.speed read-only property is a double representing the velocity of the device in meters per second. This value is null if the implementation is not able to measure it."
      }
    },
    "MutationObserverInit": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#MutationObserverInit",
      "childList": "bool",
      "attributes": "bool",
      "characterData": "bool",
      "subtree": "bool",
      "attributeOldValue": "bool",
      "characterDataOldValue": "bool",
      "attributeFilter": "[string]"
    },
    "Permissions": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Permissions",
      "query": {
        "!type": "fn(descriptor: PermissionDescriptor) -> +Promise[:t=PermissionStatus]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query",
        "!doc": "Returns the user permission status for a given API."
      },
      "revoke": {
        "!type": "fn(descriptor: PermissionDescriptor) -> +Promise[:t=PermissionStatus]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Permissions/revoke",
        "!doc": "Revokes the permission currently set on a given API."
      }
    },
    "PermissionDescriptor": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query",
      "name": {
        "!type": "string",
        "!doc": "The name of the API whose permissions you want to query. Valid values are 'geolocation', 'midi', 'notifications', 'push', 'persistent-storage', 'camera' and 'microphone'."
      },
      "userVisibleOnly": {
        "!type": "bool",
        "!doc": "Indicates whether you want to show a notification for every message or be able to send silent push notifications. The default is false."
      },
      "sysex": {
        "!type": "bool",
        "!doc": "Indicates whether you need and/or receive system exclusive messages. The default is false."
      }
    },
    "PermissionStatus": {
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus",
      "state": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state",
        "!doc": "Returns the state of a requested permission; one of 'granted', 'denied', or 'prompt'."
      },
      "onchange": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/onchange",
        "!doc": "An event called whenever PermissionStatus.status changes."
      }
    }
  },
  "location": {
    "assign": {
      "!type": "fn(url: string)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "Load the document at the provided URL."
    },
    "replace": {
      "!type": "fn(url: string)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "Replace the current document with the one at the provided URL. The difference from the assign() method is that after using replace() the current page will not be saved in session history, meaning the user won't be able to use the Back button to navigate to it."
    },
    "reload": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "Reload the document from the current URL. forceget is a boolean, which, when it is true, causes the page to always be reloaded from the server. If it is false or not specified, the browser may reload the page from its cache."
    },
    "origin": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The origin of the URL."
    },
    "hash": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The part of the URL that follows the # symbol, including the # symbol."
    },
    "search": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The part of the URL that follows the ? symbol, including the ? symbol."
    },
    "pathname": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The path (relative to the host)."
    },
    "port": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The port number of the URL."
    },
    "hostname": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The host name (without the port number or square brackets)."
    },
    "host": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The host name and port number."
    },
    "protocol": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The protocol of the URL."
    },
    "href": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The entire URL."
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
    "!doc": "Returns a location object with information about the current location of the document. Assigning to the location property changes the current page to the new address."
  },
  "Node": {
    "!type": "fn()",
    "prototype": {
      "parentElement": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.parentElement",
        "!doc": "Returns the DOM node's parent Element, or null if the node either has no parent, or its parent isn't a DOM Element."
      },
      "textContent": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.textContent",
        "!doc": "Gets or sets the text content of a node and its descendants."
      },
      "baseURI": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.baseURI",
        "!doc": "The absolute base URI of a node or null if unable to obtain an absolute URI."
      },
      "localName": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.localName",
        "!doc": "Returns the local part of the qualified name of this node."
      },
      "prefix": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.prefix",
        "!doc": "Returns the namespace prefix of the specified node, or null if no prefix is specified. This property is read only."
      },
      "namespaceURI": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.namespaceURI",
        "!doc": "The namespace URI of the node, or null if the node is not in a namespace (read-only). When the node is a document, it returns the XML namespace for the current document."
      },
      "ownerDocument": {
        "!type": "+Document",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.ownerDocument",
        "!doc": "The ownerDocument property returns the top-level document object for this node."
      },
      "attributes": {
        "!type": "+NamedNodeMap",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.attributes",
        "!doc": "A collection of all attribute nodes registered to the specified node. It is a NamedNodeMap,not an Array, so it has no Array methods and the Attr nodes' indexes may differ among browsers."
      },
      "nextSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nextSibling",
        "!doc": "Returns the node immediately following the specified one in its parent's childNodes list, or null if the specified node is the last node in that list."
      },
      "previousSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.previousSibling",
        "!doc": "Returns the node immediately preceding the specified one in its parent's childNodes list, null if the specified node is the first in that list."
      },
      "lastChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.lastChild",
        "!doc": "Returns the last child of a node."
      },
      "firstChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.firstChild",
        "!doc": "Returns the node's first child in the tree, or null if the node is childless. If the node is a Document, it returns the first node in the list of its direct children."
      },
      "childNodes": {
        "!type": "+NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.childNodes",
        "!doc": "Returns a collection of child nodes of the given element."
      },
      "parentNode": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.parentNode",
        "!doc": "Returns the parent of the specified node in the DOM tree."
      },
      "nodeType": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeType",
        "!doc": "Returns an integer code representing the type of the node."
      },
      "nodeValue": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeValue",
        "!doc": "Returns or sets the value of the current node."
      },
      "nodeName": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeName",
        "!doc": "Returns the name of the current node as a string."
      },
      "tagName": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeName",
        "!doc": "Returns the name of the current node as a string."
      },
      "insertBefore": {
        "!type": "fn(newElt: +Element, before: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.insertBefore",
        "!doc": "Inserts the specified node before a reference element as a child of the current node."
      },
      "replaceChild": {
        "!type": "fn(newChild: +Element, oldChild: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.replaceChild",
        "!doc": "Replaces one child node of the specified element with another."
      },
      "removeChild": {
        "!type": "fn(oldNode: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.removeChild",
        "!doc": "Removes a child node from the DOM. Returns removed node."
      },
      "appendChild": {
        "!type": "fn(newNode: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.appendChild",
        "!doc": "Adds a node to the end of the list of children of a specified parent node. If the node already exists it is removed from current parent node, then added to new parent node."
      },
      "hasChildNodes": {
        "!type": "fn() -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.hasChildNodes",
        "!doc": "Returns a Boolean value indicating whether the current Node has child nodes or not."
      },
      "cloneNode": {
        "!type": "fn(deep: bool) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.cloneNode",
        "!doc": "Returns a duplicate of the node on which this method was called."
      },
      "normalize": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.normalize",
        "!doc": "Puts the specified node and all of its subtree into a \"normalized\" form. In a normalized subtree, no text nodes in the subtree are empty and there are no adjacent text nodes."
      },
      "isSupported": {
        "!type": "fn(features: string, version: number) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isSupported",
        "!doc": "Tests whether the DOM implementation implements a specific feature and that feature is supported by this node."
      },
      "hasAttributes": {
        "!type": "fn() -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.hasAttributes",
        "!doc": "Returns a boolean value of true or false, indicating if the current element has any attributes or not."
      },
      "lookupPrefix": {
        "!type": "fn(uri: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.lookupPrefix",
        "!doc": "Returns the prefix for a given namespaceURI if present, and null if not. When multiple prefixes are possible, the result is implementation-dependent."
      },
      "isDefaultNamespace": {
        "!type": "fn(uri: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isDefaultNamespace",
        "!doc": "Accepts a namespace URI as an argument and returns true if the namespace is the default namespace on the given node or false if not."
      },
      "lookupNamespaceURI": {
        "!type": "fn(uri: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.lookupNamespaceURI",
        "!doc": "Takes a prefix and returns the namespaceURI associated with it on the given node if found (and null if not). Supplying null for the prefix will return the default namespace."
      },
      "addEventListener": {
        "!type": "fn(type: string, listener: fn(e: +Event), capture: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.addEventListener",
        "!doc": "Registers a single event listener on a single target. The event target may be a single element in a document, the document itself, a window, or an XMLHttpRequest."
      },
      "removeEventListener": {
        "!type": "fn(type: string, listener: fn(), capture: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.removeEventListener",
        "!doc": "Allows the removal of event listeners from the event target."
      },
      "isSameNode": {
        "!type": "fn(other: +Element) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isSameNode",
        "!doc": "Tests whether two nodes are the same, that is they reference the same object."
      },
      "isEqualNode": {
        "!type": "fn(other: +Element) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isEqualNode",
        "!doc": "Tests whether two nodes are equal."
      },
      "compareDocumentPosition": {
        "!type": "fn(other: +Element) -> number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.compareDocumentPosition",
        "!doc": "Compares the position of the current node against another node in any other document."
      },
      "contains": {
        "!type": "fn(other: +Element) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.contains",
        "!doc": "Indicates whether a node is a descendent of a given node."
      },
      "dispatchEvent": {
        "!type": "fn(event: +Event) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.dispatchEvent",
        "!doc": "Dispatches an event into the event system. The event is subject to the same capturing and bubbling behavior as directly dispatched events."
      },
      "innerText": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText",
        "!doc": "Gets or sets the text content of a node and its descendants."
      },
      "ELEMENT_NODE": "number",
      "ATTRIBUTE_NODE": "number",
      "TEXT_NODE": "number",
      "CDATA_SECTION_NODE": "number",
      "ENTITY_REFERENCE_NODE": "number",
      "ENTITY_NODE": "number",
      "PROCESSING_INSTRUCTION_NODE": "number",
      "COMMENT_NODE": "number",
      "DOCUMENT_NODE": "number",
      "DOCUMENT_TYPE_NODE": "number",
      "DOCUMENT_FRAGMENT_NODE": "number",
      "NOTATION_NODE": "number",
      "DOCUMENT_POSITION_DISCONNECTED": "number",
      "DOCUMENT_POSITION_PRECEDING": "number",
      "DOCUMENT_POSITION_FOLLOWING": "number",
      "DOCUMENT_POSITION_CONTAINS": "number",
      "DOCUMENT_POSITION_CONTAINED_BY": "number",
      "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC": "number"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Node",
    "!doc": "A Node is an interface from which a number of DOM types inherit, and allows these various types to be treated (or tested) similarly."
  },
  "Element": {
    "!type": "fn()",
    "prototype": {
      "!proto": "Node.prototype",
      "getAttribute": {
        "!type": "fn(name: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttribute",
        "!doc": "Returns the value of the named attribute on the specified element. If the named attribute does not exist, the value returned will either be null or \"\" (the empty string)."
      },
      "setAttribute": {
        "!type": "fn(name: string, value: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttribute",
        "!doc": "Adds a new attribute or changes the value of an existing attribute on the specified element."
      },
      "removeAttribute": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.removeAttribute",
        "!doc": "Removes an attribute from the specified element."
      },
      "getAttributeNode": {
        "!type": "fn(name: string) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttributeNode",
        "!doc": "Returns the specified attribute of the specified element, as an Attr node."
      },
      "getElementsByTagName": {
        "!type": "fn(tagName: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getElementsByTagName",
        "!doc": "Returns a list of elements with the given tag name. The subtree underneath the specified element is searched, excluding the element itself. The returned list is live, meaning that it updates itself with the DOM tree automatically. Consequently, there is no need to call several times element.getElementsByTagName with the same element and arguments."
      },
      "getElementsByTagNameNS": {
        "!type": "fn(ns: string, tagName: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getElementsByTagNameNS",
        "!doc": "Returns a list of elements with the given tag name belonging to the given namespace."
      },
      "getAttributeNS": {
        "!type": "fn(ns: string, name: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttributeNS",
        "!doc": "Returns the string value of the attribute with the specified namespace and name. If the named attribute does not exist, the value returned will either be null or \"\" (the empty string)."
      },
      "setAttributeNS": {
        "!type": "fn(ns: string, name: string, value: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttributeNS",
        "!doc": "Adds a new attribute or changes the value of an attribute with the given namespace and name."
      },
      "removeAttributeNS": {
        "!type": "fn(ns: string, name: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.removeAttributeNS",
        "!doc": "removeAttributeNS removes the specified attribute from an element."
      },
      "getAttributeNodeNS": {
        "!type": "fn(ns: string, name: string) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttributeNodeNS",
        "!doc": "Returns the Attr node for the attribute with the given namespace and name."
      },
      "hasAttribute": {
        "!type": "fn(name: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.hasAttribute",
        "!doc": "hasAttribute returns a boolean value indicating whether the specified element has the specified attribute or not."
      },
      "hasAttributeNS": {
        "!type": "fn(ns: string, name: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.hasAttributeNS",
        "!doc": "hasAttributeNS returns a boolean value indicating whether the current element has the specified attribute."
      },
      "matches": {
        "!type": "fn(selectorString: string) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Element/matches",
        "!doc": "The Element.matches() method returns true if the element would be selected by the specified selector string; otherwise, returns false."
      },
      "append": {
        "!type": "fn(...nodes: [string|Node])",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append",
        "!doc": "This is an experimental technology\n\nThe Element.append method inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes."
      },
      "prepend": {
        "!type": "fn(...nodes: [string|Node])",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend",
        "!doc": "This is an experimental technology.\n\nThe Element.prepend method inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes."
      },
      "before": {
        "!type": "fn(...nodes: [string|Node])",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/before",
        "!doc": "This is an experimental technology.\n\nThe Element.before method inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes."
      },
      "after": {
        "!type": "fn(...nodes: [string|Node])",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/after",
        "!doc": "This is an experimental technology.\n\nThe Element.after() method inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes."
      },
      "closest": {
        "!type": "fn(selectors?: string)",
        "!url": "https://developer.mozilla.org/en/docs/Web/API/Element/closest",
        "!doc": "This is an experimental technology.\n\nThe Element.closest() method returns the closest ancestor of the current element (or the current element itself) which matches the selectors given in parameter. If there isn't such an ancestor, it returns null."
      },
      "focus": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.focus",
        "!doc": "Sets focus on the specified element, if it can be focused."
      },
      "blur": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.blur",
        "!doc": "The blur method removes keyboard focus from the current element."
      },
      "scrollIntoView": {
        "!type": "fn(top: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollIntoView",
        "!doc": "The scrollIntoView() method scrolls the element into view."
      },
      "scrollByLines": {
        "!type": "fn(lines: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollByLines",
        "!doc": "Scrolls the document by the given number of lines."
      },
      "scrollByPages": {
        "!type": "fn(pages: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollByPages",
        "!doc": "Scrolls the current document by the specified number of pages."
      },
      "getElementsByClassName": {
        "!type": "fn(name: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getElementsByClassName",
        "!doc": "Returns a set of elements which have all the given class names. When called on the document object, the complete document is searched, including the root node. You may also call getElementsByClassName on any element; it will return only elements which are descendants of the specified root element with the given class names."
      },
      "querySelector": {
        "!type": "fn(selectors: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.querySelector",
        "!doc": "Returns the first element that is a descendent of the element on which it is invoked that matches the specified group of selectors."
      },
      "querySelectorAll": {
        "!type": "fn(selectors: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.querySelectorAll",
        "!doc": "Returns a non-live NodeList of all elements descended from the element on which it is invoked that match the specified group of CSS selectors."
      },
      "getClientRects": {
        "!type": "fn() -> [+ClientRect]",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
        "!doc": "Returns a collection of rectangles that indicate the bounding rectangles for each box in a client."
      },
      "getBoundingClientRect": {
        "!type": "fn() -> +ClientRect",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getBoundingClientRect",
        "!doc": "Returns a text rectangle object that encloses a group of text rectangles."
      },
      "setAttributeNode": {
        "!type": "fn(attr: +Attr) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttributeNode",
        "!doc": "Adds a new Attr node to the specified element."
      },
      "removeAttributeNode": {
        "!type": "fn(attr: +Attr) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.removeAttributeNode",
        "!doc": "Removes the specified attribute from the current element."
      },
      "setAttributeNodeNS": {
        "!type": "fn(attr: +Attr) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttributeNodeNS",
        "!doc": "Adds a new namespaced attribute node to an element."
      },
      "insertAdjacentHTML": {
        "!type": "fn(position: string, text: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.insertAdjacentHTML",
        "!doc": "Parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position. It does not reparse the element it is being used on and thus it does not corrupt the existing elements inside the element. This, and avoiding the extra step of serialization make it much faster than direct innerHTML manipulation."
      },
      "children": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.children",
        "!doc": "Returns a collection of child elements of the given element."
      },
      "childElementCount": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.childElementCount",
        "!doc": "Returns the number of child elements of the given element."
      },
      "className": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.className",
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
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.style",
        "!doc": "Returns an object that represents the element's style attribute."
      },
      "classList": {
        "!type": "+DOMTokenList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.classList",
        "!doc": "Returns a token list of the class attribute of the element."
      },
      "contentEditable": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.contentEditable",
        "!doc": "Indicates whether or not the element is editable."
      },
      "firstElementChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.firstElementChild",
        "!doc": "Returns the element's first child element or null if there are no child elements."
      },
      "lastElementChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.lastElementChild",
        "!doc": "Returns the element's last child element or null if there are no child elements."
      },
      "nextElementSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.nextElementSibling",
        "!doc": "Returns the element immediately following the specified one in its parent's children list, or null if the specified element is the last one in the list."
      },
      "previousElementSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.previousElementSibling",
        "!doc": "Returns the element immediately prior to the specified one in its parent's children list, or null if the specified element is the first one in the list."
      },
      "tabIndex": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.tabIndex",
        "!doc": "Gets/sets the tab order of the current element."
      },
      "title": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.title",
        "!doc": "Establishes the text to be displayed in a 'tool tip' popup when the mouse is over the displayed node."
      },
      "width": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetWidth",
        "!doc": "Returns the layout width of an element."
      },
      "height": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetHeight",
        "!doc": "Height of an element relative to the element's offsetParent."
      },
      "getContext": {
        "!type": "fn(id: string) -> CanvasRenderingContext2D",
        "!url": "https://developer.mozilla.org/en/docs/DOM/HTMLCanvasElement",
        "!doc": "DOM canvas elements expose the HTMLCanvasElement interface, which provides properties and methods for manipulating the layout and presentation of canvas elements. The HTMLCanvasElement interface inherits the properties and methods of the element object interface."
      },
      "supportsContext": "fn(id: string) -> bool",
      "oncopy": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.oncopy",
        "!doc": "The oncopy property returns the onCopy event handler code on the current element."
      },
      "oncut": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.oncut",
        "!doc": "The oncut property returns the onCut event handler code on the current element."
      },
      "onpaste": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onpaste",
        "!doc": "The onpaste property returns the onPaste event handler code on the current element."
      },
      "onbeforeunload": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/HTML/Element/body",
        "!doc": "The HTML <body> element represents the main content of an HTML document. There is only one <body> element in a document."
      },
      "onfocus": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onfocus",
        "!doc": "The onfocus property returns the onFocus event handler code on the current element."
      },
      "onblur": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onblur",
        "!doc": "The onblur property returns the onBlur event handler code, if any, that exists on the current element."
      },
      "onchange": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onchange",
        "!doc": "The onchange property sets and returns the onChange event handler code for the current element."
      },
      "onclick": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onclick",
        "!doc": "The onclick property returns the onClick event handler code on the current element."
      },
      "ondblclick": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.ondblclick",
        "!doc": "The ondblclick property returns the onDblClick event handler code on the current element."
      },
      "onmousedown": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmousedown",
        "!doc": "The onmousedown property returns the onMouseDown event handler code on the current element."
      },
      "onmouseup": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseup",
        "!doc": "The onmouseup property returns the onMouseUp event handler code on the current element."
      },
      "onmousewheel": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/wheel",
        "!doc": "The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated. This event deprecates the legacy mousewheel event."
      },
      "onmouseover": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseover",
        "!doc": "The onmouseover property returns the onMouseOver event handler code on the current element."
      },
      "onmouseout": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseout",
        "!doc": "The onmouseout property returns the onMouseOut event handler code on the current element."
      },
      "onmousemove": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmousemove",
        "!doc": "The onmousemove property returns the mousemove event handler code on the current element."
      },
      "oncontextmenu": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.oncontextmenu",
        "!doc": "An event handler property for right-click events on the window. Unless the default behavior is prevented, the browser context menu will activate. Note that this event will occur with any non-disabled right-click event and does not depend on an element possessing the \"contextmenu\" attribute."
      },
      "onkeydown": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeydown",
        "!doc": "The onkeydown property returns the onKeyDown event handler code on the current element."
      },
      "onkeyup": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeyup",
        "!doc": "The onkeyup property returns the onKeyUp event handler code for the current element."
      },
      "onkeypress": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeypress",
        "!doc": "The onkeypress property sets and returns the onKeyPress event handler code for the current element."
      },
      "onresize": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onresize",
        "!doc": "onresize returns the element's onresize event handler code. It can also be used to set the code to be executed when the resize event occurs."
      },
      "onscroll": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onscroll",
        "!doc": "The onscroll property returns the onScroll event handler code on the current element."
      },
      "ondragstart": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DragDrop/Drag_Operations",
        "!doc": "The following describes the steps that occur during a drag and drop operation."
      },
      "ondragover": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragover",
        "!doc": "The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds)."
      },
      "ondragleave": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragleave",
        "!doc": "The dragleave event is fired when a dragged element or text selection leaves a valid drop target."
      },
      "ondragenter": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragenter",
        "!doc": "The dragenter event is fired when a dragged element or text selection enters a valid drop target."
      },
      "ondragend": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragend",
        "!doc": "The dragend event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key)."
      },
      "ondrag": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/drag",
        "!doc": "The drag event is fired when an element or text selection is being dragged (every few hundred milliseconds)."
      },
      "offsetTop": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetTop",
        "!doc": "Returns the distance of the current element relative to the top of the offsetParent node."
      },
      "offsetLeft": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetLeft",
        "!doc": "Returns the number of pixels that the upper left corner of the current element is offset to the left within the offsetParent node."
      },
      "offsetHeight": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetHeight",
        "!doc": "Height of an element relative to the element's offsetParent."
      },
      "offsetWidth": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetWidth",
        "!doc": "Returns the layout width of an element."
      },
      "scrollTop": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollTop",
        "!doc": "Gets or sets the number of pixels that the content of an element is scrolled upward."
      },
      "scrollLeft": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollLeft",
        "!doc": "Gets or sets the number of pixels that an element's content is scrolled to the left."
      },
      "scrollHeight": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollHeight",
        "!doc": "Height of the scroll view of an element; it includes the element padding but not its margin."
      },
      "scrollWidth": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollWidth",
        "!doc": "Read-only property that returns either the width in pixels of the content of an element or the width of the element itself, whichever is greater."
      },
      "clientTop": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientTop",
        "!doc": "The width of the top border of an element in pixels. It does not include the top margin or padding. clientTop is read-only."
      },
      "clientLeft": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientLeft",
        "!doc": "The width of the left border of an element in pixels. It includes the width of the vertical scrollbar if the text direction of the element is right-to-left and if there is an overflow causing a left vertical scrollbar to be rendered. clientLeft does not include the left margin or the left padding. clientLeft is read-only."
      },
      "clientHeight": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientHeight",
        "!doc": "Returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin."
      },
      "clientWidth": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientWidth",
        "!doc": "The inner width of an element in pixels. It includes padding but not the vertical scrollbar (if present, if rendered), border or margin."
      },
      "innerHTML": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.innerHTML",
        "!doc": "Sets or gets the HTML syntax describing the element's descendants."
      },
      "createdCallback": {
        "!type": "fn()",
        "!url": "http://w3c.github.io/webcomponents/spec/custom/index.html#dfn-created-callback",
        "!doc": "This callback is invoked after custom element instance is created and its definition is registered. The actual timing of this callback is defined further in this specification."
      },
      "attachedCallback": {
        "!type": "fn()",
        "!url": "http://w3c.github.io/webcomponents/spec/custom/index.html#dfn-entered-view-callback",
        "!doc": "Unless specified otherwise, this callback must be enqueued whenever custom element is inserted into a document and this document has a browsing context."
      },
      "detachedCallback": {
        "!type": "fn()",
        "!url": "http://w3c.github.io/webcomponents/spec/custom/index.html#dfn-left-view-callback",
        "!doc": "Unless specified otherwise, this callback must be enqueued whenever custom element is removed from the document and this document has a browsing context."
      },
      "attributeChangedCallback": {
        "!type": "fn()",
        "!url": "http://w3c.github.io/webcomponents/spec/custom/index.html#dfn-attribute-changed-callback",
        "!doc": "Unless specified otherwise, this callback must be enqueued whenever custom element's attribute is added, changed or removed."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Element",
    "!doc": "Represents an element in an HTML or XML document."
  },
  "Text": {
    "!type": "fn()",
    "prototype": {
      "!proto": "Node.prototype",
      "wholeText": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Text.wholeText",
        "!doc": "Returns all text of all Text nodes logically adjacent to the node.  The text is concatenated in document order.  This allows you to specify any text node and obtain all adjacent text as a single string."
      },
      "splitText": {
        "!type": "fn(offset: number) -> +Text",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Text.splitText",
        "!doc": "Breaks the Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Text",
    "!doc": "In the DOM, the Text interface represents the textual content of an Element or Attr.  If an element has no markup within its content, it has a single child implementing Text that contains the element's text.  However, if the element contains markup, it is parsed into information items and Text nodes that form its children."
  },
  "Document": {
    "!type": "fn()",
    "prototype": {
      "!proto": "Node.prototype",
      "activeElement": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.activeElement",
        "!doc": "Returns the currently focused element, that is, the element that will get keystroke events if the user types any. This attribute is read only."
      },
      "compatMode": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.compatMode",
        "!doc": "Indicates whether the document is rendered in Quirks mode or Strict mode."
      },
      "designMode": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.designMode",
        "!doc": "Can be used to make any document editable, for example in a <iframe />:"
      },
      "dir": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Document.dir",
        "!doc": "This property should indicate and allow the setting of the directionality of the text of the document, whether left to right (default) or right to left."
      },
      "height": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.height",
        "!doc": "Returns the height of the <body> element of the current document."
      },
      "width": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.width",
        "!doc": "Returns the width of the <body> element of the current document in pixels."
      },
      "characterSet": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.characterSet",
        "!doc": "Returns the character encoding of the current document."
      },
      "readyState": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.readyState",
        "!doc": "Returns \"loading\" while the document is loading, \"interactive\" once it is finished parsing but still loading sub-resources, and \"complete\" once it has loaded."
      },
      "location": {
        "!type": "location",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.location",
        "!doc": "Returns a Location object, which contains information about the URL of the document and provides methods for changing that URL."
      },
      "lastModified": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.lastModified",
        "!doc": "Returns a string containing the date and time on which the current document was last modified."
      },
      "head": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.head",
        "!doc": "Returns the <head> element of the current document. If there are more than one <head> elements, the first one is returned."
      },
      "body": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.body",
        "!doc": "Returns the <body> or <frameset> node of the current document."
      },
      "cookie": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.cookie",
        "!doc": "Get and set the cookies associated with the current document."
      },
      "URL": "string",
      "domain": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.domain",
        "!doc": "Gets/sets the domain portion of the origin of the current document, as used by the same origin policy."
      },
      "referrer": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.referrer",
        "!doc": "Returns the URI of the page that linked to this page."
      },
      "title": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.title",
        "!doc": "Gets or sets the title of the document."
      },
      "defaultView": {
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.defaultView",
        "!doc": "In browsers returns the window object associated with the document or null if none available."
      },
      "documentURI": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.documentURI",
        "!doc": "Returns the document location as string. It is read-only per DOM4 specification."
      },
      "xmlStandalone": "bool",
      "xmlVersion": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.xmlVersion",
        "!doc": "Returns the version number as specified in the XML declaration (e.g., <?xml version=\"1.0\"?>) or \"1.0\" if the declaration is absent."
      },
      "xmlEncoding": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Document.xmlEncoding",
        "!doc": "Returns the encoding as determined by the XML declaration. Should be null if unspecified or unknown."
      },
      "inputEncoding": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.inputEncoding",
        "!doc": "Returns a string representing the encoding under which the document was parsed (e.g. ISO-8859-1)."
      },
      "documentElement": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.documentElement",
        "!doc": "Read-only"
      },
      "implementation": {
        "hasFeature": "fn(feature: string, version: number) -> bool",
        "createDocumentType": {
          "!type": "fn(qualifiedName: string, publicId: string, systemId: string) -> +Element",
          "!url": "https://developer.mozilla.org/en/docs/DOM/DOMImplementation.createDocumentType",
          "!doc": "Returns a DocumentType object which can either be used with DOMImplementation.createDocument upon document creation or they can be put into the document via Node.insertBefore() or Node.replaceChild(): http://www.w3.org/TR/DOM-Level-3-Cor...l#ID-B63ED1A31 (less ideal due to features not likely being as accessible: http://www.w3.org/TR/DOM-Level-3-Cor...createDocument ). In any case, entity declarations and notations will not be available: http://www.w3.org/TR/DOM-Level-3-Cor...-createDocType   "
        },
        "createHTMLDocument": {
          "!type": "fn(title: string) -> +Document",
          "!url": "https://developer.mozilla.org/en/docs/DOM/DOMImplementation.createHTMLDocument",
          "!doc": "This method (available from document.implementation) creates a new HTML document."
        },
        "createDocument": {
          "!type": "fn(namespaceURI: string, qualifiedName: string, type: +Element) -> +Document",
          "!url": "https://developer.mozilla.org/en-US/docs/DOM/DOMImplementation.createHTMLDocument",
          "!doc": "This method creates a new HTML document."
        },
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.implementation",
        "!doc": "Returns a DOMImplementation object associated with the current document."
      },
      "doctype": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.doctype",
        "!doc": "Returns the Document Type Declaration (DTD) associated with current document. The returned object implements the DocumentType interface. Use DOMImplementation.createDocumentType() to create a DocumentType."
      },
      "open": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.open",
        "!doc": "The document.open() method opens a document for writing."
      },
      "close": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.close",
        "!doc": "The document.close() method finishes writing to a document, opened with document.open()."
      },
      "write": {
        "!type": "fn(html: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.write",
        "!doc": "Writes a string of text to a document stream opened by document.open()."
      },
      "writeln": {
        "!type": "fn(html: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.writeln",
        "!doc": "Writes a string of text followed by a newline character to a document."
      },
      "clear": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.clear",
        "!doc": "In recent versions of Mozilla-based applications as well as in Internet Explorer and Netscape 4 this method does nothing."
      },
      "hasFocus": {
        "!type": "fn() -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.hasFocus",
        "!doc": "Returns a Boolean value indicating whether the document or any element inside the document has focus. This method can be used to determine whether the active element in a document has focus."
      },
      "createElement": {
        "!type": "fn(tagName: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createElement",
        "!doc": "Creates the specified element."
      },
      "createElementNS": {
        "!type": "fn(ns: string, tagName: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createElementNS",
        "!doc": "Creates an element with the specified namespace URI and qualified name."
      },
      "createDocumentFragment": {
        "!type": "fn() -> +DocumentFragment",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createDocumentFragment",
        "!doc": "Creates a new empty DocumentFragment."
      },
      "createTextNode": {
        "!type": "fn(content: string) -> +Text",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createTextNode",
        "!doc": "Creates a new Text node."
      },
      "createComment": {
        "!type": "fn(content: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createComment",
        "!doc": "Creates a new comment node, and returns it."
      },
      "createCDATASection": {
        "!type": "fn(content: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createCDATASection",
        "!doc": "Creates a new CDATA section node, and returns it. "
      },
      "createProcessingInstruction": {
        "!type": "fn(content: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createProcessingInstruction",
        "!doc": "Creates a new processing instruction node, and returns it."
      },
      "createAttribute": {
        "!type": "fn(name: string) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createAttribute",
        "!doc": "Creates a new attribute node, and returns it."
      },
      "createAttributeNS": {
        "!type": "fn(ns: string, name: string) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Attr",
        "!doc": "This type represents a DOM element's attribute as an object. In most DOM methods, you will probably directly retrieve the attribute as a string (e.g., Element.getAttribute(), but certain functions (e.g., Element.getAttributeNode()) or means of iterating give Attr types."
      },
      "importNode": {
        "!type": "fn(node: +Element, deep: bool) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.importNode",
        "!doc": "Creates a copy of a node from an external document that can be inserted into the current document."
      },
      "getElementById": {
        "!type": "fn(id: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getElementById",
        "!doc": "Returns a reference to the element by its ID."
      },
      "getElementsByTagName": {
        "!type": "fn(tagName: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getElementsByTagName",
        "!doc": "Returns a NodeList of elements with the given tag name. The complete document is searched, including the root node. The returned NodeList is live, meaning that it updates itself automatically to stay in sync with the DOM tree without having to call document.getElementsByTagName again."
      },
      "getElementsByTagNameNS": {
        "!type": "fn(ns: string, tagName: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getElementsByTagNameNS",
        "!doc": "Returns a list of elements with the given tag name belonging to the given namespace. The complete document is searched, including the root node."
      },
      "createEvent": {
        "!type": "fn(type: string) -> +Event",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createEvent",
        "!doc": "Creates an event of the type specified. The returned object should be first initialized and can then be passed to element.dispatchEvent."
      },
      "createRange": {
        "!type": "fn() -> +Range",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createRange",
        "!doc": "Returns a new Range object."
      },
      "evaluate": {
        "!type": "fn(expr: ?) -> +XPathResult",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.evaluate",
        "!doc": "Returns an XPathResult based on an XPath expression and other given parameters."
      },
      "execCommand": {
        "!type": "fn(cmd: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands",
        "!doc": "Run command to manipulate the contents of an editable region."
      },
      "queryCommandEnabled": {
        "!type": "fn(cmd: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document",
        "!doc": "Returns true if the Midas command can be executed on the current range."
      },
      "queryCommandIndeterm": {
        "!type": "fn(cmd: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document",
        "!doc": "Returns true if the Midas command is in a indeterminate state on the current range."
      },
      "queryCommandState": {
        "!type": "fn(cmd: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document",
        "!doc": "Returns true if the Midas command has been executed on the current range."
      },
      "queryCommandSupported": {
        "!type": "fn(cmd: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.queryCommandSupported",
        "!doc": "Reports whether or not the specified editor query command is supported by the browser."
      },
      "queryCommandValue": {
        "!type": "fn(cmd: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document",
        "!doc": "Returns the current value of the current range for Midas command."
      },
      "getElementsByName": {
        "!type": "fn(name: string) -> +HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getElementsByName",
        "!doc": "Returns a list of elements with a given name in the HTML document."
      },
      "elementFromPoint": {
        "!type": "fn(x: number, y: number) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.elementFromPoint",
        "!doc": "Returns the element from the document whose elementFromPoint method is being called which is the topmost element which lies under the given point.  To get an element, specify the point via coordinates, in CSS pixels, relative to the upper-left-most point in the window or frame containing the document."
      },
      "getSelection": {
        "!type": "fn() -> +Selection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getSelection",
        "!doc": "The DOM getSelection() method is available on the Window and Document interfaces."
      },
      "adoptNode": {
        "!type": "fn(node: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.adoptNode",
        "!doc": "Adopts a node from an external document. The node and its subtree is removed from the document it's in (if any), and its ownerDocument is changed to the current document. The node can then be inserted into the current document."
      },
      "createTreeWalker": {
        "!type": "fn(root: +Element, mask: number) -> ?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createTreeWalker",
        "!doc": "Returns a new TreeWalker object."
      },
      "createExpression": {
        "!type": "fn(text: string) -> ?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createExpression",
        "!doc": "This method compiles an XPathExpression which can then be used for (repeated) evaluations."
      },
      "createNSResolver": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.createNSResolver",
        "!doc": "Creates an XPathNSResolver which resolves namespaces with respect to the definitions in scope for a specified node."
      },
      "scripts": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Document.scripts",
        "!doc": "Returns a list of the <script> elements in the document. The returned object is an HTMLCollection."
      },
      "plugins": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.plugins",
        "!doc": "Returns an HTMLCollection object containing one or more HTMLEmbedElements or null which represent the <embed> elements in the current document."
      },
      "embeds": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.embeds",
        "!doc": "Returns a list of the embedded OBJECTS within the current document."
      },
      "anchors": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.anchors",
        "!doc": "Returns a list of all of the anchors in the document."
      },
      "links": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.links",
        "!doc": "The links property returns a collection of all AREA elements and anchor elements in a document with a value for the href attribute. "
      },
      "forms": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.forms",
        "!doc": "Returns a collection (an HTMLCollection) of the form elements within the current document."
      },
      "styleSheets": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.styleSheets",
        "!doc": "Returns a list of stylesheet objects for stylesheets explicitly linked into or embedded in a document."
      },
      "currentScript": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/document.currentScript",
        "!doc": "Returns the <script> element whose script is currently being processed."
      },
      "registerElement": {
        "!type": "fn(type: string, options?: ?)",
        "!url": "http://w3c.github.io/webcomponents/spec/custom/#extensions-to-document-interface-to-register",
        "!doc": "The registerElement method of the Document interface provides a way to register a custom element and returns its custom element constructor."
      },
      "getElementsByClassName": "Element.prototype.getElementsByClassName",
      "querySelector": "Element.prototype.querySelector",
      "querySelectorAll": "Element.prototype.querySelectorAll"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/document",
    "!doc": "Each web page loaded in the browser has its own document object. This object serves as an entry point to the web page's content (the DOM tree, including elements such as <body> and <table>) and provides functionality global to the document (such as obtaining the page's URL and creating new elements in the document)."
  },
  "document": {
    "!type": "+Document",
    "!url": "https://developer.mozilla.org/en/docs/DOM/document",
    "!doc": "Each web page loaded in the browser has its own document object. This object serves as an entry point to the web page's content (the DOM tree, including elements such as <body> and <table>) and provides functionality global to the document (such as obtaining the page's URL and creating new elements in the document)."
  },
  "XMLDocument": {
    "!type": "fn()",
    "prototype": "Document.prototype",
    "!url": "https://developer.mozilla.org/en/docs/Parsing_and_serializing_XML",
    "!doc": "The Web platform provides the following objects for parsing and serializing XML:"
  },
  "HTMLElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement"
  },
  "HTMLAnchorElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement"
  },
  "HTMLAreaElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLAreaElement"
  },
  "HTMLAudioElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement"
  },
  "HTMLBaseElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLBaseElement"
  },
  "HTMLBodyElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLBodyElement"
  },
  "HTMLBRElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLBRElement"
  },
  "HTMLButtonElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement"
  },
  "HTMLCanvasElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement"
  },
  "HTMLDataElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDataElement"
  },
  "HTMLDataListElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDataListElement"
  },
  "HTMLDivElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement"
  },
  "HTMLDListElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDListElement"
  },
  "HTMLDocument": {
    "!type": "Document",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLDocument"
  },
  "HTMLEmbedElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLEmbedElement"
  },
  "HTMLFieldSetElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement"
  },
  "HTMLFormControlsCollection": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection"
  },
  "HTMLFormElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement"
  },
  "HTMLHeadElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLHeadElement"
  },
  "HTMLHeadingElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLHeadingElement"
  },
  "HTMLHRElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLHRElement"
  },
  "HTMLHtmlElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLHtmlElement"
  },
  "HTMLIFrameElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement"
  },
  "HTMLImageElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement"
  },
  "HTMLInputElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement"
  },
  "HTMLKeygenElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLKeygenElement"
  },
  "HTMLLabelElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement"
  },
  "HTMLLegendElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLLegendElement"
  },
  "HTMLLIElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLLIElement"
  },
  "HTMLLinkElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement"
  },
  "HTMLMapElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLMapElement"
  },
  "HTMLMediaElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement"
  },
  "HTMLMetaElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLMetaElement"
  },
  "HTMLMeterElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLMeterElement"
  },
  "HTMLModElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLModElement"
  },
  "HTMLObjectElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement"
  },
  "HTMLOListElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLOListElement"
  },
  "HTMLOptGroupElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptGroupElement"
  },
  "HTMLOptionElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement"
  },
  "HTMLOptionsCollection": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionsCollection"
  },
  "HTMLOutputElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLOutputElement"
  },
  "HTMLParagraphElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLParagraphElement"
  },
  "HTMLParamElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLParamElement"
  },
  "HTMLPreElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLPreElement"
  },
  "HTMLProgressElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLProgressElement"
  },
  "HTMLQuoteElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLQuoteElement"
  },
  "HTMLScriptElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement"
  },
  "HTMLSelectElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement"
  },
  "HTMLSourceElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLSourceElement"
  },
  "HTMLSpanElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLSpanElement"
  },
  "HTMLStyleElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement"
  },
  "HTMLTableCaptionElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCaptionElement"
  },
  "HTMLTableCellElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement"
  },
  "HTMLTableColElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableColElement"
  },
  "HTMLTableDataCellElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableDataCellElement"
  },
  "HTMLTableElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement"
  },
  "HTMLTableHeaderCellElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableHeaderCellElement"
  },
  "HTMLTableRowElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement"
  },
  "HTMLTableSectionElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableSectionElement"
  },
  "HTMLTextAreaElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement"
  },
  "HTMLTimeElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTimeElement"
  },
  "HTMLTitleElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTitleElement"
  },
  "HTMLTrackElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLTrackElement"
  },
  "HTMLUListElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLUListElement"
  },
  "HTMLUnknownElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLUnknownElement"
  },
  "HTMLVideoElement": {
    "!type": "Element",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement"
  },
  "Attr": {
    "!type": "fn()",
    "prototype": {
      "isId": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Attr",
        "!doc": "This type represents a DOM element's attribute as an object. In most DOM methods, you will probably directly retrieve the attribute as a string (e.g., Element.getAttribute(), but certain functions (e.g., Element.getAttributeNode()) or means of iterating give Attr types."
      },
      "name": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Attr",
        "!doc": "This type represents a DOM element's attribute as an object. In most DOM methods, you will probably directly retrieve the attribute as a string (e.g., Element.getAttribute(), but certain functions (e.g., Element.getAttributeNode()) or means of iterating give Attr types."
      },
      "value": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Attr",
        "!doc": "This type represents a DOM element's attribute as an object. In most DOM methods, you will probably directly retrieve the attribute as a string (e.g., Element.getAttribute(), but certain functions (e.g., Element.getAttributeNode()) or means of iterating give Attr types."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Attr",
    "!doc": "This type represents a DOM element's attribute as an object. In most DOM methods, you will probably directly retrieve the attribute as a string (e.g., Element.getAttribute(), but certain functions (e.g., Element.getAttributeNode()) or means of iterating give Attr types."
  },
  "NodeList": {
    "!type": "fn()",
    "prototype": {
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.length",
        "!doc": "Returns the number of items in a NodeList."
      },
      "item": {
        "!type": "fn(i: number) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NodeList.item",
        "!doc": "Returns a node from a NodeList by index."
      },
      "<i>": "+Element"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/NodeList",
    "!doc": "NodeList objects are collections of nodes returned by getElementsByTagName, getElementsByTagNameNS, Node.childNodes, querySelectorAll, getElementsByClassName, etc."
  },
  "HTMLCollection": {
    "!type": "fn()",
    "prototype": {
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/HTMLCollection",
        "!doc": "The number of items in the collection."
      },
      "item": {
        "!type": "fn(i: number) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/HTMLCollection",
        "!doc": "Returns the specific node at the given zero-based index into the list. Returns null if the index is out of range."
      },
      "namedItem": {
        "!type": "fn(name: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/HTMLCollection",
        "!doc": "Returns the specific node whose ID or, as a fallback, name matches the string specified by name. Matching by name is only done as a last resort, only in HTML, and only if the referenced element supports the name attribute. Returns null if no node exists by the given name."
      },
      "<i>": "+Element"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/HTMLCollection",
    "!doc": "HTMLCollection is an interface representing a generic collection of elements (in document order) and offers methods and properties for traversing the list."
  },
  "NamedNodeMap": {
    "!type": "fn()",
    "prototype": {
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "The number of items in the map."
      },
      "getNamedItem": {
        "!type": "fn(name: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Gets a node by name."
      },
      "setNamedItem": {
        "!type": "fn(node: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Adds (or replaces) a node by its nodeName."
      },
      "removeNamedItem": {
        "!type": "fn(name: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Removes a node (or if an attribute, may reveal a default if present)."
      },
      "item": {
        "!type": "fn(i: number) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Returns the item at the given index (or null if the index is higher or equal to the number of nodes)."
      },
      "getNamedItemNS": {
        "!type": "fn(ns: string, name: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Gets a node by namespace and localName."
      },
      "setNamedItemNS": {
        "!type": "fn(node: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Adds (or replaces) a node by its localName and namespaceURI."
      },
      "removeNamedItemNS": {
        "!type": "fn(ns: string, name: string) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
        "!doc": "Removes a node (or if an attribute, may reveal a default if present)."
      },
      "<i>": "+Element"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/NamedNodeMap",
    "!doc": "A collection of nodes returned by Element.attributes (also potentially for DocumentType.entities, DocumentType.notations). NamedNodeMaps are not in any particular order (unlike NodeList), although they may be accessed by an index as in an array (they may also be accessed with the item() method). A NamedNodeMap object are live and will thus be auto-updated if changes are made to their contents internally or elsewhere."
  },
  "DocumentFragment": {
    "!type": "fn()",
    "prototype": {
      "!proto": "Node.prototype"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/document.createDocumentFragment",
    "!doc": "Creates a new empty DocumentFragment."
  },
  "DOMTokenList": {
    "!type": "fn()",
    "prototype": {
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
        "!doc": "The amount of items in the list."
      },
      "item": {
        "!type": "fn(i: number) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
        "!doc": "Returns an item in the list by its index."
      },
      "contains": {
        "!type": "fn(token: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
        "!doc": "Return true if the underlying string contains token, otherwise false."
      },
      "add": {
        "!type": "fn(token: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
        "!doc": "Adds token to the underlying string."
      },
      "remove": {
        "!type": "fn(token: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
        "!doc": "Remove token from the underlying string."
      },
      "toggle": {
        "!type": "fn(token: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
        "!doc": "Removes token from string and returns false. If token doesn't exist it's added and the function returns true."
      },
      "<i>": "string"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/DOMTokenList",
    "!doc": "This type represents a set of space-separated tokens. Commonly returned by HTMLElement.classList, HTMLLinkElement.relList, HTMLAnchorElement.relList or HTMLAreaElement.relList. It is indexed beginning with 0 as with JavaScript arrays. DOMTokenList is always case-sensitive."
  },
  "XPathResult": {
    "!type": "fn()",
    "prototype": {
      "boolValue": "bool",
      "invalidIteratorState": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/Introduction_to_using_XPath_in_JavaScript",
        "!doc": "This document describes the interface for using XPath in JavaScript internally, in extensions, and from websites. Mozilla implements a fair amount of the DOM 3 XPath. Which means that XPath expressions can be run against both HTML and XML documents."
      },
      "numberValue": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/XPathResult",
        "!doc": "Refer to nsIDOMXPathResult for more detail."
      },
      "resultType": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.evaluate",
        "!doc": "Returns an XPathResult based on an XPath expression and other given parameters."
      },
      "singleNodeValue": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/Introduction_to_using_XPath_in_JavaScript",
        "!doc": "This document describes the interface for using XPath in JavaScript internally, in extensions, and from websites. Mozilla implements a fair amount of the DOM 3 XPath. Which means that XPath expressions can be run against both HTML and XML documents."
      },
      "snapshotLength": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/XPathResult",
        "!doc": "Refer to nsIDOMXPathResult for more detail."
      },
      "stringValue": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/Introduction_to_using_XPath_in_JavaScript",
        "!doc": "This document describes the interface for using XPath in JavaScript internally, in extensions, and from websites. Mozilla implements a fair amount of the DOM 3 XPath. Which means that XPath expressions can be run against both HTML and XML documents."
      },
      "iterateNext": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/Introduction_to_using_XPath_in_JavaScript",
        "!doc": "This document describes the interface for using XPath in JavaScript internally, in extensions, and from websites. Mozilla implements a fair amount of the DOM 3 XPath. Which means that XPath expressions can be run against both HTML and XML documents."
      },
      "snapshotItem": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en-US/docs/XPathResult#snapshotItem()"
      },
      "ANY_TYPE": "number",
      "NUMBER_TYPE": "number",
      "STRING_TYPE": "number",
      "BOOL_TYPE": "number",
      "UNORDERED_NODE_ITERATOR_TYPE": "number",
      "ORDERED_NODE_ITERATOR_TYPE": "number",
      "UNORDERED_NODE_SNAPSHOT_TYPE": "number",
      "ORDERED_NODE_SNAPSHOT_TYPE": "number",
      "ANY_UNORDERED_NODE_TYPE": "number",
      "FIRST_ORDERED_NODE_TYPE": "number"
    },
    "!url": "https://developer.mozilla.org/en/docs/XPathResult",
    "!doc": "Refer to nsIDOMXPathResult for more detail."
  },
  "ClientRect": {
    "!type": "fn()",
    "prototype": {
      "top": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
        "!doc": "Top of the box, in pixels, relative to the viewport."
      },
      "left": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
        "!doc": "Left of the box, in pixels, relative to the viewport."
      },
      "bottom": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
        "!doc": "Bottom of the box, in pixels, relative to the viewport."
      },
      "right": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
        "!doc": "Right of the box, in pixels, relative to the viewport."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
    "!doc": "Returns a collection of rectangles that indicate the bounding rectangles for each box in a client."
  },
  "DataTransfer": {
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer",
    "!doc": "This object is available from the dataTransfer property of all drag events. It cannot be created separately.",
    "prototype": {
      "dropEffect": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect",
        "!doc": "The actual effect that will be used, and should always be one of the possible values of effectAllowed."
      },
      "effectAllowed": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed",
        "!doc": "Specifies the effects that are allowed for this drag."
      },
      "files": {
        "!type": "+FileList",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files",
        "!doc": "Contains a list of all the local files available on the data transfer."
      },
      "items": {
        "!type": "[?]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items",
        "!doc": "The read-only DataTransfer property items property is a list of the data transfer items in a drag operation."
      },
      "types": {
        "!type": "[string]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types",
        "!doc": "Holds a list of the format types of the data that is stored for the first item, in the same order the data was added. An empty list will be returned if no data was added."
      },
      "clearData": {
        "!type": "fn(type?: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/clearData",
        "!doc": "Remove the data associated with a given type."
      },
      "getData": {
        "!type": "fn(type: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData",
        "!doc": "Retrieves the data for a given type, or an empty string if data for that type does not exist or the data transfer contains no data."
      },
      "setData": {
        "!type": "fn(type: string, data: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData",
        "!doc": "Set the data for a given type."
      },
      "setDragImage": {
        "!type": "fn(image: +Element)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage",
        "!doc": "Set the image to be used for dragging if a custom one is desired."
      }
    }
  },
  "Event": {
    "!type": "fn()",
    "prototype": {
      "stopPropagation": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.stopPropagation",
        "!doc": "Prevents further propagation of the current event."
      },
      "preventDefault": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.preventDefault",
        "!doc": "Cancels the event if it is cancelable, without stopping further propagation of the event."
      },
      "initEvent": {
        "!type": "fn(type: string, bubbles: bool, cancelable: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.initEvent",
        "!doc": "The initEvent method is used to initialize the value of an event created using document.createEvent."
      },
      "stopImmediatePropagation": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.stopImmediatePropagation",
        "!doc": "Prevents other listeners of the same event to be called."
      },
      "type": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/event.type",
        "!doc": "Returns a string containing the type of event."
      },
      "NONE": "number",
      "CAPTURING_PHASE": "number",
      "AT_TARGET": "number",
      "BUBBLING_PHASE": "number",
      "MOUSEDOWN": "number",
      "MOUSEUP": "number",
      "MOUSEOVER": "number",
      "MOUSEOUT": "number",
      "MOUSEMOVE": "number",
      "MOUSEDRAG": "number",
      "CLICK": "number",
      "DBLCLICK": "number",
      "KEYDOWN": "number",
      "KEYUP": "number",
      "KEYPRESS": "number",
      "DRAGDROP": "number",
      "FOCUS": "number",
      "BLUR": "number",
      "SELECT": "number",
      "CHANGE": "number",
      "target": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget",
        "!doc": "An EventTarget is a DOM interface implemented by objects that can receive DOM events and have listeners for them. The most common EventTargets are DOM elements, although other objects can be EventTargets too, for example document, window, XMLHttpRequest, and others."
      },
      "relatedTarget": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.relatedTarget",
        "!doc": "Identifies a secondary target for the event."
      },
      "pageX": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.pageX",
        "!doc": "Returns the horizontal coordinate of the event relative to whole document."
      },
      "pageY": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.pageY",
        "!doc": "Returns the vertical coordinate of the event relative to the whole document."
      },
      "clientX": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.clientX",
        "!doc": "Returns the horizontal coordinate within the application's client area at which the event occurred (as opposed to the coordinates within the page). For example, clicking in the top-left corner of the client area will always result in a mouse event with a clientX value of 0, regardless of whether the page is scrolled horizontally."
      },
      "clientY": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.clientY",
        "!doc": "Returns the vertical coordinate within the application's client area at which the event occurred (as opposed to the coordinates within the page). For example, clicking in the top-left corner of the client area will always result in a mouse event with a clientY value of 0, regardless of whether the page is scrolled vertically."
      },
      "keyCode": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.keyCode",
        "!doc": "Returns the Unicode value of a non-character key in a keypress event or any key in any other type of keyboard event."
      },
      "charCode": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.charCode",
        "!doc": "Returns the Unicode value of a character key pressed during a keypress event."
      },
      "which": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.which",
        "!doc": "Returns the numeric keyCode of the key pressed, or the character code (charCode) for an alphanumeric key pressed."
      },
      "button": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.button",
        "!doc": "Indicates which mouse button caused the event."
      },
      "shiftKey": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.shiftKey",
        "!doc": "Indicates whether the SHIFT key was pressed when the event fired."
      },
      "ctrlKey": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.ctrlKey",
        "!doc": "Indicates whether the CTRL key was pressed when the event fired."
      },
      "altKey": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.altKey",
        "!doc": "Indicates whether the ALT key was pressed when the event fired."
      },
      "metaKey": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.metaKey",
        "!doc": "Indicates whether the META key was pressed when the event fired."
      },
      "returnValue": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.onbeforeunload",
        "!doc": "An event that fires when a window is about to unload its resources. The document is still visible and the event is still cancelable."
      },
      "cancelBubble": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/event.cancelBubble",
        "!doc": "bool is the boolean value of true or false."
      },
      "dataTransfer": "+DataTransfer"
    }
  },
  "TouchEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/Touch_events",
    "!doc": "In order to provide quality support for touch-based user interfaces, touch events offer the ability to interpret finger activity on touch screens or trackpads."
  },
  "WheelEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/WheelEvent",
    "!doc": "The DOM WheelEvent represents events that occur due to the user moving a mouse wheel or similar input device."
  },
  "MouseEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/MouseEvent",
    "!doc": "The DOM MouseEvent represents events that occur due to the user interacting with a pointing device (such as a mouse). It's represented by the nsINSDOMMouseEvent interface, which extends the nsIDOMMouseEvent interface."
  },
  "KeyboardEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/KeyboardEvent",
    "!doc": "KeyboardEvent objects describe a user interaction with the keyboard. Each event describes a key; the event type (keydown, keypress, or keyup) identifies what kind of activity was performed."
  },
  "HashChangeEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onhashchange",
    "!doc": "The hashchange event fires when a window's hash changes."
  },
  "ErrorEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/DOM_event_reference/error",
    "!doc": "The error event is fired whenever a resource fails to load."
  },
  "CustomEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/Event/CustomEvent",
    "!doc": "The DOM CustomEvent are events initialized by an application for any purpose."
  },
  "BeforeLoadEvent": {
    "!type": "fn()",
    "prototype": "Event.prototype",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window",
    "!doc": "This section provides a brief reference for all of the methods, properties, and events available through the DOM window object. The window object implements the Window interface, which in turn inherits from the AbstractView interface. Some additional global functions, namespaces objects, and constructors, not typically associated with the window, but available on it, are listed in the JavaScript Reference."
  },
  "WebSocket": {
    "!type": "fn(url: string)",
    "prototype": {
      "close": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/CloseEvent",
        "!doc": "A CloseEvent is sent to clients using WebSockets when the connection is closed. This is delivered to the listener indicated by the WebSocket object's onclose attribute."
      },
      "send": {
        "!type": "fn(data: string)",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/WebSocket",
        "!doc": "The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection."
      },
      "binaryType": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/WebSocket",
        "!doc": "The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection."
      },
      "bufferedAmount": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/Writing_WebSocket_client_applications",
        "!doc": "WebSockets is a technology that makes it possible to open an interactive communication session between the user's browser and a server. Using a WebSocket connection, Web applications can perform real-time communication instead of having to poll for changes back and forth."
      },
      "extensions": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/WebSocket",
        "!doc": "The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection."
      },
      "onclose": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/CloseEvent",
        "!doc": "A CloseEvent is sent to clients using WebSockets when the connection is closed. This is delivered to the listener indicated by the WebSocket object's onclose attribute."
      },
      "onerror": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/Writing_WebSocket_client_applications",
        "!doc": "WebSockets is a technology that makes it possible to open an interactive communication session between the user's browser and a server. Using a WebSocket connection, Web applications can perform real-time communication instead of having to poll for changes back and forth."
      },
      "onmessage": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/WebSocket",
        "!doc": "The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection."
      },
      "onopen": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/WebSockets_reference/WebSocket",
        "!doc": "The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection."
      },
      "protocol": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets",
        "!doc": "WebSockets is an advanced technology that makes it possible to open an interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply."
      },
      "url": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/WebSockets/Writing_WebSocket_client_applications",
        "!doc": "WebSockets is a technology that makes it possible to open an interactive communication session between the user's browser and a server. Using a WebSocket connection, Web applications can perform real-time communication instead of having to poll for changes back and forth."
      },
      "CONNECTING": "number",
      "OPEN": "number",
      "CLOSING": "number",
      "CLOSED": "number"
    },
    "!url": "https://developer.mozilla.org/en/docs/WebSockets",
    "!doc": "WebSockets is an advanced technology that makes it possible to open an interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply."
  },
  "Worker": {
    "!type": "fn(scriptURL: string)",
    "prototype": {
      "postMessage": {
        "!type": "fn(message: ?)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Worker",
        "!doc": "Sends a message to the worker's inner scope. This accepts a single parameter, which is the data to send to the worker. The data may be any value or JavaScript object handled by the structured clone algorithm, which includes cyclical references."
      },
      "terminate": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Worker",
        "!doc": "Immediately terminates the worker. This does not offer the worker an opportunity to finish its operations; it is simply stopped at once."
      },
      "onmessage": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Worker",
        "!doc": "An event listener that is called whenever a MessageEvent with type message bubbles through the worker. The message is stored in the event's data member."
      },
      "onerror": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Worker",
        "!doc": "An event listener that is called whenever an ErrorEvent with type error bubbles through the worker."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Worker",
    "!doc": "Workers are background tasks that can be easily created and can send messages back to their creators. Creating a worker is as simple as calling the Worker() constructor, specifying a script to be run in the worker thread."
  },
  "Storage": {
    "length": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage/length",
      "!doc": "The length read-only property of the Storage interface returns an integer representing the number of data items stored in the Storage object."
    },
    "setItem": {
      "!type": "fn(name: string, value: string)",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem",
      "!doc": "The setItem() method of the Storage interface, when passed a key name and value, will add that key to the storage, or update that key's value if it already exists."
    },
    "getItem": {
      "!type": "fn(name: string) -> string",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem",
      "!doc": "The getItem() method of the Storage interface, when passed a key name, will return that key's value."
    },
    "key": {
      "!type": "fn(index: number) -> string",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage/key",
      "!doc": "The key() method of the Storage interface, when passed a number n, returns the name of the nth key in the storage. The order of keys is user-agent defined, so you should not rely on it."
    },
    "removeItem": {
      "!type": "fn(key: string)",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem",
      "!doc": "The removeItem() method of the Storage interface, when passed a key name, will remove that key from the storage."
    },
    "clear": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear",
      "!doc": "The clear() method of the Storage interface, when invoked, will empty all keys out of the storage"
    }
  },
  "localStorage": {
    "!type": "Storage",
    "!url": "https://developer.mozilla.org/en/docs/Web/API/Window/localStorage",
    "!doc": "The localStorage property allows you to access a local Storage object. localStorage is similar to sessionStorage. The only difference is that, while data stored in localStorage has no expiration time, data stored in sessionStorage gets cleared when the browsing session ends - that is, when the browser is closed.\n\nIt should be noted that data stored in either localStorage or sessionStorage is specific to the protocol of the page."
  },
  "sessionStorage": {
    "!type": "Storage",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage",
    "!doc": "The sessionStorage property allows you to access a session Storage object for the current origin. sessionStorage is similar to Window.localStorage, the only difference is while data stored in localStorage has no expiration set, data stored in sessionStorage gets cleared when the page session ends. A page session lasts for as long as the browser is open and survives over page reloads and restores. Opening a page in a new tab or window will cause a new session to be initiated, which differs from how session cookies work.\n\nIt should be noted that data stored in either sessionStorage or localStorage is specific to the protocol of the page."
  },
  "FileList": {
    "!type": "fn()",
    "prototype": {
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileList",
        "!doc": "A read-only value indicating the number of files in the list."
      },
      "item": {
        "!type": "fn(i: number) -> +File",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileList",
        "!doc": "Returns a File object representing the file at the specified index in the file list."
      },
      "<i>": "+File"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/FileList",
    "!doc": "An object of this type is returned by the files property of the HTML input element; this lets you access the list of files selected with the <input type=\"file\"> element. It's also used for a list of files dropped into web content when using the drag and drop API."
  },
  "File": {
    "!type": "fn(bits: []|string|ArrayBuffer|Blob, name: string, options?: ?)",
    "prototype": {
      "!proto": "Blob.prototype",
      "lastModified": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/File/lastModified",
        "!doc": "Returns the last modified time of the file, in millisecond since the UNIX epoch (January 1st, 1970 at Midnight)."
      },
      "name": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/File.name",
        "!doc": "Returns the name of the file. For security reasons, the path is excluded from this property."
      },
      "size": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/File.fileSize",
        "!doc": "Returns the size of a file in bytes."
      },
      "type": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/File/type",
        "!doc": "Returns the MIME type of the file."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/File",
    "!doc": "The File object provides information about -- and access to the contents of -- files. These are generally retrieved from a FileList object returned as a result of a user selecting files using the input element, or from a drag and drop operation's DataTransfer object."
  },
  "Blob": {
    "!type": "fn(parts: [?], options?: ?)",
    "prototype": {
      "size": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Blob/size",
        "!doc": "The size, in bytes, of the data contained in the Blob object. Read only."
      },
      "type": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Blob/type",
        "!doc": "An ASCII-encoded string, in all lower case, indicating the MIME type of the data contained in the Blob. If the type is unknown, this string is empty. Read only."
      },
      "slice": {
        "!type": "fn(start: number, end?: number, type?: string) -> +Blob",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Blob",
        "!doc": "Returns a new Blob object containing the data in the specified range of bytes of the source Blob."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Blob",
    "!doc": "A Blob object represents a file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system."
  },
  "FileReader": {
    "!type": "fn()",
    "prototype": {
      "abort": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Aborts the read operation. Upon return, the readyState will be DONE."
      },
      "readAsArrayBuffer": {
        "!type": "fn(blob: +Blob)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Starts reading the contents of the specified Blob, producing an ArrayBuffer."
      },
      "readAsBinaryString": {
        "!type": "fn(blob: +Blob)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Starts reading the contents of the specified Blob, producing raw binary data."
      },
      "readAsDataURL": {
        "!type": "fn(blob: +Blob)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Starts reading the contents of the specified Blob, producing a data: url."
      },
      "readAsText": {
        "!type": "fn(blob: +Blob, encoding?: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Starts reading the contents of the specified Blob, producing a string."
      },
      "EMPTY": "number",
      "LOADING": "number",
      "DONE": "number",
      "error": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "The error that occurred while reading the file. Read only."
      },
      "readyState": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Indicates the state of the FileReader. This will be one of the State constants. Read only."
      },
      "result": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "The file's contents. This property is only valid after the read operation is complete, and the format of the data depends on which of the methods was used to initiate the read operation. Read only."
      },
      "onabort": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Called when the read operation is aborted."
      },
      "onerror": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Called when an error occurs."
      },
      "onload": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Called when the read operation is successfully completed."
      },
      "onloadend": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Called when the read is completed, whether successful or not. This is called after either onload or onerror."
      },
      "onloadstart": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Called when reading the data is about to begin."
      },
      "onprogress": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
        "!doc": "Called periodically while the data is being read."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/FileReader",
    "!doc": "The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read. File objects may be obtained from a FileList object returned as a result of a user selecting files using the <input> element, from a drag and drop operation's DataTransfer object, or from the mozGetAsFile() API on an HTMLCanvasElement."
  },
  "URL": {
    "!type": "fn(url: string, base?: string)",
    "prototype": {
      "hash": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/hash",
        "!doc": "Is a DOMString containing a '#' followed by the fragment identifier of the URL."
      },
      "host": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/host",
        "!doc": "Is a DOMString containing the domain (that is the hostname) followed by (if a port was specified) a ':' and the port of the URL."
      },
      "hostname": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname",
        "!doc": "Is a DOMString containing the domain of the URL."
      },
      "href": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/href",
        "!doc": "Is a DOMString containing the whole URL."
      },
      "origin": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/origin",
        "!doc": "Returns a DOMString containing the origin of the URL, that is its scheme, its domain and its port."
      },
      "password": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/password",
        "!doc": "Is a DOMString containing the password specified before the domain name."
      },
      "pathname": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname",
        "!doc": "Is a DOMString containing an initial '/' followed by the path of the URL."
      },
      "port": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/port",
        "!doc": "Is a DOMString containing the port number of the URL."
      },
      "protocol": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/protocol",
        "!doc": "Is a DOMString containing the protocol scheme of the URL, including the final ':'."
      },
      "search": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/search",
        "!doc": "Is a DOMString containing a '?' followed by the parameters of the URL."
      },
      "searchParams": {
        "!type": "+URLSearchParams",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams",
        "!doc": "Returns a URLSearchParams object allowing to access the GET query arguments contained in the URL."
      },
      "username": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL/username",
        "!doc": "Is a DOMString containing the username specified before the domain name."
      }
    },
    "createObjectURL": {
      "!type": "fn(blob: +Blob) -> string",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL",
      "!doc": "The URL.createObjectURL() static method creates a DOMString containing an URL representing the object given in parameter."

    },
    "revokeObjectURL": {
      "!type": "fn(objectURL: string)",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL.revokeObjectURL",
      "!doc": "The URL.revokeObjectURL() static method releases an existing object URL which was previously created by calling window.URL.createObjectURL()."
    },
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URL",
    "!doc": "The URL interface represents an object providing static methods used for creating object URLs."
  },
  "URLSearchParams": {
    "!type": "fn(init?: string)",
    "prototype": {
      "append": {
        "!type": "fn(name: string, value: ?)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/append",
        "!doc": "Appends a specified key/value pair as a new search parameter."
      },
      "delete": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/delete",
        "!doc": "Deletes the given search parameter, and its associated value, from the list of all search parameters."
      },
      "entries": {
        "!type": "fn() -> +iter[:t=[string]]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/entries",
        "!doc": "Returns an iterator allowing to go through all key/value pairs contained in this object."
      },
      "get": {
        "!type": "fn(name: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get",
        "!doc": "Returns the first value associated to the given search parameter."
      },
      "getAll": {
        "!type": "fn(name: string) -> [string]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/getAll",
        "!doc": "Returns all the values associated with a given search parameter."
      },
      "has": {
        "!type": "fn(name: string) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/has",
        "!doc": "Returns a Boolean indicating if such a search parameter exists."
      },
      "keys": {
        "!type": "fn() -> +iter[:t=string]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/keys",
        "!doc": "Returns an iterator allowing to go through all keys of the key/value pairs contained in this object."
      },
      "set": {
        "!type": "fn(name: string, value: ?)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/set",
        "!doc": "Sets the value associated to a given search parameter to the given value. If there were several values, delete the others."
      },
      "sort": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/sort",
        "!doc": "Sorts all key/value pairs, if any, by their keys."
      },
      "toString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/toString",
        "!doc": "Returns a string containing a query string suitable for use in a URL."
      },
      "values": {
        "!type": "fn() -> +iter[:t=?]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/values",
        "!doc": "Returns an iterator allowing to go through all values of the key/value pairs contained in this object."
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams",
    "!doc": "The URLSearchParams interface defines utility methods to work with the query string of a URL."
  },
  "Range": {
    "!type": "fn()",
    "prototype": {
      "collapsed": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.collapsed",
        "!doc": "Returns a boolean indicating whether the range's start and end points are at the same position."
      },
      "commonAncestorContainer": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.commonAncestorContainer",
        "!doc": "Returns the deepest Node that contains the  startContainer and  endContainer Nodes."
      },
      "endContainer": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.endContainer",
        "!doc": "Returns the Node within which the Range ends."
      },
      "endOffset": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.endOffset",
        "!doc": "Returns a number representing where in the  endContainer the Range ends."
      },
      "startContainer": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.startContainer",
        "!doc": "Returns the Node within which the Range starts."
      },
      "startOffset": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.startOffset",
        "!doc": "Returns a number representing where in the startContainer the Range starts."
      },
      "setStart": {
        "!type": "fn(node: +Element, offset: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.setStart",
        "!doc": "Sets the start position of a Range."
      },
      "setEnd": {
        "!type": "fn(node: +Element, offset: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.setEnd",
        "!doc": "Sets the end position of a Range."
      },
      "setStartBefore": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.setStartBefore",
        "!doc": "Sets the start position of a Range relative to another Node."
      },
      "setStartAfter": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.setStartAfter",
        "!doc": "Sets the start position of a Range relative to a Node."
      },
      "setEndBefore": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.setEndBefore",
        "!doc": "Sets the end position of a Range relative to another Node."
      },
      "setEndAfter": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.setEndAfter",
        "!doc": "Sets the end position of a Range relative to another Node."
      },
      "selectNode": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.selectNode",
        "!doc": "Sets the Range to contain the Node and its contents."
      },
      "selectNodeContents": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.selectNodeContents",
        "!doc": "Sets the Range to contain the contents of a Node."
      },
      "collapse": {
        "!type": "fn(toStart: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.collapse",
        "!doc": "Collapses the Range to one of its boundary points."
      },
      "cloneContents": {
        "!type": "fn() -> +DocumentFragment",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.cloneContents",
        "!doc": "Returns a DocumentFragment copying the Nodes of a Range."
      },
      "deleteContents": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.deleteContents",
        "!doc": "Removes the contents of a Range from the Document."
      },
      "extractContents": {
        "!type": "fn() -> +DocumentFragment",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.extractContents",
        "!doc": "Moves contents of a Range from the document tree into a DocumentFragment."
      },
      "insertNode": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.insertNode",
        "!doc": "Insert a node at the start of a Range."
      },
      "surroundContents": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.surroundContents",
        "!doc": "Moves content of a Range into a new node, placing the new node at the start of the specified range."
      },
      "compareBoundaryPoints": {
        "!type": "fn(how: number, other: +Range) -> number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.compareBoundaryPoints",
        "!doc": "Compares the boundary points of two Ranges."
      },
      "cloneRange": {
        "!type": "fn() -> +Range",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.cloneRange",
        "!doc": "Returns a Range object with boundary points identical to the cloned Range."
      },
      "detach": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/range.detach",
        "!doc": "Releases a Range from use to improve performance. This lets the browser choose to release resources associated with this Range. Subsequent attempts to use the detached range will result in a DOMException being thrown with an error code of INVALID_STATE_ERR."
      },
      "END_TO_END": "number",
      "END_TO_START": "number",
      "START_TO_END": "number",
      "START_TO_START": "number"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/range.detach",
    "!doc": "Releases a Range from use to improve performance. This lets the browser choose to release resources associated with this Range. Subsequent attempts to use the detached range will result in a DOMException being thrown with an error code of INVALID_STATE_ERR."
  },
  "XMLHttpRequest": {
    "!type": "fn()",
    "prototype": {
      "abort": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Aborts the request if it has already been sent."
      },
      "getAllResponseHeaders": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Returns all the response headers as a string, or null if no response has been received. Note: For multipart requests, this returns the headers from the current part of the request, not from the original channel."
      },
      "getResponseHeader": {
        "!type": "fn(header: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Returns the string containing the text of the specified header, or null if either the response has not yet been received or the header doesn't exist in the response."
      },
      "open": {
        "!type": "fn(method: string, url: string, async?: bool, user?: string, password?: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Initializes a request."
      },
      "overrideMimeType": {
        "!type": "fn(type: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Overrides the MIME type returned by the server."
      },
      "send": {
        "!type": "fn(data?: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent. If the request is synchronous, this method doesn't return until the response has arrived."
      },
      "setRequestHeader": {
        "!type": "fn(header: string, value: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Sets the value of an HTTP request header.You must call setRequestHeader() after open(), but before send()."
      },
      "onabort": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onabort",
        "!doc": "The XMLHttpRequestEventTarget.onabort is the function called when an XMLHttpRequest transaction is aborted, such as when the XMLHttpRequest.abort() function is called."
      },
      "onerror": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onerror",
        "!doc": "The XMLHttpRequestEventTarget.onerror is the function called when an XMLHttpRequest transaction fails due to an error."
      },
      "onload": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onload",
        "!doc": "The XMLHttpRequestEventTarget.onload is the function called when an XMLHttpRequest transaction completes successfully."
      },
      "onloadstart": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onloadstart",
        "!doc": "The XMLHttpRequestEventTarget.onloadstart is the function called when an XMLHttpRequest transaction starts transferring data."
      },
      "onloadend": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onloadend",
        "!doc": "The XMLHttpRequestEventTarget.onloadend is the function called when an XMLHttpRequest transaction completes transferring data."
      },
      "onprogress": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onprogress",
        "!doc": "The XMLHttpRequestEventTarget.onprogress is the function called periodically with information when an XMLHttpRequest before success completely."
      },
      "ontimeout": {
        "!type": "fn()",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/ontimeout",
        "!doc": "The XMLHttpRequestEventTarget.ontimeout is the function called when the XMLHttpRequest times out."
      },
      "addEventListener": {
        "!type": "fn(type: string, listener: fn(), options?: ?, useCapture?: bool)",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
        "!doc": "The EventTarget.addEventListener() method registers the specified listener on the EventTarget it's called on. The event target may be an Element in a document, the Document itself, a Window, or any other object that supports events (such as XMLHttpRequest)."
      },
      "removeEventListener": {
        "!type": "fn(type: string, listener: fn(), options?: ?, useCapture?: bool)",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener",
        "!doc": "Removes the event listener previously registered with EventTarget.addEventListener()."
      },
      "dispatchEvent": {
        "!type": "fn(event: ?)",
        "!url" : "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent",
        "!doc": "Dispatches an Event at the specified EventTarget, invoking the affected EventListeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) apply to events dispatched manually with dispatchEvent()."
      },
      "onreadystatechange": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "A JavaScript function object that is called whenever the readyState attribute changes."
      },
      "readyState": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "The state of the request. (0=unsent, 1=opened, 2=headers_received, 3=loading, 4=done)"
      },
      "response": {
        "!type": "+Document",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "The response entity body according to responseType, as an ArrayBuffer, Blob, Document, JavaScript object (for \"json\"), or string. This is null if the request is not complete or was not successful."
      },
      "responseText": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "The response to the request as text, or null if the request was unsuccessful or has not yet been sent."
      },
      "responseType": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "Can be set to change the response type."
      },
      "responseXML": {
        "!type": "+Document",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "The response to the request as a DOM Document object, or null if the request was unsuccessful, has not yet been sent, or cannot be parsed as XML or HTML."
      },
      "status": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "The status of the response to the request. This is the HTTP result code"
      },
      "statusText": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
        "!doc": "The response string returned by the HTTP server. Unlike status, this includes the entire text of the response message (\"200 OK\", for example)."
      },
      "timeout": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest/Synchronous_and_Asynchronous_Requests",
        "!doc": "The number of milliseconds a request can take before automatically being terminated. A value of 0 (which is the default) means there is no timeout."
      },
      "UNSENT": "number",
      "OPENED": "number",
      "HEADERS_RECEIVED": "number",
      "LOADING": "number",
      "DONE": "number"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/XMLHttpRequest",
    "!doc": "XMLHttpRequest is a JavaScript object that was designed by Microsoft and adopted by Mozilla, Apple, and Google. It's now being standardized in the W3C. It provides an easy way to retrieve data at a URL. Despite its name, XMLHttpRequest can be used to retrieve any type of data, not just XML, and it supports protocols other than HTTP (including file and ftp)."
  },
  "DOMParser": {
    "!type": "fn()",
    "prototype": {
      "parseFromString": {
        "!type": "fn(data: string, mime: string) -> +Document",
        "!url": "https://developer.mozilla.org/en/docs/DOM/DOMParser",
        "!doc": "DOMParser can parse XML or HTML source stored in a string into a DOM Document. DOMParser is specified in DOM Parsing and Serialization."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/DOMParser",
    "!doc": "DOMParser can parse XML or HTML source stored in a string into a DOM Document. DOMParser is specified in DOM Parsing and Serialization."
  },
  "FormData": {
    "!type": "fn()",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData",
    "prototype": {
      "append": {
        "!type": "fn(name: string, value: string|+Blob, filename?: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/append",
        "!doc": "Appends a new value onto an existing key inside a FormData object, or adds the key if it does not already exist."
      },
      "delete": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/delete",
        "!doc": "Deletes a key/value pair from a FormData object."
      },
      "entries": {
        "!type": "fn() -> +iter[:t=[number, string|+Blob]]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries",
        "!doc": "Returns an iterator allowing to go through all key/value pairs contained in this object."
      },
      "get": {
        "!type": "fn(name: string) -> string|+Blob",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/get",
        "!doc": "Returns the first value associated with a given key from within a FormData object."
      },
      "getAll": {
        "!type": "fn(name: string) -> [string|+Blob]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/getAll",
        "!doc": "Returns an array of all the values associated with a given key from within a FormData."
      },
      "has": {
        "!type": "fn(name: string) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/has",
        "!doc": "Returns a boolean stating whether a FormData object contains a certain key/value pair."
      },
      "set": {
        "!type": "fn(name: string, value: string|+Blob, filename?: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/set",
        "!doc": "Sets a new value for an existing key inside a FormData object, or adds the key/value if it does not already exist."
      },
      "keys": {
        "!type": "fn() -> +iter[:t=number]",
        "!doc": "Returns an iterator allowing to go through all keys of the key/value pairs contained in this object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/keys"
      },
      "values": {
        "!type": "fn() -> +iter[:t=string|blob]",
        "!doc": "Returns an iterator allowing to go through all values of the key/value pairs contained in this object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/FormData/values"
      }
    }
  },
  "Selection": {
    "!type": "fn()",
    "prototype": {
      "anchorNode": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/anchorNode",
        "!doc": "Returns the node in which the selection begins."
      },
      "anchorOffset": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/anchorOffset",
        "!doc": "Returns the number of characters that the selection's anchor is offset within the anchorNode."
      },
      "focusNode": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/focusNode",
        "!doc": "Returns the node in which the selection ends."
      },
      "focusOffset": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/focusOffset",
        "!doc": "Returns the number of characters that the selection's focus is offset within the focusNode. "
      },
      "isCollapsed": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/isCollapsed",
        "!doc": "Returns a boolean indicating whether the selection's start and end points are at the same position."
      },
      "rangeCount": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/rangeCount",
        "!doc": "Returns the number of ranges in the selection."
      },
      "getRangeAt": {
        "!type": "fn(i: number) -> +Range",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/getRangeAt",
        "!doc": "Returns a range object representing one of the ranges currently selected."
      },
      "collapse": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/collapse",
        "!doc": "Collapses the current selection to a single point. The document is not modified. If the content is focused and editable, the caret will blink there."
      },
      "extend": {
        "!type": "fn(node: +Element, offset: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/extend",
        "!doc": "Moves the focus of the selection to a specified point. The anchor of the selection does not move. The selection will be from the anchor to the new focus regardless of direction."
      },
      "collapseToStart": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/collapseToStart",
        "!doc": "Collapses the selection to the start of the first range in the selection.  If the content of the selection is focused and editable, the caret will blink there."
      },
      "collapseToEnd": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/collapseToEnd",
        "!doc": "Collapses the selection to the end of the last range in the selection.  If the content the selection is in is focused and editable, the caret will blink there."
      },
      "selectAllChildren": {
        "!type": "fn(node: +Element)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/selectAllChildren",
        "!doc": "Adds all the children of the specified node to the selection. Previous selection is lost."
      },
      "addRange": {
        "!type": "fn(range: +Range)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/addRange",
        "!doc": "Adds a Range to a Selection."
      },
      "removeRange": {
        "!type": "fn(range: +Range)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/removeRange",
        "!doc": "Removes a range from the selection."
      },
      "removeAllRanges": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/removeAllRanges",
        "!doc": "Removes all ranges from the selection, leaving the anchorNode and focusNode properties equal to null and leaving nothing selected. "
      },
      "deleteFromDocument": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/deleteFromDocument",
        "!doc": "Deletes the actual text being represented by a selection object from the document's DOM."
      },
      "containsNode": {
        "!type": "fn(node: +Element) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Selection/containsNode",
        "!doc": "Indicates if the node is part of the selection."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Selection",
    "!doc": "Selection is the class of the object returned by window.getSelection() and other methods. It represents the text selection in the greater page, possibly spanning multiple elements, when the user drags over static text and other parts of the page. For information about text selection in an individual text editing element."
  },
  "console": {
    "assert": {
      "!type": "fn(assertion: bool, text: string)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.assert",
      "!doc": "Writes an error message to the console if the assertion is false."
    },
    "clear": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Console/clear",
      "!doc": "    Clear the console."
    },
    "count": {
      "!type": "fn(label?: string)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.count",
      "!doc": "Logs the number of times that this particular call to count() has been called."
    },
    "debug": "console.log",
    "dir": {
      "!type": "fn(object: ?)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.dir",
      "!doc": "Displays an interactive list of the properties of the specified JavaScript object."
    },
    "error": {
      "!type": "fn(...msg: ?)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/console.error",
      "!doc": "Outputs an error message to the Web Console."
    },
    "group": {
      "!type": "fn(label?: string)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.group",
      "!doc": "Creates a new inline group in the Web Console log."
    },
    "groupCollapsed": {
      "!type": "fn(label?: string)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.groupCollapsed",
      "!doc": "Creates a new inline group in the Web Console log."
    },
    "groupEnd": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.groupEnd",
      "!doc": "Exits the current inline group in the Web Console."
    },
    "info": {
      "!type": "fn(...msg: ?)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/console.info",
      "!doc": "Outputs an informational message to the Web Console."
    },
    "log": {
      "!type": "fn(...msg: ?)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/console.log",
      "!doc": "Outputs a message to the Web Console."
    },
    "table": {
      "!type": "fn(data: []|?, columns?: [])",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Console/table",
      "!doc": "    Displays tabular data as a table."
    },
    "time": {
      "!type": "fn(label: string)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.time",
      "!doc": "Starts a timer you can use to track how long an operation takes."
    },
    "timeEnd": {
      "!type": "fn(label: string)",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.timeEnd",
      "!doc": "Stops a timer that was previously started by calling console.time()."
    },
    "trace": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en/docs/Web/API/Console.trace",
      "!doc": "Outputs a stack trace to the Web Console."
    },
    "warn": {
      "!type": "fn(...msg: ?)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/console.warn",
      "!doc": "Outputs a warning message to the Web Console."
    },
    "!url": "https://developer.mozilla.org/en/docs/Web/API/Console",
    "!doc": "The console object provides access to the browser's debugging console. The specifics of how it works vary from browser to browser, but there is a de facto set of features that are typically provided."
  },
  "top": {
    "!type": "<top>",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.top",
    "!doc": "Returns a reference to the topmost window in the window hierarchy."
  },
  "parent": {
    "!type": "<top>",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.parent",
    "!doc": "A reference to the parent of the current window or subframe."
  },
  "window": {
    "!type": "<top>",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window",
    "!doc": "The window object represents a window containing a DOM document."
  },
  "opener": {
    "!type": "<top>",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.opener",
    "!doc": "Returns a reference to the window that opened this current window."
  },
  "self": {
    "!type": "<top>",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.self",
    "!doc": "Returns an object reference to the window object. "
  },
  "devicePixelRatio": "number",
  "name": {
    "!type": "string",
    "!url": "https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Function/name",
    "!doc": "The name of the function."
  },
  "closed": {
    "!type": "bool",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.closed",
    "!doc": "This property indicates whether the referenced window is closed or not."
  },
  "pageYOffset": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollY",
    "!doc": "Returns the number of pixels that the document has already been scrolled vertically."
  },
  "pageXOffset": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollX",
    "!doc": "Returns the number of pixels that the document has already been scrolled vertically."
  },
  "scrollY": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollY",
    "!doc": "Returns the number of pixels that the document has already been scrolled vertically."
  },
  "scrollX": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollX",
    "!doc": "Returns the number of pixels that the document has already been scrolled vertically."
  },
  "screenTop": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.top",
    "!doc": "Returns the distance in pixels from the top side of the current screen."
  },
  "screenLeft": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.left",
    "!doc": "Returns the distance in pixels from the left side of the main screen to the left side of the current screen."
  },
  "screenY": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/event.screenY",
    "!doc": "Returns the vertical coordinate of the event within the screen as a whole."
  },
  "screenX": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/event.screenX",
    "!doc": "Returns the horizontal coordinate of the event within the screen as a whole."
  },
  "innerWidth": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.innerWidth",
    "!doc": "Width (in pixels) of the browser window viewport including, if rendered, the vertical scrollbar."
  },
  "innerHeight": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.innerHeight",
    "!doc": "Height (in pixels) of the browser window viewport including, if rendered, the horizontal scrollbar."
  },
  "outerWidth": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.outerWidth",
    "!doc": "window.outerWidth gets the width of the outside of the browser window. It represents the width of the whole browser window including sidebar (if expanded), window chrome and window resizing borders/handles."
  },
  "outerHeight": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.outerHeight",
    "!doc": "window.outerHeight gets the height in pixels of the whole browser window."
  },
  "frameElement": {
    "!type": "+Element",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.frameElement",
    "!doc": "Returns the element (such as <iframe> or <object>) in which the window is embedded, or null if the window is top-level."
  },
  "crypto": {
    "getRandomValues": {
      "!type": "fn([number])",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.crypto.getRandomValues",
      "!doc": "This methods lets you get cryptographically random values."
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.crypto.getRandomValues",
    "!doc": "This methods lets you get cryptographically random values."
  },
  "navigator": {
    "geolocation": {
      "!type": "+Geolocation",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation",
      "!doc": "The Navigator.geolocation read-only property returns a Geolocation object that gives Web content access to the location of the device. This allows a Web site or app to offer customized results based on the user's location."
    },
    "appName": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.navigator.appName",
      "!doc": "Returns the name of the browser. The HTML5 specification also allows any browser to return \"Netscape\" here, for compatibility reasons."
    },
    "appVersion": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.navigator.appVersion",
      "!doc": "Returns the version of the browser as a string. It may be either a plain version number, like \"5.0\", or a version number followed by more detailed information. The HTML5 specification also allows any browser to return \"4.0\" here, for compatibility reasons."
    },
    "language": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language",
      "!doc": "Returns a string representing the language version of the browser."
    },
    "languages": {
      "!type": "[string]",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages",
      "!doc": "Returns a string representing the language version of the browser."
    },
    "onLine": {
      "!type": "bool",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine",
      "!doc": "Returns a Boolean indicating whether the browser is working online."
    },
    "oscpu": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/oscpu",
      "!doc": "Returns a string that represents the current operating system."
    },
    "permissions": {
      "!type": "Permissions",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions",
      "!doc": "Returns a Permissions object that can be used to query and update permission status of APIs covered by the Permissions API."
    },
    "platform": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/platform",
      "!doc": "Returns a string representing the platform of the browser."
    },
    "plugins": {
      "!type": "[?]",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.navigator.plugins",
      "!doc": "Returns a PluginArray object, listing the plugins installed in the application."
    },
    "sendBeacon": {
      "!type": "fn(url: string, data?: ?)",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon",
      "!doc": "Used to asynchronously transfer a small amount of data using HTTP from the User Agent to a web server."
    },
    "userAgent": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.navigator.userAgent",
      "!doc": "Returns the user agent string for the current browser."
    },
    "vendor": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.navigator.vendor",
      "!doc": "Returns the name of the browser vendor for the current browser."
    },
    "vibrate": {
      "!type": "fn(pattern: number|[number])",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate",
      "!doc": "Causes vibration on devices with support for it. Does nothing if vibration support isn't available."
    },
    "cookieEnabled": {
      "!type": "bool",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled",
      "!doc": "Returns false if setting a cookie will be ignored and true otherwise."
    },
    "javaEnabled": {
      "!type": "fn() -> bool",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins/javaEnabled",
      "!doc": "Returns a Boolean flag indicating whether the host browser is Java-enabled or not."
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.navigator",
    "!doc": "Returns a reference to the navigator object, which can be queried for information about the application running the script."
  },
  "history": {
    "state": {
      "!type": "?",
      "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
      "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
    },
    "length": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
      "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
    },
    "go": {
      "!type": "fn(delta: number)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.history",
      "!doc": "Returns a reference to the History object, which provides an interface for manipulating the browser session history (pages visited in the tab or frame that the current page is loaded in)."
    },
    "forward": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
      "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
    },
    "back": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
      "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
    },
    "pushState": {
      "!type": "fn(data: ?, title: string, url?: string)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
      "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
    },
    "replaceState": {
      "!type": "fn(data: ?, title: string, url?: string)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
      "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Manipulating_the_browser_history",
    "!doc": "The DOM window object provides access to the browser's history through the history object. It exposes useful methods and properties that let you move back and forth through the user's history, as well as -- starting with HTML5 -- manipulate the contents of the history stack."
  },
  "requestAnimationFrame": {
    "!type": "fn(callback: fn(timestamp: number)) -> number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.requestAnimationFrame",
    "!doc": "The Window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint."
  },
  "cancelAnimationFrame": {
    "!type": "fn(number)n",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.cancelAnimationFrame",
    "!doc": "Cancels a previously scheduled animation frame request."
  },
  "screen": {
    "availWidth": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.availWidth",
      "!doc": "Returns the amount of horizontal space in pixels available to the window."
    },
    "availHeight": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.availHeight",
      "!doc": "Returns the amount of vertical space available to the window on the screen."
    },
    "availTop": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.availTop",
      "!doc": "Specifies the y-coordinate of the first pixel that is not allocated to permanent or semipermanent user interface features."
    },
    "availLeft": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.availLeft",
      "!doc": "Returns the first available pixel available from the left side of the screen."
    },
    "pixelDepth": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.pixelDepth",
      "!doc": "Returns the bit depth of the screen."
    },
    "colorDepth": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.colorDepth",
      "!doc": "Returns the color depth of the screen."
    },
    "width": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.width",
      "!doc": "Returns the width of the screen."
    },
    "height": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen.height",
      "!doc": "Returns the height of the screen in pixels."
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.screen",
    "!doc": "Returns a reference to the screen object associated with the window."
  },
  "postMessage": {
    "!type": "fn(message: string, targetOrigin: string)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.postMessage",
    "!doc": "window.postMessage, when called, causes a MessageEvent to be dispatched at the target window when any pending script that must be executed completes (e.g. remaining event handlers if window.postMessage is called from an event handler, previously-set pending timeouts, etc.). The MessageEvent has the type message, a data property which is set to the value of the first argument provided to window.postMessage, an origin property corresponding to the origin of the main document in the window calling window.postMessage at the time window.postMessage was called, and a source property which is the window from which window.postMessage is called. (Other standard properties of events are present with their expected values.)"
  },
  "close": {
    "!type": "fn()",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.close",
    "!doc": "Closes the current window, or a referenced window."
  },
  "blur": {
    "!type": "fn()",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.blur",
    "!doc": "The blur method removes keyboard focus from the current element."
  },
  "focus": {
    "!type": "fn()",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.focus",
    "!doc": "Sets focus on the specified element, if it can be focused."
  },
  "onload": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onload",
    "!doc": "An event handler for the load event of a window."
  },
  "onunload": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onunload",
    "!doc": "The unload event is raised when the window is unloading its content and resources. The resources removal is processed after the unload event occurs."
  },
  "onscroll": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onscroll",
    "!doc": "Specifies the function to be called when the window is scrolled."
  },
  "onresize": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onresize",
    "!doc": "An event handler for the resize event on the window."
  },
  "ononline": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/document.ononline",
    "!doc": "\"online\" event is fired when the browser switches between online and offline mode."
  },
  "onoffline": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/Online_and_offline_events",
    "!doc": "Some browsers implement Online/Offline events from the WHATWG Web Applications 1.0 specification."
  },
  "onmousewheel": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/DOM_event_reference/mousewheel",
    "!doc": "The DOM mousewheel event is fired asynchronously when mouse wheel or similar device is operated. It's represented by the MouseWheelEvent interface."
  },
  "onmouseup": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onmouseup",
    "!doc": "An event handler for the mouseup event on the window."
  },
  "onmouseover": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseover",
    "!doc": "The onmouseover property returns the onMouseOver event handler code on the current element."
  },
  "onmouseout": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseout",
    "!doc": "The onmouseout property returns the onMouseOut event handler code on the current element."
  },
  "onmousemove": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmousemove",
    "!doc": "The onmousemove property returns the mousemove event handler code on the current element."
  },
  "onmousedown": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onmousedown",
    "!doc": "An event handler for the mousedown event on the window."
  },
  "onclick": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onclick",
    "!doc": "The onclick property returns the onClick event handler code on the current element."
  },
  "ondblclick": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.ondblclick",
    "!doc": "The ondblclick property returns the onDblClick event handler code on the current element."
  },
  "onmessage": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/Worker",
    "!doc": "Dedicated Web Workers provide a simple means for web content to run scripts in background threads.  Once created, a worker can send messages to the spawning task by posting messages to an event handler specified by the creator."
  },
  "onkeyup": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeyup",
    "!doc": "The onkeyup property returns the onKeyUp event handler code for the current element."
  },
  "onkeypress": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeypress",
    "!doc": "The onkeypress property sets and returns the onKeyPress event handler code for the current element."
  },
  "onkeydown": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onkeydown",
    "!doc": "An event handler for the keydown event on the window."
  },
  "oninput": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/DOM_event_reference/input",
    "!doc": "The DOM input event is fired synchronously when the value of an <input> or <textarea> element is changed. Additionally, it's also fired on contenteditable editors when its contents are changed. In this case, the event target is the editing host element. If there are two or more elements which have contenteditable as true, \"editing host\" is the nearest ancestor element whose parent isn't editable. Similarly, it's also fired on root element of designMode editors."
  },
  "onpopstate": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onpopstate",
    "!doc": "An event handler for the popstate event on the window."
  },
  "onhashchange": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onhashchange",
    "!doc": "The hashchange event fires when a window's hash changes."
  },
  "onfocus": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onfocus",
    "!doc": "The onfocus property returns the onFocus event handler code on the current element."
  },
  "onblur": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onblur",
    "!doc": "The onblur property returns the onBlur event handler code, if any, that exists on the current element."
  },
  "onerror": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onerror",
    "!doc": "An event handler for runtime script errors."
  },
  "ondrop": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/drop",
    "!doc": "The drop event is fired when an element or text selection is dropped on a valid drop target."
  },
  "ondragstart": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/dragstart",
    "!doc": "The dragstart event is fired when the user starts dragging an element or text selection."
  },
  "ondragover": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/dragover",
    "!doc": "The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds)."
  },
  "ondragleave": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/dragleave",
    "!doc": "The dragleave event is fired when a dragged element or text selection leaves a valid drop target."
  },
  "ondragenter": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/dragenter",
    "!doc": "The dragenter event is fired when a dragged element or text selection enters a valid drop target."
  },
  "ondragend": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/dragend",
    "!doc": "The dragend event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key)."
  },
  "ondrag": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/drag",
    "!doc": "The drag event is fired when an element or text selection is being dragged (every few hundred milliseconds)."
  },
  "oncontextmenu": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.oncontextmenu",
    "!doc": "An event handler property for right-click events on the window. Unless the default behavior is prevented, the browser context menu will activate (though IE8 has a bug with this and will not activate the context menu if a contextmenu event handler is defined). Note that this event will occur with any non-disabled right-click event and does not depend on an element possessing the \"contextmenu\" attribute."
  },
  "onchange": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/element.onchange",
    "!doc": "The onchange property sets and returns the onChange event handler code for the current element."
  },
  "onbeforeunload": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onbeforeunload",
    "!doc": "An event that fires when a window is about to unload its resources. The document is still visible and the event is still cancelable."
  },
  "onabort": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.onabort",
    "!doc": "An event handler for abort events sent to the window."
  },
  "open": {
    "!type": "fn(url: string, name: string, specs: string, replace: bool) -> <top>",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Window/open",
    "!doc": "opens a new browser window, or a new tab, depending on your browser settings"
  },    
  "getSelection": {
    "!type": "fn() -> +Selection",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.getSelection",
    "!doc": "Returns a selection object representing the range of text selected by the user. "
  },
  "alert": {
    "!type": "fn(message: string)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.alert",
    "!doc": "Display an alert dialog with the specified content and an OK button."
  },
  "confirm": {
    "!type": "fn(message: string) -> bool",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.confirm",
    "!doc": "Displays a modal dialog with a message and two buttons, OK and Cancel."
  },
  "prompt": {
    "!type": "fn(message: string, value: string) -> string",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.prompt",
    "!doc": "Displays a dialog with a message prompting the user to input some text."
  },
  "scrollBy": {
    "!type": "fn(x: number, y: number)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollBy",
    "!doc": "Scrolls the document in the window by the given amount."
  },
  "scrollTo": {
    "!type": "fn(x: number, y: number)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollTo",
    "!doc": "Scrolls to a particular set of coordinates in the document."
  },
  "scroll": {
    "!type": "fn(x: number, y: number)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.scroll",
    "!doc": "Scrolls the window to a particular place in the document."
  },
  "setTimeout": {
    "!type": "fn(f: fn(), ms: number) -> number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.setTimeout",
    "!doc": "Calls a function or executes a code snippet after specified delay."
  },
  "clearTimeout": {
    "!type": "fn(timeout: number)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.clearTimeout",
    "!doc": "Clears the delay set by window.setTimeout()."
  },
  "setInterval": {
    "!type": "fn(f: fn(), ms: number) -> number",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.setInterval",
    "!doc": "Calls a function or executes a code snippet repeatedly, with a fixed time delay between each call to that function."
  },
  "clearInterval": {
    "!type": "fn(interval: number)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.clearInterval",
    "!doc": "Cancels repeated action which was set up using setInterval."
  },
  "atob": {
    "!type": "fn(encoded: string) -> string",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.atob",
    "!doc": "Decodes a string of data which has been encoded using base-64 encoding."
  },
  "btoa": {
    "!type": "fn(data: string) -> string",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.btoa",
    "!doc": "Creates a base-64 encoded ASCII string from a string of binary data."
  },
  "addEventListener": {
    "!type": "fn(type: string, listener: fn(e: +Event), capture: bool)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.addEventListener",
    "!doc": "Registers a single event listener on a single target. The event target may be a single element in a document, the document itself, a window, or an XMLHttpRequest."
  },
  "removeEventListener": {
    "!type": "fn(type: string, listener: fn(), capture: bool)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.removeEventListener",
    "!doc": "Allows the removal of event listeners from the event target."
  },
  "dispatchEvent": {
    "!type": "fn(event: +Event) -> bool",
    "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.dispatchEvent",
    "!doc": "Dispatches an event into the event system. The event is subject to the same capturing and bubbling behavior as directly dispatched events."
  },
  "getComputedStyle": {
    "!type": "fn(node: +Element, pseudo?: string) -> Element.prototype.style",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.getComputedStyle",
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
  },
  "Image": {
    "!type": "fn(width?: number, height?: number) -> +HTMLImageElement",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image",
    "!doc": "Image Element constructor. Accepts two optional parameters: Image([unsigned long width, unsigned long height]). Returns an HTMLImageElement instance just as document.createElement('img') would."
  },
  "MutationObserver": {
    "!type": "fn(callback: fn([+MutationRecord]))",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver",
    "!doc": "MutationObserver provides developers a way to react to changes in a DOM.",
    "prototype": {
      "observe": {
        "!type": "fn(target: Node, options: MutationObserverInit)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#observe()",
        "!doc": "Registers the MutationObserver instance to receive notifications of DOM mutations on the specified node."
      },
      "disconnect": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#disconnect()",
        "!doc": "Stops the MutationObserver instance from receiving notifications of DOM mutations."
      },
      "takeRecords": {
        "!type": "fn() -> [+MutationRecord]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#takeRecords()",
        "!doc": "mpties the MutationObserver instance's record queue and returns what was in there."
      }
    }
  },
  "MutationRecord": {
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord",
    "!doc": "A MutationRecord represents an individual DOM mutation.",
    "prototype": {
      "type": "string",
      "target": "Node",
      "addedNodes": "NodeList",
      "removedNodes": "NodeList",
      "previousSibling": "Node",
      "nextSibling": "Node",
      "attributeName": "string",
      "attributeNamespace": "string",
      "oldValue": "string"
    }
  },
  "Headers": {
    "!type": "fn(init?: object)",
    "!doc": "Represents response/request headers, allowing you to query them and take different actions depending on the results.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers",
    "prototype": {
      "append": {
        "!type": "fn(name: string, value: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers/append",
        "!doc": "Appends a new value onto an existing header inside a Headers object, or adds the header if it does not already exist."
      },
      "delete": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers/delete",
        "!doc": "Deletes a header from a Headers object."
      },
      "get": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers/get",
        "!doc": "Returns the first value of a given header from within a Headers object."
      },
      "getAll": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers/getAll",
        "!doc": "Returns an array of all the values of a header within a Headers object with a given name."
      },
      "has": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers/has",
        "!doc": "Returns a boolean stating whether a Headers object contains a certain header."
      },
      "set": {
        "!type": "fn(name: string, value: string)",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Headers/set",
        "!doc": "Sets a new value for an existing header inside a Headers object, or adds the header if it does not already exist."
      }
    }
  },
  "Request": {
    "!type": "fn(input: string, init?: object)",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request",
    "!doc": "The Request interface of the Fetch API represents a resource request.",
    "prototype": {
      "bodyUsed": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed",
        "!doc": "Stores a Boolean that declares whether the body has been used in a response yet."
      },
      "cache": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/cache",
        "!doc": "Contains the cache mode of the request (e.g., default, reload, no-cache)."
      },
      "context": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/context",
        "!doc": "Contains the context of the request (e.g., audio, image, iframe, etc.)"
      },
      "credentials": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials",
        "!doc": "Contains the credentials of the request (e.g., omit, same-origin)."
      },
      "headers": {
        "!type": "+Headers",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/headers",
        "!doc": "Contains the associated Headers object of the request."
      },
      "integrity": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity",
        "!doc": "Contains the subresource integrity value of the request."
      },
      "method": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/method",
        "!doc": "Contains the request's method (GET, POST, etc.)"
      },
      "mode": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/mode",
        "!doc": "Contains the mode of the request (e.g., cors, no-cors, same-origin)."
      },
      "redirect": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect",
        "!doc": "Contains the mode for how redirects are handled."
      },
      "referrer": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer",
        "!doc": "Contains the referrer of the request (e.g., client)."
      },
      "referrerPolicy": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/referrerPolicy",
        "!doc": "Returns the referrer policy, which governs what referrer information, sent in the Referer header, should be included with the request."
      },
      "url": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/url",
        "!doc": "Contains the URL of the request."
      },
      "clone": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Request/clone",
        "!doc": "Creates a copy of the current Request object."
      },
      "arrayBuffer": {
        "!type": "fn() -> +Promise[:t=+ArrayBuffer]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with an ArrayBuffer."
      },
      "blob": {
        "!type": "fn() -> +Promise[:t=+Blob]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/blob",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a Blob."
      },
      "formData": {
        "!type": "fn() -> +Promise[:t=+FormData]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/formData",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a FormData object."
      },
      "json": {
        "!type": "fn() -> +Promise[:t=?]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/json",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a JSON object."
      },
      "text": {
        "!type": "fn() -> +Promise[:t=string]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/text",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a USVString (text)."
      }
    }
  },
  "Response": {
    "!type": "fn(body: object, init?: object)",
    "!doc": "Represents the response to a request.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response",
    "prototype": {
      "type": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/type",
        "!doc": "Contains the type of the response (e.g., basic, cors)."
      },
      "url": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/url",
        "!doc": "Contains the URL of the response."
      },
      "status": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/status",
        "!doc": "Contains the status code of the response (e.g., 200 for a success)."
      },
      "ok": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/ok",
        "!doc": "Contains a boolean stating whether the response was successful (status in the range 200-299) or not."
      },
      "statusText": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText",
        "!doc": "Contains the status message corresponding to the status code (e.g., OK for 200)."
      },
      "headers": {
        "!type": "+Headers",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/headers",
        "!doc": "Contains the Headers object associated with the response."
      },
      "bodyUsed": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed",
        "!doc": "Stores a Boolean that declares whether the body has been used in a response yet."
      },
      "clone": {
        "!type": "fn() -> +Response",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/clone",
        "!doc": "Creates a clone of a Response object."
      },
      "error": {
        "!type": "fn() -> +Response",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/error",
        "!doc": "Returns a new Response object associated with a network error."
      },
      "redirect": {
        "!type": "fn(url: string, status?: number) -> +Response",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect",
        "!doc": "Creates a new response with a different URL."
      },
      "arrayBuffer": {
        "!type": "fn() -> +Promise[:t=+ArrayBuffer]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with an ArrayBuffer."
      },
      "blob": {
        "!type": "fn() -> +Promise[:t=+Blob]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/blob",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a Blob."
      },
      "formData": {
        "!type": "fn() -> +Promise[:t=+FormData]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/formData",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a FormData object."
      },
      "json": {
        "!type": "fn() -> +Promise[:t=?]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/json",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a JSON object."
      },
      "text": {
        "!type": "fn() -> +Promise[:t=string]",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Body/text",
        "!doc": "Takes a Response stream and reads it to completion. It returns a promise that resolves with a USVString (text)."
      }
    }
  },
  "fetch": {
    "!type": "fn(url: string|+Request, init?: object) -> +Promise[:t=+Response]",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
    "!doc": "The fetch() method of the WindowOrWorkerGlobalScope mixin starts the process of fetching a resource from the network."
  },
  "Clipboard": {
    "!doc": "The Clipboard interface implements the Clipboard API, providing both read and write access to the contents of the system clipboard.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard",
    "read": {
      "!type": "fn() -> +Promise[:t=+DataTransfer]",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read",
      "!doc": "The read() method of the Clipboard interface requests a copy of the clipboard's contents"
    },
    "readText": {
      "!type": "fn() -> +Promise[:t=string]",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText",
      "!doc": "Requests text from the system clipboard; returns a Promise which is resolved with a DOMString containing the clipboard's text once it's available."
    },
    "write": {
      "!type": "fn(data: +DataTransfer) -> +Promise[]",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write",
      "!doc": "The Clipboard method write() writes arbitrary data, such as images, to the clipboard. This can be used to implement cut and copy functionality."
    },
    "writeText": {
      "!type": "fn(newClipText: string) -> +Promise[:t=string]",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText",
      "!doc": "The Clipboard interface's writeText() property writes the specified text string to the system clipboard."
    }
  }
},
{
  "!name": "ecmascript",
  "!define": {
    "Error.prototype": "Error.prototype",
    "propertyDescriptor": {
      "enumerable": "bool",
      "configurable": "bool",
      "value": "?",
      "writable": "bool",
      "get": "fn() -> ?",
      "set": "fn(value: ?)"
    },
    "Promise.prototype": {
      "catch": {
        "!doc": "The catch() method returns a Promise and deals with rejected cases only. It behaves the same as calling Promise.prototype.then(undefined, onRejected).",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch",
        "!type": "fn(onRejected: fn(reason: ?)) -> !this"
      },
      "then": {
        "!doc": "The then() method returns a Promise. It takes two arguments, both are callback functions for the success and failure cases of the Promise.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then",
        "!type": "fn(onFulfilled: fn(value: ?), onRejected: fn(reason: ?)) -> !custom:Promise_then",
        "!effects": ["call !0 !this.:t"]
      },
      "finally": {
        "!doc": "The finally() method returns a Promise. When the promise is settled, whether fulfilled or rejected, the specified callback function is executed. ",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally",
        "!type": "fn(onFinally: fn()) -> !custom:Promise_then"
      }
    },
    "Promise_reject": {
      "!type": "fn(reason: ?) -> !this",
      "!doc": "The Promise.reject(reason) method returns a Promise object that is rejected with the given reason.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject"
    },
    "iter_prototype": {
      ":Symbol.iterator": "fn() -> !this"
    },
    "iter": {
      "!proto": "iter_prototype",
      "next": {
        "!type": "fn() -> +iter_result[value=!this.:t]",
        "!doc": "Return the next item in the sequence.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators"
      },
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators"
    },
    "iter_result": {
      "done": "bool",
      "value": "?"
    },
    "generator_prototype": {
      "!proto": "iter_prototype",
      "next": "fn(value?: ?) -> iter_result",
      "return": "fn(value?: ?) -> iter_result",
      "throw": "fn(exception: +Error)"
    },
    "async_iter_prototype": {
      ":Symbol.asyncIterator": "fn() -> !this"
    },
    "async_iter": {
      "!proto": "async_iter_prototype",
      "next": {
        "!type": "fn() -> +Promise[:t=+iter_result[value=!this.:t]]",
        "!doc": "Return the next item in the sequence.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators"
      },
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators"
    },
    "async_generator_prototype": {
      "!proto": "async_iter_prototype",
      "next": "fn(value?: ?) -> +Promise[:t=iter_result]",
      "return": "fn(value?: ?) -> +Promise[:t=iter_result]",
      "throw": "fn(exception: +Error)"
    },
    "Proxy_handler": {
      "!doc": "The proxy's handler object is a placeholder object which contains traps for proxies.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler",
      "getPrototypeOf": "fn(target: ?)",
      "setPrototypeOf": "fn(target: ?, prototype: ?)",
      "isExtensible": "fn(target: ?)",
      "preventExtensions": "fn(target: ?)",
      "getOwnPropertyDescriptor": "fn(target: ?, property: string) -> propertyDescriptor",
      "defineProperty": "fn(target: ?, property: string, descriptor: propertyDescriptor)",
      "has": "fn(target: ?, property: string)",
      "get": "fn(target: ?, property: string)",
      "set": "fn(target: ?, property: string, value: ?)",
      "deleteProperty": "fn(target: ?, property: string)",
      "enumerate": "fn(target: ?)",
      "ownKeys": "fn(target: ?)",
      "apply": "fn(target: ?, self: ?, arguments: [?])",
      "construct": "fn(target: ?, arguments: [?])"
    },
    "Proxy_revocable": {
      "proxy": "+Proxy",
      "revoke": "fn()"
    },
    "TypedArray": {
      "!type": "fn(size: number)",
      "!doc": "A TypedArray object describes an array-like view of an underlying binary data buffer. There is no global property named TypedArray, nor is there a directly visible TypedArray constructor.  Instead, there are a number of different global properties, whose values are typed array constructors for specific element types, listed below. On the following pages you will find common properties and methods that can be used with any typed array containing elements of any type.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray",
      "from": {
        "!type": "fn(arrayLike: ?, mapFn?: fn(elt: ?, i: number) -> number, thisArg?: ?) -> +TypedArray",
        "!effects": ["call !1 this=!2 !0.<i> number"],
        "!doc": "Creates a new typed array from an array-like or iterable object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from"
      },
      "of": {
        "!type": "fn(elements: number) -> +TypedArray",
        "!doc": "Creates a new typed array from a variable number of arguments.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/of"
      },
      "BYTES_PER_ELEMENT": {
        "!type": "number",
        "!doc": "The TypedArray.BYTES_PER_ELEMENT property represents the size in bytes of each element in an typed array.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/BYTES_PER_ELEMENT"
      },
      "name": {
        "!type": "string",
        "!doc": "The TypedArray.name property represents a string value of the typed array constructor name.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/name"
      },
      "prototype": {
        "<i>": "number",
        "buffer": {
          "!type": "+ArrayBuffer",
          "!doc": "The buffer accessor property represents the ArrayBuffer referenced by a TypedArray at construction time.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/buffer"
        },
        "byteLength": {
          "!type": "number",
          "!doc": "The byteLength accessor property represents the length (in bytes) of a typed array from the start of its ArrayBuffer.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/byteLength"
        },
        "byteOffset": {
          "!type": "number",
          "!doc": "The byteOffset accessor property represents the offset (in bytes) of a typed array from the start of its ArrayBuffer.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/byteOffset"
        },
        "copyWithin": {
          "!type": "fn(target: number, start: number, end?: number) -> ?",
          "!doc": "The copyWithin() method copies the sequence of array elements within the array to the position starting at target. The copy is taken from the index positions of the second and third arguments start and end. The end argument is optional and defaults to the length of the array. This method has the same algorithm as Array.prototype.copyWithin. TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/copyWithin"
        },
        "entries": {
          "!type": "fn() -> +iter[:t=number]",
          "!doc": "The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/entries"
        },
        "every": {
          "!type": "fn(callback: fn(element: number, index: number, array: TypedArray) -> bool, thisArg?: ?) -> bool",
          "!effects": ["call !0 this=!1 number number !this"],
          "!doc": "The every() method tests whether all elements in the typed array pass the test implemented by the provided function. This method has the same algorithm as Array.prototype.every(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/every"
        },
        "fill": {
          "!type": "fn(value: number, start?: number, end?: number)",
          "!doc": "The fill() method fills all the elements of a typed array from a start index to an end index with a static value. This method has the same algorithm as Array.prototype.fill(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill"
        },
        "filter": {
          "!type": "fn(test: fn(element: number, i: number) -> bool, context?: ?) -> !this",
          "!effects": ["call !0 this=!1 number number"],
          "!doc": "Creates a new array with all of the elements of this array for which the provided filtering function returns true. See also Array.prototype.filter().",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/filter"
        },
        "find": {
          "!type": "fn(callback: fn(element: number, index: number, array: +TypedArray) -> bool, thisArg?: ?) -> number",
          "!effects": ["call !0 this=!1 number number !this"],
          "!doc": "The find() method returns a value in the typed array, if an element satisfies the provided testing function. Otherwise undefined is returned. TypedArray is one of the typed array types here.\nSee also the findIndex() method, which returns the index of a found element in the typed array instead of its value.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/find"
        },
        "findIndex": {
          "!type": "fn(callback: fn(element: number, index: number, array: +TypedArray) -> bool, thisArg?: ?) -> number",
          "!effects": ["call !0 this=!1 number number !this"],
          "!doc": "The findIndex() method returns an index in the typed array, if an element in the typed array satisfies the provided testing function. Otherwise -1 is returned.\nSee also the find() method, which returns the value of a found element in the typed array instead of its index.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/findIndex"
        },
        "forEach": {
          "!type": "fn(callback: fn(value: number, key: number, array: +TypedArray), thisArg?: ?)",
          "!effects": ["call !0 this=!1 number number !this"],
          "!doc": "Executes a provided function once per array element.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/forEach"
        },
        "indexOf": {
          "!type": "fn(searchElement: number, fromIndex?: number) -> number",
          "!doc": "The indexOf() method returns the first index at which a given element can be found in the typed array, or -1 if it is not present. This method has the same algorithm as Array.prototype.indexOf(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/indexOf"
        },
        "join": {
          "!type": "fn(separator?: string) -> string",
          "!doc": "The join() method joins all elements of an array into a string. This method has the same algorithm as Array.prototype.join(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/join"
        },
        "keys": {
          "!type": "fn() -> +iter[:t=number]",
          "!doc": "The keys() method returns a new Array Iterator object that contains the keys for each index in the array.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/keys"
        },
        "lastIndexOf": {
          "!type": "fn(searchElement: number, fromIndex?: number) -> number",
          "!doc": "The lastIndexOf() method returns the last index at which a given element can be found in the typed array, or -1 if it is not present. The typed array is searched backwards, starting at fromIndex. This method has the same algorithm as Array.prototype.lastIndexOf(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/lastIndexOf"
        },
        "length": {
          "!type": "number",
          "!doc": "Returns the number of elements hold in the typed array. Fixed at construction time and thus read only.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/length"
        },
        "map": {
          "!type": "fn(f: fn(element: number, i: number) -> number, context?: ?) -> +TypedArray",
          "!effects": ["call !0 this=!1 number number"],
          "!doc": "Creates a new array with the results of calling a provided function on every element in this array. See also Array.prototype.map().",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/map"
        },
        "reduce": {
          "!type": "fn(combine: fn(sum: ?, elt: number, i: number) -> ?, init?: ?) -> !0.!ret",
          "!effects": ["call !0 !1 number number"],
          "!doc": "Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value. See also Array.prototype.reduce().",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reduce"
        },
        "reduceRight": {
          "!type": "fn(combine: fn(sum: ?, elt: number, i: number) -> ?, init?: ?) -> !0.!ret",
          "!effects": ["call !0 !1 number number"],
          "!doc": "Apply a function against an accumulator and each value of the array (from right-to-left) as to reduce it to a single value. See also Array.prototype.reduceRight().",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reduceRight"
        },
        "reverse": {
          "!type": "fn()",
          "!doc": "The reverse() method reverses a typed array in place. The first typed array element becomes the last and the last becomes the first. This method has the same algorithm as Array.prototype.reverse(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/reverse"
        },
        "set": {
          "!type": "fn(array: [number], offset?: number)",
          "!doc": "The set() method stores multiple values in the typed array, reading input values from a specified array.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set"
        },
        "slice": {
          "!type": "fn(from: number, to?: number) -> +TypedArray",
          "!doc": "Extracts a section of an array and returns a new array. See also Array.prototype.slice().",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice"
        },
        "some": {
          "!type": "fn(test: fn(elt: number, i: number) -> bool, context?: ?) -> bool",
          "!effects": ["call !0 this=!1 number number"],
          "!doc": "The some() method tests whether some element in the typed array passes the test implemented by the provided function. This method has the same algorithm as Array.prototype.some(). TypedArray is one of the typed array types here.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/some"
        },
        "sort": {
          "!type": "fn(compare?: fn(a: number, b: number) -> number)",
          "!effects": ["call !0 number number"],
          "!doc": "Sorts the elements of an array in place and returns the array. See also Array.prototype.sort().",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/sort"
        },
        "subarray": {
          "!type": "fn(begin?: number, end?: number) -> +TypedArray",
          "!doc": "The subarray() method returns a new TypedArray on the same ArrayBuffer store and with the same element types as for this TypedArray object. The begin offset is inclusive and the end offset is exclusive. TypedArray is one of the typed array types.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray"
        },
        "values": {
          "!type": "fn() -> +iter[:t=number]",
          "!doc": "The values() method returns a new Array Iterator object that contains the values for each index in the array.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/values"
        },
        ":Symbol.iterator": {
          "!type": "fn() -> +iter[:t=number]",
          "!doc": "Returns a new Array Iterator object that contains the values for each index in the array.",
          "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/@@iterator"
        }
      }
    }
  },
  "Infinity": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Infinity",
    "!doc": "A numeric value representing infinity."
  },
  "undefined": {
    "!type": "?",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/undefined",
    "!doc": "The value undefined."
  },
  "NaN": {
    "!type": "number",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/NaN",
    "!doc": "A value representing Not-A-Number."
  },
  "Object": {
    "!type": "fn()",
    "getPrototypeOf": {
      "!type": "fn(obj: ?) -> ?",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getPrototypeOf",
      "!doc": "Returns the prototype (i.e. the internal prototype) of the specified object."
    },
    "create": {
      "!type": "fn(proto: ?) -> !custom:Object_create",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create",
      "!doc": "Creates a new object with the specified prototype object and properties."
    },
    "defineProperty": {
      "!type": "fn(obj: ?, prop: string, desc: propertyDescriptor) -> !custom:Object_defineProperty",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty",
      "!doc": "Defines a new property directly on an object, or modifies an existing property on an object, and returns the object. If you want to see how to use the Object.defineProperty method with a binary-flags-like syntax, see this article."
    },
    "defineProperties": {
      "!type": "fn(obj: ?, props: ?) -> !custom:Object_defineProperties",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty",
      "!doc": "Defines a new property directly on an object, or modifies an existing property on an object, and returns the object. If you want to see how to use the Object.defineProperty method with a binary-flags-like syntax, see this article."
    },
    "getOwnPropertyDescriptor": {
      "!type": "fn(obj: ?, prop: string) -> propertyDescriptor",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor",
      "!doc": "Returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain) of a given object."
    },
    "keys": {
      "!type": "fn(obj: ?) -> [string]",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys",
      "!doc": "Returns an array of a given object's own enumerable properties, in the same order as that provided by a for-in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well)."
    },
    "getOwnPropertyNames": {
      "!type": "fn(obj: ?) -> [string]",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames",
      "!doc": "Returns an array of all properties (enumerable or not) found directly upon a given object."
    },
    "seal": {
      "!type": "fn(obj: ?)",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/seal",
      "!doc": "Seals an object, preventing new properties from being added to it and marking all existing properties as non-configurable. Values of present properties can still be changed as long as they are writable."
    },
    "isSealed": {
      "!type": "fn(obj: ?) -> bool",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isSealed",
      "!doc": "Determine if an object is sealed."
    },
    "freeze": {
      "!type": "fn(obj: ?) -> !0",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze",
      "!doc": "Freezes an object: that is, prevents new properties from being added to it; prevents existing properties from being removed; and prevents existing properties, or their enumerability, configurability, or writability, from being changed. In essence the object is made effectively immutable. The method returns the object being frozen."
    },
    "isFrozen": {
      "!type": "fn(obj: ?) -> bool",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/isFrozen",
      "!doc": "Determine if an object is frozen."
    },
    "preventExtensions": {
      "!type": "fn(obj: ?)",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions",
      "!doc": "Prevents new properties from ever being added to an object."
    },
    "isExtensible": {
      "!type": "fn(obj: ?) -> bool",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible",
      "!doc": "The Object.isExtensible() method determines if an object is extensible (whether it can have new properties added to it)."
    },
    "assign": {
      "!type": "fn(target: ?, source: ?, source?: ?) -> !0",
      "!effects": ["copy !1 !0", "copy !2 !0", "copy !3 !0"],
      "!doc": "The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign"
    },
    "getOwnPropertySymbols": {
      "!type": "fn(obj: ?) -> !custom:getOwnPropertySymbols",
      "!doc": "The Object.getOwnPropertySymbols() method returns an array of all symbol properties found directly upon a given object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols"
    },
    "is": {
      "!type": "fn(value1: ?, value2: ?) -> bool",
      "!doc": "The Object.is() method determines whether two values are the same value.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is"
    },
    "setPrototypeOf": {
      "!type": "fn(obj: ?, prototype: ?)",
      "!doc": "The Object.setPrototype() method sets the prototype (i.e., the internal [[Prototype]] property) of a specified object to another object or null.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf"
    },
    "prototype": {
      "!stdProto": "Object",
      "toString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/toString",
        "!doc": "Returns a string representing the object."
      },
      "toLocaleString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/toLocaleString",
        "!doc": "Returns a string representing the object. This method is meant to be overriden by derived objects for locale-specific purposes."
      },
      "valueOf": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/valueOf",
        "!doc": "Returns the primitive value of the specified object"
      },
      "hasOwnProperty": {
        "!type": "fn(prop: string) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/hasOwnProperty",
        "!doc": "Returns a boolean indicating whether the object has the specified property."
      },
      "propertyIsEnumerable": {
        "!type": "fn(prop: string) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable",
        "!doc": "Returns a Boolean indicating whether the specified property is enumerable."
      },
      "isPrototypeOf": {
        "!type": "fn(obj: ?) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf",
        "!doc": "Tests for an object in another object's prototype chain."
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object",
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
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/apply",
        "!doc": "Calls a function with a given this value and arguments provided as an array (or an array like object)."
      },
      "call": {
        "!type": "fn(this: ?, args?: ?) -> !this.!ret",
        "!effects": [
          "call and return !this this=!0 !1 !2 !3 !4"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/call",
        "!doc": "Calls a function with a given this value and arguments provided individually."
      },
      "bind": {
        "!type": "fn(this: ?, args?: ?) -> !custom:Function_bind",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind",
        "!doc": "Creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function was called."
      },
      "prototype": "?"
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function",
    "!doc": "Every function in JavaScript is actually a Function object."
  },
  "Array": {
    "!type": "fn(size: number) -> !custom:Array_ctor",
    "isArray": {
      "!type": "fn(value: ?) -> bool",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray",
      "!doc": "Returns true if an object is an array, false if it is not."
    },
    "from": {
      "!type": "fn(arrayLike: ?, mapFn?: fn(elt: ?, i: number) -> ?, thisArg?: ?) -> [!0.<i>]",
      "!effects": [
        "call !1 this=!2 !0.<i> number"
      ],
      "!doc": "The Array.from() method creates a new Array instance from an array-like or iterable object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from"
    },
    "of": {
      "!type": "fn(elementN: ?) -> [!0]",
      "!doc": "The Array.of() method creates a new Array instance with a variable number of arguments, regardless of number or type of the arguments.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of"
    },
    "prototype": {
      "!stdProto": "Array",
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/length",
        "!doc": "An unsigned, 32-bit integer that specifies the number of elements in an array."
      },
      "concat": {
        "!type": "fn(other: [?]) -> !this",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/concat",
        "!doc": "Returns a new array comprised of this array joined with other array(s) and/or value(s)."
      },
      "join": {
        "!type": "fn(separator?: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/join",
        "!doc": "Joins all elements of an array into a string."
      },
      "splice": {
        "!type": "fn(pos: number, amount: number, newelt?: ?) -> [?]",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/splice",
        "!doc": "Changes the content of an array, adding new elements while removing old elements."
      },
      "pop": {
        "!type": "fn() -> !this.<i>",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/pop",
        "!doc": "Removes the last element from an array and returns that element."
      },
      "push": {
        "!type": "fn(newelt: ?) -> number",
        "!effects": [
          "propagate !0 !this.<i>"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/push",
        "!doc": "Mutates an array by appending the given elements and returning the new length of the array."
      },
      "shift": {
        "!type": "fn() -> !this.<i>",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/shift",
        "!doc": "Removes the first element from an array and returns that element. This method changes the length of the array."
      },
      "unshift": {
        "!type": "fn(newelt: ?) -> number",
        "!effects": [
          "propagate !0 !this.<i>"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/unshift",
        "!doc": "Adds one or more elements to the beginning of an array and returns the new length of the array."
      },
      "slice": {
        "!type": "fn(from?: number, to?: number) -> !this",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/slice",
        "!doc": "Returns a shallow copy of a portion of an array."
      },
      "reverse": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/reverse",
        "!doc": "Reverses an array in place.  The first array element becomes the last and the last becomes the first."
      },
      "sort": {
        "!type": "fn(compare?: fn(a: ?, b: ?) -> number)",
        "!effects": [
          "call !0 !this.<i> !this.<i>"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/sort",
        "!doc": "Sorts the elements of an array in place and returns the array."
      },
      "indexOf": {
        "!type": "fn(elt: ?, from?: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf",
        "!doc": "Returns the first index at which a given element can be found in the array, or -1 if it is not present."
      },
      "lastIndexOf": {
        "!type": "fn(elt: ?, from?: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/lastIndexOf",
        "!doc": "Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex."
      },
      "every": {
        "!type": "fn(test: fn(elt: ?, i: number, array: +Array) -> bool, context?: ?) -> bool",
        "!effects": [
          "call !0 this=!1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every",
        "!doc": "Tests whether all elements in the array pass the test implemented by the provided function."
      },
      "some": {
        "!type": "fn(test: fn(elt: ?, i: number, array: +Array) -> bool, context?: ?) -> bool",
        "!effects": [
          "call !0 this=!1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some",
        "!doc": "Tests whether some element in the array passes the test implemented by the provided function."
      },
      "filter": {
        "!type": "fn(test: fn(elt: ?, i: number, array: +Array) -> bool, context?: ?) -> !this",
        "!effects": [
          "call !0 this=!1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter",
        "!doc": "Creates a new array with all elements that pass the test implemented by the provided function."
      },
      "forEach": {
        "!type": "fn(f: fn(elt: ?, i: number, array: +Array), context?: ?)",
        "!effects": [
          "call !0 this=!1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach",
        "!doc": "Executes a provided function once per array element."
      },
      "map": {
        "!type": "fn(f: fn(elt: ?, i: number, array: +Array) -> ?, context?: ?) -> [!0.!ret]",
        "!effects": [
          "call !0 this=!1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map",
        "!doc": "Creates a new array with the results of calling a provided function on every element in this array."
      },
      "reduce": {
        "!type": "fn(combine: fn(sum: ?, elt: ?, i: number, array: +Array) -> ?, init?: ?) -> !0.!ret",
        "!effects": [
          "call !0 !1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/Reduce",
        "!doc": "Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value."
      },
      "reduceRight": {
        "!type": "fn(combine: fn(sum: ?, elt: ?, i: number, array: +Array) -> ?, init?: ?) -> !0.!ret",
        "!effects": [
          "call !0 !1 !this.<i> number !this"
        ],
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/ReduceRight",
        "!doc": "Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value."
      },
      "copyWithin": {
        "!type": "fn(target: number, start: number, end?: number) -> !this",
        "!doc": "The copyWithin() method copies the sequence of array elements within the array to the position starting at target. The copy is taken from the index positions of the second and third arguments start and end.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin"
      },
      "entries": {
        "!type": "fn() -> +iter[:t=[number, !this.<i>]]",
        "!doc": "The entries() method returns a new Array Iterator object that contains the key/value pairs for each index in the array.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries"
      },
      "fill": {
        "!type": "fn(value: ?, start?: number, end?: number) -> !this",
        "!doc": "The fill() method fills all the elements of an array from a start index to an end index with a static value.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill"
      },
      "find": {
        "!type": "fn(callback: fn(element: ?, index: number, array: [?]) -> bool, thisArg?: ?) -> !this.<i>",
        "!effects": ["call !0 this=!2 !this.<i> number"],
        "!doc": "The find() method returns a value in the array, if an element in the array satisfies the provided testing function. Otherwise undefined is returned.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find"
      },
      "findIndex": {
        "!type": "fn(callback: fn(element: ?, index: number, array: [?]), thisArg?: ?) -> number",
        "!effects": ["call !0 this=!2 !this.<i> number"],
        "!doc": "The findIndex() method returns an index in the array, if an element in the array satisfies the provided testing function. Otherwise -1 is returned.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex"
      },
      "keys": {
        "!type": "fn() -> +iter[:t=number]",
        "!doc": "The keys() method returns a new Array Iterator that contains the keys for each index in the array.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys"
      },
      "values": {
        "!type": "fn() -> +iter[:t=!this.<i>]",
        "!doc": "The values() method returns a new Array Iterator object that contains the values for each index in the array.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values"
      },
      ":Symbol.iterator": {
        "!type": "fn() -> +iter[:t=!this.<i>]",
        "!doc": "Returns a new Array Iterator object that contains the values for each index in the array.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator"
      },
      "includes": {
        "!type": "fn(value: ?, fromIndex?: number) -> bool",
        "!doc": "Determines whether an array includes a certain element, returning true or false as appropriate.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes"
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array",
    "!doc": "The JavaScript Array global object is a constructor for arrays, which are high-level, list-like objects."
  },
  "String": {
    "!type": "fn(value: ?) -> string",
    "fromCharCode": {
      "!type": "fn(code: number) -> string",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/fromCharCode",
      "!doc": "Returns a string created by using the specified sequence of Unicode values."
    },
    "fromCodePoint": {
      "!type": "fn(point: number, point?: number) -> string",
      "!doc": "The static String.fromCodePoint() method returns a string created by using the specified sequence of code points.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint"
    },
    "raw": {
      "!type": "fn(template: [string], substitutions: ?, templateString: ?) -> string",
      "!doc": "The static String.raw() method is a tag function of template strings, used to get the raw string form of template strings.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw"
    },
    "prototype": {
      "!stdProto": "String",
      "length": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/String/length",
        "!doc": "Represents the length of a string."
      },
      "<i>": "string",
      "charAt": {
        "!type": "fn(i: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/charAt",
        "!doc": "Returns the specified character from a string."
      },
      "charCodeAt": {
        "!type": "fn(i: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/charCodeAt",
        "!doc": "Returns the numeric Unicode value of the character at the given index (except for unicode codepoints > 0x10000)."
      },
      "indexOf": {
        "!type": "fn(char: string, from?: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/indexOf",
        "!doc": "Returns the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex,\nreturns -1 if the value is not found."
      },
      "lastIndexOf": {
        "!type": "fn(char: string, from?: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/lastIndexOf",
        "!doc": "Returns the index within the calling String object of the last occurrence of the specified value, or -1 if not found. The calling string is searched backward, starting at fromIndex."
      },
      "substring": {
        "!type": "fn(from: number, to?: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/substring",
        "!doc": "Returns a subset of a string between one index and another, or through the end of the string."
      },
      "substr": {
        "!type": "fn(from: number, length?: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/substr",
        "!doc": "Returns the characters in a string beginning at the specified location through the specified number of characters."
      },
      "slice": {
        "!type": "fn(from: number, to?: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/slice",
        "!doc": "Extracts a section of a string and returns a new string."
      },
      "padStart": {
        "!type": "fn(targetLength: number, padString?: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart",
        "!doc": "Pads the current string with another string (repeated, if needed) so that the resulting string reaches the given length."
      },
      "padEnd": {
        "!type": "fn(targetLength: number, padString?: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd",
        "!doc": "pads the current string with a given string (repeated, if needed) so that the resulting string reaches a given length."
      },
      "trim": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/Trim",
        "!doc": "Removes whitespace from both ends of the string."
      },
      "trimStart": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart",
        "!doc": "Removes whitespace from the beginning of a string. "
      },
      "trimLeft": "String.prototype.trimStart",
      "trimEnd": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd",
        "!doc": "Removes whitespace from the end of a string."
      },
      "trimRight": "String.prototype.trimEnd",
      "toUpperCase": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/toUpperCase",
        "!doc": "Returns the calling string value converted to uppercase."
      },
      "toLowerCase": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/toLowerCase",
        "!doc": "Returns the calling string value converted to lowercase."
      },
      "toLocaleUpperCase": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase",
        "!doc": "Returns the calling string value converted to upper case, according to any locale-specific case mappings."
      },
      "toLocaleLowerCase": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase",
        "!doc": "Returns the calling string value converted to lower case, according to any locale-specific case mappings."
      },
      "split": {
        "!type": "fn(pattern?: string|+RegExp, limit?: number) -> [string]",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/split",
        "!doc": "Splits a String object into an array of strings by separating the string into substrings."
      },
      "concat": {
        "!type": "fn(other: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/concat",
        "!doc": "Combines the text of two or more strings and returns a new string."
      },
      "localeCompare": {
        "!type": "fn(other: string) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/localeCompare",
        "!doc": "Returns a number indicating whether a reference string comes before or after or is the same as the given string in sort order."
      },
      "match": {
        "!type": "fn(pattern: +RegExp) -> [string]",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/match",
        "!doc": "Used to retrieve the matches when matching a string against a regular expression."
      },
      "replace": {
        "!type": "fn(pattern: string|+RegExp, replacement: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/replace",
        "!doc": "Returns a new string with some or all matches of a pattern replaced by a replacement.  The pattern can be a string or a RegExp, and the replacement can be a string or a function to be called for each match."
      },
      "search": {
        "!type": "fn(pattern: +RegExp) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/search",
        "!doc": "Executes the search for a match between a regular expression and this String object."
      },
      "codePointAt": {
        "!type": "fn(pos: number) -> number",
        "!doc": "The codePointAt() method returns a non-negative integer that is the UTF-16 encoded code point value.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt"
      },
      "endsWith": {
        "!type": "fn(searchString: string, position?: number) -> bool",
        "!doc": "The endsWith() method determines whether a string ends with the characters of another string, returning true or false as appropriate.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith"
      },
      "includes": {
        "!type": "fn(searchString: string, position?: number) -> bool",
        "!doc": "The includes() method determines whether one string may be found within another string, returning true or false as appropriate.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains"
      },
      "normalize": {
        "!type": "fn(form: string) -> string",
        "!doc": "The normalize() method returns the Unicode Normalization Form of a given string (if the value isn't a string, it will be converted to one first).",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize"
      },
      "repeat": {
        "!type": "fn(count: number) -> string",
        "!doc": "The repeat() method constructs and returns a new string which contains the specified number of copies of the string on which it was called, concatenated together.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat"
      },
      "startsWith": {
        "!type": "fn(searchString: string, position?: number) -> bool",
        "!doc": "The startsWith() method determines whether a string begins with the characters of another string, returning true or false as appropriate.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith"
      },
      ":Symbol.iterator": {
        "!type": "fn() -> +iter[:t=string]",
        "!doc": "Returns a new Iterator object that iterates over the code points of a String value, returning each code point as a String value.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator"
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String",
    "!doc": "The String global object is a constructor for strings, or a sequence of characters."
  },
  "Number": {
    "!type": "fn(value: ?) -> number",
    "MAX_VALUE": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/MAX_VALUE",
      "!doc": "The maximum numeric value representable in JavaScript."
    },
    "MIN_VALUE": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/MIN_VALUE",
      "!doc": "The smallest positive numeric value representable in JavaScript."
    },
    "POSITIVE_INFINITY": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY",
      "!doc": "A value representing the positive Infinity value."
    },
    "NEGATIVE_INFINITY": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY",
      "!doc": "A value representing the negative Infinity value."
    },
    "prototype": {
      "!stdProto": "Number",
      "toString": {
        "!type": "fn(radix?: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toString",
        "!doc": "Returns a string representing the specified Number object"
      },
      "toFixed": {
        "!type": "fn(digits: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed",
        "!doc": "Formats a number using fixed-point notation"
      },
      "toExponential": {
        "!type": "fn(digits: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toExponential",
        "!doc": "Returns a string representing the Number object in exponential notation"
      },
      "toPrecision": {
        "!type": "fn(digits: number) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toPrecision",
        "!doc": "The toPrecision() method returns a string representing the number to the specified precision."
      }
    },
    "EPSILON": {
      "!type": "number",
      "!doc": "The Number.EPSILON property represents the difference between one and the smallest value greater than one that can be represented as a Number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON"
    },
    "MAX_SAFE_INTEGER": {
      "!type": "number",
      "!doc": "The Number.MAX_SAFE_INTEGER constant represents the maximum safe integer in JavaScript (253 - 1).",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER"
    },
    "MIN_SAFE_INTEGER": {
      "!type": "number",
      "!doc": "The Number.MIN_SAFE_INTEGER constant represents the minimum safe integer in JavaScript (-(253 - 1)).",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER"
    },
    "isFinite": {
      "!type": "fn(testValue: ?) -> bool",
      "!doc": "The Number.isFinite() method determines whether the passed value is finite.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite"
    },
    "isInteger": {
      "!type": "fn(testValue: ?) -> bool",
      "!doc": "The Number.isInteger() method determines whether the passed value is an integer.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger"
    },
    "isNaN": {
      "!type": "fn(testValue: ?) -> bool",
      "!doc": "The Number.isNaN() method determines whether the passed value is NaN. More robust version of the original global isNaN().",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN"
    },
    "isSafeInteger": {
      "!type": "fn(testValue: ?) -> bool",
      "!doc": "The Number.isSafeInteger() method determines whether the provided value is a number that is a safe integer. A safe integer is an integer that",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger"
    },
    "parseFloat": {
      "!type": "fn(string: string) -> number",
      "!doc": "The Number.parseFloat() method parses a string argument and returns a floating point number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat"
    },
    "parseInt": {
      "!type": "fn(string: string, radix?: number) -> number",
      "!doc": "The Number.parseInt() method parses a string argument and returns an integer of the specified radix or base.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt"
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number",
    "!doc": "The Number JavaScript object is a wrapper object allowing you to work with numerical values. A Number object is created using the Number() constructor."
  },
  "Boolean": {
    "!type": "fn(value: ?) -> bool",
    "prototype": {
      "!stdProto": "Boolean"
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Boolean",
    "!doc": "The Boolean object is an object wrapper for a boolean value."
  },
  "RegExp": {
    "!type": "fn(source: string, flags?: string)",
    "prototype": {
      "!stdProto": "RegExp",
      "exec": {
        "!type": "fn(input: string) -> [string]",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/exec",
        "!doc": "Executes a search for a match in a specified string. Returns a result array, or null."
      },
      "test": {
        "!type": "fn(input: string) -> bool",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/test",
        "!doc": "Executes the search for a match between a regular expression and a specified string. Returns true or false."
      },
      "global": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp",
        "!doc": "Creates a regular expression object for matching text with a pattern."
      },
      "ignoreCase": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp",
        "!doc": "Creates a regular expression object for matching text with a pattern."
      },
      "multiline": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/multiline",
        "!doc": "Reflects whether or not to search in strings across multiple lines."
      },
      "source": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/source",
        "!doc": "A read-only property that contains the text of the pattern, excluding the forward slashes."
      },
      "lastIndex": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp/lastIndex",
        "!doc": "A read/write integer property that specifies the index at which to start the next match."
      },
      "flags": {
        "!type": "string",
        "!doc": "The flags property returns a string consisting of the flags of the current regular expression object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags"
      },
      "sticky": {
        "!type": "bool",
        "!doc": "The sticky property reflects whether or not the search is sticky (searches in strings only from the index indicated by the lastIndex property of this regular expression). sticky is a read-only property of an individual regular expression object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky"
      },
      "unicode": {
        "!type": "bool",
        "!doc": "The 'u' flag enables various Unicode-related features.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode"
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp",
    "!doc": "Creates a regular expression object for matching text with a pattern."
  },
  "Date": {
    "!type": "fn(ms: number)",
    "parse": {
      "!type": "fn(source: string) -> +Date",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/parse",
      "!doc": "Parses a string representation of a date, and returns the number of milliseconds since January 1, 1970, 00:00:00 UTC."
    },
    "UTC": {
      "!type": "fn(year: number, month: number, date: number, hour?: number, min?: number, sec?: number, ms?: number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/UTC",
      "!doc": "Accepts the same parameters as the longest form of the constructor, and returns the number of milliseconds in a Date object since January 1, 1970, 00:00:00, universal time."
    },
    "now": {
      "!type": "fn() -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/now",
      "!doc": "Returns the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC."
    },
    "prototype": {
      "toUTCString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toUTCString",
        "!doc": "Converts a date to a string, using the universal time convention."
      },
      "toISOString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toISOString",
        "!doc": "JavaScript provides a direct way to convert a date object into a string in ISO format, the ISO 8601 Extended Format."
      },
      "toDateString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toDateString",
        "!doc": "Returns the date portion of a Date object in human readable form in American English."
      },
      "toGMTString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toGMTString",
        "!doc": "Returns a string representing the Date based on the GMT (UT) time zone."
      },
      "toTimeString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toTimeString",
        "!doc": "Returns the time portion of a Date object in human readable form in American English."
      },
      "toLocaleDateString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toLocaleDateString",
        "!doc": "Converts a date to a string, returning the \"date\" portion using the operating system's locale's conventions."
      },
      "toLocaleFormat": {
        "!type": "fn(formatString: string) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleFormat",
        "!doc": "Converts a date to a string, using a format string."
      },
      "toLocaleString": {
        "!type": "fn(locales?: string, options?: ?) -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString",
        "!doc": "Returns a string with a locality sensitive representation of this date."
      },
      "toLocaleTimeString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString",
        "!doc": "Converts a date to a string, returning the \"time\" portion using the current locale's conventions."
      },
      "toSource": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toSource",
        "!doc": "A string representing the source code of the given Date object."
      },
      "toString": {
        "!type": "fn() -> string",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toString",
        "!doc": "A string representing the given date."
      },
      "valueOf": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/valueOf",
        "!doc": "Returns the primitive value of a Date object."
      },
      "getTime": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getTime",
        "!doc": "Returns the numeric value corresponding to the time for the specified date according to universal time."
      },
      "getFullYear": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getFullYear",
        "!doc": "Returns the year of the specified date according to local time."
      },
      "getYear": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getYear",
        "!doc": "Returns the year in the specified date according to local time."
      },
      "getMonth": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getMonth",
        "!doc": "Returns the month in the specified date according to local time."
      },
      "getUTCMonth": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getUTCMonth",
        "!doc": "Returns the month of the specified date according to universal time."
      },
      "getDate": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getDate",
        "!doc": "Returns the day of the month for the specified date according to local time."
      },
      "getUTCDate": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getUTCDate",
        "!doc": "Returns the day (date) of the month in the specified date according to universal time."
      },
      "getDay": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getDay",
        "!doc": "Returns the day of the week for the specified date according to local time."
      },
      "getUTCDay": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getUTCDay",
        "!doc": "Returns the day of the week in the specified date according to universal time."
      },
      "getUTCFullYear": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCFullYear",
        "!doc": "The getUTCFullYear() method returns the year in the specified date according to universal time."
      },
      "getHours": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getHours",
        "!doc": "Returns the hour for the specified date according to local time."
      },
      "getUTCHours": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getUTCHours",
        "!doc": "Returns the hours in the specified date according to universal time."
      },
      "getMinutes": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getMinutes",
        "!doc": "Returns the minutes in the specified date according to local time."
      },
      "getUTCMinutes": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date",
        "!doc": "Creates JavaScript Date instances which let you work with dates and times."
      },
      "getSeconds": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getSeconds",
        "!doc": "Returns the seconds in the specified date according to local time."
      },
      "getUTCSeconds": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getUTCSeconds",
        "!doc": "Returns the seconds in the specified date according to universal time."
      },
      "getMilliseconds": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getMilliseconds",
        "!doc": "Returns the milliseconds in the specified date according to local time."
      },
      "getUTCMilliseconds": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getUTCMilliseconds",
        "!doc": "Returns the milliseconds in the specified date according to universal time."
      },
      "getTimezoneOffset": {
        "!type": "fn() -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset",
        "!doc": "Returns the time-zone offset from UTC, in minutes, for the current locale."
      },
      "setTime": {
        "!type": "fn(date: +Date) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setTime",
        "!doc": "Sets the Date object to the time represented by a number of milliseconds since January 1, 1970, 00:00:00 UTC."
      },
      "setFullYear": {
        "!type": "fn(year: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setFullYear",
        "!doc": "Sets the full year for a specified date according to local time."
      },
      "setUTCFullYear": {
        "!type": "fn(year: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCFullYear",
        "!doc": "Sets the full year for a specified date according to universal time."
      },
      "setYear": {
        "!type": "fn(yearValue: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setYear",
        "!doc": "Sets the year (usually 2-3 digits) for a specified date according to local time."
      },
      "setMonth": {
        "!type": "fn(month: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setMonth",
        "!doc": "Set the month for a specified date according to local time."
      },
      "setUTCMonth": {
        "!type": "fn(month: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCMonth",
        "!doc": "Sets the month for a specified date according to universal time."
      },
      "setDate": {
        "!type": "fn(day: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setDate",
        "!doc": "Sets the day of the month for a specified date according to local time."
      },
      "setUTCDate": {
        "!type": "fn(day: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCDate",
        "!doc": "Sets the day of the month for a specified date according to universal time."
      },
      "setHours": {
        "!type": "fn(hour: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setHours",
        "!doc": "Sets the hours for a specified date according to local time, and returns the number of milliseconds since 1 January 1970 00:00:00 UTC until the time represented by the updated Date instance."
      },
      "setUTCHours": {
        "!type": "fn(hour: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCHours",
        "!doc": "Sets the hour for a specified date according to universal time."
      },
      "setMinutes": {
        "!type": "fn(min: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setMinutes",
        "!doc": "Sets the minutes for a specified date according to local time."
      },
      "setUTCMinutes": {
        "!type": "fn(min: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCMinutes",
        "!doc": "Sets the minutes for a specified date according to universal time."
      },
      "setSeconds": {
        "!type": "fn(sec: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setSeconds",
        "!doc": "Sets the seconds for a specified date according to local time."
      },
      "setUTCSeconds": {
        "!type": "fn(sec: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCSeconds",
        "!doc": "Sets the seconds for a specified date according to universal time."
      },
      "setMilliseconds": {
        "!type": "fn(ms: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setMilliseconds",
        "!doc": "Sets the milliseconds for a specified date according to local time."
      },
      "setUTCMilliseconds": {
        "!type": "fn(ms: number) -> number",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/setUTCMilliseconds",
        "!doc": "Sets the milliseconds for a specified date according to universal time."
      },
      "toJSON": {
        "!type": "fn() -> string",
        "!doc": "Returns a string (using toISOString()) representing the Date object's value.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON"
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date",
    "!doc": "Creates JavaScript Date instances which let you work with dates and times."
  },
  "Error": {
    "!type": "fn(message: string)",
    "prototype": {
      "name": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Error/name",
        "!doc": "A name for the type of error."
      },
      "message": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Error/message",
        "!doc": "A human-readable description of the error."
      }
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Error",
    "!doc": "Creates an error object."
  },
  "SyntaxError": {
    "!type": "fn(message: string)",
    "prototype": "Error.prototype",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/SyntaxError",
    "!doc": "Represents an error when trying to interpret syntactically invalid code."
  },
  "ReferenceError": {
    "!type": "fn(message: string)",
    "prototype": "Error.prototype",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/ReferenceError",
    "!doc": "Represents an error when a non-existent variable is referenced."
  },
  "URIError": {
    "!type": "fn(message: string)",
    "prototype": "Error.prototype",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/URIError",
    "!doc": "Represents an error when a malformed URI is encountered."
  },
  "EvalError": {
    "!type": "fn(message: string)",
    "prototype": "Error.prototype",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/EvalError",
    "!doc": "Represents an error regarding the eval function."
  },
  "RangeError": {
    "!type": "fn(message: string)",
    "prototype": "Error.prototype",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RangeError",
    "!doc": "Represents an error when a number is not within the correct range allowed."
  },
  "TypeError": {
    "!type": "fn(message: string)",
    "prototype": "Error.prototype",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/TypeError",
    "!doc": "Represents an error an error when a value is not of the expected type."
  },
  "parseInt": {
    "!type": "fn(string: string, radix?: number) -> number",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/parseInt",
    "!doc": "Parses a string argument and returns an integer of the specified radix or base."
  },
  "parseFloat": {
    "!type": "fn(string: string) -> number",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/parseFloat",
    "!doc": "Parses a string argument and returns a floating point number."
  },
  "isNaN": {
    "!type": "fn(value: number) -> bool",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/isNaN",
    "!doc": "Determines whether a value is NaN or not. Be careful, this function is broken. You may be interested in ECMAScript 6 Number.isNaN."
  },
  "isFinite": {
    "!type": "fn(value: number) -> bool",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/isFinite",
    "!doc": "Determines whether the passed value is a finite number."
  },
  "eval": {
    "!type": "fn(code: string) -> ?",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/eval",
    "!doc": "Evaluates JavaScript code represented as a string."
  },
  "encodeURI": {
    "!type": "fn(uri: string) -> string",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI",
    "!doc": "Encodes a Uniform Resource Identifier (URI) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape sequences for characters composed of two \"surrogate\" characters)."
  },
  "encodeURIComponent": {
    "!type": "fn(uri: string) -> string",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent",
    "!doc": "Encodes a Uniform Resource Identifier (URI) component by replacing each instance of certain characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character (will only be four escape sequences for characters composed of two \"surrogate\" characters)."
  },
  "decodeURI": {
    "!type": "fn(uri: string) -> string",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/decodeURI",
    "!doc": "Decodes a Uniform Resource Identifier (URI) previously created by encodeURI or by a similar routine."
  },
  "decodeURIComponent": {
    "!type": "fn(uri: string) -> string",
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/decodeURIComponent",
    "!doc": "Decodes a Uniform Resource Identifier (URI) component previously created by encodeURIComponent or by a similar routine."
  },
  "Math": {
    "E": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/E",
      "!doc": "The base of natural logarithms, e, approximately 2.718."
    },
    "LN2": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/LN2",
      "!doc": "The natural logarithm of 2, approximately 0.693."
    },
    "LN10": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/LN10",
      "!doc": "The natural logarithm of 10, approximately 2.302."
    },
    "LOG2E": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/LOG2E",
      "!doc": "The base 2 logarithm of E (approximately 1.442)."
    },
    "LOG10E": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/LOG10E",
      "!doc": "The base 10 logarithm of E (approximately 0.434)."
    },
    "SQRT1_2": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/SQRT1_2",
      "!doc": "The square root of 1/2; equivalently, 1 over the square root of 2, approximately 0.707."
    },
    "SQRT2": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/SQRT2",
      "!doc": "The square root of 2, approximately 1.414."
    },
    "PI": {
      "!type": "number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/PI",
      "!doc": "The ratio of the circumference of a circle to its diameter, approximately 3.14159."
    },
    "abs": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/abs",
      "!doc": "Returns the absolute value of a number."
    },
    "cos": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/cos",
      "!doc": "Returns the cosine of a number."
    },
    "sin": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/sin",
      "!doc": "Returns the sine of a number."
    },
    "tan": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/tan",
      "!doc": "Returns the tangent of a number."
    },
    "acos": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/acos",
      "!doc": "Returns the arccosine (in radians) of a number."
    },
    "asin": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/asin",
      "!doc": "Returns the arcsine (in radians) of a number."
    },
    "atan": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/atan",
      "!doc": "Returns the arctangent (in radians) of a number."
    },
    "atan2": {
      "!type": "fn(y: number, x: number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/atan2",
      "!doc": "Returns the arctangent of the quotient of its arguments."
    },
    "ceil": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/ceil",
      "!doc": "Returns the smallest integer greater than or equal to a number."
    },
    "floor": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/floor",
      "!doc": "Returns the largest integer less than or equal to a number."
    },
    "round": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/round",
      "!doc": "Returns the value of a number rounded to the nearest integer."
    },
    "exp": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/exp",
      "!doc": "Returns E^x, where x is the argument, and E is Euler's constant, the base of the natural logarithms."
    },
    "log": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/log",
      "!doc": "Returns the natural logarithm (base E) of a number."
    },
    "sqrt": {
      "!type": "fn(number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/sqrt",
      "!doc": "Returns the square root of a number."
    },
    "pow": {
      "!type": "fn(number, number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/pow",
      "!doc": "Returns base to the exponent power, that is, baseexponent."
    },
    "max": {
      "!type": "fn(number, number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/max",
      "!doc": "Returns the largest of zero or more numbers."
    },
    "min": {
      "!type": "fn(number, number) -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/min",
      "!doc": "Returns the smallest of zero or more numbers."
    },
    "random": {
      "!type": "fn() -> number",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random",
      "!doc": "Returns a floating-point, pseudo-random number in the range [0, 1) that is, from 0 (inclusive) up to but not including 1 (exclusive), which you can then scale to your desired range."
    },
    "acosh": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.acosh() function returns the hyperbolic arc-cosine of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh"
    },
    "asinh": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.asinh() function returns the hyperbolic arcsine of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh"
    },
    "atanh": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.atanh() function returns the hyperbolic arctangent of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh"
    },
    "cbrt": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.cbrt() function returns the cube root of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt"
    },
    "clz32": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.clz32() function returns the number of leading zero bits in the 32-bit binary representation of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32"
    },
    "cosh": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.cosh() function returns the hyperbolic cosine of a number, that can be expressed using the constant e:",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh"
    },
    "expm1": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.expm1() function returns ex - 1, where x is the argument, and e the base of the natural logarithms.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1"
    },
    "fround": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.fround() function returns the nearest single precision float representation of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround"
    },
    "hypot": {
      "!type": "fn(value: number) -> number",
      "!doc": "The Math.hypot() function returns the square root of the sum of squares of its arguments.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot"
    },
    "imul": {
      "!type": "fn(a: number, b: number) -> number",
      "!doc": "The Math.imul() function returns the result of the C-like 32-bit multiplication of the two parameters.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul"
    },
    "log10": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.log10() function returns the base 10 logarithm of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10"
    },
    "log1p": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.log1p() function returns the natural logarithm (base e) of 1 + a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p"
    },
    "log2": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.log2() function returns the base 2 logarithm of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2"
    },
    "sign": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.sign() function returns the sign of a number, indicating whether the number is positive, negative or zero.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign"
    },
    "sinh": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.sinh() function returns the hyperbolic sine of a number, that can be expressed using the constant e:",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh"
    },
    "tanh": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.tanh() function returns the hyperbolic tangent of a number.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh"
    },
    "trunc": {
      "!type": "fn(x: number) -> number",
      "!doc": "The Math.trunc() function returns the integral part of a number by removing any fractional digits. It does not round any numbers. The function can be expressed with the floor() and ceil() function:",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc"
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math",
    "!doc": "A built-in object that has properties and methods for mathematical constants and functions."
  },
  "JSON": {
    "parse": {
      "!type": "fn(json: string, reviver?: fn(key: string, value: ?) -> ?) -> ?",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/parse",
      "!doc": "Parse a string as JSON, optionally transforming the value produced by parsing."
    },
    "stringify": {
      "!type": "fn(value: ?, replacer?: fn(key: string, value: ?) -> ?, space?: string|number) -> string",
      "!url": "https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify",
      "!doc": "Convert a value to JSON, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified."
    },
    "!url": "https://developer.mozilla.org/en-US/docs/JSON",
    "!doc": "JSON (JavaScript Object Notation) is a data-interchange format.  It closely resembles a subset of JavaScript syntax, although it is not a strict subset. (See JSON in the JavaScript Reference for full details.)  It is useful when writing any kind of JavaScript-based application, including websites and browser extensions.  For example, you might store user information in JSON format in a cookie, or you might store extension preferences in JSON in a string-valued browser preference."
  },
  "ArrayBuffer": {
    "!type": "fn(length: number)",
    "!doc": "The ArrayBuffer object is used to represent a generic, fixed-length raw binary data buffer.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer",
    "isView": {
      "!type": "fn(arg: +ArrayBuffer) -> bool",
      "!doc": "The ArrayBuffer.isView() method returns true if arg is one of the ArrayBuffer views, such as typed array objects or a DataView; false otherwise.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView"
    },
    "prototype": {
      "byteLength": {
        "!type": "number",
        "!doc": "The byteLength accessor property represents the length of an ArrayBuffer in bytes.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/byteLength"
      },
      "slice": {
        "!type": "fn(begin: number, end?: number) -> +ArrayBuffer",
        "!doc": "The slice() method returns a new ArrayBuffer whose contents are a copy of this ArrayBuffer's bytes from begin, inclusive, up to end, exclusive.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/slice"
      }
    }
  },
  "DataView": {
    "!type": "fn(buffer: +ArrayBuffer, byteOffset?: number, byteLength?: number)",
    "!doc": "The DataView view provides a low-level interface for reading data from and writing it to an ArrayBuffer.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView",
    "prototype": {
      "buffer": {
        "!type": "+ArrayBuffer",
        "!doc": "The buffer accessor property represents the ArrayBuffer referenced by the DataView at construction time.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/buffer"
      },
      "byteLength": {
        "!type": "number",
        "!doc": "The byteLength accessor property represents the length (in bytes) of this view from the start of its ArrayBuffer.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/byteLength"
      },
      "byteOffset": {
        "!type": "number",
        "!doc": "The byteOffset accessor property represents the offset (in bytes) of this view from the start of its ArrayBuffer.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/byteOffset"
      },
      "getFloat32": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getFloat32() method gets a signed 32-bit integer (float) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat32"
      },
      "getFloat64": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getFloat64() method gets a signed 64-bit float (double) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getFloat64"
      },
      "getInt16": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getInt16() method gets a signed 16-bit integer (short) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt16"
      },
      "getInt32": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getInt32() method gets a signed 32-bit integer (long) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt32"
      },
      "getInt8": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getInt8() method gets a signed 8-bit integer (byte) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getInt8"
      },
      "getUint16": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getUint16() method gets an unsigned 16-bit integer (unsigned short) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint16"
      },
      "getUint32": {
        "!type": "fn(byteOffset: number, littleEndian?: bool) -> number",
        "!doc": "The getUint32() method gets an unsigned 32-bit integer (unsigned long) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32"
      },
      "getUint8": {
        "!type": "fn(byteOffset: number) -> number",
        "!doc": "The getUint8() method gets an unsigned 8-bit integer (unsigned byte) at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint8"
      },
      "setFloat32": {
        "!type": "fn(byteOffset: number, value: number, littleEndian?: bool)",
        "!doc": "The setFloat32() method stores a signed 32-bit integer (float) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setFloat32"
      },
      "setFloat64": {
        "!type": "fn(byteOffset: number, value: number, littleEndian?: bool)",
        "!doc": "The setFloat64() method stores a signed 64-bit integer (double) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setFloat64"
      },
      "setInt16": {
        "!type": "fn(byteOffset: number, value: number, littleEndian?: bool)",
        "!doc": "The setInt16() method stores a signed 16-bit integer (short) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setInt16"
      },
      "setInt32": {
        "!type": "fn(byteOffset: number, value: number, littleEndian?: bool)",
        "!doc": "The setInt32() method stores a signed 32-bit integer (long) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setInt32"
      },
      "setInt8": {
        "!type": "fn(byteOffset: number, value: number)",
        "!doc": "The setInt8() method stores a signed 8-bit integer (byte) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setInt8"
      },
      "setUint16": {
        "!type": "fn(byteOffset: number, value: number, littleEndian?: bool)",
        "!doc": "The setUint16() method stores an unsigned 16-bit integer (unsigned short) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setUint16"
      },
      "setUint32": {
        "!type": "fn(byteOffset: number, value: number, littleEndian?: bool)",
        "!doc": "The setUint32() method stores an unsigned 32-bit integer (unsigned long) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setUint32"
      },
      "setUint8": {
        "!type": "fn(byteOffset: number, value: number)",
        "!doc": "The setUint8() method stores an unsigned 8-bit integer (byte) value at the specified byte offset from the start of the DataView.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/setUint8"
      }
    }
  },
  "Float32Array": "TypedArray",
  "Float64Array": "TypedArray",
  "Int16Array": "TypedArray",
  "Int32Array": "TypedArray",
  "Int8Array": "TypedArray",
  "Map": {
    "!type": "fn(iterable?: [?])",
    "!doc": "The Map object is a simple key/value map. Any value (both objects and primitive values) may be used as either a key or a value.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
    "prototype": {
      "clear": {
        "!type": "fn()",
        "!doc": "The clear() method removes all elements from a Map object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear"
      },
      "delete": {
        "!type": "fn(key: ?)",
        "!doc": "The delete() method removes the specified element from a Map object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete"
      },
      "entries": {
        "!type": "fn() -> +iter[:t=[!this.:key, !this.:value]]",
        "!doc": "The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries"
      },
      "forEach": {
        "!type": "fn(callback: fn(value: ?, key: ?, map: +Map), thisArg?: ?)",
        "!effects": ["call !0 this=!1 !this.:value !this.:key !this"],
        "!doc": "The forEach() method executes a provided function once per each key/value pair in the Map object, in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach"
      },
      "get": {
        "!type": "fn(key: ?) -> !this.:value",
        "!doc": "The get() method returns a specified element from a Map object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get"
      },
      "has": {
        "!type": "fn(key: ?) -> bool",
        "!doc": "The has() method returns a boolean indicating whether an element with the specified key exists or not.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has"
      },
      "keys": {
        "!type": "fn() -> +iter[:t=!this.:key]",
        "!doc": "The keys() method returns a new Iterator object that contains the keys for each element in the Map object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys"
      },
      "set": {
        "!type": "fn(key: ?, value: ?) -> !this",
        "!effects": ["propagate !0 !this.:key", "propagate !1 !this.:value"],
        "!doc": "The set() method adds a new element with a specified key and value to a Map object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set"
      },
      "size": {
        "!type": "number",
        "!doc": "The size accessor property returns the number of elements in a Map object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size"
      },
      "values": {
        "!type": "fn() -> +iter[:t=!this.:value]",
        "!doc": "The values() method returns a new Iterator object that contains the values for each element in the Map object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values"
      },
      ":Symbol.iterator": {
        "!type": "fn() -> +iter[:t=[!this.:key, !this.:value]]",
        "!doc": "Returns a new Iterator object that contains the [key, value] pairs for each element in the Map object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator"
      }
    }
  },
  "Promise": {
    "!type": "fn(executor: fn(resolve: fn(value: ?), reject: fn(reason: ?))) -> !custom:Promise_ctor",
    "!doc": "The Promise object is used for deferred and asynchronous computations. A Promise is in one of the three states:",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
    "all": {
      "!type": "fn(iterable: [+Promise]) -> +Promise[:t=[!0.<i>.:t]]",
      "!doc": "The Promise.all(iterable) method returns a promise that resolves when all of the promises in the iterable argument have resolved.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"
    },
    "race": {
      "!type": "fn(iterable: [+Promise]) -> !0.<i>",
      "!doc": "The Promise.race(iterable) method returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race"
    },
    "reject": "Promise_reject",
    "resolve": {
      "!type": "fn(value: ?) -> !custom:Promise_resolve",
      "!doc": "The Promise.resolve(value) method returns a Promise object that is resolved with the given value. If the value is a thenable (i.e. has a then method), the returned promise will 'follow' that thenable, adopting its eventual state; otherwise the returned promise will be fulfilled with the value.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve"
    },
    "prototype": "Promise.prototype"
  },
  "Proxy": {
    "!type": "fn(target: ?, handler: Proxy_handler)",
    "!doc": "The Proxy object is used to define the custom behavior in JavaScript fundamental operation (e.g. property lookup, assignment, enumeration, function invocation, etc).",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy",
    "revocable": {
      "!type": "fn(target: ?, handler: Proxy_handler) -> Proxy_revocable",
      "!doc": "The Proxy.revocable() method is used to create a revocable Proxy object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable"
    }
  },
  "Reflect": {
    "!doc": "Reflect is a built-in object that provides methods for interceptable JavaScript operations.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect",
    "apply": {
      "!type": "fn(target: fn(), thisArg?: ?, argumentList?: [?]) -> !0.!ret",
      "!doc": "Calls a target function with arguments as specified.",
      "!url":  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply"
    },
    "construct": {
      "!type": "fn(target: fn(), argumentList?: [?]) -> ?",
      "!doc": "Acts like the new operator as a function. It is equivalent to calling new target(...args).",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct"
    },
    "defineProperty": {
      "!type": "fn(target: ?, property: string, descriptor: propertyDescriptor) -> bool",
      "!doc": "The static Reflect.defineProperty() method is like Object.defineProperty() but returns a Boolean.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty"
    },
    "deleteProperty": {
      "!type": "fn(target: ?, property: string) -> bool",
      "!doc": "Works like the delete operator as a function.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/deleteProperty"
    },
    "enumerate": {
      "!type": "fn(target: ?) -> +iter[:t=string]",
      "!doc": "Returns an iterator with the enumerable own and inherited properties of the target object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/enumerate"
    },
    "get": {
      "!type": "fn(target: ?, property: string) -> ?",
      "!doc": "Gets a property from an object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get"
    },
    "getOwnPropertyDescriptor": {
      "!type": "fn(target: ?, property: string) -> ?",
      "!doc": "Returns a property descriptor of the given property if it exists on the object, undefined otherwise.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getOwnPropertyDescriptor"
    },
    "getPrototypeOf": {
      "!type": "fn(target: ?) -> ?",
      "!doc": "Returns the prototype of the specified object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf"
    },
    "has": {
      "!type": "fn(target: ?, property: string) -> bool",
      "!doc": "The static Reflect.has() method works like the in operator as a function.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has"
    },
    "isExtensible": {
      "!type": "fn(target: ?) -> bool",
      "!doc": "Determines if an object is extensible (whether it can have new properties added to it).",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/isExtensible"
    },
    "ownKeys": {
      "!type": "fn(target: ?) -> [string]",
      "!doc": "Returns an array of the target object's own property keys.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys"
    },
    "preventExtensions": {
      "!type": "fn(target: ?) -> bool",
      "!doc": "Prevents new properties from ever being added to an object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/preventExtensions"
    },
    "set": {
      "!type": "fn(target: ?, property: string, value: ?) -> bool",
      "!doc": "Set a property on an object.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set"
    },
    "setPrototypeOf": {
      "!type": "fn(target: ?, prototype: ?) -> bool",
      "!doc": "Sets the prototype of a specified object to another object or to null.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/setPrototypeOf"
    }
  },
  "Set": {
    "!type": "fn(iterable?: [?])",
    "!doc": "The Set object lets you store unique values of any type, whether primitive values or object references.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",
    "prototype": {
      "add": {
        "!type": "fn(value: ?) -> !this",
        "!effects": ["propagate !0 !this.:t"],
        "!doc": "The add() method appends a new element with a specified value to the end of a Set object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add"
      },
      "clear": {
        "!type": "fn()",
        "!doc": "The clear() method removes all elements from a Set object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/clear"
      },
      "delete": {
        "!type": "fn(value: ?) -> bool",
        "!doc": "The delete() method removes the specified element from a Set object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/delete"
      },
      "entries": {
        "!type": "fn() -> +iter[:t=[!this.:t]]",
        "!doc": "The entries() method returns a new Iterator object that contains an array of [value, value] for each element in the Set object, in insertion order. For Set objects there is no key like in Map objects. However, to keep the API similar to the Map object, each entry has the same value for its key and value here, so that an array [value, value] is returned.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries"
      },
      "forEach": {
        "!type": "fn(callback: fn(value: ?, value2: ?, set: +Set), thisArg?: ?)",
        "!effects": ["call !0 this=!1 !this.:t number !this"],
        "!doc": "The forEach() method executes a provided function once per each value in the Set object, in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/forEach"
      },
      "has": {
        "!type": "fn(value: ?) -> bool",
        "!doc": "The has() method returns a boolean indicating whether an element with the specified value exists in a Set object or not.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has"
      },
      "keys": {
        "!type": "fn() -> +iter[:t=!this.:t]",
        "!doc": "The values() method returns a new Iterator object that contains the values for each element in the Set object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/keys"
      },
      "size": {
        "!type": "number",
        "!doc": "The size accessor property returns the number of elements in a Set object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/size"
      },
      "values": {
        "!type": "fn() -> +iter[:t=!this.:t]",
        "!doc": "The values() method returns a new Iterator object that contains the values for each element in the Set object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values"
      },
      ":Symbol.iterator": {
        "!type": "fn() -> +iter[:t=!this.:t]",
        "!doc": "Returns a new Iterator object that contains the values for each element in the Set object in insertion order.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/@@iterator"
      }
    }
  },
  "Symbol": {
    "!type": "fn(description?: string) -> !custom:getSymbol",
    "!doc": "A symbol is a unique and immutable data type and may be used as an identifier for object properties. The symbol object is an implicit object wrapper for the symbol primitive data type.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol",
    "for": {
      "!type": "fn(key: string) -> !custom:getSymbol",
      "!doc": "The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for"
    },
    "keyFor": {
      "!type": "fn(sym: +Symbol) -> string",
      "!doc": "The Symbol.keyFor(sym) method retrieves a shared symbol key from the global symbol registry for the given symbol.",
      "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor"
    },
    "hasInstance": ":Symbol.hasInstance",
    "isConcatSpreadable": ":Symbol.isConcatSpreadable",
    "iterator": ":Symbol.iterator",
    "asyncIterator": ":Symbol.asyncIterator",
    "match": ":Symbol.match",
    "replace": ":Symbol.replace",
    "search": ":Symbol.search",
    "species": ":Symbol.species",
    "split": ":Symbol.split",
    "toStringTag": ":Symbol.toStringTag",
    "unscopables": ":Symbol.unscopables",
    "prototype": {
      "!stdProto": "Symbol"
    }
  },
  "Uint16Array": "TypedArray",
  "Uint32Array": "TypedArray",
  "Uint8Array": "TypedArray",
  "Uint8ClampedArray": "TypedArray",
  "WeakMap": {
    "!type": "fn(iterable?: [?])",
    "!doc": "The WeakMap object is a collection of key/value pairs in which the keys are objects and the values can be arbitrary values.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap",
    "prototype": {
      "delete": {
        "!type": "fn(key: ?) -> bool",
        "!doc": "The delete() method removes the specified element from a WeakMap object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/delete"
      },
      "get": {
        "!type": "fn(key: ?) -> !this.:value",
        "!doc": "The get() method returns a specified element from a WeakMap object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/get"
      },
      "has": {
        "!type": "fn(key: ?) -> bool",
        "!doc": "The has() method returns a boolean indicating whether an element with the specified key exists in the WeakMap object or not.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/has"
      },
      "set": {
        "!type": "fn(key: ?, value: ?)",
        "!effects": ["propagate !0 !this.:key", "propagate !1 !this.:value"],
        "!doc": "The set() method adds a new element with a specified key and value to a WeakMap object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/set"
      }
    }
  },
  "WeakSet": {
    "!type": "fn(iterable?: [?])",
    "!doc": "The WeakSet object lets you store weakly held objects in a collection.",
    "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet",
    "prototype": {
      "add": {
        "!type": "fn(value: ?)",
        "!doc": "The add() method appends a new object to the end of a WeakSet object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/add"
      },
      "delete": {
        "!type": "fn(value: ?) -> bool",
        "!doc": "The delete() method removes the specified element from a WeakSet object.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/delete"
      },
      "has": {
        "!type": "fn(value: ?) -> bool",
        "!doc": "The has() method returns a boolean indicating whether an object exists in a WeakSet or not.",
        "!url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/has"
      }
    }
  }
}
];