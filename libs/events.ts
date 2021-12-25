/*
events.ts负责游戏内的事件
*/

import * as ui from './ui';
import * as maps from './maps';
import * as listen from '../project/functions/listen';
import { core } from './core';
import { Floor } from './floor';

interface EventAction<T extends keyof EventType> {
    type: T
    data: EventType[T]
}

interface EventType {
    x: any
}

export class Event {
    data: EventAction<any>[];

    constructor() {
        this.data = [];
    }

    /** 添加事件内容 */
    add<K extends keyof EventType>(data: EventAction<K>): Event {
        return this;
    }

    /** 移除特定索引的事件内容 */
    remove(index: number): Event {
        this.data.splice(index, 1);
        return this;
    }

    /** 
     * 执行事件，事件的执行为异步过程，而返回值为同步过程
     * @param x 将该事件在该坐标下执行
     * @param y 将该事件在该坐标下执行
     * @param floor 将该事件在该楼层中执行
     */
    execute(x?: number, y?: number, floor?: string | Floor): Event {
        return this;
    }

    private async start(): Promise<any> {

    }

    private async next(): Promise<any> {

    }
}

/** 开始游戏 */
export function startGame() {
    ui.destoryContainer('start');
    ui.createContainer('map');
    core.containers.map.sortableChildren = true;
    maps.changeFloor('sample0', 0, 0);
    listen.addHeroListener();
    core.status.views.main.follow('hero');
}