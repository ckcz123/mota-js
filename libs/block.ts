/*
block.ts负责图块相关内容
*/
import { core } from './core';
import * as enemy from './enemy';
import * as utils from './utils';
import * as view from './view';
import * as autotile from './autotile';

type defaultUnit = {
    readonly id: string
    readonly number: number
    readonly type: 'default'
    [key: string]: any
}

export class Block {
    data: enemy.Enemy | autotile.Autotile | defaultUnit;
    x: number;
    y: number;
    graph: string;
    cls: string;

    constructor(unit: enemy.Enemy | autotile.Autotile | defaultUnit, x: number, y: number) {
        this.data = unit;
        this.x = x;
        this.y = y;
        this.graph = core.dict[unit.number].img;
        this.cls = core.dict[unit.number].cls;
    }

    /** 是否在视野范围内 */
    inView(view?: view.View): boolean {
        if (!view) view = core.status.views.main;
        let floor = core.status.thisMap;
        let dx = this.x * floor.unit_width - view.x - view.width * view.anchor.x;
        let dy = this.y * floor.unit_height - view.y - view.height * view.anchor.y;
        view.calPixel();
        return dx > -floor.unit_width && dy > -floor.unit_height && dx < view.width && dy < view.height;
    }
}