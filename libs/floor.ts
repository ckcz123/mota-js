/*
floor.ts负责楼层相关内容
*/
import { core } from './core';

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
}