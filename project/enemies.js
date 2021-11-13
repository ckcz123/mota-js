import { Enemy } from '../libs/enemy';

let enemies = {
    "greenSlime": new Enemy({ id: 'greenSlime', number: 2, hp: 100n, atk: 20n, def: 5n, special: [] })
}
export { enemies };