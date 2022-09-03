<template>
    <div id="action">
        <div 
            id="info" @mouseup="rightClick($event)"  @click="select()" :status="status"
        >
            <span id="detail" @click="triggerDetail($event)">▲</span>
            <span id="name">{{actions[type as Key]}}</span>
            <span id="del" @click="del()">✖</span>
        </div>
        <div id="attrs" v-if="detailed">
            <div id="disable">
                <span id="description">临时禁用</span>
                <input id="disablebox" type="checkbox" v-model="disable"/>
            </div>
            <!-- 大部分都需要一个作用画布的参数 -->
            <div id="sprite" v-if="needSprite">
                <span id="description">作用画布</span>
                <select id="select" v-model="sprite">
                    <option 
                        v-for="sprite of sprites" :value="sprite.name"
                    >{{sprite.name}}</option>
                </select>
            </div>
            <Attr 
                v-for="(value, key) of attrs" :value="value" :id="type" 
                :name="key" @open-editor="openEditor($event)" @change="change(key, $event)"
            ></Attr>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BaseAction, list, selected, ctrl, cutIndex } from "../action";
import { drawActions } from "../info";
import Attr from "./attr.vue";
import { sprites } from "../info";
import { previewSync } from "../preview";

const actions = drawActions;
const props = defineProps<{
    data: BaseAction<any>
    type: Key
    index: number
}>();

const detailed = ref(false);

const attrs = props.data.data as Object;
const needSprite = !['wait', 'create'].includes(props.type);
const status = computed(() => {
    if (cutIndex.value.includes(props.index)) return 'tocut';
    else if (selected.value.includes(props.index)) return 'selected';
    else return 'none';
});

const sprite = ref(Object.keys(sprites)[0]);
const disable = ref(false);

const emits = defineEmits<{
    (e: 'delete', i: number): void
    (e: 'openEditor', data: { value?: string, lang?: 'javascript' | 'txt' }): void
    (e: 'right', data: { status: boolean, x: number, y: number }): void
}>()

watch(sprite, newValue => {
    sprite.value = props.data.sprite = newValue;
    previewSync();
})

watch(disable, newValue => {
    props.data.disable = disable.value = newValue;
    previewSync();
})

function triggerDetail(e: MouseEvent) {
    const span = e.currentTarget as HTMLSpanElement;
    span.style.transform = `rotate(${detailed.value ? 90 : 180}deg)`;
    detailed.value = !detailed.value;
    select();
}

function del() {
    emits('delete', props.index);
    select();
    if (props.type === 'create' && props.index !== 0) {
        const sprite = sprites[props.data.data.name];
        delete sprites[props.data.data.name];
        const pre = Object.values(sprites)[0].name;
        for (let i = props.index; i < list.value.length; i++) {
            const action = list.value[i];
            if (action.sprite === sprite.name) {
                action.sprite = pre;
            }
        }
        sprite.destroy();
    }
}

function openEditor(data: { value?: string, lang?: 'javascript' | 'txt' }) {
    emits('openEditor', data);
}

function change(id: string, value: any) {
    props.data.data[id] = value;
    previewSync();
}

function rightClick(e: MouseEvent) {
    if (e.button === 2) {
        e.preventDefault();
        emits('right', { status: true, x: e.clientX, y: e.clientY });
    } else emits('right', { status: false, x: e.clientX, y: e.clientY });
}

function select() {
    if (ctrl.value === true) {
        const i = selected.value.findIndex(v => v === props.index);
        if (i !== -1) selected.value.splice(i, 1);
        else selected.value.push(props.index);
    } else {
        if (selected.value.length > 1) {
            selected.value = [props.index];
        } else {
            if (selected.value[0] === props.index) selected.value = [];
            else selected.value = [props.index];
        }
    }
    if (cutIndex.value.includes(props.index)) {
        const i = cutIndex.value.findIndex(v => v === props.index);
        cutIndex.value.splice(i, 1);
        select();
    }
}
</script>

<style lang="less" scoped>

.border{
    border-left: 2px solid #000;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    border-right: none;
}

span {
    font-size: 20px;
    font-weight: 200;
    text-align: center;
    user-select: none;
}

#info {
    .border();
    display: flex;
    justify-content: space-between;
    background-color: #ddd;
}

#detail {
    transform: rotate(90deg);
    color: #777;
    width: 30px;
    height: 30px;
    transition: transform 0.4s ease-out, filter 0.2s linear;
    -webkit-transition: transform 0.4s ease-out, filter 0.2s linear;
    cursor: pointer;
}

#detail:hover {
    filter: drop-shadow(0 0 1px #222);
}

#detail:active {
    filter: drop-shadow(0 0 1px #222)brightness(1.2);
}

#del {
    width: 30px;
    height: 30px;
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

#action {
    width: 100%;
    margin-top: 3px;
    margin-bottom: 3px;
    box-shadow: 0px 0px 2px #000;
}

#info[status=selected] {
    background-color: rgb(255, 217, 0);
}

#info[status=tocut] {
    background-color: rgba(119, 119, 119, 0.5);
    color: rgba(0, 0, 0, 0.5);
}

#attrs {
    width: 90%;
    left: 10%;
    position: relative;
    background-color: #ddd;
}

#sprite, #disable {
    .border();
    display: flex;
    justify-content: space-between;
    justify-items: center;
    margin-top: 2px;
    margin-bottom: 2px;
    text-align: center;
    font-weight: 200;

    #description {
        margin-left: 10px;
        height: 100%;
        font-size: 17px;
        user-select: none;
    }

    #disablebox {
        margin-right: 10px;
        width: 40%;
    }
}

#input {
    width: 40%;
    border: 0.5px solid #222;
    border-radius: 3px;
    margin-right: 10px;
    transition: all 0.2s linear;
    font-size: 18px;
    font-weight: 200;
}

#input:hover {
    border-color: #88f;
}

#input:focus {
    border-color: #88f;
}

#select {
    width: 40%;
    border: 1px solid #222;
    border-radius: 3px;
    margin-right: 10px;
    transition: all 0.2s linear;
    font-size: 17px;
    font-weight: 200;
}

#select:hover {
    border-color: #88f;
}
</style>