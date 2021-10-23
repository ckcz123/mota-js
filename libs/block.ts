/*
block.ts负责图块相关内容
*/
import { core } from './core';
import * as enemy from './enemy';
import * as utils from './utils'
import * as PIXI from 'pixi.js-legacy';

export class Block {
    data: enemy.Enemy;
    x: number;
    y: number;
    graph: string;
    cls: string;
    node: {
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
        let img = s[0] + s[s.length - 1];
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
        this.node = { img: img };
        for (let i = 0; i < tar; i++) {
            // 横向位置 纵向位置
            let xx = parseInt(x[i] ? x[i] : x[0]) * w;
            let yy = parseInt(y[i] ? y[i] : y[0]) * h;
            let rect = new PIXI.Rectangle(xx, yy, w, h);
            this.node[i] = rect;
        }
        return this;
    }

    /** 生成texture */
    generateTexture(): Block {
        this.extractGraph();
        let texture = PIXI.Texture.from(core.material[this.cls][this.node.img]);
        PIXI.Texture.addToCache(texture, this.graph);
        return this;
    }
}