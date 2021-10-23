/*
maps.ts负责所有的地图操作
包括初始化、绘制、视角移动等
*/
import { core } from './core';
import { enemies } from '../project/enemies';
import * as floor from './floor';

class Maps {
    constructor() {

    }

    /** 初始化所有单位 */
    initUnits(): void {
        core.units = {
            enemy: enemies
        };
    }

    /** 切换楼层 */
    changeFloor(floorId: string, x: number, y: number): void {
        let f = new floor.Floor(floorId, 'test');
        f.draw();
    }
}

let maps = new Maps();
export { maps }