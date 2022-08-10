<template>
    <!-- 直接if吧 -->
    <div id="attr">
        <span id="description" v-if="!isArray">{{ 
            // @ts-ignore
            actionAttributes[id][name][0]
        }}</span>
        <input id="input" v-if="text.includes(type)" @blur="blur" v-model.trim="value"/>
        <button 
            id="multi" v-else-if="type === 'string_multi'" @click="openEditor(value)"
        >编辑</button>

    </div>
</template>

<script setup lang="ts">

    const props = defineProps<{
        value: Ref<any>
        name: string
        id: Key
    }>();

    // @ts-ignore
    const type = actionAttributes[props.id][props.name][1] as string;

    const text = ['string', 'number_u', 'number'];
    const select = ['string_img', 'string_icon'];
    const isArray = /^Array<[a-zA-Z,]+>$/.test(type);

    let value = props.value;

    defineExpose({
        text,
        select,
        value,
        type,
        multiCallback
    })

    const emits = defineEmits<{
        (e: 'openEditor', data: { value?: string, lang?: 'js' | 'txt' }): void
        (e: 'change', value: any): void
    }>()

    function multiCallback(value: string) {
        props.value.value = value;
    }

    watch(props.value, newValue => {
        emits('change', newValue);
    })
</script>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';
import { actionAttributes, units } from '../info.js';
import { settings } from '../loadMonaco';
// import { openEditor } from '../monaco.js';

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
            }
        },
        openEditor(value: string) {
            if (this.type === 'string_multi') settings.callback = this.multiCallback;
            this.$emit('openEditor', { value, lang: 'txt' });
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

input, button {
    width: 40%;
    border: 1px solid #222;
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

button {
    background-color: aqua;
}

button:active {
    background-color: aquamarine;
}

</style>