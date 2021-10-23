import { Enemy } from '../libs/enemy';

let enemies = {
    "greenSlime": new Enemy({ id: 'greenSlime', number: 2, hp: 100, atk: 20, def: 5, special: [] })
}
export { enemies };