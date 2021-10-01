/*
loader.ts负责对文件的加载
*/
import * as PIXI from 'pixi.js-legacy';

let core = window.core;
class Loader {
    constructor() {

    }

    /** 执行loader的load */
    async load(): Promise<void> {
        this.loadSound();
        this.loadBgm();
        await this.loadImages();
    }

    /** 加载图片 */
    protected async loadImages(): Promise<void> {
        let load = core.dataContent.images.map((one: string) => {
            let src = './project/images/' + one;
            let image = new Image();
            image.onload = () => {
                core.material.images[one] = image;
            }
            image.src = src;
            return;
        });
        await Promise.all(load);
        console.log('图片加载完毕');

    }

    /** 加载背景音乐 异步加载 */
    protected async loadBgm(): Promise<void> {
        let all = core.dataContent.bgms;
        let load = all.map(async (one: string) => {
            return await this.loadBgm_loadOne(one);
        })
        await Promise.all(load);
        console.log('音乐加载完毕');
    }

    /** 加载某个背景音乐 */
    protected async loadBgm_loadOne(name: string): Promise<void> {
        let src = './project/bgms/' + name;
        let bgm = new Audio(src);
        bgm.preload = 'none';
        bgm.loop = true;
        core.material.bgms[name] = bgm;
    }

    /** 加载音效 同样异步 */
    protected async loadSound(): Promise<void> {
        let all = core.dataContent.sounds;
        let load = all.map(async (one: string) => {
            return await this.loadSound_loadOne(one);
        })
        await Promise.all(load);
        console.log('音效加载完毕');
    }

    /** 加载某个音效 */
    protected async loadSound_loadOne(name: string): Promise<void> {
        let src = './project/sounds/' + name;
        let bgm = new Audio(src);
        bgm.preload = 'none';
        core.material.sounds[name] = bgm;
    }
}

let loader = new Loader();
export { loader, Loader }