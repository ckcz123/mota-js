import { BaseAction } from "./action";
import { actionAttributes, sprites } from "./info";

interface CanChange {
    style: { [K in keyof CSSStyleDeclaration]?: boolean }
    filter?: boolean
    globalCompositeOperation?: boolean
    shadowColor?: boolean
    shadowBlur?: boolean
    shadowOffsetX?: boolean
    shadowOffsetY?: boolean
    direction?: boolean
    textAlign?: boolean
    textBaseline?: boolean
    globalAlpha?: boolean
}

const changed: Record<string, CanChange> = {};

/** 引入对应名称的sprite */
function getSprite(name: string) {
    if (!sprites[name]) throw new ReferenceError(`Use nonexistent sprite.`);
    return sprites[name];
}

export function resetSprite(sprite: Sprite) {
    const none = ['shadowColor', 'filter'];
    const zero = ['shadowBlur', 'shadowOffsetX', 'shadowOffsetY'];
    for (const key in changed[sprite.name]) {
        // @ts-ignore
        if (changed[sprite.name][key] && key !== 'style') {
            if (none.includes(key)) sprite.context[key as 'shadowColor' | 'filter'] = '';
            else if (zero.includes(key)) sprite.context[key as 'shadowBlur' | 'shadowOffsetX' | 'shadowOffsetY'] = 0;
            else if (key === 'globalCompositeOperation') sprite.context[key] = 'source-over';
            else if (key === 'direction') sprite.context[key] = 'ltr';
            else if (key === 'textAlign') sprite.context[key] = 'left';
            else if (key === 'textBaseline') sprite.context[key] = 'bottom';
        } else {
            for (const key in changed[sprite.name].style) {
                if (changed[sprite.name].style[key]) sprite.canvas.style[key] = '';
            }
        }
    }
}

export async function wait(name: string, data: { time: number }) {
    const { time } = data;
    await new Promise(res => {
        setTimeout(res, time);
    });
}

export function transition(name: string, data: { style: string, time: string, mode: string, delay: string }) {
    const { style, time, mode, delay } = data;
    // 直接设置css即可
    const sprite = getSprite(name);
    const s = sprite.canvas.style;
    const tran = `${style} ${time} ${delay} ${mode}`;
    if (s.transition === '') s.transition += tran;
    else s.transition += `, ${tran}`;
    changed[name].style.transition = true;
}

export function create(name: string, data: { x: number, y: number, w: number, h: number, z: number }) {
    const sprite = getSprite(name);
    resetSprite(sprite);
    changed[name] = { style: {} };
    sprite.setCss('display: block;');
    sprite.move(data.x, data.y);
    sprite.resize(data.w, data.h);
    sprite.rotate(0, sprite.width / 2, sprite.height / 2);
    sprite.canvas.style.zIndex = data.z.toString();
}

export function del(name: string) {
    const sprite = getSprite(name);
    sprite.setCss('display: none;');
}

export function move(name: string, data: { x: number, y: number, isDelta: boolean }) {
    const { x, y, isDelta } = data;
    const sprite = getSprite(name);
    sprite.move(x, y, isDelta);
}

export function resize(name: string, data: { w: number, h: number, styleOnly: boolean }) {
    const { w, h, styleOnly } = data;
    const sprite = getSprite(name);
    sprite.resize(w, h, styleOnly);
}

export function rotate(name: string, data: { cx: number, cy: number, angle: number }) {
    const { cx, cy, angle } = data;
    const sprite = getSprite(name);
    sprite.rotate(angle, cx, cy);
}

export function clear(name: string, data: { x: number, y: number, w: number, h: number }) {
    const { x, y, w, h } = data;
    const sprite = getSprite(name);
    sprite.clear(x, y, w, h);
}

export function css(name: string, css: { data: string }) {
    const { data } = css;
    const sprite = getSprite(name);
    // 解析出编辑的样式
    const effects = data.replace('\n', ';').replace(';;', ';').split(';');
    effects.forEach(function (v) {
        const content = v.split(':');
        let key = content[0];
        const value = content[1];
        key = key.trim().split('-').reduce(function (pre, curr, i, a) {
            if (i === 0 && curr !== '') return curr;
            if (a[0] === '' && i === 1) return curr;
            return pre + curr.toUpperCase()[0] + curr.slice(1);
        }, '');
        // @ts-ignore
        changed[name].style[key] = true;
        const canvas = sprite.canvas;
        // @ts-ignore
        if (key in canvas.style) canvas.style[key] = value;
    });
}

export function composite(name: string, data: { mode: GlobalCompositeOperation }) {
    const { mode } = data;
    const sprite = getSprite(name);
    const ctx = sprite.context;
    ctx.globalCompositeOperation = mode;
    changed[name].globalCompositeOperation = true;
}

export function filter(name: string, d: { data: string }) {
    const { data } = d;
    const sprite = getSprite(name);
    sprite.context.filter = data;
    changed[name].filter = true;
}

export function shadow(name: string, data: { shadowBlur: number, shadowColor: string, shadowOffsetX: number, shadowOffsetY: number }) {
    const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = data;
    const sprite = getSprite(name);
    const ctx = sprite.context;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    changed[name].shadowBlur = true;
    changed[name].shadowColor = true;
    changed[name].shadowOffsetX = true;
    changed[name].shadowOffsetY = true;
}

export function textInfo(name: string, data: { direction: CanvasDirection, textAlign: CanvasTextAlign, textBaseline: CanvasTextBaseline }) {
    const { direction, textAlign, textBaseline } = data;
    const sprite = getSprite(name);
    const ctx = sprite.context;
    ctx.direction = direction;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    changed[name].direction = true;
    changed[name].textAlign = true;
    changed[name].textBaseline = true;
}

export function opacity(name: string, data: { opacity: number }) {
    const sprite = getSprite(name);
    core.setAlpha(sprite.context, data.opacity);
    changed[name].globalAlpha = true;
}

export function save(name: string) {
    const sprite = getSprite(name);
    sprite.context.save();
}

export function restore(name: string) {
    const sprite = getSprite(name);
    sprite.context.restore();
}

export function line(name: string, data: { x1: number, y1: number, x2: number, y2: number, lineWidth: number, style: string }) {
    const { x1, y1, x2, y2, lineWidth, style } = data;
    const sprite = getSprite(name);
    core.drawLine(sprite.context, x1, y1, x2, y2, style, lineWidth);
}

export function arc(name: string, data: { x: number, y: number, r: number, start: number, end: number, stroke: boolean, lineWidth: number, style: string }) {
    const { x, y, r, start, end, stroke, style, lineWidth } = data;
    const sprite = getSprite(name);
    if (stroke) core.strokeArc(sprite.context, x, y, r, start, end, style, lineWidth);
    else core.fillArc(sprite.context, x, y, r, start, end, style);
}

export function circle(name: string, data: { x: number, y: number, r: number, stroke: boolean, lineWidth: number, style: string }) {
    const { x, y, r, stroke, style, lineWidth } = data;
    const sprite = getSprite(name);
    if (stroke) core.strokeCircle(sprite.context, x, y, r, style, lineWidth);
    else core.fillCircle(sprite.context, x, y, r, style)
}

export function rect(name: string, data: { x: number, y: number, w: number, h: number, stroke: boolean, lineWidth: number, style: string }) {
    const { x, y, w, h, stroke, style, lineWidth } = data;
    const sprite = getSprite(name);
    if (stroke) core.strokeRect(sprite.context, x, y, w, h, style, lineWidth);
    else core.fillRect(sprite.context, x, y, w, h, style);
}

export function roundRect(name: string, data: { x: number, y: number, w: number, h: number, r: number, stroke: boolean, lineWidth: number, style: string }) {
    const { x, y, w, h, r, stroke, style, lineWidth } = data;
    const sprite = getSprite(name);
    if (stroke) core.strokeRoundRect(sprite.context, x, y, w, h, r, style, lineWidth);
    else core.fillRoundRect(sprite.context, x, y, w, h, r, style);
}

export function polygon(name: string, data: { path: Array<[number, number]>, stroke: boolean, lineWidth: number, style: string }) {
    const { path, stroke, style, lineWidth } = data;
    const sprite = getSprite(name);
    if (stroke) core.strokePolygon(sprite.context, path, style, lineWidth);
    else core.fillPolygon(sprite.context, path, style);
}

export function ellipse(name: string, data: SpriteEllipse) {
    const { x, y, a, b, angle, stroke, style, lineWidth } = data;
    const sprite = getSprite(name);
    if (stroke) core.strokeEllipse(sprite.context, x, y, a, b, angle, style, lineWidth);
    else core.fillEllipse(sprite.context, x, y, a, b, angle, style);
}

export function arrow(name: string, data: { x1: number, y1: number, x2: number, y2: number, lineWidth: number, style: string }) {
    const { x1, y1, x2, y2, lineWidth, style } = data;
    const sprite = getSprite(name);
    core.drawArrow(sprite.context, x1, y1, x2, y2, style, lineWidth);
}

export function bezierCurve(name: string, data: { cp1x: number, cp1y: number, cp2x: number, cp2y: number, sx: number, sy: number, x: number, y: number, lineWidth: number, style: string }) {
    const { cp1x, cp1y, cp2x, cp2y, x, y, sx, sy, lineWidth, style } = data;
    const sprite = getSprite(name);
    let ctx = sprite.context;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = style;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.stroke();
}

export function image(name: string, data: { img: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number }) {
    const { img, sx, sy, sw, sh, dx, dy, dw, dh } = data;
    const sprite = getSprite(name);
    core.drawImage(sprite.context, img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function icon(name: string, data: SpriteIcon) {
    const { icon, x, y, w, h, frame } = data;
    const sprite = getSprite(name);
    core.drawIcon(sprite.context, icon, x, y, w, h, frame);
}

export function winskin(name: string, data: { img: string, x: number, y: number, w: number, h: number }) {
    const { img, x, y, w, h } = data;
    const sprite = getSprite(name);
    core.drawWindowSkin(img, sprite.context, x, y, w.toString(), h.toString());
}

export function text(name: string, data: { str: string, x: number, y: number, stroke: boolean, italic: boolean, font: string, fontSize: number, fontWeight: string, style: string, strokeStyle: string, lineWidth: number }) {
    const { str, x, y, italic, fontWeight, fontSize, font, lineWidth, stroke, strokeStyle, style } = data;
    const sprite = getSprite(name);
    const fontStyle = `${italic ? 'italic' : ''} ${fontWeight ?? ''} ${fontSize ?? ''} ${font || 'sans-serif'}`;
    sprite.context.lineWidth = lineWidth;
    if (stroke) core.fillBoldText(sprite.context, str, x, y, style, strokeStyle, fontStyle, void 0, lineWidth);
    else core.fillText(sprite.context, str, x, y, style, fontStyle);
}

export function textContent(name: string, data: { content: string, left: number, top: number, width: number, color: string, align: 'left' | 'center' | 'right', fontSize: number, lineHeight: number, time: number, font: string, letterSpacing: number, bold: boolean, italic: boolean }) {
    const { content, left, top, width, color, align, fontSize, lineHeight, time, font, letterSpacing, bold, italic } = data;
    const sprite = getSprite(name);
    core.drawTextContent(sprite.context, content, {
        left, top, maxWidth: width, color, align, fontSize,
        lineHeight, time, font, letterSpacing, bold, italic
    });
}
