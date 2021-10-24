/*
animate.ts负责动画相关内容
*/
import { Block } from './block';
import { core } from './core';
import * as PIXI from 'pixi.js-legacy';

// ----------- 全局图块动画相关内容
/** 初始化全局帧动画 */
export function initAnimate(): void {
    core.pixi.game.ticker.add(dt => {
        core.timestamp += 16.6;
        blockAnimate();
    });
}

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