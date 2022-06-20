"use strict";
// 该文件为worker中运行的文件，写法与主线程有所不同
import type { Enemy } from "../../libs/enemy";
import type { Hero } from "../../libs/hero";
import { CEnemy, Damage, Option } from './enemy';

interface Fn {
    normal: (hero: Hero, enemy: Enemy, option: Option) => Damage
    loop: (hero: Hero, enemy: Enemy, option: Option) => Damage
}

const recieveFn = (e: MessageEvent<Fn>) => {
    if (e.data.normal instanceof Function && e.data.loop instanceof Function) {
        self.removeEventListener('message', recieveFn);
        normal = e.data.normal;
        loop = e.data.loop;
    }
}

let normal: Fn['normal'];
let loop: Fn['loop'];

const list: CEnemy[] = [];
let promise = new Promise((res, rej) => {
    res('');
});

self.addEventListener('message', (e: MessageEvent<CEnemy>) => {
    const data = e.data;
    list.push(data);
    const cal = () => {
        const res = getCriticals(list.pop() as CEnemy);
        send(res);
        if (list.length > 0) promise = promise.then(cal);
    }
    if (list.length === 1) {
        promise = promise.then(cal);
    }
});

self.addEventListener('message', recieveFn);

/** 向主线程发送结果 */
function send(res: any) {
    self.postMessage(res);
}

/** 获得临界 */
function getCriticals(enemy: CEnemy): any {
    // 检查是否破防
    const pre = getDamage(enemy);
    let curr = pre;
    if (pre.damage === void 0) {

    }
}

/** 获取伤害，注意不能直接从enemy.ts抄过来 */
function getDamage(enemy: CEnemy): Damage {
    const option = enemy.option;
    if (option.useLoop || enemy.enemy.useLoop) return loop(enemy.hero, enemy.enemy, enemy.option);
    else return normal(enemy.hero, enemy.enemy, enemy.option);
}

/** 获取未破防临界 */
function getUnattackableCritical(enemy: CEnemy): any {
    return;
}

/** 二分临界 */
function DichotomousCriticals(enemy: CEnemy): any {
    return;
}