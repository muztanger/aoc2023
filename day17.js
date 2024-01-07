const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    toString() {
        return this.x + ',' + this.y;
    }
    clone() {
        return new Pos(this.x, this.y);
    }
}

class Direction {
    static RIGHT = new Pos(1, 0);
    static DOWN = new Pos(0, 1);
    static LEFT = new Pos(-1, 0);
    static UP = new Pos(0, -1);

    static dirs = [Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP];

    constructor(dirPos) {
        if (dirPos) {
            this.setDir(dirPos);
        } else {
            this.dir = 0;
        }
    }

    clone() {
        return new Direction(this.dir);
    }

    setDir(pos) {
        let posIndex = Direction.dirs.findIndex(dir => dir.equals(pos));
        if (posIndex === -1) {
            throw new Error('Invalid direction');
        }
        this.dir = posIndex;
    }

    rotateRight() {
        this.dir = (this.dir + 1) % 4;
    }

    rotateLeft() {
        this.dir = (this.dir + 3) % 4;
    }

    equals(other) {
        return this.toPos() === other;
    }

    toPos() {
        return Direction.dirs[this.dir];
    }
}

function part1(input) {
    const G = input.split('\n').map(line => line.split('').map(c => parseInt(c)));
    let end = new Pos(G[0].length - 1, G.length - 1);

    const RIGHT = new Pos(1, 0);
    const DOWN = new Pos(0, 1);
    const LEFT = new Pos(-1, 0);
    const UP = new Pos(0, -1);
    const dirs = [Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP];

    let queue = [];
    let mem = new Map();
    let minEnergy = Number.MAX_SAFE_INTEGER;
    queue.push({ pos: new Pos(0, 0), direction: 0, count: 0, energy: 0 });
    queue.push({ pos: new Pos(0, 0), direction: 1, count: 0, energy: 0 });
    while (queue.length > 0) {
        let state = queue.shift();

        if (state.pos.x < 0 || state.pos.x >= G[0].length || state.pos.y < 0 || state.pos.y >= G.length) {
            continue;
        }

        if (mem.has(state.pos.toString()) && mem.get(state.pos.toString()) < state.energy) {
            continue;
        }
        mem.set(state.pos.toString(), state.energy);

        const energy = state.energy + G[state.pos.y][state.pos.x];
        if (state.pos.equals(end)) {
            minEnergy = Math.min(minEnergy, energy);
            // console.log(state.pos.toString(), energy);
        }

        if (state.count < 3) {
            queue.push({ pos: state.pos.add(dirs[state.direction]), direction: state.direction, count: state.count + 1, energy });
        }

        let dirIndex = (state.direction + 1) % 4;
        queue.push({ pos: state.pos.add(dirs[dirIndex]), direction: dirIndex, count: 1, energy });
        dirIndex = (state.direction + 3) % 4;
        queue.push({ pos: state.pos.add(dirs[dirIndex]), direction: dirIndex, count: 1, energy });
    }
    return minEnergy - G[0][0];
}

test('part1', () => {
    assert.strictEqual(part1(example), 102);
});