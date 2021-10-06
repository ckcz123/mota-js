/*
core.ts 负责游戏的初始化以及核心内容
*/
import * as PIXI from 'pixi.js-legacy';
import { maps } from './maps';
import { resize } from './resize';
import { loader } from './loader';
import { ui, Ui } from './ui';
import { control } from './control';

declare global {
    interface Window {
        core: Core
        ui: Ui
    }
}

class Core {
    dom: { [key: string]: HTMLElement; };
    pixi: { [key: string]: PIXI.Application };
    containers: { [key: string]: { [key: string]: PIXI.Sprite } };
    floorIds: string[];
    material: {
        images: { [key: string]: HTMLImageElement };
        bgms: { [key: string]: HTMLAudioElement };
        sounds: { [key: string]: HTMLAudioElement }
    }
    dataContent: { [key: string]: any };
    scale: number;
    readonly __UNIT_WIDTH__ = 48;
    readonly __UNIT_HEIGHT__ = 48;
    __WIDTH__: number;
    __HEIGHT__: number;
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
        // 初始化pixi相关内容
        ui.initPixi();
        // 执行资源加载
        loader.load();
        // resize界面
        resize.resize();
    }
}

let core = new Core();
window.core = core;
window.ui = ui;
export { core, maps, resize, loader, ui, control };