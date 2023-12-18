const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
let useExample = false;

let example = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

if (useExample) {
    input = example;
}

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }
}

const directions = {
    U: new Pos(0, -1),
    D: new Pos(0, 1),
    L: new Pos(-1, 0),
    R: new Pos(1, 0),
};

let digPlan = [];
for (let line of input.split('\n')) {
    let [dir, len, color] = line.split(' ');
    digPlan.push({ dir, len: parseInt(len), color });
}
console.log(digPlan);

const start = new Pos(0, 0);
let pos = new Pos(0, 0);
let trench = [];
let min = new Pos(0, 0);
let max = new Pos(0, 0);
for (let i = 0; i < digPlan.length; i++) {
    let { dir, len, color } = digPlan[i];
    for (let j = 0; j < len; j++) {
        pos = new Pos(pos.x + directions[dir].x, pos.y + directions[dir].y);
        min.x = Math.min(min.x, pos.x);
        min.y = Math.min(min.y, pos.y);
        max.x = Math.max(max.x, pos.x);
        max.y = Math.max(max.y, pos.y);
        trench.push({ pos, color });
    }
}

console.log("min,max: ", min, max);

pos = trench.filter(t => t.pos.y == min.y).sort((a, b) => a.pos.x - b.pos.x)[0].pos;
pos = pos.add(directions.D).add(directions.R);

// for (let y = min.y; y <= max.y; y++) {
//     let line = '';
//     for (let x = min.x; x <= max.x; x++) {
//         if (trench.find(t => t.pos.x == x && t.pos.y == y)) {
//             line += '#';
//         } else if (pos.x == x && pos.y == y) {
//             line += 'S';
//         } else {
//             line += '.';
//         }
//     }
//     console.log(line);
// }

console.log(pos);

let interior = [];
let queue = [pos];
let loop = 0;
while (queue.length > 0) {
    loop++;
    let pos = queue.shift();
    if (!trench.find(t => t.pos.x == pos.x && t.pos.y == pos.y)) {
        interior.push(pos);
    }
    let left = pos.add(directions.L);
    if (!interior.find(i => i.x == left.x && i.y == left.y) && !trench.find(t => t.pos.x == left.x && t.pos.y == left.y) && !queue.find(q => q.x == left.x && q.y == left.y)) {
        queue.push(left);
    }
    let right = pos.add(directions.R);
    if (!interior.find(i => i.x == right.x && i.y == right.y) && !trench.find(t => t.pos.x == right.x && t.pos.y == right.y) && !queue.find(q => q.x == right.x && q.y == right.y)) {
        queue.push(right);
    }
    let up = pos.add(directions.U);
    if (!interior.find(i => i.x == up.x && i.y == up.y) && !trench.find(t => t.pos.x == up.x && t.pos.y == up.y) && !queue.find(q => q.x == up.x && q.y == up.y)) {
        queue.push(up);
    }
    let down = pos.add(directions.D);
    if (!interior.find(i => i.x == down.x && i.y == down.y) && !trench.find(t => t.pos.x == down.x && t.pos.y == down.y) && !queue.find(q => q.x == down.x && q.y == down.y)) {
        queue.push(down);
    }
    if (queue.length > 1000) {
        console.log("STOPPING");
        console.log("queue: ", [...queue].sort((a, b) => a.x - b.x).sort((a, b) => a.y - b.y));
        break;
    }
}

console.log("interior: ", interior.length);
console.log("trench: ", trench.length);
console.log("part1: ", trench.length + interior.length);

// for (let y = min.y; y <= max.y; y++) {
//     let line = '';
//     for (let x = min.x; x <= max.x; x++) {
//         if (trench.find(t => t.pos.x == x && t.pos.y == y)) {
//             line += '#';
//         } else if (interior.find(i => i.x == x && i.y == y)) {
//             line += 'I';
//         } else {
//             line += '.';
//         }
//     }
//     console.log(line);
// }