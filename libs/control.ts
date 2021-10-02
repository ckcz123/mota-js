/*
control.ts负责游戏内的部分逻辑
*/

import * as PIXI from 'pixi.js-legacy';
import { core } from './core';
import * as init from '../project/functions/init';

class Control {
    constructor() {

    }

    /** 初始化游戏界面 */
    initGame(): void {
        // 绘制初始界面
        init.drawStartUi();
    }
}

let control = new Control();
export { control }