/*
floor.ts负责楼层相关内容
*/
import { core } from './core';
import * as enemy from './enemy';

export class Floor {
    floorId: string;
    map: number[][];
    bg: number[][];
    fg: number[][];
    constructor(floorId: string) {
        this.floorId = floorId;
        let floor = core.floors[floorId];
        for (let one in floor) this[one] = floor[one];
        core.status.thisMap = this;
    }

    /** 解析楼层 */
    extract(layer?: string): Floor {
        if (!layer) {
            ['fg', 'bg', 'event'].forEach(one => { this.extract(one); });
            return this;
        }
        let map: number[][];
        if (layer === 'event') map = this.map;
        else if (layer === 'fg') map = this.fg;
        else if (layer === 'bg') map = this.bg;
        // 进行解析
        for (let y in map) {
            for (let x in map) {
                if (map[y][x] !== -2) continue;
                let num = map[y][x];
                let cls = core.dict[num].cls;
            }
        }
        return this;
    }

    /** 解析某个怪物 */
    extractEnemy(id: string, x: number, y: number): enemy.Enemy {
        let e = new enemy.Enemy(core.units.enemy[id]);
        e.x = x;
        e.y = y;
        return e;
    }
}