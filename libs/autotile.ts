/*
autotile.ts负责autotile相关内容
*/

import { core } from './core';
import * as utils from './utils';
import * as PIXI from 'pixi.js-legacy';

export class Autotile {
    x: number;
    y: number;
    floorId: string;
    layer: 'bg' | 'fg' | 'event';
    edge: boolean;
    readonly type: 'autotile' = 'autotile';
    readonly number: number;
    readonly id: string;
    /** 图片详细信息字符串 */
    node: string;
    content: PIXI.Container;
    data: {
        /** 当前帧数 */
        now?: number
        /** 图片名称 */
        img?: string
        /** 总帧数 */
        total?: number
        /** 单位长宽 */
        unit?: {
            width?: number
            height?: number
        }
        /** 连接的方向 */
        dir?: {
            up?: boolean
            left?: boolean
            down?: boolean
            right?: boolean
            leftup?: boolean
            rightup?: boolean
            leftdown?: boolean
            rightdown?: boolean
        }
        /** 四个角的texture */
        textures?: {
            leftup?: PIXI.Texture
            rightup?: PIXI.Texture
            rightdown?: PIXI.Texture
            leftdown?: PIXI.Texture
        }
        /** 四个角或整个的rectangle */
        graphs?: {
            leftup?: PIXI.Rectangle
            rightup?: PIXI.Rectangle
            rightdown?: PIXI.Rectangle
            leftdown?: PIXI.Rectangle
            all?: PIXI.Rectangle
        }
    }

    constructor(number: number, x?: number, y?: number, layer?: 'bg' | 'fg' | 'event', floor?: string) {
        let tile = core.dict[number];
        if (tile.cls !== 'autotile') return;
        this.node = tile.img;
        this.number = number;
        this.id = tile.id;
        this.x = x;
        this.y = y;
        this.floorId = floor;
        this.layer = layer;
        this.edge = true;
        this.data = { unit: {}, dir: {}, textures: {}, graphs: {} };
    }

    /** 解析方向 */
    extractDir(): Autotile {
        let map = core.status.maps[this.floorId][this.layer === 'event' ? 'map' : this.layer];
        for (let dir in utils.dirs) {
            let x = this.x + utils.dirs[dir][0];
            let y = this.y + utils.dirs[dir][1];
            if (x < 0 || x >= core.status.maps[this.floorId].width || y < 0 || y >= core.status.maps[this.floorId].height) {
                this.data.dir[dir] = this.edge;
                continue;
            }
            let n = map[y][x];
            if (n === -2) {
                let block = core.status.maps[this.floorId].block[this.layer][x + ',' + y];
                if (block.data.number === this.number) {
                    this.data.dir[dir] = true;
                    continue;
                }
            }
            if (n === this.number) {
                this.data.dir[dir] = true;
                continue;
            }
            this.data.dir[dir] = false;
        }
        return this;
    }

    /** 解析图块内容，获取要绘制哪四个16*16的格子 */
    extract(): Autotile {
        this.extractDir().extractNode();
        // 通过方向来获得二进制索引
        let dir = 0b00000000;
        let now = this.data.dir;
        if (now.rightup) dir += 0b1;
        if (now.right) dir += 0b10;
        if (now.rightdown) dir += 0b100;
        if (now.down) dir += 0b1000;
        if (now.leftdown) dir += 0b10000;
        if (now.left) dir += 0b100000;
        if (now.leftup) dir += 0b1000000;
        if (now.up) dir += 0b10000000;
        this.getEdge(dir);
        return this;
    }

    /** 判断四个角应该绘制的内容 */
    getEdge(dir: number): Autotile {
        // 判断四个正对的边是否有autotile，从而进行大致定位
        // 只需要判定左上角，左下角为上下对称位置，右上角为左右对称位置，右下角为中心对称位置
        /* 稍微画一下3x4的图... 
             -1   0  +1
            ----    ----
            |  |    |  |
            ------------
            |  |    |  |  -1
            ------------
            |  |    |  |  0
            ------------
            |  |    |  |  +1
            ------------
            稍微说一下原理，方便想要复写的作者
            对于左上角的16x16（1/4格）：如果左边有该自动元件或子组件，则向右移动2格，如果左边有，则向左移动1格，
                                    如果上边有，则向下移动2格，如果下边有，则向上移动1格
            对于左下角的16x16（1/4格）：如果左边有该自动元件或子组件，则向右移动2格，如果左边有，则向左移动1格，
                                    如果上边有，则向下移动1格，如果下边有，则向上移动2格
            以此类推，在左上角，则左边/上边移动两格......即在哪个角落，在哪个方向就移动2格
        */
        let img = core.material.autotile[this.data.img];
        if (dir !== 0) {
            let scanList = ['leftup', 'leftdown', 'rightup', 'rightdown'];
            for (let dirs of scanList) {
                // 解析每一个方向
                let [x, y] = [0, 0];
                // 判断拐角
                if (dir & 0b10000000 && dir & 0b100000 && !(dir & 0b1000000) && dirs === 'leftup') { x = 1; y = -2; }
                if (dir & 0b100000 && dir & 0b1000 && !(dir & 0b10000) && dirs === 'leftdown') { x = 1; y = -2; }
                if (dir & 0b10000000 && dir & 0b10 && !(dir & 0b1) && dirs === 'rightup') { x = 1; y = -2; }
                if (dir & 0b1000 && dir & 0b10 && !(dir & 0b100) && dirs === 'rightdown') { x = 1; y = -2; }
                if (y !== -2) {
                    x = dirs.includes('right') ? 1 : -1;
                    y = dirs.includes('down') ? 1 : -1;
                    if (dir & 0b10) {
                        if (dirs.includes('right')) x -= 2;
                        else x--;
                    }
                    if (dir & 0b1000) {
                        if (dirs.includes('down')) y -= 2;
                        else y--;
                    }
                    if (dir & 0b100000) {
                        if (dirs.includes('left')) x += 2;
                        else x++;
                    }
                    if (dir & 0b10000000) {
                        if (dirs.includes('up')) y += 2;
                        else y++;
                    }
                    x = Math.max(-1, x);
                    y = Math.max(-1, y);
                    x = Math.min(1, x);
                    y = Math.min(1, y);
                }
                let [px, py] = this.getPixel(x, y, dirs);
                let texture: PIXI.Texture = PIXI.utils.TextureCache[this.data.img + '@' + px + '@' + py];
                if (!texture) {
                    let rect = new PIXI.Rectangle(px, py, this.data.unit.width / 2, this.data.unit.height / 2);
                    this.data.graphs[dirs] = rect;
                    // 获取texture
                    texture = this.generateTexture(rect);
                }
                this.data.textures[dirs] = texture;
            }
        } else {
            // 为单个图块，直接取左上角
            let t = PIXI.utils.TextureCache[this.node + '@n'];
            let rect = new PIXI.Rectangle(0, 0, this.data.unit.width, this.data.unit.height);
            if (t) {
                this.data.graphs.all = rect;
                return this;
            }
            let texture = PIXI.Texture.from(img);
            PIXI.Texture.addToCache(texture, this.node + '@n');
            texture.frame = rect;
            this.data.graphs.all = rect;
        }
        return this;
    }

    /** 由坐标内容获取像素信息 */
    getPixel(x: number, y: number, dir: string): [number, number] {
        let [dx, dy] = [0, 0];
        if (dir.includes('right')) dx += this.data.unit.width / 2;
        if (dir.includes('down')) dy += this.data.unit.height / 2;
        return [(x + 1) * this.data.unit.width + dx, (y + 2) * this.data.unit.height + dy];
    }

    /** 生成texture */
    generateTexture(rect: PIXI.Rectangle): PIXI.Texture {
        let id = this.data.img + '@' + rect.x + '@' + rect.y;
        let texture = PIXI.utils.TextureCache[id]
        if (!texture) {
            let texture = new PIXI.Texture(new PIXI.BaseTexture(core.material.autotile[this.data.img]));
            texture.frame = rect;
            PIXI.Texture.addToCache(texture, id);
            return texture;
        }
        return texture;
    }

    /** 解析图片信息 */
    extractNode(): Autotile {
        let img = this.node.split('.');
        this.data.img = img[0] + '.' + img[img.length - 1];
        let aspect = img[1].split('@');
        this.data.total = parseInt(aspect[0].split('x')[1]);
        let im = core.material.autotile[this.data.img];
        this.data.unit.width = im.width / parseInt(aspect[1].split('x')[0]);
        this.data.unit.height = im.height / parseInt(aspect[1].split('x')[1]);
        return this;
    }

    /** 绘制这个autotile */
    draw(noReCal: boolean = false): Autotile {
        if (!noReCal) this.extract();
        if (core.status.thisMap.floorId !== this.floorId) return this;
        // 用container来绘制
        let container = new PIXI.Container();
        this.content = container;
        core.containers[this.layer].addChild(container);
        let floor = core.status.maps[this.floorId];
        container.position.set(floor.unit_width * this.x, floor.unit_height * this.y);
        if (this.data.graphs.all) {
            // 只有一个图块，直接绘制
            let sprite = new PIXI.Sprite(PIXI.utils.TextureCache[this.node + '@n']);
            container.addChild(sprite);
        } else {
            // 四个角分别绘制
            let leftup = new PIXI.Sprite(this.data.textures.leftup);
            leftup.position.set(0, 0);
            let rightup = new PIXI.Sprite(this.data.textures.rightup);
            rightup.position.set(this.data.unit.width / 2, 0);
            let leftdown = new PIXI.Sprite(this.data.textures.leftdown);
            leftdown.position.set(0, this.data.unit.height / 2);
            let rightdown = new PIXI.Sprite(this.data.textures.rightdown);
            rightdown.position.set(this.data.unit.width / 2, this.data.unit.height / 2);
            container.addChild(leftup, rightup, leftdown, rightdown);
        }
        container.scale.set(floor.unit_width / this.data.unit.width, floor.unit_height / this.data.unit.height);
        return this;
    }
}