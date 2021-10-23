/*
floor.ts负责楼层相关内容
*/
import { core } from './core';
import * as block from './block';
import * as view from './view';

export class Floor {
    floorId: string;
    map: number[][];
    bg: number[][];
    fg: number[][];
    block: {
        event: { [key: string]: block.Block };
        fg: { [key: string]: block.Block };
        bg: { [key: string]: block.Block };
    }

    constructor(floorId: string, area?: string) {
        this.floorId = floorId;
        let floor = core.floors[floorId];
        for (let one in floor) this[one] = floor[one];
        core.status.maps[floorId] = core.status.thisMap = this;
        if (area) {
            if (!core.status.areas[area]) core.status.areas[area].floorIds = [];
            let areas = core.status.areas[area];
            if (!areas.floorIds.includes(floorId)) areas.floorIds.push(floorId);
        }
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
        this.block[layer] = {};
        // 进行解析
        let h = map.length;
        let w = map[0].length;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (map[y][x] !== -2) continue;
                let num = map[y][x];
                let cls = core.dict[num].cls;
                let id = core.dict[num].id
                if (cls === 'enemy') this.extractEnemy(id, layer, x, y);
                if (this.block[layer][x + ',' + y]) map[y][x] = -2;
            }
        }
        return this;
    }

    /** 解析某个怪物 */
    extractEnemy(id: string, layer: string, x: number, y: number): Floor {
        let e = new block.Block(core.units.enemy[id], x, y);
        this.block[layer][x + ',' + y] = e;
        return this;
    }

    /** 绘制地图 */
    draw(view?: view.View): Floor {
        return this;
    }
}