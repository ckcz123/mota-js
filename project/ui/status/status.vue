<template>
    <div>
        <span>{{name}}&nbsp;&nbsp;{{value}}</span>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Status',
    props: ['value', 'name'],
    data: () => {
        return {};
    }
});
</script>

<style lang='less' scoped>
span {
    color: #fff;
    font-size: 30px;
}

div {
    width: 100%;
    height:10%;
}
</style>