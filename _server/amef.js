/**
 * another mota-js editor framework
 * 为编辑器设计的MVVM框架
 * @author tocque
 */

/**
 * 
 */
class AMEFComponent {

    /** @type {HTMLElement} */$root

    /**
     * 将元素和变量进行双向数据绑定
     * @param {*} ref 
     * @param {string} key 
     */
    $bind(ref, key) {
        if (Array.isArray(ref)) {
            for (let [r, k] of ref) {
                this.$bind(r, k);
            }
        } else {
            this.$root.getElement
        }
    }

    /**
     * 将组件挂载到父组件或dom元素上
     * @param {string|Element|AMEFComponent} to 要挂载到的对象
     */
    $mount(to) {
        if (typeof to ===  "string") {
            to = document.querySelector(to);
            if (!to) {
                throw Error("mount to enmty");
            }
        }
        if (to instanceof AMEFComponent) {
            to = to.$root;
        }
        const fac = document.createElement("template");
        fac.innerHTML = this.template;
        to.appendChild(fac.firstChild);
    }
}