/*
hero.ts负责勇士相关内容
*/
import { core } from './core';
import * as PIXI from 'pixi.js-legacy';

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
    dir?: string,
    autoScale?: boolean
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
    dir: string;
    floor: string;
    aspect: string;
    autoScale: boolean;
    data: {
        unit: {
            width: number
            height: number
        }
        width: number
        height: number
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
            height: 0
        };
        this.autoScale = status.autoScale || false;
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

    /** 切换行走图 */
    changeGraph(graph: string): Hero {
        this.graph = graph;
        return this;
    }

    /** 转向 */
    turn(): Hero {
        // 转向只能顺时针转动...
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
        return this;
    }

    /** 设置位置 */
    setLoc(x?: number, y?: number): Hero {
        if (x) this.x = x;
        if (y) this.y = y;
        this.resetContainerLoc();
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
        if (dir === 'down') return 1;
        if (dir === 'left') return 2;
        if (dir === 'right') return 3;
        if (dir === 'up') return 4;
    }

    /** 解析素材 */
    extractGraph(): Hero {
        let [w, h] = this.aspect.split('x');
        let img = core.material.images[this.graph];
        this.data.unit.width = img.width / parseInt(w);
        this.data.unit.height = img.height / parseInt(h);
        this.data.width = parseInt(w);
        this.data.height = parseInt(h);
        return this;
    }

    /** 绘制勇士 */
    draw(): Hero {
        let container = this.createOwnContainer();
        this.extractGraph().resetContainerLoc();
        let sprite = container.getChildByName('hero');
        if (sprite) sprite.destroy();
        // 获得texture
        let line = this.getLineByDir();
        let img = core.material.images[this.graph];
        let texture = PIXI.Texture.from(img);
        let w = this.data.unit.width;
        let h = this.data.unit.height;
        let rect = new PIXI.Rectangle(0, (line - 1) * h, w, h);
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
        if (this.autoScale) s.scale.set(width / this.data.unit.width)
        container.addChild(s);
        return this;
    }

    /** 创建专属container */
    createOwnContainer(): PIXI.Container {
        if (!core.status.heroContainer[this.id]) {
            let container = new PIXI.Container();
            core.status.heroContainer[this.id] = container;
            container.zIndex = 25;
            core.containers.map.addChild(container);
            return container;
        } else {
            return core.status.heroContainer[this.id];
        }
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