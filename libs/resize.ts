/*
resize.ts 负责窗口界面相关内容
*/
import { core, ui } from './core';

class Resize {
    constructor() {
        window.onresize = () => {
            this.resize();
        }
    }

    /** 窗口大小变化时执行的函数 */
    resize(): void {
        this.resizeGameGroup();
    }

    /** resize游戏界面 */
    resizeGameGroup(): void {
        let w = window.innerWidth,
            h = window.innerHeight;
        let game = core.dom.gameDraw;
        if (w >= h * core.aspect) {
            let width = ~~((h - 10) * core.aspect);
            game.style.height = (h - 10) + 'px';
            game.style.width = width + 'px';
        } else {
            let height = ~~((w - 10) / core.aspect);
            game.style.width = (w - 10) + 'px';
            game.style.height = height + 'px';
        }
        core.scale = parseInt(game.style.width) / 1000;
        core.__WIDTH__ = parseInt(game.style.width);
        core.__HEIGHT__ = parseInt(game.style.height);
    }
}

let resize = new Resize();
export { resize, Resize };