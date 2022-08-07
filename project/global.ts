// 自定义全局类型标注文件，便于修改，注意修改后可能会造成类型标注错误

/** 事件 */
export interface EventAction<T extends keyof EventType> {
    type: T
    data: EventType[T]
}

/** 事件类型 */
export interface EventType {
    x: any
}