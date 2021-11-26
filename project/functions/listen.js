"use strict";
// 该文件负责所有游戏内的系统eventListener等，当然也可以自定义新的eventListener，也不一定必须在这个文件中定义
import * as hero from '../../libs/hero';
import * as core from '../../libs/core';

/** 为默认勇士添加默认事件监听器 */
export function addHeroListener () {
    let hero = core.core.status.nowHero;
    hero.addEventListener('shifting', follow);
    core.core.dom.body.addEventListener('keydown', keyDownHero);
    core.core.dom.body.addEventListener('keyup', keyUpHero)
}

/**
 * 视角跟随勇士
 * @this {hero.Hero}
 */
export function follow () {
    // 直接center2视角就行了
    this.followers.forEach(v => v.center2(this));
}

/** 
 * 当上下左右按下时移动勇士
 * @this {HTMLElement}
 * @param {KeyboardEvent} e
 */
export function keyDownHero (e) {
    if (!e.key.startsWith('Arrow')) return;
    let hero = core.core.status.nowHero;
    let dir = e.key.split('rrow')[1].toLowerCase();
    hero.moveStatus = dir;
    hero.move([dir]);
}

/**
 * 当上下左右松开时
 * @this {HTMLElement}
 * @param {KeyboardEvent} e
 */
export function keyUpHero (e) {
    if (!e.key.startsWith('Arrow')) return;
    let hero = core.core.status.nowHero;
    hero.moveStatus = 'none';
}