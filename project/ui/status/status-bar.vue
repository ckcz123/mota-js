<template>
    <Status v-for="one in list" :value="hero[one.id]" :name="one.name"></Status>
</template>

<script>
import Status from './status.vue';
import { core } from '../../../libs/core';
import { getStatusLabel, getShowStatus } from '../../../libs/utils';
import { defineComponent } from 'vue';

let hero = core.status.nowHero;
let list = getShowStatus(hero);
list = list.map(v => { return { id: v, name: getStatusLabel(v) }});

export default defineComponent( {
    name: 'StatusBar',
    data: () => {
        return { list, hero: core.status.nowHero };
    },
    components: {
        Status
    }
});
</script>

<style>

</style>