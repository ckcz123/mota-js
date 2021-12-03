"use strict";
// 该文件负责杂七杂八的功能
import * as PIXI from 'pixi.js-legacy';
import * as core from '../../libs/core';

/**
 * 格式化数字
 * @param number 要格式化的数字
 * @param digit 显示的字符串长度
 * @param option 配置参数，包括 useChinese（使用中文）
 */
export function format(number: number, digit = 6, option = { useChinese: false }): string {
    const dict = option.useChinese ?
        { 'w': 1e4, 'e': 1e8, 'z': 1e12 } :
        { '万': 1e4, '亿': 1e8, '兆': 1e12 };

    /** 尝试格式化 */
    const formatOne = (suffix: string) => {
        let n = number / dict[suffix];
        if (n < 1) return null;
        if (n > 10 ** digit) return null;
    }

    for (let suffix in dict) {
        let result = formatOne(suffix);
        if (result) {
            result += suffix;
            return result;
        }
    }
    return number.toString();
}

// /** 初始化伤害字符 */
// export function initChar(): void {
//     const all = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'w', 'e', 'z', '万', '亿', '兆'];
//     all.forEach(v => getText(v));
// }

// /** 获取某个字符的Text实例 */
// export function getText(text: string): PIXI.Text {
//     let t = core.core.cache.char[text];
//     if (!t) {
//         t = new PIXI.Text(text, {
//             fontSize: core.core.__UNIT_WIDTH__ / 3, fontFamily: 'Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 2
//         });
//         core.core.cache[text] = t;
//     }
//     return t;
// }