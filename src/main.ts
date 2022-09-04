import App from './App.vue';
import { createApp } from 'vue';

createApp(App).mount('#ui-editor');

window.oncontextmenu = e => false;