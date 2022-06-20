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
    if (!hero) throw new ReferenceError('不存在这个英雄！');
    const list = ['atk', 'def', 'mdef', 'hp', 'hpmax', 'mana', 'manamax'];
    return Object.keys(hero).filter(v => list.includes(v));
}

/** 设置某个元素的css特效，不可用伪类
 * @param ele 要赋给的html元素
 * @param css css字符串
 */
export function setCss(ele: HTMLElement, css: string): void {
    const effects = css.split(';');
    effects.forEach((v) => {
        const content = v.split(':');
        const value = content[1];
        let name = content[0];
        name = name.trim().split('-').reduce(function (pre, curr, i, a) {
            if (i === 0 && curr !== '') return curr;
            if (a[0] === '' && i === 1) return curr;
            return pre + curr.toUpperCase()[0] + curr.slice(1);
        }, '');
        // @ts-ignore
        if (name in ele.style) ele.style[name] = value.trim();
    });
}