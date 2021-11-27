/*
enemy.ts负责怪物相关内容
*/

import { core } from "./core";
import * as enemy from '../project/functions/enemy';
import { Hero } from "./hero";

type Status = {
    readonly id: string,
    readonly number: number,
    hp: number,
    atk: number,
    def: number,
    special: number[],
    vertical: boolean,
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
    readonly type: 'enemy' = 'enemy';
    [key: string]: any;

    constructor(status: Status) {
        for (let one in status) {
            this[one] = status[one];
        }
    }

    /** 获得该怪物的伤害信息 */
    getDamage(hero: string | Hero): any {
        return enemy.getDamage(this.floor, hero, this.x, this.y, {});
    }
}