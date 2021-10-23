/*
view.ts负责视角相关内容
*/
import { core } from './core';

export class View {
    x: number;
    y: number;
    scale: number;
    id: string;
    width: number;
    height: number;

    constructor(id: string, x: number, y: number, scale: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.id = id;
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

    /** 切换视角至以勇士为中心 */
    center(): View {
        let hero = core.status.nowHero;
        if (!hero) return;
        this.calPixel();
        let x = 0;
        let y = 0;
        if (core.status.thisMap.width * core.__UNIT_WIDTH__ > this.width) x = -this.width / 2;
        else {
            x = core.status.nowHero.x * core.__UNIT_WIDTH__ - this.width / 2;
            if (x < 0) x = 0;
        }
        if (core.status.thisMap.height * core.__UNIT_HEIGHT__ > this.height) y = -this.height / 2;
        else {
            y = core.status.nowHero.y * core.__UNIT_HEIGHT__ - this.height / 2;
            if (y < 0) y = 0;
        }
        this.relocate(x, y);
        return this;
    }

    /** 计算视角的像素长宽 */
    calPixel(): View {
        this.width = 1000 / this.scale;
        this.height = 1000 / core.aspect / this.scale;
        return this;
    }
}

/**
 * 创建一个新的视角，不会切换至该视角
 * @param id 视角id，不能是main
 */
export function createView(id: string, x: number, y: number, scale: number): View | void {
    if (id === 'main') return console.error('视角名称不能是main！');
    let view = new View(id, x, y, scale);
    return core.status.views[id] = view;
}