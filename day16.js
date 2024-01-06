const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

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

    movePos(pos) {
        return pos.add(this.toPos());
    }
}


class Beam {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }
    move() {
        // console.log(this.dir);
        this.pos = this.dir.movePos(this.pos);
    }
}

function printGrid(grid) {
    for (let row of grid) {
        console.log(row.join(''));
    }
}

function checkEnergy(beamStart, input) {
    let G = input.split('\n').map(line => line.trim().split(''));
    let E = Array(G.length).fill().map(() => Array(G[0].length).fill(0));
    E[beamStart.pos.y][beamStart.pos.x] = 1;
    // printGrid(G);
    // console.log('-------------------');
    let beams = [beamStart];
    let lastZeroCount = -1;
    const threshold = 1000000;
    let mem = new Set();
    let stepsSinceLast = 0;
    while (beams.length > 0 && stepsSinceLast < threshold) {
        let beam = beams.shift();
        beam.move();
        if (beam.pos.x < 0 || beam.pos.y < 0 || beam.pos.y >= G.length || beam.pos.x >= G[0].length) {
            continue;
        }
        let key = `${beam.pos.x},${beam.pos.y},${beam.dir.dir}`;
        if (mem.has(key)) {
            continue;
        }
        mem.add(key);
        let c = G[beam.pos.y][beam.pos.x];
        switch (c) {
            case '/':
                if (beam.dir.equals(Direction.RIGHT) || beam.dir.equals(Direction.LEFT)) {
                    beam.dir.rotateLeft();
                } else if (beam.dir.equals(Direction.DOWN) || beam.dir.equals(Direction.UP)) {
                    beam.dir.rotateRight();
                }
                break;
            case "\\":
                if (beam. dir.equals(Direction.RIGHT) || beam.dir.equals(Direction.LEFT)) {
                    beam.dir.rotateRight();
                } else if (beam.dir.equals(Direction.DOWN) || beam.dir.equals(Direction.UP)) {
                    beam.dir.rotateLeft();
                }
                break;
            case '|':
                if (beam.dir.equals(Direction.RIGHT) || beam.dir.equals(Direction.LEFT)) {
                    beam.dir.setDir(Direction.UP);
                    beams.push(new Beam(new Pos(beam.pos.x, beam.pos.y), new Direction(Direction.DOWN)));
                }
                break;
            case '-':
                if (beam.dir.equals(Direction.DOWN) || beam.dir.equals(Direction.UP)) {
                    beam.dir.setDir(Direction.RIGHT);
                    beams.push(new Beam(new Pos(beam.pos.x, beam.pos.y), new Direction(Direction.LEFT)));
                }
                break;
            default:
                // nothing
        }

        if (E[beam.pos.y][beam.pos.x] === 0) {
            stepsSinceLast = 0;
        } else {
            stepsSinceLast++;
        }

        E[beam.pos.y][beam.pos.x]++;

        beams.push(beam);
    }
    return E.reduce((acc, row) => acc + row.filter((x) => x > 0).reduce((a, x) => a + 1, 0), 0);

}

function part1(input) {
    return checkEnergy(new Beam(new Pos(0, 0), new Direction()), input)
}

function part2(input) {
    // check limits
    const grid = input.split('\n').map(line => line.trim().split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    let result = 0;
    for (let i = 0; i < rows; i++) {
        result = Math.max(result, checkEnergy(new Beam(new Pos(0, i), new Direction()), input));
        result = Math.max(result, checkEnergy(new Beam(new Pos(cols - 1, i), new Direction(Direction.LEFT)), input));
    }
    for (let i = 0; i < cols; i++) {
        result = Math.max(result, checkEnergy(new Beam(new Pos(i, 0), new Direction(Direction.DOWN)), input));
        result = Math.max(result, checkEnergy(new Beam(new Pos(i, rows - 1), new Direction(Direction.UP)), input));
    }
    return result;
}

const example = `.|...\\....
|.-.\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

test('part1', () => {
    assert.strictEqual(part1(example), 46);
    const p1Input = part1(input);
    console.log('Part 1:', p1Input);
    assert.notStrictEqual(p1Input, 7315); // too low
    assert.notStrictEqual(p1Input, 7777); // too low
    assert.strictEqual(p1Input, 7927);
}); 

test('part2', () => {
    assert.strictEqual(part2(example), 51);
    const p2Input = part2(input);
    assert.strictEqual(p2Input, 8246);
});