/*
block.ts负责图块相关内容
*/
import { core } from './core';
import * as enemy from './enemy';
import * as utils from './utils'
import * as PIXI from 'pixi.js-legacy';
import * as view from './view';

export class Block {
    data: enemy.Enemy;
    x: number;
    y: number;
    graph: string;
    cls: string;
    node: {
        now: number
        img: string
        [key: number]: PIXI.Rectangle
    }

    constructor(unit: enemy.Enemy, x: number, y: number) {
        if (unit instanceof enemy.Enemy) {
            // 图块是怪物
            this.data = utils.clone(unit);
            this.x = x;
            this.y = y;
            this.graph = core.dict[unit.number].img;
            this.cls = core.dict[unit.number].cls;
        }
    }

    /** 解析graph */
    extractGraph(): Block {
        let s = this.graph.split('.');
        let img = s[0] + '.' + s[s.length - 1];
        // 获取xy位置及图片的宽高数
        let x = /@x[0-9]+@/.exec(this.graph)[0].match(/[0-9]+/)[0];
        let y = /@y[0-9]+./.exec(this.graph)[0].match(/[0-9]+/)[0];
        let aspect = /.[0-9]+x[0-9]+@/.exec(this.graph)[0].match(/[0-9]+/g);
        // 计算每一格的长宽
        let im = core.material[this.cls][img];
        let w = ~~(im.width / parseInt(aspect[0]));
        let h = ~~(im.height / parseInt(aspect[1]));
        // 由字符串解析出每一帧的位置
        if (x.length !== y.length && x.length !== 1 && y.length !== 1) console.error('图片索引格式不正确！');
        let tar = x.length > y.length ? x.length : y.length;
        this.node = { img: img, now: 0 };
        for (let i = 0; i < tar; i++) {
            // 横向位置 纵向位置
            let xx = (parseInt(x[i] ? x[i] : x[0]) - 1) * w;
            let yy = (parseInt(y[i] ? y[i] : y[0]) - 1) * h;
            let rect = new PIXI.Rectangle(xx, yy, w, h);
            this.node[i] = rect;
        }
        return this;
    }

    /** 生成texture */
    generateTexture(): Block {
        this.extractGraph();
        let texture = PIXI.utils.TextureCache[this.graph];
        if (!texture) {
            let texture = PIXI.Texture.from(core.material[this.cls][this.node.img]);
            if (!PIXI.utils.TextureCache[this.graph]) PIXI.Texture.addToCache(texture, this.graph);
        }
        return this;
    }

    /** 是否在视野范围内 */
    inView(view?: view.View): boolean {
        if (!view) view = core.status.views.main;
        let floor = core.status.thisMap;
        let dx = this.x * floor.unit_width - view.x - view.width * view.anchor.x;
        let dy = this.y * floor.unit_height - view.y - view.height * view.anchor.y;
        view.calPixel();
        return dx > -floor.unit_width && dy > -floor.unit_height && dx < view.width && dy < view.height;
    }
}