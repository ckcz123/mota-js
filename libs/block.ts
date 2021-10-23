/*
block.ts负责图块相关内容
*/
import * as enemy from './enemy';

export class Block {
    enemy: enemy.Enemy;
    x: number;
    y: number;

    constructor(unit: enemy.Enemy, x: number, y: number) {
        if (unit instanceof enemy.Enemy) {
            // 图块是怪物
            this.enemy = unit;
            this.x = x;
            this.y = y;
        }
    }
}