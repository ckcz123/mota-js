/*
maps.ts负责所有的地图操作
包括初始化、绘制、视角移动等
*/
import { core } from './core';
import { enemies } from '../project/enemies';
import * as floor from './floor';
import * as block from './block';
import * as enemy from '../project/functions/enemy';

/** 初始化所有单位 */
export function initUnits(): void {
    core.units = {
        enemy: enemies
    };
}

/** 切换楼层 */
export function changeFloor(floorId: string, x: number, y: number): void {
    // 绘制楼层
    let f = new floor.Floor(floorId, 'test');
    f.draw();
    // 勇士
    let hero = core.status.nowHero;
    hero.floor = floorId;
    hero.setLoc(x, y);
    hero.draw();
    // 计算伤害
    enemy.calculateAll(floorId, hero, {});
}