/*
loader.ts负责对文件的加载
*/
import * as PIXI from 'pixi.js-legacy';
import { control } from './control';
import { core } from './core';

class Loader {
    constructor() {

    }

    /** 执行loader的load */
    async load(): Promise<void> {
        this.loadSound();
        this.loadBgm();
        this.loadEnemy();
        this.loadTileset();
        await this.loadImages();
        // 加载完毕，进入游戏
        control.initGame();
    }

    /** 加载图片 */
    async loadImages(): Promise<void> {
        let load = core.dataContent.images.map((one: string) => {
            let src = 'project/images/' + one;
            let image = new Image();
            image.src = src;
            core.material.images[one] = image;
            return;
        });
        await Promise.all(load);
        console.log('图片加载完毕');
    }

    /** 加载背景音乐 异步加载 */
    async loadBgm(): Promise<void> {
        let all = core.dataContent.bgms;
        let load = all.map(async (one: string) => {
            return await this.loadBgm_loadOne(one);
        });
        await Promise.all(load);
        console.log('音乐加载完毕');
    }

    /** 加载某个背景音乐 */
    async loadBgm_loadOne(name: string): Promise<void> {
        let src = 'project/bgms/' + name;
        let bgm = new Audio(src);
        bgm.preload = 'none';
        bgm.loop = true;
        core.material.bgms[name] = bgm;
    }

    /** 加载音效 同样异步 */
    async loadSound(): Promise<void> {
        let all = core.dataContent.sounds;
        let load = all.map(async (one: string) => {
            return await this.loadSound_loadOne(one);
        })
        await Promise.all(load);
        console.log('音效加载完毕');
    }

    /** 加载某个音效 */
    async loadSound_loadOne(name: string): Promise<void> {
        let src = 'project/sounds/' + name;
        let bgm = new Audio(src);
        bgm.preload = 'none';
        core.material.sounds[name] = bgm;
    }

    /** 加载怪物图片 */
    async loadEnemy(): Promise<void> {
        let all = core.dataContent.enemy;
        let load = all.map(async (one: string) => {
            return await this.loadEnemy_loadOne(one);
        })
        await Promise.all(load);
        console.log('怪物图片加载完毕');
    }

    /** 加载某个怪物图片 */
    async loadEnemy_loadOne(name: string): Promise<void> {
        let src = 'project/enemy/' + name;
        let enemy = new Image();
        enemy.src = src;
        core.material.enemy[name] = enemy;
    }

    /** 加载tileset */
    async loadTileset(): Promise<void> {
        let all = core.dataContent.tileset;
        let load = all.map(async (one: string) => {
            return await this.loadTileset_loadOne(one);
        })
        await Promise.all(load);
        console.log('tileset加载完毕');
    }

    /** 加载某个tileset */
    async loadTileset_loadOne(name: string): Promise<void> {
        let src = 'project/tileset/' + name;
        let tile = new Image();
        tile.src = src;
        core.material.tileset[name] = tile;
    }
}

let loader = new Loader();
export { loader }