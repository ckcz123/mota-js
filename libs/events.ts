/*
events.ts负责游戏内的事件
*/

import { ui } from './ui';

export class Event {
    constructor(...event: Function[]) {

    }
}

export function startGame() {
    ui.destoryContainer('start');
}