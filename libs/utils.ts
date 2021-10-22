/*
utils.ts负责各种辅助函数
*/

/**
 * 深拷贝一个对象(函数将原样返回)
 * @example core.clone(core.status.hero, (name, value) => (name == 'items' || typeof value == 'number'), false); // 深拷贝主角的属性和道具
 * @param data 待拷贝对象
 * @param filter 过滤器，可选，表示data为数组或对象时拷贝哪些项或属性，true表示拷贝
 * @param recursion 过滤器是否递归，可选。true表示过滤器也被递归
 * @returns 拷贝的结果，注意函数将原样返回
 */
export function clone(data: any, filter?: (index: number | string, data: any) => boolean, recursion?: boolean) {
    if (!data) return null;
    // date
    if (data instanceof Date) {
        let copy = new Date();
        copy.setTime(data.getTime());
        return copy;
    }
    // array
    if (data instanceof Array) {
        let copy = [];
        for (let i in data) {
            if (!filter || filter(i, data[i]))
                copy[i] = this.clone(data[i], recursion ? filter : null, recursion);
        }
        return copy;
    }
    // 函数
    if (data instanceof Function) {
        return data;
    }
    // object
    if (data instanceof Object) {
        let copy = {};
        for (let i in data) {
            if (data.hasOwnProperty(i) && (!filter || filter(i, data[i])))
                copy[i] = this.clone(data[i], recursion ? filter : null, recursion);
        }
        return copy;
    }
    return data;
}