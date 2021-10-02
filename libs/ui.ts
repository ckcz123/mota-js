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
        }
        else {
            let sprite = core.dymSprites[name];
            sprite.position.set(x, y);
            return sprite;
        }
    }
}

let ui = new Ui();
export { ui, Ui };