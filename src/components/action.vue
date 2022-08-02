<template>
    <div id="action">
        <div id="info">
            <span id="detail" @click="triggerDetail()">▲</span>
            <span id="name">{{actions[type as Key]}}</span>
            <span id="del">✖</span>
        </div>
        <div id="attrs" v-if="detailed">
            
        </div>
    </div>
</template>

<script setup lang="ts">
    const actions = drawActions;
    const props = defineProps<{
        data: SpriteDrawInfo<any>
        type: string
    }>();

    let detailed = false;
        
    const attrs = Object.entries(props.data);

    defineExpose({
        detailed
    })
</script>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { BaseAction } from "../action";
import { actionAttributes, drawActions } from "../info";

export default defineComponent({
    name: 'action',
    methods: {
        triggerDetail() {
            const span = document.getElementById('detail') as HTMLSpanElement;
            span.style.transform = `rotate(${this.detailed ? 90 : 180}deg)`;
            this.detailed = !this.detailed;
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
    display: flex;
    justify-content: space-between;
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
    .border();
    background-color: #ddd;
}
</style>