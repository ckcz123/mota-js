"use strict";
import { Enemy } from "../../libs/enemy";
import { Hero } from "../../libs/hero";
// 该文件为worker中运行的文件，写法与主线程有所不同

self.addEventListener('message', e => {
    calculate(e.data.hero, e.data.enemy, e.data.option);
});

/** 执行计算 */
function calculate(hero: Hero, enemy: Enemy, option: any) {
    // 是否使用循环计算
    if (option.useLoop) useLoop(hero, enemy, option);
    else normal(hero, enemy, option);
}

/** 循环伤害计算 */
function useLoop(hero: Hero, enemy: Enemy, option: any) {

}

/** 普通伤害计算 */
function normal(hero: Hero, enemy: Enemy, option: any) {

}