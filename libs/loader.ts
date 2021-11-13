/*
loader.ts负责对文件的加载
*/
import { control } from './control';
import { core } from './core';
import * as animate from './animate';

class Loader {
    constructor() {

    }

    /** 执行loader的load */
    async load(): Promise<void> {
        this.loadSound();
        this.loadBgm();
        this.loadMaterial();
        await this.loadImages();
        // 加载完毕，进入游戏
        animate.initAnimate();
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

    /** 加载某个素材图片 */
    async loadMaterial(): Promise<void> {
        const loadOne = async (src: string) => {
            let all = core.dataContent[src];
            for (let one in all) {
                let name = all[one];
                let s = 'project/' + src + '/' + name;
                let img = new Image();
                img.src = s;
                core.material[src][name] = img;
            }
            console.log(src + '加载完毕');
        }
        let list = ['enemy', 'tileset', 'autotile'];
        const load = list.map(e => loadOne(e));
        await Promise.all(load);
    }
}

let loader = new Loader();
export { loader };