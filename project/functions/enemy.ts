"use strict";
// 该文件为在脚本编辑中与怪物相关的文件 其中伤害计算为同步计算 临界在worker中处理
import { Floor } from "../../libs/floor";
import * as core from '../../libs/core';
import { Hero } from "../../libs/hero";
import { Enemy } from '../../libs/enemy';
import * as utils from './utils';

type Option = {
    useLoop?: boolean;
}

export type DamageStyle = {
    color: string | string[]
    damage: string
}

export interface Damage {
    damage: number;
    turn: number;
}

export interface CEnemy {
    readonly enemy: Enemy
    readonly hero: Hero
    readonly n: number
    readonly option: Option
    normal: (hero: Hero, enemy: Enemy, option: Option) => Damage
    loop: (hero: Hero, enemy: Enemy, option: Option) => Damage
}

/** 任务队列 */
let tasks = [];

/** 
 * 添加任务
 */
function addTask(task) {

}

/** 计算楼层全部怪物的伤害 */
export function calculateAll(floor: Floor | string, hero: Hero | string, option: Option = {}): void {
    let f: Floor;
    if (typeof floor === 'string') f = core.core.status.maps[floor];
    if (!f) f = core.core.status.thisMap;
    let blocks = f.block[f.event];
    for (let loc in blocks) {
        let block = blocks[loc];
        if (block.data.type !== 'enemy') continue;
        let [x, y] = loc.split(',');
        let dx = parseInt(x);
        let dy = parseInt(y);
        let damage = getDamage(floor, hero, dx, dy, option);
        block.data.damage = damage;
        f.damages[x + ',' + y].damage = damage.damage;
    }
}

/**
 * 获得某个怪物的伤害
 * @param floor 楼层名或实例
 * @param hero 勇士名或实例
 * @param x 怪物横坐标
 * @param y 怪物纵坐标
 */
export function getDamage(floor: Floor | string, hero: Hero | string, x: number, y: number, option: Option = {}): Damage {
    if (!hero) hero = core.core.status.nowHero;
    if (typeof hero === 'string') hero = core.core.status.hero[hero];
    if (!floor) floor = core.core.status.thisMap.floorId;
    if (floor instanceof Floor) floor = floor.floorId;
    if (!check(floor, hero, x, y)) return null;
    let f = core.core.status.maps[floor]
    let enemy = f.block[f.event][x + ',' + y].data;
    if (!(enemy instanceof Enemy)) return;
    if (option.useLoop || enemy.useLoop) {
        let damage = loop(hero, enemy, option);
        return damage;
    } else {
        let damage = normal(hero, enemy, option);
        return damage;
    }
}

/** 检查是否可以计算伤害 */
function check(floor: string, hero: Hero | string, x: number, y: number) {
    if (!core.core.floors[floor]) return false;
    if (!hero) return false;
    let f = core.core.status.maps[floor]
    let enemy = f.block[f.event][x + ',' + y];
    if (enemy.data.type != 'enemy') return false;
    return true;
}

/** 普通伤害计算 */
function normal(hero: Hero, enemy: Enemy, option: Option): Damage {
    // 总伤害
    let damage = 0;

    // 对双方造成的伤害
    let heroPerDamage = hero.atk - enemy.def;
    let enemyPerDamage = enemy.atk - hero.def;

    if (heroPerDamage <= 0) return { damage: null, turn: null };

    // 回合数
    let turn = Math.ceil(enemy.hp / heroPerDamage);

    damage += (turn - 1) * enemyPerDamage;
    return {
        damage: Math.floor(damage), turn
    };
}

/** 循环计算伤害 */
function loop(hero: Hero, enemy: Enemy, option: Option): Damage {
    return;
}

/** 获得伤害样式 */
export function getDamageStyle(floor: string | Floor, x: number, y: number, hero?: string | Hero): DamageStyle
export function getDamageStyle(damage: number | string, option?: utils.FormatOption): DamageStyle
export function getDamageStyle(floor: string | Floor | number, x?: number | utils.FormatOption, y?: number,
    hero: string | Hero = core.core.status.nowHero, option: utils.FormatOption = {}): DamageStyle {
    let result: number;
    if (!isNaN(Number(floor))) result = typeof floor === 'number' ? floor : Number(floor);
    if (typeof floor !== 'number' && typeof x === 'number') result = getDamage(floor, hero, x, y).damage;

    let o: utils.FormatOption = option;
    if (typeof x !== 'number') o = x;

    let re: DamageStyle = { damage: utils.format(result, 6, o), color: '#ffffff' };
    let h: Hero;
    if (typeof hero === 'string') h = core.core.status.hero[hero] || core.core.status.nowHero;
    else h = hero;

    // 判断颜色
    let hp = h.hp;
    if (result <= 0) re.color = '#33ff33';
    else if (result < hp / 3) re.color = '#ffffff';
    else if (result < hp * 2 / 3) re.color = '#ffff77';
    else if (result < hp) re.color = '#ff7777';
    else re.color = 'ff22ff';

    return re;
}