/* 
main.ts 游戏开始时的资源加载
*/
import * as PIXI from 'pixi.js-legacy';
import { core } from './libs/core';
import { data } from './project/data';

class Main {
    version: string;
    constructor() {
        this.version = '3.0';
        core.dom = {
            'body': document.body,
            'gameGroup': document.getElementById('gameGroup')
        }
        core.pixi = {};
    }
    // ---- 加载游戏核心代码及楼层 ---- //
    /** 开始加载游戏 */
    async load(): Promise<void> {
        // 加载project内的初始化文件
        core.floorIds = data.floorIds;
        for (let name of data.floorIds) {
            await import(/* @vite-ignore */'./project/floors/' + name).then(floor => {
                core.floors[name] = floor.floor;
            });
        }
        core.dataContent = data;

        // 进行全局初始化
        this.globalInit();
    }

    /** 执行全局初始化 */
    globalInit(): void {
        // 创建游戏相关pixi精灵
        let gameDraw = new PIXI.Application({
            width: 0,
            height: 0,
            resolution: 2
        });
        gameDraw.renderer.view.style.position = "absolute";
        gameDraw.renderer.view.style.display = "block";
        gameDraw.view.id = 'gameDraw';
        // 如果需要调整游戏画面的宽度和高度请在下面调整
        gameDraw.renderer.resize(1000, 1000 / core.aspect);
        core.dom.gameGroup.appendChild(gameDraw.view);
        core.dom.gameDraw = gameDraw.view;
        core.pixi.gameDraw = gameDraw;
        core.initCore();
    }
}

let main = new Main();
export { main }