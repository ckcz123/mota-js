import { core } from './core';
import * as enemy from './enemy';
import * as utils from './utils';
import * as view from './view';
import * as autotile from './autotile';
import * as PIXI from 'pixi.js-legacy';

interface Returns {
    enemy: enemy.Enemy
}

export type cls = 'enemy' | 'autotile' | 'terrains' | 'tileset'

export interface defaultUnit {
    readonly id: string
    readonly number: number
    readonly type: string
    readonly x: number
    readonly y: number
    readonly floorId: string
    readonly cls?: string
    layer: number
    pass: boolean
    graph?: string
    block?: Block
    trigger: () => any
    destroy: () => any
    [key: string]: any
}

export class Block {
    readonly data: enemy.Enemy | autotile.Autotile | defaultUnit;
    readonly x: number;
    readonly y: number;
    readonly cls: cls
    readonly floorId: string;
    pass: boolean;
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
        this.pass = core.dict[unit.number].pass;
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
    trigger<K extends keyof Returns>(type?: K): Returns[K] {
        if (type && type !== this.cls) {
            throw new TypeError('触发器传入的类型与实际不同！传入的类型为：' + type + '；而实际的类型为：' + this.cls);
        }
        const trigger = triggers[type ?? this.cls];
        for (let name in trigger) {
            if (trigger[name] instanceof Function) trigger[name](this);
        }
        return this.data.trigger();
    }

    /** 
     * 销毁这个图块
     * @param root 是否要执行该图块的根图块的destroy函数
     */
    destroy(root: boolean = false): void {
        if (root) this.data.destroy();
        let floor = core.status.maps[this.floorId];
        floor.removeBlock(this.x, this.y, this.data.layer);
    }
}

/** 由默认图块类型生成block */
export function generateBlock(unit: defaultUnit, x: number = unit.x, y: number = unit.y): Block {
    const block = new Block(unit, x, y);
    return block;
}

/** 自定义的trigger */
const triggers = {
    enemy: {},
    terrains: {},
    autotile: {},
    tileset: {}
}

/** 添加自定义trigger
 * @param type 触发器种类
 * @param name 要添加的函数的唯一标识符，不同触发器种类间可以相同，同种触发器间不可相同
 * @param func 要执行的函数
 */
export function addTrigger(type: cls, name: string, func: (block: Block) => void): void {
    if (!(type in triggers)) throw new TypeError(`不存在触发器类型：${type}`);
    if (triggers[type][name] instanceof Function) console.warn('触发器已存在，已进行覆盖');
    triggers[type][name] = func;
}

/** 删除自定义trigger */
export function removeTrigger(type: cls, name: string): void {
    if (triggers[type][name] instanceof Function) delete triggers[type][name];
    else console.warn('不存在要删除的触发器');
}