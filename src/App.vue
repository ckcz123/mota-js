<template>
    <div id="root">
        <button id="open" @click="triggerFold">ui编辑器</button>
        <div id="mode">
            <button 
                v-for="one of list" id="ui-list" class="mode" 
                :status="one[0] === mode" @click="triggerMode(one[0])"
            >{{one[1]}}</button>
        </div>
        <button class="ui-tools" id="preview" @click="preview()">预览</button>
        <button class="ui-tools" id="compile" @click="compileAll()">编译</button>
        <button class="ui-tools" id="save" @click="saveUi()">{{saveText}}</button>
        <span id="now">当前ui<br>{{editing}}</span>
        <Editor ref="editor" v-if="mode === 'edit'"></Editor>
        <List v-else @edit="edit($event)"></List>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import Editor from "./components/editor.vue";
import { preview } from "./preview";
import { compile } from "./compile";
import { settings } from "./loadMonaco";
import List from "./components/list.vue";
import { list as uiList } from './action';
import { load, save } from "./save";

const mode = ref('list');
const list = [['list', '列表'], ['edit', '编辑']];
const editing = ref('');
const saveText = ref('保存');

defineExpose({
    mode, list, editing, saveText
})
</script>

<script lang="ts">

let folded = true;

export default defineComponent({
    name: 'App',
    methods: {
        /** 触发折叠 */
        triggerFold() {
            const root = document.getElementById('root') as HTMLDivElement;
            const mode = document.getElementById('mode') as HTMLDivElement;
            
            root.style.left = folded ? '0px' : '-300px';
            mode.style.left = folded ? '300px' : '230px';
            folded = !folded;
            main.editorOpened = !folded;
        },
        /** 改变模式 */
        triggerMode(mode: string) {
            this.mode = mode;
        },
        async compileAll() {
            const res = await compile();
            const editor = this.$refs.editor as any;
            editor.openEditor(res, 'javascript');
            settings.callback = (v) => {};
        },
        async edit(id: string) {
            const data = await load(id);
            uiList.value = data;
            this.mode = 'edit';
            this.editing = id;
        },
        async saveUi() {
            await save(this.editing, uiList.value);
            this.saveText = '成功';
            setTimeout(() => {
                this.saveText = '保存';
            }, 1000);
        }
    },
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
    overflow: visible;
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
    z-index: -1;
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
    z-index: -1;
    user-select: none;
    transition: all 0.3s ease-out;
    -webkit-transition: all 0.3s ease-out;
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

.ui-tools {
    .border();
    position: absolute;
    left: 300px;
    width: 70px;
    height: 30px;
    font-size: 16px;
    color: white;
    background-color: rgb(79, 199, 255);
    transition: border 0.1s ease-in-out, left 0.3s ease-out;
    -webkit-transition: border 0.1s ease-in-out, left 0.3s ease-out;
    box-shadow: 0px 0px 5px black;
    text-shadow: 2px 2px 2px black;
    cursor: pointer;
    border: 2px solid rgb(20, 167, 235);
    z-index: -1;
}

#compile {
    top: 300px;
}

#preview {
    top: 350px;
}

#save {
    top: 400px;
}

.ui-tools:hover {
    border: 2px solid rgb(2, 39, 247);
}

.ui-tools:active {
    border: 2px solid rgb(2, 39, 247);
    background-color: cadetblue;
}

#now {
    .border();
    position: absolute;
    left: 300px;
    width: 70px;
    font-size: 16px;
    color: white;
    background-color: rgb(79, 199, 255);
    transition: border 0.1s ease-in-out, left 0.3s ease-out;
    -webkit-transition: border 0.1s ease-in-out, left 0.3s ease-out;
    box-shadow: 0px 0px 5px black;
    text-shadow: 2px 2px 2px black;
    border: 2px solid rgb(20, 167, 235);
    z-index: -1;
    top: 450px;
    text-align: center;
}
</style>