/*
animate.ts负责动画相关内容
*/
import { Block } from './block';
import { core } from './core';
import * as PIXI from 'pixi.js-legacy';

let animations: { [key: string]: { func: (dt?: number) => void, onStart: boolean } } = {};
/** 在视野范围内的动画 */
export let inViewAnimations: number[] = [];

export class Animate {
    node: string;
    cls: string;
    data: {
        now: number
        img: string
        [key: number]: PIXI.Rectangle
    }
    texture: PIXI.Texture

    constructor(node: string, cls: string) {
        this.node = node;
        this.cls = cls;
        this.generateTexture();
    }

    /** 解析动画 */
    extractGraph(): Animate {
        let s = this.node.split('.');
        let img = s[0] + '.' + s[s.length - 1];
        // 获取xy位置及图片的宽高数
        let x = /@x[0-9]+@/.exec(this.node)[0].match(/[0-9]+/)[0];
        let y = /@y[0-9]+./.exec(this.node)[0].match(/[0-9]+/)[0];
        let aspect = /.[0-9]+x[0-9]+@/.exec(this.node)[0].match(/[0-9]+/g);
        // 计算每一格的长宽
        let im = core.material[this.cls][img];
        let w = ~~(im.width / parseInt(aspect[0]));
        let h = ~~(im.height / parseInt(aspect[1]));
        // 由字符串解析出每一帧的位置
        if (x.length !== y.length && x.length !== 1 && y.length !== 1) console.error('图片索引格式不正确！');
        let tar = x.length > y.length ? x.length : y.length;
        this.data = { img: img, now: 0 };
        for (let i = 0; i < tar; i++) {
            // 横向位置 纵向位置
            let xx = (parseInt(x[i] ? x[i] : x[0]) - 1) * w;
            let yy = (parseInt(y[i] ? y[i] : y[0]) - 1) * h;
            let rect = new PIXI.Rectangle(xx, yy, w, h);
            this.data[i] = rect;
        }
        return this;
    }

    /** 生成texture */
    generateTexture(): Animate {
        this.extractGraph();
        if (!this.texture) {
            let texture = PIXI.Texture.from(core.material[this.cls][this.data.img]);
            this.texture = texture;
            return this;
        }
        return this;
    }

    /** 执行下一帧动画 */
    next(): Animate {
        let next = this.data.now + 1;
        if (!this.data[next]) next = 0;
        this.data.now = next;
        this.texture.frame = this.data[next];
        return this;
    }
}

/** 解析所有动画 */
export function extractAll(): void {
    let all = core.dict;
    for (let id in all) {
        let one = all[id];
        if (one.cls === 'autotile') continue;
        one.animate = new Animate(one.img, one.cls);
    }
}

/** 初始化全局帧动画 */
export function initAnimate(): void {
    extractAll();
    registerTicker('blockAnimate', blockAnimate);
    core.pixi.game.ticker.add(dt => {
        core.timestamp += 16.6;
        for (let one in animations) {
            animations[one].func(dt);
        }
    });
}

/** 注册一个全局帧动画
 * @param name 动画的名称
 * @param func 动画每帧执行的函数，包含dt参数，dt表示帧之间的延迟分量
 * @param onStart 是否在开始游戏后再执行
 */
export function registerTicker(name: string, func: (dt?: number) => void, onStart?: boolean): void {
    animations[name] = { onStart, func };
}

/** 注销一个全局帧动画 */
export function unregisterTicker(name: string): void {
    delete animations[name];
}

/** 计算在视野内的所有animate */
export function calInView() {
    inViewAnimations = [];
    let view = core.status.nowView;
    let added = {};
    let floor = core.status.thisMap;
    const ax = view.anchor.x * view.width;
    const ay = view.anchor.y * view.height;
    const leftX = Math.max(0, Math.floor((view.x - ax) / floor.unit_width) - 2);
    const topY = Math.max(0, Math.floor((view.y - ay) / floor.unit_height) - 2);
    const rightX = Math.min(floor.width, Math.floor((view.x - ax + view.width) / floor.unit_width) + 2);
    const bottomY = Math.min(floor.height, Math.floor((view.y - ay + view.height) / floor.unit_height) + 2);
    // 开始搜索
    Object.keys(floor.block).forEach((layer) => {
        let block: { [key: string]: Block } = floor.block[layer];
        for (let x = leftX; x <= rightX; x++) {
            for (let y = topY; y <= bottomY; y++) {
                let loc = x + ',' + y;
                let one = block[loc];
                if (!one) continue;
                let n = one.data.number;
                if (added[n]) continue;
                added[n] = true;
                inViewAnimations.push(n);
            }
        }
    });
}

// ----------- 全局图块动画相关内容
/** 所有图块的全局动画 */
function blockAnimate(): void {
    if (core.timestamp - core.timeCycle <= 400) return;
    core.timeCycle = core.timestamp;
    if (!core.status.thisMap) return;
    inViewAnimations.forEach(one => {
        let animate = core.dict[one].animate;
        if (!animate) return;
        animate.next();
    })
}