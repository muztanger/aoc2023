const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');
const { performance } = require('perf_hooks');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
let useExample = false;
if (useExample) {
    input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;
}


class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Pos(this.x - other.x, this.y - other.y);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    min(other) {
        return new Pos(Math.min(this.x, other.x), Math.min(this.y, other.y));
    }
    max(other) {
        return new Pos(Math.max(this.x, other.x), Math.max(this.y, other.y));
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

class Area {
    constructor() {
        this.min = null;
        this.max = null;
        for (let arg of arguments) {
            this.expand(arg);
        }
    }
    expand(pos) {
        this.min = (this.min || pos).min(pos);
        this.max = (this.max || pos).max(pos);
    }
    contains(pos) {
        return pos.x >= this.min.x && pos.x <= this.max.x && pos.y >= this.min.y && pos.y <= this.max.y;
    }
    toString() {
        return `${this.min.toString()} - ${this.max.toString()}`;
    }
}

class Rock {
    constructor(pos, type) {
        this.pos = pos;
        this.type = type;
    }
    toString() {
        return `${this.type} ${this.pos.toString()}`;
    }
}

let rocks = [];
let roll = null;
let area = new Area();

function readInput() {
    area = new Area();
    rocks = [];
    let y = 0;
    for (let row of input.split('\n')) {
        let x = 0;
        for (let cell of row.split('')) {
            if (cell === '#' || cell === 'O') {
                rocks.push(new Rock(new Pos(x, y), cell));
            }
            area.expand(new Pos(x, y));
            x++;
        }
        y++;
    }
    roll = rocks.filter(rock => rock.type === 'O');
}
readInput();

console.log('Area:', area.toString());

const printRocks = (rocks) => {
    if (!useExample) return;

    for (let y = area.min.y; y <= area.max.y; y++) {
        let row = '';
        for (let x = area.min.x; x <= area.max.x; x++) {
            let rock = rocks.find(rock => rock.pos.equals(new Pos(x, y)));
            if (rock) {
                row += rock.type;
            } else {
                row += '.';
            }
        }
        console.log(row);
    }
}

printRocks(rocks);

let rockMap = new Map();
for (let key in rocks) {
    rockMap.set(rocks[key].pos.toString(), rocks[key]);
}
const tilt = (dir) => {
    // if (useExample) {
    //     console.log('Tilt', dir);
    //     console.log('Before tilt:');
    //     printRocks(rocks);
    // }
    switch (dir) {
        case 'N':
            {
                let nextRockMap = new Map();
                for (let x = area.min.x; x <= area.max.x; x++) {
                    let lastSolidY = area.min.y - 1;
                    for (let y = area.min.y; y <= area.max.y; y++) {
                        let rock = rockMap.get(new Pos(x, y).toString());
                        if (rock) {
                            if (y - lastSolidY > 1 && rock.type === 'O') {
                                rock.pos.y = lastSolidY + 1;
                            }
                            nextRockMap.set(rock.pos.toString(), rock);
                            lastSolidY = rock.pos.y;
                        }
                    }
                }
                rockMap = nextRockMap;
            }
            break;
        case 'S':
            {
                let nextRockMap = new Map();
                for (let x = area.min.x; x <= area.max.x; x++) {
                    let lastSolidY = area.max.y + 1;
                    for (let y = area.max.y; y >= area.min.y; y--) {
                        let rock = rockMap.get(new Pos(x, y).toString());
                        if (rock) {
                            if (lastSolidY - y > 1 && rock.type === 'O') {
                                rock.pos.y = lastSolidY - 1;
                            }
                            nextRockMap.set(rock.pos.toString(), rock);
                            lastSolidY = rock.pos.y;
                        }
                    }
                }
                rockMap = nextRockMap;
            }
            break;
        case 'E':
            {
                let nextRockMap = new Map();
                for (let y = area.min.y; y <= area.max.y; y++) {
                    let lastSolidX = area.max.x + 1;
                    for (let x = area.max.x; x >= area.min.x; x--) {
                        let rock = rockMap.get(new Pos(x, y).toString());
                        if (rock) {
                            if (lastSolidX - x > 1 && rock.type === 'O') {
                                rock.pos.x = lastSolidX - 1;
                            }
                            nextRockMap.set(rock.pos.toString(), rock);
                            lastSolidX = rock.pos.x;
                        }
                    }
                }
                rockMap = nextRockMap;
            }
            break;
        case 'W':
            {
                let nextRockMap = new Map();
                for (let y = area.min.y; y <= area.max.y; y++) {
                    let lastSolidX = area.min.x - 1;
                    for (let x = area.min.x; x <= area.max.x; x++) {
                        let rock = rockMap.get(new Pos(x, y).toString());
                        if (rock) {
                            if (x - lastSolidX > 1 && rock.type === 'O') {
                                rock.pos.x = lastSolidX + 1;
                            }
                            nextRockMap.set(rock.pos.toString(), rock);
                            lastSolidX = rock.pos.x;
                        }
                    }
                }
                rockMap = nextRockMap;
            }
            break;
        default:
            break;
    }
    // if (useExample) {
    //     console.log('After tilt:');
    //     printRocks(rocks);
    //     console.log();
    // }
}

tilt('N');
console.log('After gravity:');
printRocks(rocks);

const totalLoad = () => {
    let total = 0;
    for (let rock of roll) {
        total += area.max.y - rock.pos.y + 1;
    }
    return total;
}

let part1 = totalLoad();
console.log('Part 1:', part1);

test ('Part 1', () => {
    if (useExample) {
        assert.equal(part1, 136);
    } else {
        assert.equal(part1, 103333);
    }
});

console.log('Part 2:');
readInput();
rockMap = new Map();
for (let key in rocks) {
    rockMap.set(rocks[key].pos.toString(), rocks[key]);
}
console.log('area:', area.toString());
printRocks(rocks);

function cycle() {
    tilt('N');
    tilt('W');
    tilt('S');
    tilt('E');
}

let start = performance.now();
let cycleTimes = [];
let mem = new Map();
let loop = [];
let loopStart = -1;
let index = 0;
let c = 1;
function getState() {
    // return rocks.filter(r => r.type == 'O').map(rock => rock.pos.toString()).join(';');
    // return totalLoad();
    return rocks.filter(r => r.type == 'O').map(rock => rock.pos.toString()).join(';').hashCode();
}
for (;; c++) {
    const state = getState();
    if (mem.has(state)) {
        console.log('Found loop');
        if (loopStart < 0) {
            loopStart = index;
        }
        loop.push(state);
        let nextState = mem.get(state).next;
        while (nextState != state) {
            loop.push(nextState);
            nextState = mem.get(nextState).next;
        }
        break;
    } else {
        const currentLoad = totalLoad();
        cycle();
        const nextState = getState();
        mem.set(state, {'load':currentLoad, 'next': nextState});
    }

    cycleTimes.push(performance.now());
    if (!useExample && c % 1000 === 0) {
        console.log(`After ${c} cycles: ${totalLoad()}`);
    }
    if (useExample) {
        printRocks(rocks);
        console.log();
    }
    index++;
}
let end = performance.now();
console.log('Loop start:', loopStart, 'Loop length:', loop.length);
const part2 = mem.get(loop[(1000000000 - loopStart) % loop.length]).load;
console.log('Part 2:', part2);
console.log('off by one:', mem.get(loop[(1000000000 - loopStart - 1) % loop.length]).load);
console.log('off by minus one:', mem.get(loop[(1000000000 - loopStart + 1) % loop.length]).load);
// console.log('Cycle times:', cycleTimes.map((t, i) => i > 0 ? t - cycleTimes[i - 1] : t));
console.log('Total time:', end - start);
test('Part 2', () => {
    if (useExample) {
        assert.equal(part2, 64);
    } else {
        assert.notEqual(part2, 96758); // too low
        assert.notEqual(part2, 96927); // too low
        assert.equal(part2, -1);
    }
});