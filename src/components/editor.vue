<template>
    <button id="add" class="button" @click="triggerAdd">+ 添加新操作</button>
    <div id="actions">
        <button 
            v-if="showActions" v-for="[id, name] of actions" :id="id"
            class="button" @click="doAdd(id as keyof SpriteDrawInfoMap)"
        >{{name}}</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BaseAction } from '../action';
import { drawActions } from "../info";

export default defineComponent({
    name: 'Editor',
    data(): {
        list: BaseAction<any>[]
        actions: [string, string][]
        showActions: boolean
    } {
        return {
            list: [],
            actions: Object.entries(drawActions),
            showActions: false
        }
    },
    mounted() {

    },
    methods: {
        triggerAdd() {
            this.showActions = !this.showActions;
        },
        doAdd(action: keyof SpriteDrawInfoMap) {

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
</style>