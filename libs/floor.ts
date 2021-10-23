/*
floor.ts负责楼层相关内容
*/
import { core } from './core';
import * as block from './block';
import * as view from './view';
import * as PIXI from 'pixi.js-legacy';

export class Floor {
    floorId: string;
    map: number[][];
    bg: number[][];
    fg: number[][];
    width: number;
    height: number;
    unit_width: number;
    unit_height: number;
    block: {
        event: { [key: string]: block.Block };
        fg: { [key: string]: block.Block };
        bg: { [key: string]: block.Block };
    }

    constructor(floorId: string, area?: string) {
        this.floorId = floorId;
        let floor = core.floors[floorId];
        for (let one in floor) this[one] = floor[one];
        this.width = this.map[0].length;
        this.height = this.map.length;
        this.unit_width = core.__UNIT_WIDTH__;
        this.unit_height = core.__UNIT_HEIGHT__;
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
        if (!view) view = core.status.nowView;
        // 如果是main视角，重定位至以勇士为中心的位置
        if (view.id === 'main') view.center();
        let main = core.containers.map;
        main.x = -view.width;
        main.y = -view.height;
        this.extract().drawBg();
        return this;
    }

    /** 绘制背景层 */
    drawBg(): Floor {
        let bg = new PIXI.Container();
        bg.zIndex = 20;
        core.containers.bg = bg;
        core.containers.map.addChild(bg);
        this.drawContent('bg', bg);
        return this;
    }

    /** 把地图绘制到目标container上 */
    drawContent(layer: 'bg' | 'fg' | 'event', container: PIXI.Container): Floor {
        let map: number[][] = this[layer];
        let h: number = map.length;
        let w: number = map[0].length;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let n = map[y][x];
                if (n === -2) {
                    // 单独处理项
                    let block = this.block[layer][x + ',' + y];

                }
            }
        }
        return this;
    }
}