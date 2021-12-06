/*
view.ts负责视角相关内容
*/
import { core } from './core';
import { Hero } from './hero';

interface ViewEvent {
    locationset: LocationEvent
    follow: FollowEvent
}

interface LocationEvent {

}

interface FollowEvent {

}

export class View {
    x: number;
    y: number;
    scale: number;
    id: string;
    width: number;
    height: number;
    followHero: Hero;
    listener: { [key: string]: Function[] };

    constructor(id: string, x: number, y: number, scale: number) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.id = id;
        this.listener = {
            locationset: []
        };
        this.calPixel();
    }

    /** 重新定位视角 */
    relocate(x: number, y: number): View {
        this.x = x;
        this.y = y;
        x += this.width * this.anchor.x;
        y += this.height * this.anchor.y;
        if (core.status.nowView.id === this.id) core.containers.map.position.set(-x, -y);
        return this;
    }

    /** 重新修改视角的视野范围 */
    resize(scale: number): View {
        this.scale = scale;
        if (core.status.nowView.id === this.id) {
            if (this.id === 'main') this.center();
            let ax = this.width * this.anchor.x;
            let ay = this.height * this.anchor.y;
            if (!core.containers.map) return;
            core.containers.map.scale.set(scale);
            core.containers.map.position.set(-this.x - ax, -this.y - ay);
        }
        return this;
    }

    /** 视角的锚点 */
    anchor: {
        x: number,
        y: number,
        /** 设置视角的锚点 参数为小数形式 比如0.5就表示中心的位置 1就表示最靠右或最靠下的位置
         * @param keep 是否保持视角位置不动
         */
        set: (x?: number, y?: number, keep?: boolean) => View
    } = {
            x: 0,
            y: 0,
            set: (x: number = this.anchor.x, y: number = this.anchor.y, keep?: boolean) => {
                this.calPixel();
                let dx = x - this.anchor.x;
                let dy = y - this.anchor.y;
                if (keep) {
                    this.x -= dx * this.width;
                    this.y -= dy * this.height;
                }
                this.anchor.x = x;
                this.anchor.y = y;
                this.relocate(this.x, this.y);
                return this;
            }
        };

    /** 切换成该视角 */
    to(redraw?: boolean): View {
        core.status.nowView = this;
        if (redraw) if (core.status.thisMap) core.status.thisMap.draw(this);
        if (core.containers.map) this.relocate(this.x, this.y).resize(this.scale).anchor.set();
        return this;
    }

    /** 切换视角至以勇士为中心 */
    center(hero: string | Hero = core.status.nowHero): View {
        // 我已经看不懂了...
        if (!(hero instanceof Hero)) hero = core.status.hero[hero];
        if (!hero) return this;
        this.calPixel();
        let x = 0;
        let y = 0;
        let uw = core.status.thisMap.unit_width;
        let uh = core.status.thisMap.unit_height;
        let dw = core.status.thisMap.width * uw;
        let dh = core.status.thisMap.height * uh;
        let ax = this.width * this.anchor.x;
        let ay = this.width * this.anchor.y;
        // 地图可以在视角内塞下
        if (dw < this.width) x = (-this.width / 2 + dw / 2 + ax) * this.scale;
        else { // 塞不下
            x = hero.x * uw + uw / 2 - this.width / 2 - ax;
            x *= this.scale;
            if (x < -ax) x = -ax;
            if (x / this.scale > dw - this.width - ax) x = (dw - ax - this.width) * this.scale;
        }
        // 同上
        if (dh < this.height) y = (-this.height / 2 + dh / 2 + ay) * this.scale;
        else {
            y = hero.y * uh + uh / 2 - this.height / 2 - ay;
            y *= this.scale
            if (y < -ay) y = -ay;
            if (y / this.scale > dh - this.height - ay) y = (dh - ay - this.height) * this.scale;
        }
        this.relocate(x, y);
        return this;
    }

    /** 跟随勇士时以勇士像素位置居中 */
    center2(hero: string | Hero = core.status.nowHero): View {
        if (!(hero instanceof Hero)) hero = core.status.hero[hero];
        if (!hero) return this;
        let x = 0;
        let y = 0;
        let uw = core.status.thisMap.unit_width;
        let uh = core.status.thisMap.unit_height;
        let dw = core.status.thisMap.width * uw;
        let dh = core.status.thisMap.height * uh;
        let ax = this.width * this.anchor.x;
        let ay = this.width * this.anchor.y;
        // 地图可以在视角内塞下
        if (dw < this.width) x = (-this.width / 2 + dw / 2 + ax) * this.scale;
        else { // 塞不下
            x = hero.createOwnContainer().x + uw / 2 - this.width / 2 - ax;
            x *= this.scale;
            if (x < -ax) x = -ax;
            if (x / this.scale > dw - this.width - ax) x = (dw - ax - this.width) * this.scale;
        }
        // 同上
        if (dh < this.height) y = (-this.height / 2 + dh / 2 + ay) * this.scale;
        else {
            y = hero.createOwnContainer().y + uh / 2 - this.height / 2 - ay;
            y *= this.scale;
            if (y < -ay) y = -ay;
            if (y / this.scale > dh - this.height - ay) y = (dh - ay - this.height) * this.scale;
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

    /** 跟随某个勇士 */
    follow(hero: string | Hero): View {
        if (!(hero instanceof Hero)) hero = core.status.hero[hero];
        if (!hero) return;
        this.followHero = hero;
        hero.followers.push(this);
        return this;
    }

    /** 取消跟随某个勇士 */
    unfollow(hero: string | Hero): View {
        if (!(hero instanceof Hero)) hero = core.status.hero[hero];
        if (!hero) return;
        this.followHero = void 0;
        hero.followers = hero.followers.filter(v => v.id !== this.id);
        return this;
    }

    /** 给视角添加事件监听器 */
    addEventListener<K extends keyof ViewEvent>(event: K, func: (this: View, ev: ViewEvent[K]) => void): View {
        this.removeEventListener(func);
        this.listener[event].push(func);
        return this;
    }

    /** 移除事件监听器 */
    removeEventListener(listener: Function): View {
        for (let one in this.listener) {
            let l = this.listener[one];
            l = l.filter(f => f !== listener);
        }
        return this;
    }

    /** 执行事件监听器的内容 */
    private listen<K extends keyof ViewEvent>(event: K, ev: ViewEvent[K]): void {
        this.listener[event].forEach(f => f.call(this, ev));
    }
}

/**
 * 创建一个新的视角，不会切换至该视角，视角会存进core.status.views
 * @param id 视角id，不能是main
 */
export function createView(id: string, x: number, y: number, scale: number): View | void {
    if (id === 'main') return console.error('视角名称不能是main！');
    let view = new View(id, x, y, scale);
    return core.status.views[id] = view;
}