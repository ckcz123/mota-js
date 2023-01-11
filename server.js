const http = require('http');
const fs = require('fs/promises');
const fss = require('fs');
const path = require('path');

const name = (() => {
    const data = fss.readFileSync('./project/data.js', 'utf-8');
    const json = JSON.parse(
        data
            .split(/(\n|\r\n)/)
            .slice(1)
            .join('\n')
    );
    return json.firstData.name;
})();

/** 核心服务器 */
const server = http.createServer();

/** 是否需要重新加载浏览器 */
let needReload = true;

/** 热重载信息 */
let hotReloadData = '';

/** 是否已经启动了热重载模块 */
let watched = false;

/** 是否已经启动了录像调试模块 */
let replayed = false;

/** 监听端口 */
let port = 3000;
const next = () => {
    server.listen(port, '127.0.0.1');
    server.on('error', () => {
        console.log(`${port}端口已被占用`);
        port++;
        next();
    });
};
next();

let repStart;

const listenedFloors = [];

// ----- GET file

/**
 * 请求文件
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 * @param {string} path
 */
async function getFile(req, res, path) {
    try {
        const data = await fs.readFile(path);
        if (path.endsWith('.js'))
            res.writeHead(200, { 'Content-type': 'text/javascript' });
        if (path.endsWith('.css'))
            res.writeHead(200, { 'Content-type': 'text/css' });
        if (path.endsWith('.html'))
            res.writeHead(200, { 'Content-type': 'text/html' });
        return res.end(data), true;
    } catch {
        return false;
    }
}

/**
 * 高层塔优化及动画加载
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 * @param {string[]} ids
 * @param {string} suffix 后缀名
 * @param {string} dir 文件夹路径
 * @param {string} join 分隔符
 */
async function getAll(req, res, ids, suffix, dir, join) {
    let data = {};
    const tasks = ids.map(v => {
        return new Promise(res => {
            const d = path.resolve(__dirname, `${dir}${v}${suffix}`);
            try {
                fs.readFile(d).then(vv => {
                    data[v] = vv;
                    res(`${v} pack success.`);
                });
            } catch {
                throw new ReferenceError(`The file ${d} does not exists.`);
            }
        });
    });
    await Promise.all(tasks);
    const result = ids.map(v => data[v]);
    return res.end(result.join(join)), true;
}

// ----- 样板的fs功能

/**
 * 获取POST的数据
 * @param {http.IncomingMessage} req
 */
async function getPostData(req) {
    let data = '';
    await new Promise(res => {
        req.on('data', chunk => {
            data += chunk.toString();
        });
        req.on('end', res);
    });
    return data;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function readDir(req, res) {
    const data = await getPostData(req);
    const dir = path.resolve(__dirname, data.toString().slice(5));
    try {
        const info = await fs.readdir(dir);
        res.end(JSON.stringify(info));
    } catch (e) {
        console.error(e);
        res.end(`error: Read dir ${dir} fail. Does the dir exists?`);
    }
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function mkdir(req, res) {
    const data = await getPostData(req);
    const dir = path.resolve(__dirname, data.toString().slice(5));
    try {
        await fs.mkdir(dir);
    } catch (e) {}
    res.end();
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function readFile(req, res) {
    const data = (await getPostData(req)).toString();
    const dir = path.resolve(__dirname, data.split('&name=')[1]);
    try {
        const type = /^type=(utf8|base64)/.exec(data)[0];
        const info = await fs.readFile(dir, { encoding: type.slice(5) });
        res.end(info);
    } catch (e) {
        res.end();
    }
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function writeFile(req, res) {
    const data = (await getPostData(req)).toString();
    const name = data.split('&name=')[1].split('&value=')[0];
    const dir = path.resolve(__dirname, name);
    try {
        const type = /^type=(utf8|base64)/.exec(data)[0].slice(5);
        const value = /&value=[^]+/.exec(data)[0].slice(7);
        await fs.writeFile(dir, value, { encoding: type });
        testWatchFloor(name);
    } catch (e) {
        console.error(e);
        res.end(
            `error: Write file ${dir} fail. Does the parent folder exists?`
        );
    }
    res.end();
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function rm(req, res) {
    const data = (await getPostData(req)).toString();
    const dir = path.resolve(__dirname, data.slice(5));
    try {
        await fs.rm(dir);
    } catch (e) {
        console.error(e);
        res.end(`error: Remove file ${dir} fail. Does this file exists?`);
    }
    res.end();
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function moveFile(req, res) {
    const data = (await getPostData(req)).toString();
    const info = data.split('&dest=');
    const src = path.resolve(__dirname, info[0].slice(4));
    const dest = info[1];
    try {
        const data = await fs.readFile(src);
        await fs.writeFile(path.resolve(__dirname, dest), data);
        await fs.rm(src);
    } catch (e) {
        console.error(e);
        res.end(`error: Move file ${dir} fail.`);
    }
    res.end();
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function writeMultiFiles(req, res) {
    const data = (await getPostData(req)).toString();
    const names = /name=[^]+&value=/.exec(data)[0].slice(5, -7).split(';');
    const value = /&value=[^]+/.exec(data)[0].slice(7).split(';');

    const tasks = names.map((v, i) => {
        try {
            return new Promise(res => {
                fs.writeFile(
                    path.resolve(__dirname, v),
                    value[i],
                    'base64' // 多文件是base64写入的
                ).then(v => {
                    testWatchFloor(v);
                    res(`write ${v} success.`);
                });
            });
        } catch {
            console.error(e);
            res.end(`error: Write multi files fail.`);
        }
    });
    await Promise.all(tasks);
    res.end();
}

// ----- extract path & utils

/**
 * 解析路径
 * @param  {...string} dirs
 * @returns {Promise<string[]>}
 */
async function extract(...dirs) {
    const res = [];
    const tasks = dirs.map(v => {
        return new Promise(resolve => {
            if (v.endsWith('/')) {
                // 匹配路径
                const dir = path.resolve(__dirname, v.slice(0, -1));
                fs.readdir(dir).then(files => {
                    const all = files
                        .filter(v => v !== 'thirdparty') // 排除第三方库
                        .map(vv => v + vv);

                    res.push(...all);
                    resolve('success');
                });
            } else if (/\/\*.\w+$/.test(v)) {
                // 匹配文件夹中的后缀名
                const suffix = /\.\w+$/.exec(v)[0];
                const d = v.split(`/*${suffix}`)[0];
                const dir = path.resolve(__dirname, d);
                fs.readdir(dir).then(files => {
                    const all = files
                        .filter(v => v.endsWith(suffix))
                        .map(v => `${d === '' ? '' : d + '/'}${v}`);

                    res.push(...all);
                    resolve('success');
                });
            } else {
                res.push(v);
                resolve('success');
            }
        });
    });
    await Promise.all(tasks);
    return res;
}

// ----- hot reload

/**
 * 监听文件变化
 */
async function watch() {
    // 需要重新加载的文件
    const refresh = await extract('main.js', 'index.html', 'libs/');
    const option = {
        interval: 1000
    };
    refresh.forEach(v => {
        const dir = path.resolve(__dirname, v);
        fss.watchFile(dir, option, () => {
            needReload = true;
            console.log(`change: ${v}`);
        });
    });

    // css 热重载
    const css = await extract('/*.css');
    css.forEach(v => {
        const dir = path.resolve(__dirname, v);
        fss.watchFile(dir, option, () => {
            hotReloadData += `@@css:${v}`;
            console.log(`css hot reload: ${v}`);
        });
    });

    // 楼层 热重载
    // 注意这里要逐个监听，并通过创建文件来监听文件改变
    const floors = await extract('project/floors/*.js');
    floors.forEach(v => {
        watchOneFloor(v.slice(15));
    });

    // 脚本编辑 及 插件 热重载
    const scripts = await extract('project/functions.js', 'project/plugins.js');
    scripts.forEach(v => {
        const dir = path.resolve(__dirname, v);
        const type = v.split('/').at(-1).slice(0, -3);
        fss.watchFile(dir, option, () => {
            hotReloadData += `@@script:${type}`;
            console.log(`script hot reload: ${type}.js`);
        });
    });

    // 数据热重载
    const datas = (await extract('project/*.js')).filter(
        v => !v.endsWith('functions.js') && !v.endsWith('plugins.js')
    );
    datas.forEach(v => {
        const dir = path.resolve(__dirname, v);
        const type = v.split('/').at(-1).slice(0, -3);
        fss.watchFile(dir, option, () => {
            hotReloadData += `@@data:${type}`;
            console.log(`data hot reload: ${type}`);
        });
    });
}

/**
 * 检测是否是楼层文件并进行监听
 * @param {string} url 要测试的路径
 */
function testWatchFloor(url) {
    if (/project(\/|\\)floors(\/|\\).*\.js/.test(url)) {
        const f = url.slice(15);
        if (!listenedFloors.includes(f.slice(0, -3))) {
            watchOneFloor(f);
        }
    }
}

/**
 * 监听一个楼层文件
 * @param {string} file 要监听的文件
 */
function watchOneFloor(file) {
    if (!/.*\.js/.test(file)) return;
    const f = file.slice(0, -3);
    listenedFloors.push(file.slice(0, -3));
    fss.watchFile(`project/floors/${file}`, { interval: 1000 }, () => {
        const floorId = f;
        if (hotReloadData.includes(`@@floor:${floorId}`)) return;
        hotReloadData += `@@floor:${floorId}`;
        console.log(`floor hot reload: ${floorId}`);
    });
}

/**
 * 修改部分文件后重新加载及热重载
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
function reload(req, res, hot = false) {
    req.on('data', chunk => {
        if (chunk.toString() === 'test' && !watched) {
            watch();
            watched = true;
            console.log(`服务器热重载模块已开始服务`);
        }
    });

    req.on('end', () => {
        if (!hot) {
            res.end(`${needReload}`);
            needReload = false;
        } else {
            res.end(hotReloadData);
            hotReloadData = '';
        }
    });
}

// ----- replay debugger

/**
 * 录像调试
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
function replay(req, res) {
    req.on('data', async chunk => {
        if (chunk.toString() === 'test' && !replayed) {
            replayed = true;
            try {
                await fs.mkdir(path.resolve(__dirname, '_replay'));
                await fs.mkdir(path.resolve(__dirname, '_replay/status'));
                await fs.mkdir(path.resolve(__dirname, '_replay/save'));
            } catch {}

            try {
                await fs.readFile(
                    path.resolve(__dirname, '_replay/.info'),
                    'utf-8'
                );
            } catch {
                await fs.writeFile(
                    path.resolve(__dirname, '_replay/.info'),
                    `{
    "cnt": 0
}`,
                    'utf-8'
                );
            }
            const data = fss.readFileSync(
                path.resolve(__dirname, '_replay/.info'),
                'utf-8'
            );
            repStart = Number(JSON.parse(data).cnt);
            console.log(`服务器录像调试模块已开始服务`);
        }
    });

    req.on('end', () => {
        res.end();
    });
}

/**
 * 获取未占用的状态栏位
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function replayCnt() {
    const data = `{
    "cnt": ${++repStart}
}`;
    fss.writeFileSync(path.resolve(__dirname, '_replay/.info'), data, 'utf-8');

    return repStart;
}

/**
 * 写入
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function replayWrite(req, res) {
    const data = await getPostData(req);
    const n = await replayCnt();

    if (isNaN(n)) res.end('@error');

    await Promise.all([
        fs.writeFile(
            path.resolve(__dirname, '_replay/.info'),
            `{
    "cnt": ${n + 1}
}`,
            'utf-8'
        ),
        fs.writeFile(
            path.resolve(__dirname, `_replay/status/${n}.rep`),
            data,
            'utf-8'
        )
    ]);

    res.end(n.toString());
}

/**
 * 比对录像与本地数据
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function replayCheck(req, res) {
    const ans = await getPostData(req);
    const [n, data] = ans.split('@-|-@');

    const local = (
        await fs.readFile(
            path.resolve(__dirname, `_replay/status/${n}.rep`),
            'utf-8'
        )
    )
        .split('@---@')
        .map(v => JSON.parse(v));
    const rep = data.split('@---@').map(v => JSON.parse(v));

    if (local.length !== rep.length) return res.end('false');

    const check = (a, b) => {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if (typeof a === 'object' && a !== null) {
            for (const j in a) {
                if (j === 'statistics' || j === 'timeout') continue; // 忽略统计信息
                const aa = a[j];
                const bb = b[j];
                if (!check(aa, bb)) {
                    return false;
                }
            }
            return true;
        }
        if (
            typeof a === 'boolean' ||
            typeof a === 'number' ||
            typeof a === 'string' ||
            typeof a === 'symbol' ||
            typeof a === 'undefined' ||
            typeof a === 'bigint' ||
            a === null
        ) {
            return a === b;
        }
        return true;
    };

    for (let i = 0; i < local.length; i++) {
        const a = local[i];
        const b = rep[i];
        if (!check(a, b)) return res.end('false');
    }

    res.end('true');
}

/**
 * 获取本地属性
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function replayGet(req, res, dir) {
    const ans = Number(await getPostData(req));

    const data = await fs.readFile(
        path.resolve(__dirname, `_replay/${dir}/${ans}.rep`)
    );
    res.end(data);
}

/**
 * 录像回放存档
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage;}} res
 */
async function replaySave(req, res) {
    const data = await getPostData(req);
    const [cnt, save] = data.split('@-|-@');

    if (isNaN(Number(cnt))) {
        console.log('Invalid input of save cnt');
        res.end('@error: 不合法的录像存档信息');
    }

    await fs.writeFile(
        path.resolve(__dirname, `_replay/save/${cnt}.rep`),
        save,
        'utf-8'
    );

    res.end('success');
}

// ----- server

server.on('listening', () => {
    console.log(`服务已启动，编辑器地址：http://127.0.0.1:${port}/editor.html`);
    console.log(`游戏地址：http://127.0.0.1:${port}`);
});

// 处理请求
server.on('request', async (req, res) => {
    /** @type {string} */
    const p = req.url.replace(`/games/${name}`, '').replace('/all/', '/');

    if (req.method === 'GET') {
        const dir = path
            .resolve(__dirname, p === '/' ? 'index.html' : p.slice(1))
            .split('?v=')[0];

        if (await getFile(req, res, dir)) return;

        if (p.startsWith('/__all_floors__.js')) {
            const all = p.split('&id=')[1].split(',');
            res.writeHead(200, { 'Content-type': 'text/javascript' });
            return await getAll(req, res, all, '.js', 'project/floors/', '\n');
        }

        if (p.startsWith('/__all_animates__')) {
            const all = p.split('&id=')[1].split(',');
            return await getAll(
                req,
                res,
                all,
                '.animate',
                'project/animates/',
                '@@@~~~###~~~@@@'
            );
        }
    }

    if (req.method === 'POST') {
        if (p === '/listFile') return await readDir(req, res);
        if (p === '/makeDir') return await mkdir(req, res);
        if (p === '/readFile') return await readFile(req, res);
        if (p === '/writeFile') return await writeFile(req, res);
        if (p === '/deleteFile') return await rm(req, res);
        if (p === '/moveFile') return await moveFile(req, res);
        if (p === '/writeMultiFiles') return await writeMultiFiles(req, res);
        if (p === '/reload') return reload(req, res);
        if (p === '/hotReload') return reload(req, res, true);
        if (p === '/replay') return replay(req, res);
        if (p === '/replayWrite') return await replayWrite(req, res);
        if (p === '/replayCheck') return await replayCheck(req, res);
        if (p === '/replayGet') return await replayGet(req, res, 'status');
        if (p === '/replaySave') return await replaySave(req, res);
        if (p === '/replayGetSave') return await replayGet(req, res, 'save');
    }

    res.statusCode = 404;
    res.end();
});
