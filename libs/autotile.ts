/*
autotile.ts负责autotile相关内容
*/

import { core } from './core';
import * as utils from './utils';

export class Autotile {
    x: number;
    y: number;
    floorId: string;
    layer: 'bg' | 'fg' | 'event';
    readonly number: number;
    readonly id: string;
    node: string;
    data: {
        now: number
        img: string
        total: number
        dir: {
            left: boolean
            up: boolean
            down: boolean
            right: boolean
            leftup: boolean
            leftdown: boolean
            rightup: boolean
            rightdown: boolean
        }
    }

    constructor(number: number, x: number, y: number, layer: 'bg' | 'fg' | 'event', floor: string) {
        let tile = core.dict[number];
        if (tile.cls !== 'autotile') return;
        this.node = tile.img;
        this.number = number;
        this.id = tile.id;
        this.x = x;
        this.y = y;
        this.floorId = floor;
        this.layer = layer;
    }

    /** 解析方向 */
    extractDir(): Autotile {
        let map = core.status.maps[this.floorId][this.layer === 'event' ? 'map' : this.layer];
        for (let dir in utils.dirs) {
            let x = this.x + utils.dirs[dir][0];
            let y = this.y + utils.dirs[dir][1];
            let n = map[y][x];
            if (n === -2) {
                let block = core.status.maps[this.floorId].block[this.layer][x + ',' + y];
                if (block.data.number === this.number) {
                    this.data.dir[dir] = true;
                }
            }
        }
        return this;
    }

    /** 解析图块内容，获取要绘制哪四个16*16的格子 */
    extract(): Autotile {
        this.extractDir();
        // 通过方向来获得二进制索引
        let dir = 0b00000000;
        let now = this.data.dir;
        if (now.rightup) dir += 0b1;
        if (now.right) dir += 0b10;
        if (now.rightdown) dir += 0b100;
        if (now.down) dir += 0b1000;
        if (now.leftdown) dir += 0b10000;
        if (now.left) dir += 0b100000;
        if (now.leftup) dir += 0b1000000;
        if (now.up) dir += 0b10000000;
        return this;
    }
}