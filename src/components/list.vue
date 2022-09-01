<template>
    <span id="loading" v-if="!loaded">加载中...</span>
    <div v-else>
        <div class="list" v-for="id of uiList">
            <button class="tools" @click="edit(id)">编辑</button>
            <span>{{id}}</span>
            <span id="del" @click="deleteUi(id)">✖</span>
        </div>
        <button id="create" @click="createInfo = !createInfo">创建新ui</button>
        <div v-if="createInfo" class="list">
            <span>ui名称</span>
            <input v-model.trim="nowId"/>
            <button class="tools" @click="createUi(nowId)">创建</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { list, load, create, del } from '../save';

const loaded = ref(false);
const uiList = ref<string[]>([]);
const createInfo = ref(false);
const nowId = ref('');

loadList();

const emits = defineEmits<{
    (e: 'edit', id: string): void
}>()

async function loadList() {
    const res = await list();
    loaded.value = true;
    uiList.value = res;
}

async function createUi(id: string) {
    if (uiList.value.includes(id)) return alert('ui名称不能重复！');
    await create(id);
    createInfo.value = false;
    uiList.value.push(id);
}

async function deleteUi(id: string) {
    await del(id);
    uiList.value.splice(uiList.value.findIndex(v => v === id), 1);
}

async function edit(id: string) {
    emits('edit', id);
    nowId.value = id;
}
</script>

<style scoped lang="less">

.border{
    border-left: 2px solid #000;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    border-right: none;
}

#loading {
    position: relative;
    width: 300px;
    text-align: center;
}

#del {
    color: #777;
    cursor: pointer;
    transition: filter 0.2s linear;
    -webkit-transition: filter 0.2s linear;
}

#del:hover {
    filter: drop-shadow(0 0 1px #222);
}

#del:active {
    filter: drop-shadow(0 0 1px #222)brightness(1.2);
}

.list {
    .border();
    margin-top: 3px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ddd;
    padding-left: 10px;
    padding-right: 10px;
    height: 30px;
    font-size: 20px;
}

#create {
    .border();
    width: 100%;
    height: 30px;
    background-color: #ddd;
    color: #000;
    text-align: center;
    font-size: 20px;
    font-weight: 200;
}

span {
    font-weight: 200;
    font-size: 18px;
}

.tools, input {
    border: 1.5px solid #222;
    border-radius: 3px;
    margin-right: 10px;
    transition: all 0.2s linear;
    font-size: 17px;
    font-weight: 200;
}

.tools:hover, input:hover, input:focus {
    border-color: #88f;
}

.tools:active {
    background-color: aquamarine;
}

.tools {
    background-color: aqua;
}

input {
    width: 50%;
}
</style>