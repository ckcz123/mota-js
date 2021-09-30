/*
core.ts 负责游戏的初始化以及核心内容
*/

class Core {
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
        this.forwardInstance();
    }

    /** 转发实例 */
    protected forwardInstance(): void {
        for (let instance of this.list) {
            import('./' + instance).then(one => {
                core[instance] = one[instance];
            });
        }
    }
}

let core = new Core();
export { core, Core }