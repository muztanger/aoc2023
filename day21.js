const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

let useExample = false;
if (useExample) {
    input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;
}

let G = input.split('\n').map((line) => line.split(''));



class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }

    greaterThan(other) {
        return this.x > other.x && this.y > other.y;
    }

    lessThan(other) {
        return this.x < other.x && this.y < other.y;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }
}

const max = new Pos(G[0].length, G.length);
const min = new Pos(-1, -1);

class Step {
    constructor(pos, steps) {
        this.pos = pos;
        this.steps = steps;
    }
}

// find S
for (let y = 0; y < G.length; y++) {
  for (let x = 0; x < G[y].length; x++) {
    if (G[y][x] === 'S') {
      var start = new Pos(x, y);
    }
  }
}

const dirs = {
    'U': new Pos(0, -1),
    'D': new Pos(0, 1),
    'L': new Pos(-1, 0),
    'R': new Pos(1, 0)
};

function step(starts) {
    let result = new Set();
    for (let pos of starts) {
        for (let k of Object.keys(dirs)) {
            let newPos = pos.add(dirs[k]);
            if (newPos.greaterThan(min) && newPos.lessThan(max) && G[newPos.y][newPos.x] !== '#') {
                result.add(newPos.toString());
            }
        }
    }
    return result;
}

let starts = [start];
let reached = step(starts);
let steps = 1;
let part1 = reached.size;
for (let s = 1; s < 64; s++) {
    starts = [...reached].map((s) => new Pos(...s.match(/\d+/g).map(Number)));
    reached = step(starts);
    steps++;
    part1 = reached.size;
}


// 3840 is too high
test('part1', () => {
    assert.strictEqual(3830, part1);
});

function gridValue(pos) {
    let p = new Pos(pos.x, pos.y);
    while (p.x < 0) {
        p.x += G[0].length;
    }
    p.x = p.x % G[0].length;
    while (p.y < 0) {
        p.y += G.length;
    }
    p.y = p.y % G.length;
    return G[p.y][p.x];
}

function step2(starts) {
    let found = new Set();
    let result = [];
    for (let pos of starts) {
        for (let k of Object.keys(dirs)) {
            let newPos = pos.add(dirs[k]);
            
            if (gridValue(newPos) !== '#' && !found.has(newPos.toString())) {
                found.add(newPos.toString());
                result.push(newPos);
            }
        }
    }
    return result;
}

let points = [start];
points = step2(points);
steps = 1;
let part2 = points.length;
var seen = [];
var results = [];
let moop = 0;
for (let s = 1; s < 26501365; s++) {
    points = step2(points);
    steps++;
    part2 = points.length;
    console.log(s, part2);
    let reachedCount = reached.size;
    if (seen.includes(reachedCount)) {
        break;
    }
    seen.push(reachedCount);
    results.push(part2);
    if (seen.length > 2) {
        seen.shift();
    }
}
// 15567 is too low
console.log(results.join(','));
part2 = results[results.length - 1];
