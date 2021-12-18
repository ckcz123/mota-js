/*
block.ts负责图块相关内容
*/
import { core } from './core';
import * as enemy from './enemy';
import * as utils from './utils';
import * as view from './view';
import * as autotile from './autotile';
import * as PIXI from 'pixi.js-legacy';

interface Returns {
    enemy: enemy.Enemy
}

type defaultUnit = {
    readonly id: string
    readonly number: number
    readonly type: 'default'
    readonly x: number
    readonly y: number
    readonly floorId: string
    readonly cls?: string
    graph?: string
    block?: Block
    trigger?: () => any
    destroy?: () => any
    [key: string]: any
}

export class Block {
    readonly data: enemy.Enemy | autotile.Autotile | defaultUnit;
    readonly x: number;
    readonly y: number;
    readonly cls: string;
    readonly floorId: string;
    noPass: boolean;
    graph: string;
    sprite: PIXI.Sprite;

    constructor(unit: enemy.Enemy | autotile.Autotile | defaultUnit, x: number, y: number) {
        this.data = unit;
        this.x = x;
        this.y = y;
        this.graph = core.dict[unit.number].img;
        this.cls = core.dict[unit.number].cls;
        this.data.block = this;
        this.floorId = unit.floorId;
        this.noPass = true;
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

    /** 
     * 执行相应的触发器
     * @param type 触发器的种类，可选，填入后会有相应的类型标注，如果实际触发时和传入的type不同，则会报错
     */
    trigger<K extends keyof Returns>(type?: K): Returns[K] | void {
        if (type && type !== this.cls) return console.error('传入的类型与实际不同！传入的类型为：' + type + '；而实际的类型为：' + this.cls);
        return this.data.trigger();
    }

    /** 
     * 销毁这个图块
     * @param root 是否要执行该图块的根图块的destroy函数
     */
    destroy(root: boolean = false): void {
        if (root) this.data.destroy();
        let floor = core.status.maps[this.floorId];
        console.log(this.floorId, floor);

        floor.removeBlock(this.x, this.y, this.data.layer || 'event');
    }
}