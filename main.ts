/* 
main.ts 游戏开始时的资源加载
*/

class Main {
    version: string;
    floorIds: string[];
    floors: {
        [key: string]: {
            map: number[]
        }
    };
    constructor() {
        this.version = '3.0';
    }
    // ---- 加载游戏核心代码及楼层 ---- //
    private loadList: string[] = ['core'];
    private projectList: string[] = ['data'];

    /** 开始加载游戏 */
    async load(): Promise<void> {
        // 加载project内的初始化文件
        const loadProject = this.projectList.map((v) => {
            let src: string = 'project/' + v + '.js';
            return this.loadJs(src, () => { }, true);
        });
        await Promise.all(loadProject);

        // 加载楼层文件
        import('./project/data.js').then(
            (data) => {
                this.floorIds = data.Data.floorIds;
                for (let name of data.Data.floorIds) {
                    let src: string = 'project/floors/' + name + '.js';
                    this.loadJs(src, () => {

                    }, true);
                }
            }
        );

        // 加载核心ts文件
        const loadLibs = this.loadList.map((v) => {
            return this.loadLibs(v, () => { });
        });
        await Promise.all(loadLibs);
    }

    /** 加载某一个project/.js文件 */
    loadJs(src: string, callback: () => void, isModule: boolean = false): void {
        let script = document.createElement('script');
        script.src = src;
        if (isModule) script.type = 'module';
        script.onload = () => {
            callback();
        }
        document.body.appendChild(script);
    }

    /** 动态载入libs模块 */
    loadLibs(module: string, callback: () => void): void {
        import('./libs/' + module).then(
            (lib) => {
                lib[module].init();
                callback();
            }
        );
    }

    /** 执行全局初始化 */
    globalInit(): void {

    }
}

const main = new Main();
main.load();
main.floors = {}

export { main, Main }