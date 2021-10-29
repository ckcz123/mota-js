/*
animate.ts负责动画相关内容
*/
import { Block } from './block';
import { core } from './core';
import * as PIXI from 'pixi.js-legacy';

let animations: { [key: string]: { func: (dt?: number) => void, onStart: boolean } } = {};

/** 初始化全局帧动画 */
export function initAnimate(): void {
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

// ----------- 全局图块动画相关内容
/** 所有图块的全局动画 */
export function blockAnimate(): void {
    if (core.timestamp - core.timeCycle <= 400) return;
    core.timeCycle = core.timestamp;
    if (!core.status.thisMap) return;
    let floor = core.status.thisMap;
    for (let layer in floor.block) {
        let block: { [key: string]: Block } = floor.block[layer];
        for (let loc in block) {
            let one = block[loc];
            if (!one.inView()) continue;
            if (one.node) {
                let to = one.node[one.node.now + 1] ? one.node.now + 1 : 0;
                let next = one.node[to];
                one.node.now = to;
                PIXI.utils.TextureCache[one.graph].frame = next;
            }
        }
    }
}