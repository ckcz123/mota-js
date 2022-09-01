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
    await new Promise((res, rej) => fs.writeFile(`_ui/${id}.h5ui`, str, 'base64', err => {
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

export async function load(id: string) {
    let res: BaseAction<any>[] = [];
    await new Promise((resolve, rej) => {
        fs.readFile(`_ui/${id}.h5ui`, 'utf-8', (err, data) => {
            if (err || data === void 0 || data === null) {
                console.error(err);
                alert('读取失败，错误信息请在控制台查看');
                rej('error');
                return;
            }
            const obj = JSON.parse(LZString.decompressFromBase64(data)) as { [x: number]: SaveData<any> };
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
            resolve('success');
        })
    })
    return res;
}

export async function list() {
    let res: string[] = [];
    await new Promise((resolve, rej) => {
        fs.readdir('_ui', (err, data) => {
            if (err || !data) {
                console.error(err);
                alert('加载已有ui列表失败，错误信息请在控制台查看');
                rej('error');
                return;
            }
            res = data.map(v => v.slice(0, -5));
            resolve('success');
        })
    })
    return res;
}

export async function create(id: string) {
    if (id === '') return alert('ui名称不能为空!');
    await new Promise((res, rej) => {
        fs.writeFile(`_ui/${id}.h5ui`, LZString.compressToBase64('{}'), 'base64', (err, data) => {
            console.log(data);

            if (err) {
                console.error(err);
                alert('创建ui出错，请在控制台查看报错信息');
                rej('error');
                return;
            }
            res('success');
        });
    })
}

export async function del(id: string) {
    await new Promise((res, rej) => {
        fs.deleteFile(`_ui/${id}.h5ui`, (err) => {
            if (err) {
                console.error(err);
                alert('删除ui出错，错误信息请在控制台查看');
                rej('error');
            }
            res('success');
        })
    })
}