<template>
    <div id="monaco">
        <div id="toolbar">
            <button @click="save">保存</button>
            <button @click="confirm">确认</button>
            <button @click="close">取消</button>
        </div>
        <hr/>
        <div id="code"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as monaco from 'monaco-editor';
import { settings } from '../loadMonaco';

let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
    const div = document.getElementById('code') as HTMLDivElement;
    editor = monaco.editor.create(div, {
        language: props.lang,
        fontSize: 22,
        value: props.value,
        theme: 'light-plus'
    })
    setTimeout(() => {
        editor.getAction('editor.action.formatDocument').run();
    }, 100);
})

const emits = defineEmits<{ 
    (e: 'close'): void
}>()

const props = defineProps<{
    value: string
    lang: 'javascript' | 'txt'
}>()

function close() {
    emits('close');
}

function save() {
    const value = editor.getValue();
    if (!settings.callback) throw new TypeError(`Unexpected undeclaration of monaco callback function.`);
    settings.callback(value);
}

function confirm() {
    save();
    close();
}
</script>

<style scoped lang="less">

hr {
    margin: 0;
    width: 100%;
    border: solid 0.5px #333;
    background-color: #333;
}

button {
    width: 10%;
    height: 100%;
    border: solid 1px #333;
    border-radius: 3px;
    font-size: 25px;
    text-align: center;
    background-color: rgb(133, 243, 255);
    margin-right: 0.5%;
    margin-left: 0.5%;
    transition: border 0.2s linear, background-color 0.1s linear;
    -webkit-transition: border 0.2s linear, background-color 0.1s linear;
}

button:hover {
    border: solid 1px #7bf;
    background-color: aquamarine;
}

button:active {
    background-color: rgb(102, 205, 171);
}

#toolbar {
    width: 100%;
    height: 4%;
    display: flex;
    justify-items: center;
    background-color: #eee;
}

#monaco {
    position: fixed;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
}

#code {
    width: 100%;
    height: 96%;
}
</style>