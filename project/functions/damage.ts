"use strict";
// 该文件为worker中运行的文件，写法与主线程有所不同
import type { Enemy } from "../../libs/enemy";
import type { Hero } from "../../libs/hero";
import { CEnemy, Damage } from './enemy';

self.addEventListener('message', (e: MessageEvent<CEnemy>) => {
    const data = e.data;
    const result = getCriticals(data);
});

/** 获得临界 */
function getCriticals(enemy: CEnemy): any {
    // 检查是否破防
    const pre = getDamage(enemy);
    let curr = pre;
    if (pre.damage === null) {

    }
}

/** 获取伤害，注意不能直接从enemy.ts抄过来 */
function getDamage(enemy: CEnemy): Damage {
    const option = enemy.option;
    if (option.useLoop || enemy.enemy.useLoop) return enemy.loop(enemy.hero, enemy.enemy, enemy.option);
    else return enemy.normal(enemy.hero, enemy.enemy, enemy.option);
}

/** 获取未破防临界 */
function getUnattackableCritical(enemy: CEnemy): any {
    return;
}

/** 二分临界 */
function DichotomousCriticals(enemy: CEnemy): any {
    return;
}