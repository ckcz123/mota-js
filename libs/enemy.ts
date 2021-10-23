/*
enemy.ts负责怪物相关内容
*/

import { core } from "./core";

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
    [key: string]: any;

    constructor(status: Status) {
        for (let one in status) {
            this[one] = status[one];
        }
    }
}