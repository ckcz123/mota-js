"use strict";
// 该文件为在脚本编辑中与怪物相关的文件
import { Floor } from "../../libs/floor";
import * as core from '../../libs/core';
import { Hero } from "../../libs/hero";

/**
 * 获得某个怪物的伤害
 * @param {Floor | string} floor
 * @param {Hero | string} hero
 * @param {number} x
 * @param {number} y
 */
export function getDamage (floor, hero, x, y, option) {
    if (!hero) hero = core.core.status.nowHero;
    if (typeof hero === 'string') hero = core.core.status.hero[hero];
    if (!hero) return null;
    let worker = core.core.worker.damage;
    let enemy = core.core.status.maps[floor].block.event[x + ',' + y];
    if (enemy.data.type != 'enemy') return null;
    worker.postMessage({ enemy, hero, option });
}