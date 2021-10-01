/*
resize.ts 负责窗口界面相关内容
*/

let core = window.core;
class Resize {
    constructor() {
        window.onresize = () => {
            this.resize();
        }
    }

    /** 窗口大小变化时执行的函数 */
    resize(): void {
        core.__WIDTH__ = core.dom.body.offsetWidth;
        core.__HEIGHT__ = core.dom.body.offsetHeight;
        this.resizeGameGroup();
    }

    /** resize游戏界面 */
    resizeGameGroup(): void {
        let w = core.__WIDTH__,
            h = core.__HEIGHT__;
        let game = core.dom.gameGroup;
        if (w >= h * core.aspect) {
            let width = ~~((h - 10) * core.aspect);
            game.style.height = (h - 10) + 'px';
            game.style.width = width + 'px';
            game.style.left = (w / 2 - width / 2) + 'px';
            game.style.top = '5px';
        } else {
            let height = ~~((w - 10) / core.aspect);
            game.style.width = (w - 10) + 'px';
            game.style.height = height + 'px';
            game.style.left = '5px';
            game.style.top = (h / 2 - height / 2) + 'px';
        }
    }
}

let resize = new Resize();
export { resize, Resize };