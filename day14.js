const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');
const { performance } = require('perf_hooks');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
let useExample = true;
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

const tilt = (dir) => {
    let dp = null;
    let sort = null;
    switch (dir) {
        case 'N':
            dp = new Pos(0, -1);
            sort = (a, b) => a.pos.y - b.pos.y;
            break;
        case 'S':
            dp = new Pos(0, 1);
            sort = (a, b) => b.pos.y - a.pos.y;
            break;
        case 'E':
            dp = new Pos(1, 0);
            sort = (a, b) => b.pos.x - a.pos.x;
            break;
        case 'W':
            dp = new Pos(-1, 0);
            sort = (a, b) => a.pos.x - b.pos.x;
            break;
        default:
            break;
    }
    
    let anyMoved = true;
    while (anyMoved) {
        // roll.sort(sort);
        anyMoved = false;
        for (let rock of roll) {
            let moved = true;
            while (moved) {
                moved = false;
                let next = rock.pos.add(dp);
                if (!area.contains(next)) {
                    continue;
                }
                if (!rocks.some(r => r.pos.equals(next))) {
                    rock.pos = new Pos(next.x, next.y);
                    moved = true;
                    anyMoved = true;
                }
            }
        }
    }
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
for (let c = 1; c <= 1000000; c++) {
    const state = rocks.filter(r => r.type == 'O').map(rock => rock.pos.toString()).join(';');
    if (mem.has(state)) {
        console.log('Found loop');
        if (loopStart < 0) {
            loopStart = index;
        }
        let nextState = mem.get(state).next;
        while (nextState != state) {
            loop.push(nextState);
            nextState = mem.get(nextState).next;
        }
        break;
    } else {
        const currentLoad = totalLoad();
        cycle();
        const nextState = rocks.filter(r => r.type == 'O').map(rock => rock.pos.toString()).join(';');
        mem.set(state, {'load':currentLoad, 'next': nextState});
    }

    cycleTimes.push(performance.now());
    console.log(`After ${c} cycles: ${totalLoad()}`);
    if (useExample) {
        printRocks(rocks);
    }
    console.log();
    index++;
}
const part2 = mem.get(loop[(1000000000 - loopStart) % loop.length]).load;
console.log('Part 2:', part2);

test('Part 2', () => {
    if (useExample) {
        assert.equal(part2, 64);
    } else {
        assert.equal(part2, -1);
    }
});