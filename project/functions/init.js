"use strict";
// es6模块化引入模块 简单说明一下
// import { xxx } from 'url' 引入对应模块，可引入多个
// import { xxx as yyy } from 'url' 引入对应模块，可引入多个，并重命名某些模块
// import * as xxx from 'url' 引入某个文件或模块内的所有内容，并赋给对象xxx
import * as core from '../../libs/core';

window.core = core;

// 3.0样板使用es6和ts编写，所以这里使用es6的模块化，直接把对应函数export出去
// 注意，脚本编辑内的所有函数不会被转发至core上面！！！如需调用，请先import相应模块，再执行函数！！！
// 举例： import * as init from './init'; init.drawStartUi();

/** 绘制初始游戏界面 */
export function drawStartUi () {
    // 先创建一个container
    const container = core.ui.createContainer('start', 0, 0, 1000, 1000 / core.core.aspect, 100);
    core.ui.drawImageOnContainer(container, 'bg.jpg', true, 0, 0, 1000, 1000 / core.core.aspect);
    // 创建文字    在用sprite和container来绘制东西时，颜色可以通过数组的形式创建渐变，比如下面的fill参数
    const title = core.ui.createText('魔塔样板', 500, 200, 50, {
        align: 'center', fill: ['#cccccc', '#dddddd', '#eeeeee', '#ffffff'], stroke: '#000000', fontSize: 140,
        strokeThickness: 3, dropShadow: true, dropShadowBlur: 30, dropShadowColor: '#333333', dropShadowDistance: 20
    });
    // 把所有东西都画到container上
    core.ui.drawContent(container, title);

    // 添加玩家交互
    container.interactive = true;
    container.addListener('click', e => {
        let data = e.data;
        let x = data.global.x,
            y = data.global.y;
        // 进入游戏
        if (x >= 300 && x <= 700 && y >= 600 && y <= 750) core.events.startGame();
    });
}