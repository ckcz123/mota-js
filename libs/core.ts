/*
core.ts 负责游戏的初始化以及核心内容
*/
import type { Maps } from './maps';
import type { Resize } from './resize';
import type { Loader } from './loader';
import type { Ui } from './Ui';
import type { Control } from './control';
import { main } from '../main';

declare global {
    interface Window {
        core: Core
    }
}

class Core {
    maps: Maps;
    resize: Resize;
    loader: Loader;
    ui: Ui;
    control: Control;
    dom = main.dom;
    pixi = main.pixi;
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
        this.material = {
            images: {},
            bgms: {},
            sounds: {}
        };
    }

    // -------- 初始化相关 -------- //
    private list: string[] = ['maps', 'resize', 'loader', 'ui', 'control'];
    /** 执行core的全局初始化 */
    async initCore(): Promise<void> {
        // 将每个类的实例转发到core上面
        await this.forwardInstance();
        this.forwardFuncs();
        // 执行资源加载
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
        console.log('实例转发完毕');
    }

    /** 转发函数 */
    protected forwardFuncs(): void {
        for (let name of this.list) {
            Object.getOwnPropertyNames(Object.getPrototypeOf(core[name])).forEach((funcname) => {
                if (funcname === 'constructor') return;
                if (!(core[name][funcname] instanceof Function)) return;
                if (funcname === name) return;
                if (funcname[0] === '_') return;
                if (core[funcname]) {
                    console.error("ERROR: 无法转发 " + name + " 中的函数 " + funcname + " 到 core 中！同名函数已存在。");
                    return;
                }
                let func: string = core[name][funcname].toString();
                if (func.startsWith('async')) func = func.substring(5, func.length);
                func = 'function ' + func;
                let parameterInfo = /\s*\(([\w_,$\s]*)\)\s*\{/.exec(core[name][funcname].toString());
                let parameters = (parameterInfo == null ? "" : parameterInfo[1]).replace(/\s*/g, '').replace(/,/g, ', ');
                core[funcname] = new Function(parameters, 'return core.' + name + '.' + funcname + '.apply(core.' + name + ', arguments);');
            });
        }
        console.log('函数转发完毕');
    }
}

let core = new Core();
window.core = core;
export { core, Core }