// 可视化ui编辑器
///<reference path='../runtime.d.ts'/>

declare let fs: Fs

interface Fs {
    deleteFile: (path: string, callback: FsCallback) => void
    mkdir: (path: string, callback: FsCallback) => void
    readdir: (path: string, callback: (err?: string, data?: string[]) => void) => void
    writeMultiFiles: (fileNames: string[], datastrs: string[], callback: FsCallback) => void
    writeFile: (fileName: string, datastr: string, encoding: 'utf-8' | 'base64', callback: FsCallback) => void
    readFile: (fileName: string, encoding: 'utf-8' | 'base64', callback: FsCallback) => void
}

interface DrawDataOf<K extends keyof SpriteDrawInfoMap> {
    type: K
    sprite: string
    action: BaseAction<any>
}

interface SpriteDrawInfoMap {
    wait: Wait
    transition: Transition
    create: SpriteCreate
    delete: SpriteDelete
    move: SpriteMove
    resize: SpriteResize
    rotate: SpriteRotate
    clear: SpriteClear
    css: SpriteCss
    composite: SpriteComposite
    filter: SpriteFilter
    shadow: SpriteShadow
    textInfo: SpriteTextInfo
    save: void
    restore: void
    line: SpriteLine
    arc: SpriteArc
    circle: SpriteCircle
    rect: SpriteRect
    roundRect: SpriteRoundRect
    polygon: SpritePolygon
    ellipse: SpriteEllipse
    arrow: SpriteArrow
    bezierCurve: SpriteBezierCurve
    image: SpriteImage
    icon: SpriteIcon
    winskin: SpriteWinskin
    text: SpriteText
    textContent: SpriteTextContent
}

interface Wait {
    time: number
}

interface Transition {
    attribute: string[]
    time: string[]
    delay: string[]
    mode: ('linear' | 'ease-in' | 'ease-out' | 'ease-in-out')[]
}

interface SpriteCreate {
    x: number
    y: number
    w: number
    h: number
    z: number
    name?: string
}

interface SpriteDelete {
    name: string
}

interface SpriteMove {
    x: number
    y: number
    isDelta: boolean
}

interface SpriteResize {
    w: number
    h: number
    styleOnly: boolean
}

interface SpriteRotate {
    cx: number
    cy: number
    angle: number
}

interface SpriteClear {
    x?: number
    y?: number
    w?: number
    h?: number
}

interface SpriteCss {
    key: keyof CSSStyleDeclaration
    data: string
}

interface SpriteComposite {
    data: GlobalCompositeOperation
}

interface SpriteFilter {
    data: string
}

interface SpriteShadow {
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}

interface SpriteTextInfo {
    direction?: CanvasDirection;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}

interface BaseShape {
    stroke: boolean
    lineWidth: number
    style: string | CanvasGradient | CanvasPattern
}

interface BaseLocatedShape extends BaseShape {
    x: number
    y: number
}

interface SpriteLine extends BaseShape {
    x1: number
    x2: number
    y1: number
    y2: number
}

interface SpriteArc extends BaseLocatedShape {
    r: number
    start: number
    end: number
}

interface SpriteCircle extends BaseLocatedShape {
    r: number
}

interface SpriteRect extends BaseLocatedShape {
    w: number
    h: number
}

interface SpriteRoundRect extends BaseLocatedShape {
    w: number
    h: number
    r: number
}

interface SpritePolygon extends BaseShape {
    path: [number, number][]
}

interface SpriteEllipse extends BaseLocatedShape {
    a: number
    b: number
}

interface SpriteArrow extends BaseShape {
    x1: number
    x2: number
    y1: number
    y2: number
}

interface SpriteBezierCurve extends BaseShape {
    cp1x: number
    cp2x: number
    cp1y: number
    cp2y: number
    sx: number
    sy: number
    x: number
    y: number
}

interface SpriteImage {
    img: string | CanvasImageSource
    dx: number
    dy: number
    dw?: number
    dh?: number
    sx?: number
    sy?: number
    sw?: number
    sh?: number
}

interface SpriteIcon extends BaseLocatedShape {
    icon: string
    w: number
    h: number
    frame: number
}

interface SpriteWinskin {
    img: string
    x: number
    y: number
    w: number
    h: number
}

interface SpriteText {
    stroke: boolean
    font: string
    fontSize: string
    style: string | CanvasGradient | CanvasPattern
    strokeStyle: string | CanvasGradient | CanvasPattern
    italic: boolean
    fontWeight: number | 'bold' | 'normal' | 'bolder' | 'lighter'
    str: string
    maxWidth: number
}

interface SpriteTextContent {
    content: string
    x: number
    y: number
    width: number
    color: number
    align: 'left' | 'center' | 'right'
    fontSize: number
    lineHeight: number
    time: number
    font: string
    letterSpacing: number
    bold: boolean
    italic: boolean
}

type SpriteDrawInfo<K extends keyof SpriteDrawInfoMap> = SpriteDrawInfoMap[K]

type FsCallback = (err?: string, data?: string) => void

type UiMode = 'edit' | 'uiList'

/** 枚举一下所有的画布混合方式，方便使用 */
const composition = [
    "color", "color-burn", "color-dodge", "copy", "darken",
    "destination-atop", "destination-in", "destination-out", "destination-over",
    "difference", "exclusion", "hard-light", "hue", "lighten", "lighter", "luminosity",
    "multiply", "overlay", "saturation", "screen", "soft-light", "source-atop",
    "source-in", "source-out", "source-over", "xor"
];

/** 枚举所有的操作列表 */
const drawActions = {
    wait: '等待',
    transition: '设置过渡',
    create: '创建画布',
    delete: '删除画布',
    move: '移动画布',
    resize: '缩放画布',
    rotate: '旋转画布',
    clear: '擦除画布',
    css: '设置css效果',
    composite: '设置混合方式',
    filter: '设置绘制滤镜',
    shadow: '设置阴影',
    textInfo: '设置文本信息',
    save: '保存画布属性',
    restore: '回退画布属性',
    line: '绘制直线',
    arc: '绘制弧线',
    circle: '绘制圆',
    rect: '绘制矩形',
    roundRect: '绘制圆角矩形',
    polygon: '绘制多边形',
    ellipse: '绘制椭圆',
    arrow: '绘制箭头',
    bezierCurve: '绘制贝塞尔曲线',
    image: '绘制图片',
    icon: '绘制图标',
    winskin: '绘制窗口皮肤',
    text: '绘制文本',
    textContent: '绘制成段文本'
}

/** 枚举每个操作的参数及其类型 */
const actionAttributes = {
    wait: {
        time: ['毫秒数', 'number']
    },
    transition: {
        style: ['效果', 'string'],
        time: ['过渡时间', 'string'],
        mode: ['过渡方式', 'string'],
        delay: ['延迟', 'string']
    },
    create: {
        name: ['名称', 'string'],
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
        z: ['纵深', 'number']
    },
    delete: {
        name: ['画布名称', 'string']
    },
    move: {
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        isDelta: ['相对原来位置', 'boolean']
    },
    resize: {
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
        styleOnly: ['只修改样式', 'boolean']
    },
    rotate: {
        cx: ['中心横坐标', 'number'],
        cy: ['中心纵坐标', 'number'],
        angle: ['角度', 'number']
    },
    clear: {
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        w: ['宽度', 'number'],
        h: ['高度', 'number']
    },
    css: {
        data: ['css效果', 'string_multi']
    },
    composite: {
        mode: ['混合方式', 'string']
    },
    filter: {
        data: ['滤镜', 'string_multi']
    },
    shadow: {
        shadowBlur: ['阴影模糊', 'number'],
        shadowColor: ['阴影颜色', 'string'],
        shadowOffsetX: ['阴影横坐标', 'number'],
        shadowOffsetY: ['阴影纵坐标', 'number']
    },
    textInfo: {
        direction: ['文本方向', 'ltr|rtl'],
        textAlign: ['文本对齐', 'left|center|right'],
        textBaseline: ['文本基线', 'bottom|middle|top']
    },
    save: {},
    restore: {},
    line: {
        x1: ['起点横坐标', 'number'],
        y1: ['起点纵坐标', 'number'],
        x2: ['终点横坐标', 'number'],
        y2: ['终点纵坐标', 'number'],
        lineWidth: ['连线宽度', 'number'],
        style: ['连线颜色', 'string']
    },
    arc: {
        x: ['中心横坐标', 'number'],
        y: ['中心纵坐标', 'number'],
        r: ['半径', 'number'],
        start: ['起始弧度', 'number'],
        end: ['终止弧度', 'number'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    circle: {
        x: ['中心横坐标', 'number'],
        y: ['中心纵坐标', 'number'],
        r: ['半径', 'number'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    rect: {
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    roundRect: {
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
        r: ['圆角半径', 'number'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    polygon: {
        path: ['路径', 'Array<x,y>'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    ellipse: {
        x: ['中心横坐标', 'number'],
        y: ['中心纵坐标', 'number'],
        a: ['半长轴', 'number'],
        b: ['半短轴', 'number'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    arrow: {
        x1: ['起点横坐标', 'number'],
        y1: ['起点纵坐标', 'number'],
        x2: ['终点横坐标', 'number'],
        y2: ['终点纵坐标', 'number'],
        lineWidth: ['连线宽度', 'number'],
        style: ['连线颜色', 'string']
    },
    bezierCurve: {
        cp1x: ['控制点1横坐标', 'number'],
        cp1y: ['控制点1纵坐标', 'number'],
        cp2x: ['控制点2横坐标', 'number'],
        cp2y: ['控制点2纵坐标', 'number'],
        sx: ['起点横坐标', 'number'],
        sy: ['起点纵坐标', 'number'],
        x: ['终点横坐标', 'number'],
        y: ['终点纵坐标', 'number'],
        stroke: ['是否为边框', 'boolean'],
        lineWidth: ['线条宽度', 'number'],
        style: ['颜色', 'string']
    },
    image: {
        img: ['图片', 'string_img'],
        sx: ['裁切点横坐标', 'number'],
        sy: ['裁切点纵坐标', 'number'],
        sw: ['裁切宽度', 'number'],
        sh: ['裁切高度', 'number'],
        dx: ['绘制点横坐标', 'number'],
        dy: ['绘制点纵坐标', 'number'],
        dw: ['绘制宽度', 'number'],
        dh: ['绘制高度', 'number']
    },
    icon: {
        icon: ['图标id', 'string_icon'],
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        frame: ['帧数', 'number']
    },
    winskin: {
        img: ['皮肤背景', 'string_img'],
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
    },
    text: {
        stroke: ['添加描边', 'boolean'],
        italic: ['斜体', 'boolean'],
        font: ['字体', 'string'],
        fontSize: ['字体大小', 'number_u'],
        fontWeight: ['字体粗细', 'string'],
        style: ['字体颜色', 'string'],
        strokeStyle: ['描边颜色', 'string'],
        maxWidth: ['最大宽度', 'number'],
        str: ['文字', 'string']
    },
    textContent: {
        content: ['文本', 'string_multi'],
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        width: ['宽度', 'number'],
        color: ['颜色', 'string'],
        align: ['对齐', 'left|center|right'],
        fontSize: ['字体大小', 'number'],
        lineHeight: ['行间距', 'number'],
        time: ['打字机时间间隔', 'number'],
        font: ['字体名', 'string'],
        letterSpacing: ['字符间距', 'number'],
        bold: ['加粗', 'boolean'],
        italic: ['斜体', 'boolean']
    }
}

/** 所有合法单位 */
const units = [
    'cm', 'mm', 'Q', 'in', 'pc', 'pt', 'px',
    'em', 'ex', 'ch', 'rem', 'lh', 'vw', 'vh', 'vmin', 'vmax',
    '%'
];

/** 每个action的根类 */
class BaseAction<K extends keyof SpriteDrawInfoMap> {
    type: K
    data: SpriteDrawInfoMap[K]
    ele: HTMLDivElement
    detailed = false
    attrs: HTMLDivElement = document.createElement('div');
    static cnt = 0

    constructor(type: K, data: SpriteDrawInfoMap[K]) {
        this.type = type;
        this.data = data;
        this.ele = this.generateElement();
        BaseAction.cnt++;
    }

    /** 生成element */
    generateElement() {
        const div = document.createElement('div'); // 根div
        div.id = `ui-info-${BaseAction.cnt}`;
        div.className = 'ui-info';

        const data = document.createElement('div'); // 展示信息的div
        data.id = `ui-data-${BaseAction.cnt}`;
        data.className = 'ui-data';

        const detail = document.createElement('span'); // 展开与收回详细信息
        detail.id = `ui-trigger-detail-${BaseAction.cnt}`;
        detail.className = 'ui-trigger-detail';
        detail.innerHTML = '▲';
        data.appendChild(detail);
        div.appendChild(data);

        const del = document.createElement('span'); // 删除
        del.id = `ui-delete-${BaseAction.cnt}`;
        del.className = 'ui-delete';
        del.innerHTML = '✖';
        data.appendChild(del);

        const attributes = actionAttributes[this.type];
        const attrs = this.attrs; // 属性列表div
        attrs.id = `ui-attrs-${BaseAction.cnt}`;
        attrs.className = 'ui-attrs';

        // 展开/收回详细信息
        detail.addEventListener('click', () => {
            if (this.detailed) {
                attrs.remove();
                detail.style.transform = 'rotate(90deg)';
            } else {
                data.appendChild(attrs);
                detail.style.transform = 'rotate(180deg)';
            }
            this.detailed = !this.detailed;
        });

        // 依次生成div,span
        for (const key in attributes) {
            // @ts-ignore
            const [name, type] = attributes[key] as string[];
            const res = this.generateDiv(key as keyof SpriteDrawInfoMap, name, type);
            data.appendChild(res);
        }
        return div;
    }

    /** 生成某个属性的div */
    generateDiv(key: keyof SpriteDrawInfoMap, name: string, type: string) {
        const one = document.createElement('div');
        one.id = `ui-attrs-one-${BaseAction.cnt}`;
        one.className = 'ui-attrs-one';
        if (!/Array<[\w,]*>/.test(type)) { // 非数组形式
            // 包括属性名、输入框
            const n = document.createElement('span');
            n.innerHTML = name;
            n.id = `ui-name-${BaseAction.cnt}-${name}`;
            n.className = 'ui-name';
            one.appendChild(n);
            // 输入框，分情况，如果是a|b|c的形式，使用select
            if (!type.includes('|')) {
                // 继续细分，包括多行文本及选择图片等
                if (type === 'string_multi') {
                    // 多行文本，单独弹出一个对话框进行编辑
                    const open = document.createElement('button');
                    open.id = `ui-multi-${BaseAction.cnt}-${key}`;
                } else {
                    // 单行文本、数字、带单位的数字
                    const input = document.createElement('input');
                    input.id = `ui-input-${BaseAction.cnt}-${key}`;
                    input.className = 'ui-input';
                    input.type = 'text';
                    input.addEventListener('input', () => {
                        this.listenInput(input.value, type as ('number' | 'string' | 'number_u'), input);
                    });
                    one.appendChild(input);
                }
            } else {
                // 使用select
                const select = document.createElement('select');
                select.id = `ui-select-${BaseAction.cnt}-${key}`;
                select.className = 'ui-select';
                const os = type.split('|');
                for (const value of os) {
                    const option = document.createElement('option');
                    option.className = 'ui-option';
                    option.value = option.innerHTML = value;
                    select.appendChild(option);
                }
            }
        } else { // 数组形式
            // 数组形式需要一个新建按钮
            const info = document.createElement('div');
            info.id = `ui-array-${BaseAction.cnt}`;
            info.className = 'ui-array';
            one.appendChild(info);
            // 新建时数组为空，所以直接忽略渲染内容的步骤
            const add = document.createElement('button');
            add.className = 'ui-array-new';
            info.appendChild(add);
        }
        return one;
    }

    /** 监听input */
    listenInput(value: string, type: 'number' | 'string' | 'number_u', ele: HTMLInputElement) {
        const info = ele.id.split('-');
        const key = info[3] as keyof SpriteDrawInfoMap[K];
        if (type === 'string') {
            // 直接赋值即可，因为这时候不太可能会不合法
            // @ts-ignore
            this.data[key] = value;
        } else if (type === 'number_u') {
            // 如果没有单位，需要追加单位
            if (!units.includes((/[a-zA-Z]+/.exec(value) || [])[0])) {
                value += 'px';
                ele.value = value;
            }
            // @ts-ignore
            this.data[key] = value;
        } else {
            const n = parseFloat(value);
            if (isNaN(n)) {
                ele.setAttribute('_invalid', 'true');
                return;
            }
            ele.setAttribute('_invalid', 'false');
            // @ts-ignore
            this.data[key] = n;
        }
    }

    /** 监听select */
    listenSelcet(value: string, ele: HTMLSelectElement) {
        // 理论上不可能会出现不合法的现象，所以直接设置即可
        const info = ele.id.split('-');
        const key = info[3] as keyof SpriteDrawInfoMap[K];
        // @ts-ignore
        this.data[key] = value;
    }
}

// 先检查有没有sprite化插件，同时竖屏不能使用
if (!Sprite) console.warn('没有安装sprite化插件，可视化ui编辑器将不可用！');
else if (main.mode === 'play' && !core.domStyle.isVertical) (function () {

    const eles: { [x: string]: HTMLElement } = {};
    const sprites: { [x: string]: Sprite } = {};
    const uis: { [x: string]: DrawDataOf<any> } = {};

    let status: 'open' | 'close' = 'close';
    let mode: UiMode = 'edit';

    /** 是否已经列出了操作列表 */
    let listed = false;

    // 缓存的元素
    let actionList: HTMLDivElement;

    init();
    /** 初始化 */
    function init() {
        loadCss();
        showButton();
        appendBaseUi();
        addBaseListener();
        createDir();
        generateList();
    }

    /** 引入css文件 */
    function loadCss() {
        const dir = './extensions/visualUiEditor.css';
        const link = document.createElement('link');
        link.type = 'text/css';
        link.href = dir;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    /** 在左侧显示一个打开ui编辑器的按钮 */
    function showButton() {
        const btn = appendTo(document.body, 'button', 'visual-ui-btn');
        eles['visual-ui-btn'] = btn;
        btn.innerHTML = 'ui编辑器';
    }

    /** 创建指定元素，设定id和class名，并append到指定元素上 */
    function appendTo<K extends keyof HTMLElementTagNameMap>(target: HTMLElement, tag: K, id?: string, cls?: string): HTMLElementTagNameMap[K] {
        const ele = document.createElement(tag);
        ele.id = id ?? '';
        ele.className = cls ?? '';
        target.appendChild(ele);
        return ele;
    }

    /** 左侧编辑器的基本ui */
    function appendBaseUi() {
        // div + span + input
        const root = appendTo(document.body, 'div', 'ui-root');
        eles['ui-root'] = root;
        root.style.left = '-300px';
        // 画布 & 画面 & 动画 
        const mode = document.createElement('div');
        mode.id = 'ui-mode';
        eles['ui-mode'] = mode;
        document.body.appendChild(mode);
        const list = appendTo(mode, 'button', 'ui-mod-list', 'ui-mode');
        eles['ui-mode-list'] = list;
        list.innerHTML = '列表';
        const canvases = appendTo(mode, 'button', 'ui-mode-canvas', 'ui-mode');
        eles['ui-mode-edit'] = canvases;
        canvases.innerHTML = '编辑';
        // 具体内容信息
        const details = appendTo(root, 'div', 'ui-details');
        eles['ui-details'] = details;
        // 添加新操作
        const newAction = appendTo(details, 'button', 'ui-new');
        eles['ui-new'] = newAction;
        newAction.addEventListener('click', listActions);
    }

    /** 加入事件监听器 */
    function addBaseListener() {
        const btn = eles['visual-ui-btn'];
        btn.addEventListener('click', triggerEditor);
        const modesBtn = [
            eles['ui-mode-ui'], eles['ui-mode-canvas'], eles['ui-mode-animation'], eles['ui-mode-list']
        ];
        modesBtn.forEach(v => v.setAttribute('status', 'false'));
        modesBtn[3].setAttribute('status', 'true');
        modesBtn.forEach(v => v.addEventListener('click', changeMode));
    }

    /** 打开/关闭编辑器 */
    function triggerEditor() {
        const btn = eles['visual-ui-btn'];
        const root = eles['ui-root'];
        const list = eles['ui-mode'];
        if (status === 'close') {
            status = 'open';
            btn.style.left = '300px';
            root.style.left = '0px';
            list.style.left = '300px';
            inGame();
        } else {
            status = 'close';
            btn.style.left = '0px';
            root.style.left = '-300px';
            list.style.left = '-70px';
        }
    }

    /** 给按钮添加事件监听器，并根据当前状态加深指定按钮 */
    function changeMode(this: HTMLButtonElement) {
        const modesBtn = [
            eles['ui-mode-ui'], eles['ui-mode-canvas'], eles['ui-mode-animation'], eles['ui-mode-list']
        ];
        const id = this.id;
        const info = id.split('-');
        const targetMode = info[2];
        mode = targetMode as UiMode;
        this.setAttribute('status', 'true');
        modesBtn.forEach(v => v !== this && v.setAttribute('status', 'false'));
        mode = this.id.split('-')[2] as UiMode;
    }

    /** 检查是否进入了游戏 */
    function inGame(): boolean {
        const details = eles['ui-details'];
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

    /** 解析ui信息 */
    function extractUi(data: string) {
        const res = JSON.parse(data);
        return res;
    }

    /** 创建ui保存目录 */
    function createDir() {
        fs.mkdir('_uis', err => {
            if (err) return console.error(err);
            fs.readdir('_uis', (err, data) => {
                if (err) return console.error(err);
                data?.forEach(v => {
                    fs.readFile(`_uis/${v}`, 'utf-8', (err, data) => {
                        if (err) return console.error(err);
                        const res = extractUi(data as string);
                        uis[v] = res;
                    });
                });
            });
        });
    }

    /** 保存至本地文件 */
    function saveToLocal(id: string, data: any) {
        const res = JSON.stringify(data);
        fs.writeFile(`_uis/${id}.h5ui`, res, 'utf-8', (err) => {
            if (err) {
                console.error(err);
                core.drawTip('保存失败！错误信息请在控制台查看');
            } else {
                core.drawTip('保存成功');
            }
        });
    }

    /** 生成操作列表 */
    function generateList() {
        const list = document.createElement('div');
        list.id = 'ui-action-list';
        for (const action in actions) {
            const name = drawActions[action as keyof SpriteDrawInfoMap];
            const btn = document.createElement('button');
            btn.id = `ui-action-${action}`;
            btn.className = 'ui-action';
            btn.innerHTML = name;
            btn.addEventListener('click', clickAction);
            list.appendChild(btn);
        }
        actionList = list;
    }

    /** 点击某个操作后追加 */
    function clickAction(this: HTMLButtonElement) {
        const data = this.id.split('-');
        const action = data[2] as keyof SpriteDrawInfoMap;
        addAction(action);
    }

    /** 列出所有操作，让作者选择 */
    function listActions(this: HTMLButtonElement) {
        const details = eles['ui-details'];
        if (!listed) {
            details.appendChild(actionList);
        } else {
            actionList.remove();
        }
    }

    /** 添加新绘制操作 */
    function addAction<K extends keyof SpriteDrawInfoMap>(action: K) {
        if (!Object.values(sprites)[0]) {
            return core.drawTip('请先创建一个画布');
        }
        // 先生成初始信息
        // @ts-ignore
        const data: SpriteDrawInfo<K> = {};
        const info = actionAttributes[action];
        for (const attr in info) {
            // @ts-ignore
            const [name, type] = attr[info] as string[];
            switch (type) {
                case 'number':
                    // @ts-ignore
                    data[attr] = 0;
                    break;
                case 'string':
                case 'string_multi':
                case 'string_icon':
                case 'string_img':
                    // @ts-ignore
                    data[attr] = '';
                    break;
                case 'number_u':
                    // @ts-ignore
                    data[attr] = '0px';
                    break;
                case 'boolean':
                    // @ts-ignore
                    data[attr] = false;
                    break;
            }
            if (type.includes('Array')) {
                // @ts-ignore
                data[attr] = [];
            }
            if (type.includes('|')) {
                // @ts-ignore
                data[attr] = type.split('|')[0];
            }
        }
        const drawData: DrawDataOf<K> = {
            sprite: Object.values(sprites)[0].name,
            type: action,
            action: new BaseAction(action, data)
        };
        return drawData;
    }

    // @ts-ignore
    const origin = events.prototype._startGame_start;
    /** 复写开始游戏，在开始游戏后再次运行inGame，删除未进入游戏的提示 */
    // @ts-ignore
    events.prototype._startGame_start = function (hard, seed, route, callback) {
        origin.call(this, hard, seed, route, callback);
        inGame();
    }
})();