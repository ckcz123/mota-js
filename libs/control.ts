/*
control.ts负责游戏内的部分逻辑
*/

import * as PIXI from 'pixi.js-legacy';

let core = window.core;
class Control {
    constructor() {

    }

    /** 初始化游戏界面 */
    initGame(): void {
        let gameDraw = core.pixi.gameDraw;
    }
}

let control = new Control();
export { control, Control }