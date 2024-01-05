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

class RockGrid {
    static types = ['.', '#', 'O'];
    constructor(rocks, area) {
        this.area = area;
        this.grid = Array(area.max.y - area.min.y + 1).fill().map(() => Array(area.max.x - area.min.x + 1).fill(0));
        for (let rock of rocks) {
            this.grid[rock.pos.y - area.min.y][rock.pos.x - area.min.x] = RockGrid.types.indexOf(rock.type);
        }
    }

    static fromInput(input) {
        let rocks = [];
        let area = new Area();
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
        return new RockGrid(rocks, area);
    }
    
    get(pos) {
        if (this.area.contains(pos)) {
            return this.grid[pos.y - this.area.min.y][pos.x - this.area.min.x];
        }
        return null;
    }

    tiltNorth() {
        for (let x = this.area.min.x; x <= this.area.max.x; x++) {
            let lastSolidY = this.area.min.y - 1;
            for (let y = this.area.min.y; y <= this.area.max.y; y++) {
                let rock = this.get(new Pos(x, y));
                if (rock > 0) {
                    if (y - lastSolidY > 1 && rock === 2) {
                        this.grid[y - this.area.min.y][x - this.area.min.x] = 0;
                        this.grid[lastSolidY - this.area.min.y + 1][x - this.area.min.x] = 2;
                        lastSolidY++;
                    } else {
                        lastSolidY = y;
                    }
                }
            }
        }
    }

    tiltSouth() {
        for (let x = this.area.min.x; x <= this.area.max.x; x++) {
            let lastSolidY = this.area.max.y + 1;
            for (let y = this.area.max.y; y >= this.area.min.y; y--) {
                let rock = this.get(new Pos(x, y));
                if (rock > 0) {
                    if (lastSolidY - y > 1 && rock === 2) {
                        this.grid[y - this.area.min.y][x - this.area.min.x] = 0;
                        this.grid[lastSolidY - this.area.min.y - 1][x - this.area.min.x] = 2;
                        lastSolidY--;
                    } else {
                        lastSolidY = y;
                    }
                }
            }
        }
    }

    tiltEast() {
        for (let y = this.area.min.y; y <= this.area.max.y; y++) {
            let lastSolidX = this.area.max.x + 1;
            for (let x = this.area.max.x; x >= this.area.min.x; x--) {
                let rock = this.get(new Pos(x, y));
                if (rock > 0) {
                    if (lastSolidX - x > 1 && rock === 2) {
                        this.grid[y - this.area.min.y][x - this.area.min.x] = 0;
                        this.grid[y - this.area.min.y][lastSolidX - this.area.min.x - 1] = 2;
                        lastSolidX--;
                    } else {
                        lastSolidX = x;
                    }
                }
            }
        }
    }

    tiltWest() {
        for (let y = this.area.min.y; y <= this.area.max.y; y++) {
            let lastSolidX = this.area.min.x - 1;
            for (let x = this.area.min.x; x <= this.area.max.x; x++) {
                let rock = this.get(new Pos(x, y));
                if (rock > 0) {
                    if (x - lastSolidX > 1 && rock === 2) {
                        this.grid[y - this.area.min.y][x - this.area.min.x] = 0;
                        this.grid[y - this.area.min.y][lastSolidX - this.area.min.x + 1] = 2;
                        lastSolidX++;
                    } else {
                        lastSolidX = x;
                    }
                }
            }
        }
    }

    cycle() {
        this.tiltNorth();
        this.tiltWest();
        this.tiltSouth();
        this.tiltEast();
    }

    totalLoad() {
        let total = 0;
        for (let y = this.area.min.y; y <= this.area.max.y; y++) {
            for (let x = this.area.min.x; x <= this.area.max.x; x++) {
                if (this.get(new Pos(x, y)) === 2) {
                    total += this.area.max.y - y + 1;
                }
            }
        }
        return total;
    }

    print() {
        for (let y = this.area.min.y; y <= this.area.max.y; y++) {
            let row = '';
            for (let x = this.area.min.x; x <= this.area.max.x; x++) {
                let rock = this.get(new Pos(x, y));
                if (rock) {
                    row += RockGrid.types[rock];
                } else {
                    row += '.';
                }
            }
            console.log(row);
        }
    }

    getState() {
        let state = '';
        for (let y = this.area.min.y; y <= this.area.max.y; y++) {
            for (let x = this.area.min.x; x <= this.area.max.x; x++) {
                let rock = this.get(new Pos(x, y));
                if (rock) {
                    state += RockGrid.types[rock];
                } else {
                    state += '.';
                }
            }
        }
        return state.hashCode();
    }
}

console.log('--- Part 1 ---');
const rockGridPart1 = RockGrid.fromInput(input);
if (useExample) {
    rockGridPart1.print();
    console.log();
}
rockGridPart1.tiltNorth();
if (useExample) {
    console.log('After tilting north:');
    rockGridPart1.print();
}

let part1 = rockGridPart1.totalLoad();
console.log('Part 1 result:', part1);

test ('Part 1', () => {
    if (useExample) {
        assert.equal(part1, 136);
    } else {
        assert.equal(part1, 103333);
    }
});

console.log('Part 2:');
const rockGridPart2 = RockGrid.fromInput(input);

let start = performance.now();
let cycleTimes = [];
let mem = new Map();
let loop = [];
let loopStart = -1;
let index = 0;
for (;;) {
    const state = rockGridPart2.getState();
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
        const currentLoad = rockGridPart2.totalLoad();
        rockGridPart2.cycle();
        const nextState = rockGridPart2.getState();
        mem.set(state, {'load':currentLoad, 'next': nextState});
    }

    cycleTimes.push(performance.now());
    const c = index + 1;
    if (!useExample && c % 1000 === 0) {
        const now = performance.now();
        console.log(`After ${c} cycles: load=${totalLoad()} totalTime=${now - start} ms avgTime=${(now - start) / c} ms`);
    }
    if (useExample) {
        rockGridPart2.print();
        console.log();
    }
    index++;
}
let end = performance.now();
console.log('Loop start:', loopStart, 'Loop length:', loop.length);
const part2 = mem.get(loop[(1000000000 - loopStart) % loop.length]).load;
console.log('Part 2:', part2);
for (let di = -10; di <= 10; di++) {
    console.log('off by', di, ':', mem.get(loop[(1000000000 - loopStart + di) % loop.length]).load);
}
// console.log('Cycle times:', cycleTimes.map((t, i) => i > 0 ? t - cycleTimes[i - 1] : t));
console.log('Total time:', end - start);
test('Part 2', () => {
    if (useExample) {
        assert.equal(part2, 64);
    } else {
        assert.notEqual(part2, 96758); // too low
        assert.notEqual(part2, 96927); // too low
        assert.notEqual(part2, 96962); // too low
        assert.notEqual(part2, 96994); // incorrect answer
        assert.notEqual(part2, 97044); // incorrect answer
        assert.notEqual(part2, 97080); // incorrect answer
        assert.equal(part2, 97241);
    }
});