/*
loader.ts负责对文件的加载
*/
import * as PIXI from 'pixi.js-legacy';

let core = window.core;
class Loader {
    constructor() {

    }

    /** 执行loader的load */
    load(): void {
        this.loadImage();
    }

    /** 加载图片 */
    protected loadImage(): void {
        let game = core.domPixi.gameDraw;
        game.loader
            .add(core.dataContent.images)
            .load(() => {
                console.log('图片资源加载完毕！');
            });
    }
}

let loader = new Loader();
export { loader, Loader }