/*
block.ts负责图块相关内容
*/
import { core } from './core';
import * as enemy from './enemy';
import * as utils from './utils'

export class Block {
    data: enemy.Enemy;
    x: number;
    y: number;
    graph: string;

    constructor(unit: enemy.Enemy, x: number, y: number) {
        if (unit instanceof enemy.Enemy) {
            // 图块是怪物
            this.data = utils.clone(unit);
            this.x = x;
            this.y = y;
            this.graph = core.dict[this.data.number].img;
        }
    }

    /** 解析graph */
    extractGraph(): Block {
        let x = /@x[0-9]+@/.exec(this.graph)[0];
        let y = /@y[0-9]+./.exec(this.graph)[0];
        // 由字符串解析出每一帧的位置
        if (x.length !== y.length && x.length !== 4 && y.length !== 4) console.error('图片索引格式不正确！');

        return this;
    }
}