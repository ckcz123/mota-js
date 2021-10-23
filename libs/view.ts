/*
view.ts负责视角相关内容
*/
import { core } from './core';

export class View {
    x: number;
    y: number;
    scale: number;
    constructor(x: number, y: number, scale: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }

    /** 重新定位视角 */
    relocate(x: number, y: number): View {
        this.x = x;
        this.y = y;
        return this;
    }

    /** 重新修改视角的视野范围 */
    resize(scale: number): View {
        this.scale = scale;
        return this;
    }

    /** 切换成该视角 */
    to(): View {
        return core.status.nowView = this;
    }
}

/**
 * 创建一个新的视角，不会切换至该视角
 * @param id 视角id，不能是main
 */
export function createView(id: string, x: number, y: number, scale: number): View | void {
    if (id === 'main') return console.error('视角名称不能是main！');
    let view = new View(x, y, scale);
    return core.status.views[id] = view;
}