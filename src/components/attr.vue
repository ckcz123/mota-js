<template>
    <!-- 直接if吧 -->
    <div id="attr">
        <span id="description" v-if="!isArray">{{ 
            // @ts-ignore
            actionAttributes[id][name][0]
        }}</span>
        <input id="input" v-if="text.includes(type)" @blur="blur" v-model.trim="value"/>
        <span id="readonly" v-else-if="type === 'readonly'">{{value}}</span>
        <button 
            id="multi" v-else-if="type === 'string_multi'" @click="openEditor(value)"
        >编辑</button>
        <input id="check" v-else-if="type === 'boolean'" type="checkbox" v-model="value"/>
        <select id="select" v-else-if="type.includes('|')" v-model="value">
            <option v-for="one of (options as string[])">{{ one }}</option>
        </select>
        <div id="img" v-else-if="select.includes(type)">
            <button id="select-img" @click="openImageSelector">选择</button>
            <span id="img-display">{{ value || '无' }}</span>
        </div>
        <div id="array" v-else-if="isArray">
            <div id="array-info">
                <span id="array-arrow" @click="triggerArrayDetail($event)">▲</span>
                <span id="description">{{
                    // @ts-ignore
                    actionAttributes[id][name][0]
                }}</span>
            </div>
            <div id="array-detail" v-if="arrayDetail">
                <div class="array-one" v-for="(v, i) of value" :key="i">
                    <div id="array-one-info">
                        <span id="array-one-index">第{{i + 1}}项</span>
                        <span id="array-one-del" @click="arrayDel(i)">✖</span>
                    </div>
                    <div class="array-one-attr" v-for="(one, ii) of v">
                        <span>{{arrayInfo[ii]}}</span>
                        <input 
                            @blur="blurForArray(i, ii, $event)" v-model.trim="value[i][ii]"
                        />
                    </div>
                </div>
                <div @click="addArray" id="array-new">+ 添加新项</div>
            </div>
        </div>
    </div>
    <ImgSelector 
        :type="type" :selected="value" v-if="selectImg" 
        @select="selectImage($event)" @close="closeImageSelector"
    ></ImgSelector>
</template>

<script setup lang="ts">

    const props = defineProps<{
        value: any
        name: string
        id: Key
    }>();

    const arrayDetail = ref(false);

    // @ts-ignore
    const type = actionAttributes[props.id][props.name][1] as string;

    const text = ['string', 'number_u', 'number'];
    const select = ['string_img', 'string_icon'];
    const isArray = /^Array<[\u4e00-\u9fa5a-zA-Z,]+>$/.test(type);
    const options = type.includes('|') && type.split('|') as string[];
    const selectImg = ref(false);

    const arrayInfo = (isArray && type.slice(6, -1).split(',')) || [];

    let value = ref(props.value);

    defineExpose({
        text,
        select,
        value,
        type,
        multiCallback,
        selectImg,
        arrayDetail,
        arrayInfo
    })

    const emits = defineEmits<{
        (e: 'openEditor', data: { value?: string, lang?: 'javascript' | 'txt' }): void
        (e: 'change', value: any): void
    }>()

    function multiCallback(v: string) {
        value.value = v;
    }

    watch(value, newValue => {
        emits('change', newValue);
        console.log(newValue);
    })
</script>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { actionAttributes, units } from '../info.js';
import { settings } from '../loadMonaco';
import ImgSelector from './imgSelector.vue';

export default defineComponent({
    name: 'Attrs',
    methods: {
        blur() {
            if (this.type === 'number_u') {
                if (!/[0-9]+/.test(this.value)) this.value = '0px';
                if (!units.some(v => this.value.endsWith(v))) 
                    this.value = `${parseFloat(this.value)}px`;
            } else if (this.type === 'number') {
                this.value = parseFloat(this.value);
            } else if (this.type === 'number_time') {
                if (!/[0-9]+/.test(this.value)) this.value = '0ms';
                if (!['s', 'ms'].some(v => this.value.endsWith(v))) {
                    this.value = `${parseFloat(this.value)}ms`;
                }
            }
        },
        openEditor(value: string) {
            if (this.type === 'string_multi') settings.callback = this.multiCallback;
            this.$emit('openEditor', { value, lang: 'txt' });
        },
        openImageSelector() {
            this.selectImg = true;
            main.editorOpened = true;
        },
        selectImage(name: string) {
            this.value = name;
        },
        closeImageSelector() {
            this.selectImg = false;
            main.editorOpened = false;
        },
        blurForArray(i: number, ii: number, e: Event) {
            const input = e.currentTarget as HTMLInputElement;
            const value = input.value;
            this.value[i][ii] = parseFloat(value);
        },
        triggerArrayDetail(e: MouseEvent) {
            const span = e.currentTarget as HTMLSpanElement;
            span.style.transform = `rotate(${this.arrayDetail ? 90 : 180}deg)`;
            this.arrayDetail = !this.arrayDetail;
        },
        addArray() {
            this.value.push(new Array(this.arrayInfo.length).fill(0));
        },
        arrayDel(i: number) {
            this.value.splice(i, 1);
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

#attr {
    .border();
    display: flex;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
    margin-top: 2px;
    margin-bottom: 2px;
    text-align: center;
    font-weight: 200;

}

#description {
    margin-left: 10px;
    height: 100%;
    font-size: 17px;
}

input, button {
    width: 40%;
    border: 1.5px solid #222;
    border-radius: 3px;
    margin-right: 10px;
    transition: all 0.2s linear;
    font-size: 17px;
    font-weight: 200;
}

input:hover, button:hover {
    border-color: #88f;
}

input:focus, button:hover {
    border-color: #88f;
}

#readonly {
    margin-right: 20px;
}

button {
    background-color: aqua;
}

button:active {
    background-color: aquamarine;
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

#select-img {
    width: 30%;
    margin: 0;
}

#img-display {
    width: 70%;
    font-size: 12px;
    font-weight: 200;
    color: #000;
    user-select: none;
}

#img {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.border{
    border-left: 2px solid #000;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    border-right: none;
}

#array {
    width: 100%;
}

#array-arrow {
    transform: rotate(90deg);
    margin-left: 10px;
    color: #777;
    transition: transform 0.4s ease-out, filter 0.2s linear;
    -webkit-transition: transform 0.4s ease-out, filter 0.2s linear;
    cursor: pointer;
}

#array-info {
    font-size: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #999;
}

#array-detail {
    font-size: 18px;
    position: relative;
    margin-top: 2px;
    margin-bottom: 2px;
}

#array-new {
    cursor: pointer;
    border-top: 2px solid #999;
}

.array-one-attr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #999;

    span {
        position: relative;
        left: 10px;
    }
}

.array-one {
    border-top: 2px solid #999;
}

#array-one-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 35%;
    padding-right: 10px;
    border-bottom: 1px solid #999;
}

#array-one-del {
    color: #777;
    cursor: pointer;
    transition: filter 0.2s linear;
    -webkit-transition: filter 0.2s linear;
}

#array-one-del:hover {
    filter: drop-shadow(0 0 1px #222);
}

#array-one-del:active {
    filter: drop-shadow(0 0 1px #222)brightness(1.2);
}
</style>