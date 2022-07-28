<template>
    <div id="root">
        <button id="open" @click="triggerFold">ui编辑器</button>
        <div id="mode">
            <button class="mode">列表</button>
            <button class="mode">编辑</button>
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
            mode: 'list'
        }
    },
    methods: {
        triggerFold() {
            const root = document.getElementById('root') as HTMLDivElement;
            const mode = document.getElementById('mode') as HTMLDivElement;
            root.style.left = folded ? '0px' : '-300px';
            mode.style.left = folded ? '300px' : '230px';
            folded = !folded;
        }
    }
});
</script>

<style lang="less" scoped>

#root {
    left: -300px;
}

#open {
    position: absolute;
    width: 40px;
    height: 200px;
    font-size: 25px;
    color: white;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
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
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
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
</style>