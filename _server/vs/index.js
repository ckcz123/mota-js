/**
 * @file multi.js 代码编辑器
 */
import loader from "./loader.js"
import CodeEditor from "./CodeEditor.vue"
import SimpleEditor from "./SimpleEditor.vue"
import { localfs } from "../fs.js"

loader.require.config({ paths: { 'vs': 'vs' } });
const monacoLoad = new Promise(res => {
    window.define = loader.define;
    loader.require(['vs/editor/editor.main'], res);
}).catch((e) => {
    window.onerror("monaco加载失败"+e, "vs/index.js");
});

const importDefaults = async function() {
    const ts = monaco.languages.typescript;
    // validation settings
    ts.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false
    })
    // compiler options
    ts.javascriptDefaults.setCompilerOptions({
        target: ts.ScriptTarget.ES6,
        allowNonTsExtensions: true
    })
    const list = await localfs.readdir("./vs/intellisence/");
    const declares = await Promise.all(list.map((e) => {
        return localfs.fetch("./vs/intellisence/"+e, "utf-8");
    }))
    declares.forEach((e, i) => {
        ts.javascriptDefaults.addExtraLib(e, list[i]);
    });
}

monacoLoad.then(() => {
    importDefaults();
    console.log("======monacoLoad======");
})

Vue.component(CodeEditor.name, async () => {
    await monacoLoad;
    return CodeEditor;
});

Vue.component(SimpleEditor.name, async () => {
    await monacoLoad;
    return SimpleEditor;
});