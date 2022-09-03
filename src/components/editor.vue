<template>
    <div id="editor">
        <div id="added-action">
            <Action 
                v-for="(one, i) of list" :data="one" :key="one.cnt"
                :type="one.type" :index="i" @delete="doDelete($event)"
                @open-editor="openEditor($event.value, $event.lang)"
                @right="triggerRight($event, i)"
            ></Action>
        </div>
        <button id="add" class="button" @click="triggerAdd">+ 添加新操作</button>
        <div id="actions" v-if="showActions">
            <button 
                v-for="[id, name] of actions" :id="id" v-if="list[0]?.type === 'create'"
                class="button" @click="doAdd(id as keyof SpriteDrawInfoMap)"
            >{{name}}</button>
            <!-- 如果是还没有创建画布 -->
            <button 
                v-else id="create" class="button" @click="doAdd('create')"
            >创建画布</button>
        </div>
    </div>
    <Monaco
        v-if="editorOpened" @close="closeEditor()" :value="editorValue" :lang="editorLang"
    ></Monaco>
    <div id="right">
        <div v-if="right" id="right-menu" >
            <div v-if="insert && insertPos === 'top'">
                <button 
                    v-for="[id, name] of actions" :id="id" 
                    class="button" @click="doAddAt(id as keyof SpriteDrawInfoMap)"
                >{{name}}</button>
            </div>
            <div @click="triggerInsert('top')">在上方插入操作</div>
            <hr/>
            <div @click="copy()">复制</div>
            <hr/>
            <div @click="cut()">剪切</div>
            <hr/>
            <div @click="paste()">粘贴到下方</div>
            <hr/>
            <div @click="triggerInsert('bottom')">在下方插入操作</div>
            <div v-if="insert && insertPos === 'bottom'">
                <button 
                    v-for="[id, name] of actions" :id="id" 
                    class="button" @click="doAddAt(id as keyof SpriteDrawInfoMap)"
                >{{name}}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BaseAction, list, saved, selected } from '../action';
import { drawActions } from "../info";
import { previewSync } from "../preview";
import Action from "./action.vue";
import Monaco from './monaco.vue';

const actions = ref(Object.entries(drawActions));
const showActions = ref(false);

const editorOpened = ref(false);

const editorValue = ref('');
const editorLang = ref<'javascript' | 'txt'>('javascript');

const right = ref(false);
const insertIndex = ref(0);
const insert = ref(false);
const insertPos = ref('top');
let pointerY = 0;

let copied: number[] = [];
let isCut = false;
let copiedData: BaseAction<Key>[] = [];

function openEditor(value: string = '', lang: 'javascript' | 'txt' = 'javascript') {
    editorValue.value = value;
    editorLang.value = lang;
    editorOpened.value = true;
    right.value = false;
    insert.value = false;
}

function triggerAdd() {
    showActions.value = !showActions.value;
}

function doAdd(action: keyof SpriteDrawInfoMap) {
    const data = new BaseAction(action);
    if (!data.success) return;
    saved.value = false;
    list.value.push(data);
    return data;
}

function doDelete(i: number) {
    // 第一个操作不能删，除非只有第一个操作
    if (i === 0 && list.value.length !== 1) return;
    list.value.splice(i, 1);
    previewSync();
    saved.value = false;
}

function closeEditor() {
    editorOpened.value = false;
}

function doAddAt(action: keyof SpriteDrawInfoMap) {
    const delta = insertPos.value === 'top' ? 0 : 1;
    if (insertIndex.value + delta === 0 && action !== 'create') return alert('不能在第一个操作之前插入非创建画布的操作');
    const behind = list.value.splice(insertIndex.value + delta, list.value.length);
    const data = new BaseAction(action);
    if (!data.success) return;
    list.value.push(...[data].concat(behind));
    previewSync();
    saved.value = false;
    insert.value = false;
    right.value = false;
    return data;
}

function triggerInsert(pos: 'top' | 'bottom') {
    insert.value = !insert.value;
    insertPos.value = pos;
    checkPos();
}

function checkPos() {
    const div = document.getElementById('right') as HTMLDivElement;
    if (parseInt(getComputedStyle(div).top) > window.innerHeight / 2) {
        div.style.top = '';
        div.style.bottom = `${window.innerHeight - pointerY}px`;
    }
}

function triggerRight(data: { status: boolean, x: number, y: number }, i: number) {
    right.value = data.status;
    const div = document.getElementById('right') as HTMLDivElement;
    div.style.left = `${data.x}px`;
    div.style.top = `${data.y}px`;
    insertIndex.value = i;
    pointerY = data.y;
}

function copy() {
    copied = selected.value.slice();
    insert.value = false;
    right.value = false;
    isCut = false;
    copiedData = copied.map(v => list.value[v]);
}

function cut() {
    copy();
    isCut = true;
}

function paste() {
    insertPos.value = 'bottom';
    insert.value = false;
    right.value = false;
    for (const action of copiedData) {
        const data = doAddAt(action.type);
        if (!data) return;
        data.sprite = action.sprite;
        data.data = action.data;
        insertIndex.value++;
    }
    if (isCut) copied.forEach(v => doDelete(v));
    isCut = false;
}

defineExpose({ openEditor });
</script>

<style lang="less" scoped>
.border{
    border-left: 2px solid #000;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    border-right: none;
}

.button {
    .border();
    width: 100%;
    height: 30px;
    background-color: #ddd;
    color: #000;
    text-align: center;
    font-size: 20px;
    font-weight: 200;
}

#actions {
    position: relative;
    left: 30px;
    width: 90%;
    height: 50%;
    overflow: auto;
}

#editor {
    overflow: auto;
    overflow-x: hidden;
    height: 100%;
}


#right {
    position: fixed;
    z-index: 9999;
    transition: all 0.1s ease-out;
    -webkit-transition: all 0.1s ease-out;
}

#right-menu {
    border: solid #999 2px;
    border-radius: 5px;
    background-color: #ddd;
    font-size: 20px;
    width: 200px;
    text-align: center;
    max-height: 40vh;
    overflow: auto;
    cursor: pointer;

    hr {
        margin: 2px;
        background-color: #999;
        border: #999 solid 1px;
    }
}
</style>