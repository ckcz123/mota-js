/*
enemy.ts负责怪物相关内容
*/

import { core } from "./core";
import * as enemy from '../project/functions/enemy';
import { Hero } from "./hero";
import * as utils from './utils';

type Status = {
    readonly id: string,
    readonly number: number,
    hp: number,
    atk: number,
    def: number,
    special: number[],
    vertical: boolean,
    useLoop?: boolean;
    [key: string]: any
}

export class Enemy {
    readonly id: string;
    readonly number: number;
    hp: number;
    atk: number;
    def: number;
    special: number[];
    vertical: boolean;
    x: number;
    y: number;
    graph: string;
    useLoop: boolean;
    readonly type: 'enemy' = 'enemy';
    [key: string]: any;

    constructor(status: Status | Enemy) {
        if (status instanceof Enemy) status = utils.clone(status, (index, data) => !(data instanceof Function));
        for (let one in status) {
            this[one] = status[one];
        }
        if (!status.useLoop) this.useLoop = false;
    }

    /** 获得该怪物的伤害信息 */
    getDamage(hero: string | Hero): any {
        return enemy.getDamage(this.floor, hero, this.x, this.y, {});
    }
}