/*
core.ts 负责游戏的初始化以及核心内容
*/
import type { Maps } from './maps';
import type { Resize } from './resize';
import type { Loader } from './loader';
import type { Ui } from './Ui';
import type { Control } from './control';
import { main } from '../main';

class Core {
    maps: Maps;
    resize: Resize;
    loader: Loader;
    ui: Ui;
    control: Control;
    dom = main.dom;
    domPixi = main.domPixi;
    material: {
        images: { [key: string]: HTMLImageElement };
        bgms: { [key: string]: HTMLAudioElement };
        sounds: { [key: string]: HTMLAudioElement }
    }
    dataContent: { [key: string]: any };
    __WIDTH__ = this.dom.body.offsetWidth;
    __HEIGHT__ = this.dom.body.offsetHeight;
    readonly __UNIT_WIDTH__ = 48;
    readonly __UNIT_HEIGHT__ = 48;
    readonly floors = main.floors;
    // 界面的长宽比，默认为1.33
    readonly aspect: number = 1.33;

    constructor() {

    }

    // ---- 初始化相关 ---- //
    private list: string[] = ['maps', 'resize', 'loader', 'ui', 'control'];
    /** 执行core的全局初始化 */
    async initCore(): Promise<void> {
        // 将每个类的实例转发到core上面
        await this.forwardInstance();
        // 执行资源加载
        this.material = {
            images: {},
            bgms: {},
            sounds: {}
        };
        this.loader.load();
        // resize界面
        this.resize.resize();
    }

    /** 转发实例 */
    protected async forwardInstance(): Promise<void> {
        for (let instance of this.list) {
            await import(/* @vite-ignore */'./' + instance).then(one => {
                this[instance] = one[instance];
            });
        }
    }
}

let core = new Core();
window.core = core;
export { core, Core }