const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

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
let y = 0;
let max = new Pos(0,0);
let min = new Pos(1000,1000);
for (let row of input.split('\n')) {
    let x = 0;
    for (let cell of row.split('')) {
        if (cell === '#' || cell === 'O') {
            rocks.push(new Rock(new Pos(x, y), cell));
        }
        max = max.max(new Pos(x, y));
        min = min.min(new Pos(x, y));
        x++;
    }
    y++;
}

console.log('min', min.toString(), 'max', max.toString());

const printRocks = (rocks) => {
    for (let y = min.y; y <= max.y; y++) {
        let row = '';
        for (let x = min.x; x <= max.x; x++) {
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

let solidRocks = rocks.filter(rock => rock.type === '#');
let roll = rocks.filter(rock => rock.type === 'O');


let moved = true;
while (moved) {
    moved = false;
    for (let rock of roll) {
        let below = rock.pos.add(new Pos(0, -1));
        if (below.y < 0) {
            continue;
        }
        if (!rocks.some(r => r.pos.equals(below))) {
            rock.pos = new Pos(below.x, below.y);
            moved = true;
        }
    }
}

console.log('After gravity:');
printRocks(rocks);

let part1 = 0;
for (let rock of roll) {
    part1 += max.y - rock.pos.y + 1;
}
console.log('Part 1:', part1);

test ('Part 1', () => {
    if (useExample) {
        assert.equal(part1, 136);
    } else {
        assert.equal(part1, -1);
    }
});
