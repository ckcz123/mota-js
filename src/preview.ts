import { BaseAction, list } from "./action";
import * as actions from './actions';
import { sprites } from "./info";

/** 预览当前ui */
export async function preview() {
    // 首先将所有画布隐藏，并重置css等
    for (const id in sprites) {
        const s = sprites[id];
        s.setCss('display: none;');
        actions.resetSprite(s);
    }
    await new Promise(res => {
        setTimeout(res, 50);
    })
    // 然后依次预览即可
    for (const action of list.value) {
        const type = action.type as keyof SpriteDrawInfoMap;
        const s = action.sprite as string;
        const d = action.data;

        if (type === 'wait') await actions.wait(s, d);
        else if (type === 'create') actions.create(d.name, d);
        else actions[type](s, d);
    }
}

/** 编辑时预览 */
export function previewSync() {
    const ignore = ['wait', 'transition', 'del'];
    // 首先将所有画布显示
    for (const id in sprites) {
        const s = sprites[id];
        s.setCss('display: block;');
    }
    // 然后依次预览即可
    for (const action of list.value) {
        const type = action.type as keyof SpriteDrawInfoMap;
        const s = action.sprite as string;
        const d = action.data;
        if (ignore.includes(type)) continue;
        if (type === 'create') actions.create(d.name, d);
        else actions[type](s, d);
    }
}