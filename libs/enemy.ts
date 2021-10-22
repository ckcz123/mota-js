/*
enemy.ts负责怪物相关内容
*/
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
    [key: string]: any;
    constructor(status: Status | Enemy) {
        for (let one in status) {
            if (!(status[one] instanceof Function)) this[one] = status[one];
        }
    }
}