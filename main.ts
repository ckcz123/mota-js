/* 
main.ts 游戏开始时的资源加载
*/
import type { Core } from './libs/core';

declare global {
    interface Window {
        core: Core
    }
}

class Main {
    version: string;
    floorIds: string[];
    floors: {
        [key: string]: {
            map: number[]
        }
    };
    core: Core;
    dom: { [key: string]: HTMLElement }
    constructor() {
        this.version = '3.0';
        this.dom = {
            'body': document.body
        }
    }
    // ---- 加载游戏核心代码及楼层 ---- //
    private loadList: string[] = ['resize', 'maps'];

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
        // 加载楼层文件
        await import('./project/data.js').then(
            async (data) => {
                this.floorIds = data.Data.floorIds;
                for (let name of data.Data.floorIds) {
                    await import('./project/floors/' + name).then(floor => {
                        main.floors[name] = floor.floor;
                    })
                }
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
        core.initCore();
    }
}

let main = new Main();
main.load();
main.floors = {};

export { main, Main }