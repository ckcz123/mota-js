import { BaseAction } from "./action";

interface SaveData<K extends keyof SpriteDrawInfoMap> extends SpriteDrawInfo<any> {
    type: K
    sprite?: string
}

/** 保存至本地文件 */
export async function save(id: string, list: BaseAction<any>[]) {
    const res: SaveData<any>[] = [];
    for (const one of list) {
        const type = one.type as keyof SpriteDrawInfoMap;
        res.push(Object.assign({}, { type, sprite: one.sprite }, one.data));
    }
    const str = JSON.stringify(res);
    await new Promise((res, rej) => fs.writeFile(`_ui/${id}.h5ui`, str, 'utf-8', err => {
        if (err) {
            console.error(err);
            rej('error');
            return;
        }
        res('success');
        return;
    })).then(() => {
        console.log(`保存成功，id:${id}`);
    }, () => {
        alert('保存失败，错误信息请在控制台查看');
    });
}

export async function load(id: string, callback: (res: BaseAction<any>[]) => void) {
    await new Promise((resolve, rej) => {
        fs.readFile(`ui/${id}.h5ui`, 'utf-8', (err, data) => {
            if (err || data === void 0 || data === null) {
                console.error(err);
                alert('读取失败，错误信息请在控制台查看');
                rej('error');
                return;
            }
            const obj = JSON.parse(data) as { [x: number]: SaveData<any> };
            const res: BaseAction<any>[] = [];
            for (const i in obj) {
                const info = obj[i];
                const one = new BaseAction(info.type);
                if (!one.success)
                    throw new ReferenceError(`Unexpected fail on construct BaseAction. index: ${i}`);
                one.sprite = info.sprite;
                for (const id in info) {
                    if (id === 'sprite') continue;
                    // @ts-ignore
                    one[id] = info[id]
                }
                res.push(one);
            }
            callback(res);
            resolve('success');
        })
    })
}