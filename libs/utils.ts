/*
utils.ts负责各种辅助函数
*/

import { core } from "./core";
import { Hero } from "./hero";

export const dirs = {
    left: [-1, 0],
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    leftup: [-1, -1],
    leftdown: [-1, 1],
    rightup: [1, -1],
    rightdown: [1, 1]
}

/** 获得属性名的中文名 */
export function getStatusLabel(name: string): string {
    return {
        atk: '攻击',
        def: '防御',
        mdef: '护盾',
        hp: '生命',
        hpmax: '生命上限',
        mana: '魔法',
        manamax: '魔法上限'
    }[name] || name;
}

/** 获得可显示的属性 */
export function getShowStatus(hero: string | Hero): Array<string> {
    if (!(hero instanceof Hero)) hero = core.status.hero[hero];
    if (!hero) return;
    const list = ['atk', 'def', 'mdef', 'hp', 'hpmax', 'mana', 'manamax'];
    return Object.keys(hero).filter(v => list.includes(v));
}