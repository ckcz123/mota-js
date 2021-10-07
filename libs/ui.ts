/*
ui.ts负责部分ui的绘制
*/
import * as PIXI from 'pixi.js-legacy';
import { core } from './core';

class Ui {
    constructor() {

    }

    /** 初始化游戏pixi */
    initPixi(): void {
        let game = core.pixi.gameDraw;
        let dymContainer = new PIXI.Container();
        // 动态container，用于玩家绘制
        let _sprite = new PIXI.Sprite();
        game.stage.addChild(dymContainer);
        dymContainer.addChild(_sprite);
        core.containers.dymContainer = { _sprite };
    }

    /** 获取某个container */
    getContainer(name: string | PIXI.Sprite | PIXI.Container): PIXI.Container {
        if (name instanceof PIXI.Sprite) return name.parent;
        else if (name instanceof PIXI.Container) return name;
        else {
            let s = (core.containers[name] || {})._sprite;
            if ((s || {}).parent instanceof PIXI.Container) return s.parent;
        }
        return null;
    }

    /** 获取某个sprite */
    getSprite(name: string | PIXI.Sprite): PIXI.Sprite {
        if (name instanceof PIXI.Sprite) return name;
        else {
            for (let one in core.containers) {
                let sprite = core.containers[one][name];
                if (sprite) return sprite;
            }
        }
        return null;
    }

    /** 
     * 创建一个sprite，注：游戏画面横向宽度永远是1000，纵向宽度为1000/横纵比
     * @param name 创建的精灵的id
     * @param x 精灵左上角相对画面左上角的横坐标
     * @param y 精灵左上角相对画面左上角的纵坐标
     * @param w 精灵的宽度
     * @param h 精灵的长度
     * @param z 精灵的z值
     * @returns 返回该精灵的实例
     */
    createSprite(name: string, x: number, y: number, w: number, h: number, z: number): PIXI.Sprite {
        let sprite = new PIXI.Sprite();
        sprite.x = x;
        sprite.y = y;
        sprite.width = w;
        sprite.height = h;
        sprite.zIndex = z;
        let container = this.getContainer('dymContainer')
        container.addChild(sprite);
        core.containers.dymContainer[name] = sprite;
        return sprite;
    }

    /** 删除某个sprite */
    destroySprite(name: string | PIXI.Sprite): void {
        if (name instanceof PIXI.Sprite) name.destroy();
        else {
            for (let one in core.containers) {
                let sprite = core.containers[one][name];
                if (sprite) {
                    sprite.destroy();
                    delete core.containers[one][name];
                }
            }
        }
    }

    /** 重定位某个sprite */
    relocateSprite(name: string | PIXI.Sprite, x: number, y: number): PIXI.Sprite {
        let sprite = this.getSprite(name);
        sprite.x = x;
        sprite.y = y;
        return sprite;
    }

    /** 
     * 修改某个sprite的大小，目标为相对于背景图长宽的比例缩放
     * @param w 如果小于1且不为0，视为比例缩放，否则为像素缩放
     * @param h 如果小于1且不为0，视为比例缩放，否则为像素缩放
     */
    resizeSprite(name: string | PIXI.Sprite, w?: number, h?: number): PIXI.Sprite {
        let sprite = this.getSprite(name);
        if (!sprite) return;
        if (w) {
            if (w <= 1) sprite.scale.x = w;
            else sprite.width = w;
        }
        if (h) {
            if (h <= 1) sprite.scale.y = h;
            else sprite.height = h;
        }
        return sprite;
    }

    /** 更改sprite的背景图片 */
    changeImageOnSprite(sprite: string | PIXI.Sprite, name: string): void {
        let s = this.getSprite(sprite);
        if (!sprite) return;
        let url = 'project/images/' + name;
        let loader = core.pixi.gameDraw.loader;
        let textures = loader.resources;
        let texture = textures[url];
        if (!texture) {
            loader.add(url).load(() => {
                texture = textures[url];
                s.texture = texture.texture;
            });
        } else {
            s.texture = texture.texture;
        }
    }

    /** 
     * 创建一个container
     * @param name 容器的名称
     * @param x 容器的左上角横坐标
     * @param y 容器的左上角纵坐标
     * @param z 容器的z值
     */
    createContainer(name: string, x: number = 0, y: number = 0, z?: number): PIXI.Container {
        let container = new PIXI.Container();
        container.x = x;
        container.y = y;
        if (z) container.zIndex = z;
        core.pixi.gameDraw.stage.addChild(container);
        let _sprite = new PIXI.Sprite();
        container.addChild(_sprite);
        core.containers[name] = { _sprite };
        return container;
    }

    /** 
     * 在某个container上绘制图片
     * @param container 容器名或容器的实例，只有当该参数为字符串时，才会将引用存进core.containers，才能通过引用
     * 删除该图片，否则只能通过删除容器来删除图片
     * @param self 是否使用独立名称，使用后不能同时绘制多个名称相同的独立图片，但删除时效率更高
     */
    drawImageOnContainer(container: string | PIXI.Container, image: string, self: boolean = false,
        x: number = 0, y: number = 0, w?: number, h?: number): void {
        let c = this.getContainer(container);
        if (!c) return;
        let id: string;
        if (!self) {
            if (typeof container === 'string') {
                while (true) {
                    id = image + '_' + ~~(Math.random() * 1e8);
                    if (!core.containers[container][id]) break;
                }
            }
        } else id = image;
        let url = 'project/images/' + image;
        let loader = core.pixi.gameDraw.loader;
        let textures = loader.resources;
        let texture = textures[url];
        let sprite: PIXI.Sprite;
        // 执行绘制
        if (!texture) {
            loader.add(url).load(() => {
                texture = textures[url];
                sprite = new PIXI.Sprite(texture.texture);
                sprite.x = x;
                sprite.y = y;
                if (w) sprite.width = w;
                if (h) sprite.height = h;
                c.addChild(sprite);
                if (container instanceof PIXI.Container) return;
                core.containers[container][id] = sprite;
            });
        } else {
            sprite = new PIXI.Sprite(texture.texture);
            sprite.x = x;
            sprite.y = y;
            if (w) sprite.width = w;
            if (h) sprite.height = h;
            c.addChild(sprite);
            if (container instanceof PIXI.Container) return;
            core.containers[container][id] = sprite;
        }
    }

    /**
     * 删除某个由drawImageOnContainer绘制的图片，会删除所有名称相同的图片
     * @example ui.destoryImage('container', 'bg.jpg'); // 删除container上的bg.jpg图像或container上所有bg.jpg图像
     */
    destoryImage(container: string, image: string): void {
        let c = core.containers[container];
        if (c[image]) {
            c[image].destroy();
            delete c[image];
            return;
        }
        for (let name in c) {
            if (name.startsWith(image)) {
                c[name].destroy();
                delete c[name];
            }
        }
    }
}

let ui = new Ui();
export { ui, Ui };