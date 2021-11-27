"use strict";
import type { Enemy } from "../../libs/enemy";
import type { Hero } from "../../libs/hero";
// 该文件为worker中运行的文件，写法与主线程有所不同

self.addEventListener('message', e => {
    calculate(e.data.hero, e.data.enemy, e.data.option, e.data.x, e.data.y, e.data.floor);
});

/** 执行计算 */
function calculate(hero: Hero, enemy: Enemy, option: any, x: number, y: number, floor: string) {
    let damage: number;
    // 是否使用循环计算
    if (option.useLoop) useLoop(hero, enemy, option);
    else damage = normal(hero, enemy, option);
    self.postMessage({ x, y, floor, damage });
}

/** 循环伤害计算 */
function useLoop(hero: Hero, enemy: Enemy, option: any) {

}

/** 普通伤害计算 */
function normal(hero: Hero, enemy: Enemy, option: any): number {
    // 总伤害
    let damage: number;

    // 对双方造成的伤害
    let heroPerDamage = hero.atk - enemy.def;
    let enemyPerDamage = enemy.atk - hero.def;

    // 回合数
    let turn = Math.ceil(enemy.hp / heroPerDamage);

    damage += turn * enemyPerDamage;
    return damage;
}