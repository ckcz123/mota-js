/*
listen.ts负责监听玩家交互
*/

import { core } from './core';
import * as PIXI from 'pixi.js-legacy';

class Listen {
    constructor() {

    }

    /** 向PIXI元素添加event */
    addEventToPIXI(ele: PIXI.DisplayObject, event: string, func: Function): void {

    }
}

let listen = new Listen();
export { listen, Listen };