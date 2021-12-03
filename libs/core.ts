/*
core.ts 负责游戏的初始化以及核心内容
*/
import { dict } from '../project/dict';
import * as resize from './resize';
import * as ui from './ui';
import * as maps from './maps';
import * as loader from './loader';
import * as control from './control';
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
        maps: { [key: string]: floor.Floor },
        views: { [key: string]: view.View },
        areas: { [key: string]: { floorIds: string[], data: { [key: string]: any } } },
        thisMap: floor.Floor,
        nowHero: hero.Hero,
        nowView: view.View
    }
    units: {
        enemy: { [key: string]: enemy.Status };
    };
    material: {
        images: { [key: string]: HTMLImageElement };
        bgms: { [key: string]: HTMLAudioElement };
        sounds: { [key: string]: HTMLAudioElement };
        enemy: { [key: string]: HTMLImageElement };
        tileset: { [key: string]: HTMLImageElement };
        autotile: { [key: string]: HTMLImageElement };
    }
    settings: {
        heroSpeed: number;
    }
    worker: {
        damage: Worker
    }
    readonly __UNIT_WIDTH__ = 48;
    readonly __UNIT_HEIGHT__ = 48;
    readonly floors: { [key: string]: any } = {};
    /** 界面的长宽比，默认为1.33 */
    readonly aspect: number = 4 / 3

    constructor() {
        this.material = {
            images: {},
            bgms: {},
            sounds: {},
            enemy: {},
            tileset: {},
            autotile: {}
        };
        this.containers = {};
    }

    // -------- 初始化相关 -------- //
    /** 执行core的全局初始化 */
    initCore(): void {
        // resize界面
        resize.resize();
        window.onresize = () => { resize.resize(); };
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
            nowView: void 0,
        }
        core.settings = {
            heroSpeed: 100
        }
        core.timeCycle = 0;
        core.worker = {
            damage: new Worker('../project/functions/damage.ts')
        }
        this.initView();
        this.initHero();
    }

    /** 初始化main视角 */
    initView(): void {
        let v = new view.View('main', 0, 0, 1);
        this.status.views.main = this.status.nowView = v;
        v.to();
        v.resize(1.5);
    }

    /** 初始化勇士 */
    initHero(): void {
        hero.createHero('hero', { hp: 1000, atk: 10, def: 5, id: 'hero', img: 'hero.png', autoScale: true });
        hero.changeHero('hero');
    }
}

let core = new Core();
export { core, maps, resize, loader, ui, control, events, floor, enemy, hero, utils, view, block, animate };