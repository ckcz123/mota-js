<template>
    <div id="img-selector">
        <div id="img-tools">
            <button id="img-confirm" @click="close">确定</button>
            <button id="img-cancel" @click="cancel">取消</button>
            <input 
                id="search-input" v-model.trim="search" 
                placeholder="可使用 /RegExp/i 的形式使用正则表达式搜索"
            />
        </div>
        <hr/>
        <ImgOption 
            v-for="id of imgs" :name="id" :key="id" :type="type"
            :selected="selected" @select="select($event)"
        ></ImgOption>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ImgOption from './imgOption.vue';

const props = defineProps<{
    type: string
    selected: string
}>()

const emits = defineEmits<{
    (e: 'select', id: string): void
    (e: 'close'): void
}>()

const before = props.selected;

const search = ref('');
const selectedType = ref<string[]>(core.materials.slice(0, -1).concat(['status']));

/** 获得所有的需要显示的图标 */
let imgs = ref(getImgs());

function getImgs() {
    // 图片
    if (props.type === 'string_img') return main.images
        .filter(filterSearch);
    // 图标
    else {
        let res: string[] = [];
        if (selectedType.value.includes('status'))
            res.push(...Object.keys(core.statusBar.icons).filter(filterSearch));
        for (const info of core.materials) {
            if (!selectedType.value.includes(info)) continue;
            const all = core.material.icons[info];
            if (!all) throw new ReferenceError(
`Unexpected undeclration of icons in core.material.icons.
Type: ${info}.`
            );
            res.push(
                ...Object.keys(all)
                .filter(v => !res.includes(v))
                .filter(filterSearch)
            );
        }
        return res;
    }
}

/** 搜索功能 */
function filterSearch(value: string) {
    // 正则搜索
    if (/^\/[^]+\/[igms]*$/.test(search.value)) {
        const info = search.value.split('/');
        try {
            return new RegExp(info[1], info[2]).test(value);
        } catch (e) {}
    } else {        
        return value.toLowerCase().includes(search.value.toLowerCase());
    }
}

watch(search, (v) => {
    search.value = v;    
    imgs.value = getImgs();    
})

function select(id: string) {
    emits('select', id);
}

function cancel() {
    emits('select', before);
    close()
}

function close() {
    emits('close');
}
</script>

<style lang="less" scoped>

#img-selector {
    z-index: 1000;
    position: fixed;
    width: 80vw;
    height: 80vh;
    left: 10vw;
    top: 10vh;
    border: solid 4px #bbb;
    background-color: #eee;
    border-radius: 5px;
    box-shadow: 0px 0px 12px #000;
    padding: 8px;
    overflow: auto;
}

input, button {
    width: 8%;
    border: 1.5px solid #222;
    border-radius: 3px;
    margin-right: 1%;
    transition: all 0.2s linear;
    font-size: 17px;
    font-weight: 200;
    padding: 3px;
}

input {
    width: 60%;
    border-width: 1px;
}

button {
    background-color: aqua;
}

button:active {
    background-color: aquamarine;
}

input:hover, button:hover {
    border-color: #88f;
}

#type {
    position: relative;
    width: 10%;
}
</style>