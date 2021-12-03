/*
ui.ts负责部分ui的绘制
*/
import * as PIXI from 'pixi.js-legacy';
import { core } from './core';

/** 获取某个container */
export function getContainer(name: string | PIXI.Sprite | PIXI.Container): PIXI.Container {
    if (name instanceof PIXI.Sprite) return name.parent;
    if (name instanceof PIXI.Container) return name;
    return core.containers[name] || null;
}

/** 获取某个sprite */
export function getSprite(name: string | PIXI.Sprite): PIXI.Sprite {
    if (name instanceof PIXI.Sprite) return name;
    return core.sprite[name] || null;
}

/** 
 * 创建一个sprite，注：游戏画面横向宽度永远是1000，纵向宽度为1000/横纵比
 * @param name 创建的精灵的id
 * @param x 精灵左上角相对画面左上角的横坐标
 * @param y 精灵左上角相对画面左上角的纵坐标
 * @param w 精灵的宽度
 * @param h 精灵的高度
 * @param z 精灵的z值，z值大的会覆盖z值小的
 * @returns 返回该精灵的实例
 */
export function createSprite(name: string, x: number, y: number, w: number, h: number, z: number): PIXI.Sprite {
    let sprite = new PIXI.Sprite();
    sprite.x = x;
    sprite.y = y;
    sprite.width = w;
    sprite.height = h;
    sprite.zIndex = z;
    let container = getContainer('dymContainer')
    container.addChild(sprite);
    core.containers.dymContainer[name] = sprite;
    return sprite;
}

/** 删除某个sprite */
export function destroySprite(name: string | PIXI.Sprite): void {
    let s = getSprite(name);
    if (!s) return;
    s.destroy();
    if (typeof name === 'string') delete core.sprite[name];
}

/** 删除某个container */
export function destoryContainer(name: string | PIXI.Container): void {
    let c = getContainer(name);
    if (!c) return;
    c.destroy();
    if (typeof name === 'string') delete core.containers[name];
}

/** 重定位某个sprite */
export function relocateSprite(name: string | PIXI.Sprite, x: number, y: number): PIXI.Sprite {
    let sprite = getSprite(name);
    sprite.x = x;
    sprite.y = y;
    return sprite;
}

/** 
 * 修改某个sprite的大小，目标为相对于背景图长宽的比例缩放
 * @param w 如果小于1且不为0，视为比例缩放，否则为像素缩放
 * @param h 如果小于1且不为0，视为比例缩放，否则为像素缩放
 */
export function resizeSprite(name: string | PIXI.Sprite, w?: number, h?: number): PIXI.Sprite {
    let sprite = getSprite(name);
    if (!sprite) return;
    if (w) {
        if (w <= 1) sprite.scale.x = w;
        else sprite.width = w;
    }
    if (h) {
        if (h <= 1) sprite.scale.y = h;
        else sprite.height = h;
    }
    return sprite;
}

/** 更改sprite的背景图片 */
export function changeImageOnSprite(sprite: string | PIXI.Sprite, name: string): void {
    let s = getSprite(sprite);
    if (!sprite) return;
    let texture = PIXI.utils.TextureCache[name];
    if (!texture) {
        texture = PIXI.Texture.from(core.material.images[name]);
        PIXI.Texture.addToCache(texture, name);
    }
    s.texture = texture;
    resizeSpriteChildren(s);
}

/** resize某个sprite的子元素，防止子元素位置偏差 */
export function resizeSpriteChildren(sprite: string | PIXI.Sprite): void {
    let s = getSprite(sprite);
    let texture = s.texture;
    if (!texture) return;
    s.children.forEach(child => {
        child.position.x *= texture.width / 1000;
        child.position.y *= texture.height / 1000;
    })
}

/** 
 * 创建一个container
 * @param name 容器的名称
 * @param x 容器的左上角横坐标
 * @param y 容器的左上角纵坐标
 * @param z 容器的z值
 */
export function createContainer(name: string, x: number = 0, y: number = 0, z?: number): PIXI.Container {
    let container = new PIXI.Container();
    container.x = x;
    container.y = y;
    if (z) container.zIndex = z;
    core.pixi.game.stage.addChild(container);
    core.containers[name] = container;
    container.sortableChildren = true;
    return container;
}

/** 
 * 在某个container上绘制图片
 * @param container 容器名或容器的实例，只有当该参数为字符串时，才会将引用存进core.containers，才能通过引用
 * 删除该图片，否则只能通过删除容器来删除图片
 * @param self 是否使用独立名称，使用后不能同时绘制多个名称相同的独立图片，但删除时效率更高
 */
export function drawImageOnContainer(container: string | PIXI.Container, image: string, self: boolean = false,
    x: number = 0, y: number = 0, w?: number, h?: number, z?: number): void {
    let c = getContainer(container);
    if (!c) return;
    let id: string;
    if (!self) {
        if (typeof container === 'string') {
            while (true) {
                id = image + '_' + ~~(Math.random() * 1e8);
                if (!core.containers[container][id]) break;
            }
        }
    } else id = image;
    let texture = PIXI.utils.TextureCache[image];
    if (!texture) {
        texture = PIXI.Texture.from(core.material.images[image]);
        PIXI.Texture.addToCache(texture, image);
    }
    let sprite = new PIXI.Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    if (z) sprite.zIndex = z;
    if (w) sprite.width = w;
    if (h) sprite.height = h;
    c.addChild(sprite);
    if (container instanceof PIXI.Container) return;
    core.sprite[id] = sprite;
}

/**
 * 删除某个由drawImageOnContainer绘制的图片，会删除所有名称相同的图片
 * @example ui.destroyImage('container', 'bg.jpg'); // 删除container上的bg.jpg图像或container上所有bg.jpg图像
 */
export function destroyImage(container: string, image: string): void {
    let c = core.containers[container];
    if (c[image]) {
        c[image].destroy();
        delete c[image];
        return;
    }
    for (let name in c) {
        if (name.startsWith(image)) {
            c[name].destroy();
            delete c[name];
        }
    }
}

/**
 * 创建一个能在sprite或container上绘制的文本
 * @param text 文本，可以是一个包含多个文本的数组
 * @param style 绘制内容的样式，为对象形式，属性包括fill（填充颜色） stroke（边框颜色） fontFamily（字体）等，
 * 更多内容请查看https://aitrade.ga/pixi.js-cn/PIXI.TextStyle.html
 * @returns 如果文本只有一个，则返回创建好的文本，如果有多个，则返回文本数组
 */
export function createText(text: string, x?: number, y?: number, z?: number, style?: Partial<PIXI.ITextStyle>): PIXI.Text
export function createText(text: string[], x?: number, y?: number, z?: number, style?: Partial<PIXI.ITextStyle>): PIXI.Text[]
export function createText(text: string | string[], x: number = 0, y: number = 0, z?: number, style?: Partial<PIXI.ITextStyle>): PIXI.Text | PIXI.Text[] {
    if (!(text instanceof Array)) text = [text];
    let texts = [];
    text.forEach(text => {
        let t = new PIXI.Text(text, style);
        t.position.set(x, y);
        if (style.align === 'center' && !style.wordWrap) t.anchor.set(0.5, 0.5);
        texts.push(t);
        t.zIndex = z || 0;
    })
    return texts.length === 1 ? texts[0] : texts;
}

/** 向某个sprite或container上绘制内容 */
export function drawContent(target: string | PIXI.Sprite | PIXI.Container, ...content: PIXI.DisplayObject[]): void {
    let tar: PIXI.Sprite | PIXI.Container;
    if (typeof target === 'string') {
        tar = getSprite(target);
        if (!tar) tar = getContainer(target);
    } else tar = target;
    if (!tar) return;
    content.forEach(one => {
        if (one instanceof Array) return one.forEach(one => tar.addChild(one));
        tar.addChild(one);
    });
}

/** 创建一个图形 */
export function createGraphics(z: number): PIXI.Graphics {
    let graphics = new PIXI.Graphics();
    graphics.zIndex = z;
    return graphics;
}

/** 
 * 在某个图形上绘制一个矩形
 * @param option 配置参数，可以设置图形的边框宽度、颜色、不透明度及填充的颜色、不透明度
 */
export function drawRectOnGraphics(graphics: PIXI.Graphics, x: number = 0, y: number = 0, w: number = 100, h: number = 100,
    option: {
        strokeWidth: number, strokeStyle: number, strokeAlpha: number, fillStyle: number, fillAlpha: number
    }): PIXI.Graphics {
    graphics.lineStyle(option.strokeWidth, option.strokeStyle, option.strokeAlpha);
    graphics.beginFill(option.fillStyle, option.fillAlpha);
    graphics.drawRect(x, y, w, h);
    graphics.endFill();
    return graphics;
}