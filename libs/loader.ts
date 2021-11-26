/*
loader.ts负责对文件的加载
*/
import * as control from './control';
import { core } from './core';
import * as animate from './animate';

/** 执行loader的load */
export async function load(): Promise<void> {
    loadSound();
    loadBgm();
    loadMaterial();
    await loadImages();
    // 加载完毕，进入游戏
    animate.initAnimate();
    control.initGame();
}

/** 加载图片 */
async function loadImages(): Promise<void> {
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
async function loadBgm(): Promise<void> {
    let all = core.dataContent.bgms;
    let load = all.map(async (one: string) => {
        return await loadBgm_loadOne(one);
    });
    await Promise.all(load);
    console.log('音乐加载完毕');
}

/** 加载某个背景音乐 */
async function loadBgm_loadOne(name: string): Promise<void> {
    let src = 'project/bgms/' + name;
    let bgm = new Audio(src);
    bgm.preload = 'none';
    bgm.loop = true;
    core.material.bgms[name] = bgm;
}

/** 加载音效 同样异步 */
async function loadSound(): Promise<void> {
    let all = core.dataContent.sounds;
    let load = all.map(async (one: string) => {
        return await loadSound_loadOne(one);
    })
    await Promise.all(load);
    console.log('音效加载完毕');
}

/** 加载某个音效 */
async function loadSound_loadOne(name: string): Promise<void> {
    let src = 'project/sounds/' + name;
    let bgm = new Audio(src);
    bgm.preload = 'none';
    core.material.sounds[name] = bgm;
}

/** 加载某个素材图片 */
async function loadMaterial(): Promise<void> {
    const loadOne = async (dir: string, name: string) => {
        let img = new Image();
        return new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
            img.src = 'project/' + dir + '/' + name;
            core.material[dir][name] = img;
        });
    }

    const loadDir = async (src: string) => {
        let all = core.dataContent[src];
        const load = all.map(e => loadOne(src, e));
        console.log(src + '加载完毕');
        await Promise.all(load);
    }
    let list = ['enemy', 'tileset', 'autotile'];
    const load = list.map(e => loadDir(e));
    await Promise.all(load);
}