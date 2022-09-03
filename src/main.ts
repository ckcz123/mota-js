import App from './App.vue';
import { createApp } from 'vue';

window.addEventListener('load', e => {
    if (!core.domStyle.isVertical) {
        createApp(App).mount('#ui-editor');
    }
})

window.oncontextmenu = e => false;