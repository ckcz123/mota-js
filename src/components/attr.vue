<template>
    <!-- 直接if吧 -->
    <div id="attr">
        <span id="description">{{ 
            // @ts-ignore
            actionAttributes[id][name][0]
        }}</span>
        <input id="input" v-if="text.includes(type)" :value="value"/>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        value: Ref<any>
        name: string
        id: Key
    }>();

    const text = ['string', 'number_u', 'number'];
    const select = ['string_img', 'string_icon'];

    // @ts-ignore
    const type = actionAttributes[props.id][props.name][1] as string;

    let value = props.value;

    defineExpose({
        text,
        select,
        value,
        type
    })

    watch(value, (newValue, oldValue) => {
        if (type === 'number_u') {
            if (!/[0-9]+/.test(newValue)) value.value = '0px';
            if (!units.some(v => newValue.endsWith(v))) 
                value.value = `${parseFloat(newValue)}px`;
        } else if (type === 'number') {
            value.value = parseFloat(newValue);
        } else if (type === 'string') {
            value.value = newValue;
        }
    })
</script>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';
import { actionAttributes, units } from '../info.js';

export default defineComponent({
    name: 'Attrs',
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

#input:active {
    border-color: #88f;
}
</style>