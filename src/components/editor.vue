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
    <div ref="rightMenu" id="right">
        <div v-if="right" id="right-menu" >
            <div v-if="insert && insertPos === 'top'">
                <button 
                    v-for="[id, name] of actions" :id="id" 
                    class="button" @click="doAddAt(id as keyof SpriteDrawInfoMap)"
                >{{name}}</button>
            </div>
            <div @click="triggerInsert('top')">在上方插入操作</div>
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

    const actions = ref(Object.entries(drawActions));
    const showActions = ref(false);

    const editorOpened = ref(false);

    const editorValue = ref('');
    const editorLang = ref<'javascript' | 'txt'>('javascript');
    
    const right = ref(false);
    const insertIndex = ref(0);
    const insert = ref(false);
    const insertPos = ref('top');
    const pointerY = 0;

    function openEditor(value: string = '', lang: 'javascript' | 'txt' = 'javascript') {
        editorValue.value = value;
        editorLang.value = lang;
        editorOpened.value = true;
    }

    defineExpose({
        list,
        actions,
        showActions,
        editorLang,
        editorValue,
        editorOpened,
        right,
        insertIndex,
        insert,
        insertPos,
        pointerY,
        openEditor
    })
</script>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { BaseAction, list } from '../action';
import { drawActions } from "../info";
import Action from "./action.vue";
import Monaco from './monaco.vue';

export default defineComponent({
    name: 'Editor',
    methods: {
        triggerAdd() {
            this.showActions = !this.showActions;
        },
        doAdd(action: keyof SpriteDrawInfoMap) {
            const data = new BaseAction(action);
            if (!data.success) return;
            
            this.list.push(data);
        },
        doDelete(i: number) {
            // 第一个操作不能删，除非只有第一个操作
            if (i === 0 && this.list.length !== 1) return;
            this.list.splice(i, 1);
        },
        closeEditor() {
            this.editorOpened = false;
        },
        triggerRight(data: { status: boolean, x: number, y: number }, i: number) {
            this.right = data.status;
            const div = this.$refs.rightMenu as HTMLDivElement;
            div.style.left = `${data.x}px`;
            div.style.top = `${data.y}px`;
            this.insertIndex = i;
            this.pointerY = data.y;
        },
        doAddAt(action: keyof SpriteDrawInfoMap) {
            const delta = this.insertPos === 'top' ? 0 : 1;
            const behind = this.list.splice(this.insertIndex + delta, this.list.length);
            const data = new BaseAction(action);
            if (!data.success) return;
            this.list.push(...[data].concat(behind));
        },
        triggerInsert(pos: 'top' | 'bottom') {
            this.insert = !this.insert;
            this.insertPos = pos;
            this.checkPos();
        },
        checkPos() {
            const div = this.$refs.rightMenu as HTMLDivElement;
            if (parseInt(getComputedStyle(div).top) > window.innerHeight / 2) {
                div.style.top = '';
                div.style.bottom = `${window.innerHeight - this.pointerY}px`;
            }
        }
    }
})
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