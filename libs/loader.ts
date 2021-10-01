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
        await this.loadImages();
        this.loadBgm();
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
        console.log('bgm加载完毕');
    }

    protected async loadBgm_loadOne(name: string): Promise<void> {
        let src = './project/bgms/' + name;
        let bgm = new Audio(src);
        bgm.preload = 'none';
        bgm.loop = true;
        core.material.bgms[name] = bgm;
    }
}

let loader = new Loader();
export { loader, Loader }