import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

interface MonacoSettings {
    callback?: (value: string) => void
}

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

// 添加默认声明文件
import('../public/_server/fs.js').then(() => {
    fs.readFile('runtime.d.ts', 'utf-8', (err, data) => {
        if (err || !data) throw new ReferenceError(
            `Unexpected unload of runtime.d.ts. Please check your local server.
This won't affect your normal use, but lack of template type support.
未成功加载runtime.d.ts，请检查你的本地服务器，这不会影响你的正常使用，但是会让样板的类型标注失效。
Error info: ${err}`
        )
        monaco.languages.typescript.javascriptDefaults.addExtraLib(data)
    })
})

export const settings: MonacoSettings = {}