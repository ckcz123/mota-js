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
        game.stage.addChild(dymContainer);
        core.containers.dymContainer = dymContainer;
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
        sprite.x = x * core.scale;
        sprite.y = y * core.scale;
        sprite.width = w * core.scale;
        sprite.height = h * core.scale;
        sprite.zIndex = z * core.scale;
        core.containers.dymContainer.addChild(sprite);
        core.dymSprites[name] = sprite;
        return sprite;
    }

    /** 删除某个sprite */
    destroySprite(name: string | PIXI.Sprite): void {
        if (name instanceof PIXI.Sprite) name.destroy();
        else {
            core.dymSprites[name].destroy();
            delete core.dymSprites[name];
        }
    }

    /** 重定位某个sprite */
    relocateSprite(name: string | PIXI.Sprite, x: number, y: number): PIXI.Sprite {
        x *= core.scale;
        y *= core.scale;
        if (name instanceof PIXI.Sprite) {
            name.position.set(x, y);
            return name;
        } else {
            let sprite = core.dymSprites[name];
            sprite.position.set(x, y);
            return sprite;
        }
    }

    /** 
     * 修改某个sprite的大小
     * @param x 如果小于1且不为0，视为比例缩放，否则为像素缩放
     * @param y 如果小于1且不为0，视为比例缩放，否则为像素缩放
     */
    resizeSprite(name: string | PIXI.Sprite, x: number, y: number): PIXI.Sprite {
        if (name instanceof PIXI.Sprite) {
            if (x >= 1 || x === 0) x /= name.width * core.scale;
            if (y >= 1 || y === 0) y /= name.width * core.scale;
            name.scale.set(x, y);
            return name;
        } else {
            let sprite = core.dymSprites[name];
            if (x >= 1 || x === 0) x /= sprite.width * core.scale;
            if (y >= 1 || y === 0) y /= sprite.width * core.scale;
            sprite.scale.set(x, y);
            return sprite;
        }
    }
}

let ui = new Ui();
export { ui, Ui };