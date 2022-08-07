import * as monaco from 'monaco-editor';

interface CanSaveToVariable {
    value?: string
    [x: string | number]: any
}

const container = document.getElementById('code-container') as HTMLDivElement;
const root = document.getElementById('code-editor') as HTMLDivElement

// 添加默认声明文件
// monaco.languages.typescript.javascriptDefaults.addExtraLib(

// );

/** 编辑器 */
export const editor = monaco.editor.create(container, {
    fontSize: 17,
    fontFamily: 'Fira Code',
});

/** 是否打开了编辑器 */
main.editorOpened = false;

/** 当前打开的编辑器种类 */
export let type = 'js';

/** 打开编辑器 */
export function openEditor(lang: 'js' | 'txt', value: string = '') {
    const model = editor.getModel();
    if (!model) throw new ReferenceError(`Unexpected unset of monaco editor model.`)
    monaco.editor.setModelLanguage(model, lang);
    editor.setValue(value);
    root.style.display = 'flex';
    main.editorOpened = true;
}

/**
 * 关闭编辑器并保存文件
 * @param target 要保存到的文件路径
 * @param variable 要保存到的变量，需为引用类型，包含
 */
export function closeEditor(target?: string, variable?: CanSaveToVariable) {
    const value = editor.getValue();
    if (variable) variable.value = value;
    root.style.display = 'none';
    main.editorOpened = false;
}