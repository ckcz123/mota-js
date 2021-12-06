/*
floor.ts负责楼层相关内容
*/
import { core } from './core';
import * as block from './block';
import * as view from './view';
import * as autotile from './autotile';
import * as PIXI from 'pixi.js-legacy';
import * as enemy from '../project/functions/enemy';
import * as utils from '../project/functions/utils';
import { Enemy } from './enemy';
import * as ui from './ui';

export class Floor {
    floorId: string;
    map: number[][];
    bg: number[][];
    fg: number[][];
    width: number;
    height: number;
    unit_width: number;
    unit_height: number;
    block: {
        event: { [key: string]: block.Block };
        fg: { [key: string]: block.Block };
        bg: { [key: string]: block.Block };
    }
    damages: {
        [key: string]: { damage: number, critical?: number }
    }

    constructor(floorId: string, area?: string) {
        this.floorId = floorId;
        let floor = core.floors[floorId];
        for (let one in floor) this[one] = floor[one];
        this.width = this.map[0].length;
        this.height = this.map.length;
        this.unit_width = core.__UNIT_WIDTH__;
        this.unit_height = core.__UNIT_HEIGHT__;
        this.damages = {};
        core.status.maps[floorId] = core.status.thisMap = this;
        if (area) {
            if (!core.status.areas[area]) core.status.areas[area] = { floorIds: [], data: {} };
            let areas = core.status.areas[area];
            if (!areas.floorIds.includes(floorId)) areas.floorIds.push(floorId);
        }
    }

    /** 解析楼层 */
    extract(layer?: string): Floor {
        if (!layer) {
            this.block = { fg: {}, bg: {}, event: {} };
            ['fg', 'bg', 'event'].forEach(one => { return this.extract(one); });
            return this;
        }
        let map: number[][];
        if (layer === 'event') map = this.map;
        else if (layer === 'fg') map = this.fg;
        else if (layer === 'bg') map = this.bg;
        this.block[layer] = {};
        // 进行解析
        let h = map.length;
        let w = map[0].length;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (map[y][x] === -2 || map[y][x] === 0) continue;
                let num = map[y][x];
                let cls = core.dict[num].cls;
                let id = core.dict[num].id
                if (cls === 'enemy') this.extractEnemy(id, layer, x, y);
                if (cls === 'autotile') this.extractAutotile(num, x, y, layer);
                if (this.block[layer][x + ',' + y]) map[y][x] = -2;
            }
        }
        return this;
    }

    /** 解析某个怪物 */
    private extractEnemy(id: string, layer: string, x: number, y: number): Floor {
        let enemy = new Enemy(core.units.enemy[id], x, y)
        let e = new block.Block(enemy, x, y);
        this.block[layer][x + ',' + y] = e;
        this.damages[x + ',' + y] = { damage: null };
        return this;
    }

    /** 解析某个autotile */
    private extractAutotile(number: number, x: number, y: number, layer: string): Floor {
        if (!(layer === 'fg' || layer === 'bg' || layer === 'event')) return this;
        let tile = new autotile.Autotile(number, x, y, layer, this.floorId);
        let b = new block.Block(tile, x, y);
        this.block[layer][x + ',' + y] = b;
        return this;
    }

    /** 绘制地图 */
    draw(view?: view.View): Floor {
        if (!view) view = core.status.nowView;
        // 如果是main视角，重定位至以勇士为中心的位置
        if (view.id === 'main') view.center();
        let main = core.containers.map;
        main.scale.set(view.scale);
        main.x = -view.x;
        main.y = -view.y;
        this.extract().drawBg().drawEvent().drawFg().drawDamage();
        return this;
    }

    /** 绘制背景层 */
    private drawBg(): Floor {
        if (core.containers.bg) core.containers.bg.destroy({ children: true });
        let bg = new PIXI.Container();
        bg.zIndex = 20;
        core.containers.bg = bg;
        core.containers.map.addChild(bg);
        this.drawContent('bg', bg);
        return this;
    }

    /** 绘制事件层 */
    private drawEvent(): Floor {
        if (core.containers.event) core.containers.event.destroy({ children: true });
        let event = new PIXI.Container();
        event.zIndex = 30;
        core.containers.event = event;
        core.containers.map.addChild(event);
        this.drawContent('event', event);
        return this;
    }

    /** 绘制前景层 */
    private drawFg(): Floor {
        if (core.containers.fg) core.containers.fg.destroy({ children: true });
        let fg = new PIXI.Container();
        fg.zIndex = 40;
        core.containers.fg = fg;
        core.containers.map.addChild(fg);
        this.drawContent('fg', fg);
        return this;
    }

    /** 把地图绘制到目标container上 */
    private drawContent(layer: 'bg' | 'fg' | 'event', container: PIXI.Container): Floor {
        let map: number[][] = this[layer === 'event' ? 'map' : layer];
        let h: number = map.length;
        let w: number = map[0].length;
        let dict = core.dict;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let n = map[y][x];
                let nn: number
                if (n === 1 || n === 0) continue;
                // -2的数字单独处理
                if (n === -2) nn = this.block[layer][x + ',' + y].data.number;
                else nn = n;
                let cls = dict[nn].cls;
                // 开始绘制
                if (cls !== 'autotile') {
                    let animate = core.dict[nn].animate;
                    let texture = core.dict[nn].animate.texture;
                    texture.frame = animate.data[0];
                    animate.data.now = 0;
                    this.drawOne(texture, x, y, container, nn.toString());
                } else {
                    this.drawAutotile(nn, x, y, layer, container);
                }
            }
        }
        return this;
    }

    /** 绘制单个图块到sprite */
    private drawOne(texture: PIXI.Texture, x: number, y: number, container: PIXI.Container, number: string): Floor {
        let sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 1);
        sprite.position.set(x * this.unit_width + this.unit_width / 2, y * this.unit_height + this.unit_height);
        let sx = this.unit_width / sprite.width;
        let sy = this.unit_height / sprite.height;
        if (sx > 1 && sy > 1) sprite.scale.set(Math.min(sx, sy));
        container.addChild(sprite);
        sprite.name = number + '@' + x + ',' + y;
        return this;
    }

    /** 绘制autotile */
    private drawAutotile(number: number, x: number, y: number, layer: 'bg' | 'fg' | 'event', container: PIXI.Container): Floor {
        // 解析autotile
        let tile = this.block[layer][x + ',' + y].data;
        // 绘制
        tile.draw();
        return this;
    }

    /** 绘制伤害 */
    drawDamage(): Floor {
        let container = core.containers.damage;
        if (!container) {
            container = new PIXI.Container();
            core.containers.map.addChild(container);
            container.zIndex = 50;
            core.containers.damage = container;
            container.x = 0;
            container.y = 0;
        }
        enemy.calculateAll(this.floorId, core.status.nowHero);
        for (let loc in this.damages) {
            let [x, y] = loc.split(',');
            // 创建text
            let damage = utils.format(this.damages[loc].damage);
            let text = ui.createText(damage, 2 + this.unit_width * parseInt(x), this.unit_height * (parseInt(y) + 1) - 2, 0, {
                fontSize: this.unit_width / 3, fontFamily: 'Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 2
            });
            text.anchor.set(0, 1);
            ui.drawContent(container, text);
        }
        return this;
    }
}