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
    }
}

let resize = new Resize();
export { resize, Resize };