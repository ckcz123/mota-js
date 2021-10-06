// es6模块化引入模块 简单说明一下
// import { xxx } from 'url' 引入对应模块，可引入多个
// import { xxx as yyy } from 'url' 引入对应模块，可引入多个，并重命名某些模块
// import * as xxx from 'url' 引入某个文件或模块内的所有内容，并赋给对象xxx
import * as core from '../../libs/core';
import * as PIXI from 'pixi.js-legacy';

// 转发非函数至proxy，意味着可以直接proxy.xxx来获取core.yyy.xxx
const handler = {
    set: (target, key, value) => {
        for (let one in target) {
            if (key in target[one]) target[one] = value;
            return true;
        }
    },
    get: (target, key) => {
        for (let one in target) {
            if (key in target[one]) return target[one];
        }
    },
}
let proxy = new Proxy(core, handler);

// 3.0样板使用es6和ts编写，所以这里使用es6的模块化，直接把对应函数export出去
// 注意，脚本编辑内的所有函数不会被转发至core上面！！！如需调用，请先import相应模块，再执行函数！！！
// 举例： import * as init from './init'; init.drawStartUi();
// ---- sprite 绘制初始界面 ---- //
/** 绘制初始游戏界面 */
export let drawStartUi = () => {
    // 先创建一个sprite
    let sprite = core.ui.createSprite('start', 0, 0, 1000, 1000 / core.core.aspect, 100);
    core.ui.changeImageOnSprite(sprite, 'bg.jpg');
}