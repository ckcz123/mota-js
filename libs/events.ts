/*
events.ts负责游戏内的事件
*/

import { ui } from './ui';
import { maps } from './maps';

export class Event {
    constructor(...event: Function[]) {

    }
}

export function startGame() {
    ui.destoryContainer('start');
    ui.createContainer('map');
    maps.changeFloor('sample0', 0, 0);
}