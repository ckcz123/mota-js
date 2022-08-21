import { BaseAction, list } from "./action";
import * as actions from './actions';
import { sprites } from "./info";

/** 预览当前ui */
export async function preview() {
    // 首先将所有画布隐藏
    for (const id in sprites) {
        const s = sprites[id];
        s.setCss('display: none;');
    }
    // 然后依次预览即可
    for (const action of list.value) {
        const type = action.type as keyof SpriteDrawInfoMap;
        const s = action.sprite as string;
        const d = action.data;
        if (type === 'wait') await actions.wait(s, d);
        else actions[type](s, d);
    }
}