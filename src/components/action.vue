<template>
    <div id="action">
        <div id="info">
            <span id="detail" @click="triggerDetail($event)">▲</span>
            <span id="name">{{actions[type as Key]}}</span>
            <span id="del" @click="del()">✖</span>
        </div>
        <div id="attrs" v-if="detailed">
            <div id="sprite" v-if="needSprite"></div>
            <Attr 
                v-for="(value, key) of attrs" :value="ref(value)" 
                :id="type" :name="key"
            ></Attr>
        </div>
    </div>
</template>

<script setup lang="ts">
    const actions = drawActions;
    const props = defineProps<{
        data: SpriteDrawInfo<any>
        type: Key
        index: number
    }>();

    let detailed = ref(false);
        
    const attrs = props.data as Object;
    const needSprite = !['wait', 'create', 'save', 'restore'].includes(props.type);

    defineEmits<{
        (e: 'delete', i: number): void
    }>()

    defineExpose({
        detailed
    })
</script>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import { BaseAction } from "../action";
import { actionAttributes, drawActions } from "../info";
import Attr from "./attr.vue";

export default defineComponent({
    name: 'action',
    methods: {
        triggerDetail(e: MouseEvent) {
            const span = e.currentTarget as HTMLSpanElement;
            span.style.transform = `rotate(${this.detailed ? 90 : 180}deg)`;
            this.detailed = !this.detailed;
        },
        del() {
            this.$emit('delete', this.index)
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
</style>