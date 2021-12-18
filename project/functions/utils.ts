"use strict";
// 该文件负责杂七杂八的功能

export type FormatOption = {
    useChinese?: boolean
}

/**
 * 格式化数字
 * @param number 要格式化的数字
 * @param digit 显示的字符串长度
 * @param option 配置参数，包括 useChinese（使用中文）
 */
export function format(number: number, digit: number = 6, option: FormatOption = { useChinese: false }): string {
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