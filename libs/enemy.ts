/*
enemy.ts负责怪物相关内容
*/

import * as enemy from '../project/functions/enemy';
import { Hero } from "./hero";

export type Status = {
    readonly id: string,
    readonly number: number,
    hp: number,
    atk: number,
    def: number,
    special: number[],
    vertical?: boolean,
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
    damage: enemy.Damage;
    readonly type: 'enemy' = 'enemy';
    [key: string]: any;

    constructor(status: Status, x: number, y: number) {
        for (let one in status) {
            this[one] = status[one];
        }
        if (!status.useLoop) this.useLoop = false;
        this.x = x;
        this.y = y;
    }

    /** 获得该怪物的伤害信息 */
    getDamage(hero: string | Hero): any {
        return enemy.getDamage(this.floor, hero, this.x, this.y, {});
    }
}