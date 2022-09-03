import { list } from "./action";

/** 对应sprite是否被删除 */
let sprites: { [x: string]: boolean } = {};
let spriteCnt = 0;

let dataCache: number[][] = [];

export async function compile() {
    // init
    sprites = {};
    let head = `// 请复制以下内容至插件中以使用
// 使用案例：
/* 
插件中：
this.showMyUi = function () {
    函数内容
}
调用时：
core.showMyUi();
*/
`;
    let body = '';
    let final = '';
    let funcs = ''; // 把函数放到末尾
    const data = dataCache = split();
    // 遍历list，依次编译
    await new Promise((res, rej) => {
        body += `action_${data[0][0]}_${data[0].at(-1)}();`
        for (let i = 0; i < data.length; i++) {
            const group = data[i]
            const { head: h, func } = generateFn(group, i);
            head += h;
            funcs += func;
        }
        // 最后把已经被“删除”的画布删除
        for (const name in sprites) {
            if (sprites[name] === true) final += `\n${name}.destroy();\n`;
        }
        res('success');
    });
    return `${head}\n${body}\n${final}\n${funcs}`;
}

/** 将操作以等待为分割线分为多个部分 */
function split() {
    const res: number[][] = [[]];
    for (let i = 0; i < list.value.length; i++) {
        res.at(-1)?.push(i);
        if (list.value[i].type === 'wait') res.push([]);
    }
    return res;
}

function createSprite(d: SpriteDrawInfo<'create'>) {
    const name = getSpriteName(d.name);
    const head =
        `var ${name} = new Sprite(${d.x}, ${d.y}, ${d.w}, ${d.h}, ${d.z}, 'game', '${name}');
${name}.setCss('display: none;');\n`;
    const body = `${name}.setCss('display: block;');
${name}.move(${d.x}, ${d.y});
${name}.resize(${d.w}, ${d.h});
${name}.canvas.style.zIndex = '${d.z}';\n`;
    sprites[name] = false;
    return { head, body };
}

function getSpriteName(id?: string) {
    if (!id || /^\d?[^\w\s]$/.test(id)) return `sprite_${spriteCnt++}`;
    else return id.trim().replace(/\s+/g, '_');
}

function generateFn(data: number[], index: number) {
    const start = `function action_${data[0]}_${data.at(-1)} () {\n`;
    const end = `}\n`;
    let body = '';
    let head = '';
    for (let i = 0; i < data.length; i++) {
        const action = list.value[data[i]];
        const sprite = getSpriteName(action.sprite);
        const res = compileOne(action.type, sprite, action.data, index);
        body += res.body;
        head += res.head;
    }
    return { head, func: start + body + end };
}

function compileOne<K extends keyof SpriteDrawInfoMap>(type: K, sprite: string, data: SpriteDrawInfoMap[K], index: number) {
    let head = '';
    let body = '';
    const has = (v: any) => v !== null && v !== void 0;
    if (type === 'wait') {
        body = `setTimeout(${getNext(index)}, ${(data as Wait).time});\n`
    } else if (type === 'transition') {
        const info = data as Transition;
        const style = `${info.style} ${info.time} ${info.mode} ${info.delay}`
        body =
            `var res = ${sprite}.canvas.style.transition;
if (res !== '') res += ', ';
res += '${style.trim()}';
${sprite}.canvas.style.transition = res;\n`;
    } else if (type === 'create') {
        const info = createSprite(data as SpriteDrawInfo<'create'>);
        head = info.head;
        body = info.body;
    } else if (type === 'del') {
        body = `${sprite}.setCss('display: none');\n`;
        sprites[sprite] = true;
    } else if (type === 'move') {
        const info = data as SpriteMove;
        body = `${sprite}.move(${info.x}, ${info.y}, ${info.isDelta});\n`;
    } else if (type === 'resize') {
        const info = data as SpriteResize;
        body = `${sprite}.resize(${info.w}, ${info.h}, ${info.styleOnly});\n`;
    } else if (type === 'rotate') {
        const info = data as SpriteRotate;
        body = `${sprite}.rotate(${info.angle}, ${info.cx}, ${info.cy});\n`;
    } else if (type === 'clear') {
        const info = data as SpriteClear;
        body = `${sprite}.clear(${info.x ?? ''}, ${info.y ?? ''}, ${info.w ?? ''}, ${info.h ?? ''});\n`
    } else if (type === 'css') {
        const info = data as SpriteCss;
        body = `${sprite}.setCss('${info.data}');\n`;
    } else if (type === 'composite') {
        const info = data as SpriteComposite;
        body = `${sprite}.context.globalCompositeOperation = '${info.mode}';\n`;
    } else if (type === 'filter') {
        const info = data as SpriteFilter;
        body = `${sprite}.context.filter = '${info.data}';\n`;
    } else if (type === 'shadow') {
        const info = data as SpriteShadow;
        if (info.shadowBlur) body += `${sprite}.context.shadowBlur = ${info.shadowBlur};\n`;
        if (info.shadowColor) body += `${sprite}.context.shadowColor = '${info.shadowColor}';\n`;
        if (info.shadowOffsetX) body += `${sprite}.context.shadowOffsetX = ${info.shadowOffsetX};\n`;
        if (info.shadowOffsetY) body += `${sprite}.context.shadowOffsetY = ${info.shadowOffsetY};\n`;
    } else if (type === 'textInfo') {
        const info = data as SpriteTextInfo;
        if (info.direction) body += `${sprite}.context.direction = '${info.direction}';\n`;
        if (info.textAlign) body += `${sprite}.context.textAlign = '${info.textAlign}';\n`;
        if (info.textBaseline) body += `${sprite}.context.textBaseline = '${info.textBaseline}';\n`;
    } else if (type === 'save') {
        body = `${sprite}.context.save();\n`;
    } else if (type === 'restore') {
        body = `${sprite}.context.restore();\n`;
    } else if (type === 'line') {
        const info = data as SpriteLine;
        body = `core.drawLine(${sprite}.context, ${info.x1}, ${info.y1}, ${info.x2}, ${info.y2}, '${info.style}', ${info.lineWidth});\n`;
    } else if (type === 'arc') {
        const info = data as SpriteArc;
        if (info.stroke) body = `core.strokeArc(${sprite}.context, ${info.x}, ${info.y}, ${info.r}, ${info.start}, ${info.end}, '${info.style}', ${info.lineWidth});\n`;
        else body = `core.fillArc(${sprite}.context, ${info.x}, ${info.y}, ${info.r}, ${info.start}, ${info.end}, '${info.style}');\n`;
    } else if (type === 'circle') {
        const info = data as SpriteCircle;
        if (info.stroke) body = `core.strokeCircle(${sprite}.context, ${info.x}, ${info.y}, ${info.r}, '${info.style}', ${info.lineWidth});\n`;
        else body = `core.fillCircle(${sprite}.context, ${info.x}, ${info.y}, ${info.r}, '${info.style}');\n`;
    } else if (type === 'rect') {
        const info = data as SpriteRect;
        if (info.stroke) body = `core.strokeRect(${sprite}.context, ${info.x}, ${info.y}, ${info.w}, ${info.h}, '${info.style}', ${info.lineWidth});\n`;
        else body = `core.fillRect(${sprite}.context, ${info.x}, ${info.y}, ${info.w}, ${info.h}, '${info.style}');\n`;
    } else if (type === 'roundRect') {
        const info = data as SpriteRoundRect;
        if (info.stroke) body = `core.strokeRoundRect(${sprite}.context, ${info.x}, ${info.y}, ${info.w}, ${info.h}, ${info.r}, '${info.style}', ${info.lineWidth});\n`;
        else body = `core.fillRoundRect(${sprite}.context, ${info.x}, ${info.y}, ${info.w}, ${info.h}, ${info.r}, '${info.style}');\n`;
    } else if (type === 'polygon') {
        const info = data as SpritePolygon;
        const res = '[' + info.path.reduce((pre, cur, i) => {
            return `${pre}${i === 0 ? '' : ', '}[${cur[0]}, ${cur[1]}]`;
        }, '') + ']';
        if (info.stroke) body = `core.strokePolygon(${sprite}.context, ${res}, '${info.style}', ${info.lineWidth});\n`;
        else body = `core.fillPolygon(${sprite}.context, ${res}, '${info.style}');\n`;
    } else if (type === 'ellipse') {
        const info = data as SpriteEllipse;
        if (info.stroke) body = `core.strokeEllipse(${sprite}.context, ${info.x}, ${info.y}, ${info.a}, ${info.b}, 0, '${info.style}', ${info.lineWidth});\n`;
        else body = `core.fillEllipse(${sprite}.context, ${info.x}, ${info.y}, ${info.a}, ${info.b}, 0, '${info.style}');\n`;
    } else if (type === 'arrow') {
        const info = data as SpriteArrow;
        body = `core.drawArrow(${sprite}.context, ${info.x1}, ${info.y1}, ${info.x2}, ${info.y2}, '${info.style}', ${info.lineWidth});\n`;
    } else if (type === 'bezierCurve') {
        const info = data as SpriteBezierCurve;
        body = `var ctx = ${sprite}.context;
ctx.moveTo(${info.sx}, ${info.sy});
ctx.bezierCurveTo(${info.cp1x}, ${info.cp1y}, ${info.cp2x}, ${info.cp2y}, ${info.x}, ${info.y});
ctx.strokeStyle = '${info.style}';
ctx.lineWidth = ${info.lineWidth};
ctx.stoke();\n`;
    } else if (type === 'image') {
        const info = data as SpriteImage;
        body = `core.drawImage(${sprite}.context, '${info.img}', `;
        const d1 = `${info.dx}, ${info.dh}, `;
        const d2 = `${info.dw}, ${info.dh}, `;
        const s = `${info.sx}, ${info.sy}, ${info.sw}, ${info.sh}, `;
        const end = `);\n`;
        if ([info.sx, info.sy, info.dw, info.dh].every(v => has(v))) body += s;
        body += d1;
        if (has(info.dh) && has(info.dw)) body += d2;
        body += end;
    } else if (type === 'icon') {
        const info = data as SpriteIcon;
        body = `core.drawIcon(${sprite}.context, '${info.icon}', ${info.x}, ${info.y}`;
        if (has(info.w) && has(info.h)) body += `, ${info.w}, ${info.h}`;
        if ((!has(info.w) || !has(info.h)) && has(info.frame)) body += `, void 0, void 0`;
        if (has(info.frame)) body += `, ${info.frame}`;
        body += `);\n`;
    } else if (type === 'winskin') {
        const info = data as SpriteWinskin;
        body = `core.drawWindowSkin('${info.img}', ${sprite}.context, ${info.x}, ${info.y}, ${info.w}, ${info.h});\n`;
    } else if (type === 'text') {
        const info = data as SpriteText;
        const before = `${sprite}.context, '${info.str}', ${info.x}, ${info.y}, '${info.style}'`;
        const font = `${info.italic ? 'italic' : ''} ${info.fontWeight ?? ''} ${info.fontSize ? info.fontSize + 'px' : ''} ${info.font ?? ''}`;
        const after = `'${font.trim()}', ${info.maxWidth}`
        if (info.stroke) body = `core.fillBoldText(${before}, '${info.strokeStyle}', ${after});\n`;
        else body = `core.fillText(${before}, ${after});\n`;
    } else if (type === 'textContent') {
        const info = data as SpriteTextContent;
        let config = `{`;
        (['left', 'top', 'maxWidth', 'color', 'align', 'fontSize', 'lineHeight', 'time', 'font', 'letterSpacing', 'bold', 'italic'] as (keyof SpriteTextContent)[]).forEach(v => {
            if (v === 'color' || v === 'font') {
                if (has(info[v])) config += `
    ${v}: '${info[v]}',`;
            }
            else {
                if (has(info[v])) config += `
    ${v}: ${info[v]},`;
            }
        });
        config += `\n}`;
        body = `core.drawTextContent(${sprite}, \`${info.content}\`, ${config});\n`;
    } else if (type === 'opacity') {
        const info = data as SpriteOpacity;
        body = `core.setAlpha(${sprite}.context, ${info.opacity});\n`;
    }
    return { head, body };
}

/** 获得下一个函数的名称 */
function getNext(i: number) {
    const next = dataCache[i + 1];
    return `action_${next[0]}_${next.at(-1)}`;
}