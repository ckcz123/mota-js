import { animate } from "../libs/core";

let dict: {
    [key: number]:
    {
        id: string,
        cls: string,
        img: string,
        pass: boolean
        animate?: animate.Animate,
    }
} = {
    2: { id: 'greenSlime', cls: 'enemy', img: 'Monster01-01.4x4@x1234@y1.png', pass: false },
    3: { id: 'ground', cls: 'tileset', img: 'magictower.8x38@x1@y1.png', pass: true },
    4: { id: 'autotile', cls: 'autotile', img: 'autotile.1x1@3x4.png', pass: false }
}
export { dict };