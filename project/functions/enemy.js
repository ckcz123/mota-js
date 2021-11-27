"use strict";
// 该文件为在脚本编辑中与怪物相关的文件
import { Floor } from "../../libs/floor";
import * as core from '../../libs/core';
import { Hero } from "../../libs/hero";

/**
 * 获得某个怪物的伤害
 * @param {Floor | string} floor 楼层名或实例
 * @param {Hero | string} hero 勇士名或实例
 * @param {number} x 怪物横坐标
 * @param {number} y 怪物纵坐标
 */
export function getDamage (floor, hero, x, y, option) {
    if (floor instanceof Floor) floor = floor.floorId;
    if (!hero) hero = core.core.status.nowHero;
    if (typeof hero === 'string') hero = core.core.status.hero[hero];
    if (!hero) return null;
    let worker = core.core.worker.damage;
    let enemy = core.core.status.maps[floor].block.event[x + ',' + y];
    if (enemy.data.type != 'enemy') return null;
    worker.postMessage({ enemy, hero, option, x, y, floor });
    worker.addEventListener('message', e => {

    });
}