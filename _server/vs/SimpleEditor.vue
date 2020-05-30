<template>
    <div class="multi-container simple-editor" ref="container"></div>
</template>

<script>
export default {
    name: 'simple-editor',
    props: {
        "lang": { default: "plaintext" },
    },
    data() {
        return {
            line: 1,
            col: 1,
            error: 0,
            warn: 0,
        }
    },
    async mounted() {
        this.multi = monaco.editor.create(this.$refs.container, {
            theme: editor.userdata.get('monacoTheme'),
            mouseWheelScrollSensitivity: 0.6,
            language: this.lang,
            automaticLayout: true,
            tabSize: 4,
            minimap: { enabled: false },
            wordWrap: "on",
        });
    },
    methods: {
        setValue(value) {
            this.multi.setValue(value);
        },
        getValue(value) {
            return this.multi.getValue(value);
        },
    },
    watch: {
        lang(newlang) {
            monaco.editor.setModelLanguage(this.multi.getModel(), newlang);
        },
    }
}
</script>

<style>

</style>