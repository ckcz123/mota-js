/*
core.ts 负责游戏的初始化以及核心内容
*/
import { maps } from './maps';
import { resize } from './resize';
import { loader } from './loader';
import { ui } from './ui';
import { control } from './control';
import { listen } from './listen';
import { dict } from '../project/dict';
import * as PIXI from 'pixi.js-legacy';
import * as events from './events';
import * as enemy from './enemy';
import * as floor from './floor';
import * as hero from './hero';
import * as utils from './utils';
import * as view from './view';
import * as block from './block';
import * as animate from './animate';

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
    dict: { [key: number]: { id: string, cls: string, img: string, animate?: animate.Animate } } = dict;
    floorIds: string[];
    scale: number;
    __WIDTH__: number;
    __HEIGHT__: number;
    timestamp: number;
    timeCycle: number;
    status: {
        hero: { [key: string]: hero.Hero },
        nowHero: hero.Hero,
        maps: { [key: string]: floor.Floor },
        thisMap: floor.Floor,
        areas: { [key: string]: { floorIds: string[], data: { [key: string]: any } } },
        views: { [key: string]: view.View },
        nowView: view.View
    }
    units: {
        enemy: { [key: string]: enemy.Enemy };
    };
    material: {
        images: { [key: string]: HTMLImageElement };
        bgms: { [key: string]: HTMLAudioElement };
        sounds: { [key: string]: HTMLAudioElement };
        enemy: { [key: string]: HTMLImageElement };
        tileset: { [key: string]: HTMLImageElement };
    }
    readonly __UNIT_WIDTH__ = 48;
    readonly __UNIT_HEIGHT__ = 48;
    readonly floors: { [key: string]: any } = {};
    /** 界面的长宽比，默认为1.33 */
    readonly aspect: number = 1.33

    constructor() {
        this.material = {
            images: {},
            bgms: {},
            sounds: {},
            enemy: {},
            tileset: {}
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
            hero: {},
            maps: {},
            thisMap: void 0,
            nowHero: void 0,
            areas: {},
            views: {},
            nowView: void 0
        }
        core.timeCycle = 0;
        animate.initAnimate();
        this.initView();
        this.initHero();
    }

    /** 初始化main视角 */
    initView(): void {
        let v = new view.View('main', 0, 0, 1);
        this.status.views.main = this.status.nowView = v;
        v.to();
    }

    /** 初始化勇士 */
    initHero(): void {
        hero.createHero('hero', { hp: 1000, atk: 10, def: 5, id: 'hero', img: 'hero.png' });
        hero.changeHero('hero');
    }
}

let core = new Core();
export { core, maps, resize, loader, ui, control, listen, events, floor, enemy, hero, utils, view, block, animate };