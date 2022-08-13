<template>
    <div id="img-option" :selected="selected === name">
        <button @click="select">选择</button>
        <!-- 由于样板的机制，只能用画布画了 -->
        <canvas :id="`icon-${name}`" ref="icon" v-if="type === 'string_icon'"></canvas>
        <button 
            v-if="type === 'string_img'" id="preview"
            @click="preview = !preview"
        >预览</button>
        <span>{{ name }}</span>
        <span id="now" v-if="selected === name">当前选中</span>
    </div>
    <img v-if="type === 'string_img' && preview" :src="`project/images/${name}`"/>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { icon } from '../actions';

const props = defineProps<{
    name: string
    selected: string
    type: string
}>();

const emits = defineEmits<{
    (e: 'select', id: string): void
}>()

const info = core.getBlockInfo(props.name) ?? { 
    image: core.statusBar.icons[props.name],
    posX: 0, posY: 0, height: 32 
};

const preview = ref(false);

onMounted(() => {  
    if (props.type !== 'string_icon') return;  
    const canvas = document.getElementById(`icon-${props.name}`) as HTMLCanvasElement;
    canvas.style.width = '32px';
    canvas.style.height = `${info.height}px`;
    canvas.width = 32;
    canvas.height = info.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;    
    core.drawIcon(ctx, props.name, 0, 0);
})

function select() {
    emits('select', props.name);
}
</script>

<style lang="less" scoped>

#img-option {
    margin: 5px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s linear;
    -webkit-transition: background-color 0.3s linear;
}

#img-option[selected=true] {
    background-color: rgba(127, 255, 212, 0.312);
}

button {
    width: 8%;
    border: 1.5px solid #222;
    border-radius: 3px;
    margin-right: 1%;
    transition: all 0.2s linear;
    font-size: 17px;
    font-weight: 200;
    padding: 1px;
}

button {
    background-color: rgb(39, 255, 201);
}

button:active {
    background-color: aquamarine;
}

button:hover {
    border-color: #88f;
}

span {
    font-size: 18px;
}

canvas {
    margin-right: 10px;
}

#now {
    margin-left: 20px;
}

#preview {
    margin-left: 10px;
    margin-right: 20px;
}
</style>