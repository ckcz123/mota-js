<template>
    <div id="editor">
        <div id="added-action">
            <Action 
                v-for="(one, i) of list" :data="one.data" 
                :type="one.type" :index="i" @delete="doDelete($event)"
            ></Action>
        </div>
        <button id="add" class="button" @click="triggerAdd">+ 添加新操作</button>
        <div id="actions" v-if="showActions">
            <button 
                v-for="[id, name] of actions" :id="id"
                class="button" @click="doAdd(id as keyof SpriteDrawInfoMap)"
            >{{name}}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const list: Ref<BaseAction<any>[]> = ref([]);
    const actions = ref(Object.entries(drawActions));
    const showActions = ref(false);

    defineExpose({
        list,
        actions,
        showActions
    })
</script>

<script lang="ts">
import { defineComponent, provide, Ref, ref } from "vue";
import { BaseAction } from '../action';
import { drawActions } from "../info";
import Action from "./action.vue";

export default defineComponent({
    name: 'Editor',
    components: { Action },
    methods: {
        triggerAdd() {
            this.showActions = !this.showActions;
        },
        doAdd(action: keyof SpriteDrawInfoMap) {
            const data = new BaseAction(action);
            if (!data.success) return;
            
            this.list = this.list.concat([data]);
        },
        doDelete(i: number) {
            this.list.splice(i, 1);
            this.list = this.list;
        }
    }
})
</script>

<style lang="less">

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
</style>

<style lang="less" scoped>

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
</style>