// 可视化ui编辑器
///<reference path='../runtime.d.ts'/>
// 先检查有没有sprite化插件，同时竖屏不能使用
if (!Sprite)
    console.warn('没有安装sprite化插件，可视化ui编辑器将不可用！');
else if (main.mode === 'play' && !core.domStyle.isVertical)
    (function () {
        var eles = {};
        var sprites = {};
        var infos = {};
        var animates = {};
        var uis = {};
        var status = 'close';
        var mode = 'canvas';
        init();
        /** 初始化 */
        function init() {
            loadCss();
            showButton();
            appendBaseUi();
            addBaseListener();
            createDir();
        }
        /** 引入css文件 */
        function loadCss() {
            var dir = './extensions/visualUiEditor.css';
            var link = document.createElement('link');
            link.type = 'text/css';
            link.href = dir;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        /** 在左侧显示一个打开ui编辑器的按钮 */
        function showButton() {
            var btn = appendTo(document.body, 'button', 'visual-ui-btn');
            eles['visual-ui-btn'] = btn;
            btn.innerHTML = 'ui编辑器';
        }
        /** 创建指定元素，设定id和class名，并append到指定元素上 */
        function appendTo(target, tag, id, cls) {
            var ele = document.createElement(tag);
            ele.id = id !== null && id !== void 0 ? id : '';
            ele.className = cls !== null && cls !== void 0 ? cls : '';
            target.appendChild(ele);
            return ele;
        }
        /** 左侧编辑器的基本ui */
        function appendBaseUi() {
            // div + span + input
            var root = appendTo(document.body, 'div', 'ui-root');
            eles['ui-root'] = root;
            root.style.left = '-300px';
            // 画布 & 画面 & 动画 
            var mode = document.createElement('div');
            mode.id = 'ui-mode';
            eles['ui-mode'] = mode;
            document.body.appendChild(mode);
            var list = appendTo(mode, 'button', 'ui-mod-list', 'ui-mode');
            eles['ui-mode-list'] = list;
            list.innerHTML = '列表';
            var canvases = appendTo(mode, 'button', 'ui-mode-canvas', 'ui-mode');
            eles['ui-mode-canvas'] = canvases;
            canvases.innerHTML = '画布';
            var ui = appendTo(mode, 'button', 'ui-mode-ui', 'ui-mode');
            eles['ui-mode-ui'] = ui;
            ui.innerHTML = '画面';
            var animation = appendTo(mode, 'button', 'ui-mode-animation', 'ui-mode');
            eles['ui-mode-animation'] = animation;
            animation.innerHTML = '动画';
            // 具体内容信息
            var details = appendTo(root, 'div', 'ui-details');
            eles['ui-details'] = details;
        }
        /** 加入事件监听器 */
        function addBaseListener() {
            var btn = eles['visual-ui-btn'];
            btn.addEventListener('click', triggerEditor);
            var modesBtn = [
                eles['ui-mode-ui'], eles['ui-mode-canvas'], eles['ui-mode-animation'], eles['ui-mode-list']
            ];
            modesBtn.forEach(function (v) { return v.setAttribute('status', 'false'); });
            modesBtn[3].setAttribute('status', 'true');
            modesBtn.forEach(function (v) { return v.addEventListener('click', changeMode); });
        }
        /** 打开/关闭编辑器 */
        function triggerEditor() {
            var btn = eles['visual-ui-btn'];
            var root = eles['ui-root'];
            var list = eles['ui-mode'];
            if (status === 'close') {
                status = 'open';
                btn.style.left = '300px';
                root.style.left = '0px';
                list.style.left = '300px';
                inGame();
            }
            else {
                status = 'close';
                btn.style.left = '0px';
                root.style.left = '-300px';
                list.style.left = '-70px';
            }
        }
        /** 给按钮添加事件监听器，并根据当前状态加深指定按钮 */
        function changeMode() {
            var _this = this;
            var modesBtn = [
                eles['ui-mode-ui'], eles['ui-mode-canvas'], eles['ui-mode-animation'], eles['ui-mode-list']
            ];
            var id = this.id;
            var info = id.split('-');
            var targetMode = info[2];
            mode = targetMode;
            this.setAttribute('status', 'true');
            modesBtn.forEach(function (v) { return v !== _this && v.setAttribute('status', 'false'); });
        }
        /** 检查是否进入了游戏 */
        function inGame() {
            var details = eles['ui-details'];
            if (!core.isPlaying()) {
                // 在信息栏显示未进入游戏
                details.innerHTML = '未进入游戏';
                details.style.textAlign = 'center';
                details.style.fontSize = '40px';
                details.style.color = 'rgba(0, 0, 0, 0.6)';
                return false;
            }
            details.innerHTML = '';
            return true;
        }
        /** 创建ui保存目录 */
        function createDir() {
            fs.mkdir('_uis', function (err) {
                if (err)
                    return console.error(err);
                fs.readdir('_saves', function (err, data) {
                    console.log(data, err);
                });
            });
        }
        /** 复写开始游戏，在开始游戏后再次运行inGame，删除未进入游戏的提示 */
        // @ts-ignore
        var origin = events.prototype._startGame_start;
        // @ts-ignore
        events.prototype._startGame_start = function (hard, seed, route, callback) {
            origin.call(this, hard, seed, route, callback);
            inGame();
        };
    })();
