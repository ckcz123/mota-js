<template>
    <div id="img-selector">
        <div id="img-tools">
            <button id="img-confirm" @click="close">确定</button>
            <button id="img-cancel" @click="cancel">取消</button>
            <input 
                id="search-input" v-model.trim="search"
                placeholder="可使用 /RegExp/ 的形式使用正则表达式搜索"
            />
            <div id="type" v-if="type === 'string_icon'">
                <div id="type-description" @click="selectType($event)">
                    <span id="arrow">▲</span>
                    <span id="s-type">选择类型</span>
                </div>
                <div id="type-all" v-if="typeOpened">
                    <div class="type-one" v-for="t of allTypes">
                        <input 
                            :value="t" type="checkbox" @change="changeType($event)"
                            :checked="selectedType.includes(t)"
                        />
                        <span class="">{{ t }}</span>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div id="options">
            <ImgOption 
                v-for="id of imgs" :name="id" :key="id" :type="type"
                :selected="selected" @select="select($event)"
            ></ImgOption>
        </div>
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
const selectedType = ref<string[]>(
    core.materials.slice(0, -1).concat(['status'])
);

const typeOpened = ref(false);
const allTypes = core.materials.slice(0, -1)
    .concat([
        'status', ...Object.keys(core.material.images.tilesets)
        .map(v => v.slice(0, -4))
    ]);

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
        // tilesets
        const all = Object.keys(core.material.images.tilesets);
        for (let n = 0; n < all.length; n++) {
            const id = all[n]
            if (!selectedType.value.includes(id.slice(0, -4))) continue;
            res.push(...getTilesetId(id, n));
        }
        return res;
    }
}

/** 获取所有tilesets的id */
function getTilesetId(id: string, n: number) {
    const img = core.material.images.tilesets[id];
    const xcnt = ~~(img.width / 32),
        ycnt = ~~(img.height / 32);
    return new Array(xcnt * ycnt).fill(0).map((v, i) => `X${(n + 1) * 10000 + i + 1}`);
}

/** 搜索功能 */
function filterSearch(value: string) {
    if (/^\/[^]+\/[a-zA-Z]*$/.test(search.value)) {
        // 正则搜索
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
    change()
})

function change() {
    const div = document.getElementById('options') as HTMLDivElement;
    div.scrollTo(0, 0);
}

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

function selectType(e: MouseEvent) {    
    const parent = e.currentTarget as HTMLDivElement;
    const arrow = parent.children[0] as HTMLSpanElement
    parent.style.borderBottomLeftRadius = `${typeOpened.value ? 5 : 0}px`;
    parent.style.borderBottomRightRadius = `${typeOpened.value ? 5 : 0}px`;
    arrow.style.transform = `rotate(${typeOpened.value ? 90 : 180}deg)`;
    typeOpened.value = !typeOpened.value;
}

function changeType(e: Event) {
    const ele = e.currentTarget as HTMLInputElement
    const type = ele.value;
    if (!ele.checked) selectedType.value = selectedType.value.filter(v => v !== type);
    else selectedType.value.push(type);
    imgs.value = getImgs();
    change();
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
    overflow: hidden;
}

#img-tools {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: visible;
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
    height: 30px;
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
    width: 16%;
    // display: flex;
    flex-direction: column;
    align-items: center;
    height: 40px;
    position: relative;
    overflow: visible;
    margin-bottom: 0px;
}

#type-description:hover {
    border-color: #88f;
}

#type-description:active {
    background-color: aquamarine;
}

#options {
    width: 100%;
    height: calc(100% - 55px);
    overflow: auto;
}

#type-description {
    cursor: pointer;
    width: 100%;
    font-size: 18px;
    background-color: aqua;
    padding-top: 4px;
    padding-bottom: 4px;
    border: #000 1.5px solid;
    border-radius: 5px;
    transition: all 0.3s linear;
    -webkit-transition: all 0.3s linear;
    justify-self: center;
    display: flex;
    justify-content: center;

    #arrow {
        transform: rotate(90deg);
        transition: all 0.3s ease-out;
        -webkit-transition: all 0.3s ease-out;
    }

    #s-type {
        margin-left: 10px;
    }
}

.type-one {
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-top: 2px;

    input {
        width: 20px;
        height: 20px;
    }
}

#type-all {
    position: relative;
    width: 100%;
    background-color: #eee;
    border-left: solid #bbb 1.5px;
    border-bottom: solid #bbb 1.5px;
    border-right: solid #bbb 1.5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    max-height: 50vh;
    overflow: auto;
}
</style>