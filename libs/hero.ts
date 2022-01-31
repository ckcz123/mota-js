/*
hero.ts负责勇士相关内容
*/
import { animate, core } from './core';
import * as PIXI from 'pixi.js-legacy';
import { View } from './view';
import * as utils from './utils';
import * as _ from 'lodash';

/** 方向 */
type Direction = 'left' | 'right' | 'up' | 'down';
/** 粗略方向 */
type RoughDir = 'left' | 'right' | 'up' | 'down' | 'forward' | 'backward'

type Status = {
    id: string,
    img: string,
    hp: number,
    atk: number,
    def: number,
    aspect?: string,
    mana?: number,
    hpmax?: number,
    manamax?: number,
    graph?: string,
    floor?: string,
    dir?: Direction,
    autoScale?: boolean
}

interface HeroEvent {
    movingstart: MoveEvent
    movingend: MoveEvent
    moving: MoveEvent
    animationstart: AnimationEvent
    animating: AnimationEvent
    statuschange: StatusEvent
    turn: LocationEvent
    locationset: LocationEvent
    draw: DrawEvent
    jumpstart: JumpEvent
    jumpend: JumpEvent
    shifting: ShiftEvent
}

export interface LocationEvent {
    readonly dir: Direction
    readonly x: number
    readonly y: number
    readonly toX: number
    readonly toY: number
}

export interface DrawEvent {
    readonly x: number
    readonly y: number
    readonly dir: Direction
    readonly line: number
    readonly index: number
    readonly rect: PIXI.Rectangle
    readonly texture: PIXI.Texture
}

export interface MoveEvent extends LocationEvent {
    readonly speed: number
}

export interface JumpEvent extends LocationEvent {

}

export interface AnimationEvent extends DrawEvent {
    readonly row: number
}

export interface StatusEvent {
    readonly before: any
    readonly after: any
    readonly status: string
}

export interface ShiftEvent {
    readonly px: number
    readonly py: number
    readonly dx: number
    readonly dy: number
}

export class Hero {
    id: string;
    img: string;
    hp: number;
    atk: number;
    def: number;
    mana: number;
    hpmax: number;
    manamax: number;
    graph: string;
    x: number;
    y: number;
    dir: Direction;
    floor: string;
    aspect: string;
    autoScale: boolean;
    /** 正在移动 */
    moving: boolean;
    followers: View[];
    /** 移动状态 */
    moveStatus: string
    /** 移动方向 */
    moveDir: Direction
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
        now?: number
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
        this.listener = {
            movingstart: [],
            movingend: [],
            moving: [],
            animationstart: [],
            animating: [],
            animationend: [],
            statuschange: [],
            turn: [],
            locationset: [],
            draw: [],
            jumpstart: [],
            jumpend: [],
            shifting: []
        }
        this.moveStatus = 'none';
    }

    /** 设置属性 */
    setStatus(status: string, value: any): Hero {
        let before = _.cloneDeep(this[status]);
        this[status] = value;
        // ----- listen statuschange ----- //
        const ev: StatusEvent = { before, after: value, status };
        this.listen('statuschange', ev);
        // ----- listen end ----- //
        return this;
    }

    /** 增减属性 */
    addStatus(status: string, delta: number): Hero {
        let before = _.cloneDeep(this[status]);
        this[status] += delta;
        // ----- listen statuschange ----- //
        const ev: StatusEvent = { before, after: this[status], status };
        this.listen('statuschange', ev);
        // ----- listen end ----- //
        return this;
    }

    /** 切换行走图，注意两个勇士的行走图不能一样，否则两个勇士的动画将会同步233 */
    changeGraph(graph: string): Hero {
        this.graph = graph;
        this.draw();
        return this;
    }

    /** 转向 */
    turn(dir?: Direction): Hero {
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
            this.draw();
        }
        // ----- listen turn ----- //
        const ev: LocationEvent = { dir: oriDir, x: this.x, y: this.y, toX: this.x, toY: this.y };
        this.listen('turn', ev);
        // ----- listen end ----- //
        return this;
    }

    /** 设置位置 */
    setLoc(x?: number, y?: number): Hero {
        let ox = this.x;
        let oy = this.y;
        if (x !== void 0) this.x = x;
        if (y !== void 0) this.y = y;
        this.resetContainerLoc().setFollowers();
        // ----- listen locationset ----- //
        const ev: LocationEvent = { dir: this.dir, x: ox, y: oy, toX: this.x, toY: this.y };
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
    getLineByDir(dir: RoughDir = this.dir): number {
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
        // ----- listen draw ----- //
        const ev: DrawEvent = {
            x: this.x, y: this.y, dir: this.dir, line, rect, texture, index: (line - 1) * 4
        };
        this.listen('draw', ev);
        // ----- listen end ----- //
        return this;
    }

    /** 创建专属container */
    createOwnContainer(): PIXI.Container {
        if (!this.container) {
            let container = new PIXI.Container();
            this.container = container;
            container.zIndex = 35;
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

    /** 解析方向 */
    extractDir(dir: RoughDir): Direction {
        if (dir === 'forward') return this.dir;
        if (dir === 'backward') {
            switch (this.dir) {
                case 'left': return 'right';
                case 'right': return 'left';
                case 'up': return 'down';
                case 'down': return 'up';
            }
        }
        return dir;
    }

    /** 朝某个方向移动勇士 */
    move(dir: RoughDir, speed: number = core.settings.heroSpeed): Hero {
        if (this.moving) return this;
        this.moving = true;
        const direction = this.extractDir(dir);
        const [dx, dy] = [utils.dirs[direction][0], utils.dirs[direction][1]];
        if (!this.inThisMap()) { // 不在当前层，瞬移就行
            this.turn(dir === 'backward' ? this.dir : direction);
            if (core.status.maps[this.floor].canArrive(dx + this.x, dy + this.y))
                this.setLoc(dx + this.x, dy + this.y);
            this.moving = false;
            return;
        }
        const texture = PIXI.utils.TextureCache[this.graph];
        const container = this.createOwnContainer();
        const sprite = container.getChildByName('hero');
        const line = this.getLineByDir(dir);
        const floor = core.status.maps[this.floor];
        const v = 16.6 / speed * (dx !== 0 ? floor.unit_width : floor.unit_height);
        const [tx, ty] = [dx + this.x, dy + this.y]
        // 开始移动 先转向对应方向
        this.turn(dir === 'backward' ? this.dir : direction);
        // 判断是否可以通行
        if (!floor.canArrive(dx + this.x, dy + this.y)) {
            if (floor.inMap(tx, ty)) {
                floor.getBlock(tx, ty).trigger();
            }
            this.moving = false;
            return this;
        }
        // 移动函数
        let frames = 0;
        const total = Math.ceil((dx === 0 ? floor.unit_height : floor.unit_width) / v);
        const quarter = Math.floor(total / 2);
        const doMove = () => {
            container.x += dx * v;
            container.y += dy * v;
            frames++;
            // ----- listen shifting ----- //
            const ev: ShiftEvent = { px: container.x, py: container.y, dx, dy };
            this.listen('shifting', ev);
            // ----- listen end ----- //
            // 切换下一帧动画
            if (frames % quarter === 0) {
                const rectangle = this.getNextFrame(line);
                texture.frame = rectangle;
                // ----- listen animating ----- //
                const ev: AnimationEvent = {
                    row: this.data.now % this.data.width, line: Math.ceil(this.data.now / this.data.height),
                    index: this.data.now, x: this.x, y: this.y, dir: this.dir, rect: rectangle, texture
                }
                this.listen('animating', ev);
                // ----- listen end ----- //
            }
            // 停止移动
            if (frames + 1 === total) {
                core.pixi.game.ticker.remove(doMove);
                this.setLoc(tx, ty);
                this.moving = false;
                if (floor.block[floor.event][this.x + this.y]) {
                    floor.getBlock(this.x, this.y).trigger();
                }
                // ----- listen movingend ----- //
                const ev: MoveEvent = {
                    speed, dir: this.dir, x: this.x - dx, y: this.y - dy, toX: this.x, toY: this.y
                }
                this.listen('movingend', ev);
                // ----- listen end ----- //
                if (this.moveStatus === 'constant') return this.move(this.moveDir || 'forward', speed);
                this.data.now = (this.getLineByDir() - 1) * this.data.width;
                texture.frame = this.data.rects[this.data.now];
            }
        };
        core.pixi.game.ticker.add(doMove);
        return this;
    }

    /** 获取下一帧的rectangle */
    private getNextFrame(line: number = this.getLineByDir()): PIXI.Rectangle {
        if (!this.data.now || this.data.now % this.data.width === 0)
            this.data.now = this.data.width * (line - 1);
        let now = this.data.now;
        if ((now + 1) % this.data.width === 0) now -= this.data.width - 1;
        else now++;
        this.data.now = now;
        return this.data.rects[now];
    }

    /** 是否是当前勇士 */
    isCurrent(): boolean {
        return core.status.nowHero.id === this.id;
    }

    /** 是否在当前层 */
    inThisMap(): boolean {
        return core.status.thisMap.floorId === this.floor;
    }

    /** 为勇士添加事件监听器 */
    addEventListener<K extends keyof HeroEvent>(event: K, listener: (this: Hero, ev?: HeroEvent[K]) => void): Hero {
        this.removeEventListener(listener);
        this.listener[event].push(listener);
        return this;
    }

    /** 移除事件监听器 */
    removeEventListener(listener: Function): Hero {
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

    /** 添加操作监听器 */
    addActionListener(action: string, func: (...para: any[]) => void): Hero {
        this.createOwnContainer().addListener(action, func);
        return this;
    }

    /** 移除操作监听器 */
    removeActionListener(action: string, func: (...para: any[]) => void): Hero {
        this.createOwnContainer().removeListener(action, func);
        return this;
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