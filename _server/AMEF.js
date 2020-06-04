/**
 * @file AMEF.js 为编辑器设计的框架
 */
(function () {
    'use strict';

    var __assign = function() {
        __assign = Object.assign;
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var reserves = [
        'class', 'const', 'debugger', 'delete',
        'extends', 'false', 'function', 'in', 'instanceof', 'interface',
        'let', 'new', 'null', 'super', 'this', 'true', 'typeof', 'var',
        'void', 'with', 'of',
        'as', 'break', 'case', 'catch', 'continue', 'default', 'do', 'else',
        'export', 'for', 'if', 'import', 'return',
        'switch', 'throw', 'try', 'while', 'with'
    ];
    var tokenreg = {
        variable: /[a-zA-Z_$][\w$]*/g,
        whitespace: /[ \t\r\n]+/g,
        comment: /\/\/.*$/mg,
        regexp: /\/([^\\\/]|\\.)+\/[gimsuy]*\s*(\.|;|,|\)|\]|\}|$)/mg,
        symbol: /[=><!~?:&|+\-*\/\^%]+/g,
        float: /\d+(_+\d+)*[eE]([\-+]?\d+(_+\d+)*)?/g,
        _float: /\d+(_+\d+)*\.\d+(_+\d+)*([eE][\-+]?\d+(_+\d+)*)?/g,
        hex: /0[xX][[0-9a-fA-F]+(_+[0-9a-fA-F]+)*n?/g,
        octal: /0[oO]?[[0-7]+(_+[0-7]+)*n?/g,
        binary: /0[bB][[01]+(_+[01]+)*n?/g,
        digit: /\d+(_+\d+)*n?/g,
    };
    var tokenizer = function (script) {
        var tokens = [];
        var i = 0;
        var state = 0;
        var inTemplateString = false;
        var bracketCounting = -1;
        var templateStringStart = -1;
        var tryMatch;
        var lastNoEmptyToken = ['', ''];
        var push = function (token) {
            if (token[0] != '' && token[0] != 'comment' && token[0] != 'comment.doc') {
                token[2] = lastNoEmptyToken;
                lastNoEmptyToken[3] = token;
                lastNoEmptyToken = token;
            }
            tokens.push(token);
        };
        var match = function (name, index) {
            if (index === void 0) { index = i; }
            tokenreg[name].lastIndex = index;
            var res = tokenreg[name].exec(script);
            if (tokenreg[name].lastIndex && i === tokenreg[name].lastIndex - res[0].length) {
                i = tokenreg[name].lastIndex - 1;
                return res;
            }
            return null;
        };
        for (; i < script.length; i++) {
            var ch = script[i];
            switch (state) {
                case 0:
                    {
                        if (ch === "{") {
                            if (inTemplateString) {
                                bracketCounting++;
                            }
                            push(["bracket", ch]);
                        }
                        else if (ch === "}") {
                            if (inTemplateString) {
                                bracketCounting--;
                                if (!bracketCounting) {
                                    templateStringStart = i + 1;
                                    state = 2;
                                }
                            }
                            push(["bracket", ch]);
                        }
                        else if (/[a-zA-Z_$]/.test(ch)) {
                            push(["identifier", match("variable")[0]]);
                        }
                        else if (/[ \t\r\n]/.test(ch)) {
                            push(["", match("whitespace")[0]]);
                        }
                        else if (ch === '/' && script[i + 1] === '*') {
                            if (script[i + 2] == '*' && script[i + 3] != '/') {
                                push(["comment.doc", "/**"]);
                                i += 2;
                                state = 1;
                            }
                            else {
                                var close_1 = script.indexOf("*/", i + 1);
                                push(["comment", script.slice(i, close_1 + 2)]);
                                i = close_1 + 1;
                            }
                        }
                        else if (ch === '/' && script[i + 1] === '/') {
                            push(["", match("comment")[0]]);
                        }
                        else if (ch === '/' && (tryMatch = match("regexp"))) {
                            push(["regexp", tryMatch[0]]);
                        }
                        else if (/[()\[\]]/.test(ch)) {
                            push(["bracket", ch]);
                        }
                        else if (/!(?=([^=]|$))/.test(ch)) {
                            push(["delimiter", ch]);
                        }
                        else if (/[=><!~?:&|+\-*\/\^%]/.test(ch)) {
                            var symbol = match("symbol")[0];
                            if (symbol === "=>") {
                                push(["keyword", symbol]);
                            }
                            else {
                                push(["delimiter", symbol]);
                            }
                        }
                        else if (/\d/.test(ch)) {
                            if (ch === '0') {
                                if (script[i + 1] === 'x' || script[i + 1] === 'X') {
                                    push(["number.hex", match("hex")[0]]);
                                    break;
                                }
                                else if (/[oO0-7]/.test(script[i + 1])) {
                                    push(["number.octal", match("octal")[0]]);
                                    break;
                                }
                                else if (script[i + 1] === 'b' || script[i + 1] === 'B') {
                                    push(["number.binary", match("binary")[0]]);
                                    break;
                                }
                            }
                            tryMatch = match("float") || match("_float") || match("digit");
                            push(["number", tryMatch[0]]);
                        }
                        else if (/[;,.]/.test(ch)) {
                            push(["delimiter", ch]);
                        }
                        else if (ch === '"' || ch === "'") {
                            var next = script.indexOf(ch, i + 1);
                            push(["string", script.slice(i, next + 1)]);
                            i = next;
                        }
                        else if (ch === "`") {
                            inTemplateString = true;
                            templateStringStart = i;
                            state = 2;
                        }
                    }
                    break;
                case 1:
                    {
                        if (ch === '*' && script[i + 1] === '/') {
                            push(["comment.doc", "*/"]);
                            i++;
                            state = 0;
                        }
                    }
                    break;
                case 2:
                    {
                        if (ch === '$' && script[i + 1] === '{') {
                            bracketCounting = 1;
                            push(["string.template", script.slice(templateStringStart, i)]);
                            push(["keyword", "${"]);
                            i++;
                            state = 0;
                        }
                        else if (ch === '`') {
                            push(["string.template", script.slice(templateStringStart, i + 1)]);
                            inTemplateString = false;
                            state = 0;
                        }
                    }
                    break;
            }
        }
        return tokens;
    };
    var parser = function (tokens) {
        var _a;
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (token[0] === "identifier"
                && reserves.includes(token[1])
                && token[2][1] != '.' && ((_a = token[3]) === null || _a === void 0 ? void 0 : _a[1]) != ':') {
                token[0] = "keyword";
            }
        }
        return tokens;
    };
    var transpiler = function (script) {
        var _a, _b;
        var rawtokens = parser(tokenizer(script));
        var tokens = [];
        var output = {};
        var _loop_1 = function (i) {
            var rawtoken = rawtokens[i];
            if (rawtoken[0] === "keyword") {
                if (rawtoken[1] === "const" || rawtoken[1] === "let") {
                    rawtoken[1] = "var";
                }
                else if (rawtoken[1] === "export") {
                    if (!output.exports)
                        output.exports = [];
                    if (rawtoken[3][1] === "default") {
                        rawtoken[4] = "";
                        rawtoken[3][4] = "exports.default =";
                    }
                    else {
                        output.exports.push(rawtoken[3][3][1]);
                        rawtoken[4] = "/* export */";
                    }
                }
                else if (rawtoken[1] === "import") {
                    if (!output.imports)
                        output.imports = {};
                    var now_1 = rawtoken[3];
                    rawtoken[4] = "/* import";
                    var next = function (step) {
                        if (step === void 0) { step = 1; }
                        while (step--)
                            now_1 = now_1[3];
                    };
                    if (now_1[0] === "string") {
                        output.imports[now_1[1].slice(1, -1)] = true;
                    }
                    else {
                        var imports = [];
                        if (now_1[0] === "identifier") {
                            imports.push(["default", now_1[1]]);
                            if (now_1[3][1] === ",")
                                next(2);
                        }
                        if (now_1[1] === "*") {
                            next(2);
                            imports.push(["*", now_1[1]]);
                        }
                        else if (now_1[1] === "{") {
                            next();
                            while (now_1[1] !== "}") {
                                if (now_1[3][1] === "as") {
                                    imports.push([now_1[1], now_1[3][3][1]]);
                                    next(3);
                                }
                                else {
                                    imports.push(now_1[1]);
                                }
                                next();
                                if (now_1[1] === ",")
                                    next();
                            }
                        }
                        next(2);
                        output.imports[now_1[1].slice(1, -1)] = imports;
                    }
                    if (((_a = now_1[3]) === null || _a === void 0 ? void 0 : _a[1]) === ";") {
                        next();
                    }
                    now_1[1] += " */\n";
                }
            }
            tokens.push((_b = rawtoken[4]) !== null && _b !== void 0 ? _b : rawtoken[1]);
        };
        for (var i = 0; i < rawtokens.length; i++) {
            _loop_1(i);
        }
        output.script = tokens.join('');
        return output;
    };

    var Module = (function () {
        function Module(hook) {
            this.hook = hook;
        }
        Object.defineProperty(Module.prototype, "content", {
            get: function () {
                return this._content;
            },
            set: function (val) {
                throw Error("模块导出内容不可修改");
            },
            enumerable: false,
            configurable: true
        });
        return Module;
    }());
    var cache = {};
    var resolvePath = function (now) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        var tokens = now.split('/');
        while (tokens[0] === '.')
            tokens.shift();
        tokens.pop();
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var path = paths_1[_a];
            var _tokens = path.split('/');
            for (var _b = 0, _tokens_1 = _tokens; _b < _tokens_1.length; _b++) {
                var _token = _tokens_1[_b];
                if (_token === '.')
                    continue;
                else if (_token === '..') {
                    if (tokens.length === 0 || tokens[tokens.length - 1] === '..') {
                        tokens.push();
                    }
                    tokens.pop();
                }
                else
                    tokens.push(_token);
            }
        }
        return tokens.join('/');
    };
    var importCSS = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var css;
            return __generator(this, function (_a) {
                css = document.createElement('link');
                css.rel = "stylesheet";
                css.type = "text/css";
                if (cache[url]) {
                    return [2, cache[url].hook];
                }
                return [2, new Promise(function (res) {
                        css.href = url;
                        document.head.appendChild(css);
                        cache[url]._content = css;
                        css.onload = function (e) { return res(); };
                    })];
            });
        });
    };
    var processJS = function (rawscript, url) {
        return __awaiter(this, void 0, void 0, function () {
            var headstrs, _a, imports, exports, script, deps, elm;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headstrs = [];
                        AMEF.__module__[url] = {};
                        _a = transpiler(rawscript), imports = _a.imports, exports = _a.exports, script = _a.script;
                        deps = Object.entries(imports || {}).map(function (_a) {
                            var path = _a[0], dep = _a[1];
                            if (Array.isArray(dep)) {
                                var uri_1 = resolvePath(url, path);
                                dep.forEach(function (e) {
                                    if (Array.isArray(e)) {
                                        if (e[0] === "*") {
                                            headstrs.push("var " + e[1] + " = AMEF.__module__[\"" + uri_1 + "\"];");
                                        }
                                        else {
                                            headstrs.push("var " + e[1] + " = AMEF.__module__[\"" + uri_1 + "\"][\"" + e[0] + "\"];");
                                        }
                                    }
                                    else {
                                        headstrs.push("var " + e + " = AMEF.__module__[\"" + uri_1 + "\"][\"" + e + "\"];");
                                    }
                                });
                            }
                            return _import(path, url);
                        });
                        return [4, Promise.all(deps)];
                    case 1:
                        _b.sent();
                        elm = document.createElement("script");
                        elm.innerHTML = "\"use strict\";\n/** @file " + url + " */\n(function(exports) {\n" + headstrs.join('\n') + " \n" + script + "\n" + (exports ? exports.map(function (e) { return "exports." + e + " = " + e + ";"; }).join('\n') : "") + "\n})(AMEF.__module__[\"" + url + "\"])\n    ";
                        document.body.appendChild(elm);
                        cache[url]._content = AMEF.__module__[url];
                        return [2];
                }
            });
        });
    };
    var importJS = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, fetch(url)
                        .then(function (e) { return e.text(); })
                        .then(function (script) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, processJS(script, url)];
                                case 1:
                                    _a.sent();
                                    return [2, cache[url].content];
                            }
                        });
                    }); })];
            });
        });
    };
    var importSFC = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, fetch(url)
                        .then(function (e) { return e.text(); })
                        .then(function (sfc) { return __awaiter(_this, void 0, void 0, function () {
                        var sandbox, script, template, styles;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sandbox = document.createElement("template");
                                    sandbox.innerHTML = sfc;
                                    script = sandbox.content.querySelector("script").innerHTML;
                                    template = sandbox.content.querySelector("template").innerHTML;
                                    styles = sandbox.content.querySelectorAll("style");
                                    return [4, processJS(script, url)];
                                case 1:
                                    _a.sent();
                                    styles.forEach(function (e) { return document.body.appendChild(e); });
                                    if (template && cache[url].content.default) {
                                        cache[url]._content.default.template = template;
                                    }
                                    return [2, cache[url].content];
                            }
                        });
                    }); })];
            });
        });
    };
    var loaders = {
        "css": importCSS,
        "js": importJS,
        "html": importSFC,
    };
    var registerLoader = function (suffix, loader) {
        if (suffix in loaders) {
            console.error("注册" + suffix + "loader失败, 已经有一个loader了");
        }
        else {
            loaders[suffix] = loader;
        }
    };
    var _import = function (path, now) {
        if (now === void 0) { now = "."; }
        return __awaiter(this, void 0, void 0, function () {
            var suffix;
            return __generator(this, function (_a) {
                suffix = path.split(".").slice(-1)[0];
                path = resolvePath(now, path);
                console.log(suffix, path, now);
                if (!(suffix in loaders)) {
                    throw Error("\u5728\u5F15\u5165 " + path + " \u65F6\u53D1\u751F\u9519\u8BEF: \u6CA1\u6709\u5BF9\u5E94\u7684\u52A0\u8F7D\u65B9\u6CD5");
                }
                if (!(path in cache)) {
                    cache[path] = new Module(loaders[suffix](path));
                }
                return [2, cache[path].hook];
            });
        });
    };

    var parseError = function (str, info) {
        throw Error("不正确的模板字符串: \n" + str + info);
    };
    var attrDict = {
        '@': "on",
        ':': "bind",
        '&': "model",
        '$': "order",
    };
    var tagParser = function (tpl) {
        var tagName = tpl.split(/[ >]/, 1)[0].slice(1);
        if (tpl.endsWith(tagName + '>')) {
            tpl = tpl.slice(tagName.length + 1, -tagName.length - 3);
        }
        else {
            tpl = tpl.slice(tagName.length + 1);
        }
        var state = 0, attrStart = -1, attrName = "", valueStart = -1, quotationMark = "";
        var tokenPool = {
            attrs: {},
            on: {},
            bind: {},
            model: {},
            order: {},
        };
        var push = function (val) {
            attrStart = -1;
            if (attrName[0] in attrDict) {
                tokenPool[attrDict[attrName[0]]][attrName.slice(1)] = val;
            }
            else {
                tokenPool.attrs[attrName] = val;
            }
            attrName = "";
        };
        for (var i = 0; i < tpl.length; i++) {
            var ch = tpl[i];
            switch (state) {
                case 0:
                    {
                        if (/[a-zA-Z#$@&]/.test(ch)) {
                            if (attrStart > 0) {
                                push("");
                            }
                            attrStart = i;
                            state = 1;
                        }
                        else if (ch === '=') {
                            if (attrStart == -1) {
                                parseError(tpl.substring(0, i + 1), " <=== 在此处匹配到了没有对应属性的赋值符号");
                            }
                            state = 2;
                        }
                        else if (ch === '>') {
                            if (attrStart > 0) {
                                push("");
                            }
                            return __assign({ tagName: tagName }, tokenPool);
                        }
                    }
                    break;
                case 1:
                    {
                        if (/[\s>=]/.test(ch)) {
                            attrName = tpl.substring(attrStart, i);
                            state = 0;
                            if (ch === '>' || ch === '=')
                                i--;
                        }
                    }
                    break;
                case 2:
                    {
                        if (/['"]/.test(ch)) {
                            quotationMark = ch;
                            valueStart = i + 1;
                            state = 3;
                        }
                        else if (/[>=]/.test(ch)) {
                            parseError(tpl.substring(0, i + 1), " <=== 在此处匹配到了没有对应值的赋值符号");
                        }
                    }
                    break;
                case 3:
                    {
                        if (ch == quotationMark) {
                            push(tpl.substring(valueStart, i));
                            state = 0;
                        }
                    }
                    break;
            }
        }
        parseError(tpl, "\n 没有正确终止");
    };
    var textParser = function (tpl) {
        var token = [];
        var state = 0, textStart = 0, experssionStart = 0;
        for (var i = 0; i < tpl.length; i++) {
            var ch = tpl[i];
            switch (state) {
                case 0:
                    {
                        if (ch === "{" && tpl[i + 1] === "{") {
                            token.push([0, tpl.substring(textStart, i)]);
                            experssionStart = i + 2;
                            i++;
                            state = 1;
                        }
                    }
                    break;
                case 1: {
                    if (ch === "}" && tpl[i + 1] === "}") {
                        token.push([1, tpl.substring(experssionStart, i)]);
                        textStart = i + 2;
                        i++;
                        state = 0;
                    }
                }
            }
        }
        if (state === 1) {
            parseError(tpl, "\n mustache值块没有正确终止 ");
        }
        return token;
    };
    var expressionParser = function (tpl) {
        var ref = {};
        var state = 0;
        var varLast = 0;
        var quotationMark;
        var tokens = [];
        for (var i = 0; i < tpl.length; i++) {
            var ch = tpl[i];
            switch (state) {
                case 0:
                    {
                        if (ch === '@') {
                            tokens.push(tpl.slice(varLast, i));
                            varLast = i + 1;
                            state = 2;
                        }
                        else if (/"'`/.test(ch)) {
                            quotationMark = ch;
                            state = 1;
                        }
                    }
                    break;
                case 1:
                    {
                        if (quotationMark == ch) {
                            state = 0;
                        }
                    }
                    break;
                case 2:
                    {
                        if (!/[\w$]/.test(ch)) {
                            ref[tpl.slice(varLast, i)] = true;
                            state = 0;
                        }
                    }
                    break;
            }
        }
        tokens.push(tpl.slice(varLast, tpl.length));
        return { ref: ref, experssion: tokens.join("this.") };
    };

    var bindAttr = function (elm, propName, val, self) {
        var _this = this;
        var _a = expressionParser(val), ref = _a.ref, experssion = _a.experssion;
        var calAttr = new Function(experssion).bind(self);
        var updateAttr = function () {
            elm.setAttribute(propName, calAttr());
        };
        Object.keys(ref).forEach(function (key) {
            _this.$watch(key, updateAttr);
        });
        updateAttr();
        elm.removeAttribute(":" + propName);
    };
    var AMEFComponent = (function () {
        function AMEFComponent(config) {
            var _this = this;
            this.$data = {};
            this.$prop = {};
            this.$name = "base";
            this.$children = [];
            this.$template = "";
            this.$components = {};
            this.$slots = {};
            this._watcher = {};
            this._listener = {};
            if (config.setup) {
                this._setup = config.setup.bind(this);
            }
            if (config.mounted) {
                this._mounted = config.mounted.bind(this);
            }
            if (config.name) {
                this.$name = config.name;
            }
            if (config.data) {
                this.$data = config.data();
            }
            if (config.template) {
                this.$template = config.template;
            }
            if (config.methods) {
                Object.entries(config.methods).forEach(function (_a) {
                    var name = _a[0], func = _a[1];
                    _this[name] = func.bind(_this);
                });
            }
            this._setup();
            Object.keys(this.$data).forEach(function (key) {
                _this.$observe(key, true);
            });
        }
        AMEFComponent.prototype._setup = function () {
        };
        AMEFComponent.prototype._mounted = function () {
        };
        AMEFComponent.prototype._deepBind = function (key, obj, target) {
            var _this = this;
            if (typeof obj === 'object') {
                for (var k in obj) {
                    this._deepBind(key, obj[k], obj);
                }
            }
            else {
                Object.defineProperty(target, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return obj;
                    },
                    set: function (newVal) {
                        if (obj !== newVal) {
                            obj = newVal;
                            if (typeof newVal == 'object')
                                _this._deepBind(key, newVal, target);
                            _this._watcher[key].forEach(function (e) { return e(newVal, obj); });
                        }
                    }
                });
            }
        };
        AMEFComponent.prototype.$observe = function (key, init) {
            if (!init && this.$data[key])
                return;
            if (this[key])
                this.$data[key] = this[key];
            this._watcher[key] = [];
            this._deepBind(key, this.$data[key], this);
        };
        AMEFComponent.prototype.$watch = function (propName, action) {
            this._watcher[propName].push(action);
        };
        AMEFComponent.prototype.$on = function (event, action) {
            if (!Array.isArray(this._listener[event]))
                this._listener[event] = [];
            this._listener[event].push(action);
        };
        AMEFComponent.prototype.$emit = function (event, payload) {
            if (Array.isArray(this._listener[event])) {
                this._listener[event].forEach(function (e) { return e(payload); });
            }
        };
        AMEFComponent.prototype._attachEmitter_Element = function (elm, tokens) {
            var _this = this;
            Object.entries(tokens.on).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                var experssion = expressionParser(val).experssion;
                var func = new Function(experssion).bind(_this);
                elm.addEventListener(key, function (e) {
                    func(e);
                });
                elm.removeAttribute(key);
            });
            Object.entries(tokens.bind).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                bindAttr(elm, key, val, _this);
            });
            var models = Object.entries(tokens.model);
            if (models.length > 0) {
                if (!(elm instanceof HTMLInputElement)) {
                    console.error("双向绑定指令只支持 <input/>" + "\nsource: " + elm.outerHTML);
                }
                else {
                    models.forEach(function (_a) {
                        var propName = _a[0], event = _a[1];
                        if (!_this[propName]) {
                            console.error("找不到双向绑定的目标属性 [" + propName + "] \nsource: " + elm.outerHTML);
                            return;
                        }
                        _this.$watch(propName, function (val) {
                            elm.value = val;
                        });
                        elm.value = _this[propName];
                        var needParse = (typeof _this[propName] === "number");
                        elm.addEventListener(event || "input", function (e) {
                            _this[propName] = needParse ? parseInt(e.target.value) : e.target.value;
                        });
                    });
                }
            }
        };
        AMEFComponent.prototype._attachEmitter_Component = function (elm, tokens, proto) {
            var _this = this;
            var component = new AMEFComponent(proto);
            Object.entries(tokens.on).forEach(function (_a) {
                var key = _a[0], val = _a[1];
                var experssion = expressionParser(val).experssion;
                var func = new Function(experssion).bind(_this);
                component.$on(key, function (e) {
                    func(e);
                });
                elm.removeAttribute(key);
            });
            return component;
        };
        AMEFComponent.prototype._attachEmitter_textNode = function (elm) {
            var _this = this;
            var textContent = textParser(elm.textContent);
            if (textContent.length === 1 && textContent[0][0] === 0)
                return;
            var refs = {};
            var renderTokens = [];
            for (var _i = 0, textContent_1 = textContent; _i < textContent_1.length; _i++) {
                var token = textContent_1[_i];
                if (token[0] == 1) {
                    var _a = expressionParser(token[1]), ref = _a.ref, experssion = _a.experssion;
                    renderTokens.push((new Function("return (" + experssion + ")")).bind(this));
                    Object.assign(refs, ref);
                }
                else {
                    renderTokens.push(token[1]);
                }
            }
            var updateText = function () {
                elm.textContent = renderTokens.map(function (token) {
                    if (token instanceof Function)
                        return token();
                    else
                        return token;
                }).join("");
                window.dbg = renderTokens;
            };
            Object.keys(refs).forEach(function (key) {
                _this.$watch(key, updateText);
            });
            updateText();
        };
        AMEFComponent.prototype._attachEmitter = function (elm, parent) {
            var _this = this;
            if (elm instanceof Element) {
                var tagHTML = elm.cloneNode().outerHTML;
                var tagContent = tagParser(tagHTML);
                var tagName = tagContent.tagName;
                var isComponent = tagName.includes("-");
                if (isComponent) {
                    var component = this.$components[tagName] || AMEF.__component__[tagName];
                    if (!component) {
                        throw Error("\u672A\u6CE8\u518C\u7684\u7EC4\u4EF6: <" + tagName + "></" + tagName + ">");
                    }
                    var childComponent = this._attachEmitter_Component(elm, tagContent, component);
                    childComponent.$slots.default = function () {
                        return _this.$render(elm.innerHTML);
                    };
                    childComponent.$mount(elm, this);
                }
                else {
                    this._attachEmitter_Element(elm, tagContent);
                    elm.childNodes.forEach(function (e) { return _this._attachEmitter(e, elm); });
                }
            }
            else if (elm) {
                this._attachEmitter_textNode(elm);
            }
        };
        AMEFComponent.prototype.$render = function (tpl) {
            var fac = document.createElement("div");
            fac.innerHTML = tpl;
            if (!fac.firstElementChild) {
                var name_1 = this.$name;
                throw Error("\u6A21\u677F\u5FC5\u987B\u6709\u4E00\u4E2A\u6839\u8282\u70B9, \u9519\u8BEF\u6765\u6E90: <" + name_1 + "></" + name_1 + ">");
            }
            this._attachEmitter(fac.firstElementChild);
            return fac.firstElementChild;
        };
        AMEFComponent.prototype.$mount = function (to, parent) {
            if (typeof to === "string") {
                to = document.querySelector(to);
                if (!to) {
                    throw Error("mount to enmty");
                }
            }
            if (parent) {
                parent.$children.push(this);
                this.$parent = parent;
            }
            this.$root = this.$render(this.$template);
            to.replaceWith(this.$root);
            this._mounted();
            return this;
        };
        return AMEFComponent;
    }());
    var AMEFProto = (function () {
        function AMEFProto() {
            this.Component = AMEFComponent;
            this.import = _import;
            this.registerLoader = registerLoader;
            this.__component__ = {};
            this.__module__ = {};
            this.tokenize = tokenizer;
            this.transpile = transpiler;
        }
        AMEFProto.prototype.register = function (name, component) {
            component.name = name;
            if (!name) {
                console.error("请提供组件名称, 错误组件: " + component);
                return;
            }
            else if (name in this.__component__) {
                console.error("\u5DF2\u7ECF\u6CE8\u518C\u4E86\u540C\u540D\u7EC4\u4EF6, \u9519\u8BEF\u7EC4\u4EF6: <" + name + "></" + name + ">");
                return;
            }
            else if (!name.includes("-")) {
                console.error("\u7EC4\u4EF6\u540D\u79F0\u5FC5\u987B\u5305\u542B\u8FDE\u5B57\u7B26, \u9519\u8BEF\u7EC4\u4EF6: <" + name + "></" + name + ">");
                return;
            }
            this.__component__[name] = component;
        };
        AMEFProto.prototype.instance = function (name) {
            return new AMEFComponent(this.__component__[name]);
        };
        return AMEFProto;
    }());
    window.AMEF = new AMEFProto();

}());
