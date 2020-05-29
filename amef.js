/**
 * another mota-js editor framework
 * 为编辑器设计的MVVM框架
 * @author tocque
 */
class AMEFComponent {

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
            
        }
    }
}