/*
core.ts 负责游戏的初始化以及核心内容
*/
import * as PIXI from 'pixi.js-legacy';
import { maps } from './maps';
import { resize } from './resize';
import { loader } from './loader';
import { ui } from './ui';
import { control } from './control';
import { listen } from './listen';
import * as events from './events';
import * as enemy from './enemy';
import * as floor from './floor';
import * as hero from './hero';

declare global {
    interface Window {
        core: Core
    }
}

class Core {
    dom: { [key: string]: HTMLElement; };
    pixi: { [key: string]: PIXI.Application };
    containers: { [key: string]: PIXI.Container };
    sprite: { [key: string]: PIXI.Sprite };
    dataContent: { [key: string]: any };
    floorIds: string[];
    scale: number;
    status: {
        hero: { now: hero.Hero, [key: string]: hero.Hero },
        thisMap: floor.Floor
    }
    units: {
        enemy: { [key: string]: enemy.Enemy };
    };
    material: {
        images: { [key: string]: HTMLImageElement };
        bgms: { [key: string]: HTMLAudioElement };
        sounds: { [key: string]: HTMLAudioElement }
    }
    __WIDTH__: number;
    __HEIGHT__: number;
    readonly __UNIT_WIDTH__ = 48;
    readonly __UNIT_HEIGHT__ = 48;
    readonly floors: { [key: string]: any } = {};
    /** 界面的长宽比，默认为1.33 */
    readonly aspect: number = 1.33;

    constructor() {
        this.material = {
            images: {},
            bgms: {},
            sounds: {}
        };
        this.containers = {};
    }

    // -------- 初始化相关 -------- //
    /** 执行core的全局初始化 */
    initCore(): void {
        // resize界面
        resize.resize();
        // 执行资源加载
        loader.load();
        // 初始化所有单位
        maps.initUnits();
        // 初始化status
        core.status = {
            hero: { now: void 0 },
            thisMap: void 0
        }
    }
}

let core = new Core();
export { core, maps, resize, loader, ui, control, listen, events, floor, enemy, hero };