type Attr = {
    [K in Key]: {
        [A in keyof SpriteDrawInfo<K>]: [string, string]
    }
}

/** 枚举一下所有的画布混合方式，方便使用 */
export const composition = [
    "color", "color-burn", "color-dodge", "copy", "darken",
    "destination-atop", "destination-in", "destination-out", "destination-over",
    "difference", "exclusion", "hard-light", "hue", "lighten", "lighter", "luminosity",
    "multiply", "overlay", "saturation", "screen", "soft-light", "source-atop",
    "source-in", "source-out", "source-over", "xor"
];

/** 枚举所有的操作列表 */
export const drawActions: { [K in Key]: string } = {
    wait: '等待',
    transition: '设置过渡',
    create: '创建画布',
    del: '删除画布',
    move: '移动画布',
    resize: '缩放画布',
    rotate: '旋转画布',
    clear: '擦除画布',
    css: '设置css效果',
    composite: '设置混合方式',
    filter: '设置绘制滤镜',
    shadow: '设置阴影',
    textInfo: '设置文本属性',
    opacity: '设置不透明度',
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
export const actionAttributes: Attr = {
    wait: {
        time: ['毫秒数', 'number']
    },
    transition: {
        style: ['作用效果', 'string'],
        time: ['过渡时间', 'number_time'],
        mode: ['过渡方式', 'string'],
        delay: ['延迟', 'string']
    },
    create: {
        name: ['名称', 'readonly'],
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
        z: ['纵深', 'number']
    },
    del: {

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
        mode: ['混合方式', composition.join('|')]
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
    opacity: {
        opacity: ['不透明度', 'number']
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
        w: ['宽度', 'number'],
        h: ['高度', 'number'],
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
        str: ['文字', 'string'],
        x: ['横坐标', 'number'],
        y: ['纵坐标', 'number'],
        stroke: ['添加描边', 'boolean'],
        italic: ['斜体', 'boolean'],
        font: ['字体', 'string'],
        fontSize: ['字体大小', 'number_u'],
        fontWeight: ['字体粗细', 'string'],
        style: ['字体颜色', 'string'],
        strokeStyle: ['描边颜色', 'string'],
        maxWidth: ['最大宽度', 'number']
    },
    textContent: {
        content: ['文本', 'string_multi'],
        left: ['横坐标', 'number'],
        top: ['纵坐标', 'number'],
        maxWidth: ['宽度', 'number'],
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
export const units = [
    'cm', 'mm', 'Q', 'in', 'pc', 'pt', 'px',
    'em', 'ex', 'ch', 'rem', 'lh', 'vw', 'vh', 'vmin', 'vmax',
    '%'
];

export const sprites: Record<string, Sprite> = {};