import { Enemy } from '../libs/enemy';
import { core } from '../libs/core';

let enemies = {
    "greenSlime": new Enemy({ id: 'greenSlime', number: 2, vertical: false, hp: 100, atk: 20, def: 0, special: [] })
}
export { enemies };