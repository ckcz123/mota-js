/*
hero.ts负责勇士相关内容
*/
import { core } from './core';

type Status = {
    id: string,
    img: string,
    hp: number,
    atk: number,
    def: number,
    mana: number,
    hpmax: number,
    manamax: number,
    graph: string
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
    constructor(status: Status) {
        for (let one in status) {
            this[one] = status[one];
        }
    }

    /** 设置属性 */
    setStatus(status: string, value: any): Hero {
        this[status] = value
        return this;
    }

    /** 增减属性 */
    addStatus(status: string, delta: number): Hero {
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
    core.status.hero[status.id] = hero;
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
        return core.status.hero.now = core.status.hero[id];
    }
}