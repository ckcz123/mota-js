/*
events.ts负责游戏内的事件
*/

import * as ui from './ui';
import * as maps from './maps';
import * as listen from '../project/functions/listen';
import { core } from './core';

export class Event {
    constructor(...event: Function[]) {

    }
}

export function startGame() {
    ui.destoryContainer('start');
    ui.createContainer('map');
    core.containers.map.sortableChildren = true;
    maps.changeFloor('sample0', 0, 0);
    listen.addHeroListener();
    core.status.views.main.follow('hero');
}