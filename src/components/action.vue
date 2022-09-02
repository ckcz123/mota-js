<template>
    <div id="action">
        <div id="info" @mouseup="rightClick($event)">
            <span id="detail" @click="triggerDetail($event)">▲</span>
            <span id="name">{{actions[type as Key]}}</span>
            <span id="del" @click="del()">✖</span>
        </div>
        <div id="attrs" v-if="detailed">
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
    const actions = drawActions;
    const props = defineProps<{
        data: BaseAction<any>
        type: Key
        index: number
    }>();

    const detailed = ref(false);
        
    const attrs = props.data.data as Object;
    const needSprite = !['wait', 'create'].includes(props.type);

    const sprite = ref(Object.keys(sprites)[0]);
    
    defineEmits<{
        (e: 'delete', i: number): void
        (e: 'openEditor', data: { value?: string, lang?: 'javascript' | 'txt' }): void
        (e: 'right', data: { status: boolean, x: number, y: number }): void
    }>()

    defineExpose({
        detailed,
    })

    watch(sprite, newValue => {
        sprite.value = props.data.sprite = newValue;
        previewSync();
    })
</script>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { BaseAction } from "../action";
import { drawActions } from "../info";
import Attr from "./attr.vue";
import { sprites } from "../info";
import { Emitter } from "monaco-editor";
import { previewSync } from "../preview";

export default defineComponent({
    name: 'action',
    methods: {
        triggerDetail(e: MouseEvent) {
            const span = e.currentTarget as HTMLSpanElement;
            span.style.transform = `rotate(${this.detailed ? 90 : 180}deg)`;
            this.detailed = !this.detailed;
        },
        del() {
            this.$emit('delete', this.index);
            if (this.type === 'create') delete sprites[this.data.data.name];
        },
        openEditor(data: { value?: string, lang?: 'javascript' | 'txt' }) {
            this.$emit('openEditor', data);
        },
        change(id: string, value: any) {
            this.data.data[id] = value;
            previewSync();
        },
        rightClick(e: MouseEvent) {
            if (e.button === 2) {
                e.preventDefault();
                this.$emit('right', { status: true, x: e.clientX, y: e.clientY });
            } else this.$emit('right', { status: false, x: e.clientX, y: e.clientY });
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

span {
    font-size: 20px;
    font-weight: 200;
    text-align: center;
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

#attrs {
    width: 90%;
    left: 10%;
    position: relative;
    background-color: #ddd;
}

#sprite {
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