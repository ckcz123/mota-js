/* 
main.ts 游戏开始时的资源加载
*/
import type { Core } from './libs/core';
import * as PIXI from 'pixi.js-legacy';

class Main {
    version: string;
    floorIds: string[];
    floors: {
        [key: string]: {
            map: number[]
        }
    };
    core: Core;
    dom: { [key: string]: HTMLElement };
    pixi: { [key: string]: PIXI.Application }
    constructor() {
        this.version = '3.0';
        this.dom = {
            'body': document.body,
            'gameGroup': document.getElementById('gameGroup')
        }
        this.pixi = {};
    }
    // ---- 加载游戏核心代码及楼层 ---- //
    private loadList: string[] = ['resize', 'maps', 'loader', 'ui'];

    /** 开始加载游戏 */
    async load(): Promise<void> {
        // 加载核心ts文件
        await import('./libs/core').then(core => {
            this.core = core.core;
        });
        const loadLibs = this.loadList.map((v) => {
            return this.loadLibs(v, () => { });
        });
        await Promise.all(loadLibs);

        // 加载project内的初始化文件
        await import('./project/data.js').then(
            async (data) => {
                // 加载楼层文件
                this.floorIds = data.data.floorIds;
                for (let name of data.data.floorIds) {
                    await import(/* @vite-ignore */'./project/floors/' + name).then(floor => {
                        main.floors[name] = floor.floor;
                    })
                }
                window.core.dataContent = data.data;
            }
        );

        // 进行全局初始化
        this.globalInit();
    }

    /** 动态载入libs模块 */
    async loadLibs(module: string, callback: () => void): Promise<void> {
        await import(/* @vite-ignore */'./libs/' + module).then(
            (lib) => {
                this[module] = lib[module];
                callback();
            }
        );
    }

    /** 执行全局初始化 */
    globalInit(): void {
        let core = this.core;
        // 创建游戏相关pixi精灵
        let gameDraw = new PIXI.Application({
            width: 0,
            height: 0,
        });
        gameDraw.renderer.view.style.position = "absolute";
        gameDraw.renderer.view.style.display = "block";
        gameDraw.view.id = 'gameDraw';
        this.dom.gameGroup.appendChild(gameDraw.view);
        this.dom.gameDraw = gameDraw.view;
        this.pixi.gameDraw = gameDraw;
        core.initCore();
    }
}

let main = new Main();
export { main, Main }