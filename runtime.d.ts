/**
 * @file runtime.d.ts 运行时的类型标注
 * @author 小秋橙 & tocque
 */

type direction = 'up' | 'down' | 'left' | 'right'
type move = 'forward' | direction
type loc = { direction: direction, x: number, y: number }
type rgbarray = [number, number, number, number]

type Block = { 
    x: number, 
    y: number, 
    id: number, 
    event: { 
        cls: string, 
        id: string, 
        [key: string]: any 
    }
}

type frameObj = {
    angle: number
    index: number
    mirror: number
    opacity: number
    x: number
    y: number
    zoom: number
}

type CtxRefer = string | CanvasRenderingContext2D | HTMLCanvasElement | HTMLImageElement

type Animate = {
    frame: number
    frames: frameObj[][]
    images: HTMLImageElement[]
    ratio: number
    se: string
}

type Floor = {
    title: string,
    ratio: number
}

type ResolvedMap = {

}

type Enemy = {
    id: string
    name: string
    displayIdInBook: string
    special: number | number[]
    hp: number
    atk: number
    def: number
    money: number
    exp: number
    point: number
    [key: string]: any
}

type Item = {
    cls: string
    [key: string]: any
}

type Save = {
    
}

type MotaAction = { 
    type: string, 
    [key: string]: any 
} | string

type SystemFlags = {
    enableXxx: boolean
    flyNearStair: boolean
    steelDoorWithoutKey: boolean
    betweenAttackMax: boolean
    ignoreChangeFloor: boolean
    disableShopOnDamage: boolean
    blurFg: boolean
}

type event = { type: string, [key: string]: any }
    
type step = 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward'

type HeroStatus = {
    equipment: []
    lv: number
    name: string
    hp: number
    hpmax: number
    mana: number
    manamax: number
    atk: number
    def: number
    mdef: number
    money: number
    exp: number
    loc: {
        direction: direction
        x: number
        y: number
    }
    items: {
        keys: { [key: string]: number }
        constants: { [key: string]: number }
        tools: { [key: string]: number }
        equips: { [key: string]: number }
    }
    flags: { [key: string]: any }
    steps: number
    statistics: {
        battle: number
        battleDamage: number
        currTime: number
        exp: number
        extraDamage: number
        hp: number
        ignoreSteps: number
        money: number
        moveDirectly: number
        poisonDamage: number
        start: number
        totalTime: number
    }
    [key: string]: any
}

type gameStatus = {
    played: boolean
    gameOver: boolean

    /** 当前勇士状态信息。例如core.status.hero.atk就是当前勇士的攻击力数值 */
    hero: HeroStatus

    /** 当前层的floorId */
    floorId: string
    /** 获得所有楼层的地图信息 */
    maps: { [key: string]: ResolvedMap }
    /** 获得当前楼层信息，等价于core.status.maps[core.status.floorId] */
    thisMap: ResolvedMap
    bgmaps: { [key: string]: number[][] }
    fgmaps: { [key: string]: number[][] }
    mapBlockObjs: { [key: string]: any }
    /** 显伤伤害 */
    checkBlock: {}
    damage: {}

    lockControl: boolean

    /** 勇士移动状态 */ 
    heroMoving: number
    heroStop: boolean

    // 自动寻路相关
    automaticRoute: {
        autoHeroMove: boolean
        autoStep: number
        movedStep: number
        destStep: number
        destX: any
        destY: any
        offsetX: any
        offsetY: any
        autoStepRoutes: []
        moveStepBeforeStop: []
        lastDirection: any
        cursorX: any
        cursorY: any
        moveDirectly: boolean
    },

    // 按下键的时间：为了判定双击
    downTime: number
    ctrlDown: boolean

    // 路线&回放
    route: [],
    replay: {
        replaying: boolean
        pausing: boolean
        /** 正在某段动画中 */animate: boolean
        toReplay: []
        totalList: []
        speed: number
        steps: number
        save: []
    }

    // event事件
    shops: {}
    event: {
        id: null
        data: null
        selection: null
        ui: null
        interval: null
    }
    autoEvents: []
    textAttribute: {
        position: string
        offset: number
        title: rgbarray
        background: rgbarray
        text: rgbarray
        titlefont: number
        textfont: number
        bold: boolean
        time: number
        letterSpacing: number
        animateTime: number
    },
    globalAttribute: {
        equipName: string[]
        statusLeftBackground: string
        statusTopBackground: string
        toolsBackground: string
        borderColor: string
        statusBarColor: string
        floorChangingStyle: string
        font: string
    }
    curtainColor: null

    // 动画
    globalAnimateObjs: []
    floorAnimateObjs: []
    boxAnimateObjs: []
    autotileAnimateObjs: []
    globalAnimateStatus: number
    animateObjs: []
}

/** @file control.js 主要用来进行游戏控制，比如行走控制、自动寻路、存读档等等游戏核心内容。 */
declare class control {

    /**
     * 开启调试模式, 此模式下可以按Ctrl键进行穿墙, 并忽略一切事件。
     * 此模式下不可回放录像和上传成绩。
     */
    debug(): void

    /**
     * 立刻刷新状态栏和地图显伤
     * @param doNotCheckAutoEvents 是否不检查自动事件
     */
    updateStatusBar(doNotCheckAutoEvents?: boolean): void

    /**
     * 设置某个自定义变量或flag
     * @example core.setFlag('xyz', 2) // 设置变量xyz为2
     * @param name 变量名
     * @param value 要设置的值
     */
    setFlag(name: string, value: any): void

    /**
     * 获取某个自定义变量或flag
     * @example core.getFlag('point', 2) // 获得变量point的值；如果该变量从未定义过则返回2
     * @param name 变量名
     * @param defaultValue 该变量不存在时返回的值。
     * @returns 变量的值
     */
    getFlag(name: string, defaultValue: any): any

    /**
     * 返回是否存在某个变量且不为0。等价于 core.getFlag('xyz', 0)!=0
     */
    hasFlag(name: string): boolean

    /** 删除某个flag/变量 */
    removeFlag(name: string): void

    /** 设置某个独立开关 */
    setSwitch(x: number, y: number, floorId: string, name: string, value: any): void

    /** 获得某个独立开关 */
    getSwitch(x: number, y: number, floorId: string, name: string, defaultValue: any): any

    /** 增加某个独立开关 */
    addSwitch(x: number, y: number, floorId: string, name: string, value: any): void

    /** 判定某个独立开关 */
    hasSwitch(x: number, y: number, floorId: string, name: string): boolean

    /** 删除独立开关 */
    removeSwitch(x: number, y: number, floorId: string, name: string): boolean

    /** 设置大地图的偏移量 */
    setGameCanvasTranslate(canvasId: string, x: number, y: number): void

    /** 更新大地图的可见区域 */
    updateViewport(): void

    /** 立刻聚集所有的跟随者 */
    gatherFollowers(): void

    /** 回放下一个操作 */
    replay(): void
    
    /**
     * 进入标题画面
     * @example core.showStartAnimate(); // 重启游戏但不重置bgm
     * @param noAnimate 可选，true表示不由黑屏淡入而是立即亮屏
     * @param callback 可选，完全亮屏后的回调函数
     */
    showStartAnimate(noAnimate?: boolean, callback?: () => void): void
    
    /**
     * 淡出标题画面
     * @example core.hideStartAnimate(core.startGame); // 淡出标题画面并开始新游戏，跳过难度选择
     * @param callback 标题画面完全淡出后的回调函数
     */
    hideStartAnimate(callback?: () => void): void
    
    /**
     * 半自动寻路，用于鼠标或手指拖动
     * @example core.setAutomaticRoute(0, 0, [{direction: "right", x: 4, y: 9}, {direction: "right", x: 5, y: 9}, {direction: "right", x: 6, y: 9}, {direction: "up", x: 6, y: 8}]);
     * @param destX 鼠标或手指的起拖点横坐标
     * @param destY 鼠标或手指的起拖点纵坐标
     * @param stepPostfix 拖动轨迹的数组表示，每项为一步的方向和目标点。
     */
    setAutomaticRoute(destX: number, destY: number, stepPostfix: Array<{ direction: direction, x: number, y: number }>): void
    
    /**
     * 连续行走
     * @example core.setAutoHeroMove([{direction: "up", step: 1}, {direction: "left", step: 3}, {direction: "right", step: 3}, {direction: "up", step: 9}]); // 上左左左右右右上9
     * @param steps 压缩的步伐数组，每项表示朝某方向走多少步
     */
    setAutoHeroMove(steps: Array<{ direction: direction, step: number }>): void
    
    /**
     * 尝试前进一步，如果面前不可被踏入就会直接触发该点事件
     * @example core.moveAction(core.doAction); // 尝试前进一步，然后继续事件处理。常用于在事件流中让主角像自由行动时一样前进一步，可以照常触发moveOneStep（跑毒和计步）和面前的事件（包括但不限于阻激夹域捕）
     * @param callback 走一步后的回调函数，可选
     */
    moveAction(callback?: () => void): void
    
    /**
     * 连续前进，不撞南墙不回头
     * @example core.moveHero(); // 连续前进
     * @param direction 可选，如果设置了就会先转身到该方向
     * @param callback 可选，如果设置了就只走一步
     */
    moveHero(direction?: direction, callback?: () => void): void
    
    /**
     * 等待主角停下
     * @example core.waitHeroToStop(core.vibrate); // 等待主角停下，然后视野左右抖动1秒
     * @param callback 主角停止后的回调函数
     */
    waitHeroToStop(callback?: () => void): void
    
    /**
     * 主角转向并计入录像，不会导致跟随者聚集，会导致视野重置到以主角为中心
     * @example core.turnHero(); // 主角顺时针旋转90°，即单击主角或按下Z键的效果
     * @param direction 主角的新朝向，可为 up, down, left, right, :left, :right, :back 七种之一
     */
    turnHero(direction?: direction): void
    
    /**
     * 尝试瞬移，如果该点有图块/事件/阻激夹域捕则会瞬移到它旁边再走一步（不可踏入的话当然还是触发该点事件），这一步的方向优先和瞬移前主角的朝向一致
     * @example core.tryMoveDirectly(6, 0); // 尝试瞬移到地图顶部的正中央，以样板0层为例，实际效果是瞬移到了上楼梯下面一格然后向上走一步并触发上楼事件
     * @param destX 目标点的横坐标
     * @param destY 目标点的纵坐标
     */
    tryMoveDirectly(destX: number, destY: number): void
    
    /**
     * 绘制主角和跟随者并重置视野到以主角为中心
     * @example core.drawHero(); // 原地绘制主角的静止帧
     * @param status 绘制状态，一般用stop
     * @param offset 相对主角逻辑位置的偏移量，不填视为无偏移
     * @param frame 绘制第几帧
     */
    drawHero(status?: 'stop' | 'leftFoot' | 'rightFoot', offset?: number, frame?: number): void
    
    /**
     * 获取主角面前第n格的横坐标
     * @example core.closeDoor(core.nextX(), core.nextY(), 'yellowDoor', core.turnHero); // 在主角面前关上一扇黄门，然后主角顺时针旋转90°
     * @param n 目标格与主角的距离，面前为正数，背后为负数，脚下为0，不填视为1
     */
    nextX(n?: number): number
    
    /**
     * 获取主角面前第n格的纵坐标
     * @example core.jumpHero(core.nextX(2), core.nextY(2)); // 主角向前跃过一格，即跳跃靴道具的使用效果
     * @param n 目标格与主角的距离，面前为正数，背后为负数，脚下为0，不填视为1
     */
    nextY(n?: number): number
    
    /**
     * 判定主角是否身处某个点的锯齿领域(取曼哈顿距离)
     * @example core.nearHero(6, 6, 6); // 判定主角是否身处点（6，6）的半径为6的锯齿领域
     * @param x 领域的中心横坐标
     * @param y 领域的中心纵坐标
     * @param n 领域的半径，不填视为1
     */
    nearHero(x: number, y: number, n?: number): boolean
    
    /**
     * 重算并绘制地图显伤
     * @example core.updateDamage(); // 更新当前地图的显伤，绘制在显伤层（废话）
     * @param floorId 地图id，不填视为当前地图。预览地图时填写
     * @param ctx 绘制到的画布，如果填写了就会画在该画布而不是显伤层
     */
    updateDamage(floorId?: string, ctx?: CanvasRenderingContext2D): void
    
    /** 仅重绘地图显伤 */
    drawDamage(ctx?: CanvasRenderingContext2D): void

    /**
     * 设置主角的某个属性
     * @example core.setStatus('loc', {x : 0, y : 0, direction : 'up'}); // 设置主角位置为地图左上角，脸朝上
     * @param name 属性的英文名，其中'x'、'y'和'direction'会被特殊处理为 core.setHeroLoc(name, value)，其他的('exp'被视为'exp')会直接对 core.status.hero[name] 赋值
     * @param value 属性的新值
     */
    setStatus<K extends keyof HeroStatus>(name: K, value: HeroStatus[K]): void
    
    /**
     * 增减主角的某个属性，等价于core.setStatus(name, core.getStatus(name) + value)
     * @example core.addStatus('name', '酱'); // 在主角的名字后加一个“酱”字
     * @param name 属性的英文名
     * @param value 属性的增量，请注意旧量和增量中只要有一个是字符串就会把两者连起来成为一个更长的字符串
     */
    addStatus<K extends keyof HeroStatus>(name: K, value: HeroStatus[K]): void
    
    /**
     * 读取主角的某个属性，不包括百分比修正
     * @example core.getStatus('loc'); // 读取主角的坐标和朝向
     * @param name 属性的英文名，其中'x'、'y'和'direction'会被特殊处理为 core.getHeroLoc(name)，其他的('exp'被视为'exp')会直接读取 core.status.hero[name]
     * @returns 属性值
     */
    getStatus<K extends keyof HeroStatus>(name: K): HeroStatus[K]
    
    /**
     * 计算主角的某个属性，包括百分比修正
     * @example core.getRealStatus('atk'); // 计算主角的攻击力，包括百分比修正。战斗使用的就是这个值
     * @param name 属性的英文名，请注意只能用于数值类属性哦，否则乘法会得到NaN
     */
    getRealStatus(name: string): any

    /** 获得某个状态的名字 */
    getStatusLabel(name: string): string
    
    /**
     * 设置主角某个属性的百分比修正倍率，初始值为1，
     * 倍率存放在flag: '__'+name+'_buff__' 中
     * @example core.setBuff('atk', 0.5); // 主角能发挥出的攻击力减半
     * @param name 属性的英文名，请注意只能用于数值类属性哦，否则随后的乘法会得到NaN
     * @param value 新的百分比修正倍率，不填（效果上）视为1
     */
    setBuff(name: string, value?: number): void
    
    /**
     * 增减主角某个属性的百分比修正倍率，加减法叠加和抵消。等价于 core.setBuff(name, core.getBuff(name) + value)
     * @example core.addBuff('atk', -0.1); // 主角获得一层“攻击力减一成”的负面效果
     * @param name 属性的英文名，请注意只能用于数值类属性哦，否则随后的乘法会得到NaN
     * @param value 倍率的增量
     */
    addBuff(name: string, value: number): void
    
    /**
     * 读取主角某个属性的百分比修正倍率，初始值为1
     * @example core.getBuff('atk'); // 主角当前能发挥出多大比例的攻击力
     * @param name 属性的英文名
     */
    getBuff(name: string): number

    /**
     * 获得或移除毒衰咒效果
     * @param action 获得还是移除，'get'为获得，'remove'为移除
     * @param type 要获得或移除的毒衰咒效果
     */
    triggerDebuff(action: string, type: string|string[]): void
    
    /**
     * 设置勇士位置
     * 值得注意的是，这句话虽然会使勇士改变位置，但并不会使界面重新绘制；
     * 如需立刻重新绘制地图还需调用：core.clearMap('hero'); core.drawHero(); 来对界面进行更新。
     * @example core.setHeroLoc('x', 5) // 将勇士当前位置的横坐标设置为5。
     * @param name 要设置的坐标属性
     * @param value 新值
     * @param noGather 是否聚集跟随者 
     */
    setHeroLoc(name: 'x' | 'y', value: number, noGather?: boolean): void
    setHeroLoc(name: 'direction', value: direction, noGather?: boolean): void
    
    /**
     * 读取主角的位置和/或朝向
     * @example core.getHeroLoc(); // 读取主角的位置和朝向
     * @param name 要读取横坐标还是纵坐标还是朝向还是都读取
     * @returns name ? core.status.hero.loc[name] : core.status.hero.loc
     */
    getHeroLoc(): { x: number, y: number, direction: direction }
    getHeroLoc(name: 'x' | 'y'): number
    getHeroLoc(name: 'direction'): direction
    
    /**
     * 根据级别的数字获取对应的名称，后者定义在全塔属性
     * @example core.getLvName(); // 获取主角当前级别的名称，如“下级佣兵”
     * @param lv 级别的数字，不填则视为主角当前的级别
     * @returns 级别的名称，如果不存在就还是返回数字
     */
    getLvName(lv?: number): string | number
    
    /**
     * 获得下次升级需要的经验值。
     * 升级扣除模式下会返回经验差值；非扣除模式下会返回总共需要的经验值。
     * 如果无法进行下次升级，返回null。
     */
    getNextLvUpNeed() : number

    /**
     * 设置一个flag变量
     * @example core.setFlag('poison', true); // 令主角中毒
     * @param name 变量名，支持中文
     * @param value 变量的新值，不填或填null视为删除
     */
    setFlag(name: string, value?: any): void
    
    /**
     * 增减一个flag变量，等价于 core.setFlag(name, core.getFlag(name, 0) + value)
     * @example core.addFlag('hatred', 1); // 增加1点仇恨值
     * @param name 变量名，支持中文
     * @param value 变量的增量
     */
    addFlag(name: string, value: number | string): void
    
    /**
     * 读取一个flag变量
     * @param name 变量名，支持中文
     * @param defaultValue 当变量不存在时的返回值，可选（事件流中默认填0）。
     * @returns flags[name] ?? defaultValue
     */
    getFlag(name: string, defaultValue?: any): any
    
    /**
     * 判定一个flag变量是否存在且不为false、0、''、null、undefined和NaN
     * @example core.hasFlag('poison'); // 判断主角当前是否中毒
     * @param name 变量名，支持中文
     * @returns !!core.getFlag(name)
     */
    hasFlag(name: string): boolean
    
    /**
     * 设置天气，不计入存档。如需长期生效请使用core.events._action_setWeather()函数
     * @example core.setWeather('fog', 10); // 设置十级大雾天
     * @param type 新天气的类型，不填视为无天气
     * @param level 新天气（晴天除外）的级别，必须为不大于10的正整数，不填视为5
     */
    setWeather(type?: 'rain' | 'snow' | 'sun' | 'fog' | 'cloud', level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10): void
    
    /** 注册一个天气 */
    registerWeather(name: string, initFunc: (level: number) => void, frameFunc?: (timestamp: number, level: number) => void): void

    /** 注销一个天气 */
    unregisterWeather(name: string) : void;

    /**
     * 更改画面色调，不计入存档。如需长期生效请使用core.events._action_setCurtain()函数
     * @example core.setCurtain(); // 恢复画面色调，用时四分之三秒
     * @param color 一行三列（第四列视为1）或一行四列（第四列若大于1则会被视为1，第四列若为负数则会被视为0）的颜色数组，不填视为[0, 0, 0, 0]
     * @param time 渐变时间，单位为毫秒。不填视为750ms，负数视为0（无渐变，立即更改）
     * @param callback 更改完毕后的回调函数，可选。事件流中常取core.doAction
     */
    setCurtain(color?: [number, number, number, number?], time?: number, moveMode?: string, callback?: () => void): void
    
    /**
     * 画面闪烁
     * @example core.screenFlash([255, 0, 0, 1], 3); // 红屏一闪而过
     * @param color 一行三列（第四列视为1）或一行四列（第四列若大于1则会被视为1，第四列若填负数则会被视为0）的颜色数组，必填
     * @param time 单次闪烁时长，实际闪烁效果为先花其三分之一的时间渐变到目标色调，再花剩余三分之二的时间渐变回去
     * @param times 闪烁的总次数，不填或填0都视为1
     * @param callback 闪烁全部完毕后的回调函数，可选
     */
    screenFlash(color: [number, number, number, number], time: number, times?: number, moveMode?: string, callback?: () => void): void
    
    /**
     * 播放背景音乐，中途开播但不计入存档且只会持续到下次场景切换。如需长期生效请将背景音乐的文件名赋值给flags.__bgm__
     * @example core.playBgm('bgm.mp3', 30); // 播放bgm.mp3，并跳过前半分钟
     * @param bgm 背景音乐的文件名，支持全塔属性中映射前的中文名
     * @param startTime 跳过前多少秒，不填则不跳过
     */
    playBgm(bgm: string, startTime?: number): void

    /**
     * 注册一个 animationFrame 
     * @param name 名称，可用来作为注销使用
     * @param needPlaying 是否只在游戏运行时才执行（在标题界面不执行）
     * @param func 要执行的函数，或插件中的函数名；可接受timestamp（从页面加载完毕到当前所经过的时间）作为参数
     */ 
    registerAnimationFrame(name: string, needPlaying: boolean, func?: (timestamp: number) => void): void

    /** 注销一个animationFrame */
    unregisterAnimationFrame(name: string): void

    /** 游戏是否已经开始 */
    isPlaying(): boolean

    /** 清除游戏状态和数据 */
    clearStatus(): void

    /** 清除自动寻路路线 */
    clearAutomaticRouteNode(x?: any, y?: any): void

    /** 停止自动寻路操作 */
    stopAutomaticRoute(): void

    /** 保存剩下的寻路，并停止 */
    saveAndStopAutomaticRoute(): void

    /** 继续剩下的自动寻路操作 */
    continueAutomaticRoute(): void

    /** 清空剩下的自动寻路列表 */
    clearContinueAutomaticRoute(callback?: () => any): void

    /** 设置行走的效果动画 */
    setHeroMoveInterval(callback?: () => any): void

    /** 每移动一格后执行的事件 */
    moveOneStep(callback?: () => any): void

    /** 当前是否正在移动 */
    isMoving(): boolean

    /** 瞬间移动 */
    moveDirectly(destX?: any, destY?: any, ignoreSteps?: any): void

    /** 改变勇士的不透明度 */
    setHeroOpacity(opacity?: number, moveMode?: string, time?: any, callback?: () => any): void

    /** 加减画布偏移 */
    addGameCanvasTranslate(x?: number, y?: number): void

    /**
     * 设置视野范围 
     * px,py: 左上角相对大地图的像素坐标，不需要为32倍数
     */
    setViewport(px?: number, py?: number): void

    /** 移动视野范围 */
    moveViewport(x: number, y: number, moveMode?: string, time?: number, callback?: () => any): void

    /** 更新跟随者坐标 */
    updateFollowers(): void

    /** 更新领域、夹击、阻击的伤害地图 */
    updateCheckBlock(floorId?: string): void

    /** 检查并执行领域、夹击、阻击事件 */
    checkBlock(): void

    /** 选择录像文件 */
    chooseReplayFile(): void

    /** 开始播放 */
    startReplay(list?: any): void

    /** 更改播放状态 */
    triggerReplay(): void

    /** 暂停播放 */
    pauseReplay(): void

    /** 恢复播放 */
    resumeReplay(): void

    /** 单步播放 */
    stepReplay(): void

    /** 加速播放 */
    speedUpReplay(): void

    /** 减速播放 */
    speedDownReplay(): void

    /** 设置播放速度 */
    setReplaySpeed(speed?: number): void

    /** 停止播放 */
    stopReplay(force?: boolean): void

    /** 回退 */
    rewindReplay(): void

    /** 是否正在播放录像 */
    isReplaying(): boolean

    /**
     * 注册一个录像行为
     * @param name 自定义名称，可用于注销使用
     * @param func 具体执行录像的函数，可为一个函数或插件中的函数名；
     *              需要接受一个action参数，代表录像回放时的下一个操作
     *              func返回true代表成功处理了此录像行为，false代表没有处理此录像行为。
     */
    registerReplayAction(name: string, func: (action?: string) => boolean): void

    /** 注销一个录像行为 */
    unregisterReplayAction(name: string): void

    /** 自动存档 */
    autosave(removeLast?: any): void

    /** 实际进行自动存档 */
    checkAutosave(): void

    /** 实际进行存读档事件 */
    doSL(id?: string, type?: any): void

    /** 同步存档到服务器 */
    syncSave(type?: any): void

    /** 从服务器加载存档 */
    syncLoad(): void

    /** 存档到本地 */
    saveData(): any

    /** 从本地读档 */
    loadData(data?: any, callback?: () => any): any

    /** 获得某个存档内容 */
    getSave(index?: any, callback?: () => any): any

    /** 获得某些存档内容 */
    getSaves(ids?: any, callback?: () => any): any

    /** 获得所有存档内容 */
    getAllSaves(callback?: () => any): any

    /** 获得所有存在存档的存档位 */
    getSaveIndexes(callback?: () => any): any

    /** 判断某个存档位是否存在存档 */
    hasSave(index?: number): boolean

    /** 删除某个存档 */
    removeSave(index?: number, callback?: () => any): void

    /** 从status中获得属性，如果不存在则从勇士属性中获取 */
    getStatusOrDefault(status?: any, name?: string): any

    /** 从status中获得实际属性（增幅后的），如果不存在则从勇士属性中获取 */
    getRealStatusOrDefault(status?: any, name?: string): any

    /** 获得勇士原始属性（无装备和衰弱影响） */
    getNakedStatus(name?: string): any

    /** 锁定用户控制，常常用于事件处理 */
    lockControl(): void

    /** 解锁用户控制 */
    unlockControl(): void

    /** 清空录像折叠信息 */
    clearRouteFolding(): void

    /** 检查录像折叠信息 */
    checkRouteFolding(): void

    /** 获得映射文件名 */
    getMappedName(name?: string): string

    /** 暂停背景音乐的播放 */
    pauseBgm(): void

    /** 恢复背景音乐的播放 */
    resumeBgm(resumeTime?: number): void

    /** 设置背景音乐的播放速度和音调 */
    setBgmSpeed(speed: number, usePitch?: boolean): void

    /** 设置音乐图标的显隐状态 */
    setMusicBtn(): void

    /** 开启或关闭背景音乐的播放 */
    triggerBgm(): void

    /** 播放一个音效 */
    playSound(sound: string, pitch?: number, callback?: () => any): number

    /** 停止（所有）音频 */
    stopSound(id?: number): void

    /** 获得正在播放的所有（指定）音效的id列表 */
    getPlayingSounds(name?: string): Array<number>

    /** 检查bgm状态 */
    checkBgm(): void

    /** 设置屏幕放缩 */
    setDisplayScale(delta: number): void

    /** 清空状态栏 */
    clearStatusBar(): void

    /** 显示状态栏 */
    showStatusBar(): void

    /** 隐藏状态栏 */
    hideStatusBar(showToolbox?: boolean): void

    /** 更新状态栏的勇士图标 */
    updateHeroIcon(name: string): void

    /** 改变工具栏为按钮1-8 */
    setToolbarButton(useButton?: boolean): void

    /**
     * 注册一个resize函数
     * @param name 名称，可供注销使用
     * @param func 可以是一个函数，或者是插件中的函数名；可以接受obj参数，详见resize函数。
     */
    registerResize(name: string, func: (obj: any) => void): void

    /** 注销一个resize函数 */
    unregisterResize(name: string): void

    /** 屏幕分辨率改变后重新自适应 */
    resize(): void
}

/**@file events.js将处理所有和事件相关的操作。 */
declare class events {

    /**
     * 开始新游戏
     * @example core.startGame('咸鱼乱撞', 0, ''); // 开始一局咸鱼乱撞难度的新游戏，随机种子为0
     * @param hard 难度名，会显示在左下角（横屏）或右下角（竖屏）
     * @param seed 随机种子，相同的种子保证了录像的可重复性
     * @param route 经由base64压缩后的录像，用于从头开始的录像回放
     * @param callback 回调函数，可选
     */
    startGame(hard: string, seed: number, route: string, callback?: () => void): void
    
    /**
     * 游戏结束
     * @example core.gameOver(); // 游戏失败
     * @param ending 结局名，省略表示失败
     * @param fromReplay true表示在播放录像，可选
     * @param norank true表示不计入榜单，可选
     */
    gameOver(ending?: string, fromReplay?: boolean, norank?: boolean): void
    
    /**
     * 战斗，如果填写了坐标就会删除该点的敌人并触发战后事件
     * @example core.battle('greenSlime'); // 和从天而降的绿头怪战斗（如果打得过）
     * @param id 敌人id，必填
     * @param x 敌人的横坐标，可选
     * @param y 敌人的纵坐标，可选
     * @param force true表示强制战斗，可选
     * @param callback 回调函数，可选
     */
    battle(id: string, x?: number, y?: number, force?: boolean, callback?: () => void): void
    
    /**
     * 开门（包括三种基础墙）
     * @example core.openDoor(0, 0, true, core.jumpHero); // 打开左上角的门，需要钥匙，然后主角原地跳跃半秒
     * @param x 门的横坐标
     * @param y 门的纵坐标
     * @param needKey true表示需要钥匙，会导致机关门打不开
     * @param callback 门完全打开后或打不开时的回调函数，可选
     */
    openDoor(x: number, y: number, needKey?: boolean, callback?: () => void): void
    
    /**
     * 获得道具并提示，如果填写了坐标就会删除该点的该道具
     * @example core.getItem('book'); // 获得敌人手册并提示
     * @param id 道具id，必填
     * @param num 获得的数量，不填视为1，填了就别填坐标了
     * @param x 道具的横坐标，可选
     * @param y 道具的纵坐标，可选
     * @param callback 回调函数，可选
     */
    getItem(id: string, num?: number, x?: number, y?: number, callback?: () => void): void
    
    /**
     * 场景切换
     * @example core.changeFloor('MT0'); // 传送到主塔0层，主角坐标和朝向不变，黑屏时间取用户设置值
     * @param floorId 传送的目标地图id，可以填':before'和':after'分别表示楼下或楼上
     * @param stair 传送的位置，可以填':now'（保持不变，可省略）,':symmetry'（中心对称）,':symmetry_x'（左右对称）,':symmetry_y'（上下对称）或图块id（该图块最好在目标层唯一，一般为'downFloor'或'upFloor'）
     * @param heroLoc 传送的坐标（如果填写了，就会覆盖上述的粗略目标位置）和传送后主角的朝向（不填表示保持不变）
     * @param time 传送的黑屏时间，单位为毫秒。不填为用户设置值
     * @param callback 黑屏结束后的回调函数，可选
     */
    changeFloor(floorId: string, stair?: string, heroLoc?: { x?: number, y?: number, direction?: direction }, time?: number, callback?: () => void): void
    
    /**
     * 执行下一个事件指令，常作为回调
     * @example core.setCurtain([0,0,0,1], undefined, null, core.doAction); // 事件中的原生脚本，配合勾选“不自动执行下一个事件”来达到此改变色调只持续到下次场景切换的效果
     * @param keepUI true表示不清除UI画布和选择光标
     */
    doAction(keepUI?: true): void
    
    /**
     * 插入一段事件；此项不可插入公共事件，请用 core.insertCommonEvent
     * @example core.insertAction('一段文字'); // 插入一个显示文章
     * @param action 单个事件指令，或事件指令数组
     * @param x 新的当前点横坐标，可选
     * @param y 新的当前点纵坐标，可选
     * @param callback 新的回调函数，可选
     * @param addToLast 插入的位置，true表示插入到末尾，否则插入到开头
     */
    insertAction(action: string | MotaAction | MotaAction[], x?: number, y?: number, callback?: () => void, addToLast?: boolean): void
    
    /**
     * 设置一项敌人属性并计入存档
     * @example core.setEnemy('greenSlime', 'def', 0); // 把绿头怪的防御设为0
     * @param id 敌人id
     * @param name 属性的英文缩写
     * @param value 属性的新值，可选
     * @param operator 操作符，可选
     * @param prefix 独立开关前缀，一般不需要，下同
     */
    setEnemy<K extends keyof Enemy>(id: string, name: K, value?: Enemy[K], operator?: string, prefix?: string): void
    
    /** 设置某个点的敌人属性 */
    setEnemyOnPoint<K extends keyof Enemy>(x: number, y: number, floorId: string, name: K, value?: Enemy[K], operator?: string, prefix?: string): void

    /** 重置某个点的敌人属性 */
    resetEnemyOnPoint(x: number, y: number, floorId?: string): void

    /** 将某个点已经设置的敌人属性移动到其他点 */
    moveEnemyOnPoint(fromX: number, fromY: number, toX: number, toY: number, floorId?: string): void

    /**
     * 设置一项楼层属性并刷新状态栏
     * @example core.setFloorInfo('ratio', 2, 'MT0'); // 把主塔0层的血瓶和宝石变为双倍效果
     * @param name 要求改的属性名
     * @param values 属性的新值
     * @param floorId 楼层id，不填视为当前层
     * @param prefix 独立开关前缀，一般不需要，下同
     */
    setFloorInfo<K extends keyof Floor>(name: K, values?: Floor[K] | boolean | number | string | [number, number] | [string, number?] | Array<string | [number, number, string, number?, number?]>, floorId?: string, prefix?: string): void
    
    /**
     * 设置一个系统开关
     * @example core.setGlobalFlag('steelDoorWithoutKey', true); // 使全塔的所有铁门都不再需要钥匙就能打开
     * @param name 系统开关的英文名
     * @param value 开关的新值，您可以用!core.flags[name]简单地表示将此开关反转
     */
    setGlobalFlag(name: keyof SystemFlags, value: boolean): void
    
    /**
     * 关门，目标点必须为空地
     * @example core.closeDoor(0, 0, 'yellowWall', core.jumpHero); // 在左上角关掉一堵黄墙，然后主角原地跳跃半秒
     * @param x 横坐标
     * @param y 纵坐标
     * @param id 门的id，也可以用三种基础墙
     * @param callback 门完全关上后的回调函数，可选
     */
    closeDoor(x: number, y: number, id: string, callback?: () => void): void
    
    /**
     * 显示一张图片
     * @example core.showImage(1, core.material.images.images['winskin.png'], [0,0,128,128], [0,0,416,416], 0.5, 1000); // 裁剪winskin.png的最左边128×128px，放大到铺满整个视野，1秒内淡入到50%透明，编号为1
     * @param code 图片编号，为不大于50的正整数，加上100后就是对应画布层的z值，较大的会遮罩较小的，注意色调层的z值为125，UI层为140
     * @param image 图片文件名（可以是全塔属性中映射前的中文名）或图片对象（见上面的例子）
     * @param sloc 一行且至多四列的数组，表示从原图裁剪的左上角坐标和宽高，可选
     * @param loc 一行且至多四列的数组，表示图片在视野中的左上角坐标和宽高，可选
     * @param opacityVal 不透明度，为小于1的正数。不填视为1
     * @param time 淡入时间，单位为毫秒。不填视为0
     * @param callback 图片完全显示出来后的回调函数，可选
     */
    showImage(code: number, image: string | HTMLImageElement, sloc?: Array<number>, loc?: Array<number>, opacityVal?: number, time?: number, callback?: () => void): void
    
    /**
     * 隐藏一张图片
     * @example core.hideImage(1, 1000, core.jumpHero); // 1秒内淡出1号图片，然后主角原地跳跃半秒
     * @param code 图片编号
     * @param time 淡出时间，单位为毫秒
     * @param callback 图片完全消失后的回调函数，可选
     */
    hideImage(code: number, time?: number, callback?: () => void): void
    
    /**
     * 移动一张图片并/或改变其透明度
     * @example core.moveImage(1, null, 0.5); // 1秒内把1号图片变为50%透明
     * @param code 图片编号
     * @param to 新的左上角坐标，省略表示原地改变透明度
     * @param opacityVal 新的透明度，省略表示不变
     * @param moveMode 移动模式
     * @param time 移动用时，单位为毫秒。不填视为1秒
     * @param callback 图片移动完毕后的回调函数，可选
     */
    moveImage(code: number, to?: [number?, number?], opacityVal?: number, moveMode?: string, time?: number, callback?: () => void): void

    /**
     * 旋转一张图片
     * @param code 图片编号
     * @param center 旋转中心像素（以屏幕为基准）；不填视为图片本身中心
     * @param angle 旋转角度；正数为顺时针，负数为逆时针
     * @param moveMode 旋转模式
     * @param time 移动用时，单位为毫秒。不填视为1秒
     * @param callback 图片移动完毕后的回调函数，可选
     */
    rotateImage(code: number, center?: [number?, number?], angle?: number, moveMode?: string, time?: number, callback?: () => void): void

    /** 放缩一张图片 */
    scaleImage(code: number, center?: [Number?, number?], scale?: number, moveMode?: string, time?: number, callback?: () => void): void

    /**
     * 绘制一张动图或擦除所有动图
     * @example core.showGif(); // 擦除所有动图
     * @param name 动图文件名，可以是全塔属性中映射前的中文名
     * @param x 动图在视野中的左上角横坐标
     * @param y 动图在视野中的左上角纵坐标
     */
    showGif(name?: string, x?: number, y?: number): void
    
    /**
     * 调节bgm的音量
     * @example core.setVolume(0, 100, core.jumpHero); // 0.1秒内淡出bgm，然后主角原地跳跃半秒
     * @param value 新的音量，为0或不大于1的正数。注意系统设置中是这个值的平方根的十倍
     * @param time 渐变用时，单位为毫秒。不填或小于100毫秒都视为0
     * @param callback 渐变完成后的回调函数，可选
     */
    setVolume(value: number, time?: number, callback?: () => void): void
    
    /**
     * 视野抖动
     * @example core.vibrate(); // 视野左右抖动1秒
     * @param direction 抖动方向
     * @param time 抖动时长，单位为毫秒
     * @param speed 抖动速度
     * @param power 抖动幅度
     * @param callback 抖动平息后的回调函数，可选
     */
    vibrate(direction?: string, time?: number, speed?: number, power?: number, callback?: () => void): void

    /**
     * 强制移动主角（包括后退），这个函数的作者已经看不懂这个函数了
     * @example core.eventMoveHero(['forward'], 125, core.jumpHero); // 主角强制前进一步，用时1/8秒，然后主角原地跳跃半秒
     * @param steps 步伐数组，注意后退时跟随者的行为会很难看
     * @param time 每步的用时，单位为毫秒。0或不填则取主角的移速，如果后者也不存在就取0.1秒
     * @param callback 移动完毕后的回调函数，可选
     */
    eventMoveHero(steps: step[], time?: number, callback?: () => void): void
    
    /**
     * 主角跳跃，跳跃勇士。ex和ey为目标点的坐标，可以为null表示原地跳跃。time为总跳跃时间。
     * @example core.jumpHero(); // 主角原地跳跃半秒
     * @param ex 跳跃后的横坐标
     * @param ey 跳跃后的纵坐标
     * @param time 跳跃时长，单位为毫秒。不填视为半秒
     * @param callback 跳跃完毕后的回调函数，可选
     */
    jumpHero(ex?: number, ey?: number, time?: number, callback?: () => void): void
    
    /**
     * 更改主角行走图
     * @example core.setHeroIcon('npc48.png', true); // 把主角从阳光变成样板0层左下角的小姐姐，但不立即刷新
     * @param name 新的行走图文件名，可以是全塔属性中映射前的中文名。映射后会被存入core.status.hero.image
     * @param noDraw true表示不立即刷新（刷新会导致大地图下视野重置到以主角为中心）
     */
    setHeroIcon(name: string, noDraw?: boolean): void
    
    /**
     * 尝试使用一个道具
     * @example core.tryUseItem('pickaxe'); // 尝试使用破墙镐
     * @param itemId 道具id，其中敌人手册、传送器和飞行器会被特殊处理
     */
    tryUseItem(itemId: string): void

    /** 初始化游戏 */
    resetGame(hero?: any, hard?: any, floorId?: string, maps?: any, values?: any): void

    /** 游戏获胜事件 */
    win(reason?: string, norank?: boolean, noexit?: boolean): void

    /** 游戏失败事件 */
    lose(reason?: string): void

    /** 重新开始游戏；此函数将回到标题页面 */
    restart(): void

    /** 询问是否需要重新开始 */
    confirmRestart(): void

    /**
     * 注册一个系统事件
     * @param type 事件名
     * @param func 为事件的处理函数，可接受(data,callback)参数 
     */
    registerSystemEvent(type: string, func: (data?: any, callback?: () => void) => void): void

    /** 注销一个系统事件 */
    unregisterSystemEvent(type: string): void

    /** 执行一个系统事件 */
    doSystemEvent(type: string, data?: any, callback?: () => any): void

    /** 
     * 触发(x,y)点的系统事件；会执行该点图块的script属性，同时支持战斗（会触发战后）、道具（会触发道具后）、楼层切换等等
     */
    trigger(x?: number, y?: number, callback?: () => any): void

    /** 战斗前触发的事件 */
    beforeBattle(enemyId?: string, x?: number, y?: number): void

    /** 战斗结束后触发的事件 */
    afterBattle(enemyId?: string, x?: number, y?: number): void

    /** 开一个门后触发的事件 */
    afterOpenDoor(doorId?: string, x?: number, y?: number): void

    /** 获得一个道具后的shij  */
    afterGetItem(id?: string, x?: number, y?: number, isGentleClick?: boolean): void

    /** 
     * 轻按获得面前的物品或周围唯一物品
     * @param noRoute 若为true则不计入录像 
     */
    getNextItem(noRoute?: boolean): void

    /** 楼层转换中 */
    changingFloor(floorId?: string, heroLoc?: any): void

    /** 转换楼层结束的事件 */
    afterChangeFloor(floorId?: string): void

    /** 是否到达过某个楼层 */
    hasVisitedFloor(floorId?: string): boolean

    /** 到达某楼层 */
    visitFloor(floorId?: string): void

    /** 推箱子 */
    pushBox(data?: any): void

    /** 推箱子后的事件 */
    afterPushBox(): void

    /** 当前是否在冰上 */
    onSki(number?: number): boolean

    /** 
     * 注册一个自定义事件
     * @param type 事件类型
     * @param func 事件的处理函数，可接受(data, x, y, prefix)参数
     *             data为事件内容，x和y为当前点坐标（可为null），prefix为当前点前缀
     */
    registerEvent(type: string, func: (data: any, x?: number, y?: number, prefix?: string) => void): void

    /** 注销一个自定义事件 */
    unregisterEvent(type: string): void

    /** 执行一个自定义事件 */
    doEvent(data?: any, x?: number, y?: number, prefix?: any): void

    /** 直接设置事件列表 */
    setEvents(list?: any, x?: number, y?: number, callback?: () => any): void

    /** 开始执行一系列自定义事件 */
    startEvents(list?: any, x?: number, y?: number, callback?: () => any): void

    /**
     * 插入一个公共事件
     * @example core.insertCommonEvent('加点事件', [3]);
     * @param name 公共事件名；如果公共事件不存在则直接忽略 
     * @param args 参数列表，为一个数组，将依次赋值给 flag:arg1, flag:arg2, ...
     * @param x 新的当前点横坐标，可选
     * @param y 新的当前点纵坐标，可选
     * @param callback 新的回调函数，可选
     * @param addToLast 插入的位置，true表示插入到末尾，否则插入到开头
     */
    insertCommonEvent(name?: string, args?: any, x?: number, y?: number, callback?: () => any, addToLast?: boolean): void

    /** 获得一个公共事件 */
    getCommonEvent(name: string): any

    /** 恢复一个事件 */
    recoverEvents(data?: any): void

    /** 检测自动事件 */
    checkAutoEvents(): void

    /** 当前是否在执行某个自动事件 */
    autoEventExecuting(symbol?: string, value?: any): boolean

    /** 当前是否执行过某个自动事件 */
    autoEventExecuted(symbol?: string, value?: any): boolean

    /** 将当前点坐标入栈 */
    pushEventLoc(x?: number, y?: number, floorId?: string): boolean

    /** 将当前点坐标入栈 */
    popEventLoc(): any

    /** 预编辑事件 */
    precompile(data?: any): any

    /** 点击怪物手册时的打开操作 */
    openBook(fromUserAction?: boolean): void

    /** 点击楼层传送器时的打开操作 */
    useFly(fromUserAction?: boolean): void

    /** 飞往某一层 */
    flyTo(toId?: string, callback?: () => boolean): void

    /** 点击存档按钮时的打开操作 */
    save(fromUserAction?: boolean): void

    /** 点击读档按钮时的打开操作 */
    load(fromUserAction?: boolean): void

    /** 点击装备栏时的打开操作 */
    openEquipbox(fromUserAction?: boolean): void

    /** 点击工具栏时的打开操作 */
    openToolbox(fromUserAction?: boolean): void

    /** 点击快捷商店按钮时的打开操作 */
    openQuickShop(fromUserAction?: boolean): void

    /** 点击虚拟键盘时的打开操作 */
    openKeyBoard(fromUserAction?: boolean): void

    /** 点击设置按钮时的操作 */
    openSettings(fromUserAction?: boolean): void

    /** 当前是否有未处理完毕的异步事件（不包含动画和音效） */
    hasAsync(): boolean

    /** 立刻停止所有异步事件 */
    stopAsync(): void

    /** 
     * 跟随
     * @param name 要跟随的一个合法的4x4的行走图名称，需要在全塔属性注册
     */
    follow(name: string): void

    /** 
     * 取消跟随 
     * @param name 取消跟随的行走图，不填则取消全部跟随者
     */
    unfollow(name?: string): void

    /** 数值操作 */
    setValue(name: string, operator: string, value: any, prefix?: string): void

    /** 数值增减 */
    addValue(name: string, value: any, prefix?: string): void

    /** 设置全塔属性 */
    setGlobalAttribute(name: string, value: any): void

    /** 设置剧情文本的属性 */
    setTextAttribute(data: any): void

    /** 清除对话框 */
    clearTextBox(code: number): void

    /** 移动对话框 */
    moveTextBox(code: number, loc: [number], relative: boolean, moveMode?: string, time?: number, callback?: () => any): void

    /** 设置文件别名 */
    setNameMap(name: string, value?: string): void

    /** 检查升级事件 */
    checkLvUp(): void
}

/** @file actions.js 定义了玩家的操作控制 */
declare class actions {
    /**
     * 此函数将注册一个用户交互行为。
     * @param action 要注册的交互类型，如 ondown, onclick, keyDown 等等。
     * @param name 你的自定义名称，可被注销使用；同名重复注册将后者覆盖前者。
     * @param func 执行函数。
     *             如果func返回true，则不会再继续执行其他的交互函数；否则会继续执行其他的交互函数。
     * @param priority 优先级；优先级高的将会被执行。此项可不填，默认为0
     */
    registerAction(action: string, name: string, func: string | ((...params: any) => void), priority?: number): void

    /** 注销一个用户交互行为 */
    unregisterAction(action: string, name: string): void

    /** 执行一个用户交互行为 */
    doRegisteredAction(action: string, ...params: any): void

    /** 按下某个键时 */
    onkeyDown(e: KeyboardEvent): void

    /** 放开某个键时 */
    onkeyUp(e: KeyboardEvent): void

    /** 按住某个键时 */
    pressKey(keyCode: number): void

    /** 根据按下键的code来执行一系列操作 */
    keyDown(keyCode: number): void

    /** 根据放开键的code来执行一系列操作 */
    keyUp(keyCode: number, altKey?: boolean, fromReplay?: boolean): void

    /** 点击（触摸）事件按下时 */
    ondown(loc: number[]): void

    /** 当在触摸屏上滑动时 */
    onmove(loc: number[]): void

    /** 当点击（触摸）事件放开时 */
    onup(loc: number[]): void

    /** 具体点击屏幕上(x,y)点时，执行的操作 */
    onclick(x: number, y: number, px: number, py: number, stepPostfix?: any): void

    /** 滑动鼠标滚轮时的操作 */
    onmousewheel(direct: 1 | -1): void

    /** 长按Ctrl键时 */
    keyDownCtrl(): void

    /** 长按 */
    longClick(x: number, y: number, px: number, py: number, fromEvent?: boolean): void

    /** 点击自绘状态栏时 */
    onStatusBarClick(e?: MouseEvent): void
}

/** @file enemys.js 定义了一系列和敌人相关的API函数。 */
declare class enemys {

    /**
     * 判定某种特殊属性的有无
     * @example core.hasSpecial('greenSlime', 1) // 判定绿头怪有无先攻属性
     * @param special 敌人id或敌人对象或正整数数组或自然数
     * @param test 待检查的属性编号
     * @returns 若special为数组或数且含有test或相等、或special为敌人id或对象且具有此属性，则返回true
     */
    hasSpecial(special: number | number[] | string | Enemy, test: number): boolean

    /**
     * 获得某种敌人的全部特殊属性名称
     * @example core.getSpecialText('greenSlime') // ['先攻', '3连击', '破甲', '反击']
     * @param enemy 敌人id或敌人对象，如core.material.enemys.greenSlime
     * @returns 字符串数组
     */
    getSpecialText(enemy: string | Enemy): string[]

    /**
     * 获得某种敌人的某种特殊属性的介绍
     * @example core.getSpecialHint('bat', 1) // '先攻：怪物首先攻击'
     * @param enemy 敌人id或敌人对象，用于确定属性的具体数值，否则可选
     * @param special 属性编号，可以是该敌人没有的属性
     * @returns 属性的介绍，以属性名加中文冒号开头
     */
    getSpecialHint(enemy: string | Enemy, special: number): string

    /** 获得某个敌人的某项属性值 */
    getEnemyValue(enemy: string | Enemy, name: string, x?: number, y?: number, floorId?: string): any

    /**
     * 判定主角当前能否打败某只敌人
     * @example core.canBattle('greenSlime',0,0,'MT0') // 能否打败主塔0层左上角的绿头怪（假设有）
     * @param enemy 敌人id或敌人对象
     * @param x 敌人的横坐标，可选
     * @param y 敌人的纵坐标，可选
     * @param floorId 敌人所在的地图，可选
     * @returns true表示可以打败，false表示无法打败
     */
    canBattle(enemy: string | Enemy, x?: number, y?: number, floorId?: string): boolean

    /**
     * 获得某只敌人对主角的总伤害
     * @example core.getDamage('greenSlime',0,0,'MT0') // 绿头怪的总伤害
     * @param enemy 敌人id或敌人对象
     * @param x 敌人的横坐标，可选
     * @param y 敌人的纵坐标，可选
     * @param floorId 敌人所在的地图，可选
     * @returns 总伤害，如果因为没有破防或无敌怪等其他原因无法战斗，则返回null
     */
    getDamage(enemy: string | Enemy, x?: number, y?: number, floorId?: string): number

    /**
     * 获得某只敌人的地图显伤，包括颜色
     * @example core.getDamageString('greenSlime', 0, 0, 'MT0') // 绿头怪的地图显伤
     * @param enemy 敌人id或敌人对象
     * @param x 敌人的横坐标，可选
     * @param y 敌人的纵坐标，可选
     * @param floorId 敌人所在的地图，可选
     * @returns damage: 表示伤害值或为'???'，color: 形如'#RrGgBb'
     */
    getDamageString(enemy: string | Enemy, x?: number, y?: number, floorId?: string): {
        damage: string,
        color: string
    }

    /**
     * 获得某只敌人接下来的若干个临界及其减伤，算法基于useLoop开关选择回合法或二分法
     * @example core.nextCriticals('greenSlime', 9, 0, 0, 'MT0') // 绿头怪接下来的9个临界
     * @param enemy 敌人id或敌人对象
     * @param number 要计算的临界数量，可选，默认为1
     * @param x 敌人的横坐标，可选
     * @param y 敌人的纵坐标，可选
     * @param floorId 敌人所在的地图，可选
     * @returns 两列的二维数组，每行表示一个临界及其减伤
     */
    nextCriticals(enemy: string | Enemy, number?: number, x?: number, y?: number, floorId?: string): number[][]

    /**
     * 计算再加若干点防御能使某只敌人对主角的总伤害降低多少
     * @example core.nextCriticals('greenSlime', 10, 0, 0, 'MT0') // 再加10点防御能使绿头怪的伤害降低多少
     * @param enemy 敌人id或敌人对象
     * @param k 假设主角增加的防御力，可选，默认为1
     * @param x 敌人的横坐标，可选
     * @param y 敌人的纵坐标，可选
     * @param floorId 敌人所在的地图，可选
     * @returns 总伤害的减少量
     */
    getDefDamage(enemy: string | Enemy, k?: number, x?: number, y?: number, floorId?: string): number

    /**
     * 获得某张地图的敌人集合，用于手册绘制
     * @example core.getCurrentEnemys('MT0') // 主塔0层的敌人集合
     * @param floorId 地图id，可选
     * @returns 敌人集合，按伤害升序排列，支持多朝向怪合并
     */
    getCurrentEnemys(floorId?: string): Enemy[]

    /**
     * 检查某些楼层是否还有漏打的（某种）敌人
     * @example core.hasEnemyLeft('greenSlime', ['sample0', 'sample1']) // 样板0层和1层是否有漏打的绿头怪
     * @param enemyId 敌人id，可选，默认为任意敌人
     * @param floorId 地图id或其数组，可选，默认为当前地图
     * @returns true表示有敌人被漏打，false表示敌人已死光
     */
    hasEnemyLeft(enemyId?: string, floorId?: string | string[]): boolean

    /** 获得所有怪物原始数据的一个副本 */
    getEnemys(): any

    /** 获得所有特殊属性定义 */
    getSpecials(): void

    /** 获得所有特殊属性的颜色 */
    getSpecialColor(enemy: string | Enemy): void

    /** 获得所有特殊属性的额外标记 */
    getSpecialFlag(enemy: string | Enemy): void

    /** 获得怪物真实属性 */
    getEnemyInfo(enemy: string | Enemy, hero?: any, x?: number, y?: number, floorId?: string): void

    /** 获得战斗伤害信息（实际伤害计算函数） */
    getDamageInfo(enemy: string | Enemy, hero?: any, x?: number, y?: number, floorId?: string): void
}

/** @file maps.js负责一切和地图相关的处理内容 */
declare class maps {

    /**
     * 根据图块id得到数字（地图矩阵中的值）
     * @example core.getNumberById('yellowWall'); // 1
     * @param id 图块id
     * @returns 图块的数字，定义在project\maps.js（请注意和project\icons.js中的“图块索引”相区分！）
     */
    getNumberById(id: string): number
    
    /**
     * 生成事件层矩阵
     * @example core.getMapArray('MT0'); // 生成主塔0层的事件层矩阵，隐藏的图块视为0
     * @param floorId 地图id，不填视为当前地图
     * @param showDisable 可选，true表示隐藏的图块也会被表示出来
     * @returns 事件层矩阵，注意对其阵元的访问是[y][x]
     */
    getMapArray(floorId?: string, noCache?: boolean): number[][]

    /** 判定图块的事件层数字；不存在为0 */
    getMapNumber(floorId?: string, noCache?: boolean): number
    
    /**
     * 生成背景层矩阵
     * @example core.getBgMapArray('MT0'); // 生成主塔0层的背景层矩阵，使用缓存
     * @param floorId 地图id，不填视为当前地图
     * @param noCache 可选，true表示不使用缓存
     * @returns 背景层矩阵，注意对其阵元的访问是[y][x]
     */
    getBgMapArray(floorId?: string, noCache?: boolean): number[][]
    
    /**
     * 生成前景层矩阵
     * @example core.getFgMapArray('MT0'); // 生成主塔0层的前景层矩阵，使用缓存
     * @param floorId 地图id，不填视为当前地图
     * @param noCache 可选，true表示不使用缓存
     * @returns 前景层矩阵，注意对其阵元的访问是[y][x]
     */
    getFgMapArray(floorId?: string, noCache?: boolean): number[][]
    
    /**
     * 判定背景层的一个位置是什么
     * @example core.getBgNumber(); // 判断主角脚下的背景层图块的数字
     * @param x 横坐标，不填为当前勇士坐标
     * @param y 纵坐标，不填为当前勇士坐标
     * @param floorId 地图id，不填视为当前地图
     * @param 可选，true表示不使用缓存而强制重算
     */
    getBgNumber(x?: number, y?: number, floorId?: string, noCache?: boolean): number
    
    /**
     * 判定前景层的一个位置是什么
     * @example core.getFgNumber(); // 判断主角脚下的前景层图块的数字
     * @param x 横坐标，不填为当前勇士坐标
     * @param y 纵坐标，不填为当前勇士坐标
     * @param floorId 地图id，不填视为当前地图
     * @param 可选，true表示不使用缓存而强制重算
     */
    getFgNumber(x?: number, y?: number, floorId?: string, noCache?: boolean): number
    
    /**
     * 可通行性判定
     * @example core.generateMovableArray(); // 判断当前地图主角从各点能向何方向移动
     * @param floorId 地图id，不填视为当前地图
     * @returns 从各点可移动方向的三维数组
     */
    generateMovableArray(floorId?: string): Array<Array<Array<direction>>>
    
    /**
     * 单点单朝向的可通行性判定
     * @exmaple core.canMoveHero(); // 判断主角是否可以前进一步
     * @param x 起点横坐标，不填视为主角当前的
     * @param y 起点纵坐标，不填视为主角当前的
     * @param direction 移动的方向，不填视为主角面对的方向
     * @param floorId 地图id，不填视为当前地图
     * @returns true表示可移动，false表示不可移动
     */
    canMoveHero(x?: number, y?: number, direction?: direction, floorId?: string): boolean
    
    /**
     * 能否瞬移到某点，并求出节约的步数。
     * @example core.canMoveDirectly(0, 0); // 能否瞬移到地图左上角
     * @param destX 目标点的横坐标
     * @param destY 目标点的纵坐标
     * @returns 正数表示节约的步数，-1表示不可瞬移
     */
    canMoveDirectly(destX: number, destY: number): number
    
    /**
     * 自动寻路
     * @example core.automaticRoute(0, 0); // 自动寻路到地图左上角
     * @param destX 目标点的横坐标
     * @param destY 目标点的纵坐标
     * @returns 每步走完后主角的loc属性组成的一维数组
     */
    automaticRoute(destX: number, destY: number): Array<{ direction: direction, x: number, y: number }>
    
    /**
     * 地图重绘
     * @example core.drawMap(); // 重绘当前地图，常用于更改贴图后或自动元件的刷新
     * @param floorId 地图id，省略表示当前楼层
     * @param callback 重绘完毕后的回调函数，可选
     */
    drawMap(floorId?: string, callback?: () => void): void
    
    /**
     * 绘制背景层（含贴图，其与背景层矩阵的绘制顺序可通过复写此函数来改变）
     * @example core.drawBg(); // 绘制当前地图的背景层
     * @param floorId 地图id，不填视为当前地图
     * @param ctx 某画布的ctx，用于绘制缩略图，一般不需要
     */
    drawBg(floorId?: string, ctx?: CanvasRenderingContext2D): void
    
    /**
     * 绘制事件层
     * @example core.drawEvents(); // 绘制当前地图的事件层
     * @param floorId 地图id，不填视为当前地图
     * @param blocks 一般不需要
     * @param ctx 某画布的ctx，用于绘制缩略图，一般不需要
     */
    drawEvents(floorId?: string, blocks?: Block[], ctx?: CanvasRenderingContext2D): void
    
    /**
     * 绘制前景层（含贴图，其与前景层矩阵的绘制顺序可通过复写此函数来改变）
     * @example core.drawFg(); // 绘制当前地图的前景层
     * @param floorId 地图id，不填视为当前地图
     * @param ctx 某画布的ctx，用于绘制缩略图，一般不需要
     */
    drawFg(floorId?: string, ctx?: CanvasRenderingContext2D): void
    
    /**
     * 绘制缩略图
     * @example core.drawThumbnail(); // 绘制当前地图的缩略图
     * @param floorId 地图id，不填视为当前地图
     * @param blocks 一般不需要
     * @param options 额外的绘制项，可选。可以增绘主角位置和朝向、采用不同于游戏中的主角行走图、增绘显伤、提供flags用于存读档
     */
    drawThumbnail(floorId?: string, blocks?: Block[], options?: object): void
    
    /**
     * 判定某个点是否不可被踏入（不基于主角生命值和图块cannotIn属性）
     * @example core.noPass(0, 0); // 判断地图左上角能否被踏入
     * @param x 目标点的横坐标
     * @param y 目标点的纵坐标
     * @param floorId 目标点所在的地图id，不填视为当前地图
     * @returns true表示可踏入
     */
    noPass(x: number, y: number, floorId?: string): boolean
    
    /**
     * 判定某个点的图块id
     * @example if(core.getBlockId(x1, y1) != 'greenSlime' && core.getBlockId(x2, y2) != 'redSlime') core.openDoor(x3, y3); // 一个简单的机关门事件，打败或炸掉这一对绿头怪和红头怪就开门
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     * @param showDisable 隐藏点是否不返回null，true表示不返回null
     * @returns 图块id，该点无图块则返回null
     */
    getBlockId(x: number, y: number, floorId?: string, showDisable?: boolean): string | null
    
    /** 判定某个点的图块数字；空图块为0 */
    getBlockNumber(x: number, y: number, floorId?: string, showDisable?: boolean): number

    /**
     * 判定某个点的图块类型
     * @example if(core.getBlockCls(x1, y1) != 'enemys' && core.getBlockCls(x2, y2) != 'enemy48') core.openDoor(x3, y3); // 另一个简单的机关门事件，打败或炸掉这一对不同身高的敌人就开门
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     * @param showDisable 隐藏点是否不返回null，true表示不返回null
     * @returns 图块类型，即“地形、四帧动画、矮敌人、高敌人、道具、矮npc、高npc、自动元件、额外地形”之一
     */
    getBlockCls(x: number, y: number, floorId?: string, showDisable?: boolean): 'terrains' | 'animates' | 'enemys' | 'enemy48' | 'items' | 'npcs' | 'npc48' | 'autotile' | 'tileset' | null
    
    /**
     * 搜索图块, 支持通配符
     * @example core.searchBlock('*Door'); // 搜索当前地图的所有门
     * @param id 图块id，支持星号表示任意多个（0个起）字符
     * @param floorId 地图id，不填视为当前地图
     * @param showDisable 隐藏点是否计入，true表示计入
     * @returns 一个详尽的数组，一般只用到其长度
     */
    searchBlock(id: string, floorId?: string|Array<string>, showDisable?: boolean): Array<{ floorId: string, index: number, x: number, y: number, block: Block }>
    
    /**
     * 根据给定的筛选函数搜索全部满足条件的图块
     * @example core.searchBlockWithFilter(function (block) { return block.event.id.endsWith('Door'); }); // 搜索当前地图的所有门
     * @param blockFilter 筛选函数，可接受block输入，应当返回一个boolean值
     * @param floorId 地图id，不填视为当前地图
     * @param showDisable 隐藏点是否计入，true表示计入
     * @returns 一个详尽的数组
     */
    searchBlockWithFilter(blockFilter: (Block) => boolean, floorId?: string|Array<string>, showDisable?: boolean): Array<{ floorId: string, index: number, x: number, y: number, block: Block }>

    /**
     * 显示（隐藏或显示的）图块，此函数将被“显示事件”指令和勾选了“不消失”的“移动/跳跃事件”指令（如阻击怪）的终点调用
     * @example core.showBlock(0, 0); // 显示地图左上角的图块
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     */
    showBlock(x: number, y: number, floorId?: string): void
    
    /**
     * 隐藏一个图块，对应于「隐藏事件」且不删除
     * @example core.hideBlock(0, 0); // 隐藏地图左上角的图块
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     */
    hideBlock(x: number, y: number, floorId?: string): void
    
    /**
     * 删除一个图块，对应于「隐藏事件」并同时删除
     * @example core.removeBlock(0, 0); // 尝试删除地图左上角的图块
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     */
    removeBlock(x: number, y: number, floorId?: string): void
    
    /**
     * 显隐背景/前景层图块
     * @example core.maps._triggerBgFgMap('show', 'fg', [0, 0]); // 显示地图左上角的前景层图块
     * @param type 显示还是隐藏
     * @param name 背景还是前景
     * @param loc 两列的自然数数组，表示要显隐的点的坐标
     * @param floorId 地图id，不填视为当前地图
     * @param callback 显隐完毕后的回调函数，可选
     */
    //_triggerBgFgMap(type: 'show' | 'hide', name: 'bg' | 'fg', loc: [number, number] | Array<[number, number]>, floorId?: string, callback?: () => void): void
    
    /**
     * 显隐楼层贴图
     * @example core.maps._triggerFloorImage('show', [0, 0]); // 显示当前地图以左上角为左上角的贴图
     * @param type 显示还是隐藏
     * @param loc 两列的自然数数组，表示要显隐的点的坐标，坐标的单位为像素！！！
     * @param floorId 地图id，不填视为当前地图
     * @param callback 显隐完毕后的回调函数，可选
     */
    //_triggerFloorImage(type: 'show' | 'hide', loc: [number, number] | Array<[number, number]>, floorId?: string, callback?: () => void): void
    
    /**
     * 转变图块
     * @example core.setBlock(1, 0, 0); // 把地图左上角变成黄墙
     * @param number 新图块的数字（也支持纯数字字符串如'1'）或id
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     */
    setBlock(number: number | string, x: number, y: number, floorId?: string): void
    
    /**
     * 批量替换图块
     * @example core.replaceBlock(21, 22, core.floorIds); // 把游戏中地上当前所有的黄钥匙都变成蓝钥匙
     * @param fromNumber 旧图块的数字
     * @param toNumber 新图块的数字
     * @param floorId 地图id或其数组，不填视为当前地图
     */
    replaceBlock(fromNumber: number, toNumber: number, floorId?: string | Array<string>): void
    
    /**
     * 转变图层块
     * @example core.setBgFgBlock('bg', 167, 6, 6); // 把当前地图背景层的中心块改为滑冰
     * @param name 背景还是前景
     * @param number 新图层块的数字（也支持纯数字字符串如'1'）或id
     * @param x 横坐标
     * @param y 纵坐标
     * @param floorId 地图id，不填视为当前地图
     */
    setBgFgBlock(name: 'bg' | 'fg', number: number | string, x: number, y: number, floorId?: string): void
    
    /**
     * 移动图块
     * @example core.moveBlock(0, 0, ['down']); // 令地图左上角的图块下移一格，用时半秒，再花半秒淡出
     * @param x 起点的横坐标
     * @param y 起点的纵坐标
     * @param steps 步伐数组
     * @param time 单步和淡出用时，单位为毫秒。不填视为半秒
     * @param keep 是否不淡出，true表示不淡出
     * @param callback 移动或淡出后的回调函数，可选
     */
    moveBlock(x: number, y: number, steps: step[], time?: number, keep?: boolean, callback?: () => void): void
    
    /**
     * 跳跃图块；从V2.7开始不再有音效
     * @example core.jumpBlock(0, 0, 0, 0); // 令地图左上角的图块原地跳跃半秒，再花半秒淡出
     * @param sx 起点的横坐标
     * @param sy 起点的纵坐标
     * @param ex 终点的横坐标
     * @param ey 终点的纵坐标
     * @param time 单步和淡出用时，单位为毫秒。不填视为半秒
     * @param keep 是否不淡出，true表示不淡出
     * @param callback 落地或淡出后的回调函数，可选
     */
    jumpBlock(sx: number, sy: number, ex: number, ey: number, time?: number, keep?: boolean, callback?: () => void): void
    
    /**
     * 播放动画，注意即使指定了主角的坐标也不会跟随主角移动，如有需要请使用core.drawHeroAnimate(name, callback)函数
     * @example core.drawAnimate('attack', core.nextX(), core.nextY(), false, core.vibrate); // 在主角面前一格播放普攻动画，动画停止后视野左右抖动1秒
     * @param name 动画文件名，不含后缀
     * @param x 绝对横坐标
     * @param y 绝对纵坐标
     * @param alignWindow 是否是相对窗口的坐标
     * @param callback 动画停止后的回调函数，可选
     * @returns 一个数字，可作为core.stopAnimate()的参数来立即停止播放（届时还可选择是否执行此次播放的回调函数）
     */
    drawAnimate(name: string, x: number, y: number, alignWindow: boolean, callback?: () => void): number

    /**
     * 播放跟随勇士的动画
     * @param name 动画名
     * @param callback 动画停止后的回调函数，可选
     * @returns 一个数字，可作为core.stopAnimate()的参数来立即停止播放（届时还可选择是否执行此次播放的回调函数）
     */
    drawHeroAnimate(name: string, callback?: () => void): number

    /**
     * 立刻停止一个动画播放
     * @param id 播放动画的编号，即drawAnimate或drawHeroAnimate返回值
     * @param doCallback 是否执行该动画的回调函数
     */
    stopAnimate(id?: number, doCallback?: boolean): void 

    /** 获得当前正在播放的所有（指定）动画的id列表 */
    getPlayingAnimates(name?: string) : Array<number>

    /** 加载某个楼层（从剧本或存档中） */
    loadFloor(floorId?: string, map?: any): any

    /** 根据需求解析出blocks */
    extractBlocks(map?: any): void

    /** 根据需求为UI解析出blocks */
    extractBlocks(map?: any, flags?: any): void

    /** 根据数字获得图块 */
    getBlockByNumber(number: number): any

    /** 根据ID获得图块 */
    getBlockById(id: string): any

    /** 获得当前事件点的ID */
    getIdOfThis(id?: string): string

    /** 初始化一个图块 */
    initBlock(x?: number, y?: number, id?: string | number, addInfo?: boolean, eventFloor?: any): any

    /** 压缩地图 */
    compressMap(mapArr?: any, floorId?: string): any

    /** 解压缩地图 */
    decompressMap(mapArr?: any, floorId?: string): any

    /** 将当前地图重新变成数字，以便于存档 */
    saveMap(floorId?: string): any

    /** 将存档中的地图信息重新读取出来 */
    loadMap(data?: any, floorId?: string, flags?: any): any

    /** 更改地图画布的尺寸 */
    resizeMap(floorId?: string): void

    /** 以x,y的形式返回每个点的事件 */
    getMapBlocksObj(floorId?: string, noCache?: boolean): any

    /** 获得某些点可否通行的信息 */
    canMoveDirectlyArray(locs?: any): any

    /** 绘制一个图块 */
    drawBlock(block?: any, animate?: any): void

    /** 生成groundPattern */
    generateGroundPattern(floorId?: string): void

    /** 某个点是否存在NPC */
    npcExists(x?: number, y?: number, floorId?: string): boolean

    /** 某个点是否存在（指定的）地形 */
    terrainExists(x?: number, y?: number, id?: string, floorId?: string): boolean

    /** 某个点是否存在楼梯 */
    stairExists(x?: number, y?: number, floorId?: string): boolean

    /** 当前位置是否在楼梯边；在楼传平面塔模式下对箭头也有效 */
    nearStair(): boolean

    /** 某个点是否存在（指定的）怪物 */
    enemyExists(x?: number, y?: number, id?: string, floorId?: string): boolean

    /** 获得某个点的block */
    getBlock(x?: number, y?: number, floorId?: string, showDisable?: boolean): Block

    /** 获得某个图块或素材的信息，包括ID，cls，图片，坐标，faceIds等等 */
    getBlockInfo(block?: any): any

    /** 获得某个图块对应行走图朝向向下的那一项的id；如果不存在行走图绑定则返回自身id */
    getFaceDownId(block?: any): string

    /** 根据图块的索引来隐藏图块 */
    hideBlockByIndex(index?: any, floorId?: string): void

    /** 一次性隐藏多个block */
    hideBlockByIndexes(indexes?: any, floorId?: string): void

    /** 根据block的索引（尽可能）删除该块 */
    removeBlockByIndex(index?: any, floorId?: string): void

    /** 一次性删除多个block */
    removeBlockByIndexes(indexes?: any, floorId?: string): void

    /** 显示前景/背景地图 */
    showBgFgMap(name?: string, loc?: any, floorId?: string, callback?: () => any): void

    /** 隐藏前景/背景地图 */
    hideBgFgMap(name?: string, loc?: any, floorId?: string, callback?: () => any): void

    /** 显示一个楼层贴图 */
    showFloorImage(loc?: any, floorId?: string, callback?: () => any): void

    /** 隐藏一个楼层贴图 */
    hideFloorImage(loc?: any, floorId?: string, callback?: () => any): void

    /** 动画形式转变某点图块 */
    animateSetBlock(number?: number | string, x?: number, y?: number, floorId?: string, time?: number, callback?: () => any): void

    /** 动画形式同时转变若干点图块 */
    animateSetBlocks(number?: number | string, locs?: any, floorId?: string, time?: number, callback?: () => any): void

    /** 事件转向 */
    turnBlock(direction?: string, x?: number, y?: number, floorId?: string): void

    /** 重置地图 */
    resetMap(floorId?: string | string[]): void

    /** 显示/隐藏某个块时的动画效果 */
    animateBlock(loc?: any, type?: any, time?: any, callback?: () => any): void

    /** 添加一个全局动画 */
    addGlobalAnimate(block?: any): void

    /** 删除一个或所有全局动画 */
    removeGlobalAnimate(x?: number, y?: number, name?: string): void

    /** 绘制UI层的box动画 */
    drawBoxAnimate(): void
}

/** @file loader.js 主要负责资源的加载 */
declare class loader {
    /** 加载一系列图片 */
    loadImages(dir: any, names: any, toSave: any, callback?: () => any) : any

    /** 加载某一张图片 */
    loadImage(dir: any, imgName?: any, callback?: () => any): any

    /** 从zip中加载一系列图片 */
    loadImagesFromZip(url?: any, names?: any, toSave?: any, onprogress?: any, onfinished?: any): any

    /** 加载一个音乐 */
    loadOneMusic(name?: string): any

    /** 加载一个音效 */
    loadOneSound(name?: string): any

    /** 加载一个bgm */
    loadBgm(name?: string): any

    /** 释放一个bgm的缓存 */
    freeBgm(name?: string): any
}

/** @file items.js 主要负责一切和道具相关的内容。 */
declare class items {

    /**
     * 即捡即用类的道具获得时的效果
     * @example core.getItemEffect('redPotion', 10) // 执行获得10瓶红血的效果
     * @param itemId 道具id
     * @param itemNum 道具数量，可选，默认为1
     */
    getItemEffect(itemId: string, itemNum?: number): void

    /**
     * 即捡即用类的道具获得时的额外提示
     * @example core.getItemEffectTip(redPotion) // （获得 红血瓶）'，生命+100'
     * @param itemId 道具id
     * @returns 图块属性itemEffectTip的内容
     */
    getItemEffectTip(itemId: string): string

    /**
     * 使用一个道具
     * @example core.useItem('pickaxe', true) // 使用破墙镐，不计入录像，无回调
     * @param itemId 道具id
     * @param noRoute 是否不计入录像，快捷键使用的请填true，否则可省略
     * @param callback 道具使用完毕或使用失败后的回调函数
     */
    useItem(itemId: string, noRoute?: boolean, callback?: () => void): void

    /**
     * 检查能否使用某种道具
     * @example core.canUseItem('pickaxe') // 能否使用破墙镐
     * @param itemId 道具id
     * @returns true表示可以使用
     */
    canUseItem(itemId: string): boolean

    /**
     * 统计某种道具的持有量
     * @example core.itemCount('yellowKey') // 持有多少把黄钥匙
     * @param itemId 道具id
     * @returns 该种道具的持有量，不包括已穿戴的装备
     */
    itemCount(itemId: string): number

    /**
     * 检查主角是否持有某种道具(不包括已穿戴的装备)
     * @example core.hasItem('yellowKey') // 主角是否持有黄钥匙
     * @param itemId 道具id
     * @returns true表示持有
     */
    hasItem(itemId: string): boolean

    /**
     * 检查主角是否穿戴着某件装备
     * @example core.hasEquip('sword5') // 主角是否装备了神圣剑
     * @param itemId 装备id
     * @returns true表示已装备
     */
    hasEquip(itemId: string): boolean

    /**
     * 检查主角某种类型的装备目前是什么
     * @example core.getEquip(1) // 主角目前装备了什么盾牌
     * @param equipType 装备类型，自然数
     * @returns 装备id，null表示未穿戴
     */
    getEquip(equipType: number): string

    /**
     * 设置某种道具的持有量
     * @example core.setItem('yellowKey', 3) // 设置黄钥匙为3把
     * @param itemId 道具id
     * @param itemNum 新的持有量，可选，自然数，默认为0
     */
    setItem(itemId: string, itemNum?: number): void

    /**
     * 静默增减某种道具的持有量 不会更新游戏画面或是显示提示
     * @example core.addItem('yellowKey', -2) // 没收两把黄钥匙
     * @param itemId 道具id
     * @param itemNum 增加量，负数表示没收
    */
    addItem(itemId: string, itemNum?: number): void

    /**
     * 判定某件装备的类型
     * @example core.getEquipTypeById('shield5') // 1（盾牌）
     * @param equipId 装备id
     * @returns 类型编号，自然数
     */
    getEquipTypeById(equipId: string): number

    /**
     * 检查能否穿上某件装备
     * @example core.canEquip('sword5', true) // 主角可以装备神圣剑吗，如果不能会有提示
     * @param equipId 装备id
     * @param hint 无法穿上时是否提示（比如是因为未持有还是别的什么原因）
     * @returns true表示可以穿上，false表示无法穿上
     */
    canEquip(equipId: string, hint: boolean): boolean

    /**
     * 尝试穿上某件背包里的装备并提示
     * @example core.loadEquip('sword5') // 尝试装备上背包里的神圣剑，无回调
     * @param equipId 装备id
     * @param callback 穿戴成功或失败后的回调函数
     */
    loadEquip(equipId: string, callback?: () => void): void

    /**
     * 脱下某个类型的装备
     * @example core.unloadEquip(1) // 卸下盾牌，无回调
     * @param equipType 装备类型编号，自然数
     * @param callback 卸下装备后的回调函数
     */
    unloadEquip(equipType: number, callback?: () => void): void

    /**
     * 比较两件（类型可不同）装备的优劣
     * @example core.compareEquipment('sword5', 'shield5') // 比较神圣剑和神圣盾的优劣
     * @param compareEquipId 装备甲的id
     * @param beComparedEquipId 装备乙的id
     * @returns 两装备的各属性差，甲减乙，0省略
     */
    compareEquipment(compareEquipId: string, beComparedEquipId: string): { [key: string]: number}

    /**
     * 保存当前套装
     * @example core.quickSaveEquip(1) // 将当前套装保存为1号套装
     * @param index 套装编号，自然数
     */
    quickSaveEquip(index: number): void

    /**
     * 快速换装
     * @example core.quickLoadEquip(1) // 快速换上1号套装
     * @param index 套装编号，自然数
     */
    quickLoadEquip(index: number): void

    /** 获得所有道具 */
    getItems(): void

    /** 删除某个物品 */
    removeItem(itemId?: string, itemNum?: number): void

    /** 根据类型获得一个可用的装备孔 */
    getEquipTypeByName(name?: string): void

    /**
     * 设置某个装备的属性并计入存档
     * @example core.setEquip('sword1', 'value', 'atk', 300, '+='); // 设置铁剑的攻击力数值再加300
     * @param equipId 装备id
     * @param valueType 增幅类型，只能是value（数值）或percentage（百分比）
     * @param name 要修改的属性名称，如atk
     * @param value 要修改到的属性数值
     * @param operator 操作符，可选，如+=表示在原始值上增加
     * @param prefix 独立开关前缀，一般不需要
     */
     setEquip(equipId: string, valueType: string, name: string, value: any, operator?: string, prefix?: string): void
}

/** @file ui.js 主要用来进行UI窗口的绘制，如对话框、怪物手册、楼传器、存读档界面等等。*/
declare class ui {

    /**
     * 根据画布名找到一个画布的context；支持系统画布和自定义画布。如果不存在画布返回null。
     * 也可以传画布的context自身，则返回自己。
     */
    getContextByName(canvas: CtxRefer): CanvasRenderingContext2D

    /**
     * 清空某个画布图层
     * name为画布名，可以是系统画布之一，也可以是任意自定义动态创建的画布名；还可以直接传画布的context本身。（下同）
     * 如果name也可以是'all'，若为all则为清空所有系统画布。
     */
    clearMap(name: CtxRefer): void

    /**
     * 在某个画布上绘制一段文字
     * @param text 要绘制的文本
     * @param style 绘制的样式
     * @param font 绘制的字体
     */
    fillText(name: CtxRefer, text: string, x: number, y: number, style?: string, font?: string, maxWidth?: number): void

    /**
     * 在某个画布上绘制一个描黑边的文字
     * @param text 要绘制的文本
     * @param style 绘制的样式
     * @param strokeStyle 绘制的描边颜色
     * @param font 绘制的字体
     */
    fillBoldText(name: CtxRefer, text: string, x: number, y: number, style?: string, strokeStyle?: string, font?: string, maxWidth?: number): void

    /**
     * 绘制一个矩形。style可选为绘制样式
     * @param style 绘制的样式
     * @param angle 旋转角度，弧度制
     */
    fillRect(name: CtxRefer, x: number, y: number, width: number, height: number, style?: string, angle?: number): void

    /**
     * 绘制一个矩形的边框
     * @param style 绘制的样式
     */
    strokeRect(name: CtxRefer, x: number, y: number, width: number, height: number, style: string, angle?: number): void

    /**
     * 动态创建一个画布。name为要创建的画布名，如果已存在则会直接取用当前存在的。
     * x,y为创建的画布相对窗口左上角的像素坐标，width,height为创建的长宽。
     * zIndex为创建的纵向高度（关系到画布之间的覆盖），z值高的将覆盖z值低的；系统画布的z值可在个性化中查看。
     * 返回创建的画布的context，也可以通过core.dymCanvas[name]调用
     */
    createCanvas(name: string, x: number, y: number, width: number, height: number, zIndex: number): CanvasRenderingContext2D

    /** 重新定位一个自定义画布 */
    relocateCanvas(name: string, x: number, y: number, useDelta: boolean): void

    /** 重新设置一个自定义画布的大小 */
    resizeCanvas(name: string, x: number, y: number): void

    /** 设置一个自定义画布的旋转角度 */
    rotateCanvas(name: string, angle: number, centerX?: number, centerY?: number): void

    /** 删除一个自定义画布 */
    deleteCanvas(name: string | ((name: string) => boolean)): void

    /** 清空所有的自定义画布 */
    deleteAllCanvas(): void

    /**
     *  在一个画布上绘制图片
     *  后面的8个坐标参数与canvas的drawImage的八个参数完全相同。
     *  请查看 http://www.w3school.com.cn/html5/canvas_drawimage.asp 了解更多。
     * @param name 可以是系统画布之一，也可以是任意自定义动态创建的画布名 画布名称或者画布的context
     * @param image 要绘制的图片，可以是一个全塔属性中定义的图片名（会从images中去获取），图片本身，或者一个画布。
     */
    drawImage(name: CtxRefer,
        image: CanvasImageSource | string, dx: number): void
    drawImage(name: CtxRefer,
        image: CanvasImageSource | string, dx: number, dy: number, dw: number, dh: number): void
    drawImage(name: CtxRefer,
        image: CanvasImageSource | string,
        sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

    /** 根据最大宽度自动缩小字体 */
    setFontForMaxWidth(name: string | CanvasRenderingContext2D, text: string, maxWidth: number, font?: any): string

    /** 在某个canvas上绘制一个圆角矩形 */
    fillRoundRect(name: string | CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, style?: string, angle?: number): void

    /** 在某个canvas上绘制一个圆角矩形的边框 */
    strokeRoundRect(name: string | CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, style?: string, lineWidth?: number, angle?: number): void

    /** 在某个canvas上绘制一个多边形 */
    fillPolygon(name: string | CanvasRenderingContext2D, nodes?: any, style?: string): void

    /** 在某个canvas上绘制一个多边形的边框 */
    strokePolygon(name: string | CanvasRenderingContext2D, nodes?: any, style?: string, lineWidth?: number): void

    /** 在某个canvas上绘制一个椭圆 */
    fillEllipse(name: string | CanvasRenderingContext2D, x: number, y: number, a: number, b: number, angle?: number, style?: any): void

    /** 在某个canvas上绘制一个圆 */
    fillCircle(name: string | CanvasRenderingContext2D, x: number, y: number, r: number, style?: string): void

    /** 在某个canvas上绘制一个椭圆的边框 */
    strokeEllipse(name: string | CanvasRenderingContext2D, x: number, y: number, a: number, b: number, angle?: number, style?: string, lineWidth?: number): void

    /** 在某个canvas上绘制一个圆的边框 */
    strokeCircle(name: string | CanvasRenderingContext2D, x: number, y: number, r: any, style?: string, lineWidth?: number): void

    /** 在某个canvas上绘制一个扇形 */
    fillArc(name: string | CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, style?: string): void

    /** 在某个canvas上绘制一段弧 */
    strokeArc(name: string | CanvasRenderingContext2D, x: number, y: number, r: number, start: number, end: number, style?: string, lineWidth?: number): void

    /** 保存某个canvas状态 */
    saveCanvas(name: string | CanvasRenderingContext2D): void

    /** 加载某个canvas状态 */
    loadCanvas(name: string | CanvasRenderingContext2D): void

    /** 设置某个canvas的baseline */
    setTextBaseline(name: string | CanvasRenderingContext2D, baseline: any): void

    /** 字符串自动换行的分割 */
    splitLines(name: string | CanvasRenderingContext2D, text: string, maxWidth?: number, font?: string): void

    /** 在某个canvas上绘制一个图标 */
    drawIcon(name: string | CanvasRenderingContext2D, id: string, x: number, y: number, w?: number, h?: number, frame?: number): void

    /** 结束一切事件和绘制，关闭UI窗口，返回游戏进程 */
    closePanel(): void

    /** 清空UI层内容 */
    clearUI(): void

    /** 
     * 左上角绘制一段提示
     * @param text 要提示的文字内容，支持 ${} 语法
     * @param id 要绘制的图标ID
     * @param frame 要绘制图标的第几帧
     */
    drawTip(text: string, id?: string, frame?: number): void

    /** 地图中间绘制一段文字 */
    drawText(contents: string, callback?: () => any): void

    /** 自绘选择光标 */
    drawUIEventSelector(code: number, background: string, x: number, y: number, w: number, h: number, z?: number): void

    /** 清除一个或多个选择光标 */
    clearUIEventSelector(code: number|number[]): void

    /** 绘制一个确认框 */
    drawConfirmBox(text: string, yesCallback?: () => void, noCallback?: () => void): void

    /** 绘制WindowSkin */
    drawWindowSkin(background: any, ctx: string | CanvasRenderingContext2D, x: number, y: number, w: string, h: string, direction?: any, px?: any, py?: any): void

    /** 绘制一个背景图，可绘制winskin或纯色背景；支持小箭头绘制 */
    drawBackground(left: string, top: string, right: string, bottom: string, posInfo?: any): void

    /** 
     * 绘制一段文字到某个画布上面
     * @param ctx 要绘制到的画布
     * @param content 要绘制的内容；转义字符不允许保留 \t, \b 和 \f
     * @param config 绘制配置项，目前暂时包含如下内容（均为可选）
     *                left, top：起始点位置；maxWidth：单行最大宽度；color：默认颜色；align：左中右
     *                fontSize：字体大小；lineHeight：行高；time：打字机间隔；font：默认字体名
     * @returns 绘制信息 
     */ 
    drawTextContent(ctx: string | CanvasRenderingContext2D, content: string, config: any): any

    /** 获得某段文字的预计绘制高度；参见 drawTextContent */
    getTextContentHeight(content: string, config?: any): void

    /** 绘制一个对话框 */
    drawTextBox(content: string, config?: any): void

    /** 绘制滚动字幕 */
    drawScrollText(content: string, time: number, lineHeight?: number, callback?: () => any): void

    /** 文本图片化 */
    textImage(content: string, lineHeight?: number): any

    /** 绘制一个选项界面 */
    drawChoices(content: string, choices: any): void

    /** 绘制等待界面 */
    drawWaiting(text: string): void

    /** 绘制分页 */
    drawPagination(page?: any, totalPage?: any, y?: number): void

    /** 绘制怪物手册 */
    drawBook(index?: any): void

    /** 绘制楼层传送器 */
    drawFly(page?: any): void

    /** 获得所有应该在道具栏显示的某个类型道具 */
    getToolboxItems(cls: string): string[]

    /** 绘制状态栏 */
    drawStatusBar(): void

    /** 绘制灯光效果 */
    drawLight(name: string | CanvasRenderingContext2D, color?: any, lights?: any, lightDec?: number): void

    /** 在某个canvas上绘制一条线 */
    drawLine(name: string | CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number): void

    /** 在某个canvas上绘制一个箭头 */
    drawArrow(name: string | CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number): void

    /** 设置某个canvas的文字字体 */
    setFont(name: string | CanvasRenderingContext2D, font: string): void

    /** 设置某个canvas的线宽度 */
    setLineWidth(name: string | CanvasRenderingContext2D, lineWidth: number): void

    /** 设置某个canvas的alpha值；返回设置之前画布的不透明度。 */
    setAlpha(name: string | CanvasRenderingContext2D, alpha: number): number

    /** 设置某个canvas的filter属性 */
    setFilter(name: string | CanvasRenderingContext2D, filter: any): void

    /** 设置某个canvas的透明度；尽量不要使用本函数，而是全部换成setAlpha实现 */
    setOpacity(name: string | CanvasRenderingContext2D, opacity: number): void

    /** 设置某个canvas的绘制属性（如颜色等） */
    setFillStyle(name: string | CanvasRenderingContext2D, style: string): void

    /** 设置某个canvas边框属性 */
    setStrokeStyle(name: string | CanvasRenderingContext2D, style: string): void

    /** 设置某个canvas的对齐 */
    setTextAlign(name: string | CanvasRenderingContext2D, align: string): void

    /** 计算某段文字的宽度 */
    calWidth(name: string | CanvasRenderingContext2D, text: string, font?: string): number
}

/** 工具类 主要用来进行一些辅助函数的计算 */
declare class utils {

    /**
     * 将一段文字中的${}（表达式）进行替换。
     * @example core.replaceText('衬衫的价格是${status:hp}镑${item:yellowKey}便士。'); // 把主角的生命值和持有的黄钥匙数量代入这句话
     * @param text 模板字符串，可以使用${}计算js表达式，支持“状态、物品、变量、独立开关、全局存储、图块id、图块类型、敌人数据、装备id”等量参与运算
     * @returns 替换完毕后的字符串
     */
    replaceText(text: string, prefix?: string): string

    /**
     * 对一个表达式中的特殊规则进行替换，如status:xxx等。
     * @example core.replaceValue('衬衫的价格是${status:hp}镑${item:yellowKey}便士。'); // 把这两个冒号表达式替换为core.getStatus('hp')和core.itemCount('yellowKey')这样的函数调用
     * @param value 模板字符串，注意独立开关不会被替换
     * @returns 替换完毕后的字符串
     */
    replaceValue(value: string): string

    /**
     * 计算一个表达式的值，支持status:xxx等的计算。
     * @example core.calValue('status:hp + status:def'); // 计算主角的生命值加防御力
     * @param value 待求值的表达式
     * @param prefix 独立开关前缀，一般可省略
     * @returns 求出的值
     */
    calValue(value: string, prefix?: string): any

    /**
     * 将b（可以是另一个数组）插入数组a的开头，此函数用于弥补a.unshift(b)中b只能是单项的不足。
     * @example core.unshift(todo, {type: 'unfollow'}); // 在事件指令数组todo的开头插入“取消所有跟随者”指令
     * @param a 原数组
     * @param b 待插入的新首项或前缀数组
     * @returns 插入完毕后的新数组，它是改变原数组a本身得到的
     */
    unshift(a: any[], b: any): any[]

    /**
     * 将b（可以是另一个数组）插入数组a的末尾，此函数用于弥补a.push(b)中b只能是单项的不足。
     * @example core.push(todo, {type: 'unfollow'}); // 在事件指令数组todo的末尾插入“取消所有跟随者”指令
     * @param a 原数组
     * @param b 待插入的新末项或后缀数组
     * @returns 插入完毕后的新数组，它是改变原数组a本身得到的
     */
    push(a: any[], b: any): any[]

    /**
     * 设置一个全局存储，适用于global:xxx，录像播放时将忽略此函数。
     * @example core.setBlobal('一周目已通关', true); // 设置全局存储“一周目已通关”为true，方便二周目游戏中的新要素。
     * @param key 全局变量名称，支持中文
     * @param value 全局变量的新值，不填或null表示清除此全局存储
     */
    setGlobal(key: string, value?: any): void

    /**
     * 读取一个全局存储，适用于global:xxx，支持录像。
     * @example if (core.getGlobal('一周目已通关', false) === true) core.getItem('dagger'); // 二周目游戏进行到此处时会获得一把屠龙匕首
     * @param key 全局变量名称，支持中文
     * @param defaultValue 可选，当此全局变量不存在或值为null、undefined时，用此值代替
     * @returns 全局变量的值
     */
    getGlobal(key: string, defaultValue?: any): any

    /**
     * 深拷贝一个对象(函数将原样返回)
     * @example core.clone(core.status.hero, (name, value) => (name == 'items' || typeof value == 'number'), false); // 深拷贝主角的属性和道具
     * @param data 待拷贝对象
     * @param filter 过滤器，可选，表示data为数组或对象时拷贝哪些项或属性，true表示拷贝
     * @param recursion 过滤器是否递归，可选。true表示过滤器也被递归
     * @returns 拷贝的结果，注意函数将原样返回
     */
    clone<T>(data?: T, filter?: (name: string, value: any) => boolean, recursion?: boolean): T

    /** 深拷贝一个1D或2D的数组 */
    cloneArray(data?: Array<number>|Array<Array<number>>): Array<number>|Array<Array<number>>

    /**
     * 等比例切分一张图片
     * @example core.splitImage(core.material.images.images['npc48.png'], 32, 48); // 把npc48.png切分成若干32×48px的小人
     * @param image 图片名（支持映射前的中文名）或图片对象（参见上面的例子），获取不到时返回[]
     * @param width 子图的宽度，单位为像素。原图总宽度必须是其倍数，不填视为32
     * @param height 子图的高度，单位为像素。原图总高度必须是其倍数，不填视为正方形
     * @returns 子图组成的数组，在原图中呈先行后列，从左到右、从上到下排列。
     */
    splitImage(image?: string | HTMLImageElement, width?: number, height?: number): HTMLImageElement[]

    /**
     * 大数字格式化，单位为10000的倍数（w,e,z,j,g），末尾四舍五入
     * @example core.formatBigNumber(123456789, false); // "12346w"
     * @param x 原数字
     * @param onMap 可选，true表示用于地图显伤，结果总字符数最多为5，否则最多为6
     * @returns 格式化结果
     */
    formatBigNumber(x: number, onMap?: boolean): string

    /** 变速移动 */
    applyEasing(mode?: string): (number) => number;

    /**
     * 颜色数组转十六进制
     * @example core.arrayToRGB([102, 204, 255]); // "#66ccff"，加载画面的宣传色
     * @param color 一行三列的数组，各元素必须为不大于255的自然数
     * @returns 该颜色的十六进制表示，使用小写字母
     */
    arrayToRGB(color: [number, number, number]): string

    /**
     * 颜色数组转字符串
     * @example core.arrayToRGBA([102, 204, 255]); // "rgba(102,204,255,1)"
     * @param color 一行三列或一行四列的数组，前三个元素必须为不大于255的自然数。第四个元素（如果有）必须为0或不大于1的数字，第四个元素不填视为1
     * @returns 该颜色的字符串表示
     */
    arrayToRGBA(color: [number, number, number, number]): string

    /**
     * 录像一压，其结果会被再次base64压缩
     * @example core.encodeRoute(core.status.route); // 一压当前录像
     * @param route 原始录像，自定义内容（不予压缩，原样写入）必须由0-9A-Za-z和下划线、冒号组成，所以中文和数组需要用JSON.stringify预处理再base64压缩才能交由一压
     * @returns 一压的结果
     */
    encodeRoute(route: string[]): string

    /**
     * 录像解压的最后一步，即一压的逆过程
     * @example core.decodeRoute(core.encodeRoute(core.status.route)); // 一压当前录像再解压-_-|
     * @param route 录像解压倒数第二步的结果，即一压的结果
     * @returns 原始录像
     */
    decodeRoute(route: string): string[]

    /**
     * 判断一个值是否不为null，undefined和NaN
     * @example core.isset(0/0); // false，因为0/0等于NaN
     * @param v 待测值，可选
     * @returns false表示待测值为null、undefined、NaN或未填写，true表示为其他值。即!(v == null || v != v)
     */
    isset(v?: any): boolean

    /**
     * 判定一个数组是否为另一个数组的前缀，用于录像接续播放。请注意函数名没有大写字母
     * @example core.subarray(['ad', '米库', '小精灵', '小破草', '小艾'], ['ad', '米库', '小精灵']); // ['小破草', '小艾']
     * @param a 可能的母数组，不填或比b短将返回null
     * @param b 可能的前缀，不填或比a长将返回null
     * @returns 如果b不是a的前缀将返回null，否则将返回a去掉此前缀后的剩余数组
     */
    subarray(a?: any[], b?: any[]): any[] | null

    /**
     * 判定array是不是一个数组，以及element是否在该数组中。
     * @param array 可能的数组，不为数组或不填将导致返回值为false
     * @param element 待查找的元素
     * @returns 如果array为数组且具有element这项，就返回true，否则返回false
     */
    inArray(array?: any, element?: any): boolean

    /**
     * 将x限定在[a,b]区间内，注意a和b可交换
     * @example core.clamp(1200, 1, 1000); // 1000
     * @param x 原始值，!x为true时x一律视为0
     * @param a 下限值，大于b将导致与b交换
     * @param b 上限值，小于a将导致与a交换
     */
    clamp(x: number, a: number, b: number): number

    /**
     * 填写非自绘状态栏
     * @example core.setStatusBarInnerHTML('hp', core.status.hero.hp, 'color: #66CCFF'); // 更新状态栏中的主角生命，使用加载画面的宣传色
     * @param name 状态栏项的名称，如'hp', 'atk', 'def'等。必须是core.statusBar中的一个合法项
     * @param value 要填写的内容，大数字会被格式化为至多6个字符，无中文的内容会被自动设为斜体
     * @param css 额外的css样式，可选。如更改颜色等
     */
    setStatusBarInnerHTML(name: string, value: any, css?: string): void

    /**
     * 求字符串的国标码字节数，也可用于等宽字体下文本的宽度测算。请注意样板的默认字体Verdana不是等宽字体
     * @example core.strlen('无敌ad'); // 6
     * @param str 待测字符串
     * @returns 字符串的国标码字节数，每个汉字为2，每个ASCII字符为1
     */
    strlen(str: string): number

    /**
     * 通配符匹配，用于搜索图块等批量处理。
     * @example core.playSound(core.matchWildcard('*Key', itemId) ? 'item.mp3' : 'door.mp3'); // 判断捡到的是钥匙还是别的道具，从而播放不同的音效
     * @param pattern 模式串，每个星号表示任意多个（0个起）字符
     * @param string 待测串
     * @returns true表示匹配成功，false表示匹配失败
     */
    matchWildcard(pattern: string, string: string): boolean

    /**
     * base64加密
     * @example core.encodeBase64('If you found this note in a small wooden box with a heart on it'); // "SWYgeW91IGZvdW5kIHRoaXMgbm90ZSBpbiBhIHNtYWxsIHdvb2RlbiBib3ggd2l0aCBhIGhlYXJ0IG9uIGl0"
     * @param str 明文
     * @returns 密文
     */
    encodeBase64(str: string): string

    /**
     * base64解密
     * @example core.decodeBase64('SWYgeW91IGZvdW5kIHRoaXMgbm90ZSBpbiBhIHNtYWxsIHdvb2RlbiBib3ggd2l0aCBhIGhlYXJ0IG9uIGl0'); // "If you found this note in a small wooden box with a heart on it"
     * @param str 密文
     * @returns 明文
     */
    decodeBase64(str: string): string

    /**
     * 不支持SL的随机数
     * @exmaple 1 + core.rand(6); // 随机生成一个小于7的正整数，模拟骰子的效果
     * @param num 填正数表示生成小于num的随机自然数，否则生成小于1的随机正数
     * @returns 随机数，即使读档也不会改变结果
     */
    rand(num?: number): number

    /**
     * 支持SL的随机数，并计入录像
     * @exmaple 1 + core.rand2(6); // 随机生成一个小于7的正整数，模拟骰子的效果
     * @param num 正整数，0或不填会被视为2147483648
     * @returns 属于 [0, num) 的随机数
     */ 
    rand2(num?: number): number

    /**
     * 弹窗请求下载一个文本文件
     * @example core.download('route.txt', core.status.route); // 弹窗请求下载录像
     * @param filename 文件名
     * @param content 文件内容
     */
    download(filename: string, content: string | String[]): void

    /**
     * 显示确认框，类似core.drawConfirmBox()
     * @example core.myconfirm('重启游戏？', core.restart); // 弹窗询问玩家是否重启游戏
     * @param hint 弹窗的内容
     * @param yesCallback 确定后的回调函数
     * @param noCallback 取消后的回调函数，可选
     */
    myconfirm(hint: string, yesCallback: () => void, noCallback?: () => void): void

    /**
     * 判定深层相等, 会逐层比较每个元素
     * @example core.same(['1', 2], ['1', 2]); // true
     */
    same(a?: any, b?: any): boolean

    /**
     * 尝试请求读取一个本地文件内容 [异步]
     * @param success 成功后的回调
     * @param error 失败后的回调
     * @param readType 不设置则以文本读取，否则以DataUrl形式读取
     */
    readFile(success, error, readType): void

    /**
     * 文件读取完毕后的内容处理 [异步]
     * @param content 
     */
    readFileContent(content): void

    /**
     * 尝试复制一段文本到剪切板。
     */
    copy(data: string): void
    
    /**
     * 发送一个HTTP请求 [异步]
     * @param type 请求类型
     * @param url 目标地址
     * @param formData 如果是POST请求则为表单数据
     * @param success 成功后的回调
     * @param error 失败后的回调
     */
    http(type: 'GET' | 'POST', url: string, formData: FormData, success: () => void, error: () => void): void

    /** 获得浏览器唯一的guid */
    getGuid(): string

    /** 解压缩一个数据 */
    decompress(value: any): any

    /** 设置本地存储 */
    setLocalStorage(key: string, value?: any): void

    /** 获得本地存储 */
    getLocalStorage(key: string, defaultValue?: any): any

    /** 移除本地存储 */
    removeLocalStorage(key: string): void

    /** 往数据库写入一段数据 */
    setLocalForage(key: string, value?: any, successCallback?: () => void, errorCallback?: () => void): void

    /** 从数据库读出一段数据 */
    getLocalForage(key: string, defaultValue?: any, successCallback?: (data: any) => void, errorCallback?: () => void): void

    /** 移除数据库的数据 */
    removeLocalForage(key: string, successCallback?: () => void, errorCallback?: () => void): void

    /** 格式化日期为字符串 */
    formatDate(date: Date): string

    /** 格式化日期为最简字符串 */
    formatDate2(date: Date): string

    /** 格式化时间 */
    formatTime(time: number): string

    /** 两位数显示 */
    setTwoDigits(x: number): string

    /** 格式化文件大小 */
    formatSize(size: number): string

    /** 访问浏览器cookie */
    getCookie(name: string): string

    /**
     * 计算应当转向某个方向
     * @param turn 转向的方向
     * @param direction 当前方向
     */
    turnDirection(turn: 'up' | 'down' | 'left' | 'right' | ':left' | ':right' | ':back', direction?: string): string

    /** 是否满足正则表达式 */
    matchRegex(pattern: string, string: string): string

    /** 让用户输入一段文字 */
    myprompt(hint: string, value: string, callback?: (data?: string) => any): void

    /** 动画显示某对象 */
    showWithAnimate(obj?: any, speed?: number, callback?: () => any): void

    /** 动画使某对象消失 */
    hideWithAnimate(obj?: any, speed?: number, callback?: () => any): void

    /** 解压一段内容 */
    unzip(blobOrUrl?: any, success?: (data: any) => void, error?: (error: string) => void, convertToText?: boolean, onprogress?: (loaded: number, total: number) => void): void
}

/** 和图标相关的函数 */
declare class icons {

    /** 获得所有图标类型 */
    getIcons(): void

    /** 根据ID获得其类型 */
    getClsFromId(id?: string): void

    /** 获得所有图标的ID */
    getAllIconIds(): void

    /** 根据图块数字或ID获得所在的tileset和坐标信息 */
    getTilesetOffset(id?: string): void
}

type core = {
    /** 地图可视部分大小 */
    __SIZE__: number;
    /** 地图像素 */
    __PIXELS__: number;
    /** 地图像素的一半 */
    __HALF_SIZE__: number;
    /** 游戏素材 */
    material: {
        animates: { [key: string]: Animate },
        images: {},
        bgms: { [key: string]: HTMLAudioElement },
        sounds: { [key: string]: HTMLAudioElement },
        ground: CanvasRenderingContext2D
        /**
         * 怪物信息
         * @example core.material.enemys.greenSlime // 获得绿色史莱姆的属性数据
         */
        enemys: { [key: string]: Enemy },
        /** 道具信息 */
        items: { [key: string]: Item }
        icons: {},
    }
    timeout: {
        turnHeroTimeout: any,
        onDownTimeout: any,
        sleepTimeout: any,
    }
    interval: {
        heroMoveInterval: any,
        onDownInterval: any,
    }
    animateFrame: {
        totalTime: number
        totalTimeStart: number
        globalAnimate: boolean,
        globalTime: number
        selectorTime: number
        selectorUp: boolean,
        animateTime: number
        moveTime: number
        lastLegTime: number
        leftLeg: boolean,
        weather: {
            time: number
            type: any
            nodes: [],
            data: any
            fog: any,
            cloud: any,
        },
        tips: {
            time: number
            offset: number
            list: [],
            lastSize: number
        },
        asyncId: {}
    }
    musicStatus: {
        audioContext: AudioContext,
        /** 是否播放BGM */bgmStatus: boolean
        /** 是否播放SE */soundStatus: boolean
        /** 正在播放的BGM */playingBgm: string
        /** 上次播放的bgm */lastBgm: string
        gainNode: GainNode,
        /** 正在播放的SE */playingSounds: {}
        /** 音量 */volume: number
        /** 缓存BGM内容 */cachedBgms: string[]
        /** 缓存的bgm数量 */cachedBgmCount: number
    }
    platform: {
        /** 是否http */isOnline: boolean
        /** 是否是PC */isPC: boolean
        /** 是否是Android */isAndroid: boolean
        /** 是否是iOS */isIOS: boolean
        string: string
        /** 是否是微信 */isWeChat: boolean
        /** 是否是QQ */isQQ: boolean
        /** 是否是Chrome */isChrome: boolean
        /** 是否支持复制到剪切板 */supportCopy: boolean

        fileInput: null
        /** 是否支持FileReader */fileReader: null
        /** 读取成功 */successCallback: null
        /** 读取失败 */errorCallback: null
    }
    dom: { [key: string]: HTMLElement }
    /** dom样式 */
    domStyle: {
        scale: number,
        isVertical: boolean,
        showStatusBar: boolean,
        toolbarBtn: boolean,
    }
    bigmap: {
        canvas: string[],
        offsetX: number // in pixel
        offsetY: number
        posX: number
        posY: number
        width: number // map width and height
        height: number
        v2: boolean
        threshold: number
        extend: number
        scale: number
        tempCanvas: CanvasRenderingContext2D // A temp canvas for drawing
        cacheCanvas: CanvasRenderingContext2D
    }
    saves: {
        saveIndex: number
        ids: { [key: number]: boolean }
        autosave: {
            data: Save[]
            max: number
            storage: true
            time: number
            updated: boolean
        }
        favorite: []
        favoriteName: {}
    }
    initStatus: gameStatus;
    dymCanvas: { [key: string]: CanvasRenderingContext2D }
    /** 游戏状态 */
    status: gameStatus

    /** 
     * 获得所有楼层的信息
     * @example core.floors[core.status.floorId].events // 获得本楼层的所有自定义事件
     */
    floors: { [key: string]: Floor }

    control: control
    loader: loader
    events: events
    enemys: enemys
    items: items
    maps: maps
    ui: ui
    utils: utils
    icons: icons
    actions: actions

} & control & events & loader & enemys & items & maps & ui & utils & icons & actions

declare var core: core
