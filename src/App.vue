<template>
    <div id="root">
        <button id="open" @click="triggerFold">ui编辑器</button>
        <div id="mode">
            <button 
                v-for="one of list" id="ui-list" class="mode" 
                :status="one[0] === mode" @click="triggerMode(one[0])"
            >{{one[1]}}</button>
        </div>
        <Editor></Editor>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Editor from "./components/editor.vue";

let folded = true;

export default defineComponent({
    name: 'App',
    components: { Editor },
    data() {
        return {
            mode: 'list',
            list: [['list', '列表'], ['edit', '编辑']]
        }
    },
    methods: {
        /** 触发折叠 */
        triggerFold() {
            const root = document.getElementById('root') as HTMLDivElement;
            const mode = document.getElementById('mode') as HTMLDivElement;
            
            root.style.left = folded ? '0px' : '-300px';
            mode.style.left = folded ? '300px' : '230px';
            folded = !folded;
        },
        /** 改变模式 */
        triggerMode(mode: string) {
            this.mode = mode;
        }
    }
});
</script>

<style lang="less" scoped>

.border {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
}

#root {
    left: -300px;
    width: 300px;
    height: 100%;
    background-color: rgba(187, 187, 187, 0.9);
    position: absolute;
    transition: all 0.3s ease-out;
    -webkit-transition: all 0.3s ease-out;
}

#open {
    .border();
    position: absolute;
    left: 300px;
    width: 40px;
    height: 200px;
    font-size: 25px;
    color: white;
    background-color: rgb(20, 167, 235);
    transition: border 0.1s ease-in-out, left 0.3s ease-out;
    -webkit-transition: border 0.1s ease-in-out, left 0.3s ease-out;
    box-shadow: 0px 0px 5px black;
    text-shadow: 2px 2px 2px black;
    cursor: pointer;
    border: 2px solid rgb(20, 167, 235);
}

#open:hover {
    border: 2px solid rgb(2, 39, 247);
}

#open:active {
    border: 2px solid rgb(2, 39, 247);
    background-color: cadetblue;
}

#mode {
    .border();
    position: absolute;
    bottom: 5px;
    left: 230px;
    width: 60px;
    box-shadow: 0px 0px 5px black, 5px 5px 5px black;
    background-color: rgba(200, 200, 200);
    padding: 2px;
    z-index: 200;
    user-select: none;
    transition: all 0.3s ease-out;
    -webkit-transition: all 0.3s ease-out;
    z-index: 999999;
}

.mode {
    margin: 4px;
    background-color: rgba(200, 200, 200, 0.5);
    text-align: center;
    color: #333;
    font-size: 18px;
    box-shadow: 0px 0px 3px black;
    cursor: pointer;
    z-index: 200;
    border: 1px solid black;
    transition: all 0.2s ease-out;
    -webkit-transition: all 0.2s ease-out;
}

.mode[status="true"] {
    background-color: rgba(130, 130, 130, 0.8);
}

.mode:hover[status='false'] {
    background-color: rgba(160, 160, 160, 0.8);
}
</style>