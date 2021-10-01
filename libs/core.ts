/*
core.ts 负责游戏的初始化以及核心内容
*/
import type { Maps } from './maps';
import { main } from '../main';

class Core {
    maps: Maps;
    floors = main.floors;
    constructor() {

    }

    /** 初始化core */
    init(): void {

    }

    // ---- 初始化相关 ---- //
    private list: string[] = ['maps'];
    /** 执行core的全局初始化 */
    async initCore(): Promise<void> {
        // 将每个类的实例转发到core上面
        await this.forwardInstance();
        console.log(core);

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
export { core, Core }