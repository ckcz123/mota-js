<template>
    <!-- 直接if吧 -->
    <div id="attr">
        <span id="description" v-if="!isArray">{{ 
            // @ts-ignore
            actionAttributes[id][name][0]
        }}</span>
        <input id="input" v-if="text.includes(type)" @blur="blur" v-model.trim="value"/>
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
        type
    })
</script>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';
import { actionAttributes, units } from '../info.js';

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