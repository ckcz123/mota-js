<script>
import { Pos, exec, isset } from "../../utils.js";

let __currentContextMenu__ = null;

document.body.addEventListener("click", function(e) {
    if (__currentContextMenu__ && 
        !e.composedPath().includes(__currentContextMenu__.$el)) {
        __currentContextMenu__.close();
    }
}, true);

export default {
    name: "context-menu",
    render() {
        if (!this.active) return null;
        const { x, y } = this.pos;
        const items = [];
        for (let i = 0; i < this.menuitems.length; i++) {
            const menuitem = this.menuitems[i];
            items.push(<li
                key={i}
                class={{ disable: !menuitem.validate }}
                vOn:click={ () => this.execAction(menuitem) }
            >{ menuitem.text }</li>);
            if (i && menuitem.group != this.menuitems[i-1].group) {
                items.push(<hr/>);
            }
        }
        return (
            <div class="contextmenu" style={{ left: x+"px", top: y+"px" }}>
                <ul>{ items }</ul>
            </div>
        );
    },
    data() {
        return {
            active: false,
            pos: new Pos(),
            items: []
        }
    },
    created() {
        this.itemcnt = 0;
        this.event = null;
        this.addins = [];
        this.groups = {};
    },
    computed: {
        menuitems() {
            const args = [this.event, ...this.addins];
            return this.items.filter((item) => exec(item.condition, ...args) != false)
                .map((item) => ({
                    text: exec(item.text, ...args) || item.text,
                    validate: exec(item.validate, ...args) != false,
                    action: item.action,
                }));
        }
    },
    methods: {
        /**
         * @param {MouseEvent} e 
         */
        open(e, ...addins) {
            if (__currentContextMenu__) {
                __currentContextMenu__.close();
            }
            __currentContextMenu__ = this;
            this.pos.set(e.clientX, e.clientY);
            this.event = e;
            this.addins = addins;
            this.active = true;
            e.preventDefault();
            e.stopPropagation();
        },
        close() {
            __currentContextMenu__ = null;
            this.active = false;
        },
        inject(item, props) {
            if (Array.isArray(item)) {
                for (let _item of item) {
                    this.inject(Object.assign({}, props, _item));
                }
            } else {
                item.id = this.itemcnt++;
                if (!(item.group in this.groups)) {
                    item.group = void 0;
                }
                this.items.push(item);
                this.items.sort((a, b) => {
                    if (isset(a.group) && isset(b.group)) {
                        if (a.group != b.group) {
                            return this.groups[a.group] - this.groups[b.group] || 
                                ((a.group < b.group) - (a.group > b.group));
                        } else {
                            return (a.priority - b.priority) || a.id - b.id;
                        }
                    }
                    if (isset(a.group) || isset(b.group)) {
                        if (isset(b.group)) {
                            return -(this.groups[b.group] - a.priority + 1);
                        } else {
                            return this.groups[a.group] - b.priority + 1;
                        }
                    }
                    return a.priority - b.priority || a.id - b.id;
                })
                // for (let i = 0; i < this.items.length; i++) {
                //     const _item = this.items[i];
                //     if (_item.group) {
                //         if (_item.group != item.group) continue;
                //     }
                //     if (item.priority < _item.priority) {
                //         return;
                //     }
                // }
            }
        },
        regGroup(name, priority = 0) {
            this.group[name] = priority;
        },
        execAction(item) {
            if (item.validate) {
                item.action(event, ...this.addins);
                this.close();
            }
        }
    }
}
</script>

<style lang="less">
.contextmenu {
    user-select: none;
    z-index: 1000;
    position: fixed;
    padding: 5px 0px;
    background-color: var(--c-bg-pop);
    box-shadow: 0px 3px 3px #111;
    white-space: nowrap;
    animation: fadeIn 83ms linear;
    li {
        padding: 5px 25px;
        color: var(--c-text);
        &:hover:not(.disable) {
            background-color: var(--c-item-focus);
            color: white;
        }
        &.disable {
            color: var(--c-text-dis);
        }
    }
    hr {
        padding: 0px;
        border-color: darkgrey;
        margin: 4px 6px;
    }
}
</style>