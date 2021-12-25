"use strict";
// 该文件负责所有游戏内的系统eventListener等，当然也可以自定义新的eventListener，也不一定必须在这个文件中定义
import * as hero from '../../libs/hero';
import * as core from '../../libs/core';
import { View } from '../../libs/view';

/** 为默认勇士添加默认事件监听器 */
export function addHeroListener() {
    let hero = core.core.status.nowHero;
    hero.addEventListener('shifting', follow);
    core.core.dom.body.addEventListener('keydown', keyDownHero);
    core.core.dom.body.addEventListener('keyup', keyUpHero)
}

/**
 * 视角跟随勇士
 */
export function follow(this: hero.Hero) {
    // 直接center2视角就行了
    this.followers.forEach((v: View) => v.center2(this));
}

/** 
 * 当上下左右按下时移动勇士
 */
export function keyDownHero(this: HTMLElement, e: KeyboardEvent) {
    if (!e.key.startsWith('Arrow')) return;
    let hero = core.core.status.nowHero;
    let dir: 'left' | 'right' | 'up' | 'down';
    if (e.key === 'ArrowLeft') dir = 'left';
    if (e.key === 'ArrowRight') dir = 'right';
    if (e.key === 'ArrowUp') dir = 'up';
    if (e.key === 'ArrowDown') dir = 'down';
    hero.move(dir);
    hero.moveStatus = 'constant';
    hero.moveDir = dir;
}

/**
 * 当上下左右松开时
 */
export function keyUpHero(this: HTMLElement, e: KeyboardEvent) {
    if (!e.key.startsWith('Arrow')) return;
    let hero = core.core.status.nowHero;
    hero.moveStatus = 'none';
}