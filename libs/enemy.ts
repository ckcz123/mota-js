/*
enemy.ts负责怪物相关内容
*/

export class Enemy {
    constructor(status: {
        readonly id: string, readonly number: number, hp: number, atk: number,
        def: number, special: number[], vertical: boolean, [key: string]: any
    }) {
        let enemy = status;
        return enemy;
    }
}