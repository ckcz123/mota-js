import { BaseAction } from "./action";
import { actionAttributes, sprites } from "./info";


function wait(action: BaseAction<any>, time: number){
    // #
}

function transition(style:string, time:string, mode:string, delay:string){
    // #
}

function create(name:string, x:number, y:number, w:number, h:number, z:number){
    core.createCanvas(name, x, y, w, h, z);
}

function del(name:string){
    core.deleteCanvas(name);
}

function move(sprite:Sprite, x:number, y:number, isDelta:boolean){
    sprite.move(x, y, isDelta);
}

function resize(sprite:Sprite, w:number, h:number, styleOnly: boolean){
    sprite.resize(w, h, styleOnly);
}

function rotate(sprite:Sprite, cx:number, cy:number, angle:number){
    let ctx = sprite.context;
    ctx.translate(cx, cy);
    ctx.rotate(angle * Math.PI / 180);
}

function clear(sprite:Sprite, x:number, y:number, w:number, h:number){
    let ctx = sprite.context;
    ctx.clearRect(x, y, w, h);
}

function css(sprite:Sprite, data: string){
    sprite.setCss(data);
}

function composite(sprite:Sprite, mode: GlobalCompositeOperation){
    let ctx = sprite.context;
    ctx.globalCompositeOperation = mode;
}

function filter(sprite:Sprite, data: string){
    core.setFilter(sprite.context, data);
}

function shadow(sprite:Sprite, shadowBlur:number, shadowColor:string, shadowOffsetX:number, shadowOffsetY:number){
    let ctx = sprite.context;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
}

function textInfo(sprite:Sprite, direction:CanvasDirection, textAlign:CanvasTextAlign, textBaseline:CanvasTextBaseline){
    let ctx = sprite.context;
    ctx.direction = direction;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
}

function save(sprite:Sprite){
    core.saveCanvas(sprite.context);
}

function restore(sprite:Sprite){
// #
}

function line(sprite:Sprite, x1:number, y1:number, x2:number, y2:number, lineWidth:number, style:string){
    core.drawLine(sprite.context, x1, y1, x2, y2, style, lineWidth);
}

function arc(sprite:Sprite, x:number, y:number, r:number, start:number, end:number, stroke:boolean, lineWidth:number, style:string){
    if (stroke) core.strokeArc(sprite.context, x, y, r, start, end, style, lineWidth);
    else core.fillArc(sprite.context, x, y, r, start, end, style);
}

function circle(sprite:Sprite, x:number, y:number, r:number, stroke:boolean, lineWidth:number, style:string){
    if (stroke) core.strokeCircle(sprite.context, x, y, r, style, lineWidth);
    else core.fillCircle(sprite.context, x, y, r, style)
}

function rect(sprite:Sprite, x:number, y:number, w:number, h:number, stroke:boolean, lineWidth:number, style:string){
    if (stroke) core.strokeRect(sprite.context, x, y, w, h, style);
    else core.fillRect(sprite.context, x, y, w, h, style);
    //lineWidth没用上？
}

function roundRect(sprite:Sprite, x:number, y:number, w:number, h:number, r:number, stroke:boolean, lineWidth:number, style:string){
    if (stroke) core.strokeRoundRect(sprite.context, x, y, w, h, r, style, lineWidth);
    else core.fillRoundRect(sprite.context, x, y, w, h, r, style);
}

function polygon(sprite:Sprite, path:Array<[number, number]>, stroke:boolean, lineWidth:number, style:string){
    if (stroke) core.strokePolygon(sprite.context, path, style, lineWidth);
    else core.fillPolygon(sprite.context, path, style);
}

function ellipse(sprite:Sprite, x:number, y:number, a:number, b:number, stroke:boolean, lineWidth:number, style:string){
    if (stroke) core.strokeEllipse(sprite.context, x, y, a, b, undefined, style, lineWidth);
    else core.fillEllipse(sprite.context, x, y, a, b, undefined, style);
}

function arrow(sprite:Sprite, x1:number, y1:number, x2:number, y2:number, lineWidth:number, style:string){
    core.drawArrow(sprite.context, x1, y1, x2, y2, style, lineWidth);
}

function bezierCurve(sprite:Sprite, cp1x:number, cp1y:number, cp2x:number, cp2y:number, sx:number, sy:number, x:number, y:number, lineWidth:number, style:string){
    let ctx = sprite.context;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = style;
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.stroke();
}

function image(sprite:Sprite, img:string, sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number, dh:number){
    core.drawImage(sprite.context, img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function icon(sprite:Sprite, icon:string, x:number, y:number, frame:number){
    core.drawIcon(sprite.context, icon, x, y, undefined, undefined, frame);
}

function winskin(sprite:Sprite, img:string, x:number, y:number, w:number, h:number){
    core.drawWindowSkin(undefined, sprite.context, x, y, w.toString(), h.toString());
}

function text(sprite:Sprite, str:string, stroke:boolean, italic:boolean, font:string, fontSize:number, fontWeight:string, style:string, strokeStyle: string, lineWidth:number){
    // #
}

function textContent(sprite:Sprite, content:string, x:number, y:number, width:number, color:string, align:'left' | 'center' | 'right', 
    fontSize:number, lineHeight:number, time:number, font:string, letterSpacing:number, bold:boolean, italic:boolean){
    core.drawTextContent(sprite.context, content, {
        left: x,
        top: y,
        maxWidth: width,
        // color: number
        align: align,
        fontSize: fontSize,
        lineHeight: lineHeight,
        time: time,
        font: font,
        letterSpacing: letterSpacing,
        bold: bold,
        italic: italic
    })

}
