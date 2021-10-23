/*
hero.ts负责勇士相关内容
*/
import { core } from './core';

type Status = {
    id: string,
    img: string,
    hp: number | bigint,
    atk: number | bigint,
    def: number | bigint,
    mana?: number | bigint,
    hpmax?: number | bigint,
    manamax?: number | bigint,
    graph?: string
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
    constructor(status: Status) {
        for (let one in status) {
            this[one] = status[one];
        }
        this.x = 0;
        this.y = 0;
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