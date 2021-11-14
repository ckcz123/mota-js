/*
hero.ts负责勇士相关内容
*/
import { core } from './core';
import * as PIXI from 'pixi.js-legacy';
import { View } from './view';
import * as utils from './utils';

type Status = {
    id: string,
    img: string,
    hp: number | bigint,
    atk: number | bigint,
    def: number | bigint,
    aspect?: string,
    mana?: number | bigint,
    hpmax?: number | bigint,
    manamax?: number | bigint,
    graph?: string,
    floor?: string,
    dir?: 'left' | 'right' | 'up' | 'down',
    autoScale?: boolean
}

interface HeroEvent {
    movingstart: MoveEvent
    movingend: MoveEvent
    moving: MoveEvent
    animationstart: AnimationEvent
    animationend: AnimationEvent
    statuschange: StatusEvent
    turn: LocationEvent
    locationset: LocationEvent
    draw: DrawEvent
    jumpstart: JumpEvent
    jumpend: JumpEvent
}

interface LocationEvent {
    readonly dir: 'left' | 'right' | 'up' | 'down'
    readonly x: number
    readonly y: number
    readonly toDir: 'left' | 'right' | 'up' | 'down'
    readonly toX: number
    readonly toY: number
}

interface MoveEvent extends LocationEvent {
    readonly speed: number
    readonly steps: string[]
}

interface JumpEvent extends LocationEvent {

}

interface AnimationEvent {

}

interface StatusEvent {

}

interface DrawEvent {

}

export class Hero {
    id: string;
    img: string;
    hp: number | bigint;
    atk: number | bigint;
    def: number | bigint;
    mana: number | bigint;
    hpmax: number | bigint;
    manamax: number | bigint;
    graph: string;
    x: number;
    y: number;
    dir: 'left' | 'right' | 'up' | 'down';
    floor: string;
    aspect: string;
    autoScale: boolean;
    /** 正在移动 */
    moving: boolean;
    followers: View[];
    /** 专属container */
    container: PIXI.Container;
    listener: { [key: string]: Function[] };
    data: {
        /** 单位格的长宽 */
        unit: {
            width: number
            height: number
        }
        /** 图片的长 */
        width: number
        /** 图片的宽 */
        height: number
        rects: PIXI.Rectangle[]
    }

    constructor(status: Status) {
        for (let one in status) {
            this[one] = status[one];
        }
        this.x = 0;
        this.y = 0;
        this.dir = status.dir || 'down';
        this.floor = status.floor || (core.status.thisMap || {}).floorId || 'none';
        this.aspect = status.aspect || '4x4';
        this.graph = status.graph || 'hero.png';
        this.data = {
            unit: {
                width: 0,
                height: 0
            },
            width: 0,
            height: 0,
            rects: []
        };
        this.autoScale = status.autoScale || false;
        this.moving = false;
        this.followers = [];
    }

    /** 设置属性 */
    setStatus(status: string, value: any): Hero {
        if (typeof value === 'number' && value > Number.MAX_SAFE_INTEGER) value = BigInt(value);
        this[status] = value;
        return this;
    }

    /** 增减属性 */
    addStatus(status: string, delta: number | bigint): Hero {
        if (typeof this[status] === 'bigint') delta = BigInt(delta);
        if (typeof this[status] === 'number' && this[status] + delta > Number.MAX_SAFE_INTEGER) {
            this[status] = BigInt(this[status]);
            delta = BigInt(delta);
        }
        this[status] += delta;
        return this;
    }

    /** 切换行走图，注意两个勇士的行走图不能一样，否则两个勇士的动画将会同步233 */
    changeGraph(graph: string): Hero {
        this.graph = graph;
        return this;
    }

    /** 转向 */
    turn(dir?: "left" | "right" | "up" | "down"): Hero {
        let oriDir = this.dir;
        // 默认转向只能顺时针转动...
        if (!dir) {
            switch (this.dir) {
                case 'down':
                    this.dir = 'left';
                    break;
                case 'left':
                    this.dir = 'up';
                    break;
                case 'up':
                    this.dir = 'right';
                    break;
                case 'right':
                    this.dir = 'down';
                    break;
            }
            this.draw();
        } else {
            this.dir = dir;
        }
        // ----- listen turn ----- //
        const ev: LocationEvent = {
            dir: oriDir, x: this.x, y: this.y,
            toDir: this.dir, toX: this.x, toY: this.y
        };
        this.listen('turn', ev);
        // ----- listen end ----- //
        return this;
    }

    /** 设置位置 */
    setLoc(x?: number, y?: number): Hero {
        let ox = this.x;
        let oy = this.y;
        if (x) this.x = x;
        if (y) this.y = y;
        this.resetContainerLoc().setFollowers();
        // ----- listen locationset ----- //
        const ev: LocationEvent = {
            dir: this.dir, x: ox, y: oy,
            toDir: this.dir, toX: this.x, toY: this.y
        };
        this.listen('locationset', ev);
        // ----- listen end ----- //
        return this;
    }

    /** 设置container的位置 */
    resetContainerLoc(): Hero {
        let container = this.createOwnContainer();
        let floor = core.status.maps[this.floor];
        container.x = this.x * floor.unit_width;
        container.y = this.y * floor.unit_height;
        return this;
    }

    /** 根据方向获取行数 */
    getLineByDir(dir: string = this.dir): number {
        if (dir.endsWith('ward')) dir = this.dir;
        if (dir === 'down') return 1;
        if (dir === 'left') return 2;
        if (dir === 'right') return 3;
        if (dir === 'up') return 4;
    }

    /** 解析素材 */
    private extractGraph(): Hero {
        if (this.data.width !== 0) return this;
        let [w, h] = this.aspect.split('x');
        let img = core.material.images[this.graph];
        this.data.unit.width = img.width / parseInt(w);
        this.data.unit.height = img.height / parseInt(h);
        this.data.width = parseInt(w);
        this.data.height = parseInt(h);
        return this;
    }

    /** 分割成多个rectangle */
    private generateRect(): Hero {
        if (this.data.rects.length !== 0) return this;
        let w = this.data.unit.width;
        let h = this.data.unit.height;
        for (let y = 0; y < this.data.height; y++) {
            for (let x = 0; x < this.data.width; x++) {
                this.data.rects.push(new PIXI.Rectangle(x * w, y * h, w, h));
            }
        }
        return this;
    }

    /** 绘制勇士 */
    draw(): Hero {
        let container = this.createOwnContainer();
        this.extractGraph().generateRect().resetContainerLoc();
        let sprite = container.getChildByName('hero');
        if (sprite) sprite.destroy();
        // 获得texture
        let line = this.getLineByDir();
        let img = core.material.images[this.graph];
        let texture = PIXI.utils.TextureCache[this.graph];
        if (!texture) {
            texture = PIXI.Texture.from(img);
            PIXI.Texture.addToCache(texture, this.graph);
        }
        let w = this.data.unit.width;
        let rect = this.data.rects[(line - 1) * 4];
        texture.frame = rect;
        // 创建sprite
        let floor = core.status.maps[this.floor];
        let width = floor.unit_width;
        let height = floor.unit_height;
        let s = new PIXI.Sprite(texture);
        s.anchor.set(0.5, 1);
        s.position.set(width / 2, height);
        s.name = 'hero';
        // 缩放
        if (this.autoScale) s.scale.set(width / w);
        container.addChild(s);
        return this;
    }

    /** 创建专属container */
    createOwnContainer(): PIXI.Container {
        if (!this.container) {
            let container = new PIXI.Container();
            this.container = container;
            container.zIndex = 25;
            core.containers.map.addChild(container);
            return container;
        } else {
            return this.container;
        }
    }

    /** 设置跟随视角 */
    setFollowers(): Hero {
        this.followers.forEach(v => v.center());
        return this;
    }

    /** 移动勇士 */
    move(route: ('left' | 'right' | 'up' | 'down' | 'forward' | 'backward')[], speed: number = core.settings.heroSpeed): Hero {
        if (this.moving) return;
        this.moving = true;
        let start = 0;
        let now = 0;
        let animation = 1;
        let texture = PIXI.utils.TextureCache[this.graph];
        let container = this.createOwnContainer();
        let sprite = container.getChildByName('hero');
        let nowIndex = (this.getLineByDir(route[0]) - 1) * this.data.width;
        let [nx, ny] = this.nextStep(route[0]);
        let floor = core.status.maps[this.floor];
        if (!(sprite instanceof PIXI.Sprite)) return;
        let oriDir = this.dir;
        this.turn((route[0] === 'forward' || route[0] === 'backward') ? this.dir : route[0]);
        sprite.texture = texture;
        texture.frame = this.data.rects[nowIndex];

        // ----- listen movingstart ----- //
        const ev: MoveEvent = {
            speed,
            x: this.x, y: this.y, dir: oriDir,
            toX: nx, toY: ny, toDir: this.dir,
            steps: route
        };
        this.listen('movingstart', ev);
        // ----- listen end ----- //

        /** 执行下一帧动画 */
        const next = (step: 'left' | 'right' | 'up' | 'down' | 'forward' | 'backward') => {
            let next = 0;
            if (step === 'forward' || step === 'backward') next = this.getNextFrame(nowIndex, this.dir);
            else next = this.getNextFrame(nowIndex, step);
            texture.frame = this.data.rects[next];
            nowIndex = next;
            animation++;
        }

        const ticker = () => {
            // 移动
            container.x += ((nx - this.x) * floor.unit_width) / (speed / 16.6);
            container.y += ((ny - this.y) * floor.unit_height) / (speed / 16.6);
            start += 16.6;
            if (start / animation > speed * 1.5 && this.isCurrent()) {
                // 执行动画
                let step = route[now];
                next(step);
            }
            if (start - (now * speed) > speed) {
                now++;
                // 到达下一格
                let step = route[now];
                let oriX = this.x;
                let oriY = this.y;
                let oriDir = this.dir;
                this.setLoc(nx, ny);
                if (!step) {
                    // ----- listen movingend ----- //
                    const ev: MoveEvent = {
                        speed,
                        x: oriX, y: oriY, dir: this.dir,
                        toX: nx, toY: ny, toDir: this.dir,
                        steps: route
                    };
                    this.listen('movingend', ev);
                    // ----- listen end ----- //
                    core.pixi.game.ticker.remove(ticker);
                    this.moving = false;
                    if (this.isCurrent()) this.draw();
                    return;
                }
                next(step);
                // ----- listen moving ----- //
                const ev: MoveEvent = {
                    speed,
                    x: oriX, y: oriY, dir: oriDir,
                    toX: nx, toY: ny, toDir: this.dir,
                    steps: route
                };
                this.listen('moving', ev);
                // ----- listen end ----- //
                [nx, ny] = this.nextStep(step);
            }
        }
        core.pixi.game.ticker.add(ticker);
        return this;
    }

    /** 获取下一帧索引 */
    private getNextFrame(index: number, dir: 'left' | 'right' | 'up' | 'down'): number {
        let i = 0;
        if (dir !== this.dir) {
            // 需要转向
            this.turn(dir);
            i = (this.getLineByDir(dir) - 1) * this.data.width;
        } else {
            // 不需要转向
            let line = this.getLineByDir(dir);
            if (index + 1 >= line * this.data.width) i = (line - 1) * this.data.width;
            else i = index + 1;
        }
        return i;
    }

    /** 获取面前n个格子的坐标 */
    next(n: number = 1): [number, number] {
        let [x, y] = [this.x, this.y];
        if (this.dir === 'left') x -= n;
        if (this.dir === 'right') x += n;
        if (this.dir === 'up') y -= n;
        if (this.dir === 'down') y += n;
        return [x, y];
    }

    /** 获取下一步的坐标 */
    private nextStep(step: 'left' | 'right' | 'up' | 'down' | 'forward' | 'backward'): [number, number] {
        let loc: [number, number];
        if (step === 'forward') loc = this.next();
        else if (step === 'backward') loc = this.next(-1);
        else loc = [this.x + utils.dirs[step][0], this.y + utils.dirs[step][1]];
        return loc;
    }

    /** 是否是当前勇士 */
    isCurrent(): boolean {
        return core.status.nowHero.id === this.id;
    }

    /** 为勇士添加事件监听器 */
    addListener<K extends keyof HeroEvent>(event: K, listener: (this: Hero, ev: HeroEvent[K]) => void): Hero {
        this.removeListener(listener);
        this.listener[event].push(listener);
        return this;
    }

    /** 移除事件监听器 */
    removeListener(listener: Function): Hero {
        for (let one in this.listener) {
            let l = this.listener[one];
            l = l.filter(f => f !== listener);
        }
        return this;
    }

    /** 执行事件监听器的内容 */
    private listen<K extends keyof HeroEvent>(event: K, ev: HeroEvent[K]): void {
        this.listener[event].forEach(f => f.call(this, ev));
    }
}

/** 创建一个新的勇士 */
export function createHero(id: string, status: Status): Hero {
    deleteHero(id);
    status.id = id;
    let hero = new Hero(status);
    core.status.hero[id] = hero;
    return hero;
}

/** 删除一个勇士 */
export function deleteHero(id: string): void {
    if (!core.status.hero[id]) return;
    delete core.status.hero[id];
}

/** 切换勇士 */
export function changeHero(id: string): Hero {
    if (core.status.hero[id]) {
        return core.status.nowHero = core.status.hero[id];
    }
}